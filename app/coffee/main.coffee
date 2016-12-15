'use strict';
angular.module('app.main', [])



.controller('homeCtrl', [
  '$scope', '$interval', '$window', 'ws', '$rootScope', 'wsSend'
  ($scope, $interval, $window, ws, $rootScope, wsSend) ->
    new WOW().init();

    $scope.bgName = ''



    $scope.host =
      cid : 'cid'
      hid: 'hid'

    ws.$on '$message', (msg) ->
      CID = $rootScope.CID

      _data = msg.data

      if msg.event == 'host'

        args =
          hid  : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'

        wsSend.msg('loginHost', args)

      else if msg.event == 'loginHost' #主机登录成功

        $scope.$apply ->
          $scope.host = msg.data


        args =
          action: 'get-panel'

        wsSend.msg('hostMsg', args)



      else if msg.event == 'hostMsg'

        _action = msg.data.action
        if _action == 'lcdClose'
          $rootScope.$emit('lcd-close')

        else if _action == 'lcdOpen'

          $rootScope.$emit('lcd-open')

        else if _action == 'setBg'

          $scope.$apply ->

            $scope.bgName = msg.data.val

        else if _action == 'panel'

          $scope.$broadcast('new-panel', _data)

])

.controller('panelsCtrl', [
  '$scope', '$interval', '$window', '$rootScope', '$timeout', 'wsSend'
  ($scope, $interval, $window, $rootScope, $timeout, wsSend) ->

    EQ = 0

    focesAnimate = false
    $scope.panel = [
      {
        open: true
        text: '测试'
        focus: true
        eq: 0
        type: 0
      }
    ]

    nowEQ   = 1


    $scope.$on 'new-panel', (event, msg) ->
      #console.log msg.data

      for db, index in msg.data

        $scope.$apply ->
          db.open  = false
          db.focus = 0
          db.eq    = nowEQ
          $scope.panel.push(db)

        nowEQ = nowEQ + 1


      panelLoad()


    #读取panel动画
    panelLoad = ->

      i = 0
      isNext = false
      for db, index in $scope.panel

        if db.focus then isNext = true

        if isNext
          $scope.$apply ->
            db.open = true
            db.delay = i + 's'


          i = i + 0.1



      #返回当前数量
      args =
        val: $scope.panel.length
        action: 'panel-num'

      wsSend.msg('clientMsg', args)

      if $scope.panel.length > 1
        if !focesAnimate then startFocus()



    focosEq = 0

    startFocus = ->
      focesAnimate = true

      fn = ->
        console.log $scope.panel.length
        console.log focosEq + '-' + nowEQ


        if $scope.panel.length == 4
          $interval.cancel(focusCtrl);
          focesAnimate = false

          return


        if focosEq > 0 #清除上一个焦点
          $scope.panel[focosEq - 1]['focus'] = 0
        if focosEq > 1
          $scope.panel[focosEq - 2]['focus'] = 2
        if focosEq > 2
          $scope.panel[focosEq - 3]['open'] = false

        if focosEq > 3
          $scope.panel.splice(focosEq - 4, 1)

          focosEq = focosEq - 1

        $scope.panel[focosEq]['focus'] = 1
        $scope.panel[focosEq]['delay'] = 0

        focosEq = focosEq + 1



        if $scope.panel.length < 7
          args =
            action: 'get-panel'

          wsSend.msg('hostMsg', args)




      focusCtrl = $interval(fn, 1500)

])


#背景动画控制器
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
  '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope', 'wsSend'
  ($scope, $interval, $window, ws, $timeout, uuid4, $rootScope, wsSend) ->

    CID = uuid4
    HID = '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
    $rootScope.CID = CID
    $rootScope.HID = HID

    fn = ->
      $scope.$emit('lcd-close')


    ws.$on '$open', (msg) ->

      args = {}
      wsSend.msg('init',  args)

    ws.$on '$close', (msg) ->
      console.log '服务器关闭'


    ws.$on '$message', (msg) ->

      console.log '%c< ' + msg.event + ' - ' + JSON.stringify(msg), 'color:green'

      AID = msg.data.cid #发送方ID
      $rootScope.AID = AID

      if msg.event == 'init' #客户端连接成功
        args =
          email : 'xank@qq.com'
          pwd  : 'cs1234'

        wsSend.msg('login',  args)


])



.factory('ws', [
  '$websocket'
  ($websocket) ->

    ws = $websocket.$new('ws://192.168.31.101:8181');
    return ws

])



.factory('wsSend', [
  'ws', '$rootScope'
  (ws, $rootScope) ->

    return {
      msg: (event, args) ->

        args.cid = $rootScope.CID
        args.aid = $rootScope.AID

        if event == 'hostMsg'
          args.hid = $rootScope.HID




        console.log('> ' + event + ' - ' +JSON.stringify(args))

        ws.$emit(event,  args)
    }

])
