(function(global){
    // Pinched from https://github.com/michaelbromley/soundcloud-visualizer


    var SoundCloudAudioSource = function(player) {
        var self = this;
        var analyser;
        var audioCtx = new (window.AudioContext || window.webkitAudioContext);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        var source = audioCtx.createMediaElementSource(player);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        var sampleAudioStream = function() {
            analyser.getByteFrequencyData(self.streamData);
            // calculate an overall volume value
            var total = 0;
            for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
                total += self.streamData[i];
            }
            self.volume = total;
        };
        setInterval(sampleAudioStream, 20);
        // public properties and methods
        this.volume = 0;
        this.streamData = new Uint8Array(128);
        this.playStream = function(streamUrl) {
            // get the input stream from the audio element
            player.addEventListener('ended', function(){
                self.directStream('coasting');
            });
            player.setAttribute('src', streamUrl);
            player.play();
        }
    };


    global.SoundCloudAudioSource = (global.module || {}).exports = SoundCloudAudioSource;

})(this);
