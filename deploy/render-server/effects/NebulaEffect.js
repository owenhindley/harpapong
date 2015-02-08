var Canvas = require("canvas");

var NebulaEffect = function(ctx, width, height) {
	
	this.ctx = ctx;
	this.width = width;
	this.height = height;

	this.index = 0;

	this.flag = false;
	this.frameCounter = 0;

	this.images = [];

	for (var i=0; i < 4; i++){
		var newImage = new Canvas.Image();
		newImage.src = "images/bg-nebula-0" + (i+1) + ".png";
		this.images.push(newImage);
	}


	this.lastCanvas = new Canvas(this.width, this.height);
	this.lastCtx = this.lastCanvas.getContext("2d");
	
	this.ctx.font = "2pt Arial";
	this.renderText = false;

}

var p = NebulaEffect.prototype;


p.render = function() {

	var lastCompositeOperation = this.ctx.globalCompositeOperation;
	this.ctx.globalCompositeOperation = "overlay";


	this.flag = !this.flag;
	this.frameCounter++;

	
	this.ctx.globalAlpha = 0.2;
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0,0,this.width, this.height);
	this.ctx.globalAlpha = 0.9;
	this.ctx.drawImage(this.lastCanvas, 0,0);
	this.ctx.globalAlpha = 1.0;

	if ((this.frameCounter % 15 == 0)){
		this.index = Math.floor(Math.random() * this.images.length);
		this.frameCounter = 0;
	}

	var image = this.images[this.index];
	if (image){

		this.ctx.globalAlpha = 0.01;
		this.ctx.drawImage(image, 0,0);
		
	}

	

	
	if (this.frameCounter % 10 == 0){
		this.ctx.fillStyle = "white";
		this.ctx.globalAlpha = 0.1;
		for (var i=0; i < 2; i++){
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			this.ctx.fillRect(x,y,1,1);
		}
	
	} 

	this.ctx.globalAlpha = 1.0;

	this.lastCtx.drawImage(this.ctx.canvas,0,0);


	this.ctx.globalCompositeOperation = lastCompositeOperation;

};

module.exports = NebulaEffect;