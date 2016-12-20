(function() {
  'use strict';
  angular.module('app.main', []).controller('homeCtrl', [
    '$scope', '$interval', '$window', 'ws', '$rootScope', 'wsSend', '$modal', '$timeout', function($scope, $interval, $window, ws, $rootScope, wsSend, $modal, $timeout) {
      var editHostModal, selHostModal;
      $scope.bgName = '';
      $scope.host = {};
      $scope.slider = {
        host_wakedelay: {
          floor: 0,
          step: 0.1,
          ceil: 5,
          minLimit: 0,
          maxLimit: 5,
          precision: 1,
          showTicks: 1,
          translate: function(value) {
            return value + 's';
          }
        },
        host_panel_eq: {
          floor: 0,
          step: 1,
          ceil: 30,
          minLimit: 0,
          maxLimit: 30,
          precision: 1,
          showTicks: 5
        },
        host_sleep: {
          floor: 0,
          step: 1,
          ceil: 600,
          minLimit: 0,
          maxLimit: 600,
          precision: 1,
          showTicks: 60
        }
      };
      editHostModal = $modal({
        scope: $scope,
        template: 'views/modal/setting.tpl.html',
        show: false
      });
      selHostModal = $modal({
        scope: $scope,
        template: 'views/modal/sel_host.tpl.html',
        show: false,
        backdrop: 'static'
      });
      selHostModal.$promise.then(selHostModal.show);
      $scope.save = function() {
        var args;
        args = {
          data: $scope.host,
          action: 'editHost'
        };
        wsSend.msg('hostMsg', args);
        return editHostModal.$promise.then(editHostModal.hide);
      };
      $scope.editHostModal = function() {
        var fn;
        editHostModal.$promise.then(editHostModal.show);
        fn = function() {
          return $scope.$broadcast('rzSliderForceRender');
        };
        return $timeout(fn);
      };
      $scope.selHostModal = function() {
        return selHostModal.$promise.then(selHostModal.show);
      };
      $scope.openHost = function(host_id) {
        var args;
        console.log(host_id);
        args = {
          hid: host_id
        };
        wsSend.msg('loginHost', args);
        return selHostModal.$promise.then(selHostModal.hide);
      };
      return ws.$on('$message', function(msg) {
        var CID, _action, _data, args;
        CID = $rootScope.CID;
        _data = msg.data;
        if (msg.event === 'host') {
          return $scope.$apply(function() {
            return $scope.hosts = msg.data.data;
          });
        } else if (msg.event === 'login') {
          return $rootScope.UID = _data['uid'];
        } else if (msg.event === 'loginHost') {
          $rootScope.HID = _data.host_id;
          $scope.$apply(function() {
            $scope.host = msg.data.data;
            return $rootScope.host = $scope.host;
          });
          console.log($rootScope.host);
          $rootScope.$emit('init-ifvisible');
          args = {
            action: 'getPanel'
          };
          wsSend.msg('clientMsg', args);
          args = {
            action: 'getWeather'
          };
          return wsSend.msg('clientMsg', args);
        } else if (msg.event === 'hostMsg') {
          _action = msg.data.action;
          if (_action === 'lcdClose') {
            return $rootScope.$emit('lcd-close');
          } else if (_action === 'lcdOpen') {
            return $rootScope.$emit('lcd-open');
          } else if (_action === 'lcdRest') {
            return $rootScope.$emit('panel-stop');
          } else if (_action === 'setBg') {
            return $scope.$apply(function() {
              return $scope.bgName = msg.data.val;
            });
          }
        } else if (msg.event === 'clientMsg') {
          _action = msg.data.action;
          if (_action === 'getPanel') {
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
        console.log('stop');
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
          if ($scope.panel.length < $rootScope.host.host_panel_eq + 5) {
            args = {
              action: 'getPanel'
            };
            return wsSend.msg('clientMsg', args);
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
      return $rootScope.$on('init-ifvisible', function() {
        ifvisible.setIdleDuration($rootScope.host.host_sleep);
        ifvisible.on('idle', function() {
          var args;
          if ($rootScope.host.host_sleep_mode === 1) {
            $rootScope.$emit('panel-stop');
            $rootScope.$emit('lcd-close');
            args = {
              action: 'host-sleep'
            };
            return wsSend.msg('hostMsg', args);
          }
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
      });
    }
  ]).controller('appCtrl', [
    '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope', 'wsSend', function($scope, $interval, $window, ws, $timeout, uuid4, $rootScope, wsSend) {
      var CID, UID, fn;
      CID = uuid4;
      UID = '';
      $rootScope.UID = '';
      $rootScope.CID = CID;
      $rootScope.HID = '';
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
          if ($rootScope.HID) {
            args.hid = $rootScope.HID;
          }
          console.log('> ' + event + ' - ' + JSON.stringify(args));
          return ws.$emit(event, args);
        }
      };
    }
  ]);

}).call(this);
