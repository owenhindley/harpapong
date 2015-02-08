// Visualiser config

var VisConfig = [
	{ name : "conway01", path : "./visualisers/conway01/ConwayVisualiser01.js", 
		options : { 
			enableBrightness : true,
			brightnessAmount : 0.15, 
			ghostEnabled : true,
			ghostAmount : 0.5
		}},
	{ name : "simpleBeatBar", path : "./visualisers/simpleBeatBar/SimpleBeatBar.js", 
		options : { 
			enableBrightness : false, 
			ghostEnabled : true,
			ghostAmount : 0.8
		}},
	// { name : "simpleBeatLines", path : "./visualisers/simpleBeatLines/SimpleBeatLinesVisualiser.js"},
	{ name : "rainbow", path : "./visualisers/rainbowFFT/RainbowVisualiser.js"},
	// { name : "rainbowShapes", path : "./visualisers/rainbowShapes/RainbowShapes.js"},
	{ name : "perlinShapes", path : "./visualisers/perlinShapes/PerlinShapes.js"},
	{ name : "christian_001", path : "./visualisers/christian/HarpaMSCP001.js", options : { 
			enableBrightness : false, 
			ghostEnabled : true,
			ghostAmount : 0.2
		}},
	{ name : "christian_002", path : "./visualisers/christian/HarpaMSCP004.js", options : { 
			enableBrightness : false, 
			ghostEnabled : true,
			ghostAmount : 0.8
		}},
	{ name : "crash_and_burn", path : "./visualisers/crashAndBurn/CrashAndBurn.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.15, 
			ghostEnabled : true,
			ghostAmount : 0.5
		}},
	{ name : "symbolRipples", path : "./visualisers/symbolRipples/SymbolRipplesVisualiser.js",
		options : { 
			enableBrightness : true,
			brightnessAmount : 0.05, 
		}},
	{ name : "wenRipples", path : "./visualisers/wenRipples2D/WenRipples.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.05, 
		}},
	{ name : "aurora", path : "./visualisers/aurora/AuroraVisualiser.js"},
	{ name : "simpleVideo", path : "./visualisers/simpleVideoPlayer/SimpleVideoPlayer.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.15, 
		}},

	{ name : "liamBirds", path : "./visualisers/liamBirds/HarpaMeshColorVisualiser.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.05, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}},
	{ name : "videoMask", path : "./visualisers/liamBirds/HarpaVideoMaskMesh.js",  options : { 
			enableBrightness : true,
			brightnessAmount : 0.1, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}}
];


module.exports = VisConfig;

