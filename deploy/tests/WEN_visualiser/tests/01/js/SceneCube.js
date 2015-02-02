// SceneCube.js

define(["alfrid/GLTool", "alfrid/Scene", "alfrid/GLTexture", "alfrid/FrameBuffer", "alfrid/ViewCopy", "ViewCircle"], function(GL, Scene, GLTexture, FrameBuffer, ViewCopy, ViewCircle) {

	var SceneCube = function() {
		Scene.call(this);
		this.canvas = GL.canvas;
		this._initTextures();
		this._initViews();
		this.mouseX = this.mouseY = 512;
		this.canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
	}

	var p = SceneCube.prototype = new Scene();
	var s = Scene.prototype;


	p._onMouseMove = function(e) {
		this.mouseX = e.layerX;
		this.mouseY = e.layerY;
		// console.log(this.mouseX, this.mouseY);
	};

	p._initTextures = function() {
		this.texture       = new GLTexture(images.gold);
		this.fbo			= new FrameBuffer(1170, 330);
	};


	p._initViews = function() {
		this._vCircle 		= new ViewCircle("assets/shaders/copy.vert", "assets/shaders/circle.frag");
		this._vPixelate 	= new ViewCopy("assets/shaders/copy.vert", "assets/shaders/pixelate.frag");
		this._vCopy 		= new ViewCopy("assets/shaders/copy.vert", "assets/shaders/copy.frag");
	};


	p.render = function() {
		GL.clear(0, 0, 0, 1);
		GL.setMatrices(this.cameraOtho);
		GL.rotate(this.rotationFront);

		// GL.setViewport(0, 0, 1170, 330);
		this.fbo.bind();
		GL.clear(0, 0, 0, 1);
		this._vCircle.render(this.texture, this.mouseX/1024, this.mouseY/1024);
		this.fbo.unbind();

		this._vCopy.render(this.fbo.getTexture());
		// this._vPixelate.render(this.fbo.getTexture());
	};


	return SceneCube;
});
