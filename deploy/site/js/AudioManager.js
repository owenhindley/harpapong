(function() {

	var NUM_BOUNCE_SOUNDS = 12;
	var NUM_GOAL_SOUNDS = 2;
	var NUM_ALARM_SOUNDS = 1;
	
	var AudioManager = {

		bounceSounds : [],
		goalSounds : [],
		alarmSounds : [],
		hasPlayedAlarm : false,
		loaded : false,
		controller : false,

		init : function(isController) {

			this.controller = isController;

			if (!soundManager){
				console.log("ERROR : could not find sound manager library");

			} else {
				var that = this;
				soundManager.setup({
					url: '/js/libs/swf/',
					  flashVersion: 9, // optional: shiny features (default = 8)
					  // optional: ignore Flash where possible, use 100% HTML5 mode
					  preferFlash: false,
					  onready: function() {
					    that._onReady();
					  }
					});
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
					var newSound = soundManager.createSound({
						id : "goalSounds" + i,
						url : "/audio/goal-score-" + (i+1) + ".mp3",
						autoLoad : true,
						autoPlay : false
					});
					this.goalSounds.push(newSound);
				}

				for (var i=0; i < NUM_BOUNCE_SOUNDS; i++){
					var newSound = soundManager.createSound({
						id : "bounceSounds" + i,
						url : "/audio/bounce-" + (i+1) + ".mp3",
						autoLoad : true,
						autoPlay : false
					});
					this.bounceSounds.push(newSound);
				}


			} else {

				for (var i=0; i < NUM_ALARM_SOUNDS; i++){
					var newSound = soundManager.createSound({
						id : "alarmSound" + i,
						url : "/audio/alarm-" + (i+1) + ".mp3",
						autoLoad : true,
						autoPlay : false
					});
					this.alarmSounds.push(newSound);
				}

			}


			var silentSound = soundManager.createSound({
				id : "silence",
				url : "/audio/silence.mp3",
				autoLoad : true,
				autoPlay : true,
				onload : function() {
					this.play();
				},
				onfinish : function() {
					this.play();
				}
			});

			this.loaded = true;

		}



	};

	window.AudioManager = AudioManager;


})();