// ViewSideFace.js

define(["alfrid/View", "alfrid/GLTool", "alfrid/Mesh", "text!../assets/shaders/copy.vert", "text!../assets/shaders/window.frag"], 
	function(View, GLTool, Mesh, strVert, strFrag) {

	var ViewSideFace = function() {
		View.call(this, strVert, strFrag);
	};

	var p = ViewSideFace.prototype = new View();
	var s = View.prototype;

	p._init = function() {
		var positions = [];
		var coords = [];
		var indices = [0,1,2,0,2,3];

		var z = 100;
		var h = 90;
		var w = 390;
		var sy = -80;

		var size = 1;
		positions.push([-w,	h+sy,	z-100]);
		positions.push([0,	h+sy,	z]);
		positions.push([0,	0+sy,	z]);
		positions.push([-w,	0+sy,	z-100]);

		coords.push([0, 0]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 1]);

		this.mesh = new Mesh(4, 6, GLTool.gl.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
	};

	p.render = function(aTexture) {
		// Were has the reference of this.shader come from?
		if(!this.shader.isReady())return;
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.shader.uniform("xAmt", "uniform1f", 39);
		this.shader.uniform("yAmt", "uniform1f", 9);
		aTexture.bind(0);
		GLTool.draw(this.mesh);
	};

	return ViewSideFace;
	
});