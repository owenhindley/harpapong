var Canvas = require("canvas");

var WaitEffect = function(ctx, width, height) {
	
	this.ctx = ctx;
	this.width = width;
	this.height = height;

	this.flag = false;
	this.frameCounter = 0;

	this.lastCanvas = new Canvas(this.width, this.height);
	this.lastCtx = this.lastCanvas.getContext("2d");

	this.ctx.font = "2pt Arial";
	this.renderText = false;

}

var p = WaitEffect.prototype;

p.start = function() {

	this.frameCounter = 0;

};

p.render = function() {


	this.flag = !this.flag;
	this.frameCounter++;

	
	this.ctx.globalAlpha = 0.3;
	//this.ctx.drawImage(this.lastCanvas, 0,0);
	this.ctx.globalAlpha = 1.0;
	

	if (this.frameCounter % 10 == 0){
		this.ctx.fillStyle = "white";
		for (var i=0; i < 2; i++){
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			this.ctx.fillRect(x,y,1,1);
		}
	
	} 

	this.lastCtx.drawImage(this.ctx.canvas,0,0);

	if (this.renderText){
		this.ctx.fillStyle = "green";
		this.ctx.fillText("PONG", 3, Math.floor(this.height/2) + 4);

	}

	

};

module.exports = WaitEffect;