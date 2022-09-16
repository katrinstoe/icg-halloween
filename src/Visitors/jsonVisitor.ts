import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode,
    Node,
    PyramidNode,
    SphereNode,
    TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureTextBoxNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import Matrix from "../mathOperations/matrix";
import {
    AnimationNode,
    DriverNode,
    MinMaxNode,
    RotationNode,
    ScalerNode,
    SlerpNode,
    TranslatorNode
} from "../Nodes/animation-nodes";

export class JsonVisitor extends Visitor {
    traverse: Array<Matrix>
    inverse: Array<Matrix>
    jsonStack: Map<number, any>
    relationShipStack: Array<number>
    // childArray: Array<number>
    nodeId: number

    constructor() {
        super()
        this.traverse = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        // this.nodeId = 0;
        this.jsonStack = new Map<number, any>()
        this.jsonStack.set(0, {children: []})

        this.relationShipStack = [0]
        this.nodeId = 0
    }

    visit(rootNode: Node) {
        rootNode.accept(this);
    }


    visitGroupNode(node: GroupNode) {
        const id = this.nextId()
        let childrenArray: number[] = []
        let children = node.getchildren()
        const parent = this.relationShipStack[this.relationShipStack.length-1];
        this.jsonStack.get(parent).children.push(id)
        this.relationShipStack.push(id)

        let object = {
            id: id,
            // @ts-ignore
            children: []
        }
        node.toJSON(object)
        this.jsonStack.set(id, object)
        // this.checkForAnimationNode(node, object)
        // node.id += 1;

        for (let child of children) {
            child.accept(this)
        }
        this.relationShipStack.pop()

    }

    visitObjectNode(node: Node) {
        const id = this.nextId()
        const parent = this.relationShipStack[this.relationShipStack.length-1];
        this.jsonStack.get(parent).children.push(id)
        let object = {}
        node.toJSON(object)
        this.jsonStack.set(id, object)
        return id
    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
        this.visitObjectNode(node)
    }

    visitAABoxNode(node: AABoxNode): void {
        this.visitObjectNode(node)
    }
    visitTextureTextBoxNode(node: TextureTextBoxNode): void {
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
    //AnimationNodes
    visitRotationNode(node: RotationNode): void {
        this.visitAnimationNode(node)
    }
    visitSlerpNode(node: SlerpNode): void {
        this.visitAnimationNode(node)
    }
    visitScalerNode(node: ScalerNode): void {
        this.visitAnimationNode(node)
    }
    visitMinMaxNode(node: MinMaxNode): void {
        this.visitAnimationNode(node)
    }
    visitDriverNode(node: DriverNode): void {
        this.visitAnimationNode(node)
    }
    visitTranslatorNode(node: TranslatorNode): void {
        this.visitAnimationNode(node)
    }
    visitAnimationNode(node: AnimationNode): void {
        let id = this.visitObjectNode(node)
        this.relationShipStack.push(id)
        node.groupNode.accept(this)
        this.relationShipStack.pop()
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

    private nextId(){
        return this.nodeId++;
    }

    // checkForAnimationNode(node: Node, object: any): any {
    //     let animationNodes = <RotationNode[]> Scenegraph.getScenegraph().animationNodes
    //     for (let i = 0; i < animationNodes.length; i++) {
    //         console.log(animationNodes[i])
    //         console.log(node)
    //         if (node.id === animationNodes[i].groupNode.id){
    //             let rotationNode = <RotationNode>animationNodes[i]
    //             return object['animationNode'] = [node.id ,rotationNode.axis]
    //         }
    //     }
    //     let driverNodes = Scenegraph.getScenegraph().driverNodes
    //     console.log(driverNodes)
    //     for (let i = 0; i < driverNodes.length; i++) {
    //         if (node.id === driverNodes[i].groupNode.id){
    //             return object['driverNode'] = [node.id, driverNodes[i].vector]
    //         }
    //     }
    //     let scalerNodes = Scenegraph.getScenegraph().scalerNodes
    //     console.log(scalerNodes)
    //     for (let i = 0; i < scalerNodes.length; i++) {
    //         if (node.id === scalerNodes[i].groupNode.id){
    //             return object['scalerNodes'] = [node.id, scalerNodes[i].vector]
    //         }
    //     }
    // }


}


