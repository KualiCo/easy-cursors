const React = window.React = require('react')
const {map, append, partial, curry, compose} = require('ramda')
const shortid = require('shortid')
const {projectile} = require('./projectile')

//console.log("WOOO", projectile)


// STATE --------------------------------------------------------

// returns a state object, and automatically creates sub-cursors
// state.sub('items') = cursor to items
// state.sub('items').sub(0) = cursor to items[0]. 

const state = projectile({
  items: [
    {id: 1, name: "one"}, 
    {id: 2, name: "two"}, 
    {id: 3, name: "three"}],
})


// state.cursor() returns current cursor

// API: CURSOR
  // cursor.value = x
  // cursor.value
  // cursor.update(func)  update value

  // cursor.get(key)      child cursor
  // cursor.get(keyPath)  child cursor

  // cursor.toArray()     turn cursor to an array into array of cursors


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
      // should cursors be able to delete themselves?
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

    // hmm, now this is challening
    const renderItem = function(cursor) {
      return <TodoItem cursor={cursor} key={cursor.value.id}/>
    }

    // can I make any cursor ACT like an array instead?
    // I should try
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
      <h1>Items</h1>
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

