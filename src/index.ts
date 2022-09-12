import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode,
    TextureBoxNode,
    LightNode,
    PyramidNode,
    TexturePyramidNode,
    TextureVideoBoxNode,
    CameraNode,
    AABoxButtonNode,
    TextureBoxButtonNode
} from './nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from './rastervisitor';
import Shader from './shader';
import phongVertexShader from './phong-vertex-shader.glsl';
import phongFragmentShader from './phong-fragment-shader.glsl';
import phongVertexShaderPerspective from './phong-vertex-perspective-shader.glsl';

import perspectiveVertexShader from './perspective-vertex-shader.glsl';
import fragmentShader from './basic-fragment-shader.glsl'
import {Rotation, Scaling, Translation} from './transformation';
import textureVertexShader from "./texture-vertex-shader.glsl";
import textureFragmentShader from "./texture-fragment-shader.glsl";
import Ray from "./ray";
import Intersection from "./intersection";
import Sphere from "./sphere";
import AABox from "./aabox";
import RayVisitor from "./rayvisitor";
import phong from "./phong";
import {DriverNode, MinMaxNode, RotationNode, ScalerNode} from "./animation-nodes";
import mouseClickVisitor from "./mouse-click-visitor";
import RasterPyramid from "./raster-pyramid";
import Pyramid from "./pyramid";
import {LightVisitor} from "./lightVisitor";
import TextureVideoBox from "./texture-video-box";
import {CameraVisitor} from "./cameraVisitor";
import Camera from "./camera";
import Visitor from "./visitor";
import RayVisitorSupaFast from "./rayvisitor-supa-fast";
import {CameraTranslatorNode, CameraRotationNode, CameraDriverNode} from "./camera-animation-nodes";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.5, -0.5, 0.5, 1), new Vector(0.5, -0.5, 0.5, 1), new Vector(0, -0.5, -0.5, 1), new Vector(0, 0.5, 0, 1), new Vector(0, 0, 0, 1))

window.addEventListener('load', function loadPage() {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const canvas2 = document.getElementById("rayTracer") as HTMLCanvasElement;

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

    // //Texturen
    const textureGeist = new TextureBoxNode('geist.png');
    const textureHCILogo = new TextureBoxNode('hci-logo.png');
    const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
    const textureClose = new TextureBoxNode('Icons/close.png');
    const textureGeistText = new TextureBoxNode('Icons/geistText.png');
    const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
    const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
    const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
    sg.add(gnTr);

    //Taskbar
    const TaskBTr = new GroupNode(new Translation(new Vector(0, -.545, -1, 0)));
    const TaskBSc = new GroupNode(new Scaling(new Vector(1.2, 0.07, 0.0001, 0)))
    const TaskBBox = new AABoxNode(new Vector(0.7, 0, 0.7, 0));
    TaskBSc.add(TaskBBox)
    TaskBTr.add(TaskBSc);
    sg.add(TaskBTr);
    //Icons auf Taskbar
    // //Icon Kreis
    const TaskBIconSc = new GroupNode(new Scaling(new Vector(0.025, 0.025, 0.025,0)));
    const TaskBIconTr = new GroupNode(new Translation(new Vector(-0.1, -0.54, -1, 0)));

    const TaskBIconSphere = new SphereNode(new Vector(1, 0.7, 0.7, 1));
    TaskBIconSc.add(TaskBIconSphere);
    TaskBIconTr.add(TaskBIconSc);
    sg.add(TaskBIconTr);
    // //Icon Viereck
    const TaskBIconBoxTr = new GroupNode(new Translation(new Vector(0, -0.54, -1, 0)));
    const TaskBIconBoxSc = new GroupNode(new Scaling(new Vector(0.045, 0.045, 0.0001, 0)));

    const TaskBIconBox = new AABoxNode(new Vector(1, 0, 0.5, 0));
    TaskBIconBoxSc.add(TaskBIconBox);
    TaskBIconBoxTr.add(TaskBIconBoxSc)
    sg.add(TaskBIconBoxTr)
    //HeaderBoxen
    // Erster Header
    const headerBTr = new GroupNode(new Translation(new Vector(-0.3, 1.08, 0, 0)));
    const headerBSc = new GroupNode(new Scaling(new Vector(0.6, 0.07, 0.0001, 0)))

    const headerBBox = new AABoxNode(new Vector(1, 0.7, 0.7, 1));
    headerBSc.add(headerBBox)
    headerBTr.add(headerBSc)
    TaskBTr.add(headerBTr)
    //Icons für ersten Header
    const headerBIconBoxSc = new GroupNode(new Scaling(new Vector(0.07, 0.07, 0.0001, 0)));
    const headerBIconBoxTr = new GroupNode(new Translation(new Vector(0.15, 0.394, 0, 0)));
    const headerBIconBoxTr2 = new GroupNode(new Translation(new Vector(0.25, 0.394, 0, 0)));
    const headerBIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.07, 0.07, 0.0001, 0)));
    //Header Icons (Vierecke, später Textur drauf)
    //erste Box
    // const headerBIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    // headerBIconBoxSc.add(headerBIconBox);
    headerBIconBoxSc.add(textureMinimize);
    headerBIconBoxTr.add(headerBIconBoxSc)
    headerBTr.add(headerBIconBoxTr)
    // //zweite Box
    // const headerBIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
    // headerBIconBoxSc2.add(headerBIconBox2);
    headerBIconBoxSc2.add(textureClose);
    headerBIconBoxTr2.add(headerBIconBoxSc2)
    headerBTr.add(headerBIconBoxTr2)
    //Zweiter Header
    const headerBTr2 = new GroupNode(new Translation(new Vector(0.3, 1.08, 0, 0)));
    const headerBSc2 = new GroupNode(new Scaling(new Vector(0.55, 0.07, 0.0001, 0)))
    const headerBBox2 = new AABoxNode(new Vector(1, 0, 1, 0));

    headerBSc2.add(headerBBox2)
    // headerBarSc2.add(textureGeistText)
    headerBTr2.add(headerBSc2)
    TaskBTr.add(headerBTr2)
    //HeaderBox2 Icons
    const headerBIconBox2Tr = new GroupNode(new Translation(new Vector(0.55, 0.394, 0, 0)));
    const headerBIconBox2Tr2 = new GroupNode(new Translation(new Vector(0.65, 0.394, 0, 0)));

    headerBIconBox2Tr.add(headerBIconBoxSc)
    headerBTr2.add(headerBIconBox2Tr)
    headerBIconBox2Tr2.add(headerBIconBoxSc2)
    headerBTr2.add(headerBIconBox2Tr2)

    //HeaderBoxen für Namebeschriftung
    //Header1: Beschriftung
    const headerBTextTr = new GroupNode(new Translation(new Vector(-0.3, 0.394, 0, 0)));
    const headerBTextSc = new GroupNode(new Scaling(new Vector(0.16, 0.09, 0.0001, 0)))

    // headerBTextSc.add(headerBBox)
    headerBTextSc.add(textureKugelText)
    // headerBTextSc.add(textureMinimize)
    headerBTextTr.add(headerBTextSc)
    headerBTr.add(headerBTextTr)
    //Header 2: Beschriftung
    const headerBTextTr2 = new GroupNode(new Translation(new Vector(0.15, 0.394, 0, 0)));
    const headerBTextSc2 = new GroupNode(new Scaling(new Vector(0.16, 0.09, 0.0001, 0)))

    headerBTextSc2.add(textureGeistText)
    headerBTextTr2.add(headerBTextSc2)
    headerBTr2.add(headerBTextTr2)

    //Zeichenflaeche 1
    // const cube = new AABoxNode(new Vector(0, 0, 0, 0));
    const cubeSc = new GroupNode(new Scaling(new Vector(0.7, 0.7, 0.1, 0)));
    const cubeTr = new GroupNode(new Translation(new Vector(0.5, 0, -1, 0)));
    const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
    const gn3 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

    //TODO: Texture anzeigen geht nicht?
    cubeSc.add(textureGeist)
    cubeRt.add(cubeSc);
    cubeTr.add(cubeRt);
    sg.add(cubeTr);

    //Zeichenflaeche2
    //TODO: rausfinden wieso in raytracer sobald die sphere drin is der hintergrund schwarz wird
    const sphere = new SphereNode(new Vector(1, 0.7, 0.7, 1))
    const sphereSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
    const sphereTr = new GroupNode(new Translation(new Vector(-0.3, 0, -1, 0)));
    const sphereRt = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 1));
    sphereSc.add(sphere);
    // sphereSc.add(textureHCILogo)
    sphereRt.add(sphereSc)
    sphereTr.add(sphereRt);
    sg.add(sphereTr);


    // //TODO: Texture anzeigen geht nicht?
    const pyramid = new PyramidNode(new Vector(1, 0, 1, 0))
    const pyramidSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
    const pyramidTr = new GroupNode(new Translation(new Vector(-0.2, -0.4, -1, 0)));

    pyramidSc.add(pyramid)
    pyramidTr.add(pyramidSc)
    sg.add(pyramidTr)

    //muss punkt sein
    const light1 = new LightNode(new Vector(1, 1, 0, 1))
    const lightTr = new GroupNode(new Translation(new Vector(-0.3, 0, -1, 0)));

    lightTr.add(light1)
    sg.add(lightTr)



    const sgcamera = new Camera(new Vector(0, 0, 0, 1),
        new Vector(0, 0, 0, 1),
        new Vector(0, 0, -1, 1),
        new Vector(0, 1, 0, 0),
        60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
        kSCalc, kDCalc, kACalc)
    const nodeCamera = new CameraNode(sgcamera)
    sg.add(nodeCamera)

    //Video-Box

    const videoBox = new TextureVideoBoxNode("icgTestVideo.mp4");
    const videoBoxSc = new GroupNode(new Scaling(new Vector(0.3, 0.3, 0.3, 0.3)));
    videoBoxSc.add(videoBox);
    sg.add(videoBoxSc);


    //kleiner driver geist
    const driverGhost = new TextureBoxNode("geist.png")
    const driverGhostSc = new GroupNode(new Scaling(new Vector(0.1, 0.1, 0.1, 1)))
    driverGhostSc.add(driverGhost);
    const driverGhostTr = new GroupNode(new Translation(new Vector(0.75, -0.8, 0, 0)))
    driverGhostTr.add(driverGhostSc)
    sg.add(driverGhostTr)

    const ghostCastle = new TextureBoxNode("ghost_castle.jpg")
    const ghostCastleSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 1)))
    const ghostCastleTr = new GroupNode(new Translation(new Vector(0.9, -0.75, -0.1, 0)))
    ghostCastleSc.add(ghostCastle)
    ghostCastleTr.add(ghostCastleSc)
    sg.add(ghostCastleTr)

    /*//TestButton Wieso wird das nicht angezeigt????
    const testButtonTr = new GroupNode(new Translation(new Vector(-1.0, -1.0, -4.0, 0)))
    const testButton2Tr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
    const minmax = new MinMaxNode(testButton2Tr,  new Vector(1,0.5,0.5,0),new Vector(0.5,1,0.5,0), 3000)
    const testButton = new TextureBoxButtonNode("geist.png", () => {
        minmax.active = true;
    })
    minmax.active = false;
    testButtonTr.add(testButton2Tr);
    testButton2Tr.add(testButton)
    sg.add(testButtonTr)*/


    //TestButton
    const redSquare = new AABoxNode(new Vector(1,0,0,1));
    const redSquareTr = new GroupNode(new Translation(new Vector(-1,-2,-5,0)));
    const redSquareSc = new GroupNode(new Scaling(new Vector(2,1,1,1)))
    redSquareTr.add(redSquare);
    redSquareSc.add(redSquareTr);


    const testButtonTr = new GroupNode(new Translation(new Vector(1.0, -1.0, -4.0, 0)))
    const emptyTranslationTestButton = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
    const minmax = new MinMaxNode(emptyTranslationTestButton, new Vector(1,1,1,0),new Vector(0.1,0.1,0.1,0), 500)
    const testButton = new AABoxButtonNode(new Vector(0, 0, 0, 0), () => {
        minmax.active = true;
    })
    minmax.active = false;

    testButtonTr.add(emptyTranslationTestButton);

    emptyTranslationTestButton.add(testButton)

    emptyTranslationTestButton.add(redSquareSc);

    emptyTranslationTestButton.add(headerBTr);

    sg.add(redSquareSc)

    sg.add(testButtonTr)


    let animationNodes = [
        new RotationNode(sphereRt, new Vector(0, 0, 1, 0)),
        minmax,
        // new DriverNode(lightTr, new Vector(1, 0, 0, 0)),
        // new TranslatorNode(lightTr, new Vector(1, 0, 0, 0), "left")
        new RotationNode(lightTr, new Vector(1, 1, 1, 0)),
        //new CameraRotationNode(nodeCamera)
    ]

    let DriverNodes = [
        //new RotationNode(cubeSc, new Vector(0,0,1,0)),
        new DriverNode(driverGhostTr, new Vector(0.75,-0.8,0,0))
    ]

    let ScalerNodes = [
        new ScalerNode(driverGhostSc, new Vector(0.1, 0.1, 0.1, 1))
    ]

    let CameraDriverNodes = [
        new CameraDriverNode(nodeCamera)
    ]

        const gl = canvas.getContext("webgl2");
        const ctx = canvas2.getContext("2d");

    const phongShader = new Shader(gl,
        phongVertexShaderPerspective,
        phongFragmentShader
    );
    const textureShader = new Shader(gl,
        textureVertexShader,
        textureFragmentShader
    );

        const lightPositionsVisitor = new LightVisitor
        let lightPositions = lightPositionsVisitor.visit(sg)
        console.log(lightPositions)
        const cameraVisitor = new CameraVisitor
        let camera = cameraVisitor.visit(sg)

    let setupVisitor = new RasterSetupVisitor(gl, lightPositions)
    let rasterVisitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects)
    let rayVisitor = new RayVisitorSupaFast(ctx, canvas.width, canvas.height)
    let visitor: RayVisitorSupaFast|RasterVisitor

    const btn1 = document.getElementById('btnradio1') as HTMLInputElement;
    const btn2 = document.getElementById('btnradio2') as HTMLInputElement;

    let renderer = localStorage.getItem("renderer")
    console.log(renderer)
    if (renderer == "rasterizer") {
        btn1.checked = true
    } else {
        btn2.checked = true
    }
    console.log(btn1.checked)
    console.log(btn2.checked)

    function render(){
        console.log("called")
        if (btn1.checked) {
            btn1.checked = true
            btn2.checked = false
            visitor = rasterVisitor
            canvas2.style.display = "none"
            canvas.style.display = "block"
            loadScene()
            console.log(visitor)
        } else if (btn2.checked) {
            btn1.checked = false
            btn2.checked = true
            visitor = rayVisitor
            canvas2.style.display = "block"
            canvas.style.display = "none"
            loadScene()
            console.log(visitor)
        }
    }

    render()

    function loadScene(){
    if (btn1.checked){
        setupVisitor.setup(sg);
    }

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

        console.log(setupVisitor.objects)

        let animationTime = 0;

        function simulate(deltaT: number) {
            animationTime += deltaT;
            for (let animationNode of animationNodes) {
                animationNode.simulate(deltaT);
                lightPositions = lightPositionsVisitor.visit(sg);
            }

            for (let driverNode of DriverNodes) {
                driverNode.simulate(deltaT);
            }

            for (let scalerNode of ScalerNodes) {
                scalerNode.simulate(deltaT);
            }

            for (let cameraDriverNode of CameraDriverNodes){
                cameraDriverNode.simulate(deltaT);
            }
        }

        let lastTimestamp = performance.now();
        let then = 0;

        function animate(timestamp: number) {
            simulate(timestamp - lastTimestamp);
            visitor.render(sg, camera, lightPositions);
            lastTimestamp = timestamp;
            window.requestAnimationFrame(animate);
        }

        //2. Version mit requestAnimationframe
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
        }


        Promise.all(
            [phongShader.load(), textureShader.load()]
        ).then(x =>
            window.requestAnimationFrame(animate)
        );

        window.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    DriverNodes[0].direction = "left"
                    DriverNodes[0].active = true;
                    break;
                case "ArrowRight":
                    DriverNodes[0].direction = "right"
                    DriverNodes[0].active = true;
                    break;
                case "ArrowUp":
                    DriverNodes[0].direction = "up"
                    DriverNodes[0].active = true;
                    break;
                case "ArrowDown":
                    DriverNodes[0].direction = "down"
                    DriverNodes[0].active = true;
                    break;
                case "+":
                    ScalerNodes[0].zoom = "in"
                    ScalerNodes[0].active = true;
                    break;
                case "-":
                    ScalerNodes[0].zoom = "out"
                    ScalerNodes[0].active = true;
                    break;
                case "w":
                    CameraDriverNodes[0].direction = "up"
                    CameraDriverNodes[0].active = true;
                    break;
                case "a":
                    CameraDriverNodes[0].direction = "left"
                    CameraDriverNodes[0].active = true;
                    break;
                case "s":
                    CameraDriverNodes[0].direction = "down"
                    CameraDriverNodes[0].active = true;
                    break;
                case "d":
                    CameraDriverNodes[0].direction = "right"
                    CameraDriverNodes[0].active = true;
                    break;
                case "1":
                    for (let animationNode of animationNodes) {
                        animationNode.toggleActive();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    DriverNodes[0].active = false;
                    break;
                case "ArrowRight":
                    DriverNodes[0].active = false;
                    break;
                case "ArrowUp":
                    DriverNodes[0].active = false;
                    break;
                case "ArrowDown":
                    DriverNodes[0].active = false;
                    break;
                case "+":
                    ScalerNodes[0].active = false;
                    break;
                case "-":
                    ScalerNodes[0].active = false;
                    break;
                case "w":
                    CameraDriverNodes[0].active = false;
                    break;
                case "a":
                    CameraDriverNodes[0].active = false;
                    break;
                case "s":
                    CameraDriverNodes[0].active = false;
                    break;
                case "d":
                    CameraDriverNodes[0].active = false;
                    break;
            }
        });

        function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
            let rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        window.addEventListener('dblclick', function (evt) {
            let mousePos = getMousePos(canvas, evt);
            let mouseVisitor = new mouseClickVisitor(ctx, canvas.width, canvas.height, mousePos);
            mouseVisitor.render(sg, camera, lightPositions);
            setupVisitor.setup(sg);
            //visitor.render(sg, camera, camera.lightPositions);
        }, false);

        function mouseClickedOn(event: { clientX: number; }) {
            let mx = event.clientX - canvas.getBoundingClientRect().left;
        }
    }

    btn1.addEventListener('click', function () {
        if (btn1.checked) {
            console.log("render")
            localStorage.setItem("renderer", "rasterizer")
        } else if (btn2.checked) {
            console.log("ray")
            localStorage.setItem("renderer", "rayTracer")
        }
        location.reload()
    });
    btn2.addEventListener('click', function () {
        if (btn1.checked) {
            console.log("render")
            localStorage.setItem("renderer", "rasterizer")
        } else if (btn2.checked) {
            console.log("ray")
            localStorage.setItem("renderer", "rayTracer")
        }
        location.reload()
    });
});
