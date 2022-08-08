import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Sphere from "./sphere";
import Vector from "./vector";
import Ray from "./ray";
import Intersection from "./intersection";
import phong from "./phong";
import RayVisitor from './rayvisitor';
import {GroupNode, SphereNode} from "./nodes";
import {Rotation, Scaling, Translation} from "./transformation";

let theCanvas: HTMLCanvasElement;

function reply_click(clicked_id: any)
{
    alert(clicked_id);
    if (clicked_id == "rayTracerBtn"){
        theCanvas = document.getElementById("raytracer") as HTMLCanvasElement;
    }
    else {
        theCanvas = document.getElementById("rasterizer") as HTMLCanvasElement;
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    //create
    const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
    const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 0)
    const gn = new GroupNode(gnRotation);
    sg.add(gn);

    const gnS = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    gn.add(gnS);
    gnS.add(new SphereNode(new Vector(1, 0.9, 0.1, 1)));


    const gnE = new GroupNode(new Scaling(new Vector(0.35,0.35,0.35,0.35)))
    const gnEt = new GroupNode(new Translation(new Vector(3.5,0,0,0)));
    gnE.add(gnEt)
    gnEt.add(new SphereNode(new Vector(0.05, 0.35, 0.2, 1)));
    gnS.add(gnE);

    const gnM = new GroupNode(new Scaling(new Vector(0.8, 0.8, 0.8, 0.8)));
    const gnMt = new GroupNode(new Translation(new Vector(6,0,0,0)));
    gnM.add(gnMt);
    gnM.add(new SphereNode(new Vector(0.2, 0.15, 0.2, 1)));
    gnE.add(gnM);




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

});
