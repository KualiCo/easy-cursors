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

console.log(' - Paths should only match if one array is a subset of the other')
try {
  for (var i = 0; i < tests.length; ++i) {
    var test = tests[i]
    assert(cursors.compareArrays(path, test.path) == test.result, i)
  }
} catch (e) {
  throw Error('Failed on test ' + e.message)
}

console.log(' - compareArrays should also work if parameters are reversed')
try {
  for (var i = 0; i < tests.length; ++i) {
    var test = tests[i]
    assert(cursors.compareArrays(test.path, path) == test.result, i)
  }
} catch (e) {
  throw Error('Failed on test ' + e.message)
}

console.log('Success!!')
