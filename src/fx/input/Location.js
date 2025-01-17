/* global Primrose */
Primrose.Input.Location = ( function () {
  function LocationInput ( name, commands, socket, options ) {
    this.options = combineDefaults( options, LocationInput );
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, LocationInput.AXES );
    this.available = !!navigator.geolocation;
    if ( this.available ) {
      navigator.geolocation.watchPosition(
          this.setState.bind( this ),
          function () {
            this.available = false;
          }.bind( this ),
          this.options );
    }
  }
  LocationInput.AXES = [ "LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING",
    "SPEED" ];
  Primrose.Input.ButtonAndAxis.inherit( LocationInput );

  LocationInput.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  LocationInput.prototype.setState = function ( location ) {
    for ( var p in location.coords ) {
      var k = p.toUpperCase();
      if ( LocationInput.AXES.indexOf( k ) > -1 ) {
        this.setAxis( k, location.coords[p] );
      }
    }
  };
  return LocationInput;
} )();
