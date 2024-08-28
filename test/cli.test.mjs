import chai from 'chai'
import fsJetpack from 'fs-jetpack'
import fs from 'node:fs'
import {promisify} from 'node:util'
import {exec} from 'node:child_process'
import parseB3dm from "../src/3dtiles/parseB3dm.mjs";

const execAsync = promisify(exec)

describe('CLI', async function () {
  this.timeout(10000)

  describe('zurich-lod2-citygml1.xml', () => {
    let outputFolder
    let tilesetJson
    let b3dmParsed

    before(async () => {
      let inputPath = 'test/data/zurich-lod2-citygml1.xml'
      outputFolder = fsJetpack.tmpDir({prefix: 'citygml-to-3dtiles---tests---'})
      await execAsync(`./bin/citygml-to-3dtiles.mjs '${inputPath}' '${outputFolder.path()}'`)

      tilesetJson = JSON.parse(fs.readFileSync(outputFolder.path('tileset.json')))
      b3dmParsed = parseB3dm(fs.readFileSync(outputFolder.path('full.b3dm')))
    })

    after(async () => {
      outputFolder.remove()
    })

    it('The tileset should have the expected content', () => {
      chai.assert.deepEqual(tilesetJson, {
        "asset": {
          "version": "0.0",
        },
        "geometricError": 99,
        "properties": {
          "Geomtype": {
            "maximum": 2,
            "minimum": 1,
          },
          "QualitaetStatus": {
            "maximum": 1,
            "minimum": 1,
          },
          "Region": {
            "maximum": 8,
            "minimum": 8,
          },
        },
        "root": {
          "boundingVolume": {
            "region": [
              0.14907155162642596,
              0.826804434491562,
              0.14908311706269073,
              0.8268148017875332,
              403.19936,
              432.65393,
            ],
          },
          "content": {
            "url": "full.b3dm",
          },
          "geometricError": 0,
          "refine": "ADD",
        }
      })
    })

    it('The B3DM-gltf should look reasonable', async () => {
      chai.assert.include(b3dmParsed.gltf.toString(), 'void main(')
    })

    it('The B3DM-BatchTable should have the expected content', () => {
      chai.assert.deepEqual(b3dmParsed.batchTable, {
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
    let outputFolder
    let tilesetJson
    let b3dmParsed

    before(async () => {
      let inputPath = 'test/data/sig3d-genericattributes-citygml2.xml'
      outputFolder = fsJetpack.tmpDir({prefix: 'citygml-to-3dtiles---tests---'})
      await execAsync(`./bin/citygml-to-3dtiles.mjs '${inputPath}' '${outputFolder.path()}'`)

      tilesetJson = JSON.parse(fs.readFileSync(outputFolder.path('tileset.json')))
      b3dmParsed = parseB3dm(fs.readFileSync(outputFolder.path('full.b3dm')))
    })

    after(async () => {
      outputFolder.remove()
    })

    it('The tileset should have the expected region', () => {
      chai.assert.deepEqual(tilesetJson['root']['boundingVolume']['region'], [
        -0.8846020828104612,
        1.5515922059263958,
        -0.8845940828005763,
        1.551593676293702,
        0,
        9,
      ])
    })

    it('The B3DM-gltf should look reasonable', async () => {
      chai.assert.include(b3dmParsed.gltf.toString(), 'void main(')
    })

    it('The B3DM-BatchTable should have the expected content', () => {
      chai.assert.deepEqual(b3dmParsed.batchTable, {
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
    let outputFolder
    let tilesetJson
    let b3dmParsed

    before(async () => {
      let inputPath = 'test/data/delft-citygml2.xml'
      outputFolder = fsJetpack.tmpDir({prefix: 'citygml-to-3dtiles---tests---'})
      await execAsync(`./bin/citygml-to-3dtiles.mjs '${inputPath}' '${outputFolder.path()}'`)

      tilesetJson = JSON.parse(fs.readFileSync(outputFolder.path('tileset.json')))
      b3dmParsed = parseB3dm(fs.readFileSync(outputFolder.path('full.b3dm')))
    })

    after(async () => {
      outputFolder.remove()
    })

    it('The tileset should have the expected region', () => {
      chai.assert.deepEqual(tilesetJson['root']['boundingVolume']['region'], [
        0.07601011853885127,
        0.9075773939506161,
        0.07648148496824216,
        0.9078300429446181,
        0,
        100,
      ])
    })

    it('The B3DM-gltf should look reasonable', async () => {
      chai.assert.include(b3dmParsed.gltf.toString(), 'void main(')
    })

    it('The B3DM-BatchTable should have the expected content', () => {
      chai.assert.deepEqual(b3dmParsed.batchTable, {
          'id': ['0', '1', '2'],
        }
      )
    })
  })

})
