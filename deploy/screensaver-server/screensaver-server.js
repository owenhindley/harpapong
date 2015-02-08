var AppConfig = require("../common/Config.js");

var zmq = require("zmq");
var http = require("http");
var NanoTimer = require('nanotimer');
var winston = require('winston');
var ScreensaverManager = require("./js/ScreensaverManager.js");
var fs = require("fs");
var Utils = require('../common/Utils.js').Utils;
var AudioDataInterface = require("./js/AudioDataInterface.js");

var RENDER_SERVER_IP = "tcp://127.0.0.1";



console.log("**************************************************");
console.log("*                                                *");
console.log("*                  HARPA PONG!                   *");
console.log("*                                                *");
console.log("*               SCREENSAVER SERVER               *");
console.log("*                                                *");
console.log("*  .-.     .-.     .-.     .-.     .-.     .-.   *");
console.log("*.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._*");
console.log("*                                                *");
console.log("**************************************************");
console.log("*                                                *");
console.log("*               2015 Owen Hindley                *");
console.log("*               github.com/owenhindley           *");
console.log("*                                                *");
console.log("**************************************************");
console.log("");
console.log('Starting...');

/*
	Manager, looks after starting / stopping child processes
*/


var manager = new ScreensaverManager();
manager.addFace(38,13) 	// front face
manager.addFace(39, 9);	// side face

// all the visualisers we want to include
var vis = require("./config.js");

for (var i=0; i< vis.length; i++)
	manager.addVisualiser(vis[i]);

// temp cycle through visualisers
var currentVisualiserIndex = 0;
var cycleVisualiserTimeout = -1;
function nextVisualiser() {

	console.log(" *&*&*& cycling to next visualiser *&*&*& ");

	manager.selectVisualiser(currentVisualiserIndex);

	cycleVisualiserTimeout = setTimeout(nextVisualiser, 30 * 1000);
	
	currentVisualiserIndex++;
	if (currentVisualiserIndex > vis.length) currentVisualiserIndex = 0;


}

nextVisualiser();


// manager.selectVisualiser(1);

// process.on("exit", onExit);
// process.on("SIGINT", onExit);
// process.on("uncaughtException", onExit);


function onExit(err) {
	if (err){

		console.log(err);
	}

	console.log("** Screensaver exiting, cleaning up... **");
	manager.cleanup();
	process.exit();
}

/*
	AUDIO DATA
*/

var audioDataInterface = new AudioDataInterface();
audioDataInterface.init(AppConfig.PORT_OSC_RECEIVE, AppConfig.PORT_AUDIO_DATA_PUB);

/*
	RENDERING
*/


var renderSock_to = zmq.socket("push");
var renderSock_from = zmq.socket("pull");

renderSock_to.bindSync(RENDER_SERVER_IP + ":3001");
renderSock_from.connect(RENDER_SERVER_IP + ":3000");

renderSock_from.on("message", function(msg){
	
	if (msg.toString() == "render"){

		manager.render();
		var newBuffer = manager.getAllFaces();
		renderSock_to.send(newBuffer);

	}

});






// DEBUGGING



var debugSocketServer = require('socket.io').listen(8090);

debugSocketServer.on("connection", function(socket){

	console.log("** Debug socket connected **");

	var subscribeSocket = zmq.socket("sub");
	subscribeSocket.connect("tcp://127.0.0.1:" + AppConfig.PORT_AUDIO_DATA_PUB);

	socket.on('disconnect', function() {
		subscribeSocket.disconnect("tcp://127.0.0.1:" + AppConfig.PORT_AUDIO_DATA_PUB);
	});

	subscribeSocket.subscribe("tempoBang");
	subscribeSocket.subscribe("rmsLevel");
	subscribeSocket.subscribe("fft");
	subscribeSocket.subscribe("loudnessChange");

	subscribeSocket.on("message", function(subject, message){
		socket.emit("message", { 
			type : "audioData", 
			channel : subject.toString(),
			data : message.toString()
		 });
	});

	socket.on('getImage', function() {
		socket.emit("debugImage", manager.getDebugCanvas());
	});

	// send available visualisers
	socket.emit("visData", vis);

	socket.on("switchVisualiser", function(data){
		manager.selectVisualiser(data);
	});

	socket.on("startCycle", function() {
		console.log("** SCREENSAVER CYCLE STARTED **");
		nextVisualiser();
	});

	socket.on("stopCycle", function() {
		console.log("** SCREENSAVER CYCLE STOPPED **");
		clearTimeout(cycleVisualiserTimeout);
	});

	socket.on("updateConfig", function() {

		console.log("*** UPDATING SCREENSAVER CONFIG ** ");

		delete require.cache[require.resolve("./config.js")];
		vis = require("./config.js");

		manager.resetVisData();
		for (var i=0; i< vis.length; i++){
			manager.addVisualiser(vis[i]);
		}

		this.currentVisualiserIndex = 0;
		clearTimeout(cycleVisualiserTimeout);
		

		socket.emit("visData", vis);
	});

});

var debugServer = http.createServer(function(request, response){

	var queryComponents = Utils.parseQueryString(request.url);

	var method = null;
	var responseText = "";

	if (queryComponents["method"]){

		method = queryComponents["method"];
		responseText = "called method : " + method;

		switch(method){

			case "debug":

				responseText = fs.readFileSync("./html/debugViewScreensaver.html", "utf8");

			break;

			case "selectVisualiser":

				var aWhich = parseInt(queryComponents["index"]);
				currentVisualiserIndex = aWhich;
				manager.selectVisualiser(aWhich);

			break;

			case "getDebugImage":
				responseText = manager.getDebugCanvas();
			break;

		}


	}


    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin' : '*'
    });

    response.end(responseText);


});

debugServer.listen(8089);

