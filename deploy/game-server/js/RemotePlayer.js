(function(global){

	var EventEmitter = require('events').EventEmitter;

	var RemotePlayer = function(){
		this.playerId = "";
		this.position = 0.5;
		this.socket = null;

	};


	var p = RemotePlayer.prototype = new EventEmitter();


	p.init = function(id, socket){

		this.playerId = id;
		this.socket = socket;

		this.socket.on("position", this.positionUpdated.bind(this));
	};

	p.positionUpdated = function(data) {

		//console.log(" * position from player " + this.playerId + " " + data.position);

		this.position = parseFloat(data.position);
		
		if (this.position > 1) this.position = 1;
		if (this.position < 0) this.position = 0;

		this.emit("position", { id : this.playerId, position : this.position});

	};

	p.wait = function() {
		this.socket.emit("wait", { });
	};

	p.start = function() {
		this.socket.emit("start", {});
	};

	p.goal = function(data) {
		this.socket.emit("goal", data);
	};

	p.bounce = function() {
		this.socket.emit("bounce", {});
	};

	p.finish = function(score){
		this.socket.emit("finish", { score : score });
	};

	global.RemotePlayer = (global.module || {}).exports = RemotePlayer;


})(this);