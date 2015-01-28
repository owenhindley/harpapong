window.params = {
	gap:.01
}

define(["glMatrix", "Scheduler", "SimpleImageLoader", "alfrid/GLTool", "SceneCube"], function (glMatrix, scheduler, SimpleImageLoader, GLTool, SceneCube) {

	var check = function() {
		this.count = 0;
		this.setup();
	};

	var p = check.prototype;

	p.setup = function() {
		var loader = new SimpleImageLoader();
		loader.load([
			"assets/gold.jpg"
		], this, this._onImageLoaded)

	};

	p._onImageLoaded = function(img) {
		console.log("image loaded", img);
		window.images = img;

		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);

		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		GLTool.init(this.canvas);

		this.scene = new SceneCube();
		scheduler.addEF(this, this.loop, []);


		this.miniCanvas = document.createElement("canvas");
		this.miniCanvas.width = 117;
		this.miniCanvas.height = 33;
		this.miniCanvas.className = "mini-canvas";
		document.body.appendChild(this.miniCanvas);
		this.miniCtx = this.miniCanvas.getContext("2d");
		this.miniCtx.fillStyle = "#f60";
		this.miniCtx.fillRect(0, 0, this.miniCanvas.width, this.miniCanvas.height);
		console.log(this.miniCanvas);
	};


	p.loop = function() {
		this.scene.loop();
		this.miniCtx.clearRect(0, 0, this.miniCanvas.width, this.miniCanvas.height);
		this.miniCtx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.miniCanvas.width, this.miniCanvas.height);
	};

	var checkTest = new check();
});