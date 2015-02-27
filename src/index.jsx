const React = window.React = require('react')
const {Weeks} = require('./weeks')
const {EntriesWeeks} = require('./store')

var App = React.createClass({
  render() {
    return <Weeks entries={EntriesWeeks}/>
  }
})

React.render(
  <App/>,
  document.getElementById('content')
)

