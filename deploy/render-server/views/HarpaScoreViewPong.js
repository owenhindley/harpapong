var HarpaBaseView = require("./HarpaBaseView.js");

var tX = 0;
var tY = 0;

var MAX_SCORE = 5;

var HarpaScoreView = function() {

};

var p = HarpaScoreView.prototype = new HarpaBaseView();
var s = HarpaBaseView.prototype;

p.init = function(ip, patchdata, width, height) {
	s.init.call(this, ip, patchdata, width, height);

	

}

p.render = function(mode, game) {
	s.render.call(this, mode, game);

	// this.ctx.fillStyle = "white";
	// this.ctx.fillRect(0,0,10,5);

};

p._renderGame = function(game) {


	// draw scores for A
	// 
	// 
	var startX = 2;
	//var startX = 5;
	var startY = 0;
	//var startY = 0;


	for (var i =0; i < MAX_SCORE; i++){
		if ( i < game.scores.a)
			this.ctx.fillStyle = "white";
		else 
			this.ctx.fillStyle = "green";

		this.ctx.fillRect(startX + (i * 3), startY, 2, 1);

	}

	for (var i =0; i < MAX_SCORE; i++){
		if ( i < game.scores.b)
			this.ctx.fillStyle = "white";
		else 
			this.ctx.fillStyle = "green";

		this.ctx.fillRect(startX + (i * 3) + 2, startY + 2, 2, 1);

	}


};


module.exports = HarpaScoreView;