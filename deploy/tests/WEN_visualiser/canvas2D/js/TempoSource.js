(function(global){

    /*


    */

    var TempoSource = function() {

    };

    var p = TempoSource.prototype;

    p.init = function(defaultTempo, tempoChangeCallback) {

        this.value = 0;
        this.lastBeatTime = Date.now();

        this.lastTapTime = Date.now();

        this.tempoChangeCallback = tempoChangeCallback;

        this.minTempo = 20;
        this.maxTempo = 300;

        this.tempo = 120;
        this.beatInterval = 1000 / (this.tempo / 60);
        this.setTempo(defaultTempo);




        setInterval(this.update.bind(this), 10);

    };

    p.setTempo = function(newTempo) {
        this.tempo = Math.min(this.maxTempo, Math.max(this.minTempo, newTempo));
        this.beatInterval = 1000 / (this.tempo / 60);

        if (this.tempoChangeCallback) this.tempoChangeCallback.call(this);
    }

    p.tap = function() {

        var timeNow = Date.now();
        var interval = timeNow - this.lastTapTime;

        var newTempo = (1000 / interval) * 60;
        this.setTempo(newTempo);

        this.lastTapTime = timeNow;

    };


    p.update = function() {

        var timeNow = Date.now();

        var interval = timeNow - this.lastBeatTime;

        if (interval >= this.beatInterval) {
            this.value = 1.0;
            this.lastBeatTime = timeNow;
        } else {
            this.value *= 0.9;
        }

    };


    global.TempoSource = (global.module || {}).exports = TempoSource;

})(this);
