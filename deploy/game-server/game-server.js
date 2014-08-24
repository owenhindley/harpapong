// INCLUDES

var winston = require('winston');

var Game = require("../common/Game.js").Game;
var GameManager = require("./js/GameManager.js").GameManager;
var RemotePlayer = require("./js/RemotePlayer.js").RemotePlayer;
var RemoteRenderer = require("./js/RemoteRenderer.js").RemoteRenderer;
var MasterController = require("./js/MasterController.js").MasterController;

// PREAMBLE

console.log("**************************************************");
console.log("*                                                *");
console.log("*                  HARPA PONG!                   *");
console.log("*                                                *");
console.log("*                  ༼ つ ◕_◕ ༽つ                   *");
console.log("*                                                *");
console.log("**************************************************");
console.log("*                                                *");
console.log("*               2014 Owen Hindley                *");
console.log("*               github.com/owenhindley           *");
console.log("*                                                *");
console.log("**************************************************");
console.log("");
console.log('Starting...');

// LOGGING
winston.add(winston.transports.File, { filename: 'game.log', handleExceptions : false });
winston.info("Started game server");

// APP

var queueServerUrl = "127.0.0.1";
var game = Game.init();
var gameManager = GameManager.init(game, queueServerUrl);

gameManager.requestPlayers();

// START SERVER

var io = require('socket.io').listen(8081);

// io.set("origins = *");
// io.set("log level", 1); // reduce logging

io.sockets.on('connection', function (socket) {

    console.log("* Socket connceted *");

    socket.emit("identify", {});

    // REGISTER NORMAL PLAYERS

    socket.on('registercontroller', function(data) {

        var playerId = data.id;
        var playerKey = data.key;

        if (playerKey == gameManager.currentGameKey || playerKey == "magic"){

            console.log("* Controller registered : *");
            console.log("* " + playerId + " *");


            var newRemote = new RemotePlayer();
            newRemote.init(playerId, socket);

            gameManager.addRemotePlayer(newRemote);

        } else {

            console.log("* ERROR : player tried to join with the wrong game key : ", playerKey);
            socket.emit("reject", {});

        }

        

    });

    // REGISTER MASTER CONTROLLER

    socket.on('mastercontroller', function(data) {

        console.log("* Master Controller registered : *");
        
        var newMaster = new MasterController();
        newMaster.init(socket);

        gameManager.addMaster(newMaster);

    });

    socket.on('remoterenderer', function(data){

        console.log("* Remote Renderer registered : " + data.name + " *");

        var newRenderer = new RemoteRenderer();
        newRenderer.init(socket);

        gameManager.addRenderer(newRenderer);

    });



});