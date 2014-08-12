(function(global){

	var EventEmitter = require('events').EventEmitter;

	var RemoteRenderer = function(){
		this.socket = null;
	};


	var p = RemoteRenderer.prototype = new EventEmitter();


	p.init = function(socket){

		this.socket = socket;


	};

	p.render = function(game, mode){

		var gameState = game.stateSnapshot;
		if (gameState){
			this.socket.emit('render', {data : gameState, mode : mode});
		}

	};

	global.RemoteRenderer = (global.module || {}).exports = RemoteRenderer;


})(this);