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
     *   |  5 -----|- 4
     *   | /       | /
     *   0 ------- 1
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


        let vertices = [
            mi.x, mi.y, ma.z, //5
            ma.x, mi.y, ma.z, //4
            ma.x, ma.y, ma.z, //7
            mi.x, ma.y, ma.z, //6
            ma.x, mi.y, mi.z, //1
            mi.x, mi.y, mi.z, //0
            mi.x, ma.y, mi.z, //3
            ma.x, ma.y, mi.z //2
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

        //0,1,2
        let firstTriangleFront = [
            new Vector(mi.x, mi.y, mi.z,1), new Vector(ma.x, mi.y, mi.z, 1), new Vector(ma.x, ma.y, mi.z, 1)
        ]
        //2, 3, 0
        let secondTriangleFront = [
            new Vector(ma.x, ma.y, mi.z, 1), new Vector(mi.x, ma.y, mi.z, 1), new Vector(mi.x, mi.y, mi.z,1)
        ]
        //4, 5, 6
        let firstTriangleBack = [
            new Vector(ma.x, mi.y, ma.z, 1), new Vector(mi.x, mi.y, ma.z, 1), new Vector(mi.x, ma.y, ma.z, 1)
        ]
        //6, 7, 4
        let secondTriangleBack = [
            new Vector(mi.x, ma.y, ma.z, 1), new Vector(ma.x, ma.y, ma.z, 1), new Vector(ma.x, mi.y, ma.z, 1)
        ]
        // 1, 4, 7,
        let firstTriangleRight = [
            new Vector(ma.x, mi.y, mi.z, 1), new Vector(ma.x, mi.y, ma.z, 1), new Vector(ma.x, ma.y, ma.z, 1)
        ]
        // 7, 2, 1,
        let secondTriangleRight = [
            new Vector(ma.x, ma.y, ma.z, 1), new Vector(ma.x, ma.y, mi.z, 1), new Vector(ma.x, mi.y, mi.z, 1)
        ]
        //3, 2, 7,
        let firstTriangleTop = [
            new Vector(mi.x, ma.y, mi.z, 1), new Vector(ma.x, ma.y, mi.z, 1),new Vector(ma.x, ma.y, ma.z, 1)
        ]
        // 7, 6, 3,
        let secondTriangleTop = [
            new Vector(ma.x, ma.y, ma.z, 1), new Vector(mi.x, ma.y, ma.z, 1), new Vector(mi.x, ma.y, mi.z, 1)
        ]
        // 5, 0, 3,
        let firstTriangleLeft = [
            new Vector(mi.x, mi.y, ma.z, 1), new Vector(mi.x, mi.y, mi.z, 1), new Vector(mi.x, ma.y, mi.z, 1)
        ]
        // 3, 6, 5,
        let secondTriangleLeft = [
            new Vector(mi.x, ma.y, mi.z, 1), new Vector(mi.x, ma.y, ma.z, 1), new Vector(mi.x, mi.y, ma.z, 1)
        ]
        // 5, 4, 1,
        let firstTriangleBottom = [
            new Vector(mi.x, mi.y, ma.z, 1),  new Vector(ma.x, mi.y, ma.z, 1), new Vector(ma.x, mi.y, mi.z, 1)
        ]
        // 1, 0, 5
        let secondTriangleBottom = [
            new Vector(ma.x, mi.y, mi.z, 1), new Vector(mi.x, mi.y, mi.z, 1), new Vector(mi.x, mi.y, ma.z, 1)
        ]
        let triangles = [firstTriangleFront, secondTriangleFront, firstTriangleBack, secondTriangleBack, firstTriangleRight, secondTriangleBack, firstTriangleTop, secondTriangleTop, firstTriangleLeft, secondTriangleLeft, firstTriangleBottom, secondTriangleBottom]

        // Nf = (↑B - ↑A) × (↑C - ↑A)
        //https://stackoverflow.com/questions/6656358/calculating-normals-in-a-triangle-mesh/6661242#6661242
        // let firstNormalF = (firstTriangleFront[1].sub(firstTriangleFront[2])).cross(firstTriangleFront[2].sub(firstTriangleFront[0]))
        // let secondNormalF = (secondTriangleFront[1].sub(secondTriangleFront[2])).cross(secondTriangleFront[2].sub(secondTriangleFront[0]))
        // let thirdNormalB = (firstTriangleBack[1].sub(firstTriangleBack[2])).cross(firstTriangleBack[2].sub(firstTriangleBack[0]))
        // let fourthNormalB = (secondTriangleBack[1].sub(secondTriangleBack[2])).cross(secondTriangleBack[2].sub(secondTriangleBack[0]))
        // let fifthNormalR = (firstTriangleRight[1].sub(firstTriangleRight[2])).cross(firstTriangleRight[2].sub(firstTriangleRight[0]))
        // let sixthNormalR = (secondTriangleRight[1].sub(secondTriangleRight[2])).cross(secondTriangleRight[2].sub(secondTriangleRight[0]))
        // let seventhNormalT = (firstTriangleTop[1].sub(firstTriangleTop[2])).cross(firstTriangleTop[2].sub(firstTriangleTop[0]))
        // let eigthNormalT = (secondTriangleTop[1].sub(secondTriangleTop[2])).cross(secondTriangleTop[2].sub(secondTriangleTop[0]))
        // let ninthNormalL = (firstTriangleLeft[1].sub(firstTriangleLeft[2])).cross(firstTriangleLeft[2].sub(firstTriangleLeft[0]))
        // let tenthNormalL = (secondTriangleLeft[1].sub(secondTriangleLeft[2])).cross(secondTriangleLeft[2].sub(secondTriangleLeft[0]))
        // let eleventhNormalB = (firstTriangleBottom[1].sub(firstTriangleBottom[2])).cross(firstTriangleBottom[2].sub(firstTriangleBottom[0]))
        // let twelvethNormalB = (secondTriangleBottom[1].sub(secondTriangleBottom[2])).cross(secondTriangleBottom[2].sub(secondTriangleBottom[0]))

        // let normals = [
        //     firstNormalF.x, firstNormalF.y, firstNormalF.z, firstNormalF.a,
        //     secondNormalF.x, secondNormalF.y, secondNormalF.z, secondNormalF.a,
        //     thirdNormalB.x, thirdNormalB.y, thirdNormalB.z, thirdNormalB.a,
        //     fourthNormalB.x, fourthNormalB.y, fourthNormalB.z, fourthNormalB.a,
        //     fifthNormalR.x, fifthNormalR.y, fifthNormalR.z, fifthNormalR.a,
        //     sixthNormalR.x, sixthNormalR.y, sixthNormalR.z, sixthNormalR.a,
        //     seventhNormalT.x, seventhNormalT.y, seventhNormalT.z, seventhNormalT.a,
        //     eigthNormalT.x, eigthNormalT.y, eigthNormalT.z, eigthNormalT.a,
        //     ninthNormalL.x, ninthNormalL.y, ninthNormalL.z, ninthNormalL.a,
        //     tenthNormalL.x, tenthNormalL.y, tenthNormalL.z, tenthNormalL.a,
        //     eleventhNormalB.x, eleventhNormalB.y, eleventhNormalB.z, eleventhNormalB.a,
        //     twelvethNormalB.x, twelvethNormalB.y, twelvethNormalB.z, twelvethNormalB.a,
        //
        // ]

        for (let triangle of triangles) {
            triangle[1].sub(triangle[2]).cross(triangle[2].sub(triangle[0]))
            console.log(triangle)
        }

        let normals = [
            triangles[0][0].x, triangles[0][0].y, triangles[0][0].z, triangles[0][0].a,
            triangles[1][0].x, triangles[1][0].y, triangles[1][0].z, triangles[1][0].a,
            triangles[2][0].x, triangles[2][0].y, triangles[2][0].z, triangles[2][0].a,
            triangles[3][0].x, triangles[3][0].y, triangles[3][0].z, triangles[3][0].a,
            triangles[4][0].x, triangles[4][0].y, triangles[4][0].z, triangles[4][0].a,
            triangles[5][0].x, triangles[5][0].y, triangles[5][0].z, triangles[5][0].a,
            triangles[6][0].x, triangles[6][0].y, triangles[6][0].z, triangles[6][0].a,
            triangles[7][0].x, triangles[7][0].y, triangles[7][0].z, triangles[7][0].a,
            triangles[8][0].x, triangles[8][0].y, triangles[8][0].z, triangles[8][0].a,
            triangles[9][0].x, triangles[9][0].y, triangles[9][0].z, triangles[9][0].a,
        ]
        console.log(normals)


        let colors = [
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
            color.x, color.y, color.z, color.a,
        ]


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
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.colorBuffer = colorBuffer;

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
        this.normalBuffer = normalBuffer;
        this.elements = indices.length;
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
        // TODO bind normal buffer
        const aNormal = shader.getAttributeLocation("a_normal")
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.enableVertexAttribArray(aNormal)
        this.gl.vertexAttribPointer(aNormal, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
        this.gl.disableVertexAttribArray(aNormal)
        // TODO disable color vertex attrib array
        this.gl.disableVertexAttribArray(color)
    }
}