'use strict';
angular.module('app.main', [])



.controller('homeCtrl', [
  '$scope', '$interval', '$window', 'ws', '$rootScope', 'wsSend', '$modal', '$timeout'
  ($scope, $interval, $window, ws, $rootScope, wsSend, $modal, $timeout) ->


    $scope.bgName = ''

    $scope.host = {}


    #myModal = $modal({title: 'My Title', content: 'My Content', show: true})
    $scope.slider = {
      host_wakedelay: {
        floor: 0
        step: 0.1
        ceil: 5
        minLimit: 0
        maxLimit: 5
        precision: 1
        showTicks: 1

        translate: (value) ->
          value + 's'

      }

      host_panel_eq: {
        floor: 0
        step: 1
        ceil: 30
        minLimit: 0
        maxLimit: 30
        precision: 1
        showTicks: 5

      }

      host_sleep: {
        floor: 0
        step: 1
        ceil: 600
        minLimit: 0
        maxLimit: 600
        precision: 1
        showTicks: 60

      }


    }




    editHostModal = $modal({
      scope: $scope
      template: 'views/modal/setting.tpl.html'
      show: false
    })

    selHostModal = $modal({
      scope: $scope
      template: 'views/modal/sel_host.tpl.html'
      show: false
      backdrop: 'static'
    })

    selHostModal.$promise.then(selHostModal.show)


    $scope.save = () ->
      args =
        data: $scope.host
        action: 'editHost'
      wsSend.msg('hostMsg', args)
      editHostModal.$promise.then(editHostModal.hide)

    $scope.editHostModal = () ->
      editHostModal.$promise.then(editHostModal.show)
      fn = ->
        $scope.$broadcast('rzSliderForceRender')
      $timeout(fn)

    $scope.selHostModal = () ->
      selHostModal.$promise.then(selHostModal.show)

    $scope.openHost = (host_id) ->
      console.log host_id
      args =
        hid  : host_id

      wsSend.msg('loginHost', args)
      selHostModal.$promise.then(selHostModal.hide)


    ws.$on '$message', (msg) ->
      CID = $rootScope.CID
      _data = msg.data

      if msg.event == 'host'

        #args =
        #  hid  : '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'

        #wsSend.msg('loginHost', args)

        $scope.$apply ->
          $scope.hosts = msg.data.data



      else if msg.event == 'login' #主机登录成功
        $rootScope.UID = _data['uid']



      else if msg.event == 'loginHost' #主机登录成功

        $rootScope.HID = _data.host_id

        $scope.$apply ->
          $scope.host = msg.data.data
          $rootScope.host = $scope.host


        console.log $rootScope.host

        $rootScope.$emit('init-ifvisible')



        args =
          action: 'getPanel'

        wsSend.msg('clientMsg', args)

        args =
          action: 'getWeather'

        wsSend.msg('clientMsg', args)




      else if msg.event == 'hostMsg'

        _action = msg.data.action
        if _action == 'lcdClose'
          $rootScope.$emit('lcd-close')

        else if _action == 'lcdOpen'
          $rootScope.$emit('lcd-open')

        else if _action == 'lcdRest'
          $rootScope.$emit('panel-stop')
          #location.reload()

        else if _action == 'setBg'

          $scope.$apply ->

            $scope.bgName = msg.data.val


      else if msg.event == 'clientMsg'

        _action = msg.data.action
        if _action == 'getPanel'

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

    $scope.panel = []

    nowEQ   = 0


    $scope.likePost = (id) ->
      console.log(id)
      args =
        new_id: id
        action: 'likePost'


      wsSend.msg('clientMsg', args)


    $scope.$on 'new-panel', (event, msg) ->
      #console.log msg.data

      if $scope.panel.length == 0 then first = true

      for db, index in msg.data
        if db.content.picUrl == 'undefined' then db.content.picUrl = false

        $scope.$apply ->
          db.open  = false
          db.focus = 0
          db.eq    = nowEQ
          $scope.panel.push(db)

        nowEQ = nowEQ + 1

      console.log($scope.panel)

      panelLoad(first)


    $rootScope.$on 'panel-start', (event, msg) ->
      if !focesAnimate then startFocus()

    $rootScope.$on 'panel-stop', (event, msg) ->
      console.log 'stop'
      stopFocus();





    #读取panel动画
    panelLoad = (first) ->

      i = 0
      isNext = false
      for db, index in $scope.panel

        if db.focus || first then isNext = true

        if isNext
          $scope.$apply ->
            db.open = true
            db.delay = i + 's'


          i = i + 0.1

      #发送当前数量
      args =
        val: $scope.panel.length
        action: 'panel-num'

      wsSend.msg('clientMsg', args)

      if $scope.panel.length > 1
        if !focesAnimate then startFocus()


    focosEq = 0

    focusCtrl = ''
    stopFocus = ->
      focesAnimate = false
      $interval.cancel(focusCtrl);

    startFocus = ->
      focesAnimate = true

      fn = ->
        #console.log $scope.panel.length
        #console.log focosEq + '-' + nowEQ

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



        if $scope.panel.length < $rootScope.host.host_panel_eq + 5
          args =
            action: 'getPanel'

          wsSend.msg('clientMsg', args)


      focusCtrl = $interval(fn, 7000)
])


#背景动画控制器
.controller('backdropCtrl', [
  '$scope', '$interval', '$window', '$rootScope', '$timeout', 'wsSend'
  ($scope, $interval, $window, $rootScope, $timeout, wsSend) ->

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



    $rootScope.$on 'init-ifvisible', () ->


      ifvisible.setIdleDuration($rootScope.host.host_sleep)

      ifvisible.on 'idle', () ->


        if $rootScope.host.host_sleep_mode == 1

          $rootScope.$emit('panel-stop')
          $rootScope.$emit('lcd-close')

          args =
            action: 'host-sleep'

          wsSend.msg('hostMsg', args)



      ifvisible.on 'wakeup', () ->
        $rootScope.$emit('panel-start')
        $rootScope.$emit('lcd-open')

        args =
          action: 'host-wakeup'

        wsSend.msg('hostMsg', args)





])


.controller('appCtrl', [
  '$scope', '$interval', '$window', 'ws', '$timeout', 'uuid4', '$rootScope', 'wsSend'
  ($scope, $interval, $window, ws, $timeout, uuid4, $rootScope, wsSend) ->

    CID = uuid4
    #HID = '09bbea78-bfb2-11e6-a4a6-cec0c932ce01'
    UID = ''
    $rootScope.UID = ''
    $rootScope.CID = CID
    $rootScope.HID = ''


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


        if $rootScope.HID then args.hid = $rootScope.HID



        console.log('> ' + event + ' - ' +JSON.stringify(args))

        ws.$emit(event,  args)
    }

])
