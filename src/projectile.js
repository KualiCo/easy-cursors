const {partial, append, range, curry, compose, map} = require("ramda")
const {EventEmitter} = require("events")


// API: CURSOR
  // cursor.value = x
  // cursor.value
  // cursor.update(func)  update value

  // cursor.get(key)      child cursor
  // cursor.get(keyPath)  child cursor

  // TODO try to make any cursor act enumerable? naw...
  // cursor.toArray()     turn cursor to an array into array of cursors

export function projectile(data) {
  return new State(data)
}

export function cursor(data, keyPath) {
  return new Cursor(data, keyPath)
}

export class State {

  constructor(data) {
    this._data = data
    this._events = new EventEmitter()
  }

  onUpdate(f) {
    this._events.on('update', f)
  }

  offUpdate(f) {
    this._events.off('update', f)
  }

  cursor() {
    return new Cursor(this._data)
  }
}


export class Cursor {

  constructor(data, keyPath = []) {
    this._data = data
    this._keyPath = keyPath
  }

  get(key) {
    return childCursor(this._data, this._keyPath, key)
  }

  get value() {
    return value(this)
  }

  set value(val) {
    return this.update(() => val)
  }

  update(f) {
    console.log("UPDATE", f)
  }

  toArray() {
    const arrayCursors = compose(
      map(childCursor(this._data, this._keyPath)),
      indices
    )
    return arrayCursors(this.value)
  }
}

//const toArray = compose(, indices)

export const value = function(cursor) {
  //console.log("VALUE", cursor)
  return read(cursor._keyPath, cursor._data)
}

export const childCursor = curry(function(data, keyPath, key) {
  //console.log("childCursor", data, keyPath, key)
  return cursor(data, childKeyPath(key, keyPath))
})

function indices(arr) {
  return range(0, arr.length)
}

function childKeyPath(key, parentKeyPath = []) {
  return append(key, parentKeyPath)
}

function read(keyPath, data) {
  //console.log("READ", data, keyPath)
  if (!keyPath) return data

  var asdf = keyPath.reduce(function(val, key) {
    //console.log("get", key, val, val && val[key])
    return val && val[key]
  }, data)

  //console.log("ASDF", asdf)

  return asdf
}
