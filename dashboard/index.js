const {drawFundChannelChart} = require('./fundChannel')

const API = process.env.API_URI || 'http://127.0.0.1:8000'
const {drawIncomeSummary} = require('./incomeSummary')
const {drawTopupTrendChart} = require('./topupTrend')
const {Observable, Subscriber} = require('rxjs/Rx')

const subscriber = Subscriber.create(result=>console.debug("updated view:", result),
                                     error=>console.error(error))

drawFundChannelChart(API).subscribe(subscriber)
drawIncomeSummary(API).subscribe(subscriber)
drawTopupTrendChart(API).subscribe(subscriber)
