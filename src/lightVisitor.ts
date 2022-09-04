import Visitor from "./visitor";
import {AABoxNode, CameraNode, GroupNode, LightNode, Node, PyramidNode, SphereNode, TextureBoxNode} from "./nodes";
import Vector from "./vector";
import Matrix from "./matrix";

export class LightVisitor implements Visitor {
    model: Array<Matrix>
    inverse: Array<Matrix>
    public lightPositions: Array<Vector>
    lightNodes: Array<LightNode>


    constructor(
        private gl: WebGL2RenderingContext
    ) {
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
    }
    render(
        rootNode: Node,
    ) {
        // traverse and render
        rootNode.accept(this);
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitCameraNode(node: CameraNode): void {
    }

    visitGroupNode(node: GroupNode): void {
    }

    visitLightNode(node: LightNode): void {
        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();

        // TODO Calculate the model matrix for the sphere
        toWorld = this.model[this.model.length - 1];
        fromWorld = this.inverse[this.inverse.length - 1]

    }

    lightNodeList(){

    }

    visitPyramidNode(node: PyramidNode): void {
    }

    visitSphereNode(node: SphereNode): void {
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
    }

}
