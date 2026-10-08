import {withinGold} from './local-combat.js';
// Shared, bounded reactions: deaths queue follow-ups instead of recursive damage.
export const statusCount=e=>['frozen','slow','dot','poisoned','burning','marked','broken'].filter(k=>e[k]>0).length;
const r=(m,k)=>m?.growth?.[k]||0;
const live=(e,a)=>a.hp>0&&(!a.boss||e.bossAwake);
export const inView=(e,a)=>e.combatView?e.combatView(a):Math.hypot(a.x-e.hero.x,a.y-e.hero.y)<800;
export function freeze(e,a,seconds){if(!live(e,a))return;if(seconds>0&&(a.freezeStamp===undefined||e.time-a.freezeStamp>.3)){a.freezeSerial=(a.freezeSerial||0)+1;a.freezeStamp=e.time;}a.frozen=Math.max(a.frozen||0,seconds);if(!a.boss){a.moving=false;a.cast=0;}}
export function comboText(e,a,text,color='#b5eeff'){if((a.comboTextAt||0)>e.time)return;a.comboTextAt=e.time+.35;e.fx.push({kind:'number',text,x:a.x,y:a.y-22,color,life:.65,max:.65});}
export function hitCombo(e,a,amount,c,meta={}){
 if(!live(e,a))return;const id=c.owner,m=e.members[id],rank=k=>r(m,k),frozen=a.frozen>0,abnormal=statusCount(a)>0;
 if(id===2&&abnormal){amount*=2+.35*rank('power');comboText(e,a,'异常暴击','#ffe7a4');}
 if(id===4&&frozen&&rank('iceBurst')){amount=a.boss?amount*(2+rank('iceBurst')):a.hp;comboText(e,a,a.boss?'碎冰重击':'碎冰斩杀');e.fx.push({kind:'shatter',x:a.x,y:a.y,r:65+rank('iceBurst')*15,color:'#9feaff',life:.4,max:.4});}
 if(id===4&&frozen&&rank('power'))for(const b of e.enemies.filter(b=>b!==a&&live(e,b)&&Math.hypot(b.x-a.x,b.y-a.y)<200).slice(0,rank('power')+1)){freeze(e,b,.6);e.fx.push({kind:'lightning',x:a.x,y:a.y-15,tx:b.x,ty:b.y-15,color:'#b6f1ff',life:.2,max:.2});}
 if(id===2&&abnormal&&rank('range'))for(const b of e.enemies)if(live(e,b)&&Math.hypot(b.x-a.x,b.y-a.y)<90+25*rank('range'))b.slow=Math.max(b.slow||0,1);
 if(id===8&&rank('range'))a.slow=Math.max(a.slow||0,.5+.5*rank('range'));
 if(id===1&&rank('power'))freeze(e,a,.6+.3*rank('power'));
 if(id===7){a.dot=Math.max(a.dot||0,3);a.dotDamage=7+6*rank('dot');a.dotOwner=id;if(rank('power'))a.poisoned=2+rank('power');}
 if([3,10].includes(id)&&rank('power')){a.burning=2+rank('power');a.burnDamage=5*rank('power');a.burnOwner=id;}
 if(id===9&&rank('power'))a.marked=2+rank('power');
 if(id===11&&rank('power'))a.marked=2+rank('power');
 if(a.marked>0)amount*=1.2;
 if(id===3&&frozen&&rank('range')&&!meta.secondary){a.frozen=0;comboText(e,a,'融冰蒸爆','#ffce97');for(const b of e.enemies)if(b!==a&&live(e,b)&&Math.hypot(a.x-b.x,a.y-b.y)<100+25*rank('range'))e.damage(b,amount*.6,c.color,{owner:id,secondary:true});e.fx.push({kind:'burst',x:a.x,y:a.y,r:100+25*rank('range'),color:'#ffce97',life:.4,max:.4});}
 if(id===8&&abnormal&&rank('power')&&!meta.secondary){const targets=e.enemies.filter(b=>b!==a&&live(e,b)&&Math.hypot(a.x-b.x,a.y-b.y)<240).slice(0,rank('power')+1);for(const b of targets){e.fx.push({kind:'lightning',x:a.x,y:a.y-15,tx:b.x,ty:b.y-15,color:c.color,life:.3,max:.3});e.damage(b,amount*.5,c.color,{owner:id,secondary:true});}}
 e.damage(a,amount,c.color,{owner:id,...meta});
}
export function deathCombo(e,a,meta={}){e.comboDeaths??=[];e.comboDeaths.push({x:a.x,y:a.y,status:statusCount(a),frozen:a.frozen>0,dot:a.dot>0,poisoned:a.poisoned>0,burning:a.burning>0,owner:meta.owner,generation:meta.generation||0});}
export function castCombo(e,m,c){const rank=k=>r(m,k);if(m.id===5){const full=rank('iceBurst');for(const a of e.enemies)if(live(e,a)&&(full?withinGold(e,5,a):Math.hypot(a.x-m.x,a.y-m.y)<170*c.radiusScale))freeze(e,a,full?1.5+.75*full:1+rank('chill')*.7);if(full)comboText(e,m,'永冬降临');}
 if(m.id===4&&rank('range'))e.pushAway(m.x,m.y,140+30*rank('range'),-35);
 if(m.id===6&&rank('power')){const target=e.nearest(m.x,m.y,1200);if(target){e.fire(m,target,{...c,kind:'medicine',damage:20*rank('power')});e.projectiles.at(-1).medicine=true;}}
 if(m.id===1&&rank('range')&&e.hero.shield>0){const t=e.nearest(m.x,m.y,1200);if(t)for(let i=0;i<rank('range');i++)e.fire(m,t,c,.1*i);}
 if(m.id===5&&rank('range')){for(const p of e.projectiles)if(p.enemy&&Math.hypot(p.x-m.x,p.y-m.y)<180+30*rank('range')){p.life=0;const t=e.nearest(m.x,m.y,1200);if(t)e.fire(m,t,{...c,kind:'arrow',damage:c.damage*.5});}}
 if(m.id===10&&rank('range')){for(const a of e.enemies)if(live(e,a)&&a.burning>0&&Math.hypot(a.x-m.x,a.y-m.y)<1200)for(const b of e.enemies)if(b!==a&&live(e,b)&&Math.hypot(b.x-a.x,b.y-a.y)<65+15*rank('range')){b.burning=2;b.burnDamage=5;b.burnOwner=10;}}
}
export function updateCombos(e,dt){
 for(const a of e.enemies){if(a.poisoned>0&&a.poisonDPS>0){a.poisonTick=(a.poisonTick||0)+Math.min(dt,a.poisoned);if(a.poisonTick>=.5){e.damage(a,a.poisonDPS*a.poisonTick,'#b890df',{owner:a.poisonOwner});a.poisonTick=0;}}else{a.poisonDPS=0;a.poisonTick=0;}for(const k of ['poisoned','burning','marked'])a[k]=Math.max(0,(a[k]||0)-dt);if(a.burning>0&&live(e,a))e.damage(a,dt*(a.burnDamage||5),'#ffc17d',{owner:a.burnOwner});}
 const events=(e.comboDeaths||[]).splice(0,16);
 for(const dead of events){
  const dan=e.members[2];if(e.team.includes(2)&&dead.owner===2&&r(dan,'windWake')){dan.chainCharges=Math.min(4,(dan.chainCharges||0)+1);dan.cd=0;}
  if(dead.status)for(const id of e.team){const m=e.members[id],haste=r(m,'haste');if(haste)m.cd=Math.max(0,m.cd-.15*haste);}
  if(e.team.includes(4)&&dead.frozen&&r(e.members[4],'frostWake')){const rank=r(e.members[4],'frostWake');for(const a of e.enemies)if(live(e,a)&&Math.hypot(a.x-dead.x,a.y-dead.y)<85+rank*25)freeze(e,a,.6+rank*.3);e.fx.push({kind:'shatter',x:dead.x,y:dead.y,r:85+rank*25,color:'#c9f6ff',life:.4,max:.4});}
  if(e.team.includes(7)&&dead.status&&r(e.members[7],'range')){const rank=r(e.members[7],'range');for(const a of e.enemies.filter(a=>live(e,a)&&Math.hypot(a.x-dead.x,a.y-dead.y)<170+30*rank).slice(0,rank+1)){a.dot=Math.max(a.dot||0,2+rank);a.dotDamage=10;a.dotOwner=7;if(dead.poisoned)a.poisoned=2;if(dead.burning){a.burning=2;a.burnDamage=5;a.burnOwner=7;}}}
  const seele=e.members[11];if(e.team.includes(11)&&dead.generation<1+r(seele,'reprise')){const target=e.nearest(dead.x,dead.y,500+80*r(seele,'range'));if(target){const c=e.skillData(11);e.comboEchoes??=[];if(e.comboEchoes.length<48)e.comboEchoes.push({x:dead.x,y:dead.y,target,life:.22,damage:c.damage*(.45+.25*r(seele,'reprise')),generation:dead.generation+1});}}
  if(e.team.includes(6)&&dead.poisoned&&r(e.members[6],'range')){e.hero.hp=Math.min(e.hero.maxHp,e.hero.hp+2*r(e.members[6],'range'));}
 }
 for(const id of e.team){const m=e.members[id];if(id===2&&m.chainCharges>0&&!m.charge){const t=e.nearest(m.x,m.y,1000);if(t){const a=Math.atan2(t.y-m.y,t.x-m.x),d=Math.min(700,Math.hypot(t.x-m.x,t.y-m.y)+90);m.chainCharges--;m.charge={x:m.x+Math.cos(a)*d,y:m.y+Math.sin(a)*d,dir:Math.abs(Math.cos(a))>Math.abs(Math.sin(a))?(Math.cos(a)>0?2:1):(Math.sin(a)>0?0:3),damage:e.skillData(2).damage*(1+ .5*r(m,'windWake')),life:d/1050+.1,hits:new Set()};comboText(e,m,'连杀 · 游龙','#b2ffe0');}else m.chainCharges=0;}}
 if(!e.team.includes(11))e.comboEchoes=[];
 for(const q of e.comboEchoes||[]){q.life-=dt;if(q.life>0)continue;const t=live(e,q.target)?q.target:e.nearest(q.x,q.y,600);if(t){const c=e.skillData(11);e.fx.push({kind:'echo',x:t.x,y:t.y,r:70,color:c.color,life:.35,max:.35});hitCombo(e,t,q.damage,c,{generation:q.generation,secondary:true});}q.done=true;}
 e.comboEchoes=(e.comboEchoes||[]).filter(q=>!q.done);
}
