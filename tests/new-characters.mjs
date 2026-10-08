import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {CHARS} from '../dist/data.js';
import {NEW_CHARS,NEW_POOLS} from '../dist/expansion-data.js';
import {cardsFor,grantGrowth,rollGrowth,rollGold} from '../dist/growth.js';
import {ANIMATION_FRAMES} from '../dist/animation-frames.js';
import {drawExpansionStrike,drawExpansionBolt} from '../dist/expansion-render.js';
const scene=(ids)=>{const e=new Engine(()=>.99);e.quest=3;e.travel('starfield');e.team=ids;e.owned=CHARS.map(c=>c.id);Object.assign(e.hero,{x:2350,y:1700,hp:40,inv:999});for(const m of Object.values(e.members))Object.assign(m,{x:2350,y:1700,cd:0});e.enemies=[];e.updateSpawns=()=>{};e.giveXP=()=>{};return e;};
const foe=(e,dx=70,hp=1e7)=>{const a={id:String(e.enemies.length),x:2350+dx,y:1700,homeX:2350+dx,homeY:1700,hp,maxHp:hp,r:17,cd:999,kind:'melee',frozen:100,slow:100,dot:0,marked:100};e.enemies.push(a);return a;};
const run=(e,seconds)=>{for(let i=0;i<seconds*50;i++){e.update(.02);assert.ok(Number.isFinite(e.hero.hp));for(const a of e.enemies)assert.ok(Number.isFinite(a.hp)&&Number.isFinite(a.x));}};
assert.equal(NEW_CHARS.length,10);assert.equal(CHARS.length,21);
for(const c of NEW_CHARS){assert.equal(c.star,5);assert.ok(!['同谐','丰饶','存护'].includes(c.path));const cards=cardsFor(c.id);assert.equal(cards.length,8);assert.equal(cards.filter(c=>c.gold).length,3);assert.equal(cards.filter(c=>!c.gold).length,5);assert.equal(ANIMATION_FRAMES[c.id].length,24);
 for(const growth of [{},Object.fromEntries(cards.map(c=>[c.key,3]))]){const e=scene([c.id]),a=foe(e);foe(e,120);e.members[c.id].growth=growth;run(e,12);assert.ok(e.stats.skills[c.id]>0,c.name+' casts');assert.ok(a.hp<1e7,c.name+' damage');if(c.id===24)assert.ok(e.hero.hp>40);assert.ok(e.projectiles.length<180);assert.ok((e.newFollowups||[]).length<=96);}
 const e=scene([c.id]);for(const card of cards){for(let n=0;n<3;n++)assert.ok(grantGrowth(e,card));assert.equal(grantGrowth(e,card),false);}assert.ok(rollGrowth(e,c.id).every(c=>c.supply));
}
console.log('All ten five-stars cast, damage, animate, and retain 5 normal/3 gold cards with tier III exclusion.');
for(const [owner,cards]of Object.entries(NEW_POOLS))for(const card of cards){const e=scene([+owner]),a=foe(e,60,900);foe(e,90,10000);foe(e,130,10000);e.members[owner].growth={[card.key]:3};run(e,14);assert.ok((e.stats.skills[owner]||0)>0,owner+':'+card.key);assert.ok(a.hp<900||e.kills>0);assert.ok(e.newFollowups.length<96);}
console.log('Every new card runs independently through casting, hits and deaths without stalled combat or unbounded queues.');
{const e=scene([18,19,22,23]);for(const id of e.team)e.members[id].growth=Object.fromEntries(cardsFor(id).map(c=>[c.key,2]));foe(e,90);run(e,5);assert.ok(e.members[18].petCharge>=0);assert.ok(e.newPets.some(p=>p.id===25));assert.ok(e.enemies[0].interpretation>=0);assert.ok(e.stats.skills[19]>0);e.setModal('pause');const time=e.time,p=e.newPets[0].x;e.update(1);assert.equal(e.time,time);assert.equal(e.newPets[0].x,p);e.modal=null;e.team=[23];run(e,.1);assert.equal(e.newPets.length,0);assert.ok(e.newFollowups.every(q=>q.owner===23));e.travel('meadow');assert.equal(e.newFollowups.length,0);assert.equal(e.members[23].growth.key,2);}
{const e=scene([24]);e.hero.hp=10;e.members[24].growth={promise:3,flight:2,rainbow:2};foe(e);run(e,3);assert.ok(e.hero.hp>10);assert.ok(e.newPets.some(p=>p.id===26));}
{const e=scene([15,20,24]);for(let i=0;i<60;i++){const offer=rollGrowth(e,0);assert.equal(offer[0].owner,0);assert.ok(offer.slice(1).every(c=>e.team.includes(c.owner)));assert.ok(rollGold(e).every(c=>c.gold&&e.team.includes(c.owner)));}e.pickupTicket();assert.equal(e.modal,'upgrade');assert.ok(e.team.includes(e.upgrades[0].id));}
console.log('New team synergies, memosprites, emergency care, pause, swaps, travel and full-collection ticket growth passed.');
{let calls=0;const ctx=new Proxy({},{get:(o,k)=>o[k]||((...args)=>{calls++;for(const v of args)if(typeof v==='number')assert.ok(Number.isFinite(v));}),set:(o,k,v)=>(o[k]=v,true)});for(const style of ['cut','ice','fire','heal','dragon','key','pillar','pet'])drawExpansionStrike(ctx,{style,color:'#fff',r:65,angle:.2},.4);for(const newStyle of ['chalk','feather','ice','fire'])drawExpansionBolt(ctx,{newStyle});assert.ok(calls>70);}
