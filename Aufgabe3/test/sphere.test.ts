import Sphere from "../src/sphere";
import Vector from "../src/vector";
import Ray from "../src/ray";
import Intersection from "../src/intersection";

describe(".intersect() calculates intersection with Rays", ()=>{
    let sphere: Sphere
    let ray
    const camera = {width:1000, height:1000, alpha:Math.PI * 2 / 3}

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
