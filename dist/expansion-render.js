// Short, directional strikes; no persistent fields or expanding rings.
export function drawExpansionStrike(c,f,t){c.strokeStyle=f.color;c.fillStyle=f.color;c.lineWidth=3;c.globalAlpha=(1-t)*.8;
 if(f.style==='dimension'){c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-f.r+(i%2)*20,-f.r*.45+i*15);c.lineTo(f.r-i*8,f.r*.45-i*15);c.stroke();}return;}
 if(f.style==='impact'){c.lineWidth=3;for(let i=0;i<10;i++){const a=i*Math.PI/5;c.beginPath();c.moveTo(Math.cos(a)*f.r*.2,Math.sin(a)*f.r*.14);c.lineTo(Math.cos(a)*f.r,Math.sin(a)*f.r*.7);c.stroke();}return;}
 if(f.style==='soul'){c.beginPath();c.arc(0,-20-t*35,5,0,7);c.stroke();return;}
 if(f.style==='heal'){c.fillRect(-3,-30,6,20);c.fillRect(-10,-23,20,6);return;}
 if(f.style==='key'){c.save();c.translate(0,-(1-t)*70);c.beginPath();c.moveTo(0,-90);c.lineTo(15,-64);c.lineTo(0,-40);c.lineTo(-15,-64);c.closePath();c.stroke();c.fillRect(-3,-40,6,55);c.fillRect(0,-4,19,5);c.fillRect(0,8,13,5);c.restore();return;}
 if(f.style==='pillar'){c.fillRect(-12,-95*(1-t),24,70);c.strokeStyle='#fff2cb';c.strokeRect(-15,-95*(1-t),30,12);return;}
 if(f.style==='ice'){for(let i=0;i<3;i++){const x=(i-1)*18;c.beginPath();c.moveTo(x-6,0);c.lineTo(x,-50-i*6);c.lineTo(x+8,-10);c.closePath();c.stroke();}return;}
 if(f.style==='pet'){c.beginPath();c.moveTo(-30,12);c.lineTo(20,-18);c.moveTo(-20,22);c.lineTo(30,-8);c.stroke();return;}
 c.save();c.rotate(f.angle||0);c.lineWidth=f.style==='fire'?5:3;c.beginPath();c.moveTo(-f.r*.6,20*(1-t));c.lineTo(f.r*.65,-20*(1-t));c.stroke();if(f.style==='dragon'){c.beginPath();c.moveTo(-55,8);c.quadraticCurveTo(0,-35,55,-8);c.stroke();}c.restore();
}
export function drawExpansionBolt(c,p){if(p.newStyle==='chalk'){c.rotate(-.2);c.fillRect(-12,-3,24,6);c.strokeStyle='#fff3d0';c.strokeRect(-12,-3,24,6);}else if(p.newStyle==='feather'){c.beginPath();c.moveTo(-15,6);c.quadraticCurveTo(-8,-10,13,-2);c.lineTo(-15,6);c.fill();}else if(p.newStyle==='ice'){c.beginPath();c.moveTo(15,0);c.lineTo(-6,-7);c.lineTo(-12,0);c.lineTo(-6,7);c.closePath();c.fill();}else{c.beginPath();c.moveTo(18,0);c.lineTo(-10,-5);c.lineTo(-3,0);c.lineTo(-10,5);c.closePath();c.fill();}}

// Transparent strokes carry attack direction; field fills are rendered below actors.
export function drawAscension(e,c,at){
 for(const f of e.ascFields||[]){if(f.style==='fireRing'){at(f.x,f.y,4,()=>{c.globalAlpha=.3*Math.max(0,f.life/f.max);c.strokeStyle='#ffb272';c.lineWidth=3;c.beginPath();c.ellipse(0,0,f.r,f.r*.72,0,0,Math.PI*2);c.stroke();});continue;}
 at(f.x,f.y,5,()=>{c.strokeStyle=f.color;c.globalAlpha=Math.min(.38,f.life*.4);c.lineWidth=2;
 if(f.style==='waterColumn'){for(let i=0;i<4;i++){const x=Math.sin(i*2+e.time*4)*f.r*.45;c.beginPath();c.moveTo(x,0);c.quadraticCurveTo(x-20,-70,x+12,-120);c.stroke();}return;}
 const tornado=f.style==='tornado'||f.style==='orbitWind';for(let i=0;i<(tornado?5:3);i++){const a=e.time*3+i*2.1,r=tornado?f.r*(.22+i*.14):f.r*(.3+i*.23);c.beginPath();c.ellipse(0,tornado?-i*10:0,r,r*.48,a*.1,a,a+Math.PI*1.25);c.stroke();}});
 }
 for(const f of e.fx){if(f.kind!=='ascTrail'||f.life<=0)continue;const p=at.point(f.x,f.y,18),q=at.point(f.tx,f.ty,18);c.save();c.globalAlpha=.45*f.life/f.max;c.strokeStyle=f.color;c.lineWidth=3;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();if(f.width){const a=Math.atan2(q.y-p.y,q.x-p.x);c.lineWidth=1;for(const offset of [-14,14]){c.beginPath();c.moveTo(p.x+Math.sin(a)*offset,p.y-Math.cos(a)*offset);c.lineTo(q.x+Math.sin(a)*offset,q.y-Math.cos(a)*offset);c.stroke();}}c.restore();}
}
export function drawAscensionWave(c,p,time){c.shadowBlur=3;c.globalAlpha=.7;c.strokeStyle=p.color;c.lineWidth=3;
 if(p.newStyle==='tornado'){c.rotate(Math.PI/2);for(let i=0;i<4;i++){c.beginPath();c.ellipse(0,-i*9,p.r*(.35+.16*i),p.r*.22,time*2,i,i+Math.PI*1.6);c.stroke();}return;}
 if(p.newStyle==='water'){c.globalAlpha=.25;c.fillStyle='#6fddee';c.beginPath();c.ellipse(0,0,24,p.r,0,0,7);c.fill();c.globalAlpha=.7;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-18+i*9,-p.r*.9);c.quadraticCurveTo(35+i*5,0,-18+i*9,p.r*.9);c.stroke();}return;}
 c.beginPath();c.arc(0,0,p.r,-1.55,1.55);c.stroke();c.lineWidth=1;c.strokeStyle=p.newStyle==='void'?'#ffcedf':p.newStyle==='blood'?'#ffc5c5':'#effaff';c.beginPath();c.arc(-5,0,p.r+5,-1.45,1.45);c.stroke();
}
