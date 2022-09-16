precision mediump float;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 vPosition;

uniform float shininess;
uniform float kS;
uniform float kD;
uniform float kA;
uniform int lightCount;
uniform vec3 lights[8];

uniform sampler2D sampler;

/**
* Phong berechnet für jedes Fragment der Textur
* variable input Values aus TS File entgegengenommen für Licht
* Iterieren mit for Loop über alle Lichtquellen, Lichtcount ist die Länge des Arrays, können das im Shader nicht selbst bestimmen müssen es als wert reingeben
*/
void main(void) {

// Quelle: https://www.youtube.com/watch?v=95WAAYsOifQ
  vec3 texPhongColor = vec3(texture2D(sampler, v_texCoord.st));
  vec3 ambient = kA*texPhongColor;

  vec3 totalDiffuse = vec3(0.0);
  vec3 totalSpecular= vec3(0.0);
  for(int i=0; i<8; i++){
    if(i<lightCount){
      vec3 l = normalize(lights[i]- vPosition);
      vec3 v = normalize(-vPosition);
      vec3 r= normalize(reflect(-l, v_normal));
      vec3 n = normalize(v_normal);

      totalDiffuse += texPhongColor * max(0.0, dot(n, l))*kD;
      totalSpecular += texPhongColor * pow(max(0.0, dot(r, v)), shininess)* kS;
    }
  }
  vec3 phong = totalDiffuse+ totalSpecular+ ambient;
  gl_FragColor = vec4(phong, 1.0);

}
