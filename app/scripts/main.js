(function() {
  'use strict';
  angular.module('app.main', []).controller('adminCtrl', ['$scope', '$interval', '$window', '$websocket', function($scope, $interval, $window, $websocket) {}]).controller('homeCtrl', [
    '$scope', '$interval', '$window', 'ws', '$rootScope', function($scope, $interval, $window, ws, $rootScope) {
      $scope.bgName = 'snow';
      $scope.host = {
        cid: 'cid',
        hid: 'hid'
      };
      return ws.$on('$message', function(msg) {
        var CID, _action, args;
        CID = $rootScope.CID;
        if (msg.event === 'host') {
          args = {
            hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
            cid: CID
          };
          return ws.$emit('loginHost', args);
        } else if (msg.event === 'loginHost') {
          console.log(msg.data);
          return $scope.$apply(function() {
            return $scope.host = msg.data;
          });
        } else if (msg.event === 'hostMsg') {
          _action = msg.data.action;
          if (_action === 'lcdClose') {
            return $rootScope.$emit('lcd-close');
          } else if (_action === 'lcdOpen') {
            return $rootScope.$emit('lcd-open');
          } else if (_action === 'setBg') {
            console.log(msg.data.val);
            return $scope.$apply(function() {
              return $scope.bgName = msg.data.val;
            });
          }
        }
      });
    }
  ]).controller('backdropCtrl', [
    '$scope', '$interval', '$window', '$rootScope', '$timeout', function($scope, $interval, $window, $rootScope, $timeout) {
      $scope.backdrop = {
        open: false,
        start: false
      };
      $rootScope.$on('lcd-close', function() {
        var fn;
        $scope.$apply(function() {
          return $scope.backdrop.open = true;
        });
        fn = function() {
          return $scope.backdrop.start = true;
        };
        return $timeout(fn, 100);
      });
      $rootScope.$on('lcd-open', function() {
        var fn;
        $scope.$apply(function() {
          return $scope.backdrop.start = false;
        });
        fn = function() {
          return $scope.backdrop.open = false;
        };
        return $timeout(fn, 500);
      });
      ifvisible.setIdleDuration(500);
      ifvisible.on('idle', function() {
        return $rootScope.$emit('lcd-close');
      });
      return ifvisible.on('wakeup', function() {
        return $rootScope.$emit('lcd-open');
      });
    }
  ]).controller('appCtrl', [
    '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope', function($scope, $interval, $window, ws, $timeout, uuid4, $rootScope) {
      var CID, fn;
      CID = uuid4;
      $rootScope.CID = CID;
      fn = function() {
        return $scope.$emit('lcd-close');
      };
      ws.$on('$open', function(msg) {
        var args;
        args = {
          cid: CID
        };
        return ws.$emit('init', args);
      });
      ws.$on('$close', function(msg) {
        return console.log('服务器关闭');
      });
      ws.$on('$message', function(msg) {
        var args;
        console.log(JSON.stringify(msg));
        if (msg.event === 'init') {
          args = {
            email: 'xank@qq.com',
            pwd: 'cs1234',
            cid: CID
          };
          return ws.$emit('login', args);
        }
      });
      $scope.send = function() {
        var args;
        args = {
          hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
          cid: CID,
          data: 'test'
        };
        return ws.$emit('hostMsg', args);
      };
      $scope.lcdClose = function() {
        var args;
        args = {
          hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
          cid: CID,
          action: 'lcdClose'
        };
        return ws.$emit('hostMsg', args);
      };
      $scope.lcdOpen = function() {
        var args;
        args = {
          hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
          cid: CID,
          action: 'lcdOpen'
        };
        return ws.$emit('hostMsg', args);
      };
      $scope.test1 = function() {
        var name;
        name = 'sd';
        return ws.$emit('nick', name);
      };
      $scope.login = function() {
        var _data;
        _data = {
          email: 'xank@qq.com',
          pwd: 'cs1234',
          cid: CID
        };
        return ws.$emit('login', _data);
      };
      return $scope.setBg = function(name) {
        var args;
        args = {
          hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
          cid: CID,
          action: 'setBg',
          val: name
        };
        return ws.$emit('hostMsg', args);
      };
    }
  ]).factory('ws', [
    '$websocket', function($websocket) {
      var ws;
      ws = $websocket.$new('ws://192.168.31.101:8181');
      return ws;
    }
  ]);

}).call(this);
