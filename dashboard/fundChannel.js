import r from 'ramda'
import 'whatwg-fetch'
const fundChannelChart = echarts.init(document.getElementById('fund-piechart'));
const logiModal = $('#login-modal')
const option = {
  title: {
    text: '支付渠道'
  },
  tooltip: {},
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
fetch('http://127.0.0.1:8081/api/v1.0/login',{
  method: 'POST',
  body: JSON.stringify({
    username: 'admin100',
    password: '5f4dcc3b5aa765d61d8327deb882cf99',
  })
}).then(response=>{
  loginModal.set({show: false})
})
  .catch(e=>console.error(e))

fundChannelChart.setOption(option)
