var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");
var Canvas = require("canvas");
var Boid = require("./Boid.js").Boid;
var Delaunay = require("./Delaunay.js").Delaunay;
var toxi = require("toxiclibsjs");


    /*

        Example simple Visualiser class

    */

    var HarpaMeshColorVisualiser = function() {

        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

        this._canvas = undefined;
        this._ctx = undefined;

        this.boids = [];
        this.boidsCount = 40;
    };

    var p = HarpaMeshColorVisualiser.prototype = new HarpaVisualiserBase();

    p.setup = function() {
        this.totalWidth = this.faces.front.width + this.faces.side.width;
        this.totalHeight = this.faces.front.height;

        var pos = new toxi.geom.Vec2D(this.totalWidth/2, this.totalHeight/2);
        var ms = 3;
        var mf = 3;
        var dimentions = {width: this.totalWidth, height: this.totalHeight};

        for(var i=0; i<this.boidsCount; i++) {
            var ran = Math.random();
            ran = Math.max(0.5, ran);
            pos = new toxi.geom.Vec2D(this.totalWidth*ran, this.totalHeight*ran);
            var vel = toxi.geom.Vec2D.randomVector();
            this.boids.push(new Boid(pos, ms, mf, vel, dimentions));
        }

        this._canvas = new Canvas();
        this._canvas.id = "debugCanvas";
        // document.body.appendChild(this._canvas);
        this._canvas.width = this.totalWidth;
        this._canvas.height = this.totalHeight;
        this._ctx  = this._canvas.getContext("2d");

        this._ctx.fillStyle = "white";
        this._ctx.lineWidth = 0.5;
    };

    p.render = function() {


        if(this.boids.length == 0) {
            this.setup();
        }

        // console.log("render called");

        this._ctx.clearRect(0,0,this.totalWidth, this.totalHeight);

        var bl = this.boids.length;
        var vertices = [];
        for(var i=0; i<bl; i++) {
            var b = this.boids[i];
            b.run(this.boids, this.currentVolume, this.currentBeatValue);

            // this._ctx.save();
            var bx = b.position.x, by = b.position.y;
            // this._ctx.translate(bx, by);
            // b.render(this._ctx);
            // this._ctx.restore();

            var posArray = [bx, by];
            vertices.push(posArray);
        }
        this._ctx.globalAlpha = 1.0;
        this.drawMesh(this._ctx, vertices, 100);

        // this._ctx.fillStyle = "white";
        // this._ctx.fillRect(0,0,10,10);

        // Clear Side
        this.sideCtx.globalAlpha = 1.0;
        this.sideCtx.fillStyle = "black";
        
        this.sideCtx.fillRect(0,0,this.faces.side.width,this.faces.side.height);
        this.sideCtx.drawImage(this._canvas, 0,0, this.faces.side.width,this.totalHeight, 0,0, this.faces.side.width,this.faces.side.height);
        

        // Clear Front
        this.frontCtx.globalAlpha = 1.0;
        this.frontCtx.fillStyle = "black";
        this.frontCtx.fillRect(0,0,this.faces.front.width,this.faces.front.height);
        this.frontCtx.drawImage(this._canvas, this.faces.side.width,0, this.totalWidth,this.totalHeight, 0,0, this.faces.front.width * 2,this.faces.front.height);

        
        


        // update beat value
        this.currentBeatValue *= 0.8;

    };

    p.drawMesh = function(ctx, vertices, aMinDist) {
        var triangles = Delaunay.triangulate(vertices);

        var minDist = (aMinDist == undefined) ? 7000 : aMinDist;
        // var grad= ctx.createLinearGradient(0, 0, minDist/4, minDist/4);
        // grad.addColorStop(0, "rgba(227,227,227, 0.4)");
        // grad.addColorStop(1, "rgba(95,95,95, 0.4)");

        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "rgb(227,227,227)";
        ctx.lineCap = 'round';

        // console.log(triangles.length);
        for(i = triangles.length; i; ) {
            ctx.beginPath();
            
            i--;
            var p1X = vertices[triangles[i]][0],
                p1Y = vertices[triangles[i]][1];

            i--;
            var p2X = vertices[triangles[i]][0],
                p2Y = vertices[triangles[i]][1];

            i--;
            var p3X = vertices[triangles[i]][0],
                p3Y = vertices[triangles[i]][1];

            

            var firstConnected = false;
            var dx = p1X - p2X;
            var dy = p1Y - p2Y;
            var d = dx * dx + dy * dy;

            var totalD = 0;

            if(d < minDist){
                ctx.lineTo(p1X, p1Y);
                ctx.lineTo(p2X, p2Y);   
                firstConnected = true;

                totalD += d;
            }

            dx = p2X - p3X;
            dy = p2Y - p3Y;
            d = dx * dx + dy * dy;
            if(d < minDist){
                if(!firstConnected)
                    ctx.lineTo(p2X, p2Y);

                ctx.lineTo(p3X, p3Y);

                totalD += d;
            }

            var gA = Math.max(0.4, this.currentBeatValue);
            ctx.globalAlpha = gA;
            var style = this.getTriangleFillStyle(ctx, d);

            
            ctx.fillStyle = style;
            // ctx.fillStyle = "green";

            ctx.closePath();
            ctx.fill();
            // ctx.stroke();
        }


        
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "white";
    };

    p.getTriangleFillStyle = function(ctx, d) {

        var grad= ctx.createLinearGradient(0, 0, d, d);
        grad.addColorStop(0, "rgb(122 ,255, 45)");
        grad.addColorStop(1, "rgb(60 ,187, 255)");
        return grad;
    };

    p.signal = function(channel, value) {

        // store beat values from channel 1
        if (channel == 1){
            
            this.currentBeatValue = value;
        }

        // store volume values from channel 2
        if (channel == 2){
            this.currentVolume = value;
        }
    };

module.exports = HarpaMeshColorVisualiser;
