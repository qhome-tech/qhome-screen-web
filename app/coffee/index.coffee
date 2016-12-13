window.imgok = (c) ->
  id = c.getAttribute('pic-id')

  $('[pic-id=' + id + ']').addClass('loadok')
  #console.log $('body')
