import {renderGrowthTags} from './growth-tags.js';
import {soulMove,soulAttack} from './gold-combat.js';
import {COMBO_GUIDE} from './combo-cards.js';
import {isRanged,attackRange} from './combat-rules.js';
import {byId} from './data.js';
import {xpForLevel,companionXP} from './balance.js';
import {cardsFor,rank} from './growth.js';
const art=import.meta.glob('./assets/portraits/*.{png,webp}',{eager:true,query:'?url',import:'default'});
const BIOS={
1:'被从漂流的恒冰中唤醒的少女，随星穹列车旅行。她用相机记录旅途，也期待找回自己的过去。',
2:'星穹列车的护卫，沉静寡言的长枪使用者，负责整理列车见闻。',
3:'星穹列车的领航员。修复列车后，她邀请伙伴共同踏上开拓的旅途。',
4:'空间站「黑塔」的主人、天才俱乐部成员。眼前这具人偶是她远程行动的载体。',
5:'贝洛伯格银鬃铁卫的戍卫官，朗道家的长子，以坚定的意志守护城市与同伴。',
6:'贝洛伯格下层区的医生，也是「地火」的领袖。她始终照顾需要帮助的人。',
7:'神秘的星核猎手，善用言灵、丝线与雷电。她按照艾利欧的剧本行动。',
8:'仙舟「罗浮」的神策将军。看似闲适，实则深谋远虑，能驱使神君破阵。',
9:'与机器人史瓦罗相依为命的少女。她相信人与机械可以彼此理解。',
10:'空间站「黑塔」的站长，热爱天文观测，负责协调研究与空间站的日常事务。',
11:'贝洛伯格下层区的「地火」成员。她挥动镰刀，以迅捷的身影保护身边的人。'};
export class CharacterDetails{
 constructor(ui){this.ui=ui;this.id=null;this.layer=document.createElement('div');this.layer.className='detail-layer';this.layer.hidden=true;document.body.append(this.layer);this.layer.addEventListener('pointerdown',ev=>{if(ev.target===this.layer){ev.preventDefault();ev.stopPropagation();this.close();}});document.addEventListener('keydown',ev=>{if(this.id!==null&&ev.key==='Escape'){ev.preventDefault();ev.stopImmediatePropagation();this.close();}},true);}
 open(id){const ui=this.ui,e=ui.e,c=id?byId(id):{name:"穹",element:"物理",role:"开拓者",star:5,skill:"星核共鸣",desc:"自动光锥能力在移动中持续生效；球棒与闪避仍可主动使用。"};if(!c||['upgrade','reveal'].includes(e.modal))return;this.previous=e.modal;this.id=id;if(!this.previous)e.setModal('detail');const m=id?e.members[id]:e.hero,s=id?e.skillData(id):{cd:2.4,damage:20},owned=!id||e.owned.includes(id),need=id?companionXP:xpForLevel,capped=id&&m.level>=8,acquired=cardsFor(id).filter(c=>rank(m,c.key)),src=art[`./assets/portraits/${id}.png`]||art[`./assets/portraits/${id}.webp`];
 this.layer.hidden=false;this.layer.innerHTML=`<aside class="character-detail" role="dialog" aria-modal="true" aria-label="${c.name}角色详情"><button class="detail-close" aria-label="关闭角色详情">×</button><div class="detail-art">${src?`<img src="${src}" alt="${c.name}原版立绘">`:ui.sprite(id,'avatar hero-detail-avatar')}</div><div class="detail-copy"><div class="eyebrow">${c.element} · ${c.role} · ${c.star}★</div><h2>${c.name} <span class="detail-level">Lv.${m.level}</span></h2><p>${c.bio||BIOS[id]||"携带星核的无名客，在一次次选择中塑造属于自己的开拓之路。"}</p><div class="detail-xp"><span style="width:${capped?100:m.xp/need(m.level)*100}%"></span></div><small>${owned?`${capped?"已达到伙伴等级上限 · Lv.8":`经验 ${m.xp} / ${need(m.level)}`}`:'尚未重逢'}</small><h3>${c.skill}</h3><p>${c.desc}</p><div class="skill-metrics"><span>冷却 ${s.cd.toFixed(1)} 秒</span>${id&&isRanged(c)&&c.kind!=='heal'?`<span>射程 ${attackRange(s)}</span>`:''}${s.damage?`<span>伤害 ${Math.round(s.damage)}</span>`:''}</div>${(c.guide||COMBO_GUIDE[id])?`<h3>连携搭配</h3><p>${c.guide||COMBO_GUIDE[id]}</p>`:''}${id===11&&m.growth?.combo?`<p>死蝶收割：已吸收 ${m.souls||0} 魂 · 移速 +${Math.round((soulMove(m)-1)*100)}% · 攻速 +${Math.round((soulAttack(m)-1)*100)}%。换地图或进入下一层重置亡魂加速，光锥保留。</p>`:''}<h3>已获得光锥 <small>${acquired.length} / ${cardsFor(id).length}</small></h3><p class="growth-detail-note">${id?'角色最高 8 级，升级不抽卡；通过拾票赠礼、穹升级和首领战利品获得光锥。':'等级无上限；10 级起每级 500 经验，15 级起 900，25→26 级需要 3000 经验，此后逐级翻倍。'}每张最多 III 级。换人、换地图保留。</p>${acquired.length?acquired.map(card=>`<article class="owned-cone ${card.gold?'legendary':'ordinary'}"><small>${card.gold?'✦ 黄金成长':'✧ 普通成长'} · ${c.name}</small><h4>${card.name}<span>${['','I','II','III'][rank(m,card.key)]} / III</span></h4>${renderGrowthTags(card)}<p>${card.describe(rank(m,card.key))}</p>${rank(m,card.key)===3?'<small>已满级 · 不再进入抽取池</small>':''}</article>`).join(''):'<p>尚未获得成长光锥。拾取车票、穹升级或击败层级首领时可选择。</p>'}${owned&&id?`<button class="action detail-equip">${e.team.includes(id)?'移出队伍':'加入队伍'}</button>`:''}<p class="art-credit">原版立绘：HoYoverse · HSR Wiki / StarRailRes<br>本作技能为即时战斗改编。</p></div></aside>`;
 this.layer.querySelector('.detail-close').onclick=()=>this.close();this.layer.querySelector('.detail-equip')?.addEventListener('click',()=>{const wasParty=this.previous==='party';e.equip(id);this.close();if(wasParty)ui.openParty();else ui.refresh();});ui.paintSprites();this.layer.querySelector('.detail-close').focus();
 }
 close(){if(this.id===null)return;this.id=null;this.layer.hidden=true;if(!this.previous&&this.ui.e.modal==='detail')this.ui.e.close();this.previous=null;}
}
