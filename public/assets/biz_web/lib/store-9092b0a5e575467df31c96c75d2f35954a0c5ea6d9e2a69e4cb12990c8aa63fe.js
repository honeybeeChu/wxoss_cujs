define("biz_web/lib/store.js", ["biz_web/lib/json.js"], function (e, t, n) {
    try {
        var r = +(new Date), i = e("biz_web/lib/json.js"), s = {}, o = window.document, u = "localStorage", a = "__storejs__", f;
        s.disabled = !1, s.set = function (e, t) {
        }, s.get = function (e) {
        }, s.remove = function (e) {
        }, s.clear = function () {
        }, s.transact = function (e, t, n) {
            var r = s.get(e);
            n == null && (n = t, t = null), typeof r == "undefined" && (r = t || {}), n(r), s.set(e, r);
        }, s.getAll = function () {
        }, s.serialize = function (e) {
            return i.stringify2(e);
        }, s.deserialize = function (e) {
            if (typeof e != "string") return undefined;
            try {
                return i.parse(e);
            } catch (t) {
                return e || undefined;
            }
        };
        function l() {
            try {
                return u in window && window[u];
            } catch (e) {
                return !1;
            }
        }

        if (l()) f = window[u], s.set = function (e, t) {
            if (t === undefined) return s.remove(e);
            try {
                f.setItem(e, s.serialize(t));
            } catch (n) {
                f.clear(), f.setItem(e, s.serialize(t));
            }
            return t;
        }, s.get = function (e) {
            return s.deserialize(f.getItem(e));
        }, s.remove = function (e) {
            f.removeItem(e);
        }, s.clear = function () {
            f.clear();
        }, s.getAll = function () {
            var e = {};
            for (var t = 0; t < f.length; ++t) {
                var n = f.key(t);
                e[n] = s.get(n);
            }
            return e;
        }; else if (o.documentElement.addBehavior) {
            var c, h;
            try {
                h = new ActiveXObject("htmlfile"), h.open(), h.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>'), h.close(), c = h.w.frames[0].document, f = c.createElement("div");
            } catch (p) {
                f = o.createElement("div"), c = o.body;
            }
            function d(e) {
                return function () {
                    var t = Array.prototype.slice.call(arguments, 0);
                    t.unshift(f), c.appendChild(f), f.addBehavior("#default#userData"), f.load(u);
                    var n = e.apply(s, t);
                    return c.removeChild(f), n;
                };
            }

            var v = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");

            function m(e) {
                return e.replace(v, "___");
            }

            s.set = d(function (e, t, n) {
                return t = m(t), n === undefined ? s.remove(t) : (e.setAttribute(t, s.serialize(n)), e.save(u), n);
            }), s.get = d(function (e, t) {
                return t = m(t), s.deserialize(e.getAttribute(t));
            }), s.remove = d(function (e, t) {
                t = m(t), e.removeAttribute(t), e.save(u);
            }), s.clear = d(function (e) {
                var t = e.XMLDocument.documentElement.attributes;
                e.load(u);
                for (var n = 0, r; r = t[n]; n++) e.removeAttribute(r.name);
                e.save(u);
            }), s.getAll = d(function (e) {
                var t = e.XMLDocument.documentElement.attributes, n = {};
                for (var r = 0, i; i = t[r]; ++r) {
                    var o = m(i.name);
                    n[i.name] = s.deserialize(e.getAttribute(o));
                }
                return n;
            });
        }
        try {
            s.set(a, a), s.get(a) != a && (s.disabled = !0), s.remove(a);
        } catch (p) {
            s.disabled = !0;
        }
        s.enabled = !s.disabled, n.exports = s;
    } catch (p) {
        wx.jslog({
            src: "biz_web/lib/store.js"
        }, p);
    }
});
