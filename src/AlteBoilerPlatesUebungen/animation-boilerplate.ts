import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from '../mathOperations/vector';
import {
    GroupNode,
    SphereNode,
    TextureBoxNode
} from '../Nodes/nodes';
import {
    RasterVisitor,
} from '../Visitors/rastervisitor';
import Shader from '../Shaders/shader';
import {
    RotationNode
} from '../Nodes/animation-nodes';
import phongVertexShader from '../Shaders/phong-vertex-perspective-shader.glsl';
import phongFragmentShader from '../Shaders/phong-fragment-shader.glsl';
import textureVertexShader from '../Shaders/texture-vertex-perspective-shader.glsl';
import textureFragmentShader from '../Shaders/texture-fragment-shader.glsl';
import {Rotation, Translation} from '../mathOperations/transformation';
import Camera from "../camera";
import {RasterSetupVisitor} from "../Visitors/rasterSetupVisitor";

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    //        SG
    //         |
    //    +----+-----+
    //  T(gn1)     T(gn2)
    //    |          |
    //  Sphere     R(gn3)
    //               |
    //              Box
    const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
    const gn1 = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
    sg.add(gn1);
    const sphere = new SphereNode(new Vector(.8, .4, .1, 1))
    gn1.add(sphere);
    const gn2 = new GroupNode(new Translation(new Vector(.2, .2, -1, 0)));
    sg.add(gn2);
    const gn3 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    gn2.add(gn3);
    const cube = new TextureBoxNode('hci-logo.png');
    gn3.add(cube);

    const shininessElement = document.getElementById("shininess") as HTMLInputElement;
    let shininessCalc = Number(shininessElement.value)

    const kSElement = document.getElementById("kS") as HTMLInputElement;
    let kSCalc = Number(kSElement.value);
    const kDElement = document.getElementById("kD") as HTMLInputElement;
    let kDCalc = Number(kDElement.value)
    const kAElement = document.getElementById("kA") as HTMLInputElement;
    let kACalc = Number(kAElement.value)
    const lightPositionXElement = document.getElementById("lightPositionX") as HTMLInputElement;
    let lightPositionXCalc = Number(lightPositionXElement.value)
    const lightPositions = [
        // new Vector(1, 1, 1, 1)
        new Vector(lightPositionXCalc, 1,1,1)
    ];
    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl, lightPositions);

    setupVisitor.setup(sg);


    const camera = new Camera(new Vector(0, 0, 0, 1),
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
    }
    kDElement.onchange = function () {
        camera.kD = Number(kDElement.value);
    }
    kAElement.onchange = function () {
        camera.kA = Number(kAElement.value);
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

    let animationNodes = [
        new RotationNode(sg, new Vector(0, 0, 1, 0)),
        new RotationNode(gn3, new Vector(0, 1, 0, 0))
    ];

    function simulate(deltaT: number) {
        for (let animationNode of animationNodes) {
            animationNode.simulate(deltaT);
        }
    }

    let lastTimestamp = performance.now();

    function animate(timestamp: number) {
        simulate(timestamp - lastTimestamp);
        visitor.render(sg, camera, []);
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
    }

    Promise.all(
        [phongShader.load(), textureShader.load()]
    ).then(x =>
        window.requestAnimationFrame(animate)
    );

    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case "ArrowUp":
                animationNodes[0].toggleActive();
                break;
        }
    });
});