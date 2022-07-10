precision mediump float;

attribute vec3 a_position;
attribute vec3 a_normal;

// Pass color as attribute and forward it
// to the fragment shader
// TODO
attribute vec4 aVertexColor;
varying vec4 vColor;

uniform mat4 M;
uniform mat4 V;
uniform mat4 N; // normal matrix

varying vec3 v_normal;

// Pass the vertex position in view space
// to the fragment shader
// TODO

void main() {
  gl_Position = V * M * vec4(a_position, 1.0);
  
  // Pass the color and transformed vertex position through
  // TODO
  vColor = aVertexColor;
  v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}