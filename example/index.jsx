const React = window.React = require('react')
const {map, append, partial, curry, compose} = require('ramda')
const shortid = require('shortid')
const cursors = require('../index')

// STATE --------------------------------------------------------

const state = cursors.state({
  items: [
    {id: 1, name: "one"}, 
    {id: 2, name: "two"}, 
    {id: 3, name: "three"}],
})


// VIEW -------------------------------------------------------

const TodoItem = React.createClass({
  render() {

    // BEST PRACTICE: unwrap the cursor immediately, don't use sub-cursors unless passing to another component
    const cursor = this.props.cursor
    const item = cursor.value

    function onChange(e) {
      cursor.update(setName(e.target.value))

      // also works, but would voilate best practice. Don't play with inner cursors!
      // set or update the entire cursor you own all at once
      // cursor.get('name').value = e.target.value
    }

    function onDelete() {
      // cursors can delete themselves!
      cursor.delete()
    }

    // other ways of writing the same thing
    // I'm not sure it's helpful to create change functions like this
    // it's probably always clearer to define a callback above
    // maybe: cursor.makeUpdate()
    // const onChange2 = compose(cursor.update, setName, eventValue)

    return <li>
      <input value={item.name} onChange={onChange}/>
      <a onClick={onDelete}> Delete</a>
    </li>
  }
})

const TodoList = React.createClass({
  render() {
    const cursor = this.props.cursor

    const renderItem = function(cursor) {
      return <TodoItem cursor={cursor} key={cursor.value.id}/>
    }

    // call .toArray() to convert Cursor<[]> to [Cursor]
    return <ul>
      {map(renderItem, cursor.toArray())}
    </ul>
  }
})

const TodoApp = React.createClass({
  render() {
    const cursor = this.props.cursor
    const items = cursor.value
    const onAdd = function() {
      cursor.update(addItem(emptyItem()))
    }

    return <div className="row small-12 columns">
      <h1>Demo</h1>
      <button onClick={onAdd}>Add Item</button>
      <TodoList cursor={cursor} />
    </div>
  }
})

// I want to add items easily
const App = React.createClass({
  render() {
    return <TodoApp cursor={state.cursor().get('items')}/> }
})

function render() {
  React.render(
    <App/>,
    document.getElementById('content')
  )
}

render()
state.onUpdate(render)




// HELPERS --------------------------------------------------------
// notice that none of these deal with cursors. They're all functions
// that just deal with data, and are immutable-style

const addItem = curry(function(item, items) {
  return append(item, items)
})

const emptyItem = function() {
  return {id: shortid.generate(), name: ""}
}

const setName = curry(function(value, item) {
  item.name = value
  return item
})

const eventValue = function(e) {
  return e.target.value
}

