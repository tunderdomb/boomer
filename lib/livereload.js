var tinylr = require('tiny-lr')

module.exports = function( grunt ){
  var tiny = tinylr()

  grunt.registerMultiTask("lr", "Boomer livereload helper task", function (){
    var changedFiles = this.filesSrc
    if ( changedFiles.length ) {
      tiny.changed({body: {files: changedFiles}})
    }
  })

  return tiny
}