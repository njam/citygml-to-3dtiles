/**
 * @see https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/BatchTable/README.md
 */
class BatchTable {

  constructor () {
    this.features = {}
  }

  /**
   * @param {String|Number} id
   * @param {Object} properties
   */
  addFeature (id, properties) {
    id = String(id)
    if (this.features[id]) {
      throw new Error('A feature with this ID already exists: ' + id)
    }
    this.features[id] = properties
  }

  /**
   * @returns {String[]}
   */
  getIds () {
    return Object.keys(this.features)
  }

  /**
   * @returns {string[]}
   */
  getPropertyNames () {
    let propertyNames = {}
    for (const id in this.features) {
      let properties = this.features[id]
      for (const name in properties) {
        propertyNames[name] = true
      }
    }
    return Object.keys(propertyNames)
  }

  /**
   * @returns {Object}
   */
  getBatchTableJson () {
    let ids = this.getIds()
    let propertyNames = this.getPropertyNames()

    let batchTable = {
      id: ids
    }
    propertyNames.forEach(name => {
      batchTable[name] = ids.map((id, i) => {
        let value = this.features[id][name]
        if (typeof value === 'undefined') {
          value = null
        }
        return value
      })
    })

    return batchTable
  }

  /**
   * @returns {Number}
   */
  getLength () {
    return Object.keys(this.features).length
  }

  /**
   * @returns {Object}
   */
  getMinMax () {
    let minmax = {}
    for (const id in this.features) {
      let properties = this.features[id]
      for (const name in properties) {
        let value = properties[name]
        if (typeof value === 'number') {
          if (!minmax[name]) {
            minmax[name] = {minimum: value, maximum: value}
          } else {
            minmax[name]['minimum'] = Math.min(minmax[name]['minimum'], value)
            minmax[name]['maximum'] = Math.max(minmax[name]['maximum'], value)
          }
        }
      }
    }
    return minmax
  }
}

export default BatchTable
