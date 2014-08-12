var Fixture = function(client, channel, universe){
    this.client  = client;
    this.channel = channel;
    this.universe = universe;
}; 

Fixture.prototype.setColor = function(r, g, b, flush){

   // console.log("fixture on channel ", this.channel, " setting to ", r ,g, b);

    this.client.setChannel(this.channel, r);
    this.client.setChannel(this.channel + 1, g);
    this.client.setChannel(this.channel + 2, b);

    if(flush)
        this.flush();
};

Fixture.prototype.flush = function() {
    this.client.UNIVERSE = [this.universe, 0];
    this.client.flush();
};


module.exports.Fixture = Fixture;