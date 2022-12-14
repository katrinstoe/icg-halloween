import {
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
    TicTacToeTextureNode,
} from "./Nodes/nodes";
import {Rotation, Scaling, Translation} from "./mathOperations/transformation";
import Vector from "./mathOperations/vector";
import {DriverNode, MinMaxNode, RotationNode, ScalerNode} from "./Nodes/animation-nodes";
import Camera from "./Camera/camera";

export default class Scenegraph {
    static wuerfelArray: Array<TicTacToeTextureNode> = []

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

        /**
         * Texturen
         */
        const textureGeist = new TextureBoxNode('geist.png');
        const textureHCILogo = new TextureBoxNode('hci-logo.png');
        const textureMinimize = new TextureBoxNode('Icons/minusIcon.jpg');
        const textureClose = new TextureBoxNode('Icons/close.png');
        const textureGeistText = new TextureBoxNode('Icons/geistText.png');
        const textureKugelText = new TextureBoxNode('Icons/kugelText.png');
        const textureGeisterSchloss = new TextureBoxNode('ghost_castle.jpg');

        /**
         * Scenegraph Rootnode
         */
        const sg = new GroupNode(new Rotation(new Vector(0, 0, 1, 0), 0));
        const gnTr = new GroupNode(new Translation(new Vector(-0.75, -0.75, -3, 0)));

        sg.add(gnTr);

        /**
         * Kamera
         * Anh??ngen eines Drivers an den Kameraknoten
         */
        const sgcamera = new Camera(new Vector(0, 0, 0, 1),
            new Vector(0, 0, 0, 1),
            new Vector(0, 0, -1, 1),
            new Vector(0, 1, 0, 0),
            60, 0.1, 100, canvas.width, canvas.height, shininessCalc,
            kSCalc, kDCalc, kACalc)
        const nodeCamera = new CameraNode(sgcamera)
        const cameraTr = new GroupNode(new Translation(new Vector(0,0,0,0)))
        cameraTr.add(nodeCamera)
        let cameraAnimation = new DriverNode(cameraTr, new Vector(0, 0, 0, 0), "camera")
        sg.add(cameraAnimation)
        sg.add(cameraTr)

        shininessElement.onchange = function () {
            sgcamera.shininess = Number(shininessElement.value);
        }
        kSElement.onchange = function () {
            sgcamera.kS = Number(kSElement.value);
        }
        kDElement.onchange = function () {
            sgcamera.kD = Number(kDElement.value);
        }
        kAElement.onchange = function () {
            sgcamera.kD = Number(kDElement.value);
        }

        /**
         * Taskbar
         */
        const TaskBarBox = new AABoxNode(new Vector(0.3, 0.05, 0.1, 1));
        const TaskBarTr = new GroupNode(new Translation(new Vector(0, -0.55, -1, 0)));
        const TaskBarSc = new GroupNode(new Scaling(new Vector(1.2, 0.08, 0.0001, 0)))
        TaskBarSc.add(TaskBarBox)
        TaskBarTr.add(TaskBarSc);
        sg.add(TaskBarTr);


        /**
         * Lichter
         */
        let light1 = this.getLight(new Vector(0,0,-0.5,0));
        let light2 = this.getLight(new Vector(0,.2,-0.8,0));
        let light3 = this.getLight(new Vector(0.2,.2,-1,0));

        let lightAnimation1 = new RotationNode(light1, new Vector(0, 1, 0, 0))
        let lightAnimation2 = new RotationNode(light2, new Vector(0, 1, 0, 0))
        let lightAnimation3 = new RotationNode(light3, new Vector(0, 0, 1, 0))
        sg.add(lightAnimation1)
        sg.add(lightAnimation2)
        sg.add(lightAnimation3)
        // sg.add(light1)

        /**
         * Video Box
         */
        const videoBox = new TextureVideoBoxNode("moon.mp4");
        const videoBoxTr = new GroupNode(new Translation(new Vector(0, 0, -3, 0)));
        const videoBoxSc = new GroupNode(new Scaling(new Vector(3.7, 2.3, 2, 1)));
        videoBoxSc.add(videoBox);
        videoBoxTr.add(videoBoxSc);
        sg.add(videoBoxTr);

        /**
         * Driver
         */
        const driver = new TextureBoxNode("geist.png");
        const driver_Tr = new GroupNode(new Translation(new Vector(0.55, -0.48, -1, 0)))
        const driver_Sc = new GroupNode(new Scaling(new Vector(0.05, 0.05, 0.0001, 0)))
        driver_Sc.add(driver)
        driver_Tr.add(driver_Sc)
        let driverAnimation = new DriverNode(driver_Tr, new Vector(0.55, -0.48, -1, 0), "box")
        sg.add(driverAnimation);

        /**
         * Spooky Sphere
         */
        const sphere = new SphereNode(new Vector(0.3, 0.05, 0.1, 1));
        const sphere_Tr = new GroupNode(new Translation(new Vector(0, -0.1, 0, 0)))
        const sphere_Sc = new GroupNode(new Scaling(new Vector(0.7, 0.7, 0.7, 0)))
        let sphereAnimation = new ScalerNode(sphere_Sc, new Vector(0.7, 0.7, 0.7, 0))
        sphere_Sc.add(sphere);
        sphere_Tr.add(sphere_Sc);
        sphere_Tr.add(sphereAnimation)
        let window1 = this.getWindow(new Vector(-0.3, 0.5, -1, 0), sphere_Tr, "geist.png", 'Icons/sinisterSphere.png');

        sg.add(window1.root);
        const TBWindow1Tr = new GroupNode(new Translation(new Vector(-0.52,0,0,0)));
        TBWindow1Tr.add(window1.ButtonTBTr);
        TaskBarTr.add(TBWindow1Tr);

        /**
         * Buhuu Box
         */
        const buhuuBox = new TextureTextBoxNode("BuHuu, I'm a Box!");
        const buhuuAABoxTr = new GroupNode(new Translation(new Vector(0,0,0.6,1)));
        const buhuuAABoxRt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0), 1));
        let buhuuAnimation = new RotationNode(buhuuAABoxRt, new Vector(0,1,0,0));
        buhuuAABoxRt.add(buhuuBox);
        buhuuAABoxTr.add(buhuuAABoxRt);
        buhuuAABoxTr.add(buhuuAnimation)


        let window2 = this.getWindow(new Vector(-0.3, 0, -1, 0), buhuuAABoxTr, "many_ghosts.jpg", 'Icons/buhuBox.png');
        sg.add(window2.root);
        const TBWindow2Tr = new GroupNode(new Translation(new Vector(-0.44,0,0,0)));
        TBWindow2Tr.add(window2.ButtonTBTr);
        TaskBarTr.add(TBWindow2Tr);


        /**
         * Tic Tac Toe
         */
        let emptyTr = new GroupNode(new Translation(new Vector(0,0,0,0)))
        let tictactoeTr = new GroupNode(new Translation(new Vector(-0.4, 0.7, 0.5, 0)))
        let tictactoeCubeRow1Middle = this.getTicTacToeWuerfel(new Vector(0, 0, 0, 0))
        let tictactoeCubeRow1Right = this.getTicTacToeWuerfel(new Vector(0.7, 0, 0, 0))
        let tictactoeCubeRow1Left = this.getTicTacToeWuerfel(new Vector(-0.7, 0, 0, 0))

        let tictactoeCubeRow2Middle = this.getTicTacToeWuerfel(new Vector(0, -.7, 0, 0))
        let tictactoeCubeRow2Right = this.getTicTacToeWuerfel(new Vector(0.7, -.7, 0, 0))
        let tictactoeCubeRow2Left = this.getTicTacToeWuerfel(new Vector(-0.7, -.7, 0, 0))

        let tictactoeCubeRow3Middle = this.getTicTacToeWuerfel(new Vector(0, -1.4, 0, 0))
        let tictactoeCubeRow3Right = this.getTicTacToeWuerfel(new Vector(0.7, -1.4, 0, 0))
        let tictactoeCubeRow3Left = this.getTicTacToeWuerfel(new Vector(-0.7, -1.4, 0, 0))

        tictactoeTr.add(tictactoeCubeRow1Middle)
        tictactoeTr.add(tictactoeCubeRow1Right)
        tictactoeTr.add(tictactoeCubeRow1Left)
        tictactoeTr.add(tictactoeCubeRow2Middle)
        tictactoeTr.add(tictactoeCubeRow2Right)
        tictactoeTr.add(tictactoeCubeRow2Left)
        tictactoeTr.add(tictactoeCubeRow3Middle)
        tictactoeTr.add(tictactoeCubeRow3Right)
        tictactoeTr.add(tictactoeCubeRow3Left)

        //TODO: Eventuell nochmal leere Tranlation einf??gen, sollte animation probleme machen
        /**
         * Reset Tic Tac Toe
         */
        let resetTr = new GroupNode(new Translation(new Vector(0.8,-0.5,1,0)));
        let resetButton = new TicTacToeTextureNode('Icons/resetText.png');

        let resetSc = new GroupNode(new Scaling(new Vector(.56, .56, 0.001, 0)))
        resetSc.add(resetButton)
        emptyTr.add(resetTr)
        resetTr.add(resetSc)

        /**
         * explanation texture
         */
        let explTr = new GroupNode(new Translation(new Vector(-.93,-1,1,0)));
        let explTexture = new TextureBoxNode('Icons/memoryExplenationText.png');

        let explSc = new GroupNode(new Scaling(new Vector(1, 0.16, 0.001, 0)))
        explSc.add(explTexture)
        emptyTr.add(explTr)
        explTr.add(explSc)
        emptyTr.add(tictactoeTr)

        let window3 = this.getWindow(new Vector(0.3, 0, -1, 0),emptyTr , "Icons/Matthias.png", 'Icons/transylvaniaTicTacToe.png');

        sg.add(window3.root);
        const TBWindow3Tr = new GroupNode(new Translation(new Vector(-0.36,0,0,0)));
        TBWindow3Tr.add(window3.ButtonTBTr);
        TaskBarTr.add(TBWindow3Tr);

        /**
         * Posessed Pyramids
         */
        //Big Pyramid
        const pyramid = new PyramidNode(new Vector(0.3, 0.05, 0.1, 1));
        const pyramid_Tr = new GroupNode(new Translation(new Vector(-1,-0.3, 0.4, 0)))
        const pyramid_Sc = new GroupNode(new Scaling(new Vector(0.6, 0.6, 0.6, 0)))
        const pyramid_Rt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0),1))
        pyramid_Sc.add(pyramid)
        pyramid_Tr.add(pyramid_Sc)
        pyramid_Rt.add(pyramid_Tr)

        //Small Pyramid
        const texturePyramid = new TexturePyramidNode('ghost_castle.jpg')
        const texturePyramid_Tr = new GroupNode(new Translation(new Vector(-1.5,-1, 0.5, 0)))
        const texturePyramid_Sc = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)))
        const texturePyramid_Rt = new GroupNode(new Rotation(new Vector(0, 1, 0, 0),0.3))

        texturePyramid_Sc.add(texturePyramid);
        texturePyramid_Tr.add(texturePyramid_Sc);
        texturePyramid_Rt.add(texturePyramid_Tr)
        pyramid_Rt.add(texturePyramid_Rt);
        let pyramidAnimation = new RotationNode(texturePyramid_Rt, new Vector(1,0,0,0));
        pyramid_Rt.add(pyramidAnimation)

        let window4 = this.getWindow(new Vector(0.3, 0.5, -1, 0), pyramid_Rt, "ghost_castle.jpg", 'Icons/posessedPyramid.png');

        sg.add(window4.root);
        const TBWindow4Tr = new GroupNode(new Translation(new Vector(-0.28,0,0,0)));
        TBWindow4Tr.add(window4.ButtonTBTr);
        TaskBarTr.add( TBWindow4Tr);



        return {
            sg,
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

    static getTicTacToeWuerfel(pos: Vector){
        let root = new GroupNode(new Translation(new Vector(0,0,0,0)));
        let cubeBack = new GroupNode(new Translation(pos));
        root.add(cubeBack)

        let tictactoeCube = new TicTacToeTextureNode('Icons/emptyTicTacToe.png');
        Scenegraph.wuerfelArray.push(tictactoeCube)

        let tictactoeCubeSc = new GroupNode(new Scaling(new Vector(0.6, 0.6, 0.001, 0)))
        tictactoeCubeSc.add(tictactoeCube)
        cubeBack.add(tictactoeCubeSc)
        return root

    }

    static getLight(vec: Vector) {
        let root = new GroupNode(new Translation(new Vector(0,0,0,0)));
        let lightBack = new GroupNode(new Translation(vec));
        root.add(lightBack)

        let light = new LightNode(new Vector(1,1,1,1));
        let yellowSphere = new SphereNode(new Vector(1, 1, 0.7, 1));
        let sphereScaling = new GroupNode(new Scaling(new Vector(.02,.02,.02,0)));
        sphereScaling.add(yellowSphere)
        lightBack.add(light);
        lightBack.add(sphereScaling)

        return root
    }

    /**
     * Returnt eine Window
     * @param vec Position des Windows
     * @param inhalt des Windows
     * @param texturButtonTB Textur des Buttons auf der TaskBar
     * @param headerTextTB Textur des Headers
     */
    static getWindow(vec: Vector, inhalt: Node, texturButtonTB: string, headerTextTB: string){

        let root = new GroupNode(new Translation(new Vector(0,0,0,0)));

        //MinMax Node
        const MinmaxTr = new GroupNode(new Translation(new Vector(0, 0, 0, 0)))
        const minmax = new MinMaxNode(MinmaxTr, new Vector(1, 1, 1, 0), new Vector(0.00001, 0.00001, 0.00001, 0), 1000)

        //Inhalt
        const aabox_Tr = new GroupNode(new Translation(new Vector(0, -0.45, 0, 0)))
        const aabox_Sc = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.3, 0)))
        aabox_Sc.add(inhalt)
        aabox_Tr.add(aabox_Sc)

        //Background
        const windowBacktroundBox = new AABoxNode(new Vector(0.9, 0.9, 0.9, 1));
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

        //HeaderText
        const windowHeaderText = new TextureBoxNode(headerTextTB)
        const windowHeaderTextSc = new GroupNode(new Scaling(new Vector(0.5,0.12,0.0001,0)));
        const windowHeaderTextTr = new GroupNode(new Translation(new Vector(-0.3,0.07,0.01,0)));
        windowHeaderTextSc.add(windowHeaderText);
        windowHeaderTextTr.add(windowHeaderTextSc);


        //Window
        const windowPosition = new GroupNode(new Translation(vec));
        const windowSize = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 1)));

        //HB Button
        const ButtonHB = new TextureBoxButtonNode("Icons/minusIcon.jpg", () => {
            //callbackfunction, wir setten active auf true wenn wir auf den Button clicken ->
            minmax.active = true;
        })
        minmax.active = false;
        const ButtonHBTr = new GroupNode(new Translation(new Vector(0.5, 0.07, 0.01, 0)))
        const ButtonHBSc = new GroupNode(new Scaling(new Vector(0.12, 0.12, 0.0001, 1)))
        ButtonHBSc.add(ButtonHB);
        ButtonHBTr.add(ButtonHBSc);

        //TB Button
        const ButtonTB = new TextureBoxButtonNode(texturButtonTB, () => {
            minmax.active = true;
        })
        minmax.active = false;
        const ButtonTBTr = new GroupNode(new Translation(new Vector(0, 0.005, 0.0001, 0)));
        const ButtonTBSc = new GroupNode(new Scaling(new Vector(0.047, 0.047, 0.0001, 1)))
        ButtonTBSc.add(ButtonTB);
        ButtonTBTr.add(ButtonTBSc);

        //Wir adden alles an die MinmaxTr Node damit alles klein und gro?? wird
        MinmaxTr.add(windowHeaderTextTr);
        MinmaxTr.add(aabox_Tr);
        MinmaxTr.add(ButtonHBTr);
        MinmaxTr.add(windowHeaderBarTr);
        MinmaxTr.add(windowBacktroundBox_Tr);

        windowSize.add(minmax);
        windowPosition.add(windowSize);
        root.add(windowPosition);

        return {root, minmax, ButtonTBTr};
    }
};
