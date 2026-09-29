/* Frame-rate independent movement and a ground-plane camera for the island. */
(function(root){
 'use strict';
 function approach(value,target,rate,dt){return value+(target-value)*(1-Math.exp(-rate*dt))}
 function camera(width,height,zoom,x,y){return {width:width,height:height,zoom:zoom,x:x,y:y,anchor:height*.60,tilt:.80,focal:height*.50/(zoom*.80)}}
 function project(c,x,y){var depth=y-c.y,denom=1-depth/c.focal;if(denom<=.08)return null;var scale=1/denom;return {x:c.width/2+(x-c.x)*c.zoom*scale,y:c.anchor+depth*c.zoom*c.tilt*scale,scale:scale}}
 function unproject(c,x,y){var offset=(y-c.anchor)/(c.zoom*c.tilt),denom=1+offset/c.focal;if(denom<=.015)return null;var depth=offset/denom,scale=1/(1-depth/c.focal);return {x:c.x+(x-c.width/2)/(c.zoom*scale),y:c.y+depth}}
 function move(p,input,dt,blocked){
  dt=Math.min(dt,.05);var length=Math.hypot(input.x,input.y),speed=input.run?4.2:2.4;
  var dx=length?input.x/length:0,dy=length?input.y/length:0,rate=length?15:23;
  p.vx=approach(p.vx||0,dx*speed,rate,dt);p.vy=approach(p.vy||0,dy*speed,rate,dt);
  if(!length&&Math.hypot(p.vx,p.vy)<.025){p.vx=0;p.vy=0}
  var oldX=p.x,oldY=p.y,nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;
  if(!blocked(nx,p.y))p.x=nx;else p.vx=0;
  if(!blocked(p.x,ny))p.y=ny;else p.vy=0;
  var distance=Math.hypot(p.x-oldX,p.y-oldY);p.moving=distance>.0001;
  p.speed=distance/Math.max(dt,.001);
  p.runBlend=approach(p.runBlend||0,input.run&&length?1:0,12,dt);
  p.running=p.runBlend>.5&&p.speed>2.6;
  p.stride=(p.stride||0)+distance*(Math.PI*2/(1.6+.8*p.runBlend));
  p.walkBlend=approach(p.walkBlend||0,p.moving?1:0,18,dt);
  if(length){
   if(Math.abs(dx)>Math.abs(dy)*1.12)p.dir=dx>0?'right':'left';
   else if(Math.abs(dy)>Math.abs(dx)*1.12)p.dir=dy>0?'down':'up';
   else {
    // Keep a compatible diagonal facing; never retain a direction opposite input.
    var horizontal=dx>0?'right':'left',vertical=dy>0?'down':'up';
    if(p.dir!==horizontal&&p.dir!==vertical)p.dir=horizontal;
   }
  }
  return distance;
 }
 var api={approach:approach,camera:camera,project:project,unproject:unproject,move:move};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.IslandMotion=api;
})(typeof window!=='undefined'?window:globalThis);
