var Canvas = require("canvas");


/*
	This class aims to act as a base for any visualiser classes
	that get created.

	render() will be called at 30fps when installed,
	but on requestAnimationFrame in the browser.


	signal(channel, value) will be called periodically
	from the audio analyser, it's up to you to store this
	data and use it in the visualisation.

*/

var HarpaVisualiserBase = function() {

};

var p = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {

	// Create canvases that'll represent the lights on the
	// front (larger) facade, and the side (smaller - non-square) facade
	// of Harpa
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

	// get references to front & side canvases
	// for when we disconnect
	this.baseFrontCanvas = this.frontCanvas;
	this.baseSideCanvas = this.sideCanvas;

	// this canvas gets used to export out the image buffer data
	this.exportCanvas = new Canvas(sideCanvas.width + frontCanvas.width, Math.max(sideCanvas.height, frontCanvas.height));
	this.exportCtx = this.exportCanvas.getContext('2d');

};


p.render = function() {

	// override this method with your render code

};

p.getBuffer = function() {
	this.exportCtx.drawImage(this.faces.side,0,0);
	this.exportCtx.drawImage(this.faces.front,this.faces.side.width+1,0);
	return this.exportCanvas.toBuffer();
};

p.signal = function(channel, value) {

	// override this method to store and use
	// signals from the audio visualiser

};


module.exports = HarpaVisualiserBase;
