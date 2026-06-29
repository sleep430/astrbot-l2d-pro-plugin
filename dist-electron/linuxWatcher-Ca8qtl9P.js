var S = Object.defineProperty;
var D = (t, e, i) => e in t ? S(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var _ = (t, e, i) => D(t, typeof e != "symbol" ? e + "" : e, i);
import { screen as x } from "electron";
import { spawn as b, exec as L } from "child_process";
import { promisify as P } from "util";
import { i as A } from "./main-B8fgRKXF.js";
const d = P(L);
function E(t) {
  return /^\d+$/.test(t);
}
function X(t) {
  return Number.isInteger(t) && t > 0;
}
const M = /* @__PURE__ */ new Map();
let c = null, p = null, m = null, y = null;
const $ = 500;
function N() {
  return process.env.XDG_SESSION_TYPE === "x11" || !!process.env.DISPLAY;
}
function z() {
  return process.env.XDG_SESSION_TYPE === "wayland" || !!process.env.WAYLAND_DISPLAY;
}
async function R() {
  try {
    const { stdout: t } = await d("xdotool getactivewindow"), e = t.trim();
    if (!e || !E(e)) return null;
    let i = "";
    try {
      const { stdout: a } = await d(`xdotool getwindowname ${e}`);
      i = a.trim();
    } catch {
    }
    let s = { x: 0, y: 0, width: 0, height: 0 };
    try {
      const { stdout: a } = await d(`xdotool getwindowgeometry --shell ${e}`), g = a.trim().split(`
`), h = {};
      for (const I of g) {
        const [T, v] = I.split("=");
        T && v && (h[T] = parseInt(v, 10));
      }
      s = {
        x: h.X || 0,
        y: h.Y || 0,
        width: h.WIDTH || 0,
        height: h.HEIGHT || 0
      };
    } catch {
    }
    let o = 0;
    try {
      const { stdout: a } = await d(`xdotool getwindowpid ${e}`);
      o = parseInt(a.trim(), 10) || 0;
    } catch {
    }
    let l = "", f = "";
    if (X(o))
      try {
        const { stdout: a } = await d(`ps -p ${o} -o comm=`);
        l = a.trim();
        const { stdout: g } = await d(`readlink -f /proc/${o}/exe`);
        f = g.trim();
      } catch {
      }
    const n = x.getPrimaryDisplay(), r = n.bounds.width, u = n.bounds.height, w = A(s, r, u);
    return {
      id: e,
      title: i || l,
      processName: l,
      processPath: f,
      processId: o,
      bounds: s,
      isFullscreen: w,
      isMinimized: !1,
      isMaximized: !1
    };
  } catch {
    return null;
  }
}
async function F(t) {
  if (!E(t)) return {};
  try {
    const { stdout: e } = await d(`xprop -id ${t}`), i = e.trim().split(`
`), s = {};
    for (const n of i) {
      const [r, ...u] = n.split("=");
      r && u.length > 0 && (s[r.trim()] = u.join("=").trim());
    }
    let o = "";
    s._NET_WM_NAME ? o = s._NET_WM_NAME.replace(/^"|"$/g, "") : s.WM_NAME && (o = s.WM_NAME.replace(/^"|"$/g, ""));
    let l = !1, f = !1;
    if (s.WM_STATE && (l = s.WM_STATE.includes("Iconic")), s._NET_WM_STATE) {
      const n = s._NET_WM_STATE;
      f = n.includes("_NET_WM_STATE_MAXIMIZED_VERT") && n.includes("_NET_WM_STATE_MAXIMIZED_HORZ");
    }
    return {
      title: o,
      isMinimized: l,
      isMaximized: f
    };
  } catch {
    return {};
  }
}
async function O() {
  const t = await R();
  if (!t) return null;
  const e = await F(t.id);
  return {
    ...t,
    ...e
  };
}
async function V() {
  var t, e, i, s;
  try {
    if (process.env.SWAYSOCK) {
      let o = function(r) {
        if (r.focused) return r;
        for (const u of r.nodes || []) {
          const w = o(u);
          if (w) return w;
        }
        return null;
      };
      const { stdout: l } = await d("swaymsg -t get_tree"), f = JSON.parse(l), n = o(f);
      if (n) {
        const r = x.getPrimaryDisplay(), u = r.bounds.width, w = r.bounds.height, a = {
          x: ((t = n.rect) == null ? void 0 : t.x) || 0,
          y: ((e = n.rect) == null ? void 0 : e.y) || 0,
          width: ((i = n.rect) == null ? void 0 : i.width) || 0,
          height: ((s = n.rect) == null ? void 0 : s.height) || 0
        };
        return {
          id: String(n.id || ""),
          title: n.name || n.app_id || "",
          processName: n.app_id || "",
          processPath: "",
          processId: n.pid || 0,
          bounds: a,
          isFullscreen: A(a, u, w),
          isMinimized: !1,
          isMaximized: n.type === "floating_con"
        };
      }
    }
  } catch {
  }
  return null;
}
async function Y() {
  return N() ? O() : z() ? V() : null;
}
async function W() {
  if (!p) return;
  const t = await Y();
  if (!t) {
    c && (p({
      type: "blur",
      timestamp: Date.now(),
      window: c
    }), c = null);
    return;
  }
  if (M.set(t.id, t), !c || c.id !== t.id)
    p({
      type: "focus",
      timestamp: Date.now(),
      window: t,
      previousWindow: c || void 0
    }), c = t;
  else if (c.id === t.id) {
    const e = c, i = t;
    (e.bounds.width !== i.bounds.width || e.bounds.height !== i.bounds.height) && p({
      type: "resize",
      timestamp: Date.now(),
      window: t
    }), (e.bounds.x !== i.bounds.x || e.bounds.y !== i.bounds.y) && p({
      type: "move",
      timestamp: Date.now(),
      window: t
    }), e.isFullscreen !== i.isFullscreen && p({
      type: i.isFullscreen ? "maximize" : "restore",
      timestamp: Date.now(),
      window: t
    }), c = t;
  }
}
function k() {
  try {
    const t = b("xprop", ["-root", "-spy"]);
    return t.stdout.on("data", (e) => {
      e.toString().includes("_NET_ACTIVE_WINDOW") && W().catch(() => {
      });
    }), t.on("error", () => {
      console.log("[窗口监听] xprop 不可用，回退到轮询模式");
    }), y = t, !0;
  } catch {
    return !1;
  }
}
class J {
  constructor() {
    _(this, "isRunning", !1);
    _(this, "useNativeListener", !1);
  }
  start(e) {
    if (this.isRunning) {
      console.warn("[窗口监听] Linux 监听器已在运行");
      return;
    }
    p = e, N() && (this.useNativeListener = k()), this.useNativeListener || (console.log("[窗口监听] 使用轮询模式（500ms 间隔）"), m = setInterval(() => {
      W().catch((i) => {
        console.warn("[窗口监听] 检查窗口变化失败:", i);
      });
    }, $)), W().catch(() => {
    }), this.isRunning = !0, console.log(`[窗口监听] Linux 事件监听已启动（${this.useNativeListener ? "原生" : "轮询"}模式）`);
  }
  stop() {
    this.isRunning && (m && (clearInterval(m), m = null), y && (y.kill(), y = null), this.isRunning = !1, p = null, console.log("[窗口监听] Linux 事件监听已停止"));
  }
  getActiveWindow() {
    return c;
  }
  getAllWindows() {
    return Array.from(M.values());
  }
}
export {
  J as LinuxWatcher
};
