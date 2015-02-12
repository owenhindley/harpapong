// Visualiser config

var VisConfig = [
	{ name : "conway01", path : "./visualisers/conway01/ConwayVisualiser01.js", 
		options : { 
			enableBrightness : false,
			brightnessAmount : 0.15, 
			ghostEnabled : true,
			ghostAmount : 0.2
		}},
	// { name : "conwayVideoMask", path : "./visualisers/conway01/ConwayVideoMask.js", 
	// 	options : { 
	// 		enableBrightness : false,
	// 		brightnessAmount : 0.0, 
	// 		ghostEnabled : true,
	// 		ghostAmount : 0.5
	// 	}},
	{ name : "simpleBeatBar", path : "./visualisers/simpleBeatBar/SimpleBeatBar.js", 
		options : { 
			enableBrightness : false, 
			ghostEnabled : true,
			ghostAmount : 0.2
		}},
	{ name : "simpleBeatLines", path : "./visualisers/simpleBeatLines/SimpleBeatLinesVisualiser.js"},
	// { name : "rainbow", path : "./visualisers/rainbowFFT/RainbowVisualiser.js"},
	// { name : "rainbowShapes", path : "./visualisers/rainbowShapes/RainbowShapes.js"},
	//{ name : "perlinShapes", path : "./visualisers/perlinShapes/PerlinShapes.js"},
	// { name : "christian_001", path : "./visualisers/christian/HarpaMSCP001.js", options : { 
	// 		enableBrightness : false, 
	// 		ghostEnabled : true,
	// 		ghostAmount : 0.2
	// 	}},
	{ name : "christian_002", path : "./visualisers/christian/HarpaMSCP004.js", options : { 
			enableBrightness : false, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}},
	{ name : "crash_and_burn", path : "./visualisers/crashAndBurn/CrashAndBurn.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.15, 
			ghostEnabled : true,
			ghostAmount : 0.5
		}},
	{ name : "symbolRipples", path : "./visualisers/symbolRipples/SymbolRipplesVisualiser.js"},
	// { name : "wenRipples", path : "./visualisers/wenRipples2D/WenRipples.js", options : { 
	// 		enableBrightness : true,
	// 		brightnessAmount : 0.05, 
	// 	}},
	// { name : "wenRipplesVideoMask", path : "./visualisers/wenRipples2D/WenRipplesVideoMask.js", options : { 
	// 		enableBrightness : true,
	// 		brightnessAmount : 0.05, 
	// 	}},
	// { name : "aurora", path : "./visualisers/aurora/AuroraVisualiser.js"},
	{ name : "simpleVideo", path : "./visualisers/simpleVideoPlayer/SimpleVideoPlayer.js", options : { 
			enableBrightness : false,
			brightnessAmount : 0.08, 
		}},

	{ name : "liamBirds", path : "./visualisers/liamBirds/HarpaMeshColorVisualiser.js", options : { 
			enableBrightness : true,
			brightnessAmount : 0.05, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}},
	{ name : "liamBirdsvideoMask", path : "./visualisers/liamBirds/HarpaVideoMaskMesh.js",  options : { 
			enableBrightness : true,
			brightnessAmount : 0.1, 
			ghostEnabled : true,
			ghostAmount : 0.6
		}},
	// { name : "eduConway", path : "./visualisers/eduConway/EduVisualiser.js" },
	{ name : "jonasLines", path : "./visualisers/jonas/Lines.js", options : { 
			enableBrightness : false,
			brightnessAmount : 0.1, 
			ghostEnabled : true,
			ghostAmount : 0.2
		} },
	{ name : "jonasLissajious", path : "./visualisers/jonas/Lissajious.js" },
	{ name : "jonasStars", path : "./visualisers/jonas/Stars.js" },
	// { name : "jonasLinesVideoMask", path : "./visualisers/jonas/LinesVideoMask.js",
	// 	options : { 
	// 		enableBrightness : false,
	// 		brightnessAmount : 0.15, 
	// 		ghostEnabled : true,
	// 		ghostAmount : 0.5
	// 	}
	//  },
	// { name : "jonasLissajiousVideoMask", path : "./visualisers/jonas/LissajiousVideoMask.js", options : { 
	// 		enableBrightness : true,
	// 		brightnessAmount : 0.15, 
	// 		ghostEnabled : true,
	// 		ghostAmount : 0.5
	// 	} },
	// { name : "jonasStarsVideoMask", path : "./visualisers/jonas/StarsVideoMask.js", options : { 
	// 		enableBrightness : false,
	// 		brightnessAmount : 0.15, 
	// 		ghostEnabled : true,
	// 		ghostAmount : 0.5
	// 	} },
	{ name : "simpleBeatLinesVideoMask", path : "./visualisers/simpleBeatLines/SimpleBeatVideoMask.js" }
];


module.exports = VisConfig;

