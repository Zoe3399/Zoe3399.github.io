/* Local scenery assets and material drawing. See assets/img/scenery/SOURCES.md. */
(function(){
 'use strict';
 var images={},files={tree:'hardwood-summer.png',shed:'wooden-storage.png',bench:'garden-bench.png',lamp:'streetlamp.png',house:'seungju-hanok.webp'};
 Object.keys(files).forEach(function(k){var im=new Image();im.src=(window.ISLAND_SCENERY_DATA||{})[k]||'assets/img/scenery/'+files[k];images[k]=im});
 var bounds={tree:[13,19,309,388],shed:[32,6,64,116],bench:[7,19,114,91],lamp:[56,11,16,109],house:[12,163,1232,898]};
 function create(c,font){
  var stamps=new Map(),stampScale=1.5;
  // Cache static material work once. A bounded cache avoids unbounded GPU memory.
  function stamp(key,x,y,bounds,draw){
   var cached=stamps.get(key);
   if(!cached){
    if(Object.keys(images).some(function(k){return !images[k].complete||!images[k].naturalWidth})){draw();return}
    var canvas=document.createElement('canvas');canvas.width=Math.ceil(bounds[2]*stampScale);canvas.height=Math.ceil(bounds[3]*stampScale);
    var live=c;c=canvas.getContext('2d');c.scale(stampScale,stampScale);c.translate(-x-bounds[0],-y-bounds[1]);
    try{draw()}finally{c=live}
    cached={canvas:canvas,bounds:bounds};if(stamps.size>=96)stamps.delete(stamps.keys().next().value);stamps.set(key,cached);
   }
   c.drawImage(cached.canvas,x+bounds[0],y+bounds[1],bounds[2],bounds[3]);
  }
  function oval(x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
  function box(x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
  function path(points,color,stroke,width){c.beginPath();points.forEach(function(p,i){i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])});c.closePath();if(color){c.fillStyle=color;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=width||1;c.stroke()}}
  function line(points,color,width){c.beginPath();points.forEach(function(p,i){i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])});c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
  function gradient(x,y,w,h,colors){var g=c.createLinearGradient(x,y,x+w,y+h);colors.forEach(function(s,i){g.addColorStop(i/(colors.length-1),s)});return g}
  function shadow(x,y,rx,ry){var g=c.createRadialGradient(x,y,0,x,y,rx);g.addColorStop(0,'#25442142');g.addColorStop(1,'#25442100');oval(x,y,rx,ry||rx*.28,g);oval(x,y,rx*.58,(ry||rx*.28)*.52,'#2e4d2720')}
  function sprite(key,x,y,height){var im=images[key],b=bounds[key];if(!im.complete||!im.naturalWidth)return false;var w=height*b[2]/b[3];c.drawImage(im,b[0],b[1],b[2],b[3],x-w/2,y-height,w,height);return true}
  function grain(x,y,w,h,vertical,seed){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(var i=0;i<25;i++){var q=(Math.sin(i*47+seed)*.5+.5);if(vertical)line([[x+q*w,y],[x+q*w+Math.sin(i)*2,y+h*.5],[x+q*w-1,y+h]],i%3?'#55351c16':'#ffe2ab24',.6);else line([[x,y+q*h],[x+w*.45,y+q*h+Math.sin(i)*2],[x+w,y+q*h]],i%3?'#55351c20':'#ffe2ab36',.7)}c.restore()}
  function timber(x,y,w,h,vertical){box(x,y+3,w,h,3,'#765134');box(x,y,w,h,3,gradient(x,y,w,vertical?0:h,['#dfbb83','#b48751','#977043']));grain(x,y,w,h,vertical,x+y);line([[x+2,y+1],[x+w-2,y+1]],'#f3d4a0aa',1)}
  function label(text,x,y,width){c.font='15px '+font;c.textAlign='center';c.textBaseline='middle';var w=width||c.measureText(text).width+24;box(x-w/2,y-12,w,26,8,'#533e2540');box(x-w/2,y-14,w,25,8,'#fff7de');c.fillStyle='#566548';c.fillText(text,x,y-1)}
  function tree(o,t){
   var x=o.x*40,y=o.sy*40,s=o.s,h=195*s;shadow(x+9,y+3,62*s,20*s);c.save();c.translate(x,y);c.transform(1,0,Math.sin(t*.7+o.x)*.008,1,0,0);
   c.filter='saturate(.88) brightness(1.06)';if(!sprite('tree',0,2,h)){c.restore();return false}c.filter='none';
   if(o.fruit){[[-34,-98],[35,-110],[3,-151]].forEach(function(p,i){var fx=p[0]*s,fy=p[1]*s,r=7.5*s;oval(fx+2,fy+2,r,r,'#173c2638');var red=o.fruit==='#E4473C';oval(fx,fy,r,r*1.04,gradient(fx-r,fy-r,r*2,r*2,red?['#f8a578','#df5945','#a23f32']:['#ecdf79','#bad061','#6f963c']));line([[fx,fy-r*.8],[fx+1,fy-r*1.45]],'#6b5137',1.7*s);oval(fx+4*s,fy-r*1.15,4*s,1.8*s,'#5a8e42');oval(fx-r*.32,fy-r*.3,2*s,3*s,'#ffffff42')})}
   c.restore();return true;
  }
  function tent(x,y){
   shadow(x+8,y+7,124,26);
   path([[-115,-12],[-21,-159],[34,-140],[119,-7],[35,7]],'#ba9650');
   path([[-115,-12],[-21,-159],[34,-140],[-54,1]],gradient(-110,-155,155,120,['#eed998','#d6b86f','#b5914b']));
   path([[-54,1],[34,-140],[119,-7]],gradient(-40,-120,140,120,['#ffeaa7','#f0cf78','#dcad52']));
  }
  function drawTent(x,y){c.save();c.translate(x,y);tent(0,0);
   path([[7,-68],[34,-111],[76,-6],[-17,-5]],'#574d36');path([[34,-111],[40,-25],[76,-6]],gradient(30,-80,48,60,['#f8df98','#dcb263']));
   line([[-112,-12],[-21,-156],[33,-139],[117,-7]],'#fff0bb',2);line([[-53,0],[34,-138]],'#fff1bb',2);
   for(var i=0;i<5;i++){var xx=-98+i*23;line([[xx,-15],[xx+43,-84+i*7]],'#886b2920',1)}
   line([[-77,-59],[-146,-3]],'#826b43',1.3);line([[98,-48],[140,4]],'#826b43',1.3);
   [[-146,-3],[140,4]].forEach(function(p){oval(p[0],p[1]+1,4,2,'#5b4f3130');line([[p[0],p[1]-5],[p[0],p[1]+1]],'#b39970',3)});
   timber(-13,-95,62,20,false);c.font='12px '+font;c.fillStyle='#fff6de';c.textAlign='center';c.textBaseline='middle';c.fillText('승주의 집',18,-85);
   oval(45,-38,1.5,2,'#aa8550');c.restore();
  }
  function shed(x,y){shadow(x,y+1,29,8);c.save();c.translate(x,y);sprite('shed',0,0,98);label('도구 창고',0,-116,90);c.restore()}
  function house(x,y){shadow(x+3,y+1,119,16);if(!sprite('house',x,y,208))drawTent(x,y)}
  function bench(x,y){shadow(x,y+1,37,10);sprite('bench',x,y,55)}
  function lamp(x,y,night){shadow(x+2,y+2,10,4);sprite('lamp',x,y,101);if(night){oval(x,y-87,3.5,5,'#ffecb6');var glow=c.createRadialGradient(x,y-87,0,x,y-87,17);glow.addColorStop(0,'#ffecad55');glow.addColorStop(1,'#ffecad00');oval(x,y-87,17,20,glow)}}
  function board(x,y){
   c.save();c.translate(x,y);shadow(7,3,82,18);timber(-65,-82,10,83,true);timber(55,-82,10,83,true);
   box(-78,-115,156,85,5,'#765130');box(-74,-113,148,78,5,gradient(-74,-110,145,70,['#ba8e55','#9f7648']));grain(-74,-113,148,78,false,15);
   box(-65,-105,130,59,3,'#d4bc86');grain(-65,-105,130,59,false,22);
   [[-45,-94,-.07,'#fffae9'],[-7,-96,.07,'#f7df91'],[34,-91,-.09,'#f1d3c6']].forEach(function(p){c.save();c.translate(p[0],p[1]);c.rotate(p[2]);box(-16,2,32,43,1,'#6b533125');box(-16,0,32,42,1,p[3]);for(var i=0;i<4;i++)line([[-10,13+i*6],[i===3?5:10,13+i*6]],'#a1927766',1.3);oval(0,3,2.5,2.5,'#b05745');c.restore()});
   path([[-88,-112],[-68,-136],[65,-136],[87,-112],[80,-106],[-82,-106]],'#365b4b');path([[-88,-114],[-68,-137],[65,-137],[86,-114]],gradient(0,-140,0,28,['#849b70','#4f775c','#456d52']));
   for(var i=-65;i<70;i+=13)line([[i,-134],[i+8,-114]],'#d9df9e35',1);line([[-84,-111],[82,-111]],'#b1bc82',2);
   label('게시판',0,-154,77);c.restore();
  }
  function mailbox(x,y){c.save();c.translate(x,y);shadow(3,2,17,6);timber(-4,-43,8,44,true);path([[-19,-43],[-19,-64],[-10,-75],[15,-74],[23,-64],[23,-41]],'#466e62');box(-19,-68,35,26,9,gradient(-19,-68,35,22,['#9bac82','#6d8c71','#496e5d']));path([[12,-68],[23,-64],[23,-42],[12,-42]],'#496957');line([[-14,-51],[7,-51]],'#365344',2.5);line([[17,-76],[17,-55]],'#856d47',2);box(17,-77,10,7,1,'#be6c4e');oval(-12,-61,2,3,'#dee5b95c');c.restore()}
  function diary(x,y){c.save();c.translate(x,y);shadow(5,2,45,12);timber(-32,-25,7,26,true);timber(24,-25,7,26,true);path([[-41,-28],[-28,-39],[39,-39],[45,-29]],'#deb784');timber(-41,-28,86,10,false);for(var i=0;i<3;i++)line([[-32+i*23,-38],[-39+i*23,-29]],'#b38b58',.8);
   path([[-24,-30],[-22,-43],[-3,-45],[3,-41],[22,-43],[22,-29],[2,-26]],'#926655');path([[-23,-32],[-21,-44],[-3,-46],[1,-42],[20,-44],[20,-31],[1,-28]],'#fff9df');line([[1,-42],[1,-28]],'#baa886',1);for(var j=0;j<3;j++){line([[-18,-40+j*3],[-5,-41+j*3]],'#b8b498',.7);line([[6,-38+j*3],[16,-39+j*3]],'#b8b498',.7)}
   box(27,-46,10,12,3,'#ac7754');oval(32,-47,6,2,'#d7ad7d');line([[32,-47],[32,-60]],'#608252',1.6);oval(29,-57,4,2.5,'#739b58');oval(35,-61,4,2.5,'#99b875');line([[14,-30],[25,-43]],'#5b6a56',2);label('일기장',0,-67,75);c.restore()}
  function fence(f,which){var X=f.x*40,Y=(which==='top'?f.y:f.y+f.h)*40,end=(f.x+f.w)*40,gate=(which==='top'?f.gateSide==='t':f.gateSide==='b');
   function span(a,b){[11,24].forEach(function(h){timber(a,Y-h,b-a,6,false)});for(var x=a;x<=b+.1;x+=40)post(Math.min(x,b),Y);if((b-a)%40>1)post(b,Y)}
   if(gate){span(X,f.gate[0]*40);span(f.gate[1]*40,end)}else span(X,end);
  }
  function post(x,y){shadow(x+2,y+1,7,2.5);timber(x-5,y-34,10,35,true);path([[x-5,y-34],[x,y-39],[x+5,y-34]],'#e1bf88');oval(x,y-23,1,1,'#7b6544');oval(x,y-10,1,1,'#7b6544')}
  function leaf(x,y,w,h,angle,color){c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=gradient(-w,-h,w*2,h*2,['#a3bd69',color||'#5a8c43','#3e7039']);c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(0,-h*2,w,0);c.quadraticCurveTo(0,h*1.3,-w,0);c.fill();line([[-w*.65,0],[w*.7,0]],'#c6d98c50',.7);c.restore()}
  function flower(x,y,color,t,phase){var sway=Math.sin(t*1.3+phase)*1.2;line([[x,y],[x+sway,y-15]],'#4a793b',1.5);leaf(x-3,y-5,4,2,-.5);leaf(x+3,y-9,4,2,.6);for(var i=0;i<7;i++){var a=i/7*Math.PI*2;c.save();c.translate(x+sway+Math.cos(a)*3,y-17+Math.sin(a)*2);c.rotate(a);oval(2,0,4,2.2,gradient(-2,-2,6,4,['#fff9eb',color,color]));c.restore()}oval(x+sway,y-17,2.1,1.5,'#dcc374')}
  function crop(type,x,y,t,phase){
   var sway=Math.sin(t*1.2+phase*6)*1.1;shadow(x,y+1,10,3);
   if(type==='flower'){flower(x,y,['#e39cb2','#e6c757','#b89ac6'][Math.floor(phase*3)%3],t,phase);return}
   if(type==='sprout'||type==='carrot'){line([[x,y],[x+sway,y-13]],'#507d37',2);[-1,1].forEach(function(a){leaf(x+a*5+sway,y-12,7,3,a*.6)});if(type==='carrot'){oval(x,y-1,5,3,gradient(x-4,y-5,8,5,['#f8be63','#df8b33']));leaf(x+sway,y-17,3,6,0)}return}
   if(type==='wheat'){[-5,0,5].forEach(function(dx){line([[x+dx,y],[x+dx+sway,y-22]],'#8e9d4e',1.4);for(var j=0;j<4;j++){oval(x+dx+sway-1.5,y-15-j*2.3,2.2,2.3,j%2?'#c4a14b':'#e6ca75');oval(x+dx+sway+1.5,y-16-j*2.3,2.2,2.2,'#ebd692')}line([[x+dx+sway,y-24],[x+dx+sway,y-27]],'#d4b563',.7)});return}
   if(type==='pumpkin'){leaf(x-8,y-6,8,4,-.2);leaf(x+8,y-7,7,4,.3);oval(x,y-7,11,9,gradient(x-10,y-16,20,18,['#f4be65','#e99a3e','#b97630']));[-5,0,5].forEach(function(dx){c.strokeStyle='#bd762e70';c.lineWidth=1;c.beginPath();c.ellipse(x+dx*.6,y-7,4,8,0,-1.3,1.3);c.stroke()});line([[x,y-16],[x+1,y-21]],'#678248',3);return}
   line([[x,y],[x+sway,y-23]],'#477739',2);[[-7,-15,-.4],[7,-20,.6],[5,-7,.3]].forEach(function(p){leaf(x+p[0]+sway,y+p[1],6,3,p[2])});[[-5,-13],[5,-19],[3,-5]].forEach(function(p){oval(x+p[0]+sway,y+p[1],5.3,5.1,gradient(x+p[0]-4,y+p[1]-5,8,9,['#f3aa75','#d6593e','#a34132']));leaf(x+p[0]+sway,y+p[1]-5,3,1.2,0);oval(x+p[0]-1.5+sway,y+p[1]-2,1.1,1.4,'#ffd3a870')});
  }
  function screen(x,y){c.save();c.translate(x,y);shadow(8,2,137,24);timber(-127,-115,9,117,true);timber(119,-115,9,117,true);box(-135,-141,270,109,5,'#585446');box(-130,-137,260,100,3,'#f4edda');box(-123,-130,246,87,1,gradient(0,-130,0,87,['#d4ddce','#ece8d6','#f7edd9']));line([[-134,-143],[133,-143]],'#817d60',4);line([[-134,-35],[133,-35]],'#b8af88',3);line([[0,-34],[0,-26]],'#8b8466',1);oval(0,-25,2,2,'#8b8466');oval(0,-86,19,19,'#ffffff60');path([[-5,-98],[12,-86],[-5,-74]],'#698874');label('야외 영화관',0,-164,119);c.restore()}
  function sign(x,y,text,sub){c.save();c.translate(x,y);c.font='21px '+font;var w=Math.max(c.measureText(text).width+32,130);shadow(6,2,w*.46,12);timber(-w/2+18,-55,9,56,true);timber(w/2-27,-55,9,56,true);box(-w/2-2,-111,w+4,61,6,'#705037');timber(-w/2,-111,w,27,false);timber(-w/2,-81,w,27,false);c.fillStyle='#fff6df';c.font='21px '+font;c.textAlign='center';c.textBaseline='middle';c.fillText(text,0,-96);c.font='12px '+font;c.fillStyle='#fff1cf';c.fillText(sub||'',0,-68);[[-w/2+7,-102],[w/2-7,-62]].forEach(function(p){oval(p[0],p[1],1.5,1.5,'#725737')});c.restore();return y-111}
  // Set prop sizes in relation to the 108-unit villager, with feet fixed to
  // their ground anchors. Scale labels together with their objects.
  function sized(draw,scale){return function(x,y){c.save();c.translate(x,y);c.scale(scale,scale);draw(0,0);c.restore()}}
  function cachedProp(key,draw,bounds){return function(x,y){stamp(key,x,y,bounds,function(){draw(x,y)})}}
  function cachedTree(o,t){
   if(!images.tree.complete||!images.tree.naturalWidth)return false;
   c.save();c.translate(o.x*40,o.sy*40);c.scale(o.s,o.s);c.transform(1,0,Math.sin(t*.7+o.x)*.008,1,0,0);
   stamp('tree:'+o.fruit,0,0,[-95,-200,195,226],function(){tree({x:0,sy:0,s:1,fruit:o.fruit},0)});c.restore();return true;
  }
  function cachedFlower(x,y,color,t,phase){c.save();c.translate(x,y);c.rotate(Math.sin(t*1.3+phase)*.025);stamp('flower:'+color,0,0,[-12,-25,24,30],function(){flower(0,0,color,0,0)});c.restore()}
  function cachedCrop(type,x,y,t,phase){c.save();c.translate(x,y);c.rotate(Math.sin(t*1.2+phase*6)*.018);var variant=Math.floor(phase*3)%3;stamp('crop:'+type+':'+variant,0,0,[-20,-32,40,40],function(){crop(type,0,0,0,variant/3)});c.restore()}
  function cachedFence(f,which){var x=f.x*40,y=(which==='top'?f.y:f.y+f.h)*40;stamp('fence:'+f.id+':'+which,x,y,[-10,-42,f.w*40+20,51],function(){fence(f,which)})}
  function cachedSign(x,y,text,sub){c.font='21px '+font;var w=Math.max(c.measureText(text).width+32,130);c.save();c.translate(x,y);c.scale(.8,.8);stamp('sign:'+text+':'+sub,0,0,[-w/2-9,-115,w+18,135],function(){sign(0,0,text,sub)});c.restore();return y-89}
  return {tree:cachedTree,house:cachedProp('hanok',house,[-150,-212,300,236]),tent:cachedProp('tent',drawTent,[-154,-165,309,205]),shed:shed,bench:bench,lamp:lamp,board:cachedProp('board',sized(board,.78),[-78,-136,156,156]),mailbox:cachedProp('mailbox',sized(mailbox,.8),[-24,-65,51,78]),diary:cachedProp('diary',sized(diary,.9),[-48,-76,96,93]),fence:cachedFence,post:post,sign:cachedSign,grain:grain,shadow:shadow,timber:timber,flower:cachedFlower,crop:cachedCrop,screen:cachedProp('screen',sized(screen,.8),[-116,-146,232,174])};
 }
 window.IslandScenery={create:create,images:images};
})();
