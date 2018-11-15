import CityDocument from './citygml/Document.mjs'
import Converter from './Converter.mjs'
import chai from 'chai'

describe('Converter', async function () {
  this.timeout(10000)

  describe('zurich-lod2-citygml1.xml', () => {
    let tilesetJson
    let b3dm

    before(async () => {
      let converter = new Converter()
      let cityDocument = CityDocument.fromFile('test/data/zurich-lod2-citygml1.xml')
      let tileset = await converter.convertCityDocument(cityDocument)

      tilesetJson = tileset.getJson('foo.b3dm')
      b3dm = tileset.getBatched3DModel()
    })

    it('should create a non-emty tileset', () => {
      chai.assert.isNotEmpty(tilesetJson)
    })

    it('should create a JSON-parseable tileset', () => {
      chai.assert.isNotEmpty(JSON.parse(tilesetJson))
    })

    it('should create a non-emty B3DM buffer', async () => {
      chai.assert.isNotEmpty(await b3dm.getBuffer())
    })

    it('should create the correct B3DM region', () => {
      chai.assert.deepEqual(b3dm.getRegion(), [
        0.14907335694208532,
        0.8268099146975589,
        0.14908126185163723,
        0.8268101310946895,
        372.8139593142252,
        459.6138361611206,
      ])
    })

    it('should create the correct BatchTable', () => {
      chai.assert.deepEqual(b3dm.getBatchTable().getBatchTableJson(), {
        'id': ['0', '1', '2', '3'],
        'GID': ['z41ac39cc00001bb7', 'z45b11a6a00002f9e', 'z41ac39cc00001a71', 'z46f29566000001f7'],
        'EGID': ['302040712', '2372759', '302040570', '140715'],
        'E:\\Working\\08_20120322\\COWI_LoD2_08_20120322_part06.xml': ['z41ac39cc00001bb7', 'z45b11a6a00002f9e', 'z41ac39cc00001a71', 'z46f29566000001f7'],
        'Region': [8, 8, 8, 8],
        'QualitaetStatus': [1, 1, 1, 1],
        'Geomtype': [1, 2, 1, 2]
      })
    })
  })

  describe('sig3d-genericattributes-citygml2.xml', () => {
    let tilesetJson
    let b3dm

    before(async () => {
      let converter = new Converter()
      let cityDocument = CityDocument.fromFile('test/data/sig3d-genericattributes-citygml2.xml')
      let tileset = await converter.convertCityDocument(cityDocument)

      tilesetJson = tileset.getJson('foo.b3dm')
      b3dm = tileset.getBatched3DModel()
    })

    it('should create a non-emty tileset', () => {
      chai.assert.isNotEmpty(tilesetJson)
    })

    it('should create a JSON-parseable tileset', () => {
      chai.assert.isNotEmpty(JSON.parse(tilesetJson))
    })

    it('should create a non-emty B3DM buffer', async () => {
      chai.assert.isNotEmpty(await b3dm.getBuffer())
    })

    it('should create the correct B3DM region', () => {
      chai.assert.deepEqual(b3dm.getRegion(), [
        -0.8846020828104612,
        1.5515922059263938,
        -0.8845940828005763,
        1.5515936762937024,
        1.862645149230957e-9,
        9.000000074429806,
      ])
    })

    it('should create the correct BatchTable', () => {
      chai.assert.deepEqual(b3dm.getBatchTable().getBatchTableJson(), {
          'id': ['0'],
          'Bauweise': ['Massivbau'],
          'Anzahl der Eingänge': [3],
          'Grundflächenzahl GFZ': [0.33],
          'Datum der Baufreigabe': ['2012-03-09'],
          'Web Seite': ['http://www.sig3d.org'],
          'Breite des Gebäudes': [20.75],
          'Höhe': [9],
          'Grundflächen': [140],
          'Volumen': [1260],
        }
      )
    })
  })

  describe('delft-citygml2.xml', () => {
    let tilesetJson
    let b3dm

    before(async () => {
      let converter = new Converter()
      let cityDocument = CityDocument.fromFile('test/data/delft-citygml2.xml')
      let tileset = await converter.convertCityDocument(cityDocument)

      tilesetJson = tileset.getJson('foo.b3dm')
      b3dm = tileset.getBatched3DModel()
    })

    it('should create a non-emty tileset', () => {
      chai.assert.isNotEmpty(tilesetJson)
    })

    it('should create a JSON-parseable tileset', () => {
      chai.assert.isNotEmpty(JSON.parse(tilesetJson))
    })

    it('should create a non-emty B3DM buffer', async () => {
      chai.assert.isNotEmpty(await b3dm.getBuffer())
    })

    it('should create the correct B3DM region', () => {
      chai.assert.deepEqual(b3dm.getRegion(), [
        0.07601011853885128,
        0.9075773939506161,
        0.07648148496824216,
        0.9078300429446181,
        0,
        100.00000000055493,
      ])
    })

    it('should create the correct BatchTable', () => {
      chai.assert.deepEqual(b3dm.getBatchTable().getBatchTableJson(), {
          'id': ['0', '1', '2'],
        }
      )
    })
  })

})
