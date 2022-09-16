precision mediump float;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix

varying vec3 v_normal;
varying vec3 vColor;
varying vec3 vPosition;

/**
* Nehmen Werte aus Buffern und direkt aus Visitorn entgegen und verarbeiten weiter
* berechnen normalen transformiert in richtige Koordinatensystem und Position im World Koordinatensystem
* Farbwert wird aus Buffer varying Var gegeben um an Fragment shader gepassed zu werden
*/

void main() {
  gl_Position = P * V * M * vec4(a_position, 1.0);
  vColor = a_color;

  vPosition = vec3(V * M * vec4(a_position, 1.0));
  v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
