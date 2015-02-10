(function(global){

    var HarpaTestVisualiser = function() {
        this.currentVolume = 0;
        this.currentBeatValue = 0;
    }

    var p = HarpaTestVisualiser.prototype = new HarpaVisualiserBase();
    var s = HarpaVisualiserBase.prototype;

    var frame = 0;
    var currentVolume = 0;
    var currentBeatValue = 0;

    var SHAPES = new Array();
    var SHAPES_TOTAL = 25;
    var TWINKLE_FREQUENZY = 100;
    //var TWINKLE_FREQUENZY = currentBeatValue;
    var MAX_VELOCITY = 0.8;
    var RADIUS = 39;
    var RADIUS_SCALE = 0.5;
    var RADIUS_SCALE_MIN = 0.4;
    var RADIUS_SCALE_MAX = 0.6;

    var COLORS = ['#04f4db', '#04f4a2', '#04f48b', '#ffffff', '#13d087'];

    var front = {
        ctx:'',
        rows:39,
        cols:13,
        p1:{ x:0, y:0 },
        p2:{ x:0, y:0 },
        d1:{ x:0, y:0 },
        d2:{ x:0, y:0 }
    }

    var side = {
        ctx:'',
        rows:39,
        cols:13,
        p1:{ x:0, y:0 },
        p2:{ x:0, y:0 },
        d1:{ x:0, y:0 },
        d2:{ x:0, y:0 }
    }

    function r(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function ra(min, max) {
        return Math.random() * (max - min) + min;
    }

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
        s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);
        front.ctx = this.frontCtx;
        side.ctx = this.sideCtx;
        for (var i = 0; i < SHAPES_TOTAL; i++){
            SHAPES.push(
                shape = {
                    size:0.5,
                    position:{
                        x:r(0,front.rows*0.5),
                        y:r(0,front.cols*0.5)
                    },
                    offset:{
                        x:0,
                        y:0
                    },
                    shift:{
                        x:r(0,front.rows*0.5),
                        y:r(0,front.cols*0.5)
                    },
                    speed:0.01+Math.random(),
                    targetSize:0.1,
                    fillColor:COLORS[r(0,COLORS.length)],
                    orbit:RADIUS*.5 + (RADIUS * .5 * Math.random())
                }
            )
        }
    }

    p.render = function(){
        this.frontCtx.fillStyle = 'rgba(0,0,0,0.05)';
        this.frontCtx.fillRect(0, 0, this.faces.front.width, this.faces.front.height);
        this.sideCtx.fillStyle = 'rgba(0,0,0,0.05)';
        this.sideCtx.fillRect(0, 0, this.faces.side.width, this.faces.side.height);
        var vol = currentVolume*0.0000025;
        for (var i = 0, len = SHAPES.length; i < len; i++) {
            var particle = SHAPES[i];
            var lp = {
                x:particle.position.x,
                y:particle.position.y
            };
            particle.offset.x += particle.speed*vol;
            particle.offset.y += particle.speed*vol;
            particle.position.x = particle.shift.x + Math.sin(i + particle.offset.x) * (particle.orbit*RADIUS_SCALE);
            particle.position.y = particle.shift.y + Math.cos(i + particle.offset.y) * (particle.orbit*RADIUS_SCALE);
            particle.position.x = Math.max( Math.min( particle.position.x, front.rows ), 0 );
            particle.position.y = Math.max( Math.min( particle.position.y, front.cols ), 0 );
            particle.size += ( particle.targetSize - particle.size ) * 0.05;
            if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
                particle.targetSize = 1 + Math.random() * 7;
            }
            this.frontCtx.beginPath();
            this.frontCtx.fillStyle = particle.fillColor;
            this.frontCtx.strokeStyle = particle.fillColor;
            this.frontCtx.lineWidth = particle.size;
            this.frontCtx.moveTo(lp.x, lp.y);
            this.frontCtx.lineTo(particle.position.x, particle.position.y);
            this.frontCtx.stroke();
            this.frontCtx.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
            this.frontCtx.fill();
        }
        for (var i = 0, len = SHAPES.length; i < len; i++) {
            var particle = SHAPES[i];
            var lp = {
                x:particle.position.x,
                y:particle.position.y
            };
            particle.offset.x += particle.speed*vol;
            particle.offset.y += particle.speed*vol;
            particle.position.x = particle.shift.x + Math.sin(i + particle.offset.x) * (particle.orbit*RADIUS_SCALE);
            particle.position.y = particle.shift.y + Math.cos(i + particle.offset.y) * (particle.orbit*RADIUS_SCALE);
            particle.position.x = Math.max( Math.min( particle.position.x, front.rows ), 0 );
            particle.position.y = Math.max( Math.min( particle.position.y, front.cols ), 0 );
            particle.size += ( particle.targetSize - particle.size ) * 0.05;
            if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
                particle.targetSize = 1 + Math.random() * 7;
            }
            this.sideCtx.beginPath();
            this.sideCtx.fillStyle = particle.fillColor;
            this.sideCtx.strokeStyle = particle.fillColor;
            this.sideCtx.lineWidth = particle.size;
            this.sideCtx.moveTo(lp.x, lp.y);
            this.sideCtx.lineTo(particle.position.x, particle.position.y);
            this.sideCtx.stroke();
            this.sideCtx.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
            this.sideCtx.fill();
        }
    }

    p.signal = function(channel, value) {
        if (channel == 1){
            this.currentVolume = value;
            currentVolume = this.currentVolume;
        }
        if (channel == 2){
            this.currentBeatValue = value;
            currentBeatValue = this.currentBeatValue;
        }
    };

    global.HarpaTestVisualiser = (global.module || {}).exports = HarpaTestVisualiser;

})(this);
