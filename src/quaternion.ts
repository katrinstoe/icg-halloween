import Matrix from "./matrix";
import Vector from "./vector";

export default class Quaternion {

    data: Vector;

    constructor(x: number, y: number, z: number, w: number) {
        this.data = new Vector(x, y, z, w);
    }

    static fromAxisAngle(axis: Vector, angle: number) {
        let q = new Quaternion(1, 0, 0, 0);
        // TODO
        return q;
    }

    get conjugate(): Quaternion {
        let q = new Quaternion(1, 0, 0, 0);
        // TODO
        q.data.y = -q.data.y;
        q.data.z = -q.data.z;
        q.data.w = -q.data.w;

        return q;
    }

    get inverse(): Quaternion {
        let q = this.conjugate;
        // TODO
        let vec = q.data.mul(1/Math.pow(this.data.length,2));
        q.data = vec;
        return q;
    }

    slerp(other: Quaternion, t: number): Quaternion {
        let slerpq = other;
        // TODO
        let cos = this.data.dot(other.data)
        let s = this.data.mul(Math.sin(cos*(1-t))/(Math.sin(cos))).add(other.data.mul((Math.sin(cos*t))/Math.sin(cos)))
        slerpq.data = s
        return slerpq;
    }

    toMatrix(): Matrix {
        //let mat = Matrix.identity();
        // TODO
        let mat = new Matrix([
            (1-2*(Math.pow(this.data.y, 2) + Math.pow(this.data.z, 2))), 2*(this.data.x * this.data.y - this.data.w * this.data.z), 2*(this.data.x * this.data.z * this.data.w* this.data.y), 0,
            2*(this.data.x * this.data.y + this.data.w * this.data.z), 1-2*(Math.pow(this.data.x, 2)+Math.pow(this.data.z, 2)), 2*(this.data.y*this.data.z - this.data.w* this.data.x), 0,
            2*(this.data.x * this.data.z - this.data.w*this.data.y), 2*(this.data.y*this.data.z + this.data.w * this.data.x), 1-2*(Math.pow(this.data.x, 2)+ Math.pow(this.data.y, 2)), 0,
            0, 0, 0, 1])
        return mat;
    }

    norm(): number{
        return Math.sqrt(Math.pow(this.data.x, 2) + Math.pow(this.data.y, 2)+Math.pow(this.data.z, 2)+Math.pow(this.data.w, 2));
    }
}