import Cesium from 'cesium'

class BoundingBox {
  /**
   * @param {Cesium.Cartographic} min
   * @param {Cesium.Cartographic} max
   */
  constructor (min, max) {
    this.min = min
    this.max = max
  }

  /**
   * @returns {Cesium.Cartographic[]}
   */
  getPoints () {
    return [this.min, this.max]
  }

  /**
   * @returns {Cesium.Cartographic}
   */
  getCenter() {
    return new Cesium.Cartographic(
      this.min.longitude + (this.max.longitude - this.min.longitude) / 2,
      this.min.latitude + (this.max.latitude - this.min.latitude) / 2,
      this.min.height + (this.max.height - this.min.height) / 2,
    )
  }

  /**
   * @returns {Cesium.Cartographic}
   */
  getMin () {
    return this.min
  }

  /**
   * @returns {Cesium.Cartographic}
   */
  getMax () {
    return this.max
  }

  /**
   * @param {Cesium.Cartographic} c
   * @return {boolean}
   */
  contains(c) {
    return c.latitude >= this.min.latitude && c.latitude < this.max.latitude &&
           c.longitude >= this.min.longitude && c.longitude < this.max.longitude &&
           c.height >= this.min.height && c.height < this.max.height;
  }

  /**
   * @param {Cesium.Cartographic[]} points
   * @returns {BoundingBox}
   */
  static fromPoints (points) {
    if (points.length < 1) {
      throw new Error('Invalid number of points: ' + points.length)
    }
    let min = points[0].clone()
    let max = min.clone()
    points.forEach(point => {
      min.longitude = Math.min(min.longitude, point.longitude)
      min.latitude = Math.min(min.latitude, point.latitude)
      min.height = Math.min(min.height, point.height)

      max.longitude = Math.max(max.longitude, point.longitude)
      max.latitude = Math.max(max.latitude, point.latitude)
      max.height = Math.max(max.height, point.height)
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
