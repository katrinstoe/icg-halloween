import Vector from './vector';
import Ray from './ray';
import Intersection from './intersection';

/**
 * Class representing an axis aligned box
 */
export default class AABox {
    /**
     * The box's vertices
     */
    // vertices: Array<number>;
    vertices: Array<Vector>
    /**
     * The indices of the vertices that
     * together form the faces of the box
     */
    indices: Array<number>;

    triangles: Vector[] = []
    intersection: Intersection;


    // color: Vector;


    /**
     * Creates an axis aligned box
     * @param minPoint The minimum Point
     * @param maxPoint The maximum Point
     * @param color The colour of the cube
     */
    constructor(public minPoint: Vector, public maxPoint: Vector, public color: Vector) {
        /*
          7----6
         /|   /|   2 = maxPoint
        3----2 |   4 = minPoint
        | 4--|-5   Looking into negative z direction
        |/   |/
        0----1
         */
        //in dreiecke umschreiben
        this.vertices = [
            new Vector(minPoint.x, minPoint.y, maxPoint.z, 1),
            new Vector(maxPoint.x, minPoint.y, maxPoint.z, 1),
            new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1),
            new Vector(minPoint.x, maxPoint.y, maxPoint.z, 1),
            new Vector(minPoint.x, minPoint.y, minPoint.z, 1),
            new Vector(maxPoint.x, minPoint.y, minPoint.z, 1),
            new Vector(maxPoint.x, maxPoint.y, minPoint.z, 1),
            new Vector(minPoint.x, maxPoint.y, minPoint.z, 1)
        ];
      // this.vertices =[
      //   minPoint.x, minPoint.y, maxPoint.z,
      //   maxPoint.x, minPoint.y, maxPoint.z,
      //   maxPoint.x, maxPoint.y, maxPoint.z,
      //   minPoint.x, maxPoint.y, maxPoint.z,
      //   minPoint.x, minPoint.y, minPoint.z,
      //   maxPoint.x, minPoint.y, minPoint.z,
      //   maxPoint.x, maxPoint.y, minPoint.z,
      //   minPoint.x, maxPoint.y, minPoint.z
      // ]
        this.indices = [
            0, 1, 2, 3,
            1, 5, 6, 2,
            4, 0, 3, 7,
            3, 2, 6, 7,
            5, 4, 7, 6,
            0, 4, 5, 1
        ];
        this.color = color;

    }

    /**
     * Calculates the intersection of the AAbox with the given ray
     * @param ray The ray to intersect with
     * @return The intersection if there is one, null if there is none
     */
    intersect(ray: Ray): Intersection | null {
        let centerCube = new Vector((this.minPoint.x + this.maxPoint.x) / 2, (this.minPoint.y + this.maxPoint.y) / 2, (this.minPoint.z + this.maxPoint.z) / 2, 1)
        for (let j = 0; j < this.vertices.length / 3; j++) {
            let intersection = this.intersectTriangle(ray, this.vertices[j], this.vertices[j+1], this.vertices[j+2])

            if (intersection === null || intersection.t<this.minPoint.x) {

                if (intersection != null){

                    this.minPoint.x = intersection.t

                }

                this.intersection = intersection;

            }
        }
        if (this.intersection) {

            return this.intersection;

        }

        return null;
    }
    intersectTriangle(ray: Ray, v0: Vector, v1: Vector, v2: Vector): Intersection | null {

        let min = this.vertices[4]
        let max = this.vertices[2]

        let tmin = (min.x - ray.origin.x) / ray.direction.x;
        ;
        let tmax = (max.x - ray.origin.x) / ray.direction.x;

        if (tmin > tmax) {
            //swap tmax and tmin
            let temp = tmin;
            tmin = tmax;
            tmax = temp;
        }

        let tymin = (min.y - ray.origin.y) / ray.direction.y;
        let tymax = (max.y - ray.origin.y) / ray.direction.y;

        if (tymin > tymax) {
            //swap tmax and tmin
            let temp = tymin;
            tymin = tymax;
            tymax = temp;
        }

        if (tymin > tymax || tymin > tmax) {
            return null
        }

        if (tymin > tmin)
            tmin = tymin;

        if (tymax < tmax)
            tmax = tymax;

        let tzmin = (min.z - ray.origin.z) / ray.direction.z;
        let tzmax = (max.z - ray.origin.z) / ray.direction.z;

        if (tzmin > tzmax) {
            let temp = tzmin;
            tzmin = tzmax;
            tzmax = temp;
        }

        if ((tmin > tzmax) || (tzmin > tmax)) {
            return null;
        }

        if (tzmin > tmin)
            tmin = tzmin;

        if (tzmax < tmax)
            tmax = tzmax;

        let d = new Vector(...ray.direction.data).normalize();
        let intersectionPoint = ray.origin.add(d.mul(tmin))
        intersectionPoint.w = 1;

        return new Intersection(tmin, intersectionPoint, new Vector(0, 0, 0, 1))

        //   for (let i = 0; i < this.triangles.length; i+=3) {
        //     let v0 = this.triangles[i]
        //     let v1 = this.triangles[i+1]
        //     let v2 = this.triangles[i+2]
        //
        //     let v0v1 = v1.sub(v0);
        //     let v0v2 = v2.sub(v1);
        //
        //     //Berechnung der normale zum Dreieck
        //     let N = v0v1.cross(v0v2).normalize();
        //
        //     let Ndotdir = N.dot(ray.direction)
        //
        //     //Wenn normale und ray.direction orthogonal keine Intersection
        //     if (Math.abs(Ndotdir) > Number.EPSILON) {
        //       return null;
        //     }
        //
        //     let D = N.cross(v0);
        //
        //     let t = -(N.cross(ray.origin).add(D)) / N.dot(ray.direction);
        //
        //     //check ob das Dreieck hinter dem Ray ist
        //     if (t < 0) {
        //       return null;
        //     }
        //
        //     //Schnittpunkt mit Ebene berechnen
        //     let P = ray.origin.add(ray.direction.mul(t));
        //
        //     let C;
        //
        //     //Inside-outside-test
        //     let edge0 = v1.sub(v2);
        //     let vp0 = P.sub(v0);
        //     C = edge0.cross(vp0);
        //     if (N.dot(C) < 0) {
        //       return null;
        //     }
        //
        //     let edge1 = v2.sub(v1);
        //     let vp1 = P.sub(v1);
        //     C = edge0.cross(vp1);
        //     if (N.dot(C) < 0) {
        //       return null;
        //     }
        //
        //     let edge2 = v0.sub(v2);
        //     let vp2 = P.sub(v0);
        //     C = edge0.cross(vp0);
        //     if (N.dot(C) < 0) {
        //       return null;
        //     }
        //     return new Intersection(t, P, N);
        //   }
        // }
    }
}