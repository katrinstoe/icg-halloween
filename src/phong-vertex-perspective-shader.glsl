precision mediump float;

attribute vec3 a_position;
attribute vec3 a_normal;

// Pass color as attribute and forward it
// to the fragment shader
// TODO
attribute vec3 a_color;
//attribute vec4 a_light_positions[8];
//attribute vec2 a_texCoord;


uniform float textureSampleYes;
uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N; // normal matrix
vec3 lightPositions[3];
uniform vec3 lightPositions1;
uniform vec3 lightPositions2;
uniform vec3 lightPositions3;

uniform float shininess;
uniform float kS;
uniform float kD;
uniform float kA;


//varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 vColor;
varying vec3 vPosition;
varying vec3 vlightPositions[3];
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;
varying float textureSample;

// Pass the vertex position in view space
// to the fragment shader
// TODO


void main() {
  gl_Position = P * V * M * vec4(a_position, 1.0);
  
  // Pass the color and transformed vertex position through
  // TODO
  vColor = a_color;
//  v_texCoord = a_texCoord;
  textureSample = textureSampleYes;

  //  vlightPositions = vec3(a_light_positions);
//vlightPositions = lightPositions;
    lightPositions[0] = vec3(lightPositions1);
    lightPositions[1] = vec3(lightPositions2);
    lightPositions[2] = vec3(lightPositions3);

  for(int i= 0; i<3; i++){
      vlightPositions[i] = vec3(lightPositions[i]);
  }

  vshininess = shininess;
  vkS = kS;
  vkD = kD;
  vkA = kA;

  vPosition = vec3(V * M * vec4(a_position, 1.0));
  v_normal = normalize((V * N * vec4(a_normal, 0)).xyz);
}
