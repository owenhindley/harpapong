var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
	/*

	   Christian's Visualiser 001

	*/

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var mscp = {};

	var Circle = function(){


	};

	mscp.Circle = Circle;
	var cp = Circle.prototype;

	cp.init = function(i, rgb, rev){

		this._pos = [0,0];
		this._radius = i * 6 + 1;
		this._scale = [1,1];

		this._rgb = rgb;

		this._rev = false;
		if (rev)
			this._rev = true;

		

	};

	cp.render = function(ctx, face, normalizedVol){

		ctx.save();

		ctx.translate(face.width/2, face.height/2);

		var alpha = 1.0;
		ctx.globalAlpha = 1.0;
		ctx.strokeStyle = 'rgb('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+')';
		ctx.lineWidth = 1;

		ctx.beginPath();
		var radius = Math.abs(this._radius*normalizedVol - this._radius);
		if (this._rev)
			radius = this._radius*normalizedVol;
		
		ctx.arc(0, 0, radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		ctx.globalAlpha = 1.0;
   
	};



	var Square = function(){};

	mscp.Square = Square;
	var cp = Square.prototype;

	cp.init = function(i, rgb, offset){

		this._pos = [0,0];
		this._scale = [1,1];

		this._rgb = rgb;

		this._index = Math.abs(i - 19);

		this._w = 2;
		this._h = 1;
		this._yOffset = offset;
		

	};

	cp.render = function(ctx, face, normalizedVol){

		ctx.save();

		// var alpha = this._index/29;
		this._rgb[0] = Math.floor(this._index * 10);
		// this._rgb[1] = Math.floor(this._index * 10);
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = 'rgb('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+')';
		
		ctx.beginPath();
		ctx.fillRect(this._index*this._w, face.height * normalizedVol - this._yOffset, this._w, this._h);
		// ctx.arc(0, 0, this._radius*normalizedVol, 0, Math.PI*2, true);
		ctx.closePath();
		// ctx.stroke();
		// ctx.restore();
	};





	var HarpaMSCP001 = function() {

		// stores the current volume
		this.currentVolume = 0;
		this.lastVolumeSampleTime = Date.now();

		// stores the current beat envelope / value
		this.currentBeatValue = 0;

		this._beatCircles = [];
		this._volCircles = [];
		
		this._volHistory = [];
		this._volHistory.push(0);


		this._historyCounter = 0;
		this._historyCounterThreshold = 5;

		this._btmSquares = [];
		this._middleSquares = [];
		this._topSquares = [];

	};

	var p = HarpaMSCP001.prototype = new HarpaVisualiserBase();
	var s = HarpaVisualiserBase.prototype;

	p.init = function(frontWidth, frontHeight, sideWidth, sideHeight){

		s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

		var beatCirleRgb = [200,10,100];
		var volCircleRgb = [100,200,200];

		var btmSquaresRgb = [200,10,200];
		var middleSquaresRgb = [250,120,100];
		var topSquaresRgb = [10, 200 ,200];

		for (var i=0;i<3;i++){
			var circle = new mscp.Circle();
			circle.init(i, beatCirleRgb, true);

			this._beatCircles.push(circle);
		}

		for (var i=0;i<4;i++){
			var circle = new mscp.Circle();
			circle.init(i, volCircleRgb);

			this._volCircles.push(circle);
		}

		for (var i=0;i<20;i++){
			var square = new mscp.Square();
			square.init(i, btmSquaresRgb, 2);

			this._btmSquares.push(square);
		}

		// for (var i=0;i<20;i++){
		//     var square = new mscp.Square();
		//     square.init(i, middleSquaresRgb, 2);

		//     this._middleSquares.push(square);
		// }

		// for (var i=0;i<20;i++){
		//     var square = new mscp.Square();
		//     square.init(i, topSquaresRgb, 1);

		//     this._topSquares.push(square);
		// }
	};

   

   


	p.render = function() {



		// ** Volume visualisation **

		
		this.frontCtx.globalAlpha = 1.0;
		this.frontCtx.fillStyle = "black";
		this.frontCtx.fillRect(0,0,this.faces.front.width,this.faces.front.height);
		this.frontCtx.fillStyle = "white";
		this.frontCtx.globalAlpha = 1.0;

		// this.frontCtx.fillStyle = "rgba(10,200,10,.7)";

		var normalizedVol = 1 - (this.currentVolume/2);

		// var scaledHeight = 1 - (this.currentVolume / 20000);
		normalizedVol = Math.min(1, normalizedVol);

		this._volHistory.unshift(normalizedVol);

		// normalizedVol *= this.faces.front.height;

		// console.log('history: ',this._volHistory[0], '   ',this._volHistory[1]);

		for (var i=0;i<this._beatCircles.length;i++){

			var volVal = i == 0 ? this.currentBeatValue : this.currentBeatValue;
			this._beatCircles[i].render(this.frontCtx, this.faces.front, volVal);
		}

		for (var i=0;i<this._volCircles.length;i++){

			var volVal = i == 0 ? this._volHistory[0] : this._volHistory[0];
			this._volCircles[i].render(this.frontCtx, this.faces.front, volVal);
		}

		
		this.sideCtx.globalAlpha = 1.0;
		this.sideCtx.fillStyle = "black";
		this.sideCtx.fillRect(0,0,this.faces.side.width,this.faces.side.height);
		this.sideCtx.fillStyle = "white";
		this.sideCtx.globalAlpha = 1.0;

		var volVal = 0;
		for (var i=0;i<this._btmSquares.length;i++){

			// var volVal = 0;
			if (i == 0){
				volVal = this._volHistory[0];
			} else {
				volVal = this._volHistory[i *3];
			}
		  
			// var volVal = parseFloat(i == 0 ? this._volHistory[0] : this._volHistory[i*3]);
			volVal = (volVal);
			this._btmSquares[i].render(this.sideCtx, this.faces.side, volVal);
			

		}
		// this console log is here to ensure things work. fuck knows why.
		console.log(volVal);


		// for (var i=0;i<this._middleSquares.length;i++){
 
		//     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[i*4];

		//     this._middleSquares[i].render(this.sideCtx, this.faces.side, volVal);
		// }

		// for (var i=0;i<this._topSquares.length;i++){

		//     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[i*4];

		//     this._topSquares[i].render(this.sideCtx, this.faces.side, volVal);
		// }

		if (this._volHistory.length > 60)
			this._volHistory.pop();


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
			var dateNow = Date.now();
			if (dateNow - this.lastVolumeSampleTime > 50){
				this.currentVolume = value;
				this.lastVolumeSampleTime = dateNow;	
			}
			
		}
	};


module.exports = HarpaMSCP001;