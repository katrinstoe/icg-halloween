import {
    AABoxNode,
    GroupNode,
    LightNode, Node,
    PyramidNode,
    SphereNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode
} from "./nodes";
import {Rotation, Scaling, Translation} from "./transformation";
import Vector from "./vector";
import {AnimationNode, DriverNode, RotationNode, ScalerNode} from "./animation-nodes";
import AABox from "./aabox";
import {LightVisitor} from "./lightVisitor";
import Camera from "./camera";
import {CameraNode} from "./nodes";

export default class Scenegraph {
    static getScenegraph() {
        const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
        const canvas2 = document.getElementById("rayTracer") as HTMLCanvasElement;
        const shininessElement = document.getElementById("shininess") as HTMLInputElement;
        let shininessCalc = Number(shininessElement.value);

        const kSElement = document.getElementById("kS") as HTMLInputElement;
        let kSCalc = Number(kSElement.value)

        const kDElement = document.getElementById("kD") as HTMLInputElement;
        let kDCalc = Number(kDElement.value)

        const kAElement = document.getElementById("kA") as HTMLInputElement;
        let kACalc = Number(kAElement.value)

        const gl = canvas.getContext("webgl2");
        const ctx = canvas2.getContext("2d");
        // //Texturen
        const textureGeist = new TextureBoxNode('geist.png');
        const textureHCILogo = new TextureBoxNode('hci-logo.png');
        const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
        const textureClose = new TextureBoxNode('Icons/close.png');
        const textureGeistText = new TextureBoxNode('Icons/geistText.png');
        const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
        const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
        const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
        sg.add(gnTr);

        //Camera
        const sgcamera = new Camera(new Vector(0, 0, 0, 1),
            new Vector(0, 0, 0, 1),
            new Vector(0, 0, -1, 1),
            new Vector(0, 1, 0, 0),
            60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
            kSCalc, kDCalc, kACalc)
        const nodeCamera = new CameraNode(sgcamera)
        sg.add(nodeCamera)


        //Taskbar
        const TaskBTr = new GroupNode(new Translation(new Vector(0, -.545, -1, 0)));
        const TaskBSc = new GroupNode(new Scaling(new Vector(1.2, 0.07, 0.0001, 0)))
        const TaskBBox = new AABoxNode(new Vector(0.7, 0, 0.7, 0));
        TaskBSc.add(TaskBBox)
        TaskBTr.add(TaskBSc);
        sg.add(TaskBTr);
        //Icons auf Taskbar
        // //Icon Kreis
        const TaskBIconSc = new GroupNode(new Scaling(new Vector(0.025, 0.025, 0.025,0)));
        const TaskBIconTr = new GroupNode(new Translation(new Vector(-0.1, -0.54, -1, 0)));

        const TaskBIconSphere = new SphereNode(new Vector(1, 0.7, 0.7, 1));
        TaskBIconSc.add(TaskBIconSphere);
        TaskBIconTr.add(TaskBIconSc);
        sg.add(TaskBIconTr);
        // //Icon Viereck
        const TaskBIconBoxTr = new GroupNode(new Translation(new Vector(0, -0.54, -1, 0)));
        const TaskBIconBoxSc = new GroupNode(new Scaling(new Vector(0.045, 0.045, 0.0001, 0)));

        const TaskBIconBox = new AABoxNode(new Vector(1, 0, 0.5, 0));
        TaskBIconBoxSc.add(TaskBIconBox);
        TaskBIconBoxTr.add(TaskBIconBoxSc)
        sg.add(TaskBIconBoxTr)
        //HeaderBoxen
        // Erster Header
        const headerBTr = new GroupNode(new Translation(new Vector(-0.3, 1.08, 0, 0)));
        const headerBSc = new GroupNode(new Scaling(new Vector(0.6, 0.07, 0.0001, 0)))

        const headerBBox = new AABoxNode(new Vector(1, 0.7, 0.7, 1));
        headerBSc.add(headerBBox)
        headerBTr.add(headerBSc)
        TaskBTr.add(headerBTr)
        //Icons für ersten Header
        const headerBIconBoxSc = new GroupNode(new Scaling(new Vector(0.07, 0.07, 0.0001, 0)));
        const headerBIconBoxTr = new GroupNode(new Translation(new Vector(0.15, 0.394, 0, 0)));
        const headerBIconBoxTr2 = new GroupNode(new Translation(new Vector(0.25, 0.394, 0, 0)));
        const headerBIconBoxSc2 = new GroupNode(new Scaling(new Vector(0.07, 0.07, 0.0001, 0)));
        //Header Icons (Vierecke, später Textur drauf)
        //erste Box
        // const headerBIconBox = new AABoxNode(new Vector(0, 0, 0, 0));
        // headerBIconBoxSc.add(headerBIconBox);
        headerBIconBoxSc.add(textureMinimize);
        headerBIconBoxTr.add(headerBIconBoxSc)
        headerBTr.add(headerBIconBoxTr)
        // //zweite Box
        // const headerBIconBox2 = new AABoxNode(new Vector(0, 0, 0, 0));
        // headerBIconBoxSc2.add(headerBIconBox2);
        headerBIconBoxSc2.add(textureClose);
        headerBIconBoxTr2.add(headerBIconBoxSc2)
        headerBTr.add(headerBIconBoxTr2)
        //Zweiter Header
        const headerBTr2 = new GroupNode(new Translation(new Vector(0.3, 1.08, 0, 0)));
        const headerBSc2 = new GroupNode(new Scaling(new Vector(0.55, 0.07, 0.0001, 0)))
        const headerBBox2 = new AABoxNode(new Vector(1, 0, 1, 0));

        headerBSc2.add(headerBBox2)
        // headerBarSc2.add(textureGeistText)
        headerBTr2.add(headerBSc2)
        TaskBTr.add(headerBTr2)
        //HeaderBox2 Icons
        const headerBIconBox2Tr = new GroupNode(new Translation(new Vector(0.55, 0.394, 0, 0)));
        const headerBIconBox2Tr2 = new GroupNode(new Translation(new Vector(0.65, 0.394, 0, 0)));

        headerBIconBox2Tr.add(headerBIconBoxSc)
        headerBTr2.add(headerBIconBox2Tr)
        headerBIconBox2Tr2.add(headerBIconBoxSc2)
        headerBTr2.add(headerBIconBox2Tr2)

        //HeaderBoxen für Namebeschriftung
        //Header1: Beschriftung
        const headerBTextTr = new GroupNode(new Translation(new Vector(-0.3, 0.394, 0, 0)));
        const headerBTextSc = new GroupNode(new Scaling(new Vector(0.16, 0.09, 0.0001, 0)))

        // headerBTextSc.add(headerBBox)
        headerBTextSc.add(textureKugelText)
        // headerBTextSc.add(textureMinimize)
        headerBTextTr.add(headerBTextSc)
        headerBTr.add(headerBTextTr)
        //Header 2: Beschriftung
        const headerBTextTr2 = new GroupNode(new Translation(new Vector(0.15, 0.394, 0, 0)));
        const headerBTextSc2 = new GroupNode(new Scaling(new Vector(0.16, 0.09, 0.0001, 0)))

        // headerBTextSc2.add(headerBBox)
        headerBTextSc2.add(textureGeistText)
        // headerBTextSc2.add(textureMinimize)
        headerBTextTr2.add(headerBTextSc2)
        headerBTr2.add(headerBTextTr2)

        //Zeichenflaeche 1
        // const cube = new AABoxNode(new Vector(0, 0, 0, 0));
        const cubeSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const cubeTr = new GroupNode(new Translation(new Vector(-0.2, 0.2, -1, 0)));
        const cubeRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
        const gn3 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const cubeTexture = new TexturePyramidNode('hci-logo.png');

        // cubeSc.add(cube);
        //TODO: Texture anzeigen geht nicht?
        // cubeSc.add(textureGeist)
        cubeSc.add(cubeTexture)
        cubeRt.add(cubeSc);
        cubeTr.add(cubeRt);
        sg.add(cubeTr);

        // const cube = new AABoxNode(new Vector(0, 0, 0, 0));
        const cube2Sc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const cube2Tr = new GroupNode(new Translation(new Vector(0.1, -0.3, -1, 0)));
        const cube2Rt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
        const gn32 = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const cubeTexture2 = new TextureBoxNode('hci-logo.png');

        // cubeSc.add(cube);
        //TODO: Texture anzeigen geht nicht?
        // cubeSc.add(textureGeist)
        cube2Sc.add(cubeTexture2)
        cube2Rt.add(cube2Sc);
        cube2Tr.add(cube2Rt);
        sg.add(cube2Tr);

        //Zeichenflaeche2
        //TODO: rausfinden wieso in raytracer sobald die sphere drin is der hintergrund schwarz wird
        const sphere = new SphereNode(new Vector(1, 0.7, 0.7, 1))
        const sphereSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const sphereTr = new GroupNode(new Translation(new Vector(-0.3, 0, -1, 0)));
        const sphereRt = new GroupNode(new Rotation(new Vector(0,0,1,0), 1));
        sphereSc.add(sphere);
        // sphereSc.add(textureHCILogo)
        sphereRt.add(sphereSc)
        sphereTr.add(sphereRt);
        sg.add(sphereTr);

        const pyramid = new PyramidNode(new Vector(1, 0, 1, 0))
        const pyramidSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const pyramidTr = new GroupNode(new Translation(new Vector(-0.2, -0.4, -1, 0)));

        pyramidSc.add(pyramid)
        pyramidTr.add(pyramidSc)
        sg.add(pyramidTr)

        let light1 = this.getLight(new Vector(0,0,-1,0));
        let light2 = this.getLight(new Vector(0,.2,1,0));
        let light3 = this.getLight(new Vector(0.2,.2,-3,0));
        sg.add(light1)
        sg.add(light2)
        sg.add(light3)


        const videoBox = new TextureVideoBoxNode("icgTestVideo.mp4");
        const videoSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const videoTr = new GroupNode(new Translation(new Vector(0.1, 0, -1, 0)));

        videoSc.add(videoBox);
        videoTr.add(videoSc)
        sg.add(videoTr)




        //kleiner driver geist
        const driverGhost = new TextureBoxNode("geist.png")
        const driverGhostSc = new GroupNode(new Scaling(new Vector(0.1, 0.1, 0.1, 1)))
        driverGhostSc.add(driverGhost);
        const driverGhostTr = new GroupNode(new Translation(new Vector(0.75, -0.4, -1, 0)))
        driverGhostTr.add(driverGhostSc)
        sg.add(driverGhostTr)

        const ghostCastle = new TextureBoxNode("ghost_castle.jpg")
        const ghostCastleSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 1)))
        const ghostCastleTr = new GroupNode(new Translation(new Vector(0.9, -0.4, -1, 0)))
        ghostCastleSc.add(ghostCastle)
        ghostCastleTr.add(ghostCastleSc)
        sg.add(ghostCastleTr)

        let animationNodes = [
            new RotationNode(sphereRt, new Vector(0, 0, 1, 0)),
            new RotationNode(light1, new Vector(0, 1, 0, 0)),
            new RotationNode(light2, new Vector(0, 1, 0, 0)),
            new RotationNode(light3, new Vector(0, 0, 1, 0)),
            // new RotationNode(kugelTr2, new Vector(0.2, 0.2, -1, 0)),
            // new RotationNode(lightTr2, new Vector(1, 1, 1, 0)),
        ]


        let driverNodes = [
            //new RotationNode(cubeSc, new Vector(0,0,1,0)),
            new DriverNode(driverGhostTr, new Vector(0.75,-0.8,0,0))
        ]

        let scalerNodes = [
            new ScalerNode(driverGhostSc, new Vector(0.1, 0.1, 0.1, 1))
        ]
        return {
            sg,
            animationNodes,
            driverNodes,
            scalerNodes,
            gl,
            ctx,
            kAElement,
            kSElement,
            kDElement,
            shininessElement,
            canvas,
            canvas2
        }
    }


    static getLight(vec: Vector) {
        let root = new GroupNode(new Translation(new Vector(0,0,0,0)));
        let lightBack = new GroupNode(new Translation(vec));
        root.add(lightBack)

        let light = new LightNode(new Vector(1,1,1,1));
        let yellowSphere = new SphereNode(new Vector(1, 1, 0, 1));
        let sphereScaling = new GroupNode(new Scaling(new Vector(.02,.02,.02,0)));
        sphereScaling.add(yellowSphere)
        lightBack.add(light);
        lightBack.add(sphereScaling)

        return root
    }

/*    static getTestScenegraph(): scenegraphObject {
        const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
        const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
        sg.add(gnTr);

        const pyramid = new SphereNode(new Vector(1, .4, 1, 0))
        const pyramidSc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
        const pyramidRt = new GroupNode(new Rotation(new Vector(0,0,1,0), 1));

        const pyramidTr = new GroupNode(new Translation(new Vector(-0.2, -0.4, -1, 0)));
        let light = new LightNode(new Vector(1,1,1,1));
        let lightGN = new GroupNode(new Translation(new Vector(.2,-2,-2,0)));
        sg.add(lightGN)
        lightGN.add(light)

        pyramidSc.add(pyramid)
        pyramidRt.add(pyramidSc)
        pyramidTr.add(pyramidRt)
        sg.add(pyramidTr)

        let animationNodes = [
            new RotationNode(pyramidRt, new Vector(0, 0, 1, 0)),
        ]

        return {
            sg,
            animationNodes: animationNodes,
            driverNodes: [],
            scalerNodes:[]
        }
    }*/
};

export type scenegraphObject={
    sg: Node,
    animationNodes: RotationNode[],
    driverNodes: DriverNode[],
    scalerNodes: ScalerNode[],
    gl: HTMLCanvasElement,
    ctx: HTMLCanvasElement,
    kAElement: HTMLInputElement,
    kSElement: HTMLInputElement,
    kDElement: HTMLInputElement,
    shininessElement: HTMLInputElement,
    canvas: HTMLCanvasElement,
    canvas2: HTMLCanvasElement
}