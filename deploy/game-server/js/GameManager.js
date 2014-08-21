(function(global){

	var winston = require('winston');
	var http = require('http');
	var NanoTimer = require("nanotimer");
	var EventEmitter = require('events').EventEmitter;

	var MAX_SCORE = 5;
	var JOIN_TIMEOUT = 10000;

	var MODE_WAIT = "wait";
	var MODE_GAME = "game";
	var MODE_GOAL = "goal";

	
	
	var GameManager = {

		timer : null,
		game : null,
		players : {},
		master : null,
		renderers : [],
		events : new EventEmitter(),
		mode : MODE_WAIT,

		queueServer : null,
		lastUpdate : 0,
		gamePlaying : false,
		gamePaused : false,

		joinTimeoutId : -1,

		init : function(game, queueServer){

			this.queueServer = queueServer;
			this.game = game;

			timer = new NanoTimer();

			timer.setInterval(this.update.bind(this), '', '33m');

			return this;

		},

		requestPlayers : function() {

			this.mode = MODE_WAIT;

			this._callQueueServer("nextgame", function(response){

				var responseObj = JSON.parse(response);


			});

		},

		startGame : function() {

			winston.info("starting game..");

			for (var idx in this.players){
				this.players[idx].start();
			}

			clearTimeout(this.joinTimeoutId);

			this.game.startGame(this.onGoal.bind(this), this.onReflect.bind(this));

			this.mode = MODE_GAME;

			this.gamePlaying = true;
			this.gamePaused = false;

		},

		endGame : function() {

			winston.info("Game ended, scores : ", this.game.scores);

			for (var idx in this.players){
				this.players[idx].removeAllListeners("position");
				this.players[idx].finish(this.game.scores);
			}

			this.gamePlaying = false;
			this.gamePaused = false;

			this.players = {};

			// wait for a while before requesting new players
			setTimeout(this.requestPlayers.bind(this), 5000);

		},

		addRemotePlayer : function(player){

			var playerId = player.playerId;
			this.players[playerId] = player;
			player.on("position", function(data) {
				//console.log("* Game Manager : position from player " + data.id + " : " + data.position);
				this.game.setPlayerPosition(data.id, data.position);
			}.bind(this));


			if (this.players["a"] && this.players["b"])
				this.startGame();
			else {
				this.joinTimeoutId = setTimeout(this.endGame.bind(this), JOIN_TIMEOUT);
			}
		},

		addMaster : function(master){


		},

		addRenderer : function(renderer){
			this.renderers.push(renderer)

		},


		update : function() {


			var dt = Date.now() - this.lastUpdate;

			if (this.gamePlaying && !this.gamePaused){
				this.game.update(dt);

				if (this.game.scores.a >= MAX_SCORE || this.game.scores.b >= MAX_SCORE){
					this.endGame();
				}
			}

			this.render();

			this.lastUpdate = Date.now();

		},

		onGoal : function() {

			winston.info("GOOOOOOAL!");

			// pause the game for a short while
			
			this.mode = MODE_GOAL;
			this.gamePaused = true;

			setTimeout(function() {
				
				if (this.gamePlaying)
					this.mode = MODE_GAME;

				this.gamePaused = false;

			}.bind(this), 2000);

			for (var idx in this.players){
				this.players[idx].goal(this.game.scores);
			}

		},

		onReflect : function() {

			winston.info("bounce");

			for (var idx in this.players){
				this.players[idx].bounce();
			}

		},

		render : function() {

			this.game.serialiseState();

			for (var i=0; i < this.renderers.length; i++){
				this.renderers[i].render(this.game, this.mode);
			}
		},

		_callQueueServer : function(aMethod, aCallback){

			winston.info("calling " + aMethod + " on queue server : " + this.queueServer);
			
			var options = {
				host : this.queueServer,
				port : 8080,
				path : "/?method=" + aMethod
			};

			var req = http.request(options, function(response) {

				var str = '';

				response.on('data', function(chunk){
					str += chunk;
				});

				response.on('end', function() {
					winston.info(str);
					if (aCallback) aCallback(str);
				});

			}.bind(this));

			req.on("error", function() {

				winston.info("Error communicating with queue server");

			}.bind(this));

			req.end();

		}


	}

	global.GameManager = (global.module || {}).exports = GameManager;


})(this);