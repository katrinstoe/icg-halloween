import Matrix from '../mathOperations/matrix';
import Vector from '../mathOperations/vector';
import Sphere from '../Geometry/RayGeometry/sphere';
import Intersection from '../RayTracing/intersection';
import Ray from '../RayTracing/ray';
import Visitor from './visitor';
import {
    Node, GroupNode, SphereNode,
    AABoxNode, TextureBoxNode, PyramidNode, CameraNode, LightNode, TexturePyramidNode
    , TextureVideoBoxNode,
    AABoxButtonNode,
    TextureBoxButtonNode, TicTacToeTextureNode, TextureTextBoxNode
} from '../Nodes/nodes';
import AABox from '../Geometry/RayGeometry/aabox';
import Pyramid from "../Geometry/RayGeometry/pyramid";
import Camera from "../Camera/camera";
import Scenegraph from "../scenegraph";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.5, -0.5, 0.5, 1), new Vector(0.5, -0.5, 0.5, 1), new Vector(0, -0.5, -0.5, 1), new Vector(0, 0.5, 0, 1), new Vector(0, 0, 0, 1));

/**
 * Class representing a Visitor traverses sg on Click
 */
export default class mouseClickVisitor extends Visitor {
    /**
     * The image data of the context to
     * set individual pixels
     */
    imageData: ImageData;
    //instance variables here
    model: Array<Matrix>
    inverse: Array<Matrix>
    intersection: Intersection | null;
    intersectionColor: Vector;
    ray: Ray;
    mousePos: { x: number, y: number }
    animation: () => void;

    lastTexture: {zahl: number}

    /**
     * Creates a new MousclickVisitor
     * @param context The 2D context to render to
     * @param width The width of the canvas
     * @param height The height of the canvas
     * @param mousePos The position of the mouse
     * @param lastTexture the last texture
     */
    constructor(
        private context: CanvasRenderingContext2D,
        width: number,
        height: number,
        //├╝bergebener mouseray
        mousePos: { x: number; y: number }, lastTexture: {zahl: number}) {
        super()
        this.imageData = context.getImageData(0, 0, width, height);
        this.mousePos = mousePos;
        this.lastTexture = lastTexture;
    }

    /**
     * Renders the Scenegraph
     * @param rootNode The root node of the Scenegraph
     * @param camera The camera used
     * @param lightPositions The light light positions
     * @param inverseView The inverse of the view matrix
     */
    render(
        rootNode: Node,
        camera: Camera,
        lightPositions: Array<Vector>,
        inverseView: Matrix
    ) {
        // clear
        let data = this.imageData.data;
        data.fill(0);
        // raytrace
        const width = this.imageData.width;
        const height = this.imageData.height;
        this.ray = Ray.makeRay(this.mousePos.x, this.mousePos.y, camera);
        //initialize the matrix stack
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        this.intersection = null;
        this.ray.direction = inverseView.mulVec(this.ray.direction)
        this.ray.origin = inverseView.mulVec(this.ray.origin)
        rootNode.accept(this);
        // this.intersection wird in den visit methoden ├╝berschrieben --> nach rootNode.accept(this) ist in this.intersection die gesuchte Intersection gespeichert
        if (this.animation) {
            this.animation();
        }
    }


    /**
     * Visits a group node
     * @param node The node to visit
     */
    visitGroupNode(node: GroupNode) {
        //traverse the graph and build the model matrix
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
     * Visits an aabox button node
     * @param node The node to visit
     */
    visitAABoxButtonNode(node: AABoxButtonNode): void {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
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
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
                this.animation = node.animate;
            }
        }
    }


    /**
     * Visits a texture box button node
     * @param node The node to visit
     */
    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
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
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.animation = node.animate;
            }
        }
    }




    /**
     * Visits a sphere node
     * @param node - The node to visit
     */
    visitSphereNode(node: SphereNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
        for (let i = 0; i < this.model.length; i++) {
            toWorld = toWorld.mul(this.model[i]);
            fromWorld = this.inverse[i].mul(fromWorld);
        }
        const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());

        let intersection = UNIT_SPHERE.intersect(ray);
        if (intersection) {
            const intersectionPointWorld = toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
            intersection = new Intersection(
                (intersectionPointWorld.x - this.ray.origin.x) / this.ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld,
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
            }
            node.color = new Vector(Math.floor((Math.random() * 3) + 1)/10,Math.floor((Math.random() * 3) + 1)/10,Math.floor((Math.random() * 3) + 1)/10,1)
        }
    }
    /**
     * Visits an axis aligned box node
     * @param node The node to visit
     */
    visitAABoxNode(node: AABoxNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
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
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
            }
        }
    }

    /**
     * Visits a textured box node
     * @param node The node to visit
     */
    visitTextureBoxNode(node: TextureBoxNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
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
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
            }
        }
    }



    visitPyramidNode(node: PyramidNode) {

        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
        for (let i = 0; i < this.model.length; i++) {
            toWorld = toWorld.mul(this.model[i]);
            fromWorld = this.inverse[i].mul(fromWorld);
        }
        const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
        let intersection = UNIT_PYRAMID.intersect(ray);
        if (intersection) {
            const intersectionPointWorld = toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
            intersection = new Intersection(
                (intersectionPointWorld.x - this.ray.origin.x) / this.ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld,
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
            }
        }
    }


    /**
     * Visits a tic tac toe texture node
     * @param node The node to visit
     */
    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        //assign the model matrix and its inverse
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
            );
        /**
         * Bis hier noch normale TextureBox
         * Jetzt checken wir hier ob auf die Box schonmal gedr├╝ckt wurde
         * wenn ja wird keine neue Texture gesetted
         * Falls nein schauen wir welche Texture zuletzt gesetzt wurde und setzen jenachdem Vampir-Tino oder Zauberer-Matthias
         * sollte die Box die Texture des Reset buttons haben werden alle im Scenengraph ins W├╝rfel-Array gespeicherten W├╝rfel wieder auf die Ausgangstextur gesetzt
         * lastTexture wird in index hochgez├Ąhlt
         * */
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                if (node.amountOfSwitches < 1) {
                    this.intersection = intersection;
                    if (node.texture == node.textureArray[0] && isEven(this.lastTexture.zahl)) {
                        node.activeTexture = node.textureArray[1]
                        node.texture = node.textureArray[1]
                        this.lastTexture.zahl++;
                    } else if (isOdd(this.lastTexture.zahl)&&node.texture == node.textureArray[0]){
                        node.activeTexture = node.textureArray[2]
                        node.texture = node.textureArray[2]
                        this.lastTexture.zahl++;
                    } else if (node.texture == node.textureArray[3]){
                        node.activeTexture = node.textureArray[3]
                        for (let ticTacToeTextureNode of Scenegraph.wuerfelArray) {
                            ticTacToeTextureNode.texture = node.textureArray[0]
                        }
                    }
                    node.amountOfSwitches += 1
                }
            }

        }
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    }

    visitTexturePyramidNode(node: TexturePyramidNode) {
    }

    visitCameraNode(node: CameraNode): void {
    };

    visitLightNode(node: LightNode): void {
    };

    visitTextureTextBoxNode(node: TextureTextBoxNode){
    };

}
/**
 * um zu schauen ob der lastIndex gerade Zahl oder ungerade war um jetzt andere Textur zu setzen
 * */
//https://stackoverflow.com/questions/6211613/testing-whether-a-value-is-odd-or-even
function isEven(n: number) {
    return n % 2 == 0;
}

function isOdd(n: number) {
    return Math.abs(n % 2) == 1;
}