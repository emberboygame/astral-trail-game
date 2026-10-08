import {castAscension,hitAscension,observeAscension,deathAscension,updateAscension,clearAscension,moveAscension,moveIca,REWORKED} from './ascension-combat.js';
import {freeze,statusCount} from './combo.js';
import {move,faceToward} from './world.js';
const rank=(m,k)=>m?.growth?.[k]||0;
const live=(e,a)=>a?.hp>0&&(!a.boss||e.bossAwake);
const nearby=(e,m,r=470)=>e.enemies.filter(a=>live(e,a)&&Math.hypot(a.x-m.x,a.y-m.y)<r).sort((a,b)=>Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y));
function flash(e,m,a,c,style='cut',size=65){e.fx.push({kind:'newStrike',style,owner:m.id,x:a.x,y:a.y,angle:Math.atan2(a.y-m.y,a.x-m.x),r:size,color:c.color,life:.38,max:.38});}
function hit(e,m,a,scale=1,style='cut',extra=false){if(!live(e,a))return;const c=e.skillData(m.id);flash(e,m,a,c,style);e.companionHit(a,c.damage*scale,{...c,extra}, {secondary:extra});}
function shot(e,m,a,scale=1,style='bolt',extra=false,delay=0){if(!live(e,a))return;const c=e.skillData(m.id);e.fire(m,a,{...c,kind:'newBolt',damage:c.damage*scale,extra,shotStyle:style},delay);const p=e.projectiles.at(-1);p.newStyle=style;p.life=Math.min(p.life,2.2);}
function blade(e,m,a,scale=1,count=1,style='blade',spread=.22){const c=e.skillData(m.id),angle=Math.atan2(a.y-m.y,a.x-m.x);for(let i=0;i<count;i++){const t=angle+(i-(count-1)/2)*spread;e.projectiles.push({kind:'bladeWave',newStyle:style,x:m.x,y:m.y-15,tx:m.x+Math.cos(t)*440,ty:m.y-15+Math.sin(t)*440,speed:560,life:.8,damage:c.damage*scale,skill:{...c,extra:true},color:c.color,p:[],trail:[],hits:new Set(),pierces:99,r:style==='dragon'?30:18,spin:false});}}
function cleave(e,m,a,scale=1,r=125){const angle=Math.atan2(a.y-m.y,a.x-m.x);for(const t of nearby(e,m,r)){const d=Math.atan2(t.y-m.y,t.x-m.x)-angle;if(Math.cos(d)>.05)hit(e,m,t,scale);} }
function queue(e,m,a,scale,style,delay=.18){e.newFollowups??=[];if(e.newFollowups.length<96)e.newFollowups.push({owner:m.id,target:a,scale,style,delay});}
function dash(e,m,a,scale=1,speed=740){if(!live(e,a))return;m.surge={target:a,life:.8,speed,scale,hits:new Set()};}
export function moveExpansion(e,m,dt){if(moveAscension(e,m,dt))return true;const q=m.surge;if(!q)return false;if(!live(e,q.target)||q.life<=0){m.surge=null;return false;}q.life-=dt;const old={x:m.x,y:m.y};move(m,q.target.x,q.target.y,dt,q.speed);m.cast=.32;m.attackDir=m.direction;const dx=m.x-old.x,dy=m.y-old.y;
 for(const a of nearby(e,m,115)){const t=Math.max(0,Math.min(1,((a.x-old.x)*dx+(a.y-old.y)*dy)/(dx*dx+dy*dy||1)));if(!q.hits.has(a)&&Math.hypot(a.x-old.x-t*dx,a.y-old.y-t*dy)<48){q.hits.add(a);hit(e,m,a,q.scale,m.id===21?'fire':'cut',true);if(m.id===21){a.burning=3;a.burnDamage=12+6*rank(m,'scorch');a.burnOwner=m.id;if(rank(m,'break'))a.marked=3;if(rank(m,'superbreak')&&statusCount(a)>0)hit(e,m,a,1+rank(m,'superbreak'),'fire',true);}}}
 if(Math.hypot(m.x-q.target.x,m.y-q.target.y)<25||q.life<=0){if(m.id===21){if(rank(m,'ember'))blade(e,m,q.target,.45*rank(m,'ember'),1,'fire');if(rank(m,'firefall'))for(const a of nearby(e,m,180).slice(0,2+rank(m,'firefall')))queue(e,m,a,1.2,'fire',.2);}m.surge=null;}return true;
}
function ensurePet(e,m){e.newPets??=[];let p=e.newPets.find(p=>p.owner===m.id);if(!p){p={owner:m.id,id:m.id===18?25:26,x:m.x+35,y:m.y+30,cd:0,cast:0,direction:0};e.newPets.push(p);}return p;}
export function castExpansion(e,m,a){if(castAscension(e,m,a))return true;if(m.id<15)return false;const c=e.skillData(m.id),r=k=>rank(m,k);m.cast=.42;m.cd=c.cd;if(a)faceToward(m,a.x,a.y);m.attackDir=m.direction;e.stats.skills[m.id]=(e.stats.skills[m.id]||0)+1;e.event('sound',{kind:c.kind});
 if(m.id===24){const before=e.hero.hp,heal=18+8*r('care');e.hero.hp=Math.min(e.hero.maxHp,before+heal);const gained=e.hero.hp-before,overflow=heal-gained;m.sunshine=Math.min(120,(m.sunshine||0)+gained+overflow*r('reserve')*.5);flash(e,m,e.hero,c,'heal',20);ensurePet(e,m);if(a)shot(e,m,a,.6,'feather');if(r('rainbow'))for(const t of nearby(e,m,430).slice(0,2+r('rainbow')))shot(e,m,t,.8,'feather',true);return true;}
 if(!a)return true;
 if(m.id===15){m.moon=(m.moon||0)+1;cleave(e,m,a,1+r('finish')*.1);if(r('frost'))freeze(e,a,.4+.3*r('frost'));if(a.frozen>0&&r('shard'))for(const t of nearby(e,a,160).filter(t=>t!==a).slice(0,r('shard')))shot(e,m,t,.5,'ice',true);
 if(m.moon>=Math.max(2,4-r('moon'))){m.moon=0;blade(e,m,a,1.5+.3*r('moon'),r('eclipse')?3:1,'ice',.3);if(r('execution')&&a.frozen>0){if(!a.boss&&a.hp<a.maxHp*(.18+.05*r('execution')))e.damage(a,a.hp,c.color,{owner:m.id});else hit(e,m,a,1+r('execution'),'ice',true);}}}
 if(m.id===16){m.fury=(m.fury||0)+1;cleave(e,m,a,1,120+20*r('edge'));if(r('pursuit')&&(a.marked>0||a.slow>0))blade(e,m,a,.4*r('pursuit'));if(m.fury>=Math.max(3,6-r('scar'))){m.fury=0;cleave(e,m,a,2,160);if(r('hellscape'))for(let i=0;i<r('hellscape');i++)queue(e,m,a,.85,'cut',.12*(i+1));if(r('sever'))blade(e,m,a,1,1+r('sever'),'blade',.28);}}
 if(m.id===17){m.dragon=(m.dragon||0)+1;if(r('tide'))for(const t of nearby(e,a,90+15*r('tide')))move(t,a.x,a.y,.12,90);hit(e,m,a,1+.15*(m.dragon-1),'dragon');if(r('scale'))a.marked=3;if(m.dragon>=Math.max(2,4-r('pearl'))){m.dragon=0;blade(e,m,a,1.5+.2*r('pearl')+.4*r('dragon'),r('dragon')?3:1,'dragon',.13);if(r('echo'))blade(e,m,a,.5,2,'dragon',.55);if(r('lotus'))for(let i=0;i<2+r('lotus');i++)shot(e,m,a,.55,'dragon',true,i*.12);if(r('twin'))blade(e,m,a,.7+.3*r('twin'),2,'dragon',.3);}}
 if(m.id===18){a.marked=3+r('debt');a.debtOwner=18;shot(e,m,a,1+.25*r('debt'),'fire');ensurePet(e,m);if(r('interest'))m.petCharge=(m.petCharge||0)+r('interest');}
 if(m.id===19){shot(e,m,a,1,'chalk');if(r('mark'))a.marked=3+r('mark');if(statusCount(a)>0)for(let i=0;i<1+r('chalk');i++)shot(e,m,a,.6+.12*r('proof')*statusCount(a),'chalk',true,.16*(i+1));if(r('ricochet'))for(const t of nearby(e,a,160).filter(t=>t!==a).slice(0,r('ricochet')))shot(e,m,t,.5,'chalk',true,.2);}
 if(m.id===20){hit(e,m,a,1);m.dream=(m.dream||0)+1+r('petal');if(r('curse')){a.dot=3;a.dotDamage=7+5*r('curse');a.dotOwner=20;}if(m.dream>=9){m.dream=0;const n=2+r('unsheathe');for(let i=0;i<n;i++)queue(e,m,a,1.2+.2*r('unsheathe'),'cut',i*.15);if(r('edge'))blade(e,m,a,.5,1+r('edge'));if(r('red'))hit(e,m,a,.6*r('red')*statusCount(a),'cut',true);if(r('echo'))queue(e,m,a,.8+.3*r('echo'),'cut',.75);}}
 if(m.id===21){hit(e,m,a,1,'fire');if(r('scorch')){a.burning=3;a.burnDamage=8+5*r('scorch');a.burnOwner=21;}m.fuel=(m.fuel||0)+1;if(m.fuel>=Math.max(1,3-r('jet'))||m.combustionUntil>e.time){m.fuel=0;dash(e,m,a,1.3,780+50*r('jet'));}if(m.combustionUntil>e.time)blade(e,m,a,.65,2,'fire',.3);}
 if(m.id===22){hit(e,m,a,1+(a.marked>0||a.slow>0?.25*r('hunt'):0));if(r('axe'))queue(e,m,a,.3*r('axe'),'cut');m.flying=(m.flying||0)+1+r('charge');if(m.flying>=7){m.flying=0;dash(e,m,a,1.5,850);for(let i=0;i<r('storm');i++)queue(e,m,a,.8,'cut',.15*(i+1));if(r('feather')||r('gunblade'))blade(e,m,a,.5+.2*r('feather'),1+r('gunblade'),'feather',.2);}}
 if(m.id===23){shot(e,m,a,1,'ice');if(r('ice'))freeze(e,a,.5+.25*r('ice'));a.interpretation=Math.min(12,(a.interpretation||0)+2+r('read'));if(r('split'))for(const t of nearby(e,a,180).filter(t=>t!==a).slice(0,r('split')))shot(e,m,t,.5,'ice',true);if(a.interpretation>=6){a.interpretation=0;hit(e,m,a,2+.8*r('key'),'key',true);if(r('shatter')&&a.frozen>0){if(!a.boss&&a.hp<a.maxHp*(.15+.05*r('shatter')))e.damage(a,a.hp,c.color,{owner:23});else hit(e,m,a,r('shatter'),'ice',true);}if(r('page'))blade(e,m,a,.6,1+r('page'),'ice',.25);}}
 return true;
}
export function expansionHit(e,a,amount,c,meta={}){const m=e.members[c.owner];if(!m||!live(e,a))return;if(hitAscension(e,m,a,amount,c,meta))return;const r=k=>rank(m,k);
 if(m.id===15&&r('finish')&&a.hp<a.maxHp*.5)amount*=1+.25*r('finish');
 if(m.id===19)amount*=1+.12*r('proof')*statusCount(a);
 if(m.id===24){if(r('breeze'))a.slow=1+r('breeze')*.3;if(r('feather'))e.hero.hp=Math.min(e.hero.maxHp,e.hero.hp+1+r('feather'));}
 e.damage(a,amount,c.color,{owner:m.id,generated:!!c.extra,...meta});
}
export function observeExpansion(e,a,amount,meta){observeAscension(e,a,amount,meta);if(meta.generated)return;for(const id of e.team){if(id<15||REWORKED.has(id))continue;const m=e.members[id];if(Math.hypot(m.x-a.x,m.y-a.y)>600)continue;
 if(id===18&&a.marked>0){m.petCharge=Math.min(20,(m.petCharge||0)+1);if(rank(m,'jackpot'))m.petCharge+=rank(m,'jackpot');}
 if(id===20&&statusCount(a)>0&&(m.dreamAt||0)<=e.time){m.dream=Math.min(12,(m.dream||0)+1);m.dreamAt=e.time+.18;}
 if(id===22&&meta.owner!==22)m.flying=Math.min(14,(m.flying||0)+1);
 if(id===23&&meta.owner!==23)a.interpretation=Math.min(12,(a.interpretation||0)+1);
 if(id===19&&rank(m,'counterproof')&&a.marked>0&&(m.proofAt||0)<=e.time&&meta.owner!==19){m.proofAt=e.time+1.3;queue(e,m,a,.65+.2*rank(m,'counterproof'),'chalk');}
 }}
export function deathExpansion(e,a,meta){deathAscension(e,a,meta);for(const id of e.team){const m=e.members[id],r=k=>rank(m,k);if(id<15||REWORKED.has(id)||Math.hypot(m.x-a.x,m.y-a.y)>650)continue;const next=nearby(e,a,240).find(t=>t!==a);
 if(id===15&&meta.owner===15&&r('finish'))m.moon=(m.moon||0)+1;
 if(id===16){m.fury=Math.min(8,(m.fury||0)+r('hunger'));if(r('lotus')&&next&&(m.lotusAt||0)<=e.time){m.lotusAt=e.time+.6;queue(e,m,next,.7+.3*r('lotus'),'cut');}}
 if(id===18&&a.debtOwner===18&&next){if(r('spread')){next.marked=3+r('spread');next.debtOwner=18;}if(r('liquidation')){queue(e,m,next,1+r('liquidation')*.3,'pet');m.petCharge=(m.petCharge||0)+3;}}
 if(id===20&&statusCount(a)>0)m.dream=Math.min(12,(m.dream||0)+r('scar'));
 if(id===22&&r('pursuit')&&next){m.flying=Math.min(14,(m.flying||0)+r('pursuit'));if((m.huntAt||0)<=e.time){m.huntAt=e.time+.8;dash(e,m,next,1+.2*r('pursuit'),850);}}
 if(id===23&&r('transfer')&&next)next.interpretation=Math.min(12,(next.interpretation||0)+(a.interpretation||0)+r('transfer'));
 }}
export function clearExpansion(e){clearAscension(e);e.newPets=[];e.newFollowups=[];for(const m of Object.values(e.members)){m.surge=null;m.moon=0;m.fury=0;m.dragon=0;m.dream=0;m.flying=0;m.sunshine=0;m.petCharge=0;m.fuel=0;m.newGoldAt=0;m.combustionUntil=0;m.rescueAt=0;m.auditUntil=0;m.flightUntil=0;m.dreamAt=0;m.proofAt=0;m.lotusAt=0;m.huntAt=0;}}
export function updateExpansion(e,dt){updateAscension(e,dt);e.newFollowups??=[];for(const q of e.newFollowups){q.delay-=dt;if(q.delay>0)continue;if(e.team.includes(q.owner)){const m=e.members[q.owner],a=live(e,q.target)&&Math.hypot(q.target.x-m.x,q.target.y-m.y)<650?q.target:nearby(e,m,500)[0];if(a){if(['chalk','feather','ice'].includes(q.style))shot(e,m,a,q.scale,q.style,true);else hit(e,m,a,q.scale,q.style,true);}}q.done=true;}e.newFollowups=e.newFollowups.filter(q=>!q.done&&e.team.includes(q.owner));
 for(const id of e.team){if(id<15)continue;const m=e.members[id],r=k=>rank(m,k),a=nearby(e,m,450)[0];if(!e.combat||!a)continue;
 if([18,24].includes(id))ensurePet(e,m);if(REWORKED.has(id)&&id!==24)continue;
 if(id===24&&r('promise')&&e.hero.hp<e.hero.maxHp*.35&&(m.rescueAt||0)<=e.time){e.hero.hp=Math.min(e.hero.maxHp,e.hero.hp+20+15*r('promise'));m.rescueAt=e.time+18;m.sunshine=(m.sunshine||0)+25;flash(e,m,e.hero,e.skillData(id),'heal',22);}
 if((m.newGoldAt||0)>e.time)continue;
 m.newGoldAt=e.time+11;
 if(id===15){if(r('mirror'))for(const t of nearby(e,m,400).slice(0,2+r('mirror')))queue(e,m,t,1+.25*r('mirror'),'ice',.2);if(r('eclipse'))blade(e,m,a,1+r('eclipse')*.4,3,'ice',.28);}
 if(id===16&&r('hellscape')){m.fury=8;cleave(e,m,a,1+r('hellscape'),180);}
 if(id===17&&r('dragon'))blade(e,m,a,2+r('dragon')*.5,3,'dragon',.15);
 if(id===18&&r('audit')){m.auditUntil=e.time+3+r('audit');m.petCharge=12;}
 if(id===19){if(r('axiom'))blade(e,m,a,1+r('axiom')*.4,2+r('axiom'),'chalk',.13);if(r('statue'))for(const t of nearby(e,m,400).slice(0,1+r('statue'))){hit(e,m,t,1.5+r('statue')*.3,'pillar',true);if(statusCount(t)>0)shot(e,m,t,.8,'chalk',true);}}
 if(id===20&&r('unsheathe'))m.dream=9;
 if(id===21&&r('combustion')){m.combustionUntil=e.time+3+r('combustion');dash(e,m,a,1+r('combustion')*.5,900);}
 if(id===22&&r('storm'))m.flying=7;
 if(id===23&&r('key')){a.interpretation=6;hit(e,m,a,1+r('key')*.4,'key',true);}
 if(id===24&&r('flight')){m.flightUntil=e.time+3+r('flight');m.sunshine=Math.min(120,(m.sunshine||0)+30);}
 }
 e.newPets=(e.newPets||[]).filter(p=>e.team.includes(p.owner));for(const p of e.newPets){const m=e.members[p.owner],r=k=>rank(m,k),c=e.skillData(m.id);p.cd-=dt;p.cast=Math.max(0,p.cast-dt);if(m.id===24&&moveIca(e,p,m,dt))continue;const choices=nearby(e,m,500),a=m.id===18?(choices.find(a=>a.debtOwner===18)||choices[0]):choices[0];if(!a||!e.combat){move(p,m.x+30,m.y+25,dt,260);continue;}move(p,a.x-22,a.y+12,dt,m.id===18?260+45*r('scent'):270);if(Math.hypot(p.x-a.x,p.y-a.y)<65&&p.cd<=0){p.cast=.42;faceToward(p,a.x,a.y);p.attackDir=p.direction;const charged=(m.petCharge||0)>=4;m.petCharge=charged?m.petCharge-4:m.petCharge;const scale=m.id===18?(charged?1.8:1):.7+Math.min(3,(m.sunshine||0)/30);hit(e,m,a,scale,'pet',true);if(m.id===24)m.sunshine=Math.max(0,(m.sunshine||0)-15);p.cd=m.id===18?(m.auditUntil>e.time?.45:charged?.65:Math.max(.7,1.5-.15*r('scent'))):(m.flightUntil>e.time?.5:1.4);}}
}
