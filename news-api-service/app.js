require('dotenv').config();
var request = require('request');
var bodyParser = require('body-parser');
queryBuilder = require("./query-builder");
samples = require("./samples");

const port = process.env.PORT || 3002;

const express = require('express');
const passport = require('passport');
const APIStrategy = require("ibmcloud-appid").APIStrategy;

const app = express();
app.use(passport.initialize());

passport.use(new APIStrategy({
	oauthServerUrl: process.env.OAUTH_SERVER_URL,
	tenantId: process.env.TENANT_ID
}));

const userProfileManager = require("ibmcloud-appid").UserProfileManager;
userProfileManager.init({
	"oauthServerUrl": process.env.OAUTH_SERVER_URL,
	"profilesUrl": process.env.PROFILES_URL
});

// Serve static resources
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


// Create the service wrapper
const discovery = new DiscoveryV1({
	version: process.env.DISCOVERY_API_VERSION,
	authenticator: new IamAuthenticator({
		apikey: process.env.DISCOVERY_IAM_APIKEY,
	}),
	url: process.env.DISCOVERY_URL,
});


app.get("/generic-news", async function (req, res) {
	console.log("\ngeneric_query = " + JSON.stringify(samples.generic_query));
	var queryResponse = await invokeDiscovery(samples.generic_query);
	res.json(transformResponse(queryResponse));
});

app.get("/personalized-news", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), async function (req, res) {

	var accessToken = req.headers['authorization'].split(' ')[1];
	if (accessToken) {
		var options = {
			method: 'GET',
			url: process.env.USER_MGMT_SERVICE_URL,
			headers: {
				'Authorization': 'Bearer ' + accessToken,
				'Content-Type': 'application/json'
			}
		};

		request.get(options, async function (error, response, body) {
			if (error) throw new Error(error);
			attributes = response.body;
			console.log("Attributes - ");
			console.log(attributes);
			var query = await queryBuilder.getQuery(attributes);
			console.log("\nCustomized query = " + JSON.stringify(query));
			var queryResponse = await invokeDiscovery(query);
			res.json(transformResponse(queryResponse));
		});
	} else {
		res.sendStatus(403);
	}
});


async function invokeDiscovery(query) {
	const params = {
		...query,
		environmentId: process.env.ENVIRONMENT_ID,
		collectionId: process.env.COLLECTION_ID,
	};

	var response = await discovery.query(params, (error, response) => {
		if (error) {
			console.log("\n Error while invoking Discovery service" + error);
			throw new Error("Error while invoking Discovery service");
		}
	});
	return response.result;
}

function transformResponse(response) {
	var transformedResult = [];
	var results = response.results;
	console.log("results length = " + results.length);
	results.forEach(function (item) {
		var transformedItem = {};
		transformedItem.title = item.title;
		transformedItem.text = item.text;
		transformedItem.publication_date = item.publication_date;
		transformedItem.url = item.url;
		transformedItem.host = item.host;
		transformedItem.sentiment = item.enriched_text.sentiment.document.label;
		transformedResult.push(transformedItem);
	});
	return transformedResult;
}
// Start server
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});
