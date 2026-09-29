/* Garden surfaces are baked once. Small flower shrubs reuse cached stamps. */
(function(){
 'use strict';
 var grass=new Image(),ready=function(){};grass.onload=function(){ready()};
 grass.src=window.ISLAND_GARDEN_GRASS||'assets/img/scenery/garden-grass.jpg';
 function random(seed){return function(){seed=(seed*9301+49297)%233280;return seed/233280}}
 function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
 function stone(c,x,y,w,h,r){
  var p=[];for(var i=0;i<8;i++){var a=i*Math.PI/4; p.push([x+Math.cos(a)*w*(.78+r()*.22),y+Math.sin(a)*h*(.78+r()*.22)])}
  function shape(dy){c.beginPath();p.forEach(function(v,i){var prev=p[(i+7)%8],n=p[(i+1)%8],a=[v[0]+(prev[0]-v[0])*.15,v[1]+(prev[1]-v[1])*.15+dy];i?c.lineTo(a[0],a[1]):c.moveTo(a[0],a[1]);c.quadraticCurveTo(v[0],v[1]+dy,v[0]+(n[0]-v[0])*.15,v[1]+(n[1]-v[1])*.15+dy)});c.closePath()}
  shape(3);c.fillStyle='#7b81654d';c.fill();shape(0);
  var g=c.createLinearGradient(x-w,y-h,x+w,y+h);g.addColorStop(0,'#d1ccb2');g.addColorStop(.45,'#b8b49d');g.addColorStop(1,'#a09e89');c.fillStyle=g;c.fill();
  c.strokeStyle='#ede5c63a';c.lineWidth=1.3;c.stroke();c.save();c.clip();
  for(i=0;i<4;i++)ellipse(c,x+(r()-.5)*w*1.5,y+(r()-.5)*h*1.5,2+r()*3,1+r()*2,'#e8e0c144');c.restore();
 }
 function ground(c,cv,paths,fields,objects){
  var r=random(92),T=40;c.clearRect(0,0,cv.width,cv.height);c.fillStyle='#9abd59';c.fillRect(0,0,cv.width,cv.height);
  if(grass.complete&&grass.naturalWidth){c.save();c.globalAlpha=.63;for(var y=0;y<cv.height;y+=360)for(var x=0;x<cv.width;x+=360)c.drawImage(grass,x,y,360,360);c.restore()}
  // Large, quiet color patches give the lawn volume without per-frame work.
  for(var i=0;i<90;i++){x=r()*cv.width;y=r()*31*40;var radius=45+r()*95,g=c.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,i%3?'#5488491b':'#eef5a526');g.addColorStop(1,'#a8cb6800');ellipse(c,x,y,radius,radius*.8,g)}
  fields.forEach(function(f){c.fillStyle='#5c873b14';c.beginPath();c.roundRect(f.x*T,f.y*T,f.w*T,f.h*T,18);c.fill()});
  paths.forEach(function(p,index){
   var horizontal=p[2]>p[3],x=p[0]*T,y=p[1]*T,w=p[2]*T,h=p[3]*T;
   c.save();c.fillStyle='#c0b67b44';c.beginPath();c.roundRect(x-5,y-5,w+10,h+10,22);c.fill();
   c.fillStyle='#d5c68d70';c.beginPath();c.roundRect(x+1,y+1,w-2,h-2,18);c.fill();c.restore();
   var length=horizontal?w:h,count=Math.max(1,Math.floor(length/34)),step=length/count;
   for(var k=0;k<count;k++){var xx=horizontal?x+(k+.5)*step:x+w*.5+(r()-.5)*7,yy=horizontal?y+h*.5+(r()-.5)*7:y+(k+.5)*step;
    if(Math.hypot(xx-1080,(yy-624)*1.1)>148)stone(c,xx,yy,horizontal?step*.47:w*.48,horizontal?h*.46:step*.46,r)}
  });
  ellipse(c,1080,624,157,139,'#82925945');ellipse(c,1080,621,151,134,'#a8ac80');
  c.save();c.beginPath();c.ellipse(1080,621,148,131,0,0,7);c.clip();
  for(var row=-5;row<=5;row++)for(var col=-5;col<=5;col++)stone(c,1080+col*33+(row%2)*16+(r()-.5)*4,621+row*28+(r()-.5)*4,18,15.5,r);c.restore();
  // Canopy shadows share the ground projection, including paths beneath trees.
  objects.filter(function(o){return o.kind==='tree'}).forEach(function(o){
   var x=o.x*T+29,y=o.sy*T+21,s=o.s||1,g=c.createRadialGradient(x,y,4,x,y,62*s);g.addColorStop(0,'#315e3930');g.addColorStop(.7,'#315e3922');g.addColorStop(1,'#315e3900');ellipse(c,x,y,69*s,46*s,g);
  });
  fields.forEach(function(f){f.patches.forEach(function(p){
   var x=p.x*T,y=p.y*T,w=p.w*T,h=p.h*T;c.fillStyle='#6b78412e';c.beginPath();c.roundRect(x-3,y-2,w+6,h+8,12);c.fill();
   var g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#af8854');g.addColorStop(1,'#937044');c.fillStyle=g;c.beginPath();c.roundRect(x,y,w,h,10);c.fill();
   for(var row=0;row<2;row++){var yy=y+(row+.72)*h/2;c.strokeStyle='#6a502e60';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(x+9,yy+2);c.lineTo(x+w-9,yy+2);c.stroke();c.strokeStyle='#d8b47465';c.lineWidth=2;c.stroke()}
   for(var i=0;i<80;i++)ellipse(c,x+4+r()*(w-8),y+4+r()*(h-8),1+r(),.7,'#dfbd7c35');
  })});
  c.fillStyle='#eeddaa';c.beginPath();c.moveTo(0,31.4*T);for(x=0;x<=54;x++)c.lineTo(x*T,(31.4+Math.sin(x*.7)*.25)*T);c.lineTo(cv.width,cv.height);c.lineTo(0,cv.height);c.fill();
  var sea=c.createLinearGradient(0,34.2*T,0,cv.height);sea.addColorStop(0,'#79c8ba');sea.addColorStop(1,'#418fae');c.fillStyle=sea;c.fillRect(0,34.2*T,cv.width,cv.height-34.2*T);
 }
 var shrubs=[];
 function shrubStamp(variant){
  if(shrubs[variant])return shrubs[variant];var cv=document.createElement('canvas');cv.width=176;cv.height=132;var c=cv.getContext('2d');c.scale(2,2);c.translate(44,58);var r=random(variant*63+12);
  ellipse(c,3,1,32,7,'#3b61382b');
  for(var i=0;i<34;i++){var a=r()*6.28,rad=Math.sqrt(r()),x=Math.cos(a)*29*rad,y=-14+Math.sin(a)*17*rad;c.save();c.translate(x,y);c.rotate((r()-.5)*2);var g=c.createRadialGradient(-3,-4,1,0,0,12);g.addColorStop(0,'#adc775');g.addColorStop(.45,'#79a550');g.addColorStop(1,'#477c45');c.fillStyle=g;c.beginPath();c.moveTo(-10,0);c.quadraticCurveTo(-3,-13,10,-1);c.quadraticCurveTo(6,9,-10,0);c.fill();c.restore()}
  var colors=['#efb4b6','#fff0c5','#dec678'];
  for(i=0;i<6;i++){var x=(r()-.5)*43,y=-11-r()*21;for(var j=0;j<5;j++){var a=j*6.28/5;ellipse(c,x+Math.cos(a)*3,y+Math.sin(a)*2.6,2.9,2.5,colors[variant%3])}ellipse(c,x,y,1.7,1.6,'#e7b954')}
  shrubs[variant]=cv;return cv;
 }
 window.IslandGarden={ground:ground,onReady:function(fn){ready=fn},shrub:function(c,x,y,variant){c.drawImage(shrubStamp(variant),x-44,y-58,88,66)}};
})();
