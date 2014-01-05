$(function() {
  /* for(var i = 33; i < 128; i++) {
    $('body').append($('<p>'+String.fromCharCode(i)+'</p>'));
  } */

  function obj(born, conf) {
    var obj = {
      creation: born,
      start_brightness: 100,
      start_x: Math.random()*screen.maxX,
      start_y: screen.maxY,
      dx: 0.02*(Math.random()-0.5),
      dy: -0.015-Math.random()*0.01,
      ax: 0,
      ay: 0.00013,
      radius: 0.04+Math.random()*0.01,
      color: Math.random()*360,
      brightness: 100,
      decay_rate: 1,
      callback: function(i) {
      },
      brightness: function(t) {
        return Math.ceil(this.start_brightness-t*this.decay_rate);
      },
      isDead: function(i) {
        return this.brightness(i-this.creation) <= 20;
      },
      onDie: function(i) {
      },
      x: function(t) {
        return this.start_x+this.dx*t+this.ax*t*t;
      },
      y: function(t) {
        return this.start_y+this.dy*t+this.ay*t*t;
      },
      draw: function(screen, i) {
        var t = i-this.creation;
        screen.drawRound(this.x(t), this.y(t),
          this.radius,this.color,this.brightness(t));
      }
    }
    return $.extend(obj, conf || {});
  }
  function rocket(born, conf) {
    var rocket = obj(born, {
      spawnNew: function(i,dx, dy) {
        var t = i-this.creation;
        var x0 = this.x(t);
        var y0 = this.y(t);
        objs.push(obj(i, {
          color: (360+this.color+(Math.random()-0.5)*30)%360,
          radius: 0.04,
          start_brightness: 50,
          decay_rate: 1,
          start_x: x0,
          start_y: y0,
          dy: dy,
          dx: dx
        }));
      }
    });
    return $.extend(rocket, conf || {});
  }
  function star() {
    return obj(0, {
      start_y: screen.maxY*Math.random(),
      radius: 0.04,
      brightness: 10,
      target_brightness: 10,
      draw: function(screen, i) {
        if (i%2 == 0) {
          if (this.brightness == this.target_brightness) {
            this.target_brightness = Math.ceil(Math.random()*50+10);
          } else if (this.brightness < this.target_brightness) {
            this.brightness++;
          } else {
            this.brightness--;
          }
        }
        screen.drawPixel(this.start_x, this.start_y,
          38,screen.hsl(0,0,this.brightness));
      }
    });
  }

  
  var screen = makeScreen(10, 18, "16px Courier", 0.015);
  
  var objs = [];
  var stars = [];
  for(var s=0;s<100;s++) {
    stars.push(star());
  }

  screen.callback = function(i) {
    var newObjs = [];
    for(var l = 0; l<stars.length; l++) {
      stars[l].draw(screen, i);
    }
    for(var l = 0; l<objs.length; l++) {
      objs[l].draw(screen, i);
      objs[l].callback(i);
      if (objs[l].isDead(i)) {
        objs[l].onDie(i);
      } else {
        newObjs.push(objs[l]);
      }
    }
    objs = newObjs;

    if (Math.random() > 0.96) {
      //Spawn normal rocket
      objs.push(rocket(i, {
        onDie: function(i) {
          //Which may spawn subrockets!
          if (Math.random() > 0.8) {
            //But only sometimes
            var dx =  (Math.random()+1)*0.003;
            var dy = -(Math.random()+1)*0.004;
            for(y = 0; y <= 2; y+=1) {
              this.spawnNew(i,
                dx+Math.random()*0.001,
                y*dy+Math.random()*0.01
              );
              this.spawnNew(i,
                -dx-Math.random()*0.001,
                y*dy+Math.random()*0.001
              );
            }
          }
        }
      }));
    }

    if (Math.random() > 0.98) {
      //Spawn a spread of multple rockets!
      var amount = Math.ceil(Math.random()*4+5);
      var spread = Math.random()*0.004+0.001;
      var size = 0.001+Math.random()*0.04
      var start_x = Math.random()*screen.maxX;
      var color = 360+Math.random()*360;
      for(var a = 0; a < amount; a++) {
        objs.push(rocket(i, {
          start_x: start_x,
          dx: spread*(a-amount*0.5),
          radius: size,
          color: (color+(a-amount*0.5)*10)%360
        }));
      }
    }
  }

});
