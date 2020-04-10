import Triangle from './Triangle.mjs'
import Tesselator from './Tesselator.mjs'

class LinearRing {
  /**
   * @param {Cesium.Cartesian3[]} vertices
   */
  constructor (vertices) {
    if (vertices.length < 4) {
      throw new Error('Invalid vertices length for LinearRing: ' + vertices.length)
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
   * @returns {Triangle[]}
   */
  convertToTriangles () {
    let tesselator = new Tesselator()
    return tesselator.triangulate(this.getVertices())
  }
}

export default LinearRing
