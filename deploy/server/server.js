// INCLUDES

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
console.log("*                  ༼ つ ◕_◕ ༽つ                   *")
console.log("*                                                *");
console.log("**************************************************");
console.log("*                                                *");
console.log("*               2014 Owen Hindley                *");
console.log("*               github.com/owenhindley           *");
console.log("*                                                *");
console.log("**************************************************");
console.log("");
console.log('Starting...');


// APP

var game = Game.init();
var gameManager = GameManager.init(game);

gameManager.startGame();

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

        console.log("* Controller registered : *");
        console.log("* " + playerId + " *");

        var newRemote = new RemotePlayer();
        newRemote.init(playerId, socket);

        gameManager.addRemotePlayer(newRemote);

    });

    // REGISTER MASTER CONTROLLER

    socket.on('mastercontroller', function(data) {

        console.log("* Master Controller registered : *");
        
        var newMaster = new MasterController();
        newMaster.init(socket);

        gameManager.addMaster(newMaster);

    });

    socket.on('remoterenderer', function(data){

        console.log("* Remote Renderer registered : *");

        var newRenderer = new RemoteRenderer();
        newRenderer.init(socket);

        gameManager.addRenderer(newRenderer);

    });



});