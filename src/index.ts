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
import textureVertexShader from "./texture-vertex-perspective-shader.glsl";
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
import Scenegraph from "./scenegraph";
import {CameraTranslatorNode, CameraRotationNode, CameraDriverNode} from "./camera-animation-nodes";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.5, -0.5, 0.5, 1), new Vector(0.5, -0.5, 0.5, 1), new Vector(0, -0.5, -0.5, 1), new Vector(0, 0.5, 0, 1), new Vector(0, 0, 0, 1))

window.addEventListener('load', function loadPage() {
    let {
        sg,
        scalerNodes,
        driverNodes,
        animationNodes,
        gl,
        ctx,
        kDElement,
        kSElement,
        kAElement,
        shininessElement,
        canvas,
        canvas2
    } = Scenegraph.getScenegraph();
    // let {sg, scalerNodes, driverNodes, animationNodes, gl, ctx, kDElement, kSElement, kAElement, shininessElement, canvas, canvas2} = Scenegraph.getTicTacToe();
    const btn1 = document.getElementById('btnradio1') as HTMLInputElement;
    const btn2 = document.getElementById('btnradio2') as HTMLInputElement;

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

        console.log(setupVisitor.objects)

        let animationTime = 0;

        function simulate(deltaT: number) {
            animationTime += deltaT;
            for (let animationNode of animationNodes) {
                animationNode.simulate(deltaT);
                lightPositions = lightPositionsVisitor.visit(sg);
            }

            for (let driverNode of driverNodes) {
                driverNode.simulate(deltaT);
            }

            for (let scalerNode of scalerNodes) {
                scalerNode.simulate(deltaT);
            }

            for (let cameraDriverNode of CameraDriverNodes){
                cameraDriverNode.simulate(deltaT);
            }
        }

        let lastTimestamp = performance.now();
        let then = 0;

        function animate(timestamp: number) {
            simulate((timestamp - lastTimestamp) / 10);
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
        // lightPositionXElement.onchange = function () {
        //     let lightPositionX = Number(lightPositionXElement.value)
        //     for (let lightPosition of lightPositions) {
        //         lightPosition.x = lightPositionX;
        //     }
        //     // lightPositions = Number(lightPositionXElement.value);
        //     console.log(camera.lightPositions)
        // }


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
                    driverNodes[0].direction = "right"
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

        let lastTexture = {zahl: 0};
        window.addEventListener('click', function (evt) {
            let mousePos = getMousePos(canvas, evt);
            let mouseVisitor = new mouseClickVisitor(ctx, canvas.width, canvas.height, mousePos, lastTexture);
            // lastTexture++;
            mouseVisitor.render(sg, camera, lightPositions);
            setupVisitor.setup(sg);
            //visitor.render(sg, camera, camera.lightPositions);
            console.log("TextureCount nach listener: " + lastTexture)
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
