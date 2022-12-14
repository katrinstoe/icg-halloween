/*import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from '../mathOperations/vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode
} from '../Nodes/nodes';
import {
    RasterVisitor,
} from '../Visitors/rastervisitor';
import Shader from '../Shaders/shader';
import perspectiveVertexShader from '../Shaders/perspective-vertex-shader.glsl';
import fragmentShader from '../Shaders/basic-fragment-shader.glsl'
import { Scaling, Translation } from '../mathOperations/transformation';
import Camera from "../Camera/camera";
import {RasterSetupVisitor} from "../Visitors/rasterSetupVisitor";

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
    const gn1 = new GroupNode(new Translation(new Vector(1, 1, 0, 0)));
    sg.add(gn1);
    const sphere = new SphereNode(new Vector(.8, .4, .1, 1));
    gn1.add(sphere);
    let gn2 = new GroupNode(new Translation(new Vector(-.7, -0.4, .1, 0)));
    sg.add(gn2);
    const cube = new AABoxNode(new Vector(1, 0, 0, 1));
    gn2.add(cube);

    const shininessElement = document.getElementById("shininess") as HTMLInputElement;
    let shininessCalc = Number(shininessElement.value)
    const kSElement = document.getElementById("kS") as HTMLInputElement;
    let kSCalc = Number(kSElement.value)
    const kDElement = document.getElementById("kD") as HTMLInputElement;
    let kDCalc = Number(kDElement.value)
    const kAElement = document.getElementById("kA") as HTMLInputElement;
    let kACalc = Number(kAElement.value)
    const lightPositionXElement = document.getElementById("lightPositionX") as HTMLInputElement;
    let lightPositionXCalc = Number(lightPositionXElement.value)


    const lightPositions = [
        new Vector(1, 1, 1, 1)
    ];
    const camera = new Camera(new Vector(0, 0, 0, 1),
        new Vector(0, 0, 0, 1),
        new Vector(0, 0, -1, 1),
        new Vector(0, 1, 0, 0),
        60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
        kSCalc, kDCalc, kACalc, lightPositions)
    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl, camera.lightPositions);
    setupVisitor.setup(sg);

    shininessElement.onchange = function () {
        camera.shininess = Number(shininessElement.value);
    }
    kSElement.onchange = function () {
        camera.kS = Number(kSElement.value);
    }
    kDElement.onchange = function () {
        camera.kD = Number(kDElement.value);
    }
    kAElement.onchange = function () {
        camera.kA = Number(kAElement.value);
    }
    lightPositionXElement.onchange = function () {
        let lightPositionX = Number(lightPositionXElement.value)
        for (let lightPosition of camera.lightPositions) {
            lightPosition.x = lightPositionX;
        }
        // lightPositions = Number(lightPositionXElement.value);
        //console.log(camera.lightPositions)
    }

    const shader = new Shader(gl,
        perspectiveVertexShader,
        fragmentShader
    );
    const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);

    function animate(timestamp: number) {
        camera.eye = new Vector(
            Math.cos(timestamp / 1000),
            0,
            Math.sin(timestamp / 1000),
            1
        );
        visitor.render(sg, camera, []);
        window.requestAnimationFrame(animate);
    }

    shader.load()
    window.requestAnimationFrame(animate);
});

*/