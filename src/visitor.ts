import {GroupNode, SphereNode, AABoxNode, TextureBoxNode, PyramidNode, LightNode, CameraNode} from './nodes';

export default interface Visitor {
    visitGroupNode(node: GroupNode): void;
    visitSphereNode(node: SphereNode): void;
    visitAABoxNode(node: AABoxNode): void;
    visitTextureBoxNode(node: TextureBoxNode): void;
    visitPyramidNode(node: PyramidNode): void;
    visitCameraNode(node: CameraNode): void;
    visitLightNode(node: LightNode): void;
}