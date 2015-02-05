var osc = require("osc-min");
var dgram = require("dgram");

var zmq = require("zmq");

function AudioDataInterface() {

	this.osc_port = 8888;
	this.osc_sock = null;

	this.broadcast_sock = zmq.socket("pub");

};

var p = AudioDataInterface.prototype;


p.init = function(aOscPort, aBroadcastPort) {

	this.osc_port = aOscPort;


	console.log("*** AudioDataInterface listening on osc_port " + this.osc_port + " ***");

	// Incoming OSC data osc_port

	this.osc_sock = dgram.createSocket("udp4", function(msg, rinfo){

		try {

			var dataObj = osc.fromBuffer(msg);

			// console.log(dataObj);

			
			if (dataObj){

				switch(dataObj.address){

					case "/tempo-bang":
						// console.log("TEMPO BANG");
						this.sendTempoBang();
					break;

					case "/rms-db":
						this.sendRMSLevel(dataObj.args[0].value);
					break;

					case "/fft":
						this.sendFFTData(dataObj.args[0].value, dataObj.args[1].value);
					break;
				}

			}

		} catch(_error) {
			error = _error;
			console.log(error);
			console.log("Invalid OSC packet");
		}


	}.bind(this));

	this.osc_sock.bind(this.osc_port);

	console.log("*** and broadcasting one port " + aBroadcastPort + " ***");

	// outgoing (publish) audio data osc_port for visualiser processes
	this.broadcast_sock.bindSync("tcp://127.0.0.1:" + aBroadcastPort);

};

p.sendTempoBang = function() {

	if (this.broadcast_sock){
		this.broadcast_sock.send(["tempoBang", "bang"]);
	}
};

p.sendRMSLevel = function(aLevel){

	if (this.broadcast_sock){
		this.broadcast_sock.send(["rmsLevel", aLevel]);
	}
};

p.sendFFTData = function(aFFT_Bin, aFFT_Value) {

	if (this.broadcast_sock){
		this.broadcast_sock.send(["fft", aFFT_Bin + ":" + aFFT_Value]);
	}

};

p.sendLoudnessChange = function(aLevel) {

	if (this.broadcast_sock){
		this.broadcast_sock.send(["loudnessChange", aLevel]);
	}

};

module.exports = AudioDataInterface;

