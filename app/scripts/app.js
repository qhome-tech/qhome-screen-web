(function() {
  'use strict';
  angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngAnimate', 'ngWebsocket', 'app.main', 'app.admin', "uuid", 'app.bg', 'mgcrea.ngStrap', 'rzModule']).config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      return $routeProvider.when('/', {
        redirectTo: '/home'
      }).when('/home', {
        templateUrl: '../views/home.html'
      });
    }
  ]);

}).call(this);
