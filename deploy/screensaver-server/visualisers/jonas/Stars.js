var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

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
    var SHAPES_TOTAL = 60;
    var TWINKLE_FREQUENZY = 100;
    //var TWINKLE_FREQUENZY = currentBeatValue;
    var MAX_VELOCITY = 0.8;

    var THE_COLOUR = "rgb(255,255,255)";
    var THE_COLOUR = "rgb(155, 216, 29)";

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
        this.beatFlip = false;
        for (var i = 0; i < SHAPES_TOTAL; i++){
            SHAPES.push(new Shape(
                1,
                1,
                (Math.random()*MAX_VELOCITY),
                "down",
                front)
            );
            SHAPES.push(new Shape(
                1,
                1,
                (Math.random()*MAX_VELOCITY),
                "up",
                side)
            );
        }
    }

    function Shape(width,height,velocity,direction,face){
        this._width = width;
        this._height = height;
        this._x = r(0,face.rows);
        this._y = r(0,face.cols);
        this._velocity = velocity;
        this._direction = direction;
        this._face = face;
        this.Update = function(){
            switch (this._direction){
                case "up":
                    this._y -= this._velocity;
                    if (this._y < 0) {
                        this._y = face.cols + 1;
                    }
                break;
                case "down":
                    this._y += this._velocity;
                    if (this._y > face.cols) {
                        this._y = 0;
                    }
                break;
                case "left":
                    this._x -= this._velocity;
                    if (this._x < 0) {
                        this._x = face.rows + 1;
                    }
                break;
                case "right":
                    this._x += this._velocity;
                    if (this._x > face.rows) {
                        this._x = 0;
                    }
                break;
            }
        }
        this.Draw = function(){
            if (Math.round((Math.random()*TWINKLE_FREQUENZY)) == 1){
                this._face.ctx.fillStyle = THE_COLOUR;
                 this._face.ctx.fillRect(
                    this._x-(this._width*0.5),
                    this._y-(this._height*0.5),
                    this._width*2,
                    this._height*2
                );
            } else {
                 this._face.ctx.fillStyle = THE_COLOUR;
                 this._face.ctx.fillRect(
                    this._x,
                    this._y,
                    this._width,
                    this._height
                );
            }
        }
    }

    p.render = function(){

        this.frontCtx.save();

        if (this.currentBeatValue > 0.6){
            if (this.beatFlip){
                this.frontCtx.scale(4 * this.currentBeatValue,1);    
            } else {
                this.frontCtx.scale(1, 4 * this.currentBeatValue);
            }
            
            // THE_COLOUR = "rgb(255,255,0)";
        } else {
            // THE_COLOUR = "rgb(255,255,0)";
        }

        this.frontCtx.fillStyle = 'black';
        this.frontCtx.fillRect(0, 0, this.faces.front.width, this.faces.front.height);
        this.sideCtx.fillStyle = 'black';
        this.sideCtx.fillRect(0, 0, this.faces.side.width, this.faces.side.height);
        for (i = 0; i < SHAPES.length; i++) {
            SHAPES[i].Update();
            SHAPES[i].Draw();
        }
        frame++;

        this.frontCtx.restore();
        this.currentBeatValue *= 0.95;
    }

    p.signal = function(channel, value) {
        if (channel == 1){
            this.currentBeatValue = value;
            currentBeatValue = this.currentBeatValue;
            this.beatFlip = !this.beatFlip;
        }
        if (channel == 2){
            this.currentVolume = value * 20000;
            currentVolume = this.currentVolume;
        }
    };

module.exports = HarpaTestVisualiser