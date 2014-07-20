(function(global){

	var MasterController = function(){
		this.socket = null;
	};


	var p = MasterController.prototype;


	p.init = function(socket){
		
		this.socket = socket;

	};


	global.MasterController = (global.module || {}).exports = MasterController;


})(this);