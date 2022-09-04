import Visitor from './visitor';
import Vector from './vector';
import { Transformation } from './transformation';

/**
 * Class representing a Node in a Scenegraph
 */
export class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor - The visitor
   */
  accept(visitor: Visitor) { }
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

  /**
   * Constructor
   * @param transform The node's transformation
   */
  constructor(public transform : Transformation) {
    super();
    this.children = new Array<Node>();
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
  constructor(public color: Vector) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitAABoxNode(this);
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
}

export class CameraNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public camera: string) {
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
}

export class LightNode extends Node {
  /**
   * Creates an axis aligned box textured box
   * The box's center is located at the origin
   * with all edges of length 1
   * @param texture The image filename for the texture
   */
  constructor(public camera: string) {
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
}