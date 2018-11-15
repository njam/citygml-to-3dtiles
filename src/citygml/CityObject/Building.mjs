import LinearRing from '../../geometry/LinearRing.mjs'
import TriangleMesh from '../../geometry/TriangleMesh.mjs'
import CityObject from '../CityObject.mjs'

class Building extends CityObject {

  /**
   * @param {CityNode} cityNode
   */
  constructor (cityNode) {
    cityNode.assertLocalName('Building')
    super(cityNode)
  }

  /**
   * @returns {LinearRing[]}
   */
  getLinearRings () {
    if (!this.rings) {
      this.rings = this.cityNode.selectCityNodes('.//gml:Polygon//gml:LinearRing')
        .map(ringNode => {
          let pos = ringNode.selectCityNodes('./gml:pos')
          let points = pos.map(n => n.getTextAsCoordinates1())
          if (points.length === 0) {
            points = ringNode.selectCityNode('./gml:posList').getTextAsCoordinates()
          }

          if (points.length < 4) {
            console.error(`WARNING: Ignoring "LinearRing" with less than 4 points at ${ringNode.getDocumentURI()} line ${ringNode.getLineNumber()}`)
            return null
          }

          return new LinearRing(points)
        })
        .filter(ring => !!ring)
    }
    return this.rings
  }

  /**
   * @returns {TriangleMesh}
   */
  getTriangleMesh () {
    if (!this.triangleMesh) {
      let linearRings = this.getLinearRings()
      let triangles = linearRings.reduce((accumulator, ring) => {
        return accumulator.concat(ring.convertToTriangles())
      }, [])
      this.triangleMesh = new TriangleMesh(triangles)
    }
    return this.triangleMesh
  }

}

export default Building
