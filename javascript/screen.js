function makeScreen() {

  var canvas = document.createElement('canvas');
  var real_context = canvas.getContext('2d');
  var buffer_canvas = document.createElement('canvas');
  var buffer = buffer_canvas.getContext('2d');

  $('body').append(canvas);
  
  var scale = 10;
  var w = 0;
  var h = 0;
  var pixelW = 0;
  var pixelH = 0;

  function resetScreen() {
    pixelW = $(document).width();
    pixelH = $(document).height();
    w = Math.floor(pixelW/scale)+1;
    h = Math.floor(pixelH/scale)+1;
    factor = Math.min(pixelW,pixelH)/scale;
    if (pixelW/pixelH > 1) {
      screen.maxX = pixelW/pixelH;
      screen.maxY = 1
    } else {
      screen.maxX = 1
      screen.maxY = pixelH/pixelW;
    }
    canvas.height = buffer_canvas.height = pixelH;
    canvas.width = buffer_canvas.width = pixelW;

    console.log("W: "+w+" H: "+h);
    console.log("F: "+factor);
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
  function drawPixel(x,y,value,color) {
    value = Math.max(0, value);
    if (value > 0) {
      buffer.fillStyle=color;
      buffer.fillRect(x,y, scale, scale);
    }
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
    return Math.floor(c*factor*scale);
  }
  function convert_coord(c) {
    return c*factor*scale;
  }

  var screen = {
    draw: redraw,
    drawPixel: function(x,y,value,color) {
      y = convert_coord_round(y);
      x = convert_coord_round(x);
      drawPixel(x,y,value,color);
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
