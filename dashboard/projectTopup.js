const M = require('mustache')
const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const template = $('#project-topup-template').html()
M.parse(template)
const anchor = $('#project-topup')

const view = r.addIndex(r.map)((val, index) => ({
  index,
  name: val.name,
  value: val.value
}))

function drawProjectTopup(api) {
  return Observable
    .ajax({url: `${api}/v1.0/boss/projectTopup`,crossDomain:true, withCredentials: true})
    .map(({response}) => {
      return anchor.html(M.render(template, {projectTopup:view(response)}))
  })
}

module.exports = {drawProjectTopup}
