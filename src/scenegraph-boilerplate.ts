import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {GroupNode, SphereNode} from './nodes';
import RayVisitor from './rayvisitor';
import { Rotation, Scaling, Translation } from './transformation';
import Camera from "./camera";

window.addEventListener('load', () => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
    const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 0)
    const gn = new GroupNode(gnRotation);
    sg.add(gn);

    const gn1 = new GroupNode(new Translation(new Vector(1.2, .5, 0, 0)));
    gn.add(gn1);
    gn1.add(new SphereNode(new Vector(.4, 0, 0, 1)));

    const gn2 = new GroupNode(new Translation(new Vector(-0.8, 1, 1, 0)));
    gn.add(gn2);

    const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 0)));
    gn2.add(gn3);

    gn3.add(new SphereNode(new Vector(0, 0, .3, 1)));
    const shininessElement = document.getElementById("shininess") as HTMLInputElement;

    let shininessCalc = 10;
    console.log(shininessCalc)
    shininessElement.onchange = function () {
        shininessCalc = Number(shininessElement.value);
        console.log(shininessCalc)
    }
    const lightPositions = [
        new Vector(1, 1, 1, 1)
    ];
    const kS = 10;
    const kA = 10;
    const kD = 10;

   /* const camera = {
        origin: new Vector(0, 0, 0, 1),
        width: canvas.width,
        height: canvas.height,
        alpha: Math.PI / 3,
        shininess: shininessCalc,
        kS: kS,
        kD: kD,
        kA: kA
    }*/
    const camera = new Camera(new Vector(0, 0, 0, 1),
        new Vector(0, 0, 0, 1),
        new Vector(0, 0, -1, 1),
        new Vector(0, 1, 0, 0),
        60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
        kS, kD, kA)

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
});