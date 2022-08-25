import Matrix from './matrix';
import Vector from './vector';
import Sphere from './sphere';
import Intersection from './intersection';
import Ray from './ray';
import Visitor from './visitor';
import phong from './phong';
import {
    Node, GroupNode, SphereNode,
    AABoxNode, TextureBoxNode, PyramidNode
} from './nodes';
import AABox from './aabox';

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

/**
 * Class representing a Visitor that uses
 * Raytracing to render a Scenegraph
 */
export default class mouseClickVisitor implements Visitor {
    /**
     * The image data of the context to
     * set individual pixels
     */
    imageData: ImageData;
    // TODO declare instance variables here
    model: Array<Matrix>
    inverse: Array<Matrix>
    intersection: Intersection | null;
    intersectionColor: Vector;
    ray: Ray;
    mousePos: { x : number, y : number}
    /**
     * Creates a new RayVisitor
     * @param context The 2D context to render to
     * @param width The width of the canvas
     * @param height The height of the canvas
     */
    constructor(
        private context: CanvasRenderingContext2D,
        width: number,
        height: number,
        //übergebener mouseray
        mousePos: { x: number; y: number },)
    {
        this.imageData = context.getImageData(0, 0, width, height);
        this.mousePos = mousePos;
        //added
    }
    /**
     * Renders the Scenegraph
     * @param rootNode The root node of the Scenegraph
     * @param camera The camera used
     * @param lightPositions The light light positions
     */
    render(
        rootNode: Node,
        camera: { origin: Vector, width: number, height: number, alpha: number },
        lightPositions: Array<Vector>
    ) {
        // clear
        let data = this.imageData.data;
        data.fill(0);
        // raytrace
        const width = this.imageData.width;
        const height = this.imageData.height;
        this.ray = Ray.makeMouseRay(this.mousePos.x, this.mousePos.y, camera);
        console.log(this.ray)
        // TODO initialize the matrix stack
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        this.intersection = null;
        rootNode.accept(this);
        // this.intersection wird in den visit methoden überschrieben --> nach rootNode.accept(this) ist in this.intersection die gesuchte Intersection gespeichert
        // TODO object manipulation einbauen; Manipulation passiert auch in den visit Methoden
    }
    /**
     * Visits a group node
     * @param node The node to visit
     */
    visitGroupNode(node: GroupNode) {
        // TODO traverse the graph and build the model matrix
        let children = node.children
        let matrix = node.transform.getMatrix()
        let inverseMatrix = node.transform.getInverseMatrix()
        let identity = this.model[this.model.length - 1]
        this.inverse.push(inverseMatrix)
        this.model.push(matrix)
        for (let child of children) {
            child.accept(this);
        }
        this.model.pop()
        this.inverse.pop()
    }
    /**
     * Visits a sphere node
     * @param node - The node to visit
     */
    visitSphereNode(node: SphereNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        // TODO assign the model matrix and its inverse
        for (let i = 0; i < this.model.length; i++) {
            toWorld = toWorld.mul(this.model[i]);
            fromWorld = this.inverse[i].mul(fromWorld);
        }
        console.log(node.color)
        const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
        let intersection = UNIT_SPHERE.intersect(ray);
        if (intersection) {
            const intersectionPointWorld = toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
            // @ts-ignore
            intersection = new Intersection(
                (intersectionPointWorld.x - this.ray.origin.x) / this.ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld,
                // node
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
                // this.intersection.node = node;
            }
        }
    }
    /**
     * Visits an axis aligned box node
     * @param node The node to visit
     */
    visitAABoxNode(node: AABoxNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        // TODO assign the model matrix and its inverse
        for (let i = 0; i < this.model.length; i++) {
            toWorld = toWorld.mul(this.model[i]);
            fromWorld = this.inverse[i].mul(fromWorld);
        }
        const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
        let intersection = UNIT_AABOX.intersect(ray);
        if (intersection) {
            const intersectionPointWorld = toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
            intersection = new Intersection(
                (intersectionPointWorld.x - this.ray.origin.x) / this.ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld,
                // node
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
                // this.intersection.node = node;
            }
        }
    }
    /**
     * Visits a textured box node
     * @param node The node to visit
     */
    visitTextureBoxNode(node: TextureBoxNode) {
    }

    visitPyramidNode(node: PyramidNode): void {
    }
}