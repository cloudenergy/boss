const {drawFundChannelChart} = require('./fundChannel')

const API = process.env.API_URI || 'http://127.0.0.1:8000'
const {drawIncomeSummary} = require('./incomeSummary')
const {Observable} = require('rxjs/Rx')

Observable.merge(
  drawFundChannelChart(API),
  drawIncomeSummary(API)
).subscribe(result=>console.debug("updated view:", result),
            error=>console.error(error))
