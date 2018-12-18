// config details
var CONFIG = require('./cloud/config.js');

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');


var api = new ParseServer({
	databaseURI: CONFIG.DATABASE_URI,
	cloud: CONFIG.CLOUD_CODE,
	appId: CONFIG.APP_ID,
	appName : CONFIG.APP_NAME,
	masterKey: CONFIG.MASTER_KEY,
	serverURL: CONFIG.SERVER_URL,
	publicServerURL : CONFIG.SERVER_URL,
	customPages: {
		//invalidLink: CONFIG.SERVER_URL + 'public/password-pages/invalid-link.html',
		//verifyEmailSuccess: CONFIG.SERVER_URL + 'public/password-pages/verify-email_success.html',
		choosePassword: CONFIG.PUBLIC_FILES_URL + '/password-pages/choose-password.html',
		passwordResetSuccess: CONFIG.PUBLIC_FILES_URL + '/password-pages/password-reset-success.html'
	}
});

// set parse dashboard
var ParseDashboard = require('parse-dashboard');
//parse dashboard
var dashboard = new ParseDashboard({
	"apps": [{
		"serverURL": CONFIG.SERVER_URL,
		"appId": CONFIG.APP_ID,
		"masterKey": CONFIG.MASTER_KEY,
		"appName": CONFIG.APP_NAME,
		"production" : CONFIG.PRODUCTION
	}],
	"users" : CONFIG.DASHBOARD_USERS
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// serve parse server from its mount folder
app.use('/1', api);

// server parse dashboard from its mount folder
app.use('/dashboard', dashboard);

// start the express server
var httpServer = require('http').createServer(app);
httpServer.listen(CONFIG.PORT, function() {
	console.log('running on port ' + CONFIG.PORT + '.');
});

// Parse Server plays nicely with the rest of your web routes
// app.get('/', function(req, res) {
//   res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
// });

// // There will be a test page available on the /test path of your server url
// // Remove this before launching your app
// app.get('/test', function(req, res) {
//   res.sendFile(path.join(__dirname, '/public/test.html'));
// });

// var port = process.env.PORT || 1337;
// var httpServer = require('http').createServer(app);
// httpServer.listen(port, function() {
//     console.log('parse-server-example running on port ' + port + '.');
// });

// // This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
