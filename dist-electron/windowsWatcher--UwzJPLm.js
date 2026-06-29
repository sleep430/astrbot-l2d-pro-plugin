var R = Object.defineProperty;
var S = (n, t, e) => t in n ? R(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var v = (n, t, e) => S(n, typeof t != "symbol" ? t + "" : t, e);
import { screen as G } from "electron";
import { createRequire as _ } from "module";
import { i as b } from "./main-B8fgRKXF.js";
const M = _(import.meta.url), C = 3, A = 32768, H = 32769, x = 32779, N = 32778, F = 0, V = 2, a = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
let I = null, d = null, i = null, g = null, h = null, f = null;
function O() {
  try {
    d = M("koffi"), d.proto(
      "void WinEventProc(int64 hWinEventHook, uint32 event, int64 hwnd, int idObject, int idChild, uint32 idEventThread, uint32 dwmsEventTime)"
    );
    const n = d.load("user32.dll"), t = n.func("int64 SetWinEventHook(uint32 eventMin, uint32 eventMax, int64 hmodWinEventProc, WinEventProc *lpfnWinEventProc, uint32 idProcess, uint32 idThread, uint32 dwFlags)"), e = n.func("int UnhookWinEvent(int64 hWinEventHook)"), s = n.func("int64 GetForegroundWindow()"), o = n.func("int GetWindowTextLengthW(int64 hWnd)"), r = n.func("int GetWindowTextW(int64 hWnd, void *lpString, int nMaxCount)"), l = n.func("uint32 GetWindowThreadProcessId(int64 hWnd, uint32 *lpdwProcessId)"), W = n.func("int GetWindowRect(int64 hWnd, void *lpRect)"), E = n.func("int IsWindowVisible(int64 hWnd)"), w = n.func("int IsIconic(int64 hWnd)"), p = n.func("int IsZoomed(int64 hWnd)"), u = n.func("int GetClassNameW(int64 hWnd, void *lpClassName, int nMaxCount)"), c = d.load("kernel32.dll"), P = c.func("int64 OpenProcess(uint32 dwDesiredAccess, int bInheritHandle, uint32 dwProcessId)"), k = c.func("int CloseHandle(int64 hObject)"), y = d.load("Psapi.dll").func("uint32 GetModuleFileNameExW(int64 hProcess, int64 hModule, void *lpFilename, uint32 nSize)");
    return i = { SetWinEventHook: t, UnhookWinEvent: e, GetForegroundWindow: s, GetWindowTextLengthW: o, GetWindowTextW: r, GetWindowThreadProcessId: l, GetWindowRect: W, IsWindowVisible: E, IsIconic: w, IsZoomed: p, GetClassNameW: u }, g = { OpenProcess: P, CloseHandle: k, GetModuleFileNameExW: y }, !0;
  } catch (n) {
    return console.error("[窗口监听] 初始化 Windows API 失败:", n), !1;
  }
}
function L(n) {
  try {
    const t = i.GetWindowTextLengthW(n);
    if (t === 0) return "";
    const e = Buffer.alloc((t + 1) * 2);
    return i.GetWindowTextW(n, e, t + 1), e.toString("utf16le", 0, t * 2);
  } catch {
    return "";
  }
}
function B(n) {
  try {
    const t = Buffer.alloc(512), e = i.GetClassNameW(n, t, 256);
    return e === 0 ? "" : t.toString("utf16le", 0, e * 2);
  } catch {
    return "";
  }
}
function D(n) {
  try {
    const t = Buffer.alloc(16);
    return i.GetWindowRect(n, t) === 0 ? null : {
      x: t.readInt32LE(0),
      y: t.readInt32LE(4),
      width: t.readInt32LE(8) - t.readInt32LE(0),
      height: t.readInt32LE(12) - t.readInt32LE(4)
    };
  } catch {
    return null;
  }
}
function U(n) {
  if (a.has(n))
    return a.get(n);
  const t = { name: "", path: "" };
  try {
    const o = g.OpenProcess(1040, 0, n);
    if (o !== 0n) {
      const r = Buffer.alloc(2048), l = g.GetModuleFileNameExW(o, 0n, r, 1024);
      l > 0 && (t.path = r.toString("utf16le", 0, l * 2), t.name = t.path.split("\\").pop() || ""), g.CloseHandle(o);
    }
  } catch (e) {
    console.warn("[窗口监听] 获取进程信息失败:", e);
  }
  if (a.set(n, t), a.size > 1e3) {
    const e = Array.from(a.keys());
    for (let s = 0; s < e.length / 2; s++)
      a.delete(e[s]);
  }
  return t;
}
function z(n) {
  try {
    const t = [0];
    return i.GetWindowThreadProcessId(n, t), t[0];
  } catch {
    return 0;
  }
}
function J(n) {
  return n.toString(16);
}
function T(n) {
  try {
    if (i.IsWindowVisible(n) === 0)
      return null;
    const t = J(n), e = L(n), s = B(n), o = D(n), r = z(n), l = U(r), W = G.getPrimaryDisplay(), E = W.bounds.width, w = W.bounds.height, p = i.IsIconic(n) !== 0, u = i.IsZoomed(n) !== 0, c = o ? b(o, E, w) : !1;
    return {
      id: t,
      title: e,
      processName: l.name,
      processPath: l.path,
      processId: r,
      bounds: o || { x: 0, y: 0, width: 0, height: 0 },
      isFullscreen: c,
      isMinimized: p,
      isMaximized: u,
      className: s
    };
  } catch (t) {
    return console.warn("[窗口监听] 获取窗口信息失败:", t), null;
  }
}
class K {
  constructor() {
    v(this, "eventCallback", null);
    v(this, "eventTypeMap", /* @__PURE__ */ new Map([
      [C, "focus"],
      [A, "create"],
      [H, "destroy"],
      [x, "move"],
      [N, "resize"]
    ]));
    v(this, "isRunning", !1);
  }
  start(t) {
    var s;
    if (this.isRunning) {
      console.warn("[窗口监听] 监听器已在运行");
      return;
    }
    if (!O()) {
      console.error("[窗口监听] 无法启动监听器");
      return;
    }
    this.eventCallback = t;
    const e = (o, r, l, W, E, w, p) => {
      if (!this.eventCallback) return;
      const u = this.eventTypeMap.get(r);
      if (!u) return;
      const c = T(l);
      c && (u === "destroy" ? m.delete(c.id) : m.set(c.id, c), this.eventCallback({
        type: u,
        timestamp: Date.now(),
        window: c,
        previousWindow: u === "focus" ? I : void 0
      }), u === "focus" && (I = c));
    };
    try {
      if (h = d.register(e, "WinEventProc *"), f = i.SetWinEventHook(
        C,
        N,
        0n,
        h,
        0,
        0,
        F | V
      ), f === 0n) {
        console.error("[窗口监听] SetWinEventHook 失败");
        return;
      }
      this.isRunning = !0, console.log("[窗口监听] Windows 原生事件监听已启动 (koffi)");
      const o = i.GetForegroundWindow();
      if (o !== 0n) {
        const r = T(o);
        r && (I = r, (s = this.eventCallback) == null || s.call(this, {
          type: "focus",
          timestamp: Date.now(),
          window: r
        }));
      }
    } catch (o) {
      console.error("[窗口监听] 启动监听失败:", o);
    }
  }
  stop() {
    if (this.isRunning)
      try {
        f !== null && f !== 0n && (i.UnhookWinEvent(f), f = null), h && (d.unregister(h), h = null), this.isRunning = !1, this.eventCallback = null, console.log("[窗口监听] Windows 原生事件监听已停止");
      } catch (t) {
        console.error("[窗口监听] 停止监听失败:", t);
      }
  }
  getActiveWindow() {
    try {
      if (!i && !O())
        return null;
      const t = i.GetForegroundWindow();
      return t === 0n ? null : T(t);
    } catch {
      return null;
    }
  }
  getAllWindows() {
    return Array.from(m.values());
  }
}
export {
  K as WindowsWatcher
};
