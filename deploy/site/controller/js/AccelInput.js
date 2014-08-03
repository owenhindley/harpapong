(function(global) {

	var debugCounter  =0;
	
	var AccelInput = {

		value : 0.5,
		velocity : 0,

		compassOrigin : null,

		method : "tilt",
		METHOD_TILT : "tilt",
		METHOD_ACCEL : "accel",
		METHOD_COMPASS : "compass",


		init : function(aMethod){

			if (!aMethod) aMethod = this.METHOD_TILT;

			this.method = aMethod;

			if (window.DeviceOrientationEvent){

				if (this.method == this.METHOD_TILT)
					window.addEventListener('deviceorientation', this.deviceOrientation.bind(this));
				if (this.method == this.METHOD_COMPASS)
					window.addEventListener('deviceorientation', this.deviceCompass.bind(this));
			}

			if (window.DeviceMotionEvent){
				if (this.method == this.METHOD_ACCEL)
					window.addEventListener('devicemotion', this.deviceMotion.bind(this));
				// setInterval(this.update.bind(this), 100);
			}

			

			return this;
		},

		deviceOrientation : function(e){

			if (e.preventDefault)
				e.preventDefault();

			var equivX = Math.max(Math.min(1.0, e.gamma / -60.0), -1.0);
			// var equivY = Math.max(Math.min(0.9, e.beta / -15.0), -0.9);

			this.value = (equivX / -2.0) + 0.5;

			//console.log(this.value);

		},

		deviceCompass : function(e){

			if (e.preventDefault)
				e.preventDefault();

			if (this.compassOrigin == null)
				this.compassOrigin = e.webkitCompassHeading;

			console.log((this.compassOrigin - e.webkitCompassHeading));

			var delta = Math.max(-1.0, Math.min(1.0, ((this.compassOrigin - e.webkitCompassHeading) / 180.0)));

			this.value = delta / 2.0 + 0.5;

			// console.log(this.value);

		},

		deviceMotion : function(e){

			if (e.preventDefault)
				e.preventDefault();

			var accel = e.acceleration;
			console.log(accel.x);

			// normalise
			var delta = Math.abs(accel.x) / 100.0;
			delta = Math.sqrt(delta);
			delta *= (accel.x > 0) ? 1.0 : -1.0;
			//delta *= 0.1;
			

			this.velocity += (accel.x * -0.01);

			//this.velocity = Math.max(-10.0, Math.min(10.0, this.velocity));

			this.update();


		},

		update : function(){


			debugCounter++
			if (debugCounter > 10){
				//console.log(this.value);
				debugCounter = 0;
			}

			this.velocity *= 0.9;

			this.value += this.velocity;
			this.value = Math.max(0.0, Math.min(1.0, this.value));

		}

	};

	global.AccelInput = (global.module || {}).exports = AccelInput;


})(this);