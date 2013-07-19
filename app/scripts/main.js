require.config({
  paths: {
    //jquery: '../bower_components/jquery/jquery',
    //bootstrap: 'vendor/bootstrap'
  },
  shim: {
    //bootstrap: {
      //deps: ['jquery'],
      //exports: 'jquery'
    //}
  }
});

require(['app'], function (app) {
  'use strict';
  // use app here
  console.log(app);
});
