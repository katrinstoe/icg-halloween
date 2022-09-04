import {
    GroupNode,
    SphereNode,
    AABoxNode,
    TextureBoxNode,
    PyramidNode,
    LightNode,
    CameraNode,
    TexturePyramidNode
} from './nodes';
import RasterTexturePyramid from "./raster-texture-pyramid";

export default interface Visitor {
    visitGroupNode(node: GroupNode): void;
    visitSphereNode(node: SphereNode): void;
    visitAABoxNode(node: AABoxNode): void;
    visitTextureBoxNode(node: TextureBoxNode): void;
    visitPyramidNode(node: PyramidNode): void;
    visitTexturePyramidNode(node: TexturePyramidNode): void;
    visitCameraNode(node: CameraNode): void;
    visitLightNode(node: LightNode): void;
}