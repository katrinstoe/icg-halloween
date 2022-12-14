import Vector from '../mathOperations/vector';
import Intersection from './intersection';

/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * Parameter werden reingegeben nicht hardgecoded um pro node individuell anpasspar raytracen zu können
 * @param color The colour of the intersected object
 * @param intersection The intersection information
 * @param kS the kS parameter of the phong model
 * @param kD the kD parameter of the phong model
 * @param kA the kA parameter of the phong model
 * @param lightPositions The light positions
 * @param shininess The shininess parameter of the Phong model
 * @param cameraPosition The position of the camera
 * @return The resulting colour
 */
export default function phong(
  color: Vector, intersection: Intersection, shininess: number,
  cameraPosition: Vector, kS: number, kD: number, kA: number, lightPositions: Array<Vector>
): Vector {
  const lightColor =color;
  let p = intersection.point;
  let n = intersection.normal.normalize();
  let v = cameraPosition.sub(p).normalize();

  let diffuse = new Vector(0,0,0,0);
  let specular = new Vector(0,0,0,0);

  let ambient = color.mul(kA);

  for (let lightPosition of lightPositions) {
    let l = lightPosition.sub(p).normalize();
    //r berechnen
    let nDotL = n.dot(l)
    let term = n.mul(nDotL)
    let mal2 = term.mul(2)
    let r = mal2.sub(l);

    diffuse =  diffuse.add(lightColor.mul(Math.max(0.0, n.dot(l))));
    specular = specular.add(lightColor.mul(Math.pow(Math.max(0.0, r.dot(v)), shininess)));
  }
  specular = specular.mul(kS)
  diffuse = diffuse.mul(kD)

  return ambient.add(diffuse).add(specular);
}
