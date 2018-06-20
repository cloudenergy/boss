const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const loginForm = q('#login-form')
const fundChannelChart = echarts.init(q('#fund-piechart'))
const loginModal = $('#login-modal')

const option = {
  title: {
    text: '支付渠道'
  },
  legend: {
    data:['支付宝','微信']
  },
  series: [{
    name: 'Sales',
    type: 'pie',
    radius : '55%',
    center: ['50%', '60%'],
    data: []
  }]
}

const lensData = r.lensPath(['series','data'])

function drawFundChannelChart(){
  Observable.ajax("http://").map(result => {
    let option = r.set(lensData, result.response)
    fundChannelChart.setOption(option)
  })
}

module.exports = {drawFundChannelChart}
