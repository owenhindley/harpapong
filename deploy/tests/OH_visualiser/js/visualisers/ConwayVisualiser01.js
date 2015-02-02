(function(global){

    /*

        Conway's Game of Life Visualiser
        Owen Hindley 2015

    */

    var ConwayVisualiser = function() {

        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

        this.grid = [];
        this.tempGrid = []; // temp holding grid

        this.tempImgData = null;
        this.tempCanvas = null;

        this.updateCounter = 0;

        this.searchSpiral = [
            [0,1],
            [1,1],
            [1,0],
            [1,-1],

            [0,-1],
            [-1,-1],
            [-1,0],
            [-1,1]
        ];

        this.gridSize = 10;
        this.defaultSeedAmount = 20;

        this.perlinNoise = new SimplexNoise();
        this.perlinNoiseIndex = 0;
        this.perlinNoiseSpeed = 0.01;

        this.colours = [
            net.brehaut.Color('#FD654E'),
            net.brehaut.Color('#2FCA2A'),
            net.brehaut.Color('#CA6E2A')
        ];

    }

    var p = ConwayVisualiser.prototype = new HarpaVisualiserBase();
    var s = HarpaVisualiserBase.prototype;

    p.init = function(frontWidth, frontHeight, sideWidth, sideHeight) {
        s.init.call(this, frontWidth, frontHeight, sideWidth, sideHeight);



        // setup Grid

        for (var i=0; i < this.gridSize; i++){
            this.grid[i] = [];
            this.tempGrid[i] = [];
            for (var j = 0; j < this.gridSize; j++){
                this.grid[i][j] = 0;
                this.tempGrid[i][j] = 0;
            }
        }

        // setup temp (10px x 10px) image data
        this.tempCanvas = document.createElement("canvas");
        this.tempCanvas.width = this.gridSize;
        this.tempCanvas.height = this.gridSize;
        this.tempImgData = this.frontCtx.createImageData(this.gridSize,this.gridSize);
        this.tempD = this.tempImgData.data;
        this.tempCtx = this.tempCanvas.getContext("2d");

        this.seed(this.defaultSeedAmount);

        // this.update();

    }

    p.seed = function(aNumberSeeds) {

        // clear grid
        for (var i=0; i < this.gridSize; i++){
            for (var j=0; j < this.gridSize; j++){
                this.grid[i][j] = 0;
            }
        }

        // add seeds
        for (var i =0; i < aNumberSeeds; i++){
            var x = Math.min(Math.floor(Math.random() * this.gridSize), this.gridSize-1);
            var y = Math.min(Math.floor(Math.random() * this.gridSize), this.gridSize-1);
            this.grid[x][y] = 1;
        }

    };


    p.render = function() {

        this.updateCounter++;
        if (this.updateCounter > 2){
            this.update();
            this.updateCounter = 0;
        }

        // render perlin texture
        var noisevalue = 0;
        var colour = null;
        this.perlinNoiseIndex += this.perlinNoiseSpeed;

        // front face
        this.frontCtx.globalCompositeOperation = "source-over";
        for (i =0; i < this.faces.front.width; i++){
            for (j = 0; j < this.faces.front.height; j++){
                noisevalue = Math.abs(this.perlinNoise.noise3d(i/10,j/10, this.perlinNoiseIndex))+ 0.5;
                colour = this.getColour(noisevalue);
                this.frontCtx.fillStyle = colour.toCSS();
                this.frontCtx.fillRect(i,j,1,1);
            }
        }
        // side face
        this.sideCtx.globalCompositeOperation = "source-over";
        for (i =0; i < this.faces.side.width; i++){
            for (j = 0; j < this.faces.side.height; j++){
                noisevalue = Math.abs(this.perlinNoise.noise3d(i/10,j/10, this.perlinNoiseIndex)) + 0.5;
                colour = this.getColour(noisevalue);
                this.sideCtx.fillStyle = colour.toCSS();
                this.sideCtx.fillRect(i,j,1,1);
            }
        }


        // go through grid, create image data
        //
        var imgDataIndex = 0;
        var cellValue = 0;
        var colourValue = 0;
        for (i =0; i < this.gridSize; i++){
            for (j = 0; j < this.gridSize; j++){
                cellValue = this.grid[i][j];
                colourValue = Math.min(((cellValue > 0) ? 32 + cellValue * 64 : 0), 255);
                colourValue = cellValue > 0 ? 255 : 0;
                this.tempD[imgDataIndex] = colourValue;
                this.tempD[imgDataIndex+1] = colourValue;
                this.tempD[imgDataIndex+2] = colourValue;
                this.tempD[imgDataIndex+3] = 255;

                imgDataIndex += 4;
            }
        }
        this.tempImgData.data = this.tempD;
        this.tempCtx.putImageData(this.tempImgData,0,0);
        //
        // this.tempCtx.save();
        // this.tempCtx.translate(0,-5);
        // this.tempCtx.rotate(45 * Math.PI / 180);
        // this.tempCtx.fillStyle = "red";
        // this.tempCtx.fillRect(0, 2.5, 50, 2);
        // this.tempCtx.restore();
        //
        this.frontCtx.save();
        this.frontCtx.globalAlpha = 1 - (this.currentBeatValue * 2.0);
        this.frontCtx.globalCompositeOperation = "multiply";
        this.frontCtx.scale(2,1);
        this.frontCtx.translate(this.gridSize/-1, this.gridSize/-1);
        this.tileAcrossCanvas(this.tempCanvas, this.frontCtx);


        this.frontCtx.restore();

        // draw again on the front canvas, in white
        // this.frontCtx.save();
        //
        // this.frontCtx.globalCompositeOperation = "source-over";
        // this.frontCtx.globalAlpha = this.currentBeatValue * 2.0;
        // // this.frontCtx.scale(1,2);
        // this.frontCtx.translate(this.gridSize * 1.5, this.gridSize * 0.15);
        // this.frontCtx.drawImage(this.tempCanvas, 0,0);
        // this.frontCtx.strokeStyle = "white";
        // this.frontCtx.strokeWidth = 1;
        // this.frontCtx.strokeRect(0,0,this.gridSize, this.gridSize);
        //
        // this.frontCtx.restore();


        this.sideCtx.save();
        this.sideCtx.globalAlpha = 1 - this.currentBeatValue;
        this.sideCtx.globalCompositeOperation = "multiply";
        this.sideCtx.scale(2,1);
        this.sideCtx.translate(this.gridSize, -this.gridSize/2);
        this.tileAcrossCanvas(this.tempCanvas, this.sideCtx);
        this.sideCtx.restore();

    };

    p.tileAcrossCanvas = function(tileSource, destCanvasCtx) {

        // tile this as many times as neccesary
        var tileX = Math.ceil(destCanvasCtx.canvas.width / this.gridSize) + 1;
        var tileY = Math.ceil(destCanvasCtx.canvas.height / this.gridSize) + 1;

        destCanvasCtx.save();
        // destCanvasCtx.translate(-this.gridSize/2, -this.gridSize/2);

        var index = 0;
        for (var i=0; i < tileX; i++){
            for (var j =0; j < tileY; j++){
                destCanvasCtx.save();
                if (i % 2 == 0){
                    destCanvasCtx.scale(-1,1);

                    destCanvasCtx.translate((-i) * this.gridSize, (j) * this.gridSize);
                    //this.frontCtx.translate(i * this.gridSize,j * this.gridSize);
                    // destCanvasCtx.drawImage(this.tempCanvas, 0,0);
                } else {
                    destCanvasCtx.translate(-this.gridSize,0);
                    destCanvasCtx.translate((i) * this.gridSize, (j) * this.gridSize);

                }

                // destCanvasCtx.translate((i) * this.gridSize, (j) * this.gridSize);
                destCanvasCtx.drawImage(this.tempCanvas, 0,0);

                // this.frontCtx.drawImage(this.tempCanvas, 0,0);

                // this.frontCtx.putImageData(this.tempImgData,0,0);
                destCanvasCtx.restore();

                index++;
            }
        }

        destCanvasCtx.restore();


    };

    p.renderNoise = function(aContext) {



    };

    p.update = function() {

        // check beat input to see if we re-seed
        if (this.currentBeatValue > 0.5){
            this.seed(this.defaultSeedAmount);
        }

        // run Life rules & copy result into tempGrid
        var numNeighbours = 0;
        var cellValue = 0;
        var searchX, searchY;
        for (var i = 0; i < this.gridSize; i++){
            for (var j = 0; j < this.gridSize; j++){

                cellValue = this.grid[i][j];
                numNeighbours = 0;

                // search for neighbours in spiral pattern

                for (var k = 0; k < 8; k++){
                    searchX = i + this.searchSpiral[k][0];
                    searchY = j + this.searchSpiral[k][1];
                    if ((searchX >= 0 && searchX < this.gridSize) && (searchY >= 0 && searchY < this.gridSize)){
                        if (this.grid[searchX][searchY] > 0) numNeighbours++;
                    }
                }

                // if the cell just died in the previous cycle, reset it to 0
                if (cellValue < 0) cellValue = 0;

                // determine what to do depending on the number of numNeighbours

                // if the cell is alive..
                if (cellValue > 0){

                    switch (numNeighbours){
                        case 0:
                        case 1:
                            // cell dies
                            this.tempGrid[i][j] = -1;
                            //console.log("cell died");
                        break;

                        case 2:
                        case 3:
                            // cell stays alive
                            this.tempGrid[i][j] = cellValue + 1;
                            //console.log("cell stayed alive!");
                        break;

                        default:
                            // cell dies
                            this.tempGrid[i][j] = -1;
                            //console.log("cell died");
                        break;
                    }

                } else {

                    if (numNeighbours == 3){
                        // new live cell
                        this.tempGrid[i][j] = 1;

                    }
                }

            }
        }

        // copy tempGrid into current grid
        for (i =0; i < this.gridSize; i++){
            for (j = 0; j < this.gridSize; j++){
                    this.grid[i][j] = this.tempGrid[i][j];
            }
        }

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

    p.getColour = function(aAlpha) {

        if (aAlpha < 0.5){
            return this.colours[0].blend(this.colours[1], aAlpha / 0.5);
        } else {
            return this.colours[1].blend(this.colours[2], (aAlpha/2.0) / 0.5);
        }
    };


    global.ConwayVisualiser = (global.module || {}).exports = ConwayVisualiser;

})(this);
