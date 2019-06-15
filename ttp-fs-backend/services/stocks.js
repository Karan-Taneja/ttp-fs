const db = require('./db');
const StockService = {};
module.exports = StockService;

StockService.getOpeningStockPrice = (symbol) => {
  return axios.get(`${baseUrl}/stock/${symbol}/ohlc?token=${process.env.IEX_API_KEY}`)
    .then(res => {
      return res.open.price;
    })
    .catch(err => {
      console.log(err);
    });
};

StockService.addStock = (symbol) => {
  StockService.getOpeningStockPrice(symbol)
    .then(open_price => {
      const now = new Date();
      return db.any('INSERT INTO stocks (symbol, open_price, updated) VALUES ($[symbol, $[open_price], $[now]) RETURNING *', { symbol, open_price, now })
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
    .then(symbols => {
      for(let symbol of symbols){
        const open_price = await StockService.getOpeningStockPrice(symbol);
        await StockService.updateStock(symbol, open_price);
      };
    })
    .catch(err => {
      console.log(err);
    })
};
