var PongConfig = {
	"PORT_SCREENSAVER_IMG_SEND" : 3001,
	"PORT_SCREENSAVER_CMD" : 3000,
	"PORT_AUDIO_DATA_PUB" : 3002,
	"PORT_OSC_RECEIVE" : 8887,

	ips : {
		queue_server : {
			url : "46.149.24.223",
			port : 8080
		},
		game_server : {
			url : "46.149.24.223",
			port : 8081
		}
	}
};

if (typeof(module) != "undefined")
	module.exports = PongConfig;