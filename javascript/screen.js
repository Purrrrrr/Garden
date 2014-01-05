function makeScreen(letterW, letterH, font, fadeRate) {
  var ascii = " `````````````````````....................~~~~~~~~~~~~~~~~^^^____--'''||||||||:::::\\\\\\/!!!**}}}}++;;;;<<<>[)7777?iiii11lllll\"\"\"rrrrIIvjJJo%%3333333CsuuYYYVVVn2f&&00000Oy$U4x69ZkkkkGwwhDDDDXXXXXXXX8Abbddddmmm@@@@pRgHH#EqQQQNNBBBBBBWWWWWWWWWWWWWWWWMMMMMMMMMM";

  var canvas = document.createElement('canvas');
  var real_context = canvas.getContext('2d');
  var buffer_canvas = document.createElement('canvas');
  var buffer = buffer_canvas.getContext('2d');
  fadeRate = Math.max(Math.min(fadeRate,1),0);

  $('body').append(canvas);

  var w = 0;
  var h = 0;
  var pixelW = 0;
  var pixelH = 0;
  var factorX = 0;
  var factorY = 0;
  var height_to_width_ratio = letterH/letterW;
  var pixels = [];

  function resetScreen() {
    pixelW = $(document).width();
    pixelH = $(document).height();
    w = Math.floor(pixelW/letterW)+1;
    h = Math.floor(pixelH/letterH)+1;
    factor = Math.min(pixelW,pixelH);
    factorX = Math.min(pixelW,pixelH)/letterW;
    factorY = Math.min(pixelW,pixelH)/letterH;
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
    console.log("W: "+factorX+" H: "+factorY);
  }

  function hsl(h,s,l) {
    return "hsl("+h+","+s+"%,"+l+"%)";
  }
  function redraw() {
    buffer.fillStyle="rgba(0,0,0,"+fadeRate+")";
    buffer.fillRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
    buffer.font=font;
    screen.callback(i);
    real_context.drawImage(buffer_canvas, 0, 0);
  }
  function drawPixel(x,y,value,color) {
    value = Math.max(0, value);
    if (value > 0) {
      x = letterW*x;
      y = letterH*(y+1);
      buffer.fillStyle=color;
      buffer.fillText(ascii[value], x,y);
    }
  }

  function convert_x(c) {
    return Math.floor(c*factorX);
  }
  function convert_y(c) {
    return Math.floor(c*factorY);
  }

  var screen = {
    pixels: pixels,
    draw: redraw,
    drawRound: function(x,y,r, color,value,value2) {
      value2 = value2 || 0
      y = convert_y(y);
      x = convert_x(x);
      var ch = convert_y(r);
      var cw = convert_x(r);
      var d = ch*ch
      for(var cy = y-ch; cy<y+ch; cy++) {
        for(var cx = x-cw; cx<x+cw; cx++) {
          var dx = (cx-x);
          var dy = (cy-y)*height_to_width_ratio;
          var cd = (dx*dx+dy*dy);
          if (cd < d) {
            drawPixel(cx,cy,
              Math.ceil((d-cd)/d*value*2.55), 
              hsl(color,100,Math.min(100,0.5+value*0.8+((d-cd)/d*10)))
            );
          }
        }
      }
    },
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
