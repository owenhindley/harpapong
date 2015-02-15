// Visualiser config

var VisConfig = [
	
	{ name : "simpleVideo", path : "./visualisers/simpleVideoPlayer/SimpleVideoPlayer.js", options : { 
			enableBrightness : false,
			brightnessAmount : 0.08, 
		}},
	{ name : "PONGLogo", path : "./visualisers/simpleVideoPlayer/PONGLogo.js", options : { 
			enableBrightness : false,
			brightnessAmount : 0.08, 
		}},

	{ name : "liamBirds", path : "./visualisers/liamBirds/HarpaMeshColorVisualiser.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.05, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}},
	
	{ name : "jonasStars", path : "./visualisers/jonas/Stars.js" }
];


module.exports = VisConfig;

