#!/bin/bash

forever stopall

forever start ./queue-server/queue-server.js
forever start ./game-server/game-server.js