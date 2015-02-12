var Canvas = require("canvas");
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

/*

	Example simple Visualiser class

*/

var SimpleBeatLinesVisualiser = function() {

	// stores the current volume
	this.currentVolume = 0;

	// stores the current beat envelope / value
	this.currentBeatValue = 0;

}

var p = SimpleBeatLinesVisualiser.prototype = new HarpaVisualiserBase();
var s = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
	s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

	this.tempFrontCanvas = new Canvas(this.frontCtx.canvas.width, this.frontCtx.canvas.height);
	this.tempSideCanvas = new Canvas(this.sideCtx.canvas.width, this.sideCtx.canvas.height);

	this.tempFrontCtx = this.tempFrontCanvas.getContext("2d");
	this.tempSideCtx = this.tempSideCanvas.getContext("2d");

	this.lineIndex = 0;
	this.lineSpacing = 4;

}

p.render = function() {

	// clear canvas
	this.frontCtx.fillStyle = "black";
	this.frontCtx.fillRect(0,0,this.faces.front.width, this.faces.front.height);

	this.sideCtx.fillStyle = "black";
	this.sideCtx.fillRect(0,0,this.faces.side.width, this.faces.side.height);

	// render radiating lines

	// front
	this.lineIndex += 0.1;

	if (this.lineIndex > this.lineSpacing) this.lineIndex = 0;

	this.frontCtx.fillStyle = "white";
	this.frontCtx.globalCompositeOperation = "source-over";
	// var numLines = Math.floor((this.faces.front.width / this.lineSpacing) / 2);
	var numLines = Math.floor((this.faces.front.width / this.lineSpacing) / 1);
	var centerX = Math.floor(this.faces.front.width / 2);
	for (var i = 0; i < numLines; i++){
		// this.frontCtx.globalAlpha = (1.0 - (numLines / i));
		this.frontCtx.globalAlpha = 0.2 * (numLines - i);
		// this.frontCtx.fillRect(centerX + (i * this.lineSpacing) + this.lineIndex, 0, 1, this.faces.front.height);
		// this.frontCtx.fillRect(centerX - (i * this.lineSpacing) - this.lineIndex, 0, 1, this.faces.front.height);
		if (Math.random() > 0.95){
			this.frontCtx.fillStyle = "rgb(232, 21, 125)";
		}else {
			this.frontCtx.fillStyle = "white";
		}
		this.frontCtx.fillRect((i * this.lineSpacing) + this.lineIndex, 0, 3, this.faces.front.height);
		// this.frontCtx.fillRect(centerX - (i * this.lineSpacing) - this.lineIndex, 0, 1, this.faces.front.height);
	}
	this.frontCtx.globalAlpha = 1.0;

	this.sideCtx.fillStyle = "white";
	this.sideCtx.globalCompositeOperation = "source-over";
	var numLines = Math.floor((this.faces.side.width / this.lineSpacing));
	for (var i = 0; i < numLines; i++){
		// this.frontCtx.globalAlpha = (1.0 - (numLines / i));
		this.sideCtx.globalAlpha = 0.2 * ((numLines - i));
		if (Math.random() > 0.94){
			this.sideCtx.fillStyle = "rgb(232, 21, 125)";
		}else {
			this.sideCtx.fillStyle = "white";
		}
		this.sideCtx.fillRect(this.faces.side.width - (i * this.lineSpacing) - this.lineIndex, 0, 3, this.faces.side.height);
		
	}
	this.sideCtx.globalAlpha = 1.0;

	// ** Beat visualisation **

	

	this.tempFrontCtx.fillStyle = "black";
	this.tempFrontCtx.fillRect(0,0,this.faces.front.width, this.faces.front.height);

	this.tempFrontCtx.fillStyle = "white";

	var barWidth = (1 - this.currentBeatValue) * this.faces.front.width;
	// this.tempFrontCtx.fillRect(this.faces.front.width / 2, 0, barWidth / 2, this.faces.front.height);
	// this.tempFrontCtx.fillRect(this.faces.front.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.front.height);
	this.tempFrontCtx.fillRect(0, 0, barWidth, this.faces.front.height);

	this.frontCtx.globalCompositeOperation = "multiply"
	this.frontCtx.drawImage(this.tempFrontCanvas,0,0);

	this.tempSideCtx.fillStyle = "black";
	this.tempSideCtx.fillRect(0,0,this.faces.front.width, this.faces.front.height);

	this.tempSideCtx.fillStyle = "white";
	

	barWidth = (1 - this.currentBeatValue) * this.faces.side.width;
	this.tempSideCtx.fillRect(this.faces.side.width - barWidth, 0, barWidth, this.faces.side.height);
	
	this.sideCtx.globalCompositeOperation = "multiply";
	this.sideCtx.drawImage(this.tempSideCanvas,0,0);

	// update beat value
	this.currentBeatValue *= 0.95;
};

p.signal = function(channel, value) {

	// store volume values from channel 1
	if (channel == 1){
		this.currentBeatValue = value;
	}

	// store beat values from channel 2
	if (channel == 2){
		this.currentVolume = value;
	}
};

module.exports = SimpleBeatLinesVisualiser;