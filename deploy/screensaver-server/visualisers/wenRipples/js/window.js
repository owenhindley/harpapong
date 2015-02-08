define([], function() {

	// Shim for window object
	
	var WindowShim = function() {

		this.innerWidth = 36 + 39;
		this.innerHeight = 11;
		
		this.document = {
			addEventListener : function() {}

		};

		this.requestAnimFrame = function() {};

	};

	return WindowShim;
})