# 星轨 · 失落的回声

《崩坏：星穹铁道》非官方同人即时战斗网页原型，当前游戏版本 **v0.9.3**。21 名可招募伙伴、最多 6 人编队、两张地图、186 张可叠加成长牌。

[开始游玩](https://emberboygame.github.io/astral-trail-game/) · [GitHub 仓库](https://github.com/emberboygame/astral-trail-game)

进度只保存在当前页面内存，刷新或关闭页面会重置。没有账号、服务器存档或多人联机。

## 操作与第一局

WASD / 方向键移动；点击地面寻路目标；空格闪避；Q / 右键主动攻击；E 互动；Tab 编队；Esc 暂停或关闭允许关闭的窗口。地图点击移动没有完整路径规划，房屋和湖岸需绕行。点击角色头像查看详情、光锥和等级。

初始伙伴为三月七、丹恒、娜塔莎。向东前往地图尽头，接触首领即可唤醒；击败后自动完成章节，可立即进入星潮旷野，也可通过驿站往返。主角升级和拾取车票提供不同的光锥奖励，伙伴升级本身不抽牌。详细例外见规则手册。

## 本地开发

使用 Node **20.19+（20.x）或 22.12+**，与锁文件中的 Vite 7.1.5 要求兼容。

```bash
npm ci
npm run dev
npm test
npm run build
node scripts/generate-docs.mjs --check
```

**dist/ 是手写源码，build/ 才是构建输出。** 不要删除 dist/，也不要直接修补 build/assets 中的打包代码。

离线单文件：运行 `npm run build:local`，得到 `release/Startrail-v0.9.3.html`。这是生成物，不纳入源码提交；后续更改版本时须同步打包脚本中的文件名。

## 文档入口

| 文档 | 用途 |
|---|---|
| [AGENTS.md](AGENTS.md) | 后续 AI 开发约束与工作流程 |
| [交接手册](docs/HANDOFF.md) | 架构、状态、扩展步骤、风险入口 |
| [游戏规则](docs/RULES.md) | 经验、票券、召唤、成长、地图、首领 |
| [数值表](docs/BALANCE.md) | 从代码生成的等级曲线和层级数值 |
| [战斗与连携](docs/COMBAT.md) | 命中链、异常、各角色机制、距离例外 |
| [角色索引](docs/CHARACTERS.md) | 21 名伙伴的稳定 ID 和基础数据 |
| [全部成长牌](docs/CARDS.md) | 186 张牌、I–III 级界面文案与黄金标签 |
| [资源与渲染](docs/ASSETS.md) | 动画裁切、立绘、双渲染路径 |
| [测试手册](docs/TESTING.md) | 测试对应规则、手动验收、验证边界 |
| [发布手册](docs/DEPLOYMENT.md) | GitHub Pages、本地包、故障排查、回滚 |
| [开发日志](docs/DEVLOG.md) | 演进摘要、历史档案和本次文档修订 |
| [已知偏差](docs/KNOWN_ISSUES.md) | 需求与现实现差异、待核实风险 |
| [事实校验清单](docs/source-manifest.json) | 本文档基线的源码/资源 SHA-256 |

生成文档命令为 `node scripts/generate-docs.mjs`。卡牌效果以实际战斗代码为准，目录中的“文案”只证明 UI 显示内容，不能替代行为测试。原始提交历史单独归档，GitHub 初次发布是快照导入。

## 资源说明

角色名称、设定和原版立绘相关权利属于各自权利人；像素角色为本项目改编资源。仓库没有据此授予官方素材再授权。发布或复用资源前，请核对 [资源说明](docs/ASSETS.md) 中尚未完整记录的来源。
