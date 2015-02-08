var requirejs = require("requirejs");

(function() {
	
	requirejs.config(
		{
			"baseUrl" : "visualisers/wenRipples/js",
			"paths": {
				"alfrid":"alfrid",
				"glMatrix": ["libs/gl-matrix-2.2.2-min"],
				"text": ["libs/text"],
				"SimpleImageLoader": ["bongiovi/SimpleImageLoader"],
				"Scheduler": ["bongiovi/Scheduler"],
				"window" : "window"
			},
			"shim": {
				"glMatrix": "glMatrix",
				"SimpleImageLoader": "SimpleImageLoader",
				"Scheduler": "Scheduler",
				"Perlin": "Perlin",
				"window" : "window"
			}
		}
	);
	
	requirejs(["app"]);
})();