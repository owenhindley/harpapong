(function(global){
	
	var artnet = require('artnet-node');
	var DmxClient = require('./DmxClient.js').DmxClient;
	var Fixture = require('./HarpaFixture.js').Fixture;

	var repatch = {


	};

	var ArtnetPixelMapper = function(ip, universes) {

		this.ip = ip; 
		universes = universes || 6;
		this.clients = [];

		for (var i =1; i<= universes; i++){
			var newClient = new DmxClient(this.ip, i);
			this.clients.push(newClient);
		}

		this.fixtures = [];

	};

	ArtnetPixelMapper.prototype.setup = function(width, height, patchData) {
		
		console.log("Setting up renderer with width : ", width, ", height : ", height);

		//console.log(patchData);

		console.log("patch data at 4, 3 : ", patchData[3][4]);


		// TODO : read in patch data
		// 
		var fixtureChannel = 0;	// look this up from patchdata
		var fixtureUniverse = 3; 

		for (var i=0; i < width; i++){

			this.fixtures.push([]);

			for (var j=0; j < height; j++){

				//console.log("looking up fixture x:", i, " y:", j);

				var fixturePatch = patchData[j][i].split(":");
				fixtureUniverse = parseInt(fixturePatch[0]);
				fixtureChannel = parseInt(fixturePatch[1]);

				//console.log("fixture universe:", fixtureUniverse, " channel:", fixtureChannel);

				var newFixture = new Fixture(this.clients[fixtureUniverse-1], fixtureChannel, fixtureUniverse);
				this.fixtures[i].push(newFixture);

			}

		}

	};

	ArtnetPixelMapper.prototype.setAllTo = function(r,g,b, flush) {

		console.log("setting all fixtures to ", r, g, b);

		for (var i = 0; i < this.fixtures.length; i++){
			for (var j = 0; j < this.fixtures[i].length; j++){
				this.fixtures[i][j].setColor(r,g,b, false);
			}
		}

		if (flush)
		{
			for (var i=0; i < this.clients.length; i++)
				this.clients[i].flush();
		}

	};

	ArtnetPixelMapper.prototype.setPixel = function(x,y,r,g,b) {
		this.fixtures[x][y].setColor(r,g,b);
	};

	ArtnetPixelMapper.prototype.render = function() {
		for (var i=0; i < this.clients.length; i++)
				this.clients[i].flush();
	};

	global.ArtnetPixelMapper = (global.module || {}).exports = ArtnetPixelMapper;

})(this);