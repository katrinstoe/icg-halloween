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
  const white = new Vector(1, 1, 1, 0)
  const kA = 0.8;
  const kD = 0.5;
  const kS = 0.5;

  let p = intersection.point;
  let n = intersection.normal.normalize();
  let v = cameraPosition.sub(p);

  let diffuse = new Vector(0,0,0,0);
  let specular = new Vector(0,0,0,0);
  // let specular = 0
  // let diffuse = 0

  let ambient = lightColor.mul(kA);
  // let ambient = lightColor.x * kA


  for (let lightPosition of lightPositions) {
    /*let s = new Ray(p, lightPosition.sub(p));
    let l = s.direction;*/
    let l = lightPosition.sub(p).normalize();
    let nDotL = n.dot(l)
    let term = n.mul(2 * nDotL)
    let r = term.sub(l);
    ///let r = n.sub(l).mul(2* n.dot(l))


    diffuse = diffuse.add(lightColor.mul(Math.max(0.0, n.dot(l))).mul(kD));
    specular = specular.add(white.mul(Math.max(0.0, Math.pow(r.dot(v), shininess))));
    // let diffuse2 = lightColor.x*(Math.max(0.0, n.dot(l))) *kD
    // diffuse += diffuse2
    // specular += white.x * (Math.pow(Math.max(r.dot(v), 0.0), shininess));

  }


  let specularSum = specular.mul(kS)

  let phong = ambient.add(diffuse.add(specularSum));

  return color.multiply(phong);

  // let phong = ambient + specular + diffuse
  //
  // return color.mul(phong)
}