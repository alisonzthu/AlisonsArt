const router = require('express').Router();
const model = require('../database/queries');
const jwt = require('jsonwebtoken');

router.get('/:userId', (req, res) => {
  res.status(200).send('got user saves');
});

router.post('/', (req, res) => {
 
  let authToken = req.headers.authorization.split(' ')[1];
  
  jwt.verify(authToken, process.env.jwtSecret, (err, decoded) => {
    if(err) {
      res.status(400).send('failed to save');
    }

    model.saveAuction(decoded.userId, req.body)
    .then((data) => {
      res.status(201).send('succeed to save');
    })
    .catch(err => {
      res.status(400).send(err);
    });
  });
});

module.exports = router;