var ArtnetPixelMapper = require("./ArtnetPixelMapper.js").ArtnetPixelMapper;
var patch = require("./patchdata/front-main-patch-2.js");

var INTERFACE_IP = "2.224.168.149";

var renderer = new ArtnetPixelMapper(INTERFACE_IP);

renderer.setup(36,12, patch);

var flag = false;

var x = 0;
var y = 0;
//renderer.setPixel(35,0,0,255,255);
//renderer.setPixel(0,11,0,0,255);
//renderer.setPixel(35, 11, 0,255,0);

renderer.setAllTo(0,0,0);
renderer.render();
/*
for (var i=0; i < 35; i++){
	renderer.setPixel(i, 6, 255,0,0);
}
renderer.render();
*/
function drawLine() {
	renderer.setPixel(x, y, 255,0,0);
	//renderer.setPixel(x, 6, 255,0,0);
	//renderer.setPixel(x, 10, 255,0,0);
	renderer.render();
	if (x < 35){
		x++;
		setTimeout(drawLine, 20);

	} else if (x >= 35){
		y++;
		x = 0;
		setTimeout(drawLine, 20);
	}
		
}

drawLine();
//sequence = [133, 94,55,16];



/*
function invert() {

	if (flag){
		renderer.setPixel(x,y,255,255,255);	

		x++;
		if (x > 26){
			x = 0;
			y++;
		}

	} else {
		renderer.setAllTo(0,0,0);
	}

	renderer.render();


	flag = !flag;

	setTimeout(invert, 100)
};

invert();

*/
