(function(global){

	var winston = require('winston');
	var http = require('http');
	var NanoTimer = require("nanotimer");
	var EventEmitter = require('events').EventEmitter;

	var MAX_SCORE = 5;
	var JOIN_TIMEOUT = 10000;
	
	var GameManager = {

		timer : null,
		game : null,
		players : {},
		master : null,
		renderers : [],
		events : new EventEmitter(),

		queueServer : null,
		lastUpdate : 0,
		gamePlaying : false,

		joinTimeoutId : -1,

		init : function(game, queueServer){

			this.queueServer = queueServer;
			this.game = game;

			timer = new NanoTimer();

			timer.setInterval(this.update.bind(this), '', '33m');

			return this;

		},

		requestPlayers : function() {

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

			this.game.startGame();

			this.gamePlaying = true;

		},

		endGame : function() {

			winston.info("Game ended, scores : ", this.game.scores);

			for (var idx in this.players){
				this.players[idx].removeAllListeners("position");
				this.players[idx].finish(this.game.score);
			}

			this.gamePlaying = false;

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

			if (this.gamePlaying){
				this.game.update(dt);

				if (this.game.scores.a >= MAX_SCORE || this.game.scores.b >= MAX_SCORE){
					this.endGame();
				}
			}

			

			this.render();

			this.lastUpdate = Date.now();

		},

		render : function() {

			this.game.serialiseState();

			for (var i=0; i < this.renderers.length; i++){
				this.renderers[i].render(this.game);
			}
		},

		_callQueueServer : function(aMethod, aCallback){

			winston.info("calling " + aMethod + " on queue server : " + this.queueServer);
			
			var options = {
				host : this.queueServer,
				port : 8080,
				path : "/?method=" + aMethod
			};

			http.request(options, function(response) {

				var str = '';

				response.on('data', function(chunk){
					str += chunk;
				});

				response.on('end', function() {
					winston.info(str);
					if (aCallback) aCallback(str);
				});

			}.bind(this)).end();

		}


	}

	global.GameManager = (global.module || {}).exports = GameManager;


})(this);