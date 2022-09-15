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
  , TextureVideoBoxNode, AABoxButtonNode, TextureBoxButtonNode, TicTacToeTextureNode, TextureTextBoxNode
} from '../Nodes/nodes';
import Shader from '../Shaders/shader';
import RasterPyramid from "../Geometry/RasterGeometry/raster-pyramid";
import RasterTexturePyramid from "../Geometry/RasterGeometry/raster-texture-pyramid";
import {LightVisitor} from "./lightVisitor";
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import Camera from "../Camera/camera";
import RasterTextureTictactoeBox from "../Geometry/RasterGeometry/raster-texture-tictactoeBox";
import TextureTextBox from "../Geometry/RasterGeometry/texture-text-box";

export interface Renderable {
  render(shader: Shader): void;
}

/**
 * Klasse, die einen Visitor repräsentiert, der Rasterisation
 * benutzt um einen Szenengraph zu rendern
 */
export class RasterVisitor implements Visitor {
  // TODO declare instance variables here
  model: Array<Matrix>
  inverse: Array<Matrix>

  /**
   * Kreiert einen neuen RasterVisitor
   * @param gl Der 3D Kontext, zu dem gerendert werden soll
   * @param shader Der default shader, der benutzt werden soll
   * @param textureshader Der Textur Shader, der benutzt werden soll
   * @param renderables
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
   * rendert den Szenengraphen
   * @param rootNode Die RootNode des Szenengraphen
   * @param camera Die Kamera, die genutzt wird
   * @param lightPositions Die Lichtpositionen
   */
  render(
      rootNode: Node,
      camera: Camera | null,
      lightPositions: Array<Vector>,
      view: Matrix
  ) {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    if (camera) {
      this.setupCamera(camera, lightPositions, view);
    }

    // traverse and render
    rootNode.accept(this);
  }

  /**
   * Die view Matrix die genutzt wird, um die
   * Eckpunkte vom Welt Koordinatensystem zum
   * View Koordinatensystem zu transformieren
   */
  private lookat: Matrix;

  /**
   * Die perspective Matrix die genutzt wird um die
   * Eckpunkte vom View Koordinaten System in das
   * normalisierte device Koordinaten System zu
   * transformieren
   */
  private perspective: Matrix;

  private shininess: number;

  private kS: number;

  private kD: number;
  private kA: number;
  private lightPosisitions: Array<Vector>;


  /**
   * Hilffunktion, um die Kameramatrizen festzulegen
   * @param camera Die Kamera, die genutzt wird
   * @param lightPositions Die Lichtpositionen
   */
  setupCamera(camera: Camera, lightPositions: Array<Vector>, view: Matrix) {
    this.lookat = view;
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
   * Besucht eine GroupNode
   * @param node Die Node, die besucht werden soll
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

  /**
   * besucht eine ObjectPhongNode
   * @param shaderForNode der shader, der für die Node genutzt werden soll
   * @param node die Node, die besucht werden soll
   */
  visitObjectPhongNode(shaderForNode: Shader, node: Node){
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
   * Besucht eine SphereNode
   * @param node Die Node, die besucht werden soll
   */
  visitSphereNode(node: SphereNode) {
    this.visitObjectPhongNode(this.shader, node)
  }

  /**
   * Besucht eine axis aligned box
   * @param  {AABoxNode} node Die node, die besucht werden soll
   */
  visitAABoxNode(node: AABoxNode) {
    this.visitObjectPhongNode(this.shader, node)
  }

  /**
   * Besucht eine texturierte Box Node
   * @param  {TextureBoxNode} node Die Node, die besucht werden soll
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.visitObjectPhongNode(this.textureshader, node)
  }

  /**
   * Besucht eine mit einem Video texturierte Box Node
   * @param  {TextureBoxNode} node Die Node, die besucht werden soll
   */
  visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    this.visitObjectPhongNode(this.textureshader, node)
  }

  /**
   * Besucht eine PyramidNode
   * @param node Die Node, die besucht werden soll
   */
  visitPyramidNode(node: PyramidNode) {
    this.visitObjectPhongNode(this.shader, node)
  }

  /**
   * Besucht eine texturierte PyramidNode
   * @param  {TextureBoxNode} node die Node, die besucht werden soll
   */
  visitTexturePyramidNode(node: TexturePyramidNode) {
    this.visitObjectPhongNode(this.textureshader, node)

  }

  /**
   * besucht eine mit einem Tic Tac Toe Spiel texturierte Node
   * @param node die Node, die besucht werden soll
   */
  visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    this.visitObjectPhongNode(this.textureshader, node)
  }

  /**
   * besucht eine AABox Node, die auf Klick etwas tut
   * @param node die Node, die besucht werden soll
   */
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

  /**
   * besucht eine texturierte Box, die auf Klick etwas tut
   * @param node die Node, die besucht werden soll
   */
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

  /**
   * besucht eine CameraNode
   * hier passiert nichts, da die CameraNode mit dem CameraVisitor
   * besucht wird
   * @param node die Node, die besucht werden soll
   */
  visitCameraNode(node: CameraNode) {
  };

  /**
   * besucht eine LightNode
   * hier passiert nichts, da die LightNodes mit dem
   * LightVisitor besucht werden
   * @param node die Node, die besucht werden soll
   */
  visitLightNode(node: LightNode) {
  };

  /**
   * besucht eine BoxNode, die mit Text texturiert ist
   * @param node die Node, die besucht werden soll
   */
  visitTextureTextBoxNode(node: TextureTextBoxNode): void {
    this.visitObjectPhongNode(this.textureshader, node)
  }
}
