// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors')

const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid
const userProfileManager = require("ibmcloud-appid").UserProfileManager;
const Backend_Service_URL = "http://<ip>:<port>/generic-news";

const newsRoutes = require('./routes/news-route');
const preferencesRoutes = require('./routes/preferences-route');
const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');

const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static('public'));

// routes and api calls
app.use('/', newsRoutes);

app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);

//App ID Code
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));

const config = {
	tenantId: "",
	clientId: "",
	secret: "",
	oauthServerUrl: "",
  	redirectUri: "",
  	profilesURL: ""
}
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy(config));

app.use('/preferences', passport.authenticate(WebAppStrategy.STRATEGY_NAME), preferencesRoutes);
// Handle callback
// app.get('/preferences', passport.authenticate(WebAppStrategy.STRATEGY_NAME));


// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});


// Get Finance News
app.get ('/getFinanceNews', function(req,res) {
  console.log("in server - getFinanceNews");
  // var body = {};
  var news = [
    {
        "title": "Jennifer Lawrence in the COVID uniform in New York with husband Cooke Maroney",
        "text": "Credit: CBS 2 New York Duration: 02:19 Published 7 hours ago Remote learning will be the order of the day for the foreseeable future as health officials work to bring the infection rates in nine zip codes in Brooklyn and Queens down. CBS2's Ali Bauman reports Credit: CBS 2 New",
        "publication_date": "2020-10-06T19:51:00Z",
        "url": "https://www.onenewspage.com/n/Celebrities/1zlu610r9q/Jennifer-Lawrence-in-the-COVID-uniform-in-New.htm",
        "host": "onenewspage.com",
        "sentiment": "negative"
    },
    {
        "title": "Fortinet to Announce Third Quarter 2020 Financial Results",
        "text": "Fortinet to Announce Third Quarter 2020 Financial Results SUNNYVALE, Calif. - Oct 1, 2020 Fortinet announced that it will hold a conference call to discuss its third quarter 2020 financial results on Thursday, October 29 at 1:30 p.m. Pacific Time (4:30 p.m. Eastern Time).",
        "publication_date": "2020-10-01T13:00:00Z",
        "url": "http://feeds.feedburner.com/corporate/about-us/newsroom/press-releases/2020/fortinet-to-announce-third-quarter-2020-financial-results",
        "host": "feeds.feedburner.com",
        "sentiment": "positive"
    },
    {
        "title": "Fox News Paid Kimberly Guilfoyle's Former Assistant",
        "text": "The New Yorker reports Fox News paid up to $4 million to settle sexual harassment...",
        "publication_date": "2020-10-02T15:19:00-05:00",
        "url": "https://www.onenewspage.com/n/Front+Page/1zlu60yt9l/Fox-News-Paid-Kimberly-Guilfoyle-Former-Assistant.htm",
        "host": "onenewspage.com",
        "sentiment": "negative"
    }
];

  res.send(news);
  // var options = {
  //   method : 'GET',
  //   url : Backend_Service_URL,
  //   body: {},
  //   json : true
  // };
  // request.get(options, function(error, response, body){
  //   console.log(JSON.stringify(response));
  //   res.status(response.statusCode).send(JSON.stringify(body));
  //   // res.json(response.body);
  // });

});

// default path to serve up index.html (single page application)
// app.get('/test', (req, res) => {
//   // console.log(__dirname);
//   res.status(200).sendFile(path.join(__dirname, '../public', 'financial-news.html'));
// });

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
