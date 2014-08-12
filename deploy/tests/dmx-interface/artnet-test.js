var artnetclient = require('./node_modules/artnet-node/lib/artnet_client');

var data = [255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];

var client = artnetclient.createClient('2.224.168.149', 6454);
client.send(data);