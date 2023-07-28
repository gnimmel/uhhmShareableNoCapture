precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexCoord;

void main() {
  // Calculate the vector from the current pixel to the center of the image.
  vec2 toCenter = vec2(0.5) - vTexCoord;

  // Calculate the displacement amount, stronger towards the edges.
  float displacement = dot(toCenter, toCenter) * 3.0;

  // Apply the displacement only to the pixels that are further away from the center.
  displacement *= pow(smoothstep(0.3, 0.6, length(toCenter)), 0.9);

  // The displacement vector is subtracted from the original texture coordinate.
  vec2 distortedTexCoord = vTexCoord - displacement * toCenter;

  // Read the original texture with the displaced texture coordinate.
  //vec4 color = texture2D(uTexture, distortedTexCoord);
  vec4 color = texture2D(uTexture, vec2(distortedTexCoord.x, 1.0 - distortedTexCoord.y));

  //if (color.a < 0.6) discard;

  // Use the alpha channel of the color to control its transparency
  gl_FragColor = vec4(color.rgb, color.a);
}