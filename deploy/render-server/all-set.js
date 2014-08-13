var DmxClient = require('./DmxClient.js').DmxClient;

var INTERFACE_1_IP = "2.145.222.186";
var INTERFACE_2_IP = "2.224.168.149";

var client = new DmxClient(INTERFACE_1_IP, 1);

var index = 0;
var value = 255;

process.argv.forEach(function (val, index, array) {

	if (val.indexOf("level") != -1){
		value = parseInt(val.split("=")[1]);
	}
  	// console.log(index + ': ' + val);
});


function setChannel() {

	client.setChannel(index, value);
	client.flush();
	index++;
	if (index < 512)
		setTimeout(setChannel, 10);
	else
		process.exit();
}

setChannel();

