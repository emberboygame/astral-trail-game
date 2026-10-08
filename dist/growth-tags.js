// Explicit mechanic tags; labels describe what each gold card actually enables.
export const GOLD_TAGS={
0:{swordStorm:['环绕','穿透'],bulletNova:['落雷','异常','冰冻'],toxicBloom:['异常','中毒','追踪'],thunderKing:['连锁','异常','冰冻'],meteorRain:['空袭','灼烧'],gravity:['聚集','群攻'],absoluteZero:['冰冻','弹幕抵消']},
1:{volley:['扇形','连射','冰冻'],iceBurst:['扇形','穿透','冰冻'],iceShield:['环绕','冰冻','护盾']},
2:{combo:['环绕','穿透','异常暴击'],windBurst:['八向','穿透','异常暴击'],windWake:['冲锋','连杀']},
3:{barrage:['扫射','灼烧'],solar:['群攻','灼烧'],aftershock:['爆炸','灼烧']},
4:{combo:['旋转','追击','群攻'],iceBurst:['冰冻','斩杀'],frostWake:['冰冻','传播']},
5:{fortress:['无敌','冰冻'],iceBurst:['冰冻','群攻'],rally:['护盾','技能加速']},
6:{overheal:['治疗','护盾'],rally:['治疗','技能加速'],medicine:['异常','中毒','追踪']},
7:{chain:['连锁','异常'],detonate:['异常','引爆','传播'],thunder:['落雷','异常','冰冻']},
8:{barrage:['队友连携','群攻'],solar:['环绕','穿透'],aftershock:['空袭','群攻']},
9:{missiles:['召唤','连射','标记'],robots:['召唤','扫射'],explosive:['召唤','爆炸','斩杀']},
10:{volley:['空袭','灼烧'],explosive:['环绕','穿透'],rally:['队友连携','技能加速']},
11:{combo:['吸魂','攻速','环绕'],reprise:['残影','队友连携'],quantum:['环绕','穿透']},
15:{eclipse:['八向','冰冻','连射'],mirror:['变身','冰冻','充能'],execution:['冰冻','斩杀']},
16:{hellscape:['八向','连射','穿透'],lotus:['吸魂','强化'],sever:['八向','穿透']},
17:{dragon:['聚集','群攻','充能'],lotus:['聚集','空袭'],twin:['冲锋','群攻']},
18:{audit:['召唤','追击'],jackpot:['队友连携','召唤','充能'],liquidation:['连杀','召唤','追击']},
19:{axiom:['连射','穿透'],statue:['空袭','异常','追击'],counterproof:['标记','队友连携','追击']},
20:{unsheathe:['异常','斩杀','充能'],red:['变身','瞬移','异常暴击'],echo:['八向','连射','穿透']},
21:{combustion:['空袭','冲锋','连杀'],firefall:['空袭','爆炸','灼烧','破韧'],superbreak:['破韧','斩杀','连锁','空袭']},
22:{storm:['聚集','群攻'],gunblade:['破韧','削弱'],pursuit:['环绕','队友连携']},
23:{key:['空袭','冰冻','群攻'],shatter:['全场','冰冻'],page:['传播','冰冻','连锁']},
24:{rainbow:['治疗','连射'],flight:['召唤','冲锋','群攻'],promise:['治疗','急救','召唤']}
};
export const tagsFor=(owner,key)=>GOLD_TAGS[owner]?.[key]||[];
export const renderGrowthTags=card=>card.gold&&card.tags?.length?`<div class="growth-tags" aria-label="流派标签">${card.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>`:'';
