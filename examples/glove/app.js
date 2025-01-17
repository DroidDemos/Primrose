/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

var DEBUG_VR = false, app;
THREE.ImageLoader.crossOrigin = "anonymous";
function StartDemo ( ) {
  "use strict";
  app = new Primrose.VRApplication(
      "glove demo", {
        sceneModel: "../models/scene5.json",
        skyTexture: "../images/bg2.jpg",
        groundTexture: "../images/deck.png",
        button: {
          model: "../models/smallbutton.json",
          options: {
            maxThrow: 0.1,
            minDeflection: 10,
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00,
            toggle: true
          }
        }
      }
  );

  function play ( i ) {
    noteDown[i] = true;
  }

  app.ctrls.goVR.addEventListener( "click", app.goFullScreen.bind( app, false ), false );
  app.ctrls.goRegular.addEventListener( "click", app.goFullScreen.bind( app, true ), false );

  var noteDown = [ ];
  var btns = [ ];
  app.addEventListener( "ready", function () {
    var n = 8;
    var d = ( n - 1 ) / 2;
    for ( var i = 0; i < n; ++i ) {
      noteDown[i] = false;
      btns.push( app.makeButton() );
      var x = ( i - d ) * 0.25;
      btns[i].moveBy( x, 2, -1.5 * Math.cos( x ) + 1 );
      btns[i].addEventListener( "click", play.bind( this, i ) );
    }
  }.bind( this ) );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt;
    var j = Math.floor( t * 10 ) % noteDown.length;
    var i = Math.floor( t * 40 ) % noteDown.length;
    ;
    if ( noteDown[i] ) {
      app.music.play( 35 + i * 5, 0.30, 0.03 );
    }
    if ( j === 0 ) {
      app.music.play( 10, 0.50, 0.03 );
    }
    for ( i = 0; i < noteDown.length; ++i ) {
      noteDown[i] = false;
    }
  }.bind( this ) );

}
