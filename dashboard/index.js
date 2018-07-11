const {drawFundChannelChart} = require('./fundChannel')

const API = process.env.API_URI || 'http://127.0.0.1:8000'
const {drawIncomeSummary} = require('./incomeSummary')
const {drawTopupTrendChart} = require('./topupTrend')
const {drawProjectTopup} = require('./projectTopup')
const {drawTopupEvents} = require('./topupEvents')
const {Observable} = require('rxjs/Rx')

Observable.merge(
  drawFundChannelChart(API), drawIncomeSummary(API),
  drawTopupTrendChart(API), drawProjectTopup(API),
  drawTopupEvents(API),
).subscribe(result => console.debug('updated view:', result),
  error => {
    console.error(JSON.stringify(error))
    if (error.status === 401) {
      location.href = '/login'
    }
  })
