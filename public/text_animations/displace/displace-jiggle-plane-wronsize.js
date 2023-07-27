
let fragmentShaderGood = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount.
  float displacement = length(toCenter) * 4.9;

  // Add a jiggle motion.
  displacement += sin(uTime * 10.0) * 0.06;

  // Add the displacement to the original texture coordinate.
  // Squaring the length for a concave magnification effect.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  gl_FragColor = color;
}
`;


let fragmentShaderGood_v2 = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount.
  vec2 displacement = abs(toCenter) * 4.9;

  // Add a jiggle motion.
  displacement.x += sin(uTime * 10.0 + toCenter.y * 4.0) * 0.02;
  displacement.y += sin(uTime * 10.0 + toCenter.x * 4.0) * 0.08;

  // Add the displacement to the original texture coordinate.
  // Squaring the length for a concave magnification effect.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  gl_FragColor = color;
}
`;

let fragmentShaderOK = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount. 
  float displacement = length(toCenter) * length(toCenter) * 4.2;

  // Add the displacement to the original texture coordinate.
  vec2 distortedTexCoord = mix(vTexCoord, vec2(0.5), displacement);

  // Read the original texture with the distorted texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  gl_FragColor = color;
}
`;

let fragmentShaderNO = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount. 
  // Apply the sqrt() function to make the displacement grow faster near the edges.
  float displacement = sqrt(length(toCenter)) * 0.95;

  // Add the displacement to the original texture coordinate.
  vec2 distortedTexCoord = mix(vTexCoord, vec2(0.5), displacement);

  // Read the original texture with the distorted texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  gl_FragColor = color;
}
`;

let fragmentShader = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount.
  float displacement = sqrt(length(toCenter)) * 2.2;

  // Apply a smoothstep function to only displace pixels near the edges.
  displacement *= smoothstep(0.35, 0.8, length(toCenter));

  // Add the displacement to the original texture coordinate.
  vec2 distortedTexCoord = mix(vTexCoord, vec2(0.5), displacement);

  // Read the original texture with the distorted texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  gl_FragColor = color;
}
`;

let shaderProgram;
let graphics;

// GLSL programs
let vertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 1.0);
}
`;

let fragmentShaderGood_random = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount.
  float displacement = length(toCenter) * 4.9;

  // Add a jiggle motion.
  vec2 jiggle;
  jiggle.x = sin(uTime * 10.0 + vTexCoord.y * 3.1415) * 0.06;
  jiggle.y = cos(uTime * 8.0 + vTexCoord.x * 3.1415) * 0.06;
  displacement += length(jiggle);

  // Add the displacement to the original texture coordinate.
  // Squaring the length for a concave magnification effect.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  //vec4 color = texture2D(uTexture, distortedTexCoord);
  vec4 color = texture2D(uTexture, vec2(distortedTexCoord.x, 1.0 - distortedTexCoord.y));

  // If the alpha value is less than a small threshold, discard the fragment.
  if (color.a < 0.01) discard;

  gl_FragColor = color;
}
`;

let x, y;
let myFont;

function preload() {
  myFont = loadFont('/public/fonts/PPMori-Regular.otf');  // Use a local font file
}

function setup() {
  createCanvas(800, 1100, WEBGL);
  graphics = createGraphics(800, 800);  // Create a 2D graphics for text
  graphics.textFont(myFont);  // Set the font

  shaderProgram = createShader(vertexShader, fragmentShaderGood_random);
  this.shader(shaderProgram);  // Apply the shader to the canvas
  this.noStroke();
  x = graphics.width / 2;
  y = graphics.height / 2;
}

function draw() {
  clear();
  background(220);
  fill(0,255,0);
  

  graphics.background(0, 0, 0, 0);  // Ensure the background is transparent
  graphics.clear();
  graphics.fill(255,0,0);
  graphics.textSize(40);
  graphics.textAlign(CENTER, CENTER);
  graphics.text('Hello, world!\nlets eat tacos', x, y);
  //y = y + 5;
  if (y > height) {
    y = 0;
  }

  shaderProgram.setUniform('uTexture', graphics);  // Pass the HTMLCanvasElement to the shader
  shaderProgram.setUniform('uTime', millis() / 1000.0);

  plane(width*2,width*2,500,500);
  //plane(4, 4);
}


function clearWithTransparency(g) {
  g.loadPixels();
  for (let i = 0; i < g.pixels.length; i += 4) {
    g.pixels[i] = 0;
    g.pixels[i+1] = 0;
    g.pixels[i+2] = 0;
    g.pixels[i+3] = 0;
  }
  g.updatePixels();
}