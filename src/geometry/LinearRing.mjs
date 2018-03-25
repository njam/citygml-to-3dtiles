import Triangle from "./Triangle.mjs";

class LinearRing {
  /**
   * @param {Cesium.Cartesian3[]} vertices
   */
  constructor(vertices) {
    if (vertices.length < 4) {
      throw new Error('Invalid vertices length for LinearRing: ' + vertices.length);
    }
    this.vertices = vertices;
  }

  /**
   * @returns {Cesium.Cartesian3[]}
   */
  getVertices() {
    return this.vertices;
  }

  /**
   * @returns {Triangle[]}
   */
  convertToTriangles() {
    let vertices = this.vertices.slice();
    let triangles = [];
    while (vertices.length > 3) {
      const triangle = new Triangle(vertices.slice(0, 3));
      triangles.push(triangle);
      vertices.splice(1, 1);
    }
    return triangles;
  }

}

export default LinearRing
