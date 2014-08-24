var HarpaGameView = require('./HarpaGameView.js');
var HarpaScoreView = require('./HarpaScoreView.js');
var winston = require('winston');
var io = require('socket.io-client');
var Utils = require('../common/Utils.js').Utils;
var Game = require("../common/Game.js").Game;
var http = require('http');
var NanoTimer = require('nanotimer');
var fs = require("fs");

var front_patch = require('./patchdata/front-main-patch-2.js');
var side_patch = require('./patchdata/side-patch-1.js');

var INTERFACE_1_IP = "2.224.168.149";
var INTERFACE_2_IP = "2.145.222.186";
//var GAME_SERVER_IP = "http://127.0.0.1";
var GAME_SERVER_IP = "http://134.213.27.204";
// 
var active = true;




console.log("**************************************************");
console.log("*                                                *");
console.log("*                  HARPA PONG!                   *");
console.log("*                                                *");
console.log("*                 RENDER SERVER                  *");
console.log("*                                                *");
console.log("*  .-.     .-.     .-.     .-.     .-.     .-.   *");
console.log("*.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._*");
console.log("*                                                *");
console.log("**************************************************");
console.log("*                                                *");
console.log("*               2014 Owen Hindley                *");
console.log("*               github.com/owenhindley           *");
console.log("*                                                *");
console.log("**************************************************");
console.log("");
console.log('Starting...');

winston.add(winston.transports.File, { filename: 'render.log', handleExceptions : false });
winston.info("started renderer");

var gameView = new HarpaGameView(INTERFACE_1_IP, front_patch, 36, 11);
var scoreView = new HarpaScoreView(INTERFACE_2_IP, side_patch, 39, 9);

var game = Game.init();

var renderTimer = new NanoTimer();
renderTimer.setInterval(render.bind(this), '', '33m');

winston.info("connecting to game server at " + GAME_SERVER_IP + ":8081");

var gameSocket = io.connect(GAME_SERVER_IP + ':8081', {reconnect: true});
var gameMode = "wait";

gameSocket.on('connect', function(){

	winston.info("conected to game server!");

	gameSocket.on('identify', function() {
		winston.info("asked to identify by server");

		gameSocket.emit('remoterenderer', { name : "Harpa Renderer"});
	});

	gameSocket.on('render', onGameUpdate);

});

function onGameUpdate(data){

	gameMode = data.mode;
	game.setFromSerialised(data.data);

}


function render() {

	if (active){
		gameView.render(game, gameMode);
		scoreView.render(game, gameMode);
	}

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
				responseText = gameView.canvas.toDataURL();
			break;

			case "getScoreCanvasSource":
				responseText = scoreView.canvas.toDataURL();
			break;

			case "stop":
				active = false;
			break;

			case "start":
				active = true;
			break;

			case "blackout":
				gameView.blackout();
				scoreView.blackout();
				active = false;
			break;

			case "blind":
				gameView.blind();
				scoreView.blind();
				active = false;
			break;

		}


	}


    response.writeHead(200, { 
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin' : '*'
    });

    response.end(responseText);


});

server.listen(8088);

	