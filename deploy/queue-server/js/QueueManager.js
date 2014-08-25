(function(global){

	var WaitingPlayer = require('./WaitingPlayer.js').WaitingPlayer;
	var NanoTimer = require("nanotimer");
	var winston = require('winston');

	var TIMEOUT_TIME = 60 * 1000;
	var TIMEOUT_TIME_SHORT = 10 * 1000;

	/*
	
	this.queue process
	- player connects to this.queue server
	- joins this.queue, is assigned GUID
	* check position in this.queue (loop) *
	- receives ‘playing’ message
	- connects to game server
	- plays game
	- disconnects

	*/
	
	var QueueManager = {

		timer : null,
		queue : [],
		playing : [],

		currentGameKey : null,
		nextGameTimeoutId : -1,

		init : function(){

			this.timer = new NanoTimer();

			this.timer.setInterval(this.checkWaiting.bind(this), '', '1s');

			return this;

		},

		addWaiting : function(ip) {

			var newPlayer = new WaitingPlayer(ip);
			this.queue.push(newPlayer);
			return newPlayer;

		},

		playerPosition : function(aGuid) {

			var dateNow = Date.now();
			var queueLength = this.queue.length;
			// check in the this.queue
			for (var i=0; i< queueLength; i++){

				if (this.queue[i] && this.queue[i].id == aGuid){
					this.queue[i].lastCheck = dateNow;
					return i;
				}

			}
			// check in the 'playing' section
			for (var i=0; i < this.playing.length; i++){
				if (this.playing[i] && this.playing[i].id == aGuid){

					var newId = (i == 0) ? "a" : "b";
					return newId;
				}
				
			}

			return -1;
		},

		nextGame : function() {

			console.log("QueueManager : Game server called next game");
			clearTimeout(this.nextGameTimeoutId);

			this.playing = [];

			if (this.queue.length >= 2){

				this.playing.push(this.queue.shift());
				this.playing.push(this.queue.shift());

				winston.info("players for next game : %s vs %s", this.playing[0].id, this.playing[1].id);

				return this.playing;
				
			} else {
				winston.info("not enough people in this.queue (only " + this.queue.length + ") to start a game, waiting...");
				this.nextGameTimeoutId = setTimeout(this.nextGame.bind(this), 1000);
				return null;
			}

		},

		checkWaiting : function() {

			var dateNow = Date.now();
			var queueLength = this.queue.length;
			var deadList = [];
			
			for (var i=0; i< queueLength; i++){

				// people closer to the start of the queue have a shorter timeout
				// because if they drop off 60s before a game starts, the game will fail
				var inactivity_limit = (i > 3) ? TIMEOUT_TIME : TIMEOUT_TIME_SHORT;

				if (this.queue[i]){
					if (dateNow - this.queue[i].lastCheck > inactivity_limit){
						deadList.push(this.queue[i]);
					}
				}
			}
			if (deadList.length > 0){
				winston.info("trimming " + deadList.length + " people from the this.queue");

				for (var i=0; i < deadList.length; i++){
					this.queue.splice(i, 1);
				}
			}
			


		},


	}


	global.QueueManager = (global.module || {}).exports = QueueManager;



})(this);