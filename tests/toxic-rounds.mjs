import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {newFloor,spawnTrial,floorHealth,floorSpawnInterval} from '../dist/trial.js';
import {updateGold} from '../dist/gold-combat.js';
import {projectileImpact} from '../dist/growth-combat.js';
import {updateCombos,statusCount} from '../dist/combo.js';
const setup=()=>{const e=new Engine(()=>.99);e.quest=3;e.travel('starfield');e.team=[6];e.hero.x=2350;e.hero.y=1700;e.hero.hp=30;e.members[6].x=2350;e.members[6].y=1700;e.enemies=[];e.updateSpawns=()=>{};e.giveXP=()=>{};e.combat=true;return e;};
const enemy=e=>{const a={x:2400,y:1700,hp:1000,maxHp:1000,r:17,frozen:0,dot:0,slow:0};e.enemies.push(a);return a;};
for(const [id,key]of [[0,'toxicBloom'],[6,'medicine'],[6,'overheal']]){const e=setup(),m=id?e.members[id]:e.hero;m.growth={[key]:1};const a=enemy(e);updateGold(e,.02);assert.ok(e.projectiles.length);assert.equal(e.goldEffects.filter(f=>['garden','dome'].includes(f.kind)).length,0);const p=e.projectiles[0],hp=a.hp;projectileImpact(e,a,p);assert.ok(a.hp<hp);if(key==='overheal')assert.ok(e.hero.hp>30);else{assert.ok(a.poisoned>0&&statusCount(a)>0);const hitHP=a.hp;updateCombos(e,.5);assert.ok(a.hp<hitHP);}assert.ok(!e.zones.some(z=>z.kind==='poison'));}
console.log('Hero expanding poison and Natasha healing/poison fields become hit-driven bullets; poison ticks and healing resolve with no large zones.');
{const e=setup(),a=enemy(e);e.members[6].growth={medicine:1};e.cast(e.members[6],a);projectileImpact(e,a,e.projectiles.find(p=>p.medicine));assert.ok(a.poisoned>0);assert.ok(!e.zones.some(z=>z.kind==='poison'));}
for(let n=1;n<=4;n++){const e=setup();e.trial=newFloor(n);e.time=0;spawnTrial(e);assert.equal(e.enemies.length,10);for(const a of e.enemies){const base=a.kind==='brute'?190:a.kind==='runner'?50:80;assert.equal(a.maxHp,base*5**(n-1));}assert.equal(floorHealth(n),5**(n-1));assert.equal(e.trial.next,.65/2**(n-1));e.enemies=[];e.time=floorSpawnInterval(n)-.00001;spawnTrial(e);assert.equal(e.enemies.length,0);e.time=floorSpawnInterval(n);spawnTrial(e);assert.equal(e.enemies.length,10);}
assert.equal(newFloor(3).goal,5000);assert.equal(newFloor(4).goal,5500);console.log('Identical normal/heavy enemy kinds quintuple health every floor; spawn cadence doubles, floor three 5000 budget and 4x cadence.');
