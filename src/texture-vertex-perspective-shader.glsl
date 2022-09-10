attribute vec3 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_normal;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;
varying float textureSample;
varying vec3 vlightPositions[8];
varying vec3 vPosition;



uniform float textureSampleYes;
uniform vec3 lightPositions[8];
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

    textureSample = textureSampleYes;

    //  vlightPositions = vec3(a_light_positions);
    for (int i=0; i<8; i++){
        vlightPositions[i] = lightPositions[i];
    }

    vshininess = shininess;
    vkS = kS;
    vkD = kD;
    vkA = kA;

    v_texCoord = a_texCoord;
    vPosition = vec3(V * M * vec4(a_position, 1.0));

    v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
