import LinearRing from "../../geometry/LinearRing.mjs";
import TriangleMesh from "../../geometry/TriangleMesh.mjs";
import CityObject from "../CityObject.mjs";
class Building extends CityObject {

  /**
   * @param {CityNode} cityNode
   */
  constructor(cityNode) {
    cityNode.assertLocalName('Building');
    super(cityNode);
  }

  /**
   * @returns {LinearRing[]}
   */
  getLinearRings() {
    if (!this.rings) {
      this.rings = this.cityNode.selectCityNodes('.//gml:Polygon//gml:LinearRing')
        .map(ring => {
          let pos = ring.selectCityNodes('./gml:pos');
          let points = pos.map(n => n.getTextAsCoordinates1());
          if (points.length === 0) {
            points = ring.selectCityNode('./gml:posList').getTextAsCoordinates();
          }
          return new LinearRing(points);
        });
    }
    return this.rings;
  }

  /**
   * @returns {TriangleMesh}
   */
  getTriangleMesh() {
    let triangles = [];
    this.getLinearRings().forEach(ring => {
      return triangles.push(...ring.convertToTriangles());
    });
    return new TriangleMesh(triangles);
  }

}

export default Building
