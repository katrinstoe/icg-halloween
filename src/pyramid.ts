import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';

/**
 * A class representing a pyramid
 */
export default class Pyramid {
  /**
   * The pyramid's vertices
   */
  vertices: Array<Vector>;
  /**
   * The indices of the vertices that
   * together form the faces of the pyramid
   */
  indices: Array<number>;

  intersection: Intersection;
  /**
   * Creates a new Pyramid with center and radius
   * @param top The top corner of the Sphere
   * @param minPoint The left corner of the Sphere
   * @param maxPoint The right corner of the Pyramid
   * @param color The colour of the Sphere
   */
  constructor(public top: Vector, public minPoint: Vector, public maxPoint: Vector, public color: Vector) {
    /*
        2         2 = top
       / \        3 = minPoint
      /3--\---4   1 = maxPoint
     /     \ /
    0-------1
     */
    this.vertices = [
      new Vector(minPoint.x, minPoint.y, maxPoint.z, 1), //0
      new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1), //1
      new Vector(top.x, top.y, top.z, 1), //2
      new Vector(minPoint.x, minPoint.y, minPoint.z, 1), //3
      new Vector(maxPoint.x, minPoint.y, minPoint.z, 1), //4
    ];
    this.indices = [
      0, 1, 2, //front
      1, 4, 2, //right
      3, 4, 2, //back
      3, 0, 2, //left
      0, 4, 5, 1 //bottom
    ];
    this.color = color;

  }

  /**
   * Calculates the intersection of the pyramid with the given ray
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {
    // TODO

    let intersection = this.intersectTriangle(ray, this.vertices[0], this.vertices[1], this.vertices[2])
    if (intersection === null || intersection.closerThan(this.intersection)) {
      this.intersection = intersection;
    }

    this.intersectWithVertices(ray, 0,1,2);
    this.intersectWithVertices(ray, 1,4,2);
    this.intersectWithVertices(ray, 3,4,2);
    this.intersectWithVertices(ray, 3,0,2);
    this.intersectWithVertices(ray, 0,1,3);
    this.intersectWithVertices(ray, 1,4,3);

    if(this.intersection){
      return this.intersection;
    }
    return null;
  }

  intersectWithVertices(ray: Ray, A: number, B: number, C: number){
    let intersection = this.intersectTriangle(ray, this.vertices[A], this.vertices[B], this.vertices[C])
    if (intersection === null || intersection.closerThan(this.intersection)) {
      this.intersection = intersection;
    }
  }

  //https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/ray-triangle-intersection-geometric-solution
  intersectTriangle(ray: Ray, v0: Vector, v1: Vector, v2:Vector): Intersection | null{

    let v0v1 = v1.sub(v0);
    let v0v2 = v2.sub(v0);

    //Berechnung der normale zum Dreieck
    let N = v0v1.cross(v0v2).normalize();

    let Ndotdir = N.dot(ray.direction)

    //Wenn normale und ray.direction orthogonal keine Intersection
    if(Math.abs(Ndotdir) > Number.EPSILON){
      return null;
    }

    let D = N.cross(v0);

    let t = -(N.cross(ray.origin).add(D))/N.dot(ray.direction);

    //check ob das Dreieck hinter dem Ray ist
    if (t < 0){
      return null;
    }

    //Schnittpunkt mit Ebene berechnen
    let P = ray.origin.add(ray.direction.mul(t));

    let C;

    //Inside-outside-test
    let edge0 = v1.sub(v2);
    let vp0 = P.sub(v0);
    C = edge0.cross(vp0);
    if(N.dot(C) < 0){
      return null;
    }

    let edge1 = v2.sub(v1);
    let vp1 = P.sub(v1);
    C = edge0.cross(vp1);
    if(N.dot(C) < 0){
      return null;
    }

    let edge2 = v0.sub(v2);
    let vp2 = P.sub(v0);
    C = edge0.cross(vp0);
    if(N.dot(C) < 0){
      return null;
    }
    return new Intersection(t, P, N);
  }
}

