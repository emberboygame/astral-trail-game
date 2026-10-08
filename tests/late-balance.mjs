import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {xpForLevel,trialBossHP} from '../dist/balance.js';
import {floorHealth} from '../dist/trial.js';
import {updateGold} from '../dist/gold-combat.js';
for(let n=25;n<45;n++)assert.equal(xpForLevel(n+1),xpForLevel(n)*2);
for(let n=1;n<8;n++){assert.equal(floorHealth(n+1),floorHealth(n)*5);assert.equal(trialBossHP(n+1),trialBossHP(n)*5);}
const e=new Engine(()=>.99);e.team=[3];e.hero.x=1300;e.hero.y=650;const m=e.members[3];Object.assign(m,{x:1300,y:650,growth:{haste:3,barrage:3,solar:3,aftershock:3}});const a={x:1350,y:650,hp:1e9,maxHp:1e9,r:17,frozen:999,slow:0,dot:0};e.enemies=[a];e.combat=true;
for(let i=0;i<120;i++){e.time=i*.1;m.cd=0;e.cast(m,a);}assert.equal(e.stats.skills[3],7,'cooldown resets cannot create infinite cannon fire');
e.time=0;e.goldReady={};e.fx=[];e.goldEffects=[];updateGold(e,.02);assert.equal(e.goldEffects.length,3);assert.ok(Object.values(e.goldReady).every(t=>t===12));const fields=[...e.goldEffects];for(let i=0;i<110;i++){e.time+=.1;updateGold(e,.1);}assert.equal(e.goldEffects.length,0);assert.ok(fields.every(f=>f.phase<=6),'limited ticks per volley');e.time=12.1;updateGold(e,.02);assert.equal(e.goldEffects.length,3);
console.log('Post-25 XP doubles, all floor HP scales x5, Himeko withstands cooldown resets and gold barrages have recovery gaps.');
{const k=new Engine(()=>.99);k.quest=3;k.travel('starfield');k.team=[7];Object.assign(k.hero,{x:2350,y:1700,inv:999});const m=k.members[7];Object.assign(m,{x:2350,y:1700,cd:0});const foe=x=>({x,y:1700,hp:1e6,maxHp:1e6,r:17,frozen:999,slow:0,dot:0,cd:999,kind:'melee'});const near=foe(3250),far=foe(3400);k.enemies=[near,far];k.combat=true;m.targetEnemy=near;k.updateSpawns=()=>{};k.update(.02);assert.equal(k.stats.skills[7]||0,0);assert.ok(m.moving);for(let i=0;i<160&&!(k.stats.skills[7]>0);i++)k.update(.02);assert.ok(k.stats.skills[7]>0);assert.ok(near.hp<1e6);assert.equal(far.hp,1e6);assert.equal(far.dot,0);console.log('Kafka approaches distant enemies before casting, and chain hits cannot reach beyond 420.');}
