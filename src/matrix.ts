import Vector from './vector';

/**
 * Class representing a 4x4 Matrix
 */
export default class Matrix {

    /**
     * Data representing the matrix values
     */
    data: Float32Array;

    /**
     * Constructor of the matrix. Expects an array in row-major layout. Saves the data as column major internally.
     * @param mat Matrix values row major
     */
    constructor(mat: Array<number>) {
        this.data = new Float32Array(16);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                this.data[row * 4 + col] = mat[col * 4 + row];
            }
        }
    }

    /**
     * Returns the value of the matrix at position row, col
     * @param row The value's row
     * @param col The value's column
     * @return The requested value
     */
    getVal(row: number, col: number): number {
        return this.data[col * 4 + row];
    }

    /**
     * Sets the value of the matrix at position row, col
     * @param row The value's row
     * @param val The value to set to
     * @param col The value's column
     */
    setVal(row: number, col: number, val: number) {
        this.data[col * 4 + row] = val;
    }

    /**
     * Returns a matrix that represents a translation
     * @param translation The translation vector that shall be expressed by the matrix
     * @return The resulting translation matrix
     */
    static translation(translation: Vector): Matrix {
        return new Matrix([
            1, 0, 0, translation.x,
            0, 1, 0, translation.y,
            0, 0, 1, translation.z,
            0, 0, 0, 1
        ]);
    }

    /**
     * Returns a matrix that represents a rotation. The rotation axis is either the x, y or z axis (either x, y, z is 1).
     * @param axis The axis to rotate around
     * @param angle The angle to rotate
     * @return The resulting rotation matrix
     */
    static rotation(axis: Vector, angle: number): Matrix {
        if (axis.x > 0) { // about x axis
            return new Matrix([
                1, 0, 0, 0,
                0, Math.cos(angle), -Math.sin(angle), 0,
                0, Math.sin(angle), Math.cos(angle), 0,
                0, 0, 0, 1
            ]);
        }
        if (axis.y > 0) { // about y axis
            return new Matrix([
                Math.cos(angle), 0, Math.sin(angle), 0,
                0, 1, 0, 0,
                -Math.sin(angle), 0, Math.cos(angle), 0,
                0, 0, 0, 1
            ]);
        }
        if (axis.z > 0) { // about z axis
            return new Matrix([
                Math.cos(angle), -Math.sin(angle), 0, 0,
                Math.sin(angle), Math.cos(angle), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
    }

    /**
     * Returns a matrix that represents a scaling
     * @param scale The amount to scale in each direction
     * @return The resulting scaling matrix
     */
    static scaling(scale: Vector): Matrix {
        return new Matrix([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Constructs a lookat matrix
     * @param eye The position of the viewer
     * @param center The position to look at
     * @param up The up direction
     * @return The resulting lookat matrix
     */
    static lookat(eye: Vector, center: Vector, up: Vector): Matrix {
        let f = center.sub(eye).normalize()
        up.normalize()
        let s = f.cross(up).normalize()
        let u = s.cross(f).normalize()
        // TODO
        let lookatLeft = new Matrix([
            s.x, s.y, s.z, 0,
            u.x, u.y, u.z, 0,
            -(f.x), -(f.y), -(f.z), 0,
            0, 0, 0, 1
        ])
        let lookAtRight = new Matrix([
            1, 0, 0, -eye.x,
            0, 1, 0, -eye.y,
            0, 0, 1, -eye.z,
            0, 0, 0, 1
        ])
        //let lookAtRight = this.translation(eye.mul(-1))
        return lookatLeft.mul(lookAtRight)
    }

    /**
     * Constructs a new matrix that represents a projection normalisation transformation
     * @param left Camera-space left value of lower near point
     * @param right Camera-space right value of upper right far point
     * @param bottom Camera-space bottom value of lower lower near point
     * @param top Camera-space top value of upper right far point
     * @param near Camera-space near value of lower lower near point
     * @param far Camera-space far value of upper right far point
     * @return The rotation matrix
     */
    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
        // TODO
        let a = (right+left)/(right-left)
        let b = (top+bottom)/(top-bottom)
        let c = -(far+near)/(far-near)
        let d = -(2*far*near)/(far-near)
        let frustum = new Matrix([
            ((2*near)/(right-left)), 0, a, 0,
            0, ((2*near)/(top-bottom)), b, 0,
            0, 0, c, d,
            0, 0, -1, 0
        ])
        return frustum
    }

    /**
     * Constructs a new matrix that represents a projection normalisation transformation.
     * @param fovy Field of view in y-direction
     * @param aspect Aspect ratio between width and height
     * @param near Camera-space distance to near plane
     * @param far Camera-space distance to far plane
     * @return The resulting matrix
     */
    static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
        // TODO
        //return this.frustum(, near, far)
        return Matrix.identity()
    }

    /**
     * Returns the identity matrix
     * @return A new identity matrix
     */
    static identity(): Matrix {
        return new Matrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Matrix multiplication
     * @param other The matrix to multiply with
     * @return The result of the multiplication this*other
     */
    mul(other: Matrix): Matrix {
        const newMatrix = new Matrix([]);
        for (let row = 0; row < 4; row++) {

            for (let col = 0; col < 4; col++) {
                let val = 0
                for (let i = 0; i < 4; i++) {
                    val += this.getVal(row, i) * other.getVal(i, col)
                }
                newMatrix.setVal(row, col, val)

            }
        }
        return newMatrix
    }

    /**
     * Matrix-vector multiplication
     * @param other The vector to multiply with
     * @return The result of the multiplication this*other
     */
    mulVec(other: Vector): Vector {
        const vector = new Vector(0, 0, 0, 0,)


        for (let matrixRow = 0; matrixRow < 4; matrixRow++) {
            let val = 0;
            for (let matrixCol = 0; matrixCol < 4; matrixCol++) {
                val += this.getVal(matrixRow, matrixCol) * other.data[matrixCol];
            }
            vector.data[matrixRow] = val;
        }

        return vector
    }

    /**
     * Returns the transpose of this matrix
     * @return A new matrix that is the transposed of this
     */
    transpose()
        :
        Matrix {
        // TODO
        let newMatrix = Matrix.identity()
        for (let row = 0; row < 4; row++)
            for (let col = 0; col < 4; col++) {
                newMatrix.setVal(row, col, this.getVal(col, row))
            }
        return newMatrix;
    }

    /**
     * Debug print to console
     */
    print() {
        for (let row = 0; row < 4; row++) {
            console.log("> " + this.getVal(row, 0) +
                "\t" + this.getVal(row, 1) +
                "\t" + this.getVal(row, 2) +
                "\t" + this.getVal(row, 3)
            );
        }
    }


}