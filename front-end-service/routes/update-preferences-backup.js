var express = require('express');
var router = express.Router();
var request = require('request');

var newsSources =  ["Deccan Herald", "WallStreet Journal", "NY Times", "Business Wire"];
var newsSourcesURL =  ["deccanherald.com", "wsj.com", "nytimes.com", "businesswire.com"];
var areas = ["Personal Finance", "Corporate Finance", "Equity", "Mutual Funds", "Bonds", "Quaterly Results", "Insurance related"];

const GET_USER_ATTRIBUTES_SERVICE_URL = "https://appid-backend-user-mgmt-shy-platypus-pb.eu-gb.mybluemix.net/user-preferences";

/* GET home page. */
router.get('/', function(req, res, next) {
  let accessToken = req.session.APPID_AUTH_CONTEXT.accessToken;
  var options = {
    method : 'GET',
    url : GET_USER_ATTRIBUTES_SERVICE_URL,
    headers: {
      'Authorization': 'Bearer '+ accessToken,
      'Content-Type': 'application/json'
    }
  };
  console.log("\nCalling User management service to get user attributes... ");
  request.get(options, function(error, response, body){
    console.log("\nAlready set preferences: ", response.statusCode);
    var attributes = {
      "sources": ["deccanherald.com"],
      "categories": ["Personal Finance","Mutual Funds","Insurance related"]
    };
    let selectedNewsSources = [] ;
    let selectedAreas = [];
    let i=0;
    let setSources = attributes.sources;
    let setCategories = attributes.categories;

    for (i=0; i<= newsSourcesURL.length; i++) {
      if (setSources.indexOf(newsSourcesURL[i]) > -1 ){
        selectedNewsSources.push(1);
      } else {
        selectedNewsSources.push(0);
      }
    }
    console.log("\nselectedNewsSources: ", selectedNewsSources);

    for (i=0; i<= areas.length; i++) {
      if (setCategories.indexOf(areas[i]) > -1 ){
        selectedAreas.push(1);
      } else {
        selectedAreas.push(0);
      }
    }
    console.log("\selectedAreas: ", selectedAreas);

    res.render('update-preferences', { username: req.user.given_name, sources: newsSources, 
      sourcesURL: newsSourcesURL, selectedSources: selectedNewsSources, 
      categories: areas, selectedCategories: selectedAreas});
  });
});

module.exports = router;