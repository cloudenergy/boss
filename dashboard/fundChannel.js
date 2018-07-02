const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const qa = document.querySelectorAll.bind(document)
const fundChannelChart = echarts.init(q('#fund-piechart'))
const {currency} = require('./utils')
const DATA = {
  today:[
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
  ],
  month:[
  {name: '现金',
   value: 11
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
  ],year:[
    {
      name: '现金',
      value: 110
    },{
      name: '微信转账',
      value: 100,
    },{
    name:'支付宝',
    value: 20
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
}


const configure = {
  title: {
    text: '收入详情分析图',
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
    name: '收入',
    type: 'pie',
    radius : '55%',
    center: ['50%', '60%'],
    data: []
  }]
}

const lensSeries = r.lensPath(['series',0,'data'])
const lensLegend = r.lensPath(['legend', 'data'])

const cashCatergory = ['现金','银行转账','POS刷卡','其他','支票','账扣','冲正','微信转账']

const aggregateCashCatergory = r.map(
  r.pipe(
    r.groupBy(
      r.pipe(
        r.prop('name'),
        r.ifElse(
          r.flip(r.contains)(cashCatergory),
          r.always('现金'),
          r.identity))),
    r.map(r.compose(r.sum, r.map(r.prop('value')))),
    r.toPairs,
    r.filter(([key,val])=>key!='现金'),
    r.map(([key,val])=>({name: key, value: currency(val)})),
  ))

function drawFundChannelChart(api){
  return Observable
    // .of({response: DATA})
    .ajax({url: `${api}/v1.0/boss/fundChannels`,crossDomain:true, withCredentials: true})
    .map(r.prop('response'))
    .map(aggregateCashCatergory)
    .flatMap(response => {
      return Observable.from(qa('#fund-piechart-controls label'))
        .flatMap(n => Observable.fromEvent(n, 'click'))
        .map(e=>e.target.querySelector('input').value)
        .startWith('today')
        .map(timespan=>{
          let option = r.pipe(
            r.set(lensSeries, response[timespan]),
            r.set(lensLegend, response[timespan].map(r.prop('name')))
          )(configure);
          fundChannelChart.setOption(option)
          return option
        })
    })
}

module.exports = {drawFundChannelChart}
