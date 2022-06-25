/**
 * Class representing a vector in 4D space
 */
export default class Vector {
  /**
   * The variable to hold the vector data
   */
  data: [number, number, number, number];
  /**
   * Create a vector
   * @param x The x component
   * @param y The y component
   * @param z The z component
   * @param w The w component
   */
  constructor(x: number, y: number, z: number, w: number) {
    // TODO
    this.data = [x,y,z,w]
  }

  /**
   * Returns the x component of the vector
   * @return The x component of the vector
   */

  get x(): number {
    // TODO
    return this.data[0];
  }

  /**
   * Sets the x component of the vector to val
   * @param val - The new value
   */
  set x(val: number) {
    // TODO
    this.data[0] = val;
  }

  /**
   * Returns the first component of the vector
   * @return The first component of the vector
   */
  get r(): number {
    // TODO
    return this.data[0];
  }

  /**
   * Sets the first component of the vector to val
   * @param val The new value
   */
  set r(val: number) {
    // TODO
    this.data[0] = val;
  }

  /**
   * Returns the y component of the vector
   * @return The y component of the vector
   */
  get y(): number {
    // TODO
    return this.data[1]
  }

  /**
   * Sets the y component of the vector to val
   * @param val The new value
   */
  set y(val: number) {
    // TODO
    this.data[1]= val
  }

  /**
   * Returns the second component of the vector
   * @return The second component of the vector
   */
  get g(): number {
    // TODO
    return this.data[1];
  }

  /**
   * Sets the second component of the vector to val
   * @param val The new value
   */
  set g(val: number) {
    // TODO
    this.data[1] = val;
  }

  /**
   * Returns the z component of the vector
   * @return The z component of the vector
   */
  get z(): number {
    // TODO
    return this.data[2]
  }

  /**
   * Sets the z component of the vector to val
   * @param val The new value
   */
  set z(val: number) {
    // TODO
    this.data[2] = val
  }

  /**
   * Returns the third component of the vector
   * @return The third component of the vector
   */
  get b(): number {
    // TODO
    return this.data[2];
  }

  /**
   * Sets the third component of the vector to val
   * @param val The new value
   */
  set b(val: number) {
    // TODO
    this.data[2] = val;
  }

  /**
   * Returns the w component of the vector
   * @return The w component of the vector
   */
  get w(): number {
    // TODO
    return this.data[3]
  }

  /**
   * Sets the w component of the vector to val
   * @param val The new value
   */
  set w(val: number) {
    // TODO
    this.data[3] = val
  }

  /**
   * Returns the fourth component of the vector
   * @return The fourth component of the vector
   */
  get a(): number {
    // TODO
    return this.data[3]
  }

  /**
   * Sets the fourth component of the vector to val
   * @param val The new value
   */
  set a(val: number) {
    // TODO
    this.data[3] = val;
  }

  /**
   * Creates a new vector with the vector added
   * @param other The vector to add
   * @return The new vector;
   */
  add(other: Vector): Vector {
    // TODO
    return new Vector(other.x + this.data[0], other.y + this.data[1], other.z + this.data[2], other.w + this.data[3]);
  }

  /**
   * Creates a new vector with the vector subtracted
   * @param other The vector to subtract
   * @return The new vector
   */
  sub(other: Vector): Vector {
    // TODO
    return new Vector(this.data[0]-other.x, this.data[1]-other.y, this.data[2]-other.z, this.data[3]-other.w);
  }

  /**
   * Creates a new vector with the scalar multiplied
   * @param other The scalar to multiply
   * @return The new vector
   */
  mul(other: number): Vector {
    // TODO
    return new Vector(this.data[0]*other, this.data[1]*other, this.data[2]*other, this.data[3]*other)
  }

  /**
   * Creates a new vector with the scalar divided
   * @param other The scalar to divide
   * @return The new vector
   */
  div(other: number): Vector {
    // TODO
    return new Vector(this.data[0]/other, this.data[1]/other, this.data[2]/other, this.data[3]/other)
  }

  /**
   * Dot product
   * @param other The vector to calculate the dot product with
   * @return The result of the dot product
   */
  dot(other: Vector): number {
    // TODO
    return (this.data[0] * other.x + this.data[1] * other.y + this.data[2] * other.z + this.data[3] * other.w)
  }

  /**
   * Cross product
   * Calculates the cross product using the first three components
   * @param other The vector to calculate the cross product with
   * @return The result of the cross product as new Vector
   */
  cross(other: Vector): Vector {
    // TODO
    let x = this.data[1] * other.z - this.data[2] * other.y
    let y = this.data[2] * other.x - this.data[0] * other.z
    let z = this.data[0] * other.y - this.data[1] * other.x
    return new Vector(x, y, z, 0)
  }

  /**
   * Returns an array representation of the vector
   * @return An array representation.
   */
  valueOf(): [number, number, number, number] {
    // TODO
    return this.data
  }

  /**
   * Normalizes this vector in place
   * @returns this vector for easier function chaining
   */
  normalize(): Vector {
    // TODO
    let vec = new Vector(this.data[0], this.data[1], this.data[2], this.data[3])
    var m = this.length
    let normalizedVec = new Vector(vec.x / m, vec.y / m, vec.z/m, vec.w/m)
    return normalizedVec;
  }

  /**
   * Compares the vector to another
   * @param other The vector to compare to.
   * @return True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
   */
  equals(other: Vector): boolean {
    // TODO
    if (this.w == undefined) {
      return isEqual(other.x, this.data[0]) && isEqual(other.y, this.data[1]) && isEqual(other.x, this.data[2]);
    } else {
      return isEqual(other.x, this.data[0]) && isEqual(other.y, this.data[1]) && isEqual(other.w, this.data[2]) && isEqual(other.w, this.data[3]);
    }
  }

  /**
   * Calculates the length of the vector
   * @return The length of the vector
   */
  get length(): number {
    // TODO
    return Math.sqrt(Math.pow(this.data[0], 2)+ Math.pow(this.data[1], 2)+ Math.pow(this.data[2], 2)+ Math.pow(this.data[3], 2));
  }
}

function isEqual(a:number, b:number){
  return a-b < Number.EPSILON
}