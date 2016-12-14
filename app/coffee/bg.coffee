'use strict';

angular.module('app.bg', [])

.controller('adminCtrl', [
  '$scope', '$interval', '$window', '$websocket'
  ($scope, $interval, $window, $websocket) ->




])



.controller('bgCtrl', [
  '$scope', '$interval', '$window', 'ws', '$rootScope'
  ($scope, $interval, $window, ws, $rootScope) ->


])


.directive('bgSnow', [
  '$rootScope'
  ($rootScope) ->
    return {
      template: (ele ,attrs) ->
        _html =
          "
          <div class='landscape'>
            <div class='moon'></div>
            <div class='hills'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class='tree'>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <canvas id='snow'></canvas>
          "

        return _html

      restrict: 'AEC'
      link: (scope, ele, attrs) ->

        initSnow()
    }
])
