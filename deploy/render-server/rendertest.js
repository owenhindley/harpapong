var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;

var INTERFACE_IP = "2.224.168.149";

var renderer = new ArtnetPixelMapper(INTERFACE_IP);

renderer.setup(1,1, null);

var flag = false;


function invert() {

	if (flag){
		renderer.setAllTo(255,255,255);		
	} else {
		renderer.setAllTo(0,0,0);
	}

	flag = !flag;

	setTimeout(invert, 1000)
};

invert();

