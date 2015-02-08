var ArtnetPixelMapper = require("../ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");
var winston = require("winston");

var TextEffect = require("../effects/TextEffect.js");
var WaitEffect = require("../effects/WaitEffect.js");
var SleepEffect = require("../effects/SleepEffect.js");

var tX = 0;
var tY = 0;

var MAX_SCORE = 5;

var HarpaBaseView = function() {};

var p = HarpaBaseView.prototype;

p.init = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;
	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);
	this.mapperImageData = null;

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";
	// this.ctx.antialias = "none";
	this.ctx.font = "2pt Arial";

	this.textEffect = new TextEffect(this.ctx, this.width, this.height);

	this.waitEffect = new WaitEffect(this.ctx, this.width, this.height);
	this.currentMode = "blackout";

	this.sleepEffect = new SleepEffect(this.ctx, this.width, this.height);

	this.screensaverCanvas = new Canvas(this.width, this.height);
	this.screensaverCtx = this.screensaverCanvas.getContext("2d");

};

p.render = function(game, mode){

	if (mode != this.currentMode){
		winston.info("Score View changed mode to " + mode);
	}

	this.currentMode = mode;

	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);


	switch(mode){

		case "test":

			this.ctx.strokeStyle = "green";
			this.ctx.lineWidth = 1;
			this.ctx.moveTo(0,tY);
			this.ctx.lineTo(this.width,tY);
			tY++;
			if (tY > this.height) tY = 0;
			this.ctx.stroke();

		break;

		case "scoreTest":
			

		break;

		case "goal":

			this.textEffect.sparkles = true;
			this.textEffect.textToRender = "GOAL!";
			this.textEffect.render();

		case "game":

			this._renderGame(game, mode);

		break;

		case "wait":

			this.waitEffect.render();

		break;

		case "waitReady":

			this._renderGame(game, "wait");

			this.textEffect.sparkles = false;
			this.textEffect.textToRender = "GET READY!";
			this.textEffect.render();

		break;

		case "sleep":

			this.sleepEffect.render();

		break;

		case "blackout":
			// do nothing
			
		break;

		case "screensaver":

			this.ctx.drawImage(this.screensaverCanvas,0,0);

		break;

	}

	// get image data and send to pixelmapper
	this.mapperImageData = this.ctx.getImageData(0,0,this.width, this.height).data;

	

	var x, y = 0;
	var index = 0;
	for (var i = 0; i < this.mapperImageData.length; i+=4){

		y = Math.floor( (i / 4) / this.width );
		x = (i / 4) % this.width;
		
		this.pixelmapper.setPixel(x, y, this.mapperImageData[i], this.mapperImageData[i+1], this.mapperImageData[i+2]);
		
	}
	

	this.pixelmapper.render();

};

p._renderGoal = function() {

	this.textEffect.render();

};

p._renderGame = function(game, mode) {

	// override this method for game-specific rendering
}

// utility methods for testing

p.blackout = function() {
	this.pixelmapper.setAllTo(0,0,0,true);
};

p.blind = function() {
	this.pixelmapper.setAllTo(255,255,255,true);
}

module.exports = HarpaBaseView;