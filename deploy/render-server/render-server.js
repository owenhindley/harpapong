var HarpaGameView = require('./HarpaGameView.js');
var winston = require('winston');
var io = require('socket.io-client');
var Utils = require('../common/Utils.js').Utils;
var Game = require("../common/Game.js").Game;
var http = require('http');
var NanoTimer = require('nanotimer');

var front_patch = require('./patchdata/front-main-patch-1.js');

var INTERFACE_IP = "2.224.168.149";
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

var view = new HarpaGameView(INTERFACE_IP, front_patch, 36, 12);
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

		gameSocket.emit('remoterenderer', {});
	});

	gameSocket.on('render', onGameUpdate);

});

function onGameUpdate(data){

	gameMode = data.mode;
	game.setFromSerialised(data.data);

}


function render() {

	if (active)
		view.render(game, gameMode);

};

// DEBUGGING
// 

var server = http.createServer(function(request, response){

	var queryComponents = Utils.parseQueryString(request.url);

	var method = null;

	if (queryComponents["method"]){

		method = queryComponents["method"];

		switch(method){

			case "getCanvas":


			break;

			case "stop":
				active = false;
			break;

			case "start":
				active = true;
			break;

			case "blackout":
				view.blackout();
			break;

			case "blind":
				view.blind();
			break;

		}


	}


    response.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    response.end("Called method " + method);


});

server.listen(8088);

	