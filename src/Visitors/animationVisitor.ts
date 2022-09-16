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
import Matrix from "../mathOperations/matrix";
/**
 * AnimationNode Visitor um über animationNodes in Szenengraphen zu traversen und wieder in Arrays für Rastervisitor zu speichern
 *
 * */
export class AnimationVisitor extends Visitor {
    model: Array<Matrix>
    inverse: Array<Matrix>
    animationNodeArray: Array<ScalerNode | RotationNode>
    minmaxNodeArray: Array<MinMaxNode>
    driverNodeArray: Array<DriverNode>
    cameraDriverNodes: Array<DriverNode>
    // public cameraDriverArray: Array<Vector>
    //public slerpNodeArray: Array<SlerpNode>
    private scalerArray: Array<ScalerNode>;
    private rotationArray: Array<RotationNode>;


    constructor() {
        super()
        this.model = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
    }

    visitTextureTextBoxNode(node: TextureTextBoxNode): void {
    }

    visit(rootNode: Node){
        this.animationNodeArray = []
        this.minmaxNodeArray = []
        this.driverNodeArray = []
        this.scalerArray = []
        this.rotationArray =[]
        this.cameraDriverNodes = []
        rootNode.accept(this)
        let object = {
            animationNodeArray: this.animationNodeArray,
            minmaxNodeArray: this.minmaxNodeArray,
            driverNodeArray: this.driverNodeArray,
            scalerArray: this.scalerArray,
            rotationArray: this.rotationArray,
            cameraDriverNodes: this.cameraDriverNodes
        }
        return object
    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
    }

    visitAABoxNode(node: AABoxNode): void {
    }

    visitCameraNode(node: CameraNode): void {
        // this.cameraDriverArray.push(node)
    }

    visitDriverNode(node: DriverNode): void {
        if (node.driver == "camera"){
            this.cameraDriverNodes.push(node)
        } else {
            this.driverNodeArray.push(node)
        }
        node.groupNode.accept(this)
    }

    visitGroupNode(node: GroupNode): void {
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

    visitMinMaxNode(node: MinMaxNode): void {
        this.minmaxNodeArray.push(node)
        node.groupNode.accept(this)
    }

    visitPyramidNode(node: PyramidNode): void {
    }

    visitRotationNode(node: RotationNode): void {
        this.animationNodeArray.push(node)
        this.rotationArray.push(node)
        node.groupNode.accept(this)
    }

    visitScalerNode(node: ScalerNode): void {
        //this.animationNodeArray.push(node)
        this.scalerArray.push(node)
        node.groupNode.accept(this)
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
