const React = window.React = require('react')
const {map, append, partial, curry} = require('ramda')

var items = [{name: "one"}, {name: "two"}, {name: "three"}]

const addItem = function(item) {
  items = append(item, items)
  render()
}

const updateItem = function(item) {
  // need to identify it by id, then update it
  // or by key path, or whatever.
}

const TodoItem = React.createClass({
  render() {
    const item = this.props.item

    return <li>
      <input value={item} />
    </li>
  }
})

const TodoList = React.createClass({
  render() {
    const items = this.props.items
    const renderItem = i => <TodoItem item={i} />

    return <ul>
      {map(renderItem, items)}
    </ul>
  }
})

const TodoApp = React.createClass({
  render() {
    return <div>
      <h1>Items</h1>
      <TodoList items={this.props.items} />
      <button onClick={partial(addItem, {name: "woot"})}>Add Item</button>
    </div>
  }
})

// I want to add items easily

const App = React.createClass({
  render() {
    return <TodoApp items={items}/>
  }
})

function render() {
  React.render(
    <App/>,
    document.getElementById('content')
  )
}

render()
