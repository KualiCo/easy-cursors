import assert from 'assert'

import * as cursors from '../src/index'

describe('state', function() {
  describe('.willUpdate', function() {
    it('allows the data to be transformed before the state is upated', function(done) {
      var state = cursors.state({foo: 'bar'})
      state.willUpdate(function(newData) {
        newData.beans = 'baz'
        return newData
      })

      state.onUpdate(function(newData) {
        assert.equal(newData.beans, 'baz')
        done()
      })

      var cursor = state.cursor()
      cursor.get('wat').value = 'it doesnt matter'
    })
  })
})
