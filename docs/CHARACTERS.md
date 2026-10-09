# 角色定义索引

由 scripts/generate-docs.mjs 从 v0.9.3 的最终运行时定义生成；不要直接编辑本文件。运行 `node scripts/generate-docs.mjs` 更新，`--check` 校验。

这些是数据层的基础值，实际射程、冷却、伤害受战斗规则和成长覆盖，不能把 range 列直接当最终攻击距离。0 为主角；1–11 为初始伙伴；15–24 为新增伙伴。12–14 等动画 ID 不是可招募伙伴，不要重排现有 ID。

| ID | 角色 | 星级 | 元素 | 类型 | 基础伤害 | 基础冷却秒 | 数据 range | 普通/黄金牌 |
|---|---|---|---|---|---|---|---|---|
| 1 | 三月七 | 4 | 冰 | arrow | 15 | 1.3 | 300 | 5/3 |
| 2 | 丹恒 | 4 | 风 | melee | 28 | 1.1 | 78 | 5/3 |
| 3 | 姬子 | 5 | 火 | laser | 52 | 4.6 | 360 | 5/3 |
| 4 | 黑塔 | 4 | 冰 | spin | 30 | 2.5 | 115 | 5/3 |
| 5 | 杰帕德 | 5 | 冰 | shield | 62 | 3.5 | 150 | 5/3 |
| 6 | 娜塔莎 | 4 | 物理 | heal | 0 | 5 | 400 | 5/3 |
| 7 | 卡芙卡 | 5 | 雷 | chain | 27 | 2.3 | 310 | 5/3 |
| 8 | 景元 | 5 | 雷 | lord | 65 | 4.8 | 110 | 5/3 |
| 9 | 克拉拉 | 5 | 物理 | robot | 24 | 6 | 350 | 5/3 |
| 10 | 艾丝妲 | 4 | 火 | meteor | 17 | 2 | 340 | 5/3 |
| 11 | 希儿 | 5 | 量子 | scythe | 36 | 1.5 | 90 | 5/3 |
| 15 | 镜流 | 5 | 冰 | newRanged | 48 | 1.25 | 640 | 5/3 |
| 16 | 刃 | 5 | 风 | newRanged | 48 | 1.5 | 640 | 5/3 |
| 17 | 丹恒·饮月 | 5 | 虚数 | newRanged | 48 | 1.6 | 660 | 5/3 |
| 18 | 托帕&账账 | 5 | 火 | newRanged | 24 | 2 | 380 | 5/3 |
| 19 | 真理医生 | 5 | 虚数 | newRanged | 32 | 2.2 | 390 | 5/3 |
| 20 | 黄泉 | 5 | 雷 | newRanged | 48 | 1.5 | 640 | 5/3 |
| 21 | 流萤 | 5 | 火 | newRanged | 72 | 0.95 | 650 | 5/3 |
| 22 | 飞霄 | 5 | 风 | newRanged | 42 | 1.4 | 650 | 5/3 |
| 23 | 大黑塔 | 5 | 冰 | newRanged | 49 | 1.9 | 630 | 5/3 |
| 24 | 风堇 | 5 | 风 | heal | 20 | 4.6 | 400 | 5/3 |

## 1 · 三月七

- 技能：极寒冰矢。数据描述：留在附近，射出冰箭并减速敌人。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 2 · 丹恒

- 技能：云骑惊龙。数据描述：主动接近敌人，以长枪突刺，留下青色枪影。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 3 · 姬子

- 技能：天坠之火。数据描述：在附近保持距离，轨道激光轰击敌群。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 4 · 黑塔

- 技能：转圈圈。数据描述：主动追击敌群，挥动大锤旋转攻击；成长后沿曲线穿行。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 5 · 杰帕德

- 技能：永屹之壁。数据描述：跟随穹，迎击附近敌人，以冰拳击退敌人并为穹建立冰垒。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 6 · 娜塔莎

- 技能：爱与救护。数据描述：穹受伤时发射医疗胶囊，形成治疗区域。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 7 · 卡芙卡

- 技能：颤栗的温柔。数据描述：保持松散站位，发出连锁雷电，持续电击。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 8 · 景元

- 技能：神君斩阵。数据描述：持刀近战追击，同时召唤神君斩击敌群。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 9 · 克拉拉

- 技能：史瓦罗，帮帮我。数据描述：召唤史瓦罗自主追击，发射飞弹保护穹。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 10 · 艾丝妲

- 技能：流星风暴。数据描述：以法杖接连发射追踪流星。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 11 · 希儿

- 技能：乱蝶。数据描述：快速冲向目标，挥出紫色镰刃与蝶影。
- 实现入口：[growth-combat.js](../dist/growth-combat.js)、[combo.js](../dist/combo.js)、[gold-combat.js](../dist/gold-combat.js)
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 15 · 镜流

- 技能：月照冰河。数据描述：挥出扇形冰刃冻结敌阵，朔望满盈后转魄连斩。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：三月七、杰帕德先冻结；镜流接剑破冰，转魄斩连续切开敌阵。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 16 · 刃

- 技能：支离剑。数据描述：八向刀光贯穿敌阵，斗志蓄满追加支离重斩。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：八向剑气切开敌阵；击杀积攒剑势与亡魂，交错刀光接续重斩。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 17 · 丹恒·饮月

- 技能：盘拏耀跃。数据描述：驾驭宽阔水浪穿过敌阵，队友攻击帮助积蓄龙力。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：队友协击积攒龙力，水漩涡与水柱聚敌，曲线游龙贯穿敌群。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 18 · 托帕&账账

- 技能：亏损标记。数据描述：射击标记敌人，账账追赶标记目标并发动冲撞。
- 实现入口：[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：标记敌人后，队友攻击会加快账账冲撞；与真理医生、飞霄组成追击队。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 19 · 真理医生

- 技能：知识即力量。数据描述：投出粉笔，攻击异常敌人时追加追击。
- 实现入口：[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：卡芙卡和托帕施加异常，粉笔追加追击；反证让队友攻击也能引发追击。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 20 · 黄泉

- 技能：残梦一刀。数据描述：瞬移留下一路斩痕，落点迸发八向刀光；异常积攒残梦。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：异常与冰冻积攒残梦，断界裁决收割异常敌人；白发觉醒后连续瞬移斩击。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 21 · 流萤

- 技能：萤火强袭。数据描述：穿透火刃引发溅射，追踪空袭轰炸密集敌群，跃空坠击接续扫荡。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[firefly-combat.js](../dist/firefly-combat.js)
- 数据中的搭配提示：飞霄破韧、饮月聚敌后，流萤以集束空袭收割；低空扫荡续航，破韧击杀引发连锁轰炸。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 22 · 飞霄

- 技能：闪裂斩。数据描述：斩出贯穿龙卷弹反复切割敌人，队友攻击积攒飞黄。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：高频协击积攒飞黄，龙卷聚敌并破韧，为流萤提供斩杀机会。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 23 · 大黑塔

- 技能：解答时刻。数据描述：冰晶命中积累解读，队友攻击叠加层数，满层引发定点碎冰。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：永冬反复冻结敌人，伤害与冰冻沿敌群传播；为镜流狂暴、黄泉残梦提供充能。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。

## 24 · 风堇

- 技能：雨后晴空。数据描述：召来小伊卡为穹治疗，将实际治疗转化为忆灵追击。
- 实现入口：[ascension-combat.js](../dist/ascension-combat.js)、[expansion-combat.js](../dist/expansion-combat.js)
- 数据中的搭配提示：治疗给小伊卡积蓄力量，羽弹反哺生命；小伊卡起飞后往返贯穿敌阵。
- 牌表：[成长卡全表](CARDS.md#角色-'+c.id+')；实际联动见 [COMBAT.md](COMBAT.md)。
