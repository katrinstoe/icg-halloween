attribute vec3 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_normal;
//attribute vec4 a_light_positions;


varying vec2 v_texCoord;
varying vec3 v_normal;
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;
varying vec3 vlightPositions[3];
varying vec3 vPosition;

vec3 lightPositions[3];
uniform vec3 lightPositions1;
uniform vec3 lightPositions2;
uniform vec3 lightPositions3;

uniform mat4 M;
uniform mat4 V;
uniform mat4 N;
uniform mat4 P;
uniform float shininess;
uniform float kS;
uniform float kD;
uniform float kA;

void main() {
    gl_Position = P * V * M * vec4(a_position, 1.0);

    //  vlightPositions = vec3(a_light_positions);
    lightPositions[0] = vec3(lightPositions1);
    lightPositions[1] = vec3(lightPositions2);
    lightPositions[2] = vec3(lightPositions3);

    for (int i= 0; i<3; i++){
        vlightPositions[i] = vec3(lightPositions[i]);
    }

    vshininess = shininess;
    vkS = kS;
    vkD = kD;
    vkA = kA;

    v_texCoord = a_texCoord;
    vPosition = vec3(V * M * vec4(a_position, 1.0));

    v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
