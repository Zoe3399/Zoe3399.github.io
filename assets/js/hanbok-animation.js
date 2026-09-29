/* Whole-pose animation: never cut the hanbok or face into moving body parts. */
(function(root){
 'use strict';
 var frames=[],walkFrames=[],runSide=[],runFront=[];
 // Contact/compression/passing each last longer than the two brief flight phases.
 var runTiming=[0,.16,.32,.44,.5,.66,.82,.94,1],sideOrder=[0,1,2,7,4,5,6,3];
 function runPose(stride){var p=(((stride||0)/(Math.PI*2))%1+1)%1,index=0;while(index<7&&p>=runTiming[index+1])index++;return {index:index,lift:index===3||index===7?1.15:0,contact:index<4?'left':'right'}}
 function runFrame(state){var pose=runPose(state.stride),side=state.dir==='left'||state.dir==='right';return {bank:side?'side':'front',index:side?sideOrder[pose.index]:pose.index+(state.dir==='up'?8:0),mirror:state.dir==='left',lift:pose.lift}}
 function mode(state){return state.moving&&state.blend>.12?(state.running?'run':state.dir==='left'||state.dir==='right'?'walk':'original'):'original'}
 function select(state){
  if(state.reduced)return -1;
  if(state.moving&&state.blend>.12){
   var row={down:0,up:1,left:2,right:3}[state.dir]||0;
   return row*4+(Math.floor(((state.stride||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)/(Math.PI/2))%4);
  }
  if(state.dir!=='down')return -1;
  var idle=state.idle||0,age=state.gestureAge;
  if(age==null&&idle>8)age=(idle-8)%22;
  // Use only the same raised hand throughout the greeting.
  if(age!=null&&age>=0&&age<1.7)return age<.18||age>1.45?17:18;
  if(idle>1&&idle%4.7<.14)return 16;
  return -1;
 }
 function draw(ctx,state){
  if(!state.reduced&&mode(state)==='run'){
   var spec=runFrame(state),pose=(spec.bank==='side'?runSide:runFront)[spec.index];
   if(pose){var scale=pose.gaitScale;ctx.save();if(spec.mirror)ctx.scale(-1,1);ctx.drawImage(pose,-pose.anchorX*scale,-pose.height*scale-spec.lift,pose.width*scale,pose.height*scale);ctx.restore();return true}
  }
  var index=select(state),bank=mode(state),f=(bank==='walk'?walkFrames:frames)[index]||frames[index];if(!f)return false;
  // All frames in a gait share a scale and head line. Do not stretch raised feet down to the floor.
  var s=f.gaitScale||101.5/f.height;
  ctx.drawImage(f,-f.anchorX*s,-101.5,f.width*s,f.height*s);return true;
 }
 function runs(counts){var result=[],start=-1;for(var i=0;i<=counts.length;i++){if(counts[i]>3){if(start<0)start=i}else if(start>=0){if(i-start>15)result.push([start,i]);start=-1}}return result}
 function load(source,path,target,rowCount,gait,groupSize){
  var im=new Image();im.onload=function(){
   var cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;var ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
   var pixels=ctx.getImageData(0,0,cv.width,cv.height),d=pixels.data,rows=new Array(cv.height).fill(0),cols=new Array(cv.width).fill(0);
   for(var i=0;i<d.length;i+=4){var excess=Math.min(d[i],d[i+2])-d[i+1];if(excess>30){d[i+3]=Math.round(d[i+3]*(1-Math.min(1,(excess-30)/90)));var spill=Math.max(0,excess-12);d[i]-=Math.min(d[i],spill);d[i+2]-=Math.min(d[i+2],spill)}if(d[i+3]>180){rows[Math.floor(i/4/cv.width)]++;cols[i/4%cv.width]++}}
   ctx.putImageData(pixels,0,0);
   // Generated sheets may have unequal padding: use actual empty row/column gutters.
   var rr=runs(rows),cc=runs(cols);if(rr.length!==rowCount||cc.length!==4){console.warn('Character animation atlas has unexpected gutters; retaining original poses.');return}
   for(var row=0;row<rowCount;row++)for(var col=0;col<4;col++){
    var x0=cc[col][1],x1=cc[col][0],y0=rr[row][1],y1=rr[row][0];
    for(var y=rr[row][0];y<rr[row][1];y++)for(var x=cc[col][0];x<cc[col][1];x++)if(d[(y*cv.width+x)*4+3]>180){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
    var f=document.createElement('canvas');f.width=x1-x0+3;f.height=y1-y0+3;f.getContext('2d').drawImage(cv,x0-1,y0-1,f.width,f.height,0,0,f.width,f.height);
    // Head center is stable while shoes alternate, so steps do not slide the whole body sideways.
    var headMin=x1,headMax=x0;
    for(var y=y0;y<y0+(y1-y0)*.45;y++)for(var x=x0;x<=x1;x++)if(d[(y*cv.width+x)*4+3]>180){headMin=Math.min(headMin,x);headMax=Math.max(headMax,x)}
    f.anchorX=(headMin+headMax)/2-x0+1;target.push(f);
   }
   if(gait)for(var start=0;start<target.length;start+=(groupSize||4)){
    var group=target.slice(start,start+(groupSize||4)),height=Math.max.apply(null,group.map(function(f){return f.height}));
    group.forEach(function(f){f.gaitScale=101.5/height});
   }
  };im.src=source||path;
 }
 var api={select:select,mode:mode,draw:draw,runPose:runPose,runFrame:runFrame,ready:function(){return frames.length===20&&walkFrames.length===16&&runSide.length===8&&runFront.length===16},runs:runs};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else{
  root.HanbokAnimation=api;
  load(root.HANBOK_MOTION_SOURCE,'assets/img/seungju-hanbok-motion-key.png',frames,5,false);
  load(root.HANBOK_WALK_SOURCE,'assets/img/seungju-hanbok-walk-key.png',walkFrames,4,true);
  load(root.HANBOK_RUN_SIDE_V2,'assets/img/seungju-hanbok-run-side-v2.png',runSide,2,true,8);
  load(root.HANBOK_RUN_FRONT_V2,'assets/img/seungju-hanbok-run-front-back-v2.png',runFront,4,true,8);
 }
})(typeof window!=='undefined'?window:globalThis);
