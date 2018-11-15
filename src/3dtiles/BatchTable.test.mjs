import assert from 'assert'
import BatchTable from './BatchTable.mjs'

describe('BatchTable', function () {
  describe('#addFeature()', function () {
    it('should throw on duplicate ID', function () {
      let table = new BatchTable()
      table.addFeature('feature1', {foo: 12})

      assert.throws(() => {
        table.addFeature('feature1', {foo: 13})
      }, /already exists/)
    })
  })

  describe('#addFeature()', function () {
    it('should throw on duplicate ID, once string, once integer', function () {
      let table = new BatchTable()
      table.addFeature('2', {foo: 12})

      assert.throws(() => {
        table.addFeature(2, {foo: 13})
      }, /already exists/)
    })
  })

  describe('#getIds()', function () {
    it('should return all IDs', function () {
      let table = new BatchTable()
      table.addFeature('feature1', {foo: 12, bar: 'bar1'})
      table.addFeature('feature2', {foo: 44})
      table.addFeature('feature3', {foo: 99, bar: 'bar3'})

      assert.deepEqual(table.getIds(), ['feature1', 'feature2', 'feature3'])
    })
  })

  describe('#getPropertyNames()', function () {
    it('should return all property names', function () {
      let table = new BatchTable()
      table.addFeature('feature1', {foo: 12, bar: 'bar1'})
      table.addFeature('feature2', {foo: 44})
      table.addFeature('feature3', {foo: 99, bar: 'bar3'})

      assert.deepEqual(table.getPropertyNames(), ['foo', 'bar'])
    })
  })

  describe('#getBatchTableJson()', function () {
    it('should return a valid batch table', function () {
      let table = new BatchTable()
      table.addFeature('feature1', {foo: 12, bar: 'bar1'})
      table.addFeature('feature2', {foo: 44})
      table.addFeature('feature3', {foo: 99, bar: 'bar3'})

      assert.deepEqual(table.getBatchTableJson(),
        {
          foo: [12, 44, 99],
          bar: ['bar1', null, 'bar3'],
          id: ['feature1', 'feature2', 'feature3'],
        })
    })
  })

  describe('#getLength()', function () {
    it('should return the number of features', function () {
      let table = new BatchTable()
      table.addFeature('feature1', {foo: 12, bar: 'bar1'})
      table.addFeature('feature2', {foo: 44})
      table.addFeature('feature3', {foo: 99, bar: 'bar3'})

      assert.equal(table.getLength(), 3)
    })
  })

  describe('#getMinMax()', function () {
    it('should return the minimum and maximum values of numeric properties', function () {
      let table = new BatchTable()
      table.addFeature('feature4', {foo: 4, bar: 44, str: 'str4'})
      table.addFeature('feature1', {foo: 1, bar: 'str11', str: 'str1'})
      table.addFeature('feature2', {foo: 2})
      table.addFeature('feature3', {foo: 3, bar: 33, str: 'str3'})

      assert.deepEqual(table.getMinMax(), {
        foo: {minimum: 1, maximum: 4},
        bar: {minimum: 33, maximum: 44},
      })
    })
  })
})
