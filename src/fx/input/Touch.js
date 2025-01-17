/* global Primrose */

Primrose.Input.Touch = ( function () {
  function TouchInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, TouchInput.AXES );

    function setState ( stateChange, setAxis, event ) {
      var touches = event.changedTouches;
      for ( var i = 0; i < touches.length; ++i ) {
        var t = touches[i];

        if ( setAxis ) {
          this.setAxis( "X" + t.identifier, t.pageX );
          this.setAxis( "Y" + t.identifier, t.pageY );
        }
        else {
          this.setAxis( "LX" + t.identifier, t.pageX );
          this.setAxis( "LY" + t.identifier, t.pageY );
        }

        var mask = 1 << t.identifier,
            value;
        if(stateChange){
          value = this.getValue("FINGERS") | mask;
          this.setAxis("FINGERS", value);
        }
        else{
          mask = ~mask;
          value = this.getValue("FINGERS") & mask;
          this.setAxis("FINGERS", value);
        }
      }
      event.preventDefault();
    }

    DOMElement.addEventListener( "touchstart", setState.bind( this, true, false ), false );
    DOMElement.addEventListener( "touchend", setState.bind( this, false, true ), false );
    DOMElement.addEventListener( "touchmove", setState.bind( this, true, true ), false );
  }

  TouchInput.NUM_FINGERS = 10;
  TouchInput.AXES = [ "FINGERS" ];
  for ( var i = 0; i < TouchInput.NUM_FINGERS; ++i ) {
    TouchInput.AXES.push( "X" + i );
    TouchInput.AXES.push( "Y" + i );
  }
  Primrose.Input.ButtonAndAxis.inherit( TouchInput );
  return TouchInput;
} )();
