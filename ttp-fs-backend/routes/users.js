const express = require('express');
const UserService = require('../services/users');
const userRouter = express.Router();

userRouter.post('/', (req, res, next) => {
  const { email } = req.body;
  UserService.addUser(email)
    .then(user => {
      res.json({'user': user});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

userRouter.get('/:email', (req, res, next) => {
  const { email } = req.params;
  UserService.getUserByEmail(email)
    .then(user => {
      res.json({'user': user});
    })
    .catch(err => {
      res.status(404).json({'err': err});
    });
});

userRouter.put('/:email', (req, res, next) => {
  const { email } = req.params;
  const { funds } = req.body;
  UserService.updateUserFunds(email, funds)
  .then(user => {
    res.json({'user': user});
  })
  .catch(err => {
    res.status(404).json({'err': err});
  });
});

module.exports = userRouter;