// color foo
var lightctrl = require('./lightctrl.js');
var modes     = lightctrl.modes;
var client    = new lightctrl.DmxClient("2.224.168.149");
var colors = require('./colors.js');

client.client.UNIVERSE = [1,0];

var c1_blue  = {red:0, green:0, blue:255};
var c1_green = {red:0, green:255, blue:0};
var c1_red   = {red:255, green:0, blue:0};
var c1_white = {red:255, green:255, blue:255};

var left   = new lightctrl.Device(client, 33, modes['3_segment']);
// var middle = new lightctrl.Device(client, 67, modes['1_segment']);
// var right  = new lightctrl.Device(client, 56, modes['1_segment']);

var colors = [colors.c3_blue_r, colors.c3_blue_l, colors.c3_blue_m];
// var len = colors.length;
// var cyclewait = 250;
// var counter = 0;
// var cycleColors = function(){
//     left.setVals(colors[(counter+0)%len]);
//     // middle.setVals(colors[(counter+1)%len]);
//     // right.setVals(colors[(counter+2)%len]);
//     client.flush();
//     counter++;
//     setTimeout(cycleColors, cyclewait);
// };
// cycleColors();

left.setVals({red_l : 0, green_l : 0, blue_l : 0}, true);