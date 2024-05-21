import BatchTable from './3dtiles/BatchTable.mjs'
import CityDocument from './citygml/Document.mjs'
import BoundingBox from './geometry/BoundingBox.mjs'
import Mesh from './3dtiles/Mesh.mjs'
import createGltf from './3dtiles/createGltf.mjs'
import Batched3DModel from './3dtiles/Batched3DModel.mjs'
import Tileset from './3dtiles/Tileset.mjs'
import SRSTranslator from './citygml/SRSTranslator.mjs'
import fs from 'fs'
import Path from 'path'
import fsExtra from "fs-extra";

export class Converter {

  /**
   * @param {Object} [options]
   */
  constructor (options) {
    this.options = Object.assign({
      propertiesGetter: null,
      objectFilter: null,
      srsProjections: {},
      tilingScheme: {
        tileResolution: 1,
      },
    }, options)
  }

  /**
   * @param {String} inputPath Path to CityGML XML file, or folder with multiple files
   * @param {String} outputFolder Path to folder to write 3D-Tiles files to
   */
  async convertFiles (inputPath, outputFolder) {
    let inputPaths = this._findInputFiles(inputPath)
    let srsTranslator = new SRSTranslator(this.options.srsProjections)

    let cityObjects = [], boundingBoxes = []
    inputPaths.forEach((inputPath, i) => {
      console.debug(`Reading CityGML file ${i + 1}/${inputPaths.length}...`)
      let cityDocument = CityDocument.fromFile(inputPath, srsTranslator)
      let cityModel = cityDocument.getCityModel()
      let objs = cityModel.getCityObjects()
      console.debug(` Found ${objs.length} city objects.`)
      if (this.options.objectFilter) {
        objs = objs.filter(this.options.objectFilter)
        console.debug(` After filtering ${objs.length} city objects remain.`)
      }
      if (objs.length > 0) {
        cityObjects.push(...objs)
        boundingBoxes.push(cityModel.getBoundingBox())
      }
    })

    console.debug(`Converting to 3D Tiles...`)
    let boundingBox = BoundingBox.fromBoundingBoxes(boundingBoxes)

    let tileBoxes = this._getTilingScheme(boundingBox)
    let tiles = await Promise.all(tileBoxes.map(box => {
      const objects = []

      console.log(`  Converting tile ${box.index[0]}/${box.index[1]} ...`)

      for (const obj of cityObjects) {
        if (box.bbox.contains(obj.getCenter())) {
          objects.push(obj)
        }
      }

      return this.convertCityObjects(objects, box.bbox)
    }))

    console.debug(`Writing 3D Tiles...`)

    let data = {
      asset: {
        version: '0.0'
      },
      geometricError: 9999,
      root: {
        refine: 'ADD',
        boundingVolume: {
          region: [
            boundingBox.min.longitude,
            boundingBox.min.latitude,
            boundingBox.max.longitude,
            boundingBox.max.latitude,
            0,
            boundingBox.max.height,
          ]
        },
        geometricError: 999,
        children: []
      }
    }

    await Promise.all(tiles.map(async (tileset, i) => {
      let [ilat, ilon] = tileBoxes[i].index
      let path = Path.join(ilat.toString(), ilon.toString());

      console.log(`  Writing tile ${ilat}/${ilon} ...`)
      data.root.children.push({
        refine: 'ADD',
        boundingVolume: {
          region: [
            tileBoxes[i].bbox.min.longitude,
            tileBoxes[i].bbox.min.latitude,
            tileBoxes[i].bbox.max.longitude,
            tileBoxes[i].bbox.max.latitude,
            tileBoxes[i].bbox.min.height,
            tileBoxes[i].bbox.max.height,
          ]
        },
        geometricError: 99,
        content: {
          uri: Path.join(".", path, "tileset.json").toString().replaceAll('\\', '/'),
        }
      })
      await tileset.writeToFolder(Path.join(outputFolder, path))
    }))

    fsExtra.outputFile(Path.join(outputFolder, "tileset.json"), JSON.stringify(data, null, 2))
    console.debug('Done.')
  }

  /**
   * @param {Document} cityDocument
   * @returns {Tileset}
   */
  async convertCityDocument (cityDocument) {
    let cityModel = cityDocument.getCityModel()
    return await this.convertCityObjects(cityModel.getCityObjects(), cityModel.getBoundingBox())
  }

  /**
   * @param  {BoundingBox} boundingBox
   * @return {{bbox: BoundingBox, index: number[]}[]}
   * @private
   */
  _getTilingScheme (boundingBox) {
    const tileResolution = this.options.tilingScheme.tileResolution;
    let tileSizeLat = (boundingBox.getMax().latitude - boundingBox.getMin().latitude) / tileResolution
    let tileSizeLng = (boundingBox.getMax().longitude - boundingBox.getMin().longitude) / tileResolution

    let boxes = []
    for (let lat = 0; lat < tileResolution; lat++) {
      for (let lng = 0; lng < tileResolution; lng++) {
        const min = boundingBox.getMin().clone()
        min.latitude += tileSizeLat * lat;
        min.longitude += tileSizeLng * lng;
        min.height = 0;

        const max = boundingBox.getMin().clone()
        max.latitude += tileSizeLat * (lat + 1);
        max.longitude += tileSizeLng * (lng + 1);
        max.height = boundingBox.max.height

        boxes.push({
          bbox: new BoundingBox(min, max),
          index:[lat, lng]
        })
      }
    }

    return boxes
  }

  /**
   * @param  {CityObject[]} cityObjects
   * @param  {BoundingBox} boundingBox
   * @returns {Tileset}
   */
  async convertCityObjects (cityObjects, boundingBox) {
    let meshes = cityObjects.map((cityObject) => {
      return Mesh.fromTriangleMesh(cityObject.getTriangleMesh())
    })
    let mesh = Mesh.batch(meshes)

    let batchTable = new BatchTable()
    cityObjects.forEach((cityObject, i) => {
      batchTable.addFeature(i, this._getProperties(cityObject))
    })

    let gltf = await createGltf({
      mesh: mesh,
      useBatchIds: true,
      optimizeForCesium: true,
      relativeToCenter: true
    })

    let b3dm = new Batched3DModel(gltf, batchTable, boundingBox)

    return new Tileset(b3dm)
  }

  /**
   * @param {CityObject} cityObject
   * @returns {Object}
   * @private
   */
  _getProperties (cityObject) {
    let properties = Object.assign(
      cityObject.getExternalReferences(),
      cityObject.getAttributes(),
    )
    if (this.options.propertiesGetter) {
      properties = Object.assign(properties,
        this.options.propertiesGetter(cityObject, properties)
      )
    }
    return properties
  }

  /**
   * @param {String} path
   * @returns {String[]}
   * @private
   */
  _findInputFiles (path) {
    if (!fs.existsSync(path)) {
      throw new Error(`Input path does not exist: ${path}`)
    }

    let paths
    if (fs.statSync(path).isDirectory()) {
      paths = fs.readdirSync(path)
        .map((filename) => Path.join(path, filename))
        .filter((path) => fs.statSync(path).isFile())
    } else {
      paths = [path]
    }
    paths = paths.filter((path) => ['.xml', '.gml'].includes(Path.extname(path)))

    if (paths.length < 1) {
      throw new Error(`Could not find any .xml/.gml files in path: ${path}`)
    }

    return paths
  }
}

export default Converter
