import Matrix from "./matrix";
import Vector from "./vector";
/**
 * Hier werden Quaternionen transformationen berechnet
 * Aber nur in Übung genutzt nichtmehr in Projekt
 * */
export default class Quaternion {

    data: Vector;

    constructor(x: number, y: number, z: number, w: number) {
        this.data = new Vector(x, y, z, w);
    }
/**
 * erstelllen eines neuen Quaternions aus ner axis und nem angle
 * */
    static fromAxisAngle(axis: Vector, angle: number) {
        let q = new Quaternion(1, 0, 0, 0);
        // TODO
        let a = axis
        let s = Math.sin(angle)
        q.data.x = a.x * s;
        q.data.y = a.y * s;
        q.data.z = a.z * s;
        q.data.w = Math.cos(angle)

        return new Quaternion(q.data.x, q.data.y, q.data.z, q.data.w);
    }
/**
 * The conjugate can be used to swap the relative frames described by an orientation. Basically opposite representation similar to fromWorld toWOrld(?)
 * */
    get conjugate(): Quaternion {
        let q = new Quaternion(1, 0, 0, 0);
        // TODO
        q.data.x = -this.data.x;
        q.data.y = -this.data.y;
        q.data.z = -this.data.z;

        return q;
    }
/**
 * refers to the multiplicative inverse (or 1/q)
 * */
    get inverse(): Quaternion {
        let q = this.conjugate;
        // TODO
        let vec = q.data.mul(1/Math.pow(this.data.length,2));
        q.data = vec;
        return q;
    }
/**
 * sphärische lineare Interpolation
 * The effect is a rotation with uniform angular velocity around a fixed rotation axis
 * */
    slerp(other: Quaternion, t: number): Quaternion {
        let slerpq = other;
        // TODO
        let theta = Math.acos(this.data.dot(other.data))
        let s = this.data.mul(Math.sin(theta*(1-t))/(Math.sin(theta))).add(other.data.mul((Math.sin(theta*t))/Math.sin(theta)))
        //slerpq.data = s
        return new Quaternion(s.x, s.y, s.z, s.w);
    }

    toMatrix(): Matrix {
        //let mat = Matrix.identity();
        // TODO
        let mat = new Matrix([
            (1-2*(Math.pow(this.data.y, 2) + Math.pow(this.data.z, 2))), 2*(this.data.x * this.data.y - this.data.w * this.data.z), 2*(this.data.x * this.data.z + this.data.w* this.data.y), 0,
            2*(this.data.x * this.data.y + this.data.w * this.data.z), 1-2*(Math.pow(this.data.x, 2)+Math.pow(this.data.z, 2)), 2*(this.data.y*this.data.z - this.data.w* this.data.x), 0,
            2*(this.data.x * this.data.z - this.data.w*this.data.y), 2*(this.data.y*this.data.z + this.data.w * this.data.x), 1-2*(Math.pow(this.data.x, 2)+ Math.pow(this.data.y, 2)), 0,
            0, 0, 0, 1])
        return mat;
    }

}