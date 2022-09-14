import Vector from "../src/mathOperations/vector";
import Ray from "../src/RayTracing/ray";
import Camera from "../src/Camera/camera";

test("constructor has values", () => {
    const origin = new Vector(0, 0, 0, 1);
    const direction = new Vector(1, 2, 3, 0);
    let ray = new Ray(origin, direction);
    expect(ray.origin).toEqual(origin)
    expect(ray.direction).toEqual(direction)
})

describe("makeRay makes rays from origin through image pane", () => {
    let ray: Ray
    let lightPositions = [
        new Vector(1,0,0,0)
    ]

    beforeEach(() => {
        ray = Ray.makeRay(0, 0, new Camera(new Vector(0, 0, 0, 1),
            new Vector(0, 0, 0, 1),
            new Vector(0, 0, -1, 1),
            new Vector(0, 1, 0, 0),
            60, 0.1, 100, 1000, 1000, 0,
            0, 0, 0, lightPositions));
    })

    test("originVector is a point", () => {
        expect(ray.origin.w).toBe(1);
    })

    test("originVector has in x=y=z=0", ()=>{
        expect(ray.origin.data[0]).toBe(0)
        expect(ray.origin.data[1]).toBe(0)
        expect(ray.origin.data[2]).toBe(0)
    })

    test("directionVector is a vector", () => {
        expect(ray.direction.w).toBe(0)
    })

    test("dirctionVector is normalized", () => {
        const direction = ray.direction;
        const directionVectorLength = Math.sqrt(
            (direction.x * direction.x) +
            (direction.y * direction.y) +
            (direction.z * direction.z) +
            (direction.w * direction.w)
        );

        expect(directionVectorLength).toBeCloseTo(1, 5)
    })

    test("makeRay(0,0, {100,100,0.5}) has direction Vector with x = -0.23803...", () => {
        expect(ray.direction.x).toBeCloseTo(-0.2380348199794898, 5)
    })

    test("makeRay(0,0, {100,100,0.5}) has direction Vector with y = 0.23803...", () => {
        expect(ray.direction.y).toBeCloseTo(0.2380348199794898, 5)
    })

    test("makeRay(0,0, {100,100,0.5}) has direction Vector with z = 0.23803...", () => {
        expect(ray.direction.y).toBeCloseTo(0.2380348199794898, 5)
    })


})