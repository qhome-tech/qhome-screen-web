(function() {
  'use strict';
  angular.module('app.admin', []).controller('adminCtrl', [
    '$scope', '$interval', '$window', '$websocket', 'ws', '$rootScope', 'wsSend', function($scope, $interval, $window, $websocket, ws, $rootScope, wsSend) {
      var CID;
      CID = $rootScope.CID;
      $scope.send = function() {
        var args;
        args = {
          hid: '09bbea78-bfb2-11e6-a4a6-cec0c932ce01',
          cid: CID,
          data: 'test'
        };
        return ws.$emit('hostMsg', args);
      };
      $scope.action = function(data) {
        var args;
        args = {
          action: data
        };
        return wsSend.msg('hostMsg', args);
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
      $scope.setBg = function(name) {
        var args;
        args = {
          action: 'setBg',
          val: name
        };
        return wsSend.msg('hostMsg', args);
      };
      $scope.push = function(val) {
        var _data, args;
        _data = [
          {
            text: '测试2'
          }, {
            text: '测试3'
          }, {
            text: '测试4'
          }, {
            text: '测试4'
          }, {
            text: '测试4'
          }, {
            text: '测试4'
          }, {
            text: '测试4'
          }
        ];
        args = {
          action: 'panel',
          data: _data
        };
        return wsSend.msg('hostMsg', args);
      };
      return ws.$on('$message', function(msg) {
        var _action, _data;
        CID = $rootScope.CID;
        _data = msg.data;
        if (msg.event === 'clientMsg') {
          _action = msg.data.action;
          if (_action === 'panel-num') {
            return $scope.$apply(function() {
              return $scope.panelNum = _data.val;
            });
          }
        }
      });
    }
  ]);

}).call(this);
