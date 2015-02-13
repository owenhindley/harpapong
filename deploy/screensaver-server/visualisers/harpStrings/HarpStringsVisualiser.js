var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");
var Color = require("./libs/color.js");


	/*

		Harpa Strings visualiser

	*/

	var INITIAL_STRING_NUMBER = 20;
	var AGE_LIMIT = 1000;

	var HarpString = function() {

		this.twangAmount = 0;
		this.fadeAmount = 1;
		this.x = 0;
		this.y = 0;

		this.age = Math.random() * AGE_LIMIT * 0.5;

	};

	var p = HarpString.prototype;

	p.init = function(aX1, aX2, aDistance, aColourStart, aColourEnd, aCtx) {

		this.ctx = aCtx;
		this.x1 = aX1;
		this.x2 = aX2;
		this.distance = aDistance;
		this.colourStart  = aColourStart;
		this.colourEnd  = aColourEnd;
		this.gradientStyle = aCtx.createLinearGradient(this.x1,aCtx.canvas.height, this.x2, 0);
		this.gradientStyle.addColorStop(0, this.colourStart);
		this.gradientStyle.addColorStop(1, this.colourEnd);

		this.twangGradient = this.ctx.createLinearGradient(this.x1,this.ctx.canvas.height, this.x2, 0);
		this.twangGradient.addColorStop(0, "#00FF23");
		this.twangGradient.addColorStop(1, "#FFFFFF");
	};

	p.render = function(ctx) {

		
		ctx.lineWidth = Math.floor(this.distance * 3);
		ctx.globalAlpha = 1.0;
		

		if (this.twangAmount == 0){

			ctx.strokeStyle = this.gradientStyle;
			ctx.beginPath();
			ctx.moveTo(this.x2,ctx.canvas.height);
			var x = this.x2;
			var y = ctx.canvas.height;
			for (var i=0; i< ctx.canvas.height; i++){
				x += (this.x1 - x) * (1.0/(ctx.canvas.height));
				// x += (Math.random() -0.5) * this.twangAmount * ctx.canvas.width * 0.1; 
				ctx.lineTo(x,--y);
			}

			// ctx.lineTo(this.x1,0);
			ctx.stroke();
			ctx.closePath();

		} else {

			
			ctx.beginPath();
			ctx.moveTo(this.x2,ctx.canvas.height);
			var x = this.x2;
			var y = ctx.canvas.height;
			for (var i=0; i< ctx.canvas.height; i++){
				x += (this.x1 - x) * (1.0/(ctx.canvas.height));
				x += (Math.random() -0.5) * this.twangAmount * ctx.canvas.width * 0.1; 
				ctx.lineTo(x,--y);
			}
		

			ctx.globalAlpha = 1.0 - this.twangAmount;
			ctx.strokeStyle = this.gradientStyle;
			ctx.stroke();


			ctx.globalAlpha = this.twangAmount;
			ctx.strokeStyle = this.twangGradient;
			ctx.stroke();



			ctx.closePath();
				
			if (this.twangAmount > 0.001)
				this.twangAmount *= 0.95;
			else{

				this.twangAmount = 0;

			}



		}

		ctx.globalAlpha = 1.0;

		// // if we're starting to fade, continue
		// if (this.fadeAmount < 1)
		// 	this.fadeAmount *= 0.99;
		

		this.age++;

	};

	p.twang = function() {

		this.twangAmount = 1.0;
		this.age *= 0.8;
		this.fadeAmount = 1;

	};


	var HarpStringsVisualiser = function() {

		// stores the current volume
		this.currentVolume = 0;

		// stores the current beat envelope / value
		this.currentBeatValue = 0;
		this.beatFlip = false;

		this.strings = [];
		this.movement = 0;
		this.movementIncrement = 0.01;

	}

	var p = HarpStringsVisualiser.prototype = new HarpaVisualiserBase();
	var s = HarpaVisualiserBase.prototype;

	 p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
		s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

		this.stringCanvas = new Canvas();
		this.stringCtx = this.stringCanvas.getContext("2d");
		this.stringCanvas.width = frontWidth + sideWidth;
		this.stringCanvas.height = Math.max(frontHeight, sideHeight);


		// pre-populate with strings
		for (var i=0; i < INITIAL_STRING_NUMBER; i++){
			this.createNewString();
		}
	}

	p.render = function() {

		this.stringCtx.fillStyle = "black";
		this.stringCtx.fillRect(0,0,this.stringCanvas.width, this.stringCanvas.height);

		// fade out ageing strings
		// & remove faded-out strings
		// for (var i=0; i < this.strings.length; i++){
		// 	if (this.strings[i].age > AGE_LIMIT && this.strings[i].fadeAmount == 1){
		// 		this.strings[i].fadeAmount = 0.9;
		// 	}

		// 	if (this.strings[i].fadeAmount < 0.1){
		// 		this.strings.splice(i, 1);
		// 	}
		// }

		// translate
		this.stringCtx.save();
		
		this.movement += this.movementIncrement;
		if (this.movement > this.stringCanvas.width/2) this.movement = 0;

		this.stringCtx.translate(this.movement,0);

		for (var i =0; i < this.strings.length; i++){
			this.strings[i].render(this.stringCtx);
		}

		this.stringCtx.translate(this.movement - this.stringCanvas.width,0);

		for (var i =0; i < this.strings.length; i++){
			this.strings[i].render(this.stringCtx);
		}

		this.stringCtx.restore();


		this.frontCtx.drawImage(this.stringCanvas,this.faces.side.width,0, this.faces.front.width, this.faces.front.height,0,0,this.faces.front.width,this.faces.front.height);
		this.sideCtx.drawImage(this.stringCanvas,0,0);

	};

	p.createNewString = function() {

		var newString = new HarpString();

		var newX1 = Math.floor(Math.random() * this.stringCanvas.width);
		var newX2 = newX1 + (Math.random() - 0.5) * this.stringCanvas.width * 0;
		var newDistance = Math.random();
		newString.init(newX1, newX2, newDistance, "#2b2b2b", "#666666", this.stringCtx);

		this.strings.push(newString);

	};

	p.twangRandomString = function() {

		if (this.strings.length){
			var stringIndex = Math.floor(Math.random() * this.strings.length -1);

			

			if (this.strings[stringIndex])
				this.strings[stringIndex].twang();
		}
		

	};

	p.signal = function(channel, value) {

		// store volume values from channel 2
		if (channel == 2){
			this.currentVolume = value;
		}

		// store beat values from channel 1
		if (channel == 1){
			this.currentBeatValue = value;
			this.beatFlip = !this.beatFlip;

			if (value == 1){

				this.twangRandomString();

				// if (this.beatFlip)
				// 	this.createNewString();
				
			} 
		}
	};


module.exports = HarpStringsVisualiser;