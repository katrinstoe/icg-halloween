import Intersection from "./intersection";
import Vector from "./vector";
import Ray from "./ray";

export default interface geometryObject {
    intersect(ray: Ray): Intersection | null
    color: Vector
}