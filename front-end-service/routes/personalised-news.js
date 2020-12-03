var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('personalised-news', { username: req.user.given_name, userFullName: req.user.name});
});

module.exports = router;
