const express = require('express');
const TransactionService = require('../services/transactions');
const transactionRouter = express.Router();

transactionRouter.post('/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  const { stock_id, quantity, price_per_stock } = req.body;
  TransactionService.addTransaction(user_id, stock_id, quantity, price_per_stock)
    .then(transaction => {
      res.json({'transaction': transaction});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
})

transactionRouter.get('/:user_id', (req, res, next) => {
  const { user_id } = req.params;
  TransactionService.viewUsersTransactions(user_id)
    .then(transactions => {
      res.json({'transactions': transactions});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

module.exports = transactionRouter;