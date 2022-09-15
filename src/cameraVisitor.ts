import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode,
    Node,
    PyramidNode,
    SphereNode, TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "./nodes";
import Vector from "./vector";
import Matrix from "./matrix";
import Camera from "./camera";

export class CameraVisitor implements Visitor {
    model: Array<Matrix>
    inverse: Array<Matrix>
    public cameraVectors: Array<Vector>
    public cameraValues: Array<number>
    public lightPositions: Array<Vector>
    cameraPosition: Matrix

    //cameraNodes: Array<LightNode>


    constructor() {
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
    }

    visit(rootNode: Node): Camera {
        // traverse and render
        this.cameraValues = []
        this.cameraVectors = []
        this.lightPositions = []
        rootNode.accept(this);
        let camera = new Camera(this.cameraVectors[0], this.cameraVectors[1], this.cameraVectors[2], this.cameraVectors[3], this.cameraValues[0], this.cameraValues[1], this.cameraValues[2], this.cameraValues[3], this.cameraValues[4], this.cameraValues[5], this.cameraValues[6], this.cameraValues[7], this.cameraValues[8])
        return camera
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitCameraNode(node: CameraNode): void {
        this.cameraVectors.push(node.camera.origin)
        this.cameraVectors.push(node.camera.eye)
        this.cameraVectors.push(node.camera.center)
        this.cameraVectors.push(node.camera.up)
        this.cameraValues.push(node.camera.fovy)
        this.cameraValues.push(node.camera.near)
        this.cameraValues.push(node.camera.far)
        this.cameraValues.push(node.camera.width)
        this.cameraValues.push(node.camera.height)
        this.cameraValues.push(node.camera.shininess)
        this.cameraValues.push(node.camera.kS)
        this.cameraValues.push(node.camera.kD)
        this.cameraValues.push(node.camera.kA)
    }

    /**
     * Visits a group node
     * @param node The node to visit
     */
    visitGroupNode(node: GroupNode) {
        let children = node.getchildren()
        let matrix = node.transform.getMatrix()
        let inverseMatrix = node.transform.getInverseMatrix()
        this.model.push(this.model[this.model.length-1].mul(matrix))
        this.inverse.push(inverseMatrix.mul(this.inverse[this.inverse.length-1]))

        for (let child of children){
            child.accept(this)
        }
        this.model.pop()
        this.inverse.pop()
    }

    visitLightNode(node: LightNode): void {
    }

    visitTexturePyramidNode(node: TexturePyramidNode) {
    }

    visitPyramidNode(node: PyramidNode): void {
    }

    visitSphereNode(node: SphereNode): void {
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
    }

    visitTextureBoxButtonNode(node: TextureBoxButtonNode) {
    }

    visitAABoxButtonNode(node: AABoxButtonNode) {
    }
}
