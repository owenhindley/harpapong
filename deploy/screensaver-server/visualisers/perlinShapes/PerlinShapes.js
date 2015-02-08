
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var SimplexNoise = require("./libs/perlin-noise-simplex.js");
var Color = require("./libs/color.js");
var COLOURlovers = require("colourlovers");

/*

    Example simple Visualiser class

*/

var PerlinShapesVisualiser = function() {

    // stores the current volume
    this.currentVolume = 0;

    // stores the current beat envelope / value
    this.currentBeatValue = 0;
    this.altBeatValue = 0;

    this.beatFlip = false;
    this.beatCounter = 0;

    this.colourIndex = 0;
    // this.flagColours = [
    //     "#0048E0",
    //     "#FFFFFF",
    //     "#FF0F00"
    // ];

    this.flagColours = [
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF"
    ];

    this.perlinNoise = new SimplexNoise();
    this.perlinNoiseIndex = 0;
    this.perlinNoiseSpeed = 0.05;


    this.colours = [
        Color('rgb(255,255,255)'),
        // Color('rgb(0,128,255)'),
        // Color('rgb(0,128,50)')
        Color('rgb(0,0,0)'),
        Color('rgb(0,0,0)')
    ];

    // get random colours every interval

    setInterval(function() {

         COLOURlovers.get('/palettes/top', {
            format:"json",  
            showPaletteWidths:1,
            numResults:1,
            resultOffset:Math.floor(Math.random() * 50)
        }, function(err, data){
            // console.log(data);

            if (data[0].colors){
                for (var i=1; i < 3; i++){
                    this.colours[i] = Color("#" + data[0].colors[i]);
                    //console.log(data[0].colors[i]);
                }

            }

        }.bind(this));

    }.bind(this), 5 * 1000);
   

}

var p = PerlinShapesVisualiser.prototype = new HarpaVisualiserBase();


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


    // add some perlin noise 

    var noisevalue = 0;
    var colour = null;
    this.perlinNoiseIndex += (this.perlinNoiseSpeed * this.currentBeatValue);

    // front face
    
    for (i =0; i < this.faces.front.width; i++){
        for (j = 0; j < this.faces.front.height; j++){
            noisevalue = Math.abs(this.perlinNoise.noise3d(i/10,j/10, this.perlinNoiseIndex))+ 0.5;
            colour = this.getColour(noisevalue - (this.currentBeatValue * 0.5));
            this.frontCtx.fillStyle = colour.toCSS();
            this.frontCtx.fillRect(i,j,1,1);
        }
    }
    // side face
    
    for (i =0; i < this.faces.side.width; i++){
        for (j = 0; j < this.faces.side.height; j++){
            noisevalue = Math.abs(this.perlinNoise.noise3d(i/10,j/10, this.perlinNoiseIndex)) + 0.5;
            colour = this.getColour(noisevalue - (this.currentBeatValue * 0.5));
            this.sideCtx.fillStyle = colour.toCSS();
            this.sideCtx.fillRect(i,j,1,1);
        }
    }

    // ** Volume visualisation **

    
    // this.sideCtx.globalCompositeOperation = "multiply";



    this.frontCtx.globalAlpha = 0.5;
    // draw additive circle

    var radius = (1.0 - this.currentBeatValue) * this.frontCtx.canvas.width/2;

    // radius = 2;

    this.frontCtx.globalCompositeOperation = "destination-in";
    this.frontCtx.fillStyle = (this.beatFlip) ? "black" : "white";
    this.frontCtx.beginPath();
    this.frontCtx.arc(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height/2, radius,0, 2 * Math.PI, false);
    this.frontCtx.fill();

    // draw negative circle
    this.frontCtx.globalCompositeOperation = "source-over";
    this.frontCtx.fillStyle = (this.beatFlip) ? "black" : "white";
    // this.frontCtx.globalAlpha = 0.5;
     var radius = (1.0 - this.altBeatValue) * this.frontCtx.canvas.width/2;

    this.frontCtx.beginPath();
    this.frontCtx.arc(this.frontCtx.canvas.width/2, this.frontCtx.canvas.height/2, radius,0, 2 * Math.PI, false);
    this.frontCtx.fill();

    this.frontCtx.globalAlpha = 1.0;

    // side

     this.sideCtx.globalAlpha = 0.5;
    // draw additive circle

    var radius = (1.0 - this.currentBeatValue) * this.sideCtx.canvas.width;

    // radius = 2;

    this.sideCtx.globalCompositeOperation = "destination-in";
    this.sideCtx.fillStyle = (this.beatFlip) ? "black" : "white";
    this.sideCtx.beginPath();
    this.sideCtx.arc(this.sideCtx.canvas.width, this.sideCtx.canvas.height/2, radius,0, 2 * Math.PI, false);
    this.sideCtx.fill();

    // draw negative circle
    this.sideCtx.globalCompositeOperation = "source-over";
    this.sideCtx.fillStyle = (this.beatFlip) ? "black" : "white";
    // this.sideCtx.globalAlpha = 0.5;
     var radius = (1.0 - this.altBeatValue) * this.sideCtx.canvas.width/2;

    this.sideCtx.beginPath();
    this.sideCtx.arc(this.sideCtx.canvas.width, this.sideCtx.canvas.height/2, radius,0, 2 * Math.PI, false);
    this.sideCtx.fill();

    this.sideCtx.globalAlpha = 1.0;

    // update beat value
    if (!this.beatFlip)
        this.currentBeatValue *= 0.9;
    else
        this.altBeatValue *= 0.9;
};

p.signal = function(channel, value) {

    // store beat values from channel 1
    if (channel == 1){

        if (this.beatFlip)
            this.currentBeatValue = value;
        else
            this.altBeatValue = value;

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

module.exports = PerlinShapesVisualiser;