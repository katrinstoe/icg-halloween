import {
    GroupNode,
    SphereNode,
    AABoxNode,
    TextureBoxNode,
    PyramidNode,
    LightNode,
    CameraNode,
    TexturePyramidNode,
    TextureVideoBoxNode, AABoxButtonNode, TextureBoxButtonNode, TicTacToeTextureNode
} from '../Nodes/nodes';
import RasterTexturePyramid from "../Geometry/RasterGeometry/raster-texture-pyramid";
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import {
    AnimationNode,
    DriverNode,
    MinMaxNode,
    RotationNode,
    ScalerNode,
    SlerpNode,
    TranslatorNode
} from "../Nodes/animation-nodes";

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
    visitTranslatorNode(node: TranslatorNode){
        this.visitAnimationNode(node)
    }
}