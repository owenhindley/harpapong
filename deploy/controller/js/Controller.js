(function() {
	
	var Controller = {

		socket : null,
		input : null,
		playerId : "",

		updateFlag : true,

		init : function(wsUrl, playerId) {

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
			this.socket.on("gamestart", this.onGameStart.bind(this));


		},

		onIdentify : function(){

			// identify as controller
			this.socket.emit("registercontroller", { id : this.playerId });

		},

		onGameStart : function() {

			// TODO : handle game start

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



		},


		resize : function() {



		}

	};

	window.Controller = Controller;


})();