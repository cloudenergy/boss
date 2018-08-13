import dateformat from 'dateformat'
const aDay = 86400000

export function nextDayOf(date) {
  let nextDayUnix = Date.parse(date) - 0 + aDay
  return dateformat(new Date(nextDayUnix), 'yyyy-mm-dd')
}
