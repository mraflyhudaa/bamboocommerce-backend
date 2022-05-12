var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/userposttest', (req, res, next) => {
  const username = req.body.username;
  res.send('Your username is ' + username);
});

module.exports = router;
