precision mediump float;
//der is für fragmente und farben
//hier in gleichem wert übergeben
// TODO
varying in vec3 color;

void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // TODO
  //übergebene Farbe hinsetzen statt farbe
  gl_FragColor = color;
}
