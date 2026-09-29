/* Keep each original four-view character intact. No synthetic body or clipped limbs. */
(function(root){
 'use strict';
 function gait(stride,blend,run){
  function foot(offset){
   var p=((stride/(Math.PI*2)+offset)%1+1)%1,swing=p>=.5,u=swing?(p-.5)*2:p*2;
   return {travel:(swing?-18+36*(u*u*(3-2*u)):18-36*u)*blend,lift:(swing?Math.sin(u*Math.PI)*(run?12:8):0)*blend,planted:!swing};
  }
  return {left:foot(0),right:foot(.5),bob:(1-Math.cos(stride*2))*.65*blend,blend:blend};
 }
 function draw(ctx,frame,dir,pose,time,state){
  if(!frame)return;
  // Transform the complete artwork about the feet: the hanbok, hands and shoes
  // retain their original shading and proportions in every direction.
  ctx.save();
  state=state||{dir:dir,reduced:time===0};
  // A subtle breath grows from planted feet; no idle floating or pendulum tilt.
  if(!state.reduced&&pose.blend<.1&&ctx.scale)ctx.scale(1,1+Math.sin(time*1.7)*.003);
  // The run frames already contain bent knees and forward intent. A whole-body
  // rotation makes the supporting shoe arc through the floor; keep it grounded.
  if(!state.reduced&&state.moving&&!state.running)ctx.translate(0,-pose.bob*.45);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  var anchor=frame.groundAnchor||{x:frame.width/2,y:frame.height*108/115};
  if(!(root.HanbokAnimation&&root.HanbokAnimation.draw(ctx,state))){
   if(frame.gaitScale){var scale=frame.gaitScale;ctx.drawImage(frame,-anchor.x*scale,-anchor.y*scale,frame.width*scale,frame.height*scale)}
   else ctx.drawImage(frame,-anchor.x*86/frame.width,-anchor.y*115/frame.height,86,115);
  }
  ctx.restore();
 }
 var api={gait:gait,draw:draw};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.IslandVillager=api;
})(typeof window!=='undefined'?window:globalThis);
