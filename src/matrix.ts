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
        if (axis.x != 0){
            return new Matrix([
                1, 0,0,0,
                0, Math.cos(angle), -Math.sin(angle),0,
                0, Math.sin(angle), Math.cos(angle), 0,
                0, 0, 0, 1
            ])
        }
        if (axis.z != 0) {
            return new Matrix([
                Math.cos(angle), -Math.sin(angle), 0, 0,
                Math.sin(angle), Math.cos(angle), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
        if (axis.y != 0){
            return new Matrix([
                Math.cos(angle), 0, Math.sin(angle), 0,
                0, 1, 0, 0
                -Math.sin(angle), 0, Math.cos(angle), 0,
                0, 0, 0, 1
            ])
        }
        //    TODO: Überprüfen über welche Axis rotiert wird
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
        // TODO
        return null
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
        return null
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
        return null
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
        // TODO
        let resArray = new Array<number>();

        let i, j, k;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                resArray[row * 4 + col] = 0;
                for (k = 0; k < 4; k++)
                    resArray[row * 4 + col] += this.data[4 * row + k] * other.data[col + 4 * k];
            }
        }
        return new Matrix(resArray);
    }

    /**
     * Matrix-vector multiplication
     * @param other The vector to multiply with
     * @return The result of the multiplication this*other
     */
    mulVec(other: Vector):Vector {
        // TODO
        let resArray = new Array<number>();

        let i, k;
        for (let row = 0; row < 4; row++) {
            resArray[row] = 0;
            for (k = 0; k < 4; k++)
                resArray[row] += this.data[4 * row + k] * other.data[k];
        }
        return new Vector(resArray[0], resArray[1], resArray[2], resArray[3]);
    }

    /**
     * Returns the transpose of this matrix
     * @return A new matrix that is the transposed of this
     */
    transpose()
        :
        Matrix {
        // TODO
        return null
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