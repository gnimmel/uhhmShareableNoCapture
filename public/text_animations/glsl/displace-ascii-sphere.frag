precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Discard the fragment if it's outside the specified radius.
  if (length(toCenter) > 0.45) discard;  // Change this value to adjust the clipping radius

  // Calculate the displacement amount. Use a power function to reduce the effect in the center.
  float displacement = pow(length(toCenter) * 3.6, 1.6);

  // Add a jiggle motion.
  vec2 jiggle;
  jiggle.x = sin(uTime * 10.0 + vTexCoord.y * 3.1415) * 0.06;
  jiggle.y = cos(uTime * 8.0 + vTexCoord.x * 3.1415) * 0.06;
  displacement += length(jiggle);

  // Add the displacement to the original texture coordinate.
  vec2 distortedTexCoord = vTexCoord + displacement * toCenter * length(toCenter);

  // Read the original texture with the displaced texture coordinate.
  vec4 color = texture2D(uTexture, vec2(distortedTexCoord.x, 1.0 - distortedTexCoord.y));

  // If the alpha value is less than a small threshold, discard the fragment.
  //if (color.a < 0.4) discard;

  gl_FragColor = color;
}