
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

/*

    Example simple Visualiser class

*/

var HarpaTestVisualiser = function() {

    // stores the current volume
    this.currentVolume = 0;

    // stores the current beat envelope / value
    this.currentBeatValue = 0;

}

var p = HarpaTestVisualiser.prototype = new HarpaVisualiserBase();


p.render = function() {



    // ** Volume visualisation **

    // render simple bar on the front
    this.frontCtx.fillStyle = "black";
    this.frontCtx.fillRect(0,0,this.faces.front.width,this.faces.front.height);

    this.frontCtx.fillStyle = "white";

    var scaledHeight = 1 - (this.currentVolume / 20000);
    scaledHeight = Math.min(1, scaledHeight);

    scaledHeight *= this.faces.front.height;

    this.frontCtx.fillRect(0,scaledHeight, this.faces.front.width, this.faces.front.height - scaledHeight);

    // render simple bar on the side

    this.sideCtx.fillStyle = "black";
    this.sideCtx.fillRect(0,0,this.faces.side.width,this.faces.side.height);

    this.sideCtx.fillStyle = "white";

    var scaledHeight = 1 - (this.currentVolume / 20000);
    scaledHeight = Math.min(1, scaledHeight);

    scaledHeight *= this.faces.side.height;

    this.sideCtx.fillRect(0,scaledHeight, this.faces.side.width, this.faces.side.height - scaledHeight);

    // ** Beat visualisation **

    this.frontCtx.fillStyle = "rgba(255,255,0,1)";

    var barWidth = this.currentBeatValue * this.faces.front.width;
    this.frontCtx.fillRect(this.faces.front.width / 2, 0, barWidth / 2, this.faces.front.height);
    this.frontCtx.fillRect(this.faces.front.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.front.height);

    this.sideCtx.fillStyle = "rgba(255,255,0,1)";

    barWidth = this.currentBeatValue * this.faces.side.width;
    this.sideCtx.fillRect(this.faces.side.width / 2, 0, barWidth / 2, this.faces.side.height);
    this.sideCtx.fillRect(this.faces.side.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.side.height);

    // update beat value
    this.currentBeatValue *= 0.8;
};

p.signal = function(channel, value) {

    // store volume values from channel 1
    if (channel == 1){
        this.currentBeatValue = value;
    }

    // store beat values from channel 2
    if (channel == 2){
        this.currentVolume = value;
    }
};

module.exports = HarpaTestVisualiser;