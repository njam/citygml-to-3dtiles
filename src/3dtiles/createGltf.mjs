/**
 * Based on:
 * https://github.com/AnalyticalGraphicsInc/3d-tiles-tools/blob/master/samples-generator/lib/createGltf.js
 */
import Cesium from 'cesium'
import fsExtra from 'fs-extra'
import gltfPipeline from 'gltf-pipeline'
import mime from 'mime'
import path from 'path'
import Promise from 'bluebird'

export default createGltf

let Cartesian3 = Cesium.Cartesian3
let combine = Cesium.combine

let defaultValue = Cesium.defaultValue
let addPipelineExtras = gltfPipeline.addPipelineExtras
let getBinaryGltf = gltfPipeline.getBinaryGltf
let loadGltfUris = gltfPipeline.loadGltfUris

let processGltf = gltfPipeline.Pipeline.processJSON

let sizeOfUint8 = 1
let sizeOfUint16 = 2
let sizeOfUint32 = 4
let sizeOfFloat32 = 4

/**
 * Create a glTF from a Mesh.
 *
 * @param {Object} options An object with the following properties:
 * @param {Mesh} options.mesh The mesh.
 * @param {Boolean} [options.useBatchIds=true] Modify the glTF to include the batchId vertex attribute.
 * @param {Boolean} [options.optimizeForCesium=false] Optimize the glTF for Cesium by using the sun as a default light source.
 * @param {Boolean} [options.relativeToCenter=false] Use the Cesium_RTC extension.
 * @param {Boolean} [options.khrMaterialsCommon=false] Save glTF with the KHR_materials_common extension.
 * @param {Boolean} [options.quantization=false] Save glTF with quantized attributes.
 * @param {Boolean} [options.deprecated=false] Save the glTF with the old BATCHID semantic.
 * @param {Object|Object[]} [options.textureCompressionOptions] Options for compressing textures in the glTF.
 * @param {String} [options.upAxis='Y'] Specifies the up-axis for the glTF model.
 *
 * @returns {Promise} A promise that resolves with the binary glTF buffer.
 */
function createGltf (options) {
  let useBatchIds = defaultValue(options.useBatchIds, true)
  let optimizeForCesium = defaultValue(options.optimizeForCesium, false)
  let relativeToCenter = defaultValue(options.relativeToCenter, false)
  let khrMaterialsCommon = defaultValue(options.khrMaterialsCommon, false)
  let quantization = defaultValue(options.quantization, false)
  let deprecated = defaultValue(options.deprecated, false)
  let textureCompressionOptions = options.textureCompressionOptions
  let upAxis = defaultValue(options.upAxis, 'Y')

  let mesh = options.mesh
  let positions = mesh.positions
  let normals = mesh.normals
  let uvs = mesh.uvs
  let vertexColors = mesh.vertexColors
  let indices = mesh.indices
  let views = mesh.views

  // If all the vertex colors are 0 then the mesh does not have vertex colors
  let hasVertexColors = !vertexColors.every(function (element) {
    return element === 0
  })

  // Get the center position in WGS84 coordinates
  let center
  if (relativeToCenter) {
    center = mesh.getCenter()
    mesh.setPositionsRelativeToCenter()
  }

  let rootMatrix
  if (upAxis === 'Y') {
    // Models are z-up, so add a z-up to y-up transform.
    // The glTF spec defines the y-axis as up, so this is the default behavior.
    // In Cesium a y-up to z-up transform is applied later so that the glTF and 3D Tiles coordinate systems are consistent
    rootMatrix = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]
  } else if (upAxis === 'Z') {
    // No conversion needed - models are already z-up
    rootMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  let i
  let positionsMinMax = getMinMax(positions, 3)
  let positionsLength = positions.length
  let positionsBuffer = Buffer.alloc(positionsLength * sizeOfFloat32)
  for (i = 0; i < positionsLength; ++i) {
    positionsBuffer.writeFloatLE(positions[i], i * sizeOfFloat32)
  }

  let normalsMinMax = getMinMax(normals, 3)
  let normalsLength = normals.length
  let normalsBuffer = Buffer.alloc(normalsLength * sizeOfFloat32)
  for (i = 0; i < normalsLength; ++i) {
    normalsBuffer.writeFloatLE(normals[i], i * sizeOfFloat32)
  }

  let uvsMinMax = getMinMax(uvs, 2)
  let uvsLength = uvs.length
  let uvsBuffer = Buffer.alloc(uvsLength * sizeOfFloat32)
  for (i = 0; i < uvsLength; ++i) {
    uvsBuffer.writeFloatLE(uvs[i], i * sizeOfFloat32)
  }

  let vertexColorsMinMax
  let vertexColorsBuffer = Buffer.alloc(0)
  if (hasVertexColors) {
    vertexColorsMinMax = getMinMax(vertexColors, 4)
    let vertexColorsLength = vertexColors.length
    vertexColorsBuffer = Buffer.alloc(vertexColorsLength, sizeOfUint8)
    for (i = 0; i < vertexColorsLength; ++i) {
      vertexColorsBuffer.writeUInt8(vertexColors[i], i)
    }
  }

  let indicesLength = indices.length
  let indexBuffer = Buffer.alloc(indicesLength * sizeOfUint32)
  for (i = 0; i < indicesLength; ++i) {
    indexBuffer.writeUInt32LE(indices[i], i * sizeOfUint32)
  }

  let vertexBuffer = Buffer.concat([positionsBuffer, normalsBuffer, uvsBuffer, vertexColorsBuffer])
  let vertexBufferByteOffset = 0
  let vertexBufferByteLength = vertexBuffer.byteLength
  let vertexCount = mesh.getVertexCount()

  let indexBufferByteOffset = vertexBufferByteLength
  let indexBufferByteLength = indexBuffer.byteLength

  let buffer = Buffer.concat([vertexBuffer, indexBuffer])
  let bufferUri = 'data:application/octet-stream;base64,' + buffer.toString('base64')
  let byteLength = buffer.byteLength

  let byteOffset = 0
  let positionsByteOffset = byteOffset
  byteOffset += positionsBuffer.length
  let normalsByteOffset = byteOffset
  byteOffset += normalsBuffer.length
  let uvsByteOffset = byteOffset
  byteOffset += uvsBuffer.length

  let vertexColorsByteOffset = byteOffset
  if (hasVertexColors) {
    byteOffset += vertexColorsBuffer.length
  }

  let indexAccessors = {}
  let materials = {}
  let primitives = []
  let images = {}
  let samplers = {}
  let textures = {}

  let viewsLength = views.length
  for (i = 0; i < viewsLength; ++i) {
    let view = views[i]
    let material = view.material
    let accessorName = 'accessor_index_' + i
    let materialName = 'material_' + i
    let indicesMinMax = getMinMax(indices, 1, view.indexOffset, view.indexCount)
    indexAccessors[accessorName] = {
      bufferView: 'bufferView_index',
      byteOffset: sizeOfUint32 * view.indexOffset,
      byteStride: 0,
      componentType: 5125, // UNSIGNED_INT
      count: view.indexCount,
      type: 'SCALAR',
      min: indicesMinMax.min,
      max: indicesMinMax.max
    }

    let ambient = material.ambient
    let diffuse = material.diffuse
    let emission = material.emission
    let specular = material.specular
    let shininess = material.shininess
    let transparent = false

    if (typeof diffuse === 'string') {
      images.image_diffuse = {
        uri: diffuse
      }
      samplers.sampler_diffuse = {
        magFilter: 9729, // LINEAR
        minFilter: 9729, // LINEAR
        wrapS: 10497, // REPEAT
        wrapT: 10497 // REPEAT
      }
      textures.texture_diffuse = {
        format: 6408, // RGBA
        internalFormat: 6408, // RGBA
        sampler: 'sampler_diffuse',
        source: 'image_diffuse',
        target: 3553, // TEXTURE_2D
        type: 5121 // UNSIGNED_BYTE
      }

      diffuse = 'texture_diffuse'
    } else {
      transparent = diffuse[3] < 1.0
    }

    let doubleSided = transparent
    let technique = (shininess > 0.0) ? 'PHONG' : 'LAMBERT'

    materials[materialName] = {
      extensions: {
        KHR_materials_common: {
          technique: technique,
          transparent: transparent,
          doubleSided: doubleSided,
          values: {
            ambient: ambient,
            diffuse: diffuse,
            emission: emission,
            specular: specular,
            shininess: shininess,
            transparency: 1.0,
            transparent: transparent,
            doubleSided: doubleSided
          }
        }
      }
    }

    let attributes = {
      POSITION: 'accessor_position',
      NORMAL: 'accessor_normal',
      TEXCOORD_0: 'accessor_uv'
    }

    if (hasVertexColors) {
      attributes.COLOR_0 = 'accessor_vertexColor'
    }

    primitives.push({
      attributes: attributes,
      indices: accessorName,
      material: materialName,
      mode: 4 // TRIANGLES
    })
  }

  let vertexAccessors = {
    accessor_position: {
      bufferView: 'bufferView_vertex',
      byteOffset: positionsByteOffset,
      byteStride: 0,
      componentType: 5126, // FLOAT
      count: vertexCount,
      type: 'VEC3',
      min: positionsMinMax.min,
      max: positionsMinMax.max
    },
    accessor_normal: {
      bufferView: 'bufferView_vertex',
      byteOffset: normalsByteOffset,
      byteStride: 0,
      componentType: 5126, // FLOAT
      count: vertexCount,
      type: 'VEC3',
      min: normalsMinMax.min,
      max: normalsMinMax.max
    },
    accessor_uv: {
      bufferView: 'bufferView_vertex',
      byteOffset: uvsByteOffset,
      byteStride: 0,
      componentType: 5126, // FLOAT
      count: vertexCount,
      type: 'VEC2',
      min: uvsMinMax.min,
      max: uvsMinMax.max
    }
  }

  if (hasVertexColors) {
    vertexAccessors.accessor_vertexColor = {
      bufferView: 'bufferView_vertex',
      byteOffset: vertexColorsByteOffset,
      byteStride: 0,
      componentType: 5121, // UNSIGNED_BYTE
      count: vertexCount,
      type: 'VEC4',
      min: vertexColorsMinMax.min,
      max: vertexColorsMinMax.max,
      normalized: true
    }
  }

  let accessors = combine(vertexAccessors, indexAccessors)

  let gltf = {
    accessors: accessors,
    asset: {
      generator: '3d-tiles-samples-generator',
      version: '1.0',
      profile: {
        api: 'WebGL',
        version: '1.0'
      }
    },
    buffers: {
      buffer: {
        byteLength: byteLength,
        uri: bufferUri
      }
    },
    bufferViews: {
      bufferView_vertex: {
        buffer: 'buffer',
        byteLength: vertexBufferByteLength,
        byteOffset: vertexBufferByteOffset,
        target: 34962 // ARRAY_BUFFER
      },
      bufferView_index: {
        buffer: 'buffer',
        byteLength: indexBufferByteLength,
        byteOffset: indexBufferByteOffset,
        target: 34963 // ELEMENT_ARRAY_BUFFER
      }
    },
    extensionsUsed: ['KHR_materials_common'],
    images: images,
    materials: materials,
    meshes: {
      mesh: {
        primitives: primitives
      }
    },
    nodes: {
      rootNode: {
        matrix: rootMatrix,
        meshes: ['mesh'],
        name: 'rootNode'
      }
    },
    samplers: samplers,
    scene: 'scene',
    scenes: {
      scene: {
        nodes: ['rootNode']
      }
    },
    textures: textures
  }

  let kmcOptions
  if (khrMaterialsCommon) {
    kmcOptions = {
      technique: 'LAMBERT',
      doubleSided: false
    }
  }

  let gltfOptions = {
    optimizeForCesium: optimizeForCesium,
    kmcOptions: kmcOptions,
    preserve: true, // Don't apply extra optimizations to the glTF
    quantize: quantization,
    compressTextureCoordinates: quantization,
    encodeNormals: quantization,
    textureCompressionOptions: textureCompressionOptions
  }

  return loadImages(gltf)
    .then(function () {
      // Run through the gltf-pipeline to generate techniques and shaders for the glTF
      return processGltf(gltf, gltfOptions)
        .then(function (gltf) {
          if (useBatchIds) {
            modifyGltfWithBatchIds(gltf, mesh, deprecated)
          }
          if (relativeToCenter) {
            modifyGltfWithRelativeToCenter(gltf, center)
          }
          if (optimizeForCesium) {
            modifyGltfForCesium(gltf)
          }
          return convertToBinaryGltf(gltf)
        })
    })
}

function getLoadImageFunction (image) {
  return function () {
    let imagePath = image.uri
    let extension = path.extname(imagePath)
    return fsExtra.readFile(imagePath)
      .then(function (buffer) {
        image.uri = 'data:' + mime.getType(extension) + ';base64,' + buffer.toString('base64')
      })
  }
}

function loadImages (gltf) {
  let imagePromises = []
  let images = gltf.images
  for (let id in images) {
    if (images.hasOwnProperty(id)) {
      let image = images[id]
      imagePromises.push(getLoadImageFunction(image)())
    }
  }
  return Promise.all(imagePromises)
}

function convertToBinaryGltf (gltf) {
  addPipelineExtras(gltf)
  return loadGltfUris(gltf)
    .then(function (gltf) {
      return getBinaryGltf(gltf, true, true).glb
    })
}

function modifyGltfWithBatchIds (gltf, mesh, deprecated) {
  let i
  let batchIds = mesh.batchIds
  let batchIdsMinMax = getMinMax(batchIds, 1)
  let batchIdsLength = batchIds.length
  let batchIdsBuffer = Buffer.alloc(batchIdsLength * sizeOfUint16)
  for (i = 0; i < batchIdsLength; ++i) {
    batchIdsBuffer.writeUInt16LE(batchIds[i], i * sizeOfUint16)
  }
  let batchIdsBufferUri = 'data:application/octet-stream;base64,' + batchIdsBuffer.toString('base64')
  let batchIdSemantic = deprecated ? 'BATCHID' : '_BATCHID'

  gltf.accessors.accessor_batchId = {
    bufferView: 'bufferView_batchId',
    byteOffset: 0,
    byteStride: 0,
    componentType: 5123, // UNSIGNED_SHORT
    count: batchIdsLength,
    type: 'SCALAR',
    min: batchIdsMinMax.min,
    max: batchIdsMinMax.max
  }

  gltf.bufferViews.bufferView_batchId = {
    buffer: 'buffer_batchId',
    byteLength: batchIdsBuffer.length,
    byteOffset: 0,
    target: 34962 // ARRAY_BUFFER
  }

  gltf.buffers.buffer_batchId = {
    byteLength: batchIdsBuffer.length,
    uri: batchIdsBufferUri
  }

  let meshes = gltf.meshes
  for (let meshId in meshes) {
    if (meshes.hasOwnProperty(meshId)) {
      let primitives = meshes[meshId].primitives
      let length = primitives.length
      for (i = 0; i < length; ++i) {
        let primitive = primitives[i]
        primitive.attributes[batchIdSemantic] = 'accessor_batchId'
      }
    }
  }

  let programs = gltf.programs
  for (let programId in programs) {
    if (programs.hasOwnProperty(programId)) {
      let program = programs[programId]
      program.attributes.push('a_batchId')
    }
  }

  let techniques = gltf.techniques
  for (let techniqueId in techniques) {
    if (techniques.hasOwnProperty(techniqueId)) {
      let technique = techniques[techniqueId]
      technique.attributes.a_batchId = 'batchId'
      technique.parameters.batchId = {
        semantic: batchIdSemantic,
        type: 5123 // UNSIGNED_SHORT
      }
    }
  }

  let shaders = gltf.shaders
  for (let shaderId in shaders) {
    if (shaders.hasOwnProperty(shaderId)) {
      let shader = shaders[shaderId]
      if (shader.type === 35633) { // Is a vertex shader
        let uriHeader = 'data:text/plain;base64,'
        let shaderEncoded = shader.uri.substring(uriHeader.length)
        let shaderText = Buffer.from(shaderEncoded, 'base64')
        shaderText = 'attribute float a_batchId;\n' + shaderText
        shaderEncoded = Buffer.from(shaderText).toString('base64')
        shader.uri = uriHeader + shaderEncoded
      }
    }
  }
}

function modifyGltfWithRelativeToCenter (gltf, center) {
  gltf.extensionsUsed = defaultValue(gltf.extensionsUsed, [])
  gltf.extensions = defaultValue(gltf.extensions, {})

  gltf.extensionsUsed.push('CESIUM_RTC')
  gltf.extensions.CESIUM_RTC = {
    center: Cartesian3.pack(center, new Array(3))
  }

  let techniques = gltf.techniques
  for (let techniqueId in techniques) {
    if (techniques.hasOwnProperty(techniqueId)) {
      let technique = techniques[techniqueId]
      let parameters = technique.parameters
      for (let parameterId in parameters) {
        if (parameters.hasOwnProperty(parameterId)) {
          if (parameterId === 'modelViewMatrix') {
            let parameter = parameters[parameterId]
            parameter.semantic = 'CESIUM_RTC_MODELVIEW'
          }
        }
      }
    }
  }
}

function modifyGltfForCesium (gltf) {
  // Add diffuse semantic to support colorBlendMode in Cesium
  let techniques = gltf.techniques
  for (let techniqueId in techniques) {
    if (techniques.hasOwnProperty(techniqueId)) {
      let technique = techniques[techniqueId]
      technique.parameters.diffuse.semantic = '_3DTILESDIFFUSE'
    }
  }
}

function getMinMax (array, components, start, length) {
  start = defaultValue(start, 0)
  length = defaultValue(length, array.length)
  let min = new Array(components).fill(Number.POSITIVE_INFINITY)
  let max = new Array(components).fill(Number.NEGATIVE_INFINITY)
  let count = length / components
  for (let i = 0; i < count; ++i) {
    for (let j = 0; j < components; ++j) {
      let index = start + i * components + j
      let value = array[index]
      min[j] = Math.min(min[j], value)
      max[j] = Math.max(max[j], value)
    }
  }
  return {
    min: min,
    max: max
  }
}
