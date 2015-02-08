var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");
var TWEEN = require("./libs/tween.js");
var Perlin = require("./libs/Perlin.js");
var COLOURlovers = require("colourlovers");

	/*

		Example simple Visualiser class

	*/

	var WenVisualiser01 = function() {

		// stores the current volume
		this.currentVolume = 0;

		// stores the current beat envelope / value
		this.currentBeatValue = 0;

		this.waves0 = [];
		this.waves1 = [];
		var scale = 1;
		this.vis0 = new Vis01(37*scale, 13*scale);
		this.vis1 = new Vis01(39*scale, 9*scale);

		// this.colors = [ [255, 78, 80],[252, 145, 58],[249, 212, 35],[237, 229, 116],[225, 245, 196]];
		this.colors = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
		// this.colors = [ [93, 65, 87],[131, 134, 137],[168, 202, 186],[202, 215, 178],[235, 227, 170]];

		// get random colour scheme
		COLOURlovers.get('/palettes/top', {
			format:"json",
			showPaletteWidths:1,
			numResults:1,
			resultOffset:Math.floor(Math.random() * 50)
		}, function(err, data){
			// console.log(data);

			if (data[0].colors){
				this._onColor(data[0]);
			}

		}.bind(this));

		// ColourLovers.getRandomPalette(this, this._onColor);
		// var that = this;
		// window.addEventListener("keypress", function(e) {
		// 	if(e.keyCode == 32) {	//	SPACE BAR
		// 		ColourLovers.getRandomPalette(that, that._onColor);				
		// 	}
		// })

	}

	var p = WenVisualiser01.prototype = new HarpaVisualiserBase();

	var random = function(min, max) { return min + Math.random() * (max - min);	}

	p._onColor = function(color) {
		var getHex = function(str) {
			var r = parseInt(str.substring(1, 3), 16);
			var g = parseInt(str.substring(3, 5), 16);
			var b = parseInt(str.substring(5, 7), 16);

			return [r, g, b];
		}

		for(var i=0; i<color.colors.length; i++) {
			this.colors[i] = getHex(color.colors[i]);
		}

		console.log(this.colors);
	};

	p.render = function() {

		
		TWEEN.update();
		var MAX_WAVES = 10;
		// ** Volume visualisation **

		var threshold = .5;
		var highThreshold = .8;
		if(this.currentBeatValue > threshold) {
			//	CREATE NEW RIPPLE
			var y = Math.random();
			var aspectRatio = this.vis0.width / this.vis0.height;
			var x = random(-aspectRatio/2, 1+aspectRatio/2);

			var wave = new Wave().start(x, y);
			wave.waveLength = (this.currentBeatValue) * .5

			var ary = Math.random() > .5 ? this.waves0 : this.waves1;
			ary.push(wave);
			if(ary.length > MAX_WAVES) ary.shift();
		}
		this.vis0.update(this.waves0, this.colors, false);
		this.vis1.update(this.waves1, this.colors, false);
		// render simple bar on the front

		this.frontCtx.clearRect(0,0,this.faces.front.width,this.faces.front.height);
		this.frontCtx.drawImage(this.vis0.canvas, 0, 0, this.vis0.width, this.vis0.height, 0, 0, this.faces.front.width,this.faces.front.height);

		this.sideCtx.clearRect(0,0,this.faces.side.width, this.faces.side.height);
		this.sideCtx.drawImage(this.vis1.canvas, 0, 0, this.vis1.width, this.vis1.height, 0, 0, this.faces.side.width,this.faces.side.height);
	
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


	global.WenVisualiser01 = (global.module || {}).exports = WenVisualiser01;


	(function() {
		Vis01 = function(width, height) {
			width = width || 37;
			height = height || 13;
			this.aspectRatio = width / height;
			this.width = width;
			this.height = height;
			this.canvas = new Canvas();
			this.canvas.width = width;
			this.canvas.height = height;
			// document.body.appendChild(this.canvas);
			// this.canvas.style.position = "absolute";
			// this.canvas.style.zIndex = 999;
			// this.canvas.style.width = width + "px";
			// this.canvas.style.top = "0px";
			this.count = Math.random() * 0xFFFF;

			this.ctx = this.canvas.getContext("2d");
		}

		var p = Vis01.prototype;

		p.update = function(waves, colors, fullColor) {
			var W = this.canvas.width;
			var H = this.canvas.height;
			this.imgData = this.ctx.getImageData(0, 0, W, H);
			var data = this.imgData.data;
			for(var i=0; i<data.length; i+=4 ) {
				var index = i/4;
				var coord = getCoordFromIndex(index, W);
				coord.x /= W;
				coord.x = contrast(coord.x, this.aspectRatio);
				coord.y /= H;
				var waveHeight = 0;
				for(var j=0; j<waves.length; j++) {
					var wave = waves[j];
					waveHeight += getWaveHeight(wave, coord);
				}


				var blend = Perlin.noise(coord.x, coord.y, this.count);
				blend = waveHeight;
				var c1;
				var c2;
				var offset;

				if(blend < .25) {
					c1 = colors[0];
					c2 = colors[1];
					offset = blend;
				} else if(blend < .5) {
					c1 = colors[1];
					c2 = colors[2];
					offset = blend-.25;
				} else if(blend < .75) {
					c1 = colors[2];
					c2 = colors[3];
					offset = blend-.5;
				} else {
					c1 = colors[3];
					c2 = colors[4];
					offset = blend-.75;
				} 

				if(fullColor) waveHeight = 1.0;
				if(waveHeight > 1.0) waveHeight = 1.0;

				data[i]   = mix(c1[0], c2[0], offset) * waveHeight;
				data[i+1] = mix(c1[1], c2[1], offset) * waveHeight;
				data[i+2] = mix(c1[2], c2[2], offset) * waveHeight;
				data[i+3] = 255;

				// waveHeight *= 255;
				// data[i]   = waveHeight;
				// data[i+1] = waveHeight;
				// data[i+2] = waveHeight;
				// data[i+3] = 255;
			}

			this.count += .01;
			this.ctx.putImageData(this.imgData, 0, 0);
		};


		var getCoordFromIndex = function(index, w) {
			var x = index % w;
			var y = Math.floor(index / w);
			return {x:x, y:y};
		}

		var getWaveHeight = function(wave, coord) {
			var generalWaveHeight = .25;
			var distToWave = distance(wave.center, coord);
			if(Math.abs(distToWave - wave.waveFront) < wave.waveLength) {
				return (1.0 - Math.sin(Math.abs(distToWave - wave.waveFront)/wave.waveLength * Math.PI * .5)) * generalWaveHeight * wave.brightness;
			} else {
				return 0;
			}
		}


		var distance = function(p0, p1) {	return Math.sqrt( (p1.x-p0.x) * (p1.x-p0.x) + (p1.y-p0.y) * (p1.y-p0.y) );	}
		var contrast = function(value, scale) {	return .5 + (value - .5) * scale;	}
		var mix = function(a, b, p) {	return a * p + b * (1.0-p);	}

	})();


	(function() {
		var random = function(min, max) { return min + Math.random() * (max - min);	}

		Wave = function() {
			this.center = {x:.5, y:.5};
			this.waveFront = .0;
			this.duration = random(5000, 13000);
			this.waveLength = random(.05, .15);
			this.brightness = 1.0;
			this.tween;
		}

		var p = Wave.prototype;

		p.start = function(x, y) {
			this.center = {x:x, y:y};
			this.tween = new TWEEN.Tween(this).to({"waveFront":2.5, brightness:0.0}, this.duration).easing(TWEEN.Easing.Cubic.Out).start();
			return this;
		};
	})();

module.exports = WenVisualiser01;