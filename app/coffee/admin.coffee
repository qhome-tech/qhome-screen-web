'use strict';

angular.module('app.admin', [])

.controller('adminCtrl', [
  '$scope', '$interval', '$window', '$websocket', 'ws', '$rootScope', 'wsSend'
  ($scope, $interval, $window, $websocket, ws, $rootScope, wsSend) ->

    CID = $rootScope.CID

    $scope.send = ->
      args =
        hid : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
        cid: CID
        data: 'test'

      ws.$emit('hostMsg', args)




    $scope.action = (data) ->
      args =
        action:　data
      wsSend.msg('hostMsg', args)



    $scope.login = ->
      _data =
        email : 'xank@qq.com'
        pwd  : 'cs1234'
        cid  : CID

      ws.$emit('login',  _data)

    $scope.setBg = (name) ->
      args =
        action: 'setBg'
        val: name

      wsSend.msg('hostMsg', args)



    $scope.push = (val) ->

      _data = [
        {
          text: '测试2'
        }
        {
          text: '测试3'
        }
        {
          text: '测试4'
        }
        {
          text: '测试4'
        }
        {
          text: '测试4'
        }
        {
          text: '测试4'
        }
        {
          text: '测试4'
        }
      ]
      args =
        action: 'panel'
        data: _data

      wsSend.msg('hostMsg', args)



    ws.$on '$message', (msg) ->
      CID = $rootScope.CID

      _data = msg.data

      if msg.event == 'clientMsg'
        _action = msg.data.action
        if _action == 'panel-num'
          $scope.$apply ->
            $scope.panelNum = _data.val

])
