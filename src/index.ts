import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode, TextureBoxNode
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
import {RotationNode} from "./animation-nodes";
import mouseClickVisitor from "./mouse-click-visitor";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

window.addEventListener('load', function loadPage() {

    // //Texturen
    const textureGeist = new TextureBoxNode('geist.png');
    const textureHCILogo = new TextureBoxNode('hci-logo.png');
    const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
    const textureClose = new TextureBoxNode('Icons/close.png');
    // const textureGeistText = new TextureBoxNode('Icons/geistText.png');
    // const textureKugelText = new TextureBoxNode('Icons/kugelText.png');

    const sg = new GroupNode(new Translation(new Vector(-0.5, -0.5, -5, 0)));

    //Rotation an root
    const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 0)
    const gn = new GroupNode(gnRotation); //rotation an root
    sg.add(gn);


    //Taskbar
    const TaskBTr = new GroupNode(new Translation(new Vector(0, -2.3, 0, 0)));
    const TaskBSc = new GroupNode(new Scaling(new Vector(7, 0.2, 0.0001, 0)))
    const TaskBBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBSc.add(TaskBBox)
    TaskBTr.add(TaskBSc);
    sg.add(TaskBTr)

    //Icons auf Taskbar
    // //Icon Rosa Kreis
    const TaskBIconSc = new GroupNode(new Scaling(new Vector(0.07, 0.07, 0.07,0)));
    const TaskBIconTr = new GroupNode(new Translation(new Vector(-2.2, 0.01, 0, 0)));

    const TaskBIconSphere = new SphereNode(new Vector(0, 0.6, 0.6, 1));
    TaskBIconSc.add(TaskBIconSphere);
    TaskBIconTr.add(TaskBIconSc);
    TaskBTr.add(TaskBIconTr);

    // //Icon Viereck
    const TaskBIconBoxTr = new GroupNode(new Translation(new Vector(-1.95, 0.06, 0.1, 0)));
    const TaskBIconBoxSc = new GroupNode(new Scaling(new Vector(0.15, 0.15, 0.000001, 0)));

    const TaskBIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBIconBoxSc.add(TaskBIconBox);
    TaskBIconBoxTr.add(TaskBIconBoxSc)
    TaskBTr.add(TaskBIconBoxTr)

    //HeaderBoxen
    // Erster Header
    const headerBTr = new GroupNode(new Translation(new Vector(-1.1, 5.6, 0, 0)));
    const headerBSc = new GroupNode(new Scaling(new Vector(2.6, 0.2, 0.0001, 0)))

    const headerBBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBSc.add(headerBBox)
    headerBTr.add(headerBSc)
    TaskBTr.add(headerBTr)
    //Icons für ersten Header
    const headerBIconBoxSc = new GroupNode(new Scaling(new Vector(0.15, 0.15, 0.0001, 0)));
    const headerBIconBoxTr = new GroupNode(new Translation(new Vector(1.15, -0.01, 0, 0)));
    const headerBIconBoxTr2 = new GroupNode(new Translation(new Vector(0.95, -0.01, 0, 0)));
    const headerBIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.15, 0.15, 0.0001, 0)));
    //Header Icons (Vierecke, später Textur drauf)
    //erste Box
    const headerBIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBIconBoxSc.add(headerBIconBox);
    headerBIconBoxSc.add(textureMinimize);
    headerBIconBoxTr.add(headerBIconBoxSc)
    headerBTr.add(headerBIconBoxTr)
    //zweite Box
    const headerBIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBIconBoxSc2.add(headerBIconBox2);
    headerBIconBoxSc2.add(textureClose);
    headerBIconBoxTr2.add(headerBIconBoxSc2)
    headerBTr.add(headerBIconBoxTr2)
    //Zweiter Header
    const headerBTr2 = new GroupNode(new Translation(new Vector(2.1, 5.6, 0, 0)));
    const headerBSc2 = new GroupNode(new Scaling(new Vector(2.6, 0.2, 0.0001, 0)))

    headerBSc2.add(headerBBox)
    // headerBarSc2.add(textureGeistText)
    headerBTr2.add(headerBSc2)
    TaskBTr.add(headerBTr2)
    //HeaderBox2 Icons
    const headerBIconBox2Tr = new GroupNode(new Translation(new Vector(1.15, 0, 0, 0)));
    const headerBIconBox2Tr2 = new GroupNode(new Translation(new Vector(0.95, 0, 0, 0)));

    headerBIconBox2Tr.add(headerBIconBoxSc)
    headerBTr2.add(headerBIconBox2Tr)
    headerBIconBox2Tr2.add(headerBIconBoxSc2)
    headerBTr2.add(headerBIconBox2Tr2)

    //HeaderBoxen für Namebeschriftung
    //Header1: Beschriftung
    const headerBTextTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const headerBTextSc = new GroupNode(new Scaling(new Vector(1.5, 0.18, 0.0001, 0)))

    headerBTextSc.add(headerBBox)
    // headerBarTextSc.add(textureKugelText)
    headerBTextTr.add(headerBTextSc)
    headerBTr.add(headerBTextTr)
    //Header 2: Beschriftung
    const headerBTextTr2 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const headerBTextSc2 = new GroupNode(new Scaling(new Vector(1.5, 0.18, 0.0001, 0)))

    headerBTextSc2.add(headerBBox)
    // headerBarTextSc2.add(textureGeistText)
    headerBTextTr2.add(headerBTextSc2)
    headerBTr2.add(headerBTextTr2)


    //Zeichenflaeche 1
    const cube = new AABoxNode(new Vector(0, 0, 0, 0));
    const cubeSc = new GroupNode(new Scaling(new Vector(2.2, 2.2, 0.1, 0)));
    const cubeTr = new GroupNode(new Translation(new Vector(2.1, 0.8, 0, 0)));
    const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
    const gn3 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const cubeTexture = new TextureBoxNode('hci-logo.png');

    cubeSc.add(cube);
    //TODO: Texture anzeigen geht nicht?
    cubeSc.add(cubeTexture)
    cubeRt.add(cubeSc);
    cubeTr.add(cubeRt);
    sg.add(cubeTr);

    //Zeichenflaeche2
    //TODO: rausfinden wieso in raytracer sobald die sphere drin is der hintergrund schwarz wird
    const sphere = new SphereNode(new Vector(1, 0.7, 0.7, 1))
    const sphereSc = new GroupNode(new Scaling(new Vector(1.2, 1.2, 1.2, 1.2)));
    const sphereTr = new GroupNode(new Translation(new Vector(-1, 0.7, 0, 0)));
    sphereSc.add(sphere);
    // sphereSc.add(textureHCILogo)
    sphereTr.add(sphereSc);
    sg.add(sphereTr);

    // const gn1 = new GroupNode(new Translation(new Vector(1.2, .5, 0, 0)));
    // cubeTr.add(gn1); //Translation an rotation
    // gn1.add(new SphereNode(new Vector(.4, 0, 0, 1))); //an translation dann spherenode
    //
    // const gn2 = new GroupNode(new Translation(new Vector(-0.8, 1, 1, 0)));
    // sphereTr.add(gn2);//an rotation neue translation hängen
    //
    // const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 0)));
    // gn2.add(gn3); //die neue translation anders scalen
    // const gn4 = new GroupNode(new Translation(new Vector(0,0,0,0)));
    // gn3.add(gn4) //neue groupnode an die wir ne neue sphere hängen
    //
    // gn4.add(new SphereNode(new Vector(0, 0, .3, 1)));

    let animationNodes = [
        new RotationNode(cubeRt, new Vector(0, 0, 1, 0)),
        // new RotationNode(gn4, new Vector(0, 0, 1, 0)),
    ]

//Rasterizer und RayTracer Wechseln
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const canvas2 = document.getElementById("rayTracer") as HTMLCanvasElement;

    const btn1 = document.getElementById('btnradio1') as HTMLInputElement;
    const btn2 = document.getElementById('btnradio2') as HTMLInputElement;

    let renderer = localStorage.getItem("renderer")
    console.log(renderer)
    if (renderer=="rasterizer"){
        btn1.checked = true
    } else {
        btn2.checked = true
    }
    console.log(btn1.checked)
    console.log(btn2.checked)
    if (btn1.checked) {
        // canvas2.style.visibility='hidden';
        // canvas.style.visibility='visible';
        rasterVisitor()
    } else if (btn2.checked) {
        // canvas.style.visibility='hidden';
        // canvas2.style.visibility='visible';
        btn2.checked = true
        rayVisitor()
    }

    function rasterVisitor() {
        canvas2.style.display = "none"
        canvas.style.display = "block"
        const gl = canvas.getContext("webgl2");
        const ctx = canvas2.getContext("2d");


        // setup for rendering
        const setupVisitor = new RasterSetupVisitor(gl);
        setupVisitor.setup(sg);

        const lightPositions = [
            new Vector(1, 1, 1, 1)
        ];
        const rayCamera = {
            origin: new Vector(0, 0, 0, 1),
            width: canvas.width,
            height: canvas.height,
            alpha: Math.PI / 3,
        };

        let camera = {
            eye: new Vector(0, 0, 0, 1), // camera-position
            center: new Vector(0, 0, -1, 1), //position camera is facing
            up: new Vector(0, 1, 0, 0), // up vector of camera
            fovy: 60,
            aspect: canvas.width / canvas.height,
            near: 0.1,
            far: 100,
        };

        const phongShader = new Shader(gl,
            phongVertexShaderPerspective,
            fragmentShader
        );
        const textureShader = new Shader(gl,
            textureVertexShader,
            textureFragmentShader
        );
        const visitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects);

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
            mouseVisitor.render(sg, rayCamera, lightPositions);
            setupVisitor.setup(sg);
            visitor.render(sg, camera, []);

        }, false);

        function mouseClickedOn(event: { clientX: number; }) {
            let mx = event.clientX - canvas.getBoundingClientRect().left;
        }



    }

    function rayVisitor() {
        canvas.style.display = "none"
        canvas2.style.display = "block"
        // canvas.hidden
        console.log("RayTracer")
        const ctx = canvas2.getContext("2d");
        ctx.font = "48px serif";
        ctx.fillText('RayTracer Seite', 0, 0);

        const lightPositions = [
            new Vector(1, 1, 1, 1)
        ];
        const camera = {
            origin: new Vector(0, 0, 0, 1),
            width: canvas.width,
            height: canvas.height,
            alpha: Math.PI / 3,
        };

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
            animationNodes[0].angle = animationTime / 2000;

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
            "dblclick", startAnimation);
        document.getElementById("stopAnimationBtn").addEventListener(
            "dblclick", () => cancelAnimationFrame(animationHandle));
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
    });
});


// let animationHandle: number;
//
// let lastTimestamp = 0;
// let animationTime = 0;
// let animationHasStarted = true;
// function animateRayTracer(timestamp: number){
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
// }


// // construct scene graph
// const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
// // //Texturen
// const textureGeist = new TextureBoxNode('geist.png');
// const textureHCILogo = new TextureBoxNode('hci-logo.png');
// const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
// const textureClose = new TextureBoxNode('Icons/close.png');
// const textureGeistText = new TextureBoxNode('Icons/geistText.png');
// const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
// //Taskbar
// const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.95, 0, 0)));
// const TaskBarSc = new GroupNode(new Scaling(new Vector(3, 0.1, 0.1, 0)))
// const TaskBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
// TaskBarSc.add(TaskBarBox)
// TaskBarTr.add(TaskBarSc);
// const TaskBarIconSc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
// const TaskBarIconTr = new GroupNode(new Translation(new Vector(0.8, 0, 0.03, 0)));
// const TaskBarIconTrBox = new GroupNode(new Translation(new Vector(0.6, 0, 0, 0)));
// const TaskBarIconScBox = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
// // //Icon Rosa Kreis
// const TaskBarIconSphere = new SphereNode(new Vector(1, 0.7, 0.7, 1));
// TaskBarIconSc.add(TaskBarIconSphere);
// TaskBarIconTr.add(TaskBarIconSc);
// TaskBarTr.add(TaskBarIconTr);
// // //Icon Viereck
// const TaskBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
// TaskBarIconScBox.add(TaskBarIconBox);
// TaskBarIconScBox.add(textureGeist)
// TaskBarIconTrBox.add(TaskBarIconScBox)
// TaskBarTr.add(TaskBarIconTrBox)
// //Header Transformations
// const headerBarTr = new GroupNode(new Translation(new Vector(0.5, 1.9, 0, 0)));
// const headerBarTr2 = new GroupNode(new Translation(new Vector(-0.58, 1.9, 0, 0)));
// //
// const headerBarSc = new GroupNode(new Scaling(new Vector(1, 0.1, 0.1, 0)))
// const headerBarSc2 = new GroupNode(new Scaling(new Vector(1, 0.1, 0.1, 0)))
// // //HeaderBoxen
// const headerBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
// headerBarSc.add(headerBarBox)
// headerBarTr.add(headerBarSc)
// TaskBarTr.add(headerBarTr)
// //
// headerBarSc2.add(headerBarBox)
// // headerBarSc2.add(textureGeistText)
// headerBarTr2.add(headerBarSc2)
// TaskBarTr.add(headerBarTr2)
// //HeaderBoxen für Namebeschriftung
// const headerBarTextTr = new GroupNode(new Translation(new Vector(0.55, 1.9, 0, 0)));
// const headerBarTextTr2 = new GroupNode(new Translation(new Vector(-0.5, 1.9, 0, 0)));
// //
// const headerBarTextSc = new GroupNode(new Scaling(new Vector(0.25, 0.09, 0.1, 0)))
// const headerBarTextSc2 = new GroupNode(new Scaling(new Vector(0.25, 0.09, 0.1, 0)))
// headerBarTextSc.add(headerBarBox)
// headerBarTextSc.add(textureKugelText)
// headerBarTextTr.add(headerBarTextSc)
// TaskBarTr.add(headerBarTextTr)
// //
// headerBarTextSc2.add(headerBarBox)
// headerBarTextSc2.add(textureGeistText)
// headerBarTextTr2.add(headerBarTextSc2)
// TaskBarTr.add(headerBarTextTr2)
// //
// // //HeaderBox1 Icon Transformations
// const headerBarIconBoxSc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
// const headerBarIconBoxTr = new GroupNode(new Translation(new Vector(-0.3, 0, 0, 0)));
// const headerBarIconBoxTr2 = new GroupNode(new Translation(new Vector(-0.4, 0, 0, 0)));
// const headerBarIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
// //HeaderBox2 Icons
// const headerBarIconBox2Tr = new GroupNode(new Translation(new Vector(-1.3, 0, 0, 0)));
// const headerBarIconBox2Tr2 = new GroupNode(new Translation(new Vector(-1.4, 0, 0, 0)));
// //
// //Header Icons (Vierecke, später Textur drauf)
// const headerBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
// headerBarIconBoxSc.add(headerBarIconBox);
// headerBarIconBoxSc.add(textureMinimize);
// headerBarIconBoxTr.add(headerBarIconBoxSc)
// headerBarTr.add(headerBarIconBoxTr)
// //
// const headerBarIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
// headerBarIconBoxSc2.add(headerBarIconBox2);
// headerBarIconBoxSc2.add(textureClose);
// headerBarIconBoxTr2.add(headerBarIconBoxSc2)
// headerBarTr.add(headerBarIconBoxTr2)
// //
// headerBarIconBox2Tr.add(headerBarIconBoxSc)
// headerBarTr.add(headerBarIconBox2Tr)
// headerBarIconBox2Tr2.add(headerBarIconBoxSc2)
// headerBarTr.add(headerBarIconBox2Tr2)
// //
// // //Zeichenflaeche 1
// const cube = new AABoxNode(new Vector(0, 0, 0, 0));
// const cubeSc = new GroupNode(new Scaling(new Vector(1, 1, 1, 1)));
// const cubeTr = new GroupNode(new Translation(new Vector(-0.5, 0, 0, 0)))
// const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
// cubeSc.add(cube);
// cubeSc.add(textureGeist)
// cubeRt.add(cubeSc);
// cubeTr.add(cubeRt)
// sg.add(cubeTr);
// // //Zeichenflaeche2
// const sphere = new SphereNode(new Vector(1, 0.7, 0.7, 1))
// // const sphereSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));
// // const sphereTr = new GroupNode(new Translation(new Vector(0.5, 0, 0, 0)));
// const sphereSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));
// const sphereTr = new GroupNode(new Translation(new Vector(0.5, 0, -1, 0)));
// sphereSc.add(sphere);
// // sphereSc.add(textureHCILogo)
// sphereTr.add(sphereSc);
// sg.add(sphereTr);
// //
