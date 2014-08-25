(function() {

	
	var QueueKeeper = {

		positionCallback : null,
		joinCallback : null,
		errorCallback : null,
		serverURL : "",
		queueId : null,
		active : true,

		checkPositionTimeoutId : -1,
		joinQueueTimeoutId : -1,

		init : function(server, onPosition, onJoin, on_Error) {

			this.serverURL = server;

			this.positionCallback = onPosition;
			this.joinCallback = onJoin;
			this.errorCallback = on_Error;


			return this;
		},

		joinQueue : function(aCallback) {

			if (!this.active) return;


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

			if (!this.active) return;

			// check we actually have a queueId
			if (!this.queueId){
				this.joinQueue();
			}

			var url = this.serverURL + "/?method=position&id=" + this.queueId;

			this._makeRequest(url, function(data){

				if (data.status == "OK"){
					if (data.data.playing){
						
						console.log("Getting ready to play..");

						Utils.delete_cookie("queueId");
						onJoinGame(data.data.playerId, data.data.key);
						
						clearTimeout(this.checkPositionTimeoutId);

					} else {

						this.onPosition(data.data.position);

						this.checkPositionTimeoutId = setTimeout(this.checkPosition.bind(this), 2000);

					}
				} else {

					if (data.message == "Not in queue"){
						this._resetQueuePosition();
					}

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

			if (aPosition == 0 && audioManager){
				audioManager.playAlarm();

			}

		},

		onJoinGame : function(aPlayerId, aGameKey){

			this.active = false;

			clearTimeout(this.checkPositionTimeoutId);

			if (this.joinCallback){
				this.joinCallback.call(aPlayerId, aGameKey);
			}

		},

		onError : function(aError){

			console.log("ERROR getting position from server : " + aError);
			if (this.errorCallback){
				this.errorCallback.call(this, aError);
			}

		},

		_resetQueuePosition : function() {

			console.log("Resetting queue position");

			Utils.delete_cookie("queueId");
			this.queueId = null;
			clearTimeout(this.joinQueueTimeoutId);
			this.joinQueueTimeoutId = setTimeout(this.joinQueue.bind(this), 1000);
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
								console.error("")
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