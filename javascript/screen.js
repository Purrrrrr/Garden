function makeScreen(letterW, letterH) {
  var ascii = " `````````````````````....................~~~~~~~~~~~~~~~~^^^____--'''||||||||:::::\\\\\\/!!!**}}}}++;;;;<<<>[)7777?iiii11lllll\"\"\"rrrrIIvjJJo%%3333333CsuuYYYVVVn2f&&00000Oy$U4x69ZkkkkGwwhDDDDXXXXXXXX8Abbddddmmm@@@@pRgHH#EqQQQNNBBBBBBWWWWWWWWWWWWWWWWMMMMMMMMMM";

  var screenElem = $('<div class="screen"></div>');
  $('body').append(screenElem);

  var w = 0;
  var h = 0;
  var factor = 0;
  var letter_height_factor = letterH/letterW;
  var pixels = [];

  var screen = {
  }

  function makePixel() {
    var pixel = {
      elem: $('<span></span>'),
      val: 0,
      hue, 0,
      draw: function(value,hue) {
        //pixel.elem[0].style.color = 'hsl('+hue+',100%,50%)';
        pixel.elem[0].innerHTML = ascii[value];
        pixel.val = value;
        pixel.hue = hue;
      }
    }
    return pixel;
  }

  function resetScreen() {
    screenElem.empty();
    pixels = [];
    w = Math.floor($(document).width()/letterW)-1;
    h = Math.floor($(document).height()/letterH)-1;
    factor = 1/Math.min(w,h);

    console.log("W: "+w+" H: "+h);

    for(y = 0; y<h; y++) {
      var line = [];
      var lineelem= $('<div class="line"></div>');
      for(x = 0; x<w; x++) {
        var pix = makePixel();
        line.push(pix);
        lineelem.append(pix.elem);
      }
      screenElem.append(lineelem);
      pixels.push(line);
    }
  }

  resetScreen();
  $(window).resize(resetScreen);

  var i = 0;
  setInterval(function() {
    //console.log(i);
    for(y = 0; y<h; y++) {
      for(x = 0; x<w; x++) {
        pixels[y][x].draw((Math.ceil(x/(y+1))+i+y+x)%256, (x+y+i*10)%360);
      }
    }
    i++;
  }, 3000);

  return screen;
}
