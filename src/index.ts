import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode
} from './nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from './rastervisitor';
import Shader from './shader';
import vertexShader from './basic-vertex-shader.glsl';
import fragmentShader from './basic-fragment-shader.glsl';
import { Scaling, Translation } from './transformation';

// function reply_click(clicked_id: any)
// {
//     alert(clicked_id);
//     if (clicked_id == "rayTracerBtn"){
//         theCanvas = document.getElementById("raytracer") as HTMLCanvasElement;
//     }
//     else {
//         theCanvas = document.getElementById("rasteriser") as HTMLCanvasElement;
//     }
// }

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const gn1 = new GroupNode(new Translation(new Vector(.5, .3, 0, 0)));
    sg.add(gn1);
    const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.3, 0.2, 0)));
    gn1.add(gn3);
    const sphere1 = new SphereNode(new Vector(.8, .4, .1, 1))
    gn3.add(sphere1);
    const gn2 = new GroupNode(new Translation(new Vector(-.2, -0.2, 0, 0)));
    sg.add(gn2);
    const cube = new AABoxNode(
        new Vector(1, 0, 0, 1)
    );
    gn2.add(cube);

    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl);
    setupVisitor.setup(sg);

    const shader = new Shader(gl,
        vertexShader,
        fragmentShader
    );
    // render
    const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);
    shader.load();
    visitor.render(sg, null, []);
});

    // let animationHandle: number;
    //
    // let lastTimestamp = 0;
    // let animationTime = 0;
    // let animationHasStarted = true;
    // function animate(timestamp: number) {
    //     let deltaT = timestamp - lastTimestamp;
    //     if (animationHasStarted) {
    //         deltaT = 0;
    //         animationHasStarted = false;
    //     }
    //     animationTime += deltaT;
    //     lastTimestamp = timestamp;
    //     // gnRotation.angle = animationTime / 2000;
    //
    //     visitor.render(sg, camera, lightPositions);
    //     // animationHandle = window.requestAnimationFrame(animate);
    // }
    //
    // function startAnimation() {
    //     if (animationHandle) {
    //         window.cancelAnimationFrame(animationHandle);
    //     }
    //     animationHasStarted = true;
    //     function animation(t: number) {
    //         animate(t);
    //         animationHandle = window.requestAnimationFrame(animation);
    //     }
    //     animationHandle = window.requestAnimationFrame(animation);
    // }
    // animate(0);
    //
    // document.getElementById("startAnimationBtn").addEventListener(
    //     "click", startAnimation);
    // document.getElementById("stopAnimationBtn").addEventListener(
    //     "click", () => cancelAnimationFrame(animationHandle));
    // const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
    // const ctx = canvas.getContext("2d");
    //
    // //create
    // const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
    // const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 0)
    // const gn = new GroupNode(gnRotation);
    // sg.add(gn);
    //
    // const gnS = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    // gn.add(gnS);
    // gnS.add(new SphereNode(new Vector(1, 0.9, 0.1, 1)));
    //
    //
    // const gnE = new GroupNode(new Scaling(new Vector(0.35,0.35,0.35,0.35)));
    // const gnEt = new GroupNode(new Translation(new Vector(5,0,0,0)));
    // gnE.add(gnEt)
    // gnEt.add(new SphereNode(new Vector(0.05, 0.35, 0.2, 1)));
    // gnS.add(gnE);
    //
    // const gnM = new GroupNode(new Scaling(new Vector(0.3, 0.3, 0.3, 0.3)));
    // const gnMt = new GroupNode(new Translation(new Vector(6,0,0,0)));
    // gnM.add(gnMt);
    // gnMt.add(new SphereNode(new Vector(0.2, 0.15, 0.2, 1)));
    // gnEt.add(gnM);
    //
    //
    // const lightPositions = [
    //     new Vector(1, 1, -1, 1)
    // ];
    //
    // const camera = {
    //     origin: new Vector(0, 0, 0, 1),
    //     width: canvas.width,
    //     height: canvas.height,
    //     alpha: Math.PI / 3
    // }
    //
    // const visitor = new RayVisitor(ctx, canvas.width, canvas.height);
    //
    // let animationHandle: number;
    //
    // let lastTimestamp = 0;
    // let animationTime = 0;
    // let animationHasStarted = true;
    // function animate(timestamp: number) {
    //     let deltaT = timestamp - lastTimestamp;
    //     if (animationHasStarted) {
    //         deltaT = 0;
    //         animationHasStarted = false;
    //     }
    //     animationTime += deltaT;
    //     lastTimestamp = timestamp;
    //     gnRotation.angle = animationTime / 2000;
    //
    //     visitor.render(sg, camera, lightPositions);
    //     // animationHandle = window.requestAnimationFrame(animate);
    // }
    //
    // function startAnimation() {
    //     if (animationHandle) {
    //         window.cancelAnimationFrame(animationHandle);
    //     }
    //     animationHasStarted = true;
    //     function animation(t: number) {
    //         animate(t);
    //         animationHandle = window.requestAnimationFrame(animation);
    //     }
    //     animationHandle = window.requestAnimationFrame(animation);
    // }
    // animate(0);
    //
    // document.getElementById("startAnimationBtn").addEventListener(
    //     "click", startAnimation);
    // document.getElementById("stopAnimationBtn").addEventListener(
    //     "click", () => cancelAnimationFrame(animationHandle));

