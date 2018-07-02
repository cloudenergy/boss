const M = require('mustache')
const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const template = $('#topup-events-template').html()
M.parse(template)
const anchor = $('#topup-events')
const moment = require('moment')

const timeLens = r.lensProp('createdAt')
const view = r.compose(r.take(6), r.map(r.over(timeLens, t=>moment(t).fromNow())))

function drawTopupEvents(api) {
  return Observable
    .interval(60000)
    .startWith(0)
    .flatMap(()=>Observable
             .ajax({url: `${api}/v1.0/boss/flowEvent`,crossDomain:true, withCredentials: true})
             .map(({response}) => {
               return anchor.html(M.render(template, {topupEvents:view(response)}))
             }))}

module.exports = {drawTopupEvents}
