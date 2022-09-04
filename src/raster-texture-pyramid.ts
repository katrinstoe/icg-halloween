import Vector from './vector';
import Shader from './shader';

/**
 * A class creating buffers for a textured box to render it with WebGL
 */
export default class RasterTexturePyramid {
    /**
     * The buffer containing the pyramid's vertices
     */
    vertexBuffer: WebGLBuffer;
    /**
     * The buffer containing the pyramid's texture
     */
    texBuffer: WebGLBuffer;
    /**
     * The buffer containing the pyramid's texture coordinates
     */
    texCoords: WebGLBuffer;
    /**
     * The amount of faces
     */
    elements: number;

    /**
     * Creates all WebGL buffers for the textured box
     *
     *       2         2 = top
     *      / \        3 = backPoint
     *     /  3\       1 = rightPoint
     *    /     \      0 = leftPoint
     *   0-------1
     *  looking in negative z axis direction
     * @param gl The canvas' context
     * @param top The top of the pyramid
     * @param leftPoint the left point of the pyramid
     * @param rightPoint the right point of the pyramid
     * @param backPoint the back point of the pyramid
     * @param texture The URL to the image to be used as texture
     */
    constructor(
        private gl: WebGL2RenderingContext,
        top: Vector,
        leftPoint: Vector,
        rightPoint: Vector,
        backPoint: Vector,
        texture: string
    ) {
        const to = top;
        const l = leftPoint;
        const r = rightPoint;
        const b = backPoint;
        let vertices = [
            // front
            l.x, l.x, l.z, r.x, r.y, r.z, to.x, to.y, to.z,
            // right
            r.x, r.y, r.z, b.x, b.y, b.z, to.x, to.y, to.z,
            // left
            b.x, b.y, b.z, l.x, l.y, l.z, to.x, to.y, to.z,
            // bottom
            r.x, r.y, r.z, l.x, l.y, l.z, b.x, b.y, b.z,
        ];

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;
        this.elements = vertices.length / 3;

        let pyramidTexture = gl.createTexture();
        let pyramidImage = new Image();
        pyramidImage.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, pyramidTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pyramidImage);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        pyramidImage.src = texture;
        this.texBuffer = pyramidTexture;

        let uv = [
            // front
            0, 1, 1, 1, 0.5, 0,
            //right
            0, 1, 1, 1, 0.5, 0,
            //left
            0, 1, 1, 1, 0.5, 0,
            //bottom
            0, 1, 1, 1, 0.5, 0,
        ];
        let uvBuffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv),
            gl.STATIC_DRAW);
        this.texCoords = uvBuffer;
    }

    /**
     * Renders the textured pyramid
     * @param {Shader} shader - The shader used to render
     */
    render(shader: Shader) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        // Bind the texture coordinates in this.texCoords
        // to their attribute in the shader
        // TODO
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoords);
        const textureCoord = shader.getAttributeLocation("a_texCoord")
        this.gl.enableVertexAttribArray(textureCoord);
        this.gl.vertexAttribPointer(textureCoord, 2, this.gl.FLOAT, false, 0, 0);


        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBuffer);
        shader.getUniformInt("sampler").set(0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.elements);
        //added



        this.gl.disableVertexAttribArray(positionLocation);
        // TODO disable texture vertex attrib array
        this.gl.disableVertexAttribArray(textureCoord)
    }
}