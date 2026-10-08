import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {bossAI,warn} from '../dist/trial.js';
import {freeze} from '../dist/combo.js';
import {IceEffects} from '../dist/ice-effects.js';
import {castGrowth} from '../dist/growth-combat.js';
import {movingSkills} from '../dist/melee-motion.js';
import {updateGold} from '../dist/gold-combat.js';
import * as T from '../dist/vendor/three.module.js';
const setup=()=>{const e=new Engine(()=>.99);e.quest=3;e.travel('starfield');e.hero.x=2350;e.hero.y=1700;e.hero.inv=999;e.team=[];e.enemies=[];e.updateSpawns=()=>{};e.giveXP=()=>{};return e;};
const enemy=(e,x,hp=1e6,extra={})=>{const a={id:String(e.enemies.length),x,y:1700,hp,maxHp:hp,r:17,cd:1,kind:'melee',frozen:0,slow:0,dot:0,...extra};e.enemies.push(a);return a;};
{const e=setup(),b=enemy(e,2700,1e6,{boss:true,cast:.5});e.bossAwake=true;freeze(e,b,10);assert.equal(b.cast,.5);bossAI(e,b,.12);assert.ok(b.x<2700);assert.ok(Math.abs(b.cd-.9)<1e-9);const g=new IceEffects(new T.Scene());g.update(e);assert.equal(g.items.size,0);warn(e,b,'line',{x:2350,y:1700,length:600,width:30,angle:0});const z=e.zones[0],life=z.life;e.update(.1);assert.ok(z.life<life);b.cd=0;e.update(.02);assert.ok(b.pattern>0);console.log('Boss keeps movement, cast animation, attacks and warnings; frozen cooldown runs at 1/1.2 rate and no ice prison.');}
{const e=setup();e.team=[2];const m=e.members[2];m.x=2350;m.y=1700;m.growth={windBurst:1};const a=enemy(e,2450),b=enemy(e,2550);castGrowth(e,m,a);assert.equal(e.projectiles.filter(p=>p.windBlade).length,8);const initialX=b.x;e.combat=true;updateGold(e,.02);assert.equal(b.x,initialX);assert.ok(!e.goldEffects.some(f=>f.owner===2&&f.kind==='vortex'));m.charge={x:2500,y:1700,dir:2,damage:1,life:1,hits:new Set()};e.time=.31;movingSkills(e,m,.02);assert.equal(e.projectiles.filter(p=>p.windBlade).length,16);e.team=[];const hp=b.hp;for(let i=0;i<35;i++)e.update(.02);assert.ok(b.hp<hp);console.log('Attacks and moving charges emit eight-direction wind blades that deal damage without a tornado.');}
{const e=setup();e.team=[5];Object.assign(e.members[5],{x:2350,y:1700});e.members[5].growth={iceBurst:1};e.combat=true;const a=enemy(e,2390);updateGold(e,.02);const hp=a.hp;for(let i=0;i<50;i++){e.time+=.02;updateGold(e,.02);}assert.ok(a.hp<hp&&a.frozen>0);assert.equal(e.fx.filter(f=>['goldRain','goldPillar'].includes(f.kind)).length,0);console.log('Gepard keeps repeated freezing and damage without rain or pillar visual waves.');}
