import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {GROWTH_CARDS} from '../dist/growth.js';
import {updateGold} from '../dist/gold-combat.js';
import {heroGrowth,castGrowth} from '../dist/growth-combat.js';
import {withinGold} from '../dist/local-combat.js';
import {drawGold} from '../dist/gold-render.js';
import {TREES,blocked,move,activateMap,BUILDINGS} from '../dist/world.js';
const scene=id=>{const e=new Engine(()=>.99);e.quest=3;e.travel('starfield');e.team=id?[id]:[];Object.assign(e.hero,{x:2350,y:1700,inv:999});for(const m of Object.values(e.members))Object.assign(m,{x:2350,y:1700,cd:999});e.enemies=[];e.updateSpawns=()=>{};e.giveXP=()=>{};e.combat=true;return e;};
const foe=(e,x)=>{const a={id:'target',x,y:1700,hp:1e6,maxHp:1e6,r:17,frozen:999,dot:0,slow:0,cd:999,kind:'melee'};e.enemies.push(a);return a;};
for(const id of [4,11]){const e=scene(id),m=e.members[id],a=foe(e,4200);m.growth={combo:1,quantum:id===11?1:0};m.targetEnemy=a;m.cd=0;assert.ok(withinGold(e,id,a));if(id===4)castGrowth(e,m,a);for(let i=0;i<400;i++)e.update(.02);assert.ok(m.x>3500,'pursuit leaves hero behind '+id);assert.ok(a.hp<1e6,'reaches and hurts distant target '+id);}
console.log('Herta and Seele pursue and hit distant enemies without a hero-distance damage leash.');
for(const [id,key]of [[0,'absoluteZero'],[0,'gravity'],[4,'frostWake']]){const e=scene(id),m=id?e.members[id]:e.hero;m.growth={[key]:3};const a=foe(e,2400);updateGold(e,.02);assert.ok(e.goldEffects[0].invisible);assert.ok(a.hp<1e6);if(key!=='gravity')assert.ok(a.frozen>0);e.fx=[];let drawn=0;const ctx={};const at=()=>drawn++;drawGold(e,ctx,at);assert.equal(drawn,0);if(!id){heroGrowth(e,.02);assert.ok(!e.fx.some(f=>f.kind==='burst'&&f.r>50));}else{castGrowth(e,m,a);assert.equal(e.zones.length,0);}}
console.log('Hero domains and Herta freeze retain their effects without drawing large fields.');
activateMap('meadow');let crossed=0;for(const t of TREES){if(blocked(t.x-40,t.y)||blocked(t.x+40,t.y))continue;for(const id of [undefined,4,11]){const a={x:t.x-40,y:t.y,id};for(let i=0;i<40;i++)move(a,t.x+40,t.y,.02,180);assert.ok(a.x>t.x+35,'cross tree');}crossed++;}assert.ok(crossed>20);assert.ok(blocked(BUILDINGS[0].x,BUILDINGS[0].y));assert.ok(blocked(0,0));console.log('Player and companions cross tree trunks; buildings and map boundaries stay solid.');
for(const c of GROWTH_CARDS)for(const r of [1,2,3]){const s=c.describe(r);assert.ok(s.length>7&&s.length<85,c.id);assert.ok(!/范围|半径|距离|持续时间|\d+(\.\d+)?\s*秒|限制|不再|旧版|改为/.test(s),c.id+':'+s);}
console.log('All 186 cards use concise player-facing descriptions without distance, timer or revision commentary.');
