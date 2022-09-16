import Visitor from "./visitor";
import {
    AABoxButtonNode,
    AABoxNode,
    CameraNode,
    GroupNode,
    LightNode,
    Node,
    PyramidNode,
    SphereNode,
    TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureTextBoxNode,
    TextureVideoBoxNode,
    TicTacToeTextureNode
} from "../Nodes/nodes";
import Vector from "../mathOperations/vector";
import Matrix from "../mathOperations/matrix";
import Sphere from "../Geometry/RayGeometry/sphere";
import AABox from "../Geometry/RayGeometry/aabox";
import Pyramid from "../Geometry/RayGeometry/pyramid";
import geometryObject from "./geometryObject";
import Ray from "../RayTracing/ray";
import phong from "../RayTracing/phong";
import Intersection from "../RayTracing/intersection";
import Camera from "../Camera/camera";


const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.25, 1, 0, 1), new Vector(-1, -1, 1, 1), new Vector(1 , -1, 0, 1), new Vector(-1, -1, -1, 1), new Vector(1, 0, 0, 1))

/**
 * The supafast version of the rayvisitor
 * Jedes mal beim Rendern geht rayvisitor durch und schaut sich für jedes Pixel ganzen Szenengraph und dessen translations, etc.
 * Sparen jetzt rechenleistung indem wir nur einmal machen bis zum nächsten renderaufruf und in Liste speichern
 * Danach gehen wir mit liste den Rayvisitor durch
 * Bis zum nächsten rendern ändert sich die position der Objekte nämlich eh nicht
 * */
export default class RayVisitorSupaFast extends Visitor {

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
        super()
        this.imageData = context.getImageData(0, 0, width, height);
    }



    render(
        rootNode: Node,
        camera: Camera,
        lightPositions: Array<Vector>,
        view: Matrix
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
                        let color = phong(this.intersectionColor, this.intersection, camera.shininess, camera.origin, camera.kS, camera.kD, camera.kA, lightPositions);
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
    //geometryObject ist interface mit intersect methode und node color um Code Quality besser zu haben
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

    visitTicTacToeTextureNode(node: TicTacToeTextureNode): void {
    }

    visitAABoxButtonNode(node: AABoxButtonNode): void {
    }
    visitTextureBoxButtonNode(node: TextureBoxButtonNode): void {
    }
    visitTextureTextBoxNode(node: TextureTextBoxNode): void {
    }

};

type ObjectNodeWrapper = {
    fromWorld: Matrix,
    toWorld: Matrix,
    object: geometryObject
}