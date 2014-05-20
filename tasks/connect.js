
var boomer = require("../boomer")

module.exports = function ( grunt ){

  boomer(grunt, "boomer-connect")
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
}