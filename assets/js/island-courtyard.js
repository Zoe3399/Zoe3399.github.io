/* The title artwork is also the playable world. Coordinates refer to its floor. */
(function(root){
 'use strict';
 var width=2160,height=2160*941/1672;
 var floor=[[.24,.45],[.39,.42],[.43,.27],[.54,.22],[.65,.24],[.70,.34],[.72,.49],[.75,.60],[.73,.74],[.62,.82],[.53,.90],[.45,.91],[.39,.80],[.33,.75],[.29,.60],[.24,.54]];
 var places={home:[.285,.465], 'sec:work':[.46,.49],'sec:projects':[.64,.66],'sec:plans':[.48,.38],others:[.655,.475],diary:[.52,.36],skills:[.365,.65],video:[.61,.82],mail:[.405,.445],welcome:[.51,.67],star:[.69,.63]};
 var markers=[['home','주민 소개']];
  var furniture=[
  {n:0,x:.365,y:.61,h:220,id:'skills',label:'도구 창고'},
  {n:1,x:.71,y:.62,h:220},
  {n:2,x:.655,y:.435,h:185,id:'others',label:'게시판'},
  {n:3,x:.46,y:.45,h:105,id:'sec:work',label:'작업실'},
  {n:3,x:.64,y:.62,h:105,id:'sec:projects',label:'AI 프로젝트'},
  {n:4,x:.59,y:.775,h:175,id:'video',label:'야외 영화관'},
  {n:5,x:.52,y:.32,h:112,id:'diary',label:'일기장'},
  {n:6,x:.405,y:.405,h:120,id:'mail',label:'연락하기'},
  {n:7,x:.70,y:.76,h:95}
 ];
 var background=new Image();background.src='assets/img/title/hanok-game.webp';
 function camera(w,h,x,y){
  var s=Math.max(w/width,h/height),hw=w/s/2,hh=h/s/2;
  var cx=Math.max(hw,Math.min(width-hw,x)),cy=Math.max(hh,Math.min(height-hh,y));
  return {width:w,height:h,scale:s,x:cx,y:cy,ox:w/2-cx*s,oy:h/2-cy*s};
 }
 function project(c,x,y){return {x:c.ox+x*c.scale,y:c.oy+y*c.scale}}
 function unproject(c,x,y){return {x:(x-c.ox)/c.scale,y:(y-c.oy)/c.scale}}
 function inside(x,y){
  x=x*40/width;y=y*40/height;var hit=false;
  for(var i=0,j=floor.length-1;i<floor.length;j=i++){
   var a=floor[i],b=floor[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
  }return hit;
 }
 function blocked(x,y){if(!inside(x-.18,y)||!inside(x+.18,y)||!inside(x,y-.12)||!inside(x,y+.12))return true;return furniture.some(function(o){var half=o.n===1?6:o.n===6?12:o.n===8?22:o.h*.30;return Math.abs(x*40-o.x*width)<half+6&&y*40>o.y*height-13&&y*40<o.y*height+3})}
 function configure(inter,player,solids){
  solids.length=0;
  inter.forEach(function(it){
   var group=places[it.id]?it.id:it.id.indexOf('work-')===0?'sec:work':it.id.indexOf('proj-')===0?'sec:projects':it.id.indexOf('etc-')===0?'sec:plans':'welcome';
   var p=places[group];it.x=it.tx=p[0]*width/40;it.y=it.ty=p[1]*height/40;it.r=it.kind==='item'?0:1.55;
  });
  // Start on clear lawn, separated from the cinema and the bottom navigation.
  player.x=.49*width/40;player.y=.60*height/40;player.dir='down';
 }
 function markerRects(c,ctx,font){
  ctx.font='15px '+font;
  return markers.map(function(m){var p=places[m[0]],q=project(c,p[0]*width,p[1]*height);return {id:m[0],text:m[1],x:q.x,y:q.y-12,w:Math.max(92,ctx.measureText(m[1]).width+28),h:32}});
 }
  function hit(c,ctx,font,x,y){
  var tag=markerRects(c,ctx,font).find(function(r){return x>=r.x-r.w/2-7&&x<=r.x+r.w/2+7&&y>=r.y-r.h/2-7&&y<=r.y+r.h/2+7});if(tag)return tag;
  return furniture.slice().sort(function(a,b){return b.y-a.y}).find(function(o){if(!o.id)return false;var p=project(c,o.x*width,o.y*height),h=o.h*c.scale,w=h*window.HanokProps.ratio(o.n);return x>=p.x-w/2&&x<=p.x+w/2&&y>=p.y-h&&y<=p.y+24});
 }
 function render(ctx,c,dpr,player,night,time,font,drawPlayer,near,target){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#9ab86b';ctx.fillRect(0,0,c.width,c.height);
  if(background.complete&&background.naturalWidth)ctx.drawImage(background,c.ox,c.oy,width*c.scale,height*c.scale);
  if(night){ctx.fillStyle='#152d526b';ctx.fillRect(0,0,c.width,c.height);
   [[.20,.31,90],[.127,.61,38]].forEach(function(l){var p=project(c,l[0]*width,l[1]*height),r=l[2]*c.scale,g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'#ffe6a238');g.addColorStop(1,'#ffe6a200');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill()});
  }
  if(target){var aim=project(c,target.x*40,target.y*40);ctx.strokeStyle='#fff8d9aa';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(aim.x,aim.y,9,4,0,0,7);ctx.stroke()}
  var layers=furniture.slice();layers.push({actor:true,y:player.y*40/height});layers.sort(function(a,b){return a.y-b.y});
  layers.forEach(function(o){
   // The painted world uses a parallel camera: keep the villager's scale stable.
   if(o.actor){var p=project(c,player.x*40,player.y*40),size=1.55*c.scale;ctx.save();ctx.translate(p.x,p.y);ctx.scale(size,size);drawPlayer(time);ctx.restore();return}
   var p=project(c,o.x*width,o.y*height),h=o.h*c.scale;
   ctx.save();ctx.translate(p.x,p.y);ctx.scale(c.scale,c.scale);
   ctx.fillStyle='#39533328';ctx.beginPath();ctx.ellipse(4,1,o.n===1?8:o.h*.35,o.n===1?3:6,0,0,7);ctx.fill();
   window.HanokProps.draw(ctx,o.n,0,0,o.h);
   if(night&&o.n===1){var glow=ctx.createRadialGradient(-o.h*.25,-o.h*.59,0,-o.h*.25,-o.h*.59,40);glow.addColorStop(0,'#ffe9aa70');glow.addColorStop(1,'#ffe9aa00');ctx.fillStyle=glow;ctx.fillRect(-o.h*.25-40,-o.h*.59-40,80,80)}
   if(o.n===3){ctx.fillStyle='#4f412d';ctx.font='16px '+font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.label,0,-o.h*.60)}
   if(o.n===0){ctx.fillStyle='#54462f';ctx.font='9px '+font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.label,0,-o.h*.55)}ctx.restore();
   if(o.id&&o.n!==3){ctx.font='13px '+font;var w=ctx.measureText(o.label).width+18;ctx.fillStyle='#fff9e9ef';ctx.beginPath();ctx.roundRect(p.x-w/2,p.y+4,w,23,11);ctx.fill();ctx.fillStyle='#496449';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(o.label,p.x,p.y+15)}
  });
  markerRects(c,ctx,font).forEach(function(r){
   var point=places[r.id];if(Math.hypot(player.x-point[0]*width/40,player.y-point[1]*height/40)<1.7)return;
   if(r.x< -r.w||r.x>c.width+r.w||r.y<80||r.y>c.height-125)return;
   ctx.fillStyle='#fff9e9ee';ctx.strokeStyle='#a4ac7caa';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(r.x-r.w/2,r.y-r.h/2,r.w,r.h,16);ctx.fill();ctx.stroke();ctx.fillStyle='#486447';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(r.text,r.x,r.y);
  });
 }
 var api={camera:camera,project:project,unproject:unproject,blocked:blocked,configure:configure,render:render,hit:hit,places:places,width:width,height:height};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.IslandCourtyard=api;
})(typeof window!=='undefined'?window:globalThis);
