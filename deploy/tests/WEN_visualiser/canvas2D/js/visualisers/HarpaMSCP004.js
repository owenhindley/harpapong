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

        this._index = i;

        

    };

    cp.render = function(ctx, face, normalizedVol){
        
        ctx.save();

        // ctx.translate(0, (face.height/2));
        // ctx.rotate((1+normalizedVol)*Math.PI );
        ctx.scale(1*normalizedVol,1);

        var alpha = 1;

        // this._rgb[0] = this._index * 20;
        ctx.strokeStyle = 'rgba('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+','+alpha+')';
        ctx.lineWidth = 1;

        ctx.beginPath();
        var radius = Math.abs(this._radius*normalizedVol - this._radius);
        if (this._rev)
            radius = this._radius*normalizedVol;
        
        ctx.moveTo(this._index*5,0);
        ctx.lineTo(this._index*5, face.height);
        // ctx.arc(this._index, this._index*2, 2+ normalizedVol*2, Math.PI*2, Math.PI*1, true);
        // ctx.closePath();
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

        this._index = i;

        this._w = 4;
        this._h = 4;
        this._offset = offset;
        

    };

    cp.render = function(ctx, face, normalizedVol){

        ctx.save();

        ctx.translate(face.width/2, face.height/2);
        // ctx.transform(1, Math.tan(.9), 0, 1, 0, 0);
        ctx.scale(4*normalizedVol,2*normalizedVol);
        ctx.rotate((this._index *normalizedVol)*Math.PI);

        var alpha = 1;
        // this._rgb[1] = Math.floor(Math.random() * 150);
        // this._rgb[2] = Math.floor(Math.random() * 255);
        ctx.strokeStyle = 'rgba('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+','+alpha+')';
        
        ctx.beginPath();
        ctx.rect(-this._w/2 +this._offset[0], -this._h/2 + this._offset[1], this._w, this._h);
        // ctx.arc(0, 0, this._radius*normalizedVol, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();
        // ctx.stroke();
        ctx.restore();
    };


    var Drop = function(){};

    mscp.Drop = Drop;
    var cp = Drop.prototype;

    cp.init = function(index, rgb, offset, speed){

        this._index = index;

        this._offset = offset;

        this._rgb = rgb;

        
        this._w = 1;
        this._h = 1;

        // this._progress = 0;
        // this._maxProgress = 4;
        this._animation = [0, 10];
        this._framesCounter = 0;
        this._maxRenderFrames = speed;

        this.visible = true;

    };

    cp.reset = function(ctx, face){

        this._framesCounter = 0;
        this._maxRenderFrames = getRandomInt(20,70);
        // this._offset[0] = getRandomInt()
        this._rgb[2] = getRandomInt(0,255);
        this._h = getRandomInt(1,2);
        this.visible = true;

        // ctx.save();
        // ctx.translate(face.width/2, face.height/2);

        var r = getRandomInt(100,255);
        var g = getRandomInt(100,255);
        var b = getRandomInt(100,220);
        ctx.fillStyle = 'rgba('+r+','+g+','+b+','+1+')';
        // ctx.fillRect(8, 8, face.width, face.height);
       
        // ctx.restore();
    };

    cp.render = function(ctx, face, normalizedVol){

        if (!this.visible) return;

        var animationSteps = this._maxRenderFrames / this._animation[1];
        var currentStep = this._framesCounter / animationSteps;


        // console.log('currentStep: ',currentStep);


        ctx.save();

        ctx.translate(face.width/2, face.height/2);
        // ctx.transform(1, Math.tan(.9), 0, 1, 0, 0);
        // ctx.scale(2*normalizedVol,1*normalizedVol);
        // ctx.rotate((1.5*(currentStep/this._animation[1]))*Math.PI);

        var alpha = 1;
        this._rgb[0] = Math.abs(Math.floor((currentStep/this._animation[1])-1) * getRandomInt(200,255));
        // this._rgb[2] = Math.abs(Math.floor((currentStep/this._animation[1])-1) * getRandomInt(200,255));
        this._rgb[1] = Math.floor((currentStep/this._animation[1]) * getRandomInt(100,255));
        ctx.strokeStyle = 'rgba('+this._rgb[0]+','+this._rgb[1]+','+this._rgb[2]+','+alpha+')';
        
        ctx.beginPath();
        // ctx.rect(-this._w/2 +this._offset[0], (-this._h/2 + this._offset[1])+currentStep, this._w + (normalizedVol*6), this._h);
        ctx.rect(-this._w/2 +this._offset[0], (-this._h/2 + this._offset[1])+currentStep, this._w, this._h);
        
        ctx.closePath();
        ctx.stroke();
        // ctx.stroke();
        ctx.restore();

        if (this._framesCounter >= this._maxRenderFrames){
            // this.reset();
            this.visible = false;
        }
        else
            this._framesCounter++;

    };

    var MidDrop = function(){};

    mscp.MidDrop = MidDrop;
    var cp = MidDrop.prototype;

    cp.init = function(index, rgb, offset, speed){

        this._index = index;

        this._offset = offset;


        this._midrgb = rgb;

        
        this._w = 1;
        this._h = 1;

        // this._progress = 0;
        // this._maxProgress = 4;
        this._animation = [0, 10];
        this._framesCounter = 0;
        this._maxRenderFrames = speed;

        this.visible = true;

    };

    cp.reset = function(){

        this._framesCounter = 0;
        this._maxRenderFrames = getRandomInt(20,100);
        // this._offset[0] = getRandomInt()
        this.visible = true;
    };

    cp.render = function(ctx, face, normalizedVol){

        var xOffset = face.width - this._offset[0]*1.2;

        // if (!this.visible) return;

        // var animationSteps = this._maxRenderFrames / this._animation[1];
        // var currentStep = this._framesCounter / animationSteps;


        // console.log('currentStep: ',currentStep);

        var energyHeight = normalizedVol*8;


        ctx.save();

        ctx.translate(0, face.height/2);
        // ctx.transform(1, Math.tan(.9), 0, 1, 0, 0);
        ctx.scale(3*normalizedVol,1*normalizedVol);
        // ctx.rotate((.001*normalizedVol)*Math.PI);

        var alpha = 1;
        // this._midrgb[0] = Math.floor(normalizedVol * getRandomInt(230,255));
        this._midrgb[1] = Math.floor((this._index/9) * getRandomInt(200,255));
        this._midrgb[2] = Math.floor((this._index/9) * getRandomInt(200,255));
        ctx.strokeStyle = 'rgba('+this._midrgb[0]+','+this._midrgb[1]+','+this._midrgb[2]+','+alpha+')';
        
        ctx.beginPath();
        // ctx.rect(-this._w/2 +this._offset[0], (-this._h/2 + this._offset[1])+currentStep, this._w + (normalizedVol*6), this._h);
        
        ctx.moveTo(xOffset, -face.height/2);
        ctx.lineTo(xOffset, face.height/2);
        // ctx.rect(xOffset, (-this._h/2 + this._offset[1]) - energyHeight/4, this._w, this._h);
        // ctx.arc(xOffset, (-this._h/2 + this._offset[1]) - energyHeight/4, 1, 0, Math.PI*2, true);
        
        ctx.closePath();
        ctx.stroke();
        // ctx.stroke();
        ctx.restore();

        // if (this._framesCounter >= this._maxRenderFrames){
        //     // this.reset();
        //     this.visible = false;
        // }
        // else
        //     this._framesCounter++;

    };




    var HarpaMSCP004 = function() {

        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

        this._squares = [];

        this._circles = [];

        this._drops = [];
        this._midDrops = [];
        
        this._volHistory = [];
        this._volHistory.push(0);




    };

    var p = HarpaMSCP004.prototype = new HarpaVisualiserBase();
    var s = HarpaVisualiserBase.prototype;

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight){

        s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);

        var beatCircleRgb = [200,10,100];
        var volCircleRgb = [100,200,200];

        var btmSquaresRgb = [200,10,200];
        var middleSquaresRgb = [250,120,100];
        var topSquaresRgb = [10, 200 ,200];


        for (var i=0;i<7;i++){
            var drop = new mscp.Drop();
            if (i == 0){
                var speed = 100;
                var offset = [-12,-7];
            }
            else if (i == 1){
                var speed = 60;
                var offset = [-3, -7];
            }
            else if (i == 2){
                var speed = 80;
                var offset = [10, -7];
            }
            else if (i == 3){
                var speed = 20;
                var offset = [-7, -7];
            }
            else if (i == 4){
                var speed = 40;
                var offset = [6, -7];
            }
            else if (i == 5){
                var speed = 140;
                var offset = [14, -7];
            }
            else if (i == 6){
                var speed = 140;
                var offset = [1, -7];
            }
            else if (i == 7){
                var speed = 140;
                var offset = [-16, -7];
            }
            else if (i == 8){
                var speed = 140;
                var offset = [3, -7];
            }

            drop.init(i, volCircleRgb, offset, speed);

            this._drops.push(drop);
        }


        for (var i=0;i<9;i++){
            var drop = new mscp.MidDrop();
            if (i == 0){
                var speed = 100;
                var offset = [2, 0];
            }
            else if (i == 1){
                var speed = 60;
                var offset = [5, 0];
            }
            else if (i == 2){
                var speed = 80;
                var offset = [8, 0];
            }
            else if (i == 3){
                var speed = 20;
                var offset = [11, 0];
            }
            else if (i == 4){
                var speed = 40;
                var offset = [14, 0];
            }
            else if (i == 5){
                var speed = 140;
                var offset = [17, 0];
            }
            else if (i == 6){
                var speed = 140;
                var offset = [20, 0];
            }
            else if (i == 7){
                var speed = 140;
                var offset = [23, 0];
            }
            else if (i == 8){
                var speed = 140;
                var offset = [26, 0];
            }

            drop.init(i, middleSquaresRgb, offset, speed);

            this._midDrops.push(drop);
        }



       

        
    };

   

   


    p.render = function() {

        // ** Volume visualisation **

        // render simple bar on the front

        this.frontCtx.clearRect(0,0,this.faces.front.width,this.faces.front.height);

       
        var normalizedVol = 1 - (this.currentVolume / 20000);

        normalizedVol = Math.min(1, normalizedVol);

        this._volHistory.unshift(normalizedVol);

        for (var i=0;i<this._drops.length;i++){
            // if (this._volHistory[0] < .3) this._drops[i].reset();
            if (this.currentBeatValue > .7) this._drops[i].reset(this.frontCtx, this.faces.front);
            this._drops[i].render(this.frontCtx, this.faces.front, this._volHistory[0]);
        }



        // for (var i=0;i<this._squares.length;i++){

        //     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[0];
        //     this._squares[i].render(this.frontCtx, this.faces.front, volVal);
        // }

        // for (var i=0;i<this._volCircles.length;i++){

        //     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[0];
        //     this._volCircles[i].render(this.frontCtx, this.faces.front, volVal);
        // }

        this.sideCtx.clearRect(0,0,this.faces.side.width,this.faces.side.height);

         for (var i=0;i<this._midDrops.length;i++){
            // if (this._volHistory[0] < .3) this._drops[i].reset();
            // if (this.currentBeatValue > .7) this._drops[i].reset();
            this._midDrops[i].render(this.sideCtx, this.faces.side, this._volHistory[i*2]);
        }

        // for (var i=0;i<this._circles.length;i++){

        //     var volVal = i == 0 ? this._volHistory[0] : this._volHistory[2*i];
        //     this._circles[i].render(this.sideCtx, this.faces.side, volVal);
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


    global.HarpaMSCP004 = (global.module || {}).exports = HarpaMSCP004;



})(this);
