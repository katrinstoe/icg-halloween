import Visitor from '../Visitors/visitor';
import Vector from '../mathOperations/vector';
import { Transformation } from '../mathOperations/transformation';
import TextureVideoBox from "../Geometry/RasterGeometry/texture-video-box";
import Camera from "../Camera/camera";

/**
 * Class representing a Node in a Scenegraph
 * Speichert Typ (für JSON Visitor und position)
 * Sie ist der Parent aller anderer Nodes und enthält eine accept Methode und ein toJSon Methode für alle Nodes
 * Alle Nodes speichern zusätzliche wichtige Infos die für JSON Download relevant sind in JSON Methode in Objekt
 */
export class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor - The visitor
   */
  type: string
  position: Vector

  constructor() {
    this.type = this.constructor.name
  }

  accept(visitor: Visitor) { }

  /**
   * Transform the object into a json string
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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
   * Creates an axis aligned textured box
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * textured with text
 * @extends Node
 */
export class TextureTextBoxNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The text for the texture
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture;
  }
}

/**
 * Class representing a Textured Axis Aligned Box in the Scenegraph
 * that has a texture and works like a button
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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
   * Creates an axis aligned textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The video filename for the texture
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
  }
}

/**
 * Class representing a CameraNode in the scenegraph
 * Speichert für JSON zusätzliche wichtige Infos, wie alles was zum erstellen der Camera wichtig ist aber auch:
 * Lichtparameter
 */
export class CameraNode extends Node {
  /**
   * @param camera The camera
   */
  aspect: number
  origin: Vector
  eye: Vector
  center: Vector
  up: Vector
  fovy: number
  near: number
  far: number
  width: number
  height: number
  shininess: number
  kS: number
  kD: number
  kA: number
  alpha: number

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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['camera'] = this.camera
    object['aspect'] = this.aspect
    object['origin'] = this.origin
    object['eye'] = this.eye
    object['center'] = this.center
    object['up'] = this.up
    object['fovy'] = this.fovy
    object['near'] = this.near
    object['far'] = this.far
    object['width'] = this.width
    object['height'] = this.height
    object['shininess'] = this.shininess
    object['kS'] = this.kS
    object['kD'] = this.kD
    object['kA'] = this.kA
    object['alpha'] = this.alpha
  }
}


/**
 * Class representing a lightnode in the scenegraph
 */
export class LightNode extends Node {
  /**
   * Creates a new lightnode
   * @param color: the color of the node
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

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['color'] = [this.color.x, this.color.y, this.color.z, this.color.a]
    object['position'] = [this.position.x, this.position.y, this.position.z, this.position.a]
  }
}

/**
 * Class representing a textured node that is used for
 * the tic tac toe game
 * Speichert textureArray mit allen möglichen Textures um zu entscheiden welche nach click gewählt werden soll
 * Speichert die aktuell angezeigte texture
 * speichert die amountofswitches um zu schauen ob nochmal texture geswitched werden darf
 */
export class TicTacToeTextureNode extends Node{
  public textureArray = ['Icons/emptyTicTacToe.png', 'Icons/Matthias.png', 'Icons/Tino.png', 'Icons/resetText.png']
  public activeTexture: string
  public amountOfSwitches= 0

  /**
   * creates a new tic tac toe node
   * @param texture the texture for the node
   */
  constructor(public texture: string) {
    super();
    this.activeTexture = texture;
  }

  /**
   * accepts a visitor according to the visitor pattern
   * @param visitor the visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitTicTacToeTextureNode(this)
  }

  /**
   * transform the object into a Json String
   * @param object the object to transform
   */
  public toJSON(object: any){
    object['type'] = this.type
    object['texture'] = this.texture
    object['activeTexture'] = this.activeTexture
    object['amountOfSwitches'] = this.amountOfSwitches

  }
}
