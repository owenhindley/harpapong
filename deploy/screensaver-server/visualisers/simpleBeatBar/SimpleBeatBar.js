
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var SimplexNoise = require("./libs/perlin-noise-simplex.js");
var Color = require("./libs/color.js");
var COLOURlovers = require("colourlovers");

/*

    Example simple Visualiser class

*/

var HarpaTestVisualiser = function() {

    // stores the current volume
    this.currentVolume = 0;

    // stores the current beat envelope / value
    this.currentBeatValue = 0;

    this.beatFlip = false;
    this.beatCounter = 0;

    this.colourIndex = 0;
    this.flagColours = [
        "#0048E0",
        "#FFFFFF",
        "#FF0F00"
    ];

    // this.flagColours = [
    //     "#FFFFFF",
    //     "#FFFFFF",
    //     "#FFFFFF"
    // ];

    this.perlinNoise = new SimplexNoise();
    this.perlinNoiseIndex = 0;
    this.perlinNoiseSpeed = 0.05;

    this.noise_intensity = 0.5;


    this.colours = [
        Color('rgb(255,255,255)'),
        // Color('rgb(0,128,255)'),
        // Color('rgb(0,128,50)')
        Color('rgb(0,0,0)'),
        Color('rgb(0,0,0)')
    ];

    // get random colours every interval

    // setInterval(function() {

    //      COLOURlovers.get('/palettes/top', {
    //         format:"json",  
    //         showPaletteWidths:1,
    //         numResults:1,
    //         resultOffset:Math.floor(Math.random() * 50)
    //     }, function(err, data){
    //         // console.log(data);

    //         if (data[0]){
    //               if (data[0].colors){
    //                 for (var i=1; i < 3; i++){
    //                     this.colours[i] = Color("#" + data[0].colors[i]);
    //                     //console.log(data[0].colors[i]);
    //                 }

    //             }
    //         }
          

    //     }.bind(this));

    // }.bind(this), 5 * 1000);
   

}

var p = HarpaTestVisualiser.prototype = new HarpaVisualiserBase();


p.render = function() {

    // clear

    this.frontCtx.globalCompositeOperation = "source-over";
    this.sideCtx.globalCompositeOperation = "source-over";

    // render simple bar on the front
    this.frontCtx.fillStyle = "black";
    this.frontCtx.fillRect(0,0,this.faces.front.width,this.faces.front.height);

    this.frontCtx.fillStyle = "white";


    this.sideCtx.fillStyle = "black";
    this.sideCtx.fillRect(0,0,this.faces.side.width,this.faces.side.height);

    this.sideCtx.fillStyle = "white";



    // ** Volume visualisation **

    // this.frontCtx.globalCompositeOperation = "multiply";
    // this.sideCtx.globalCompositeOperation = "multiply";

    var scaledHeight = 1 - (this.currentVolume / 20000);
    scaledHeight = Math.min(1, scaledHeight);

    scaledHeight *= this.faces.front.height;

    this.frontCtx.fillRect(0,scaledHeight, this.faces.front.width, this.faces.front.height - scaledHeight);

    // render simple bar on the side


    var scaledHeight = 1 - (this.currentVolume / 20000);
    scaledHeight = Math.min(1, scaledHeight);

    scaledHeight *= this.faces.side.height;

    this.sideCtx.fillRect(0,scaledHeight, this.faces.side.width, this.faces.side.height - scaledHeight);

    // ** Beat visualisation **

    this.frontCtx.fillStyle = this.flagColours[this.colourIndex];

    var barWidth = this.currentBeatValue * this.faces.front.width;
    // this.frontCtx.fillRect(this.faces.front.width / 2, 0, barWidth / 2, this.faces.front.height);
    // this.frontCtx.fillRect(this.faces.front.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.front.height);

    var barHeight = this.currentBeatValue * this.faces.front.height;
    this.frontCtx.fillRect(0, this.faces.front.height - barHeight,this.faces.front.width, barHeight);

    this.sideCtx.fillStyle = this.flagColours[this.colourIndex];

    barWidth = this.currentBeatValue * this.faces.side.width;
    // this.sideCtx.fillRect(this.faces.side.width - barWidth, 0, barWidth, this.faces.side.height);
    // this.sideCtx.fillRect(this.faces.side.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.side.height);

    barHeight = this.currentBeatValue * this.faces.side.height;
    this.sideCtx.fillRect(0, this.faces.side.height - barHeight, this.faces.side.width, barHeight);

    // add noise
    
    this.frontCtx.globalCompositeOperation = "multiply";
    this.frontCtx.globalAlpha = this.noise_intensity;
    for (var i=0; i < this.faces.front.width; i++){
        for (var j =0; j < this.faces.front.height; j++){
            this.frontCtx.fillStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 120) + ", " + Math.floor(Math.random() * 120) + ")";
            this.frontCtx.fillRect(i,j, 1,1);
        }
    }

    this.frontCtx.globalCompositeOperation = "source-over";
    this.frontCtx.globalAlpha = 1.0;

    this.sideCtx.globalCompositeOperation = "multiply";
    this.sideCtx.globalAlpha = this.noise_intensity;
    for (var i=0; i < this.faces.side.width; i++){
        for (var j =0; j < this.faces.side.height; j++){
            this.sideCtx.fillStyle = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 120) + ", " + Math.floor(Math.random() * 120) + ")";
            this.sideCtx.fillRect(i,j, 1,1);
        }
    }

    this.sideCtx.globalCompositeOperation = "source-over";
    this.sideCtx.globalAlpha = 1.0;

    // update beat value
    this.currentBeatValue *= 0.8;
};

p.signal = function(channel, value) {

    // store beat values from channel 1
    if (channel == 1){

        // if (this.beatFlip)
            this.currentBeatValue = value;
        this.beatFlip = !this.beatFlip;

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


p.getColour = function(aAlpha) {

    if (aAlpha < 0.5){
        return this.colours[0].blend(this.colours[1], aAlpha / 0.5);
    } else {
        return this.colours[1].blend(this.colours[2], (aAlpha/2.0) / 0.5);
    }
};

module.exports = HarpaTestVisualiser;