import Intersection from "../RayTracing/intersection";
import Vector from "../mathOperations/vector";
import Ray from "../RayTracing/ray";
/**geometryObject Interface für supaFasten rayvisitor*/
export default interface geometryObject {
    intersect(ray: Ray): Intersection | null
    color: Vector
}