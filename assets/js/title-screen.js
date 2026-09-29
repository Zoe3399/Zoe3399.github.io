/* Static garden artwork: no canvas loop, no scene repaint on resize. */
(function(){
 var title=document.getElementById('title'),nightInput=document.getElementById('titleNight');
 // Share object-fit: cover coordinates with the background, including its mobile crop.
 function placePorchResident(){
  var w=title.clientWidth,h=title.clientHeight,scale=Math.max(w/1672,h/941),px=w<=560?.32:.5;
  title.style.setProperty('--porch-x',((w-1672*scale)*px+460*scale)+'px');
  title.style.setProperty('--porch-y',((h-941*scale)*.5+384*scale)+'px');
  title.style.setProperty('--porch-size',(125*scale)+'px');
 }
 addEventListener('resize',placePorchResident);placePorchResident();
 // The landing artwork always opens in its original daylight colors.
 nightInput.checked=false;
 function setNight(){title.classList.toggle('title-night',nightInput.checked)}
 nightInput.addEventListener('change',setNight);setNight();
 // Decode the chroma-key artwork once. The scene and logo never repaint per frame.
 var logo=new Image(),logoCanvas=document.getElementById('titleLogo');
 logo.onload=function(){
  var c=logoCanvas.getContext('2d',{willReadFrequently:true});
  c.drawImage(logo,310,0,1450,778,0,0,1450,778);
  var pixels=c.getImageData(0,0,1450,778),data=pixels.data;
  for(var i=0;i<data.length;i+=4){var key=Math.min(data[i],data[i+2])-data[i+1];if(key>130)data[i+3]=Math.round(255*(1-Math.min(1,(key-130)/70)))}
  c.putImageData(pixels,0,0);
 };
 logo.src=window.ISLAND_TITLE_LOGO_SOURCE||'assets/img/title/seungju-logo-key.webp';
 document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('titleSettings').open=false});
})();
