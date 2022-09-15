import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode, AnimationNode,
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
import Vector from "../mathOperations/vector";

export class JsonVisitor implements Visitor {
    traverse: Array<Matrix>
    inverse: Array<Matrix>
    jsonStack: Map<number, any>
    relationShipStack: Array<number>
    nodeId: number

    constructor() {
        this.traverse = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        this.nodeId = 0;
        this.jsonStack = new Map<number, any>()
        this.relationShipStack = []
    }

    visit(rootNode: Node) {
        rootNode.accept(this);
    }


    visitGroupNode(node: GroupNode) {
        let children = node.getchildren()
        this.relationShipStack.push(this.nodeId)
        let childrenArray: number[] = []
        let object = {
            type: "GroupNode",
            id: this.nodeId,
            children: childrenArray
        }
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;

        for (let child of children) {
            child.accept(this)
        }
        this.relationShipStack.pop()

    }

    visitObjectNode(node: Node, type: string): object {

        const parent = this.relationShipStack[this.relationShipStack.length-1];
        this.jsonStack.get(parent).children.push(this.nodeId)
        let object = {
            child: "ChildNode",
            type: type,
            id: this.nodeId
        }
        return object
    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
        this.visitObjectNode(node, "AABoxButton")
    }

    visitAABoxNode(node: AABoxNode): void {
        let object = this.visitObjectNode(node, "AABoxNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitCameraNode(node: CameraNode): void {
        let object = this.visitObjectNode(node, "CameraNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitLightNode(node: LightNode): void {
        let object = this.visitObjectNode(node, "LightNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitPyramidNode(node: PyramidNode): void {
        let object = this.visitObjectNode(node, "PyramidNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitSphereNode(node: SphereNode): void {
        let object = this.visitObjectNode(node, "SphereNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
        let object = this.visitObjectNode(node, "TextureBoxButtonNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitTextureBoxNode(node: TextureBoxNode): void {
        let object = this.visitObjectNode(node, "TextureBoxNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitTexturePyramidNode(node: TexturePyramidNode): void {
        let object = this.visitObjectNode(node, "TexturePyramidNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
        let object = this.visitObjectNode(node, "TextureVideoBoxNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
        let object = this.visitObjectNode(node, "TicTacToeTextureNode")
        node.toJSON(object)
        this.jsonStack.set(this.nodeId, object)
        this.nodeId += 1;
    }
    //Quelle: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
    private downloadFile(filename: string, text: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    public download(sg: Node){
        this.visit(sg)
        console.log(this.jsonStack)
        let str = this.replacer(this.jsonStack);
        let jsonString = JSON.stringify(str)
        this.downloadFile("SzenengraphDownload.json",jsonString)
    }
    //https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
    //https://stackoverflow.com/questions/37437805/convert-map-to-json-object-in-javascript
    private replacer(jsonStack:  Map<number, any>) {
        if(jsonStack instanceof Map) {
            return Object.fromEntries(jsonStack);
        } else {
            return jsonStack;
        }
    }

    visitAnimationNode(node: AnimationNode): void {
    }
}


