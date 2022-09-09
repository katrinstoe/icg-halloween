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
    TextureVideoBoxNode, CameraNode
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
import {DriverNode, RotationNode, ScalerNode} from "./animation-nodes";
import mouseClickVisitor from "./mouse-click-visitor";
import RasterPyramid from "./raster-pyramid";
import Pyramid from "./pyramid";
import {LightVisitor} from "./lightVisitor";
import TextureVideoBox from "./texture-video-box";
import {CameraVisitor} from "./cameraVisitor";
import Camera from "./camera";
import Visitor from "./visitor";

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

    // headerBTextSc2.add(headerBBox)
    headerBTextSc2.add(textureGeistText)
    // headerBTextSc2.add(textureMinimize)
    headerBTextTr2.add(headerBTextSc2)
    headerBTr2.add(headerBTextTr2)

    //Zeichenflaeche 1
    // const cube = new AABoxNode(new Vector(0, 0, 0, 0));
    const cubeSc = new GroupNode(new Scaling(new Vector(0.7, 0.7, 0.1, 0)));
    const cubeTr = new GroupNode(new Translation(new Vector(0.5, 0, -1, 0)));
    const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
    const gn3 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    // const cubeTexture = new TextureBoxNode('hci-logo.png');

    // cubeSc.add(cube);
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
    sphereSc.add(sphere);
    // sphereSc.add(textureHCILogo)
    sphereTr.add(sphereSc);
    sg.add(sphereTr);


    // const cubeTest = new AABoxNode(new Vector(0, 0, 1, 0));
    // const cubeTestSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.5, 0)));
    // const cubeTestTr = new GroupNode(new Translation(new Vector(-0.01, 0, -1, 0)));

    // //TODO: Texture anzeigen geht nicht?
    // cubeTestSc.add(cubeTest)
    // cubeTestTr.add(cubeTestSc);
    // sg.add(cubeTestTr);
    const cubeTest = new TexturePyramidNode('geist.png');
    const cubeTestSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
    const cubeTestTr = new GroupNode(new Translation(new Vector(-0.01, 0, -1, 0)));

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

    const videoBox = new TextureVideoBoxNode("icgTestVideo.mp4");
    //sg.add(textureGeist);
    sg.add(videoBox);


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

    let animationNodes = [
        new RotationNode(cubeRt, new Vector(0, 0, 1, 0)),
        // new DriverNode(lightTr, new Vector(1, 0, 0, 0)),
        // new TranslatorNode(lightTr, new Vector(1, 0, 0, 0), "left")
        new RotationNode(lightTr, new Vector(1, 1, 1, 0)),
    ]

    let DriverNodes = [
        //new RotationNode(cubeSc, new Vector(0,0,1,0)),
        new DriverNode(driverGhostTr, new Vector(0.75,-0.8,0,0))
    ]

    let ScalerNodes = [
        new ScalerNode(driverGhostSc, new Vector(0.1, 0.1, 0.1, 1))
    ]

//Rasterizer und RayTracer Wechseln





 /*   function rerender() {
        console.log("called")
        if (btn1.checked) {
            btn1.checked = true
            btn2.checked = false
            //rasterVisitor()
            visitor = new RasterVisitor()
        } else if (btn2.checked) {
            btn1.checked = false
            btn2.checked = true
            //rayVisitor()
        }
    }

    rerender()*/

    // shininessElement.onchange = function () {
    //     shininessCalc = Number(shininessElement.value);
    //     //ging als jenachdem aktuellen visitor nochmal gecalled haben aber dann endless loop und super schnell
    //     rerender()
    // }
    // console.log(shininessCalc)

    //function rasterVisitor() {
        canvas2.style.display = "none"
        canvas.style.display = "block"
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

        // const lightPositions = [
        //     // new Vector(1, 1, 1, 1)
        //     new Vector(lightPositionXCalc, 1,1,1)
        // ];
        // setup for rendering
        const lightPositionsVisitor = new LightVisitor(gl)
        let lightPositions = lightPositionsVisitor.visit(sg)
        console.log(lightPositions)
        const cameraVisitor = new CameraVisitor(gl)
        let camera = cameraVisitor.visit(sg)


    let setupVisitor = new RasterSetupVisitor(gl, lightPositions)
    let rasterVisitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects)
    let rayVisitor = new RayVisitor(ctx, canvas.width, canvas.height)
    let visitor: RayVisitor|RasterVisitor

    const btn1 = document.getElementById('btnradio1') as HTMLInputElement;
    const btn2 = document.getElementById('btnradio2') as HTMLInputElement;

    function render(){
        console.log("called")
        if (btn1.checked) {
            btn1.checked = true
            btn2.checked = false
            //rasterVisitor()
            //setupVisitor = new RasterSetupVisitor(gl, lightPositions)
            visitor = rasterVisitor
            //loadScene()
            console.log(visitor)
        } else if (btn2.checked) {
            btn1.checked = false
            btn2.checked = true
            visitor = rayVisitor
            //loadScene()
            console.log(visitor)
            //rayVisitor()
        }
    }

    render()




    let renderer = localStorage.getItem("renderer")
    console.log(renderer)
    if (renderer == "rasterizer") {
        btn1.checked = true
    } else {
        btn2.checked = true
    }
    console.log(btn1.checked)
    console.log(btn2.checked)
    btn1.addEventListener("click", rerenderRaster)
    btn2.addEventListener("click", rerenderRay)

    function rerenderRaster(){
        btn1.checked = true
        btn2.checked = false
        visitor = rasterVisitor
        console.log(visitor)
    }

    function rerenderRay(){
        btn1.checked = false
        btn2.checked = true
        visitor = rayVisitor
        console.log(visitor)
    }



    /*function rerender() {
        console.log("called")
        if (btn1.checked) {
            btn1.checked = true
            btn2.checked = false
            //rasterVisitor()
            //setupVisitor = new RasterSetupVisitor(gl, lightPositions)
            visitor = rasterVisitor
            //loadScene()
            console.log(visitor)
        } else if (btn2.checked) {
            btn1.checked = false
            btn2.checked = true
            visitor = rayVisitor
            //loadScene()
            console.log(visitor)
            //rayVisitor()
        }
    }
    rerender()*/




    //function loadScene(){
        //const setupVisitor = new RasterSetupVisitor(gl, lightPositions);
        setupVisitor.setup(sg);


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


        //const visitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects);
        console.log(setupVisitor.objects)

        let animationTime = 0;

        function simulate(deltaT: number) {
            animationTime += deltaT;
            for (let animationNode of animationNodes) {
                //animationNode.angle = animationTime / 500;
                animationNode.simulate(deltaT);
                lightPositions = lightPositionsVisitor.visit(sg);
                //camera.lightPositions = lightPositions;
            }

            for (let driverNode of DriverNodes) {
                driverNode.simulate(deltaT);
            }

            for (let scalerNode of ScalerNodes) {
                scalerNode.simulate(deltaT);
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
            // lightPositions = Number(lightPositionXElement.value);
            // console.log(camera.lightPositions)
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
            visitor.render(sg, camera, []);

        }, false);

        function mouseClickedOn(event: { clientX: number; }) {
            let mx = event.clientX - canvas.getBoundingClientRect().left;
        }
    //}


  //  }
 /*   function rayVisitor() {
        canvas.style.display = "none"
        canvas2.style.display = "block"
        // canvas.hidden
        console.log("RayTracer")
        const ctx = canvas2.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const lightPositions = [
            new Vector(lightPositionXCalc, 1, 1, 0),
        ];
       /* const camera = {
            origin: new Vector(0, 0, 0, 1),
            width: canvas.width,
            height: canvas.height,
            alpha: Math.PI / 3,
            shininess: shininessCalc,
            kS: kSCalc,
            kD: kDCalc,
            kA: kACalc,
            lightPositions: lightPositions
        };*/


 /*       const visitor = new RayVisitor(ctx, canvas.width, canvas.height);

        let animationHandle: number;

        let lastTimestamp = 0;
        let animationTime = 0;
        let animationHasStarted = true;

        // function animate(timestamp: number) {
        //     console.log("ich starte mal")
        //     let deltaT = timestamp - lastTimestamp;
        //     if (animationHasStarted) {
        //         deltaT = 0;
        //         animationHasStarted = false;
        //     }
        //     animationTime += deltaT;
        //     lastTimestamp = timestamp;
        //     animationNodes[0].angle = animationTime / 2000;
        //
        //     visitor.render(sg, camera, lightPositions);
        //     // animationHandle = window.requestAnimationFrame(animate);
        //     console.log("animate zu Ende")
        // }

        // function startAnimation() {
        //     if (animationHandle) {
        //         window.cancelAnimationFrame(animationHandle);
        //     }
        //     animationHasStarted = true;
        //
        //     function animation(t: number) {
        //         animate(t);
        //         animationHandle = window.requestAnimationFrame(animate);
        //     }
        //
        // }
        // animate(0);
        // shininessElement.onchange = function () {
        //     camera.shininess = 50-Number(shininessElement.value);
        //     window.requestAnimationFrame(animate)
        // }
        // kSElement.onchange = function () {
        //     camera.kS = Number(kSElement.value);
        //     window.requestAnimationFrame(animate)
        // }
        // kDElement.onchange = function () {
        //     camera.kD = Number(kDElement.value);
        //     window.requestAnimationFrame(animate)
        // }
        // kAElement.onchange = function () {
        //     camera.kA = Number(kAElement.value);
        //     window.requestAnimationFrame(animate)
        // }
        // console.log("fertig shininess")
        //
        // document.getElementById("startAnimationBtn").addEventListener(
        //     "dblclick", startAnimation);
        // document.getElementById("stopAnimationBtn").addEventListener(
        //     "dblclick", () => cancelAnimationFrame(animationHandle));
        //

    }

    btn1.addEventListener('click', function (){
        if (btn1.checked) {
            console.log("render")
            localStorage.setItem("renderer", "rasterizer")
            // rasterVisitor()
        } else if (btn2.checked) {
            console.log("ray")
            localStorage.setItem("renderer", "rayTracer")
            // rayVisitor()
        }
        location.reload()
    });
    btn2.addEventListener('click', function (){
        if (btn1.checked) {
            console.log("render")
            localStorage.setItem("renderer", "rasterizer")
            // rasterVisitor()
        } else if (btn2.checked) {
            console.log("ray")
            localStorage.setItem("renderer", "rayTracer")
            // rayVisitor()
        }
        location.reload()
    });*/
});
