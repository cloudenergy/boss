const M = require('mustache')
const {Observable} = require('rxjs/Rx')
const template = $('#income-summary-template').html()
M.parse(template)
const anchor = $('#income-summary')

const DATA = {response:{
  incomeSummary: [{
    name: '平台账户总金额',
    value: '99.18'
  },{
    name: '平台充值服务费',
    value: '100.99'
  },{
    name: '平台提现总金额',
    value: '9999.88'
  }]
}}

function drawIncomeSummary(api) {
  return Observable
    .of(DATA)
    // .ajax({url: `${api}/v1.0/boss/incomeSummary`,crossDomain:true, withCredentials: true})
    .map(({response}) => {
    return anchor.html(M.render(template, response))
  })
}

module.exports = {drawIncomeSummary}
