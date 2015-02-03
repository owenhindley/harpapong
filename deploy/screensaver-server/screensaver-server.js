var zmq = require("zmq");
var http = require("http");
var NanoTimer = require('nanotimer');
var winston = require('winston');
var ScreensaverManager = require("./js/ScreensaverManager.js");
var fs = require("fs");
var Utils = require('../common/Utils.js').Utils;

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


var manager = new ScreensaverManager();
manager.addFace(36, 11); // front face
manager.addFace(39, 9);	// side face

/*
	RENDERING
*/


var renderTimer = new NanoTimer();
renderTimer.setInterval(render.bind(this), '', '33m');

var renderSock_to = zmq.socket("push");
var renderSock_from = zmq.socket("pull");

renderSock_to.bindSync(RENDER_SERVER_IP + ":3001");
renderSock_from.connect(RENDER_SERVER_IP + ":3000");

renderSock_from.on("message", function(msg){
	
	if (msg.toString() == "render"){

		var newBuffer = manager.getAllFaces();
		renderSock_to.send(newBuffer);

	}

});




// render loop
function render() {

	manager.render();

};




// DEBUGGING
//

// load debug page
var debugPage = "";
fs.readFile("./html/showCanvas.html", "utf8", function(err, data){

	if (err){
		console.log(err);
		return;
	}

	debugPage = data;

})


var server = http.createServer(function(request, response){

	var queryComponents = Utils.parseQueryString(request.url);

	var method = null;
	var responseText = "";

	if (queryComponents["method"]){

		method = queryComponents["method"];
		responseText = "called method : " + method;

		switch(method){

			case "getCanvas":

				responseText = debugPage;

			break;

			case "getGameCanvasSource":
				responseText = manager.faces[0].canvas.toDataURL();
			break;

			case "getScoreCanvasSource":
				responseText = manager.faces[1].canvas.toDataURL();
			break;

		}


	}


    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin' : '*'
    });

    response.end(responseText);


});

server.listen(8089);

