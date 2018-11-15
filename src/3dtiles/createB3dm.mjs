/**
 * Based on:
 * https://github.com/AnalyticalGraphicsInc/3d-tiles-tools/blob/master/samples-generator/lib/createB3dm.js
 */
import Cesium from 'cesium'

export default createB3dm

let defaultValue = Cesium.defaultValue
let defined = Cesium.defined

/**
 * Create a Batched 3D Model (b3dm) tile from a binary glTF and per-feature metadata.
 *
 * @param {Object} options An object with the following properties:
 * @param {Buffer} options.glb The binary glTF buffer.
 * @param {Object} [options.featureTableJson] Feature table JSON.
 * @param {Buffer} [options.featureTableBinary] Feature table binary.
 * @param {Object} [options.batchTableJson] Batch table describing the per-feature metadata.
 * @param {Buffer} [options.batchTableBinary] The batch table binary.
 * @returns {Buffer} The generated b3dm tile buffer.
 */
function createB3dm (options) {
  let glb = options.glb

  let headerByteLength = 28
  let featureTableJson = getJsonBufferPadded(options.featureTableJson, headerByteLength)
  let featureTableBinary = getBufferPadded(options.featureTableBinary)
  let batchTableJson = getJsonBufferPadded(options.batchTableJson)
  let batchTableBinary = getBufferPadded(options.batchTableBinary)

  let version = 1
  let featureTableJsonByteLength = featureTableJson.length
  let featureTableBinaryByteLength = featureTableBinary.length
  let batchTableJsonByteLength = batchTableJson.length
  let batchTableBinaryByteLength = batchTableBinary.length
  let gltfByteLength = glb.length
  let byteLength = headerByteLength + featureTableJsonByteLength + featureTableBinaryByteLength + batchTableJsonByteLength + batchTableBinaryByteLength + gltfByteLength

  let header = Buffer.alloc(headerByteLength)
  header.write('b3dm', 0)
  header.writeUInt32LE(version, 4)
  header.writeUInt32LE(byteLength, 8)
  header.writeUInt32LE(featureTableJsonByteLength, 12)
  header.writeUInt32LE(featureTableBinaryByteLength, 16)
  header.writeUInt32LE(batchTableJsonByteLength, 20)
  header.writeUInt32LE(batchTableBinaryByteLength, 24)

  return Buffer.concat([header, featureTableJson, featureTableBinary, batchTableJson, batchTableBinary, glb])
}

/**
 * Pad the buffer to the next 8-byte boundary to ensure proper alignment for the section that follows.
 * Padding is not required by the 3D Tiles spec but is important when using Typed Arrays in JavaScript.
 *
 * @param {Buffer} buffer The buffer.
 * @param {Number} [byteOffset=0] The byte offset on which the buffer starts.
 * @returns {Buffer} The padded buffer.
 */
function getBufferPadded (buffer, byteOffset) {
  if (!defined(buffer)) {
    return Buffer.alloc(0)
  }

  byteOffset = defaultValue(byteOffset, 0)

  let boundary = 8
  let byteLength = buffer.length
  let remainder = (byteOffset + byteLength) % boundary
  let padding = (remainder === 0) ? 0 : boundary - remainder
  let emptyBuffer = Buffer.alloc(padding)
  return Buffer.concat([buffer, emptyBuffer])
}

/**
 * Convert the JSON object to a padded buffer.
 *
 * Pad the JSON with extra whitespace to fit the next 8-byte boundary. This ensures proper alignment
 * for the section that follows (for example, batch table binary or feature table binary).
 * Padding is not required by the 3D Tiles spec but is important when using Typed Arrays in JavaScript.
 *
 * @param {Object} [json] The JSON object.
 * @param {Number} [byteOffset=0] The byte offset on which the buffer starts.
 * @returns {Buffer} The padded JSON buffer.
 */
function getJsonBufferPadded (json, byteOffset) {
  if (!defined(json)) {
    return Buffer.alloc(0)
  }

  byteOffset = defaultValue(byteOffset, 0)
  let string = JSON.stringify(json)

  let boundary = 8
  let byteLength = Buffer.byteLength(string)
  let remainder = (byteOffset + byteLength) % boundary
  let padding = (remainder === 0) ? 0 : boundary - remainder
  let whitespace = ''
  for (let i = 0; i < padding; ++i) {
    whitespace += ' '
  }
  string += whitespace

  return Buffer.from(string)
}
