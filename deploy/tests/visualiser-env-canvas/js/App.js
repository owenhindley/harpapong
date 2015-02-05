var CANVAS_VISUALISER = true;

var soundcloudPlayer, soundcloudLoader, visualiser;
var tempoSource;
var debugElement, audioElement;
var fixturesFront, fixturesSide;

var updateIntervalId = -1;

document.addEventListener("DOMContentLoaded", function() {

    // Sets up the soundcloud loader, player

    debugElement = document.getElementById("debugOutput");
    audioElement = document.getElementById("player");

    soundcloudPlayer = new SoundCloudAudioSource(audioElement);
    soundcloudLoader = new SoundCloudLoader(audioElement);

    // Sets up the tempo source

    tempoSource = new TempoSource();
    var tempoChangeCallback = function() {
        document.getElementById("bpmValue").value = tempoSource.tempo;
    };
    tempoSource.init(60, tempoChangeCallback);



    // this is the number of lights we have to play with on both sides
    // small, I know.
    var harpaLts = {
        front : {
            width : 37,
            height : 13
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
    //
    document.getElementById("sideTextureContainer").appendChild(visualiser.faces.side);
    document.getElementById("frontTextureContainer").appendChild(visualiser.faces.front);

    if (!CANVAS_VISUALISER) {
        // setup SVG Fixture visualiser
        // Front
        fixturesFront = new HarpaSVGFixtureView();
        fixturesFront.init(harpaLts.front.width, harpaLts.front.height, document.getElementById("svg_template_front").innerHTML);
        document.getElementById("frontContainer").appendChild(fixturesFront.element);

        // Side
        fixturesSide = new HarpaSVGFixtureView();
        fixturesSide.init(harpaLts.side.width, harpaLts.side.height, document.getElementById("svg_template_side").innerHTML, true);
        document.getElementById("sideContainer").appendChild(fixturesSide.element);
    } else {
        fixturesFront = new HarpaCanvasFixtureView();
        fixturesFront.init(harpaLts.front.width, harpaLts.front.height);
        document.getElementById("frontContainer").appendChild(fixturesFront.element);

        fixturesSide = new HarpaCanvasFixtureView();
        fixturesSide.init(harpaLts.side.width, harpaLts.side.height);
        document.getElementById("sideContainer").appendChild(fixturesSide.element);
    }

    // disable fixtures on side panel to match shape of building

    
    for (var i=0; i < harpaLts.side.width; i++){
        for (var j = 0; j < harpaLts.side.height; j++){
            if (j > (2 + Math.floor(i / (i == 1 ? 5 : 6)))){
                fixturesSide.disableFixture(i,j);
            }

        }
    }
    

    // controls for soundcloud player
    document.getElementById("soundCloudSubmit").addEventListener("click", soundCloudClick);
    document.getElementById("soundCloudPause").addEventListener("click", function() {
        if (audioElement.paused)
            audioElement.play();
        else {
            audioElement.pause();
        }
    });

    // controls for tapTempo
    document.getElementById("tapTempo").addEventListener("click", tempoSource.tap.bind(tempoSource));
    document.getElementById("bpmValue").addEventListener("change", function() {
        var tempoValue = parseFloat(document.getElementById("bpmValue").value);
        tempoSource.setTempo(tempoValue);
    }.bind(this));

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

    fixturesFront.render(visualiser.frontCtx);
    fixturesSide.render(visualiser.sideCtx);

};

function update() {

    // sends the current tempo data to channel 1
    //
    // this takes the form of a value that rises to 1 every beat, then falls rapidly to 0.

    //console.log(tempoSource.value);
    var currentBeatEnvelope = tempoSource.value;

    visualiser.signal(2, currentBeatEnvelope);


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
