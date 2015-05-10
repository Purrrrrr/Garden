$(function() {
  var screen = makeScreen(10, 18, "16px Courier", 0.085);

  function rect() {
  }

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
      radius: 0.03+Math.random()*0.015,
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
          radius: Math.max(0.02,this.radius-0.02),
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
  
  var objs = [];

  screen.callback = function(i) {
    var newObjs = [];
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
  }

});
