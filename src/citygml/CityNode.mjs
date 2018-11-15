import xpath from 'xpath'
import Cesium from 'cesium'

let srsCache = {}

class CityNode {
  /**
   * @param {Node} xmlNode
   * @param {Document} document
   */
  constructor (xmlNode, document) {
    this.xmlNode = xmlNode
    this.document = document
  }

  /**
   * @returns {String}
   */
  getTagName () {
    return this.xmlNode.tagName
  }

  /**
   * @returns {String}
   */
  getLocalName () {
    return this.xmlNode.localName
  }

  /**
   * @param {String} expectedName
   * @throws {Error}
   */
  assertLocalName (expectedName) {
    let actualName = this.getLocalName()
    if (actualName !== expectedName) {
      throw new Error('Unexpected tagName, expected "' + expectedName + '" but got: ' + actualName)
    }
  }

  /**
   * @returns {String}
   */
  getLineNumber () {
    return this.xmlNode.lineNumber
  }

  /**
   * @returns {String}
   */
  getDocumentURI () {
    return this.xmlNode.ownerDocument.documentURI
  }

  /**
   * @param {String} name
   * @returns {String}
   */
  getAttribute (name) {
    return this.xmlNode.getAttribute(name)
  }

  /**
   * @param {String} expression
   * @returns {Node|Null}
   */
  selectNode (expression) {
    let node = this._select(expression, true)
    if (!node) {
      throw new Error('Cannot find node for expression: ' + expression)
    }
    return node
  }

  /**
   * @param {String} expression
   * @returns {Node|Null}
   */
  findNode (expression) {
    let node = this._select(expression, true)
    if (!node) {
      return null
    }
    return node
  }

  /**
   * @param {String} expression
   * @returns {Node[]}
   */
  selectNodes (expression) {
    return this._select(expression, false)
  }

  /**
   * @param {String} expression
   * @returns {CityNode[]}
   */
  selectCityNodes (expression) {
    return this.selectNodes(expression).map((xmlNode) => {
      return new CityNode(xmlNode, this.document)
    })
  }

  /**
   * @param {String} expression
   * @returns {CityNode}
   */
  selectCityNode (expression) {
    return new CityNode(this.selectNode(expression), this.document)
  }

  /**
   * @param {String} expression
   * @returns {CityNode|Null}
   */
  findCityNode (expression) {
    let xmlNode = this.findNode(expression)
    if (!xmlNode) {
      return null
    }
    return new CityNode(xmlNode, this.document)
  }

  /**
   * @returns {Cesium.Cartesian3[]}
   */
  getTextAsCoordinates () {
    let srs = this.getSRS()
    let srsTranslator = this.document.getSRSTranslator()

    let text = this.xmlNode.textContent
    let textTokens = text.trim().split(' ')
    if (textTokens.length % 3 !== 0) {
      throw new Error(`Cannot parse text as coordinates: "${text}"`)
    }
    let points = []
    while (textTokens.length > 0) {
      let point = textTokens.splice(0, 3)
      point = point.map(p => parseFloat(p))
      point = point.map(p => isNaN(p) ? 0 : p)
      point = srsTranslator.forward(point, srs, 'WGS84')
      point = Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2])
      points.push(point)
    }
    return points
  }

  /**
   * @returns {Cesium.Cartesian3}
   */
  getTextAsCoordinates1 () {
    let coords = this.getTextAsCoordinates()
    if (coords.length !== 1) {
      throw new Error('Expected 1 coordinates, but found ' + coords.length)
    }
    return coords[0]
  }

  /**
   * @returns {String}
   */
  getSRS () {
    /**
     * @todo: currently assuming the whole document has the same SRS.
     * Instead should recursively iterate from current node through parent nodes.
     * See http://en.wiki.quality.sig3d.org/index.php/Modeling_Guide_for_3D_Objects_-_Part_1:_Basics_(Rules_for_Validating_GML_Geometries_in_CityGML)#Spatial_Reference_Systems_.28SRS.29
     */
    let srsCacheId = this.xmlNode.ownerDocument.srsCacheId
    if (!srsCacheId) {
      srsCacheId = Object.keys(srsCache).length + 1
      this.xmlNode.ownerDocument.srsCacheId = srsCacheId
    }

    let srs = srsCache[srsCacheId]
    if (!srs) {
      srs = this.selectNode('//@srsName').value
      if (!srs) {
        throw new Error('Cannot detect SRS')
      }
      srsCache[srsCacheId] = srs
    }
    return srs
  }

  /**
   * @param {String} expression
   * @param {Boolean} single
   * @return {Node|Node[]}
   * @private
   */
  _select (expression, single) {
    expression = CityNode._preprocessXpathExpression(expression)
    return xpath.selectWithResolver(expression, this.xmlNode, xpathResolver, single)
  }

  /**
   * @param {String} expression
   * @returns {String}
   * @private
   */
  static _preprocessXpathExpression (expression) {
    /**
     * Support XPath 2.0-style "or"
     * i.e. replace `(foo|bar)` with `*[self::foo or self::bar]`.
     */
    expression = expression.replace(/\(([\w\d:|]+?)\)/, (_, p1) => {
      let tagNames = p1.split('|')
      return '*[' + tagNames.map(n => `self::${n}`).join(' or ') + ']'
    })
    return expression
  }
}

let namespaceMapping = {
  'gml': 'http://www.opengis.net/gml',

  'citygml1': 'http://www.opengis.net/citygml/1.0',
  'base1': 'http://www.opengis.net/citygml/base/1.0',
  'gen1': 'http://www.opengis.net/citygml/generics/1.0',
  'bldg1': 'http://www.opengis.net/citygml/building/1.0',

  'citygml2': 'http://www.opengis.net/citygml/2.0',
  'base2': 'http://www.opengis.net/citygml/base/2.0',
  'gen2': 'http://www.opengis.net/citygml/generics/2.0',
  'bldg2': 'http://www.opengis.net/citygml/building/2.0',
}

let xpathResolver = {
  lookupNamespaceURI: function (prefix) {
    return namespaceMapping[prefix]
  }
}

export default CityNode
