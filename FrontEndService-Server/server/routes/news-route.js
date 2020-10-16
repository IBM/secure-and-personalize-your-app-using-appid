const express = require('express');
const router = express.Router();

const NewsController = require('../controllers/news-controller');

router.get('', NewsController.getNews);
// define routes
// router.get('/', function(req,res){
//     console.log(__dirname);
//     res.sendFile(path.join(__dirname, '../views/financial-news.html'));
// });

router.get('/', function(req,res){

});

module.exports = router;



