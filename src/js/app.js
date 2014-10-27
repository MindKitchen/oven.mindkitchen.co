"use strict";
var domready = require("domready");
var raf = require("raf");
var random = require("lodash.random");

window.random = random;

var f = 0;

var renderFrame = function () {
  // Frame skip
  if (f++ % 2) {
    return raf(renderFrame);
  }

  // Do stuff

  raf(renderFrame);
};

domready(function () {
  raf(renderFrame);
});
