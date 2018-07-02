const M = require('mustache')
const {Observable} = require('rxjs/Rx')
const template = $('#income-summary-template').html()
M.parse(template)
const anchor = $('#income-summary')
const {currency} = require('./utils')

const view = ({sum, withdraw, fee, arrears}) => {
  return {incomeSummary: [{
    name: '平台账户总金额',
    value: currency(sum)
  },{
    name: '平台充值服务费',
    value: currency(fee)
  },{
    name: '平台提现总金额',
    value: currency(withdraw)
  },{
    name: '平台欠费租户金额',
    value: currency(arrears[0].value)
  },{
    name: '平台欠费租户数量',
    value: arrears[0].count
  }]}
}

function drawIncomeSummary(api) {
  return Observable
    .ajax({url: `${api}/v1.0/boss/incomeSummary`,crossDomain:true, withCredentials: true})
    .map(({response}) => {
      return anchor.html(M.render(template, view(response)))
  })
}

module.exports = {drawIncomeSummary}
