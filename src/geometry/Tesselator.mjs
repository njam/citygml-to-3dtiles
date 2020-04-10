import Cesium from 'cesium'
import libtess from 'libtess'
import Triangle from './Triangle.mjs'

let tessy

class Tesselator {

  /**
   * @param {Cesium.Cartesian3[]} vertices
   * @returns {Triangle[]}
   */
  triangulate (vertices) {
    let points = []
    vertices.forEach(v => {
      points.push(v.x, v.y, v.z)
    })

    let result = []
    let tessy = Tesselator._getTessy()
    tessy.gluTessBeginPolygon(result)
    tessy.gluTessBeginContour()
    vertices.forEach(v => {
      let coords = [v.x, v.y, v.z]
      tessy.gluTessVertex(coords, coords)
    })
    tessy.gluTessEndContour()
    tessy.gluTessEndPolygon()

    let triangles = []
    while (result.length > 0) {
      const triangle = new Triangle([
        new Cesium.Cartesian3(result.shift(), result.shift(), result.shift()),
        new Cesium.Cartesian3(result.shift(), result.shift(), result.shift()),
        new Cesium.Cartesian3(result.shift(), result.shift(), result.shift()),
      ])
      triangles.push(triangle)
    }
    return triangles
  }

  /**
   * @returns {libtess.GluTesselator}
   * @private
   */
  static _getTessy () {
    if (!tessy) {
      tessy = new libtess.GluTesselator()
      tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, polyVertArray) {
        polyVertArray[polyVertArray.length] = data[0]
        polyVertArray[polyVertArray.length] = data[1]
        polyVertArray[polyVertArray.length] = data[2]
      })
      tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, function (type) {
        if (type !== libtess.primitiveType.GL_TRIANGLES) {
          throw new Error('expected TRIANGLES but got type: ' + type)
        }
      })
      tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errno) {
        throw new Error('libtess error: ' + errno)
      })
      tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function (coords, data, weight) {
        return [coords[0], coords[1], coords[2]]
      })
      tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function (flag) {
        // don't really care about the flag, but need no-strip/no-fan behavior
      })
    }
    return tessy
  }

}

export default Tesselator
