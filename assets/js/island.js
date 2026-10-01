
(function(){
'use strict';
var T=40, W=54, H=40;
var cv=document.getElementById('game'), ctx=cv.getContext('2d');
var FONT="'Jua','Noto Sans KR',sans-serif";

/* ---------------- content data ---------------- */
var WORK=[
 ['work-app','TripDoc 앱','외국인 의료관광 앱 UI/UX 기획',0,'tomato'],
 ['work-skill','Claude Skill','업무별 AI 지침 구축',0,'wheat'],
 ['work-edu','AI 교육','사내 AI 활용 교육·가이드',0,'carrot'],
 ['work-admin','관리자 페이지','Next.js 재기획·풀스택 개발',0,'pumpkin'],
 ['work-itium','아이티움','치료사 플랫폼 운영·고도화',0,'tomato'],
 ['work-multilang','다국어 소개서','AI 번역·현지화 회사 소개서',0,'flower'],
 ['work-biz','신사업 기획','사업성 분석·공간 콘텐츠 기획',0,'wheat']
];
var PROJ=[
 ['proj-mfg','제조 품질 예측','F1-score 0.615 → 0.941',0,'wheat'],
 ['proj-power','생산지수 예측','우수상 · R² 0.6332',1,'carrot'],
 ['proj-elderly','교통사고 위험','최우수상 · 공공데이터',1,'tomato'],
 ['proj-cellu','Cellu 혈당','우수상 · PPG 딥러닝 앱',1,'pumpkin'],
 ['proj-retail','수요 예측','우수상 · 유통데이터 경진대회',1,'flower'],
 ['proj-onebin','OneBin','최우수상 · 자율주행 쓰레기통',1,'tomato']
];
var PLAN=[
 ['etc-bioseptic','BioSeptic','패혈증 조기 예측 AI 기획',0,'sprout'],
 ['etc-aicl','화재 대피','AI 센서 화재 대피 시스템',0,'sprout']
];
var ALL={};[WORK,PROJ,PLAN].forEach(function(a){a.forEach(function(r){ALL[r[0]]=r})});

/* ---------------- world ---------------- */
var solids=[], objs=[], inter=[], flowers=[], lamps=[];
function solid(x,y,w,h){solids.push({x:x,y:y,w:w,h:h})}
function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280}}
var R=rng(7);

// water & bounds
solid(-1,-1,W+2,1);solid(-1,-1,1,H+2);solid(W,-1,1,H+2);solid(-1,34.6,W+2,10);

// paths (drawn on ground)
var paths=[[4,15,46,1.2],[26.4,7.6,1.2,24],[12.4,13,1.2,2.2],[40.4,13,1.2,2.2],[10.4,16,1.2,3],[21,16,1.2,4.2],[35.4,16,1.2,3.2],[44.4,16,1.2,4],[26.4,24,21,1.2],[26.4,31,1.2,1.4]];

// fields
var FIELDS=[
 {id:'work',name:'작업실 밭',sub:'실무 주요 결과물',x:4,y:4,w:17,h:9,gate:[12,14.2],gateSide:'b',items:WORK,cols:4,pw:3,ph:2,sign:[10,14.3]},
 {id:'projects',name:'AI 프로젝트 밭',sub:'AI·데이터 프로젝트',x:33,y:4,w:17,h:9,gate:[40,42.2],gateSide:'b',items:PROJ,cols:3,pw:4,ph:2,sign:[45.5,14.3]},
 {id:'plans',name:'새싹 밭',sub:'기획안 · 구현 전',x:5,y:19.5,w:12,h:7.5,gate:[10,12.2],gateSide:'t',items:PLAN,cols:2,pw:4,ph:2.2,sign:[7.2,18.7]}
];
FIELDS.forEach(function(f){
  // fences with gate
  var g0=f.gate[0],g1=f.gate[1];
  function hline(y,gate){ if(gate){solid(f.x,y-0.15,g0-f.x,0.3);solid(g1,y-0.15,f.x+f.w-g1,0.3)} else solid(f.x,y-0.15,f.w,0.3)}
  hline(f.y,f.gateSide==='t');hline(f.y+f.h,f.gateSide==='b');
  solid(f.x-0.15,f.y,0.3,f.h);solid(f.x+f.w-0.15,f.y,0.3,f.h);
  objs.push({y:f.y,kind:'fenceTop',f:f});objs.push({y:f.y+f.h+0.2,kind:'fenceBottom',f:f});
  objs.push({y:f.y+f.h,kind:'fenceSides',f:f});
  // patches
  var n=f.items.length, cols=f.cols, rows=Math.ceil(n/cols);
  var gapX=(f.w-cols*f.pw)/(cols+1), innerH=f.h-(f.gateSide==='t'?1.4:0.4);
  var rowH=(innerH-0.6)/rows, top=f.y+(f.gateSide==='t'?1.6:0.9);
  f.patches=[];
  f.items.forEach(function(it,i){
    var c=i%cols,r=Math.floor(i/cols);
    var px=f.x+gapX+c*(f.pw+gapX), py=top+r*rowH;
    var p={x:px,y:py,w:f.pw,h:f.ph,item:it,field:f};
    f.patches.push(p);
    solid(px,py+0.3,f.pw,f.ph-0.3);
    var sx=px+f.pw/2, sy=py+f.ph+0.55;
    solid(sx-0.2,sy-0.2,0.4,0.3);
    objs.push({y:py+f.ph,kind:'patch',p:p});
    objs.push({y:sy,kind:'miniSign',x:sx,sy:sy,label:it[1],award:it[3]});
    inter.push({x:sx,y:sy+0.5,r:1.5,id:it[0],label:(f.id==='plans'?'새싹 · ':'')+it[1]+' 살펴보기',kind:'item',tx:sx,ty:sy+1.1});
  });
  var s=f.sign; solid(s[0]-0.6,s[1]-0.2,1.2,0.3);
  objs.push({y:s[1],kind:'bigSign',x:s[0],sy:s[1],label:f.name,sub:f.sub});
  inter.push({x:s[0],y:s[1]+0.4,r:1.6,id:'sec:'+f.id,label:f.name+' 안내판 읽기',kind:'section',tx:s[0],ty:s[1]+(f.gateSide==='t'?0.4:1.1)});
});

// tent (home) + mailbox + welcome sign
var TENT={x:24.4,y:3.6,w:5.2,h:3.8};
solid(TENT.x-0.4,TENT.y+1.2,TENT.w+0.8,TENT.h-1.4);
objs.push({y:TENT.y+TENT.h,kind:'tent'});
inter.push({x:27,y:7.9,r:1.6,id:'home',label:'승주의 한옥 들어가기',kind:'home',tx:27,ty:8.6});
solid(31.2,6.6,0.6,0.5);objs.push({y:7.1,kind:'mailbox',x:31.5,sy:7.1});
inter.push({x:31.5,y:7.6,r:1.4,id:'mail',label:'우편함 · 연락하기',kind:'mail',tx:31.5,ty:8.3});
solid(28.9,11.3,0.3,0.3);objs.push({y:11.6,kind:'bigSign',x:29.6,sy:11.6,label:'주섬주섬',sub:'안내도'});
inter.push({x:29.6,y:12,r:1.5,id:'welcome',label:'섬 안내도 보기',kind:'welcome',tx:29.6,ty:12.7});
// diary desk (blog)
solid(22.3,10.9,1.6,0.8);objs.push({y:11.7,kind:'diary',x:23.1,sy:11.7});
inter.push({x:23.1,y:12.1,r:1.5,id:'diary',label:'승주의 일기장 (블로그)',kind:'diary',tx:23.1,ty:12.8});

// tool shed
var SHED={x:19.2,y:19.6,w:4,h:3.4};solid(19.875,21.95,2.65,1.2);
objs.push({y:SHED.y+SHED.h,kind:'shed'});
inter.push({x:21.2,y:23.4,r:1.5,id:'skills',label:'도구 창고 · 보유 기술',kind:'tpl',tx:21.6,ty:24.1});
// bulletin board
solid(33.9,19.2,3,.4);objs.push({y:19.6,kind:'board',x:35.4,sy:19.6});
inter.push({x:35.4,y:20.2,r:1.7,id:'others',label:'게시판 · 수상 기록·대외활동',kind:'tpl',tx:35.4,ty:20.9});
// cinema
solid(42.3,18.8,5.4,.6);objs.push({y:19.4,kind:'screen'});
[[43,21.4],[45,21.4],[47,21.4]].forEach(function(b){solid(b[0]-0.6,b[1]-0.1,1.2,0.35);objs.push({y:b[1]+0.25,kind:'bench',x:b[0],sy:b[1]})});
inter.push({x:45,y:20.2,r:2.8,id:'video',label:'야외 영화관 · AI 영상',kind:'tpl',tx:45,ty:22.6});
// lamps
[[25,14],[29,17.4],[25,24.6],[33,15.9],[18,15.9],[39.3,24.2]].forEach(function(l){lamps.push(l);solid(l[0]-0.12,l[1]-0.12,0.24,0.24);objs.push({y:l[1],kind:'lamp',x:l[0],sy:l[1]})});
// telescope on beach for night vibes
solid(40,31.4,0.4,0.3);objs.push({y:31.7,kind:'telescope',x:40.2,sy:31.7});
inter.push({x:40.2,y:32,r:1.4,id:'star',label:'망원경 · 별 보기',kind:'star',tx:40.2,ty:32.6});

// trees
function tree(x,y,fruit){solid(x-0.3,y-0.35,0.6,0.35);objs.push({y:y,kind:'tree',x:x,sy:y,fruit:fruit,s:0.9+R()*0.25})}
for(var x=1;x<W;x+=2.1){tree(x+R()*0.4,1.6+R()*0.3,R()<.3?(R()<.5?'#E4473C':'#9ACD4A'):null)}
for(var y=3.5;y<31;y+=2.2){tree(1.2+R()*0.3,y,R()<.3?'#E4473C':null);tree(W-1.2-R()*0.3,y,R()<.3?'#9ACD4A':null)}
[[22.5,8.2,'#E4473C'],[32.8,9.8,null],[2.8,17],[18.5,27.5,'#9ACD4A'],[30.5,20,null],[31.5,27.5,'#E4473C'],[50,26.5],[4,29],[14,30],[49,30.5,'#E4473C'],[23.5,28.5]].forEach(function(t){tree(t[0],t[1],t[2]||null)});
// flowers
var FCOL=['#F4A6B8','#FFD66B','#FFFFFF','#F29B4B','#B58CE0','#E4473C'];
function freeAt(x,y){for(var i=0;i<solids.length;i++){var s=solids[i];if(x>s.x-0.6&&x<s.x+s.w+0.6&&y>s.y-0.6&&y<s.y+s.h+0.6)return false}for(i=0;i<paths.length;i++){var p=paths[i];if(x>p[0]-0.4&&x<p[0]+p[2]+0.4&&y>p[1]-0.4&&y<p[1]+p[3]+0.4)return false}
  for(i=0;i<FIELDS.length;i++){var f=FIELDS[i];if(x>f.x-0.3&&x<f.x+f.w+0.3&&y>f.y-0.3&&y<f.y+f.h+0.8)return false}
  if(Math.hypot(x-27,y-15.6)<4.2)return false; if(y>31.3)return false; return true}
for(var i=0;i<170;i++){var fx=2+R()*(W-4),fy=3+R()*28;if(freeAt(fx,fy))flowers.push([fx,fy,FCOL[Math.floor(R()*FCOL.length)],R()])}

var spawn={x:27,y:12.8};
var player={x:spawn.x,y:spawn.y,dir:'down',moving:false,t:0};

/* ---------------- ground prerender ---------------- */
var G=document.createElement('canvas');G.width=W*T;G.height=H*T;var g=G.getContext('2d');
function drawGround(night){
  g.fillStyle='#8CCB6A';g.fillRect(0,0,G.width,G.height);
  var r=rng(3);
  for(var i=0;i<2600;i++){var x=r()*G.width,y=r()*G.height;g.fillStyle=r()<.5?'rgba(255,255,255,.10)':'rgba(40,110,40,.13)';g.beginPath();g.moveTo(x,y);g.lineTo(x+5,y+8);g.lineTo(x-5,y+8);g.closePath();g.fill()}
  // plaza
  g.fillStyle='#E6BE8F';g.beginPath();g.arc(27*T,15.6*T,3.9*T,0,7);g.fill();
  g.strokeStyle='rgba(160,110,70,.35)';g.lineWidth=2;
  for(var rr=1;rr<4;rr++){g.beginPath();g.arc(27*T,15.6*T,rr*T,0,7);g.stroke()}
  for(var a=0;a<24;a++){var an=a/24*Math.PI*2;g.beginPath();g.moveTo(27*T+Math.cos(an)*T,15.6*T+Math.sin(an)*T);g.lineTo(27*T+Math.cos(an)*3.9*T,15.6*T+Math.sin(an)*3.9*T);g.stroke()}
  // paths
  paths.forEach(function(p){
    g.fillStyle='#EBCB93';roundRect(g,p[0]*T,p[1]*T,p[2]*T,p[3]*T,10);g.fill();
    var rp=rng(Math.floor(p[0]*7+p[1]*13));
    g.strokeStyle='rgba(170,120,70,.35)';g.lineWidth=1.5;
    for(var yy=p[1]*T+6;yy<(p[1]+p[3])*T-4;yy+=16)for(var xx=p[0]*T+6;xx<(p[0]+p[2])*T-4;xx+=18){g.beginPath();roundRectP(g,xx+rp()*3,yy+rp()*3,12+rp()*4,10+rp()*3,4);g.stroke()}
  });
  // field soil ground (inside fences slightly darker grass)
  FIELDS.forEach(function(f){g.fillStyle='rgba(60,120,40,.12)';g.fillRect(f.x*T,f.y*T,f.w*T,f.h*T)});
  // sand + sea base
  g.fillStyle='#F3E2B3';g.beginPath();g.moveTo(0,31.4*T);
  for(var x=0;x<=W;x+=1){g.lineTo(x*T,(31.4+Math.sin(x*0.7)*0.25)*T)}g.lineTo(W*T,H*T);g.lineTo(0,H*T);g.fill();
  g.fillStyle='#E9D39B';for(i=0;i<300;i++){g.fillRect(r()*G.width,(31.8+r()*2.8)*T,2,2)}
}
function roundRect(c,x,y,w,h,r){c.beginPath();roundRectP(c,x,y,w,h,r)}
function roundRectP(c,x,y,w,h,r){c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
drawGround();

/* ---------------- drawing helpers ---------------- */
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill()}
function shadow(x,y,rx){ellipse(x,y,rx,rx*0.35,'rgba(30,60,20,.22)')}
function drawTree(o){var x=o.x*T,y=o.sy*T,s=o.s;
  shadow(x,y,26*s);
  ctx.fillStyle='#9C6B43';roundRect(ctx,x-6*s,y-24*s,12*s,26*s,4);ctx.fill();
  ellipse(x,y-44*s,30*s,26*s,'#4E9A45');ellipse(x-14*s,y-38*s,18*s,16*s,'#4E9A45');ellipse(x+14*s,y-38*s,18*s,16*s,'#4E9A45');
  ellipse(x-4*s,y-54*s,20*s,14*s,'#63B455');ellipse(x+10*s,y-46*s,8*s,6*s,'#7CC56A');
  if(o.fruit){[[-14,-34],[12,-40],[0,-52],[18,-30]].forEach(function(d){ellipse(x+d[0]*s,y+d[1]*s,5*s,5*s,o.fruit)})}
}
function drawFence(f,which){ctx.save();
  function post(x,y){ctx.fillStyle='#E0A461';roundRect(ctx,x-4,y-22,8,24,3);ctx.fill();ctx.fillStyle='#C4854A';ctx.fillRect(x-4,y-22,8,4)}
  function rail(x1,x2,y){ctx.fillStyle='#E9B574';ctx.fillRect(x1,y-16,x2-x1,5);ctx.fillRect(x1,y-8,x2-x1,5)}
  var X=f.x*T,Y=f.y*T,Wd=f.w*T,Hd=f.h*T,g0=f.gate[0]*T,g1=f.gate[1]*T;
  function hrow(y,gate){ if(gate){rail(X,g0,y);rail(g1,X+Wd,y);for(var x=X;x<=g0+1;x+=T)post(Math.min(x,g0),y);for(x=g1;x<=X+Wd+1;x+=T)post(Math.min(x,X+Wd),y)}else{rail(X,X+Wd,y);for(var x2=X;x2<=X+Wd+1;x2+=T)post(Math.min(x2,X+Wd),y)} }
  if(which==='top')hrow(Y,f.gateSide==='t');
  if(which==='bottom')hrow(Y+Hd,f.gateSide==='b');
  if(which==='sides'){[X,X+Wd].forEach(function(x){ctx.fillStyle='#E9B574';ctx.fillRect(x-2,Y-12,5,Hd);for(var y=Y+T;y<Y+Hd;y+=T)post(x,y)})}
  ctx.restore()}
function drawCrop(type,x,y,t,ph){ // x,y bottom center px
  var sway=Math.sin(t*2+ph)*1.5;
  if(type==='tomato'){ctx.fillStyle='#3E8E3A';ctx.fillRect(x-1.5,y-22,3,22);ellipse(x+sway,y-20,10,8,'#4FA548');ellipse(x-5+sway,y-12,5,5,'#E4473C');ellipse(x+5+sway,y-17,5,5,'#E4473C');ellipse(x+2+sway,y-7,4.5,4.5,'#E4473C')}
  else if(type==='carrot'){ellipse(x,y-3,6,4,'#F08A2A');[-5,0,5].forEach(function(d){ctx.strokeStyle='#4FA548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+d+sway,y-18);ctx.stroke()})}
  else if(type==='wheat'){[-4,0,4].forEach(function(d){ctx.strokeStyle='#8AB04A';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+d,y);ctx.lineTo(x+d+sway,y-20);ctx.stroke();ellipse(x+d+sway,y-22,3,6,'#E8C04A')})}
  else if(type==='pumpkin'){ellipse(x,y-8,11,9,'#F29B4B');ellipse(x-5,y-8,4,8,'#E98A36');ellipse(x+5,y-8,4,8,'#E98A36');ctx.fillStyle='#5C8E3A';ctx.fillRect(x-1.5,y-20,3,5);ellipse(x+5+sway,y-18,5,3,'#6DB24E')}
  else if(type==='flower'){ctx.strokeStyle='#4FA548';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+sway,y-16);ctx.stroke();var c=['#F4A6B8','#FFD66B','#B58CE0'][Math.floor(ph*3)%3];for(var a=0;a<5;a++){var an=a/5*6.28;ellipse(x+sway+Math.cos(an)*5,y-18+Math.sin(an)*5,4,4,c)}ellipse(x+sway,y-18,3,3,'#FFF3B0')}
  else if(type==='sprout'){ctx.strokeStyle='#5CAF4A';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-10);ctx.stroke();ctx.save();ctx.translate(x,y-11);ctx.rotate(-0.5+sway*0.05);ellipse(-6,0,7,3.5,'#7CC56A');ctx.rotate(1);ellipse(6,0,7,3.5,'#7CC56A');ctx.restore()}
}
function drawPatch(p,t){var X=p.x*T,Y=p.y*T,w=p.w*T,h=p.h*T;
  ctx.fillStyle='#8E5E3B';roundRect(ctx,X,Y+6,w,h,10);ctx.fill();
  ctx.fillStyle='#A06C45';roundRect(ctx,X,Y,w,h-4,10);ctx.fill();
  ctx.strokeStyle='rgba(80,50,30,.35)';ctx.lineWidth=2;
  var rows=2,cols=Math.round(p.w*1.6);
  for(var r=0;r<rows;r++){for(var c=0;c<cols;c++){var cx=X+(c+0.5)*w/cols,cy=Y+(r+0.75)*(h-4)/rows;ellipse(cx,cy+2,9,4,'rgba(80,50,30,.3)');drawCrop(p.item[4],cx,cy+1,t,(c*7+r*3)%10/10)}}
}
function textBoard(x,y,label,sub,big,t){
  ctx.font=(big?'22px ':'15px ')+FONT;var tw=ctx.measureText(label).width;
  var sw=0;if(sub){ctx.font='13px '+FONT;sw=ctx.measureText(sub).width}
  var bw=Math.max(tw,sw)+ (big?34:20), bh=big?(sub?58:40):26;
  var bx=x-bw/2, by=y-(big?44:26)-bh;
  shadow(x,y,big?22:12);
  ctx.fillStyle='#8B5E34';ctx.fillRect(x-(big?5:3),by+bh-4,big?10:6,y-(by+bh)+2);
  if(big){ctx.fillRect(x-bw/2+14,by+bh-4,8,y-(by+bh)+2);ctx.fillRect(x+bw/2-22,by+bh-4,8,y-(by+bh)+2)}
  ctx.fillStyle='#9F6F42';roundRect(ctx,bx,by+4,bw,bh,10);ctx.fill();
  ctx.fillStyle='#C99A62';roundRect(ctx,bx,by,bw,bh,10);ctx.fill();
  ctx.strokeStyle='rgba(255,246,228,.5)';ctx.setLineDash([4,3]);ctx.lineWidth=1.5;roundRect(ctx,bx+4,by+4,bw-8,bh-8,7);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#FFF6E4';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=(big?'22px ':'15px ')+FONT;ctx.fillText(label,x,by+(sub?bh*0.38:bh/2)+1);
  if(sub){ctx.font='13px '+FONT;ctx.fillStyle='#FFE9C7';ctx.fillText(sub,x,by+bh*0.74)}
  return by;
}
function star(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();for(var i=0;i<10;i++){var a=i/10*Math.PI*2-Math.PI/2,rr=i%2?r*0.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fill()}
function drawTent(){var X=TENT.x*T,Y=TENT.y*T,w=TENT.w*T,h=TENT.h*T;
  shadow(X+w/2,Y+h,w*0.55);
  ctx.fillStyle='#E7B92E';ctx.beginPath();ctx.moveTo(X+w/2,Y);ctx.lineTo(X+w+6,Y+h);ctx.lineTo(X-6,Y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle='#FFD64A';ctx.beginPath();ctx.moveTo(X+w/2,Y+4);ctx.lineTo(X+w-12,Y+h);ctx.lineTo(X+12,Y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle='#F2C23A';ctx.beginPath();ctx.moveTo(X+w/2,Y+h*0.35);ctx.lineTo(X+w/2+26,Y+h);ctx.lineTo(X+w/2-26,Y+h);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#C99A2A';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+w/2,Y+h*0.35);ctx.lineTo(X+w/2,Y+h);ctx.stroke();
  ctx.strokeStyle='#B08A5A';ctx.lineWidth=2;[[X+8,Y+h*0.55,X-24,Y+h-4],[X+w-8,Y+h*0.55,X+w+24,Y+h-4]].forEach(function(l){ctx.beginPath();ctx.moveTo(l[0],l[1]);ctx.lineTo(l[2],l[3]);ctx.stroke();ellipse(l[2],l[3],5,5,'#D9A86A')});
  ctx.fillStyle='#FFF6E4';ctx.font='15px '+FONT;ctx.textAlign='center';ctx.fillText('HOME',X+w/2,Y+h*0.28);
}
function drawMailbox(o){var x=o.x*T,y=o.sy*T;shadow(x,y,12);ctx.fillStyle='#8B5E34';ctx.fillRect(x-3,y-26,6,26);ctx.fillStyle='#C99A62';roundRect(ctx,x-14,y-44,28,20,5);ctx.fill();ctx.fillStyle='#9F6F42';ctx.fillRect(x-10,y-38,20,3);ctx.fillStyle='#E4473C';ctx.fillRect(x+12,y-50,3,14);ctx.fillRect(x+12,y-50,9,6)}
function drawDiary(o,t){var x=o.x*T,y=o.sy*T;shadow(x,y,34);ctx.fillStyle='#B98552';roundRect(ctx,x-32,y-26,64,22,6);ctx.fill();ctx.fillStyle='#9F6F42';ctx.fillRect(x-28,y-6,6,8);ctx.fillRect(x+22,y-6,6,8);
  ctx.fillStyle='#FFF9EC';roundRect(ctx,x-20,y-34,40,14,3);ctx.fill();ctx.fillStyle='#F4A6B8';ctx.fillRect(x-1,y-34,2,14);ctx.fillStyle='#C8B8A0';for(var i=0;i<3;i++){ctx.fillRect(x-16,y-31+i*4,12,1.5);ctx.fillRect(x+4,y-31+i*4,12,1.5)}
  ctx.strokeStyle='#5A4632';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+18,y-30);ctx.lineTo(x+26,y-44);ctx.stroke();
  ctx.fillStyle='#FFF6E4';ctx.font='13px '+FONT;ctx.textAlign='center';ctx.fillStyle='#5A4632';ctx.fillText('일기장',x,y-50+Math.sin(t*2)*2)}
function drawShed(){var X=SHED.x*T,Y=SHED.y*T,w=SHED.w*T,h=SHED.h*T;shadow(X+w/2,Y+h,w*0.6);
  ctx.fillStyle='#B4553C';roundRect(ctx,X,Y+h*0.35,w,h*0.65,6);ctx.fill();
  ctx.fillStyle='#8E3F2C';ctx.beginPath();ctx.moveTo(X-10,Y+h*0.4);ctx.lineTo(X+w/2,Y);ctx.lineTo(X+w+10,Y+h*0.4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#E8D6B8';roundRect(ctx,X+w/2-18,Y+h*0.55,36,h*0.45,4);ctx.fill();ctx.strokeStyle='#B99D73';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+w/2,Y+h*0.55);ctx.lineTo(X+w/2,Y+h);ctx.stroke();
  ctx.fillStyle='#FFF6E4';ctx.font='15px '+FONT;ctx.textAlign='center';ctx.fillText('도구 창고',X+w/2,Y+h*0.3)}
function drawBoard(o){var x=o.x*T,y=o.sy*T;shadow(x,y,70);ctx.fillStyle='#8B5E34';ctx.fillRect(x-62,y-60,8,60);ctx.fillRect(x+54,y-60,8,60);
  ctx.fillStyle='#9F6F42';roundRect(ctx,x-72,y-96,144,62,8);ctx.fill();ctx.fillStyle='#E8C99A';roundRect(ctx,x-66,y-90,132,50,6);ctx.fill();
  [[-50,-84,'#FFF9EC',-.1],[-14,-86,'#FFE08A',.08],[22,-84,'#F9D3DC',-.05]].forEach(function(n){ctx.save();ctx.translate(x+n[0]+16,y+n[1]+18);ctx.rotate(n[3]);ctx.fillStyle=n[2];ctx.fillRect(-16,-18,32,36);ctx.fillStyle='#C8B8A0';for(var i=0;i<3;i++)ctx.fillRect(-11,-8+i*7,22,2);ctx.restore();ellipse(x+n[0]+16,y+n[1]+2,3,3,'#E4473C')});
  star(x+56,y-92,9,'#FFD66B');
  ctx.fillStyle='#FFF6E4';ctx.font='15px '+FONT;ctx.textAlign='center';ctx.fillText('게시판',x,y-104)}
function drawScreen(){var x=45*T,y=19.4*T;shadow(x,y,140);ctx.fillStyle='#6E4E30';ctx.fillRect(x-132,y-110,10,110);ctx.fillRect(x+122,y-110,10,110);
  ctx.fillStyle='#3B2E25';roundRect(ctx,x-136,y-124,272,92,8);ctx.fill();
  var gr=ctx.createLinearGradient(0,y-118,0,y-40);gr.addColorStop(0,'#BFE7F7');gr.addColorStop(1,'#F9D3DC');ctx.fillStyle=gr;ctx.fillRect(x-128,y-116,256,76);
  ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.moveTo(x-10,y-92);ctx.lineTo(x+14,y-78);ctx.lineTo(x-10,y-64);ctx.closePath();ctx.fill();
  ctx.fillStyle='#FFF6E4';ctx.font='15px '+FONT;ctx.textAlign='center';ctx.fillText('야외 영화관',x,y-130)}
function drawBench(o){var x=o.x*T,y=o.sy*T;shadow(x,y,26);ctx.fillStyle='#9F6F42';ctx.fillRect(x-22,y-6,4,8);ctx.fillRect(x+18,y-6,4,8);ctx.fillStyle='#C99A62';roundRect(ctx,x-26,y-14,52,9,3);ctx.fill();ctx.fillStyle='#B98552';roundRect(ctx,x-26,y-24,52,7,3);ctx.fill()}
function drawLamp(o,night){var x=o.x*T,y=o.sy*T;shadow(x,y,8);ctx.fillStyle='#4A4A55';ctx.fillRect(x-2,y-40,4,40);ctx.fillStyle=night?'#FFE8A0':'#FFF6D8';roundRect(ctx,x-7,y-52,14,14,4);ctx.fill();ctx.fillStyle='#4A4A55';ctx.fillRect(x-9,y-54,18,4)}
function drawTelescope(o){var x=o.x*T,y=o.sy*T;shadow(x,y,14);ctx.strokeStyle='#5A5A66';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y-22);ctx.lineTo(x-10,y);ctx.moveTo(x,y-22);ctx.lineTo(x+10,y);ctx.moveTo(x,y-22);ctx.lineTo(x,y);ctx.stroke();ctx.save();ctx.translate(x,y-24);ctx.rotate(-0.6);ctx.fillStyle='#EDEDF2';roundRect(ctx,-6,-4,28,8,3);ctx.fill();ctx.restore()}
function drawMiniSign(o,t){var by=textBoard(o.x*T,o.sy*T,o.label,null,false,t);if(o.award){star(o.x*T+ (ctx.measureText(o.label).width/2+14),by+Math.sin(t*3)*2,8,'#FFCF3A')}}

function drawPlayer(t){var x=player.x*T,y=player.y*T;if(villagerReady){drawVillager(x,y,t);return}var step=player.moving?Math.sin(player.t*14):0;var bob=Math.abs(step)*2;
  shadow(x,y,13);
  var d=player.dir;
  // legs
  ctx.fillStyle='#3C5A8A';roundRect(ctx,x-8,y-14+(step>0?-2:0),6,12,3);ctx.fill();roundRect(ctx,x+2,y-14+(step<0?-2:0),6,12,3);ctx.fill();
  ctx.fillStyle='#3A6FD8';ellipse(x-5,y-2+(step>0?-2:0),4,3,'#2F5BB8');ellipse(x+5,y-2+(step<0?-2:0),4,3,'#2F5BB8');
  // body
  ctx.fillStyle='#8FC3E8';roundRect(ctx,x-11,y-30-bob,22,18,7);ctx.fill();
  ctx.fillStyle='#BFE0F5';ctx.fillRect(x-11,y-24-bob,22,2);ctx.fillRect(x-11,y-18-bob,22,2);
  // arms
  var sw=player.moving?step*3:0;ellipse(x-13,y-22-bob+sw,4,6,'#FFD9B5');ellipse(x+13,y-22-bob-sw,4,6,'#FFD9B5');
  // head
  var hy=y-46-bob;
  ellipse(x,hy,17,16,'#FFD9B5');
  // hair
  ctx.fillStyle='#6B4430';
  if(d==='up'){ellipse(x,hy-1,18,17,'#6B4430');ctx.fillRect(x-18,hy,36,14)}
  else{ctx.beginPath();ctx.ellipse(x,hy-6,18,13,0,Math.PI,0);ctx.fill();ctx.fillRect(x-18,hy-6,6,20);ctx.fillRect(x+12,hy-6,6,20);
    if(d==='left')ctx.fillRect(x-6,hy-8,18,6);else if(d==='right')ctx.fillRect(x-12,hy-8,18,6);else{ctx.beginPath();ctx.ellipse(x-6,hy-8,8,5,0.2,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x+6,hy-8,8,5,-0.2,0,7);ctx.fill()}}
  if(d!=='up'){var ox=d==='left'?-5:d==='right'?5:0;
    ellipse(x-6+ox,hy+2,2.6,3.4,'#3A2A20');ellipse(x+6+ox,hy+2,2.6,3.4,'#3A2A20');
    ellipse(x-10+ox,hy+7,3,2,'rgba(244,140,150,.55)');ellipse(x+10+ox,hy+7,3,2,'rgba(244,140,150,.55)');
    ctx.strokeStyle='#8A4A3A';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+ox,hy+7,3.2,0.2,Math.PI-0.2);ctx.stroke()}
  // hair pin
  star(x+11,hy-10,4.5,'#FFD66B');
}

/* ---------------- night ---------------- */
var night=false; // Start in the approved daylight palette; night remains an explicit in-session choice.
var flies=[];for(i=0;i<40;i++)flies.push({x:3+R()*(W-6),y:3+R()*28,p:R()*6});
var shooting=null;
var nightCv=document.createElement('canvas'),nc=nightCv.getContext('2d');

/* ---------------- camera & resize ---------------- */
var vw,vh,zoom,dpr;
function resize(){vw=innerWidth;vh=innerHeight;dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(3200000/(vw*vh)));cv.width=Math.round(vw*dpr);cv.height=Math.round(vh*dpr);cv.style.width=vw+'px';cv.style.height=vh+'px';
  zoom=Math.max(.9,Math.min(1.45,Math.min(vw/1000*1.2,vh/650*1.2)));nightCv.width=cv.width;nightCv.height=cv.height}
addEventListener('resize',resize);resize();
var cam={x:player.x*T,y:player.y*T};

/* ---------------- input ---------------- */
var keys={};var paused=false;
var KMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',function(e){
  if(!started)return;
  if(e.key==='Tab'&&modalOpen()){trapFocus(e);return}
  if(e.key==='Escape'&&tr.classList.contains('show')){hideTravel();document.getElementById('btnTravel').focus();return}
  if(e.target.closest('input,select,textarea')&&e.key!=='Escape')return;
  if(e.target.closest('button,a')&&(e.code==='Space'||e.key==='Enter'))return;
  if(modalOpen()){ if(e.key==='Escape'||((e.code==='Space'||e.key==='Enter')&&isBodyFocus())){e.preventDefault();closeModal()} return}
  if(talkOpen()){ if(e.code==='Space'||e.key==='Enter'||e.key==='Escape'){e.preventDefault();advanceTalk()} return}
  var k=KMAP[e.code]; if(k){keys[k]=true;e.preventDefault();hideTravel()}
  if(e.code==='Space'||e.key==='Enter'){e.preventDefault();act()}
  if(e.code==='KeyN')toggleNight();
  if(e.code==='KeyT'){toggleTravel()}
});
addEventListener('keyup',function(e){var k=KMAP[e.code];if(k)keys[k]=false});
addEventListener('blur',function(){keys={}});
function isBodyFocus(){var a=document.activeElement;return !a||a===document.body||a.id==='close'||a.id==='sheet'}
// touch
var isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0||matchMedia('(max-width:780px)').matches;
if(isTouch){document.getElementById('dpad').classList.add('show');document.getElementById('abtn').classList.add('show')}
[].forEach.call(document.querySelectorAll('.dpad button'),function(b){var k=b.dataset.k;
  function on(e){e.preventDefault();keys[k]=true} function off(e){e.preventDefault();keys[k]=false}
  b.addEventListener('touchstart',on,{passive:false});b.addEventListener('touchend',off);b.addEventListener('touchcancel',off);
  b.addEventListener('mousedown',on);b.addEventListener('mouseup',off);b.addEventListener('mouseleave',off)});
document.getElementById('abtn').addEventListener('click',function(){if(talkOpen())advanceTalk();else act()});
// tap-to-walk on canvas
var target=null;
cv.addEventListener('pointerdown',function(e){if(!started||modalOpen()||talkOpen())return;cv.focus({preventScroll:true});hideTravel();
  var world=window.IslandMotion.unproject(perspectiveCamera(),e.clientX,e.clientY);if(!world||world.y<0)return;var wx=world.x,wy=world.y;
  var hit=null,best=1.6;inter.forEach(function(it){var d=Math.hypot(wx/T-it.x,wy/T-(it.y-0.8));if(d<best){best=d;hit=it}});
  target={x:hit?hit.tx:wx/T,y:hit?hit.ty:wy/T,it:hit};
});

/* ---------------- movement & collision ---------------- */
function blocked(x,y){var hw=0.28,hh=0.16;for(var i=0;i<solids.length;i++){var s=solids[i];if(x+hw>s.x&&x-hw<s.x+s.w&&y>s.y-hh&&y-hh<s.y+s.h)return true}return false}
var near=null;
function update(dt,t){
  var dx=(keys.right?1:0)-(keys.left?1:0), dy=(keys.down?1:0)-(keys.up?1:0);
  if(dx||dy)target=null;
  if(target&&!dx&&!dy){var tx=target.x-player.x,ty=target.y-player.y,dd=Math.hypot(tx,ty);if(dd<0.12){var it=target.it;target=null;if(it){player.dir='up';near=it;act()}}else{dx=tx/dd;dy=ty/dd}}
  player.moving=!!(dx||dy);
  if(player.moving){var l=Math.hypot(dx,dy);dx/=l;dy/=l;var sp=5.2*dt;
    if(Math.abs(dx)>Math.abs(dy))player.dir=dx>0?'right':'left';else player.dir=dy>0?'down':'up';
    var nx=player.x+dx*sp;if(!blocked(nx,player.y))player.x=nx;else if(target)target=null;
    var ny=player.y+dy*sp;if(!blocked(player.x,ny))player.y=ny;else if(target)target=null;
    player.t+=dt}
  // nearest interactable
  var best=null,bd=9;
  inter.forEach(function(it){var d=Math.hypot(player.x-it.x,player.y-it.y);if(d<it.r&&d<bd){bd=d;best=it}});
  if(best!==near){near=best;var pr=document.getElementById('prompt');if(near){pr.innerHTML='<b>'+(isTouch?'A':'Space')+'</b>'+near.label;pr.classList.add('show')}else pr.classList.remove('show');document.getElementById('abtn').classList.toggle('on',!!near)}
  cam.x+=(player.x*T-cam.x)*Math.min(1,dt*8);cam.y+=(player.y*T-24-cam.y)*Math.min(1,dt*8);
  clampCam();
}
function clampCam(){var hw=vw/2/zoom,hh=vh/2/zoom;cam.x=Math.max(hw,Math.min(W*T-hw,cam.x));cam.y=Math.max(hh,Math.min(H*T-hh,cam.y))}

/* ---------------- render ---------------- */
function render(t){
  clampCam();
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#5BA6D6';ctx.fillRect(0,0,vw,vh);
  ctx.setTransform(dpr*zoom,0,0,dpr*zoom,dpr*(vw/2-cam.x*zoom),dpr*(vh/2-cam.y*zoom));
  var left=cam.x-vw/2/zoom-60,top=cam.y-vh/2/zoom-120,right=cam.x+vw/2/zoom+60,bottom=cam.y+vh/2/zoom+120;
  ctx.drawImage(G,0,0);
  // sea
  var sy0=34.2*T;var gr=ctx.createLinearGradient(0,sy0,0,H*T);gr.addColorStop(0,'#7FD3E8');gr.addColorStop(1,'#3E9FD0');ctx.fillStyle=gr;
  ctx.beginPath();ctx.moveTo(0,H*T);for(var x=0;x<=W*T;x+=20)ctx.lineTo(x,sy0+Math.sin(x/60+t*1.4)*6);ctx.lineTo(W*T,H*T);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.beginPath();for(x=0;x<=W*T;x+=20){var yy=sy0+Math.sin(x/60+t*1.4)*6;if(x===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy)}ctx.stroke();
  for(var i=0;i<14;i++){var wx=((i*397+t*30)%(W*T)),wy=sy0+60+(i%4)*40;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,wy,12,Math.PI*1.1,Math.PI*1.9);ctx.stroke()}
  // flowers
  flowers.forEach(function(f){var X=f[0]*T,Y=f[1]*T;if(X<left||X>right||Y<top||Y>bottom)return;ctx.strokeStyle='#4FA548';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X,Y-8);ctx.stroke();for(var a=0;a<5;a++){var an=a/5*6.28+f[3];ellipse(X+Math.cos(an)*3.5,Y-10+Math.sin(an)*3.5,3,3,f[2])}ellipse(X,Y-10,2,2,'#FFE08A')});
  // highlight near
  if(near){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=3;ctx.setLineDash([6,6]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.ellipse(near.x*T,(near.y-0.45)*T,30,11,0,0,7);ctx.stroke();ctx.setLineDash([])}
  // objects sorted
  var list=objs.slice();list.push({y:player.y,kind:'player'});list.sort(function(a,b){return a.y-b.y});
  list.forEach(function(o){
    var ox=(o.x!=null?o.x:(o.f?o.f.x+o.f.w/2:(o.p?o.p.x:27)))*T, oy=o.y*T;
    if(o.kind!=='player'&&!o.f&&o.kind!=='tent'&&o.kind!=='shed'&&o.kind!=='screen'&&(ox<left-200||ox>right+200||oy<top||oy>bottom+80))return;
    switch(o.kind){
      case 'shrub':window.IslandGarden.shrub(ctx,o.x*T,o.y*T,o.variant);break;case 'tree':drawTree(o,t);break;case 'crop':drawCrop(o.crop,o.x*T,o.y*T,t,o.phase);break;
      case 'fenceTop':drawFence(o.f,'top');break;
      case 'fenceBottom':drawFence(o.f,'bottom');break;
      case 'fenceSides':drawFence(o.f,'sides');break;
      case 'patch':drawPatch(o.p,t);break;
      case 'miniSign':drawMiniSign(o,t);break;
      case 'bigSign':textBoard(o.x*T,o.sy*T,o.label,o.sub,true,t);break;
      case 'tent':drawTent();break;
      case 'mailbox':drawMailbox(o);break;
      case 'diary':drawDiary(o,t);break;
      case 'shed':drawShed();break;
      case 'board':drawBoard(o);break;
      case 'screen':drawScreen();break;
      case 'bench':drawBench(o);break;
      case 'lamp':drawLamp(o,night);break;
      case 'telescope':drawTelescope(o);break;
      case 'player':if(started)drawPlayer(t);break;
    }
  });
  // night overlay
  if(night){
    nc.setTransform(1,0,0,1,0,0);nc.globalCompositeOperation='source-over';nc.clearRect(0,0,nightCv.width,nightCv.height);
    nc.fillStyle='rgba(18,24,64,.62)';nc.fillRect(0,0,nightCv.width,nightCv.height);
    nc.globalCompositeOperation='destination-out';
    function hole(wx,wy,r,a){var sx=(vw/2+(wx-cam.x)*zoom)*dpr,sy=(vh/2+(wy-cam.y)*zoom)*dpr,rr=r*zoom*dpr;var g2=nc.createRadialGradient(sx,sy,0,sx,sy,rr);g2.addColorStop(0,'rgba(0,0,0,'+a+')');g2.addColorStop(1,'rgba(0,0,0,0)');nc.fillStyle=g2;nc.beginPath();nc.arc(sx,sy,rr,0,7);nc.fill()}
    hole(player.x*T,player.y*T-20,150,.85);lamps.forEach(function(l){hole(l[0]*T,l[1]*T-46,120,.8)});
    hole(27*T,6*T,160,.55);hole(45*T,18.2*T,170,.6);
    ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(nightCv,0,0);
    ctx.setTransform(dpr*zoom,0,0,dpr*zoom,dpr*(vw/2-cam.x*zoom),dpr*(vh/2-cam.y*zoom));
    lamps.forEach(function(l){ellipse(l[0]*T,l[1]*T-46,18,18,'rgba(255,230,150,.25)')});
    flies.forEach(function(f){var fx=(f.x+Math.sin(t*0.7+f.p)*1.2)*T,fy=(f.y+Math.cos(t*0.9+f.p)*0.8)*T,a=0.4+0.6*Math.abs(Math.sin(t*2+f.p));ellipse(fx,fy,6,6,'rgba(200,255,120,'+(a*0.25)+')');ellipse(fx,fy,2.2,2.2,'rgba(230,255,160,'+a+')')});
    // shooting star (screen space)
    ctx.setTransform(dpr,0,0,dpr,0,0);
    for(i=0;i<28;i++){var sx=(i*137.7)%vw,sy2=(i*71.3)%(vh*0.35);ctx.fillStyle='rgba(255,255,230,'+(0.3+0.5*Math.abs(Math.sin(t+i)))+')';ctx.fillRect(sx,sy2,2,2)}
    if(!shooting&&Math.random()<0.004)shooting={x:vw*(0.3+Math.random()*0.6),y:vh*0.05+Math.random()*vh*0.15,l:0};
    if(shooting){shooting.l+=0.02;var p=shooting.l,x1=shooting.x-p*260,y1=shooting.y+p*110;var gg=ctx.createLinearGradient(x1,y1,x1+90,y1-38);gg.addColorStop(0,'rgba(255,255,255,.95)');gg.addColorStop(1,'rgba(255,255,255,0)');ctx.strokeStyle=gg;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+90,y1-38);ctx.stroke();if(p>1)shooting=null}
  }
}

/* ---------------- dialog (talk) ---------------- */
var talkQ=[],talkDone=null,typing=null;
function talkOpen(){return document.getElementById('talk').classList.contains('show')}
function say(lines,who,done){talkQ=lines.slice();talkDone=done||null;document.getElementById('talkWho').textContent=who||'승주';document.getElementById('talk').classList.add('show');document.body.classList.add('talking');keys={};nextLine();document.getElementById('talk').focus({preventScroll:true})}
function nextLine(){var el=document.getElementById('talkText'),s=talkQ.shift(),i=0;clearInterval(typing);el.textContent='';
  if(reducedMotion){el.textContent=s;el.dataset.full=s;typing=null;return}typing=setInterval(function(){i+=1;el.textContent=s.slice(0,i);if(i>=s.length){clearInterval(typing);typing=null}},26);el.dataset.full=s}
function advanceTalk(){var el=document.getElementById('talkText');if(typing){clearInterval(typing);typing=null;el.textContent=el.dataset.full;return}
  if(talkQ.length)nextLine();else{document.getElementById('talk').classList.remove('show');document.body.classList.remove('talking');var d=talkDone;talkDone=null;cv.focus({preventScroll:true});if(d)d()}}
document.getElementById('talk').addEventListener('click',advanceTalk);

/* ---------------- modal ---------------- */
var sheetBody=document.getElementById('sheetBody');
function modalOpen(){return document.getElementById('modal').classList.contains('show')}
var returnFocus=null,guideReturn=null;
function showGuide(){
 var previous=guideReturn;guideReturn=null;openModal(welcomeHtml());
 if(previous){var button=[].find.call(sheetBody.querySelectorAll('[data-guide]'),function(b){return b.dataset.guide===previous.id});if(button)button.focus({preventScroll:true});document.getElementById('sheet').scrollTop=previous.scrollTop}
}
function openModal(html){if(!modalOpen())returnFocus=document.activeElement;hideTravel();dismissTalk();target=null;document.body.classList.add('reading');setShellInert(true);sheetBody.innerHTML=(guideReturn?'<button type="button" class="guide-back" id="guideBack">← 섬 안내도로</button>':'')+html;document.getElementById('modal').classList.add('show');document.getElementById('modal').setAttribute('aria-labelledby','sheetTitle');keys={};document.getElementById('sheet').scrollTop=0;
  var back=document.getElementById('guideBack');if(back)back.addEventListener('click',showGuide);
  [].forEach.call(sheetBody.querySelectorAll('[data-guide]'),function(b){b.addEventListener('click',function(){var it=findInter(b.dataset.guide);if(!it)return;guideReturn={id:it.id,scrollTop:document.getElementById('sheet').scrollTop};openPlace(it)})});
  [].forEach.call(sheetBody.querySelectorAll('[data-open]'),function(b){b.addEventListener('click',function(){showItem(b.dataset.open)})});
  [].forEach.call(sheetBody.querySelectorAll('[data-go]'),function(b){b.addEventListener('click',function(){if(guideReturn){var it=findInter(b.dataset.go);if(it)openPlace(it)}else{closeModal();goTo(b.dataset.go,true)}})});
  [].forEach.call(sheetBody.querySelectorAll('a[href^="#"]'),function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1);if(tpl(id)){e.preventDefault();showItem(id)}})});
  (back||document.getElementById('close')).focus({preventScroll:true})}
function closeModal(){guideReturn=null;[].forEach.call(sheetBody.querySelectorAll('video'),function(v){v.pause()});document.getElementById('modal').classList.remove('show');sheetBody.innerHTML='';document.body.classList.remove('reading');setShellInert(false);if(returnFocus&&document.contains(returnFocus)&&returnFocus.getClientRects().length&&!returnFocus.closest('#title'))returnFocus.focus({preventScroll:true});else cv.focus({preventScroll:true})}
document.getElementById('close').addEventListener('click',closeModal);
document.getElementById('modal').addEventListener('click',function(e){if(e.target.id==='modal')closeModal()});
function tpl(id){return document.getElementById('tpl-'+id)}
function head(t){return '<h2 class="stitle" id="sheetTitle">'+t+'</h2>'}
function competencyProof(){return '<section class="competency-proof" aria-labelledby="proofTitle"><h3 id="proofTitle">기획부터 운영 개선까지, 직접 검증하는 방식</h3><p>기획으로 끝내지 않고 요구사항을 구조화한 뒤, 화면·데이터·운영 절차로 구현하고 결과를 확인합니다.</p><div class="proof-grid"><div><b>플랫폼 운영·유지보수</b><span>점검과 개선 과제를 정리하고 사용자 유형별 기능 흐름을 고도화</span></div><div><b>서비스 구현</b><span>Next.js 기반 관리자 페이지의 UX 설계와 프론트·백엔드 직접 개발</span></div><div><b>AI·데이터 적용</b><span>분석·모델 검증을 서비스 의사결정과 운영 가이드에 연결</span></div><div><b>협업·검증</b><span>기획·디자인·개발 사이의 요구사항, 일정, 테스트 기준 조율</span></div></div><p class="career-flow"><b>역할을 넓혀 온 과정</b> 공공 서비스 PM → 플랫폼 운영·웹 개발 → 신사업·공간 콘텐츠 기획</p></section>'}
function proposalPreview(){return '<figure class="proposal-teaser"><img src="assets/img/teaser/proposal-closing-preview.jpg" alt="일부 고유명사를 흐린 사업 제안서의 마무리 슬라이드 미리보기" loading="lazy"><figcaption>제안서 마무리 슬라이드 맛보기 · 원본 PPT와 PDF는 비공개</figcaption></figure>'}
function proposalGallery(){return '<div class="proposal-gallery" aria-label="흐림 처리한 공간 활용 제안서 일부 페이지"><figure><img src="assets/img/teaser/jotopium-market-preview.jpg" alt="흐린 시장 수요 분석 제안서 미리보기" loading="lazy"><figcaption>시장 수요 분석</figcaption></figure><figure><img src="assets/img/teaser/jotopium-space-preview.jpg" alt="흐린 공간 기능 배치 제안서 미리보기" loading="lazy"><figcaption>공간 기능 배치</figcaption></figure><figure><img src="assets/img/teaser/jotopium-concept-preview.jpg" alt="흐린 야외 공간 콘셉트 제안서 미리보기" loading="lazy"><figcaption>공간 콘셉트 설계</figcaption></figure></div>'}
function cafeProjectProof(){return '<section class="private-case"><h4>카페 조성·운영 통합 기획</h4><p>글로벌AD에서 공간 구성, 상권·수요 해석, 메뉴·원가·판매가 모델, 오픈 운영 기준을 하나의 실행안으로 정리했습니다.</p><div class="proposal-gallery" aria-label="흐림 처리한 카페 조성 운영 기획 일부 페이지"><figure><img src="assets/img/teaser/cafe-concept-preview.jpg" alt="흐린 공간과 브랜드 경험 통합 기획 미리보기" loading="lazy"><figcaption>공간과 브랜드 경험 통합</figcaption></figure><figure><img src="assets/img/teaser/cafe-space-preview.jpg" alt="흐린 공간 조건과 운영 기준 미리보기" loading="lazy"><figcaption>공간 조건과 운영 기준</figcaption></figure><figure><img src="assets/img/teaser/cafe-operations-preview.jpg" alt="흐린 운영 지표와 확장 기준 미리보기" loading="lazy"><figcaption>운영 지표와 확장 기준</figcaption></figure></div><small>내부 기획 자료 일부를 흐림 처리한 미리보기 · 원본 문서와 수치 자료는 비공개</small></section>'}
function showItem(id){
 var tp=tpl(id);if(!tp)return;
 var field=FIELDS.find(function(f){return f.items.some(function(item){return item[0]===id})});
 var sourceButton=[].find.call(sheetBody.querySelectorAll('[data-open]'),function(b){return b.dataset.open===id});
 var listScroll=sourceButton?document.getElementById('sheet').scrollTop:0;
 var r=ALL[id],sec=r?(PROJ.indexOf(r)>=0?'🌾 AI 프로젝트 밭':WORK.indexOf(r)>=0?'🍅 작업실 밭':'🌱 새싹 밭'):'';
 var content=tp.innerHTML;
 if(id==='work-biz')content=content.replace('<div class="foot">',proposalPreview()+proposalGallery()+cafeProjectProof()+'<div class="foot">');
 openModal((field?'<button type="button" class="guide-back" id="projectBack">← 목록으로</button>':'')+(sec?head(sec):'')+content);
 var back=document.getElementById('projectBack');
 if(back){back.addEventListener('click',function(){
  openModal(sectionMenu(field));
  var card=[].find.call(sheetBody.querySelectorAll('[data-open]'),function(b){return b.dataset.open===id});
  if(card)card.focus({preventScroll:true});document.getElementById('sheet').scrollTop=listScroll;
 });back.focus({preventScroll:true})}
}
function sectionMenu(f){var h=head('🪧 '+f.name+' · '+f.sub)+'<p class="lead">'+({work:'회사에서 직접 기획·개발·운영한 결과물이에요. 밭마다 하나씩 심어 두었어요.',projects:'문제 정의부터 모델 검증, 서비스 연결까지 진행한 AI·데이터 프로젝트예요. ★은 수상작이에요.',plans:'아직 구현 전인 기획안이에요. 싹이 자라는 중!'})[f.id]+'</p><div class="menu">';
  f.items.forEach(function(it){h+='<button data-open="'+it[0]+'"><b>'+it[1]+'</b><span>'+it[2]+'</span>'+(it[3]?'<br><span class="aw">★ 수상</span>':'')+'</button>'});
  return h+'</div>'}
function homeHtml(){var s=tpl('home');return head('🏡 승주의 한옥')+(s?s.innerHTML:'')+competencyProof()}
function welcomeHtml(){return head('🗺️ 주섬주섬 안내도')+'<p class="lead">어서 와요! 이곳은 박승주의 포트폴리오 섬이에요. 마당에서 남쪽 길로 내려가면 작업실 밭과 새싹 밭, 동쪽 다리를 건너면 AI 프로젝트 밭과 야외 영화관이 나와요. 푯말에 다가가 <b>Space</b>(모바일은 <b>A</b>)를 눌러 보세요.</p><ul class="howto"><li>⌨️ 방향키·WASD로 이동, 화면을 클릭/탭해도 걸어가요</li><li>🪧 Space로 푯말·건물 살펴보기, Esc로 닫기</li><li>🧭 T 또는 [섬 메뉴]로 바로 가기</li><li>🌙 N으로 밤의 섬</li></ul><p class="lead" style="margin-top:16px"><b>섬 곳곳</b></p><div class="menu">'+
  [['home','🏡 승주의 한옥','자기소개 · 경력 · 연락처'],['sec:work','🍅 작업실 밭','실무 주요 결과물 7'],['sec:projects','🌾 AI 프로젝트 밭','AI·데이터 프로젝트 6'],['sec:plans','🌱 새싹 밭','기획안 2'],['others','📌 게시판','수상 기록 · 대외활동'],['video','🎬 야외 영화관','생성형 AI 영상'],['skills','🧰 도구 창고','보유 기술'],['diary','📔 일기장','블로그 글']].map(function(r){return '<button data-guide="'+r[0]+'"><b>'+r[1]+'</b><span>'+r[2]+'</span></button>'}).join('')+'</div>'}
function mailHtml(){return head('📮 우편함')+'<p class="lead">편지는 언제든 환영이에요! 함께 이야기 나누고 싶은 주제가 있다면 연락 주세요.</p><div class="btns"><a class="btnx" href="mailto:dororong69@gmail.com">✉ dororong69@gmail.com</a><a class="btnx alt" href="https://github.com/Zoe3399" target="_blank" rel="noopener">GitHub · Zoe3399</a></div>'}
function diaryHtml(){return head('📔 승주의 일기장')+'<p class="lead">배운 것, 프로젝트 회고, AI 활용 팁을 기록해요.</p><div class="posts" id="postList">불러오는 중…</div><div class="btns" style="margin-top:14px"><a class="btnx alt" href="blog.html">일기장 전체 보기 →</a></div>'}
function loadPosts(){var el=document.getElementById('postList');if(!el)return;
  fetch('posts/posts.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(ps){ps.sort(function(a,b){return b.date.localeCompare(a.date)});
    el.innerHTML=ps.map(function(p){return '<a class="post" href="blog.html?p='+encodeURIComponent(p.id)+'"><small>'+p.date+(p.tags?' · '+p.tags.join(' · '):'')+'</small><b>'+esc(p.title)+'</b><p>'+esc(p.summary||'')+'</p></a>'}).join('')||'아직 글이 없어요.'})
  .catch(function(){el.innerHTML='<p class="lead">일기장은 웹에 올린 뒤(GitHub Pages)에 열려요. 로컬 파일로 열면 글 목록을 불러올 수 없어요.</p>'})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

function act(){if(!near)return;guideReturn=null;openPlace(near)}
// Reading through the guide must not mutate the player's position or nearby target.
function openPlace(it){
  if(it.kind==='item')showItem(it.id);
  else if(it.kind==='section'){var f=FIELDS.filter(function(x){return 'sec:'+x.id===it.id})[0];openModal(sectionMenu(f))}
  else if(it.kind==='home')openModal(homeHtml());
  else if(it.kind==='mail')openModal(mailHtml());
  else if(it.kind==='welcome')showGuide();
  else if(it.kind==='diary'){openModal(diaryHtml());loadPosts()}
  else if(it.kind==='star'){if(!night)toggleNight();say(['반짝이는 별이 보여요.\n오늘도 한 걸음씩, 문제를 풀고 기록하는 중이에요.'],'망원경')}
  else if(it.kind==='tpl'){var tp=tpl(it.id);openModal(head(({others:'📌 게시판 · 수상 기록과 대외활동',video:'🎬 야외 영화관 · 생성형 AI 영상',skills:'🧰 도구 창고 · 보유 기술'})[it.id])+(tp?tp.innerHTML:''))}
}

/* ---------------- travel ---------------- */
var PLACES=[['home','🏡 한옥 (자기소개)'],['welcome','🗺️ 섬 안내도'],['sec:work','🍅 작업실 밭'],['sec:projects','🌾 AI 프로젝트 밭'],['sec:plans','🌱 새싹 밭'],['others','📌 게시판'],['video','🎬 야외 영화관'],['skills','🧰 도구 창고'],['diary','📔 일기장']];
var tr=document.getElementById('travel');
tr.innerHTML=PLACES.map(function(p){return '<button data-go="'+p[0]+'">'+p[1]+'</button>'}).join('');
[].forEach.call(tr.querySelectorAll('button'),function(b){b.addEventListener('click',function(){hideTravel();goTo(b.dataset.go,true)})});
function toggleTravel(){var show=!tr.classList.contains('show');tr.classList.toggle('show',show);document.getElementById('btnTravel').setAttribute('aria-expanded',show);keys={};target=null;if(show)tr.querySelector('button').focus()}
function hideTravel(){tr.classList.remove('show');document.getElementById('btnTravel').setAttribute('aria-expanded','false')}
document.getElementById('btnTravel').addEventListener('click',function(e){e.stopPropagation();toggleTravel()});
function findInter(id){for(var i=0;i<inter.length;i++)if(inter[i].id===id)return inter[i]}
function goTo(id,open){var it=findInter(id);if(!it)return;player.x=it.tx;player.y=it.ty;player.dir='up';target=null;cam.x=player.x*T;cam.y=player.y*T-24;
  if(open){near=it;act()}}

/* ---------------- night toggle ---------------- */
function toggleNight(){night=!night;try{localStorage.setItem('island-night',night?'1':'0')}catch(e){}setNightBtn()}
function setNightBtn(){var b=document.getElementById('btnNight');b.innerHTML=uiIcon(night?'sun':'moon')+'<span class="lbl">'+(night?'낮의 섬':'밤의 섬')+'</span>';b.setAttribute('aria-label',night?'낮의 섬으로 전환':'밤의 섬으로 전환');b.setAttribute('aria-pressed',String(night))}
document.getElementById('btnNight').addEventListener('click',toggleNight);setNightBtn();

/* ---------------- loop ---------------- */
var last=performance.now(),lastPaint=0;
function loop(now){
 requestAnimationFrame(loop);
 // The title has its own static canvas. Never render a second hidden island.
 if(!started||document.hidden){last=now;return}
 var covered=modalOpen()||talkOpen(),frameInterval=covered?100:1000/60;
 if(now-lastPaint<frameInterval-.75)return;
 var dt=Math.min(.05,(now-last)/1000);last=now;
 // Carry the fractional frame budget forward; resetting to now drops frames
 // on displays whose refresh timestamps vary around the 60 Hz boundary.
 var elapsed=now-lastPaint;lastPaint=now-(elapsed%frameInterval);var t=now/1000;
 if(!covered)update(dt,t);else player.moving=false;
 render(reducedMotion?0:t);
 
}
function start(){
  var h=location.hash.slice(1);
  if(h&&(tpl(h)||findInter(h))){try{history.replaceState(null,'',location.pathname)}catch(e){}
    var it=null;inter.forEach(function(x){if(x.id===h)it=x});
    if(it){goTo(h,true)}else{showItem(h)}
    return}
  var seen=false;try{seen=sessionStorage.getItem('island-intro')==='1'}catch(e){}
  if(!seen){say(['주섬주섬에 온 걸 환영해요!\n문제를 구조화하고, AI로 끝까지 실행하는 기획자 박승주예요.','남쪽 길에는 작업실 밭, 동쪽 다리 너머에는 AI 프로젝트 밭이 있어요.\n푯말 앞에서 Space(모바일은 A)를 눌러 보세요!','방향키로 걸어 다니고, 급하면 [섬 메뉴]를 눌러요.\n그럼, 섬 구경 시작!'],'승주',function(){try{sessionStorage.setItem('island-intro','1')}catch(e){}})}
}
var titleEl=document.getElementById('title'),started=false;
var beginning=false;
function begin(){
 if(started||beginning)return;
 beginning=true;var beganAt=performance.now(),button=document.getElementById('startButton'),status=document.getElementById('startStatus');
 button.disabled=true;titleEl.setAttribute('aria-busy','true');status.textContent='섬을 준비하고 있어요…';
 function fail(message){beginning=false;button.disabled=false;titleEl.removeAttribute('aria-busy');status.textContent=message}
 function prepare(){
  if(!window.WorldArt||!WorldArt.ready()||!villagerReady){
   if(performance.now()-beganAt>20000){fail('준비가 지연되고 있어요. 시작 버튼을 다시 눌러 주세요.');return}
   setTimeout(prepare,80);return;
  }
  try{resize();if(render(performance.now()/1000)!==true)throw new Error('Island first frame is not ready')}
  catch(error){console.error('Island startup failed:',error);fail('섬을 열지 못했어요. 새로고침 후 다시 시작해 주세요.');return}
  // Keep the artwork visible until the real scene has rendered successfully.
  requestAnimationFrame(function(){started=true;beginning=false;status.textContent='';titleEl.removeAttribute('aria-busy');document.body.classList.add('playing');setShellInert(false);titleEl.inert=true;titleEl.classList.add('hide');cv.focus({preventScroll:true});setTimeout(function(){titleEl.style.display='none'},520);start()});
 }
 prepare();
}
document.getElementById('startButton').addEventListener('click',begin);
addEventListener('keydown',function(e){if(!started&&!e.target.closest('a,button,[role="button"],summary,input,select,textarea')&&(e.code==='Space'||e.key==='Enter')){e.preventDefault();e.stopImmediatePropagation();begin()}},true);
/* Presentation layer: local character asset, island menu and richer scenery. */
var reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('titleNight').checked=night;
document.getElementById('titleNight').addEventListener('change',function(){if(this.checked!==night)toggleNight()});
document.getElementById('titleMotion').checked=reducedMotion;
document.getElementById('titleMotion').addEventListener('change',function(){reducedMotion=this.checked;document.body.classList.toggle('reduce-motion',reducedMotion)});
function uiIcon(name){return '<svg class="icon" aria-hidden="true"><use href="#i-'+name+'"/></svg>'}
function setShellInert(value){document.querySelectorAll('.game-ui,#game').forEach(function(el){el.inert=value})}
setShellInert(true);
function trapFocus(e){var els=document.getElementById('sheet').querySelectorAll('button,a[href],select,input,video[controls],[tabindex="0"]');var focusable=[].filter.call(els,function(el){return el.getClientRects().length});var first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function dismissTalk(){clearInterval(typing);typing=null;talkQ=[];talkDone=null;document.getElementById('talk').classList.remove('show');document.body.classList.remove('talking');try{sessionStorage.setItem('island-intro','1')}catch(e){}}
document.getElementById('skipTalk').addEventListener('click',function(e){e.stopPropagation();dismissTalk();cv.focus({preventScroll:true})});
document.querySelectorAll('[data-shortcut]').forEach(function(b){b.addEventListener('click',function(){dismissTalk();goTo(b.dataset.shortcut,true)})});
document.addEventListener('click',function(e){if(!e.target.closest('.relwrap'))hideTravel()});
document.addEventListener('visibilitychange',function(){keys={};target=null;last=performance.now()});
// Prevent held touch directions from surviving a cancelled pointer.
document.querySelectorAll('.dpad button').forEach(function(b){b.addEventListener('pointerdown',function(e){e.preventDefault();b.setPointerCapture(e.pointerId);keys[b.dataset.k]=true;target=null});['pointerup','pointercancel','lostpointercapture'].forEach(function(type){b.addEventListener(type,function(){keys[b.dataset.k]=false})})});
var apps=[['home','home','주민 소개','#82ad76'],['sec:work','work','작업실 밭','#df9b68'],['sec:projects','star','AI 프로젝트','#69afa3'],['sec:plans','sprout','새싹 밭','#b4bb6e'],['others','board','게시판','#d495a3'],['video','video','영화관','#91a9c5'],['skills','tools','도구 창고','#bd9b78'],['diary','book','일기장','#b3a0c4'],['mail','mail','연락하기','#e2bb6a']];
tr.innerHTML='<div class="phone-head"><span>SEUNGJU</span><span>● ● ●</span></div><h2>어디로 가 볼까요?</h2><p class="phone-desc">아이콘을 누르면 바로 살펴볼 수 있어요.</p><div class="phone-grid">'+apps.map(function(p){return '<button data-go="'+p[0]+'"><span class="app-icon" style="--app:'+p[3]+'">'+uiIcon(p[1])+'</span>'+p[2]+'</button>'}).join('')+'</div><div class="phone-foot">T 열기 · Esc 닫기 &nbsp; / &nbsp; 나의 작은 포트폴리오</div>';
tr.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){hideTravel();goTo(b.dataset.go,true)})});
tr.querySelector('.phone-foot').insertAdjacentHTML('beforebegin','<button class="phone-guide" type="button">섬 안내도 · 이용 방법</button>');
tr.querySelector('.phone-guide').addEventListener('click',function(){hideTravel();showGuide()});
function clockTick(){var date=new Date();document.getElementById('islandTime').innerHTML=String(date.getHours()%12||12).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0')+'<small>'+(date.getHours()<12?'AM':'PM')+'</small>';document.getElementById('islandDate').textContent=(date.getMonth()+1)+'월 '+date.getDate()+'일 '+['일','월','화','수','목','금','토'][date.getDay()]+'요일'}clockTick();setInterval(clockTick,30000);
// Runtime chroma key preserves the original generated image and needs no build step.
var villagerReady=false,villagerFrames=[],villagerImage=new Image();
villagerImage.onload=function(){
 var src=document.createElement('canvas');src.width=villagerImage.width;src.height=villagerImage.height;var sc=src.getContext('2d',{willReadFrequently:true});sc.drawImage(villagerImage,0,0);
 var pixels=sc.getImageData(0,0,src.width,src.height),d=pixels.data;
 for(var i=0;i<d.length;i+=4){var excess=Math.min(d[i],d[i+2])-d[i+1];if(excess>30){var alpha=1-Math.min(1,(excess-30)/90);d[i+3]=Math.round(d[i+3]*alpha);var spill=Math.max(0,excess-12);d[i]=Math.max(0,d[i]-spill);d[i+2]=Math.max(0,d[i+2]-spill)}}
 sc.putImageData(pixels,0,0);var cell=src.width/4;
 for(var frame=0;frame<4;frame++){
  var out=document.createElement('canvas');out.width=cell;out.height=src.height;out.getContext('2d').drawImage(src,frame*cell,0,cell,src.height,0,0,cell,src.height);
  // Derive a shared ground anchor from the shoes, not the padded image edges.
  var bottom=0,top=src.height,left=cell,right=0;
  for(var yy=src.height-1;yy>=0;yy--){var found=false;for(var xx=0;xx<cell;xx++){if(d[(yy*src.width+frame*cell+xx)*4+3]>180){found=true;break}}if(found){bottom=yy;break}}
  for(var yy=Math.max(0,bottom-14);yy<=bottom;yy++)for(var xx=0;xx<cell;xx++)if(d[(yy*src.width+frame*cell+xx)*4+3]>180){left=Math.min(left,xx);right=Math.max(right,xx)}
  for(var yy=0;yy<=bottom;yy++){var found=false;for(var xx=0;xx<cell;xx++)if(d[(yy*src.width+frame*cell+xx)*4+3]>180){found=true;break}if(found){top=yy;break}}
  out.groundAnchor={x:(left+right)/2,y:bottom};out.gaitScale=101.5/(bottom-top+1);villagerFrames.push(out);
 }
 document.querySelectorAll('.villager-preview').forEach(function(c){c.getContext('2d').drawImage(villagerFrames[0],0,0,c.width,c.height)});villagerReady=true;
};villagerImage.src=window.ISLAND_VILLAGER_SOURCE||'assets/img/seungju-villager-hanbok-key.png';
function drawVillager(x,y,t){var step=player.moving&&!reducedMotion?Math.sin(player.t*14):0;shadow(x,y,17);ctx.save();ctx.translate(x,y+5-Math.abs(step)*2.5);ctx.rotate(step*.025);var index={down:0,up:1,left:2,right:3}[player.dir];ctx.drawImage(villagerFrames[index],-40,-105,80,107);ctx.restore()}
// Richer grass, soft paths, and an inlaid leaf in the town plaza.
drawGround=function(){
 g.fillStyle='#80b95f';g.fillRect(0,0,G.width,G.height);var r=rng(3);
 for(var i=0;i<4200;i++){var x=r()*G.width,y=r()*G.height,s=3+r()*4;g.fillStyle=r()<.5?'#b2d68c55':'#5da76c40';g.beginPath();g.moveTo(x,y);g.lineTo(x+s,y+s*1.3);g.lineTo(x-s,y+s*1.3);g.closePath();g.fill()}
 FIELDS.forEach(function(f){g.fillStyle='#70a75c30';roundRect(g,f.x*T-12,f.y*T-10,f.w*T+24,f.h*T+20,24);g.fill()});
 paths.forEach(function(p){g.fillStyle='#c8bb87';roundRect(g,p[0]*T-3,p[1]*T-3,p[2]*T+6,p[3]*T+8,18);g.fill();g.fillStyle='#e8d7a4';roundRect(g,p[0]*T,p[1]*T,p[2]*T,p[3]*T,16);g.fill();var rp=rng(p[0]*19);g.fillStyle='#c2ac7540';for(var i=0;i<p[2]*p[3]*3;i++){g.beginPath();g.ellipse((p[0]+rp()*p[2])*T,(p[1]+rp()*p[3])*T,2,1,0,0,7);g.fill()}});
 var px=27*T,py=15.6*T;g.fillStyle='#c9bc8e';g.beginPath();g.ellipse(px,py,160,138,0,0,7);g.fill();g.fillStyle='#e8dfbb';g.beginPath();g.ellipse(px,py-3,152,130,0,0,7);g.fill();g.strokeStyle='#c8ba9140';g.lineWidth=2;for(var row=-5;row<6;row++){for(var col=-6;col<7;col++){var xx=px+col*25+(row%2)*12,yy=py+row*22;if(Math.pow((xx-px)/140,2)+Math.pow((yy-py)/117,2)<1){roundRect(g,xx-11,yy-9,23,20,4);g.stroke()}}}
 g.save();g.translate(px,py);g.rotate(-.55);g.fillStyle='#829e6860';g.beginPath();g.ellipse(0,0,25,43,0,0,7);g.fill();g.strokeStyle='#ece4bf';g.lineWidth=3;g.beginPath();g.moveTo(0,36);g.lineTo(0,-25);g.moveTo(0,5);g.lineTo(16,-9);g.stroke();g.restore();
 g.fillStyle='#f0dfa9';g.beginPath();g.moveTo(0,31.4*T);for(var x=0;x<=W;x++)g.lineTo(x*T,(31.4+Math.sin(x*.7)*.25)*T);g.lineTo(W*T,H*T);g.lineTo(0,H*T);g.fill();g.fillStyle='#d2bd8540';for(i=0;i<450;i++)g.fillRect(r()*G.width,(31.6+r()*4)*T,2,2);
};drawGround();
drawTree=function(o){var x=o.x*T,y=o.sy*T,s=o.s;ctx.save();ctx.translate(x,y);ctx.scale(s,s);shadow(5,2,35);var trunk=ctx.createLinearGradient(-9,0,10,0);trunk.addColorStop(0,'#956b4c');trunk.addColorStop(.45,'#c59b68');trunk.addColorStop(1,'#a57b51');ctx.fillStyle=trunk;ctx.beginPath();ctx.moveTo(-8,1);ctx.lineTo(-5,-47);ctx.lineTo(6,-47);ctx.lineTo(9,1);ctx.lineTo(13,4);ctx.lineTo(1,2);ctx.lineTo(-13,5);ctx.closePath();ctx.fill();
 var crown=ctx.createRadialGradient(-14,-71,2,2,-47,48);crown.addColorStop(0,'#9dc870');crown.addColorStop(.5,'#70ad5e');crown.addColorStop(1,'#428950');
 [[-19,-42,24,22],[18,-43,27,23],[0,-68,28,26],[0,-47,35,28]].forEach(function(p){ellipse(p[0],p[1],p[2],p[3],crown)});ellipse(-12,-77,13,5,'#bbd98b45');ellipse(23,-51,7,4,'#afd78a35');
 if(o.fruit){[[-22,-40],[17,-48],[0,-69]].forEach(function(p){var fruit=ctx.createRadialGradient(p[0]-2,p[1]-3,1,p[0],p[1],8);fruit.addColorStop(0,'#ffbb75');fruit.addColorStop(.35,'#e68152');fruit.addColorStop(1,'#be6148');ellipse(p[0],p[1],7,7,fruit);ctx.strokeStyle='#74634a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],p[1]-6);ctx.lineTo(p[0]+1,p[1]-10);ctx.stroke()})}ctx.restore()};
drawTent=function(){var X=TENT.x*T,Y=TENT.y*T,w=TENT.w*T,h=TENT.h*T;shadow(X+w/2,Y+h,w*.56);var fabric=ctx.createLinearGradient(X,Y,X+w,Y+h);fabric.addColorStop(0,'#ffe39a');fabric.addColorStop(1,'#dba84e');ctx.fillStyle=fabric;ctx.beginPath();ctx.moveTo(X+w*.5,Y);ctx.lineTo(X+w+9,Y+h);ctx.quadraticCurveTo(X+w*.5,Y+h+9,X-9,Y+h);ctx.closePath();ctx.fill();ctx.fillStyle='#efc46a';ctx.beginPath();ctx.moveTo(X+w*.5,Y+5);ctx.lineTo(X+w*.5,Y+h);ctx.lineTo(X-4,Y+h);ctx.closePath();ctx.fill();ctx.fillStyle='#746845';ctx.beginPath();ctx.moveTo(X+w*.5,Y+h*.35);ctx.lineTo(X+w*.5+32,Y+h);ctx.lineTo(X+w*.5-32,Y+h);ctx.closePath();ctx.fill();ctx.fillStyle='#ffe2a0';ctx.beginPath();ctx.moveTo(X+w*.5,Y+h*.35);ctx.lineTo(X+w*.5-6,Y+h*.85);ctx.lineTo(X+w*.5-32,Y+h);ctx.closePath();ctx.fill();ctx.strokeStyle='#aa8154';ctx.lineWidth=2;[[X+12,Y+h*.57,X-24,Y+h],[X+w-12,Y+h*.57,X+w+24,Y+h]].forEach(function(p){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[2],p[3]);ctx.stroke();ellipse(p[2],p[3],4,4,'#ad8962')});ctx.fillStyle='#748760';roundRect(ctx,X+w/2-34,Y+34,68,25,10);ctx.fill();ctx.fillStyle='#fff4cf';ctx.font='13px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('승주의 집',X+w/2,Y+47)};
// Cream labels remain readable at game scale; section signs keep warm wood.
var originalTextBoard=textBoard;
textBoard=function(x,y,label,sub,big,t){if(big)return originalTextBoard(x,y,label,sub,big,t);ctx.font='16px '+FONT;var width=ctx.measureText(label).width+24,by=y-50;shadow(x,y,13);ctx.fillStyle='#997950';roundRect(ctx,x-3,by+20,6,30,2);ctx.fill();ctx.fillStyle='#d8d7b5';roundRect(ctx,x-width/2,by+3,width,28,9);ctx.fill();ctx.fillStyle='#fff7db';roundRect(ctx,x-width/2,by,width,28,9);ctx.fill();ctx.fillStyle='#627351';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,by+14);return by};

/* Video reference pass: perspective ground, planted footsteps and quiet HUD. */
var Motion=window.IslandMotion,stepDust=[],lastFootstep=0,walkState=false,walkStopTimer=null,walkPhase=0;
function perspectiveCamera(){return Motion.camera(vw,vh,zoom,cam.x,cam.y)}
function resetMovement(){player.vx=0;player.vy=0;player.speed=0;player.moving=false;player.walkBlend=0;player.runBlend=0;player.running=false;keys={};target=null;routePending=[]}
function greet(){resetMovement();player.dir='down';player.idleTime=0;player.gestureAge=0;setWalking(false)}
function setWalking(value){if(value===walkState)return;walkState=value;clearTimeout(walkStopTimer);if(value)document.body.classList.add('walking');else walkStopTimer=setTimeout(function(){document.body.classList.remove('walking')},650)}
function updateNearby(){var best=null,bd=9;inter.forEach(function(it){var d=Math.hypot(player.x-it.x,player.y-it.y);if(d<it.r&&d<bd){bd=d;best=it}});if(best!==near){near=best;var prompt=document.getElementById('prompt');if(near){prompt.innerHTML='<b>'+(isTouch?'A':'Space')+'</b>'+near.label;prompt.classList.add('show')}else prompt.classList.remove('show');document.getElementById('abtn').classList.toggle('on',!!near)}}
update=function(dt,t){
 var dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
 if(dx||dy){target=null;routePending=[]}
 if(tr.classList.contains('show')){dx=0;dy=0;target=null}
 if(target&&!dx&&!dy){var tx=target.x-player.x,ty=target.y-player.y,dd=Math.hypot(tx,ty);if(dd<.15){if(routePending.length){target=routePending.shift()}else{var item=target.it;resetMovement();if(item){player.dir='up';near=item;act();return}}}else{dx=tx/dd;dy=ty/dd}}
 var distance=Motion.move(player,{x:dx,y:dy,run:!!keys.run},dt,blocked);
 if(player.moving){player.idleTime=0;player.gestureAge=null}else{player.idleTime=(player.idleTime||0)+dt;if(player.gestureAge!=null){player.gestureAge+=dt;if(player.gestureAge>1.7)player.gestureAge=null}}
 if(target&&distance<.00001&&(dx||dy)){target=null}
 player.t+=dt;setWalking(player.moving);
 if(distance&&Math.floor(player.stride/Math.PI)!==lastFootstep){lastFootstep=Math.floor(player.stride/Math.PI);if(!reducedMotion)stepDust.push({x:player.x*T,y:player.y*T,age:0,side:lastFootstep%2?1:-1})}
 stepDust.forEach(function(p){p.age+=dt});stepDust=stepDust.filter(function(p){return p.age<.5});
 updateNearby();
 var lookX=(player.vx||0)*9,lookY=(player.vy||0)*5;
 cam.x=Motion.approach(cam.x,player.x*T+lookX,reducedMotion?30:4.5,dt);
 cam.y=Motion.approach(cam.y,player.y*T+lookY,reducedMotion?30:4.5,dt);clampCam();
};
clampCam=function(){cam.x=Math.max(220,Math.min(W*T-220,cam.x));cam.y=Math.max(230,Math.min(H*T-220,cam.y))};
addEventListener('keydown',function(e){if(!started||modalOpen()||talkOpen()||e.target.closest('input,textarea,select'))return;if(e.code==='ShiftLeft'||e.code==='ShiftRight')keys.run=true});
addEventListener('keyup',function(e){if(e.code==='ShiftLeft'||e.code==='ShiftRight')keys.run=false});
addEventListener('keydown',function(e){if(e.code==='KeyE'&&!e.repeat&&started&&!modalOpen()&&!talkOpen()&&!e.target.closest('input,textarea,select')){e.preventDefault();greet()}});
addEventListener('blur',resetMovement);
var oldOpenModal=openModal;openModal=function(html){resetMovement();setWalking(false);oldOpenModal(html)};
var oldSay=say;say=function(lines,who,done){resetMovement();setWalking(false);oldSay(lines,who,done)};
var oldGoTo=goTo;goTo=function(id,open){resetMovement();stepDust=[];oldGoTo(id,open);updateNearby()};
// Separate fence side segments so they recede with the ground instead of staying flat.
var renderObjects=objs.filter(function(o){return o.kind!=='fenceSides'});
FIELDS.forEach(function(f){[f.x,f.x+f.w].forEach(function(x){for(var y=f.y;y<f.y+f.h;y+=1)renderObjects.push({kind:'sideRail',x:x,y:Math.min(y+1,f.y+f.h),start:y,end:Math.min(y+1,f.y+f.h)})})});
function worldTransform(c,x,y){var p=Motion.project(c,x,y);if(!p||p.y>vh+300||p.y< -300||p.scale>5)return null;var s=c.zoom*p.scale;ctx.setTransform(dpr*s,0,0,dpr*s,dpr*(p.x-x*s),dpr*(p.y-y*s));return p}
function projectedLine(c,points,color,width){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();var startedLine=false;points.forEach(function(v){var p=Motion.project(c,v[0],v[1]);if(!p)return;if(!startedLine){ctx.moveTo(p.x,p.y);startedLine=true}else ctx.lineTo(p.x,p.y)});ctx.stroke()}
function renderSky(t,c){
 ctx.setTransform(dpr,0,0,dpr,0,0);var horizon=c.anchor-c.focal*c.zoom*c.tilt;
 var sky=ctx.createLinearGradient(0,0,0,horizon+80);sky.addColorStop(0,night?'#203858':'#81c9d5');sky.addColorStop(1,night?'#647d8b':'#d4e9b8');ctx.fillStyle=sky;ctx.fillRect(0,0,vw,vh);
 var sx=vw*.78,sy=horizon*.49;ctx.fillStyle=night?'#fcf1cf':'#fff4bf';ctx.shadowColor=night?'#e0efd744':'#fff7b999';ctx.shadowBlur=35;ctx.beginPath();ctx.arc(sx,sy,night?15:22,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle=night?'#d4dfdf17':'#ffffed80';for(var i=0;i<4;i++){var x=((i*.29+.12)*vw+t*2.5*(i%2?1:.6))%(vw+230)-70,y=35+(i%3)*horizon*.18;ctx.beginPath();ctx.ellipse(x,y,55,12,0,0,7);ctx.ellipse(x+28,y-8,37,17,0,0,7);ctx.ellipse(x-26,y-4,29,14,0,0,7);ctx.fill()}
 // A distant, low-contrast treeline separates the sky from the playable meadow.
 ctx.fillStyle=night?'#60796b':'#9cbb83';ctx.beginPath();ctx.moveTo(0,horizon+16);for(var x=0;x<=vw+20;x+=20)ctx.lineTo(x,horizon+11+Math.sin(x*.023)*6+Math.sin(x*.047)*3);ctx.lineTo(vw,horizon+55);ctx.lineTo(0,horizon+55);ctx.fill();return horizon;
}
render=function(t){
 clampCam();var c=perspectiveCamera(),horizon=renderSky(t,c),band=vh>=900?4:3;
 // Project horizontal ground strips. Characters remain upright and depth-scaled.
 ctx.setTransform(dpr,0,0,dpr,0,0);
 for(var sy=Math.max(0,Math.floor(horizon+14));sy<vh;sy+=band){var a=Motion.unproject(c,0,sy),b=Motion.unproject(c,vw,sy+band);if(!a||!b)continue;var mid=(a.y+b.y)/2,point=Motion.project(c,cam.x,mid),scale=c.zoom*point.scale;
  ctx.fillStyle=mid<0?'#a3ba75':mid>34.2*T?'#6abcb9':'#9abd59';ctx.fillRect(0,sy,vw,band+1);
  if(mid>=0&&mid<G.height){var sourceTop=Math.max(0,a.y),sourceBottom=Math.min(G.height,b.y);if(sourceBottom>sourceTop)ctx.drawImage(G,0,sourceTop,G.width,sourceBottom-sourceTop,vw/2-cam.x*scale,sy,G.width*scale,band+1)}
 }
 // Gentle distance haze, stronger at the horizon, never over the foreground text.
 var mist=ctx.createLinearGradient(0,horizon,0,horizon+200);mist.addColorStop(0,night?'#b4c5b733':'#e1ebbd80');mist.addColorStop(1,'#e1ebbd00');ctx.fillStyle=mist;ctx.fillRect(0,horizon,vw,200);
 // Rolling sea foam and a thin wet shoreline, all projected onto the same plane.
 for(var wave=0;wave<4;wave++){var points=[];for(var x=0;x<=W*T;x+=18){var y=(34.2+wave*.68)*T+Math.sin(x/95+t*.72+wave)*5+Math.sin(t*.65+wave)*4;points.push([x,y])}projectedLine(c,points,wave?'#d5f1df75':'#fff5d3c9',wave?1.8:3)}
 // Distant flowers are subtle, near flowers sway gently instead of blinking.
 flowers.forEach(function(f){var X=f[0]*T,Y=f[1]*T,p=worldTransform(c,X,Y);if(!p||p.x< -35||p.x>vw+35||p.y>vh+30)return;scenery.flower(X,Y,f[2],t,f[3]*6)});
 if(near&&worldTransform(c,near.x*T,near.y*T)){ctx.strokeStyle='#fff6cfbb';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(near.x*T,near.y*T,26,9,0,0,7);ctx.stroke()}
 if(target&&worldTransform(c,target.x*T,target.y*T)){ctx.strokeStyle='#fff3cbbb';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(target.x*T,target.y*T,11+Math.sin(t*4)*2,5,0,0,7);ctx.stroke()}
 stepDust.forEach(function(p){if(!worldTransform(c,p.x,p.y))return;var alpha=(1-p.age/.5)*.21;ellipse(p.x+p.side*8,p.y-p.age*13,3+p.age*9,2+p.age*5,'rgba(244,231,190,'+alpha+')')});
 var list=renderObjects.slice();if(started){var playerIndex=0;while(playerIndex<list.length&&list[playerIndex].y<=player.y)playerIndex++;list.splice(playerIndex,0,{x:player.x,y:player.y,kind:'player'})}
 list.forEach(function(o){
  var X=(o.x!=null?o.x:o.f?o.f.x+o.f.w/2:o.p?o.p.x+o.p.w/2:o.kind==='tent'?27:o.kind==='shed'?21.2:45)*T,Y=o.y*T,p=Motion.project(c,X,Y);
  if(!p||p.y>vh+260||p.scale>5)return;if(!o.f&&o.kind!=='sideRail'&&(p.x< -300*p.scale||p.x>vw+300*p.scale))return;
  if(o.kind==='sideRail'){drawPerspectiveRail(c,o);return}if(!worldTransform(c,X,Y))return;
  switch(o.kind){case 'shrub':window.IslandGarden.shrub(ctx,o.x*T,o.y*T,o.variant);break;case 'tree':drawTree(o,t);break;case 'crop':drawCrop(o.crop,o.x*T,o.y*T,t,o.phase);break;case 'fenceTop':drawFence(o.f,'top');break;case 'fenceBottom':drawFence(o.f,'bottom');break;case 'patch':drawPatch(o.p,t);break;case 'miniSign':drawMiniSign(o,t);break;case 'bigSign':textBoard(o.x*T,o.sy*T,o.label,o.sub,true,t);break;case 'tent':drawTent();break;case 'mailbox':drawMailbox(o);break;case 'diary':drawDiary(o,t);break;case 'shed':drawShed();break;case 'board':drawBoard(o);break;case 'screen':drawScreen();break;case 'bench':drawBench(o);break;case 'lamp':drawLamp(o,night);break;case 'telescope':drawTelescope(o);break;case 'player':drawPlayer(t);break}
 });
 if(night){
  nc.setTransform(1,0,0,1,0,0);nc.globalCompositeOperation='source-over';nc.clearRect(0,0,nightCv.width,nightCv.height);nc.fillStyle='rgba(24,37,66,.47)';nc.fillRect(0,0,nightCv.width,nightCv.height);nc.globalCompositeOperation='destination-out';
  function glow(x,y,r,height){var p=Motion.project(c,x,y);if(!p||p.scale>5)return;var s=c.zoom*p.scale*dpr,px=p.x*dpr,py=p.y*dpr-(height||0)*s,g=nc.createRadialGradient(px,py,0,px,py,r*s);g.addColorStop(0,'#000b');g.addColorStop(1,'#0000');nc.fillStyle=g;nc.beginPath();nc.arc(px,py,r*s,0,Math.PI*2);nc.fill()}
  glow(player.x*T,player.y*T,100,40);lamps.forEach(function(l){glow(l[0]*T-20,l[1]*T,95,86)});ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(nightCv,0,0);
  ctx.setTransform(dpr,0,0,dpr,0,0);for(var i=0;i<25;i++){ctx.fillStyle='rgba(255,248,211,'+(.3+.3*Math.sin(t*.6+i))+')';ctx.fillRect((i*173.5)%vw,(i*47.3)%Math.max(1,horizon-10),1.5,1.5)}
  flies.slice(0,18).forEach(function(f){var p=Motion.project(c,(f.x+Math.sin(t*.5+f.p))*T,(f.y+Math.cos(t*.4+f.p)*.5)*T);if(!p||p.y>vh||p.scale>4)return;ellipse(p.x,p.y,2*p.scale,2*p.scale,'rgba(230,247,165,'+(.35+.3*Math.sin(t+f.p))+')')});
 }
 ctx.setTransform(dpr,0,0,dpr,0,0);
};
function drawPerspectiveRail(c,o){var a=Motion.project(c,o.x*T,o.start*T),b=Motion.project(c,o.x*T,o.end*T);if(!a||!b||a.scale>5||b.scale>5)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';[8,18].forEach(function(h){ctx.strokeStyle='#aa8254';ctx.lineWidth=5*zoom*b.scale;ctx.beginPath();ctx.moveTo(a.x,a.y-h*zoom*a.scale);ctx.lineTo(b.x,b.y-h*zoom*b.scale);ctx.stroke();ctx.strokeStyle='#d7b778';ctx.lineWidth=3*zoom*b.scale;ctx.stroke()});if(worldTransform(c,o.x*T,o.end*T)){ctx.fillStyle='#d6b17a';roundRect(ctx,o.x*T-4,o.end*T-25,8,27,3);ctx.fill();ctx.fillStyle='#f0d193';ctx.fillRect(o.x*T-3,o.end*T-25,6,4)}}
// Distance-driven whole-sprite motion preserves the original full-body artwork.
drawVillager=function(x,y,t,skipShadow){
 var index={down:0,up:1,left:2,right:3}[player.dir],blend=reducedMotion?0:player.walkBlend||0;
 var pose=window.IslandVillager.gait(player.stride||0,blend,player.speed>3);
 if(!skipShadow){ctx.save();ctx.translate(x,y);ctx.scale(1,.34);var contact=ctx.createRadialGradient(3,1,2,3,1,23);contact.addColorStop(0,'#334b2c55');contact.addColorStop(.55,'#334b2c28');contact.addColorStop(1,'#334b2c00');ctx.fillStyle=contact;ctx.fillRect(-22,-23,50,50);ctx.restore()}ctx.save();ctx.translate(x,y);
 window.IslandVillager.draw(ctx,villagerFrames[index],player.dir,pose,reducedMotion?0:t,{dir:player.dir,stride:player.stride||0,moving:player.moving,running:player.running,blend:blend,idle:player.idleTime||0,gestureAge:player.gestureAge,reduced:reducedMotion});ctx.restore();
};
// Fuller canopies and textured bark have a readable silhouette from the lower camera.
var oldTree=drawTree;
drawTree=function(o){var X=o.x*T,Y=o.sy*T;ctx.save();ctx.translate(X,Y);ctx.scale(1.7,1.7);ctx.translate(-X,-Y);oldTree(o);var r=rng(Math.floor(o.x*27+o.sy*51));for(var i=0;i<20;i++){var a=r()*Math.PI*2,rad=r()*25,xx=X+Math.cos(a)*rad*o.s,yy=Y-55*o.s+Math.sin(a)*rad*.75*o.s;ctx.fillStyle=i%3?'#9dca7350':'#397c4c35';ctx.beginPath();ctx.moveTo(xx-4,yy);ctx.quadraticCurveTo(xx,yy-6,xx+5,yy);ctx.quadraticCurveTo(xx+1,yy+3,xx-4,yy);ctx.fill()}ctx.restore()};
// Sand, sea, and grass are baked once; sparse soft texture replaces the dot-like field.
var groundPass=drawGround;drawGround=function(){groundPass();var r=rng(81);g.fillStyle='#ffffcf0d';for(var i=0;i<28000;i++){var x=r()*G.width,y=r()*31*T;g.fillRect(x,y,.8+r()*1.6,.8+r()*1.2)}var sea=g.createLinearGradient(0,34.2*T,0,H*T);sea.addColorStop(0,'#7fcabd');sea.addColorStop(1,'#3d9fba');g.fillStyle=sea;g.fillRect(0,34.2*T,W*T,H*T-34.2*T)};drawGround();

/* Scenery material pass. Images load locally; no service is called at runtime. */
var scenery=window.IslandScenery.create(ctx,FONT),props3d=window.IslandProps3D.create(ctx,Motion,FONT),treeFallback=drawTree;
drawTree=function(o,t){
 var camera=perspectiveCamera(),p=Motion.project(camera,o.x*T,o.sy*T),actor=Motion.project(camera,player.x*T,player.y*T),covered=false;
 if(started&&o.sy>player.y&&p&&actor){var h=195*o.s*zoom*p.scale,actorScale=zoom*actor.scale;covered=Math.abs(p.x-actor.x)<h*.39+20*actorScale&&actor.y>p.y-h&&actor.y-90*actorScale<p.y-h*.25}
 var opacity=covered?.38:1;o.sceneryOpacity=reducedMotion?opacity:(o.sceneryOpacity==null?1:o.sceneryOpacity)+(opacity-(o.sceneryOpacity==null?1:o.sceneryOpacity))*.12;
 ctx.save();ctx.globalAlpha*=o.sceneryOpacity;if(!scenery.tree(o,t||0))treeFallback(o);ctx.restore();
};
drawTent=function(){scenery.house(27*T,(TENT.y+TENT.h)*T)};
drawShed=function(){props3d.shed((SHED.x+SHED.w/2)*T,(SHED.y+SHED.h)*T,perspectiveCamera())};
drawBench=function(o){scenery.bench(o.x*T,o.sy*T)};
drawLamp=function(o,n){props3d.lamp(o.x*T,o.sy*T,perspectiveCamera(),n)};
drawBoard=function(o){scenery.board(o.x*T,o.sy*T)};
drawMailbox=function(o){scenery.mailbox(o.x*T,o.sy*T)};
drawDiary=function(o){scenery.diary(o.x*T,o.sy*T)};
drawScreen=function(){scenery.screen(45*T,19.4*T)};
drawCrop=function(type,x,y,t,phase){scenery.crop(type,x,y,t,phase)};
drawFence=function(f,which){scenery.fence(f,which)};
var smallTextBoard=textBoard;
textBoard=function(x,y,label,sub,big,t){return big?scenery.sign(x,y,label,sub):smallTextBoard(x,y,label,sub,big,t)};
drawPerspectiveRail=function(c,o){
 var a=Motion.project(c,o.x*T,o.start*T),b=Motion.project(c,o.x*T,o.end*T);if(!a||!b||a.scale>5||b.scale>5)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';[11,24].forEach(function(h){ctx.strokeStyle='#89653f';ctx.lineWidth=6*zoom*b.scale;ctx.beginPath();ctx.moveTo(a.x,a.y-h*zoom*a.scale);ctx.lineTo(b.x,b.y-h*zoom*b.scale);ctx.stroke();ctx.strokeStyle='#dbb77f';ctx.lineWidth=3.8*zoom*b.scale;ctx.stroke()});
 if(worldTransform(c,o.x*T,o.end*T))scenery.post(o.x*T,o.end*T);
};
// Soil belongs on the ground plane; each plant is an independent upright object.
renderObjects=renderObjects.filter(function(o){return o.kind!=='patch'});
FIELDS.forEach(function(f){f.patches.forEach(function(p){var rows=2,cols=Math.round(p.w*1.35);for(var r=0;r<rows;r++)for(var k=0;k<cols;k++)renderObjects.push({kind:'crop',x:p.x+(k+.5)*p.w/cols,y:p.y+(r+.72)*p.h/rows,crop:p.item[4],phase:(k*7+r*3)%10/10})})});
var previousGround=drawGround;
drawGround=function(){previousGround();FIELDS.forEach(function(f){f.patches.forEach(function(p){var x=p.x*T,y=p.y*T,w=p.w*T,h=p.h*T;
 g.fillStyle='#66864333';roundRect(g,x-3,y-2,w+6,h+8,12);g.fill();
 var soil=g.createLinearGradient(x,y,x,y+h);soil.addColorStop(0,'#a78050');soil.addColorStop(1,'#9a7146');g.fillStyle=soil;roundRect(g,x,y,w,h,10);g.fill();
 for(var row=0;row<2;row++){var cy=y+(row+.72)*h/2;g.strokeStyle='#674c3145';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(x+9,cy+2);g.lineTo(x+w-9,cy+2);g.stroke();g.strokeStyle='#dab78870';g.lineWidth=2;g.beginPath();g.moveTo(x+9,cy-4);g.lineTo(x+w-9,cy-4);g.stroke()}
 var random=rng(Math.floor(x+y));for(var i=0;i<110;i++){g.fillStyle=i%2?'#e3bf8350':'#66462930';g.fillRect(x+5+random()*(w-10),y+5+random()*(h-10),1.5+random()*2,1)}
 })})};drawGround();

// Match the title courtyard with a baked lawn, stone paths and low flower shrubs.
drawGround=function(){window.IslandGarden.ground(g,G,paths,FIELDS,objs)};
window.IslandGarden.onReady(drawGround);drawGround();
[[23,10],[30.4,10.8],[24.1,12.5],[30.5,14],[24,18.3],[29.9,22.4],[19.2,18],[38.1,18.2],[42,25.8],[20.5,28.2],[29,29],[9,28.8],[47,28],[3,14],[50.4,14.5],[18.3,23.9],[33,23.5],[38,27],[13.5,29],[44,28.5],[6,17.8],[16,17.8],[36.7,21.7],[48.5,22.8]].forEach(function(p,i){
 if(freeAt(p[0],p[1])&&!inter.some(function(it){return Math.hypot(it.tx-p[0],it.ty-p[1])<1.3}))renderObjects.push({kind:'shrub',x:p[0],y:p[1],variant:i%3});
});
renderObjects.sort(function(a,b){return a.y-b.y});
// A continuous 3D island, with the same movement coordinates and portfolio content.
var courtyard=window.IslandCourtyard,routePending=[];
courtyard.configure(inter,player,solids);cam.x=player.x*T;cam.y=player.y*T;
blocked=courtyard.blocked;
clampCam=function(){var c=courtyard.camera(vw,vh,cam.x,cam.y);cam.x=c.x;cam.y=c.y};
render=function(t){var c=courtyard.camera(vw,vh,cam.x,cam.y);return courtyard.render(ctx,c,dpr,player,night,t,FONT,function(time){drawVillager(0,0,time,true)},near,target)};
cv.addEventListener('pointerdown',function(e){
 e.stopImmediatePropagation();if(!started||modalOpen()||talkOpen())return;cv.focus({preventScroll:true});hideTravel();
 var c=courtyard.camera(vw,vh,cam.x,cam.y),hit=courtyard.hit(c,ctx,FONT,e.clientX,e.clientY),p=courtyard.unproject(c,e.clientX,e.clientY);
 var actor=courtyard.project(c,player.x*T,player.y*T),size=c.px*2.4/103;
 if(Math.abs(e.clientX-actor.x)<27*size&&e.clientY>actor.y-103*size&&e.clientY<actor.y+4){greet();return}
 var it=hit?findInter(hit.id):null,dest=it?{x:it.tx,y:it.ty}:{x:p.x/T,y:p.y/T};
 if(it&&Math.hypot(player.x-dest.x,player.y-dest.y)<1.9){resetMovement();guideReturn=null;openPlace(it);return}
 if(!blocked(dest.x,dest.y)){resetMovement();routePending=courtyard.route(player,dest);if(routePending.length){routePending[routePending.length-1].it=it;target=routePending.shift()}}
},true);
requestAnimationFrame(loop);
if(location.hash.length>1){begin()}
})();


