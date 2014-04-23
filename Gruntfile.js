
var boomer = require("./boomer")

module.exports = function ( grunt ){

  grunt.initConfig({})

  boomer(grunt, "default")
    .connect({
      hostname: "*",
      base: "test/"
    })
    .lr({
      html: "test/*.html"
    })
    .watch({
      options: {
        spawn: false,
        interrupt: true
      },
      html: {
        files: ["test/*.html"],
        tasks: ["lr:html"]
      }
    })
    .started(function( options ){
      console.log(options)
    })
}