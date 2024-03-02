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
    let lowerCorner = this.cityNode.selectCityNode('./gml:lowerCorner').getTextAsCoordinates1Cartographic()
    let upperCorner = this.cityNode.selectCityNode('./gml:upperCorner').getTextAsCoordinates1Cartographic()
    return new BoundingBox(lowerCorner, upperCorner)
  }

}

export default Envelope
