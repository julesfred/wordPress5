
// GLOBAL
exports.PORT = process.env.PORT || 1337;
exports.CLOUD_CODE = __dirname + '/main.js';

// Enviornment specific configs
if(process.env.API_ENV == 'production') {
	// PRODUCTION
	
} else {
	// DEVELOPMENT
	exports.APP_NAME = "happyhour";
	exports.APP_ID = "wiLht9rLaco2KoVxrj0r6EBx7id094ud";
	exports.MASTER_KEY = "A7OZhfe2uPrcFxWWfD87sjS0y4jszp03";
	exports.PRODUCTION = false;
	

	// different dev enviornments
	if(process.env.API_ENV == 'development') {
		exports.DATABASE_URI = "mongodb://apiuser:RbZ5F6aUJGvdvFVi89c5tfP8Q55K5vcV@ds243325.mlab.com:43325/happyhour";
		exports.SERVER_URL = "http://localhost:" + exports.PORT + "/1";
		exports.PUBLIC_FILES_URL = "http://localhost:" + exports.PORT + "/public";
		exports.DASHBOARD_USERS = [{
			"user" : "dashboard",
			"pass" : "password"
		}];
	} 
}

