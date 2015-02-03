var Scheduler = function() {

	this.mode = Scheduler.MODE_BLACKOUT;

	// this.times = {
	//
	// 	0.0 : Scheduler.MODE_GAME,
	// 	2.0 : Scheduler.MODE_SHIMMER,
	// 	6.0 : Scheduler.MODE_BLACKOUT,
	// 	19.0 : Scheduler.MODE_SHIMMER,
	// 	21.3 : Scheduler.MODE_GAME
	// }

	this.times = {

		0.0 : Scheduler.MODE_SCREENSAVER
	}


}

Scheduler.MODE_BLACKOUT = "schedulerModeBlackout";
Scheduler.MODE_SHIMMER = "schedulerModeShimmer";
Scheduler.MODE_GAME = "schedulerModeGame";
Scheduler.MODE_SCREENSAVER = "schedulerModeScreensaver";

var p = Scheduler.prototype;

p.update = function() {

	var time = new Date();
	var hours = parseInt(time.getHours());
	var minutes = time.getMinutes();

	var timeValue = hours + (minutes / 100);

	console.log(timeValue);

	var newMode = null;

	for (var idx in this.times){
		if (parseFloat(idx) < timeValue){
			newMode = this.times[idx];
		}
	}

	if (newMode != null){
		console.log("setting mode to ", newMode);
		this.mode = newMode;
	}

};


module.exports = Scheduler;
