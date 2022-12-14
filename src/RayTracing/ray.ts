import Vector from '../mathOperations/vector';
import Camera from "../Camera/camera";

/**
 * Class representing a ray
 */
export default class Ray {
  /**
   * Creates a new ray with origin and direction
   * @param origin The origin of the Ray
   * @param direction The direction of the Ray
   */
  constructor(public origin: Vector, public direction: Vector) { }

  /**
   * Creates a ray from the camera through the image plane.
   * @param x The pixel's x-position in the canvas
   * @param y The pixel's y-position in the canvas
   * @param camera The Camera
   * @return The resulting Ray
   */
  static makeRay(x: number, y: number,camera: Camera): Ray {
    // TODO
    let origin = new Vector(0,0,0,1)
    let x_d = x-((camera.width-1)/2);
    let y_d = ((camera.height-1)/2) - y;
    let z_d = (-((camera.width/2)/Math.tan(camera.alpha/2)));
    let d = new Vector(x_d, y_d, z_d, 0).normalize();
    return new Ray(origin, d);
  }

  //orthographische Projektion
  /*static makeMouseRay(x: number, y: number, camera: { width: number, height: number, alpha: number }
  ): Ray {
    let origin = new Vector(x-((camera.width-1)/2), ((camera.height-1)/2) - y, 0, 1)
    let d = new Vector(0, 0, -1, 0).normalize();
    return new Ray(origin, d);
  }*/
}