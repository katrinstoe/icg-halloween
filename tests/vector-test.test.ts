import { Stream } from 'stream';
import Vector from '../src/vector';

const firstArray = [[0,0,0,0],[-1.820176185627116,-4.562271752753113,-3.22828359494852,-1.6494857095082214],[-4.542538498313034,4.92997454218267,-0.41096433671328114,3.3895107820829455],[1.0201761961249556,1.093953827877109,-3.153236112375235,0.8244527590217192],[-3.9999755656637093,1.523493406419548,-1.4897514748998364,0.6844666423962078],[-2.8794841353908507,0.8948965414901764,-4.9618727239735385,2.86548466230962],[3.615284997332937,-0.7093151847607295,-0.6817449322192362,2.992345097619906],[0.14917316065137687,-3.653698954689056,-4.038961493901424,-3.9665834789050525],[1.247278117565596,-4.306244523696656,-4.058536997413431,-1.8916000249209084],[4.086720820209788,-0.09564984906022556,1.9301592091487514,1.645411144544516],[-2.3442067262926294,3.4540955682939476,-0.40184454553448035,-2.6758996955279137]];
const secondArray = [[0,0,0,0],[0.9728236508339609,4.77494813659775,2.592382254466836,-0.37331025676703256],[0.12437379722366604,4.002936858688917,4.467080227760977,-4.4336054405693],[-3.0861640934846,-0.4526818271816291,-3.2698780510970806,2.460576985816008],[0.9946858886829046,3.02599357334865,-2.9424120510401233,2.7760164950234927],[-2.6812486263071245,-2.903484169505659,-1.603501927493526,-4.547697180049016],[4.59955228834575,-3.330947452508899,0.6418103720785542,1.367703367279944],[-0.12640653732375196,2.4534719585148457,2.068127198096544,-0.7844652247104813],[-1.909511507400917,1.340160656408611,-3.241046352424788,2.8730086909033767],[3.1299754061085174,-2.647036546921276,-2.781293624483263,1.852983400167595],[-1.2388819524589048,2.443463055428909,3.6335678155728335,4.999515757084197]];

const addArray = [[0,0,0,0],[-0.847352534793155,0.21267638384463705,-0.6359013404816842,-2.022795966275254],[-4.418164701089368,8.932911400871587,4.056115891047696,-1.0440946584863546],[-2.0659878973596446,0.64127200069548,-6.423114163472316,3.2850297448377273],[-3.0052896769808046,4.549486979768198,-4.432163525939959,3.4604831374197005],[-5.560732761697976,-2.0085876280154826,-6.565374651467065,-1.682212517739396],[8.214837285678687,-4.040262637269628,-0.039934560140681974,4.36004846489985],[0.022766623327624913,-1.2002269961742105,-1.9708342958048801,-4.751048703615534],[-0.662233389835321,-2.966083867288045,-7.299583349838219,0.9814086659824683],[7.216696226318305,-2.7426863959815018,-0.8511344153345117,3.498394544712111],[-3.583088678751534,5.8975586237228566,3.231723270038353,2.323616061556283]];
const subArray = [[0,0,0,0],[-2.792999836461077,-9.337219889350862,-5.820665849415356,-1.2761754527411888],[-4.6669122955367,0.9270376834937526,-4.8780445644742585,7.823116222652246],[4.106340289609555,1.5466356550587381,0.11664193872184558,-1.6361242267942888],[-4.994661454346614,-1.502500166929102,1.4526605761402869,-2.091549852627285],[-0.19823550908372622,3.7983807109958354,-3.3583707964800125,7.413181842358636],[-0.984267291012813,2.6216322677481694,-1.3235553042977903,1.6246417303399623],[0.2755796979751288,-6.107170913203902,-6.107088691997968,-3.182118254194571],[3.156789624966513,-5.646405180105267,-0.8174906449886432,-4.764608715824285],[0.9567454141012703,2.5513866978610507,4.7114528336320145,-0.20757225562307902]];
const crossArray = [ [0,0,0,0],[3.587734404216045,1.5780418108576653,-4.25296102322986,0],[23.667656091785418,20.24077071457666,-18.79665444093791,0],[-5.0045082955741105,13.067255820252125,2.9143057990153176,0],[0.02523303020453138,-13.251411078002343,-13.619297748116988,0],[-15.84168723434588,8.686756063778581,10.759976726007556,0],[-2.7261023878887687,-5.456048872365373,-8.779792070735187,0],[2.3531645849590257,0.20204206605890962,-0.09585926666447236,0],[19.39582971268848,11.792309293168543,-6.551270410920141,0],[5.375232283367404,17.407721416801955,-10.518317693002905,0] ];
const dotArray = [0,-31.308496616704716,2.305839938073092,8.695682875359534,6.914915389007781,0.04731089953774159,22.646473487677483,-14.224543710374233,-0.4334281856171174,10.725104339706856];
const normalizeArray = [[0,0,0,0],[-0.298149325244244,-0.7473113072268683,-0.5288007738653849,-0.270189806444731],[-0.6038123444835578,0.6553118895227991,-0.05462701961516242,0.4505472992120725],[0.28448067087245726,0.30505389171014774,-0.8792939181242113,0.22990231969735106],[-0.8726856696906239,0.33238474631279064,-0.3250231763177877,0.14933196975699886],[-0.44471949968633673,0.138211541890827,-0.7663322496525133,0.44255736286882924],[0.7539649394773834,-0.14792714287892753,-0.1421773876579261,0.6240512966714441],[0.02213466941177814,-0.5421445663486728,-0.5993107409136633,-0.5885711183996006],[0.1968449229275166,-0.6796097513749005,-0.6405166507800183,-0.2985315431028254],[0.8494974151670053,-0.019882517821123075,0.4012178299344864,0.3420278936758388]];
const lengthArray = [0,6.104914656895592,7.523096438510674,3.5861002190280145,4.583523832907376,6.474832197422797,4.795030654660016,6.73934441379097,6.336348934053413,4.810751330427965];

describe('Creating basic vectors ', () => {

    for (let i = 0; i < 5; i++){
        let x: number = Math.random();
        let y: number = Math.random();
        let z: number = Math.random();
        let w: number = Math.random();

        let vector: Vector = new Vector(x, y, z, w);
        it('should work',() =>{
            expect(vector.x).toBe(x);
            expect(vector.y).toBe(y);
            expect(vector.z).toBe(z);
            expect(vector.w).toBe(w);            
        });
    }
    
});

describe('Creating basic vectors wich color ', () => {

    for (let i = 0; i < 5; i++){
        let x: number = Math.random();
        let y: number = Math.random();
        let z: number = Math.random();
        let w: number = Math.random();

        let vector: Vector = new Vector(x, y, z, w);
        it('should work',() =>{
            expect(vector.x).toBe(x);
            expect(vector.y).toBe(y);
            expect(vector.z).toBe(z);
            expect(vector.w).toBe(w);
            expect(vector.r).toBe(x);
            expect(vector.g).toBe(y);
            expect(vector.b).toBe(z);
            expect(vector.a).toBe(w);
        });
    }
    
});

describe('Testing vector-addition ', () => {
    for (let i1 = 0; i1 < firstArray.length && i1 < secondArray.length; i1++){

        let vector1: Vector = new Vector(firstArray[i1][0],firstArray[i1][1],firstArray[i1][2],firstArray[i1][3] );
        let vector2: Vector = new Vector(secondArray[i1][0],secondArray[i1][1],secondArray[i1][2],secondArray[i1][3]);
        let resultVector: Vector = new Vector(addArray[i1][0],addArray[i1][1],addArray[i1][2],addArray[i1][3]);
        it('(' + vector1.data +') + (' +  vector2.data + ") should be (" + resultVector.data + "), was: (" + vector1.add(vector2).data + ")",() =>{
            expect(vector1.add(vector2)).toStrictEqual(resultVector);
        
        });
    }
    
});


describe('Testing vector-substraction ', () => {

    for (let i = 0; i < firstArray.length && i < secondArray.length && i < subArray.length; i++){

        let vector1: Vector = new Vector(firstArray[i][0],firstArray[i][1],firstArray[i][2],firstArray[i][3] );
        let vector2: Vector = new Vector(secondArray[i][0],secondArray[i][1],secondArray[i][2],secondArray[i][3]);
        let resultVector: Vector = new Vector(subArray[i][0],subArray[i][1],subArray[i][2],subArray[i][3]);
        it('(' + vector1.data +') + (' +  vector2.data + ") should be (" + resultVector.data + "), was: (" + vector1.sub(vector2).data + ")",() =>{
            expect(vector1.sub(vector2)).toStrictEqual(resultVector);
        });
    }
    
});

describe('Testing vector-crossprodukt', () => {

    for (let i = 0; i < firstArray.length && i < crossArray.length; i++){

        let vector1: Vector = new Vector(firstArray[i][0],firstArray[i][1],firstArray[i][2],firstArray[i][3] );
        let vector2: Vector = new Vector(secondArray[i][0],secondArray[i][1],secondArray[i][2],secondArray[i][3]);
        let resultVector: Vector = new Vector(crossArray[i][0],crossArray[i][1],crossArray[i][2],crossArray[i][3]);
        it('(' + vector1.data +') + (' +  vector2.data + ") should be (" + resultVector.data + "), was: (" + vector1.cross(vector2).data + ")",() =>{
            expect(vector1.cross(vector2)).toStrictEqual(resultVector);
        });
    }
    
});

describe('Testing vector-dotproduct ', () => {

    for (let i = 0; i < firstArray.length && i < dotArray.length; i++){

        let vector1: Vector = new Vector(firstArray[i][0],firstArray[i][1],firstArray[i][2],firstArray[i][3] );
        let vector2: Vector = new Vector(secondArray[i][0],secondArray[i][1],secondArray[i][2],secondArray[i][3]);
        let result: number = dotArray[i];
        it('(' + vector1.data +') + (' +  vector2.data + ") should be (" + result + "), was: (" + vector1.dot(vector2) + ")",() =>{
            expect(vector1.dot(vector2)).toStrictEqual(result);
        });
    }
    
});

describe('Testing vector-normalization ', () => {

    for (let i = 1; i < firstArray.length && i < normalizeArray.length; i++){

        let vector1: Vector = new Vector(firstArray[i][0],firstArray[i][1],firstArray[i][2],firstArray[i][3] );
        let resultVector: Vector = new Vector(normalizeArray[i][0],normalizeArray[i][1],normalizeArray[i][2],normalizeArray[i][3]);
        it('(' + vector1.data +') should be (' + resultVector.data + "), was: (" + vector1.normalize().data + ")",() =>{
            expect(vector1.normalize().x).toBeCloseTo(resultVector.x, 5);
            expect(vector1.normalize().y).toBeCloseTo(resultVector.y, 5);
            expect(vector1.normalize().z).toBeCloseTo(resultVector.z, 5);
            expect(vector1.normalize().w).toBeCloseTo(resultVector.w, 5);
        });
    }
    
});

describe('Testing vector-length ', () => {

    for (let i = 1; i < firstArray.length && i < lengthArray.length; i++){

        let vector1: Vector = new Vector(firstArray[i][0],firstArray[i][1],firstArray[i][2],firstArray[i][3] );
        let result: number = lengthArray[i] ;
        it('(' + vector1.data +') should be (' + result + "), was: (" + vector1.length + ")",() =>{
            expect(vector1.length).toBeCloseTo(result, 5);
        });
    }
    
});