
var soundcloudPlayer, soundcloudLoader, visualiser;
var debugElement, audioElement;

var updateIntervalId = -1;

document.addEventListener("DOMContentLoaded", function() {

    // Sets up the soundcloud loader, player

    debugElement = document.getElementById("debugOutput");
    audioElement = document.getElementById("player");

    soundcloudPlayer = new SoundCloudAudioSource(audioElement);
    soundcloudLoader = new SoundCloudLoader(audioElement);



    // this is the number of lights we have to play with on both sides
    // small, I know.
    var harpaLts = {
        front : {
            width : 36,
            height : 11
        },
        side : {
            width : 39,
            height : 9
        }
    };

    // creates our visualiser.
    /*
        Swop out the class here for yours (inheriting from HarpaVisualiserBase)
        to test
    */

    // visualiser = new HarpaVisualiserBase(harpaLts.front.width, harpaLts.front.height, harpaLts.side.width, harpaLts.side.height);
    visualiser = new HarpaTestVisualiser();
    
    // init with the light dimensions
    visualiser.init(harpaLts.front.width, harpaLts.front.height, harpaLts.side.width, harpaLts.side.height);

    document.getElementById("sideContainer").appendChild(visualiser.faces.side);
    document.getElementById("frontContainer").appendChild(visualiser.faces.front);

    // controls for soundcloud player
    document.getElementById("soundCloudSubmit").addEventListener("click", soundCloudClick);
    document.getElementById("soundCloudPause").addEventListener("click", function() {
        if (audioElement.paused)
            audioElement.play();
        else {
            audioElement.pause();
        }
    });


    // start render cycle (every browser frame)
    window.requestAnimationFrame(render);


});

function soundCloudClick() {

    var trackURL = document.getElementById("soundCloudURL").value;

    debugWrite("Loading track URL : " + trackURL);

    soundcloudLoader.loadStream(trackURL, loadSuccess, loadFail);


};

function loadSuccess() {

    debugWrite("track load success");

    soundcloudPlayer.playStream(soundcloudLoader.streamUrl());


    // start update cycle - this is less frequent, every 50ms
    clearInterval(updateIntervalId);
    setInterval(update, 50);

};

function loadFail() {

    debugWrite("track load fail");

};


function render() {

    // calls the canvases to render

    window.requestAnimationFrame(render);

    visualiser.render();

};

function update() {

    // sends the current volume level
    // to the visualiser as a signal
    // on channel 2.

    var currentVolume = soundcloudPlayer.volume;
    //console.log(currentVolume);

    visualiser.signal(1, currentVolume);



};

function debugWrite(msg) {

    debugElement.innerHTML = debugElement.innerHTML += "<br/>" + msg;
}
