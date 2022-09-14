import Sphere from "../src/Geometry/RayGeometry/sphere";
import Vector from "../src/mathOperations/vector";
import Ray from "../src/RayTracing/ray";
import Intersection from "../src/RayTracing/intersection";
import Camera from "../src/Camera/camera";

describe(".intersect() calculates intersection with Rays", ()=>{
    let sphere: Sphere
    let ray
    let lightPositions = [
        new Vector(1,0,0,0)
    ]

    const camera = new Camera(new Vector(0, 0, 0, 1),
        new Vector(0, 0, 0, 1),
        new Vector(0, 0, -1, 1),
        new Vector(0, 1, 0, 0),
        60, 0.1, 100, 1000, 1000, 0, 0, 0, 0, lightPositions)

    beforeEach(()=>{
        sphere = new Sphere(
            new Vector(0, 0, -1, 1),
            0.4,
            new Vector(0, 0, 0, 1)
        );
    })

    test(`returns null if no intersection with ray`, ()=>{
        ray = Ray.makeRay(0,0, camera);
        let intersection = sphere.intersect(ray);
        expect(intersection).toBeNull()
    })

    test(`Middle of screen should have intersection`, ()=>{
        ray = Ray.makeRay(Math.round(camera.width/2), Math.round(camera.height/2), camera);
        let intersection = sphere.intersect(ray);
        expect(intersection).toBeInstanceOf(Intersection)
    })


} )

