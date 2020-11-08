require('dotenv').config();
var bodyParser = require('body-parser');
queryBuilder = require("./query-builder");
samples = require("./samples");

const port = process.env.PORT || 3000;

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

app.post("/customized-news", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), function (req, res) {

	var accessToken = req.headers['authorization'].split(' ')[1];

	if (accessToken) {
		userProfileManager.getAllAttributes(accessToken).then(async function (attributes) {
			console.log("\nAttributes from App ID = " + JSON.stringify(attributes));

			if (req.body.fixed_attributes && req.body.fixed_attributes == true) {
				console.log("\nAttributes (not from App ID) = " + JSON.stringify(attributes));
			}
			var query = await queryBuilder.getQuery(attributes);
			console.log("\nCustomized query = " + JSON.stringify(query));
			var queryResponse = await invokeDiscovery(query);
			res.json(transformResponse(queryResponse));
		}).catch(function (error) {
			console.log("\nError getting custom attributes = " + error);
		});
	} else {
		res.sendStatus(403);
	}
});


app.post("/user-preferences", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), async function (req, res) {
	console.log("In Set User Preferences. Data to post is:")
	console.log(JSON.stringify(req.body));
	var accessToken = req.headers['authorization'].split(' ')[1];
	if (accessToken) {
		var sources = getPreferencesAsString(req.body.sources);
		var categories = getPreferencesAsString(req.body.categories);

		if( !sources && !categories ){
			// No preferences to set
			throw new Error("No preferences available");
		}

		if (sources) {
			var a = await setAttributes(accessToken, "sources", sources);
		}
		if (categories) {
			await setAttributes(accessToken, "categories", categories);
		}
		console.log("Done with setting attributes");
		res.sendStatus(200);
	} else {
		res.sendStatus(403);
	}
});

async function setAttributes(accessToken, attribType, attribs){
	await userProfileManager.setAttribute(accessToken, attribType, attribs).then(function (attributes) {
		console.log(attribType + " attributes is set");
		return;
	}).catch(function (error) {
		console.log("\nError setting custom attributes = " + error);
		next(error);
	});
}

function getPreferencesAsString(pref) {
	console.log("Preference is of type " + typeof pref);
	var prefString = null;
	if (pref) {
		if (typeof pref === 'string') {
			prefString = pref;
		} else {
			for (count = 0; count < pref.length; count++) {
				if (count == 0) {
					prefString = pref[0];
				} else {
					prefString = prefString + "," + pref[count];
				}
			}
		}
	}
	return prefString;
}

app.get("/user-preferences", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), function (req, res) {
	console.log("In Get User Preferences")
	var accessToken = req.headers['authorization'].split(' ')[1];

	if (accessToken) {
		userProfileManager.getAllAttributes(accessToken).then(async function (attributes) {
			console.log("\nAttributes to set = " + JSON.stringify(attributes));

			res.json(attributes);
		}).catch(function (error) {
			console.log("\nError getting custom attributes = " + error);
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


