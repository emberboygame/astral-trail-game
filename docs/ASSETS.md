# 资源、动画与渲染

## 主渲染路径

Renderer 检测 WebGL2：可用时 Three.js WebGLRenderer，正交相机、立体地形/建筑/树木、方向光和阴影；不可用时 SoftwareRenderer 兼容绘制。兼容路径并不保证所有实时阴影、材质、后期效果和硬件路径相同。当前为 3D 场景 + 像素朝向相机的角色平面 + Canvas 特效，不是全角色立体骨骼模型。

地面效果、角色/冰块/票券、屏幕叠加技能由不同绘制层完成。检查遮挡需同时看 ground-effects、render、gold-render、expansion-render；不要靠增加全局 z 值处理所有覆盖问题。

角色贴图 SRGBColorSpace、NearestFilter、关闭 mipmap。角色材质为 MeshBasicMaterial、toneMapped:false、fog:false，避免受强光色调映射洗白；默认色乘 #e6e6e6，冻结/受击/敌种可能另改颜色。环境本身仍使用 ACESFilmic 和灯光，不能把环境材质直接套给角色。

## 图集与脚底

assets/animations/<id>.png 通过 Vite import.meta.glob 装入；旧 atlas.png 是回退。标准动画图尺寸按 512×768、4 方向×6 动作行读取，实际帧矩形由 animation-frames.js 给出，不是简单等分全部角色。

方向列为下、左、右、上；行 0 待机，行 1/2/3 循环行走，行 4/5 攻击。actorFrame 在施法中使用锁定 attackDir，走路不能抢占技能帧。每个帧有 x/y/w/h/anchorX/anchorY，绘制以脚底定位；三月七和黑塔曾因切片不齐发生抽搐。不能更换图后继续沿用旧矩形。

expansion-frames.js 合入新角色/宠物，white-frames.js 提供黄泉白发形态；27 为相关变身动画资源，不是新增招募角色。宠物 25/26 也不在 CHARS 招募池中。

替换资源后至少检查四方向、待机/行走/攻击、连续移动施法、脚底跳动、裁到邻帧、变身返回、缩放和透明边缘。Node 矩形边界断言无法验证画面是否自然。

## 头像和立绘

details.js 以角色 ID 在 assets/portraits 中读取 png/webp；UI 像素头像来自图集/图标。不要把生成像素形象与 Wiki 原版立绘混称成同一来源。离线构建会内嵌资源，网页源码仍按静态文件加载。

已保存的素材来源元数据：[扩展动画生成记录](../dist/assets/animations/expansion-art-sources.json)、[原有立绘来源](../dist/assets/portraits/sources.json)、[新增立绘来源](../dist/assets/portraits/new-sources.json)。来源记录中的旧本地 path 是制作时的位置，不是网页运行依赖。现有记录不足以证明所有旧素材都具有完整逐项来源、授权或可再分发许可；缺项需后续补齐，不要编造下载日期、作者或授权条款。

## 音频与资源故障

没有独立背景音乐文件不代表没有音效。UI.audio 使用 WebAudio Oscillator 合成短音，需用户启用声音并满足浏览器交互策略。

加载失败先查看 Network：图集、模块或 CSS 是否 404，是否误用根绝对路径。再看控制台与 canvas 的 data-renderer（webgl / software-3d）。硬件路径材质异常和兼容路径绘制异常要分别复现；不能只在无 WebGL 测试环境看过就宣称所有显卡已验证。
