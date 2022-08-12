import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode
} from './nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from './rastervisitor';
import Shader from './shader';
import perspectiveVertexShader from './perspective-vertex-shader.glsl';
import fragmentShader from './basic-fragment-shader.glsl'
import {Rotation, Scaling, Translation} from './transformation';

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");


    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));


    //Taskbar
    const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.93, 0, 0)));
    sg.add(TaskBarTr);
    const TaskBarRo = new GroupNode(new Rotation(new Vector(1,1,1,0), 45));
    TaskBarTr.add(TaskBarRo);
    const TaskBarSc = new GroupNode(new Scaling(new Vector(3,0.1,0.1,0)))
    TaskBarRo.add(TaskBarSc)
    const TaskBarBox = new AABoxNode(new Vector(0, 0, 0, 0));
    TaskBarSc.add(TaskBarBox);

    //Icons
    const TaskBarIconSc = new GroupNode(new Scaling(new Vector(0.065,0.065,0.065,0.065)));
    const TaskBarIconTr = new GroupNode(new Translation(new Vector(0.8,0,0.03, 0)));

    //Icon Rosa Kreis
    const TaskBarIconSphere = new SphereNode(new Vector(1,0.7,0.7,1));
    TaskBarIconSc.add(TaskBarIconSphere);
    TaskBarIconTr.add(TaskBarIconSc);
    TaskBarTr.add(TaskBarIconTr);


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
    const shader = new Shader(gl,
        perspectiveVertexShader,
        fragmentShader
    );
    const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);

    shader.load();
    visitor.render(sg, camera, []);
});
