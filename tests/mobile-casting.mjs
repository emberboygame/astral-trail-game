import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {attackRange,actorFrame} from '../dist/combat-rules.js';
import {byId} from '../dist/data.js';
const enemy=(x,y)=>({id:'target',x,y,homeX:x,homeY:y,hp:1e6,maxHp:1e6,r:17,cd:99,slow:0,frozen:999,dot:0,kind:'melee'});
for(const id of [1,3,7,9,10]){
 const e=new Engine(()=>.99);e.team=[id];e.hero.x=1300;e.hero.y=650;const m=e.members[id];Object.assign(m,{x:650,y:650,cd:0});e.enemies=[enemy([1,7].includes(id)?980:1600,650)];e.combatView=()=>true;
 e.update(.02);assert.ok(m.moving,'ranged moves while casting '+id);assert.ok(m.cast>0);assert.equal(e.stats.skills[id],1,'ranged casts on first battle tick at 950 units '+id);assert.equal(attackRange(byId(id)),id===1?360:id===7?420:1200);
 const dir=m.attackDir,first=actorFrame(m,0);assert.equal(first.row,4);assert.equal(first.col,dir);
 for(let i=0;i<12;i++)e.update(.02);assert.ok(m.moving);assert.ok(m.cast>0);assert.equal(actorFrame(m,900).row,5);assert.equal(actorFrame(m,900).col,dir,'movement must not replace attack direction');
 for(let i=0;i<10;i++)e.update(.02);assert.equal(m.cast,0);assert.ok(m.moving);assert.ok(actorFrame(m,34).row>=1&&actorFrame(m,34).row<=3,'walking resumes after skill pose');
 for(let i=0;i<270;i++)e.update(.02);assert.ok(e.enemies[0].hp<1e6,'long-range ability actually deals damage '+id);
}
const e=new Engine();e.fire({x:0,y:0},{x:1190,y:0,hp:1},{...byId(10),p:[]});assert.ok(e.projectiles[0].life>1190/300,'meteor survives full flight');
const heal=new Engine();heal.team=[6];Object.assign(heal.hero,{x:1300,y:650,hp:50});Object.assign(heal.members[6],{x:1300,y:1000,cd:0});heal.enemies=[enemy(1400,650)];heal.update(.02);assert.ok(heal.members[6].moving&&heal.members[6].cast>0&&heal.hero.hp>50,'healing while following');
console.log('Ranged companions move/cast/hit at their intended reach (March 360, Kafka 420, others 1200); animation priority/direction/completion and healing during follow passed.');
