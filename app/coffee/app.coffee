'use strict';
angular.module('app', [
  'ngMaterial'
  'ngMessages'

  'ngRoute'
  'ngAnimate'
  'ngWebsocket'
  'app.main'
  'app.admin'
  "uuid"
  'app.bg'
  'mgcrea.ngStrap'
  'rzModule'
])


.config([
  '$routeProvider','$locationProvider'
  ($routeProvider, $locationProvider) ->
      #$locationProvider.html5Mode(true)


    $routeProvider
      #默认跳转
      .when(
        '/'
        redirectTo: '/home'
      )

      .when(
        '/home'
        templateUrl: '../views/home.html'
      )




])


