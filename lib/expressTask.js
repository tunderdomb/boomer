var reserveLr = require("./reserve")(35729)
var reserveServer = require("./reserve")(8000)
var IP = require("./IP")
var open = require("open")

module.exports = function ( grunt, taskName, app, setupApp, runOptions ){

  var tinylr = require("./livereload")(grunt)

  grunt.registerTask(taskName||"default", "Serve files with Boomer!", function (){
    var done = this.async()

    function setupTask( lrPort, serverPort ){
      var webAddress = "http://" + IP + ":" + serverPort

      app.use(require('connect-livereload')({
        port: lrPort
      }))

      setupApp && setupApp(app)

      // create lr server
      tinylr.listen(lrPort, function startServer( err ){
        console.log('Live reload Server Started on port %d', lrPort)
        done()

        // open server
        app.listen(serverPort, IP, function (){
          console.log("Boomer serves %s", webAddress)
          open(webAddress)
          grunt.task.run("watch")
          runOptions.onStarted({
            host: IP,
            port: serverPort,
            liveReload: lrPort
          })
        })
      })
    }

    reserveLr(function ( lrPort ){
      reserveServer(function( serverPort ){
        setupTask(lrPort, serverPort)
      })
    })
  })

}