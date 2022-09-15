import {
    AABoxButtonNode,
    AABoxNode, CameraNode,
    GroupNode, LightNode,
    Node,
    PyramidNode,
    SphereNode,
    TextureBoxNode,
    TexturePyramidNode, TextureTextBoxNode,
    TextureVideoBoxNode, TicTacToeTextureNode
} from "../Nodes/nodes";
import Vector from "../mathOperations/vector";
import RasterSphere from "../Geometry/RasterGeometry/raster-sphere";
import RasterBox from "../Geometry/RasterGeometry/raster-box";
import RasterTextureBox from "../Geometry/RasterGeometry/raster-texture-box";
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import RasterPyramid from "../Geometry/RasterGeometry/raster-pyramid";
import RasterTexturePyramid from "../Geometry/RasterGeometry/raster-texture-pyramid";
import RasterTextureTictactoeBox from "../Geometry/RasterGeometry/raster-texture-tictactoeBox";
import {Renderable} from "./rastervisitor";
import TextureTextBox from "../Geometry/RasterGeometry/texture-text-box";

/**
 * Class representing a Visitor that sets up buffers
 * for use by the RasterVisitor
 * */
export class RasterSetupVisitor {
    /**
     * The created render objects
     */
    public objects: WeakMap<Node, Renderable>
    public lightpositions: Array<Vector>;


    /**
     * Creates a new RasterSetupVisitor
     * @param context The 3D context in which to create buffers
     */
    constructor(private gl: WebGL2RenderingContext, lightPositions: Array<Vector>) {
        this.objects = new WeakMap();
        this.lightpositions = lightPositions;
    }

    /**
     * Sets up all needed buffers
     * @param rootNode The root node of the Scenegraph
     */
    setup(rootNode: Node) {
        // Clear to white, fully opaque
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // Clear everything
        this.gl.clearDepth(1.0);
        // Enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);

        rootNode.accept(this);
    }

    /**
     * Visits a group node
     * @param node The node to visit
     */
    visitGroupNode(node: GroupNode) {
        for (let child of node.children) {
            child.accept(this);
        }
    }

    /**
     * Visits a sphere node
     * @param node - The node to visit
     */
    visitSphereNode(node: SphereNode) {
        this.objects.set(
            node,
            new RasterSphere(
                this.gl,
                new Vector(0, 0, 0, 1), 1,
                node.color,
                // this.lightpositions
            )
        );
    }

    /**
     * Visits an axis aligned box node
     * @param  {AABoxNode} node - The node to visit
     */
    visitAABoxNode(node: AABoxNode) {
        this.objects.set(
            node,
            new RasterBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.color,
                // this.lightpositions
            )
        );
    }

    /**
     * Visits a textured box node. Loads the texture
     * and creates a uv coordinate buffer
     * @param  {TextureBoxNode} node - The node to visit
     */
    visitTextureBoxNode(node: TextureBoxNode) {
        this.objects.set(
            node,
            new RasterTextureBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.texture
            )
        );
    }

    /**
     * Visits a textured box node. Loads the texture
     * and creates a uv coordinate buffer
     * @param  {TextureBoxNode} node - The node to visit
     */
    visitTextureTextBoxNode(node: TextureTextBoxNode) {
        this.objects.set(
            node,
            new TextureTextBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
            )
        );
    }


    /**
     * Visits a textured box node. Loads the texture
     * and creates a uv coordinate buffer
     * @param  {TextureBoxNode} node - The node to visit
     */
    visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
        this.objects.set(
            node,
            new TextureVideoBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.texture
            )
        );
    }



    /**
     * Visits a pyramid node
     * @param node - The node to visit
     */
    visitPyramidNode(node: PyramidNode) {
        this.objects.set(
            node,
            new RasterPyramid(
                this.gl,
                new Vector(-1, -1, -1, 1),
                new Vector(1 , -1, 0, 1),
                new Vector(-1, -1, 1, 1),
                new Vector(-0.25, 1, 0, 1),
                node.color,
                // this.lightpositions
            ),
        );
    }
    /**
     * Visits a textured box node. Loads the texture
     * and creates a uv coordinate buffer
     * @param  {TextureBoxNode} node - The node to visit
     */
    visitTexturePyramidNode(node: TexturePyramidNode) {
        this.objects.set(
            node,
            new RasterTexturePyramid(
                this.gl,
                new Vector(-0.25, 1, 0, 1),
                new Vector(-1, -1, -1, 1),
                new Vector(1 , -1, 0, 1),
                new Vector(-1, -1, 1, 1),
                node.texture
            )
        );
    }

    visitTextureBoxButtonNode(node: TextureBoxNode) {
        this.objects.set(
            node,
            new RasterTextureBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.texture
            )
        );
    }

    visitAABoxButtonNode(node: AABoxButtonNode) {
        this.objects.set(
            node,
            new RasterBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.color
            )
        );
    }
    visitTicTacToeTextureNode(node: TicTacToeTextureNode){
        this.objects.set(
            node,
            new RasterTextureTictactoeBox(
                this.gl,
                new Vector(-0.5, -0.5, -0.5, 1),
                new Vector(0.5, 0.5, 0.5, 1),
                node.texture
            )
        );
    }

    visitCameraNode(node: CameraNode) {
    };
    visitLightNode(node: LightNode) {
    };
}