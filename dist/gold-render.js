// Spell geometry stays translucent so allies and enemy telegraphs remain readable.
export function drawGold(e,c,drawAt){
 const ellipse=(x,y,rx,ry)=>{c.beginPath();c.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);c.stroke();};
 const blade=(length,width=14)=>{c.beginPath();c.moveTo(-width,0);c.lineTo(-width,-length*.75);c.lineTo(0,-length);c.lineTo(width,-length*.75);c.lineTo(width,0);c.closePath();c.fill();c.fillRect(-width*2,-12,width*4,8);};
 for(const f of e.goldEffects||[]){if(f.invisible)continue;const alpha=Math.min(1,f.life*2),t=f.rotation;if(f.kind==='beams'){const n=f.owner===0?8:2+f.rank;f.lines=Array.from({length:n},(_,i)=>{const a=f.rotation*.7+i*Math.PI*2/n;return [f.x,f.y,f.x+Math.cos(a)*950,f.y+Math.sin(a)*950];});}
 if(f.kind==='formation'&&[5,6].includes(f.owner)){
 for(const a of [e.hero,...e.team.map(id=>e.members[id])])drawAt(a.x,a.y,38,()=>{c.save();c.translate(f.owner===5?-24:24,0);c.globalAlpha=alpha*(.42+.12*Math.sin(t*2));c.strokeStyle=f.color;c.fillStyle=f.color;c.lineWidth=1.5;
 if(f.owner===5){c.beginPath();c.moveTo(-8,-10);c.lineTo(8,-10);c.lineTo(8,2);c.lineTo(0,10);c.lineTo(-8,2);c.closePath();c.stroke();}else{c.fillRect(-2,-8,4,16);c.fillRect(-8,-2,16,4);}c.restore();});
 continue;
 }
 if(f.lines)for(const [x,y,tx,ty]of f.lines){const a=drawAt.point(x,y,22),b=drawAt.point(tx,ty,22);c.save();c.globalAlpha=.28*alpha;c.strokeStyle=f.color;c.lineWidth=f.kind==='beams'?7:3;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.strokeStyle='#f8ffff';c.lineWidth=2;c.stroke();c.restore();}
 drawAt(f.x,f.y,10,()=>{c.globalAlpha=.38*alpha;c.strokeStyle=f.color;c.fillStyle=f.color;c.lineWidth=4;
 if(f.kind==='vortex'){
  for(let i=0;i<9;i++){const rad=30+i*f.r/10,yy=-i*16;ellipse(Math.sin(t*3+i)*12,yy,rad,rad*.27);c.beginPath();c.arc(Math.cos(t*4+i)*rad,yy+Math.sin(t*4+i)*rad*.27,5,0,7);c.fill();}c.globalAlpha=.08*alpha;c.beginPath();c.moveTo(-25,0);c.lineTo(-f.r,-150);c.lineTo(f.r,-150);c.lineTo(25,0);c.fill();
 }else if(f.kind==='dome'){
  c.globalAlpha=.1*alpha;c.beginPath();c.ellipse(0,-f.r*.25,f.r,f.r*.65,0,Math.PI,Math.PI*2);c.lineTo(f.r,0);c.ellipse(0,0,f.r,f.r*.35,0,0,Math.PI);c.fill();c.globalAlpha=.38*alpha;ellipse(0,0,f.r,f.r*.35);c.beginPath();c.ellipse(0,-f.r*.1,f.r,f.r*.7,0,Math.PI,Math.PI*2);c.stroke();for(let i=0;i<7;i++){const a=i*Math.PI/3.5+t*.2,x=Math.cos(a)*f.r,y=Math.sin(a)*f.r*.35;c.strokeRect(x-11,y-35,22,35);}
 }else if(f.kind==='orbit'){
  ellipse(0,0,f.r,f.r*.6);for(let i=0;i<2+f.rank;i++){const a=t*2+i*Math.PI*2/(2+f.rank);c.save();c.translate(Math.cos(a)*f.r,Math.sin(a)*f.r*.6);c.rotate(a+Math.PI/2);if(f.theme==='hammer'){c.fillRect(-5,-100,10,110);c.fillRect(-46,-125,92,52);c.strokeStyle='#f9dcff';c.strokeRect(-46,-125,92,52);}else if(f.theme==='fire'){c.beginPath();c.arc(0,-35,36,0,7);c.fill();c.strokeStyle='#ffe7bd';ellipse(0,-35,48,48);}else blade(f.theme==='glaive'?110:85);c.restore();}
 }else if(f.kind==='garden'){
  const r=f.bloomRadius||f.r*.5;for(let i=0;i<8;i++){const a=i*Math.PI/4;ellipse(Math.cos(a)*r*.45,Math.sin(a)*r*.27,r*.5,r*.3);}ellipse(0,0,r,r*.6);
 }else if(f.kind==='sun'){
  c.globalAlpha=.14*alpha;c.beginPath();c.arc(0,-140,85+f.rank*15,0,7);c.fill();c.globalAlpha=.3*alpha;for(let i=0;i<12;i++){const a=i*Math.PI/6+t;c.beginPath();c.moveTo(Math.cos(a)*100,-140+Math.sin(a)*100);c.lineTo(Math.cos(a)*155,-140+Math.sin(a)*155);c.stroke();}
 }else if(f.kind==='dragon'){
  for(let i=0;i<10;i++){c.globalAlpha=(1-i/12)*.6;const a=t*5-i*.3;ellipse(-i*14,Math.sin(a)*25-35,32-i*1.8,21);}c.globalAlpha=.75;blade(100,22);
 }else if(f.kind==='blizzard'){
  // Cold affects enemies directly; no expanding wave overlay.
 }
 });
 }
 for(const f of e.fx){if(!['goldHit','goldSword','goldRain','goldPillar','reactorBlast','dragonWake'].includes(f.kind))continue;const t=1-f.life/f.max;drawAt(f.x,f.y,15,()=>{c.strokeStyle=f.color;c.fillStyle=f.color;c.globalAlpha=Math.min(1,f.life*3)*.42;c.lineWidth=4;
 if(f.kind==='goldSword'){c.save();c.translate(0,-Math.max(0,.18-t)*1000);blade(210,15);c.restore();ellipse(0,0,f.r,f.r*.6);}
 else if(f.kind==='goldRain'){for(let i=0;i<8;i++){const a=i*2.4,r=f.r*.65*Math.sqrt((i+1)/8),x=Math.cos(a)*r,y=Math.sin(a)*r*.6,fall=Math.max(0,.35-t)*650;if(f.theme==='fire'||f.theme==='missile'){c.beginPath();c.moveTo(x-50,y-170-fall);c.lineTo(x,y-fall);c.stroke();c.beginPath();c.arc(x,y-fall,f.theme==='fire'?16:9,0,7);c.fill();}else if(f.theme==='thunder'){c.beginPath();c.moveTo(x,y-200-fall);c.lineTo(x-16,y-100-fall);c.lineTo(x+12,y-90-fall);c.lineTo(x,y-fall);c.stroke();}else{c.beginPath();c.moveTo(x-25,y-125-fall);c.lineTo(x,y-fall);c.stroke();c.beginPath();c.moveTo(x-7,y-12-fall);c.lineTo(x,y-fall);c.lineTo(x+5,y-15-fall);c.stroke();}}}
 else if(f.kind==='goldPillar'&&f.theme==='shield'){c.lineWidth=7;c.beginPath();c.moveTo(-65,0);c.lineTo(-65,-150);c.lineTo(0,-180);c.lineTo(65,-150);c.lineTo(65,0);c.lineTo(0,45);c.closePath();c.stroke();c.globalAlpha=.13;c.fill();}else if(f.kind==='goldPillar'&&f.theme==='heal'){c.fillRect(-14,-140,28,100);c.fillRect(-50,-104,100,28);ellipse(0,0,f.r,f.r*.6);}else if(f.kind==='goldPillar'&&f.theme==='robot'){c.fillRect(-12,-280,24,280);c.strokeStyle='#efffff';c.lineWidth=3;c.strokeRect(-4,-280,8,280);ellipse(0,0,f.r,f.r*.6);}else if(f.kind==='goldPillar'&&f.theme==='quantum'){for(let i=0;i<3;i++){c.save();c.rotate(i*2.1+t*3);c.beginPath();c.arc(0,0,90,-1,1);c.stroke();blade(150,9);c.restore();}}else if(f.kind==='goldPillar'){for(let i=0;i<5;i++){const x=(i-2)*f.r*.3,y=Math.abs(i-2)*8,hh=(110+50*Math.sin(i+1))*Math.sin(Math.min(1,t*2)*Math.PI/2);c.beginPath();c.moveTo(x-17,y);c.lineTo(x-13,y-hh);c.lineTo(x,y-hh-40);c.lineTo(x+17,y-hh);c.lineTo(x+20,y);c.closePath();c.fill();}ellipse(0,0,f.r,f.r*.6);}
 else if(f.kind==='reactorBlast'){c.lineWidth=6*(1-t)+2;for(let i=0;i<16;i++){const a=i*Math.PI/8;c.fillRect(Math.cos(a)*f.r*t,Math.sin(a)*f.r*t*.6,8,14);} }
 else if(f.kind==='dragonWake'){c.beginPath();c.moveTo(-12,0);c.lineTo(12,-45);c.stroke();}
 });}
 for(const orb of e.soulOrbs||[])drawAt(orb.x,orb.y,45,()=>{c.globalAlpha=.85;c.fillStyle='#dba9ff';c.beginPath();c.ellipse(0,0,8,12,0,0,7);c.fill();c.strokeStyle='#a583ff';c.lineWidth=2;c.beginPath();c.moveTo(0,4);c.lineTo(-10,24);c.stroke();});
 const s=e.members[11];if(e.team.includes(11)&&s.souls>0)drawAt(s.x,s.y,35,()=>{c.strokeStyle='#ce9bff';c.fillStyle='#dab6ff';c.globalAlpha=.75;for(let i=0;i<Math.min(14,Math.ceil(s.souls/4));i++){const a=e.time*3+i*.8,x=Math.cos(a)*60,y=Math.sin(a)*30;c.save();c.translate(x,y);c.rotate(a);c.fillRect(-10,-3,8,7);c.fillRect(2,-3,8,7);c.restore();}});
}
