// Visualiser config

var VisConfig = [

	{ name : "symbolRipples", path : "./visualisers/symbolRipples/SymbolRipplesVisualiser.js"},
	// { name : "wenRipples", path : "./visualisers/wenRipples2D/WenRipples.js", options : { 
	// 		enableBrightness : true,
	// 		brightnessAmount : 0.05, 
	// 	}},
	// { name : "wenRipplesVideoMask", path : "./visualisers/wenRipples2D/WenRipplesVideoMask.js", options : { 
	// 		enableBrightness : true,
	// 		brightnessAmount : 0.05, 
	// 	}},
	{ name : "aurora", path : "./visualisers/aurora/AuroraVisualiser.js"},
	{ name : "simpleVideo", path : "./visualisers/simpleVideoPlayer/SimpleVideoPlayer.js", options : { 
			enableBrightness : false,
			brightnessAmount : 0.08, 
		}},

	
];


module.exports = VisConfig;

