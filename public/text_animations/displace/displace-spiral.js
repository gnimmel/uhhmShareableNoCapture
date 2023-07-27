
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
  if (color.a < 0.6) discard;

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
  vec2 displacement = abs(toCenter) * 1.9;

  // Add a jiggle motion.
  displacement.x += sin(uTime * 10.0 + toCenter.y * 4.0) * 0.08;
  displacement.y += cos(uTime * 5.0 + toCenter.x * 4.0) * 0.08;

  // Add the displacement to the original texture coordinate.
  // Squaring the length for a concave magnification effect.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);

  // If the alpha value is less than a small threshold, discard the fragment.
  if (color.a < 0.6) discard;

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
  if (color.a < 0.6) discard;

  gl_FragColor = color;
}
`;


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
  float displacement = length(toCenter) * 1.0;

  // Add a jiggle motion.
  //vec2 jiggle;
  //jiggle.x = sin(uTime * 10.0 + vTexCoord.y * 3.1415) * 0.06;
  //jiggle.y = cos(uTime * 8.0 + vTexCoord.x * 3.1415) * 0.06;
  //displacement += length(jiggle);

  // Add the displacement to the original texture coordinate.
  // Squaring the length for a concave magnification effect.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  //vec4 color = texture2D(uTexture, distortedTexCoord);
  vec4 color = texture2D(uTexture, vec2(distortedTexCoord.x, 1.0 - distortedTexCoord.y));

  // If the alpha value is less than a small threshold, discard the fragment.
  if (color.a < 0.6) discard;

  gl_FragColor = color;
}
`;

let fragmentConcave = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount, stronger towards the edges.
  float displacement = dot(toCenter, toCenter);

  // Apply the displacement only to the pixels that are further away from the center.
  // The displacement remains 0 in the region from the center to 0.2, and then increases dramatically.
  displacement *= pow(smoothstep(0.4, 0.6, length(toCenter)), 0.9);

  // The displacement vector is subtracted from the original texture coordinate.
  vec2 distortedTexCoord = vTexCoord - displacement * toCenter;

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);
  if (color.a < 0.6) discard;

  // Use the alpha channel of the color to control its transparency
  gl_FragColor = vec4(color.rgb, color.a);
}
`;

let fragmentConcave_stretch = `
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;
  vec2 toCenter = vec2(0.5) - uv;

  // adjust for square aspect ratio
  toCenter.x *= 1.0;

  float radius = length(toCenter);
  vec2 radialDir = normalize(toCenter);

  // Apply the displacement only to the pixels that are further away from the center.
  float displacement = pow(smoothstep(0.5, 0.6, radius), 1.0);

  // Magnify the texture at the edges by scaling the texture coordinates about the center
  uv = 0.7 + (uv - 0.7) * (1.0 + displacement);

  // Subtract the displacement from the original texture coordinate for the bending effect.
  vec2 distortedTexCoord = uv - displacement * radialDir;

  // Clamp the texture coordinates to the valid range [0, 1]
  distortedTexCoord = clamp(distortedTexCoord, 0.0, 1.0);

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, distortedTexCoord);
  if (color.a < 0.6) discard;

  // Use the alpha channel of the color to control its transparency
  gl_FragColor = vec4(color.rgb, color.a);
}
`;

// if (color.a < 0.6) discard;


let x, y;
let myFont;
let video;
let shaderProgram;
let graphics, graphicsText2D;
let aspectRatio;
let isPaused = false;
let startPauseTime;
let pauseDuration = 1000;
let yStep = 35;

function preload() {
  video = createVideo(['/public/videos/23_Competitive_FFFFFF_Spiral.mp4']);
  myFont = loadFont('/public/fonts/PPMori-Regular.otf');  // Use a local font file
}

function setup() {
  createCanvas(1080, 1920, WEBGL);
  
  graphics = createGraphics(width, height, WEBGL);  // Create a 2D graphics for text
  //graphics.textFont(myFont);  // Set the font
  //graphics.noStroke();
  graphicsText2D = createGraphics(width, height);  // Create a 2D graphics for text
  graphicsText2D.textFont(myFont);  // Set the font
  graphicsText2D.noStroke();

  video.volume(0);  
  video.loop();
  video.hide();
  //video.play();

  shaderProgram = createShader(vertexShader, fragmentConcave);
  shader(shaderProgram);  // Apply the shader to the main canvas
  
  x = graphics.width / 2;
  y = graphics.height / 2;

  aspectRatio = width / width;
}

function draw() {
  clear();
  background(220);
  
  
  image(video, -width/2, -height/2, width, height);

  //graphics.background(0, 0, 0, 0);  // Ensure the background is transparent
  graphicsText2D.clear();
  graphicsText2D.fill(255);
  graphicsText2D.textSize(88);
  graphicsText2D.textLeading(86);
  graphicsText2D.textAlign(CENTER, CENTER);
  graphicsText2D.text('Hello, world!\nLets eat tacos', x, y);
  
  if (!isPaused) {
    if (y > height*0.5 && y < (height*0.5)+yStep) {
      isPaused = true;
      startPauseTime = millis();
    }else {
      y = y + yStep;
    }
  } else {
    if (millis() > startPauseTime + pauseDuration) {
      isPaused = false;
      y = y + yStep;
    }
  }
  
  if (y > height) {
    y = 0;
  }

  graphics.clear();
  graphics.image(graphicsText2D, -graphicsText2D.width/2, -graphicsText2D.height/2);
  //graphics.image(graphicsText2D, 0, 0);

  shaderProgram.setUniform('uTexture', graphics);  // Pass the HTMLCanvasElement to the shader
  shaderProgram.setUniform('uTime', millis() / 1000.0);

  //texture(graphics);
  //plane(graphics.width, graphics.height);

  //texture(graphics);
  //rect(-width/2, -height/2, graphics.width, graphics.height);

  /*beginShape(TRIANGLES);
  vertex(-1, -aspectRatio, 0, 0, 0);  // Changed texture y-coordinate from 1 to 0
  vertex(1, -aspectRatio, 0, 1, 0);   // Changed texture y-coordinate from 1 to 0
  vertex(1, aspectRatio, 0, 1, 1);    // Changed texture y-coordinate from 0 to 1
  vertex(1, aspectRatio, 0, 1, 1);    // Changed texture y-coordinate from 0 to 1
  vertex(-1, aspectRatio, 0, 0, 1);   // Changed texture y-coordinate from 0 to 1
  vertex(-1, -aspectRatio, 0, 0, 0);  // Changed texture y-coordinate from 1 to 0
  endShape();*/

  beginShape(TRIANGLES);
  vertex(-1, -aspectRatio, 0, 0, 1);
  vertex(1, -aspectRatio, 0, 1, 1);
  vertex(1, aspectRatio, 0, 1, 0);
  vertex(1, aspectRatio, 0, 1, 0);
  vertex(-1, aspectRatio, 0, 0, 0);
  vertex(-1, -aspectRatio, 0, 0, 1);
  endShape();

  /*beginShape(TRIANGLES);
  vertex(-1, -1, 0, 0, 1);
  vertex(1, -1, 0, 1, 1);
  vertex(1, 1, 0, 1, 0);
  vertex(1, 1, 0, 1, 0);
  vertex(-1, 1, 0, 0, 0);
  vertex(-1, -1, 0, 0, 1);
  endShape();*/
  
  //plane(width, width);  // Draw a plane that covers the whole canvas
  //image(graphics, -graphics.width/2, -graphics.height/2);
  //image(graphicsText2D, (width-graphicsText2D.width)/2, (height-graphicsText2D.height)/2);
  //image(graphicsText2D, 0, 0);
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