precision mediump float;

varying vec2 v_texCoord;
//varying vec3 vColor;
varying vec3 v_normal;
varying vec3 vPosition;
varying vec3 vlightPositions[3];
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;

uniform sampler2D sampler;


void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // Read fragment color from texture
  // TODO
// Quelle: https://www.youtube.com/watch?v=95WAAYsOifQ
  vec3 texPhongColor = vec3(texture2D(sampler, v_texCoord.st));
  vec3 ambient = vkA*texPhongColor;

  vec3 totalDiffuse = vec3(0.0);
  vec3 totalSpecular= vec3(0.0);
  for(int i=0; i<3; i++){
    vec3 l = normalize(vlightPositions[i] - vPosition);
    vec3 v = normalize(-vPosition);
    vec3 r= normalize(reflect(-l, v_normal));
    vec3 n = normalize(v_normal);

    totalDiffuse += texPhongColor * max(0.0, dot(n, l))*vkD;
    totalSpecular += texPhongColor * pow(max(0.0, dot(r, v)), vshininess)* vkS;
  }
//  totalDiffuse = max(totalDiffuse, 0.2);
//  totalSpecular = max(totalSpeculal, 0.02);
  vec3 phong = totalDiffuse+ totalSpecular+ ambient;
  gl_FragColor = vec4(phong, 1.0);

}
