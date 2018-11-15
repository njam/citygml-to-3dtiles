import Cesium from 'cesium'
import quickHull3d from 'quickhull3d'
import Triangle from './Triangle.mjs'
import convexHull from 'convexhull-js'

const Cartesian3 = Cesium.Cartesian3
const Cartesian2 = Cesium.Cartesian2

class TriangleMesh {
  /**
   * @param {Triangle[]} triangles
   */
  constructor (triangles) {
    this.triangles = triangles
  }

  /**
   * @returns {Triangle[]}
   */
  getTriangles () {
    return this.triangles
  }

  /**
   * @returns {Cartesian3[]}
   */
  getVertices () {
    let triangles = this.getTriangles()
    return triangles.reduce((accumulator, triangle) => {
      return accumulator.concat(triangle.getVertices())
    }, [])
  }

  /**
   * @see https://stackoverflow.com/a/1568551/3090404
   * @returns {Number}
   */
  getVolume () {
    let triangles = this.getHull()
    let zero
    let signedVolumeOfTriangle = (triangle) => {
      let vertices = triangle.getVertices()
      if (!zero) {
        zero = vertices[0]
      }
      let p1 = Cartesian3.subtract(zero, vertices[0], new Cartesian3())
      let p2 = Cartesian3.subtract(zero, vertices[1], new Cartesian3())
      let p3 = Cartesian3.subtract(zero, vertices[2], new Cartesian3())
      let v321 = p3.x * p2.y * p1.z
      let v231 = p2.x * p3.y * p1.z
      let v312 = p3.x * p1.y * p2.z
      let v132 = p1.x * p3.y * p2.z
      let v213 = p2.x * p1.y * p3.z
      let v123 = p1.x * p2.y * p3.z
      return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123)
    }
    let volumes = triangles.map(t => signedVolumeOfTriangle(t))
    let volume = volumes.reduce((acc, v) => acc + v, 0)
    return Math.abs(volume)
  }

  /**
   * @returns {Triangle[]}
   */
  getHull () {
    let vertices = this.getVertices()
    let points = vertices.map(v => [v.x, v.y, v.z])
    let output = quickHull3d(points)
    return output.map(indices => {
      return new Triangle([
        vertices[indices[0]],
        vertices[indices[1]],
        vertices[indices[2]]
      ])
    })
  }

  /**
   * @return {Cesium.Cartesian2[]}
   */
  getSurfaceHull () {
    let vertices = this.getVertices()
    let points = vertices.map(v => Cartesian2.fromCartesian3(v))
    return convexHull(points)
  }

  /**
   * @see https://stackoverflow.com/a/43174368/3090404
   * @returns {Number}
   */
  getSurfaceArea () {
    let points = this.getSurfaceHull()
    let area = 0
    points.forEach((vertex, i) => {
      let vertex2 = points[(i + 1) % points.length]
      area += vertex.x * vertex2.y - vertex.y * vertex2.x
    })
    return Math.abs(area) / 2
  }

}

export default TriangleMesh
