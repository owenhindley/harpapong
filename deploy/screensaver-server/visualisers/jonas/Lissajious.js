var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

    var HarpaTestVisualiser = function() {
        this.currentVolume = 0;
        this.currentBeatValue = 0;
    }

    var p = HarpaTestVisualiser.prototype = new HarpaVisualiserBase();

    var PHASE = 0.0;
    var PHASE_INCREMENT = 0.04;
    var STRETCH = 0.05;

    var front = {
        rows:13,
        cols:39,
        p1:{ x:0, y:0, },
        p2:{ x:0, y:0, },
        d1:{ x:0, y:0, },
        d2:{ x:0, y:0, },
    }

    var side = {
        rows:13,
        cols:39,
        p1:{ x:0, y:0, },
        p2:{ x:0, y:0, },
        d1:{ x:0, y:0, },
        d2:{ x:0, y:0, },
    }

    p.render = function(){

        this.frontCtx.save();
        this.sideCtx.save();


        this.frontCtx.fillStyle = 'black';
        this.frontCtx.fillRect(0, 0, this.faces.front.width, this.faces.front.height);
        this.sideCtx.fillStyle = 'black';
        this.sideCtx.fillRect(0, 0, this.faces.side.width, this.faces.side.height);
        PHASE += PHASE_INCREMENT+(this.currentBeatValue*0.05);
        //PHASE += PHASE_INCREMENT;

        // CRAZY SCALING
        this.frontCtx.translate(this.faces.front.width/2,this.faces.front.height/2);
        this.frontCtx.scale(1 + this.currentBeatValue * 3, 1 + this.currentBeatValue * 3);
        this.frontCtx.translate(this.faces.front.width/-2,this.faces.front.height/-2);

        this.sideCtx.translate(this.faces.front.width/2,this.faces.front.height/2);
        this.sideCtx.scale(3 + this.currentBeatValue * 3, 3 + this.currentBeatValue * 3);
        this.sideCtx.translate(this.faces.front.width/-2,this.faces.front.height/-2);

        front.p1.x = (Math.sin(PHASE*1.000)+1.0) * 7.5;
        front.p1.y = (Math.sin(PHASE*0.310)+1.0) * 20.0;
        front.p2.x = (Math.cos(PHASE*1.770)+1.0) * 7.5;
        front.p2.y = (Math.cos(PHASE*1.865)+1.0) * 4.0;

        for (var row = 0; row < front.rows; row++){
            for (var col = 0; col < front.cols; col++) {
                front.d1.x = col - front.p1.x;
                front.d1.y = row - front.p1.y;
                front.d2.x = col - front.p2.x;
                front.d2.y = row - front.p2.y;

                var distance = (front.d1.x * front.d1.x) + (front.d1.y * front.d1.y);
                distance *= (front.d2.x * front.d2.x) + (front.d2.y * front.d2.y);
                distance = Math.sqrt(distance);

                var color = (Math.sin(distance * STRETCH ) + 1.0) * 0.5;
                color *= color*color*color*(this.currentVolume*0.0001);

                this.frontCtx.fillStyle = "rgba(255,255,255," + color + ")";
                this.frontCtx.fillRect(col,row,1,1);
            }
        }

        side.p1.x = (Math.sin(PHASE*1.000)+1.0) * 7.5;
        side.p1.y = (Math.sin(PHASE*0.310)+1.0) * 4.0;
        side.p2.x = (Math.sin(PHASE*1.770)+1.0) * 7.5;
        side.p2.y = (Math.sin(PHASE*1.865)+1.0) * 4.0;

        for (var row = 0; row < side.rows; row++){
            for (var col = 0; col < side.cols; col++) {
                side.d1.x = col - side.p1.x;
                side.d1.y = row - side.p1.y;
                side.d2.x = col - side.p2.x;
                side.d2.y = row - side.p2.y;

                var distance = (side.d1.x * side.d1.x) + (side.d1.y * side.d1.y);
                distance *= (side.d2.x * side.d2.x) + (side.d2.y * side.d2.y);
                distance = Math.sqrt(distance);

                var color = (Math.sin(distance * STRETCH ) + 1.0) * 0.5;
                color *= color*color*color*(this.currentVolume*0.0001);

                this.sideCtx.fillStyle = "rgba(255,255,255," + color + ")";
                this.sideCtx.fillRect(col,row,1,1);
            }
        }

        this.sideCtx.restore();
        this.frontCtx.restore();

        this.currentBeatValue *= 0.8;

    }

    p.signal = function(channel, value) {
        if (channel == 1){
            this.currentBeatValue = value;
            currentBeatValue = this.currentBeatValue;
        }
        if (channel == 2){
            this.currentVolume = value * 20000;
            currentVolume = this.currentVolume;
        }
    };

module.exports = HarpaTestVisualiser