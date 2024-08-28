/**
 * @see https://github.com/CesiumGS/3d-tiles/blob/1.0/specification/TileFormats/BatchTable/README.md
 */
class BatchTable {

  constructor () {
    this.items = {}
  }

  /**
   * @param {String|Number} batchId
   * @param {Object} properties
   */
  addBatchItem (batchId, properties) {
    batchId = String(batchId)
    if (this.items[batchId]) {
      throw new Error('An item with this ID already exists: ' + batchId)
    }
    this.items[batchId] = properties
  }

  /**
   * @returns {String[]}
   */
  getBatchIds () {
    return Object.keys(this.items)
  }

  /**
   * @returns {string[]}
   */
  getPropertyNames () {
    let propertyNames = {}
    for (const id in this.items) {
      let properties = this.items[id]
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
    let ids = this.getBatchIds()
    let propertyNames = this.getPropertyNames()

    let batchTable = {
      id: ids
    }
    propertyNames.forEach(name => {
      batchTable[name] = ids.map((id, i) => {
        let value = this.items[id][name]
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
    return Object.keys(this.items).length
  }

  /**
   * @returns {Object}
   */
  getMinMax () {
    let minmax = {}
    for (const id in this.items) {
      let properties = this.items[id]
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
