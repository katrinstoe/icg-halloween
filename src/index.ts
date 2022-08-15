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
import {MoverNode, RotationNode, ScalerNode} from "./animation-nodes";
import Ray from "./ray";
import Intersection from "./intersection";
import Sphere from "./sphere";
import AABox from "./aabox";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
var copyVideo = false;


window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");
    const videoElement = document.getElementById("video");
    const video = setupVideo('video.ogv');

    // construct scene graph
    const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0),0));
    //Texturen
    const textureGeist = new TextureBoxNode('geist.png');
    const textureHCILogo = new TextureBoxNode('hci-logo.png');
    const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
    const textureClose = new TextureBoxNode('Icons/close.png');
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
    const headerBarTr = new GroupNode(new Translation(new Vector(0.5, 1.9, 0, 0)));
    const headerBarTr2 = new GroupNode(new Translation(new Vector(-0.58, 1.9, 0, 0)));

    const headerBarSc = new GroupNode(new Scaling(new Vector(1,0.1,0.1,0)))
    const headerBarSc2 = new GroupNode(new Scaling(new Vector(1,0.1,0.1,0)))

    const headerBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarSc.add(headerBarBox)
    headerBarTr.add(headerBarSc)
    TaskBarTr.add(headerBarTr)

    headerBarSc2.add(headerBarBox)
    headerBarTr2.add(headerBarSc2)
    TaskBarTr.add(headerBarTr2)
    //HeaderBox1 Icon Transformations
    const headerBarIconBoxSc = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    const headerBarIconBoxTr = new GroupNode(new Translation(new Vector(-0.3,0,0, 0)));
    const headerBarIconBoxTr2 = new GroupNode(new Translation(new Vector(-0.4,0,0, 0)));
    const headerBarIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    //HeaderBox2 Icons
    const headerBarIconBox2Tr = new GroupNode(new Translation(new Vector(-1.3,0,0, 0)));
    const headerBarIconBox2Tr2 = new GroupNode(new Translation(new Vector(-1.4,0,0, 0)));

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
    const cube = new AABoxNode(new Vector(0,0,0,0));
    const cubeSc = new GroupNode(new Scaling(new Vector(1,1,1,1)));
    const cubeTr = new GroupNode(new Translation(new Vector(-0.5, 0, 0, 0)))
    const cubeRt = new GroupNode(new Rotation(new Vector(0,1,0,0), 1));
    cubeSc.add(cube);
    cubeSc.add(textureGeist)
    cubeRt.add(cubeSc);
    cubeTr.add(cubeRt)
    sg.add(cubeTr);
    //Zeichenflaeche2
    const sphere = new SphereNode(new Vector(1,0.7,0.7,1))
    const sphereSc = new GroupNode(new Scaling(new Vector(0.4,0.4,0.4,1)));
    const sphereTr = new GroupNode(new Translation(new Vector(0.5,0,0,0)));
    sphereSc.add(sphere);
    // sphereSc.add(textureHCILogo)
    sphereTr.add(sphereSc);
    sg.add(sphereTr);



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

    function mouseClickedOn(event: { clientX: number; }){
        let mx = event.clientX - canvas.getBoundingClientRect().left;
    }


    canvas.addEventListener('click', ()=>{

        alert("angeklickt");
    })

});


function setupVideo(url: string) {
    const video = document.createElement('video');

    var playing = false;
    var timeupdate = false;

    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    video.addEventListener('playing', function() {
        playing = true;
        checkReady();
    }, true);

    video.addEventListener('timeupdate', function() {
        timeupdate = true;
        checkReady();
    }, true);

    video.src = url;
    video.play();

    function checkReady() {
        if (playing && timeupdate) {
            copyVideo = true;
        }
    }
    return video;
}
