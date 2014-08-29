// INCLUDES
var http = require('http');
var winston = require('winston');
var Utils = require('../common/Utils.js').Utils;

var QueueManager = require("./js/QueueManager.js").QueueManager;

// CONFIG
var WEB_SERVER_PORT = 8080;

var ALLOWED_IPS = [
    "89.160.129.139",
    "192.168.33.1",
    "86.186.133.89",
    "194.144.243.86"
];


// PREAMBLE

console.log("**************************************************");
console.log("*                                                *");
console.log("*                  HARPA PONG!                   *");
console.log("*                                                *");
console.log("*                QUEUEING SERVER                 *");
console.log("*                                                *");
console.log("*             ███▓▒░░._____.░░▒▓███              *");
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
winston.add(winston.transports.File, { filename: 'queue.log', handleExceptions : false });
winston.info("Started queue server");


// APP

var queueManager = QueueManager.init();
var gameSocket = null;

var server = http.createServer(function(request, response){

    var responseMessage = { status : "", message : "", data : {} };

    var queryComponents = Utils.parseQueryString(request.url);
    if (queryComponents["method"]){

        var method = queryComponents["method"];

        switch(method){

            case "join":

                var ip = request.headers['x-forwarded-for'] || 
                         request.connection.remoteAddress || 
                         request.socket.remoteAddress ||
                         request.connection.socket.remoteAddress;


                var newPlayerObj = queueManager.addWaiting(ip);

                responseMessage.data["id"] = newPlayerObj.id;
                responseMessage.message = "joined queue";
                responseMessage.status = "OK";

                winston.info("GUID %s joined queue", newPlayerObj.id);

            break;

            case "position":

                var guid = queryComponents["id"];
                if (guid){

                    var position = queueManager.playerPosition(guid);
                    
                    if (position == "a" || position == "b"){

                        winston.info("GUID %s joining game", guid);

                        responseMessage.status = "OK";
                        responseMessage.message = "Join Game";
                        responseMessage.data["playing"] = true;
                        responseMessage.data["playerId"] = position;
                        responseMessage.data["key"] = queueManager.currentGameKey;

                    } else if (position >= 0){

                        responseMessage.status = "OK";
                        responseMessage.message = "In Queue";
                        responseMessage.data["position"] = position;

                    } else {
                        responseMessage.status = "ERROR";
                        responseMessage.message = "Not in queue";
                        winston.info("GUID %s searched for but not in queue", guid);
                    }

                } else {
                    responseMessage.status = "ERROR";
                    responseMessage.message = "No GUID provided";
                }


            break;

            case "nextgame":

                

                var nextGameKey = queryComponents["key"];
                if (nextGameKey){
                    queueManager.currentGameKey = nextGameKey;
                    winston.info("setting current game key to " + nextGameKey);
                } else {
                    winston.error("no key found in nextgame call");
                }

                

                var players = queueManager.nextGame();

                responseMessage.status = "OK";

                if (players){                    
                    responseMessage.message = "players assigned for next game";

                } else{
                    winston.info("waiting on more players to connect");
                    responseMessage.message = "waiting on more players to connect";
                }



            break;

            case "debug":

                responseMessage.status = "OK";
                responseMessage.message = "debug data";
                responseMessage.data["queue"] = queueManager.queue;
                responseMessage.data["playing"] = queueManager.playing;


            break;

            case "checkip":

                var ip = request.headers['x-forwarded-for'] || 
                         request.connection.remoteAddress || 
                         request.socket.remoteAddress ||
                         request.connection.socket.remoteAddress;

                responseMessage.data["ip"] = ip;

                winston.info("check ip request from ", ip);

                var isAllowed = false;
                for(var i =0; i < ALLOWED_IPS.length; i++){
                    if (ALLOWED_IPS[i] == ip){
                        isAllowed = true;
                    }
                }

                responseMessage.status = isAllowed ? "OK" : "ERROR";
                responseMessage.message = isAllowed ? "Allowed" : "IP is not from allowed location";


            break;
        }

    } else {
        winston.info("invalid request url %s", request.url); 
        responseMessage.status = "ERROR";
        responseMessage.message = "invalid request url";       
    }


    response.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    response.end(JSON.stringify(responseMessage));


});

server.listen(8080);

