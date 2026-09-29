/* Continuous, locally rendered hanok island. X/Z are movement units, Y is height.
   Terrain, paths, bridge and collision are spatial; individually keyed artwork supplies the detailed props and vegetation. */
(function(root){
 'use strict';
 var width=64*40,height=66*40,obstacles=[],labels=[],beds=[],places={
  home:[18,14.8],mail:[13,16],diary:[24.5,15.5],others:[27.8,21.5],skills:[12,29],
  'sec:work':[21,31],'sec:projects':[48,23],'sec:plans':[11.3,52.9],
  video:[49,52],welcome:[25,20.7],star:[56,52]
 },work=['work-app','work-skill','work-edu','work-admin','work-itium','work-multilang','work-biz'],proj=['proj-mfg','proj-power','proj-elderly','proj-cellu','proj-retail','proj-onebin'];
 work.forEach(function(id,i){var x=i%2?25:15,z=35+Math.floor(i/2)*4.6;beds.push({id:id,x:x,z:z,w:6,d:2.7,type:i%4});places[id]=[x,z+2.05]});
 proj.forEach(function(id,i){var x=i%2?55:45,z=28+Math.floor(i/2)*5;beds.push({id:id,x:x,z:z,w:6,d:3,type:(i+1)%4});places[id]=[x,z+2.2]});
 ['etc-bioseptic','etc-aicl'].forEach(function(id,i){var x=12+i*10,z=56;beds.push({id:id,x:x,z:z,w:6,d:2.7,type:4});places[id]=[x,z+2.05]});
 function rect(x,z,w,d){obstacles.push({x:x,z:z,w:w,d:d})}
 function circle(x,z,r){obstacles.push({x:x,z:z,r:r})}
 function banks(z){var q=z-19,b=(.8*Math.sin(q*.13)+.5*Math.sin(q*.27))*(1-Math.exp(-q*q/25));return [33+b,41+b]}
 function elevation(x,z){return x>=33&&x<=41&&Math.abs(z-19)<1.85?.10+Math.sin((x-33)/8*Math.PI)*.85:0}
 function blocked(x,z){
  if(x<3||x>61||z<4||z>62)return true;
  var shore=banks(z);if(x>shore[0]&&x<shore[1]&&Math.abs(z-19)>1.48)return true;
  return obstacles.some(function(o){return o.r?Math.hypot(x-o.x,z-o.z)<o.r+.22:Math.abs(x-o.x)<o.w/2+.22&&Math.abs(z-o.z)<o.d/2+.22});
 }
 // Navigation and drawing share these footprints; no independent painted boundaries.
 rect(18,9.5,10,7.4);rect(12,26,4.8,3.7);rect(24.5,14,2.5,1.1);rect(27.8,20,2.6,.5);rect(13,15,.55,.6);
 beds.forEach(function(b){rect(b.x,b.z,b.w,b.d)});
 rect(49,57.6,7,.55);rect(46,49.5,2.8,.7);rect(52,49.5,2.8,.7);
 circle(12.6,13.2,.5);circle(56,50.5,.55);
 var fences=[[9,32,9,49.8],[29,32,29,49.8],[9,32,17.8,32],[22.2,32,29,32],[9,50,17.8,50],[22.2,50,29,50],[42,25,42,41.5],[58,25,58,41.5],[42,25,48,25],[52,25,58,25]],lanterns=[[22.5,18],[30.5,17],[43,17],[22.5,30],[24,53],[52,46]];
 fences.forEach(function(p){rect((p[0]+p[2])/2,(p[1]+p[3])/2,Math.max(.2,Math.abs(p[2]-p[0])),Math.max(.2,Math.abs(p[3]-p[1])))});
 lanterns.forEach(function(p){circle(p[0],p[1],.2)});
 [[16.5,30],[46,23],[11.3,54],[25,18.5]].forEach(function(p){rect(p[0],p[1],2.6,.25)});
 var trees=[];function treeAt(x,z,s,fruit){trees.push({x:x,z:z,s:s,fruit:fruit});circle(x,z,.43*s)}
 for(var i=0;i<18;i++){var x=4+i*3.3;if(x>32&&x<42)continue;treeAt(x,5+(i%3)*.6,.9+(i%4)*.07,i%3===0);if((x<8||x>27)&&(x<43||x>55))treeAt(x,62-(i%2)*.6,.85,i%3===1)}
 for(var j=0;j<16;j++){treeAt(4+(j%2)*.6,9+j*3.2,1,j%3===1);treeAt(63-(j%2)*.3,9+j*3.2,.82,j%3===2)}
 [[8,12],[9,18],[29.5,8],[29,12],[30.5,25],[31,31],[31,40],[30.8,51],[8,33],[8,43],[8,52],[44,9],[50,9],[56,12],[44,14],[57,19],[43,44],[58,45],[60,58]].forEach(function(p,i){treeAt(p[0],p[1],1.05,i%2===0)});
 function configure(inter,player,solids){solids.length=0;inter.forEach(function(it){var p=places[it.id]||places.welcome;it.x=it.tx=p[0];it.y=it.ty=p[1];it.r=it.kind==='item'?1.5:1.9});player.x=20;player.y=19;player.dir='down'}
 function route(a,b){
  if(blocked(b.x,b.y))return [];
  var step=.5,nx=129,nz=133,start=Math.round(a.y/step)*nx+Math.round(a.x/step),goal=Math.round(b.y/step)*nx+Math.round(b.x/step),queue=[start],prev=new Map([[start,-1]]),head=0;
  while(head<queue.length){var n=queue[head++];if(n===goal)break;var x=n%nx,z=Math.floor(n/nx);
   [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(d){var xx=x+d[0],zz=z+d[1],k=zz*nx+xx;if(xx<0||xx>=nx||zz<0||zz>=nz||prev.has(k)||blocked(xx*step,zz*step))return;if(d[0]&&d[1]&&(blocked(x*step,zz*step)||blocked(xx*step,z*step)))return;prev.set(k,n);queue.push(k)})
  }
  if(!prev.has(goal))return [];var result=[{x:b.x,y:b.y}];for(var k=goal;k!==start;k=prev.get(k))result.push({x:k%nx*step,y:Math.floor(k/nx)*step});result.reverse();return result;
 }
 var THREE,scene,renderer,cam3,sun,ambient,actor,actorTexture,actorCanvas,actorContext,shadow,water,waves=[],lamplights=[],lampGlows=[],treeSprites=[],ready=false,lastSize='',lastNight=null,lastPose=-1,shadowCenter=null;
 var sin=Math.sin(50*Math.PI/180),cos=Math.cos(50*Math.PI/180);
 function camera(w,h,x,y){var px=Math.max(h/(w<h?23:22),w/65),half=w/px/2;
  x=Math.max((-1+half)*40,Math.min((64-half)*40,x));
  y=Math.max((-4+h*.57/(px*sin))*40,Math.min((70-h*.43/(px*sin))*40,y));
  return {width:w,height:h,x:x,y:y,scale:px/40,px:px,ox:w/2,oy:h*.57}}

 function project(c,x,y,h){return {x:c.ox+(x-c.x)/40*c.px,y:c.oy+(y-c.y)/40*c.px*sin-(h||elevation(x/40,y/40))*c.px*cos}}
 function unproject(c,x,y){var wx=c.x/40+(x-c.ox)/c.px,wz=c.y/40+(y-c.oy)/(c.px*sin);for(var i=0;i<3;i++)wz=c.y/40+(y-c.oy+elevation(wx,wz)*c.px*cos)/(c.px*sin);return {x:wx*40,y:wz*40}}
 function hit(c,ctx,font,x,y){return labels.slice().reverse().find(function(l){if(!l.baked&&!l.visible)return false;var p=project(c,l.x*40,l.z*40,l.h||0);return Math.abs(p.x-x)<Math.max(44,l.text.length*7)&&y>p.y-24&&y<p.y+9})}
 function initialize(){
  if(ready)return;THREE=root.THREE;if(!THREE)throw new Error('Three.js must be loaded before the island');
  scene=new THREE.Scene();scene.background=new THREE.Color('#d6e8bd');scene.fog=new THREE.Fog('#d6e8bd',55,100);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
  renderer.domElement.id='island-3d';renderer.domElement.setAttribute('aria-hidden','true');document.getElementById('game').before(renderer.domElement);
  cam3=new THREE.OrthographicCamera(-18,18,10,-10,.1,130);
  ambient=new THREE.HemisphereLight('#fff8da','#688455',2.1);scene.add(ambient);
  sun=new THREE.DirectionalLight('#fff0d4',3.2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;sun.shadow.camera.near=1;sun.shadow.camera.far=95;sun.shadow.normalBias=.055;sun.shadow.bias=-.0001;sun.shadow.radius=3;scene.add(sun,sun.target);
  var batch=new Map(),geos={},materials={},dummy=new THREE.Object3D();
  function texture(kind){var cv=document.createElement('canvas');cv.width=cv.height=256;var g=cv.getContext('2d'),seed=36;function random(){seed=(seed*16807)%2147483647;return seed/2147483647}
   g.fillStyle=kind==='wood'?'#b47a3c':kind==='stone'?'#b9b4b2':kind==='sand'?'#dac18c':kind==='soil'?'#96724b':'#8eb656';g.fillRect(0,0,256,256);
   for(var i=0;i<1800;i++){var x=random()*256,y=random()*256;g.fillStyle=kind==='wood'?'rgba(75,39,12,'+(random()*.13)+')':kind==='stone'?'rgba(255,250,224,'+(random()*.16)+')':'rgba(218,225,126,'+(random()*.3)+')';g.fillRect(x,y,kind==='wood'?20+random()*75:1+random()*5,kind==='wood'?.5+random():1+random()*5)}
   if(kind==='grass')for(var j=0;j<95;j++){var x=random()*256,y=random()*256,s=3+random()*8;g.fillStyle=j%2?'#b4ca6b55':'#5a994533';g.beginPath();g.moveTo(x,y-s);g.lineTo(x-s*.65,y+s*.3);g.lineTo(x+s*.65,y+s*.3);g.fill()}
   if(kind==='soil'){g.fillStyle='#907047';g.fillRect(0,0,256,256);for(var j=0;j<1200;j++){g.fillStyle=j%3?'#c5a16a55':'#503d293a';g.beginPath();g.ellipse(random()*256,random()*256,2+random()*7,1+random()*4,random()*3,0,7);g.fill()}}
   if(kind==='sand'){
    g.fillStyle='#dfb478';g.fillRect(0,0,256,256);
    for(var j=0;j<180;j++){var x=random()*256,y=random()*256,r=8+random()*24,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,j%2?'#f7d49950':'#9e693327');gr.addColorStop(1,'#d9b47900');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
    for(var j=0;j<600;j++){g.fillStyle=j%3?'#f5d69b60':'#aa805047';g.beginPath();g.ellipse(random()*256,random()*256,1+random()*2,.5+random(),random()*3,0,7);g.fill()}
   }
   var t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='grass'?30:1,kind==='grass'?30:1);t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t}
  var woodTex=root.WorldArt.get('wood0')?new THREE.CanvasTexture(root.WorldArt.get('wood0')):texture('wood'),stoneTex=texture('stone'),grassTex=new THREE.TextureLoader().load(root.WORLD_GRASS_SOURCE);grassTex.colorSpace=THREE.SRGBColorSpace;grassTex.wrapS=grassTex.wrapT=THREE.RepeatWrapping;grassTex.repeat.set(1,1);grassTex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  woodTex.colorSpace=THREE.SRGBColorSpace;woodTex.wrapS=woodTex.wrapT=THREE.RepeatWrapping;woodTex.repeat.set(.18,.8);
  function mat(key,color,map){if(!materials[key])materials[key]=new THREE.MeshStandardMaterial({color:color,roughness:.88,metalness:0,map:map||null});return materials[key]}
  var wood=mat('wood','#fff5e1',woodTex),darkwood=mat('darkwood','#906138',woodTex),lightwood=mat('lightwood','#fff8ed',woodTex),roof=mat('roof','#52606b'),roofEdge=mat('roofedge','#727e86'),plaster=mat('plaster','#f7edcf'),stone=mat('stone','#dcdaca',stoneTex),soil=mat('soil','#ffffff',texture('soil')),soilLine=mat('soilLine','#b08651'),paper=mat('paper','#ffedb5'),leafs=['#5c9d48','#72b44d','#8cb953','#489153','#a4c868'].map(function(c,i){return mat('leaf'+i,c)}),red=mat('red','#e94c30'),fruitGold=mat('gold','#edb944'),stem=mat('stem','#558745');
  paper.emissive=new THREE.Color('#ffc365');paper.emissiveIntensity=.28;
  geos.box=new THREE.BoxGeometry(1,1,1);geos.ball=new THREE.SphereGeometry(1,12,8);geos.cylinder=new THREE.CylinderGeometry(1,1,1,10);geos.cone=new THREE.ConeGeometry(1,1,12);
  var leafShape=new THREE.Shape();leafShape.moveTo(0,-1);leafShape.bezierCurveTo(-.18,-.55,-.85,-.15,-.62,.35);leafShape.bezierCurveTo(-.45,.8,-.12,.9,0,1);leafShape.bezierCurveTo(.12,.9,.45,.8,.62,.35);leafShape.bezierCurveTo(.85,-.15,.18,-.55,0,-1);
  geos.leaf=new THREE.ExtrudeGeometry(leafShape,{depth:.06,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.065,bevelThickness:.045,curveSegments:4});
  var shape=new THREE.Shape();shape.moveTo(-.42,-.42);shape.lineTo(.42,-.42);shape.quadraticCurveTo(.5,-.42,.5,-.34);shape.lineTo(.5,.42);shape.quadraticCurveTo(.5,.5,.42,.5);shape.lineTo(-.42,.5);shape.quadraticCurveTo(-.5,.5,-.5,.42);shape.lineTo(-.5,-.34);shape.quadraticCurveTo(-.5,-.42,-.42,-.42);
  geos.round=new THREE.ExtrudeGeometry(shape,{depth:.86,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.05,bevelThickness:.07,curveSegments:3});geos.round.translate(0,0,-.43);
  function add(type,m,x,y,z,sx,sy,sz,rx,ry,rz){var key=type+':'+m.uuid;if(!batch.has(key))batch.set(key,{g:geos[type],m:m,items:[]});dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(rx||0,ry||0,rz||0);dummy.updateMatrix();batch.get(key).items.push(dummy.matrix.clone())}
  function box(m,x,y,z,w,h,d){add('round',m,x,y,z,w,h,d)}
  function ball(m,x,y,z,rx,ry,rz){add('ball',m,x,y,z,rx,ry,rz)}
  function beam(m,a,b,r){var v=new THREE.Vector3().subVectors(new THREE.Vector3(...b),new THREE.Vector3(...a));dummy.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);dummy.scale.set(r,v.length(),r);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());dummy.updateMatrix();var key='cylinder:'+m.uuid;if(!batch.has(key))batch.set(key,{g:geos.cylinder,m:m,items:[]});batch.get(key).items.push(dummy.matrix.clone())}
  var artTextures={};
  function art(key,x,z,h,caption){var img=key.indexOf('prop')===0?root.WorldArt.prop(+key.slice(4)):root.WorldArt.get(key);if(!img)return;
   if(caption){
    var painted=document.createElement('canvas'),ratio=2;painted.width=img.width*ratio;painted.height=img.height*ratio;
    var ink=painted.getContext('2d');ink.drawImage(img,0,0,painted.width,painted.height);ink.textAlign='center';ink.textBaseline='middle';ink.fillStyle='#49371f';
    var lines=caption.split('\n'),fs=painted.height*(key==='prop0'?.044:.175),maxW=painted.width*(key==='prop0'?.32:.83);
    ink.font='600 '+fs+'px "Noto Sans KR",sans-serif';
    while(lines.some(function(line){return ink.measureText(line).width>maxW})&&fs>10){fs-=1;ink.font='600 '+fs+'px "Noto Sans KR",sans-serif'}
    lines.forEach(function(line,i){ink.fillText(line,painted.width*.5,painted.height*(key==='prop0'?.45:.40)+(i-(lines.length-1)/2)*fs*1.3)});
    img=painted;key+=':'+caption
   }
   if(!artTextures[key]){artTextures[key]=new THREE.CanvasTexture(img);artTextures[key].colorSpace=THREE.SRGBColorSpace}var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:artTextures[key],transparent:true,alphaTest:.08,depthWrite:true,toneMapped:false}));sp.center.set(.5,0);sp.scale.set(h*img.width/img.height,h,1);sp.position.set(x,.025,z);scene.add(sp);treeSprites.push(sp);return sp;
  }
  function land(side){var pos=[],uv=[],indices=[],edge=[],rows=164;
   for(var i=0;i<=rows;i++){var z=-30+i*.8,x=banks(z)[side],outer=side?104:-40;edge.push([x,z]);var a=side?x:outer,b=side?outer:x;pos.push(a,0,z,b,0,z);uv.push(a/14,z/14,b/14,z/14);if(i<rows){var n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3)}}
   var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();var mesh=new THREE.Mesh(geo,mat('grass','#ffffff',grassTex));mesh.receiveShadow=true;scene.add(mesh);
   for(var band=0;band<3;band++){var vertices=[],bankUv=[],ids=[],y0=-band*.58,y1=-(band+1)*.58;edge.forEach(function(p,i){bankUv.push(p[1]/3,band/3,p[1]/3,(band+1)/3);vertices.push(p[0]+(side?-.35:.35)*band,y0,p[1],p[0]+(side?-.35:.35)*(band+1),y1,p[1]);if(i<rows){var n=i*2;ids.push(n,n+1,n+2,n+1,n+3,n+2)}});var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(bankUv,2));g.setIndex(ids);g.computeVertexNormals();var m=mat('bank'+band,['#ffe4bc','#f4bf99','#dcab87'][band],stoneTex);m.side=THREE.DoubleSide;var cliff=new THREE.Mesh(g,m);cliff.receiveShadow=true;scene.add(cliff)}
  }
  land(0);land(1);
  var waterMap=new THREE.CanvasTexture(root.WorldArt.get('water0'));waterMap.colorSpace=THREE.SRGBColorSpace;waterMap.wrapS=waterMap.wrapT=THREE.RepeatWrapping;waterMap.repeat.set(1.4,12);
  water=new THREE.Mesh(new THREE.PlaneGeometry(16,140),new THREE.MeshBasicMaterial({map:waterMap,color:'#ffffff',toneMapped:false}));water.rotation.x=-Math.PI/2;water.position.set(37,-1.4,33);scene.add(water);
  var waterShadow=new THREE.Mesh(new THREE.PlaneGeometry(16,140),new THREE.ShadowMaterial({color:'#234c77',opacity:.22,depthWrite:false}));waterShadow.rotation.x=-Math.PI/2;waterShadow.position.set(37,-1.395,33);waterShadow.receiveShadow=true;scene.add(waterShadow);
  for(var i=0;i<42;i++){var wave=new THREE.Mesh(new THREE.CircleGeometry(1,16),new THREE.MeshBasicMaterial({color:'#f1fbff',transparent:true,opacity:.72,depthWrite:false,toneMapped:false}));wave.rotation.x=-Math.PI/2;wave.rotation.z=(i%5-2)*.12;wave.scale.set(.14+(i%4)*.07,.05+(i%3)*.012,1);wave.userData.z=2+i*1.48;wave.userData.across=.2+((i*17)%29)/48;scene.add(wave);waves.push(wave)}
  // Worn paths are horizontal surfaces in the same coordinate system as the crops.
  var pathmat=mat('path','#ffffff',texture('sand'));
  function path(points,w){var curve=new THREE.CatmullRomCurve3(points.map(function(p){return new THREE.Vector3(p[0],.018,p[1])})),n=Math.max(16,Math.ceil(curve.getLength()*7)),pos=[],uv=[],ids=[];
   for(var i=0;i<=n;i++){var t=i/n,p=curve.getPoint(t),v=curve.getTangent(t),r=w/2+.055*Math.sin(i*1.9)+.035*Math.sin(i*.67);pos.push(p.x-v.z*r,.022,p.z+v.x*r,p.x+v.z*r,.022,p.z-v.x*r);uv.push(0,t*curve.getLength()/3,1,t*curve.getLength()/3);if(i<n){var k=i*2;ids.push(k,k+2,k+1,k+1,k+2,k+3)}}var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ids);g.computeVertexNormals();var mesh=new THREE.Mesh(g,pathmat);mesh.receiveShadow=true;scene.add(mesh)
  }
  path([[18,12],[20,18],[20,29],[20,60]],2.3);path([[20,19],[33,19]],2.7);path([[41,19],[50,19],[50,47],[49,55]],2.6);path([[10,31],[29,31]],1.7);path([[10,52],[29,52]],1.5);
  [37.4,42,46.6,51.2].forEach(function(z){path([[10,z],[29,z]],1.35)});[30.6,35.6,40.6].forEach(function(z){path([[42,z],[58,z]],1.3)});
  // Bridge: arched planks, continuous rails, and collision/elevation use the same span.
  for(var i=0;i<41;i++){var x=33+i*8/40,y=elevation(x,19);box(wood,x,y-.04,19,.205,.15,3.55);if(i%5===0)[-1,1].forEach(function(s){beam(lightwood,[x,y,19+s*1.7],[x,y+1.3,19+s*1.7],.14);ball(lightwood,x,y+1.34,19+s*1.7,.17,.10,.17)})}
  for(var i=0;i<40;i++)[-1,1].forEach(function(s){var x=33+i*8/40,xx=x+8/40;
   beam(lightwood,[x,elevation(x,19)+1.12,19+s*1.7],[xx,elevation(xx,19)+1.12,19+s*1.7],.135);
   beam(wood,[x,elevation(x,19)-.06,19+s*1.7],[xx,elevation(xx,19)-.06,19+s*1.7],.14)
  });
  function roofAt(x,z,w,d,y){
   var rise=Math.min(1.65,d*.28),n=Math.ceil(w/.30);
   for(var side=-1;side<=1;side+=2)for(var row=0;row<=n;row++){var xx=x-w/2+row*w/n,edge=Math.pow(Math.abs(xx-x)/(w/2),5)*.26;for(var seg=0;seg<7;seg++){var a=seg/7,b=(seg+1)/7;function yy(t){return y+rise*(1-t)+.40*t*t*t+edge*t}beam(row%4?roof:roofEdge,[xx,yy(a),z+side*d/2*a],[xx,yy(b),z+side*d/2*b],.18)}
    [-1,1].forEach(function(s){ball(roofEdge,xx,y+.40+edge,z+s*d/2,.185,.185,.14);ball(roof,xx,y+.40+edge,z+s*(d/2+.12),.105,.10,.015)})}
   beam(roofEdge,[x-w/2-.08,y+rise+.12,z],[x+w/2+.08,y+rise+.12,z],.23);
  }
  function house(x,z,w,d,small){var y=small?2.4:3.3;box(stone,x,.25,z,w+.5,.5,d+.5);box(wood,x,.58,z,w+.25,.22,d+.2);box(plaster,x,y/2+.5,z,w,y,d);
   for(var i=-1;i<=1;i++){box(darkwood,x+i*(w/2-.15),y/2+.5,z+d/2+.035,.22,y,.24)}
   box(darkwood,x,y+.45,z+d/2+.05,w+.15,.22,.26);
   [-1,1].forEach(function(s){var xx=x+s*w*.14;box(wood,xx,1.7,z+d/2+.13,w*.25,2.25,.19);box(paper,xx,2,z+d/2+.25,w*.19,1.45,.04);for(var j=0;j<5;j++){box(lightwood,xx-w*.09+j*w*.045,2,z+d/2+.28,.035,1.45,.045)}for(var j=0;j<6;j++)box(lightwood,xx,1.4+j*.24,z+d/2+.29,w*.2,.035,.045);ball(darkwood,x+s*.16,1.5,z+d/2+.32,.065,.11,.04)});
   if(!small)[-1,1].forEach(function(s){box(paper,x+s*w*.37,2,z+d/2+.13,1.45,1.4,.1);for(var j=0;j<6;j++)box(wood,x+s*w*.37-.65+j*.26,2,z+d/2+.22,.055,1.5,.12);for(var j=0;j<4;j++)box(wood,x+s*w*.37,1.4+j*.4,z+d/2+.22,1.5,.055,.12)});
   roofAt(x,z,w+1.9,d+1.3,y+.6);box(wood,x,.65,z+d/2+.7,w+1,.2,1.3);for(var i=0;i<3;i++)box(stone,x,.12+i*.11,z+d/2+1.5-i*.33,2.6,.22,.65)
  }
  for(var wx=8;wx<60;wx+=5){if(wx>30&&wx<43)continue;art('flora4',wx,6.5,1.9)}
  art('house0',18,13.3,7.8);art('prop0',12,27.8,4.7,'도구 창고');
  [[18,14.1],[18.4,15.2],[18.8,16.3],[19.3,17.4]].forEach(function(p,i){
   if(root.WorldArt.get('steppingStone0')){var slab=art('steppingStone0',p[0],p[1]+.25,.78+(i%2)*.07);slab.material.rotation=(i%3-1)*.08;slab.position.y=.055;slab.renderOrder=-1}
  });
  art('flora2',12.6,13.2,1.5);
  function label(id,text,x,z,h){labels.push({id:id,text:text,x:x,z:z,h:h||0})}
  label('skills','도구 창고',12,28.8);labels[labels.length-1].baked=true;
  function fence(x1,z1,x2,z2){var len=Math.hypot(x2-x1,z2-z1),n=Math.ceil(len/1.6);for(var i=0;i<=n;i++){var x=x1+(x2-x1)*i/n,z=z1+(z2-z1)*i/n;beam(lightwood,[x,0,z],[x,1.12,z],.14);ball(lightwood,x,1.15,z,.15,.11,.15)}[.45,.86].forEach(function(y){beam(lightwood,[x1,y,z1],[x2,y,z2],.09)})}
  // Gates remain open on the central lanes. Fences delimit places, not the walking route.
  fences.forEach(function(p){fence(...p)});
  function lantern(x,z){var lamp=art('prop1',x-.48,z,4.1);var light=new THREE.PointLight('#ffd694',0,6,2);light.position.set(x-.7,2.7,z);scene.add(light);lamplights.push(light);
   var cv=document.createElement('canvas');cv.width=cv.height=128;var gc=cv.getContext('2d'),gr=gc.createRadialGradient(64,64,3,64,64,64);gr.addColorStop(0,'#fff2bfce');gr.addColorStop(.22,'#ffd57975');gr.addColorStop(1,'#ffcd6600');gc.fillStyle=gr;gc.fillRect(0,0,128,128);
   var halo=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending}));halo.position.set(x-1.15,3.72,z+.06);halo.scale.set(1.8,1.8,1);halo.material.opacity=.6;scene.add(halo);lampGlows.push(halo);
   var pool=new THREE.Mesh(new THREE.PlaneGeometry(5,5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending,opacity:.13}));pool.rotation.x=-Math.PI/2;pool.position.set(x-.9,.055,z);scene.add(pool);lampGlows.push(pool)
  }
  lanterns.forEach(function(p){lantern(p[0],p[1])});
  function sign(id,text,x,z){art('prop3',x,z,id==='welcome'?2:1.8,text);label(id,text,x,z,1.45);labels[labels.length-1].baked=true}
  sign('sec:work','작업실 밭',16.5,30);sign('sec:projects','AI 프로젝트 밭',46,23);sign('sec:plans','새싹 밭',11.3,54);sign('welcome','← 한옥 · 밭 ↓\n다리 →',25,18.5);
  art('prop2',27.8,20.3,3.4);label('others','게시판',27.8,21.4);
  art('prop5',24.5,14.5,1.65);label('diary','일기장',24.5,15.2);
  art('prop6',13,15.3,2.65);label('mail','우편함',13,16);
  // Seats sit north of the screen; leave the central approach and viewing area open.
  art('prop4',49,58,4);label('video','야외 영화관',49,52);
  [46,52].forEach(function(x){art('prop7',x,49.8,1.7)});
  [[-.4,.3],[.4,.3],[0,-.4]].forEach(function(p){beam(wood,[56+p[0],0,50.5+p[1]],[56,1.3,50.5],.06)});beam(roofEdge,[56,1.3,50.8],[56,1.7,49.9],.19);label('star','별빛 쉼터',56,51.7);
  var cropNames=['TripDoc 앱','Claude Skill','AI 교육','관리자 페이지','아이티움','다국어 소개서','신사업 기획','제조 품질 예측','생산지수 예측','교통사고 위험','Cellu 혈당','수요 예측','OneBin','BioSeptic','화재 대피'];
  beds.forEach(function(b,index){box(soil,b.x,.045,b.z,b.w,.14,b.d);
   for(var row=0;row<2;row++){box(soilLine,b.x,.09,b.z+(row?.65:-.65),b.w-.3,.05,.28);for(var col=0;col<4;col++){var x=b.x-b.w/2+.8+col*(b.w-1.6)/3,z=b.z+(row?.65:-.65),type=index<7?[0,2,1,3,0,7,2][index]:index<13?[2,1,0,4,7,0][index-7]:6;art('crop'+type,x,z+.15,type===2?1.45:type===6?.85:1.15)}}
   [-1,1].forEach(function(a){[-1,1].forEach(function(d){beam(wood,[b.x+a*b.w/2,.04,b.z+d*b.d/2],[b.x+a*b.w/2,.55,b.z+d*b.d/2],.10)})});
   for(var k=0;k<22;k++){var x=b.x-b.w/2+k*b.w/21;ball(soilLine,x,.08,b.z+b.d/2,.11,.1,.13);ball(soilLine,x,.08,b.z-b.d/2,.11,.1,.13)}label(b.id,cropNames[index],b.x,b.z+b.d/2+.5)
  });
  var shadeCanvas=document.createElement('canvas');shadeCanvas.width=shadeCanvas.height=64;var sg=shadeCanvas.getContext('2d'),grad=sg.createRadialGradient(32,32,2,32,32,32);grad.addColorStop(0,'#314f3d55');grad.addColorStop(1,'#314f3d00');sg.fillStyle=grad;sg.fillRect(0,0,64,64);var shadeTexture=new THREE.CanvasTexture(shadeCanvas);
  trees.forEach(function(t,i){art(t.fruit&&root.WorldArt.get('appleTree0')?'appleTree0':root.WorldArt.get('broadleafTree0')?'broadleafTree0':'flora1',t.x,t.z,6.0*t.s);var sh=new THREE.Mesh(new THREE.PlaneGeometry(4.5*t.s,3.5*t.s),new THREE.MeshBasicMaterial({map:shadeTexture,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(t.x+.25,.04,t.z+.15);scene.add(sh);
   if(i%2===0){art('flora2',t.x+(i%3-1)*1.25,t.z+.7,1.25);art('flora5',t.x+1.25,t.z+.65,.9)}
  });
  [[10,20],[29,14],[28.6,28],[8,39],[30.4,47],[43,11],[57,22],[44,46],[57,55]].forEach(function(p,i){art('flora3',p[0],p[1],1.4);art('flora5',p[0]-.8,p[1]+.4,1.1);art('flora2',p[0]+.9,p[1]+.1,1.5)});
  for(var i=0;i<14;i++){var z=8+i*3.6;if(Math.abs(z-19)<4)continue;var shore=banks(z);art('flora2',shore[0]-1.1,z,1.3);art('flora5',shore[0]-.9,z+.8,.95);if(z<26||z>37)art('flora2',shore[1]+1.05,z,1.5)}
  for(var i=0;i<160;i++){var x=6+(i*7.93)%53,z=7+(i*13.71)%53;if(blocked(x,z)||Math.abs(x-20)<3||Math.abs(z-19)<3||Math.abs(x-50)<3)continue;if(i%3===0)art('flora5',x,z,.65+(i%4)*.08)}
  batch.forEach(function(b){var mesh=new THREE.InstancedMesh(b.g,b.m,b.items.length);b.items.forEach(function(m,i){mesh.setMatrixAt(i,m)});mesh.castShadow=b.m!==red;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh)});
  actorCanvas=document.createElement('canvas');actorCanvas.width=256;actorCanvas.height=256;actorContext=actorCanvas.getContext('2d');actorTexture=new THREE.CanvasTexture(actorCanvas);actorTexture.colorSpace=THREE.SRGBColorSpace;
  var actorGeometry=new THREE.PlaneGeometry(3,3/cos);actorGeometry.translate(0,3/cos*.4,0);
  actor=new THREE.Mesh(actorGeometry,new THREE.MeshBasicMaterial({map:actorTexture,transparent:true,alphaTest:.08,depthWrite:true,toneMapped:false,side:THREE.DoubleSide}));scene.add(actor);
  // A feathered contact shadow sits on the actual walking surface, including the bridge.
  var contactCanvas=document.createElement('canvas');contactCanvas.width=contactCanvas.height=128;
  var contactCtx=contactCanvas.getContext('2d'),contactGrad=contactCtx.createRadialGradient(64,64,3,64,64,61);
  contactGrad.addColorStop(0,'rgba(48,60,31,.40)');contactGrad.addColorStop(.32,'rgba(48,60,31,.29)');contactGrad.addColorStop(.7,'rgba(48,60,31,.10)');contactGrad.addColorStop(1,'rgba(48,60,31,0)');contactCtx.fillStyle=contactGrad;contactCtx.fillRect(0,0,128,128);
  shadow=new THREE.Mesh(new THREE.PlaneGeometry(1.28,.88),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(contactCanvas),transparent:true,opacity:1,depthWrite:false,toneMapped:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);ready=true;
 }
 function render(ctx,c,dpr,player,night,time,font,drawPlayer,near,target){
  if(!root.WorldArt.ready())return false;initialize();var size=c.width+':'+c.height;if(size!==lastSize){renderer.setSize(c.width,c.height);lastSize=size}var halfH=c.height/c.px/2;cam3.left=-c.width/c.px/2;cam3.right=-cam3.left;cam3.top=halfH;cam3.bottom=-halfH;cam3.updateProjectionMatrix();var cx=c.x/40,cz=c.y/40-c.height*.07/(sin*c.px);cam3.position.set(cx,sin*48,cz+cos*48);cam3.up.set(0,1,0);cam3.lookAt(cx,0,cz);cam3.updateMatrixWorld();
  // Refresh the local sprite texture at animation cadence; it participates in depth testing.
  if(Math.floor(time*24)!==lastPose||time===0){lastPose=Math.floor(time*24);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.save();ctx.translate(128,230);ctx.scale(2,2);drawPlayer(time);ctx.restore();actorContext.clearRect(0,0,256,256);actorContext.drawImage(ctx.canvas,0,0,256*dpr,256*dpr,0,0,256,256);actorTexture.needsUpdate=true}
  var y=elevation(player.x,player.y);actor.position.set(player.x,y+.025,player.y);shadow.position.set(player.x+.025,y+.035,player.y+.025);
  var flight=player.running&&root.HanbokAnimation?root.HanbokAnimation.runPose(player.stride||0).lift:0;
  shadow.material.opacity=(night?.72:1)-flight*.12;shadow.scale.setScalar(1+flight*.035);
  renderer.shadowMap.autoUpdate=false;if(!shadowCenter||Math.hypot(cx-shadowCenter.x,cz-shadowCenter.z)>5){sun.position.set(cx-13,25,cz-12);sun.target.position.set(cx,0,cz);shadowCenter={x:cx,z:cz};renderer.shadowMap.needsUpdate=true}
  if(night!==lastNight){lastNight=night;ambient.intensity=night?.8:2.0;sun.intensity=night?.8:1.6;sun.color.set(night?'#a8c5e5':'#fff0d4');scene.background.set(night?'#314b5d':'#d6e8bd');scene.fog.color.copy(scene.background);lamplights.forEach(function(l){l.intensity=night?6:0});lampGlows.forEach(function(l){l.visible=night});actor.material.color.set(night?'#b9c5dc':'#ffffff');treeSprites.forEach(function(t){t.material.color.set(night?'#869ba8':'#ffffff')})}
  water.material.color.set(night?'#678cb4':'#ffffff');water.material.map.offset.y=(time*.003)%1;
  waves.forEach(function(w,i){var z=2+(w.userData.z-2+time*.12)%62,shore=banks(z);w.position.set(shore[0]+1+(shore[1]-shore[0]-2)*w.userData.across+Math.sin(time*.5+i)*.12,-1.375,z);w.material.opacity=(night?.28:.65)+Math.sin(time*1.2+i)*.12});renderer.render(scene,cam3);
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.font='14px '+font;ctx.textAlign='center';ctx.textBaseline='middle';
  labels.forEach(function(l){l.visible=false;var distance=Math.hypot(player.x-l.x,player.y-l.z);if(distance>3||l.baked)return;var p=project(c,l.x*40,l.z*40,l.h||0);if(p.x<0||p.x>c.width||p.y<105||p.y>c.height-135)return;l.visible=true;var w=ctx.measureText(l.text).width+22;ctx.fillStyle=near&&near.id===l.id?'#fff2b5f5':'#fff9e8ed';ctx.beginPath();ctx.roundRect(p.x-w/2,p.y-12,w,25,12);ctx.fill();ctx.fillStyle='#4e6145';ctx.fillText(l.text,p.x,p.y+1)});
  if(target){var p=project(c,target.x*40,target.y*40);ctx.strokeStyle='#fff8d4';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y,9,5,0,0,7);ctx.stroke()}
  var region=player.x>40?(player.y>44?'강 건너 · 영화가 있는 쉼터':'강 건너 · AI 프로젝트 밭'):player.y>51?'남쪽 · 새싹 밭':player.y>29?'남쪽 · 작업실 밭':'한옥 마당';var location=document.querySelector('.island-clock .location');if(location&&location.textContent!==region)location.textContent=region;return true;
 }
 var api={camera:camera,project:project,unproject:unproject,blocked:blocked,elevation:elevation,configure:configure,render:render,hit:hit,route:route,places:places,width:width,height:height,obstacles:obstacles,beds:beds};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.IslandCourtyard=api;
})(typeof window!=='undefined'?window:globalThis);
