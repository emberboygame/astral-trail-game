# 开发交接手册

## 接手顺序

先跑 npm ci、npm test、npm run build；再读 RULES、COMBAT、KNOWN_ISSUES。本文对应 v0.9.3，source-manifest.json 给出代码和资源摘要。GitHub 是原项目快照，不具有所有旧提交祖先；旧 SHA 元数据在 HISTORY.md/history.json。

## 文件职责

| 模块 | 职责与修改入口 |
|---|---|
| game.js | 创建 Engine/Renderer/UI，输入、失焦暂停、requestAnimationFrame |
| engine.js | 主状态、每帧编排、战斗/伤害、奖励队列、召唤、切图 |
| data.js / expansion-data.js | 角色基础定义；后者包含新增十人的卡池 |
| growth.js | 最终卡表、抽池、满池判断、发牌和补给 |
| combo-cards / gold-evolutions / card-copy / growth-tags | 覆写卡牌机制描述、黄金模式、最终短文案、标签 |
| growth-combat / gold-combat / combo | 主角和旧伙伴基础技能、黄金持续模式、命中/死亡联动 |
| expansion-combat | 新角色适配、托帕/医生、宠物、后续追击队列 |
| ascension-combat | 镜流/刃/饮月/黄泉/流萤/飞霄/大黑塔/风堇新底层 |
| firefly-combat | 流萤空袭选点、集束/连锁/扫荡伤害和绘制 |
| world / map-layouts / trial / balance | 地图、碰撞、营地、层级刷怪、首领、数值 |
| combat-rules / melee-motion / local-combat | 跟随、射程、动画选帧、特殊移动、旧金卡距离 |
| render / scene-models / software-renderer | Three.js 主绘制、场景模型、无 WebGL2 兼容路径 |
| gold-render / expansion-render / ground-effects / ice-effects / ticket-effects | 分层特效、冻结、票券表现 |
| ui / details / minigame / reveal-timing | DOM 窗口、角色详情、小游戏、召唤时序 |
| dev-checks | 仅开发模式动态导入的检查入口 |

文件均在 dist/，扩展名 .js。代码大量使用压缩长行；按函数或符号定位，不依赖固定行号。

## 运行链

game.js 每次绘制间隔最多取 0.1 秒，并拆成不超过 0.033 秒的 Engine.update 子步。UI 大约每 0.045 秒刷新一次或遇事件立即刷新。暂停时仍刷新 UI，场景只在进入暂停时绘一帧，不持续重绘背景。

Engine 通过 events 将 toast、refresh、upgrade、warp、chapter、sound 等交给 UI；UI 不应另写一份奖励规则。Renderer 向 engine.combatView 注入实际屏幕边界判断。Node 测试与真实浏览器投影行为不是同一验证范围。

## 关键状态归属

| 状态 | 所有者 | 保存/清理原则 |
|---|---|---|
| level/xp/growth | hero、members[id] | 局内持久，跨队伍/地图保留；刷新重建 |
| owned/team | Engine | 收藏和最多六位当前伙伴；ID 不连续 |
| tickets/coins | Engine | 库存，不与地上 drops 混用 |
| upgrades / pendingWarp / summonReward | Engine | 统一奖励队列与召唤绑定，不能各窗口独立发奖 |
| modal | Engine | 非空暂停模拟；详情另存 previous modal |
| targetEnemy、cd、cast、attackDir、rejoining | 角色 | 战斗目标、冷却、动画锁向和跟随状态 |
| projectiles / zones / fx / summons | Engine | 暂态攻击与表现；zones 同时含伤害和预警，不是纯视觉 |
| trial | Engine | number/goal/spawned/killed/ticketsDropped/started/bossSpawned/cleared |
| goldEffects / newFollowups / newPets / ascFields / ascSpread / fireflyBombs | Engine | 各系统负责更新、容量限制和清理 |
| ascRun / leap / rageUntil / whiteUntil 等 | 角色 | 技能移动、变身与充能暂态；不能覆盖 growth |

切图调用 clearGold、clearExpansion（含 clearAscension/clearFirefly），清理攻击数组并重置跟随；地图敌人等另存/恢复。换层恢复主角生命并清理战场，保留成长。不要在独立清理函数中重建整个 members，否则会丢牌。换人后各模块在 update 中过滤非队内 owner；已发射的部分旧弹体仍可完成命中，不等同于敌方死亡预警残留。

## 奖励状态机的修改位置

pickupTicket → receiveTickets → queueTicketGrowth/nextUpgrade → warp → recruit → reveal → finishSummon → nextUpgrade → chooseUpgrade。

recruit 消耗票、选择未拥有角色、绑定 queued ticket reward；finishSummon 负责把此奖励置前并清除引用；UI.requestRevealExit/RevealTiming 只负责演出何时放行。角色满池后的重新路由在 nextUpgrade 做，不能只在拾票瞬间过滤一次。chooseUpgrade 只接受当前 modal=upgrade 的队首，发牌后继续队列。首领奖励 advance 标记把选牌与换层连接；空黄金池仍必须推进。

## 添加角色/卡牌

1. 分配不冲突的稳定 ID；先检查动画 ID 与宠物 ID，不能假定 CHARS.length+1 可用。
2. 在对应数据模块写基本技能、5 普通/3 黄金。扩展池是在旧文案覆写后合入的，不能只改 combo-cards 期待新增角色生效。
3. 确定由旧 growth、expansion 还是 ascension 调度。REWORKED 中的角色会先走 ascension，expansion 里同 ID 的旧代码可能不可达。
4. 增加命中/观察/死亡/清理路径；处理 boss、sleeping boss、generated/secondary 递归标记。
5. 卡牌无前置也需能独立工作；最高三级；补齐 growth-tags，黄金标签 2–4 个且无重复。
6. 更新图集、裁切脚底坐标、portrait、UI 展示和所有素材加载映射。
7. 加入范围、无战前开火、冻结/斩杀首领保护、暂停、换人、切图的目标测试。不要只断言“函数能运行”。
8. 修改生成器中显式的 21/186 数量保护，再生成角色/牌表和校验摘要。更新手册和开发日志。

## 修改特效

先确认伤害是在 zones、projectiles、goldEffects 还是 fx 中结算，再改 renderer。删除绘制不等于删除机制；反之删整个区域对象可能让伤害/治疗消失。旧金卡的 invisible 标记正是“保留判定、隐藏大领域”的实现。新角色 fireRing 等另有路径，不能用旧渲染器的规则推断。

使用游戏时间驱动战斗；真实时间只用于 UI/演出/小游戏。限制递归链和活跃对象，防止高级构筑爆炸式生成对象。容量/代数限制见 COMBAT。

## 文档维护

CARDS/CHARACTERS/BALANCE/HISTORY/source-manifest 为生成物。history.json 是原始仓库一次性归档，正常更新不重新抓取。新提交写 DEVLOG；生成器 --capture-history 仅原始仓库有意义。人工文档与生成数据出现矛盾时，检查实际代码和断言，记录偏差，不靠修改文档伪造实现。
