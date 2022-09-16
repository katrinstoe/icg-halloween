import Visitor from '../Visitors/visitor';
import Vector from '../mathOperations/vector';
import { Transformation } from '../mathOperations/transformation';
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import Camera from "../Camera/camera";

/**
 * Class representing a Node in a Scenegraph
 */
export class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor - The visitor
   */
  type: string

  constructor() {
    this.type = this.constructor.name
  }

  accept(visitor: Visitor) { }
  toJSON(object: any){
    object['type'] = this.type
  }
}

/**
 * Class representing a GroupNode in the Scenegraph.
 * A GroupNode holds a transformation and is able
 * to have child nodes attached to it.
 * @extends Node
 */
export class GroupNode extends Node {
  // TODO declare instance variables
  children: Array<Node>;
  static idCounter: number = 0;
  id: number;
  /**
   * Constructor
   * @param transform The node's transformation
   */
  constructor(public transform : Transformation) {
    super();
    this.children = new Array<Node>();
    this.id = GroupNode.idCounter++;

  }

  getchildren(){
    return this.children
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitGroupNode(this);
  }

  /**
   * Adds a child node
   * @param childNode The child node to add
   */
  add(childNode: Node) {
    this.children.push(childNode)
  }
  public toJSON(object: any){
    object['children'] = []
    object['type'] = this.type
    object['traverseMatrix'] = [this.transform.getMatrix().data]
    object['inverseMatrix'] = [this.transform.getInverseMatrix().data]
  }
}

/**
 * Class representing a Sphere in the Scenegraph
 * @extends Node
 */
export class SphereNode extends Node {

  /**
   * Creates a new Sphere.
   * The sphere is defined around the origin 
   * with radius 1.
   * @param color The colour of the Sphere
   */
  constructor(
    public color: Vector
  ) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitSphereNode(this);
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.color.x, this.color.y, this.color.z, this.color.a]
  }
}

/**
 * Class representing an Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class AABoxNode extends Node {

  /**
   * Creates an axis aligned box.
   * The box's center is located at the origin
   * with all edges of length 1
   * @param color The colour of the cube
   */
  public colorForJSON: Vector

  constructor(public color: Vector) {
    super();
    this.colorForJSON = color
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitAABoxNode(this);
  }
  //Quelle Notation: https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.colorForJSON.x, this.colorForJSON.y, this.colorForJSON.z, this.colorForJSON.a]
  }
}

export class AABoxButtonNode extends Node {

  /**
   * Creates an axis aligned box.
   * The box's center is located at the origin
   * with all edges of length 1
   * @param color The colour of the cube
   */
  constructor(public color: Vector, public animate:()=> void) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitAABoxButtonNode(this);
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.color.x, this.color.y, this.color.z, this.color.a]
    object['animate'] = this.animate

  }
}


/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TextureBoxNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTextureBoxNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TextureBoxButtonNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string, public animate:()=> void) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTextureBoxButtonNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture;
    object['animate'] = this.animate
  }
}



/**
 * Class representing a Video Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TextureVideoBoxNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTextureVideoBoxNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}

/**
 * Class representing a Pyramid in the Scenegraph
 * @extends Node
 */
export class PyramidNode extends Node {

  /**
   * Creates a new Pyramid.
   * @param color The colour of the Sphere
   */
  constructor(
      public color: Vector
  ) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitPyramidNode(this);
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.color.x, this.color.y, this.color.z, this.color.a]
  }
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TexturePyramidNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTexturePyramidNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}

export class CameraNode extends Node {
  /**
   * @param camera The camera
   */
  constructor(public camera: Camera) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitCameraNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['camera'] = this.camera
  }
}

export class LightNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  public position: Vector=new Vector(0,0,0,1)
  constructor(public color: Vector) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitLightNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.color.x, this.color.y, this.color.z, this.color.a]
    object['position'] = [this.position.x, this.position.y, this.position.z, this.position.a]
  }
}
export class TicTacToeTextureNode extends Node{
  public textureArray = ['Icons/emptyTicTacToe.png', 'Icons/Matthias.png', 'Icons/Tino.png', 'Icons/resetText.png']
  public activeTexture: string
  public amountOfSwitches= 0

  constructor(public texture: string) {
    super();
    this.activeTexture = texture;
  }
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTicTacToeTextureNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
    object['activeTexture'] = this.activeTexture
    object['amountOfSwitches'] = this.amountOfSwitches

  }
}
/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class TextureTextBoxNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public texture: string) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTextureTextBoxNode(this)
  }
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}


// export class AnimationNode extends Node{
//   children: Array<Node>;
//
//   constructor(public animationNode: AnimationNode) {
//     super();
//     this.children = new Array<Node>();
//   }
//
//   accept(visitor: Visitor) {
//     visitor.visitAnimationNode(this)
//   }
//
//   public toJSON(object: any){
//     object['node'] = this.animationNode
//   }
// }