harpapong
=========

Let's play PONG on Harpa!

Harpa is the Icelandic national concert hall, in Reykjavik. It's covered in DMX RGB lamps, so...

Written mostly in Nodejs, contains:

- a queue server
- a game server (authoratative)
- a render server (we can have multiple ones of these)
- a client-facing site

Communicates with a pair of Chamsys Ethernet(ArtNet) -> DMX interfaces using the artnet-node module, plus some help from https://github.com/ydnax/node-dmxlights.

Project code by Owen Hindley www.owenhindley.co.uk
Project concept & production by Atli Bollason
