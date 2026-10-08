import assert from 'node:assert/strict';
import {Engine} from '../dist/engine.js';
import {CHARS} from '../dist/data.js';
import {cardsFor} from '../dist/growth.js';
import {heroGrowth} from '../dist/growth-combat.js';
for(const id of CHARS.map(c=>c.id))for(const full of [false,true]){
 const e=new Engine(()=>.999);e.team=[id];if(full)e.owned=CHARS.map(c=>c.id);e.pickupTicket();if(!full)e.close();
 assert.equal(e.modal,'upgrade');const u=e.upgrades[0];assert.equal(u.source,'ticket');assert.equal(u.id,id);assert.ok(u.choices.some(c=>c.gold));assert.ok(u.choices.every(c=>c.owner===id));
 const card=u.choices.find(c=>c.gold);e.chooseUpgrade(u.choices.indexOf(card));assert.equal(e.members[id].growth[card.key],1);
 e.modal=null;e.upgrades=[];for(const c of cardsFor(id).filter(c=>c.gold))e.members[id].growth[c.key]=3;e.pickupTicket();if(!full)e.close();assert.ok(e.upgrades[0].choices.every(c=>!c.gold));
}
console.log('Ticket rewards can offer and grant gold for all 21 companions, including full collection; max-rank gold is excluded.');
const e=new Engine();e.team=[];e.hero.growth={gravity:1};heroGrowth(e,.02);const f=e.fx.find(f=>f.kind==='laser');assert.ok(f?.invisible);assert.ok(!e.fx.some(f=>f.kind==='ring'));const near={x:e.hero.x+90,y:e.hero.y,hp:1e6,maxHp:1e6,r:16,frozen:999,slow:0,dot:0,cd:999};e.enemies=[near];e.updateSpawns=()=>{};for(let i=0;i<60;i++)e.update(.02);assert.ok(near.hp<1e6);assert.equal(e.shake,0);console.log('Black hole keeps delayed damage without visible explosion or shake.');
