import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {ANIMATION_FRAMES} from '../dist/animation-frames.js';
const enemy=(x,y)=>({id:'test',x,y,homeX:x,homeY:y,hp:1e6,maxHp:1e6,r:17,cd:99,slow:0,frozen:999,dot:0,kind:'melee'});
function scene(id){const e=new Engine(()=>.99);e.team=[id];Object.assign(e.hero,{x:1300,y:650});Object.assign(e.members[id],{x:1300,y:690,cd:0});e.enemies=[enemy(1330,730)];e.combatView=()=>true;return e;}
const e=scene(1),m=e.members[1];e.update(.02);const start={x:m.x,y:m.y};e.hero.x=1490;e.hero.y=650;for(let i=0;i<100;i++)e.update(.02);assert.equal(m.x,start.x);assert.equal(m.y,start.y);assert.ok(e.stats.skills[1]>=2,'casts continue below follow threshold');
e.hero.x=1590;e.update(.02);assert.equal(m.rejoining,true);assert.ok(Math.hypot(m.x-start.x,m.y-start.y)>0,'ranged follows beyond 250 even in same camera');
Object.assign(e.hero,{x:m.x,y:m.y+120});e.update(.02);assert.equal(m.rejoining,false,'follow stops within 150');
for(const id of [4,5]){const g=scene(id),a=g.members[id];g.update(.02);const target=a.targetEnemy;assert.equal(target,g.enemies[0]);const d=Math.hypot(a.x-target.x,a.y-target.y);for(let i=0;i<40;i++)g.update(.02);assert.ok(Math.hypot(a.x-target.x,a.y-target.y)<=d);assert.equal(a.targetEnemy,target);assert.ok(target.hp<target.maxHp,'guard damages nearby enemy');if(id===5)assert.ok(g.hero.shield>0);if(id===4){const f=g.fx.find(f=>f.kind==='spin');if(f)assert.ok(Math.hypot(f.x-g.hero.x,f.y-g.hero.y)>5,'Herta spin centered on Herta');}target.hp=0;g.update(.02);assert.equal(g.combat,false);assert.equal(a.targetEnemy,null);}
for(const frames of Object.values(ANIMATION_FRAMES)){assert.equal(frames.length,24);for(const f of frames){assert.ok(f.w>0&&f.h>0&&f.x>=0&&f.y>=0&&f.x+f.w<=512&&f.y+f.h<=768);assert.ok(f.anchorX>=0&&f.anchorX<=f.w&&f.anchorY<=f.h);}}
console.log('Revision 3 passed: ranged distance hysteresis, uninterrupted casting, target lock, Herta/Gepard combat, regroup, 360 frame bounds/pivots.');

const battle=scene(1),ranged=battle.members[1];battle.update(.02);battle.hero.x=1490;const p0={x:ranged.x,y:ranged.y};battle.enemies.push({...enemy(1350,740),id:'next'});battle.enemies[0].hp=0;battle.update(.02);assert.equal(battle.combat,true);assert.equal(ranged.x,p0.x);assert.equal(ranged.y,p0.y);assert.equal(ranged.targetEnemy,battle.enemies[1]);console.log('v0.3.1 regression: killed target switches to next enemy without regroup.');
