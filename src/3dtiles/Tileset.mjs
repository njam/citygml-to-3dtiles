import Batched3DModel from './Batched3DModel.mjs'
import fsExtra from 'fs-extra'
import path from 'path'

class Tileset {
  /**
   * @param {Batched3DModel} b3dm
   */
  constructor (b3dm) {
    this.b3dm = b3dm
  }

  /**
   * @param {String} tileName
   * @returns {String}
   */
  getJson (tileName) {
    let data = {
      asset: {
        version: '0.0'
      },
      properties: this.b3dm.getBatchTable().getMinMax(),
      geometricError: 99,
      root: {
        refine: 'ADD',
        boundingVolume: {
          region: this.b3dm.getRegion()
        },
        geometricError: 0.0,
        content: {
          url: tileName
        }
      }
    }
    return JSON.stringify(data, null, 2)
  }

  /**
   * @returns {Batched3DModel}
   */
  getBatched3DModel () {
    return this.b3dm
  }

  /**
   * @param {String} folder
   * @returns {Promise}
   */
  async writeToFolder (folder) {
    fsExtra.outputFile(path.join(folder, 'full.b3dm'), await this.b3dm.getBuffer())
    fsExtra.outputFile(path.join(folder, 'tileset.json'), this.getJson('full.b3dm'))
  }
}

export default Tileset
