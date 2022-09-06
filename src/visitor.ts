import {GroupNode, SphereNode, AABoxNode, TextureBoxNode, PyramidNode, TextureVideoBoxNode} from './nodes';
import TextureVideoBox from "./texture-video-box";

export default interface Visitor {
    visitGroupNode(node: GroupNode): void;
    visitSphereNode(node: SphereNode): void;
    visitAABoxNode(node: AABoxNode): void;
    visitTextureBoxNode(node: TextureBoxNode): void;
    visitPyramidNode(node: PyramidNode): void;
    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void
}