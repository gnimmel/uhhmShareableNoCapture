import BaseAnimation from '/text_animations/BaseAnimation.js';

class SlideAnimation extends BaseAnimation {
  constructor(p, font, arrLyrics, textColor) {
    super(p, font, arrLyrics, textColor);

    //this.font = font;
    //this.sentences = arrLyrics.flat();
    this.currentSentence = 0;
    this.animatingIn = false; 
    this.animatingOut = false; 
    this.animationStartTime = 0;
    this.baseTimePerLine = 700; 
    this.timeIncreasePerLineIn = 50; 
    this.timeIncreasePerLineOut = 38; 
    this.timeBetweenSentences = 1500; 
    this.delayStartTime = 0;
    this.lines = [];
    this.fontSize = 95;
    this.leading = 86;
    //this.textColor = textColor;
    this.textBoxWidth;// = this.p.width * 0.7;
    this.textX = 0;//-this.p.width / 2;
    this.textY;// = this.leading;//this.p.height / 2;
    this.p.textFont(this.font);

    this.shaderProgram;
    this.graphics;
    this.shaderGraphics;
    this.shaderHeightScale = 0.63;
  }

  setup() {
    super.setup();
    this.shaderProgram = this.p.loadShader('/text_animations/glsl/basic.vert', '/text_animations/glsl/displace-spiral.frag');

    this.fontSize = parseInt(this.p.width / (this.baseW / this.fontSize));
    this.leading = parseInt(this.p.width / (this.baseW / this.leading));
    this.textBoxWidth = this.p.width * 0.7;
    this.textY = this.leading;
    
    this.p.textSize(this.fontSize);
    this.p.textLeading(this.leading);
    this.p.noStroke();
    this.lines = this.splitIntoLines(this.sentences[this.currentSentence], this.textBoxWidth);
    this.animationStartTime = this.p.millis();
    this.delayStartTime = this.p.millis();

    this.graphics = this.p.createGraphics(this.p.width, this.p.height*this.shaderHeightScale, this.p.WEBGL);
    this.graphics.textFont(this.font);
    this.graphics.textSize(this.fontSize);
    this.graphics.textLeading(this.leading);
    this.graphics.noStroke();

    this.shaderGraphics = this.p.createGraphics(this.p.width, this.p.height*this.shaderHeightScale, this.p.WEBGL);
    this.shaderGraphics.noStroke();
    
  }

  draw() {
    super.draw();

    this.graphics.textAlign(this.p.CENTER);
    let boxHeight = this.lines.length * this.leading;
    let boxTop = this.textY - boxHeight / 2;

    this.shaderGraphics.shader(this.shaderProgram);

    this.graphics.clear();
      this.shaderGraphics.clear();

    for (let i = 0; i < this.lines.length; i++) {
      let y;
      if (this.animatingIn && this.currentSentence !== 0) 
      {
        let timePerLine = this.baseTimePerLine + (this.lines.length - 1 - i) * this.timeIncreasePerLineIn;
        let t = this.p.constrain((this.p.millis() - this.animationStartTime) / timePerLine, 0, 1);
        y = this.lerp(-this.leading - this.p.height / 2, boxTop + i * this.leading, this.easeOutCubic(t));
      } else if (this.animatingOut) 
      {
        let timePerLine = this.baseTimePerLine + (this.lines.length - 1 - i) * this.timeIncreasePerLineOut;
        let t = this.p.constrain((this.p.millis() - this.animationStartTime) / timePerLine, 0, 1);
        y = this.lerp(boxTop + i * this.leading, this.p.height/2 + this.leading, this.easeInCubic(t));
      } else 
      {
        y = boxTop + i * this.leading;
      }
      //this.p.fill(this.textColor);
      //this.p.text(this.lines[i], this.textX, y);
      
      this.graphics.fill(this.textColor);
      this.graphics.text(this.lines[i], this.textX, y);
            
      this.shaderProgram.setUniform('uTexture', this.graphics);
      this.shaderProgram.setUniform('uTime', this.p.millis() / 1000.0);
      
      this.shaderGraphics.rect(-this.p.width/2, -(this.p.height*this.shaderHeightScale)/2, this.p.width, this.p.height);

      // Draw the graphics buffer to the canvas
      this.p.image(this.shaderGraphics,-this.p.width/2, -(this.p.height*this.shaderHeightScale)/2);
    }

    if (this.animatingIn && this.p.millis() - this.animationStartTime > this.baseTimePerLine + (this.lines.length - 1) * this.timeIncreasePerLineIn) {
      this.animatingIn = false;
      this.delayStartTime = this.p.millis();
    }
  
    if (!this.animatingIn && !this.animatingOut && this.p.millis() - this.delayStartTime > this.timeBetweenSentences) {
      this.animatingOut = true;
      this.animationStartTime = this.p.millis();
    }

    if (this.animatingOut && this.p.millis() - this.animationStartTime > this.baseTimePerLine + (this.lines.length - 1) * this.timeIncreasePerLineOut) {
      this.animatingOut = false;
      this.currentSentence = (this.currentSentence + 1) % this.sentences.length;
      this.lines = this.splitIntoLines(this.sentences[this.currentSentence], this.textBoxWidth);
      this.animationStartTime = this.p.millis();
      this.animatingIn = this.currentSentence !== 0;
      this.delayStartTime = this.currentSentence === 0 ? this.p.millis() : 0;
    }
  }

  splitIntoLines(sentence, maxLineWidth) {
    let words = sentence.split(" ");
    let lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      let newLine = line + (line === "" ? "" : " ") + words[i];
      if (this.p.textWidth(newLine) > maxLineWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = newLine;
      }
    }
    lines.push(line);
    return lines;
  }

  easeInCubic(t) {
    return t * t * t;
  }

  easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  lerp(start, stop, amt) {
    return start + (stop-start) * amt;
  }
}

export default SlideAnimation;
