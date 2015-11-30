const {append, range, curry, compose, map, head, tail} = require("ramda")
const {EventEmitter} = require("events")


// API: CURSOR
  // cursor.value = x
  // cursor.value
  // cursor.update(func)  update value

  // cursor.get(key)      child cursor
  // cursor.get(keyPath)  child cursor

  // cursor.changedInLastUpdate()  boolean

  // cursor.toArray()     turn cursor to an array into array of cursors

export function state(data) {
  return new State(data)
}

export function cursor(data, keyPath, replace, getLastChangedKeyPath) {
  return new Cursor(data, keyPath, replace, getLastChangedKeyPath)
}

export class State {

  constructor(data) {
    this.data = data
    this._events = new EventEmitter()
    this.lastChangedKeyPath = []
    this._willUpdate = function(newData, keyPath) {
      return newData
    }
  }

  onUpdate(f) {
    this._events.on('update', f)
  }

  offUpdate(f) {
    this._events.off('update', f)
  }

  willUpdate(f) {
    this._willUpdate = f
  }

  cursor() {
    return cursor(this.data, [], this.replace.bind(this), this.getLastChangedKeyPath.bind(this))
  }

  replace(newData, keyPath) {
    newData = this._willUpdate(newData, keyPath)
    this.lastChangedKeyPath = keyPath
    this.data = newData
    this._events.emit('update', newData)
  }

  getLastChangedKeyPath() {
    return this.lastChangedKeyPath
  }
}

export class Cursor {

  constructor(data, keyPath, replace, getLastChangedKeyPath) {

    if (!data) throw new Error("Cursor missing data")
    if (!keyPath) throw new Error("Cursor missing keyPath")
    if (!replace) throw new Error("Cursor missing replace")
    if (!getLastChangedKeyPath) throw new Error("Cursor missing getLastChangedKeyPath")

    this._data = data
    this._keyPath = keyPath
    this._replace = replace
    this._getLastChangedKeyPath = getLastChangedKeyPath
  }

  changedInLastUpdate() {
    var myPath = this._keyPath
    var changedPath = this._getLastChangedKeyPath()
    return compareArrays(changedPath, myPath)
  }

  get(key) {
    return childCursor(this, key)
  }

  get value() {
    return value(this)
  }

  set value(val) {
    this._updateAndReplace(mutateUpdate(() => val))
  }

  update(f) {
    this._updateAndReplace(mutateUpdate(f))
  }

  delete() {
    this._updateAndReplace(mutateDelete)
  }

  _updateAndReplace(mutate) {
    var data = writeKeyPath(this._keyPath, this._data, mutate)
    this._replace(data, this._keyPath)
  }

  toArray() {
    const arrayCursors = compose(
      map(childCursor(this)),
      indices
    )
    return arrayCursors(this.value)
  }
}

export const value = function(cursor) {
  return readKeyPath(cursor._keyPath, cursor._data)
}

export const childCursor = curry(function(parent, key) {
  return cursor(parent._data, childKeyPath(key, parent._keyPath), parent._replace, parent._getLastChangedKeyPath)
})

function indices(arr) {
  var length = (arr) ? arr.length : 0
  return range(0, length)
}

function childKeyPath(key, parentKeyPath = []) {
  return append(key, parentKeyPath)
}

function readKeyPath(keyPath, data) {
  if (!keyPath) return data

  var value = keyPath.reduce(function(val, key) {
    return val && val[key]
  }, data)

  return value
}

// create a copy of data with the value changed at the key path
function writeKeyPath(keyPath, data, mutate) {
  const key = head(keyPath)
  const nextKeys = tail(keyPath)
  var parent = data

  if (!nextKeys.length) {
    // time to do the mutation! we're on the last one
    parent = mutate(parent, key)
  }

  else {
    // drill in and update the child
    var child = parent[key] || {}
    parent[key] = writeKeyPath(nextKeys, child, mutate)
  }

  return parent
}

const mutateUpdate = curry(function(f, parent, key) {
  parent[key] = f(parent[key])
  return parent
})

const mutateDelete = function(parent, key) {

  if (Array.isArray(parent)) {
    parent.splice(key, 1)
  }

  else {
    delete parent[key]
  }

  return parent
}

// should return true if one array is a subset of the other
var compareArrays = exports.compareArrays = function (arr, arr2) {
  return arr.reduce((memo, val, i) => {
    if (arr2[i] != val && arr2.length > i) return false
    return memo
  }, true)
}
