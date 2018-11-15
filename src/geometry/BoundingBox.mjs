import Cesium from 'cesium'

class BoundingBox {
  /**
   * @param {Cesium.Cartesian3} min
   * @param {Cesium.Cartesian3} max
   */
  constructor (min, max) {
    this.min = min
    this.max = max
  }

  /**
   * @returns {Cesium.Cartesian3[]}
   */
  getPoints () {
    return [this.min, this.max]
  }

  /**
   * @returns {Cesium.Cartesian3}
   */
  getMin () {
    return this.min
  }

  /**
   * @returns {Cesium.Cartesian3}
   */
  getMax () {
    return this.max
  }

  /**
   * @param {Cesium.Cartesian3[]} points
   * @returns {BoundingBox}
   */
  static fromPoints (points) {
    if (points.length < 1) {
      throw new Error('Invalid number of points: ' + points.length)
    }
    let min = Cesium.Cartesian3.clone(points[0])
    let max = Cesium.Cartesian3.clone(min)
    points.forEach(point => {
      min.x = Math.min(min.x, point.x)
      min.y = Math.min(min.y, point.y)
      min.z = Math.min(min.z, point.z)

      max.x = Math.max(max.x, point.x)
      max.y = Math.max(max.y, point.y)
      max.z = Math.max(max.z, point.z)
    })
    return new BoundingBox(min, max)
  }

  /**
   * @param {BoundingBox[]} boxes
   * @returns {BoundingBox}
   */
  static fromBoundingBoxes (boxes) {
    if (boxes.length < 1) {
      throw new Error('Invalid number of bounding-boxes: ' + boxes.length)
    }
    let points = []
    boxes.forEach(box => {
      points = points.concat(box.getPoints())
    })
    return this.fromPoints(points)
  }

}

export default BoundingBox
