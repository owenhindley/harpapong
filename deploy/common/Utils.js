(function(global){
	
	var Utils = {

	};

	Utils.parseQueryString = function(aPath) {
			var queryString = aPath;
			var queryIndex = queryString.indexOf("?");
			var queryStringArray = [];
			
			if(queryIndex !== -1 && queryIndex+1 !== queryString.length) {
				queryString = queryString.substring(queryIndex+1, queryString.length);
				queryStringArray = queryString.split("&");
			}
			var returnObject = {};
			for(var i = 0; i < queryStringArray.length; i++) {
				var tempArray = queryStringArray[i].split("=");
				returnObject[tempArray[0]] = tempArray[1];
			}
			return returnObject;
		};

		
	Utils.setCookie = function(aCookieName, aCookieValue, aExDays, aExMins, aDomain, aPath) {
		// console.log("aCookieName, aCookieValue, aExDays, aDomain : ", aCookieName, aCookieValue, aExDays, aExMins, aDomain);
		var exdate=new Date();
		var hasExpire = false;
		if(aExDays !== undefined) {
			exdate.setDate(exdate.getDate() + aExDays);
			hasExpire = true;
		} 
		if(aExMins !== undefined) {
			exdate.setMinutes(exdate.getMinutes() + aExMins);
			hasExpire = true;
		}
		
		var aCookieValue=escape(aCookieValue) + ((hasExpire==false) ? "" : "; expires="+exdate.toUTCString()) + ((aDomain==undefined) ? "" : "; domain="+aDomain)+ ((aPath==undefined) ? "" : "; path="+aPath);
		document.cookie=aCookieName + "=" + aCookieValue;
	};

	Utils.getCookie = function(c_name) {
		// console.log("c_name : ", c_name);
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1) {
			c_start = c_value.indexOf(c_name + "=");
		}
		
		if (c_start == -1) {
			c_value = null;
		} else {
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start,c_end));
		}
		return c_value;
	};

	Utils.delete_cookie = function(name, aDomain, aPath) {
		console.log("delete_cookie :: aDomain : ", aDomain);
		var cookieDetails = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + ( (aDomain==undefined) ? "" : "domain="+aDomain+";") + ((aPath==undefined) ? "" : " path="+aPath);
		// alert("cookieDetails : "+ cookieDetails);
		document.cookie = cookieDetails;
	};

	global.Utils = (global.module || {}).exports = Utils;

})(this);