function makeScreen() {

  var canvas = document.createElement('canvas');
  var real_context = canvas.getContext('2d');
  var buffer_canvas = document.createElement('canvas');
  var buffer = buffer_canvas.getContext('2d');

  $('body').append(canvas);
  
  var w = 0;
  var h = 0;
  var pixelW = 0;
  var pixelH = 0;

  function resetScreen() {
    pixelW = $(document).width();
    pixelH = $(document).height();
    factor = Math.min(pixelW,pixelH);
    if (pixelW/pixelH > 1) {
      screen.maxX = pixelW/pixelH;
      screen.maxY = 1
    } else {
      screen.maxX = 1
      screen.maxY = pixelH/pixelW;
    }
    canvas.height = buffer_canvas.height = pixelH;
    canvas.width = buffer_canvas.width = pixelW;
  }

  function hsl(h,s,l) {
    return "hsl("+h+","+s+"%,"+l+"%)";
  }
  function redraw() {
    buffer.fillStyle="rgb(0,155,255)";
    buffer.fillRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
    screen.callback(i);
    real_context.drawImage(buffer_canvas, 0, 0);
  }
  function drawRect(x,y,w,h, color) {
    buffer.fillStyle=color;
    buffer.fillRect(x,y, w, h);
  }
  function drawLine(x,y,x2,y2,w,color) {
    buffer.beginPath();
    buffer.moveTo(x,y);
    buffer.lineTo(x2,y2);
    buffer.strokeStyle=color;
    buffer.lineWidth=w;
    buffer.stroke();
  }

  function convert_coord_round(c) {
    return Math.floor(c*factor);
  }
  function convert_coord(c) {
    return c*factor;
  }

  var screen = {
    draw: redraw,
    drawRect: function(x,y,w,h,color) {
      y = convert_coord_round(y);
      x = convert_coord_round(x);
      w = convert_coord_round(w);
      h = convert_coord_round(h);
      drawPixel(x,y,w,h,color);
    },
    drawLine: function(x,y,x2,y2,w,color) {
      y = convert_coord_round(y);
      x = convert_coord_round(x);
      y2 = convert_coord_round(y2);
      x2 = convert_coord_round(x2);
      w = convert_coord_round(w);
      drawLine(x,y,x2,y2,w,color);
    },
    drawRound: function(x,y,r, color,value) {
      var sx = screen.maxX/2;
      var sy = screen.maxY;
      screen.drawLine(sx,sy,x,y,r, hsl(color,100,Math.min(100,value*0.8+(30))));
    },
    hsl: hsl,
    callback: function(i) {
    }
  }

  resetScreen();
  $(window).resize(resetScreen);

  var i = 0;
  setInterval(function() {
    redraw(i);
    i++;
  }, 10);
  return screen;
}
