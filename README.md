[![Build Status](https://travis-ci.org/KualiCo/easy-cursors.svg?branch=master)](https://travis-ci.org/KualiCo/easy-cursors)
Easy Cursors
------------

Use cursors without dealing with Immutable-JS. easy-cursors defines a simple
cursor API for use with normal objects. Designed to use with React, but you
can use it anywhere!

_What are cursors?_ Cursors are like an address to some field inside a big data
structure. By passing a cursor to a react component, that component can both
read and write to the data without having to drill down event handlers.


Installation
------------

    npm install --save easy-cursors

Example
-------

See [index.jsx](./example/index.jsx) in the example directory.

Usage
-----

    var cursors = require('easy-cursors')
    var React = require('react')

    var state = cursors.state({
      message: "hello, world"
    })

    var App = React.createClass({
      render: function() {
        var cursor = this.props.cursor
        var message = cursor.value

        // change the value of your cursor, which will cause onUpdate to trigger
        // then App.render gets called with a fresh cursor
        function onChange(e) {
          cursor.value = e.target.value
        }

        return <div>
          <input value={message} onChange={onChange} />
        </div>
      }
    })

    function render() {
      React.render(
        <App cursor={state.cursor().get('message')}/>,
        document.getElementById('content')
      )
    }

    render()

    // this will fire every time anything in the state changes
    state.onUpdate(render)

API
---

##### `state(data:Object):State`

Create a state object with starting data.

    var cursors = require('easy-cursors')

    var state = cursors.state({
      people: [{name: "bob"}]
    })

### State

##### `onUpdate(callback:Function)`

Triggers when any cursor in the state is updated. Useful for calling render.

    state.onUpdate(render)

##### `willUpdate(callback: Function)`

Registers a function to be called just before the state will be updated.
The function will be called with the new state and the path that changed.
The state will be updated to be whatever the function returns.

```JavaScript
state.willUpdate(function(newData, path) {
  // whenever the `foo` key changes, we also want to change `bar`
  if (path[0] == 'foo') {
    newData.bar = newData.foo
  }
  return newData
})
```

##### `offUpdate(callback:Function)`

Remove the listener

    state.offUpdate(render)

##### `cursor():Cursor`

Get a cursor pointing to your state. To point to properties of your state, see `.get` below.

    function render() {
      React.render(
        <App cursor={state.cursor()} />
        document.getElementById('content')
      )
    }

##### `replace(data:Object)`

Replace the data and trigger updates. You don't normally need to call this. Instead, write data to a cursor

### Cursor

##### `get(key:string):Cursor`

Returns a cursor pointing to a child property

    render: function() {
      var cursor = this.props.cursor
      return <div>
        <People cursor={cursor.get('people'} />
      </div>
    }

##### `getPath(keyPath:string | Array<string>):Cursor`

Returns a cursor pointing to a child property, addressable by a
dot-separated path string, or an array of strings.

    render: function() {
      var cursor = this.props.cursor
      return <div>
        <Name cursor={cursor.get('person.name')} />
      </div>
    }

or

    render: function() {
      var cursor = this.props.cursor
      return <div>
        <Name cursor={cursor.get(['person', 'name'])} />
      </div>
    }

##### `value:any` Property

Render the value of a cursor:

    var cursor = this.props.cursor
    var person = cursor.value
    return <div>Name: {person.name}</div>

Set the value of a cursor:

    function onChange(e) {
      cursor.value = {name: e.target.value}
    }

##### `update(func:(val:T) => T))`

Set the value of a cursor with a pure updating function. The function will be passed the current value of the cursor and should return the new value.

    function onChange(e) {
      cursor.update(function(person) {
        var newPerson = copy(person)
        newPerson = e.target.value
        return newPerson
      })
    }

##### `delete()`

Delete the cursor from its parent. Works on arrays and objects.

    function onDelete() {
      cursor.delete()
    }

##### `changedInLastUpdate():boolean`

Tells you whether or not your cursor's keyPath was updated. Useful for creating efficient shouldComponentUpdate functions.

    shouldComponentUpdate(nextProps) {
      return nextProps.cursor.changedInLastUpdate()
    }

##### `toArray():[Cursor]`

Turn a cursor pointing to an array into an array of cursors pointing to the children

    var content = itemsCursor.toArray().map(function(cursor) {
      var item = cursor.value
      return <TodoItem cursor={cursor} key={item.id} />
    })


Best Practices
--------------

##### One cursor per component. Unwrap your cursor early

Your component should own one cursor. For example, a `<Person>` component could have a cursor to a person object. If person's have a `.name`, don't mess around with cursors to `.name`. Just unwrap your person object at the top, and stick with normal data objects everywhere.

    render: function() {

      // unwrap the value right away
      var cursor = this.props.cursor
      var person = cursor.value

      // don't use cursor.get('name') here, unless you're passing it to another component
      return <div>{person.name}</div>
    }

##### Update all at once.

Only call `update` or `set value` once. If you need to set multiple properties you can do them all at once with `update`. As soon as you call either, your data is stale and the app refreshes.

    function onChangeName(e) {

      cursor.update(function(person) {
        // do whatever you want to manipulate person, just make sure you return the new version
        person.firstName = e.target.value
        person.fullName = fullName(person)
        return person
      })

      // don't call update again! it has stale data now
    }
