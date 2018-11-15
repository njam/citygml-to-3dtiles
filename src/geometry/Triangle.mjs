import Cesium from 'cesium'

const Cartesian3 = Cesium.Cartesian3

class Triangle {
  /**
   * @param {Cesium.Cartesian3[]} vertices
   */
  constructor (vertices) {
    if (vertices.length !== 3) {
      throw new Error('Invalid vertices length for triangle: ' + vertices.length)
    }
    this.vertices = vertices
  }

  /**
   * @returns {Cesium.Cartesian3[]}
   */
  getVertices () {
    return this.vertices
  }

  /**
   * @returns Cesium.Cartesian3
   */
  getNormal () {
    let u = Cartesian3.subtract(this.vertices[1], this.vertices[0], new Cartesian3())
    let v = Cartesian3.subtract(this.vertices[2], this.vertices[0], new Cartesian3())
    return Cartesian3.cross(u, v, new Cartesian3())
  }

}

export default Triangle
