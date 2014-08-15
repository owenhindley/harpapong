var PongLanguageSelect = function(container) {
	
	this.container = container;
	this.element = document.createElement("div");
	this.element.className = "languageSelect";

	this.elementEN = document.createElement("div");
	this.elementEN.className = "selectLanguage en";

	this.elementEN.addEventListener("click", this.selectEN.bind(this));

	this.elementIS = document.createElement("div");
	this.elementIS.className = "selectLanguage is";

	this.elementIS.addEventListener("click", this.selectIS.bind(this));

	this.element.appendChild(this.elementIS);
	this.element.appendChild(this.elementEN);

	this.container.appendChild(this.element);


	// check cookie
	var lang_cookie = Utils.getCookie("lang");
	if (lang_cookie){
		if (lang_cookie == "en"){
			this.selectEN();
		} else if (lang_cookie == "is") {
			this.selectIS();
		}
	}
};

var p = PongLanguageSelect.prototype;

p.selectEN = function() {

	$(document.body).removeClass("lang-is");
	$(document.body).addClass("lang-en");

	Utils.setCookie("lang", "en");

}

p.selectIS = function() {

	$(document.body).removeClass("lang-en");
	$(document.body).addClass("lang-is");

	Utils.setCookie("lang", "is");

}

document.addEventListener("DOMContentLoaded", function() {

	var langSelect = new PongLanguageSelect(document.getElementById("langContainer"));

});