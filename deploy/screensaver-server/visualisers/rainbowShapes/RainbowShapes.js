var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");

/*

	'Rainbow' FFT Visualiser
	Owen Hindley 2015

*/
var FFT_WEIGHTING = [
1.828571429,1.828571429,1.828571429,1.828571429,1.828571429,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,0.9142857143,
];

var RainbowShapesVisualiser = function() {

	// stores the current volume
	this.currentVolume = 0;

	// stores the current beat envelope / value
	this.currentBeatValue = 0;
	this.altBeatValue = 0;
	this.beatFlip = false;

	// stores the current FFT
	this.fft = {};


	this.tempImgData = null;
	this.tempCanvas = null;


	this.barStep = 0.14;
}


var p = RainbowShapesVisualiser.prototype = new HarpaVisualiserBase();
var s = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
	s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

	console.log("** RainbowShapesVisualiser 01     **");
	console.log("** Owen Hindley 2015       **");
	console.log("**                         **");

   
	this.startBand = 3;
	this.stopBand = 30;

	this.barStepFront = frontHeight / (this.stopBand - this.startBand);
	this.barStepSide = sideHeight / (this.stopBand - this.startBand);



}



p.render = function() {

	this.updateCounter++;
	if (this.updateCounter > 5){
		this.update();
		this.updateCounter = 0;
	}


	// DRAW FFT overlay

  
	this.frontCtx.fillStyle = "black";
	this.frontCtx.fillRect(0,0,this.frontCtx.canvas.width, this.frontCtx.canvas.height);

	this.frontCtx.fillStyle = "red";
	this.frontCtx.save();

	var weighting = 1;
	var binIntensity = 0;
	var rgb = null;
	for (var i=this.stopBand; i > this.startBand; i--){

		// this.frontCtx.fillStyle = "rgb(255," + (i * 4) + ",0)";
		// this.frontCtx.globalAlpha = Math.min(1.0, (parseFloat(this.fft[i]) * 5));
		
		binIntensity = Math.min(1.0, (parseFloat(this.fft[i]) * 5));
		rgb = HSVtoRGB(binIntensity, Math.min(1.0, binIntensity * 2), (0.8 + 1*0.2 * this.currentBeatValue));
		this.frontCtx.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";

		// this.frontCtx.fillStyle = "rgb(" + (i * 4)  + ",0, 255)";

		weighting = FFT_WEIGHTING[i];

		this.frontCtx.fillRect(0,0,this.frontCtx.canvas.width, this.barStepFront * weighting * 0.5);
		

		if (i != 64)
			this.frontCtx.translate(0, this.barStepFront * FFT_WEIGHTING[i-1] * 0.5);

	}

	this.frontCtx.save();
	this.frontCtx.translate(this.frontCtx.canvas.width/2,0);

	this.frontCtx.rotate(Math.PI);
	
	this.frontCtx.drawImage(this.frontCtx.canvas,0,0, this.frontCtx.canvas.width, this.frontCtx.canvas.height/2, -this.frontCtx.canvas.width/2,-this.frontCtx.canvas.height/2, this.frontCtx.canvas.width, this.frontCtx.canvas.height/2);
	this.frontCtx.restore();

	this.frontCtx.restore();

	// triangles

	 this.frontCtx.globalCompositeOperation = "multiply";

	// draw show (reveal) shape

	var inverseBeat = 0.0;
	if (this.beatFlip)
	 inverseBeat = 1.0 - this.altBeatValue;
	else
	 inverseBeat = 1.0 - this.currentBeatValue;

	
	this.frontCtx.fillStyle = (this.beatFlip) ? "black" : "white";
	
	this.frontCtx.beginPath();
	this.frontCtx.moveTo(this.frontCtx.canvas.width/2 - (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height);
	this.frontCtx.closePath();
	this.frontCtx.fill();

	this.frontCtx.beginPath();
	
	this.frontCtx.moveTo(this.frontCtx.canvas.width/2 + (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height);
	this.frontCtx.closePath();
	this.frontCtx.fill();


	// draw inverse (hide) shape

	if (this.beatFlip)
	 inverseBeat = 1.0 - this.currentBeatValue;
	else
	 inverseBeat = 1.0 - this.altBeatValue;

	

	// triangles
	this.frontCtx.fillStyle = (this.beatFlip) ? "white" : "black";

	this.frontCtx.beginPath();
	this.frontCtx.moveTo(this.frontCtx.canvas.width/2 - (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height);
	this.frontCtx.closePath();
	this.frontCtx.fill();

	this.frontCtx.beginPath();
	
	this.frontCtx.moveTo(this.frontCtx.canvas.width/2 + (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height);
	this.frontCtx.closePath();
	this.frontCtx.fill();


	
	// this.frontCtx.beginPath();
	// this.frontCtx.moveTo(0,0);
	// this.frontCtx.lineTo(0, this.frontCtx.canvas.height);
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2 - (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	// // this.frontCtx.lineTo(6, this.frontCtx.canvas.height);
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2, 0);
	// this.frontCtx.lineTo(0, 0);
	// this.frontCtx.closePath();
	// this.frontCtx.fill();

	// this.frontCtx.beginPath();
	// this.frontCtx.moveTo(this.frontCtx.canvas.width,0);
	// this.frontCtx.lineTo(this.frontCtx.canvas.width, this.frontCtx.canvas.height);
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2 + (this.frontCtx.canvas.width/2 * inverseBeat), this.frontCtx.canvas.height);
	// // this.frontCtx.lineTo(6, this.frontCtx.canvas.height);
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height - (this.frontCtx.canvas.height * inverseBeat));
	
	// this.frontCtx.lineTo(this.frontCtx.canvas.width/2, 0);
	// this.frontCtx.lineTo(0, 0);
	// this.frontCtx.closePath();
	// this.frontCtx.fill();


	this.frontCtx.globalCompositeOperation = "source-over";

	// side

	this.sideCtx.fillStyle = "black";
	this.sideCtx.fillRect(0,0,this.sideCtx.canvas.width, this.sideCtx.canvas.height);

	this.sideCtx.fillStyle = "red";
	this.sideCtx.save();

	weighting = 1;
	
	
	for (var i=this.stopBand; i > this.startBand; i--){

		
		binIntensity = Math.min(1.0, (parseFloat(this.fft[i]) * 5));
		

		rgb = HSVtoRGB(binIntensity, Math.min(1.0, binIntensity * 2), (0.8 + 1*0.2* this.currentBeatValue) );
		this.sideCtx.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";

		
		weighting = FFT_WEIGHTING[i];

		this.sideCtx.fillRect(0,0,this.sideCtx.canvas.width, this.barStepSide * weighting);

		if (i != 64)
			this.sideCtx.translate(0, this.barStepSide * FFT_WEIGHTING[i-1]);

	}


	this.sideCtx.restore();

	// update beat value
	if (this.beatFlip){

		this.currentBeatValue *= 0.9;
	}
	else {

		this.altBeatValue *= 0.9;
	}


};

p.update = function() {

};

p.signal = function(channel, value) { 

	// store beat values from channel 2
	if (channel == 1){
		
		this.beatFlip = !this.beatFlip;
		if (this.beatFlip){
			this.currentBeatValue = value;
		} else {
			this.altBeatValue = value;
		}
	}

	 // store volume values from channel 1
	else if (channel == 2){
		this.currentVolume = value;
	}

	else if (channel == 3){
		var bucket = parseInt(value.split(":")[0]);
		var value = parseFloat(value.split(":")[1]);

		// scale values
		value = Math.min(1, Math.pow(value, 0.5));

		this.fft[bucket] = value;
	}
};


function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (h && s === undefined && v === undefined) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.floor(r * 255),
		g: Math.floor(g * 255),
		b: Math.floor(b * 255)
	};
}

module.exports = RainbowShapesVisualiser;