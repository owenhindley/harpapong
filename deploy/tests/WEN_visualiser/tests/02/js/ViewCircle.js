// ViewCircle.js

define(["alfrid/View", "alfrid/GLTool", "alfrid/Mesh", "text!../assets/shaders/copy.vert", "text!../assets/shaders/ripple.frag"], function(View, GLTool, Mesh, strVertShader, strFragShader) {

	var random = function(min, max) { return min + Math.random() * (max - min);	}

	var ViewCircle = function() {
		this.count = 0;
		this.x = this.y = .5;
		View.call(this, strVertShader, strFragShader);
	};

	var p = ViewCircle.prototype = new View();
	var s = View.prototype;

	var MAX_WAVES = 10;

	p._init = function() {
		var positions = [];
		var coords = [];
		var indices = [0,1,2,0,2,3];

		var size = 1;
		positions.push([-size, -size, 0]);
		positions.push([size, -size, 0]);
		positions.push([size, size, 0]);
		positions.push([-size, size, 0]);

		coords.push([0, 0]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 1]);

		this.mesh = new Mesh(4, 6, GLTool.gl.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);

		params.gap = .003;
		params.generalWaveHeight = .6;
		params.fixCenter = false;

		var gui = new dat.GUI({width:300});
		gui.add(params, "generalWaveHeight", 0, 2).step(.1);
		gui.add(params, "fixCenter");

		this.waves = new Array(5);

		var that = this;
		this.sound = Sono.load({
		    id: 'street',
		    url: ['assets/tv1.mp3'],
		    volume: 0.5,
		    loop: true,
		    onComplete: function(sound) {
		    	that.analyser = sound.effect.analyser(32);
		    }
		});

		this.soundOffset = 0;
		this.preSoundOffset = 0;
		this.sound.play();

		// GLTool.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
	};


	p._onMouseDown = function(e, isBeat, volume) {
		var x, y;
		if(e) {
			x = e.layerX / 1024;
			y = 1.0 - e.layerY / 1024;
		} else {
			// x = Math.random();
			y = Math.random();
			var aspectRatio = 39/11;
			x = random(-aspectRatio/2, 1+aspectRatio/2);
			// y = random(.3, .7);

			if(params.fixCenter) x = y = .5;
		}
		var wave = new Wave().start(x, y);
		if(volume) {
			wave.waveLength.duration *= (.5 + volume * .5);
		}
		this.waves.push(wave);

		if(this.waves.length > MAX_WAVES) this.waves.shift();
		if(!isBeat) {
			this.soundBass.play();
		}
		// console.log('New Wave , Number of waves : ', this.waves.length);
	};

	p.render = function(aTexture, mx, my) {
		TWEEN.update();

		//	SOUND
		var soundOffset = 0;
		if(this.analyser) {
			var f = this.analyser.getFrequencies();
			for(var i=0; i<f.length; i++) {
				soundOffset += f[i];	
			}
			soundOffset /= ( f.length * 100);
		}

		var beatThreshold = .3;
		if(soundOffset - this.preSoundOffset > beatThreshold) {
			this.preSoundOffset = soundOffset;
			this.soundOffset = soundOffset;
			this._onMouseDown(null, true, soundOffset);
		}
		this.soundOffset += ( 0 - this.soundOffset ) * .01;
		this.preSoundOffset -= .02;
		if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;

		if(!this.shader.isReady())return;
		this.shader.bind();
		this.shader.uniform("time", "uniform1f", this.count * .01);
		this.shader.uniform("generalWaveHeight", "uniform1f", params.generalWaveHeight);
		for(var i=0; i<MAX_WAVES; i++) {
			var wave = this.waves[i];
			if( wave == undefined) {
				this.shader.uniform("waveCenter"+i, "uniform2fv", [.5, .5]);
				this.shader.uniform("waveFront"+i, "uniform1f", -1);
				this.shader.uniform("waveLength"+i, "uniform1f", 0);
			} else {
				this.shader.uniform("waveCenter"+i, "uniform2fv", wave.center);
				this.shader.uniform("waveFront"+i, "uniform1f", wave.waveFront);
				this.shader.uniform("waveLength"+i, "uniform1f", wave.waveLength);
			}
		}
		aTexture.bind(0);
		GLTool.draw(this.mesh);

		this.count ++;
	};

	return ViewCircle;
	
});


(function() {
	var random = function(min, max) { return min + Math.random() * (max - min);	}

	Wave = function() {
		this.center = [.5, .5];
		this.waveFront = .0;
		this.duration = random(5000, 13000);
		this.waveLength = random(.1, .25);
		this.tween;
	}

	var p = Wave.prototype;

	p.start = function(x, y) {
		this.center = [x, y];
		this.tween = new TWEEN.Tween(this).to({"waveFront":2.5}, this.duration).easing(TWEEN.Easing.Cubic.Out).start();
		return this;
	};
})();