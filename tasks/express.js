var path = require("path")

var boomer = require("../boomer")

var express = require("express")
var app = express()

module.exports = function ( grunt ){

  boomer(grunt, "boomer-express")
    .express(app, function(  ){
      app.use(express.static(path.join(process.cwd(), "test")))
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
}