/* Small world-space meshes, projected by the island camera. No textures or engine. */
(function(root){
 'use strict';
 function mesh(){return {faces:[]}}
 function face(m,p,color){
  var a=p[0],b=p[1],c=p[2],u=b.map(function(v,i){return v-a[i]}),v=c.map(function(v,i){return v-a[i]});
  m.faces.push({p:p,color:color,n:[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],center:a.map(function(_,i){return p.reduce(function(s,q){return s+q[i]},0)/p.length})});
 }
 function box(m,x,y,z,w,d,h,colors){
  var a=[x,y,z],b=[x+w,y,z],c=[x+w,y+d,z],e=[x,y+d,z],A=[x,y,z+h],B=[x+w,y,z+h],C=[x+w,y+d,z+h],E=[x,y+d,z+h];
  face(m,[E,C,c,e],colors[0]);face(m,[B,A,a,b],colors[1]);face(m,[A,E,e,a],colors[1]);face(m,[C,B,b,c],colors[2]||colors[1]);face(m,[B,C,E,A],colors[3]||colors[0]);
 }
 var wood=['#b88853','#89613e','#9b6e45','#dfbb7c'],dark=['#735237','#593f2f','#644833','#aa8052'],stone=['#b4b4a0','#929783','#a1a590','#d3d0b7'],metal=['#414e48','#2e3936','#34413c','#626e5d'];
 function roof(m,x,y,z,w,d,rise){
  // A broad, low ridge, softly lifted eaves, and individually shaded tile courses.
  var rows=10;
  for(var i=0;i<rows;i++){
   var x0=x+w*i/rows,x1=x+w*(i+1)/rows;
   face(m,[[x0,y,z+2],[x1,y,z+2],[x1,y+d*.5,z+rise],[x0,y+d*.5,z+rise]],i%2?'#64766e':'#708278');
   face(m,[[x0,y+d*.5,z+rise],[x1,y+d*.5,z+rise],[x1,y+d,z],[x0,y+d,z]],i%2?'#4f635c':'#5b7067');
  }
  box(m,x-1,y+d-1,z-4,w+2,3,5,['#384e47','#33443f','#445b51','#7e9180']);
  box(m,x-1,y-1,z-2,w+2,3,4,metal);
  box(m,x-2,y+d*.5-2,z+rise-1,w+4,4,4,['#52695e','#41564e','#4e6157','#879889']);
  face(m,[[x,y+d*.5,z+rise],[x,y+d,z-4],[x,y,z-2]],'#3d5049');
  face(m,[[x+w,y+d*.5,z+rise],[x+w,y,z-2],[x+w,y+d,z-4]],'#4f6156');
 }
 function makeShed(){
  var m=mesh();
  box(m,-53,-42,0,106,48,6,stone);
  box(m,-48,-39,6,96,40,83,wood);
  // Front doors sit on the front ground edge; details share that same plane.
  [-43,2].forEach(function(x){
   box(m,x,1,11,41,2,64,['#cea46c','#916a42','#a47b4c','#e0bc82']);
   for(var k=1;k<5;k++)box(m,x+k*8,3.1,13,.7,.25,60,['#b38753','#b38753']);
   [15,66].forEach(function(z){box(m,x+1,3.4,z,39,1.5,3,wood)});
  });
  [-49,45].forEach(function(x){box(m,x,0,6,4,5,83,dark)});
  box(m,-46,1,76,92,4,12,dark);
  [-7,5].forEach(function(x){box(m,x,4,38,2,3,12,metal)});
  [-40,37].forEach(function(x){[24,60].forEach(function(z){box(m,x,4,z,4,1,2,metal)})});
  // Plaque is attached to the lintel, not a detached screen-space badge.
  box(m,-33,5,74,66,2,12,['#ede0b2','#a3895d','#b8a171','#fff0c8']);
  roof(m,-58,-47,89,116,56,15);
  return m;
 }
 function makeLamp(){
  var m=mesh();
  box(m,-7,-7,0,14,14,3,stone);box(m,-5,-5,3,10,10,3,metal);
  box(m,-3,-3,6,6,6,12,metal);box(m,-1.8,-1.8,18,3.6,3.6,91,metal);
  box(m,-22,-1.5,104,24,3,3,metal);box(m,-21,-1,97,2,2,7,metal);
  box(m,-27,-6,74,14,12,23,['#f7e2ac','#d7c697','#e9d3a2','#fff0c6']);
  [-28,-14].forEach(function(x){[-7,5].forEach(function(y){box(m,x,y,73,1.5,1.5,24,metal)})});
  [74,78,94].forEach(function(z){box(m,-28,-7,z,16,14,1.6,metal)});
  box(m,-20.7,6,78,1.3,1,16,metal);
  roof(m,-30,-9,98,20,18,5);
  return m;
 }
 var models={shed:makeShed(),lamp:makeLamp()};
 function create(ctx,Motion,font){
  var cache=new Map();
  function projection(camera,x,y){
   var anchor=Motion.project(camera,x,y);if(!anchor)return null;
   var scale=camera.zoom*anchor.scale;
   return function(v){var p=Motion.project(camera,x+v[0],y+v[1]);return p?[x+(p.x-anchor.x)/scale,y+(p.y-anchor.y-v[2]*camera.zoom*p.scale)/scale]:null};
  }
  function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();ctx.fill()}
  function draw(kind,x,y,camera,night){
   var project=projection(camera,x,y);if(!project)return;
   // Ignore subpixel camera settling (0.05 world units) when reusing paths.
   var key=kind+':'+x+':'+y,signature=[Math.round(camera.x*20),Math.round(camera.y*20),camera.zoom,camera.width,camera.height].join(','),entry=cache.get(key);
   if(!entry||entry.signature!==signature){
    var view=[camera.x-x,camera.focal+camera.y-y,camera.focal*camera.tilt];
    var faces=models[kind].faces.filter(function(f){return f.n.reduce(function(s,n,i){return s+n*(view[i]-f.center[i])},0)>0});
    // Components are authored back-to-front; preserve that order for inset trim.
    faces=faces.map(function(f){return {p:f.p.map(project),color:f.color}}).filter(function(f){return f.p.every(Boolean)});
    faces.forEach(function(f){var p=new Path2D();f.p.forEach(function(v,i){i?p.lineTo(v[0],v[1]):p.moveTo(v[0],v[1])});p.closePath();f.path=p});
    entry={signature:signature,faces:faces};cache.set(key,entry);
   }
   // Contact shadow lies on the ground plane and stays aligned while walking.
   var shadow=[],rx=kind==='shed'?61:13,ry=kind==='shed'?28:8,cy=kind==='shed'?-17:0;
   for(var i=0;i<24;i++){var a=i*Math.PI/12;shadow.push(project([Math.cos(a)*rx+4,cy+Math.sin(a)*ry+4,0]))}
   if(shadow.every(Boolean))polygon(shadow,'#31462724');
   entry.faces.forEach(function(f){ctx.fillStyle=f.color;ctx.fill(f.path)});
   if(kind==='shed'){
    var a=project([-31,7.2,85]),b=project([31,7.2,85]),d=project([-31,7.2,75]);
    if(a&&b&&d){ctx.save();ctx.transform((b[0]-a[0])/62,(b[1]-a[1])/62,(d[0]-a[0])/10,(d[1]-a[1])/10,a[0],a[1]);ctx.fillStyle='#534d35';ctx.font='bold 9px '+font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('도구 창고',31,5);ctx.restore()}
   }else if(night){
    var light=project([-20,0,86]);if(light){var glow=ctx.createRadialGradient(light[0],light[1],2,light[0],light[1],26);glow.addColorStop(0,'#ffe4a747');glow.addColorStop(1,'#ffe4a700');ctx.fillStyle=glow;ctx.fillRect(light[0]-26,light[1]-26,52,52)}
   }
  }
  return {shed:function(x,y,c){draw('shed',x,y,c,false)},lamp:function(x,y,c,n){draw('lamp',x,y,c,n)}};
 }
 root.IslandProps3D={create:create};
})(typeof window!=='undefined'?window:globalThis);
