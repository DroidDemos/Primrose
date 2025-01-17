/* global Primrose, URL */

Primrose.Workerize = ( function () {
  function Workerize ( func ) {
    // First, rebuild the script that defines the class. Since we're dealing
    // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
    // a conversion at a point post-script reconstruction, pre-workerization.

    // start with the constructor function
    var script = func.toString(),
        // strip out the name in a way that Internet Explorer also undrestands 
        // (IE doesn't have the Function.name property supported by Chrome and
        // Firefox)
        matches = script.match( /function\s+(\w+)\s*\(/ ),
        name = matches[1],
        k;

    // then rebuild the member methods
    for ( k in func.prototype ) {
      // We preserve some formatting so it's easy to read the code in the debug
      // view. Yes, you'll be able to see the generated code in your browser's
      // debugger.
      script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
    }

    // Automatically instantiate an object out of the class inside the worker,
    // in such a way that the user-defined function won't be able to get to it.
    script += "\n\n(function(){\n  var instance = new " + name + "(true);";

    // Create a mapper from the events that the class defines to the worker-side
    // postMessage method, to send message to the UI thread that one of the
    // events occured.
    script += "\n  if(instance.addEventListener){\n" +
        "    self.args = [null, null];\n" +
        "    for(var k in instance.listeners) {\n" +
        "      instance.addEventListener(k, function(eventName, args){\n" +
        "        self.args[0] = eventName;\n" +
        "        self.args[1] = args;\n" +
        "        postMessage(self.args);\n" +
        "      }.bind(this, k));\n" +
        "    }\n" +
        "  }";

    // Create a mapper from the worker-side onmessage event, to receive messages
    // from the UI thread that methods were called on the object.
    script += "\n\n  onmessage = function(evt){\n" +
        "    var f = evt.data[0],\n" +
        "        t = instance[f];\n" +
        "    if(t){\n" +
        "      t.call(instance, evt.data[1]);\n" +
        "    }\n" +
        "  };\n\n" +
        "})();";

    // The binary-large-object can be used to convert the script from text to a
    // data URI, because workers can only be created from same-origin URIs.
    this.worker = Workerize.createWorker( script, false );
    this.args = [ null, null ];

    // create a mapper from the UI-thread side onmessage event, to receive
    // messages from the worker thread that events occured and pass them on to
    // the UI thread.
    this.listeners = {};
    this.worker.onmessage = function ( e ) {
      var f = e.data[0],
          t = this.listeners[f];
      for ( var i = 0; t && i < t.length; ++t ) {
        t[i].call(this, e.data[1] );
      }
    }.bind( this );

    // create mappers from the UI-thread side method calls to the UI-thread side
    // postMessage method, to inform the worker thread that methods were called,
    // with parameters.
    for ( k in func.prototype ) {
      // we skip the addEventListener method because we override it in a
      // different way, to be able to pass messages across the thread boundary.
      if ( k !== "addEventListener" && k[0] !== '_' ) {
        // make the name of the function the first argument, no matter what.
        this[k] = this.methodShim.bind( this, k );
      }
    }
  }

  Workerize.prototype.methodShim = function ( eventName, args ) {
    this.args[0] = eventName;
    this.args[1] = args;
    this.worker.postMessage( this.args );
  };

  // Adding an event listener just registers a function as being ready to
  // receive events, it doesn't do anything with the worker thread yet.
  Workerize.prototype.addEventListener = function ( evt, thunk ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( thunk );
  };

  Workerize.createWorker = function ( script, stripFunc ) {
    if ( typeof script === "function" ) {
      script = script.toString();
    }

    if ( stripFunc ) {
      script = script.trim();
      var start = script.indexOf( '{' );
      script = script.substring( start + 1, script.length - 1 );
    }

    var blob = new Blob( [ script ], {
      type: "text/javascript"
    } ),
        dataURI = URL.createObjectURL( blob );

    return new Worker( dataURI );
  };

  return Workerize;
} )();