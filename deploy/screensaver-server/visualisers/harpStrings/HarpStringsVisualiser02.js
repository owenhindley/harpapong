var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");
var Color = require("./libs/color.js");

var INITIAL_STRING_NUMBER = 3;
	var AGE_LIMIT = 1000;

	var beatValue = 0;

	Canvas.Context2d.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
	    if (dashLen == undefined) dashLen = 2;
	    this.moveTo(x1, y1);

	    var dX = x2 - x1;
	    var dY = y2 - y1;
	    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
	    var dashX = dX / dashes;
	    var dashY = dY / dashes;

	    var q = 0;
	    while (q++ < dashes) {
	        x1 += dashX;
	        y1 += dashY;
	        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
	    }
	    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
	};

	var HarpString = function() {

		this.twangAmount = 0;
		this.fadeAmount = 1;
		this.x = 0;
		this.y = 0;

		this.age = Math.random() * AGE_LIMIT * 0.5;

	};

	var p = HarpString.prototype;

	p.init = function(aY1, aY2, aDistance, aColourStart, aColourEnd, aCtx) {

		this.ctx = aCtx;
		this.y1 = aY1;
		this.y2 = aY2;
		this.distance = aDistance;
		this.colourStart  = aColourStart;
		this.colourEnd  = aColourEnd;
		this.gradientStyle = aCtx.createLinearGradient(0,0, this.ctx.canvas.width, this.ctx.canvas.height);

		var hueCycle = (Math.floor(Math.random() * 2) * 270) % 360;
		var startColor = new Color(this.colourStart);
		var endColor = new Color(this.colourEnd);

		// cycle hues
		startColor = startColor.setHue((startColor.getHue() + hueCycle) % 360);
		endColor = endColor.setHue((endColor.getHue() + hueCycle) % 360);

		startColor.setHue(hueCycle);

		this.gradientStyle.addColorStop(0, startColor.toString());
		this.gradientStyle.addColorStop(1, endColor.toString());
		console.log(startColor.toString());
		console.log(endColor.toString());

		this.twangGradient = aCtx.createLinearGradient(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.twangGradient.addColorStop(0, "#FFFF00");
		this.twangGradient.addColorStop(1, "#FFFFFF");
	};

	p.render = function(ctx) {

		
		ctx.lineWidth = Math.floor(this.distance * 1);
		ctx.globalAlpha = (0.4 + (this.distance * 0.6)) * this.fadeAmount;
		

		if (this.twangAmount == 0){

			
			ctx.beginPath();
			ctx.moveTo(ctx.canvas.width, this.y2);
			var y = this.y2;
			var x = ctx.canvas.width;


			// for (var i=0; i< ctx.canvas.width; i++){
			// 	y += (this.y1 - y) * (1.0/(ctx.canvas.width));
			// 	// y += (Math.random() -0.5) * this.twangAmount * ctx.canvas.width * 0.1; 
			// 	ctx.lineTo(--x,y);
			// }

			// ctx.lineTo(0,this.y2);
			ctx.dashedLine(ctx.canvas.width, this.y2, 0, this.y2, 5);
			ctx.globalAlpha = 1.0;
			ctx.strokeStyle = this.gradientStyle;
			ctx.stroke();


			ctx.closePath();

		} else {

			ctx.strokeStyle = this.twangGradient;
			ctx.beginPath();
			ctx.moveTo(ctx.canvas.width, this.y2);
			var y = this.y2;
			var x = ctx.canvas.width;
			for (var i=0; i< ctx.canvas.width; i++){
				y += (this.y1 - y) * (1.0/(ctx.canvas.height));
				y += (Math.random() -0.5) * this.twangAmount * ctx.canvas.height * 0.3; 
				ctx.lineTo(--x,y);
			}
			
			


			ctx.globalAlpha = 1.0 - this.twangAmount;
			ctx.strokeStyle = this.gradientStyle;
			ctx.stroke();


			ctx.globalAlpha = this.twangAmount;
			ctx.strokeStyle = this.twangGradient;
			ctx.stroke();

			ctx.closePath();
				
			if (this.twangAmount > 0.001)
				this.twangAmount *= 0.9;
			else{

				this.twangAmount = 0;

			}



		}

		ctx.globalAlpha = 1.0;

		// if we're starting to fade, continue
		if (this.fadeAmount < 1)
			this.fadeAmount *= 0.99;
		

		this.age++;

	};

	p.twang = function() {

		this.twangAmount = 1.0;
		this.age *= 0.4;
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

		// // create one string
		// this.createNewString();

		// pre-populate with strings
		for (var i=0; i < INITIAL_STRING_NUMBER; i++){
			this.createNewString(i / INITIAL_STRING_NUMBER);
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
		if (this.movement > this.stringCanvas.height) this.movement = 0;

		this.stringCtx.translate(0, this.movement);

		for (var i =0; i < this.strings.length; i++){
			this.strings[i].render(this.stringCtx);
		}

		this.stringCtx.translate(0, -this.stringCanvas.height);

		for (var i =0; i < this.strings.length; i++){
			this.strings[i].render(this.stringCtx);
		}

		this.stringCtx.restore();


		this.frontCtx.drawImage(this.stringCanvas,this.faces.side.width,0, this.faces.front.width, this.faces.front.height,0,0,this.faces.front.width,this.faces.front.height);
		this.sideCtx.drawImage(this.stringCanvas,0,0);

		beatValue *= 0.9;

	};

	p.createNewString = function(offset) {

		var newString = new HarpString();

		var newY1 = offset * this.stringCanvas.height;
		var newY2 = newY1;
		var newDistance = 1.0;
		newString.init(newY1, newY2, newDistance, "#FFEE22", "#22EEFF", this.stringCtx);

		this.strings.push(newString);

	};

	p.twangRandomString = function() {

		
		if (this.strings.length){
			var stringIndex = Math.floor(Math.random() * (this.strings.length));

			// console.log(stringIndex);

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

			beatValue = value;

			if (value == 1){

				this.twangRandomString();

				// if (this.beatFlip)
				// 	this.createNewString();
				
			} 
		}
	};




module.exports = HarpStringsVisualiser;