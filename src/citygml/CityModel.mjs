import CityNode from './CityNode.mjs'
import Building from './CityObject/Building.mjs'
import BoundingBox from '../geometry/BoundingBox.mjs'
import Envelope from './Envelope.mjs'

class CityModel {
  /**
   * @param {CityNode} cityNode
   */
  constructor (cityNode) {
    cityNode.assertLocalName('CityModel')
    this.cityNode = cityNode
  }

  /**
   * @returns {CityObject[]}
   */
  getCityObjects () {
    /**
     * @todo include other city-objects
     */
    return this.getBuildings()
  }

  /**
   * @returns {Building[]}
   */
  getBuildings () {
    let nodes = this.cityNode.selectCityNodes('//(bldg1:Building|bldg2:Building)')
    return nodes.map((cityNode) => {
      return new Building(cityNode)
    })
  }

  /**
   * @returns {Envelope|Null}
   */
  getEnvelope () {
    let envelopeNode = this.cityNode.findCityNode('./gml:boundedBy/gml:Envelope')
    if (!envelopeNode) {
      return null
    }
    return new Envelope(envelopeNode)
  }

  /**
   * @returns {BoundingBox}
   */
  getBoundingBox () {
    let documentEnvelope = this.getEnvelope()
    if (documentEnvelope) {
      return documentEnvelope.getBoundingBox()
    }

    let objectEnvelopes = this.getCityObjects().map(o => o.getEnvelope())
    objectEnvelopes = objectEnvelopes.filter(e => !!e)
    if (objectEnvelopes.length > 0) {
      let boundingBoxes = objectEnvelopes.map(e => e.getBoundingBox())
      return BoundingBox.fromBoundingBoxes(boundingBoxes)
    }

    throw new Error('Failed to get bounding box for city-model')
  }
}

export default CityModel
