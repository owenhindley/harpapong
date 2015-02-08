var HarpaBaseView = require("./HarpaBaseView.js");

var tX = 0;
var tY = 0;

var NUM_LIVES_MAX = 10;


var p = HarpaScoreView.prototype = new HarpaBaseView();
var s = HarpaBaseView.prototype;

p.init = function(ip, patchdata, width, height) {
	s.init.call(this, ip, patchdata, width, height);

}

p._renderGame = function(game) {

	// draw scores for A
	// 
	// 
	var startX = 2;
	//var startX = 5;
	var startY = 0;
	//var startY = 0;


	for (var i =0; i < NUM_LIVES_MAX; i++){
		if ( i < game.lives.a)
			this.ctx.fillStyle = "white";
		else 
			this.ctx.fillStyle = "green";

		this.ctx.fillRect(startX + (i * 3), startY, 2, 1);

	}

	for (var i =0; i < NUM_LIVES_MAX; i++){
		if ( i < game.lives.b)
			this.ctx.fillStyle = "white";
		else 
			this.ctx.fillStyle = "green";

		this.ctx.fillRect(startX + (i * 3) + 2, startY + 2, 2, 1);

	}


};

module.exports = HarpaScoreView;