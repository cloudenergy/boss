const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const loginForm = q('#login-form')
const fundChannelChart = echarts.init(q('#fund-piechart'))

const DATA = [
  {name: '现金',
   value: 110
  },{
    name:'支付宝',
    value: 200
  },{
    name: '工商银行',
    value:20
  }, {
    name: '预付费代扣',
    value:80
  },{
    name: '微信',
    value: 73
  }
]

const configure = {
  title: {
    text: '支付渠道',
    x:'center'
  },
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data:[]
  },
  series: [{
    name: 'Sales',
    type: 'pie',
    radius : '55%',
    center: ['50%', '60%'],
    data: []
  }]
}

const lensSeries = r.lensPath(['series',0,'data'])
const lensLegend = r.lensPath(['legend', 'data'])

function drawFundChannelChart(api){
  return Observable.ajax({url: `${api}/v1.0/boss/fundChannels`,crossDomain:true, withCredentials: true}).map(({response}) => {
    let option = r.pipe(
      r.set(lensSeries, response),
      r.set(lensLegend, response.map(r.prop('name')))
    )(configure);
    fundChannelChart.setOption(option)
  })
}

module.exports = {drawFundChannelChart}
