(function(global){

    /*
        This class aims to act as a base for any visualiser classes
        that get created.

        render() will be called at 30fps when installed,
        but on requestAnimationFrame in the browser.


        signal(channel, value) will be called periodically
        from the audio analyser, it's up to you to store this
        data and use it in the visualisation.

    */

    var HarpaVisualiserBase = function() {

    };

    var p = HarpaVisualiserBase.prototype;

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {

        // Create canvases that'll represent the lights on the
        // front (larger) facade, and the side (smaller - non-square) facade
        // of Harpa
        var frontCanvas = document.createElement("canvas");
        var sideCanvas = document.createElement("canvas");

        frontCanvas.width = frontWidth;
        frontCanvas.height = frontHeight;
        sideCanvas.width = sideWidth;
        sideCanvas.height = sideHeight;


        this.faces = {
            front : frontCanvas,
            side : sideCanvas
        };

        this.frontCtx = frontCanvas.getContext("2d");
        this.sideCtx = sideCanvas.getContext("2d");

    };


    p.render = function() {

        // override this method with your render code

    };

    p.signal = function(channel, value) {

        // override this method to store and use
        // signals from the audio visualiser

    };


    global.HarpaVisualiserBase = (global.module || {}).exports = HarpaVisualiserBase;

})(this);
