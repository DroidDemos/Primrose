/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put, exp */

var GRASS = THREE.ImageUtils.loadTexture( "../images/grass.png" ),
    ROCK = THREE.ImageUtils.loadTexture( "../images/rock.png" ),
    SAND = THREE.ImageUtils.loadTexture( "../images/sand.png" ),
    WATER = THREE.ImageUtils.loadTexture( "../images/water.png" ),
    DECK = THREE.ImageUtils.loadTexture( "../images/deck.png" ),
    app = new Primrose.VRApplication( "Codevember", {
  disableAutoFullScreen: true,
  useFog: true,
  skyTexture: "../images/bg2.jpg",
  groundTexture: ROCK
} );

var WIDTH = 100,
    HEIGHT = 11,
    DEPTH = 100,
    MIDX = WIDTH / 2,
    MIDY = HEIGHT / 2, MIDZ = DEPTH / 2,
    ball = null,
    t = 0,
    dx = 7,
    dy = 2.5,
    dz = 4;


function column ( a, b, h ) {
  return textured( cylinder( a, b, h, 6, 1 ), SAND );
}

app.addEventListener( "ready", function () {
  var start = put( hub() )
      .on( this.scene )
      .at( -MIDX, 0, -MIDZ ),
      verts = [ ];

  ball = put( brick( WATER ) ).on( start ).at( 0, 0, 0 );

  for ( var i = 0; i < 5000; ++i ) {
    verts.push( v3( randomRange( -0.5 * WIDTH, 0.5 * WIDTH ),
        randomRange( -0.5 * HEIGHT, 0.5 * HEIGHT ),
        randomRange( -0.5 * DEPTH, 0.5 * DEPTH ) ) );
  }
  put( cloud( verts, this.options.backgroundColor, 0.05 ) )
      .on( start ).at( MIDX, MIDY, MIDZ );


  function makeSphere ( r, p ) {
    verts.splice( 0 );
    var rr = r * r;
    for ( var x = -r; x <= r; x += p ) {
      var dx = x * x;
      for ( var y = -r; y <= r; y += p ) {
        var dy = y * y;
        if ( ( dx + dy ) < rr ) {
          var z = Math.sqrt( rr - dx - dy );
          verts.push( v3( x, z, y ) );
          verts.push( v3( x, -z, y ) );
        }
      }
    }
    put( cloud( verts, 0xff0000, p * Math.sqrt( 2 ) ) ).on( start ).at( MIDX - r, r, MIDZ - r );
  }

  makeSphere( 10, 0.1 );

  for ( var i = 0; i < 100; ++i ) {
    var x = randomInt( WIDTH ),
        z = randomInt( DEPTH );
    put( column( 0.5, 1, 1 ) )
        .on( start )
        .at( x, 1, z );
    put( column( 0.5, 0.5, 10 ) )
        .on( start ).at( x, 6.5, z );
    put( column( 2, 0.5, 1 ) )
        .on( start )
        .at( x, 12, z );
  }

  put( fill( ROCK, WIDTH, 1, DEPTH ) ).on( start ).at( 0, 12.5, 0 );

  put( light( 0xffffff, 1, 500 ) ).on( start )
      .at( MIDX + 5, 8, MIDZ + 20 );
}.bind( app ) );

app.addEventListener( "update", function ( dt ) {
  t += dt;

  ball.position.x += dx * dt;
  ball.position.y += dy * dt;
  ball.position.z += dz * dt;
  if ( ball.position.x < 0 && dx < 0
      || WIDTH <= ball.position.x && dx > 0 ) {
    dx *= -1;
  }
  if ( ball.position.y < 1 && dy < 0
      || HEIGHT <= ball.position.y && dy > 0 ) {
    dy *= -1;
  }
  if ( ball.position.z < 0 && dz < 0
      || DEPTH <= ball.position.z && dz > 0 ) {
    dz *= -1;
  }
} );

if ( app.ctrls.goVR ) {
  app.ctrls.goVR.addEventListener( "click", app.goFullScreen.bind( app, true ), false );
}
if ( app.ctrls.goRegular ) {
  app.ctrls.goRegular.addEventListener( "click", app.goFullScreen.bind( app, false ), false );
}

function connectVR ( ) {
  if ( app.ctrls.goVR ) {
    app.ctrls.goVR.style.display = app.input.vr.deviceIDs.length > 0 ? "inline-block" : "none";
  }
}

app.input.addEventListener( "vrdeviceconnected", connectVR, false );
app.input.addEventListener( "vrdevicelost", connectVR, false );