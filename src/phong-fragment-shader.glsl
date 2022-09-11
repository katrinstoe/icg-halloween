precision mediump float;

// Receive color and position values
// TODO
varying vec3 vColor;
varying vec3 v_normal;
varying vec3 vPosition;
varying vec3 vlightPositions[3];
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;
//varying vec2 v_texCoord;
//varying float textureSample;

//uniform sampler2D sampler;
//lichtstrahl => auftreffpunkt
//vec3 texPhongColor;

const float shininess = 16.0;
const float kA = 0.3;
//const float kD = 0.6;
//const float kS = 0.7;

//uniform float u_time = 0.1;

void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // Phong lighting calculation
  // TODO
  //gl_FragColor = vec4(vColor, 1.0);
//  vPosition.x = sin(u_time) + cos(u_time*2.1);
//  vPosition.y = cos(u_time) + sin(u_time*1.6);
//
//  float lightPos = 0.0;
//  lightPos += 0.1 * (abs(sin(u_time)) + 0.1)/length/vPosition;
//    if(textureSample != 1.0){
//      texPhongColor = vec3(texture2D(sampler, v_texCoord.st));
//    } else{
//      texPhongColor = vColor;
//    }
//Quelle: https://www.youtube.com/watch?v=95WAAYsOifQ
  vec3 ambient = vkA*vColor;
  vec3 totalDiffuse = vec3(0.0);
  vec3 totalSpecular= vec3(0.0);

for(int i=0; i<3; i++){
  vec3 l = normalize(vlightPositions[i] - vPosition);
  vec3 v = normalize(-vPosition);
  vec3 r= normalize(reflect(-l, v_normal));
  vec3 n = normalize(v_normal);

  totalDiffuse += vColor * max(0.0, dot(n, l))*vkD;
  totalSpecular += vColor * pow(max(0.0, dot(r, v)), vshininess)* vkS;
}
//  totalDiffuse = max(totalDiffuse, 0.02);
//  totalSpecular = max(totalSpecular, 0.02);
  vec3 phong = totalDiffuse+ totalSpecular+ ambient;
  gl_FragColor = vec4(phong, 1.0);
}
