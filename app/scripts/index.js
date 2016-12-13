(function() {
  window.imgok = function(c) {
    var id;
    id = c.getAttribute('pic-id');
    return $('[pic-id=' + id + ']').addClass('loadok');
  };

}).call(this);
