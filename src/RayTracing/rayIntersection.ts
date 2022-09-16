import Ray from "./ray";
import Vector from "../mathOperations/vector";
import Intersection from "./intersection";
//https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/ray-triangle-intersection-geometric-solution

export function intersectTriangle(ray: Ray, v0: Vector, v1: Vector, v2: Vector): Intersection | null {

    let v0v1 = v1.sub(v0);
    let v0v2 = v2.sub(v1);

    //Berechnung der normale zum Dreieck
    let N = v0v1.cross(v0v2).normalize();
    let area2 = N.length;
    let Ndotdir = N.dot(ray.direction)

    //Wenn normale und ray.direction orthogonal keine Intersection
    if (Math.abs(Ndotdir) < Number.EPSILON) {
        return null;
    }
    // compute d parameter using equation 2
    // let d = v0.dot(N.mul(-1));
    let d = -N.dot(v0);
    let addedVec = N.dot(ray.origin);
    let t = -((addedVec+d)/(N.dot(ray.direction)));

    //check ob das Dreieck hinter dem Ray ist

    if (t < 0) {
        return null;
    }

    //Schnittpunkt mit Ebene berechnen
    let P = ray.origin.add(ray.direction.mul(t));
    let C;

    //Inside-outside-test
    //edge 0
    let edge0 = v1.sub(v0);
    let vp0 = P.sub(v0);
    C = edge0.cross(vp0);

    if (N.dot(C) < 0) {
        return null;
    }

    //edge1
    let edge1 = v2.sub(v1);
    let vp1 = P.sub(v1);

    C = edge1.cross(vp1);

    if (N.dot(C) < 0) {
        return null;
    }

    //edge2
    let edge2 = v0.sub(v2);
    let vp2 = P.sub(v2);
    C = edge2.cross(vp2);

    if (N.dot(C) < 0) {
        return null;
    }

    return new Intersection(t, P, N);
}