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
    const textureGeistText = new TextureBoxNode('Icons/geistText.png');
    const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
    const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
    const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
    sg.add(gnTr);

    //Taskbar
    const TaskBTr = new GroupNode(new Translation(new Vector(0, -.545, -1, 0)));
    const TaskBSc = new GroupNode(new Scaling(new Vector(1.2, 0.07, 0.0001, 0)))
    const TaskBBox = new AABoxNode(new Vector(0, 0, 0, 0));
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

    const TaskBIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBIconBoxSc.add(TaskBIconBox);
    TaskBIconBoxTr.add(TaskBIconBoxSc)
    sg.add(TaskBIconBoxTr)
    //HeaderBoxen
    // Erster Header
    const headerBTr = new GroupNode(new Translation(new Vector(-0.3, 1.08, 0, 0)));
    const headerBSc = new GroupNode(new Scaling(new Vector(0.6, 0.07, 0.0001, 0)))

    const headerBBox = new AABoxNode(new Vector(0, 0, 0, 0));
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

    headerBSc2.add(headerBBox)
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

    const lightPositions = [
        //new Vector(-0.1,0,-0.3,0),
        new Vector(1, 1, 1, 1)
    ];

    let animationNodes = [
        new RotationNode(cubeRt, new Vector(0, 0, 1, 0)),
        // new RotationNode(gn3, new Vector(0, 0, 1, 0)),
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
            phongFragmentShader
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
        let then = 0;

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