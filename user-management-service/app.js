require('dotenv').config();
var bodyParser = require('body-parser');

const port = process.env.PORT || 3001;

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


app.post("/user-preferences", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), async function (req, res) {
	console.log("In Set User Preferences. Data to post is:")
	//req.body = {"sources":["Deccan Herald","NY Times"],"categories":["Corporate Finance","Bonds"]}
	console.log(JSON.stringify(req.body));
	var accessToken = req.headers['authorization'].split(' ')[1];
	if (accessToken) {
		console.log("req.body.sources = " + req.body);
		var sources = getPreferencesAsString(req.body.sources);
		var categories = getPreferencesAsString(req.body.categories); 

		if( !sources && !categories ){
			// No preferences to set
			throw new Error("No preferences available");
		}

		if (sources) {
			try {
				await setAttributes(accessToken, "sources", sources);
			  } catch(err) {
				
			  }
			
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



app.get("/is-user-preferences-set", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), function (req, res) {
	console.log("In Get User Preferences")
	var accessToken = req.headers['authorization'].split(' ')[1];

	if (accessToken) {
		userProfileManager.getAllAttributes(accessToken).then(async function (attributes) {
			if( attributes && (attributes.categories || attributes.sources) ){
				res.sendStatus(200);
			}else{
				res.sendStatus(201);
			}

		}).catch(function (error) {
			console.log("\nError getting custom attributes = " + error);
		});
	} else {
		res.sendStatus(403);
	}
});

app.get("/user-preferences", passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false }), function (req, res) {
	console.log("In Get User Preferences")
	var accessToken = req.headers['authorization'].split(' ')[1];

	if (accessToken) {
		userProfileManager.getAllAttributes(accessToken).then(async function (attributes) {
			if( !attributes ){
				attributes = {};
				attributes.categories=[];
				attributes.sources=[];
			}else {
				if( attributes.categories ){
					var categoriesArr = attributes.categories.split(",");
					attributes.categories = categoriesArr;
				}else{
					attributes.categories=[];
				}
				if( attributes.sources ){
					var sourcesArr = attributes.sources.split(",");
					attributes.sources = sourcesArr;
				}else{
					attributes.sources=[];
				}
			}
			res.json(attributes);

		}).catch(function (error) {
			console.log("\nError getting custom attributes = " + error);
		});
	} else {
		res.sendStatus(403);
	}
});


// Start server
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});

