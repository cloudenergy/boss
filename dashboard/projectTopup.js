const M = require('mustache')
const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const template = $('#project-topup-template').html()
M.parse(template)
const anchor = $('#project-topup')
const {currency} = require('./utils')

const view = r.addIndex(r.map)((val, index) => ({
  index: index +1,
  name: val.name,
  value: currency(val.value) + '元'
}))

function drawProjectTopup(api) {
  return Observable
    .ajax({url: `${api}/v1.0/boss/projectTopup`,crossDomain:true, withCredentials: true})
    .map(({response}) => {
      return anchor.html(M.render(template, {projectTopup:view(response)}))
  })
}

module.exports = {drawProjectTopup}
