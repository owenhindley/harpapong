var Canvas = require("canvas");

var LOGO_DURATION = 10 * 30;
var INFO_DURATION = 60 * 30;

var WaitEffect = function(ctx, width, height) {
	
	this.ctx = ctx;
	this.width = width;
	this.height = height;

	this.flag = false;
	this.frameCounter = 0;

	this.logoCounter = 0;
	this.logoLoopCounter = 0;
	this.infoCounter = 0;
	this.infoLanguage = "is";

	this.mode = 0;

	this.logoImage = new Canvas.Image();
	this.logoImage.src = "images/PONG-logo.png";

	this.infoImage_is = new Canvas.Image();
	this.infoImage_is.src = "images/PONG-info-is.png";

	this.infoImage_en = new Canvas.Image();
	this.infoImage_en.src = "images/PONG-info.png";

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

	var lastCompositeOperation = this.ctx.globalCompositeOperation;
	// this.ctx.globalCompositeOperation = "overlay";

	this.flag = !this.flag;
	this.frameCounter++;

	
	this.ctx.globalAlpha = 0.9;
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0,0,this.width, this.height);
	this.ctx.drawImage(this.lastCanvas, 0,0);
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

		switch(this.mode){

			case 0:

				this.logoCounter++;

				var pos = this.logoCounter / LOGO_DURATION;
				var alpha = 1.0;
				if (pos < 0.1) alpha = pos * 10;
				if (pos > 0.9) alpha = (1.0 - pos) * 10;

				if (alpha < 0) alpha = 0;

				// render logo
				this.ctx.globalAlpha = alpha;

				this.ctx.drawImage(this.logoImage, 0,0);

				this.ctx.globalAlpha = 1.0;

				if (this.logoCounter > LOGO_DURATION){
					this.logoCounter = 0;
					this.logoLoopCounter++;
					if (this.logoLoopCounter > 2){
						this.logoLoopCounter = 0;
						this.mode = 1;
					}
				}

			break;

			case 1:

				// scroll info
				
				this.infoCounter++;

				var pos = this.infoCounter / INFO_DURATION;
				var alpha = 1.0;
				if (pos < 0.1) alpha = pos * 10;
				if (pos > 0.9) alpha = (1.0 - pos) * 10;

				if (alpha < 0) alpha = 0;

				this.ctx.globalAlpha = alpha;

				this.ctx.save();

				this.ctx.translate((this.width - (this.infoCounter / 8.0)),0)

				var whichImage = (this.infoLanguage == "is") ? this.infoImage_is : this.infoImage_en;
				this.ctx.drawImage(whichImage, 0,0);

				this.ctx.restore();

				this.ctx.globalAlpha = 1.0;


				if (this.infoCounter > INFO_DURATION){
					this.mode = 0;
					this.infoCounter = 0;
					this.infoLanguage = (this.infoLanguage == "is") ? "en" : "is";
				}

			break;

			case 2:
				// countdown mode

				this.ctx.globalAlpha = 1.0;
				this.ctx.fillStyle = "red";
				this.ctx.fillRect(0,0, 10, 10);

				this.ctx.fillStyle = "white";

			break;
		}

		//console.log(this.mode);

		// this.ctx.fillStyle = "green";
		// this.ctx.fillText("PONG", 4, Math.floor(this.height/2) + 4);

		this.ctx.globalCompositeOperation = lastCompositeOperation;

	}

	

};

module.exports = WaitEffect;