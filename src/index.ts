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

    const faktorTaskBar = canvas.height/2000
    console.log(faktorTaskBar)
    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const gn1 = new GroupNode(new Translation(new Vector(0, -0.9, 0, 0)));
    sg.add(gn1);
    const gn2 = new GroupNode(new Rotation(new Vector(1,1,1,0), 45));
    gn1.add(gn2);
    const gn3 = new GroupNode(new Scaling(new Vector(3,0.1,0.1,0)))
    gn2.add(gn3)
    const cube = new AABoxNode(new Vector(0, 0, 0, 0));
    gn3.add(cube);


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
