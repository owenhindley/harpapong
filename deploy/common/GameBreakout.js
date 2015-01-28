(function(global) {

  var Game = {

	pw : 0.12,
	ph : 0.04,
	ballSize : 0.02,
	ballSpeed : 0.0002,
	blockWidth: 0.1,
	blockHeight:0.1,

	currentBall: null,

	lives : {
	  a : 5,
	  b : 5
	},

	pos : {
		a : { x : 0.5, y : 0.1 },
		b : { x : 0.5, y : 0.9 },
		balls : [
			{
			x : 0.5,
			y : 0.2,
			velocity : {
					x : 0,
					y : 0
				}
			},
			{
			x : 0.5,
			y : 0.8,
			velocity : {
					x : 0,
					y : 0
				}
			},
		],
		blocks: [
			{ x : 0.3, y: 0.6, active: true, extraLife: true },
			{ x : 0.4, y: 0.6, active: true, extraLife: false },
			{ x : 0.5, y: 0.6, active: true, extraLife: false },
			{ x : 0.6, y: 0.6, active: true, extraLife: false },
			{ x : 0.7, y: 0.6, active: true, extraLife: true },

			{ x : 0.3, y: 0.4, active: true, extraLife: true },
			{ x : 0.4, y: 0.4, active: true, extraLife: false },
			{ x : 0.5, y: 0.4, active: true, extraLife: false },
			{ x : 0.6, y: 0.4, active: true, extraLife: false },
			{ x : 0.7, y: 0.4, active: true, extraLife: true }
		]
	},

	stateSnapshot : null,

	goalCallback : null,
	blockHitCallback : null,
	bounceCallback : null,


	init : function() {

	  return this;
	},

	startGame : function(goal_callback, bounce_callback, num_starting_lives) {

		this.goalCallback = goal_callback;
		this.bounceCallback = bounce_callback;

		this.lives.a = num_starting_lives || 5;
		this.lives.b = num_starting_lives || 5;

		this.reset();

		console.log("GAME : Starting game");

	},

	reset : function() {

		this.resetBall(0);
		this.resetBall(1);

	},

	resetBall : function(which) {

		this.pos.balls[which].x = which ? this.pos.a.x : this.pos.b.x;
		this.pos.balls[which].y = which ? 0.2 : 0.8;

		// give ball a nudge in the correct direction

		this.pos.balls[which].velocity.x = Math.random() * this.ballSpeed - 0.0001;
		this.pos.balls[which].velocity.y = which ? this.ballSpeed : -this.ballSpeed;

	},

	update : function(dt) {

	  for (var i=0; i < 2; i++){

		this.currentBall = this.pos.balls[i];

		// update balls position
		this.currentBall.x += this.currentBall.velocity.x * dt;
		this.currentBall.y += this.currentBall.velocity.y * dt;

		// paddle collision check
		if (this.currentBall.y < this.pos.a.y)
			if ((this.currentBall.x > this.pos.a.x - this.pw / 2) && (this.currentBall.x < this.pos.a.x + this.pw / 2)){
			  // check where the ball hit the paddle
			  var bouncePoint = (((this.pos.a.x + this.pw) - this.currentBall.x) / this.pw) - 0.5;
			  this.reflectBall(bouncePoint, this.currentBall);
			  this.currentBall.y = this.pos.a.y;
			}


		if (this.currentBall.y > this.pos.b.y)
			if ((this.currentBall.x > this.pos.b.x - this.pw / 2) && (this.currentBall.x < this.pos.b.x + this.pw / 2)){
			  // check where the ball hit the paddle
			  var bouncePoint = (((this.pos.b.x + this.pw) - this.currentBall.x) / this.pw) - 0.5;
			  this.reflectBall(bouncePoint, this.currentBall);
			  this.currentBall.y = this.pos.b.y;
			}


		// bounds check
		if (this.currentBall.x > 1 || this.currentBall.x < 0) this.currentBall.velocity.x *= -1;

		if (this.currentBall.y > 1) {
			this.goalScored(1, this.currentBall)
		} else if (this.currentBall.y < 0){
			this.goalScored(-1, this.currentBall)
		}

		// blocks check
		for (var j=0; j < this.pos.blocks.length; j++){

			var block = this.pos.blocks[j];
			if (block.active){
				if ((this.currentBall.x > block.x - this.blockWidth/2) && (this.currentBall.x < block.x + this.blockWidth/2))
					if ((this.currentBall.y > block.y - this.blockHeight/2) && (this.currentBall.y < block.y + this.blockHeight/2))
					{
						block.active = false;
						this.reflectBall(0.5, this.currentBall, true);
						this.blockStruck(block, this.currentBall);
					}

			}
			

		}

	  }

	},

	serialiseState : function() {

		var data = [
			this.pos.a.x,
			this.pos.a.y,
			this.pos.b.x,
			this.pos.b.y,
			this.pos.balls[0].x,
			this.pos.balls[0].y,
			this.pos.balls[1].x,
			this.pos.balls[1].y,
			this.lives.a,
			this.lives.b
		];

		for (var i=0; i < this.pos.blocks.length; i++){
			data.push(this.pos.blocks[i].x);
			data.push(this.pos.blocks[i].y);
			data.push(this.pos.blocks[i].active);
			data.push(this.pos.blocks[i].extraLife);
		}

		this.stateSnapshot = data;

		return data;
	},

	setFromSerialised : function(data){

		this.pos.a.x = data[0];
		this.pos.a.y = data[1];
		this.pos.b.x = data[2];
		this.pos.b.y = data[3];

		this.pos.balls[0].x = data[4];
		this.pos.balls[0].y = data[5];
		this.pos.balls[1].x = data[6];
		this.pos.balls[1].y = data[7];
		this.lives.a = data[8];
		this.lives.b = data[9];


		for (var i=0; i < this.pos.blocks.length; i++){

			this.pos.blocks[i].x = data[10 + (i * 4)];
			this.pos.blocks[i].y = data[11 + (i * 4)];
			this.pos.blocks[i].active = data[12 + (i * 4)];
			this.pos.blocks[i].extraLife = data[13 + (i * 4)];

		}

	},

	reflectBall : function(bouncePoint, ball, mirror) {

		bouncePoint = bouncePoint - 0.5;

		console.log(bouncePoint);

		if (!mirror){
			ball.velocity.x = bouncePoint * -0.0008;	
		}
		

		ball.velocity.x += Math.random() * 0.00001; // just in case something gets stuck
		ball.velocity.y *= -1.001;

		if (ball.y < 0) ball.y = 0;
		if (ball.y > 1) ball.y = 1;

		if (this.bounceCallback)
			this.bounceCallback();
	},

	blockStruck: function(block, ball) {

		// check if this is an 'extra life' block
		if (block.extraLife){

			// infer which player hit this block from the direction of movement
			if (ball.velocity.y > 0){
				this.lives.b++
			} else {
				this.lives.a++;
			}

		}

		if (this.blockHitCallback){
			this.blockHitCallback(block.extraLife);
		}
		

	},

	goalScored : function(direction, ball) {

	  console.log("GOAL TO " + direction);

	  if (direction > 0){
		this.lives.b--;
	  } else {
		this.lives.a--;
	  }

	  if (this.goalCallback)
		this.goalCallback();

	  this.resetBall(this.pos.balls.indexOf(ball));

	},

	setPlayerPosition : function(which, position){

	  if (position < this.pw / 2) position = this.pw / 2;
	  if (position > 1 - this.pw / 2) position = 1 - this.pw / 2;

	  if (which == "a")
		this.pos.a.x = position;
	  if (which == "b")
		this.pos.b.x = position;
	}


	};

	global.Game = (global.module || {}).exports = Game;


})(this);
