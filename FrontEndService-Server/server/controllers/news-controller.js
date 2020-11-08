
const path = require('path');

exports.getNews = (req, res) => {
    console.log('In controller - getNews');
    console.log(__dirname);
    res.sendFile(path.join(__dirname, '../views/financial-news.html'));
  };