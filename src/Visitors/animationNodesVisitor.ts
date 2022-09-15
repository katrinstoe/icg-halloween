import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode,
    PyramidNode,
    SphereNode,
    TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import Matrix from "../mathOperations/matrix";
import Vector from "../mathOperations/vector";

export class AnimationNodesVisitor implements Visitor{
    traverse: Array<Matrix>
    inverse: Array<Matrix>
    public animationNodesArray: Array<Vector>
    constructor() {
        this.traverse = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())

    }


    visitAABoxButtonNode(node: AABoxButtonNode): void {
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitCameraNode(node: CameraNode): void {
    }

    visitGroupNode(node: GroupNode): void {
    }

    visitLightNode(node: LightNode): void {
    }

    visitPyramidNode(node: PyramidNode): void {
    }

    visitSphereNode(node: SphereNode): void {
    }

    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
    }

    visitTexturePyramidNode(node: TexturePyramidNode): void {
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    }

}