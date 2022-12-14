import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import Vector from './mathOperations/vector';
import {GroupNode} from './Nodes/nodes';
import {RasterVisitor,} from './Visitors/rastervisitor';
import Shader from './Shaders/shader';
import phongFragmentShader from './Shaders/phong-fragment-shader.glsl';
import phongVertexShaderPerspective from './Shaders/phong-vertex-perspective-shader.glsl';
import textureVertexShader from "./Shaders/texture-vertex-perspective-shader.glsl";
import textureFragmentShader from "./Shaders/texture-fragment-shader.glsl";
import Sphere from "./Geometry/RayGeometry/sphere";
import AABox from "./Geometry/RayGeometry/aabox";
import mouseClickVisitor from "./Visitors/mouse-click-visitor";
import Pyramid from "./Geometry/RayGeometry/pyramid";
import {LightVisitor} from "./Visitors/lightVisitor";
import {CameraVisitor} from "./Visitors/cameraVisitor";
import RayVisitorSupaFast from "./Visitors/rayvisitor-supa-fast";
import Scenegraph from "./scenegraph";
import {RasterSetupVisitor} from "./Visitors/rasterSetupVisitor";
import {JsonLoader} from "./Visitors/jsonLoader";
import {JsonVisitor} from "./Visitors/jsonVisitor";
import {AnimationVisitor} from "./Visitors/animationVisitor";

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));
const UNIT_PYRAMID = new Pyramid(new Vector(-0.5, -0.5, 0.5, 1), new Vector(0.5, -0.5, 0.5, 1), new Vector(0, -0.5, -0.5, 1), new Vector(0, 0.5, 0, 1), new Vector(0, 0, 0, 1))

window.addEventListener('load', function loadPage() {
    // Scenegraph.verySmallGraph()
    let {
        sg,
        gl,
        ctx,
        kDElement,
        kSElement,
        kAElement,
        shininessElement,
        canvas,
        canvas2
    } = Scenegraph.getScenegraph();

    const btn1 = document.getElementById('btnradio1') as HTMLInputElement;
    const btn2 = document.getElementById('btnradio2') as HTMLInputElement;

    const phongShader = new Shader(gl,
        phongVertexShaderPerspective,
        phongFragmentShader
    );
    const textureShader = new Shader(gl,
        textureVertexShader,
        textureFragmentShader
    );

    /**
     * LightPositions mit Visitor holen
     */
    const lightPositionsVisitor = new LightVisitor
    let lightPositions = lightPositionsVisitor.visit(sg)


    /**
     * Kamera und View Matrix mit Visitor holen
     */
    const cameraVisitor = new CameraVisitor
    let {camera, view} = cameraVisitor.visit(sg)

    /**
     * Visitor erstellen
     */
    let setupVisitor = new RasterSetupVisitor(gl, lightPositions)
    let rasterVisitor = new RasterVisitor(gl, phongShader, textureShader, setupVisitor.objects)
    let rayVisitor = new RayVisitorSupaFast(ctx, canvas.width, canvas.height)
    let animationVisitor = new AnimationVisitor();
    let visitor: RayVisitorSupaFast | RasterVisitor

    /**
     * AnimationNodes mit Visitor holen
     */
    let {animationNodeArray, minmaxNodeArray, driverNodeArray, scalerArray, rotationArray, cameraDriverNodes } = animationVisitor.visit(sg)
    let scalerNodes = scalerArray;
    let animationNodes= rotationArray
    let driverNodes = driverNodeArray
    let windowAnimationNodes = minmaxNodeArray


    let fileDownloader=document.getElementById("btnForJsonDownload") as HTMLInputElement;
    fileDownloader.addEventListener('click', ()=>{
        let jsonVisitor = new JsonVisitor()
        jsonVisitor.download(sg)
    })
    //https://stackoverflow.com/questions/16991341/json-parse-file-path
    let filePicker = document.getElementById("docpicker") as HTMLInputElement;
    filePicker.addEventListener('change', (e)=>{
        let target = e.target as HTMLInputElement;
        let file = target.files[0]
        file.text().then(text =>{
            let json:GroupNode = <GroupNode> JSON.parse(text)
            JsonLoader.deconstructFile(json)
        })
    })


    /**
     * Visitor aus localStorage holen und Buttons richtig checken
     */
    let renderer = localStorage.getItem("renderer")
    if (renderer == "rasterizer") {
        btn1.checked = true
    } else {
        btn2.checked = true
    }

    /**
     * Schauen, welcher Visitor benutzt wird, je nachdem welcher Button
     * gecheckt ist und dann Szene laden
     */
    function render() {
        if (btn1.checked) {
            btn1.checked = true
            btn2.checked = false
            visitor = rasterVisitor
            canvas2.style.display = "none"
            canvas.style.display = "block"
            loadScene()
        } else if (btn2.checked) {
            btn1.checked = false
            btn2.checked = true
            visitor = rayVisitor
            canvas2.style.display = "block"
            canvas.style.display = "none"
            loadScene()
        }
    }

    render()

    function loadScene() {

        if (btn1.checked) {
            setupVisitor.setup(sg);
        }

        let animationTime = 0;

        /**
         * ruft f??r alle Animationnodes die simulate Methode auf
         * @param deltaT die Zeit, um die die Animation vorangetrieben wird
         */
        function simulate(deltaT: number) {
            animationTime += deltaT;
            for (let animationNode of animationNodes) {
                animationNode.simulate(deltaT);
                lightPositions = lightPositionsVisitor.visit(sg);
            }

            for (let driverNode of driverNodes) {
                driverNode.simulate(deltaT);
            }

            for (let scalerNode of scalerNodes) {
                scalerNode.simulate(deltaT);
            }

            for (let cameraDriverNode of cameraDriverNodes){
                cameraDriverNode.simulate(deltaT);
            }

            for (let windowAnimationNode of windowAnimationNodes){
                windowAnimationNode.simulate(deltaT)
            }

        }

        let lastTimestamp = performance.now();
        let then = 0;

        /**
         * Ruft die simulate Methode auf
         * L??sst den Kamera Visitor nochmal ??ber den Szenengraph l??ufen
         * um eine eventuelle ??nderung der Kamera zu ber??cksichtigen
         * und l??sst dann den Visitor neu rendern
         * @param timestamp
         */
        function animate(timestamp: number) {
            simulate((timestamp - lastTimestamp));
            let {camera, view} = cameraVisitor.visit(sg)
            visitor.render(sg, camera, lightPositions, view);
            lastTimestamp = timestamp;
            window.requestAnimationFrame(animate);
        }

        Promise.all(
            [phongShader.load(), textureShader.load()]
        ).then(x =>
            window.requestAnimationFrame(animate)
        );

        /**
         * EventListener f??r die Animations
         */
        window.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    driverNodes[0].direction = "left"
                    driverNodes[0].active = true;
                    break;
                case "ArrowRight":
                    driverNodes[0].direction = "right"
                    driverNodes[0].active = true;
                    break;
                case "ArrowUp":
                    driverNodes[0].direction = "up"
                    driverNodes[0].active = true;
                    break;
                case "ArrowDown":
                    driverNodes[0].direction = "down"
                    driverNodes[0].active = true;
                    break;
                case "+":
                    scalerNodes[0].zoom = "in"
                    scalerNodes[0].active = true;
                    break;
                case "-":
                    scalerNodes[0].zoom = "out"
                    scalerNodes[0].active = true;
                    break;
                case "w":
                    cameraDriverNodes[0].direction = "down"
                    cameraDriverNodes[0].active = true;
                    break;
                case "a":
                    cameraDriverNodes[0].direction = "right"
                    cameraDriverNodes[0].active = true;
                    break;
                case "s":
                    cameraDriverNodes[0].direction = "up"
                    cameraDriverNodes[0].active = true;
                    break;
                case "d":
                    cameraDriverNodes[0].direction = "left"
                    cameraDriverNodes[0].active = true;
                    break;
                case "y":
                    cameraDriverNodes[0].direction = "in"
                    cameraDriverNodes[0].active = true;
                    break;
                case "x":
                    cameraDriverNodes[0].direction = "out"
                    cameraDriverNodes[0].active = true;
                    break;
                case "1":
                    for (let animationNode of animationNodes) {
                        animationNode.toggleActive();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    driverNodes[0].active = false;
                    break;
                case "ArrowRight":
                    driverNodes[0].active = false;
                    break;
                case "ArrowUp":
                    driverNodes[0].active = false;
                    break;
                case "ArrowDown":
                    driverNodes[0].active = false;
                    break;
                case "+":
                    scalerNodes[0].active = false;
                    break;
                case "-":
                    scalerNodes[0].active = false;
                    break;
                case "w":
                    cameraDriverNodes[0].active = false;
                    break;
                case "a":
                    cameraDriverNodes[0].active = false;
                    break;
                case "s":
                    cameraDriverNodes[0].active = false;
                    break;
                case "d":
                    cameraDriverNodes[0].active = false;
                    break;
                case "y":
                    cameraDriverNodes[0].active = false;
                    break;
                case "x":
                    cameraDriverNodes[0].active = false;
                    break;
            }
        });

        /**
         * gibt die Mausposition mit x und y Koordinaten zur??ck
         * @param canvas
         * @param evt
         */
        function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
            let rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        //ist object damit updates in mouseclickvisitor ??bernommen werden, funktioniert wie pointer auf datenspeicher
        let lastTexture = {zahl: 0};
        /**
         * EventListener f??r Mausklick f??r Mausklickvisitor
         */
        window.addEventListener('click', function (evt) {
            let mousePos = getMousePos(canvas, evt);
            let mouseVisitor = new mouseClickVisitor(ctx, canvas.width, canvas.height, mousePos, lastTexture)
            let {camera, view, inverseView} = cameraVisitor.visit(sg)
            mouseVisitor.render(sg, camera, lightPositions, inverseView);
            setupVisitor.setup(sg);
        }, false);

        function mouseClickedOn(event: { clientX: number; }) {
            let mx = event.clientX - canvas.getBoundingClientRect().left;
        }
    }

    /**
     * setzt "renderer" im localstorage auf den angeklickten visitor
     * und l??dt dann die Seite neu
     */
    btn1.addEventListener('click', function () {
        if (btn1.checked) {
            localStorage.setItem("renderer", "rasterizer")
        } else if (btn2.checked) {
            localStorage.setItem("renderer", "rayTracer")
        }
        location.reload()
    });
    btn2.addEventListener('click', function () {
        if (btn1.checked) {
            localStorage.setItem("renderer", "rasterizer")
        } else if (btn2.checked) {
            localStorage.setItem("renderer", "rayTracer")
        }
        location.reload()
    });
});
