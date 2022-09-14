import RasterSphere from '../Geometry/RasterGeometry/raster-sphere';
import RasterBox from '../Geometry/RasterGeometry/raster-box';
import RasterTextureBox from '../Geometry/RasterGeometry/raster-texture-box';
import Vector from '../mathOperations/vector';
import Matrix from '../mathOperations/matrix';
import Visitor from './visitor';
import {
  Node, GroupNode,
  SphereNode, AABoxNode,
  TextureBoxNode, PyramidNode, CameraNode, LightNode, TexturePyramidNode
  , TextureVideoBoxNode, AABoxButtonNode, TextureBoxButtonNode, TicTacToeTextureNode
} from '../Nodes/nodes';
import Shader from '../Shaders/shader';
import RasterPyramid from "../Geometry/RasterGeometry/raster-pyramid";
import RasterTexturePyramid from "../Geometry/RasterGeometry/raster-texture-pyramid";
import {LightVisitor} from "./lightVisitor";
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import Camera from "../Camera/camera";
import RasterTextureTictactoeBox from "../Geometry/RasterGeometry/raster-texture-tictactoeBox";

/*interface Camera {
  eye: Vector,
  center: Vector,
  up: Vector,
  fovy: number,
  aspect: number,
  near: number,
  far: number,
  shininess: number,
  kS: number,
  kD: number,
  kA: number,
  lightPositions: Array<Vector>
}*/

export interface Renderable {
  render(shader: Shader): void;
}

/**
 * Class representing a Visitor that uses Rasterisation
 * to render a Scenegraph
 */
export class RasterVisitor implements Visitor {
  // TODO declare instance variables here
  model: Array<Matrix>
  inverse: Array<Matrix>

  /**
   * Creates a new RasterVisitor
   * @param gl The 3D context to render to
   * @param shader The default shader to use
   * @param textureshader The texture shader to use
   */
  constructor(
    private gl: WebGL2RenderingContext,
    private shader: Shader,
    private textureshader: Shader,
    private renderables: WeakMap<Node, Renderable>
  ) {
    // TODO setup
    this.model = new Array<Matrix>(Matrix.identity())
    this.inverse = new Array<Matrix>(Matrix.identity())
  }

  /**
   * Renders the Scenegraph
   * @param rootNode The root node of the Scenegraph
   * @param camera The camera used
   * @param lightPositions The light positions
   */
  render(
    rootNode: Node,
    camera: Camera | null,
    lightPositions: Array<Vector>
  ) {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    if (camera) {
      this.setupCamera(camera, lightPositions);
    }

    // traverse and render
    rootNode.accept(this);
  }

  /**
   * The view matrix to transform vertices from
   * the world coordinate system to the
   * view coordinate system
   */
  private lookat: Matrix;

  /**
   * The perspective matrix to transform vertices from
   * the view coordinate system to the
   * normalized device coordinate system
   */
  private perspective: Matrix;

  private shininess: number;

  private kS: number;

  private kD: number;
  private kA: number;
  private lightPosisitions: Array<Vector>;


  /**
   * Helper function to setup camera matrices
   * @param camera The camera used
   * @param lightPositions the light
   */
  setupCamera(camera: Camera, lightPositions: Array<Vector>) {
    this.lookat = Matrix.lookat(
      camera.eye,
      camera.center,
      camera.up);
    this.perspective = Matrix.perspective(
      camera.fovy,
      camera.aspect,
      camera.near,
      camera.far
    );
    this.shininess = camera.shininess;
    this.kS= camera.kS;
    this.kD = camera.kD;
    this.kA = camera.kA;
    this.lightPosisitions = lightPositions
    // console.log(this.shininess)
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
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

  visitObjectNode(shaderForNode: Shader, node: Node){
    const shader = shaderForNode;
    shader.use();
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();

    // TODO Calculate the model matrix for the sphere
    toWorld = this.model[this.model.length-1];
    fromWorld = this.inverse[this.inverse.length-1];
    ////Quelle: https://stackoverflow.com/questions/4725424/passing-an-array-of-vectors-to-a-uniform
    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)
    let lightUniformLocation = shader.getUniform3fv("lights")
    let lights = []
    for (let i = 0; i < this.lightPosisitions.length; i++) {
      lights[3*i] = this.lightPosisitions[i].x
      lights[3*i+1] = this.lightPosisitions[i].y
      lights[3*i+2] = this.lightPosisitions[i].z
    }
    for (let i = this.lightPosisitions.length; i < 8; i++) {
      lights[3*i] = 0
      lights[3*i+1] = 0
      lights[3*i+2] = 0
    }

    this.gl.uniform3fv(lightUniformLocation, lights)
    shader.getUniformInt("lightCount").set(this.lightPosisitions.length)


    const V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    const P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }

    // TODO set the normal matrix
    const N = shader.getUniformMatrix("N")
    let normalMatrix = fromWorld.transpose()

    if(N){
      normalMatrix.setVal(3,0,0);
      normalMatrix.setVal(3,1,0);
      normalMatrix.setVal(3,2,0);
      N.set(normalMatrix)
    }
    this.renderables.get(node).render(shader);
  }

  /**
   * Visits a sphere node
   * @param node The node to visit
   */
  visitSphereNode(node: SphereNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.visitObjectNode(this.textureshader, node)
  }

  /**
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    this.visitObjectNode(this.textureshader, node)
  }

  /**
   * Visits a pyramid node
   * @param node The node to visit
   */
  visitPyramidNode(node: PyramidNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTexturePyramidNode(node: TexturePyramidNode) {
    this.visitObjectNode(this.textureshader, node)

  }

  visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    this.visitObjectNode(this.textureshader, node)
  }

  visitAABoxButtonNode(node: AABoxButtonNode): void {
    this.shader.use();
    let shader = this.shader;
    let toWorld = Matrix.identity();
    // TODO Calculate the model matrix for the box
    toWorld = this.model[this.model.length-1];

    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)

    let V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }

    this.renderables.get(node).render(shader);
  }

  visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
    this.textureshader.use();
    let shader = this.textureshader;

    let toWorld = Matrix.identity();
    // TODO calculate the model matrix for the box
    toWorld = this.model[this.model.length-1];

    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformMatrix("V").set(this.lookat);
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    this.renderables.get(node).render(shader);
  }
  visitCameraNode(node: CameraNode) {
  };
  visitLightNode(node: LightNode) {
  };
}
