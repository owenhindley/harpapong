//Aurora Visualiser by FIELD (David Li/Marcus Wendt)

var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");

var globals = {};

(function(global){
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  
  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

})(globals);




    //CHANGE THIS TO VARY THE OVERALL SEED (higher = faster, smaller = slower)
    var TIME_STEP = 0.00075;

    //WARNING: the code is messy

    var GRADIENT_STEP = TIME_STEP * 10;

    var VERTICAL_NOISE_POSITION_SCALE = 1/ 200;

    var MIN_HORIZONTAL_NOISE_POSITION_SCALE = 1 / 80;
    var MAX_HORIZONTAL_NOISE_POSITION_SCALE = 1 / 30;

    var MIN_NOISE_SCALE = 7.5;
    var MAX_NOISE_SCALE = 15;

    var FRONT_WIDTH = 37;
    var FRONT_HEIGHT = 13;

    var SIDE_WIDTH = 39;
    var SIDE_HEIGHT = 9;

    var SIDE_Y_OFFSET = 7;

    var HUE_SHIFTS = [0, 10, 20, 30, 330, 340, 350]; //we don't like greens and yellows

    var GRADIENT = [
        {
            location: 0,
            color: [70, 250, 205]
        },
        {
            location: 0.19,
            color: [55, 75, 245]
        },
        {
            location: 0.39,
            color: [58, 0, 255]
        },
        {
            location: 0.57,
            color: [4, 20, 205]
        },
        {
            location: 0.77,
            color: [49, 3, 140]
        },
        {
            location: 1,
            color: [0, 0, 0]
        }
    ];


    var mix = function (x, y, a) {
        return x * (1 - a) + y * a;
    }

    var evaluateGradient = function (gradient, location) {
        if (location < 0 || location > 1) {
            return [0, 0, 0];
        }

        var leftIndex = 0;
        var rightIndex = 1;

        while (location > gradient[rightIndex].location) {
            leftIndex++;
            rightIndex++;
        }

        var leftColor = gradient[leftIndex].color;
        var rightColor = gradient[rightIndex].color;

        var leftLocation = gradient[leftIndex].location;
        var rightLocation = gradient[rightIndex].location;

        var fraction = (location - leftLocation) / (rightLocation - leftLocation);

        var output = [];
        for (var i = 0; i < 3; ++i) {
            output[i] = mix(leftColor[i], rightColor[i], fraction);
        }
        return output;
    };

    var fbm = function (x, y, z, octaves) {
        var total = 0;
        var value = 1;
        for (var i = 0; i < octaves; ++i) {
            total += globals.noise.simplex3(x, y, z) * value;
            x *= 2;
            y *= 2;
            z *= 2;
            value *= 0.5;
        }
        return total;
    }

    var contrast = function(rgb, contrast) {
        var out = [];

        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for(var i = 0; i < 3; i +=1) {
            out[i] = factor * (rgb[i] - 128) + 128;
        }
        return out;
    }

    var hslToRGB = function (hsl){
        var h = hsl[0];
        var s = hsl[1];
        var l = hsl[2];

        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    var rgbToHSL = function (rgb){
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];

        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    var AuroraVisualiser = function() {
        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

        this.gradientOffset = Math.random() * 10;

        globals.noise.seed(Math.random());

        this.time = Math.random() * 400.0;
    }

    var p = AuroraVisualiser.prototype = new HarpaVisualiserBase();

    var positiveMod = function (x, y) {
        return (x % y + y) % y;
    }

    var GRADIENT_SCALE = 0.35;
    p.evaluateBaseColor = function (x, y) {
        var unmoddedGradientPosition = ((y / FRONT_HEIGHT) + this.gradientOffset) * GRADIENT_SCALE;
        var hueShift = HUE_SHIFTS[positiveMod(Math.floor(unmoddedGradientPosition), HUE_SHIFTS.length)] / 360;

        var gradientPosition = positiveMod(unmoddedGradientPosition, 1);
        var color = evaluateGradient(GRADIENT, gradientPosition);

        var hsl = rgbToHSL(color);
        hsl[0] = (hsl[0] + hueShift) % 360;
        hsl[1] -= 0.3;
        var output = hslToRGB(hsl);

        output = contrast(output, 50);

        return output;
    }

    var square = function (x) {
        return x * x;
    }

    p.evaluate = function (x, y) {
        var noiseScale = MIN_NOISE_SCALE + (Math.sin(this.time) * 0.5 + 0.5) * (MAX_NOISE_SCALE- MIN_NOISE_SCALE);
        var horizontalNoisePositionScale = MIN_HORIZONTAL_NOISE_POSITION_SCALE + (Math.sin(this.time * 1.1) * 0.5 + 0.5) * (MAX_HORIZONTAL_NOISE_POSITION_SCALE - MIN_HORIZONTAL_NOISE_POSITION_SCALE);

        var noiseOffsetX = fbm(x * horizontalNoisePositionScale - Math.sin(this.time * 2.0) * 2, y * VERTICAL_NOISE_POSITION_SCALE, this.time, 4) * noiseScale;
        var noiseOffsetY = fbm(x * horizontalNoisePositionScale - Math.sin(this.time * 2.0) * 2 + 13123, y * VERTICAL_NOISE_POSITION_SCALE + -1235, this.time - 123, 4) * noiseScale;

        var color = this.evaluateBaseColor(x + noiseOffsetX, y + noiseOffsetY);

        var DETAIL_SCALE = 0.5;
        var DETAIL_AMPLITUDE = 50.0;
        color[0] += square(fbm(x * DETAIL_SCALE, y * DETAIL_SCALE, this.time * 15.0, 4)) * DETAIL_AMPLITUDE;
        color[1] += square(fbm(x * DETAIL_SCALE + 12321.5, y * DETAIL_SCALE + 218, this.time * 15.0 - 213, 4)) * DETAIL_AMPLITUDE;
        color[2] += square(fbm(x * DETAIL_SCALE - 213, y * DETAIL_SCALE + 594, this.time * 15.0 + 102, 4)) * DETAIL_AMPLITUDE;

        return color;
    }

    p.render = function() {
        var noiseScale = MIN_NOISE_SCALE + (Math.sin(this.time) * 0.5 + 0.5) * (MAX_NOISE_SCALE- MIN_NOISE_SCALE);

        this.time += TIME_STEP;
        this.gradientOffset += GRADIENT_STEP;

        var frontImageData = this.frontCtx.createImageData(1,1);
        var sideImageData = this.sideCtx.createImageData(1, 1);

        this.frontCtx.fillStyle = 'black';
        this.frontCtx.fillRect(0, 0, this.frontCtx.canvas.width, this.frontCtx.canvas.height);

        this.sideCtx.fillStyle = 'black';
        this.sideCtx.fillRect(0, 0, this.sideCtx.canvas.width, this.sideCtx.canvas.height);

        var overlayRGB = [];
        var rgb = []; //cache

        for (var y = 0; y < SIDE_HEIGHT; ++y) {
            for (var x = 0; x < SIDE_WIDTH; ++x) {
                var color = this.evaluate(x - FRONT_WIDTH, y + SIDE_Y_OFFSET);

                sideImageData.data[0] = color[0];
                sideImageData.data[1] = color[1];
                sideImageData.data[2] = color[2];
                sideImageData.data[3] = 255;
                this.sideCtx.putImageData(sideImageData, x, y);
            }
        }

        for (var y = 0; y < FRONT_HEIGHT; ++y) {
            for (var x = 0; x < FRONT_WIDTH; ++x) {
                var color = this.evaluate(x, y);

                frontImageData.data[0] = color[0];
                frontImageData.data[1] = color[1];
                frontImageData.data[2] = color[2];
                frontImageData.data[3] = 255;
                this.frontCtx.putImageData(frontImageData, x, y);
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

module.exports = AuroraVisualiser;