var vy = Object.defineProperty;
var wy = (e, t, r) => t in e ? vy(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var _e = (e, t, r) => wy(e, typeof t != "symbol" ? t + "" : t, r);
import Or, { app as Pe, screen as Lr, BrowserWindow as Qe, safeStorage as an, desktopCapturer as Bl, ipcMain as le, nativeImage as ss, Tray as Ey, Menu as _y, globalShortcut as ci, protocol as Ts, dialog as Ot, net as xc, shell as Nc, powerMonitor as xi } from "electron";
import Q from "path";
import er, { fileURLToPath as Cs, pathToFileURL as Oc } from "url";
import Te from "fs";
import { createRequire as Lc } from "module";
import ql from "better-sqlite3";
import _t, { createHash as np } from "crypto";
import nt from "node:fs";
import ke from "node:path";
import Sy from "node:util";
import Rs, { EventEmitter as ip } from "events";
import Fc from "https";
import hi from "http";
import by from "net";
import Ty from "tls";
import qt from "stream";
import kc from "zlib";
import Cy from "buffer";
import Kt from "node:fs/promises";
import Ry from "constants";
import Uc from "util";
import sp from "assert";
import As from "child_process";
import op from "tty";
import Ps from "os";
import { spawn as Ay } from "node:child_process";
import Yt from "fs/promises";
const Py = "lxfight <1686540385@qq.com>", Iy = { protocol: { version: "1.0.0" }, storage: { userConfig: { userId: "user_id", userName: "user_name", autoUpdateEnabled: "app_auto_update_enabled", screenshotDefaultTarget: "desktop_capture_default_target", screenshotQuality: "desktop_capture_quality", screenshotMaxWidth: "desktop_capture_max_width", connectionSettingsV3: "connection_settings_v3", connectionBehaviorSettingsV1: "connection_behavior_settings_v1", alwaysOnTop: "tray_always_on_top", fullPassThrough: "tray_pass_through_mode", dynamicPassThrough: "desktop_dynamic_pass_through", autoDetectFullscreen: "tray_game_mode" } } }, Dy = { appId: "com.astrbot.live2d.desktop" }, fs = {
  author: Py,
  desktopMetadata: Iy,
  build: Dy
};
function xy(e) {
  const [t] = e.split("<");
  return t.trim();
}
const Ny = {
  appId: fs.build.appId,
  authorName: xy(fs.author)
}, Wl = fs.desktopMetadata.protocol.version, Rt = fs.desktopMetadata.storage.userConfig;
function Oy() {
  return process.platform === "win32" ? ["icon.ico", "icon.png"] : process.platform === "darwin" ? ["icon.icns", "icon.png"] : ["icon.png", "icon.ico"];
}
function Zs(e, t) {
  for (const r of t) {
    const n = Q.join(e, r);
    if (Te.existsSync(n)) return n;
  }
  return null;
}
function Is() {
  const e = Oy();
  if (Pe.isPackaged) {
    const n = process.resourcesPath, i = Zs(n, e);
    if (i) return i;
    const o = Q.join(Pe.getAppPath(), "resources"), s = Zs(o, e);
    return s || Q.join(n, e[0]);
  }
  const t = Q.join(process.cwd(), "resources"), r = Zs(t, e);
  return r || Q.join(t, e[0]);
}
function Ly() {
  if (process.platform !== "linux") return "n/a";
  const e = String(process.env.XDG_SESSION_TYPE || "").trim().toLowerCase();
  return e === "x11" || e === "wayland" ? e : process.env.WAYLAND_DISPLAY ? "wayland" : process.env.DISPLAY ? "x11" : "unknown";
}
function Fy(e, t) {
  return e === "win32" ? process.arch === "arm64" ? {
    supported: !1,
    mode: "disabled",
    reason: "Windows ARM64 暂不支持稳定的原生全屏窗口检测"
  } : {
    supported: !0,
    mode: "native-window-manager"
  } : e === "darwin" ? {
    supported: !0,
    mode: "active-window-heuristic"
  } : e === "linux" ? t === "wayland" ? {
    supported: !1,
    mode: "disabled",
    reason: "Wayland 会话下无法稳定获取活跃窗口边界"
  } : {
    supported: !0,
    mode: "active-window-heuristic"
  } : {
    supported: !1,
    mode: "disabled",
    reason: "当前平台未实现自动检测全屏应用"
  };
}
const Hl = Ly(), Ni = process.platform, ky = {
  platform: Ni,
  linuxSessionType: Hl,
  mousePassthroughForward: Ni !== "linux",
  alwaysOnTopLevel: Ni === "darwin" ? "screen-saver" : "default",
  gameMode: Fy(Ni, Hl)
};
function Mc() {
  return ky;
}
const Uy = Lc(import.meta.url);
let eo = null, jl = !1;
function My() {
  const e = process.platform, t = process.arch, r = `napi-6-${e}-unknown-${t}`, n = "node-active-win.node", i = Pe.getAppPath(), o = i.replace("app.asar", "app.asar.unpacked"), s = [
    // 打包后（ASAR 解包目录）
    Q.join(o, "node_modules", "active-win", "lib", "binding", r, n),
    // 开发模式（项目根目录下）
    Q.join(i, "node_modules", "active-win", "lib", "binding", r, n)
  ];
  for (const a of s)
    try {
      if (Te.existsSync(a)) return a;
    } catch {
    }
  return null;
}
function $y() {
  if (jl) return eo;
  jl = !0;
  const e = My();
  if (!e)
    return console.warn("[active-win] native binding 未找到，窗口检测不可用"), null;
  try {
    eo = Uy(e), console.log("[active-win] native binding 加载成功:", e);
  } catch (t) {
    console.warn("[active-win] native binding 加载失败:", t);
  }
  return eo;
}
async function By() {
  const e = $y();
  if (e != null && e.getActiveWindow)
    try {
      return e.getActiveWindow();
    } catch {
      return;
    }
}
async function ap() {
  try {
    return await By() ?? null;
  } catch {
    return null;
  }
}
const qy = Lc(import.meta.url), Ir = Mc();
let li = !1, os = null, Zr = !1, Oi = null, Gl = !1, Ut = null;
const Wy = /* @__PURE__ */ new Set([
  "qq",
  "腾讯qq",
  "wechat",
  "weixin",
  "微信",
  "tim"
]), Hy = [
  "qq.exe",
  "wechat.exe",
  "weixin.exe",
  "tim.exe"
], jy = [
  "截图工具覆盖",
  "Snipping Tool",
  "Snip & Sketch",
  "Screenshot",
  "QQ Screenshot",
  "Xbox Game Bar",
  "NVIDIA GeForce Overlay",
  "GameViewer",
  "Windows 默认锁屏界面",
  "锁屏",
  "Lock Screen",
  "LockApp",
  "ScreenClippingHost",
  "screen clipping"
];
function hs(e) {
  return String(e || "").trim().toLowerCase();
}
function Gy(e, t, r, n, i) {
  const o = hs(e).replace(/\s+/g, "");
  if (!Wy.has(o))
    return !1;
  const s = hs(t);
  if (s && !Hy.some((u) => s.includes(u)))
    return !1;
  const a = Math.abs(r.x) <= 2 && Math.abs(r.y) <= 2, c = Math.abs(r.width - n) <= 2 && Math.abs(r.height - i) <= 2;
  return a && c;
}
function cp(e) {
  const t = hs(e);
  return jy.some((r) => {
    const n = hs(r);
    return t === n || t.includes(n);
  });
}
function lp() {
  if (Ir.platform !== "win32") return null;
  if (Oi) return Oi;
  try {
    const { windowManager: e } = qy("node-window-manager");
    return Oi = e, Oi;
  } catch (e) {
    return console.error("[自动检测全屏] 初始化窗口管理器失败:", e), null;
  }
}
function zy() {
  try {
    const e = mr();
    if (!e) return !1;
    const t = lp();
    if (!t) return !1;
    const r = Lr.getPrimaryDisplay(), n = r.bounds.width, i = r.bounds.height, o = t.getActiveWindow();
    if (!o)
      return !1;
    const s = o.getTitle(), a = String(o.path || "");
    if (s === "Program Manager" || s === "" || s === "Windows Shell Experience Host" || cp(s))
      return !1;
    const c = e.getTitle();
    if (s.includes(c) || s.includes("DevTools"))
      return !1;
    const u = o.getBounds(), l = u.width >= n - 20 && u.height >= i - 20 && u.x <= 10 && u.y <= 10;
    return l && Gy(s, a, u, n, i) ? (console.log("[自动检测全屏] 忽略聊天软件截图覆盖层:", {
      title: s,
      processPath: a,
      bounds: u
    }), !1) : l ? (console.log("[自动检测全屏] 检测到全屏应用:", {
      title: s,
      bounds: u,
      screen: { width: n, height: i }
    }), !0) : !1;
  } catch (e) {
    return console.error("[自动检测全屏] 检测失败:", e), !1;
  }
}
async function Vy() {
  try {
    const e = mr();
    if (!e) return !1;
    const t = await ap();
    if (!(t != null && t.bounds)) return !1;
    const r = String(t.title || "").trim();
    if (!r || cp(r)) return !1;
    const n = e.getTitle();
    if (r.includes(n) || r.includes("DevTools")) return !1;
    const i = t.bounds, o = {
      x: Math.round(i.x + i.width / 2),
      y: Math.round(i.y + i.height / 2)
    }, a = Lr.getDisplayNearestPoint(o).bounds, c = Math.abs(i.x - a.x) <= 16 && Math.abs(i.y - a.y) <= 16, u = Math.abs(i.width - a.width) <= 32 && Math.abs(i.height - a.height) <= 32;
    return c && u;
  } catch (e) {
    return console.error("[自动检测全屏] 活跃窗口检测失败:", e), !1;
  }
}
async function Yy() {
  return Ir.gameMode.supported ? Ir.gameMode.mode === "native-window-manager" ? zy() : Vy() : (!Gl && Ir.gameMode.reason && (console.warn(`[自动检测全屏] 当前平台不支持: ${Ir.gameMode.reason}`), Gl = !0), !1);
}
async function zl() {
  if (!li || !mr()) return;
  const t = await Yy();
  t && !Zr ? (console.log("[自动检测全屏] 检测到全屏应用，隐藏模型"), Zr = !0, Ut == null || Ut(!0)) : !t && Zr && (console.log("[自动检测全屏] 全屏应用已退出，显示模型"), Zr = !1, Ut == null || Ut(!1));
}
function Ky() {
  li || Ir.gameMode.supported && (console.log("[自动检测全屏] 已启用"), li = !0, Ir.gameMode.mode === "native-window-manager" && lp(), zl(), os = setInterval(() => {
    zl();
  }, 2e3));
}
function Vl() {
  li && (console.log("[自动检测全屏] 已禁用"), li = !1, os && (clearInterval(os), os = null), Zr && (Zr = !1, Ut == null || Ut(!1)));
}
function Xy(e) {
  Ut = e;
}
function up(e) {
  switch (String(e || "").trim().toLowerCase()) {
    case "incoming":
    case "output":
      return "incoming";
    case "outgoing":
    case "input":
      return "outgoing";
    default:
      return null;
  }
}
const Jy = 3;
function Qy(e) {
  return String(e || "").trim().replace(/\s+/g, " ");
}
function Zy(e) {
  return e.replace(/"/g, '""');
}
function ev(e) {
  const t = Qy(e);
  return t ? t.length >= Jy ? {
    clause: " AND id IN (SELECT rowid FROM messages_fts WHERE messages_fts MATCH ?)",
    params: [`"${Zy(t)}"`]
  } : {
    clause: " AND raw_text LIKE ?",
    params: [`%${t}%`]
  } : { clause: "", params: [] };
}
function tv(e) {
  const t = Q.dirname(e);
  return Q.join(t, "build", "Release", "better_sqlite3.node").replace(/([\\/])app\.asar([\\/])/, "$1app.asar.unpacked$2");
}
let to = null, Li = null, Yl = !1;
function rv(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t ? ke.resolve(t) : null;
}
function nv() {
  return to || (to = ke.resolve(Pe.getPath("userData"))), to;
}
function iv(e) {
  const t = ke.resolve(e.originalUserDataPath), r = rv(e.portableExecutableDir), n = e.isPackaged ? r || (e.hasPortableMarker ? ke.dirname(ke.resolve(e.exePath)) : null) : null, i = e.isPackaged ? n ? "portable" : "installed" : "development";
  return {
    mode: i,
    isPortable: i === "portable",
    portableBaseDir: n,
    originalUserDataPath: t,
    resolvedUserDataPath: i === "portable" ? ke.join(n, "data") : t
  };
}
function $c() {
  if (Li)
    return Li;
  const e = Pe.getPath("exe"), t = ke.dirname(e);
  return Li = iv({
    isPackaged: Pe.isPackaged,
    originalUserDataPath: nv(),
    exePath: e,
    portableExecutableDir: process.env.PORTABLE_EXECUTABLE_DIR,
    hasPortableMarker: nt.existsSync(ke.join(t, "portable.txt"))
  }), Li;
}
function sv() {
  const e = $c();
  return Yl || !e.isPortable || (nt.mkdirSync(e.resolvedUserDataPath, { recursive: !0 }), Pe.setPath("userData", e.resolvedUserDataPath), Pe.setPath("sessionData", e.resolvedUserDataPath), Yl = !0), e;
}
function ov() {
  return $c().resolvedUserDataPath;
}
function pi() {
  return ov();
}
const av = {
  // Main window — empty state
  "main.empty.title": "欢迎使用 AstrBot Live2D",
  "main.empty.subtitle": "还没有导入模型，请先导入一个 Live2D 模型",
  "main.empty.import": "导入模型",
  "main.empty.settings": "或者在设置中管理模型",
  // Main window — status toasts
  "main.status.connected": "已连接到服务器",
  "main.status.disconnected": "已断开连接",
  "main.status.suspended": "系统挂起，连接已暂停",
  "main.status.modelLoaded": "模型加载成功",
  "main.status.modelImportSuccess": "模型导入成功",
  "main.status.modelLoadFailed": "模型加载失败: {message}",
  "main.status.modelImportFailed": "导入模型失败: {message}",
  "main.status.canvasNotMounted": "Live2D 画布组件未挂载，无法加载模型",
  "main.status.modelInfoParseFailed": "解析模型资源失败",
  "main.status.connectionError": "连接错误: {message}",
  // Main window — retry
  "main.retry.hint": "连接已断开，{seconds} 秒后自动重试（第 {attempt} 次）",
  "main.retry.waiting": "连接已断开，等待自动重试",
  // Main window — recording
  "main.recording.indicator": "正在录音... {duration}s",
  "main.recording.hintShortcut": "再次按下快捷键停止",
  "main.recording.hintManual": "点击麦克风按钮停止",
  "main.recording.short": "录音时间太短",
  "main.recording.notConnected": "未连接到服务器",
  "main.recording.failed": "录音失败: {message}",
  "main.recording.notSupported": "您的浏览器不支持录音功能",
  "main.recording.sendFailed": "发送失败: {message}",
  "main.recording.stopFailed": "停止录音失败: {message}",
  "main.recording.sending": "正在发送语音...",
  "main.recording.sent": "语音已发送",
  "main.recording.voiceMessage": "[语音消息]",
  // Main window — input
  "main.input.placeholder": "输入消息... (Ctrl+V 粘贴)",
  "main.input.send": "发送",
  "main.input.sendImage": "发送图片",
  "main.input.holdToRecord": "按住录音",
  "main.input.clickToRecord": "点击录音",
  "main.input.clickToStop": "点击停止",
  "main.input.sendingFailed": "发送失败: {message}",
  "main.input.sent": "消息已发送",
  "main.input.imageTooLarge": "图片大小不能超过 {max}MB",
  "main.input.processingImage": "正在处理图片...",
  "main.input.notConnected": "未连接到服务器",
  // Main window — model
  "main.model.folderFailed": "选择文件夹失败: {message}",
  "main.model.multiFileDetected": "检测到多个模型文件，已自动选择：{file}",
  "main.model.compatibilityWarning": "模型存在兼容或可降级资源告警：{warnings}",
  // Main window — platform
  "main.platform.waylandWarning": "当前为 Linux Wayland 会话：智能穿透与自动检测全屏应用不可用。",
  "main.platform.linuxWarning": "当前为 Linux 会话：智能穿透不可用，自动更新需手动下载。",
  // Main window — misc
  "main.defaultUserName": "桌面用户",
  "main.imageAlt": "AstrBot 消息图片",
  "main.performSequence": "[表演序列]",
  "main.serverUser": "服务器",
  // Radial menu
  "menu.history": "历史",
  "menu.settings": "设置",
  "menu.talk": "对话",
  "menu.resetPosition": "重置位置",
  "menu.expressionTest": "测试表情",
  // Expression tester
  "expressionTester.title": "表情测试",
  "expressionTester.empty": "当前模型没有可用的表情",
  "expressionTester.other": "其他",
  // Settings menu
  "settings.menu.connection": "连接",
  "settings.menu.connection.bridge": "Bridge 连接",
  "settings.menu.connection.workspace": "工作区状态",
  "settings.menu.model": "模型",
  "settings.menu.model.current": "当前模型",
  "settings.menu.model.library": "模型库",
  "settings.menu.history": "历史",
  "settings.menu.history.messages": "消息列表",
  "settings.menu.history.statistics": "统计概览",
  "settings.menu.advanced": "高级",
  "settings.menu.advanced.behavior": "行为配置",
  "settings.menu.advanced.shortcut": "快捷键",
  "settings.menu.advanced.windowWatcher": "窗口监听",
  "settings.menu.advanced.tracking": "鼠标追踪",
  "settings.menu.advanced.pipeline-test": "管线测试",
  "settings.menu.advanced.data": "数据管理",
  "settings.menu.about": "关于",
  "settings.menu.about.info": "关于",
  // Settings titlebar
  "settings.titlebar.title": "设置",
  "settings.titlebar.minimize": "最小化",
  "settings.titlebar.maximize": "最大化",
  "settings.titlebar.restore": "还原",
  "settings.titlebar.close": "关闭",
  "settings.titlebar.pin": "固定窗口",
  "settings.titlebar.unpin": "取消固定",
  // Welcome window
  "welcome.greeting": "初次见面，请多关照～",
  "welcome.subtitle": "我将作为你的专属桌宠，长伴你左右...",
  "welcome.formTitle": "该怎么称呼你呢？",
  "welcome.formHint": "告诉我你的昵称，开启旅程 ✦",
  "welcome.placeholder": "在此输入昵称...",
  "welcome.submit": "开始我们的旅程",
  "welcome.submitting": "正在为你准备小窝...",
  "welcome.error": "呜呜，设置失败了，请稍后再试～",
  "welcome.enterHint": "按下 Enter 键也可以继续哦",
  "welcome.close": "关闭",
  // Media player
  "media.close": "关闭",
  "media.imageAlt": "表演图片",
  "media.clickToClose": "点击空白区域也可关闭",
  "media.audioLoadFailed": "音频资源加载失败",
  "media.audioLoadAborted": "音频资源加载被中止",
  "media.audioLoadTimeout": "音频资源加载超时 ({ms}ms)",
  "media.audioUrlInvalid": "音频资源地址不可用",
  // Expression types
  "expression.group.basic": "基础",
  "expression.group.emotion": "情绪",
  "expression.group.state": "状态",
  "expression.group.effect": "效果",
  "expression.neutral": "中性",
  "expression.happy": "开心",
  "expression.sad": "难过",
  "expression.angry": "生气",
  "expression.surprised": "惊讶",
  "expression.thinking": "思考/困惑",
  "expression.tired": "疲惫/困倦",
  "expression.disgusted": "厌恶/嫌弃",
  "expression.playful": "俏皮",
  "expression.special": "特殊效果",
  "expression.anxious": "紧张/害怕",
  "expression.blush": "脸红/害羞",
  "expression.sweat": "流汗",
  "expression.speaking": "说话",
  // Bridge validation
  "validation.urlRequired": "服务器地址不能为空",
  "validation.urlInvalid": "服务器地址格式无效，请填写完整的 WebSocket 地址",
  "validation.urlProtocol": "服务器地址必须使用 ws 或 wss 协议",
  "validation.tokenRequired": "认证密钥不能为空，请在设置中填写后再连接",
  // Toasts — Connection
  "toast.connectionSaved": "连接配置已保存",
  "toast.connectionSaveFailed": "保存失败: {error}",
  "toast.connectRequested": "连接请求已提交",
  "toast.connectFailed": "连接失败: {error}",
  "toast.disconnected": "已断开连接",
  "toast.disconnectFailed": "断开失败: {error}",
  "toast.connectionConfigStale": "连接配置已被其他窗口更新，已自动同步最新配置",
  // Toasts — Model
  "toast.modelImported": "模型导入成功",
  "toast.modelDeleted": "模型已删除",
  "toast.modelLoadSent": "模型加载指令已发送，实际结果以主窗口提示为准",
  "toast.modelLoadFailed": "模型加载指令发送失败: {error}",
  "toast.modelReloadSent": "模型已删除，当前模型已重新加载",
  "toast.modelDeleteFailed": "删除失败: {error}",
  "toast.modelListFailed": "加载模型列表失败",
  "toast.modelExpressionReadFailed": "读取表情类型失败",
  // Toasts — Expression
  "toast.expressionSaved": "表情类型已保存，正在重新加载当前模型",
  "toast.expressionSaveFailed": "保存表情类型失败: {error}",
  // Toasts — Shortcut
  "toast.shortcutRegistered": "快捷键注册成功",
  "toast.shortcutRegisterFailed": "注册失败: {error}",
  "toast.shortcutCleared": "快捷键已清除",
  "toast.shortcutNotSet": "请先设置快捷键",
  // Toasts — Watcher
  "toast.watcherConfigSaved": "窗口监听配置已保存",
  "toast.watcherConfigSaveFailed": "保存失败: {error}",
  "toast.watcherConfigReset": "窗口监听配置已重置",
  "toast.watcherConfigResetFailed": "重置失败: {error}",
  // Toasts — History
  "toast.historyCleared": "历史记录已清空",
  "toast.historyClearFailed": "清空失败: {error}",
  "toast.historyLoadedFailed": "加载历史记录失败",
  "toast.historyStatsFailed": "加载统计数据失败",
  "toast.fileResourceUnavailable": "文件资源不可用",
  "toast.fileOpenFailed": "打开文件失败: {error}",
  "toast.fileDownloadFailed": "下载文件失败: {error}",
  "toast.fileSaved": "文件已开始保存",
  "toast.historyRefreshed": "已刷新",
  // Toasts — Maintenance
  "toast.logDirOpened": "已打开日志目录: {path}",
  "toast.logDirOpenFailed": "打开日志目录失败: {error}",
  "toast.logExported": "已导出 {count} 个日志文件: {path}",
  "toast.logExportFailed": "导出日志失败: {error}",
  "toast.cacheCleared": "缓存已清除",
  "toast.settingsReset": "设置已重置",
  "toast.settingsResetFailed": "重置失败: {error}",
  "toast.cubismCoreDownloadSuccess": "Live2D SDK 下载成功",
  "toast.cubismCoreDownloadFailed": "Live2D SDK 下载失败: {error}",
  "toast.cubismCoreAlreadyExists": "Live2D SDK 已存在，无需下载",
  // Toasts — About/Update
  "toast.aboutSaveFailed": "保存失败: {error}",
  "toast.updateCheckFailed": "检查更新失败: {error}",
  "toast.updateInstallFailed": "安装更新失败: {error}",
  // Dialogs — generic
  "dialog.confirm": "确定",
  "dialog.cancel": "取消",
  "dialog.retry": "重试",
  // Settings — About
  "settings.about.title": "关于",
  "settings.about.appName": "应用名称",
  "settings.about.version": "版本",
  "settings.about.updateStatus": "更新状态",
  "settings.about.autoCheckUpdate": "自动检查更新",
  "settings.about.author": "作者",
  "settings.about.language": "语言",
  "settings.about.relatedProjects": "相关项目",
  "settings.about.projectRepo": "本项目仓库",
  "settings.about.adapterPlugin": "平台适配器插件",
  "settings.about.enabled": "已启用",
  "settings.about.disabled": "已关闭",
  "settings.about.autoCheckDesc": "启用后，每次启动时会自动检查是否有新版本。关闭后不会在启动时自动检查更新，但仍可手动检查。",
  "settings.about.checkUpdate": "检查更新",
  "settings.about.restartAndInstall": "重启并安装",
  "settings.about.poweredBy": "Powered by Live2D",
  // Settings — About (extra)
  "settings.about.updateStatusUnknown": "更新状态未知",
  // Settings — Connection bridge
  "settings.connection.bridge.serverUrl": "服务器地址",
  "settings.connection.bridge.token": "认证令牌",
  "settings.connection.bridge.tokenPlaceholder": "必填，需与 AstrBot 适配器 auth_token 一致",
  "settings.connection.bridge.saveConfig": "保存连接配置",
  "settings.connection.bridge.saveAndConnect": "保存并连接",
  "settings.connection.bridge.connect": "连接服务器",
  "settings.connection.bridge.connected": "已连接",
  "settings.connection.bridge.disconnect": "断开连接",
  "settings.connection.bridge.resourceService": "资源服务",
  "settings.connection.bridge.resourceServerUrl": "资源服务地址",
  "settings.connection.bridge.resourceServerUrlPlaceholder": "留空时自动跟随连接地址",
  "settings.connection.bridge.resourcePath": "资源路径",
  "settings.connection.bridge.resourcePathPlaceholder": "默认沿用握手路径或 /resources",
  "settings.connection.bridge.resourceToken": "资源访问令牌",
  "settings.connection.bridge.resourceTokenPlaceholder": "留空时复用 WebSocket 认证令牌",
  // Settings — Connection status
  "settings.connection.status.connecting": "正在建立连接",
  "settings.connection.status.handshaking": "正在握手",
  "settings.connection.status.online": "在线",
  "settings.connection.status.waitingRetry": "等待重试（第 {attempt} 次）",
  "settings.connection.status.waiting": "等待重试",
  "settings.connection.status.suspended": "系统挂起中",
  "settings.connection.status.connectionFailed": "连接失败",
  "settings.connection.status.offline": "离线",
  // Settings — Connection workspace
  "settings.connection.workspace.connectionStatus": "连接状态",
  "settings.connection.workspace.desiredState": "期望状态",
  "settings.connection.workspace.keepConnected": "保持连接",
  "settings.connection.workspace.keepDisconnected": "保持断开",
  "settings.connection.workspace.userId": "用户 ID",
  "settings.connection.workspace.notAssigned": "尚未分配",
  "settings.connection.workspace.sessionId": "会话 ID",
  "settings.connection.workspace.notEstablished": "尚未建立",
  "settings.connection.workspace.resourceBaseUrl": "资源地址",
  "settings.connection.workspace.autoFollow": "自动跟随",
  "settings.connection.workspace.resourcePath": "资源路径",
  // Settings — Connection misc
  "settings.connection.initFailed": "连接配置初始化失败",
  "settings.connection.settingsStaleWarning": "检测到其他窗口更新了连接配置，请先保存或放弃当前修改后再同步",
  "settings.connection.resetFailed": "连接配置重置失败: {error}",
  // Settings — Model
  "settings.model.status.inUse": "使用中",
  "settings.model.status.notLoaded": "未加载",
  "settings.model.currentModel": "当前模型",
  "settings.model.noModelLoaded": "尚未加载模型",
  "settings.model.notLoadedWarn": "当前未加载模型",
  "settings.model.expressionReloadFailed": "表情类型已保存，但重新加载模型失败: {error}",
  // Settings — Advanced / Platform
  "settings.advanced.platform.unknown": "未知",
  "settings.advanced.platform.gameModeUnavailable": "不可用（{reason}）",
  "settings.advanced.platform.gameModeNative": "可用（原生窗口管理器）",
  "settings.advanced.platform.gameModeHeuristic": "可用（活跃窗口启发式）",
  "settings.advanced.platform.passThroughSupported": "支持",
  "settings.advanced.platform.passThroughUnsupported": "不支持（当前平台无法稳定转发鼠标事件）",
  "settings.advanced.platform.waylandNotice": "Wayland 会话下智能穿透与自动检测全屏应用不可用；建议在支持 X11 的环境中使用以获得更完整体验。",
  "settings.advanced.platform.linuxNotice": "Linux 会话下智能穿透不可用，自动更新需通过 Releases 手动下载。",
  "settings.advanced.platform.win32GameModeDisabled": "当前 Windows 平台已关闭自动检测全屏应用：{reason}",
  // Settings — History
  "settings.history.direction.outgoing": "发送",
  "settings.history.direction.incoming": "接收",
  "settings.history.clearTitle": "清空历史记录",
  "settings.history.clearContent": "确定要清空所有历史记录吗？此操作不可恢复！",
  // Settings — Maintenance
  "settings.maintenance.clearCacheTitle": "清除缓存",
  "settings.maintenance.clearCacheContent": "确定要清除所有缓存数据吗？",
  "settings.maintenance.resetSettingsTitle": "重置设置",
  "settings.maintenance.resetSettingsContent": "确定要重置所有设置吗？此操作不可恢复！",
  // Tray
  "tray.showMain": "显示主窗口",
  "tray.settings": "设置",
  "tray.history": "历史记录",
  "tray.quit": "退出",
  "tray.status.connected": "已连接",
  "tray.status.connecting": "正在连接...",
  "tray.status.handshaking": "正在握手...",
  "tray.status.waiting": "等待重连",
  "tray.status.retrying": "重连中...{seconds}s（第{attempt}次）",
  "tray.status.suspended": "已挂起",
  "tray.status.error": "连接错误",
  "tray.status.offline": "离线",
  // Updater status
  "updater.notChecked": "未检查更新",
  "updater.checking": "正在检查更新...",
  "updater.manualChecking": "正在手动检查更新...",
  "updater.alreadyChecking": "正在检查更新，请稍候",
  "updater.autoUpdateEnabled": "自动更新已启用",
  "updater.autoCheckDisabled": "自动检查更新已关闭，可手动检查更新",
  "updater.upToDate": "当前已是最新版本",
  "updater.newVersionFound": "发现新版本 {version}，正在下载更新",
  "updater.newVersionManual": "发现新版本 {version}，可手动下载",
  "updater.downloading": "正在下载更新：{percent}%",
  "updater.downloadedWaitReplace": "新版本 {version} 已下载完成，等待替换",
  "updater.downloadedWaitInstall": "新版本 {version} 已下载完成，等待安装",
  "updater.downloadComplete": "新版本 {version} 已下载完成",
  "updater.error": "自动更新异常: {message}",
  "updater.checkFailed": "检查更新失败: {message}",
  // Updater dialog
  "updater.dialog.newVersionTitle": "发现新版本",
  "updater.dialog.updateFailedTitle": "更新失败",
  "updater.dialog.installPromptPortable": "是否现在关闭应用并替换便携版更新？",
  "updater.dialog.installPromptRegular": "是否现在重启并安装更新？",
  "updater.dialog.installNowPortable": "立即替换",
  "updater.dialog.installNowRegular": "立即安装",
  "updater.dialog.later": "稍后",
  "updater.checkInitiated": "已发起更新检查",
  "updater.noInstalledDownload": "当前没有可安装的已下载更新",
  "updater.restartInstall": "正在重启并安装更新",
  "updater.closingReplace": "正在关闭应用并替换便携版更新",
  "updater.portableReplaceFailed": "启动便携版更新失败: {message}",
  // Updater disabled reasons
  "updater.disabled.dev": "开发环境不启用自动更新",
  "updater.disabled.platform": "当前平台暂不支持自动更新",
  "updater.disabled.noConfig": "缺少自动更新配置文件（app-update.yml）",
  "updater.disabled.generic": "自动更新不可用",
  // Updater portable errors
  "updater.portable.exeNotFound": "未找到当前便携版可执行文件路径",
  "updater.portable.downloadNotFound": "未找到已下载的便携版更新文件",
  "updater.portable.exeNotExist": "当前便携版可执行文件不存在，无法替换更新",
  "updater.portable.pathAbnormal": "下载的更新文件路径异常，无法执行便携版替换更新",
  // Cubism download dialogs
  "cubism.download.title": "Live2D SDK 下载",
  "cubism.download.message": "首次使用需要下载 Live2D Cubism SDK",
  "cubism.download.detail": `应用需要下载 Live2D Cubism Core 文件才能正常运行。

当前基线：{baseline}
来源：{url}

点击"确定"开始下载（约 200KB）。`,
  "cubism.download.successTitle": "下载完成",
  "cubism.download.successMessage": "Live2D SDK 下载成功",
  "cubism.download.successDetail": "应用将继续启动。",
  "cubism.download.failedTitle": "下载失败",
  "cubism.download.failedMessage": "Live2D SDK 下载失败",
  "cubism.download.failedDetail": `错误信息: {error}

请检查网络连接后重试。`,
  "cubism.download.retryDetail": `错误信息: {error}

第 {attempt}/{max} 次尝试失败。是否重试？`,
  // Main process error dialogs
  "mainProcess.databaseInitFailed": "数据库初始化失败",
  "mainProcess.databaseInitFailedDetail": `无法创建或打开数据库文件，应用将退出。

错误详情: {error}`,
  "mainProcess.initFailed": "初始化失败",
  "mainProcess.initFailedDetail": `应用初始化过程中发生错误，将退出。

{error}`,
  // Settings — Advanced shortcut
  "settings.advanced.shortcut.recordingShortcut": "全局录音快捷键",
  "settings.advanced.shortcut.pressKeys": "按下快捷键...",
  "settings.advanced.shortcut.clear": "清除",
  "settings.advanced.shortcut.register": "注册",
  "settings.advanced.shortcut.registered": "已注册",
  "settings.advanced.shortcut.maxDuration": "最长录音时长",
  "settings.advanced.shortcut.maxDurationHint": "秒（上限 60 秒）",
  // Shortcut
  "shortcut.occupiedOrInvalid": "快捷键已被占用或无效",
  // Settings — Connection workspace
  "settings.connection.workspace.description": "当前连接和会话的运行状态信息。",
  "settings.connection.workspace.currentModel": "当前模型",
  "settings.connection.workspace.sourceColor": "主题色",
  // Settings — Model current
  "settings.model.current.description": "查看当前加载的 Live2D 模型信息，并确认当前主题色是否来自模型配色。",
  "settings.model.current.notLoaded": "当前未加载模型",
  "settings.model.current.expressions": "表情类型",
  "settings.model.current.saveExpression": "保存分配",
  "settings.model.current.expressionDesc": "为固定表情类型分配当前模型的 exp3 表情。一个类型可分配多个表情，执行时会随机选择一个。",
  "settings.model.current.expressionProfilePath": "配置随模型保存：{path}",
  "settings.model.current.unassigned": "未分配",
  "settings.model.current.noExpressions": "当前模型没有可分配的 exp3 表情",
  "settings.model.current.preferences": "模型偏好",
  "settings.model.current.preferencesDesc": "配置主题色跟随策略。切换后立即生效。",
  "settings.model.current.scale": "当前模型大小缩放",
  "settings.model.current.resetScale": "重置",
  "settings.model.current.themeFollowModel": "主题色跟随当前模型",
  "settings.model.current.themeFollowFeedback": "启用后，界面主题会跟随当前模型配色；关闭后将保留手动或已有主题设置。",
  "settings.model.current.currentThemeColor": "当前主题色",
  "settings.model.current.pickColor": "选择颜色",
  "settings.model.current.resetAutoColor": "恢复自动提取",
  "settings.model.current.syncStatus": "同步状态",
  "settings.model.current.followingModel": "跟随当前模型",
  "settings.model.current.waitingForModel": "等待模型加载",
  "settings.model.current.syncDisabled": "已关闭自动同步",
  // Settings — Model library
  "settings.model.library.importModel": "导入模型",
  "settings.model.library.description": "管理本地 Live2D 模型文件。共 {count} 个模型。",
  "settings.model.library.current": "当前",
  "settings.model.library.reload": "重新加载",
  "settings.model.library.load": "加载",
  "settings.model.library.delete": "删除",
  "settings.model.library.empty": "暂无模型，请先导入",
  // Settings — Advanced behavior
  "settings.advanced.behavior.description": "配置应用启动行为、通知策略和日志级别。切换后立即生效。",
  "settings.advanced.behavior.autoConnect": "启动时自动连接",
  "settings.advanced.behavior.resumeOnWake": "系统恢复后自动恢复连接",
  "settings.advanced.behavior.retryEnabled": "启用自动重试",
  "settings.advanced.behavior.retryBaseDelay": "重试基础延迟",
  "settings.advanced.behavior.retryMaxDelay": "重试最大延迟",
  "settings.advanced.behavior.retryMaxAttempts": "最大重试次数",
  "settings.advanced.behavior.retryUnlimited": "留空表示不限次数",
  "settings.advanced.behavior.handshakeTimeout": "握手超时",
  "settings.advanced.behavior.recordingMode": "录音模式",
  "settings.advanced.behavior.recordingModeHold": "按住说话",
  "settings.advanced.behavior.recordingModeToggle": "点击切换",
  "settings.advanced.behavior.recordingModeFeedback": "按住说话：按下按钮开始录音，松开结束。点击切换：点击一次开始录音，再次点击结束。",
  "settings.advanced.behavior.autoLoadLastModel": "启动时自动加载上次模型",
  "settings.advanced.behavior.silenceDetection": "录音时启用静音检测",
  "settings.advanced.behavior.silenceDetectionFeedback": "长时间未检测到声音时自动结束录音，减少空白语音片段。",
  "settings.advanced.behavior.baseEventNotifications": "基础事件弹窗提示",
  "settings.advanced.behavior.logLevel": "日志级别",
  "settings.advanced.behavior.bubbleStackMax": "最大气泡数量",
  "settings.advanced.behavior.bubbleFollowUpWindow": "气泡追加时间窗口",
  "settings.advanced.behavior.imageInlineThreshold": "图片内联阈值",
  "settings.advanced.behavior.imageMaxSize": "图片大小上限",
  "settings.advanced.behavior.screenshotTarget": "截图默认目标",
  "settings.advanced.behavior.screenshotActiveWindow": "当前窗口",
  "settings.advanced.behavior.screenshotDesktop": "整个桌面",
  "settings.advanced.behavior.screenshotQuality": "截图质量",
  "settings.advanced.behavior.screenshotMaxWidth": "截图最大宽度",
  "settings.advanced.behavior.desktopInteraction": "桌面交互",
  "settings.advanced.behavior.desktopInteractionDesc": "控制桌面窗口的置顶、鼠标穿透和全屏应用检测行为。此处开关会在切换后立即保存并生效。",
  "settings.advanced.behavior.alwaysOnTop": "始终置顶显示",
  "settings.advanced.behavior.alwaysOnTopFeedback": "保持桌面角色窗口位于普通应用之上，适合需要持续显示角色的场景。",
  "settings.advanced.behavior.passThroughMode": "鼠标穿透",
  "settings.advanced.behavior.passThroughNone": "不穿透",
  "settings.advanced.behavior.passThroughDynamic": "智能穿透",
  "settings.advanced.behavior.passThroughFull": "完全穿透",
  "settings.advanced.behavior.passThroughNoneFeedback": "鼠标事件在模型区域正常响应，不穿透到底层应用。",
  "settings.advanced.behavior.passThroughDynamicFeedback": "鼠标悬停模型或交互控件时可点击，其他区域穿透到底层应用。",
  "settings.advanced.behavior.passThroughFullFeedback": "主窗口完全忽略鼠标事件，仅可通过快捷键和托盘菜单操作。",
  "settings.advanced.behavior.autoDetectFullscreen": "自动检测全屏应用",
  "settings.advanced.behavior.autoDetectFullscreenFeedback": "检测到游戏或其他全屏应用时，自动配合桌面模式调整窗口行为；当前平台不支持时会禁用此选项。",
  "settings.advanced.behavior.platformCapabilities": "平台能力",
  "settings.advanced.behavior.platformCapabilitiesDesc": "当前系统平台支持的功能特性。",
  "settings.advanced.behavior.currentPlatform": "当前平台",
  "settings.advanced.behavior.gameModeLabel": "自动检测全屏应用",
  "settings.advanced.behavior.passThroughLabel": "智能穿透支持",
  "settings.advanced.behavior.alwaysOnTopLevelLabel": "置顶层级策略",
  // Units
  "settings.advanced.behavior.milliseconds": "毫秒",
  "settings.advanced.behavior.times": "次",
  "settings.advanced.behavior.bubbles": "条",
  "settings.advanced.behavior.kb": "KB",
  "settings.advanced.behavior.mb": "MB",
  "settings.advanced.behavior.percent": "%",
  "settings.advanced.behavior.pixels": "像素",
  // Settings — Advanced tracking
  "settings.advanced.tracking.description": "配置 Live2D 模型的眼球和头部鼠标追踪行为。",
  "settings.advanced.tracking.enabled": "启用追踪",
  "settings.advanced.tracking.mode": "追踪范围",
  "settings.advanced.tracking.modeEyesOnly": "仅眼球",
  "settings.advanced.tracking.modeEyesAndHead": "眼球 + 头部",
  "settings.advanced.tracking.eyeScale": "眼球幅度",
  "settings.advanced.tracking.headScale": "头部幅度",
  "settings.advanced.tracking.bodyScale": "身体跟随",
  "settings.advanced.tracking.headScaleDisabled": "（当前模式仅追踪眼球）",
  // Settings — Advanced pipeline test
  "settings.advanced.pipelineTest.description": "测试 Live2D 表情、动作、追踪和表演管线的端到端连通性。",
  "settings.advanced.pipelineTest.modelInfo": "模型信息",
  "settings.advanced.pipelineTest.noModel": "未加载模型",
  "settings.advanced.pipelineTest.expressions": "表情",
  "settings.advanced.pipelineTest.motionGroups": "动作组",
  "settings.advanced.pipelineTest.quickTest": "表情快速测试",
  "settings.advanced.pipelineTest.singleTest": "单项测试",
  "settings.advanced.pipelineTest.exprPipeline": "表情管线",
  "settings.advanced.pipelineTest.motionPipeline": "动作管线",
  "settings.advanced.pipelineTest.trackingPipeline": "追踪管线",
  "settings.advanced.pipelineTest.performPipeline": "表演管线",
  "settings.advanced.pipelineTest.runSuite": "运行完整测试套件",
  "settings.advanced.pipelineTest.running": "运行中...",
  "settings.advanced.pipelineTest.results": "测试结果",
  "settings.advanced.pipelineTest.passed": "通过",
  "settings.advanced.pipelineTest.errors": "残留异常",
  "settings.advanced.pipelineTest.clearErrors": "清除异常",
  "settings.advanced.pipelineTest.debug": "调试模式",
  "settings.advanced.pipelineTest.clear": "清除",
  // Pipeline stage names
  "settings.advanced.pipelineTest.stage.bridge": "Bridge接收",
  "settings.advanced.pipelineTest.stage.parse": "消息解析",
  "settings.advanced.pipelineTest.stage.queue": "表演队列",
  "settings.advanced.pipelineTest.stage.expression": "表情解析",
  "settings.advanced.pipelineTest.stage.motion": "动作解析",
  "settings.advanced.pipelineTest.stage.tracking": "视线追踪",
  "settings.advanced.pipelineTest.stage.render": "渲染输出",
  // Settings — Advanced data
  "settings.advanced.data.description": "管理应用缓存、日志和设置数据。",
  "settings.advanced.data.openLogs": "打开日志目录",
  "settings.advanced.data.exportLogs": "导出最近日志",
  "settings.advanced.data.clearCache": "清除缓存",
  "settings.advanced.data.resetSettings": "重置所有设置",
  "settings.advanced.data.downloadCubismCore": "下载 Live2D SDK",
  // Settings — Advanced watcher
  "settings.advanced.watcher.unsaved": "未保存",
  "settings.advanced.watcher.synced": "已同步",
  "settings.advanced.watcher.description": '改为草稿态编辑。所有修改只在点击"保存更改"后写入后端，避免输入过程持续触发 IPC。',
  "settings.advanced.watcher.discardChanges": "放弃修改",
  "settings.advanced.watcher.saveChanges": "保存更改",
  "settings.advanced.watcher.resetDefault": "恢复默认",
  "settings.advanced.watcher.basicSwitches": "基础开关",
  "settings.advanced.watcher.basicSwitchesDesc": "监听窗口变化，让 AI 主动感知你的操作。这里的改动在保存前只会停留在本地草稿。",
  "settings.advanced.watcher.enableWatcher": "启用窗口监听",
  "settings.advanced.watcher.enableAppLaunch": "启用应用启动监听",
  "settings.advanced.watcher.appLaunchFeedback": "关闭后不会再因检测到新应用启动而主动发送桌面事件，但窗口监听的其他配置仍可保留。",
  "settings.advanced.watcher.monitorFrequency": "监控频率",
  "settings.advanced.watcher.monitorFrequencyDesc": "调整事件触发的频率限制，避免 AI 频繁响应。",
  "settings.advanced.watcher.globalInterval": "全局频率限制（毫秒）",
  "settings.advanced.watcher.globalIntervalFeedback": "两次事件之间的最小间隔。默认 1000ms（1秒）。",
  "settings.advanced.watcher.perWindowInterval": "单窗口频率限制（毫秒）",
  "settings.advanced.watcher.perWindowIntervalFeedback": "同一窗口两次事件之间的最小间隔。默认 3000ms（3秒）。",
  "settings.advanced.watcher.minInterval": "最小间隔（毫秒）",
  "settings.advanced.watcher.minIntervalFeedback": "防止过于频繁的触发。默认 100ms。",
  "settings.advanced.watcher.globalIntervalPlaceholder": "默认 1000ms",
  "settings.advanced.watcher.perWindowIntervalPlaceholder": "默认 3000ms",
  "settings.advanced.watcher.minIntervalPlaceholder": "默认 100ms",
  "settings.advanced.watcher.monitorEvents": "监控事件",
  "settings.advanced.watcher.monitorEventsDesc": "选择需要监控的窗口变化类型。",
  "settings.advanced.watcher.eventFocus": "窗口获得焦点（应用打开/切换）",
  "settings.advanced.watcher.eventBlur": "窗口失去焦点",
  "settings.advanced.watcher.eventCreate": "新窗口创建",
  "settings.advanced.watcher.eventDestroy": "窗口关闭",
  "settings.advanced.watcher.eventFullscreen": "窗口进入全屏",
  "settings.advanced.watcher.eventWindowed": "窗口退出全屏",
  "settings.advanced.watcher.eventResize": "窗口大小变化",
  "settings.advanced.watcher.eventMove": "窗口位置变化",
  "settings.advanced.watcher.eventMinimize": "窗口最小化",
  "settings.advanced.watcher.eventMaximize": "窗口最大化",
  "settings.advanced.watcher.eventRestore": "窗口恢复",
  "settings.advanced.watcher.aiResponseMode": "AI 响应模式",
  "settings.advanced.watcher.aiResponseModeDesc": "选择 AI 响应窗口事件的方式。",
  "settings.advanced.watcher.aiModeFirstOpen": "仅首次打开应用时响应",
  "settings.advanced.watcher.aiModeEverySwitch": "每次应用切换都响应",
  "settings.advanced.watcher.aiModeSpecificApps": "仅检测到特定应用时响应",
  "settings.advanced.watcher.specificAppsList": "特定应用列表（每行一个进程名）",
  "settings.advanced.watcher.ignoreRules": "忽略规则",
  "settings.advanced.watcher.ignoreRulesDesc": "配置额外需要忽略的进程和窗口。系统关键进程已内置过滤，此处添加的规则会与内置规则合并生效。",
  "settings.advanced.watcher.builtinRules": "内置忽略规则（始终生效）",
  "settings.advanced.watcher.builtinRulesContent": `进程：dwm.exe, csrss.exe, explorer.exe, SearchUI.exe 等系统进程
标题：Program Manager, 锁屏, Lock Screen, Task Switching 等系统窗口`,
  "settings.advanced.watcher.ignoreProcessNames": "额外忽略的进程名（每行一个）",
  "settings.advanced.watcher.ignoreProcessNamesPlaceholder": "输入额外要忽略的进程名...",
  "settings.advanced.watcher.ignoreProcessNamesFeedback": "这些进程名会与内置规则合并，用于过滤不需要触发 AI 响应的进程。",
  "settings.advanced.watcher.ignoreTitleKeywords": "额外忽略的窗口标题关键词（每行一个）",
  "settings.advanced.watcher.ignoreTitleKeywordsPlaceholder": "输入额外要忽略的标题关键词...",
  "settings.advanced.watcher.ignoreTitleKeywordsFeedback": "标题包含这些关键词的窗口会被忽略。",
  // Settings — History messages
  "settings.history.messages.searchPlaceholder": "搜索消息...",
  "settings.history.messages.direction": "方向",
  "settings.history.messages.clear": "清空",
  "settings.history.messages.refresh": "刷新",
  "settings.history.messages.total": "共 {count} 条消息",
  "settings.history.messages.me": "我",
  "settings.history.messages.unknownSource": "未知来源",
  // Settings — History statistics
  "settings.history.statistics.description": "消息趋势和内容分布统计。",
  "settings.history.statistics.messageTrend": "消息趋势",
  "settings.history.statistics.contentDistribution": "内容分布",
  "settings.history.statistics.activeHours": "活跃时段",
  "settings.history.statistics.messageCount": "消息数",
  "settings.history.statistics.usageCount": "使用量",
  "settings.history.statistics.text": "文字",
  "settings.history.statistics.image": "图片",
  "settings.history.statistics.audio": "音频",
  "settings.history.statistics.video": "视频",
  // Common error fallbacks
  "error.unknown": "未知错误",
  "error.platformNotSupported": "当前平台暂不支持",
  "error.capabilityUnavailable": "能力不可用",
  "error.resourceIdEmpty": "资源标识不能为空",
  "error.resourceIdIllegalPath": "资源标识包含非法路径片段",
  "error.resourceRequestFailed": "资源请求失败 ({status})",
  "error.resourceNotResolvable": "消息资源无法解析为可下载地址: {name}",
  "error.resourceMixedWrite": "消息同时包含已本地化资源和待离线化资源，拒绝混合写入",
  "error.databaseNotInitialized": "数据库未初始化",
  "error.notConnectedToServer": "未连接到服务器",
  "error.connectionSuperseded": "连接请求已被更新的生命周期操作取代",
  "error.connectionControllerNotInitialized": "连接控制器未初始化",
  "error.connectionControllerInitFailed": "连接控制器初始化失败",
  "error.modelPathEmpty": "模型路径不能为空",
  "error.unsupportedModelPathFormat": "不支持的模型路径格式: {path}",
  "error.modelNameEmpty": "模型名称不能为空",
  "error.modelNameIllegal": "模型名称非法",
  "error.selectValidModelFolder": "请选择有效的模型文件夹",
  "error.cubism2ModelUnsupported": "检测到 .model.json（Cubism 2）模型。当前版本已停用 Cubism 2，请改用 .model3.json 模型。",
  "error.model3NotFound": "该文件夹内未找到 .model3.json 模型文件",
  "error.modelResourceIncomplete": "模型资源不完整",
  "error.desktopSourceUnavailable": "无法获取桌面截图源",
  "error.screenshotSourceUnavailable": "截图源不可捕获，请稍后重试",
  "error.unknownTool": "未知工具: {name}",
  "error.localHistoryResourceMissing": "本地历史资源不存在",
  "error.onlyHttpMailtoProtocol": "仅支持打开 http/https/mailto 协议链接",
  "error.onlyResourceProtocol": "仅支持打开 http/https/data/history-resource 协议资源",
  "error.onlyResourceProtocolSave": "仅支持保存 http/https/data/history-resource 协议资源",
  "error.windowNotFound": "未找到当前窗口",
  "error.settingsWindowMismatch": "设置窗口状态不匹配",
  "error.cannotGetWindowInstance": "无法获取窗口实例",
  "error.cubismConfigMissing": "package.json 中缺少 cubism.core 配置: {path}",
  "error.targetNotDirectory": "目标路径的父级不是目录: {dir}",
  "error.redirectLimitExceeded": "重定向次数超过上限",
  "error.downloadFailed": "下载失败: {status}",
  "error.attachmentTooLarge": "附件大小超过内联限制 ({limit} bytes)，且服务端未提供资源上传能力",
  "error.resourceUploadFailed": "资源上传失败，无法发送大附件",
  "error.sdkDownloadFailed": "SDK 下载失败",
  "error.cubism3Only": "当前版本仅支持 Cubism 3/4 的 .model3.json 模型。",
  "error.modelFileNotSpecified": "模型配置文件中未指定模型文件名",
  "error.webglContextFailed": "无法获取 WebGL 上下文",
  "error.microphoneAccess": "无法访问麦克风，请检查权限设置",
  "error.recordingNotStarted": "录音未开始",
  "error.recordingAlreadyStopped": "录音已停止",
  "error.saveOfflineHistoryFailed": "保存离线历史消息失败",
  "error.wakeWordEmpty": "唤醒词为空，已停止监听",
  "error.missingPorcupineAccessKey": "缺少 Porcupine AccessKey，请在配置中设置 VITE_PORCUPINE_ACCESS_KEY",
  "error.wakeWordResourceMissing": "唤醒词资源缺失: {files}",
  "error.porcupineModuleLoadFailed": "无法加载本地 Porcupine 模块 ({path})。请确认文件存在且可离线访问。原始错误: {message}",
  "error.porcupineCreateNotFound": "未找到 Porcupine.create 接口，请检查本地 Porcupine SDK 文件",
  "error.porcupineNoBuiltinKeyword": "当前 Porcupine 模块不支持内置关键词，请改为本地 .ppn 文件",
  "error.builtinKeywordNotFound": "未找到内置唤醒词: {name}",
  "error.porcupineInitFailed": "Porcupine 初始化失败: {error}",
  "error.porcupineInstanceUnavailable": "Porcupine 实例不可用，缺少 process() 方法",
  "error.wakeWordAudioPipelineFailed": "唤醒监听音频管线启动失败: {error}",
  "error.noAudioContext": "当前环境不支持 AudioContext",
  "error.createTextureFailed": "创建纹理失败",
  "error.loadTextureFailed": "无法加载纹理: {path}",
  "error.loadFileFailed": "无法加载文件: {path} ({status})",
  "error.expressionFallbackWarning": "表情文件未解析出可执行参数，已回退到原生表情运行时",
  "error.desktopBehaviorIllegalParam": "desktopBehavior:requestReveal 参数非法",
  "error.domainNotInjected": "{name} 未注入",
  "error.textureLoadAllFailed": "纹理加载失败: {textures}",
  "error.webglContextNotInitialized": "WebGL 上下文未初始化",
  "error.porcupineModuleMissingCreate": "本地 Porcupine 模块缺少 create() 接口",
  "error.wakeWordProcessFailed": "唤醒词识别处理失败: {error}",
  "error.porcupineRuntimeError": "Porcupine 运行错误: {error}",
  // Settings — History media viewer
  "settings.history.mediaViewer.imageAlt": "历史消息图片放大预览",
  "settings.history.mediaViewer.closeHint": "按 ESC 键或点击空白区域关闭"
}, cv = {
  // Main window — empty state
  "main.empty.title": "Welcome to AstrBot Live2D",
  "main.empty.subtitle": "No model imported yet. Please import a Live2D model first.",
  "main.empty.import": "Import Model",
  "main.empty.settings": "Or manage models in Settings",
  // Main window — status toasts
  "main.status.connected": "Connected to server",
  "main.status.disconnected": "Disconnected",
  "main.status.suspended": "System suspended, connection paused",
  "main.status.modelLoaded": "Model loaded successfully",
  "main.status.modelImportSuccess": "Model imported successfully",
  "main.status.modelLoadFailed": "Failed to load model: {message}",
  "main.status.modelImportFailed": "Failed to import model: {message}",
  "main.status.canvasNotMounted": "Live2D canvas component is not mounted, cannot load model",
  "main.status.modelInfoParseFailed": "Failed to parse model resource",
  "main.status.connectionError": "Connection error: {message}",
  // Main window — retry
  "main.retry.hint": "Disconnected, retrying in {seconds}s (attempt {attempt})",
  "main.retry.waiting": "Disconnected, waiting for auto-retry",
  // Main window — recording
  "main.recording.indicator": "Recording... {duration}s",
  "main.recording.hintShortcut": "Press shortcut again to stop",
  "main.recording.hintManual": "Click microphone button to stop",
  "main.recording.short": "Recording too short",
  "main.recording.notConnected": "Not connected to server",
  "main.recording.failed": "Recording failed: {message}",
  "main.recording.notSupported": "Your browser does not support recording",
  "main.recording.sendFailed": "Send failed: {message}",
  "main.recording.stopFailed": "Failed to stop recording: {message}",
  "main.recording.sending": "Sending audio...",
  "main.recording.sent": "Audio sent",
  "main.recording.voiceMessage": "[Voice Message]",
  // Main window — input
  "main.input.placeholder": "Type a message... (Ctrl+V to paste)",
  "main.input.send": "Send",
  "main.input.sendImage": "Send Image",
  "main.input.holdToRecord": "Hold to record",
  "main.input.clickToRecord": "Click to record",
  "main.input.clickToStop": "Click to stop",
  "main.input.sendingFailed": "Send failed: {message}",
  "main.input.sent": "Message sent",
  "main.input.imageTooLarge": "Image size cannot exceed {max}MB",
  "main.input.processingImage": "Processing image...",
  "main.input.notConnected": "Not connected to server",
  // Main window — model
  "main.model.folderFailed": "Failed to select folder: {message}",
  "main.model.multiFileDetected": "Multiple model files detected, auto-selected: {file}",
  "main.model.compatibilityWarning": "Model has compatibility or fallback resource warnings: {warnings}",
  // Main window — platform
  "main.platform.waylandWarning": "Linux Wayland session detected: smart passthrough and fullscreen app detection are unavailable.",
  "main.platform.linuxWarning": "Linux session detected: smart passthrough is unavailable, auto-update requires manual download.",
  // Main window — misc
  "main.defaultUserName": "Desktop User",
  "main.imageAlt": "AstrBot message image",
  "main.performSequence": "[Performance Sequence]",
  "main.serverUser": "Server",
  // Radial menu
  "menu.history": "History",
  "menu.settings": "Settings",
  "menu.talk": "Chat",
  "menu.resetPosition": "Reset Position",
  "menu.expressionTest": "Test Expressions",
  // Expression tester
  "expressionTester.title": "Expression Test",
  "expressionTester.empty": "No available expressions for this model",
  "expressionTester.other": "Others",
  // Settings menu
  "settings.menu.connection": "Connection",
  "settings.menu.connection.bridge": "Bridge Connection",
  "settings.menu.connection.workspace": "Workspace Status",
  "settings.menu.model": "Model",
  "settings.menu.model.current": "Current Model",
  "settings.menu.model.library": "Model Library",
  "settings.menu.history": "History",
  "settings.menu.history.messages": "Messages",
  "settings.menu.history.statistics": "Statistics",
  "settings.menu.advanced": "Advanced",
  "settings.menu.advanced.behavior": "Behavior",
  "settings.menu.advanced.shortcut": "Shortcuts",
  "settings.menu.advanced.windowWatcher": "Window Watcher",
  "settings.menu.advanced.tracking": "Mouse Tracking",
  "settings.menu.advanced.pipeline-test": "Pipeline Test",
  "settings.menu.advanced.data": "Data Management",
  "settings.menu.about": "About",
  "settings.menu.about.info": "About",
  // Settings titlebar
  "settings.titlebar.title": "Settings",
  "settings.titlebar.minimize": "Minimize",
  "settings.titlebar.maximize": "Maximize",
  "settings.titlebar.restore": "Restore",
  "settings.titlebar.close": "Close",
  "settings.titlebar.pin": "Pin window",
  "settings.titlebar.unpin": "Unpin window",
  // Welcome window
  "welcome.greeting": "Nice to meet you, let's be friends~",
  "welcome.subtitle": "I'll be your personal desktop companion, always by your side...",
  "welcome.formTitle": "What should I call you?",
  "welcome.formHint": "Tell me your nickname, and let the journey begin ✦",
  "welcome.placeholder": "Enter your nickname...",
  "welcome.submit": "Let's get started",
  "welcome.submitting": "Preparing your cozy space...",
  "welcome.error": "Oops, setup failed. Please try again later~",
  "welcome.enterHint": "Press Enter to continue",
  "welcome.close": "Close",
  // Media player
  "media.close": "Close",
  "media.imageAlt": "Performance image",
  "media.clickToClose": "Click empty area to close",
  "media.audioLoadFailed": "Audio resource failed to load",
  "media.audioLoadAborted": "Audio resource loading aborted",
  "media.audioLoadTimeout": "Audio resource loading timed out ({ms}ms)",
  "media.audioUrlInvalid": "Audio resource URL is not available",
  // Expression types
  "expression.group.basic": "Basic",
  "expression.group.emotion": "Emotion",
  "expression.group.state": "State",
  "expression.group.effect": "Effect",
  "expression.neutral": "Neutral",
  "expression.happy": "Happy",
  "expression.sad": "Sad",
  "expression.angry": "Angry",
  "expression.surprised": "Surprised",
  "expression.thinking": "Thinking/Confused",
  "expression.tired": "Tired/Sleepy",
  "expression.disgusted": "Disgusted",
  "expression.playful": "Playful",
  "expression.special": "Special Effect",
  "expression.anxious": "Nervous/Fearful",
  "expression.blush": "Blushing/Shy",
  "expression.sweat": "Sweating",
  "expression.speaking": "Speaking",
  // Bridge validation
  "validation.urlRequired": "Server address is required",
  "validation.urlInvalid": "Invalid server address format, please enter a complete WebSocket address",
  "validation.urlProtocol": "Server address must use ws or wss protocol",
  "validation.tokenRequired": "Auth token is required, please fill in the settings before connecting",
  // Toasts — Connection
  "toast.connectionSaved": "Connection configuration saved",
  "toast.connectionSaveFailed": "Save failed: {error}",
  "toast.connectRequested": "Connection request submitted",
  "toast.connectFailed": "Connection failed: {error}",
  "toast.disconnected": "Disconnected",
  "toast.disconnectFailed": "Disconnect failed: {error}",
  "toast.connectionConfigStale": "Connection config was updated by another window, synced automatically",
  // Toasts — Model
  "toast.modelImported": "Model imported successfully",
  "toast.modelDeleted": "Model deleted",
  "toast.modelLoadSent": "Model load command sent, check main window for result",
  "toast.modelLoadFailed": "Failed to send model load command: {error}",
  "toast.modelReloadSent": "Model deleted, current model reloaded",
  "toast.modelDeleteFailed": "Delete failed: {error}",
  "toast.modelListFailed": "Failed to load model list",
  "toast.modelExpressionReadFailed": "Failed to read expression types",
  // Toasts — Expression
  "toast.expressionSaved": "Expression types saved, reloading current model",
  "toast.expressionSaveFailed": "Failed to save expression types: {error}",
  // Toasts — Shortcut
  "toast.shortcutRegistered": "Shortcut registered successfully",
  "toast.shortcutRegisterFailed": "Registration failed: {error}",
  "toast.shortcutCleared": "Shortcut cleared",
  "toast.shortcutNotSet": "Please set a shortcut first",
  // Toasts — Watcher
  "toast.watcherConfigSaved": "Window watcher configuration saved",
  "toast.watcherConfigSaveFailed": "Save failed: {error}",
  "toast.watcherConfigReset": "Window watcher configuration reset",
  "toast.watcherConfigResetFailed": "Reset failed: {error}",
  // Toasts — History
  "toast.historyCleared": "History cleared",
  "toast.historyClearFailed": "Clear failed: {error}",
  "toast.historyLoadedFailed": "Failed to load history",
  "toast.historyStatsFailed": "Failed to load statistics",
  "toast.fileResourceUnavailable": "File resource unavailable",
  "toast.fileOpenFailed": "Failed to open file: {error}",
  "toast.fileDownloadFailed": "Failed to download file: {error}",
  "toast.fileSaved": "File save started",
  "toast.historyRefreshed": "Refreshed",
  // Toasts — Maintenance
  "toast.logDirOpened": "Log directory opened: {path}",
  "toast.logDirOpenFailed": "Failed to open log directory: {error}",
  "toast.logExported": "Exported {count} log file(s): {path}",
  "toast.logExportFailed": "Failed to export logs: {error}",
  "toast.cacheCleared": "Cache cleared",
  "toast.settingsReset": "Settings reset",
  "toast.settingsResetFailed": "Reset failed: {error}",
  "toast.cubismCoreDownloadSuccess": "Live2D SDK downloaded successfully",
  "toast.cubismCoreDownloadFailed": "Live2D SDK download failed: {error}",
  "toast.cubismCoreAlreadyExists": "Live2D SDK already exists",
  // Toasts — About/Update
  "toast.aboutSaveFailed": "Save failed: {error}",
  "toast.updateCheckFailed": "Update check failed: {error}",
  "toast.updateInstallFailed": "Failed to install update: {error}",
  // Dialogs — generic
  "dialog.confirm": "OK",
  "dialog.cancel": "Cancel",
  "dialog.retry": "Retry",
  // Settings — About
  "settings.about.title": "About",
  "settings.about.appName": "App Name",
  "settings.about.version": "Version",
  "settings.about.updateStatus": "Update Status",
  "settings.about.autoCheckUpdate": "Auto-check for updates",
  "settings.about.author": "Author",
  "settings.about.language": "Language",
  "settings.about.relatedProjects": "Related Projects",
  "settings.about.projectRepo": "Project Repository",
  "settings.about.adapterPlugin": "Platform Adapter Plugin",
  "settings.about.enabled": "Enabled",
  "settings.about.disabled": "Disabled",
  "settings.about.autoCheckDesc": "When enabled, the app will automatically check for updates on startup. When disabled, updates will not be checked at startup but can still be checked manually.",
  "settings.about.checkUpdate": "Check for Updates",
  "settings.about.restartAndInstall": "Restart and Install",
  "settings.about.poweredBy": "Powered by Live2D",
  // Settings — About (extra)
  "settings.about.updateStatusUnknown": "Update status unknown",
  // Settings — Connection bridge
  "settings.connection.bridge.serverUrl": "Server Address",
  "settings.connection.bridge.token": "Auth Token",
  "settings.connection.bridge.tokenPlaceholder": "Required, must match AstrBot adapter auth_token",
  "settings.connection.bridge.saveConfig": "Save Connection Config",
  "settings.connection.bridge.saveAndConnect": "Save and Connect",
  "settings.connection.bridge.connect": "Connect to Server",
  "settings.connection.bridge.connected": "Connected",
  "settings.connection.bridge.disconnect": "Disconnect",
  "settings.connection.bridge.resourceService": "Resource Service",
  "settings.connection.bridge.resourceServerUrl": "Resource Server URL",
  "settings.connection.bridge.resourceServerUrlPlaceholder": "Auto-follows connection address when empty",
  "settings.connection.bridge.resourcePath": "Resource Path",
  "settings.connection.bridge.resourcePathPlaceholder": "Defaults to handshake path or /resources",
  "settings.connection.bridge.resourceToken": "Resource Access Token",
  "settings.connection.bridge.resourceTokenPlaceholder": "Reuses WebSocket auth token when empty",
  // Settings — Connection status
  "settings.connection.status.connecting": "Connecting",
  "settings.connection.status.handshaking": "Handshaking",
  "settings.connection.status.online": "Online",
  "settings.connection.status.waitingRetry": "Waiting retry (attempt {attempt})",
  "settings.connection.status.waiting": "Waiting retry",
  "settings.connection.status.suspended": "System suspended",
  "settings.connection.status.connectionFailed": "Connection failed",
  "settings.connection.status.offline": "Offline",
  // Settings — Connection workspace
  "settings.connection.workspace.connectionStatus": "Connection status",
  "settings.connection.workspace.desiredState": "Desired state",
  "settings.connection.workspace.keepConnected": "Keep connected",
  "settings.connection.workspace.keepDisconnected": "Keep disconnected",
  "settings.connection.workspace.userId": "User ID",
  "settings.connection.workspace.notAssigned": "Not assigned",
  "settings.connection.workspace.sessionId": "Session ID",
  "settings.connection.workspace.notEstablished": "Not established",
  "settings.connection.workspace.resourceBaseUrl": "Resource URL",
  "settings.connection.workspace.autoFollow": "Auto-follow",
  "settings.connection.workspace.resourcePath": "Resource path",
  // Settings — Connection misc
  "settings.connection.initFailed": "Connection configuration initialization failed",
  "settings.connection.settingsStaleWarning": "Connection configuration has been updated by another window. Please save or discard current changes before syncing.",
  "settings.connection.resetFailed": "Connection configuration reset failed: {error}",
  // Settings — Model
  "settings.model.status.inUse": "In use",
  "settings.model.status.notLoaded": "Not loaded",
  "settings.model.currentModel": "Current model",
  "settings.model.noModelLoaded": "No model loaded",
  "settings.model.notLoadedWarn": "No model currently loaded",
  "settings.model.expressionReloadFailed": "Expression types saved, but model reload failed: {error}",
  // Settings — Advanced / Platform
  "settings.advanced.platform.unknown": "Unknown",
  "settings.advanced.platform.gameModeUnavailable": "Unavailable ({reason})",
  "settings.advanced.platform.gameModeNative": "Available (native window manager)",
  "settings.advanced.platform.gameModeHeuristic": "Available (active window heuristic)",
  "settings.advanced.platform.passThroughSupported": "Supported",
  "settings.advanced.platform.passThroughUnsupported": "Unsupported (current platform cannot forward mouse events stably)",
  "settings.advanced.platform.waylandNotice": "Wayland session: smart passthrough and auto-detect fullscreen are unavailable. Use an X11 environment for a better experience.",
  "settings.advanced.platform.linuxNotice": "Linux session: smart passthrough is unavailable, auto-update requires manual download from Releases.",
  "settings.advanced.platform.win32GameModeDisabled": "Auto-detection of fullscreen applications is disabled on this Windows platform: {reason}",
  // Settings — History
  "settings.history.direction.outgoing": "Sent",
  "settings.history.direction.incoming": "Received",
  "settings.history.clearTitle": "Clear History",
  "settings.history.clearContent": "Are you sure you want to clear all history? This action cannot be undone!",
  // Settings — Maintenance
  "settings.maintenance.clearCacheTitle": "Clear Cache",
  "settings.maintenance.clearCacheContent": "Are you sure you want to clear all cached data?",
  "settings.maintenance.resetSettingsTitle": "Reset Settings",
  "settings.maintenance.resetSettingsContent": "Are you sure you want to reset all settings? This action cannot be undone!",
  // Tray
  "tray.showMain": "Show Main Window",
  "tray.settings": "Settings",
  "tray.history": "History",
  "tray.quit": "Quit",
  "tray.status.connected": "Connected",
  "tray.status.connecting": "Connecting...",
  "tray.status.handshaking": "Handshaking...",
  "tray.status.waiting": "Waiting to reconnect",
  "tray.status.retrying": "Reconnecting...{seconds}s (attempt {attempt})",
  "tray.status.suspended": "Suspended",
  "tray.status.error": "Connection error",
  "tray.status.offline": "Offline",
  // Updater status
  "updater.notChecked": "Not checked for updates",
  "updater.checking": "Checking for updates...",
  "updater.manualChecking": "Manually checking for updates...",
  "updater.alreadyChecking": "Update check in progress, please wait",
  "updater.autoUpdateEnabled": "Auto-update enabled",
  "updater.autoCheckDisabled": "Auto-check disabled, you can still check manually",
  "updater.upToDate": "Already up to date",
  "updater.newVersionFound": "New version {version} found, downloading...",
  "updater.newVersionManual": "New version {version} found, available for manual download",
  "updater.downloading": "Downloading update: {percent}%",
  "updater.downloadedWaitReplace": "New version {version} downloaded, waiting to replace",
  "updater.downloadedWaitInstall": "New version {version} downloaded, waiting to install",
  "updater.downloadComplete": "New version {version} downloaded",
  "updater.error": "Auto-update error: {message}",
  "updater.checkFailed": "Update check failed: {message}",
  // Updater dialog
  "updater.dialog.newVersionTitle": "New Version Found",
  "updater.dialog.updateFailedTitle": "Update Failed",
  "updater.dialog.installPromptPortable": "Close the app and replace the portable update now?",
  "updater.dialog.installPromptRegular": "Restart and install the update now?",
  "updater.dialog.installNowPortable": "Replace Now",
  "updater.dialog.installNowRegular": "Install Now",
  "updater.dialog.later": "Later",
  "updater.checkInitiated": "Update check initiated",
  "updater.noInstalledDownload": "No downloaded update available to install",
  "updater.restartInstall": "Restarting to install update",
  "updater.closingReplace": "Closing app to replace portable update",
  "updater.portableReplaceFailed": "Failed to start portable update: {message}",
  // Updater disabled reasons
  "updater.disabled.dev": "Auto-update disabled in dev environment",
  "updater.disabled.platform": "Auto-update not supported on this platform",
  "updater.disabled.noConfig": "Missing auto-update config file (app-update.yml)",
  "updater.disabled.generic": "Auto-update unavailable",
  // Updater portable errors
  "updater.portable.exeNotFound": "Current portable executable path not found",
  "updater.portable.downloadNotFound": "Downloaded portable update file not found",
  "updater.portable.exeNotExist": "Current portable executable does not exist, cannot replace",
  "updater.portable.pathAbnormal": "Downloaded update file path is abnormal, cannot perform portable replacement",
  // Cubism download dialogs
  "cubism.download.title": "Live2D SDK Download",
  "cubism.download.message": "First launch requires downloading Live2D Cubism SDK",
  "cubism.download.detail": `The app needs to download Live2D Cubism Core to run properly.

Baseline: {baseline}
Source: {url}

Click "OK" to start download (~200KB).`,
  "cubism.download.successTitle": "Download Complete",
  "cubism.download.successMessage": "Live2D SDK download successful",
  "cubism.download.successDetail": "The app will continue to launch.",
  "cubism.download.failedTitle": "Download Failed",
  "cubism.download.failedMessage": "Live2D SDK download failed",
  "cubism.download.failedDetail": `Error: {error}

Please check your network connection and try again.`,
  "cubism.download.retryDetail": `Error: {error}

Attempt {attempt}/{max} failed. Would you like to retry?`,
  // Main process error dialogs
  "mainProcess.databaseInitFailed": "Database Initialization Failed",
  "mainProcess.databaseInitFailedDetail": `Failed to create or open database file. The app will exit.

Error details: {error}`,
  "mainProcess.initFailed": "Initialization Failed",
  "mainProcess.initFailedDetail": `An error occurred during app initialization. The app will exit.

{error}`,
  // Settings — Advanced shortcut
  "settings.advanced.shortcut.recordingShortcut": "Global Recording Shortcut",
  "settings.advanced.shortcut.pressKeys": "Press keys...",
  "settings.advanced.shortcut.clear": "Clear",
  "settings.advanced.shortcut.register": "Register",
  "settings.advanced.shortcut.registered": "Registered",
  "settings.advanced.shortcut.maxDuration": "Max Recording Duration",
  "settings.advanced.shortcut.maxDurationHint": "seconds (max 60s)",
  // Shortcut
  "shortcut.occupiedOrInvalid": "Shortcut is occupied or invalid",
  // Settings — Connection workspace
  "settings.connection.workspace.description": "Current connection and session status information.",
  "settings.connection.workspace.currentModel": "Current Model",
  "settings.connection.workspace.sourceColor": "Theme Color",
  // Settings — Model current
  "settings.model.current.description": "View the currently loaded Live2D model information and confirm whether the theme color comes from the model palette.",
  "settings.model.current.notLoaded": "No model loaded",
  "settings.model.current.expressions": "Expression Types",
  "settings.model.current.saveExpression": "Save Assignment",
  "settings.model.current.expressionDesc": "Assign exp3 expressions from the current model to fixed expression types. Multiple expressions can be assigned per type and one will be selected randomly during execution.",
  "settings.model.current.expressionProfilePath": "Configuration saved with model: {path}",
  "settings.model.current.unassigned": "Unassigned",
  "settings.model.current.noExpressions": "Current model has no assignable exp3 expressions",
  "settings.model.current.preferences": "Model Preferences",
  "settings.model.current.preferencesDesc": "Configure theme color following strategy. Changes take effect immediately.",
  "settings.model.current.scale": "Current Model Scale",
  "settings.model.current.resetScale": "Reset",
  "settings.model.current.themeFollowModel": "Theme follows current model",
  "settings.model.current.themeFollowFeedback": "When enabled, the interface theme will follow the current model color scheme; when disabled, manual or existing theme settings will be preserved.",
  "settings.model.current.currentThemeColor": "Current Theme Color",
  "settings.model.current.pickColor": "Pick color",
  "settings.model.current.resetAutoColor": "Restore auto extraction",
  "settings.model.current.syncStatus": "Sync Status",
  "settings.model.current.followingModel": "Following current model",
  "settings.model.current.waitingForModel": "Waiting for model to load",
  "settings.model.current.syncDisabled": "Auto-sync disabled",
  // Settings — Model library
  "settings.model.library.importModel": "Import Model",
  "settings.model.library.description": "Manage local Live2D model files. {count} model(s) in total.",
  "settings.model.library.current": "Current",
  "settings.model.library.reload": "Reload",
  "settings.model.library.load": "Load",
  "settings.model.library.delete": "Delete",
  "settings.model.library.empty": "No models yet, please import one first",
  // Settings — Advanced behavior
  "settings.advanced.behavior.description": "Configure app startup behavior, notification strategy, and log level. Changes take effect immediately.",
  "settings.advanced.behavior.autoConnect": "Auto-connect on launch",
  "settings.advanced.behavior.resumeOnWake": "Auto-resume connection after system wake",
  "settings.advanced.behavior.retryEnabled": "Enable auto-retry",
  "settings.advanced.behavior.retryBaseDelay": "Retry base delay",
  "settings.advanced.behavior.retryMaxDelay": "Retry max delay",
  "settings.advanced.behavior.retryMaxAttempts": "Max retry attempts",
  "settings.advanced.behavior.retryUnlimited": "Leave empty for unlimited",
  "settings.advanced.behavior.handshakeTimeout": "Handshake timeout",
  "settings.advanced.behavior.recordingMode": "Recording mode",
  "settings.advanced.behavior.recordingModeHold": "Hold to talk",
  "settings.advanced.behavior.recordingModeToggle": "Click to toggle",
  "settings.advanced.behavior.recordingModeFeedback": "Hold to talk: press and hold to record, release to stop. Click to toggle: click once to start, click again to stop.",
  "settings.advanced.behavior.autoLoadLastModel": "Auto-load last model on launch",
  "settings.advanced.behavior.silenceDetection": "Enable silence detection during recording",
  "settings.advanced.behavior.silenceDetectionFeedback": "Automatically stop recording when no sound is detected for a period, reducing silent audio segments.",
  "settings.advanced.behavior.baseEventNotifications": "Basic event notification toasts",
  "settings.advanced.behavior.logLevel": "Log level",
  "settings.advanced.behavior.bubbleStackMax": "Max bubble count",
  "settings.advanced.behavior.bubbleFollowUpWindow": "Bubble follow-up window",
  "settings.advanced.behavior.imageInlineThreshold": "Image inline threshold",
  "settings.advanced.behavior.imageMaxSize": "Image max size",
  "settings.advanced.behavior.screenshotTarget": "Screenshot default target",
  "settings.advanced.behavior.screenshotActiveWindow": "Active window",
  "settings.advanced.behavior.screenshotDesktop": "Entire desktop",
  "settings.advanced.behavior.screenshotQuality": "Screenshot quality",
  "settings.advanced.behavior.screenshotMaxWidth": "Screenshot max width",
  "settings.advanced.behavior.desktopInteraction": "Desktop Interaction",
  "settings.advanced.behavior.desktopInteractionDesc": "Control desktop window always-on-top, mouse passthrough, and fullscreen app detection behavior. Changes are saved and take effect immediately.",
  "settings.advanced.behavior.alwaysOnTop": "Always on top",
  "settings.advanced.behavior.alwaysOnTopFeedback": "Keep the desktop character window above normal applications, suitable for scenarios requiring continuous character display.",
  "settings.advanced.behavior.passThroughMode": "Mouse pass-through",
  "settings.advanced.behavior.passThroughNone": "No pass-through",
  "settings.advanced.behavior.passThroughDynamic": "Smart pass-through",
  "settings.advanced.behavior.passThroughFull": "Full pass-through",
  "settings.advanced.behavior.passThroughNoneFeedback": "Mouse events respond normally in the model area without passing through to underlying apps.",
  "settings.advanced.behavior.passThroughDynamicFeedback": "Clickable only when hovering over the model or interactive controls; other areas pass through.",
  "settings.advanced.behavior.passThroughFullFeedback": "The main window ignores all mouse events, only operable via shortcuts and tray menu.",
  "settings.advanced.behavior.autoDetectFullscreen": "Auto-detect fullscreen apps",
  "settings.advanced.behavior.autoDetectFullscreenFeedback": "When a game or other fullscreen application is detected, automatically adjust window behavior with desktop mode; this option is disabled when unsupported by the current platform.",
  "settings.advanced.behavior.platformCapabilities": "Platform Capabilities",
  "settings.advanced.behavior.platformCapabilitiesDesc": "Features supported by the current system platform.",
  "settings.advanced.behavior.currentPlatform": "Current platform",
  "settings.advanced.behavior.gameModeLabel": "Auto-detect fullscreen apps",
  "settings.advanced.behavior.passThroughLabel": "Smart passthrough support",
  "settings.advanced.behavior.alwaysOnTopLevelLabel": "Always-on-top level strategy",
  // Units
  "settings.advanced.behavior.milliseconds": "ms",
  "settings.advanced.behavior.times": "times",
  "settings.advanced.behavior.bubbles": "bubbles",
  "settings.advanced.behavior.kb": "KB",
  "settings.advanced.behavior.mb": "MB",
  "settings.advanced.behavior.percent": "%",
  "settings.advanced.behavior.pixels": "px",
  // Settings — Advanced tracking
  "settings.advanced.tracking.description": "Configure mouse tracking behavior for the Live2D model eyes and head.",
  "settings.advanced.tracking.enabled": "Enable Tracking",
  "settings.advanced.tracking.mode": "Tracking Range",
  "settings.advanced.tracking.modeEyesOnly": "Eyes Only",
  "settings.advanced.tracking.modeEyesAndHead": "Eyes + Head",
  "settings.advanced.tracking.eyeScale": "Eye Scale",
  "settings.advanced.tracking.headScale": "Head Scale",
  "settings.advanced.tracking.bodyScale": "Body Scale",
  "settings.advanced.tracking.headScaleDisabled": "(eyes-only mode)",
  // Settings — Advanced pipeline test
  "settings.advanced.pipelineTest.description": "Test end-to-end connectivity of Live2D expression, motion, tracking, and performance pipelines.",
  "settings.advanced.pipelineTest.modelInfo": "Model Info",
  "settings.advanced.pipelineTest.noModel": "No model loaded",
  "settings.advanced.pipelineTest.expressions": "expressions",
  "settings.advanced.pipelineTest.motionGroups": "motion groups",
  "settings.advanced.pipelineTest.quickTest": "Quick Expression Test",
  "settings.advanced.pipelineTest.singleTest": "Single Tests",
  "settings.advanced.pipelineTest.exprPipeline": "Expression Pipeline",
  "settings.advanced.pipelineTest.motionPipeline": "Motion Pipeline",
  "settings.advanced.pipelineTest.trackingPipeline": "Tracking Pipeline",
  "settings.advanced.pipelineTest.performPipeline": "Perform Pipeline",
  "settings.advanced.pipelineTest.runSuite": "Run Full Test Suite",
  "settings.advanced.pipelineTest.running": "Running...",
  "settings.advanced.pipelineTest.results": "Test Results",
  "settings.advanced.pipelineTest.passed": "passed",
  "settings.advanced.pipelineTest.errors": "Residual Errors",
  "settings.advanced.pipelineTest.clearErrors": "Clear Errors",
  "settings.advanced.pipelineTest.debug": "Debug Mode",
  "settings.advanced.pipelineTest.clear": "Clear",
  // Pipeline stage names
  "settings.advanced.pipelineTest.stage.bridge": "Bridge RX",
  "settings.advanced.pipelineTest.stage.parse": "Parse",
  "settings.advanced.pipelineTest.stage.queue": "Queue",
  "settings.advanced.pipelineTest.stage.expression": "Expression",
  "settings.advanced.pipelineTest.stage.motion": "Motion",
  "settings.advanced.pipelineTest.stage.tracking": "Tracking",
  "settings.advanced.pipelineTest.stage.render": "Render",
  // Settings — Advanced data
  "settings.advanced.data.description": "Manage app cache, logs, and settings data.",
  "settings.advanced.data.openLogs": "Open Logs Directory",
  "settings.advanced.data.exportLogs": "Export Recent Logs",
  "settings.advanced.data.clearCache": "Clear Cache",
  "settings.advanced.data.resetSettings": "Reset All Settings",
  "settings.advanced.data.downloadCubismCore": "Download Live2D SDK",
  // Settings — Advanced watcher
  "settings.advanced.watcher.unsaved": "Unsaved",
  "settings.advanced.watcher.synced": "Synced",
  "settings.advanced.watcher.description": 'Draft-based editing. All changes are only written to the backend after clicking "Save Changes", avoiding continuous IPC triggers during input.',
  "settings.advanced.watcher.discardChanges": "Discard Changes",
  "settings.advanced.watcher.saveChanges": "Save Changes",
  "settings.advanced.watcher.resetDefault": "Reset to Default",
  "settings.advanced.watcher.basicSwitches": "Basic Switches",
  "settings.advanced.watcher.basicSwitchesDesc": "Monitor window changes to let AI proactively perceive your actions. Changes here remain as local drafts until saved.",
  "settings.advanced.watcher.enableWatcher": "Enable window watcher",
  "settings.advanced.watcher.enableAppLaunch": "Enable app launch detection",
  "settings.advanced.watcher.appLaunchFeedback": "When disabled, new app launches will no longer trigger proactive desktop events, but other watcher configurations are preserved.",
  "settings.advanced.watcher.monitorFrequency": "Monitoring Frequency",
  "settings.advanced.watcher.monitorFrequencyDesc": "Adjust event trigger rate limiting to prevent AI from responding too frequently.",
  "settings.advanced.watcher.globalInterval": "Global rate limit (ms)",
  "settings.advanced.watcher.globalIntervalFeedback": "Minimum interval between any two events. Default: 1000ms (1 second).",
  "settings.advanced.watcher.perWindowInterval": "Per-window rate limit (ms)",
  "settings.advanced.watcher.perWindowIntervalFeedback": "Minimum interval between two events from the same window. Default: 3000ms (3 seconds).",
  "settings.advanced.watcher.minInterval": "Minimum interval (ms)",
  "settings.advanced.watcher.minIntervalFeedback": "Prevents excessively frequent triggers. Default: 100ms.",
  "settings.advanced.watcher.globalIntervalPlaceholder": "Default 1000ms",
  "settings.advanced.watcher.perWindowIntervalPlaceholder": "Default 3000ms",
  "settings.advanced.watcher.minIntervalPlaceholder": "Default 100ms",
  "settings.advanced.watcher.monitorEvents": "Monitor Events",
  "settings.advanced.watcher.monitorEventsDesc": "Select the window change types to monitor.",
  "settings.advanced.watcher.eventFocus": "Window focus (app open/switch)",
  "settings.advanced.watcher.eventBlur": "Window blur",
  "settings.advanced.watcher.eventCreate": "Window create",
  "settings.advanced.watcher.eventDestroy": "Window close",
  "settings.advanced.watcher.eventFullscreen": "Window enter fullscreen",
  "settings.advanced.watcher.eventWindowed": "Window exit fullscreen",
  "settings.advanced.watcher.eventResize": "Window resize",
  "settings.advanced.watcher.eventMove": "Window move",
  "settings.advanced.watcher.eventMinimize": "Window minimize",
  "settings.advanced.watcher.eventMaximize": "Window maximize",
  "settings.advanced.watcher.eventRestore": "Window restore",
  "settings.advanced.watcher.aiResponseMode": "AI Response Mode",
  "settings.advanced.watcher.aiResponseModeDesc": "Choose how AI responds to window events.",
  "settings.advanced.watcher.aiModeFirstOpen": "Respond only on first app open",
  "settings.advanced.watcher.aiModeEverySwitch": "Respond on every app switch",
  "settings.advanced.watcher.aiModeSpecificApps": "Respond only for specific apps",
  "settings.advanced.watcher.specificAppsList": "Specific app list (one process name per line)",
  "settings.advanced.watcher.ignoreRules": "Ignore Rules",
  "settings.advanced.watcher.ignoreRulesDesc": "Configure additional processes and windows to ignore. System-critical processes are already built-in; rules added here merge with built-in rules.",
  "settings.advanced.watcher.builtinRules": "Built-in ignore rules (always active)",
  "settings.advanced.watcher.builtinRulesContent": `Processes: dwm.exe, csrss.exe, explorer.exe, SearchUI.exe and other system processes
Titles: Program Manager, Lock Screen, Task Switching and other system windows`,
  "settings.advanced.watcher.ignoreProcessNames": "Additional ignored process names (one per line)",
  "settings.advanced.watcher.ignoreProcessNamesPlaceholder": "Enter additional process names to ignore...",
  "settings.advanced.watcher.ignoreProcessNamesFeedback": "These process names merge with built-in rules to filter out processes that should not trigger AI responses.",
  "settings.advanced.watcher.ignoreTitleKeywords": "Additional ignored window title keywords (one per line)",
  "settings.advanced.watcher.ignoreTitleKeywordsPlaceholder": "Enter additional title keywords to ignore...",
  "settings.advanced.watcher.ignoreTitleKeywordsFeedback": "Windows with titles containing these keywords will be ignored.",
  // Settings — History messages
  "settings.history.messages.searchPlaceholder": "Search messages...",
  "settings.history.messages.direction": "Direction",
  "settings.history.messages.clear": "Clear",
  "settings.history.messages.refresh": "Refresh",
  "settings.history.messages.total": "{count} message(s) in total",
  "settings.history.messages.me": "Me",
  "settings.history.messages.unknownSource": "Unknown source",
  // Settings — History statistics
  "settings.history.statistics.description": "Message trends and content distribution statistics.",
  "settings.history.statistics.messageTrend": "Message Trends",
  "settings.history.statistics.contentDistribution": "Content Distribution",
  "settings.history.statistics.activeHours": "Active Hours",
  "settings.history.statistics.messageCount": "Messages",
  "settings.history.statistics.usageCount": "Usage",
  "settings.history.statistics.text": "Text",
  "settings.history.statistics.image": "Images",
  "settings.history.statistics.audio": "Audio",
  "settings.history.statistics.video": "Video",
  // Common error fallbacks
  "error.unknown": "Unknown error",
  "error.platformNotSupported": "Current platform not supported",
  "error.capabilityUnavailable": "Capability unavailable",
  "error.resourceIdEmpty": "Resource identifier cannot be empty",
  "error.resourceIdIllegalPath": "Resource identifier contains illegal path segments",
  "error.resourceRequestFailed": "Resource request failed ({status})",
  "error.resourceNotResolvable": "Message resource cannot be resolved to downloadable URL: {name}",
  "error.resourceMixedWrite": "Message contains both localized and unlocalized resources, rejecting mixed write",
  "error.databaseNotInitialized": "Database not initialized",
  "error.notConnectedToServer": "Not connected to server",
  "error.connectionSuperseded": "Connection request superseded by a newer lifecycle operation",
  "error.connectionControllerNotInitialized": "Connection controller not initialized",
  "error.connectionControllerInitFailed": "Connection controller initialization failed",
  "error.modelPathEmpty": "Model path cannot be empty",
  "error.unsupportedModelPathFormat": "Unsupported model path format: {path}",
  "error.modelNameEmpty": "Model name cannot be empty",
  "error.modelNameIllegal": "Model name is invalid",
  "error.selectValidModelFolder": "Please select a valid model folder",
  "error.cubism2ModelUnsupported": "Detected .model.json (Cubism 2) model. Cubism 2 has been deprecated, please use a .model3.json model instead.",
  "error.model3NotFound": "No .model3.json model file found in this folder",
  "error.modelResourceIncomplete": "Model resources incomplete",
  "error.desktopSourceUnavailable": "Unable to get desktop capture source",
  "error.screenshotSourceUnavailable": "Screenshot source unavailable, please try again later",
  "error.unknownTool": "Unknown tool: {name}",
  "error.localHistoryResourceMissing": "Local history resource does not exist",
  "error.onlyHttpMailtoProtocol": "Only http/https/mailto protocol links are supported",
  "error.onlyResourceProtocol": "Only http/https/data/history-resource protocol resources are supported",
  "error.onlyResourceProtocolSave": "Only http/https/data/history-resource protocol resources can be saved",
  "error.windowNotFound": "Current window not found",
  "error.settingsWindowMismatch": "Settings window state mismatch",
  "error.cannotGetWindowInstance": "Cannot get window instance",
  "error.cubismConfigMissing": "Missing cubism.core config in package.json: {path}",
  "error.targetNotDirectory": "Parent of target path is not a directory: {dir}",
  "error.redirectLimitExceeded": "Redirect limit exceeded",
  "error.downloadFailed": "Download failed: {status}",
  "error.attachmentTooLarge": "Attachment size exceeds inline limit ({limit} bytes) and server does not support resource upload",
  "error.resourceUploadFailed": "Resource upload failed, cannot send large attachment",
  "error.sdkDownloadFailed": "SDK download failed",
  "error.cubism3Only": "This version only supports Cubism 3/4 .model3.json models.",
  "error.modelFileNotSpecified": "Model file name not specified in model configuration",
  "error.webglContextFailed": "Cannot get WebGL context",
  "error.microphoneAccess": "Cannot access microphone, please check permissions",
  "error.recordingNotStarted": "Recording not started",
  "error.recordingAlreadyStopped": "Recording already stopped",
  "error.saveOfflineHistoryFailed": "Failed to save offline history messages",
  "error.wakeWordEmpty": "Wake word is empty, stopped listening",
  "error.missingPorcupineAccessKey": "Missing Porcupine AccessKey, please set VITE_PORCUPINE_ACCESS_KEY in configuration",
  "error.wakeWordResourceMissing": "Wake word resources missing: {files}",
  "error.porcupineModuleLoadFailed": "Failed to load local Porcupine module ({path}). Please confirm the file exists and is accessible offline. Original error: {message}",
  "error.porcupineCreateNotFound": "Porcupine.create interface not found, please check local Porcupine SDK file",
  "error.porcupineNoBuiltinKeyword": "Current Porcupine module does not support built-in keywords, please use local .ppn file instead",
  "error.builtinKeywordNotFound": "Built-in keyword not found: {name}",
  "error.porcupineInitFailed": "Porcupine initialization failed: {error}",
  "error.porcupineInstanceUnavailable": "Porcupine instance unavailable, missing process() method",
  "error.wakeWordAudioPipelineFailed": "Wake word audio pipeline startup failed: {error}",
  "error.noAudioContext": "Current environment does not support AudioContext",
  "error.createTextureFailed": "Failed to create texture",
  "error.loadTextureFailed": "Failed to load texture: {path}",
  "error.loadFileFailed": "Failed to load file: {path} ({status})",
  "error.expressionFallbackWarning": "Expression file had no executable parameters, fell back to native expression runtime",
  "error.desktopBehaviorIllegalParam": "desktopBehavior:requestReveal parameter is invalid",
  "error.domainNotInjected": "{name} not injected",
  "error.textureLoadAllFailed": "Texture loading failed: {textures}",
  "error.webglContextNotInitialized": "WebGL context not initialized",
  "error.porcupineModuleMissingCreate": "Local Porcupine module missing create() interface",
  "error.wakeWordProcessFailed": "Wake word recognition processing failed: {error}",
  "error.porcupineRuntimeError": "Porcupine runtime error: {error}",
  // Settings — History media viewer
  "settings.history.mediaViewer.imageAlt": "History message image enlarged preview",
  "settings.history.mediaViewer.closeHint": "Press ESC or click empty area to close"
}, Kl = {
  "zh-CN": av,
  en: cv
};
let dp = "zh-CN";
function lv(e) {
  dp = e;
}
function J(e, t) {
  var n;
  let r = ((n = Kl[dp]) == null ? void 0 : n[e]) ?? Kl["zh-CN"][e] ?? String(e);
  if (t)
    for (const [i, o] of Object.entries(t))
      r = r.replace(new RegExp(`\\{${i}\\}`, "g"), String(o));
  return r;
}
let yt = null;
const uv = Lc(import.meta.url), Xl = 2, ps = {
  userId: Rt.userId,
  userName: Rt.userName
};
function Bc(e, t) {
  e.pragma(`user_version = ${Math.max(0, Math.floor(t))}`);
}
function dv(e) {
  const t = e.pragma("user_version", { simple: !0 });
  return Number.isFinite(t) ? Math.max(0, Math.floor(Number(t))) : 0;
}
function fv(e) {
  e.exec(`
    CREATE TABLE IF NOT EXISTS user_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id TEXT UNIQUE NOT NULL,
      session_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_name TEXT,
      message_type TEXT NOT NULL,
      direction TEXT NOT NULL,
      content TEXT NOT NULL,
      raw_text TEXT,
      timestamp INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
    CREATE INDEX IF NOT EXISTS idx_messages_session_direction_timestamp ON messages(session_id, direction, timestamp DESC);

    CREATE TABLE IF NOT EXISTS performances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id TEXT NOT NULL,
      sequence TEXT NOT NULL,
      duration INTEGER,
      interrupted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(message_id)
    );

    CREATE INDEX IF NOT EXISTS idx_performances_message ON performances(message_id);

    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      hour INTEGER,
      message_count INTEGER DEFAULT 0,
      text_count INTEGER DEFAULT 0,
      image_count INTEGER DEFAULT 0,
      audio_count INTEGER DEFAULT 0,
      video_count INTEGER DEFAULT 0,
      motion_usage TEXT,
      expression_usage TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_statistics_date_hour ON statistics(date, hour);
  `), Bc(e, 1);
}
function hv(e) {
  e.exec(`
    CREATE TABLE IF NOT EXISTS message_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id TEXT NOT NULL,
      content_index INTEGER NOT NULL,
      media_type TEXT NOT NULL,
      mime TEXT NOT NULL,
      file_name TEXT,
      size_bytes INTEGER NOT NULL,
      sha256 TEXT NOT NULL,
      source_kind TEXT,
      source_url TEXT,
      source_rid TEXT,
      data BLOB NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(message_id, content_index),
      FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_message_resources_message_id ON message_resources(message_id);
    CREATE INDEX IF NOT EXISTS idx_message_resources_sha256 ON message_resources(sha256);
  `), Bc(e, 2);
}
function pv(e) {
  let t = dv(e);
  t < 1 && (fv(e), t = 1), t < 2 && (hv(e), t = 2), t !== Xl && Bc(e, Xl);
}
function mv(e) {
  var n, i;
  e.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
      raw_text,
      content='messages',
      content_rowid='id',
      tokenize='trigram'
    );

    CREATE TRIGGER IF NOT EXISTS messages_fts_ai AFTER INSERT ON messages BEGIN
      INSERT INTO messages_fts(rowid, raw_text)
      VALUES (new.id, COALESCE(new.raw_text, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS messages_fts_ad AFTER DELETE ON messages BEGIN
      INSERT INTO messages_fts(messages_fts, rowid, raw_text)
      VALUES ('delete', old.id, COALESCE(old.raw_text, ''));
    END;

    CREATE TRIGGER IF NOT EXISTS messages_fts_au AFTER UPDATE ON messages BEGIN
      INSERT INTO messages_fts(messages_fts, rowid, raw_text)
      VALUES ('delete', old.id, COALESCE(old.raw_text, ''));
      INSERT INTO messages_fts(rowid, raw_text)
      VALUES (new.id, COALESCE(new.raw_text, ''));
    END;
  `);
  const t = ((n = e.prepare("SELECT COUNT(*) AS count FROM messages").get()) == null ? void 0 : n.count) || 0;
  if (t === 0)
    return;
  (((i = e.prepare("SELECT COUNT(*) AS count FROM messages_fts").get()) == null ? void 0 : i.count) || 0) !== t && e.prepare("INSERT INTO messages_fts(messages_fts) VALUES ('rebuild')").run();
}
function gv() {
  if (yt) return yt;
  const e = Q.join(pi(), "history.db");
  console.log("[数据库] 使用路径:", e);
  const t = uv.resolve("better-sqlite3/package.json"), r = tv(t);
  return yt = Te.existsSync(r) ? new ql(e, { nativeBinding: r }) : new ql(e), yt.pragma("journal_mode = WAL"), yt.pragma("foreign_keys = ON"), pv(yt), mv(yt), console.log("[数据库] 初始化完成:", e), yt;
}
function ut() {
  if (!yt)
    throw new Error(J("error.databaseNotInitialized"));
  return yt;
}
function yv() {
  yt && (yt.close(), yt = null, console.log("[数据库] 已关闭"));
}
function vv(e) {
  const t = ut(), r = up(e.direction);
  if (!r)
    throw new Error(`无效的消息方向: ${e.direction}`);
  t.prepare(`
    INSERT INTO messages (
      message_id, session_id, user_id, user_name,
      message_type, direction, content, raw_text, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(message_id) DO UPDATE SET
      session_id = excluded.session_id,
      user_id = excluded.user_id,
      user_name = excluded.user_name,
      message_type = excluded.message_type,
      direction = excluded.direction,
      content = excluded.content,
      raw_text = excluded.raw_text,
      timestamp = excluded.timestamp
  `).run(
    e.messageId,
    e.sessionId,
    e.userId,
    e.userName || null,
    e.messageType,
    r,
    JSON.stringify(e.content),
    e.rawText || null,
    e.timestamp
  );
}
function wv(e) {
  ut().prepare(`
    INSERT INTO performances (message_id, sequence, duration, interrupted)
    VALUES (?, ?, ?, ?)
  `).run(
    e.messageId,
    JSON.stringify(e.sequence),
    e.duration || null,
    e.interrupted ? 1 : 0
  );
}
function fp(e, t) {
  ut().prepare(`
    UPDATE messages
    SET content = ?
    WHERE message_id = ?
  `).run(JSON.stringify(t), e);
}
function Ev(e, t) {
  ut().prepare(`
    UPDATE performances
    SET sequence = ?
    WHERE message_id = ?
  `).run(JSON.stringify(t), e);
}
function _v(e) {
  const t = ut();
  t.transaction(() => {
    t.prepare("DELETE FROM performances WHERE message_id = ?").run(e), t.prepare("DELETE FROM message_resources WHERE message_id = ?").run(e), t.prepare("DELETE FROM messages WHERE message_id = ?").run(e);
  })();
}
function hp(e) {
  let t = " WHERE 1=1";
  const r = [];
  if (e.startDate && (t += " AND timestamp >= ?", r.push(e.startDate)), e.endDate && (t += " AND timestamp <= ?", r.push(e.endDate)), e.messageType && (t += " AND message_type = ?", r.push(e.messageType)), e.direction) {
    const n = up(e.direction);
    if (!n)
      return { clause: "__INVALID__", params: [] };
    t += " AND direction = ?", r.push(n);
  }
  if (e.keyword) {
    const n = ev(e.keyword);
    t += n.clause, r.push(...n.params);
  }
  return { clause: t, params: r };
}
function Sv(e) {
  const t = ut(), { clause: r, params: n } = hp(e);
  if (r === "__INVALID__") return [];
  let i = `SELECT * FROM messages${r}`;
  return i += " ORDER BY timestamp ASC", e.limit && (i += " LIMIT ?", n.push(e.limit)), e.offset && (i += " OFFSET ?", n.push(e.offset)), t.prepare(i).all(...n);
}
function bv(e) {
  ut().prepare(`
    INSERT INTO statistics (
      date, hour, message_count, text_count, image_count,
      audio_count, video_count, motion_usage, expression_usage
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date, hour) DO UPDATE SET
      message_count = message_count + excluded.message_count,
      text_count = text_count + excluded.text_count,
      image_count = image_count + excluded.image_count,
      audio_count = audio_count + excluded.audio_count,
      video_count = video_count + excluded.video_count,
      motion_usage = excluded.motion_usage,
      expression_usage = excluded.expression_usage,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    e.date,
    e.hour,
    e.messageCount,
    e.textCount,
    e.imageCount,
    e.audioCount,
    e.videoCount,
    JSON.stringify(e.motionUsage),
    JSON.stringify(e.expressionUsage)
  );
}
function Tv(e, t) {
  return ut().prepare(`
    SELECT * FROM statistics
    WHERE date BETWEEN ? AND ?
    ORDER BY date, hour
  `).all(e, t);
}
function Cv(e, t) {
  const i = ut().prepare(`
    SELECT AVG(
      incoming.timestamp - (
        SELECT MAX(outgoing.timestamp)
        FROM messages outgoing
        WHERE outgoing.session_id = incoming.session_id
          AND outgoing.direction = 'outgoing'
          AND outgoing.timestamp <= incoming.timestamp
      )
    ) AS avg_response_time
    FROM messages incoming
    WHERE incoming.direction = 'incoming'
      AND incoming.timestamp BETWEEN ? AND ?
      AND EXISTS (
        SELECT 1
        FROM messages outgoing
        WHERE outgoing.session_id = incoming.session_id
          AND outgoing.direction = 'outgoing'
          AND outgoing.timestamp <= incoming.timestamp
      )
  `).get(e, t), o = i == null ? void 0 : i.avg_response_time;
  return Number.isFinite(o) ? Math.round(o) : 0;
}
function Rv(e) {
  const t = ut(), { clause: r, params: n } = hp(e);
  return r === "__INVALID__" ? 0 : t.prepare(`SELECT COUNT(*) as count FROM messages${r}`).get(...n).count;
}
function Av() {
  ut().exec(`
    DELETE FROM performances;
    DELETE FROM message_resources;
    DELETE FROM messages;
    DELETE FROM statistics;
    VACUUM;
  `), console.log("[数据库] 历史记录已清空");
}
function vt(e) {
  const n = ut().prepare("SELECT value FROM user_config WHERE key = ?").get(e);
  return n ? n.value : null;
}
function wt(e, t) {
  ut().prepare(`
    INSERT INTO user_config (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `).run(e, t);
}
function pp() {
  let e = vt(ps.userId);
  return e || (e = _t.randomUUID(), wt(ps.userId, e)), e;
}
function qc() {
  const e = vt(ps.userName);
  return !e || e.trim() === "" ? null : e;
}
function Pv(e) {
  wt(ps.userName, e);
}
const YM_WELCOME_ON_STARTUP_KEY = "welcome_show_on_startup";
function YM_getWelcomeOnStartup() {
  return vt(YM_WELCOME_ON_STARTUP_KEY) === "true";
}
function YM_setWelcomeOnStartup(e) {
  wt(YM_WELCOME_ON_STARTUP_KEY, e ? "true" : "false");
  return YM_getWelcomeOnStartup();
}
const ur = {
  alwaysOnTop: !0,
  fullPassThrough: !1,
  dynamicPassThrough: !0,
  autoDetectFullscreen: !1
};
function Jl(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    alwaysOnTop: typeof t.alwaysOnTop == "boolean" ? t.alwaysOnTop : ur.alwaysOnTop,
    fullPassThrough: typeof t.fullPassThrough == "boolean" ? t.fullPassThrough : ur.fullPassThrough,
    dynamicPassThrough: typeof t.dynamicPassThrough == "boolean" ? t.dynamicPassThrough : ur.dynamicPassThrough,
    autoDetectFullscreen: typeof t.autoDetectFullscreen == "boolean" ? t.autoDetectFullscreen : ur.autoDetectFullscreen
  };
}
function Iv(e, t) {
  const r = Jl(e), n = Jl({
    ...r,
    ...t && typeof t == "object" ? t : {}
  });
  return {
    alwaysOnTop: n.alwaysOnTop,
    fullPassThrough: n.fullPassThrough,
    dynamicPassThrough: n.dynamicPassThrough,
    autoDetectFullscreen: n.autoDetectFullscreen
  };
}
const dr = {
  alwaysOnTop: Rt.alwaysOnTop,
  fullPassThrough: Rt.fullPassThrough,
  dynamicPassThrough: Rt.dynamicPassThrough,
  autoDetectFullscreen: Rt.autoDetectFullscreen
};
function Fi(e, t) {
  return e === null ? t : e === "true";
}
function mp() {
  return {
    alwaysOnTop: Fi(
      vt(dr.alwaysOnTop),
      ur.alwaysOnTop
    ),
    fullPassThrough: Fi(
      vt(dr.fullPassThrough),
      ur.fullPassThrough
    ),
    dynamicPassThrough: Fi(
      vt(dr.dynamicPassThrough),
      ur.dynamicPassThrough
    ),
    autoDetectFullscreen: Fi(
      vt(dr.autoDetectFullscreen),
      ur.autoDetectFullscreen
    )
  };
}
function Dv(e) {
  const t = Iv(mp(), e);
  return wt(dr.alwaysOnTop, String(t.alwaysOnTop)), wt(dr.fullPassThrough, String(t.fullPassThrough)), wt(dr.dynamicPassThrough, String(t.dynamicPassThrough)), wt(dr.autoDetectFullscreen, String(t.autoDetectFullscreen)), t;
}
function xv() {
  return {
    modelReady: !1,
    backgroundPaused: !1,
    gameModeHidden: !1
  };
}
function ro(e, t, r) {
  const n = t.modelReady && !t.backgroundPaused && !t.gameModeHidden;
  return {
    visible: n,
    alwaysOnTop: n && e.alwaysOnTop,
    zOrderLevel: r.alwaysOnTopLevel
  };
}
const gp = "astrbot-live2d", Nv = "logs", Ds = 14, Ov = Ds * 24 * 60 * 60 * 1e3, yp = new RegExp(`^${gp}-(\\d{4}-\\d{2}-\\d{2})(?:\\.(\\d+))?\\.log$`), as = 20 * 1024 * 1024, Lv = 2e3, Fv = 5, kv = 20, no = 80, Uv = /(token|password|secret|api[-_]?key|authorization|cookie)/i, Mv = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
}, $v = {
  debug: 10,
  info: 20
};
let ki = null, cs = "", ls = "", ni = 0, Jr = 0, Mt = null, Ql = !1, Zl = !1, en = "info", bc = "";
const Bv = {
  debug: console.debug.bind(console),
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};
function tn(e) {
  try {
    process.stderr.write(`${e}
`);
  } catch {
  }
}
function qv() {
  try {
    return pi();
  } catch {
    return ke.join(process.cwd(), "userData");
  }
}
function vp(e) {
  nt.mkdirSync(e, { recursive: !0 });
}
function wp(e) {
  const t = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
  return `${t}-${r}-${n}`;
}
function Wv(e) {
  const t = e.match(yp);
  if (!t)
    return null;
  const n = (/* @__PURE__ */ new Date(`${t[1]}T00:00:00`)).getTime();
  return Number.isFinite(n) ? n : null;
}
function Hv(e) {
  return Mv[e] >= $v[en];
}
function eu(e, t) {
  const r = t > 0 ? `.${t}` : "";
  return ke.join(Fr(), `${gp}-${e}${r}.log`);
}
function tu(e) {
  try {
    return nt.statSync(e).size;
  } catch {
    return 0;
  }
}
function Ep() {
  if (Mt) {
    try {
      Mt.end();
    } catch {
    }
    Mt = null;
  }
}
function jv(e, t) {
  const r = wp(e);
  if (Mt && cs === r && ni + t <= as)
    return Mt;
  const n = cs !== r;
  Ep(), n ? Jr = 0 : ni + t > as && (Jr += 1);
  let i = eu(r, Jr), o = tu(i);
  for (; o > 0 && o + t > as; )
    Jr += 1, i = eu(r, Jr), o = tu(i);
  return ls && ls !== i && !n && tn(`[logger] rotated log file: ${ke.basename(i)}`), Mt = nt.createWriteStream(i, { flags: "a", encoding: "utf8" }), cs = r, ls = i, ni = o, Mt.on("error", (s) => {
    tn(`[logger] stream error: ${s instanceof Error ? s.message : String(s)}`);
  }), Mt;
}
function Qr(e, t = Lv) {
  if (e.startsWith("data:")) {
    const r = e.indexOf(","), n = r >= 0 ? e.slice(0, r + 1) : e.slice(0, 120);
    return `${n}<省略 ${Math.max(0, e.length - n.length)} 字符>`;
  }
  return e.length <= t ? e : `${e.slice(0, t)}...(总长 ${e.length} 字符)`;
}
function _p(e) {
  if (e instanceof Error) {
    const t = typeof e.code == "string" ? e.code : void 0;
    return {
      name: e.name,
      message: Qr(e.message),
      stack: e.stack ? Qr(e.stack, 6e3) : void 0,
      code: t
    };
  }
  if (e && typeof e == "object") {
    const t = e;
    if (typeof t.message == "string" || typeof t.stack == "string")
      return {
        name: typeof t.name == "string" ? t.name : "UnknownError",
        message: typeof t.message == "string" ? Qr(t.message) : String(e),
        stack: typeof t.stack == "string" ? Qr(t.stack, 6e3) : void 0,
        code: typeof t.code == "string" || typeof t.code == "number" ? t.code : void 0
      };
  }
  return {
    message: Qr(String(e))
  };
}
function ms(e, t = /* @__PURE__ */ new WeakSet(), r = 0) {
  if (typeof e == "string")
    return Qr(e);
  if (typeof e == "number" || typeof e == "boolean" || e === null || e === void 0)
    return e;
  if (typeof e == "bigint")
    return e.toString();
  if (typeof e == "function")
    return `[Function:${e.name || "anonymous"}]`;
  if (typeof e == "symbol")
    return e.toString();
  if (e instanceof Error)
    return _p(e);
  if (e instanceof Date)
    return Number.isNaN(e.getTime()) ? "Invalid Date" : e.toISOString();
  if (Buffer.isBuffer(e))
    return {
      __type: "buffer",
      length: e.length
    };
  if (!e || typeof e != "object")
    return String(e);
  if (t.has(e))
    return "[Circular]";
  if (r >= Fv)
    return Array.isArray(e) ? `[Array:${e.length}]` : "[Object]";
  if (t.add(e), Array.isArray(e)) {
    const o = e.slice(0, kv).map((s) => ms(s, t, r + 1));
    return t.delete(e), {
      __type: "array",
      length: e.length,
      preview: o
    };
  }
  const n = {}, i = Object.entries(e);
  for (const [o, s] of i.slice(0, no))
    n[o] = Uv.test(o) ? "***" : ms(s, t, r + 1);
  return i.length > no && (n.__truncatedKeys = i.length - no), t.delete(e), n;
}
function Gv(e) {
  if (!e || Object.keys(e).length === 0)
    return "";
  try {
    return ` meta=${JSON.stringify(ms(e))}`;
  } catch {
    return ` meta=${Sp(ms(e))}`;
  }
}
function zv(e) {
  const t = String(e || "main").trim().replace(/\s+/g, ":");
  return t ? t.slice(0, 120) : "main";
}
function Vv(e) {
  const t = String(e || "event").trim();
  return t ? t.slice(0, 160) : "event";
}
function Sp(e) {
  if (typeof e == "string")
    return e;
  if (e instanceof Error)
    return e.stack || `${e.name}: ${e.message}`;
  try {
    return Sy.inspect(e, {
      depth: 6,
      breakLength: 140,
      compact: !0,
      maxArrayLength: 100,
      maxStringLength: 1e4
    });
  } catch {
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  }
}
function Yv(e, t, r, n) {
  const i = n.toISOString(), o = process.pid, s = r.map((a) => Sp(a)).join(" ");
  return `[${i}] [${t}] [${e.toUpperCase()}] [pid:${o}] ${s}`;
}
function gn(e, t) {
  const r = Bv[e];
  console[e] = (...n) => {
    Ye(t, "main", ...n), r(...n);
  };
}
function Kv(e) {
  switch ((e || "").toLowerCase()) {
    case "debug":
      return "debug";
    case "warn":
      return "warn";
    case "error":
      return "error";
    case "info":
    default:
      return "info";
  }
}
function Xv(e) {
  return (e || "").toLowerCase() === "debug" ? "debug" : "info";
}
function Wc() {
  return Ds;
}
function bp() {
  return as;
}
function Tp() {
  return en;
}
function Cp(e) {
  const t = Xv(e), r = en !== t;
  return en = t, r && Ye("info", "main", `日志级别已切换为: ${t}`), en;
}
function Rp(e = /* @__PURE__ */ new Date()) {
  const t = wp(e);
  if (bc === t)
    return;
  bc = t;
  const r = e.getTime() - Ov, n = Fr();
  let i = [];
  try {
    i = nt.readdirSync(n, { withFileTypes: !0 });
  } catch (s) {
    tn(`[logger] failed to read log directory for cleanup: ${s instanceof Error ? s.message : String(s)}`);
    return;
  }
  let o = 0;
  for (const s of i) {
    if (!s.isFile())
      continue;
    const a = s.name;
    if (!yp.test(a))
      continue;
    const c = ke.join(n, a);
    let u = !1;
    try {
      u = nt.statSync(c).mtimeMs < r;
    } catch {
      const l = Wv(a);
      l !== null && (u = l < r);
    }
    if (u)
      try {
        nt.unlinkSync(c), o += 1;
      } catch (l) {
        tn(`[logger] failed to delete expired log file (${a}): ${l instanceof Error ? l.message : String(l)}`);
      }
  }
  o > 0 && tn(`[logger] cleaned up ${o} expired log file(s), retention=${Ds}d`);
}
function Fr() {
  return ki || (ki = ke.join(qv(), Nv), vp(ki)), ki;
}
function Ye(e, t, ...r) {
  if (!Hv(e))
    return;
  const n = /* @__PURE__ */ new Date(), i = Yv(e, t, r, n), o = Buffer.byteLength(`${i}
`, "utf8");
  try {
    Rp(n), jv(n, o).write(`${i}
`), ni += o;
  } catch (s) {
    tn(`[logger] write failed: ${s instanceof Error ? s.message : String(s)}`);
  }
}
function mi(e, t, r, n) {
  Ye(
    e,
    zv(t),
    `${Vv(r)}${Gv(n)}`
  );
}
function Tc(e, t, r) {
  mi("debug", e, t, r);
}
function Hc(e, t, r) {
  mi("info", e, t, r);
}
function jc(e, t, r) {
  mi("warn", e, t, r);
}
function Ap(e, t, r, n) {
  mi("error", e, t, {
    ...n,
    error: r === void 0 ? void 0 : _p(r)
  });
}
function Jv(e, t, r) {
  const n = Date.now();
  return Tc(e, `${t}.start`, r), {
    done(i) {
      Tc(e, `${t}.success`, {
        ...r,
        ...i,
        durationMs: Date.now() - n
      });
    },
    fail(i, o) {
      Ap(e, `${t}.failed`, i, {
        ...r,
        ...o,
        durationMs: Date.now() - n
      });
    }
  };
}
function at(e) {
  return {
    debug: (t, r) => Tc(e, t, r),
    info: (t, r) => Hc(e, t, r),
    warn: (t, r) => jc(e, t, r),
    error: (t, r, n) => Ap(e, t, r, n),
    timer: (t, r) => Jv(e, t, r)
  };
}
function Qv() {
  Ql || (vp(Fr()), Rp(), gn("debug", "debug"), gn("log", "info"), gn("info", "info"), gn("warn", "warn"), gn("error", "error"), Ql = !0, Ye(
    "info",
    "main",
    `日志系统已初始化，日志目录: ${Fr()}，级别: ${en}，保留天数: ${Ds}`
  ));
}
function Zv() {
  Zl || (Zl = !0, process.on("uncaughtException", (e) => {
    Ye("error", "main", "捕获未处理异常:", e);
  }), process.on("unhandledRejection", (e) => {
    Ye("error", "main", "捕获未处理 Promise 拒绝:", e);
  }));
}
function ew() {
  Mt && Ep(), Mt = null, cs = "", ls = "", ni = 0, Jr = 0, bc = "";
}
const Ve = at("desktop.behavior");
function yn(e) {
  return { ...e };
}
function Wr(e) {
  return { ...e };
}
function tw(e) {
  return { ...e };
}
function io(e, t) {
  return Object.keys(e).every((n) => e[n] === t[n]);
}
function rw(e) {
  const t = Lr.getPrimaryDisplay(), { x: r, y: n, width: i, height: o } = t.workArea, [s, a] = e.getSize(), [c, u] = e.getPosition();
  (s !== i || a !== o) && e.setSize(i, o), (c !== r || u !== n) && e.setPosition(r, n);
}
function nw(e, t) {
  if (t === "focus") {
    e.show(), e.focus(), e.moveTop();
    return;
  }
  if (t === "showInactive") {
    e.showInactive();
    return;
  }
  e.isVisible() || e.showInactive();
}
class iw {
  constructor() {
    _e(this, "capabilities", Mc());
    _e(this, "listeners", /* @__PURE__ */ new Set());
    _e(this, "mainWindow", null);
    _e(this, "mousePassthroughEnabled", !1);
    _e(this, "preferences", mp());
    _e(this, "runtime", xv());
    _e(this, "effective", ro(
      this.preferences,
      this.runtime,
      this.capabilities
    ));
    Ve.info("coordinator.create", {
      capabilities: this.capabilities,
      preferences: this.preferences,
      runtime: this.runtime,
      effective: this.effective
    }), Xy((t) => {
      this.setGameModeHidden(t);
    }), this.syncGameModePreference();
  }
  attachMainWindow(t) {
    Ve.info("main_window.attach", {
      windowId: t.id,
      effective: this.effective,
      mousePassthroughEnabled: this.mousePassthroughEnabled
    }), this.mainWindow = t, this.applyEffectiveState({
      previousEffective: null,
      nextEffective: this.effective,
      revealPolicy: "none",
      raiseToTop: this.effective.alwaysOnTop
    }), this.applyMousePassthrough(this.mousePassthroughEnabled, !0), t.on("closed", () => {
      this.mainWindow === t && (Ve.info("main_window.closed", { windowId: t.id }), this.mainWindow = null);
    });
  }
  reapplyMainWindowState(t) {
    Ve.debug("main_window.reapply", {
      raiseToTop: !!(t != null && t.raiseToTop),
      effective: this.effective
    }), this.applyEffectiveState({
      previousEffective: null,
      nextEffective: this.effective,
      revealPolicy: "none",
      raiseToTop: !!(t != null && t.raiseToTop && this.effective.alwaysOnTop)
    });
  }
  getPreferences() {
    return Wr(this.preferences);
  }
  getSnapshot() {
    return {
      preferences: Wr(this.preferences),
      runtime: yn(this.runtime),
      effective: tw(this.effective)
    };
  }
  onSnapshotChanged(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  setMousePassthrough(t) {
    return Ve.debug("mouse_passthrough.requested", {
      requested: !!t,
      current: this.mousePassthroughEnabled
    }), this.applyMousePassthrough(!!t), this.mousePassthroughEnabled;
  }
  updatePreferences(t) {
    const r = Wr(this.preferences), n = yn(this.runtime);
    return Ve.info("preferences.update", {
      patch: t,
      previousPreferences: r
    }), this.preferences = Dv(t), this.syncGameModePreference(), this.recomputeAndApply(r, n, { revealPolicy: "none" }), this.getPreferences();
  }
  setModelReady(t) {
    if (this.runtime.modelReady === t)
      return Ve.debug("model_ready.unchanged", { ready: t }), this.getSnapshot();
    Ve.info("model_ready.update", {
      previous: this.runtime.modelReady,
      next: t
    });
    const r = Wr(this.preferences), n = yn(this.runtime);
    return this.runtime = {
      ...this.runtime,
      modelReady: t
    }, this.recomputeAndApply(r, n, { revealPolicy: t ? "showInactive" : "none" }), this.getSnapshot();
  }
  setBackgroundPaused(t) {
    if (this.runtime.backgroundPaused === t)
      return Ve.debug("background_paused.unchanged", { paused: t }), this.getSnapshot();
    Ve.info("background_paused.update", {
      previous: this.runtime.backgroundPaused,
      next: t
    });
    const r = t ? "none" : "showInactive", n = Wr(this.preferences), i = yn(this.runtime);
    return this.runtime = {
      ...this.runtime,
      backgroundPaused: t
    }, this.recomputeAndApply(n, i, { revealPolicy: r }), this.getSnapshot();
  }
  setGameModeHidden(t) {
    if (this.runtime.gameModeHidden === t)
      return Ve.debug("game_mode_hidden.unchanged", { hidden: t }), this.getSnapshot();
    Ve.info("game_mode_hidden.update", {
      previous: this.runtime.gameModeHidden,
      next: t
    });
    const r = t ? "none" : "showInactive", n = Wr(this.preferences), i = yn(this.runtime);
    return this.runtime = {
      ...this.runtime,
      gameModeHidden: t
    }, this.recomputeAndApply(n, i, { revealPolicy: r }), this.getSnapshot();
  }
  requestReveal(t) {
    const r = t === "tray" || t === "manual" ? "focus" : "showInactive";
    return Ve.info("reveal.requested", {
      reason: t,
      revealPolicy: r,
      effective: this.effective
    }), this.applyEffectiveState({
      previousEffective: null,
      nextEffective: this.effective,
      revealPolicy: r,
      raiseToTop: this.effective.alwaysOnTop
    }), this.getSnapshot();
  }
  syncGameModePreference() {
    if (!this.capabilities.gameMode.supported) {
      Ve.debug("game_mode.sync.unsupported", {
        reason: this.capabilities.gameMode.reason
      }), Vl(), this.runtime.gameModeHidden && (this.runtime = {
        ...this.runtime,
        gameModeHidden: !1
      });
      return;
    }
    if (this.preferences.autoDetectFullscreen) {
      Ve.info("game_mode.sync.enable"), Ky();
      return;
    }
    Ve.info("game_mode.sync.disable"), Vl(), this.runtime.gameModeHidden && (this.runtime = {
      ...this.runtime,
      gameModeHidden: !1
    });
  }
  recomputeAndApply(t, r, n) {
    const i = ro(
      t,
      r,
      this.capabilities
    ), o = ro(
      this.preferences,
      this.runtime,
      this.capabilities
    ), s = !io(t, this.preferences), a = !io(r, this.runtime), c = !io(i, o);
    this.effective = o, c ? (Ve.info("effective.changed", {
      previousEffective: i,
      nextEffective: o,
      preferencesChanged: s,
      runtimeChanged: a,
      revealPolicy: (n == null ? void 0 : n.revealPolicy) ?? "none"
    }), this.applyEffectiveState({
      previousEffective: i,
      nextEffective: o,
      revealPolicy: (n == null ? void 0 : n.revealPolicy) ?? "none",
      raiseToTop: o.alwaysOnTop && (!i.alwaysOnTop || (n == null ? void 0 : n.revealPolicy) === "focus")
    })) : n != null && n.revealPolicy && n.revealPolicy !== "none" && (Ve.debug("effective.reveal_without_state_change", {
      nextEffective: o,
      revealPolicy: n.revealPolicy
    }), this.applyEffectiveState({
      previousEffective: null,
      nextEffective: o,
      revealPolicy: n.revealPolicy,
      raiseToTop: o.alwaysOnTop
    })), (s || a || c) && this.emitSnapshotChanged();
  }
  emitSnapshotChanged() {
    const t = this.getSnapshot();
    Ve.debug("snapshot.broadcast", { snapshot: t });
    for (const r of this.listeners)
      r(t);
  }
  applyEffectiveState(t) {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      Ve.debug("effective.apply.skipped", {
        reason: "main_window_unavailable",
        nextEffective: t.nextEffective
      });
      return;
    }
    const { previousEffective: r, nextEffective: n, revealPolicy: i, raiseToTop: o } = t, s = this.mainWindow;
    if (rw(s), Ve.debug("effective.apply.start", {
      windowId: s.id,
      previousEffective: r,
      nextEffective: n,
      revealPolicy: i,
      raiseToTop: o,
      visibleBefore: s.isVisible()
    }), r != null && r.alwaysOnTop && !n.alwaysOnTop && s.setAlwaysOnTop(!1), n.visible ? nw(s, i) : s.isVisible() && s.hide(), n.alwaysOnTop) {
      const a = n.zOrderLevel === "screen-saver" ? "screen-saver" : "normal";
      s.setAlwaysOnTop(!0, a), o && s.isVisible() && s.moveTop();
    }
    Ve.debug("effective.apply.done", {
      windowId: s.id,
      visibleAfter: s.isVisible(),
      alwaysOnTop: n.alwaysOnTop,
      zOrderLevel: n.zOrderLevel
    });
  }
  applyMousePassthrough(t, r = !1) {
    if (!r && this.mousePassthroughEnabled === t) {
      Ve.debug("mouse_passthrough.unchanged", { ignoreMouseEvents: t });
      return;
    }
    if (Ve.info("mouse_passthrough.apply", {
      previous: this.mousePassthroughEnabled,
      next: t,
      force: r,
      mousePassthroughForward: this.capabilities.mousePassthroughForward
    }), this.mousePassthroughEnabled = t, !this.mainWindow || this.mainWindow.isDestroyed()) {
      Ve.debug("mouse_passthrough.window_unavailable", { ignoreMouseEvents: t });
      return;
    }
    if (t) {
      this.capabilities.mousePassthroughForward ? this.mainWindow.setIgnoreMouseEvents(!0, { forward: !0 }) : this.mainWindow.setIgnoreMouseEvents(!0);
      return;
    }
    this.mainWindow.setIgnoreMouseEvents(!1);
  }
}
let so = null;
function gi() {
  return so || (so = new iw()), so;
}
const sw = "http://localhost:5173/";
function Gc() {
  return process.env.NODE_ENV === "development" || !Pe.isPackaged;
}
function zc(e, t) {
  return Gc() ? e.loadURL(new URL(`${t}.html`, sw).toString()) : e.loadFile(Q.join(Pe.getAppPath(), "dist", `${t}.html`));
}
const ow = Cs(import.meta.url), aw = Q.dirname(ow);
let rn = null;
function xs() {
  const e = Lr.getPrimaryDisplay(), { x: t, y: r, width: n, height: i } = e.workArea, o = new Qe({
    show: !1,
    width: n,
    height: i,
    x: t,
    y: r,
    title: "",
    icon: Is(),
    frame: !1,
    transparent: !0,
    backgroundColor: "#00000000",
    alwaysOnTop: !1,
    skipTaskbar: !0,
    resizable: !1,
    hasShadow: !1,
    ...process.platform === "win32" ? {
      thickFrame: !1
    } : {},
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: Q.join(aw, "preload.js"),
      backgroundThrottling: !1
    }
  });
  rn = o;
  const s = gi();
  s.attachMainWindow(o);
  const a = Gc();
  return zc(o, "main"), a && o.webContents.openDevTools({ mode: "detach" }), o.webContents.on("did-finish-load", () => {
    console.log("[主窗口] 页面加载完成"), !o.isDestroyed() && (o.setBackgroundColor("#00000000"), s.reapplyMainWindowState({ raiseToTop: !0 }));
  }), o.webContents.on("did-fail-load", (c, u, l, f) => {
    console.error("[主窗口] 页面加载失败:", u, l, f);
  }), o.on("closed", () => {
    rn === o && (rn = null);
  }), process.platform === "win32" && (o.removeMenu(), o.setMenuBarVisibility(!1)), o;
}
function mr() {
  return rn && !rn.isDestroyed() ? rn : null;
}
const cw = Cs(import.meta.url), lw = Q.dirname(cw);
let Vt = null;
function uw() {
  return Vt = new Qe({
    width: 650,
    height: 750,
    center: !0,
    icon: Is(),
    resizable: !1,
    frame: !1,
    transparent: !0,
    backgroundColor: "#00000000",
    alwaysOnTop: !0,
    skipTaskbar: !0,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: Q.join(lw, "preload.js")
    }
  }), zc(Vt, "welcome"), Vt.webContents.on("did-fail-load", (e, t, r, n) => {
    console.error("[欢迎窗口] 页面加载失败:", t, r, n);
  }), Vt.on("closed", () => {
    Vt = null;
  }), Vt;
}
function Pp() {
  Vt && (Vt.close(), Vt = null);
}
function Ns() {
  return {
    status: "idle",
    desiredState: "disconnected",
    activeConfigRevision: 0,
    serverUrl: "",
    hasToken: !1,
    session: null,
    reconnectAttempt: 0,
    nextRetryAt: null,
    suspendReason: null,
    lastError: null,
    lastDisconnect: null,
    updatedAt: Date.now()
  };
}
function ru(e) {
  const t = (e.serverUrl || "").trim(), r = (e.token || "").trim();
  if (!t)
    return {
      valid: !1,
      code: "INVALID_URL",
      message: "服务器地址不能为空"
    };
  let n;
  try {
    n = new URL(t);
  } catch {
    return {
      valid: !1,
      code: "INVALID_URL",
      message: "服务器地址格式无效，请填写完整的 WebSocket 地址"
    };
  }
  return n.protocol !== "ws:" && n.protocol !== "wss:" ? {
    valid: !1,
    code: "INVALID_URL",
    message: "服务器地址必须使用 ws 或 wss 协议"
  } : r ? { valid: !0 } : {
    valid: !1,
    code: "TOKEN_REQUIRED",
    message: "认证密钥不能为空，请在设置中填写后再连接"
  };
}
const Ip = 3, dw = "ws://127.0.0.1:9090/astrbot/live2d";
function Dp() {
  return {
    serverUrl: dw,
    token: "",
    customResourceBaseUrl: "",
    customResourcePath: "",
    customResourceToken: ""
  };
}
function Vc(e) {
  const t = Dp(), r = e || {};
  return {
    serverUrl: typeof r.serverUrl == "string" && r.serverUrl.trim() ? r.serverUrl.trim() : t.serverUrl,
    token: typeof r.token == "string" ? r.token.trim() : t.token,
    customResourceBaseUrl: typeof r.customResourceBaseUrl == "string" ? r.customResourceBaseUrl.trim() : t.customResourceBaseUrl,
    customResourcePath: typeof r.customResourcePath == "string" ? r.customResourcePath.trim() : t.customResourcePath,
    customResourceToken: typeof r.customResourceToken == "string" ? r.customResourceToken.trim() : t.customResourceToken
  };
}
const xp = Rt.connectionSettingsV3, fw = "data";
function hr(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Yc(e) {
  return e instanceof Error ? e.message : typeof e == "string" ? e : String(e);
}
function hw(e, t = 0) {
  return typeof e == "number" && Number.isFinite(e) ? Math.max(0, Math.floor(e)) : t;
}
function pw(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? Math.floor(e) : Date.now();
}
function nu(e) {
  const t = e.trim();
  if (!t)
    return { mode: "plain", value: "" };
  if (!an.isEncryptionAvailable())
    return { mode: "plain", value: t };
  try {
    return { mode: "encrypted", value: an.encryptString(t).toString("base64") };
  } catch (r) {
    return console.warn("[ConnectionSettingsService] 令牌加密失败，降级为明文存储:", r), { mode: "plain", value: t };
  }
}
function iu(e) {
  if (typeof e == "string")
    return e.trim();
  if (!hr(e))
    return "";
  const t = e.mode, r = typeof e.value == "string" ? e.value.trim() : "";
  if (!r)
    return "";
  if (t !== "encrypted" || !an.isEncryptionAvailable())
    return r;
  try {
    return an.decryptString(Buffer.from(r, "base64")).trim();
  } catch {
    return r;
  }
}
function Kc() {
  return {
    ...Dp(),
    revision: 0,
    updatedAt: Date.now()
  };
}
function mw(e) {
  return {
    serverUrl: e.serverUrl,
    token: e.token,
    customResourceBaseUrl: e.customResourceBaseUrl,
    customResourcePath: e.customResourcePath,
    customResourceToken: e.customResourceToken
  };
}
function gw(e) {
  return {
    serverUrl: e.serverUrl,
    token: nu(e.token),
    customResourceBaseUrl: e.customResourceBaseUrl,
    customResourcePath: e.customResourcePath,
    customResourceToken: nu(e.customResourceToken),
    revision: e.revision,
    updatedAt: e.updatedAt
  };
}
function yw(e) {
  return {
    ...Vc({
      serverUrl: typeof e.serverUrl == "string" ? e.serverUrl : void 0,
      token: typeof e.token == "string" ? e.token : void 0,
      customResourceBaseUrl: typeof e.customResourceBaseUrl == "string" ? e.customResourceBaseUrl : void 0,
      customResourcePath: typeof e.customResourcePath == "string" ? e.customResourcePath : void 0,
      customResourceToken: typeof e.customResourceToken == "string" ? e.customResourceToken : void 0
    }),
    revision: hw(e.revision, 0),
    updatedAt: pw(e.updatedAt)
  };
}
function vw(e) {
  if (!hr(e))
    return null;
  const t = e, r = t.version === Ip && hr(t.data) ? t.data : e;
  return hr(r) ? yw({
    serverUrl: r.serverUrl,
    token: iu(r.token),
    customResourceBaseUrl: r.customResourceBaseUrl,
    customResourcePath: r.customResourcePath,
    customResourceToken: iu(r.customResourceToken),
    revision: r.revision,
    updatedAt: r.updatedAt
  }) : null;
}
function Xc() {
  const e = vt(xp);
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return vw(t);
  } catch (t) {
    return console.warn("[ConnectionSettingsService] 读取配置 JSON 失败，已忽略旧值:", t), null;
  }
}
function Np(e) {
  const t = {
    version: Ip,
    data: gw(e)
  };
  wt(xp, JSON.stringify(t));
}
function ww(e) {
  return hr(e) ? hr(e.data) ? typeof e.expectedRevision != "number" || !Number.isFinite(e.expectedRevision) || e.expectedRevision < 0 ? "expectedRevision 必须是非负整数" : null : "data 字段必须是对象" : "请求体必须是对象";
}
function Ew(e) {
  if (!hr(e))
    return null;
  const t = e[fw];
  return hr(t) ? t : e;
}
function _w(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  if (!t || !an.isEncryptionAvailable())
    return null;
  try {
    return an.decryptString(Buffer.from(t, "base64")).trim();
  } catch {
    return null;
  }
}
function su(e, t) {
  const r = _w(e);
  return r !== null ? r : typeof t == "string" ? t.trim() : "";
}
function Sw(e) {
  return Vc({
    serverUrl: typeof e.serverUrl == "string" ? e.serverUrl : void 0,
    token: su(e.encryptedToken, e.token),
    customResourceBaseUrl: typeof e.customResourceBaseUrl == "string" ? e.customResourceBaseUrl : typeof e.resourceOverrideBaseUrl == "string" ? e.resourceOverrideBaseUrl : "",
    customResourcePath: typeof e.customResourcePath == "string" ? e.customResourcePath : typeof e.resourceOverridePath == "string" ? e.resourceOverridePath : "",
    customResourceToken: su(e.encryptedResourceToken, e.customResourceToken ?? e.resourceToken)
  });
}
function Op() {
  try {
    return {
      success: !0,
      data: Xc() ?? Kc()
    };
  } catch (e) {
    return {
      success: !1,
      code: "PERSIST_FAILED",
      message: `读取连接配置失败: ${Yc(e)}`
    };
  }
}
function bw(e) {
  const t = ww(e);
  if (t)
    return {
      success: !1,
      code: "INVALID_PAYLOAD",
      message: t
    };
  try {
    const r = Xc() ?? Kc();
    if (Math.floor(e.expectedRevision) !== r.revision)
      return {
        success: !1,
        code: "CONFLICT_REVISION",
        message: `配置已更新到 revision=${r.revision}，请刷新后重试`
      };
    const o = {
      ...Vc(e.data),
      revision: r.revision + 1,
      updatedAt: Date.now()
    };
    return Np(o), {
      success: !0,
      data: o
    };
  } catch (r) {
    return {
      success: !1,
      code: "PERSIST_FAILED",
      message: `保存连接配置失败: ${Yc(r)}`
    };
  }
}
function Tw(e) {
  if (typeof e != "string" || !e.trim())
    return {
      success: !1,
      code: "INVALID_PAYLOAD",
      message: "缺少旧版连接配置内容"
    };
  try {
    const t = Xc();
    if (t)
      return {
        success: !0,
        data: t
      };
    const r = JSON.parse(e), n = Ew(r);
    if (!n)
      return {
        success: !1,
        code: "MIGRATION_FAILED",
        message: "旧版连接配置格式无效"
      };
    const o = {
      ...Sw(n),
      revision: 1,
      updatedAt: Date.now()
    };
    return Np(o), {
      success: !0,
      data: o
    };
  } catch (t) {
    return {
      success: !1,
      code: "MIGRATION_FAILED",
      message: `迁移旧版连接配置失败: ${Yc(t)}`
    };
  }
}
function ou() {
  const e = Kc();
  return {
    ...mw(e),
    revision: e.revision,
    updatedAt: e.updatedAt
  };
}
const Lp = 1, Cw = 250, Rw = 3e5, Aw = 1, Pw = 1e3, Iw = 1e3, Dw = 6e4;
function fr() {
  return {
    autoConnectOnAppLaunch: !0,
    resumeDesiredConnectionOnWake: !0,
    retryEnabled: !0,
    retryBaseDelayMs: 1e3,
    retryMaxDelayMs: 3e4,
    retryMaxAttempts: null,
    handshakeTimeoutMs: 8e3
  };
}
function oo(e, t) {
  return typeof e == "boolean" ? e : t;
}
function au(e, t) {
  const r = typeof e == "number" ? e : Number(e);
  return Number.isFinite(r) ? Math.max(Cw, Math.min(Rw, Math.round(r))) : t;
}
function xw(e, t) {
  if (e === null)
    return null;
  const r = typeof e == "number" ? e : Number(e);
  return Number.isFinite(r) ? Math.max(Aw, Math.min(Pw, Math.round(r))) : t;
}
function Nw(e, t) {
  const r = typeof e == "number" ? e : Number(e);
  return Number.isFinite(r) ? Math.max(Iw, Math.min(Dw, Math.round(r))) : t;
}
function Os(e) {
  const t = fr(), r = e || {}, n = au(r.retryBaseDelayMs, t.retryBaseDelayMs), i = Math.max(
    n,
    au(r.retryMaxDelayMs, t.retryMaxDelayMs)
  );
  return {
    autoConnectOnAppLaunch: oo(r.autoConnectOnAppLaunch, t.autoConnectOnAppLaunch),
    resumeDesiredConnectionOnWake: oo(
      r.resumeDesiredConnectionOnWake,
      t.resumeDesiredConnectionOnWake
    ),
    retryEnabled: oo(r.retryEnabled, t.retryEnabled),
    retryBaseDelayMs: n,
    retryMaxDelayMs: i,
    retryMaxAttempts: xw(r.retryMaxAttempts, t.retryMaxAttempts),
    handshakeTimeoutMs: Nw(r.handshakeTimeoutMs, t.handshakeTimeoutMs)
  };
}
const Fp = Rt.connectionBehaviorSettingsV1;
function ui(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Jc(e) {
  return e instanceof Error ? e.message : typeof e == "string" ? e : String(e);
}
function Ow() {
  const e = vt(Fp);
  if (!e)
    return null;
  const t = JSON.parse(e);
  return ui(t) ? t : null;
}
function Qc() {
  try {
    const e = Ow();
    return !e || e.version !== Lp || !ui(e.data) ? {
      exists: !1,
      settings: fr()
    } : {
      exists: !0,
      settings: Os(e.data)
    };
  } catch (e) {
    return console.error("[ConnectionBehaviorSettingsService] 读取连接行为配置失败:", e), {
      exists: !1,
      settings: fr()
    };
  }
}
function kp(e) {
  const t = {
    version: Lp,
    data: Os(e)
  };
  wt(Fp, JSON.stringify(t));
}
function Lw(e) {
  if (!e.trim())
    return fr().autoConnectOnAppLaunch;
  try {
    const t = JSON.parse(e);
    if (!ui(t))
      return fr().autoConnectOnAppLaunch;
    const r = t;
    return typeof r.autoConnect == "boolean" ? r.autoConnect : fr().autoConnectOnAppLaunch;
  } catch (t) {
    return console.error("[ConnectionBehaviorSettingsService] 解析旧版高级设置失败:", t), fr().autoConnectOnAppLaunch;
  }
}
function cu() {
  return Qc();
}
function Fw() {
  try {
    return {
      success: !0,
      data: Qc().settings
    };
  } catch (e) {
    return {
      success: !1,
      code: "PERSIST_FAILED",
      message: `读取连接行为配置失败: ${Jc(e)}`
    };
  }
}
function kw(e) {
  if (!ui(e) || !ui(e.data))
    return {
      success: !1,
      code: "INVALID_PAYLOAD",
      message: "连接行为配置请求体无效"
    };
  try {
    const t = Os(e.data);
    return kp(t), {
      success: !0,
      data: t
    };
  } catch (t) {
    return {
      success: !1,
      code: "PERSIST_FAILED",
      message: `保存连接行为配置失败: ${Jc(t)}`
    };
  }
}
function Uw(e) {
  try {
    const t = Qc();
    if (t.exists)
      return {
        success: !0,
        data: t.settings
      };
    const r = fr(), n = Os({
      ...r,
      autoConnectOnAppLaunch: Lw(e)
    });
    return kp(n), {
      success: !0,
      data: n
    };
  } catch (t) {
    return {
      success: !1,
      code: "MIGRATION_FAILED",
      message: `迁移旧版连接行为配置失败: ${Jc(t)}`
    };
  }
}
var Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Up(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var vn = { exports: {} }, ao, lu;
function gr() {
  if (lu) return ao;
  lu = 1;
  const e = ["nodebuffer", "arraybuffer", "fragments"], t = typeof Blob < "u";
  return t && e.push("blob"), ao = {
    BINARY_TYPES: e,
    CLOSE_TIMEOUT: 3e4,
    EMPTY_BUFFER: Buffer.alloc(0),
    GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    hasBlob: t,
    kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
    kListener: Symbol("kListener"),
    kStatusCode: Symbol("status-code"),
    kWebSocket: Symbol("websocket"),
    NOOP: () => {
    }
  }, ao;
}
var uu;
function Ls() {
  if (uu) return vn.exports;
  uu = 1;
  const { EMPTY_BUFFER: e } = gr(), t = Buffer[Symbol.species];
  function r(a, c) {
    if (a.length === 0) return e;
    if (a.length === 1) return a[0];
    const u = Buffer.allocUnsafe(c);
    let l = 0;
    for (let f = 0; f < a.length; f++) {
      const d = a[f];
      u.set(d, l), l += d.length;
    }
    return l < c ? new t(u.buffer, u.byteOffset, l) : u;
  }
  function n(a, c, u, l, f) {
    for (let d = 0; d < f; d++)
      u[l + d] = a[d] ^ c[d & 3];
  }
  function i(a, c) {
    for (let u = 0; u < a.length; u++)
      a[u] ^= c[u & 3];
  }
  function o(a) {
    return a.length === a.buffer.byteLength ? a.buffer : a.buffer.slice(a.byteOffset, a.byteOffset + a.length);
  }
  function s(a) {
    if (s.readOnly = !0, Buffer.isBuffer(a)) return a;
    let c;
    return a instanceof ArrayBuffer ? c = new t(a) : ArrayBuffer.isView(a) ? c = new t(a.buffer, a.byteOffset, a.byteLength) : (c = Buffer.from(a), s.readOnly = !1), c;
  }
  if (vn.exports = {
    concat: r,
    mask: n,
    toArrayBuffer: o,
    toBuffer: s,
    unmask: i
  }, !process.env.WS_NO_BUFFER_UTIL)
    try {
      const a = require("bufferutil");
      vn.exports.mask = function(c, u, l, f, d) {
        d < 48 ? n(c, u, l, f, d) : a.mask(c, u, l, f, d);
      }, vn.exports.unmask = function(c, u) {
        c.length < 32 ? i(c, u) : a.unmask(c, u);
      };
    } catch {
    }
  return vn.exports;
}
var co, du;
function Mw() {
  if (du) return co;
  du = 1;
  const e = Symbol("kDone"), t = Symbol("kRun");
  class r {
    /**
     * Creates a new `Limiter`.
     *
     * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
     *     to run concurrently
     */
    constructor(i) {
      this[e] = () => {
        this.pending--, this[t]();
      }, this.concurrency = i || 1 / 0, this.jobs = [], this.pending = 0;
    }
    /**
     * Adds a job to the queue.
     *
     * @param {Function} job The job to run
     * @public
     */
    add(i) {
      this.jobs.push(i), this[t]();
    }
    /**
     * Removes a job from the queue and runs it if possible.
     *
     * @private
     */
    [t]() {
      if (this.pending !== this.concurrency && this.jobs.length) {
        const i = this.jobs.shift();
        this.pending++, i(this[e]);
      }
    }
  }
  return co = r, co;
}
var lo, fu;
function yi() {
  if (fu) return lo;
  fu = 1;
  const e = kc, t = Ls(), r = Mw(), { kStatusCode: n } = gr(), i = Buffer[Symbol.species], o = Buffer.from([0, 0, 255, 255]), s = Symbol("permessage-deflate"), a = Symbol("total-length"), c = Symbol("callback"), u = Symbol("buffers"), l = Symbol("error");
  let f;
  class d {
    /**
     * Creates a PerMessageDeflate instance.
     *
     * @param {Object} [options] Configuration options
     * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
     *     for, or request, a custom client window size
     * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
     *     acknowledge disabling of client context takeover
     * @param {Number} [options.concurrencyLimit=10] The number of concurrent
     *     calls to zlib
     * @param {Boolean} [options.isServer=false] Create the instance in either
     *     server or client mode
     * @param {Number} [options.maxPayload=0] The maximum allowed message length
     * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
     *     use of a custom server window size
     * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
     *     disabling of server context takeover
     * @param {Number} [options.threshold=1024] Size (in bytes) below which
     *     messages should not be compressed if context takeover is disabled
     * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
     *     deflate
     * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
     *     inflate
     */
    constructor(S) {
      if (this._options = S || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._maxPayload = this._options.maxPayload | 0, this._isServer = !!this._options.isServer, this._deflate = null, this._inflate = null, this.params = null, !f) {
        const C = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
        f = new r(C);
      }
    }
    /**
     * @type {String}
     */
    static get extensionName() {
      return "permessage-deflate";
    }
    /**
     * Create an extension negotiation offer.
     *
     * @return {Object} Extension parameters
     * @public
     */
    offer() {
      const S = {};
      return this._options.serverNoContextTakeover && (S.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (S.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (S.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? S.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits == null && (S.client_max_window_bits = !0), S;
    }
    /**
     * Accept an extension negotiation offer/response.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Object} Accepted configuration
     * @public
     */
    accept(S) {
      return S = this.normalizeParams(S), this.params = this._isServer ? this.acceptAsServer(S) : this.acceptAsClient(S), this.params;
    }
    /**
     * Releases all resources used by the extension.
     *
     * @public
     */
    cleanup() {
      if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
        const S = this._deflate[c];
        this._deflate.close(), this._deflate = null, S && S(
          new Error(
            "The deflate stream was closed while data was being processed"
          )
        );
      }
    }
    /**
     *  Accept an extension negotiation offer.
     *
     * @param {Array} offers The extension negotiation offers
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsServer(S) {
      const C = this._options, A = S.find((x) => !(C.serverNoContextTakeover === !1 && x.server_no_context_takeover || x.server_max_window_bits && (C.serverMaxWindowBits === !1 || typeof C.serverMaxWindowBits == "number" && C.serverMaxWindowBits > x.server_max_window_bits) || typeof C.clientMaxWindowBits == "number" && !x.client_max_window_bits));
      if (!A)
        throw new Error("None of the extension offers can be accepted");
      return C.serverNoContextTakeover && (A.server_no_context_takeover = !0), C.clientNoContextTakeover && (A.client_no_context_takeover = !0), typeof C.serverMaxWindowBits == "number" && (A.server_max_window_bits = C.serverMaxWindowBits), typeof C.clientMaxWindowBits == "number" ? A.client_max_window_bits = C.clientMaxWindowBits : (A.client_max_window_bits === !0 || C.clientMaxWindowBits === !1) && delete A.client_max_window_bits, A;
    }
    /**
     * Accept the extension negotiation response.
     *
     * @param {Array} response The extension negotiation response
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsClient(S) {
      const C = S[0];
      if (this._options.clientNoContextTakeover === !1 && C.client_no_context_takeover)
        throw new Error('Unexpected parameter "client_no_context_takeover"');
      if (!C.client_max_window_bits)
        typeof this._options.clientMaxWindowBits == "number" && (C.client_max_window_bits = this._options.clientMaxWindowBits);
      else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && C.client_max_window_bits > this._options.clientMaxWindowBits)
        throw new Error(
          'Unexpected or invalid parameter "client_max_window_bits"'
        );
      return C;
    }
    /**
     * Normalize parameters.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Array} The offers/response with normalized parameters
     * @private
     */
    normalizeParams(S) {
      return S.forEach((C) => {
        Object.keys(C).forEach((A) => {
          let x = C[A];
          if (x.length > 1)
            throw new Error(`Parameter "${A}" must have only a single value`);
          if (x = x[0], A === "client_max_window_bits") {
            if (x !== !0) {
              const w = +x;
              if (!Number.isInteger(w) || w < 8 || w > 15)
                throw new TypeError(
                  `Invalid value for parameter "${A}": ${x}`
                );
              x = w;
            } else if (!this._isServer)
              throw new TypeError(
                `Invalid value for parameter "${A}": ${x}`
              );
          } else if (A === "server_max_window_bits") {
            const w = +x;
            if (!Number.isInteger(w) || w < 8 || w > 15)
              throw new TypeError(
                `Invalid value for parameter "${A}": ${x}`
              );
            x = w;
          } else if (A === "client_no_context_takeover" || A === "server_no_context_takeover") {
            if (x !== !0)
              throw new TypeError(
                `Invalid value for parameter "${A}": ${x}`
              );
          } else
            throw new Error(`Unknown parameter "${A}"`);
          C[A] = x;
        });
      }), S;
    }
    /**
     * Decompress data. Concurrency limited.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    decompress(S, C, A) {
      f.add((x) => {
        this._decompress(S, C, (w, E) => {
          x(), A(w, E);
        });
      });
    }
    /**
     * Compress data. Concurrency limited.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    compress(S, C, A) {
      f.add((x) => {
        this._compress(S, C, (w, E) => {
          x(), A(w, E);
        });
      });
    }
    /**
     * Decompress data.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _decompress(S, C, A) {
      const x = this._isServer ? "client" : "server";
      if (!this._inflate) {
        const w = `${x}_max_window_bits`, E = typeof this.params[w] != "number" ? e.Z_DEFAULT_WINDOWBITS : this.params[w];
        this._inflate = e.createInflateRaw({
          ...this._options.zlibInflateOptions,
          windowBits: E
        }), this._inflate[s] = this, this._inflate[a] = 0, this._inflate[u] = [], this._inflate.on("error", y), this._inflate.on("data", g);
      }
      this._inflate[c] = A, this._inflate.write(S), C && this._inflate.write(o), this._inflate.flush(() => {
        const w = this._inflate[l];
        if (w) {
          this._inflate.close(), this._inflate = null, A(w);
          return;
        }
        const E = t.concat(
          this._inflate[u],
          this._inflate[a]
        );
        this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[a] = 0, this._inflate[u] = [], C && this.params[`${x}_no_context_takeover`] && this._inflate.reset()), A(null, E);
      });
    }
    /**
     * Compress data.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _compress(S, C, A) {
      const x = this._isServer ? "server" : "client";
      if (!this._deflate) {
        const w = `${x}_max_window_bits`, E = typeof this.params[w] != "number" ? e.Z_DEFAULT_WINDOWBITS : this.params[w];
        this._deflate = e.createDeflateRaw({
          ...this._options.zlibDeflateOptions,
          windowBits: E
        }), this._deflate[a] = 0, this._deflate[u] = [], this._deflate.on("data", p);
      }
      this._deflate[c] = A, this._deflate.write(S), this._deflate.flush(e.Z_SYNC_FLUSH, () => {
        if (!this._deflate)
          return;
        let w = t.concat(
          this._deflate[u],
          this._deflate[a]
        );
        C && (w = new i(w.buffer, w.byteOffset, w.length - 4)), this._deflate[c] = null, this._deflate[a] = 0, this._deflate[u] = [], C && this.params[`${x}_no_context_takeover`] && this._deflate.reset(), A(null, w);
      });
    }
  }
  lo = d;
  function p(m) {
    this[u].push(m), this[a] += m.length;
  }
  function g(m) {
    if (this[a] += m.length, this[s]._maxPayload < 1 || this[a] <= this[s]._maxPayload) {
      this[u].push(m);
      return;
    }
    this[l] = new RangeError("Max payload size exceeded"), this[l].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[l][n] = 1009, this.removeListener("data", g), this.reset();
  }
  function y(m) {
    if (this[s]._inflate = null, this[l]) {
      this[c](this[l]);
      return;
    }
    m[n] = 1007, this[c](m);
  }
  return lo;
}
var wn = { exports: {} }, hu;
function vi() {
  if (hu) return wn.exports;
  hu = 1;
  const { isUtf8: e } = Cy, { hasBlob: t } = gr(), r = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0 - 15
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 16 - 31
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    // 32 - 47
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    // 48 - 63
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 64 - 79
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    // 80 - 95
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 96 - 111
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    0,
    1,
    0
    // 112 - 127
  ];
  function n(s) {
    return s >= 1e3 && s <= 1014 && s !== 1004 && s !== 1005 && s !== 1006 || s >= 3e3 && s <= 4999;
  }
  function i(s) {
    const a = s.length;
    let c = 0;
    for (; c < a; )
      if ((s[c] & 128) === 0)
        c++;
      else if ((s[c] & 224) === 192) {
        if (c + 1 === a || (s[c + 1] & 192) !== 128 || (s[c] & 254) === 192)
          return !1;
        c += 2;
      } else if ((s[c] & 240) === 224) {
        if (c + 2 >= a || (s[c + 1] & 192) !== 128 || (s[c + 2] & 192) !== 128 || s[c] === 224 && (s[c + 1] & 224) === 128 || // Overlong
        s[c] === 237 && (s[c + 1] & 224) === 160)
          return !1;
        c += 3;
      } else if ((s[c] & 248) === 240) {
        if (c + 3 >= a || (s[c + 1] & 192) !== 128 || (s[c + 2] & 192) !== 128 || (s[c + 3] & 192) !== 128 || s[c] === 240 && (s[c + 1] & 240) === 128 || // Overlong
        s[c] === 244 && s[c + 1] > 143 || s[c] > 244)
          return !1;
        c += 4;
      } else
        return !1;
    return !0;
  }
  function o(s) {
    return t && typeof s == "object" && typeof s.arrayBuffer == "function" && typeof s.type == "string" && typeof s.stream == "function" && (s[Symbol.toStringTag] === "Blob" || s[Symbol.toStringTag] === "File");
  }
  if (wn.exports = {
    isBlob: o,
    isValidStatusCode: n,
    isValidUTF8: i,
    tokenChars: r
  }, e)
    wn.exports.isValidUTF8 = function(s) {
      return s.length < 24 ? i(s) : e(s);
    };
  else if (!process.env.WS_NO_UTF_8_VALIDATE)
    try {
      const s = require("utf-8-validate");
      wn.exports.isValidUTF8 = function(a) {
        return a.length < 32 ? i(a) : s(a);
      };
    } catch {
    }
  return wn.exports;
}
var uo, pu;
function Mp() {
  if (pu) return uo;
  pu = 1;
  const { Writable: e } = qt, t = yi(), {
    BINARY_TYPES: r,
    EMPTY_BUFFER: n,
    kStatusCode: i,
    kWebSocket: o
  } = gr(), { concat: s, toArrayBuffer: a, unmask: c } = Ls(), { isValidStatusCode: u, isValidUTF8: l } = vi(), f = Buffer[Symbol.species], d = 0, p = 1, g = 2, y = 3, m = 4, S = 5, C = 6;
  class A extends e {
    /**
     * Creates a Receiver instance.
     *
     * @param {Object} [options] Options object
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {String} [options.binaryType=nodebuffer] The type for binary data
     * @param {Object} [options.extensions] An object containing the negotiated
     *     extensions
     * @param {Boolean} [options.isServer=false] Specifies whether to operate in
     *     client or server mode
     * @param {Number} [options.maxPayload=0] The maximum allowed message length
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     */
    constructor(w = {}) {
      super(), this._allowSynchronousEvents = w.allowSynchronousEvents !== void 0 ? w.allowSynchronousEvents : !0, this._binaryType = w.binaryType || r[0], this._extensions = w.extensions || {}, this._isServer = !!w.isServer, this._maxPayload = w.maxPayload | 0, this._skipUTF8Validation = !!w.skipUTF8Validation, this[o] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = d;
    }
    /**
     * Implements `Writable.prototype._write()`.
     *
     * @param {Buffer} chunk The chunk of data to write
     * @param {String} encoding The character encoding of `chunk`
     * @param {Function} cb Callback
     * @private
     */
    _write(w, E, b) {
      if (this._opcode === 8 && this._state == d) return b();
      this._bufferedBytes += w.length, this._buffers.push(w), this.startLoop(b);
    }
    /**
     * Consumes `n` bytes from the buffered data.
     *
     * @param {Number} n The number of bytes to consume
     * @return {Buffer} The consumed bytes
     * @private
     */
    consume(w) {
      if (this._bufferedBytes -= w, w === this._buffers[0].length) return this._buffers.shift();
      if (w < this._buffers[0].length) {
        const b = this._buffers[0];
        return this._buffers[0] = new f(
          b.buffer,
          b.byteOffset + w,
          b.length - w
        ), new f(b.buffer, b.byteOffset, w);
      }
      const E = Buffer.allocUnsafe(w);
      do {
        const b = this._buffers[0], v = E.length - w;
        w >= b.length ? E.set(this._buffers.shift(), v) : (E.set(new Uint8Array(b.buffer, b.byteOffset, w), v), this._buffers[0] = new f(
          b.buffer,
          b.byteOffset + w,
          b.length - w
        )), w -= b.length;
      } while (w > 0);
      return E;
    }
    /**
     * Starts the parsing loop.
     *
     * @param {Function} cb Callback
     * @private
     */
    startLoop(w) {
      this._loop = !0;
      do
        switch (this._state) {
          case d:
            this.getInfo(w);
            break;
          case p:
            this.getPayloadLength16(w);
            break;
          case g:
            this.getPayloadLength64(w);
            break;
          case y:
            this.getMask();
            break;
          case m:
            this.getData(w);
            break;
          case S:
          case C:
            this._loop = !1;
            return;
        }
      while (this._loop);
      this._errored || w();
    }
    /**
     * Reads the first two bytes of a frame.
     *
     * @param {Function} cb Callback
     * @private
     */
    getInfo(w) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return;
      }
      const E = this.consume(2);
      if ((E[0] & 48) !== 0) {
        const v = this.createError(
          RangeError,
          "RSV2 and RSV3 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_2_3"
        );
        w(v);
        return;
      }
      const b = (E[0] & 64) === 64;
      if (b && !this._extensions[t.extensionName]) {
        const v = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        w(v);
        return;
      }
      if (this._fin = (E[0] & 128) === 128, this._opcode = E[0] & 15, this._payloadLength = E[1] & 127, this._opcode === 0) {
        if (b) {
          const v = this.createError(
            RangeError,
            "RSV1 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          w(v);
          return;
        }
        if (!this._fragmented) {
          const v = this.createError(
            RangeError,
            "invalid opcode 0",
            !0,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          w(v);
          return;
        }
        this._opcode = this._fragmented;
      } else if (this._opcode === 1 || this._opcode === 2) {
        if (this._fragmented) {
          const v = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            !0,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          w(v);
          return;
        }
        this._compressed = b;
      } else if (this._opcode > 7 && this._opcode < 11) {
        if (!this._fin) {
          const v = this.createError(
            RangeError,
            "FIN must be set",
            !0,
            1002,
            "WS_ERR_EXPECTED_FIN"
          );
          w(v);
          return;
        }
        if (b) {
          const v = this.createError(
            RangeError,
            "RSV1 must be clear",
            !0,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          w(v);
          return;
        }
        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
          const v = this.createError(
            RangeError,
            `invalid payload length ${this._payloadLength}`,
            !0,
            1002,
            "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
          );
          w(v);
          return;
        }
      } else {
        const v = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        w(v);
        return;
      }
      if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (E[1] & 128) === 128, this._isServer) {
        if (!this._masked) {
          const v = this.createError(
            RangeError,
            "MASK must be set",
            !0,
            1002,
            "WS_ERR_EXPECTED_MASK"
          );
          w(v);
          return;
        }
      } else if (this._masked) {
        const v = this.createError(
          RangeError,
          "MASK must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_MASK"
        );
        w(v);
        return;
      }
      this._payloadLength === 126 ? this._state = p : this._payloadLength === 127 ? this._state = g : this.haveLength(w);
    }
    /**
     * Gets extended payload length (7+16).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength16(w) {
      if (this._bufferedBytes < 2) {
        this._loop = !1;
        return;
      }
      this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(w);
    }
    /**
     * Gets extended payload length (7+64).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength64(w) {
      if (this._bufferedBytes < 8) {
        this._loop = !1;
        return;
      }
      const E = this.consume(8), b = E.readUInt32BE(0);
      if (b > Math.pow(2, 21) - 1) {
        const v = this.createError(
          RangeError,
          "Unsupported WebSocket frame: payload length > 2^53 - 1",
          !1,
          1009,
          "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
        );
        w(v);
        return;
      }
      this._payloadLength = b * Math.pow(2, 32) + E.readUInt32BE(4), this.haveLength(w);
    }
    /**
     * Payload length has been read.
     *
     * @param {Function} cb Callback
     * @private
     */
    haveLength(w) {
      if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) {
        const E = this.createError(
          RangeError,
          "Max payload size exceeded",
          !1,
          1009,
          "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
        );
        w(E);
        return;
      }
      this._masked ? this._state = y : this._state = m;
    }
    /**
     * Reads mask bytes.
     *
     * @private
     */
    getMask() {
      if (this._bufferedBytes < 4) {
        this._loop = !1;
        return;
      }
      this._mask = this.consume(4), this._state = m;
    }
    /**
     * Reads data bytes.
     *
     * @param {Function} cb Callback
     * @private
     */
    getData(w) {
      let E = n;
      if (this._payloadLength) {
        if (this._bufferedBytes < this._payloadLength) {
          this._loop = !1;
          return;
        }
        E = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0 && c(E, this._mask);
      }
      if (this._opcode > 7) {
        this.controlMessage(E, w);
        return;
      }
      if (this._compressed) {
        this._state = S, this.decompress(E, w);
        return;
      }
      E.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(E)), this.dataMessage(w);
    }
    /**
     * Decompresses data.
     *
     * @param {Buffer} data Compressed data
     * @param {Function} cb Callback
     * @private
     */
    decompress(w, E) {
      this._extensions[t.extensionName].decompress(w, this._fin, (v, P) => {
        if (v) return E(v);
        if (P.length) {
          if (this._messageLength += P.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
            const T = this.createError(
              RangeError,
              "Max payload size exceeded",
              !1,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            E(T);
            return;
          }
          this._fragments.push(P);
        }
        this.dataMessage(E), this._state === d && this.startLoop(E);
      });
    }
    /**
     * Handles a data message.
     *
     * @param {Function} cb Callback
     * @private
     */
    dataMessage(w) {
      if (!this._fin) {
        this._state = d;
        return;
      }
      const E = this._messageLength, b = this._fragments;
      if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
        let v;
        this._binaryType === "nodebuffer" ? v = s(b, E) : this._binaryType === "arraybuffer" ? v = a(s(b, E)) : this._binaryType === "blob" ? v = new Blob(b) : v = b, this._allowSynchronousEvents ? (this.emit("message", v, !0), this._state = d) : (this._state = C, setImmediate(() => {
          this.emit("message", v, !0), this._state = d, this.startLoop(w);
        }));
      } else {
        const v = s(b, E);
        if (!this._skipUTF8Validation && !l(v)) {
          const P = this.createError(
            Error,
            "invalid UTF-8 sequence",
            !0,
            1007,
            "WS_ERR_INVALID_UTF8"
          );
          w(P);
          return;
        }
        this._state === S || this._allowSynchronousEvents ? (this.emit("message", v, !1), this._state = d) : (this._state = C, setImmediate(() => {
          this.emit("message", v, !1), this._state = d, this.startLoop(w);
        }));
      }
    }
    /**
     * Handles a control message.
     *
     * @param {Buffer} data Data to handle
     * @return {(Error|RangeError|undefined)} A possible error
     * @private
     */
    controlMessage(w, E) {
      if (this._opcode === 8) {
        if (w.length === 0)
          this._loop = !1, this.emit("conclude", 1005, n), this.end();
        else {
          const b = w.readUInt16BE(0);
          if (!u(b)) {
            const P = this.createError(
              RangeError,
              `invalid status code ${b}`,
              !0,
              1002,
              "WS_ERR_INVALID_CLOSE_CODE"
            );
            E(P);
            return;
          }
          const v = new f(
            w.buffer,
            w.byteOffset + 2,
            w.length - 2
          );
          if (!this._skipUTF8Validation && !l(v)) {
            const P = this.createError(
              Error,
              "invalid UTF-8 sequence",
              !0,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            E(P);
            return;
          }
          this._loop = !1, this.emit("conclude", b, v), this.end();
        }
        this._state = d;
        return;
      }
      this._allowSynchronousEvents ? (this.emit(this._opcode === 9 ? "ping" : "pong", w), this._state = d) : (this._state = C, setImmediate(() => {
        this.emit(this._opcode === 9 ? "ping" : "pong", w), this._state = d, this.startLoop(E);
      }));
    }
    /**
     * Builds an error object.
     *
     * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
     * @param {String} message The error message
     * @param {Boolean} prefix Specifies whether or not to add a default prefix to
     *     `message`
     * @param {Number} statusCode The status code
     * @param {String} errorCode The exposed error code
     * @return {(Error|RangeError)} The error
     * @private
     */
    createError(w, E, b, v, P) {
      this._loop = !1, this._errored = !0;
      const T = new w(
        b ? `Invalid WebSocket frame: ${E}` : E
      );
      return Error.captureStackTrace(T, this.createError), T.code = P, T[i] = v, T;
    }
  }
  return uo = A, uo;
}
var fo, mu;
function $p() {
  if (mu) return fo;
  mu = 1;
  const { Duplex: e } = qt, { randomFillSync: t } = _t, r = yi(), { EMPTY_BUFFER: n, kWebSocket: i, NOOP: o } = gr(), { isBlob: s, isValidStatusCode: a } = vi(), { mask: c, toBuffer: u } = Ls(), l = Symbol("kByteLength"), f = Buffer.alloc(4), d = 8 * 1024;
  let p, g = d;
  const y = 0, m = 1, S = 2;
  class C {
    /**
     * Creates a Sender instance.
     *
     * @param {Duplex} socket The connection socket
     * @param {Object} [extensions] An object containing the negotiated extensions
     * @param {Function} [generateMask] The function used to generate the masking
     *     key
     */
    constructor(E, b, v) {
      this._extensions = b || {}, v && (this._generateMask = v, this._maskBuffer = Buffer.alloc(4)), this._socket = E, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = y, this.onerror = o, this[i] = void 0;
    }
    /**
     * Frames a piece of data according to the HyBi WebSocket protocol.
     *
     * @param {(Buffer|String)} data The data to frame
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @return {(Buffer|String)[]} The framed data
     * @public
     */
    static frame(E, b) {
      let v, P = !1, T = 2, U = !1;
      b.mask && (v = b.maskBuffer || f, b.generateMask ? b.generateMask(v) : (g === d && (p === void 0 && (p = Buffer.alloc(d)), t(p, 0, d), g = 0), v[0] = p[g++], v[1] = p[g++], v[2] = p[g++], v[3] = p[g++]), U = (v[0] | v[1] | v[2] | v[3]) === 0, T = 6);
      let k;
      typeof E == "string" ? (!b.mask || U) && b[l] !== void 0 ? k = b[l] : (E = Buffer.from(E), k = E.length) : (k = E.length, P = b.mask && b.readOnly && !U);
      let M = k;
      k >= 65536 ? (T += 8, M = 127) : k > 125 && (T += 2, M = 126);
      const N = Buffer.allocUnsafe(P ? k + T : T);
      return N[0] = b.fin ? b.opcode | 128 : b.opcode, b.rsv1 && (N[0] |= 64), N[1] = M, M === 126 ? N.writeUInt16BE(k, 2) : M === 127 && (N[2] = N[3] = 0, N.writeUIntBE(k, 4, 6)), b.mask ? (N[1] |= 128, N[T - 4] = v[0], N[T - 3] = v[1], N[T - 2] = v[2], N[T - 1] = v[3], U ? [N, E] : P ? (c(E, v, N, T, k), [N]) : (c(E, v, E, 0, k), [N, E])) : [N, E];
    }
    /**
     * Sends a close message to the other peer.
     *
     * @param {Number} [code] The status code component of the body
     * @param {(String|Buffer)} [data] The message component of the body
     * @param {Boolean} [mask=false] Specifies whether or not to mask the message
     * @param {Function} [cb] Callback
     * @public
     */
    close(E, b, v, P) {
      let T;
      if (E === void 0)
        T = n;
      else {
        if (typeof E != "number" || !a(E))
          throw new TypeError("First argument must be a valid error code number");
        if (b === void 0 || !b.length)
          T = Buffer.allocUnsafe(2), T.writeUInt16BE(E, 0);
        else {
          const k = Buffer.byteLength(b);
          if (k > 123)
            throw new RangeError("The message must not be greater than 123 bytes");
          T = Buffer.allocUnsafe(2 + k), T.writeUInt16BE(E, 0), typeof b == "string" ? T.write(b, 2) : T.set(b, 2);
        }
      }
      const U = {
        [l]: T.length,
        fin: !0,
        generateMask: this._generateMask,
        mask: v,
        maskBuffer: this._maskBuffer,
        opcode: 8,
        readOnly: !1,
        rsv1: !1
      };
      this._state !== y ? this.enqueue([this.dispatch, T, !1, U, P]) : this.sendFrame(C.frame(T, U), P);
    }
    /**
     * Sends a ping message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    ping(E, b, v) {
      let P, T;
      if (typeof E == "string" ? (P = Buffer.byteLength(E), T = !1) : s(E) ? (P = E.size, T = !1) : (E = u(E), P = E.length, T = u.readOnly), P > 125)
        throw new RangeError("The data size must not be greater than 125 bytes");
      const U = {
        [l]: P,
        fin: !0,
        generateMask: this._generateMask,
        mask: b,
        maskBuffer: this._maskBuffer,
        opcode: 9,
        readOnly: T,
        rsv1: !1
      };
      s(E) ? this._state !== y ? this.enqueue([this.getBlobData, E, !1, U, v]) : this.getBlobData(E, !1, U, v) : this._state !== y ? this.enqueue([this.dispatch, E, !1, U, v]) : this.sendFrame(C.frame(E, U), v);
    }
    /**
     * Sends a pong message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    pong(E, b, v) {
      let P, T;
      if (typeof E == "string" ? (P = Buffer.byteLength(E), T = !1) : s(E) ? (P = E.size, T = !1) : (E = u(E), P = E.length, T = u.readOnly), P > 125)
        throw new RangeError("The data size must not be greater than 125 bytes");
      const U = {
        [l]: P,
        fin: !0,
        generateMask: this._generateMask,
        mask: b,
        maskBuffer: this._maskBuffer,
        opcode: 10,
        readOnly: T,
        rsv1: !1
      };
      s(E) ? this._state !== y ? this.enqueue([this.getBlobData, E, !1, U, v]) : this.getBlobData(E, !1, U, v) : this._state !== y ? this.enqueue([this.dispatch, E, !1, U, v]) : this.sendFrame(C.frame(E, U), v);
    }
    /**
     * Sends a data message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Object} options Options object
     * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
     *     or text
     * @param {Boolean} [options.compress=false] Specifies whether or not to
     *     compress `data`
     * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Function} [cb] Callback
     * @public
     */
    send(E, b, v) {
      const P = this._extensions[r.extensionName];
      let T = b.binary ? 2 : 1, U = b.compress, k, M;
      typeof E == "string" ? (k = Buffer.byteLength(E), M = !1) : s(E) ? (k = E.size, M = !1) : (E = u(E), k = E.length, M = u.readOnly), this._firstFragment ? (this._firstFragment = !1, U && P && P.params[P._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (U = k >= P._threshold), this._compress = U) : (U = !1, T = 0), b.fin && (this._firstFragment = !0);
      const N = {
        [l]: k,
        fin: b.fin,
        generateMask: this._generateMask,
        mask: b.mask,
        maskBuffer: this._maskBuffer,
        opcode: T,
        readOnly: M,
        rsv1: U
      };
      s(E) ? this._state !== y ? this.enqueue([this.getBlobData, E, this._compress, N, v]) : this.getBlobData(E, this._compress, N, v) : this._state !== y ? this.enqueue([this.dispatch, E, this._compress, N, v]) : this.dispatch(E, this._compress, N, v);
    }
    /**
     * Gets the contents of a blob as binary data.
     *
     * @param {Blob} blob The blob
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     the data
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    getBlobData(E, b, v, P) {
      this._bufferedBytes += v[l], this._state = S, E.arrayBuffer().then((T) => {
        if (this._socket.destroyed) {
          const k = new Error(
            "The socket was closed while the blob was being read"
          );
          process.nextTick(A, this, k, P);
          return;
        }
        this._bufferedBytes -= v[l];
        const U = u(T);
        b ? this.dispatch(U, b, v, P) : (this._state = y, this.sendFrame(C.frame(U, v), P), this.dequeue());
      }).catch((T) => {
        process.nextTick(x, this, T, P);
      });
    }
    /**
     * Dispatches a message.
     *
     * @param {(Buffer|String)} data The message to send
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     `data`
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    dispatch(E, b, v, P) {
      if (!b) {
        this.sendFrame(C.frame(E, v), P);
        return;
      }
      const T = this._extensions[r.extensionName];
      this._bufferedBytes += v[l], this._state = m, T.compress(E, v.fin, (U, k) => {
        if (this._socket.destroyed) {
          const M = new Error(
            "The socket was closed while data was being compressed"
          );
          A(this, M, P);
          return;
        }
        this._bufferedBytes -= v[l], this._state = y, v.readOnly = !1, this.sendFrame(C.frame(k, v), P), this.dequeue();
      });
    }
    /**
     * Executes queued send operations.
     *
     * @private
     */
    dequeue() {
      for (; this._state === y && this._queue.length; ) {
        const E = this._queue.shift();
        this._bufferedBytes -= E[3][l], Reflect.apply(E[0], this, E.slice(1));
      }
    }
    /**
     * Enqueues a send operation.
     *
     * @param {Array} params Send operation parameters.
     * @private
     */
    enqueue(E) {
      this._bufferedBytes += E[3][l], this._queue.push(E);
    }
    /**
     * Sends a frame.
     *
     * @param {(Buffer | String)[]} list The frame to send
     * @param {Function} [cb] Callback
     * @private
     */
    sendFrame(E, b) {
      E.length === 2 ? (this._socket.cork(), this._socket.write(E[0]), this._socket.write(E[1], b), this._socket.uncork()) : this._socket.write(E[0], b);
    }
  }
  fo = C;
  function A(w, E, b) {
    typeof b == "function" && b(E);
    for (let v = 0; v < w._queue.length; v++) {
      const P = w._queue[v], T = P[P.length - 1];
      typeof T == "function" && T(E);
    }
  }
  function x(w, E, b) {
    A(w, E, b), w.onerror(E);
  }
  return fo;
}
var ho, gu;
function $w() {
  if (gu) return ho;
  gu = 1;
  const { kForOnEventAttribute: e, kListener: t } = gr(), r = Symbol("kCode"), n = Symbol("kData"), i = Symbol("kError"), o = Symbol("kMessage"), s = Symbol("kReason"), a = Symbol("kTarget"), c = Symbol("kType"), u = Symbol("kWasClean");
  class l {
    /**
     * Create a new `Event`.
     *
     * @param {String} type The name of the event
     * @throws {TypeError} If the `type` argument is not specified
     */
    constructor(S) {
      this[a] = null, this[c] = S;
    }
    /**
     * @type {*}
     */
    get target() {
      return this[a];
    }
    /**
     * @type {String}
     */
    get type() {
      return this[c];
    }
  }
  Object.defineProperty(l.prototype, "target", { enumerable: !0 }), Object.defineProperty(l.prototype, "type", { enumerable: !0 });
  class f extends l {
    /**
     * Create a new `CloseEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {Number} [options.code=0] The status code explaining why the
     *     connection was closed
     * @param {String} [options.reason=''] A human-readable string explaining why
     *     the connection was closed
     * @param {Boolean} [options.wasClean=false] Indicates whether or not the
     *     connection was cleanly closed
     */
    constructor(S, C = {}) {
      super(S), this[r] = C.code === void 0 ? 0 : C.code, this[s] = C.reason === void 0 ? "" : C.reason, this[u] = C.wasClean === void 0 ? !1 : C.wasClean;
    }
    /**
     * @type {Number}
     */
    get code() {
      return this[r];
    }
    /**
     * @type {String}
     */
    get reason() {
      return this[s];
    }
    /**
     * @type {Boolean}
     */
    get wasClean() {
      return this[u];
    }
  }
  Object.defineProperty(f.prototype, "code", { enumerable: !0 }), Object.defineProperty(f.prototype, "reason", { enumerable: !0 }), Object.defineProperty(f.prototype, "wasClean", { enumerable: !0 });
  class d extends l {
    /**
     * Create a new `ErrorEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.error=null] The error that generated this event
     * @param {String} [options.message=''] The error message
     */
    constructor(S, C = {}) {
      super(S), this[i] = C.error === void 0 ? null : C.error, this[o] = C.message === void 0 ? "" : C.message;
    }
    /**
     * @type {*}
     */
    get error() {
      return this[i];
    }
    /**
     * @type {String}
     */
    get message() {
      return this[o];
    }
  }
  Object.defineProperty(d.prototype, "error", { enumerable: !0 }), Object.defineProperty(d.prototype, "message", { enumerable: !0 });
  class p extends l {
    /**
     * Create a new `MessageEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.data=null] The message content
     */
    constructor(S, C = {}) {
      super(S), this[n] = C.data === void 0 ? null : C.data;
    }
    /**
     * @type {*}
     */
    get data() {
      return this[n];
    }
  }
  Object.defineProperty(p.prototype, "data", { enumerable: !0 }), ho = {
    CloseEvent: f,
    ErrorEvent: d,
    Event: l,
    EventTarget: {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(m, S, C = {}) {
        for (const x of this.listeners(m))
          if (!C[e] && x[t] === S && !x[e])
            return;
        let A;
        if (m === "message")
          A = function(w, E) {
            const b = new p("message", {
              data: E ? w : w.toString()
            });
            b[a] = this, y(S, this, b);
          };
        else if (m === "close")
          A = function(w, E) {
            const b = new f("close", {
              code: w,
              reason: E.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            b[a] = this, y(S, this, b);
          };
        else if (m === "error")
          A = function(w) {
            const E = new d("error", {
              error: w,
              message: w.message
            });
            E[a] = this, y(S, this, E);
          };
        else if (m === "open")
          A = function() {
            const w = new l("open");
            w[a] = this, y(S, this, w);
          };
        else
          return;
        A[e] = !!C[e], A[t] = S, C.once ? this.once(m, A) : this.on(m, A);
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(m, S) {
        for (const C of this.listeners(m))
          if (C[t] === S && !C[e]) {
            this.removeListener(m, C);
            break;
          }
      }
    },
    MessageEvent: p
  };
  function y(m, S, C) {
    typeof m == "object" && m.handleEvent ? m.handleEvent.call(m, C) : m.call(S, C);
  }
  return ho;
}
var po, yu;
function Zc() {
  if (yu) return po;
  yu = 1;
  const { tokenChars: e } = vi();
  function t(i, o, s) {
    i[o] === void 0 ? i[o] = [s] : i[o].push(s);
  }
  function r(i) {
    const o = /* @__PURE__ */ Object.create(null);
    let s = /* @__PURE__ */ Object.create(null), a = !1, c = !1, u = !1, l, f, d = -1, p = -1, g = -1, y = 0;
    for (; y < i.length; y++)
      if (p = i.charCodeAt(y), l === void 0)
        if (g === -1 && e[p] === 1)
          d === -1 && (d = y);
        else if (y !== 0 && (p === 32 || p === 9))
          g === -1 && d !== -1 && (g = y);
        else if (p === 59 || p === 44) {
          if (d === -1)
            throw new SyntaxError(`Unexpected character at index ${y}`);
          g === -1 && (g = y);
          const S = i.slice(d, g);
          p === 44 ? (t(o, S, s), s = /* @__PURE__ */ Object.create(null)) : l = S, d = g = -1;
        } else
          throw new SyntaxError(`Unexpected character at index ${y}`);
      else if (f === void 0)
        if (g === -1 && e[p] === 1)
          d === -1 && (d = y);
        else if (p === 32 || p === 9)
          g === -1 && d !== -1 && (g = y);
        else if (p === 59 || p === 44) {
          if (d === -1)
            throw new SyntaxError(`Unexpected character at index ${y}`);
          g === -1 && (g = y), t(s, i.slice(d, g), !0), p === 44 && (t(o, l, s), s = /* @__PURE__ */ Object.create(null), l = void 0), d = g = -1;
        } else if (p === 61 && d !== -1 && g === -1)
          f = i.slice(d, y), d = g = -1;
        else
          throw new SyntaxError(`Unexpected character at index ${y}`);
      else if (c) {
        if (e[p] !== 1)
          throw new SyntaxError(`Unexpected character at index ${y}`);
        d === -1 ? d = y : a || (a = !0), c = !1;
      } else if (u)
        if (e[p] === 1)
          d === -1 && (d = y);
        else if (p === 34 && d !== -1)
          u = !1, g = y;
        else if (p === 92)
          c = !0;
        else
          throw new SyntaxError(`Unexpected character at index ${y}`);
      else if (p === 34 && i.charCodeAt(y - 1) === 61)
        u = !0;
      else if (g === -1 && e[p] === 1)
        d === -1 && (d = y);
      else if (d !== -1 && (p === 32 || p === 9))
        g === -1 && (g = y);
      else if (p === 59 || p === 44) {
        if (d === -1)
          throw new SyntaxError(`Unexpected character at index ${y}`);
        g === -1 && (g = y);
        let S = i.slice(d, g);
        a && (S = S.replace(/\\/g, ""), a = !1), t(s, f, S), p === 44 && (t(o, l, s), s = /* @__PURE__ */ Object.create(null), l = void 0), f = void 0, d = g = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${y}`);
    if (d === -1 || u || p === 32 || p === 9)
      throw new SyntaxError("Unexpected end of input");
    g === -1 && (g = y);
    const m = i.slice(d, g);
    return l === void 0 ? t(o, m, s) : (f === void 0 ? t(s, m, !0) : a ? t(s, f, m.replace(/\\/g, "")) : t(s, f, m), t(o, l, s)), o;
  }
  function n(i) {
    return Object.keys(i).map((o) => {
      let s = i[o];
      return Array.isArray(s) || (s = [s]), s.map((a) => [o].concat(
        Object.keys(a).map((c) => {
          let u = a[c];
          return Array.isArray(u) || (u = [u]), u.map((l) => l === !0 ? c : `${c}=${l}`).join("; ");
        })
      ).join("; ")).join(", ");
    }).join(", ");
  }
  return po = { format: n, parse: r }, po;
}
var mo, vu;
function el() {
  if (vu) return mo;
  vu = 1;
  const e = Rs, t = Fc, r = hi, n = by, i = Ty, { randomBytes: o, createHash: s } = _t, { Duplex: a, Readable: c } = qt, { URL: u } = er, l = yi(), f = Mp(), d = $p(), { isBlob: p } = vi(), {
    BINARY_TYPES: g,
    CLOSE_TIMEOUT: y,
    EMPTY_BUFFER: m,
    GUID: S,
    kForOnEventAttribute: C,
    kListener: A,
    kStatusCode: x,
    kWebSocket: w,
    NOOP: E
  } = gr(), {
    EventTarget: { addEventListener: b, removeEventListener: v }
  } = $w(), { format: P, parse: T } = Zc(), { toBuffer: U } = Ls(), k = Symbol("kAborted"), M = [8, 13], N = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"], F = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
  class $ extends e {
    /**
     * Create a new `WebSocket`.
     *
     * @param {(String|URL)} address The URL to which to connect
     * @param {(String|String[])} [protocols] The subprotocols
     * @param {Object} [options] Connection options
     */
    constructor(z, ue, ye) {
      super(), this._binaryType = g[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = m, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = $.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, z !== null ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, ue === void 0 ? ue = [] : Array.isArray(ue) || (typeof ue == "object" && ue !== null ? (ye = ue, ue = []) : ue = [ue]), O(this, z, ue, ye)) : (this._autoPong = ye.autoPong, this._closeTimeout = ye.closeTimeout, this._isServer = !0);
    }
    /**
     * For historical reasons, the custom "nodebuffer" type is used by the default
     * instead of "blob".
     *
     * @type {String}
     */
    get binaryType() {
      return this._binaryType;
    }
    set binaryType(z) {
      g.includes(z) && (this._binaryType = z, this._receiver && (this._receiver._binaryType = z));
    }
    /**
     * @type {Number}
     */
    get bufferedAmount() {
      return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount;
    }
    /**
     * @type {String}
     */
    get extensions() {
      return Object.keys(this._extensions).join();
    }
    /**
     * @type {Boolean}
     */
    get isPaused() {
      return this._paused;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onclose() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onerror() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onopen() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onmessage() {
      return null;
    }
    /**
     * @type {String}
     */
    get protocol() {
      return this._protocol;
    }
    /**
     * @type {Number}
     */
    get readyState() {
      return this._readyState;
    }
    /**
     * @type {String}
     */
    get url() {
      return this._url;
    }
    /**
     * Set up the socket and the internal resources.
     *
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Object} options Options object
     * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Number} [options.maxPayload=0] The maximum allowed message size
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @private
     */
    setSocket(z, ue, ye) {
      const de = new f({
        allowSynchronousEvents: ye.allowSynchronousEvents,
        binaryType: this.binaryType,
        extensions: this._extensions,
        isServer: this._isServer,
        maxPayload: ye.maxPayload,
        skipUTF8Validation: ye.skipUTF8Validation
      }), h = new d(z, this._extensions, ye.generateMask);
      this._receiver = de, this._sender = h, this._socket = z, de[w] = this, h[w] = this, z[w] = this, de.on("conclude", Ie), de.on("drain", Re), de.on("error", te), de.on("message", De), de.on("ping", Ue), de.on("pong", We), h.onerror = Fe, z.setTimeout && z.setTimeout(0), z.setNoDelay && z.setNoDelay(), ue.length > 0 && z.unshift(ue), z.on("close", _), z.on("data", q), z.on("end", L), z.on("error", Ne), this._readyState = $.OPEN, this.emit("open");
    }
    /**
     * Emit the `'close'` event.
     *
     * @private
     */
    emitClose() {
      if (!this._socket) {
        this._readyState = $.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
        return;
      }
      this._extensions[l.extensionName] && this._extensions[l.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = $.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
    }
    /**
     * Start a closing handshake.
     *
     *          +----------+   +-----------+   +----------+
     *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
     *    |     +----------+   +-----------+   +----------+     |
     *          +----------+   +-----------+         |
     * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
     *          +----------+   +-----------+   |
     *    |           |                        |   +---+        |
     *                +------------------------+-->|fin| - - - -
     *    |         +---+                      |   +---+
     *     - - - - -|fin|<---------------------+
     *              +---+
     *
     * @param {Number} [code] Status code explaining why the connection is closing
     * @param {(String|Buffer)} [data] The reason why the connection is
     *     closing
     * @public
     */
    close(z, ue) {
      if (this.readyState !== $.CLOSED) {
        if (this.readyState === $.CONNECTING) {
          we(this, this._req, "WebSocket was closed before the connection was established");
          return;
        }
        if (this.readyState === $.CLOSING) {
          this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
          return;
        }
        this._readyState = $.CLOSING, this._sender.close(z, ue, !this._isServer, (ye) => {
          ye || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end());
        }), R(this);
      }
    }
    /**
     * Pause the socket.
     *
     * @public
     */
    pause() {
      this.readyState === $.CONNECTING || this.readyState === $.CLOSED || (this._paused = !0, this._socket.pause());
    }
    /**
     * Send a ping.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the ping is sent
     * @public
     */
    ping(z, ue, ye) {
      if (this.readyState === $.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof z == "function" ? (ye = z, z = ue = void 0) : typeof ue == "function" && (ye = ue, ue = void 0), typeof z == "number" && (z = z.toString()), this.readyState !== $.OPEN) {
        ne(this, z, ye);
        return;
      }
      ue === void 0 && (ue = !this._isServer), this._sender.ping(z || m, ue, ye);
    }
    /**
     * Send a pong.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the pong is sent
     * @public
     */
    pong(z, ue, ye) {
      if (this.readyState === $.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof z == "function" ? (ye = z, z = ue = void 0) : typeof ue == "function" && (ye = ue, ue = void 0), typeof z == "number" && (z = z.toString()), this.readyState !== $.OPEN) {
        ne(this, z, ye);
        return;
      }
      ue === void 0 && (ue = !this._isServer), this._sender.pong(z || m, ue, ye);
    }
    /**
     * Resume the socket.
     *
     * @public
     */
    resume() {
      this.readyState === $.CONNECTING || this.readyState === $.CLOSED || (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume());
    }
    /**
     * Send a data message.
     *
     * @param {*} data The message to send
     * @param {Object} [options] Options object
     * @param {Boolean} [options.binary] Specifies whether `data` is binary or
     *     text
     * @param {Boolean} [options.compress] Specifies whether or not to compress
     *     `data`
     * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when data is written out
     * @public
     */
    send(z, ue, ye) {
      if (this.readyState === $.CONNECTING)
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      if (typeof ue == "function" && (ye = ue, ue = {}), typeof z == "number" && (z = z.toString()), this.readyState !== $.OPEN) {
        ne(this, z, ye);
        return;
      }
      const de = {
        binary: typeof z != "string",
        mask: !this._isServer,
        compress: !0,
        fin: !0,
        ...ue
      };
      this._extensions[l.extensionName] || (de.compress = !1), this._sender.send(z || m, de, ye);
    }
    /**
     * Forcibly close the connection.
     *
     * @public
     */
    terminate() {
      if (this.readyState !== $.CLOSED) {
        if (this.readyState === $.CONNECTING) {
          we(this, this._req, "WebSocket was closed before the connection was established");
          return;
        }
        this._socket && (this._readyState = $.CLOSING, this._socket.destroy());
      }
    }
  }
  Object.defineProperty($, "CONNECTING", {
    enumerable: !0,
    value: N.indexOf("CONNECTING")
  }), Object.defineProperty($.prototype, "CONNECTING", {
    enumerable: !0,
    value: N.indexOf("CONNECTING")
  }), Object.defineProperty($, "OPEN", {
    enumerable: !0,
    value: N.indexOf("OPEN")
  }), Object.defineProperty($.prototype, "OPEN", {
    enumerable: !0,
    value: N.indexOf("OPEN")
  }), Object.defineProperty($, "CLOSING", {
    enumerable: !0,
    value: N.indexOf("CLOSING")
  }), Object.defineProperty($.prototype, "CLOSING", {
    enumerable: !0,
    value: N.indexOf("CLOSING")
  }), Object.defineProperty($, "CLOSED", {
    enumerable: !0,
    value: N.indexOf("CLOSED")
  }), Object.defineProperty($.prototype, "CLOSED", {
    enumerable: !0,
    value: N.indexOf("CLOSED")
  }), [
    "binaryType",
    "bufferedAmount",
    "extensions",
    "isPaused",
    "protocol",
    "readyState",
    "url"
  ].forEach((W) => {
    Object.defineProperty($.prototype, W, { enumerable: !0 });
  }), ["open", "error", "close", "message"].forEach((W) => {
    Object.defineProperty($.prototype, `on${W}`, {
      enumerable: !0,
      get() {
        for (const z of this.listeners(W))
          if (z[C]) return z[A];
        return null;
      },
      set(z) {
        for (const ue of this.listeners(W))
          if (ue[C]) {
            this.removeListener(W, ue);
            break;
          }
        typeof z == "function" && this.addEventListener(W, z, {
          [C]: !0
        });
      }
    });
  }), $.prototype.addEventListener = b, $.prototype.removeEventListener = v, mo = $;
  function O(W, z, ue, ye) {
    const de = {
      allowSynchronousEvents: !0,
      autoPong: !0,
      closeTimeout: y,
      protocolVersion: M[1],
      maxPayload: 104857600,
      skipUTF8Validation: !1,
      perMessageDeflate: !0,
      followRedirects: !1,
      maxRedirects: 10,
      ...ye,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    if (W._autoPong = de.autoPong, W._closeTimeout = de.closeTimeout, !M.includes(de.protocolVersion))
      throw new RangeError(
        `Unsupported protocol version: ${de.protocolVersion} (supported versions: ${M.join(", ")})`
      );
    let h;
    if (z instanceof u)
      h = z;
    else
      try {
        h = new u(z);
      } catch {
        throw new SyntaxError(`Invalid URL: ${z}`);
      }
    h.protocol === "http:" ? h.protocol = "ws:" : h.protocol === "https:" && (h.protocol = "wss:"), W._url = h.href;
    const H = h.protocol === "wss:", V = h.protocol === "ws+unix:";
    let ce;
    if (h.protocol !== "ws:" && !H && !V ? ce = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"` : V && !h.pathname ? ce = "The URL's pathname is empty" : h.hash && (ce = "The URL contains a fragment identifier"), ce) {
      const Ee = new SyntaxError(ce);
      if (W._redirects === 0)
        throw Ee;
      G(W, Ee);
      return;
    }
    const K = H ? 443 : 80, ae = o(16).toString("base64"), se = H ? t.request : r.request, fe = /* @__PURE__ */ new Set();
    let pe;
    if (de.createConnection = de.createConnection || (H ? ie : Y), de.defaultPort = de.defaultPort || K, de.port = h.port || K, de.host = h.hostname.startsWith("[") ? h.hostname.slice(1, -1) : h.hostname, de.headers = {
      ...de.headers,
      "Sec-WebSocket-Version": de.protocolVersion,
      "Sec-WebSocket-Key": ae,
      Connection: "Upgrade",
      Upgrade: "websocket"
    }, de.path = h.pathname + h.search, de.timeout = de.handshakeTimeout, de.perMessageDeflate && (pe = new l({
      ...de.perMessageDeflate,
      isServer: !1,
      maxPayload: de.maxPayload
    }), de.headers["Sec-WebSocket-Extensions"] = P({
      [l.extensionName]: pe.offer()
    })), ue.length) {
      for (const Ee of ue) {
        if (typeof Ee != "string" || !F.test(Ee) || fe.has(Ee))
          throw new SyntaxError(
            "An invalid or duplicated subprotocol was specified"
          );
        fe.add(Ee);
      }
      de.headers["Sec-WebSocket-Protocol"] = ue.join(",");
    }
    if (de.origin && (de.protocolVersion < 13 ? de.headers["Sec-WebSocket-Origin"] = de.origin : de.headers.Origin = de.origin), (h.username || h.password) && (de.auth = `${h.username}:${h.password}`), V) {
      const Ee = de.path.split(":");
      de.socketPath = Ee[0], de.path = Ee[1];
    }
    let Ce;
    if (de.followRedirects) {
      if (W._redirects === 0) {
        W._originalIpc = V, W._originalSecure = H, W._originalHostOrSocketPath = V ? de.socketPath : h.host;
        const Ee = ye && ye.headers;
        if (ye = { ...ye, headers: {} }, Ee)
          for (const [ge, I] of Object.entries(Ee))
            ye.headers[ge.toLowerCase()] = I;
      } else if (W.listenerCount("redirect") === 0) {
        const Ee = V ? W._originalIpc ? de.socketPath === W._originalHostOrSocketPath : !1 : W._originalIpc ? !1 : h.host === W._originalHostOrSocketPath;
        (!Ee || W._originalSecure && !H) && (delete de.headers.authorization, delete de.headers.cookie, Ee || delete de.headers.host, de.auth = void 0);
      }
      de.auth && !ye.headers.authorization && (ye.headers.authorization = "Basic " + Buffer.from(de.auth).toString("base64")), Ce = W._req = se(de), W._redirects && W.emit("redirect", W.url, Ce);
    } else
      Ce = W._req = se(de);
    de.timeout && Ce.on("timeout", () => {
      we(W, Ce, "Opening handshake has timed out");
    }), Ce.on("error", (Ee) => {
      Ce === null || Ce[k] || (Ce = W._req = null, G(W, Ee));
    }), Ce.on("response", (Ee) => {
      const ge = Ee.headers.location, I = Ee.statusCode;
      if (ge && de.followRedirects && I >= 300 && I < 400) {
        if (++W._redirects > de.maxRedirects) {
          we(W, Ce, "Maximum redirects exceeded");
          return;
        }
        Ce.abort();
        let j;
        try {
          j = new u(ge, z);
        } catch {
          const X = new SyntaxError(`Invalid URL: ${ge}`);
          G(W, X);
          return;
        }
        O(W, j, ue, ye);
      } else W.emit("unexpected-response", Ce, Ee) || we(
        W,
        Ce,
        `Unexpected server response: ${Ee.statusCode}`
      );
    }), Ce.on("upgrade", (Ee, ge, I) => {
      if (W.emit("upgrade", Ee), W.readyState !== $.CONNECTING) return;
      Ce = W._req = null;
      const j = Ee.headers.upgrade;
      if (j === void 0 || j.toLowerCase() !== "websocket") {
        we(W, ge, "Invalid Upgrade header");
        return;
      }
      const Z = s("sha1").update(ae + S).digest("base64");
      if (Ee.headers["sec-websocket-accept"] !== Z) {
        we(W, ge, "Invalid Sec-WebSocket-Accept header");
        return;
      }
      const X = Ee.headers["sec-websocket-protocol"];
      let ee;
      if (X !== void 0 ? fe.size ? fe.has(X) || (ee = "Server sent an invalid subprotocol") : ee = "Server sent a subprotocol but none was requested" : fe.size && (ee = "Server sent no subprotocol"), ee) {
        we(W, ge, ee);
        return;
      }
      X && (W._protocol = X);
      const he = Ee.headers["sec-websocket-extensions"];
      if (he !== void 0) {
        if (!pe) {
          we(W, ge, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
          return;
        }
        let oe;
        try {
          oe = T(he);
        } catch {
          we(W, ge, "Invalid Sec-WebSocket-Extensions header");
          return;
        }
        const me = Object.keys(oe);
        if (me.length !== 1 || me[0] !== l.extensionName) {
          we(W, ge, "Server indicated an extension that was not requested");
          return;
        }
        try {
          pe.accept(oe[l.extensionName]);
        } catch {
          we(W, ge, "Invalid Sec-WebSocket-Extensions header");
          return;
        }
        W._extensions[l.extensionName] = pe;
      }
      W.setSocket(ge, I, {
        allowSynchronousEvents: de.allowSynchronousEvents,
        generateMask: de.generateMask,
        maxPayload: de.maxPayload,
        skipUTF8Validation: de.skipUTF8Validation
      });
    }), de.finishRequest ? de.finishRequest(Ce, W) : Ce.end();
  }
  function G(W, z) {
    W._readyState = $.CLOSING, W._errorEmitted = !0, W.emit("error", z), W.emitClose();
  }
  function Y(W) {
    return W.path = W.socketPath, n.connect(W);
  }
  function ie(W) {
    return W.path = void 0, !W.servername && W.servername !== "" && (W.servername = n.isIP(W.host) ? "" : W.host), i.connect(W);
  }
  function we(W, z, ue) {
    W._readyState = $.CLOSING;
    const ye = new Error(ue);
    Error.captureStackTrace(ye, we), z.setHeader ? (z[k] = !0, z.abort(), z.socket && !z.socket.destroyed && z.socket.destroy(), process.nextTick(G, W, ye)) : (z.destroy(ye), z.once("error", W.emit.bind(W, "error")), z.once("close", W.emitClose.bind(W)));
  }
  function ne(W, z, ue) {
    if (z) {
      const ye = p(z) ? z.size : U(z).length;
      W._socket ? W._sender._bufferedBytes += ye : W._bufferedAmount += ye;
    }
    if (ue) {
      const ye = new Error(
        `WebSocket is not open: readyState ${W.readyState} (${N[W.readyState]})`
      );
      process.nextTick(ue, ye);
    }
  }
  function Ie(W, z) {
    const ue = this[w];
    ue._closeFrameReceived = !0, ue._closeMessage = z, ue._closeCode = W, ue._socket[w] !== void 0 && (ue._socket.removeListener("data", q), process.nextTick(Be, ue._socket), W === 1005 ? ue.close() : ue.close(W, z));
  }
  function Re() {
    const W = this[w];
    W.isPaused || W._socket.resume();
  }
  function te(W) {
    const z = this[w];
    z._socket[w] !== void 0 && (z._socket.removeListener("data", q), process.nextTick(Be, z._socket), z.close(W[x])), z._errorEmitted || (z._errorEmitted = !0, z.emit("error", W));
  }
  function Se() {
    this[w].emitClose();
  }
  function De(W, z) {
    this[w].emit("message", W, z);
  }
  function Ue(W) {
    const z = this[w];
    z._autoPong && z.pong(W, !this._isServer, E), z.emit("ping", W);
  }
  function We(W) {
    this[w].emit("pong", W);
  }
  function Be(W) {
    W.resume();
  }
  function Fe(W) {
    const z = this[w];
    z.readyState !== $.CLOSED && (z.readyState === $.OPEN && (z._readyState = $.CLOSING, R(z)), this._socket.end(), z._errorEmitted || (z._errorEmitted = !0, z.emit("error", W)));
  }
  function R(W) {
    W._closeTimer = setTimeout(
      W._socket.destroy.bind(W._socket),
      W._closeTimeout
    );
  }
  function _() {
    const W = this[w];
    if (this.removeListener("close", _), this.removeListener("data", q), this.removeListener("end", L), W._readyState = $.CLOSING, !this._readableState.endEmitted && !W._closeFrameReceived && !W._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
      const z = this.read(this._readableState.length);
      W._receiver.write(z);
    }
    W._receiver.end(), this[w] = void 0, clearTimeout(W._closeTimer), W._receiver._writableState.finished || W._receiver._writableState.errorEmitted ? W.emitClose() : (W._receiver.on("error", Se), W._receiver.on("finish", Se));
  }
  function q(W) {
    this[w]._receiver.write(W) || this.pause();
  }
  function L() {
    const W = this[w];
    W._readyState = $.CLOSING, W._receiver.end(), this.end();
  }
  function Ne() {
    const W = this[w];
    this.removeListener("error", Ne), this.on("error", E), W && (W._readyState = $.CLOSING, this.destroy());
  }
  return mo;
}
var go, wu;
function Bw() {
  if (wu) return go;
  wu = 1, el();
  const { Duplex: e } = qt;
  function t(o) {
    o.emit("close");
  }
  function r() {
    !this.destroyed && this._writableState.finished && this.destroy();
  }
  function n(o) {
    this.removeListener("error", n), this.destroy(), this.listenerCount("error") === 0 && this.emit("error", o);
  }
  function i(o, s) {
    let a = !0;
    const c = new e({
      ...s,
      autoDestroy: !1,
      emitClose: !1,
      objectMode: !1,
      writableObjectMode: !1
    });
    return o.on("message", function(l, f) {
      const d = !f && c._readableState.objectMode ? l.toString() : l;
      c.push(d) || o.pause();
    }), o.once("error", function(l) {
      c.destroyed || (a = !1, c.destroy(l));
    }), o.once("close", function() {
      c.destroyed || c.push(null);
    }), c._destroy = function(u, l) {
      if (o.readyState === o.CLOSED) {
        l(u), process.nextTick(t, c);
        return;
      }
      let f = !1;
      o.once("error", function(p) {
        f = !0, l(p);
      }), o.once("close", function() {
        f || l(u), process.nextTick(t, c);
      }), a && o.terminate();
    }, c._final = function(u) {
      if (o.readyState === o.CONNECTING) {
        o.once("open", function() {
          c._final(u);
        });
        return;
      }
      o._socket !== null && (o._socket._writableState.finished ? (u(), c._readableState.endEmitted && c.destroy()) : (o._socket.once("finish", function() {
        u();
      }), o.close()));
    }, c._read = function() {
      o.isPaused && o.resume();
    }, c._write = function(u, l, f) {
      if (o.readyState === o.CONNECTING) {
        o.once("open", function() {
          c._write(u, l, f);
        });
        return;
      }
      o.send(u, f);
    }, c.on("end", r), c.on("error", n), c;
  }
  return go = i, go;
}
Bw();
Zc();
yi();
Mp();
$p();
var yo, Eu;
function Bp() {
  if (Eu) return yo;
  Eu = 1;
  const { tokenChars: e } = vi();
  function t(r) {
    const n = /* @__PURE__ */ new Set();
    let i = -1, o = -1, s = 0;
    for (s; s < r.length; s++) {
      const c = r.charCodeAt(s);
      if (o === -1 && e[c] === 1)
        i === -1 && (i = s);
      else if (s !== 0 && (c === 32 || c === 9))
        o === -1 && i !== -1 && (o = s);
      else if (c === 44) {
        if (i === -1)
          throw new SyntaxError(`Unexpected character at index ${s}`);
        o === -1 && (o = s);
        const u = r.slice(i, o);
        if (n.has(u))
          throw new SyntaxError(`The "${u}" subprotocol is duplicated`);
        n.add(u), i = o = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${s}`);
    }
    if (i === -1 || o !== -1)
      throw new SyntaxError("Unexpected end of input");
    const a = r.slice(i, s);
    if (n.has(a))
      throw new SyntaxError(`The "${a}" subprotocol is duplicated`);
    return n.add(a), n;
  }
  return yo = { parse: t }, yo;
}
Bp();
var qw = el();
const Ui = /* @__PURE__ */ Up(qw);
var vo, _u;
function Ww() {
  if (_u) return vo;
  _u = 1;
  const e = Rs, t = hi, { Duplex: r } = qt, { createHash: n } = _t, i = Zc(), o = yi(), s = Bp(), a = el(), { CLOSE_TIMEOUT: c, GUID: u, kWebSocket: l } = gr(), f = /^[+/0-9A-Za-z]{22}==$/, d = 0, p = 1, g = 2;
  class y extends e {
    /**
     * Create a `WebSocketServer` instance.
     *
     * @param {Object} options Configuration options
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Boolean} [options.autoPong=true] Specifies whether or not to
     *     automatically send a pong in response to a ping
     * @param {Number} [options.backlog=511] The maximum length of the queue of
     *     pending connections
     * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
     *     track clients
     * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
     *     wait for the closing handshake to finish after `websocket.close()` is
     *     called
     * @param {Function} [options.handleProtocols] A hook to handle protocols
     * @param {String} [options.host] The hostname where to bind the server
     * @param {Number} [options.maxPayload=104857600] The maximum allowed message
     *     size
     * @param {Boolean} [options.noServer=false] Enable no server mode
     * @param {String} [options.path] Accept only connections matching this path
     * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
     *     permessage-deflate
     * @param {Number} [options.port] The port where to bind the server
     * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
     *     server to use
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @param {Function} [options.verifyClient] A hook to reject connections
     * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
     *     class to use. It must be the `WebSocket` class or class that extends it
     * @param {Function} [callback] A listener for the `listening` event
     */
    constructor(E, b) {
      if (super(), E = {
        allowSynchronousEvents: !0,
        autoPong: !0,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: !1,
        perMessageDeflate: !1,
        handleProtocols: null,
        clientTracking: !0,
        closeTimeout: c,
        verifyClient: null,
        noServer: !1,
        backlog: null,
        // use default (511 as implemented in net.js)
        server: null,
        host: null,
        path: null,
        port: null,
        WebSocket: a,
        ...E
      }, E.port == null && !E.server && !E.noServer || E.port != null && (E.server || E.noServer) || E.server && E.noServer)
        throw new TypeError(
          'One and only one of the "port", "server", or "noServer" options must be specified'
        );
      if (E.port != null ? (this._server = t.createServer((v, P) => {
        const T = t.STATUS_CODES[426];
        P.writeHead(426, {
          "Content-Length": T.length,
          "Content-Type": "text/plain"
        }), P.end(T);
      }), this._server.listen(
        E.port,
        E.host,
        E.backlog,
        b
      )) : E.server && (this._server = E.server), this._server) {
        const v = this.emit.bind(this, "connection");
        this._removeListeners = m(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: (P, T, U) => {
            this.handleUpgrade(P, T, U, v);
          }
        });
      }
      E.perMessageDeflate === !0 && (E.perMessageDeflate = {}), E.clientTracking && (this.clients = /* @__PURE__ */ new Set(), this._shouldEmitClose = !1), this.options = E, this._state = d;
    }
    /**
     * Returns the bound address, the address family name, and port of the server
     * as reported by the operating system if listening on an IP socket.
     * If the server is listening on a pipe or UNIX domain socket, the name is
     * returned as a string.
     *
     * @return {(Object|String|null)} The address of the server
     * @public
     */
    address() {
      if (this.options.noServer)
        throw new Error('The server is operating in "noServer" mode');
      return this._server ? this._server.address() : null;
    }
    /**
     * Stop the server from accepting new connections and emit the `'close'` event
     * when all existing connections are closed.
     *
     * @param {Function} [cb] A one-time listener for the `'close'` event
     * @public
     */
    close(E) {
      if (this._state === g) {
        E && this.once("close", () => {
          E(new Error("The server is not running"));
        }), process.nextTick(S, this);
        return;
      }
      if (E && this.once("close", E), this._state !== p)
        if (this._state = p, this.options.noServer || this.options.server)
          this._server && (this._removeListeners(), this._removeListeners = this._server = null), this.clients ? this.clients.size ? this._shouldEmitClose = !0 : process.nextTick(S, this) : process.nextTick(S, this);
        else {
          const b = this._server;
          this._removeListeners(), this._removeListeners = this._server = null, b.close(() => {
            S(this);
          });
        }
    }
    /**
     * See if a given request should be handled by this server instance.
     *
     * @param {http.IncomingMessage} req Request object to inspect
     * @return {Boolean} `true` if the request is valid, else `false`
     * @public
     */
    shouldHandle(E) {
      if (this.options.path) {
        const b = E.url.indexOf("?");
        if ((b !== -1 ? E.url.slice(0, b) : E.url) !== this.options.path) return !1;
      }
      return !0;
    }
    /**
     * Handle a HTTP Upgrade request.
     *
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @public
     */
    handleUpgrade(E, b, v, P) {
      b.on("error", C);
      const T = E.headers["sec-websocket-key"], U = E.headers.upgrade, k = +E.headers["sec-websocket-version"];
      if (E.method !== "GET") {
        x(this, E, b, 405, "Invalid HTTP method");
        return;
      }
      if (U === void 0 || U.toLowerCase() !== "websocket") {
        x(this, E, b, 400, "Invalid Upgrade header");
        return;
      }
      if (T === void 0 || !f.test(T)) {
        x(this, E, b, 400, "Missing or invalid Sec-WebSocket-Key header");
        return;
      }
      if (k !== 13 && k !== 8) {
        x(this, E, b, 400, "Missing or invalid Sec-WebSocket-Version header", {
          "Sec-WebSocket-Version": "13, 8"
        });
        return;
      }
      if (!this.shouldHandle(E)) {
        A(b, 400);
        return;
      }
      const M = E.headers["sec-websocket-protocol"];
      let N = /* @__PURE__ */ new Set();
      if (M !== void 0)
        try {
          N = s.parse(M);
        } catch {
          x(this, E, b, 400, "Invalid Sec-WebSocket-Protocol header");
          return;
        }
      const F = E.headers["sec-websocket-extensions"], $ = {};
      if (this.options.perMessageDeflate && F !== void 0) {
        const O = new o({
          ...this.options.perMessageDeflate,
          isServer: !0,
          maxPayload: this.options.maxPayload
        });
        try {
          const G = i.parse(F);
          G[o.extensionName] && (O.accept(G[o.extensionName]), $[o.extensionName] = O);
        } catch {
          x(this, E, b, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
          return;
        }
      }
      if (this.options.verifyClient) {
        const O = {
          origin: E.headers[`${k === 8 ? "sec-websocket-origin" : "origin"}`],
          secure: !!(E.socket.authorized || E.socket.encrypted),
          req: E
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(O, (G, Y, ie, we) => {
            if (!G)
              return A(b, Y || 401, ie, we);
            this.completeUpgrade(
              $,
              T,
              N,
              E,
              b,
              v,
              P
            );
          });
          return;
        }
        if (!this.options.verifyClient(O)) return A(b, 401);
      }
      this.completeUpgrade($, T, N, E, b, v, P);
    }
    /**
     * Upgrade the connection to WebSocket.
     *
     * @param {Object} extensions The accepted extensions
     * @param {String} key The value of the `Sec-WebSocket-Key` header
     * @param {Set} protocols The subprotocols
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @throws {Error} If called more than once with the same socket
     * @private
     */
    completeUpgrade(E, b, v, P, T, U, k) {
      if (!T.readable || !T.writable) return T.destroy();
      if (T[l])
        throw new Error(
          "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
        );
      if (this._state > d) return A(T, 503);
      const N = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${n("sha1").update(b + u).digest("base64")}`
      ], F = new this.options.WebSocket(null, void 0, this.options);
      if (v.size) {
        const $ = this.options.handleProtocols ? this.options.handleProtocols(v, P) : v.values().next().value;
        $ && (N.push(`Sec-WebSocket-Protocol: ${$}`), F._protocol = $);
      }
      if (E[o.extensionName]) {
        const $ = E[o.extensionName].params, O = i.format({
          [o.extensionName]: [$]
        });
        N.push(`Sec-WebSocket-Extensions: ${O}`), F._extensions = E;
      }
      this.emit("headers", N, P), T.write(N.concat(`\r
`).join(`\r
`)), T.removeListener("error", C), F.setSocket(T, U, {
        allowSynchronousEvents: this.options.allowSynchronousEvents,
        maxPayload: this.options.maxPayload,
        skipUTF8Validation: this.options.skipUTF8Validation
      }), this.clients && (this.clients.add(F), F.on("close", () => {
        this.clients.delete(F), this._shouldEmitClose && !this.clients.size && process.nextTick(S, this);
      })), k(F, P);
    }
  }
  vo = y;
  function m(w, E) {
    for (const b of Object.keys(E)) w.on(b, E[b]);
    return function() {
      for (const v of Object.keys(E))
        w.removeListener(v, E[v]);
    };
  }
  function S(w) {
    w._state = g, w.emit("close");
  }
  function C() {
    this.destroy();
  }
  function A(w, E, b, v) {
    b = b || t.STATUS_CODES[E], v = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(b),
      ...v
    }, w.once("finish", w.destroy), w.end(
      `HTTP/1.1 ${E} ${t.STATUS_CODES[E]}\r
` + Object.keys(v).map((P) => `${P}: ${v[P]}`).join(`\r
`) + `\r
\r
` + b
    );
  }
  function x(w, E, b, v, P, T) {
    if (w.listenerCount("wsClientError")) {
      const U = new Error(P);
      Error.captureStackTrace(U, x), w.emit("wsClientError", U, b, E);
    } else
      A(b, v, P, T);
  }
  return vo;
}
Ww();
var wo = {}, En = {}, Mi = {}, Su;
function qp() {
  if (Su) return Mi;
  Su = 1, Object.defineProperty(Mi, "__esModule", {
    value: !0
  }), Mi.default = i;
  var e = t(_t);
  function t(o) {
    return o && o.__esModule ? o : { default: o };
  }
  const r = new Uint8Array(256);
  let n = r.length;
  function i() {
    return n > r.length - 16 && (e.default.randomFillSync(r), n = 0), r.slice(n, n += 16);
  }
  return Mi;
}
var Hr = {}, _n = {}, Sn = {}, bu;
function Hw() {
  if (bu) return Sn;
  bu = 1, Object.defineProperty(Sn, "__esModule", {
    value: !0
  }), Sn.default = void 0;
  var e = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  return Sn.default = e, Sn;
}
var Tu;
function Fs() {
  if (Tu) return _n;
  Tu = 1, Object.defineProperty(_n, "__esModule", {
    value: !0
  }), _n.default = void 0;
  var e = t(/* @__PURE__ */ Hw());
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function r(i) {
    return typeof i == "string" && e.default.test(i);
  }
  var n = r;
  return _n.default = n, _n;
}
var Cu;
function ks() {
  if (Cu) return Hr;
  Cu = 1, Object.defineProperty(Hr, "__esModule", {
    value: !0
  }), Hr.default = void 0, Hr.unsafeStringify = n;
  var e = t(/* @__PURE__ */ Fs());
  function t(s) {
    return s && s.__esModule ? s : { default: s };
  }
  const r = [];
  for (let s = 0; s < 256; ++s)
    r.push((s + 256).toString(16).slice(1));
  function n(s, a = 0) {
    return r[s[a + 0]] + r[s[a + 1]] + r[s[a + 2]] + r[s[a + 3]] + "-" + r[s[a + 4]] + r[s[a + 5]] + "-" + r[s[a + 6]] + r[s[a + 7]] + "-" + r[s[a + 8]] + r[s[a + 9]] + "-" + r[s[a + 10]] + r[s[a + 11]] + r[s[a + 12]] + r[s[a + 13]] + r[s[a + 14]] + r[s[a + 15]];
  }
  function i(s, a = 0) {
    const c = n(s, a);
    if (!(0, e.default)(c))
      throw TypeError("Stringified UUID is invalid");
    return c;
  }
  var o = i;
  return Hr.default = o, Hr;
}
var Ru;
function jw() {
  if (Ru) return En;
  Ru = 1, Object.defineProperty(En, "__esModule", {
    value: !0
  }), En.default = void 0;
  var e = r(/* @__PURE__ */ qp()), t = /* @__PURE__ */ ks();
  function r(u) {
    return u && u.__esModule ? u : { default: u };
  }
  let n, i, o = 0, s = 0;
  function a(u, l, f) {
    let d = l && f || 0;
    const p = l || new Array(16);
    u = u || {};
    let g = u.node || n, y = u.clockseq !== void 0 ? u.clockseq : i;
    if (g == null || y == null) {
      const w = u.random || (u.rng || e.default)();
      g == null && (g = n = [w[0] | 1, w[1], w[2], w[3], w[4], w[5]]), y == null && (y = i = (w[6] << 8 | w[7]) & 16383);
    }
    let m = u.msecs !== void 0 ? u.msecs : Date.now(), S = u.nsecs !== void 0 ? u.nsecs : s + 1;
    const C = m - o + (S - s) / 1e4;
    if (C < 0 && u.clockseq === void 0 && (y = y + 1 & 16383), (C < 0 || m > o) && u.nsecs === void 0 && (S = 0), S >= 1e4)
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    o = m, s = S, i = y, m += 122192928e5;
    const A = ((m & 268435455) * 1e4 + S) % 4294967296;
    p[d++] = A >>> 24 & 255, p[d++] = A >>> 16 & 255, p[d++] = A >>> 8 & 255, p[d++] = A & 255;
    const x = m / 4294967296 * 1e4 & 268435455;
    p[d++] = x >>> 8 & 255, p[d++] = x & 255, p[d++] = x >>> 24 & 15 | 16, p[d++] = x >>> 16 & 255, p[d++] = y >>> 8 | 128, p[d++] = y & 255;
    for (let w = 0; w < 6; ++w)
      p[d + w] = g[w];
    return l || (0, t.unsafeStringify)(p);
  }
  var c = a;
  return En.default = c, En;
}
var bn = {}, sr = {}, Tn = {}, Au;
function Wp() {
  if (Au) return Tn;
  Au = 1, Object.defineProperty(Tn, "__esModule", {
    value: !0
  }), Tn.default = void 0;
  var e = t(/* @__PURE__ */ Fs());
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function r(i) {
    if (!(0, e.default)(i))
      throw TypeError("Invalid UUID");
    let o;
    const s = new Uint8Array(16);
    return s[0] = (o = parseInt(i.slice(0, 8), 16)) >>> 24, s[1] = o >>> 16 & 255, s[2] = o >>> 8 & 255, s[3] = o & 255, s[4] = (o = parseInt(i.slice(9, 13), 16)) >>> 8, s[5] = o & 255, s[6] = (o = parseInt(i.slice(14, 18), 16)) >>> 8, s[7] = o & 255, s[8] = (o = parseInt(i.slice(19, 23), 16)) >>> 8, s[9] = o & 255, s[10] = (o = parseInt(i.slice(24, 36), 16)) / 1099511627776 & 255, s[11] = o / 4294967296 & 255, s[12] = o >>> 24 & 255, s[13] = o >>> 16 & 255, s[14] = o >>> 8 & 255, s[15] = o & 255, s;
  }
  var n = r;
  return Tn.default = n, Tn;
}
var Pu;
function Hp() {
  if (Pu) return sr;
  Pu = 1, Object.defineProperty(sr, "__esModule", {
    value: !0
  }), sr.URL = sr.DNS = void 0, sr.default = s;
  var e = /* @__PURE__ */ ks(), t = r(/* @__PURE__ */ Wp());
  function r(a) {
    return a && a.__esModule ? a : { default: a };
  }
  function n(a) {
    a = unescape(encodeURIComponent(a));
    const c = [];
    for (let u = 0; u < a.length; ++u)
      c.push(a.charCodeAt(u));
    return c;
  }
  const i = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  sr.DNS = i;
  const o = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  sr.URL = o;
  function s(a, c, u) {
    function l(f, d, p, g) {
      var y;
      if (typeof f == "string" && (f = n(f)), typeof d == "string" && (d = (0, t.default)(d)), ((y = d) === null || y === void 0 ? void 0 : y.length) !== 16)
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let m = new Uint8Array(16 + f.length);
      if (m.set(d), m.set(f, d.length), m = u(m), m[6] = m[6] & 15 | c, m[8] = m[8] & 63 | 128, p) {
        g = g || 0;
        for (let S = 0; S < 16; ++S)
          p[g + S] = m[S];
        return p;
      }
      return (0, e.unsafeStringify)(m);
    }
    try {
      l.name = a;
    } catch {
    }
    return l.DNS = i, l.URL = o, l;
  }
  return sr;
}
var Cn = {}, Iu;
function Gw() {
  if (Iu) return Cn;
  Iu = 1, Object.defineProperty(Cn, "__esModule", {
    value: !0
  }), Cn.default = void 0;
  var e = t(_t);
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function r(i) {
    return Array.isArray(i) ? i = Buffer.from(i) : typeof i == "string" && (i = Buffer.from(i, "utf8")), e.default.createHash("md5").update(i).digest();
  }
  var n = r;
  return Cn.default = n, Cn;
}
var Du;
function zw() {
  if (Du) return bn;
  Du = 1, Object.defineProperty(bn, "__esModule", {
    value: !0
  }), bn.default = void 0;
  var e = r(/* @__PURE__ */ Hp()), t = r(/* @__PURE__ */ Gw());
  function r(o) {
    return o && o.__esModule ? o : { default: o };
  }
  var i = (0, e.default)("v3", 48, t.default);
  return bn.default = i, bn;
}
var Rn = {}, An = {}, xu;
function Vw() {
  if (xu) return An;
  xu = 1, Object.defineProperty(An, "__esModule", {
    value: !0
  }), An.default = void 0;
  var e = t(_t);
  function t(n) {
    return n && n.__esModule ? n : { default: n };
  }
  var r = {
    randomUUID: e.default.randomUUID
  };
  return An.default = r, An;
}
var Nu;
function Yw() {
  if (Nu) return Rn;
  Nu = 1, Object.defineProperty(Rn, "__esModule", {
    value: !0
  }), Rn.default = void 0;
  var e = n(/* @__PURE__ */ Vw()), t = n(/* @__PURE__ */ qp()), r = /* @__PURE__ */ ks();
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  function i(s, a, c) {
    if (e.default.randomUUID && !a && !s)
      return e.default.randomUUID();
    s = s || {};
    const u = s.random || (s.rng || t.default)();
    if (u[6] = u[6] & 15 | 64, u[8] = u[8] & 63 | 128, a) {
      c = c || 0;
      for (let l = 0; l < 16; ++l)
        a[c + l] = u[l];
      return a;
    }
    return (0, r.unsafeStringify)(u);
  }
  var o = i;
  return Rn.default = o, Rn;
}
var Pn = {}, In = {}, Ou;
function Kw() {
  if (Ou) return In;
  Ou = 1, Object.defineProperty(In, "__esModule", {
    value: !0
  }), In.default = void 0;
  var e = t(_t);
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function r(i) {
    return Array.isArray(i) ? i = Buffer.from(i) : typeof i == "string" && (i = Buffer.from(i, "utf8")), e.default.createHash("sha1").update(i).digest();
  }
  var n = r;
  return In.default = n, In;
}
var Lu;
function Xw() {
  if (Lu) return Pn;
  Lu = 1, Object.defineProperty(Pn, "__esModule", {
    value: !0
  }), Pn.default = void 0;
  var e = r(/* @__PURE__ */ Hp()), t = r(/* @__PURE__ */ Kw());
  function r(o) {
    return o && o.__esModule ? o : { default: o };
  }
  var i = (0, e.default)("v5", 80, t.default);
  return Pn.default = i, Pn;
}
var Dn = {}, Fu;
function Jw() {
  if (Fu) return Dn;
  Fu = 1, Object.defineProperty(Dn, "__esModule", {
    value: !0
  }), Dn.default = void 0;
  var e = "00000000-0000-0000-0000-000000000000";
  return Dn.default = e, Dn;
}
var xn = {}, ku;
function Qw() {
  if (ku) return xn;
  ku = 1, Object.defineProperty(xn, "__esModule", {
    value: !0
  }), xn.default = void 0;
  var e = t(/* @__PURE__ */ Fs());
  function t(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function r(i) {
    if (!(0, e.default)(i))
      throw TypeError("Invalid UUID");
    return parseInt(i.slice(14, 15), 16);
  }
  var n = r;
  return xn.default = n, xn;
}
var Uu;
function Zw() {
  return Uu || (Uu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "NIL", {
      enumerable: !0,
      get: function() {
        return o.default;
      }
    }), Object.defineProperty(e, "parse", {
      enumerable: !0,
      get: function() {
        return u.default;
      }
    }), Object.defineProperty(e, "stringify", {
      enumerable: !0,
      get: function() {
        return c.default;
      }
    }), Object.defineProperty(e, "v1", {
      enumerable: !0,
      get: function() {
        return t.default;
      }
    }), Object.defineProperty(e, "v3", {
      enumerable: !0,
      get: function() {
        return r.default;
      }
    }), Object.defineProperty(e, "v4", {
      enumerable: !0,
      get: function() {
        return n.default;
      }
    }), Object.defineProperty(e, "v5", {
      enumerable: !0,
      get: function() {
        return i.default;
      }
    }), Object.defineProperty(e, "validate", {
      enumerable: !0,
      get: function() {
        return a.default;
      }
    }), Object.defineProperty(e, "version", {
      enumerable: !0,
      get: function() {
        return s.default;
      }
    });
    var t = l(/* @__PURE__ */ jw()), r = l(/* @__PURE__ */ zw()), n = l(/* @__PURE__ */ Yw()), i = l(/* @__PURE__ */ Xw()), o = l(/* @__PURE__ */ Jw()), s = l(/* @__PURE__ */ Qw()), a = l(/* @__PURE__ */ Fs()), c = l(/* @__PURE__ */ ks()), u = l(/* @__PURE__ */ Wp());
    function l(f) {
      return f && f.__esModule ? f : { default: f };
    }
  })(wo)), wo;
}
var eE = /* @__PURE__ */ Zw();
const tr = /* @__PURE__ */ Up(eE);
tr.v1;
tr.v3;
const Tr = tr.v4;
tr.v5;
tr.NIL;
tr.version;
tr.validate;
tr.stringify;
tr.parse;
function tE(e) {
  return e === "wss:" ? "https:" : "http:";
}
function rE(e, t = "http://127.0.0.1:9090") {
  try {
    const r = new URL(e);
    return r.protocol = tE(r.protocol), r.pathname = "", r.search = "", r.hash = "", r.toString().replace(/\/$/, "");
  } catch {
    return t;
  }
}
function nE(e, t) {
  try {
    return new URL(e).toString();
  } catch {
    const r = rE(t);
    return new URL(e, r).toString();
  }
}
const He = {
  // 系统级
  SYS_HANDSHAKE: "sys.handshake",
  SYS_HANDSHAKE_ACK: "sys.handshake_ack",
  SYS_PING: "sys.ping",
  SYS_PONG: "sys.pong",
  SYS_ERROR: "sys.error",
  // 输入
  INPUT_MESSAGE: "input.message",
  INPUT_TOUCH: "input.touch",
  INPUT_SHORTCUT: "input.shortcut",
  // 表演
  PERFORM_SHOW: "perform.show",
  PERFORM_INTERRUPT: "perform.interrupt",
  // 资源
  RESOURCE_PREPARE: "resource.prepare",
  RESOURCE_COMMIT: "resource.commit",
  RESOURCE_GET: "resource.get",
  RESOURCE_RELEASE: "resource.release",
  RESOURCE_PROGRESS: "resource.progress",
  // 状态
  STATE_READY: "state.ready",
  STATE_PLAYING: "state.playing",
  STATE_CONFIG: "state.config",
  STATE_MODEL: "state.model",
  // 模型信息更新
  // 桌面感知
  DESKTOP_WINDOW_LIST: "desktop.window.list",
  DESKTOP_WINDOW_ACTIVE: "desktop.window.active",
  DESKTOP_CAPTURE_SCREENSHOT: "desktop.capture.screenshot",
  // 桌面工具调用
  DESKTOP_TOOL_CALL: "desktop.tool.call",
  // STT（语音转文字）
  STT_TRANSCRIBE: "stt.transcribe",
  STT_RESULT: "stt.result"
}, Mu = {
  AUTH_FAILED: 4001,
  VERSION_MISMATCH: 4002
}, iE = 256 * 1024;
function sE(e) {
  return !Number.isFinite(e) || (e ?? 0) <= 0 ? null : Math.max(1024, Math.floor(e));
}
function oE(e, t) {
  return `data:${t};base64,${e.toString("base64")}`;
}
function aE(e) {
  if (!e)
    return null;
  try {
    if (e instanceof ArrayBuffer)
      return Buffer.from(e);
    if (ArrayBuffer.isView(e))
      return Buffer.from(e.buffer, e.byteOffset, e.byteLength);
    if (Array.isArray(e))
      return Buffer.from(e);
    if (typeof e == "object") {
      const t = Object.entries(e).filter(([r]) => /^\d+$/.test(r)).sort((r, n) => Number(r[0]) - Number(n[0]));
      if (t.length > 0)
        return Buffer.from(t.map(([, r]) => Number(r) & 255));
    }
  } catch {
    return null;
  }
  return null;
}
function jp(e) {
  const t = e.bytes;
  if (!t)
    return null;
  const r = aE(t);
  return r ? {
    mime: e.mime || "application/octet-stream",
    buffer: r
  } : null;
}
function tl(e) {
  if (typeof e != "string" || !e.startsWith("data:"))
    return null;
  const t = e.match(/^data:([^;,]+)?(?:;[^,]*)?;base64,(.+)$/);
  if (!t)
    return null;
  try {
    return {
      mime: t[1] || "application/octet-stream",
      buffer: Buffer.from(t[2], "base64")
    };
  } catch {
    return null;
  }
}
async function cE(e, t = {}) {
  const r = sE(t.maxInlineBytes) ?? iE, n = [];
  for (const i of e) {
    const o = i.inline ? tl(i.inline) : jp(i);
    if (!o) {
      n.push(i);
      continue;
    }
    if (o.buffer.length <= r) {
      n.push({
        ...i,
        inline: i.inline || oE(o.buffer, o.mime),
        bytes: void 0,
        mime: void 0
      });
      continue;
    }
    if (!t.uploadInlineResource)
      throw new Error(J("error.attachmentTooLarge", { limit: r }));
    const s = await t.uploadInlineResource(o.buffer, o.mime);
    if (!s)
      throw new Error(J("error.resourceUploadFailed"));
    n.push({
      ...i,
      url: s,
      inline: void 0,
      rid: void 0,
      bytes: void 0,
      mime: void 0
    });
  }
  return n;
}
const ii = {
  defaultTarget: "active",
  quality: 80,
  maxWidth: 1920
};
function lE(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(30, Math.min(100, Math.round(t))) : ii.quality;
}
function uE(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(640, Math.min(3840, Math.round(t))) : ii.maxWidth;
}
function Gp(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    defaultTarget: t.defaultTarget === "desktop" ? "desktop" : "active",
    quality: lE(t.quality),
    maxWidth: uE(t.maxWidth)
  };
}
const nn = {
  defaultTarget: Rt.screenshotDefaultTarget,
  quality: Rt.screenshotQuality,
  maxWidth: Rt.screenshotMaxWidth
};
function Us() {
  return Gp({
    defaultTarget: vt(nn.defaultTarget) ?? ii.defaultTarget,
    quality: vt(nn.quality) ?? ii.quality,
    maxWidth: vt(nn.maxWidth) ?? ii.maxWidth
  });
}
function dE(e) {
  const t = Gp({
    ...Us(),
    ...e
  });
  return wt(nn.defaultTarget, t.defaultTarget), wt(nn.quality, String(t.quality)), wt(nn.maxWidth, String(t.maxWidth)), t;
}
const Dr = at("desktop.capture");
async function rl() {
  return await ap();
}
function sn(e) {
  return String(e || "").trim().toLowerCase();
}
function gs(e) {
  var o, s;
  if (!e) return !1;
  const t = sn((o = e == null ? void 0 : e.owner) == null ? void 0 : o.path), r = sn((s = e == null ? void 0 : e.owner) == null ? void 0 : s.name), n = String((e == null ? void 0 : e.title) || "").trim(), i = sn(process.execPath);
  if (t && i && t === i || r === "electron" || r === "astrbot live2d desktop")
    return !0;
  if (!n) return !1;
  for (const a of Qe.getAllWindows()) {
    if (a.isDestroyed()) continue;
    const c = String(a.getTitle() || "").trim();
    if (c && (n === c || n.includes(c)))
      return !0;
  }
  return !!(n.includes("AstrBot Live2D") || n.includes("DevTools"));
}
const fE = [
  "astrbot",
  "live2d",
  "overlay",
  "screenshot",
  "snipping tool",
  "snip & sketch",
  "screenclippinghost",
  "clipping",
  "截图",
  "截屏"
];
function hE(e) {
  var r, n;
  const t = [
    sn((r = e == null ? void 0 : e.owner) == null ? void 0 : r.name),
    sn((n = e == null ? void 0 : e.owner) == null ? void 0 : n.path),
    sn(e == null ? void 0 : e.title)
  ].filter(Boolean);
  return t.length ? fE.some(
    (i) => t.some((o) => o.includes(i))
  ) : !1;
}
function pE(e) {
  if (e != null && e.bounds) {
    const t = {
      x: Math.round(e.bounds.x + e.bounds.width / 2),
      y: Math.round(e.bounds.y + e.bounds.height / 2)
    };
    return Lr.getDisplayNearestPoint(t);
  }
  return Lr.getPrimaryDisplay();
}
function mE(e, t) {
  const r = String(t.id);
  return e.find((n) => n.display_id === r) || e.find((n) => !n.display_id || n.display_id === "0") || e[0];
}
function gE(e, t, r, n) {
  const i = String((n == null ? void 0 : n.id) || ""), o = String((n == null ? void 0 : n.title) || "").trim();
  return (t === "window" && r ? e.find((s) => s.id === r || s.id.includes(r)) : void 0) || (t === "active" && i ? e.find((s) => s.id === i || s.id.includes(i)) : void 0) || (t === "active" && o ? e.find((s) => s.name === o || s.name.includes(o)) : void 0) || e[0];
}
function zp(e) {
  var t;
  return {
    id: String(e.id ?? ""),
    title: e.title ?? "",
    processName: ((t = e.owner) == null ? void 0 : t.name) ?? "",
    isActive: !0
  };
}
async function yE() {
  var n, i;
  const e = Dr.timer("window_list"), t = await rl();
  if (!t || gs(t))
    return e.done({
      count: 0,
      ignoredOwnWindow: !!(t && gs(t))
    }), { windows: [] };
  const r = { windows: [zp(t)] };
  return e.done({
    count: r.windows.length,
    title: (n = r.windows[0]) == null ? void 0 : n.title,
    processName: (i = r.windows[0]) == null ? void 0 : i.processName
  }), r;
}
async function Vp() {
  const e = Dr.timer("active_window"), t = await rl();
  if (!t || gs(t))
    return e.done({
      hasWindow: !1,
      ignoredOwnWindow: !!(t && gs(t))
    }), { window: null };
  const r = zp(t);
  return e.done({
    hasWindow: !0,
    title: r.title,
    processName: r.processName
  }), { window: r };
}
async function Yp(e, t, r = {}) {
  var x, w, E;
  const n = Dr.timer("screenshot", {
    requestedTarget: e.target,
    requestedWindowId: e.windowId,
    requestedQuality: e.quality,
    requestedMaxWidth: e.maxWidth,
    hasUploadFn: !!t,
    maxInlineBytes: r.maxInlineBytes
  }), i = Us(), o = e.target || i.defaultTarget, s = await rl(), a = Math.min(e.maxWidth || i.maxWidth, 3840), c = { width: a, height: Math.round(a * 0.5625) }, u = Math.max(64 * 1024, r.maxInlineBytes ?? 512 * 1024), l = e.quality || i.quality, f = async () => {
    const b = pE(s);
    Dr.debug("desktop_source.select.start", {
      displayId: b.id,
      displayBounds: b.bounds,
      displaySize: b.size
    });
    const v = await Bl.getSources({
      types: ["screen"],
      thumbnailSize: b.size
    }), P = mE(v, b);
    if (!P)
      throw new Error(J("error.desktopSourceUnavailable"));
    return Dr.debug("desktop_source.select.success", {
      displayId: b.id,
      sourceId: P.id,
      sourceName: P.name,
      sourceCount: v.length
    }), P;
  };
  let d, p = null;
  if (o === "desktop")
    d = await f();
  else if (o === "active" && hE(s))
    p = "active_window_bypassed", d = await f();
  else {
    const v = await Bl.getSources({
      types: ["window"],
      thumbnailSize: c
    });
    d = gE(v, o, e.windowId, s), Dr.debug("window_source.select", {
      target: o,
      requestedWindowId: e.windowId,
      activeWindowId: s == null ? void 0 : s.id,
      activeWindowTitle: s == null ? void 0 : s.title,
      sourceId: d == null ? void 0 : d.id,
      sourceName: d == null ? void 0 : d.name,
      sourceCount: v.length
    });
    const P = (w = (x = d == null ? void 0 : d.thumbnail) == null ? void 0 : x.getSize) == null ? void 0 : w.call(x);
    (!P || P.width <= 16 || P.height <= 16) && (p = "invalid_window_source", d = await f());
  }
  let g = d.thumbnail.getSize(), y = d.thumbnail.toJPEG(l);
  if ((g.width <= 16 || g.height <= 16 || y.length < 2048) && o !== "desktop" && (p = "invalid_capture", d = await f(), g = d.thumbnail.getSize(), y = d.thumbnail.toJPEG(l)), g.width <= 16 || g.height <= 16)
    throw n.fail(new Error("截图源不可捕获，请稍后重试"), {
      target: o,
      sourceId: d.id,
      sourceName: d.name,
      width: g.width,
      height: g.height,
      bytes: y.length,
      fallbackReason: p
    }), new Error(J("error.screenshotSourceUnavailable"));
  let S, C = "inline";
  if (!t || y.length <= u)
    S = `data:image/jpeg;base64,${y.toString("base64")}`;
  else {
    const b = await t(y, "image/jpeg");
    C = b ? "upload" : "upload_fallback", S = b || `data:image/jpeg;base64,${y.toString("base64")}`;
  }
  const A = {
    image: S,
    width: g.width,
    height: g.height,
    window: {
      id: d.id,
      title: d.name,
      processName: (E = s == null ? void 0 : s.owner) == null ? void 0 : E.name
    }
  };
  return n.done({
    target: o,
    sourceId: d.id,
    sourceName: d.name,
    width: g.width,
    height: g.height,
    bytes: y.length,
    inlineThreshold: u,
    imageMode: C,
    fallbackReason: p
  }), A;
}
let L2D_USER32_CACHE = null;
function L2D_GET_USER32() {
  if (L2D_USER32_CACHE)
    return L2D_USER32_CACHE;
  if (process.platform !== "win32")
    throw new Error("l2d_mouse_click only supports win32 currently");
  const e = Uy("koffi"), t = e.load("user32.dll");
  L2D_USER32_CACHE = {
    SetCursorPos: t.func("bool SetCursorPos(int X, int Y)"),
    mouse_event: t.func("void mouse_event(uint32 dwFlags, uint32 dx, uint32 dy, uint32 dwData, uintptr dwExtraInfo)")
  };
  return L2D_USER32_CACHE;
}
function L2D_SLEEP(e) {
  return new Promise((t) => setTimeout(t, e));
}
async function L2D_MOUSE_CLICK_EXEC(e = {}) {
  if (!globalThis.__l2dMouseClickEnabled)
    return { success: !1, disabled: !0, message: "模拟鼠标点击未开启。请在前端右键菜单的鼠标追踪面板中开启“允许模拟点击”。" };
  const t = Number(e.x), r = Number(e.y);
  if (!Number.isFinite(t) || !Number.isFinite(r))
    throw new Error("l2d_mouse_click requires finite x/y screen coordinates");
  const n = Math.round(t), i = Math.round(r), o = e.button === "right" ? "right" : e.button === "middle" ? "middle" : "left", s = Math.max(1, Math.min(3, Math.round(Number(e.clicks) || 1))), a = o === "right" ? [8, 16] : o === "middle" ? [32, 64] : [2, 4], u = L2D_GET_USER32();
  u.SetCursorPos(n, i);
  for (let l = 0; l < s; l++)
    u.mouse_event(a[0], 0, 0, 0, 0), await L2D_SLEEP(35), u.mouse_event(a[1], 0, 0, 0, 0), l < s - 1 && await L2D_SLEEP(60);
  return { success: !0, x: n, y: i, button: o, clicks: s, backend: "user32-koffi" };
}
function vE() {
  return [
    {
      name: "get_active_window",
      description: "获取用户当前正在使用的活跃窗口信息（标题、进程名）。当需要了解用户正在做什么时调用。",
      parameters: []
    },
    {
      name: "capture_screenshot",
      description: "截取用户桌面或特定窗口的屏幕截图。截图将作为图片附加到上下文供你分析。当需要查看用户屏幕内容、帮助用户解决问题、或对用户正在看的内容进行评论时调用。",
      parameters: [
        { name: "target", type: "string", description: '截图目标。"desktop"（全屏）、"active"（当前活跃窗口，默认）', required: !1 }
      ]
    }
  ];
}
const wE = {
  get_active_window: async () => await Vp(),
  capture_screenshot: async (e, t) => {
    const YM_aw = typeof YM_loadAwareness == "function" ? YM_loadAwareness() : null, YM_ps = typeof YM_loadPersonality == "function" ? YM_loadPersonality() : null;
    if (YM_aw && YM_aw.enabled && YM_aw.privacy && YM_aw.privacy.allowScreenshotOnRequest === false)
      throw new Error("Desktop awareness privacy settings block AI screenshot requests");
    if (YM_ps && YM_ps.enabled && YM_ps.allowScreenshot === false)
      throw new Error("Personality privacy settings block AI screenshot requests");
    const r = Us(), n = {
      target: e.target || r.defaultTarget,
      quality: r.quality,
      maxWidth: r.maxWidth
    };
    return await Yp(n, t.uploadFn, { maxInlineBytes: t.maxInlineBytes });
  }
};
async function EE(e, t, r = {}) {
  const n = Dr.timer("tool_call", {
    toolName: e,
    args: t,
    hasUploadFn: !!r.uploadFn,
    maxInlineBytes: r.maxInlineBytes
  }), i = wE[e];
  if (!i) {
    const o = new Error(J("error.unknownTool", { name: e }));
    throw n.fail(o), o;
  }
  try {
    const o = await i(t, r);
    return n.done({ result: o }), o;
  } catch (o) {
    throw n.fail(o), o;
  }
}
const Me = at("bridge.protocol");
function zt(e, t) {
  const r = new Error(t);
  return r.name = "BridgeClientError", r.code = e, r;
}
function _E(e) {
  return e.errorCode && e.errorMessage ? zt(e.errorCode, e.errorMessage) : zt(
    "WS_UNEXPECTED_CLOSE",
    `连接在握手阶段断开: ${e.reason || e.code || "unknown"}`
  );
}
class SE extends ip {
  constructor() {
    super(...arguments);
    _e(this, "ws", null);
    _e(this, "url", "");
    _e(this, "token", "");
    _e(this, "sessionId", "");
    _e(this, "userId", "");
    _e(this, "heartbeatTimer", null);
    _e(this, "handshakeTimer", null);
    _e(this, "ready", !1);
    _e(this, "pendingOpen", null);
    _e(this, "pendingDisconnectError", null);
    _e(this, "serverConfig", {});
    _e(this, "pendingRequests", /* @__PURE__ */ new Map());
  }
  /**
   * 建立单次连接并等待握手完成
   */
  async open(r) {
    if (this.ws)
      throw zt("CLIENT_UNAVAILABLE", "连接客户端忙碌中，请稍后重试");
    const n = (r.url || "").trim(), i = (r.token || "").trim();
    if (!i)
      throw zt("TOKEN_REQUIRED", "认证密钥不能为空，请在设置中填写后再连接");
    return this.url = n, this.token = i, this.ready = !1, this.pendingDisconnectError = null, this.resetSessionState(), Me.info("open.start", {
      url: n,
      hasToken: !!i,
      handshakeTimeoutMs: r.handshakeTimeoutMs
    }), await new Promise((o, s) => {
      try {
        this.pendingOpen = {
          resolve: () => o(this.getSession()),
          reject: s
        }, this.ws = new Ui(n), this.ws.on("open", () => {
          var a;
          console.log("[L2D] WebSocket 已连接"), Me.info("socket.open", { url: this.url }), (a = r.onSocketOpen) == null || a.call(r), this.sendHandshake(), this.startHandshakeTimeout(r.handshakeTimeoutMs);
        }), this.ws.on("message", (a) => {
          try {
            const c = JSON.parse(a.toString());
            this.handlePacket(c);
          } catch (c) {
            console.error("[L2D] 解析消息失败:", c), Me.error("packet.parse_failed", c, { bytes: a.length });
          }
        }), this.ws.on("close", (a, c) => {
          const u = this.handleSocketClose(a, c.toString());
          if (this.pendingOpen) {
            this.rejectPendingOpen(_E(u));
            return;
          }
          (this.ready || u.errorCode || u.errorMessage) && this.emit("disconnected", u);
        }), this.ws.on("error", (a) => {
          console.error("[L2D] WebSocket 错误:", a), Me.error("socket.error", a, { url: this.url }), this.pendingOpen && this.rejectPendingOpen(
            zt(
              "WS_CONNECT_FAILED",
              a instanceof Error ? a.message : String(a)
            )
          );
        });
      } catch (a) {
        Me.error("open.failed", a, { url: n }), this.rejectPendingOpen(
          zt(
            "WS_CONNECT_FAILED",
            a instanceof Error ? a.message : String(a)
          )
        );
      }
    });
  }
  /**
   * 主动关闭连接
   */
  close() {
    if (Me.info("close.requested", {
      ready: this.ready,
      hasSocket: !!this.ws,
      pendingRequests: this.pendingRequests.size,
      sessionId: this.sessionId
    }), this.stopHandshakeTimeout(), this.stopHeartbeat(), this.ws) {
      const r = this.ws;
      this.ws = null, r.readyState === Ui.CONNECTING ? r.terminate() : r.close();
    }
    this.pendingOpen && this.rejectPendingOpen(zt("CLIENT_UNAVAILABLE", "连接已关闭")), this.clearPendingRequests(new Error("连接已断开")), this.ready = !1, this.pendingDisconnectError = null, this.resetSessionState();
  }
  handleSocketClose(r, n) {
    var s, a;
    console.log(`[L2D] WebSocket 已断开: ${r} - ${n}`), this.stopHandshakeTimeout(), this.stopHeartbeat();
    const i = this.ready, o = {
      code: r,
      reason: n,
      errorCode: ((s = this.pendingDisconnectError) == null ? void 0 : s.code) || null,
      errorMessage: ((a = this.pendingDisconnectError) == null ? void 0 : a.message) || null
    };
    return Me.warn("socket.close", {
      code: r,
      reason: n,
      wasReady: i,
      pendingOpen: !!this.pendingOpen,
      errorCode: o.errorCode,
      errorMessage: o.errorMessage,
      sessionId: this.sessionId,
      pendingRequests: this.pendingRequests.size
    }), this.pendingDisconnectError = null, this.clearPendingRequests(new Error("连接已断开")), this.ready = !1, this.ws = null, this.resetSessionState(), !i && !this.pendingOpen, o;
  }
  resetSessionState() {
    this.sessionId = "", this.userId = "", this.serverConfig = {};
  }
  clearPendingRequests(r) {
    this.pendingRequests.size > 0 && Me.warn("pending_requests.clear", {
      count: this.pendingRequests.size,
      reason: r.message
    });
    for (const [, n] of this.pendingRequests)
      clearTimeout(n.timer), n.reject(r);
    this.pendingRequests.clear();
  }
  startHandshakeTimeout(r) {
    this.stopHandshakeTimeout(), Me.debug("handshake.timeout_timer.start", { timeoutMs: r }), this.handshakeTimer = setTimeout(() => {
      Me.warn("handshake.timeout", { timeoutMs: r, url: this.url }), this.rejectPendingOpen(
        zt("HANDSHAKE_TIMEOUT", "连接已建立但握手未完成，请检查服务端状态与认证配置")
      ), this.ws && this.ws.close(1008, "握手超时");
    }, r);
  }
  stopHandshakeTimeout() {
    this.handshakeTimer && (clearTimeout(this.handshakeTimer), this.handshakeTimer = null, Me.debug("handshake.timeout_timer.stop"));
  }
  rejectPendingOpen(r) {
    if (!this.pendingOpen)
      return;
    const n = this.pendingOpen;
    this.pendingOpen = null, this.stopHandshakeTimeout(), n.reject(r);
  }
  resolvePendingOpen() {
    if (!this.pendingOpen)
      return;
    const r = this.pendingOpen;
    this.pendingOpen = null, this.stopHandshakeTimeout(), r.resolve();
  }
  markProtocolDisconnect(r, n) {
    Me.warn("protocol.disconnect", { code: r, message: n }), this.pendingDisconnectError = { code: r, message: n }, this.ws && this.ws.close(1008, n);
  }
  rejectOpenWithProtocolError(r, n) {
    Me.warn("open.protocol_error", { code: r, message: n }), this.rejectPendingOpen(zt(r, n)), this.markProtocolDisconnect(r, n);
  }
  /**
   * 发送握手请求
   */
  sendHandshake() {
    var i;
    const r = pp(), n = {
      version: Wl,
      clientId: r,
      token: this.token,
      tools: vE()
    };
    Me.info("handshake.send", {
      userId: r,
      protocolVersion: Wl,
      toolCount: ((i = n.tools) == null ? void 0 : i.length) ?? 0,
      hasToken: !!this.token
    }), this.send({
      op: He.SYS_HANDSHAKE,
      id: Tr(),
      ts: Date.now(),
      payload: n
    });
  }
  /**
   * 处理接收到的数据包
   */
  handlePacket(r) {
    if (r.op !== He.SYS_PONG) {
      const i = this.sanitizeForLog(r.payload, r.op);
      Me.debug("packet.in", {
        op: r.op,
        id: r.id,
        hasError: !!r.error,
        payload: i,
        error: r.error
      }), console.log("[L2D] 收到数据包:", r.op, JSON.stringify(i, null, 2));
    }
    const n = this.pendingRequests.get(r.id);
    if (n) {
      this.pendingRequests.delete(r.id), clearTimeout(n.timer), r.error ? (Me.warn("request.failed", {
        id: r.id,
        op: r.op,
        error: r.error
      }), n.reject(new Error(r.error.message))) : (Me.debug("request.success", { id: r.id, op: r.op }), n.resolve(r.payload));
      return;
    }
    switch (r.op) {
      case He.SYS_HANDSHAKE_ACK:
        this.handleHandshakeAck(r.payload);
        break;
      case He.SYS_PONG:
        break;
      case He.PERFORM_SHOW:
        this.emit("perform:show", r.payload);
        break;
      case He.PERFORM_INTERRUPT:
        this.emit("perform:interrupt");
        break;
      case He.STT_RESULT:
        this.emit("stt:result", r.payload);
        break;
      case He.SYS_ERROR:
        this.handleSystemErrorPacket(r);
        break;
      case He.DESKTOP_WINDOW_LIST:
        this.handleDesktopWindowList(r);
        break;
      case He.DESKTOP_WINDOW_ACTIVE:
        this.handleDesktopWindowActive(r);
        break;
      case He.DESKTOP_CAPTURE_SCREENSHOT:
        this.handleDesktopCaptureScreenshot(r);
        break;
      case He.DESKTOP_TOOL_CALL:
        this.handleDesktopToolCall(r);
        break;
      case He.STATE_READY:
        break;
      default:
        console.warn("[L2D] 未知操作码:", r.op);
    }
  }
  handleSystemErrorPacket(r) {
    var o, s;
    const n = (o = r.error) == null ? void 0 : o.code, i = ((s = r.error) == null ? void 0 : s.message) || "服务端返回协议错误";
    if (n === Mu.AUTH_FAILED) {
      this.pendingOpen ? this.rejectOpenWithProtocolError("AUTH_FAILED", i) : this.markProtocolDisconnect("AUTH_FAILED", i);
      return;
    }
    if (n === Mu.VERSION_MISMATCH) {
      this.pendingOpen ? this.rejectOpenWithProtocolError("VERSION_MISMATCH", i) : this.markProtocolDisconnect("VERSION_MISMATCH", i);
      return;
    }
    console.error("[L2D] 收到系统错误:", r.error), Me.error("system_error.received", void 0, {
      id: r.id,
      error: r.error
    });
  }
  /**
   * 处理握手确认
   */
  handleHandshakeAck(r) {
    var i, o, s, a, c, u;
    const n = r.session;
    this.sessionId = (n == null ? void 0 : n.sessionId) || r.sessionId || "", this.userId = (n == null ? void 0 : n.userId) || r.userId || "", console.log("[L2D] 握手成功:", {
      sessionId: this.sessionId,
      userId: this.userId,
      capabilities: r.capabilities
    }), Me.info("handshake.success", {
      sessionId: this.sessionId,
      userId: this.userId,
      capabilities: r.capabilities,
      resourceBaseUrl: (i = r.config) == null ? void 0 : i.resourceBaseUrl,
      resourcePath: (o = r.config) == null ? void 0 : o.resourcePath,
      maxInlineBytes: (s = r.config) == null ? void 0 : s.maxInlineBytes
    }), this.serverConfig = {
      resourceBaseUrl: (a = r.config) == null ? void 0 : a.resourceBaseUrl,
      resourcePath: (c = r.config) == null ? void 0 : c.resourcePath,
      maxInlineBytes: (u = r.config) == null ? void 0 : u.maxInlineBytes
    }, this.ready = !0, this.startHeartbeat(), this.resolvePendingOpen();
  }
  /**
   * 启动心跳
   */
  startHeartbeat() {
    this.stopHeartbeat(), Me.debug("heartbeat.start", { intervalMs: 3e4 }), this.heartbeatTimer = setInterval(() => {
      this.send({
        op: He.SYS_PING,
        id: Tr(),
        ts: Date.now()
      });
    }, 3e4);
  }
  /**
   * 停止心跳
   */
  stopHeartbeat() {
    this.heartbeatTimer && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null, Me.debug("heartbeat.stop"));
  }
  /**
   * 发送消息
   */
  async sendMessage(r) {
    const n = Me.timer("send_message", {
      contentCount: Array.isArray(r.content) ? r.content.length : 0,
      sessionId: this.sessionId
    });
    try {
      const o = typeof YM_applyRuntimeContextToPayload == "function" ? await YM_applyRuntimeContextToPayload(r) : typeof YM_applyPersonalityToPayload == "function" ? YM_applyPersonalityToPayload(r) : r;
      const i = await this.prepareMessageContent(o.content);
      return this.send({
        op: He.INPUT_MESSAGE,
        id: Tr(),
        ts: Date.now(),
        payload: {
          ...o,
          content: i
        }
      }), n.done({
        preparedContentCount: i.length
      }), i;
    } catch (i) {
      throw n.fail(i), i;
    }
  }
  /**
   * 发送触摸事件
   */
  sendTouch(r, n, i) {
    Me.debug("send_touch", { x: r, y: n, action: i, sessionId: this.sessionId }), this.send({
      op: He.INPUT_TOUCH,
      id: Tr(),
      ts: Date.now(),
      payload: { x: r, y: n, action: i }
    });
  }
  /**
   * 发送状态
   */
  sendState(r, n) {
    Me.debug("send_state", {
      op: r,
      sessionId: this.sessionId,
      payload: this.sanitizeForLog(n)
    }), this.send({
      op: r,
      id: Tr(),
      ts: Date.now(),
      payload: n
    });
  }
  /**
   * 发送 STT 转录请求
   */
  sendSTTTranscribe(r) {
    Me.debug("send_stt_transcribe", {
      sessionId: this.sessionId,
      payload: this.sanitizeForLog(r)
    }), this.send({
      op: He.STT_TRANSCRIBE,
      id: Tr(),
      ts: Date.now(),
      payload: r
    });
  }
  /**
   * 脱敏处理用于日志输出
   */
  summarizePerformElementForLog(r) {
    if (!r || typeof r != "object")
      return { type: typeof r };
    const n = {
      type: r.type
    }, i = (o) => o.length <= 200 ? o : o.slice(0, 200) + "...";
    for (const o of ["content", "text", "url", "inline"])
      typeof r[o] == "string" && r[o] && (n[o] = i(r[o]));
    for (const o of ["rid", "ttsMode", "position", "group", "motionType", "resetPolicy"])
      typeof r[o] == "string" && r[o] && (n[o] = r[o]);
    for (const o of ["duration", "volume", "speed", "index", "priority", "fade", "holdMs"])
      typeof r[o] == "number" && (n[o] = r[o]);
    return (typeof r.id == "string" && r.id || typeof r.id == "number") && (n.id = r.id), Array.isArray(r.combo) && (n.combo = r.combo.map((o) => ({
      id: o == null ? void 0 : o.id,
      weight: o == null ? void 0 : o.weight
    }))), Array.isArray(r.semantic) && (n.semantic = r.semantic.map((o) => ({
      tag: o == null ? void 0 : o.tag,
      weight: o == null ? void 0 : o.weight
    }))), n;
  }
  summarizePerformShowForLog(r) {
    return !r || typeof r != "object" ? { payload: r } : {
      interrupt: r.interrupt,
      interruptible: r.interruptible ?? !0,
      sequenceLength: Array.isArray(r.sequence) ? r.sequence.length : 0,
      sequencePreview: Array.isArray(r.sequence) ? r.sequence.map((n) => this.summarizePerformElementForLog(n)) : []
    };
  }
  sanitizeForLog(r, n) {
    if (n === He.PERFORM_SHOW)
      return this.summarizePerformShowForLog(r);
    if (!r || typeof r != "object") return r;
    const i = ["token", "password", "secret", "apiKey", "accessKey"], o = 200, s = 3, a = 4, c = (u, l, f) => {
      if (!u || typeof u != "object")
        return typeof u == "string" && u.length > o ? u.slice(0, o) + "..." : u;
      if (l.has(u))
        return "[Circular]";
      if (f >= a)
        return Array.isArray(u) ? `[Array:${u.length}]` : "[Object]";
      if (l.add(u), Array.isArray(u)) {
        const p = u.slice(0, s).map((y) => c(y, l, f + 1)), g = {
          __type: "array",
          length: u.length,
          preview: p
        };
        return l.delete(u), g;
      }
      const d = {};
      for (const [p, g] of Object.entries(u))
        i.some((y) => p.toLowerCase().includes(y)) ? d[p] = "***" : d[p] = c(g, l, f + 1);
      return l.delete(u), d;
    };
    return c(r, /* @__PURE__ */ new WeakSet(), 0);
  }
  /**
   * 发送数据包
   */
  send(r) {
    var n;
    if (!this.ws || this.ws.readyState !== Ui.OPEN) {
      console.warn("[L2D] WebSocket 未连接，无法发送消息"), Me.warn("packet.out.skipped", {
        op: r.op,
        id: r.id,
        readyState: (n = this.ws) == null ? void 0 : n.readyState
      });
      return;
    }
    try {
      r.op !== He.SYS_PING && Me.debug("packet.out", {
        op: r.op,
        id: r.id,
        hasError: !!r.error,
        payload: this.sanitizeForLog(r.payload),
        error: r.error
      }), this.ws.send(JSON.stringify(r));
    } catch (i) {
      console.error("[L2D] 发送消息失败:", i), Me.error("packet.out.failed", i, { op: r.op, id: r.id });
    }
  }
  /**
   * 获取连接状态
   */
  isReady() {
    var r;
    return this.ready && ((r = this.ws) == null ? void 0 : r.readyState) === Ui.OPEN && !!this.sessionId;
  }
  /**
   * 获取会话信息
   */
  getSession() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      config: { ...this.serverConfig }
    };
  }
  /**
   * 处理窗口列表请求
   */
  async handleDesktopWindowList(r) {
    const n = Me.timer("desktop_window_list", { requestId: r.id });
    try {
      const i = await yE();
      n.done({ windowCount: i.windows.length }), this.send({
        op: He.DESKTOP_WINDOW_LIST,
        id: r.id,
        ts: Date.now(),
        payload: i
      });
    } catch (i) {
      console.error("[L2D] 获取窗口列表失败:", i), n.fail(i), this.send({
        op: He.SYS_ERROR,
        id: r.id,
        ts: Date.now(),
        error: { code: 5e3, message: `获取窗口列表失败: ${i}` }
      });
    }
  }
  /**
   * 处理活跃窗口请求
   */
  async handleDesktopWindowActive(r) {
    var i;
    const n = Me.timer("desktop_window_active", { requestId: r.id });
    try {
      const o = await Vp();
      n.done({ hasWindow: !!o.window, processName: (i = o.window) == null ? void 0 : i.processName }), this.send({
        op: He.DESKTOP_WINDOW_ACTIVE,
        id: r.id,
        ts: Date.now(),
        payload: o
      });
    } catch (o) {
      console.error("[L2D] 获取活跃窗口失败:", o), n.fail(o), this.send({
        op: He.SYS_ERROR,
        id: r.id,
        ts: Date.now(),
        error: { code: 5e3, message: `获取活跃窗口失败: ${o}` }
      });
    }
  }
  /**
   * 处理截图请求
   */
  async handleDesktopCaptureScreenshot(r) {
    var i;
    const n = Me.timer("desktop_capture_screenshot", {
      requestId: r.id,
      payload: this.sanitizeForLog(r.payload)
    });
    try {
      const o = r.payload || {}, s = this.serverConfig.resourceBaseUrl ? (c, u) => this.uploadResource(c, u) : void 0, a = await Yp(o, s, {
        maxInlineBytes: this.serverConfig.maxInlineBytes
      });
      n.done({
        width: a.width,
        height: a.height,
        sourceTitle: (i = a.window) == null ? void 0 : i.title,
        imageMode: a.image.startsWith("data:") ? "inline" : "url"
      }), this.send({
        op: He.DESKTOP_CAPTURE_SCREENSHOT,
        id: r.id,
        ts: Date.now(),
        payload: a
      });
    } catch (o) {
      console.error("[L2D] 截图失败:", o), n.fail(o), this.send({
        op: He.SYS_ERROR,
        id: r.id,
        ts: Date.now(),
        error: { code: 5e3, message: `截图失败: ${o}` }
      });
    }
  }
  /**
   * 处理通用桌面工具调用
   */
  async handleDesktopToolCall(r) {
    const { tool: n, args: i } = r.payload || {}, o = Me.timer("desktop_tool_call", {
      requestId: r.id,
      tool: n,
      args: this.sanitizeForLog(i)
    });
    try {
      const s = this.serverConfig.resourceBaseUrl ? (c, u) => this.uploadResource(c, u) : void 0, a = await EE(n, i || {}, {
        uploadFn: s,
        maxInlineBytes: this.serverConfig.maxInlineBytes
      });
      o.done({
        result: this.sanitizeForLog(a)
      }), this.send({
        op: He.DESKTOP_TOOL_CALL,
        id: r.id,
        ts: Date.now(),
        payload: { tool: n, result: a }
      });
    } catch (s) {
      console.error(`[L2D] 工具 ${n} 调用失败:`, s), o.fail(s), this.send({
        op: He.DESKTOP_TOOL_CALL,
        id: r.id,
        ts: Date.now(),
        payload: { tool: n, error: (s == null ? void 0 : s.message) || String(s) }
      });
    }
  }
  /**
   * 发送数据包并等待同 ID 响应
   */
  sendAndWait(r, n = 15e3) {
    return new Promise((i, o) => {
      const s = Me.timer("request_wait", {
        id: r.id,
        op: r.op,
        timeoutMs: n
      }), a = setTimeout(() => {
        this.pendingRequests.delete(r.id), s.fail(new Error("请求超时")), o(new Error("请求超时"));
      }, n);
      this.pendingRequests.set(r.id, {
        resolve: (c) => {
          s.done(), i(c);
        },
        reject: (c) => {
          s.fail(c), o(c);
        },
        timer: a
      }), this.send(r);
    });
  }
  async prepareMessageContent(r) {
    const n = Me.timer("message_content.prepare", {
      contentCount: r.length,
      hasResourceUpload: !!this.serverConfig.resourceBaseUrl,
      maxInlineBytes: this.serverConfig.maxInlineBytes
    });
    try {
      const i = await cE(r, {
        maxInlineBytes: this.serverConfig.maxInlineBytes,
        uploadInlineResource: this.serverConfig.resourceBaseUrl ? (o, s) => this.uploadResource(o, s) : void 0
      });
      return n.done({ preparedContentCount: i.length }), i;
    } catch (i) {
      throw n.fail(i), i;
    }
  }
  resolveHttpResourceUrl(r) {
    return nE(r, this.url);
  }
  /**
   * 通过资源服务器上传文件，返回资源 URL
   */
  async uploadResource(r, n) {
    var o, s, a;
    const i = Me.timer("resource.upload", {
      bytes: r.length,
      mime: n,
      resourceBaseUrl: this.serverConfig.resourceBaseUrl
    });
    try {
      const c = np("sha256").update(r).digest("hex"), u = {
        op: He.RESOURCE_PREPARE,
        id: Tr(),
        ts: Date.now(),
        payload: { kind: "image", mime: n, size: r.length, sha256: c }
      }, l = await this.sendAndWait(u), f = (o = l == null ? void 0 : l.upload) == null ? void 0 : o.url;
      if (!f || !(l != null && l.rid))
        return i.done({ mode: "missing_upload_url" }), null;
      const d = this.resolveHttpResourceUrl(f), p = { "Content-Type": n }, g = (s = l == null ? void 0 : l.upload) == null ? void 0 : s.headers;
      g && Object.assign(p, g);
      const y = await this.httpPut(d, r, p);
      if (y >= 200 && y < 300) {
        const m = ((a = l == null ? void 0 : l.resource) == null ? void 0 : a.url) || f, S = this.resolveHttpResourceUrl(m);
        return i.done({ status: y, rid: l.rid, mode: "url" }), S;
      }
      return console.error("[L2D] 资源上传 HTTP 失败:", y), i.done({ status: y, mode: "failed_status" }), null;
    } catch (c) {
      return console.error("[L2D] 资源上传失败:", c), i.fail(c), null;
    }
  }
  httpPut(r, n, i = {}) {
    return new Promise((o, s) => {
      const a = new URL(r), c = a.protocol === "https:", u = c ? Fc : hi, l = {
        protocol: a.protocol,
        hostname: a.hostname,
        port: a.port || (c ? 443 : 80),
        path: a.pathname + a.search,
        method: "PUT",
        headers: { ...i, "Content-Length": n.length.toString() }
      }, f = u.request(l, (d) => {
        d.resume(), o(d.statusCode || 500);
      });
      f.on("error", s), f.write(n), f.end();
    });
  }
}
function bE(e) {
  return !!e && typeof e == "object" && typeof e.code == "string";
}
function TE(e) {
  if (bE(e)) {
    const t = e.code !== "INVALID_URL" && e.code !== "TOKEN_REQUIRED" && e.code !== "AUTH_FAILED" && e.code !== "VERSION_MISMATCH";
    return {
      code: e.code,
      message: e.message,
      retryable: t
    };
  }
  return e instanceof Error ? {
    code: "WS_CONNECT_FAILED",
    message: e.message,
    retryable: !0
  } : {
    code: "UNKNOWN",
    message: String(e),
    retryable: !0
  };
}
function CE(e) {
  const t = e.errorCode || "WS_UNEXPECTED_CLOSE", r = e.errorMessage || `连接已断开: ${e.reason || e.code}`;
  return {
    code: t,
    message: r,
    retryable: t !== "AUTH_FAILED" && t !== "VERSION_MISMATCH",
    closeCode: e.code,
    closeReason: e.reason
  };
}
function RE(e, t) {
  const r = Math.max(1, t);
  return Math.min(
    e.retryBaseDelayMs * Math.pow(2, r - 1),
    e.retryMaxDelayMs
  );
}
const Oe = at("bridge.lifecycle");
function $i(e, t) {
  return {
    source: e,
    code: t == null ? void 0 : t.closeCode,
    reason: t == null ? void 0 : t.closeReason,
    at: Date.now()
  };
}
function AE(e, t) {
  return e.serverUrl !== t.serverUrl || e.token !== t.token;
}
function or(e) {
  var t;
  return {
    status: e.status,
    desiredState: e.desiredState,
    reconnectAttempt: e.reconnectAttempt,
    nextRetryAt: e.nextRetryAt,
    suspendReason: e.suspendReason,
    activeConfigRevision: e.activeConfigRevision,
    serverUrl: e.serverUrl,
    hasToken: e.hasToken,
    sessionId: (t = e.session) == null ? void 0 : t.sessionId,
    lastError: e.lastError ? {
      code: e.lastError.code,
      message: e.lastError.message,
      retryable: e.lastError.retryable,
      at: e.lastError.at
    } : null,
    lastDisconnect: e.lastDisconnect
  };
}
class PE extends ip {
  constructor() {
    super(...arguments);
    _e(this, "snapshot", Ns());
    _e(this, "behaviorSettings", cu().settings);
    _e(this, "startupDecisionPending", !0);
    _e(this, "initialized", !1);
    _e(this, "hasUserDrivenAction", !1);
    _e(this, "currentSettings", ou());
    _e(this, "retryTimer", null);
    _e(this, "currentGeneration", 0);
    _e(this, "pendingClient", null);
    _e(this, "activeClient", null);
    _e(this, "activeClientListeners", []);
  }
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, ...n) {
    return super.emit(r, ...n);
  }
  async initialize() {
    if (this.initialized) {
      Oe.debug("initialize.skipped", { reason: "already_initialized" });
      return;
    }
    Oe.info("initialize.start");
    const r = Op();
    r.success ? (this.currentSettings = r.data, Oe.debug("settings.load.success", {
      revision: this.currentSettings.revision,
      serverUrl: this.currentSettings.serverUrl,
      hasToken: !!this.currentSettings.token.trim()
    })) : (console.error("[BridgeConnectionController] 读取连接配置失败:", r.code, r.message), Oe.warn("settings.load.failed", {
      code: r.code,
      message: r.message
    }), this.currentSettings = ou());
    const n = cu();
    this.behaviorSettings = n.settings, this.startupDecisionPending = !n.exists, this.applySnapshot({
      activeConfigRevision: this.currentSettings.revision,
      serverUrl: this.currentSettings.serverUrl,
      hasToken: !!this.currentSettings.token.trim()
    }), this.initialized = !0, Oe.info("initialize.success", {
      startupDecisionPending: this.startupDecisionPending,
      autoConnectOnAppLaunch: this.behaviorSettings.autoConnectOnAppLaunch,
      snapshot: or(this.snapshot)
    }), !this.startupDecisionPending && this.behaviorSettings.autoConnectOnAppLaunch && (this.applySnapshot({ desiredState: "connected" }), await this.openCurrentSettings("startup"));
  }
  dispose() {
    Oe.info("dispose.start", { snapshot: or(this.snapshot) }), this.cancelRetryTimer(), this.closePendingClient(), this.closeActiveClient(), Oe.info("dispose.success");
  }
  getSnapshot() {
    return { ...this.snapshot };
  }
  getSession() {
    return this.snapshot.session;
  }
  isConnected() {
    var r;
    return this.snapshot.status === "connected" && !!((r = this.activeClient) != null && r.isReady());
  }
  async connect() {
    Oe.info("connect.requested", {
      serverUrl: this.currentSettings.serverUrl,
      hasToken: !!this.currentSettings.token.trim()
    });
    const r = ru({
      serverUrl: this.currentSettings.serverUrl,
      token: this.currentSettings.token
    });
    return r.valid ? (this.hasUserDrivenAction = !0, this.applySnapshot({
      desiredState: "connected",
      suspendReason: null
    }), await this.openCurrentSettings("manual")) : (Oe.warn("connect.validation_failed", {
      code: r.code,
      message: r.message
    }), {
      success: !1,
      code: r.code,
      message: r.message,
      snapshot: this.getSnapshot()
    });
  }
  async disconnect() {
    return Oe.info("disconnect.requested", { snapshot: or(this.snapshot) }), this.hasUserDrivenAction = !0, this.cancelRetryTimer(), this.closePendingClient(), this.closeActiveClient(), this.applySnapshot({
      status: "idle",
      desiredState: "disconnected",
      session: null,
      reconnectAttempt: 0,
      nextRetryAt: null,
      suspendReason: null,
      lastError: null,
      lastDisconnect: $i("manual")
    }), {
      success: !0,
      snapshot: this.getSnapshot()
    };
  }
  async handleConnectionSettingsUpdated(r) {
    const n = this.currentSettings;
    this.currentSettings = r;
    const i = AE(n, r);
    Oe.info("settings.updated", {
      previousRevision: n.revision,
      nextRevision: r.revision,
      serverUrl: r.serverUrl,
      hasToken: !!r.token.trim(),
      transportLayerChanged: i,
      desiredState: this.snapshot.desiredState
    }), this.applySnapshot({
      activeConfigRevision: r.revision,
      serverUrl: r.serverUrl,
      hasToken: !!r.token.trim()
    }), this.snapshot.desiredState === "connected" && i && await this.restartWithCurrentSettings("settings-changed");
  }
  async handleBehaviorSettingsUpdated(r, n = {}) {
    var i, o, s;
    if (this.behaviorSettings = r, Oe.info("behavior_settings.updated", {
      resolveStartupDecision: !!n.resolveStartupDecision,
      startupDecisionPending: this.startupDecisionPending,
      autoConnectOnAppLaunch: r.autoConnectOnAppLaunch,
      retryEnabled: r.retryEnabled,
      retryMaxAttempts: r.retryMaxAttempts,
      resumeDesiredConnectionOnWake: r.resumeDesiredConnectionOnWake
    }), n.resolveStartupDecision && this.startupDecisionPending && (this.startupDecisionPending = !1, !this.hasUserDrivenAction && r.autoConnectOnAppLaunch && this.snapshot.desiredState === "disconnected")) {
      this.applySnapshot({ desiredState: "connected" }), await this.openCurrentSettings("startup");
      return;
    }
    if (this.snapshot.status === "waiting_retry" && this.snapshot.desiredState === "connected") {
      r.retryEnabled ? this.scheduleRetry({
        code: ((i = this.snapshot.lastError) == null ? void 0 : i.code) || "WS_UNEXPECTED_CLOSE",
        message: ((o = this.snapshot.lastError) == null ? void 0 : o.message) || J("error.notConnectedToServer"),
        retryable: !0
      }) : (this.cancelRetryTimer(), this.applySnapshot({
        status: "error",
        nextRetryAt: null
      }));
      return;
    }
    this.snapshot.status === "error" && this.snapshot.desiredState === "connected" && ((s = this.snapshot.lastError) != null && s.retryable) && r.retryEnabled && this.scheduleRetry({
      code: this.snapshot.lastError.code,
      message: this.snapshot.lastError.message,
      retryable: !0
    });
  }
  async handleSystemSuspend(r) {
    if (this.snapshot.desiredState !== "connected") {
      Oe.debug("system_suspend.ignored", {
        reason: r,
        desiredState: this.snapshot.desiredState,
        status: this.snapshot.status
      });
      return;
    }
    if (Oe.info("system_suspend.start", { reason: r, snapshot: or(this.snapshot) }), this.cancelRetryTimer(), this.closePendingClient(), this.closeActiveClient(), this.behaviorSettings.resumeDesiredConnectionOnWake) {
      this.applySnapshot({
        status: "suspended",
        session: null,
        nextRetryAt: null,
        suspendReason: r,
        lastDisconnect: $i("system-suspend")
      });
      return;
    }
    this.applySnapshot({
      status: "idle",
      desiredState: "disconnected",
      session: null,
      reconnectAttempt: 0,
      nextRetryAt: null,
      suspendReason: null,
      lastError: null,
      lastDisconnect: $i("system-suspend")
    });
  }
  async handleSystemResume() {
    if (this.snapshot.status !== "suspended" || this.snapshot.desiredState !== "connected") {
      Oe.debug("system_resume.ignored", {
        status: this.snapshot.status,
        desiredState: this.snapshot.desiredState
      });
      return;
    }
    Oe.info("system_resume.start", { snapshot: or(this.snapshot) }), this.applySnapshot({ suspendReason: null }), await this.openCurrentSettings("resume");
  }
  async sendMessage(r) {
    var n, i;
    if (!((n = this.activeClient) != null && n.isReady()))
      throw new Error(J("error.notConnectedToServer"));
    return Oe.debug("send_message.start", {
      contentCount: Array.isArray(r.content) ? r.content.length : 0,
      sessionId: (i = this.snapshot.session) == null ? void 0 : i.sessionId
    }), await this.activeClient.sendMessage(r);
  }
  sendTouch(r, n, i) {
    var o, s;
    if (!((o = this.activeClient) != null && o.isReady()))
      throw new Error("未连接到服务器");
    Oe.debug("send_touch", { x: r, y: n, action: i, sessionId: (s = this.snapshot.session) == null ? void 0 : s.sessionId }), this.activeClient.sendTouch(r, n, i);
  }
  sendState(r, n) {
    var i, o;
    if (!((i = this.activeClient) != null && i.isReady()))
      throw new Error("未连接到服务器");
    Oe.debug("send_state", { op: r, sessionId: (o = this.snapshot.session) == null ? void 0 : o.sessionId }), this.activeClient.sendState(r, n);
  }
  async restartWithCurrentSettings(r) {
    Oe.info("restart.start", { reason: r, snapshot: or(this.snapshot) }), this.cancelRetryTimer(), this.closePendingClient(), this.closeActiveClient(), await this.openCurrentSettings(r);
  }
  async openCurrentSettings(r) {
    const n = Oe.timer("connect", {
      reason: r,
      serverUrl: this.currentSettings.serverUrl,
      configRevision: this.currentSettings.revision,
      hasToken: !!this.currentSettings.token.trim()
    }), i = ru({
      serverUrl: this.currentSettings.serverUrl,
      token: this.currentSettings.token
    });
    if (!i.valid)
      return n.fail(new Error(i.message), {
        code: i.code,
        retryable: !1
      }), this.applyFailure(
        {
          code: i.code,
          message: i.message,
          retryable: !1
        },
        r === "settings-changed" ? "settings-changed" : "socket-error"
      ), {
        success: !1,
        code: i.code,
        message: i.message,
        snapshot: this.getSnapshot()
      };
    const o = ++this.currentGeneration;
    Oe.info("connect.start", {
      reason: r,
      generation: o,
      reconnectAttempt: r === "retry" ? this.snapshot.reconnectAttempt : 0,
      serverUrl: this.currentSettings.serverUrl,
      handshakeTimeoutMs: this.behaviorSettings.handshakeTimeoutMs
    }), this.cancelRetryTimer(), this.closePendingClient(), this.closeActiveClient();
    const s = r === "retry" ? this.snapshot.reconnectAttempt : 0;
    this.applySnapshot({
      status: "connecting",
      desiredState: "connected",
      session: null,
      reconnectAttempt: s,
      nextRetryAt: null,
      suspendReason: null,
      lastError: null,
      activeConfigRevision: this.currentSettings.revision,
      serverUrl: this.currentSettings.serverUrl,
      hasToken: !!this.currentSettings.token.trim()
    });
    const a = new SE();
    this.pendingClient = a;
    try {
      const c = await a.open({
        url: this.currentSettings.serverUrl,
        token: this.currentSettings.token,
        handshakeTimeoutMs: this.behaviorSettings.handshakeTimeoutMs,
        onSocketOpen: () => {
          o !== this.currentGeneration || this.pendingClient !== a || (Oe.debug("socket.open", { generation: o, reason: r }), this.applySnapshot({ status: "handshaking" }));
        }
      });
      return o !== this.currentGeneration || this.pendingClient !== a || this.snapshot.desiredState !== "connected" ? (Oe.warn("connect.superseded", {
        reason: r,
        generation: o,
        currentGeneration: this.currentGeneration,
        desiredState: this.snapshot.desiredState
      }), a.close(), n.done({ superseded: !0, generation: o }), {
        success: !0,
        snapshot: this.getSnapshot()
      }) : (this.pendingClient = null, this.promoteActiveClient(a, o), this.applySnapshot({
        status: "connected",
        session: c,
        reconnectAttempt: 0,
        nextRetryAt: null,
        suspendReason: null,
        lastError: null
      }), Oe.info("connect.success", {
        reason: r,
        generation: o,
        sessionId: c.sessionId,
        userId: c.userId
      }), n.done({ generation: o, sessionId: c.sessionId }), {
        success: !0,
        snapshot: this.getSnapshot()
      });
    } catch (c) {
      if (o !== this.currentGeneration)
        return Oe.warn("connect.failed_superseded", {
          reason: r,
          generation: o,
          currentGeneration: this.currentGeneration
        }), n.fail(c, { generation: o, superseded: !0 }), {
          success: !1,
          code: "CLIENT_UNAVAILABLE",
          message: J("error.connectionSuperseded"),
          snapshot: this.getSnapshot()
        };
      this.pendingClient === a && (this.pendingClient = null), a.close();
      const u = TE(c);
      return Oe.warn("connect.failed", {
        reason: r,
        generation: o,
        code: u.code,
        message: u.message,
        retryable: u.retryable
      }), n.fail(c, { generation: o, code: u.code, retryable: u.retryable }), this.applyFailure(u, "socket-error"), {
        success: !1,
        code: u.code,
        message: u.message,
        snapshot: this.getSnapshot()
      };
    }
  }
  promoteActiveClient(r, n) {
    Oe.debug("client.promote", { generation: n }), this.activeClient = r;
    const i = (c) => {
      if (n !== this.currentGeneration || this.activeClient !== r)
        return;
      Oe.warn("client.disconnected", {
        generation: n,
        code: c.code,
        reason: c.reason,
        errorCode: c.errorCode,
        errorMessage: c.errorMessage
      }), this.activeClient = null, this.clearActiveClientListeners();
      const u = CE(c);
      this.applyFailure(u, "socket-close");
    }, o = (c) => {
      n === this.currentGeneration && this.activeClient === r && (Oe.debug("perform_show.received", { generation: n, payload: c }), this.emit("perform:show", c));
    }, s = () => {
      n === this.currentGeneration && this.activeClient === r && (Oe.info("perform_interrupt.received", { generation: n }), this.emit("perform:interrupt"));
    }, a = (c) => {
      n === this.currentGeneration && this.activeClient === r && (Oe.debug("stt_result.received", { generation: n, payload: c }), this.emit("stt:result", c));
    };
    r.on("disconnected", i), r.on("perform:show", o), r.on("perform:interrupt", s), r.on("stt:result", a), this.activeClientListeners = [
      { event: "disconnected", listener: i },
      { event: "perform:show", listener: o },
      { event: "perform:interrupt", listener: s },
      { event: "stt:result", listener: a }
    ];
  }
  clearActiveClientListeners() {
    if (!this.activeClient) {
      this.activeClientListeners = [];
      return;
    }
    for (const { event: r, listener: n } of this.activeClientListeners)
      this.activeClient.off(r, n);
    this.activeClientListeners = [];
  }
  closePendingClient() {
    if (!this.pendingClient)
      return;
    Oe.debug("pending_client.close");
    const r = this.pendingClient;
    this.pendingClient = null, r.close();
  }
  closeActiveClient() {
    if (!this.activeClient)
      return;
    Oe.debug("active_client.close");
    const r = this.activeClient;
    this.clearActiveClientListeners(), this.activeClient = null, r.close();
  }
  cancelRetryTimer() {
    this.retryTimer && (clearTimeout(this.retryTimer), this.retryTimer = null, Oe.debug("retry.cancel"));
  }
  scheduleRetry(r) {
    if (this.snapshot.desiredState !== "connected" || !r.retryable || !this.behaviorSettings.retryEnabled) {
      Oe.warn("retry.skip", {
        desiredState: this.snapshot.desiredState,
        retryable: r.retryable,
        retryEnabled: this.behaviorSettings.retryEnabled,
        code: r.code
      }), this.applySnapshot({
        status: "error",
        nextRetryAt: null
      });
      return;
    }
    const n = Math.max(1, this.snapshot.reconnectAttempt + 1);
    if (this.behaviorSettings.retryMaxAttempts !== null && n > this.behaviorSettings.retryMaxAttempts) {
      Oe.warn("retry.max_attempts_reached", {
        nextAttempt: n,
        retryMaxAttempts: this.behaviorSettings.retryMaxAttempts,
        code: r.code
      }), this.applySnapshot({
        status: "error",
        reconnectAttempt: n - 1,
        nextRetryAt: null
      });
      return;
    }
    this.cancelRetryTimer();
    const i = RE(this.behaviorSettings, n), o = Date.now() + i;
    Oe.info("retry.schedule", {
      attempt: n,
      delayMs: i,
      nextRetryAt: o,
      code: r.code,
      message: r.message
    }), this.applySnapshot({
      status: "waiting_retry",
      reconnectAttempt: n,
      nextRetryAt: o
    }), this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.snapshot.desiredState === "connected" && this.openCurrentSettings("retry");
    }, i);
  }
  applyFailure(r, n) {
    if (Oe.warn("failure.apply", {
      disconnectSource: n,
      code: r.code,
      message: r.message,
      retryable: r.retryable,
      desiredState: this.snapshot.desiredState
    }), this.cancelRetryTimer(), this.closePendingClient(), this.applySnapshot({
      session: null,
      lastError: {
        code: r.code,
        message: r.message,
        retryable: r.retryable,
        at: Date.now()
      },
      lastDisconnect: $i(n, r),
      nextRetryAt: null,
      suspendReason: null
    }), r.retryable && this.snapshot.desiredState === "connected" && this.behaviorSettings.retryEnabled) {
      this.scheduleRetry(r);
      return;
    }
    this.applySnapshot({
      status: "error",
      nextRetryAt: null
    });
  }
  applySnapshot(r) {
    const n = this.snapshot;
    this.snapshot = {
      ...this.snapshot,
      ...r,
      updatedAt: Date.now()
    };
    const o = n.status !== this.snapshot.status || n.desiredState !== this.snapshot.desiredState || n.reconnectAttempt !== this.snapshot.reconnectAttempt || n.nextRetryAt !== this.snapshot.nextRetryAt || n.suspendReason !== this.snapshot.suspendReason ? "state.changed" : "state.updated";
    Oe.debug(o, {
      patch: r,
      previous: or(n),
      next: or(this.snapshot)
    }), this.emit("stateChanged", this.getSnapshot());
  }
}
const IE = Cs(import.meta.url), DE = Q.dirname(IE);
let Le = null, di = null, xr = !1, Nr = null;
le.listenerCount("settings:getPendingPage") || le.handle("settings:getPendingPage", () => {
  const e = di;
  return di = null, e;
});
function xE(e) {
  if (Le)
    return Le.focus(), e && (xr ? Le.webContents.send("settings:navigateTo", e) : di = e), Le;
  di = e || null, Le = new Qe({
    show: !1,
    width: 1080,
    height: 720,
    minWidth: 900,
    minHeight: 560,
    title: "设置",
    icon: Is(),
    frame: !1,
    titleBarStyle: "hidden",
    transparent: !1,
    resizable: !0,
    alwaysOnTop: !0,
    backgroundColor: "#171210",
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: Q.join(DE, "preload.js")
    }
  }), process.platform !== "darwin" && (Le.removeMenu(), Le.setMenuBarVisibility(!1));
  const t = Gc();
  return zc(Le, "settings"), t && Le.webContents.openDevTools({ mode: "detach" }), Le.webContents.on("did-fail-load", (r, n, i) => {
    console.error("[设置窗口] 页面加载失败:", n, i);
  }), xr = !1, Nr = setTimeout(() => {
    Le && !Le.isDestroyed() && !xr && Le.show();
  }, 5e3), Le.on("maximize", () => {
    Le == null || Le.webContents.send("window:maximizedChanged", !0);
  }), Le.on("unmaximize", () => {
    Le == null || Le.webContents.send("window:maximizedChanged", !1);
  }), Le.on("closed", () => {
    Nr && (clearTimeout(Nr), Nr = null), xr = !1, Le = null;
  }), Le;
}
function NE(e) {
  return !Le || !e || Le !== e ? !1 : (xr = !0, Nr && (clearTimeout(Nr), Nr = null), !Le.isDestroyed() && !Le.isVisible() && Le.show(), Le.isDestroyed() || Le.focus(), !0);
}
function ys(e) {
  Le ? ((xr || Le.isVisible()) && (Le.show(), Le.focus()), e && (xr ? Le.webContents.send("settings:navigateTo", e) : di = e)) : xE(e);
}
function OE() {
  Le && (Le.close(), Le = null);
}
let lt = null;
function LE() {
  if (process.platform === "darwin") {
    const e = Q.join(process.cwd(), "resources", "icon.png");
    if (Te.existsSync(e)) return e;
    const t = Q.join(process.resourcesPath, "icon.png");
    if (Te.existsSync(t)) return t;
  }
  return Is();
}
function Kp(e) {
  const t = gi();
  if (!t.getSnapshot().runtime.modelReady) {
    ys("model/library");
    return;
  }
  t.requestReveal(e);
}
function Xp() {
  if (lt) return lt;
  const e = LE();
  let t;
  try {
    t = ss.createFromPath(e), t.isEmpty() && (console.warn(`[系统托盘] 图标加载失败，路径无效: ${e}`), t = ss.createFromPath(process.execPath));
  } catch {
    t = ss.createEmpty();
  }
  !t.isEmpty() && process.platform === "win32" && (t = t.resize({ width: 16, height: 16 })), !t.isEmpty() && process.platform === "darwin" && (t = t.resize({ width: 22, height: 22 }));
  try {
    lt = new Ey(t);
  } catch (r) {
    return console.warn("[系统托盘] 创建失败，已降级为无托盘模式:", r), lt = null, null;
  }
  return lt.setToolTip("AstrBot Live2D"), FE(), lt.on("click", () => {
    Kp("tray");
  }), lt;
}
function FE() {
  if (!lt) return;
  const e = _y.buildFromTemplate([
    {
      label: J("tray.showMain"),
      click: () => Kp("manual")
    },
    {
      label: J("tray.settings"),
      click: () => ys()
    },
    {
      label: J("tray.history"),
      click: () => ys("history/messages")
    },
    { type: "separator" },
    {
      label: J("tray.quit"),
      click: () => {
        Pe.quit();
      }
    }
  ]);
  lt.setContextMenu(e);
}
function kE(e) {
  lt && !lt.isDestroyed() && lt.setToolTip(`AstrBot Live2D - ${e}`);
}
function UE() {
  lt && (lt.destroy(), lt = null);
}
let ht = null, $t = !1;
const Bt = at("ipc.shortcut");
globalThis.__l2dMouseClickEnabled = !1;
le.handle("desktopAutomation:setMouseClickEnabled", async (e, t) => (globalThis.__l2dMouseClickEnabled = !!t, { success: !0, enabled: globalThis.__l2dMouseClickEnabled }));
le.handle("desktopAutomation:getMouseClickEnabled", async () => ({ success: !0, enabled: !!globalThis.__l2dMouseClickEnabled }));
le.handle("desktopAutomation:mouseClick", async (e, t) => await L2D_MOUSE_CLICK_EXEC(t || {}));
le.handle("shortcut:register", async (e, t) => {
  const r = Bt.timer("register", { accelerator: t, previousShortcut: ht });
  try {
    return ht && (ci.unregister(ht), console.log("[快捷键] 取消注册:", ht), Bt.info("unregister_previous", { accelerator: ht })), ci.register(t, () => {
      ME();
    }) ? (ht = t, console.log("[快捷键] 注册成功:", t), r.done({ success: !0 }), { success: !0 }) : (console.error("[快捷键] 注册失败:", t), r.done({ success: !1, reason: "occupied_or_invalid" }), { success: !1, error: J("shortcut.occupiedOrInvalid") });
  } catch (n) {
    return console.error("[快捷键] 注册失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("shortcut:unregister", async () => {
  const e = Bt.timer("unregister", { currentShortcut: ht });
  try {
    return ht && (ci.unregister(ht), console.log("[快捷键] 取消注册:", ht), Bt.info("unregister_current", { accelerator: ht }), ht = null), $t = !1, e.done({ success: !0 }), { success: !0 };
  } catch (t) {
    return console.error("[快捷键] 取消注册失败:", t), e.fail(t), { success: !1, error: t.message };
  }
});
le.handle("shortcut:isRegistered", async (e, t) => {
  const r = ci.isRegistered(t);
  return Bt.debug("is_registered", { accelerator: t, registered: r }), r;
});
le.handle("shortcut:setRecordingState", async (e, t) => {
  const r = $t;
  return $t = !!t, Bt.info("set_recording_state", { previous: r, next: $t }), { success: !0, isRecording: $t };
});
function ME() {
  const e = mr();
  if (!e || e.isDestroyed()) {
    Bt.warn("pressed.ignored", { reason: "main_window_unavailable" });
    return;
  }
  $t ? ($t = !1, console.log("[快捷键] 停止录音"), Bt.info("pressed.stop_recording", { windowId: e.id }), e.webContents.send("shortcut:recording-stop")) : ($t = !0, console.log("[快捷键] 开始录音"), Bt.info("pressed.start_recording", { windowId: e.id }), e.webContents.send("shortcut:recording-start"));
}
function $E() {
  Bt.info("cleanup", { currentShortcut: ht, isRecording: $t }), ci.unregisterAll(), ht = null, $t = !1, console.log("[快捷键] 已清理所有快捷键");
}
const Jp = "cubism";
let Bi = null;
function BE() {
  return Pe.isPackaged ? Q.join(Pe.getAppPath(), "package.json") : Q.join(process.cwd(), "package.json");
}
function nl() {
  var r, n, i, o;
  if (Bi)
    return Bi;
  const e = BE(), t = JSON.parse(Te.readFileSync(e, "utf8"));
  if (!((n = (r = t.cubism) == null ? void 0 : r.core) != null && n.filename) || !((o = (i = t.cubism) == null ? void 0 : i.core) != null && o.downloadUrl))
    throw new Error(J("error.cubismConfigMissing", { path: e }));
  return Bi = t.cubism, Bi;
}
function Cc() {
  return nl().core.filename;
}
function Qp() {
  return nl().core.downloadUrl;
}
Ts.registerSchemesAsPrivileged([
  {
    scheme: Jp,
    privileges: {
      standard: !0,
      secure: !0,
      supportFetchAPI: !0,
      corsEnabled: !0,
      stream: !0
    }
  }
]);
let $u = !1;
function qE() {
  return Pe.isPackaged ? Q.join(Pe.getAppPath(), "dist", "lib", Cc()) : null;
}
function WE() {
  const e = [il()], t = qE();
  return t && e.push(t), Array.from(new Set(e));
}
function Zp() {
  for (const e of WE())
    if (Te.existsSync(e))
      return e;
  return null;
}
function HE(e) {
  const t = Q.dirname(e);
  if (Te.existsSync(t)) {
    if (!Te.statSync(t).isDirectory())
      throw new Error(J("error.targetNotDirectory", { dir: t }));
    return;
  }
  Te.mkdirSync(t, { recursive: !0 });
}
function il() {
  return Pe.isPackaged ? Q.join(pi(), "lib", Cc()) : Q.join(process.cwd(), "public", "lib", Cc());
}
function em() {
  $u || ($u = !0, Ts.handle(Jp, async () => {
    const e = Zp();
    if (!e)
      return new Response("Cubism Core not found", { status: 404 });
    try {
      return await xc.fetch(Oc(e).toString());
    } catch (t) {
      const r = t instanceof Error ? t.message : String(t);
      return new Response(r, { status: 500 });
    }
  }));
}
function tm() {
  return Zp() !== null;
}
const jE = 5;
function rm(e, t, r = jE) {
  return new Promise((n, i) => {
    const o = e.startsWith("https") ? Fc : hi;
    try {
      HE(t);
    } catch (a) {
      i(a);
      return;
    }
    const s = Te.createWriteStream(t);
    o.get(e, (a) => {
      if (a.statusCode === 301 || a.statusCode === 302) {
        if (s.close(), Te.existsSync(t) && Te.unlinkSync(t), r <= 0)
          return i(new Error(J("error.redirectLimitExceeded")));
        const c = new URL(a.headers.location || "", e).toString();
        return rm(c, t, r - 1).then(n).catch(i);
      }
      if (a.statusCode !== 200)
        return s.close(), Te.existsSync(t) && Te.unlinkSync(t), i(new Error(J("error.downloadFailed", { status: a.statusCode ?? 0 })));
      a.pipe(s), s.on("finish", () => {
        s.close(), n();
      }), s.on("error", (c) => {
        s.close(), Te.existsSync(t) && Te.unlinkSync(t), i(c);
      });
    }).on("error", (a) => {
      Te.existsSync(t) && Te.unlinkSync(t), i(a);
    });
  });
}
async function nm() {
  const e = il();
  await rm(Qp(), e);
}
async function im() {
  return (await Ot.showMessageBox({
    type: "info",
    title: J("cubism.download.title"),
    message: J("cubism.download.message"),
    detail: J("cubism.download.detail", { baseline: nl().sdkBaseline, url: Qp() }),
    buttons: [J("dialog.confirm"), J("dialog.cancel")],
    defaultId: 0,
    cancelId: 1
  })).response === 0;
}
const Eo = 3;
async function sm() {
  let e = null;
  for (let t = 1; t <= Eo; t++)
    try {
      return await nm(), await Ot.showMessageBox({
        type: "info",
        title: J("cubism.download.successTitle"),
        message: J("cubism.download.successMessage"),
        detail: J("cubism.download.successDetail"),
        buttons: [J("dialog.confirm")]
      }), !0;
    } catch (r) {
      if (e = r, t < Eo && (await Ot.showMessageBox({
        type: "error",
        title: J("cubism.download.failedTitle"),
        message: J("cubism.download.failedMessage"),
        detail: J("cubism.download.retryDetail", {
          error: r instanceof Error ? r.message : String(r),
          attempt: t,
          max: Eo
        }),
        buttons: [J("dialog.retry"), J("dialog.cancel")],
        defaultId: 0,
        cancelId: 1
      })).response !== 0)
        return !1;
    }
  return await Ot.showMessageBox({
    type: "error",
    title: J("cubism.download.failedTitle"),
    message: J("cubism.download.failedMessage"),
    detail: J("cubism.download.failedDetail", { error: e instanceof Error ? e.message : String(e) }),
    buttons: [J("dialog.confirm")]
  }), !1;
}
const GE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  checkCubismCoreExists: tm,
  downloadCubismCore: nm,
  downloadWithProgress: sm,
  getCubismCorePath: il,
  registerCubismCoreProtocol: em,
  showDownloadDialog: im
}, Symbol.toStringTag, { value: "Module" })), ln = "history-resource", zE = /* @__PURE__ */ new Set(["image", "audio", "video", "file", "tts"]), om = `${ln}:`, VE = /* @__PURE__ */ new Set(["http:", "https:"]), Bu = "/resources", YE = {
  image: "image.bin",
  audio: "audio.bin",
  tts: "audio.bin",
  video: "video.bin",
  file: "file.bin"
}, KE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/webm": ".webm",
  "audio/mp4": ".m4a",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "application/pdf": ".pdf",
  "application/json": ".json",
  "text/plain": ".txt"
};
function XE(e) {
  return e && typeof e == "object" ? { ...e } : { type: "text", text: e };
}
function vs(e) {
  const t = typeof e == "string" ? e.trim().toLowerCase() : "";
  return !t || !zE.has(t) ? null : t === "tts" ? "audio" : t;
}
function am(e, t) {
  return typeof e != "string" ? t : Q.basename(e.trim()).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_") || t;
}
function JE(e, t) {
  if (Q.extname(e))
    return e;
  const r = KE[t.toLowerCase()] || "";
  return `${e}${r}`;
}
function ws(e, t, r) {
  const n = YE[e] || "resource.bin", i = am(r, n);
  return JE(i, t);
}
function Es(e, t) {
  return typeof e == "string" && e.trim() ? e.split(";")[0].trim().toLowerCase() || "application/octet-stream" : t === "image" ? "image/png" : t === "audio" ? "audio/webm" : t === "video" ? "video/mp4" : "application/octet-stream";
}
function QE(e) {
  const t = e.trim().replace(/\\+/g, "/").split("/").map((r) => r.trim()).filter(Boolean);
  if (t.length === 0)
    throw new Error(J("error.resourceIdEmpty"));
  if (t.some((r) => r === "." || r === ".."))
    throw new Error(J("error.resourceIdIllegalPath"));
  return t.map((r) => encodeURIComponent(r)).join("/");
}
function ZE(e) {
  return (e || "").trim().replace(/\/+$/, "");
}
function e_(e) {
  const r = (e || Bu).trim().replace(/^\/+|\/+$/g, "");
  return r ? `/${r}` : Bu;
}
function t_(e, t) {
  const r = (t || "").trim();
  if (!r)
    return e;
  const n = new URL(e);
  return n.searchParams.set("token", r), n.toString();
}
function r_(e, t) {
  const r = ZE(t == null ? void 0 : t.resourceBaseUrl);
  if (!r)
    return null;
  const n = QE(e), i = `${r}${e_(t == null ? void 0 : t.resourcePath)}/${n}`;
  return t_(i, t == null ? void 0 : t.resourceToken);
}
function n_(e) {
  return typeof e == "string" && e.trim().startsWith("data:");
}
function i_(e) {
  return typeof e == "string" && e.trim().startsWith(om);
}
function s_(e) {
  if (typeof e != "string")
    return !1;
  try {
    const t = new URL(e.trim());
    return VE.has(t.protocol);
  } catch {
    return !1;
  }
}
function o_(e) {
  if (!e)
    return null;
  const t = e.match(/filename\*=UTF-8''([^;]+)/i);
  if (t != null && t[1])
    try {
      return decodeURIComponent(t[1]);
    } catch {
      return t[1];
    }
  const r = e.match(/filename="?([^";]+)"?/i);
  return (r == null ? void 0 : r[1]) || null;
}
function a_(e) {
  try {
    const t = new URL(e), r = Q.basename(t.pathname);
    return r && r !== "/" ? r : null;
  } catch {
    return null;
  }
}
function cm(e) {
  return np("sha256").update(e).digest("hex");
}
function qu(e, t, r) {
  const n = { ...e };
  return n.url = h_(t, r), n.name = ws(vs(e.type) || "file", Es(e.mime, "file"), r), delete n.inline, delete n.rid, delete n.bytes, delete n.mime, n;
}
function c_(e, t) {
  const r = typeof e.url == "string" ? e.url.trim() : "";
  if (s_(r))
    return { sourceUrl: r, sourceKind: "url" };
  const n = typeof e.rid == "string" ? e.rid.trim() : "";
  return n ? {
    sourceUrl: r_(n, t),
    sourceKind: "rid"
  } : { sourceUrl: null, sourceKind: null };
}
async function l_(e) {
  var n;
  const t = await xc.fetch(e);
  if (!t.ok)
    throw new Error(J("error.resourceRequestFailed", { status: t.status }));
  return {
    buffer: Buffer.from(await t.arrayBuffer()),
    mime: ((n = t.headers.get("content-type")) == null ? void 0 : n.split(";")[0].trim().toLowerCase()) || "application/octet-stream",
    fileName: o_(t.headers.get("content-disposition")) || a_(e)
  };
}
function u_(e) {
  const t = jp({
    bytes: e.bytes,
    mime: typeof e.mime == "string" ? e.mime : void 0
  });
  if (t) {
    const s = vs(e.type) || "file", a = Es(t.mime, s);
    return {
      buffer: t.buffer,
      mime: a,
      fileName: ws(s, a, e.name),
      sourceKind: "bytes"
    };
  }
  const r = typeof e.inline == "string" ? e.inline : n_(e.url) ? String(e.url) : "", n = tl(r);
  if (!n)
    return null;
  const i = vs(e.type) || "file", o = Es(n.mime, i);
  return {
    buffer: n.buffer,
    mime: o,
    fileName: ws(i, o, e.name),
    sourceKind: "inline"
  };
}
function lm(e) {
  return ut().prepare(`
    SELECT id, mime, file_name, size_bytes, data
    FROM message_resources
    WHERE id = ?
  `).get(e);
}
function Wu(e, t) {
  const r = ut(), n = /* @__PURE__ */ new Map(), i = r.prepare(`
    INSERT INTO message_resources (
      message_id, content_index, media_type, mime, file_name,
      size_bytes, sha256, source_kind, source_url, source_rid, data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return r.transaction(() => {
    r.prepare("DELETE FROM message_resources WHERE message_id = ?").run(e);
    for (const s of t) {
      const a = i.run(
        e,
        s.contentIndex,
        s.mediaType,
        s.mime,
        s.fileName,
        s.sizeBytes,
        s.sha256,
        s.sourceKind,
        s.sourceUrl,
        s.sourceRid,
        s.data
      );
      n.set(s.contentIndex, Number(a.lastInsertRowid));
    }
  })(), n;
}
function d_(e, t, r, n, i, o) {
  const s = Es(o.mime || e.mime, r), a = ws(r, s, e.name || o.fileName);
  return {
    contentIndex: t,
    mediaType: r,
    mime: s,
    fileName: a,
    sizeBytes: o.buffer.length,
    sha256: cm(o.buffer),
    sourceKind: n,
    sourceUrl: n === "url" ? i : null,
    sourceRid: n === "rid" && typeof e.rid == "string" ? e.rid.trim() : null,
    data: o.buffer
  };
}
function f_(e, t, r) {
  return {
    contentIndex: e,
    mediaType: t,
    mime: r.mime,
    fileName: r.fileName,
    sizeBytes: r.buffer.length,
    sha256: cm(r.buffer),
    sourceKind: r.sourceKind,
    sourceUrl: null,
    sourceRid: null,
    data: r.buffer
  };
}
function h_(e, t) {
  const r = encodeURIComponent(am(t, "resource.bin"));
  return `${ln}://resource/${e}/${r}`;
}
function um(e) {
  try {
    const t = new URL(e);
    if (t.protocol !== om || t.hostname !== "resource")
      return null;
    const [r] = t.pathname.split("/").filter(Boolean), n = Number(r);
    return !Number.isInteger(n) || n <= 0 ? null : { resourceId: n };
  } catch {
    return null;
  }
}
function p_(e) {
  const t = um(e);
  return t ? lm(t.resourceId) : null;
}
function m_(e) {
  return lm(e);
}
async function dm(e, t, r = {}) {
  const i = (Array.isArray(t) ? t : [t]).map((l) => XE(l)), o = [];
  let s = !1, a = !1, c = !1;
  for (let l = 0; l < i.length; l += 1) {
    const f = i[l], d = vs(f.type);
    if (!d)
      continue;
    if (i_(f.url)) {
      a = !0;
      continue;
    }
    const p = u_(f);
    if (p) {
      o.push(f_(l, d, p)), s = !0;
      continue;
    }
    const { sourceUrl: g, sourceKind: y } = c_(f, r.resourceContext);
    if (!g || !y) {
      if (r.strict && (typeof f.rid == "string" || typeof f.url == "string"))
        throw new Error(J("error.resourceNotResolvable", { name: String(f.name || f.type || l) }));
      c = !0;
      continue;
    }
    try {
      const m = await l_(g);
      o.push(d_(f, l, d, y, g, m)), s = !0;
    } catch (m) {
      if (r.strict)
        throw m;
      c = !0;
    }
  }
  if (c)
    return { content: i, changed: !1 };
  if (a && o.length > 0) {
    if (r.strict)
      throw new Error(J("error.resourceMixedWrite"));
    return { content: i, changed: !1 };
  }
  if (r.forceReplaceResources && !a) {
    const l = Wu(e, o);
    for (const f of o) {
      const d = l.get(f.contentIndex);
      d && (i[f.contentIndex] = qu(i[f.contentIndex], d, f.fileName));
    }
    return { content: i, changed: s || o.length === 0 };
  }
  if (!s)
    return { content: i, changed: !1 };
  const u = Wu(e, o);
  for (const l of o) {
    const f = u.get(l.contentIndex);
    f && (i[l.contentIndex] = qu(i[l.contentIndex], f, l.fileName));
  }
  return { content: i, changed: !0 };
}
Ts.registerSchemesAsPrivileged([
  {
    scheme: ln,
    privileges: {
      standard: !0,
      secure: !0,
      supportFetchAPI: !0,
      corsEnabled: !0,
      stream: !0
    }
  }
]);
let Hu = !1;
function ju(e) {
  return new Response(e, { status: 404 });
}
function g_(e) {
  return new Response("Requested Range Not Satisfiable", {
    status: 416,
    headers: {
      "Content-Range": `bytes */${e}`,
      "Accept-Ranges": "bytes"
    }
  });
}
function y_(e, t, r) {
  const n = new Headers();
  return n.set("Content-Type", e || "application/octet-stream"), n.set("Accept-Ranges", "bytes"), n.set("Content-Length", String(r)), t && n.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(t)}`), n;
}
function v_(e, t) {
  if (!e)
    return null;
  const r = e.match(/^bytes=(\d*)-(\d*)$/i);
  if (!r)
    return null;
  let n = r[1] ? Number(r[1]) : NaN, i = r[2] ? Number(r[2]) : NaN;
  if (Number.isNaN(n) && Number.isNaN(i))
    return null;
  if (Number.isNaN(n)) {
    const o = i;
    if (!Number.isInteger(o) || o <= 0)
      return null;
    n = Math.max(0, t - o), i = t - 1;
  } else Number.isNaN(i) && (i = t - 1);
  return !Number.isInteger(n) || !Number.isInteger(i) || n < 0 || i < n || n >= t ? null : {
    start: n,
    end: Math.min(i, t - 1)
  };
}
function w_() {
  Hu || (Hu = !0, Ts.handle(ln, async (e) => {
    const t = um(e.url);
    if (!t)
      return ju("Invalid history resource URL");
    const r = m_(t.resourceId);
    if (!r)
      return ju("History resource not found");
    const n = Buffer.from(r.data), i = n.length, o = y_(r.mime, r.file_name, i), s = v_(e.headers.get("range"), i);
    if (e.headers.get("range") && !s)
      return g_(i);
    if (!s)
      return new Response(n, {
        status: 200,
        headers: o
      });
    const a = n.subarray(s.start, s.end + 1);
    return o.set("Content-Range", `bytes ${s.start}-${s.end}/${i}`), o.set("Content-Length", String(a.length)), new Response(a, {
      status: 206,
      headers: o
    });
  }));
}
const Rc = ".app-data-migration-v1.json", E_ = [
  "history.db",
  "history.db-shm",
  "history.db-wal",
  "models",
  "logs",
  "lib",
  "window-watcher-config.json",
  "Local Storage",
  "Session Storage",
  "IndexedDB",
  "WebStorage",
  "Preferences",
  "Cookies",
  "Cookies-journal",
  ke.join("Network", "Cookies"),
  ke.join("Network", "Cookies-journal")
];
async function us(e) {
  try {
    return await Kt.access(e), !0;
  } catch {
    return !1;
  }
}
async function fm(e, t) {
  return await us(t) ? !1 : (await Kt.mkdir(ke.dirname(t), { recursive: !0 }), await Kt.copyFile(e, t), !0);
}
async function hm(e, t, r, n) {
  await Kt.mkdir(t, { recursive: !0 });
  const i = await Kt.readdir(e, { withFileTypes: !0 });
  for (const o of i) {
    const s = ke.join(e, o.name), a = ke.join(t, o.name);
    if (o.isDirectory()) {
      await hm(s, a, r, n);
      continue;
    }
    o.isFile() && await fm(s, a) && n.push(ke.relative(r, a));
  }
}
function __(e, t, r) {
  return {
    attempted: !1,
    sourceRoot: e,
    targetRoot: t,
    markerPath: r,
    copiedEntries: [],
    errors: []
  };
}
async function S_(e, t) {
  await Kt.mkdir(ke.dirname(e), { recursive: !0 }), await Kt.writeFile(e, JSON.stringify(t, null, 2), "utf8");
}
async function b_(e) {
  const t = ke.resolve(e.sourceRoot), r = ke.resolve(e.targetRoot), n = ke.join(r, e.markerFileName ?? Rc), i = __(t, r, n);
  if (t === r)
    return i.skippedReason = "same-path", i;
  if (!await us(t))
    return i.skippedReason = "source-missing", i;
  if (await us(n))
    return i.skippedReason = "marker-exists", i;
  const o = e.entries ?? E_;
  await Kt.mkdir(r, { recursive: !0 }), i.attempted = !0;
  for (const s of o) {
    const a = ke.join(t, s);
    if (!await us(a))
      continue;
    const c = ke.join(r, s);
    try {
      const u = await Kt.stat(a);
      if (u.isDirectory()) {
        await hm(a, c, r, i.copiedEntries);
        continue;
      }
      u.isFile() && await fm(a, c) && i.copiedEntries.push(s);
    } catch (u) {
      const l = u instanceof Error ? u.message : String(u);
      i.errors.push(`${s}: ${l}`);
    }
  }
  return i.errors.length === 0 && await S_(n, {
    version: 1,
    sourceRoot: t,
    targetRoot: r,
    migratedAt: (/* @__PURE__ */ new Date()).toISOString(),
    copiedEntries: i.copiedEntries
  }), i;
}
async function T_() {
  const e = $c(), t = ke.join(e.resolvedUserDataPath, Rc);
  return e.isPortable ? b_({
    sourceRoot: e.originalUserDataPath,
    targetRoot: e.resolvedUserDataPath,
    markerFileName: Rc
  }) : {
    attempted: !1,
    sourceRoot: e.originalUserDataPath,
    targetRoot: e.resolvedUserDataPath,
    markerPath: t,
    copiedEntries: [],
    errors: [],
    skippedReason: "not-portable"
  };
}
var Cr = {}, _o = {}, qi = {}, Gu;
function St() {
  return Gu || (Gu = 1, qi.fromCallback = function(e) {
    return Object.defineProperty(function(...t) {
      if (typeof t[t.length - 1] == "function") e.apply(this, t);
      else
        return new Promise((r, n) => {
          t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
        });
    }, "name", { value: e.name });
  }, qi.fromPromise = function(e) {
    return Object.defineProperty(function(...t) {
      const r = t[t.length - 1];
      if (typeof r != "function") return e.apply(this, t);
      t.pop(), e.apply(this, t).then((n) => r(null, n), r);
    }, "name", { value: e.name });
  }), qi;
}
var So, zu;
function C_() {
  if (zu) return So;
  zu = 1;
  var e = Ry, t = process.cwd, r = null, n = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return r || (r = t.call(process)), r;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var i = process.chdir;
    process.chdir = function(s) {
      r = null, i.call(process, s);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, i);
  }
  So = o;
  function o(s) {
    e.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && a(s), s.lutimes || c(s), s.chown = f(s.chown), s.fchown = f(s.fchown), s.lchown = f(s.lchown), s.chmod = u(s.chmod), s.fchmod = u(s.fchmod), s.lchmod = u(s.lchmod), s.chownSync = d(s.chownSync), s.fchownSync = d(s.fchownSync), s.lchownSync = d(s.lchownSync), s.chmodSync = l(s.chmodSync), s.fchmodSync = l(s.fchmodSync), s.lchmodSync = l(s.lchmodSync), s.stat = p(s.stat), s.fstat = p(s.fstat), s.lstat = p(s.lstat), s.statSync = g(s.statSync), s.fstatSync = g(s.fstatSync), s.lstatSync = g(s.lstatSync), s.chmod && !s.lchmod && (s.lchmod = function(m, S, C) {
      C && process.nextTick(C);
    }, s.lchmodSync = function() {
    }), s.chown && !s.lchown && (s.lchown = function(m, S, C, A) {
      A && process.nextTick(A);
    }, s.lchownSync = function() {
    }), n === "win32" && (s.rename = typeof s.rename != "function" ? s.rename : (function(m) {
      function S(C, A, x) {
        var w = Date.now(), E = 0;
        m(C, A, function b(v) {
          if (v && (v.code === "EACCES" || v.code === "EPERM" || v.code === "EBUSY") && Date.now() - w < 6e4) {
            setTimeout(function() {
              s.stat(A, function(P, T) {
                P && P.code === "ENOENT" ? m(C, A, b) : x(v);
              });
            }, E), E < 100 && (E += 10);
            return;
          }
          x && x(v);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(S, m), S;
    })(s.rename)), s.read = typeof s.read != "function" ? s.read : (function(m) {
      function S(C, A, x, w, E, b) {
        var v;
        if (b && typeof b == "function") {
          var P = 0;
          v = function(T, U, k) {
            if (T && T.code === "EAGAIN" && P < 10)
              return P++, m.call(s, C, A, x, w, E, v);
            b.apply(this, arguments);
          };
        }
        return m.call(s, C, A, x, w, E, v);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(S, m), S;
    })(s.read), s.readSync = typeof s.readSync != "function" ? s.readSync : /* @__PURE__ */ (function(m) {
      return function(S, C, A, x, w) {
        for (var E = 0; ; )
          try {
            return m.call(s, S, C, A, x, w);
          } catch (b) {
            if (b.code === "EAGAIN" && E < 10) {
              E++;
              continue;
            }
            throw b;
          }
      };
    })(s.readSync);
    function a(m) {
      m.lchmod = function(S, C, A) {
        m.open(
          S,
          e.O_WRONLY | e.O_SYMLINK,
          C,
          function(x, w) {
            if (x) {
              A && A(x);
              return;
            }
            m.fchmod(w, C, function(E) {
              m.close(w, function(b) {
                A && A(E || b);
              });
            });
          }
        );
      }, m.lchmodSync = function(S, C) {
        var A = m.openSync(S, e.O_WRONLY | e.O_SYMLINK, C), x = !0, w;
        try {
          w = m.fchmodSync(A, C), x = !1;
        } finally {
          if (x)
            try {
              m.closeSync(A);
            } catch {
            }
          else
            m.closeSync(A);
        }
        return w;
      };
    }
    function c(m) {
      e.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(S, C, A, x) {
        m.open(S, e.O_SYMLINK, function(w, E) {
          if (w) {
            x && x(w);
            return;
          }
          m.futimes(E, C, A, function(b) {
            m.close(E, function(v) {
              x && x(b || v);
            });
          });
        });
      }, m.lutimesSync = function(S, C, A) {
        var x = m.openSync(S, e.O_SYMLINK), w, E = !0;
        try {
          w = m.futimesSync(x, C, A), E = !1;
        } finally {
          if (E)
            try {
              m.closeSync(x);
            } catch {
            }
          else
            m.closeSync(x);
        }
        return w;
      }) : m.futimes && (m.lutimes = function(S, C, A, x) {
        x && process.nextTick(x);
      }, m.lutimesSync = function() {
      });
    }
    function u(m) {
      return m && function(S, C, A) {
        return m.call(s, S, C, function(x) {
          y(x) && (x = null), A && A.apply(this, arguments);
        });
      };
    }
    function l(m) {
      return m && function(S, C) {
        try {
          return m.call(s, S, C);
        } catch (A) {
          if (!y(A)) throw A;
        }
      };
    }
    function f(m) {
      return m && function(S, C, A, x) {
        return m.call(s, S, C, A, function(w) {
          y(w) && (w = null), x && x.apply(this, arguments);
        });
      };
    }
    function d(m) {
      return m && function(S, C, A) {
        try {
          return m.call(s, S, C, A);
        } catch (x) {
          if (!y(x)) throw x;
        }
      };
    }
    function p(m) {
      return m && function(S, C, A) {
        typeof C == "function" && (A = C, C = null);
        function x(w, E) {
          E && (E.uid < 0 && (E.uid += 4294967296), E.gid < 0 && (E.gid += 4294967296)), A && A.apply(this, arguments);
        }
        return C ? m.call(s, S, C, x) : m.call(s, S, x);
      };
    }
    function g(m) {
      return m && function(S, C) {
        var A = C ? m.call(s, S, C) : m.call(s, S);
        return A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), A;
      };
    }
    function y(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var S = !process.getuid || process.getuid() !== 0;
      return !!(S && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return So;
}
var bo, Vu;
function R_() {
  if (Vu) return bo;
  Vu = 1;
  var e = qt.Stream;
  bo = t;
  function t(r) {
    return {
      ReadStream: n,
      WriteStream: i
    };
    function n(o, s) {
      if (!(this instanceof n)) return new n(o, s);
      e.call(this);
      var a = this;
      this.path = o, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, s = s || {};
      for (var c = Object.keys(s), u = 0, l = c.length; u < l; u++) {
        var f = c[u];
        this[f] = s[f];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          a._read();
        });
        return;
      }
      r.open(this.path, this.flags, this.mode, function(d, p) {
        if (d) {
          a.emit("error", d), a.readable = !1;
          return;
        }
        a.fd = p, a.emit("open", p), a._read();
      });
    }
    function i(o, s) {
      if (!(this instanceof i)) return new i(o, s);
      e.call(this), this.path = o, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, s = s || {};
      for (var a = Object.keys(s), c = 0, u = a.length; c < u; c++) {
        var l = a[c];
        this[l] = s[l];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = r.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return bo;
}
var To, Yu;
function A_() {
  if (Yu) return To;
  Yu = 1, To = t;
  var e = Object.getPrototypeOf || function(r) {
    return r.__proto__;
  };
  function t(r) {
    if (r === null || typeof r != "object")
      return r;
    if (r instanceof Object)
      var n = { __proto__: e(r) };
    else
      var n = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(r).forEach(function(i) {
      Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(r, i));
    }), n;
  }
  return To;
}
var Wi, Ku;
function mt() {
  if (Ku) return Wi;
  Ku = 1;
  var e = Te, t = C_(), r = R_(), n = A_(), i = Uc, o, s;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (o = Symbol.for("graceful-fs.queue"), s = Symbol.for("graceful-fs.previous")) : (o = "___graceful-fs.queue", s = "___graceful-fs.previous");
  function a() {
  }
  function c(m, S) {
    Object.defineProperty(m, o, {
      get: function() {
        return S;
      }
    });
  }
  var u = a;
  if (i.debuglog ? u = i.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (u = function() {
    var m = i.format.apply(i, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !e[o]) {
    var l = Nt[o] || [];
    c(e, l), e.close = (function(m) {
      function S(C, A) {
        return m.call(e, C, function(x) {
          x || g(), typeof A == "function" && A.apply(this, arguments);
        });
      }
      return Object.defineProperty(S, s, {
        value: m
      }), S;
    })(e.close), e.closeSync = (function(m) {
      function S(C) {
        m.apply(e, arguments), g();
      }
      return Object.defineProperty(S, s, {
        value: m
      }), S;
    })(e.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      u(e[o]), sp.equal(e[o].length, 0);
    });
  }
  Nt[o] || c(Nt, e[o]), Wi = f(n(e)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !e.__patched && (Wi = f(e), e.__patched = !0);
  function f(m) {
    t(m), m.gracefulify = f, m.createReadStream = we, m.createWriteStream = ne;
    var S = m.readFile;
    m.readFile = C;
    function C(te, Se, De) {
      return typeof Se == "function" && (De = Se, Se = null), Ue(te, Se, De);
      function Ue(We, Be, Fe, R) {
        return S(We, Be, function(_) {
          _ && (_.code === "EMFILE" || _.code === "ENFILE") ? d([Ue, [We, Be, Fe], _, R || Date.now(), Date.now()]) : typeof Fe == "function" && Fe.apply(this, arguments);
        });
      }
    }
    var A = m.writeFile;
    m.writeFile = x;
    function x(te, Se, De, Ue) {
      return typeof De == "function" && (Ue = De, De = null), We(te, Se, De, Ue);
      function We(Be, Fe, R, _, q) {
        return A(Be, Fe, R, function(L) {
          L && (L.code === "EMFILE" || L.code === "ENFILE") ? d([We, [Be, Fe, R, _], L, q || Date.now(), Date.now()]) : typeof _ == "function" && _.apply(this, arguments);
        });
      }
    }
    var w = m.appendFile;
    w && (m.appendFile = E);
    function E(te, Se, De, Ue) {
      return typeof De == "function" && (Ue = De, De = null), We(te, Se, De, Ue);
      function We(Be, Fe, R, _, q) {
        return w(Be, Fe, R, function(L) {
          L && (L.code === "EMFILE" || L.code === "ENFILE") ? d([We, [Be, Fe, R, _], L, q || Date.now(), Date.now()]) : typeof _ == "function" && _.apply(this, arguments);
        });
      }
    }
    var b = m.copyFile;
    b && (m.copyFile = v);
    function v(te, Se, De, Ue) {
      return typeof De == "function" && (Ue = De, De = 0), We(te, Se, De, Ue);
      function We(Be, Fe, R, _, q) {
        return b(Be, Fe, R, function(L) {
          L && (L.code === "EMFILE" || L.code === "ENFILE") ? d([We, [Be, Fe, R, _], L, q || Date.now(), Date.now()]) : typeof _ == "function" && _.apply(this, arguments);
        });
      }
    }
    var P = m.readdir;
    m.readdir = U;
    var T = /^v[0-5]\./;
    function U(te, Se, De) {
      typeof Se == "function" && (De = Se, Se = null);
      var Ue = T.test(process.version) ? function(Fe, R, _, q) {
        return P(Fe, We(
          Fe,
          R,
          _,
          q
        ));
      } : function(Fe, R, _, q) {
        return P(Fe, R, We(
          Fe,
          R,
          _,
          q
        ));
      };
      return Ue(te, Se, De);
      function We(Be, Fe, R, _) {
        return function(q, L) {
          q && (q.code === "EMFILE" || q.code === "ENFILE") ? d([
            Ue,
            [Be, Fe, R],
            q,
            _ || Date.now(),
            Date.now()
          ]) : (L && L.sort && L.sort(), typeof R == "function" && R.call(this, q, L));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var k = r(m);
      O = k.ReadStream, Y = k.WriteStream;
    }
    var M = m.ReadStream;
    M && (O.prototype = Object.create(M.prototype), O.prototype.open = G);
    var N = m.WriteStream;
    N && (Y.prototype = Object.create(N.prototype), Y.prototype.open = ie), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return O;
      },
      set: function(te) {
        O = te;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return Y;
      },
      set: function(te) {
        Y = te;
      },
      enumerable: !0,
      configurable: !0
    });
    var F = O;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return F;
      },
      set: function(te) {
        F = te;
      },
      enumerable: !0,
      configurable: !0
    });
    var $ = Y;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return $;
      },
      set: function(te) {
        $ = te;
      },
      enumerable: !0,
      configurable: !0
    });
    function O(te, Se) {
      return this instanceof O ? (M.apply(this, arguments), this) : O.apply(Object.create(O.prototype), arguments);
    }
    function G() {
      var te = this;
      Re(te.path, te.flags, te.mode, function(Se, De) {
        Se ? (te.autoClose && te.destroy(), te.emit("error", Se)) : (te.fd = De, te.emit("open", De), te.read());
      });
    }
    function Y(te, Se) {
      return this instanceof Y ? (N.apply(this, arguments), this) : Y.apply(Object.create(Y.prototype), arguments);
    }
    function ie() {
      var te = this;
      Re(te.path, te.flags, te.mode, function(Se, De) {
        Se ? (te.destroy(), te.emit("error", Se)) : (te.fd = De, te.emit("open", De));
      });
    }
    function we(te, Se) {
      return new m.ReadStream(te, Se);
    }
    function ne(te, Se) {
      return new m.WriteStream(te, Se);
    }
    var Ie = m.open;
    m.open = Re;
    function Re(te, Se, De, Ue) {
      return typeof De == "function" && (Ue = De, De = null), We(te, Se, De, Ue);
      function We(Be, Fe, R, _, q) {
        return Ie(Be, Fe, R, function(L, Ne) {
          L && (L.code === "EMFILE" || L.code === "ENFILE") ? d([We, [Be, Fe, R, _], L, q || Date.now(), Date.now()]) : typeof _ == "function" && _.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function d(m) {
    u("ENQUEUE", m[0].name, m[1]), e[o].push(m), y();
  }
  var p;
  function g() {
    for (var m = Date.now(), S = 0; S < e[o].length; ++S)
      e[o][S].length > 2 && (e[o][S][3] = m, e[o][S][4] = m);
    y();
  }
  function y() {
    if (clearTimeout(p), p = void 0, e[o].length !== 0) {
      var m = e[o].shift(), S = m[0], C = m[1], A = m[2], x = m[3], w = m[4];
      if (x === void 0)
        u("RETRY", S.name, C), S.apply(null, C);
      else if (Date.now() - x >= 6e4) {
        u("TIMEOUT", S.name, C);
        var E = C.pop();
        typeof E == "function" && E.call(null, A);
      } else {
        var b = Date.now() - w, v = Math.max(w - x, 1), P = Math.min(v * 1.2, 100);
        b >= P ? (u("RETRY", S.name, C), S.apply(null, C.concat([x]))) : e[o].push(m);
      }
      p === void 0 && (p = setTimeout(y, 0));
    }
  }
  return Wi;
}
var Xu;
function un() {
  return Xu || (Xu = 1, (function(e) {
    const t = St().fromCallback, r = mt(), n = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((i) => typeof r[i] == "function");
    Object.assign(e, r), n.forEach((i) => {
      e[i] = t(r[i]);
    }), e.exists = function(i, o) {
      return typeof o == "function" ? r.exists(i, o) : new Promise((s) => r.exists(i, s));
    }, e.read = function(i, o, s, a, c, u) {
      return typeof u == "function" ? r.read(i, o, s, a, c, u) : new Promise((l, f) => {
        r.read(i, o, s, a, c, (d, p, g) => {
          if (d) return f(d);
          l({ bytesRead: p, buffer: g });
        });
      });
    }, e.write = function(i, o, ...s) {
      return typeof s[s.length - 1] == "function" ? r.write(i, o, ...s) : new Promise((a, c) => {
        r.write(i, o, ...s, (u, l, f) => {
          if (u) return c(u);
          a({ bytesWritten: l, buffer: f });
        });
      });
    }, typeof r.writev == "function" && (e.writev = function(i, o, ...s) {
      return typeof s[s.length - 1] == "function" ? r.writev(i, o, ...s) : new Promise((a, c) => {
        r.writev(i, o, ...s, (u, l, f) => {
          if (u) return c(u);
          a({ bytesWritten: l, buffers: f });
        });
      });
    }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(_o)), _o;
}
var Hi = {}, Co = {}, Ju;
function P_() {
  if (Ju) return Co;
  Ju = 1;
  const e = Q;
  return Co.checkPath = function(r) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(r.replace(e.parse(r).root, ""))) {
      const i = new Error(`Path contains invalid characters: ${r}`);
      throw i.code = "EINVAL", i;
    }
  }, Co;
}
var Qu;
function I_() {
  if (Qu) return Hi;
  Qu = 1;
  const e = /* @__PURE__ */ un(), { checkPath: t } = /* @__PURE__ */ P_(), r = (n) => {
    const i = { mode: 511 };
    return typeof n == "number" ? n : { ...i, ...n }.mode;
  };
  return Hi.makeDir = async (n, i) => (t(n), e.mkdir(n, {
    mode: r(i),
    recursive: !0
  })), Hi.makeDirSync = (n, i) => (t(n), e.mkdirSync(n, {
    mode: r(i),
    recursive: !0
  })), Hi;
}
var Ro, Zu;
function Wt() {
  if (Zu) return Ro;
  Zu = 1;
  const e = St().fromPromise, { makeDir: t, makeDirSync: r } = /* @__PURE__ */ I_(), n = e(t);
  return Ro = {
    mkdirs: n,
    mkdirsSync: r,
    // alias
    mkdirp: n,
    mkdirpSync: r,
    ensureDir: n,
    ensureDirSync: r
  }, Ro;
}
var Ao, ed;
function kr() {
  if (ed) return Ao;
  ed = 1;
  const e = St().fromPromise, t = /* @__PURE__ */ un();
  function r(n) {
    return t.access(n).then(() => !0).catch(() => !1);
  }
  return Ao = {
    pathExists: e(r),
    pathExistsSync: t.existsSync
  }, Ao;
}
var Po, td;
function pm() {
  if (td) return Po;
  td = 1;
  const e = mt();
  function t(n, i, o, s) {
    e.open(n, "r+", (a, c) => {
      if (a) return s(a);
      e.futimes(c, i, o, (u) => {
        e.close(c, (l) => {
          s && s(u || l);
        });
      });
    });
  }
  function r(n, i, o) {
    const s = e.openSync(n, "r+");
    return e.futimesSync(s, i, o), e.closeSync(s);
  }
  return Po = {
    utimesMillis: t,
    utimesMillisSync: r
  }, Po;
}
var Io, rd;
function dn() {
  if (rd) return Io;
  rd = 1;
  const e = /* @__PURE__ */ un(), t = Q, r = Uc;
  function n(d, p, g) {
    const y = g.dereference ? (m) => e.stat(m, { bigint: !0 }) : (m) => e.lstat(m, { bigint: !0 });
    return Promise.all([
      y(d),
      y(p).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, S]) => ({ srcStat: m, destStat: S }));
  }
  function i(d, p, g) {
    let y;
    const m = g.dereference ? (C) => e.statSync(C, { bigint: !0 }) : (C) => e.lstatSync(C, { bigint: !0 }), S = m(d);
    try {
      y = m(p);
    } catch (C) {
      if (C.code === "ENOENT") return { srcStat: S, destStat: null };
      throw C;
    }
    return { srcStat: S, destStat: y };
  }
  function o(d, p, g, y, m) {
    r.callbackify(n)(d, p, y, (S, C) => {
      if (S) return m(S);
      const { srcStat: A, destStat: x } = C;
      if (x) {
        if (u(A, x)) {
          const w = t.basename(d), E = t.basename(p);
          return g === "move" && w !== E && w.toLowerCase() === E.toLowerCase() ? m(null, { srcStat: A, destStat: x, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (A.isDirectory() && !x.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${p}' with directory '${d}'.`));
        if (!A.isDirectory() && x.isDirectory())
          return m(new Error(`Cannot overwrite directory '${p}' with non-directory '${d}'.`));
      }
      return A.isDirectory() && l(d, p) ? m(new Error(f(d, p, g))) : m(null, { srcStat: A, destStat: x });
    });
  }
  function s(d, p, g, y) {
    const { srcStat: m, destStat: S } = i(d, p, y);
    if (S) {
      if (u(m, S)) {
        const C = t.basename(d), A = t.basename(p);
        if (g === "move" && C !== A && C.toLowerCase() === A.toLowerCase())
          return { srcStat: m, destStat: S, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !S.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${p}' with directory '${d}'.`);
      if (!m.isDirectory() && S.isDirectory())
        throw new Error(`Cannot overwrite directory '${p}' with non-directory '${d}'.`);
    }
    if (m.isDirectory() && l(d, p))
      throw new Error(f(d, p, g));
    return { srcStat: m, destStat: S };
  }
  function a(d, p, g, y, m) {
    const S = t.resolve(t.dirname(d)), C = t.resolve(t.dirname(g));
    if (C === S || C === t.parse(C).root) return m();
    e.stat(C, { bigint: !0 }, (A, x) => A ? A.code === "ENOENT" ? m() : m(A) : u(p, x) ? m(new Error(f(d, g, y))) : a(d, p, C, y, m));
  }
  function c(d, p, g, y) {
    const m = t.resolve(t.dirname(d)), S = t.resolve(t.dirname(g));
    if (S === m || S === t.parse(S).root) return;
    let C;
    try {
      C = e.statSync(S, { bigint: !0 });
    } catch (A) {
      if (A.code === "ENOENT") return;
      throw A;
    }
    if (u(p, C))
      throw new Error(f(d, g, y));
    return c(d, p, S, y);
  }
  function u(d, p) {
    return p.ino && p.dev && p.ino === d.ino && p.dev === d.dev;
  }
  function l(d, p) {
    const g = t.resolve(d).split(t.sep).filter((m) => m), y = t.resolve(p).split(t.sep).filter((m) => m);
    return g.reduce((m, S, C) => m && y[C] === S, !0);
  }
  function f(d, p, g) {
    return `Cannot ${g} '${d}' to a subdirectory of itself, '${p}'.`;
  }
  return Io = {
    checkPaths: o,
    checkPathsSync: s,
    checkParentPaths: a,
    checkParentPathsSync: c,
    isSrcSubdir: l,
    areIdentical: u
  }, Io;
}
var Do, nd;
function D_() {
  if (nd) return Do;
  nd = 1;
  const e = mt(), t = Q, r = Wt().mkdirs, n = kr().pathExists, i = pm().utimesMillis, o = /* @__PURE__ */ dn();
  function s(U, k, M, N) {
    typeof M == "function" && !N ? (N = M, M = {}) : typeof M == "function" && (M = { filter: M }), N = N || function() {
    }, M = M || {}, M.clobber = "clobber" in M ? !!M.clobber : !0, M.overwrite = "overwrite" in M ? !!M.overwrite : M.clobber, M.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), o.checkPaths(U, k, "copy", M, (F, $) => {
      if (F) return N(F);
      const { srcStat: O, destStat: G } = $;
      o.checkParentPaths(U, O, k, "copy", (Y) => Y ? N(Y) : M.filter ? c(a, G, U, k, M, N) : a(G, U, k, M, N));
    });
  }
  function a(U, k, M, N, F) {
    const $ = t.dirname(M);
    n($, (O, G) => {
      if (O) return F(O);
      if (G) return l(U, k, M, N, F);
      r($, (Y) => Y ? F(Y) : l(U, k, M, N, F));
    });
  }
  function c(U, k, M, N, F, $) {
    Promise.resolve(F.filter(M, N)).then((O) => O ? U(k, M, N, F, $) : $(), (O) => $(O));
  }
  function u(U, k, M, N, F) {
    return N.filter ? c(l, U, k, M, N, F) : l(U, k, M, N, F);
  }
  function l(U, k, M, N, F) {
    (N.dereference ? e.stat : e.lstat)(k, (O, G) => O ? F(O) : G.isDirectory() ? x(G, U, k, M, N, F) : G.isFile() || G.isCharacterDevice() || G.isBlockDevice() ? f(G, U, k, M, N, F) : G.isSymbolicLink() ? P(U, k, M, N, F) : G.isSocket() ? F(new Error(`Cannot copy a socket file: ${k}`)) : G.isFIFO() ? F(new Error(`Cannot copy a FIFO pipe: ${k}`)) : F(new Error(`Unknown file: ${k}`)));
  }
  function f(U, k, M, N, F, $) {
    return k ? d(U, M, N, F, $) : p(U, M, N, F, $);
  }
  function d(U, k, M, N, F) {
    if (N.overwrite)
      e.unlink(M, ($) => $ ? F($) : p(U, k, M, N, F));
    else return N.errorOnExist ? F(new Error(`'${M}' already exists`)) : F();
  }
  function p(U, k, M, N, F) {
    e.copyFile(k, M, ($) => $ ? F($) : N.preserveTimestamps ? g(U.mode, k, M, F) : C(M, U.mode, F));
  }
  function g(U, k, M, N) {
    return y(U) ? m(M, U, (F) => F ? N(F) : S(U, k, M, N)) : S(U, k, M, N);
  }
  function y(U) {
    return (U & 128) === 0;
  }
  function m(U, k, M) {
    return C(U, k | 128, M);
  }
  function S(U, k, M, N) {
    A(k, M, (F) => F ? N(F) : C(M, U, N));
  }
  function C(U, k, M) {
    return e.chmod(U, k, M);
  }
  function A(U, k, M) {
    e.stat(U, (N, F) => N ? M(N) : i(k, F.atime, F.mtime, M));
  }
  function x(U, k, M, N, F, $) {
    return k ? E(M, N, F, $) : w(U.mode, M, N, F, $);
  }
  function w(U, k, M, N, F) {
    e.mkdir(M, ($) => {
      if ($) return F($);
      E(k, M, N, (O) => O ? F(O) : C(M, U, F));
    });
  }
  function E(U, k, M, N) {
    e.readdir(U, (F, $) => F ? N(F) : b($, U, k, M, N));
  }
  function b(U, k, M, N, F) {
    const $ = U.pop();
    return $ ? v(U, $, k, M, N, F) : F();
  }
  function v(U, k, M, N, F, $) {
    const O = t.join(M, k), G = t.join(N, k);
    o.checkPaths(O, G, "copy", F, (Y, ie) => {
      if (Y) return $(Y);
      const { destStat: we } = ie;
      u(we, O, G, F, (ne) => ne ? $(ne) : b(U, M, N, F, $));
    });
  }
  function P(U, k, M, N, F) {
    e.readlink(k, ($, O) => {
      if ($) return F($);
      if (N.dereference && (O = t.resolve(process.cwd(), O)), U)
        e.readlink(M, (G, Y) => G ? G.code === "EINVAL" || G.code === "UNKNOWN" ? e.symlink(O, M, F) : F(G) : (N.dereference && (Y = t.resolve(process.cwd(), Y)), o.isSrcSubdir(O, Y) ? F(new Error(`Cannot copy '${O}' to a subdirectory of itself, '${Y}'.`)) : U.isDirectory() && o.isSrcSubdir(Y, O) ? F(new Error(`Cannot overwrite '${Y}' with '${O}'.`)) : T(O, M, F)));
      else
        return e.symlink(O, M, F);
    });
  }
  function T(U, k, M) {
    e.unlink(k, (N) => N ? M(N) : e.symlink(U, k, M));
  }
  return Do = s, Do;
}
var xo, id;
function x_() {
  if (id) return xo;
  id = 1;
  const e = mt(), t = Q, r = Wt().mkdirsSync, n = pm().utimesMillisSync, i = /* @__PURE__ */ dn();
  function o(b, v, P) {
    typeof P == "function" && (P = { filter: P }), P = P || {}, P.clobber = "clobber" in P ? !!P.clobber : !0, P.overwrite = "overwrite" in P ? !!P.overwrite : P.clobber, P.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: T, destStat: U } = i.checkPathsSync(b, v, "copy", P);
    return i.checkParentPathsSync(b, T, v, "copy"), s(U, b, v, P);
  }
  function s(b, v, P, T) {
    if (T.filter && !T.filter(v, P)) return;
    const U = t.dirname(P);
    return e.existsSync(U) || r(U), c(b, v, P, T);
  }
  function a(b, v, P, T) {
    if (!(T.filter && !T.filter(v, P)))
      return c(b, v, P, T);
  }
  function c(b, v, P, T) {
    const k = (T.dereference ? e.statSync : e.lstatSync)(v);
    if (k.isDirectory()) return S(k, b, v, P, T);
    if (k.isFile() || k.isCharacterDevice() || k.isBlockDevice()) return u(k, b, v, P, T);
    if (k.isSymbolicLink()) return w(b, v, P, T);
    throw k.isSocket() ? new Error(`Cannot copy a socket file: ${v}`) : k.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${v}`) : new Error(`Unknown file: ${v}`);
  }
  function u(b, v, P, T, U) {
    return v ? l(b, P, T, U) : f(b, P, T, U);
  }
  function l(b, v, P, T) {
    if (T.overwrite)
      return e.unlinkSync(P), f(b, v, P, T);
    if (T.errorOnExist)
      throw new Error(`'${P}' already exists`);
  }
  function f(b, v, P, T) {
    return e.copyFileSync(v, P), T.preserveTimestamps && d(b.mode, v, P), y(P, b.mode);
  }
  function d(b, v, P) {
    return p(b) && g(P, b), m(v, P);
  }
  function p(b) {
    return (b & 128) === 0;
  }
  function g(b, v) {
    return y(b, v | 128);
  }
  function y(b, v) {
    return e.chmodSync(b, v);
  }
  function m(b, v) {
    const P = e.statSync(b);
    return n(v, P.atime, P.mtime);
  }
  function S(b, v, P, T, U) {
    return v ? A(P, T, U) : C(b.mode, P, T, U);
  }
  function C(b, v, P, T) {
    return e.mkdirSync(P), A(v, P, T), y(P, b);
  }
  function A(b, v, P) {
    e.readdirSync(b).forEach((T) => x(T, b, v, P));
  }
  function x(b, v, P, T) {
    const U = t.join(v, b), k = t.join(P, b), { destStat: M } = i.checkPathsSync(U, k, "copy", T);
    return a(M, U, k, T);
  }
  function w(b, v, P, T) {
    let U = e.readlinkSync(v);
    if (T.dereference && (U = t.resolve(process.cwd(), U)), b) {
      let k;
      try {
        k = e.readlinkSync(P);
      } catch (M) {
        if (M.code === "EINVAL" || M.code === "UNKNOWN") return e.symlinkSync(U, P);
        throw M;
      }
      if (T.dereference && (k = t.resolve(process.cwd(), k)), i.isSrcSubdir(U, k))
        throw new Error(`Cannot copy '${U}' to a subdirectory of itself, '${k}'.`);
      if (e.statSync(P).isDirectory() && i.isSrcSubdir(k, U))
        throw new Error(`Cannot overwrite '${k}' with '${U}'.`);
      return E(U, P);
    } else
      return e.symlinkSync(U, P);
  }
  function E(b, v) {
    return e.unlinkSync(v), e.symlinkSync(b, v);
  }
  return xo = o, xo;
}
var No, sd;
function sl() {
  if (sd) return No;
  sd = 1;
  const e = St().fromCallback;
  return No = {
    copy: e(/* @__PURE__ */ D_()),
    copySync: /* @__PURE__ */ x_()
  }, No;
}
var Oo, od;
function N_() {
  if (od) return Oo;
  od = 1;
  const e = mt(), t = Q, r = sp, n = process.platform === "win32";
  function i(g) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      g[m] = g[m] || e[m], m = m + "Sync", g[m] = g[m] || e[m];
    }), g.maxBusyTries = g.maxBusyTries || 3;
  }
  function o(g, y, m) {
    let S = 0;
    typeof y == "function" && (m = y, y = {}), r(g, "rimraf: missing path"), r.strictEqual(typeof g, "string", "rimraf: path should be a string"), r.strictEqual(typeof m, "function", "rimraf: callback function required"), r(y, "rimraf: invalid options argument provided"), r.strictEqual(typeof y, "object", "rimraf: options should be object"), i(y), s(g, y, function C(A) {
      if (A) {
        if ((A.code === "EBUSY" || A.code === "ENOTEMPTY" || A.code === "EPERM") && S < y.maxBusyTries) {
          S++;
          const x = S * 100;
          return setTimeout(() => s(g, y, C), x);
        }
        A.code === "ENOENT" && (A = null);
      }
      m(A);
    });
  }
  function s(g, y, m) {
    r(g), r(y), r(typeof m == "function"), y.lstat(g, (S, C) => {
      if (S && S.code === "ENOENT")
        return m(null);
      if (S && S.code === "EPERM" && n)
        return a(g, y, S, m);
      if (C && C.isDirectory())
        return u(g, y, S, m);
      y.unlink(g, (A) => {
        if (A) {
          if (A.code === "ENOENT")
            return m(null);
          if (A.code === "EPERM")
            return n ? a(g, y, A, m) : u(g, y, A, m);
          if (A.code === "EISDIR")
            return u(g, y, A, m);
        }
        return m(A);
      });
    });
  }
  function a(g, y, m, S) {
    r(g), r(y), r(typeof S == "function"), y.chmod(g, 438, (C) => {
      C ? S(C.code === "ENOENT" ? null : m) : y.stat(g, (A, x) => {
        A ? S(A.code === "ENOENT" ? null : m) : x.isDirectory() ? u(g, y, m, S) : y.unlink(g, S);
      });
    });
  }
  function c(g, y, m) {
    let S;
    r(g), r(y);
    try {
      y.chmodSync(g, 438);
    } catch (C) {
      if (C.code === "ENOENT")
        return;
      throw m;
    }
    try {
      S = y.statSync(g);
    } catch (C) {
      if (C.code === "ENOENT")
        return;
      throw m;
    }
    S.isDirectory() ? d(g, y, m) : y.unlinkSync(g);
  }
  function u(g, y, m, S) {
    r(g), r(y), r(typeof S == "function"), y.rmdir(g, (C) => {
      C && (C.code === "ENOTEMPTY" || C.code === "EEXIST" || C.code === "EPERM") ? l(g, y, S) : C && C.code === "ENOTDIR" ? S(m) : S(C);
    });
  }
  function l(g, y, m) {
    r(g), r(y), r(typeof m == "function"), y.readdir(g, (S, C) => {
      if (S) return m(S);
      let A = C.length, x;
      if (A === 0) return y.rmdir(g, m);
      C.forEach((w) => {
        o(t.join(g, w), y, (E) => {
          if (!x) {
            if (E) return m(x = E);
            --A === 0 && y.rmdir(g, m);
          }
        });
      });
    });
  }
  function f(g, y) {
    let m;
    y = y || {}, i(y), r(g, "rimraf: missing path"), r.strictEqual(typeof g, "string", "rimraf: path should be a string"), r(y, "rimraf: missing options"), r.strictEqual(typeof y, "object", "rimraf: options should be object");
    try {
      m = y.lstatSync(g);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      S.code === "EPERM" && n && c(g, y, S);
    }
    try {
      m && m.isDirectory() ? d(g, y, null) : y.unlinkSync(g);
    } catch (S) {
      if (S.code === "ENOENT")
        return;
      if (S.code === "EPERM")
        return n ? c(g, y, S) : d(g, y, S);
      if (S.code !== "EISDIR")
        throw S;
      d(g, y, S);
    }
  }
  function d(g, y, m) {
    r(g), r(y);
    try {
      y.rmdirSync(g);
    } catch (S) {
      if (S.code === "ENOTDIR")
        throw m;
      if (S.code === "ENOTEMPTY" || S.code === "EEXIST" || S.code === "EPERM")
        p(g, y);
      else if (S.code !== "ENOENT")
        throw S;
    }
  }
  function p(g, y) {
    if (r(g), r(y), y.readdirSync(g).forEach((m) => f(t.join(g, m), y)), n) {
      const m = Date.now();
      do
        try {
          return y.rmdirSync(g, y);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return y.rmdirSync(g, y);
  }
  return Oo = o, o.sync = f, Oo;
}
var Lo, ad;
function Ms() {
  if (ad) return Lo;
  ad = 1;
  const e = mt(), t = St().fromCallback, r = /* @__PURE__ */ N_();
  function n(o, s) {
    if (e.rm) return e.rm(o, { recursive: !0, force: !0 }, s);
    r(o, s);
  }
  function i(o) {
    if (e.rmSync) return e.rmSync(o, { recursive: !0, force: !0 });
    r.sync(o);
  }
  return Lo = {
    remove: t(n),
    removeSync: i
  }, Lo;
}
var Fo, cd;
function O_() {
  if (cd) return Fo;
  cd = 1;
  const e = St().fromPromise, t = /* @__PURE__ */ un(), r = Q, n = /* @__PURE__ */ Wt(), i = /* @__PURE__ */ Ms(), o = e(async function(c) {
    let u;
    try {
      u = await t.readdir(c);
    } catch {
      return n.mkdirs(c);
    }
    return Promise.all(u.map((l) => i.remove(r.join(c, l))));
  });
  function s(a) {
    let c;
    try {
      c = t.readdirSync(a);
    } catch {
      return n.mkdirsSync(a);
    }
    c.forEach((u) => {
      u = r.join(a, u), i.removeSync(u);
    });
  }
  return Fo = {
    emptyDirSync: s,
    emptydirSync: s,
    emptyDir: o,
    emptydir: o
  }, Fo;
}
var ko, ld;
function L_() {
  if (ld) return ko;
  ld = 1;
  const e = St().fromCallback, t = Q, r = mt(), n = /* @__PURE__ */ Wt();
  function i(s, a) {
    function c() {
      r.writeFile(s, "", (u) => {
        if (u) return a(u);
        a();
      });
    }
    r.stat(s, (u, l) => {
      if (!u && l.isFile()) return a();
      const f = t.dirname(s);
      r.stat(f, (d, p) => {
        if (d)
          return d.code === "ENOENT" ? n.mkdirs(f, (g) => {
            if (g) return a(g);
            c();
          }) : a(d);
        p.isDirectory() ? c() : r.readdir(f, (g) => {
          if (g) return a(g);
        });
      });
    });
  }
  function o(s) {
    let a;
    try {
      a = r.statSync(s);
    } catch {
    }
    if (a && a.isFile()) return;
    const c = t.dirname(s);
    try {
      r.statSync(c).isDirectory() || r.readdirSync(c);
    } catch (u) {
      if (u && u.code === "ENOENT") n.mkdirsSync(c);
      else throw u;
    }
    r.writeFileSync(s, "");
  }
  return ko = {
    createFile: e(i),
    createFileSync: o
  }, ko;
}
var Uo, ud;
function F_() {
  if (ud) return Uo;
  ud = 1;
  const e = St().fromCallback, t = Q, r = mt(), n = /* @__PURE__ */ Wt(), i = kr().pathExists, { areIdentical: o } = /* @__PURE__ */ dn();
  function s(c, u, l) {
    function f(d, p) {
      r.link(d, p, (g) => {
        if (g) return l(g);
        l(null);
      });
    }
    r.lstat(u, (d, p) => {
      r.lstat(c, (g, y) => {
        if (g)
          return g.message = g.message.replace("lstat", "ensureLink"), l(g);
        if (p && o(y, p)) return l(null);
        const m = t.dirname(u);
        i(m, (S, C) => {
          if (S) return l(S);
          if (C) return f(c, u);
          n.mkdirs(m, (A) => {
            if (A) return l(A);
            f(c, u);
          });
        });
      });
    });
  }
  function a(c, u) {
    let l;
    try {
      l = r.lstatSync(u);
    } catch {
    }
    try {
      const p = r.lstatSync(c);
      if (l && o(p, l)) return;
    } catch (p) {
      throw p.message = p.message.replace("lstat", "ensureLink"), p;
    }
    const f = t.dirname(u);
    return r.existsSync(f) || n.mkdirsSync(f), r.linkSync(c, u);
  }
  return Uo = {
    createLink: e(s),
    createLinkSync: a
  }, Uo;
}
var Mo, dd;
function k_() {
  if (dd) return Mo;
  dd = 1;
  const e = Q, t = mt(), r = kr().pathExists;
  function n(o, s, a) {
    if (e.isAbsolute(o))
      return t.lstat(o, (c) => c ? (c.message = c.message.replace("lstat", "ensureSymlink"), a(c)) : a(null, {
        toCwd: o,
        toDst: o
      }));
    {
      const c = e.dirname(s), u = e.join(c, o);
      return r(u, (l, f) => l ? a(l) : f ? a(null, {
        toCwd: u,
        toDst: o
      }) : t.lstat(o, (d) => d ? (d.message = d.message.replace("lstat", "ensureSymlink"), a(d)) : a(null, {
        toCwd: o,
        toDst: e.relative(c, o)
      })));
    }
  }
  function i(o, s) {
    let a;
    if (e.isAbsolute(o)) {
      if (a = t.existsSync(o), !a) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: o,
        toDst: o
      };
    } else {
      const c = e.dirname(s), u = e.join(c, o);
      if (a = t.existsSync(u), a)
        return {
          toCwd: u,
          toDst: o
        };
      if (a = t.existsSync(o), !a) throw new Error("relative srcpath does not exist");
      return {
        toCwd: o,
        toDst: e.relative(c, o)
      };
    }
  }
  return Mo = {
    symlinkPaths: n,
    symlinkPathsSync: i
  }, Mo;
}
var $o, fd;
function U_() {
  if (fd) return $o;
  fd = 1;
  const e = mt();
  function t(n, i, o) {
    if (o = typeof i == "function" ? i : o, i = typeof i == "function" ? !1 : i, i) return o(null, i);
    e.lstat(n, (s, a) => {
      if (s) return o(null, "file");
      i = a && a.isDirectory() ? "dir" : "file", o(null, i);
    });
  }
  function r(n, i) {
    let o;
    if (i) return i;
    try {
      o = e.lstatSync(n);
    } catch {
      return "file";
    }
    return o && o.isDirectory() ? "dir" : "file";
  }
  return $o = {
    symlinkType: t,
    symlinkTypeSync: r
  }, $o;
}
var Bo, hd;
function M_() {
  if (hd) return Bo;
  hd = 1;
  const e = St().fromCallback, t = Q, r = /* @__PURE__ */ un(), n = /* @__PURE__ */ Wt(), i = n.mkdirs, o = n.mkdirsSync, s = /* @__PURE__ */ k_(), a = s.symlinkPaths, c = s.symlinkPathsSync, u = /* @__PURE__ */ U_(), l = u.symlinkType, f = u.symlinkTypeSync, d = kr().pathExists, { areIdentical: p } = /* @__PURE__ */ dn();
  function g(S, C, A, x) {
    x = typeof A == "function" ? A : x, A = typeof A == "function" ? !1 : A, r.lstat(C, (w, E) => {
      !w && E.isSymbolicLink() ? Promise.all([
        r.stat(S),
        r.stat(C)
      ]).then(([b, v]) => {
        if (p(b, v)) return x(null);
        y(S, C, A, x);
      }) : y(S, C, A, x);
    });
  }
  function y(S, C, A, x) {
    a(S, C, (w, E) => {
      if (w) return x(w);
      S = E.toDst, l(E.toCwd, A, (b, v) => {
        if (b) return x(b);
        const P = t.dirname(C);
        d(P, (T, U) => {
          if (T) return x(T);
          if (U) return r.symlink(S, C, v, x);
          i(P, (k) => {
            if (k) return x(k);
            r.symlink(S, C, v, x);
          });
        });
      });
    });
  }
  function m(S, C, A) {
    let x;
    try {
      x = r.lstatSync(C);
    } catch {
    }
    if (x && x.isSymbolicLink()) {
      const v = r.statSync(S), P = r.statSync(C);
      if (p(v, P)) return;
    }
    const w = c(S, C);
    S = w.toDst, A = f(w.toCwd, A);
    const E = t.dirname(C);
    return r.existsSync(E) || o(E), r.symlinkSync(S, C, A);
  }
  return Bo = {
    createSymlink: e(g),
    createSymlinkSync: m
  }, Bo;
}
var qo, pd;
function $_() {
  if (pd) return qo;
  pd = 1;
  const { createFile: e, createFileSync: t } = /* @__PURE__ */ L_(), { createLink: r, createLinkSync: n } = /* @__PURE__ */ F_(), { createSymlink: i, createSymlinkSync: o } = /* @__PURE__ */ M_();
  return qo = {
    // file
    createFile: e,
    createFileSync: t,
    ensureFile: e,
    ensureFileSync: t,
    // link
    createLink: r,
    createLinkSync: n,
    ensureLink: r,
    ensureLinkSync: n,
    // symlink
    createSymlink: i,
    createSymlinkSync: o,
    ensureSymlink: i,
    ensureSymlinkSync: o
  }, qo;
}
var Wo, md;
function ol() {
  if (md) return Wo;
  md = 1;
  function e(r, { EOL: n = `
`, finalEOL: i = !0, replacer: o = null, spaces: s } = {}) {
    const a = i ? n : "";
    return JSON.stringify(r, o, s).replace(/\n/g, n) + a;
  }
  function t(r) {
    return Buffer.isBuffer(r) && (r = r.toString("utf8")), r.replace(/^\uFEFF/, "");
  }
  return Wo = { stringify: e, stripBom: t }, Wo;
}
var Ho, gd;
function B_() {
  if (gd) return Ho;
  gd = 1;
  let e;
  try {
    e = mt();
  } catch {
    e = Te;
  }
  const t = St(), { stringify: r, stripBom: n } = ol();
  async function i(l, f = {}) {
    typeof f == "string" && (f = { encoding: f });
    const d = f.fs || e, p = "throws" in f ? f.throws : !0;
    let g = await t.fromCallback(d.readFile)(l, f);
    g = n(g);
    let y;
    try {
      y = JSON.parse(g, f ? f.reviver : null);
    } catch (m) {
      if (p)
        throw m.message = `${l}: ${m.message}`, m;
      return null;
    }
    return y;
  }
  const o = t.fromPromise(i);
  function s(l, f = {}) {
    typeof f == "string" && (f = { encoding: f });
    const d = f.fs || e, p = "throws" in f ? f.throws : !0;
    try {
      let g = d.readFileSync(l, f);
      return g = n(g), JSON.parse(g, f.reviver);
    } catch (g) {
      if (p)
        throw g.message = `${l}: ${g.message}`, g;
      return null;
    }
  }
  async function a(l, f, d = {}) {
    const p = d.fs || e, g = r(f, d);
    await t.fromCallback(p.writeFile)(l, g, d);
  }
  const c = t.fromPromise(a);
  function u(l, f, d = {}) {
    const p = d.fs || e, g = r(f, d);
    return p.writeFileSync(l, g, d);
  }
  return Ho = {
    readFile: o,
    readFileSync: s,
    writeFile: c,
    writeFileSync: u
  }, Ho;
}
var jo, yd;
function q_() {
  if (yd) return jo;
  yd = 1;
  const e = B_();
  return jo = {
    // jsonfile exports
    readJson: e.readFile,
    readJsonSync: e.readFileSync,
    writeJson: e.writeFile,
    writeJsonSync: e.writeFileSync
  }, jo;
}
var Go, vd;
function al() {
  if (vd) return Go;
  vd = 1;
  const e = St().fromCallback, t = mt(), r = Q, n = /* @__PURE__ */ Wt(), i = kr().pathExists;
  function o(a, c, u, l) {
    typeof u == "function" && (l = u, u = "utf8");
    const f = r.dirname(a);
    i(f, (d, p) => {
      if (d) return l(d);
      if (p) return t.writeFile(a, c, u, l);
      n.mkdirs(f, (g) => {
        if (g) return l(g);
        t.writeFile(a, c, u, l);
      });
    });
  }
  function s(a, ...c) {
    const u = r.dirname(a);
    if (t.existsSync(u))
      return t.writeFileSync(a, ...c);
    n.mkdirsSync(u), t.writeFileSync(a, ...c);
  }
  return Go = {
    outputFile: e(o),
    outputFileSync: s
  }, Go;
}
var zo, wd;
function W_() {
  if (wd) return zo;
  wd = 1;
  const { stringify: e } = ol(), { outputFile: t } = /* @__PURE__ */ al();
  async function r(n, i, o = {}) {
    const s = e(i, o);
    await t(n, s, o);
  }
  return zo = r, zo;
}
var Vo, Ed;
function H_() {
  if (Ed) return Vo;
  Ed = 1;
  const { stringify: e } = ol(), { outputFileSync: t } = /* @__PURE__ */ al();
  function r(n, i, o) {
    const s = e(i, o);
    t(n, s, o);
  }
  return Vo = r, Vo;
}
var Yo, _d;
function j_() {
  if (_d) return Yo;
  _d = 1;
  const e = St().fromPromise, t = /* @__PURE__ */ q_();
  return t.outputJson = e(/* @__PURE__ */ W_()), t.outputJsonSync = /* @__PURE__ */ H_(), t.outputJSON = t.outputJson, t.outputJSONSync = t.outputJsonSync, t.writeJSON = t.writeJson, t.writeJSONSync = t.writeJsonSync, t.readJSON = t.readJson, t.readJSONSync = t.readJsonSync, Yo = t, Yo;
}
var Ko, Sd;
function G_() {
  if (Sd) return Ko;
  Sd = 1;
  const e = mt(), t = Q, r = sl().copy, n = Ms().remove, i = Wt().mkdirp, o = kr().pathExists, s = /* @__PURE__ */ dn();
  function a(d, p, g, y) {
    typeof g == "function" && (y = g, g = {}), g = g || {};
    const m = g.overwrite || g.clobber || !1;
    s.checkPaths(d, p, "move", g, (S, C) => {
      if (S) return y(S);
      const { srcStat: A, isChangingCase: x = !1 } = C;
      s.checkParentPaths(d, A, p, "move", (w) => {
        if (w) return y(w);
        if (c(p)) return u(d, p, m, x, y);
        i(t.dirname(p), (E) => E ? y(E) : u(d, p, m, x, y));
      });
    });
  }
  function c(d) {
    const p = t.dirname(d);
    return t.parse(p).root === p;
  }
  function u(d, p, g, y, m) {
    if (y) return l(d, p, g, m);
    if (g)
      return n(p, (S) => S ? m(S) : l(d, p, g, m));
    o(p, (S, C) => S ? m(S) : C ? m(new Error("dest already exists.")) : l(d, p, g, m));
  }
  function l(d, p, g, y) {
    e.rename(d, p, (m) => m ? m.code !== "EXDEV" ? y(m) : f(d, p, g, y) : y());
  }
  function f(d, p, g, y) {
    r(d, p, {
      overwrite: g,
      errorOnExist: !0
    }, (S) => S ? y(S) : n(d, y));
  }
  return Ko = a, Ko;
}
var Xo, bd;
function z_() {
  if (bd) return Xo;
  bd = 1;
  const e = mt(), t = Q, r = sl().copySync, n = Ms().removeSync, i = Wt().mkdirpSync, o = /* @__PURE__ */ dn();
  function s(f, d, p) {
    p = p || {};
    const g = p.overwrite || p.clobber || !1, { srcStat: y, isChangingCase: m = !1 } = o.checkPathsSync(f, d, "move", p);
    return o.checkParentPathsSync(f, y, d, "move"), a(d) || i(t.dirname(d)), c(f, d, g, m);
  }
  function a(f) {
    const d = t.dirname(f);
    return t.parse(d).root === d;
  }
  function c(f, d, p, g) {
    if (g) return u(f, d, p);
    if (p)
      return n(d), u(f, d, p);
    if (e.existsSync(d)) throw new Error("dest already exists.");
    return u(f, d, p);
  }
  function u(f, d, p) {
    try {
      e.renameSync(f, d);
    } catch (g) {
      if (g.code !== "EXDEV") throw g;
      return l(f, d, p);
    }
  }
  function l(f, d, p) {
    return r(f, d, {
      overwrite: p,
      errorOnExist: !0
    }), n(f);
  }
  return Xo = s, Xo;
}
var Jo, Td;
function V_() {
  if (Td) return Jo;
  Td = 1;
  const e = St().fromCallback;
  return Jo = {
    move: e(/* @__PURE__ */ G_()),
    moveSync: /* @__PURE__ */ z_()
  }, Jo;
}
var Qo, Cd;
function yr() {
  return Cd || (Cd = 1, Qo = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ un(),
    // Export extra methods:
    .../* @__PURE__ */ sl(),
    .../* @__PURE__ */ O_(),
    .../* @__PURE__ */ $_(),
    .../* @__PURE__ */ j_(),
    .../* @__PURE__ */ Wt(),
    .../* @__PURE__ */ V_(),
    .../* @__PURE__ */ al(),
    .../* @__PURE__ */ kr(),
    .../* @__PURE__ */ Ms()
  }), Qo;
}
var Nn = {}, Rr = {}, Zo = {}, Ar = {}, Rd;
function cl() {
  if (Rd) return Ar;
  Rd = 1, Object.defineProperty(Ar, "__esModule", { value: !0 }), Ar.CancellationError = Ar.CancellationToken = void 0;
  const e = Rs;
  let t = class extends e.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(i) {
      this.removeParentCancelHandler(), this._parent = i, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(i) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, i != null && (this.parent = i);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(i) {
      this.cancelled ? i() : this.once("cancel", i);
    }
    createPromise(i) {
      if (this.cancelled)
        return Promise.reject(new r());
      const o = () => {
        if (s != null)
          try {
            this.removeListener("cancel", s), s = null;
          } catch {
          }
      };
      let s = null;
      return new Promise((a, c) => {
        let u = null;
        if (s = () => {
          try {
            u != null && (u(), u = null);
          } finally {
            c(new r());
          }
        }, this.cancelled) {
          s();
          return;
        }
        this.onCancel(s), i(a, c, (l) => {
          u = l;
        });
      }).then((a) => (o(), a)).catch((a) => {
        throw o(), a;
      });
    }
    removeParentCancelHandler() {
      const i = this._parent;
      i != null && this.parentCancelHandler != null && (i.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  Ar.CancellationToken = t;
  class r extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return Ar.CancellationError = r, Ar;
}
var ji = {}, Ad;
function $s() {
  if (Ad) return ji;
  Ad = 1, Object.defineProperty(ji, "__esModule", { value: !0 }), ji.newError = e;
  function e(t, r) {
    const n = new Error(t);
    return n.code = r, n;
  }
  return ji;
}
var st = {}, Gi = { exports: {} }, zi = { exports: {} }, ea, Pd;
function Y_() {
  if (Pd) return ea;
  Pd = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  ea = function(l, f) {
    f = f || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return s(l);
    if (d === "number" && isFinite(l))
      return f.long ? c(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function s(l) {
    if (l = String(l), !(l.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (f) {
        var d = parseFloat(f[1]), p = (f[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * o;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function a(l) {
    var f = Math.abs(l);
    return f >= n ? Math.round(l / n) + "d" : f >= r ? Math.round(l / r) + "h" : f >= t ? Math.round(l / t) + "m" : f >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var f = Math.abs(l);
    return f >= n ? u(l, f, n, "day") : f >= r ? u(l, f, r, "hour") : f >= t ? u(l, f, t, "minute") : f >= e ? u(l, f, e, "second") : l + " ms";
  }
  function u(l, f, d, p) {
    var g = f >= d * 1.5;
    return Math.round(l / d) + " " + p + (g ? "s" : "");
  }
  return ea;
}
var ta, Id;
function mm() {
  if (Id) return ta;
  Id = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = a, n.enable = o, n.enabled = c, n.humanize = Y_(), n.destroy = l, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let d = 0;
      for (let p = 0; p < f.length; p++)
        d = (d << 5) - d + f.charCodeAt(p), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let d, p = null, g, y;
      function m(...S) {
        if (!m.enabled)
          return;
        const C = m, A = Number(/* @__PURE__ */ new Date()), x = A - (d || A);
        C.diff = x, C.prev = d, C.curr = A, d = A, S[0] = n.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
        let w = 0;
        S[0] = S[0].replace(/%([a-zA-Z%])/g, (b, v) => {
          if (b === "%%")
            return "%";
          w++;
          const P = n.formatters[v];
          if (typeof P == "function") {
            const T = S[w];
            b = P.call(C, T), S.splice(w, 1), w--;
          }
          return b;
        }), n.formatArgs.call(C, S), (C.log || n.log).apply(C, S);
      }
      return m.namespace = f, m.useColors = n.useColors(), m.color = n.selectColor(f), m.extend = i, m.destroy = n.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (g !== n.namespaces && (g = n.namespaces, y = n.enabled(f)), y),
        set: (S) => {
          p = S;
        }
      }), typeof n.init == "function" && n.init(m), m;
    }
    function i(f, d) {
      const p = n(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return p.log = this.log, p;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of d)
        p[0] === "-" ? n.skips.push(p.slice(1)) : n.names.push(p);
    }
    function s(f, d) {
      let p = 0, g = 0, y = -1, m = 0;
      for (; p < f.length; )
        if (g < d.length && (d[g] === f[p] || d[g] === "*"))
          d[g] === "*" ? (y = g, m = p, g++) : (p++, g++);
        else if (y !== -1)
          g = y + 1, m++, p = m;
        else
          return !1;
      for (; g < d.length && d[g] === "*"; )
        g++;
      return g === d.length;
    }
    function a() {
      const f = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), f;
    }
    function c(f) {
      for (const d of n.skips)
        if (s(f, d))
          return !1;
      for (const d of n.names)
        if (s(f, d))
          return !0;
      return !1;
    }
    function u(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return ta = e, ta;
}
var Dd;
function K_() {
  return Dd || (Dd = 1, (function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      c.splice(1, 0, u, "color: inherit");
      let l = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (f = l));
      }), c.splice(f, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = mm()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  })(zi, zi.exports)), zi.exports;
}
var Vi = { exports: {} }, ra, xd;
function X_() {
  return xd || (xd = 1, ra = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ra;
}
var na, Nd;
function J_() {
  if (Nd) return na;
  Nd = 1;
  const e = Ps, t = op, r = X_(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1);
  function o() {
    if ("FORCE_COLOR" in n)
      return n.FORCE_COLOR === "true" ? 1 : n.FORCE_COLOR === "false" ? 0 : n.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(n.FORCE_COLOR, 10), 3);
  }
  function s(u) {
    return u === 0 ? !1 : {
      level: u,
      hasBasic: !0,
      has256: u >= 2,
      has16m: u >= 3
    };
  }
  function a(u, { streamIsTTY: l, sniffFlags: f = !0 } = {}) {
    const d = o();
    d !== void 0 && (i = d);
    const p = f ? i : d;
    if (p === 0)
      return 0;
    if (f) {
      if (r("color=16m") || r("color=full") || r("color=truecolor"))
        return 3;
      if (r("color=256"))
        return 2;
    }
    if (u && !l && p === void 0)
      return 0;
    const g = p || 0;
    if (n.TERM === "dumb")
      return g;
    if (process.platform === "win32") {
      const y = e.release().split(".");
      return Number(y[0]) >= 10 && Number(y[2]) >= 10586 ? Number(y[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((y) => y in n) || n.CI_NAME === "codeship" ? 1 : g;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const y = Number.parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return y >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : g;
  }
  function c(u, l = {}) {
    const f = a(u, {
      streamIsTTY: u && u.isTTY,
      ...l
    });
    return s(f);
  }
  return na = {
    supportsColor: c,
    stdout: c({ isTTY: t.isatty(1) }),
    stderr: c({ isTTY: t.isatty(2) })
  }, na;
}
var Od;
function Q_() {
  return Od || (Od = 1, (function(e, t) {
    const r = op, n = Uc;
    t.init = l, t.log = a, t.formatArgs = o, t.save = c, t.load = u, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = J_();
      d && (d.stderr || d).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, p) => {
      const g = p.substring(6).toLowerCase().replace(/_([a-z])/g, (m, S) => S.toUpperCase());
      let y = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), d[g] = y, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(d) {
      const { namespace: p, useColors: g } = this;
      if (g) {
        const y = this.color, m = "\x1B[3" + (y < 8 ? y : "8;5;" + y), S = `  ${m};1m${p} \x1B[0m`;
        d[0] = S + d[0].split(`
`).join(`
` + S), d.push(m + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = s() + p + " " + d[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...d) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let g = 0; g < p.length; g++)
        d.inspectOpts[p[g]] = t.inspectOpts[p[g]];
    }
    e.exports = mm()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  })(Vi, Vi.exports)), Vi.exports;
}
var Ld;
function Z_() {
  return Ld || (Ld = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Gi.exports = K_() : Gi.exports = Q_()), Gi.exports;
}
var On = {}, Fd;
function gm() {
  if (Fd) return On;
  Fd = 1, Object.defineProperty(On, "__esModule", { value: !0 }), On.ProgressCallbackTransform = void 0;
  const e = qt;
  let t = class extends e.Transform {
    constructor(n, i, o) {
      super(), this.total = n, this.cancellationToken = i, this.onProgress = o, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(n, i, o) {
      if (this.cancellationToken.cancelled) {
        o(new Error("cancelled"), null);
        return;
      }
      this.transferred += n.length, this.delta += n.length;
      const s = Date.now();
      s >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = s + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((s - this.start) / 1e3))
      }), this.delta = 0), o(null, n);
    }
    _flush(n) {
      if (this.cancellationToken.cancelled) {
        n(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, n(null);
    }
  };
  return On.ProgressCallbackTransform = t, On;
}
var kd;
function e0() {
  if (kd) return st;
  kd = 1, Object.defineProperty(st, "__esModule", { value: !0 }), st.DigestTransform = st.HttpExecutor = st.HttpError = void 0, st.createHttpError = u, st.parseJson = d, st.configureRequestOptionsFromUrl = y, st.configureRequestUrl = m, st.safeGetHeader = A, st.configureRequestOptions = w, st.safeStringifyJson = E;
  const e = _t, t = Z_(), r = Te, n = qt, i = er, o = cl(), s = $s(), a = gm(), c = (0, t.default)("electron-builder");
  function u(b, v = null) {
    return new f(b.statusCode || -1, `${b.statusCode} ${b.statusMessage}` + (v == null ? "" : `
` + JSON.stringify(v, null, "  ")) + `
Headers: ` + E(b.headers), v);
  }
  const l = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class f extends Error {
    constructor(v, P = `HTTP error: ${l.get(v) || v}`, T = null) {
      super(P), this.statusCode = v, this.description = T, this.name = "HttpError", this.code = `HTTP_ERROR_${v}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  st.HttpError = f;
  function d(b) {
    return b.then((v) => v == null || v.length === 0 ? null : JSON.parse(v));
  }
  class p {
    constructor() {
      this.maxRedirects = 10;
    }
    request(v, P = new o.CancellationToken(), T) {
      w(v);
      const U = T == null ? void 0 : JSON.stringify(T), k = U ? Buffer.from(U) : void 0;
      if (k != null) {
        c(U);
        const { headers: M, ...N } = v;
        v = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": k.length,
            ...M
          },
          ...N
        };
      }
      return this.doApiRequest(v, P, (M) => M.end(k));
    }
    doApiRequest(v, P, T, U = 0) {
      return c.enabled && c(`Request: ${E(v)}`), P.createPromise((k, M, N) => {
        const F = this.createRequest(v, ($) => {
          try {
            this.handleResponse($, v, P, k, M, U, T);
          } catch (O) {
            M(O);
          }
        });
        this.addErrorAndTimeoutHandlers(F, M, v.timeout), this.addRedirectHandlers(F, v, M, U, ($) => {
          this.doApiRequest($, P, T, U).then(k).catch(M);
        }), T(F, M), N(() => F.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(v, P, T, U, k) {
    }
    addErrorAndTimeoutHandlers(v, P, T = 60 * 1e3) {
      this.addTimeOutHandler(v, P, T), v.on("error", P), v.on("aborted", () => {
        P(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(v, P, T, U, k, M, N) {
      var F;
      if (c.enabled && c(`Response: ${v.statusCode} ${v.statusMessage}, request options: ${E(P)}`), v.statusCode === 404) {
        k(u(v, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (v.statusCode === 204) {
        U();
        return;
      }
      const $ = (F = v.statusCode) !== null && F !== void 0 ? F : 0, O = $ >= 300 && $ < 400, G = A(v, "location");
      if (O && G != null) {
        if (M > this.maxRedirects) {
          k(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(p.prepareRedirectUrlOptions(G, P), T, N, M).then(U).catch(k);
        return;
      }
      v.setEncoding("utf8");
      let Y = "";
      v.on("error", k), v.on("data", (ie) => Y += ie), v.on("end", () => {
        try {
          if (v.statusCode != null && v.statusCode >= 400) {
            const ie = A(v, "content-type"), we = ie != null && (Array.isArray(ie) ? ie.find((ne) => ne.includes("json")) != null : ie.includes("json"));
            k(u(v, `method: ${P.method || "GET"} url: ${P.protocol || "https:"}//${P.hostname}${P.port ? `:${P.port}` : ""}${P.path}

          Data:
          ${we ? JSON.stringify(JSON.parse(Y)) : Y}
          `));
          } else
            U(Y.length === 0 ? null : Y);
        } catch (ie) {
          k(ie);
        }
      });
    }
    async downloadToBuffer(v, P) {
      return await P.cancellationToken.createPromise((T, U, k) => {
        const M = [], N = {
          headers: P.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        m(v, N), w(N), this.doDownload(N, {
          destination: null,
          options: P,
          onCancel: k,
          callback: (F) => {
            F == null ? T(Buffer.concat(M)) : U(F);
          },
          responseHandler: (F, $) => {
            let O = 0;
            F.on("data", (G) => {
              if (O += G.length, O > 524288e3) {
                $(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              M.push(G);
            }), F.on("end", () => {
              $(null);
            });
          }
        }, 0);
      });
    }
    doDownload(v, P, T) {
      const U = this.createRequest(v, (k) => {
        if (k.statusCode >= 400) {
          P.callback(new Error(`Cannot download "${v.protocol || "https:"}//${v.hostname}${v.path}", status ${k.statusCode}: ${k.statusMessage}`));
          return;
        }
        k.on("error", P.callback);
        const M = A(k, "location");
        if (M != null) {
          T < this.maxRedirects ? this.doDownload(p.prepareRedirectUrlOptions(M, v), P, T++) : P.callback(this.createMaxRedirectError());
          return;
        }
        P.responseHandler == null ? x(P, k) : P.responseHandler(k, P.callback);
      });
      this.addErrorAndTimeoutHandlers(U, P.callback, v.timeout), this.addRedirectHandlers(U, v, P.callback, T, (k) => {
        this.doDownload(k, P, T++);
      }), U.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(v, P, T) {
      v.on("socket", (U) => {
        U.setTimeout(T, () => {
          v.abort(), P(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(v, P) {
      const T = y(v, { ...P }), U = T.headers;
      if (U != null && U.authorization) {
        const k = p.reconstructOriginalUrl(P), M = g(v, P);
        p.isCrossOriginRedirect(k, M) && (c.enabled && c(`Given the cross-origin redirect (from ${k.host} to ${M.host}), the Authorization header will be stripped out.`), delete U.authorization);
      }
      return T;
    }
    static reconstructOriginalUrl(v) {
      const P = v.protocol || "https:";
      if (!v.hostname)
        throw new Error("Missing hostname in request options");
      const T = v.hostname, U = v.port ? `:${v.port}` : "", k = v.path || "/";
      return new i.URL(`${P}//${T}${U}${k}`);
    }
    static isCrossOriginRedirect(v, P) {
      if (v.hostname.toLowerCase() !== P.hostname.toLowerCase())
        return !0;
      if (v.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
      ["80", ""].includes(v.port) && P.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
      ["443", ""].includes(P.port))
        return !1;
      if (v.protocol !== P.protocol)
        return !0;
      const T = v.port, U = P.port;
      return T !== U;
    }
    static retryOnServerError(v, P = 3) {
      for (let T = 0; ; T++)
        try {
          return v();
        } catch (U) {
          if (T < P && (U instanceof f && U.isServerError() || U.code === "EPIPE"))
            continue;
          throw U;
        }
    }
  }
  st.HttpExecutor = p;
  function g(b, v) {
    try {
      return new i.URL(b);
    } catch {
      const P = v.hostname, T = v.protocol || "https:", U = v.port ? `:${v.port}` : "", k = `${T}//${P}${U}`;
      return new i.URL(b, k);
    }
  }
  function y(b, v) {
    const P = w(v), T = g(b, v);
    return m(T, P), P;
  }
  function m(b, v) {
    v.protocol = b.protocol, v.hostname = b.hostname, b.port ? v.port = b.port : v.port && delete v.port, v.path = b.pathname + b.search;
  }
  class S extends n.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(v, P = "sha512", T = "base64") {
      super(), this.expected = v, this.algorithm = P, this.encoding = T, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, e.createHash)(P);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(v, P, T) {
      this.digester.update(v), T(null, v);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(v) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (P) {
          v(P);
          return;
        }
      v(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, s.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, s.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  st.DigestTransform = S;
  function C(b, v, P) {
    return b != null && v != null && b !== v ? (P(new Error(`checksum mismatch: expected ${v} but got ${b} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function A(b, v) {
    const P = b.headers[v];
    return P == null ? null : Array.isArray(P) ? P.length === 0 ? null : P[P.length - 1] : P;
  }
  function x(b, v) {
    if (!C(A(v, "X-Checksum-Sha2"), b.options.sha2, b.callback))
      return;
    const P = [];
    if (b.options.onProgress != null) {
      const M = A(v, "content-length");
      M != null && P.push(new a.ProgressCallbackTransform(parseInt(M, 10), b.options.cancellationToken, b.options.onProgress));
    }
    const T = b.options.sha512;
    T != null ? P.push(new S(T, "sha512", T.length === 128 && !T.includes("+") && !T.includes("Z") && !T.includes("=") ? "hex" : "base64")) : b.options.sha2 != null && P.push(new S(b.options.sha2, "sha256", "hex"));
    const U = (0, r.createWriteStream)(b.destination);
    P.push(U);
    let k = v;
    for (const M of P)
      M.on("error", (N) => {
        U.close(), b.options.cancellationToken.cancelled || b.callback(N);
      }), k = k.pipe(M);
    U.on("finish", () => {
      U.close(b.callback);
    });
  }
  function w(b, v, P) {
    P != null && (b.method = P), b.headers = { ...b.headers };
    const T = b.headers;
    return v != null && (T.authorization = v.startsWith("Basic") || v.startsWith("Bearer") ? v : `token ${v}`), T["User-Agent"] == null && (T["User-Agent"] = "electron-builder"), (P == null || P === "GET" || T["Cache-Control"] == null) && (T["Cache-Control"] = "no-cache"), b.protocol == null && process.versions.electron != null && (b.protocol = "https:"), b;
  }
  function E(b, v) {
    return JSON.stringify(b, (P, T) => P.endsWith("Authorization") || P.endsWith("authorization") || P.endsWith("Password") || P.endsWith("PASSWORD") || P.endsWith("Token") || P.includes("password") || P.includes("token") || v != null && v.has(P) ? "<stripped sensitive data>" : T, 2);
  }
  return st;
}
var Ln = {}, Ud;
function t0() {
  if (Ud) return Ln;
  Ud = 1, Object.defineProperty(Ln, "__esModule", { value: !0 }), Ln.MemoLazy = void 0;
  let e = class {
    constructor(n, i) {
      this.selector = n, this.creator = i, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const n = this.selector();
      if (this._value !== void 0 && t(this.selected, n))
        return this._value;
      this.selected = n;
      const i = this.creator(n);
      return this.value = i, i;
    }
    set value(n) {
      this._value = n;
    }
  };
  Ln.MemoLazy = e;
  function t(r, n) {
    if (typeof r == "object" && r !== null && (typeof n == "object" && n !== null)) {
      const s = Object.keys(r), a = Object.keys(n);
      return s.length === a.length && s.every((c) => t(r[c], n[c]));
    }
    return r === n;
  }
  return Ln;
}
var jr = {}, Md;
function r0() {
  if (Md) return jr;
  Md = 1, Object.defineProperty(jr, "__esModule", { value: !0 }), jr.githubUrl = e, jr.githubTagPrefix = t, jr.getS3LikeProviderBaseUrl = r;
  function e(s, a = "github.com") {
    return `${s.protocol || "https"}://${s.host || a}`;
  }
  function t(s) {
    var a;
    return s.tagNamePrefix ? s.tagNamePrefix : !((a = s.vPrefixedTagName) !== null && a !== void 0) || a ? "v" : "";
  }
  function r(s) {
    const a = s.provider;
    if (a === "s3")
      return n(s);
    if (a === "spaces")
      return o(s);
    throw new Error(`Not supported provider: ${a}`);
  }
  function n(s) {
    let a;
    if (s.accelerate == !0)
      a = `https://${s.bucket}.s3-accelerate.amazonaws.com`;
    else if (s.endpoint != null)
      a = `${s.endpoint}/${s.bucket}`;
    else if (s.bucket.includes(".")) {
      if (s.region == null)
        throw new Error(`Bucket name "${s.bucket}" includes a dot, but S3 region is missing`);
      s.region === "us-east-1" ? a = `https://s3.amazonaws.com/${s.bucket}` : a = `https://s3-${s.region}.amazonaws.com/${s.bucket}`;
    } else s.region === "cn-north-1" ? a = `https://${s.bucket}.s3.${s.region}.amazonaws.com.cn` : a = `https://${s.bucket}.s3.amazonaws.com`;
    return i(a, s.path);
  }
  function i(s, a) {
    return a != null && a.length > 0 && (a.startsWith("/") || (s += "/"), s += a), s;
  }
  function o(s) {
    if (s.name == null)
      throw new Error("name is missing");
    if (s.region == null)
      throw new Error("region is missing");
    return i(`https://${s.name}.${s.region}.digitaloceanspaces.com`, s.path);
  }
  return jr;
}
var Yi = {}, $d;
function n0() {
  if ($d) return Yi;
  $d = 1, Object.defineProperty(Yi, "__esModule", { value: !0 }), Yi.retry = t;
  const e = cl();
  async function t(r, n) {
    var i;
    const { retries: o, interval: s, backoff: a = 0, attempt: c = 0, shouldRetry: u, cancellationToken: l = new e.CancellationToken() } = n;
    try {
      return await r();
    } catch (f) {
      if (await Promise.resolve((i = u == null ? void 0 : u(f)) !== null && i !== void 0 ? i : !0) && o > 0 && !l.cancelled)
        return await new Promise((d) => setTimeout(d, s + a * c)), await t(r, { ...n, retries: o - 1, attempt: c + 1 });
      throw f;
    }
  }
  return Yi;
}
var Ki = {}, Bd;
function i0() {
  if (Bd) return Ki;
  Bd = 1, Object.defineProperty(Ki, "__esModule", { value: !0 }), Ki.parseDn = e;
  function e(t) {
    let r = !1, n = null, i = "", o = 0;
    t = t.trim();
    const s = /* @__PURE__ */ new Map();
    for (let a = 0; a <= t.length; a++) {
      if (a === t.length) {
        n !== null && s.set(n, i);
        break;
      }
      const c = t[a];
      if (r) {
        if (c === '"') {
          r = !1;
          continue;
        }
      } else {
        if (c === '"') {
          r = !0;
          continue;
        }
        if (c === "\\") {
          a++;
          const u = parseInt(t.slice(a, a + 2), 16);
          Number.isNaN(u) ? i += t[a] : (a++, i += String.fromCharCode(u));
          continue;
        }
        if (n === null && c === "=") {
          n = i, i = "";
          continue;
        }
        if (c === "," || c === ";" || c === "+") {
          n !== null && s.set(n, i), n = null, i = "";
          continue;
        }
      }
      if (c === " " && !r) {
        if (i.length === 0)
          continue;
        if (a > o) {
          let u = a;
          for (; t[u] === " "; )
            u++;
          o = u;
        }
        if (o >= t.length || t[o] === "," || t[o] === ";" || n === null && t[o] === "=" || n !== null && t[o] === "+") {
          a = o - 1;
          continue;
        }
      }
      i += c;
    }
    return s;
  }
  return Ki;
}
var Pr = {}, qd;
function s0() {
  if (qd) return Pr;
  qd = 1, Object.defineProperty(Pr, "__esModule", { value: !0 }), Pr.nil = Pr.UUID = void 0;
  const e = _t, t = $s(), r = "options.name must be either a string or a Buffer", n = (0, e.randomBytes)(16);
  n[0] = n[0] | 1;
  const i = {}, o = [];
  for (let f = 0; f < 256; f++) {
    const d = (f + 256).toString(16).substr(1);
    i[d] = f, o[f] = d;
  }
  class s {
    constructor(d) {
      this.ascii = null, this.binary = null;
      const p = s.check(d);
      if (!p)
        throw new Error("not a UUID");
      this.version = p.version, p.format === "ascii" ? this.ascii = d : this.binary = d;
    }
    static v5(d, p) {
      return u(d, "sha1", 80, p);
    }
    toString() {
      return this.ascii == null && (this.ascii = l(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(d, p = 0) {
      if (typeof d == "string")
        return d = d.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(d) ? d === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (i[d[14] + d[15]] & 240) >> 4,
          variant: a((i[d[19] + d[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(d)) {
        if (d.length < p + 16)
          return !1;
        let g = 0;
        for (; g < 16 && d[p + g] === 0; g++)
          ;
        return g === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (d[p + 6] & 240) >> 4,
          variant: a((d[p + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, t.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(d) {
      const p = Buffer.allocUnsafe(16);
      let g = 0;
      for (let y = 0; y < 16; y++)
        p[y] = i[d[g++] + d[g++]], (y === 3 || y === 5 || y === 7 || y === 9) && (g += 1);
      return p;
    }
  }
  Pr.UUID = s, s.OID = s.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function a(f) {
    switch (f) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var c;
  (function(f) {
    f[f.ASCII = 0] = "ASCII", f[f.BINARY = 1] = "BINARY", f[f.OBJECT = 2] = "OBJECT";
  })(c || (c = {}));
  function u(f, d, p, g, y = c.ASCII) {
    const m = (0, e.createHash)(d);
    if (typeof f != "string" && !Buffer.isBuffer(f))
      throw (0, t.newError)(r, "ERR_INVALID_UUID_NAME");
    m.update(g), m.update(f);
    const C = m.digest();
    let A;
    switch (y) {
      case c.BINARY:
        C[6] = C[6] & 15 | p, C[8] = C[8] & 63 | 128, A = C;
        break;
      case c.OBJECT:
        C[6] = C[6] & 15 | p, C[8] = C[8] & 63 | 128, A = new s(C);
        break;
      default:
        A = o[C[0]] + o[C[1]] + o[C[2]] + o[C[3]] + "-" + o[C[4]] + o[C[5]] + "-" + o[C[6] & 15 | p] + o[C[7]] + "-" + o[C[8] & 63 | 128] + o[C[9]] + "-" + o[C[10]] + o[C[11]] + o[C[12]] + o[C[13]] + o[C[14]] + o[C[15]];
        break;
    }
    return A;
  }
  function l(f) {
    return o[f[0]] + o[f[1]] + o[f[2]] + o[f[3]] + "-" + o[f[4]] + o[f[5]] + "-" + o[f[6]] + o[f[7]] + "-" + o[f[8]] + o[f[9]] + "-" + o[f[10]] + o[f[11]] + o[f[12]] + o[f[13]] + o[f[14]] + o[f[15]];
  }
  return Pr.nil = new s("00000000-0000-0000-0000-000000000000"), Pr;
}
var Gr = {}, ia = {}, Wd;
function o0() {
  return Wd || (Wd = 1, (function(e) {
    (function(t) {
      t.parser = function(R, _) {
        return new n(R, _);
      }, t.SAXParser = n, t.SAXStream = f, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
      var r = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      t.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function n(R, _) {
        if (!(this instanceof n))
          return new n(R, _);
        var q = this;
        o(q), q.q = q.c = "", q.bufferCheckPosition = t.MAX_BUFFER_LENGTH, q.encoding = null, q.opt = _ || {}, q.opt.lowercase = q.opt.lowercase || q.opt.lowercasetags, q.looseCase = q.opt.lowercase ? "toLowerCase" : "toUpperCase", q.opt.maxEntityCount = q.opt.maxEntityCount || 512, q.opt.maxEntityDepth = q.opt.maxEntityDepth || 4, q.entityCount = q.entityDepth = 0, q.tags = [], q.closed = q.closedRoot = q.sawRoot = !1, q.tag = q.error = null, q.strict = !!R, q.noscript = !!(R || q.opt.noscript), q.state = T.BEGIN, q.strictEntities = q.opt.strictEntities, q.ENTITIES = q.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), q.attribList = [], q.opt.xmlns && (q.ns = Object.create(m)), q.opt.unquotedAttributeValues === void 0 && (q.opt.unquotedAttributeValues = !R), q.trackPosition = q.opt.position !== !1, q.trackPosition && (q.position = q.line = q.column = 0), k(q, "onready");
      }
      Object.create || (Object.create = function(R) {
        function _() {
        }
        _.prototype = R;
        var q = new _();
        return q;
      }), Object.keys || (Object.keys = function(R) {
        var _ = [];
        for (var q in R) R.hasOwnProperty(q) && _.push(q);
        return _;
      });
      function i(R) {
        for (var _ = Math.max(t.MAX_BUFFER_LENGTH, 10), q = 0, L = 0, Ne = r.length; L < Ne; L++) {
          var W = R[r[L]].length;
          if (W > _)
            switch (r[L]) {
              case "textNode":
                G(R);
                break;
              case "cdata":
                O(R, "oncdata", R.cdata), R.cdata = "";
                break;
              case "script":
                O(R, "onscript", R.script), R.script = "";
                break;
              default:
                ie(R, "Max buffer length exceeded: " + r[L]);
            }
          q = Math.max(q, W);
        }
        var z = t.MAX_BUFFER_LENGTH - q;
        R.bufferCheckPosition = z + R.position;
      }
      function o(R) {
        for (var _ = 0, q = r.length; _ < q; _++)
          R[r[_]] = "";
      }
      function s(R) {
        G(R), R.cdata !== "" && (O(R, "oncdata", R.cdata), R.cdata = ""), R.script !== "" && (O(R, "onscript", R.script), R.script = "");
      }
      n.prototype = {
        end: function() {
          we(this);
        },
        write: Fe,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          s(this);
        }
      };
      var a;
      try {
        a = require("stream").Stream;
      } catch {
        a = function() {
        };
      }
      a || (a = function() {
      });
      var c = t.EVENTS.filter(function(R) {
        return R !== "error" && R !== "end";
      });
      function u(R, _) {
        return new f(R, _);
      }
      function l(R, _) {
        if (R.length >= 2) {
          if (R[0] === 255 && R[1] === 254)
            return "utf-16le";
          if (R[0] === 254 && R[1] === 255)
            return "utf-16be";
        }
        return R.length >= 3 && R[0] === 239 && R[1] === 187 && R[2] === 191 ? "utf8" : R.length >= 4 ? R[0] === 60 && R[1] === 0 && R[2] === 63 && R[3] === 0 ? "utf-16le" : R[0] === 0 && R[1] === 60 && R[2] === 0 && R[3] === 63 ? "utf-16be" : "utf8" : _ ? "utf8" : null;
      }
      function f(R, _) {
        if (!(this instanceof f))
          return new f(R, _);
        a.apply(this), this._parser = new n(R, _), this.writable = !0, this.readable = !0;
        var q = this;
        this._parser.onend = function() {
          q.emit("end");
        }, this._parser.onerror = function(L) {
          q.emit("error", L), q._parser.error = null;
        }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(L) {
          Object.defineProperty(q, "on" + L, {
            get: function() {
              return q._parser["on" + L];
            },
            set: function(Ne) {
              if (!Ne)
                return q.removeAllListeners(L), q._parser["on" + L] = Ne, Ne;
              q.on(L, Ne);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      f.prototype = Object.create(a.prototype, {
        constructor: {
          value: f
        }
      }), f.prototype._decodeBuffer = function(R, _) {
        if (this._decoderBuffer && (R = Buffer.concat([this._decoderBuffer, R]), this._decoderBuffer = null), !this._decoder) {
          var q = l(R, _);
          if (!q)
            return this._decoderBuffer = R, "";
          this._parser.encoding = q, this._decoder = new TextDecoder(q);
        }
        return this._decoder.decode(R, { stream: !_ });
      }, f.prototype.write = function(R) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(R))
          R = this._decodeBuffer(R, !1);
        else if (this._decoderBuffer) {
          var _ = this._decodeBuffer(Buffer.alloc(0), !0);
          _ && (this._parser.write(_), this.emit("data", _));
        }
        return this._parser.write(R.toString()), this.emit("data", R), !0;
      }, f.prototype.end = function(R) {
        if (R && R.length && this.write(R), this._decoderBuffer) {
          var _ = this._decodeBuffer(Buffer.alloc(0), !0);
          _ && (this._parser.write(_), this.emit("data", _));
        } else if (this._decoder) {
          var q = this._decoder.decode();
          q && (this._parser.write(q), this.emit("data", q));
        }
        return this._parser.end(), !0;
      }, f.prototype.on = function(R, _) {
        var q = this;
        return !q._parser["on" + R] && c.indexOf(R) !== -1 && (q._parser["on" + R] = function() {
          var L = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          L.splice(0, 0, R), q.emit.apply(q, L);
        }), a.prototype.on.call(q, R, _);
      };
      var d = "[CDATA[", p = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", m = { xml: g, xmlns: y }, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, x = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function w(R) {
        return R === " " || R === `
` || R === "\r" || R === "	";
      }
      function E(R) {
        return R === '"' || R === "'";
      }
      function b(R) {
        return R === ">" || w(R);
      }
      function v(R, _) {
        return R.test(_);
      }
      function P(R, _) {
        return !v(R, _);
      }
      var T = 0;
      t.STATE = {
        BEGIN: T++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: T++,
        // leading whitespace
        TEXT: T++,
        // general stuff
        TEXT_ENTITY: T++,
        // &amp and such.
        OPEN_WAKA: T++,
        // <
        SGML_DECL: T++,
        // <!BLARG
        SGML_DECL_QUOTED: T++,
        // <!BLARG foo "bar
        DOCTYPE: T++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: T++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: T++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: T++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: T++,
        // <!-
        COMMENT: T++,
        // <!--
        COMMENT_ENDING: T++,
        // <!-- blah -
        COMMENT_ENDED: T++,
        // <!-- blah --
        CDATA: T++,
        // <![CDATA[ something
        CDATA_ENDING: T++,
        // ]
        CDATA_ENDING_2: T++,
        // ]]
        PROC_INST: T++,
        // <?hi
        PROC_INST_BODY: T++,
        // <?hi there
        PROC_INST_ENDING: T++,
        // <?hi "there" ?
        OPEN_TAG: T++,
        // <strong
        OPEN_TAG_SLASH: T++,
        // <strong /
        ATTRIB: T++,
        // <a
        ATTRIB_NAME: T++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: T++,
        // <a foo _
        ATTRIB_VALUE: T++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: T++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: T++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: T++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: T++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: T++,
        // <foo bar=&quot
        CLOSE_TAG: T++,
        // </a
        CLOSE_TAG_SAW_WHITE: T++,
        // </a   >
        SCRIPT: T++,
        // <script> ...
        SCRIPT_ENDING: T++
        // <script> ... <
      }, t.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, t.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(t.ENTITIES).forEach(function(R) {
        var _ = t.ENTITIES[R], q = typeof _ == "number" ? String.fromCharCode(_) : _;
        t.ENTITIES[R] = q;
      });
      for (var U in t.STATE)
        t.STATE[t.STATE[U]] = U;
      T = t.STATE;
      function k(R, _, q) {
        R[_] && R[_](q);
      }
      function M(R) {
        var _ = R && R.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
        return _ ? _[2] : null;
      }
      function N(R) {
        return R ? R.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
      }
      function F(R, _) {
        const q = N(R), L = N(_);
        return !q || !L ? !0 : L === "utf16" ? q === "utf16le" || q === "utf16be" : q === L;
      }
      function $(R, _) {
        if (!(!R.strict || !R.encoding || !_ || _.name !== "xml")) {
          var q = M(_.body);
          q && !F(R.encoding, q) && ne(
            R,
            "XML declaration encoding " + q + " does not match detected stream encoding " + R.encoding.toUpperCase()
          );
        }
      }
      function O(R, _, q) {
        R.textNode && G(R), k(R, _, q);
      }
      function G(R) {
        R.textNode = Y(R.opt, R.textNode), R.textNode && k(R, "ontext", R.textNode), R.textNode = "";
      }
      function Y(R, _) {
        return R.trim && (_ = _.trim()), R.normalize && (_ = _.replace(/\s+/g, " ")), _;
      }
      function ie(R, _) {
        return G(R), R.trackPosition && (_ += `
Line: ` + R.line + `
Column: ` + R.column + `
Char: ` + R.c), _ = new Error(_), R.error = _, k(R, "onerror", _), R;
      }
      function we(R) {
        return R.sawRoot && !R.closedRoot && ne(R, "Unclosed root tag"), R.state !== T.BEGIN && R.state !== T.BEGIN_WHITESPACE && R.state !== T.TEXT && ie(R, "Unexpected end"), G(R), R.c = "", R.closed = !0, k(R, "onend"), n.call(R, R.strict, R.opt), R;
      }
      function ne(R, _) {
        if (typeof R != "object" || !(R instanceof n))
          throw new Error("bad call to strictFail");
        R.strict && ie(R, _);
      }
      function Ie(R) {
        R.strict || (R.tagName = R.tagName[R.looseCase]());
        var _ = R.tags[R.tags.length - 1] || R, q = R.tag = { name: R.tagName, attributes: {} };
        R.opt.xmlns && (q.ns = _.ns), R.attribList.length = 0, O(R, "onopentagstart", q);
      }
      function Re(R, _) {
        var q = R.indexOf(":"), L = q < 0 ? ["", R] : R.split(":"), Ne = L[0], W = L[1];
        return _ && R === "xmlns" && (Ne = "xmlns", W = ""), { prefix: Ne, local: W };
      }
      function te(R) {
        if (R.strict || (R.attribName = R.attribName[R.looseCase]()), R.attribList.indexOf(R.attribName) !== -1 || R.tag.attributes.hasOwnProperty(R.attribName)) {
          R.attribName = R.attribValue = "";
          return;
        }
        if (R.opt.xmlns) {
          var _ = Re(R.attribName, !0), q = _.prefix, L = _.local;
          if (q === "xmlns")
            if (L === "xml" && R.attribValue !== g)
              ne(
                R,
                "xml: prefix must be bound to " + g + `
Actual: ` + R.attribValue
              );
            else if (L === "xmlns" && R.attribValue !== y)
              ne(
                R,
                "xmlns: prefix must be bound to " + y + `
Actual: ` + R.attribValue
              );
            else {
              var Ne = R.tag, W = R.tags[R.tags.length - 1] || R;
              Ne.ns === W.ns && (Ne.ns = Object.create(W.ns)), Ne.ns[L] = R.attribValue;
            }
          R.attribList.push([R.attribName, R.attribValue]);
        } else
          R.tag.attributes[R.attribName] = R.attribValue, O(R, "onattribute", {
            name: R.attribName,
            value: R.attribValue
          });
        R.attribName = R.attribValue = "";
      }
      function Se(R, _) {
        if (R.opt.xmlns) {
          var q = R.tag, L = Re(R.tagName);
          q.prefix = L.prefix, q.local = L.local, q.uri = q.ns[L.prefix] || "", q.prefix && !q.uri && (ne(
            R,
            "Unbound namespace prefix: " + JSON.stringify(R.tagName)
          ), q.uri = L.prefix);
          var Ne = R.tags[R.tags.length - 1] || R;
          q.ns && Ne.ns !== q.ns && Object.keys(q.ns).forEach(function(ae) {
            O(R, "onopennamespace", {
              prefix: ae,
              uri: q.ns[ae]
            });
          });
          for (var W = 0, z = R.attribList.length; W < z; W++) {
            var ue = R.attribList[W], ye = ue[0], de = ue[1], h = Re(ye, !0), H = h.prefix, V = h.local, ce = H === "" ? "" : q.ns[H] || "", K = {
              name: ye,
              value: de,
              prefix: H,
              local: V,
              uri: ce
            };
            H && H !== "xmlns" && !ce && (ne(
              R,
              "Unbound namespace prefix: " + JSON.stringify(H)
            ), K.uri = H), R.tag.attributes[ye] = K, O(R, "onattribute", K);
          }
          R.attribList.length = 0;
        }
        R.tag.isSelfClosing = !!_, R.sawRoot = !0, R.tags.push(R.tag), O(R, "onopentag", R.tag), _ || (!R.noscript && R.tagName.toLowerCase() === "script" ? R.state = T.SCRIPT : R.state = T.TEXT, R.tag = null, R.tagName = ""), R.attribName = R.attribValue = "", R.attribList.length = 0;
      }
      function De(R) {
        if (!R.tagName) {
          ne(R, "Weird empty close tag."), R.textNode += "</>", R.state = T.TEXT;
          return;
        }
        if (R.script) {
          if (R.tagName !== "script") {
            R.script += "</" + R.tagName + ">", R.tagName = "", R.state = T.SCRIPT;
            return;
          }
          O(R, "onscript", R.script), R.script = "";
        }
        var _ = R.tags.length, q = R.tagName;
        R.strict || (q = q[R.looseCase]());
        for (var L = q; _--; ) {
          var Ne = R.tags[_];
          if (Ne.name !== L)
            ne(R, "Unexpected close tag");
          else
            break;
        }
        if (_ < 0) {
          ne(R, "Unmatched closing tag: " + R.tagName), R.textNode += "</" + R.tagName + ">", R.state = T.TEXT;
          return;
        }
        R.tagName = q;
        for (var W = R.tags.length; W-- > _; ) {
          var z = R.tag = R.tags.pop();
          R.tagName = R.tag.name, O(R, "onclosetag", R.tagName);
          var ue = {};
          for (var ye in z.ns)
            ue[ye] = z.ns[ye];
          var de = R.tags[R.tags.length - 1] || R;
          R.opt.xmlns && z.ns !== de.ns && Object.keys(z.ns).forEach(function(h) {
            var H = z.ns[h];
            O(R, "onclosenamespace", { prefix: h, uri: H });
          });
        }
        _ === 0 && (R.closedRoot = !0), R.tagName = R.attribValue = R.attribName = "", R.attribList.length = 0, R.state = T.TEXT;
      }
      function Ue(R) {
        var _ = R.entity, q = _.toLowerCase(), L, Ne = "";
        return R.ENTITIES[_] ? R.ENTITIES[_] : R.ENTITIES[q] ? R.ENTITIES[q] : (_ = q, _.charAt(0) === "#" && (_.charAt(1) === "x" ? (_ = _.slice(2), L = parseInt(_, 16), Ne = L.toString(16)) : (_ = _.slice(1), L = parseInt(_, 10), Ne = L.toString(10))), _ = _.replace(/^0+/, ""), isNaN(L) || Ne.toLowerCase() !== _ || L < 0 || L > 1114111 ? (ne(R, "Invalid character entity"), "&" + R.entity + ";") : String.fromCodePoint(L));
      }
      function We(R, _) {
        _ === "<" ? (R.state = T.OPEN_WAKA, R.startTagPosition = R.position) : w(_) || (ne(R, "Non-whitespace before first tag."), R.textNode = _, R.state = T.TEXT);
      }
      function Be(R, _) {
        var q = "";
        return _ < R.length && (q = R.charAt(_)), q;
      }
      function Fe(R) {
        var _ = this;
        if (this.error)
          throw this.error;
        if (_.closed)
          return ie(
            _,
            "Cannot write after close. Assign an onready handler."
          );
        if (R === null)
          return we(_);
        typeof R == "object" && (R = R.toString());
        for (var q = 0, L = ""; L = Be(R, q++), _.c = L, !!L; )
          switch (_.trackPosition && (_.position++, L === `
` ? (_.line++, _.column = 0) : _.column++), _.state) {
            case T.BEGIN:
              if (_.state = T.BEGIN_WHITESPACE, L === "\uFEFF")
                continue;
              We(_, L);
              continue;
            case T.BEGIN_WHITESPACE:
              We(_, L);
              continue;
            case T.TEXT:
              if (_.sawRoot && !_.closedRoot) {
                for (var W = q - 1; L && L !== "<" && L !== "&"; )
                  L = Be(R, q++), L && _.trackPosition && (_.position++, L === `
` ? (_.line++, _.column = 0) : _.column++);
                _.textNode += R.substring(W, q - 1);
              }
              L === "<" && !(_.sawRoot && _.closedRoot && !_.strict) ? (_.state = T.OPEN_WAKA, _.startTagPosition = _.position) : (!w(L) && (!_.sawRoot || _.closedRoot) && ne(_, "Text data outside of root node."), L === "&" ? _.state = T.TEXT_ENTITY : _.textNode += L);
              continue;
            case T.SCRIPT:
              L === "<" ? _.state = T.SCRIPT_ENDING : _.script += L;
              continue;
            case T.SCRIPT_ENDING:
              L === "/" ? _.state = T.CLOSE_TAG : (_.script += "<" + L, _.state = T.SCRIPT);
              continue;
            case T.OPEN_WAKA:
              if (L === "!")
                _.state = T.SGML_DECL, _.sgmlDecl = "";
              else if (!w(L)) if (v(S, L))
                _.state = T.OPEN_TAG, _.tagName = L;
              else if (L === "/")
                _.state = T.CLOSE_TAG, _.tagName = "";
              else if (L === "?")
                _.state = T.PROC_INST, _.procInstName = _.procInstBody = "";
              else {
                if (ne(_, "Unencoded <"), _.startTagPosition + 1 < _.position) {
                  var Ne = _.position - _.startTagPosition;
                  L = new Array(Ne).join(" ") + L;
                }
                _.textNode += "<" + L, _.state = T.TEXT;
              }
              continue;
            case T.SGML_DECL:
              if (_.sgmlDecl + L === "--") {
                _.state = T.COMMENT, _.comment = "", _.sgmlDecl = "";
                continue;
              }
              _.doctype && _.doctype !== !0 && _.sgmlDecl ? (_.state = T.DOCTYPE_DTD, _.doctype += "<!" + _.sgmlDecl + L, _.sgmlDecl = "") : (_.sgmlDecl + L).toUpperCase() === d ? (O(_, "onopencdata"), _.state = T.CDATA, _.sgmlDecl = "", _.cdata = "") : (_.sgmlDecl + L).toUpperCase() === p ? (_.state = T.DOCTYPE, (_.doctype || _.sawRoot) && ne(
                _,
                "Inappropriately located doctype declaration"
              ), _.doctype = "", _.sgmlDecl = "") : L === ">" ? (O(_, "onsgmldeclaration", _.sgmlDecl), _.sgmlDecl = "", _.state = T.TEXT) : (E(L) && (_.state = T.SGML_DECL_QUOTED), _.sgmlDecl += L);
              continue;
            case T.SGML_DECL_QUOTED:
              L === _.q && (_.state = T.SGML_DECL, _.q = ""), _.sgmlDecl += L;
              continue;
            case T.DOCTYPE:
              L === ">" ? (_.state = T.TEXT, O(_, "ondoctype", _.doctype), _.doctype = !0) : (_.doctype += L, L === "[" ? _.state = T.DOCTYPE_DTD : E(L) && (_.state = T.DOCTYPE_QUOTED, _.q = L));
              continue;
            case T.DOCTYPE_QUOTED:
              _.doctype += L, L === _.q && (_.q = "", _.state = T.DOCTYPE);
              continue;
            case T.DOCTYPE_DTD:
              L === "]" ? (_.doctype += L, _.state = T.DOCTYPE) : L === "<" ? (_.state = T.OPEN_WAKA, _.startTagPosition = _.position) : E(L) ? (_.doctype += L, _.state = T.DOCTYPE_DTD_QUOTED, _.q = L) : _.doctype += L;
              continue;
            case T.DOCTYPE_DTD_QUOTED:
              _.doctype += L, L === _.q && (_.state = T.DOCTYPE_DTD, _.q = "");
              continue;
            case T.COMMENT:
              L === "-" ? _.state = T.COMMENT_ENDING : _.comment += L;
              continue;
            case T.COMMENT_ENDING:
              L === "-" ? (_.state = T.COMMENT_ENDED, _.comment = Y(_.opt, _.comment), _.comment && O(_, "oncomment", _.comment), _.comment = "") : (_.comment += "-" + L, _.state = T.COMMENT);
              continue;
            case T.COMMENT_ENDED:
              L !== ">" ? (ne(_, "Malformed comment"), _.comment += "--" + L, _.state = T.COMMENT) : _.doctype && _.doctype !== !0 ? _.state = T.DOCTYPE_DTD : _.state = T.TEXT;
              continue;
            case T.CDATA:
              for (var W = q - 1; L && L !== "]"; )
                L = Be(R, q++), L && _.trackPosition && (_.position++, L === `
` ? (_.line++, _.column = 0) : _.column++);
              _.cdata += R.substring(W, q - 1), L === "]" && (_.state = T.CDATA_ENDING);
              continue;
            case T.CDATA_ENDING:
              L === "]" ? _.state = T.CDATA_ENDING_2 : (_.cdata += "]" + L, _.state = T.CDATA);
              continue;
            case T.CDATA_ENDING_2:
              L === ">" ? (_.cdata && O(_, "oncdata", _.cdata), O(_, "onclosecdata"), _.cdata = "", _.state = T.TEXT) : L === "]" ? _.cdata += "]" : (_.cdata += "]]" + L, _.state = T.CDATA);
              continue;
            case T.PROC_INST:
              L === "?" ? _.state = T.PROC_INST_ENDING : w(L) ? _.state = T.PROC_INST_BODY : _.procInstName += L;
              continue;
            case T.PROC_INST_BODY:
              if (!_.procInstBody && w(L))
                continue;
              L === "?" ? _.state = T.PROC_INST_ENDING : _.procInstBody += L;
              continue;
            case T.PROC_INST_ENDING:
              if (L === ">") {
                const de = {
                  name: _.procInstName,
                  body: _.procInstBody
                };
                $(_, de), O(_, "onprocessinginstruction", de), _.procInstName = _.procInstBody = "", _.state = T.TEXT;
              } else
                _.procInstBody += "?" + L, _.state = T.PROC_INST_BODY;
              continue;
            case T.OPEN_TAG:
              v(C, L) ? _.tagName += L : (Ie(_), L === ">" ? Se(_) : L === "/" ? _.state = T.OPEN_TAG_SLASH : (w(L) || ne(_, "Invalid character in tag name"), _.state = T.ATTRIB));
              continue;
            case T.OPEN_TAG_SLASH:
              L === ">" ? (Se(_, !0), De(_)) : (ne(
                _,
                "Forward-slash in opening tag not followed by >"
              ), _.state = T.ATTRIB);
              continue;
            case T.ATTRIB:
              if (w(L))
                continue;
              L === ">" ? Se(_) : L === "/" ? _.state = T.OPEN_TAG_SLASH : v(S, L) ? (_.attribName = L, _.attribValue = "", _.state = T.ATTRIB_NAME) : ne(_, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME:
              L === "=" ? _.state = T.ATTRIB_VALUE : L === ">" ? (ne(_, "Attribute without value"), _.attribValue = _.attribName, te(_), Se(_)) : w(L) ? _.state = T.ATTRIB_NAME_SAW_WHITE : v(C, L) ? _.attribName += L : ne(_, "Invalid attribute name");
              continue;
            case T.ATTRIB_NAME_SAW_WHITE:
              if (L === "=")
                _.state = T.ATTRIB_VALUE;
              else {
                if (w(L))
                  continue;
                ne(_, "Attribute without value"), _.tag.attributes[_.attribName] = "", _.attribValue = "", O(_, "onattribute", {
                  name: _.attribName,
                  value: ""
                }), _.attribName = "", L === ">" ? Se(_) : v(S, L) ? (_.attribName = L, _.state = T.ATTRIB_NAME) : (ne(_, "Invalid attribute name"), _.state = T.ATTRIB);
              }
              continue;
            case T.ATTRIB_VALUE:
              if (w(L))
                continue;
              E(L) ? (_.q = L, _.state = T.ATTRIB_VALUE_QUOTED) : (_.opt.unquotedAttributeValues || ie(_, "Unquoted attribute value"), _.state = T.ATTRIB_VALUE_UNQUOTED, _.attribValue = L);
              continue;
            case T.ATTRIB_VALUE_QUOTED:
              if (L !== _.q) {
                L === "&" ? _.state = T.ATTRIB_VALUE_ENTITY_Q : _.attribValue += L;
                continue;
              }
              te(_), _.q = "", _.state = T.ATTRIB_VALUE_CLOSED;
              continue;
            case T.ATTRIB_VALUE_CLOSED:
              w(L) ? _.state = T.ATTRIB : L === ">" ? Se(_) : L === "/" ? _.state = T.OPEN_TAG_SLASH : v(S, L) ? (ne(_, "No whitespace between attributes"), _.attribName = L, _.attribValue = "", _.state = T.ATTRIB_NAME) : ne(_, "Invalid attribute name");
              continue;
            case T.ATTRIB_VALUE_UNQUOTED:
              if (!b(L)) {
                L === "&" ? _.state = T.ATTRIB_VALUE_ENTITY_U : _.attribValue += L;
                continue;
              }
              te(_), L === ">" ? Se(_) : _.state = T.ATTRIB;
              continue;
            case T.CLOSE_TAG:
              if (_.tagName)
                L === ">" ? De(_) : v(C, L) ? _.tagName += L : _.script ? (_.script += "</" + _.tagName + L, _.tagName = "", _.state = T.SCRIPT) : (w(L) || ne(_, "Invalid tagname in closing tag"), _.state = T.CLOSE_TAG_SAW_WHITE);
              else {
                if (w(L))
                  continue;
                P(S, L) ? _.script ? (_.script += "</" + L, _.state = T.SCRIPT) : ne(_, "Invalid tagname in closing tag.") : _.tagName = L;
              }
              continue;
            case T.CLOSE_TAG_SAW_WHITE:
              if (w(L))
                continue;
              L === ">" ? De(_) : ne(_, "Invalid characters in closing tag");
              continue;
            case T.TEXT_ENTITY:
            case T.ATTRIB_VALUE_ENTITY_Q:
            case T.ATTRIB_VALUE_ENTITY_U:
              var z, ue;
              switch (_.state) {
                case T.TEXT_ENTITY:
                  z = T.TEXT, ue = "textNode";
                  break;
                case T.ATTRIB_VALUE_ENTITY_Q:
                  z = T.ATTRIB_VALUE_QUOTED, ue = "attribValue";
                  break;
                case T.ATTRIB_VALUE_ENTITY_U:
                  z = T.ATTRIB_VALUE_UNQUOTED, ue = "attribValue";
                  break;
              }
              if (L === ";") {
                var ye = Ue(_);
                _.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ye) ? ((_.entityCount += 1) > _.opt.maxEntityCount && ie(
                  _,
                  "Parsed entity count exceeds max entity count"
                ), (_.entityDepth += 1) > _.opt.maxEntityDepth && ie(
                  _,
                  "Parsed entity depth exceeds max entity depth"
                ), _.entity = "", _.state = z, _.write(ye), _.entityDepth -= 1) : (_[ue] += ye, _.entity = "", _.state = z);
              } else v(_.entity.length ? x : A, L) ? _.entity += L : (ne(_, "Invalid character in entity name"), _[ue] += "&" + _.entity + L, _.entity = "", _.state = z);
              continue;
            default:
              throw new Error(_, "Unknown state: " + _.state);
          }
        return _.position >= _.bufferCheckPosition && i(_), _;
      }
      /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
      String.fromCodePoint || (function() {
        var R = String.fromCharCode, _ = Math.floor, q = function() {
          var L = 16384, Ne = [], W, z, ue = -1, ye = arguments.length;
          if (!ye)
            return "";
          for (var de = ""; ++ue < ye; ) {
            var h = Number(arguments[ue]);
            if (!isFinite(h) || // `NaN`, `+Infinity`, or `-Infinity`
            h < 0 || // not a valid Unicode code point
            h > 1114111 || // not a valid Unicode code point
            _(h) !== h)
              throw RangeError("Invalid code point: " + h);
            h <= 65535 ? Ne.push(h) : (h -= 65536, W = (h >> 10) + 55296, z = h % 1024 + 56320, Ne.push(W, z)), (ue + 1 === ye || Ne.length > L) && (de += R.apply(null, Ne), Ne.length = 0);
          }
          return de;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: q,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = q;
      })();
    })(e);
  })(ia)), ia;
}
var Hd;
function a0() {
  if (Hd) return Gr;
  Hd = 1, Object.defineProperty(Gr, "__esModule", { value: !0 }), Gr.XElement = void 0, Gr.parseXml = s;
  const e = o0(), t = $s();
  class r {
    constructor(c) {
      if (this.name = c, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !c)
        throw (0, t.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!i(c))
        throw (0, t.newError)(`Invalid element name: ${c}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(c) {
      const u = this.attributes === null ? null : this.attributes[c];
      if (u == null)
        throw (0, t.newError)(`No attribute "${c}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return u;
    }
    removeAttribute(c) {
      this.attributes !== null && delete this.attributes[c];
    }
    element(c, u = !1, l = null) {
      const f = this.elementOrNull(c, u);
      if (f === null)
        throw (0, t.newError)(l || `No element "${c}"`, "ERR_XML_MISSED_ELEMENT");
      return f;
    }
    elementOrNull(c, u = !1) {
      if (this.elements === null)
        return null;
      for (const l of this.elements)
        if (o(l, c, u))
          return l;
      return null;
    }
    getElements(c, u = !1) {
      return this.elements === null ? [] : this.elements.filter((l) => o(l, c, u));
    }
    elementValueOrEmpty(c, u = !1) {
      const l = this.elementOrNull(c, u);
      return l === null ? "" : l.value;
    }
  }
  Gr.XElement = r;
  const n = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function i(a) {
    return n.test(a);
  }
  function o(a, c, u) {
    const l = a.name;
    return l === c || u === !0 && l.length === c.length && l.toLowerCase() === c.toLowerCase();
  }
  function s(a) {
    let c = null;
    const u = e.parser(!0, {}), l = [];
    return u.onopentag = (f) => {
      const d = new r(f.name);
      if (d.attributes = f.attributes, c === null)
        c = d;
      else {
        const p = l[l.length - 1];
        p.elements == null && (p.elements = []), p.elements.push(d);
      }
      l.push(d);
    }, u.onclosetag = () => {
      l.pop();
    }, u.ontext = (f) => {
      l.length > 0 && (l[l.length - 1].value = f);
    }, u.oncdata = (f) => {
      const d = l[l.length - 1];
      d.value = f, d.isCData = !0;
    }, u.onerror = (f) => {
      throw f;
    }, u.write(a), c;
  }
  return Gr;
}
var jd;
function et() {
  return jd || (jd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
    var t = cl();
    Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
      return t.CancellationError;
    } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } });
    var r = $s();
    Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
      return r.newError;
    } });
    var n = e0();
    Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
      return n.configureRequestOptions;
    } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return n.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
      return n.configureRequestUrl;
    } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
      return n.createHttpError;
    } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
      return n.DigestTransform;
    } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
      return n.HttpError;
    } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
      return n.HttpExecutor;
    } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
      return n.parseJson;
    } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
      return n.safeGetHeader;
    } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
      return n.safeStringifyJson;
    } });
    var i = t0();
    Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
      return i.MemoLazy;
    } });
    var o = gm();
    Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return o.ProgressCallbackTransform;
    } });
    var s = r0();
    Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return s.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
      return s.githubUrl;
    } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
      return s.githubTagPrefix;
    } });
    var a = n0();
    Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
      return a.retry;
    } });
    var c = i0();
    Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
      return c.parseDn;
    } });
    var u = s0();
    Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
      return u.UUID;
    } });
    var l = a0();
    Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
      return l.parseXml;
    } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
      return l.XElement;
    } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function f(d) {
      return d == null ? [] : Array.isArray(d) ? d : [d];
    }
  })(Zo)), Zo;
}
var ot = {}, Xi = {}, ar = {}, Gd;
function wi() {
  if (Gd) return ar;
  Gd = 1;
  function e(s) {
    return typeof s > "u" || s === null;
  }
  function t(s) {
    return typeof s == "object" && s !== null;
  }
  function r(s) {
    return Array.isArray(s) ? s : e(s) ? [] : [s];
  }
  function n(s, a) {
    var c, u, l, f;
    if (a)
      for (f = Object.keys(a), c = 0, u = f.length; c < u; c += 1)
        l = f[c], s[l] = a[l];
    return s;
  }
  function i(s, a) {
    var c = "", u;
    for (u = 0; u < a; u += 1)
      c += s;
    return c;
  }
  function o(s) {
    return s === 0 && Number.NEGATIVE_INFINITY === 1 / s;
  }
  return ar.isNothing = e, ar.isObject = t, ar.toArray = r, ar.repeat = i, ar.isNegativeZero = o, ar.extend = n, ar;
}
var sa, zd;
function Ei() {
  if (zd) return sa;
  zd = 1;
  function e(r, n) {
    var i = "", o = r.reason || "(unknown reason)";
    return r.mark ? (r.mark.name && (i += 'in "' + r.mark.name + '" '), i += "(" + (r.mark.line + 1) + ":" + (r.mark.column + 1) + ")", !n && r.mark.snippet && (i += `

` + r.mark.snippet), o + " " + i) : o;
  }
  function t(r, n) {
    Error.call(this), this.name = "YAMLException", this.reason = r, this.mark = n, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = function(n) {
    return this.name + ": " + e(this, n);
  }, sa = t, sa;
}
var oa, Vd;
function c0() {
  if (Vd) return oa;
  Vd = 1;
  var e = wi();
  function t(i, o, s, a, c) {
    var u = "", l = "", f = Math.floor(c / 2) - 1;
    return a - o > f && (u = " ... ", o = a - f + u.length), s - a > f && (l = " ...", s = a + f - l.length), {
      str: u + i.slice(o, s).replace(/\t/g, "→") + l,
      pos: a - o + u.length
      // relative position
    };
  }
  function r(i, o) {
    return e.repeat(" ", o - i.length) + i;
  }
  function n(i, o) {
    if (o = Object.create(o || null), !i.buffer) return null;
    o.maxLength || (o.maxLength = 79), typeof o.indent != "number" && (o.indent = 1), typeof o.linesBefore != "number" && (o.linesBefore = 3), typeof o.linesAfter != "number" && (o.linesAfter = 2);
    for (var s = /\r?\n|\r|\0/g, a = [0], c = [], u, l = -1; u = s.exec(i.buffer); )
      c.push(u.index), a.push(u.index + u[0].length), i.position <= u.index && l < 0 && (l = a.length - 2);
    l < 0 && (l = a.length - 1);
    var f = "", d, p, g = Math.min(i.line + o.linesAfter, c.length).toString().length, y = o.maxLength - (o.indent + g + 3);
    for (d = 1; d <= o.linesBefore && !(l - d < 0); d++)
      p = t(
        i.buffer,
        a[l - d],
        c[l - d],
        i.position - (a[l] - a[l - d]),
        y
      ), f = e.repeat(" ", o.indent) + r((i.line - d + 1).toString(), g) + " | " + p.str + `
` + f;
    for (p = t(i.buffer, a[l], c[l], i.position, y), f += e.repeat(" ", o.indent) + r((i.line + 1).toString(), g) + " | " + p.str + `
`, f += e.repeat("-", o.indent + g + 3 + p.pos) + `^
`, d = 1; d <= o.linesAfter && !(l + d >= c.length); d++)
      p = t(
        i.buffer,
        a[l + d],
        c[l + d],
        i.position - (a[l] - a[l + d]),
        y
      ), f += e.repeat(" ", o.indent) + r((i.line + d + 1).toString(), g) + " | " + p.str + `
`;
    return f.replace(/\n$/, "");
  }
  return oa = n, oa;
}
var aa, Yd;
function dt() {
  if (Yd) return aa;
  Yd = 1;
  var e = Ei(), t = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], r = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function n(o) {
    var s = {};
    return o !== null && Object.keys(o).forEach(function(a) {
      o[a].forEach(function(c) {
        s[String(c)] = a;
      });
    }), s;
  }
  function i(o, s) {
    if (s = s || {}, Object.keys(s).forEach(function(a) {
      if (t.indexOf(a) === -1)
        throw new e('Unknown option "' + a + '" is met in definition of "' + o + '" YAML type.');
    }), this.options = s, this.tag = o, this.kind = s.kind || null, this.resolve = s.resolve || function() {
      return !0;
    }, this.construct = s.construct || function(a) {
      return a;
    }, this.instanceOf = s.instanceOf || null, this.predicate = s.predicate || null, this.represent = s.represent || null, this.representName = s.representName || null, this.defaultStyle = s.defaultStyle || null, this.multi = s.multi || !1, this.styleAliases = n(s.styleAliases || null), r.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + o + '" YAML type.');
  }
  return aa = i, aa;
}
var ca, Kd;
function ym() {
  if (Kd) return ca;
  Kd = 1;
  var e = Ei(), t = dt();
  function r(o, s) {
    var a = [];
    return o[s].forEach(function(c) {
      var u = a.length;
      a.forEach(function(l, f) {
        l.tag === c.tag && l.kind === c.kind && l.multi === c.multi && (u = f);
      }), a[u] = c;
    }), a;
  }
  function n() {
    var o = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, s, a;
    function c(u) {
      u.multi ? (o.multi[u.kind].push(u), o.multi.fallback.push(u)) : o[u.kind][u.tag] = o.fallback[u.tag] = u;
    }
    for (s = 0, a = arguments.length; s < a; s += 1)
      arguments[s].forEach(c);
    return o;
  }
  function i(o) {
    return this.extend(o);
  }
  return i.prototype.extend = function(s) {
    var a = [], c = [];
    if (s instanceof t)
      c.push(s);
    else if (Array.isArray(s))
      c = c.concat(s);
    else if (s && (Array.isArray(s.implicit) || Array.isArray(s.explicit)))
      s.implicit && (a = a.concat(s.implicit)), s.explicit && (c = c.concat(s.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    a.forEach(function(l) {
      if (!(l instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (l.loadKind && l.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (l.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), c.forEach(function(l) {
      if (!(l instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var u = Object.create(i.prototype);
    return u.implicit = (this.implicit || []).concat(a), u.explicit = (this.explicit || []).concat(c), u.compiledImplicit = r(u, "implicit"), u.compiledExplicit = r(u, "explicit"), u.compiledTypeMap = n(u.compiledImplicit, u.compiledExplicit), u;
  }, ca = i, ca;
}
var la, Xd;
function vm() {
  if (Xd) return la;
  Xd = 1;
  var e = dt();
  return la = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(t) {
      return t !== null ? t : "";
    }
  }), la;
}
var ua, Jd;
function wm() {
  if (Jd) return ua;
  Jd = 1;
  var e = dt();
  return ua = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(t) {
      return t !== null ? t : [];
    }
  }), ua;
}
var da, Qd;
function Em() {
  if (Qd) return da;
  Qd = 1;
  var e = dt();
  return da = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(t) {
      return t !== null ? t : {};
    }
  }), da;
}
var fa, Zd;
function _m() {
  if (Zd) return fa;
  Zd = 1;
  var e = ym();
  return fa = new e({
    explicit: [
      vm(),
      wm(),
      Em()
    ]
  }), fa;
}
var ha, ef;
function Sm() {
  if (ef) return ha;
  ef = 1;
  var e = dt();
  function t(i) {
    if (i === null) return !0;
    var o = i.length;
    return o === 1 && i === "~" || o === 4 && (i === "null" || i === "Null" || i === "NULL");
  }
  function r() {
    return null;
  }
  function n(i) {
    return i === null;
  }
  return ha = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: n,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), ha;
}
var pa, tf;
function bm() {
  if (tf) return pa;
  tf = 1;
  var e = dt();
  function t(i) {
    if (i === null) return !1;
    var o = i.length;
    return o === 4 && (i === "true" || i === "True" || i === "TRUE") || o === 5 && (i === "false" || i === "False" || i === "FALSE");
  }
  function r(i) {
    return i === "true" || i === "True" || i === "TRUE";
  }
  function n(i) {
    return Object.prototype.toString.call(i) === "[object Boolean]";
  }
  return pa = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: n,
    represent: {
      lowercase: function(i) {
        return i ? "true" : "false";
      },
      uppercase: function(i) {
        return i ? "TRUE" : "FALSE";
      },
      camelcase: function(i) {
        return i ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), pa;
}
var ma, rf;
function Tm() {
  if (rf) return ma;
  rf = 1;
  var e = wi(), t = dt();
  function r(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
  }
  function n(c) {
    return 48 <= c && c <= 55;
  }
  function i(c) {
    return 48 <= c && c <= 57;
  }
  function o(c) {
    if (c === null) return !1;
    var u = c.length, l = 0, f = !1, d;
    if (!u) return !1;
    if (d = c[l], (d === "-" || d === "+") && (d = c[++l]), d === "0") {
      if (l + 1 === u) return !0;
      if (d = c[++l], d === "b") {
        for (l++; l < u; l++)
          if (d = c[l], d !== "_") {
            if (d !== "0" && d !== "1") return !1;
            f = !0;
          }
        return f && d !== "_";
      }
      if (d === "x") {
        for (l++; l < u; l++)
          if (d = c[l], d !== "_") {
            if (!r(c.charCodeAt(l))) return !1;
            f = !0;
          }
        return f && d !== "_";
      }
      if (d === "o") {
        for (l++; l < u; l++)
          if (d = c[l], d !== "_") {
            if (!n(c.charCodeAt(l))) return !1;
            f = !0;
          }
        return f && d !== "_";
      }
    }
    if (d === "_") return !1;
    for (; l < u; l++)
      if (d = c[l], d !== "_") {
        if (!i(c.charCodeAt(l)))
          return !1;
        f = !0;
      }
    return !(!f || d === "_");
  }
  function s(c) {
    var u = c, l = 1, f;
    if (u.indexOf("_") !== -1 && (u = u.replace(/_/g, "")), f = u[0], (f === "-" || f === "+") && (f === "-" && (l = -1), u = u.slice(1), f = u[0]), u === "0") return 0;
    if (f === "0") {
      if (u[1] === "b") return l * parseInt(u.slice(2), 2);
      if (u[1] === "x") return l * parseInt(u.slice(2), 16);
      if (u[1] === "o") return l * parseInt(u.slice(2), 8);
    }
    return l * parseInt(u, 10);
  }
  function a(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && c % 1 === 0 && !e.isNegativeZero(c);
  }
  return ma = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: o,
    construct: s,
    predicate: a,
    represent: {
      binary: function(c) {
        return c >= 0 ? "0b" + c.toString(2) : "-0b" + c.toString(2).slice(1);
      },
      octal: function(c) {
        return c >= 0 ? "0o" + c.toString(8) : "-0o" + c.toString(8).slice(1);
      },
      decimal: function(c) {
        return c.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(c) {
        return c >= 0 ? "0x" + c.toString(16).toUpperCase() : "-0x" + c.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), ma;
}
var ga, nf;
function Cm() {
  if (nf) return ga;
  nf = 1;
  var e = wi(), t = dt(), r = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function n(c) {
    return !(c === null || !r.test(c) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    c[c.length - 1] === "_");
  }
  function i(c) {
    var u, l;
    return u = c.replace(/_/g, "").toLowerCase(), l = u[0] === "-" ? -1 : 1, "+-".indexOf(u[0]) >= 0 && (u = u.slice(1)), u === ".inf" ? l === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : u === ".nan" ? NaN : l * parseFloat(u, 10);
  }
  var o = /^[-+]?[0-9]+e/;
  function s(c, u) {
    var l;
    if (isNaN(c))
      switch (u) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === c)
      switch (u) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === c)
      switch (u) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(c))
      return "-0.0";
    return l = c.toString(10), o.test(l) ? l.replace("e", ".e") : l;
  }
  function a(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && (c % 1 !== 0 || e.isNegativeZero(c));
  }
  return ga = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: n,
    construct: i,
    predicate: a,
    represent: s,
    defaultStyle: "lowercase"
  }), ga;
}
var ya, sf;
function Rm() {
  return sf || (sf = 1, ya = _m().extend({
    implicit: [
      Sm(),
      bm(),
      Tm(),
      Cm()
    ]
  })), ya;
}
var va, of;
function Am() {
  return of || (of = 1, va = Rm()), va;
}
var wa, af;
function Pm() {
  if (af) return wa;
  af = 1;
  var e = dt(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), r = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function n(s) {
    return s === null ? !1 : t.exec(s) !== null || r.exec(s) !== null;
  }
  function i(s) {
    var a, c, u, l, f, d, p, g = 0, y = null, m, S, C;
    if (a = t.exec(s), a === null && (a = r.exec(s)), a === null) throw new Error("Date resolve error");
    if (c = +a[1], u = +a[2] - 1, l = +a[3], !a[4])
      return new Date(Date.UTC(c, u, l));
    if (f = +a[4], d = +a[5], p = +a[6], a[7]) {
      for (g = a[7].slice(0, 3); g.length < 3; )
        g += "0";
      g = +g;
    }
    return a[9] && (m = +a[10], S = +(a[11] || 0), y = (m * 60 + S) * 6e4, a[9] === "-" && (y = -y)), C = new Date(Date.UTC(c, u, l, f, d, p, g)), y && C.setTime(C.getTime() - y), C;
  }
  function o(s) {
    return s.toISOString();
  }
  return wa = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: n,
    construct: i,
    instanceOf: Date,
    represent: o
  }), wa;
}
var Ea, cf;
function Im() {
  if (cf) return Ea;
  cf = 1;
  var e = dt();
  function t(r) {
    return r === "<<" || r === null;
  }
  return Ea = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), Ea;
}
var _a, lf;
function Dm() {
  if (lf) return _a;
  lf = 1;
  var e = dt(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(s) {
    if (s === null) return !1;
    var a, c, u = 0, l = s.length, f = t;
    for (c = 0; c < l; c++)
      if (a = f.indexOf(s.charAt(c)), !(a > 64)) {
        if (a < 0) return !1;
        u += 6;
      }
    return u % 8 === 0;
  }
  function n(s) {
    var a, c, u = s.replace(/[\r\n=]/g, ""), l = u.length, f = t, d = 0, p = [];
    for (a = 0; a < l; a++)
      a % 4 === 0 && a && (p.push(d >> 16 & 255), p.push(d >> 8 & 255), p.push(d & 255)), d = d << 6 | f.indexOf(u.charAt(a));
    return c = l % 4 * 6, c === 0 ? (p.push(d >> 16 & 255), p.push(d >> 8 & 255), p.push(d & 255)) : c === 18 ? (p.push(d >> 10 & 255), p.push(d >> 2 & 255)) : c === 12 && p.push(d >> 4 & 255), new Uint8Array(p);
  }
  function i(s) {
    var a = "", c = 0, u, l, f = s.length, d = t;
    for (u = 0; u < f; u++)
      u % 3 === 0 && u && (a += d[c >> 18 & 63], a += d[c >> 12 & 63], a += d[c >> 6 & 63], a += d[c & 63]), c = (c << 8) + s[u];
    return l = f % 3, l === 0 ? (a += d[c >> 18 & 63], a += d[c >> 12 & 63], a += d[c >> 6 & 63], a += d[c & 63]) : l === 2 ? (a += d[c >> 10 & 63], a += d[c >> 4 & 63], a += d[c << 2 & 63], a += d[64]) : l === 1 && (a += d[c >> 2 & 63], a += d[c << 4 & 63], a += d[64], a += d[64]), a;
  }
  function o(s) {
    return Object.prototype.toString.call(s) === "[object Uint8Array]";
  }
  return _a = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: n,
    predicate: o,
    represent: i
  }), _a;
}
var Sa, uf;
function xm() {
  if (uf) return Sa;
  uf = 1;
  var e = dt(), t = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function n(o) {
    if (o === null) return !0;
    var s = [], a, c, u, l, f, d = o;
    for (a = 0, c = d.length; a < c; a += 1) {
      if (u = d[a], f = !1, r.call(u) !== "[object Object]") return !1;
      for (l in u)
        if (t.call(u, l))
          if (!f) f = !0;
          else return !1;
      if (!f) return !1;
      if (s.indexOf(l) === -1) s.push(l);
      else return !1;
    }
    return !0;
  }
  function i(o) {
    return o !== null ? o : [];
  }
  return Sa = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: n,
    construct: i
  }), Sa;
}
var ba, df;
function Nm() {
  if (df) return ba;
  df = 1;
  var e = dt(), t = Object.prototype.toString;
  function r(i) {
    if (i === null) return !0;
    var o, s, a, c, u, l = i;
    for (u = new Array(l.length), o = 0, s = l.length; o < s; o += 1) {
      if (a = l[o], t.call(a) !== "[object Object]" || (c = Object.keys(a), c.length !== 1)) return !1;
      u[o] = [c[0], a[c[0]]];
    }
    return !0;
  }
  function n(i) {
    if (i === null) return [];
    var o, s, a, c, u, l = i;
    for (u = new Array(l.length), o = 0, s = l.length; o < s; o += 1)
      a = l[o], c = Object.keys(a), u[o] = [c[0], a[c[0]]];
    return u;
  }
  return ba = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: n
  }), ba;
}
var Ta, ff;
function Om() {
  if (ff) return Ta;
  ff = 1;
  var e = dt(), t = Object.prototype.hasOwnProperty;
  function r(i) {
    if (i === null) return !0;
    var o, s = i;
    for (o in s)
      if (t.call(s, o) && s[o] !== null)
        return !1;
    return !0;
  }
  function n(i) {
    return i !== null ? i : {};
  }
  return Ta = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: n
  }), Ta;
}
var Ca, hf;
function ll() {
  return hf || (hf = 1, Ca = Am().extend({
    implicit: [
      Pm(),
      Im()
    ],
    explicit: [
      Dm(),
      xm(),
      Nm(),
      Om()
    ]
  })), Ca;
}
var pf;
function l0() {
  if (pf) return Xi;
  pf = 1;
  var e = wi(), t = Ei(), r = c0(), n = ll(), i = Object.prototype.hasOwnProperty, o = 1, s = 2, a = 3, c = 4, u = 1, l = 2, f = 3, d = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, p = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, y = /^(?:!|!!|![a-z\-]+!)$/i, m = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function S(h) {
    return Object.prototype.toString.call(h);
  }
  function C(h) {
    return h === 10 || h === 13;
  }
  function A(h) {
    return h === 9 || h === 32;
  }
  function x(h) {
    return h === 9 || h === 32 || h === 10 || h === 13;
  }
  function w(h) {
    return h === 44 || h === 91 || h === 93 || h === 123 || h === 125;
  }
  function E(h) {
    var H;
    return 48 <= h && h <= 57 ? h - 48 : (H = h | 32, 97 <= H && H <= 102 ? H - 97 + 10 : -1);
  }
  function b(h) {
    return h === 120 ? 2 : h === 117 ? 4 : h === 85 ? 8 : 0;
  }
  function v(h) {
    return 48 <= h && h <= 57 ? h - 48 : -1;
  }
  function P(h) {
    return h === 48 ? "\0" : h === 97 ? "\x07" : h === 98 ? "\b" : h === 116 || h === 9 ? "	" : h === 110 ? `
` : h === 118 ? "\v" : h === 102 ? "\f" : h === 114 ? "\r" : h === 101 ? "\x1B" : h === 32 ? " " : h === 34 ? '"' : h === 47 ? "/" : h === 92 ? "\\" : h === 78 ? "" : h === 95 ? " " : h === 76 ? "\u2028" : h === 80 ? "\u2029" : "";
  }
  function T(h) {
    return h <= 65535 ? String.fromCharCode(h) : String.fromCharCode(
      (h - 65536 >> 10) + 55296,
      (h - 65536 & 1023) + 56320
    );
  }
  function U(h, H, V) {
    H === "__proto__" ? Object.defineProperty(h, H, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: V
    }) : h[H] = V;
  }
  for (var k = new Array(256), M = new Array(256), N = 0; N < 256; N++)
    k[N] = P(N) ? 1 : 0, M[N] = P(N);
  function F(h, H) {
    this.input = h, this.filename = H.filename || null, this.schema = H.schema || n, this.onWarning = H.onWarning || null, this.legacy = H.legacy || !1, this.json = H.json || !1, this.listener = H.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = h.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function $(h, H) {
    var V = {
      name: h.filename,
      buffer: h.input.slice(0, -1),
      // omit trailing \0
      position: h.position,
      line: h.line,
      column: h.position - h.lineStart
    };
    return V.snippet = r(V), new t(H, V);
  }
  function O(h, H) {
    throw $(h, H);
  }
  function G(h, H) {
    h.onWarning && h.onWarning.call(null, $(h, H));
  }
  var Y = {
    YAML: function(H, V, ce) {
      var K, ae, se;
      H.version !== null && O(H, "duplication of %YAML directive"), ce.length !== 1 && O(H, "YAML directive accepts exactly one argument"), K = /^([0-9]+)\.([0-9]+)$/.exec(ce[0]), K === null && O(H, "ill-formed argument of the YAML directive"), ae = parseInt(K[1], 10), se = parseInt(K[2], 10), ae !== 1 && O(H, "unacceptable YAML version of the document"), H.version = ce[0], H.checkLineBreaks = se < 2, se !== 1 && se !== 2 && G(H, "unsupported YAML version of the document");
    },
    TAG: function(H, V, ce) {
      var K, ae;
      ce.length !== 2 && O(H, "TAG directive accepts exactly two arguments"), K = ce[0], ae = ce[1], y.test(K) || O(H, "ill-formed tag handle (first argument) of the TAG directive"), i.call(H.tagMap, K) && O(H, 'there is a previously declared suffix for "' + K + '" tag handle'), m.test(ae) || O(H, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        ae = decodeURIComponent(ae);
      } catch {
        O(H, "tag prefix is malformed: " + ae);
      }
      H.tagMap[K] = ae;
    }
  };
  function ie(h, H, V, ce) {
    var K, ae, se, fe;
    if (H < V) {
      if (fe = h.input.slice(H, V), ce)
        for (K = 0, ae = fe.length; K < ae; K += 1)
          se = fe.charCodeAt(K), se === 9 || 32 <= se && se <= 1114111 || O(h, "expected valid JSON character");
      else d.test(fe) && O(h, "the stream contains non-printable characters");
      h.result += fe;
    }
  }
  function we(h, H, V, ce) {
    var K, ae, se, fe;
    for (e.isObject(V) || O(h, "cannot merge mappings; the provided source object is unacceptable"), K = Object.keys(V), se = 0, fe = K.length; se < fe; se += 1)
      ae = K[se], i.call(H, ae) || (U(H, ae, V[ae]), ce[ae] = !0);
  }
  function ne(h, H, V, ce, K, ae, se, fe, pe) {
    var Ce, Ee;
    if (Array.isArray(K))
      for (K = Array.prototype.slice.call(K), Ce = 0, Ee = K.length; Ce < Ee; Ce += 1)
        Array.isArray(K[Ce]) && O(h, "nested arrays are not supported inside keys"), typeof K == "object" && S(K[Ce]) === "[object Object]" && (K[Ce] = "[object Object]");
    if (typeof K == "object" && S(K) === "[object Object]" && (K = "[object Object]"), K = String(K), H === null && (H = {}), ce === "tag:yaml.org,2002:merge")
      if (Array.isArray(ae))
        for (Ce = 0, Ee = ae.length; Ce < Ee; Ce += 1)
          we(h, H, ae[Ce], V);
      else
        we(h, H, ae, V);
    else
      !h.json && !i.call(V, K) && i.call(H, K) && (h.line = se || h.line, h.lineStart = fe || h.lineStart, h.position = pe || h.position, O(h, "duplicated mapping key")), U(H, K, ae), delete V[K];
    return H;
  }
  function Ie(h) {
    var H;
    H = h.input.charCodeAt(h.position), H === 10 ? h.position++ : H === 13 ? (h.position++, h.input.charCodeAt(h.position) === 10 && h.position++) : O(h, "a line break is expected"), h.line += 1, h.lineStart = h.position, h.firstTabInLine = -1;
  }
  function Re(h, H, V) {
    for (var ce = 0, K = h.input.charCodeAt(h.position); K !== 0; ) {
      for (; A(K); )
        K === 9 && h.firstTabInLine === -1 && (h.firstTabInLine = h.position), K = h.input.charCodeAt(++h.position);
      if (H && K === 35)
        do
          K = h.input.charCodeAt(++h.position);
        while (K !== 10 && K !== 13 && K !== 0);
      if (C(K))
        for (Ie(h), K = h.input.charCodeAt(h.position), ce++, h.lineIndent = 0; K === 32; )
          h.lineIndent++, K = h.input.charCodeAt(++h.position);
      else
        break;
    }
    return V !== -1 && ce !== 0 && h.lineIndent < V && G(h, "deficient indentation"), ce;
  }
  function te(h) {
    var H = h.position, V;
    return V = h.input.charCodeAt(H), !!((V === 45 || V === 46) && V === h.input.charCodeAt(H + 1) && V === h.input.charCodeAt(H + 2) && (H += 3, V = h.input.charCodeAt(H), V === 0 || x(V)));
  }
  function Se(h, H) {
    H === 1 ? h.result += " " : H > 1 && (h.result += e.repeat(`
`, H - 1));
  }
  function De(h, H, V) {
    var ce, K, ae, se, fe, pe, Ce, Ee, ge = h.kind, I = h.result, j;
    if (j = h.input.charCodeAt(h.position), x(j) || w(j) || j === 35 || j === 38 || j === 42 || j === 33 || j === 124 || j === 62 || j === 39 || j === 34 || j === 37 || j === 64 || j === 96 || (j === 63 || j === 45) && (K = h.input.charCodeAt(h.position + 1), x(K) || V && w(K)))
      return !1;
    for (h.kind = "scalar", h.result = "", ae = se = h.position, fe = !1; j !== 0; ) {
      if (j === 58) {
        if (K = h.input.charCodeAt(h.position + 1), x(K) || V && w(K))
          break;
      } else if (j === 35) {
        if (ce = h.input.charCodeAt(h.position - 1), x(ce))
          break;
      } else {
        if (h.position === h.lineStart && te(h) || V && w(j))
          break;
        if (C(j))
          if (pe = h.line, Ce = h.lineStart, Ee = h.lineIndent, Re(h, !1, -1), h.lineIndent >= H) {
            fe = !0, j = h.input.charCodeAt(h.position);
            continue;
          } else {
            h.position = se, h.line = pe, h.lineStart = Ce, h.lineIndent = Ee;
            break;
          }
      }
      fe && (ie(h, ae, se, !1), Se(h, h.line - pe), ae = se = h.position, fe = !1), A(j) || (se = h.position + 1), j = h.input.charCodeAt(++h.position);
    }
    return ie(h, ae, se, !1), h.result ? !0 : (h.kind = ge, h.result = I, !1);
  }
  function Ue(h, H) {
    var V, ce, K;
    if (V = h.input.charCodeAt(h.position), V !== 39)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, ce = K = h.position; (V = h.input.charCodeAt(h.position)) !== 0; )
      if (V === 39)
        if (ie(h, ce, h.position, !0), V = h.input.charCodeAt(++h.position), V === 39)
          ce = h.position, h.position++, K = h.position;
        else
          return !0;
      else C(V) ? (ie(h, ce, K, !0), Se(h, Re(h, !1, H)), ce = K = h.position) : h.position === h.lineStart && te(h) ? O(h, "unexpected end of the document within a single quoted scalar") : (h.position++, K = h.position);
    O(h, "unexpected end of the stream within a single quoted scalar");
  }
  function We(h, H) {
    var V, ce, K, ae, se, fe;
    if (fe = h.input.charCodeAt(h.position), fe !== 34)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, V = ce = h.position; (fe = h.input.charCodeAt(h.position)) !== 0; ) {
      if (fe === 34)
        return ie(h, V, h.position, !0), h.position++, !0;
      if (fe === 92) {
        if (ie(h, V, h.position, !0), fe = h.input.charCodeAt(++h.position), C(fe))
          Re(h, !1, H);
        else if (fe < 256 && k[fe])
          h.result += M[fe], h.position++;
        else if ((se = b(fe)) > 0) {
          for (K = se, ae = 0; K > 0; K--)
            fe = h.input.charCodeAt(++h.position), (se = E(fe)) >= 0 ? ae = (ae << 4) + se : O(h, "expected hexadecimal character");
          h.result += T(ae), h.position++;
        } else
          O(h, "unknown escape sequence");
        V = ce = h.position;
      } else C(fe) ? (ie(h, V, ce, !0), Se(h, Re(h, !1, H)), V = ce = h.position) : h.position === h.lineStart && te(h) ? O(h, "unexpected end of the document within a double quoted scalar") : (h.position++, ce = h.position);
    }
    O(h, "unexpected end of the stream within a double quoted scalar");
  }
  function Be(h, H) {
    var V = !0, ce, K, ae, se = h.tag, fe, pe = h.anchor, Ce, Ee, ge, I, j, Z = /* @__PURE__ */ Object.create(null), X, ee, he, oe;
    if (oe = h.input.charCodeAt(h.position), oe === 91)
      Ee = 93, j = !1, fe = [];
    else if (oe === 123)
      Ee = 125, j = !0, fe = {};
    else
      return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = fe), oe = h.input.charCodeAt(++h.position); oe !== 0; ) {
      if (Re(h, !0, H), oe = h.input.charCodeAt(h.position), oe === Ee)
        return h.position++, h.tag = se, h.anchor = pe, h.kind = j ? "mapping" : "sequence", h.result = fe, !0;
      V ? oe === 44 && O(h, "expected the node content, but found ','") : O(h, "missed comma between flow collection entries"), ee = X = he = null, ge = I = !1, oe === 63 && (Ce = h.input.charCodeAt(h.position + 1), x(Ce) && (ge = I = !0, h.position++, Re(h, !0, H))), ce = h.line, K = h.lineStart, ae = h.position, W(h, H, o, !1, !0), ee = h.tag, X = h.result, Re(h, !0, H), oe = h.input.charCodeAt(h.position), (I || h.line === ce) && oe === 58 && (ge = !0, oe = h.input.charCodeAt(++h.position), Re(h, !0, H), W(h, H, o, !1, !0), he = h.result), j ? ne(h, fe, Z, ee, X, he, ce, K, ae) : ge ? fe.push(ne(h, null, Z, ee, X, he, ce, K, ae)) : fe.push(X), Re(h, !0, H), oe = h.input.charCodeAt(h.position), oe === 44 ? (V = !0, oe = h.input.charCodeAt(++h.position)) : V = !1;
    }
    O(h, "unexpected end of the stream within a flow collection");
  }
  function Fe(h, H) {
    var V, ce, K = u, ae = !1, se = !1, fe = H, pe = 0, Ce = !1, Ee, ge;
    if (ge = h.input.charCodeAt(h.position), ge === 124)
      ce = !1;
    else if (ge === 62)
      ce = !0;
    else
      return !1;
    for (h.kind = "scalar", h.result = ""; ge !== 0; )
      if (ge = h.input.charCodeAt(++h.position), ge === 43 || ge === 45)
        u === K ? K = ge === 43 ? f : l : O(h, "repeat of a chomping mode identifier");
      else if ((Ee = v(ge)) >= 0)
        Ee === 0 ? O(h, "bad explicit indentation width of a block scalar; it cannot be less than one") : se ? O(h, "repeat of an indentation width identifier") : (fe = H + Ee - 1, se = !0);
      else
        break;
    if (A(ge)) {
      do
        ge = h.input.charCodeAt(++h.position);
      while (A(ge));
      if (ge === 35)
        do
          ge = h.input.charCodeAt(++h.position);
        while (!C(ge) && ge !== 0);
    }
    for (; ge !== 0; ) {
      for (Ie(h), h.lineIndent = 0, ge = h.input.charCodeAt(h.position); (!se || h.lineIndent < fe) && ge === 32; )
        h.lineIndent++, ge = h.input.charCodeAt(++h.position);
      if (!se && h.lineIndent > fe && (fe = h.lineIndent), C(ge)) {
        pe++;
        continue;
      }
      if (h.lineIndent < fe) {
        K === f ? h.result += e.repeat(`
`, ae ? 1 + pe : pe) : K === u && ae && (h.result += `
`);
        break;
      }
      for (ce ? A(ge) ? (Ce = !0, h.result += e.repeat(`
`, ae ? 1 + pe : pe)) : Ce ? (Ce = !1, h.result += e.repeat(`
`, pe + 1)) : pe === 0 ? ae && (h.result += " ") : h.result += e.repeat(`
`, pe) : h.result += e.repeat(`
`, ae ? 1 + pe : pe), ae = !0, se = !0, pe = 0, V = h.position; !C(ge) && ge !== 0; )
        ge = h.input.charCodeAt(++h.position);
      ie(h, V, h.position, !1);
    }
    return !0;
  }
  function R(h, H) {
    var V, ce = h.tag, K = h.anchor, ae = [], se, fe = !1, pe;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = ae), pe = h.input.charCodeAt(h.position); pe !== 0 && (h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, O(h, "tab characters must not be used in indentation")), !(pe !== 45 || (se = h.input.charCodeAt(h.position + 1), !x(se)))); ) {
      if (fe = !0, h.position++, Re(h, !0, -1) && h.lineIndent <= H) {
        ae.push(null), pe = h.input.charCodeAt(h.position);
        continue;
      }
      if (V = h.line, W(h, H, a, !1, !0), ae.push(h.result), Re(h, !0, -1), pe = h.input.charCodeAt(h.position), (h.line === V || h.lineIndent > H) && pe !== 0)
        O(h, "bad indentation of a sequence entry");
      else if (h.lineIndent < H)
        break;
    }
    return fe ? (h.tag = ce, h.anchor = K, h.kind = "sequence", h.result = ae, !0) : !1;
  }
  function _(h, H, V) {
    var ce, K, ae, se, fe, pe, Ce = h.tag, Ee = h.anchor, ge = {}, I = /* @__PURE__ */ Object.create(null), j = null, Z = null, X = null, ee = !1, he = !1, oe;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = ge), oe = h.input.charCodeAt(h.position); oe !== 0; ) {
      if (!ee && h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, O(h, "tab characters must not be used in indentation")), ce = h.input.charCodeAt(h.position + 1), ae = h.line, (oe === 63 || oe === 58) && x(ce))
        oe === 63 ? (ee && (ne(h, ge, I, j, Z, null, se, fe, pe), j = Z = X = null), he = !0, ee = !0, K = !0) : ee ? (ee = !1, K = !0) : O(h, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), h.position += 1, oe = ce;
      else {
        if (se = h.line, fe = h.lineStart, pe = h.position, !W(h, V, s, !1, !0))
          break;
        if (h.line === ae) {
          for (oe = h.input.charCodeAt(h.position); A(oe); )
            oe = h.input.charCodeAt(++h.position);
          if (oe === 58)
            oe = h.input.charCodeAt(++h.position), x(oe) || O(h, "a whitespace character is expected after the key-value separator within a block mapping"), ee && (ne(h, ge, I, j, Z, null, se, fe, pe), j = Z = X = null), he = !0, ee = !1, K = !1, j = h.tag, Z = h.result;
          else if (he)
            O(h, "can not read an implicit mapping pair; a colon is missed");
          else
            return h.tag = Ce, h.anchor = Ee, !0;
        } else if (he)
          O(h, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return h.tag = Ce, h.anchor = Ee, !0;
      }
      if ((h.line === ae || h.lineIndent > H) && (ee && (se = h.line, fe = h.lineStart, pe = h.position), W(h, H, c, !0, K) && (ee ? Z = h.result : X = h.result), ee || (ne(h, ge, I, j, Z, X, se, fe, pe), j = Z = X = null), Re(h, !0, -1), oe = h.input.charCodeAt(h.position)), (h.line === ae || h.lineIndent > H) && oe !== 0)
        O(h, "bad indentation of a mapping entry");
      else if (h.lineIndent < H)
        break;
    }
    return ee && ne(h, ge, I, j, Z, null, se, fe, pe), he && (h.tag = Ce, h.anchor = Ee, h.kind = "mapping", h.result = ge), he;
  }
  function q(h) {
    var H, V = !1, ce = !1, K, ae, se;
    if (se = h.input.charCodeAt(h.position), se !== 33) return !1;
    if (h.tag !== null && O(h, "duplication of a tag property"), se = h.input.charCodeAt(++h.position), se === 60 ? (V = !0, se = h.input.charCodeAt(++h.position)) : se === 33 ? (ce = !0, K = "!!", se = h.input.charCodeAt(++h.position)) : K = "!", H = h.position, V) {
      do
        se = h.input.charCodeAt(++h.position);
      while (se !== 0 && se !== 62);
      h.position < h.length ? (ae = h.input.slice(H, h.position), se = h.input.charCodeAt(++h.position)) : O(h, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; se !== 0 && !x(se); )
        se === 33 && (ce ? O(h, "tag suffix cannot contain exclamation marks") : (K = h.input.slice(H - 1, h.position + 1), y.test(K) || O(h, "named tag handle cannot contain such characters"), ce = !0, H = h.position + 1)), se = h.input.charCodeAt(++h.position);
      ae = h.input.slice(H, h.position), g.test(ae) && O(h, "tag suffix cannot contain flow indicator characters");
    }
    ae && !m.test(ae) && O(h, "tag name cannot contain such characters: " + ae);
    try {
      ae = decodeURIComponent(ae);
    } catch {
      O(h, "tag name is malformed: " + ae);
    }
    return V ? h.tag = ae : i.call(h.tagMap, K) ? h.tag = h.tagMap[K] + ae : K === "!" ? h.tag = "!" + ae : K === "!!" ? h.tag = "tag:yaml.org,2002:" + ae : O(h, 'undeclared tag handle "' + K + '"'), !0;
  }
  function L(h) {
    var H, V;
    if (V = h.input.charCodeAt(h.position), V !== 38) return !1;
    for (h.anchor !== null && O(h, "duplication of an anchor property"), V = h.input.charCodeAt(++h.position), H = h.position; V !== 0 && !x(V) && !w(V); )
      V = h.input.charCodeAt(++h.position);
    return h.position === H && O(h, "name of an anchor node must contain at least one character"), h.anchor = h.input.slice(H, h.position), !0;
  }
  function Ne(h) {
    var H, V, ce;
    if (ce = h.input.charCodeAt(h.position), ce !== 42) return !1;
    for (ce = h.input.charCodeAt(++h.position), H = h.position; ce !== 0 && !x(ce) && !w(ce); )
      ce = h.input.charCodeAt(++h.position);
    return h.position === H && O(h, "name of an alias node must contain at least one character"), V = h.input.slice(H, h.position), i.call(h.anchorMap, V) || O(h, 'unidentified alias "' + V + '"'), h.result = h.anchorMap[V], Re(h, !0, -1), !0;
  }
  function W(h, H, V, ce, K) {
    var ae, se, fe, pe = 1, Ce = !1, Ee = !1, ge, I, j, Z, X, ee;
    if (h.listener !== null && h.listener("open", h), h.tag = null, h.anchor = null, h.kind = null, h.result = null, ae = se = fe = c === V || a === V, ce && Re(h, !0, -1) && (Ce = !0, h.lineIndent > H ? pe = 1 : h.lineIndent === H ? pe = 0 : h.lineIndent < H && (pe = -1)), pe === 1)
      for (; q(h) || L(h); )
        Re(h, !0, -1) ? (Ce = !0, fe = ae, h.lineIndent > H ? pe = 1 : h.lineIndent === H ? pe = 0 : h.lineIndent < H && (pe = -1)) : fe = !1;
    if (fe && (fe = Ce || K), (pe === 1 || c === V) && (o === V || s === V ? X = H : X = H + 1, ee = h.position - h.lineStart, pe === 1 ? fe && (R(h, ee) || _(h, ee, X)) || Be(h, X) ? Ee = !0 : (se && Fe(h, X) || Ue(h, X) || We(h, X) ? Ee = !0 : Ne(h) ? (Ee = !0, (h.tag !== null || h.anchor !== null) && O(h, "alias node should not have any properties")) : De(h, X, o === V) && (Ee = !0, h.tag === null && (h.tag = "?")), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : pe === 0 && (Ee = fe && R(h, ee))), h.tag === null)
      h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
    else if (h.tag === "?") {
      for (h.result !== null && h.kind !== "scalar" && O(h, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + h.kind + '"'), ge = 0, I = h.implicitTypes.length; ge < I; ge += 1)
        if (Z = h.implicitTypes[ge], Z.resolve(h.result)) {
          h.result = Z.construct(h.result), h.tag = Z.tag, h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
          break;
        }
    } else if (h.tag !== "!") {
      if (i.call(h.typeMap[h.kind || "fallback"], h.tag))
        Z = h.typeMap[h.kind || "fallback"][h.tag];
      else
        for (Z = null, j = h.typeMap.multi[h.kind || "fallback"], ge = 0, I = j.length; ge < I; ge += 1)
          if (h.tag.slice(0, j[ge].tag.length) === j[ge].tag) {
            Z = j[ge];
            break;
          }
      Z || O(h, "unknown tag !<" + h.tag + ">"), h.result !== null && Z.kind !== h.kind && O(h, "unacceptable node kind for !<" + h.tag + '> tag; it should be "' + Z.kind + '", not "' + h.kind + '"'), Z.resolve(h.result, h.tag) ? (h.result = Z.construct(h.result, h.tag), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : O(h, "cannot resolve a node with !<" + h.tag + "> explicit tag");
    }
    return h.listener !== null && h.listener("close", h), h.tag !== null || h.anchor !== null || Ee;
  }
  function z(h) {
    var H = h.position, V, ce, K, ae = !1, se;
    for (h.version = null, h.checkLineBreaks = h.legacy, h.tagMap = /* @__PURE__ */ Object.create(null), h.anchorMap = /* @__PURE__ */ Object.create(null); (se = h.input.charCodeAt(h.position)) !== 0 && (Re(h, !0, -1), se = h.input.charCodeAt(h.position), !(h.lineIndent > 0 || se !== 37)); ) {
      for (ae = !0, se = h.input.charCodeAt(++h.position), V = h.position; se !== 0 && !x(se); )
        se = h.input.charCodeAt(++h.position);
      for (ce = h.input.slice(V, h.position), K = [], ce.length < 1 && O(h, "directive name must not be less than one character in length"); se !== 0; ) {
        for (; A(se); )
          se = h.input.charCodeAt(++h.position);
        if (se === 35) {
          do
            se = h.input.charCodeAt(++h.position);
          while (se !== 0 && !C(se));
          break;
        }
        if (C(se)) break;
        for (V = h.position; se !== 0 && !x(se); )
          se = h.input.charCodeAt(++h.position);
        K.push(h.input.slice(V, h.position));
      }
      se !== 0 && Ie(h), i.call(Y, ce) ? Y[ce](h, ce, K) : G(h, 'unknown document directive "' + ce + '"');
    }
    if (Re(h, !0, -1), h.lineIndent === 0 && h.input.charCodeAt(h.position) === 45 && h.input.charCodeAt(h.position + 1) === 45 && h.input.charCodeAt(h.position + 2) === 45 ? (h.position += 3, Re(h, !0, -1)) : ae && O(h, "directives end mark is expected"), W(h, h.lineIndent - 1, c, !1, !0), Re(h, !0, -1), h.checkLineBreaks && p.test(h.input.slice(H, h.position)) && G(h, "non-ASCII line breaks are interpreted as content"), h.documents.push(h.result), h.position === h.lineStart && te(h)) {
      h.input.charCodeAt(h.position) === 46 && (h.position += 3, Re(h, !0, -1));
      return;
    }
    if (h.position < h.length - 1)
      O(h, "end of the stream or a document separator is expected");
    else
      return;
  }
  function ue(h, H) {
    h = String(h), H = H || {}, h.length !== 0 && (h.charCodeAt(h.length - 1) !== 10 && h.charCodeAt(h.length - 1) !== 13 && (h += `
`), h.charCodeAt(0) === 65279 && (h = h.slice(1)));
    var V = new F(h, H), ce = h.indexOf("\0");
    for (ce !== -1 && (V.position = ce, O(V, "null byte is not allowed in input")), V.input += "\0"; V.input.charCodeAt(V.position) === 32; )
      V.lineIndent += 1, V.position += 1;
    for (; V.position < V.length - 1; )
      z(V);
    return V.documents;
  }
  function ye(h, H, V) {
    H !== null && typeof H == "object" && typeof V > "u" && (V = H, H = null);
    var ce = ue(h, V);
    if (typeof H != "function")
      return ce;
    for (var K = 0, ae = ce.length; K < ae; K += 1)
      H(ce[K]);
  }
  function de(h, H) {
    var V = ue(h, H);
    if (V.length !== 0) {
      if (V.length === 1)
        return V[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return Xi.loadAll = ye, Xi.load = de, Xi;
}
var Ra = {}, mf;
function u0() {
  if (mf) return Ra;
  mf = 1;
  var e = wi(), t = Ei(), r = ll(), n = Object.prototype.toString, i = Object.prototype.hasOwnProperty, o = 65279, s = 9, a = 10, c = 13, u = 32, l = 33, f = 34, d = 35, p = 37, g = 38, y = 39, m = 42, S = 44, C = 45, A = 58, x = 61, w = 62, E = 63, b = 64, v = 91, P = 93, T = 96, U = 123, k = 124, M = 125, N = {};
  N[0] = "\\0", N[7] = "\\a", N[8] = "\\b", N[9] = "\\t", N[10] = "\\n", N[11] = "\\v", N[12] = "\\f", N[13] = "\\r", N[27] = "\\e", N[34] = '\\"', N[92] = "\\\\", N[133] = "\\N", N[160] = "\\_", N[8232] = "\\L", N[8233] = "\\P";
  var F = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], $ = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function O(I, j) {
    var Z, X, ee, he, oe, me, be;
    if (j === null) return {};
    for (Z = {}, X = Object.keys(j), ee = 0, he = X.length; ee < he; ee += 1)
      oe = X[ee], me = String(j[oe]), oe.slice(0, 2) === "!!" && (oe = "tag:yaml.org,2002:" + oe.slice(2)), be = I.compiledTypeMap.fallback[oe], be && i.call(be.styleAliases, me) && (me = be.styleAliases[me]), Z[oe] = me;
    return Z;
  }
  function G(I) {
    var j, Z, X;
    if (j = I.toString(16).toUpperCase(), I <= 255)
      Z = "x", X = 2;
    else if (I <= 65535)
      Z = "u", X = 4;
    else if (I <= 4294967295)
      Z = "U", X = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + Z + e.repeat("0", X - j.length) + j;
  }
  var Y = 1, ie = 2;
  function we(I) {
    this.schema = I.schema || r, this.indent = Math.max(1, I.indent || 2), this.noArrayIndent = I.noArrayIndent || !1, this.skipInvalid = I.skipInvalid || !1, this.flowLevel = e.isNothing(I.flowLevel) ? -1 : I.flowLevel, this.styleMap = O(this.schema, I.styles || null), this.sortKeys = I.sortKeys || !1, this.lineWidth = I.lineWidth || 80, this.noRefs = I.noRefs || !1, this.noCompatMode = I.noCompatMode || !1, this.condenseFlow = I.condenseFlow || !1, this.quotingType = I.quotingType === '"' ? ie : Y, this.forceQuotes = I.forceQuotes || !1, this.replacer = typeof I.replacer == "function" ? I.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function ne(I, j) {
    for (var Z = e.repeat(" ", j), X = 0, ee = -1, he = "", oe, me = I.length; X < me; )
      ee = I.indexOf(`
`, X), ee === -1 ? (oe = I.slice(X), X = me) : (oe = I.slice(X, ee + 1), X = ee + 1), oe.length && oe !== `
` && (he += Z), he += oe;
    return he;
  }
  function Ie(I, j) {
    return `
` + e.repeat(" ", I.indent * j);
  }
  function Re(I, j) {
    var Z, X, ee;
    for (Z = 0, X = I.implicitTypes.length; Z < X; Z += 1)
      if (ee = I.implicitTypes[Z], ee.resolve(j))
        return !0;
    return !1;
  }
  function te(I) {
    return I === u || I === s;
  }
  function Se(I) {
    return 32 <= I && I <= 126 || 161 <= I && I <= 55295 && I !== 8232 && I !== 8233 || 57344 <= I && I <= 65533 && I !== o || 65536 <= I && I <= 1114111;
  }
  function De(I) {
    return Se(I) && I !== o && I !== c && I !== a;
  }
  function Ue(I, j, Z) {
    var X = De(I), ee = X && !te(I);
    return (
      // ns-plain-safe
      (Z ? (
        // c = flow-in
        X
      ) : X && I !== S && I !== v && I !== P && I !== U && I !== M) && I !== d && !(j === A && !ee) || De(j) && !te(j) && I === d || j === A && ee
    );
  }
  function We(I) {
    return Se(I) && I !== o && !te(I) && I !== C && I !== E && I !== A && I !== S && I !== v && I !== P && I !== U && I !== M && I !== d && I !== g && I !== m && I !== l && I !== k && I !== x && I !== w && I !== y && I !== f && I !== p && I !== b && I !== T;
  }
  function Be(I) {
    return !te(I) && I !== A;
  }
  function Fe(I, j) {
    var Z = I.charCodeAt(j), X;
    return Z >= 55296 && Z <= 56319 && j + 1 < I.length && (X = I.charCodeAt(j + 1), X >= 56320 && X <= 57343) ? (Z - 55296) * 1024 + X - 56320 + 65536 : Z;
  }
  function R(I) {
    var j = /^\n* /;
    return j.test(I);
  }
  var _ = 1, q = 2, L = 3, Ne = 4, W = 5;
  function z(I, j, Z, X, ee, he, oe, me) {
    var be, Ae = 0, je = null, Xe = !1, qe = !1, Br = X !== -1, It = -1, wr = We(Fe(I, 0)) && Be(Fe(I, I.length - 1));
    if (j || oe)
      for (be = 0; be < I.length; Ae >= 65536 ? be += 2 : be++) {
        if (Ae = Fe(I, be), !Se(Ae))
          return W;
        wr = wr && Ue(Ae, je, me), je = Ae;
      }
    else {
      for (be = 0; be < I.length; Ae >= 65536 ? be += 2 : be++) {
        if (Ae = Fe(I, be), Ae === a)
          Xe = !0, Br && (qe = qe || // Foldable line = too long, and not more-indented.
          be - It - 1 > X && I[It + 1] !== " ", It = be);
        else if (!Se(Ae))
          return W;
        wr = wr && Ue(Ae, je, me), je = Ae;
      }
      qe = qe || Br && be - It - 1 > X && I[It + 1] !== " ";
    }
    return !Xe && !qe ? wr && !oe && !ee(I) ? _ : he === ie ? W : q : Z > 9 && R(I) ? W : oe ? he === ie ? W : q : qe ? Ne : L;
  }
  function ue(I, j, Z, X, ee) {
    I.dump = (function() {
      if (j.length === 0)
        return I.quotingType === ie ? '""' : "''";
      if (!I.noCompatMode && (F.indexOf(j) !== -1 || $.test(j)))
        return I.quotingType === ie ? '"' + j + '"' : "'" + j + "'";
      var he = I.indent * Math.max(1, Z), oe = I.lineWidth === -1 ? -1 : Math.max(Math.min(I.lineWidth, 40), I.lineWidth - he), me = X || I.flowLevel > -1 && Z >= I.flowLevel;
      function be(Ae) {
        return Re(I, Ae);
      }
      switch (z(
        j,
        me,
        I.indent,
        oe,
        be,
        I.quotingType,
        I.forceQuotes && !X,
        ee
      )) {
        case _:
          return j;
        case q:
          return "'" + j.replace(/'/g, "''") + "'";
        case L:
          return "|" + ye(j, I.indent) + de(ne(j, he));
        case Ne:
          return ">" + ye(j, I.indent) + de(ne(h(j, oe), he));
        case W:
          return '"' + V(j) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  function ye(I, j) {
    var Z = R(I) ? String(j) : "", X = I[I.length - 1] === `
`, ee = X && (I[I.length - 2] === `
` || I === `
`), he = ee ? "+" : X ? "" : "-";
    return Z + he + `
`;
  }
  function de(I) {
    return I[I.length - 1] === `
` ? I.slice(0, -1) : I;
  }
  function h(I, j) {
    for (var Z = /(\n+)([^\n]*)/g, X = (function() {
      var Ae = I.indexOf(`
`);
      return Ae = Ae !== -1 ? Ae : I.length, Z.lastIndex = Ae, H(I.slice(0, Ae), j);
    })(), ee = I[0] === `
` || I[0] === " ", he, oe; oe = Z.exec(I); ) {
      var me = oe[1], be = oe[2];
      he = be[0] === " ", X += me + (!ee && !he && be !== "" ? `
` : "") + H(be, j), ee = he;
    }
    return X;
  }
  function H(I, j) {
    if (I === "" || I[0] === " ") return I;
    for (var Z = / [^ ]/g, X, ee = 0, he, oe = 0, me = 0, be = ""; X = Z.exec(I); )
      me = X.index, me - ee > j && (he = oe > ee ? oe : me, be += `
` + I.slice(ee, he), ee = he + 1), oe = me;
    return be += `
`, I.length - ee > j && oe > ee ? be += I.slice(ee, oe) + `
` + I.slice(oe + 1) : be += I.slice(ee), be.slice(1);
  }
  function V(I) {
    for (var j = "", Z = 0, X, ee = 0; ee < I.length; Z >= 65536 ? ee += 2 : ee++)
      Z = Fe(I, ee), X = N[Z], !X && Se(Z) ? (j += I[ee], Z >= 65536 && (j += I[ee + 1])) : j += X || G(Z);
    return j;
  }
  function ce(I, j, Z) {
    var X = "", ee = I.tag, he, oe, me;
    for (he = 0, oe = Z.length; he < oe; he += 1)
      me = Z[he], I.replacer && (me = I.replacer.call(Z, String(he), me)), (pe(I, j, me, !1, !1) || typeof me > "u" && pe(I, j, null, !1, !1)) && (X !== "" && (X += "," + (I.condenseFlow ? "" : " ")), X += I.dump);
    I.tag = ee, I.dump = "[" + X + "]";
  }
  function K(I, j, Z, X) {
    var ee = "", he = I.tag, oe, me, be;
    for (oe = 0, me = Z.length; oe < me; oe += 1)
      be = Z[oe], I.replacer && (be = I.replacer.call(Z, String(oe), be)), (pe(I, j + 1, be, !0, !0, !1, !0) || typeof be > "u" && pe(I, j + 1, null, !0, !0, !1, !0)) && ((!X || ee !== "") && (ee += Ie(I, j)), I.dump && a === I.dump.charCodeAt(0) ? ee += "-" : ee += "- ", ee += I.dump);
    I.tag = he, I.dump = ee || "[]";
  }
  function ae(I, j, Z) {
    var X = "", ee = I.tag, he = Object.keys(Z), oe, me, be, Ae, je;
    for (oe = 0, me = he.length; oe < me; oe += 1)
      je = "", X !== "" && (je += ", "), I.condenseFlow && (je += '"'), be = he[oe], Ae = Z[be], I.replacer && (Ae = I.replacer.call(Z, be, Ae)), pe(I, j, be, !1, !1) && (I.dump.length > 1024 && (je += "? "), je += I.dump + (I.condenseFlow ? '"' : "") + ":" + (I.condenseFlow ? "" : " "), pe(I, j, Ae, !1, !1) && (je += I.dump, X += je));
    I.tag = ee, I.dump = "{" + X + "}";
  }
  function se(I, j, Z, X) {
    var ee = "", he = I.tag, oe = Object.keys(Z), me, be, Ae, je, Xe, qe;
    if (I.sortKeys === !0)
      oe.sort();
    else if (typeof I.sortKeys == "function")
      oe.sort(I.sortKeys);
    else if (I.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (me = 0, be = oe.length; me < be; me += 1)
      qe = "", (!X || ee !== "") && (qe += Ie(I, j)), Ae = oe[me], je = Z[Ae], I.replacer && (je = I.replacer.call(Z, Ae, je)), pe(I, j + 1, Ae, !0, !0, !0) && (Xe = I.tag !== null && I.tag !== "?" || I.dump && I.dump.length > 1024, Xe && (I.dump && a === I.dump.charCodeAt(0) ? qe += "?" : qe += "? "), qe += I.dump, Xe && (qe += Ie(I, j)), pe(I, j + 1, je, !0, Xe) && (I.dump && a === I.dump.charCodeAt(0) ? qe += ":" : qe += ": ", qe += I.dump, ee += qe));
    I.tag = he, I.dump = ee || "{}";
  }
  function fe(I, j, Z) {
    var X, ee, he, oe, me, be;
    for (ee = Z ? I.explicitTypes : I.implicitTypes, he = 0, oe = ee.length; he < oe; he += 1)
      if (me = ee[he], (me.instanceOf || me.predicate) && (!me.instanceOf || typeof j == "object" && j instanceof me.instanceOf) && (!me.predicate || me.predicate(j))) {
        if (Z ? me.multi && me.representName ? I.tag = me.representName(j) : I.tag = me.tag : I.tag = "?", me.represent) {
          if (be = I.styleMap[me.tag] || me.defaultStyle, n.call(me.represent) === "[object Function]")
            X = me.represent(j, be);
          else if (i.call(me.represent, be))
            X = me.represent[be](j, be);
          else
            throw new t("!<" + me.tag + '> tag resolver accepts not "' + be + '" style');
          I.dump = X;
        }
        return !0;
      }
    return !1;
  }
  function pe(I, j, Z, X, ee, he, oe) {
    I.tag = null, I.dump = Z, fe(I, Z, !1) || fe(I, Z, !0);
    var me = n.call(I.dump), be = X, Ae;
    X && (X = I.flowLevel < 0 || I.flowLevel > j);
    var je = me === "[object Object]" || me === "[object Array]", Xe, qe;
    if (je && (Xe = I.duplicates.indexOf(Z), qe = Xe !== -1), (I.tag !== null && I.tag !== "?" || qe || I.indent !== 2 && j > 0) && (ee = !1), qe && I.usedDuplicates[Xe])
      I.dump = "*ref_" + Xe;
    else {
      if (je && qe && !I.usedDuplicates[Xe] && (I.usedDuplicates[Xe] = !0), me === "[object Object]")
        X && Object.keys(I.dump).length !== 0 ? (se(I, j, I.dump, ee), qe && (I.dump = "&ref_" + Xe + I.dump)) : (ae(I, j, I.dump), qe && (I.dump = "&ref_" + Xe + " " + I.dump));
      else if (me === "[object Array]")
        X && I.dump.length !== 0 ? (I.noArrayIndent && !oe && j > 0 ? K(I, j - 1, I.dump, ee) : K(I, j, I.dump, ee), qe && (I.dump = "&ref_" + Xe + I.dump)) : (ce(I, j, I.dump), qe && (I.dump = "&ref_" + Xe + " " + I.dump));
      else if (me === "[object String]")
        I.tag !== "?" && ue(I, I.dump, j, he, be);
      else {
        if (me === "[object Undefined]")
          return !1;
        if (I.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + me);
      }
      I.tag !== null && I.tag !== "?" && (Ae = encodeURI(
        I.tag[0] === "!" ? I.tag.slice(1) : I.tag
      ).replace(/!/g, "%21"), I.tag[0] === "!" ? Ae = "!" + Ae : Ae.slice(0, 18) === "tag:yaml.org,2002:" ? Ae = "!!" + Ae.slice(18) : Ae = "!<" + Ae + ">", I.dump = Ae + " " + I.dump);
    }
    return !0;
  }
  function Ce(I, j) {
    var Z = [], X = [], ee, he;
    for (Ee(I, Z, X), ee = 0, he = X.length; ee < he; ee += 1)
      j.duplicates.push(Z[X[ee]]);
    j.usedDuplicates = new Array(he);
  }
  function Ee(I, j, Z) {
    var X, ee, he;
    if (I !== null && typeof I == "object")
      if (ee = j.indexOf(I), ee !== -1)
        Z.indexOf(ee) === -1 && Z.push(ee);
      else if (j.push(I), Array.isArray(I))
        for (ee = 0, he = I.length; ee < he; ee += 1)
          Ee(I[ee], j, Z);
      else
        for (X = Object.keys(I), ee = 0, he = X.length; ee < he; ee += 1)
          Ee(I[X[ee]], j, Z);
  }
  function ge(I, j) {
    j = j || {};
    var Z = new we(j);
    Z.noRefs || Ce(I, Z);
    var X = I;
    return Z.replacer && (X = Z.replacer.call({ "": X }, "", X)), pe(Z, 0, X, !0, !0) ? Z.dump + `
` : "";
  }
  return Ra.dump = ge, Ra;
}
var gf;
function ul() {
  if (gf) return ot;
  gf = 1;
  var e = l0(), t = u0();
  function r(n, i) {
    return function() {
      throw new Error("Function yaml." + n + " is removed in js-yaml 4. Use yaml." + i + " instead, which is now safe by default.");
    };
  }
  return ot.Type = dt(), ot.Schema = ym(), ot.FAILSAFE_SCHEMA = _m(), ot.JSON_SCHEMA = Rm(), ot.CORE_SCHEMA = Am(), ot.DEFAULT_SCHEMA = ll(), ot.load = e.load, ot.loadAll = e.loadAll, ot.dump = t.dump, ot.YAMLException = Ei(), ot.types = {
    binary: Dm(),
    float: Cm(),
    map: Em(),
    null: Sm(),
    pairs: Nm(),
    set: Om(),
    timestamp: Pm(),
    bool: bm(),
    int: Tm(),
    merge: Im(),
    omap: xm(),
    seq: wm(),
    str: vm()
  }, ot.safeLoad = r("safeLoad", "load"), ot.safeLoadAll = r("safeLoadAll", "loadAll"), ot.safeDump = r("safeDump", "dump"), ot;
}
var Fn = {}, yf;
function d0() {
  if (yf) return Fn;
  yf = 1, Object.defineProperty(Fn, "__esModule", { value: !0 }), Fn.Lazy = void 0;
  class e {
    constructor(r) {
      this._value = null, this.creator = r;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const r = this.creator();
      return this.value = r, r;
    }
    set value(r) {
      this._value = r, this.creator = null;
    }
  }
  return Fn.Lazy = e, Fn;
}
var Ji = { exports: {} }, Aa, vf;
function Bs() {
  if (vf) return Aa;
  vf = 1;
  const e = "2.0.0", t = 256, r = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, i = t - 6;
  return Aa = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: i,
    MAX_SAFE_INTEGER: r,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, Aa;
}
var Pa, wf;
function qs() {
  return wf || (wf = 1, Pa = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), Pa;
}
var Ef;
function _i() {
  return Ef || (Ef = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: r,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: i
    } = Bs(), o = qs();
    t = e.exports = {};
    const s = t.re = [], a = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
    let f = 0;
    const d = "[a-zA-Z0-9-]", p = [
      ["\\s", 1],
      ["\\d", i],
      [d, n]
    ], g = (m) => {
      for (const [S, C] of p)
        m = m.split(`${S}*`).join(`${S}{0,${C}}`).split(`${S}+`).join(`${S}{1,${C}}`);
      return m;
    }, y = (m, S, C) => {
      const A = g(S), x = f++;
      o(m, x, S), l[m] = x, c[x] = S, u[x] = A, s[x] = new RegExp(S, C ? "g" : void 0), a[x] = new RegExp(A, C ? "g" : void 0);
    };
    y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), y("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${d}+`), y("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), y("FULL", `^${c[l.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), y("LOOSE", `^${c[l.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), y("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", c[l.COERCE], !0), y("COERCERTLFULL", c[l.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Ji, Ji.exports)), Ji.exports;
}
var Ia, _f;
function dl() {
  if (_f) return Ia;
  _f = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Ia = (n) => n ? typeof n != "object" ? e : n : t, Ia;
}
var Da, Sf;
function Lm() {
  if (Sf) return Da;
  Sf = 1;
  const e = /^[0-9]+$/, t = (n, i) => {
    if (typeof n == "number" && typeof i == "number")
      return n === i ? 0 : n < i ? -1 : 1;
    const o = e.test(n), s = e.test(i);
    return o && s && (n = +n, i = +i), n === i ? 0 : o && !s ? -1 : s && !o ? 1 : n < i ? -1 : 1;
  };
  return Da = {
    compareIdentifiers: t,
    rcompareIdentifiers: (n, i) => t(i, n)
  }, Da;
}
var xa, bf;
function ft() {
  if (bf) return xa;
  bf = 1;
  const e = qs(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: r } = Bs(), { safeRe: n, t: i } = _i(), o = dl(), { compareIdentifiers: s } = Lm();
  class a {
    constructor(u, l) {
      if (l = o(l), u instanceof a) {
        if (u.loose === !!l.loose && u.includePrerelease === !!l.includePrerelease)
          return u;
        u = u.version;
      } else if (typeof u != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof u}".`);
      if (u.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", u, l), this.options = l, this.loose = !!l.loose, this.includePrerelease = !!l.includePrerelease;
      const f = u.trim().match(l.loose ? n[i.LOOSE] : n[i.FULL]);
      if (!f)
        throw new TypeError(`Invalid Version: ${u}`);
      if (this.raw = u, this.major = +f[1], this.minor = +f[2], this.patch = +f[3], this.major > r || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > r || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > r || this.patch < 0)
        throw new TypeError("Invalid patch version");
      f[4] ? this.prerelease = f[4].split(".").map((d) => {
        if (/^[0-9]+$/.test(d)) {
          const p = +d;
          if (p >= 0 && p < r)
            return p;
        }
        return d;
      }) : this.prerelease = [], this.build = f[5] ? f[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(u) {
      if (e("SemVer.compare", this.version, this.options, u), !(u instanceof a)) {
        if (typeof u == "string" && u === this.version)
          return 0;
        u = new a(u, this.options);
      }
      return u.version === this.version ? 0 : this.compareMain(u) || this.comparePre(u);
    }
    compareMain(u) {
      return u instanceof a || (u = new a(u, this.options)), this.major < u.major ? -1 : this.major > u.major ? 1 : this.minor < u.minor ? -1 : this.minor > u.minor ? 1 : this.patch < u.patch ? -1 : this.patch > u.patch ? 1 : 0;
    }
    comparePre(u) {
      if (u instanceof a || (u = new a(u, this.options)), this.prerelease.length && !u.prerelease.length)
        return -1;
      if (!this.prerelease.length && u.prerelease.length)
        return 1;
      if (!this.prerelease.length && !u.prerelease.length)
        return 0;
      let l = 0;
      do {
        const f = this.prerelease[l], d = u.prerelease[l];
        if (e("prerelease compare", l, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return s(f, d);
      } while (++l);
    }
    compareBuild(u) {
      u instanceof a || (u = new a(u, this.options));
      let l = 0;
      do {
        const f = this.build[l], d = u.build[l];
        if (e("build compare", l, f, d), f === void 0 && d === void 0)
          return 0;
        if (d === void 0)
          return 1;
        if (f === void 0)
          return -1;
        if (f === d)
          continue;
        return s(f, d);
      } while (++l);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(u, l, f) {
      if (u.startsWith("pre")) {
        if (!l && f === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (l) {
          const d = `-${l}`.match(this.options.loose ? n[i.PRERELEASELOOSE] : n[i.PRERELEASE]);
          if (!d || d[1] !== l)
            throw new Error(`invalid identifier: ${l}`);
        }
      }
      switch (u) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", l, f);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", l, f);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", l, f), this.inc("pre", l, f);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", l, f), this.inc("pre", l, f);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const d = Number(f) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [d];
          else {
            let p = this.prerelease.length;
            for (; --p >= 0; )
              typeof this.prerelease[p] == "number" && (this.prerelease[p]++, p = -2);
            if (p === -1) {
              if (l === this.prerelease.join(".") && f === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(d);
            }
          }
          if (l) {
            let p = [l, d];
            f === !1 && (p = [l]), s(this.prerelease[0], l) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = p) : this.prerelease = p;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${u}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return xa = a, xa;
}
var Na, Tf;
function fn() {
  if (Tf) return Na;
  Tf = 1;
  const e = ft();
  return Na = (r, n, i = !1) => {
    if (r instanceof e)
      return r;
    try {
      return new e(r, n);
    } catch (o) {
      if (!i)
        return null;
      throw o;
    }
  }, Na;
}
var Oa, Cf;
function f0() {
  if (Cf) return Oa;
  Cf = 1;
  const e = fn();
  return Oa = (r, n) => {
    const i = e(r, n);
    return i ? i.version : null;
  }, Oa;
}
var La, Rf;
function h0() {
  if (Rf) return La;
  Rf = 1;
  const e = fn();
  return La = (r, n) => {
    const i = e(r.trim().replace(/^[=v]+/, ""), n);
    return i ? i.version : null;
  }, La;
}
var Fa, Af;
function p0() {
  if (Af) return Fa;
  Af = 1;
  const e = ft();
  return Fa = (r, n, i, o, s) => {
    typeof i == "string" && (s = o, o = i, i = void 0);
    try {
      return new e(
        r instanceof e ? r.version : r,
        i
      ).inc(n, o, s).version;
    } catch {
      return null;
    }
  }, Fa;
}
var ka, Pf;
function m0() {
  if (Pf) return ka;
  Pf = 1;
  const e = fn();
  return ka = (r, n) => {
    const i = e(r, null, !0), o = e(n, null, !0), s = i.compare(o);
    if (s === 0)
      return null;
    const a = s > 0, c = a ? i : o, u = a ? o : i, l = !!c.prerelease.length;
    if (!!u.prerelease.length && !l) {
      if (!u.patch && !u.minor)
        return "major";
      if (u.compareMain(c) === 0)
        return u.minor && !u.patch ? "minor" : "patch";
    }
    const d = l ? "pre" : "";
    return i.major !== o.major ? d + "major" : i.minor !== o.minor ? d + "minor" : i.patch !== o.patch ? d + "patch" : "prerelease";
  }, ka;
}
var Ua, If;
function g0() {
  if (If) return Ua;
  If = 1;
  const e = ft();
  return Ua = (r, n) => new e(r, n).major, Ua;
}
var Ma, Df;
function y0() {
  if (Df) return Ma;
  Df = 1;
  const e = ft();
  return Ma = (r, n) => new e(r, n).minor, Ma;
}
var $a, xf;
function v0() {
  if (xf) return $a;
  xf = 1;
  const e = ft();
  return $a = (r, n) => new e(r, n).patch, $a;
}
var Ba, Nf;
function w0() {
  if (Nf) return Ba;
  Nf = 1;
  const e = fn();
  return Ba = (r, n) => {
    const i = e(r, n);
    return i && i.prerelease.length ? i.prerelease : null;
  }, Ba;
}
var qa, Of;
function Lt() {
  if (Of) return qa;
  Of = 1;
  const e = ft();
  return qa = (r, n, i) => new e(r, i).compare(new e(n, i)), qa;
}
var Wa, Lf;
function E0() {
  if (Lf) return Wa;
  Lf = 1;
  const e = Lt();
  return Wa = (r, n, i) => e(n, r, i), Wa;
}
var Ha, Ff;
function _0() {
  if (Ff) return Ha;
  Ff = 1;
  const e = Lt();
  return Ha = (r, n) => e(r, n, !0), Ha;
}
var ja, kf;
function fl() {
  if (kf) return ja;
  kf = 1;
  const e = ft();
  return ja = (r, n, i) => {
    const o = new e(r, i), s = new e(n, i);
    return o.compare(s) || o.compareBuild(s);
  }, ja;
}
var Ga, Uf;
function S0() {
  if (Uf) return Ga;
  Uf = 1;
  const e = fl();
  return Ga = (r, n) => r.sort((i, o) => e(i, o, n)), Ga;
}
var za, Mf;
function b0() {
  if (Mf) return za;
  Mf = 1;
  const e = fl();
  return za = (r, n) => r.sort((i, o) => e(o, i, n)), za;
}
var Va, $f;
function Ws() {
  if ($f) return Va;
  $f = 1;
  const e = Lt();
  return Va = (r, n, i) => e(r, n, i) > 0, Va;
}
var Ya, Bf;
function hl() {
  if (Bf) return Ya;
  Bf = 1;
  const e = Lt();
  return Ya = (r, n, i) => e(r, n, i) < 0, Ya;
}
var Ka, qf;
function Fm() {
  if (qf) return Ka;
  qf = 1;
  const e = Lt();
  return Ka = (r, n, i) => e(r, n, i) === 0, Ka;
}
var Xa, Wf;
function km() {
  if (Wf) return Xa;
  Wf = 1;
  const e = Lt();
  return Xa = (r, n, i) => e(r, n, i) !== 0, Xa;
}
var Ja, Hf;
function pl() {
  if (Hf) return Ja;
  Hf = 1;
  const e = Lt();
  return Ja = (r, n, i) => e(r, n, i) >= 0, Ja;
}
var Qa, jf;
function ml() {
  if (jf) return Qa;
  jf = 1;
  const e = Lt();
  return Qa = (r, n, i) => e(r, n, i) <= 0, Qa;
}
var Za, Gf;
function Um() {
  if (Gf) return Za;
  Gf = 1;
  const e = Fm(), t = km(), r = Ws(), n = pl(), i = hl(), o = ml();
  return Za = (a, c, u, l) => {
    switch (c) {
      case "===":
        return typeof a == "object" && (a = a.version), typeof u == "object" && (u = u.version), a === u;
      case "!==":
        return typeof a == "object" && (a = a.version), typeof u == "object" && (u = u.version), a !== u;
      case "":
      case "=":
      case "==":
        return e(a, u, l);
      case "!=":
        return t(a, u, l);
      case ">":
        return r(a, u, l);
      case ">=":
        return n(a, u, l);
      case "<":
        return i(a, u, l);
      case "<=":
        return o(a, u, l);
      default:
        throw new TypeError(`Invalid operator: ${c}`);
    }
  }, Za;
}
var ec, zf;
function T0() {
  if (zf) return ec;
  zf = 1;
  const e = ft(), t = fn(), { safeRe: r, t: n } = _i();
  return ec = (o, s) => {
    if (o instanceof e)
      return o;
    if (typeof o == "number" && (o = String(o)), typeof o != "string")
      return null;
    s = s || {};
    let a = null;
    if (!s.rtl)
      a = o.match(s.includePrerelease ? r[n.COERCEFULL] : r[n.COERCE]);
    else {
      const p = s.includePrerelease ? r[n.COERCERTLFULL] : r[n.COERCERTL];
      let g;
      for (; (g = p.exec(o)) && (!a || a.index + a[0].length !== o.length); )
        (!a || g.index + g[0].length !== a.index + a[0].length) && (a = g), p.lastIndex = g.index + g[1].length + g[2].length;
      p.lastIndex = -1;
    }
    if (a === null)
      return null;
    const c = a[2], u = a[3] || "0", l = a[4] || "0", f = s.includePrerelease && a[5] ? `-${a[5]}` : "", d = s.includePrerelease && a[6] ? `+${a[6]}` : "";
    return t(`${c}.${u}.${l}${f}${d}`, s);
  }, ec;
}
var tc, Vf;
function C0() {
  if (Vf) return tc;
  Vf = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(r) {
      const n = this.map.get(r);
      if (n !== void 0)
        return this.map.delete(r), this.map.set(r, n), n;
    }
    delete(r) {
      return this.map.delete(r);
    }
    set(r, n) {
      if (!this.delete(r) && n !== void 0) {
        if (this.map.size >= this.max) {
          const o = this.map.keys().next().value;
          this.delete(o);
        }
        this.map.set(r, n);
      }
      return this;
    }
  }
  return tc = e, tc;
}
var rc, Yf;
function Ft() {
  if (Yf) return rc;
  Yf = 1;
  const e = /\s+/g;
  class t {
    constructor(F, $) {
      if ($ = i($), F instanceof t)
        return F.loose === !!$.loose && F.includePrerelease === !!$.includePrerelease ? F : new t(F.raw, $);
      if (F instanceof o)
        return this.raw = F.value, this.set = [[F]], this.formatted = void 0, this;
      if (this.options = $, this.loose = !!$.loose, this.includePrerelease = !!$.includePrerelease, this.raw = F.trim().replace(e, " "), this.set = this.raw.split("||").map((O) => this.parseRange(O.trim())).filter((O) => O.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const O = this.set[0];
        if (this.set = this.set.filter((G) => !y(G[0])), this.set.length === 0)
          this.set = [O];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && m(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let F = 0; F < this.set.length; F++) {
          F > 0 && (this.formatted += "||");
          const $ = this.set[F];
          for (let O = 0; O < $.length; O++)
            O > 0 && (this.formatted += " "), this.formatted += $[O].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(F) {
      const O = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + F, G = n.get(O);
      if (G)
        return G;
      const Y = this.options.loose, ie = Y ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      F = F.replace(ie, k(this.options.includePrerelease)), s("hyphen replace", F), F = F.replace(c[u.COMPARATORTRIM], l), s("comparator trim", F), F = F.replace(c[u.TILDETRIM], f), s("tilde trim", F), F = F.replace(c[u.CARETTRIM], d), s("caret trim", F);
      let we = F.split(" ").map((te) => C(te, this.options)).join(" ").split(/\s+/).map((te) => U(te, this.options));
      Y && (we = we.filter((te) => (s("loose invalid filter", te, this.options), !!te.match(c[u.COMPARATORLOOSE])))), s("range list", we);
      const ne = /* @__PURE__ */ new Map(), Ie = we.map((te) => new o(te, this.options));
      for (const te of Ie) {
        if (y(te))
          return [te];
        ne.set(te.value, te);
      }
      ne.size > 1 && ne.has("") && ne.delete("");
      const Re = [...ne.values()];
      return n.set(O, Re), Re;
    }
    intersects(F, $) {
      if (!(F instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((O) => S(O, $) && F.set.some((G) => S(G, $) && O.every((Y) => G.every((ie) => Y.intersects(ie, $)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(F) {
      if (!F)
        return !1;
      if (typeof F == "string")
        try {
          F = new a(F, this.options);
        } catch {
          return !1;
        }
      for (let $ = 0; $ < this.set.length; $++)
        if (M(this.set[$], F, this.options))
          return !0;
      return !1;
    }
  }
  rc = t;
  const r = C0(), n = new r(), i = dl(), o = Hs(), s = qs(), a = ft(), {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = _i(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g } = Bs(), y = (N) => N.value === "<0.0.0-0", m = (N) => N.value === "", S = (N, F) => {
    let $ = !0;
    const O = N.slice();
    let G = O.pop();
    for (; $ && O.length; )
      $ = O.every((Y) => G.intersects(Y, F)), G = O.pop();
    return $;
  }, C = (N, F) => (N = N.replace(c[u.BUILD], ""), s("comp", N, F), N = E(N, F), s("caret", N), N = x(N, F), s("tildes", N), N = v(N, F), s("xrange", N), N = T(N, F), s("stars", N), N), A = (N) => !N || N.toLowerCase() === "x" || N === "*", x = (N, F) => N.trim().split(/\s+/).map(($) => w($, F)).join(" "), w = (N, F) => {
    const $ = F.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return N.replace($, (O, G, Y, ie, we) => {
      s("tilde", N, O, G, Y, ie, we);
      let ne;
      return A(G) ? ne = "" : A(Y) ? ne = `>=${G}.0.0 <${+G + 1}.0.0-0` : A(ie) ? ne = `>=${G}.${Y}.0 <${G}.${+Y + 1}.0-0` : we ? (s("replaceTilde pr", we), ne = `>=${G}.${Y}.${ie}-${we} <${G}.${+Y + 1}.0-0`) : ne = `>=${G}.${Y}.${ie} <${G}.${+Y + 1}.0-0`, s("tilde return", ne), ne;
    });
  }, E = (N, F) => N.trim().split(/\s+/).map(($) => b($, F)).join(" "), b = (N, F) => {
    s("caret", N, F);
    const $ = F.loose ? c[u.CARETLOOSE] : c[u.CARET], O = F.includePrerelease ? "-0" : "";
    return N.replace($, (G, Y, ie, we, ne) => {
      s("caret", N, G, Y, ie, we, ne);
      let Ie;
      return A(Y) ? Ie = "" : A(ie) ? Ie = `>=${Y}.0.0${O} <${+Y + 1}.0.0-0` : A(we) ? Y === "0" ? Ie = `>=${Y}.${ie}.0${O} <${Y}.${+ie + 1}.0-0` : Ie = `>=${Y}.${ie}.0${O} <${+Y + 1}.0.0-0` : ne ? (s("replaceCaret pr", ne), Y === "0" ? ie === "0" ? Ie = `>=${Y}.${ie}.${we}-${ne} <${Y}.${ie}.${+we + 1}-0` : Ie = `>=${Y}.${ie}.${we}-${ne} <${Y}.${+ie + 1}.0-0` : Ie = `>=${Y}.${ie}.${we}-${ne} <${+Y + 1}.0.0-0`) : (s("no pr"), Y === "0" ? ie === "0" ? Ie = `>=${Y}.${ie}.${we}${O} <${Y}.${ie}.${+we + 1}-0` : Ie = `>=${Y}.${ie}.${we}${O} <${Y}.${+ie + 1}.0-0` : Ie = `>=${Y}.${ie}.${we} <${+Y + 1}.0.0-0`), s("caret return", Ie), Ie;
    });
  }, v = (N, F) => (s("replaceXRanges", N, F), N.split(/\s+/).map(($) => P($, F)).join(" ")), P = (N, F) => {
    N = N.trim();
    const $ = F.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return N.replace($, (O, G, Y, ie, we, ne) => {
      s("xRange", N, O, G, Y, ie, we, ne);
      const Ie = A(Y), Re = Ie || A(ie), te = Re || A(we), Se = te;
      return G === "=" && Se && (G = ""), ne = F.includePrerelease ? "-0" : "", Ie ? G === ">" || G === "<" ? O = "<0.0.0-0" : O = "*" : G && Se ? (Re && (ie = 0), we = 0, G === ">" ? (G = ">=", Re ? (Y = +Y + 1, ie = 0, we = 0) : (ie = +ie + 1, we = 0)) : G === "<=" && (G = "<", Re ? Y = +Y + 1 : ie = +ie + 1), G === "<" && (ne = "-0"), O = `${G + Y}.${ie}.${we}${ne}`) : Re ? O = `>=${Y}.0.0${ne} <${+Y + 1}.0.0-0` : te && (O = `>=${Y}.${ie}.0${ne} <${Y}.${+ie + 1}.0-0`), s("xRange return", O), O;
    });
  }, T = (N, F) => (s("replaceStars", N, F), N.trim().replace(c[u.STAR], "")), U = (N, F) => (s("replaceGTE0", N, F), N.trim().replace(c[F.includePrerelease ? u.GTE0PRE : u.GTE0], "")), k = (N) => (F, $, O, G, Y, ie, we, ne, Ie, Re, te, Se) => (A(O) ? $ = "" : A(G) ? $ = `>=${O}.0.0${N ? "-0" : ""}` : A(Y) ? $ = `>=${O}.${G}.0${N ? "-0" : ""}` : ie ? $ = `>=${$}` : $ = `>=${$}${N ? "-0" : ""}`, A(Ie) ? ne = "" : A(Re) ? ne = `<${+Ie + 1}.0.0-0` : A(te) ? ne = `<${Ie}.${+Re + 1}.0-0` : Se ? ne = `<=${Ie}.${Re}.${te}-${Se}` : N ? ne = `<${Ie}.${Re}.${+te + 1}-0` : ne = `<=${ne}`, `${$} ${ne}`.trim()), M = (N, F, $) => {
    for (let O = 0; O < N.length; O++)
      if (!N[O].test(F))
        return !1;
    if (F.prerelease.length && !$.includePrerelease) {
      for (let O = 0; O < N.length; O++)
        if (s(N[O].semver), N[O].semver !== o.ANY && N[O].semver.prerelease.length > 0) {
          const G = N[O].semver;
          if (G.major === F.major && G.minor === F.minor && G.patch === F.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return rc;
}
var nc, Kf;
function Hs() {
  if (Kf) return nc;
  Kf = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), s("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = l.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new a(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (s("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new a(l, this.options);
        } catch {
          return !1;
        }
      return o(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || o(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || o(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  nc = t;
  const r = dl(), { safeRe: n, t: i } = _i(), o = Um(), s = qs(), a = ft(), c = Ft();
  return nc;
}
var ic, Xf;
function js() {
  if (Xf) return ic;
  Xf = 1;
  const e = Ft();
  return ic = (r, n, i) => {
    try {
      n = new e(n, i);
    } catch {
      return !1;
    }
    return n.test(r);
  }, ic;
}
var sc, Jf;
function R0() {
  if (Jf) return sc;
  Jf = 1;
  const e = Ft();
  return sc = (r, n) => new e(r, n).set.map((i) => i.map((o) => o.value).join(" ").trim().split(" ")), sc;
}
var oc, Qf;
function A0() {
  if (Qf) return oc;
  Qf = 1;
  const e = ft(), t = Ft();
  return oc = (n, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new t(i, o);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      c.test(u) && (!s || a.compare(u) === -1) && (s = u, a = new e(s, o));
    }), s;
  }, oc;
}
var ac, Zf;
function P0() {
  if (Zf) return ac;
  Zf = 1;
  const e = ft(), t = Ft();
  return ac = (n, i, o) => {
    let s = null, a = null, c = null;
    try {
      c = new t(i, o);
    } catch {
      return null;
    }
    return n.forEach((u) => {
      c.test(u) && (!s || a.compare(u) === 1) && (s = u, a = new e(s, o));
    }), s;
  }, ac;
}
var cc, eh;
function I0() {
  if (eh) return cc;
  eh = 1;
  const e = ft(), t = Ft(), r = Ws();
  return cc = (i, o) => {
    i = new t(i, o);
    let s = new e("0.0.0");
    if (i.test(s) || (s = new e("0.0.0-0"), i.test(s)))
      return s;
    s = null;
    for (let a = 0; a < i.set.length; ++a) {
      const c = i.set[a];
      let u = null;
      c.forEach((l) => {
        const f = new e(l.semver.version);
        switch (l.operator) {
          case ">":
            f.prerelease.length === 0 ? f.patch++ : f.prerelease.push(0), f.raw = f.format();
          /* fallthrough */
          case "":
          case ">=":
            (!u || r(f, u)) && (u = f);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${l.operator}`);
        }
      }), u && (!s || r(s, u)) && (s = u);
    }
    return s && i.test(s) ? s : null;
  }, cc;
}
var lc, th;
function D0() {
  if (th) return lc;
  th = 1;
  const e = Ft();
  return lc = (r, n) => {
    try {
      return new e(r, n).range || "*";
    } catch {
      return null;
    }
  }, lc;
}
var uc, rh;
function gl() {
  if (rh) return uc;
  rh = 1;
  const e = ft(), t = Hs(), { ANY: r } = t, n = Ft(), i = js(), o = Ws(), s = hl(), a = ml(), c = pl();
  return uc = (l, f, d, p) => {
    l = new e(l, p), f = new n(f, p);
    let g, y, m, S, C;
    switch (d) {
      case ">":
        g = o, y = a, m = s, S = ">", C = ">=";
        break;
      case "<":
        g = s, y = c, m = o, S = "<", C = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (i(l, f, p))
      return !1;
    for (let A = 0; A < f.set.length; ++A) {
      const x = f.set[A];
      let w = null, E = null;
      if (x.forEach((b) => {
        b.semver === r && (b = new t(">=0.0.0")), w = w || b, E = E || b, g(b.semver, w.semver, p) ? w = b : m(b.semver, E.semver, p) && (E = b);
      }), w.operator === S || w.operator === C || (!E.operator || E.operator === S) && y(l, E.semver))
        return !1;
      if (E.operator === C && m(l, E.semver))
        return !1;
    }
    return !0;
  }, uc;
}
var dc, nh;
function x0() {
  if (nh) return dc;
  nh = 1;
  const e = gl();
  return dc = (r, n, i) => e(r, n, ">", i), dc;
}
var fc, ih;
function N0() {
  if (ih) return fc;
  ih = 1;
  const e = gl();
  return fc = (r, n, i) => e(r, n, "<", i), fc;
}
var hc, sh;
function O0() {
  if (sh) return hc;
  sh = 1;
  const e = Ft();
  return hc = (r, n, i) => (r = new e(r, i), n = new e(n, i), r.intersects(n, i)), hc;
}
var pc, oh;
function L0() {
  if (oh) return pc;
  oh = 1;
  const e = js(), t = Lt();
  return pc = (r, n, i) => {
    const o = [];
    let s = null, a = null;
    const c = r.sort((d, p) => t(d, p, i));
    for (const d of c)
      e(d, n, i) ? (a = d, s || (s = d)) : (a && o.push([s, a]), a = null, s = null);
    s && o.push([s, null]);
    const u = [];
    for (const [d, p] of o)
      d === p ? u.push(d) : !p && d === c[0] ? u.push("*") : p ? d === c[0] ? u.push(`<=${p}`) : u.push(`${d} - ${p}`) : u.push(`>=${d}`);
    const l = u.join(" || "), f = typeof n.raw == "string" ? n.raw : String(n);
    return l.length < f.length ? l : n;
  }, pc;
}
var mc, ah;
function F0() {
  if (ah) return mc;
  ah = 1;
  const e = Ft(), t = Hs(), { ANY: r } = t, n = js(), i = Lt(), o = (f, d, p = {}) => {
    if (f === d)
      return !0;
    f = new e(f, p), d = new e(d, p);
    let g = !1;
    e: for (const y of f.set) {
      for (const m of d.set) {
        const S = c(y, m, p);
        if (g = g || S !== null, S)
          continue e;
      }
      if (g)
        return !1;
    }
    return !0;
  }, s = [new t(">=0.0.0-0")], a = [new t(">=0.0.0")], c = (f, d, p) => {
    if (f === d)
      return !0;
    if (f.length === 1 && f[0].semver === r) {
      if (d.length === 1 && d[0].semver === r)
        return !0;
      p.includePrerelease ? f = s : f = a;
    }
    if (d.length === 1 && d[0].semver === r) {
      if (p.includePrerelease)
        return !0;
      d = a;
    }
    const g = /* @__PURE__ */ new Set();
    let y, m;
    for (const v of f)
      v.operator === ">" || v.operator === ">=" ? y = u(y, v, p) : v.operator === "<" || v.operator === "<=" ? m = l(m, v, p) : g.add(v.semver);
    if (g.size > 1)
      return null;
    let S;
    if (y && m) {
      if (S = i(y.semver, m.semver, p), S > 0)
        return null;
      if (S === 0 && (y.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const v of g) {
      if (y && !n(v, String(y), p) || m && !n(v, String(m), p))
        return null;
      for (const P of d)
        if (!n(v, String(P), p))
          return !1;
      return !0;
    }
    let C, A, x, w, E = m && !p.includePrerelease && m.semver.prerelease.length ? m.semver : !1, b = y && !p.includePrerelease && y.semver.prerelease.length ? y.semver : !1;
    E && E.prerelease.length === 1 && m.operator === "<" && E.prerelease[0] === 0 && (E = !1);
    for (const v of d) {
      if (w = w || v.operator === ">" || v.operator === ">=", x = x || v.operator === "<" || v.operator === "<=", y) {
        if (b && v.semver.prerelease && v.semver.prerelease.length && v.semver.major === b.major && v.semver.minor === b.minor && v.semver.patch === b.patch && (b = !1), v.operator === ">" || v.operator === ">=") {
          if (C = u(y, v, p), C === v && C !== y)
            return !1;
        } else if (y.operator === ">=" && !n(y.semver, String(v), p))
          return !1;
      }
      if (m) {
        if (E && v.semver.prerelease && v.semver.prerelease.length && v.semver.major === E.major && v.semver.minor === E.minor && v.semver.patch === E.patch && (E = !1), v.operator === "<" || v.operator === "<=") {
          if (A = l(m, v, p), A === v && A !== m)
            return !1;
        } else if (m.operator === "<=" && !n(m.semver, String(v), p))
          return !1;
      }
      if (!v.operator && (m || y) && S !== 0)
        return !1;
    }
    return !(y && x && !m && S !== 0 || m && w && !y && S !== 0 || b || E);
  }, u = (f, d, p) => {
    if (!f)
      return d;
    const g = i(f.semver, d.semver, p);
    return g > 0 ? f : g < 0 || d.operator === ">" && f.operator === ">=" ? d : f;
  }, l = (f, d, p) => {
    if (!f)
      return d;
    const g = i(f.semver, d.semver, p);
    return g < 0 ? f : g > 0 || d.operator === "<" && f.operator === "<=" ? d : f;
  };
  return mc = o, mc;
}
var gc, ch;
function Mm() {
  if (ch) return gc;
  ch = 1;
  const e = _i(), t = Bs(), r = ft(), n = Lm(), i = fn(), o = f0(), s = h0(), a = p0(), c = m0(), u = g0(), l = y0(), f = v0(), d = w0(), p = Lt(), g = E0(), y = _0(), m = fl(), S = S0(), C = b0(), A = Ws(), x = hl(), w = Fm(), E = km(), b = pl(), v = ml(), P = Um(), T = T0(), U = Hs(), k = Ft(), M = js(), N = R0(), F = A0(), $ = P0(), O = I0(), G = D0(), Y = gl(), ie = x0(), we = N0(), ne = O0(), Ie = L0(), Re = F0();
  return gc = {
    parse: i,
    valid: o,
    clean: s,
    inc: a,
    diff: c,
    major: u,
    minor: l,
    patch: f,
    prerelease: d,
    compare: p,
    rcompare: g,
    compareLoose: y,
    compareBuild: m,
    sort: S,
    rsort: C,
    gt: A,
    lt: x,
    eq: w,
    neq: E,
    gte: b,
    lte: v,
    cmp: P,
    coerce: T,
    Comparator: U,
    Range: k,
    satisfies: M,
    toComparators: N,
    maxSatisfying: F,
    minSatisfying: $,
    minVersion: O,
    validRange: G,
    outside: Y,
    gtr: ie,
    ltr: we,
    intersects: ne,
    simplifyRange: Ie,
    subset: Re,
    SemVer: r,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, gc;
}
var zr = {}, ti = { exports: {} };
ti.exports;
var lh;
function k0() {
  return lh || (lh = 1, (function(e, t) {
    var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", d = "[object Error]", p = "[object Function]", g = "[object GeneratorFunction]", y = "[object Map]", m = "[object Number]", S = "[object Null]", C = "[object Object]", A = "[object Promise]", x = "[object Proxy]", w = "[object RegExp]", E = "[object Set]", b = "[object String]", v = "[object Symbol]", P = "[object Undefined]", T = "[object WeakMap]", U = "[object ArrayBuffer]", k = "[object DataView]", M = "[object Float32Array]", N = "[object Float64Array]", F = "[object Int8Array]", $ = "[object Int16Array]", O = "[object Int32Array]", G = "[object Uint8Array]", Y = "[object Uint8ClampedArray]", ie = "[object Uint16Array]", we = "[object Uint32Array]", ne = /[\\^$.*+?()[\]{}|]/g, Ie = /^\[object .+?Constructor\]$/, Re = /^(?:0|[1-9]\d*)$/, te = {};
    te[M] = te[N] = te[F] = te[$] = te[O] = te[G] = te[Y] = te[ie] = te[we] = !0, te[a] = te[c] = te[U] = te[l] = te[k] = te[f] = te[d] = te[p] = te[y] = te[m] = te[C] = te[w] = te[E] = te[b] = te[T] = !1;
    var Se = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, De = typeof self == "object" && self && self.Object === Object && self, Ue = Se || De || Function("return this")(), We = t && !t.nodeType && t, Be = We && !0 && e && !e.nodeType && e, Fe = Be && Be.exports === We, R = Fe && Se.process, _ = (function() {
      try {
        return R && R.binding && R.binding("util");
      } catch {
      }
    })(), q = _ && _.isTypedArray;
    function L(D, B) {
      for (var re = -1, ve = D == null ? 0 : D.length, ze = 0, xe = []; ++re < ve; ) {
        var Je = D[re];
        B(Je, re, D) && (xe[ze++] = Je);
      }
      return xe;
    }
    function Ne(D, B) {
      for (var re = -1, ve = B.length, ze = D.length; ++re < ve; )
        D[ze + re] = B[re];
      return D;
    }
    function W(D, B) {
      for (var re = -1, ve = D == null ? 0 : D.length; ++re < ve; )
        if (B(D[re], re, D))
          return !0;
      return !1;
    }
    function z(D, B) {
      for (var re = -1, ve = Array(D); ++re < D; )
        ve[re] = B(re);
      return ve;
    }
    function ue(D) {
      return function(B) {
        return D(B);
      };
    }
    function ye(D, B) {
      return D.has(B);
    }
    function de(D, B) {
      return D == null ? void 0 : D[B];
    }
    function h(D) {
      var B = -1, re = Array(D.size);
      return D.forEach(function(ve, ze) {
        re[++B] = [ze, ve];
      }), re;
    }
    function H(D, B) {
      return function(re) {
        return D(B(re));
      };
    }
    function V(D) {
      var B = -1, re = Array(D.size);
      return D.forEach(function(ve) {
        re[++B] = ve;
      }), re;
    }
    var ce = Array.prototype, K = Function.prototype, ae = Object.prototype, se = Ue["__core-js_shared__"], fe = K.toString, pe = ae.hasOwnProperty, Ce = (function() {
      var D = /[^.]+$/.exec(se && se.keys && se.keys.IE_PROTO || "");
      return D ? "Symbol(src)_1." + D : "";
    })(), Ee = ae.toString, ge = RegExp(
      "^" + fe.call(pe).replace(ne, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), I = Fe ? Ue.Buffer : void 0, j = Ue.Symbol, Z = Ue.Uint8Array, X = ae.propertyIsEnumerable, ee = ce.splice, he = j ? j.toStringTag : void 0, oe = Object.getOwnPropertySymbols, me = I ? I.isBuffer : void 0, be = H(Object.keys, Object), Ae = qr(Ue, "DataView"), je = qr(Ue, "Map"), Xe = qr(Ue, "Promise"), qe = qr(Ue, "Set"), Br = qr(Ue, "WeakMap"), It = qr(Object, "create"), wr = Sr(Ae), Cg = Sr(je), Rg = Sr(Xe), Ag = Sr(qe), Pg = Sr(Br), Il = j ? j.prototype : void 0, Js = Il ? Il.valueOf : void 0;
    function Er(D) {
      var B = -1, re = D == null ? 0 : D.length;
      for (this.clear(); ++B < re; ) {
        var ve = D[B];
        this.set(ve[0], ve[1]);
      }
    }
    function Ig() {
      this.__data__ = It ? It(null) : {}, this.size = 0;
    }
    function Dg(D) {
      var B = this.has(D) && delete this.__data__[D];
      return this.size -= B ? 1 : 0, B;
    }
    function xg(D) {
      var B = this.__data__;
      if (It) {
        var re = B[D];
        return re === n ? void 0 : re;
      }
      return pe.call(B, D) ? B[D] : void 0;
    }
    function Ng(D) {
      var B = this.__data__;
      return It ? B[D] !== void 0 : pe.call(B, D);
    }
    function Og(D, B) {
      var re = this.__data__;
      return this.size += this.has(D) ? 0 : 1, re[D] = It && B === void 0 ? n : B, this;
    }
    Er.prototype.clear = Ig, Er.prototype.delete = Dg, Er.prototype.get = xg, Er.prototype.has = Ng, Er.prototype.set = Og;
    function Ht(D) {
      var B = -1, re = D == null ? 0 : D.length;
      for (this.clear(); ++B < re; ) {
        var ve = D[B];
        this.set(ve[0], ve[1]);
      }
    }
    function Lg() {
      this.__data__ = [], this.size = 0;
    }
    function Fg(D) {
      var B = this.__data__, re = Ri(B, D);
      if (re < 0)
        return !1;
      var ve = B.length - 1;
      return re == ve ? B.pop() : ee.call(B, re, 1), --this.size, !0;
    }
    function kg(D) {
      var B = this.__data__, re = Ri(B, D);
      return re < 0 ? void 0 : B[re][1];
    }
    function Ug(D) {
      return Ri(this.__data__, D) > -1;
    }
    function Mg(D, B) {
      var re = this.__data__, ve = Ri(re, D);
      return ve < 0 ? (++this.size, re.push([D, B])) : re[ve][1] = B, this;
    }
    Ht.prototype.clear = Lg, Ht.prototype.delete = Fg, Ht.prototype.get = kg, Ht.prototype.has = Ug, Ht.prototype.set = Mg;
    function _r(D) {
      var B = -1, re = D == null ? 0 : D.length;
      for (this.clear(); ++B < re; ) {
        var ve = D[B];
        this.set(ve[0], ve[1]);
      }
    }
    function $g() {
      this.size = 0, this.__data__ = {
        hash: new Er(),
        map: new (je || Ht)(),
        string: new Er()
      };
    }
    function Bg(D) {
      var B = Ai(this, D).delete(D);
      return this.size -= B ? 1 : 0, B;
    }
    function qg(D) {
      return Ai(this, D).get(D);
    }
    function Wg(D) {
      return Ai(this, D).has(D);
    }
    function Hg(D, B) {
      var re = Ai(this, D), ve = re.size;
      return re.set(D, B), this.size += re.size == ve ? 0 : 1, this;
    }
    _r.prototype.clear = $g, _r.prototype.delete = Bg, _r.prototype.get = qg, _r.prototype.has = Wg, _r.prototype.set = Hg;
    function Ci(D) {
      var B = -1, re = D == null ? 0 : D.length;
      for (this.__data__ = new _r(); ++B < re; )
        this.add(D[B]);
    }
    function jg(D) {
      return this.__data__.set(D, n), this;
    }
    function Gg(D) {
      return this.__data__.has(D);
    }
    Ci.prototype.add = Ci.prototype.push = jg, Ci.prototype.has = Gg;
    function rr(D) {
      var B = this.__data__ = new Ht(D);
      this.size = B.size;
    }
    function zg() {
      this.__data__ = new Ht(), this.size = 0;
    }
    function Vg(D) {
      var B = this.__data__, re = B.delete(D);
      return this.size = B.size, re;
    }
    function Yg(D) {
      return this.__data__.get(D);
    }
    function Kg(D) {
      return this.__data__.has(D);
    }
    function Xg(D, B) {
      var re = this.__data__;
      if (re instanceof Ht) {
        var ve = re.__data__;
        if (!je || ve.length < r - 1)
          return ve.push([D, B]), this.size = ++re.size, this;
        re = this.__data__ = new _r(ve);
      }
      return re.set(D, B), this.size = re.size, this;
    }
    rr.prototype.clear = zg, rr.prototype.delete = Vg, rr.prototype.get = Yg, rr.prototype.has = Kg, rr.prototype.set = Xg;
    function Jg(D, B) {
      var re = Pi(D), ve = !re && fy(D), ze = !re && !ve && Qs(D), xe = !re && !ve && !ze && Ml(D), Je = re || ve || ze || xe, Ze = Je ? z(D.length, String) : [], tt = Ze.length;
      for (var Ke in D)
        pe.call(D, Ke) && !(Je && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Ke == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        ze && (Ke == "offset" || Ke == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        xe && (Ke == "buffer" || Ke == "byteLength" || Ke == "byteOffset") || // Skip index properties.
        ay(Ke, tt))) && Ze.push(Ke);
      return Ze;
    }
    function Ri(D, B) {
      for (var re = D.length; re--; )
        if (Ll(D[re][0], B))
          return re;
      return -1;
    }
    function Qg(D, B, re) {
      var ve = B(D);
      return Pi(D) ? ve : Ne(ve, re(D));
    }
    function pn(D) {
      return D == null ? D === void 0 ? P : S : he && he in Object(D) ? sy(D) : dy(D);
    }
    function Dl(D) {
      return mn(D) && pn(D) == a;
    }
    function xl(D, B, re, ve, ze) {
      return D === B ? !0 : D == null || B == null || !mn(D) && !mn(B) ? D !== D && B !== B : Zg(D, B, re, ve, xl, ze);
    }
    function Zg(D, B, re, ve, ze, xe) {
      var Je = Pi(D), Ze = Pi(B), tt = Je ? c : nr(D), Ke = Ze ? c : nr(B);
      tt = tt == a ? C : tt, Ke = Ke == a ? C : Ke;
      var gt = tt == C, Dt = Ke == C, it = tt == Ke;
      if (it && Qs(D)) {
        if (!Qs(B))
          return !1;
        Je = !0, gt = !1;
      }
      if (it && !gt)
        return xe || (xe = new rr()), Je || Ml(D) ? Nl(D, B, re, ve, ze, xe) : ny(D, B, tt, re, ve, ze, xe);
      if (!(re & i)) {
        var Tt = gt && pe.call(D, "__wrapped__"), Ct = Dt && pe.call(B, "__wrapped__");
        if (Tt || Ct) {
          var ir = Tt ? D.value() : D, jt = Ct ? B.value() : B;
          return xe || (xe = new rr()), ze(ir, jt, re, ve, xe);
        }
      }
      return it ? (xe || (xe = new rr()), iy(D, B, re, ve, ze, xe)) : !1;
    }
    function ey(D) {
      if (!Ul(D) || ly(D))
        return !1;
      var B = Fl(D) ? ge : Ie;
      return B.test(Sr(D));
    }
    function ty(D) {
      return mn(D) && kl(D.length) && !!te[pn(D)];
    }
    function ry(D) {
      if (!uy(D))
        return be(D);
      var B = [];
      for (var re in Object(D))
        pe.call(D, re) && re != "constructor" && B.push(re);
      return B;
    }
    function Nl(D, B, re, ve, ze, xe) {
      var Je = re & i, Ze = D.length, tt = B.length;
      if (Ze != tt && !(Je && tt > Ze))
        return !1;
      var Ke = xe.get(D);
      if (Ke && xe.get(B))
        return Ke == B;
      var gt = -1, Dt = !0, it = re & o ? new Ci() : void 0;
      for (xe.set(D, B), xe.set(B, D); ++gt < Ze; ) {
        var Tt = D[gt], Ct = B[gt];
        if (ve)
          var ir = Je ? ve(Ct, Tt, gt, B, D, xe) : ve(Tt, Ct, gt, D, B, xe);
        if (ir !== void 0) {
          if (ir)
            continue;
          Dt = !1;
          break;
        }
        if (it) {
          if (!W(B, function(jt, br) {
            if (!ye(it, br) && (Tt === jt || ze(Tt, jt, re, ve, xe)))
              return it.push(br);
          })) {
            Dt = !1;
            break;
          }
        } else if (!(Tt === Ct || ze(Tt, Ct, re, ve, xe))) {
          Dt = !1;
          break;
        }
      }
      return xe.delete(D), xe.delete(B), Dt;
    }
    function ny(D, B, re, ve, ze, xe, Je) {
      switch (re) {
        case k:
          if (D.byteLength != B.byteLength || D.byteOffset != B.byteOffset)
            return !1;
          D = D.buffer, B = B.buffer;
        case U:
          return !(D.byteLength != B.byteLength || !xe(new Z(D), new Z(B)));
        case l:
        case f:
        case m:
          return Ll(+D, +B);
        case d:
          return D.name == B.name && D.message == B.message;
        case w:
        case b:
          return D == B + "";
        case y:
          var Ze = h;
        case E:
          var tt = ve & i;
          if (Ze || (Ze = V), D.size != B.size && !tt)
            return !1;
          var Ke = Je.get(D);
          if (Ke)
            return Ke == B;
          ve |= o, Je.set(D, B);
          var gt = Nl(Ze(D), Ze(B), ve, ze, xe, Je);
          return Je.delete(D), gt;
        case v:
          if (Js)
            return Js.call(D) == Js.call(B);
      }
      return !1;
    }
    function iy(D, B, re, ve, ze, xe) {
      var Je = re & i, Ze = Ol(D), tt = Ze.length, Ke = Ol(B), gt = Ke.length;
      if (tt != gt && !Je)
        return !1;
      for (var Dt = tt; Dt--; ) {
        var it = Ze[Dt];
        if (!(Je ? it in B : pe.call(B, it)))
          return !1;
      }
      var Tt = xe.get(D);
      if (Tt && xe.get(B))
        return Tt == B;
      var Ct = !0;
      xe.set(D, B), xe.set(B, D);
      for (var ir = Je; ++Dt < tt; ) {
        it = Ze[Dt];
        var jt = D[it], br = B[it];
        if (ve)
          var $l = Je ? ve(br, jt, it, B, D, xe) : ve(jt, br, it, D, B, xe);
        if (!($l === void 0 ? jt === br || ze(jt, br, re, ve, xe) : $l)) {
          Ct = !1;
          break;
        }
        ir || (ir = it == "constructor");
      }
      if (Ct && !ir) {
        var Ii = D.constructor, Di = B.constructor;
        Ii != Di && "constructor" in D && "constructor" in B && !(typeof Ii == "function" && Ii instanceof Ii && typeof Di == "function" && Di instanceof Di) && (Ct = !1);
      }
      return xe.delete(D), xe.delete(B), Ct;
    }
    function Ol(D) {
      return Qg(D, my, oy);
    }
    function Ai(D, B) {
      var re = D.__data__;
      return cy(B) ? re[typeof B == "string" ? "string" : "hash"] : re.map;
    }
    function qr(D, B) {
      var re = de(D, B);
      return ey(re) ? re : void 0;
    }
    function sy(D) {
      var B = pe.call(D, he), re = D[he];
      try {
        D[he] = void 0;
        var ve = !0;
      } catch {
      }
      var ze = Ee.call(D);
      return ve && (B ? D[he] = re : delete D[he]), ze;
    }
    var oy = oe ? function(D) {
      return D == null ? [] : (D = Object(D), L(oe(D), function(B) {
        return X.call(D, B);
      }));
    } : gy, nr = pn;
    (Ae && nr(new Ae(new ArrayBuffer(1))) != k || je && nr(new je()) != y || Xe && nr(Xe.resolve()) != A || qe && nr(new qe()) != E || Br && nr(new Br()) != T) && (nr = function(D) {
      var B = pn(D), re = B == C ? D.constructor : void 0, ve = re ? Sr(re) : "";
      if (ve)
        switch (ve) {
          case wr:
            return k;
          case Cg:
            return y;
          case Rg:
            return A;
          case Ag:
            return E;
          case Pg:
            return T;
        }
      return B;
    });
    function ay(D, B) {
      return B = B ?? s, !!B && (typeof D == "number" || Re.test(D)) && D > -1 && D % 1 == 0 && D < B;
    }
    function cy(D) {
      var B = typeof D;
      return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? D !== "__proto__" : D === null;
    }
    function ly(D) {
      return !!Ce && Ce in D;
    }
    function uy(D) {
      var B = D && D.constructor, re = typeof B == "function" && B.prototype || ae;
      return D === re;
    }
    function dy(D) {
      return Ee.call(D);
    }
    function Sr(D) {
      if (D != null) {
        try {
          return fe.call(D);
        } catch {
        }
        try {
          return D + "";
        } catch {
        }
      }
      return "";
    }
    function Ll(D, B) {
      return D === B || D !== D && B !== B;
    }
    var fy = Dl(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Dl : function(D) {
      return mn(D) && pe.call(D, "callee") && !X.call(D, "callee");
    }, Pi = Array.isArray;
    function hy(D) {
      return D != null && kl(D.length) && !Fl(D);
    }
    var Qs = me || yy;
    function py(D, B) {
      return xl(D, B);
    }
    function Fl(D) {
      if (!Ul(D))
        return !1;
      var B = pn(D);
      return B == p || B == g || B == u || B == x;
    }
    function kl(D) {
      return typeof D == "number" && D > -1 && D % 1 == 0 && D <= s;
    }
    function Ul(D) {
      var B = typeof D;
      return D != null && (B == "object" || B == "function");
    }
    function mn(D) {
      return D != null && typeof D == "object";
    }
    var Ml = q ? ue(q) : ty;
    function my(D) {
      return hy(D) ? Jg(D) : ry(D);
    }
    function gy() {
      return [];
    }
    function yy() {
      return !1;
    }
    e.exports = py;
  })(ti, ti.exports)), ti.exports;
}
var uh;
function U0() {
  if (uh) return zr;
  uh = 1, Object.defineProperty(zr, "__esModule", { value: !0 }), zr.DownloadedUpdateHelper = void 0, zr.createTempUpdateFile = a;
  const e = _t, t = Te, r = k0(), n = /* @__PURE__ */ yr(), i = Q;
  let o = class {
    constructor(u) {
      this.cacheDir = u, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return i.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(u, l, f, d) {
      if (this.versionInfo != null && this.file === u && this.fileInfo != null)
        return r(this.versionInfo, l) && r(this.fileInfo.info, f.info) && await (0, n.pathExists)(u) ? u : null;
      const p = await this.getValidCachedUpdateFile(f, d);
      return p === null ? null : (d.info(`Update has already been downloaded to ${u}).`), this._file = p, p);
    }
    async setDownloadedFile(u, l, f, d, p, g) {
      this._file = u, this._packageFile = l, this.versionInfo = f, this.fileInfo = d, this._downloadedFileInfo = {
        fileName: p,
        sha512: d.info.sha512,
        isAdminRightsRequired: d.info.isAdminRightsRequired === !0
      }, g && await (0, n.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, n.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(u, l) {
      const f = this.getUpdateInfoFile();
      if (!await (0, n.pathExists)(f))
        return null;
      let p;
      try {
        p = await (0, n.readJson)(f);
      } catch (S) {
        let C = "No cached update info available";
        return S.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), C += ` (error on read: ${S.message})`), l.info(C), null;
      }
      if (!((p == null ? void 0 : p.fileName) !== null))
        return l.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (u.info.sha512 !== p.sha512)
        return l.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${p.sha512}, expected: ${u.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const y = i.join(this.cacheDirForPendingUpdate, p.fileName);
      if (!await (0, n.pathExists)(y))
        return l.info("Cached update file doesn't exist"), null;
      const m = await s(y);
      return u.info.sha512 !== m ? (l.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${u.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = p, y);
    }
    getUpdateInfoFile() {
      return i.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  zr.DownloadedUpdateHelper = o;
  function s(c, u = "sha512", l = "base64", f) {
    return new Promise((d, p) => {
      const g = (0, e.createHash)(u);
      g.on("error", p).setEncoding(l), (0, t.createReadStream)(c, {
        ...f,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", p).on("end", () => {
        g.end(), d(g.read());
      }).pipe(g, { end: !1 });
    });
  }
  async function a(c, u, l) {
    let f = 0, d = i.join(u, c);
    for (let p = 0; p < 3; p++)
      try {
        return await (0, n.unlink)(d), d;
      } catch (g) {
        if (g.code === "ENOENT")
          return d;
        l.warn(`Error on remove temp update file: ${g}`), d = i.join(u, `${f++}-${c}`);
      }
    return d;
  }
  return zr;
}
var kn = {}, Qi = {}, dh;
function M0() {
  if (dh) return Qi;
  dh = 1, Object.defineProperty(Qi, "__esModule", { value: !0 }), Qi.getAppCacheDir = r;
  const e = Q, t = Ps;
  function r() {
    const n = (0, t.homedir)();
    let i;
    return process.platform === "win32" ? i = process.env.LOCALAPPDATA || e.join(n, "AppData", "Local") : process.platform === "darwin" ? i = e.join(n, "Library", "Caches") : i = process.env.XDG_CACHE_HOME || e.join(n, ".cache"), i;
  }
  return Qi;
}
var fh;
function $0() {
  if (fh) return kn;
  fh = 1, Object.defineProperty(kn, "__esModule", { value: !0 }), kn.ElectronAppAdapter = void 0;
  const e = Q, t = M0();
  let r = class {
    constructor(i = Or.app) {
      this.app = i;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? e.join(process.resourcesPath, "app-update.yml") : e.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, t.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(i) {
      this.app.once("quit", (o, s) => i(s));
    }
  };
  return kn.ElectronAppAdapter = r, kn;
}
var yc = {}, hh;
function B0() {
  return hh || (hh = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
    const t = et();
    e.NET_SESSION_NAME = "electron-updater";
    function r() {
      return Or.session.fromPartition(e.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class n extends t.HttpExecutor {
      constructor(o) {
        super(), this.proxyLoginCallback = o, this.cachedSession = null;
      }
      async download(o, s, a) {
        return await a.cancellationToken.createPromise((c, u, l) => {
          const f = {
            headers: a.headers || void 0,
            redirect: "manual"
          };
          (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
            destination: s,
            options: a,
            onCancel: l,
            callback: (d) => {
              d == null ? c(s) : u(d);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(o, s) {
        o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
        const a = Or.net.request({
          ...o,
          session: this.cachedSession
        });
        return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
      }
      addRedirectHandlers(o, s, a, c, u) {
        o.on("redirect", (l, f, d) => {
          o.abort(), c > this.maxRedirects ? a(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(d, s));
        });
      }
    }
    e.ElectronHttpExecutor = n;
  })(yc)), yc;
}
var Un = {}, Vr = {}, ph;
function Ur() {
  if (ph) return Vr;
  ph = 1, Object.defineProperty(Vr, "__esModule", { value: !0 }), Vr.newBaseUrl = t, Vr.newUrlFromBase = r, Vr.getChannelFilename = n;
  const e = er;
  function t(i) {
    const o = new e.URL(i);
    return o.pathname.endsWith("/") || (o.pathname += "/"), o;
  }
  function r(i, o, s = !1) {
    const a = new e.URL(i, o), c = o.search;
    return c != null && c.length !== 0 ? a.search = c : s && (a.search = `noCache=${Date.now().toString(32)}`), a;
  }
  function n(i) {
    return `${i}.yml`;
  }
  return Vr;
}
var Gt = {}, vc, mh;
function $m() {
  if (mh) return vc;
  mh = 1;
  var e = "[object Symbol]", t = /[\\^$.*+?()[\]{}|]/g, r = RegExp(t.source), n = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, i = typeof self == "object" && self && self.Object === Object && self, o = n || i || Function("return this")(), s = Object.prototype, a = s.toString, c = o.Symbol, u = c ? c.prototype : void 0, l = u ? u.toString : void 0;
  function f(m) {
    if (typeof m == "string")
      return m;
    if (p(m))
      return l ? l.call(m) : "";
    var S = m + "";
    return S == "0" && 1 / m == -1 / 0 ? "-0" : S;
  }
  function d(m) {
    return !!m && typeof m == "object";
  }
  function p(m) {
    return typeof m == "symbol" || d(m) && a.call(m) == e;
  }
  function g(m) {
    return m == null ? "" : f(m);
  }
  function y(m) {
    return m = g(m), m && r.test(m) ? m.replace(t, "\\$&") : m;
  }
  return vc = y, vc;
}
var gh;
function bt() {
  if (gh) return Gt;
  gh = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.Provider = void 0, Gt.findFile = s, Gt.parseUpdateInfo = a, Gt.getFileList = c, Gt.resolveFiles = u;
  const e = et(), t = ul(), r = er, n = Ur(), i = $m();
  let o = class {
    constructor(f) {
      this.runtimeOptions = f, this.requestHeaders = null, this.executor = f.executor;
    }
    // By default, the blockmap file is in the same directory as the main file
    // But some providers may have a different blockmap file, so we need to override this method
    getBlockMapFiles(f, d, p, g = null) {
      const y = (0, n.newUrlFromBase)(`${f.pathname}.blockmap`, f);
      return [(0, n.newUrlFromBase)(`${f.pathname.replace(new RegExp(i(p), "g"), d)}.blockmap`, g ? new r.URL(g) : f), y];
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const f = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (f === "x64" ? "" : `-${f}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(f) {
      return `${f}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(f) {
      this.requestHeaders = f;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(f, d, p) {
      return this.executor.request(this.createRequestOptions(f, d), p);
    }
    createRequestOptions(f, d) {
      const p = {};
      return this.requestHeaders == null ? d != null && (p.headers = d) : p.headers = d == null ? this.requestHeaders : { ...this.requestHeaders, ...d }, (0, e.configureRequestUrl)(f, p), p;
    }
  };
  Gt.Provider = o;
  function s(l, f, d) {
    var p;
    if (l.length === 0)
      throw (0, e.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const g = l.filter((m) => m.url.pathname.toLowerCase().endsWith(`.${f.toLowerCase()}`)), y = (p = g.find((m) => [m.url.pathname, m.info.url].some((S) => S.includes(process.arch)))) !== null && p !== void 0 ? p : g.shift();
    return y || (d == null ? l[0] : l.find((m) => !d.some((S) => m.url.pathname.toLowerCase().endsWith(`.${S.toLowerCase()}`))));
  }
  function a(l, f, d) {
    if (l == null)
      throw (0, e.newError)(`Cannot parse update info from ${f} in the latest release artifacts (${d}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let p;
    try {
      p = (0, t.load)(l);
    } catch (g) {
      throw (0, e.newError)(`Cannot parse update info from ${f} in the latest release artifacts (${d}): ${g.stack || g.message}, rawData: ${l}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return p;
  }
  function c(l) {
    const f = l.files;
    if (f != null && f.length > 0)
      return f;
    if (l.path != null)
      return [
        {
          url: l.path,
          sha2: l.sha2,
          sha512: l.sha512
        }
      ];
    throw (0, e.newError)(`No files provided: ${(0, e.safeStringifyJson)(l)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function u(l, f, d = (p) => p) {
    const g = c(l).map((S) => {
      if (S.sha2 == null && S.sha512 == null)
        throw (0, e.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, e.safeStringifyJson)(S)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, n.newUrlFromBase)(d(S.url), f),
        info: S
      };
    }), y = l.packages, m = y == null ? null : y[process.arch] || y.ia32;
    return m != null && (g[0].packageInfo = {
      ...m,
      path: (0, n.newUrlFromBase)(d(m.path), f).href
    }), g;
  }
  return Gt;
}
var yh;
function Bm() {
  if (yh) return Un;
  yh = 1, Object.defineProperty(Un, "__esModule", { value: !0 }), Un.GenericProvider = void 0;
  const e = et(), t = Ur(), r = bt();
  let n = class extends r.Provider {
    constructor(o, s, a) {
      super(a), this.configuration = o, this.updater = s, this.baseUrl = (0, t.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const o = this.updater.channel || this.configuration.channel;
      return o == null ? this.getDefaultChannelName() : this.getCustomChannelName(o);
    }
    async getLatestVersion() {
      const o = (0, t.getChannelFilename)(this.channel), s = (0, t.newUrlFromBase)(o, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let a = 0; ; a++)
        try {
          return (0, r.parseUpdateInfo)(await this.httpRequest(s), o, s);
        } catch (c) {
          if (c instanceof e.HttpError && c.statusCode === 404)
            throw (0, e.newError)(`Cannot find channel "${o}" update info: ${c.stack || c.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (c.code === "ECONNREFUSED" && a < 3) {
            await new Promise((u, l) => {
              try {
                setTimeout(u, 1e3 * a);
              } catch (f) {
                l(f);
              }
            });
            continue;
          }
          throw c;
        }
    }
    resolveFiles(o) {
      return (0, r.resolveFiles)(o, this.baseUrl);
    }
  };
  return Un.GenericProvider = n, Un;
}
var Mn = {}, $n = {}, vh;
function q0() {
  if (vh) return $n;
  vh = 1, Object.defineProperty($n, "__esModule", { value: !0 }), $n.BitbucketProvider = void 0;
  const e = et(), t = Ur(), r = bt();
  let n = class extends r.Provider {
    constructor(o, s, a) {
      super({
        ...a,
        isUseMultipleRangeRequest: !1
      }), this.configuration = o, this.updater = s;
      const { owner: c, slug: u } = o;
      this.baseUrl = (0, t.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${c}/${u}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const o = new e.CancellationToken(), s = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, t.newUrlFromBase)(s, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const c = await this.httpRequest(a, void 0, o);
        return (0, r.parseUpdateInfo)(c, s, a);
      } catch (c) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${c.stack || c.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(o) {
      return (0, r.resolveFiles)(o, this.baseUrl);
    }
    toString() {
      const { owner: o, slug: s } = this.configuration;
      return `Bitbucket (owner: ${o}, slug: ${s}, channel: ${this.channel})`;
    }
  };
  return $n.BitbucketProvider = n, $n;
}
var cr = {}, wh;
function qm() {
  if (wh) return cr;
  wh = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.GitHubProvider = cr.BaseGitHubProvider = void 0, cr.computeReleaseNotes = u;
  const e = et(), t = Mm(), r = er, n = Ur(), i = bt(), o = /\/tag\/([^/]+)$/;
  class s extends i.Provider {
    constructor(f, d, p) {
      super({
        ...p,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = f, this.baseUrl = (0, n.newBaseUrl)((0, e.githubUrl)(f, d));
      const g = d === "github.com" ? "api.github.com" : d;
      this.baseApiUrl = (0, n.newBaseUrl)((0, e.githubUrl)(f, g));
    }
    computeGithubBasePath(f) {
      const d = this.options.host;
      return d && !["github.com", "api.github.com"].includes(d) ? `/api/v3${f}` : f;
    }
  }
  cr.BaseGitHubProvider = s;
  let a = class extends s {
    constructor(f, d, p) {
      super(f, "github.com", p), this.options = f, this.updater = d;
    }
    get channel() {
      const f = this.updater.channel || this.options.channel;
      return f == null ? this.getDefaultChannelName() : this.getCustomChannelName(f);
    }
    async getLatestVersion() {
      var f, d, p, g, y;
      const m = new e.CancellationToken(), S = await this.httpRequest((0, n.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), C = (0, e.parseXml)(S);
      let A = C.element("entry", !1, "No published versions on GitHub"), x = null;
      try {
        if (this.updater.allowPrerelease) {
          const T = ((f = this.updater) === null || f === void 0 ? void 0 : f.channel) || ((d = t.prerelease(this.updater.currentVersion)) === null || d === void 0 ? void 0 : d[0]) || null;
          if (T === null)
            x = o.exec(A.element("link").attribute("href"))[1];
          else
            for (const U of C.getElements("entry")) {
              const k = o.exec(U.element("link").attribute("href"));
              if (k === null)
                continue;
              const M = k[1], N = ((p = t.prerelease(M)) === null || p === void 0 ? void 0 : p[0]) || null, F = !T || ["alpha", "beta"].includes(T), $ = N !== null && !["alpha", "beta"].includes(String(N));
              if (F && !$ && !(T === "beta" && N === "alpha")) {
                x = M;
                break;
              }
              if (N && N === T) {
                x = M;
                break;
              }
            }
        } else {
          x = await this.getLatestTagName(m);
          for (const T of C.getElements("entry"))
            if (o.exec(T.element("link").attribute("href"))[1] === x) {
              A = T;
              break;
            }
        }
      } catch (T) {
        throw (0, e.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${S}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (x == null)
        throw (0, e.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let w, E = "", b = "";
      const v = async (T) => {
        E = (0, n.getChannelFilename)(T), b = (0, n.newUrlFromBase)(this.getBaseDownloadPath(String(x), E), this.baseUrl);
        const U = this.createRequestOptions(b);
        try {
          return await this.executor.request(U, m);
        } catch (k) {
          throw k instanceof e.HttpError && k.statusCode === 404 ? (0, e.newError)(`Cannot find ${E} in the latest release artifacts (${b}): ${k.stack || k.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : k;
        }
      };
      try {
        let T = this.channel;
        this.updater.allowPrerelease && (!((g = t.prerelease(x)) === null || g === void 0) && g[0]) && (T = this.getCustomChannelName(String((y = t.prerelease(x)) === null || y === void 0 ? void 0 : y[0]))), w = await v(T);
      } catch (T) {
        if (this.updater.allowPrerelease)
          w = await v(this.getDefaultChannelName());
        else
          throw T;
      }
      const P = (0, i.parseUpdateInfo)(w, E, b);
      return P.releaseName == null && (P.releaseName = A.elementValueOrEmpty("title")), P.releaseNotes == null && (P.releaseNotes = u(this.updater.currentVersion, this.updater.fullChangelog, C, A)), {
        tag: x,
        ...P
      };
    }
    async getLatestTagName(f) {
      const d = this.options, p = d.host == null || d.host === "github.com" ? (0, n.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new r.URL(`${this.computeGithubBasePath(`/repos/${d.owner}/${d.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const g = await this.httpRequest(p, { Accept: "application/json" }, f);
        return g == null ? null : JSON.parse(g).tag_name;
      } catch (g) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${p}), please ensure a production release exists: ${g.stack || g.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(f) {
      return (0, i.resolveFiles)(f, this.baseUrl, (d) => this.getBaseDownloadPath(f.tag, d.replace(/ /g, "-")));
    }
    getBaseDownloadPath(f, d) {
      return `${this.basePath}/download/${f}/${d}`;
    }
  };
  cr.GitHubProvider = a;
  function c(l) {
    const f = l.elementValueOrEmpty("content");
    return f === "No content." ? "" : f;
  }
  function u(l, f, d, p) {
    if (!f)
      return c(p);
    const g = [];
    for (const y of d.getElements("entry")) {
      const m = /\/tag\/v?([^/]+)$/.exec(y.element("link").attribute("href"))[1];
      t.valid(m) && t.lt(l, m) && g.push({
        version: m,
        note: c(y)
      });
    }
    return g.sort((y, m) => t.rcompare(y.version, m.version));
  }
  return cr;
}
var Bn = {}, Eh;
function W0() {
  if (Eh) return Bn;
  Eh = 1, Object.defineProperty(Bn, "__esModule", { value: !0 }), Bn.GitLabProvider = void 0;
  const e = et(), t = er, r = $m(), n = Ur(), i = bt();
  let o = class extends i.Provider {
    /**
     * Normalizes filenames by replacing spaces and underscores with dashes.
     *
     * This is a workaround to handle filename formatting differences between tools:
     * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
     * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
     *
     * Because of this mismatch, we can't reliably extract the correct filename from
     * the asset path without normalization. This function ensures consistent matching
     * across different filename formats by converting all spaces and underscores to dashes.
     *
     * @param filename The filename to normalize
     * @returns The normalized filename with spaces and underscores replaced by dashes
     */
    normalizeFilename(a) {
      return a.replace(/ |_/g, "-");
    }
    constructor(a, c, u) {
      super({
        ...u,
        // GitLab might not support multiple range requests efficiently
        isUseMultipleRangeRequest: !1
      }), this.options = a, this.updater = c, this.cachedLatestVersion = null;
      const f = a.host || "gitlab.com";
      this.baseApiUrl = (0, n.newBaseUrl)(`https://${f}/api/v4`);
    }
    get channel() {
      const a = this.updater.channel || this.options.channel;
      return a == null ? this.getDefaultChannelName() : this.getCustomChannelName(a);
    }
    async getLatestVersion() {
      const a = new e.CancellationToken(), c = (0, n.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
      let u;
      try {
        const C = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, A = await this.httpRequest(c, C, a);
        if (!A)
          throw (0, e.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
        u = JSON.parse(A);
      } catch (C) {
        throw (0, e.newError)(`Unable to find latest release on GitLab (${c}): ${C.stack || C.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
      const l = u.tag_name;
      let f = null, d = "", p = null;
      const g = async (C) => {
        d = (0, n.getChannelFilename)(C);
        const A = u.assets.links.find((w) => w.name === d);
        if (!A)
          throw (0, e.newError)(`Cannot find ${d} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        p = new t.URL(A.direct_asset_url);
        const x = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
        try {
          const w = await this.httpRequest(p, x, a);
          if (!w)
            throw (0, e.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          return w;
        } catch (w) {
          throw w instanceof e.HttpError && w.statusCode === 404 ? (0, e.newError)(`Cannot find ${d} in the latest release artifacts (${p}): ${w.stack || w.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : w;
        }
      };
      try {
        f = await g(this.channel);
      } catch (C) {
        if (this.channel !== this.getDefaultChannelName())
          f = await g(this.getDefaultChannelName());
        else
          throw C;
      }
      if (!f)
        throw (0, e.newError)(`Unable to parse channel data from ${d}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
      const y = (0, i.parseUpdateInfo)(f, d, p);
      y.releaseName == null && (y.releaseName = u.name), y.releaseNotes == null && (y.releaseNotes = u.description || null);
      const m = /* @__PURE__ */ new Map();
      for (const C of u.assets.links)
        m.set(this.normalizeFilename(C.name), C.direct_asset_url);
      const S = {
        tag: l,
        assets: m,
        ...y
      };
      return this.cachedLatestVersion = S, S;
    }
    /**
     * Utility function to convert GitlabReleaseAsset to Map<string, string>
     * Maps asset names to their download URLs
     */
    convertAssetsToMap(a) {
      const c = /* @__PURE__ */ new Map();
      for (const u of a.links)
        c.set(this.normalizeFilename(u.name), u.direct_asset_url);
      return c;
    }
    /**
     * Find blockmap file URL in assets map for a specific filename
     */
    findBlockMapInAssets(a, c) {
      const u = [`${c}.blockmap`, `${this.normalizeFilename(c)}.blockmap`];
      for (const l of u) {
        const f = a.get(l);
        if (f)
          return new t.URL(f);
      }
      return null;
    }
    async fetchReleaseInfoByVersion(a) {
      const c = new e.CancellationToken(), u = [`v${a}`, a];
      for (const l of u) {
        const f = (0, n.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(l)}`, this.baseApiUrl);
        try {
          const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(f, d, c);
          if (p)
            return JSON.parse(p);
        } catch (d) {
          if (d instanceof e.HttpError && d.statusCode === 404)
            continue;
          throw (0, e.newError)(`Unable to find release ${l} on GitLab (${f}): ${d.stack || d.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
        }
      }
      throw (0, e.newError)(`Unable to find release with version ${a} (tried: ${u.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
    }
    setAuthHeaderForToken(a) {
      const c = {};
      return a != null && (a.startsWith("Bearer") ? c.authorization = a : c["PRIVATE-TOKEN"] = a), c;
    }
    /**
     * Get version info for blockmap files, using cache when possible
     */
    async getVersionInfoForBlockMap(a) {
      if (this.cachedLatestVersion && this.cachedLatestVersion.version === a)
        return this.cachedLatestVersion.assets;
      const c = await this.fetchReleaseInfoByVersion(a);
      return c && c.assets ? this.convertAssetsToMap(c.assets) : null;
    }
    /**
     * Find blockmap URLs from version assets
     */
    async findBlockMapUrlsFromAssets(a, c, u) {
      let l = null, f = null;
      const d = await this.getVersionInfoForBlockMap(c);
      d && (l = this.findBlockMapInAssets(d, u));
      const p = await this.getVersionInfoForBlockMap(a);
      if (p) {
        const g = u.replace(new RegExp(r(c), "g"), a);
        f = this.findBlockMapInAssets(p, g);
      }
      return [f, l];
    }
    async getBlockMapFiles(a, c, u, l = null) {
      if (this.options.uploadTarget === "project_upload") {
        const f = a.pathname.split("/").pop() || "", [d, p] = await this.findBlockMapUrlsFromAssets(c, u, f);
        if (!p)
          throw (0, e.newError)(`Cannot find blockmap file for ${u} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        if (!d)
          throw (0, e.newError)(`Cannot find blockmap file for ${c} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
        return [d, p];
      } else
        return super.getBlockMapFiles(a, c, u, l);
    }
    resolveFiles(a) {
      return (0, i.getFileList)(a).map((c) => {
        const l = [
          c.url,
          // Original filename
          this.normalizeFilename(c.url)
          // Normalized filename (spaces/underscores → dashes)
        ].find((d) => a.assets.has(d)), f = l ? a.assets.get(l) : void 0;
        if (!f)
          throw (0, e.newError)(`Cannot find asset "${c.url}" in GitLab release assets. Available assets: ${Array.from(a.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new t.URL(f),
          info: c
        };
      });
    }
    toString() {
      return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
    }
  };
  return Bn.GitLabProvider = o, Bn;
}
var qn = {}, _h;
function H0() {
  if (_h) return qn;
  _h = 1, Object.defineProperty(qn, "__esModule", { value: !0 }), qn.KeygenProvider = void 0;
  const e = et(), t = Ur(), r = bt();
  let n = class extends r.Provider {
    constructor(o, s, a) {
      super({
        ...a,
        isUseMultipleRangeRequest: !1
      }), this.configuration = o, this.updater = s, this.defaultHostname = "api.keygen.sh";
      const c = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, t.newBaseUrl)(`https://${c}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const o = new e.CancellationToken(), s = (0, t.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, t.newUrlFromBase)(s, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const c = await this.httpRequest(a, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, o);
        return (0, r.parseUpdateInfo)(c, s, a);
      } catch (c) {
        throw (0, e.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${c.stack || c.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(o) {
      return (0, r.resolveFiles)(o, this.baseUrl);
    }
    toString() {
      const { account: o, product: s, platform: a } = this.configuration;
      return `Keygen (account: ${o}, product: ${s}, platform: ${a}, channel: ${this.channel})`;
    }
  };
  return qn.KeygenProvider = n, qn;
}
var Wn = {}, Sh;
function j0() {
  if (Sh) return Wn;
  Sh = 1, Object.defineProperty(Wn, "__esModule", { value: !0 }), Wn.PrivateGitHubProvider = void 0;
  const e = et(), t = ul(), r = Q, n = er, i = Ur(), o = qm(), s = bt();
  let a = class extends o.BaseGitHubProvider {
    constructor(u, l, f, d) {
      super(u, "api.github.com", d), this.updater = l, this.token = f;
    }
    createRequestOptions(u, l) {
      const f = super.createRequestOptions(u, l);
      return f.redirect = "manual", f;
    }
    async getLatestVersion() {
      const u = new e.CancellationToken(), l = (0, i.getChannelFilename)(this.getDefaultChannelName()), f = await this.getLatestVersionInfo(u), d = f.assets.find((y) => y.name === l);
      if (d == null)
        throw (0, e.newError)(`Cannot find ${l} in the release ${f.html_url || f.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const p = new n.URL(d.url);
      let g;
      try {
        g = (0, t.load)(await this.httpRequest(p, this.configureHeaders("application/octet-stream"), u));
      } catch (y) {
        throw y instanceof e.HttpError && y.statusCode === 404 ? (0, e.newError)(`Cannot find ${l} in the latest release artifacts (${p}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
      return g.assets = f.assets, g;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(u) {
      return {
        accept: u,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(u) {
      const l = this.updater.allowPrerelease;
      let f = this.basePath;
      l || (f = `${f}/latest`);
      const d = (0, i.newUrlFromBase)(f, this.baseUrl);
      try {
        const p = JSON.parse(await this.httpRequest(d, this.configureHeaders("application/vnd.github.v3+json"), u));
        return l ? p.find((g) => g.prerelease) || p[0] : p;
      } catch (p) {
        throw (0, e.newError)(`Unable to find latest version on GitHub (${d}), please ensure a production release exists: ${p.stack || p.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(u) {
      return (0, s.getFileList)(u).map((l) => {
        const f = r.posix.basename(l.url).replace(/ /g, "-"), d = u.assets.find((p) => p != null && p.name === f);
        if (d == null)
          throw (0, e.newError)(`Cannot find asset "${f}" in: ${JSON.stringify(u.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new n.URL(d.url),
          info: l
        };
      });
    }
  };
  return Wn.PrivateGitHubProvider = a, Wn;
}
var bh;
function G0() {
  if (bh) return Mn;
  bh = 1, Object.defineProperty(Mn, "__esModule", { value: !0 }), Mn.isUrlProbablySupportMultiRangeRequests = a, Mn.createClient = c;
  const e = et(), t = q0(), r = Bm(), n = qm(), i = W0(), o = H0(), s = j0();
  function a(u) {
    return !u.includes("s3.amazonaws.com");
  }
  function c(u, l, f) {
    if (typeof u == "string")
      throw (0, e.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const d = u.provider;
    switch (d) {
      case "github": {
        const p = u, g = (p.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || p.token;
        return g == null ? new n.GitHubProvider(p, l, f) : new s.PrivateGitHubProvider(p, l, g, f);
      }
      case "bitbucket":
        return new t.BitbucketProvider(u, l, f);
      case "gitlab":
        return new i.GitLabProvider(u, l, f);
      case "keygen":
        return new o.KeygenProvider(u, l, f);
      case "s3":
      case "spaces":
        return new r.GenericProvider({
          provider: "generic",
          url: (0, e.getS3LikeProviderBaseUrl)(u),
          channel: u.channel || null
        }, l, {
          ...f,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const p = u;
        return new r.GenericProvider(p, l, {
          ...f,
          isUseMultipleRangeRequest: p.useMultipleRangeRequest !== !1 && a(p.url)
        });
      }
      case "custom": {
        const p = u, g = p.updateProvider;
        if (!g)
          throw (0, e.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new g(p, l, f);
      }
      default:
        throw (0, e.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return Mn;
}
var Hn = {}, jn = {}, Yr = {}, Kr = {}, Th;
function yl() {
  if (Th) return Kr;
  Th = 1, Object.defineProperty(Kr, "__esModule", { value: !0 }), Kr.OperationKind = void 0, Kr.computeOperations = t;
  var e;
  (function(s) {
    s[s.COPY = 0] = "COPY", s[s.DOWNLOAD = 1] = "DOWNLOAD";
  })(e || (Kr.OperationKind = e = {}));
  function t(s, a, c) {
    const u = o(s.files), l = o(a.files);
    let f = null;
    const d = a.files[0], p = [], g = d.name, y = u.get(g);
    if (y == null)
      throw new Error(`no file ${g} in old blockmap`);
    const m = l.get(g);
    let S = 0;
    const { checksumToOffset: C, checksumToOldSize: A } = i(u.get(g), y.offset, c);
    let x = d.offset;
    for (let w = 0; w < m.checksums.length; x += m.sizes[w], w++) {
      const E = m.sizes[w], b = m.checksums[w];
      let v = C.get(b);
      v != null && A.get(b) !== E && (c.warn(`Checksum ("${b}") matches, but size differs (old: ${A.get(b)}, new: ${E})`), v = void 0), v === void 0 ? (S++, f != null && f.kind === e.DOWNLOAD && f.end === x ? f.end += E : (f = {
        kind: e.DOWNLOAD,
        start: x,
        end: x + E
        // oldBlocks: null,
      }, n(f, p, b, w))) : f != null && f.kind === e.COPY && f.end === v ? f.end += E : (f = {
        kind: e.COPY,
        start: v,
        end: v + E
        // oldBlocks: [checksum]
      }, n(f, p, b, w));
    }
    return S > 0 && c.info(`File${d.name === "file" ? "" : " " + d.name} has ${S} changed blocks`), p;
  }
  const r = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function n(s, a, c, u) {
    if (r && a.length !== 0) {
      const l = a[a.length - 1];
      if (l.kind === s.kind && s.start < l.end && s.start > l.start) {
        const f = [l.start, l.end, s.start, s.end].reduce((d, p) => d < p ? d : p);
        throw new Error(`operation (block index: ${u}, checksum: ${c}, kind: ${e[s.kind]}) overlaps previous operation (checksum: ${c}):
abs: ${l.start} until ${l.end} and ${s.start} until ${s.end}
rel: ${l.start - f} until ${l.end - f} and ${s.start - f} until ${s.end - f}`);
      }
    }
    a.push(s);
  }
  function i(s, a, c) {
    const u = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    let f = a;
    for (let d = 0; d < s.checksums.length; d++) {
      const p = s.checksums[d], g = s.sizes[d], y = l.get(p);
      if (y === void 0)
        u.set(p, f), l.set(p, g);
      else if (c.debug != null) {
        const m = y === g ? "(same size)" : `(size: ${y}, this size: ${g})`;
        c.debug(`${p} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      f += g;
    }
    return { checksumToOffset: u, checksumToOldSize: l };
  }
  function o(s) {
    const a = /* @__PURE__ */ new Map();
    for (const c of s)
      a.set(c.name, c);
    return a;
  }
  return Kr;
}
var Ch;
function Wm() {
  if (Ch) return Yr;
  Ch = 1, Object.defineProperty(Yr, "__esModule", { value: !0 }), Yr.DataSplitter = void 0, Yr.copyData = s;
  const e = et(), t = Te, r = qt, n = yl(), i = Buffer.from(`\r
\r
`);
  var o;
  (function(c) {
    c[c.INIT = 0] = "INIT", c[c.HEADER = 1] = "HEADER", c[c.BODY = 2] = "BODY";
  })(o || (o = {}));
  function s(c, u, l, f, d) {
    const p = (0, t.createReadStream)("", {
      fd: l,
      autoClose: !1,
      start: c.start,
      // end is inclusive
      end: c.end - 1
    });
    p.on("error", f), p.once("end", d), p.pipe(u, {
      end: !1
    });
  }
  let a = class extends r.Writable {
    constructor(u, l, f, d, p, g, y, m) {
      super(), this.out = u, this.options = l, this.partIndexToTaskIndex = f, this.partIndexToLength = p, this.finishHandler = g, this.grandTotalBytes = y, this.onProgress = m, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = o.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = d.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(u, l, f) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${u.length} bytes`);
        return;
      }
      this.handleData(u).then(() => {
        if (this.onProgress) {
          const d = Date.now();
          (d >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (d - this.start) / 1e3 && (this.nextUpdate = d + 1e3, this.onProgress({
            total: this.grandTotalBytes,
            delta: this.delta,
            transferred: this.transferred,
            percent: this.transferred / this.grandTotalBytes * 100,
            bytesPerSecond: Math.round(this.transferred / ((d - this.start) / 1e3))
          }), this.delta = 0);
        }
        f();
      }).catch(f);
    }
    async handleData(u) {
      let l = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, e.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const f = Math.min(this.ignoreByteCount, u.length);
        this.ignoreByteCount -= f, l = f;
      } else if (this.remainingPartDataCount > 0) {
        const f = Math.min(this.remainingPartDataCount, u.length);
        this.remainingPartDataCount -= f, await this.processPartData(u, 0, f), l = f;
      }
      if (l !== u.length) {
        if (this.readState === o.HEADER) {
          const f = this.searchHeaderListEnd(u, l);
          if (f === -1)
            return;
          l = f, this.readState = o.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === o.BODY)
            this.readState = o.INIT;
          else {
            this.partIndex++;
            let g = this.partIndexToTaskIndex.get(this.partIndex);
            if (g == null)
              if (this.isFinished)
                g = this.options.end;
              else
                throw (0, e.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const y = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (y < g)
              await this.copyExistingData(y, g);
            else if (y > g)
              throw (0, e.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (l = this.searchHeaderListEnd(u, l), l === -1) {
              this.readState = o.HEADER;
              return;
            }
          }
          const f = this.partIndexToLength[this.partIndex], d = l + f, p = Math.min(d, u.length);
          if (await this.processPartStarted(u, l, p), this.remainingPartDataCount = f - (p - l), this.remainingPartDataCount > 0)
            return;
          if (l = d + this.boundaryLength, l >= u.length) {
            this.ignoreByteCount = this.boundaryLength - (u.length - d);
            return;
          }
        }
      }
    }
    copyExistingData(u, l) {
      return new Promise((f, d) => {
        const p = () => {
          if (u === l) {
            f();
            return;
          }
          const g = this.options.tasks[u];
          if (g.kind !== n.OperationKind.COPY) {
            d(new Error("Task kind must be COPY"));
            return;
          }
          s(g, this.out, this.options.oldFileFd, d, () => {
            u++, p();
          });
        };
        p();
      });
    }
    searchHeaderListEnd(u, l) {
      const f = u.indexOf(i, l);
      if (f !== -1)
        return f + i.length;
      const d = l === 0 ? u : u.slice(l);
      return this.headerListBuffer == null ? this.headerListBuffer = d : this.headerListBuffer = Buffer.concat([this.headerListBuffer, d]), -1;
    }
    onPartEnd() {
      const u = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== u)
        throw (0, e.newError)(`Expected length: ${u} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(u, l, f) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(u, l, f);
    }
    processPartData(u, l, f) {
      this.actualPartLength += f - l, this.transferred += f - l, this.delta += f - l;
      const d = this.out;
      return d.write(l === 0 && u.length === f ? u : u.slice(l, f)) ? Promise.resolve() : new Promise((p, g) => {
        d.on("error", g), d.once("drain", () => {
          d.removeListener("error", g), p();
        });
      });
    }
  };
  return Yr.DataSplitter = a, Yr;
}
var Gn = {}, Rh;
function z0() {
  if (Rh) return Gn;
  Rh = 1, Object.defineProperty(Gn, "__esModule", { value: !0 }), Gn.executeTasksUsingMultipleRangeRequests = n, Gn.checkIsRangesSupported = o;
  const e = et(), t = Wm(), r = yl();
  function n(s, a, c, u, l) {
    const f = (d) => {
      if (d >= a.length) {
        s.fileMetadataBuffer != null && c.write(s.fileMetadataBuffer), c.end();
        return;
      }
      const p = d + 1e3;
      i(s, {
        tasks: a,
        start: d,
        end: Math.min(a.length, p),
        oldFileFd: u
      }, c, () => f(p), l);
    };
    return f;
  }
  function i(s, a, c, u, l) {
    let f = "bytes=", d = 0, p = 0;
    const g = /* @__PURE__ */ new Map(), y = [];
    for (let C = a.start; C < a.end; C++) {
      const A = a.tasks[C];
      A.kind === r.OperationKind.DOWNLOAD && (f += `${A.start}-${A.end - 1}, `, g.set(d, C), d++, y.push(A.end - A.start), p += A.end - A.start);
    }
    if (d <= 1) {
      const C = (A) => {
        if (A >= a.end) {
          u();
          return;
        }
        const x = a.tasks[A++];
        if (x.kind === r.OperationKind.COPY)
          (0, t.copyData)(x, c, a.oldFileFd, l, () => C(A));
        else {
          const w = s.createRequestOptions();
          w.headers.Range = `bytes=${x.start}-${x.end - 1}`;
          const E = s.httpExecutor.createRequest(w, (b) => {
            b.on("error", l), o(b, l) && (b.pipe(c, {
              end: !1
            }), b.once("end", () => C(A)));
          });
          s.httpExecutor.addErrorAndTimeoutHandlers(E, l), E.end();
        }
      };
      C(a.start);
      return;
    }
    const m = s.createRequestOptions();
    m.headers.Range = f.substring(0, f.length - 2);
    const S = s.httpExecutor.createRequest(m, (C) => {
      if (!o(C, l))
        return;
      const A = (0, e.safeGetHeader)(C, "content-type"), x = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(A);
      if (x == null) {
        l(new Error(`Content-Type "multipart/byteranges" is expected, but got "${A}"`));
        return;
      }
      const w = new t.DataSplitter(c, a, g, x[1] || x[2], y, u, p, s.options.onProgress);
      w.on("error", l), C.pipe(w), C.on("end", () => {
        setTimeout(() => {
          S.abort(), l(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    s.httpExecutor.addErrorAndTimeoutHandlers(S, l), S.end();
  }
  function o(s, a) {
    if (s.statusCode >= 400)
      return a((0, e.createHttpError)(s)), !1;
    if (s.statusCode !== 206) {
      const c = (0, e.safeGetHeader)(s, "accept-ranges");
      if (c == null || c === "none")
        return a(new Error(`Server doesn't support Accept-Ranges (response code ${s.statusCode})`)), !1;
    }
    return !0;
  }
  return Gn;
}
var zn = {}, Ah;
function V0() {
  if (Ah) return zn;
  Ah = 1, Object.defineProperty(zn, "__esModule", { value: !0 }), zn.ProgressDifferentialDownloadCallbackTransform = void 0;
  const e = qt;
  var t;
  (function(n) {
    n[n.COPY = 0] = "COPY", n[n.DOWNLOAD = 1] = "DOWNLOAD";
  })(t || (t = {}));
  let r = class extends e.Transform {
    constructor(i, o, s) {
      super(), this.progressDifferentialDownloadInfo = i, this.cancellationToken = o, this.onProgress = s, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = t.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(i, o, s) {
      if (this.cancellationToken.cancelled) {
        s(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == t.COPY) {
        s(null, i);
        return;
      }
      this.transferred += i.length, this.delta += i.length;
      const a = Date.now();
      a >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = a + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((a - this.start) / 1e3))
      }), this.delta = 0), s(null, i);
    }
    beginFileCopy() {
      this.operationType = t.COPY;
    }
    beginRangeDownload() {
      this.operationType = t.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(i) {
      if (this.cancellationToken.cancelled) {
        i(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, i(null);
    }
  };
  return zn.ProgressDifferentialDownloadCallbackTransform = r, zn;
}
var Ph;
function Hm() {
  if (Ph) return jn;
  Ph = 1, Object.defineProperty(jn, "__esModule", { value: !0 }), jn.DifferentialDownloader = void 0;
  const e = et(), t = /* @__PURE__ */ yr(), r = Te, n = Wm(), i = er, o = yl(), s = z0(), a = V0();
  let c = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(d, p, g) {
      this.blockAwareFileInfo = d, this.httpExecutor = p, this.options = g, this.fileMetadataBuffer = null, this.logger = g.logger;
    }
    createRequestOptions() {
      const d = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, e.configureRequestUrl)(this.options.newUrl, d), (0, e.configureRequestOptions)(d), d;
    }
    doDownload(d, p) {
      if (d.version !== p.version)
        throw new Error(`version is different (${d.version} - ${p.version}), full download is required`);
      const g = this.logger, y = (0, o.computeOperations)(d, p, g);
      g.debug != null && g.debug(JSON.stringify(y, null, 2));
      let m = 0, S = 0;
      for (const A of y) {
        const x = A.end - A.start;
        A.kind === o.OperationKind.DOWNLOAD ? m += x : S += x;
      }
      const C = this.blockAwareFileInfo.size;
      if (m + S + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== C)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${S}, newSize: ${C}`);
      return g.info(`Full: ${u(C)}, To download: ${u(m)} (${Math.round(m / (C / 100))}%)`), this.downloadFile(y);
    }
    downloadFile(d) {
      const p = [], g = () => Promise.all(p.map((y) => (0, t.close)(y.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${y.path}": ${m}`);
      })));
      return this.doDownloadFile(d, p).then(g).catch((y) => g().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (S) {
          try {
            console.error(S);
          } catch {
          }
        }
        throw y;
      }).then(() => {
        throw y;
      }));
    }
    async doDownloadFile(d, p) {
      const g = await (0, t.open)(this.options.oldFile, "r");
      p.push({ descriptor: g, path: this.options.oldFile });
      const y = await (0, t.open)(this.options.newFile, "w");
      p.push({ descriptor: y, path: this.options.newFile });
      const m = (0, r.createWriteStream)(this.options.newFile, { fd: y });
      await new Promise((S, C) => {
        const A = [];
        let x;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const k = [];
          let M = 0;
          for (const F of d)
            F.kind === o.OperationKind.DOWNLOAD && (k.push(F.end - F.start), M += F.end - F.start);
          const N = {
            expectedByteCounts: k,
            grandTotal: M
          };
          x = new a.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), A.push(x);
        }
        const w = new e.DigestTransform(this.blockAwareFileInfo.sha512);
        w.isValidateOnEnd = !1, A.push(w), m.on("finish", () => {
          m.close(() => {
            p.splice(1, 1);
            try {
              w.validate();
            } catch (k) {
              C(k);
              return;
            }
            S(void 0);
          });
        }), A.push(m);
        let E = null;
        for (const k of A)
          k.on("error", C), E == null ? E = k : E = E.pipe(k);
        const b = A[0];
        let v;
        if (this.options.isUseMultipleRangeRequest) {
          v = (0, s.executeTasksUsingMultipleRangeRequests)(this, d, b, g, C), v(0);
          return;
        }
        let P = 0, T = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const U = this.createRequestOptions();
        U.redirect = "manual", v = (k) => {
          var M, N;
          if (k >= d.length) {
            this.fileMetadataBuffer != null && b.write(this.fileMetadataBuffer), b.end();
            return;
          }
          const F = d[k++];
          if (F.kind === o.OperationKind.COPY) {
            x && x.beginFileCopy(), (0, n.copyData)(F, b, g, C, () => v(k));
            return;
          }
          const $ = `bytes=${F.start}-${F.end - 1}`;
          U.headers.range = $, (N = (M = this.logger) === null || M === void 0 ? void 0 : M.debug) === null || N === void 0 || N.call(M, `download range: ${$}`), x && x.beginRangeDownload();
          const O = this.httpExecutor.createRequest(U, (G) => {
            G.on("error", C), G.on("aborted", () => {
              C(new Error("response has been aborted by the server"));
            }), G.statusCode >= 400 && C((0, e.createHttpError)(G)), G.pipe(b, {
              end: !1
            }), G.once("end", () => {
              x && x.endRangeDownload(), ++P === 100 ? (P = 0, setTimeout(() => v(k), 1e3)) : v(k);
            });
          });
          O.on("redirect", (G, Y, ie) => {
            this.logger.info(`Redirect to ${l(ie)}`), T = ie, (0, e.configureRequestUrl)(new i.URL(T), U), O.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(O, C), O.end();
        }, v(0);
      });
    }
    async readRemoteBytes(d, p) {
      const g = Buffer.allocUnsafe(p + 1 - d), y = this.createRequestOptions();
      y.headers.range = `bytes=${d}-${p}`;
      let m = 0;
      if (await this.request(y, (S) => {
        S.copy(g, m), m += S.length;
      }), m !== g.length)
        throw new Error(`Received data length ${m} is not equal to expected ${g.length}`);
      return g;
    }
    request(d, p) {
      return new Promise((g, y) => {
        const m = this.httpExecutor.createRequest(d, (S) => {
          (0, s.checkIsRangesSupported)(S, y) && (S.on("error", y), S.on("aborted", () => {
            y(new Error("response has been aborted by the server"));
          }), S.on("data", p), S.on("end", () => g()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, y), m.end();
      });
    }
  };
  jn.DifferentialDownloader = c;
  function u(f, d = " KB") {
    return new Intl.NumberFormat("en").format((f / 1024).toFixed(2)) + d;
  }
  function l(f) {
    const d = f.indexOf("?");
    return d < 0 ? f : f.substring(0, d);
  }
  return jn;
}
var Ih;
function Y0() {
  if (Ih) return Hn;
  Ih = 1, Object.defineProperty(Hn, "__esModule", { value: !0 }), Hn.GenericDifferentialDownloader = void 0;
  const e = Hm();
  let t = class extends e.DifferentialDownloader {
    download(n, i) {
      return this.doDownload(n, i);
    }
  };
  return Hn.GenericDifferentialDownloader = t, Hn;
}
var wc = {}, Dh;
function Mr() {
  return Dh || (Dh = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
    const t = et();
    Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
    class r {
      constructor(o) {
        this.emitter = o;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(o) {
        n(this.emitter, "login", o);
      }
      progress(o) {
        n(this.emitter, e.DOWNLOAD_PROGRESS, o);
      }
      updateDownloaded(o) {
        n(this.emitter, e.UPDATE_DOWNLOADED, o);
      }
      updateCancelled(o) {
        n(this.emitter, "update-cancelled", o);
      }
    }
    e.UpdaterSignal = r;
    function n(i, o, s) {
      i.on(o, s);
    }
  })(wc)), wc;
}
var xh;
function vl() {
  if (xh) return Rr;
  xh = 1, Object.defineProperty(Rr, "__esModule", { value: !0 }), Rr.NoOpLogger = Rr.AppUpdater = void 0;
  const e = et(), t = _t, r = Ps, n = Rs, i = /* @__PURE__ */ yr(), o = ul(), s = d0(), a = Q, c = Mm(), u = U0(), l = $0(), f = B0(), d = Bm(), p = G0(), g = kc, y = Y0(), m = Mr();
  let S = class jm extends n.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(w) {
      if (this._channel != null) {
        if (typeof w != "string")
          throw (0, e.newError)(`Channel must be a string, but got: ${w}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (w.length === 0)
          throw (0, e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = w, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(w) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: w
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, f.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(w) {
      this._logger = w ?? new A();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(w) {
      this.clientPromise = null, this._appUpdateConfigPath = w, this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(w) {
      w && (this._isUpdateSupported = w);
    }
    /**
     * Allows developer to override default logic for determining if the user is below the rollout threshold.
     * The default logic compares the staging percentage with numerical representation of user ID.
     * An override can define custom logic, or bypass it if needed.
     */
    get isUserWithinRollout() {
      return this._isUserWithinRollout;
    }
    set isUserWithinRollout(w) {
      w && (this._isUserWithinRollout = w);
    }
    constructor(w, E) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new m.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (P) => this.checkIfUpdateSupported(P), this._isUserWithinRollout = (P) => this.isStagingMatch(P), this.clientPromise = null, this.stagingUserIdPromise = new s.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (P) => {
        this._logger.error(`Error: ${P.stack || P.message}`);
      }), E == null ? (this.app = new l.ElectronAppAdapter(), this.httpExecutor = new f.ElectronHttpExecutor((P, T) => this.emit("login", P, T))) : (this.app = E, this.httpExecutor = null);
      const b = this.app.version, v = (0, c.parse)(b);
      if (v == null)
        throw (0, e.newError)(`App version is not a valid semver version: "${b}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = v, this.allowPrerelease = C(v), w != null && (this.setFeedURL(w), typeof w != "string" && w.requestHeaders && (this.requestHeaders = w.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(w) {
      const E = this.createProviderRuntimeOptions();
      let b;
      typeof w == "string" ? b = new d.GenericProvider({ provider: "generic", url: w }, this, {
        ...E,
        isUseMultipleRangeRequest: (0, p.isUrlProbablySupportMultiRangeRequests)(w)
      }) : b = (0, p.createClient)(w, this, E), this.clientPromise = Promise.resolve(b);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let w = this.checkForUpdatesPromise;
      if (w != null)
        return this._logger.info("Checking for update (already in progress)"), w;
      const E = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), w = this.doCheckForUpdates().then((b) => (E(), b)).catch((b) => {
        throw E(), this.emit("error", b, `Cannot check for updates: ${(b.stack || b).toString()}`), b;
      }), this.checkForUpdatesPromise = w, w;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(w) {
      return this.checkForUpdates().then((E) => E != null && E.downloadPromise ? (E.downloadPromise.then(() => {
        const b = jm.formatDownloadNotification(E.updateInfo.version, this.app.name, w);
        new Or.Notification(b).show();
      }), E) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), E));
    }
    static formatDownloadNotification(w, E, b) {
      return b == null && (b = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), b = {
        title: b.title.replace("{appName}", E).replace("{version}", w),
        body: b.body.replace("{appName}", E).replace("{version}", w)
      }, b;
    }
    async isStagingMatch(w) {
      const E = w.stagingPercentage;
      let b = E;
      if (b == null)
        return !0;
      if (b = parseInt(b, 10), isNaN(b))
        return this._logger.warn(`Staging percentage is NaN: ${E}`), !0;
      b = b / 100;
      const v = await this.stagingUserIdPromise.value, T = e.UUID.parse(v).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${b}, percentage: ${T}, user id: ${v}`), T < b;
    }
    computeFinalHeaders(w) {
      return this.requestHeaders != null && Object.assign(w, this.requestHeaders), w;
    }
    async isUpdateAvailable(w) {
      const E = (0, c.parse)(w.version);
      if (E == null)
        throw (0, e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${w.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const b = this.currentVersion;
      if ((0, c.eq)(E, b) || !await Promise.resolve(this.isUpdateSupported(w)) || !await Promise.resolve(this.isUserWithinRollout(w)))
        return !1;
      const P = (0, c.gt)(E, b), T = (0, c.lt)(E, b);
      return P ? !0 : this.allowDowngrade && T;
    }
    checkIfUpdateSupported(w) {
      const E = w == null ? void 0 : w.minimumSystemVersion, b = (0, r.release)();
      if (E)
        try {
          if ((0, c.lt)(b, E))
            return this._logger.info(`Current OS version ${b} is less than the minimum OS version required ${E} for version ${b}`), !1;
        } catch (v) {
          this._logger.warn(`Failed to compare current OS version(${b}) with minimum OS version(${E}): ${(v.message || v).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((b) => (0, p.createClient)(b, this, this.createProviderRuntimeOptions())));
      const w = await this.clientPromise, E = await this.stagingUserIdPromise.value;
      return w.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": E })), {
        info: await w.getLatestVersion(),
        provider: w
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const w = await this.getUpdateInfoAndProvider(), E = w.info;
      if (!await this.isUpdateAvailable(E))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${E.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", E), {
          isUpdateAvailable: !1,
          versionInfo: E,
          updateInfo: E
        };
      this.updateInfoAndProvider = w, this.onUpdateAvailable(E);
      const b = new e.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: E,
        updateInfo: E,
        cancellationToken: b,
        downloadPromise: this.autoDownload ? this.downloadUpdate(b) : null
      };
    }
    onUpdateAvailable(w) {
      this._logger.info(`Found version ${w.version} (url: ${(0, e.asArray)(w.files).map((E) => E.url).join(", ")})`), this.emit("update-available", w);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(w = new e.CancellationToken()) {
      const E = this.updateInfoAndProvider;
      if (E == null) {
        const v = new Error("Please check update first");
        return this.dispatchError(v), Promise.reject(v);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, e.asArray)(E.info.files).map((v) => v.url).join(", ")}`);
      const b = (v) => {
        if (!(v instanceof e.CancellationError))
          try {
            this.dispatchError(v);
          } catch (P) {
            this._logger.warn(`Cannot dispatch error event: ${P.stack || P}`);
          }
        return v;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: E,
        requestHeaders: this.computeRequestHeaders(E.provider),
        cancellationToken: w,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((v) => {
        throw b(v);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(w) {
      this.emit("error", w, (w.stack || w).toString());
    }
    dispatchUpdateDownloaded(w) {
      this.emit(m.UPDATE_DOWNLOADED, w);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, o.load)(await (0, i.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(w) {
      const E = w.fileExtraDownloadHeaders;
      if (E != null) {
        const b = this.requestHeaders;
        return b == null ? E : {
          ...E,
          ...b
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const w = a.join(this.app.userDataPath, ".updaterId");
      try {
        const b = await (0, i.readFile)(w, "utf-8");
        if (e.UUID.check(b))
          return b;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${b}`);
      } catch (b) {
        b.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${b}`);
      }
      const E = e.UUID.v5((0, t.randomBytes)(4096), e.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${E}`);
      try {
        await (0, i.outputFile)(w, E);
      } catch (b) {
        this._logger.warn(`Couldn't write out staging user ID: ${b}`);
      }
      return E;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const w = this.requestHeaders;
      if (w == null)
        return !0;
      for (const E of Object.keys(w)) {
        const b = E.toLowerCase();
        if (b === "authorization" || b === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let w = this.downloadedUpdateHelper;
      if (w == null) {
        const E = (await this.configOnDisk.value).updaterCacheDirName, b = this._logger;
        E == null && b.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const v = a.join(this.app.baseCachePath, E || this.app.name);
        b.debug != null && b.debug(`updater cache dir: ${v}`), w = new u.DownloadedUpdateHelper(v), this.downloadedUpdateHelper = w;
      }
      return w;
    }
    async executeDownload(w) {
      const E = w.fileInfo, b = {
        headers: w.downloadUpdateOptions.requestHeaders,
        cancellationToken: w.downloadUpdateOptions.cancellationToken,
        sha2: E.info.sha2,
        sha512: E.info.sha512
      };
      this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (b.onProgress = (ne) => this.emit(m.DOWNLOAD_PROGRESS, ne));
      const v = w.downloadUpdateOptions.updateInfoAndProvider.info, P = v.version, T = E.packageInfo;
      function U() {
        const ne = decodeURIComponent(w.fileInfo.url.pathname);
        return ne.toLowerCase().endsWith(`.${w.fileExtension.toLowerCase()}`) ? a.basename(ne) : w.fileInfo.info.url;
      }
      const k = await this.getOrCreateDownloadHelper(), M = k.cacheDirForPendingUpdate;
      await (0, i.mkdir)(M, { recursive: !0 });
      const N = U();
      let F = a.join(M, N);
      const $ = T == null ? null : a.join(M, `package-${P}${a.extname(T.path) || ".7z"}`), O = async (ne) => {
        await k.setDownloadedFile(F, $, v, E, N, ne), await w.done({
          ...v,
          downloadedFile: F
        });
        const Ie = a.join(M, "current.blockmap");
        return await (0, i.pathExists)(Ie) && await (0, i.copyFile)(Ie, a.join(k.cacheDir, "current.blockmap")), $ == null ? [F] : [F, $];
      }, G = this._logger, Y = await k.validateDownloadedPath(F, v, E, G);
      if (Y != null)
        return F = Y, await O(!1);
      const ie = async () => (await k.clear().catch(() => {
      }), await (0, i.unlink)(F).catch(() => {
      })), we = await (0, u.createTempUpdateFile)(`temp-${N}`, M, G);
      try {
        await w.task(we, b, $, ie), await (0, e.retry)(() => (0, i.rename)(we, F), {
          retries: 60,
          interval: 500,
          shouldRetry: (ne) => ne instanceof Error && /^EBUSY:/.test(ne.message) ? !0 : (G.warn(`Cannot rename temp file to final file: ${ne.message || ne.stack}`), !1)
        });
      } catch (ne) {
        throw await ie(), ne instanceof e.CancellationError && (G.info("cancelled"), this.emit("update-cancelled", v)), ne;
      }
      return G.info(`New version ${P} has been downloaded to ${F}`), await O(!0);
    }
    async differentialDownloadInstaller(w, E, b, v, P) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const T = E.updateInfoAndProvider.provider, U = await T.getBlockMapFiles(w.url, this.app.version, E.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
        this._logger.info(`Download block maps (old: "${U[0]}", new: ${U[1]})`);
        const k = async (G) => {
          const Y = await this.httpExecutor.downloadToBuffer(G, {
            headers: E.requestHeaders,
            cancellationToken: E.cancellationToken
          });
          if (Y == null || Y.length === 0)
            throw new Error(`Blockmap "${G.href}" is empty`);
          try {
            return JSON.parse((0, g.gunzipSync)(Y).toString());
          } catch (ie) {
            throw new Error(`Cannot parse blockmap "${G.href}", error: ${ie}`);
          }
        }, M = {
          newUrl: w.url,
          oldFile: a.join(this.downloadedUpdateHelper.cacheDir, P),
          logger: this._logger,
          newFile: b,
          isUseMultipleRangeRequest: T.isUseMultipleRangeRequest,
          requestHeaders: E.requestHeaders,
          cancellationToken: E.cancellationToken
        };
        this.listenerCount(m.DOWNLOAD_PROGRESS) > 0 && (M.onProgress = (G) => this.emit(m.DOWNLOAD_PROGRESS, G));
        const N = async (G, Y) => {
          const ie = a.join(Y, "current.blockmap");
          await (0, i.outputFile)(ie, (0, g.gzipSync)(JSON.stringify(G)));
        }, F = async (G) => {
          const Y = a.join(G, "current.blockmap");
          try {
            if (await (0, i.pathExists)(Y))
              return JSON.parse((0, g.gunzipSync)(await (0, i.readFile)(Y)).toString());
          } catch (ie) {
            this._logger.warn(`Cannot parse blockmap "${Y}", error: ${ie}`);
          }
          return null;
        }, $ = await k(U[1]);
        await N($, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
        let O = await F(this.downloadedUpdateHelper.cacheDir);
        return O == null && (O = await k(U[0])), await new y.GenericDifferentialDownloader(w.info, this.httpExecutor, M).download(O, $), !1;
      } catch (T) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${T.stack || T}`), this._testOnlyOptions != null)
          throw T;
        return !0;
      }
    }
  };
  Rr.AppUpdater = S;
  function C(x) {
    const w = (0, c.prerelease)(x);
    return w != null && w.length > 0;
  }
  class A {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(w) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(w) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(w) {
    }
  }
  return Rr.NoOpLogger = A, Rr;
}
var Nh;
function Gs() {
  if (Nh) return Nn;
  Nh = 1, Object.defineProperty(Nn, "__esModule", { value: !0 }), Nn.BaseUpdater = void 0;
  const e = As, t = vl();
  let r = class extends t.AppUpdater {
    constructor(i, o) {
      super(i, o), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(i = !1, o = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(i, i ? o : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Or.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(i) {
      return super.executeDownload({
        ...i,
        done: (o) => (this.dispatchUpdateDownloaded(o), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(i = !1, o = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const s = this.downloadedUpdateHelper, a = this.installerPath, c = s == null ? null : s.downloadedFileInfo;
      if (a == null || c == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${i}, isForceRunAfter: ${o}`), this.doInstall({
          isSilent: i,
          isForceRunAfter: o,
          isAdminRightsRequired: c.isAdminRightsRequired
        });
      } catch (u) {
        return this.dispatchError(u), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((i) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (i !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${i}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    spawnSyncLog(i, o = [], s = {}) {
      this._logger.info(`Executing: ${i} with args: ${o}`);
      const a = (0, e.spawnSync)(i, o, {
        env: { ...process.env, ...s },
        encoding: "utf-8",
        shell: !0
      }), { error: c, status: u, stdout: l, stderr: f } = a;
      if (c != null)
        throw this._logger.error(f), c;
      if (u != null && u !== 0)
        throw this._logger.error(f), new Error(`Command ${i} exited with code ${u}`);
      return l.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(i, o = [], s = void 0, a = "ignore") {
      return this._logger.info(`Executing: ${i} with args: ${o}`), new Promise((c, u) => {
        try {
          const l = { stdio: a, env: s, detached: !0 }, f = (0, e.spawn)(i, o, l);
          f.on("error", (d) => {
            u(d);
          }), f.unref(), f.pid !== void 0 && c(!0);
        } catch (l) {
          u(l);
        }
      });
    }
  };
  return Nn.BaseUpdater = r, Nn;
}
var Vn = {}, Yn = {}, Oh;
function Gm() {
  if (Oh) return Yn;
  Oh = 1, Object.defineProperty(Yn, "__esModule", { value: !0 }), Yn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const e = /* @__PURE__ */ yr(), t = Hm(), r = kc;
  let n = class extends t.DifferentialDownloader {
    async download() {
      const a = this.blockAwareFileInfo, c = a.size, u = c - (a.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(u, c - 1);
      const l = i(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await o(this.options.oldFile), l);
    }
  };
  Yn.FileWithEmbeddedBlockMapDifferentialDownloader = n;
  function i(s) {
    return JSON.parse((0, r.inflateRawSync)(s).toString());
  }
  async function o(s) {
    const a = await (0, e.open)(s, "r");
    try {
      const c = (await (0, e.fstat)(a)).size, u = Buffer.allocUnsafe(4);
      await (0, e.read)(a, u, 0, u.length, c - u.length);
      const l = Buffer.allocUnsafe(u.readUInt32BE(0));
      return await (0, e.read)(a, l, 0, l.length, c - u.length - l.length), await (0, e.close)(a), i(l);
    } catch (c) {
      throw await (0, e.close)(a), c;
    }
  }
  return Yn;
}
var Lh;
function Fh() {
  if (Lh) return Vn;
  Lh = 1, Object.defineProperty(Vn, "__esModule", { value: !0 }), Vn.AppImageUpdater = void 0;
  const e = et(), t = As, r = /* @__PURE__ */ yr(), n = Te, i = Q, o = Gs(), s = Gm(), a = bt(), c = Mr();
  let u = class extends o.BaseUpdater {
    constructor(f, d) {
      super(f, d);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(f) {
      const d = f.updateInfoAndProvider.provider, p = (0, a.findFile)(d.resolveFiles(f.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: p,
        downloadUpdateOptions: f,
        task: async (g, y) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (f.disableDifferentialDownload || await this.downloadDifferential(p, m, g, d, f)) && await this.httpExecutor.download(p.url, g, y), await (0, r.chmod)(g, 493);
        }
      });
    }
    async downloadDifferential(f, d, p, g, y) {
      try {
        const m = {
          newUrl: f.url,
          oldFile: d,
          logger: this._logger,
          newFile: p,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          requestHeaders: y.requestHeaders,
          cancellationToken: y.cancellationToken
        };
        return this.listenerCount(c.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (S) => this.emit(c.DOWNLOAD_PROGRESS, S)), await new s.FileWithEmbeddedBlockMapDifferentialDownloader(f.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(f) {
      const d = process.env.APPIMAGE;
      if (d == null)
        throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, n.unlinkSync)(d);
      let p;
      const g = i.basename(d), y = this.installerPath;
      if (y == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      i.basename(y) === g || !/\d+\.\d+\.\d+/.test(g) ? p = d : p = i.join(i.dirname(d), i.basename(y)), (0, t.execFileSync)("mv", ["-f", y, p]), p !== d && this.emit("appimage-filename-updated", p);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return f.isForceRunAfter ? this.spawnLog(p, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, t.execFileSync)(p, [], { env: m })), !0;
    }
  };
  return Vn.AppImageUpdater = u, Vn;
}
var Kn = {}, Xn = {}, kh;
function wl() {
  if (kh) return Xn;
  kh = 1, Object.defineProperty(Xn, "__esModule", { value: !0 }), Xn.LinuxUpdater = void 0;
  const e = Gs();
  let t = class extends e.BaseUpdater {
    constructor(n, i) {
      super(n, i);
    }
    /**
     * Returns true if the current process is running as root.
     */
    isRunningAsRoot() {
      var n;
      return ((n = process.getuid) === null || n === void 0 ? void 0 : n.call(process)) === 0;
    }
    /**
     * Sanitizies the installer path for using with command line tools.
     */
    get installerPath() {
      var n, i;
      return (i = (n = super.installerPath) === null || n === void 0 ? void 0 : n.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && i !== void 0 ? i : null;
    }
    runCommandWithSudoIfNeeded(n) {
      if (this.isRunningAsRoot())
        return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(n[0], n.slice(1));
      const { name: i } = this.app, o = `"${i} would like to update"`, s = this.sudoWithArgs(o);
      this._logger.info(`Running as non-root user, using sudo to install: ${s}`);
      let a = '"';
      return (/pkexec/i.test(s[0]) || s[0] === "sudo") && (a = ""), this.spawnSyncLog(s[0], [...s.length > 1 ? s.slice(1) : [], `${a}/bin/bash`, "-c", `'${n.join(" ")}'${a}`]);
    }
    sudoWithArgs(n) {
      const i = this.determineSudoCommand(), o = [i];
      return /kdesudo/i.test(i) ? (o.push("--comment", n), o.push("-c")) : /gksudo/i.test(i) ? o.push("--message", n) : /pkexec/i.test(i) && o.push("--disable-internal-agent"), o;
    }
    hasCommand(n) {
      try {
        return this.spawnSyncLog("command", ["-v", n]), !0;
      } catch {
        return !1;
      }
    }
    determineSudoCommand() {
      const n = ["gksudo", "kdesudo", "pkexec", "beesu"];
      for (const i of n)
        if (this.hasCommand(i))
          return i;
      return "sudo";
    }
    /**
     * Detects the package manager to use based on the available commands.
     * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
     * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
     * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
     * @param pms - An array of package manager commands to check for, in priority order.
     * @returns The detected package manager command or "unknown" if none are found.
     */
    detectPackageManager(n) {
      var i;
      const o = (i = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || i === void 0 ? void 0 : i.trim();
      if (o)
        return o;
      for (const s of n)
        if (this.hasCommand(s))
          return s;
      return this._logger.warn(`No package manager found in the list: ${n.join(", ")}. Defaulting to the first one: ${n[0]}`), n[0];
    }
  };
  return Xn.LinuxUpdater = t, Xn;
}
var Uh;
function Mh() {
  if (Uh) return Kn;
  Uh = 1, Object.defineProperty(Kn, "__esModule", { value: !0 }), Kn.DebUpdater = void 0;
  const e = bt(), t = Mr(), r = wl();
  let n = class zm extends r.LinuxUpdater {
    constructor(o, s) {
      super(o, s);
    }
    /*** @private */
    doDownloadUpdate(o) {
      const s = o.updateInfoAndProvider.provider, a = (0, e.findFile)(s.resolveFiles(o.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: a,
        downloadUpdateOptions: o,
        task: async (c, u) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (l) => this.emit(t.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(a.url, c, u);
        }
      });
    }
    doInstall(o) {
      const s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
        return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
      const a = ["dpkg", "apt"], c = this.detectPackageManager(a);
      try {
        zm.installWithCommandRunner(c, s, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (u) {
        return this.dispatchError(u), !1;
      }
      return o.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(o, s, a, c) {
      var u;
      if (o === "dpkg")
        try {
          a(["dpkg", "-i", s]);
        } catch (l) {
          c.warn((u = l.message) !== null && u !== void 0 ? u : l), c.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), a(["apt-get", "install", "-f", "-y"]);
        }
      else if (o === "apt")
        c.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), a([
          "apt",
          "install",
          "-y",
          "--allow-unauthenticated",
          // needed for unsigned .debs
          "--allow-downgrades",
          // allow lower version installs
          "--allow-change-held-packages",
          s
        ]);
      else
        throw new Error(`Package manager ${o} not supported`);
    }
  };
  return Kn.DebUpdater = n, Kn;
}
var Jn = {}, $h;
function Bh() {
  if ($h) return Jn;
  $h = 1, Object.defineProperty(Jn, "__esModule", { value: !0 }), Jn.PacmanUpdater = void 0;
  const e = Mr(), t = bt(), r = wl();
  let n = class Vm extends r.LinuxUpdater {
    constructor(o, s) {
      super(o, s);
    }
    /*** @private */
    doDownloadUpdate(o) {
      const s = o.updateInfoAndProvider.provider, a = (0, t.findFile)(s.resolveFiles(o.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: a,
        downloadUpdateOptions: o,
        task: async (c, u) => {
          this.listenerCount(e.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (l) => this.emit(e.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(a.url, c, u);
        }
      });
    }
    doInstall(o) {
      const s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      try {
        Vm.installWithCommandRunner(s, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (a) {
        return this.dispatchError(a), !1;
      }
      return o.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(o, s, a) {
      var c;
      try {
        s(["pacman", "-U", "--noconfirm", o]);
      } catch (u) {
        a.warn((c = u.message) !== null && c !== void 0 ? c : u), a.warn("pacman installation failed, attempting to update package database and retry");
        try {
          s(["pacman", "-Sy", "--noconfirm"]), s(["pacman", "-U", "--noconfirm", o]);
        } catch (l) {
          throw a.error("Retry after pacman -Sy failed"), l;
        }
      }
    }
  };
  return Jn.PacmanUpdater = n, Jn;
}
var Qn = {}, qh;
function Wh() {
  if (qh) return Qn;
  qh = 1, Object.defineProperty(Qn, "__esModule", { value: !0 }), Qn.RpmUpdater = void 0;
  const e = Mr(), t = bt(), r = wl();
  let n = class Ym extends r.LinuxUpdater {
    constructor(o, s) {
      super(o, s);
    }
    /*** @private */
    doDownloadUpdate(o) {
      const s = o.updateInfoAndProvider.provider, a = (0, t.findFile)(s.resolveFiles(o.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: a,
        downloadUpdateOptions: o,
        task: async (c, u) => {
          this.listenerCount(e.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (l) => this.emit(e.DOWNLOAD_PROGRESS, l)), await this.httpExecutor.download(a.url, c, u);
        }
      });
    }
    doInstall(o) {
      const s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const a = ["zypper", "dnf", "yum", "rpm"], c = this.detectPackageManager(a);
      try {
        Ym.installWithCommandRunner(c, s, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
      } catch (u) {
        return this.dispatchError(u), !1;
      }
      return o.isForceRunAfter && this.app.relaunch(), !0;
    }
    static installWithCommandRunner(o, s, a, c) {
      if (o === "zypper")
        return a(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", s]);
      if (o === "dnf")
        return a(["dnf", "install", "--nogpgcheck", "-y", s]);
      if (o === "yum")
        return a(["yum", "install", "--nogpgcheck", "-y", s]);
      if (o === "rpm")
        return c.warn("Installing with rpm only (no dependency resolution)."), a(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", s]);
      throw new Error(`Package manager ${o} not supported`);
    }
  };
  return Qn.RpmUpdater = n, Qn;
}
var Zn = {}, Hh;
function jh() {
  if (Hh) return Zn;
  Hh = 1, Object.defineProperty(Zn, "__esModule", { value: !0 }), Zn.MacUpdater = void 0;
  const e = et(), t = /* @__PURE__ */ yr(), r = Te, n = Q, i = hi, o = vl(), s = bt(), a = As, c = _t;
  let u = class extends o.AppUpdater {
    constructor(f, d) {
      super(f, d), this.nativeUpdater = Or.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (p) => {
        this._logger.warn(p), this.emit("error", p);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(f) {
      this._logger.debug != null && this._logger.debug(f);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((f) => {
        f && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(f) {
      let d = f.updateInfoAndProvider.provider.resolveFiles(f.updateInfoAndProvider.info);
      const p = this._logger, g = "sysctl.proc_translated";
      let y = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), y = (0, a.execFileSync)("sysctl", [g], { encoding: "utf8" }).includes(`${g}: 1`), p.info(`Checked for macOS Rosetta environment (isRosetta=${y})`);
      } catch (w) {
        p.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${w}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const E = (0, a.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        p.info(`Checked 'uname -a': arm64=${E}`), m = m || E;
      } catch (w) {
        p.warn(`uname shell command to check for arm64 failed: ${w}`);
      }
      m = m || process.arch === "arm64" || y;
      const S = (w) => {
        var E;
        return w.url.pathname.includes("arm64") || ((E = w.info.url) === null || E === void 0 ? void 0 : E.includes("arm64"));
      };
      m && d.some(S) ? d = d.filter((w) => m === S(w)) : d = d.filter((w) => !S(w));
      const C = (0, s.findFile)(d, "zip", ["pkg", "dmg"]);
      if (C == null)
        throw (0, e.newError)(`ZIP file not provided: ${(0, e.safeStringifyJson)(d)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const A = f.updateInfoAndProvider.provider, x = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: C,
        downloadUpdateOptions: f,
        task: async (w, E) => {
          const b = n.join(this.downloadedUpdateHelper.cacheDir, x), v = () => (0, t.pathExistsSync)(b) ? !f.disableDifferentialDownload : (p.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let P = !0;
          v() && (P = await this.differentialDownloadInstaller(C, f, w, A, x)), P && await this.httpExecutor.download(C.url, w, E);
        },
        done: async (w) => {
          if (!f.disableDifferentialDownload)
            try {
              const E = n.join(this.downloadedUpdateHelper.cacheDir, x);
              await (0, t.copyFile)(w.downloadedFile, E);
            } catch (E) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${E.message}`);
            }
          return this.updateDownloaded(C, w);
        }
      });
    }
    async updateDownloaded(f, d) {
      var p;
      const g = d.downloadedFile, y = (p = f.info.size) !== null && p !== void 0 ? p : (await (0, t.stat)(g)).size, m = this._logger, S = `fileToProxy=${f.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${S})`), this.server = (0, i.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${S})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${S})`);
      });
      const C = (A) => {
        const x = A.address();
        return typeof x == "string" ? x : `http://127.0.0.1:${x == null ? void 0 : x.port}`;
      };
      return await new Promise((A, x) => {
        const w = (0, c.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), E = Buffer.from(`autoupdater:${w}`, "ascii"), b = `/${(0, c.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (v, P) => {
          const T = v.url;
          if (m.info(`${T} requested`), T === "/") {
            if (!v.headers.authorization || v.headers.authorization.indexOf("Basic ") === -1) {
              P.statusCode = 401, P.statusMessage = "Invalid Authentication Credentials", P.end(), m.warn("No authenthication info");
              return;
            }
            const M = v.headers.authorization.split(" ")[1], N = Buffer.from(M, "base64").toString("ascii"), [F, $] = N.split(":");
            if (F !== "autoupdater" || $ !== w) {
              P.statusCode = 401, P.statusMessage = "Invalid Authentication Credentials", P.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const O = Buffer.from(`{ "url": "${C(this.server)}${b}" }`);
            P.writeHead(200, { "Content-Type": "application/json", "Content-Length": O.length }), P.end(O);
            return;
          }
          if (!T.startsWith(b)) {
            m.warn(`${T} requested, but not supported`), P.writeHead(404), P.end();
            return;
          }
          m.info(`${b} requested by Squirrel.Mac, pipe ${g}`);
          let U = !1;
          P.on("finish", () => {
            U || (this.nativeUpdater.removeListener("error", x), A([]));
          });
          const k = (0, r.createReadStream)(g);
          k.on("error", (M) => {
            try {
              P.end();
            } catch (N) {
              m.warn(`cannot end response: ${N}`);
            }
            U = !0, this.nativeUpdater.removeListener("error", x), x(new Error(`Cannot pipe "${g}": ${M}`));
          }), P.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": y
          }), k.pipe(P);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${S})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${C(this.server)}, ${S})`), this.nativeUpdater.setFeedURL({
            url: C(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${E.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(d), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", x), this.nativeUpdater.checkForUpdates()) : A([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return Zn.MacUpdater = u, Zn;
}
var ei = {}, Zi = {}, Gh;
function K0() {
  if (Gh) return Zi;
  Gh = 1, Object.defineProperty(Zi, "__esModule", { value: !0 }), Zi.verifySignature = o;
  const e = et(), t = As, r = Ps, n = Q;
  function i(u, l) {
    return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", u], {
      shell: !0,
      timeout: l
    }];
  }
  function o(u, l, f) {
    return new Promise((d, p) => {
      const g = l.replace(/'/g, "''");
      f.info(`Verifying signature ${g}`), (0, t.execFile)(...i(`"Get-AuthenticodeSignature -LiteralPath '${g}' | ConvertTo-Json -Compress"`, 20 * 1e3), (y, m, S) => {
        var C;
        try {
          if (y != null || S) {
            a(f, y, S, p), d(null);
            return;
          }
          const A = s(m);
          if (A.Status === 0) {
            try {
              const b = n.normalize(A.Path), v = n.normalize(l);
              if (f.info(`LiteralPath: ${b}. Update Path: ${v}`), b !== v) {
                a(f, new Error(`LiteralPath of ${b} is different than ${v}`), S, p), d(null);
                return;
              }
            } catch (b) {
              f.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(C = b.message) !== null && C !== void 0 ? C : b.stack}`);
            }
            const w = (0, e.parseDn)(A.SignerCertificate.Subject);
            let E = !1;
            for (const b of u) {
              const v = (0, e.parseDn)(b);
              if (v.size ? E = Array.from(v.keys()).every((T) => v.get(T) === w.get(T)) : b === w.get("CN") && (f.warn(`Signature validated using only CN ${b}. Please add your full Distinguished Name (DN) to publisherNames configuration`), E = !0), E) {
                d(null);
                return;
              }
            }
          }
          const x = `publisherNames: ${u.join(" | ")}, raw info: ` + JSON.stringify(A, (w, E) => w === "RawData" ? void 0 : E, 2);
          f.warn(`Sign verification failed, installer signed with incorrect certificate: ${x}`), d(x);
        } catch (A) {
          a(f, A, null, p), d(null);
          return;
        }
      });
    });
  }
  function s(u) {
    const l = JSON.parse(u);
    delete l.PrivateKey, delete l.IsOSBinary, delete l.SignatureType;
    const f = l.SignerCertificate;
    return f != null && (delete f.Archived, delete f.Extensions, delete f.Handle, delete f.HasPrivateKey, delete f.SubjectName), l;
  }
  function a(u, l, f, d) {
    if (c()) {
      u.warn(`Cannot execute Get-AuthenticodeSignature: ${l || f}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, t.execFileSync)(...i("ConvertTo-Json test", 10 * 1e3));
    } catch (p) {
      u.warn(`Cannot execute ConvertTo-Json: ${p.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    l != null && d(l), f && d(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${f}. Failing signature validation due to unknown stderr.`));
  }
  function c() {
    const u = r.release();
    return u.startsWith("6.") && !u.startsWith("6.3");
  }
  return Zi;
}
var zh;
function Vh() {
  if (zh) return ei;
  zh = 1, Object.defineProperty(ei, "__esModule", { value: !0 }), ei.NsisUpdater = void 0;
  const e = et(), t = Q, r = Gs(), n = Gm(), i = Mr(), o = bt(), s = /* @__PURE__ */ yr(), a = K0(), c = er;
  let u = class extends r.BaseUpdater {
    constructor(f, d) {
      super(f, d), this._verifyUpdateCodeSignature = (p, g) => (0, a.verifySignature)(p, g, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(f) {
      f && (this._verifyUpdateCodeSignature = f);
    }
    /*** @private */
    doDownloadUpdate(f) {
      const d = f.updateInfoAndProvider.provider, p = (0, o.findFile)(d.resolveFiles(f.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: f,
        fileInfo: p,
        task: async (g, y, m, S) => {
          const C = p.packageInfo, A = C != null && m != null;
          if (A && f.disableWebInstaller)
            throw (0, e.newError)(`Unable to download new version ${f.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !A && !f.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (A || f.disableDifferentialDownload || await this.differentialDownloadInstaller(p, f, g, d, e.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(p.url, g, y);
          const x = await this.verifySignature(g);
          if (x != null)
            throw await S(), (0, e.newError)(`New version ${f.updateInfoAndProvider.info.version} is not signed by the application owner: ${x}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (A && await this.differentialDownloadWebPackage(f, C, m, d))
            try {
              await this.httpExecutor.download(new c.URL(C.path), m, {
                headers: f.requestHeaders,
                cancellationToken: f.cancellationToken,
                sha512: C.sha512
              });
            } catch (w) {
              try {
                await (0, s.unlink)(m);
              } catch {
              }
              throw w;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(f) {
      let d;
      try {
        if (d = (await this.configOnDisk.value).publisherName, d == null)
          return null;
      } catch (p) {
        if (p.code === "ENOENT")
          return null;
        throw p;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(d) ? d : [d], f);
    }
    doInstall(f) {
      const d = this.installerPath;
      if (d == null)
        return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
      const p = ["--updated"];
      f.isSilent && p.push("/S"), f.isForceRunAfter && p.push("--force-run"), this.installDirectory && p.push(`/D=${this.installDirectory}`);
      const g = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      g != null && p.push(`--package-file=${g}`);
      const y = () => {
        this.spawnLog(t.join(process.resourcesPath, "elevate.exe"), [d].concat(p)).catch((m) => this.dispatchError(m));
      };
      return f.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), y(), !0) : (this.spawnLog(d, p).catch((m) => {
        const S = m.code;
        this._logger.info(`Cannot run installer: error code: ${S}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), S === "UNKNOWN" || S === "EACCES" ? y() : S === "ENOENT" ? Or.shell.openPath(d).catch((C) => this.dispatchError(C)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(f, d, p, g) {
      if (d.blockMapSize == null)
        return !0;
      try {
        const y = {
          newUrl: new c.URL(d.path),
          oldFile: t.join(this.downloadedUpdateHelper.cacheDir, e.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: p,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: g.isUseMultipleRangeRequest,
          cancellationToken: f.cancellationToken
        };
        this.listenerCount(i.DOWNLOAD_PROGRESS) > 0 && (y.onProgress = (m) => this.emit(i.DOWNLOAD_PROGRESS, m)), await new n.FileWithEmbeddedBlockMapDifferentialDownloader(d, this.httpExecutor, y).download();
      } catch (y) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${y.stack || y}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return ei.NsisUpdater = u, ei;
}
var Yh;
function X0() {
  return Yh || (Yh = 1, (function(e) {
    var t = Cr && Cr.__createBinding || (Object.create ? (function(m, S, C, A) {
      A === void 0 && (A = C);
      var x = Object.getOwnPropertyDescriptor(S, C);
      (!x || ("get" in x ? !S.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
        return S[C];
      } }), Object.defineProperty(m, A, x);
    }) : (function(m, S, C, A) {
      A === void 0 && (A = C), m[A] = S[C];
    })), r = Cr && Cr.__exportStar || function(m, S) {
      for (var C in m) C !== "default" && !Object.prototype.hasOwnProperty.call(S, C) && t(S, m, C);
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
    const n = /* @__PURE__ */ yr(), i = Q;
    var o = Gs();
    Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
      return o.BaseUpdater;
    } });
    var s = vl();
    Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
      return s.AppUpdater;
    } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
      return s.NoOpLogger;
    } });
    var a = bt();
    Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
      return a.Provider;
    } });
    var c = Fh();
    Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
      return c.AppImageUpdater;
    } });
    var u = Mh();
    Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
      return u.DebUpdater;
    } });
    var l = Bh();
    Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
      return l.PacmanUpdater;
    } });
    var f = Wh();
    Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
      return f.RpmUpdater;
    } });
    var d = jh();
    Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
      return d.MacUpdater;
    } });
    var p = Vh();
    Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
      return p.NsisUpdater;
    } }), r(Mr(), e);
    let g;
    function y() {
      if (process.platform === "win32")
        g = new (Vh()).NsisUpdater();
      else if (process.platform === "darwin")
        g = new (jh()).MacUpdater();
      else {
        g = new (Fh()).AppImageUpdater();
        try {
          const m = i.join(process.resourcesPath, "package-type");
          if (!(0, n.existsSync)(m))
            return g;
          switch ((0, n.readFileSync)(m).toString().trim()) {
            case "deb":
              g = new (Mh()).DebUpdater();
              break;
            case "rpm":
              g = new (Wh()).RpmUpdater();
              break;
            case "pacman":
              g = new (Bh()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return g;
    }
    Object.defineProperty(e, "autoUpdater", {
      enumerable: !0,
      get: () => g || y()
    });
  })(Cr)), Cr;
}
var rt = X0();
const Kh = {
  autoUpdateEnabled: !0
}, Km = Rt.autoUpdateEnabled;
function El() {
  let e;
  try {
    e = vt(Km);
  } catch (t) {
    return console.warn("[更新器] 读取自动更新设置失败，使用默认值:", t), { ...Kh };
  }
  return e === null ? { ...Kh } : {
    autoUpdateEnabled: e === "true"
  };
}
function J0(e) {
  const t = El(), r = {
    autoUpdateEnabled: typeof e.autoUpdateEnabled == "boolean" ? e.autoUpdateEnabled : t.autoUpdateEnabled
  };
  try {
    wt(Km, String(r.autoUpdateEnabled));
  } catch (n) {
    return console.warn("[更新器] 保存自动更新设置失败，保留当前值:", n), t;
  }
  return r;
}
let Xh = !1, ds = !1, Xt = {
  status: "idle",
  message: J("updater.notChecked"),
  currentVersion: Pe.getVersion()
};
function cn() {
  return process.platform === "win32" && !!process.env.PORTABLE_EXECUTABLE_FILE;
}
function Xm() {
  if (!cn())
    return null;
  const e = process.env.PORTABLE_EXECUTABLE_FILE;
  return e ? ke.resolve(e) : null;
}
function Q0() {
  return Xm() ? `latest-portable-${process.arch}` : null;
}
function Z0() {
  const e = rt.autoUpdater;
  return e.installerPath ? ke.resolve(e.installerPath) : null;
}
function eS() {
  const e = process.env.SystemRoot || "C:\\Windows";
  return ke.join(e, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
}
function tS(e, t) {
  const r = Pe.getPath("temp"), n = ke.join(r, `astrbot-portable-update-${process.pid}-${Date.now()}.ps1`), i = [
    "param(",
    "  [Parameter(Mandatory = $true)][string]$CurrentExe,",
    "  [Parameter(Mandatory = $true)][string]$DownloadedExe",
    ")",
    "$ErrorActionPreference = 'Stop'",
    '$BackupExe = "$CurrentExe.old"',
    "$Deadline = (Get-Date).AddMinutes(2)",
    "while ((Get-Date) -lt $Deadline) {",
    "  try {",
    "    $Handle = [System.IO.File]::Open($CurrentExe, 'Open', 'ReadWrite', 'None')",
    "    $Handle.Dispose()",
    "    break",
    "  } catch {",
    "    Start-Sleep -Milliseconds 500",
    "  }",
    "}",
    "if (-not (Test-Path -LiteralPath $DownloadedExe)) {",
    '  throw "找不到已下载的便携版更新文件"',
    "}",
    "if (Test-Path -LiteralPath $BackupExe) {",
    "  Remove-Item -LiteralPath $BackupExe -Force -ErrorAction SilentlyContinue",
    "}",
    "$NeedRestore = $false",
    "try {",
    "  if (Test-Path -LiteralPath $CurrentExe) {",
    "    Move-Item -LiteralPath $CurrentExe -Destination $BackupExe -Force",
    "    $NeedRestore = $true",
    "  }",
    "  Move-Item -LiteralPath $DownloadedExe -Destination $CurrentExe -Force",
    "  $NeedRestore = $false",
    "  if (Test-Path -LiteralPath $BackupExe) {",
    "    Remove-Item -LiteralPath $BackupExe -Force -ErrorAction SilentlyContinue",
    "  }",
    "  Start-Process -FilePath $CurrentExe -ArgumentList '--updated'",
    "} catch {",
    "  if ($NeedRestore -and (Test-Path -LiteralPath $BackupExe) -and -not (Test-Path -LiteralPath $CurrentExe)) {",
    "    Move-Item -LiteralPath $BackupExe -Destination $CurrentExe -Force",
    "  }",
    "  throw",
    "}"
  ].join(`
`);
  return nt.writeFileSync(n, i, "utf8"), Ye("info", "updater", `已生成便携版更新替换脚本: ${n}`), Ye("info", "updater", `便携版当前路径: ${e}`), Ye("info", "updater", `便携版更新包路径: ${t}`), n;
}
function rS() {
  const e = Xm();
  if (!e)
    return {
      success: !1,
      message: J("updater.portable.exeNotFound")
    };
  const t = Z0();
  if (!t || !nt.existsSync(t))
    return {
      success: !1,
      message: J("updater.portable.downloadNotFound")
    };
  if (!nt.existsSync(e))
    return {
      success: !1,
      message: J("updater.portable.exeNotExist")
    };
  if (ke.resolve(e) === ke.resolve(t))
    return {
      success: !1,
      message: J("updater.portable.pathAbnormal")
    };
  const r = tS(e, t), n = eS();
  try {
    return Ay(
      n,
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        r,
        "-CurrentExe",
        e,
        "-DownloadedExe",
        t
      ],
      {
        detached: !0,
        stdio: "ignore"
      }
    ).unref(), Ye("info", "updater", "便携版更新替换脚本已启动，准备退出当前应用"), setImmediate(() => {
      Pe.quit();
    }), {
      success: !0,
      message: J("updater.closingReplace")
    };
  } catch (i) {
    const o = _l(i);
    return Ye("error", "updater", "启动便携版更新替换脚本失败:", o), {
      success: !1,
      message: J("updater.portableReplaceFailed", { message: o })
    };
  }
}
function Jm() {
  return process.platform === "win32" || process.platform === "darwin";
}
function Qm() {
  return Pe.isPackaged && Jm() && Zm();
}
function nS() {
  return El().autoUpdateEnabled;
}
function Zm() {
  const e = ke.join(process.resourcesPath, "app-update.yml");
  return nt.existsSync(e);
}
function iS() {
  for (const e of Qe.getAllWindows())
    e.webContents.send("update:stateChanged", Xt);
}
function pt(e) {
  Xt = {
    ...Xt,
    ...e,
    currentVersion: Pe.getVersion()
  }, iS();
}
function _l(e) {
  return e instanceof Error ? e.message : String(e);
}
function sS(e) {
  pt({
    status: rt.autoUpdater.autoDownload ? "downloading" : "available",
    message: rt.autoUpdater.autoDownload ? J("updater.newVersionFound", { version: e.version }) : J("updater.newVersionManual", { version: e.version }),
    latestVersion: e.version,
    releaseDate: e.releaseDate
  });
}
function oS(e) {
  pt({
    status: "downloading",
    message: J("updater.downloading", { percent: Math.round(e.percent) }),
    progress: e.percent
  });
}
async function aS(e) {
  try {
    const t = Qe.getFocusedWindow() || Qe.getAllWindows()[0] || null, r = J("updater.downloadComplete", { version: e.version }), n = cn() ? J("updater.dialog.installPromptPortable") : J("updater.dialog.installPromptRegular"), i = cn() ? J("updater.dialog.installNowPortable") : J("updater.dialog.installNowRegular");
    if ((await Ot.showMessageBox(t, {
      type: "info",
      title: J("updater.dialog.newVersionTitle"),
      message: r,
      detail: n,
      buttons: [i, J("updater.dialog.later")],
      defaultId: 0,
      cancelId: 1
    })).response === 0) {
      Ye("info", "updater", "用户确认立即安装更新");
      const s = rg();
      s.success || await Ot.showMessageBox(t, {
        type: "error",
        title: J("updater.dialog.updateFailedTitle"),
        message: s.message
      });
    }
  } catch (t) {
    Ye("error", "updater", "弹出更新安装确认框失败:", t);
  }
}
function cS() {
  rt.autoUpdater.on("checking-for-update", () => {
    pt({
      status: "checking",
      message: J("updater.checking"),
      progress: void 0
    }), Ye("info", "updater", "开始检查更新");
  }), rt.autoUpdater.on("update-available", (e) => {
    sS(e), Ye("info", "updater", `发现新版本: ${e.version}`);
  }), rt.autoUpdater.on("update-not-available", () => {
    pt({
      status: "not-available",
      message: J("updater.upToDate"),
      latestVersion: void 0,
      progress: void 0,
      releaseDate: void 0
    }), Ye("info", "updater", "当前已是最新版本");
  }), rt.autoUpdater.on("download-progress", (e) => {
    oS(e);
  }), rt.autoUpdater.on("update-downloaded", (e) => {
    pt({
      status: "downloaded",
      message: cn() ? J("updater.downloadedWaitReplace", { version: e.version }) : J("updater.downloadedWaitInstall", { version: e.version }),
      latestVersion: e.version,
      progress: 100,
      releaseDate: e.releaseDate
    }), Ye("info", "updater", `更新下载完成: ${e.version}`), aS(e);
  }), rt.autoUpdater.on("error", (e) => {
    const t = _l(e);
    pt({
      status: "error",
      message: J("updater.error", { message: t }),
      progress: void 0
    }), Ye("error", "updater", "自动更新异常:", t);
  });
}
function eg() {
  return Pe.isPackaged ? Jm() ? Zm() ? J("updater.disabled.generic") : J("updater.disabled.noConfig") : J("updater.disabled.platform") : J("updater.disabled.dev");
}
function ri() {
  return { ...Xt };
}
function lS() {
  if (Xh)
    return;
  if (Xh = !0, !Qm()) {
    pt({
      status: "disabled",
      message: eg(),
      progress: void 0
    }), Ye("info", "updater", Xt.message);
    return;
  }
  const e = rt.autoUpdater, t = Q0();
  if (t && (e.channel = t, Ye("info", "updater", `便携版更新通道已切换为 ${t}`)), rt.autoUpdater.autoDownload = !0, rt.autoUpdater.autoInstallOnAppQuit = !cn(), rt.autoUpdater.allowPrerelease = Pe.getVersion().includes("-"), rt.autoUpdater.allowDowngrade = !1, cS(), pt({
    status: "idle",
    message: J("updater.autoUpdateEnabled")
  }), Ye(
    "info",
    "updater",
    `自动更新已启用，平台=${process.platform}，当前版本=${Pe.getVersion()}，channel=${e.channel || "latest"}，allowPrerelease=${rt.autoUpdater.allowPrerelease}`
  ), !nS()) {
    pt({
      status: "idle",
      message: J("updater.autoCheckDisabled")
    }), Ye("info", "updater", "用户已关闭自动检查更新");
    return;
  }
  setTimeout(() => {
    tg(!1);
  }, 8e3);
}
function uS() {
  return El();
}
function dS(e) {
  const t = J0(e);
  return !t.autoUpdateEnabled && ds && pt({
    status: "idle",
    message: J("updater.autoCheckDisabled"),
    progress: void 0
  }), !t.autoUpdateEnabled && Xt.status !== "downloaded" && pt({
    status: "idle",
    message: J("updater.autoCheckDisabled"),
    progress: void 0
  }), t;
}
async function tg(e = !0) {
  if (!Qm())
    return pt({
      status: "disabled",
      message: eg(),
      progress: void 0
    }), {
      success: !1,
      message: Xt.message,
      state: ri()
    };
  if (ds)
    return {
      success: !0,
      message: J("updater.alreadyChecking"),
      state: ri()
    };
  ds = !0;
  try {
    return e && pt({
      status: "checking",
      message: J("updater.manualChecking"),
      progress: void 0
    }), await rt.autoUpdater.checkForUpdates(), {
      success: !0,
      message: J("updater.checkInitiated"),
      state: ri()
    };
  } catch (t) {
    const r = _l(t);
    return pt({
      status: "error",
      message: J("updater.checkFailed", { message: r }),
      progress: void 0
    }), Ye("error", "updater", "检查更新失败:", r), {
      success: !1,
      message: Xt.message,
      state: ri()
    };
  } finally {
    ds = !1;
  }
}
function rg() {
  return Xt.status !== "downloaded" ? {
    success: !1,
    message: J("updater.noInstalledDownload")
  } : cn() ? (Ye("info", "updater", "收到便携版更新安装请求，准备关闭应用并替换更新"), rS()) : (Ye("info", "updater", "收到手动安装更新请求，准备重启安装"), rt.autoUpdater.quitAndInstall(), {
    success: !0,
    message: J("updater.restartInstall")
  });
}
const zs = at("ipc.connection");
function Sl(e) {
  return e instanceof Error ? e.message : typeof e == "string" ? e : e && typeof e == "object" && typeof e.message == "string" ? e.message : String(e);
}
le.handle("bridge:getSession", async () => {
  const e = Pt(), t = e ? e.getSession() : null;
  return zs.debug("bridge_get_session", {
    hasController: !!e,
    hasSession: !!t,
    sessionId: t == null ? void 0 : t.sessionId
  }), t;
});
le.handle("bridge:sendMessage", async (e, t) => {
  const r = zs.timer("bridge_send_message", {
    contentCount: Array.isArray(t == null ? void 0 : t.content) ? t.content.length : 0
  });
  try {
    const n = Pt();
    if (!n)
      throw new Error(J("error.connectionControllerNotInitialized"));
    const i = await n.sendMessage(t);
    return r.done({ preparedContentCount: i.length }), { success: !0, content: i };
  } catch (n) {
    return console.error("[IPC] 发送消息失败:", n), r.fail(n), { success: !1, error: Sl(n) };
  }
});
le.handle("bridge:sendTouch", async (e, t, r, n) => {
  const i = zs.timer("bridge_send_touch", { x: t, y: r, action: n });
  try {
    const o = Pt();
    if (!o)
      throw new Error(J("error.connectionControllerNotInitialized"));
    return o.sendTouch(t, r, n), i.done(), { success: !0 };
  } catch (o) {
    return console.error("[IPC] 发送触摸事件失败:", o), i.fail(o), { success: !1, error: Sl(o) };
  }
});
le.handle("bridge:sendState", async (e, t, r) => {
  const n = zs.timer("bridge_send_state", { op: t, payload: r });
  try {
    const i = Pt();
    if (!i)
      throw new Error(J("error.connectionControllerNotInitialized"));
    return i.sendState(t, r), n.done(), { success: !0 };
  } catch (i) {
    return console.error("[IPC] 发送状态失败:", i), n.fail(i), { success: !1, error: Sl(i) };
  }
});
let Jh = !1;
const fS = /* @__PURE__ */ new Set(["tray", "restore", "manual"]), Jt = at("ipc.desktopBehavior");
function hS(e) {
  if (e == null)
    return "manual";
  if (typeof e != "string" || !fS.has(e))
    throw new Error(J("error.desktopBehaviorIllegalParam"));
  return e;
}
function hn() {
  const e = gi();
  return Jh || (Jh = !0, Jt.info("snapshot_broadcast.register"), e.onSnapshotChanged((t) => {
    Jt.debug("snapshot_broadcast.send", {
      windowCount: Qe.getAllWindows().length,
      snapshot: t
    });
    for (const r of Qe.getAllWindows())
      r.isDestroyed() || r.webContents.send("desktopBehavior:snapshotChanged", t);
  })), e;
}
le.handle("desktopBehavior:getPreferences", async () => {
  const e = hn().getPreferences();
  return Jt.debug("get_preferences", { preferences: e }), e;
});
le.handle("desktopBehavior:updatePreferences", async (e, t) => {
  Jt.info("update_preferences", { patch: t });
  const r = hn().updatePreferences(t);
  return Jt.info("update_preferences.success", { preferences: r }), r;
});
le.handle("desktopBehavior:getSnapshot", async () => {
  const e = hn().getSnapshot();
  return Jt.debug("get_snapshot", { snapshot: e }), e;
});
le.handle("desktopBehavior:setMousePassthrough", async (e, t) => {
  const r = hn().setMousePassthrough(!!t);
  return Jt.info("set_mouse_passthrough", { requested: !!t, enabled: r }), r;
});
le.handle("desktopBehavior:setModelReady", async (e, t) => {
  const r = hn().setModelReady(!!t);
  return Jt.info("set_model_ready", { ready: !!t, snapshot: r }), r;
});
le.handle("desktopBehavior:requestReveal", async (e, t) => {
  const r = hS(t), n = hn().requestReveal(r);
  return Jt.info("request_reveal", { reason: r, snapshot: n }), n;
});
const pr = {
  processNames: [
    "dwm.exe",
    // Desktop Window Manager
    "csrss.exe",
    // Client Server Runtime Process
    "explorer.exe",
    // Windows Explorer
    "SearchUI.exe",
    // Windows Search
    "ShellExperienceHost.exe",
    // Shell Experience Host
    "StartMenuExperienceHost.exe",
    // Start Menu
    "TextInputHost.exe",
    // 文本输入
    "SecurityHealthSystray.exe",
    // 安全中心托盘
    "ScreenClippingHost.exe",
    // 截图工具
    "SnippingTool.exe",
    // 截图工具
    "GameViewer.exe"
    // 远程控制
  ],
  titleKeywords: [
    "Program Manager",
    "锁屏",
    "Lock Screen",
    "LockApp",
    "Windows Shell Experience Host",
    "Windows Default Lock Screen",
    "Windows 输入体验",
    "Task Switching",
    "Task View",
    // 来自原 desktop.ts 忽略列表
    "Explorer",
    "Windows Explorer",
    "File Explorer",
    "资源管理器",
    "文件资源管理器",
    "Windows Input Experience",
    "Microsoft Text Input Application",
    "Settings",
    "Task Manager",
    "Search",
    "Start",
    "Action center",
    "Notification Center",
    "NVIDIA GeForce Overlay",
    "Desktop Window Manager",
    "GameViewer",
    "Snipping Tool",
    "ScreenClippingHost",
    "Screenshot",
    "QQ Screenshot",
    "Snip & Sketch",
    "Windows Security",
    "Microsoft Store",
    "Calculator",
    "Photos",
    "Movies & TV",
    "Groove Music",
    "Mail",
    "Calendar",
    "Xbox Game Bar",
    "Input Indicator"
  ],
  // 额外忽略关键词（部分匹配）
  ignoreKeywords: [
    "隐私",
    "privacy",
    "monitor",
    "overlay",
    "gameviewer",
    "screenshot",
    "截图",
    "snip",
    "snippingtool",
    "screenclippinghost",
    "screen clipping",
    "clipping",
    "explorer",
    "windows explorer",
    "file explorer",
    "资源管理器",
    "文件资源管理器"
  ]
}, fi = {
  enabled: !0,
  appLaunchEnabled: !0,
  throttle: {
    globalInterval: 1e3,
    // 1秒
    perWindowInterval: 3e3,
    // 3秒
    minInterval: 100
    // 100ms
  },
  events: {
    focus: !0,
    blur: !1,
    create: !0,
    destroy: !1,
    fullscreen: !0,
    windowed: !1,
    resize: !1,
    move: !1,
    minimize: !1,
    maximize: !1,
    restore: !1
  },
  ignore: {
    processNames: [],
    // 用户可以添加额外的忽略规则
    titleKeywords: []
    // 用户可以添加额外的忽略规则
  },
  aiResponse: {
    mode: "first-open",
    specificApps: []
  }
};
function Ac(e) {
  return {
    processNames: [
      ...pr.processNames,
      ...e.ignore.processNames
    ],
    titleKeywords: [
      ...pr.titleKeywords,
      ...e.ignore.titleKeywords
    ]
  };
}
function ng() {
  return Q.join(pi(), "window-watcher-config.json");
}
function bl(e) {
  const t = { ...fi };
  if (typeof e.enabled == "boolean" && (t.enabled = e.enabled), typeof e.appLaunchEnabled == "boolean" && (t.appLaunchEnabled = e.appLaunchEnabled), e.throttle && (typeof e.throttle.globalInterval == "number" && e.throttle.globalInterval >= 0 && (t.throttle.globalInterval = e.throttle.globalInterval), typeof e.throttle.perWindowInterval == "number" && e.throttle.perWindowInterval >= 0 && (t.throttle.perWindowInterval = e.throttle.perWindowInterval), typeof e.throttle.minInterval == "number" && e.throttle.minInterval >= 0 && (t.throttle.minInterval = e.throttle.minInterval)), e.events) {
    const r = [
      "focus",
      "blur",
      "create",
      "destroy",
      "fullscreen",
      "windowed",
      "resize",
      "move",
      "minimize",
      "maximize",
      "restore"
    ];
    for (const n of r)
      typeof e.events[n] == "boolean" && (t.events[n] = e.events[n]);
  }
  return e.ignore && (Array.isArray(e.ignore.processNames) && (t.ignore.processNames = e.ignore.processNames.filter(
    (r) => typeof r == "string" && r.trim() && !pr.processNames.includes(r)
  )), Array.isArray(e.ignore.titleKeywords) && (t.ignore.titleKeywords = e.ignore.titleKeywords.filter(
    (r) => typeof r == "string" && r.trim() && !pr.titleKeywords.includes(r)
  ))), e.aiResponse && (["first-open", "every-switch", "specific-apps"].includes(e.aiResponse.mode) && (t.aiResponse.mode = e.aiResponse.mode), Array.isArray(e.aiResponse.specificApps) && (t.aiResponse.specificApps = e.aiResponse.specificApps.filter(
    (n) => typeof n == "string" && n.trim()
  ))), t;
}
async function pS() {
  try {
    const e = ng(), t = await Yt.readFile(e, "utf-8"), r = JSON.parse(t);
    return bl(r);
  } catch {
    return { ...fi };
  }
}
async function ig(e) {
  try {
    const t = ng(), r = bl(e);
    await Yt.writeFile(t, JSON.stringify(r, null, 2), "utf-8");
  } catch (t) {
    throw console.error("[窗口监听] 保存配置失败:", t), t;
  }
}
async function mS() {
  return await ig(fi), { ...fi };
}
const gS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BUILTIN_IGNORE_RULES: pr,
  DEFAULT_CONFIG: fi,
  getMergedIgnoreRules: Ac,
  loadConfig: pS,
  resetConfig: mS,
  saveConfig: ig,
  validateConfig: bl
}, Symbol.toStringTag, { value: "Module" }));
class Qh {
  constructor(t) {
    _e(this, "config");
    _e(this, "mergedIgnoreRules");
    // 全局节流：上次触发时间
    _e(this, "lastGlobalTrigger", 0);
    // 单窗口节流：每个窗口的上次触发时间
    _e(this, "perWindowTimestamps", /* @__PURE__ */ new Map());
    // 已见过的进程（用于 first-open 模式）
    _e(this, "seenProcesses", /* @__PURE__ */ new Set());
    // 清理定时器
    _e(this, "cleanupTimer", null);
    this.config = t, this.mergedIgnoreRules = Ac(t), this.startCleanupTimer();
  }
  /**
   * 检查是否应该触发 AI 回调
   */
  shouldTrigger(t) {
    const r = Date.now();
    if (!this.isEventEnabled(t.type))
      return { shouldTrigger: !1, reason: `事件类型 ${t.type} 未启用` };
    if (this.shouldIgnoreEvent(t))
      return { shouldTrigger: !1, reason: "在忽略列表中" };
    const n = this.config.throttle.minInterval;
    if (r - this.lastGlobalTrigger < n)
      return { shouldTrigger: !1, reason: `小于最小间隔 ${n}ms` };
    const i = this.config.throttle.globalInterval;
    if (r - this.lastGlobalTrigger < i)
      return { shouldTrigger: !1, reason: `小于全局间隔 ${i}ms` };
    const o = t.window.id, s = this.perWindowTimestamps.get(o) || 0, a = this.config.throttle.perWindowInterval;
    if (r - s < a)
      return { shouldTrigger: !1, reason: `小于单窗口间隔 ${a}ms` };
    const c = this.checkAIResponseMode(t, r);
    return c.shouldTrigger ? (this.lastGlobalTrigger = r, this.perWindowTimestamps.set(o, r), { shouldTrigger: !0 }) : c;
  }
  /**
   * 检查事件类型是否启用
   */
  isEventEnabled(t) {
    return this.config.events[t] ?? !1;
  }
  /**
   * 检查是否应该忽略
   */
  shouldIgnoreEvent(t) {
    const { processName: r, title: n } = t.window;
    if (this.mergedIgnoreRules.processNames.includes(r))
      return !0;
    const i = n.toLowerCase();
    for (const o of this.mergedIgnoreRules.titleKeywords)
      if (i.includes(o.toLowerCase()))
        return !0;
    return !n.trim();
  }
  /**
   * 检查 AI 响应模式
   */
  checkAIResponseMode(t, r) {
    const { mode: n, specificApps: i } = this.config.aiResponse, o = `${t.window.processName}-${t.window.processId}`;
    switch (n) {
      case "first-open":
        return this.seenProcesses.has(o) ? { shouldTrigger: !1, reason: "非首次打开" } : (this.seenProcesses.add(o), { shouldTrigger: !0 });
      case "every-switch":
        return { shouldTrigger: !0 };
      case "specific-apps":
        return i.includes(t.window.processName) ? { shouldTrigger: !0 } : { shouldTrigger: !1, reason: "非特定应用" };
      default:
        return { shouldTrigger: !0 };
    }
  }
  /**
   * 更新配置
   */
  updateConfig(t) {
    this.config = t, this.mergedIgnoreRules = Ac(t);
  }
  /**
   * 获取当前配置
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * 清理过期数据
   */
  cleanup() {
    const t = Date.now(), r = 1440 * 60 * 1e3;
    for (const [n, i] of this.perWindowTimestamps)
      t - i > r && this.perWindowTimestamps.delete(n);
    if (this.seenProcesses.size > 1e3) {
      const n = Array.from(this.seenProcesses);
      this.seenProcesses = new Set(n.slice(-500));
    }
  }
  /**
   * 启动清理定时器
   */
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 3600 * 1e3);
  }
  /**
   * 停止清理定时器
   */
  stopCleanupTimer() {
    this.cleanupTimer && (clearInterval(this.cleanupTimer), this.cleanupTimer = null);
  }
  /**
   * 销毁节流器
   */
  destroy() {
    this.stopCleanupTimer(), this.perWindowTimestamps.clear(), this.seenProcesses.clear();
  }
}
function cT(e, t, r) {
  return e.width >= t - 20 && e.height >= r - 20 && Math.abs(e.x) <= 20 && Math.abs(e.y) <= 20;
}
const ct = class ct {
  constructor() {
    _e(this, "platformWatcher", null);
    _e(this, "listeners", /* @__PURE__ */ new Set());
    _e(this, "isRunning", !1);
    // 配置和节流器（延迟加载）
    _e(this, "configModule", null);
    _e(this, "throttler", null);
    _e(this, "config", null);
    // 状态
    _e(this, "currentWindow", null);
    _e(this, "previousWindow", null);
    _e(this, "windowHistory", []);
    // 应用启动检测
    _e(this, "appLaunchActive", !1);
    _e(this, "knownAppKeys", /* @__PURE__ */ new Set());
    _e(this, "appLaunchDetections", /* @__PURE__ */ new Map());
    _e(this, "appLaunchListeners", /* @__PURE__ */ new Set());
    // 应用启动防抖
    _e(this, "recentSwitchTimestamps", []);
    _e(this, "lastObservedAppKey", "");
    _e(this, "suppressAppEventUntil", 0);
    _e(this, "lastAppEventTs", 0);
  }
  /**
   * 创建平台特定的监听器
   */
  async createPlatformWatcher() {
    try {
      switch (process.platform) {
        case "win32": {
          const { WindowsWatcher: t } = await import("./windowsWatcher--UwzJPLm.js");
          return new t();
        }
        case "darwin": {
          const { MacOSWatcher: t } = await import("./macosWatcher-BU2LBmwe.js");
          return new t();
        }
        case "linux": {
          const { LinuxWatcher: t } = await import("./linuxWatcher-Ca8qtl9P.js");
          return new t();
        }
        default:
          return console.warn(`[窗口监听] 不支持的平台: ${process.platform}`), null;
      }
    } catch (t) {
      return console.error("[窗口监听] 创建平台监听器失败:", t), null;
    }
  }
  /**
   * 加载配置模块
   */
  async loadConfigModule() {
    if (!this.configModule)
      try {
        this.configModule = gS, this.config = await this.configModule.loadConfig(), this.throttler = new Qh(this.config), console.log("[窗口监听] 配置加载完成");
      } catch (t) {
        console.error("[窗口监听] 加载配置模块失败:", t), this.config = {
          enabled: !0,
          throttle: { globalInterval: 1e3, perWindowInterval: 3e3, minInterval: 100 },
          events: { focus: !0, blur: !1, create: !0, destroy: !1, fullscreen: !0, windowed: !1, resize: !1, move: !1, minimize: !1, maximize: !1, restore: !1 },
          ignore: { processNames: ["dwm.exe", "csrss.exe", "explorer.exe"], titleKeywords: ["Program Manager", "锁屏", "Lock Screen"] },
          aiResponse: { mode: "first-open", specificApps: [] }
        }, this.throttler = new Qh(this.config);
      }
  }
  /**
   * 启动监听
   */
  async start() {
    var r;
    if (this.isRunning) {
      console.warn("[窗口监听] 监听器已在运行");
      return;
    }
    if (this.platformWatcher || (this.platformWatcher = await this.createPlatformWatcher()), !this.platformWatcher) {
      console.error("[窗口监听] 平台监听器不可用");
      return;
    }
    if (await this.loadConfigModule(), !((r = this.config) != null && r.enabled)) {
      console.log("[窗口监听] 监听器已禁用");
      return;
    }
    this.platformWatcher.start((n) => {
      this.handleWindowEvent(n);
    });
    const t = this.platformWatcher.getActiveWindow();
    t && (this.currentWindow = t, this.windowHistory.push({ window: t, timestamp: Date.now() })), this.isRunning = !0, console.log("[窗口监听] WindowWatcherManager 已启动");
  }
  /**
   * 停止监听
   */
  stop() {
    var t;
    this.isRunning && ((t = this.platformWatcher) == null || t.stop(), this.throttler && (this.throttler.destroy(), this.throttler = null), this.currentWindow = null, this.previousWindow = null, this.windowHistory = [], this.stopAppLaunchDetection(), this.isRunning = !1, console.log("[窗口监听] WindowWatcherManager 已停止"));
  }
  /**
   * 处理窗口事件
   */
  handleWindowEvent(t) {
    var n, i;
    const r = t.type === "focus" && !((n = this.throttler) != null && n.shouldIgnoreEvent(t));
    if (t.type === "focus" ? (this.previousWindow = this.currentWindow, this.currentWindow = t.window) : t.type === "blur" ? (this.previousWindow = this.currentWindow, this.currentWindow = null) : ((i = this.currentWindow) == null ? void 0 : i.id) === t.window.id && (this.currentWindow = t.window), t.type === "maximize" && t.window.isFullscreen ? t.type = "fullscreen" : t.type === "restore" && !t.window.isFullscreen && (t.type = "windowed"), r && (this.windowHistory.push({ window: t.window, timestamp: t.timestamp }), this.windowHistory.length > 100 && (this.windowHistory = this.windowHistory.slice(-50)), this.appLaunchActive && this.detectAppLaunch(t.window)), this.throttler) {
      const { shouldTrigger: o, reason: s } = this.throttler.shouldTrigger(t);
      if (!o) {
        console.log(`[窗口监听] 事件被节流: ${s}`);
        return;
      }
    }
    for (const o of this.listeners)
      try {
        o(t);
      } catch (s) {
        console.error("[窗口监听] 监听器回调执行失败:", s);
      }
  }
  /**
   * 添加事件监听器
   */
  onWindowEvent(t) {
    return this.listeners.add(t), () => this.listeners.delete(t);
  }
  /**
   * 移除事件监听器
   */
  offWindowEvent(t) {
    this.listeners.delete(t);
  }
  /**
   * 获取当前活跃窗口
   */
  getCurrentWindow() {
    return this.currentWindow;
  }
  /**
   * 获取上一个活跃窗口
   */
  getPreviousWindow() {
    return this.previousWindow;
  }
  /**
   * 获取窗口历史记录
   */
  getWindowHistory() {
    return [...this.windowHistory];
  }
  /**
   * 获取所有已知窗口
   */
  getAllWindows() {
    var t;
    return ((t = this.platformWatcher) == null ? void 0 : t.getAllWindows()) || [];
  }
  /**
   * 更新配置
   */
  async updateConfig(t) {
    this.configModule || await this.loadConfigModule(), this.config = this.configModule.validateConfig(t), await this.configModule.saveConfig(this.config), this.throttler && this.throttler.updateConfig(this.config), !this.config.enabled && this.isRunning && this.stop(), this.config.enabled && !this.isRunning && await this.start(), console.log("[窗口监听] 配置已更新");
  }
  /**
   * 获取当前配置
   */
  async getConfig() {
    return this.config || await this.loadConfigModule(), { ...this.config };
  }
  /**
   * 重置配置
   */
  async resetConfig() {
    this.configModule || await this.loadConfigModule(), this.config = await this.configModule.resetConfig(), this.throttler && this.throttler.updateConfig(this.config), !this.config.enabled && this.isRunning && this.stop(), this.config.enabled && !this.isRunning && await this.start(), console.log("[窗口监听] 配置已重置");
  }
  /**
   * 检查是否正在运行
   */
  isActive() {
    return this.isRunning;
  }
  // ──────── 应用启动检测 ────────
  /**
   * 启动应用启动检测
   */
  async startAppLaunchDetection() {
    var t, r;
    if (this.config || await this.loadConfigModule(), !((t = this.config) != null && t.enabled) || !((r = this.config) != null && r.appLaunchEnabled)) {
      this.stopAppLaunchDetection(), console.log("[应用启动] 应用启动检测已禁用");
      return;
    }
    this.appLaunchActive = !0, this.knownAppKeys.clear(), this.appLaunchDetections.clear(), this.resetAppSwitchDebounceState(), this.seedKnownAppName("explorer.exe"), this.seedKnownAppName("Explorer"), this.seedKnownAppName("Windows Explorer"), this.seedKnownAppName("File Explorer"), this.seedKnownAppName("资源管理器"), this.seedKnownAppName("文件资源管理器"), this.currentWindow && this.seedKnownAppName(this.currentWindow.processName), console.log("[应用启动] 应用启动检测已启动");
  }
  /**
   * 停止应用启动检测
   */
  stopAppLaunchDetection() {
    this.appLaunchActive = !1, this.knownAppKeys.clear(), this.appLaunchDetections.clear(), this.resetAppSwitchDebounceState(), console.log("[应用启动] 应用启动检测已停止");
  }
  /**
   * 注册应用启动回调
   */
  onAppLaunch(t) {
    return this.appLaunchListeners.add(t), () => this.appLaunchListeners.delete(t);
  }
  seedKnownAppName(t) {
    const r = this.toAppKey(t);
    r && this.knownAppKeys.add(r);
  }
  toAppKey(t) {
    return t.trim().toLowerCase();
  }
  resetAppSwitchDebounceState() {
    this.recentSwitchTimestamps = [], this.lastObservedAppKey = "", this.suppressAppEventUntil = 0, this.lastAppEventTs = 0;
  }
  /**
   * 判断应用是否应被忽略
   */
  shouldIgnoreApp(t, r) {
    const n = t.trim();
    if (!n || n.length <= 2) return !0;
    const i = this.toAppKey(n);
    if (pr.processNames.map((l) => l.toLowerCase()).includes(i)) return !0;
    const s = r.toLowerCase();
    for (const l of pr.titleKeywords)
      if (s === l.toLowerCase()) return !0;
    const a = [i, s];
    for (const l of pr.ignoreKeywords)
      if (a.some((f) => f.includes(l.toLowerCase()))) return !0;
    const c = Date.now(), u = this.appLaunchDetections.get(i);
    if (u) {
      if (c - u.firstSeen > ct.FREQ_WINDOW_MS)
        return this.appLaunchDetections.set(i, { count: 1, firstSeen: c }), !1;
      if (u.count >= ct.FREQ_THRESHOLD) return !0;
    }
    return !1;
  }
  recordAppLaunch(t) {
    const r = this.toAppKey(t);
    if (!r) return;
    const n = Date.now(), i = this.appLaunchDetections.get(r);
    i && n - i.firstSeen <= ct.FREQ_WINDOW_MS ? i.count++ : this.appLaunchDetections.set(r, { count: 1, firstSeen: n });
  }
  shouldDebounceAppLaunch(t, r) {
    this.lastObservedAppKey && this.lastObservedAppKey !== t && this.recentSwitchTimestamps.push(r), this.lastObservedAppKey = t;
    const n = r - ct.APP_SWITCH_DEBOUNCE_WINDOW_MS;
    return this.recentSwitchTimestamps = this.recentSwitchTimestamps.filter((i) => i >= n), this.recentSwitchTimestamps.length >= ct.APP_SWITCH_DEBOUNCE_THRESHOLD ? (this.suppressAppEventUntil = Math.max(this.suppressAppEventUntil, r + ct.APP_SWITCH_SUPPRESS_MS), this.recentSwitchTimestamps = [], !0) : r < this.suppressAppEventUntil || this.lastAppEventTs > 0 && r - this.lastAppEventTs < ct.APP_EVENT_MIN_INTERVAL_MS;
  }
  /**
   * 检测应用启动（在 focus 事件中调用）
   */
  detectAppLaunch(t) {
    const r = t.processName || "", n = t.title || "", i = this.toAppKey(r);
    if (!i) return;
    const o = Date.now();
    if (!this.shouldDebounceAppLaunch(i, o) && !this.knownAppKeys.has(i)) {
      if (this.shouldIgnoreApp(r, n)) {
        this.knownAppKeys.add(i);
        return;
      }
      this.recordAppLaunch(r), this.knownAppKeys.add(i), this.lastAppEventTs = o;
      for (const s of this.appLaunchListeners)
        try {
          s(r, r);
        } catch (a) {
          console.error("[应用启动] 回调执行失败:", a);
        }
    }
  }
  /**
   * 构建 AI 上下文信息
   */
  buildAIContext() {
    var r, n, i;
    const t = this.windowHistory.slice(-10).map((o) => o.window.processName).filter((o, s, a) => a.indexOf(o) === s);
    return {
      currentApp: ((r = this.currentWindow) == null ? void 0 : r.processName) || null,
      currentTitle: ((n = this.currentWindow) == null ? void 0 : n.title) || null,
      isFullscreen: ((i = this.currentWindow) == null ? void 0 : i.isFullscreen) || !1,
      recentApps: t
    };
  }
};
_e(ct, "FREQ_THRESHOLD", 3), _e(ct, "FREQ_WINDOW_MS", 10800 * 1e3), _e(ct, "APP_SWITCH_DEBOUNCE_WINDOW_MS", 20 * 1e3), _e(ct, "APP_SWITCH_DEBOUNCE_THRESHOLD", 4), _e(ct, "APP_SWITCH_SUPPRESS_MS", 15 * 1e3), _e(ct, "APP_EVENT_MIN_INTERVAL_MS", 4 * 1e3);
let Pc = ct, Ec = null;
function vr() {
  return Ec || (Ec = new Pc()), Ec;
}
const yS = /* @__PURE__ */ new Set(["http:", "https:", "mailto:"]), vS = /* @__PURE__ */ new Set(["http:", "https:", "data:", `${ln}:`]), si = Q.join(Pe.getPath("temp"), "astrbot-live2d-history"), $e = at("ipc.window");
async function wS() {
  try {
    await Yt.mkdir(si, { recursive: !0 });
    const e = await Yt.readdir(si), t = Date.now() - 36e5;
    for (const r of e) {
      const n = Q.join(si, r);
      try {
        const i = await Yt.stat(n);
        i.isFile() && i.mtimeMs < t && await Yt.unlink(n);
      } catch {
      }
    }
  } catch {
  }
}
async function ES() {
  try {
    await Yt.rm(si, { recursive: !0, force: !0 });
  } catch {
  }
}
function _S(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  if (!t)
    return null;
  try {
    const r = new URL(t);
    return yS.has(r.protocol) ? r.toString() : null;
  } catch {
    return null;
  }
}
function sg(e) {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  if (!t)
    return null;
  try {
    const r = new URL(t);
    return vS.has(r.protocol) ? r.toString() : null;
  } catch {
    return null;
  }
}
function og(e, t = "download.bin") {
  return typeof e != "string" ? t : e.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "_") || t;
}
function Si(e) {
  return Qe.fromWebContents(e.sender);
}
function SS(e) {
  return typeof e != "string" ? void 0 : e.trim().replace(/^\/+/, "") || void 0;
}
async function bS(e) {
  if (e.startsWith(`${ln}://`)) {
    const i = p_(e);
    if (!i)
      throw new Error(J("error.localHistoryResourceMissing"));
    return Buffer.from(i.data);
  }
  const t = tl(e);
  if (t)
    return t.buffer;
  const r = await xc.fetch(e);
  if (!r.ok)
    throw new Error(J("error.resourceRequestFailed", { status: r.status }));
  const n = await r.arrayBuffer();
  return Buffer.from(n);
}
async function ag(e, t) {
  const r = await bS(e);
  await Yt.mkdir(Q.dirname(t), { recursive: !0 }), await Yt.writeFile(t, r);
}
le.handle("window:openSettings", async (e, t) => {
  const r = SS(t);
  return $e.info("open_settings", { page: r }), ys(r), { success: !0 };
});
le.handle("window:closeSettings", async () => ($e.info("close_settings"), OE(), { success: !0 }));
le.handle("window:minimizeCurrent", async (e) => {
  const t = Si(e);
  return t ? ($e.info("minimize_current", { windowId: t.id }), t.minimize(), { success: !0 }) : ($e.warn("minimize_current.failed", { reason: "window_not_found" }), { success: !1, error: J("error.windowNotFound") });
});
le.handle("window:toggleMaximizeCurrent", async (e) => {
  const t = Si(e);
  if (!t)
    return $e.warn("toggle_maximize_current.failed", { reason: "window_not_found" }), { success: !1, error: J("error.windowNotFound") };
  const r = t.isMaximized();
  return t.isMaximized() ? t.unmaximize() : t.maximize(), $e.info("toggle_maximize_current", {
    windowId: t.id,
    wasMaximized: r,
    maximized: t.isMaximized()
  }), { success: !0, maximized: t.isMaximized() };
});
le.handle("window:isMaximizedCurrent", async (e) => {
  const t = Si(e), r = t ? t.isMaximized() : !1;
  return $e.debug("is_maximized_current", { windowId: t == null ? void 0 : t.id, maximized: r }), r;
});
le.handle("window:closeCurrent", async (e) => {
  const t = Si(e);
  return t ? ($e.info("close_current", { windowId: t.id }), t.close(), { success: !0 }) : ($e.warn("close_current.failed", { reason: "window_not_found" }), { success: !1, error: J("error.windowNotFound") });
});
le.handle("window:toggleSettingsPin", async (e) => {
  const t = Qe.fromWebContents(e.sender);
  if (!t || t.isDestroyed())
    return { success: !1, pinned: !1 };
  const r = t.isAlwaysOnTop();
  t.setAlwaysOnTop(!r);
  const n = t.isAlwaysOnTop();
  return $e.debug("toggle_settings_pin", { windowId: t.id, pinned: n }), { success: !0, pinned: n };
});
le.handle("window:notifyRendererReady", async (e, t) => {
  const r = Si(e);
  if (!r)
    return $e.warn("renderer_ready.failed", { windowKind: t, reason: "window_not_found" }), { success: !1, error: J("error.windowNotFound") };
  if (t === "settings") {
    const n = NE(r);
    return $e.info("renderer_ready.settings", { windowId: r.id, handled: n }), n ? { success: !0 } : { success: !1, error: J("error.settingsWindowMismatch") };
  }
  return !r.isDestroyed() && !r.isVisible() && r.show(), $e.info("renderer_ready", {
    windowId: r.id,
    windowKind: t,
    visible: r.isVisible()
  }), { success: !0 };
});
le.handle("window:closeWelcome", async () => ($e.info("close_welcome"), Pp(), mr() || (xs(), Xp()), { success: !0 }));
le.handle("window:getScreenshotSettings", async () => {
  const e = Us();
  return $e.debug("get_screenshot_settings", { settings: e }), e;
});
le.handle("window:updateScreenshotSettings", async (e, t) => {
  $e.info("update_screenshot_settings", { settings: t });
  const r = dE(t);
  return $e.info("update_screenshot_settings.success", { settings: r }), r;
});
le.handle("window:openExternal", async (e, t) => {
  const r = _S(t);
  return r ? (await Nc.openExternal(r), $e.info("open_external.success", { url: r }), { success: !0 }) : ($e.warn("open_external.rejected", { url: t }), { success: !1, error: J("error.onlyHttpMailtoProtocol") });
});
le.handle("window:openResource", async (e, t, r) => {
  const n = $e.timer("open_resource", {
    source: t,
    suggestedName: r
  }), i = sg(t);
  if (!i)
    return n.done({ success: !1, reason: "unsupported_protocol" }), { success: !1, error: J("error.onlyResourceProtocol") };
  try {
    const o = og(r, "resource.bin");
    await wS();
    const s = Q.join(si, `${Date.now()}-${o}`);
    await ag(i, s);
    const a = await Nc.openPath(s);
    return a ? (n.done({ success: !1, error: a, path: s }), { success: !1, error: a }) : (n.done({ success: !0, path: s }), { success: !0, path: s });
  } catch (o) {
    return n.fail(o), { success: !1, error: (o == null ? void 0 : o.message) || String(o) };
  }
});
le.handle("window:saveResource", async (e, t, r) => {
  const n = $e.timer("save_resource", {
    source: t,
    suggestedName: r
  }), i = sg(t);
  if (!i)
    return n.done({ success: !1, reason: "unsupported_protocol" }), { success: !1, error: J("error.onlyResourceProtocolSave") };
  try {
    const o = og(r, "download.bin"), s = await Ot.showSaveDialog({
      defaultPath: Q.join(Pe.getPath("downloads"), o)
    });
    return s.canceled || !s.filePath ? (n.done({ success: !1, canceled: !0 }), { success: !1, canceled: !0 }) : (await ag(i, s.filePath), n.done({ success: !0, path: s.filePath }), { success: !0, path: s.filePath });
  } catch (o) {
    return n.fail(o), { success: !1, error: (o == null ? void 0 : o.message) || String(o) };
  }
});
le.handle("window:getAppVersion", async () => Pe.getVersion());
le.handle("window:getPlatformCapabilities", async () => {
  const e = Mc();
  return $e.debug("get_platform_capabilities", { capabilities: e }), e;
});

const YM_PERSONALITY_KEY = "character_personality_pro_config_v1";
function YM_personalityDefault() { return { enabled: true, injectIntoMessages: true, proactiveLevel: 45, sarcasm: 15, affection: 35, professionalism: 60, roastFrequency: 20, allowDesktopInterruption: true, allowScreenshot: true, exclusiveNickname: "", likedTopics: [], blockedTopics: [] }; }
function YM_numClamp(e, t) { const r = Number(e); return Number.isFinite(r) ? Math.max(0, Math.min(100, Math.round(r))) : t; }
function YM_listClean(e) { return Array.isArray(e) ? Array.from(new Set(e.map((t) => String(t || "").trim()).filter(Boolean))) : typeof e == "string" ? Array.from(new Set(e.split(/\n|,|，/).map((t) => t.trim()).filter(Boolean))) : []; }
function YM_validatePersonality(e) { const t = YM_personalityDefault(), r = e && typeof e == "object" ? e : {}; return { enabled: typeof r.enabled == "boolean" ? r.enabled : t.enabled, injectIntoMessages: typeof r.injectIntoMessages == "boolean" ? r.injectIntoMessages : t.injectIntoMessages, proactiveLevel: YM_numClamp(r.proactiveLevel, t.proactiveLevel), sarcasm: YM_numClamp(r.sarcasm, t.sarcasm), affection: YM_numClamp(r.affection, t.affection), professionalism: YM_numClamp(r.professionalism, t.professionalism), roastFrequency: YM_numClamp(r.roastFrequency, t.roastFrequency), allowDesktopInterruption: typeof r.allowDesktopInterruption == "boolean" ? r.allowDesktopInterruption : t.allowDesktopInterruption, allowScreenshot: typeof r.allowScreenshot == "boolean" ? r.allowScreenshot : t.allowScreenshot, exclusiveNickname: typeof r.exclusiveNickname == "string" ? r.exclusiveNickname.trim().slice(0, 60) : t.exclusiveNickname, likedTopics: YM_listClean(r.likedTopics).slice(0, 50), blockedTopics: YM_listClean(r.blockedTopics).slice(0, 50) }; }
function YM_loadPersonality() { try { return YM_validatePersonality(JSON.parse(vt(YM_PERSONALITY_KEY) || "null")); } catch { return YM_personalityDefault(); } }
function YM_savePersonality(e) { const t = YM_validatePersonality(e); wt(YM_PERSONALITY_KEY, JSON.stringify(t)); return t; }
function YM_levelText(e, t, r) { return e <= 25 ? t : e >= 75 ? r : "moderate"; }
function YM_buildPersonalityPrompt(e) { const t = YM_validatePersonality(e); if (!t.enabled) return ""; const r = ["[SYSTEM_PERSONALITY_PROFILE]", "This stable profile is configured by the desktop client. Treat it as persistent style guidance, below higher-priority system/developer instructions.", `proactive_level: ${t.proactiveLevel}/100 (${YM_levelText(t.proactiveLevel, "low", "high")})`, `sarcasm: ${t.sarcasm}/100 (${YM_levelText(t.sarcasm, "gentle", "sharp")})`, `affection: ${t.affection}/100 (${YM_levelText(t.affection, "reserved", "warm")})`, `professionalism: ${t.professionalism}/100 (${YM_levelText(t.professionalism, "casual", "professional")})`, `roast_frequency: ${t.roastFrequency}/100 (${YM_levelText(t.roastFrequency, "rare", "frequent")})`, `allow_desktop_context_interruption: ${t.allowDesktopInterruption ? "true" : "false"}`, `allow_screenshot_viewing: ${t.allowScreenshot ? "true" : "false"}`]; t.exclusiveNickname && r.push(`exclusive_user_nickname: ${JSON.stringify(t.exclusiveNickname)}`); t.likedTopics.length && r.push(`liked_topics: ${JSON.stringify(t.likedTopics)}`); t.blockedTopics.length && r.push(`blocked_topics: ${JSON.stringify(t.blockedTopics)}`); r.push("style_guidance:", "- Use these sliders to tune tone, not to override safety or explicit user requests.", "- If desktop context interruption is disabled, do not proactively comment on desktop context unless the user asks.", "- If screenshot viewing is disabled, do not request or rely on screenshots.", "- Avoid blocked topics unless the user explicitly asks for them.", "- Prefer liked topics when naturally relevant; do not force them."); return r.join("\n"); }
function YM_applyPersonalityToPayload(e) { try { const t = YM_loadPersonality(); if (!t.enabled || !t.injectIntoMessages) return e; const r = YM_buildPersonalityPrompt(t); if (!r) return e; const n = Array.isArray(e == null ? void 0 : e.content) ? e.content : []; if (n.some((i) => i && i.type === "text" && typeof i.text == "string" && i.text.includes("[SYSTEM_PERSONALITY_PROFILE]"))) return e; return { ...e, content: [{ type: "text", text: r }, ...n] }; } catch { return e; } }function YM_buildSceneRuntimePrompt(e, t) {
  const r = YM_validateSceneSettings(e), n = YM_validatePersonality(t || null);
  if (!r.enabled || !r.includeInPrompt) return "";
  const i = YM_getCurrentScene();
  const o = ["[SYSTEM_SCENE_CONTEXT]", "This scene is detected at message-send time by the desktop client.", `scene_type: ${JSON.stringify(i.type)}`, `scene_label: ${JSON.stringify(i.label)}`, `scene_confidence: ${JSON.stringify(i.confidence)}`, `recommended_interruption: ${JSON.stringify(i.interruption)}`, `scene_suggestion: ${JSON.stringify(i.suggestion)}`, `personality_proactive_level: ${n.proactiveLevel}/100`, `desktop_context_interruption_allowed_by_personality: ${n.allowDesktopInterruption ? "true" : "false"}`];
  o.push("priority_rule:", "- Personality proactive_level is the base style preference.", "- Scene recommended_interruption is the real-time cap: game/media/code/art scenes should reduce unsolicited comments even if proactive_level is high.", "- If desktop_context_interruption_allowed_by_personality is false, do not proactively comment on desktop context unless the user asks.", "- User explicit requests always matter more than proactive scene suggestions.");
  return o.join("\n");
}
async function YM_applyRuntimeContextToPayload(e) {
  let t = typeof YM_applyPersonalityToPayload == "function" ? YM_applyPersonalityToPayload(e) : e;
  try {
    const r = YM_loadSceneSettings(), n = YM_loadPersonality();
    if (!r.enabled || !r.includeInPrompt) return t;
    try {
      const a = await Vp();
      if (a && a.window) {
        const c = YM_resolveApp(a.window), u = Date.now();
        YM_awarenessCurrent = { app: c, window: a.window, windowTitle: a.window.title || null, isFullscreen: !!a.window.isFullscreen, focusedSince: u, updatedAt: u };
      }
    } catch {}
    const i = YM_buildSceneRuntimePrompt(r, n);
    if (!i) return t;
    const o = Array.isArray(t == null ? void 0 : t.content) ? t.content : [];
    if (o.some((a) => a && a.type === "text" && typeof a.text == "string" && a.text.includes("[SYSTEM_SCENE_CONTEXT]"))) return t;
    return { ...t, content: [{ type: "text", text: i }, ...o] };
  } catch {
    return t;
  }
}
const YM_SCENE_KEY = "desktop_scene_pro_config_v1";
function YM_sceneDefault() { return { enabled: true, includeInPrompt: true, adaptiveSuggestion: true, quietScenes: ["game", "media"], activeScenes: ["code", "art", "study"] }; }
function YM_validateSceneSettings(e) { const t = YM_sceneDefault(), r = e && typeof e == "object" ? e : {}; return { enabled: typeof r.enabled == "boolean" ? r.enabled : t.enabled, includeInPrompt: typeof r.includeInPrompt == "boolean" ? r.includeInPrompt : t.includeInPrompt, adaptiveSuggestion: typeof r.adaptiveSuggestion == "boolean" ? r.adaptiveSuggestion : t.adaptiveSuggestion, quietScenes: Array.isArray(r.quietScenes) ? r.quietScenes.map(String).filter(Boolean) : t.quietScenes, activeScenes: Array.isArray(r.activeScenes) ? r.activeScenes.map(String).filter(Boolean) : t.activeScenes }; }
function YM_loadSceneSettings() { try { return YM_validateSceneSettings(JSON.parse(vt(YM_SCENE_KEY) || "null")); } catch { return YM_sceneDefault(); } }
function YM_saveSceneSettings(e) { const t = YM_validateSceneSettings(e); wt(YM_SCENE_KEY, JSON.stringify(t)); return t; }
function YM_sceneHas(e, t) { return t.some((r) => e.includes(r)); }
function YM_detectScene(e, t) {
  const r = String((e == null ? void 0 : e.canonicalKey) || "").toLowerCase(), n = String((e == null ? void 0 : e.processName) || "").toLowerCase(), i = String(t || "").toLowerCase(), o = `${r} ${n} ${i}`;
  if (YM_sceneHas(o, ["code", "vscode", "visual studio", "webstorm", "idea", "pycharm", "cursor", "sublime", "notepad++", "terminal", "powershell", "cmd", "git", "github"])) return { type: "code", label: "写代码", confidence: "high", interruption: "low", suggestion: "少打扰；适合提供调试、解释、保存提醒。" };
  if (YM_sceneHas(o, ["steam", "unity", "unreal", "genshin", "starrail", "minecraft", "valorant", "league", "game", "elden", "sekiro", "naruto", "原神", "崩坏", "火影"])) return { type: "game", label: "游戏", confidence: "medium", interruption: "very_low", suggestion: "尽量静默；适合自动穿透、降低主动发言。" };
  if (YM_sceneHas(o, ["wechat", "weixin", "qq", "telegram", "discord", "slack", "teams", "微信", "聊天"])) return { type: "chat", label: "聊天", confidence: "high", interruption: "medium", suggestion: "谨慎插话；可理解聊天上下文但不要频繁主动。" };
  if (YM_sceneHas(o, ["chrome", "edge", "firefox", "browser", "浏览器"])) return { type: "browser", label: "浏览", confidence: "medium", interruption: "medium", suggestion: "可在用户停留较久时提供总结、查找或解释帮助。" };
  if (YM_sceneHas(o, ["bilibili", "youtube", "potplayer", "vlc", "spotify", "music", "netease", "cloudmusic", "视频", "音乐"])) return { type: "media", label: "影音", confidence: "medium", interruption: "low", suggestion: "降低打扰；适合轻量吐槽或静默陪伴。" };
  if (YM_sceneHas(o, ["photoshop", "clipstudio", "sai", "krita", "blender", "aseprite", "paint", "illustrator", "画", "插画"])) return { type: "art", label: "创作", confidence: "high", interruption: "low", suggestion: "少打扰；适合提供灵感、构图、配色建议。" };
  if (YM_sceneHas(o, ["word", "excel", "powerpoint", "pdf", "obsidian", "notion", "typora", "anki", "学习", "文档"])) return { type: "study", label: "学习/文档", confidence: "medium", interruption: "medium", suggestion: "适合解释、整理笔记、提醒休息。" };
  return { type: "general", label: "普通桌面", confidence: "low", interruption: "medium", suggestion: "保持普通主动策略。" };
}
function YM_getCurrentScene() { const e = YM_awarenessCurrent && YM_awarenessCurrent.app ? YM_awarenessCurrent.app : null, t = YM_awarenessCurrent ? YM_awarenessCurrent.windowTitle : null; return YM_detectScene(e, t); }
const YM_AWARENESS_KEY = "desktop_awareness_config_v1";
const YM_KNOWN_APP_ALIASES = [
  { canonicalKey: "chrome", displayName: "Chrome", aliases: ["chrome", "chrome.exe", "google chrome", "google-chrome"] },
  { canonicalKey: "edge", displayName: "Microsoft Edge", aliases: ["msedge", "msedge.exe", "microsoft edge"] },
  { canonicalKey: "firefox", displayName: "Firefox", aliases: ["firefox", "firefox.exe", "mozilla firefox"] },
  { canonicalKey: "vscode", displayName: "VS Code", aliases: ["code", "code.exe", "visual studio code"] },
  { canonicalKey: "wechat", displayName: "WeChat", aliases: ["wechat", "wechat.exe", "weixin", "weixin.exe", "微信"] },
  { canonicalKey: "qq", displayName: "QQ", aliases: ["qq", "qq.exe", "腾讯qq"] }
];
const YM_SYSTEM_APP_ALIASES = ["dwm","dwm.exe","csrss","csrss.exe","explorer","explorer.exe","file explorer","windows explorer","program manager","lock screen","lockapp","task switching","task view","textinputhost.exe","searchui.exe","shellexperiencehost.exe","startmenuexperiencehost.exe","screenclippinghost.exe","snippingtool.exe","资源管理器","文件资源管理器","锁屏"];
function YM_norm(e) { return String(e || "").trim().toLowerCase().replace(/\\/g, "/").replace(/\s+/g, " "); }
function YM_stripExe(e) { return e.replace(/\.(exe|app|bin)$/i, ""); }
function YM_toKey(e) { return YM_stripExe(YM_norm(e)); }
function YM_titleCase(e) { const t = YM_stripExe(String(e || "")).replace(/[-_.]+/g, " ").replace(/\s+/g, " ").trim(); return t ? t.replace(/\b\w/g, (r) => r.toUpperCase()) : "Unknown App"; }
function YM_unique(e) { return Array.from(new Set(e.map(YM_norm).filter(Boolean))); }
function YM_resolveApp(e) {
  const t = String((e == null ? void 0 : e.processName) || "").trim(), r = String((e == null ? void 0 : e.title) || "").trim();
  const n = YM_unique([t, YM_stripExe(t)]), i = YM_KNOWN_APP_ALIASES.find((a) => a.aliases.some((c) => n.includes(YM_norm(c))));
  const o = i ? i.canonicalKey : YM_toKey(t || r), s = i ? i.displayName : YM_titleCase(t || r || o);
  const a = YM_unique([o, t, YM_stripExe(t), ...((i == null ? void 0 : i.aliases) || [])]), c = new Set(YM_SYSTEM_APP_ALIASES.map(YM_norm));
  return { displayName: s, canonicalKey: o, processName: t, processPath: e == null ? void 0 : e.processPath, matchKeys: a, confidence: i ? "high" : t ? "medium" : "low", isSystem: a.some((u) => c.has(u)) || !o };
}
function YM_appMatches(e, t) { const r = new Set(e.matchKeys.map(YM_toKey)); return (Array.isArray(t) ? t : []).map(YM_toKey).filter(Boolean).some((n) => r.has(n) || e.matchKeys.some((i) => i.includes(n))); }
function YM_awarenessDefault() { return { enabled: true, mode: "smart", appScope: { mode: "all", apps: [] }, privacy: { shareWindowTitle: false, allowScreenshotOnRequest: true } }; }
function YM_validateAwareness(e) { const t = YM_awarenessDefault(), r = e && typeof e == "object" ? e : {}, n = r.appScope && typeof r.appScope == "object" ? r.appScope : {}, i = r.privacy && typeof r.privacy == "object" ? r.privacy : {}; return { enabled: typeof r.enabled == "boolean" ? r.enabled : t.enabled, mode: ["quiet", "smart", "active"].includes(r.mode) ? r.mode : t.mode, appScope: { mode: ["all", "include", "exclude"].includes(n.mode) ? n.mode : t.appScope.mode, apps: Array.isArray(n.apps) ? Array.from(new Set(n.apps.map((o) => String(o || "").trim()).filter(Boolean))) : [] }, privacy: { shareWindowTitle: typeof i.shareWindowTitle == "boolean" ? i.shareWindowTitle : t.privacy.shareWindowTitle, allowScreenshotOnRequest: typeof i.allowScreenshotOnRequest == "boolean" ? i.allowScreenshotOnRequest : t.privacy.allowScreenshotOnRequest } }; }
function YM_loadAwareness() { try { return YM_validateAwareness(JSON.parse(vt(YM_AWARENESS_KEY) || "null")); } catch { return YM_awarenessDefault(); } }
function YM_saveAwareness(e) { const t = YM_validateAwareness(e); wt(YM_AWARENESS_KEY, JSON.stringify(t)); return t; }
function YM_profile(e) { return e.mode === "quiet" ? { proactiveEvents: false, minDwellMs: 0, cooldownMs: 2147483647, burstWindowMs: 2e4, burstThreshold: 4 } : e.mode === "active" ? { proactiveEvents: true, minDwellMs: 1e3, cooldownMs: 15e3, burstWindowMs: 1e4, burstThreshold: 6 } : { proactiveEvents: true, minDwellMs: 2500, cooldownMs: 9e4, burstWindowMs: 2e4, burstThreshold: 4 }; }
let YM_awarenessSettings = null, YM_awarenessCurrent = null, YM_awarenessPrevious = null, YM_awarenessTimer = null, YM_awarenessLastByApp = /* @__PURE__ */ new Map(), YM_awarenessSwitches = [], YM_awarenessLastEvent = null, YM_awarenessLastDecision = null;
function YM_clearAwarenessTimer() { YM_awarenessTimer && (clearTimeout(YM_awarenessTimer), YM_awarenessTimer = null); }
function YM_awarenessSnapshot() { const e = YM_awarenessSettings || YM_loadAwareness(); return { settings: e, current: YM_awarenessCurrent, recentApps: [], lastEvent: YM_awarenessLastEvent, lastDecision: YM_awarenessLastDecision }; }
function YM_broadcastAwareness() { const e = YM_awarenessSnapshot(); for (const t of Qe.getAllWindows()) t.isDestroyed() || t.webContents.send("desktopAwareness:snapshotChanged", e); }
function YM_buildContextPrompt(e, t) { const r = ["[SYSTEM_EVENT:DESKTOP_CONTEXT_CHANGED]", "This signal is automatically generated by the desktop client and is NOT a user-authored message.", `user_nickname: ${JSON.stringify(t)}`, `detected_app: ${JSON.stringify(e.app.displayName)}`, `app_key: ${JSON.stringify(e.app.canonicalKey)}`, `transition_type: ${JSON.stringify(e.transitionType)}`, `dwell_ms: ${e.dwellMs}`, `confidence: ${JSON.stringify(e.confidence)}`, `event_time_utc: ${JSON.stringify(new Date(e.timestamp).toISOString())}`]; const n = typeof YM_loadSceneSettings == "function" ? YM_loadSceneSettings() : null; if (n && n.enabled && n.includeInPrompt) { const i = YM_detectScene(e.app, e.windowTitle); r.push(`scene_type: ${JSON.stringify(i.type)}`, `scene_label: ${JSON.stringify(i.label)}`, `scene_confidence: ${JSON.stringify(i.confidence)}`, `recommended_interruption: ${JSON.stringify(i.interruption)}`, `scene_suggestion: ${JSON.stringify(i.suggestion)}`); } e.privacy.titleShared && e.windowTitle && r.push(`window_title: ${JSON.stringify(e.windowTitle)}`); r.push("guidance:", "- Treat this as contextual telemetry, not explicit user intent.", "- Do not respond unless the context change is meaningfully useful.", "- Respect scene_suggestion and recommended_interruption when present.", "- Do not claim screen details unless capture_screenshot is called."); return r.join("\n"); }
function YM_evalAwareness(e, t, r, n, i) { const o = YM_profile(e), s = t.app; if (!e.enabled) return { shouldNotify: false, reason: "desktop_awareness_disabled" }; if (!o.proactiveEvents) return { shouldNotify: false, reason: "quiet_mode" }; if (!s) return { shouldNotify: false, reason: "no_active_app" }; if (s.isSystem) return { shouldNotify: false, reason: "system_app" }; if (i < o.minDwellMs) return { shouldNotify: false, reason: "dwell_too_short" }; if (e.appScope.mode === "include" && !YM_appMatches(s, e.appScope.apps)) return { shouldNotify: false, reason: "outside_include_scope" }; if (e.appScope.mode === "exclude" && YM_appMatches(s, e.appScope.apps)) return { shouldNotify: false, reason: "inside_exclude_scope" }; const a = (r == null ? void 0 : r.app) && r.app.canonicalKey === s.canonicalKey; if (a && e.mode !== "active" && n === "window-switch") return { shouldNotify: false, reason: "same_app_window_switch" }; const c = Date.now(); YM_awarenessSwitches.push(c); YM_awarenessSwitches = YM_awarenessSwitches.filter((u) => u >= c - o.burstWindowMs); if (YM_awarenessSwitches.length > o.burstThreshold) return { shouldNotify: false, reason: "switch_burst_suppressed" }; const u = YM_awarenessLastByApp.get(s.canonicalKey) || 0; if (c - u < o.cooldownMs) return { shouldNotify: false, reason: "cooldown" }; return YM_awarenessLastByApp.set(s.canonicalKey, c), { shouldNotify: true, reason: "context_changed" }; }
function YM_awarenessNotify(e) { const t = Pt(); if (!(t != null && t.isConnected())) return; const r = t.getSession(); if (!r) return; const n = (qc() || "Desktop User").trim() || "Desktop User"; t.sendMessage({ content: [{ type: "text", text: YM_buildContextPrompt(e, n) }], metadata: { userId: r.userId, userName: n, sessionId: r.sessionId, messageType: "notify" } }).catch((i) => console.error("[桌面感知] 发送上下文通知失败:", i)); }
function YM_evaluateAwareness(e) { if (!YM_awarenessSettings || !YM_awarenessCurrent || !YM_awarenessCurrent.app || !YM_awarenessCurrent.focusedSince) return; const t = Date.now(), r = t - YM_awarenessCurrent.focusedSince, n = YM_evalAwareness(YM_awarenessSettings, YM_awarenessCurrent, YM_awarenessPrevious, e, r); YM_awarenessLastDecision = { ...n, timestamp: t }; if (!n.shouldNotify) return YM_broadcastAwareness(); const i = { app: YM_awarenessCurrent.app, previousApp: (YM_awarenessPrevious == null ? void 0 : YM_awarenessPrevious.app) || null, windowTitle: YM_awarenessSettings.privacy.shareWindowTitle ? YM_awarenessCurrent.windowTitle : null, transitionType: e, dwellMs: r, timestamp: t, confidence: YM_awarenessCurrent.app.confidence, privacy: { titleShared: YM_awarenessSettings.privacy.shareWindowTitle, screenshotIncluded: false } }; YM_awarenessLastEvent = i; YM_awarenessNotify(i); YM_broadcastAwareness(); }
function YM_updateAwarenessContext(e, t, r) { YM_awarenessSettings || (YM_awarenessSettings = YM_loadAwareness()); if (!YM_awarenessSettings.enabled) return; const n = YM_resolveApp(e), i = YM_awarenessCurrent && YM_awarenessCurrent.app ? YM_awarenessCurrent : null, o = (i == null ? void 0 : i.app) && i.app.canonicalKey === n.canonicalKey, s = (i == null ? void 0 : i.window) && i.window.id === e.id, a = t === "app-switch" && o && !s ? "window-switch" : t; YM_awarenessPrevious = i; YM_awarenessCurrent = { app: n, window: e, windowTitle: e.title || null, isFullscreen: !!e.isFullscreen, focusedSince: s ? YM_awarenessCurrent.focusedSince || r : r, updatedAt: r }; YM_broadcastAwareness(); if (s && t === "app-switch") return; YM_clearAwarenessTimer(); const c = YM_profile(YM_awarenessSettings).minDwellMs; YM_awarenessTimer = setTimeout(() => YM_evaluateAwareness(a), c); }
function YM_desktopAwarenessHandleEvent(e) { if (!e || !e.window) return; if (e.type === "focus") return YM_updateAwarenessContext(e.window, "app-switch", e.timestamp || Date.now()); if (e.type === "fullscreen" || e.type === "windowed" || e.type === "maximize" && e.window.isFullscreen || e.type === "restore" && !e.window.isFullscreen) return YM_updateAwarenessContext(e.window, e.window.isFullscreen ? "fullscreen-enter" : "fullscreen-exit", e.timestamp || Date.now()); }
const Xr = /* @__PURE__ */ new Set();
let es = !1, ts = null, rs = !1, ns = null;
function TS(e, t) {
  return [
    "[SYSTEM_EVENT:DESKTOP_APP_LAUNCH]",
    "This signal is automatically generated by the desktop client and is NOT a user-authored message.",
    `user_nickname: ${JSON.stringify(t)}`,
    `detected_app: ${JSON.stringify(e)}`,
    `event_time_utc: ${(/* @__PURE__ */ new Date()).toISOString()}`,
    "guidance:",
    "- Treat this as contextual telemetry, not explicit user intent.",
    "- Do not claim screen details unless capture_screenshot is called.",
    "- Optional next actions: ignore, brief proactive comment, or capture_screenshot then respond."
  ].join(`
`);
}
le.handle("window:startWatching", async (e) => {
  const t = $e.timer("start_watching"), r = Qe.fromWebContents(e.sender);
  if (!r)
    return t.done({ success: !1, reason: "window_not_found" }), { success: !1, error: J("error.cannotGetWindowInstance") };
  Xr.add(r), $e.info("watcher.renderer_registered", {
    windowId: r.id,
    registeredCount: Xr.size
  });
  const n = vr();
  return n.isActive() || await n.start(), es || (es = !0, ts = n.onWindowEvent((i) => {
    for (const o of Xr)
      o.isDestroyed() || o.webContents.send("window:event", i);
    YM_desktopAwarenessHandleEvent(i);
  })), rs || (rs = !0, ns = n.onAppLaunch((i) => {
    var c;
    const o = Pt();
    if (!(o != null && o.isConnected())) return;
    const s = o.getSession();
    if (!s) return;
    const a = ((c = qc()) == null ? void 0 : c.trim()) || "Desktop User";
    o.sendMessage({
      content: [
        {
          type: "text",
          text: TS(i, a)
        }
      ],
      metadata: {
        userId: s.userId,
        userName: a,
        sessionId: s.sessionId,
        messageType: "notify"
      }
    }).catch((u) => {
      console.error("[窗口监听] 发送应用启动通知失败:", u), $e.error("app_launch_notify.failed", u, { appName: i });
    });
  })), await n.startAppLaunchDetection(), r.on("closed", () => {
    Xr.delete(r), $e.info("watcher.renderer_closed", {
      windowId: r.id,
      registeredCount: Xr.size
    }), Xr.size === 0 && (ts && (ts(), ts = null, es = !1), ns && (ns(), ns = null, rs = !1), n.stopAppLaunchDetection(), n.stop(), $e.info("watcher.stopped_after_last_renderer"));
  }), t.done({
    success: !0,
    windowId: r.id,
    watcherActive: n.isActive(),
    globalListenerRegistered: es,
    appLaunchListenerRegistered: rs
  }), { success: !0 };
});
le.handle("window:getActiveWindow", async () => {
  const t = vr().getCurrentWindow();
  return $e.debug("get_active_window", { currentWindow: t }), t;
});
le.handle("window:getWindowHistory", async () => {
  const t = vr().getWindowHistory();
  return $e.debug("get_window_history", { count: t.length }), t;
});
le.handle("window:getAllWindows", async () => {
  const t = vr().getAllWindows();
  return $e.debug("get_all_windows", { count: t.length }), t;
});
le.handle("window:buildAIContext", async () => {
  const t = vr().buildAIContext();
  return $e.debug("build_ai_context", { context: t }), t;
});
le.handle("personality:getSettings", async () => YM_loadPersonality());
le.handle("personality:updateSettings", async (e, t) => YM_savePersonality({ ...YM_loadPersonality(), ...(t || {}) }));
le.handle("personality:resetSettings", async () => YM_savePersonality(YM_personalityDefault()));
le.handle("personality:getPrompt", async () => YM_buildPersonalityPrompt(YM_loadPersonality()));
le.handle("desktopScene:getSettings", async () => YM_loadSceneSettings());
le.handle("desktopScene:updateSettings", async (e, t) => YM_saveSceneSettings({ ...YM_loadSceneSettings(), ...(t || {}) }));
le.handle("desktopScene:resetSettings", async () => YM_saveSceneSettings(YM_sceneDefault()));
le.handle("desktopScene:getSnapshot", async () => {
  let r = YM_awarenessCurrent, n = YM_getCurrentScene();
  try {
    const i = await Vp();
    if (i && i.window) {
      const o = YM_resolveApp(i.window);
      r = { app: o, window: i.window, windowTitle: i.window.title || null, isFullscreen: !!i.window.isFullscreen, focusedSince: Date.now(), updatedAt: Date.now() };
      n = YM_detectScene(o, i.window.title || "");
    }
  } catch {}
  return { settings: YM_loadSceneSettings(), scene: n, current: r };
});
le.handle("desktopAwareness:getSettings", async () => YM_loadAwareness());
le.handle("desktopAwareness:updateSettings", async (e, t) => {
  YM_awarenessSettings = YM_saveAwareness({ ...YM_loadAwareness(), ...(t || {}), appScope: { ...YM_loadAwareness().appScope, ...((t || {}).appScope || {}) }, privacy: { ...YM_loadAwareness().privacy, ...((t || {}).privacy || {}) } });
  YM_awarenessLastByApp.clear();
  YM_awarenessSwitches = [];
  YM_clearAwarenessTimer();
  YM_broadcastAwareness();
  return YM_awarenessSettings;
});
le.handle("desktopAwareness:resetSettings", async () => {
  YM_awarenessSettings = YM_saveAwareness(YM_awarenessDefault());
  YM_awarenessLastByApp.clear();
  YM_awarenessSwitches = [];
  YM_clearAwarenessTimer();
  YM_broadcastAwareness();
  return YM_awarenessSettings;
});
le.handle("desktopAwareness:getSnapshot", async () => YM_awarenessSnapshot());
le.handle("window:getWatcherConfig", async () => {
  const t = await vr().getConfig();
  return $e.debug("get_watcher_config", { config: t }), t;
});
le.handle("window:updateWatcherConfig", async (e, t) => {
  const r = $e.timer("update_watcher_config", { config: t }), n = vr();
  return await n.updateConfig(t), await n.startAppLaunchDetection(), r.done(), { success: !0 };
});
le.handle("window:resetWatcherConfig", async () => {
  const e = $e.timer("reset_watcher_config"), t = vr();
  await t.resetConfig(), await t.startAppLaunchDetection();
  const r = await t.getConfig();
  return e.done({ config: r }), { success: !0, config: r };
});
le.handle("window:downloadCubismCore", async () => {
  const e = $e.timer("download_cubism_core"), { checkCubismCoreExists: t, showDownloadDialog: r, downloadWithProgress: n } = await Promise.resolve().then(() => GE);
  if (t())
    return e.done({ alreadyExists: !0 }), { success: !0, alreadyExists: !0 };
  if (!await r())
    return e.done({ cancelled: !0 }), { success: !1, cancelled: !0 };
  const o = await n();
  return e.done({ downloadSuccess: o }), { success: o };
});
le.handle("window:getCursorPosition", async () => {
  const e = Lr.getCursorScreenPoint();
  return { x: e.x, y: e.y };
});
le.handle("model:capturePreview", async (e, t) => {
  const r = Et.timer("capture_preview", { modelPath: t });
  try {
    const n = mr();
    if (!n || n.isDestroyed()) throw new Error("主窗口不可用");
    const i = await n.webContents.capturePage();
    const o = Rl(t), s = Q.dirname(o), a = Q.join(s, "astrbot.live2d.preview.png");
    await Te.promises.writeFile(a, i.resize({ width: 360 }).toPNG());
    return r.done({ path: a }), { success: !0, path: a };
  } catch (n) {
    return console.error("[IPC] 捕获模型缩略图失败:", n), r.fail(n), { success: !1, error: n.message || String(n) };
  }
});
le.handle("model:getPreview", async (e, t) => {
  try {
    const r = Rl(t), n = Q.join(Q.dirname(r), "astrbot.live2d.preview.png");
    if (!Te.existsSync(n)) return { success: !1, error: "缩略图不存在" };
    const i = await Te.promises.readFile(n);
    return { success: !0, dataUrl: `data:image/png;base64,${i.toString("base64")}`, path: n };
  } catch (r) {
    return { success: !1, error: r.message || String(r) };
  }
});
function YM_dirSizeSync(e) {
  let t = 0, r = 0;
  try {
    for (const n of Te.readdirSync(e, { withFileTypes: !0 })) {
      const i = Q.join(e, n.name);
      if (n.isDirectory()) { const o = YM_dirSizeSync(i); t += o.size; r += o.files; }
      else if (n.isFile()) { const o = Te.statSync(i); t += o.size; r += 1; }
    }
  } catch {}
  return { size: t, files: r };
}
function YM_getAllUserConfig() {
  const e = {};
  try { for (const t of ut().prepare("SELECT key,value FROM user_config").all()) e[t.key] = t.value; } catch {}
  return e;
}
function YM_getStorageOverview() {
  const e = ut();
  const t = Q.join(pi(), "history.db"), r = Q.join(pi(), "history.db-wal"), n = Q.join(pi(), "history.db-shm");
  const i = (o) => { try { return Te.existsSync(o) ? Te.statSync(o).size : 0; } catch { return 0; } };
  const o = e.prepare("SELECT COUNT(*) AS count FROM messages").get().count || 0;
  const s = e.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(size_bytes),0) AS bytes FROM message_resources").get();
  const a = e.prepare("SELECT COUNT(*) AS count FROM performances").get().count || 0;
  const c = e.prepare("SELECT COUNT(*) AS count FROM statistics").get().count || 0;
  const u = YM_dirSizeSync(Fr()), l = YM_dirSizeSync(Vs()), f = YM_dirSizeSync(pi());
  return { appDataPath: pi(), databasePath: t, logPath: Fr(), modelsPath: Vs(), messageCount: o, performanceCount: a, statisticsRows: c, resourceCount: s.count || 0, resourceTotalBytes: s.bytes || 0, databaseFileBytes: i(t) + i(r) + i(n), logsBytes: u.size, modelsBytes: l.size, appDataBytes: f.size, files: { logs: u.files, models: l.files, appData: f.files } };
}
async function YM_collectLocalStorage(e) {
  try { return await e.webContents.executeJavaScript(`(() => { const data = {}; for (let i = 0; i < window.localStorage.length; i++) { const key = window.localStorage.key(i); if (key) data[key] = window.localStorage.getItem(key); } return data; })()`); } catch { return {}; }
}
async function YM_applyLocalStorage(e, t) {
  if (!t || typeof t != "object") return;
  await e.webContents.executeJavaScript(`(() => { const data = ${JSON.stringify(t)}; for (const [key, value] of Object.entries(data)) window.localStorage.setItem(key, value); })()`);
}
function YM_sanitizeConnectionSettings(e) { const t = e && typeof e == "object" ? { ...e } : e; if (t && typeof t == "object") { if (typeof t.token == "string" && t.token) t.token = "<REDACTED>"; if (typeof t.customResourceToken == "string" && t.customResourceToken) t.customResourceToken = "<REDACTED>"; } return t; }
le.handle("storage:getOverview", async () => {
  try { return { success: true, data: YM_getStorageOverview() }; } catch (e) { return { success: false, error: e.message || String(e) }; }
});
le.handle("config:export", async (e) => {
  try {
    const t = Qe.fromWebContents(e.sender);
    if (!t || t.isDestroyed()) throw new Error("Source window not found");
    const r = Op(), n = Fw(), i = { version: 1, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), connectionSettings: r.success ? YM_sanitizeConnectionSettings(r.data) : void 0, connectionBehaviorSettings: n.success ? n.data : void 0, userConfig: YM_getAllUserConfig(), localStorage: await YM_collectLocalStorage(t) };
    delete i.userConfig.user_id;
    const o = await Ot.showSaveDialog(t, { title: "导出配置", defaultPath: `astrbot-config-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`, filters: [{ name: "JSON", extensions: ["json"] }] });
    if (o.canceled || !o.filePath) return { success: false, canceled: true };
    await Te.promises.writeFile(o.filePath, `${JSON.stringify(i, null, 2)}\n`, "utf8");
    return { success: true, filePath: o.filePath, path: o.filePath };
  } catch (t) { return { success: false, error: t.message || String(t) }; }
});
le.handle("config:import", async (e) => {
  try {
    const t = Qe.fromWebContents(e.sender);
    if (!t || t.isDestroyed()) throw new Error("Source window not found");
    const r = await Ot.showOpenDialog(t, { title: "导入配置", filters: [{ name: "JSON", extensions: ["json"] }], properties: ["openFile"] });
    if (r.canceled || !r.filePaths[0]) return { success: false, canceled: true };
    const n = JSON.parse(await Te.promises.readFile(r.filePaths[0], "utf8"));
    if (!n || n.version !== 1) throw new Error("Unsupported config version");
    return { success: true, preview: { exportedAt: n.exportedAt, hasConnectionSettings: !!n.connectionSettings, hasConnectionBehaviorSettings: !!n.connectionBehaviorSettings, userConfigKeys: Object.keys(n.userConfig || {}), localStorageKeys: Object.keys(n.localStorage || {}) }, data: n, filePath: r.filePaths[0] };
  } catch (t) { return { success: false, error: t.message || String(t) }; }
});
le.handle("config:applyImport", async (e, t) => {
  var i, o;
  try {
    const r = Qe.fromWebContents(e.sender);
    if (!r || r.isDestroyed()) throw new Error("Source window not found");
    if (!t || t.version !== 1) throw new Error("Unsupported config version");
    if (t.connectionSettings) { const s = { ...t.connectionSettings }; s.token === "<REDACTED>" && (s.token = ""); s.customResourceToken === "<REDACTED>" && (s.customResourceToken = ""); const a = Op(), c = a.success ? a.data.revision : 0, u = bw({ data: s, expectedRevision: c }); if (!u.success) throw new Error(u.message || u.code || "连接配置导入失败"); await ((i = Pt()) == null ? void 0 : i.handleConnectionSettingsUpdated(u.data)); bg(u.data); }
    if (t.connectionBehaviorSettings) { const s = kw({ data: t.connectionBehaviorSettings }); if (!s.success) throw new Error(s.message || s.code || "连接行为配置导入失败"); await ((o = Pt()) == null ? void 0 : o.handleBehaviorSettingsUpdated(s.data)); Tg(s.data); }
    if (t.userConfig && typeof t.userConfig == "object") for (const [s,a] of Object.entries(t.userConfig)) s !== "user_id" && wt(s, String(a ?? ""));
    await YM_applyLocalStorage(r, t.localStorage);
    return { success: true };
  } catch (r) { return { success: false, error: r.message || String(r) }; }
});
le.handle("data:getStorageStats", async () => {
  async function e(t) {
    let r = 0, n = 0;
    try {
      const i = await Te.promises.readdir(t, { withFileTypes: !0 });
      for (const o of i) {
        const s = Q.join(t, o.name);
        if (o.isDirectory()) { const a = await e(s); r += a.size; n += a.files; }
        else if (o.isFile()) { const a = await Te.promises.stat(s); r += a.size; n += 1; }
      }
    } catch {}
    return { size: r, files: n };
  }
  const t = pi(), r = Fr(), n = Vs(), i = await e(t), o = await e(r), s = await e(n);
  return { success: !0, appDataPath: t, logPath: r, modelsPath: n, total: i, logs: o, models: s };
});
le.handle("data:exportSettings", async () => {
  try {
    const e = { exportedAt: (/* @__PURE__ */ new Date()).toISOString(), userConfig: {} };
    try {
      const r = ut().prepare("SELECT key,value FROM user_config").all();
      for (const n of r) e.userConfig[n.key] = n.value;
    } catch {}
    const t = await Ot.showSaveDialog({ title: "导出设置", defaultPath: Q.join(Pe.getPath("documents"), "astrbot-live2d-settings.json"), filters: [{ name: "JSON", extensions: ["json"] }] });
    if (t.canceled || !t.filePath) return { success: !1, canceled: !0 };
    await Te.promises.writeFile(t.filePath, `${JSON.stringify(e, null, 2)}\n`, "utf8");
    return { success: !0, path: t.filePath };
  } catch (e) { return { success: !1, error: e.message || String(e) }; }
});
le.handle("data:importSettings", async () => {
  try {
    const e = await Ot.showOpenDialog({ title: "导入设置", properties: ["openFile"], filters: [{ name: "JSON", extensions: ["json"] }] });
    if (e.canceled || e.filePaths.length === 0) return { success: !1, canceled: !0 };
    const t = JSON.parse(await Te.promises.readFile(e.filePaths[0], "utf8"));
    if (!t || typeof t != "object" || !t.userConfig || typeof t.userConfig != "object") throw new Error("设置文件格式无效");
    for (const [r,n] of Object.entries(t.userConfig)) typeof r == "string" && wt(r, String(n ?? ""));
    return { success: !0, source: e.filePaths[0] };
  } catch (e) { return { success: !1, error: e.message || String(e) }; }
});

function CS(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
async function RS(e) {
  vv({
    ...e,
    content: e.content
  });
  try {
    const t = await dm(e.messageId, e.content, {
      forceReplaceResources: !0,
      resourceContext: e.resourceContext,
      strict: !0
    });
    return fp(e.messageId, t.content), t.content;
  } catch (t) {
    throw _v(e.messageId), t;
  }
}
async function AS(e) {
  const t = {
    limit: e.limit,
    offset: e.offset,
    startDate: e.startDate,
    endDate: e.endDate,
    messageType: e.messageType,
    direction: e.direction,
    keyword: e.keyword
  }, r = Sv(t);
  let n = 0;
  if (e.repairOffline)
    for (const i of r) {
      const o = typeof (i == null ? void 0 : i.message_id) == "string" ? i.message_id : "";
      if (!o)
        continue;
      const s = CS(i.content), a = await dm(o, s, {
        resourceContext: e.resourceContext,
        strict: !1
      });
      a.changed && (fp(o, a.content), Ev(o, a.content), i.content = JSON.stringify(a.content), n += 1);
    }
  return {
    messages: r,
    total: Rv(t),
    repairedCount: n
  };
}
function PS(e) {
  wv(e);
}
function IS(e) {
  bv(e);
}
function DS(e, t) {
  return Tv(e, t);
}
function xS(e, t) {
  return Cv(e, t);
}
function NS() {
  Av();
}
const $r = at("ipc.history");
le.handle("history:getMessages", async (e, t) => {
  const r = $r.timer("get_messages", { options: t });
  try {
    const n = await AS(t);
    return r.done({
      total: n.total,
      returned: n.messages.length,
      repairedCount: n.repairedCount
    }), {
      success: !0,
      data: n.messages,
      total: n.total,
      repairedCount: n.repairedCount
    };
  } catch (n) {
    return console.error("[IPC] 查询消息历史失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("history:saveMessage", async (e, t) => {
  const r = $r.timer("save_message", {
    messageId: t.messageId,
    sessionId: t.sessionId,
    messageType: t.messageType,
    direction: t.direction,
    contentType: Array.isArray(t.content) ? "array" : typeof t.content,
    contentCount: Array.isArray(t.content) ? t.content.length : void 0,
    timestamp: t.timestamp
  });
  try {
    const n = await RS(t);
    return r.done({
      localizedContentCount: Array.isArray(n) ? n.length : 0
    }), { success: !0, localizedContent: n };
  } catch (n) {
    return console.error("[IPC] 保存消息失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("history:savePerformance", (e, t) => {
  const r = $r.timer("save_performance", {
    messageId: t.messageId,
    sequenceCount: Array.isArray(t.sequence) ? t.sequence.length : 0,
    duration: t.duration,
    interrupted: t.interrupted
  });
  try {
    return PS(t), r.done(), { success: !0 };
  } catch (n) {
    return console.error("[IPC] 保存表演记录失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("history:updateStatistics", (e, t) => {
  const r = $r.timer("update_statistics", {
    date: t.date,
    hour: t.hour,
    messageCount: t.messageCount,
    textCount: t.textCount,
    imageCount: t.imageCount,
    audioCount: t.audioCount,
    videoCount: t.videoCount
  });
  try {
    return IS(t), r.done(), { success: !0 };
  } catch (n) {
    return console.error("[IPC] 更新统计数据失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("history:getStatistics", (e, t, r) => {
  const n = $r.timer("get_statistics", { startDate: t, endDate: r });
  try {
    const i = DS(t, r);
    return n.done({ count: i.length }), { success: !0, data: i };
  } catch (i) {
    return console.error("[IPC] 获取统计数据失败:", i), n.fail(i), { success: !1, error: i.message };
  }
});
le.handle("history:getAverageResponseTime", (e, t, r) => {
  const n = $r.timer("get_average_response_time", { startDate: t, endDate: r });
  try {
    const i = xS(t, r);
    return n.done({ averageResponseTime: i }), { success: !0, data: i };
  } catch (i) {
    return console.error("[IPC] 获取平均响应时长失败:", i), n.fail(i), { success: !1, error: i.message };
  }
});
le.handle("history:clearHistory", () => {
  const e = $r.timer("clear_history");
  try {
    return NS(), e.done(), { success: !0 };
  } catch (t) {
    return console.error("[IPC] 清空历史记录失败:", t), e.fail(t), { success: !1, error: t.message };
  }
});
const OS = 1, LS = ".vtube.json", cg = ".exp3.json", lg = ".motion3.json", Zh = "astrbot.live2d.profile.json";
function Qt(e) {
  return e.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\/+/, "");
}
function bi(e) {
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e) {
    if (typeof n != "string")
      continue;
    const i = n.trim();
    if (!i)
      continue;
    const o = i.toLowerCase();
    t.has(o) || (t.add(o), r.push(i));
  }
  return r;
}
function Zt(e) {
  return e.replace(/\.exp3\.json$/i, "").replace(/\.motion3\.json$/i, "").replace(/\.json$/i, "");
}
function FS(e, t) {
  const r = Q.resolve(e), n = Q.resolve(t), i = Q.relative(r, n);
  return i === "" || !i.startsWith("..") && !Q.isAbsolute(i);
}
function Ic(e, t) {
  const r = Qt(t);
  if (!r)
    return null;
  const n = Q.resolve(e, r);
  return !FS(e, n) || !Te.existsSync(n) || !Te.statSync(n).isFile() ? null : Qt(Q.relative(e, n));
}
function kS(e, t) {
  const r = Q.join(e, t);
  return Te.existsSync(r) && Te.statSync(r).isFile();
}
function ep(e, t) {
  const r = Q.basename(t).toLowerCase(), n = e.get(r) ?? [];
  n.push(t), e.set(r, n);
}
function US(e) {
  const t = [], r = [], n = [], i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function s(a) {
    const c = Te.readdirSync(a, { withFileTypes: !0 });
    for (const u of c) {
      const l = Q.join(a, u.name);
      if (u.isDirectory()) {
        s(l);
        continue;
      }
      if (!u.isFile())
        continue;
      const f = Qt(Q.relative(e, l)), d = u.name.toLowerCase();
      d.endsWith(lg) ? (t.push(f), ep(i, f)) : d.endsWith(cg) ? (r.push(f), ep(o, f)) : d.endsWith(LS) && n.push(f);
    }
  }
  return s(e), t.sort(), r.sort(), n.sort(), {
    motionFiles: t,
    expressionFiles: r,
    motionByBasename: i,
    expressionByBasename: o,
    companionFiles: n
  };
}
function MS(e, t) {
  return e.length === 0 ? { match: null, ambiguous: !1 } : e.length === 1 ? { match: e[0], ambiguous: !1 } : {
    match: [...e].sort((n, i) => {
      const o = n.split("/").length, s = i.split("/").length, a = t === "motion" ? n.toLowerCase().includes("/motions/") ? 1 : 0 : n.split("/").length === 1 ? 1 : 0, c = t === "motion" ? i.toLowerCase().includes("/motions/") ? 1 : 0 : i.split("/").length === 1 ? 1 : 0;
      return a !== c ? c - a : o !== s ? o - s : n.localeCompare(i);
    })[0],
    ambiguous: !0
  };
}
function is(e, t, r, n, i) {
  const o = String(t || "").trim();
  if (!o)
    return null;
  const s = Ic(e, o);
  if (s)
    return s;
  const a = r === "motion" ? n.motionByBasename.get(Q.basename(o).toLowerCase()) ?? [] : n.expressionByBasename.get(Q.basename(o).toLowerCase()) ?? [], c = MS(a, r);
  return c.ambiguous && c.match && i.push(
    `兼容清单中的 ${r} 引用 ${o} 存在多个候选，已选择 ${c.match}`
  ), c.match;
}
function Tl(e, t, r, n, i, o) {
  const s = t.toLowerCase(), a = i.trim() || Zt(Q.basename(t)), c = bi([
    a,
    Zt(Q.basename(t)),
    ...o
  ]), u = e.get(s);
  if (!u) {
    e.set(s, {
      id: a,
      file: t,
      aliases: new Set(c),
      source: r,
      priority: n
    });
    return;
  }
  c.forEach((l) => u.aliases.add(l)), n < u.priority && (u.id = a, u.source = r, u.priority = n);
}
function oi(e, t, r, n, i) {
  const o = t.toLowerCase(), s = i.trim() || Zt(Q.basename(t)), a = e.get(o);
  if (!a) {
    e.set(o, {
      group: s,
      file: t,
      source: r,
      priority: n
    });
    return;
  }
  n < a.priority && (a.group = s, a.source = r, a.priority = n);
}
function $S(e) {
  return e.includes("expression");
}
function BS(e) {
  return e.includes("animation") || e.includes("motion");
}
function qS(e) {
  const t = Zt(Q.basename(e)), r = t.toLowerCase();
  return r.includes("idle") || r.includes("default") || r.includes("standby") || t.includes("待机") ? "Idle" : t;
}
function WS(e, t, r, n, i) {
  const o = t.FileReferences ?? {};
  let s = 0, a = 0;
  for (const c of o.Expressions ?? []) {
    const u = typeof (c == null ? void 0 : c.File) == "string" ? c.File : "", l = Ic(e, u);
    if (!l) {
      u && i.push(`标准模型声明的表情文件不存在: ${Qt(u)}`);
      continue;
    }
    s += 1;
    const f = typeof (c == null ? void 0 : c.Name) == "string" ? c.Name.trim() : "", d = Zt(Q.basename(l));
    Tl(
      r,
      l,
      "model3",
      0,
      f || d,
      bi([f, d])
    );
  }
  for (const [c, u] of Object.entries(o.Motions ?? {})) {
    let l = !1;
    for (const f of u ?? []) {
      const d = typeof (f == null ? void 0 : f.File) == "string" ? f.File : "", p = Ic(e, d);
      if (!p) {
        d && i.push(`标准模型声明的动作文件不存在: ${Qt(d)}`);
        continue;
      }
      l = !0, oi(
        n,
        p,
        "model3",
        0,
        c
      );
    }
    l && (a += 1);
  }
  return {
    expressionCount: s,
    motionGroupCount: a
  };
}
function HS(e, t, r, n, i, o) {
  var d, p;
  const s = Q.join(e, t);
  let a;
  try {
    a = JSON.parse(Te.readFileSync(s, "utf8"));
  } catch (g) {
    o.push(
      `伴生清单解析失败 ${t}: ${g instanceof Error ? g.message : String(g)}`
    );
    return;
  }
  const c = (d = a.FileReferences) == null ? void 0 : d.IdleAnimation, u = c ? is(e, c, "motion", r, o) : null;
  u && oi(i, u, "companion", 1, "Idle");
  const l = (p = a.FileReferences) == null ? void 0 : p.IdleAnimationWhenTrackingLost, f = l ? is(e, l, "motion", r, o) : null;
  f && oi(i, f, "companion", 1, "IdleTrackingLost");
  for (const g of a.Hotkeys ?? []) {
    const y = typeof (g == null ? void 0 : g.File) == "string" ? g.File : "", m = typeof (g == null ? void 0 : g.Name) == "string" ? g.Name.trim() : "", S = typeof (g == null ? void 0 : g.Action) == "string" ? g.Action.trim().toLowerCase() : "";
    if (!y)
      continue;
    const C = y.toLowerCase();
    if (C.endsWith(cg) || $S(S)) {
      const A = is(e, y, "expression", r, o);
      if (!A) {
        o.push(`伴生清单声明的表情文件不存在: ${y}`);
        continue;
      }
      const x = Zt(Q.basename(A));
      Tl(
        n,
        A,
        "companion",
        1,
        m || x,
        bi([m, x])
      );
      continue;
    }
    if (C.endsWith(lg) || BS(S)) {
      const A = is(e, y, "motion", r, o);
      if (!A) {
        o.push(`伴生清单声明的动作文件不存在: ${y}`);
        continue;
      }
      const x = m || Zt(Q.basename(A));
      oi(i, A, "companion", 1, x);
    }
  }
}
function jS(e, t, r) {
  for (const n of e.expressionFiles)
    Tl(
      t,
      n,
      "scan",
      2,
      Zt(Q.basename(n)),
      []
    );
  for (const n of e.motionFiles)
    oi(
      r,
      n,
      "scan",
      2,
      qS(n)
    );
}
function GS(e, t, r, n, i, o, s) {
  const a = /* @__PURE__ */ new Set();
  e.forEach((f) => a.add(f.source)), Object.values(t).forEach((f) => f.forEach((d) => a.add(d.source)));
  const c = [...a.values()], u = c.some((f) => f !== "model3");
  let l = "standard";
  return u && (l = n > 0 || i > 0 ? "hybrid" : "compatibility"), {
    mode: l,
    sources: c,
    companionFiles: r,
    standardDeclaredExpressions: n,
    standardDeclaredMotionGroups: i,
    discoveredExpressions: e.length,
    discoveredMotionGroups: Object.keys(t).length,
    scannedExpressionCount: o.expressionFiles.length,
    scannedMotionCount: o.motionFiles.length,
    warnings: [...s]
  };
}
function zS(e) {
  const t = /* @__PURE__ */ new Map();
  return e.map((r) => {
    const n = r.id.trim() || Zt(Q.basename(r.file)), i = n.toLowerCase(), o = t.get(i) ?? 0;
    if (t.set(i, o + 1), o === 0)
      return r;
    const s = `${n}_${o + 1}`;
    return {
      ...r,
      id: s,
      aliases: bi([n, ...r.aliases])
    };
  });
}
function ug(e) {
  const t = Q.resolve(e), r = Q.dirname(t), n = Qt(Q.basename(t)), i = Q.join(r, Zh), o = [], s = US(r), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  let u = {};
  try {
    u = JSON.parse(Te.readFileSync(t, "utf8"));
  } catch (p) {
    o.push(`标准模型配置解析失败: ${p instanceof Error ? p.message : String(p)}`);
  }
  const l = WS(
    r,
    u,
    a,
    c,
    o
  );
  for (const p of s.companionFiles)
    HS(
      r,
      p,
      s,
      a,
      c,
      o
    );
  jS(s, a, c);
  const f = zS(
    [...a.values()].sort((p, g) => p.id.localeCompare(g.id) || p.file.localeCompare(g.file)).map((p) => ({
      id: p.id,
      file: p.file,
      aliases: bi([...p.aliases.values()]),
      source: p.source
    }))
  ), d = [...c.values()].sort((p, g) => p.group.localeCompare(g.group) || p.file.localeCompare(g.file)).reduce((p, g) => (p[g.group] || (p[g.group] = []), p[g.group].push({
    file: g.file,
    source: g.source
  }), p), {});
  return {
    version: OS,
    modelFile: n,
    expressionProfileFile: kS(r, Zh) ? Qt(Q.relative(r, i)) : null,
    expressions: f,
    motions: d,
    discovery: GS(
      f,
      d,
      s.companionFiles,
      l.expressionCount,
      l.motionGroupCount,
      s,
      o
    )
  };
}
function Cl(e, t) {
  const r = ug(t);
  return {
    modelPath: e,
    compatibilityManifest: r,
    warnings: [...r.discovery.warnings],
    manifest: {
      modelFile: r.modelFile,
      moc: "",
      textures: [],
      motions: r.motions ? Object.values(r.motions).flat().map((n) => Qt(n.file)) : [],
      expressions: r.expressions.map((n) => Qt(n.file)),
      physics: void 0,
      pose: void 0,
      userData: void 0
    }
  };
}
function xt(e) {
  return e.replace(/\\/g, "/").replace(/^\.\//, "");
}
function kt(e, t, r) {
  return {
    severity: e,
    kind: t,
    relativePath: xt(r)
  };
}
function lr(e, t) {
  const r = Q.join(e, t);
  return Te.existsSync(r) && Te.statSync(r).isFile();
}
function dg(e) {
  const t = Q.resolve(e), r = Q.dirname(t), n = Q.basename(t), i = xt(n);
  if (!lr(r, n))
    return {
      manifest: {
        modelFile: i,
        moc: "",
        textures: [],
        motions: [],
        expressions: []
      },
      issues: [kt("required", "model", i)],
      discoveryWarnings: []
    };
  let o;
  try {
    o = JSON.parse(Te.readFileSync(t, "utf8"));
  } catch (d) {
    return {
      manifest: {
        modelFile: i,
        moc: "",
        textures: [],
        motions: [],
        expressions: []
      },
      issues: [kt("required", "model", i)],
      discoveryWarnings: [],
      fatalError: `模型配置解析失败: ${d instanceof Error ? d.message : String(d)}`
    };
  }
  const s = o.FileReferences ?? {}, a = ug(t), c = (s.Expressions ?? []).map((d) => d == null ? void 0 : d.File).filter((d) => !!d).map(xt), u = [];
  for (const d of Object.values(s.Motions ?? {}))
    for (const p of d)
      p != null && p.File && u.push(xt(p.File));
  const l = {
    modelFile: i,
    moc: xt(s.Moc ?? ""),
    textures: (s.Textures ?? []).map(xt),
    motions: [],
    expressions: a.expressions.map((d) => xt(d.file)),
    physics: s.Physics ? xt(s.Physics) : void 0,
    pose: s.Pose ? xt(s.Pose) : void 0,
    userData: s.UserData ? xt(s.UserData) : void 0
  };
  for (const d of Object.values(a.motions))
    for (const p of d)
      p != null && p.file && l.motions.push(xt(p.file));
  const f = [];
  (!l.moc || !lr(r, l.moc)) && f.push(kt("required", "moc", l.moc || "[missing-moc-reference]")), l.textures.length === 0 && f.push(kt("required", "texture", "[missing-texture-reference]"));
  for (const d of l.textures)
    lr(r, d) || f.push(kt("required", "texture", d));
  for (const d of u)
    lr(r, d) || f.push(kt("optional", "motion", d));
  for (const d of c)
    lr(r, d) || f.push(kt("optional", "expression", d));
  return l.physics && !lr(r, l.physics) && f.push(kt("optional", "physics", l.physics)), l.pose && !lr(r, l.pose) && f.push(kt("optional", "pose", l.pose)), l.userData && !lr(r, l.userData) && f.push(kt("optional", "userData", l.userData)), {
    manifest: l,
    issues: f,
    discoveryWarnings: [...a.discovery.warnings],
    compatibilityManifest: a
  };
}
function ai(e) {
  return e.map((t) => `${t.severity}:${t.kind}:${t.relativePath}`);
}
const Ti = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "anxious",
  "surprised",
  "thinking",
  "tired",
  "disgusted",
  "blush",
  "playful",
  "sweat",
  "special",
  "speaking"
];
function fg() {
  return Ti.reduce((e, t) => (e[t] = [], e), {});
}
function hg(e) {
  return Ti.includes(e);
}
const Et = at("ipc.model"), VS = "astrbot.live2d.profile.json";
function Vs() {
  return Pe.isPackaged ? Q.join(pi(), "models") : Q.join(process.cwd(), "public", "models");
}
function Dc(e) {
  return e.replace(/\\/g, "/");
}
function pg(e, t) {
  const r = [];
  function n(i) {
    const o = Te.readdirSync(i, { withFileTypes: !0 });
    for (const s of o) {
      const a = Q.join(i, s.name);
      if (s.isDirectory()) {
        n(a);
        continue;
      }
      s.isFile() && t(s.name.toLowerCase()) && r.push(a);
    }
  }
  return n(e), r;
}
function mg(e) {
  return pg(e, (t) => t.endsWith(".model3.json"));
}
function YS(e) {
  return pg(e, (t) => t.endsWith(".model.json") && !t.endsWith(".model3.json"));
}
function Rl(e) {
  const t = String(e || "").trim();
  if (!t)
    throw new Error(J("error.modelPathEmpty"));
  if (t.startsWith("file://"))
    return Cs(t);
  if (t.startsWith("/models/")) {
    const r = t.slice(8).replace(/\//g, Q.sep);
    return Q.join(Vs(), r);
  }
  throw new Error(J("error.unsupportedModelPathFormat", { path: t }));
}
function KS(e) {
  return Q.dirname(e);
}
function gg(e) {
  return Q.join(KS(e), VS);
}
async function yg(e) {
  try {
    const t = await Te.promises.readFile(e, "utf8"), r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch (t) {
    if ((t == null ? void 0 : t.code) === "ENOENT")
      return {};
    throw t;
  }
}
function vg(e) {
  const t = Array.isArray(e) ? e : [e], r = /* @__PURE__ */ new Set(), n = [];
  for (const i of t) {
    if (typeof i != "string")
      continue;
    const o = i.trim();
    if (!o)
      continue;
    const s = o.toLowerCase();
    r.has(s) || (r.add(s), n.push(o));
  }
  return n;
}
function XS(e, t) {
  const r = fg();
  if (!e || typeof e != "object" || Array.isArray(e))
    return r;
  for (const [n, i] of Object.entries(e)) {
    const o = n.trim().toLowerCase();
    hg(o) && (r[o] = vg(i).filter((s) => t.has(s)));
  }
  return r;
}
function JS(e, t) {
  const r = fg();
  if (!e || typeof e != "object" || Array.isArray(e))
    return r;
  for (const [n, i] of Object.entries(e)) {
    const o = n.trim().toLowerCase();
    hg(o) && (r[o] = vg(i).filter((s) => t.has(s)));
  }
  return r;
}
function QS(e) {
  const t = {};
  for (const r of Ti)
    for (const n of e[r])
      t[n] || (t[n] = []), t[n].includes(r) || t[n].push(r);
  return t;
}
function wg(e) {
  if (typeof e != "string" || !e.trim())
    return { success: !1, error: J("error.modelNameEmpty") };
  const t = e.trim(), r = Q.basename(t);
  return r !== t || r === "." || r === ".." ? { success: !1, error: J("error.modelNameIllegal") } : { success: !0, value: r };
}
function ZS(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function eb(e) {
  const t = typeof (e == null ? void 0 : e.code) == "string" ? e.code : "";
  return t === "ENOTEMPTY" || t === "EPERM" || t === "EBUSY" || t === "EACCES";
}
async function tb(e) {
  for (let r = 1; r <= 6; r++)
    try {
      if (await Te.promises.rm(e, {
        recursive: !0,
        force: !0,
        maxRetries: 8,
        retryDelay: 120
      }), !Te.existsSync(e))
        return;
      const n = await Te.promises.readdir(e);
      if (n.length === 0) {
        await Te.promises.rmdir(e).catch(() => {
        });
        return;
      }
      const i = new Error(`目录仍包含未删除条目: ${n.slice(0, 5).join(", ")}`);
      throw i.code = "ENOTEMPTY", i;
    } catch (n) {
      if (!eb(n) || r === 6)
        throw n;
      await ZS(r * 180);
    }
}
function ymLpkSafeName(e, t = "model") {
  const r = String(e || t || "model").replace(/\.(lpk|model3|json|exp3|motion3)$/ig, "").replace(/[<>:"/\\|?* -]/g, "_").trim().replace(/[. ]+$/g, "");
  return r || t || "model";
}
function ymLpkUniquePath(e, t) {
  const r = e.replace(/\\/g, "/"), n = r.lastIndexOf("."), i = n > 0 ? r.slice(0, n) : r, o = n > 0 ? r.slice(n) : "";
  let s = r, a = 1;
  for (; t.has(s.toLowerCase()); )
    s = i + "_" + a++ + o;
  return t.add(s.toLowerCase()), s;
}
function ymLpkEnsureInside(e, t) {
  const r = Q.resolve(e), n = Q.resolve(e, t);
  if (!n.toLowerCase().startsWith(r.toLowerCase() + Q.sep.toLowerCase()))
    throw new Error("LPK 包含不安全路径");
  return n;
}
function ymLpkExtractZip(e, t) {
  const r = Te.readFileSync(e);
  let n = -1;
  for (let a = r.length - 22; a >= Math.max(0, r.length - 66000); a--)
    if (r.readUInt32LE(a) === 101010256) {
      n = a;
      break;
    }
  if (n < 0)
    throw new Error("LPK ZIP 目录损坏");
  const i = r.readUInt16LE(n + 10), o = r.readUInt32LE(n + 16);
  let s = o;
  Te.mkdirSync(t, { recursive: !0 });
  for (let a = 0; a < i; a++) {
    if (r.readUInt32LE(s) !== 33639248)
      throw new Error("LPK ZIP 中央目录损坏");
    const c = r.readUInt16LE(s + 10), u = r.readUInt32LE(s + 20), l = r.readUInt16LE(s + 28), f = r.readUInt16LE(s + 30), d = r.readUInt16LE(s + 32), p = r.readUInt32LE(s + 42), g = r.slice(s + 46, s + 46 + l).toString("utf8").replace(/\\/g, "/");
    s += 46 + l + f + d;
    if (!g || g.endsWith("/"))
      continue;
    const m = Q.normalize(g);
    if (Q.isAbsolute(m) || m.split(/[\\/]+/).includes(".."))
      throw new Error("LPK 包含不安全路径");
    if (r.readUInt32LE(p) !== 67324752)
      throw new Error("LPK ZIP 本地文件头损坏");
    const S = r.readUInt16LE(p + 26), A = r.readUInt16LE(p + 28), y = p + 30 + S + A, v = r.slice(y, y + u);
    let C;
    if (c === 0)
      C = v;
    else if (c === 8)
      C = kc.inflateRawSync(v);
    else
      throw new Error("LPK ZIP 压缩方式不支持: " + c);
    const x = ymLpkEnsureInside(t, m);
    Te.mkdirSync(Q.dirname(x), { recursive: !0 }), Te.writeFileSync(x, C);
  }
}
function ymLpkHash(e) {
  let t = 0;
  for (const r of String(e))
    t = Math.imul(t, 31) + r.codePointAt(0) | 0;
  return t;
}
function ymLpkDecrypt(e, t) {
  const r = Buffer.allocUnsafe(e.length);
  for (let n = 0; n < e.length; n += 1024) {
    let i = t;
    const o = Math.min(n + 1024, e.length);
    for (let s = n; s < o; s++)
      i = Math.floor((2531011 + 214013 * i) / 65536) & 65535, r[s] = i & 255 ^ e[s];
  }
  return r;
}
function ymLpkReadJson(e, t) {
  try {
    return JSON.parse(Buffer.isBuffer(e) ? e.toString("utf8") : Te.readFileSync(e, "utf8"));
  } catch (r) {
    throw new Error("LPK JSON 解析失败 " + (t || "") + ": " + (r instanceof Error ? r.message : String(r)));
  }
}
function ymLpkFindManifest(e) {
  const t = Te.readdirSync(e, { withFileTypes: !0 });
  for (const r of t) {
    if (!r.isFile() || r.name.toLowerCase().endsWith(".bin3"))
      continue;
    const n = Q.join(e, r.name);
    try {
      const i = ymLpkReadJson(n, r.name);
      if (i && i.type === "STD2_0" && i.id)
        return i;
    } catch {
    }
  }
  throw new Error("没有找到 Live2DViewerEX LPK 清单");
}
async function ymLpkPrepareImport(e, t) {
  const r = String(e || "");
  if (!r.toLowerCase().endsWith(".lpk"))
    return null;
  if (!Te.existsSync(r) || !Te.statSync(r).isFile())
    throw new Error("请选择有效的 LPK 文件");
  const n = Te.mkdtempSync(Q.join(Ps.tmpdir(), "l2dpro-lpk-")), i = Q.join(n, "extract"), o = Q.join(n, "model");
  try {
    ymLpkExtractZip(r, i), Te.mkdirSync(o, { recursive: !0 });
    const s = ymLpkFindManifest(i), a = s.list?.[0]?.costume?.[0];
    if (!a?.path)
      throw new Error("LPK 清单没有模型入口");
    const c = String(s.id), u = (d) => {
      const p = Q.join(i, d);
      if (!Te.existsSync(p))
        throw new Error("LPK 缺少资源: " + d);
      return ymLpkDecrypt(Te.readFileSync(p), ymLpkHash(c + d));
    }, l = ymLpkReadJson(u(a.path), a.path), f = l.FileReferences || (l.FileReferences = {}), d = new Set(), p = new Map();
    function g(E, P) {
      if (!E)
        return "";
      if (p.has(E))
        return p.get(E);
      const B = ymLpkUniquePath(P.replace(/\\/g, "/"), d), R = Q.join(o, B);
      return Te.mkdirSync(Q.dirname(R), { recursive: !0 }), Te.writeFileSync(R, u(E)), p.set(E, B), B;
    }
    f.Moc && (f.Moc = g(f.Moc, "Moc.moc3")), Array.isArray(f.Textures) && (f.Textures = f.Textures.map((E, P) => g(E, "Textures/texture_" + String(P).padStart(2, "0") + ".png"))), f.Physics && (f.Physics = g(f.Physics, "Physics.json")), f.PhysicsV2?.File && (f.PhysicsV2.File = f.Physics), f.Pose && (f.Pose = g(f.Pose, "Pose.json")), f.UserData && (f.UserData = g(f.UserData, "UserData.json"));
    if (Array.isArray(f.Expressions))
      f.Expressions = f.Expressions.map((E, P) => (E?.File && (E.File = g(E.File, "Expressions/" + ymLpkSafeName(E.Name || "Expression_" + P, "Expression_" + P) + ".exp3.json")), E));
    if (f.Motions && typeof f.Motions == "object")
      for (const [E, P] of Object.entries(f.Motions))
        Array.isArray(P) && P.forEach((B, R) => {
          B?.File && (B.File = g(B.File, "Motions/" + ymLpkSafeName(E + "_" + (B.Name || R), "motion_" + R) + ".motion3.json"));
        });
    const m = ymLpkSafeName(String(t || Q.basename(r, Q.extname(r))).replace(/\.lpk$/i, ""), ymLpkSafeName(s.name || s.list?.[0]?.character || a.name || "model")), S = m + ".model3.json";
    return Te.writeFileSync(Q.join(o, S), JSON.stringify(l, null, 2), "utf8"), { sourceDir: o, modelName: m, tempDir: n };
  } catch (s) {
    throw await tb(n).catch(() => {
    }), s;
  }
}
function Eg(e, t) {
  const r = Q.basename(e).toLowerCase();
  function n(o) {
    const s = Q.relative(e, o), a = s.split(Q.sep).length - 1, u = Q.basename(o).toLowerCase().replace(/\.model3\.json$/i, "");
    let l = 0;
    return l += 200, l += Math.max(0, 30 - a * 10), u === r ? l += 60 : u.includes(r) && (l += 30), l += Math.max(0, 20 - s.length / 10), l;
  }
  return [...t].sort((o, s) => {
    const a = n(s) - n(o);
    return a !== 0 ? a : Q.relative(e, o).localeCompare(Q.relative(e, s));
  })[0];
}
le.handle("model:selectFolder", async () => {
  const e = Et.timer("select_folder");
  try {
    const t = mr(), r = {
      type: "question",
      title: "导入 Live2D 模型",
      message: "选择导入来源",
      detail: "支持标准 .model3.json 模型文件夹，也支持 Live2DViewerEX .lpk 包。",
      buttons: ["模型文件夹", "LPK 文件", "取消"],
      defaultId: 0,
      cancelId: 2
    }, n = t ? await Ot.showMessageBox(t, r) : await Ot.showMessageBox(r);
    if (n.response === 2)
      return e.done({ canceled: !0 }), { success: !1, canceled: !0 };
    const i = n.response === 1, o = i ? {
      title: "选择 Live2DViewerEX LPK 文件",
      properties: ["openFile"],
      filters: [{ name: "Live2DViewerEX Package", extensions: ["lpk"] }, { name: "All Files", extensions: ["*"] }]
    } : {
      title: "选择 Live2D 模型文件夹",
      properties: ["openDirectory"]
    }, s = t ? await Ot.showOpenDialog(t, o) : await Ot.showOpenDialog(o);
    if (s.canceled || s.filePaths.length === 0)
      return e.done({ canceled: !0 }), { success: !1, canceled: !0 };
    const a = s.filePaths[0];
    return e.done({ canceled: !1, folderPath: a, sourceType: i ? "lpk" : "folder" }), { success: !0, folderPath: a, sourceType: i ? "lpk" : "folder" };
  } catch (t) {
    return console.error("[IPC] 选择模型来源失败:", t), e.fail(t), { success: !1, error: t.message };
  }
});
le.handle("model:import", async (e, t, r) => {
  const n = Et.timer("import", { sourceDir: t, modelName: r });
  let i = "";
  try {
    const o = await ymLpkPrepareImport(t, r);
    o && (t = o.sourceDir, r = o.modelName, i = o.tempDir);
    const s = wg(r);
    if (!s.success)
      return n.done({ success: !1, reason: "invalid_model_name", error: s.error }), { success: !1, error: s.error };
    if (!Te.existsSync(t) || !Te.statSync(t).isDirectory())
      return n.done({ success: !1, reason: "invalid_source_dir" }), { success: !1, error: J("error.selectValidModelFolder") };
    const a = mg(t);
    if (a.length === 0) {
      const y = YS(t);
      return y.length > 0 ? (n.done({
        success: !1,
        reason: "cubism2_model_detected",
        cubism2ModelCount: y.length
      }), { success: !1, error: J("error.cubism2ModelUnsupported") }) : (n.done({ success: !1, reason: "model3_not_found" }), { success: !1, error: J("error.model3NotFound") });
    }
    const c = Eg(t, a);
    Et.debug("import.model_file_selected", {
      sourceDir: t,
      modelFileCount: a.length,
      chosenModelFile: c,
      sourceType: i ? "lpk" : "folder"
    });
    const u = dg(c), l = u.issues.filter((y) => y.severity === "required"), f = u.issues.filter((y) => y.severity === "optional");
    if (l.length > 0)
      return n.done({
        success: !1,
        reason: "required_assets_missing",
        chosenModelFile: c,
        requiredIssues: ai(l),
        optionalIssueCount: f.length
      }), {
        success: !1,
        error: J("error.modelResourceIncomplete") + "：" + ai(l).join(", ")
      };
    const d = Vs(), p = Q.join(d, s.value);
    Te.existsSync(p) || Te.mkdirSync(p, { recursive: !0 });
    const g = Q.resolve(t).toLowerCase(), m = Q.resolve(p).toLowerCase();
    g !== m && (Et.info("import.copy.start", { sourceDir: t, targetDir: p }), await _g(t, p), Et.info("import.copy.success", { sourceDir: t, targetDir: p }));
    const S = Dc(Q.relative(t, c)), A = {
      success: !0,
      modelPath: Pe.isPackaged ? Oc(Q.join(p, S)).toString() : "/models/" + s.value + "/" + S,
      chosenFile: S,
      modelFiles: a.map((y) => Dc(Q.relative(t, y))),
      warnings: [
        ...ai(f),
        ...u.discoveryWarnings
      ],
      manifest: u.manifest,
      sourceType: i ? "lpk" : "folder"
    };
    return n.done({
      success: !0,
      modelName: s.value,
      sourceDir: t,
      targetDir: p,
      chosenFile: S,
      modelFileCount: a.length,
      optionalIssueCount: f.length,
      discoveryWarningCount: u.discoveryWarnings.length,
      sourceType: i ? "lpk" : "folder"
    }), A;
  } catch (o) {
    return console.error("[IPC] 导入模型失败:", o), n.fail(o), { success: !1, error: o.message };
  } finally {
    i && await tb(i).catch((o) => console.warn("[IPC] 清理 LPK 临时目录失败:", o));
  }
});

le.handle("model:getList", async () => {
  const e = Et.timer("get_list");
  try {
    const t = Vs();
    if (!Te.existsSync(t))
      return e.done({ modelsDir: t, count: 0, exists: !1 }), { success: !0, models: [] };
    const r = [], n = Te.readdirSync(t, { withFileTypes: !0 });
    for (const i of n)
      if (i.isDirectory()) {
        const o = Q.join(t, i.name), s = mg(o), a = s.length > 0 ? Eg(o, s) : null;
        if (a) {
          const c = Dc(Q.relative(o, a));
          r.push({
            name: i.name,
            path: Pe.isPackaged ? Oc(a).toString() : `/models/${i.name}/${c}`
          });
        }
      }
    return e.done({ modelsDir: t, count: r.length }), { success: !0, models: r };
  } catch (t) {
    return console.error("[IPC] 获取模型列表失败:", t), e.fail(t), { success: !1, error: t.message };
  }
});
le.handle("model:delete", async (e, t) => {
  const r = Et.timer("delete", { modelName: t });
  try {
    const n = wg(t);
    if (!n.success)
      return r.done({ success: !1, reason: "invalid_model_name", error: n.error }), { success: !1, error: n.error };
    const i = Q.join(Vs(), n.value);
    return Te.existsSync(i) && (Et.info("delete.directory.start", { modelDir: i }), await tb(i), Et.info("delete.directory.success", { modelDir: i })), r.done({ success: !0, modelName: n.value, modelDir: i }), { success: !0 };
  } catch (n) {
    return console.error("[IPC] 删除模型失败:", n), r.fail(n), { success: !1, error: `${typeof (n == null ? void 0 : n.code) == "string" ? `[${n.code}] ` : ""}${(n == null ? void 0 : n.message) || String(n)}` };
  }
});
le.handle("model:prepareLoad", async (e, t) => {
  const r = Et.timer("prepare_load", { modelPath: t });
  try {
    const n = Rl(t), i = dg(n);
    if (i.fatalError)
      throw new Error(i.fatalError);
    const o = i.issues.filter((a) => a.severity === "required");
    if (o.length > 0)
      throw new Error(`${J("error.modelResourceIncomplete")}：${ai(o).join(", ")}`);
    const s = Cl(t, n);
    return s.warnings = [
      ...ai(i.issues.filter((a) => a.severity === "optional")),
      ...s.warnings
    ], s.manifest = i.manifest, r.done({
      modelPath: t,
      discoveryMode: s.compatibilityManifest.discovery.mode,
      sourceCount: s.compatibilityManifest.discovery.sources.length,
      warningCount: s.warnings.length
    }), {
      success: !0,
      descriptor: s
    };
  } catch (n) {
    return r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("model:getExpressionTypes", async (e, t) => {
  const r = Et.timer("get_expression_types", { modelPath: t });
  try {
    const n = Rl(t), o = Cl(t, n).compatibilityManifest.expressions.map((l) => ({
      id: l.id,
      file: l.file,
      aliases: l.aliases,
      source: l.source
    })), s = new Set(o.map((l) => l.id)), a = gg(n), c = await yg(a), u = XS(c.semanticPresets, s);
    return r.done({
      modelPath: t,
      expressionCount: o.length,
      assignedTypeCount: Ti.filter((l) => u[l].length > 0).length,
      profilePath: a
    }), {
      success: !0,
      modelPath: t,
      profilePath: a,
      expressions: o,
      presets: u
    };
  } catch (n) {
    return console.error("[IPC] 读取模型表情类型失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
le.handle("model:saveExpressionTypes", async (e, t, r) => {
  const n = Et.timer("save_expression_types", { modelPath: t });
  try {
    const i = Rl(t), o = Cl(t, i), s = new Set(
      o.compatibilityManifest.expressions.map((f) => f.id)
    ), a = JS(r, s), c = gg(i), u = await yg(c), l = {
      ...u,
      version: typeof u.version == "number" ? Math.max(u.version, 2) : 2,
      semanticPresets: a,
      tags: {
        ...u.tags && typeof u.tags == "object" && !Array.isArray(u.tags) ? u.tags : {},
        ...QS(a)
      }
    };
    return await Te.promises.writeFile(
      c,
      `${JSON.stringify(l, null, 2)}
`,
      "utf8"
    ), n.done({
      modelPath: t,
      profilePath: c,
      assignedTypeCount: Ti.filter((f) => a[f].length > 0).length
    });
    const YM_w = mr();
    YM_w && YM_w.webContents.send("model:load", t);
    return {
      success: !0,
      profilePath: c,
      reloaded: !!YM_w
    };
  } catch (i) {
    return console.error("[IPC] 保存模型表情类型失败:", i), n.fail(i), { success: !1, error: i.message };
  }
});
le.handle("model:exportProfile", async (e, t) => {
  const r = Et.timer("export_profile", { modelPath: t });
  try {
    const n = Rl(t), i = gg(n), o = await yg(i), s = {
      version: typeof o.version == "number" ? Math.max(o.version, 2) : 2,
      ...o,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      modelFile: Q.basename(n)
    }, a = mr(), c = await Ot.showSaveDialog(a || void 0, {
      title: "导出模型配置",
      defaultPath: Q.join(Pe.getPath("documents"), `${Q.basename(Q.dirname(n))}.astrbot.live2d.profile.json`),
      filters: [{ name: "AstrBot Live2D Profile", extensions: ["json"] }]
    });
    if (c.canceled || !c.filePath)
      return r.done({ canceled: !0 }), { success: !1, canceled: !0 };
    return await Te.promises.writeFile(c.filePath, `${JSON.stringify(s, null, 2)}\n`, "utf8"), r.done({ path: c.filePath }), { success: !0, path: c.filePath };
  } catch (n) {
    return console.error("[IPC] 导出模型配置失败:", n), r.fail(n), { success: !1, error: n.message || String(n) };
  }
});
le.handle("model:importProfile", async (e, t) => {
  const r = Et.timer("import_profile", { modelPath: t });
  try {
    const n = Rl(t), i = gg(n), o = mr(), s = await Ot.showOpenDialog(o || void 0, {
      title: "导入模型配置",
      properties: ["openFile"],
      filters: [{ name: "AstrBot Live2D Profile", extensions: ["json"] }]
    });
    if (s.canceled || s.filePaths.length === 0)
      return r.done({ canceled: !0 }), { success: !1, canceled: !0 };
    const a = s.filePaths[0], c = JSON.parse(await Te.promises.readFile(a, "utf8"));
    if (!c || typeof c != "object" || Array.isArray(c))
      throw new Error("配置文件格式无效");
    const u = { ...c, version: typeof c.version == "number" ? Math.max(c.version, 2) : 2 };
    delete u.exportedAt;
    delete u.modelFile;
    await Te.promises.writeFile(i, `${JSON.stringify(u, null, 2)}\n`, "utf8");
    const l = mr();
    l && l.webContents.send("model:load", t);
    return r.done({ source: a, profilePath: i, reloaded: !!l }), { success: !0, source: a, profilePath: i, reloaded: !!l };
  } catch (n) {
    return console.error("[IPC] 导入模型配置失败:", n), r.fail(n), { success: !1, error: n.message || String(n) };
  }
});
le.handle("model:load", async (e, t) => {
  const r = Et.timer("load", { modelPath: t });
  try {
    let n = mr();
    return n || (console.warn("[IPC] 主窗口未就绪，尝试重新创建..."), n = xs(), await new Promise((i, o) => {
      const s = setTimeout(() => o(new Error("主窗口重新创建超时")), 1e4);
      n.webContents.on("did-finish-load", () => {
        clearTimeout(s), i();
      }), n.webContents.on("did-fail-load", (a, c, u) => {
        clearTimeout(s), o(new Error(`主窗口页面加载失败: ${u} (${c})`));
      });
    })), n.webContents.send("model:load", t), r.done({ dispatched: !0, windowId: n.id }), { success: !0 };
  } catch (n) {
    return console.error("[IPC] 加载模型失败:", n), r.fail(n), { success: !1, error: n.message };
  }
});
async function _g(e, t) {
  const r = await Te.promises.readdir(e, { withFileTypes: !0 });
  for (const n of r) {
    const i = Q.join(e, n.name), o = Q.join(t, n.name);
    n.isDirectory() ? (await Te.promises.mkdir(o, { recursive: !0 }), await _g(i, o)) : await Te.promises.copyFile(i, o);
  }
}
const Al = at("ipc.user");
le.handle("user:setUserName", async (e, t) => {
  const r = Al.timer("set_user_name", { nameLength: t.length });
  try {
    return Pv(t), Pp(), xs(), Xp(), r.done({ success: !0 }), { success: !0 };
  } catch (n) {
    return console.error("[用户] 设置用户名失败:", n), r.fail(n), {
      success: !1,
      error: n instanceof Error ? n.message : "设置用户名时发生未知错误"
    };
  }
});
le.handle("user:getUserName", async () => {
  const e = qc();
  return Al.debug("get_user_name", { exists: !!e }), e;
});
le.handle("user:getUserId", async () => {
  const e = pp();
  return Al.debug("get_user_id", { userId: e }), e;
});
le.handle("user:renameUser", async (e, t) => {
  const r = Al.timer("rename_user", { nameLength: String(t || "").length });
  try {
    const n = String(t || "").trim();
    if (!n) return { success: !1, error: "昵称不能为空" };
    Pv(n);
    return r.done({ success: !0 }), { success: !0 };
  } catch (n) {
    return r.fail(n), { success: !1, error: n instanceof Error ? n.message : String(n) };
  }
});
le.handle("user:getWelcomeOnStartup", async () => YM_getWelcomeOnStartup());
le.handle("user:setWelcomeOnStartup", async (e, t) => ({ success: !0, enabled: YM_setWelcomeOnStartup(!!t) }));
const Sg = "active_log_level";
function rb() {
  try {
    const e = vt(Sg);
    (e === "debug" || e === "info") && Cp(e);
  } catch {
  }
}
function nb(e) {
  if (typeof e != "string")
    return "renderer";
  const t = e.trim();
  return t ? t.slice(0, 120) : "renderer";
}
function ib(e) {
  return Array.isArray(e) ? e.slice(0, 20) : e === void 0 ? [] : [e];
}
function sb(e) {
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? Math.max(1, Math.min(Wc(), Math.round(t))) : 3;
}
function ob() {
  const e = /* @__PURE__ */ new Date(), t = [
    e.getFullYear(),
    String(e.getMonth() + 1).padStart(2, "0"),
    String(e.getDate()).padStart(2, "0"),
    String(e.getHours()).padStart(2, "0"),
    String(e.getMinutes()).padStart(2, "0"),
    String(e.getSeconds()).padStart(2, "0")
  ];
  return `${t[0]}${t[1]}${t[2]}-${t[3]}${t[4]}${t[5]}`;
}
function ab(e) {
  return /^astrbot-live2d-\d{4}-\d{2}-\d{2}(?:\.\d+)?\.log$/.test(e);
}
async function cb(e) {
  const t = Fr(), r = await nt.promises.readdir(t, { withFileTypes: !0 }), n = Date.now() - e * 24 * 60 * 60 * 1e3, i = [];
  for (const o of r) {
    if (!o.isFile() || !ab(o.name))
      continue;
    const s = ke.join(t, o.name), a = await nt.promises.stat(s);
    a.mtimeMs >= n && i.push({ path: s, mtimeMs: a.mtimeMs });
  }
  return i.sort((o, s) => s.mtimeMs - o.mtimeMs).map((o) => o.path);
}
le.on("log:renderer", (e, t) => {
  const r = Kv(t == null ? void 0 : t.level), n = nb(t == null ? void 0 : t.source), i = ib(t == null ? void 0 : t.args);
  mi(r, n, "console", {
    args: i,
    context: (t == null ? void 0 : t.context) || {}
  });
});
le.handle("log:getDirectory", async () => Fr());
le.handle("log:openDirectory", async () => {
  const e = Fr(), t = await Nc.openPath(e);
  return t ? (jc("log", "open_directory.failed", { path: e, error: t }), {
    success: !1,
    path: e,
    error: t
  }) : (Hc("log", "open_directory.success", { path: e }), {
    success: !0,
    path: e
  });
});
le.handle("log:setLevel", async (e, t) => {
  const r = Cp(t);
  try {
    wt(Sg, r);
  } catch {
  }
  return {
    success: !0,
    level: r
  };
});
le.handle("log:getConfig", async () => ({
  level: Tp(),
  retentionDays: Wc(),
  maxFileBytes: bp()
}));
le.handle("log:exportBundle", async (e, t) => {
  const r = sb(t), n = ke.join(Pe.getPath("temp"), `astrbot-live2d-logs-${ob()}`);
  try {
    const i = await cb(r);
    await nt.promises.mkdir(n, { recursive: !0 });
    for (const o of i)
      await nt.promises.copyFile(o, ke.join(n, ke.basename(o)));
    return await nt.promises.writeFile(
      ke.join(n, "manifest.json"),
      JSON.stringify({
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        days: r,
        count: i.length,
        level: Tp(),
        retentionDays: Wc(),
        maxFileBytes: bp()
      }, null, 2),
      "utf8"
    ), Hc("log", "export_bundle.success", {
      days: r,
      count: i.length,
      path: n
    }), {
      success: !0,
      path: n,
      count: i.length
    };
  } catch (i) {
    return jc("log", "export_bundle.failed", {
      days: r,
      path: n,
      error: (i == null ? void 0 : i.message) || String(i)
    }), {
      success: !1,
      path: n,
      count: 0,
      error: (i == null ? void 0 : i.message) || String(i)
    };
  }
});
le.handle("update:getState", async () => ri());
le.handle("update:check", async () => tg(!0));
le.handle("update:quitAndInstall", async () => rg());
le.handle("update:getSettings", async () => uS());
le.handle("update:updateSettings", async (e, t) => dS(t));
const Ys = at("ipc.connectionSettings");
function _s(e) {
  const t = Qe.fromWebContents(e.sender);
  if (!(!t || t.isDestroyed()))
    return t.id;
}
function bg(e, t) {
  const r = {
    settings: e,
    revision: e.revision,
    sourceWindowId: t
  };
  for (const n of Qe.getAllWindows())
    n.isDestroyed() || n.webContents.send("connectionSettings:changed", r);
  Ys.info("broadcast.changed", {
    sourceWindowId: t,
    windowCount: Qe.getAllWindows().length,
    revision: e.revision,
    serverUrl: e.serverUrl,
    hasToken: !!e.token.trim()
  });
}
le.handle("connectionSettings:load", async () => {
  const e = Op();
  return Ys.debug("load", {
    success: e.success,
    revision: e.success ? e.data.revision : void 0,
    code: e.success ? void 0 : e.code
  }), e;
});
le.handle("connectionSettings:save", async (e, t) => {
  var i;
  const r = Ys.timer("save", { sourceWindowId: _s(e), payload: t }), n = bw(t);
  return n.success && (await ((i = Pt()) == null ? void 0 : i.handleConnectionSettingsUpdated(n.data)), bg(n.data, _s(e))), r.done({
    success: n.success,
    revision: n.success ? n.data.revision : void 0,
    code: n.success ? void 0 : n.code
  }), n;
});
le.handle("connectionSettings:migrateLegacy", async (e, t) => {
  var i;
  const r = Ys.timer("migrate_legacy", {
    sourceWindowId: _s(e),
    rawLength: t.length
  }), n = Tw(t);
  return n.success && (await ((i = Pt()) == null ? void 0 : i.handleConnectionSettingsUpdated(n.data)), bg(n.data, _s(e))), r.done({
    success: n.success,
    revision: n.success ? n.data.revision : void 0,
    code: n.success ? void 0 : n.code
  }), n;
});
const Ks = at("ipc.connectionBehaviorSettings");
function Ss(e) {
  const t = Qe.fromWebContents(e.sender);
  if (!(!t || t.isDestroyed()))
    return t.id;
}
function Tg(e, t) {
  const r = {
    settings: e,
    sourceWindowId: t
  };
  for (const n of Qe.getAllWindows())
    n.isDestroyed() || n.webContents.send("connectionBehaviorSettings:changed", r);
  Ks.info("broadcast.changed", {
    sourceWindowId: t,
    windowCount: Qe.getAllWindows().length,
    autoConnectOnAppLaunch: e.autoConnectOnAppLaunch,
    retryEnabled: e.retryEnabled,
    resumeDesiredConnectionOnWake: e.resumeDesiredConnectionOnWake
  });
}
le.handle("connectionBehaviorSettings:load", async () => {
  const e = Fw();
  return Ks.debug("load", {
    success: e.success,
    code: e.success ? void 0 : e.code
  }), e;
});
le.handle("connectionBehaviorSettings:save", async (e, t) => {
  var i;
  const r = Ks.timer("save", { sourceWindowId: Ss(e), payload: t }), n = kw(t);
  return n.success && (await ((i = Pt()) == null ? void 0 : i.handleBehaviorSettingsUpdated(n.data)), Tg(n.data, Ss(e))), r.done({
    success: n.success,
    code: n.success ? void 0 : n.code
  }), n;
});
le.handle("connectionBehaviorSettings:migrateLegacy", async (e, t) => {
  var i;
  const r = Ks.timer("migrate_legacy", {
    sourceWindowId: Ss(e),
    rawLength: t.length
  }), n = Uw(t);
  return n.success && (await ((i = Pt()) == null ? void 0 : i.handleBehaviorSettingsUpdated(n.data, {
    resolveStartupDecision: !0
  })), Tg(n.data, Ss(e))), r.done({
    success: n.success,
    code: n.success ? void 0 : n.code
  }), n;
});
const _c = at("ipc.live2d"), lb = 8e3;
function Xs(e, t) {
  return new Promise((r, n) => {
    const i = mr();
    if (!i || i.isDestroyed()) {
      n(new Error("Overlay window not available"));
      return;
    }
    const o = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, s = setTimeout(() => {
      le.removeAllListeners(`live2d:result:${o}`), _c.warn("relay_timeout", { channel: e, requestId: o }), n(new Error("Command timed out"));
    }, lb);
    le.once(`live2d:result:${o}`, (a, c) => {
      clearTimeout(s), c != null && c.error ? (_c.warn("relay_error", { channel: e, error: c.error }), n(new Error(c.error))) : r((c == null ? void 0 : c.data) ?? null);
    }), _c.debug("relay_command", { channel: e, requestId: o }), i.webContents.send("live2d:command", { requestId: o, channel: e, args: t });
  });
}
le.handle("live2d:invokeTest", async (e, t, r, n, i) => Xs("live2d:invokeTest", [t, r, n, i]));
le.handle("live2d:getModelInfo", async () => Xs("live2d:getModelInfo", []));
le.handle("live2d:getErrors", async () => Xs("live2d:getErrors", []));
le.handle("live2d:clearErrors", async () => Xs("live2d:clearErrors", []));
const Pl = at("ipc.bridgeLifecycle");
le.handle("bridgeLifecycle:getSnapshot", async () => {
  const e = Pt(), t = e ? e.getSnapshot() : Ns();
  return Pl.debug("get_snapshot", { hasController: !!e, snapshot: t }), t;
});
le.handle("bridgeLifecycle:connect", async () => {
  const e = Pl.timer("connect"), t = Pt();
  if (!t)
    return e.done({ success: !1, code: "CLIENT_UNAVAILABLE" }), {
      success: !1,
      code: "CLIENT_UNAVAILABLE",
      message: "连接控制器未初始化",
      snapshot: Ns()
    };
  const r = await t.connect();
  return e.done({ success: r.success, code: r.success ? void 0 : r.code, snapshot: r.snapshot }), r;
});
le.handle("bridgeLifecycle:disconnect", async () => {
  const e = Pl.timer("disconnect"), t = Pt();
  if (!t)
    return e.done({ success: !1, code: "CLIENT_UNAVAILABLE" }), {
      success: !1,
      code: "CLIENT_UNAVAILABLE",
      message: "连接控制器未初始化",
      snapshot: Ns()
    };
  const r = await t.disconnect();
  return e.done({ success: r.success, code: r.success ? void 0 : r.code, snapshot: r.snapshot }), r;
});
le.handle("locale:set", async (e, t) => ((t === "zh-CN" || t === "en") && lv(t), { success: !0 }));
Pe.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
Pe.commandLine.appendSwitch("disable-gpu-program-cache");
Pe.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
process.platform === "win32" && Pe.setAppUserModelId(Ny.appId);
const on = sv();
let At = null;
Qv();
Zv();
const Ge = at("main.lifecycle");
console.log(
  `[主进程] 数据目录模式=${on.mode} 原始路径=${on.originalUserDataPath} 当前路径=${on.resolvedUserDataPath}`
);
Ge.info("data_path.configured", {
  mode: on.mode,
  originalUserDataPath: on.originalUserDataPath,
  resolvedUserDataPath: on.resolvedUserDataPath
});
let bs = !1;
function tp(e) {
  bs || (bs = !0, console.log(`[主进程] 暂停后台活动: ${e}`), Ge.info("background.pause", { reason: e }), gi().setBackgroundPaused(!0), At && At.handleSystemSuspend(e === "lock-screen" ? "lock-screen" : "suspend"));
}
function rp(e) {
  bs && (bs = !1, console.log(`[主进程] 恢复后台活动: ${e}`), Ge.info("background.resume", { reason: e }), gi().setBackgroundPaused(!1), At && At.handleSystemResume().catch((t) => {
    console.error("[主进程] 恢复后重连失败:", t), Ge.error("background.resume_reconnect.failed", t, { reason: e });
  }));
}
function Sc(e, t) {
  Ge.debug("broadcast", {
    channel: e,
    windowCount: Qe.getAllWindows().length,
    payload: t
  }), Qe.getAllWindows().forEach((r) => {
    r.isDestroyed() || r.webContents.send(e, t);
  });
}
function ub() {
  Ge.info("bridge_controller.init"), At = new PE(), At.on("stateChanged", (e) => {
    Sc("bridgeLifecycle:stateChanged", e);
    const t = (() => {
      switch (e.status) {
        case "connected":
          return J("tray.status.connected");
        case "connecting":
          return J("tray.status.connecting");
        case "handshaking":
          return J("tray.status.handshaking");
        case "waiting_retry": {
          if (e.nextRetryAt) {
            const r = Math.max(1, Math.ceil((e.nextRetryAt - Date.now()) / 1e3));
            return J("tray.status.retrying", { seconds: r, attempt: e.reconnectAttempt });
          }
          return J("tray.status.waiting");
        }
        case "suspended":
          return J("tray.status.suspended");
        case "error":
          return J("tray.status.error");
        default:
          return J("tray.status.offline");
      }
    })();
    kE(t);
  }), At.on("perform:show", (e) => {
    Sc("perform:show", e);
  }), At.on("perform:interrupt", () => {
    console.log("[主进程] 收到中断指令"), Sc("perform:interrupt");
  });
}
async function db() {
  const e = Ge.timer("initialize");
  Ge.info("initialize.start");
  const t = await T_();
  if (Ge.info("app_data_migration.completed", {
    copiedCount: t.copiedEntries.length,
    errorCount: t.errors.length
  }), t.copiedEntries.length > 0 && console.log(
    `[主进程] 已复制 ${t.copiedEntries.length} 个旧数据条目到当前数据目录`
  ), t.errors.length > 0) {
    const i = t.errors.slice(0, 5), o = t.errors.length - i.length, s = o > 0 ? ` | 另外 ${o} 个问题未展开` : "";
    console.warn(
      `[主进程] 数据迁移存在 ${t.errors.length} 个问题: ${i.join(" | ")}${s}`
    );
  }
  try {
    gv(), rb(), Ge.info("database.init.success");
  } catch (i) {
    console.error("[主进程] 数据库初始化失败:", i), Ge.error("database.init.failed", i), e.fail(i), Ot.showErrorBox(
      J("mainProcess.databaseInitFailed"),
      J("mainProcess.databaseInitFailedDetail", { error: i instanceof Error ? i.message : String(i) })
    ), Pe.quit();
    return;
  }
  lS(), Ge.info("auto_updater.initialized"), ub();
  const r = At;
  if (!r)
    throw e.fail(new Error("连接控制器初始化失败")), new Error("连接控制器初始化失败");
  await r.initialize(), tm() || (console.log("[主进程] Live2D SDK 不存在，提示用户下载"), Ge.warn("cubism_core.missing"), await im() ? (Ge.info("cubism_core.download.confirmed"), await sm() ? Ge.info("cubism_core.download.success") : (console.warn("[主进程] SDK 下载失败或用户取消，继续启动（模型功能不可用）"), Ge.warn("cubism_core.download.failed_or_cancelled"))) : (console.log("[主进程] 用户跳过 SDK 下载，继续启动（模型功能不可用）"), Ge.warn("cubism_core.download.skipped")));
  const n = qc();
  const i = YM_getWelcomeOnStartup();
  i || !n ? (Ge.info(i ? "startup.welcome_forced" : "startup.first_launch", { hasUserName: !!n }), uw()) : (Ge.info("startup.normal", { hasUserName: !0 }), xs(), Xp()), e.done({ firstLaunch: !n, welcomeForced: i });
}
Pe.whenReady().then(() => {
  if (Ge.info("app.ready"), process.platform === "darwin" && !Pe.isPackaged && Pe.dock) {
    const e = Q.join(process.cwd(), "resources", "icon.png"), t = ss.createFromPath(e);
    t.isEmpty() || Pe.dock.setIcon(t);
  }
  em(), w_(), db().catch((e) => {
    console.error("[主进程] 初始化失败:", e), Ge.error("initialize.failed", e), Ot.showErrorBox(
      J("mainProcess.initFailed"),
      J("mainProcess.initFailedDetail", { error: e instanceof Error ? e.message : String(e) })
    ), Pe.quit();
  }), Pe.on("activate", () => {
    mr() || xs();
  }), xi.on("lock-screen", () => {
    tp("lock-screen");
  }), xi.on("unlock-screen", () => {
    rp("unlock-screen");
  }), xi.on("suspend", () => {
    tp("suspend");
  }), xi.on("resume", () => {
    rp("resume");
  });
});
Pe.on("window-all-closed", () => {
  Ge.info("window_all_closed", { platform: process.platform }), process.platform !== "darwin" && Pe.quit();
});
Pe.on("before-quit", () => {
  Ge.info("before_quit.start");
  try {
    At && At.dispose();
  } catch (e) {
    console.error("[主进程] 关闭连接控制器失败:", e), Ge.error("bridge_controller.dispose.failed", e);
  }
  $E(), UE(), ES();
  try {
    yv();
  } catch (e) {
    console.error("[主进程] 关闭数据库失败:", e), Ge.error("database.close.failed", e);
  }
  Ge.info("before_quit.done"), ew();
});
function Pt() {
  return At;
}
export {
  Pt as a,
  At as b,
  Nt as c,
  ub as d,
  Up as g,
  cT as i,
  Mm as r
};
