import {tagsFor} from './growth-tags.js';
import {NEW_POOLS} from './expansion-data.js';
import {installCardCopy} from './card-copy.js';
import {installGoldEvolutions} from './gold-evolutions.js';
import {installComboCards} from './combo-cards.js';
// Light Cones are fan-game builds, not the original game's equipment stats.
// Cards are immutable definitions; stacks belong to individual actors.
const ordinary=(key,name,describe)=>({key,name,describe,gold:false});
const golden=(key,name,describe)=>({key,name,describe,gold:true});
const common=(names)=>[
 ordinary('power',names[0],r=>`专属技能伤害 +${r*25}%；治疗量与护盾量同样提升。`),
 ordinary('haste',names[1],r=>`专属技能冷却缩短 ${r*12}%。`),
 ordinary('range',names[2],r=>`技能攻击范围与范围效果半径 +${r*20}%。`)
];
const pools={
0:[ordinary('sword','星轨剑卫',r=>`${r} 把剑始终绕穹旋转，接触敌人每 0.5 秒造成 ${18+r*6} 点伤害。`),ordinary('bullet','开拓弹幕',r=>`持续向面朝方向发射 ${r} 发子弹，每发 ${14+r*4} 点伤害，每 0.65 秒一轮。`),ordinary('poison','虚数沼迹',r=>`移动路径每 0.7 秒留下半径 ${42+r*8} 的毒沼，持续 ${3+r} 秒；减速并每 0.4 秒造成 ${3+r*3} 点伤害。`),ordinary('health','不熄的星核',r=>`生命上限 +${r*30}，获得时恢复 30 点生命。`),ordinary('speed','无名客的步伐',r=>`移动速度 +${r*8}%，闪避冷却缩短 ${r*15}%。`),golden('swordStorm','万剑归轨',r=>`解锁剑卫，额外增加 ${r*2} 把旋转剑，剑伤害 +${r*50}%。可独立获得，无需前置牌。`),golden('bulletNova','星核齐射',r=>`解锁弹幕，额外向八方发射子弹；弹幕伤害 +${r*40}%，每发可额外穿透 ${r} 个敌人。`),golden('toxicBloom','终末花园',r=>`解锁毒沼，毒沼半径 +${r*25}%，伤害 +${r*70}%；战斗中每 2 秒在穹附近 3 名敌人脚下生成毒沼。`)],
1:[...common(['冰箭打磨','轻快快门','远景镜头']),ordinary('chill','恒冰余温',r=>`箭矢冻结目标 ${(.4*r).toFixed(1)} 秒。`),ordinary('pierce','穿云一瞬',r=>`箭矢命中后弹向附近额外 ${r} 名敌人。`),golden('volley','六相冰晶',r=>`每轮额外射出 ${r*2} 支独立索敌的冰箭。`),golden('iceBurst','定格世界',r=>`每支箭命中引发半径 ${65+r*15} 的冰爆，造成技能 ${r*45}% 伤害并冻结。`),golden('iceShield','镜头后的守护',r=>`每次射箭为穹补充 ${r*6} 点护盾，护盾上限 ${30+r*30}。`)],
2:[...common(['击云淬刃','疾风步','长风破阵']),ordinary('chill','风缚',r=>`长枪命中造成 ${r} 秒减速。`),ordinary('execute','洞天一线',r=>`对生命低于一半的敌人，长枪伤害额外 +${r*30}%。`),golden('combo','枪影三叠',r=>`每次刺击追加 ${r*2} 道枪影，总伤害额外 +${r*100}%。`),golden('windBurst','风起云涌',r=>`每次刺击引发半径 ${100+r*20} 的风爆，造成技能 ${r*70}% 伤害并推开敌人。`),golden('windWake','游龙留痕',r=>`刺击在目标处留下风场 ${2+r} 秒，每 0.4 秒造成技能 ${r*15}% 伤害并减速。`)],
3:[...common(['熔火校准','轨道快充','广域观测']),ordinary('burn','余烬航迹',r=>`轨道炮命中产生持续 ${2+r} 秒的火场，每 0.4 秒造成 ${r*5} 点伤害。`),ordinary('execute','破晓焦点',r=>`对生命低于一半的敌人，轨道炮伤害额外 +${r*30}%。`),golden('barrage','天火重奏',r=>`每次施放额外降下 ${r} 道独立轨道炮。`),golden('solar','日冕',r=>`轨道炮半径额外 +${r*35}%，伤害额外 +${r*60}%。`),golden('aftershock','余烬复燃',r=>`每一道轨道炮在 0.6 秒后追加一次 ${r*60}% 伤害的轰击。`)],
4:[...common(['人偶发条','转转加速','加长锤柄']),ordinary('chill','低温实验',r=>`锤击冻结周围敌人 ${(.4*r).toFixed(1)} 秒。`),ordinary('execute','收尾课题',r=>`对生命低于一半的敌人，锤击伤害额外 +${r*30}%。`),golden('combo','转个不停',r=>`每次旋转追加 ${r} 次完整锤击，伤害随次数叠加。`),golden('iceBurst','冰晶试验',r=>`锤击后额外冰爆，半径 ${110+r*20}，造成技能 ${r*75}% 伤害。`),golden('frostWake','人偶冰原',r=>`锤击留下持续 ${2+r} 秒的冰原，每 0.4 秒造成技能 ${r*20}% 伤害并减速。`)],
5:[...common(['坚城誓约','铁卫轮值','防线延展']),ordinary('chill','霜拳',r=>`近身拳击冻结敌人 ${(.4*r).toFixed(1)} 秒。`),ordinary('ward','壁垒加固',r=>`每次施放的护盾额外增加 ${r*15} 点。`),golden('fortress','永冬之垒',r=>`护盾量额外 +${r*80}%，同时冻结穹周围半径 150 内敌人。`),golden('iceBurst','雪崩反攻',r=>`每次施放以穹为中心造成冰爆，半径 ${130+r*25}，伤害为技能的 ${r*150}%。`),golden('rally','铁卫协同',r=>`每次施放使其他上场伙伴的剩余冷却减少 ${r*.7} 秒。`)],
6:[...common(['药剂配比','急救训练','救援半径']),ordinary('regen','后续护理',r=>`治疗区域持续 ${2+r*2} 秒，每 0.4 秒为穹恢复 ${r*2} 点生命。`),ordinary('ward','安心绷带',r=>`每次治疗同时提供 ${r*12} 点护盾。`),golden('overheal','满溢的关怀',r=>`治疗量额外 +${r*60}%，溢出治疗转为护盾，上限 ${r*50}。满血也会施放。`),golden('rally','战地处方',r=>`治疗时使其他上场伙伴的剩余冷却减少 ${r*.8} 秒。满血也会施放。`),golden('medicine','苦口良药',r=>`治疗同时向附近最多 ${2+r} 名敌人发射药弹，每发造成 ${r*35} 点伤害并留下毒沼。满血也会施放。`)],
7:[...common(['高压丝线','节拍提前','蛛网扩张']),ordinary('dot','触电余音',r=>`丝线施加的触电持续时间 +${r*2} 秒，每秒伤害额外 +${r*6}。`),ordinary('chill','言灵迟滞',r=>`丝线使敌人减速 ${r} 秒。`),golden('chain','蛛网交响',r=>`每次丝线额外连接 ${r*3} 个目标。`),golden('detonate','晚安与睡颜',r=>`丝线命中立即结算目标剩余触电伤害的 ${r*75}%，不消耗触电。`),golden('thunder','雷鸣谢幕',r=>`丝线末端引发半径 ${110+r*20} 的雷爆，造成技能 ${r*140}% 伤害。`)],
8:[...common(['神君威仪','兵贵神速','横扫阵前']),ordinary('chill','雷罚震慑',r=>`神君落雷冻结敌人 ${(.4*r).toFixed(1)} 秒。`),ordinary('execute','决胜一击',r=>`对生命低于一半的敌人，神君伤害额外 +${r*30}%。`),golden('barrage','十王司命',r=>`每次施放额外追加 ${r*2} 次神君落雷。`),golden('solar','神霄天威',r=>`落雷半径额外 +${r*35}%，伤害额外 +${r*60}%。`),golden('aftershock','雷声未歇',r=>`每次落雷在 0.6 秒后追加一次 ${r*60}% 伤害的落雷。`)],
9:[...common(['装甲校准','协议提速','雷达扩容']),ordinary('duration','续航模块',r=>`史瓦罗每次登场时间延长 ${r*2} 秒。`),ordinary('ward','护卫协议',r=>`召唤时为穹提供 ${r*15} 点护盾。`),golden('missiles','饱和火力',r=>`史瓦罗每轮额外发射 ${r*2} 枚导弹。`),golden('robots','机械家人',r=>`每次召唤额外出现 ${r} 台协同护卫机。`),golden('explosive','歼灭指令',r=>`所有导弹命中发生半径 ${65+r*15} 的爆炸，造成导弹 ${r*70}% 伤害。`)],
10:[...common(['星火聚焦','观测排程','星图扩展']),ordinary('burn','燃烧轨迹',r=>`火弹命中留下 ${2+r} 秒的火场，每 0.4 秒造成 ${r*5} 点伤害。`),ordinary('pierce','轨道折射',r=>`火弹命中后弹向额外 ${r} 名敌人。`),golden('volley','流星群',r=>`每次施放额外发射 ${r*3} 枚独立索敌火弹。`),golden('explosive','超新星',r=>`火弹命中引发半径 ${65+r*15} 的爆炸，造成火弹 ${r*70}% 伤害。`),golden('rally','星空祝福',r=>`每次施放使其他上场伙伴的剩余冷却减少 ${r*.5} 秒。`)],
11:[...common(['蝶刃淬锋','幻影步','蝶翼伸展']),ordinary('execute','斩断旧梦',r=>`对生命低于一半的敌人，镰斩伤害额外 +${r*30}%。`),ordinary('chill','量子束缚',r=>`镰斩使目标减速 ${r} 秒。`),golden('combo','蝴蝶风暴',r=>`每次镰斩追加 ${r*2} 道残影，总伤害额外 +${r*100}%。`),golden('reprise','再现',r=>`镰斩击杀后，将技能剩余冷却缩短 ${r*30}%。`),golden('quantum','乱蝶葬',r=>`镰斩引发半径 ${110+r*20} 的量子爆发，造成技能 ${r*100}% 伤害。`)]
};
// Additional Trailblazer builds; existing cards retain their stable keys.
pools[0].push(
 ordinary('bladeLength','延展剑锋',r=>`旋转剑长度额外 +${r*35}%，剑阵半径额外 +${r*18}；解锁一把旋转剑。`),
 ordinary('lightning','引雷星核',r=>`战斗中每 ${ (2.4-r*.3).toFixed(1)} 秒召来闪电，连接附近 ${2+r} 名敌人，每次造成 ${22+r*16} 点伤害。`),
 ordinary('meteor','陨星信标',r=>`每 3 秒在附近 ${r} 名敌人处召唤陨星，半径 ${75+r*15}，造成 ${40+r*25} 点伤害。`),
 ordinary('pulse','引力脉冲',r=>`每 2.5 秒释放半径 ${110+r*35} 的脉冲，造成 ${25+r*20} 点伤害并推开敌人。`),
 ordinary('frost','霜环共振',r=>`每 3 秒冻结周围 ${130+r*30} 范围的敌人 ${(.5+r*.3).toFixed(1)} 秒并造成 ${20+r*15} 点伤害。`),
 ordinary('leech','星核汲能',r=>`穹每参与累计击败 10 名敌人恢复 ${r*5} 点生命。`),
 golden('thunderKing','万雷归航',r=>`解锁引雷：闪电额外连锁 ${r*3} 名敌人，伤害 +${r*60}%，命中冻结 0.5 秒。`),
 golden('meteorRain','群星坠落',r=>`解锁陨星：每轮额外落下 ${r*2} 颗陨星，范围 +${r*20}%，伤害 +${r*50}%。`),
 golden('gravity','黑洞引擎',r=>`解锁脉冲：先将半径 ${220+r*40} 内敌人拉近，0.6 秒后爆发，伤害 +${r*100}%。`),
 golden('absoluteZero','绝对零度',r=>`解锁霜环：范围额外 +${r*30}%，冻结时长 +${r*.6} 秒，伤害 +${r*80}%。`)
);
const revise=(owner,key,name,describe)=>Object.assign(pools[owner].find(c=>c.key===key),{name,describe});
revise(0,'sword','星轨剑卫',r=>`${r} 把长剑环绕穹旋转，剑身起始为旧版 2 倍，随本牌每级再增长 20%；接触每 0.5 秒造成 ${18+r*6} 点伤害。`);
revise(2,'windWake','游龙破阵',r=>`每次出枪沿目标方向以高速直线冲锋 ${190+r*70} 距离，沿途造成技能 ${r*120}% 伤害，留下减速风场。`);
revise(2,'combo','枪影三叠',r=>`每次刺击追加 ${r*2} 道枪影，总伤害额外 +${r*150}%。`);
revise(11,'quantum','乱蝶飞刃',r=>`斩出 ${r+1} 道旋转刀痕，飞行 ${650+r*150} 距离，穿透沿途敌人，每道造成技能 ${r*85}% 伤害。`);
revise(11,'combo','蝴蝶风暴',r=>`每次镰斩追加 ${r*2} 道残影，总伤害额外 +${r*150}%。`);
revise(8,'barrage','神君连锋',r=>`神君追加 ${r*2} 次落雷，同时向前连续挥出 ${r*2+1} 道贯穿刀光，每道为技能 ${r*55}% 伤害。`);
revise(4,'combo','转个不停',r=>`进入持续 ${3+r} 秒的陀螺旋转，沿曲线追击敌人；旋转速度 +${r*40}%，每 0.35 秒造成技能 ${50+r*30}% 伤害。`);
revise(4,'haste','转转加速',r=>`技能冷却缩短 ${r*12}%，陀螺旋转与移动速度额外提升 ${r*20}%。`);
revise(5,'chill','极寒重拳',r=>`每次范围重拳冻结附近敌人 ${(.8+r*.7).toFixed(1)} 秒。`);
revise(5,'ward','震退阵线',r=>`范围击退距离额外增加 ${r*35}，护盾增加 ${r*15} 点。`);
revise(5,'fortress','永冬领域',r=>`撑起跟随杰帕德移动的护盾领域，半径 ${150+r*30}，持续 ${2+r} 秒。穹在领域内免受伤害，领域内敌人持续冻结。`);
installComboCards(pools);
installGoldEvolutions(pools);
installCardCopy(pools);
Object.assign(pools,NEW_POOLS);
export const GROWTH_CARDS=Object.entries(pools).flatMap(([id,cards])=>cards.map(c=>({...c,owner:+id,id:`${id}:${c.key}`,tags:c.gold?tagsFor(+id,c.key):[]})));
export const cardsFor=id=>GROWTH_CARDS.filter(c=>c.owner===id);
export const rank=(actor,key)=>actor.growth?.[key]||0;
export const eligible=(engine,id)=>cardsFor(id).filter(c=>rank(id?engine.members[id]:engine.hero,c.key)<3);
export function growthOwners(engine,gold=false){const available=id=>id&&engine.members[id]&&eligible(engine,id).some(c=>!gold||c.gold);const team=[...new Set(engine.team)].filter(available);return team.length?team:[...new Set(engine.owned)].filter(id=>!engine.team.includes(id)&&available(id));}
export const teamHasGrowth=engine=>engine.team.some(id=>eligible(engine,id).length>0);
function pick(pool,random){if(!pool.length)return null;const weights=pool.map(c=>c.gold?1:3),total=weights.reduce((a,b)=>a+b,0);let roll=random()*total;for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0)return pool.splice(i,1)[0];}return pool.pop();}
const supply=(owner,n)=>({id:`supply:${owner}:${n}`,owner,key:'supply',name:'旅途补给',gold:false,supply:true,describe:()=> '可用成长牌不足：恢复 25 点生命并获得 30 信用点。补给不占成长层数。'});
export function rollGrowth(engine,id){
 if(id){const pool=eligible(engine,id);if(!pool.length)return [];return Array.from({length:3},(_,i)=>pick(pool,engine.random)||supply(id,i));}
 const own=eligible(engine,0),team=engine.team.flatMap(id=>eligible(engine,id));if(!team.length)return [];
 return [pick(own,engine.random)||pick(team,engine.random)||supply(0,0),...Array.from({length:2},(_,i)=>pick(team,engine.random)||supply(0,i+1))];
}
export function grantGrowth(engine,card){
 if(card.supply){engine.hero.hp=Math.min(engine.hero.maxHp,engine.hero.hp+25);engine.coins+=30;return true;}
 const a=card.owner?engine.members[card.owner]:engine.hero;if(rank(a,card.key)>=3)return false;
 a.growth??={};a.growth[card.key]=rank(a,card.key)+1;
 if(!card.owner){a.maxHp=100+30*rank(a,'health');a.hp=Math.min(a.maxHp,a.hp+(card.key==='health'?30:0));a.speed=175*(1+.08*rank(a,'speed'));}
 return true;
}

export function rollGold(engine){const pool=growthOwners(engine,true).flatMap(id=>eligible(engine,id).filter(c=>c.gold));if(!pool.length)return [];return Array.from({length:3},(_,i)=>pick(pool,engine.random)||supply(0,i));}
