#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

//precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount.
  float displacement = length(toCenter) * 4.5;

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
  if (color.a < 0.6) discard;

  gl_FragColor = color;
}