'use strict';
angular.module('app', [
  'ngRoute'
  'ngAnimate'
  'ngWebsocket'
  'app.main'
  "uuid"
])


.config([
  '$routeProvider','$locationProvider'
  ($routeProvider, $locationProvider) ->
      #$locationProvider.html5Mode(true)



])


