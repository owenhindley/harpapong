// Scheduler.js

define(["Scheduler", "window"], function(Scheduler, window) {
	
	var requestAnimFrame = function() {};
	
	if(window.requestAnimFrame == undefined) {
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function( callback ){
			window.setTimeout(callback, 1000 / 60);
			};
		})();
	}
	var instance = null;

	var Scheduler = function() {
		this._loopBind        = this._loop.bind(this);
		this.FRAMERATE        = 60;
		this._delayTasks      = [];
		this._nextTasks       = [];
		this._deferTasks      = [];
		this._highTasks       = [];
		this._usurpTask       = [];
		this._enterframeTasks = [];
		this._idTable         = 0;
		this._isRunning	      = true;
		requestAnimFrame( this._loopBind );
	};

	var p = Scheduler.prototype;



	p._loop = function() {
		this._process();
		if(this._isRunning) requestAnimFrame( this._loopBind );
	};


	p._process = function() {
		for ( var i=0; i<this._enterframeTasks.length; i++) {
			var task = this._enterframeTasks[i];
			if(task != null && task != undefined) {
				task.func.apply(task.scope, task.params);
			}
		}
		
		while ( this._highTasks.length > 0) {
			var t = this._highTasks.pop();
			t.func.call(t.scope, t.params);
		}
		

		var startTime = new Date().getTime();

		for ( var i=0; i<this._delayTasks.length; i++) {
			var t = this._delayTasks[i];
			if(startTime-t.time > t.delay) {
				t.func.call(t.scope, t.params);
				this._delayTasks.splice(i, 1);
			}
		}

		startTime = new Date().getTime();
		var interval = 1000 / this.FRAMERATE;
		while(this._deferTasks.length > 0) {
			var task = this._deferTasks.shift();
			var current = new Date().getTime();
			if(current - startTime < interval ) {
				task.func.apply(task.scope, task.params);
			} else {
				this._deferTasks.unshift(task);
				break;
			}
		}


		startTime = new Date().getTime();
		var interval = 1000 / this.FRAMERATE;
		while(this._usurpTask.length > 0) {
			var task = this._usurpTask.shift();
			var current = new Date().getTime();
			if(current - startTime < interval ) {
				task.func.apply(task.scope, task.params);
			} else {
				break;
			}
		}


		this._highTasks = this._highTasks.concat(this._nextTasks);
		this._nextTasks = [];
		this._usurpTask = [];
	}
	
	
	p.addEF = function(scope, func, params) {
		var id = this._idTable;
		this._enterframeTasks[id] = {scope:scope, func:func, params:params};
		this._idTable ++;
		return id;
	}
	
	
	p.removeEF = function(id) {
		if(this._enterframeTasks[id] != undefined) {
			this._enterframeTasks[id] = null
		}
		return -1;
	}


	p.delay = function(scope, func, params, delay) {
		var time = new Date().getTime();
		var t = {scope:scope, func:func, params:params, delay:delay, time:time};
		this._delayTasks.push(t);
	}


	p.defer = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._deferTasks.push(t);
	}


	p.next = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._nextTasks.push(t);
	}


	p.usurp = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._usurpTask.push(t);
	}


	//	PAUSE ALL TASKS
	p.pause = function() {
		this._isRunning = false;
	};

	//	START/ RESTART ALL TASKS
	p.start = function() {
		if(this._isRunning) return;

		this._isRunning = true;
		requestAnimFrame( this._loopBind );
	};


	Scheduler.getInstance = function() {
		if(instance == null) {
			instance = new Scheduler();
		}
		return instance;
	};

	return Scheduler.getInstance();

});