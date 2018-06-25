const {drawFundChannelChart} = require('./fundChannel')

const API = process.env.API_URI || 'http://127.0.0.1:8000'

drawFundChannelChart(API).subscribe((result)=>console.log(result), error=>console.error(error))
