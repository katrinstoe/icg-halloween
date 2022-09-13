import {
    AABoxButtonNode,
    AABoxNode,
    GroupNode,
    LightNode, Node,
    PyramidNode,
    SphereNode, TextureBoxButtonNode,
    TextureBoxNode,
    TexturePyramidNode,
    TextureVideoBoxNode
} from "./nodes";
import {Rotation, Scaling, Translation} from "./transformation";
import Vector from "./vector";
import {AnimationNode, DriverNode, MinMaxNode, RotationNode, ScalerNode} from "./animation-nodes";
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

        //Texturen
        const textureGeist = new TextureBoxNode('geist.png');
        const textureHCILogo = new TextureBoxNode('hci-logo.png');
        const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
        const textureClose = new TextureBoxNode('Icons/close.png');
        const textureGeistText = new TextureBoxNode('Icons/geistText.png');
        const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
        const textureGeisterSchloss = new TextureBoxNode('ghost_castle.jpg');
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
        const TaskBarBox = new AABoxNode(new Vector(0.3, 0.05, 0.1, 1));
        const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.55, -1, 0)));
        const TaskBarSc = new GroupNode(new Scaling(new Vector(1.2, 0.08, 0.0001, 0)))
        TaskBarSc.add(TaskBarBox)
        TaskBarTr.add(TaskBarSc);
        sg.add(TaskBarTr);


        /*//HeaderBoxen für Namebeschriftung
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
        */


        let light1 = this.getLight(new Vector(0,0,-1,0));
        let light2 = this.getLight(new Vector(0,.2,1,0));
        let light3 = this.getLight(new Vector(0.2,.2,-3,0));
        sg.add(light1)
        sg.add(light2)
        sg.add(light3)


        //Video-Box kann nicht geadded werden, wieso?
        const videoBox = new TextureVideoBoxNode("icgTestVideo.mp4");
        const videoBoxTr = new GroupNode(new Translation(new Vector(0, 0, -3, 0)));
        const videoBoxSc = new GroupNode(new Scaling(new Vector(2, 2, 2, 1)));
        videoBoxSc.add(videoBox);
        videoBoxTr.add(videoBoxSc);
        sg.add(videoBoxTr);

        //Driver
        const driver = new TextureBoxNode("geist.png");
        const driver_Tr = new GroupNode(new Translation(new Vector(0.55, -0.48, -1, 0)))
        const driver_Sc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.0001, 0)))
        driver_Sc.add(driver)
        driver_Tr.add(driver_Sc)
        sg.add(driver_Tr);


        const aabox1 = new AABoxNode(new Vector(0, 0, 1, 1));
        sg.add(aabox1);

        const aabox2 = new AABoxNode(new Vector(1, 0, 1, 1));
        const aabox3 = new AABoxNode(new Vector(1, 1, 0, 1));
        const aabox4 = new AABoxNode(new Vector(1, 0, 0, 1));

        //Spooky Sphere
        const sphere = new SphereNode(new Vector(1, 0, 0, 1));
        const sphere_Tr = new GroupNode(new Translation(new Vector(0, -0.1, 0, 0)))
        const sphere_Sc = new GroupNode(new Scaling(new Vector(0.7, 0.7, 0.7, 0)))
        sphere_Sc.add(sphere);
        sphere_Tr.add(sphere_Sc);
        let window1 = this.getWindow(new Vector(-0.3, 0.5, -1, 0), sphere_Tr);

        sg.add(window1.root);
        const TBWindow1Tr = new GroupNode(new Translation(new Vector(-0.52,0,0,0)));
        TBWindow1Tr.add(window1.ButtonTBTr);
        TaskBarTr.add(TBWindow1Tr);

        //buhuu box
        const buhuuAABox = new AABoxNode(new Vector(1, 0, 1, 1));
        const buhuuAABoxTr = new GroupNode(new Translation(new Vector(0,0,0.6,1)));
        const buhuuAABoxRty = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
        const buhuuAABoxRtz = new GroupNode(new Rotation(new Vector(1, 0, 0, 0), 0.5));
        buhuuAABoxRtz.add(buhuuAABox);
        buhuuAABoxRtz.add(textureGeisterSchloss);
        buhuuAABoxRty.add(buhuuAABoxRtz);
        buhuuAABoxTr.add(buhuuAABoxRty);

        let window2 = this.getWindow(new Vector(-0.3, 0, -1, 0), buhuuAABoxTr);
        sg.add(window2.root);
        const TBWindow2Tr = new GroupNode(new Translation(new Vector(-0.44,0,0,0)));
        TBWindow2Tr.add(window2.ButtonTBTr);
        TaskBarTr.add(TBWindow2Tr);

        //Window3
        let window3 = this.getWindow(new Vector(0.3, 0, -1, 0), aabox3);

        sg.add(window3.root);
        const TBWindow3Tr = new GroupNode(new Translation(new Vector(-0.36,0,0,0)));
        TBWindow3Tr.add(window3.ButtonTBTr);
        TaskBarTr.add( TBWindow3Tr);

        //Window4
        let window4 = this.getWindow(new Vector(0.3, 0.5, -1, 0), aabox4);

        sg.add(window4.root);
        const TBWindow4Tr = new GroupNode(new Translation(new Vector(-0.28,0,0,0)));
        TBWindow4Tr.add(window4.ButtonTBTr);
        TaskBarTr.add( TBWindow4Tr);


        let animationNodes = [
            //new RotationNode(sphereRt, new Vector(0, 0, 1, 0)),
            new RotationNode(light1, new Vector(0, 1, 0, 0)),
            new RotationNode(light2, new Vector(0, 1, 0, 0)),
            new RotationNode(light3, new Vector(0, 0, 1, 0)),
            window1.minmax,
            window2.minmax,
            window3.minmax,
            window4.minmax,
            // new RotationNode(kugelTr2, new Vector(0.2, 0.2, -1, 0)),
            // new RotationNode(lightTr2, new Vector(1, 1, 1, 0)),
        ]


        let driverNodes = [
            //new RotationNode(cubeSc, new Vector(0,0,1,0)),
            new DriverNode(driver_Tr, new Vector(0.55, -0.48, -1, 0))
        ]

        let scalerNodes = [
            new ScalerNode(driver_Tr, new Vector(0.1, 0.1, 0.1, 1))
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
        let yellowSphere = new SphereNode(new Vector(1, 1, 0.5, 1));
        let sphereScaling = new GroupNode(new Scaling(new Vector(.02,.02,.02,0)));
        sphereScaling.add(yellowSphere)
        lightBack.add(light);
        lightBack.add(sphereScaling)

        return root
    }

    static getWindow(vec: Vector, inhalt: Node){

        let root = new GroupNode(new Translation(new Vector(0,0,0,0)));

        //MinMax Node
        const EmptyTranslation = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const MinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const minmax = new MinMaxNode(MinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.00001, 0), 80)

        //Inhalt
        const aabox_Tr = new GroupNode(new Translation(new Vector(0, -0.45, 0, 0)))
        const aabox_Sc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.3, 0)))
        aabox_Sc.add(inhalt)
        aabox_Tr.add(aabox_Sc)

        //Background
        const windowBacktroundBox = new AABoxNode(new Vector(0.8, 0.8, 0.8, 1));
        const windowBacktroundBox_Tr = new GroupNode(new Translation(new Vector(0, -0.5, 0, 0)));
        const windowBacktroundBox_Sc = new GroupNode(new Scaling(new Vector(1.2, 1, 0.0001, 0)));
        windowBacktroundBox_Sc.add(windowBacktroundBox);
        windowBacktroundBox_Tr.add(windowBacktroundBox_Sc);

        //Header
        const windowHeaderBar = new AABoxNode(new Vector(0.3, 0.05, 0.1, 1));
        const windowHeaderBarTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0, )));
        const windowHeaderBarSc = new GroupNode(new Scaling(new Vector(1.2, 0.3, 0.0001, 1)));
        windowHeaderBarSc.add(windowHeaderBar);
        windowHeaderBarTr.add(windowHeaderBarSc);

        //Window
        const windowPosition = new GroupNode(new Translation(vec));
        const windowSize = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        //HB Button
        const ButtonHB = new TextureBoxButtonNode("geist.png", () => {
            minmax.active = true;
        })
        minmax.active = false;
        const ButtonHBTr = new GroupNode(new Translation(new Vector(0, 0.07, 0.01, 0)))
        const ButtonHBSc = new GroupNode(new Scaling(new Vector(0.12, 0.12, 0.0001, 1)))
        ButtonHBSc.add(ButtonHB);
        ButtonHBTr.add(ButtonHBSc);

        //TB Button
        const ButtonTBTr = new GroupNode(new Translation(new Vector(0, 0.005, 0.0001, 0)));
        const ButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        ButtonTBSc.add(ButtonHB);
        ButtonTBTr.add(ButtonTBSc);


        MinmaxTr.add(aabox_Tr);
        MinmaxTr.add(ButtonHBTr);
        MinmaxTr.add(windowHeaderBarTr);
        MinmaxTr.add(windowBacktroundBox_Tr);

        windowSize.add(MinmaxTr);
        windowPosition.add(windowSize);
        root.add(windowPosition);


        return {root, minmax, ButtonTBTr};
    }

    static getTestScenegraph(): { animationNodes: MinMaxNode[]; canvas: HTMLCanvasElement; kSElement: HTMLInputElement; sg: GroupNode; scalerNodes: ScalerNode[]; kAElement: HTMLInputElement; gl: WebGL2RenderingContext; kDElement: HTMLInputElement; ctx: CanvasRenderingContext2D; driverNodes: DriverNode[]; shininessElement: HTMLInputElement; canvas2: HTMLCanvasElement } {

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


        //SG
        const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
        const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));
        sg.add(gnTr);

        //Licht
        const light1 = new LightNode(new Vector(1, 1, 0, 1))
        const lightTr = new GroupNode(new Translation(new Vector(-0.3, 0, -1, 0)));

        lightTr.add(light1)
        sg.add(lightTr)

        //TaskBar
        const greenTB = new AABoxNode(new Vector(0, 1, 1, 1));
        const greenTB_Tr = new GroupNode(new Translation(new Vector(0, -0.55, -1, 0)));
        const greenTB_Sc = new GroupNode(new Scaling(new Vector(1.2, 0.08, 0.0001, 1)))

        greenTB_Sc.add(greenTB);
        greenTB_Tr.add(greenTB_Sc);
        sg.add(greenTB_Tr);



        //Driver minMax
        const driverEmptyTranslation = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

        const driverMinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const driverMinmax = new MinMaxNode(driverMinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.00001, 0), 500)

        //Driver Header Bar
        const HBDriver = new AABoxNode(new Vector(0, 0.6, 0.6, 1));
        const HBDriverTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const HBDriverSc = new GroupNode(new Scaling(new Vector(1.2, 0.1, 0.0001, 1)));
        HBDriverSc.add(HBDriver);
        HBDriverTr.add(HBDriverSc);

        //Driver
        const driver = new TextureBoxNode("geist.png")
        const driver_Tr = new GroupNode(new Translation(new Vector(0, -0.5, 0, 0)))
        const driver_Sc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.0001, 0)))
        driver_Sc.add(driver)
        driver_Tr.add(driver_Sc)
        driverMinmaxTr.add(driver_Tr);

        //Ghost Castle
        const ghostCastle = new TextureBoxNode("ghost_castle.jpg")
        const ghostCastleSc = new GroupNode(new Scaling(new Vector(0.6, 0.6, 0.0001, 1)))
        const ghostCastleTr = new GroupNode(new Translation(new Vector(0.25, -0.55, -0.01, 0)))
        ghostCastleSc.add(ghostCastle)
        ghostCastleTr.add(ghostCastleSc)
        driverMinmaxTr.add(ghostCastleTr)

        //Driver Hintergrund
        const driverBackground = new AABoxNode(new Vector(1, 0, 1, 1));
        const driverBackground_Tr = new GroupNode(new Translation(new Vector(0.03, -0.45, -0.1, 0)))
        const driverBackground_Sc = new GroupNode(new Scaling(new Vector(1.248, 1, 0.0001, 0)))
        driverBackground_Sc.add(driverBackground)
        driverBackground_Tr.add(driverBackground_Sc)


        //Driver Button
        const driverButtonHB = new TextureBoxButtonNode("geist.png", () => {
            driverMinmax.active = true;
        })
        driverMinmax.active = false;
        const driverButtonHBTr = new GroupNode(new Translation(new Vector(0, 0, 1, 0)))
        const driverButtonHBSc = new GroupNode(new Scaling(new Vector(0.06, 0.06, 0.0001, 1)))
        driverButtonHBTr.add(driverButtonHB);
        driverButtonHBSc.add(driverButtonHBTr);

        //Driver zweiter blaue Button
        const driverButtonTBTr = new GroupNode(new Translation(new Vector(-0.29, -0.54, -0.99, 0)));
        const driverButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        driverButtonTBSc.add(driverButtonHB);
        driverButtonTBTr.add(driverButtonTBSc);
        sg.add(driverButtonTBTr);

        //Driver zum Scenegraph adden
        const driverFenster = new GroupNode(new Translation(new Vector(0.3, 0, -1, 0)));
        const driverFensterSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        driverMinmaxTr.add(driverButtonHBSc);
        driverMinmaxTr.add(HBDriverTr);
        driverMinmaxTr.add(driverBackground_Tr);

        driverFensterSc.add(driverMinmaxTr);
        driverFenster.add(driverFensterSc);
        driverEmptyTranslation.add(driverFenster);
        sg.add(driverEmptyTranslation);




        //Pyramid minMax
        const pyramidEmptyTranslation = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

        const pyramidMinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const pyramidMinmax = new MinMaxNode(pyramidMinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.00001, 0), 500)

        //Pyramid Header Bar
        const HBPyramid = new AABoxNode(new Vector(0.5, 0, 1, 1));
        const HBPyramidTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const HBPyramidSc = new GroupNode(new Scaling(new Vector(1.2, 0.1, 0.0001, 1)));
        HBPyramidSc.add(HBPyramid);
        HBPyramidTr.add(HBPyramidSc);

        //Pyramid
        const pyramid = new PyramidNode(new Vector(0, 0.6, 0.6, 1));
        const pyramid_Tr = new GroupNode(new Translation(new Vector(0, -0.45, 0, 0)))
        const pyramid_Sc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.2, 0)))
        pyramid_Sc.add(pyramid)
        pyramid_Tr.add(pyramid_Sc)
        pyramidMinmaxTr.add(pyramid_Tr);

        //Pyramid Hintergrund
        const pyramidBackground = new AABoxNode(new Vector(1, 0, 1, 1));
        const pyramidBackground_Tr = new GroupNode(new Translation(new Vector(0.03, -0.4, -0.1, 0)))
        const pyramidBackground_Sc = new GroupNode(new Scaling(new Vector(1.248, 1, 0.0001, 0)))
        pyramidBackground_Sc.add(pyramidBackground)
        pyramidBackground_Tr.add(pyramidBackground_Sc)

        //Pyramid Button
        const pyramidButtonHB = new AABoxButtonNode(new Vector(0, 0.6, 0.6, 1), () => {
            pyramidMinmax.active = true;
        })
        pyramidMinmax.active = false;
        const pyramidButtonHBTr = new GroupNode(new Translation(new Vector(0, 0, 1, 0)))
        const pyramidButtonHBSc = new GroupNode(new Scaling(new Vector(0.06, 0.06, 0.0001, 1)))
        pyramidButtonHBTr.add(pyramidButtonHB);
        pyramidButtonHBSc.add(pyramidButtonHBTr);

        //Pyramid zweiter blaue Button
        const pyramidButtonTBTr = new GroupNode(new Translation(new Vector(-0.37, -0.54, -0.99, 0)));
        const pyramidButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        pyramidButtonTBSc.add(pyramidButtonHB);
        pyramidButtonTBTr.add(pyramidButtonTBSc);
        sg.add(pyramidButtonTBTr);

        //Pyramid zum Scenegraph adden
        const pyramidFenster = new GroupNode(new Translation(new Vector(0.3, 0.5, -1, 0)));
        const pyramidFensterSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        pyramidMinmaxTr.add(pyramidButtonHBSc);
        pyramidMinmaxTr.add(HBPyramidTr);
        pyramidMinmaxTr.add(pyramidBackground_Tr);

        pyramidFensterSc.add(pyramidMinmaxTr);
        pyramidFenster.add(pyramidFensterSc);
        pyramidEmptyTranslation.add(pyramidFenster);
        sg.add(pyramidEmptyTranslation);




        //AABox minMax
        const AABoxEmptyTranslation = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

        const AABoxMinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const AABoxMinmax = new MinMaxNode(AABoxMinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.00001, 0), 500)

        //AABox Header Bar
        const HBAABox = new AABoxNode(new Vector(1, 1, 0, 1));
        const HBAABoxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));0
        const HBAABoxSc = new GroupNode(new Scaling(new Vector(1.2, 0.1, 0.0001, 1)));
        HBAABoxSc.add(HBAABox);
        HBAABoxTr.add(HBAABoxSc);

        //AABox
        const aabox = new AABoxNode(new Vector(0, 0, 1, 1));
        const aabox_Tr = new GroupNode(new Translation(new Vector(0, -0.45, 0, 0)))
        const aabox_Sc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.3, 0)))
        aabox_Sc.add(aabox)
        aabox_Tr.add(aabox_Sc)
        AABoxMinmaxTr.add(aabox_Tr);

        //AAbox Hintergrund
        const AABoxBackground = new AABoxNode(new Vector(1, 0, 1, 1));
        const AABoxBackground_Tr = new GroupNode(new Translation(new Vector(-0.031, -0.45, -0.1, 0)))
        const AABoxBackground_Sc = new GroupNode(new Scaling(new Vector(1.248, 1, 0.0001, 0)))
        AABoxBackground_Sc.add(AABoxBackground)
        AABoxBackground_Tr.add(AABoxBackground_Sc)

        //AABox Button
        const aaboxButtonHB = new AABoxButtonNode(new Vector(0, 0, 1, 0), () => {
            AABoxMinmax.active = true;
        })
        AABoxMinmax.active = false;
        const aaboxButtonHBTr = new GroupNode(new Translation(new Vector(0, 0, 1, 0)))
        const aaboxButtonHBSc = new GroupNode(new Scaling(new Vector(0.06, 0.06, 0.0001, 1)))
        aaboxButtonHBTr.add(aaboxButtonHB);
        aaboxButtonHBSc.add(aaboxButtonHBTr);

        //AABox zweiter blaue Button
        const aaboxButtonTBTr = new GroupNode(new Translation(new Vector(-0.45, -0.54, -0.99, 0)));
        const aaboxButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        aaboxButtonTBSc.add(aaboxButtonHB);
        aaboxButtonTBTr.add(aaboxButtonTBSc);
        sg.add(aaboxButtonTBTr);

        //AABox zum Scenegraph adden
        const AABoxFenster = new GroupNode(new Translation(new Vector(-0.3, 0, -1, 0)));
        const AABoxFensterSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        AABoxMinmaxTr.add(aaboxButtonHBSc);
        AABoxMinmaxTr.add(HBAABoxTr);
        AABoxMinmaxTr.add(AABoxBackground_Tr);

        AABoxFensterSc.add(AABoxMinmaxTr);
        AABoxFenster.add(AABoxFensterSc);
        AABoxEmptyTranslation.add(AABoxFenster);
        sg.add(AABoxEmptyTranslation);


        //Sphere minMax
        const SphereEmptyTranslation = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));

        const SphereMinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const SphereMinmax = new MinMaxNode(SphereMinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.000001, 0), 500)

        //Sphere
        const sphere = new SphereNode(new Vector(1, 1, 0, 1));
        const sphere_Tr = new GroupNode(new Translation(new Vector(0, -0.45, 0, 0)))
        const sphere_Sc = new GroupNode(new Scaling(new Vector(0.3, 0.3, 0.1, 0)))
        sphere_Sc.add(sphere)
        sphere_Tr.add(sphere_Sc)
        SphereMinmaxTr.add(sphere_Tr);

        //Sphere Header Bar
        const HBSphere = new AABoxNode(new Vector(1, 0, 0, 1));
        const HBSphere_Tr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
        const HBSphereSc = new GroupNode(new Scaling(new Vector(1.2, 0.1, 0.0001, 1)));
        HBSphereSc.add(HBSphere);
        HBSphere_Tr.add(HBSphereSc);

        //Sphere Hintergrund
        const SphereBackground = new AABoxNode(new Vector(1, 0, 1, 1));
        const SphereBackground_Tr = new GroupNode(new Translation(new Vector(-0.031, -0.4, -0.1, 0)))
        const SphereBackground_Sc = new GroupNode(new Scaling(new Vector(1.248, 1, 0.0001, 0)))
        SphereBackground_Sc.add(SphereBackground)
        SphereBackground_Tr.add(SphereBackground_Sc)

        //Sphere HB Button
        const sphereButtonHB = new AABoxButtonNode(new Vector(1, 1, 0, 1), () => {
            SphereMinmax.active = true;
        })
        const sphereButtonHBTr = new GroupNode(new Translation(new Vector(0, 0, 1, 0)))
        const sphereButtonHBSc = new GroupNode(new Scaling(new Vector(0.06, 0.06, 0.0001, 1)))
        sphereButtonHBTr.add(sphereButtonHB);
        sphereButtonHBSc.add(sphereButtonHBTr);
        SphereMinmax.active = false;

        //Sphere TB Button
        const sphereButtonTBTr = new GroupNode(new Translation(new Vector(-0.53, -0.54, -0.99, 0)));
        const sphereButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        sphereButtonTBSc.add(sphereButtonHB);
        sphereButtonTBTr.add(sphereButtonTBSc);
        sg.add(sphereButtonTBTr);

        //Sphere zum sg adden
        const SphereFenster = new GroupNode(new Translation(new Vector(-0.3, 0.5, -1, 0)));
        const SphereFensterSc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        SphereMinmaxTr.add(sphereButtonHBSc);
        SphereMinmaxTr.add(HBSphere_Tr);
        SphereMinmaxTr.add(SphereBackground_Tr);

        SphereFensterSc.add(SphereMinmaxTr);
        SphereFenster.add(SphereFensterSc);
        SphereEmptyTranslation.add(SphereFenster);
        sg.add(SphereEmptyTranslation);




        //Video-Box kann nicht geadded werden, wieso?
        const videoBox = new TextureVideoBoxNode("icgTestVideo.mp4");
        const videoBoxTr = new GroupNode(new Translation(new Vector(0, 0, -3, 0)));
        const videoBoxSc = new GroupNode(new Scaling(new Vector(2, 2, 2, 1)));
        videoBoxSc.add(videoBox);
        videoBoxTr.add(videoBoxSc);
        sg.add(videoBoxTr);


        /*let light1 = this.getLight(new Vector(0,0,-1,0));
        let light2 = this.getLight(new Vector(0,.2,1,0));
        let light3 = this.getLight(new Vector(0.2,.2,-3,0));
        sg.add(light1)
        sg.add(light2)
        sg.add(light3)*/




        let animationNodes = [
            SphereMinmax,
            AABoxMinmax,
            pyramidMinmax,
            driverMinmax,
            //new RotationNode(sphereRt, new Vector(0, 0, 1, 0)),
            //new DriverNode(lightTr, new Vector(1, 0, 0, 0)),
            // new TranslatorNode(lightTr, new Vector(1, 0, 0, 0), "left")
            //new RotationNode(lightTr, new Vector(1, 1, 1, 0)),
        ]

        /*let minMaxNodes = [
            SphereMinmax,
            AABoxMinmax,
            pyramidMinmax,
            driverMinmax,
        ]*/

        let driverNodes = [
            //new RotationNode(cubeSc, new Vector(0,0,1,0)),
            //new DriverNode(driverGhostTr, new Vector(0.75, -0.8, 0, 0))
            new DriverNode(driver_Tr, new Vector(0, -0.5, 0, 0))
        ]

        let scalerNodes = [
            new ScalerNode(aabox_Sc, new Vector(0.1, 0.1, 0.001, 1))
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
};

export type scenegraphObject={
    sg: Node,
    animationNodes: AnimationNode[],
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

export type windoOwbject={
    root: Node,
    minmax: AnimationNode[],
    ButtonTBTr: Node
}