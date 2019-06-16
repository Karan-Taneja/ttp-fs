const express = require('express');
const StockService = require('../services/stocks');
const stockRouter = express.Router();

stockRouter.post('/:symbol', (req, res, next) => {
  const { symbol } = req.params;
  StockService.addStock(symbol)
    .then(stock => {
      res.json({'stock': stock});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

stockRouter.get('/:symbol', (req, res, next ) => {
  const { symbol } = req.params;
  StockService.getStockBySymbol(symbol)
    .then(stock => {
      res.json({'stock': stock});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

stockRouter.get('/all', (req, res, next) => {
  StockService.getAllStocks()
    .then(stocks => {
      res.json({'stocks': stocks});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

module.exports = stockRouter;