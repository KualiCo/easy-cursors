
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

    var cursors = require('easy-cursors')

    var state = cursors.state({
      people: [{name: "bob"}]
    })

### State

##### `onUpdate(callback:Function)` 

Triggers when any cursor in the state is updated. Useful for calling render.

    state.onUpdate(render)

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


Best Practices
--------------

##### One cursor per component.

Your component should own one cursor. For example, a `<Person>` component could have a cursor to a person object. If person's have a `.name`, don't mess around with cursors to `.name`. Just unwrap your person object at the top, do whatever you want with it, and call update all at once. 

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
