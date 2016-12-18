(function() {
  'use strict';
  angular.module('app.main', []).controller('homeCtrl', [
    '$scope', '$interval', '$window', 'ws', '$rootScope', 'wsSend', function($scope, $interval, $window, ws, $rootScope, wsSend) {
      new WOW().init();
      $scope.bgName = '';
      $scope.host = {
        cid: 'cid',
        hid: 'hid'
      };
      return ws.$on('$message', function(msg) {
        var CID, _action, _data, args;
        CID = $rootScope.CID;
        _data = msg.data;
        if (msg.event === 'host') {
          args = {
            hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
          };
          return wsSend.msg('loginHost', args);
        } else if (msg.event === 'login') {
          return $rootScope.UID = _data['uid'];
        } else if (msg.event === 'loginHost') {
          $scope.$apply(function() {
            return $scope.host = msg.data;
          });
          args = {
            action: 'get-panel'
          };
          return wsSend.msg('hostMsg', args);
        } else if (msg.event === 'hostMsg') {
          _action = msg.data.action;
          if (_action === 'lcdClose') {
            return $rootScope.$emit('lcd-close');
          } else if (_action === 'lcdOpen') {
            return $rootScope.$emit('lcd-open');
          } else if (_action === 'lcdRest') {
            return location.reload();
          } else if (_action === 'setBg') {
            return $scope.$apply(function() {
              return $scope.bgName = msg.data.val;
            });
          } else if (_action === 'panel') {
            return $scope.$broadcast('new-panel', _data);
          }
        }
      });
    }
  ]).controller('panelsCtrl', [
    '$scope', '$interval', '$window', '$rootScope', '$timeout', 'wsSend', function($scope, $interval, $window, $rootScope, $timeout, wsSend) {
      var EQ, focesAnimate, focosEq, focusCtrl, nowEQ, panelLoad, startFocus, stopFocus;
      EQ = 0;
      focesAnimate = false;
      $scope.panel = [
        {
          open: true,
          text: '测试',
          focus: true,
          eq: 0,
          type: 0
        }
      ];
      $scope.panel = [];
      nowEQ = 0;
      $scope.likePost = function(id) {
        var args;
        console.log(id);
        args = {
          new_id: id,
          action: 'likePost'
        };
        return wsSend.msg('clientMsg', args);
      };
      $scope.$on('new-panel', function(event, msg) {
        var db, first, index, j, len, ref;
        if ($scope.panel.length === 0) {
          first = true;
        }
        ref = msg.data;
        for (index = j = 0, len = ref.length; j < len; index = ++j) {
          db = ref[index];
          if (db.content.picUrl === 'undefined') {
            db.content.picUrl = false;
          }
          $scope.$apply(function() {
            db.open = false;
            db.focus = 0;
            db.eq = nowEQ;
            return $scope.panel.push(db);
          });
          nowEQ = nowEQ + 1;
        }
        console.log($scope.panel);
        return panelLoad(first);
      });
      $rootScope.$on('panel-start', function(event, msg) {
        if (!focesAnimate) {
          return startFocus();
        }
      });
      $rootScope.$on('panel-stop', function(event, msg) {
        return stopFocus();
      });
      panelLoad = function(first) {
        var args, db, i, index, isNext, j, len, ref;
        i = 0;
        isNext = false;
        ref = $scope.panel;
        for (index = j = 0, len = ref.length; j < len; index = ++j) {
          db = ref[index];
          if (db.focus || first) {
            isNext = true;
          }
          if (isNext) {
            $scope.$apply(function() {
              db.open = true;
              return db.delay = i + 's';
            });
            i = i + 0.1;
          }
        }
        args = {
          val: $scope.panel.length,
          action: 'panel-num'
        };
        wsSend.msg('clientMsg', args);
        if ($scope.panel.length > 1) {
          if (!focesAnimate) {
            return startFocus();
          }
        }
      };
      focosEq = 0;
      focusCtrl = '';
      stopFocus = function() {
        focesAnimate = false;
        return $interval.cancel(focusCtrl);
      };
      return startFocus = function() {
        var fn;
        focesAnimate = true;
        fn = function() {
          var args;
          if ($scope.panel.length === 4) {
            $interval.cancel(focusCtrl);
            focesAnimate = false;
            return;
          }
          if (focosEq > 0) {
            $scope.panel[focosEq - 1]['focus'] = 0;
          }
          if (focosEq > 1) {
            $scope.panel[focosEq - 2]['focus'] = 2;
          }
          if (focosEq > 2) {
            $scope.panel[focosEq - 3]['open'] = false;
          }
          if (focosEq > 3) {
            $scope.panel.splice(focosEq - 4, 1);
            focosEq = focosEq - 1;
          }
          $scope.panel[focosEq]['focus'] = 1;
          $scope.panel[focosEq]['delay'] = 0;
          focosEq = focosEq + 1;
          if ($scope.panel.length < 7) {
            args = {
              action: 'get-panel'
            };
            return wsSend.msg('hostMsg', args);
          }
        };
        return focusCtrl = $interval(fn, 7000);
      };
    }
  ]).controller('backdropCtrl', [
    '$scope', '$interval', '$window', '$rootScope', '$timeout', 'wsSend', function($scope, $interval, $window, $rootScope, $timeout, wsSend) {
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
        var args;
        $rootScope.$emit('panel-stop');
        $rootScope.$emit('lcd-close');
        args = {
          action: 'host-sleep'
        };
        return wsSend.msg('hostMsg', args);
      });
      return ifvisible.on('wakeup', function() {
        var args;
        $rootScope.$emit('panel-start');
        $rootScope.$emit('lcd-open');
        args = {
          action: 'host-wakeup'
        };
        return wsSend.msg('hostMsg', args);
      });
    }
  ]).controller('appCtrl', [
    '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope', 'wsSend', function($scope, $interval, $window, ws, $timeout, uuid4, $rootScope, wsSend) {
      var CID, HID, UID, fn;
      CID = uuid4;
      HID = '09bbea78-bfb2-11e6-a4a6-cec0c932ce01';
      UID = '';
      $rootScope.UID = UID;
      $rootScope.CID = CID;
      $rootScope.HID = HID;
      fn = function() {
        return $scope.$emit('lcd-close');
      };
      ws.$on('$open', function(msg) {
        var args;
        args = {};
        return wsSend.msg('init', args);
      });
      ws.$on('$close', function(msg) {
        return console.log('服务器关闭');
      });
      return ws.$on('$message', function(msg) {
        var AID, args;
        console.log('%c< ' + msg.event + ' - ' + JSON.stringify(msg), 'color:green');
        AID = msg.data.cid;
        $rootScope.AID = AID;
        if (msg.event === 'init') {
          args = {
            email: 'xank@qq.com',
            pwd: 'cs1234'
          };
          return wsSend.msg('login', args);
        }
      });
    }
  ]).factory('ws', [
    '$websocket', function($websocket) {
      var ws;
      ws = $websocket.$new('ws://192.168.31.101:8181');
      return ws;
    }
  ]).factory('wsSend', [
    'ws', '$rootScope', function(ws, $rootScope) {
      return {
        msg: function(event, args) {
          args.cid = $rootScope.CID;
          args.aid = $rootScope.AID;
          if (event === 'hostMsg') {
            args.hid = $rootScope.HID;
          }
          console.log('> ' + event + ' - ' + JSON.stringify(args));
          return ws.$emit(event, args);
        }
      };
    }
  ]);

}).call(this);
