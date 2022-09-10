precision mediump float;

varying vec2 v_texCoord;
//varying vec3 vColor;
varying vec3 v_normal;
varying vec3 vPosition;
varying vec3 vlightPositions[8];
varying float vshininess;
varying float vkS;
varying float vkD;
varying float vkA;

uniform sampler2D sampler;


void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // Read fragment color from texture
  // TODO
  vec3 texPhongColor = vec3(texture2D(sampler, v_texCoord.st));
  vec3 ambient = vkA*texPhongColor;
  for(int i=0; i<8; i++){
    vec3 l = normalize(vlightPositions[i] - vPosition);
    vec3 v = normalize(-vPosition);
    vec3 r= normalize(reflect(-l, v_normal));
    vec3 n = normalize(v_normal);

    vec3 diffuse = texPhongColor * max(0.0, dot(n, l))*vkD;
    vec3 specular = texPhongColor * pow(max(0.0, dot(r, v)), vshininess)* vkS;
    vec3 phong = diffuse+ specular+ ambient;
    gl_FragColor = vec4(phong, 1.0);

    //  gl_FragColor = texture2D(sampler, v_texCoord.st);
    //  gl_FragColor.a = 1.0;
    gl_FragColor = vec4(phong, 1.0);
  }
}
