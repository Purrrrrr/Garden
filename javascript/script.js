$(function() {
  var screen = makeScreen();

  var maxLength = 0.10;
  var maxWidth = 0.1;
  var childrenWidthRatio = 0.5;
  var childrenMaxWidthRatio = 0.7;
  var childrenLength = 0.001;
  var childrenMaxLengthRatio = 0.90;
  var angleVariance = 13*Math.PI/180;
  var lengthGrowthRate = 0.0008 * maxLength;
  var widthGrowthRate = 0.0002 * maxWidth;

  var maxDepth = 7;
  var childrenGrowthRate = 0.11;

  function plantSegment(born, parent, conf) {
    var depth = parent.depth ? parent.depth+1 : 1;
    var obj = {
      parent: parent,
      depth: depth,
      creation: born,
      width: parent.width*childrenWidthRatio,
      length: childrenLength,
      angle: parent.angle + depth*angleVariance*(2*Math.random()-1),
      maxWidth: maxWidth,
      maxLength: maxLength*(1+Math.random()*0.5-depth*0.1),
      maxChildren: 1.5+depth/3*Math.random(),
      childrenGrowthRate: childrenGrowthRate*(1+depth/8+(Math.random()-0.5)*0.4),
      children: [],
      color: function(i) {
        var age = Math.min(1, this.width/maxWidth*2);
        return screen.hsl(100-age*100,100-age*60,60-(this.depth/maxDepth)*25);
      },
      callback: function(i) {
        this.length = Math.min(Math.min(this.maxLength, this.length+lengthGrowthRate), this.parent.length*childrenMaxLengthRatio);
        this.width = Math.min(Math.min(this.maxWidth, this.width+widthGrowthRate), this.parent.width*childrenMaxWidthRatio);
        
        if (this.depth > maxDepth) return;
        if (this.children.length >= this.maxChildren) return;
        
        var t = i-this.creation;
        if (this.children.length+1 < Math.sqrt(t)*this.childrenGrowthRate) {
          var child = plantSegment(i,this);
          this.children.push(child);
          objs.push(child);
        }
      },
      draw: function(screen, i) {
        this.endX = this.parent.endX + this.length*Math.cos(this.angle);
        this.endY = this.parent.endY + this.length*Math.sin(this.angle);
        
        screen.drawLine(this.parent.endX, this.parent.endY, this.endX, this.endY, 
          this.width, this.color(i));
      },
      isDead: function(i) {
        return false;
      },
      onDie: function(i) {
      },
    };
    return $.extend(obj, conf || {});
  }

  function trunk(x,y) {
    return {
      endX: screen.maxX*x,
      endY: screen.maxY*y,
      width: maxLength/childrenWidthRatio,
      length: 1, //Fake
      angle: -Math.PI/2
    };
  }

  objs = [];

  var howManyTrunks = 5;
  var trunkDistance = 1/(howManyTrunks+1);
  var trunkPosVariance = 0.05;
  for(var t = 0; t < howManyTrunks; t++) {
    objs.push(plantSegment(0,trunk(trunkDistance*(t+1)+(Math.random()*2-1)*trunkPosVariance, 0.85+Math.random()*0.05), {width: 0.01}));
  }

  screen.callback = function(i) {
    screen.drawRect(0,0.7*screen.maxY,screen.maxX,0.3*screen.maxY, 'yellow');
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

  }

});
