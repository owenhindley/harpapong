(function(global){

	var EventEmitter = require('events').EventEmitter;

	var WaitingPlayer = function(ipaddress) {
		this.id = ipaddress + "_" + guid();
		this.lastCheck = Date.now();
	};

	var p = WaitingPlayer.prototype = new EventEmitter();


	var guid = function() {

		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		};
	
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};


	global.WaitingPlayer = (global.module || {}).exports = WaitingPlayer;



})(this);
