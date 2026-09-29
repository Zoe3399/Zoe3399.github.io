/* Artwork is split into individual depth-tested scene objects, never a world-sized backdrop. */
(function(root){
 'use strict';var images={},pending=8,errors=[];
 function load(key,src,regions){var im=new Image();im.onload=function(){var c=document.createElement('canvas');c.width=im.width;c.height=im.height;var ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);var pix=ctx.getImageData(0,0,c.width,c.height),d=pix.data;
  if(regions)for(var i=0;i<d.length;i+=4){var excess=Math.min(d[i],d[i+2])-d[i+1];if(excess>35){d[i+3]=Math.round(d[i+3]*(1-Math.min(1,(excess-35)/80)));var spill=Math.max(0,excess-15);d[i]-=Math.min(d[i],spill);d[i+2]-=Math.min(d[i+2],spill)}}ctx.putImageData(pix,0,0);
  if(key==='wood'||key==='water'){images[key+'0']=c;pending--;return}
  (regions||[[0,0,1,1]]).forEach(function(r,n){var left=Math.floor(r[0]*c.width),top=Math.floor(r[1]*c.height),right=Math.min(c.width,Math.ceil((r[0]+r[2])*c.width)),bottom=Math.min(c.height,Math.ceil((r[1]+r[3])*c.height)),x0=right,y0=bottom,x1=left,y1=top;
   for(var y=top;y<bottom;y++)for(var x=left;x<right;x++)if(d[(y*c.width+x)*4+3]>100){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}var out=document.createElement('canvas');out.width=x1-x0+3;out.height=y1-y0+3;out.getContext('2d').drawImage(c,x0-1,y0-1,out.width,out.height,0,0,out.width,out.height);images[key+n]=out});pending--};im.onerror=function(){errors.push(src);pending--;console.warn('Island artwork unavailable:',src)};im.src=(root.ISLAND_LOCAL_IMAGES||{})[src]||src}
 load('appleTree','assets/img/world/objects/apple-tree.png',null);
 load('broadleafTree','assets/img/world/objects/broadleaf-tree.png',null);
 load('steppingStone','assets/img/world/objects/stepping-stone.png',null);
 load('wood','assets/img/world/objects/honey-wood.png',null);
 load('water','assets/img/world/objects/river-water.png',null);
 load('flora',root.WORLD_FLORA_SOURCE,[[0,0,.345,.57],[.345,0,.315,.57],[.665,0,.335,.57],[0,.57,.30,.43],[.30,.57,.395,.43],[.695,.57,.305,.43]]);
 load('crop',root.WORLD_CROPS_SOURCE,Array.from({length:8},function(_,i){return [i%4/4,i<4?0:.51,.25,i<4?.51:.49]}));
 load('house',root.ISLAND_SCENERY_DATA.house,null);
 root.WorldArt={ready:function(){return pending===0&&root.HanokProps.ready()},get:function(key){return images[key]},errors:function(){return errors.slice()},prop:function(n){return root.HanokProps.get(n)}};
})(window);
