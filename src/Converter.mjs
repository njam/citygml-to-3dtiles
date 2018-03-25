import BatchTable from "./3dtiles/BatchTable.mjs";
import CityDocument from "./citygml/Document.mjs";
import Mesh from "./3dtiles/Mesh.mjs";
import createGltf from "./3dtiles/createGltf.mjs";
import Batched3DModel from "./3dtiles/Batched3DModel.mjs";
import Tileset from "./3dtiles/Tileset.mjs";
import SRSTranslator from "./citygml/SRSTranslator.mjs";

class Converter {

  /**
   * @param {Object} [options]
   */
  constructor(options) {
    this.options = Object.assign({
      propertiesGetter: null,
      srsProjections: {}
    }, options);
  }

  /**
   * @param {String} inputPath Path to CityGML XML file
   * @param {String} outputFolder Path to folder to write 3D-Tiles files to
   */
  async convertFiles(inputPath, outputFolder) {
    let srsTranslator = new SRSTranslator(this.options.srsProjections);
    let cityDocument = CityDocument.fromFile(inputPath, srsTranslator);
    let tileset = await this.getTileset(cityDocument);
    await tileset.writeToFolder(outputFolder);
  }

  /**
   * @param {Document} cityDocument
   * @returns {Tileset}
   */
  async getTileset(cityDocument) {
    let cityModel = cityDocument.getCityModel();
    let cityObjects = cityModel.getCityObjects();
    let boundingBox = cityModel.getBoundingBox();

    let meshes = cityObjects.map((o, i) => {
      return Mesh.fromTriangleMesh(o.getTriangleMesh());
    });
    let mesh = Mesh.batch(meshes);

    let batchTable = new BatchTable();
    cityObjects.forEach((cityObject, i) => {
      batchTable.addFeature(i, this._getProperties(cityObject));
    });

    let gltf = await createGltf({
      mesh: mesh,
      useBatchIds: true,
      optimizeForCesium: true,
      relativeToCenter: true
    });

    let b3dm = new Batched3DModel(gltf, batchTable, boundingBox);

    return new Tileset(b3dm);
  }

  /**
   * @param {CityObject} cityObject
   * @returns {Object}
   * @private
   */
  _getProperties(cityObject) {
    let properties = Object.assign(
      cityObject.getExternalReferences(),
      cityObject.getAttributes(),
    );
    if (this.options.propertiesGetter) {
      properties = Object.assign(properties,
        this.options.propertiesGetter(cityObject, properties)
      )
    }
    return properties;
  }
}

export default Converter
