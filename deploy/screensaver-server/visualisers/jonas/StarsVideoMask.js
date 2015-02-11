var Canvas = require("canvas");
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var HarpaMeshColorVisualiser = require("../liamBirds/HarpaMeshColorVisualiser.js");
var SimpleVideoPlayer = require("../simpleVideoPlayer/SimpleVideoPlayer.js");
var Stars = require("./Stars.js");

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
    var s = HarpaVisualiserBase.prototype;

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
        s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

        this.videoPlayer = new SimpleVideoPlayer();
        this.videoPlayer.init(frontWidth, frontHeight, sideWidth, sideHeight);

        this.mesh = new Stars();
        this.mesh.init(frontWidth, frontHeight, sideWidth, sideHeight);

    };

    p.render = function() {

        this.videoPlayer.render();
        this.mesh.render();


        this.frontCtx.globalAlpha = 1.0;
        this.frontCtx.fillStyle = "black";
        this.frontCtx.fillRect(0,0,this.faces.front.width, this.faces.front.height);

        this.frontCtx.globalCompositeOperation = "source-over";
        this.frontCtx.globalAlpha = 0.2 + (this.currentBeatValue * 0.8);
        this.frontCtx.drawImage(this.videoPlayer.faces.front,0,0);
        this.frontCtx.globalCompositeOperation = "multiply";
        this.frontCtx.globalAlpha = 1.0;
        
        // this.frontCtx.scale(1/4,1/4);
        this.frontCtx.drawImage(this.mesh.faces.front,0,0);
        // this.frontCtx.scale(1,1);

        this.sideCtx.globalAlpha = 1.0;
        this.sideCtx.fillStyle = "black";
        this.sideCtx.fillRect(0,0,this.faces.side.width, this.faces.side.height);


        this.sideCtx.globalCompositeOperation = "source-over";
        this.sideCtx.globalAlpha = 0.2 + (this.currentBeatValue * 0.8);
        this.sideCtx.drawImage(this.videoPlayer.faces.side,0,0);
        this.sideCtx.globalCompositeOperation = "multiply";
        this.sideCtx.globalAlpha = 1.0;
        // this.sideCtx.scale(1/4,1/4);
        this.sideCtx.drawImage(this.mesh.faces.side,0,0);
        // this.sideCtx.scale(1,1);


        // update beat value
        this.currentBeatValue *= 0.8;

    };

    p.signal = function(channel, value) {


        if (this.mesh)
            this.mesh.signal(channel, value);
        

           
        // store beat values from channel 1
        if (channel == 1){
            this.currentBeatValue = value;
        }

        // store volume values from channel 2
        if (channel == 2){
            this.currentVolume = value;
        }
    };


module.exports = HarpaTestVisualiser;