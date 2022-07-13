attribute vec3 a_position;
// TODO
//farbe aus js scenen graph übergeben, eher nich attribute als typ
//wie tausche ich daten zwischen vertex und fragment shader aus

attribute vec4 aVertexColor;
varying vec4 vColor;

// vertex shader ist nur für transformationen
uniform mat4 M;


void main() {
  gl_Position = M*vec4(a_position, 1.0);
  // TODO
  //hier farbe weitergeben
  vColor = aVertexColor;
}

