// SceneCube.js

define(["alfrid/GLTool", "alfrid/Scene", "alfrid/GLTexture", "alfrid/FrameBuffer", "alfrid/ViewCopy", "ViewCircle", "ViewFrontFace", "ViewSideFace"], 
	function(GL, Scene, GLTexture, FrameBuffer, ViewCopy, ViewCircle, ViewFrontFace, ViewSideFace) {

	var SceneCube = function() {
		Scene.call(this);
		this.canvas = GL.canvas;
		this._initTextures();
		this._initViews();
		this.mouseX = this.mouseY = 512;
		this.canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
		GL.gl.disable(GL.gl.CULL_FACE);
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
		this.fbo			= new FrameBuffer(370*3, 130*3);
	};


	p._initViews = function() {
		this._vCircle 		= new ViewCircle("assets/shaders/copy.vert", "assets/shaders/circle.frag");
		this._vPixelate 	= new ViewCopy("assets/shaders/copy.vert", "assets/shaders/pixelate.frag");
		this._vCopy 		= new ViewCopy("assets/shaders/copy.vert", "assets/shaders/copy.frag");
		this._vFront 		= new ViewFrontFace();
		this._vSide			= new ViewSideFace();
	};


	p.render = function() {
		GL.clear(0, 0, 0, 1);
		GL.setMatrices(this.cameraOtho);
		GL.rotate(this.rotationFront);

		GL.setViewport(0, 0, this.fbo.width, this.fbo.height);
		this.fbo.bind();
		GL.clear(0, 0, 0, 0);
		this._vCircle.render(this.texture, this.mouseX/1024, this.mouseY/1024);
		this.fbo.unbind();


		GL.setViewport(0, 0, this.fbo.width*.5, this.fbo.height*.5);
		this._vCopy.render(this.fbo.getTexture());
		// this._vCopy.render(this.texture);

		// return;
		//	ACTUAL RENDER 
		GL.setViewport(0, 0, window.innerWidth, window.innerHeight);
		GL.setMatrices(this.camera);
		GL.rotate(this.sceneRotation.matrix);

		this._vFront.render(this.fbo.getTexture());
		this._vSide.render(this.fbo.getTexture());
	};


	return SceneCube;
});
