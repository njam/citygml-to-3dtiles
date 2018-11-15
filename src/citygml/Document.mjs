import xmldom from 'xmldom'
import CityModel from './CityModel.mjs'
import CityNode from './CityNode.mjs'
import SRSTranslator from './SRSTranslator.mjs'
import fs from 'fs'

class Document {

  /**
   * @param {Document} xmlDoc
   * @param {SRSTranslator} srsTranslator
   */
  constructor (xmlDoc, srsTranslator) {
    this.xmlDoc = xmlDoc
    this.srsTranslator = srsTranslator
  }

  /**
   * @returns {SRSTranslator}
   */
  getSRSTranslator () {
    return this.srsTranslator
  }

  /**
   * @returns {CityModel}
   */
  getCityModel () {
    let rootNode = new CityNode(this.xmlDoc, this)
    let cityModelNode = rootNode.selectCityNode('./(citygml1:CityModel|citygml2:CityModel)')
    return new CityModel(cityModelNode)
  }

  /**
   * @param {String} path
   * @param {SRSTranslator} [srsTranslator]
   * @returns {Document}
   */
  static fromFile (path, srsTranslator) {
    if (!srsTranslator) {
      srsTranslator = new SRSTranslator()
    }
    let data = fs.readFileSync(path, 'utf8')
    let domParser = new xmldom.DOMParser({
      locator: {
        systemId: path,
      },
    })
    let dom = domParser.parseFromString(data)
    return new Document(dom, srsTranslator)
  }

}

export default Document
