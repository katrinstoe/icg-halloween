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
import {RotationNode} from "./animation-nodes";
import Ray from "./ray";
import Intersection from "./intersection";
import Sphere from "./sphere";
import AABox from "./aabox";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");


    // construct scene graph
    const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0),0));
    //Texturen
    const textureGeist = new TextureBoxNode('geist.png');
    const textureHCILogo = new TextureBoxNode('hci-logo.png');
    //Taskbar
    const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.95, 0, 0)));
    const TaskBarSc = new GroupNode(new Scaling(new Vector(3,0.1,0.1,0)))
    const TaskBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBarSc.add(TaskBarBox)
    TaskBarTr.add(TaskBarSc);
    sg.add(TaskBarTr)
    //Icons Transformations
    const TaskBarIconSc = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    const TaskBarIconTr = new GroupNode(new Translation(new Vector(0.8,0,0.03, 0)));
    const TaskBarIconTrBox = new GroupNode(new Translation(new Vector(0.6,0,0, 0)));
    const TaskBarIconScBox = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    //Icon Rosa Kreis
    const TaskBarIconSphere = new SphereNode(new Vector(1,0.7,0.7,1));
    TaskBarIconSc.add(TaskBarIconSphere);
    TaskBarIconTr.add(TaskBarIconSc);
    TaskBarTr.add(TaskBarIconTr);
    //Icon Viereck
    const TaskBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBarIconScBox.add(TaskBarIconBox);
    TaskBarIconScBox.add(textureGeist)
    TaskBarIconTrBox.add(TaskBarIconScBox)
    TaskBarTr.add(TaskBarIconTrBox)
    //Header
    const headerBarTr = new GroupNode(new Translation(new Vector(0, 1.9, 0, 0)));
    const headerBarSc = new GroupNode(new Scaling(new Vector(3,0.1,0.1,0)))
    const headerBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarSc.add(headerBarBox)
    headerBarTr.add(headerBarSc)
    TaskBarTr.add(headerBarTr)
    //Header Icon Transformations
    const headerBarIconBoxSc = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    const headerBarIconBoxTr = new GroupNode(new Translation(new Vector(-0.8,0,0, 0)));
    const headerBarIconBox2Tr = new GroupNode(new Translation(new Vector(-0.9,0,0, 0)));
    const headerBarIconBox2Sc = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    //Header Icons (Vierecke, später Textur drauf)
    const headerBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarIconBoxSc.add(headerBarIconBox);
    headerBarIconBoxTr.add(headerBarIconBoxSc)
    headerBarTr.add(headerBarIconBoxTr)
    const headerBarIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarIconBox2Sc.add(headerBarIconBox2);
    headerBarIconBox2Tr.add(headerBarIconBox2Sc)
    headerBarTr.add(headerBarIconBox2Tr)
    //TryOut
    const cube = new AABoxNode(new Vector(0,0,0,0));
    const cubeSc = new GroupNode(new Scaling(new Vector(1,1,1,1)));
    const cubeRt = new GroupNode(new Rotation(new Vector(0,1,0,0), 1));
    cubeSc.add(cube);
    cubeSc.add(textureGeist)
    cubeRt.add(cubeSc);
    sg.add(cubeRt);


    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl);
    setupVisitor.setup(sg);

    const camera = {
        eye: new Vector(0, 0, -1, 1),
        center: new Vector(0, 0, 0 ,1),
        up: new Vector(0, 1, 0, 0),
        fovy: 60,
        aspect: canvas.width / canvas.height,
        near: 0.1,
        far: 100
    };

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
        new RotationNode(cubeRt, new Vector(0,0,1,0)),
    ]

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

    canvas.addEventListener('mousemove', function(evt) {
        let mousePos = getMousePos(canvas, evt);
        let rayFromMouse = new Ray(new Vector(mousePos.x/canvas.width, mousePos.y/canvas.height,0,0), new Vector(0,0,-1,1));
        let closestIntersection = Infinity;
        if(UNIT_SPHERE.intersect(rayFromMouse)){
            console.log("Intersection Detected")
        }
    }, false);
});
