import Visitor from "./visitor";
import {
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode,
    Node,
    PyramidNode,
    SphereNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode
} from "./nodes";
import Vector from "./vector";
import Matrix from "./matrix";

export class LightVisitor implements Visitor {
    model: Array<Matrix>
    inverse: Array<Matrix>
    public lightPositions: Array<Vector>
    lightNodes: Array<LightNode>


    constructor(
    ) {
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
    }

    visit(rootNode: Node): Vector[] {
        // traverse and render
        this.lightPositions = []
        rootNode.accept(this);
        return this.lightPositions
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitCameraNode(node: CameraNode): void {
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
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();

        // TODO Calculate the model matrix for the sphere
        toWorld = this.model[this.model.length - 1];
        fromWorld = this.inverse[this.inverse.length - 1];


        this.lightPositions.push(fromWorld.mulVec(node.position))

    }

    visitTexturePyramidNode(node: TexturePyramidNode) {
    }

    visitPyramidNode(node: PyramidNode): void {
    }

    visitSphereNode(node: SphereNode): void {
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
    }

}
