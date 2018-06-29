const r = require('ramda')
const {Observable} = require('rxjs/Rx')
const q = document.querySelector.bind(document)
const topupTrendChart = echarts.init(q('#topupt-trend'))

const DATA = {response: [
  {time:'2018-03-15 18:00', name:'随寓公寓',value:6000},
  {time:'2018-03-16 13:00', name:'随寓公寓',value:1200},
  {time:'2018-04-09 11:00', name:'随寓公寓',value:100000},
  {time:'2018-06-07 22:00', name:'随寓公寓',value:200}
]}

const configure = {
  title: {
    text: '充值金额',
    x:'center'
  },
    tooltip : {
        trigger: 'axis'
    },
    xAxis : [
        {
            type : 'time',
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'充值',
            type:'bar',
            data:[]
        }
    ]
}
const xaxisLens = r.lensPath(['xAxis', 'data'])
const seriesLens = r.lensPath(['series', 0, 'data'])

function drawTopupTrendChart(api){
  return Observable
    .ajax({url: `${api}/v1.0/boss/topupTrend`,crossDomain:true, withCredentials: true})
    .map(({response})=>{
      let option = r.pipe(
        r.set(seriesLens, response.map(r.prop('value'))),
        r.set(xaxisLens, response.map(r.prop('time'))),
      )(configure)
      topupTrendChart.setOption(option)
      return option
    })
}
module.exports = {drawTopupTrendChart}
