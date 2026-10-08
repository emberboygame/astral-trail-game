import {NEW_CHARS} from './expansion-data.js';
export const CHARS=[
{id:1,name:'三月七',star:4,element:'冰',role:'远程控制',color:'#9cddf1',skill:'极寒冰矢',desc:'留在附近，射出冰箭并减速敌人。',cd:1.3,damage:15,range:300,kind:'arrow',branches:[[['三重冰矢','每次射出三支冰箭','multi'],['冰封瞬间','命中冻结敌人 1 秒','freeze']],[['贯穿冰晶','冰箭穿透敌人','pierce'],['冰花绽放','命中产生冰爆','burst']]]},
{id:2,name:'丹恒',star:4,element:'风',role:'近战突进',color:'#6bdbb5',skill:'云骑惊龙',desc:'主动接近敌人，以长枪突刺，留下青色枪影。',cd:1.1,damage:28,range:78,kind:'melee',branches:[[['连环枪影','连续追加两次突刺','multi'],['破风长枪','突刺范围扩大 70%','range']],[['疾风追猎','技能冷却缩短 35%','haste'],['惊龙横扫','每次突刺附带范围伤害','burst']]]},
{id:3,name:'姬子',star:5,element:'火',role:'范围炮台',color:'#ff9367',skill:'天坠之火',desc:'在附近保持距离，轨道激光轰击敌群。',cd:4.6,damage:52,range:360,kind:'laser',branches:[[['双重轨道','追加第二次轰击','multi'],['熔火余温','轰击留下持续燃烧区域','burn']],[['烈焰扩散','轰击半径扩大 60%','range'],['快速充能','冷却缩短 35%','haste']]]},
{id:4,name:'黑塔',star:4,element:'冰',role:'旋转近战',color:'#c0a2ef',skill:'转圈圈',desc:'主动追击敌群，挥动大锤旋转攻击；成长后沿曲线穿行。',cd:2.5,damage:30,range:115,kind:'spin',branches:[[['再转一圈','连续旋转两次','multi'],['大大的锤子','攻击半径扩大 60%','range']],[['冰霜人偶','命中冻结 1 秒','freeze'],['停不下来','冷却缩短 35%','haste']]]},
{id:5,name:'杰帕德',star:5,element:'冰',role:'护盾辅助',color:'#88bef5',skill:'永屹之壁',desc:'跟随穹，迎击附近敌人，以冰拳击退敌人并为穹建立冰垒。',cd:3.5,damage:62,range:150,kind:'shield',branches:[[['坚城','护盾量从 30 增加至 55','power'],['反震冰甲','生成护盾时击退周围敌人','burst']],[['永冻边界','击退时冻结敌人','freeze'],['持续守护','冷却缩短 35%','haste']]]},
{id:6,name:'娜塔莎',star:4,element:'物理',role:'治疗支援',color:'#9fddbf',skill:'爱与救护',desc:'穹受伤时发射医疗胶囊，形成治疗区域。',cd:5,damage:0,range:400,kind:'heal',branches:[[['充足补给','每次恢复量从 24 增加至 42','power'],['缓释药剂','恢复区域持续治疗','regen']],[['应急处理','冷却缩短 35%','haste'],['温柔守护','治疗同时给予 15 点护盾','shield']]]},
{id:7,name:'卡芙卡',star:5,element:'雷',role:'连锁控制',color:'#e383dc',skill:'颤栗的温柔',desc:'保持松散站位，发出连锁雷电，持续电击。',cd:2.3,damage:27,range:310,kind:'chain',branches:[[['蔓延的电流','连锁额外两个目标','multi'],['触电余韵','触电持续伤害翻倍','power']],[['丝线缠绕','命中附带强力减速','freeze'],['终幕','每次连锁终点发生雷爆','burst']]]},
{id:8,name:'景元',star:5,element:'雷',role:'近战神君',color:'#f0ce70',skill:'神君斩阵',desc:'持刀近战追击，同时召唤神君斩击敌群。',cd:4.8,damage:65,range:110,kind:'lord',branches:[[['连斩','神君追加两次斩击','multi'],['横扫千军','神君斩击范围扩大 60%','range']],[['雷霆破阵','伤害提升 70%','power'],['号令','冷却缩短 35%','haste']]]},
{id:9,name:'克拉拉',star:5,element:'物理',role:'机械召唤',color:'#f08d85',skill:'史瓦罗，帮帮我',desc:'召唤史瓦罗自主追击，发射飞弹保护穹。',cd:6,damage:24,range:350,kind:'robot',branches:[[['导弹齐射','史瓦罗每次发射三枚导弹','multi'],['加固火力','导弹伤害提升 70%','power']],[['爆破弹头','导弹造成范围伤害','burst'],['持续援护','史瓦罗部署时间增加','duration']]]},
{id:10,name:'艾丝妲',star:4,element:'火',role:'远程连射',color:'#f6b596',skill:'流星风暴',desc:'以法杖接连发射追踪流星。',cd:2,damage:17,range:340,kind:'meteor',branches:[[['流星群','额外发射三枚流星','multi'],['炽热星核','命中留下灼烧区域','burn']],[['星火爆裂','流星产生范围爆炸','burst'],['天文观测','冷却缩短 35%','haste']]]},
{id:11,name:'希儿',star:5,element:'量子',role:'近战闪袭',color:'#b39aff',skill:'乱蝶',desc:'快速冲向目标，挥出紫色镰刃与蝶影。',cd:1.5,damage:36,range:90,kind:'scythe',branches:[[['蝶影重袭','额外追加一次斩击','multi'],['长夜之刃','斩击范围扩大 70%','range']],[['再现','冷却缩短 35%','haste'],['量子涟漪','斩击引发范围量子爆炸','burst']]]}
];
CHARS.push(...NEW_CHARS);
export const byId=id=>CHARS.find(c=>c.id===id);
export const HERO_BRANCHES=[ [['开拓之躯','最大生命 +35，并恢复全部生命','health'],['轻捷步伐','移动速度 +18%','speed']], [['不屈行者','最大生命 +50，并恢复全部生命','health2'],['连续闪避','闪避冷却缩短 45%','dash']] ];
