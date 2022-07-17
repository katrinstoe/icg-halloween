precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D sampler;


void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // Read fragment color from texture
  // TODO
  gl_FragColor = texture2D(sampler, v_texCoord.st);
  gl_FragColor.a = 1.0;
}
