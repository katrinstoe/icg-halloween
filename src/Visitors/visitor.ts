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

export default interface Visitor {
    visitGroupNode(node: GroupNode): void;
    visitSphereNode(node: SphereNode): void;
    visitAABoxNode(node: AABoxNode): void;
    visitTextureBoxNode(node: TextureBoxNode): void;
    visitPyramidNode(node: PyramidNode): void;
    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void
    visitTexturePyramidNode(node: TexturePyramidNode): void;
    visitCameraNode(node: CameraNode): void;
    visitLightNode(node: LightNode): void;
    visitAABoxButtonNode(node: AABoxButtonNode): void;
    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void;
    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void;
}