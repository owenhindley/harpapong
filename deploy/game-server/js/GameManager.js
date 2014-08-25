(function(global){

	var winston = require('winston');
	var http = require('http');
	var NanoTimer = require("nanotimer");
	var EventEmitter = require('events').EventEmitter;

	var MAX_SCORE = 5;
	var JOIN_TIMEOUT = 20* 1000;

	var INACTIVITY_TIMEOUT = 10 * 1000;

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

		lastPositionTime : Date.now(),

		currentGameKey : null,

		joinTimeoutId : -1,
		requestPlayersId : -1,

		init : function(game, queueServer){

			this.queueServer = queueServer;
			this.game = game;

			timer = new NanoTimer();

			timer.setInterval(this.update.bind(this), '', '33m');

			return this;

		},

		requestPlayers : function() {

			this.currentGameKey = this.getGuid();

			winston.info("Requesting players, key : " + this.currentGameKey);

			this.mode = MODE_WAIT;

			this._callQueueServer("nextgame", function(response){

				var responseObj = JSON.parse(response);


			}, { key : this.currentGameKey });

			this.lastPositionTime = Date.now();

			clearTimeout(this.requestPlayersId);
			clearTimeout(this.joinTimeoutId);
			this.joinTimeoutId = setTimeout(this.gameStartTimeout.bind(this), JOIN_TIMEOUT);

		},

		startGame : function() {

			winston.info("starting game..");

			for (var idx in this.players){
				this.players[idx].start();
			}

			clearTimeout(this.requestPlayersId);
			clearTimeout(this.joinTimeoutId);

			this.game.startGame(this.onGoal.bind(this), this.onReflect.bind(this));

			this.mode = MODE_GAME;

			this.gamePlaying = true;
			this.gamePaused = false;

			this.lastPositionTime = Date.now();

		},

		endGame : function(aNewGameDelay) {

			winston.info("Game ended, scores : ", this.game.scores);

			this.currentGameKey = "none";

			for (var idx in this.players){
				this.players[idx].removeAllListeners("position");
				this.players[idx].finish(this.game.scores);
			}

			this.gamePlaying = false;
			this.gamePaused = false;

			this.players = {};

			this.lastPositionTime = Date.now();

			// wait for a while before requesting new players
			clearTimeout(this.requestPlayersId);
			this.requestPlayersId = setTimeout(this.requestPlayers.bind(this), aNewGameDelay);

		},

		addRemotePlayer : function(player){

			var playerId = player.playerId;
			this.players[playerId] = player;
			player.on("position", function(data) {

				this.lastPositionTime = Date.now();

				//console.log("* Game Manager : position from player " + data.id + " : " + data.position);
				this.game.setPlayerPosition(data.id, data.position);
			}.bind(this));

			// restart the timer waiting for both players

			if (!this.gamePlaying){
				
				if (this.players["a"] && this.players["b"]){
					clearTimeout(this.joinTimeoutId);
					this.startGame();
				}
				else {
					clearTimeout(this.joinTimeoutId);
					this.joinTimeoutId = setTimeout(this.gameStartTimeout.bind(this), JOIN_TIMEOUT);	
			
				}

			} else {
				// presume they just re-connected
				clearTimeout(this.joinTimeoutId);
				this.players[playerId].start();
			}
			



			
			
		},

		gameStartTimeout : function(){

			winston.error("Timeout whilst waiting for players to join");
			this.endGame(0);

		},

		addMaster : function(master){


		},

		addRenderer : function(renderer){
			this.renderers.push(renderer)

			console.log("Total renderers : " + this.renderers.length);
		},


		update : function() {


			var dt = Date.now() - this.lastUpdate;

			if (this.gamePlaying && !this.gamePaused){
				this.game.update(dt);

				// check the scores, end the game if max score reached
				if (this.game.scores.a >= MAX_SCORE || this.game.scores.b >= MAX_SCORE){
					this.endGame(5000);
				}

				// check the time since we last had a position update
				// end the game if it's more than INACTIVITY_TIMEOUT
				var sinceLastPosition = this.lastUpdate - this.lastPositionTime;
				if ( sinceLastPosition > INACTIVITY_TIMEOUT ){
					winston.error("INACTIVITY TIMEOUT, restarting game");
					this.endGame(5000);
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

		_callQueueServer : function(aMethod, aCallback, aArguments){

			winston.info("calling " + aMethod + " on queue server : " + this.queueServer);
			
			var options = {
				host : this.queueServer,
				port : 8080,
				path : "/?method=" + aMethod
			};

			if (aArguments){
				for (var idx in aArguments){
					options.path += "&" + encodeURIComponent(idx) + "="	+ encodeURIComponent(aArguments[idx]);
				}
				
			}

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

		},


		getGuid : function() {

			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
			};
		
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}


	}

	global.GameManager = (global.module || {}).exports = GameManager;


})(this);