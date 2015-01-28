(function(global){

    /*

        Example simple Visualiser class

    */

    var HarpaTestVisualiser = function() {

        // stores the current volume
        this.currentVolume = 0;

    }

    var p = HarpaTestVisualiser.prototype = new HarpaVisualiserBase();


    p.render = function() {

        // render simple bar on the front

        this.frontCtx.clearRect(0,0,this.faces.front.width,this.faces.front.height);

        this.frontCtx.fillStyle = "white";

        var scaledHeight = 1 - (this.currentVolume / 20000);
        scaledHeight = Math.min(1, scaledHeight);

        scaledHeight *= this.faces.front.height;

        this.frontCtx.fillRect(0,scaledHeight, this.faces.front.width, this.faces.front.height - scaledHeight);

        // render simple bar on the side


        this.sideCtx.clearRect(0,0,this.faces.side.width,this.faces.side.height);

        this.sideCtx.fillStyle = "white";

        var scaledHeight = 1 - (this.currentVolume / 20000);
        scaledHeight = Math.min(1, scaledHeight);

        scaledHeight *= this.faces.side.height;

        this.sideCtx.fillRect(0,scaledHeight, this.faces.side.width, this.faces.side.height - scaledHeight);



    };

    p.signal = function(channel, value) {

        if (channel == 1){
            this.currentVolume = value;
        }
    };


    global.HarpaTestVisualiser = (global.module || {}).exports = HarpaTestVisualiser;

})(this);
