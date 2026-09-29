/* A single coherent prop atlas, keyed and cropped once, then reused. */
(function(){
 'use strict';
 var frames=[],im=new Image();
 im.onload=function(){
  var cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;var c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(im,0,0);
  var pixels=c.getImageData(0,0,cv.width,cv.height),d=pixels.data;
  for(var i=0;i<d.length;i+=4){var excess=Math.min(d[i],d[i+2])-d[i+1];if(excess>40){d[i+3]=Math.round(255*(1-Math.min(1,(excess-40)/75)));var spill=Math.max(0,excess-14);d[i]=Math.max(0,d[i]-spill);d[i+2]=Math.max(0,d[i+2]-spill)}}
  c.putImageData(pixels,0,0);
  for(var n=0;n<9;n++){
   var left=Math.round(n%3*cv.width/3),right=Math.round((n%3+1)*cv.width/3),top=Math.round(Math.floor(n/3)*cv.height/3),bottom=Math.round((Math.floor(n/3)+1)*cv.height/3),x0=right,y0=bottom,x1=left,y1=top;
   for(var y=top;y<bottom;y++)for(var x=left;x<right;x++)if(d[(y*cv.width+x)*4+3]>100){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
   var out=document.createElement('canvas');out.width=x1-x0+3;out.height=y1-y0+3;out.getContext('2d').drawImage(cv,x0-1,y0-1,out.width,out.height,0,0,out.width,out.height);frames.push(out);
  }
 };
 im.src=window.HANOK_PROPS_SOURCE||'assets/img/scenery/hanok-props-key.png';
 window.HanokProps={get:function(index){return frames[index]},draw:function(c,index,x,y,h){var f=frames[index];if(!f)return;var w=h*f.width/f.height,anchor=index===1?.79:.5;c.drawImage(f,x-w*anchor,y-h,w,h)},ratio:function(index){return frames[index]?frames[index].width/frames[index].height:1},ready:function(){return frames.length===9}};
})();
