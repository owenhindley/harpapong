(function(global){

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

        // ** Beat visualisation **

        this.frontCtx.fillStyle = "rgba(255,0,0,0.5)";

        var barWidth = this.currentBeatValue * this.faces.front.width * 0.5;
        this.frontCtx.fillRect(this.faces.front.width / 2, 0, barWidth / 2, this.faces.front.height);
        this.frontCtx.fillRect(this.faces.front.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.front.height);

        this.sideCtx.fillStyle = "rgba(255,0,0,0.5)";

        barWidth = this.currentBeatValue * this.faces.side.width * 0.5;
        this.sideCtx.fillRect(this.faces.side.width / 2, 0, barWidth / 2, this.faces.side.height);
        this.sideCtx.fillRect(this.faces.side.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.side.height);


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


    global.HarpaTestVisualiser = (global.module || {}).exports = HarpaTestVisualiser;

})(this);
