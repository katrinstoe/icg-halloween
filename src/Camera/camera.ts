import Vector from "../mathOperations/vector";


export default class Camera{
    aspect: number
    origin: Vector
    eye: Vector
    center: Vector
    up: Vector
    fovy: number
    near: number
    far: number
    width: number
    height: number
    shininess: number
    kS: number
    kD: number
    kA: number
    alpha: number

    constructor(origin: Vector, eye: Vector, center: Vector, up: Vector, fovy: number, near: number, far: number, width: number, height: number, shininess:number, kS: number, kD: number, kA: number) {
        this.aspect = width/height;
        this.origin = origin
        this.eye = eye
        this.center = center
        this.up = up
        this.fovy = fovy
        this.near = near
        this.far = far
        this.width = width
        this.height = height
        this.shininess = shininess
        this.kS = kS
        this.kD = kD
        this.kA = kA
        this.alpha = Math.PI / 3

    }
}