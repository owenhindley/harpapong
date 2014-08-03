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

		init : function(wsUrl, playerId) {

			state = GAME_STATE_CONNECTING;

			this.playerId = playerId;

			// this.input = AccelInput.init();
			this.input = MouseInput.init();

			this.socket = io.connect(wsUrl);
			this.socket.on("connect", this.socketConnectHandler.bind(this));

			this.update();

			return this;
		},

		socketConnectHandler : function() {

			
			this.socket.on("identify", this.onIdentify.bind(this));
			this.socket.on("start", this.onGameStart.bind(this));


		},

		onIdentify : function(){

			// identify as controller
			this.socket.emit("registercontroller", { id : this.playerId });

		},

		onGameWait : function() {

			state = GAME_STATE_WAIT;

			// we're waiting for the other player to connect

		},

		onGameStart : function() {

			state = GAME_STATE_DURING;

			// TODO : handle game start

		},

		onGameEnd : function() {

			state = GAME_STATE_AFTER;

		},

		onPaddleBounce : function() {

			// TODO : beep

		},

		update : function() {

			window.requestAnimationFrame(this.update.bind(this));

			if (this.socket){
				if (this.updateFlag){
					this.socket.emit("position", { position : this.input.value });
				}
				this.updateFlag = !this.updateFlag;
			}

			this.render();

		},


		render : function() {

			switch(state){

				case GAME_STATE_CONNECTING:

				break;

				case GAME_STATE_WAIT:
					

				break;

				case GAME_STATE_DURING:


				break;

				case GAME_STATE_AFTER:


				break;
			}
		},


		resize : function() {



		}

	};

	window.Controller = Controller;


})();