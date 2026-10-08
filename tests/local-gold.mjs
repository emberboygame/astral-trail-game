import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {updateGold,retireSummon} from '../dist/gold-combat.js';
import {heroGrowth} from '../dist/growth-combat.js';
import {GOLD_EVOLUTIONS} from '../dist/gold-evolutions.js';
const setup=id=>{const e=new Engine(()=>.99);e.quest=3;e.travel('starfield');e.team=id?[id]:[];Object.assign(e.hero,{x:2350,y:1700,inv:999});for(const m of Object.values(e.members))Object.assign(m,{x:2350,y:1700,cd:999,direction:2});e.enemies=[];e.updateSpawns=()=>{};e.giveXP=()=>{};e.combat=true;return e;};
const foe=(e,dx,dy=0)=>{const a={id:String(e.enemies.length),x:2350+dx,y:1700+dy,hp:1e6,maxHp:1e6,r:17,cd:999,kind:'melee',frozen:999,slow:0,dot:0};e.enemies.push(a);return a;};
for(const spec of GOLD_EVOLUTIONS.filter(s=>!['retire','souls','windBlades'].includes(s.kind))){const e=setup(spec.owner);(spec.owner?e.members[spec.owner]:e.hero).growth={[spec.key]:3};foe(e,800);updateGold(e,.02);assert.equal(e.goldEffects.length,[3,4,8,11].includes(spec.owner)?1:0,`${spec.owner}:${spec.key} distant activation`);}
console.log('All automatic golds require local targets, except Himeko, Herta, Jing Yuan and Seele.');
for(const key of ['volley','iceBurst']){const e=setup(1),m=e.members[1];m.growth={[key]:1};const front=foe(e,200),back=foe(e,-200),side=foe(e,0,200),far=foe(e,550);updateGold(e,.02);assert.equal(e.projectiles.length,9);e.goldEffects=[];e.team=[];for(let i=0;i<48;i++)e.update(.02);assert.ok(front.hp<1e6,key+' hits front');for(const a of [back,side,far])assert.equal(a.hp,1e6,key+' leaves rear, side and distant targets unharmed');assert.equal(e.projectiles.length,0);}
console.log('Both March cones hit forward targets, miss rear/side/distant targets and expire.');
for(const spec of GOLD_EVOLUTIONS.filter(s=>s.owner===0)){const e=setup(0);e.hero.growth={[spec.key]:3};const near=foe(e,180),far=foe(e,340);heroGrowth(e,.02);updateGold(e,.02);for(let i=0;i<150;i++)e.update(.02);assert.equal(far.hp,1e6,spec.key+' spill damage');assert.ok(near.hp<1e6,spec.key+' damages nearby target');assert.ok(!e.goldEffects.some(f=>f.kind==='beams'));}
console.log('Every hero gold damages nearby enemies without spill damage beyond 300.');
{const e=setup(1);e.members[1].growth={iceShield:3};foe(e,50);updateGold(e,.02);assert.equal(e.goldEffects[0].r,195);}
{const e=setup(9);e.members[9].growth={explosive:3};const near=foe(e,200),far=foe(e,600);e.projectiles=[{enemy:true,x:2550,y:1700},{enemy:true,x:3000,y:1700}];retireSummon(e,{owner:9,x:2350,y:1700,c:e.skillData(9)});assert.ok(near.hp<=0);assert.equal(far.hp,1e6);assert.equal(e.projectiles.length,1);}
console.log('March ice ring stays small; Svarog retirement clears only nearby enemies and bullets.');
