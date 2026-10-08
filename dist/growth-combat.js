import {withinGold} from './local-combat.js';
import {emitWindBlades} from './wind-blades.js';
import {soulAttack,retireSummon} from './gold-combat.js';
import {castCombo} from './combo.js';
import {bladeWave} from './melee-motion.js';
import {byId} from './data.js';
import {rank} from './growth.js';
import {attackRange} from './combat-rules.js';
import {faceToward} from './world.js';
export function growthSkill(engine,id){
 const c=byId(id),m=engine.members[id],r=key=>rank(m,key);
 return {...c,owner:id,growth:{...m.growth},cd:c.cd*(1-.12*r('haste'))/(id===11?soulAttack(m):1),damage:c.damage*(1+.08*(m.level-1))*(1+.25*r('power'))*(1+.6*r('solar')),range:c.range*(1+.2*r('range')),radiusScale:(1+.2*r('range'))*(1+.35*r('solar')),strength:1+.25*r('power'),p:[]};
}
const g=(c,k)=>c.growth?.[k]||0;
const alive=(engine,e)=>e.hp>0&&(!e.boss||engine.bossAwake);
const ring=(engine,x,y,r,color,kind='burst')=>engine.fx.push({kind,x,y,r,color,life:.5,max:.5});
export function skillHit(engine,e,amount,c){
 if(!alive(engine,e)||(c.rangeOwner!==undefined&&!withinGold(engine,c.rangeOwner,e)))return;
 engine.companionHit(e,amount*(e.hp<e.maxHp*.5?1+.3*g(c,'execute'):1),c);
 if(g(c,'chill')){if([1,4,5,8].includes(c.owner))e.frozen=Math.max(e.frozen||0,.4*g(c,'chill'));else e.slow=Math.max(e.slow||0,g(c,'chill'));}
}
export function skillArea(engine,x,y,r,damage,c){for(const e of engine.enemies)if(alive(engine,e)&&Math.hypot(e.x-x,e.y-y)<r+(e.r||16))skillHit(engine,e,damage,c);}
function field(engine,x,y,c,key,kind){const r=g(c,key);if(!r)return;engine.zones.push({rangeOwner:c.rangeOwner,kind,x,y,r:70*c.radiusScale,life:2+r,tick:0,color:c.color,p:[],damage:key==='burn'?r*5:c.damage*r*(key==='windWake'?.15:.2),slow:kind!=='burn'});}
export function projectileImpact(engine,e,p){
 const c=p.skill;if(!c)return false;
 if(p.medicine||p.poisonDPS){e.poisoned=3;e.poisonDPS=Math.max(e.poisonDPS||0,p.poisonDPS||8*Math.max(g(c,'medicine'),g(c,'power'),1));e.poisonOwner=p.poisonOwner??c.owner;e.slow=Math.max(e.slow||0,1);}
 skillHit(engine,e,p.damage,c);if(p.healOnHit){const h=engine.hero,overflow=Math.max(0,h.hp+p.healOnHit-h.maxHp);h.hp=Math.min(h.maxHp,h.hp+p.healOnHit);h.shield=Math.min(150,h.shield+overflow);}
 if(c.owner===1)e.slow=Math.max(e.slow||0,2);
 const ice=c.owner===1?0:g(c,'iceBurst'),bomb=g(c,'explosive');if(ice||bomb){const r=(65+15*(ice||bomb))*c.radiusScale;ring(engine,e.x,e.y,r,c.color);skillArea(engine,e.x,e.y,r,p.damage*(ice*.45+bomb*.7),c);if(ice)for(const a of engine.enemies)if(alive(engine,a)&&(c.rangeOwner===undefined||withinGold(engine,c.rangeOwner,a))&&Math.hypot(a.x-e.x,a.y-e.y)<r)a.frozen=Math.max(a.frozen||0,.6*ice);}
 field(engine,e.x,e.y,c,'burn','burn');

 p.hitIds??=new Set();p.hitIds.add(e);
 if(p.hitIds.size<=g(c,'pierce')+(c.owner===9?g(c,'range'):0)){const next=engine.enemies.find(a=>alive(engine,a)&&(p.rangeOwner===undefined||withinGold(engine,p.rangeOwner,a))&&!p.hitIds.has(a)&&Math.hypot(a.x-e.x,a.y-e.y)<220*c.radiusScale);if(next){p.target=next;p.life=Math.max(p.life,1);return true;}}
 return false;
}
export function castGrowth(engine,m,e){
 if(m.id===3){if(engine.time<(m.nextCannonAt??0))return;m.nextCannonAt=engine.time+1.8;}
 const c=engine.skillData(m.id),h=engine.hero,r=k=>g(c,k);m.cast=.42;m.cd=c.cd;if(e)faceToward(m,e.x,e.y);m.attackDir=m.direction;
 castCombo(engine,m,c);emitWindBlades(engine,m,c);
 engine.stats.skills[m.id]=(engine.stats.skills[m.id]||0)+1;engine.event('sound',{kind:c.kind});
 if(r('rally'))for(const id of engine.team){if(id!==m.id)engine.members[id].cd=Math.max(0,engine.members[id].cd-r('rally')*(m.id===5?.7:m.id===6?.8:.5));}
 if(c.kind==='shield'){
 h.shield=Math.max(h.shield,(30*c.strength+15*r('ward'))*(1+.8*r('fortress')));ring(engine,h.x,h.y,52,c.color,'shield');
 if(e){engine.fx.push({kind:'slash',x:m.x,y:m.y,angle:Math.atan2(e.y-m.y,e.x-m.x),color:c.color,r:90*c.radiusScale,life:.4,max:.4});skillArea(engine,m.x,m.y,170*c.radiusScale,c.damage,c);for(const a of engine.enemies)if(alive(engine,a)&&Math.hypot(a.x-m.x,a.y-m.y)<170*c.radiusScale)a.frozen=Math.max(a.frozen,.8+.7*r('chill'));engine.pushAway(m.x,m.y,170*c.radiusScale,100+35*r('ward')); }
 if(r('fortress')){m.domain=2+r('fortress');m.domainRadius=150+r('fortress')*30;}
 if(r('fortress'))for(const a of engine.enemies)if(alive(engine,a)&&Math.hypot(a.x-h.x,a.y-h.y)<150*c.radiusScale)a.frozen=Math.max(a.frozen||0,.7*r('fortress'));
 if(r('iceBurst')){const rad=(130+r('iceBurst')*25)*c.radiusScale;skillArea(engine,h.x,h.y,rad,c.damage*1.5*r('iceBurst'),c);}return;
 }
 if(c.kind==='heal'){
 const amount=24*c.strength*(1+.6*r('overheal')),overflow=Math.max(0,h.hp+amount-h.maxHp);h.hp=Math.min(h.maxHp,h.hp+amount);
 h.shield=Math.max(h.shield,12*r('ward'),r('overheal')?Math.min(50*r('overheal'),h.shield+overflow):0);
 engine.fire(m,{x:h.x,y:h.y,hp:1},{...c,kind:'capsule'});engine.zones.push({kind:'heal',invisible:true,x:h.x,y:h.y,r:58*c.radiusScale,life:r('regen')?2+r('regen')*2:1.6,tick:0,p:[],healing:2*r('regen'),color:c.color});
 if(r('medicine')){const targets=engine.enemies.filter(a=>alive(engine,a)&&Math.hypot(a.x-m.x,a.y-m.y)<attackRange({...c,kind:'meteor'})).slice(0,2+r('medicine'));for(const a of targets){engine.fire(m,a,{...c,kind:'medicine',damage:35*r('medicine')*c.strength});engine.projectiles.at(-1).medicine=true;}}return;
 }
 if(c.kind==='melee'||c.kind==='scythe'){
 const angle=Math.atan2(e.y-m.y,e.x-m.x),kind=c.kind==='melee'?'slash':'scythe';
 for(let i=0;i<1+2*r('combo');i++)engine.fx.push({kind,x:m.x+i*4,y:m.y-i*2,angle:angle+i*.16,r:c.range,color:c.color,delay:i*.06,life:.36,max:.36});
 skillHit(engine,e,c.damage*(1+1.5*r('combo')),c);
 if(r('quantum'))bladeWave(engine,m,e,c,r('quantum')+1,c.damage*r('quantum')*.85,650+r('quantum')*150);
 if(r('windWake')){const a=Math.atan2(e.y-m.y,e.x-m.x),d=190+r('windWake')*70;m.charge={x:m.x+Math.cos(a)*d,y:m.y+Math.sin(a)*d,dir:m.direction,damage:c.damage*r('windWake')*1.2,life:d/1050+.1,hits:new Set()};}field(engine,e.x,e.y,c,'windWake','wind');if(e.hp<=0&&r('reprise'))m.cd*=1-.3*r('reprise');return;
 }
 if(c.kind==='spin'){
 if(r('combo'))m.spin=3+r('combo');
 for(let i=0;i<1+r('combo');i++)engine.fx.push({kind:'spin',x:m.x,y:m.y,r:c.range,color:c.color,delay:i*.12,life:.8,max:.8});skillArea(engine,m.x,m.y,c.range,c.damage*(1+r('combo')),c);engine.pushAway(m.x,m.y,c.range);
 if(r('iceBurst')){const rad=(110+20*r('iceBurst'))*c.radiusScale;ring(engine,m.x,m.y,rad,c.color);skillArea(engine,m.x,m.y,rad,c.damage*.75*r('iceBurst'),c);}if(r('frostWake'))for(const a of engine.enemies)if(alive(engine,a)&&Math.hypot(a.x-m.x,a.y-m.y)<c.range)a.frozen=Math.max(a.frozen||0,.6+.3*r('frostWake'));return;
 }
 if(c.kind==='laser'||c.kind==='lord'){
 if(c.kind==='lord'){skillArea(engine,m.x,m.y,c.range,c.damage*.7,c);engine.fx.push({kind:'slash',x:m.x,y:m.y,r:c.range,color:c.color,angle:Math.atan2(e.y-m.y,e.x-m.x),life:.35,max:.35});if(r('barrage'))bladeWave(engine,m,e,c,r('barrage')*2+1,c.damage*r('barrage')*.55,720);}
 const targets=engine.enemies.filter(a=>alive(engine,a)&&Math.hypot(a.x-e.x,a.y-e.y)<600),count=1+r('barrage')*(c.kind==='lord'?2:1);
 for(let i=0;i<count;i++){const t=targets[i%targets.length]||e;const f={kind:c.kind,x:t.x,y:t.y,delay:i*.24,r:(c.kind==='laser'?78:90)*c.radiusScale,damage:c.damage,p:[],color:c.color,life:.75,max:.75,hit:false,skill:c};engine.fx.push(f);if(r('aftershock'))engine.fx.push({...f,delay:i*.24+.6,damage:c.damage*.6*r('aftershock')});}return;
 }
 if(c.kind==='chain'){
 const targets=engine.enemies.filter(a=>alive(engine,a)&&Math.hypot(a.x-m.x,a.y-m.y)<=attackRange(c)&&Math.hypot(a.x-e.x,a.y-e.y)<220*c.radiusScale).sort((a,b)=>Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y)).slice(0,3+r('chain')*3);let prev=m;
 for(const t of targets){engine.fx.push({kind:'lightning',x:prev.x,y:prev.y-15,tx:t.x,ty:t.y-15,color:c.color,life:.35,max:.35});skillHit(engine,t,c.damage,c);t.dot=Math.max(t.dot||0,3+2*r('dot'));t.dotDamage=7+6*r('dot');if(r('detonate'))engine.companionHit(t,(t.dot*t.dotDamage+(t.poisoned>0?20:0)+(t.burning>0?20:0)+(t.frozen>0?15:0))*.75*r('detonate'),c);prev=t;}
 if(r('thunder')&&targets.length){const rad=(110+20*r('thunder'))*c.radiusScale;ring(engine,prev.x,prev.y,rad,c.color);skillArea(engine,prev.x,prev.y,rad,c.damage*1.4*r('thunder'),c);}return;
 }
 if(c.kind==='robot'){
 for(const s of engine.summons)if(s.owner===m.id)retireSummon(engine,s);engine.summons=engine.summons.filter(s=>s.owner!==m.id);h.shield=Math.max(h.shield,15*r('ward'));
 for(let i=0;i<1+r('robots');i++){engine.summons.push({x:m.x+30+i*32,y:m.y,id:'svarog',direction:0,cast:0,life:4.5+2*r('duration'),owner:m.id,cd:.1+i*.15,c});ring(engine,m.x+30+i*32,m.y,38,'#f4d68c');}return;
 }
 if(r('iceShield'))h.shield=Math.max(h.shield,Math.min(30+30*r('iceShield'),h.shield+6*r('iceShield')));
 const n=(c.kind==='meteor'?3:1)+r('volley')*(c.kind==='meteor'?3:2),targets=engine.enemies.filter(a=>alive(engine,a)&&Math.hypot(a.x-m.x,a.y-m.y)<attackRange(c));
 for(let i=0;i<n;i++)engine.fire(m,targets[i%targets.length]||e,c,i*.12);
}
export function impactField(engine,f){skillArea(engine,f.x,f.y,f.r,f.damage,f.skill);field(engine,f.x,f.y,f.skill,'burn','burn');}
export function heroGrowth(engine,dt){
 const h=engine.hero,r=k=>rank(h,k),sword=r('sword')||r('swordStorm')||r('bladeLength')?Math.max(1,r('sword')):0,n=sword+2*r('swordStorm');
 engine.orbitSwords=[];
 for(let i=0;i<n;i++){const angle=engine.time*2.8+i*Math.PI*2/n,length=94*(1+.2*(sword-1)+.35*r('bladeLength')+.15*r('swordStorm')),radius=100+18*r('bladeLength')+10*(sword-1);engine.orbitSwords.push({x:h.x+Math.cos(angle)*radius,y:h.y+Math.sin(angle)*radius,angle,length});}
 if(n)for(const e of engine.enemies)if(alive(engine,e)&&withinGold(engine,0,e)&&engine.time>=(e.swordAt||0)&&engine.orbitSwords.some(s=>swordTouches(s,e))){e.swordAt=engine.time+.5;engine.damage(e,(18+6*sword)*(1+.5*r('swordStorm')),'#ffe29c');ring(engine,e.x,e.y,22,'#ffe29c','hit');}
 h.bulletCd=(h.bulletCd||0)-dt;const bullet=r('bullet');
 if(bullet&&h.bulletCd<=0){h.bulletCd=.65;const angle=[Math.PI/2,Math.PI,0,-Math.PI/2][h.direction||0],angles=Array.from({length:bullet},(_,i)=>angle+(i-(bullet-1)/2)*.16);
 for(const a of angles)engine.projectiles.push({kind:'heroBullet',rangeOwner:0,x:h.x,y:h.y-15,tx:h.x+Math.cos(a)*300,ty:h.y-15+Math.sin(a)*300,speed:480,damage:(14+4*bullet)*(1+.4*r('bulletNova')),color:'#f4ca74',life:300/480,p:[],trail:[],hits:new Set(),pierces:r('bulletNova')});}
 const poison=Math.max(r('poison'),r('toxicBloom')?1:0);h.poisonCd=(h.poisonCd||0)-dt;h.bloomCd=(h.bloomCd||0)-dt;
 const pool=(x,y)=>engine.zones.push({kind:'poison',x,y,r:(42+8*poison)*(1+.25*r('toxicBloom')),life:3+poison,tick:0,color:'#b16af0',damage:(3+3*poison)*(1+.7*r('toxicBloom')),slow:true,p:[]});
 if(poison&&!r('toxicBloom')&&h.moving&&h.poisonCd<=0){h.poisonCd=.7;pool(h.x,h.y);}

 const targets=()=>engine.enemies.filter(a=>alive(engine,a)&&withinGold(engine,0,a));
 h.buildTimers??={};const ready=(key,cd)=>{h.buildTimers[key]=(h.buildTimers[key]||0)-dt;if(h.buildTimers[key]>0)return false;h.buildTimers[key]=cd;return true;};
 const lightning=Math.max(r('lightning'),r('thunderKing')?1:0);if(lightning&&ready('lightning',2.4-lightning*.3)){let prev=h;for(const a of targets().slice(0,2+lightning+3*r('thunderKing'))){engine.fx.push({kind:'lightning',x:prev.x,y:prev.y-15,tx:a.x,ty:a.y-15,color:'#c1b0ff',life:.3,max:.3});engine.damage(a,(22+16*lightning)*(1+.6*r('thunderKing')),'#c1b0ff');if(r('thunderKing'))a.frozen=Math.max(a.frozen,.5);prev=a;}}
 const meteor=Math.max(r('meteor'),r('meteorRain')?1:0);if(meteor&&ready('meteor',3)){for(const a of targets().slice(0,meteor+2*r('meteorRain'))){engine.fx.push({kind:'laser',rangeOwner:0,x:a.x,y:a.y,r:(75+meteor*15)*(1+.2*r('meteorRain')),damage:(40+meteor*25)*(1+.5*r('meteorRain')),color:'#ffbd83',p:[],life:.8,max:.8,hit:false});}}
 const pulse=Math.max(r('pulse'),r('gravity')?1:0);if(pulse&&ready('pulse',2.5)){const rad=Math.min(300,r('gravity')?220+40*r('gravity'):110+35*pulse);if(r('gravity')){engine.pushAway(h.x,h.y,rad,-100);engine.fx.push({kind:'laser',rangeOwner:0,x:h.x,y:h.y,r:rad,damage:(25+20*pulse)*(1+r('gravity')),color:'#ad89f4',invisible:true,p:[],life:.75,max:.75,delay:.6,hit:false});}else{engine.area(h.x,h.y,rad,25+20*pulse,'#abdbff');engine.pushAway(h.x,h.y,rad,60);}if(!r('gravity'))ring(engine,h.x,h.y,rad,'#ab99ff');}
 const frost=Math.max(r('frost'),r('absoluteZero')?1:0);if(frost&&ready('frost',3)){const rad=Math.min(300,(130+30*frost)*(1+.3*r('absoluteZero')));for(const a of targets())if(Math.hypot(a.x-h.x,a.y-h.y)<rad)engine.damage(a,(20+15*frost)*(1+.8*r('absoluteZero')),'#a1ebff');for(const a of targets())if(Math.hypot(a.x-h.x,a.y-h.y)<rad)a.frozen=Math.max(a.frozen,.5+.3*frost+.6*r('absoluteZero'));if(!r('absoluteZero'))ring(engine,h.x,h.y,rad,'#a1ebff');}
 if(r('leech')){const reached=Math.floor(engine.kills/10);if(h.leechMilestone!==undefined&&reached>h.leechMilestone)h.hp=Math.min(h.maxHp,h.hp+(reached-h.leechMilestone)*5*r('leech'));h.leechMilestone=reached;}

}

export function swordTouches(s,e){const dx=Math.cos(s.angle)*s.length/2,dy=Math.sin(s.angle)*s.length/2,ax=s.x-dx,ay=s.y-dy,vx=dx*2,vy=dy*2,t=Math.max(0,Math.min(1,((e.x-ax)*vx+(e.y-ay)*vy)/(vx*vx+vy*vy)));return Math.hypot(e.x-ax-vx*t,e.y-ay-vy*t)<15+(e.r||16);}
