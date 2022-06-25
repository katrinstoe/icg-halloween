import Vector from './vector';
import Intersection from './intersection';
import Ray from "./ray";

/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * @param color The colour of the intersected object
 * @param intersection The intersection information
 * @param lightPositions The light positions
 * @param shininess The shininess parameter of the Phong model
 * @param cameraPosition The position of the camera
 * @return The resulting colour
 */
export default function phong(
  color: Vector, intersection: Intersection,
  lightPositions: Array<Vector>, shininess: number,
  cameraPosition: Vector
): Vector {
  const lightColor = new Vector(0.8, 0.8, 0.8, 0);
  const kA = 0.8;
  const kD = 0.5;
  const kS = 0.5;
  // TODO

  let p = intersection.point;
  let n = intersection.normal;
  let s = new Ray(p, lightPositions[0].sub(p));
  let l = s.direction
  let v = cameraPosition;


  //berechnung r
  let skalarSN = s.direction.dot(n)
  let n_length = n.length
  let s_length = s.direction.length
  let quotient = (skalarSN) / (n_length*s_length)

  let r = n.sub(l).mul(2* n.dot(l))

//ambient lighting = k_a*L^a
  let ambientLighting = lightColor.length * kA;
  let f_lambertian = Math.max(0.0, n.dot(l))*kD
  let specular = kS*Math.pow(Math.max(0.0, r.dot(v)), shininess)

  let phong = ambientLighting+ f_lambertian + specular

  return color.mul(specular);
}