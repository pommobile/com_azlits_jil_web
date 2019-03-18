var expressStatic = require('express');
var express = expressStatic();
require('express-ws')(express);

// Return index.html to browser get request

express.get('/', function(request, response) {
	express.use(expressStatic.static(__dirname));
	response.sendFile('index.html', { root : __dirname});
});

// Send web socket message to browser on jil server post web service
// notification

var jsonParser = require('body-parser').json();
express.use(jsonParser);
var jsonParser = require('body-parser').json();
express.post('/web/rest/notify/:userId', jsonParser, function(request, response) {
	let userId = request.params["userId"];
	let webSocket = userIdsWebSockets.get(userId);
	if (webSocket != null) {
		let message = request.body.message;
		webSocket.send(message);
	}
	else
		console.warn("userId " + userId + " is not registered!");
	response.end();
});

var userIdsWebSockets = new Map();
var webSocketsUserIds = new Map();
express.ws('/web/websocket', function(webSocket, request) {

	// Register browser id and web socket on web socket message sent on
	// connection

	webSocket.on('message', function(userId) {
		userIdsWebSockets.set(userId, webSocket);
		webSocketsUserIds.set(webSocket, userId);
	});

	// Unregister browser id and web socket on web socket disconnection

	webSocket.on('close', function() {
		let userId = webSocketsUserIds.get(webSocket);
		if (userId != null)
			userIdsWebSockets.delete(userId);
		else
			console.warn("webSocket has no userId registered!");
		webSocketsUserIds.delete(webSocket);
	});
});

// Serve on get, post and web socket

express.listen(4200);