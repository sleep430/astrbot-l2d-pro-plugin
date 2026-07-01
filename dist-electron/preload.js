const { contextBridge: p, ipcRenderer: n } = require("electron"), l = 512, h = 4, w = 6;
function r(e, t) {
  const o = (i, ...s) => t(...s);
  return n.on(e, o), () => {
    n.removeListener(e, o);
  };
}
function v(e) {
  const t = e && typeof e == "object" ? e.code : void 0;
  return !!e && typeof e == "object" && (typeof e.name == "string" || typeof e.message == "string" || typeof e.stack == "string" || typeof t == "string" || typeof t == "number");
}
function u(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  if (e != null)
    return String(e);
}
function a(e) {
  if (e.startsWith("data:")) {
    const t = e.indexOf(","), o = t >= 0 ? e.slice(0, t + 1) : e;
    return `${o}<省略 ${Math.max(0, e.length - o.length)} 字符>`;
  }
  return e.length <= l ? e : `${e.slice(0, l)}...(总长 ${e.length} 字符)`;
}
function c(e, t, o) {
  if (typeof e == "string")
    return a(e);
  if (typeof e != "object" || e === null)
    return e;
  if (v(e))
    return {
      name: typeof e.name == "string" ? e.name : "UnknownError",
      message: typeof e.message == "string" ? a(e.message) : String(e),
      stack: typeof e.stack == "string" ? a(e.stack) : void 0,
      code: u(e.code)
    };
  if (t.has(e))
    return "[Circular]";
  if (o >= h)
    return Array.isArray(e) ? `[Array:${e.length}]` : "[Object]";
  if (t.add(e), Array.isArray(e)) {
    const s = e.slice(0, w).map((d) => c(d, t, o + 1));
    return t.delete(e), {
      __type: "array",
      length: e.length,
      preview: s
    };
  }
  const i = {};
  for (const [s, d] of Object.entries(e))
    i[s] = c(d, t, o + 1);
  return t.delete(e), i;
}
function m(e) {
  if (typeof e == "string")
    return a(e);
  if (e instanceof Error)
    return a(e.stack || `${e.name}: ${e.message}`);
  if (v(e)) {
    const t = typeof e.stack == "string" ? a(e.stack) : "";
    if (t)
      return t;
    const o = typeof e.name == "string" ? e.name : "UnknownError", i = typeof e.message == "string" ? a(e.message) : String(e);
    return `${o}: ${i}`;
  }
  try {
    return JSON.stringify(c(e, /* @__PURE__ */ new WeakSet(), 0));
  } catch {
    return String(e);
  }
}
function f() {
  var i, s, d;
  const e = (s = (i = document.body) == null ? void 0 : i.dataset) == null ? void 0 : s.windowKind;
  if (e)
    return e;
  const t = (d = window.location.pathname.split("/").filter(Boolean).pop()) == null ? void 0 : d.replace(/\.html$/i, "");
  return t || window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean)[0] || "unknown";
}
function g(e, t) {
  var o;
  try {
    const i = (o = window.location.pathname.split("/").filter(Boolean).pop()) == null ? void 0 : o.replace(/\.html$/i, ""), s = f(), d = i ? `renderer:${s || i}` : window.location.hash ? `renderer${window.location.hash}` : "renderer";
    n.send("log:renderer", {
      level: e,
      source: d,
      args: t.map((k) => m(k)),
      context: {
        windowKind: s,
        path: window.location.pathname,
        hash: window.location.hash
      }
    });
  } catch {
  }
}
p.exposeInMainWorld("electron", {
  // 连接管理
  bridge: {
    getSession: () => n.invoke("bridge:getSession"),
    sendMessage: (e) => n.invoke("bridge:sendMessage", e),
    sendTouch: (e, t, o) => n.invoke("bridge:sendTouch", e, t, o),
    sendState: (e, t) => n.invoke("bridge:sendState", e, t),
    onPerformShow: (e) => r("perform:show", e),
    onPerformInterrupt: (e) => r("perform:interrupt", e)
  },
  bridgeLifecycle: {
    getSnapshot: () => n.invoke("bridgeLifecycle:getSnapshot"),
    connect: () => n.invoke("bridgeLifecycle:connect"),
    disconnect: () => n.invoke("bridgeLifecycle:disconnect"),
    onStateChanged: (e) => r("bridgeLifecycle:stateChanged", e)
  },
  // 窗口管理
  window: {
    openSettings: (e) => n.invoke("window:openSettings", e),
    closeSettings: () => n.invoke("window:closeSettings"),
    minimizeCurrent: () => n.invoke("window:minimizeCurrent"),
    toggleMaximizeCurrent: () => n.invoke("window:toggleMaximizeCurrent"),
    isMaximizedCurrent: () => n.invoke("window:isMaximizedCurrent"),
    closeCurrent: () => n.invoke("window:closeCurrent"),
    notifyRendererReady: (e) => n.invoke("window:notifyRendererReady", e),
    closeWelcome: () => n.invoke("window:closeWelcome"),
    getScreenshotSettings: () => n.invoke("window:getScreenshotSettings"),
    updateScreenshotSettings: (e) => n.invoke("window:updateScreenshotSettings", e),
    onMaximizedChanged: (e) => r("window:maximizedChanged", e),
    openExternal: (e) => n.invoke("window:openExternal", e),
    openResource: (e, t) => n.invoke("window:openResource", e, t),
    saveResource: (e, t) => n.invoke("window:saveResource", e, t),
    getAppVersion: () => n.invoke("window:getAppVersion"),
    getPlatformCapabilities: () => n.invoke("window:getPlatformCapabilities"),
    getCursorPosition: () => n.invoke("window:getCursorPosition"),
    // 窗口事件监听
    startWatching: () => n.invoke("window:startWatching"),
    getActiveWindow: () => n.invoke("window:getActiveWindow"),
    getWindowHistory: () => n.invoke("window:getWindowHistory"),
    getAllWindows: () => n.invoke("window:getAllWindows"),
    buildAIContext: () => n.invoke("window:buildAIContext"),
    getWatcherConfig: () => n.invoke("window:getWatcherConfig"),
    updateWatcherConfig: (e) => n.invoke("window:updateWatcherConfig", e),
    resetWatcherConfig: () => n.invoke("window:resetWatcherConfig"),
    downloadCubismCore: () => n.invoke("window:downloadCubismCore"),
    toggleSettingsPin: () => n.invoke("window:toggleSettingsPin"),
    onWindowEvent: (e) => {
      const t = (o, i) => e(i);
      return n.on("window:event", t), () => n.removeListener("window:event", t);
    }
  },
  desktopBehavior: {
    getPreferences: () => n.invoke("desktopBehavior:getPreferences"),
    updatePreferences: (e) => n.invoke("desktopBehavior:updatePreferences", e),
    getSnapshot: () => n.invoke("desktopBehavior:getSnapshot"),
    setMousePassthrough: (e) => n.invoke("desktopBehavior:setMousePassthrough", e),
    setModelReady: (e) => n.invoke("desktopBehavior:setModelReady", e),
    requestReveal: (e) => n.invoke("desktopBehavior:requestReveal", e),
    onSnapshotChanged: (e) => r("desktopBehavior:snapshotChanged", e)
  },
  // 设置窗口专用
  settings: {
    getPendingPage: () => n.invoke("settings:getPendingPage"),
    onNavigateTo: (e) => r("settings:navigateTo", e)
  },
  // Live2D 管线测试（设置窗口 → 叠加层）
  live2d: {
    invokeTest: (e, t, o, i) => n.invoke("live2d:invokeTest", e, t, o, i),
    getModelInfo: () => n.invoke("live2d:getModelInfo"),
    getErrors: () => n.invoke("live2d:getErrors"),
    clearErrors: () => n.invoke("live2d:clearErrors")
  },
  // Live2D 命令接收（叠加层窗口专用）
  live2dCommands: {
    onCommand: (e) => r("live2d:command", e),
    sendResult: (e, t) => n.send(`live2d:result:${e}`, { data: t }),
    sendError: (e, t) => n.send(`live2d:result:${e}`, { error: t })
  },
  // 用户配置
  user: {
    setUserName: (e) => n.invoke("user:setUserName", e),
    getUserName: () => n.invoke("user:getUserName"),
    getUserId: () => n.invoke("user:getUserId"),
    renameUser: (e) => n.invoke("user:renameUser", e),
    getWelcomeOnStartup: () => n.invoke("user:getWelcomeOnStartup"),
    setWelcomeOnStartup: (e) => n.invoke("user:setWelcomeOnStartup", e)
  },
  // 连接配置（主进程持久化）
  connectionSettings: {
    load: () => n.invoke("connectionSettings:load"),
    save: (e) => n.invoke("connectionSettings:save", e),
    migrateLegacy: (e) => n.invoke("connectionSettings:migrateLegacy", e),
    onChanged: (e) => r("connectionSettings:changed", e)
  },
  connectionBehaviorSettings: {
    load: () => n.invoke("connectionBehaviorSettings:load"),
    save: (e) => n.invoke("connectionBehaviorSettings:save", e),
    migrateLegacy: (e) => n.invoke("connectionBehaviorSettings:migrateLegacy", e),
    onChanged: (e) => r("connectionBehaviorSettings:changed", e)
  },
  // 历史记录
  history: {
    getMessages: (e) => n.invoke("history:getMessages", e),
    saveMessage: (e) => n.invoke("history:saveMessage", e),
    savePerformance: (e) => n.invoke("history:savePerformance", e),
    updateStatistics: (e) => n.invoke("history:updateStatistics", e),
    getStatistics: (e, t) => n.invoke("history:getStatistics", e, t),
    getAverageResponseTime: (e, t) => n.invoke("history:getAverageResponseTime", e, t),
    clearHistory: () => n.invoke("history:clearHistory")
  },
  data: {
    getStorageStats: () => n.invoke("storage:getOverview"),
    exportSettings: () => n.invoke("config:export"),
    importSettings: () => n.invoke("config:import"),
    applyImport: (e) => n.invoke("config:applyImport", e)
  },
  storage: {
    getOverview: () => n.invoke("storage:getOverview")
  },
  config: {
    export: () => n.invoke("config:export"),
    import: () => n.invoke("config:import"),
    applyImport: (e) => n.invoke("config:applyImport", e)
  },
  // 模型管理
  model: {
    selectFolder: () => n.invoke("model:selectFolder"),
    import: (e, t) => n.invoke("model:import", e, t),
    getList: () => n.invoke("model:getList"),
    capturePreview: (e) => n.invoke("model:capturePreview", e),
    getPreview: (e) => n.invoke("model:getPreview", e),
    delete: (e) => n.invoke("model:delete", e),
    prepareLoad: (e) => n.invoke("model:prepareLoad", e),
    getExpressionTypes: (e) => n.invoke("model:getExpressionTypes", e),
    saveExpressionTypes: (e, t) => n.invoke("model:saveExpressionTypes", e, t),
    exportProfile: (e) => n.invoke("model:exportProfile", e),
    importProfile: (e) => n.invoke("model:importProfile", e),
    load: (e) => n.invoke("model:load", e),
    onLoad: (e) => r("model:load", e)
  },
  modelConfig: {
    load: (e) => n.invoke("modelConfig:load", e),
    save: (e) => n.invoke("modelConfig:save", e),
    delete: (e) => n.invoke("modelConfig:delete", e),
    ensure: (e) => n.invoke("modelConfig:ensure", e)
  },
  desktopAwareness: {
    getSettings: () => n.invoke("desktopAwareness:getSettings"),
    updateSettings: (e) => n.invoke("desktopAwareness:updateSettings", e),
    resetSettings: () => n.invoke("desktopAwareness:resetSettings"),
    getSnapshot: () => n.invoke("desktopAwareness:getSnapshot"),
    onSnapshotChanged: (e) => r("desktopAwareness:snapshotChanged", e)
  },
  desktopScene: {
    getSettings: () => n.invoke("desktopScene:getSettings"),
    updateSettings: (e) => n.invoke("desktopScene:updateSettings", e),
    resetSettings: () => n.invoke("desktopScene:resetSettings"),
    getSnapshot: () => n.invoke("desktopScene:getSnapshot")
  },
  personality: {
    getSettings: () => n.invoke("personality:getSettings"),
    updateSettings: (e) => n.invoke("personality:updateSettings", e),
    resetSettings: () => n.invoke("personality:resetSettings"),
    getPrompt: () => n.invoke("personality:getPrompt")
  },
  desktopAutomation: {
    setMouseClickEnabled: (e) => n.invoke("desktopAutomation:setMouseClickEnabled", e),
    getMouseClickEnabled: () => n.invoke("desktopAutomation:getMouseClickEnabled"),
    mouseClick: (e) => n.invoke("desktopAutomation:mouseClick", e)
  },
  // 全局快捷键
  shortcut: {
    register: (e) => n.invoke("shortcut:register", e),
    unregister: () => n.invoke("shortcut:unregister"),
    isRegistered: (e) => n.invoke("shortcut:isRegistered", e),
    setRecordingState: (e) => n.invoke("shortcut:setRecordingState", e),
    onRecordingStart: (e) => r("shortcut:recording-start", e),
    onRecordingStop: (e) => r("shortcut:recording-stop", e)
  },
  // 日志
  log: {
    debug: (...e) => g("debug", e),
    info: (...e) => g("info", e),
    warn: (...e) => g("warn", e),
    error: (...e) => g("error", e),
    getDirectory: () => n.invoke("log:getDirectory"),
    openDirectory: () => n.invoke("log:openDirectory"),
    setLevel: (e) => n.invoke("log:setLevel", e),
    getConfig: () => n.invoke("log:getConfig"),
    exportBundle: (e) => n.invoke("log:exportBundle", e)
  },
  // 自动更新
  update: {
    check: () => n.invoke("update:check"),
    getState: () => n.invoke("update:getState"),
    getSettings: () => n.invoke("update:getSettings"),
    updateSettings: (e) => n.invoke("update:updateSettings", e),
    quitAndInstall: () => n.invoke("update:quitAndInstall"),
    onStateChanged: (e) => r("update:stateChanged", e)
  },
  // 语言设置
  locale: {
    set: (e) => n.invoke("locale:set", e)
  }
});
