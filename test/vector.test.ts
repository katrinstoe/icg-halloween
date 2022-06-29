import Vector from "../src/vector";

let vector: Vector

beforeEach(()=>{
    vector = new Vector(1,2,3,0)
})

test('constructor puts variables in data', () =>{

    expect(vector.data).toEqual([1,2,3,0])

})

test('XYZW getters return right Value', ()=>{
    expect(vector.x).toBe(1)
    expect(vector.y).toBe(2)
    expect(vector.z).toBe(3)
    expect(vector.w).toBe(0)
})

test("RGBA getters return right Values", ()=>{
    expect(vector.r).toBe(1)
    expect(vector.g).toBe(2)
    expect(vector.b).toBe(3)
    expect(vector.a).toBe(0)
})

test("add adds two Vectors", ()=>{
    const added = vector.add(vector)
    expect(added.data).toEqual([2,4,6,0])
})



describe("sub subtracts two vectors", ()=>{
    test("vector minus itself is 0 on all fields", ()=>{
        const allZero = vector.sub(vector);
        expect(allZero.data).toEqual([0,0,0,0])

    })

    test("vector minus other vector is has correct fields", () => {
        let other = new Vector(1,1,1,0);
        let subtracted = vector.sub(other);
        expect(subtracted.data).toEqual([0,1,2,0])
    });
})

describe("mul multiplies all vector fields with given number", ()=>{
    test("vector times 0 is 0 on all fields", ()=>{
        let allZero = vector.mul(0);
        expect(allZero.data).toEqual([0,0,0,0])
    });

    test("vector times 1 is same values", () =>{
        let same = vector.mul(1);
        expect(same.data).toEqual([1,2,3,0])
    })

    test("vector times 2 is double value on all fields", ()=>{
        let timesTwo = vector.mul(2);
        expect(timesTwo.data).toEqual([2,4,6,0])
    })
})

describe(".dot multiplies all vector fields with the correstponding fields of other vecotr and sums them up", ()=>{
    test("dot of baseVector and other vector with 2,2,2,9 should be 12", ()=>{
        let other = new Vector(2,2,2,0);
        let dotProduct = vector.dot(other);
        expect(dotProduct).toBe(12)
    })

    test("dot product should be 0 if other is all 0,0,0,0", ()=>{
        let other = new Vector(0,0,0,0);
        let allZero = vector.dot(other);
        expect(allZero).toBe(0)

    })
})

describe(".cross should calculate cross procuts", ()=>{

    test("cross of 2,3,4,0 and 5,6,7,0 is -3,6,-3,0", () => {
            let vec1 = new Vector(2,3,4,0);
            let ve2 = new Vector(5,6,7,0);
            let crossProduct = vec1.cross(ve2);
            expect(crossProduct.data).toEqual([-3,6,-3,0])
    });

    test("cross of anything and 0,0,0,0 should be 0,0,0,0", ()=>{
        let other = new Vector(0,0,0,0);
        let allZero = vector.cross(other);
        expect(allZero.data).toEqual([0,0,0,0])
    })
})

describe("Normalizing works", () =>{
    test("Normalizing the baseVector returnes [0.26, 0.53, 0.80, 0]", ()=>{
        expect(vector.normalize().x).toBeCloseTo(0.26726, 5)
        expect(vector.normalize().y).toBeCloseTo(0.53452)
        expect(vector.normalize().z).toBeCloseTo(0.80178)
        expect(vector.normalize().w).toBe(0)
    })

    test("length of normalized vector equals 1", ()=>{
        expect(vector.normalize().length).toBe(1)
    })
})

describe("equals() returns true if vectors are equal", () =>{
    test("same vector returns true", () =>{
        expect(vector.equals(vector)).toBeTruthy()
    })

})