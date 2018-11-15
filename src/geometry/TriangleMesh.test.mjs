import chai from 'chai'
import TriangleMesh from './TriangleMesh.mjs'
import Triangle from './Triangle.mjs'
import Cesium from 'cesium'

let Cartesian3 = Cesium.Cartesian3
let Cartesian2 = Cesium.Cartesian2

describe('TriangleMesh', async function () {
  let mesh = exampleMesh()

  describe('#getTriangles()', () => {
    it('should return the correct number of triangles', function () {
      chai.assert.lengthOf(mesh.getTriangles(), 12)
    })
    it('should return instances of "Triangle"', function () {
      chai.assert.instanceOf(mesh.getTriangles()[0], Triangle)
    })
  })

  describe('#getVertices()', () => {
    it('should return the correct number of vertices', function () {
      chai.assert.lengthOf(mesh.getVertices(), 12 * 3)
    })
    it('should return instances of "Cartesian3"', function () {
      chai.assert.instanceOf(mesh.getVertices()[0], Cartesian3)
    })
  })

  describe('#getVolume()', () => {
    it('should return the correct result', function () {
      chai.assert.closeTo(mesh.getVolume(), 37.3, 0.5)
    })
  })

  describe('#getHull()', () => {
    it('should return the correct number of triangles', function () {
      chai.assert.lengthOf(mesh.getHull(), 12)
    })
    it('should return instances of "Triangle"', function () {
      chai.assert.instanceOf(mesh.getHull()[0], Triangle)
    })
  })

  describe('#getSurfaceHull()', () => {
    it('should return the correct number of points', function () {
      chai.assert.lengthOf(mesh.getSurfaceHull(), 6)
    })
    it('should return instances of "Cartesian2"', function () {
      chai.assert.instanceOf(mesh.getSurfaceHull()[0], Cartesian2)
    })
  })

  describe('#getSurfaceArea()', () => {
    it('should return the correct result', function () {
      chai.assert.closeTo(mesh.getSurfaceArea(), 15.0, 0.5)
    })
  })

})

function exampleMesh () {
  return new TriangleMesh([
    new Triangle([new Cartesian3(0, 0, 0), new Cartesian3(-2.2, -0.1, 2), new Cartesian3(-2.4, 1.6, 1.9)]),
    new Triangle([new Cartesian3(0, 0, 0), new Cartesian3(-2.4, 1.6, 1.9), new Cartesian3(-0.5, 1.3, 0.3)]),
    new Triangle([new Cartesian3(-2.2, -0.1, 2), new Cartesian3(0, 0, 0), new Cartesian3(5.5, 0.8, 6.1)]),
    new Triangle([new Cartesian3(-2.2, -0.1, 2), new Cartesian3(5.5, 0.8, 6.1), new Cartesian3(3.3, 0.7, 8.1)]),
    new Triangle([new Cartesian3(0, 0, 0), new Cartesian3(-0.5, 1.3, 0.3), new Cartesian3(5.2, 2.2, 6.5)]),
    new Triangle([new Cartesian3(0, 0, 0), new Cartesian3(5.2, 2.2, 6.5), new Cartesian3(5.5, 0.8, 6.1)]),
    new Triangle([new Cartesian3(-0.5, 1.3, 0.3), new Cartesian3(-2.4, 1.6, 1.9), new Cartesian3(3.3, 2.5, 8.2)]),
    new Triangle([new Cartesian3(-0.5, 1.3, 0.3), new Cartesian3(3.3, 2.5, 8.2), new Cartesian3(5.2, 2.2, 6.5)]),
    new Triangle([new Cartesian3(-2.4, 1.6, 1.9), new Cartesian3(-2.2, -0.1, 2), new Cartesian3(3.3, 0.7, 8.1)]),
    new Triangle([new Cartesian3(-2.4, 1.6, 1.9), new Cartesian3(3.3, 0.7, 8.1), new Cartesian3(3.3, 2.5, 8.2)]),
    new Triangle([new Cartesian3(5.6, 0.6, 6), new Cartesian3(5.2, 2.2, 6.5), new Cartesian3(3.3, 2.5, 8.2)]),
    new Triangle([new Cartesian3(5.6, 0.6, 6), new Cartesian3(3.3, 2.5, 8.2), new Cartesian3(3.3, 0.7, 8.1)]),
  ])
}
