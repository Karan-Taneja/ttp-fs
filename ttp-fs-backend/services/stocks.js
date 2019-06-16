const db = require('./db');
const StockService = {};
const baseUrl = 'https://cloud.iexapis.com/stable';
module.exports = StockService;

StockService.getOpeningStockPrice = (symbol) => {
  symbol = encodeURI(symbol);
  return axios.get(`${baseUrl}/stock/${symbol}/ohlc?token=${process.env.IEX_API_KEY}`)
    .then(res => {
      return res.open.price;
    })
    .catch(err => {
      console.log(err);
    });
};

StockService.getStockLogo = (symbol) => {
  symbol = encodeURI(symbol);
  return axios.get(`${baseUrl}/stock/${symbol}/logo?token=${process.env.IEX_API_KEY}`)
    .then(res => {
      return res.url;
    })
    .catch(err => {
      console.log(err);
    });
};

StockService.addStock = (symbol) => {
  let open_price;
  StockService.getOpeningStockPrice(symbol)
    .then(price => {
      open_price = price;
      return StockService.getStockLogo(symbol);
    })
    .then(logo => {
      const now = new Date();
      return db.any('INSERT INTO stocks (symbol, logo, open_price, updated) VALUES ($[symbol, $[logo], $[open_price], $[now]) RETURNING *', { symbol, logo, open_price, now })
    })
    .catch(err => {
      console.log(err);
    });
};

StockService.getStockBySymbol = (symbol) => db.one('SELECT * FROM stocks WHERE symbol = $[symbol]', { symbol });
StockService.getAllStocks = () => db.any('SELECT symbol FROM stocks');
StockService.updateStock = (symbol, open_price) => {
  const now = new Date();
  return db.any(`UPDATE stocks SET open_price = $[open_price], updated = $[now] WHERE symbol = $[symbol] RETURNING *`, { symbol, open_price, now })
};

StockService.updateAllStocks = async () => {
  StockService.getAllStocks()
    .then(async symbols => {
      for(let symbol of symbols){
        const open_price = await StockService.getOpeningStockPrice(symbol);
        await StockService.updateStock(symbol, open_price);
      };
    })
    .catch(err => {
      console.log(err);
    })
};
