# 原始开发提交档案

由 scripts/generate-docs.mjs 从 v0.9.3 的最终运行时定义生成；不要直接编辑本文件。运行 `node scripts/generate-docs.mjs` 更新，`--check` 校验。

这是原始本地仓库的提交元数据归档。GitHub 以源码快照导入，以下旧 SHA 不保证能在 GitHub 打开。版本取自每个提交的 package.json，日期为提交作者时间；标题记录当时的修改意图，不代表今天仍沿用该机制。当前规则见 [RULES.md](RULES.md)。

## 未标版本 · Build Astral Trail playable real-time companion adventure

- SHA：`f0a0aa383c904b1c537872b066d0ac1c8535ecb0`
- 作者时间：2026-09-14T20:48:36+09:00
- 变动文件：`.openai/hosting.json`、`dist/assets/atlas.png`、`dist/data.js`、`dist/engine.js`、`dist/favicon.svg`、`dist/game.js`、`dist/index.html`、`dist/render.js`、`dist/style.css`、`dist/ui.js`、`dist/world.js`、`tests/smoke.mjs`

## 0.2.0 · Add animated four-direction actors, 3D environments and endless progression

- SHA：`e4e1232806e548c6dab6983d3f9b21d352937182`
- 作者时间：2026-09-14T21:31:24+09:00
- 变动文件：`.gitignore`、`.openai/hosting.json`、`dist/assets/animations/0.png`、`dist/assets/animations/1.png`、`dist/assets/animations/10.png`、`dist/assets/animations/11.png`、`dist/assets/animations/12.png`、`dist/assets/animations/13.png`、`dist/assets/animations/14.png`、`dist/assets/animations/2.png`、`dist/assets/animations/3.png`、`dist/assets/animations/4.png`、`dist/assets/animations/5.png`、`dist/assets/animations/6.png`、`dist/assets/animations/7.png`、`dist/assets/animations/8.png`、`dist/assets/animations/9.png`、`dist/balance.js`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/minigame.js`、`dist/render.js`、`dist/scene-models.js`、`dist/software-renderer.js`、`dist/style.css`、`dist/ui.js`、`dist/vendor/three.core.js`、`dist/vendor/three.module.js`、`dist/world.js`、`package-lock.json`、`package.json`、`tests/smoke.mjs`、`vite.config.js`

## 0.3.0 · Stabilize combat anchors, calibrate sprite frames, add character details and offline build

- SHA：`d49227ab59307e9b44cbabb433132bfe1dbec37e`
- 作者时间：2026-09-14T10:25:48-03:00
- 变动文件：`.gitignore`、`LOCAL_TEST.txt`、`dist/animation-frames.js`、`dist/assets/portraits/1.webp`、`dist/assets/portraits/10.webp`、`dist/assets/portraits/11.webp`、`dist/assets/portraits/2.webp`、`dist/assets/portraits/3.webp`、`dist/assets/portraits/4.webp`、`dist/assets/portraits/5.webp`、`dist/assets/portraits/6.webp`、`dist/assets/portraits/7.webp`、`dist/assets/portraits/8.webp`、`dist/assets/portraits/9.webp`、`dist/assets/portraits/sources.json`、`dist/data.js`、`dist/details.js`、`dist/engine.js`、`dist/render.js`、`dist/style.css`、`dist/ui.js`、`package-lock.json`、`package.json`、`scripts/package-local.mjs`、`tests/revision3.mjs`、`vite.local.config.js`

## 0.3.1 · Fix target-death regroup and HUD click race; identify local v0.3.1 package

- SHA：`fadcba0782b229f0e51d2dad2c00c3192a8e16a1`
- 作者时间：2026-09-14T10:37:30-03:00
- 变动文件：`LOCAL_TEST.txt`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/render.js`、`dist/style.css`、`dist/ui.js`、`package-lock.json`、`package.json`、`scripts/package-local.mjs`、`tests/revision3.mjs`

## 0.3.2 · Tune ranged follow distance, extend attacks and preserve mobile casting animations

- SHA：`02c51ead95b18a7952e896ba625046a49ef629a6`
- 作者时间：2026-09-14T10:43:11-03:00
- 变动文件：`LOCAL_TEST.txt`、`dist/combat-rules.js`、`dist/details.js`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/render.js`、`package-lock.json`、`package.json`、`scripts/package-local.mjs`、`tests/mobile-casting.mjs`、`tests/revision3.mjs`

## 0.3.3 · Expand pursuit and acquisition for Dan Heng, Jing Yuan, Kafka and Seele

- SHA：`ed100630e8737b562ecc5c9b65b1fdb4f0624379`
- 作者时间：2026-09-14T10:48:25-03:00
- 变动文件：`LOCAL_TEST.txt`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`package-lock.json`、`package.json`、`scripts/package-local.mjs`

## 0.4.0 · Add quest-gated Starfield endless map and reduce first boss health

- SHA：`23bda13a97a023e41735c62b1f287b477105404b`
- 作者时间：2026-09-15T16:01:44+08:00
- 变动文件：`dist/balance.js`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/map-layouts.js`、`dist/render.js`、`dist/scene-models.js`、`dist/ui.js`、`dist/world.js`、`package-lock.json`、`package.json`、`scripts/package-local.mjs`、`tests/maps.mjs`、`tests/smoke.mjs`

## 0.5.0 · Add stackable light cone growth and character progression

- SHA：`8a35e713e19d3f0bcc2c7ae0040a9e6f888008b0`
- 作者时间：2026-09-15T06:25:10-04:00
- 变动文件：`dist/balance.js`、`dist/combat-rules.js`、`dist/details.js`、`dist/engine.js`、`dist/game.js`、`dist/growth-combat.js`、`dist/growth.js`、`dist/index.html`、`dist/render.js`、`dist/style.css`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/smoke.mjs`

## 0.6.0 · Add ticket growth rewards, melee builds and escalating trial floors

- SHA：`cbafd03715aa6fd8d8a3c12e520ac51338da1993`
- 作者时间：2026-09-15T07:11:15-04:00
- 变动文件：`dist/combat-rules.js`、`dist/data.js`、`dist/details.js`、`dist/dev-checks.js`、`dist/engine.js`、`dist/game.js`、`dist/ground-effects.js`、`dist/growth-combat.js`、`dist/growth.js`、`dist/index.html`、`dist/map-layouts.js`、`dist/melee-motion.js`、`dist/render.js`、`dist/scene-models.js`、`dist/style.css`、`dist/trial.js`、`dist/ui.js`、`dist/world.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/maps.mjs`、`tests/mobile-casting.mjs`、`tests/smoke.mjs`、`tests/v06.mjs`

## 0.6.1 · Slow progression, cap ticket drops and preserve summon reveal

- SHA：`d1c9b3566a629cbacb52fcc6c2ac3211ed1bd4a3`
- 作者时间：2026-09-15T07:32:41-04:00
- 变动文件：`dist/balance.js`、`dist/details.js`、`dist/dev-checks.js`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/render.js`、`dist/reveal-timing.js`、`dist/style.css`、`dist/ticket-effects.js`、`dist/trial.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/smoke.mjs`、`tests/v06.mjs`、`tests/v061.mjs`

## 0.6.2 · Fix summon growth reward delivery and improve minigame timing and lord effects

- SHA：`69e7f29424844efec5f2fadd15f7761fdb3b6c17`
- 作者时间：2026-09-15T07:45:57-04:00
- 变动文件：`dist/dev-checks.js`、`dist/engine.js`、`dist/game.js`、`dist/ground-effects.js`、`dist/index.html`、`dist/minigame.js`、`dist/reveal-timing.js`、`dist/style.css`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/smoke.mjs`、`tests/v06.mjs`、`tests/v062.mjs`

## 0.6.3 · Rebalance boss health and hero progression; clarify trial labels and verify ticket gold rewards

- SHA：`129515327dee64a3ce55012d21e3159ab15a283f`
- 作者时间：2026-09-15T07:59:40-04:00
- 变动文件：`dist/balance.js`、`dist/details.js`、`dist/engine.js`、`dist/game.js`、`dist/growth-combat.js`、`dist/index.html`、`dist/render.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/smoke.mjs`、`tests/v061.mjs`、`tests/v063.mjs`

## 0.6.4 · Activate chapter boss on contact and add loading gameplay hint

- SHA：`6f4a5056a48e5a040d79d9a4b2f2f417676d9aee`
- 作者时间：2026-09-15T08:28:31-04:00
- 变动文件：`dist/balance.js`、`dist/engine.js`、`dist/game.js`、`dist/index.html`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/smoke.mjs`

## 0.7.0 · Add status combos, chain charges, shatter executions, team echoes and visible ice prisons

- SHA：`9a54a91a1828eb064a4fed7775b21ff7e54ea2cf`
- 作者时间：2026-09-15T09:11:04-04:00
- 变动文件：`dist/combat-rules.js`、`dist/combo-cards.js`、`dist/combo.js`、`dist/details.js`、`dist/engine.js`、`dist/game.js`、`dist/growth-combat.js`、`dist/growth.js`、`dist/ice-effects.js`、`dist/index.html`、`dist/melee-motion.js`、`dist/render.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/combos.mjs`、`tests/v061.mjs`

## 0.8.0 · Evolve all legendary cards into sustained battlefield forms and soul harvesting

- SHA：`1ed2883b6f2a51f970b6600f1e20c9a73b4f3836`
- 作者时间：2026-09-15T09:27:05-04:00
- 变动文件：`dist/combo-cards.js`、`dist/details.js`、`dist/engine.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/gold-render.js`、`dist/growth-combat.js`、`dist/growth.js`、`dist/index.html`、`dist/render.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/gold-evolutions.mjs`

## 0.8.1 · Cancel dead enemies warnings immediately and prevent postmortem casts

- SHA：`c23baffa187485d5b328a58f9bb5b8bc407f3fd5`
- 作者时间：2026-09-15T09:30:16-04:00
- 变动文件：`dist/engine.js`、`dist/game.js`、`dist/ground-effects.js`、`dist/index.html`、`dist/trial.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/warning-cleanup.mjs`

## 0.8.2 · Replace team healing and shield formations with small attached indicators

- SHA：`eced6bfe20d6e877e64abeb756654cebf33bb08a`
- 作者时间：2026-09-15T09:33:37-04:00
- 变动文件：`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/gold-render.js`、`dist/index.html`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`

## 0.8.3 · Keep frozen bosses active, replace tornado with wind blades and reduce combat visual clutter

- SHA：`cafc5fddf168f648cea8271de729ccee92f46178`
- 作者时间：2026-09-15T09:45:45-04:00
- 变动文件：`dist/combat-rules.js`、`dist/combo-cards.js`、`dist/combo.js`、`dist/engine.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/gold-render.js`、`dist/growth-combat.js`、`dist/ice-effects.js`、`dist/index.html`、`dist/melee-motion.js`、`dist/render.js`、`dist/trial.js`、`dist/ui.js`、`dist/wind-blades.js`、`package.json`、`scripts/package-local.mjs`、`tests/combat-clarity.mjs`、`tests/combos.mjs`、`tests/gold-evolutions.mjs`、`tests/growth.mjs`

## 0.8.4 · Replace large healing and expanding poison fields with hit-based rounds; scale trial density and health

- SHA：`9ad9664a9ab29a8ba65ab862eb54573d65abcd55`
- 作者时间：2026-09-15T10:00:03-04:00
- 变动文件：`dist/combo-cards.js`、`dist/combo.js`、`dist/dev-checks.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/ground-effects.js`、`dist/growth-combat.js`、`dist/index.html`、`dist/trial.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/gold-evolutions.mjs`、`tests/growth.mjs`、`tests/toxic-rounds.mjs`、`tests/v06.mjs`

## 0.8.5 · Limit evolved gold attacks to nearby combat and replace March rain with forward cones

- SHA：`55a2e1e3e3210f1f811706495c94cecded478df8`
- 作者时间：2026-09-15T10:15:24-04:00
- 变动文件：`dist/combat-rules.js`、`dist/combo.js`、`dist/engine.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/gold-render.js`、`dist/growth-combat.js`、`dist/index.html`、`dist/local-combat.js`、`dist/melee-motion.js`、`dist/render.js`、`dist/ui.js`、`dist/wind-blades.js`、`package.json`、`scripts/package-local.mjs`、`tests/combat-clarity.mjs`、`tests/gold-evolutions.mjs`、`tests/growth.mjs`、`tests/local-gold.mjs`、`tests/mobile-casting.mjs`、`tests/v063.mjs`

## 0.8.6 · Free Herta and Seele pursuit, remove domain overlays and simplify card descriptions

- SHA：`c398e68455a13aae381a65c778ee98d593ac72d1`
- 作者时间：2026-09-15T10:34:47-04:00
- 变动文件：`dist/card-copy.js`、`dist/combo-cards.js`、`dist/engine.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-evolutions.js`、`dist/gold-render.js`、`dist/growth-combat.js`、`dist/growth.js`、`dist/index.html`、`dist/local-combat.js`、`dist/melee-motion.js`、`dist/ui.js`、`dist/world.js`、`package.json`、`scripts/package-local.mjs`、`tests/free-pursuit.mjs`、`tests/gold-evolutions.mjs`、`tests/growth.mjs`、`tests/local-gold.mjs`

## 0.8.7 · Make Jing Yuan formation single strike and remove expanding wave overlays

- SHA：`f89cc4c01279d7858b8abcb2755aa4c2bec5893f`
- 作者时间：2026-09-15T10:45:33-04:00
- 变动文件：`dist/card-copy.js`、`dist/combo-cards.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/gold-render.js`、`dist/index.html`、`dist/render.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/gold-evolutions.mjs`

## 0.8.8 · Scale late XP and floor health and slow Himeko cannon cadence

- SHA：`295f8e82c56f3efdef6248e48944b259449c11cc`
- 作者时间：2026-09-15T11:17:46-04:00
- 变动文件：`dist/balance.js`、`dist/data.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/growth-combat.js`、`dist/index.html`、`dist/trial.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/late-balance.mjs`、`tests/toxic-rounds.mjs`、`tests/v061.mjs`

## 0.8.9 · Moderate Himeko nerf and shorten Kafka basic chain reach

- SHA：`af550922619b8908c4288e4b6ccfbf19a362a977`
- 作者时间：2026-09-15T11:21:25-04:00
- 变动文件：`dist/combat-rules.js`、`dist/data.js`、`dist/game.js`、`dist/gold-combat.js`、`dist/growth-combat.js`、`dist/index.html`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/late-balance.mjs`、`tests/mobile-casting.mjs`

## 0.9.0 · Add ten five-star companions with animated sprites, unique combat kits and eighty growth cards

- SHA：`3820c1449b143bb8aec019dde2d7a640629eab07`
- 作者时间：2026-09-16T00:14:04-04:00
- 变动文件：`dist/animation-frames.js`、`dist/assets/animations/15.png`、`dist/assets/animations/16.png`、`dist/assets/animations/17.png`、`dist/assets/animations/18.png`、`dist/assets/animations/19.png`、`dist/assets/animations/20.png`、`dist/assets/animations/21.png`、`dist/assets/animations/22.png`、`dist/assets/animations/23.png`、`dist/assets/animations/24.png`、`dist/assets/animations/25.png`、`dist/assets/animations/26.png`、`dist/assets/animations/expansion-art-sources.json`、`dist/assets/icons/15.png`、`dist/assets/icons/16.png`、`dist/assets/icons/17.png`、`dist/assets/icons/18.png`、`dist/assets/icons/19.png`、`dist/assets/icons/20.png`、`dist/assets/icons/21.png`、`dist/assets/icons/22.png`、`dist/assets/icons/23.png`、`dist/assets/icons/24.png`、`dist/assets/icons/25.png`、`dist/assets/icons/26.png`、`dist/assets/portraits/15.webp`、`dist/assets/portraits/16.webp`、`dist/assets/portraits/17.webp`、`dist/assets/portraits/18.webp`、`dist/assets/portraits/19.webp`、`dist/assets/portraits/20.webp`、`dist/assets/portraits/21.webp`、`dist/assets/portraits/22.webp`、`dist/assets/portraits/23.webp`、`dist/assets/portraits/24.webp`、`dist/assets/portraits/new-sources.json`、`dist/combat-rules.js`、`dist/data.js`、`dist/details.js`、`dist/engine.js`、`dist/expansion-combat.js`、`dist/expansion-data.js`、`dist/expansion-frames.js`、`dist/expansion-render.js`、`dist/game.js`、`dist/growth.js`、`dist/index.html`、`dist/melee-motion.js`、`dist/render.js`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/free-pursuit.mjs`、`tests/gold-evolutions.mjs`、`tests/growth.mjs`、`tests/new-characters.mjs`、`tests/smoke.mjs`、`tests/v063.mjs`

## 0.9.1 · Rework new companion combat builds with ranged blades, transformations and status synergies

- SHA：`3f680881a4e1e71cdeb64b801a512443ae44d21a`
- 作者时间：2026-09-16T19:14:26+08:00
- 变动文件：`dist/animation-frames.js`、`dist/ascension-combat.js`、`dist/assets/animations/27.png`、`dist/combo.js`、`dist/engine.js`、`dist/expansion-combat.js`、`dist/expansion-data.js`、`dist/expansion-render.js`、`dist/game.js`、`dist/ground-effects.js`、`dist/index.html`、`dist/render.js`、`dist/trial.js`、`dist/ui.js`、`dist/white-frames.js`、`package.json`、`scripts/package-local.mjs`、`tests/ascension.mjs`、`tests/smoke.mjs`

## 0.9.2 · Bind summoned companion rewards and route mastered growth pools with ticket conversion

- SHA：`8db3b50a28a7625e44ec5912e10f499c2690d7f8`
- 作者时间：2026-09-16T19:28:19+08:00
- 变动文件：`dist/balance.js`、`dist/engine.js`、`dist/game.js`、`dist/growth.js`、`dist/index.html`、`dist/style.css`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/growth.mjs`、`tests/reward-pools.mjs`、`tests/v061.mjs`

## 0.9.3 · Empower Firefly aerial bombardment builds and label all gold cards with mechanic tags

- SHA：`9ff5b6a12894f1a55ad10bea06a8be5b5e59b880`
- 作者时间：2026-09-16T19:48:44+08:00
- 变动文件：`dist/ascension-combat.js`、`dist/details.js`、`dist/expansion-data.js`、`dist/firefly-combat.js`、`dist/game.js`、`dist/growth-tags.js`、`dist/growth.js`、`dist/index.html`、`dist/render.js`、`dist/style.css`、`dist/ui.js`、`package.json`、`scripts/package-local.mjs`、`tests/firefly-builds.mjs`

## 0.9.3 · Prepare public GitHub Pages release and AI handoff

- SHA：`d54782f09bf46d8806f62cd757765a57a43b6d60`
- 作者时间：2026-10-08T15:01:08+02:00
- 变动文件：`.github/workflows/pages.yml`、`AGENTS.md`、`README.md`、`docs/DEVLOG.md`、`docs/HANDOFF.md`、`vite.config.js`
