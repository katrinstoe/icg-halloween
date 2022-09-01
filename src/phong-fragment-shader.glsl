precision mediump float;

// Receive color and position values
// TODO
varying vec3 vColor;
varying vec3 v_normal;
varying vec3 vPosition;
varying vec3 vlightPositions;
varying float vshininess;

//lichtstrahl => auftreffpunkt

const float shininess = 16.0;
const float kA = 0.3;
const float kD = 0.6;
const float kS = 0.7;

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

  vec3 ambient = kA*vColor;

  vec3 l = normalize(vlightPositions - vPosition);
  vec3 v = normalize(-vPosition);
  vec3 r= normalize(reflect(-l, v_normal));
  vec3 n = normalize(v_normal);

  vec3 diffuse = vColor * max(0.0, dot(n, l))*kD;
  vec3 specular = vColor * pow(max(0.0, dot(r, v)), vshininess)* kS;
  vec3 phong = diffuse+ specular+ ambient;

  gl_FragColor = vec4(phong, 1.0);
}
