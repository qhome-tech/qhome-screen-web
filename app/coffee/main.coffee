'use strict';

angular.module('app.main', [])

.controller('adminCtrl', [
  '$scope', '$interval', '$window', '$websocket'
  ($scope, $interval, $window, $websocket) ->




])



.controller('homeCtrl', [
  '$scope', '$interval', '$window', 'ws', '$rootScope'
  ($scope, $interval, $window, ws, $rootScope) ->


    $scope.host =
      cid : 'cid'
      hid: 'hid'

    ws.$on '$message', (msg) ->
      CID = $rootScope.CID

      if msg.event == 'host'

        #console.log msg.data
        args =
          hid  : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
          cid  : CID

        ws.$emit('loginHost',  args)

      else if msg.event == 'loginHost'
        console.log msg.data


        $scope.$apply ->
          $scope.host = msg.data


      else if msg.event == 'hostMsg'

        _action = msg.data.action
        if _action == 'lcdClose'
          $rootScope.$emit('lcd-close')

        else if _action == 'lcdOpen'

          $rootScope.$emit('lcd-open')


])



.controller('backdropCtrl', [
  '$scope', '$interval', '$window', '$rootScope', '$timeout'
  ($scope, $interval, $window, $rootScope, $timeout) ->




    $scope.backdrop =
      open: false
      start: false


    $rootScope.$on 'lcd-close', () ->

      $scope.$apply ->
        $scope.backdrop.open = true
      fn = ->
        $scope.backdrop.start = true

      $timeout(fn, 100)

    $rootScope.$on 'lcd-open', () ->

      $scope.$apply ->
        $scope.backdrop.start = false

      fn = ->
        $scope.backdrop.open = false

      $timeout(fn, 500)


    ifvisible.setIdleDuration(500)
    ifvisible.on 'idle', () ->
      $rootScope.$emit('lcd-close')

    ifvisible.on 'wakeup', () ->
      $rootScope.$emit('lcd-open')
])

.controller('appCtrl', [
  '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope'
  ($scope, $interval, $window, ws, $timeout, uuid4, $rootScope) ->

    CID = uuid4
    $rootScope.CID = CID

    fn = ->
      $scope.$emit('lcd-close')

    #$timeout(fn, 2000)




    ws.$on '$open', (msg) ->

      args =
        cid: CID
      ws.$emit('init',  args)

    ws.$on '$close', (msg) ->
      console.log '服务器关闭'


    ws.$on '$message', (msg) ->

      console.log JSON.stringify(msg)

      if msg.event == 'init'
        args =
          email : 'xank@qq.com'
          pwd  : 'cs1234'
          cid  : CID

        ws.$emit('login',  args)


    $scope.send = ->
      args =
        hid : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
        cid: CID
        data: 'test'

      ws.$emit('hostMsg', args)


    $scope.lcdClose = ->
      args =
        hid : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
        cid: CID
        action: 'lcdClose'

      ws.$emit('hostMsg', args)

    $scope.lcdOpen = ->
      args =
        hid : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
        cid: CID
        action: 'lcdOpen'

      ws.$emit('hostMsg', args)

    $scope.test1 = ->
      name = 'sd'
      ws.$emit('nick',  name)

    $scope.login = ->
      _data =
        email : 'xank@qq.com'
        pwd  : 'cs1234'
        cid  : CID

      ws.$emit('login',  _data)




















])



.factory('ws', [
  '$websocket'
  ($websocket) ->

    ws = $websocket.$new('ws://localhost:8181');
    return ws

])
