/**
 * Based on:
 * https://github.com/AnalyticalGraphicsInc/3d-tiles-tools/blob/master/samples-generator/lib/Mesh.js
 */
import Cesium from 'cesium'
import Material from './Material.mjs'

export default Mesh

let Cartesian3 = Cesium.Cartesian3
let Cartesian2 = Cesium.Cartesian2
let defined = Cesium.defined

const whiteOpaqueMaterial = new Material({
  diffuse: [0.5, 0.5, 0.5, 1.0],
  ambient: [1.0, 1.0, 1.0, 1.0]
})

/**
 * Stores the vertex attributes and indices describing a mesh.
 *
 * @param {Object} options Object with the following properties:
 * @param {Number[]} options.indices An array of integers representing the mesh indices.
 * @param {Number[]} options.positions A packed array of floats representing the mesh positions.
 * @param {Number[]} options.normals A packed array of floats representing the mesh normals.
 * @param {Number[]} options.uvs A packed array of floats representing the mesh UVs.
 * @param {Number[]} options.vertexColors A packed array of integers representing the vertex colors.
 * @param {Number[]} [options.batchIds] An array of integers representing the batch ids.
 * @param {Material} [options.material] A material to apply to the mesh.
 * @param {MeshView[]} [options.views] An array of MeshViews.
 *
 * @constructor
 */
function Mesh (options) {
  this.indices = options.indices
  this.positions = options.positions
  this.normals = options.normals
  this.uvs = options.uvs
  this.vertexColors = options.vertexColors
  this.batchIds = options.batchIds
  this.material = options.material
  this.views = options.views
}

/**
 * A subsection of the mesh with its own material.
 *
 * @param {Object} options Object with the following properties:
 * @param {Material} options.material The material.
 * @param {Number} options.indexOffset The start index into the mesh's indices array.
 * @param {Number} options.indexCount The number of indices.
 *
 * @constructor
 * @private
 */
function MeshView (options) {
  this.material = options.material
  this.indexOffset = options.indexOffset
  this.indexCount = options.indexCount
}

let scratchCartesian = new Cartesian3()

/**
 * Get the number of vertices in the mesh.
 *
 * @returns {Number} The number of vertices.
 */
Mesh.prototype.getVertexCount = function () {
  return this.positions.length / 3
}

/**
 * Get the center of the mesh.
 *
 * @returns {Cartesian3} The center position
 */
Mesh.prototype.getCenter = function () {
  let center = new Cartesian3()
  let positions = this.positions
  let vertexCount = this.getVertexCount()
  for (let i = 0; i < vertexCount; ++i) {
    let position = Cartesian3.unpack(positions, i * 3, scratchCartesian)
    Cartesian3.add(position, center, center)
  }
  Cartesian3.divideByScalar(center, vertexCount, center)
  return center
}

/**
 * Set the positions relative to center.
 */
Mesh.prototype.setPositionsRelativeToCenter = function () {
  let positions = this.positions
  let center = this.getCenter()
  let vertexCount = this.getVertexCount()
  for (let i = 0; i < vertexCount; ++i) {
    let position = Cartesian3.unpack(positions, i * 3, scratchCartesian)
    Cartesian3.subtract(position, center, position)
    Cartesian3.pack(position, positions, i * 3)
  }
}

/**
 * Bake materials as vertex colors. Use the default white opaque material.
 */
Mesh.prototype.transferMaterialToVertexColors = function () {
  let material = this.material
  this.material = whiteOpaqueMaterial
  let vertexCount = this.getVertexCount()
  let vertexColors = new Array(vertexCount * 4)
  this.vertexColors = vertexColors
  for (let i = 0; i < vertexCount; ++i) {
    vertexColors[i * 4 + 0] = Math.floor(material.diffuse[0] * 255)
    vertexColors[i * 4 + 1] = Math.floor(material.diffuse[1] * 255)
    vertexColors[i * 4 + 2] = Math.floor(material.diffuse[2] * 255)
    vertexColors[i * 4 + 3] = Math.floor(material.diffuse[3] * 255)
  }
}

function appendToArray (array, append) {
  append.forEach(function (item) {
    array.push(item)
  })
}

/**
 * Batch multiple meshes into a single mesh. Assumes the input meshes do not already have batch ids.
 *
 * @param {Mesh[]} meshes The meshes that will be batched together.
 * @returns {Mesh} The batched mesh.
 */
Mesh.batch = function (meshes) {
  let batchedPositions = []
  let batchedNormals = []
  let batchedUvs = []
  let batchedVertexColors = []
  let batchedBatchIds = []
  let batchedIndices = []

  let startIndex = 0
  let indexOffset = 0
  let views = []
  let currentView
  let meshesLength = meshes.length
  for (let i = 0; i < meshesLength; ++i) {
    let mesh = meshes[i]
    let positions = mesh.positions
    let normals = mesh.normals
    let uvs = mesh.uvs
    let vertexColors = mesh.vertexColors
    let vertexCount = mesh.getVertexCount()

    // Generate batch ids for this mesh
    let batchIds = new Array(vertexCount).fill(i)

    appendToArray(batchedPositions, positions)
    appendToArray(batchedNormals, normals)
    appendToArray(batchedUvs, uvs)
    appendToArray(batchedVertexColors, vertexColors)
    appendToArray(batchedBatchIds, batchIds)

    // Generate indices and mesh views
    let indices = mesh.indices
    let indicesLength = indices.length

    if (!defined(currentView) || (currentView.material !== mesh.material)) {
      currentView = new MeshView({
        material: mesh.material,
        indexOffset: indexOffset,
        indexCount: indicesLength
      })
      views.push(currentView)
    } else {
      currentView.indexCount += indicesLength
    }

    for (let j = 0; j < indicesLength; ++j) {
      let index = indices[j] + startIndex
      batchedIndices.push(index)
    }
    startIndex += vertexCount
    indexOffset += indicesLength
  }

  return new Mesh({
    indices: batchedIndices,
    positions: batchedPositions,
    normals: batchedNormals,
    uvs: batchedUvs,
    vertexColors: batchedVertexColors,
    batchIds: batchedBatchIds,
    views: views
  })
}

/**
 * Clone the mesh geometry and create a new mesh. Assumes the input mesh does not already have batch ids.
 *
 * @param {Mesh} mesh The mesh to clone.
 * @returns {Mesh} The cloned mesh.
 */
Mesh.clone = function (mesh) {
  return new Mesh({
    positions: mesh.positions.slice(),
    normals: mesh.normals.slice(),
    uvs: mesh.uvs.slice(),
    vertexColors: mesh.vertexColors.slice(),
    indices: mesh.indices.slice(),
    material: mesh.material
  })
}

/**
 * @param {TriangleMesh} triangleMesh
 * @return {Mesh}
 */
Mesh.fromTriangleMesh = function (triangleMesh) {
  let vertices = []
  let normals = []
  triangleMesh.getTriangles().forEach(triangle => {
    vertices = vertices.concat(triangle.getVertices())
    let normal = triangle.getNormal()
    triangle.getVertices().forEach(vertex => {
      normals = normals.concat(normal)
    })
  })
  let indices = vertices.map((vertex, i) => {
    return i
  })
  let uvs = vertices.map(vertex => {
    return new Cesium.Cartesian2(0, 0)
  })

  return new Mesh({
    indices: indices,
    positions: flattenVertices(vertices),
    normals: flattenVertices(normals),
    uvs: flattenVertices(uvs),
    vertexColors: new Array(vertices.length * 4).fill(0),
    material: whiteOpaqueMaterial
  })
}

/**
 * @param {Cesium.Cartesian3[]} vertices
 * @returns {Number[]}
 */
function flattenVertices (vertices) {
  let arr = []
  vertices.forEach(vertex => {
    if (vertex instanceof Cartesian3) {
      arr = arr.concat(Cartesian3.pack(vertex, []))
    } else if (vertex instanceof Cartesian2) {
      arr = arr.concat(Cartesian2.pack(vertex, []))
    } else {
      throw new Error('Unknown vertex type')
    }
  })
  return arr
}