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
} from '../Nodes/nodes';
import {AnimationNode, DriverNode, MinMaxNode, RotationNode, ScalerNode, SlerpNode} from "../Nodes/animation-nodes";
/**
 * abstract class damit man nicht überall implementieren muss wenn man methode hinzufügt
 * besonders für animationnode visitor praktisch für JSON Loader, weil animationnodes von hier aus schon alle children accepten
 * */
export default abstract class Visitor {
    abstract visitGroupNode(node: GroupNode): void;
    abstract visitSphereNode(node: SphereNode): void;
    abstract visitAABoxNode(node: AABoxNode): void;
    abstract visitTextureBoxNode(node: TextureBoxNode): void;
    abstract visitPyramidNode(node: PyramidNode): void;
    abstract visitTextureVideoBoxNode(node: TextureVideoBoxNode): void
    abstract visitTexturePyramidNode(node: TexturePyramidNode): void;
    abstract visitCameraNode(node: CameraNode): void;
    abstract visitLightNode(node: LightNode): void;
    abstract visitAABoxButtonNode(node: AABoxButtonNode): void;
    abstract visitTextureBoxButtonNode(node: TextureBoxButtonNode): void;
    abstract visitTicTacToeTextureNode(node: TicTacToeTextureNode): void;
    abstract visitTextureTextBoxNode(node: TextureTextBoxNode): void
    visitAnimationNode(node: AnimationNode): void {
        node.groupNode.accept(this)
    }
    visitRotationNode(node: RotationNode){
        this.visitAnimationNode(node)
    }
    visitSlerpNode(node: SlerpNode){
        this.visitAnimationNode(node)
    }
    visitScalerNode(node: ScalerNode){
        this.visitAnimationNode(node)
    }
    visitMinMaxNode(node: MinMaxNode){
        this.visitAnimationNode(node)
    }
    visitDriverNode(node: DriverNode){
        this.visitAnimationNode(node)
    }
}