// Local preview controls only; Vite removes this import from production builds.
import {CHARS} from './data.js';
import {cardsFor,grantGrowth} from './growth.js';
import {heroGrowth} from './growth-combat.js';
import {newFloor,bossAI} from './trial.js';
export function attachChecks(e,ui){const box=document.createElement('div');box.dataset.devChecks='true';box.style.cssText='position:fixed;z-index:200;right:12px;top:85px;display:flex;gap:6px;background:#152434;padding:8px;border:1px solid #9bacc1;max-width:700px';box.innerHTML='<button>验证：地面特效</button><button>验证：车票</button><button>验证：全收藏拾票</button><button>验证：三层首领</button><button>验证：主线通关</button>';document.body.append(box);
 const ticketCheck=document.createElement('button');ticketCheck.textContent='验证：立体车票';box.append(ticketCheck);ticketCheck.onclick=()=>{clear();e.travel('meadow');e.drops=[{x:800,y:700,id:'qa-ticket',type:'ticket',createdAt:e.time}];ui.refresh();};
 const manual=document.createElement('button');manual.textContent='验证：手动召唤';box.append(manual);manual.onclick=()=>{clear();e.owned=[1,2,6];e.team=[1,2,6];e.tickets=1;ui.openWarp();};
 const lord=document.createElement('button');lord.textContent='验证：神君范围';box.append(lord);lord.onclick=()=>{clear();e.fx=[{kind:'lord',x:2350,y:1700,r:150,color:'#f0ce70',life:.7,max:.75,p:[],hit:false}];e.setModal('qa');ui.r.camera={x:2350,y:1700};ui.r.draw(.1);};
 const clear=()=>{ui.close();e.upgrades=[];e.events=[];e.modal=null;e.pendingWarp=false;e.pendingChapter=false;e.owned=CHARS.map(c=>c.id);e.team=[2,4,5,8,11,1];e.quest=3;e.travel('starfield');e.hero.x=2350;e.hero.y=1700;e.hero.inv=999;e.trial=newFloor();for(const [i,id] of e.team.entries())Object.assign(e.members[id],{x:2200+i*60,y:1730,cast:0});e.enemies=[];e.zones=[];e.fx=[];ui.refresh();};
 box.children[0].onclick=()=>{clear();for(const key of ['sword','bladeLength','poison'])grantGrowth(e,cardsFor(0).find(c=>c.key===key));e.hero.moving=true;heroGrowth(e,1);e.zones[0].r=240;e.members[5].domain=4;e.members[5].domainRadius=120;e.setModal('qa');ui.r.camera={x:e.hero.x,y:e.hero.y};ui.r.draw(.1);};
 box.children[1].onclick=()=>{clear();e.owned=[1,2,6];e.team=[1,2,6];e.pickupTicket();ui.update();};
 box.children[2].onclick=()=>{clear();e.pickupTicket();ui.update();};
 box.children[3].onclick=()=>{clear();e.trial=newFloor(3);e.trial.started=true;e.trial.spawned=e.trial.goal;e.trial.killed=e.trial.goal;e.updateSpawns();const b=e.enemies.find(a=>a.boss);b.cd=0;b.pattern=4;bossAI(e,b,.01);e.hero.inv=999;e.setModal('qa');ui.r.camera={x:e.hero.x,y:e.hero.y};ui.r.draw(.1);ui.update();};
 box.children[4].onclick=()=>{clear();e.travel('meadow');e.bossAwake=true;e.damage(e.enemies.find(a=>a.boss),1e9);while(e.upgrades.length)e.chooseUpgrade(0);ui.update();};
}
