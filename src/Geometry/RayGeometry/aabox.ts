import Vector from '../../mathOperations/vector';
import Ray from '../../RayTracing/ray';
import Intersection from '../../RayTracing/intersection';
import {intersectTriangle} from "../../RayTracing/rayIntersection";
import Sphere from "./sphere";

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


     colorForJSON: Vector;

    //https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/ray-triangle-intersection-geometric-solution

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

        this.indices = [
            // front
            0, 1, 2, 2, 3, 0,
            // back
            4, 5, 6, 6, 7, 4,
            // right
            1, 5, 6, 6, 2, 1,
            // top
            3, 2, 6, 6, 7, 3,
            // left
            4, 0, 3, 3, 7, 4,
            // bottom
            4, 5, 1, 1, 0, 4
        ]
        this.color = color;
        this.colorForJSON = color

    }

    /**
     * Calculates the intersection of the AAbox with the given ray
     * @param ray The ray to intersect with
     * @return The intersection if there is one, null if there is none
     */
    intersect(ray: Ray): Intersection | null {

        //Wir intersecten erst mit der BoundingSphere, wenn intersection testen wir weiter, wenn nicht returnen wir null
        let intersection = this.intersectBoundingSphere(ray);
        if (!intersection){
            return null;
        }

        let nearestIntersection: Intersection;
        let min = Number.MAX_VALUE;

        //Hier testen wir mit den einzelnen Vertices der Box
        for (let i = 0; i < this.indices.length; i+=3) {
            let intersection = intersectTriangle(ray, this.vertices[this.indices[i]], this.vertices[this.indices[i+1]], this.vertices[this.indices[i+2]])
            if (intersection) {
                if (min === Number.MAX_VALUE || intersection.t < min) {
                    nearestIntersection = intersection;
                    min = intersection.t
                }
            }
        }

        if (nearestIntersection) {
            return nearestIntersection;
        }
        return null;
    }

    /**
     * Calculates the intersection of a Bounding Sphere with the given ray
     * @param ray The ray to intersect with
     * @return The intersection if there is one, null if there is none
     */
    intersectBoundingSphere(ray: Ray): Intersection | null {

        //berchnen des Mittelpunktes des Sqares
        let minPoint = new Vector(-0.5, -0.5, -0.5, 1);
        let maxPoint = new Vector(0.5, 0.5, 0.5, 1);
        let diagonal = maxPoint.sub(minPoint);
        let r = diagonal.length/2;
        let center = new Vector(0, 0, 0, 1);

        //Erstellen der bounding Sphere mit berechneten Werten
        let boundingSphere = new Sphere(center,r, new Vector(0,0,0,0));

        //Intersecten mit der Bounding Sphere, returnt intersection wenn gibt, null wenn nicht
        let intersection = boundingSphere.intersect(ray);
        if (intersection){
            return intersection;
        }
        else{
            return null;
        }
    }
}