attribute vec3 a_position;
// TODO
attribute vec3 a_color;
varying vec3 vColor;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

void main() {
  //gl_Position = P*V * M*vec4(a_position, 1.0);
  // TODO
  gl_Position = V * M * vec4(a_position, 1.0);
  vColor = a_color;
}
