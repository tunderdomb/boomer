Boomer
======

## Ok what

This is task configurator for grunt.
It combines and simplifies connect, watch, and live reload configuration.

I made this because there was no working solution for this already.

I've always wrote task configs for each of these independently, and I got tired of copy pasting.

What it does, is essentially load `grunt-contrib-connect`, `grunt-contrib-watch`,
and a custom live reload task that let's you refresh your browser whenever a file changes.

This is not a grunt task. This is a task configurator. So don't try to load it with `grunt.loadNpmTasks()`.

## Ok how

Simple.

```js

var boomer = require("boomer")

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
}

```

### What does the lr task do?

It does this:

```js
tinylr.changed({body: {files: changedFiles}})
```

### There are options to do this with connect and watch too.

True. But they handle it badly. Sometimes the files don't reload even if they're changed.
For instance, if you have an IDE where file changes are written first into a temp location,
and if that was a success, then saved to the file system. JetBrains does this.
And the watch task sometimes (too often) ignores these changes.

So I wrote a helper task that you can set up to reload files.

## Methods

### .connect(options)

It's the same as writing this:

```js
  grunt.initConfig({
    connect: {
      boomer: {
        options: {<options goes here>}
      }
    }
  })
```

Note: boomer automatically search for an open port.
That property will be overwritten. Like this:

```js
grunt.config("connect.boomer.options.port", ports[0])
grunt.config("connect.boomer.options.open", webAddress)
grunt.config("connect.boomer.options.livereload", ports[1])
```


### .middlweare(String|String[])

Add a middleware to the load stack.
Basically let's you add middleware where ever you want.
Uses the connect task's `middleware` option.
It will use the string argument to require a module.
Your modulke should look something like this:

```js
module.exports = function ( grunt, connect, options, middlewares ){
  middlewares.unshift(function ( req, res, next ){
    if ( something ) {
      // end the request here and respond
      res.end("hello")
    }
    // let the next middleware handle the request
    else next()
  })
}
```


### .lr(options)

Same as writing this:

```js
  grunt.initConfig({
    lr: {<options goes here>}
  })
```

### .connect(options)

It's the same as writing this:

```js
  grunt.initConfig({
    watch: {<options goes here>}
  })
```

### .config(options)

There are two options now:

#### portStart

The port to start searching for open ports.

Defaults to `8000`.

#### maxPorts

Maximum available ports to check after the specified port

Defaults to `30`.