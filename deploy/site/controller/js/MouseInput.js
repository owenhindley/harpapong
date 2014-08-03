(function(global) {
	
	var MouseInput = {

		value : 0.5,

		init : function(){

			document.addEventListener("mousemove", this.onMouseMove.bind(this));

			return this;
		},

		onMouseMove : function(e){

			var x = e.clientX / window.innerWidth;

			console.log(x);

			this.value = x;

		}


	};

	global.MouseInput = (global.module || {}).exports = MouseInput;


})(this);