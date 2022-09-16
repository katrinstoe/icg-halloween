import Vector from '../mathOperations/vector';
import Matrix from '../mathOperations/matrix';
import Visitor from './visitor';
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
} from '../Nodes/nodes';
import Shader from '../Shaders/shader';
import Camera from "../Camera/camera";

export interface Renderable {
  render(shader: Shader): void;
}

/**
 * Klasse, die einen Visitor repräsentiert, der Rasterisation
 * benutzt um einen Szenengraph zu rendern
 */
export class RasterVisitor extends Visitor {
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
    super()
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
/**
 * Parameter für Shader Lighting
 * */
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
  }

  /**
   * Besucht eine GroupNode
   * besucht children
   * baut pusht dann position auf zwei Stacks, einen für traversal einen für inverse traversal des Szenengraph (model, inverse)
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
   * besucht eine ObjectNode
   * für jede Node werden die From und ToWorld Matrizen berechnet
   * Dann werden licht Parameter an den FragmentShader gegeben und die Matrizen (Model, View, Normal, Perspective)
   * @param shaderForNode der shader, der für die Node genutzt werden soll
   * @param node die Node, die besucht werden soll
   */
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
   * Besucht eine SphereNode
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param node Die Node, die besucht werden soll
   */
  visitSphereNode(node: SphereNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Besucht eine axis aligned box
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param  {AABoxNode} node Die node, die besucht werden soll
   */
  visitAABoxNode(node: AABoxNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Besucht eine texturierte Box Node
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param  {TextureBoxNode} node Die Node, die besucht werden soll
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.visitObjectNode(this.textureshader, node)
  }

  /**
   * Besucht eine mit einem Video texturierte Box Node
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param  {TextureBoxNode} node Die Node, die besucht werden soll
   */
  visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    this.visitObjectNode(this.textureshader, node)
  }

  /**
   * Besucht eine PyramidNode
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param node Die Node, die besucht werden soll
   */
  visitPyramidNode(node: PyramidNode) {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * Besucht eine texturierte PyramidNode
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param  {TextureBoxNode} node die Node, die besucht werden soll
   */
  visitTexturePyramidNode(node: TexturePyramidNode) {
    this.visitObjectNode(this.textureshader, node)

  }

  /**
   * besucht eine mit einem Tic Tac Toe Spiel texturierte Node
   * ruft wieder visitObjectNode auf, weil hier überall das gleiche passiert
   * @param node die Node, die besucht werden soll
   */
  visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    this.visitObjectNode(this.textureshader, node)
  }

  /**
   * besucht eine AABox Node, die auf Klick etwas tut
   * @param node die Node, die besucht werden soll
   */
  visitAABoxButtonNode(node: AABoxButtonNode): void {
    this.visitObjectNode(this.shader, node)
  }

  /**
   * besucht eine texturierte Box, die auf Klick etwas tut
   * @param node die Node, die besucht werden soll
   */
  visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
    this.visitObjectNode(this.textureshader, node)
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
    this.visitObjectNode(this.textureshader, node)
  }
}
