import RasterSphere from './raster-sphere';
import RasterBox from './raster-box';
import RasterTextureBox from './raster-texture-box';
import Vector from './vector';
import Matrix from './matrix';
import Visitor from './visitor';
import {
  Node, GroupNode,
  SphereNode, AABoxNode,
  TextureBoxNode, PyramidNode, CameraNode, LightNode, TexturePyramidNode
  ,TextureVideoBoxNode
} from './nodes';
import Shader from './shader';
import RasterPyramid from "./raster-pyramid";
import RasterTexturePyramid from "./raster-texture-pyramid";
import {LightVisitor} from "./lightVisitor";
import TextureVideoBox from "./texture-video-box";

interface Camera {
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
}

interface Renderable {
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
      this.setupCamera(camera);
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
   */
  setupCamera(camera: Camera) {
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
    this.lightPosisitions = camera.lightPositions
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

  /**
   * Visits a sphere node
   * @param node The node to visit
   */
  visitSphereNode(node: SphereNode) {
    const shader = this.shader;
    shader.use();
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();

    // TODO Calculate the model matrix for the sphere
    toWorld = this.model[this.model.length-1];
    fromWorld = this.inverse[this.inverse.length-1];
    //macht dass toWorld auf die graphikkarte kommt
    //kamera wird in szenengraph gepackt is aber nicht an shader attached
    //verändert nur die Objekte daher extra matrix hier überall dranhängen die sicht auf matrizen verändert
    //eignenen kameravisitor vllt machen der in viewmatrix veändert
    //allgemein kann ich kamera dann an würfel hängen der dann mit animation rotiert um objekte
    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)
    shader.getUniformVec3("lightPositions").set(this.lightPosisitions[0])


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
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
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
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
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
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    this.textureshader.use();
    let shader = this.textureshader;

    let toWorld = Matrix.identity();
    // TODO calculate the model matrix for the box
    toWorld = this.model[this.model.length-1];

    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)



    shader.getUniformMatrix("V").set(this.lookat);
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    this.renderables.get(node).render(shader);
  }

  /**
   * Visits a pyramid node
   * @param node The node to visit
   */
  visitPyramidNode(node: PyramidNode) {
    const shader = this.shader;
    shader.use();
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();

    // TODO Calculate the model matrix for the sphere
    toWorld = this.model[this.model.length-1];
    fromWorld = this.inverse[this.inverse.length-1]

    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)


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
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTexturePyramidNode(node: TexturePyramidNode) {
    this.textureshader.use();
    let shader = this.textureshader;

    let toWorld = Matrix.identity();
    // TODO calculate the model matrix for the box
    toWorld = this.model[this.model.length-1];

    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformFloat("shininess").set(this.shininess)
    shader.getUniformFloat("kS").set(this.kS)
    shader.getUniformFloat("kD").set(this.kD)
    shader.getUniformFloat("kA").set(this.kA)



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

/** 
 * Class representing a Visitor that sets up buffers 
 * for use by the RasterVisitor 
 * */
export class RasterSetupVisitor {
  /**
   * The created render objects
   */
  public objects: WeakMap<Node, Renderable>
  public lightpositions: Array<Vector>;


  /**
   * Creates a new RasterSetupVisitor
   * @param context The 3D context in which to create buffers
   */
  constructor(private gl: WebGL2RenderingContext, lightPositions: Array<Vector>) {
    this.objects = new WeakMap();
    this.lightpositions = lightPositions;
  }

  /**
   * Sets up all needed buffers
   * @param rootNode The root node of the Scenegraph
   */
  setup(rootNode: Node) {
    // Clear to white, fully opaque
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear everything
    this.gl.clearDepth(1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);

    rootNode.accept(this);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    for (let child of node.children) {
      child.accept(this);
    }
  }

  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    this.objects.set(
      node,
      new RasterSphere(
          this.gl,
          new Vector(0, 0, 0, 1), 1,
          node.color,
          this.lightpositions)
    );
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.objects.set(
      node,
      new RasterBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1),
        node.color
      )
    );
  }

  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.objects.set(
      node,
      new RasterTextureBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1),
        node.texture
      )
    );
  }


  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureVideoBoxNode(node: TextureVideoBoxNode) {
    this.objects.set(
        node,
        new TextureVideoBox(
            this.gl,
            new Vector(-0.5, -0.5, -0.5, 1),
            new Vector(0.5, 0.5, 0.5, 1),
            node.texture
        )
    );
  }



  /**
   * Visits a pyramid node
   * @param node - The node to visit
   */
  visitPyramidNode(node: PyramidNode) {
    this.objects.set(
        node,
        new RasterPyramid(
            this.gl,
            new Vector(-0.5, -0.5, 0.5, 1),
            new Vector(0.5, -0.5, 0.5, 1),
            new Vector(0, -0.5, -0.5, 1),
            new Vector(0, 0.5, 0, 1),
            node.color
        ),
    );
  }
  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTexturePyramidNode(node: TexturePyramidNode) {
    this.objects.set(
        node,
        new RasterTexturePyramid(
            this.gl,
            new Vector(-0.5, -0.5, 0.5, 1),
            new Vector(0.5, -0.5, 0.5, 1),
            new Vector(0, -0.5, -0.5, 1),
            new Vector(0, 0.5, 0, 1),
            node.texture
        )
    );
  }


  visitCameraNode(node: CameraNode) {
  };
  visitLightNode(node: LightNode) {
  };
}