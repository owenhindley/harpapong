(function() {
	
	requirejs.config(
		{
			"paths": {
				"alfrid":"alfrid",
				"glMatrix": ["libs/gl-matrix-2.2.2-min"],
				"text": ["libs/text"],
				"SimpleImageLoader": ["bongiovi/SimpleImageLoader"],
				"Scheduler": ["bongiovi/Scheduler"]
			},
			"shim": {
				"glMatrix": "glMatrix",
				"SimpleImageLoader": "SimpleImageLoader",
				"Scheduler": "Scheduler",
				"Perlin": "Perlin"
			}
		}
	);
	
	requirejs(["app"]);
})();