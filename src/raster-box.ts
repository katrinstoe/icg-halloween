import Vector from './vector';
import Shader from './shader';

/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
export default class RasterBox {
    /**
     * The buffer containing the box's vertices
     */
    vertexBuffer: WebGLBuffer;
    /**
     * The indices describing which vertices form a triangle
     */
    indexBuffer: WebGLBuffer;

    // TODO private variable for color buffer
    colorBuffer: WebGLBuffer;
    /**
     * The amount of indices
     */
    elements: number;

    normalBuffer: WebGLBuffer;


    /**
     * Creates all WebGL buffers for the box
     *     6 ------- 7
     *    / |       / |
     *   3 ------- 2  |
     *   |  |      |  |
     *   |  5 -----|- 4
     *   | /       | /
     *   0 ------- 1
     *  looking in negative z axis direction
     * @param gl The canvas' context
     * @param minPoint The minimal x,y,z of the box
     * @param maxPoint The maximal x,y,z of the box
     */
    constructor(
        private gl: WebGL2RenderingContext,
        minPoint: Vector,
        maxPoint: Vector,
        center: Vector
    ) {
        this.gl = gl;
        const mi = minPoint;
        const ma = maxPoint;

        let vertices = [
            mi.x, mi.y, ma.z,
            ma.x, mi.y, ma.z,
            ma.x, ma.y, ma.z,
            mi.x, ma.y, ma.z,
            ma.x, mi.y, mi.z,
            mi.x, mi.y, mi.z,
            mi.x, ma.y, mi.z,
            ma.x, ma.y, mi.z
        ];
        let indices = [
            // front
            0, 1, 2, 2, 3, 0,
            // back
            4, 5, 6, 6, 7, 4,
            // right
            1, 4, 7, 7, 2, 1,
            // top
            3, 2, 7, 7, 6, 3,
            // left
            5, 0, 3, 3, 6, 5,
            // bottom
            5, 4, 1, 1, 0, 5
        ];
        let color = [
            1, 0, 0, 1,
            1, 1, 0, 1,
            0.5, 0, 0.5, 1,
            0.5, 0, 0, 1,
            1, 0, 1, 1,
            0, 1, 1, 1,
            0, 0.5, 1, 1
        ]
        let normals = []

        let normal = (new Vector(x, y, z, 1)).sub(center).normalize();
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.indexBuffer = indexBuffer;
        this.elements = indices.length;

        // TODO create and fill a buffer for colours
        const colorBufffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBufffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        this.colorBuffer = colorBufffer;
    }

    /**
     * Renders the box
     * @param shader The shader used to render
     */
    render(shader
               :
               Shader
    ) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation,
            3, this.gl.FLOAT, false, 0, 0);

        // TODO bind colour buffer
        //aus Scene Graph die Color und vertices kriegen und ich shader geben
        const color = shader.getAttributeLocation("a_color")
        this.gl.enableVertexAttribArray(color)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.vertexAttribPointer(color, 4, this.gl.FLOAT, false, 0, 0)
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(color), this.gl.STATIC_DRAW)

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
        // TODO disable color vertex attrib array
        this.gl.disableVertexAttribArray(color)
    }
}