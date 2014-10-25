"use strict";
var fs = require("fs");
var path = require("path");
var url = require("url");
var gulp = require("gulp");
var browserify = require("browserify");
var del = require("del");
var mkdirp = require("mkdirp");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var sass = require("gulp-sass");
var cssBase64 = require("gulp-css-base64");
var minifyCSS = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var inlinesource = require("gulp-inline-source");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var lab = require("gulp-lab");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var paths = {
  css: ["src/css/**/*.scss"],
  js: ["src/js/**/*.js*", "node_modules/qubeulator-components/**/*.js*"],
  test: ["test/**/*.js*", "src/js/**/*.js*", "node_modules/qubeulator-components/**/*.js*"],
  copy: [
    "src/error.html",
    "src/robots.txt",
    "src/favicon.ico",
    "src/img/**/*",
    "src/css-animation-demo/**/*",
  ],
  entrypoint: ["./src/js/app.js"],
  build: "./build"
};

var handleError = function(err) {
  notify.onError({
    message: "<%= error.message %>"
  }).apply(this, arguments);

  this.emit("end");
};

gulp.task("serve", ["watch", "css-debug", "js-debug", "copy-debug"], function() {
  browserSync({
    files: [],
    port: 8080,
    open: false,
    server: {
      baseDir: paths.build,
      middleware: [
        //function singlePageAppRedirect(req, res, next) {
          //var fileName = url.parse(req.url);
          //fileName = fileName.href.split(fileName.search).join("");
          //var fileExists = fs.existsSync(path.resolve(__dirname, paths.build) + fileName);
          //if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
            //req.url = "/index.html";
          //}
          //return next();
        //},
        require("compression")()
      ]
    }
  });
});

gulp.task("test", function() {
  gulp.src("test")
    .pipe(lab());
});

gulp.task("jscs", function() {
  gulp.src(paths.js)
    .pipe(jscs());
});

gulp.task("lint", function() {
  gulp.src(paths.js)
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("css-clean", function(done) {
  del([paths.build + "/css/*"], done);
  mkdirp(paths.build + "/css");
});

gulp.task("css-debug", ["css-clean"], function() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths:
        require("node-neat").includePaths.concat([
          "./node_modules/normalize.scss",
        ])
    }))
    .on("error", handleError)
    .pipe(sourcemaps.write({ sourceRoot: "/src/css" }))
    .pipe(gulp.dest(paths.build + "/css"))
    .pipe(reload({stream:true}));
});

gulp.task("css-build", ["css-clean"], function(done) {
  var stream = gulp.src(paths.css)
    .pipe(sass({
      includePaths:
        require("node-neat").includePaths.concat([
          "./node_modules/normalize.scss",
        ])
    }))
    .pipe(cssBase64())
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.build + "/css"));

  stream.on("end", done);
});

gulp.task("js-clean", function(done) {
  del([paths.build + "/js/*"], done);
  mkdirp(paths.build + "/js");
});

gulp.task("js-debug", ["js-clean"], function() {
  // Until JS is needed
  return;

  browserify({
    entries: paths.entrypoint,
    debug: true
  })
    .bundle()
    .on("error", handleError)
    .pipe(source("js/bundle.js"))
    //.pipe(buffer())
    //.pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    //.pipe(sourcemaps.write({ sourceRoot: ".." }))
    .pipe(gulp.dest(paths.build))
    .pipe(reload({stream:true}));
});

gulp.task("js-build", ["js-clean"], function() {
  // Until JS is needed
  return;

  browserify({
    entries: paths.entrypoint,
  })
    .bundle()
    .on("error", handleError)
    .pipe(source("js/bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task("copy-clean", function(done) {
  // TODO: Fix me!
  //del([paths.build + "/" + paths.index], done);
  done();
});

gulp.task("copy-debug", ["copy-clean"], function () {
  gulp.src(paths.copy, { base: "./src" })
    .pipe(gulp.dest(paths.build))
    .pipe(reload({stream:true}));

  gulp.src("./src/index.html")
    .pipe(gulp.dest(paths.build))
    .pipe(reload({stream:true}));
});

gulp.task("copy-build", ["copy-clean", "css-build"], function () {
  gulp.src(paths.copy, { base: "./src" })
    .pipe(gulp.dest(paths.build));

  // Inline CSS in index.html
  gulp.src("./src/index.html")
    .pipe(inlinesource({
      rootpath: paths.build,
      compress: false,
      swallowErrors: false
    }))
    .pipe(minifyHTML({
      comments: true,
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task("watch", function() {
  gulp.watch(paths.css, ["css-debug"]);
  gulp.watch(paths.js, ["js-debug"]);
  gulp.watch(paths.copy, ["copy-debug"]);
});

gulp.task("watch-test", ["test"], function() {
  gulp.watch(paths.test, ["test"]);
});

gulp.task("build", ["jscs", "lint", "test", "css-build", "js-build", "copy-build"]);
gulp.task("ci", ["jscs", "lint", "test"]);
gulp.task("default", ["watch", "css-debug", "js-debug", "copy-debug"]);
