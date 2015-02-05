var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");

/*

    'Rainbow' FFT Visualiser
    Owen Hindley 2015

*/

var RainbowVisualiser = function() {

    // stores the current volume
    this.currentVolume = 0;

    // stores the current beat envelope / value
    this.currentBeatValue = 0;
    this.beatFlip = false;

    // stores the current FFT
    this.fft = {};


    this.tempImgData = null;
    this.tempCanvas = null;


}

var p = RainbowVisualiser.prototype = new HarpaVisualiserBase();
var s = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
    s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

    console.log("** RainbowVisualiser 01     **");
    console.log("** Owen Hindley 2015       **");
    console.log("**                         **");

   

}


p.render = function() {

    this.updateCounter++;
    if (this.updateCounter > 5){
        this.update();
        this.updateCounter = 0;
    }


    // DRAW FFT overlay

    this.frontCtx.fillStyle = "black";
    this.frontCtx.fillRect(0,0,this.frontCtx.canvas.width, this.frontCtx.canvas.height);

    this.frontCtx.fillStyle = "red";
    this.frontCtx.save();

    // this.frontCtx.scale(64, 1);
    
    for (var i=16; i > 0; i--){

        // this.frontCtx.globalAlpha = 64.0 / i;
        this.frontCtx.globalAlpha = this.fft[i];
        this.frontCtx.fillRect(0,i * 0.15, this.frontCtx.canvas.width, 1);
    }

    this.frontCtx.restore();

};

p.update = function() {

};

p.signal = function(channel, value) { 

    // store beat values from channel 2
    if (channel == 1){
        this.currentBeatValue = value;
        this.beatFlip = !this.beatFlip;
    }

     // store volume values from channel 1
    else if (channel == 2){
        this.currentVolume = value;
    }

    else if (channel == 3){
        var bucket = parseInt(value.split(":")[0]);
        var value = parseFloat(value.split(":")[1]);

        // scale values
        value = Math.min(1, Math.pow(value, 0.5));

        this.fft[bucket] = value;
    }
};

module.exports = RainbowVisualiser;