(function(global){
    var SymbolRipplesVisualiser = function() {
        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;
    }

    var HEIGHT = 13;
    var WIDTH = 37 + 39; //side is 39, front is 37

    //from the image to array converter
    var SYMBOLS = [
        [[1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 1, 1, 1, 1, 1, 1],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0],[1, 1, 0, 0, 0, 0, 0, 0]],
        //O
        [[0,0,0,0.1568627450980392,0.6784313725490196,0.9176470588235294,0.9176470588235294,0.9176470588235294,0.7333333333333334,0.27450980392156865,0,0,0],[0,0,0.4117647058823529,0.9176470588235294,0.7686274509803921,0.4509803921568627,0.30980392156862746,0.4,0.7098039215686274,0.9176470588235294,0.607843137254902,0,0],[0,0.42352941176470593,0.9176470588235294,0.44705882352941173,0,0,0,0,0,0.2705882352941177,0.9176470588235294,0.6509803921568628,0],[0.11372549019607847,0.9176470588235294,0.4509803921568627,0,0,0,0,0,0,0,0.19999999999999996,0.9176470588235294,0.3803921568627451],[0.7176470588235294,0.7960784313725491,0,0,0,0,0,0,0,0,0,0.596078431372549,0.9176470588235294],[0.9176470588235294,0.4156862745098039,0,0,0,0,0,0,0,0,0,0.1725490196078432,0.9058823529411765],[0.9176470588235294,0.27450980392156865,0,0,0,0,0,0,0,0,0,0.0980392156862745,0.788235294117647],[0.9176470588235294,0.34901960784313724,0,0,0,0,0,0,0,0,0,0.1333333333333333,0.8666666666666667],[0.8235294117647058,0.7137254901960784,0,0,0,0,0,0,0,0,0,0.4745098039215686,0.9176470588235294],[0.2313725490196078,0.9176470588235294,0.24705882352941178,0,0,0,0,0,0,0,0.04313725490196074,0.9176470588235294,0.5372549019607843],[0,0.6235294117647059,0.9176470588235294,0.21176470588235297,0,0,0,0,0,0.07450980392156858,0.8705882352941177,0.8352941176470589,0],[0,0,0.6431372549019607,0.9176470588235294,0.5647058823529412,0.2313725490196078,0.12941176470588234,0.196078431372549,0.4745098039215686,0.9176470588235294,0.8431372549019608,0.0862745098039216,0],[0,0,0,0.38431372549019605,0.8352941176470589,0.8588235294117648,0.788235294117647,0.8431372549019608,0.8784313725490196,0.5176470588235293,0,0,0]],
        //R
        [[0.7411764705882353,0.11764705882352944,0,0.2313725490196078,0.7294117647058824,0.8509803921568627,0.8352941176470589,0.6509803921568628,0.1098039215686275,0],[0.788235294117647,0,0.2313725490196078,0.9176470588235294,0.4392156862745098,0.06666666666666665,0.11372549019607847,0.6274509803921569,0.8862745098039215,0.1098039215686275],[0.7411764705882353,0.1215686274509804,0.7176470588235294,0.34509803921568627,0,0,0,0,0.592156862745098,0.6666666666666667],[0.6941176470588235,0.3921568627450981,0.6509803921568628,0,0,0,0,0,0.20392156862745103,0.7176470588235294],[0.7019607843137254,0.3647058823529412,0.6666666666666667,0,0,0,0,0,0.2313725490196078,0.7215686274509804],[0.7450980392156863,0.07843137254901966,0.7019607843137254,0.44313725490196076,0,0,0,0,0.6745098039215687,0.611764705882353],[0.788235294117647,0.019607843137254943,0.12941176470588234,0.9176470588235294,0.6235294117647059,0.16078431372549018,0.22352941176470587,0.7607843137254902,0.7607843137254902,0.015686274509803977],[0.788235294117647,0.12941176470588234,0,0.17647058823529416,0.7019607843137254,0.5647058823529412,0.611764705882353,0.615686274509804,0.050980392156862786,0],[0.788235294117647,0.12941176470588234,0,0,0,0.2941176470588235,0.207843137254902,0,0,0],[0.788235294117647,0.12941176470588234,0,0,0,0.3921568627450981,0.9176470588235294,0.18823529411764706,0,0],[0.788235294117647,0.12941176470588234,0,0,0,0,0.44313725490196076,0.9176470588235294,0.19999999999999996,0],[0.788235294117647,0.12941176470588234,0,0,0,0,0,0.388235294117647,0.9176470588235294,0.28627450980392155],[0.6784313725490196,0.1098039215686275,0,0,0,0,0,0,0.4156862745098039,0.7215686274509804]]
    ];

    var RHYTHMS = [
        [30, 30, 15, 15, 30],
        [30, 30, 30, 30],
    ];

    var SYMBOL_POSITIONS = [
        [41, 0],
        [52, 0],
        [63, 0],
    ];

    var SYMBOL_COLORS = [
        [400, 200, 200],
        [200, 200, 400],
        [400, 200, 400]
    ];

    var RIPPLE_FORCE_SCALE = 0.2;

    var positiveMod = function (x, y) {
        return (x % y + y) % y;
    }

    var getData = function (dataArray, x, y, rgbOut) { //gets the rgb from a given x, y in the array
        //for now, let's just repeat
        x = positiveMod(x, WIDTH);
        y = positiveMod(y, HEIGHT);

        var r = dataArray[(y * WIDTH + x) * 3];
        var g = dataArray[(y * WIDTH + x) * 3 + 1];
        var b = dataArray[(y * WIDTH + x) * 3 + 2];

        rgbOut[0] = r;
        rgbOut[1] = g;
        rgbOut[2] = b;

        return rgbOut;
    };

    var setData = function (dataArray, x, y, rgbIn) { //sets the rgb of a given x, y in the array
        var r = rgbIn[0];
        var g = rgbIn[1];
        var b = rgbIn[2];

        dataArray[(y * WIDTH + x) * 3] = r;
        dataArray[(y * WIDTH + x) * 3 + 1] = g;
        dataArray[(y * WIDTH + x) * 3 + 2] = b;
    };

    var setDataWithMax = function (dataArray, x, y, rgbIn) { //sets the rgb using a max() with the current value
        var r = rgbIn[0];
        var g = rgbIn[1];
        var b = rgbIn[2];

        dataArray[(y * WIDTH + x) * 3] = Math.max(r, dataArray[(y * WIDTH + x) * 3]);
        dataArray[(y * WIDTH + x) * 3 + 1] = Math.max(g, dataArray[(y * WIDTH + x) * 3 + 1]);
        dataArray[(y * WIDTH + x) * 3 + 2] = Math.max(b, dataArray[(y * WIDTH + x) * 3 + 2]);
    };

    var addToData = function (dataArray, x, y, rgbIn) {
        var r = rgbIn[0];
        var g = rgbIn[1];
        var b = rgbIn[2];

        dataArray[(y * WIDTH + x) * 3] += r;
        dataArray[(y * WIDTH + x) * 3 + 1] += g;
        dataArray[(y * WIDTH + x) * 3 + 2] += b;
    };

    var rgbToString = function (r, g, b) {
        return 'rgb(' + r.toFixed(0) + ',' + g.toFixed(0) + ',' + b.toFixed(0) + ')';
    };

    var randomItemFromArray = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };

    var createEmptyArray = function (length) {
        var array = [];
        for (var i = 0; i < length; ++i) {
            array[i] = 0;
        }
        return array;
    }

    var overlayDataArray = createEmptyArray(WIDTH * HEIGHT * 3); //data for the overlay
    var dataArrayU = createEmptyArray(WIDTH * HEIGHT * 3); //2 dimensional array of the rgb u data
    var tempDataArrayU = createEmptyArray(WIDTH * HEIGHT * 3); //2 dimensional array of the rgb v data
    var dataArrayV = createEmptyArray(WIDTH * HEIGHT * 3);

    var currentRhythm = [];
    var currentRhythmIndex = 0;
    var framesUntilNextSymbol = 0;

    var currentSymbolX;
    var currentSymbolY;
    var currentSymbolLength;
    var currentSymbolColor;

    var p = SymbolRipplesVisualiser.prototype = new HarpaVisualiserBase();   

    p.update = function () {
        if (framesUntilNextSymbol === 0) {
            currentRhythmIndex++;
            if (currentRhythmIndex < currentRhythm.length) { //if there is a next note in the rhythm
                
            } else {
                currentRhythm = randomItemFromArray(RHYTHMS);
                currentRhythmIndex = 0;
            }

            var noteLength = currentRhythm[currentRhythmIndex];
            currentSymbolLength = noteLength;
            framesUntilNextSymbol = noteLength;

            var symbolPosition = randomItemFromArray(SYMBOL_POSITIONS);
            currentSymbolX = symbolPosition[0];
            currentSymbolY = symbolPosition[1];

            var symbolColor = randomItemFromArray(SYMBOL_COLORS);
            currentSymbolColor = symbolColor;

            var symbol = randomItemFromArray(SYMBOLS);

            var firstBeatOfBar = currentRhythmIndex === 0;
            var colorMultiplier = firstBeatOfBar ? 1 : 1;

            //add symbol to sim
            for (var y = 0; y < symbol.length; ++y) {
                var row = symbol[y];
                for (var x = 0; x < row.length; ++x) {
                    var value = row[x];
                    var rippleScale = 0.8;
                    setDataWithMax(dataArrayU, x + currentSymbolX, y + currentSymbolY, [symbolColor[0] * colorMultiplier * value * rippleScale, symbolColor[1] * colorMultiplier * value * rippleScale, symbolColor[2] * colorMultiplier * value * rippleScale]);
                    setDataWithMax(overlayDataArray, x + currentSymbolX, y + currentSymbolY, [symbolColor[0] * value * colorMultiplier, symbolColor[1] * value * colorMultiplier, symbolColor[2] * value * colorMultiplier]);
                }
            }
        }

        framesUntilNextSymbol -= 1;

        for (var y = 0; y < HEIGHT; ++y) {
            for (var x = 0; x < WIDTH; ++x) {
                var centerU = getData(dataArrayU, x, y, []);
                var leftU = getData(dataArrayU, x - 1, y, []);
                var rightU = getData(dataArrayU, x + 1, y, []);
                var topU = getData(dataArrayU, x, y + 1, []);
                var bottomU = getData(dataArrayU, x, y - 1, []);

                var centerV = getData(dataArrayV, x, y, []);

                var newV = [];
                var newU = [];

                var currentOverlay = getData(overlayDataArray, x, y, []);
                var newOverlay = [];

                for (var i = 0; i < 3; ++i) {
                    var force = RIPPLE_FORCE_SCALE * ((leftU[i] + rightU[i] + topU[i] + bottomU[i]) / 4 - centerU[i]); //compute force
                    newV[i] = centerV[i] + force;
                    newV[i] *= 0.9;
                    newU[i] = (centerU[i] + newV[i]) * 0.995;
                    
                    newOverlay[i] = currentOverlay[i] * 0.96;
                }

                setData(overlayDataArray, x, y, newOverlay);

                setData(tempDataArrayU, x, y, newU);
                setData(dataArrayV, x, y, newV);
            }
        }

        var temp = dataArrayU;
        dataArrayU = tempDataArrayU;
        tempDataArrayU = temp;
    }

    p.render = function() {
        this.update();

        var frontImageData = this.frontCtx.createImageData(1,1);
        var sideImageData = this.sideCtx.createImageData(1, 1);

        this.frontCtx.fillStyle = 'black';
        this.frontCtx.fillRect(0, 0, this.frontCtx.canvas.width, this.frontCtx.canvas.height);

        this.sideCtx.fillStyle = 'black';
        this.sideCtx.fillRect(0, 0, this.sideCtx.canvas.width, this.sideCtx.canvas.height);

        var overlayRGB = [];
        var rgb = []; //cache

        for (var y = 0; y < HEIGHT; ++y) {
            for (var x = 0; x < WIDTH; ++x) {
                getData(overlayDataArray, x, y, overlayRGB);
                getData(dataArrayU, x, y, rgb);

                if (x < this.sideCtx.canvas.width) {
                    sideImageData.data[0] = rgb[0] + overlayRGB[0];
                    sideImageData.data[1] = rgb[1] + overlayRGB[1];
                    sideImageData.data[2] = rgb[2] + overlayRGB[2];
                    sideImageData.data[3] = 255;
                    this.sideCtx.putImageData(sideImageData, x, y);
                } else {
                    frontImageData.data[0] = rgb[0] + overlayRGB[0];
                    frontImageData.data[1] = rgb[1] + overlayRGB[1];
                    frontImageData.data[2] = rgb[2] + overlayRGB[2];
                    frontImageData.data[3] = 255;
                    this.frontCtx.putImageData(frontImageData, x - this.sideCtx.canvas.width, y);
                }
            }
        }
    };

    p.signal = function(channel, value) {

        // store volume values from channel 1
        if (channel == 1){
            this.currentVolume = value;
        }

        // store beat values from channel 2
        if (channel == 2){
            this.currentBeatValue = value;
        }
    };


    global.SymbolRipplesVisualiser = (global.module || {}).exports = SymbolRipplesVisualiser;

})(this);