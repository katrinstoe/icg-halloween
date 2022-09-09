import Visitor from "./visitor";
import {
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode, Node,
    PyramidNode,
    SphereNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode
} from "./nodes";
import Vector from "./vector";
import Matrix from "./matrix";
import Sphere from "./sphere";
import AABox from "./aabox";
import Pyramid from "./pyramid";
import geometryObject from "./GeometryObject";
import Ray from "./ray";
import phong from "./phong";
import Intersection from "./intersection";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.5, -0.5, 0.5, 1), new Vector(0.5, -0.5, 0.5, 1), new Vector(0, -0.5, -0.5, 1), new Vector(0, 0.5, 0, 1), new Vector(0, 0, 0, 1))

export default class RayVisitorSupaFast implements Visitor {
    traverse: Array<Matrix>
    inverse: Array<Matrix>

    private imageData: ImageData;
    private leafNodeAndPositionsList: ObjectNodeWrapper[]
    private ray: Ray;
    private intersection: Intersection;
    private intersectionColor: Vector;
    constructor(
        private context: CanvasRenderingContext2D,
        width: number,
        height: number
    ) {
        this.imageData = context.getImageData(0, 0, width, height);
    }
    //ich habe:
    // Pro Pixel alle Transformations des Szenengraph berechnet
    // ich will:
    // pro renderaufruf alle Transformations des Szenengraph berechnen
    // ich brauche:
    // 1 szenengraphaufruf per render nich per pixel
    //Daher haben wir jetzt LeadNodeAndPositionList in der die Objekte inklusive aller wichtiger Daten gespeichert werden
    //Dann kann der szenengraph einmal per render (nachdem die animation sich geändert hat) durchlaufen und sich die Endpositionen für die Objekte speichern, braucht
    //so nicht pro Pixel jeweils ganzen Szenengraph traversieren, sondern kann einmal endposition mit matrix kriegen und anwenden
    //
    render(
        rootNode: Node,
        camera: { origin: Vector, width: number, height: number, alpha: number, shininess: number, kS: number, kD: number, kA: number, lightPositions: Array<Vector> }
    ) {
        this.leafNodeAndPositionsList = []
        // clear
        let data = this.imageData.data;
        data.fill(0);
        // raytrace
        const width = this.imageData.width;
        const height = this.imageData.height;
        this.traverse = new Array<Matrix>(Matrix.identity())
        this.inverse = new Array<Matrix>(Matrix.identity())
        //wird einmal aufgerufen für renderaufruf und speichert die matrizen, farben, etc. in Liste mithilfe der einzelnen visit Methoden
        rootNode.accept(this);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.ray = Ray.makeRay(x, y, camera);

                this.intersection = null;
                //ruft für jedes Pixel jedesObject in der Liste auf und berechnet Intersection einmal und muss nichtmehr ganzen Szenengraph pro Pixel traversieren (weiß
                //Endpositionen der einzelnen Objekte
                for (let objectNodeWrapper of this.leafNodeAndPositionsList) {
                    this.visitObjectNodeIntersect(objectNodeWrapper)
                }

                if (this.intersection) {
                    if (!this.intersectionColor) {
                        data[4 * (width * y + x) + 0] = 0;
                        data[4 * (width * y + x) + 1] = 0;
                        data[4 * (width * y + x) + 2] = 0;
                        data[4 * (width * y + x) + 3] = 255;
                    } else {
                        let color = phong(this.intersectionColor, this.intersection, camera.shininess, camera.origin, camera.kS, camera.kD, camera.kA, camera.lightPositions);
                        data[4 * (width * y + x) + 0] = color.r * 255;
                        data[4 * (width * y + x) + 1] = color.g * 255;
                        data[4 * (width * y + x) + 2] = color.b * 255;
                        data[4 * (width * y + x) + 3] = 255;
                    }
                }
            }
        }
        this.context.putImageData(this.imageData, 0, 0);

    }
    //allgemeine Methode zum Intersecten von Objekten
    visitObjectNodeIntersect(node: ObjectNodeWrapper) {
        const ray = new Ray(node.fromWorld.mulVec(this.ray.origin), node.fromWorld.mulVec(this.ray.direction).normalize());
        let intersection = node.object.intersect(ray);

        if (intersection) {
            const intersectionPointWorld = node.toWorld.mulVec(intersection.point);
            const intersectionNormalWorld = node.toWorld.mulVec(intersection.normal).normalize();
            intersection = new Intersection(
                (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
                intersectionPointWorld,
                intersectionNormalWorld
            );
            if (this.intersection === null || intersection.closerThan(this.intersection)) {
                this.intersection = intersection;
                this.intersectionColor = node.object.color;
            }
        }
    }

    visitAABoxNode(node: AABoxNode): void {
        this.addToNodesList(new AABox(UNIT_AABOX.minPoint, UNIT_AABOX.maxPoint, node.color))

    }

    visitCameraNode(node: CameraNode): void {
    }

    visitGroupNode(node: GroupNode): void {
        let children = node.getchildren()
        let matrix = node.transform.getMatrix()
        let inverseMatrix = node.transform.getInverseMatrix()
        this.traverse.push(this.traverse[this.traverse.length-1].mul(matrix))
        this.inverse.push(inverseMatrix.mul(this.inverse[this.inverse.length-1]))

        for (let child of children){
            child.accept(this)
        }
        this.traverse.pop()
        this.inverse.pop()
    }

    visitLightNode(node: LightNode): void {
    }

    visitPyramidNode(node: PyramidNode): void {
        this.addToNodesList(new Pyramid(UNIT_PYRAMID.top, UNIT_PYRAMID.backPoint,UNIT_PYRAMID.rightPoint, UNIT_PYRAMID.leftPoint, node.color))
    }

    visitSphereNode(node: SphereNode): void {
        this.addToNodesList(new Sphere(UNIT_SPHERE.center, UNIT_SPHERE.radius, node.color))
    }

    visitTextureBoxNode(node: TextureBoxNode): void {

    }

    visitTexturePyramidNode(node: TexturePyramidNode): void {

    }

    visitTextureVideoBoxNode(node: TextureVideoBoxNode): void {
    }
    //erstellt wichtige Werte für einzelne Objekte und added sie zur Liste
    private addToNodesList(objectGeometry: geometryObject) {
        let toWorld = this.traverse[this.traverse.length-1];
        let fromWorld = this.inverse[this.inverse.length-1];
        const object ={
            toWorld: toWorld,
            fromWorld: fromWorld,
            object: objectGeometry
        }
        this.leafNodeAndPositionsList.push(object)
    }

};

type ObjectNodeWrapper = {
    fromWorld: Matrix,
    toWorld: Matrix,
    object: geometryObject
}