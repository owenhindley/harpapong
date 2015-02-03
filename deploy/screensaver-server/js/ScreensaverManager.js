var Canvas = require("canvas");
var winston = require("winston");

var CanvasManager = require("./CanvasManager.js");

var ScreensaverManager = function() {


	// stores the CanvasManagers for each face
	this.faces = [];

	this.visualiserIndex = 0;
	this.visualisers = [];

	this.canvas = new Canvas(0,0);
	this.ctx = this.canvas.getContext("2d");

	this.offsets = [0];

};

var p = ScreensaverManager.prototype;


p.addFace = function(aWidth, aHeight) {
	var newFace = new CanvasManager(aWidth, aHeight);
	this.faces.push(newFace);

	this.canvas.width += aWidth;
	this.canvas.height = Math.max(this.canvas.height, aHeight);
	this.offsets.push(aWidth+1);
};

p.addVisualiser = function(aInstance) {
	this.visualisers.push(aInstance);
};

p.render = function() {

	// TODO: crossfading
	// this.visualisers[this.visualiserIndex].render(this.faces);

	// debug
	this.faces[0].draw();
	this.faces[1].draw();

};

p.getFace = function(aIndex){
	return this.faces[aIndex].serialise();
};

p.getAllFaces = function() {
	for (var i =0; i < this.faces.length; i++){
		this.ctx.drawImage(this.faces[i].canvas, this.offsets[i], 0);
	}
	return this.canvas.toBuffer();
};


module.exports = ScreensaverManager;
