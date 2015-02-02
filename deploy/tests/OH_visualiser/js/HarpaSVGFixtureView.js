(function(global){

    var HarpaSVGFixtureView = function() {

    };

    var p = HarpaSVGFixtureView.prototype;

    p.init = function(width, height, svg_source, inverted) {

        this.svg_source = svg_source;
        this.width = width;
        this.height = width;
        this.inverted = inverted || false;

        this.element = document.createElement("div");
        this.element.className = "fixtureView";

        this.fixtureWidth = 20;

        this.offsets = {
            x : {
                x : 17.8 * 0.8,
                y : 1.06 * (this.inverted ? -1 : 1) * 0.8
            },
            y : {
                x : 3.755 * 0.8,
                y : 28.495 * 0.8
            }
        };

        // create fixtures

        this.fixtures = [];
        for (var i=0; i < width; i++){
            this.fixtures[i] = [];
            for (var j=0; j < height; j++){

                var label = "fixture_" + i + "_" + j;

                var newFixtureElement = document.createElement("div");
                newFixtureElement.className = "fixture";
                newFixtureElement.setAttribute("id", label);
                newFixtureElement.innerHTML = this.svg_source;
                var newFixtureLight = newFixtureElement.querySelector("rect");
                this.fixtures[i].push(newFixtureLight);

                this.element.appendChild(newFixtureElement);
                newFixtureElement.style.left = this.offsets.x.x * i + this.offsets.y.x * j + "px";
                newFixtureElement.style.top = this.offsets.x.y * i + this.offsets.y.y * j + "px";

                this.setPixel(255,255,255,i,j);
            }
        }


    };

    p.disableFixture = function(x,y) {
        this.fixtures[x][y].parentElement.parentElement.style.display = "none";

    };


    p.render = function(aContext) {

        // updates lights from Canvas context

        // get image data and send to pixelmapper
        var canvasWidth = aContext.canvas.width;
        var canvasHeight = aContext.canvas.height;
        var imgData = aContext.getImageData(0,0,canvasWidth, canvasHeight).data;



        var x, y = 0;
        var index = 0;
        for (var i = 0; i < imgData.length; i+=4){

            y = Math.floor( (i / 4) / canvasWidth );
            x = (i / 4) % canvasWidth;

            this.setPixel(imgData[i], imgData[i+1], imgData[i+2], x, y);

        }

    };

    p.setPixel = function(r,g,b,x,y) {

        this.fixtures[x][y].style.fill = "rgb(" + r + "," + g + "," + b + ")";

    };


    global.HarpaSVGFixtureView = (global.module || {}).exports = HarpaSVGFixtureView;

})(this);
