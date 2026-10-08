import {moveExpansion} from './expansion-combat.js';
import {emitWindBlades} from './wind-blades.js';
import {rank} from './growth.js';
import {move} from './world.js';
export function movingSkills(e,m,dt){
 if(moveExpansion(e,m,dt))return true;
 if(m.domain>0){m.domain-=dt;for(const a of e.enemies)if(a.hp>0&&Math.hypot(a.x-m.x,a.y-m.y)<m.domainRadius)a.frozen=Math.max(a.frozen,.3);}
 if(m.charge){emitWindBlades(e,m,e.skillData(m.id));const q=m.charge;q.life-=dt;const old={x:m.x,y:m.y};move(m,q.x,q.y,dt,1050);m.cast=.3;m.attackDir=q.dir;for(const a of e.enemies){const vx=m.x-old.x,vy=m.y-old.y,t=Math.max(0,Math.min(1,((a.x-old.x)*vx+(a.y-old.y)*vy)/(vx*vx+vy*vy||1)));if(a.hp>0&&(!a.boss||e.bossAwake)&&!q.hits.has(a)&&Math.hypot(a.x-old.x-vx*t,a.y-old.y-vy*t)<55){q.hits.add(a);e.companionHit(a,q.damage,e.skillData(m.id));}}e.fx.push({kind:'slash',x:m.x,y:m.y,angle:Math.atan2(q.y-old.y,q.x-old.x),r:65,color:'#6bdbb5',life:.18,max:.18});if(q.life<=0||Math.hypot(m.x-q.x,m.y-q.y)<8)m.charge=null;return true;}
 if(m.id===4&&m.spin>0&&e.combat){m.spin-=dt;const r=rank(m,'combo'),haste=rank(m,'haste'),t=m.targetEnemy?.hp>0?m.targetEnemy:e.nearest(m.x,m.y,2800);m.spinAngle=(m.spinAngle||0)+dt*(5+2*r)*(1+.2*haste);if(t)move(m,t.x+Math.cos(m.spinAngle*.45)*90,t.y+Math.sin(m.spinAngle*.6)*80,dt,(250+35*r)*(1+.2*haste));m.cast=.3;m.spinTick=(m.spinTick||0)-dt;if(m.spinTick<=0){m.spinTick=.35/(1+.15*haste);const c=e.skillData(4);for(const a of e.enemies)if(a.hp>0&&Math.hypot(a.x-m.x,a.y-m.y)<c.range+(a.r||16))e.companionHit(a,c.damage*(.5+.3*r),c);e.fx.push({kind:'spin',x:m.x,y:m.y,r:c.range,color:c.color,life:.32,max:.32});}return true;}return false;
}
export function bladeWave(e,m,target,c,count,damage,distance){const angle=Math.atan2(target.y-m.y,target.x-m.x);for(let i=0;i<count;i++){const a=angle+(i-(count-1)/2)*.16;e.projectiles.push({kind:'bladeWave',rangeOwner:c.owner===8?undefined:c.owner,x:m.x,y:m.y-15,tx:m.x+Math.cos(a)*distance,ty:m.y-15+Math.sin(a)*distance,speed:460,damage,skill:c,color:c.color,life:distance/460,delay:i*.07,trail:[],p:[],hits:new Set(),pierces:999,spin:c.owner===11,r:45+10*count});}}
