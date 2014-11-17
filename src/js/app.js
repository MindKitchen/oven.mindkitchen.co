"use strict";
var domready = require("domready");
var raf = require("raf");
var random = require("lodash.random");

var color = [
  "rgba(0, 173, 239, 0.1)",
  "rgba(236, 0, 139, 0.1)",
  "rgba(255, 241, 0, 0.1)"
];

var f = 0;

var width = 200;
var height = 100;

var ctx = document.getCSSCanvasContext("2d", "mk-animation", width, height);

var renderFrame = function () {
  if (f++ % 2) {
    return raf(renderFrame);
  }

  ctx.fillStyle = color[random(0, color.length)];
  ctx.fillRect(0, 0, width, height);

  raf(renderFrame);
};

domready(function () {
  var css = "-webkit-canvas(mk-animation)";
  document.body.style.background = css;
  renderFrame();
});
