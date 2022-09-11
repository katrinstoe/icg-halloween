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

    color: Vector


    /**
     * Creates all WebGL buffers for the box
     *     6 ------- 7
     *    / |       / |
     *   3 ------- 2  |
     *   |  |      |  |
     *   |  5 -----|- 4  max?
     *   | /       | /
     *   0 ------- 1  min?
     *  looking in negative z axis direction
     * @param gl The canvas' context
     * @param minPoint The minimal x,y,z of the box
     * @param maxPoint The maximal x,y,z of the box
     * @param color
     */
    constructor(
        private gl: WebGL2RenderingContext,
        minPoint: Vector,
        maxPoint: Vector,
        color: Vector
    ) {
        this.gl = gl;
        const mi = minPoint;
        const ma = maxPoint;

//So for a triangle p1, p2, p3,
        // if the vector U = p2 - p1 and the vector V = p3 - p1 then the
        // normal N = U X V and can be calculated by:
        // Nx = UyVz - UzVy
        // Ny = UzVx - UxVz
        // Nz = UxVy - UyVx
        //Quelle: https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal & Tino
        let vertices = [
            mi.x, mi.y, ma.z, //0 / 0
            ma.x, mi.y, ma.z, //4 / 1
            ma.x, ma.y, ma.z, //9 /2
            mi.x, ma.y, ma.z, //6 /3
            ma.x, mi.y, mi.z, //1 /4
            mi.x, mi.y, mi.z, //0 / 5
            mi.x, ma.y, mi.z, //27 / 6
            ma.x, ma.y, mi.z, //31 / 7
        ]
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
        //erstellen Triangles mit denen wir normalen später berechenn
        let triangles: Vector[] = []
        for (let i = 0; i < indices.length; i++) {
            triangles.push(new Vector(vertices[indices[i] * 3+0], vertices[indices[i] * 3+1], vertices[indices[i] * 3+2], 1))
        }
        let normalsTriangles = []
        let colors = []
        for (let j = 0; j < triangles.length; j+=3) {

            let U = triangles[j+1].sub(triangles[j])
            let V = triangles[j+2].sub(triangles[j+1])

            normalsTriangles.push(U.cross(V).x)
            normalsTriangles.push(U.cross(V).y)
            normalsTriangles.push(U.cross(V).z)

            normalsTriangles.push(U.cross(V).x)
            normalsTriangles.push(U.cross(V).y)
            normalsTriangles.push(U.cross(V).z)

            normalsTriangles.push(U.cross(V).x)
            normalsTriangles.push(U.cross(V).y)
            normalsTriangles.push(U.cross(V).z)

            colors.push(color.x)
            colors.push(color.y)
            colors.push(color.z)
            colors.push(color.a)

            colors.push(color.x)
            colors.push(color.y)
            colors.push(color.z)
            colors.push(color.a)

            colors.push(color.x)
            colors.push(color.y)
            colors.push(color.z)
            colors.push(color.a)
        }

        vertices = []
        for (let j = 0; j < triangles.length; j++) {
            vertices.push(triangles[j].x)
            vertices.push(triangles[j].y)
            vertices.push(triangles[j].z)
        }
        indices = []
        for (let j = 0; j < vertices.length; j+=1) {
            indices.push(j)
        }

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.indexBuffer = indexBuffer;
        // this.elements = indices.length;

        // TODO create and fill a buffer for colours
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.colorBuffer = colorBuffer;

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalsTriangles), this.gl.STATIC_DRAW);
        this.normalBuffer = normalBuffer;
        this.elements = vertices.length;
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
        this.gl.vertexAttribPointer(positionLocation,3, this.gl.FLOAT, false, 0, 0);

        // TODO bind colour buffer
        //aus Scene Graph die Color und vertices kriegen und ich shader geben
        const color = shader.getAttributeLocation("a_color")
        this.gl.enableVertexAttribArray(color)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.vertexAttribPointer(color, 4, this.gl.FLOAT, false, 0, 0)
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(color), this.gl.STATIC_DRAW)
        // TODO bind normal buffer
        const aNormal = shader.getAttributeLocation("a_normal")
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.enableVertexAttribArray(aNormal)
        this.gl.vertexAttribPointer(aNormal, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);
        // this.gl.drawArrays(this.gl.TRIANGLES,0, this.elements);

        this.gl.disableVertexAttribArray(positionLocation);
        this.gl.disableVertexAttribArray(aNormal)
        // TODO disable color vertex attrib array
        this.gl.disableVertexAttribArray(color)
    }
}

