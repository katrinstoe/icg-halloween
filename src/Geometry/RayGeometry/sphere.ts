import Vector from '../../mathOperations/vector';
import Intersection from '../../RayTracing/intersection';
import Ray from '../../RayTracing/ray';
import Matrix from "../../mathOperations/matrix";
import geometryObject from "../../Visitors/geometryObject";

/**
 * A class representing a sphere
 */
export default class Sphere implements geometryObject{
  /**
   * Creates a new Sphere with center and radius
   * @param center The center of the Sphere
   * @param radius The radius of the Sphere
   * @param color The colour of the Sphere
   */
  constructor(
    public center: Vector,
    public radius: number,
    public color: Vector
  ) { }

  /**
   * Calculates the intersection of the sphere with the given ray
   * Quelle: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {
    // TODO

    let x0 = ray.origin.sub(this.center);

    let x0Squared = x0.dot(x0)
    let direction = ray.direction;
    let d = new Vector(...ray.direction.data).normalize();
    let t = - x0.dot(d) + Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));
    let t2 = - x0.dot(d) - Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));


    let shorterT;

    let c = Math.pow(x0.dot(d), 2)-x0Squared + (Math.pow(this.radius, 2))

    let amountOfIntersections;
    if (c < 0){
      amountOfIntersections = 0;
      return null;
    } else if (c == 0){
      amountOfIntersections = 1;
      shorterT = t;
    } else {
      amountOfIntersections = 2;
      if (t < t2){
        shorterT = t;
      } else shorterT = t2;
    }

    let intersectionPoint = ray.origin.add(d.mul(shorterT))
    intersectionPoint.w = 1;
    let normal = intersectionPoint.sub(this.center).normalize()
    return new Intersection(shorterT, intersectionPoint, normal)
  }

}

