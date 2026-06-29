var D = Object.defineProperty;
var S = (t, e, n) => e in t ? D(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var g = (t, e, n) => S(t, typeof e != "symbol" ? e + "" : e, n);
import { screen as v } from "electron";
import { exec as z } from "child_process";
import { promisify as M } from "util";
import { i as A } from "./main-B8fgRKXF.js";
const I = M(z), W = /* @__PURE__ */ new Map();
let i = null, o = null, p = null;
const R = 500;
async function B() {
  try {
    const t = `
      tell application "System Events"
        set frontApp to name of first application process whose frontmost is true
        set frontAppPath to POSIX path of (file of process frontApp as alias)
        set windowTitle to ""
        set windowBounds to {0, 0, 0, 0}
        
        try
          tell process frontApp
            if (count of windows) > 0 then
              set windowTitle to name of window 1
              set {x, y} to position of window 1
              set {w, h} to size of window 1
              set windowBounds to {x, y, w, h}
            end if
          end tell
        end try
        
        return frontApp & "|||" & frontAppPath & "|||" & windowTitle & "|||" & (item 1 of windowBounds) & "," & (item 2 of windowBounds) & "," & (item 3 of windowBounds) & "," & (item 4 of windowBounds)
      end tell
    `, { stdout: e } = await I(`osascript -e '${t.replace(/'/g, `'"'"'`)}'`), n = e.trim();
    if (!n) return null;
    const r = n.split("|||");
    if (r.length < 4) return null;
    const [c, s, l, a] = r, [w, f, d, m] = a.split(",").map(Number), u = v.getPrimaryDisplay(), h = u.bounds.width, x = u.bounds.height, y = { x: w, y: f, width: d, height: m }, P = A(y, h, x);
    return {
      id: `${c}-${l}`.replace(/[^a-zA-Z0-9-]/g, "_"),
      title: l || c,
      processName: c,
      processPath: s,
      processId: 0,
      // AppleScript 不直接提供 PID
      bounds: y,
      isFullscreen: P,
      isMinimized: !1,
      isMaximized: !1
    };
  } catch {
    return null;
  }
}
async function F() {
  try {
    const e = (await import("./index-DB3FpC7z.js")).activeWindow;
    if (typeof e != "function")
      return null;
    const n = await e();
    if (!n) return null;
    const { title: r, owner: c, bounds: s, id: l } = n, { name: a, path: w, processId: f } = c, d = v.getPrimaryDisplay(), m = d.bounds.width, u = d.bounds.height, h = A(s, m, u);
    return {
      id: String(l || `${a}-${r}`),
      title: r || a,
      processName: a,
      processPath: w || "",
      processId: f || 0,
      bounds: {
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height
      },
      isFullscreen: h,
      isMinimized: !1,
      isMaximized: !1
    };
  } catch {
    return null;
  }
}
async function N() {
  const t = await F();
  return t || B();
}
async function b() {
  if (!o) return;
  const t = await N();
  if (!t) {
    i && (o({
      type: "blur",
      timestamp: Date.now(),
      window: i
    }), i = null);
    return;
  }
  if (W.set(t.id, t), !i || i.id !== t.id)
    o({
      type: "focus",
      timestamp: Date.now(),
      window: t,
      previousWindow: i || void 0
    }), i = t;
  else if (i.id === t.id) {
    const e = i, n = t;
    (e.bounds.width !== n.bounds.width || e.bounds.height !== n.bounds.height) && o({
      type: "resize",
      timestamp: Date.now(),
      window: t
    }), (e.bounds.x !== n.bounds.x || e.bounds.y !== n.bounds.y) && o({
      type: "move",
      timestamp: Date.now(),
      window: t
    }), e.isFullscreen !== n.isFullscreen && o({
      type: n.isFullscreen ? "maximize" : "restore",
      timestamp: Date.now(),
      window: t
    }), i = t;
  }
}
class k {
  constructor() {
    g(this, "isRunning", !1);
  }
  start(e) {
    if (this.isRunning) {
      console.warn("[窗口监听] macOS 监听器已在运行");
      return;
    }
    o = e, p = setInterval(() => {
      b().catch((n) => {
        console.warn("[窗口监听] 检查窗口变化失败:", n);
      });
    }, R), b().catch(() => {
    }), this.isRunning = !0, console.log("[窗口监听] macOS 事件监听已启动");
  }
  stop() {
    this.isRunning && (p && (clearInterval(p), p = null), this.isRunning = !1, o = null, console.log("[窗口监听] macOS 事件监听已停止"));
  }
  getActiveWindow() {
    return i;
  }
  getAllWindows() {
    return Array.from(W.values());
  }
}
export {
  k as MacOSWatcher
};
