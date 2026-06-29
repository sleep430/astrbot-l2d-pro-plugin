# AstrBot Live2D Desktop Pro

> 当前版本：`1.0.0`

这是一个从桌面端改版分发包中整理出来的干净源码化仓库，用于运行和继续维护 L2D Pro 版 AstrBot Live2D 桌面客户端。

本项目基于原开源项目 [lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop) 深度改造。原项目提供了 Electron + Vue 3 的 AstrBot Live2D 桌面端基础、WebSocket Bridge 协议、Cubism 运行时接入和模型管理能力；本仓库在此基础上保留并重构了桌面体验、连接状态、模型库、历史数据、桌面感知和高级设置等模块。

## 重要说明

当前桌面文件夹中没有保留原始 `.vue` / `.ts` 源文件和 source map，所以仓库采用“反打包源码”形态：保留可运行的 `dist/` 与 `dist-electron/` 代码、必要元数据和打包配置，不再提交上游开发源码、测试、文档站或 Electron 完整打包产物。

仓库不包含 Live2D 模型文件，不包含 `win-unpacked/`、`app.asar`、`node_modules/`、exe、DLL，也不提交 Live2D Cubism Core 运行时文件。用户导入的模型、纹理、动作、表情和 SDK/Core 文件都应保留在本机或由应用按需下载。

## 主要能力

- Live2D 桌面模型渲染，面向 Cubism 3/4 的 `.model3.json` 模型。
- AstrBot WebSocket Bridge 连接，支持 token、资源地址、保持连接和自动重试。
- 文本、图片、音频、视频、Markdown、LaTeX 等富内容展示。
- 主窗口、欢迎页和设置窗口分离，设置页覆盖连接、模型、历史和高级管理。
- 模型库导入、当前模型管理、表情测试、模型预览和模型配置维护。
- 表情与动作能力发现，兼容 `.vtube.json`、`.motion3.json`、`.exp3.json` 和 `astrbot.live2d.profile.json`。
- 历史消息、媒体资源、统计概览和本地 SQLite 存储。
- 桌面窗口感知、活动窗口识别、截图能力、游戏/全屏检测。
- 置顶、透明窗口、鼠标穿透、智能穿透和托盘控制。
- 录音输入、全局快捷键、音频播放等待和唇形同步分析。
- 配置导入导出、日志导出、缓存清理、数据占用查看。
- 浅色/深色主题、主题色提取和独立设置窗口钉住。

## 相比原项目的整理差异

- 版本重新归零为 `1.0.0`，作为 L2D Pro 重构版的起点。
- README 改为描述当前改版的真实结构和功能边界。
- 仓库从上游完整开发源码切换为干净运行源码快照，只保留当前桌面包实际使用的构建代码。
- 删除上游测试、文档站、源码开发脚本和旧发布说明，避免和当前改版不一致。
- 明确排除 Live2D 模型、Cubism Core、Electron 打包目录和依赖目录，保证仓库干净。
- 包元数据、仓库链接和发布配置改为 `sleep430/astrbot-live2d-desktop`。

## 目录结构

```text
dist/              Renderer 构建产物、页面入口、前端资源
dist-electron/     Electron 主进程、preload 和平台 watcher 构建产物
resources/         应用图标资源
package.json       运行、重建原生依赖和打包配置
README.md          当前项目说明
NOTICE.md          来源与第三方运行时说明
```

## 运行

需要 Node.js 18 或更高版本。Windows 下如需重建原生依赖，可能需要 Visual Studio Build Tools。

```bash
npm install
npm run rebuild
npm start
```

如果只需要阅读代码或检查结构，不需要安装依赖。

## 打包

```bash
npm run package:dir
npm run package:win
```

打包配置只包含当前仓库中的运行代码和图标资源，不会把用户模型、`node_modules/`、`win-unpacked/` 或 Live2D Cubism Core 打进去。

## Live2D 资源策略

仓库有意排除了以下内容：

- `.model3.json`、`.moc3`、`.motion3.json`、`.exp3.json` 等模型资源。
- 模型纹理、动作、表情、物理和 pose 文件。
- `dist/lib/live2dcubismcore.min.js` 与 `public/lib/live2dcubismcore.min.js`。
- 用户导入模型目录和本地缓存。

这样做是为了避免提交体积过大、授权不清或属于用户私有资产的 L2D 文件。应用运行时需要的 Cubism Core 应由用户按提示下载或手动放置到本机环境。

## 相关项目

- 原项目：[lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop)
- AstrBot：[AstrBotDevs/AstrBot](https://github.com/AstrBotDevs/AstrBot)
- 适配器插件：[lxfight/astrbot_plugin_live2d_adapter](https://github.com/lxfight/astrbot_plugin_live2d_adapter)
- Live2D Cubism SDK：[Live2D 官方下载页](https://www.live2d.com/download/cubism-sdk/)

## License

MIT。原项目版权与许可声明保留在 [LICENSE](./LICENSE) 和 [NOTICE.md](./NOTICE.md) 中。
