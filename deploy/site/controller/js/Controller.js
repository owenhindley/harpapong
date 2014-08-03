(function() {
	
	var Controller = {

		GAME_STATE_CONNECTING : "gameStateConnecting",
		GAME_STATE_WAIT : "gameStateWait",
		GAME_STATE_DURING : "gameStateDuring",
		GAME_STATE_AFTER : "gameStateAfter",

		state : null,
		socket : null,
		input : null,
		playerId : "",

		updateFlag : true,

		init : function(wsUrl, playerId, controlMethod) {

			this.state = this.GAME_STATE_CONNECTING;

			this.playerId = playerId;

			this.input = AccelInput.init(controlMethod);
			//this.input = MouseInput.init();

			this.socket = io.connect(wsUrl);
			this.socket.on("connect", this.socketConnectHandler.bind(this));

			this.update();

			return this;
		},

		socketConnectHandler : function() {

			
			this.socket.on("identify", this.onIdentify.bind(this));
			this.socket.on("start", this.onGameStart.bind(this));
			this.socket.on("finish", this.onGameEnd.bind(this));

		},

		onIdentify : function(){

			// identify as controller
			this.socket.emit("registercontroller", { id : this.playerId });

		},

		onGameWait : function() {

			this.state = this.GAME_STATE_WAIT;

			// we're waiting for the other player to connect

		},

		onGameStart : function() {

			this.state = this.GAME_STATE_DURING;

			console.log("Game start!");

			// TODO : handle game start

		},

		onGameEnd : function(data) {

			this.state = this.GAME_STATE_AFTER;

			this.socket.disconnect();
			
			console.log("Game ended");
			console.log(data);

		},

		onPaddleBounce : function() {

			// TODO : beep

		},

		update : function() {

			window.requestAnimationFrame(this.update.bind(this));

			if (this.socket && this.state == this.GAME_STATE_DURING){

				if (this.updateFlag){

					this.socket.emit("position", { position : this.input.value });
				}
				this.updateFlag = !this.updateFlag;
			}

		},


		resize : function() {



		}

	};

	window.Controller = Controller;


})();