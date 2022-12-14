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
import {AnimationNode, DriverNode, MinMaxNode, RotationNode, ScalerNode, SlerpNode,} from "../Nodes/animation-nodes";

/**
 * Haben JsonVisitor um pro Node entscheiden zu können, welche Daten relevant sind in Json Datei zu speichern, um für späteren Upload parat zu haben
 * Speichern uns Nodes inklusive Json Objekten auf einem Stack
 * Um speichern zu können welche GroupNodes welche Children haben gibt es relationShip Stack
 * nodeId wird hier hochgezählt nicht in nodes, da sonst nirgends benötigt wird
 * */

export class JsonVisitor extends Visitor {
    jsonStack: Map<number, any>
    relationShipStack: Array<number>
    // childArray: Array<number>
    nodeId: number

    constructor() {
        super()
        this.jsonStack = new Map<number, any>()
        this.jsonStack.set(0, {children: []})

        this.relationShipStack = [0]
        this.nodeId = 0
    }

    visit(rootNode: Node) {
        rootNode.accept(this);
    }

    /**
     * setzen unsere Id
     * wir speichern uns auf dem relationshipStack als Parent ab, sodass wenn children aufgerufen werden, dort nach letztem Eintrag schauen können und sich dem parent zuweisen
     * dann werden alle children für den parent auf den Stack gepushed
     * jedes Object bekommt eine Id gespeichert und seine Children
     * */

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
        for (let child of children) {
            child.accept(this)
        }
        this.relationShipStack.pop()

    }
/**
 * Wird für jedes Objekt aufgerufen
 * Speichert wer sein parent ist bzw. dass es ein child zu dem parent mit id... ist
 * Erstellt neues objekt
 * Objekt inhalt werden in einzelnen Nodes gesetzt
 * setzt object auf stack mit id und objekt mit JSON Werten
 * returned id
 * */
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
    /**AnimationNodes
     * Parent AnimationNode called einzelne ObjectNodes und legt fest, dass auch für die visitObjectNode gesetzt wird
     * */
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
    visitAnimationNode(node: AnimationNode): void {
        let id = this.visitObjectNode(node)
        this.relationShipStack.push(id)
        node.groupNode.accept(this)
        this.relationShipStack.pop()
    }

/**
 * Ermöglicht Download des JSON Files innerhalb Visitors
 * Quelle: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
 * */

    private downloadFile(filename: string, text: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
/**
 * Erlaubt Zugriff von außen im index.ts auf download des JSON Files
 * //https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
 * //https://stackoverflow.com/questions/37437805/convert-map-to-json-object-in-javascript
 * */
    public download(sg: Node){
        this.visit(sg)
        console.log(this.jsonStack)
        let str = this.replacer(this.jsonStack);
        let jsonString = JSON.stringify(str)
        this.downloadFile("SzenengraphDownload.json",jsonString)
    }

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
}


