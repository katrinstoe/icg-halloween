import Vector from "../mathOperations/vector";

/**
 * Klasse, die eine Kamera repräsentiert
 */
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

    /**
     * Kreiert eine neue Kamera
     * @param origin origin of the ray
     * @param eye Eye of the camera
     * @param center center of the camera
     * @param up up of the camera
     * @param fovy field of view
     * @param near near of the camera - used for perspective
     * @param far far of the camera - used for perspective
     * @param width width for raytracing
     * @param height height for raytracing
     * @param shininess Shininess Parameter für das phong shading
     * @param kS kS Parameter für Phong Shading
     * @param kD KD Parameter für Phong Shading
     * @param kA kA Parameter für phong shading
     */
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