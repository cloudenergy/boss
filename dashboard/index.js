const {drawFundChannelChart} = require('./fundChannel')

const API = process.env.API_URI || 'http://127.0.0.1:8000'
const {drawIncomeSummary} = require('./incomeSummary')
const {drawTopupTrendChart} = require('./topupTrend')
const {drawProjectTopup} = require('./projectTopup')
const {drawTopupEvents} = require('./topupEvents')
const {Observable} = require('rxjs/Rx')


drawFundChannelChart(API).subscribe(result=>console.debug("updated view:", result),
                                     error=>console.error(error))
drawIncomeSummary(API).subscribe(result=>console.debug("updated view:", result),
                                     error=>console.error(error))
drawTopupTrendChart(API).subscribe(result=>console.debug("updated view:", result),
                                     error=>console.error(error))
drawProjectTopup(API).subscribe(result=>console.debug("updated view:", result),
                                     error=>console.error(error))
drawTopupEvents(API).subscribe(result=>console.debug("updated view:", result),
                                     error=>console.error(error))
