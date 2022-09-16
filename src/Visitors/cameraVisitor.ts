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
    TexturePyramidNode, TextureTextBoxNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import Vector from "../mathOperations/vector";
import Matrix from "../mathOperations/matrix";
import Camera from "../Camera/camera";
import {
    AnimationNode,
    DriverNode,
    MinMaxNode,
    RotationNode,
    ScalerNode,
    SlerpNode,
} from "../Nodes/animation-nodes";

/**
 * Klasse, die einen Visitor für die Kamera repräsentiert
 */
export class CameraVisitor implements Visitor {
    model: Array<Matrix>
    inverse: Array<Matrix>
    public cameraVectors: Array<Vector>
    public cameraValues: Array<number>
    public lightPositions: Array<Vector>

    /**
     * Die View Matrix der Kamera
     */
    public view: Matrix

    /**
     * Die Invers Matrix der View Matrix
     */
    public inverseView: Matrix


    constructor() {
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
    }

    visitTextureTextBoxNode(node: TextureTextBoxNode): void {
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
    }

    /**
     * Besucht die rootnode und geht dann durch den Szenengraph
     * @param rootNode die rootnode, die besucht werden soll
     * @return {camera, view, inverseView} gibt die Kamera, die View Matrix und das Invers
     * der View Matrix zurück
     */
    visit(rootNode: Node): {camera: Camera, view: Matrix, inverseView: Matrix}{
        // traverse and render
        this.cameraValues = []
        this.cameraVectors = []
        this.lightPositions = []
        rootNode.accept(this);
        let camera = new Camera(this.cameraVectors[0], this.cameraVectors[1], this.cameraVectors[2], this.cameraVectors[3], this.cameraValues[0], this.cameraValues[1], this.cameraValues[2], this.cameraValues[3], this.cameraValues[4], this.cameraValues[5], this.cameraValues[6], this.cameraValues[7], this.cameraValues[8])
        let view = this.view
        let inverseView = this.inverseView
        return {camera, view, inverseView}
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    /**
     * besucht eine CameraNode
     * setzt währenddessen die View Matrix und das Invers der View Matrix
     * @param node die CameraNode, die besucht werden soll
     */
    visitCameraNode(node: CameraNode): void {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();

        // TODO Calculate the model matrix for the sphere
        toWorld = this.model[this.model.length - 1];
        fromWorld = this.inverse[this.inverse.length - 1];

        this.view = toWorld
        this.inverseView = fromWorld

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
     * Besucht einen Gruppenknoten
     * @param node der Knoten, der besucht werden soll
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

    visitAnimationNode(node: AnimationNode): void {
    }

    visitDriverNode(node: DriverNode): void {
    }

    visitMinMaxNode(node: MinMaxNode): void {
    }

    visitRotationNode(node: RotationNode): void {
    }

    visitScalerNode(node: ScalerNode): void {
    }

    visitSlerpNode(node: SlerpNode): void {
    }

}
