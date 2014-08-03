(function() {

	
	var QueueKeeper = {

		positionCallback : null,
		joinCallback : null,
		errorCallback : null,
		serverURL : "",
		queueId : null,

		init : function(server, onPosition, onJoin, on_Error) {

			this.serverURL = server;

			this.positionCallback = onPosition;
			this.joinCallback = onJoin;
			this.errorCallback = on_Error;


			return this;
		},

		joinQueue : function(aCallback) {


			// check cookies to see if we've already got an ID
			var guid_cookie_value = Utils.getCookie("queueId");
			if (guid_cookie_value){
				console.log("found cookie value " + guid_cookie_value);
				this.queueId = guid_cookie_value;

				this.checkPosition();

				if (aCallback)
					aCallback();
				
			} else {
				var url = this.serverURL + "/?method=join";
				this._makeRequest(url, function(data){

					if (data.status == "OK"){

						var guid = data.data.id;
						console.log("joined queue with id " + guid);
						this.queueId = guid;

						if (aCallback){
							aCallback();
						}

						try {
							Utils.setCookie("queueId", this.queueId);
						} catch(e){

						}

						this.checkPosition();

					} else {
						this.onError(data.message);
					}

				}.bind(this), function(error){

					this._resetQueuePosition();

				}.bind(this));
			}


		},

		checkPosition : function() {

			var url = this.serverURL + "/?method=position&id=" + this.queueId;

			this._makeRequest(url, function(data){

				if (data.status == "OK"){
					if (data.data.playing){
						
						Utils.delete_cookie("queueId");
						onJoinGame(data.data.playerId);
						

					} else {

						onPosition(data.data.position);

						setTimeout(this.checkPosition.bind(this), 2000);

					}
				} else {
					this.onError(data.message);
				}

			}.bind(this), function(error){

				// handle error
				// and re-join the queue
				
				this._resetQueuePosition();

			}.bind(this));
			
		
		},

		onPosition : function(aPosition){

			if (this.positionCallback){
				this.positionCallback(aPosition);
			}

		},

		onJoinGame : function(aPlayerId){

			if (this.joinCallback){
				this.joinCallback.call(aPlayerId);
			}

		},

		onError : function(aError){

			console.log("ERROR getting position from server : " + aError);
			if (errorCallback){
				errorCallback.call(this, aError);
			}

		},

		_resetQueuePosition : function() {

			Utils.delete_cookie("queueId");
			this.queueId = null;
			setTimeout(this.joinQueue.bind(this), 1000);
		},

		_makeRequest : function(aUrl, aHandleResponse, aHandleError){

			var rq = new XMLHttpRequest();
			rq.open("GET", aUrl, true);
			rq.onreadystatechange = function(){
				switch(rq.readyState) {
					case 0: //Uninitialized
					case 1: //Set up
					case 2: //Sent
					case 3: //Partly done
						//: do nothing
						break;
					case 4: //Done
						if(rq.status < 400) {
							try	{
								var data = JSON.parse(rq.responseText);
								aHandleResponse(data);
							} catch(err) {
								console.error("ERROR parsing json");
								aHandleError("ERROR parsing json");
								break;
							}
							
						}
						break;
				}

			}
			rq.send(null);

		}


	};

	window.QueueKeeper = QueueKeeper;


})();