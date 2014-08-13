var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");
var winston = require("winston");

var tX = 0;
var tY = 0;

var HarpaGameView = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;
	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");

	this.currentMode = "wait";
};

var p = HarpaGameView.prototype;


p.render = function(game, mode){

	if (mode != this.currentMode){
		winston.info("Score View changed mode to " + mode);
	}
	this.currentMode = mode;

	this.canvas.width = 0;
	this.canvas.height = 0;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	//this.ctx.clearRect(0,0,this.width, this.height);

	//this.ctx.fillStyle = "black";
	//this.ctx.fillRect(0,0,35, 12);

	mode = "test";

	switch(mode){

		case "test":

			//this.ctx.fillStyle = "blue";
			//this.ctx.fillRect(0,0,this.width, this.height);

			this.ctx.strokeStyle = "red";
			this.ctx.lineWidth = 1;
			//this.ctx.moveTo(5, 6);
			//this.ctx.lineTo(31,6);
			this.ctx.moveTo(0,tY);
			this.ctx.lineTo(this.width,tY);
			tY++;
			if (tY > this.height) tY = 0;
			this.ctx.stroke();

		break;

		case "game":



		break;

		case "goal":



		break;

		case "waiting":


		break;

	}

	// get image data and send to pixelmapper
	var imgData = this.ctx.getImageData(0,0,this.width, this.height).data;

	//console.log(imgData[1000]);
	//process.exit();

	for (var i=0; i< imgData.length; i++){
		//console.log(imgData[i]);
	}

	var x, y = 0;
	var index = 0;
	for (var i = 0; i < imgData.length; i+=4){

		y = Math.floor( (i / 4) / this.width );
		x = (i / 4) % this.width;
		
		this.pixelmapper.setPixel(x, y, imgData[i], imgData[i+1], imgData[i+2]);
		
	}
	

	this.pixelmapper.render();

}

// utility methods for testing

p.blackout = function() {
	this.pixelmapper.setAllTo(0,0,0,true);
};

p.blind = function() {
	this.pixelmapper.setAllTo(255,255,255,true);
}

module.exports = HarpaGameView;