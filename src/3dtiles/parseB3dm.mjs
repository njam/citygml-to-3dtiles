export default parseB3dm

/**
 * Parse a Batched 3D Model (b3dm) from binary data
 *
 * @see https://github.com/CesiumGS/3d-tiles/blob/1.0/specification/TileFormats/Batched3DModel/README.md
 *
 * @param {Buffer} buffer
 * @returns {ParsedB3dm} The parsed b3dm model
 */
function parseB3dm(buffer) {
  let headerLength = 28;
  if (buffer.length < headerLength) {
    throw new Error(`Expected ${headerLength} bytes but only got ${buffer.length}`);
  }

  // Read header
  const byteLength = buffer.readUInt32LE(8);
  let featureTableJsonLength = buffer.readUInt32LE(12);
  let featureTableBinaryLength = buffer.readUInt32LE(16);
  let batchTableJsonLength = buffer.readUInt32LE(20);
  let batchTableBinaryLength = buffer.readUInt32LE(24);

  // Calculate start/end of the sections
  const featureTableJsonStart = headerLength;
  const featureTableJsonEnd = featureTableJsonStart + featureTableJsonLength;
  const featureTableBinaryStart = featureTableJsonEnd;
  const featureTableBinaryEnd = featureTableBinaryStart + featureTableBinaryLength;
  const batchTableJsonStart = featureTableBinaryEnd;
  const batchTableJsonEnd = batchTableJsonStart + batchTableJsonLength;
  const batchTableBinaryStart = batchTableJsonEnd;
  const batchTableBinaryEnd = batchTableBinaryStart + batchTableBinaryLength;
  const payloadStart = batchTableBinaryEnd;
  const payloadEnd = byteLength;

  // Extract the data
  const batchTableJsonBuffer = buffer.subarray(batchTableJsonStart, batchTableJsonEnd);
  const payloadBuffer = buffer.subarray(payloadStart, payloadEnd);

  // Produce the parsed b3dm representation
  const batchTableJson = parseJsonFromBuffer(batchTableJsonBuffer);
  return new ParsedB3dm(batchTableJson, payloadBuffer)
}

/**
 * Parses JSON data from the given buffer.
 *
 * If the given buffer is empty, then an empty object will
 * be returned.
 *
 * @param {Buffer} buffer
 * @returns The parsed object
 * @throws DataError If the JSON could not be parsed
 */
function parseJsonFromBuffer(buffer) {
  if (buffer.length === 0) {
    return {};
  }
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch (e) {
    throw new Error(`Could not parse JSON from buffer: ${e}`);
  }
}


class ParsedB3dm {
  /**
   * @param {Object} batchTable
   * @param {Buffer} gltf
   */
  constructor(batchTable, gltf) {
    this.batchTable = batchTable
    this.gltf = gltf
  }
}
