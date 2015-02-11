THREE = require( 'three' );
var HarpaVisualiserBase = require("../common/HarpaVisualiserBase.js");


    /*

        Example simple Visualiser class

    */

    var EduVisualiser = function() {

        //console.log( THREE );

        // INIT SCENE

        this.renderer = new THREE.WebGLRenderer();
        //this.frontRenderer = new THREE.WebGLRenderer();

        /*this.sideRenderer.setSize( 780, 180 );
        this.frontRenderer.setSize( 760, 260 );*/

        this.scene = new THREE.Scene();
        this.container = new THREE.Object3D();
        this.frontCamera = new THREE.PerspectiveCamera( 45, 38/13, 1, 1000 );
        this.sideCamera = new THREE.PerspectiveCamera( 45, 39/9, 1, 1000 );

        this.scene.add( this.container );

        this.thickness = 1;
        this.targetColor = new THREE.Color( 0xffffff );

        this.material = new THREE.MeshBasicMaterial( { color: 0x333333, wireframe: true, wireframeLinewidth: 1 } );

        //this.mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 100, 3 ), this.material );
        //this.mesh = new THREE.Mesh( new THREE.SphereGeometry( 100, 16, 8 ), this.material );
        
        this.mesh = new THREE.Mesh( new THREE.TetrahedronGeometry( 100, 2 ), this.material );
        this.container.add( this.mesh );

        this.mesh2 = new THREE.Mesh( new THREE.IcosahedronGeometry( 100, 3 ), this.material );
        this.container.add( this.mesh2 );
        this.mesh2.rotation.y = Math.PI/4;
        this.mesh2.position.y = 300;

        this.mesh3 = new THREE.Mesh( new THREE.TetrahedronGeometry( 100, 4 ), this.material );
        this.container.add( this.mesh3 );
        this.mesh3.rotation.y = -Math.PI/4;
        this.mesh3.position.y = -300;

        this.mesh4 = new THREE.Mesh( new THREE.IcosahedronGeometry( 100, 4 ), this.material );
        this.container.add( this.mesh4 );
        this.mesh4.rotation.y = -Math.PI/4;
        this.mesh4.position.y = 600;

        this.mesh5 = new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 100, 32 ), this.material );
        this.container.add( this.mesh5 );
        this.mesh5.rotation.y = Math.PI/4;
        this.mesh5.position.y = -600;


        this.frontCamera.position.z = 200;
        this.sideCamera.position.z = 100;

        // stores the current volume
        this.currentVolume = 0;

        // stores the current beat envelope / value
        this.currentBeatValue = 0;

    }

    var p = EduVisualiser.prototype = new HarpaVisualiserBase();

    p.render = function() {

        this.frontCamera.position.y = 700 * Math.sin( Date.now() * .00008 );
        this.sideCamera.position.y = -700 * Math.sin( Date.now() * .0001 );

        //this.container.rotation.y += .0006
        this.frontCamera.position.z = 200 - 200 * Math.abs( Math.sin( Date.now() * .00001 ) );

        this.renderer.setSize( 760, 260 );

        this.renderer.render( this.scene, this.frontCamera );
        this.frontCtx.drawImage( this.renderer.domElement, 0, 0, 760, 260, 0, 0, 38, 13 );

        this.renderer.setSize( 780, 180 );
        this.renderer.render( this.scene, this.sideCamera );
        this.sideCtx.drawImage( this.renderer.domElement, 0, 0, 780, 180, 0, 0, 39, 9 );

        this.thickness = 1 + this.currentBeatValue * 10;
        this.material.wireframeLinewidth = this.thickness;
        this.material.color = new THREE.Color( (this.currentVolume / 20000) * this.targetColor.r, (this.currentVolume / 20000) * this.targetColor.g, (this.currentVolume / 20000) * this.targetColor.b );
        this.material.needsUpdate = true;
        this.container.rotation.y += this.currentBeatValue;

        this.targetColor = new THREE.Color( 0x222222 + 0xffffff * Math.abs( Math.sin( Date.now() * .0001 ) ) );

    };

    p.signal = function(channel, value) {

        // store beat values from channel 1
        if (channel == 1){
            this.currentBeatValue = value;
        }

        // store volume values from channel 2
        if (channel == 2){
            this.currentVolume = value * 20000;
        }
    };

module.exports = EduVisualiser;