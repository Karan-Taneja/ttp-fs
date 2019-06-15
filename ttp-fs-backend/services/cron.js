const CronJob = require('cron').CronJob;
const StockService = require('./events');

const job = new CronJob('00 45 09 * * *', () => {
    StockService.updateAllStocks()
    .catch(err => {
      console.log(err)
    })
}, null, true, 'America/New_York');

module.exports = job;