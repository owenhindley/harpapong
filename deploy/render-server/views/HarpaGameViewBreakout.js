var Canvas = require("canvas");
var winston = require("winston");
var HarpaBaseView = require("./HarpaBaseView.js");


var tX = 0;
var tY = 0;

var HarpaGameView = function(){

};

var p = HarpaGameView.prototype = new HarpaBaseView();
var s = HarpaBaseView.prototype;

p.init = function(ip, patchdata, width, height) {
	s.init.call(this, ip, patchdata, width, height);

	this.playwidth = Math.floor(this.width/1.5);
	this.playoffset = Math.floor((this.width -this.playwidth ) * 0.5);

	this.goalEffect.renderText = true;
	this.waitEffect.renderText = true;

};


p.render = function(game, mode) {

	if (mode != this.currentMode){

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

	s.render.call(this, game, mode);


};


p._renderGame = function(game, mode) {


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

};


module.exports = HarpaGameView;
