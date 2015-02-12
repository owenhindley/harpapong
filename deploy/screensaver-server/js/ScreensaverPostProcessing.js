var Canvas = require("canvas");
var Filters = require("../libs/canvas-filters.js");

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

	this.tempImageData = null;

	// this canvas gets used to export out the image buffer data

	this.exportCanvas = new Canvas(sideCanvas.width + frontCanvas.width, Math.max(sideCanvas.height, frontCanvas.height));
	this.exportCtx = this.exportCanvas.getContext('2d');
	this.exportCtx.fillStyle = "black";

	this.ghostCanvas = new Canvas(this.exportCanvas.width, this.exportCanvas.height);
	this.ghostCtx = this.ghostCanvas.getContext("2d");

	this.options = aOptions || {};
	
	if (typeof(this.options.enableContrast) == "undefined") 
		this.options.enableContrast = false;

	if (typeof(this.options.contrastAmount) == "undefined") 
		this.options.contrastAmount = 1;

	if (typeof(this.options.enableBrightness) == "undefined") 
		this.options.enableBrightness = false;

	if (typeof(this.options.brightnessAmount) == "undefined") 
		this.options.brightnessAmount = 0;

	if (typeof(this.options.ghostEnabled) == "undefined") 
		this.options.ghostEnabled = false;

	if (typeof(this.options.ghostAmount) == "undefined") 
		this.options.ghostAmount = 0.1;
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

	// make black
	this.exportCtx.fillRect(0,0,this.exportCanvas.width, this.exportCanvas.height);

	this.exportCtx.globalAlpha = 1.0;

	// render both to export canvas
	this.exportCtx.drawImage(aSideCanvas,0,0);
	this.exportCtx.drawImage(aFrontCanvas,this.faces.side.width+1,0);


	// brightnexx & contrast

	this.tempImageData = this.exportCtx.getImageData(0,0,this.exportCanvas.width, this.exportCanvas.height);
	var brightness = 0;
	var contrast = 1;
	if (this.options.enableBrightness) brightness = this.options.brightnessAmount;
	if (this.options.enableContrast) contrast = this.options.contrastAmount;
	this.tempImageData = Filters.brightnessContrast(this.tempImageData, brightness, contrast);
	
	this.exportCtx.putImageData(this.tempImageData,0,0);
	
	// add a bit of extra lightness, regardless
	this.exportCtx.globalCompositeOperation = "overlay";
	this.exportCtx.fillStyle = "white";
	this.exportCtx.fillRect(0,0,this.exportCanvas.width, this.exportCanvas.height);
	this.exportCtx.globalCompositeOperation = "source-over";

	if (this.options.ghostEnabled){

		this.exportCtx.globalAlpha = this.options.ghostAmount;
		this.exportCtx.drawImage(this.ghostCanvas,0,0);
		this.exportCtx.globalAlpha = 1.0;

	}

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

	this.ghostCtx.drawImage(this.exportCanvas,0,0);

};

p.getBuffer = function() {
	return this.exportCanvas.toBuffer();
};






module.exports = ScreensaverPostProcessing;