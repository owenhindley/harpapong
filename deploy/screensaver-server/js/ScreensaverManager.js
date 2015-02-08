var Canvas = require("canvas");
var Image = Canvas.Image;
var winston = require("winston");
var ChildProcess = require('child_process');
var zmq = require("zmq");
var CanvasManager = require("./CanvasManager.js");

var LOCAL_SOCKET_ADDRESS = "tcp://127.0.0.1:6000";

var ScreensaverManager = function() {

	this.faces = [];	// stores sizes of each face

	this.vis_index = 0;
	this.vis_data = [];
	this.current_vis_process = null;

	this.canvas = new Canvas(1,1);
	this.ctx = this.canvas.getContext("2d");

	this.offsets = [0];

	// receiving image data via 0MQ socket
	this.socket_temp_image = new Image();
	this.socket_image_receive = zmq.socket("pull");
	this.socket_image_receive.connect(LOCAL_SOCKET_ADDRESS);
	this.socket_image_receive.on('message', this.onSocketImageData.bind(this));
	this.socket_image_data = null;

};

var p = ScreensaverManager.prototype;

p.addFace = function(width, height) {
	this.faces.push([width, height]);
	this.canvas.width += width;
	this.canvas.height = Math.max(this.canvas.height, height);
}

p.addVisualiser = function(aData) {

	this.vis_data.push(aData);

};

p.resetVisData = function() {
	this.vis_data = [];
}

p.selectVisualiser = function(aIndex) {

	var processdata = this.vis_data[aIndex];

	if (!processdata){
		console.error("No such visualiser index : ", aIndex);
		return;
	}

	// console.log(processdata);

	

	if (this.current_vis_process){

		// tell visualiser to fade out
		try {
			this.current_vis_process.send({ cmd : "fadeOut" });
		} catch(e){
			console.error("** Error whilst trying to fade out process **");
		}

		setTimeout(function() {

		// kill old process
		if (this.current_vis_process){
			console.log("Killing previous visualiser processs")
			try {
				this.current_vis_process.send({ cmd : "disconnect" });	
				this.current_vis_process.kill();
			} catch(error){
				console.error("** Error  whilst trying to kill process : **");
				console.error(error);
			}
			
			
		}

		this._startNewProcess(processdata);

	}.bind(this), 1000);


	} else {

		this._startNewProcess(processdata);

	}

	

	


};

p._startNewProcess = function(processdata) {

	console.log(" ** Spinning up new process for " + processdata.name + " **");


	var newProcess = ChildProcess.fork("./visualiser-process.js", [processdata.path]);

	// start new process
	this.current_vis_process = newProcess;

	// init with the size of canvases
	try {
		this.current_vis_process.send({ 
			cmd : "init",
			front : {
				width : this.faces[0][0],
				height : this.faces[0][1]
			},
			side : {
				width: this.faces[1][0],
				height: this.faces[1][1],
			},
			options : processdata.options
	
			});

		// connect to the zmq socket to send data across
		this.current_vis_process.send({
			cmd : "connect",
			address : LOCAL_SOCKET_ADDRESS
		});
	} catch(e){
		console.error("** Error when trying to initialise new visualiser **");
	}
	


};

p.onSocketImageData = function(data) {
	this.socket_image_data = data;
};


p.render = function() {
	try {
		if (this.current_vis_process){
			this.current_vis_process.send({ cmd : "render" });
		}	
	} catch(e){
		// error calling render
	}
	

};


p.getAllFaces = function() {
	return this.socket_image_data;
};

p.getDebugCanvas = function() {
	if (this.socket_image_data){

		this.socket_temp_image.src = this.socket_image_data;
		this.ctx.drawImage(this.socket_temp_image, 0,0);

	}
	return this.canvas.toDataURL();

};


p.cleanup = function() {

	if (this.current_vis_process){
		this.current_vis_process.kill();
	}

};


module.exports = ScreensaverManager;
