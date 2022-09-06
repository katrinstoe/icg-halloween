import {
    GroupNode,
    SphereNode,
    AABoxNode,
    TextureBoxNode,
    PyramidNode,
    LightNode,
    CameraNode,
    TexturePyramidNode,
    TextureVideoBoxNode
} from './nodes';
import RasterTexturePyramid from "./raster-texture-pyramid";
import TextureVideoBox from "./texture-video-box";

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
}