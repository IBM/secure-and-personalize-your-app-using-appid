// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var request = require("request");

const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid
const userProfileManager = require("ibmcloud-appid").UserProfileManager;
const Backend_Service_URL = "http://<ip>:<port>/generic-news";

const newsRoutes = require('./routes/news-route');
const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');

const app = express();
// const router = express.Router();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes and api calls
app.use('/', newsRoutes);
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

//App ID Code
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));

const config = {
	tenantId: "0f83edea-2f75-4526-8667-c8674ac9f924",
	clientId: "6dedc33d-7354-4a99-9869-dc5bde3c3dc2",
	secret: "ZDlhYzQ5ZWQtMjhhNS00Y2IwLWFiZjQtZWEyNTlkYTVmZmY2",
	oauthServerUrl: "https://us-south.appid.cloud.ibm.com/oauth/v4/0f83edea-2f75-4526-8667-c8674ac9f924",
  redirectUri: "http://localhost:3000/appid/callback",
  profilesURL: "https://us-south.appid.cloud.ibm.com"
}
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy(config));

// userProfileManager.init({
//   "oauthServerUrl": "https://us-south.appid.cloud.ibm.com/oauth/v4/0f83edea-2f75-4526-8667-c8674ac9f924",
//   "profilesUrl": "https://us-south.appid.cloud.ibm.com"
// });

// Get Finance News
app.get ('/getFinanceNews', function(req,res) {
  var options = {
    method : 'GET',
    url : Backend_Service_URL,
    body: {},
    json : true
  };
  request.get(options, function(error, response, body){
    console.log(JSON.stringify(response));
    res.status(response.statusCode).send(JSON.stringify(body));
    // res.json(response.body);
  });

});

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));
// app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req, res){
//   res.sendFile(path.join(__dirname, '../public', 'customAttr.html'));
// });

app.all('/custom', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req, res){ 
  // res.status(200).sendFile(path.join(__dirname, '../public', 'customAttr.html'));
  res.json({"Gender": "F"});
});

app.get("/saveCustomAttributes", passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req, res){
  console.log(req.session[WebAppStrategy.AUTH_CONTEXT].accessToken);
  var accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  //res.json(req.session[WebAppStrategy.AUTH_CONTEXT].accessToken);
  //res.json(req.session[WebAppStrategy.AUTH_CONTEXT]);
  // res.json(req.user);

  userProfileManager.init({
    "oauthServerUrl": "https://us-south.appid.cloud.ibm.com/oauth/v4/0f83edea-2f75-4526-8667-c8674ac9f924",
    "profilesUrl": "https://us-south.appid.cloud.ibm.com"
  });
  // get all attributes
  userProfileManager.getAllAttributes(accessToken).then(function (attributes) {
    console.log("\nAttributes (before storing your preferences): \n")
    console.log(attributes);
  });

  let name = "preferred_city";
  let value = "Bangalore";
  userProfileManager.setAttribute(accessToken, name, value).then(function (attributes) {
    // attributes returned as dictionary
    console.log("Setting attributes -", attributes);
    // get all attributes
    userProfileManager.getAllAttributes(accessToken).then(function (allAttributes) {
      console.log("\nAttributes (after storing your preferences): \n")
      console.log(allAttributes);
      // res.json(attributes);

      // Retrieve user info without validation
      userProfileManager.getUserInfo(accessToken).then(function (profile) {
        // retrieved user info successfully
        console.log("\nUserInfo: \n");
        console.log(profile);
        // res.json(profile);
        console.log("\nCalling Discovery Service for personalized news....");
        var options = {
          method : 'GET',
          url : "http://localhost:3001/api",
          body: {},
          headers: { authorization : 'Bearer ' + accessToken},
          json : true
        };
        request.get(options, function(error, response, body){
          console.log(JSON.stringify(response));
          res.status(response.statusCode).send(JSON.stringify(body));
          // res.json(response.body);
        });
      });
    });
  });

  

  // var options = {
  //   method : 'GET',
  //   url : "http://localhost:3001/api",
  //   body: {},
  //   headers: { authorization : 'Bearer ' + accessToken},
  //   json : true
  // };
  // request.get(options, function(error, response, body){
  //   console.log(JSON.stringify(response));
  //   res.status(response.statusCode).send(JSON.stringify(body));
  //   // res.json(response.body);
  // });
  // const tokenResponse = tokenManager.getApplicationIdentityToken();
  // console.log('Token response : ' + JSON.stringify(tokenResponse));
  // res.json(req.user.name);
});

app.get('/personalize', passport.authenticate(WebAppStrategy.STRATEGY_NAME), function(req, res) {
  res.status(200).sendFile(path.join(__dirname, '../public', 'preferences.html'));
});

// default path to serve up index.html (single page application)
app.get('/test', (req, res) => {
  // console.log(__dirname);
  res.status(200).sendFile(path.join(__dirname, '../public', 'financial-news.html'));
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
// https://<region>.appid.cloud.ibm.com/management/v4/<tenant-id>/users/<user_id>/profile \
// curl --request PUT \
// https://us-south.appid.cloud.ibm.com/management/v4/0f83edea-2f75-4526-8667-c8674ac9f924/users/41518756-c3f4-4563-823c-0437abb8579f/profile
// --header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcElkLTBmODNlZGVhLTJmNzUtNDUyNi04NjY3LWM4Njc0YWM5ZjkyNC0yMDIwLTA4LTI2VDA3OjQ5OjAyLjE1NyIsInZlciI6NH0.eyJpc3MiOiJodHRwczovL3VzLXNvdXRoLmFwcGlkLmNsb3VkLmlibS5jb20vb2F1dGgvdjQvMGY4M2VkZWEtMmY3NS00NTI2LTg2NjctYzg2NzRhYzlmOTI0IiwiZXhwIjoxNTk5NjUwNzAyLCJhdWQiOlsiNmRlZGMzM2QtNzM1NC00YTk5LTk4NjktZGM1YmRlM2MzZGMyIl0sInN1YiI6IjQxNTE4NzU2LWMzZjQtNDU2My04MjNjLTA0MzdhYmI4NTc5ZiIsImFtciI6WyJmYWNlYm9vayJdLCJpYXQiOjE1OTk2NDcxMDIsInRlbmFudCI6IjBmODNlZGVhLTJmNzUtNDUyNi04NjY3LWM4Njc0YWM5ZjkyNCIsInNjb3BlIjoib3BlbmlkIGFwcGlkX2RlZmF1bHQgYXBwaWRfcmVhZHVzZXJhdHRyIGFwcGlkX3JlYWRwcm9maWxlIGFwcGlkX3dyaXRldXNlcmF0dHIgYXBwaWRfYXV0aGVudGljYXRlZCJ9.qf_BcC3eSr3Rm4jBVJHhKs7t1M0ks0Qv-JavgiYkNGUnM6Gae6qqS3rQTUacHRGx7X0WR_XsRe7MO61ScKhSoo3i73G1loENz2EOXzJuYr1TGaMNEeGJ2axeUnl7oO3vwA-kI887LDC0BBOaFu2avzuv4K7HD6HceUCAgOv_oKqnLRsGTrfzi38SOXm8jxGUvO9MmnjepRf3LZLx_X5OPShazjB8Vo5ke7-iJMLxb65q5j-IZd903akK2r08NeSogtFFlFEUD0bjeDgErdPhx2cNm-3CV5JDMHJGpTOVpnoZ7CT2ZYsTE0Utb2uVMkk27boeF3Ojhk0ktYpj9_IS2A' \
// --header 'Content-Type: application/json' \
// -d '{
//  "profile": {
//    "attributes": {
//      “food-preference”: “vegetarian, glutten-free”
//    }
//  }
// }'