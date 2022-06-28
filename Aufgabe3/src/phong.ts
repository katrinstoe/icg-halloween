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

  let p = intersection.point;
  let n = intersection.normal.normalize();
  let v = cameraPosition.sub(p).normalize();

  let diffuse = new Vector(0,0,0,0);
  let specular = new Vector(0,0,0,0);
  let white = new Vector(1,1,1,0)

  let ambient = lightColor.mul(kA);

  for (let lightPosition of lightPositions) {
    let l = lightPosition.sub(p).normalize();
    let nDotL = n.dot(l)
    let term = n.mul(nDotL)
    let mal2 = term.mul(2)
    let r = mal2.sub(l);

    let rDotV = r.dot(v);

    diffuse = diffuse.add(lightColor.mul(Math.max(0.0, n.dot(l))).mul(kD));
    specular = specular.add(lightColor.mul(Math.pow(Math.max(0.0, rDotV), shininess)));
  }

  let specularKS = specular.mul(kS)

  if(specularKS.length>0){
    console.log(specularKS)
  }

  let phong = ambient.add(diffuse.add(specularKS));
  //Wieso geht nicht cross
  return color.multiply(ambient.add(phong));
}
