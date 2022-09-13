import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from '../mathOperations/vector';
import {
    GroupNode,
    SphereNode,
    AABoxNode
} from '../Nodes/nodes';
import {
    RasterVisitor,
    RasterSetupVisitor
} from '../Visitors/rastervisitor';
import Shader from '../Shaders/shader';
import vertexShader from '../Shaders/basic-vertex-shader.glsl';
import fragmentShader from '../Shaders/basic-fragment-shader.glsl';
import { Scaling, Translation } from '../mathOperations/transformation';
import RasterPyramid from "../Geometry/RasterGeometry/raster-pyramid";
import Pyramid from "../Geometry/RayGeometry/pyramid";

window.addEventListener('load', () => {
    const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl2");

    // construct scene graph
    const sg = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
    const gn1 = new GroupNode(new Translation(new Vector(.5, .3, 0, 0)));
    sg.add(gn1);
    const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.3, 0.2, 0)));
    gn1.add(gn3);
    const sphere1 = new SphereNode(new Vector(.8, .4, .1, 1))
    gn3.add(sphere1);
    const gn2 = new GroupNode(new Translation(new Vector(-.2, -0.2, 0, 0)));
    sg.add(gn2);
    const lightPositions = [
        new Vector(1, 1, 1, 1)
    ];

    // setup for rendering
    const setupVisitor = new RasterSetupVisitor(gl, lightPositions);
    setupVisitor.setup(sg);

    const shader = new Shader(gl,
        vertexShader,
        fragmentShader
    );
    // render
    const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);
    shader.load();
    visitor.render(sg, null, []);
});
