require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
var cfenv = require("cfenv");
var app = express();

// get the app environment from Cloud Foundry
var APPLICATION_URL = process.env.APPLICATION_URL;
var appEnv = cfenv.getAppEnv();
if (appEnv.isLocal) {
  console.log("Application is not running in Cloud Foundry, hence reading APPLICATION URL from the environment.");
  APPLICATION_URL = process.env.APPLICATION_URL;
} else {
  console.log("Application is running in Cloud Foundry environment.");
  console.log("APPLICATION URL: ", appEnv.url);
  APPLICATION_URL = appEnv.url;
}

//appid
const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid

app.use(session({
	secret: '123456',
	resave: true,
    saveUninitialized: true
}));

const config = {
	tenantId: process.env.TENANT_ID,
	clientId: process.env.CLIENT_ID,
	secret: process.env.SECRET,
	oauthServerUrl: process.env.OAUTH_SERVER_URL,
  redirectUri: APPLICATION_URL + process.env.CALLBACK_URL,
  profilesURL: process.env.PROFILES_URL
}

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy(config));

//app id end

var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');
var preferenceRouter = require('./routes/preferences');
var persnoalisedNewsRouter = require('./routes/personalised-news');
var updatePreferenceRouter = require('./routes/update-preferences');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', newsRouter);
app.use('/preferences', preferenceRouter);
app.use('/personalised-news', persnoalisedNewsRouter);
app.use('/update-preferences', updatePreferenceRouter);
app.use('/users', usersRouter);

//app id

app.get(process.env.CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// app.get('/personalize', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
//                                                 successRedirect: LANDING_PAGE_URL})
// );

app.get('/personalize', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function (req,res) {

  let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  console.log("\n@server - In personalize function (after social sign-in) - ");
  console.log("\nUserName: ", req.user.name);
  // console.log("Access token: ", accessToken);

  var options = {
    method : 'GET',
    url : process.env.CHECK_USER_PREFERENCES_URL,
    headers: {
      'Authorization': 'Bearer '+ accessToken,
      'Content-Type': 'application/json'
    }    
  };
  console.log("\nCalling User management service... ");
  request.get(options, function(error, response, body){
    console.log("\nResponse StatusCode from User Management Service: ", response.statusCode);
    if (response.statusCode == 200) {
      console.log("\nUser has logged-in before, hence returning personalized news using existing preferences...\n");
      res.redirect('/personalised-news');
    } else {
      console.log("\nUser is logging-in first time, hence redirecting to provide the preferences for personalization..")
      res.redirect('/preferences');
    }
  });
});

app.post("/set-preferences", passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req, res){
  console.log("\n@ server - in set-preferences function");
  // console.log(req.session[WebAppStrategy.AUTH_CONTEXT].accessToken);
  console.log(JSON.stringify(req.body));

  if (JSON.stringify(req.body) === '{}'){
    console.log("\nNo preferences were provided, asked again to provide.\n");
    res.redirect('/preferences');
  } else {
      let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
      // console.log("\nAccess token: ", accessToken);
      var options = {
        method : 'POST',
        url : process.env.USER_MGMT_SERVICE_URL,
        headers: {
          'Authorization': 'Bearer '+ accessToken,
          'Content-Type': 'application/json'
        },
        body: req.body,
        json : true
      };
      request.post(options, function(error, response, body){
        // console.log(response);
        console.log("\nUser preferences has been set/updated, redirecting to personalized news...\n");
        res.redirect('/personalised-news');
      });
  }
});

app.get('/update-preferences', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req,res){
  res.redirect('/preferences');
})

app.get('/logout', function(req,res){
  console.log("in logout...\n",req);
  WebAppStrategy.logout(req);
  console.log("\nUser has logged-out!")
  res.redirect('/');
})
//app id end

// Get Finance News
app.get ('/getFinanceNews', function(req,res) {
  console.log("\n@server - in getFinanceNews function");

  var options = {
    method : 'GET',
    url : process.env.NEWS_SERVICE_URL,
    json : true
  };
  console.log("\nCalling News API powered by Watson Discovery Service...");
  request.get(options, function(error, response, body){
    if (error) {
      console.log(JSON.stringify(error));
      res.json({"message":"Error"});
    } else {
      console.log("\nLoading the news result.. ");
      // console.log(JSON.stringify(body));
      console.log("\nNews Result Length:",body.length);
      res.status(response.statusCode).send(body);
    }
  });
});

// Get Personalised Finance News
app.get ('/getPersonalisedFinanceNews', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req,res) {
  console.log("\n@server - in getPersonalisedFinanceNews function...");
  
  let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  // console.log("Access token: ", accessToken);
  var options = {
    method : 'GET',
    url : process.env.PERSONALISED_NEWS_URL,
    headers: {
      'Authorization': 'Bearer '+ accessToken,
      'Content-Type': 'application/json'
    },
    json : true
  };
  console.log("\nCalling News API powered by Watson Discovery Service...");
  request.get(options, function(error, response, body){
    if (error) {
      console.log(JSON.stringify(error));
      res.json({"message":"Error"});
    } else {
      console.log("\nLoading the personalized news result... ");
      // console.log(JSON.stringify(body));
      console.log("\nNews Result Length:",body.length);
      res.status(response.statusCode).send(body);
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
