/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global isMobile, StripeCheckout, gotVRDevices, Primrose, jQuery */

window.fnames = [ 'EMAIL', 'FNAME', 'LNAME' ];
window.ftypes = [ 'email', 'text', 'text' ];

function initStore ( ) {
  ga( 'send', 'pageview' );
  
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var v = this.response.version;
    if ( xhr.status < 400 ) {
      var elems = document.getElementsByClassName( "version-label" );
      Array.prototype.forEach.call( elems, function ( l ) {
        l.innerHTML = "v" + v;
      } );
    }
  };

  xhr.open( "GET", "package.json" );
  xhr.responseType = "json";
  xhr.send();
}
