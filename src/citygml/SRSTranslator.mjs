import proj4 from 'proj4'
import epsgDefinitions from "./EpsgDefinitions.mjs";

class SRSTranslator {

  /**
   * @param {Object} [projectionDefinitions]
   */
  constructor (projectionDefinitions) {
    this.projections = {}
    this.transformations = {}

    projectionDefinitions = Object.assign(
      SRSTranslator._getDefaultDefinitions(),
      projectionDefinitions || {}
    )
    for (let name in projectionDefinitions) {
      this.addProjection(name, projectionDefinitions[name])
    }
  }

  /**
   * @param {String} name
   * @param {String} projection
   */
  addProjection (name, projection) {
    this.projections[name] = projection
  }

  /**
   * @param {Number[]} coords
   * @param {String} projectionFrom
   * @param {String} projectionTo
   * @return {Number[]}
   */
  forward (coords, projectionFrom, projectionTo) {
    let height = undefined
    if (coords.length === 3) {
      // proj4js doesn't support 'height', just preserve the input value
      height = coords.pop()
    }

    let transformation = this._getTransformation(projectionFrom, projectionTo)
    coords = transformation.forward(coords)

    if (typeof height !== 'undefined') {
      coords[2] = height
    }
    return coords
  }

  /**
   * @param {String} projectionFrom
   * @param {String} projectionTo
   * @return {Function}
   */
  _getTransformation (projectionFrom, projectionTo) {
    let cacheKey = `${projectionFrom}:::${projectionTo}`
    if (!this.transformations[cacheKey]) {
      let from = this._getProjection(projectionFrom)
      let to = this._getProjection(projectionTo)
      this.transformations[cacheKey] = proj4(from, to)
    }
    return this.transformations[cacheKey]
  }

  /**
   * @param {String} name
   * @return {String}
   * @private
   */
  _getProjection (name) {
    if (!this.projections[name]) {
      throw new Error(`Unknown projection name: "${name}".\nSee https://github.com/njam/citygml-to-3dtiles#option-srsprojections for details.`)
    }
    return this.projections[name]
  }

  /**
   * @returns {Object}
   * @private
   */
  static _getDefaultDefinitions () {
    return epsgDefinitions
  }

}

export default SRSTranslator
