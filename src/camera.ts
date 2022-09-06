import Vector from "./vector";


export default class Camera{
    aspect: number
    //lookat Matrix
    constructor(eye: Vector, center: Vector, up: Vector, fovy: number, near: number, far: number, width: number, height: number, shininess:number, kS: number, kD: number, lightPositions: Array<Vector>) {
        this.aspect = width/height;

    }
}