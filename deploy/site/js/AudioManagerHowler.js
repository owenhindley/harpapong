(function() {

	var BOUNCE_SOUND_OFFSET = 9;
	var NUM_BOUNCE_SOUNDS = 5;
	var NUM_GOAL_SOUNDS = 1;
	var NUM_ALARM_SOUNDS = 1;
	
	var AudioManager = {

		bounceSounds : [],
		goalSounds : [],
		alarmSounds : [],
		hasPlayedAlarm : false,
		loaded : false,
		controller : false,
		context : null,
		

		init : function(isController) {

			this.controller = isController;

			// Howler.iOSAutoEnable = true;

			if (!Howler){
				console.log("ERROR : could not find Howl library");

			} else {
				this._onReady();	
			}

			


			return this;
		},

		playBounce : function() {

			if (!this.loaded) return;

			var idx = Math.floor(Math.random() * this.bounceSounds.length);
			var sound = this.bounceSounds[idx];
			if (sound){
				sound.play();
			}

		},

		playGoal : function() {

			if (!this.loaded) return;

			var idx = Math.floor(Math.random() * this.goalSounds.length);
			var sound = this.goalSounds[idx];
			if (sound){
				sound.play();
			}

		},

		playAlarm : function() {

			if (!this.loaded) return;
			if (this.hasPlayedAlarm) return;

			var idx = Math.floor(Math.random() * this.alarmSounds.length);
			var sound = this.alarmSounds[idx];
			if (sound){
				sound.play();
				this.hasPlayedAlarm = true;
			}

		},

		_onReady : function() {

			console.log("Audio Manager ready!");

			if (this.controller){

				for (var i=0; i < NUM_GOAL_SOUNDS; i++){

					var newSound = new Howl({
						urls : ["/audio/goal-score-" + (i+1) + ".mp3"]
					});

					this.goalSounds.push(newSound);
				}

				for (var i=0; i < NUM_BOUNCE_SOUNDS; i++){
					
					var newSound = new Howl({
						urls : ["/audio/bounce-" + (i+1 + BOUNCE_SOUND_OFFSET) + ".mp3"]
					});
					
					this.bounceSounds.push(newSound);
				}


			} else {

				for (var i=0; i < NUM_ALARM_SOUNDS; i++){

					var newSound = new Howl({
						urls : ["/audio/alarm-" + (i+1) + ".mp3"]
					}); 
					this.alarmSounds.push(newSound);
				}

			}


			var silentSound = new Howl({
				urls : ["/audio/silence.mp3"]
			})
			silentSound.play();

			this.loaded = true;

		}



	};

	window.AudioManager = AudioManager;


})();