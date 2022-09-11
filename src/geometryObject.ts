import Intersection from "./intersection";
import Vector from "./vector";
import Ray from "./ray";
//geometryObject Interface für supaFasten rayvisitor
export default interface geometryObject {
    intersect(ray: Ray): Intersection | null
    color: Vector
}