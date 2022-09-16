attribute vec3 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_normal;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 vPosition;

uniform mat4 M;
uniform mat4 V;
uniform mat4 N;
uniform mat4 P;

/**
* Nehmen Werte aus Buffern und direkt aus Visitorn entgegen und verarbeiten weiter
* berechnen normalen transformiert in richtige Koordinatensystem und Position im World Koordinatensystem
* Farbwert der Textur wird aus Buffer varying Var gegeben um an Fragment shader gepassed zu werden
*/

void main() {
    gl_Position = P * V * M * vec4(a_position, 1.0);

    v_texCoord = a_texCoord;
    vPosition = vec3(V * M * vec4(a_position, 1.0));

    v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
