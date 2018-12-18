// this is the endpoint to cancel a booking
Parse.Cloud.define("my-test-endpoint", function(request, response) {
	// set response
	let responseData = {
		a : 1,
		b : 2,
		c : 3
	};
	// success, return response
	response.success(responseData);
});