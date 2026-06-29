import te from "node:process";
import Ae from "node:path";
import { promisify as ze } from "node:util";
import fe from "node:child_process";
import { fileURLToPath as Qn } from "node:url";
import xe from "node:fs";
import { createRequire as ki } from "node:module";
import { c as ne, r as Ni, g as Ii } from "./main-B8fgRKXF.js";
import sr from "url";
import se from "fs";
import ie from "path";
import Li from "mock-aws-s3";
import lr from "os";
import Mi from "aws-sdk";
import Pi from "nock";
import fr from "stream";
import ue from "util";
import ge from "events";
import Ke from "buffer";
import Qe from "assert";
import qi from "child_process";
const ji = Ae.dirname(Qn(import.meta.url)), Zn = ze(fe.execFile), Ze = Ae.join(ji, "../main"), Je = (n) => {
  try {
    return JSON.parse(n);
  } catch (t) {
    throw console.error(t), new Error("Error parsing window data");
  }
}, Xe = (n) => {
  if (!n)
    return [];
  const t = [];
  return n.accessibilityPermission === !1 && t.push("--no-accessibility-permission"), n.screenRecordingPermission === !1 && t.push("--no-screen-recording-permission"), t;
};
async function Wi(n) {
  const { stdout: t } = await Zn(Ze, Xe(n));
  return Je(t);
}
function Jn(n) {
  const t = fe.execFileSync(Ze, Xe(n), { encoding: "utf8" });
  return Je(t);
}
async function Gi(n) {
  const { stdout: t } = await Zn(Ze, [...Xe(n), "--open-windows-list"]);
  return Je(t);
}
function Xn(n) {
  const t = fe.execFileSync(Ze, [...Xe(n), "--open-windows-list"], { encoding: "utf8" });
  return Je(t);
}
const ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activeWindow: Wi,
  activeWindowSync: Jn,
  openWindows: Gi,
  openWindowsSync: Xn
}, Symbol.toStringTag, { value: "Module" })), Ve = ze(fe.execFile), Ui = ze(xe.readFile), $i = ze(xe.readlink), me = "xprop", ti = "xwininfo", ri = ["-root", "	$0", "_NET_ACTIVE_WINDOW"], ni = ["-root", "_NET_CLIENT_LIST_STACKING"], Ye = ["-id"], br = (n) => {
  const t = {};
  for (const _ of n.trim().split(`
`))
    if (_.includes("=")) {
      const [g, p] = _.split("=");
      t[g.trim()] = p.trim();
    } else if (_.includes(":")) {
      const [g, p] = _.split(":");
      t[g.trim()] = p.trim();
    }
  return t;
}, ii = ({ stdout: n, boundsStdout: t, activeWindowId: _ }) => {
  const g = br(n), p = br(t), i = "WM_CLIENT_LEADER(WINDOW)", s = Object.keys(g).indexOf(i) > 0 && Number.parseInt(g[i].split("#").pop(), 16) || _, c = Number.parseInt(g["_NET_WM_PID(CARDINAL)"], 10);
  if (Number.isNaN(c))
    throw new Error("Failed to parse process ID");
  return {
    platform: "linux",
    title: JSON.parse(g["_NET_WM_NAME(UTF8_STRING)"] || g["WM_NAME(STRING)"]) || null,
    id: s,
    owner: {
      name: JSON.parse(g["WM_CLASS(STRING)"].split(",").pop()),
      processId: c
    },
    bounds: {
      x: Number.parseInt(p["Absolute upper-left X"], 10),
      y: Number.parseInt(p["Absolute upper-left Y"], 10),
      width: Number.parseInt(p.Width, 10),
      height: Number.parseInt(p.Height, 10)
    }
  };
}, ai = (n) => Number.parseInt(n.split("	")[1], 16), Hi = async (n) => {
  const t = await Ui(`/proc/${n}/statm`, "utf8");
  return Number.parseInt(t.split(" ")[1], 10) * 4096;
}, Vi = (n) => {
  const t = xe.readFileSync(`/proc/${n}/statm`, "utf8");
  return Number.parseInt(t.split(" ")[1], 10) * 4096;
}, Yi = (n) => $i(`/proc/${n}/exe`), zi = (n) => {
  try {
    return xe.readlinkSync(`/proc/${n}/exe`);
  } catch {
  }
};
async function ui(n) {
  const [{ stdout: t }, { stdout: _ }] = await Promise.all([
    Ve(me, [...Ye, n], { env: { ...te.env, LC_ALL: "C.utf8" } }),
    Ve(ti, [...Ye, n])
  ]), g = ii({
    activeWindowId: n,
    boundsStdout: _,
    stdout: t
  }), [p, i] = await Promise.all([
    Hi(g.owner.processId),
    Yi(g.owner.processId).catch(() => {
    })
  ]);
  return g.memoryUsage = p, g.owner.path = i, g;
}
function oi(n) {
  const t = fe.execFileSync(me, [...Ye, n], { encoding: "utf8", env: { ...te.env, LC_ALL: "C.utf8" } }), _ = fe.execFileSync(ti, [...Ye, n], { encoding: "utf8" }), g = ii({
    activeWindowId: n,
    boundsStdout: _,
    stdout: t
  });
  return g.memoryUsage = Vi(g.owner.processId), g.owner.path = zi(g.owner.processId), g;
}
async function Ki() {
  try {
    const { stdout: n } = await Ve(me, ri), t = ai(n);
    return t ? ui(t) : void 0;
  } catch {
    return;
  }
}
function si() {
  try {
    const n = fe.execFileSync(me, ri, { encoding: "utf8" }), t = ai(n);
    return t ? oi(t) : void 0;
  } catch {
    return;
  }
}
async function Qi() {
  try {
    const { stdout: n } = await Ve(me, ni), t = n.split("#")[1].trim().replace(`
`, "").split(",");
    if (!t || t.length === 0)
      return;
    const _ = [];
    for await (const g of t)
      _.push(await ui(Number.parseInt(g, 16)));
    return _;
  } catch {
    return;
  }
}
function li() {
  try {
    const t = fe.execFileSync(me, ni, { encoding: "utf8" }).split("#")[1].trim().replace(`
`, "").split(",");
    if (!t || t.length === 0)
      return;
    const _ = [];
    for (const g of t) {
      const p = oi(Number.parseInt(g, 16));
      _.push(p);
    }
    return _;
  } catch (n) {
    console.log(n);
    return;
  }
}
const fi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activeWindow: Ki,
  activeWindowSync: si,
  openWindows: Qi,
  openWindowsSync: li
}, Symbol.toStringTag, { value: "Module" }));
function or(n) {
  throw new Error('Could not dynamically require "' + n + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Be = { exports: {} }, ke = { exports: {} }, gr;
function Zi() {
  return gr || (gr = 1, (function(n, t) {
    n.exports = t;
    const _ = sr, g = se, p = ie;
    n.exports.detect = function(i, r) {
      const s = i.hosted_path, c = _.parse(s);
      if (r.prefix = !c.pathname || c.pathname === "/" ? "" : c.pathname.replace("/", ""), i.bucket && i.region)
        r.bucket = i.bucket, r.region = i.region, r.endpoint = i.host, r.s3ForcePathStyle = i.s3ForcePathStyle;
      else {
        const m = c.hostname.split(".s3"), v = m[0];
        if (!v)
          return;
        if (r.bucket || (r.bucket = v), !r.region) {
          const b = m[1].slice(1).split(".")[0];
          b === "amazonaws" ? r.region = "us-east-1" : r.region = b;
        }
      }
    }, n.exports.get_s3 = function(i) {
      if (process.env.node_pre_gyp_mock_s3) {
        const c = Li, m = lr;
        c.config.basePath = `${m.tmpdir()}/mock`;
        const v = c.S3(), b = (f) => (C, ...E) => (C && C.code === "ENOENT" && (C.code = "NotFound"), f(C, ...E));
        return {
          listObjects(f, C) {
            return v.listObjects(f, b(C));
          },
          headObject(f, C) {
            return v.headObject(f, b(C));
          },
          deleteObject(f, C) {
            return v.deleteObject(f, b(C));
          },
          putObject(f, C) {
            return v.putObject(f, b(C));
          }
        };
      }
      const r = Mi;
      r.config.update(i);
      const s = new r.S3();
      return {
        listObjects(c, m) {
          return s.listObjects(c, m);
        },
        headObject(c, m) {
          return s.headObject(c, m);
        },
        deleteObject(c, m) {
          return s.deleteObject(c, m);
        },
        putObject(c, m) {
          return s.putObject(c, m);
        }
      };
    }, n.exports.get_mockS3Http = function() {
      let i = !1;
      if (!process.env.node_pre_gyp_mock_s3)
        return () => i;
      const r = Pi, s = "https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com", c = process.env.node_pre_gyp_mock_s3 + "/mapbox-node-pre-gyp-public-testing-bucket";
      return (() => {
        function b(f, C) {
          const E = p.join(c, f.replace("%2B", "+"));
          try {
            g.accessSync(E, g.constants.R_OK);
          } catch {
            return [404, `not found
`];
          }
          return [200, g.createReadStream(E)];
        }
        return r(s).persist().get(() => i).reply(b);
      })(), (b) => {
        const f = i;
        if (b === "off")
          i = !1;
        else if (b === "on")
          i = !0;
        else if (b !== "get")
          throw new Error(`illegal action for setMockHttp ${b}`);
        return f;
      };
    };
  })(ke, ke.exports)), ke.exports;
}
var Ne = { exports: {} }, rt = { exports: {} }, mr;
function Ji() {
  return mr || (mr = 1, (function(n, t) {
    n.exports = g.abbrev = g, g.monkeyPatch = _;
    function _() {
      Object.defineProperty(Array.prototype, "abbrev", {
        value: function() {
          return g(this);
        },
        enumerable: !1,
        configurable: !0,
        writable: !0
      }), Object.defineProperty(Object.prototype, "abbrev", {
        value: function() {
          return g(Object.keys(this));
        },
        enumerable: !1,
        configurable: !0,
        writable: !0
      });
    }
    function g(i) {
      (arguments.length !== 1 || !Array.isArray(i)) && (i = Array.prototype.slice.call(arguments, 0));
      for (var r = 0, s = i.length, c = []; r < s; r++)
        c[r] = typeof i[r] == "string" ? i[r] : String(i[r]);
      c = c.sort(p);
      for (var m = {}, v = "", r = 0, s = c.length; r < s; r++) {
        var b = c[r], f = c[r + 1] || "", C = !0, E = !0;
        if (b !== f) {
          for (var a = 0, d = b.length; a < d; a++) {
            var e = b.charAt(a);
            if (C = C && e === f.charAt(a), E = E && e === v.charAt(a), !C && !E) {
              a++;
              break;
            }
          }
          if (v = b, a === d) {
            m[b] = b;
            continue;
          }
          for (var l = b.substr(0, a); a <= d; a++)
            m[l] = b, l += b.charAt(a);
        }
      }
      return m;
    }
    function p(i, r) {
      return i === r ? 0 : i > r ? 1 : -1;
    }
  })(rt)), rt.exports;
}
var yr;
function Xi() {
  return yr || (yr = 1, (function(n, t) {
    var _ = process.env.DEBUG_NOPT || process.env.NOPT_DEBUG ? function() {
      console.error.apply(console, arguments);
    } : function() {
    }, g = sr, p = ie, i = fr.Stream, r = Ji(), s = lr;
    n.exports = t = c, t.clean = m, t.typeDefs = {
      String: { type: String, validate: v },
      Boolean: { type: Boolean, validate: E },
      url: { type: g, validate: a },
      Number: { type: Number, validate: f },
      path: { type: p, validate: b },
      Stream: { type: i, validate: d },
      Date: { type: Date, validate: C }
    };
    function c(u, o, D, R) {
      D = D || process.argv, u = u || {}, o = o || {}, typeof R != "number" && (R = 2), _(u, o, D, R), D = D.slice(R);
      var x = {}, h = {
        remain: [],
        cooked: D,
        original: D.slice(0)
      };
      return l(D, x, h.remain, u, o), m(x, u, t.typeDefs), x.argv = h, Object.defineProperty(x.argv, "toString", { value: function() {
        return this.original.map(JSON.stringify).join(" ");
      }, enumerable: !1 }), x;
    }
    function m(u, o, D) {
      D = D || t.typeDefs;
      var R = {}, x = [!1, !0, null, String, Array];
      Object.keys(u).forEach(function(h) {
        if (h !== "argv") {
          var y = u[h], A = Array.isArray(y), T = o[h];
          A || (y = [y]), T || (T = x), T === Array && (T = x.concat(Array)), Array.isArray(T) || (T = [T]), _("val=%j", y), _("types=", T), y = y.map(function(O) {
            if (typeof O == "string" && (_("string %j", O), O = O.trim(), O === "null" && ~T.indexOf(null) || O === "true" && (~T.indexOf(!0) || ~T.indexOf(Boolean)) || O === "false" && (~T.indexOf(!1) || ~T.indexOf(Boolean)) ? (O = JSON.parse(O), _("jsonable %j", O)) : ~T.indexOf(Number) && !isNaN(O) ? (_("convert to number", O), O = +O) : ~T.indexOf(Date) && !isNaN(Date.parse(O)) && (_("convert to date", O), O = new Date(O))), !o.hasOwnProperty(h))
              return O;
            O === !1 && ~T.indexOf(null) && !(~T.indexOf(!1) || ~T.indexOf(Boolean)) && (O = null);
            var L = {};
            return L[h] = O, _("prevalidated val", L, O, o[h]), e(L, h, O, o[h], D) ? (_("validated val", L, O, o[h]), L[h]) : (t.invalidHandler ? t.invalidHandler(h, O, o[h], u) : t.invalidHandler !== !1 && _("invalid: " + h + "=" + O, o[h]), R);
          }).filter(function(O) {
            return O !== R;
          }), !y.length && T.indexOf(Array) === -1 ? (_("VAL HAS NO LENGTH, DELETE IT", y, h, T.indexOf(Array)), delete u[h]) : A ? (_(A, u[h], y), u[h] = y) : u[h] = y[0], _("k=%s val=%j", h, y, u[h]);
        }
      });
    }
    function v(u, o, D) {
      u[o] = String(D);
    }
    function b(u, o, D) {
      if (D === !0) return !1;
      if (D === null) return !0;
      D = String(D);
      var R = process.platform === "win32", x = R ? /^~(\/|\\)/ : /^~\//, h = s.homedir();
      return h && D.match(x) ? u[o] = p.resolve(h, D.substr(2)) : u[o] = p.resolve(D), !0;
    }
    function f(u, o, D) {
      if (_("validate Number %j %j %j", o, D, isNaN(D)), isNaN(D)) return !1;
      u[o] = +D;
    }
    function C(u, o, D) {
      var R = Date.parse(D);
      if (_("validate Date %j %j %j", o, D, R), isNaN(R)) return !1;
      u[o] = new Date(D);
    }
    function E(u, o, D) {
      D instanceof Boolean ? D = D.valueOf() : typeof D == "string" ? isNaN(D) ? D === "null" || D === "false" ? D = !1 : D = !0 : D = !!+D : D = !!D, u[o] = D;
    }
    function a(u, o, D) {
      if (D = g.parse(String(D)), !D.host) return !1;
      u[o] = D.href;
    }
    function d(u, o, D) {
      if (!(D instanceof i)) return !1;
      u[o] = D;
    }
    function e(u, o, D, R, x) {
      if (Array.isArray(R)) {
        for (var h = 0, y = R.length; h < y; h++)
          if (R[h] !== Array && e(u, o, D, R[h], x))
            return !0;
        return delete u[o], !1;
      }
      if (R === Array) return !0;
      if (R !== R)
        return _("Poison NaN", o, D, R), delete u[o], !1;
      if (D === R)
        return _("Explicitly allowed %j", D), u[o] = D, !0;
      for (var A = !1, T = Object.keys(x), h = 0, y = T.length; h < y; h++) {
        _("test type %j %j %j", o, D, T[h]);
        var O = x[T[h]];
        if (O && (R && R.name && O.type && O.type.name ? R.name === O.type.name : R === O.type)) {
          var L = {};
          if (A = O.validate(L, o, D) !== !1, D = L[o], A) {
            u[o] = D;
            break;
          }
        }
      }
      return _("OK? %j (%j %j %j)", A, o, D, T[h]), A || delete u[o], A;
    }
    function l(u, o, D, R, x) {
      _("parse", u, o, D);
      for (var h = r(Object.keys(R)), y = r(Object.keys(x)), A = 0; A < u.length; A++) {
        var T = u[A];
        if (_("arg", T), T.match(/^-{2,}$/)) {
          D.push.apply(D, u.slice(A + 1)), u[A] = "--";
          break;
        }
        var O = !1;
        if (T.charAt(0) === "-" && T.length > 1) {
          var L = T.indexOf("=");
          if (L > -1) {
            O = !0;
            var W = T.substr(L + 1);
            T = T.substr(0, L), u.splice(A, 1, T, W);
          }
          var H = S(T, x, y, h);
          if (_("arg=%j shRes=%j", T, H), H && (_(T, H), u.splice.apply(u, [A, 1].concat(H)), T !== H[0])) {
            A--;
            continue;
          }
          T = T.replace(/^-+/, "");
          for (var q = null; T.toLowerCase().indexOf("no-") === 0; )
            q = !q, T = T.substr(3);
          h[T] && (T = h[T]);
          var P = R[T], $ = Array.isArray(P);
          $ && P.length === 1 && ($ = !1, P = P[0]);
          var K = P === Array || $ && P.indexOf(Array) !== -1;
          !R.hasOwnProperty(T) && o.hasOwnProperty(T) && (Array.isArray(o[T]) || (o[T] = [o[T]]), K = !0);
          var Y, N = u[A + 1], U = typeof q == "boolean" || P === Boolean || $ && P.indexOf(Boolean) !== -1 || typeof P > "u" && !O || N === "false" && (P === null || $ && ~P.indexOf(null));
          if (U) {
            Y = !q, (N === "true" || N === "false") && (Y = JSON.parse(N), N = null, q && (Y = !Y), A++), $ && N && (~P.indexOf(N) ? (Y = N, A++) : N === "null" && ~P.indexOf(null) ? (Y = null, A++) : !N.match(/^-{2,}[^-]/) && !isNaN(N) && ~P.indexOf(Number) ? (Y = +N, A++) : !N.match(/^-[^-]/) && ~P.indexOf(String) && (Y = N, A++)), K ? (o[T] = o[T] || []).push(Y) : o[T] = Y;
            continue;
          }
          P === String && (N === void 0 ? N = "" : N.match(/^-{1,2}[^-]+/) && (N = "", A--)), N && N.match(/^-{2,}$/) && (N = void 0, A--), Y = N === void 0 ? !0 : N, K ? (o[T] = o[T] || []).push(Y) : o[T] = Y, A++;
          continue;
        }
        D.push(T);
      }
    }
    function S(u, o, D, R) {
      if (u = u.replace(/^-+/, ""), R[u] === u)
        return null;
      if (o[u])
        return o[u] && !Array.isArray(o[u]) && (o[u] = o[u].split(/\s+/)), o[u];
      var x = o.___singles;
      x || (x = Object.keys(o).filter(function(y) {
        return y.length === 1;
      }).reduce(function(y, A) {
        return y[A] = !0, y;
      }, {}), o.___singles = x, _("shorthand singles", x));
      var h = u.split("").filter(function(y) {
        return x[y];
      });
      return h.join("") === u ? h.map(function(y) {
        return o[y];
      }).reduce(function(y, A) {
        return y.concat(A);
      }, []) : R[u] && !o[u] ? null : (D[u] && (u = D[u]), o[u] && !Array.isArray(o[u]) && (o[u] = o[u].split(/\s+/)), o[u]);
    }
  })(Ne, Ne.exports)), Ne.exports;
}
var nt = { exports: {} }, we = {}, it = { exports: {} }, at = { exports: {} }, Er;
function ci() {
  if (Er) return at.exports;
  Er = 1;
  var n = ge.EventEmitter, t = ue, _ = 0, g = at.exports = function(p) {
    n.call(this), this.id = ++_, this.name = p;
  };
  return t.inherits(g, n), at.exports;
}
var ut = { exports: {} }, wr;
function cr() {
  if (wr) return ut.exports;
  wr = 1;
  var n = ue, t = ci(), _ = ut.exports = function(g, p) {
    t.call(this, g), this.workDone = 0, this.workTodo = p || 0;
  };
  return n.inherits(_, t), _.prototype.completed = function() {
    return this.workTodo === 0 ? 0 : this.workDone / this.workTodo;
  }, _.prototype.addWork = function(g) {
    this.workTodo += g, this.emit("change", this.name, this.completed(), this);
  }, _.prototype.completeWork = function(g) {
    this.workDone += g, this.workDone > this.workTodo && (this.workDone = this.workTodo), this.emit("change", this.name, this.completed(), this);
  }, _.prototype.finish = function() {
    this.workTodo = this.workDone = 1, this.emit("change", this.name, 1, this);
  }, ut.exports;
}
var ot = { exports: {} }, Ie = { exports: {} }, st, Fr;
function di() {
  return Fr || (Fr = 1, st = fr), st;
}
var lt, Cr;
function ea() {
  if (Cr) return lt;
  Cr = 1;
  function n(E, a) {
    var d = Object.keys(E);
    if (Object.getOwnPropertySymbols) {
      var e = Object.getOwnPropertySymbols(E);
      a && (e = e.filter(function(l) {
        return Object.getOwnPropertyDescriptor(E, l).enumerable;
      })), d.push.apply(d, e);
    }
    return d;
  }
  function t(E) {
    for (var a = 1; a < arguments.length; a++) {
      var d = arguments[a] != null ? arguments[a] : {};
      a % 2 ? n(Object(d), !0).forEach(function(e) {
        _(E, e, d[e]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(E, Object.getOwnPropertyDescriptors(d)) : n(Object(d)).forEach(function(e) {
        Object.defineProperty(E, e, Object.getOwnPropertyDescriptor(d, e));
      });
    }
    return E;
  }
  function _(E, a, d) {
    return a = r(a), a in E ? Object.defineProperty(E, a, { value: d, enumerable: !0, configurable: !0, writable: !0 }) : E[a] = d, E;
  }
  function g(E, a) {
    if (!(E instanceof a))
      throw new TypeError("Cannot call a class as a function");
  }
  function p(E, a) {
    for (var d = 0; d < a.length; d++) {
      var e = a[d];
      e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(E, r(e.key), e);
    }
  }
  function i(E, a, d) {
    return a && p(E.prototype, a), Object.defineProperty(E, "prototype", { writable: !1 }), E;
  }
  function r(E) {
    var a = s(E, "string");
    return typeof a == "symbol" ? a : String(a);
  }
  function s(E, a) {
    if (typeof E != "object" || E === null) return E;
    var d = E[Symbol.toPrimitive];
    if (d !== void 0) {
      var e = d.call(E, a);
      if (typeof e != "object") return e;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(E);
  }
  var c = Ke, m = c.Buffer, v = ue, b = v.inspect, f = b && b.custom || "inspect";
  function C(E, a, d) {
    m.prototype.copy.call(E, a, d);
  }
  return lt = /* @__PURE__ */ (function() {
    function E() {
      g(this, E), this.head = null, this.tail = null, this.length = 0;
    }
    return i(E, [{
      key: "push",
      value: function(d) {
        var e = {
          data: d,
          next: null
        };
        this.length > 0 ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(d) {
        var e = {
          data: d,
          next: this.head
        };
        this.length === 0 && (this.tail = e), this.head = e, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var d = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, d;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(d) {
        if (this.length === 0) return "";
        for (var e = this.head, l = "" + e.data; e = e.next; ) l += d + e.data;
        return l;
      }
    }, {
      key: "concat",
      value: function(d) {
        if (this.length === 0) return m.alloc(0);
        for (var e = m.allocUnsafe(d >>> 0), l = this.head, S = 0; l; )
          C(l.data, e, S), S += l.data.length, l = l.next;
        return e;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(d, e) {
        var l;
        return d < this.head.data.length ? (l = this.head.data.slice(0, d), this.head.data = this.head.data.slice(d)) : d === this.head.data.length ? l = this.shift() : l = e ? this._getString(d) : this._getBuffer(d), l;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(d) {
        var e = this.head, l = 1, S = e.data;
        for (d -= S.length; e = e.next; ) {
          var u = e.data, o = d > u.length ? u.length : d;
          if (o === u.length ? S += u : S += u.slice(0, d), d -= o, d === 0) {
            o === u.length ? (++l, e.next ? this.head = e.next : this.head = this.tail = null) : (this.head = e, e.data = u.slice(o));
            break;
          }
          ++l;
        }
        return this.length -= l, S;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(d) {
        var e = m.allocUnsafe(d), l = this.head, S = 1;
        for (l.data.copy(e), d -= l.data.length; l = l.next; ) {
          var u = l.data, o = d > u.length ? u.length : d;
          if (u.copy(e, e.length - d, 0, o), d -= o, d === 0) {
            o === u.length ? (++S, l.next ? this.head = l.next : this.head = this.tail = null) : (this.head = l, l.data = u.slice(o));
            break;
          }
          ++S;
        }
        return this.length -= S, e;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: f,
      value: function(d, e) {
        return b(this, t(t({}, e), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), E;
  })(), lt;
}
var ft, Sr;
function hi() {
  if (Sr) return ft;
  Sr = 1;
  function n(r, s) {
    var c = this, m = this._readableState && this._readableState.destroyed, v = this._writableState && this._writableState.destroyed;
    return m || v ? (s ? s(r) : r && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process.nextTick(p, this, r)) : process.nextTick(p, this, r)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(r || null, function(b) {
      !s && b ? c._writableState ? c._writableState.errorEmitted ? process.nextTick(_, c) : (c._writableState.errorEmitted = !0, process.nextTick(t, c, b)) : process.nextTick(t, c, b) : s ? (process.nextTick(_, c), s(b)) : process.nextTick(_, c);
    }), this);
  }
  function t(r, s) {
    p(r, s), _(r);
  }
  function _(r) {
    r._writableState && !r._writableState.emitClose || r._readableState && !r._readableState.emitClose || r.emit("close");
  }
  function g() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function p(r, s) {
    r.emit("error", s);
  }
  function i(r, s) {
    var c = r._readableState, m = r._writableState;
    c && c.autoDestroy || m && m.autoDestroy ? r.destroy(s) : r.emit("error", s);
  }
  return ft = {
    destroy: n,
    undestroy: g,
    errorOrDestroy: i
  }, ft;
}
var ct = {}, Rr;
function he() {
  if (Rr) return ct;
  Rr = 1;
  const n = {};
  function t(r, s, c) {
    c || (c = Error);
    function m(b, f, C) {
      return typeof s == "string" ? s : s(b, f, C);
    }
    class v extends c {
      constructor(f, C, E) {
        super(m(f, C, E));
      }
    }
    v.prototype.name = c.name, v.prototype.code = r, n[r] = v;
  }
  function _(r, s) {
    if (Array.isArray(r)) {
      const c = r.length;
      return r = r.map((m) => String(m)), c > 2 ? `one of ${s} ${r.slice(0, c - 1).join(", ")}, or ` + r[c - 1] : c === 2 ? `one of ${s} ${r[0]} or ${r[1]}` : `of ${s} ${r[0]}`;
    } else
      return `of ${s} ${String(r)}`;
  }
  function g(r, s, c) {
    return r.substr(0, s.length) === s;
  }
  function p(r, s, c) {
    return (c === void 0 || c > r.length) && (c = r.length), r.substring(c - s.length, c) === s;
  }
  function i(r, s, c) {
    return typeof c != "number" && (c = 0), c + s.length > r.length ? !1 : r.indexOf(s, c) !== -1;
  }
  return t("ERR_INVALID_OPT_VALUE", function(r, s) {
    return 'The value "' + s + '" is invalid for option "' + r + '"';
  }, TypeError), t("ERR_INVALID_ARG_TYPE", function(r, s, c) {
    let m;
    typeof s == "string" && g(s, "not ") ? (m = "must not be", s = s.replace(/^not /, "")) : m = "must be";
    let v;
    if (p(r, " argument"))
      v = `The ${r} ${m} ${_(s, "type")}`;
    else {
      const b = i(r, ".") ? "property" : "argument";
      v = `The "${r}" ${b} ${m} ${_(s, "type")}`;
    }
    return v += `. Received type ${typeof c}`, v;
  }, TypeError), t("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), t("ERR_METHOD_NOT_IMPLEMENTED", function(r) {
    return "The " + r + " method is not implemented";
  }), t("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), t("ERR_STREAM_DESTROYED", function(r) {
    return "Cannot call " + r + " after a stream was destroyed";
  }), t("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), t("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), t("ERR_STREAM_WRITE_AFTER_END", "write after end"), t("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), t("ERR_UNKNOWN_ENCODING", function(r) {
    return "Unknown encoding: " + r;
  }, TypeError), t("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), ct.codes = n, ct;
}
var dt, Ar;
function Di() {
  if (Ar) return dt;
  Ar = 1;
  var n = he().codes.ERR_INVALID_OPT_VALUE;
  function t(g, p, i) {
    return g.highWaterMark != null ? g.highWaterMark : p ? g[i] : null;
  }
  function _(g, p, i, r) {
    var s = t(p, r, i);
    if (s != null) {
      if (!(isFinite(s) && Math.floor(s) === s) || s < 0) {
        var c = r ? i : "highWaterMark";
        throw new n(c, s);
      }
      return Math.floor(s);
    }
    return g.objectMode ? 16 : 16 * 1024;
  }
  return dt = {
    getHighWaterMark: _
  }, dt;
}
var Le = { exports: {} }, Me = { exports: {} }, xr;
function ta() {
  return xr || (xr = 1, typeof Object.create == "function" ? Me.exports = function(t, _) {
    _ && (t.super_ = _, t.prototype = Object.create(_.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : Me.exports = function(t, _) {
    if (_) {
      t.super_ = _;
      var g = function() {
      };
      g.prototype = _.prototype, t.prototype = new g(), t.prototype.constructor = t;
    }
  }), Me.exports;
}
var Tr;
function ye() {
  if (Tr) return Le.exports;
  Tr = 1;
  try {
    var n = require("util");
    if (typeof n.inherits != "function") throw "";
    Le.exports = n.inherits;
  } catch {
    Le.exports = ta();
  }
  return Le.exports;
}
var ht, Or;
function ra() {
  return Or || (Or = 1, ht = ue.deprecate), ht;
}
var Dt, Br;
function vi() {
  if (Br) return Dt;
  Br = 1, Dt = x;
  function n(k) {
    var B = this;
    this.next = null, this.entry = null, this.finish = function() {
      X(B, k);
    };
  }
  var t;
  x.WritableState = D;
  var _ = {
    deprecate: ra()
  }, g = di(), p = Ke.Buffer, i = (typeof ne < "u" ? ne : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function r(k) {
    return p.from(k);
  }
  function s(k) {
    return p.isBuffer(k) || k instanceof i;
  }
  var c = hi(), m = Di(), v = m.getHighWaterMark, b = he().codes, f = b.ERR_INVALID_ARG_TYPE, C = b.ERR_METHOD_NOT_IMPLEMENTED, E = b.ERR_MULTIPLE_CALLBACK, a = b.ERR_STREAM_CANNOT_PIPE, d = b.ERR_STREAM_DESTROYED, e = b.ERR_STREAM_NULL_VALUES, l = b.ERR_STREAM_WRITE_AFTER_END, S = b.ERR_UNKNOWN_ENCODING, u = c.errorOrDestroy;
  ye()(x, g);
  function o() {
  }
  function D(k, B, M) {
    t = t || be(), k = k || {}, typeof M != "boolean" && (M = B instanceof t), this.objectMode = !!k.objectMode, M && (this.objectMode = this.objectMode || !!k.writableObjectMode), this.highWaterMark = v(this, k, "writableHighWaterMark", M), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var G = k.decodeStrings === !1;
    this.decodeStrings = !G, this.defaultEncoding = k.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(V) {
      H(B, V);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = k.emitClose !== !1, this.autoDestroy = !!k.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new n(this);
  }
  D.prototype.getBuffer = function() {
    for (var B = this.bufferedRequest, M = []; B; )
      M.push(B), B = B.next;
    return M;
  }, (function() {
    try {
      Object.defineProperty(D.prototype, "buffer", {
        get: _.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var R;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (R = Function.prototype[Symbol.hasInstance], Object.defineProperty(x, Symbol.hasInstance, {
    value: function(B) {
      return R.call(this, B) ? !0 : this !== x ? !1 : B && B._writableState instanceof D;
    }
  })) : R = function(B) {
    return B instanceof this;
  };
  function x(k) {
    t = t || be();
    var B = this instanceof t;
    if (!B && !R.call(x, this)) return new x(k);
    this._writableState = new D(k, this, B), this.writable = !0, k && (typeof k.write == "function" && (this._write = k.write), typeof k.writev == "function" && (this._writev = k.writev), typeof k.destroy == "function" && (this._destroy = k.destroy), typeof k.final == "function" && (this._final = k.final)), g.call(this);
  }
  x.prototype.pipe = function() {
    u(this, new a());
  };
  function h(k, B) {
    var M = new l();
    u(k, M), process.nextTick(B, M);
  }
  function y(k, B, M, G) {
    var V;
    return M === null ? V = new e() : typeof M != "string" && !B.objectMode && (V = new f("chunk", ["string", "Buffer"], M)), V ? (u(k, V), process.nextTick(G, V), !1) : !0;
  }
  x.prototype.write = function(k, B, M) {
    var G = this._writableState, V = !1, w = !G.objectMode && s(k);
    return w && !p.isBuffer(k) && (k = r(k)), typeof B == "function" && (M = B, B = null), w ? B = "buffer" : B || (B = G.defaultEncoding), typeof M != "function" && (M = o), G.ending ? h(this, M) : (w || y(this, G, k, M)) && (G.pendingcb++, V = T(this, G, w, k, B, M)), V;
  }, x.prototype.cork = function() {
    this._writableState.corked++;
  }, x.prototype.uncork = function() {
    var k = this._writableState;
    k.corked && (k.corked--, !k.writing && !k.corked && !k.bufferProcessing && k.bufferedRequest && $(this, k));
  }, x.prototype.setDefaultEncoding = function(B) {
    if (typeof B == "string" && (B = B.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((B + "").toLowerCase()) > -1)) throw new S(B);
    return this._writableState.defaultEncoding = B, this;
  }, Object.defineProperty(x.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function A(k, B, M) {
    return !k.objectMode && k.decodeStrings !== !1 && typeof B == "string" && (B = p.from(B, M)), B;
  }
  Object.defineProperty(x.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function T(k, B, M, G, V, w) {
    if (!M) {
      var F = A(B, G, V);
      G !== F && (M = !0, V = "buffer", G = F);
    }
    var I = B.objectMode ? 1 : G.length;
    B.length += I;
    var j = B.length < B.highWaterMark;
    if (j || (B.needDrain = !0), B.writing || B.corked) {
      var J = B.lastBufferedRequest;
      B.lastBufferedRequest = {
        chunk: G,
        encoding: V,
        isBuf: M,
        callback: w,
        next: null
      }, J ? J.next = B.lastBufferedRequest : B.bufferedRequest = B.lastBufferedRequest, B.bufferedRequestCount += 1;
    } else
      O(k, B, !1, I, G, V, w);
    return j;
  }
  function O(k, B, M, G, V, w, F) {
    B.writelen = G, B.writecb = F, B.writing = !0, B.sync = !0, B.destroyed ? B.onwrite(new d("write")) : M ? k._writev(V, B.onwrite) : k._write(V, w, B.onwrite), B.sync = !1;
  }
  function L(k, B, M, G, V) {
    --B.pendingcb, M ? (process.nextTick(V, G), process.nextTick(U, k, B), k._writableState.errorEmitted = !0, u(k, G)) : (V(G), k._writableState.errorEmitted = !0, u(k, G), U(k, B));
  }
  function W(k) {
    k.writing = !1, k.writecb = null, k.length -= k.writelen, k.writelen = 0;
  }
  function H(k, B) {
    var M = k._writableState, G = M.sync, V = M.writecb;
    if (typeof V != "function") throw new E();
    if (W(M), B) L(k, M, G, B, V);
    else {
      var w = K(M) || k.destroyed;
      !w && !M.corked && !M.bufferProcessing && M.bufferedRequest && $(k, M), G ? process.nextTick(q, k, M, w, V) : q(k, M, w, V);
    }
  }
  function q(k, B, M, G) {
    M || P(k, B), B.pendingcb--, G(), U(k, B);
  }
  function P(k, B) {
    B.length === 0 && B.needDrain && (B.needDrain = !1, k.emit("drain"));
  }
  function $(k, B) {
    B.bufferProcessing = !0;
    var M = B.bufferedRequest;
    if (k._writev && M && M.next) {
      var G = B.bufferedRequestCount, V = new Array(G), w = B.corkedRequestsFree;
      w.entry = M;
      for (var F = 0, I = !0; M; )
        V[F] = M, M.isBuf || (I = !1), M = M.next, F += 1;
      V.allBuffers = I, O(k, B, !0, B.length, V, "", w.finish), B.pendingcb++, B.lastBufferedRequest = null, w.next ? (B.corkedRequestsFree = w.next, w.next = null) : B.corkedRequestsFree = new n(B), B.bufferedRequestCount = 0;
    } else {
      for (; M; ) {
        var j = M.chunk, J = M.encoding, z = M.callback, Z = B.objectMode ? 1 : j.length;
        if (O(k, B, !1, Z, j, J, z), M = M.next, B.bufferedRequestCount--, B.writing)
          break;
      }
      M === null && (B.lastBufferedRequest = null);
    }
    B.bufferedRequest = M, B.bufferProcessing = !1;
  }
  x.prototype._write = function(k, B, M) {
    M(new C("_write()"));
  }, x.prototype._writev = null, x.prototype.end = function(k, B, M) {
    var G = this._writableState;
    return typeof k == "function" ? (M = k, k = null, B = null) : typeof B == "function" && (M = B, B = null), k != null && this.write(k, B), G.corked && (G.corked = 1, this.uncork()), G.ending || Q(this, G, M), this;
  }, Object.defineProperty(x.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function K(k) {
    return k.ending && k.length === 0 && k.bufferedRequest === null && !k.finished && !k.writing;
  }
  function Y(k, B) {
    k._final(function(M) {
      B.pendingcb--, M && u(k, M), B.prefinished = !0, k.emit("prefinish"), U(k, B);
    });
  }
  function N(k, B) {
    !B.prefinished && !B.finalCalled && (typeof k._final == "function" && !B.destroyed ? (B.pendingcb++, B.finalCalled = !0, process.nextTick(Y, k, B)) : (B.prefinished = !0, k.emit("prefinish")));
  }
  function U(k, B) {
    var M = K(B);
    if (M && (N(k, B), B.pendingcb === 0 && (B.finished = !0, k.emit("finish"), B.autoDestroy))) {
      var G = k._readableState;
      (!G || G.autoDestroy && G.endEmitted) && k.destroy();
    }
    return M;
  }
  function Q(k, B, M) {
    B.ending = !0, U(k, B), M && (B.finished ? process.nextTick(M) : k.once("finish", M)), B.ended = !0, k.writable = !1;
  }
  function X(k, B, M) {
    var G = k.entry;
    for (k.entry = null; G; ) {
      var V = G.callback;
      B.pendingcb--, V(M), G = G.next;
    }
    B.corkedRequestsFree.next = k;
  }
  return Object.defineProperty(x.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(B) {
      this._writableState && (this._writableState.destroyed = B);
    }
  }), x.prototype.destroy = c.destroy, x.prototype._undestroy = c.undestroy, x.prototype._destroy = function(k, B) {
    B(k);
  }, Dt;
}
var vt, kr;
function be() {
  if (kr) return vt;
  kr = 1;
  var n = Object.keys || function(m) {
    var v = [];
    for (var b in m) v.push(b);
    return v;
  };
  vt = r;
  var t = pi(), _ = vi();
  ye()(r, t);
  for (var g = n(_.prototype), p = 0; p < g.length; p++) {
    var i = g[p];
    r.prototype[i] || (r.prototype[i] = _.prototype[i]);
  }
  function r(m) {
    if (!(this instanceof r)) return new r(m);
    t.call(this, m), _.call(this, m), this.allowHalfOpen = !0, m && (m.readable === !1 && (this.readable = !1), m.writable === !1 && (this.writable = !1), m.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", s)));
  }
  Object.defineProperty(r.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(r.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(r.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function s() {
    this._writableState.ended || process.nextTick(c, this);
  }
  function c(m) {
    m.end();
  }
  return Object.defineProperty(r.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(v) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = v, this._writableState.destroyed = v);
    }
  }), vt;
}
var pt = {}, Pe = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Nr;
function na() {
  return Nr || (Nr = 1, (function(n, t) {
    var _ = Ke, g = _.Buffer;
    function p(r, s) {
      for (var c in r)
        s[c] = r[c];
    }
    g.from && g.alloc && g.allocUnsafe && g.allocUnsafeSlow ? n.exports = _ : (p(_, t), t.Buffer = i);
    function i(r, s, c) {
      return g(r, s, c);
    }
    i.prototype = Object.create(g.prototype), p(g, i), i.from = function(r, s, c) {
      if (typeof r == "number")
        throw new TypeError("Argument must not be a number");
      return g(r, s, c);
    }, i.alloc = function(r, s, c) {
      if (typeof r != "number")
        throw new TypeError("Argument must be a number");
      var m = g(r);
      return s !== void 0 ? typeof c == "string" ? m.fill(s, c) : m.fill(s) : m.fill(0), m;
    }, i.allocUnsafe = function(r) {
      if (typeof r != "number")
        throw new TypeError("Argument must be a number");
      return g(r);
    }, i.allocUnsafeSlow = function(r) {
      if (typeof r != "number")
        throw new TypeError("Argument must be a number");
      return _.SlowBuffer(r);
    };
  })(Pe, Pe.exports)), Pe.exports;
}
var Ir;
function Lr() {
  if (Ir) return pt;
  Ir = 1;
  var n = na().Buffer, t = n.isEncoding || function(e) {
    switch (e = "" + e, e && e.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1;
    }
  };
  function _(e) {
    if (!e) return "utf8";
    for (var l; ; )
      switch (e) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return e;
        default:
          if (l) return;
          e = ("" + e).toLowerCase(), l = !0;
      }
  }
  function g(e) {
    var l = _(e);
    if (typeof l != "string" && (n.isEncoding === t || !t(e))) throw new Error("Unknown encoding: " + e);
    return l || e;
  }
  pt.StringDecoder = p;
  function p(e) {
    this.encoding = g(e);
    var l;
    switch (this.encoding) {
      case "utf16le":
        this.text = b, this.end = f, l = 4;
        break;
      case "utf8":
        this.fillLast = c, l = 4;
        break;
      case "base64":
        this.text = C, this.end = E, l = 3;
        break;
      default:
        this.write = a, this.end = d;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(l);
  }
  p.prototype.write = function(e) {
    if (e.length === 0) return "";
    var l, S;
    if (this.lastNeed) {
      if (l = this.fillLast(e), l === void 0) return "";
      S = this.lastNeed, this.lastNeed = 0;
    } else
      S = 0;
    return S < e.length ? l ? l + this.text(e, S) : this.text(e, S) : l || "";
  }, p.prototype.end = v, p.prototype.text = m, p.prototype.fillLast = function(e) {
    if (this.lastNeed <= e.length)
      return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
  };
  function i(e) {
    return e <= 127 ? 0 : e >> 5 === 6 ? 2 : e >> 4 === 14 ? 3 : e >> 3 === 30 ? 4 : e >> 6 === 2 ? -1 : -2;
  }
  function r(e, l, S) {
    var u = l.length - 1;
    if (u < S) return 0;
    var o = i(l[u]);
    return o >= 0 ? (o > 0 && (e.lastNeed = o - 1), o) : --u < S || o === -2 ? 0 : (o = i(l[u]), o >= 0 ? (o > 0 && (e.lastNeed = o - 2), o) : --u < S || o === -2 ? 0 : (o = i(l[u]), o >= 0 ? (o > 0 && (o === 2 ? o = 0 : e.lastNeed = o - 3), o) : 0));
  }
  function s(e, l, S) {
    if ((l[0] & 192) !== 128)
      return e.lastNeed = 0, "�";
    if (e.lastNeed > 1 && l.length > 1) {
      if ((l[1] & 192) !== 128)
        return e.lastNeed = 1, "�";
      if (e.lastNeed > 2 && l.length > 2 && (l[2] & 192) !== 128)
        return e.lastNeed = 2, "�";
    }
  }
  function c(e) {
    var l = this.lastTotal - this.lastNeed, S = s(this, e);
    if (S !== void 0) return S;
    if (this.lastNeed <= e.length)
      return e.copy(this.lastChar, l, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    e.copy(this.lastChar, l, 0, e.length), this.lastNeed -= e.length;
  }
  function m(e, l) {
    var S = r(this, e, l);
    if (!this.lastNeed) return e.toString("utf8", l);
    this.lastTotal = S;
    var u = e.length - (S - this.lastNeed);
    return e.copy(this.lastChar, 0, u), e.toString("utf8", l, u);
  }
  function v(e) {
    var l = e && e.length ? this.write(e) : "";
    return this.lastNeed ? l + "�" : l;
  }
  function b(e, l) {
    if ((e.length - l) % 2 === 0) {
      var S = e.toString("utf16le", l);
      if (S) {
        var u = S.charCodeAt(S.length - 1);
        if (u >= 55296 && u <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], S.slice(0, -1);
      }
      return S;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", l, e.length - 1);
  }
  function f(e) {
    var l = e && e.length ? this.write(e) : "";
    if (this.lastNeed) {
      var S = this.lastTotal - this.lastNeed;
      return l + this.lastChar.toString("utf16le", 0, S);
    }
    return l;
  }
  function C(e, l) {
    var S = (e.length - l) % 3;
    return S === 0 ? e.toString("base64", l) : (this.lastNeed = 3 - S, this.lastTotal = 3, S === 1 ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", l, e.length - S));
  }
  function E(e) {
    var l = e && e.length ? this.write(e) : "";
    return this.lastNeed ? l + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : l;
  }
  function a(e) {
    return e.toString(this.encoding);
  }
  function d(e) {
    return e && e.length ? this.write(e) : "";
  }
  return pt;
}
var _t, Mr;
function dr() {
  if (Mr) return _t;
  Mr = 1;
  var n = he().codes.ERR_STREAM_PREMATURE_CLOSE;
  function t(i) {
    var r = !1;
    return function() {
      if (!r) {
        r = !0;
        for (var s = arguments.length, c = new Array(s), m = 0; m < s; m++)
          c[m] = arguments[m];
        i.apply(this, c);
      }
    };
  }
  function _() {
  }
  function g(i) {
    return i.setHeader && typeof i.abort == "function";
  }
  function p(i, r, s) {
    if (typeof r == "function") return p(i, null, r);
    r || (r = {}), s = t(s || _);
    var c = r.readable || r.readable !== !1 && i.readable, m = r.writable || r.writable !== !1 && i.writable, v = function() {
      i.writable || f();
    }, b = i._writableState && i._writableState.finished, f = function() {
      m = !1, b = !0, c || s.call(i);
    }, C = i._readableState && i._readableState.endEmitted, E = function() {
      c = !1, C = !0, m || s.call(i);
    }, a = function(S) {
      s.call(i, S);
    }, d = function() {
      var S;
      if (c && !C)
        return (!i._readableState || !i._readableState.ended) && (S = new n()), s.call(i, S);
      if (m && !b)
        return (!i._writableState || !i._writableState.ended) && (S = new n()), s.call(i, S);
    }, e = function() {
      i.req.on("finish", f);
    };
    return g(i) ? (i.on("complete", f), i.on("abort", d), i.req ? e() : i.on("request", e)) : m && !i._writableState && (i.on("end", v), i.on("close", v)), i.on("end", E), i.on("finish", f), r.error !== !1 && i.on("error", a), i.on("close", d), function() {
      i.removeListener("complete", f), i.removeListener("abort", d), i.removeListener("request", e), i.req && i.req.removeListener("finish", f), i.removeListener("end", v), i.removeListener("close", v), i.removeListener("finish", f), i.removeListener("end", E), i.removeListener("error", a), i.removeListener("close", d);
    };
  }
  return _t = p, _t;
}
var bt, Pr;
function ia() {
  if (Pr) return bt;
  Pr = 1;
  var n;
  function t(S, u, o) {
    return u = _(u), u in S ? Object.defineProperty(S, u, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : S[u] = o, S;
  }
  function _(S) {
    var u = g(S, "string");
    return typeof u == "symbol" ? u : String(u);
  }
  function g(S, u) {
    if (typeof S != "object" || S === null) return S;
    var o = S[Symbol.toPrimitive];
    if (o !== void 0) {
      var D = o.call(S, u);
      if (typeof D != "object") return D;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (u === "string" ? String : Number)(S);
  }
  var p = dr(), i = Symbol("lastResolve"), r = Symbol("lastReject"), s = Symbol("error"), c = Symbol("ended"), m = Symbol("lastPromise"), v = Symbol("handlePromise"), b = Symbol("stream");
  function f(S, u) {
    return {
      value: S,
      done: u
    };
  }
  function C(S) {
    var u = S[i];
    if (u !== null) {
      var o = S[b].read();
      o !== null && (S[m] = null, S[i] = null, S[r] = null, u(f(o, !1)));
    }
  }
  function E(S) {
    process.nextTick(C, S);
  }
  function a(S, u) {
    return function(o, D) {
      S.then(function() {
        if (u[c]) {
          o(f(void 0, !0));
          return;
        }
        u[v](o, D);
      }, D);
    };
  }
  var d = Object.getPrototypeOf(function() {
  }), e = Object.setPrototypeOf((n = {
    get stream() {
      return this[b];
    },
    next: function() {
      var u = this, o = this[s];
      if (o !== null)
        return Promise.reject(o);
      if (this[c])
        return Promise.resolve(f(void 0, !0));
      if (this[b].destroyed)
        return new Promise(function(h, y) {
          process.nextTick(function() {
            u[s] ? y(u[s]) : h(f(void 0, !0));
          });
        });
      var D = this[m], R;
      if (D)
        R = new Promise(a(D, this));
      else {
        var x = this[b].read();
        if (x !== null)
          return Promise.resolve(f(x, !1));
        R = new Promise(this[v]);
      }
      return this[m] = R, R;
    }
  }, t(n, Symbol.asyncIterator, function() {
    return this;
  }), t(n, "return", function() {
    var u = this;
    return new Promise(function(o, D) {
      u[b].destroy(null, function(R) {
        if (R) {
          D(R);
          return;
        }
        o(f(void 0, !0));
      });
    });
  }), n), d), l = function(u) {
    var o, D = Object.create(e, (o = {}, t(o, b, {
      value: u,
      writable: !0
    }), t(o, i, {
      value: null,
      writable: !0
    }), t(o, r, {
      value: null,
      writable: !0
    }), t(o, s, {
      value: null,
      writable: !0
    }), t(o, c, {
      value: u._readableState.endEmitted,
      writable: !0
    }), t(o, v, {
      value: function(x, h) {
        var y = D[b].read();
        y ? (D[m] = null, D[i] = null, D[r] = null, x(f(y, !1))) : (D[i] = x, D[r] = h);
      },
      writable: !0
    }), o));
    return D[m] = null, p(u, function(R) {
      if (R && R.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var x = D[r];
        x !== null && (D[m] = null, D[i] = null, D[r] = null, x(R)), D[s] = R;
        return;
      }
      var h = D[i];
      h !== null && (D[m] = null, D[i] = null, D[r] = null, h(f(void 0, !0))), D[c] = !0;
    }), u.on("readable", E.bind(null, D)), D;
  };
  return bt = l, bt;
}
var gt, qr;
function aa() {
  if (qr) return gt;
  qr = 1;
  function n(m, v, b, f, C, E, a) {
    try {
      var d = m[E](a), e = d.value;
    } catch (l) {
      b(l);
      return;
    }
    d.done ? v(e) : Promise.resolve(e).then(f, C);
  }
  function t(m) {
    return function() {
      var v = this, b = arguments;
      return new Promise(function(f, C) {
        var E = m.apply(v, b);
        function a(e) {
          n(E, f, C, a, d, "next", e);
        }
        function d(e) {
          n(E, f, C, a, d, "throw", e);
        }
        a(void 0);
      });
    };
  }
  function _(m, v) {
    var b = Object.keys(m);
    if (Object.getOwnPropertySymbols) {
      var f = Object.getOwnPropertySymbols(m);
      v && (f = f.filter(function(C) {
        return Object.getOwnPropertyDescriptor(m, C).enumerable;
      })), b.push.apply(b, f);
    }
    return b;
  }
  function g(m) {
    for (var v = 1; v < arguments.length; v++) {
      var b = arguments[v] != null ? arguments[v] : {};
      v % 2 ? _(Object(b), !0).forEach(function(f) {
        p(m, f, b[f]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(m, Object.getOwnPropertyDescriptors(b)) : _(Object(b)).forEach(function(f) {
        Object.defineProperty(m, f, Object.getOwnPropertyDescriptor(b, f));
      });
    }
    return m;
  }
  function p(m, v, b) {
    return v = i(v), v in m ? Object.defineProperty(m, v, { value: b, enumerable: !0, configurable: !0, writable: !0 }) : m[v] = b, m;
  }
  function i(m) {
    var v = r(m, "string");
    return typeof v == "symbol" ? v : String(v);
  }
  function r(m, v) {
    if (typeof m != "object" || m === null) return m;
    var b = m[Symbol.toPrimitive];
    if (b !== void 0) {
      var f = b.call(m, v);
      if (typeof f != "object") return f;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (v === "string" ? String : Number)(m);
  }
  var s = he().codes.ERR_INVALID_ARG_TYPE;
  function c(m, v, b) {
    var f;
    if (v && typeof v.next == "function")
      f = v;
    else if (v && v[Symbol.asyncIterator]) f = v[Symbol.asyncIterator]();
    else if (v && v[Symbol.iterator]) f = v[Symbol.iterator]();
    else throw new s("iterable", ["Iterable"], v);
    var C = new m(g({
      objectMode: !0
    }, b)), E = !1;
    C._read = function() {
      E || (E = !0, a());
    };
    function a() {
      return d.apply(this, arguments);
    }
    function d() {
      return d = t(function* () {
        try {
          var e = yield f.next(), l = e.value, S = e.done;
          S ? C.push(null) : C.push(yield l) ? a() : E = !1;
        } catch (u) {
          C.destroy(u);
        }
      }), d.apply(this, arguments);
    }
    return C;
  }
  return gt = c, gt;
}
var mt, jr;
function pi() {
  if (jr) return mt;
  jr = 1, mt = h;
  var n;
  h.ReadableState = x, ge.EventEmitter;
  var t = function(F, I) {
    return F.listeners(I).length;
  }, _ = di(), g = Ke.Buffer, p = (typeof ne < "u" ? ne : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function i(w) {
    return g.from(w);
  }
  function r(w) {
    return g.isBuffer(w) || w instanceof p;
  }
  var s = ue, c;
  s && s.debuglog ? c = s.debuglog("stream") : c = function() {
  };
  var m = ea(), v = hi(), b = Di(), f = b.getHighWaterMark, C = he().codes, E = C.ERR_INVALID_ARG_TYPE, a = C.ERR_STREAM_PUSH_AFTER_EOF, d = C.ERR_METHOD_NOT_IMPLEMENTED, e = C.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, l, S, u;
  ye()(h, _);
  var o = v.errorOrDestroy, D = ["error", "close", "destroy", "pause", "resume"];
  function R(w, F, I) {
    if (typeof w.prependListener == "function") return w.prependListener(F, I);
    !w._events || !w._events[F] ? w.on(F, I) : Array.isArray(w._events[F]) ? w._events[F].unshift(I) : w._events[F] = [I, w._events[F]];
  }
  function x(w, F, I) {
    n = n || be(), w = w || {}, typeof I != "boolean" && (I = F instanceof n), this.objectMode = !!w.objectMode, I && (this.objectMode = this.objectMode || !!w.readableObjectMode), this.highWaterMark = f(this, w, "readableHighWaterMark", I), this.buffer = new m(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = w.emitClose !== !1, this.autoDestroy = !!w.autoDestroy, this.destroyed = !1, this.defaultEncoding = w.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, w.encoding && (l || (l = Lr().StringDecoder), this.decoder = new l(w.encoding), this.encoding = w.encoding);
  }
  function h(w) {
    if (n = n || be(), !(this instanceof h)) return new h(w);
    var F = this instanceof n;
    this._readableState = new x(w, this, F), this.readable = !0, w && (typeof w.read == "function" && (this._read = w.read), typeof w.destroy == "function" && (this._destroy = w.destroy)), _.call(this);
  }
  Object.defineProperty(h.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(F) {
      this._readableState && (this._readableState.destroyed = F);
    }
  }), h.prototype.destroy = v.destroy, h.prototype._undestroy = v.undestroy, h.prototype._destroy = function(w, F) {
    F(w);
  }, h.prototype.push = function(w, F) {
    var I = this._readableState, j;
    return I.objectMode ? j = !0 : typeof w == "string" && (F = F || I.defaultEncoding, F !== I.encoding && (w = g.from(w, F), F = ""), j = !0), y(this, w, F, !1, j);
  }, h.prototype.unshift = function(w) {
    return y(this, w, null, !0, !1);
  };
  function y(w, F, I, j, J) {
    c("readableAddChunk", F);
    var z = w._readableState;
    if (F === null)
      z.reading = !1, H(w, z);
    else {
      var Z;
      if (J || (Z = T(z, F)), Z)
        o(w, Z);
      else if (z.objectMode || F && F.length > 0)
        if (typeof F != "string" && !z.objectMode && Object.getPrototypeOf(F) !== g.prototype && (F = i(F)), j)
          z.endEmitted ? o(w, new e()) : A(w, z, F, !0);
        else if (z.ended)
          o(w, new a());
        else {
          if (z.destroyed)
            return !1;
          z.reading = !1, z.decoder && !I ? (F = z.decoder.write(F), z.objectMode || F.length !== 0 ? A(w, z, F, !1) : $(w, z)) : A(w, z, F, !1);
        }
      else j || (z.reading = !1, $(w, z));
    }
    return !z.ended && (z.length < z.highWaterMark || z.length === 0);
  }
  function A(w, F, I, j) {
    F.flowing && F.length === 0 && !F.sync ? (F.awaitDrain = 0, w.emit("data", I)) : (F.length += F.objectMode ? 1 : I.length, j ? F.buffer.unshift(I) : F.buffer.push(I), F.needReadable && q(w)), $(w, F);
  }
  function T(w, F) {
    var I;
    return !r(F) && typeof F != "string" && F !== void 0 && !w.objectMode && (I = new E("chunk", ["string", "Buffer", "Uint8Array"], F)), I;
  }
  h.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, h.prototype.setEncoding = function(w) {
    l || (l = Lr().StringDecoder);
    var F = new l(w);
    this._readableState.decoder = F, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var I = this._readableState.buffer.head, j = ""; I !== null; )
      j += F.write(I.data), I = I.next;
    return this._readableState.buffer.clear(), j !== "" && this._readableState.buffer.push(j), this._readableState.length = j.length, this;
  };
  var O = 1073741824;
  function L(w) {
    return w >= O ? w = O : (w--, w |= w >>> 1, w |= w >>> 2, w |= w >>> 4, w |= w >>> 8, w |= w >>> 16, w++), w;
  }
  function W(w, F) {
    return w <= 0 || F.length === 0 && F.ended ? 0 : F.objectMode ? 1 : w !== w ? F.flowing && F.length ? F.buffer.head.data.length : F.length : (w > F.highWaterMark && (F.highWaterMark = L(w)), w <= F.length ? w : F.ended ? F.length : (F.needReadable = !0, 0));
  }
  h.prototype.read = function(w) {
    c("read", w), w = parseInt(w, 10);
    var F = this._readableState, I = w;
    if (w !== 0 && (F.emittedReadable = !1), w === 0 && F.needReadable && ((F.highWaterMark !== 0 ? F.length >= F.highWaterMark : F.length > 0) || F.ended))
      return c("read: emitReadable", F.length, F.ended), F.length === 0 && F.ended ? M(this) : q(this), null;
    if (w = W(w, F), w === 0 && F.ended)
      return F.length === 0 && M(this), null;
    var j = F.needReadable;
    c("need readable", j), (F.length === 0 || F.length - w < F.highWaterMark) && (j = !0, c("length less than watermark", j)), F.ended || F.reading ? (j = !1, c("reading or ended", j)) : j && (c("do read"), F.reading = !0, F.sync = !0, F.length === 0 && (F.needReadable = !0), this._read(F.highWaterMark), F.sync = !1, F.reading || (w = W(I, F)));
    var J;
    return w > 0 ? J = B(w, F) : J = null, J === null ? (F.needReadable = F.length <= F.highWaterMark, w = 0) : (F.length -= w, F.awaitDrain = 0), F.length === 0 && (F.ended || (F.needReadable = !0), I !== w && F.ended && M(this)), J !== null && this.emit("data", J), J;
  };
  function H(w, F) {
    if (c("onEofChunk"), !F.ended) {
      if (F.decoder) {
        var I = F.decoder.end();
        I && I.length && (F.buffer.push(I), F.length += F.objectMode ? 1 : I.length);
      }
      F.ended = !0, F.sync ? q(w) : (F.needReadable = !1, F.emittedReadable || (F.emittedReadable = !0, P(w)));
    }
  }
  function q(w) {
    var F = w._readableState;
    c("emitReadable", F.needReadable, F.emittedReadable), F.needReadable = !1, F.emittedReadable || (c("emitReadable", F.flowing), F.emittedReadable = !0, process.nextTick(P, w));
  }
  function P(w) {
    var F = w._readableState;
    c("emitReadable_", F.destroyed, F.length, F.ended), !F.destroyed && (F.length || F.ended) && (w.emit("readable"), F.emittedReadable = !1), F.needReadable = !F.flowing && !F.ended && F.length <= F.highWaterMark, k(w);
  }
  function $(w, F) {
    F.readingMore || (F.readingMore = !0, process.nextTick(K, w, F));
  }
  function K(w, F) {
    for (; !F.reading && !F.ended && (F.length < F.highWaterMark || F.flowing && F.length === 0); ) {
      var I = F.length;
      if (c("maybeReadMore read 0"), w.read(0), I === F.length)
        break;
    }
    F.readingMore = !1;
  }
  h.prototype._read = function(w) {
    o(this, new d("_read()"));
  }, h.prototype.pipe = function(w, F) {
    var I = this, j = this._readableState;
    switch (j.pipesCount) {
      case 0:
        j.pipes = w;
        break;
      case 1:
        j.pipes = [j.pipes, w];
        break;
      default:
        j.pipes.push(w);
        break;
    }
    j.pipesCount += 1, c("pipe count=%d opts=%j", j.pipesCount, F);
    var J = (!F || F.end !== !1) && w !== process.stdout && w !== process.stderr, z = J ? re : le;
    j.endEmitted ? process.nextTick(z) : I.once("end", z), w.on("unpipe", Z);
    function Z(ae, _e) {
      c("onunpipe"), ae === I && _e && _e.hasUnpiped === !1 && (_e.hasUnpiped = !0, Te());
    }
    function re() {
      c("onend"), w.end();
    }
    var De = Y(I);
    w.on("drain", De);
    var ve = !1;
    function Te() {
      c("cleanup"), w.removeListener("close", ce), w.removeListener("finish", pe), w.removeListener("drain", De), w.removeListener("error", Ee), w.removeListener("unpipe", Z), I.removeListener("end", re), I.removeListener("end", le), I.removeListener("data", Oe), ve = !0, j.awaitDrain && (!w._writableState || w._writableState.needDrain) && De();
    }
    I.on("data", Oe);
    function Oe(ae) {
      c("ondata");
      var _e = w.write(ae);
      c("dest.write", _e), _e === !1 && ((j.pipesCount === 1 && j.pipes === w || j.pipesCount > 1 && V(j.pipes, w) !== -1) && !ve && (c("false write response, pause", j.awaitDrain), j.awaitDrain++), I.pause());
    }
    function Ee(ae) {
      c("onerror", ae), le(), w.removeListener("error", Ee), t(w, "error") === 0 && o(w, ae);
    }
    R(w, "error", Ee);
    function ce() {
      w.removeListener("finish", pe), le();
    }
    w.once("close", ce);
    function pe() {
      c("onfinish"), w.removeListener("close", ce), le();
    }
    w.once("finish", pe);
    function le() {
      c("unpipe"), I.unpipe(w);
    }
    return w.emit("pipe", I), j.flowing || (c("pipe resume"), I.resume()), w;
  };
  function Y(w) {
    return function() {
      var I = w._readableState;
      c("pipeOnDrain", I.awaitDrain), I.awaitDrain && I.awaitDrain--, I.awaitDrain === 0 && t(w, "data") && (I.flowing = !0, k(w));
    };
  }
  h.prototype.unpipe = function(w) {
    var F = this._readableState, I = {
      hasUnpiped: !1
    };
    if (F.pipesCount === 0) return this;
    if (F.pipesCount === 1)
      return w && w !== F.pipes ? this : (w || (w = F.pipes), F.pipes = null, F.pipesCount = 0, F.flowing = !1, w && w.emit("unpipe", this, I), this);
    if (!w) {
      var j = F.pipes, J = F.pipesCount;
      F.pipes = null, F.pipesCount = 0, F.flowing = !1;
      for (var z = 0; z < J; z++) j[z].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var Z = V(F.pipes, w);
    return Z === -1 ? this : (F.pipes.splice(Z, 1), F.pipesCount -= 1, F.pipesCount === 1 && (F.pipes = F.pipes[0]), w.emit("unpipe", this, I), this);
  }, h.prototype.on = function(w, F) {
    var I = _.prototype.on.call(this, w, F), j = this._readableState;
    return w === "data" ? (j.readableListening = this.listenerCount("readable") > 0, j.flowing !== !1 && this.resume()) : w === "readable" && !j.endEmitted && !j.readableListening && (j.readableListening = j.needReadable = !0, j.flowing = !1, j.emittedReadable = !1, c("on readable", j.length, j.reading), j.length ? q(this) : j.reading || process.nextTick(U, this)), I;
  }, h.prototype.addListener = h.prototype.on, h.prototype.removeListener = function(w, F) {
    var I = _.prototype.removeListener.call(this, w, F);
    return w === "readable" && process.nextTick(N, this), I;
  }, h.prototype.removeAllListeners = function(w) {
    var F = _.prototype.removeAllListeners.apply(this, arguments);
    return (w === "readable" || w === void 0) && process.nextTick(N, this), F;
  };
  function N(w) {
    var F = w._readableState;
    F.readableListening = w.listenerCount("readable") > 0, F.resumeScheduled && !F.paused ? F.flowing = !0 : w.listenerCount("data") > 0 && w.resume();
  }
  function U(w) {
    c("readable nexttick read 0"), w.read(0);
  }
  h.prototype.resume = function() {
    var w = this._readableState;
    return w.flowing || (c("resume"), w.flowing = !w.readableListening, Q(this, w)), w.paused = !1, this;
  };
  function Q(w, F) {
    F.resumeScheduled || (F.resumeScheduled = !0, process.nextTick(X, w, F));
  }
  function X(w, F) {
    c("resume", F.reading), F.reading || w.read(0), F.resumeScheduled = !1, w.emit("resume"), k(w), F.flowing && !F.reading && w.read(0);
  }
  h.prototype.pause = function() {
    return c("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (c("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function k(w) {
    var F = w._readableState;
    for (c("flow", F.flowing); F.flowing && w.read() !== null; ) ;
  }
  h.prototype.wrap = function(w) {
    var F = this, I = this._readableState, j = !1;
    w.on("end", function() {
      if (c("wrapped end"), I.decoder && !I.ended) {
        var Z = I.decoder.end();
        Z && Z.length && F.push(Z);
      }
      F.push(null);
    }), w.on("data", function(Z) {
      if (c("wrapped data"), I.decoder && (Z = I.decoder.write(Z)), !(I.objectMode && Z == null) && !(!I.objectMode && (!Z || !Z.length))) {
        var re = F.push(Z);
        re || (j = !0, w.pause());
      }
    });
    for (var J in w)
      this[J] === void 0 && typeof w[J] == "function" && (this[J] = /* @__PURE__ */ (function(re) {
        return function() {
          return w[re].apply(w, arguments);
        };
      })(J));
    for (var z = 0; z < D.length; z++)
      w.on(D[z], this.emit.bind(this, D[z]));
    return this._read = function(Z) {
      c("wrapped _read", Z), j && (j = !1, w.resume());
    }, this;
  }, typeof Symbol == "function" && (h.prototype[Symbol.asyncIterator] = function() {
    return S === void 0 && (S = ia()), S(this);
  }), Object.defineProperty(h.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(h.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(h.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(F) {
      this._readableState && (this._readableState.flowing = F);
    }
  }), h._fromList = B, Object.defineProperty(h.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function B(w, F) {
    if (F.length === 0) return null;
    var I;
    return F.objectMode ? I = F.buffer.shift() : !w || w >= F.length ? (F.decoder ? I = F.buffer.join("") : F.buffer.length === 1 ? I = F.buffer.first() : I = F.buffer.concat(F.length), F.buffer.clear()) : I = F.buffer.consume(w, F.decoder), I;
  }
  function M(w) {
    var F = w._readableState;
    c("endReadable", F.endEmitted), F.endEmitted || (F.ended = !0, process.nextTick(G, F, w));
  }
  function G(w, F) {
    if (c("endReadableNT", w.endEmitted, w.length), !w.endEmitted && w.length === 0 && (w.endEmitted = !0, F.readable = !1, F.emit("end"), w.autoDestroy)) {
      var I = F._writableState;
      (!I || I.autoDestroy && I.finished) && F.destroy();
    }
  }
  typeof Symbol == "function" && (h.from = function(w, F) {
    return u === void 0 && (u = aa()), u(h, w, F);
  });
  function V(w, F) {
    for (var I = 0, j = w.length; I < j; I++)
      if (w[I] === F) return I;
    return -1;
  }
  return mt;
}
var yt, Wr;
function _i() {
  if (Wr) return yt;
  Wr = 1, yt = s;
  var n = he().codes, t = n.ERR_METHOD_NOT_IMPLEMENTED, _ = n.ERR_MULTIPLE_CALLBACK, g = n.ERR_TRANSFORM_ALREADY_TRANSFORMING, p = n.ERR_TRANSFORM_WITH_LENGTH_0, i = be();
  ye()(s, i);
  function r(v, b) {
    var f = this._transformState;
    f.transforming = !1;
    var C = f.writecb;
    if (C === null)
      return this.emit("error", new _());
    f.writechunk = null, f.writecb = null, b != null && this.push(b), C(v);
    var E = this._readableState;
    E.reading = !1, (E.needReadable || E.length < E.highWaterMark) && this._read(E.highWaterMark);
  }
  function s(v) {
    if (!(this instanceof s)) return new s(v);
    i.call(this, v), this._transformState = {
      afterTransform: r.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, v && (typeof v.transform == "function" && (this._transform = v.transform), typeof v.flush == "function" && (this._flush = v.flush)), this.on("prefinish", c);
  }
  function c() {
    var v = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(b, f) {
      m(v, b, f);
    }) : m(this, null, null);
  }
  s.prototype.push = function(v, b) {
    return this._transformState.needTransform = !1, i.prototype.push.call(this, v, b);
  }, s.prototype._transform = function(v, b, f) {
    f(new t("_transform()"));
  }, s.prototype._write = function(v, b, f) {
    var C = this._transformState;
    if (C.writecb = f, C.writechunk = v, C.writeencoding = b, !C.transforming) {
      var E = this._readableState;
      (C.needTransform || E.needReadable || E.length < E.highWaterMark) && this._read(E.highWaterMark);
    }
  }, s.prototype._read = function(v) {
    var b = this._transformState;
    b.writechunk !== null && !b.transforming ? (b.transforming = !0, this._transform(b.writechunk, b.writeencoding, b.afterTransform)) : b.needTransform = !0;
  }, s.prototype._destroy = function(v, b) {
    i.prototype._destroy.call(this, v, function(f) {
      b(f);
    });
  };
  function m(v, b, f) {
    if (b) return v.emit("error", b);
    if (f != null && v.push(f), v._writableState.length) throw new p();
    if (v._transformState.transforming) throw new g();
    return v.push(null);
  }
  return yt;
}
var Et, Gr;
function ua() {
  if (Gr) return Et;
  Gr = 1, Et = t;
  var n = _i();
  ye()(t, n);
  function t(_) {
    if (!(this instanceof t)) return new t(_);
    n.call(this, _);
  }
  return t.prototype._transform = function(_, g, p) {
    p(null, _);
  }, Et;
}
var wt, Ur;
function oa() {
  if (Ur) return wt;
  Ur = 1;
  var n;
  function t(f) {
    var C = !1;
    return function() {
      C || (C = !0, f.apply(void 0, arguments));
    };
  }
  var _ = he().codes, g = _.ERR_MISSING_ARGS, p = _.ERR_STREAM_DESTROYED;
  function i(f) {
    if (f) throw f;
  }
  function r(f) {
    return f.setHeader && typeof f.abort == "function";
  }
  function s(f, C, E, a) {
    a = t(a);
    var d = !1;
    f.on("close", function() {
      d = !0;
    }), n === void 0 && (n = dr()), n(f, {
      readable: C,
      writable: E
    }, function(l) {
      if (l) return a(l);
      d = !0, a();
    });
    var e = !1;
    return function(l) {
      if (!d && !e) {
        if (e = !0, r(f)) return f.abort();
        if (typeof f.destroy == "function") return f.destroy();
        a(l || new p("pipe"));
      }
    };
  }
  function c(f) {
    f();
  }
  function m(f, C) {
    return f.pipe(C);
  }
  function v(f) {
    return !f.length || typeof f[f.length - 1] != "function" ? i : f.pop();
  }
  function b() {
    for (var f = arguments.length, C = new Array(f), E = 0; E < f; E++)
      C[E] = arguments[E];
    var a = v(C);
    if (Array.isArray(C[0]) && (C = C[0]), C.length < 2)
      throw new g("streams");
    var d, e = C.map(function(l, S) {
      var u = S < C.length - 1, o = S > 0;
      return s(l, u, o, function(D) {
        d || (d = D), D && e.forEach(c), !u && (e.forEach(c), a(d));
      });
    });
    return C.reduce(m);
  }
  return wt = b, wt;
}
var $r;
function sa() {
  return $r || ($r = 1, (function(n, t) {
    var _ = fr;
    process.env.READABLE_STREAM === "disable" && _ ? (n.exports = _.Readable, Object.assign(n.exports, _), n.exports.Stream = _) : (t = n.exports = pi(), t.Stream = _ || t, t.Readable = t, t.Writable = vi(), t.Duplex = be(), t.Transform = _i(), t.PassThrough = ua(), t.finished = dr(), t.pipeline = oa());
  })(Ie, Ie.exports)), Ie.exports;
}
var Ft, Hr;
function la() {
  if (Hr) return Ft;
  Hr = 1, Ft = n;
  function n(t, _) {
    if (!(this instanceof n)) return new n(t, _);
    this.proto = t, this.target = _, this.methods = [], this.getters = [], this.setters = [], this.fluents = [];
  }
  return n.prototype.method = function(t) {
    var _ = this.proto, g = this.target;
    return this.methods.push(t), _[t] = function() {
      return this[g][t].apply(this[g], arguments);
    }, this;
  }, n.prototype.access = function(t) {
    return this.getter(t).setter(t);
  }, n.prototype.getter = function(t) {
    var _ = this.proto, g = this.target;
    return this.getters.push(t), _.__defineGetter__(t, function() {
      return this[g][t];
    }), this;
  }, n.prototype.setter = function(t) {
    var _ = this.proto, g = this.target;
    return this.setters.push(t), _.__defineSetter__(t, function(p) {
      return this[g][t] = p;
    }), this;
  }, n.prototype.fluent = function(t) {
    var _ = this.proto, g = this.target;
    return this.fluents.push(t), _[t] = function(p) {
      return typeof p < "u" ? (this[g][t] = p, this) : this[g][t];
    }, this;
  }, Ft;
}
var Vr;
function bi() {
  if (Vr) return ot.exports;
  Vr = 1;
  var n = ue, t = sa(), _ = la(), g = cr(), p = ot.exports = function(r, s, c) {
    t.Transform.call(this, c), this.tracker = new g(r, s), this.name = r, this.id = this.tracker.id, this.tracker.on("change", i(this));
  };
  n.inherits(p, t.Transform);
  function i(r) {
    return function(s, c, m) {
      r.emit("change", s, c, r);
    };
  }
  return p.prototype._transform = function(r, s, c) {
    this.tracker.completeWork(r.length ? r.length : 1), this.push(r), c();
  }, p.prototype._flush = function(r) {
    this.tracker.finish(), r();
  }, _(p.prototype, "tracker").method("completed").method("addWork").method("finish"), ot.exports;
}
var Yr;
function fa() {
  if (Yr) return it.exports;
  Yr = 1;
  var n = ue, t = ci(), _ = cr(), g = bi(), p = it.exports = function(s) {
    t.call(this, s), this.parentGroup = null, this.trackers = [], this.completion = {}, this.weight = {}, this.totalWeight = 0, this.finished = !1, this.bubbleChange = i(this);
  };
  n.inherits(p, t);
  function i(s) {
    return function(c, m, v) {
      s.completion[v.id] = m, !s.finished && s.emit("change", c || s.name, s.completed(), s);
    };
  }
  p.prototype.nameInTree = function() {
    for (var s = [], c = this; c; )
      s.unshift(c.name), c = c.parentGroup;
    return s.join("/");
  }, p.prototype.addUnit = function(s, c) {
    if (s.addUnit) {
      for (var m = this; m; ) {
        if (s === m)
          throw new Error(
            "Attempted to add tracker group " + s.name + " to tree that already includes it " + this.nameInTree(this)
          );
        m = m.parentGroup;
      }
      s.parentGroup = this;
    }
    return this.weight[s.id] = c || 1, this.totalWeight += this.weight[s.id], this.trackers.push(s), this.completion[s.id] = s.completed(), s.on("change", this.bubbleChange), this.finished || this.emit("change", s.name, this.completion[s.id], s), s;
  }, p.prototype.completed = function() {
    if (this.trackers.length === 0)
      return 0;
    for (var s = 1 / this.totalWeight, c = 0, m = 0; m < this.trackers.length; m++) {
      var v = this.trackers[m].id;
      c += s * this.weight[v] * this.completion[v];
    }
    return c;
  }, p.prototype.newGroup = function(s, c) {
    return this.addUnit(new p(s), c);
  }, p.prototype.newItem = function(s, c, m) {
    return this.addUnit(new _(s, c), m);
  }, p.prototype.newStream = function(s, c, m) {
    return this.addUnit(new g(s, c), m);
  }, p.prototype.finish = function() {
    this.finished = !0, this.trackers.length || this.addUnit(new _(), 1, !0);
    for (var s = 0; s < this.trackers.length; s++) {
      var c = this.trackers[s];
      c.finish(), c.removeListener("change", this.bubbleChange);
    }
    this.emit("change", this.name, 1, this);
  };
  var r = "                                  ";
  return p.prototype.debug = function(s) {
    s = s || 0;
    var c = s ? r.substr(0, s) : "", m = c + (this.name || "top") + ": " + this.completed() + `
`;
    return this.trackers.forEach(function(v) {
      v instanceof p ? m += v.debug(s + 1) : m += c + " " + v.name + ": " + v.completed() + `
`;
    }), m;
  }, it.exports;
}
var zr;
function ca() {
  return zr || (zr = 1, we.TrackerGroup = fa(), we.Tracker = cr(), we.TrackerStream = bi()), we;
}
var Ct = { exports: {} }, ee = {}, Kr;
function hr() {
  if (Kr) return ee;
  Kr = 1;
  var n = "\x1B[";
  ee.up = function(p) {
    return n + (p || "") + "A";
  }, ee.down = function(p) {
    return n + (p || "") + "B";
  }, ee.forward = function(p) {
    return n + (p || "") + "C";
  }, ee.back = function(p) {
    return n + (p || "") + "D";
  }, ee.nextLine = function(p) {
    return n + (p || "") + "E";
  }, ee.previousLine = function(p) {
    return n + (p || "") + "F";
  }, ee.horizontalAbsolute = function(p) {
    if (p == null) throw new Error("horizontalAboslute requires a column to position to");
    return n + p + "G";
  }, ee.eraseData = function() {
    return n + "J";
  }, ee.eraseLine = function() {
    return n + "K";
  }, ee.goto = function(g, p) {
    return n + p + ";" + g + "H";
  }, ee.gotoSOL = function() {
    return "\r";
  }, ee.beep = function() {
    return "\x07";
  }, ee.hideCursor = function() {
    return n + "?25l";
  }, ee.showCursor = function() {
    return n + "?25h";
  };
  var t = {
    reset: 0,
    // styles
    bold: 1,
    italic: 3,
    underline: 4,
    inverse: 7,
    // resets
    stopBold: 22,
    stopItalic: 23,
    stopUnderline: 24,
    stopInverse: 27,
    // colors
    white: 37,
    black: 30,
    blue: 34,
    cyan: 36,
    green: 32,
    magenta: 35,
    red: 31,
    yellow: 33,
    bgWhite: 47,
    bgBlack: 40,
    bgBlue: 44,
    bgCyan: 46,
    bgGreen: 42,
    bgMagenta: 45,
    bgRed: 41,
    bgYellow: 43,
    grey: 90,
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97,
    bgGrey: 100,
    bgBrightBlack: 100,
    bgBrightRed: 101,
    bgBrightGreen: 102,
    bgBrightYellow: 103,
    bgBrightBlue: 104,
    bgBrightMagenta: 105,
    bgBrightCyan: 106,
    bgBrightWhite: 107
  };
  ee.color = function(p) {
    return (arguments.length !== 1 || !Array.isArray(p)) && (p = Array.prototype.slice.call(arguments)), n + p.map(_).join(";") + "m";
  };
  function _(g) {
    if (t[g] != null) return t[g];
    throw new Error("Unknown color or style name: " + g);
  }
  return ee;
}
var St = { exports: {} }, Fe = {}, qe = { exports: {} }, Rt, Qr;
function da() {
  return Qr || (Qr = 1, Rt = ({ onlyFirst: n = !1 } = {}) => {
    const t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(t, n ? void 0 : "g");
  }), Rt;
}
var At, Zr;
function gi() {
  if (Zr) return At;
  Zr = 1;
  const n = da();
  return At = (t) => typeof t == "string" ? t.replace(n(), "") : t, At;
}
var je = { exports: {} }, Jr;
function ha() {
  if (Jr) return je.exports;
  Jr = 1;
  const n = (t) => Number.isNaN(t) ? !1 : t >= 4352 && (t <= 4447 || // Hangul Jamo
  t === 9001 || // LEFT-POINTING ANGLE BRACKET
  t === 9002 || // RIGHT-POINTING ANGLE BRACKET
  // CJK Radicals Supplement .. Enclosed CJK Letters and Months
  11904 <= t && t <= 12871 && t !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
  12880 <= t && t <= 19903 || // CJK Unified Ideographs .. Yi Radicals
  19968 <= t && t <= 42182 || // Hangul Jamo Extended-A
  43360 <= t && t <= 43388 || // Hangul Syllables
  44032 <= t && t <= 55203 || // CJK Compatibility Ideographs
  63744 <= t && t <= 64255 || // Vertical Forms
  65040 <= t && t <= 65049 || // CJK Compatibility Forms .. Small Form Variants
  65072 <= t && t <= 65131 || // Halfwidth and Fullwidth Forms
  65281 <= t && t <= 65376 || 65504 <= t && t <= 65510 || // Kana Supplement
  110592 <= t && t <= 110593 || // Enclosed Ideographic Supplement
  127488 <= t && t <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
  131072 <= t && t <= 262141);
  return je.exports = n, je.exports.default = n, je.exports;
}
var xt, Xr;
function Da() {
  return Xr || (Xr = 1, xt = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  }), xt;
}
var en;
function et() {
  if (en) return qe.exports;
  en = 1;
  const n = gi(), t = ha(), _ = Da(), g = (p) => {
    if (typeof p != "string" || p.length === 0 || (p = n(p), p.length === 0))
      return 0;
    p = p.replace(_(), "  ");
    let i = 0;
    for (let r = 0; r < p.length; r++) {
      const s = p.codePointAt(r);
      s <= 31 || s >= 127 && s <= 159 || s >= 768 && s <= 879 || (s > 65535 && r++, i += t(s) ? 2 : 1);
    }
    return i;
  };
  return qe.exports = g, qe.exports.default = g, qe.exports;
}
var tn;
function va() {
  if (tn) return Fe;
  tn = 1;
  var n = et();
  Fe.center = p, Fe.left = _, Fe.right = g;
  function t(i) {
    var r = "", s = " ", c = i;
    do
      c % 2 && (r += s), c = Math.floor(c / 2), s += s;
    while (c);
    return r;
  }
  function _(i, r) {
    var s = i.trimRight();
    if (s.length === 0 && i.length >= r) return i;
    var c = "", m = n(s);
    return m < r && (c = t(r - m)), s + c;
  }
  function g(i, r) {
    var s = i.trimLeft();
    if (s.length === 0 && i.length >= r) return i;
    var c = "", m = n(s);
    return m < r && (c = t(r - m)), c + s;
  }
  function p(i, r) {
    var s = i.trim();
    if (s.length === 0 && i.length >= r) return i;
    var c = "", m = "", v = n(s);
    if (v < r) {
      var b = parseInt((r - v) / 2, 10);
      c = t(b), m = t(r - (v + b));
    }
    return c + s + m;
  }
  return Fe;
}
var Tt, rn;
function Dr() {
  if (rn) return Tt;
  rn = 1, Tt = g;
  function n(b) {
    return b != null && typeof b == "object" && b.hasOwnProperty("callee");
  }
  const t = {
    "*": { label: "any", check: () => !0 },
    A: { label: "array", check: (b) => Array.isArray(b) || n(b) },
    S: { label: "string", check: (b) => typeof b == "string" },
    N: { label: "number", check: (b) => typeof b == "number" },
    F: { label: "function", check: (b) => typeof b == "function" },
    O: { label: "object", check: (b) => typeof b == "object" && b != null && !t.A.check(b) && !t.E.check(b) },
    B: { label: "boolean", check: (b) => typeof b == "boolean" },
    E: { label: "error", check: (b) => b instanceof Error },
    Z: { label: "null", check: (b) => b == null }
  };
  function _(b, f) {
    const C = f[b.length] = f[b.length] || [];
    C.indexOf(b) === -1 && C.push(b);
  }
  function g(b, f) {
    if (arguments.length !== 2) throw c(["SA"], arguments.length);
    if (!b) throw p(0);
    if (!f) throw p(1);
    if (!t.S.check(b)) throw r(0, ["string"], b);
    if (!t.A.check(f)) throw r(1, ["array"], f);
    const C = b.split("|"), E = {};
    C.forEach((d) => {
      for (let e = 0; e < d.length; ++e) {
        const l = d[e];
        if (!t[l]) throw i(e, l);
      }
      if (/E.*E/.test(d)) throw m(d);
      _(d, E), /E/.test(d) && (_(d.replace(/E.*$/, "E"), E), _(d.replace(/E/, "Z"), E), d.length === 1 && _("", E));
    });
    let a = E[f.length];
    if (!a)
      throw c(Object.keys(E), f.length);
    for (let d = 0; d < f.length; ++d) {
      let e = a.filter((l) => {
        const S = l[d], u = t[S].check;
        return u(f[d]);
      });
      if (!e.length) {
        const l = a.map((S) => t[S[d]].label).filter((S) => S != null);
        throw r(d, l, f[d]);
      }
      a = e;
    }
  }
  function p(b) {
    return v("EMISSINGARG", "Missing required argument #" + (b + 1));
  }
  function i(b, f) {
    return v("EUNKNOWNTYPE", "Unknown type " + f + " in argument #" + (b + 1));
  }
  function r(b, f, C) {
    let E;
    return Object.keys(t).forEach((a) => {
      t[a].check(C) && (E = t[a].label);
    }), v("EINVALIDTYPE", "Argument #" + (b + 1) + ": Expected " + s(f) + " but got " + E);
  }
  function s(b) {
    return b.join(", ").replace(/, ([^,]+)$/, " or $1");
  }
  function c(b, f) {
    const C = s(b), E = b.every((a) => a.length === 1) ? "argument" : "arguments";
    return v("EWRONGARGCOUNT", "Expected " + C + " " + E + " but got " + f);
  }
  function m(b) {
    return v(
      "ETOOMANYERRORTYPES",
      'Only one error type per argument signature is allowed, more than one found in "' + b + '"'
    );
  }
  function v(b, f) {
    const C = new TypeError(f);
    return C.code = b, Error.captureStackTrace && Error.captureStackTrace(C, g), C;
  }
  return Tt;
}
var Ot, nn;
function mi() {
  if (nn) return Ot;
  nn = 1;
  var n = et(), t = gi();
  Ot = _;
  function _(g, p) {
    if (n(g) === 0) return g;
    if (p <= 0) return "";
    if (n(g) <= p) return g;
    for (var i = t(g), r = g.length + i.length, s = g.slice(0, p + r); n(s) > p; )
      s = s.slice(0, -1);
    return s;
  }
  return Ot;
}
var Ce = {}, an;
function pa() {
  if (an) return Ce;
  an = 1;
  var n = ue, t = Ce.User = function _(g) {
    var p = new Error(g);
    return Error.captureStackTrace(p, _), p.code = "EGAUGE", p;
  };
  return Ce.MissingTemplateValue = function _(g, p) {
    var i = new t(n.format('Missing template value "%s"', g.type));
    return Error.captureStackTrace(i, _), i.template = g, i.values = p, i;
  }, Ce.Internal = function _(g) {
    var p = new Error(g);
    return Error.captureStackTrace(p, _), p.code = "EGAUGEINTERNAL", p;
  }, Ce;
}
var Bt, un;
function _a() {
  if (un) return Bt;
  un = 1;
  var n = et();
  Bt = g;
  function t(p) {
    return typeof p != "string" ? !1 : p.slice(-1) === "%";
  }
  function _(p) {
    return Number(p.slice(0, -1)) / 100;
  }
  function g(p, i) {
    if (this.overallOutputLength = i, this.finished = !1, this.type = null, this.value = null, this.length = null, this.maxLength = null, this.minLength = null, this.kerning = null, this.align = "left", this.padLeft = 0, this.padRight = 0, this.index = null, this.first = null, this.last = null, typeof p == "string")
      this.value = p;
    else
      for (var r in p) this[r] = p[r];
    return t(this.length) && (this.length = Math.round(this.overallOutputLength * _(this.length))), t(this.minLength) && (this.minLength = Math.round(this.overallOutputLength * _(this.minLength))), t(this.maxLength) && (this.maxLength = Math.round(this.overallOutputLength * _(this.maxLength))), this;
  }
  return g.prototype = {}, g.prototype.getBaseLength = function() {
    var p = this.length;
    return p == null && typeof this.value == "string" && this.maxLength == null && this.minLength == null && (p = n(this.value)), p;
  }, g.prototype.getLength = function() {
    var p = this.getBaseLength();
    return p == null ? null : p + this.padLeft + this.padRight;
  }, g.prototype.getMaxLength = function() {
    return this.maxLength == null ? null : this.maxLength + this.padLeft + this.padRight;
  }, g.prototype.getMinLength = function() {
    return this.minLength == null ? null : this.minLength + this.padLeft + this.padRight;
  }, Bt;
}
var on;
function yi() {
  if (on) return St.exports;
  on = 1;
  var n = va(), t = Dr(), _ = mi(), g = pa(), p = _a();
  function i(E) {
    return function(a) {
      return C(a, E);
    };
  }
  var r = St.exports = function(E, a, d) {
    var e = b(E, a, d), l = e.map(i(d)).join("");
    return n.left(_(l, E), E);
  };
  function s(E) {
    var a = E.type[0].toUpperCase() + E.type.slice(1);
    return "pre" + a;
  }
  function c(E) {
    var a = E.type[0].toUpperCase() + E.type.slice(1);
    return "post" + a;
  }
  function m(E, a) {
    if (E.type)
      return a[s(E)] || a[c(E)];
  }
  function v(E, a) {
    var d = Object.assign({}, E), e = Object.create(a), l = [], S = s(d), u = c(d);
    return e[S] && (l.push({ value: e[S] }), e[S] = null), d.minLength = null, d.length = null, d.maxLength = null, l.push(d), e[d.type] = e[d.type], e[u] && (l.push({ value: e[u] }), e[u] = null), function(o, D, R) {
      return r(R, l, e);
    };
  }
  function b(E, a, d) {
    function e(y, A, T) {
      var O = new p(y, E), L = O.type;
      if (O.value == null)
        if (L in d)
          O.value = d[L];
        else {
          if (O.default == null)
            throw new g.MissingTemplateValue(O, d);
          O.value = O.default;
        }
      return O.value == null || O.value === "" ? null : (O.index = A, O.first = A === 0, O.last = A === T.length - 1, m(O, d) && (O.value = v(O, d)), O);
    }
    var l = a.map(e).filter(function(y) {
      return y != null;
    }), S = E, u = l.length;
    function o(y) {
      y > S && (y = S), S -= y;
    }
    function D(y, A) {
      if (y.finished) throw new g.Internal("Tried to finish template item that was already finished");
      if (A === 1 / 0) throw new g.Internal("Length of template item cannot be infinity");
      if (A != null && (y.length = A), y.minLength = null, y.maxLength = null, --u, y.finished = !0, y.length == null && (y.length = y.getBaseLength()), y.length == null) throw new g.Internal("Finished template items must have a length");
      o(y.getLength());
    }
    l.forEach(function(y) {
      if (y.kerning) {
        var A = y.first ? 0 : l[y.index - 1].padRight;
        !y.first && A < y.kerning && (y.padLeft = y.kerning - A), y.last || (y.padRight = y.kerning);
      }
    }), l.forEach(function(y) {
      y.getBaseLength() != null && D(y);
    });
    var R = 0, x, h;
    do
      x = !1, h = Math.round(S / u), l.forEach(function(y) {
        y.finished || y.maxLength && y.getMaxLength() < h && (D(y, y.maxLength), x = !0);
      });
    while (x && R++ < l.length);
    if (x) throw new g.Internal("Resize loop iterated too many times while determining maxLength");
    R = 0;
    do
      x = !1, h = Math.round(S / u), l.forEach(function(y) {
        y.finished || y.minLength && y.getMinLength() >= h && (D(y, y.minLength), x = !0);
      });
    while (x && R++ < l.length);
    if (x) throw new g.Internal("Resize loop iterated too many times while determining minLength");
    return h = Math.round(S / u), l.forEach(function(y) {
      y.finished || D(y, h);
    }), l;
  }
  function f(E, a, d) {
    return t("OON", arguments), E.type ? E.value(a, a[E.type + "Theme"] || {}, d) : E.value(a, {}, d);
  }
  function C(E, a) {
    var d = E.getBaseLength(), e = typeof E.value == "function" ? f(E, a, d) : E.value;
    if (e == null || e === "") return "";
    var l = n[E.align] || n.left, S = E.padLeft ? n.left("", E.padLeft) : "", u = E.padRight ? n.right("", E.padRight) : "", o = _(String(e), d), D = l(o, d);
    return S + D + u;
  }
  return St.exports;
}
var sn;
function ba() {
  if (sn) return Ct.exports;
  sn = 1;
  var n = hr(), t = yi(), _ = Dr(), g = Ct.exports = function(p, i, r) {
    r || (r = 80), _("OAN", [p, i, r]), this.showing = !1, this.theme = p, this.width = r, this.template = i;
  };
  return g.prototype = {}, g.prototype.setTheme = function(p) {
    _("O", [p]), this.theme = p;
  }, g.prototype.setTemplate = function(p) {
    _("A", [p]), this.template = p;
  }, g.prototype.setWidth = function(p) {
    _("N", [p]), this.width = p;
  }, g.prototype.hide = function() {
    return n.gotoSOL() + n.eraseLine();
  }, g.prototype.hideCursor = n.hideCursor, g.prototype.showCursor = n.showCursor, g.prototype.show = function(p) {
    var i = Object.create(this.theme);
    for (var r in p)
      i[r] = p[r];
    return t(this.width, this.template, i).trim() + n.color("reset") + n.eraseLine() + n.gotoSOL();
  }, Ct.exports;
}
var kt = { exports: {} }, ln;
function ga() {
  if (ln) return kt.exports;
  ln = 1;
  var n = lr;
  return kt.exports = function() {
    if (n.type() == "Windows_NT")
      return !1;
    var t = /UTF-?8$/i, _ = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG;
    return t.test(_);
  }, kt.exports;
}
var Nt, fn;
function ma() {
  if (fn) return Nt;
  fn = 1, Nt = p({ alwaysReturn: !0 }, p);
  function n(i, r) {
    return i.level = 0, i.hasBasic = !1, i.has256 = !1, i.has16m = !1, r.alwaysReturn ? i : !1;
  }
  function t(i) {
    return i.hasBasic = !0, i.has256 = !1, i.has16m = !1, i.level = 1, i;
  }
  function _(i) {
    return i.hasBasic = !0, i.has256 = !0, i.has16m = !1, i.level = 2, i;
  }
  function g(i) {
    return i.hasBasic = !0, i.has256 = !0, i.has16m = !0, i.level = 3, i;
  }
  function p(i, r) {
    if (i = i || {}, r = r || {}, typeof i.level == "number")
      switch (i.level) {
        case 0:
          return n(r, i);
        case 1:
          return t(r);
        case 2:
          return _(r);
        case 3:
          return g(r);
      }
    if (r.level = 0, r.hasBasic = !1, r.has256 = !1, r.has16m = !1, typeof process > "u" || !process || !process.stdout || !process.env || !process.platform)
      return n(r, i);
    var s = i.env || process.env, c = i.stream || process.stdout, m = i.term || s.TERM || "", v = i.platform || process.platform;
    if (!i.ignoreTTY && !c.isTTY || !i.ignoreDumb && m === "dumb" && !s.COLORTERM)
      return n(r, i);
    if (v === "win32")
      return t(r);
    if (s.TMUX)
      return _(r);
    if (!i.ignoreCI && (s.CI || s.TEAMCITY_VERSION))
      return s.TRAVIS ? _(r) : n(r, i);
    switch (s.TERM_PROGRAM) {
      case "iTerm.app":
        var b = s.TERM_PROGRAM_VERSION || "0.";
        return /^[0-2]\./.test(b) ? _(r) : g(r);
      case "HyperTerm":
      case "Hyper":
        return g(r);
      case "MacTerm":
        return g(r);
      case "Apple_Terminal":
        return _(r);
    }
    return /^xterm-256/.test(m) ? _(r) : /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(m) || s.COLORTERM ? t(r) : n(r, i);
  }
  return Nt;
}
var It, cn;
function ya() {
  if (cn) return It;
  cn = 1;
  var n = ma();
  return It = n().hasBasic, It;
}
var de = { exports: {} }, Lt = { exports: {} }, dn;
function Ea() {
  return dn || (dn = 1, (function(n) {
    n.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ], process.platform !== "win32" && n.exports.push(
      "SIGVTALRM",
      "SIGXCPU",
      "SIGXFSZ",
      "SIGUSR2",
      "SIGTRAP",
      "SIGSYS",
      "SIGQUIT",
      "SIGIOT"
      // should detect profiler and enable/disable accordingly.
      // see #21
      // 'SIGPROF'
    ), process.platform === "linux" && n.exports.push(
      "SIGIO",
      "SIGPOLL",
      "SIGPWR",
      "SIGSTKFLT",
      "SIGUNUSED"
    );
  })(Lt)), Lt.exports;
}
var hn;
function wa() {
  if (hn) return de.exports;
  hn = 1;
  var n = ne.process;
  const t = function(d) {
    return d && typeof d == "object" && typeof d.removeListener == "function" && typeof d.emit == "function" && typeof d.reallyExit == "function" && typeof d.listeners == "function" && typeof d.kill == "function" && typeof d.pid == "number" && typeof d.on == "function";
  };
  if (!t(n))
    de.exports = function() {
      return function() {
      };
    };
  else {
    var _ = Qe, g = Ea(), p = /^win/i.test(n.platform), i = ge;
    typeof i != "function" && (i = i.EventEmitter);
    var r;
    n.__signal_exit_emitter__ ? r = n.__signal_exit_emitter__ : (r = n.__signal_exit_emitter__ = new i(), r.count = 0, r.emitted = {}), r.infinite || (r.setMaxListeners(1 / 0), r.infinite = !0), de.exports = function(d, e) {
      if (!t(ne.process))
        return function() {
        };
      _.equal(typeof d, "function", "a callback must be provided for exit handler"), v === !1 && b();
      var l = "exit";
      e && e.alwaysLast && (l = "afterexit");
      var S = function() {
        r.removeListener(l, d), r.listeners("exit").length === 0 && r.listeners("afterexit").length === 0 && s();
      };
      return r.on(l, d), S;
    };
    var s = function() {
      !v || !t(ne.process) || (v = !1, g.forEach(function(e) {
        try {
          n.removeListener(e, m[e]);
        } catch {
        }
      }), n.emit = E, n.reallyExit = f, r.count -= 1);
    };
    de.exports.unload = s;
    var c = function(e, l, S) {
      r.emitted[e] || (r.emitted[e] = !0, r.emit(e, l, S));
    }, m = {};
    g.forEach(function(d) {
      m[d] = function() {
        if (t(ne.process)) {
          var l = n.listeners(d);
          l.length === r.count && (s(), c("exit", null, d), c("afterexit", null, d), p && d === "SIGHUP" && (d = "SIGINT"), n.kill(n.pid, d));
        }
      };
    }), de.exports.signals = function() {
      return g;
    };
    var v = !1, b = function() {
      v || !t(ne.process) || (v = !0, r.count += 1, g = g.filter(function(e) {
        try {
          return n.on(e, m[e]), !0;
        } catch {
          return !1;
        }
      }), n.emit = a, n.reallyExit = C);
    };
    de.exports.load = b;
    var f = n.reallyExit, C = function(e) {
      t(ne.process) && (n.exitCode = e || /* istanbul ignore next */
      0, c("exit", n.exitCode, null), c("afterexit", n.exitCode, null), f.call(n, n.exitCode));
    }, E = n.emit, a = function(e, l) {
      if (e === "exit" && t(ne.process)) {
        l !== void 0 && (n.exitCode = l);
        var S = E.apply(this, arguments);
        return c("exit", n.exitCode, null), c("afterexit", n.exitCode, null), S;
      } else
        return E.apply(this, arguments);
    };
  }
  return de.exports;
}
var Mt = { exports: {} };
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Pt, Dn;
function Fa() {
  if (Dn) return Pt;
  Dn = 1;
  var n = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, _ = Object.prototype.propertyIsEnumerable;
  function g(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function p() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var r = {}, s = 0; s < 10; s++)
        r["_" + String.fromCharCode(s)] = s;
      var c = Object.getOwnPropertyNames(r).map(function(v) {
        return r[v];
      });
      if (c.join("") !== "0123456789")
        return !1;
      var m = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(v) {
        m[v] = v;
      }), Object.keys(Object.assign({}, m)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Pt = p() ? Object.assign : function(i, r) {
    for (var s, c = g(i), m, v = 1; v < arguments.length; v++) {
      s = Object(arguments[v]);
      for (var b in s)
        t.call(s, b) && (c[b] = s[b]);
      if (n) {
        m = n(s);
        for (var f = 0; f < m.length; f++)
          _.call(s, m[f]) && (c[m[f]] = s[m[f]]);
      }
    }
    return c;
  }, Pt;
}
var qt, vn;
function Ca() {
  return vn || (vn = 1, qt = function(t, _) {
    return t[_ % t.length];
  }), qt;
}
var jt, pn;
function Sa() {
  if (pn) return jt;
  pn = 1;
  var n = Dr(), t = yi(), _ = mi(), g = et();
  jt = function(i, r, s) {
    if (n("ONN", [i, r, s]), s < 0 && (s = 0), s > 1 && (s = 1), r <= 0) return "";
    var c = Math.round(r * s), m = r - c, v = [
      { type: "complete", value: p(i.complete, c), length: c },
      { type: "remaining", value: p(i.remaining, m), length: m }
    ];
    return t(r, v, i);
  };
  function p(i, r) {
    var s = "", c = r;
    do
      c % 2 && (s += i), c = Math.floor(c / 2), i += i;
    while (c && g(s) < r);
    return _(s, r);
  }
  return jt;
}
var Wt, _n;
function Ra() {
  if (_n) return Wt;
  _n = 1;
  var n = Ca(), t = Sa();
  return Wt = {
    activityIndicator: function(_, g, p) {
      if (_.spun != null)
        return n(g, _.spun);
    },
    progressbar: function(_, g, p) {
      if (_.completed != null)
        return t(g, p, _.completed);
    }
  }, Wt;
}
var Gt, bn;
function Aa() {
  if (bn) return Gt;
  bn = 1;
  var n = Fa();
  Gt = function() {
    return t.newThemeSet();
  };
  var t = {};
  return t.baseTheme = Ra(), t.newTheme = function(_, g) {
    return g || (g = _, _ = this.baseTheme), n({}, _, g);
  }, t.getThemeNames = function() {
    return Object.keys(this.themes);
  }, t.addTheme = function(_, g, p) {
    this.themes[_] = this.newTheme(g, p);
  }, t.addToAllThemes = function(_) {
    var g = this.themes;
    Object.keys(g).forEach(function(p) {
      n(g[p], _);
    }), n(this.baseTheme, _);
  }, t.getTheme = function(_) {
    if (!this.themes[_]) throw this.newMissingThemeError(_);
    return this.themes[_];
  }, t.setDefault = function(_, g) {
    g == null && (g = _, _ = {});
    var p = _.platform == null ? "fallback" : _.platform, i = !!_.hasUnicode, r = !!_.hasColor;
    this.defaults[p] || (this.defaults[p] = { true: {}, false: {} }), this.defaults[p][i][r] = g;
  }, t.getDefault = function(_) {
    _ || (_ = {});
    var g = _.platform || process.platform, p = this.defaults[g] || this.defaults.fallback, i = !!_.hasUnicode, r = !!_.hasColor;
    if (!p) throw this.newMissingDefaultThemeError(g, i, r);
    if (!p[i][r]) {
      if (i && r && p[!i][r])
        i = !1;
      else if (i && r && p[i][!r])
        r = !1;
      else if (i && r && p[!i][!r])
        i = !1, r = !1;
      else if (i && !r && p[!i][r])
        i = !1;
      else if (!i && r && p[i][!r])
        r = !1;
      else if (p === this.defaults.fallback)
        throw this.newMissingDefaultThemeError(g, i, r);
    }
    return p[i][r] ? this.getTheme(p[i][r]) : this.getDefault(n({}, _, { platform: "fallback" }));
  }, t.newMissingThemeError = function _(g) {
    var p = new Error('Could not find a gauge theme named "' + g + '"');
    return Error.captureStackTrace.call(p, _), p.theme = g, p.code = "EMISSINGTHEME", p;
  }, t.newMissingDefaultThemeError = function _(g, p, i) {
    var r = new Error(
      `Could not find a gauge theme for your platform/unicode/color use combo:
    platform = ` + g + `
    hasUnicode = ` + p + `
    hasColor = ` + i
    );
    return Error.captureStackTrace.call(r, _), r.platform = g, r.hasUnicode = p, r.hasColor = i, r.code = "EMISSINGTHEME", r;
  }, t.newThemeSet = function() {
    var _ = function(g) {
      return _.getDefault(g);
    };
    return n(_, t, {
      themes: n({}, this.themes),
      baseTheme: n({}, this.baseTheme),
      defaults: JSON.parse(JSON.stringify(this.defaults || {}))
    });
  }, Gt;
}
var gn;
function xa() {
  if (gn) return Mt.exports;
  gn = 1;
  var n = hr().color, t = Aa(), _ = Mt.exports = new t();
  return _.addTheme("ASCII", {
    preProgressbar: "[",
    postProgressbar: "]",
    progressbarTheme: {
      complete: "#",
      remaining: "."
    },
    activityIndicatorTheme: "-\\|/",
    preSubsection: ">"
  }), _.addTheme("colorASCII", _.getTheme("ASCII"), {
    progressbarTheme: {
      preComplete: n("bgBrightWhite", "brightWhite"),
      complete: "#",
      postComplete: n("reset"),
      preRemaining: n("bgBrightBlack", "brightBlack"),
      remaining: ".",
      postRemaining: n("reset")
    }
  }), _.addTheme("brailleSpinner", {
    preProgressbar: "⸨",
    postProgressbar: "⸩",
    progressbarTheme: {
      complete: "#",
      remaining: "⠂"
    },
    activityIndicatorTheme: "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
    preSubsection: ">"
  }), _.addTheme("colorBrailleSpinner", _.getTheme("brailleSpinner"), {
    progressbarTheme: {
      preComplete: n("bgBrightWhite", "brightWhite"),
      complete: "#",
      postComplete: n("reset"),
      preRemaining: n("bgBrightBlack", "brightBlack"),
      remaining: "⠂",
      postRemaining: n("reset")
    }
  }), _.setDefault({}, "ASCII"), _.setDefault({ hasColor: !0 }, "colorASCII"), _.setDefault({ platform: "darwin", hasUnicode: !0 }, "brailleSpinner"), _.setDefault({ platform: "darwin", hasUnicode: !0, hasColor: !0 }, "colorBrailleSpinner"), _.setDefault({ platform: "linux", hasUnicode: !0 }, "brailleSpinner"), _.setDefault({ platform: "linux", hasUnicode: !0, hasColor: !0 }, "colorBrailleSpinner"), Mt.exports;
}
var Ut, mn;
function Ta() {
  return mn || (mn = 1, Ut = setInterval), Ut;
}
var $t, yn;
function Ei() {
  return yn || (yn = 1, $t = process), $t;
}
var We = { exports: {} }, En;
function Oa() {
  if (En) return We.exports;
  En = 1;
  var n = Ei();
  try {
    We.exports = setImmediate;
  } catch {
    We.exports = n.nextTick;
  }
  return We.exports;
}
var Ht, wn;
function Ba() {
  if (wn) return Ht;
  wn = 1;
  var n = ba(), t = ga(), _ = ya(), g = wa(), p = xa(), i = Ta(), r = Ei(), s = Oa();
  Ht = m;
  function c(v, b) {
    return function() {
      return b.call(v);
    };
  }
  function m(v, b) {
    var f, C;
    v && v.write ? (C = v, f = b || {}) : b && b.write ? (C = b, f = v || {}) : (C = r.stderr, f = v || b || {}), this._status = {
      spun: 0,
      section: "",
      subsection: ""
    }, this._paused = !1, this._disabled = !0, this._showing = !1, this._onScreen = !1, this._needsRedraw = !1, this._hideCursor = f.hideCursor == null ? !0 : f.hideCursor, this._fixedFramerate = f.fixedFramerate == null ? !/^v0\.8\./.test(r.version) : f.fixedFramerate, this._lastUpdateAt = null, this._updateInterval = f.updateInterval == null ? 50 : f.updateInterval, this._themes = f.themes || p, this._theme = f.theme;
    var E = this._computeTheme(f.theme), a = f.template || [
      { type: "progressbar", length: 20 },
      { type: "activityIndicator", kerning: 1, length: 1 },
      { type: "section", kerning: 1, default: "" },
      { type: "subsection", kerning: 1, default: "" }
    ];
    this.setWriteTo(C, f.tty);
    var d = f.Plumbing || n;
    this._gauge = new d(E, a, this.getWidth()), this._$$doRedraw = c(this, this._doRedraw), this._$$handleSizeChange = c(this, this._handleSizeChange), this._cleanupOnExit = f.cleanupOnExit == null || f.cleanupOnExit, this._removeOnExit = null, f.enabled || f.enabled == null && this._tty && this._tty.isTTY ? this.enable() : this.disable();
  }
  return m.prototype = {}, m.prototype.isEnabled = function() {
    return !this._disabled;
  }, m.prototype.setTemplate = function(v) {
    this._gauge.setTemplate(v), this._showing && this._requestRedraw();
  }, m.prototype._computeTheme = function(v) {
    if (v || (v = {}), typeof v == "string")
      v = this._themes.getTheme(v);
    else if (v && (Object.keys(v).length === 0 || v.hasUnicode != null || v.hasColor != null)) {
      var b = v.hasUnicode == null ? t() : v.hasUnicode, f = v.hasColor == null ? _ : v.hasColor;
      v = this._themes.getDefault({ hasUnicode: b, hasColor: f, platform: v.platform });
    }
    return v;
  }, m.prototype.setThemeset = function(v) {
    this._themes = v, this.setTheme(this._theme);
  }, m.prototype.setTheme = function(v) {
    this._gauge.setTheme(this._computeTheme(v)), this._showing && this._requestRedraw(), this._theme = v;
  }, m.prototype._requestRedraw = function() {
    this._needsRedraw = !0, this._fixedFramerate || this._doRedraw();
  }, m.prototype.getWidth = function() {
    return (this._tty && this._tty.columns || 80) - 1;
  }, m.prototype.setWriteTo = function(v, b) {
    var f = !this._disabled;
    f && this.disable(), this._writeTo = v, this._tty = b || v === r.stderr && r.stdout.isTTY && r.stdout || v.isTTY && v || this._tty, this._gauge && this._gauge.setWidth(this.getWidth()), f && this.enable();
  }, m.prototype.enable = function() {
    this._disabled && (this._disabled = !1, this._tty && this._enableEvents(), this._showing && this.show());
  }, m.prototype.disable = function() {
    this._disabled || (this._showing && (this._lastUpdateAt = null, this._showing = !1, this._doRedraw(), this._showing = !0), this._disabled = !0, this._tty && this._disableEvents());
  }, m.prototype._enableEvents = function() {
    this._cleanupOnExit && (this._removeOnExit = g(c(this, this.disable))), this._tty.on("resize", this._$$handleSizeChange), this._fixedFramerate && (this.redrawTracker = i(this._$$doRedraw, this._updateInterval), this.redrawTracker.unref && this.redrawTracker.unref());
  }, m.prototype._disableEvents = function() {
    this._tty.removeListener("resize", this._$$handleSizeChange), this._fixedFramerate && clearInterval(this.redrawTracker), this._removeOnExit && this._removeOnExit();
  }, m.prototype.hide = function(v) {
    if (this._disabled || !this._showing) return v && r.nextTick(v);
    this._showing = !1, this._doRedraw(), v && s(v);
  }, m.prototype.show = function(v, b) {
    if (this._showing = !0, typeof v == "string")
      this._status.section = v;
    else if (typeof v == "object")
      for (var f = Object.keys(v), C = 0; C < f.length; ++C) {
        var E = f[C];
        this._status[E] = v[E];
      }
    b != null && (this._status.completed = b), !this._disabled && this._requestRedraw();
  }, m.prototype.pulse = function(v) {
    this._status.subsection = v || "", this._status.spun++, !this._disabled && this._showing && this._requestRedraw();
  }, m.prototype._handleSizeChange = function() {
    this._gauge.setWidth(this._tty.columns - 1), this._requestRedraw();
  }, m.prototype._doRedraw = function() {
    if (!(this._disabled || this._paused)) {
      if (!this._fixedFramerate) {
        var v = Date.now();
        if (this._lastUpdateAt && v - this._lastUpdateAt < this._updateInterval) return;
        this._lastUpdateAt = v;
      }
      if (!this._showing && this._onScreen) {
        this._onScreen = !1;
        var b = this._gauge.hide();
        return this._hideCursor && (b += this._gauge.showCursor()), this._writeTo.write(b);
      }
      !this._showing && !this._onScreen || (this._showing && !this._onScreen && (this._onScreen = !0, this._needsRedraw = !0, this._hideCursor && this._writeTo.write(this._gauge.hideCursor())), this._needsRedraw && (this._writeTo.write(this._gauge.show(this._status)) || (this._paused = !0, this._writeTo.on("drain", c(this, function() {
        this._paused = !1, this._doRedraw();
      })))));
    }
  }, Ht;
}
var Vt, Fn;
function ka() {
  return Fn || (Fn = 1, Vt = function(n) {
    [process.stdout, process.stderr].forEach(function(t) {
      t._handle && t.isTTY && typeof t._handle.setBlocking == "function" && t._handle.setBlocking(n);
    });
  }), Vt;
}
var Cn;
function wi() {
  return Cn || (Cn = 1, (function(n, t) {
    var _ = ca(), g = Ba(), p = ge.EventEmitter, i = n.exports = new p(), r = ue, s = ka(), c = hr();
    s(!0);
    var m = process.stderr;
    Object.defineProperty(i, "stream", {
      set: function(a) {
        m = a, this.gauge && this.gauge.setWriteTo(m, m);
      },
      get: function() {
        return m;
      }
    });
    var v;
    i.useColor = function() {
      return v ?? m.isTTY;
    }, i.enableColor = function() {
      v = !0, this.gauge.setTheme({ hasColor: v, hasUnicode: b });
    }, i.disableColor = function() {
      v = !1, this.gauge.setTheme({ hasColor: v, hasUnicode: b });
    }, i.level = "info", i.gauge = new g(m, {
      enabled: !1,
      // no progress bars unless asked
      theme: { hasColor: i.useColor() },
      template: [
        { type: "progressbar", length: 20 },
        { type: "activityIndicator", kerning: 1, length: 1 },
        { type: "section", default: "" },
        ":",
        { type: "logline", kerning: 1, default: "" }
      ]
    }), i.tracker = new _.TrackerGroup(), i.progressEnabled = i.gauge.isEnabled();
    var b;
    i.enableUnicode = function() {
      b = !0, this.gauge.setTheme({ hasColor: this.useColor(), hasUnicode: b });
    }, i.disableUnicode = function() {
      b = !1, this.gauge.setTheme({ hasColor: this.useColor(), hasUnicode: b });
    }, i.setGaugeThemeset = function(a) {
      this.gauge.setThemeset(a);
    }, i.setGaugeTemplate = function(a) {
      this.gauge.setTemplate(a);
    }, i.enableProgress = function() {
      this.progressEnabled || (this.progressEnabled = !0, this.tracker.on("change", this.showProgress), !this._paused && this.gauge.enable());
    }, i.disableProgress = function() {
      this.progressEnabled && (this.progressEnabled = !1, this.tracker.removeListener("change", this.showProgress), this.gauge.disable());
    };
    var f = ["newGroup", "newItem", "newStream"], C = function(a) {
      return Object.keys(i).forEach(function(d) {
        if (d[0] !== "_" && !f.filter(function(l) {
          return l === d;
        }).length && !a[d] && typeof i[d] == "function") {
          var e = i[d];
          a[d] = function() {
            return e.apply(i, arguments);
          };
        }
      }), a instanceof _.TrackerGroup && f.forEach(function(d) {
        var e = a[d];
        a[d] = function() {
          return C(e.apply(a, arguments));
        };
      }), a;
    };
    f.forEach(function(a) {
      i[a] = function() {
        return C(this.tracker[a].apply(this.tracker, arguments));
      };
    }), i.clearProgress = function(a) {
      if (!this.progressEnabled)
        return a && process.nextTick(a);
      this.gauge.hide(a);
    }, i.showProgress = (function(a, d) {
      if (this.progressEnabled) {
        var e = {};
        a && (e.section = a);
        var l = i.record[i.record.length - 1];
        if (l) {
          e.subsection = l.prefix;
          var S = i.disp[l.level] || l.level, u = this._format(S, i.style[l.level]);
          l.prefix && (u += " " + this._format(l.prefix, this.prefixStyle)), u += " " + l.message.split(/\r?\n/)[0], e.logline = u;
        }
        e.completed = d || this.tracker.completed(), this.gauge.show(e);
      }
    }).bind(i), i.pause = function() {
      this._paused = !0, this.progressEnabled && this.gauge.disable();
    }, i.resume = function() {
      if (this._paused) {
        this._paused = !1;
        var a = this._buffer;
        this._buffer = [], a.forEach(function(d) {
          this.emitLog(d);
        }, this), this.progressEnabled && this.gauge.enable();
      }
    }, i._buffer = [];
    var E = 0;
    i.record = [], i.maxRecordSize = 1e4, i.log = (function(a, d, e) {
      var l = this.levels[a];
      if (l === void 0)
        return this.emit("error", new Error(r.format(
          "Undefined log level: %j",
          a
        )));
      for (var S = new Array(arguments.length - 2), u = null, o = 2; o < arguments.length; o++) {
        var D = S[o - 2] = arguments[o];
        typeof D == "object" && D instanceof Error && D.stack && Object.defineProperty(D, "stack", {
          value: u = D.stack + "",
          enumerable: !0,
          writable: !0
        });
      }
      u && S.unshift(u + `
`), e = r.format.apply(r, S);
      var R = {
        id: E++,
        level: a,
        prefix: String(d || ""),
        message: e,
        messageRaw: S
      };
      this.emit("log", R), this.emit("log." + a, R), R.prefix && this.emit(R.prefix, R), this.record.push(R);
      var x = this.maxRecordSize, h = this.record.length - x;
      if (h > x / 10) {
        var y = Math.floor(x * 0.9);
        this.record = this.record.slice(-1 * y);
      }
      this.emitLog(R);
    }).bind(i), i.emitLog = function(a) {
      if (this._paused) {
        this._buffer.push(a);
        return;
      }
      this.progressEnabled && this.gauge.pulse(a.prefix);
      var d = this.levels[a.level];
      if (d !== void 0 && !(d < this.levels[this.level]) && !(d > 0 && !isFinite(d))) {
        var e = i.disp[a.level] != null ? i.disp[a.level] : a.level;
        this.clearProgress(), a.message.split(/\r?\n/).forEach(function(l) {
          this.heading && (this.write(this.heading, this.headingStyle), this.write(" ")), this.write(e, i.style[a.level]);
          var S = a.prefix || "";
          S && this.write(" "), this.write(S, this.prefixStyle), this.write(" " + l + `
`);
        }, this), this.showProgress();
      }
    }, i._format = function(a, d) {
      if (m) {
        var e = "";
        if (this.useColor()) {
          d = d || {};
          var l = [];
          d.fg && l.push(d.fg), d.bg && l.push("bg" + d.bg[0].toUpperCase() + d.bg.slice(1)), d.bold && l.push("bold"), d.underline && l.push("underline"), d.inverse && l.push("inverse"), l.length && (e += c.color(l)), d.beep && (e += c.beep());
        }
        return e += a, this.useColor() && (e += c.color("reset")), e;
      }
    }, i.write = function(a, d) {
      m && m.write(this._format(a, d));
    }, i.addLevel = function(a, d, e, l) {
      l == null && (l = a), this.levels[a] = d, this.style[a] = e, this[a] || (this[a] = (function() {
        var S = new Array(arguments.length + 1);
        S[0] = a;
        for (var u = 0; u < arguments.length; u++)
          S[u + 1] = arguments[u];
        return this.log.apply(this, S);
      }).bind(this)), this.disp[a] = l;
    }, i.prefixStyle = { fg: "magenta" }, i.headingStyle = { fg: "white", bg: "black" }, i.style = {}, i.levels = {}, i.disp = {}, i.addLevel("silly", -1 / 0, { inverse: !0 }, "sill"), i.addLevel("verbose", 1e3, { fg: "blue", bg: "black" }, "verb"), i.addLevel("info", 2e3, { fg: "green" }), i.addLevel("timing", 2500, { fg: "green", bg: "black" }), i.addLevel("http", 3e3, { fg: "green", bg: "black" }), i.addLevel("notice", 3500, { fg: "blue", bg: "black" }), i.addLevel("warn", 4e3, { fg: "black", bg: "yellow" }, "WARN"), i.addLevel("error", 5e3, { fg: "red", bg: "black" }, "ERR!"), i.addLevel("silent", 1 / 0), i.on("error", function() {
    });
  })(nt)), nt.exports;
}
var Re = { exports: {} }, Ge = {}, Sn;
function Na() {
  if (Sn) return Ge;
  Sn = 1;
  var n = ie, t = process.platform === "win32", _ = se, g = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
  function p() {
    var c;
    if (g) {
      var m = new Error();
      c = v;
    } else
      c = b;
    return c;
    function v(f) {
      f && (m.message = f.message, f = m, b(f));
    }
    function b(f) {
      if (f) {
        if (process.throwDeprecation)
          throw f;
        if (!process.noDeprecation) {
          var C = "fs: missing callback " + (f.stack || f.message);
          process.traceDeprecation ? console.trace(C) : console.error(C);
        }
      }
    }
  }
  function i(c) {
    return typeof c == "function" ? c : p();
  }
  if (n.normalize, t)
    var r = /(.*?)(?:[\/\\]+|$)/g;
  else
    var r = /(.*?)(?:[\/]+|$)/g;
  if (t)
    var s = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
  else
    var s = /^[\/]*/;
  return Ge.realpathSync = function(m, v) {
    if (m = n.resolve(m), v && Object.prototype.hasOwnProperty.call(v, m))
      return v[m];
    var b = m, f = {}, C = {}, E, a, d, e;
    l();
    function l() {
      var x = s.exec(m);
      E = x[0].length, a = x[0], d = x[0], e = "", t && !C[d] && (_.lstatSync(d), C[d] = !0);
    }
    for (; E < m.length; ) {
      r.lastIndex = E;
      var S = r.exec(m);
      if (e = a, a += S[0], d = e + S[1], E = r.lastIndex, !(C[d] || v && v[d] === d)) {
        var u;
        if (v && Object.prototype.hasOwnProperty.call(v, d))
          u = v[d];
        else {
          var o = _.lstatSync(d);
          if (!o.isSymbolicLink()) {
            C[d] = !0, v && (v[d] = d);
            continue;
          }
          var D = null;
          if (!t) {
            var R = o.dev.toString(32) + ":" + o.ino.toString(32);
            f.hasOwnProperty(R) && (D = f[R]);
          }
          D === null && (_.statSync(d), D = _.readlinkSync(d)), u = n.resolve(e, D), v && (v[d] = u), t || (f[R] = D);
        }
        m = n.resolve(u, m.slice(E)), l();
      }
    }
    return v && (v[b] = m), m;
  }, Ge.realpath = function(m, v, b) {
    if (typeof b != "function" && (b = i(v), v = null), m = n.resolve(m), v && Object.prototype.hasOwnProperty.call(v, m))
      return process.nextTick(b.bind(null, null, v[m]));
    var f = m, C = {}, E = {}, a, d, e, l;
    S();
    function S() {
      var x = s.exec(m);
      a = x[0].length, d = x[0], e = x[0], l = "", t && !E[e] ? _.lstat(e, function(h) {
        if (h) return b(h);
        E[e] = !0, u();
      }) : process.nextTick(u);
    }
    function u() {
      if (a >= m.length)
        return v && (v[f] = m), b(null, m);
      r.lastIndex = a;
      var x = r.exec(m);
      return l = d, d += x[0], e = l + x[1], a = r.lastIndex, E[e] || v && v[e] === e ? process.nextTick(u) : v && Object.prototype.hasOwnProperty.call(v, e) ? R(v[e]) : _.lstat(e, o);
    }
    function o(x, h) {
      if (x) return b(x);
      if (!h.isSymbolicLink())
        return E[e] = !0, v && (v[e] = e), process.nextTick(u);
      if (!t) {
        var y = h.dev.toString(32) + ":" + h.ino.toString(32);
        if (C.hasOwnProperty(y))
          return D(null, C[y], e);
      }
      _.stat(e, function(A) {
        if (A) return b(A);
        _.readlink(e, function(T, O) {
          t || (C[y] = O), D(T, O);
        });
      });
    }
    function D(x, h, y) {
      if (x) return b(x);
      var A = n.resolve(l, h);
      v && (v[y] = A), R(A);
    }
    function R(x) {
      m = n.resolve(x, m.slice(a)), S();
    }
  }, Ge;
}
var Yt, Rn;
function Fi() {
  if (Rn) return Yt;
  Rn = 1, Yt = s, s.realpath = s, s.sync = c, s.realpathSync = c, s.monkeypatch = m, s.unmonkeypatch = v;
  var n = se, t = n.realpath, _ = n.realpathSync, g = process.version, p = /^v[0-5]\./.test(g), i = Na();
  function r(b) {
    return b && b.syscall === "realpath" && (b.code === "ELOOP" || b.code === "ENOMEM" || b.code === "ENAMETOOLONG");
  }
  function s(b, f, C) {
    if (p)
      return t(b, f, C);
    typeof f == "function" && (C = f, f = null), t(b, f, function(E, a) {
      r(E) ? i.realpath(b, f, C) : C(E, a);
    });
  }
  function c(b, f) {
    if (p)
      return _(b, f);
    try {
      return _(b, f);
    } catch (C) {
      if (r(C))
        return i.realpathSync(b, f);
      throw C;
    }
  }
  function m() {
    n.realpath = s, n.realpathSync = c;
  }
  function v() {
    n.realpath = t, n.realpathSync = _;
  }
  return Yt;
}
var zt, An;
function Ia() {
  if (An) return zt;
  An = 1, zt = function(t, _) {
    for (var g = [], p = 0; p < t.length; p++) {
      var i = _(t[p], p);
      n(i) ? g.push.apply(g, i) : g.push(i);
    }
    return g;
  };
  var n = Array.isArray || function(t) {
    return Object.prototype.toString.call(t) === "[object Array]";
  };
  return zt;
}
var Kt, xn;
function La() {
  if (xn) return Kt;
  xn = 1, Kt = n;
  function n(g, p, i) {
    g instanceof RegExp && (g = t(g, i)), p instanceof RegExp && (p = t(p, i));
    var r = _(g, p, i);
    return r && {
      start: r[0],
      end: r[1],
      pre: i.slice(0, r[0]),
      body: i.slice(r[0] + g.length, r[1]),
      post: i.slice(r[1] + p.length)
    };
  }
  function t(g, p) {
    var i = p.match(g);
    return i ? i[0] : null;
  }
  n.range = _;
  function _(g, p, i) {
    var r, s, c, m, v, b = i.indexOf(g), f = i.indexOf(p, b + 1), C = b;
    if (b >= 0 && f > 0) {
      if (g === p)
        return [b, f];
      for (r = [], c = i.length; C >= 0 && !v; )
        C == b ? (r.push(C), b = i.indexOf(g, C + 1)) : r.length == 1 ? v = [r.pop(), f] : (s = r.pop(), s < c && (c = s, m = f), f = i.indexOf(p, C + 1)), C = b < f && b >= 0 ? b : f;
      r.length && (v = [c, m]);
    }
    return v;
  }
  return Kt;
}
var Qt, Tn;
function Ma() {
  if (Tn) return Qt;
  Tn = 1;
  var n = Ia(), t = La();
  Qt = b;
  var _ = "\0SLASH" + Math.random() + "\0", g = "\0OPEN" + Math.random() + "\0", p = "\0CLOSE" + Math.random() + "\0", i = "\0COMMA" + Math.random() + "\0", r = "\0PERIOD" + Math.random() + "\0";
  function s(e) {
    return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
  }
  function c(e) {
    return e.split("\\\\").join(_).split("\\{").join(g).split("\\}").join(p).split("\\,").join(i).split("\\.").join(r);
  }
  function m(e) {
    return e.split(_).join("\\").split(g).join("{").split(p).join("}").split(i).join(",").split(r).join(".");
  }
  function v(e) {
    if (!e)
      return [""];
    var l = [], S = t("{", "}", e);
    if (!S)
      return e.split(",");
    var u = S.pre, o = S.body, D = S.post, R = u.split(",");
    R[R.length - 1] += "{" + o + "}";
    var x = v(D);
    return D.length && (R[R.length - 1] += x.shift(), R.push.apply(R, x)), l.push.apply(l, R), l;
  }
  function b(e) {
    return e ? (e.substr(0, 2) === "{}" && (e = "\\{\\}" + e.substr(2)), d(c(e), !0).map(m)) : [];
  }
  function f(e) {
    return "{" + e + "}";
  }
  function C(e) {
    return /^-?0\d/.test(e);
  }
  function E(e, l) {
    return e <= l;
  }
  function a(e, l) {
    return e >= l;
  }
  function d(e, l) {
    var S = [], u = t("{", "}", e);
    if (!u || /\$$/.test(u.pre)) return [e];
    var o = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(u.body), D = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(u.body), R = o || D, x = u.body.indexOf(",") >= 0;
    if (!R && !x)
      return u.post.match(/,(?!,).*\}/) ? (e = u.pre + "{" + u.body + p + u.post, d(e)) : [e];
    var h;
    if (R)
      h = u.body.split(/\.\./);
    else if (h = v(u.body), h.length === 1 && (h = d(h[0], !1).map(f), h.length === 1)) {
      var A = u.post.length ? d(u.post, !1) : [""];
      return A.map(function(M) {
        return u.pre + h[0] + M;
      });
    }
    var y = u.pre, A = u.post.length ? d(u.post, !1) : [""], T;
    if (R) {
      var O = s(h[0]), L = s(h[1]), W = Math.max(h[0].length, h[1].length), H = h.length == 3 ? Math.max(Math.abs(s(h[2])), 1) : 1, q = E, P = L < O;
      P && (H *= -1, q = a);
      var $ = h.some(C);
      T = [];
      for (var K = O; q(K, L); K += H) {
        var Y;
        if (D)
          Y = String.fromCharCode(K), Y === "\\" && (Y = "");
        else if (Y = String(K), $) {
          var N = W - Y.length;
          if (N > 0) {
            var U = new Array(N + 1).join("0");
            K < 0 ? Y = "-" + U + Y.slice(1) : Y = U + Y;
          }
        }
        T.push(Y);
      }
    } else
      T = n(h, function(B) {
        return d(B, !1);
      });
    for (var Q = 0; Q < T.length; Q++)
      for (var X = 0; X < A.length; X++) {
        var k = y + T[Q] + A[X];
        (!l || R || k) && S.push(k);
      }
    return S;
  }
  return Qt;
}
var Zt, On;
function vr() {
  if (On) return Zt;
  On = 1, Zt = C, C.Minimatch = E;
  var n = (function() {
    try {
      return require("path");
    } catch {
    }
  })() || {
    sep: "/"
  };
  C.sep = n.sep;
  var t = C.GLOBSTAR = E.GLOBSTAR = {}, _ = Ma(), g = {
    "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
    "?": { open: "(?:", close: ")?" },
    "+": { open: "(?:", close: ")+" },
    "*": { open: "(?:", close: ")*" },
    "@": { open: "(?:", close: ")" }
  }, p = "[^/]", i = p + "*?", r = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", s = "(?:(?!(?:\\/|^)\\.).)*?", c = m("().*{}+?[]^$\\!");
  function m(h) {
    return h.split("").reduce(function(y, A) {
      return y[A] = !0, y;
    }, {});
  }
  var v = /\/+/;
  C.filter = b;
  function b(h, y) {
    return y = y || {}, function(A, T, O) {
      return C(A, h, y);
    };
  }
  function f(h, y) {
    y = y || {};
    var A = {};
    return Object.keys(h).forEach(function(T) {
      A[T] = h[T];
    }), Object.keys(y).forEach(function(T) {
      A[T] = y[T];
    }), A;
  }
  C.defaults = function(h) {
    if (!h || typeof h != "object" || !Object.keys(h).length)
      return C;
    var y = C, A = function(O, L, W) {
      return y(O, L, f(h, W));
    };
    return A.Minimatch = function(O, L) {
      return new y.Minimatch(O, f(h, L));
    }, A.Minimatch.defaults = function(O) {
      return y.defaults(f(h, O)).Minimatch;
    }, A.filter = function(O, L) {
      return y.filter(O, f(h, L));
    }, A.defaults = function(O) {
      return y.defaults(f(h, O));
    }, A.makeRe = function(O, L) {
      return y.makeRe(O, f(h, L));
    }, A.braceExpand = function(O, L) {
      return y.braceExpand(O, f(h, L));
    }, A.match = function(T, O, L) {
      return y.match(T, O, f(h, L));
    }, A;
  }, E.defaults = function(h) {
    return C.defaults(h).Minimatch;
  };
  function C(h, y, A) {
    return S(y), A || (A = {}), !A.nocomment && y.charAt(0) === "#" ? !1 : new E(y, A).match(h);
  }
  function E(h, y) {
    if (!(this instanceof E))
      return new E(h, y);
    S(h), y || (y = {}), h = h.trim(), !y.allowWindowsEscape && n.sep !== "/" && (h = h.split(n.sep).join("/")), this.options = y, this.maxGlobstarRecursion = y.maxGlobstarRecursion !== void 0 ? y.maxGlobstarRecursion : 200, this.set = [], this.pattern = h, this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!y.partial, this.make();
  }
  E.prototype.debug = function() {
  }, E.prototype.make = a;
  function a() {
    var h = this.pattern, y = this.options;
    if (!y.nocomment && h.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!h) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    var A = this.globSet = this.braceExpand();
    y.debug && (this.debug = function() {
      console.error.apply(console, arguments);
    }), this.debug(this.pattern, A), A = this.globParts = A.map(function(T) {
      return T.split(v);
    }), this.debug(this.pattern, A), A = A.map(function(T, O, L) {
      return T.map(this.parse, this);
    }, this), this.debug(this.pattern, A), A = A.filter(function(T) {
      return T.indexOf(!1) === -1;
    }), this.debug(this.pattern, A), this.set = A;
  }
  E.prototype.parseNegate = d;
  function d() {
    var h = this.pattern, y = !1, A = this.options, T = 0;
    if (!A.nonegate) {
      for (var O = 0, L = h.length; O < L && h.charAt(O) === "!"; O++)
        y = !y, T++;
      T && (this.pattern = h.substr(T)), this.negate = y;
    }
  }
  C.braceExpand = function(h, y) {
    return e(h, y);
  }, E.prototype.braceExpand = e;
  function e(h, y) {
    return y || (this instanceof E ? y = this.options : y = {}), h = typeof h > "u" ? this.pattern : h, S(h), y.nobrace || !/\{(?:(?!\{).)*\}/.test(h) ? [h] : _(h);
  }
  var l = 1024 * 64, S = function(h) {
    if (typeof h != "string")
      throw new TypeError("invalid pattern");
    if (h.length > l)
      throw new TypeError("pattern is too long");
  };
  E.prototype.parse = o;
  var u = {};
  function o(h, y) {
    S(h);
    var A = this.options;
    if (h === "**")
      if (A.noglobstar)
        h = "*";
      else
        return t;
    if (h === "") return "";
    var T = "", O = !!A.nocase, L = !1, W = [], H = [], q, P = !1, $ = -1, K = -1, Y = h.charAt(0) === "." ? "" : A.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", N = this;
    function U() {
      if (q) {
        switch (q) {
          case "*":
            T += i, O = !0;
            break;
          case "?":
            T += p, O = !0;
            break;
          default:
            T += "\\" + q;
            break;
        }
        N.debug("clearStateChar %j %j", q, T), q = !1;
      }
    }
    for (var Q = 0, X = h.length, k; Q < X && (k = h.charAt(Q)); Q++) {
      if (this.debug("%s	%s %s %j", h, Q, T, k), L && c[k]) {
        T += "\\" + k, L = !1;
        continue;
      }
      switch (k) {
        /* istanbul ignore next */
        case "/":
          return !1;
        case "\\":
          U(), L = !0;
          continue;
        // the various stateChar values
        // for the "extglob" stuff.
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", h, Q, T, k), P) {
            this.debug("  in class"), k === "!" && Q === K + 1 && (k = "^"), T += k;
            continue;
          }
          if (k === "*" && q === "*") continue;
          N.debug("call clearStateChar %j", q), U(), q = k, A.noext && U();
          continue;
        case "(":
          if (P) {
            T += "(";
            continue;
          }
          if (!q) {
            T += "\\(";
            continue;
          }
          W.push({
            type: q,
            start: Q - 1,
            reStart: T.length,
            open: g[q].open,
            close: g[q].close
          }), T += q === "!" ? "(?:(?!(?:" : "(?:", this.debug("plType %j %j", q, T), q = !1;
          continue;
        case ")":
          if (P || !W.length) {
            T += "\\)";
            continue;
          }
          U(), O = !0;
          var B = W.pop();
          T += B.close, B.type === "!" && H.push(B), B.reEnd = T.length;
          continue;
        case "|":
          if (P || !W.length || L) {
            T += "\\|", L = !1;
            continue;
          }
          U(), T += "|";
          continue;
        // these are mostly the same in regexp and glob
        case "[":
          if (U(), P) {
            T += "\\" + k;
            continue;
          }
          P = !0, K = Q, $ = T.length, T += k;
          continue;
        case "]":
          if (Q === K + 1 || !P) {
            T += "\\" + k, L = !1;
            continue;
          }
          var M = h.substring(K + 1, Q);
          try {
            RegExp("[" + M + "]");
          } catch {
            var G = this.parse(M, u);
            T = T.substr(0, $) + "\\[" + G[0] + "\\]", O = O || G[1], P = !1;
            continue;
          }
          O = !0, P = !1, T += k;
          continue;
        default:
          U(), L ? L = !1 : c[k] && !(k === "^" && P) && (T += "\\"), T += k;
      }
    }
    for (P && (M = h.substr(K + 1), G = this.parse(M, u), T = T.substr(0, $) + "\\[" + G[0], O = O || G[1]), B = W.pop(); B; B = W.pop()) {
      var V = T.slice(B.reStart + B.open.length);
      this.debug("setting tail", T, B), V = V.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(pe, le, ae) {
        return ae || (ae = "\\"), le + le + ae + "|";
      }), this.debug(`tail=%j
   %s`, V, V, B, T);
      var w = B.type === "*" ? i : B.type === "?" ? p : "\\" + B.type;
      O = !0, T = T.slice(0, B.reStart) + w + "\\(" + V;
    }
    U(), L && (T += "\\\\");
    var F = !1;
    switch (T.charAt(0)) {
      case "[":
      case ".":
      case "(":
        F = !0;
    }
    for (var I = H.length - 1; I > -1; I--) {
      var j = H[I], J = T.slice(0, j.reStart), z = T.slice(j.reStart, j.reEnd - 8), Z = T.slice(j.reEnd - 8, j.reEnd), re = T.slice(j.reEnd);
      Z += re;
      var De = J.split("(").length - 1, ve = re;
      for (Q = 0; Q < De; Q++)
        ve = ve.replace(/\)[+*?]?/, "");
      re = ve;
      var Te = "";
      re === "" && y !== u && (Te = "$");
      var Oe = J + z + re + Te + Z;
      T = Oe;
    }
    if (T !== "" && O && (T = "(?=.)" + T), F && (T = Y + T), y === u)
      return [T, O];
    if (!O)
      return R(h);
    var Ee = A.nocase ? "i" : "";
    try {
      var ce = new RegExp("^" + T + "$", Ee);
    } catch {
      return new RegExp("$.");
    }
    return ce._glob = h, ce._src = T, ce;
  }
  C.makeRe = function(h, y) {
    return new E(h, y || {}).makeRe();
  }, E.prototype.makeRe = D;
  function D() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    var h = this.set;
    if (!h.length)
      return this.regexp = !1, this.regexp;
    var y = this.options, A = y.noglobstar ? i : y.dot ? r : s, T = y.nocase ? "i" : "", O = h.map(function(L) {
      return L.map(function(W) {
        return W === t ? A : typeof W == "string" ? x(W) : W._src;
      }).join("\\/");
    }).join("|");
    O = "^(?:" + O + ")$", this.negate && (O = "^(?!" + O + ").*$");
    try {
      this.regexp = new RegExp(O, T);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  C.match = function(h, y, A) {
    A = A || {};
    var T = new E(y, A);
    return h = h.filter(function(O) {
      return T.match(O);
    }), T.options.nonull && !h.length && h.push(y), h;
  }, E.prototype.match = function(y, A) {
    if (typeof A > "u" && (A = this.partial), this.debug("match", y, this.pattern), this.comment) return !1;
    if (this.empty) return y === "";
    if (y === "/" && A) return !0;
    var T = this.options;
    n.sep !== "/" && (y = y.split(n.sep).join("/")), y = y.split(v), this.debug(this.pattern, "split", y);
    var O = this.set;
    this.debug(this.pattern, "set", O);
    var L, W;
    for (W = y.length - 1; W >= 0 && (L = y[W], !L); W--)
      ;
    for (W = 0; W < O.length; W++) {
      var H = O[W], q = y;
      T.matchBase && H.length === 1 && (q = [L]);
      var P = this.matchOne(q, H, A);
      if (P)
        return T.flipNegate ? !0 : !this.negate;
    }
    return T.flipNegate ? !1 : this.negate;
  }, E.prototype.matchOne = function(h, y, A) {
    return y.indexOf(t) !== -1 ? this._matchGlobstar(h, y, A, 0, 0) : this._matchOne(h, y, A, 0, 0);
  }, E.prototype._matchGlobstar = function(h, y, A, T, O) {
    var L, W = -1;
    for (L = O; L < y.length; L++)
      if (y[L] === t) {
        W = L;
        break;
      }
    var H = -1;
    for (L = y.length - 1; L >= 0; L--)
      if (y[L] === t) {
        H = L;
        break;
      }
    var q = y.slice(O, W), P = A ? y.slice(W + 1) : y.slice(W + 1, H), $ = A ? [] : y.slice(H + 1);
    if (q.length) {
      var K = h.slice(T, T + q.length);
      if (!this._matchOne(K, q, A, 0, 0))
        return !1;
      T += q.length;
    }
    var Y = 0;
    if ($.length) {
      if ($.length + T > h.length) return !1;
      var N = h.length - $.length;
      if (this._matchOne(h, $, A, N, 0))
        Y = $.length;
      else {
        if (h[h.length - 1] !== "" || T + $.length === h.length || (N--, !this._matchOne(h, $, A, N, 0)))
          return !1;
        Y = $.length + 1;
      }
    }
    if (!P.length) {
      var U = !!Y;
      for (L = T; L < h.length - Y; L++) {
        var Q = String(h[L]);
        if (U = !0, Q === "." || Q === ".." || !this.options.dot && Q.charAt(0) === ".")
          return !1;
      }
      return A || U;
    }
    for (var X = [[[], 0]], k = X[0], B = 0, M = [0], G = 0; G < P.length; G++) {
      var V = P[G];
      V === t ? (M.push(B), k = [[], 0], X.push(k)) : (k[0].push(V), B++);
    }
    for (var w = X.length - 1, F = h.length - Y, I = 0; I < X.length; I++)
      X[I][1] = F - (M[w--] + X[I][0].length);
    return !!this._matchGlobStarBodySections(
      h,
      X,
      T,
      0,
      A,
      0,
      !!Y
    );
  }, E.prototype._matchGlobStarBodySections = function(h, y, A, T, O, L, W) {
    var H = y[T];
    if (!H) {
      for (var q = A; q < h.length; q++) {
        W = !0;
        var P = h[q];
        if (P === "." || P === ".." || !this.options.dot && P.charAt(0) === ".")
          return !1;
      }
      return W;
    }
    for (var $ = H[0], K = H[1]; A <= K; ) {
      var Y = this._matchOne(
        h.slice(0, A + $.length),
        $,
        O,
        A,
        0
      );
      if (Y && L < this.maxGlobstarRecursion) {
        var N = this._matchGlobStarBodySections(
          h,
          y,
          A + $.length,
          T + 1,
          O,
          L + 1,
          W
        );
        if (N !== !1)
          return N;
      }
      var P = h[A];
      if (P === "." || P === ".." || !this.options.dot && P.charAt(0) === ".")
        return !1;
      A++;
    }
    return O || null;
  }, E.prototype._matchOne = function(h, y, A, T, O) {
    var L, W, H, q;
    for (L = T, W = O, H = h.length, q = y.length; L < H && W < q; L++, W++) {
      this.debug("matchOne loop");
      var P = y[W], $ = h[L];
      if (this.debug(y, P, $), P === !1 || P === t) return !1;
      var K;
      if (typeof P == "string" ? (K = $ === P, this.debug("string match", P, $, K)) : (K = $.match(P), this.debug("pattern match", P, $, K)), !K) return !1;
    }
    if (L === H && W === q)
      return !0;
    if (L === H)
      return A;
    if (W === q)
      return L === H - 1 && h[L] === "";
    throw new Error("wtf?");
  };
  function R(h) {
    return h.replace(/\\(.)/g, "$1");
  }
  function x(h) {
    return h.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  return Zt;
}
var Se = { exports: {} }, Bn;
function pr() {
  if (Bn) return Se.exports;
  Bn = 1;
  function n(_) {
    return _.charAt(0) === "/";
  }
  function t(_) {
    var g = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/, p = g.exec(_), i = p[1] || "", r = !!(i && i.charAt(1) !== ":");
    return !!(p[2] || r);
  }
  return Se.exports = process.platform === "win32" ? t : n, Se.exports.posix = n, Se.exports.win32 = t, Se.exports;
}
var oe = {}, kn;
function Ci() {
  if (kn) return oe;
  kn = 1, oe.setopts = m, oe.ownProp = n, oe.makeAbs = f, oe.finish = v, oe.mark = b, oe.isIgnored = C, oe.childrenIgnored = E;
  function n(a, d) {
    return Object.prototype.hasOwnProperty.call(a, d);
  }
  var t = se, _ = ie, g = vr(), p = pr(), i = g.Minimatch;
  function r(a, d) {
    return a.localeCompare(d, "en");
  }
  function s(a, d) {
    a.ignore = d.ignore || [], Array.isArray(a.ignore) || (a.ignore = [a.ignore]), a.ignore.length && (a.ignore = a.ignore.map(c));
  }
  function c(a) {
    var d = null;
    if (a.slice(-3) === "/**") {
      var e = a.replace(/(\/\*\*)+$/, "");
      d = new i(e, { dot: !0 });
    }
    return {
      matcher: new i(a, { dot: !0 }),
      gmatcher: d
    };
  }
  function m(a, d, e) {
    if (e || (e = {}), e.matchBase && d.indexOf("/") === -1) {
      if (e.noglobstar)
        throw new Error("base matching requires globstar");
      d = "**/" + d;
    }
    a.silent = !!e.silent, a.pattern = d, a.strict = e.strict !== !1, a.realpath = !!e.realpath, a.realpathCache = e.realpathCache || /* @__PURE__ */ Object.create(null), a.follow = !!e.follow, a.dot = !!e.dot, a.mark = !!e.mark, a.nodir = !!e.nodir, a.nodir && (a.mark = !0), a.sync = !!e.sync, a.nounique = !!e.nounique, a.nonull = !!e.nonull, a.nosort = !!e.nosort, a.nocase = !!e.nocase, a.stat = !!e.stat, a.noprocess = !!e.noprocess, a.absolute = !!e.absolute, a.fs = e.fs || t, a.maxLength = e.maxLength || 1 / 0, a.cache = e.cache || /* @__PURE__ */ Object.create(null), a.statCache = e.statCache || /* @__PURE__ */ Object.create(null), a.symlinks = e.symlinks || /* @__PURE__ */ Object.create(null), s(a, e), a.changedCwd = !1;
    var l = process.cwd();
    n(e, "cwd") ? (a.cwd = _.resolve(e.cwd), a.changedCwd = a.cwd !== l) : a.cwd = l, a.root = e.root || _.resolve(a.cwd, "/"), a.root = _.resolve(a.root), process.platform === "win32" && (a.root = a.root.replace(/\\/g, "/")), a.cwdAbs = p(a.cwd) ? a.cwd : f(a, a.cwd), process.platform === "win32" && (a.cwdAbs = a.cwdAbs.replace(/\\/g, "/")), a.nomount = !!e.nomount, e.nonegate = !0, e.nocomment = !0, e.allowWindowsEscape = !1, a.minimatch = new i(d, e), a.options = a.minimatch.options;
  }
  function v(a) {
    for (var d = a.nounique, e = d ? [] : /* @__PURE__ */ Object.create(null), l = 0, S = a.matches.length; l < S; l++) {
      var u = a.matches[l];
      if (!u || Object.keys(u).length === 0) {
        if (a.nonull) {
          var o = a.minimatch.globSet[l];
          d ? e.push(o) : e[o] = !0;
        }
      } else {
        var D = Object.keys(u);
        d ? e.push.apply(e, D) : D.forEach(function(R) {
          e[R] = !0;
        });
      }
    }
    if (d || (e = Object.keys(e)), a.nosort || (e = e.sort(r)), a.mark) {
      for (var l = 0; l < e.length; l++)
        e[l] = a._mark(e[l]);
      a.nodir && (e = e.filter(function(R) {
        var x = !/\/$/.test(R), h = a.cache[R] || a.cache[f(a, R)];
        return x && h && (x = h !== "DIR" && !Array.isArray(h)), x;
      }));
    }
    a.ignore.length && (e = e.filter(function(R) {
      return !C(a, R);
    })), a.found = e;
  }
  function b(a, d) {
    var e = f(a, d), l = a.cache[e], S = d;
    if (l) {
      var u = l === "DIR" || Array.isArray(l), o = d.slice(-1) === "/";
      if (u && !o ? S += "/" : !u && o && (S = S.slice(0, -1)), S !== d) {
        var D = f(a, S);
        a.statCache[D] = a.statCache[e], a.cache[D] = a.cache[e];
      }
    }
    return S;
  }
  function f(a, d) {
    var e = d;
    return d.charAt(0) === "/" ? e = _.join(a.root, d) : p(d) || d === "" ? e = d : a.changedCwd ? e = _.resolve(a.cwd, d) : e = _.resolve(d), process.platform === "win32" && (e = e.replace(/\\/g, "/")), e;
  }
  function C(a, d) {
    return a.ignore.length ? a.ignore.some(function(e) {
      return e.matcher.match(d) || !!(e.gmatcher && e.gmatcher.match(d));
    }) : !1;
  }
  function E(a, d) {
    return a.ignore.length ? a.ignore.some(function(e) {
      return !!(e.gmatcher && e.gmatcher.match(d));
    }) : !1;
  }
  return oe;
}
var Jt, Nn;
function Pa() {
  if (Nn) return Jt;
  Nn = 1, Jt = v, v.GlobSync = b;
  var n = Fi(), t = vr();
  t.Minimatch, Ai().Glob;
  var _ = ie, g = Qe, p = pr(), i = Ci(), r = i.setopts, s = i.ownProp, c = i.childrenIgnored, m = i.isIgnored;
  function v(f, C) {
    if (typeof C == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    return new b(f, C).found;
  }
  function b(f, C) {
    if (!f)
      throw new Error("must provide pattern");
    if (typeof C == "function" || arguments.length === 3)
      throw new TypeError(`callback provided to sync glob
See: https://github.com/isaacs/node-glob/issues/167`);
    if (!(this instanceof b))
      return new b(f, C);
    if (r(this, f, C), this.noprocess)
      return this;
    var E = this.minimatch.set.length;
    this.matches = new Array(E);
    for (var a = 0; a < E; a++)
      this._process(this.minimatch.set[a], a, !1);
    this._finish();
  }
  return b.prototype._finish = function() {
    if (g.ok(this instanceof b), this.realpath) {
      var f = this;
      this.matches.forEach(function(C, E) {
        var a = f.matches[E] = /* @__PURE__ */ Object.create(null);
        for (var d in C)
          try {
            d = f._makeAbs(d);
            var e = n.realpathSync(d, f.realpathCache);
            a[e] = !0;
          } catch (l) {
            if (l.syscall === "stat")
              a[f._makeAbs(d)] = !0;
            else
              throw l;
          }
      });
    }
    i.finish(this);
  }, b.prototype._process = function(f, C, E) {
    g.ok(this instanceof b);
    for (var a = 0; typeof f[a] == "string"; )
      a++;
    var d;
    switch (a) {
      // if not, then this is rather simple
      case f.length:
        this._processSimple(f.join("/"), C);
        return;
      case 0:
        d = null;
        break;
      default:
        d = f.slice(0, a).join("/");
        break;
    }
    var e = f.slice(a), l;
    d === null ? l = "." : ((p(d) || p(f.map(function(o) {
      return typeof o == "string" ? o : "[*]";
    }).join("/"))) && (!d || !p(d)) && (d = "/" + d), l = d);
    var S = this._makeAbs(l);
    if (!c(this, l)) {
      var u = e[0] === t.GLOBSTAR;
      u ? this._processGlobStar(d, l, S, e, C, E) : this._processReaddir(d, l, S, e, C, E);
    }
  }, b.prototype._processReaddir = function(f, C, E, a, d, e) {
    var l = this._readdir(E, e);
    if (l) {
      for (var S = a[0], u = !!this.minimatch.negate, o = S._glob, D = this.dot || o.charAt(0) === ".", R = [], x = 0; x < l.length; x++) {
        var h = l[x];
        if (h.charAt(0) !== "." || D) {
          var y;
          u && !f ? y = !h.match(S) : y = h.match(S), y && R.push(h);
        }
      }
      var A = R.length;
      if (A !== 0) {
        if (a.length === 1 && !this.mark && !this.stat) {
          this.matches[d] || (this.matches[d] = /* @__PURE__ */ Object.create(null));
          for (var x = 0; x < A; x++) {
            var h = R[x];
            f && (f.slice(-1) !== "/" ? h = f + "/" + h : h = f + h), h.charAt(0) === "/" && !this.nomount && (h = _.join(this.root, h)), this._emitMatch(d, h);
          }
          return;
        }
        a.shift();
        for (var x = 0; x < A; x++) {
          var h = R[x], T;
          f ? T = [f, h] : T = [h], this._process(T.concat(a), d, e);
        }
      }
    }
  }, b.prototype._emitMatch = function(f, C) {
    if (!m(this, C)) {
      var E = this._makeAbs(C);
      if (this.mark && (C = this._mark(C)), this.absolute && (C = E), !this.matches[f][C]) {
        if (this.nodir) {
          var a = this.cache[E];
          if (a === "DIR" || Array.isArray(a))
            return;
        }
        this.matches[f][C] = !0, this.stat && this._stat(C);
      }
    }
  }, b.prototype._readdirInGlobStar = function(f) {
    if (this.follow)
      return this._readdir(f, !1);
    var C, E;
    try {
      E = this.fs.lstatSync(f);
    } catch (d) {
      if (d.code === "ENOENT")
        return null;
    }
    var a = E && E.isSymbolicLink();
    return this.symlinks[f] = a, !a && E && !E.isDirectory() ? this.cache[f] = "FILE" : C = this._readdir(f, !1), C;
  }, b.prototype._readdir = function(f, C) {
    if (C && !s(this.symlinks, f))
      return this._readdirInGlobStar(f);
    if (s(this.cache, f)) {
      var E = this.cache[f];
      if (!E || E === "FILE")
        return null;
      if (Array.isArray(E))
        return E;
    }
    try {
      return this._readdirEntries(f, this.fs.readdirSync(f));
    } catch (a) {
      return this._readdirError(f, a), null;
    }
  }, b.prototype._readdirEntries = function(f, C) {
    if (!this.mark && !this.stat)
      for (var E = 0; E < C.length; E++) {
        var a = C[E];
        f === "/" ? a = f + a : a = f + "/" + a, this.cache[a] = !0;
      }
    return this.cache[f] = C, C;
  }, b.prototype._readdirError = function(f, C) {
    switch (C.code) {
      case "ENOTSUP":
      // https://github.com/isaacs/node-glob/issues/205
      case "ENOTDIR":
        var E = this._makeAbs(f);
        if (this.cache[E] = "FILE", E === this.cwdAbs) {
          var a = new Error(C.code + " invalid cwd " + this.cwd);
          throw a.path = this.cwd, a.code = C.code, a;
        }
        break;
      case "ENOENT":
      // not terribly unusual
      case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(f)] = !1;
        break;
      default:
        if (this.cache[this._makeAbs(f)] = !1, this.strict)
          throw C;
        this.silent || console.error("glob error", C);
        break;
    }
  }, b.prototype._processGlobStar = function(f, C, E, a, d, e) {
    var l = this._readdir(E, e);
    if (l) {
      var S = a.slice(1), u = f ? [f] : [], o = u.concat(S);
      this._process(o, d, !1);
      var D = l.length, R = this.symlinks[E];
      if (!(R && e))
        for (var x = 0; x < D; x++) {
          var h = l[x];
          if (!(h.charAt(0) === "." && !this.dot)) {
            var y = u.concat(l[x], S);
            this._process(y, d, !0);
            var A = u.concat(l[x], a);
            this._process(A, d, !0);
          }
        }
    }
  }, b.prototype._processSimple = function(f, C) {
    var E = this._stat(f);
    if (this.matches[C] || (this.matches[C] = /* @__PURE__ */ Object.create(null)), !!E) {
      if (f && p(f) && !this.nomount) {
        var a = /[\/\\]$/.test(f);
        f.charAt(0) === "/" ? f = _.join(this.root, f) : (f = _.resolve(this.root, f), a && (f += "/"));
      }
      process.platform === "win32" && (f = f.replace(/\\/g, "/")), this._emitMatch(C, f);
    }
  }, b.prototype._stat = function(f) {
    var C = this._makeAbs(f), E = f.slice(-1) === "/";
    if (f.length > this.maxLength)
      return !1;
    if (!this.stat && s(this.cache, C)) {
      var e = this.cache[C];
      if (Array.isArray(e) && (e = "DIR"), !E || e === "DIR")
        return e;
      if (E && e === "FILE")
        return !1;
    }
    var a = this.statCache[C];
    if (!a) {
      var d;
      try {
        d = this.fs.lstatSync(C);
      } catch (l) {
        if (l && (l.code === "ENOENT" || l.code === "ENOTDIR"))
          return this.statCache[C] = !1, !1;
      }
      if (d && d.isSymbolicLink())
        try {
          a = this.fs.statSync(C);
        } catch {
          a = d;
        }
      else
        a = d;
    }
    this.statCache[C] = a;
    var e = !0;
    return a && (e = a.isDirectory() ? "DIR" : "FILE"), this.cache[C] = this.cache[C] || e, E && e === "FILE" ? !1 : e;
  }, b.prototype._mark = function(f) {
    return i.mark(this, f);
  }, b.prototype._makeAbs = function(f) {
    return i.makeAbs(this, f);
  }, Jt;
}
var Xt, In;
function Si() {
  if (In) return Xt;
  In = 1, Xt = n;
  function n(t, _) {
    if (t && _) return n(t)(_);
    if (typeof t != "function")
      throw new TypeError("need wrapper function");
    return Object.keys(t).forEach(function(p) {
      g[p] = t[p];
    }), g;
    function g() {
      for (var p = new Array(arguments.length), i = 0; i < p.length; i++)
        p[i] = arguments[i];
      var r = t.apply(this, p), s = p[p.length - 1];
      return typeof r == "function" && r !== s && Object.keys(s).forEach(function(c) {
        r[c] = s[c];
      }), r;
    }
  }
  return Xt;
}
var Ue = { exports: {} }, Ln;
function Ri() {
  if (Ln) return Ue.exports;
  Ln = 1;
  var n = Si();
  Ue.exports = n(t), Ue.exports.strict = n(_), t.proto = t(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return t(this);
      },
      configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return _(this);
      },
      configurable: !0
    });
  });
  function t(g) {
    var p = function() {
      return p.called ? p.value : (p.called = !0, p.value = g.apply(this, arguments));
    };
    return p.called = !1, p;
  }
  function _(g) {
    var p = function() {
      if (p.called)
        throw new Error(p.onceError);
      return p.called = !0, p.value = g.apply(this, arguments);
    }, i = g.name || "Function wrapped with `once`";
    return p.onceError = i + " shouldn't be called more than once", p.called = !1, p;
  }
  return Ue.exports;
}
var er, Mn;
function qa() {
  if (Mn) return er;
  Mn = 1;
  var n = Si(), t = /* @__PURE__ */ Object.create(null), _ = Ri();
  er = n(g);
  function g(r, s) {
    return t[r] ? (t[r].push(s), null) : (t[r] = [s], p(r));
  }
  function p(r) {
    return _(function s() {
      var c = t[r], m = c.length, v = i(arguments);
      try {
        for (var b = 0; b < m; b++)
          c[b].apply(null, v);
      } finally {
        c.length > m ? (c.splice(0, m), process.nextTick(function() {
          s.apply(null, v);
        })) : delete t[r];
      }
    });
  }
  function i(r) {
    for (var s = r.length, c = [], m = 0; m < s; m++) c[m] = r[m];
    return c;
  }
  return er;
}
var tr, Pn;
function Ai() {
  if (Pn) return tr;
  Pn = 1, tr = a;
  var n = Fi(), t = vr();
  t.Minimatch;
  var _ = ye(), g = ge.EventEmitter, p = ie, i = Qe, r = pr(), s = Pa(), c = Ci(), m = c.setopts, v = c.ownProp, b = qa(), f = c.childrenIgnored, C = c.isIgnored, E = Ri();
  function a(u, o, D) {
    if (typeof o == "function" && (D = o, o = {}), o || (o = {}), o.sync) {
      if (D)
        throw new TypeError("callback provided to sync glob");
      return s(u, o);
    }
    return new l(u, o, D);
  }
  a.sync = s;
  var d = a.GlobSync = s.GlobSync;
  a.glob = a;
  function e(u, o) {
    if (o === null || typeof o != "object")
      return u;
    for (var D = Object.keys(o), R = D.length; R--; )
      u[D[R]] = o[D[R]];
    return u;
  }
  a.hasMagic = function(u, o) {
    var D = e({}, o);
    D.noprocess = !0;
    var R = new l(u, D), x = R.minimatch.set;
    if (!u)
      return !1;
    if (x.length > 1)
      return !0;
    for (var h = 0; h < x[0].length; h++)
      if (typeof x[0][h] != "string")
        return !0;
    return !1;
  }, a.Glob = l, _(l, g);
  function l(u, o, D) {
    if (typeof o == "function" && (D = o, o = null), o && o.sync) {
      if (D)
        throw new TypeError("callback provided to sync glob");
      return new d(u, o);
    }
    if (!(this instanceof l))
      return new l(u, o, D);
    m(this, u, o), this._didRealPath = !1;
    var R = this.minimatch.set.length;
    this.matches = new Array(R), typeof D == "function" && (D = E(D), this.on("error", D), this.on("end", function(T) {
      D(null, T);
    }));
    var x = this;
    if (this._processing = 0, this._emitQueue = [], this._processQueue = [], this.paused = !1, this.noprocess)
      return this;
    if (R === 0)
      return A();
    for (var h = !0, y = 0; y < R; y++)
      this._process(this.minimatch.set[y], y, !1, A);
    h = !1;
    function A() {
      --x._processing, x._processing <= 0 && (h ? process.nextTick(function() {
        x._finish();
      }) : x._finish());
    }
  }
  l.prototype._finish = function() {
    if (i(this instanceof l), !this.aborted) {
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      c.finish(this), this.emit("end", this.found);
    }
  }, l.prototype._realpath = function() {
    if (this._didRealpath)
      return;
    this._didRealpath = !0;
    var u = this.matches.length;
    if (u === 0)
      return this._finish();
    for (var o = this, D = 0; D < this.matches.length; D++)
      this._realpathSet(D, R);
    function R() {
      --u === 0 && o._finish();
    }
  }, l.prototype._realpathSet = function(u, o) {
    var D = this.matches[u];
    if (!D)
      return o();
    var R = Object.keys(D), x = this, h = R.length;
    if (h === 0)
      return o();
    var y = this.matches[u] = /* @__PURE__ */ Object.create(null);
    R.forEach(function(A, T) {
      A = x._makeAbs(A), n.realpath(A, x.realpathCache, function(O, L) {
        O ? O.syscall === "stat" ? y[A] = !0 : x.emit("error", O) : y[L] = !0, --h === 0 && (x.matches[u] = y, o());
      });
    });
  }, l.prototype._mark = function(u) {
    return c.mark(this, u);
  }, l.prototype._makeAbs = function(u) {
    return c.makeAbs(this, u);
  }, l.prototype.abort = function() {
    this.aborted = !0, this.emit("abort");
  }, l.prototype.pause = function() {
    this.paused || (this.paused = !0, this.emit("pause"));
  }, l.prototype.resume = function() {
    if (this.paused) {
      if (this.emit("resume"), this.paused = !1, this._emitQueue.length) {
        var u = this._emitQueue.slice(0);
        this._emitQueue.length = 0;
        for (var o = 0; o < u.length; o++) {
          var D = u[o];
          this._emitMatch(D[0], D[1]);
        }
      }
      if (this._processQueue.length) {
        var R = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (var o = 0; o < R.length; o++) {
          var x = R[o];
          this._processing--, this._process(x[0], x[1], x[2], x[3]);
        }
      }
    }
  }, l.prototype._process = function(u, o, D, R) {
    if (i(this instanceof l), i(typeof R == "function"), !this.aborted) {
      if (this._processing++, this.paused) {
        this._processQueue.push([u, o, D, R]);
        return;
      }
      for (var x = 0; typeof u[x] == "string"; )
        x++;
      var h;
      switch (x) {
        // if not, then this is rather simple
        case u.length:
          this._processSimple(u.join("/"), o, R);
          return;
        case 0:
          h = null;
          break;
        default:
          h = u.slice(0, x).join("/");
          break;
      }
      var y = u.slice(x), A;
      h === null ? A = "." : ((r(h) || r(u.map(function(L) {
        return typeof L == "string" ? L : "[*]";
      }).join("/"))) && (!h || !r(h)) && (h = "/" + h), A = h);
      var T = this._makeAbs(A);
      if (f(this, A))
        return R();
      var O = y[0] === t.GLOBSTAR;
      O ? this._processGlobStar(h, A, T, y, o, D, R) : this._processReaddir(h, A, T, y, o, D, R);
    }
  }, l.prototype._processReaddir = function(u, o, D, R, x, h, y) {
    var A = this;
    this._readdir(D, h, function(T, O) {
      return A._processReaddir2(u, o, D, R, x, h, O, y);
    });
  }, l.prototype._processReaddir2 = function(u, o, D, R, x, h, y, A) {
    if (!y)
      return A();
    for (var T = R[0], O = !!this.minimatch.negate, L = T._glob, W = this.dot || L.charAt(0) === ".", H = [], q = 0; q < y.length; q++) {
      var P = y[q];
      if (P.charAt(0) !== "." || W) {
        var $;
        O && !u ? $ = !P.match(T) : $ = P.match(T), $ && H.push(P);
      }
    }
    var K = H.length;
    if (K === 0)
      return A();
    if (R.length === 1 && !this.mark && !this.stat) {
      this.matches[x] || (this.matches[x] = /* @__PURE__ */ Object.create(null));
      for (var q = 0; q < K; q++) {
        var P = H[q];
        u && (u !== "/" ? P = u + "/" + P : P = u + P), P.charAt(0) === "/" && !this.nomount && (P = p.join(this.root, P)), this._emitMatch(x, P);
      }
      return A();
    }
    R.shift();
    for (var q = 0; q < K; q++) {
      var P = H[q];
      u && (u !== "/" ? P = u + "/" + P : P = u + P), this._process([P].concat(R), x, h, A);
    }
    A();
  }, l.prototype._emitMatch = function(u, o) {
    if (!this.aborted && !C(this, o)) {
      if (this.paused) {
        this._emitQueue.push([u, o]);
        return;
      }
      var D = r(o) ? o : this._makeAbs(o);
      if (this.mark && (o = this._mark(o)), this.absolute && (o = D), !this.matches[u][o]) {
        if (this.nodir) {
          var R = this.cache[D];
          if (R === "DIR" || Array.isArray(R))
            return;
        }
        this.matches[u][o] = !0;
        var x = this.statCache[D];
        x && this.emit("stat", o, x), this.emit("match", o);
      }
    }
  }, l.prototype._readdirInGlobStar = function(u, o) {
    if (this.aborted)
      return;
    if (this.follow)
      return this._readdir(u, !1, o);
    var D = "lstat\0" + u, R = this, x = b(D, h);
    x && R.fs.lstat(u, x);
    function h(y, A) {
      if (y && y.code === "ENOENT")
        return o();
      var T = A && A.isSymbolicLink();
      R.symlinks[u] = T, !T && A && !A.isDirectory() ? (R.cache[u] = "FILE", o()) : R._readdir(u, !1, o);
    }
  }, l.prototype._readdir = function(u, o, D) {
    if (!this.aborted && (D = b("readdir\0" + u + "\0" + o, D), !!D)) {
      if (o && !v(this.symlinks, u))
        return this._readdirInGlobStar(u, D);
      if (v(this.cache, u)) {
        var R = this.cache[u];
        if (!R || R === "FILE")
          return D();
        if (Array.isArray(R))
          return D(null, R);
      }
      var x = this;
      x.fs.readdir(u, S(this, u, D));
    }
  };
  function S(u, o, D) {
    return function(R, x) {
      R ? u._readdirError(o, R, D) : u._readdirEntries(o, x, D);
    };
  }
  return l.prototype._readdirEntries = function(u, o, D) {
    if (!this.aborted) {
      if (!this.mark && !this.stat)
        for (var R = 0; R < o.length; R++) {
          var x = o[R];
          u === "/" ? x = u + x : x = u + "/" + x, this.cache[x] = !0;
        }
      return this.cache[u] = o, D(null, o);
    }
  }, l.prototype._readdirError = function(u, o, D) {
    if (!this.aborted) {
      switch (o.code) {
        case "ENOTSUP":
        // https://github.com/isaacs/node-glob/issues/205
        case "ENOTDIR":
          var R = this._makeAbs(u);
          if (this.cache[R] = "FILE", R === this.cwdAbs) {
            var x = new Error(o.code + " invalid cwd " + this.cwd);
            x.path = this.cwd, x.code = o.code, this.emit("error", x), this.abort();
          }
          break;
        case "ENOENT":
        // not terribly unusual
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(u)] = !1;
          break;
        default:
          this.cache[this._makeAbs(u)] = !1, this.strict && (this.emit("error", o), this.abort()), this.silent || console.error("glob error", o);
          break;
      }
      return D();
    }
  }, l.prototype._processGlobStar = function(u, o, D, R, x, h, y) {
    var A = this;
    this._readdir(D, h, function(T, O) {
      A._processGlobStar2(u, o, D, R, x, h, O, y);
    });
  }, l.prototype._processGlobStar2 = function(u, o, D, R, x, h, y, A) {
    if (!y)
      return A();
    var T = R.slice(1), O = u ? [u] : [], L = O.concat(T);
    this._process(L, x, !1, A);
    var W = this.symlinks[D], H = y.length;
    if (W && h)
      return A();
    for (var q = 0; q < H; q++) {
      var P = y[q];
      if (!(P.charAt(0) === "." && !this.dot)) {
        var $ = O.concat(y[q], T);
        this._process($, x, !0, A);
        var K = O.concat(y[q], R);
        this._process(K, x, !0, A);
      }
    }
    A();
  }, l.prototype._processSimple = function(u, o, D) {
    var R = this;
    this._stat(u, function(x, h) {
      R._processSimple2(u, o, x, h, D);
    });
  }, l.prototype._processSimple2 = function(u, o, D, R, x) {
    if (this.matches[o] || (this.matches[o] = /* @__PURE__ */ Object.create(null)), !R)
      return x();
    if (u && r(u) && !this.nomount) {
      var h = /[\/\\]$/.test(u);
      u.charAt(0) === "/" ? u = p.join(this.root, u) : (u = p.resolve(this.root, u), h && (u += "/"));
    }
    process.platform === "win32" && (u = u.replace(/\\/g, "/")), this._emitMatch(o, u), x();
  }, l.prototype._stat = function(u, o) {
    var D = this._makeAbs(u), R = u.slice(-1) === "/";
    if (u.length > this.maxLength)
      return o();
    if (!this.stat && v(this.cache, D)) {
      var x = this.cache[D];
      if (Array.isArray(x) && (x = "DIR"), !R || x === "DIR")
        return o(null, x);
      if (R && x === "FILE")
        return o();
    }
    var h = this.statCache[D];
    if (h !== void 0) {
      if (h === !1)
        return o(null, h);
      var y = h.isDirectory() ? "DIR" : "FILE";
      return R && y === "FILE" ? o() : o(null, y, h);
    }
    var A = this, T = b("stat\0" + D, O);
    T && A.fs.lstat(D, T);
    function O(L, W) {
      if (W && W.isSymbolicLink())
        return A.fs.stat(D, function(H, q) {
          H ? A._stat2(u, D, null, W, o) : A._stat2(u, D, H, q, o);
        });
      A._stat2(u, D, L, W, o);
    }
  }, l.prototype._stat2 = function(u, o, D, R, x) {
    if (D && (D.code === "ENOENT" || D.code === "ENOTDIR"))
      return this.statCache[o] = !1, x();
    var h = u.slice(-1) === "/";
    if (this.statCache[o] = R, o.slice(-1) === "/" && R && !R.isDirectory())
      return x(null, !1, R);
    var y = !0;
    return R && (y = R.isDirectory() ? "DIR" : "FILE"), this.cache[o] = this.cache[o] || y, h && y === "FILE" ? x() : x(null, y, R);
  }, tr;
}
var rr, qn;
function jn() {
  if (qn) return rr;
  qn = 1;
  const n = Qe, t = ie, _ = se;
  let g;
  try {
    g = Ai();
  } catch {
  }
  const p = {
    nosort: !0,
    silent: !0
  };
  let i = 0;
  const r = process.platform === "win32", s = (e) => {
    if ([
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((S) => {
      e[S] = e[S] || _[S], S = S + "Sync", e[S] = e[S] || _[S];
    }), e.maxBusyTries = e.maxBusyTries || 3, e.emfileWait = e.emfileWait || 1e3, e.glob === !1 && (e.disableGlob = !0), e.disableGlob !== !0 && g === void 0)
      throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
    e.disableGlob = e.disableGlob || !1, e.glob = e.glob || p;
  }, c = (e, l, S) => {
    typeof l == "function" && (S = l, l = {}), n(e, "rimraf: missing path"), n.equal(typeof e, "string", "rimraf: path should be a string"), n.equal(typeof S, "function", "rimraf: callback function required"), n(l, "rimraf: invalid options argument provided"), n.equal(typeof l, "object", "rimraf: options should be object"), s(l);
    let u = 0, o = null, D = 0;
    const R = (h) => {
      o = o || h, --D === 0 && S(o);
    }, x = (h, y) => {
      if (h)
        return S(h);
      if (D = y.length, D === 0)
        return S();
      y.forEach((A) => {
        const T = (O) => {
          if (O) {
            if ((O.code === "EBUSY" || O.code === "ENOTEMPTY" || O.code === "EPERM") && u < l.maxBusyTries)
              return u++, setTimeout(() => m(A, l, T), u * 100);
            if (O.code === "EMFILE" && i < l.emfileWait)
              return setTimeout(() => m(A, l, T), i++);
            O.code === "ENOENT" && (O = null);
          }
          i = 0, R(O);
        };
        m(A, l, T);
      });
    };
    if (l.disableGlob || !g.hasMagic(e))
      return x(null, [e]);
    l.lstat(e, (h, y) => {
      if (!h)
        return x(null, [e]);
      g(e, l.glob, x);
    });
  }, m = (e, l, S) => {
    n(e), n(l), n(typeof S == "function"), l.lstat(e, (u, o) => {
      if (u && u.code === "ENOENT")
        return S(null);
      if (u && u.code === "EPERM" && r && v(e, l, u, S), o && o.isDirectory())
        return f(e, l, u, S);
      l.unlink(e, (D) => {
        if (D) {
          if (D.code === "ENOENT")
            return S(null);
          if (D.code === "EPERM")
            return r ? v(e, l, D, S) : f(e, l, D, S);
          if (D.code === "EISDIR")
            return f(e, l, D, S);
        }
        return S(D);
      });
    });
  }, v = (e, l, S, u) => {
    n(e), n(l), n(typeof u == "function"), l.chmod(e, 438, (o) => {
      o ? u(o.code === "ENOENT" ? null : S) : l.stat(e, (D, R) => {
        D ? u(D.code === "ENOENT" ? null : S) : R.isDirectory() ? f(e, l, S, u) : l.unlink(e, u);
      });
    });
  }, b = (e, l, S) => {
    n(e), n(l);
    try {
      l.chmodSync(e, 438);
    } catch (o) {
      if (o.code === "ENOENT")
        return;
      throw S;
    }
    let u;
    try {
      u = l.statSync(e);
    } catch (o) {
      if (o.code === "ENOENT")
        return;
      throw S;
    }
    u.isDirectory() ? a(e, l, S) : l.unlinkSync(e);
  }, f = (e, l, S, u) => {
    n(e), n(l), n(typeof u == "function"), l.rmdir(e, (o) => {
      o && (o.code === "ENOTEMPTY" || o.code === "EEXIST" || o.code === "EPERM") ? C(e, l, u) : o && o.code === "ENOTDIR" ? u(S) : u(o);
    });
  }, C = (e, l, S) => {
    n(e), n(l), n(typeof S == "function"), l.readdir(e, (u, o) => {
      if (u)
        return S(u);
      let D = o.length;
      if (D === 0)
        return l.rmdir(e, S);
      let R;
      o.forEach((x) => {
        c(t.join(e, x), l, (h) => {
          if (!R) {
            if (h)
              return S(R = h);
            --D === 0 && l.rmdir(e, S);
          }
        });
      });
    });
  }, E = (e, l) => {
    l = l || {}, s(l), n(e, "rimraf: missing path"), n.equal(typeof e, "string", "rimraf: path should be a string"), n(l, "rimraf: missing options"), n.equal(typeof l, "object", "rimraf: options should be object");
    let S;
    if (l.disableGlob || !g.hasMagic(e))
      S = [e];
    else
      try {
        l.lstatSync(e), S = [e];
      } catch {
        S = g.sync(e, l.glob);
      }
    if (S.length)
      for (let u = 0; u < S.length; u++) {
        const o = S[u];
        let D;
        try {
          D = l.lstatSync(o);
        } catch (R) {
          if (R.code === "ENOENT")
            return;
          R.code === "EPERM" && r && b(o, l, R);
        }
        try {
          D && D.isDirectory() ? a(o, l, null) : l.unlinkSync(o);
        } catch (R) {
          if (R.code === "ENOENT")
            return;
          if (R.code === "EPERM")
            return r ? b(o, l, R) : a(o, l, R);
          if (R.code !== "EISDIR")
            throw R;
          a(o, l, R);
        }
      }
  }, a = (e, l, S) => {
    n(e), n(l);
    try {
      l.rmdirSync(e);
    } catch (u) {
      if (u.code === "ENOENT")
        return;
      if (u.code === "ENOTDIR")
        throw S;
      (u.code === "ENOTEMPTY" || u.code === "EEXIST" || u.code === "EPERM") && d(e, l);
    }
  }, d = (e, l) => {
    n(e), n(l), l.readdirSync(e).forEach((o) => E(t.join(e, o), l));
    const S = r ? 100 : 1;
    let u = 0;
    do {
      let o = !0;
      try {
        const D = l.rmdirSync(e, l);
        return o = !1, D;
      } finally {
        if (++u < S && o)
          continue;
      }
    } while (!0);
  };
  return rr = c, c.sync = E, rr;
}
Re.exports;
var Wn;
function _r() {
  return Wn || (Wn = 1, (function(n, t) {
    const _ = se;
    n.exports = t;
    const g = process.version.substr(1).replace(/-.*$/, "").split(".").map((s) => +s), p = [
      "build",
      "clean",
      "configure",
      "package",
      "publish",
      "reveal",
      "testbinary",
      "testpackage",
      "unpublish"
    ], i = "napi_build_version=";
    n.exports.get_napi_version = function() {
      let s = process.versions.napi;
      return s || (g[0] === 9 && g[1] >= 3 ? s = 2 : g[0] === 8 && (s = 1)), s;
    }, n.exports.get_napi_version_as_string = function(s) {
      const c = n.exports.get_napi_version(s);
      return c ? "" + c : "";
    }, n.exports.validate_package_json = function(s, c) {
      const m = s.binary, v = r(m.module_path), b = r(m.remote_path), f = r(m.package_name), C = n.exports.get_napi_build_versions(s, c, !0), E = n.exports.get_napi_build_versions_raw(s);
      if (C && C.forEach((a) => {
        if (!(parseInt(a, 10) === a && a > 0))
          throw new Error("All values specified in napi_versions must be positive integers.");
      }), C && (!v || !b && !f))
        throw new Error("When napi_versions is specified; module_path and either remote_path or package_name must contain the substitution string '{napi_build_version}`.");
      if ((v || b || f) && !E)
        throw new Error("When the substitution string '{napi_build_version}` is specified in module_path, remote_path, or package_name; napi_versions must also be specified.");
      if (C && !n.exports.get_best_napi_build_version(s, c) && n.exports.build_napi_only(s))
        throw new Error(
          "The Node-API version of this Node instance is " + n.exports.get_napi_version(c ? c.target : void 0) + ". This module supports Node-API version(s) " + n.exports.get_napi_build_versions_raw(s) + ". This Node instance cannot run this module."
        );
      if (E && !C && n.exports.build_napi_only(s))
        throw new Error(
          "The Node-API version of this Node instance is " + n.exports.get_napi_version(c ? c.target : void 0) + ". This module supports Node-API version(s) " + n.exports.get_napi_build_versions_raw(s) + ". This Node instance cannot run this module."
        );
    };
    function r(s) {
      return s && (s.indexOf("{napi_build_version}") !== -1 || s.indexOf("{node_napi_label}") !== -1);
    }
    n.exports.expand_commands = function(s, c, m) {
      const v = [], b = n.exports.get_napi_build_versions(s, c);
      return m.forEach((f) => {
        if (b && f.name === "install") {
          const C = n.exports.get_best_napi_build_version(s, c), E = C ? [i + C] : [];
          v.push({ name: f.name, args: E });
        } else b && p.indexOf(f.name) !== -1 ? b.forEach((C) => {
          const E = f.args.slice();
          E.push(i + C), v.push({ name: f.name, args: E });
        }) : v.push(f);
      }), v;
    }, n.exports.get_napi_build_versions = function(s, c, m) {
      const v = wi();
      let b = [];
      const f = n.exports.get_napi_version(c ? c.target : void 0);
      if (s.binary && s.binary.napi_versions && s.binary.napi_versions.forEach((C) => {
        const E = b.indexOf(C) !== -1;
        !E && f && C <= f ? b.push(C) : m && !E && f && v.info("This Node instance does not support builds for Node-API version", C);
      }), c && c["build-latest-napi-version-only"]) {
        let C = 0;
        b.forEach((E) => {
          E > C && (C = E);
        }), b = C ? [C] : [];
      }
      return b.length ? b : void 0;
    }, n.exports.get_napi_build_versions_raw = function(s) {
      const c = [];
      return s.binary && s.binary.napi_versions && s.binary.napi_versions.forEach((m) => {
        c.indexOf(m) === -1 && c.push(m);
      }), c.length ? c : void 0;
    }, n.exports.get_command_arg = function(s) {
      return i + s;
    }, n.exports.get_napi_build_version_from_command_args = function(s) {
      for (let c = 0; c < s.length; c++) {
        const m = s[c];
        if (m.indexOf(i) === 0)
          return parseInt(m.substr(i.length), 10);
      }
    }, n.exports.swap_build_dir_out = function(s) {
      s && (jn().sync(n.exports.get_build_dir(s)), _.renameSync("build", n.exports.get_build_dir(s)));
    }, n.exports.swap_build_dir_in = function(s) {
      s && (jn().sync("build"), _.renameSync(n.exports.get_build_dir(s), "build"));
    }, n.exports.get_build_dir = function(s) {
      return "build-tmp-napi-v" + s;
    }, n.exports.get_best_napi_build_version = function(s, c) {
      let m = 0;
      const v = n.exports.get_napi_build_versions(s, c);
      if (v) {
        const b = n.exports.get_napi_version(c ? c.target : void 0);
        v.forEach((f) => {
          f > m && f <= b && (m = f);
        });
      }
      return m === 0 ? void 0 : m;
    }, n.exports.build_napi_only = function(s) {
      return s.binary && s.binary.package_name && s.binary.package_name.indexOf("{node_napi_label}") === -1;
    };
  })(Re, Re.exports)), Re.exports;
}
var $e = { exports: {} }, He = { exports: {} }, nr, Gn;
function ja() {
  if (Gn) return nr;
  Gn = 1;
  const n = () => process.platform === "linux";
  let t = null;
  return nr = { isLinux: n, getReport: () => {
    if (!t)
      if (n() && process.report) {
        const g = process.report.excludeNetwork;
        process.report.excludeNetwork = !0, t = process.report.getReport(), process.report.excludeNetwork = g;
      } else
        t = {};
    return t;
  } }, nr;
}
var ir, Un;
function Wa() {
  if (Un) return ir;
  Un = 1;
  const n = se, t = "/usr/bin/ldd", _ = "/proc/self/exe", g = 2048;
  return ir = {
    LDD_PATH: t,
    SELF_PATH: _,
    readFileSync: (r) => {
      const s = n.openSync(r, "r"), c = Buffer.alloc(g), m = n.readSync(s, c, 0, g, 0);
      return n.close(s, () => {
      }), c.subarray(0, m);
    },
    readFile: (r) => new Promise((s, c) => {
      n.open(r, "r", (m, v) => {
        if (m)
          c(m);
        else {
          const b = Buffer.alloc(g);
          n.read(v, b, 0, g, 0, (f, C) => {
            s(b.subarray(0, C)), n.close(v, () => {
            });
          });
        }
      });
    })
  }, ir;
}
var ar, $n;
function Ga() {
  return $n || ($n = 1, ar = {
    interpreterPath: (t) => {
      if (t.length < 64 || t.readUInt32BE(0) !== 2135247942 || t.readUInt8(4) !== 2 || t.readUInt8(5) !== 1)
        return null;
      const _ = t.readUInt32LE(32), g = t.readUInt16LE(54), p = t.readUInt16LE(56);
      for (let i = 0; i < p; i++) {
        const r = _ + i * g;
        if (t.readUInt32LE(r) === 3) {
          const c = t.readUInt32LE(r + 8), m = t.readUInt32LE(r + 32);
          return t.subarray(c, c + m).toString().replace(/\0.*$/g, "");
        }
      }
      return null;
    }
  }), ar;
}
var ur, Hn;
function Ua() {
  if (Hn) return ur;
  Hn = 1;
  const n = qi, { isLinux: t, getReport: _ } = ja(), { LDD_PATH: g, SELF_PATH: p, readFile: i, readFileSync: r } = Wa(), { interpreterPath: s } = Ga();
  let c, m, v;
  const b = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
  let f = "";
  const C = () => f || new Promise((N) => {
    n.exec(b, (U, Q) => {
      f = U ? " " : Q, N(f);
    });
  }), E = () => {
    if (!f)
      try {
        f = n.execSync(b, { encoding: "utf8" });
      } catch {
        f = " ";
      }
    return f;
  }, a = "glibc", d = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i, e = "musl", l = (N) => N.includes("libc.musl-") || N.includes("ld-musl-"), S = () => {
    const N = _();
    return N.header && N.header.glibcVersionRuntime ? a : Array.isArray(N.sharedObjects) && N.sharedObjects.some(l) ? e : null;
  }, u = (N) => {
    const [U, Q] = N.split(/[\r\n]+/);
    return U && U.includes(a) ? a : Q && Q.includes(e) ? e : null;
  }, o = (N) => {
    if (N) {
      if (N.includes("/ld-musl-"))
        return e;
      if (N.includes("/ld-linux-"))
        return a;
    }
    return null;
  }, D = (N) => (N = N.toString(), N.includes("musl") ? e : N.includes("GNU C Library") ? a : null), R = async () => {
    if (m !== void 0)
      return m;
    m = null;
    try {
      const N = await i(g);
      m = D(N);
    } catch {
    }
    return m;
  }, x = () => {
    if (m !== void 0)
      return m;
    m = null;
    try {
      const N = r(g);
      m = D(N);
    } catch {
    }
    return m;
  }, h = async () => {
    if (c !== void 0)
      return c;
    c = null;
    try {
      const N = await i(p), U = s(N);
      c = o(U);
    } catch {
    }
    return c;
  }, y = () => {
    if (c !== void 0)
      return c;
    c = null;
    try {
      const N = r(p), U = s(N);
      c = o(U);
    } catch {
    }
    return c;
  }, A = async () => {
    let N = null;
    if (t() && (N = await h(), !N && (N = await R(), N || (N = S()), !N))) {
      const U = await C();
      N = u(U);
    }
    return N;
  }, T = () => {
    let N = null;
    if (t() && (N = y(), !N && (N = x(), N || (N = S()), !N))) {
      const U = E();
      N = u(U);
    }
    return N;
  }, O = async () => t() && await A() !== a, L = () => t() && T() !== a, W = async () => {
    if (v !== void 0)
      return v;
    v = null;
    try {
      const U = (await i(g)).match(d);
      U && (v = U[1]);
    } catch {
    }
    return v;
  }, H = () => {
    if (v !== void 0)
      return v;
    v = null;
    try {
      const U = r(g).match(d);
      U && (v = U[1]);
    } catch {
    }
    return v;
  }, q = () => {
    const N = _();
    return N.header && N.header.glibcVersionRuntime ? N.header.glibcVersionRuntime : null;
  }, P = (N) => N.trim().split(/\s+/)[1], $ = (N) => {
    const [U, Q, X] = N.split(/[\r\n]+/);
    return U && U.includes(a) ? P(U) : Q && X && Q.includes(e) ? P(X) : null;
  };
  return ur = {
    GLIBC: a,
    MUSL: e,
    family: A,
    familySync: T,
    isNonGlibcLinux: O,
    isNonGlibcLinuxSync: L,
    version: async () => {
      let N = null;
      if (t() && (N = await W(), N || (N = q()), !N)) {
        const U = await C();
        N = $(U);
      }
      return N;
    },
    versionSync: () => {
      let N = null;
      if (t() && (N = H(), N || (N = q()), !N)) {
        const U = E();
        N = $(U);
      }
      return N;
    }
  }, ur;
}
const $a = {
  "0.1.14": { node_abi: null, v8: "1.3" },
  "0.1.15": { node_abi: null, v8: "1.3" },
  "0.1.16": { node_abi: null, v8: "1.3" },
  "0.1.17": { node_abi: null, v8: "1.3" },
  "0.1.18": { node_abi: null, v8: "1.3" },
  "0.1.19": { node_abi: null, v8: "2.0" },
  "0.1.20": { node_abi: null, v8: "2.0" },
  "0.1.21": { node_abi: null, v8: "2.0" },
  "0.1.22": { node_abi: null, v8: "2.0" },
  "0.1.23": { node_abi: null, v8: "2.0" },
  "0.1.24": { node_abi: null, v8: "2.0" },
  "0.1.25": { node_abi: null, v8: "2.0" },
  "0.1.26": { node_abi: null, v8: "2.0" },
  "0.1.27": { node_abi: null, v8: "2.1" },
  "0.1.28": { node_abi: null, v8: "2.1" },
  "0.1.29": { node_abi: null, v8: "2.1" },
  "0.1.30": { node_abi: null, v8: "2.1" },
  "0.1.31": { node_abi: null, v8: "2.1" },
  "0.1.32": { node_abi: null, v8: "2.1" },
  "0.1.33": { node_abi: null, v8: "2.1" },
  "0.1.90": { node_abi: null, v8: "2.2" },
  "0.1.91": { node_abi: null, v8: "2.2" },
  "0.1.92": { node_abi: null, v8: "2.2" },
  "0.1.93": { node_abi: null, v8: "2.2" },
  "0.1.94": { node_abi: null, v8: "2.2" },
  "0.1.95": { node_abi: null, v8: "2.2" },
  "0.1.96": { node_abi: null, v8: "2.2" },
  "0.1.97": { node_abi: null, v8: "2.2" },
  "0.1.98": { node_abi: null, v8: "2.2" },
  "0.1.99": { node_abi: null, v8: "2.2" },
  "0.1.100": { node_abi: null, v8: "2.2" },
  "0.1.101": { node_abi: null, v8: "2.3" },
  "0.1.102": { node_abi: null, v8: "2.3" },
  "0.1.103": { node_abi: null, v8: "2.3" },
  "0.1.104": { node_abi: null, v8: "2.3" },
  "0.2.0": { node_abi: 1, v8: "2.3" },
  "0.2.1": { node_abi: 1, v8: "2.3" },
  "0.2.2": { node_abi: 1, v8: "2.3" },
  "0.2.3": { node_abi: 1, v8: "2.3" },
  "0.2.4": { node_abi: 1, v8: "2.3" },
  "0.2.5": { node_abi: 1, v8: "2.3" },
  "0.2.6": { node_abi: 1, v8: "2.3" },
  "0.3.0": { node_abi: 1, v8: "2.5" },
  "0.3.1": { node_abi: 1, v8: "2.5" },
  "0.3.2": { node_abi: 1, v8: "3.0" },
  "0.3.3": { node_abi: 1, v8: "3.0" },
  "0.3.4": { node_abi: 1, v8: "3.0" },
  "0.3.5": { node_abi: 1, v8: "3.0" },
  "0.3.6": { node_abi: 1, v8: "3.0" },
  "0.3.7": { node_abi: 1, v8: "3.0" },
  "0.3.8": { node_abi: 1, v8: "3.1" },
  "0.4.0": { node_abi: 1, v8: "3.1" },
  "0.4.1": { node_abi: 1, v8: "3.1" },
  "0.4.2": { node_abi: 1, v8: "3.1" },
  "0.4.3": { node_abi: 1, v8: "3.1" },
  "0.4.4": { node_abi: 1, v8: "3.1" },
  "0.4.5": { node_abi: 1, v8: "3.1" },
  "0.4.6": { node_abi: 1, v8: "3.1" },
  "0.4.7": { node_abi: 1, v8: "3.1" },
  "0.4.8": { node_abi: 1, v8: "3.1" },
  "0.4.9": { node_abi: 1, v8: "3.1" },
  "0.4.10": { node_abi: 1, v8: "3.1" },
  "0.4.11": { node_abi: 1, v8: "3.1" },
  "0.4.12": { node_abi: 1, v8: "3.1" },
  "0.5.0": { node_abi: 1, v8: "3.1" },
  "0.5.1": { node_abi: 1, v8: "3.4" },
  "0.5.2": { node_abi: 1, v8: "3.4" },
  "0.5.3": { node_abi: 1, v8: "3.4" },
  "0.5.4": { node_abi: 1, v8: "3.5" },
  "0.5.5": { node_abi: 1, v8: "3.5" },
  "0.5.6": { node_abi: 1, v8: "3.6" },
  "0.5.7": { node_abi: 1, v8: "3.6" },
  "0.5.8": { node_abi: 1, v8: "3.6" },
  "0.5.9": { node_abi: 1, v8: "3.6" },
  "0.5.10": { node_abi: 1, v8: "3.7" },
  "0.6.0": { node_abi: 1, v8: "3.6" },
  "0.6.1": { node_abi: 1, v8: "3.6" },
  "0.6.2": { node_abi: 1, v8: "3.6" },
  "0.6.3": { node_abi: 1, v8: "3.6" },
  "0.6.4": { node_abi: 1, v8: "3.6" },
  "0.6.5": { node_abi: 1, v8: "3.6" },
  "0.6.6": { node_abi: 1, v8: "3.6" },
  "0.6.7": { node_abi: 1, v8: "3.6" },
  "0.6.8": { node_abi: 1, v8: "3.6" },
  "0.6.9": { node_abi: 1, v8: "3.6" },
  "0.6.10": { node_abi: 1, v8: "3.6" },
  "0.6.11": { node_abi: 1, v8: "3.6" },
  "0.6.12": { node_abi: 1, v8: "3.6" },
  "0.6.13": { node_abi: 1, v8: "3.6" },
  "0.6.14": { node_abi: 1, v8: "3.6" },
  "0.6.15": { node_abi: 1, v8: "3.6" },
  "0.6.16": { node_abi: 1, v8: "3.6" },
  "0.6.17": { node_abi: 1, v8: "3.6" },
  "0.6.18": { node_abi: 1, v8: "3.6" },
  "0.6.19": { node_abi: 1, v8: "3.6" },
  "0.6.20": { node_abi: 1, v8: "3.6" },
  "0.6.21": { node_abi: 1, v8: "3.6" },
  "0.7.0": { node_abi: 1, v8: "3.8" },
  "0.7.1": { node_abi: 1, v8: "3.8" },
  "0.7.2": { node_abi: 1, v8: "3.8" },
  "0.7.3": { node_abi: 1, v8: "3.9" },
  "0.7.4": { node_abi: 1, v8: "3.9" },
  "0.7.5": { node_abi: 1, v8: "3.9" },
  "0.7.6": { node_abi: 1, v8: "3.9" },
  "0.7.7": { node_abi: 1, v8: "3.9" },
  "0.7.8": { node_abi: 1, v8: "3.9" },
  "0.7.9": { node_abi: 1, v8: "3.11" },
  "0.7.10": { node_abi: 1, v8: "3.9" },
  "0.7.11": { node_abi: 1, v8: "3.11" },
  "0.7.12": { node_abi: 1, v8: "3.11" },
  "0.8.0": { node_abi: 1, v8: "3.11" },
  "0.8.1": { node_abi: 1, v8: "3.11" },
  "0.8.2": { node_abi: 1, v8: "3.11" },
  "0.8.3": { node_abi: 1, v8: "3.11" },
  "0.8.4": { node_abi: 1, v8: "3.11" },
  "0.8.5": { node_abi: 1, v8: "3.11" },
  "0.8.6": { node_abi: 1, v8: "3.11" },
  "0.8.7": { node_abi: 1, v8: "3.11" },
  "0.8.8": { node_abi: 1, v8: "3.11" },
  "0.8.9": { node_abi: 1, v8: "3.11" },
  "0.8.10": { node_abi: 1, v8: "3.11" },
  "0.8.11": { node_abi: 1, v8: "3.11" },
  "0.8.12": { node_abi: 1, v8: "3.11" },
  "0.8.13": { node_abi: 1, v8: "3.11" },
  "0.8.14": { node_abi: 1, v8: "3.11" },
  "0.8.15": { node_abi: 1, v8: "3.11" },
  "0.8.16": { node_abi: 1, v8: "3.11" },
  "0.8.17": { node_abi: 1, v8: "3.11" },
  "0.8.18": { node_abi: 1, v8: "3.11" },
  "0.8.19": { node_abi: 1, v8: "3.11" },
  "0.8.20": { node_abi: 1, v8: "3.11" },
  "0.8.21": { node_abi: 1, v8: "3.11" },
  "0.8.22": { node_abi: 1, v8: "3.11" },
  "0.8.23": { node_abi: 1, v8: "3.11" },
  "0.8.24": { node_abi: 1, v8: "3.11" },
  "0.8.25": { node_abi: 1, v8: "3.11" },
  "0.8.26": { node_abi: 1, v8: "3.11" },
  "0.8.27": { node_abi: 1, v8: "3.11" },
  "0.8.28": { node_abi: 1, v8: "3.11" },
  "0.9.0": { node_abi: 1, v8: "3.11" },
  "0.9.1": { node_abi: 10, v8: "3.11" },
  "0.9.2": { node_abi: 10, v8: "3.11" },
  "0.9.3": { node_abi: 10, v8: "3.13" },
  "0.9.4": { node_abi: 10, v8: "3.13" },
  "0.9.5": { node_abi: 10, v8: "3.13" },
  "0.9.6": { node_abi: 10, v8: "3.15" },
  "0.9.7": { node_abi: 10, v8: "3.15" },
  "0.9.8": { node_abi: 10, v8: "3.15" },
  "0.9.9": { node_abi: 11, v8: "3.15" },
  "0.9.10": { node_abi: 11, v8: "3.15" },
  "0.9.11": { node_abi: 11, v8: "3.14" },
  "0.9.12": { node_abi: 11, v8: "3.14" },
  "0.10.0": { node_abi: 11, v8: "3.14" },
  "0.10.1": { node_abi: 11, v8: "3.14" },
  "0.10.2": { node_abi: 11, v8: "3.14" },
  "0.10.3": { node_abi: 11, v8: "3.14" },
  "0.10.4": { node_abi: 11, v8: "3.14" },
  "0.10.5": { node_abi: 11, v8: "3.14" },
  "0.10.6": { node_abi: 11, v8: "3.14" },
  "0.10.7": { node_abi: 11, v8: "3.14" },
  "0.10.8": { node_abi: 11, v8: "3.14" },
  "0.10.9": { node_abi: 11, v8: "3.14" },
  "0.10.10": { node_abi: 11, v8: "3.14" },
  "0.10.11": { node_abi: 11, v8: "3.14" },
  "0.10.12": { node_abi: 11, v8: "3.14" },
  "0.10.13": { node_abi: 11, v8: "3.14" },
  "0.10.14": { node_abi: 11, v8: "3.14" },
  "0.10.15": { node_abi: 11, v8: "3.14" },
  "0.10.16": { node_abi: 11, v8: "3.14" },
  "0.10.17": { node_abi: 11, v8: "3.14" },
  "0.10.18": { node_abi: 11, v8: "3.14" },
  "0.10.19": { node_abi: 11, v8: "3.14" },
  "0.10.20": { node_abi: 11, v8: "3.14" },
  "0.10.21": { node_abi: 11, v8: "3.14" },
  "0.10.22": { node_abi: 11, v8: "3.14" },
  "0.10.23": { node_abi: 11, v8: "3.14" },
  "0.10.24": { node_abi: 11, v8: "3.14" },
  "0.10.25": { node_abi: 11, v8: "3.14" },
  "0.10.26": { node_abi: 11, v8: "3.14" },
  "0.10.27": { node_abi: 11, v8: "3.14" },
  "0.10.28": { node_abi: 11, v8: "3.14" },
  "0.10.29": { node_abi: 11, v8: "3.14" },
  "0.10.30": { node_abi: 11, v8: "3.14" },
  "0.10.31": { node_abi: 11, v8: "3.14" },
  "0.10.32": { node_abi: 11, v8: "3.14" },
  "0.10.33": { node_abi: 11, v8: "3.14" },
  "0.10.34": { node_abi: 11, v8: "3.14" },
  "0.10.35": { node_abi: 11, v8: "3.14" },
  "0.10.36": { node_abi: 11, v8: "3.14" },
  "0.10.37": { node_abi: 11, v8: "3.14" },
  "0.10.38": { node_abi: 11, v8: "3.14" },
  "0.10.39": { node_abi: 11, v8: "3.14" },
  "0.10.40": { node_abi: 11, v8: "3.14" },
  "0.10.41": { node_abi: 11, v8: "3.14" },
  "0.10.42": { node_abi: 11, v8: "3.14" },
  "0.10.43": { node_abi: 11, v8: "3.14" },
  "0.10.44": { node_abi: 11, v8: "3.14" },
  "0.10.45": { node_abi: 11, v8: "3.14" },
  "0.10.46": { node_abi: 11, v8: "3.14" },
  "0.10.47": { node_abi: 11, v8: "3.14" },
  "0.10.48": { node_abi: 11, v8: "3.14" },
  "0.11.0": { node_abi: 12, v8: "3.17" },
  "0.11.1": { node_abi: 12, v8: "3.18" },
  "0.11.2": { node_abi: 12, v8: "3.19" },
  "0.11.3": { node_abi: 12, v8: "3.19" },
  "0.11.4": { node_abi: 12, v8: "3.20" },
  "0.11.5": { node_abi: 12, v8: "3.20" },
  "0.11.6": { node_abi: 12, v8: "3.20" },
  "0.11.7": { node_abi: 12, v8: "3.20" },
  "0.11.8": { node_abi: 13, v8: "3.21" },
  "0.11.9": { node_abi: 13, v8: "3.22" },
  "0.11.10": { node_abi: 13, v8: "3.22" },
  "0.11.11": { node_abi: 14, v8: "3.22" },
  "0.11.12": { node_abi: 14, v8: "3.22" },
  "0.11.13": { node_abi: 14, v8: "3.25" },
  "0.11.14": { node_abi: 14, v8: "3.26" },
  "0.11.15": { node_abi: 14, v8: "3.28" },
  "0.11.16": { node_abi: 14, v8: "3.28" },
  "0.12.0": { node_abi: 14, v8: "3.28" },
  "0.12.1": { node_abi: 14, v8: "3.28" },
  "0.12.2": { node_abi: 14, v8: "3.28" },
  "0.12.3": { node_abi: 14, v8: "3.28" },
  "0.12.4": { node_abi: 14, v8: "3.28" },
  "0.12.5": { node_abi: 14, v8: "3.28" },
  "0.12.6": { node_abi: 14, v8: "3.28" },
  "0.12.7": { node_abi: 14, v8: "3.28" },
  "0.12.8": { node_abi: 14, v8: "3.28" },
  "0.12.9": { node_abi: 14, v8: "3.28" },
  "0.12.10": { node_abi: 14, v8: "3.28" },
  "0.12.11": { node_abi: 14, v8: "3.28" },
  "0.12.12": { node_abi: 14, v8: "3.28" },
  "0.12.13": { node_abi: 14, v8: "3.28" },
  "0.12.14": { node_abi: 14, v8: "3.28" },
  "0.12.15": { node_abi: 14, v8: "3.28" },
  "0.12.16": { node_abi: 14, v8: "3.28" },
  "0.12.17": { node_abi: 14, v8: "3.28" },
  "0.12.18": { node_abi: 14, v8: "3.28" },
  "1.0.0": { node_abi: 42, v8: "3.31" },
  "1.0.1": { node_abi: 42, v8: "3.31" },
  "1.0.2": { node_abi: 42, v8: "3.31" },
  "1.0.3": { node_abi: 42, v8: "4.1" },
  "1.0.4": { node_abi: 42, v8: "4.1" },
  "1.1.0": { node_abi: 43, v8: "4.1" },
  "1.2.0": { node_abi: 43, v8: "4.1" },
  "1.3.0": { node_abi: 43, v8: "4.1" },
  "1.4.1": { node_abi: 43, v8: "4.1" },
  "1.4.2": { node_abi: 43, v8: "4.1" },
  "1.4.3": { node_abi: 43, v8: "4.1" },
  "1.5.0": { node_abi: 43, v8: "4.1" },
  "1.5.1": { node_abi: 43, v8: "4.1" },
  "1.6.0": { node_abi: 43, v8: "4.1" },
  "1.6.1": { node_abi: 43, v8: "4.1" },
  "1.6.2": { node_abi: 43, v8: "4.1" },
  "1.6.3": { node_abi: 43, v8: "4.1" },
  "1.6.4": { node_abi: 43, v8: "4.1" },
  "1.7.1": { node_abi: 43, v8: "4.1" },
  "1.8.1": { node_abi: 43, v8: "4.1" },
  "1.8.2": { node_abi: 43, v8: "4.1" },
  "1.8.3": { node_abi: 43, v8: "4.1" },
  "1.8.4": { node_abi: 43, v8: "4.1" },
  "2.0.0": { node_abi: 44, v8: "4.2" },
  "2.0.1": { node_abi: 44, v8: "4.2" },
  "2.0.2": { node_abi: 44, v8: "4.2" },
  "2.1.0": { node_abi: 44, v8: "4.2" },
  "2.2.0": { node_abi: 44, v8: "4.2" },
  "2.2.1": { node_abi: 44, v8: "4.2" },
  "2.3.0": { node_abi: 44, v8: "4.2" },
  "2.3.1": { node_abi: 44, v8: "4.2" },
  "2.3.2": { node_abi: 44, v8: "4.2" },
  "2.3.3": { node_abi: 44, v8: "4.2" },
  "2.3.4": { node_abi: 44, v8: "4.2" },
  "2.4.0": { node_abi: 44, v8: "4.2" },
  "2.5.0": { node_abi: 44, v8: "4.2" },
  "3.0.0": { node_abi: 45, v8: "4.4" },
  "3.1.0": { node_abi: 45, v8: "4.4" },
  "3.2.0": { node_abi: 45, v8: "4.4" },
  "3.3.0": { node_abi: 45, v8: "4.4" },
  "3.3.1": { node_abi: 45, v8: "4.4" },
  "4.0.0": { node_abi: 46, v8: "4.5" },
  "4.1.0": { node_abi: 46, v8: "4.5" },
  "4.1.1": { node_abi: 46, v8: "4.5" },
  "4.1.2": { node_abi: 46, v8: "4.5" },
  "4.2.0": { node_abi: 46, v8: "4.5" },
  "4.2.1": { node_abi: 46, v8: "4.5" },
  "4.2.2": { node_abi: 46, v8: "4.5" },
  "4.2.3": { node_abi: 46, v8: "4.5" },
  "4.2.4": { node_abi: 46, v8: "4.5" },
  "4.2.5": { node_abi: 46, v8: "4.5" },
  "4.2.6": { node_abi: 46, v8: "4.5" },
  "4.3.0": { node_abi: 46, v8: "4.5" },
  "4.3.1": { node_abi: 46, v8: "4.5" },
  "4.3.2": { node_abi: 46, v8: "4.5" },
  "4.4.0": { node_abi: 46, v8: "4.5" },
  "4.4.1": { node_abi: 46, v8: "4.5" },
  "4.4.2": { node_abi: 46, v8: "4.5" },
  "4.4.3": { node_abi: 46, v8: "4.5" },
  "4.4.4": { node_abi: 46, v8: "4.5" },
  "4.4.5": { node_abi: 46, v8: "4.5" },
  "4.4.6": { node_abi: 46, v8: "4.5" },
  "4.4.7": { node_abi: 46, v8: "4.5" },
  "4.5.0": { node_abi: 46, v8: "4.5" },
  "4.6.0": { node_abi: 46, v8: "4.5" },
  "4.6.1": { node_abi: 46, v8: "4.5" },
  "4.6.2": { node_abi: 46, v8: "4.5" },
  "4.7.0": { node_abi: 46, v8: "4.5" },
  "4.7.1": { node_abi: 46, v8: "4.5" },
  "4.7.2": { node_abi: 46, v8: "4.5" },
  "4.7.3": { node_abi: 46, v8: "4.5" },
  "4.8.0": { node_abi: 46, v8: "4.5" },
  "4.8.1": { node_abi: 46, v8: "4.5" },
  "4.8.2": { node_abi: 46, v8: "4.5" },
  "4.8.3": { node_abi: 46, v8: "4.5" },
  "4.8.4": { node_abi: 46, v8: "4.5" },
  "4.8.5": { node_abi: 46, v8: "4.5" },
  "4.8.6": { node_abi: 46, v8: "4.5" },
  "4.8.7": { node_abi: 46, v8: "4.5" },
  "4.9.0": { node_abi: 46, v8: "4.5" },
  "4.9.1": { node_abi: 46, v8: "4.5" },
  "5.0.0": { node_abi: 47, v8: "4.6" },
  "5.1.0": { node_abi: 47, v8: "4.6" },
  "5.1.1": { node_abi: 47, v8: "4.6" },
  "5.2.0": { node_abi: 47, v8: "4.6" },
  "5.3.0": { node_abi: 47, v8: "4.6" },
  "5.4.0": { node_abi: 47, v8: "4.6" },
  "5.4.1": { node_abi: 47, v8: "4.6" },
  "5.5.0": { node_abi: 47, v8: "4.6" },
  "5.6.0": { node_abi: 47, v8: "4.6" },
  "5.7.0": { node_abi: 47, v8: "4.6" },
  "5.7.1": { node_abi: 47, v8: "4.6" },
  "5.8.0": { node_abi: 47, v8: "4.6" },
  "5.9.0": { node_abi: 47, v8: "4.6" },
  "5.9.1": { node_abi: 47, v8: "4.6" },
  "5.10.0": { node_abi: 47, v8: "4.6" },
  "5.10.1": { node_abi: 47, v8: "4.6" },
  "5.11.0": { node_abi: 47, v8: "4.6" },
  "5.11.1": { node_abi: 47, v8: "4.6" },
  "5.12.0": { node_abi: 47, v8: "4.6" },
  "6.0.0": { node_abi: 48, v8: "5.0" },
  "6.1.0": { node_abi: 48, v8: "5.0" },
  "6.2.0": { node_abi: 48, v8: "5.0" },
  "6.2.1": { node_abi: 48, v8: "5.0" },
  "6.2.2": { node_abi: 48, v8: "5.0" },
  "6.3.0": { node_abi: 48, v8: "5.0" },
  "6.3.1": { node_abi: 48, v8: "5.0" },
  "6.4.0": { node_abi: 48, v8: "5.0" },
  "6.5.0": { node_abi: 48, v8: "5.1" },
  "6.6.0": { node_abi: 48, v8: "5.1" },
  "6.7.0": { node_abi: 48, v8: "5.1" },
  "6.8.0": { node_abi: 48, v8: "5.1" },
  "6.8.1": { node_abi: 48, v8: "5.1" },
  "6.9.0": { node_abi: 48, v8: "5.1" },
  "6.9.1": { node_abi: 48, v8: "5.1" },
  "6.9.2": { node_abi: 48, v8: "5.1" },
  "6.9.3": { node_abi: 48, v8: "5.1" },
  "6.9.4": { node_abi: 48, v8: "5.1" },
  "6.9.5": { node_abi: 48, v8: "5.1" },
  "6.10.0": { node_abi: 48, v8: "5.1" },
  "6.10.1": { node_abi: 48, v8: "5.1" },
  "6.10.2": { node_abi: 48, v8: "5.1" },
  "6.10.3": { node_abi: 48, v8: "5.1" },
  "6.11.0": { node_abi: 48, v8: "5.1" },
  "6.11.1": { node_abi: 48, v8: "5.1" },
  "6.11.2": { node_abi: 48, v8: "5.1" },
  "6.11.3": { node_abi: 48, v8: "5.1" },
  "6.11.4": { node_abi: 48, v8: "5.1" },
  "6.11.5": { node_abi: 48, v8: "5.1" },
  "6.12.0": { node_abi: 48, v8: "5.1" },
  "6.12.1": { node_abi: 48, v8: "5.1" },
  "6.12.2": { node_abi: 48, v8: "5.1" },
  "6.12.3": { node_abi: 48, v8: "5.1" },
  "6.13.0": { node_abi: 48, v8: "5.1" },
  "6.13.1": { node_abi: 48, v8: "5.1" },
  "6.14.0": { node_abi: 48, v8: "5.1" },
  "6.14.1": { node_abi: 48, v8: "5.1" },
  "6.14.2": { node_abi: 48, v8: "5.1" },
  "6.14.3": { node_abi: 48, v8: "5.1" },
  "6.14.4": { node_abi: 48, v8: "5.1" },
  "6.15.0": { node_abi: 48, v8: "5.1" },
  "6.15.1": { node_abi: 48, v8: "5.1" },
  "6.16.0": { node_abi: 48, v8: "5.1" },
  "6.17.0": { node_abi: 48, v8: "5.1" },
  "6.17.1": { node_abi: 48, v8: "5.1" },
  "7.0.0": { node_abi: 51, v8: "5.4" },
  "7.1.0": { node_abi: 51, v8: "5.4" },
  "7.2.0": { node_abi: 51, v8: "5.4" },
  "7.2.1": { node_abi: 51, v8: "5.4" },
  "7.3.0": { node_abi: 51, v8: "5.4" },
  "7.4.0": { node_abi: 51, v8: "5.4" },
  "7.5.0": { node_abi: 51, v8: "5.4" },
  "7.6.0": { node_abi: 51, v8: "5.5" },
  "7.7.0": { node_abi: 51, v8: "5.5" },
  "7.7.1": { node_abi: 51, v8: "5.5" },
  "7.7.2": { node_abi: 51, v8: "5.5" },
  "7.7.3": { node_abi: 51, v8: "5.5" },
  "7.7.4": { node_abi: 51, v8: "5.5" },
  "7.8.0": { node_abi: 51, v8: "5.5" },
  "7.9.0": { node_abi: 51, v8: "5.5" },
  "7.10.0": { node_abi: 51, v8: "5.5" },
  "7.10.1": { node_abi: 51, v8: "5.5" },
  "8.0.0": { node_abi: 57, v8: "5.8" },
  "8.1.0": { node_abi: 57, v8: "5.8" },
  "8.1.1": { node_abi: 57, v8: "5.8" },
  "8.1.2": { node_abi: 57, v8: "5.8" },
  "8.1.3": { node_abi: 57, v8: "5.8" },
  "8.1.4": { node_abi: 57, v8: "5.8" },
  "8.2.0": { node_abi: 57, v8: "5.8" },
  "8.2.1": { node_abi: 57, v8: "5.8" },
  "8.3.0": { node_abi: 57, v8: "6.0" },
  "8.4.0": { node_abi: 57, v8: "6.0" },
  "8.5.0": { node_abi: 57, v8: "6.0" },
  "8.6.0": { node_abi: 57, v8: "6.0" },
  "8.7.0": { node_abi: 57, v8: "6.1" },
  "8.8.0": { node_abi: 57, v8: "6.1" },
  "8.8.1": { node_abi: 57, v8: "6.1" },
  "8.9.0": { node_abi: 57, v8: "6.1" },
  "8.9.1": { node_abi: 57, v8: "6.1" },
  "8.9.2": { node_abi: 57, v8: "6.1" },
  "8.9.3": { node_abi: 57, v8: "6.1" },
  "8.9.4": { node_abi: 57, v8: "6.1" },
  "8.10.0": { node_abi: 57, v8: "6.2" },
  "8.11.0": { node_abi: 57, v8: "6.2" },
  "8.11.1": { node_abi: 57, v8: "6.2" },
  "8.11.2": { node_abi: 57, v8: "6.2" },
  "8.11.3": { node_abi: 57, v8: "6.2" },
  "8.11.4": { node_abi: 57, v8: "6.2" },
  "8.12.0": { node_abi: 57, v8: "6.2" },
  "8.13.0": { node_abi: 57, v8: "6.2" },
  "8.14.0": { node_abi: 57, v8: "6.2" },
  "8.14.1": { node_abi: 57, v8: "6.2" },
  "8.15.0": { node_abi: 57, v8: "6.2" },
  "8.15.1": { node_abi: 57, v8: "6.2" },
  "8.16.0": { node_abi: 57, v8: "6.2" },
  "8.16.1": { node_abi: 57, v8: "6.2" },
  "8.16.2": { node_abi: 57, v8: "6.2" },
  "8.17.0": { node_abi: 57, v8: "6.2" },
  "9.0.0": { node_abi: 59, v8: "6.2" },
  "9.1.0": { node_abi: 59, v8: "6.2" },
  "9.2.0": { node_abi: 59, v8: "6.2" },
  "9.2.1": { node_abi: 59, v8: "6.2" },
  "9.3.0": { node_abi: 59, v8: "6.2" },
  "9.4.0": { node_abi: 59, v8: "6.2" },
  "9.5.0": { node_abi: 59, v8: "6.2" },
  "9.6.0": { node_abi: 59, v8: "6.2" },
  "9.6.1": { node_abi: 59, v8: "6.2" },
  "9.7.0": { node_abi: 59, v8: "6.2" },
  "9.7.1": { node_abi: 59, v8: "6.2" },
  "9.8.0": { node_abi: 59, v8: "6.2" },
  "9.9.0": { node_abi: 59, v8: "6.2" },
  "9.10.0": { node_abi: 59, v8: "6.2" },
  "9.10.1": { node_abi: 59, v8: "6.2" },
  "9.11.0": { node_abi: 59, v8: "6.2" },
  "9.11.1": { node_abi: 59, v8: "6.2" },
  "9.11.2": { node_abi: 59, v8: "6.2" },
  "10.0.0": { node_abi: 64, v8: "6.6" },
  "10.1.0": { node_abi: 64, v8: "6.6" },
  "10.2.0": { node_abi: 64, v8: "6.6" },
  "10.2.1": { node_abi: 64, v8: "6.6" },
  "10.3.0": { node_abi: 64, v8: "6.6" },
  "10.4.0": { node_abi: 64, v8: "6.7" },
  "10.4.1": { node_abi: 64, v8: "6.7" },
  "10.5.0": { node_abi: 64, v8: "6.7" },
  "10.6.0": { node_abi: 64, v8: "6.7" },
  "10.7.0": { node_abi: 64, v8: "6.7" },
  "10.8.0": { node_abi: 64, v8: "6.7" },
  "10.9.0": { node_abi: 64, v8: "6.8" },
  "10.10.0": { node_abi: 64, v8: "6.8" },
  "10.11.0": { node_abi: 64, v8: "6.8" },
  "10.12.0": { node_abi: 64, v8: "6.8" },
  "10.13.0": { node_abi: 64, v8: "6.8" },
  "10.14.0": { node_abi: 64, v8: "6.8" },
  "10.14.1": { node_abi: 64, v8: "6.8" },
  "10.14.2": { node_abi: 64, v8: "6.8" },
  "10.15.0": { node_abi: 64, v8: "6.8" },
  "10.15.1": { node_abi: 64, v8: "6.8" },
  "10.15.2": { node_abi: 64, v8: "6.8" },
  "10.15.3": { node_abi: 64, v8: "6.8" },
  "10.16.0": { node_abi: 64, v8: "6.8" },
  "10.16.1": { node_abi: 64, v8: "6.8" },
  "10.16.2": { node_abi: 64, v8: "6.8" },
  "10.16.3": { node_abi: 64, v8: "6.8" },
  "10.17.0": { node_abi: 64, v8: "6.8" },
  "10.18.0": { node_abi: 64, v8: "6.8" },
  "10.18.1": { node_abi: 64, v8: "6.8" },
  "10.19.0": { node_abi: 64, v8: "6.8" },
  "10.20.0": { node_abi: 64, v8: "6.8" },
  "10.20.1": { node_abi: 64, v8: "6.8" },
  "10.21.0": { node_abi: 64, v8: "6.8" },
  "10.22.0": { node_abi: 64, v8: "6.8" },
  "10.22.1": { node_abi: 64, v8: "6.8" },
  "10.23.0": { node_abi: 64, v8: "6.8" },
  "10.23.1": { node_abi: 64, v8: "6.8" },
  "10.23.2": { node_abi: 64, v8: "6.8" },
  "10.23.3": { node_abi: 64, v8: "6.8" },
  "10.24.0": { node_abi: 64, v8: "6.8" },
  "10.24.1": { node_abi: 64, v8: "6.8" },
  "11.0.0": { node_abi: 67, v8: "7.0" },
  "11.1.0": { node_abi: 67, v8: "7.0" },
  "11.2.0": { node_abi: 67, v8: "7.0" },
  "11.3.0": { node_abi: 67, v8: "7.0" },
  "11.4.0": { node_abi: 67, v8: "7.0" },
  "11.5.0": { node_abi: 67, v8: "7.0" },
  "11.6.0": { node_abi: 67, v8: "7.0" },
  "11.7.0": { node_abi: 67, v8: "7.0" },
  "11.8.0": { node_abi: 67, v8: "7.0" },
  "11.9.0": { node_abi: 67, v8: "7.0" },
  "11.10.0": { node_abi: 67, v8: "7.0" },
  "11.10.1": { node_abi: 67, v8: "7.0" },
  "11.11.0": { node_abi: 67, v8: "7.0" },
  "11.12.0": { node_abi: 67, v8: "7.0" },
  "11.13.0": { node_abi: 67, v8: "7.0" },
  "11.14.0": { node_abi: 67, v8: "7.0" },
  "11.15.0": { node_abi: 67, v8: "7.0" },
  "12.0.0": { node_abi: 72, v8: "7.4" },
  "12.1.0": { node_abi: 72, v8: "7.4" },
  "12.2.0": { node_abi: 72, v8: "7.4" },
  "12.3.0": { node_abi: 72, v8: "7.4" },
  "12.3.1": { node_abi: 72, v8: "7.4" },
  "12.4.0": { node_abi: 72, v8: "7.4" },
  "12.5.0": { node_abi: 72, v8: "7.5" },
  "12.6.0": { node_abi: 72, v8: "7.5" },
  "12.7.0": { node_abi: 72, v8: "7.5" },
  "12.8.0": { node_abi: 72, v8: "7.5" },
  "12.8.1": { node_abi: 72, v8: "7.5" },
  "12.9.0": { node_abi: 72, v8: "7.6" },
  "12.9.1": { node_abi: 72, v8: "7.6" },
  "12.10.0": { node_abi: 72, v8: "7.6" },
  "12.11.0": { node_abi: 72, v8: "7.7" },
  "12.11.1": { node_abi: 72, v8: "7.7" },
  "12.12.0": { node_abi: 72, v8: "7.7" },
  "12.13.0": { node_abi: 72, v8: "7.7" },
  "12.13.1": { node_abi: 72, v8: "7.7" },
  "12.14.0": { node_abi: 72, v8: "7.7" },
  "12.14.1": { node_abi: 72, v8: "7.7" },
  "12.15.0": { node_abi: 72, v8: "7.7" },
  "12.16.0": { node_abi: 72, v8: "7.8" },
  "12.16.1": { node_abi: 72, v8: "7.8" },
  "12.16.2": { node_abi: 72, v8: "7.8" },
  "12.16.3": { node_abi: 72, v8: "7.8" },
  "12.17.0": { node_abi: 72, v8: "7.8" },
  "12.18.0": { node_abi: 72, v8: "7.8" },
  "12.18.1": { node_abi: 72, v8: "7.8" },
  "12.18.2": { node_abi: 72, v8: "7.8" },
  "12.18.3": { node_abi: 72, v8: "7.8" },
  "12.18.4": { node_abi: 72, v8: "7.8" },
  "12.19.0": { node_abi: 72, v8: "7.8" },
  "12.19.1": { node_abi: 72, v8: "7.8" },
  "12.20.0": { node_abi: 72, v8: "7.8" },
  "12.20.1": { node_abi: 72, v8: "7.8" },
  "12.20.2": { node_abi: 72, v8: "7.8" },
  "12.21.0": { node_abi: 72, v8: "7.8" },
  "12.22.0": { node_abi: 72, v8: "7.8" },
  "12.22.1": { node_abi: 72, v8: "7.8" },
  "12.22.2": { node_abi: 72, v8: "7.8" },
  "12.22.3": { node_abi: 72, v8: "7.8" },
  "12.22.4": { node_abi: 72, v8: "7.8" },
  "12.22.5": { node_abi: 72, v8: "7.8" },
  "12.22.6": { node_abi: 72, v8: "7.8" },
  "12.22.7": { node_abi: 72, v8: "7.8" },
  "13.0.0": { node_abi: 79, v8: "7.8" },
  "13.0.1": { node_abi: 79, v8: "7.8" },
  "13.1.0": { node_abi: 79, v8: "7.8" },
  "13.2.0": { node_abi: 79, v8: "7.9" },
  "13.3.0": { node_abi: 79, v8: "7.9" },
  "13.4.0": { node_abi: 79, v8: "7.9" },
  "13.5.0": { node_abi: 79, v8: "7.9" },
  "13.6.0": { node_abi: 79, v8: "7.9" },
  "13.7.0": { node_abi: 79, v8: "7.9" },
  "13.8.0": { node_abi: 79, v8: "7.9" },
  "13.9.0": { node_abi: 79, v8: "7.9" },
  "13.10.0": { node_abi: 79, v8: "7.9" },
  "13.10.1": { node_abi: 79, v8: "7.9" },
  "13.11.0": { node_abi: 79, v8: "7.9" },
  "13.12.0": { node_abi: 79, v8: "7.9" },
  "13.13.0": { node_abi: 79, v8: "7.9" },
  "13.14.0": { node_abi: 79, v8: "7.9" },
  "14.0.0": { node_abi: 83, v8: "8.1" },
  "14.1.0": { node_abi: 83, v8: "8.1" },
  "14.2.0": { node_abi: 83, v8: "8.1" },
  "14.3.0": { node_abi: 83, v8: "8.1" },
  "14.4.0": { node_abi: 83, v8: "8.1" },
  "14.5.0": { node_abi: 83, v8: "8.3" },
  "14.6.0": { node_abi: 83, v8: "8.4" },
  "14.7.0": { node_abi: 83, v8: "8.4" },
  "14.8.0": { node_abi: 83, v8: "8.4" },
  "14.9.0": { node_abi: 83, v8: "8.4" },
  "14.10.0": { node_abi: 83, v8: "8.4" },
  "14.10.1": { node_abi: 83, v8: "8.4" },
  "14.11.0": { node_abi: 83, v8: "8.4" },
  "14.12.0": { node_abi: 83, v8: "8.4" },
  "14.13.0": { node_abi: 83, v8: "8.4" },
  "14.13.1": { node_abi: 83, v8: "8.4" },
  "14.14.0": { node_abi: 83, v8: "8.4" },
  "14.15.0": { node_abi: 83, v8: "8.4" },
  "14.15.1": { node_abi: 83, v8: "8.4" },
  "14.15.2": { node_abi: 83, v8: "8.4" },
  "14.15.3": { node_abi: 83, v8: "8.4" },
  "14.15.4": { node_abi: 83, v8: "8.4" },
  "14.15.5": { node_abi: 83, v8: "8.4" },
  "14.16.0": { node_abi: 83, v8: "8.4" },
  "14.16.1": { node_abi: 83, v8: "8.4" },
  "14.17.0": { node_abi: 83, v8: "8.4" },
  "14.17.1": { node_abi: 83, v8: "8.4" },
  "14.17.2": { node_abi: 83, v8: "8.4" },
  "14.17.3": { node_abi: 83, v8: "8.4" },
  "14.17.4": { node_abi: 83, v8: "8.4" },
  "14.17.5": { node_abi: 83, v8: "8.4" },
  "14.17.6": { node_abi: 83, v8: "8.4" },
  "14.18.0": { node_abi: 83, v8: "8.4" },
  "14.18.1": { node_abi: 83, v8: "8.4" },
  "15.0.0": { node_abi: 88, v8: "8.6" },
  "15.0.1": { node_abi: 88, v8: "8.6" },
  "15.1.0": { node_abi: 88, v8: "8.6" },
  "15.2.0": { node_abi: 88, v8: "8.6" },
  "15.2.1": { node_abi: 88, v8: "8.6" },
  "15.3.0": { node_abi: 88, v8: "8.6" },
  "15.4.0": { node_abi: 88, v8: "8.6" },
  "15.5.0": { node_abi: 88, v8: "8.6" },
  "15.5.1": { node_abi: 88, v8: "8.6" },
  "15.6.0": { node_abi: 88, v8: "8.6" },
  "15.7.0": { node_abi: 88, v8: "8.6" },
  "15.8.0": { node_abi: 88, v8: "8.6" },
  "15.9.0": { node_abi: 88, v8: "8.6" },
  "15.10.0": { node_abi: 88, v8: "8.6" },
  "15.11.0": { node_abi: 88, v8: "8.6" },
  "15.12.0": { node_abi: 88, v8: "8.6" },
  "15.13.0": { node_abi: 88, v8: "8.6" },
  "15.14.0": { node_abi: 88, v8: "8.6" },
  "16.0.0": { node_abi: 93, v8: "9.0" },
  "16.1.0": { node_abi: 93, v8: "9.0" },
  "16.2.0": { node_abi: 93, v8: "9.0" },
  "16.3.0": { node_abi: 93, v8: "9.0" },
  "16.4.0": { node_abi: 93, v8: "9.1" },
  "16.4.1": { node_abi: 93, v8: "9.1" },
  "16.4.2": { node_abi: 93, v8: "9.1" },
  "16.5.0": { node_abi: 93, v8: "9.1" },
  "16.6.0": { node_abi: 93, v8: "9.2" },
  "16.6.1": { node_abi: 93, v8: "9.2" },
  "16.6.2": { node_abi: 93, v8: "9.2" },
  "16.7.0": { node_abi: 93, v8: "9.2" },
  "16.8.0": { node_abi: 93, v8: "9.2" },
  "16.9.0": { node_abi: 93, v8: "9.3" },
  "16.9.1": { node_abi: 93, v8: "9.3" },
  "16.10.0": { node_abi: 93, v8: "9.3" },
  "16.11.0": { node_abi: 93, v8: "9.4" },
  "16.11.1": { node_abi: 93, v8: "9.4" },
  "16.12.0": { node_abi: 93, v8: "9.4" },
  "16.13.0": { node_abi: 93, v8: "9.4" },
  "17.0.0": { node_abi: 102, v8: "9.5" },
  "17.0.1": { node_abi: 102, v8: "9.5" },
  "17.1.0": { node_abi: 102, v8: "9.5" }
};
var Vn;
function Ha() {
  return Vn || (Vn = 1, (function(n, t) {
    n.exports = t;
    const _ = ie, g = Ni(), p = sr, i = Ua(), r = _r();
    let s;
    process.env.NODE_PRE_GYP_ABI_CROSSWALK ? s = or(process.env.NODE_PRE_GYP_ABI_CROSSWALK) : s = $a;
    const c = {};
    Object.keys(s).forEach((o) => {
      const D = o.split(".")[0];
      c[D] || (c[D] = o);
    });
    function m(o, D) {
      if (!o)
        throw new Error("get_electron_abi requires valid runtime arg");
      if (typeof D > "u")
        throw new Error("Empty target version is not supported if electron is the target.");
      const R = g.parse(D);
      return o + "-v" + R.major + "." + R.minor;
    }
    n.exports.get_electron_abi = m;
    function v(o, D) {
      if (!o)
        throw new Error("get_node_webkit_abi requires valid runtime arg");
      if (typeof D > "u")
        throw new Error("Empty target version is not supported if node-webkit is the target.");
      return o + "-v" + D;
    }
    n.exports.get_node_webkit_abi = v;
    function b(o, D) {
      if (!o)
        throw new Error("get_node_abi requires valid runtime arg");
      if (!D)
        throw new Error("get_node_abi requires valid process.versions object");
      const R = g.parse(D.node);
      return R.major === 0 && R.minor % 2 ? o + "-v" + D.node : D.modules ? o + "-v" + +D.modules : "v8-" + D.v8.split(".").slice(0, 2).join(".");
    }
    n.exports.get_node_abi = b;
    function f(o, D) {
      if (!o)
        throw new Error("get_runtime_abi requires valid runtime arg");
      if (o === "node-webkit")
        return v(o, D || process.versions["node-webkit"]);
      if (o === "electron")
        return m(o, D || process.versions.electron);
      if (o !== "node")
        throw new Error("Unknown Runtime: '" + o + "'");
      if (D) {
        let R;
        if (s[D])
          R = s[D];
        else {
          const h = D.split(".").map((O) => +O);
          if (h.length !== 3)
            throw new Error("Unknown target version: " + D);
          const y = h[0];
          let A = h[1], T = h[2];
          if (y === 1)
            for (; ; ) {
              A > 0 && --A, T > 0 && --T;
              const O = "" + y + "." + A + "." + T;
              if (s[O]) {
                R = s[O], console.log("Warning: node-pre-gyp could not find exact match for " + D), console.log("Warning: but node-pre-gyp successfully choose " + O + " as ABI compatible target");
                break;
              }
              if (A === 0 && T === 0)
                break;
            }
          else if (y >= 2)
            c[y] && (R = s[c[y]], console.log("Warning: node-pre-gyp could not find exact match for " + D), console.log("Warning: but node-pre-gyp successfully choose " + c[y] + " as ABI compatible target"));
          else if (y === 0 && h[1] % 2 === 0)
            for (; --T > 0; ) {
              const O = "" + y + "." + A + "." + T;
              if (s[O]) {
                R = s[O], console.log("Warning: node-pre-gyp could not find exact match for " + D), console.log("Warning: but node-pre-gyp successfully choose " + O + " as ABI compatible target");
                break;
              }
            }
        }
        if (!R)
          throw new Error("Unsupported target version: " + D);
        const x = {
          node: D,
          v8: R.v8 + ".0",
          // abi_crosswalk uses 1 for node versions lacking process.versions.modules
          // process.versions.modules added in >= v0.10.4 and v0.11.7
          modules: R.node_abi > 1 ? R.node_abi : void 0
        };
        return b(o, x);
      } else
        return b(o, process.versions);
    }
    n.exports.get_runtime_abi = f;
    const C = [
      "module_name",
      "module_path",
      "host"
    ];
    function E(o, D) {
      const R = o.name + ` package.json is not node-pre-gyp ready:
`, x = [];
      o.main || x.push("main"), o.version || x.push("version"), o.name || x.push("name"), o.binary || x.push("binary");
      const h = o.binary;
      if (h && C.forEach((y) => {
        (!h[y] || typeof h[y] != "string") && x.push("binary." + y);
      }), x.length >= 1)
        throw new Error(R + `package.json must declare these properties: 
` + x.join(`
`));
      if (h) {
        const y = p.parse(h.host).protocol;
        if (y === "http:")
          throw new Error("'host' protocol (" + y + ") is invalid - only 'https:' is accepted");
      }
      r.validate_package_json(o, D);
    }
    n.exports.validate_config = E;
    function a(o, D) {
      return Object.keys(D).forEach((R) => {
        const x = "{" + R + "}";
        for (; o.indexOf(x) > -1; )
          o = o.replace(x, D[R]);
      }), o;
    }
    function d(o) {
      return o.slice(-1) !== "/" ? o + "/" : o;
    }
    function e(o) {
      return o.replace(/\/\//g, "/");
    }
    function l(o) {
      let D = "node";
      return o["node-webkit"] ? D = "node-webkit" : o.electron && (D = "electron"), D;
    }
    n.exports.get_process_runtime = l;
    const S = "{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz", u = "";
    n.exports.evaluate = function(o, D, R) {
      D = D || {}, E(o, D);
      const x = o.version, h = g.parse(x), y = D.runtime || l(process.versions), A = {
        name: o.name,
        configuration: D.debug ? "Debug" : "Release",
        debug: D.debug,
        module_name: o.binary.module_name,
        version: h.version,
        prerelease: h.prerelease.length ? h.prerelease.join(".") : "",
        build: h.build.length ? h.build.join(".") : "",
        major: h.major,
        minor: h.minor,
        patch: h.patch,
        runtime: y,
        node_abi: f(y, D.target),
        node_abi_napi: r.get_napi_version(D.target) ? "napi" : f(y, D.target),
        napi_version: r.get_napi_version(D.target),
        // non-zero numeric, undefined if unsupported
        napi_build_version: R || "",
        node_napi_label: R ? "napi-v" + R : f(y, D.target),
        target: D.target || "",
        platform: D.target_platform || process.platform,
        target_platform: D.target_platform || process.platform,
        arch: D.target_arch || process.arch,
        target_arch: D.target_arch || process.arch,
        libc: D.target_libc || i.familySync() || "unknown",
        module_main: o.main,
        toolset: D.toolset || "",
        // address https://github.com/mapbox/node-pre-gyp/issues/119
        bucket: o.binary.bucket,
        region: o.binary.region,
        s3ForcePathStyle: o.binary.s3ForcePathStyle || !1
      }, T = A.module_name.replace("-", "_"), O = process.env["npm_config_" + T + "_binary_host_mirror"] || o.binary.host;
      A.host = d(a(O, A)), A.module_path = a(o.binary.module_path, A), D.module_root ? A.module_path = _.join(D.module_root, A.module_path) : A.module_path = _.resolve(A.module_path), A.module = _.join(A.module_path, A.module_name + ".node"), A.remote_path = o.binary.remote_path ? e(d(a(o.binary.remote_path, A))) : u;
      const L = o.binary.package_name ? o.binary.package_name : S;
      return A.package_name = a(L, A), A.staged_tarball = _.join("build/stage", A.remote_path, A.package_name), A.hosted_path = p.resolve(A.host, A.remote_path), A.hosted_tarball = p.resolve(A.hosted_path, A.package_name), A;
    };
  })(He, He.exports)), He.exports;
}
var Yn;
function Va() {
  return Yn || (Yn = 1, (function(n, t) {
    const _ = xi(), g = Ha(), p = _r(), i = se.existsSync || ie.existsSync, r = ie;
    n.exports = t, t.usage = "Finds the require path for the node-pre-gyp installed module", t.validate = function(s, c) {
      g.validate_config(s, c);
    }, t.find = function(s, c) {
      if (!i(s))
        throw new Error(s + "does not exist");
      const m = new _.Run({ package_json_path: s, argv: process.argv });
      m.setBinaryHostProperty();
      const v = m.package_json;
      g.validate_config(v, c);
      let b;
      return p.get_napi_build_versions(v, c) && (b = p.get_best_napi_build_version(v, c)), c = c || {}, c.module_root || (c.module_root = r.dirname(s)), g.evaluate(v, c, b).module;
    };
  })($e, $e.exports)), $e.exports;
}
const Ya = "@mapbox/node-pre-gyp", za = "Node.js native addon binary install tool", Ka = "1.0.11", Qa = ["native", "addon", "module", "c", "c++", "bindings", "binary"], Za = "BSD-3-Clause", Ja = "Dane Springmeyer <dane@mapbox.com>", Xa = { type: "git", url: "git://github.com/mapbox/node-pre-gyp.git" }, eu = "./bin/node-pre-gyp", tu = "./lib/node-pre-gyp.js", ru = { "detect-libc": "^2.0.0", "https-proxy-agent": "^5.0.0", "make-dir": "^3.1.0", "node-fetch": "^2.6.7", nopt: "^5.0.0", npmlog: "^5.0.1", rimraf: "^3.0.2", semver: "^7.3.5", tar: "^6.1.11" }, nu = { "@mapbox/cloudfriend": "^5.1.0", "@mapbox/eslint-config-mapbox": "^3.0.0", "aws-sdk": "^2.1087.0", codecov: "^3.8.3", eslint: "^7.32.0", "eslint-plugin-node": "^11.1.0", "mock-aws-s3": "^4.0.2", nock: "^12.0.3", "node-addon-api": "^4.3.0", nyc: "^15.1.0", tape: "^5.5.2", "tar-fs": "^2.1.1" }, iu = { all: !0, "skip-full": !1, exclude: ["test/**"] }, au = { coverage: "nyc --all --include index.js --include lib/ npm test", "upload-coverage": "nyc report --reporter json && codecov --clear --flags=unit --file=./coverage/coverage-final.json", lint: "eslint bin/node-pre-gyp lib/*js lib/util/*js test/*js scripts/*js", fix: "npm run lint -- --fix", "update-crosswalk": "node scripts/abi_crosswalk.js", test: "tape test/*test.js" }, uu = {
  name: Ya,
  description: za,
  version: Ka,
  keywords: Qa,
  license: Za,
  author: Ja,
  repository: Xa,
  bin: eu,
  main: tu,
  dependencies: ru,
  devDependencies: nu,
  nyc: iu,
  scripts: au
};
var zn;
function xi() {
  return zn || (zn = 1, (function(n, t) {
    n.exports = t, t.mockS3Http = Zi().get_mockS3Http(), t.mockS3Http("on");
    const _ = t.mockS3Http("get"), g = se, p = ie, i = Xi(), r = wi();
    r.disableProgress();
    const s = _r(), c = ge.EventEmitter, m = ue.inherits, v = [
      "clean",
      "install",
      "reinstall",
      "build",
      "rebuild",
      "package",
      "testpackage",
      "publish",
      "unpublish",
      "info",
      "testbinary",
      "reveal",
      "configure"
    ], b = {};
    r.heading = "node-pre-gyp", _ && r.warn(`mocking s3 to ${process.env.node_pre_gyp_mock_s3}`), Object.defineProperty(t, "find", {
      get: function() {
        return Va().find;
      },
      enumerable: !0
    });
    function f({ package_json_path: E = "./package.json", argv: a }) {
      this.package_json_path = E, this.commands = {};
      const d = this;
      v.forEach((e) => {
        d.commands[e] = function(l, S) {
          return r.verbose("command", e, l), or("./" + e)(d, l, S);
        };
      }), this.parseArgv(a), this.binaryHostSet = !1;
    }
    m(f, c), t.Run = f;
    const C = f.prototype;
    C.package = uu, C.configDefs = {
      help: Boolean,
      // everywhere
      arch: String,
      // 'configure'
      debug: Boolean,
      // 'build'
      directory: String,
      // bin
      proxy: String,
      // 'install'
      loglevel: String
      // everywhere
    }, C.shorthands = {
      release: "--no-debug",
      C: "--directory",
      debug: "--debug",
      j: "--jobs",
      silent: "--loglevel=silent",
      silly: "--loglevel=silly",
      verbose: "--loglevel=verbose"
    }, C.aliases = b, C.parseArgv = function(a) {
      this.opts = i(this.configDefs, this.shorthands, a), this.argv = this.opts.argv.remain.slice();
      const d = this.todo = [];
      a = this.argv.map((S) => (S in this.aliases && (S = this.aliases[S]), S)), a.slice().forEach((S) => {
        if (S in this.commands) {
          const u = a.splice(0, a.indexOf(S));
          a.shift(), d.length > 0 && (d[d.length - 1].args = u), d.push({ name: S, args: [] });
        }
      }), d.length > 0 && (d[d.length - 1].args = a.splice(0));
      let e = this.package_json_path;
      this.opts.directory && (e = p.join(this.opts.directory, e)), this.package_json = JSON.parse(g.readFileSync(e)), this.todo = s.expand_commands(this.package_json, this.opts, d);
      const l = "npm_config_";
      Object.keys(process.env).forEach((S) => {
        if (S.indexOf(l) !== 0) return;
        const u = process.env[S];
        S === l + "loglevel" ? r.level = u : (S = S.substring(l.length), S === "argv" ? this.opts.argv && this.opts.argv.remain && this.opts.argv.remain.length || (this.opts[S] = u) : this.opts[S] = u);
      }), this.opts.loglevel && (r.level = this.opts.loglevel), r.resume();
    }, C.setBinaryHostProperty = function(E) {
      if (this.binaryHostSet)
        return this.package_json.binary.host;
      const a = this.package_json;
      if (!a || !a.binary || a.binary.host || !a.binary.staging_host || !a.binary.production_host)
        return "";
      let d = "production_host";
      (E === "publish" || E === "unpublish") && (d = "staging_host");
      const e = process.env.node_pre_gyp_s3_host;
      if (e === "staging" || e === "production")
        d = `${e}_host`;
      else if (this.opts.s3_host === "staging" || this.opts.s3_host === "production")
        d = `${this.opts.s3_host}_host`;
      else if (this.opts.s3_host || e)
        throw new Error(`invalid s3_host ${this.opts.s3_host || e}`);
      return a.binary.host = a.binary[d], this.binaryHostSet = !0, a.binary.host;
    }, C.usage = function() {
      return [
        "",
        "  Usage: node-pre-gyp <command> [options]",
        "",
        "  where <command> is one of:",
        v.map((d) => "    - " + d + " - " + or("./" + d).usage).join(`
`),
        "",
        "node-pre-gyp@" + this.version + "  " + p.resolve(__dirname, ".."),
        "node@" + process.versions.node
      ].join(`
`);
    }, Object.defineProperty(C, "version", {
      get: function() {
        return this.package.version;
      },
      enumerable: !0
    });
  })(Be, Be.exports)), Be.exports;
}
var ou = xi();
const su = /* @__PURE__ */ Ii(ou), lu = Ae.dirname(Qn(import.meta.url)), fu = ki(import.meta.url), Kn = su.find(Ae.resolve(Ae.join(lu, "../package.json"))), tt = xe.existsSync(Kn) ? fu(Kn) : {
  getActiveWindow() {
  },
  getOpenWindows() {
  }
};
async function cu() {
  return tt.getActiveWindow();
}
function Ti() {
  return tt.getActiveWindow();
}
function du() {
  return tt.getOpenWindows();
}
function Oi() {
  return tt.getOpenWindows();
}
const Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activeWindow: cu,
  activeWindowSync: Ti,
  openWindows: du,
  openWindowsSync: Oi
}, Symbol.toStringTag, { value: "Module" }));
async function Nu(n) {
  if (te.platform === "darwin") {
    const { activeWindow: t } = await Promise.resolve().then(() => ei);
    return t(n);
  }
  if (te.platform === "linux") {
    const { activeWindow: t } = await Promise.resolve().then(() => fi);
    return t(n);
  }
  if (te.platform === "win32") {
    const { activeWindow: t } = await Promise.resolve().then(() => Bi);
    return t(n);
  }
  throw new Error("macOS, Linux, and Windows only");
}
function Iu(n) {
  if (te.platform === "darwin")
    return Jn(n);
  if (te.platform === "linux")
    return si();
  if (te.platform === "win32")
    return Ti();
  throw new Error("macOS, Linux, and Windows only");
}
async function Lu(n) {
  if (te.platform === "darwin") {
    const { openWindows: t } = await Promise.resolve().then(() => ei);
    return t(n);
  }
  if (te.platform === "linux") {
    const { openWindows: t } = await Promise.resolve().then(() => fi);
    return t(n);
  }
  if (te.platform === "win32") {
    const { openWindows: t } = await Promise.resolve().then(() => Bi);
    return t(n);
  }
  throw new Error("macOS, Linux, and Windows only");
}
function Mu(n) {
  if (te.platform === "darwin")
    return Xn(n);
  if (te.platform === "linux")
    return li();
  if (te.platform === "win32")
    return Oi();
  throw new Error("macOS, Linux, and Windows only");
}
export {
  Nu as activeWindow,
  Iu as activeWindowSync,
  Lu as openWindows,
  Mu as openWindowsSync
};
