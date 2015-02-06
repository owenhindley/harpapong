var Canvas = require("canvas");

/*
	
	Post-processing for each visualiser
	playing with contrast, glow, fading etc

*/


var ScreensaverPostProcessing = function() {



};

var p = ScreensaverPostProcessing.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight, aOptions) {

	var frontCanvas = new Canvas();
	var sideCanvas = new Canvas();


	frontCanvas.antialias = "none";
	sideCanvas.antialias = "none";

	frontCanvas.width = frontWidth;
	frontCanvas.height = frontHeight;
	sideCanvas.width = sideWidth;
	sideCanvas.height = sideHeight;

	this.faces = {
		front : frontCanvas,
		side : sideCanvas
	};

	this.frontCtx = frontCanvas.getContext("2d");
	this.sideCtx = sideCanvas.getContext("2d");

	// fading in/out
	this.fadeValue = 1;
	this.targetFadeValue = 1;

	// this canvas gets used to export out the image buffer data
	this.exportCanvas = new Canvas(sideCanvas.width + frontCanvas.width, Math.max(sideCanvas.height, frontCanvas.height));
	this.exportCtx = this.exportCanvas.getContext('2d');

	this.options = aOptions || {};
	
	if (typeof(this.options.enableContrast) == "undefined") 
		this.options.enableContrast = false;

	if (typeof(this.options.contrastAmount) == "undefined") 
		this.options.contrastAmount = 0.5;

	if (typeof(this.options.enableBrightness) == "undefined") 
		this.options.enableBrightness = false;

	if (typeof(this.options.brightnessAmount) == "undefined") 
		this.options.brightnessAmount = 0.1;
};



p.fadeIn = function() {
	this.fadeValue = 1.0;
	this.targetFadeValue = 0.0;
};

p.fadeOut = function() {
	this.fadeValue = 0.0;
	this.targetFadeValue = 1.0;
};

p.processCanvases = function(aFrontCanvas, aSideCanvas) {

	this.exportCtx.globalAlpha = 1.0;

	// render both to export canvas
	this.exportCtx.drawImage(aSideCanvas,0,0);
	this.exportCtx.drawImage(aFrontCanvas,this.faces.side.width+1,0);


	// TODO : contrast


	// TODO : brightness


	// Fading
	var fadeDiff = Math.abs(this.targetFadeValue - this.fadeValue)
	if (fadeDiff > 0.01){

		fadeDiff *= 0.1;
		this.fadeValue = (this.targetFadeValue > this.fadeValue) ? this.fadeValue + fadeDiff : this.fadeValue - fadeDiff;
	} else {
		this.fadeValue = this.targetFadeValue;
	}

	this.exportCtx.globalAlpha = this.fadeValue;
	this.exportCtx.fillStyle = "black";
	this.exportCtx.fillRect(0,0,this.exportCanvas.width, this.exportCanvas.height);

};

p.getBuffer = function() {
	return this.exportCanvas.toBuffer();
};






module.exports = ScreensaverPostProcessing;