var Canvas = require("canvas");

var LOGO_DURATION = 10 * 30;
var INFO_DURATION = 60 * 30;

var SleepEffect = function(ctx, width, height) {
	
	this.ctx = ctx;
	this.width = width;
	this.height = height;

	this.flag = false;
	this.frameCounter = 0;

	this.logoCounter = 0;
	this.infoCounter = 0;

	this.mode = 0;

	this.lastCanvas = new Canvas(this.width, this.height);
	this.lastCtx = this.lastCanvas.getContext("2d");
	
	this.ctx.font = "2pt Arial";
	this.renderText = false;

}

var p = SleepEffect.prototype;

p.start = function() {

	this.frameCounter = 0;

};

p.render = function() {

	var lastCompositeOperation = this.ctx.globalCompositeOperation;
	this.ctx.globalCompositeOperation = "overlay";


	this.flag = !this.flag;
	this.frameCounter++;

	
	this.ctx.globalAlpha = 0.94;
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0,0,this.width, this.height);
	this.ctx.drawImage(this.lastCanvas, 0,0);
	this.ctx.globalAlpha = 1.0;
	

	if (this.frameCounter % 10 == 0){
		this.ctx.fillStyle = "white";
		for (var i=0; i < 1; i++){
			this.ctx.globalAlpha  = Math.random();
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			this.ctx.fillRect(x,y,1,1);
			this.ctx.globalAlpha  = 1.0;
		}
	
	} 

	this.lastCtx.drawImage(this.ctx.canvas,0,0);

	this.ctx.globalCompositeOperation = lastCompositeOperation;


};

module.exports = SleepEffect;