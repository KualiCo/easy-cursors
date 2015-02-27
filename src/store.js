const {groupBy, compose, range} = require('lodash')
const moment = require('moment')

// ENTRIES is a global variable exported in data.json so I can avoid cross domain issues
export const Entries = GLOBAL_ENTRY_DATA
export const EntriesWeeks = groupedWeeks(Entries)

export var dateFormat = "YYYY-MM-DD"

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
  return range(0, n).map(function(x) {
    return moment(start).subtract(x * 7, 'days')
  })
}

export function weekDates(date) {
  return range(0, 7).map(function(x) {
    return moment(date).add(x, 'days')
  })
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

export function formatDate(dateMoment, format = dateFormat) {
  return dateMoment.format(format)
}


function entryDate(e) { return e.date }
export function lastDayOfMonth(m) { return moment(m).endOf('month') }


