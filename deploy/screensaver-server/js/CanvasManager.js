
var Canvas = require("canvas");
var winston = require("winston");
var msgpack = require("msgpack5")();

var CanvasManager = function(width, height) {

	this.width = width;
	this.height = height;

	this.canvas = new Canvas(this.width, this.height);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.antialias = "none";

	this.tempImgData = null;

	this.debugIndex = 0;


	this.debugColour = "rgb(" + Math.floor(Math.random() * 255) + ",255, 255)";

};

var p = CanvasManager.prototype;


p.draw = function(aCanvas, aAlpha) {
	// aAlpha = aAlpha || 1.0;
	// this.ctx.globalAlpha = aAlpha;
	// this.ctx.drawImage(aCanvas,0,0);

	// DEBUG
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0,0,this.width, this.height);
	this.ctx.fillStyle = this.debugColour;
	this.ctx.fillRect(this.debugIndex, 0, 1, this.height);

	this.debugIndex += 1;
	if (this.debugIndex > this.width) this.debugIndex = 0;
};

p.serialise = function() {
	
	// return msgpack.encode(this.tempImgData);
	return this.canvas.toBuffer();
};


module.exports = CanvasManager;
