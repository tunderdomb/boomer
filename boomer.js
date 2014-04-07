var tinylr = require('tiny-lr')()
var portscanner = require('portscanner')

var PORT_START = 8000
var MAX_PORTS = 30 // Maximum available ports to check after the specified port
var IP = (function ( ifaces ){
  var address
  for ( var dev in ifaces ) {
    ifaces[dev].forEach(function ( details ){
      if ( details.family == 'IPv4' ) {
        address = address || details.address
        return false
      }
    });
  }
  return (address || "localhost")
}(require('os').networkInterfaces()))

function reservePorts( n, done, i, start, ports ){
  start = start || PORT_START
  i = i || 0
  ports = ports || []
  portscanner.findAPortNotInUse(start, PORT_START + MAX_PORTS, IP, function ( err, port ){
    ports.push(port)
    if( !--n ) {
      done(ports)
    }
    else {
      reservePorts(n, done, ++i, port+1, ports)
    }
  })
}

var boomer = {}

var grunt = null

module.exports = function( Grunt, boomerTaskName ){
  // I'm not creating a class for this..
  // just leaking the reference
  grunt = Grunt
  if ( process.cwd() == __dirname ) {
    grunt.loadNpmTasks("grunt-contrib-connect")
    grunt.loadNpmTasks("grunt-contrib-watch")
  }
  else {
    // trick grunt!
    grunt.loadNpmTasks("boomer/node_modules/grunt-contrib-connect")
    grunt.loadNpmTasks("boomer/node_modules/grunt-contrib-watch")
  }

  grunt.registerMultiTask("lr", "Boomer livereload helper task", function (){
    var changedFiles = this.filesSrc
    if ( changedFiles.length ) {
      tinylr.changed({body: {files: changedFiles}})
    }
  })

  grunt.registerTask(boomerTaskName||"default", "Serve files with Boomer!", function (){
    var done = this.async()
    reservePorts(2, function ( ports ){
      var serverRoot = grunt.config.get("connect.boomer.base")
        , webAddress = "http://" + IP + ":" + ports[0]

      grunt.config("connect.boomer.options.port", ports[0])
      grunt.config("connect.boomer.options.open", webAddress)
      grunt.config("connect.boomer.options.livereload", ports[1])

      grunt.event.once("connect.boomer.listening", function (){
        console.log("Boomer is serving %s on %s", serverRoot, webAddress)
        // and let watch keep it alive
        grunt.task.run("watch")
      })

      // create lr server
      tinylr.listen(ports[1], function ( err ){
        console.log('Live reload Server Started')
        done()
        // open server
        grunt.task.run("connect:boomer")
      })
    })
  })

  return boomer
}

boomer.config = function( options ){
  PORT_START = options.portStart || 8000
  MAX_PORTS = options.maxPorts || 30
  return boomer
}

boomer.connect = function( options ){
  grunt.config("connect.boomer.options", options)
  return boomer
}

boomer.watch = function( options ){
  grunt.config("watch", options)
  return boomer
}

boomer.lr = function( options ){
  grunt.config("lr", options)
  return boomer
}
