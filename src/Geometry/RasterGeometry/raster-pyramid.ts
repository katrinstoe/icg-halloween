import Vector from '../../mathOperations/vector';
import Shader from '../../Shaders/shader';

/**
 * A class creating buffers for a pyramid to render it with WebGL
 */
export default class RasterPyramid {
    /**
     * The buffer containing the pyramid's vertices
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
    private normalBuffer: WebGLBuffer;

    /**
     * Creates all WebGL buffers for the box
     *  looking in negative z axis direction
     * @param gl The canvas' context
     * @param leftPoint The left vertex of the pyramid
     * @param rightPoint The right vertex of the pyramid
     * @param backPoint The back vertex of the pyramid
     * @param topPoint The top vertex of the pyramid
     * @param color the color of the pyramid
     */
    constructor(
        private gl: WebGL2RenderingContext,
        leftPoint: Vector,
        rightPoint: Vector,
        backPoint: Vector,
        topPoint: Vector,
        color: Vector
    ) {
        this.gl = gl;
        const l = leftPoint;
        const r = rightPoint;
        const b = backPoint;
        const t = topPoint;
        let vertices = [
            l.x, l.y, l.z,
            r.x, r.y, r.z,
            b.x, b.y, b.z,
            t.x, t.y, t.z
        ];
        let indices = [
            // front
            0, 1, 3,
            // right
            1, 2, 3,
            // left
            2, 0, 3,
            // bottom
            0, 2, 1
        ];
        //Triangels für die Normalenberechnung erstellen
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
        this.elements = indices.length;

        // TODO create and fill a buffer for colours
        const colorBufffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBufffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.colorBuffer = colorBufffer;

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
    render(shader: Shader) {
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

        const aNormal = shader.getAttributeLocation("a_normal")
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.enableVertexAttribArray(aNormal)
        this.gl.vertexAttribPointer(aNormal, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
        // TODO disable color vertex attrib array
        this.gl.disableVertexAttribArray(color)
        this.gl.disableVertexAttribArray(aNormal)
    }
}