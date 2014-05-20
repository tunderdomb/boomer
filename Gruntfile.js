module.exports = function ( grunt ){

  grunt.initConfig({})

  require('load-grunt-tasks')(grunt)

  grunt.registerTask("test-connect", function(  ){
    require("./tasks/connect")(grunt)
    grunt.task.run("boomer-connect")
  })

  grunt.registerTask("test-express", function(  ){
    require("./tasks/express")(grunt)
    grunt.task.run("boomer-express")
  })
}