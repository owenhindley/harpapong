/*
	
	External process for running a particular visualiser

*/


var AppConfig = require("../common/Config.js");
var zmq = require("zmq");

var visualiser_path = process.argv[2];
console.log("path : ", visualiser_path);

var VisualiserClass = require(visualiser_path);

var visualiser = new VisualiserClass();
var socket_transmit = zmq.socket("push");
var socket_audio_data_in = zmq.socket("sub");

var socket_address = null;

/*
	Commands from host process
*/

process.on("message", function(message) {

	// console.log(message);

	switch(message.cmd){

		case "init":
			visualiser.init(message.front.width, message.front.height, message.side.width, message.side.height);
		break;

		case "connect":
			socket_address = message.address;
			socket_transmit.bindSync(socket_address);

		break;

		case "disconnect":
			socket_transmit.disconnect(socket_address);

		break;

		case "render":
			visualiser.render();
			if (socket_transmit){
				socket_transmit.send(visualiser.getBuffer());
			}

		break;

	}

});

/*
	Audio data
*/

socket_audio_data_in.connect("tcp://127.0.0.1:" + AppConfig.PORT_AUDIO_DATA_PUB);

socket_audio_data_in.subscribe("tempoBang");
socket_audio_data_in.subscribe("rmsLevel");
socket_audio_data_in.subscribe("fft");
socket_audio_data_in.subscribe("loudnessChange");

socket_audio_data_in.on("message", function(subject, message) {

	if (visualiser){

		var channel = subject.toString();
		switch(channel){

			case "tempoBang":
				visualiser.signal(1, 1);
			break;

			case "rmsLevel":
				visualiser.signal(2, parseFloat(message.toString()));
			break;

			case "fft":
				visualiser.signal(3, message.toString());
			break;

		}

	}
	

})

// keep this process alive
process.stdin.resume();