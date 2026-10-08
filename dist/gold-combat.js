import {withinGold,wideGold,goldReach,facingAngle} from './local-combat.js';
import {GOLD_EVOLUTIONS} from './gold-evolutions.js';
import {freeze,inView,statusCount} from './combo.js';
import {move} from './world.js';
const live=(e,a)=>a.hp>0&&(!a.boss||e.bossAwake);
const rank=(m,k)=>m?.growth?.[k]||0;
export const soulMove=m=>1+(m.souls||0)*.015*rank(m,'combo');
export const soulAttack=m=>1+(m.souls||0)*.02*rank(m,'combo');
export const GOLD_COLORS={ice:'#91e5ff',shatter:'#c4edff',shield:'#a3eaff',wind:'#80edcf',gravity:'#a098db',sword:'#ffe28f',spear:'#8ef4d1',fire:'#ffa86b',heal:'#97ffc9',poison:'#c28bff',thunder:'#d4a0ff',glaive:'#fce0a0',robot:'#a6dfff',missile:'#ffc57f',star:'#ffd9a2',quantum:'#c496ff',scythe:'#c496ff',hammer:'#d5a7ff',gold:'#ffdf91'};
function activeActors(e){return [e.hero,...e.team.map(id=>e.members[id])];}
function hit(e,a,damage,f){if(!live(e,a)||!withinGold(e,f.owner,a))return;
 if(['ice','shield'].includes(f.theme))freeze(e,a,.75+.25*f.rank);
 if(['thunder','star'].includes(f.theme)){a.dot=Math.max(a.dot||0,2);a.dotDamage=10*f.rank;a.dotOwner=f.owner;if(f.theme==='thunder')freeze(e,a,.35);}
 if(f.theme==='poison'){a.poisoned=2;a.slow=1;}
 if(f.theme==='fire'){a.burning=2;a.burnDamage=8*f.rank;a.burnOwner=f.owner;}
 if(['wind','gravity','sword'].includes(f.theme))a.slow=1;
 if(f.theme==='missile'||f.theme==='robot')a.marked=2;
 if(f.owner)e.companionHit(a,damage,f.c,{secondary:true});else e.damage(a,damage,f.color,{owner:0});
}
function area(e,x,y,r,damage,f){for(const a of e.enemies)if(live(e,a)&&Math.hypot(a.x-x,a.y-y)<r+(a.r||16))hit(e,a,damage,f);}
const distanceToLine=(a,x,y,tx,ty)=>{const dx=tx-x,dy=ty-y,t=Math.max(0,Math.min(1,((a.x-x)*dx+(a.y-y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(a.x-x-t*dx,a.y-y-t*dy);};
function wave(e,f,x,y,kind='goldHit',r=f.r){if(kind==='goldHit')return;e.fx.push({kind,x,y,r,color:f.color,theme:f.theme,life:.55,max:.55});}
export function retireSummon(e,s){if(s.retired)return;s.retired=true;const r=s.c?.growth?.explosive||0;if(!r||!e.team.includes(s.owner))return;const f={owner:s.owner,c:s.c,rank:r,theme:'fire',color:'#ffd398'};e.fx.push({kind:'reactorBlast',x:s.x,y:s.y,r:360,life:1+r*.3,max:1+r*.3,color:f.color});for(const a of e.enemies)if(live(e,a)&&inView(e,a)&&withinGold(e,s.owner,a)){if(a.boss)hit(e,a,s.c.damage*(8+4*r),f);else e.damage(a,a.hp,f.color,{owner:s.owner});}e.projectiles=e.projectiles.filter(p=>!p.enemy||!withinGold(e,s.owner,p));}
export function goldenDeath(e,a){if(!e.team.includes(11)||!rank(e.members[11],'combo')||!withinGold(e,11,a))return;e.soulOrbs??=[];if(e.soulOrbs.length<120)e.soulOrbs.push({x:a.x,y:a.y,life:3});}
export function clearGold(e){e.goldEffects=[];e.soulOrbs=[];e.goldReady={};for(const m of Object.values(e.members)){m.souls=0;}}
export function goldProtects(e){return (e.goldEffects||[]).some(f=>f.owner===5&&f.key==='fortress'&&f.life>0&&e.team.includes(5)&&Math.hypot(e.hero.x-f.x,e.hero.y-f.y)<f.r);}
export function updateGold(e,dt){
 e.goldEffects??=[];e.goldReady??={};
 const seele=e.members[11];if(e.team.includes(11)&&rank(seele,'combo')){for(const orb of e.soulOrbs||[]){orb.life-=dt;const dx=seele.x-orb.x,dy=seele.y-orb.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*650);orb.x+=dx/(d||1)*step;orb.y+=dy/(d||1)*step;if(d<30){seele.souls=Math.min(30+20*rank(seele,'combo'),(seele.souls||0)+1);orb.life=0;}}e.soulOrbs=(e.soulOrbs||[]).filter(o=>o.life>0);}else e.soulOrbs=[];
 if(e.combat)for(const spec of GOLD_EVOLUTIONS){if(spec.owner&&!e.team.includes(spec.owner))continue;const m=spec.owner?e.members[spec.owner]:e.hero,r=rank(m,spec.key),key=spec.owner+':'+spec.key;if(!r||['retire','souls','windBlades'].includes(spec.kind)||(e.goldReady[key]||0)>e.time)continue;
 if(!e.enemies.some(a=>live(e,a)&&withinGold(e,spec.owner,a)))continue;
 e.goldReady[key]=e.time+(spec.owner===3?12:spec.kind==='formation'?10:9);const t=e.nearest(m.x,m.y,wideGold(spec.owner)?([4,11].includes(spec.owner)?2800:1800):goldReach(spec.owner))||m,c={...(spec.owner?e.skillData(spec.owner):{damage:45,owner:0,color:'#f2cd77'}),rangeOwner:spec.owner};
 e.goldEffects.push({...spec,invisible:spec.owner===0&&['dome','vortex','garden'].includes(spec.kind)||spec.kind==='freezePulse',rank:r,c,owner:spec.owner,x:['vortex','sun','eruption','garden'].includes(spec.kind)?t.x:m.x,y:['vortex','sun','eruption','garden'].includes(spec.kind)?t.y:m.y,r:spec.owner===1&&spec.key==='iceShield'?150+15*r:Math.min(180+45*r,wideGold(spec.owner)?999:270),life:spec.owner===3?4+.5*(r-1):3+r,max:spec.owner===3?4+.5*(r-1):3+r,tick:0,phase:0,color:GOLD_COLORS[spec.theme],rotation:0});
 }
 e.goldEffects=e.goldEffects.filter(f=>f.life>0&&(!f.owner||e.team.includes(f.owner)));
 for(const f of e.goldEffects){f.life-=dt;f.rotation+=dt;const m=f.owner?e.members[f.owner]:e.hero,damage=(f.c.damage||35)*(.4+.2*f.rank),targets=e.enemies.filter(a=>live(e,a)&&([4,11].includes(f.owner)||inView(e,a))&&withinGold(e,f.owner,a));
 if(['orbit','dome','beams','dragon','web','formation','blizzard','coneRain','coneIce','freezePulse'].includes(f.kind)){f.x=m.x;f.y=m.y;}
 if(f.kind==='vortex')for(const a of e.enemies)if(live(e,a)&&withinGold(e,f.owner,a)&&(inView(e,a)||Math.hypot(a.x-f.x,a.y-f.y)<f.r*2)){move(a,f.x,f.y,dt,a.boss?95:320+60*f.rank);a.slow=.8;}
 if(f.kind==='dome'||f.theme==='shield'||f.owner===1&&f.key==='iceShield'){e.projectiles=e.projectiles.filter(p=>!p.enemy||Math.hypot(p.x-f.x,p.y-f.y)>f.r);}
 if(f.kind==='formation'&&f.theme==='shield')for(const a of activeActors(e).filter(a=>withinGold(e,f.owner,a)))e.projectiles=e.projectiles.filter(p=>!p.enemy||Math.hypot(p.x-a.x,p.y-a.y)>f.r*.55);
 f.tick-=dt;if(f.tick>0)continue;f.tick=f.owner===3?.9:.6;f.phase++;
 if(f.owner===8&&f.key==='barrage'&&f.phase>1)continue;
 if(f.kind==='coneRain'||f.kind==='coneIce'){
 const count=7+f.rank*2,angle=facingAngle(m);f.facing=angle;for(let i=0;i<count;i++){const a=angle-Math.PI/3+i/(count-1)*Math.PI*2/3;e.projectiles.push({kind:'fanArrow',rangeOwner:1,x:m.x,y:m.y-15,tx:m.x+Math.cos(a)*360,ty:m.y-15+Math.sin(a)*360,speed:440,damage,skill:f.c,color:f.color,life:360/440,trail:[],p:[],hits:new Set(),pierces:f.kind==='coneIce'?2:0,freezeTime:.6+.3*f.rank,r:f.kind==='coneIce'?10:5});}
 }else if(f.kind==='toxinBarrage'||f.kind==='medicBarrage'){
 const list=targets.length?Array.from({length:Math.min(targets.length,2+f.rank)},(_,i)=>targets[(i+f.phase*(2+f.rank))%targets.length]):[];
 for(const a of list){e.fire(m,a,{...f.c,kind:'medicine',damage,color:f.color,p:[]});const p=e.projectiles.at(-1);p.rangeOwner=f.owner;if(f.kind==='toxinBarrage'){p.poisonDPS=8*f.rank;p.poisonOwner=f.owner;}else p.healOnHit=3+f.rank;}
 }else if(f.kind==='rain'||f.kind==='eruption'||f.kind==='blizzard'){
 if(f.kind==='blizzard')for(const a of targets)freeze(e,a,.9+.3*f.rank);
 const list=targets.length?Array.from({length:Math.min(targets.length,2+f.rank)},(_,i)=>targets[(i+f.phase*(2+f.rank))%targets.length]):[];
 for(const a of list){const radius=f.r*.55;area(e,a.x,a.y,radius,damage*(f.kind==='eruption'?2:1),f);if(f.kind!=='blizzard')wave(e,f,a.x,a.y,f.theme==='sword'?'goldSword':f.kind==='eruption'?'goldPillar':'goldRain',radius);
 if(f.theme==='fire'||f.theme==='poison')e.zones.push({rangeOwner:f.owner,kind:f.theme==='fire'?'burn':'poison',x:a.x,y:a.y,r:radius*.65,life:1.2,tick:0,damage:12*f.rank,slow:f.theme==='poison',color:f.color});}
 }else if(f.kind==='formation'){
 f.points=activeActors(e).filter(a=>withinGold(e,f.owner,a)).map(a=>({x:a.x,y:a.y}));for(const p of f.points){area(e,p.x,p.y,f.r*.7,damage,f);if(![5,6].includes(f.owner))wave(e,f,p.x,p.y,f.theme==='sword'?'goldSword':'goldPillar',f.r*.7);}
 if(['heal','shield'].includes(f.theme)){e.hero.hp=Math.min(e.hero.maxHp,e.hero.hp+4*f.rank);for(const id of e.team)if(id!==f.owner)e.members[id].cd=Math.max(0,e.members[id].cd-.15*f.rank);}
 }else if(f.kind==='web'){
 const points=activeActors(e).filter(a=>withinGold(e,f.owner,a));f.lines=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];f.lines.push([a.x,a.y,b.x,b.y]);for(const t of e.enemies)if(live(e,t)&&distanceToLine(t,a.x,a.y,b.x,b.y)<40)hit(e,t,damage,f);}
 if(f.theme==='star')for(const id of e.team)e.members[id].cd=Math.max(0,e.members[id].cd-.2*f.rank);
 }else if(f.kind==='beams'){
 const n=f.owner===0?8:2+f.rank;f.lines=[];for(let i=0;i<n;i++){const angle=f.rotation*.7+i*Math.PI*2/n,tx=f.x+Math.cos(angle)*950,ty=f.y+Math.sin(angle)*950;f.lines.push([f.x,f.y,tx,ty]);for(const a of e.enemies)if(live(e,a)&&distanceToLine(a,f.x,f.y,tx,ty)<28+6*f.rank)hit(e,a,damage,f);}
 }else if(f.kind==='garden'){
 const radius=f.r*(.5+.5*(1-f.life/f.max));area(e,f.x,f.y,radius,damage,f);f.bloomRadius=radius;
 }else if(f.kind==='dragon'){
 if(f.last){for(const a of e.enemies)if(live(e,a)&&distanceToLine(a,f.last.x,f.last.y,f.x,f.y)<110)hit(e,a,damage*1.5,f);e.fx.push({kind:'dragonWake',x:f.last.x,y:f.last.y,tx:f.x,ty:f.y,r:110,color:f.color,life:.7,max:.7});}f.last={x:f.x,y:f.y};area(e,f.x,f.y,110,damage,f);
 }else{
 area(e,f.x,f.y,f.r,damage,f);
 if(f.kind==='orbit'&&f.owner!==1){for(let i=0;i<2+f.rank;i++){const a=f.rotation*2+i*Math.PI*2/(2+f.rank),x=f.x+Math.cos(a)*f.r,y=f.y+Math.sin(a)*f.r;e.projectiles.push({kind:'bladeWave',rangeOwner:f.owner,x,y:y-15,tx:x+Math.cos(a)*(wideGold(f.owner)?550:70),ty:y-15+Math.sin(a)*(wideGold(f.owner)?550:70),speed:420,damage:damage*.45,color:f.color,skill:f.owner?f.c:undefined,life:1.4,trail:[],p:[],hits:new Set(),pierces:999,spin:true,r:24+f.rank*8});}}
 if(f.kind==='sun')wave(e,f,f.x,f.y,'goldHit',f.r);
 if(f.theme==='heal'&&Math.hypot(e.hero.x-f.x,e.hero.y-f.y)<f.r){const heal=5*f.rank,overflow=Math.max(0,e.hero.hp+heal-e.hero.maxHp);e.hero.hp=Math.min(e.hero.maxHp,e.hero.hp+heal);e.hero.shield=Math.min(150,e.hero.shield+overflow);}
 if(f.owner===1&&f.key==='iceShield')e.hero.shield=Math.max(e.hero.shield,20+10*f.rank);
 }
 }
 e.goldEffects=e.goldEffects.filter(f=>f.life>0);
}
