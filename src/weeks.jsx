const React = require('react')
const {weeksBack, lastWeekOfMonth, EntriesWeeks} = require('./store')
const moment = require("moment")


// TODO: get the current month (hmm, and a sneak peek of the next month, hmm)
// back 8 weeks

export var Weeks = React.createClass({
  render() {
    const {entries} = this.props
    //const weeks = groupByWeek(entries)
    const weeks = weeksBack(lastWeekOfMonth(moment()), 8)
    console.log("WEEKS", weeks)
    console.log("ASDF", entries)

    // now, you can be magical

    return <div>ENTRIES: {entries.length}</div>
  }
}) 

export var Week = React.createClass({
  render() {
    return <div>Week</div>
  }
})
