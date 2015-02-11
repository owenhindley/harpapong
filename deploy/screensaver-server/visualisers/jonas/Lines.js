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

    function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    }

    function easeInCubic(t, b, c, d) {
        t /= d;
        return c*t*t*t + b;
    };

    function easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    };

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
    }

    function Shape(width,height,velocity,direction,face){
        this._x = 0;
        this._y = 0;
        switch (direction){
            case "up":
                this._x = r(0,face.cols);
                this._y = face.rows;
            break;
            case "down":
                this._x = r(0,face.rows);
                this._y = -height;
            break;
            case "left":
                this._x = face.cols;
                this._y = face.rows;
            break;
            case "right":
                this._x = -width;
                this._y = r(0,face.cols);
            break;
        }
        this._width = width;
        this._height = height;
        this._velocity = velocity;
        this._direction = direction;
        this._face = face;
        this._iteration = 0;
        this.Update = function(){
            switch (this._direction){
                case "up":
                    this._y -= this._velocity;
                break;
                case "down":
                    this._y += this._velocity;
                break;
                case "left":
                    this._x -= this._velocity;
                break;
                case "right":
                    this._x += this._velocity;
                break;
            }
        }
        this.Draw = function(){
            this._face.ctx.fillStyle = "rgba(255,255,255,1)";
            this._face.ctx.fillRect(this._x,this._y,this._width,this._height);
        }
    }

    p.render = function(){
        this.frontCtx.fillStyle = 'black';
        this.frontCtx.fillRect(0, 0, this.faces.front.width, this.faces.front.height);
        this.sideCtx.fillStyle = 'black';
        this.sideCtx.fillRect(0, 0, this.faces.side.width, this.faces.side.height);

        // if ((frame % 30) == 0) {
        if (this.currentBeatValue == 1) {
            SHAPES.push(new Shape(
                r(1,1),
                r(4,front.cols),
                0.5,
                "right",
                front
            ));
            SHAPES.push(new Shape(
                r(4,front.rows),
                r(1,1),
                0.5,
                "down",
                side

            ));
        }

        for (i = 0; i < SHAPES.length; i++) {
            SHAPES[i].Update();
            SHAPES[i].Draw();
        }

        frame++;

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
