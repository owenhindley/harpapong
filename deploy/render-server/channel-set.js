var DmxClient = require('./DmxClient.js').DmxClient;

var INTERFACE_2_IP = "2.145.222.186";
var INTERFACE_1_IP = "2.224.168.149";



var channel = 0;
var value = 255;
var universe = 1;
var interfacebox = 1;

process.argv.forEach(function (val, index, array) {

	if (val.indexOf("channel") != -1){
		channel = parseInt(val.split("=")[1]);
	}

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

var index = 0;
var sequence = [
	'115:4' , '76:4' , '37:4' , '466:3' , '427:3' , '388:3' , '349:3' , '310:3' , '271:3' , '232:3' , '193:3' , '154:3' , '115:3' , '76:3' , '37:3' , '463:2' , '424:2' , '385:2' , '346:2' , '307:2' , '268:2' , '229:2' , '190:2' , '151:2' , '112:2' , '73:2' , '34:2' , '364:1' , '328:1' , '292:1' , '256:1' , '220:1' , '184:1' , '148:1' , '112:1' , '76:1' , '40:1' , '10:1'
];
function next() {
	var seqObject = sequence[index];
	var channel = parseInt(seqObject.split(":")[0]);
	var universe = parseInt(seqObject.split(":")[1]);

	console.log("channel : ", channel, " universe : ", universe);

	client.client.UNIVERSE = [universe, 0];
	client.setChannel(channel, 255);
	client.flush();

	index++;
	if (index < sequence.length)
		setTimeout(next, 500);

}

next();


//client.setChannel(channel, value);
//client.flush();

//process.exit();