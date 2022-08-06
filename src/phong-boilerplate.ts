import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import Sphere from './sphere';
import Ray from './ray';
import Intersection from './intersection';
import phong from './phong';
import {GroupNode, SphereNode} from "./nodes";
import { Rotation, Scaling, Translation } from './transformation';
import RayVisitor from './rayvisitor';

window.addEventListener('load', () => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    //create
    const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
    const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 0)
    const gn = new GroupNode(gnRotation);
    sg.add(gn);

    const gn1 = new GroupNode(new Translation(new Vector(1.2, .5, 0, 0)));
    gn.add(gn1);
    gn1.add(new SphereNode(new Vector(0.5, 0.1, 1, 1)));

    const gn2 = new GroupNode(new Translation(new Vector(-0.8, 1, 1, 0)));
    gn.add(gn2);
    gn2.add(new SphereNode(new Vector(0.2, 0.1, 0.9, 1)));

    const gn3 = new GroupNode(new Translation(new Vector(-1, -1, 1, 0)));
    gn.add(gn3);

    const gn31 = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 0)));
    gn3.add(gn31);

    gn3.add(new SphereNode(new Vector(0.9, 0.1, 0.3, 1)));

    const lightPositions = [
        new Vector(1, 1, -1, 1)
    ];

    const camera = {
        origin: new Vector(0, 0, 0, 1),
        width: canvas.width,
        height: canvas.height,
        alpha: Math.PI / 3
    }

    const visitor = new RayVisitor(ctx, canvas.width, canvas.height);

    let animationHandle: number;

    let lastTimestamp = 0;
    let animationTime = 0;
    let animationHasStarted = true;
    function animate(timestamp: number) {
        let deltaT = timestamp - lastTimestamp;
        if (animationHasStarted) {
            deltaT = 0;
            animationHasStarted = false;
        }
        animationTime += deltaT;
        lastTimestamp = timestamp;
        gnRotation.angle = animationTime / 2000;

        visitor.render(sg, camera, lightPositions);
        // animationHandle = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationHandle) {
            window.cancelAnimationFrame(animationHandle);
        }
        animationHasStarted = true;
        function animation(t: number) {
            animate(t);
            animationHandle = window.requestAnimationFrame(animation);
        }
        animationHandle = window.requestAnimationFrame(animation);
    }
    animate(0);

    document.getElementById("startAnimationBtn").addEventListener(
        "click", startAnimation);
    document.getElementById("stopAnimationBtn").addEventListener(
        "click", () => cancelAnimationFrame(animationHandle));

    /*function setPixel(x: number, y: number, color: Vector) {
        data[4 * (canvas.width * y + x) + 0] = Math.min(255, color.r * 255);
        data[4 * (canvas.width * y + x) + 1] = Math.min(255, color.g * 255);
        data[4 * (canvas.width * y + x) + 2] = Math.min(255, color.b * 255);
        data[4 * (canvas.width * y + x) + 3] = 255;
    }

    function animate() {
        data.fill(0);
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                const ray = Ray.makeRay(x, y, camera);
                let minIntersection = new Intersection(Infinity, null, null);
                let minObj = null;
                for (let shape of objects) {
                    const intersection = shape.intersect(ray);
                    if (intersection && intersection.closerThan(minIntersection)) {
                        minIntersection = intersection;
                        minObj = shape;
                    }
                }
                if (minObj) {
                    if (!minObj.color) {
                        setPixel(x, y, new Vector(0, 0, 0, 1));
                    } else {
                        let color = phong(
                            Object.assign(Object.create(Vector.prototype), minObj.color),
                            minIntersection, lightPositions, shininess, camera.origin);
                        setPixel(x, y, color);
                    }

                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    const shininessElement = document.getElementById("shininess") as HTMLInputElement;
    shininessElement.onchange = function () {
        shininess = Number(shininessElement.value);
        window.requestAnimationFrame(animate);
    }
    shininess = Number(shininessElement.value);

    window.requestAnimationFrame(animate);*/
});