import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from '../mathOperations/vector';
import {
    GroupNode,
    SphereNode,
    TextureBoxNode
} from '../Nodes/nodes';
import {
    RasterVisitor
} from '../Visitors/rastervisitor';
import Shader from '../Shaders/shader';
import phongVertexShader from '../Shaders/phong-vertex-shader.glsl';
import phongFragmentShader from '../Shaders/phong-fragment-shader.glsl';
import textureVertexShader from '../Shaders/texture-vertex-shader.glsl';
import textureFragmentShader from '../Shaders/texture-fragment-shader.glsl';
import { Rotation, Scaling, Translation } from '../mathOperations/transformation';
import Camera from "../Camera/camera";
import {RasterSetupVisitor} from "../Visitors/rasterSetupVisitor";

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(new Scaling(new Vector(1.4, 1.4, 1.4, 1)));
    const sg2 = new GroupNode(new Translation(new Vector(0, 0, 0.4, 0)));
    sg.add(sg2);
    const gn0 = new GroupNode(new Rotation(new Vector(1, 0, 0, 0), 0));
    const gn1 = new GroupNode(new Scaling(new Vector(.3, .3, .3, 0)));
    gn0.add(gn1);
    const gn2 = new GroupNode(new Translation(new Vector(1, 0, -1.9, 0)));
    gn1.add(gn2);
    const sphere = new SphereNode(new Vector(.8, .4, .1, 1));
    gn2.add(sphere);
    let gn3 = new GroupNode(new Translation(new Vector(.5, 0, 0, 0)));
    gn0.add(gn3);
    sg2.add(gn0);
    const cube = new TextureBoxNode('hci-logo.png');
    gn3.add(cube);

    const shininessElement = document.getElementById("shininess") as HTMLInputElement;
    let shininessCalc = Number(shininessElement.value);
    const kSElement = document.getElementById("kS") as HTMLInputElement;
    let kSCalc = Number(kSElement.value)
    const kDElement = document.getElementById("kD") as HTMLInputElement;
    let kDCalc = Number(kDElement.value)
    const kAElement = document.getElementById("kA") as HTMLInputElement;
    let kACalc = Number(kDElement.value)
    const lightPositionXElement = document.getElementById("lightPositionX") as HTMLInputElement;
    let lightPositionXCalc = Number(lightPositionXElement.value)
    const lightPositions = [
        // new Vector(1, 1, 1, 1)
        new Vector(lightPositionXCalc, 1,1,1)
    ];
    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl, lightPositions);
    setupVisitor.setup(sg);

    let camera = new Camera(new Vector(0, 0, 0, 1),
        new Vector(0, 0, 0, 1),
        new Vector(0, 0, -1, 1),
        new Vector(0, 1, 0, 0),
        60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
        kSCalc, kDCalc, kACalc)
    shininessElement.onchange = function () {
        camera.shininess = Number(shininessElement.value);
    }
    kSElement.onchange = function () {
        camera.kS = Number(kSElement.value);
        console.log(camera.kS)
    }
    kDElement.onchange = function () {
        camera.kD = Number(kDElement.value);
        console.log(camera.kD)
    }
    kAElement.onchange = function () {
        camera.kD = Number(kDElement.value);
        console.log(camera.kD)
    }
    lightPositionXElement.onchange = function () {
        let lightPositionX = Number(lightPositionXElement.value)
        for (let lightPosition of lightPositions) {
            lightPosition.x = lightPositionX;
        }
        // lightPositions = Number(lightPositionXElement.value);
        //console.log(camera.lightPositions)
    }
    const phongShader = new Shader(gl,
        phongVertexShader,
        phongFragmentShader
    );
    const textureShader = new Shader(gl,
        textureVertexShader,
        textureFragmentShader
    );
    const visitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects);

    function animate(timestamp: number) {
        gn0.transform = new Rotation(new Vector(0, 0, 1, 0), timestamp / 1000);
        gn3.transform = new Rotation(new Vector(0, 1, 0, 0), timestamp / 1000);
        visitor.render(sg, camera, []);
        window.requestAnimationFrame(animate);
    }

    phongShader.load();
    textureShader.load();
    window.requestAnimationFrame(animate);
});