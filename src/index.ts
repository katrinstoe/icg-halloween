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

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");


    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

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
    const headerBarIconScBox = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));
    const headerBarIconTrBox = new GroupNode(new Translation(new Vector(-0.8,0,0, 0)));
    const headerBarIconTrBox2 = new GroupNode(new Translation(new Vector(-0.9,0,0, 0)));
    const headerBarIconScBox2 = new GroupNode(new Scaling(new Vector(0.05,0.05,0.05,0.05)));


    //Header Icons (Vierecke, später Textur drauf)
    const headerBarIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarIconScBox.add(headerBarIconBox);
    headerBarIconTrBox.add(headerBarIconScBox)
    // headerBarTr.add(headerBarIconTrBox)
    headerBarTr.add(headerBarIconTrBox)

    const headerBarIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
    headerBarIconScBox2.add(headerBarIconBox2);
    headerBarIconTrBox2.add(headerBarIconScBox2)
    headerBarTr.add(headerBarIconTrBox2)

    const cube = new TextureBoxNode('geist.png');



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

    phongShader.load();
    textureShader.load();
    visitor.render(sg, camera, []);
});
