var DmxClient = require('./DmxClient.js').DmxClient;

var INTERFACE_IP = "2.224.168.149";

var client = new DmxClient(INTERFACE_IP, 1);

var index = 0;
var value = 255;

function setChannel() {

	client.setChannel(index, value);
	client.flush();
	index++;
	console.log("index : ", index, " value : ", value);
	if (index < 512)
		setTimeout(setChannel, 500);
}

setChannel();