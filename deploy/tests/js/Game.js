(function() {
	
	var Game = {

		pw : 0.04,
		ph : 0.02,
		ballSize : 0.01,

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


		init : function() {

			this.reset();

			
			return this;
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

		reflectBall : function() {
			this.pos.ball.velocity.x *= Math.random() * 4 - 2;
			this.pos.ball.velocity.y *= -1.1;

			if (this.pos.ball.y < 0) this.pos.ball.y = 0;
			if (this.pos.ball.y > 1) this.pos.ball.y = 1;
		},

		goalScored : function(direction) {

			console.log("GOAL TO " + direction);
			this.reset();

		},

		setPlayerPosition : function(which, position){

			if (position < this.pw / 2) position = this.pw / 2;
			if (position > 1 - this.pw / 2) position = 1 - this.pw / 2;

			if (which == "a")
				this.pos.a.x = position;
			else
				this.pos.b.x = position;
		}


	};

	window.Game = Game;


})();