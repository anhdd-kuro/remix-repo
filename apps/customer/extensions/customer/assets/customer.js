"use strict";
function S(e, s, t, r, a) {
  return {
    issues: [{ context: e, reference: s, input: t, label: r, received: a }],
  };
}
function C(e) {
  return { output: e };
}
function k(e, s) {
  return Array.isArray(e) ? [void 0, e] : [e, s];
}
var c;
function W(e) {
  return {
    lang: (e == null ? void 0 : e.lang) ?? (c == null ? void 0 : c.lang),
    message: e == null ? void 0 : e.message,
    abortEarly:
      (e == null ? void 0 : e.abortEarly) ??
      (c == null ? void 0 : c.abortEarly),
    abortPipeEarly:
      (e == null ? void 0 : e.abortPipeEarly) ??
      (c == null ? void 0 : c.abortPipeEarly),
    skipPipe:
      (e == null ? void 0 : e.skipPipe) ?? (c == null ? void 0 : c.skipPipe),
  };
}
var U;
function Y(e) {
  return U == null ? void 0 : U.get(e);
}
var M;
function Z(e) {
  return M == null ? void 0 : M.get(e);
}
var z;
function g(e, s) {
  var t;
  return (t = z == null ? void 0 : z.get(e)) == null ? void 0 : t.get(s);
}
function K(e, s, t, r, a) {
  const u =
    s.message ??
    g(t, a.lang) ??
    (e ? Z(a.lang) : null) ??
    (r == null ? void 0 : r.message) ??
    Y(a.lang) ??
    a.message;
  return typeof u == "function" ? u(a) : u;
}
function w(e, s, t) {
  return { typed: e, output: s, issues: t };
}
function F(e) {
  let s = typeof e;
  return (
    s === "object" &&
      (s = e ? Object.getPrototypeOf(e).constructor.name : "null"),
    s === "string"
      ? `"${e}"`
      : s === "number" || s === "bigint" || s === "boolean"
        ? `${e}`
        : s
  );
}
function ee(e, s, t) {
  const r = t.received ?? F(t.input),
    a = {
      reason: e.type,
      context: t.context.type,
      expected: t.context.expects,
      received: r,
      message: `Invalid ${t.label}: ${t.context.expects ? `Expected ${t.context.expects} but r` : "R"}eceived ${r}`,
      input: t.input,
      requirement: t.context.requirement,
      path: t.path,
      lang: s == null ? void 0 : s.lang,
      abortEarly: s == null ? void 0 : s.abortEarly,
      abortPipeEarly: s == null ? void 0 : s.abortPipeEarly,
      skipPipe: s == null ? void 0 : s.skipPipe,
    };
  return (a.message = K(!1, t.context, t.reference, s, a)), a;
}
function P(e, s, t, r) {
  if (e.pipe && !(t != null && t.skipPipe))
    for (const a of e.pipe) {
      const u = a._parse(s);
      if (u.issues) {
        for (const i of u.issues) {
          const l = ee(e, t, i);
          r ? r.push(l) : (r = [l]);
        }
        if ((t != null && t.abortEarly) || (t != null && t.abortPipeEarly))
          break;
      } else s = u.output;
    }
  return w(!0, s, r);
}
function O(e, s, t) {
  if (!e || (typeof e == "object" && !Array.isArray(e))) {
    const [u, i] = k(s, t);
    return [e, u, i];
  }
  const [r, a] = k(e, s);
  return [void 0, r, a];
}
function E(e, s, t, r, a) {
  const u = F(t),
    i = (a == null ? void 0 : a.expected) ?? e.expects,
    l = {
      reason: (a == null ? void 0 : a.reason) ?? "type",
      context: e.type,
      expected: i,
      received: u,
      message: `Invalid type: Expected ${i} but received ${u}`,
      input: t,
      path: a == null ? void 0 : a.path,
      issues: a == null ? void 0 : a.issues,
      lang: r == null ? void 0 : r.lang,
      abortEarly: r == null ? void 0 : r.abortEarly,
      abortPipeEarly: r == null ? void 0 : r.abortPipeEarly,
      skipPipe: r == null ? void 0 : r.skipPipe,
    };
  return (l.message = K(!0, e, s, r, l)), { typed: !1, output: t, issues: [l] };
}
function te(e, s) {
  return {
    ...e,
    _parse(t) {
      const r = e._parse(t);
      if (r.issues)
        for (const a of r.issues) {
          let u = t;
          for (const i of s) {
            const l = u[i];
            a.input = l;
            const n = {
              type: "unknown",
              origin: "value",
              input: u,
              key: i,
              value: l,
            };
            if ((a.path ? a.path.push(n) : (a.path = [n]), !l)) break;
            u = l;
          }
        }
      return r;
    },
  };
}
function V(e) {
  return typeof e.default == "function" ? e.default() : e.default;
}
function X(e, s) {
  const [t, r] = k(e, s);
  return {
    type: "boolean",
    expects: "boolean",
    async: !1,
    message: t,
    pipe: r,
    _parse(a, u) {
      return typeof a == "boolean" ? P(this, a, u) : E(this, X, a, u);
    },
  };
}
function x(e, s) {
  return {
    type: "literal",
    expects: F(e),
    async: !1,
    literal: e,
    message: s,
    _parse(t, r) {
      return t === this.literal ? w(!0, t) : E(this, x, t, r);
    },
  };
}
function H(e, s) {
  return {
    type: "nullish",
    expects: `${e.expects} | null | undefined`,
    async: !1,
    wrapped: e,
    default: s,
    _parse(t, r) {
      if (t == null) {
        const a = V(this);
        if (a === void 0) return w(!0, t);
        t = a;
      }
      return this.wrapped._parse(t, r);
    },
  };
}
function b(e, s, t, r) {
  const [a, u, i] = O(s, t, r);
  let l;
  return {
    type: "object",
    expects: "Object",
    async: !1,
    entries: e,
    rest: a,
    message: u,
    pipe: i,
    _parse(n, p) {
      if (n && typeof n == "object") {
        l = l ?? Object.entries(this.entries);
        let m = !0,
          o;
        const $ = {};
        for (const [d, j] of l) {
          const f = n[d],
            h = j._parse(f, p);
          if (h.issues) {
            const v = {
              type: "object",
              origin: "value",
              input: n,
              key: d,
              value: f,
            };
            for (const A of h.issues)
              A.path ? A.path.unshift(v) : (A.path = [v]),
                o == null || o.push(A);
            if ((o || (o = h.issues), p != null && p.abortEarly)) {
              m = !1;
              break;
            }
          }
          h.typed || (m = !1),
            (h.output !== void 0 || d in n) && ($[d] = h.output);
        }
        if (this.rest && !(p != null && p.abortEarly && o)) {
          for (const d in n)
            if (!(d in this.entries)) {
              const j = n[d],
                f = this.rest._parse(j, p);
              if (f.issues) {
                const h = {
                  type: "object",
                  origin: "value",
                  input: n,
                  key: d,
                  value: j,
                };
                for (const v of f.issues)
                  v.path ? v.path.unshift(h) : (v.path = [h]),
                    o == null || o.push(v);
                if ((o || (o = f.issues), p != null && p.abortEarly)) {
                  m = !1;
                  break;
                }
              }
              f.typed || (m = !1), ($[d] = f.output);
            }
        }
        return m ? P(this, $, p, o) : w(!1, $, o);
      }
      return E(this, b, n, p);
    },
  };
}
function se(e, s) {
  return {
    type: "optional",
    expects: `${e.expects} | undefined`,
    async: !1,
    wrapped: e,
    default: s,
    _parse(t, r) {
      if (t === void 0) {
        const a = V(this);
        if (a === void 0) return w(!0, t);
        t = a;
      }
      return this.wrapped._parse(t, r);
    },
  };
}
function y(e, s) {
  const [t, r] = k(e, s);
  return {
    type: "string",
    expects: "string",
    async: !1,
    message: t,
    pipe: r,
    _parse(a, u) {
      return typeof a == "string" ? P(this, a, u) : E(this, y, a, u);
    },
  };
}
function D(e) {
  let s;
  if (e)
    for (const t of e)
      if (s) for (const r of t.issues) s.push(r);
      else s = t.issues;
  return s;
}
function I(e, s, t) {
  const [r, a] = k(s, t);
  return {
    type: "union",
    expects: [...new Set(e.map((u) => u.expects))].join(" | "),
    async: !1,
    options: e,
    message: r,
    pipe: a,
    _parse(u, i) {
      let l, n, p;
      for (const m of this.options) {
        const o = m._parse(u, i);
        if (o.typed)
          if (o.issues) p ? p.push(o) : (p = [o]);
          else {
            l = o;
            break;
          }
        else n ? n.push(o) : (n = [o]);
      }
      if (l) return P(this, l.output, i);
      if (p != null && p.length) {
        const m = p[0];
        return P(
          this,
          m.output,
          i,
          p.length === 1
            ? m.issues
            : E(this, I, u, i, { reason: "union", issues: D(p) }).issues
        );
      }
      return (n == null ? void 0 : n.length) === 1
        ? n[0]
        : E(this, I, u, i, { issues: D(n) });
    },
  };
}
function R(e, s, t, r) {
  const [a, u, i] = O(s, t, r);
  return b(
    e.reduce((l, n) => ({ ...l, ...n.entries }), {}),
    a,
    u,
    i
  );
}
function J(e, s, t, r) {
  const [a, u, i] = O(s, t, r);
  return b(
    Object.entries(e.entries).reduce((l, [n, p]) => ({ ...l, [n]: se(p) }), {}),
    a,
    u,
    i
  );
}
function G(e, s, t, r, a) {
  const [u, i, l] = O(t, r, a);
  return b(
    Object.entries(e.entries).reduce(
      (n, [p, m]) => (s.includes(p) ? { ...n, [p]: m } : n),
      {}
    ),
    u,
    i,
    l
  );
}
function re(e, s, t) {
  const r = e._parse(s, W(t));
  return {
    typed: r.typed,
    success: !r.issues,
    output: r.output,
    issues: r.issues,
  };
}
var ae = /^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;
function N(e, s) {
  return {
    type: "custom",
    expects: null,
    async: !1,
    message: s,
    requirement: e,
    _parse(t) {
      return this.requirement(t) ? C(t) : S(this, N, t, "input");
    },
  };
}
function Q(e) {
  return {
    type: "email",
    expects: null,
    async: !1,
    message: e,
    requirement: ae,
    _parse(s) {
      return this.requirement.test(s) ? C(s) : S(this, Q, s, "email");
    },
  };
}
function _(e, s) {
  return {
    type: "min_length",
    expects: `>=${e}`,
    async: !1,
    message: s,
    requirement: e,
    _parse(t) {
      return t.length >= this.requirement
        ? C(t)
        : S(this, _, t, "length", `${t.length}`);
    },
  };
}
function T(e, s) {
  return {
    type: "regex",
    expects: `${e}`,
    async: !1,
    message: s,
    requirement: e,
    _parse(t) {
      return this.requirement.test(t) ? C(t) : S(this, T, t, "format");
    },
  };
}
const q = b(
    {
      first_name: y("名前が正しくありません", [_(1, "名前が必須です")]),
      last_name: y("苗字が正しくありません", [_(1, "苗字が必須です")]),
      email: y("メールアドレスが正しくありません", [
        Q("メールアドレスが正しくありません"),
        _(1, "メールアドレスが必須です"),
      ]),
      phone: y("電話番号が正しくありません", [
        _(8, "有効な電話番号を入力してください"),
      ]),
      password: y("パスワードは正しくありません", [
        _(8, "パスワードは8文字以上で入力してください"),
      ]),
      password_confirmation: y("パスワードは正しくありません", [
        _(8, "パスワードは8文字以上で入力してください"),
      ]),
      date_of_birth: y("生年月日の形式が正しくありません", [
        _(1, "生年月日が必須です"),
      ]),
      gender: I([x("男性"), x("女性"), x("未回答")], "性別が必須です"),
      accept_email_marketing: H(
        I([x("true"), x("false")], "メールマガジンの値が正しくありません")
      ),
    },
    [
      te(
        N(
          (e) => e.password === e.password_confirmation,
          "パスワードが一致しません"
        ),
        ["password_confirmation"]
      ),
    ]
  ),
  ue = R([
    q,
    b({
      accept_email_marketing: H(X("メールマガジンの値が正しくありません")),
      date_of_birth: y([
        T(/^\d{4}-\d{2}-\d{2}$/, "生年月日の形式が正しくありません"),
      ]),
    }),
  ]),
  L = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "date_of_birth",
    "gender",
    "accept_email_marketing",
  ],
  ne = R([J(G(q, L)), b({ id: y() })]),
  pe = R([G(q, L), b({ id: y() })]);
R([J(G(ue, L)), b({ id: y() })]);
const B = "/apps/custom-customer/app/api";
window.CustomerApp = {
  ...window.CustomerApp,
  safeParseSchema: re,
  CustomerRegisterFormSchema: q,
  CustomerUpdateFormOptionalSchema: ne,
  CustomerUpdateFormRequiredSchema: pe,
  registerApiUrl: B + "/customer/register",
  updateApiUrl: B + "/customer/update",
};
