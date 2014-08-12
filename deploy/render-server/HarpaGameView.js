var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var Canvas = require("canvas");

var HarpaGameView = function(ip, patchdata, width, height){

	this.width = width;
	this.height = height;
	this.pixelmapper = new ArtnetPixelMapper(ip);
	this.pixelmapper.setup(this.width, this.height, patchdata);

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
};

var p = HarpaGameView.prototype;


p.render = function(game, mode){

	this.ctx.clearRect(0,0,this.width, this.height);

	switch(mode){

		case "game":

			this.ctx.save();

			this.ctx.scale(this.width, this.height);

			// player a
			aX = (game.pos.a.x - game.pw / 2);
			aY = (game.pos.a.y - game.ph / 2);
			this.ctx.fillRect(aX, aY, game.pw, game.ph);

			// player b
			bX = (game.pos.b.x - game.pw / 2);
			bY = (game.pos.b.y - game.ph / 2);
			this.ctx.fillRect(bX, bY, game.pw, game.ph);

			// ball
			// this.ctx.beginPath();
			// this.ctx.arc(game.pos.ball.x, game.pos.ball.y, game.ballSize, 0, 2 * Math.PI, false);
			// this.ctx.fill();
			var bw = game.ballSize;
			this.ctx.fillRect(game.pos.ball.x -bw/2, game.pos.ball.y - bw/2, bw, bw);
			
			this.ctx.restore();


		break;

		case "goal":



		break;

		case "waiting":


		break;

	}

	// get image data and send to pixelmapper
	var imgData = this.ctx.getImageData(0,0,this.width, this.height).data;
	var x, y = 0;
	var index = 0;
	for (var i=0; i< this.width; i++){
		for (var j=0; j < this.height; j++){
			index = i * this.height * 4 + j;
			this.pixelmapper.setPixel(i, j, imgData[index], imgData[index+1], imgData[index+2]);
		}
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