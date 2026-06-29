# AstrBot Live2D Desktop Pro

> 当前版本：`1.0.0`
> 基于 [lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop) 改造的 Live2D 桌面客户端 Pro 版。

这是一个面向 AstrBot 的 Live2D 桌面客户端改版。它继承了原项目的 Electron + Vue 3 桌面端、AstrBot WebSocket Bridge、Cubism 3/4 模型渲染、消息展示、桌面助手能力和模型管理能力，并在此基础上补充了更偏“桌宠/Live2DViewerEX 使用习惯”的模型导入、点击交互、表情测试和自回归体验。

> 注意：虽然仓库名里带有 `plugin`，但本仓库内容是桌面客户端，不是 AstrBot 后端插件本体。服务端仍需要配合 AstrBot Live2D 适配器使用。

## 这版新增了什么

对照原项目，本仓库目前重点新增或强化了这些能力：

| 方向 | 原项目能力 | Pro 版新增/强化 |
| --- | --- | --- |
| 仓库形态 | 完整开发源码、文档站、测试和构建脚本 | 从当前桌面端分发包整理出的干净运行源码快照，保留 `dist/`、`dist-electron/`、资源和打包配置 |
| 模型导入 | 以 `.model3.json` 模型目录为入口 | 导入入口支持选择模型文件夹或 Live2DViewerEX 风格 `.lpk` 文件 |
| LPK 兼容 | 不面向 `.lpk` 包 | 尝试解包/转换 `.lpk`，生成标准 `.model3.json` 模型目录后复用现有导入管线 |
| Live2DViewerEX 配置 | 不强调 EX 桌面交互语义 | 读取 EX 风格 `HitAreas`、`Motion`、`Expression` 等配置，尽量映射为可播放动作/表情 |
| 桌面点击交互 | 主要由 AstrBot 或模型能力触发表演 | 增加本地点击交互配置，可按 HitArea、头部/身体区域绑定动作、表情、优先级、冷却和淡入淡出 |
| 可视化配置 | 基础设置与模型管理 | 增加点击交互相关开关、区域配置、动作/表情选择和测试入口 |
| 表情测试 | 支持发现/触发表情 | 增强表情测试与点击测试流程，方便确认某个动作或表情是否真的能跑 |
| 表情自回归 | 表情可能保持在触发状态 | 支持 x 秒后自动回归默认表情或指定回归表情 |
| 回归手感 | 早期实现可能硬切参数 | 默认使用平滑过渡回归，减少表情“啪一下弹回去”的僵硬感 |
| 资源策略 | 原项目构建链会处理 SDK/依赖 | 本仓库不提交模型、Cubism Core、`node_modules/`、`win-unpacked/`、`app.asar` 或用户资源 |

## 功能概览

### 继承自原项目的基础能力

- Live2D 桌面模型渲染，面向 Cubism 3/4 的 `.model3.json` 模型。
- AstrBot WebSocket Bridge 连接，支持 token、资源地址、保持连接和自动重试。
- 文本、图片、音频、视频、Markdown、LaTeX 等富内容展示。
- 主窗口、欢迎页和设置窗口分离。
- 模型库导入、当前模型管理、模型预览、表情测试和模型配置维护。
- `.motion3.json`、`.exp3.json`、`.vtube.json`、`astrbot.live2d.profile.json` 的兼容发现。
- 历史消息、媒体资源、统计概览和本地 SQLite 存储。
- 桌面窗口感知、活动窗口识别、截图能力、游戏/全屏检测。
- 置顶、透明窗口、鼠标穿透、智能穿透和托盘控制。
- 录音输入、全局快捷键、音频播放等待和唇形同步分析。
- 配置导入导出、日志导出、缓存清理、数据占用查看。
- 浅色/深色主题、主题色提取和独立设置窗口钉住。

### Pro 版重点能力

#### 1. Live2DViewerEX `.lpk` 导入

模型导入入口支持两种来源：

- 标准 Live2D 模型文件夹。
- Live2DViewerEX 风格 `.lpk` 文件。

导入 `.lpk` 时，应用会尽量完成以下流程：

1. 识别并读取 `.lpk` 包。
2. 解包或解密常见 LPK 内容。
3. 查找模型入口、动作、表情、纹理和配置文件。
4. 转换为应用内部可识别的 `.model3.json` 模型目录。
5. 交给原有模型导入管线处理。

这意味着很多原本要求使用 Live2DViewerEX 打开的模型包，可以直接尝试导入到本客户端里。

#### 2. Live2DViewerEX 桌面交互兼容

Pro 版会尽量读取 EX 风格配置中的：

- `HitAreas`
- `Motion`
- `Expression`
- `Choices`
- 模型自带动作组和表情文件

当模型配置里存在点击区域时，应用会优先按 HitArea 触发对应动作；如果动作不可直接播放，会尝试从可用动作组中推断最接近的目标。若模型只有表情没有动作，则点击交互会退化为表情触发。

#### 3. 本地桌面点击交互

设置中可以启用桌面点击交互，并配置：

- 全局开关。
- HitArea 模式或头部/身体区域模式。
- 每个区域绑定的动作组、动作序号或表情。
- 动作优先级。
- 冷却时间。
- 表情淡入淡出时间。
- 是否显示点击提示。
- 没有命中 HitArea 时是否回退到头部/身体区域。

这部分的目标是接近 Live2DViewerEX 的桌宠点击体验：点不同区域，触发不同动作或表情。

#### 4. 测试管线

为了避免“配置了但不知道有没有生效”，Pro 版增加了测试入口：

- 点击某个表情可以直接测试触发。
- 点击某个动作可以直接测试播放。
- 点击交互配置可通过测试流程确认是否命中、是否有动作/表情输出。
- 测试结果会尽量给出失败原因，例如没有可执行表情、动作组不存在、HitArea 没有可用配置等。

#### 5. 表情自回归和平滑回归

表情和点击触发后可以配置自动回归：

- 是否启用自动回归。
- x 秒后回归。
- 回归到默认表情，或回归到指定表情。
- 新触发会刷新旧的回归计时。
- 默认回归过渡为平滑插值，避免表情参数瞬间归零造成僵硬感。

如果不指定回归表情，应用会把当前表情参数平滑滑回模型默认值；如果指定回归表情，则会切到指定表情并使用淡入淡出。

## 兼容边界

### Live2D 模型

- 只支持 Cubism 3/4 的 `.model3.json` 模型。
- 不支持 Cubism 2 的 `.model.json` 模型。
- 受 Cubism Core 版本影响，部分较新的 `.moc3` 可能无法加载。
- 模型动作与表情是否可播放，取决于模型资源本身是否包含有效 `.motion3.json` / `.exp3.json`。

### LPK / Live2DViewerEX

`.lpk` 兼容是尽力适配，不等同于完整复刻 Live2DViewerEX：

- 支持常见 LPK 包结构和 EX 风格桌面点击配置。
- 支持从 HitArea 映射动作或表情。
- 支持将可识别资源导入为普通模型目录。
- 不实现 Live2DViewerEX 的全部运行时语义。
- `VarFloats` 等更复杂的 EX 参数逻辑当前不处理。
- 如果 `.lpk` 使用特殊加密、特殊脚本或非标准资源组织，可能需要手动整理后再导入。

### 桌面点击交互

点击交互依赖模型实际提供的 HitArea、动作和表情：

- 模型没有交互动作时，应用无法凭空生成动作。
- 模型只有表情时，点击只能触发表情。
- HitArea 命名不规范时，可能需要在设置中手动绑定。
- 部分模型的动作适配 Live2DViewerEX，但未声明为标准 motion group，此时会尝试推断，但不保证 100% 命中。

## 快速开始

### 1. 安装依赖

需要 Node.js 18 或更高版本。Windows 下如果重建原生依赖失败，可能需要 Visual Studio Build Tools。

```bash
npm install
npm run rebuild
```

### 2. 启动

```bash
npm start
```

### 3. 连接 AstrBot

在设置页配置 AstrBot Live2D Bridge 地址和 token。服务端需要安装并启用适配器插件：

- [lxfight/astrbot_plugin_live2d_adapter](https://github.com/lxfight/astrbot_plugin_live2d_adapter)

### 4. 导入模型

在模型管理或注入模型入口选择：

- `模型文件夹`：导入包含 `.model3.json` 的标准模型目录。
- `LPK 文件`：导入 Live2DViewerEX 风格 `.lpk` 包。

导入完成后，进入表情测试或点击交互设置，确认模型动作与表情是否能正常触发。

### 5. 配置桌面点击

建议配置顺序：

1. 打开桌面点击交互开关。
2. 优先选择 HitArea 模式。
3. 对模型识别出的区域分别绑定动作或表情。
4. 设置冷却时间、淡入淡出、动作优先级。
5. 使用测试按钮确认效果。
6. 打开表情自动回归，并设置回归秒数。

## 打包

```bash
npm run package:dir
npm run package:win
npm run package:mac
npm run package:linux
```

打包配置只包含当前仓库中的运行代码和图标资源，不会把用户模型、`node_modules/`、`win-unpacked/`、`app.asar` 或 Live2D Cubism Core 打进去。

## 目录结构

```text
dist/              Renderer 构建产物、页面入口、前端资源
dist-electron/     Electron 主进程、preload 和平台 watcher 构建产物
resources/         应用图标资源
package.json       运行、重建原生依赖和打包配置
README.md          当前项目说明
NOTICE.md          来源与第三方运行时说明
LICENSE            MIT 许可
```

## 仓库形态说明

当前桌面文件夹中没有保留原始 `.vue` / `.ts` 源文件和 source map，所以本仓库采用“反打包源码/运行源码快照”形态：

- 保留可运行的 `dist/` 与 `dist-electron/`。
- 保留必要元数据和 Electron 打包配置。
- 不提交上游开发源码、测试、文档站或完整构建链。
- 不提交 Electron 完整打包产物。

如果只是运行、检查逻辑或继续基于当前桌面包维护，这种形态足够使用；如果要恢复完整工程化开发体验，需要重新整理 Vue/TS 源码结构。

## Live2D 资源策略

仓库有意排除了以下内容：

- `.model3.json`、`.moc3`、`.motion3.json`、`.exp3.json` 等模型资源。
- 模型纹理、动作、表情、物理和 pose 文件。
- `dist/lib/live2dcubismcore.min.js` 与 `public/lib/live2dcubismcore.min.js`。
- 用户导入模型目录和本地缓存。
- `win-unpacked/`、`app.asar`、安装包、便携包和 `node_modules/`。

这样做是为了避免提交体积过大、授权不清或属于用户私有资产的 L2D 文件。第三方模型、付费模型和 `.lpk` 包请只在你拥有合法授权的前提下使用。

## 和原项目的关系

- 原项目：[lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop)
- 本仓库：基于原项目桌面端能力继续改造的 Pro 分支/运行源码快照。
- 保留原项目 MIT 许可与来源说明。
- 不包含 Live2D Cubism SDK 本体；Cubism SDK 使用需遵守 Live2D 官方许可。

## 相关项目

- [AstrBot](https://github.com/AstrBotDevs/AstrBot)
- [lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop)
- [lxfight/astrbot_plugin_live2d_adapter](https://github.com/lxfight/astrbot_plugin_live2d_adapter)
- [Live2D Cubism SDK](https://www.live2d.com/download/cubism-sdk/)

## License

MIT。原项目版权与许可声明保留在 [LICENSE](./LICENSE) 和 [NOTICE.md](./NOTICE.md) 中。
