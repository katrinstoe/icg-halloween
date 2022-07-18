precision mediump float;
//der shader is für fragmente und farben
//hier color in gleichem wert übergeben
// TODO
varying vec3 vColor;

void main(void) {
  //gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
  // TODO
  //übergebene Farbe hinsetzen statt farbe
  gl_FragColor = vec4(vColor, 1.0);

}
