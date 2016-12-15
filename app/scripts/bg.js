(function() {
  'use strict';
  angular.module('app.bg', []).controller('bgCtrl', ['$scope', '$interval', '$window', 'ws', '$rootScope', function($scope, $interval, $window, ws, $rootScope) {}]).directive('bgSnow', [
    '$rootScope', function($rootScope) {
      return {
        template: function(ele, attrs) {
          var _html;
          _html = "<div class='landscape'> <div class='moon'></div> <div class='hills'> <div></div> <div></div> <div></div> <div></div> <div></div> </div> <div class='tree'> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> <div> <span></span> </div> </div> </div> <canvas id='snow'></canvas>";
          return _html;
        },
        restrict: 'AEC',
        link: function(scope, ele, attrs) {
          console.log('sd');
          return initSnow();
        }
      };
    }
  ]);

}).call(this);
