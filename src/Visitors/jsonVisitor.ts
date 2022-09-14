import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode, Node,
    PyramidNode,
    SphereNode,
    TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import Matrix from "../mathOperations/matrix";

export class JsonVisitor implements Visitor {
    traverse: Array<Matrix>
    inverse: Array<Matrix>
    jsonStack: Stack<KeyValuePair>
    nodeId: number

    constructor() {
        this.traverse = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        this.nodeId = 0;
        this.jsonStack.push({["GroupNumberTest"]: "0123"})
    }

    visit(rootNode: Node) {
        rootNode.accept(this);
    }

    visitGroupNode(node: GroupNode) {

        let children = node.getchildren()
        let matrix = node.transform.getMatrix()
        let inverseMatrix = node.transform.getInverseMatrix()
        this.traverse.push(this.traverse[this.traverse.length - 1].mul(matrix))
        this.inverse.push(inverseMatrix.mul(this.inverse[this.inverse.length - 1]))
        this.nodeId += 1;
        for (let child of children) {
            child.accept(this)
            this.nodeId += 1;
        }
        this.traverse.pop()
        this.inverse.pop()
        let nodeName = typeof node
        this.jsonStack.push({["GroupNode"]: nodeName.toString()})
    }

    visitObjectNode(node: Node): object {

        let toWorld = Matrix.identity();
        let fromWorld = Matrix.identity();
        toWorld = this.traverse[this.traverse.length-1];
        fromWorld = this.inverse[this.inverse.length-1];
        let object = {
            type: node,
            id: this.nodeId,
            toWorld: toWorld,
            fromWorld: fromWorld,
        }

        this.jsonStack.push(JsonVisitor.toJSON(object, this.nodeId))
        return object
    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
        this.visitObjectNode(node)
    }

    visitAABoxNode(node: AABoxNode): void {
        this.visitObjectNode(node)
    }

    visitCameraNode(node: CameraNode): void {
        this.visitObjectNode(node)
    }

    visitLightNode(node: LightNode): void {
        this.visitObjectNode(node)
    }

    visitPyramidNode(node: PyramidNode): void {
        this.visitObjectNode(node)
    }

    visitSphereNode(node: SphereNode): void {
        this.visitObjectNode(node)
    }

    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
        this.visitObjectNode(node)
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
        this.visitObjectNode(node)
    }

    visitTexturePyramidNode(node: TexturePyramidNode): void {
        this.visitObjectNode(node)
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
        this.visitObjectNode(node)
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
        this.visitObjectNode(node)
    }

    static toJSON(object: jsonObject, nodeId: number){
        let returnPair: KeyValuePair
        return {[nodeId.toString()]: object.toString()}
    }

}
interface Stack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}
interface KeyValuePair {
    [key: string]: string;
}
export type jsonObject = {
    type: Node,
    id: number,
    toWorld: Matrix,
    fromWorld: Matrix,

}


