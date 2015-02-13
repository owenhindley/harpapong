var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");
var Image = Canvas.Image;
var fs = require("fs");

/*

	Simple Video player

*/

var VIDEOS_AVAILABLE = [
	"PONGLogo"
];

var SimpleVideoPlayer = function() {

	// stores the current volume
	this.currentVolume = 0;

	// stores the current beat envelope / value
	this.currentBeatValue = 0;


}

var p = SimpleVideoPlayer.prototype = new HarpaVisualiserBase();
var s = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
	s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

	var videoIndex = Math.floor(Math.random() * VIDEOS_AVAILABLE.length);

	this.videoSrc = __dirname + "/media/" + VIDEOS_AVAILABLE[videoIndex] + "/";
	// this.videoSrc = __dirname + "/media/video-3/";
	this.frames = [];
	this.frameIndex = 0;

	this.frameImage = new Image();

	this.videoCanvas = new Canvas();
	this.videoCanvas.width = frontWidth + sideWidth;
	this.videoCanvas.height = Math.max(sideHeight, frontHeight);


	this.videoCtx = this.videoCanvas.getContext("2d");

	fs.readdir(this.videoSrc, function(err, files){

		if (err) console.error(err);

		for (var i=0; i< files.length; i++){
			var newFrameImage = new Image();
			newFrameImage.src = this.videoSrc + files[i];
			this.frames.push(newFrameImage);
		}

		console.log("found " + this.frames.length + " frames");

	}.bind(this));

};

p.render = function() {

	if (this.frames.length){


		// clear canvas
		// this.videoCtx.fillStyle = "black";
		// this.videoCtx.fillRect(0,0,this.videoCanvas.width, this.videoCanvas.height);

		this.frameImage = this.frames[this.frameIndex];
		if (this.frameImage.width){
			
			// this.videoCtx.drawImage(this.frameImage,0,0);

			this.sideCtx.globalAlpha = 1.0 - this.currentBeatValue * 0.1;

			this.sideCtx.drawImage(this.frameImage,0,0);
			this.sideCtx.globalAlpha = 1.0;

			this.frontCtx.globalAlpha = 1.0 - this.currentBeatValue * 0.1;
			this.frontCtx.drawImage(this.frameImage,this.faces.side.width, 0, 36, 11,0,0, this.faces.front.width, this.faces.front.height);
			this.frontCtx.globalAlpha = 1.0;
		} else {

			this.frontCtx.fillStyle = "white";
			this.frontCtx.globalAlpha = 1.0 - this.currentBeatValue * 0.5;
			this.frontCtx.fillRect(0,0,this.sides.front.width, this.sides.front.height);
			this.frontCtx.globalAlpha = 1.0;

			this.sideCtx.fillStyle = "white";
			this.sideCtx.globalAlpha = 1.0 - this.currentBeatValue * 0.5;
			this.sideCtx.fillRect(0,0,this.sides.side.width, this.sides.side.height);
			this.sideCtx.globalAlpha = 1.0;
		}
		

		this.frameIndex++;
		if (this.frameIndex >= this.frames.length){
			this.frameIndex = 0;
		}

	}

	// update beat value
	this.currentBeatValue *= 0.8;
};


p.signal = function(channel, value) {

	// store beat values from channel 1
	if (channel == 1){
		this.currentBeatValue = value;
	}

	// store volume values from channel 2
	if (channel == 2){
		this.currentVolume = value;
	}
};

module.exports = SimpleVideoPlayer;