const router = require('express').Router();
const model = require('../database/queries');
const jwt = require('jsonwebtoken');

router.get('/:userId', (req, res) => {
  // model.getUserSavedAuctions(req.params.userId)
  // .then((data) => {
  //   res.status(200).send(data);
  // })
  // .catch(err => {
  //   res.status(500).send(err);
  // });
});

router.post('/', (req, res) => {
 
  let authToken = req.headers.authorization.split(' ')[1];
  
  jwt.verify(authToken, process.env.jwtSecret, (err, decoded) => {
    if(err) {
      res.status(400).send('failed to save');
    }
    console.log('um');
    res.status(201).send('haha');

    // model.saveAuction(decoded.userId, req.body)
    // .then((data) => {
    //   res.status(201).send('succeed to save');
    // })
    // .catch(err => {
    //   res.status(400).send(err);
    // });
  });
});

module.exports = router;