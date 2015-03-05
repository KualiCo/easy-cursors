
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

triggers when any cursor in the state is updated. Useful for calling render.

##### `offUpdate(callback:Function)`

##### `cursor():Cursor` 

get a cursor pointing to your state

##### `replace(data:Object)` 

replace the data and trigger updates. You don't normally need to call this. Instead, write data to a cursor

### Cursor


##### `get(key:string):Cursor`

##### `value:any`

##### `update(func:(val:T) => T))`

##### `delete()`

##### `toArray():[Cursor]`



    

  
