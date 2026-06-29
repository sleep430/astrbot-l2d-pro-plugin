# AstrBot Live2D Desktop Pro

> Version: `1.0.0`
> A Pro desktop-client fork based on [lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop).

This repository contains a desktop Live2D client, not an AstrBot backend plugin. The repository name still contains `plugin` for historical reasons, but the application should be used together with the AstrBot Live2D adapter on the AstrBot side.

## What Pro Adds

| Area | Upstream behavior | Pro behavior |
| --- | --- | --- |
| Model import | Standard `.model3.json` model folders | Adds a Live2DViewerEX-style `.lpk` import path |
| LPK compatibility | Not focused on `.lpk` packages | Attempts to unpack/convert `.lpk` packages into a standard `.model3.json` model folder |
| ViewerEX metadata | No ViewerEX desktop interaction mapping | Reads ViewerEX-style `HitAreas`, `Motion`, and `Expression` metadata when available |
| Desktop click interaction | Mainly driven by AstrBot-side performance events | Adds local click interaction settings for hit areas, motions, expressions, cooldown, priority, and fade timing |
| Visual settings | General app/model settings | Adds switches, action selectors, expression selectors, and test controls for click interaction |
| Expression test flow | Basic expression discovery/playback | Adds a more direct test path for expressions and click-triggered actions |
| Expression auto return | Expressions may stay active | Supports configurable auto-return after x seconds |
| Return feel | Can feel like a hard snap | Uses a smoother return transition by default |
| Repository shape | Full development source | Keeps full source code and the current runnable `dist/` / `dist-electron/` snapshot |

## Features

- Electron + Vue 3 desktop client for Live2D Cubism 3/4 `.model3.json` models.
- AstrBot WebSocket Bridge connection.
- Text, image, audio, video, Markdown, LaTeX, history, and local storage support.
- Model library import, current-model management, preview, expression testing, and model configuration.
- Live2DViewerEX-style `.lpk` import and hit-area click interaction compatibility.
- Local desktop click interaction configuration: area, motion, expression, cooldown, priority, fade in, and fade out.
- Configurable expression auto-return with smoother transition.
- Desktop helper behaviors such as always-on-top, passthrough modes, tray control, window watching, screenshot support, and fullscreen/game detection.

## Quick Start

Node.js 18 or newer is recommended. pnpm is preferred for development.

```bash
pnpm install
pnpm run rebuild
pnpm run dev
```

To run the included build snapshot:

```bash
npm install
npm run rebuild
npm start
```

Package commands:

```bash
npm run package:dir
npm run package:win
npm run package:mac
npm run package:linux
```

Original build scripts are also kept:

```bash
pnpm run build:dir
pnpm run build:win
pnpm run build:mac
pnpm run build:linux
```

## Model Import

Use the model manager or model injection entry to select either:

- `Model folder`: a standard model folder containing `.model3.json`.
- `LPK file`: a Live2DViewerEX-style `.lpk` package.

After importing, use expression testing or click interaction testing to confirm that the model's motions and expressions can actually play.

## Compatibility Boundaries

- Only Cubism 3/4 `.model3.json` models are supported.
- Cubism 2 `.model.json` models are not supported.
- `.lpk` compatibility is best-effort and is not a full reimplementation of Live2DViewerEX.
- Complex ViewerEX parameter logic such as `VarFloats` is intentionally not handled.
- If a model has no interaction motions, the app cannot invent them. If a model only has expressions, click interaction can only trigger expressions.
- Some newer `.moc3` files may still fail depending on the bundled Cubism Core version.

## Repository Layout

```text
src/               Renderer source code
electron/          Electron main/preload source code
scripts/           Build, Cubism download, icon, and helper scripts
tests/             Test suite
docs/              Documentation
docs-site/         Documentation site source
public/            Static assets
resources/         App icon resources
dist/              Current runnable renderer build snapshot
dist-electron/     Current runnable Electron build snapshot
package.json       Runtime, development, and packaging config
```

## Resource Policy

This repository does not commit user models, paid models, `.lpk` packages, `node_modules/`, `win-unpacked/`, `app.asar`, installers, or the Live2D Cubism Core binary. Use third-party or paid models only when you have the proper license.

## Related Projects

- [AstrBot](https://github.com/AstrBotDevs/AstrBot)
- [lxfight/astrbot-live2d-desktop](https://github.com/lxfight/astrbot-live2d-desktop)
- [lxfight/astrbot_plugin_live2d_adapter](https://github.com/lxfight/astrbot_plugin_live2d_adapter)
- [Live2D Cubism SDK](https://www.live2d.com/download/cubism-sdk/)

## License

MIT. Upstream copyright and license notices are retained in [LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md).
