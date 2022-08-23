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
import perspectiveVertexShader from './perspective-vertex-shader.glsl';
import fragmentShader from './basic-fragment-shader.glsl'
import {Rotation, Scaling, Translation} from './transformation';
import textureVertexShader from "./texture-vertex-shader.glsl";
import textureFragmentShader from "./texture-fragment-shader.glsl";
import {DriverNode, RotationNode, ScalerNode} from "./animation-nodes";
import Ray from "./ray";
import Intersection from "./intersection";
import Sphere from "./sphere";
import AABox from "./aabox";
import RayVisitor from "./rayvisitor";
import phong from "./phong";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

window.addEventListener('load', function loadPage() {
    // construct scene graph
     const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
     //Texturen
     const textureGeist = new TextureBoxNode('geist.png');
     const textureHCILogo = new TextureBoxNode('hci-logo.png');
     const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
     const textureClose = new TextureBoxNode('Icons/close.png');
     const textureGeistText = new TextureBoxNode('Icons/geistText.png');
     const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
     //Taskbar
     const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.95, 0, 0)));
     const TaskBarSc = new GroupNode(new Scaling(new Vector(3, 0.1, 0.1, 0)))
     const TaskBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
     TaskBarSc.add(TaskBarBox)
     TaskBarTr.add(TaskBarSc);
     sg.add(TaskBarTr)
     //Icons Transformations
     const TaskBarIconSc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
     const TaskBarIconTr = new GroupNode(new Translation(new Vector(0.8, 0, 0.03, 0)));
     const TaskBarIconTrBox = new GroupNode(new Translation(new Vector(0.6, 0, 0, 0)));
     const TaskBarIconScBox = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
     //Icon Rosa Kreis
     const TaskBarIconSphere = new SphereNode(new Vector(1, 0.7, 0.7, 1));
     TaskBarIconSc.add(TaskBarIconSphere);
     TaskBarIconTr.add(TaskBarIconSc);
     TaskBarTr.add(TaskBarIconTr);
     //Icon Viereck
     const TaskBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
     TaskBarIconScBox.add(TaskBarIconBox);
     TaskBarIconScBox.add(textureGeist)
     TaskBarIconTrBox.add(TaskBarIconScBox)
     TaskBarTr.add(TaskBarIconTrBox)
     //Header Transformations
     const headerBarTr = new GroupNode(new Translation(new Vector(0.5, 1.9, 0, 0)));
     const headerBarTr2 = new GroupNode(new Translation(new Vector(-0.58, 1.9, 0, 0)));

     const headerBarSc = new GroupNode(new Scaling(new Vector(1, 0.1, 0.1, 0)))
     const headerBarSc2 = new GroupNode(new Scaling(new Vector(1, 0.1, 0.1, 0)))
     //HeaderBoxen
     const headerBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
     headerBarSc.add(headerBarBox)
     headerBarTr.add(headerBarSc)
     TaskBarTr.add(headerBarTr)

     headerBarSc2.add(headerBarBox)
     // headerBarSc2.add(textureGeistText)
     headerBarTr2.add(headerBarSc2)
     TaskBarTr.add(headerBarTr2)
     //HeaderBoxen für Namebeschriftung
     const headerBarTextTr = new GroupNode(new Translation(new Vector(0.55, 1.9, 0, 0)));
     const headerBarTextTr2 = new GroupNode(new Translation(new Vector(-0.5, 1.9, 0, 0)));

     const headerBarTextSc = new GroupNode(new Scaling(new Vector(0.25, 0.09, 0.1, 0)))
     const headerBarTextSc2 = new GroupNode(new Scaling(new Vector(0.25, 0.09, 0.1, 0)))
     headerBarTextSc.add(headerBarBox)
     headerBarTextSc.add(textureKugelText)
     headerBarTextTr.add(headerBarTextSc)
     TaskBarTr.add(headerBarTextTr)

     headerBarTextSc2.add(headerBarBox)
     headerBarTextSc2.add(textureGeistText)
     headerBarTextTr2.add(headerBarTextSc2)
     TaskBarTr.add(headerBarTextTr2)

     //HeaderBox1 Icon Transformations
     const headerBarIconBoxSc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
     const headerBarIconBoxTr = new GroupNode(new Translation(new Vector(-0.3, 0, 0, 0)));
     const headerBarIconBoxTr2 = new GroupNode(new Translation(new Vector(-0.4, 0, 0, 0)));
     const headerBarIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.05, 0.05)));
     //HeaderBox2 Icons
     const headerBarIconBox2Tr = new GroupNode(new Translation(new Vector(-1.3, 0, 0, 0)));
     const headerBarIconBox2Tr2 = new GroupNode(new Translation(new Vector(-1.4, 0, 0, 0)));

     //Header Icons (Vierecke, später Textur drauf)
     const headerBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
     headerBarIconBoxSc.add(headerBarIconBox);
     headerBarIconBoxSc.add(textureMinimize);
     headerBarIconBoxTr.add(headerBarIconBoxSc)
     headerBarTr.add(headerBarIconBoxTr)

     const headerBarIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
     headerBarIconBoxSc2.add(headerBarIconBox2);
     headerBarIconBoxSc2.add(textureClose);
     headerBarIconBoxTr2.add(headerBarIconBoxSc2)
     headerBarTr.add(headerBarIconBoxTr2)

     headerBarIconBox2Tr.add(headerBarIconBoxSc)
     headerBarTr.add(headerBarIconBox2Tr)
     headerBarIconBox2Tr2.add(headerBarIconBoxSc2)
     headerBarTr.add(headerBarIconBox2Tr2)

     //Zeichenflaeche 1
     const cube = new AABoxNode(new Vector(0, 0, 0, 0));
     const cubeSc = new GroupNode(new Scaling(new Vector(1, 1, 1, 1)));
     const cubeTr = new GroupNode(new Translation(new Vector(-0.5, 0, 0, 0)))
     const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
     cubeSc.add(cube);
     cubeSc.add(textureGeist)
     cubeRt.add(cubeSc);
     cubeTr.add(cubeRt)
     sg.add(cubeTr);
     //Zeichenflaeche2
     const sphere = new SphereNode(new Vector(1, 0.7, 0.7, 1))
     // const sphereSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));
     // const sphereTr = new GroupNode(new Translation(new Vector(0.5, 0, 0, 0)));
     const sphereSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));
    const sphereTr = new GroupNode(new Translation(new Vector(0.5, 0, -1, 0)));
     sphereSc.add(sphere);
     // sphereSc.add(textureHCILogo)
     sphereTr.add(sphereSc);
    sg.add(sphereTr);


   /* const sg = new GroupNode(new Translation(new Vector(-0.5, -0.5, -5, 0)));
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

    gn3.add(new SphereNode(new Vector(0, 0, .3, 1)));*/

    //kleiner driver geist
    const driverGhost = new TextureBoxNode("geist.png")
    const driverGhostSc = new GroupNode(new Scaling(new Vector(0.1, 0.1, 0.1, 1)))
    driverGhostSc.add(driverGhost);
    const driverGhostTr = new GroupNode(new Translation(new Vector(-0.75, -0.85, 0, 0)))
    driverGhostTr.add(driverGhostSc)
    sg.add(driverGhostTr)

    const ghostCastle = new TextureBoxNode("ghost_castle.jpg")
    const ghostCastleSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 1)))
    const ghostCastleTr = new GroupNode(new Translation(new Vector(-0.9, -0.8, -0.1, 0)))
    ghostCastleSc.add(ghostCastle)
    ghostCastleTr.add(ghostCastleSc)
    sg.add(ghostCastleTr)


    let animationNodes = [
        // new RotationNode(cubeRt, new Vector(0, 0, 1, 0)),
        new RotationNode(sphereTr, new Vector(0, 0, 1, 0)),
    ]

    let driverNodes = [
        //new RotationNode(cubeSc, new Vector(0,0,1,0)),
        new DriverNode(driverGhostTr, new Vector(-0.75,-0.85,0,0))
    ]

    let scalerNodes = [
        new ScalerNode(driverGhostSc, new Vector(0.1, 0.1, 0.1, 1))
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


        // setup for rendering
        const setupVisitor = new RasterSetupVisitor(gl);
        setupVisitor.setup(sg);

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
            perspectiveVertexShader,
            fragmentShader
        );
        const textureShader = new Shader(gl,
            textureVertexShader,
            textureFragmentShader
        );
        const visitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects);

        function simulate(deltaT: number) {
            for (let animationNode of driverNodes) {
                animationNode.simulate(deltaT);
            }
            for (let scalerNode of scalerNodes){
                scalerNode.simulate(deltaT);
            }
            for (let animationNode of animationNodes){
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
                case "ArrowLeft":
                    driverNodes[0].direction = "left"
                    driverNodes[0].active = true;
                    break;
                case "ArrowRight":
                    driverNodes[0].direction ="right"
                    driverNodes[0].active = true;
                    break;
                case "ArrowUp":
                    driverNodes[0].direction = "up"
                    driverNodes[0].active = true;
                    break;
                case "ArrowDown":
                    driverNodes[0].direction = "down"
                    driverNodes[0].active = true;
                    break;
                case "+":
                    scalerNodes[0].zoom = "in"
                    scalerNodes[0].active = true;
                    break;
                case "-":
                    scalerNodes[0].zoom = "out"
                    scalerNodes[0].active = true;
                    break;
                case "1":
                    for(let animationNode of animationNodes){
                        animationNode.toggleActive();
                    }
                    break;
            }
        });
        window.addEventListener('keyup', function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    driverNodes[0].active = false;
                    break;
                case "ArrowRight":
                    driverNodes[0].active = false;
                    break;
                case "ArrowUp":
                    driverNodes[0].active = false;
                    break;
                case "ArrowDown":
                    driverNodes[0].active = false;
                    break;
                case "+":
                    scalerNodes[0].active = false;
                    break;
                case "-":
                    scalerNodes[0].active = false;
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

        canvas.addEventListener('mousemove', function (evt) {
            let mousePos = getMousePos(canvas, evt);
            let rayFromMouse = new Ray(new Vector(mousePos.x / canvas.width, mousePos.y / canvas.height, 0, 0), new Vector(0, 0, -1, 1));
            let closestIntersection = Infinity;
            if (UNIT_SPHERE.intersect(rayFromMouse)) {
                console.log("Intersection Detected")
            }
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
            "click", startAnimation);
        document.getElementById("stopAnimationBtn").addEventListener(
            "click", () => cancelAnimationFrame(animationHandle));
    }

    window.addEventListener('click', function (){
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
