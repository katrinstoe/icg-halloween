precision mediump float;

uniform float shininess;
uniform float kS;
uniform float kD;
uniform float kA;

varying vec3 vColor;
varying vec3 v_normal;
varying vec3 vPosition;
uniform int lightCount;
uniform vec3 lights[8];

/**
* Phong berechnet für jedes Fragment
* variable input Values aus TS File entgegengenommen für Licht
* Iterieren mit for Loop über alle Lichtquellen, Lichtcount ist die Länge des Arrays, können das im Shader nicht selbst bestimmen müssen es als wert reingeben
*/

void main(void) {
//Quelle: https://www.youtube.com/watch?v=95WAAYsOifQ
  vec3 ambient = kA*vColor;
  vec3 totalDiffuse = vec3(0.0);
  vec3 totalSpecular= vec3(0.0);

for(int i=0; i<8; i++){
  if(i < lightCount){
    vec3 l = normalize(lights[i]- vPosition);
    vec3 v = normalize(-vPosition);
    vec3 r= normalize(reflect(-l, v_normal));
    vec3 n = normalize(v_normal);

    totalDiffuse += vColor * max(0.0, dot(n, l))*kD;
    totalSpecular += vColor * pow(max(0.0, dot(r, v)), shininess)* kS;
  }
}
  vec3 phong = totalDiffuse+ totalSpecular+ ambient;
  gl_FragColor = vec4(phong, 1.0);
}
