# 构建、发布与恢复

仓库：https://github.com/emberboygame/astral-trail-game

公开游戏：https://emberboygame.github.io/astral-trail-game/

## GitHub Pages

工作流 .github/workflows/pages.yml 在 main push 或 workflow_dispatch 时运行。构建阶段：checkout → Node 20 → npm ci → npm test → npm run build → configure-pages → 上传 build；部署阶段使用 deploy-pages。权限为 contents:read、pages:write、id-token:write，环境 github-pages。

Vite base='./' 适配仓库子路径；root='dist'，outDir='../build'。Pages 应选择 **GitHub Actions** 作为 Source，不是直接发布源码分支的 dist 目录。不要把同名 Sites 在线地址当作 GitHub Pages 已更新的证据，它们是独立发布目标。

## 正常发布

1. 拉取远端最新 main，查看 git diff，运行测试、构建、文档 --check。
2. 玩法发布同步所有版本字符串；纯文档发布保持游戏版本。
3. 提交源码、资源、锁文件、文档；不提交 build/node_modules/release。
4. 推送后等待 Actions build 和 deploy 两个阶段成功。
5. 打开公开 URL，检查版本标识、模块/图片无 404、能移动和进入战斗；需要时无缓存刷新。
6. 在 DEVLOG 记录提交/工作流及实际验收范围。不能只看到 push 成功就称上线完成。

Actions 当前没有单独执行文档 --check，它由开发者本地执行；若要设为 CI 门槛，应另加工作流步骤。

## 离线单文件

npm run build:local 使用 vite.local.config.js 将大资源内嵌，再由 scripts/package-local.mjs 把 JS/CSS/favicon 合入 release/Startrail-v0.9.3.html。这个脚本会检查残余 assets 链接。用浏览器直接打开生成 HTML，再核对 UI 版本、召唤、立绘、换图；不能用在线页面替代离线包验收。

后续升级文件名当前要手工改打包脚本。ZIP 不是此命令的输出；需要压缩时在成功生成 HTML 后另行打包。

## 别人打不开时的检查顺序

先让对方确认完整 Pages URL 与路径，尝试其他浏览器/网络；检查仓库 Pages 和 Actions 是否部署成功，静态资源是否 404、被缓存或被网络阻断。能加载但黑屏时看浏览器控制台、WebGL2 和资源请求。GitHub Pages 不需要访问者登录本项目账号，但地区网络和浏览器兼容性不能由发布成功保证。

首次 Pages 配置失败不一定是源码错误；检查 Pages Source、Actions 权限、github-pages 环境部署权限。不要向公开文档/日志粘贴令牌。

## 回滚

优先 git revert 有问题的发布提交并推 main，让同一工作流重新部署。确认当前远端 head 后操作，保留他人提交；不强推回旧 head。原始本地 Sites SHA 未导入 GitHub 祖先链，不能直接用 HISTORY 中旧 SHA 当远端可回滚版本。

首次已验证 Pages 发布记录为工作流 37785766191 的 attempt 2；它是源码快照发布事实，不是所有后续推送都成功的保证。
