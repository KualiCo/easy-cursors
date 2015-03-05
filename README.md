
Easy Cursors
------------

Use cursors without dealing with Immutable-JS. easy-cursors defines a simple cursor API for use with normal objects. Designed to use with React. 

_What are cursors?_ Cursors are like an address to some field inside a big data structure. By passing a cursor to a react component, that component can both read and write to the data without having to drill down event handlers. 


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

        // you can set the value of your cursor
        // which will cause onUpdate to trigger
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

### State

##### `onUpdate(callback:Function)` 

Triggers when any cursor in the state is updated. Useful for calling render.

##### `offUpdate(callback:Function)`

##### `cursor():Cursor` 

Get a cursor pointing to your state

##### `replace(data:Object)` 

Replace the data and trigger updates. You don't normally need to call this. Instead, write data to a cursor

### Cursor

##### `get(key:string):Cursor`

Returns a cursor pointing to a child property

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

##### `toArray():[Cursor]`

Turn a cursor pointing to an array into an array of cursors pointing to the children

    var content = itemsCursor.toArray().map(function(cursor) {
      var item = cursor.value
      return <TodoItem cursor={cursor} key={item.id} />
    })



    

  
