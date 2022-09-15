import Matrix from '../mathOperations/matrix';
import Vector from '../mathOperations/vector';
import Sphere from '../Geometry/RayGeometry/sphere';
import Intersection from '../RayTracing/intersection';
import Ray from '../RayTracing/ray';
import Visitor from './visitor';
import phong from '../RayTracing/phong';
import {
    Node,
    GroupNode,
    SphereNode,
    AABoxNode,
    TextureBoxNode,
    PyramidNode,
    CameraNode,
    LightNode,
    TexturePyramidNode,
    AABoxButtonNode,
    TextureBoxButtonNode,
    TicTacToeTextureNode,
    AnimationNode
} from '../Nodes/nodes';
import AABox from '../Geometry/RayGeometry/aabox';
import Pyramid from "../Geometry/RayGeometry/pyramid";
import RasterTexturePyramid from "../Geometry/RasterGeometry/raster-texture-pyramid";
import Camera from "../Camera/camera";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-1, -1, -1, 1), new Vector(1, -1, 0, 1), new Vector(-1, -1, 1, 1), new Vector(-0.25, 1, 0, 1), new Vector(1, 0, 0, 1))

/**
 * Class representing a Visitor that uses
 * Raytracing to render a Scenegraph
 */
export default class RayVisitor implements Visitor {
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

    /**
     * Creates a new RayVisitor
     * @param context The 2D context to render to
     * @param width The width of the canvas
     * @param height The height of the canvas
     */
    constructor(
        private context: CanvasRenderingContext2D,
        width: number,
        height: number
    ) {
        this.imageData = context.getImageData(0, 0, width, height);
    }

    visitAnimationNode(node: AnimationNode): void {
    }

    /**
     * Renders the Scenegraph
     * @param rootNode The root node of the Scenegraph
     * @param camera The camera used
     * @param lightPositions The light positions
     */
    render(
        rootNode: Node,
        camera: Camera,
        lightPositions: Array<Vector>
    ) {
        // clear
        let data = this.imageData.data;
        data.fill(0);

        // raytrace
        const width = this.imageData.width;
        const height = this.imageData.height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.ray = Ray.makeRay(x, y, camera);

                // TODO initialize the matrix stack
                this.model = new Array<Matrix>(Matrix.identity())
                this.inverse = new Array<Matrix>(Matrix.identity())
                this.intersection = null;
                rootNode.accept(this);

                if (this.intersection) {
                    if (!this.intersectionColor) {
                        data[4 * (width * y + x) + 0] = 0;
                        data[4 * (width * y + x) + 1] = 0;
                        data[4 * (width * y + x) + 2] = 0;
                        data[4 * (width * y + x) + 3] = 255;
                    } else {
                        let color = phong(this.intersectionColor, this.intersection, camera.shininess, camera.origin, camera.kS, camera.kD, camera.kA, lightPositions);
                        data[4 * (width * y + x) + 0] = color.r * 255;
                        data[4 * (width * y + x) + 1] = color.g * 255;
                        data[4 * (width * y + x) + 2] = color.b * 255;
                        data[4 * (width * y + x) + 3] = 255;
                    }
                }
            }
        }
        this.context.putImageData(this.imageData, 0, 0);
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


        const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
        let intersection = UNIT_SPHERE.intersect(ray);

        if (intersection) {
            const intersectionPointWorld = toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
            intersection = new Intersection(
                (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
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
                (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld
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
    }

  /**
   * Visits a textured Video box node
   * @param node The node to visit
   */
  visitTextureVideoBoxNode(node: TextureBoxNode) {}


    /**
     * Visits a Pyramid node
     * @param node The node to visit
     */
    visitPyramidNode(node: PyramidNode) {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        // TODO assign the model matrix and its inverse
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
                (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
            }
        }
    }

    /**
     * Visits a textured pyramid node
     * @param node The node to visit
     */
    visitTexturePyramidNode(node: TexturePyramidNode) {
    }

    //TODO: implementieren
    visitCameraNode(node: CameraNode) {
    };

    visitLightNode(node: LightNode) {
    };

    visitAABoxButtonNode(node: AABoxButtonNode): void {
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
                (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.color;
            }
        }
    }

    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    }
}