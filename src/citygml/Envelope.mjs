import BoundingBox from '../geometry/BoundingBox.mjs'

class Envelope {

  /**
   * @param {CityNode} cityNode
   */
  constructor (cityNode) {
    cityNode.assertLocalName('Envelope')
    this.cityNode = cityNode
  }

  /**
   * @returns {BoundingBox}
   */
  getBoundingBox () {
    let lowerCorner = this.cityNode.selectCityNode('./gml:lowerCorner').getTextAsCoordinates1()
    let upperCorner = this.cityNode.selectCityNode('./gml:upperCorner').getTextAsCoordinates1()
    return new BoundingBox(lowerCorner, upperCorner)
  }

}

export default Envelope
