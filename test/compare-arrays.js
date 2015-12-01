var assert = require('assert')
var cursors = require('../src')

var path = ['foo', 'bar', 'baz']

var tests = [
  { result: true, path: ['foo', 'bar'] },
  { result: true, path: ['foo', 'bar', 'baz', 'thing'] },
  { result: true, path: ['foo', 'bar', 'baz'] },
  { result: false, path: ['foo', 'notha'] },
  { result: false, path: ['foo', 'bar', 'bazbeans'] },
  { result: true, path: [] },
  { result: false, path: [''] },
  { result: false, path: ['', 'foo', 'bar', 'baz'] },
  { result: false, path: ['baz', 'bar', 'foo'] },
  { result: false, path: ['foo', 'b'] },
  { result: false, path: ['aoeu', 'htns'] },
  { result: false, path: ['foobarbaz'] },
]

describe('cursors', function() {
  describe('.compareArrays', function() {
    it('only matches paths if one array is a subset of the other', function() {
      tests.forEach(t => {
        assert(cursors.compareArrays(path, t.path) == t.result, t)
      })
    })

    it('works if parameters are reversed', function() {
      tests.forEach(t => {
        assert(cursors.compareArrays(t.path, path) == t.result, t)
      })
    })
  })
})
