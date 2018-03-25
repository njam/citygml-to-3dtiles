import Envelope from "./Envelope.mjs";

class CityObject {

  /**
   * @param {CityNode} cityNode
   */
  constructor(cityNode) {
    this.cityNode = cityNode;
  }

  /**
   * @returns {Envelope|Null}
   */
  getEnvelope() {
    let envelopeNode = this.cityNode.findCityNode('./gml:boundedBy/gml:Envelope');
    if (!envelopeNode) {
      return null;
    }
    return new Envelope(envelopeNode);
  }

  /**
   * @returns {Mesh}
   */
  getMesh() {
    throw new Error("Not implemented");
  }

  /**
   * @returns {Object}
   */
  getAttributes() {
    const tagNames = [
      'gen1:stringAttribute',
      'gen1:intAttribute',
      'gen1:doubleAttribute',
      'gen1:dateAttribute',
      'gen1:uriAttribute',
      'gen1:measureAttribute',
      'gen2:stringAttribute',
      'gen2:intAttribute',
      'gen2:doubleAttribute',
      'gen2:dateAttribute',
      'gen2:uriAttribute',
      'gen2:measureAttribute',
    ];
    const query = './/(' + tagNames.join('|') + ')';
    const attrs = {};
    this.cityNode.selectCityNodes(query).forEach(node => {
      const name = node.getAttribute('name');
      let value = node.selectNode('./(gen1:value|gen2:value)').textContent;
      let tagName = node.getLocalName();
      if (tagName === 'intAttribute') {
        value = parseInt(value);
      }
      if (tagName === 'doubleAttribute' || tagName === 'measureAttribute') {
        value = parseFloat(value);
      }
      attrs[name] = value;
    });

    return attrs;
  }

  /**
   * @returns {Object}
   */
  getExternalReferences() {
    const refs = {};
    this.cityNode.selectCityNodes('./citygml1:externalReference').forEach(node => {
      const name = node.selectNode('./citygml1:informationSystem').textContent;
      refs[name] = node.selectNode('./citygml1:externalObject/citygml1:name').textContent;
    });
    return refs;
  }
}

export default CityObject
