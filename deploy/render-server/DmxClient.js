var artnet = require('artnet-node');

var Client = function(ip, universe){
    this.ip      = ip;
    this.universe = universe;
    this.port    = 6454;
    this.client  = new artnet.Client.ArtNetClient(this.ip, this.port);
    this.client.UNIVERSE = [this.universe,0];
    this.dmx_dta = new Array(512);
};
Client.prototype.setChannel = function(channel, value){
    this.dmx_dta[channel-1] = value;
};
Client.prototype.flush = function(){
    this.client.send(this.dmx_dta);
};


module.exports.DmxClient = Client;