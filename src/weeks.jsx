const React = require('react')
const Store = require('./store')
const {weeksBack, lastWeekOfMonth, EntriesWeeks, formatDate} = Store
const moment = require("moment")


// TODO: get the current month (hmm, and a sneak peek of the next month, hmm)
// back 8 weeks

var DayWidth = 120

export var Weeks = React.createClass({
  render() {
    const {entries} = this.props
    //const weeks = groupByWeek(entries)
    const weeks = weeksBack(lastWeekOfMonth(moment()), 20)
    console.log("WEEKS", weeks)
    console.log("ASDF", entries)

    const content = weeks.reverse().map(function(date) {
      return <Week date={date} key={date}/>
    })

    const style = {
      margin: 10,
    }

    return <div style={style}>
      {content}
    </div>
  }
}) 

export var Week = React.createClass({
  render() {
    const {date} = this.props
    const dates = Store.weekDates(date)
    const content = dates.map(function(d) {
      return <Day date={d} key={d} />
    })

    const style = {
      width: DayWidth * 7+3,
    }

    return <div style={style}>
      {content}
    </div>
  }
})

export var Day = React.createClass({
  render() {
    const {date} = this.props

    var borderRight = 0
    var borderBottom = 0

    if (moment(date).add(1, 'day').get('month') > date.get('month')) {
      borderRight = 2
    }

    if (moment(date).add(7, 'day').get('month') > date.get('month')) {
      borderBottom = 2
    }

    const style = {
      display: 'inline-block',
      width: DayWidth,
      height: DayWidth,
      border: 'solid 1px black',
      borderRightWidth: borderRight,
      borderBottomWidth: borderBottom
    }

    // If day + 7 is a different month, then you want to change the border
    // ooooh ok!


    var format = "D"

    if (date.get('date') === 1 || date.get('date') === Store.lastDayOfMonth(date).get('date')) {
      format = "MMM D"
    }

    return <div style={style}>
      <span style={{fontSize: 'smaller', paddingLeft: 4}}>{date.format(format)}</span>
    </div>
  }
})
