(function(global){

    /*

        Example simple Visualiser class

    */

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var mscp = {};

    var Circle = function(){


    };

    mscp.Circle = Circle;
    var cp = Circle.prototype;

    cp.init = function(i, rgb, rev){

        this._pos = [0,0];
        this._radius = i * 6 + 1;
        this._scale = [1,1];

        this._rgb = rgb;

        this._rev = false;
        if (rev)
            this._rev = true;

        

    };

    cp.render = function(ctx, face, normalizedVol){
        ctx.save();

        ctx.translate(face.width/2, face.height/2);

        var alpha = 1;
        ctx.strokeStyle = 'rgba('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+','+alpha+')';
        ctx.lineWidth = 1;

        ctx.beginPath();
        var radius = Math.abs(this._radius*normalizedVol - this._radius);
        if (this._rev)
            radius = this._radius*normalizedVol;
        
        ctx.arc(0, 0, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
   
    };



    var Square = function(){};

    mscp.Square = Square;
    var cp = Square.prototype;

    cp.init = function(i, rgb, offset){

        this._pos = [0,0];
        this._scale = [1,1];

        this._rgb = rgb;

        this._index = Math.abs(i - 19);

        this._w = 2;
        this._h = 1;
        this._yOffset = offset;
        

    };

    cp.render = function(ctx, face, normalizedVol){

        ctx.save();

        // var alpha = this._index/29;
        this._rgb[0] = Math.floor(this._index * 10);
        // this._rgb[1] = Math.floor(this._index * 10);
        ctx.fillStyle = 'rgba('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+','+1+')';
        
        ctx.beginPath();
        ctx.fillRect(this._index*this._w, face.height * normalizedVol - this._yOffset, this._w, this._h);
        // ctx.arc(0, 0, this._radius*normalizedVol, 0, Math.PI*2, true);
        ctx.closePath();
        // ctx.stroke();
        // ctx.restore();
    };





    var HarpaMSCP001 = function() {

        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

        this._beatCircles = [];
        this._volCircles = [];
        
        this._volHistory = [];
        this._volHistory.push(0);


        this._historyCounter = 0;
        this._historyCounterThreshold = 5;

        this._btmSquares = [];
        this._middleSquares = [];
        this._topSquares = [];

    };

    var p = HarpaMSCP001.prototype = new HarpaVisualiserBase();
    var s = HarpaVisualiserBase.prototype;

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight){

        s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

        var beatCirleRgb = [200,10,100];
        var volCircleRgb = [100,200,200];

        var btmSquaresRgb = [200,10,200];
        var middleSquaresRgb = [250,120,100];
        var topSquaresRgb = [10, 200 ,200];

        for (var i=0;i<3;i++){
            var circle = new mscp.Circle();
            circle.init(i, beatCirleRgb, true);

            this._beatCircles.push(circle);
        }

        for (var i=0;i<4;i++){
            var circle = new mscp.Circle();
            circle.init(i, volCircleRgb);

            this._volCircles.push(circle);
        }

        for (var i=0;i<20;i++){
            var square = new mscp.Square();
            square.init(i, btmSquaresRgb, 2);

            this._btmSquares.push(square);
        }

        // for (var i=0;i<20;i++){
        //     var square = new mscp.Square();
        //     square.init(i, middleSquaresRgb, 2);

        //     this._middleSquares.push(square);
        // }

        // for (var i=0;i<20;i++){
        //     var square = new mscp.Square();
        //     square.init(i, topSquaresRgb, 1);

        //     this._topSquares.push(square);
        // }
    };

   

   


    p.render = function() {

        // ** Volume visualisation **

        // render simple bar on the front

        this.frontCtx.clearRect(0,0,this.faces.front.width,this.faces.front.height);

        // this.frontCtx.fillStyle = "rgba(10,200,10,.7)";

        var normalizedVol = 1 - (this.currentVolume / 20000);

        // var scaledHeight = 1 - (this.currentVolume / 20000);
        normalizedVol = Math.min(1, normalizedVol);

        this._volHistory.unshift(normalizedVol);

        // normalizedVol *= this.faces.front.height;

        // console.log('history: ',this._volHistory[0], '   ',this._volHistory[1]);

        for (var i=0;i<this._beatCircles.length;i++){

            var volVal = i == 0 ? this.currentBeatValue : this.currentBeatValue;
            this._beatCircles[i].render(this.frontCtx, this.faces.front, volVal);
        }

        for (var i=0;i<this._volCircles.length;i++){

            var volVal = i == 0 ? this._volHistory[0] : this._volHistory[0];
            this._volCircles[i].render(this.frontCtx, this.faces.front, volVal);
        }

        


        this.sideCtx.clearRect(0,0,this.faces.side.width,this.faces.side.height);

        for (var i=0;i<this._btmSquares.length;i++){

          
            var volVal = i == 0 ? this._volHistory[0] : this._volHistory[i*4];

            this._btmSquares[i].render(this.sideCtx, this.faces.side, volVal);
        }

        // for (var i=0;i<this._middleSquares.length;i++){
 
        //     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[i*4];

        //     this._middleSquares[i].render(this.sideCtx, this.faces.side, volVal);
        // }

        // for (var i=0;i<this._topSquares.length;i++){

        //     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[i*4];

        //     this._topSquares[i].render(this.sideCtx, this.faces.side, volVal);
        // }

        if (this._volHistory.length > 60)
            this._volHistory.pop();




        // this.sideCtx.fillStyle = "white";

        // var scaledHeight = 1 - (this.currentVolume / 20000);
        // scaledHeight = Math.min(1, scaledHeight);

        // scaledHeight *= this.faces.side.height;

        // this.sideCtx.fillRect(0,scaledHeight, this.faces.side.width, this.faces.side.height - scaledHeight);

        // // ** Beat visualisation **

        // this.frontCtx.fillStyle = "rgba(255,0,0,0.5)";

        // var barWidth = this.currentBeatValue * this.faces.front.width * 0.5;
        // // this.frontCtx.fillRect(this.faces.front.width / 2, 0, barWidth / 2, this.faces.front.height);
        // // this.frontCtx.fillRect(this.faces.front.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.front.height);

        // this.sideCtx.fillStyle = "rgba(255,0,0,0.5)";

        // barWidth = this.currentBeatValue * this.faces.side.width * 0.5;
        // this.sideCtx.fillRect(this.faces.side.width / 2, 0, barWidth / 2, this.faces.side.height);
        // this.sideCtx.fillRect(this.faces.side.width / 2 - barWidth/2, 0, barWidth / 2, this.faces.side.height);


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


    global.HarpaMSCP001 = (global.module || {}).exports = HarpaMSCP001;



})(this);
