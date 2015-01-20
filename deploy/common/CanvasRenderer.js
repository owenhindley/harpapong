(function(global) {
	
	var CanvasRenderer = {

		canvas : null,
		ctx : null,
		isNode : false,

		width : 800,
		height : 600,

		init : function(_width, _height) {

			this.width = _width || 800;
			this.height = _height || 600;

			// Making this work in both node and browser contexts
			if (document && document.createElement){
				
				this.canvas = document.createElement("canvas");
				this.canvas.width = this.width;
				this.canvas.height = this.height;

			} else {
				this.isNode = true;
				var Canvas = require("canvas");
				this.canvas = new Canvas(this.width, this.height);

			}

			this.ctx = this.canvas.getContext("2d");
			this.ctx.fillStyle = "red";


			return this;
		},


		render : function(game){

			this.ctx.clearRect(0,0,this.width, this.height);

			this.ctx.save();

			this.ctx.scale(this.width, this.height);

			this.ctx.fillStyle = "red";

			// player a
			aX = (game.pos.a.x - game.pw / 2);
			aY = (game.pos.a.y - game.ph / 2);
			this.ctx.fillRect(aX, aY, game.pw, game.ph);

			// player b
			bX = (game.pos.b.x - game.pw / 2);
			bY = (game.pos.b.y - game.ph / 2);
			this.ctx.fillRect(bX, bY, game.pw, game.ph);

			// balls
			
			var bw = game.ballSize;

			this.ctx.fillRect(game.pos.balls[0].x -bw/2, game.pos.balls[0].y - bw/2, bw, bw);
			this.ctx.fillRect(game.pos.balls[1].x -bw/2, game.pos.balls[1].y - bw/2, bw, bw);

			// blocks
			this.ctx.fillStyle = "green";
			for (var i =0; i< game.pos.blocks.length; i++){
				var block = game.pos.blocks[i];

				if (block.active){
					this.ctx.fillRect(block.x - game.blockWidth/2, block.y - game.blockHeight/2, game.blockWidth, game.blockHeight);	
				}
				

			}


			this.ctx.restore();

		}




	};

	global.CanvasRenderer = (global.module || {}).exports = CanvasRenderer;


})(this);