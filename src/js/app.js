"use strict";
var domready = require("domready");
var raf = require("raf");
var tinygradient = require("tinygradient");
var random = require("lodash.random");

window.random = random;

//var colors = [
  //{ pos: 0.00, color: "cyan" },
  //{ pos: 0.05, color: "magenta" },
  //{ pos: 0.10, color: "yellow" },
//];

var baseColors = ["cyan", "magenta", "yellow"];
var colors = [];
var n = 200;
for (var i = 0; i < n; i++) {
  colors.push({
    pos: i * (1 / n),
    color: baseColors[i % baseColors.length]
  });
}

var f = 0;

var renderFrame = function () {
  if (f++ % 2) {
    return raf(renderFrame);
  }

  var gradient = tinygradient(colors);

  //var css = gradient.css("radial", "farthest-corner ellipse at top left");
  var css = gradient.css("linear", "to bottom");
  //var css = gradient.css();
  document.body.style.backgroundImage = css;

  //debugger;
  var stepSize = 0.001;
  for (var i = 0; i < colors.length; i++) {
    var direction = random(1) ? -1 : 1;
    var step = direction * stepSize;

    var previous = colors[i - 1] ? colors[i - 1].pos : 0;
    var next = colors[i + 1] ? colors[i + 1].pos : 1;

    if (colors[i].pos + step > previous && colors[i].pos + step < next) {
      colors[i].pos += step;
    }

  }

  raf(renderFrame);
};

domready(function () {
  document.body.style.backgroundAttachment = "fixed";
  raf(renderFrame);
});
