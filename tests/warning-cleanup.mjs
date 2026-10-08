import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {warn,updateHazard} from '../dist/trial.js';
import {GroundEffects} from '../dist/ground-effects.js';
import * as T from '../dist/vendor/three.module.js';
const setup=()=>{const e=new Engine(()=>.99);e.team=[];e.updateSpawns=()=>{};e.giveXP=()=>{};e.hero.x=2350;e.hero.y=1700;e.hero.inv=99;e.enemies=[];return e;};
const enemy=(e,extra={})=>{const a={id:'test',x:2450,y:1700,hp:10,maxHp:10,r:17,cd:0,frozen:5,slow:0,dot:0,kind:'bomber',...extra};e.enemies.push(a);return a;};
for(const shape of ['circle','line','blink']){const e=setup(),a=enemy(e),other=enemy(e,{id:'other'});warn(e,a,shape,{x:2450,y:1700,r:90,angle:0,length:700,width:50});warn(e,other,'circle',{x:2500,y:1700,r:90});const g=new GroundEffects(new T.Scene());g.update(e);assert.equal(g.items.size,2);const z=e.zones[0];e.damage(a,99);assert.equal(z.resolved,true);assert.equal(z.life,0);e.setModal('upgrade');g.update(e);assert.equal(g.items.size,1);assert.equal(e.zones[0].host,other);updateHazard(e,z);assert.ok(!e.fx.some(f=>f.kind==='hazardHit'));assert.equal(a.x,2450);}
console.log('Frozen deaths cancel circles, lines and blinks immediately, including paused rendering, without removing another enemy warning.');
{const e=setup(),a=enemy(e,{frozen:0,dot:1,dotDamage:1000});e.update(.02);assert.ok(a.hp<=0);assert.equal(e.zones.filter(z=>z.kind==='warning').length,0);warn(e,a,'circle',{x:0,y:0,r:10});assert.equal(e.zones.length,0);}
console.log('Damage-over-time death cannot cast a new warning.');
{const e=setup(),a=enemy(e);warn(e,a,'circle',{x:a.x,y:a.y,r:90});const z=e.zones[0];e.update(.02);assert.equal(z.life,z.max);a.hp=0;e.update(.02);assert.equal(e.zones.length,0);}
console.log('Living frozen warnings still pause; orphaned dead-host warnings are cleaned safely.');
