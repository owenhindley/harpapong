var DmxClient = require('./DmxClient.js').DmxClient;

var INTERFACE_2_IP = "2.145.222.186";
var INTERFACE_1_IP = "2.224.168.149";



var index = 0;
var value = 255;
var universe = 1;
var interfacebox = 1;

process.argv.forEach(function (val, index, array) {

	if (val.indexOf("level") != -1){
		value = parseInt(val.split("=")[1]);
	}
	if (val.indexOf("universe") != -1){
		universe = parseInt(val.split("=")[1]);		
	}
	if (val.indexOf("interface") != -1){
		interfacebox = parseInt(val.split("=")[1]);		
	}
  	// console.log(index + ': ' + val);
});


var client = new DmxClient((interfacebox == 1) ? INTERFACE_1_IP : INTERFACE_2_IP, universe);

function setChannel() {

	client.setChannel(index, value);
	client.flush();
	index++;
	if (index < 512)
		setTimeout(setChannel, 1);
	else
		process.exit();
}

setChannel();

