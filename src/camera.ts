import Vector from "./vector";


export default class Camera{
    aspect: number

    constructor(eye: Vector, center: Vector, up: Vector, fovy: number, near: number, far: number, width: number, height: number) {
        this.aspect = width/height;

    }
}