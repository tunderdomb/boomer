var tinylr = require('tiny-lr')

module.exports = function( grunt ){
  var tiny = tinylr()

  grunt.registerMultiTask("lr", "Boomer livereload helper task", function (){
    var changedFiles = this.filesSrc

    var options = this.options({
      // this can help preventing this task to send the browser a huge lit of files
      refresh: false
    })

    if ( changedFiles.length ) {
      if ( options.refresh ) {
        // notify clients only about one file
        // presumably this triggers a browser refresh
        // because it's not a reloadable resource (like .html, .js, etc.)
        tiny.changed({body: {files: [changedFiles[0]]}})
      }
      else {
        tiny.changed({body: {files: changedFiles}})
      }
    }

  })

  return tiny
}