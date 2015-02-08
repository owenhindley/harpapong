
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

var Config = require("./js/config.js");
var requirejs = require("requirejs");
var Canvas = require("canvas");

var ViewFrontFace = requirejs("ViewFrontFace");
var ViewSideFace = requirejs("ViewSideFace");
var ViewCircle = requirejs("ViewCircle");
var GL = requirejs("alfrid/GLTool");
var GLTexture = requirejs("alfrid/GLTexture");
var FrameBuffer = requirejs("alfrid/FrameBuffer");
var ViewCopy = requirejs("alfrid/ViewCopy");

/*

    Wen's Ripples visualiser

*/

var WenRipplesVisualiser = function() {

    // stores the current volume
    this.currentVolume = 0;

    // stores the current beat envelope / value
    this.currentBeatValue = 0;

    this.beatCounter = 0;


}

var p = WenRipplesVisualiser.prototype = new HarpaVisualiserBase();
var s = HarpaVisualiserBase.prototype;

p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
    s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

    


};


p.render = function() {


    // update beat value
    this.currentBeatValue *= 0.8;
};

p.signal = function(channel, value) {

    // store beat values from channel 1
    if (channel == 1){
        this.currentBeatValue = value;

        if (this.beatCounter > 8){
            this.colourIndex++;
            this.beatCounter = 0;
            if (this.colourIndex > this.flagColours.length){
                this.colourIndex = 0;
            }
        }
        this.beatCounter++;
    }

    // store volume values from channel 2
    if (channel == 2){
        this.currentVolume = value;
    }
};

module.exports = WenRipplesVisualiser;