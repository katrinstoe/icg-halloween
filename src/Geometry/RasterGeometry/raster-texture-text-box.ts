import Vector from '../../mathOperations/vector';
import Shader from '../../Shaders/shader';

/**
 * A class creating buffers for a textured box to render it with WebGL
 */
export default class RasterTextureTextBox {
    /**
     * The buffer containing the box's vertices
     */
    vertexBuffer: WebGLBuffer;
    /**
     * The buffer containing the box's texture
     */
    texBuffer: WebGLBuffer;
    /**
     * The buffer containing the box's texture coordinates
     */
    texCoords: WebGLBuffer;
    /**
     * The amount of faces
     */
    elements: number;
    normalBuffer: WebGLBuffer;
    normals: Array<number>;

    //added
    canvasTexture: WebGLTexture;
    canvas: HTMLCanvasElement;



    /**
     * Creates all WebGL buffers for the textured box
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
     * @param texture The URL to the image to be used as texture
     */
    constructor(
        private gl: WebGL2RenderingContext,
        minPoint: Vector,
        maxPoint: Vector,
        //added
        //canvas?: HTMLCanvasElement
    ) {
        const mi = minPoint;
        const ma = maxPoint;
        let vertices = [
            // front
            mi.x, mi.y, ma.z, ma.x, mi.y, ma.z, ma.x, ma.y, ma.z,
            ma.x, ma.y, ma.z, mi.x, ma.y, ma.z, mi.x, mi.y, ma.z,
            // back
            ma.x, mi.y, mi.z, mi.x, mi.y, mi.z, mi.x, ma.y, mi.z,
            mi.x, ma.y, mi.z, ma.x, ma.y, mi.z, ma.x, mi.y, mi.z,
            // right
            ma.x, mi.y, ma.z, ma.x, mi.y, mi.z, ma.x, ma.y, mi.z,
            ma.x, ma.y, mi.z, ma.x, ma.y, ma.z, ma.x, mi.y, ma.z,
            // top
            mi.x, ma.y, ma.z, ma.x, ma.y, ma.z, ma.x, ma.y, mi.z,
            ma.x, ma.y, mi.z, mi.x, ma.y, mi.z, mi.x, ma.y, ma.z,
            // left
            mi.x, mi.y, mi.z, mi.x, mi.y, ma.z, mi.x, ma.y, ma.z,
            mi.x, ma.y, ma.z, mi.x, ma.y, mi.z, mi.x, mi.y, mi.z,
            // bottom
            mi.x, mi.y, mi.z, ma.x, mi.y, mi.z, ma.x, mi.y, ma.z,
            ma.x, mi.y, ma.z, mi.x, mi.y, ma.z, mi.x, mi.y, mi.z
        ];


        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.canvas.width = 400;
        this.canvas.height = 400;


        const ctx = this.canvas.getContext('2d');

        ctx.fillStyle = "#7e0016"; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
        ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
        ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
        ctx.font = "40px monospace";	// This determines the size of the text and the font family used

        ctx.fillText("BuHuu, I'm a Box!", this.canvas.width/2, this.canvas.height/2);

        this.initTexture()

        /*let cubeImage = new Image();
        cubeImage.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        cubeImage.src = texture;*/
        this.texBuffer = this.canvasTexture;

        let uv = [
            // front
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
            //back
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
            //right
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
            //top
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
            //left
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
            //bottom
            0, 1, 1, 1, 1, 0,
            1, 0, 0, 0, 0, 1,
        ];
        let uvBuffer = this.gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv),
            gl.STATIC_DRAW);
        this.texCoords = uvBuffer;
        //Quelle: so wie raster-box
        let triangles: Vector[] = []
        for (let i = 0; i < vertices.length; i++) {
            triangles.push(new Vector(vertices[i * 3+0], vertices[i * 3+1], vertices[i * 3+2], 1))
        }
        let normalsTriangles = []
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
        }
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;
        // this.elements = vertices.length / 3;

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalsTriangles), this.gl.STATIC_DRAW);
        this.normalBuffer = normalBuffer;
        this.elements = vertices.length/3;
    }

    /**
     * Renders the textured box
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

        const aNormal = shader.getAttributeLocation("a_normal")
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.enableVertexAttribArray(aNormal)
        this.gl.vertexAttribPointer(aNormal, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBuffer);
        shader.getUniformInt("sampler").set(0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.elements);
        //added


        this.gl.disableVertexAttribArray(positionLocation);
        // TODO disable texture vertex attrib array
        this.gl.disableVertexAttribArray(textureCoord)
        this.gl.disableVertexAttribArray(aNormal)
    }

    initTexture() {
        this.canvasTexture = this.gl.createTexture();
        this.handleLoadedTexture(this.canvasTexture, this.canvas);
    }

    handleLoadedTexture(texture: any, textureCanvas: HTMLElement) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.canvas); // This is the important line!
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}

