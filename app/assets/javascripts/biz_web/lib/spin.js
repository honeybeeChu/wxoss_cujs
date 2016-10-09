define("biz_web/lib/spin.js", [], function (e, t, n) {
    try {
        var r = +(new Date), i = function () {
            function e(e, t) {
                var n = ~~((e[a] - 1) / 2);
                for (var r = 1; r <= n; r++) t(e[r * 2 - 1], e[r * 2]);
            }

            function t(t) {
                var n = document.createElement(t || "div");
                return e(arguments, function (e, t) {
                    n[e] = t;
                }), n;
            }

            function n(e, t, r) {
                return r && !r[x] && n(e, r), e.insertBefore(t, r || null), e;
            }

            function r(e, t) {
                var n = [p, t, ~~(e * 100)].join("-"), r = "{" + p + ":" + e + "}", i;
                if (!H[n]) {
                    for (i = 0; i < P[a]; i++) try {
                        j.insertRule("@" + (P[i] && "-" + P[i].toLowerCase() + "-" || "") + "keyframes " + n + "{0%{" + p + ":1}" + t + "%" + r + "to" + r + "}", j.cssRules[a]);
                    } catch (s) {
                    }
                    H[n] = 1;
                }
                return n;
            }

            function i(e, t) {
                var n = e[m], r, i;
                if (n[t] !== undefined) return t;
                t = t.charAt(0).toUpperCase() + t.slice(1);
                for (i = 0; i < P[a]; i++) {
                    r = P[i] + t;
                    if (n[r] !== undefined) return r;
                }
            }

            function s(t) {
                return e(arguments, function (e, n) {
                    t[m][i(t, e) || e] = n;
                }), t;
            }

            function o(t) {
                return e(arguments, function (e, n) {
                    t[e] === undefined && (t[e] = n);
                }), t;
            }

            var u = "width", a = "length", f = "radius", l = "lines", c = "trail", h = "color", p = "opacity", d = "speed", v = "shadow", m = "style", g = "height", y = "left", b = "top", w = "px", E = "childNodes", S = "firstChild", x = "parentNode", T = "position", N = "relative", C = "absolute", k = "animation", L = "transform", A = "Origin", O = "Timeout", M = "coord", _ = "#000", D = m + "Sheets", P = "webkit0Moz0ms0O".split(0), H = {}, B;
            n(document.getElementsByTagName("head")[0], t(m));
            var j = document[D][document[D][a] - 1], F = function (e) {
                this.opts = o(e || {}, l, 12, c, 100, a, 7, u, 5, f, 10, h, _, p, .25, d, 1);
            }, I = F.prototype = {
                spin: function (e) {
                    var t = this, r = t.el = t[l](t.opts);
                    e && n(e, s(r, y, ~~(e.offsetWidth / 2) + w, b, ~~(e.offsetHeight / 2) + w), e[S]);
                    if (!B) {
                        var i = t.opts, o = 0, u = 20 / i[d], a = (1 - i[p]) / (u * i[c] / 100), f = u / i[l];
                        (function h() {
                            o++;
                            for (var e = i[l]; e; e--) {
                                var n = Math.max(1 - (o + e * f) % u * a, i[p]);
                                t[p](r, i[l] - e, n, i);
                            }
                            t[O] = t.el && window["set" + O](h, 50);
                        })();
                    }
                    return t;
                },
                stop: function () {
                    var e = this, t = e.el;
                    return window["clear" + O](e[O]), t && t[x] && t[x].removeChild(t), e.el = undefined, e;
                }
            };
            I[l] = function (e) {
                function i(n, r) {
                    return s(t(), T, C, u, e[a] + e[u] + w, g, e[u] + w, "background", n, "boxShadow", r, L + A, y, L, "rotate(" + ~~(360 / e[l] * E) + "deg) translate(" + e[f] + w + ",0)", "borderRadius", "100em");
                }

                var o = s(t(), T, N), m = r(e[p], e[c]), E = 0, S;
                for (; E < e[l]; E++) S = s(t(), T, C, b, 1 + ~(e[u] / 2) + w, L, "translate3d(0,0,0)", k, m + " " + 1 / e[d] + "s linear infinite " + (1 / e[l] / e[d] * E - 1 / e[d]) + "s"), e[v] && n(S, s(i(_, "0 0 4px " + _), b, 2 + w)), n(o, n(S, i(e[h], "0 0 1px rgba(0,0,0,.1)")));
                return o;
            }, I[p] = function (e, t, n) {
                e[E][t][m][p] = n;
            };
            var q = "behavior", R = "url(#default#VML)", U = "group0roundrect0fill0stroke".split(0);
            return function () {
                var e = s(t(U[0]), q, R), r;
                if (!i(e, L) && e.adj) {
                    for (r = 0; r < U[a]; r++) j.addRule(U[r], q + ":" + R);
                    I[l] = function () {
                        function e() {
                            return s(t(U[0], M + "size", c + " " + c, M + A, -o + " " + -o), u, c, g, c);
                        }

                        function r(r, a, c) {
                            n(d, n(s(e(), "rotation", 360 / i[l] * r + "deg", y, ~~a), n(s(t(U[1], "arcsize", 1), u, o, g, i[u], y, i[f], b, -i[u] / 2, "filter", c), t(U[2], h, i[h], p, i[p]), t(U[3], p, 0))));
                        }

                        var i = this.opts, o = i[a] + i[u], c = 2 * o, d = e(), m = ~(i[a] + i[f] + i[u]) + w, E;
                        if (i[v]) for (E = 1; E <= i[l]; E++) r(E, -2, "progid:DXImage" + L + ".Microsoft.Blur(pixel" + f + "=2,make" + v + "=1," + v + p + "=.3)");
                        for (E = 1; E <= i[l]; E++) r(E);
                        return n(s(t(), "margin", m + " 0 0 " + m, T, N), d);
                    }, I[p] = function (e, t, n, r) {
                        r = r[v] && r[l] || 0, e[S][E][t + r][S][S][p] = n;
                    };
                } else B = i(e, k);
            }(), F;
        }();
        $.fn.spin = function (e, t) {
            return this.each(function () {
                var n = $(this), r = n.data();
                r.spinner && (r.spinner.stop(), delete r.spinner), e !== !1 && (e = $.extend({
                    color: t || n.css("color")
                }, $.fn.spin.presets[e] || e), r.spinner = (new i(e)).spin(this));
            });
        }, $.fn.spin.presets = {
            tiny: {
                lines: 8,
                length: 2,
                width: 2,
                radius: 3
            },
            small: {
                lines: 8,
                length: 4,
                width: 3,
                radius: 5
            },
            large: {
                lines: 10,
                length: 8,
                width: 4,
                radius: 8
            }
        };
    } catch (s) {
        wx.jslog({
            src: "biz_web/lib/spin.js"
        }, s);
    }
});