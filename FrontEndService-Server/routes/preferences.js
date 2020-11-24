var express = require('express');
var router = express.Router();

var newsSources =  ["Deccan Herald", "WallStreet Journal", "NY Times", "Business Wire"];
var newsSourcesURL =  ["deccanherald.com", "wsj.com", "nytimes.com", "businesswire.com"];
var areas = ["Personal Finance", "Corporate Finance", "Equity", "Mutual Funds", "Bonds", "Quaterly Results", "Insurance related"];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('preferences', { username: req.user.given_name, sources: newsSources, sourcesURL: newsSourcesURL, categories: areas});
});

module.exports = router;