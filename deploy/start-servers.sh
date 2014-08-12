#!/bin/bash

forever stopall

forever start /var/www/harpapong/queue-server/queue-server.js
forever start /var/www/harpapong/game-server/game-server.js