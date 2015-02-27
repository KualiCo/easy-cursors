const {groupBy, compose, range} = require('lodash')
const moment = require('moment')

// ENTRIES is a global variable exported in data.json so I can avoid cross domain issues
export const Entries = GLOBAL_ENTRY_DATA
export const EntriesWeeks = groupedWeeks(Entries)

export function groupedWeeks(entries) {
  return groupBy(entries, compose(formatDate, weekStartSunday, entryDate))
}

export function groupedDays(entries) {
  return groupBy(entries, entryDate)
}

export function lastWeekOfMonth(date) {
  return weekStartSunday(lastDayOfMonth(date))
}

export function weeksBack(start, n) {
  return range(0, n).reduce(function(weeks, x) {
    var nextDate = formatDate(moment(start).subtract(x * 7, 'days'))
    return weeks.concat([nextDate])
  }, [])
}

// make it a moment or clone it
function weekStartSunday(date) {
  var d = moment(date)
  return d.day(0)
}

function weekStartMonday(date) {
  var d = moment(date)
  var day = d.day()

  if (day === 0) {
    d = d.day(-6)
    return d
  }
  else {
    return d.day(1)
  }
}

function formatDate(dateMoment) {
  return dateMoment.format("YYYY-MM-DD") 
}

//function weeksBetween(start, end, startOfWeek) {
  //// returns all the moments for the weeks between the two dates
  //// assumes that it starts 
  //start = startOfWeek(start)
  //end = startOfWeek(end)
  //var weeks = []

  //while (start.unix() <= end.unix()) {
    //weeks.push(start)
    //start = moment(start).day(8)
  //}

  //return weeks
//}

function entryDate(e) { return e.date }
function lastDayOfMonth(m) { return m.endOf('month') }


