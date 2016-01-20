import assert from 'assert'

import * as cursors from '../src/index'

describe('cursor', function() {
  describe('.getPath', function() {
    it('gets a subcursor by a dot-separated string', function() {
      var state = cursors.state({foo: {bar: 1}})
      var cursor = state.cursor()
      var sub = cursor.getPath('foo.bar')

      cursor.value = 1
    })

    it('gets a subcursor by a dot-separated string', function() {
      var state = cursors.state({foo: {bar: 1}})
      var cursor = state.cursor()
      var sub = cursor.getPath(['foo', 'bar'])

      cursor.value = 1
    })
  })
})
