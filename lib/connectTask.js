
var reserve = require("./reserve")(8000)
var IP = require("./IP")

module.exports = function( grunt, taskName, options, runOptions ){
  var tinylr = require("./livereload")(grunt)
  var middleWareStack = options.middleware || []

  options.middleware = function ( connect, options, middlewares ){
    middleWareStack.forEach(function( src ){
      try{
        require(src)(grunt, connect, options, middlewares)
      }
      catch( e ){
        console.warn("Unable to load middlware '%s'", src)
        console.warn(e)
      }
    })
    return middlewares
  }

  grunt.config("connect.boomer.options", options)

  grunt.registerTask(taskName||"default", "Serve files with Boomer!", function (){
    var done = this.async()
    reserve(2, function ( lrPort, serverPort ){
      var serverRoot = grunt.config.get("connect.boomer.options.base")
        , webAddress = "http://" + IP + ":" + serverPort

      grunt.config("connect.boomer.options.port", serverPort)
      grunt.config("connect.boomer.options.open", webAddress)
      grunt.config("connect.boomer.options.livereload", lrPort)

      grunt.event.once("connect.boomer.listening", function (){
        console.log("Boomer is serving %s on %s", serverRoot, webAddress)
        // and let watch keep it alive
        grunt.task.run("watch")
        runOptions.onStarted({
          host: IP,
          port: serverPort,
          liveReload: lrPort
        })
      })

      // create lr server
      tinylr.listen(lrPort, function ( err ){
        console.log('Live reload server started on port %d', lrPort)
        done()
        // open server
        grunt.task.run("connect:boomer")
      })
    })
  })
}