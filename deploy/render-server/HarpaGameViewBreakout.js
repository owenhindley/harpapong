var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");
var winston = require("winston");

var GoalEffect = require("./effects/GoalEffect.js");
var WaitEffect = require("./effects/WaitEffect.js");
var SleepEffect = require("./effects/SleepEffect.js");
var NebulaEffect = require("./effects/NebulaEffect.js");

var tX = 0;
var tY = 0;

var HarpaGameView = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;


	this.playwidth = Math.floor(this.width/1.5);
	this.playoffset = Math.floor((this.width -this.playwidth ) * 0.5);

	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);
	this.mapperImageData = null;

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.antialias = "none";

	this.goalEffect = new GoalEffect(this.ctx, this.width, this.height);
	this.goalEffect.renderText = true;

	this.waitEffect = new WaitEffect(this.ctx, this.width, this.height);
	this.waitEffect.renderText = true;

	this.sleepEffect = new SleepEffect(this.ctx, this.width, this.height);

	this.nebulaEffect = new NebulaEffect(this.ctx, this.width, this.height);

	this.screensaverCanvas = new Canvas(this.width, this.height);
	this.screensaverCtx = this.screensaverCanvas.getContext("2d");

};

var p = HarpaGameView.prototype;


p.render = function(game, mode){

	if (mode != this.currentMode){
		winston.info("Game View changed mode to " + mode);

		switch(mode){

			case "goal":
				this.goalEffect.start();
			break;
			case "wait":
				this.waitEffect.start();
			break;
			case "game":

			break;
		}


	}
	this.currentMode = mode;

	this.canvas.width = 0;
	this.canvas.height = 0;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	//this.ctx.clearRect(0,0,this.width, this.height);

	//this.ctx.fillStyle = "black";
	//this.ctx.fillRect(0,0,35, 12);

 	//mode = "sleep";

	switch(mode){

		case "test":


			this.ctx.strokeStyle = "red";
			this.ctx.lineWidth = 1;
			//this.ctx.moveTo(5, 6);
			//this.ctx.lineTo(31,6);
			this.ctx.moveTo(5,tY);
			this.ctx.lineTo(31,tY);
			tY++;
			if (tY > this.height) tY = 0;
			this.ctx.stroke();

//			this.goalEffect.render();

		break;


		case "goal":

			//this.goalEffect.render();


		case "game":

			//this.ctx.save();

			//this.ctx.scale(this.width, this.height);
			/*
			this.nebulaEffect.render();
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(this.playoffset-1, 0, this.playwidth, this.canvas.height);
			*/
			this.ctx.fillStyle = "green";

			// player a
			aX = (game.pos.a.x - game.pw / 2);
			aY = (game.pos.a.y - game.ph / 2);
			// this.ctx.fillRect(aX * this.width, aY * this.height, game.pw * this.width, game.ph * this.height);
			this.ctx.fillRect(aX * this.playwidth + this.playoffset, 0 * this.height, game.pw * this.playwidth, 1);

			// player b
			bX = (game.pos.b.x - game.pw / 2);
			bY = (game.pos.b.y - game.ph / 2);
			// this.ctx.fillRect(bX * this.width, bY * this.height, game.pw * this.width, game.ph * this.height);
			//
			this.ctx.fillRect(bX * this.playwidth + this.playoffset, (1 * this.height)-1, game.pw * this.playwidth, 1);

			if (mode == "game"){

				// balls
				this.ctx.fillStyle="white";
				this.ctx.globalAlpha = 1.0;
				var bw = game.ballSize;
				
				this.ctx.fillRect((game.pos.balls[0].x -bw/2) * this.playwidth + this.playoffset, (game.pos.balls[0].y - bw/2) * this.height, bw * this.playwidth, bw * this.height);
				this.ctx.fillRect((game.pos.balls[1].x -bw/2) * this.playwidth + this.playoffset, (game.pos.balls[1].y - bw/2) * this.height, bw * this.playwidth, bw * this.height);

				// blocks

				for (var i=0; i < game.pos.blocks.length; i++){

					var block = game.pos.blocks[i];
					if (block.active){
						this.ctx.fillStyle = "red"
						this.ctx.fillRect((block.x - game.blockWidth/2) * this.playwidth + this.playoffset, (block.y - game.blockHeight/2) * this.height, game.blockWidth * this.playwidth, game.blockHeight * this.height);	
					}
					

				}

				// walls
				this.ctx.moveTo(this.playoffset-1,0);
				this.ctx.lineWidth = 1;
				this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
				this.ctx.lineTo(this.playoffset-1,this.canvas.height);
				this.ctx.stroke();
				this.ctx.moveTo(this.playwidth + this.playoffset + 1, 0);
				this.ctx.lineTo(this.playwidth + this.playoffset + 1, this.canvas.height);
				this.ctx.stroke();
			}

			//this.ctx.restore();

		break;

		case "wait":

			this.waitEffect.render();

		break;

		case "sleep":

			this.sleepEffect.render();

		break;

		case "blackout":

			// Go black
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);


		break;

		case "screensaver":

			// write the incoming screensaver buffer to the canvas

			// TODO this;
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

}

// utility methods for testing

p.blackout = function() {
	this.pixelmapper.setAllTo(0,0,0,true);
};

p.blind = function() {
	this.pixelmapper.setAllTo(255,255,255,true);
}

module.exports = HarpaGameView;
