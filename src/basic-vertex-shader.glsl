attribute vec3 a_position;
// TODO
//farbe aus js scenen graph übergeben, eher nich attribute als typ
//wie tausche ich daten zwischen vertex und fragment shader aus
varying out vec3 color;
//nur für transformationen
uniform mat4 M;


void main() {
  gl_Position = M*vec4(a_position, 1.0);
  // TODO
  //hier farbe weitergeben
  color = color;

}
