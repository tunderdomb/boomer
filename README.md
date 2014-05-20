Boomer
======

## Ok what

Boomer cuts down on your task configuration.
It is essentially a wrapper for grunt-contrib-connect and grunt-contrib-watch.
You can also use an express app on top of it, that gives you a little more flexibility.

## Show me

Excerpt from the test case.

```js
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
```

`boomer` is a function, you should call it with a grunt instance
and an optional task name.

**Note:** by default boomer registers under the "default" grunt task.

Here's an express example (also from the tests):

```js
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
```

## What is what

### .connect(options)

#### `options` - Object

Simple: it gets passed to the connect task as follows:

```js
grunt.config("connect.boomer.options", options)
```

### .express(app, setup)

#### `app` - Function

Like this:

```js
var app = express()
```

#### `setup` - Function [Optional]

A function called when the task is run.
Use it to setup your app here.

**You should slate calling methods like `.use()` on the app,**
**because boomer dynamically assigns a free port to the server when the task is run.**

**In order for the live reloading to work, your app initialization must come after the live reload script.**

**Use the setup callback to do that.**

### .watch(options)

#### `options` - Object

Gets passed directly to the watch task like this:

```js
grunt.config("watch", options)
```

### .lr(options)

#### `options` - Object

Boomer registers a helper task called `lr`.
It posts changed files to the liverelead server so your browser can refresh.

It does this:

```js
grunt.config("lr", options)
```

Check the source, it's really straightforward.

Use it like this:

```js
// I want these files posted to the browser
.lr({
  html: "test/*.html"
})
.watch({
  options: {
    spawn: false,
    interrupt: true
  },
  html: {
    // when these files change
    files: ["test/*.html"],
    // call the lr task
    tasks: ["lr:html"]
  }
})
```

That's it! MIT. Happy coding!