var boomer = null
var npmTasks = [
  "grunt-contrib-connect",
  "grunt-contrib-watch"
]

module.exports = function ( grunt, taskName ){
  if ( boomer ) return boomer
  boomer = {}

  // trick grunt! (when in dev mode)
  var prefix = process.cwd() == __dirname
    ? ""
    : "boomer/node_modules/"
  npmTasks.forEach(function( task ){
    grunt.loadNpmTasks(prefix+task)
  })

  boomer.express = function ( app, setupApp ){
    require("./expressTask")(grunt, taskName, app, setupApp)
    return boomer
  }

  boomer.connect = function ( options ){
    require("./connectTask")(grunt, taskName, options)
    return boomer
  }

  boomer.watch = function ( options ){
    grunt.config("watch", options)
    return boomer
  }

  boomer.lr = function ( options ){
    grunt.config("lr", options)
    return boomer
  }

  boomer.rename = function ( newName ){
    if ( grunt.task.exists("default") )
      grunt.renameTask("default", newName)
    return boomer
  }

  boomer.reserve = require("./reserve")

  return boomer
}