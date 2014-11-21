"use strict";
var domready = require("domready");
var raf = require("raf");
var random = require("lodash.random");

var colors = [
  "rgba(32, 205, 255, 0.05)",
  "rgba(255, 32, 171, 0.05)",
  "rgba(255, 255, 32, 0.05)",

  "rgba(0, 173, 239, 0.08)",
  "rgba(236, 0, 139, 0.08)",
  "rgba(255, 241, 0, 0.08)"
];

var w = 900;
var h = 600;
var ctx = document.getCSSCanvasContext("2d", "mk-animation", w, h);

var poly = [
  [w / 2, h / 2],
  [w / 2 - 80, h / 2 - 80],
  [w / 2 - 80, h / 2 + 80]
];

var renderFrame = function () {
  ctx.fillStyle = colors[random(0, colors.length - 1)];
  ctx.beginPath();
  ctx.moveTo(poly[0][0], poly[0][1]);
  ctx.lineTo(poly[1][0], poly[1][1]);
  ctx.lineTo(poly[2][0], poly[2][1]);
  ctx.closePath();
  ctx.fill();

  // Randomly "rotate and move" poly to new position
  var shifted = poly.shift();
  var newX = shifted[0] + random(-(w / 2), w / 2);
  var newY = shifted[1] + random(-(h / 2), h / 2);
  newX = (newX > 0) ? newX : 0;
  newY = (newY > 0) ? newY : 0;
  newX = (newX < w) ? newX : w - 1;
  newY = (newY < h) ? newY : h - 1;
  poly.push([newX, newY]);
};

var onResize = function () {
  w = document.body.clientWidth;
  h = document.getElementsByTagName("header")[0].clientHeight * 3.5;
  ctx = document.getCSSCanvasContext("2d", "mk-animation", w, h);

  // Reset initial poly coordinates
  poly = [
    [w / 2, h / 2],
    [w / 2 - 80, h / 2 - 80],
    [w / 2 - 80, h / 2 + 80]
  ];

  // Pre populate background
  for (var i = 0; i < 1000; i++) {
    renderFrame();
  }
};

var rafLoop = function () {
  renderFrame();
  raf(rafLoop);
};

domready(function () {
  var css = "-webkit-canvas(mk-animation)";
  document.body.style.background = css;

  window.onresize = onResize;
  onResize();

  rafLoop();
});
