(function(global){

    var HarpaCanvasFixtureView = function() {
    };

    var p = HarpaCanvasFixtureView.prototype;

    p.init = function(width, height) {
        this.width = width;
        this.height = width;

        this.element = this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');

        this.fixtureWidth = 20;

        this.fixtureEnabledStates = []; //an array that tracks which fixtures are currently enabled/disabled
        for (var i = 0; i < width * height; ++i) {
            this.fixtureEnabledStates[i] = true;
        }
    };

    p.disableFixture = function(x,y) {
        this.fixtureEnabledStates[y * this.width + x] = false;

    };

    var rgbToString = function (r, g, b) {
        return 'rgb(' + r.toFixed(0) + ',' + g.toFixed(0) + ',' + b.toFixed(0) + ')';
    };

    p.render = function(aContext) {
        // updates lights from Canvas context

        // get image data
        var canvasWidth = aContext.canvas.width;
        var canvasHeight = aContext.canvas.height;
        var imgData = aContext.getImageData(0,0,canvasWidth, canvasHeight).data;

        //draw fixtures

        var context = this.context,
            canvas = this.canvas;

        context.fillStyle = 'black';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 1;

        var FIXTURE_WIDTH = 7;
        var FIXTURE_HEIGHT = 10;
        var FIXTURE_SLANT_OFFSET = -1;
        var FIXTURE_ROW_SLANT_OFFSET = 1;

        for (var y = 0; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                var i = (y * canvasWidth + x) * 4; //base index into image data array

                if (this.fixtureEnabledStates[y * canvasWidth + x]) {

                    context.strokeStyle = rgbToString(imgData[i], imgData[i+1], imgData[i+2]);

                    context.beginPath();
                    context.moveTo(FIXTURE_ROW_SLANT_OFFSET * y + x * FIXTURE_WIDTH, y * FIXTURE_HEIGHT);
                    context.lineTo(FIXTURE_ROW_SLANT_OFFSET * y + x * FIXTURE_WIDTH + FIXTURE_SLANT_OFFSET, y * FIXTURE_HEIGHT + FIXTURE_HEIGHT * 0.8);
                    context.stroke();
                }
            }
        }

    };

    p.setPixel = function(r,g,b,x,y) {
        this.fixtures[x][y].style.fill = "rgb(" + r + "," + g + "," + b + ")";
    };


    global.HarpaCanvasFixtureView = (global.module || {}).exports = HarpaCanvasFixtureView;

})(this);
