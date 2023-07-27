
let theShader;
let video;
let graphics;
let font;
let shaderGraphics;

function preload(){
  // Load shader
  theShader = loadShader('myShader.vert', 'myShader.frag');
  
  // Load video
  video = createVideo(['08_Nostalgic_FFFFFF_ASCII.mp4']);

  // Load font
  font = loadFont('PPMori-Regular.otf'); // adjust this path to point to your font file
}

function setup() {
  // Create canvas
  createCanvas(600, 1000, WEBGL);
  noStroke();

  // Create graphics buffer
  graphics = createGraphics(width, height, WEBGL);
  shaderGraphics = createGraphics(width, height, WEBGL);
  
  // Set font
  graphics.textFont(font);
  
  // Start video
  video.volume(0);
  video.time(10);
  video.loop();
  video.hide();
}

function draw() {
  // Clear the background of the canvas
  clear();

  // Draw video to canvas
  image(video, -width/2, -height/2, width, height);

  // Draw text onto graphics buffer
  graphics.clear();
  graphics.textAlign(CENTER, CENTER);
  graphics.textSize(32);
  graphics.text('Hello World!', 0, 0);
  graphics.noStroke();
  
  shaderGraphics.clear();
  // Apply shader to graphics buffer
  shaderGraphics.shader(theShader);
  //theShader.setUniform('tex0', graphics);
  theShader.setUniform('uTexture', graphics);  // Pass the HTMLCanvasElement to the shader
  theShader.setUniform('uTime', millis() / 1000.0);
  
  shaderGraphics.rect(-width/2, -height/2, width, height);
  
  // Draw the graphics buffer to the canvas
  image(shaderGraphics,-width/2, -height/2);
}
