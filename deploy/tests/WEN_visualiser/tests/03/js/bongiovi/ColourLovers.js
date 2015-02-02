// ColourLovers.js

ColourLovers = {
	API_URL:"http://www.colourlovers.com/api/",
	PALLET_URL:"http://www.colourlovers.com/api/palettes/top",
	hasInited:false
};

ColourLovers.callback = function(data) {
	var colorWidths = data[0].colorWidths;
	var colors = data[0].colors;

	var returnColors = [];
	for(var i=0; i<colors.length; i++) {
		returnColors.push("#" + colors[i]);
	}

	if(this._callback) this._callback.call(this._scope, {colors:returnColors, colorWidths:colorWidths});
	try {
		document.getElementsByTagName('HEAD')[0].removeChild(this.script);	
	} catch(e) {
		
	}
	
}


ColourLovers.getRandomPalette = function(scope, callback) {
	this._scope = scope;
	this._callback = callback;
	var q = {
		format:"json",
		showPaletteWidths:1,
		numResults:1,
		resultOffset:Math.floor(Math.random() * 50),
		jsonCallback:"ColourLovers.callback"
	}

	this.script = document.createElement('script');
	this.script.type = 'text/javascript';
	this.script.src = ColourLovers.PALLET_URL + query(q);
	document.getElementsByTagName('HEAD')[0].appendChild(this.script);
}


// --------------------------------------------------
//
// helpers
//
// --------------------------------------------------


function query( params ) {
    var list = [];
    for ( var key in params ) list.push( key + '=' + escape( params[ key ] ) );
    return '?' + list.join( '&' );
}
