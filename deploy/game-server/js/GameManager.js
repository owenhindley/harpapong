(function(global){

	var NanoTimer = require("nanotimer");
	var EventEmitter = require('events').EventEmitter;
	
	var GameManager = {

		timer : null,
		game : null,
		players : [],
		master : null,
		renderers : [],

		lastUpdate : 0,
		gamePlaying : false,

		init : function(game){

			this.game = game;

			timer = new NanoTimer();

			timer.setInterval(this.update.bind(this), '', '33m');

			return this;

		},

		startGame : function() {

			// double-check we have enough players
			

			this.game.startGame();

			this.gamePlaying = true;

		},

		endGame : function() {

			for (var idx in players){
				players[idx].removeAllListeners("position");
				players[idx].finish();
			}

			players = [];

		},

		addRemotePlayer : function(player){

			this.players.push(player);
			var playerId = player.id;
			player.on("position", function(data) {
				//console.log("* Game Manager : position from player " + data.id + " : " + data.position);
				this.game.setPlayerPosition(data.id, data.position);
			}.bind(this));
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
			}

			this.render();

			this.lastUpdate = Date.now();

		},

		render : function() {

			this.game.serialiseState();

			for (var i=0; i < this.renderers.length; i++){
				this.renderers[i].render(this.game);
			}
		}


	}

	global.GameManager = (global.module || {}).exports = GameManager;


})(this);