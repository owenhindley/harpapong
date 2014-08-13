var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");
var winston = require("winston");

var GoalEffect = require("./effects/GoalEffect.js");
var WaitEffect = require("./effects/WaitEffect.js");

var tX = 0;
var tY = 0;

var HarpaGameView = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;
	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.antialias = "none";

	this.goalEffect = new GoalEffect(this.ctx, this.width, this.height);
	this.goalEffect.renderText = true;

	this.waitEffect = new WaitEffect(this.ctx, this.width, this.height);
	this.waitEffect.renderText = true;
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

 	//mode = "test";

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

			this.goalEffect.render();


		case "game":

			//this.ctx.save();

			//this.ctx.scale(this.width, this.height);

			this.ctx.fillStyle = "green";

			// player a
			aX = (game.pos.a.x - game.pw / 2);
			aY = (game.pos.a.y - game.ph / 2);
			// this.ctx.fillRect(aX * this.width, aY * this.height, game.pw * this.width, game.ph * this.height);
			this.ctx.fillRect(aX * this.width, aY * this.height, game.pw * this.width, 1);

			// player b
			bX = (game.pos.b.x - game.pw / 2);
			bY = (game.pos.b.y - game.ph / 2);
			// this.ctx.fillRect(bX * this.width, bY * this.height, game.pw * this.width, game.ph * this.height);
			// 
			this.ctx.fillRect(bX * this.width, (bY * this.height)-1, game.pw * this.width, 1);

			if (mode == "game"){

				// ball
				// this.ctx.beginPath();
				// this.ctx.arc(game.pos.ball.x, game.pos.ball.y, game.ballSize, 0, 2 * Math.PI, false);
				// this.ctx.fill();
				var bw = game.ballSize * 1;
				// this.ctx.fillRect((game.pos.ball.x -bw/2) * this.width, (game.pos.ball.y - bw/2) * this.height, bw * this.width, bw * this.height);
				this.ctx.fillRect((game.pos.ball.x -bw/2) * this.width, (game.pos.ball.y - bw/2) * this.height, 1, 1);
				
			}
			
			//this.ctx.restore();
			
		break;

		case "wait":

			this.waitEffect.render();

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