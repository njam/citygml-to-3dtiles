import SRSTranslator from './SRSTranslator.mjs'
import chai from 'chai'
import assert from 'assert'

describe('SRSTranslator', async function () {

  describe('#forward()', () => {
    let transformer = new SRSTranslator()

    it('should convert 2D coordinates', () => {
      chai.assert.deepEqual(
        transformer.forward([683303.518, 247425.762], 'CH1903', 'WGS84'),
        [8.541602004702368, 47.37240457906726]
      )
    })

    it('should preserve "height" component of 3D coordinates', () => {
      chai.assert.deepEqual(
        transformer.forward([683303.518, 247425.762, 300.4], 'CH1903', 'WGS84'),
        [8.541602004702368, 47.37240457906726, 300.4]
      )
    })

    it('should throw on unknown projection', () => {
      assert.throws(() => {
        transformer.forward([2, 3], 'XYZ123', 'WGS84')
      }, /Unknown projection/)
    })
  })

  describe('#constructor()', () => {
    describe('with custom projection definitions', () => {
      let transformer = new SRSTranslator({
        'EPSG:5243': '+proj=lcc +lat_1=48.66666666666666 +lat_2=53.66666666666666 +lat_0=51 +lon_0=10.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      })

      it('should convert from custom projection', () => {
        chai.assert.deepEqual(
          transformer.forward([195927.24, 172450.97], 'EPSG:5243', 'WGS84'),
          [13.388888936536285, 52.5166670295793]
        )
      })
    })
  })

})
