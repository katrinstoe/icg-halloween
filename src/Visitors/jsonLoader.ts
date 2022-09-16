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
    TextureTextBoxNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import {
    AnimationNode,
    DriverNode,
    MinMaxNode,
    RotationNode,
    ScalerNode,
    SlerpNode,
} from "../Nodes/animation-nodes";

export class JsonLoader extends Visitor {
//GamePlan
    /*
    1. Objekte aus JSON Datei laden ✓
        1. Command: JSON.parse ✓
        2. wie kann ich von hier aus auf Dateispeicherort zugreifen? Oder muss per eingabe festgelegt werden, wo Datei liegt? ✓
    2. Szenengraph aus Objekten erbauen
        1. Riesiges if/switch statement, bei dem ich anhang type entscheide welche Art von Node es ist
        2. Node an richtige visitMethode geben, in der Nde dann erstellt wird
        3. rausfinden wohin die Node geadded wird, indem parent aus stack gefunden wird und dranhängt
        4. ganzen sg zurückgeben
    4. Scenengraph an indexDatei geben
    */
    constructor() {
        super()
    }

    static deconstructFile(jsonObject: any) {
        // console.log(jsonObject["0"].type)
        console.error("Sorry, i didn't manage to do the loader in time :'(")
        let number = 0;
        // for (let i = 0; i < jsonObject.length; i++) {
        //     if (jsonObject[''+i+''].type == "AABox"){
        //         this.visitAABoxNode(jsonObject['number'])
        //     }
        // }

    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitAnimationNode(node: AnimationNode): void {
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

    private makeMatrix() {

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

    visitTextureTextBoxNode(node: TextureTextBoxNode): void {
    }
}

