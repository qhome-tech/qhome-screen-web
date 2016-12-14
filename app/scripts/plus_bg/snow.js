function initSnow() {
  time = 0;
  count = 0;
  arc = 100
  lights = []

  canvas = document.getElementById('snow')

  canvas.fillStyle= 'rgba(0,0,0,0)';


  ctx = canvas.getContext('2d')
  rate = 50

  time = ''
  count = ''
  size = 2
  speed = 10


  w = window.innerWidth
  h = window.innerHeight

  canvas.setAttribute('width', w)
  canvas.setAttribute('height', h)


  colors = ['#eee'];

  for (var i = 0; i < arc; i++) {
    lights[i] = {
      x: Math.ceil(Math.random() * w),
      y: Math.ceil(Math.random() * h),
      toX: Math.random() * 5 + 1,
      toY: Math.random() * 5 + 1,
      c: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * size
    }
  }

  bubble()
}

function bubble() {
  w = window.innerWidth
  h = window.innerHeight
  colors = ['#eee'];

  ctx.clearRect(0, 0, w, h);

  for (var i = 0; i < arc; i++) {
    var li = lights[i];

    ctx.beginPath();
    ctx.arc(li.x, li.y, li.size, 0, Math.PI * 2, false);
    ctx.fillStyle = li.c;
    ctx.fill();

    li.x = li.x + li.toX * (time * 0.05);
    li.y = li.y + li.toY * (time * 0.05);

    if (li.x > w) { li.x = 0; }
    if (li.y > h) { li.y = 0; }
    if (li.x < 0) { li.x = w; }
    if (li.y < 0) { li.y = h; }
  }
  if (time < speed) {
    time++;
  }
  timerID = setTimeout(bubble, 1000 / rate);
}
