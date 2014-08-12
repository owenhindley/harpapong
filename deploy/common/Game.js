(function(global) {
	
	var Game = {

		pw : 0.04,
		ph : 0.02,
		ballSize : 0.01,

		scores : {
			a : 0,
			b : 0
		},

		pos : {
			a : { x : 0.5, y : 0 },
			b : { x : 0.5, y : 1 },
			ball : {
				x : 0.5,
				y : 0.5,
				velocity : {
					x : 0,
					y : 0
				}
			}
		},

		stateSnapshot : null,

		goalCallback : null,


		init : function() {
			
			return this;
		},

		startGame : function(goal_callback) {

			this.goalCallback = goal_callback;

			this.scores.a = 0;
			this.scores.b = 0;

			this.reset();

			console.log("GAME : Starting game");

		},

		reset : function() {


			this.pos.ball.x = 0.5;
			this.pos.ball.y = 0.5;

			// give ball a nudge
			this.pos.ball.velocity.x = Math.random() * 0.0002 - 0.0001;
			this.pos.ball.velocity.y = (Math.random() > 0.5) ? 0.0002 : -0.0002;

			
		},

		update : function(dt) {


			// update ball position
			this.pos.ball.x += this.pos.ball.velocity.x * dt;
			this.pos.ball.y += this.pos.ball.velocity.y * dt;

			// paddle collision check
			if (this.pos.ball.y < this.pos.a.y)
				if ((this.pos.ball.x > this.pos.a.x - this.pw / 2) && (this.pos.ball.x < this.pos.a.x + this.pw / 2))
					this.reflectBall();
					

			if (this.pos.ball.y > this.pos.b.y)
				if ((this.pos.ball.x > this.pos.b.x - this.pw / 2) && (this.pos.ball.x < this.pos.b.x + this.pw / 2))
					this.reflectBall();
					

			// bounds check
			if (this.pos.ball.x > 1 || this.pos.ball.x < 0) this.pos.ball.velocity.x *= -1;
			if (this.pos.ball.y > 1) {
				this.goalScored(1)
			} else if (this.pos.ball.y < 0){
				this.goalScored(-1)
			}


		},

		serialiseState : function() {

			var data = [
				this.pos.a.x,
				this.pos.a.y,
				this.pos.b.x,
				this.pos.b.y,
				this.pos.ball.x,
				this.pos.ball.y,
				this.scores.a,
				this.scores.b
			];

			this.stateSnapshot = data;

			return data;
		},

		setFromSerialised : function(data){

			this.pos.a.x = data[0];
			this.pos.a.y = data[1];
			this.pos.b.x = data[2];
			this.pos.b.y = data[3];
			this.pos.ball.x = data[4];
			this.pos.ball.y = data[5];
			this.scores.a = data[6];
			this.scores.b = data[7];

		},

		reflectBall : function() {
			this.pos.ball.velocity.x *= Math.random() * 4 - 2;
			this.pos.ball.velocity.x += Math.random() * 0.00001; // just in case something gets stuck
			this.pos.ball.velocity.y *= -1.1;

			if (this.pos.ball.y < 0) this.pos.ball.y = 0;
			if (this.pos.ball.y > 1) this.pos.ball.y = 1;
		},

		goalScored : function(direction) {

			console.log("GOAL TO " + direction);

			if (direction > 0){
				this.scores.a++;
			} else {
				this.scores.b++;
			}

			if (this.goalCallback)
				this.goalCallback();


			this.reset();

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