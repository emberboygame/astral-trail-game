# AGENTS.md

本文件是给后续 AI 开发者的仓库级工作说明。开始修改前，先阅读 `README.md` 与 `docs/HANDOFF.md`。

## 必须遵守的产品约束

- 游戏必须保持即时制，不改成回合制。
- 伙伴上限六人，主角不占伙伴位。
- 伙伴自动战斗；同屏移动不能频繁打断攻击，移动与技能动画状态必须解耦。
- 常规成长牌应优先提供新机制与 Combo，避免只做伤害百分比。
- 每位伙伴有 5 张普通牌、3 张黄金牌；同一牌最多 3 级，满级后移出可抽池。
- 黄金牌需要明显改变玩法，但避免全屏、超远距离和连续大领域遮挡战斗。
- 冻结对普通敌人必须有清楚的冰蓝材质/冰块反馈并停止行动；首领不停止行动，只延长攻击间隔。
- 敌人死亡、切图、结束首领战时必须清理预警区和持续特效。
- 树木等场景装饰不能参与角色碰撞，不得卡住角色。
- 版本号同时更新 `package.json`、`dist/index.html`、`dist/game.js` 和开发日志。

## 修改流程

1. 先定位负责该机制的模块，不要把新逻辑继续堆入 `engine.js`。
2. 为新规则在 `tests/` 增加或修改针对性测试。
3. 运行 `npm test`。
4. 运行 `npm run build`，确认 GitHub Pages 的相对路径构建正常。
5. 在浏览器实际走查：加载、移动、战斗、暂停、召唤、抽牌、切图和首领战。
6. 将面向玩家的变化写入 `docs/DEVLOG.md`，将架构或风险变化写入 `docs/HANDOFF.md`。

## 代码导航

- 状态与流程：`dist/engine.js`
- 世界、刷怪与首领：`dist/world.js`、`dist/trial.js`、`dist/combat-rules.js`
- 成长牌：`dist/growth.js`、`dist/combo-cards.js`、`dist/gold-evolutions.js`
- 战斗实现：`dist/growth-combat.js`、`dist/gold-combat.js`、`dist/combo.js`、`dist/ascension-combat.js`、`dist/firefly-combat.js`
- 动画/渲染：`dist/render.js`、`dist/animation-frames.js`、`dist/expansion-frames.js`
- UI：`dist/ui.js`、`dist/details.js`、`dist/card-copy.js`
- 数值入口：`dist/balance.js`

## 测试红线

以下规则变更时必须保留或补齐覆盖：

- 召唤动画结束后，无论点击何处，都能进入附赠成长牌选择。
- 全角色已拥有时，车票仍可转换为成长牌机会。
- 角色牌池满后不再抽到该角色；主角升级池无可用牌时转换为车票。
- 暂停时游戏时间、持续区域和召唤物寿命不能推进。
- 无尽层精确生成目标数量，击杀目标后只生成一个首领，首领奖励只出黄金牌。
- 死亡敌人的预警和宿主型特效必须消失。
- 稀有角色的特殊移动不能被普通跟随逻辑抢占。

不要提交 `node_modules/`、`build/`、本地压缩包或临时截图。
