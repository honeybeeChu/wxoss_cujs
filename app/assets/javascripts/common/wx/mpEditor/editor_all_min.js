define("common/wx/mpEditor/editor_all_min.js", ["biz_web/lib/store.js", "common/lib/colorpicker.js", "tpl/mpEditor/layout.html.js"],
    function (require, exports, module) {
        function getListener(e, t, i) {
            var n;
            return t = t.toLowerCase(), (n = e.__allListeners || i && (e.__allListeners = {})) && (n[t] || i && (n[t] = []));
        }

        function getDomNode(e, t, i, n, o, r) {
            var s, a = n && e[t];
            for (!a && (a = e[i]); !a && (s = (s || e).parentNode);) {
                if ("BODY" == s.tagName || r && !r(s))return null;
                a = s[i];
            }
            return a && o && !o(a) ? getDomNode(a, t, i, !1, o) : a;
        }

        var store = require("biz_web/lib/store.js"), LibColorPicker = require("common/lib/colorpicker.js"), baidu = window.baidu || {};
        window.baidu = baidu, window.UE = baidu.editor = {}, UE.plugins = {}, UE.commands = {}, UE.instants = {},
            UE.I18N = {}, UE.version = "1.2.6.3";
        var dom = UE.dom = {}, browser = UE.browser = function () {
            var e = navigator.userAgent.toLowerCase(), t = window.opera, i = {
                edge: /edge\/([\w.]+)/i.test(e),
                ie: /(msie\s|trident.*rv:)([\w.]+)/.test(e),
                opera: !!t && t.version,
                webkit: e.indexOf(" applewebkit/") > -1,
                mac: e.indexOf("macintosh") > -1,
                quirks: "BackCompat" == document.compatMode
            };
            i.gecko = "Gecko" == navigator.product && !i.webkit && !i.opera && !i.ie;
            var n = 0;
            if (i.ie) {
                var o = e.match(/(?:msie\s([\w.]+))/), r = e.match(/(?:trident.*rv:([\w.]+))/);
                n = o && r && o[1] && r[1] ? Math.max(1 * o[1], 1 * r[1]) : o && o[1] ? 1 * o[1] : r && r[1] ? 1 * r[1] : 0, i.ie11Compat = 11 == document.documentMode,
                    i.ie9Compat = 9 == document.documentMode, i.ie8 = !!document.documentMode, i.ie8Compat = 8 == document.documentMode,
                    i.ie7Compat = 7 == n && !document.documentMode || 7 == document.documentMode, i.ie6Compat = 7 > n || i.quirks,
                    i.ie9above = n > 8, i.ie9below = 9 > n, i.ie11above = n > 10, i.ie11below = 11 > n;
            }
            if (i.gecko) {
                var s = e.match(/rv:([\d\.]+)/);
                s && (s = s[1].split("."), n = 1e4 * s[0] + 100 * (s[1] || 0) + 1 * (s[2] || 0));
            }
            return /chrome\/(\d+\.\d)/i.test(e) && (i.chrome = +RegExp.$1), /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(e) && !/chrome/i.test(e) && (i.safari = +(RegExp.$1 || RegExp.$2)),
            i.opera && (n = parseFloat(t.version())), i.webkit && (n = parseFloat(e.match(/ applewebkit\/(\d+)/)[1])),
                i.version = n, i.isCompatible = !i.mobile && (i.ie && n >= 6 || i.gecko && n >= 10801 || i.opera && n >= 9.5 || i.air && n >= 1 || i.webkit && n >= 522 || !1),
                i;
        }(), ie = browser.ie, webkit = browser.webkit, gecko = browser.gecko, opera = browser.opera, utils = UE.utils = {
            each: function (e, t, i) {
                if (null != e)if (e.length === +e.length) {
                    for (var n = 0, o = e.length; o > n; n++)if (t.call(i, e[n], n, e) === !1)return !1;
                } else for (var r in e)if (e.hasOwnProperty(r) && t.call(i, e[r], r, e) === !1)return !1;
            },
            makeInstance: function (e) {
                var t = new Function;
                return t.prototype = e, e = new t, t.prototype = null, e;
            },
            extend: function (e, t, i) {
                if (t)for (var n in t)i && e.hasOwnProperty(n) || (e[n] = t[n]);
                return e;
            },
            extend2: function (e) {
                for (var t = arguments, i = 1; i < t.length; i++) {
                    var n = t[i];
                    for (var o in n)e.hasOwnProperty(o) || (e[o] = n[o]);
                }
                return e;
            },
            inherits: function (e, t) {
                var i = e.prototype, n = utils.makeInstance(t.prototype);
                return utils.extend(n, i, !0), e.prototype = n, n.constructor = e;
            },
            bind: function (e, t) {
                return function () {
                    return e.apply(t, arguments);
                };
            },
            defer: function (e, t, i) {
                var n;
                return function () {
                    i && clearTimeout(n), n = setTimeout(e, t);
                };
            },
            indexOf: function (e, t, i) {
                var n = -1;
                return i = this.isNumber(i) ? i : 0, this.each(e, function (e, o) {
                    return o >= i && e === t ? (n = o, !1) : void 0;
                }), n;
            },
            removeItem: function (e, t) {
                for (var i = 0, n = e.length; n > i; i++)e[i] === t && (e.splice(i, 1), i--);
            },
            trim: function (e) {
                return e.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "");
            },
            listToMap: function (e) {
                if (!e)return {};
                e = utils.isArray(e) ? e : e.split(",");
                for (var t, i = 0, n = {}; t = e[i++];)n[t.toUpperCase()] = n[t] = 1;
                return n;
            },
            unhtml: function (e, t) {
                return e ? e.replace(t || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function (e, t) {
                    return t ? e : {
                        "<": "&lt;",
                        "&": "&amp;",
                        '"': "&quot;",
                        ">": "&gt;",
                        "'": "&#39;"
                    }[e];
                }) : "";
            },
            html: function (e) {
                return e ? e.replace(/&((g|l|quo)t|amp|#39);/g, function (e) {
                    return {
                        "&lt;": "<",
                        "&amp;": "&",
                        "&quot;": '"',
                        "&gt;": ">",
                        "&#39;": "'"
                    }[e];
                }) : "";
            },
            cssStyleToDomStyle: function () {
                var e = document.createElement("div").style, t = {
                    "float": void 0 != e.cssFloat ? "cssFloat" : void 0 != e.styleFloat ? "styleFloat" : "float"
                };
                return function (e) {
                    return t[e] || (t[e] = e.toLowerCase().replace(/-./g, function (e) {
                            return e.charAt(1).toUpperCase();
                        }));
                };
            }(),
            loadFile: function () {
                function e(e, i) {
                    try {
                        for (var n, o = 0; n = t[o++];)if (n.doc === e && n.url == (i.src || i.href))return n;
                    } catch (r) {
                        return null;
                    }
                }

                var t = [];
                return function (i, n, o) {
                    n.src && (n.src += "?v=" + UE.version), n.href && (n.href += "?v=" + UE.version);
                    var r = e(i, n);
                    if (r)return void(r.ready ? o && o() : r.funs.push(o));
                    if (t.push({
                            doc: i,
                            url: n.src || n.href,
                            funs: [o]
                        }), !i.body) {
                        var s = [];
                        for (var a in n)"tag" != a && s.push(a + '="' + n[a] + '"');
                        return void i.write("<" + n.tag + " " + s.join(" ") + " ></" + n.tag + ">");
                    }
                    if (!n.id || !i.getElementById(n.id)) {
                        var l = i.createElement(n.tag);
                        delete n.tag;
                        for (var a in n)l.setAttribute(a, n[a]);
                        l.onload = l.onreadystatechange = function () {
                            if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                                if (r = e(i, n), r.funs.length > 0) {
                                    r.ready = 1;
                                    for (var t; t = r.funs.pop();)t();
                                }
                                l.onload = l.onreadystatechange = null;
                            }
                        }, l.onerror = function () {
                            throw Error("The load " + (n.href || n.src) + " fails,check the url settings of file ueditor.config.js ");
                        }, i.getElementsByTagName("head")[0].appendChild(l);
                    }
                };
            }(),
            isEmptyObject: function (e) {
                if (null == e)return !0;
                if (this.isArray(e) || this.isString(e))return 0 === e.length;
                for (var t in e)if (e.hasOwnProperty(t))return !1;
                return !0;
            },
            fixColor: function (e, t) {
                if (/color/i.test(e) && /rgba?/.test(t)) {
                    var i = t.split(",");
                    if (i.length > 3)return "";
                    t = "#";
                    for (var n, o = 0; n = i[o++];)n = parseInt(n.replace(/[^\d]/gi, ""), 10).toString(16), t += 1 == n.length ? "0" + n : n;
                    t = t.toUpperCase();
                }
                return t;
            },
            optCss: function (e) {
                function t(e, t) {
                    if (!e)return "";
                    var i = e.top, n = e.bottom, o = e.left, r = e.right, s = "";
                    if (i && o && n && r)s += ";" + t + ":" + (i == n && n == o && o == r ? i : i == n && o == r ? i + " " + o : o == r ? i + " " + o + " " + n : i + " " + r + " " + n + " " + o) + ";"; else for (var a in e)s += ";" + t + "-" + a + ":" + e[a] + ";";
                    return s;
                }

                var i, n;
                return e = e.replace(/(padding|margin|border)\-([^:]+):([^;]+);?/gi, function (e, t, o, r) {
                    if (1 == r.split(" ").length)switch (t) {
                        case"padding":
                            return !i && (i = {}), i[o] = r, "";

                        case"margin":
                            return !n && (n = {}), n[o] = r, "";

                        case"border":
                            return "initial" == r ? "" : e;
                    }
                    return e;
                }), e += t(i, "padding") + t(n, "margin"), e.replace(/^[ \n\r\t;]*|[ \n\r\t]*$/, "").replace(/;([ \n\r\t]+)|\1;/g, ";").replace(/(&((l|g)t|quot|#39))?;{2,}/g, function (e, t) {
                    return t ? t + ";;" : ";";
                });
            },
            clone: function (e, t) {
                var i;
                t = t || {};
                for (var n in e)e.hasOwnProperty(n) && (i = e[n], "object" == typeof i ? (t[n] = utils.isArray(i) ? [] : {},
                    utils.clone(e[n], t[n])) : t[n] = i);
                return t;
            },
            transUnitToPx: function (e) {
                if (!/(pt|cm)/.test(e))return e;
                var t;
                switch (e.replace(/([\d.]+)(\w+)/, function (i, n, o) {
                    e = n, t = o;
                }), t) {
                    case"cm":
                        e = 25 * parseFloat(e);
                        break;

                    case"pt":
                        e = Math.round(96 * parseFloat(e) / 72);
                }
                return e + (e ? "px" : "");
            },
            domReady: function () {
                function e(e) {
                    e.isReady = !0;
                    for (var i; i = t.pop(); i());
                }

                var t = [];
                return function (i, n) {
                    n = n || window;
                    var o = n.document;
                    i && t.push(i), "complete" === o.readyState ? e(o) : (o.isReady && e(o), browser.ie && 11 != browser.version ? (!function () {
                        if (!o.isReady) {
                            try {
                                o.documentElement.doScroll("left");
                            } catch (t) {
                                return void setTimeout(arguments.callee, 0);
                            }
                            e(o);
                        }
                    }(), n.attachEvent("onload", function () {
                        e(o);
                    })) : (o.addEventListener("DOMContentLoaded", function () {
                        o.removeEventListener("DOMContentLoaded", arguments.callee, !1), e(o);
                    }, !1), n.addEventListener("load", function () {
                        e(o);
                    }, !1)));
                };
            }(),
            cssRule: browser.ie && 11 != browser.version ? function (e, t, i) {
                var n, o;
                i = i || document, n = i.indexList ? i.indexList : i.indexList = {};
                var r;
                if (n[e])r = i.styleSheets[n[e]]; else {
                    if (void 0 === t)return "";
                    r = i.createStyleSheet("", o = i.styleSheets.length), n[e] = o;
                }
                return void 0 === t ? r.cssText : void(r.cssText = t || "");
            } : function (e, t, i) {
                i = i || document;
                var n, o = i.getElementsByTagName("head")[0];
                if (!(n = i.getElementById(e))) {
                    if (void 0 === t)return "";
                    n = i.createElement("style"), n.id = e, o.appendChild(n);
                }
                return void 0 === t ? n.innerHTML : void("" !== t ? n.innerHTML = t : o.removeChild(n));
            },
            sort: function (e, t) {
                t = t || function (e, t) {
                        return e.localeCompare(t);
                    };
                for (var i = 0, n = e.length; n > i; i++)for (var o = i, r = e.length; r > o; o++)if (t(e[i], e[o]) > 0) {
                    var s = e[i];
                    e[i] = e[o], e[o] = s;
                }
                return e;
            }
        };
        utils.each(["String", "Function", "Array", "Number", "RegExp", "Object"], function (e) {
            UE.utils["is" + e] = function (t) {
                return Object.prototype.toString.apply(t) == "[object " + e + "]";
            };
        });
        var EventBase = UE.EventBase = function () {
        };
        EventBase.prototype = {
            addListener: function (e, t) {
                e = utils.trim(e).split(" ");
                for (var i, n = 0; i = e[n++];)getListener(this, i, !0).push(t);
            },
            removeListener: function (e, t) {
                e = utils.trim(e).split(" ");
                for (var i, n = 0; i = e[n++];)utils.removeItem(getListener(this, i) || [], t);
            },
            fireEvent: function () {
                var e = arguments[0];
                e = utils.trim(e).split(" ");
                for (var t, i = 0; t = e[i++];) {
                    var n, o, r, s = getListener(this, t);
                    if (s)for (r = s.length; r--;)if (s[r]) {
                        if (o = s[r].apply(this, arguments), o === !0)return o;
                        void 0 !== o && (n = o);
                    }
                    (o = this["on" + t.toLowerCase()]) && (n = o.apply(this, arguments));
                }
                return n;
            }
        };
        var dtd = dom.dtd = function () {
            function e(e) {
                for (var t in e)e[t.toUpperCase()] = e[t];
                return e;
            }

            var t = utils.extend2, i = e({
                isindex: 1,
                fieldset: 1
            }), n = e({
                input: 1,
                button: 1,
                select: 1,
                textarea: 1,
                label: 1
            }), o = t(e({
                a: 1
            }), n), r = t({
                iframe: 1
            }, o), s = e({
                hr: 1,
                ul: 1,
                menu: 1,
                div: 1,
                blockquote: 1,
                noscript: 1,
                table: 1,
                center: 1,
                address: 1,
                dir: 1,
                pre: 1,
                h5: 1,
                dl: 1,
                h4: 1,
                noframes: 1,
                h6: 1,
                ol: 1,
                h1: 1,
                h3: 1,
                h2: 1
            }), a = e({
                ins: 1,
                del: 1,
                script: 1,
                style: 1
            }), l = t(e({
                b: 1,
                acronym: 1,
                bdo: 1,
                "var": 1,
                "#": 1,
                abbr: 1,
                code: 1,
                br: 1,
                i: 1,
                cite: 1,
                kbd: 1,
                u: 1,
                strike: 1,
                s: 1,
                tt: 1,
                strong: 1,
                q: 1,
                samp: 1,
                em: 1,
                dfn: 1,
                span: 1
            }), a), d = t(e({
                sub: 1,
                img: 1,
                embed: 1,
                object: 1,
                sup: 1,
                basefont: 1,
                map: 1,
                applet: 1,
                font: 1,
                big: 1,
                small: 1
            }), l), c = t(e({
                p: 1
            }), d), u = t(e({
                iframe: 1
            }), d, n), m = e({
                img: 1,
                embed: 1,
                noscript: 1,
                br: 1,
                kbd: 1,
                center: 1,
                button: 1,
                basefont: 1,
                h5: 1,
                h4: 1,
                samp: 1,
                h6: 1,
                ol: 1,
                h1: 1,
                h3: 1,
                h2: 1,
                form: 1,
                font: 1,
                "#": 1,
                select: 1,
                menu: 1,
                ins: 1,
                abbr: 1,
                label: 1,
                code: 1,
                table: 1,
                script: 1,
                cite: 1,
                input: 1,
                iframe: 1,
                strong: 1,
                textarea: 1,
                noframes: 1,
                big: 1,
                small: 1,
                span: 1,
                hr: 1,
                sub: 1,
                bdo: 1,
                "var": 1,
                div: 1,
                object: 1,
                sup: 1,
                strike: 1,
                dir: 1,
                map: 1,
                dl: 1,
                applet: 1,
                del: 1,
                isindex: 1,
                fieldset: 1,
                ul: 1,
                b: 1,
                acronym: 1,
                a: 1,
                blockquote: 1,
                i: 1,
                u: 1,
                s: 1,
                tt: 1,
                address: 1,
                q: 1,
                pre: 1,
                p: 1,
                em: 1,
                dfn: 1
            }), f = t(e({
                a: 0
            }), u), h = e({
                tr: 1
            }), p = e({
                "#": 1
            }), g = t(e({
                param: 1
            }), m), v = t(e({
                form: 1
            }), i, r, s, c), b = e({
                li: 1,
                ol: 1,
                ul: 1
            }), y = e({
                style: 1,
                script: 1
            }), C = e({
                base: 1,
                link: 1,
                meta: 1,
                title: 1
            }), N = t(C, y), x = e({
                head: 1,
                body: 1
            }), w = e({
                html: 1
            }), U = e({
                address: 1,
                blockquote: 1,
                center: 1,
                dir: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                hr: 1,
                isindex: 1,
                menu: 1,
                noframes: 1,
                ol: 1,
                p: 1,
                pre: 1,
                table: 1,
                ul: 1
            }), E = e({
                area: 1,
                base: 1,
                basefont: 1,
                br: 1,
                col: 1,
                command: 1,
                dialog: 1,
                embed: 1,
                hr: 1,
                img: 1,
                input: 1,
                isindex: 1,
                keygen: 1,
                link: 1,
                meta: 1,
                param: 1,
                source: 1,
                track: 1,
                wbr: 1
            });
            return e({
                $nonBodyContent: t(w, x, C),
                $block: U,
                $inline: f,
                $inlineWithA: t(e({
                    a: 1
                }), f),
                $body: t(e({
                    script: 1,
                    style: 1
                }), U),
                $cdata: e({
                    script: 1,
                    style: 1
                }),
                $empty: E,
                $nonChild: e({
                    iframe: 1,
                    textarea: 1
                }),
                $listItem: e({
                    dd: 1,
                    dt: 1,
                    li: 1
                }),
                $list: e({
                    ul: 1,
                    ol: 1,
                    dl: 1
                }),
                $isNotEmpty: e({
                    table: 1,
                    ul: 1,
                    ol: 1,
                    dl: 1,
                    iframe: 1,
                    area: 1,
                    base: 1,
                    col: 1,
                    hr: 1,
                    img: 1,
                    embed: 1,
                    input: 1,
                    link: 1,
                    meta: 1,
                    param: 1,
                    h1: 1,
                    h2: 1,
                    h3: 1,
                    h4: 1,
                    h5: 1,
                    h6: 1
                }),
                $removeEmpty: e({
                    a: 1,
                    abbr: 1,
                    acronym: 1,
                    address: 1,
                    b: 1,
                    bdo: 1,
                    big: 1,
                    cite: 1,
                    code: 1,
                    del: 1,
                    dfn: 1,
                    em: 1,
                    font: 1,
                    i: 1,
                    ins: 1,
                    label: 1,
                    kbd: 1,
                    q: 1,
                    s: 1,
                    samp: 1,
                    small: 1,
                    span: 1,
                    strike: 1,
                    strong: 1,
                    sub: 1,
                    sup: 1,
                    tt: 1,
                    u: 1,
                    "var": 1
                }),
                $removeEmptyBlock: e({
                    p: 1,
                    div: 1
                }),
                $tableContent: e({
                    caption: 1,
                    col: 1,
                    colgroup: 1,
                    tbody: 1,
                    td: 1,
                    tfoot: 1,
                    th: 1,
                    thead: 1,
                    tr: 1,
                    table: 1
                }),
                $notTransContent: e({
                    pre: 1,
                    script: 1,
                    style: 1,
                    textarea: 1
                }),
                html: x,
                head: N,
                style: p,
                script: p,
                body: v,
                base: {},
                link: {},
                meta: {},
                title: p,
                col: {},
                tr: e({
                    td: 1,
                    th: 1
                }),
                img: {},
                embed: {},
                colgroup: e({
                    thead: 1,
                    col: 1,
                    tbody: 1,
                    tr: 1,
                    tfoot: 1
                }),
                noscript: v,
                td: v,
                br: {},
                th: v,
                center: v,
                kbd: f,
                button: t(c, s),
                basefont: {},
                h5: f,
                h4: f,
                samp: f,
                h6: f,
                ol: b,
                h1: f,
                h3: f,
                option: p,
                h2: f,
                form: t(i, r, s, c),
                select: e({
                    optgroup: 1,
                    option: 1
                }),
                font: f,
                ins: f,
                menu: b,
                abbr: f,
                label: f,
                table: e({
                    thead: 1,
                    col: 1,
                    tbody: 1,
                    tr: 1,
                    colgroup: 1,
                    caption: 1,
                    tfoot: 1
                }),
                code: f,
                tfoot: h,
                cite: f,
                li: v,
                input: {},
                iframe: v,
                strong: f,
                textarea: p,
                noframes: v,
                big: f,
                small: f,
                span: e({
                    "#": 1,
                    br: 1,
                    b: 1,
                    strong: 1,
                    u: 1,
                    i: 1,
                    em: 1,
                    sub: 1,
                    sup: 1,
                    strike: 1,
                    span: 1
                }),
                hr: f,
                dt: f,
                sub: f,
                optgroup: e({
                    option: 1
                }),
                param: {},
                bdo: f,
                "var": f,
                div: v,
                object: g,
                sup: f,
                dd: v,
                strike: f,
                area: {},
                dir: b,
                map: t(e({
                    area: 1,
                    form: 1,
                    p: 1
                }), i, a, s),
                applet: g,
                dl: e({
                    dt: 1,
                    dd: 1
                }),
                del: f,
                isindex: {},
                fieldset: t(e({
                    legend: 1
                }), m),
                thead: h,
                ul: b,
                acronym: f,
                b: f,
                a: t(e({
                    a: 1
                }), u),
                blockquote: t(e({
                    td: 1,
                    tr: 1,
                    tbody: 1,
                    li: 1
                }), v),
                caption: f,
                i: f,
                u: f,
                tbody: h,
                s: f,
                address: t(r, c),
                tt: f,
                legend: f,
                q: f,
                pre: t(l, o),
                p: t(e({
                    a: 1
                }), f),
                em: f,
                dfn: f
            });
        }(), attrFix = ie && browser.version < 9 ? {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder"
        } : {
            tabindex: "tabIndex",
            readonly: "readOnly"
        }, styleBlock = utils.listToMap(["-webkit-box", "-moz-box", "block", "list-item", "table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption"]), domUtils = dom.domUtils = {
            NODE_ELEMENT: 1,
            NODE_DOCUMENT: 9,
            NODE_TEXT: 3,
            NODE_COMMENT: 8,
            NODE_DOCUMENT_FRAGMENT: 11,
            POSITION_IDENTICAL: 0,
            POSITION_DISCONNECTED: 1,
            POSITION_FOLLOWING: 2,
            POSITION_PRECEDING: 4,
            POSITION_IS_CONTAINED: 8,
            POSITION_CONTAINS: 16,
            fillChar: ie && "6" == browser.version ? "﻿" : "​",
            keys: {
                8: 1,
                46: 1,
                16: 1,
                17: 1,
                18: 1,
                37: 1,
                38: 1,
                39: 1,
                40: 1,
                13: 1
            },
            getPosition: function (e, t) {
                if (e === t)return 0;
                var i, n = [e], o = [t];
                for (i = e; i = i.parentNode;) {
                    if (i === t)return 10;
                    n.push(i);
                }
                for (i = t; i = i.parentNode;) {
                    if (i === e)return 20;
                    o.push(i);
                }
                if (n.reverse(), o.reverse(), n[0] !== o[0])return 1;
                for (var r = -1; r++, n[r] === o[r];);
                for (e = n[r], t = o[r]; e = e.nextSibling;)if (e === t)return 4;
                return 2;
            },
            getNodeIndex: function (e, t) {
                for (var i = e, n = 0; i = i.previousSibling;)t && 3 == i.nodeType ? i.nodeType != i.nextSibling.nodeType && n++ : n++;
                return n;
            },
            inDoc: function (e, t) {
                return 10 == domUtils.getPosition(e, t);
            },
            findParent: function (e, t, i) {
                if (e && !domUtils.isBody(e))for (e = i ? e : e.parentNode; e;) {
                    if (!t || t(e) || domUtils.isBody(e))return t && !t(e) && domUtils.isBody(e) ? null : e;
                    e = e.parentNode;
                }
                return null;
            },
            findParentByTagName: function (e, t, i, n) {
                return t = utils.listToMap(utils.isArray(t) ? t : [t]), domUtils.findParent(e, function (e) {
                    return t[e.tagName] && !(n && n(e));
                }, i);
            },
            findParents: function (e, t, i, n) {
                for (var o = t && (i && i(e) || !i) ? [e] : []; e = domUtils.findParent(e, i);)o.push(e);
                return n ? o : o.reverse();
            },
            insertAfter: function (e, t) {
                return e.parentNode.insertBefore(t, e.nextSibling);
            },
            remove: function (e, t) {
                var i, n = e.parentNode;
                if (n) {
                    if (t && e.hasChildNodes())for (; i = e.firstChild;)n.insertBefore(i, e);
                    n.removeChild(e);
                }
                return e;
            },
            getNextDomNode: function (e, t, i, n) {
                return getDomNode(e, "firstChild", "nextSibling", t, i, n);
            },
            isBookmarkNode: function (e) {
                return 1 == e.nodeType && e.id && /^_baidu_bookmark_/i.test(e.id);
            },
            getWindow: function (e) {
                var t = e.ownerDocument || e;
                return t.defaultView || t.parentWindow;
            },
            getCommonAncestor: function (e, t) {
                if (e === t)return e;
                for (var i = [e], n = [t], o = e, r = -1; o = o.parentNode;) {
                    if (o === t)return o;
                    i.push(o);
                }
                for (o = t; o = o.parentNode;) {
                    if (o === e)return o;
                    n.push(o);
                }
                for (i.reverse(), n.reverse(); r++, i[r] === n[r];);
                return 0 == r ? null : i[r - 1];
            },
            clearEmptySibling: function (e, t, i) {
                function n(e, t) {
                    for (var i; e && !domUtils.isBookmarkNode(e) && (domUtils.isEmptyInlineElement(e) || !new RegExp("[^	\n\r" + domUtils.fillChar + "]").test(e.nodeValue));)i = e[t],
                        domUtils.remove(e), e = i;
                }

                !t && n(e.nextSibling, "nextSibling"), !i && n(e.previousSibling, "previousSibling");
            },
            split: function (e, t) {
                var i = e.ownerDocument;
                if (browser.ie && t == e.nodeValue.length) {
                    var n = i.createTextNode("");
                    return domUtils.insertAfter(e, n);
                }
                var o = e.splitText(t);
                if (browser.ie8) {
                    var r = i.createTextNode("");
                    domUtils.insertAfter(o, r), domUtils.remove(r);
                }
                return o;
            },
            isWhitespace: function (e) {
                return !new RegExp("[^ 	\n\r" + domUtils.fillChar + "]").test(e.nodeValue);
            },
            getXY: function (e) {
                for (var t = 0, i = 0; e.offsetParent;)i += e.offsetTop, t += e.offsetLeft, e = e.offsetParent;
                return {
                    x: t,
                    y: i
                };
            },
            on: function (e, t, i) {
                var n = utils.isArray(t) ? t : [t], o = n.length;
                if (o)for (; o--;)if (t = n[o], e.addEventListener)e.addEventListener(t, i, !1); else {
                    i._d || (i._d = {
                        els: []
                    });
                    var r = t + i.toString(), s = utils.indexOf(i._d.els, e);
                    i._d[r] && -1 != s || (-1 == s && i._d.els.push(e), i._d[r] || (i._d[r] = function (e) {
                        return i.call(e.srcElement, e || window.event);
                    }), e.attachEvent("on" + t, i._d[r]));
                }
                e = null;
            },
            un: function (e, t, i) {
                var n = utils.isArray(t) ? t : [t], o = n.length;
                if (o)for (; o--;)if (t = n[o], e.removeEventListener)e.removeEventListener(t, i, !1); else {
                    var r = t + i.toString();
                    try {
                        e.detachEvent("on" + t, i._d ? i._d[r] : i);
                    } catch (s) {
                    }
                    if (i._d && i._d[r]) {
                        var a = utils.indexOf(i._d.els, e);
                        -1 != a && i._d.els.splice(a, 1), 0 == i._d.els.length && delete i._d[r];
                    }
                }
            },
            isSameElement: function (e, t) {
                if (e.tagName != t.tagName)return !1;
                var i = e.attributes, n = t.attributes;
                if (!ie && i.length != n.length)return !1;
                for (var o, r, s = 0, a = 0, l = 0; o = i[l++];) {
                    if ("style" == o.nodeName) {
                        if (o.specified && s++, domUtils.isSameStyle(e, t))continue;
                        return !1;
                    }
                    if (ie) {
                        if (!o.specified)continue;
                        s++, r = n.getNamedItem(o.nodeName);
                    } else r = t.attributes[o.nodeName];
                    if (!r.specified || o.nodeValue != r.nodeValue)return !1;
                }
                if (ie) {
                    for (l = 0; r = n[l++];)r.specified && a++;
                    if (s != a)return !1;
                }
                return !0;
            },
            isSameStyle: function (e, t) {
                var i = e.style.cssText.replace(/( ?; ?)/g, ";").replace(/( ?: ?)/g, ":"), n = t.style.cssText.replace(/( ?; ?)/g, ";").replace(/( ?: ?)/g, ":");
                if (browser.opera) {
                    if (i = e.style, n = t.style, i.length != n.length)return !1;
                    for (var o in i)if (!/^(\d+|csstext)$/i.test(o) && i[o] != n[o])return !1;
                    return !0;
                }
                if (!i || !n)return i == n;
                if (i = i.split(";"), n = n.split(";"), i.length != n.length)return !1;
                for (var r, s = 0; r = i[s++];)if (-1 == utils.indexOf(n, r))return !1;
                return !0;
            },
            isBlockElm: function (e) {
                return 1 == e.nodeType && (dtd.$block[e.tagName] || styleBlock[domUtils.getComputedStyle(e, "display")]) && !dtd.$nonChild[e.tagName];
            },
            isBody: function (e) {
                return e && 1 == e.nodeType && "body" == e.tagName.toLowerCase();
            },
            breakParent: function (e, t) {
                var i, n, o, r = e, s = e;
                do {
                    for (r = r.parentNode, n ? (i = r.cloneNode(!1), i.appendChild(n), n = i, i = r.cloneNode(!1), i.appendChild(o),
                        o = i) : (n = r.cloneNode(!1), o = n.cloneNode(!1)); i = s.previousSibling;)n.insertBefore(i, n.firstChild);
                    for (; i = s.nextSibling;)o.appendChild(i);
                    s = r;
                } while (t !== r);
                return i = t.parentNode, i.insertBefore(n, t), i.insertBefore(o, t), i.insertBefore(e, o),
                    domUtils.remove(t), e;
            },
            isEmptyInlineElement: function (e) {
                if (1 != e.nodeType || !dtd.$removeEmpty[e.tagName])return 0;
                for (e = e.firstChild; e;) {
                    if (domUtils.isBookmarkNode(e))return 0;
                    if (1 == e.nodeType && !domUtils.isEmptyInlineElement(e) || 3 == e.nodeType && !domUtils.isWhitespace(e))return 0;
                    e = e.nextSibling;
                }
                return 1;
            },
            trimWhiteTextNode: function (e) {
                function t(t) {
                    for (var i; (i = e[t]) && 3 == i.nodeType && domUtils.isWhitespace(i);)e.removeChild(i);
                }

                t("firstChild"), t("lastChild");
            },
            mergeChild: function (e, t, i) {
                for (var n, o = domUtils.getElementsByTagName(e, e.tagName.toLowerCase()), r = 0; n = o[r++];)if (n.parentNode && !domUtils.isBookmarkNode(n))if ("span" != n.tagName.toLowerCase())domUtils.isSameElement(e, n) && domUtils.remove(n, !0); else {
                    if (e === n.parentNode && (domUtils.trimWhiteTextNode(e), 1 == e.childNodes.length)) {
                        e.style.cssText = n.style.cssText + ";" + e.style.cssText, domUtils.remove(n, !0);
                        continue;
                    }
                    if (n.style.cssText = e.style.cssText + ";" + n.style.cssText, i) {
                        var s = i.style;
                        if (s) {
                            s = s.split(";");
                            for (var a, l = 0; a = s[l++];)n.style[utils.cssStyleToDomStyle(a.split(":")[0])] = a.split(":")[1];
                        }
                    }
                    domUtils.isSameStyle(n, e) && domUtils.remove(n, !0);
                }
            },
            getElementsByTagName: function (e, t, i) {
                if (i && utils.isString(i)) {
                    var n = i;
                    i = function (e) {
                        return domUtils.hasClass(e, n);
                    };
                }
                t = utils.trim(t).replace(/[ ]{2,}/g, " ").split(" ");
                for (var o, r = [], s = 0; o = t[s++];)for (var a, l = e.getElementsByTagName(o), d = 0; a = l[d++];)(!i || i(a)) && r.push(a);
                return r;
            },
            mergeToParent: function (e) {
                for (var t = e.parentNode; t && dtd.$removeEmpty[t.tagName];) {
                    if (t.tagName == e.tagName || "A" == t.tagName) {
                        if (domUtils.trimWhiteTextNode(t), "SPAN" == t.tagName && !domUtils.isSameStyle(t, e) || "A" == t.tagName && "SPAN" == e.tagName) {
                            if (t.childNodes.length > 1 || t !== e.parentNode) {
                                e.style.cssText = t.style.cssText + ";" + e.style.cssText, t = t.parentNode;
                                continue;
                            }
                            t.style.cssText += ";" + e.style.cssText, "A" == t.tagName && (t.style.textDecoration = "underline");
                        }
                        if ("A" != t.tagName) {
                            t === e.parentNode && domUtils.remove(e, !0);
                            break;
                        }
                    }
                    t = t.parentNode;
                }
            },
            mergeSibling: function (e, t, i) {
                function n(e, t, i) {
                    var n;
                    if ((n = i[e]) && !domUtils.isBookmarkNode(n) && 1 == n.nodeType && domUtils.isSameElement(i, n)) {
                        for (; n.firstChild;)"firstChild" == t ? i.insertBefore(n.lastChild, i.firstChild) : i.appendChild(n.firstChild);
                        domUtils.remove(n);
                    }
                }

                !t && n("previousSibling", "firstChild", e), !i && n("nextSibling", "lastChild", e);
            },
            unSelectable: ie && browser.ie9below || browser.opera ? function (e) {
                e.onselectstart = function () {
                    return !1;
                }, e.onclick = e.onkeyup = e.onkeydown = function () {
                    return !1;
                }, e.unselectable = "on", e.setAttribute("unselectable", "on");
                for (var t, i = 0; t = e.all[i++];)switch (t.tagName.toLowerCase()) {
                    case"iframe":
                    case"textarea":
                    case"input":
                    case"select":
                        break;

                    default:
                        t.unselectable = "on", e.setAttribute("unselectable", "on");
                }
            } : function (e) {
                e.style.MozUserSelect = e.style.webkitUserSelect = e.style.KhtmlUserSelect = "none";
            },
            removeAttributes: function (e, t) {
                t = utils.isArray(t) ? t : utils.trim(t).replace(/[ ]{2,}/g, " ").split(" ");
                for (var i, n = 0; i = t[n++];) {
                    switch (i = attrFix[i] || i) {
                        case"className":
                            e[i] = "";
                            break;

                        case"style":
                            e.style.cssText = "", !browser.ie && !!e.getAttributeNode("style") && e.removeAttributeNode(e.getAttributeNode("style"));
                    }
                    e.removeAttribute(i);
                }
            },
            createElement: function (e, t, i) {
                return domUtils.setAttributes(e.createElement(t), i);
            },
            setAttributes: function (e, t) {
                for (var i in t)if (t.hasOwnProperty(i)) {
                    var n = t[i];
                    switch (i) {
                        case"class":
                            e.className = n;
                            break;

                        case"style":
                            e.style.cssText = e.style.cssText + ";" + n;
                            break;

                        case"innerHTML":
                            e[i] = n;
                            break;

                        case"value":
                            e.value = n;
                            break;

                        default:
                            e.setAttribute(attrFix[i] || i, n);
                    }
                }
                return e;
            },
            getComputedStyle: function (e, t) {
                var i = "width height top left";
                if (i.indexOf(t) > -1)return e["offset" + t.replace(/^\w/, function (e) {
                        return e.toUpperCase();
                    })] + "px";
                if (3 == e.nodeType && (e = e.parentNode), browser.ie && browser.version < 9 && "font-size" == t && !e.style.fontSize && !dtd.$empty[e.tagName] && !dtd.$nonChild[e.tagName]) {
                    var n = e.ownerDocument.createElement("span");
                    n.style.cssText = "padding:0;border:0;font-family:simsun;", n.innerHTML = ".", e.appendChild(n);
                    var o = n.offsetHeight;
                    return e.removeChild(n), n = null, o + "px";
                }
                try {
                    var r = domUtils.getStyle(e, t) || (window.getComputedStyle ? domUtils.getWindow(e).getComputedStyle(e, "").getPropertyValue(t) : (e.currentStyle || e.style)[utils.cssStyleToDomStyle(t)]);
                } catch (s) {
                    return "";
                }
                return utils.transUnitToPx(utils.fixColor(t, r));
            },
            removeClasses: function (e, t) {
                t = utils.isArray(t) ? t : utils.trim(t).replace(/[ ]{2,}/g, " ").split(" ");
                for (var i, n = 0, o = e.className; i = t[n++];)o = o.replace(new RegExp("\\b" + i + "\\b"), "");
                o = utils.trim(o).replace(/[ ]{2,}/g, " "), o ? e.className = o : domUtils.removeAttributes(e, ["class"]);
            },
            addClass: function (e, t) {
                if (e) {
                    t = utils.trim(t).replace(/[ ]{2,}/g, " ").split(" ");
                    for (var i, n = 0, o = e.className; i = t[n++];)new RegExp("\\b" + i + "\\b").test(o) || (e.className += " " + i);
                }
            },
            hasClass: function (e, t) {
                if (!e)return !1;
                if (utils.isRegExp(t))return t.test(e.className);
                t = utils.trim(t).replace(/[ ]{2,}/g, " ").split(" ");
                for (var i, n = 0, o = e.className; i = t[n++];)if (!new RegExp("\\b" + i + "\\b", "i").test(o))return !1;
                return n - 1 == t.length;
            },
            preventDefault: function (e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            },
            removeStyle: function (e, t) {
                browser.ie ? ("color" == t && (t = "(^|;)" + t), e.style.cssText = e.style.cssText.replace(new RegExp(t + "[^:]*:[^;]+;?", "ig"), "")) : e.style.removeProperty ? e.style.removeProperty(t) : e.style.removeAttribute(utils.cssStyleToDomStyle(t)),
                e.style.cssText || domUtils.removeAttributes(e, ["style"]);
            },
            getStyle: function (e, t) {
                var i = e.style[utils.cssStyleToDomStyle(t)];
                return utils.fixColor(t, i);
            },
            setStyle: function (e, t, i) {
                e.style[utils.cssStyleToDomStyle(t)] = i, utils.trim(e.style.cssText) || this.removeAttributes(e, "style");
            },
            setStyles: function (e, t) {
                for (var i in t)t.hasOwnProperty(i) && domUtils.setStyle(e, i, t[i]);
            },
            removeDirtyAttr: function (e) {
                for (var t, i = 0, n = e.getElementsByTagName("*"); t = n[i++];)t.removeAttribute("_moz_dirty");
                e.removeAttribute("_moz_dirty");
            },
            getChildCount: function (e, t) {
                var i = 0, n = e.firstChild;
                for (t = t || function () {
                        return 1;
                    }; n;)t(n) && i++, n = n.nextSibling;
                return i;
            },
            isEmptyNode: function (e) {
                return !e.firstChild || 0 == domUtils.getChildCount(e, function (e) {
                        return !domUtils.isBr(e) && !domUtils.isBookmarkNode(e) && !domUtils.isWhitespace(e);
                    });
            },
            clearSelectedArr: function (e) {
                for (var t; t = e.pop();)domUtils.removeAttributes(t, ["class"]);
            },
            scrollToView: function (e, t, i) {
                var n = function () {
                    var e = t.document, i = "CSS1Compat" == e.compatMode;
                    return {
                        width: (i ? e.documentElement.clientWidth : e.body.clientWidth) || 0,
                        height: (i ? e.documentElement.clientHeight : e.body.clientHeight) || 0
                    };
                }, o = function (e) {
                    if ("pageXOffset" in e)return {
                        x: e.pageXOffset || 0,
                        y: e.pageYOffset || 0
                    };
                    var t = e.document;
                    return {
                        x: t.documentElement.scrollLeft || t.body.scrollLeft || 0,
                        y: t.documentElement.scrollTop || t.body.scrollTop || 0
                    };
                }, r = n().height, s = -1 * r + i;
                s += e.offsetHeight || 0;
                var a = domUtils.getXY(e);
                s += a.y;
                var l = o(t).y;
                (s > l || l - r > s) && t.scrollTo(0, s + (0 > s ? -20 : 20));
            },
            isBr: function (e) {
                return 1 == e.nodeType && "BR" == e.tagName;
            },
            isFillChar: function (e, t) {
                return 3 == e.nodeType && !e.nodeValue.replace(new RegExp((t ? "^" : "") + domUtils.fillChar), "").length;
            },
            isStartInblock: function (e) {
                var t, i = e.cloneRange(), n = 0, o = i.startContainer;
                if (1 == o.nodeType && o.childNodes[i.startOffset]) {
                    o = o.childNodes[i.startOffset];
                    for (var r = o.previousSibling; r && domUtils.isFillChar(r);)o = r, r = r.previousSibling;
                }
                for (this.isFillChar(o, !0) && 1 == i.startOffset && (i.setStartBefore(o), o = i.startContainer); o && domUtils.isFillChar(o);)t = o,
                    o = o.previousSibling;
                for (t && (i.setStartBefore(t), o = i.startContainer), 1 == o.nodeType && domUtils.isEmptyNode(o) && 1 == i.startOffset && i.setStart(o, 0).collapse(!0); !i.startOffset;) {
                    if (o = i.startContainer, domUtils.isBlockElm(o) || domUtils.isBody(o)) {
                        n = 1;
                        break;
                    }
                    var s, r = i.startContainer.previousSibling;
                    if (r) {
                        for (; r && domUtils.isFillChar(r);)s = r, r = r.previousSibling;
                        i.setStartBefore(s ? s : i.startContainer);
                    } else i.setStartBefore(i.startContainer);
                }
                return n && !domUtils.isBody(i.startContainer) ? 1 : 0;
            },
            isEmptyBlock: function (e, t) {
                if (!e)return 0;
                if (1 != e.nodeType)return 0;
                if (t = t || new RegExp("[ 	\r\n" + domUtils.fillChar + "]", "g"), e[browser.ie ? "innerText" : "textContent"].replace(t, "").length > 0)return 0;
                for (var i in dtd.$isNotEmpty)if (e.getElementsByTagName(i).length)return 0;
                return 1;
            },
            setViewportOffset: function (e, t) {
                var i = 0 | parseInt(e.style.left), n = 0 | parseInt(e.style.top), o = e.getBoundingClientRect(), r = t.left - o.left, s = t.top - o.top;
                r && (e.style.left = i + r + "px"), s && (e.style.top = n + s + "px");
            },
            fillNode: function (e, t) {
                var i = browser.ie ? e.createTextNode(domUtils.fillChar) : e.createElement("br");
                t.innerHTML = "", t.appendChild(i);
            },
            moveChild: function (e, t, i) {
                for (; e.firstChild;)i && t.firstChild ? t.insertBefore(e.lastChild, t.firstChild) : t.appendChild(e.firstChild);
            },
            hasNoAttributes: function (e) {
                return browser.ie ? /^<\w+\s*?>/.test(e.outerHTML) : 0 == e.attributes.length;
            },
            isCustomeNode: function (e) {
                return 1 == e.nodeType && e.getAttribute("_ue_custom_node_");
            },
            isTagNode: function (e, t) {
                return 1 == e.nodeType && new RegExp("^" + e.tagName + "$", "i").test(t);
            },
            filterNodeList: function (e, t, i) {
                var n = [];
                if (!utils.isFunction(t)) {
                    var o = t;
                    t = function (e) {
                        return -1 != utils.indexOf(utils.isArray(o) ? o : o.split(" "), e.tagName.toLowerCase());
                    };
                }
                return utils.each(e, function (e) {
                    t(e) && n.push(e);
                }), 0 == n.length ? null : 1 != n.length && i ? n : n[0];
            },
            isInNodeEndBoundary: function (e, t) {
                var i = e.startContainer;
                if (3 == i.nodeType && e.startOffset != i.nodeValue.length)return 0;
                if (1 == i.nodeType && e.startOffset != i.childNodes.length)return 0;
                for (; i !== t;) {
                    if (i.nextSibling)return 0;
                    i = i.parentNode;
                }
                return 1;
            },
            isBoundaryNode: function (e, t) {
                for (var i; !domUtils.isBody(e);)if (i = e, e = e.parentNode, i !== e[t])return !1;
                return !0;
            },
            fillHtml: browser.ie11below ? "&nbsp;" : "<br/>"
        }, fillCharReg = new RegExp(domUtils.fillChar, "g");
        !function () {
            function e(e) {
                e.collapsed = e.startContainer && e.endContainer && e.startContainer === e.endContainer && e.startOffset == e.endOffset;
            }

            function t(e) {
                return !e.collapsed && 1 == e.startContainer.nodeType && e.startContainer === e.endContainer && e.endOffset - e.startOffset == 1;
            }

            function i(t, i, n, o) {
                return 1 == i.nodeType && (dtd.$empty[i.tagName] || dtd.$nonChild[i.tagName]) && (n = domUtils.getNodeIndex(i) + (t ? 0 : 1),
                    i = i.parentNode), t ? (o.startContainer = i, o.startOffset = n, o.endContainer || o.collapse(!0)) : (o.endContainer = i,
                    o.endOffset = n, o.startContainer || o.collapse(!1)), e(o), o;
            }

            function n(e, t) {
                var i, n, o = e.startContainer, r = e.endContainer, s = e.startOffset, a = e.endOffset, l = e.document, d = l.createDocumentFragment();
                if (1 == o.nodeType && (o = o.childNodes[s] || (i = o.appendChild(l.createTextNode("")))), 1 == r.nodeType && (r = r.childNodes[a] || (n = r.appendChild(l.createTextNode("")))),
                    o === r && 3 == o.nodeType)return d.appendChild(l.createTextNode(o.substringData(s, a - s))),
                t && (o.deleteData(s, a - s), e.collapse(!0)), d;
                for (var c, u, m = d, f = domUtils.findParents(o, !0), h = domUtils.findParents(r, !0), p = 0; f[p] == h[p];)p++;
                for (var g, v = p; g = f[v]; v++) {
                    for (c = g.nextSibling, g == o ? i || (3 == e.startContainer.nodeType ? (m.appendChild(l.createTextNode(o.nodeValue.slice(s))),
                    t && o.deleteData(s, o.nodeValue.length - s)) : m.appendChild(t ? o : o.cloneNode(!0))) : (u = g.cloneNode(!1),
                        m.appendChild(u)); c && c !== r && c !== h[v];)g = c.nextSibling, m.appendChild(t ? c : c.cloneNode(!0)),
                        c = g;
                    m = u;
                }
                m = d, f[p] || (m.appendChild(f[p - 1].cloneNode(!1)), m = m.firstChild);
                for (var b, v = p; b = h[v]; v++) {
                    if (c = b.previousSibling, b == r ? n || 3 != e.endContainer.nodeType || (m.appendChild(l.createTextNode(r.substringData(0, a))),
                        t && r.deleteData(0, a)) : (u = b.cloneNode(!1), m.appendChild(u)), v != p || !f[p])for (; c && c !== o;)b = c.previousSibling,
                        m.insertBefore(t ? c : c.cloneNode(!0), m.firstChild), c = b;
                    m = u;
                }
                return t && e.setStartBefore(h[p] ? f[p] ? h[p] : f[p - 1] : h[p - 1]).collapse(!0), i && domUtils.remove(i),
                n && domUtils.remove(n), d;
            }

            function o(e, t) {
                try {
                    if (s && domUtils.inDoc(s, e))if (s.nodeValue.replace(fillCharReg, "").length)s.nodeValue = s.nodeValue.replace(fillCharReg, ""); else {
                        var i = s.parentNode;
                        for (domUtils.remove(s); i && domUtils.isEmptyInlineElement(i) && (browser.safari ? !(domUtils.getPosition(i, t) & domUtils.POSITION_CONTAINS) : !i.contains(t));)s = i.parentNode,
                            domUtils.remove(i), i = s;
                    }
                } catch (n) {
                }
            }

            function r(e, t) {
                var i;
                for (e = e[t]; e && domUtils.isFillChar(e);)i = e[t], domUtils.remove(e), e = i;
            }

            var s, a = 0, l = domUtils.fillChar, d = dom.Range = function (e) {
                var t = this;
                t.startContainer = t.startOffset = t.endContainer = t.endOffset = null, t.document = e, t.collapsed = !0;
            };
            d.prototype = {
                cloneContents: function () {
                    return this.collapsed ? null : n(this, 0);
                },
                deleteContents: function () {
                    var e;
                    return this.collapsed || n(this, 1), browser.webkit && (e = this.startContainer, 3 != e.nodeType || e.nodeValue.length || (this.setStartBefore(e).collapse(!0),
                        domUtils.remove(e))), this;
                },
                extractContents: function () {
                    return this.collapsed ? null : n(this, 2);
                },
                setStart: function (e, t) {
                    return i(!0, e, t, this);
                },
                setEnd: function (e, t) {
                    return i(!1, e, t, this);
                },
                setStartAfter: function (e) {
                    return this.setStart(e.parentNode, domUtils.getNodeIndex(e) + 1);
                },
                setStartBefore: function (e) {
                    return this.setStart(e.parentNode, domUtils.getNodeIndex(e));
                },
                setEndAfter: function (e) {
                    return this.setEnd(e.parentNode, domUtils.getNodeIndex(e) + 1);
                },
                setEndBefore: function (e) {
                    return this.setEnd(e.parentNode, domUtils.getNodeIndex(e));
                },
                setStartAtFirst: function (e) {
                    return this.setStart(e, 0);
                },
                setStartAtLast: function (e) {
                    return this.setStart(e, 3 == e.nodeType ? e.nodeValue.length : e.childNodes.length);
                },
                setEndAtFirst: function (e) {
                    return this.setEnd(e, 0);
                },
                setEndAtLast: function (e) {
                    return this.setEnd(e, 3 == e.nodeType ? e.nodeValue.length : e.childNodes.length);
                },
                selectNode: function (e) {
                    return this.setStartBefore(e).setEndAfter(e);
                },
                selectNodeContents: function (e) {
                    return this.setStart(e, 0).setEndAtLast(e);
                },
                cloneRange: function () {
                    var e = this;
                    return new d(e.document).setStart(e.startContainer, e.startOffset).setEnd(e.endContainer, e.endOffset);
                },
                collapse: function (e) {
                    var t = this;
                    return e ? (t.endContainer = t.startContainer, t.endOffset = t.startOffset) : (t.startContainer = t.endContainer,
                        t.startOffset = t.endOffset), t.collapsed = !0, t;
                },
                shrinkBoundary: function (e) {
                    function t(e) {
                        return 1 == e.nodeType && !domUtils.isBookmarkNode(e) && !dtd.$empty[e.tagName] && !dtd.$nonChild[e.tagName];
                    }

                    for (var i, n = this, o = n.collapsed; 1 == n.startContainer.nodeType && (i = n.startContainer.childNodes[n.startOffset]) && t(i);)n.setStart(i, 0);
                    if (o)return n.collapse(!0);
                    if (!e)for (; 1 == n.endContainer.nodeType && n.endOffset > 0 && (i = n.endContainer.childNodes[n.endOffset - 1]) && t(i);)n.setEnd(i, i.childNodes.length);
                    return n;
                },
                getCommonAncestor: function (e, i) {
                    var n = this, o = n.startContainer, r = n.endContainer;
                    return o === r ? e && t(this) && (o = o.childNodes[n.startOffset], 1 == o.nodeType) ? o : i && 3 == o.nodeType ? o.parentNode : o : domUtils.getCommonAncestor(o, r);
                },
                trimBoundary: function (e) {
                    this.txtToElmBoundary();
                    var t = this.startContainer, i = this.startOffset, n = this.collapsed, o = this.endContainer;
                    if (3 == t.nodeType) {
                        if (0 == i)this.setStartBefore(t); else if (i >= t.nodeValue.length)this.setStartAfter(t); else {
                            var r = domUtils.split(t, i);
                            t === o ? this.setEnd(r, this.endOffset - i) : t.parentNode === o && (this.endOffset += 1), this.setStartBefore(r);
                        }
                        if (n)return this.collapse(!0);
                    }
                    return e || (i = this.endOffset, o = this.endContainer, 3 == o.nodeType && (0 == i ? this.setEndBefore(o) : (i < o.nodeValue.length && domUtils.split(o, i),
                        this.setEndAfter(o)))), this;
                },
                txtToElmBoundary: function (e) {
                    function t(e, t) {
                        var i = e[t + "Container"], n = e[t + "Offset"];
                        3 == i.nodeType && (n ? n >= i.nodeValue.length && e["set" + t.replace(/(\w)/, function (e) {
                            return e.toUpperCase();
                        }) + "After"](i) : e["set" + t.replace(/(\w)/, function (e) {
                            return e.toUpperCase();
                        }) + "Before"](i));
                    }

                    return (e || !this.collapsed) && (t(this, "start"), t(this, "end")), this;
                },
                insertNode: function (e) {
                    var t = e, i = 1;
                    11 == e.nodeType && (t = e.firstChild, i = e.childNodes.length), this.trimBoundary(!0);
                    var n = this.startContainer, o = this.startOffset, r = n.childNodes[o];
                    return r ? n.insertBefore(e, r) : n.appendChild(e), t.parentNode === this.endContainer && (this.endOffset = this.endOffset + i),
                        this.setStartBefore(t);
                },
                setCursor: function (e, t) {
                    return this.collapse(!e).select(t);
                },
                createBookmark: function (e, t) {
                    var i, n = this.document.createElement("span");
                    return n.style.cssText = "display:none;line-height:0px;", n.appendChild(this.document.createTextNode("‍")),
                        n.id = "_baidu_bookmark_start_" + (t ? "" : a++), this.collapsed || (i = n.cloneNode(!0), i.id = "_baidu_bookmark_end_" + (t ? "" : a++)),
                        this.insertNode(n), i && this.collapse().insertNode(i).setEndBefore(i), this.setStartAfter(n),
                    {
                        start: e ? n.id : n,
                        end: i ? e ? i.id : i : null,
                        id: e
                    };
                },
                moveToBookmark: function (e) {
                    var t = e.id ? this.document.getElementById(e.start) : e.start, i = e.end && e.id ? this.document.getElementById(e.end) : e.end;
                    return this.setStartBefore(t), domUtils.remove(t), i ? (this.setEndBefore(i), domUtils.remove(i)) : this.collapse(!0),
                        this;
                },
                enlarge: function (e, t) {
                    var i, n, o = domUtils.isBody, r = this.document.createTextNode("");
                    if (e) {
                        for (n = this.startContainer, 1 == n.nodeType ? n.childNodes[this.startOffset] ? i = n = n.childNodes[this.startOffset] : (n.appendChild(r),
                            i = n = r) : i = n; ;) {
                            if (domUtils.isBlockElm(n)) {
                                for (n = i; (i = n.previousSibling) && !domUtils.isBlockElm(i);)n = i;
                                this.setStartBefore(n);
                                break;
                            }
                            i = n, n = n.parentNode;
                        }
                        for (n = this.endContainer, 1 == n.nodeType ? ((i = n.childNodes[this.endOffset]) ? n.insertBefore(r, i) : n.appendChild(r),
                            i = n = r) : i = n; ;) {
                            if (domUtils.isBlockElm(n)) {
                                for (n = i; (i = n.nextSibling) && !domUtils.isBlockElm(i);)n = i;
                                this.setEndAfter(n);
                                break;
                            }
                            i = n, n = n.parentNode;
                        }
                        r.parentNode === this.endContainer && this.endOffset--, domUtils.remove(r);
                    }
                    if (!this.collapsed) {
                        for (; !(0 != this.startOffset || t && t(this.startContainer) || o(this.startContainer));)this.setStartBefore(this.startContainer);
                        for (; !(this.endOffset != (1 == this.endContainer.nodeType ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length) || t && t(this.endContainer) || o(this.endContainer));)this.setEndAfter(this.endContainer);
                    }
                    return this;
                },
                adjustmentBoundary: function () {
                    if (!this.collapsed) {
                        for (; !domUtils.isBody(this.startContainer) && this.startOffset == this.startContainer[3 == this.startContainer.nodeType ? "nodeValue" : "childNodes"].length && this.startContainer[3 == this.startContainer.nodeType ? "nodeValue" : "childNodes"].length;)this.setStartAfter(this.startContainer);
                        for (; !domUtils.isBody(this.endContainer) && !this.endOffset && this.endContainer[3 == this.endContainer.nodeType ? "nodeValue" : "childNodes"].length;)this.setEndBefore(this.endContainer);
                    }
                    return this;
                },
                applyInlineStyle: function (e, t, i) {
                    if (this.collapsed)return this;
                    this.trimBoundary().enlarge(!1, function (e) {
                        return 1 == e.nodeType && domUtils.isBlockElm(e);
                    }).adjustmentBoundary();
                    for (var n, o, r = this.createBookmark(), s = r.end, a = function (e) {
                        return 1 == e.nodeType ? "br" != e.tagName.toLowerCase() : !domUtils.isWhitespace(e);
                    }, l = domUtils.getNextDomNode(r.start, !1, a), d = this.cloneRange(); l && domUtils.getPosition(l, s) & domUtils.POSITION_PRECEDING;)if (3 == l.nodeType || dtd[e][l.tagName]) {
                        for (d.setStartBefore(l), n = l; n && (3 == n.nodeType || dtd[e][n.tagName]) && n !== s;)o = n, n = domUtils.getNextDomNode(n, 1 == n.nodeType, null, function (t) {
                            return dtd[e][t.tagName];
                        });
                        var c, u = d.setEndAfter(o).extractContents();
                        if (i && i.length > 0) {
                            var m, f;
                            f = m = i[0].cloneNode(!1);
                            for (var h, p = 1; h = i[p++];)m.appendChild(h.cloneNode(!1)), m = m.firstChild;
                            c = m;
                        } else c = d.document.createElement(e);
                        t && domUtils.setAttributes(c, t), c.appendChild(u), d.insertNode(i ? f : c);
                        var g;
                        if ("span" == e && t.style && /text\-decoration/.test(t.style) && (g = domUtils.findParentByTagName(c, "a", !0)) ? (domUtils.setAttributes(g, t),
                                domUtils.remove(c, !0), c = g) : (domUtils.mergeSibling(c), domUtils.clearEmptySibling(c)),
                                domUtils.mergeChild(c, t), l = domUtils.getNextDomNode(c, !1, a), domUtils.mergeToParent(c),
                            n === s)break;
                    } else l = domUtils.getNextDomNode(l, !0, a);
                    return this.moveToBookmark(r);
                },
                removeInlineStyle: function (e) {
                    if (this.collapsed)return this;
                    e = utils.isArray(e) ? e : [e], this.shrinkBoundary().adjustmentBoundary();
                    for (var t = this.startContainer, i = this.endContainer; ;) {
                        if (1 == t.nodeType) {
                            if (utils.indexOf(e, t.tagName.toLowerCase()) > -1)break;
                            if ("body" == t.tagName.toLowerCase()) {
                                t = null;
                                break;
                            }
                        }
                        t = t.parentNode;
                    }
                    for (; ;) {
                        if (1 == i.nodeType) {
                            if (utils.indexOf(e, i.tagName.toLowerCase()) > -1)break;
                            if ("body" == i.tagName.toLowerCase()) {
                                i = null;
                                break;
                            }
                        }
                        i = i.parentNode;
                    }
                    var n, o, r = this.createBookmark();
                    t && (o = this.cloneRange().setEndBefore(r.start).setStartBefore(t), n = o.extractContents(),
                        o.insertNode(n), domUtils.clearEmptySibling(t, !0), t.parentNode.insertBefore(r.start, t)),
                    i && (o = this.cloneRange().setStartAfter(r.end).setEndAfter(i), n = o.extractContents(),
                        o.insertNode(n), domUtils.clearEmptySibling(i, !1, !0), i.parentNode.insertBefore(r.end, i.nextSibling));
                    for (var s, a = domUtils.getNextDomNode(r.start, !1, function (e) {
                        return 1 == e.nodeType;
                    }); a && a !== r.end;)s = domUtils.getNextDomNode(a, !0, function (e) {
                        return 1 == e.nodeType;
                    }), utils.indexOf(e, a.tagName.toLowerCase()) > -1 && domUtils.remove(a, !0), a = s;
                    return this.moveToBookmark(r);
                },
                getClosedNode: function () {
                    var e;
                    if (!this.collapsed) {
                        var i = this.cloneRange().adjustmentBoundary().shrinkBoundary();
                        if (t(i)) {
                            var n = i.startContainer.childNodes[i.startOffset];
                            n && 1 == n.nodeType && (dtd.$empty[n.tagName] || dtd.$nonChild[n.tagName]) && (e = n);
                        }
                    }
                    return e;
                },
                select: browser.ie ? function (e, t) {
                    var i;
                    this.collapsed || this.shrinkBoundary();
                    var n = this.getClosedNode();
                    if (n && !t) {
                        try {
                            i = this.document.body.createControlRange(), i.addElement(n), i.select();
                        } catch (a) {
                        }
                        return this;
                    }
                    var d, c = this.createBookmark(), u = c.start;
                    if (i = this.document.body.createTextRange(), i.moveToElementText(u), i.moveStart("character", 1),
                            this.collapsed) {
                        if (!e && 3 != this.startContainer.nodeType) {
                            var m = this.document.createTextNode(l), f = this.document.createElement("span");
                            f.appendChild(this.document.createTextNode(l)), u.parentNode.insertBefore(f, u), u.parentNode.insertBefore(m, u),
                                o(this.document, m), s = m, r(f, "previousSibling"), r(u, "nextSibling"), i.moveStart("character", -1),
                                i.collapse(!0);
                        }
                    } else {
                        var h = this.document.body.createTextRange();
                        d = c.end, h.moveToElementText(d), i.setEndPoint("EndToEnd", h);
                    }
                    this.moveToBookmark(c), f && domUtils.remove(f);
                    try {
                        i.select();
                    } catch (a) {
                    }
                    return this;
                } : function (e) {
                    function t(e) {
                        function t(t, i, n) {
                            3 == t.nodeType && t.nodeValue.length < i && (e[n + "Offset"] = t.nodeValue.length);
                        }

                        t(e.startContainer, e.startOffset, "start"), t(e.endContainer, e.endOffset, "end");
                    }

                    var i, n = domUtils.getWindow(this.document), a = n.getSelection();
                    if (browser.gecko ? this.document.body.focus() : n.focus(), a) {
                        if (a.removeAllRanges(), this.collapsed && !e) {
                            var d = this.startContainer, c = d;
                            1 == d.nodeType && (c = d.childNodes[this.startOffset]), 3 == d.nodeType && this.startOffset || (c ? c.previousSibling && 3 == c.previousSibling.nodeType : d.lastChild && 3 == d.lastChild.nodeType) || (i = this.document.createTextNode(l),
                                this.insertNode(i), o(this.document, i), r(i, "previousSibling"), r(i, "nextSibling"),
                                s = i, this.setStart(i, browser.webkit ? 1 : 0).collapse(!0));
                        }
                        var u = this.document.createRange();
                        if (this.collapsed && browser.opera && 1 == this.startContainer.nodeType) {
                            var c = this.startContainer.childNodes[this.startOffset];
                            if (c) {
                                for (; c && domUtils.isBlockElm(c) && 1 == c.nodeType && c.childNodes[0];)c = c.childNodes[0];
                                c && this.setStartBefore(c).collapse(!0);
                            } else c = this.startContainer.lastChild, c && domUtils.isBr(c) && this.setStartBefore(c).collapse(!0);
                        }
                        t(this), u.setStart(this.startContainer, this.startOffset), u.setEnd(this.endContainer, this.endOffset),
                            a.addRange(u);
                    }
                    return this;
                },
                scrollToView: function (e, t) {
                    e = e ? window : domUtils.getWindow(this.document);
                    var i = this, n = i.document.createElement("span");
                    return n.innerHTML = "&nbsp;", i.cloneRange().insertNode(n), domUtils.scrollToView(n, e, t),
                        domUtils.remove(n), i;
                },
                inFillChar: function () {
                    var e = this.startContainer;
                    return this.collapsed && 3 == e.nodeType && e.nodeValue.replace(new RegExp("^" + domUtils.fillChar), "").length + 1 == e.nodeValue.length ? !0 : !1;
                },
                createAddress: function (e, t) {
                    function i(e) {
                        for (var i, n = e ? o.startContainer : o.endContainer, r = domUtils.findParents(n, !0, function (e) {
                            return !domUtils.isBody(e);
                        }), s = [], a = 0; i = r[a++];)s.push(domUtils.getNodeIndex(i, t));
                        var l = 0;
                        if (t)if (3 == n.nodeType) {
                            for (var d = n.previousSibling; d && 3 == d.nodeType;)l += d.nodeValue.replace(fillCharReg, "").length,
                                d = d.previousSibling;
                            l += e ? o.startOffset : o.endOffset;
                        } else if (n = n.childNodes[e ? o.startOffset : o.endOffset])l = domUtils.getNodeIndex(n, t); else {
                            n = e ? o.startContainer : o.endContainer;
                            for (var c = n.firstChild; c;)if (domUtils.isFillChar(c))c = c.nextSibling; else if (l++,
                                3 == c.nodeType)for (; c && 3 == c.nodeType;)c = c.nextSibling; else c = c.nextSibling;
                        } else l = e ? domUtils.isFillChar(n) ? 0 : o.startOffset : o.endOffset;
                        return 0 > l && (l = 0), s.push(l), s;
                    }

                    var n = {}, o = this;
                    return n.startAddress = i(!0), e || (n.endAddress = o.collapsed ? [].concat(n.startAddress) : i()),
                        n;
                },
                moveToAddress: function (e, t) {
                    function i(e, t) {
                        for (var i, o, r, s = n.document.body, a = 0, l = e.length; l > a; a++)if (r = e[a], i = s, s = s.childNodes[r],
                                !s) {
                            o = r;
                            break;
                        }
                        t ? s ? n.setStartBefore(s) : n.setStart(i, o) : s ? n.setEndBefore(s) : n.setEnd(i, o);
                    }

                    var n = this;
                    return i(e.startAddress, !0), !t && e.endAddress && i(e.endAddress), n;
                },
                equals: function (e) {
                    for (var t in this)if (this.hasOwnProperty(t) && this[t] !== e[t])return !1;
                    return !0;
                },
                traversal: function (e, t) {
                    if (this.collapsed)return this;
                    for (var i = this.createBookmark(), n = i.end, o = domUtils.getNextDomNode(i.start, !1, t); o && o !== n && domUtils.getPosition(o, n) & domUtils.POSITION_PRECEDING;) {
                        var r = domUtils.getNextDomNode(o, !1, t);
                        e(o), o = r;
                    }
                    return this.moveToBookmark(i);
                }
            };
        }(), function () {
            function e(e, t) {
                var i = domUtils.getNodeIndex;
                e = e.duplicate(), e.collapse(t);
                var n = e.parentElement();
                if (!n.hasChildNodes())return {
                    container: n,
                    offset: 0
                };
                for (var o, r, s = n.children, a = e.duplicate(), l = 0, d = s.length - 1, c = -1; d >= l;) {
                    c = Math.floor((l + d) / 2), o = s[c], a.moveToElementText(o);
                    var u = a.compareEndPoints("StartToStart", e);
                    if (u > 0)d = c - 1; else {
                        if (!(0 > u))return {
                            container: n,
                            offset: i(o)
                        };
                        l = c + 1;
                    }
                }
                if (-1 == c) {
                    if (a.moveToElementText(n), a.setEndPoint("StartToStart", e), r = a.text.replace(/(\r\n|\r)/g, "\n").length,
                            s = n.childNodes, !r)return o = s[s.length - 1], {
                        container: o,
                        offset: o.nodeValue.length
                    };
                    for (var m = s.length; r > 0;)r -= s[--m].nodeValue.length;
                    return {
                        container: s[m],
                        offset: -r
                    };
                }
                if (a.collapse(u > 0), a.setEndPoint(u > 0 ? "StartToStart" : "EndToStart", e), r = a.text.replace(/(\r\n|\r)/g, "\n").length,
                        !r)return dtd.$empty[o.tagName] || dtd.$nonChild[o.tagName] ? {
                    container: n,
                    offset: i(o) + (u > 0 ? 0 : 1)
                } : {
                    container: o,
                    offset: u > 0 ? 0 : o.childNodes.length
                };
                for (; r > 0;)try {
                    var f = o;
                    o = o[u > 0 ? "previousSibling" : "nextSibling"], r -= o.nodeValue.length;
                } catch (h) {
                    return {
                        container: n,
                        offset: i(f)
                    };
                }
                return {
                    container: o,
                    offset: u > 0 ? -r : o.nodeValue.length + r
                };
            }

            function t(t, i) {
                if (t.item)i.selectNode(t.item(0)); else {
                    var n = e(t, !0);
                    i.setStart(n.container, n.offset), 0 != t.compareEndPoints("StartToEnd", t) && (n = e(t, !1),
                        i.setEnd(n.container, n.offset));
                }
                return i;
            }

            function i(e) {
                var t;
                try {
                    t = e.getNative().createRange();
                } catch (i) {
                    return null;
                }
                var n = t.item ? t.item(0) : t.parentElement();
                return (n.ownerDocument || n) === e.document ? t : null;
            }

            var n = dom.Selection = function (e) {
                var t, n = this;
                n.document = e, browser.ie9below && (t = domUtils.getWindow(e).frameElement, domUtils.on(t, "beforedeactivate", function () {
                    n._bakIERange = n.getIERange();
                }), domUtils.on(t, "activate", function () {
                    try {
                        !i(n) && n._bakIERange && n._bakIERange.select();
                    } catch (e) {
                    }
                    n._bakIERange = null;
                })), t = e = null;
            };
            n.prototype = {
                rangeInBody: function (e, t) {
                    var i = browser.ie9below || t ? e.item ? e.item() : e.parentElement() : e.startContainer;
                    return i === this.document.body || domUtils.inDoc(i, this.document);
                },
                getNative: function () {
                    var e = this.document;
                    try {
                        return e ? browser.ie9below ? e.selection : domUtils.getWindow(e).getSelection() : null;
                    } catch (t) {
                        return null;
                    }
                },
                getIERange: function () {
                    var e = i(this);
                    return !e && this._bakIERange ? this._bakIERange : e;
                },
                cache: function () {
                    this.clear(), this._cachedRange = this.getRange(), this._cachedStartElement = this.getStart(),
                        this._cachedStartElementPath = this.getStartElementPath();
                },
                getStartElementPath: function () {
                    if (this._cachedStartElementPath)return this._cachedStartElementPath;
                    var e = this.getStart();
                    return e ? domUtils.findParents(e, !0, null, !0) : [];
                },
                clear: function () {
                    this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null;
                },
                isFocus: function () {
                    try {
                        if (browser.ie9below) {
                            var e = i(this);
                            return !(!e || !this.rangeInBody(e));
                        }
                        return !!this.getNative().rangeCount;
                    } catch (t) {
                        return !1;
                    }
                },
                getRange: function () {
                    function e(e) {
                        for (var t = i.document.body.firstChild, n = e.collapsed; t && t.firstChild;)e.setStart(t, 0),
                            t = t.firstChild;
                        e.startContainer || e.setStart(i.document.body, 0), n && e.collapse(!0);
                    }

                    var i = this;
                    if (null != i._cachedRange)return this._cachedRange;
                    var n = new baidu.editor.dom.Range(i.document);
                    if (browser.ie9below) {
                        var o = i.getIERange();
                        if (o)try {
                            t(o, n);
                        } catch (r) {
                            e(n);
                        } else e(n);
                    } else {
                        var s = i.getNative();
                        if (s && s.rangeCount) {
                            var a = s.getRangeAt(0), l = s.getRangeAt(s.rangeCount - 1);
                            n.setStart(a.startContainer, a.startOffset).setEnd(l.endContainer, l.endOffset), n.collapsed && domUtils.isBody(n.startContainer) && !n.startOffset && e(n);
                        } else {
                            if (this._bakRange && domUtils.inDoc(this._bakRange.startContainer, this.document))return this._bakRange;
                            e(n);
                        }
                    }
                    return this._bakRange = n;
                },
                getStart: function () {
                    if (this._cachedStartElement)return this._cachedStartElement;
                    var e, t, i, n, o = browser.ie9below ? this.getIERange() : this.getRange();
                    if (browser.ie9below) {
                        if (!o)return this.document.body.firstChild;
                        if (o.item)return o.item(0);
                        for (e = o.duplicate(), e.text.length > 0 && e.moveStart("character", 1), e.collapse(1), t = e.parentElement(),
                                 n = i = o.parentElement(); i = i.parentNode;)if (i == t) {
                            t = n;
                            break;
                        }
                    } else if (o.shrinkBoundary(), t = o.startContainer, 1 == t.nodeType && t.hasChildNodes() && (t = t.childNodes[Math.min(t.childNodes.length - 1, o.startOffset)]),
                        3 == t.nodeType)return t.parentNode;
                    return t;
                },
                getText: function () {
                    var e, t;
                    return this.isFocus() && (e = this.getNative()) ? (t = browser.ie9below ? e.createRange() : e.getRangeAt(0),
                        browser.ie9below ? t.text : t.toString()) : "";
                },
                clearRange: function () {
                    this.getNative()[browser.ie9below ? "empty" : "removeAllRanges"]();
                }
            };
        }(), function () {
            function e(e, t) {
                var i;
                if (t.textarea)if (utils.isString(t.textarea)) {
                    for (var n, o = 0, r = domUtils.getElementsByTagName(e, "textarea"); n = r[o++];)if (n.id == "ueditor_textarea_" + t.options.textarea) {
                        i = n;
                        break;
                    }
                } else i = t.textarea;
                i || (e.appendChild(i = domUtils.createElement(document, "textarea", {
                    name: t.options.textarea,
                    id: "ueditor_textarea_" + t.options.textarea,
                    style: "display:none"
                })), t.textarea = i), i.value = t.hasContents() ? t.options.allHtmlEnabled ? t.getAllHtml() : t.getContent(null, null, !0) : "";
            }

            function t(e) {
                for (var t in UE.plugins)UE.plugins[t].call(e);
                e.langIsReady = !0, e.fireEvent("langReady");
            }

            function i(e) {
                for (var t in e)return t;
            }

            var n, o = 0, r = UE.Editor = function (e) {
                var n = this;
                n.uid = o++, EventBase.call(n), n.commands = {}, n.options = utils.clone(e || {}), n.shortcutkeys = {},
                    n.inputRules = [], n.outputRules = [], utils.isEmptyObject(UE.I18N) ? t(n) : (n.options.lang = i(UE.I18N),
                    t(n)), UE.instants["ueditorInstant" + n.uid] = n;
            };
            r.prototype = {
                ready: function (e) {
                    var t = this;
                    e && (t.isReady ? e.apply(t) : t.addListener("ready", e));
                },
                setOpt: function (e, t) {
                    var i = {};
                    utils.isString(e) ? i[e] = t : i = e, utils.extend(this.options, i, !0);
                },
                destroy: function () {
                    var e = this;
                    e.fireEvent("destroy");
                    var t = e.container.parentNode, i = e.textarea;
                    i ? i.style.display = "" : (i = document.createElement("textarea"), t.parentNode.insertBefore(i, t)),
                        i.style.width = e.iframe.offsetWidth + "px", i.style.height = e.iframe.offsetHeight + "px",
                        i.value = e.getContent(), i.id = e.key, t.innerHTML = "", domUtils.remove(t);
                    var n = e.key;
                    for (var o in e)e.hasOwnProperty(o) && delete this[o];
                    UE.delEditor(n);
                },
                render: function (e) {
                    var t = this, i = t.options;
                    if (utils.isString(e) && (e = document.getElementById(e)), e) {
                        var n = "";
                        n = browser.edge ? "javascript:void(function(){" + (i.customDomain && document.domain != location.hostname ? 'document.domain="' + document.domain + '";' : "") + 'window.parent.UE.instants["ueditorInstant' + t.uid + '"]._docWrite(document);}())' : "javascript:void(function(){document.open();" + (i.customDomain && document.domain != location.hostname ? 'document.domain="' + document.domain + '";' : "") + 'document.write("' + t._getIframeHtml() + '");document.close();}())',
                            e.appendChild(domUtils.createElement(document, "iframe", {
                                id: "ueditor_" + t.uid,
                                allowtransparency: "true",
                                width: "100%",
                                height: "100%",
                                frameborder: "0",
                                src: n
                            })), setTimeout(function () {
                            /%$/.test(i.initialFrameWidth) && (i.minFrameWidth = i.initialFrameWidth = e.offsetWidth,
                                e.style.width = i.initialFrameWidth + "px"), /%$/.test(i.initialFrameHeight) && (i.minFrameHeight = i.initialFrameHeight = e.offsetHeight,
                                e.style.height = i.initialFrameHeight + "px");
                        });
                    }
                },
                _getIframeHtml: function () {
                    var e = this, t = e.options, i = (ie && browser.version < 9 ? "" : "<!DOCTYPE html>") + "<html xmlns='http://www.w3.org/1999/xhtml' ><head><style type='text/css'>body{font-family:sans-serif;font-size:16px;}</style>" + (t.iframeCssUrl ? "<link rel='stylesheet' type='text/css' href='" + utils.unhtml(t.iframeCssUrl) + "'/>" : "") + (t.initialStyle ? "<style>" + t.initialStyle + "</style>" : "") + "</head><body class='view' ></body><script type='text/javascript' " + (ie ? "defer='defer'" : "") + " id='_initialScript'>setTimeout(function(){window.parent.UE.instants['ueditorInstant" + e.uid + "']._setup(document);},0);var _tmpScript = document.getElementById('_initialScript');_tmpScript.parentNode.removeChild(_tmpScript);</script></html>";
                    return i;
                },
                _docWrite: function (e) {
                    var t = this, i = t.options;
                    e.open(), i.customDomain && document.domain != location.hostname && (e.domain = document.domain),
                        e.write(t._getIframeHtml()), e.close();
                },
                _setup: function (t) {
                    var i = this, n = i.options;
                    ie ? (t.body.disabled = !0, t.body.contentEditable = !0, t.body.disabled = !1) : t.body.contentEditable = !0,
                        t.body.spellcheck = !1, i.document = t, i.window = t.defaultView || t.parentWindow, i.iframe = i.window.frameElement,
                        i.body = t.body, i.selection = new dom.Selection(t);
                    var o;
                    browser.gecko && (o = this.selection.getNative()) && o.removeAllRanges(), this._initEvents();
                    for (var r = this.iframe.parentNode; !domUtils.isBody(r); r = r.parentNode)if ("FORM" == r.tagName) {
                        i.form = r, i.options.autoSyncData ? domUtils.on(i.window, "blur", function () {
                            e(r, i);
                        }) : domUtils.on(r, "submit", function () {
                            e(this, i);
                        });
                        break;
                    }
                    if (n.initialContent)if (n.autoClearinitialContent) {
                        var s = i.execCommand;
                        i.execCommand = function () {
                            return i.fireEvent("firstBeforeExecCommand"), s.apply(i, arguments);
                        }, this._setDefaultContent(n.initialContent);
                    } else this.setContent(n.initialContent, !1, !0);
                    domUtils.isEmptyNode(i.body) && (i.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>"),
                    n.focus && setTimeout(function () {
                        i.focus(i.options.focusInEnd), !i.options.autoClearinitialContent && i._selectionChange();
                    }, 0), i.container || (i.container = this.iframe.parentNode), n.fullscreen && i.ui && i.ui.setFullScreen(!0);
                    try {
                        i.document.execCommand("2D-position", !1, !1);
                    } catch (a) {
                    }
                    try {
                        i.document.execCommand("enableInlineTableEditing", !1, !1);
                    } catch (a) {
                    }
                    try {
                        i.document.execCommand("enableObjectResizing", !1, !1);
                    } catch (a) {
                    }
                    i._bindshortcutKeys(), i.isReady = 1, i.fireEvent("ready"), n.onready && n.onready.call(i),
                    browser.ie9below || domUtils.on(i.window, ["blur", "focus"], function (e) {
                        if ("blur" == e.type) {
                            i._bakRange = i.selection.getRange();
                            try {
                                i._bakNativeRange = i.selection.getNative().getRangeAt(0), i.selection.getNative().removeAllRanges();
                            } catch (e) {
                                i._bakNativeRange = null;
                            }
                        } else try {
                            i._bakRange && i._bakRange.select();
                        } catch (e) {
                        }
                    }), browser.gecko && browser.version <= 10902 && (i.body.contentEditable = !1, setTimeout(function () {
                        i.body.contentEditable = !0;
                    }, 100), setInterval(function () {
                        i.body.style.height = i.iframe.offsetHeight - 20 + "px";
                    }, 100)), !n.isShow && i.setHide(), n.readonly && i.setDisabled();
                },
                sync: function (t) {
                    var i = this, n = t ? document.getElementById(t) : domUtils.findParent(i.iframe.parentNode, function (e) {
                        return "FORM" == e.tagName;
                    }, !0);
                    n && e(n, i);
                },
                setHeight: function (e, t) {
                    e !== parseInt(this.iframe.parentNode.style.height) && $(this.iframe).parent().height(e),
                    !t && (this.options.minFrameHeight = this.options.initialFrameHeight = e), this.body.style.height = e,
                        this.fireEvent("heightChanged", e);
                },
                addshortcutkey: function (e, t) {
                    var i = {};
                    t ? i[e] = t : i = e, utils.extend(this.shortcutkeys, i);
                },
                _bindshortcutKeys: function () {
                    var e = this, t = this.shortcutkeys;
                    e.addListener("keydown", function (i, n) {
                        var o = n.keyCode || n.which;
                        for (var r in t)for (var s, a = t[r].split(","), l = 0; s = a[l++];) {
                            s = s.split(":");
                            var d = s[0], c = s[1];
                            (/^(ctrl)(\+shift)?\+(\d+)$/.test(d.toLowerCase()) || /^(\d+)$/.test(d)) && (("ctrl" == RegExp.$1 ? n.ctrlKey || n.metaKey : 0) && ("" != RegExp.$2 ? n[RegExp.$2.slice(1) + "Key"] : 1) && o == RegExp.$3 || o == RegExp.$1) && (-1 != e.queryCommandState(r, c) && e.execCommand(r, c),
                                domUtils.preventDefault(n));
                        }
                    });
                },
                getContent: function (e, t, i, n, o) {
                    var r = this;
                    if (e && utils.isFunction(e) && (t = e, e = ""), t ? !t() : !this.hasContents())return "";
                    r.fireEvent("beforegetcontent");
                    var s = UE.htmlparser(r.body.innerHTML, n);
                    return r.filterOutputRule(s), r.fireEvent("aftergetcontent", e), s.toHtml(o);
                },
                getAllHtml: function () {
                    var e = this, t = [];
                    if (e.fireEvent("getAllHtml", t), browser.ie && browser.version > 8) {
                        var i = "";
                        utils.each(e.document.styleSheets, function (e) {
                            i += e.href ? '<link rel="stylesheet" type="text/css" href="' + e.href + '" />' : "<style>" + e.cssText + "</style>";
                        }), utils.each(e.document.getElementsByTagName("script"), function (e) {
                            i += e.outerHTML;
                        });
                    }
                    return "<html><head>" + (e.options.charset ? '<meta http-equiv="Content-Type" content="text/html; charset=' + e.options.charset + '"/>' : "") + (i || e.document.getElementsByTagName("head")[0].innerHTML) + t.join("\n") + "</head><body " + (ie && browser.version < 9 ? 'class="view"' : "") + ">" + e.getContent(null, null, !0) + "</body></html>";
                },
                getPlainTxt: function () {
                    var e = new RegExp(domUtils.fillChar, "g"), t = this.body.innerHTML.replace(/[\n\r]/g, "");
                    return t = t.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, "\n").replace(/<br\/?>/gi, "\n").replace(/<[^>/]+>/g, "").replace(/(\n)?<\/([^>]+)>/g, function (e, t, i) {
                        return dtd.$block[i] ? "\n" : t ? t : "";
                    }), t.replace(e, "").replace(/\u00a0/g, " ").replace(/&nbsp;/g, " ");
                },
                getContentTxt: function () {
                    var e = new RegExp(domUtils.fillChar, "g");
                    return this.body[browser.ie ? "innerText" : "textContent"].replace(e, "").replace(/\u00a0/g, " ");
                },
                setContent: function (t, i, n) {
                    function o(e) {
                        return "DIV" == e.tagName && e.getAttribute("cdata_tag");
                    }

                    var r = this;
                    r.fireEvent("beforesetcontent", t);
                    var s = UE.htmlparser(t, !0);
                    if (r.filterInputRule(s), t = s.toHtml(), r.body.innerHTML = (i ? r.body.innerHTML : "") + t,
                        "p" == r.options.enterTag) {
                        var a, l = this.body.firstChild;
                        if (!l || 1 == l.nodeType && (dtd.$cdata[l.tagName] || o(l) || domUtils.isCustomeNode(l)) && l === this.body.lastChild)this.body.innerHTML = "<p>" + (browser.ie ? "&nbsp;" : "<br/>") + "</p>" + this.body.innerHTML; else for (var d = r.document.createElement("p"); l;) {
                            for (; l && (3 == l.nodeType || 1 == l.nodeType && dtd.p[l.tagName] && !dtd.$cdata[l.tagName]);)a = l.nextSibling,
                                d.appendChild(l), l = a;
                            if (d.firstChild) {
                                if (!l) {
                                    r.body.appendChild(d);
                                    break;
                                }
                                l.parentNode.insertBefore(d, l), d = r.document.createElement("p");
                            }
                            l = l.nextSibling;
                        }
                    }
                    r.fireEvent("aftersetcontent", t, [r.body]), r.fireEvent("contentchange"), !n && r._selectionChange(),
                        r._bakRange = r._bakIERange = r._bakNativeRange = null;
                    var c;
                    browser.gecko && (c = this.selection.getNative()) && c.removeAllRanges(), r.options.autoSyncData && r.form && e(r.form, r);
                },
                focus: function (e) {
                    try {
                        var t = this, i = t.selection.getRange();
                        e ? i.setStartAtLast(t.body.lastChild).setCursor(!1, !0) : i.select(!0), this.fireEvent("focus");
                    } catch (n) {
                    }
                },
                _initEvents: function () {
                    var e = this, t = e.document, i = e.window;
                    e._proxyDomEvent = utils.bind(e._proxyDomEvent, e), domUtils.on(t, ["click", "contextmenu", "mousedown", "keydown", "keyup", "keypress", "mouseup", "mouseover", "mouseout", "selectstart"], e._proxyDomEvent),
                        domUtils.on(i, ["focus", "blur"], e._proxyDomEvent), domUtils.on(t, ["mouseup", "keydown"], function (t) {
                        "keydown" == t.type && (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey) || 2 != t.button && e._selectionChange(250, t);
                    });
                },
                _proxyDomEvent: function (e) {
                    return this.fireEvent(e.type.replace(/^on/, ""), e);
                },
                _selectionChange: function (e, t) {
                    var i, o, r = this, s = !1;
                    if (browser.ie && browser.version < 9 && t && "mouseup" == t.type) {
                        var a = this.selection.getRange();
                        a.collapsed || (s = !0, i = t.clientX, o = t.clientY);
                    }
                    clearTimeout(n), n = setTimeout(function () {
                        if (r.selection && r.selection.getNative()) {
                            var e;
                            if (s && "None" == r.selection.getNative().type) {
                                e = r.document.body.createTextRange();
                                try {
                                    e.moveToPoint(i, o);
                                } catch (n) {
                                    e = null;
                                }
                            }
                            var a;
                            e && (a = r.selection.getIERange, r.selection.getIERange = function () {
                                return e;
                            }), r.selection.cache(), a && (r.selection.getIERange = a), r.selection._cachedRange && r.selection._cachedStartElement && (r.fireEvent("beforeselectionchange"),
                                r.fireEvent("selectionchange", !!t), r.fireEvent("afterselectionchange"), r.selection.clear());
                        }
                    }, e || 50);
                },
                _callCmdFn: function (e, t) {
                    var i, n, o = t[0].toLowerCase();
                    return i = this.commands[o] || UE.commands[o], n = i && i[e], i && n || "queryCommandState" != e ? n ? ("execCommand" == e && i.noCommandReprot !== !0 && this._cmdReport(t),
                        n.apply(this, t)) : void 0 : 0;
                },
                _cmdReport: function (e) {
                    var t = e[0];
                    "justify" == t || "imagefloat" == t ? this.fireEvent("funcPvUvReport", t + (e[1] || "")) : "rowspacing" == t ? this.fireEvent("funcPvUvReport", t + (e[2] || "")) : this.fireEvent("funcPvUvReport", t);
                },
                execCommand: function (e) {
                    arguments[0] = arguments[0].toLowerCase(), e = e.toLowerCase();
                    var t, i = this, n = i.commands[e] || UE.commands[e];
                    return n && n.execCommand ? (n.notNeedUndo || i.__hasEnterExecCommand ? (t = this._callCmdFn("execCommand", arguments),
                    !i._ignoreContentChange && i.fireEvent("contentchange")) : (i.__hasEnterExecCommand = !0,
                    -1 != i.queryCommandState.apply(i, arguments) && (i.fireEvent("beforeexeccommand", e),
                        t = this._callCmdFn("execCommand", arguments), !i._ignoreContentChange && i.fireEvent("contentchange"),
                        i.fireEvent("afterexeccommand", e)), i.__hasEnterExecCommand = !1), !i._ignoreContentChange && i._selectionChange(),
                        t) : null;
                },
                queryCommandState: function () {
                    return this._callCmdFn("queryCommandState", arguments);
                },
                queryCommandValue: function () {
                    return this._callCmdFn("queryCommandValue", arguments);
                },
                hasContents: function (e) {
                    if (e)for (var t, i = 0; t = e[i++];)if (this.document.getElementsByTagName(t).length > 0)return !0;
                    if (!domUtils.isEmptyBlock(this.body))return !0;
                    for (e = ["div"], i = 0; t = e[i++];)for (var n, o = domUtils.getElementsByTagName(this.document, t), r = 0; n = o[r++];)if (domUtils.isCustomeNode(n))return !0;
                    return !1;
                },
                reset: function () {
                    this.fireEvent("reset");
                },
                setEnabled: function () {
                    var e, t = this;
                    if ("false" == t.body.contentEditable) {
                        t.body.contentEditable = !0, e = t.selection.getRange();
                        try {
                            e.moveToBookmark(t.lastBk), delete t.lastBk;
                        } catch (i) {
                            e.setStartAtFirst(t.body).collapse(!0);
                        }
                        e.select(!0), t.bkqueryCommandState && (t.queryCommandState = t.bkqueryCommandState, delete t.bkqueryCommandState),
                            t.fireEvent("selectionchange");
                    }
                },
                enable: function () {
                    return this.setEnabled();
                },
                setDisabled: function (e) {
                    var t = this;
                    e = e ? utils.isArray(e) ? e : [e] : [], "true" == t.body.contentEditable && (t.lastBk || (t.lastBk = t.selection.getRange().createBookmark(!0)),
                        t.body.contentEditable = !1, t.bkqueryCommandState = t.queryCommandState, t.queryCommandState = function (i) {
                        return -1 != utils.indexOf(e, i) ? t.bkqueryCommandState.apply(t, arguments) : -1;
                    }, t.fireEvent("selectionchange"));
                },
                disable: function (e) {
                    return this.setDisabled(e);
                },
                _setDefaultContent: function () {
                    function e() {
                        var t = this;
                        t.document.getElementById("initContent") && (t.body.innerHTML = "<p>" + (ie ? "" : "<br/>") + "</p>",
                            t.removeListener("firstBeforeExecCommand focus", e), setTimeout(function () {
                            t.focus(), t._selectionChange();
                        }, 0));
                    }

                    return function (t) {
                        var i = this;
                        i.body.innerHTML = '<p id="initContent">' + t + "</p>", i.addListener("firstBeforeExecCommand focus", e);
                    };
                }(),
                setShow: function () {
                    var e = this, t = e.selection.getRange();
                    if ("none" == e.container.style.display) {
                        try {
                            t.moveToBookmark(e.lastBk), delete e.lastBk;
                        } catch (i) {
                            t.setStartAtFirst(e.body).collapse(!0);
                        }
                        setTimeout(function () {
                            t.select(!0);
                        }, 100), e.container.style.display = "";
                    }
                },
                show: function () {
                    return this.setShow();
                },
                setHide: function () {
                    var e = this;
                    e.lastBk || (e.lastBk = e.selection.getRange().createBookmark(!0)), e.container.style.display = "none";
                },
                hide: function () {
                    return this.setHide();
                },
                getLang: function (e) {
                    var t = UE.I18N[this.options.lang];
                    if (!t)throw Error("not import language file");
                    e = (e || "").split(".");
                    for (var i, n = 0; (i = e[n++]) && (t = t[i], t););
                    return t;
                },
                getContentLength: function (e, t) {
                    var i = this.getContent(!1, !1, !0).length;
                    if (e) {
                        t = (t || []).concat(["hr", "img", "iframe"]), i = this.getContentTxt().replace(/[\t\r\n]+/g, "").length;
                        for (var n, o = 0; n = t[o++];)i += this.document.getElementsByTagName(n).length;
                    }
                    return i;
                },
                addInputRule: function (e) {
                    this.inputRules.push(e);
                },
                filterInputRule: function (e) {
                    for (var t, i = 0; t = this.inputRules[i++];)t.call(this, e);
                },
                addOutputRule: function (e) {
                    this.outputRules.push(e);
                },
                filterOutputRule: function (e) {
                    for (var t, i = 0; t = this.outputRules[i++];)t.call(this, e);
                }
            }, utils.inherits(r, EventBase);
        }(), UE.ajax = function () {
            function e(e) {
                var t = [];
                for (var i in e)"method" != i && "timeout" != i && "async" != i && "function" != (typeof e[i]).toLowerCase() && "object" != (typeof e[i]).toLowerCase() && t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
                return t.join("&");
            }

            var t = "XMLHttpRequest()";
            try {
                new ActiveXObject("Msxml2.XMLHTTP"), t = "ActiveXObject('Msxml2.XMLHTTP')";
            } catch (i) {
                try {
                    new ActiveXObject("Microsoft.XMLHTTP"), t = "ActiveXObject('Microsoft.XMLHTTP')";
                } catch (i) {
                }
            }
            var n = new Function("return new " + t);
            return {
                request: function (t, i) {
                    var o = n(), r = !1, s = {
                        method: "POST",
                        timeout: 5e3,
                        async: !0,
                        data: {},
                        onsuccess: function () {
                        },
                        onerror: function () {
                        }
                    };
                    if ("object" == typeof t && (i = t, t = i.url), o && t) {
                        var a = i ? utils.extend(s, i) : s, l = e(a);
                        utils.isEmptyObject(a.data) || (l += (l ? "&" : "") + e(a.data));
                        var d = setTimeout(function () {
                            4 != o.readyState && (r = !0, o.abort(), clearTimeout(d));
                        }, a.timeout), c = a.method.toUpperCase(), u = t + (-1 == t.indexOf("?") ? "?" : "&") + ("POST" == c ? "" : l + "&noCache=" + +new Date);
                        o.open(c, u, a.async), o.onreadystatechange = function () {
                            4 == o.readyState && (r || 200 != o.status ? a.onerror(o) : a.onsuccess(o));
                        }, "POST" == c ? (o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                            o.send(l)) : o.send(null);
                    }
                }
            };
        }();
        var filterWord = UE.filterWord = function () {
            function e(e) {
                return /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<v:)/gi.test(e);
            }

            function t(e) {
                return e = e.replace(/[\d.]+\w+/g, function (e) {
                    return utils.transUnitToPx(e);
                });
            }

            function i(e) {
                return e.replace(/[\t\r\n]+/g, "").replace(/<!--[\s\S]*?-->/gi, "").replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi, function (e) {
                    if (browser.opera)return "";
                    try {
                        var i = e.match(/width:([ \d.]*p[tx])/i)[1], n = e.match(/height:([ \d.]*p[tx])/i)[1], o = e.match(/src=\s*"([^"]*)"/i)[1];
                        return '<img width="' + t(i) + '" height="' + t(n) + '" src="' + o + '" />';
                    } catch (r) {
                        return "";
                    }
                }).replace(/<\/?div[^>]*>/g, "").replace(/v:\w+=(["']?)[^'"]+\1/g, "").replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi, "").replace(/<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>").replace(/\s+(class|lang|align)\s*=\s*(['"]?)([\w-]+)\2/gi, function (e, t, i, n) {
                    return "class" == t && "MsoListParagraph" == n ? e : "";
                }).replace(/<(font|span)[^>]*>\s*<\/\1>/gi, "").replace(/(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function (e, i, n, o) {
                    for (var r, s = [], a = o.replace(/^\s+|\s+$/, "").replace(/&#39;/g, "'").replace(/&quot;/gi, "'").split(/;\s*/g), l = 0; r = a[l]; l++) {
                        var d, c, u = r.split(":");
                        if (2 == u.length) {
                            if (d = u[0].toLowerCase(), c = u[1].toLowerCase(), /^(background)\w*/.test(d) && 0 == c.replace(/(initial|\s)/g, "").length || /^(margin)\w*/.test(d) && /^0\w+$/.test(c))continue;
                            switch (d) {
                                case"mso-padding-alt":
                                case"mso-padding-top-alt":
                                case"mso-padding-right-alt":
                                case"mso-padding-bottom-alt":
                                case"mso-padding-left-alt":
                                case"mso-margin-alt":
                                case"mso-margin-top-alt":
                                case"mso-margin-right-alt":
                                case"mso-margin-bottom-alt":
                                case"mso-margin-left-alt":
                                case"mso-height":
                                case"mso-width":
                                case"mso-vertical-align-alt":
                                    /<table/.test(i) || (s[l] = d.replace(/^mso-|-alt$/g, "") + ":" + t(c));
                                    continue;

                                case"horiz-align":
                                    s[l] = "text-align:" + c;
                                    continue;

                                case"vert-align":
                                    s[l] = "vertical-align:" + c;
                                    continue;

                                case"font-color":
                                case"mso-foreground":
                                    s[l] = "color:" + c;
                                    continue;

                                case"mso-background":
                                case"mso-highlight":
                                    s[l] = "background:" + c;
                                    continue;

                                case"mso-default-height":
                                    s[l] = "min-height:" + t(c);
                                    continue;

                                case"mso-default-width":
                                    s[l] = "min-width:" + t(c);
                                    continue;

                                case"mso-padding-between-alt":
                                    s[l] = "border-collapse:separate;border-spacing:" + t(c);
                                    continue;

                                case"text-line-through":
                                    ("single" == c || "double" == c) && (s[l] = "text-decoration:line-through");
                                    continue;

                                case"mso-zero-height":
                                    "yes" == c && (s[l] = "display:none");
                                    continue;

                                case"background":
                                    break;

                                case"margin":
                                    if (!/[1-9]/.test(c))continue;

                                case"font-family":
                                    c = u[1].replace(/'([^\s']+)'/g, "$1"), /'([^']+)'/.test(c) || (s[l] = "font-family:" + c);
                                    continue;
                            }
                            if (/^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test(d) || /text\-indent|padding|margin/.test(d) && /\-[\d.]+/.test(c))continue;
                            s[l] = d + ":" + u[1];
                        }
                    }
                    return i + (s.length ? ' style="' + s.join(";").replace(/;{2,}/g, ";") + '"' : "");
                }).replace(/[\d]+(\.\d+)?(cm|pt)(?=[^<]*>)/g, function (e) {
                    return utils.transUnitToPx(e);
                });
            }

            return function (t) {
                return e(t) ? i(t) : t;
            };
        }();
        !function () {
            function e(e, t, i) {
                return e.push(u), t + (i ? 1 : -1);
            }

            function t(e, t) {
                for (var i = 0; t > i; i++)e.push(c);
            }

            function i(s, a, l, d) {
                switch (s.type) {
                    case"root":
                        for (var c, u = 0; c = s.children[u++];)l && "element" == c.type && !dtd.$inlineWithA[c.tagName] && u > 1 && (e(a, d, !0),
                            t(a, d)), i(c, a, l, d);
                        break;

                    case"text":
                        n(s, a);
                        break;

                    case"element":
                        o(s, a, l, d);
                        break;

                    case"comment":
                        r(s, a, l);
                }
                return a;
            }

            function n(e, t) {
                t.push("pre" == e.parentNode.tagName ? e.data : e.data.replace(/[ ]{2}/g, " &nbsp;"));
            }

            function o(n, o, r, s) {
                var a = "";
                if (n.attrs) {
                    a = [];
                    var l = n.attrs;
                    for (var d in l)a.push(d + (void 0 !== l[d] ? '="' + utils.unhtml(l[d]) + '"' : ""));
                    a = a.join(" ");
                }
                if (o.push("<" + n.tagName + (a ? " " + a : "") + (dtd.$empty[n.tagName] ? "/" : "") + ">"), r && !dtd.$inlineWithA[n.tagName] && "pre" != n.tagName && n.children && n.children.length && (s = e(o, s, !0),
                        t(o, s)), n.children && n.children.length)for (var c, u = 0; c = n.children[u++];)r && "element" == c.type && !dtd.$inlineWithA[c.tagName] && u > 1 && (e(o, s),
                    t(o, s)), i(c, o, r, s);
                dtd.$empty[n.tagName] || (r && !dtd.$inlineWithA[n.tagName] && "pre" != n.tagName && n.children && n.children.length && (s = e(o, s),
                    t(o, s)), o.push("</" + n.tagName + ">"));
            }

            function r(e, t) {
                t.push("<!--" + e.data + "-->");
            }

            function s(e, t) {
                var i;
                if ("element" == e.type && e.getAttr("id") == t)return e;
                if (e.children && e.children.length)for (var n, o = 0; n = e.children[o++];)if (i = s(n, t))return i;
            }

            function a(e, t, i) {
                if ("element" == e.type && e.tagName == t && i.push(e), e.children && e.children.length)for (var n, o = 0; n = e.children[o++];)a(n, t, i);
            }

            function l(e, t) {
                if (e.children && e.children.length)for (var i, n = 0; i = e.children[n];)l(i, t), i.parentNode && (i.children && i.children.length && t(i),
                i.parentNode && n++); else t(e);
            }

            var d = UE.uNode = function (e) {
                this.type = e.type, this.data = e.data, this.tagName = e.tagName, this.parentNode = e.parentNode,
                    this.attrs = e.attrs || {}, this.children = e.children;
            }, c = "    ", u = "\n";
            d.createElement = function (e) {
                return /[<>]/.test(e) ? UE.htmlparser(e).children[0] : new d({
                    type: "element",
                    children: [],
                    tagName: e
                });
            }, d.createText = function (e) {
                return new UE.uNode({
                    type: "text",
                    data: utils.unhtml(e || "")
                });
            }, d.prototype = {
                toHtml: function (e) {
                    var t = [];
                    return i(this, t, e, 0), t.join("");
                },
                innerHTML: function (e) {
                    if ("element" != this.type || dtd.$empty[this.tagName])return this;
                    if (utils.isString(e)) {
                        if (this.children)for (var t, i = 0; t = this.children[i++];)t.parentNode = null;
                        this.children = [];
                        for (var t, n = UE.htmlparser(e), i = 0; t = n.children[i++];)this.children.push(t), t.parentNode = this;
                        return this;
                    }
                    var n = new UE.uNode({
                        type: "root",
                        children: this.children
                    });
                    return n.toHtml();
                },
                innerText: function (e) {
                    if ("element" != this.type || dtd.$empty[this.tagName])return this;
                    if (e) {
                        if (this.children)for (var t, i = 0; t = this.children[i++];)t.parentNode = null;
                        return this.children = [], this.appendChild(d.createText(e)), this;
                    }
                    return this.toHtml().replace(/<[^>]+>/g, "");
                },
                getData: function () {
                    return "element" == this.type ? "" : this.data;
                },
                firstChild: function () {
                    return this.children ? this.children[0] : null;
                },
                lastChild: function () {
                    return this.children ? this.children[this.children.length - 1] : null;
                },
                previousSibling: function () {
                    for (var e, t = this.parentNode, i = 0; e = t.children[i]; i++)if (e === this)return 0 == i ? null : t.children[i - 1];
                },
                nextSibling: function () {
                    for (var e, t = this.parentNode, i = 0; e = t.children[i++];)if (e === this)return t.children[i];
                },
                replaceChild: function (e, t) {
                    if (this.children) {
                        e.parentNode && e.parentNode.removeChild(e);
                        for (var i, n = 0; i = this.children[n]; n++)if (i === t)return this.children.splice(n, 1, e),
                            t.parentNode = null, e.parentNode = this, e;
                    }
                },
                appendChild: function (e) {
                    if ("root" == this.type || "element" == this.type && !dtd.$empty[this.tagName]) {
                        this.children || (this.children = []), e.parentNode && e.parentNode.removeChild(e);
                        for (var t, i = 0; t = this.children[i]; i++)if (t === e) {
                            this.children.splice(i, 1);
                            break;
                        }
                        return this.children.push(e), e.parentNode = this, e;
                    }
                },
                insertBefore: function (e, t) {
                    if (this.children) {
                        e.parentNode && e.parentNode.removeChild(e);
                        for (var i, n = 0; i = this.children[n]; n++)if (i === t)return this.children.splice(n, 0, e),
                            e.parentNode = this, e;
                    }
                },
                insertAfter: function (e, t) {
                    if (this.children) {
                        e.parentNode && e.parentNode.removeChild(e);
                        for (var i, n = 0; i = this.children[n]; n++)if (i === t)return this.children.splice(n + 1, 0, e),
                            e.parentNode = this, e;
                    }
                },
                removeChild: function (e, t) {
                    if (this.children)for (var i, n = 0; i = this.children[n]; n++)if (i === e) {
                        if (this.children.splice(n, 1), i.parentNode = null, t && i.children && i.children.length)for (var o, r = 0; o = i.children[r]; r++)this.children.splice(n + r, 0, o),
                            o.parentNode = this;
                        return i;
                    }
                },
                getAttr: function (e) {
                    return this.attrs && this.attrs[e.toLowerCase()];
                },
                setAttr: function (e, t) {
                    if (!e)return void delete this.attrs;
                    if (this.attrs || (this.attrs = {}), utils.isObject(e))for (var i in e)e[i] ? this.attrs[i.toLowerCase()] = e[i] : delete this.attrs[i]; else t ? this.attrs[e.toLowerCase()] = t : delete this.attrs[e];
                },
                getIndex: function () {
                    for (var e, t = this.parentNode, i = 0; e = t.children[i]; i++)if (e === this)return i;
                    return -1;
                },
                getNodeById: function (e) {
                    var t;
                    if (this.children && this.children.length)for (var i, n = 0; i = this.children[n++];)if (t = s(i, e))return t;
                },
                getNodesByTagName: function (e) {
                    e = utils.trim(e).replace(/[ ]{2,}/g, " ").split(" ");
                    var t = [], i = this;
                    return utils.each(e, function (e) {
                        if (i.children && i.children.length)for (var n, o = 0; n = i.children[o++];)a(n, e, t);
                    }), t;
                },
                getStyle: function (e) {
                    var t = this.getAttr("style");
                    if (!t)return "";
                    var i = new RegExp(e + ":([^;]+)", "i"), n = t.match(i);
                    return n && n[0] ? n[1] : "";
                },
                setStyle: function (e, t) {
                    function i(e, t) {
                        var i = new RegExp(e + ":([^;]+;?)", "gi");
                        n = n.replace(i, ""), t && (n = e + ":" + utils.unhtml(t) + ";" + n);
                    }

                    var n = this.getAttr("style");
                    if (n || (n = ""), utils.isObject(e))for (var o in e)i(o, e[o]); else i(e, t);
                    this.setAttr("style", utils.trim(n));
                },
                traversal: function (e) {
                    return this.children && this.children.length && l(this, e), this;
                }
            };
        }();
        var htmlparser = UE.htmlparser = function (e, t) {
            function i(e, t) {
                if (u[e.tagName]) {
                    var i = d.createElement(u[e.tagName]);
                    e.appendChild(i), i.appendChild(d.createText(t)), e = i;
                } else e.appendChild(d.createText(t));
            }

            function n(e, t, i) {
                var o;
                if (o = c[t]) {
                    for (var r, a = e; "root" != a.type;) {
                        if (utils.isArray(o) ? -1 != utils.indexOf(o, a.tagName) : o == a.tagName) {
                            e = a, r = !0;
                            break;
                        }
                        a = a.parentNode;
                    }
                    r || (e = n(e, utils.isArray(o) ? o[0] : o));
                }
                var l = new d({
                    parentNode: e,
                    type: "element",
                    tagName: t.toLowerCase(),
                    children: dtd.$empty[t] ? null : []
                });
                if (i) {
                    for (var u, m = {}; u = s.exec(i);)m[u[1].toLowerCase()] = utils.unhtml(u[2] || u[3] || u[4]);
                    l.attrs = m;
                }
                return e.children.push(l), dtd.$empty[t] ? e : l;
            }

            function o(e, t) {
                e.children.push(new d({
                    type: "comment",
                    data: t,
                    parentNode: e
                }));
            }

            var r = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g, s = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g, a = {
                b: 1,
                code: 1,
                i: 1,
                u: 1,
                strike: 1,
                s: 1,
                tt: 1,
                strong: 1,
                q: 1,
                samp: 1,
                em: 1,
                span: 1,
                sub: 1,
                img: 1,
                sup: 1,
                font: 1,
                big: 1,
                small: 1,
                iframe: 1,
                a: 1,
                br: 1,
                pre: 1
            };
            e = e.replace(new RegExp(domUtils.fillChar, "g"), ""), t || (e = e.replace(new RegExp("[\\r\\t\\n" + (t ? "" : " ") + "]*</?(\\w+)\\s*(?:[^>]*)>[\\r\\t\\n" + (t ? "" : " ") + "]*", "g"), function (e, i) {
                return i && a[i.toLowerCase()] ? e.replace(/(^[\n\r]+)|([\n\r]+$)/g, "") : e.replace(new RegExp("^[\\r\\n" + (t ? "" : " ") + "]+"), "").replace(new RegExp("[\\r\\n" + (t ? "" : " ") + "]+$"), "");
            }));
            for (var l, d = UE.uNode, c = {
                td: "tr",
                tr: ["tbody", "thead", "tfoot"],
                tbody: "table",
                th: "tr",
                thead: "table",
                tfoot: "table",
                caption: "table",
                li: ["ul", "ol"],
                dt: "dl",
                dd: "dl",
                option: "select"
            }, u = {
                ol: "li",
                ul: "li"
            }, m = 0, f = 0, h = new d({
                type: "root",
                children: []
            }), p = h; l = r.exec(e);) {
                m = l.index;
                try {
                    if (m > f && i(p, e.slice(f, m)), l[3])p = n(p, l[3].toLowerCase(), l[4]); else if (l[1]) {
                        if ("root" != p.type) {
                            for (var g = p; "element" == p.type && p.tagName != l[1].toLowerCase();)if (p = p.parentNode,
                                "root" == p.type)throw p = g, "break";
                            p = p.parentNode;
                        }
                    } else l[2] && o(p, l[2]);
                } catch (v) {
                }
                f = r.lastIndex;
            }
            return f < e.length && i(p, e.slice(f)), h;
        }, filterNode = UE.filterNode = function () {
            function e(t, i) {
                switch (t.type) {
                    case"text":
                        break;

                    case"element":
                        var n;
                        if (n = i[t.tagName])if ("-" === n)t.parentNode.removeChild(t); else if (utils.isFunction(n)) {
                            var o = t.parentNode, r = t.getIndex();
                            if (n(t), t.parentNode) {
                                if (t.children)for (var s, a = 0; s = t.children[a];)e(s, i), s.parentNode && a++;
                            } else for (var s, a = r; s = o.children[a];)e(s, i), s.parentNode && a++;
                        } else {
                            var l = n.$;
                            if (l && t.attrs) {
                                var d, c = {};
                                for (var u in l) {
                                    if (d = t.getAttr(u), "style" == u && utils.isArray(l[u])) {
                                        var m = [];
                                        utils.each(l[u], function (e) {
                                            var i;
                                            (i = t.getStyle(e)) && m.push(e + ":" + i);
                                        }), d = m.join(";");
                                    }
                                    d && (c[u] = d);
                                }
                                t.attrs = c;
                            }
                            if (t.children)for (var s, a = 0; s = t.children[a];)e(s, i), s.parentNode && a++;
                        } else if (dtd.$cdata[t.tagName])t.parentNode.removeChild(t); else {
                            var o = t.parentNode, r = t.getIndex();
                            t.parentNode.removeChild(t, !0);
                            for (var s, a = r; s = o.children[a];)e(s, i), s.parentNode && a++;
                        }
                        break;

                    case"comment":
                        t.parentNode.removeChild(t);
                }
            }

            return function (t, i) {
                if (utils.isEmptyObject(i))return t;
                var n;
                (n = i["-"]) && utils.each(n.split(" "), function (e) {
                    i[e] = "-";
                });
                for (var o, r = 0; o = t.children[r];)e(o, i), o.parentNode && r++;
                return t;
            };
        }();
        UE.plugins.defaultfilter = function () {
            var e = this;
            e.setOpt("allowDivTransToP", !0), e.addInputRule(function (t) {
                var i, n = this.options.allowDivTransToP;
                t.traversal(function (t) {
                    if ("element" == t.type) {
                        if (!dtd.$cdata[t.tagName] && e.options.autoClearEmptyNode && dtd.$inline[t.tagName] && !dtd.$empty[t.tagName] && (!t.attrs || utils.isEmptyObject(t.attrs)))return void(t.firstChild() ? "span" != t.tagName || t.attrs && !utils.isEmptyObject(t.attrs) || t.parentNode.removeChild(t, !0) : t.parentNode.removeChild(t));
                        switch (t.tagName) {
                            case"style":
                            case"script":
                                t.setAttr({
                                    cdata_tag: t.tagName,
                                    cdata_data: encodeURIComponent(t.innerText() || "")
                                }), t.tagName = "div", t.removeChild(t.firstChild());
                                break;

                            case"a":
                                (i = t.getAttr("href")) && t.setAttr("_href", i);
                                break;

                            case"img":
                                if ((i = t.getAttr("src")) && /^data:/.test(i)) {
                                    t.parentNode.removeChild(t);
                                    break;
                                }
                                t.setAttr("_src", t.getAttr("src"));
                                break;

                            case"span":
                                browser.webkit && (i = t.getStyle("white-space")) && /nowrap|normal/.test(i) && (t.setStyle("white-space", ""),
                                e.options.autoClearEmptyNode && utils.isEmptyObject(t.attrs) && t.parentNode.removeChild(t, !0));
                                break;

                            case"p":
                                (i = t.getAttr("align")) && (t.setAttr("align"), t.setStyle("text-align", i)), t.firstChild() || t.innerHTML(browser.ie ? "&nbsp;" : "<br/>");
                                break;

                            case"div":
                                if (t.getAttr("cdata_tag"))break;
                                if (i = t.getAttr("class"), i && /^line number\d+/.test(i))break;
                                if (!n)break;
                                for (var o, r = UE.uNode.createElement("p"); o = t.firstChild();)"text" != o.type && UE.dom.dtd.$block[o.tagName] ? r.firstChild() ? (t.parentNode.insertBefore(r, t),
                                    r = UE.uNode.createElement("p")) : t.parentNode.insertBefore(o, t) : r.appendChild(o);
                                r.firstChild() && t.parentNode.insertBefore(r, t), t.parentNode.removeChild(t);
                                break;

                            case"dl":
                                t.tagName = "ul";
                                break;

                            case"dt":
                            case"dd":
                                t.tagName = "li";
                                break;

                            case"li":
                                var s = t.getAttr("class");
                                s && /list\-/.test(s) || t.setAttr();
                                var a = t.getNodesByTagName("ol ul");
                                UE.utils.each(a, function (e) {
                                    t.parentNode.insertAfter(e, t);
                                });
                                break;

                            case"td":
                            case"th":
                            case"caption":
                                t.children && t.children.length || t.appendChild(browser.ie11below ? UE.uNode.createText(" ") : UE.uNode.createElement("br"));
                        }
                    }
                    "comment" == t.type && t.parentNode.removeChild(t);
                });
            }), e.addOutputRule(function (t) {
                var i;
                t.traversal(function (t) {
                    if ("element" == t.type) {
                        if (e.options.autoClearEmptyNode && dtd.$inline[t.tagName] && !dtd.$empty[t.tagName] && (!t.attrs || utils.isEmptyObject(t.attrs)))return void(t.firstChild() ? "span" != t.tagName || t.attrs && !utils.isEmptyObject(t.attrs) || t.parentNode.removeChild(t, !0) : t.parentNode.removeChild(t));
                        switch (t.tagName) {
                            case"div":
                                (i = t.getAttr("cdata_tag")) && (t.tagName = i, t.appendChild(UE.uNode.createText(t.getAttr("cdata_data"))),
                                    t.setAttr({
                                        cdata_tag: "",
                                        cdata_data: ""
                                    }));
                                break;

                            case"a":
                                (i = t.getAttr("_href")) && t.setAttr({
                                    href: i,
                                    _href: ""
                                });
                                break;

                            case"img":
                                (i = t.getAttr("_src")) && t.setAttr({
                                    src: t.getAttr("_src"),
                                    _src: ""
                                });
                        }
                    }
                });
            });
        }, UE.commands.inserthtml = {
            execCommand: function (e, t, i) {
                var n, o, r = this;
                if (t && r.fireEvent("beforeinserthtml", t) !== !0) {
                    if (n = r.selection.getRange(), o = n.document.createElement("div"), o.style.display = "inline",
                            !i) {
                        var s = UE.htmlparser(t);
                        r.options.filterRules && UE.filterNode(s, r.options.filterRules), r.filterInputRule(s),
                            t = s.toHtml();
                    }
                    o.innerHTML = utils.trim(t);
                    for (var a, l = [], d = 0; a = o.children.item(d++);)l.push(a);
                    if (!n.collapsed) {
                        var c = n.startContainer;
                        if (domUtils.isFillChar(c) && n.setStartBefore(c), c = n.endContainer, domUtils.isFillChar(c) && n.setEndAfter(c),
                                n.txtToElmBoundary(), n.endContainer && 1 == n.endContainer.nodeType && (c = n.endContainer.childNodes[n.endOffset],
                            c && domUtils.isBr(c) && n.setEndAfter(c)), 0 == n.startOffset && (c = n.startContainer, domUtils.isBoundaryNode(c, "firstChild") && (c = n.endContainer,
                            n.endOffset == (3 == c.nodeType ? c.nodeValue.length : c.childNodes.length) && domUtils.isBoundaryNode(c, "lastChild") && (r.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>",
                                n.setStart(r.body.firstChild, 0).collapse(!0)))), !n.collapsed && n.deleteContents(),
                            1 == n.startContainer.nodeType) {
                            var u, m = n.startContainer.childNodes[n.startOffset];
                            if (m && domUtils.isBlockElm(m) && (u = m.previousSibling) && domUtils.isBlockElm(u)) {
                                for (n.setEnd(u, u.childNodes.length).collapse(); m.firstChild;)u.appendChild(m.firstChild);
                                domUtils.remove(m);
                            }
                        }
                    }
                    var m, f, u, h, p, g = 0;
                    n.inFillChar() && (m = n.startContainer, domUtils.isFillChar(m) ? (n.setStartBefore(m).collapse(!0),
                        domUtils.remove(m)) : domUtils.isFillChar(m, !0) && (m.nodeValue = m.nodeValue.replace(fillCharReg, ""),
                        n.startOffset--, n.collapsed && n.collapse(!0)));
                    var v = domUtils.findParentByTagName(n.startContainer, "li", !0);
                    if (v) {
                        for (var b, y; m = o.firstChild;) {
                            for (; m && (3 == m.nodeType || !domUtils.isBlockElm(m) || "HR" == m.tagName);)b = m.nextSibling,
                                n.insertNode(m).collapse(), y = m, m = b;
                            if (m)if (/^(ol|ul)$/i.test(m.tagName)) {
                                for (; m.firstChild;)y = m.firstChild, domUtils.insertAfter(v, m.firstChild), v = v.nextSibling;
                                domUtils.remove(m);
                            } else {
                                var C;
                                b = m.nextSibling, C = r.document.createElement("li"), domUtils.insertAfter(v, C), C.appendChild(m),
                                    y = m, m = b, v = C;
                            }
                        }
                        v = domUtils.findParentByTagName(n.startContainer, "li", !0), domUtils.isEmptyBlock(v) && domUtils.remove(v),
                        y && n.setStartAfter(y).collapse(!0).select(!0);
                    } else {
                        for (; m = o.firstChild;) {
                            if (g) {
                                for (var N = r.document.createElement("p"); m && (3 == m.nodeType || !dtd.$block[m.tagName]);)p = m.nextSibling,
                                    N.appendChild(m), m = p;
                                N.firstChild && (m = N);
                            }
                            if (n.insertNode(m), p = m.nextSibling, !g && m.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm(m) && (f = domUtils.findParent(m, function (e) {
                                    return domUtils.isBlockElm(e);
                                }), f && "body" != f.tagName.toLowerCase() && (!dtd[f.tagName] || !dtd[f.tagName][m.nodeName] || m.parentNode !== f))) {
                                if (dtd[f.tagName][m.nodeName])for (h = m.parentNode; h !== f;)u = h, h = h.parentNode; else u = f;
                                domUtils.breakParent(m, u || h);
                                var u = m.previousSibling;
                                domUtils.trimWhiteTextNode(u), u.childNodes.length || domUtils.remove(u), !browser.ie && (b = m.nextSibling) && domUtils.isBlockElm(b) && b.lastChild && !domUtils.isBr(b.lastChild) && b.appendChild(r.document.createElement("br")),
                                    g = 1;
                            }
                            var b = m.nextSibling;
                            if (!o.firstChild && b && domUtils.isBlockElm(b)) {
                                n.setStart(b, 0).collapse(!0);
                                break;
                            }
                            n.setEndAfter(m).collapse();
                        }
                        if (m = n.startContainer, p && domUtils.isBr(p) && domUtils.remove(p), domUtils.isBlockElm(m) && domUtils.isEmptyNode(m))if (p = m.nextSibling)domUtils.remove(m),
                        1 == p.nodeType && dtd.$block[p.tagName] && n.setStart(p, 0).collapse(!0).shrinkBoundary(); else try {
                            m.innerHTML = browser.ie ? domUtils.fillChar : "<br/>";
                        } catch (x) {
                            n.setStartBefore(m), domUtils.remove(m);
                        }
                        try {
                            n.select(!0);
                        } catch (x) {
                        }
                    }
                    return setTimeout(function () {
                        n = r.selection.getRange(), n.scrollToView(r.autoHeightEnabled, r.autoHeightEnabled ? domUtils.getXY(r.iframe).y : 0),
                            r.fireEvent("afterinserthtml");
                    }, 200), l;
                }
            }
        }, UE.plugins.autosubmit = function () {
            var e = this;
            e.commands.autosubmit = {
                execCommand: function () {
                    var e = this, t = domUtils.findParentByTagName(e.iframe, "form", !1);
                    if (t) {
                        if (e.fireEvent("beforesubmit") === !1)return;
                        e.sync(), t.submit();
                    }
                }
            }, e.addshortcutkey({
                autosubmit: "ctrl+13"
            });
        }, UE.commands.imagefloat = {
            execCommand: function (e, t) {
                var i = this, n = i.selection.getRange();
                if (!n.collapsed) {
                    var o = n.getClosedNode();
                    if (o && "IMG" == o.tagName)switch (t) {
                        case"left":
                        case"right":
                        case"none":
                            for (var r, s, a, l = o.parentNode; dtd.$inline[l.tagName] || "A" == l.tagName;)l = l.parentNode;
                            if (r = l, "P" == r.tagName && "center" == domUtils.getStyle(r, "text-align")) {
                                if (!domUtils.isBody(r) && 1 == domUtils.getChildCount(r, function (e) {
                                        return !domUtils.isBr(e) && !domUtils.isWhitespace(e);
                                    }))if (s = r.previousSibling, a = r.nextSibling, s && a && 1 == s.nodeType && 1 == a.nodeType && s.tagName == a.tagName && domUtils.isBlockElm(s)) {
                                    for (s.appendChild(r.firstChild); a.firstChild;)s.appendChild(a.firstChild);
                                    domUtils.remove(r), domUtils.remove(a);
                                } else domUtils.setStyle(r, "text-align", "");
                                n.selectNode(o).select();
                            }
                            domUtils.setStyle(o, "float", "none" == t ? "" : t), "none" == t && domUtils.removeAttributes(o, "align");
                            break;

                        case"center":
                            if ("center" != i.queryCommandValue("imagefloat")) {
                                for (l = o.parentNode, domUtils.setStyle(o, "float", ""), domUtils.removeAttributes(o, "align"),
                                         r = o; l && 1 == domUtils.getChildCount(l, function (e) {
                                    return !domUtils.isBr(e) && !domUtils.isWhitespace(e);
                                }) && (dtd.$inline[l.tagName] || "A" == l.tagName);)r = l, l = l.parentNode;
                                n.setStartBefore(r).setCursor(!1), l = i.document.createElement("div"), l.appendChild(r),
                                    domUtils.setStyle(r, "float", ""), i.execCommand("insertHtml", '<p id="_img_parent_tmp" style="text-align:center">' + l.innerHTML + "</p>"),
                                    r = i.document.getElementById("_img_parent_tmp");
                                var d = r.getElementsByTagName("img")[0];
                                r.removeAttribute("id"), r = r.firstChild, n.selectNode(d).select(), a = r.parentNode.nextSibling,
                                a && domUtils.isEmptyNode(a) && domUtils.remove(a);
                            }
                    }
                }
            },
            queryCommandValue: function () {
                var e, t, i = this.selection.getRange();
                return i.collapsed ? "none" : (e = i.getClosedNode(), e && 1 == e.nodeType && "IMG" == e.tagName ? (t = e.getAttribute("align") || domUtils.getComputedStyle(e, "float"),
                "none" == t && (t = "center" == domUtils.getComputedStyle(e.parentNode, "text-align") ? "center" : t),
                    {
                        left: 1,
                        right: 1,
                        center: 1
                    }[t] ? t : "none") : "none");
            },
            queryCommandState: function () {
                var e, t = this.selection.getRange();
                return t.collapsed ? -1 : (e = t.getClosedNode(), e && 1 == e.nodeType && "IMG" == e.tagName ? 0 : -1);
            }
        }, UE.plugins.justify = function () {
            var e = domUtils.isBlockElm, t = {
                left: 1,
                right: 1,
                center: 1,
                justify: 1
            }, i = function (t, i) {
                var n = t.createBookmark(), o = function (e) {
                    return 1 == e.nodeType ? "br" != e.tagName.toLowerCase() && !domUtils.isBookmarkNode(e) : !domUtils.isWhitespace(e);
                };
                t.enlarge(!0);
                for (var r, s = t.createBookmark(), a = domUtils.getNextDomNode(s.start, !1, o), l = t.cloneRange(); a && !(domUtils.getPosition(a, s.end) & domUtils.POSITION_FOLLOWING);)if (3 != a.nodeType && e(a))a = domUtils.getNextDomNode(a, !0, o); else {
                    for (l.setStartBefore(a); a && a !== s.end && !e(a);)r = a, a = domUtils.getNextDomNode(a, !1, null, function (t) {
                        return !e(t);
                    });
                    l.setEndAfter(r);
                    var d = l.getCommonAncestor();
                    if (!domUtils.isBody(d) && e(d))domUtils.setStyles(d, utils.isString(i) ? {
                        "text-align": i
                    } : i), a = d; else {
                        var c = t.document.createElement("p");
                        domUtils.setStyles(c, utils.isString(i) ? {
                            "text-align": i
                        } : i);
                        var u = l.extractContents();
                        c.appendChild(u), l.insertNode(c), a = c;
                    }
                    a = domUtils.getNextDomNode(a, !1, o);
                }
                return t.moveToBookmark(s).moveToBookmark(n);
            };
            UE.commands.justify = {
                execCommand: function (e, t) {
                    var n, o = this.selection.getRange();
                    return o.collapsed && (n = this.document.createTextNode("p"), o.insertNode(n)), i(o, t),
                    n && (o.setStartBefore(n).collapse(!0), domUtils.remove(n)), o.select(), !0;
                },
                queryCommandValue: function () {
                    var e = this.selection.getStart(), i = domUtils.getComputedStyle(e, "text-align");
                    return t[i] ? i : "left";
                },
                queryCommandState: function () {
                    var e = this.selection.getStart(), t = e && domUtils.findParentByTagName(e, ["td", "th", "caption"], !0);
                    return t ? -1 : 0;
                }
            };
        }, UE.plugins.font = function () {
            function e(e) {
                for (var t; (t = e.parentNode) && "SPAN" == t.tagName && 1 == domUtils.getChildCount(t, function (e) {
                    return !domUtils.isBookmarkNode(e) && !domUtils.isBr(e);
                });)t.style.cssText += e.style.cssText, domUtils.remove(e, !0), e = t;
            }

            function t(e, t, i) {
                if (s[t] && (e.adjustmentBoundary(), !e.collapsed && 1 == e.startContainer.nodeType)) {
                    var n = e.startContainer.childNodes[e.startOffset];
                    if (n && domUtils.isTagNode(n, "span")) {
                        var o = e.createBookmark();
                        utils.each(domUtils.getElementsByTagName(n, "span"), function (e) {
                            e.parentNode && !domUtils.isBookmarkNode(e) && ("backcolor" != t || domUtils.getComputedStyle(e, "background-color").toLowerCase() !== i) && (domUtils.removeStyle(e, s[t]),
                            0 == e.style.cssText.replace(/^\s+$/, "").length && domUtils.remove(e, !0));
                        }), e.moveToBookmark(o);
                    }
                }
            }

            function i(i, n, o) {
                var r, s = i.collapsed, a = i.createBookmark();
                if (s)for (r = a.start.parentNode; dtd.$inline[r.tagName];)r = r.parentNode; else r = domUtils.getCommonAncestor(a.start, a.end);
                utils.each(domUtils.getElementsByTagName(r, "span"), function (t) {
                    if (t.parentNode && !domUtils.isBookmarkNode(t)) {
                        if (/\s*border\s*:\s*none;?\s*/i.test(t.style.cssText))return void(/^\s*border\s*:\s*none;?\s*$/.test(t.style.cssText) ? domUtils.remove(t, !0) : domUtils.removeStyle(t, "border"));
                        if (/border/i.test(t.style.cssText) && "SPAN" == t.parentNode.tagName && /border/i.test(t.parentNode.style.cssText) && (t.style.cssText = t.style.cssText.replace(/border[^:]*:[^;]+;?/gi, "")),
                            "fontborder" != n || "none" != o)for (var i = t.nextSibling; i && 1 == i.nodeType && "SPAN" == i.tagName;)if (domUtils.isBookmarkNode(i) && "fontborder" == n)t.appendChild(i),
                            i = t.nextSibling; else {
                            if (i.style.cssText == t.style.cssText && (domUtils.moveChild(i, t), domUtils.remove(i)),
                                t.nextSibling === i)break;
                            i = t.nextSibling;
                        }
                        if (e(t), browser.ie && browser.version > 8) {
                            var r = domUtils.findParent(t, function (e) {
                                return "SPAN" == e.tagName && /background-color/.test(e.style.cssText);
                            });
                            r && !/background-color/.test(t.style.cssText) && (t.style.backgroundColor = r.style.backgroundColor);
                        }
                    }
                }), i.moveToBookmark(a), t(i, n, o);
            }

            var n = this, o = {
                forecolor: "color",
                backcolor: "background-color",
                fontsize: "font-size",
                fontfamily: "font-family",
                underline: "text-decoration",
                strikethrough: "text-decoration",
                fontborder: "border"
            }, r = {
                underline: 1,
                strikethrough: 1,
                fontborder: 1
            }, s = {
                forecolor: "color",
                backcolor: "background-color",
                fontsize: "font-size",
                fontfamily: "font-family"
            };
            n.setOpt({
                fontfamily: [{
                    name: "songti",
                    val: "宋体,SimSun"
                }, {
                    name: "yahei",
                    val: "微软雅黑,Microsoft YaHei"
                }, {
                    name: "kaiti",
                    val: "楷体,楷体_GB2312, SimKai"
                }, {
                    name: "heiti",
                    val: "黑体, SimHei"
                }, {
                    name: "lishu",
                    val: "隶书, SimLi"
                }, {
                    name: "andaleMono",
                    val: "andale mono"
                }, {
                    name: "arial",
                    val: "arial, helvetica,sans-serif"
                }, {
                    name: "arialBlack",
                    val: "arial black,avant garde"
                }, {
                    name: "comicSansMs",
                    val: "comic sans ms"
                }, {
                    name: "impact",
                    val: "impact,chicago"
                }, {
                    name: "timesNewRoman",
                    val: "times new roman"
                }],
                fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36]
            }), n.addInputRule(function (e) {
                utils.each(e.getNodesByTagName("u s del font strike"), function (e) {
                    if ("font" == e.tagName) {
                        var t = [];
                        for (var i in e.attrs)switch (i) {
                            case"size":
                                t.push("font-size:" + e.attrs[i] + "px");
                                break;

                            case"color":
                                t.push("color:" + e.attrs[i]);
                                break;

                            case"face":
                                t.push("font-family:" + e.attrs[i]);
                                break;

                            case"style":
                                t.push(e.attrs[i]);
                        }
                        e.attrs = {
                            style: t.join(";")
                        };
                    } else {
                        var n = "u" == e.tagName ? "underline" : "line-through";
                        e.attrs = {
                            style: (e.getAttr("style") || "") + "text-decoration:" + n + ";"
                        };
                    }
                    e.tagName = "span";
                });
            });
            for (var a in o)!function (e, t) {
                UE.commands[e] = {
                    execCommand: function (n, o) {
                        o = o || (this.queryCommandState(n) ? "none" : "underline" == n ? "underline" : "fontborder" == n ? "1px solid #000" : "line-through");
                        var s, a = this, l = this.selection.getRange();
                        if ("default" == o)l.collapsed && (s = a.document.createTextNode("font"), l.insertNode(s).select()),
                            a.execCommand("removeFormat", "span,a", t), s && (l.setStartBefore(s).collapse(!0), domUtils.remove(s)),
                            i(l, n, o), l.select(); else if (l.collapsed) {
                            var d = domUtils.findParentByTagName(l.startContainer, "span", !0);
                            if (s = a.document.createTextNode("font"), !d || d.children.length || d[browser.ie ? "innerText" : "textContent"].replace(fillCharReg, "").length) {
                                if (l.insertNode(s), l.selectNode(s).select(), d = l.document.createElement("span"), r[e]) {
                                    if (domUtils.findParentByTagName(s, "a", !0))return l.setStartBefore(s).setCursor(),
                                        void domUtils.remove(s);
                                    a.execCommand("removeFormat", "span,a", t);
                                }
                                if (d.style.cssText = t + ":" + o, s.parentNode.insertBefore(d, s), !browser.ie || browser.ie && 9 == browser.version)for (var c = d.parentNode; !domUtils.isBlockElm(c);)"SPAN" == c.tagName && (d.style.cssText = c.style.cssText + ";" + d.style.cssText),
                                    c = c.parentNode;
                                opera ? setTimeout(function () {
                                    l.setStart(d, 0).collapse(!0), i(l, n, o), l.select();
                                }) : (l.setStart(d, 0).collapse(!0), i(l, n, o), l.select());
                            } else l.insertNode(s), r[e] && (l.selectNode(s).select(), a.execCommand("removeFormat", "span,a", t, null),
                                d = domUtils.findParentByTagName(s, "span", !0), l.setStartBefore(s)), d && (d.style.cssText += ";" + t + ":" + o),
                                l.collapse(!0).select();
                            domUtils.remove(s);
                        } else r[e] && a.queryCommandValue(e) && a.execCommand("removeFormat", "span,a", t), l = a.selection.getRange(),
                            l.applyInlineStyle("span", {
                                style: t + ":" + o
                            }), i(l, n, o), l.select();
                        return !0;
                    },
                    queryCommandValue: function (e) {
                        var i = this.selection.getStart();
                        if ("underline" == e || "strikethrough" == e) {
                            for (var n, o = i; o && !domUtils.isBlockElm(o) && !domUtils.isBody(o);) {
                                if (1 == o.nodeType && (n = domUtils.getComputedStyle(o, t), "none" != n))return n;
                                o = o.parentNode;
                            }
                            return "none";
                        }
                        if ("fontborder" == e) {
                            for (var r, s = i; s && dtd.$inline[s.tagName];) {
                                if ((r = domUtils.getComputedStyle(s, "border")) && /1px/.test(r) && /solid/.test(r))return r;
                                s = s.parentNode;
                            }
                            return "";
                        }
                        if ("FontSize" == e) {
                            var a = domUtils.getComputedStyle(i, t), s = /^([\d\.]+)(\w+)$/.exec(a);
                            return s ? Math.floor(s[1]) + s[2] : a;
                        }
                        return domUtils.getComputedStyle(i, t);
                    },
                    queryCommandState: function (e) {
                        if (!r[e])return 0;
                        var t = this.queryCommandValue(e);
                        return "fontborder" == e ? /1px/.test(t) && /solid/.test(t) : t == ("underline" == e ? "underline" : "line-through");
                    }
                };
            }(a, o[a]);
        }, UE.plugins.removeformat = function () {
            var e = this;
            e.setOpt({
                removeFormatTags: "b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var",
                removeFormatAttributes: "class,style,lang,width,height,align,hspace,valign"
            }), e.commands.removeformat = {
                execCommand: function (e, t, i, n, o) {
                    function r(e) {
                        if (3 == e.nodeType || "span" != e.tagName.toLowerCase())return 0;
                        if (browser.ie) {
                            var t = e.attributes;
                            if (t.length) {
                                for (var i = 0, n = t.length; n > i; i++)if (t[i].specified)return 0;
                                return 1;
                            }
                        }
                        return !e.attributes.length;
                    }

                    function s(e) {
                        var t = e.createBookmark();
                        if (e.collapsed && e.enlarge(!0), !o) {
                            var n = domUtils.findParentByTagName(e.startContainer, "a", !0);
                            n && e.setStartBefore(n), n = domUtils.findParentByTagName(e.endContainer, "a", !0), n && e.setEndAfter(n);
                        }
                        for (a = e.createBookmark(), p = a.start; (l = p.parentNode) && !domUtils.isBlockElm(l);)domUtils.breakParent(p, l),
                            domUtils.clearEmptySibling(p);
                        if (a.end) {
                            for (p = a.end; (l = p.parentNode) && !domUtils.isBlockElm(l);)domUtils.breakParent(p, l),
                                domUtils.clearEmptySibling(p);
                            for (var s, u = domUtils.getNextDomNode(a.start, !1, m); u && u != a.end;)s = domUtils.getNextDomNode(u, !0, m),
                            dtd.$empty[u.tagName.toLowerCase()] || domUtils.isBookmarkNode(u) || (d.test(u.tagName) ? i ? (domUtils.removeStyle(u, i),
                            r(u) && "text-decoration" != i && domUtils.remove(u, !0)) : domUtils.remove(u, !0) : dtd.$tableContent[u.tagName] || dtd.$list[u.tagName] || (domUtils.removeAttributes(u, c),
                            r(u) && domUtils.remove(u, !0))), u = s;
                        }
                        var f = a.start.parentNode;
                        !domUtils.isBlockElm(f) || dtd.$tableContent[f.tagName] || dtd.$list[f.tagName] || domUtils.removeAttributes(f, c),
                            f = a.end.parentNode, a.end && domUtils.isBlockElm(f) && !dtd.$tableContent[f.tagName] && !dtd.$list[f.tagName] && domUtils.removeAttributes(f, c),
                            e.moveToBookmark(a).moveToBookmark(t);
                        for (var h, p = e.startContainer, g = e.collapsed; 1 == p.nodeType && domUtils.isEmptyNode(p) && dtd.$removeEmpty[p.tagName];)h = p.parentNode,
                            e.setStartBefore(p), e.startContainer === e.endContainer && e.endOffset--, domUtils.remove(p),
                            p = h;
                        if (!g)for (p = e.endContainer; 1 == p.nodeType && domUtils.isEmptyNode(p) && dtd.$removeEmpty[p.tagName];)h = p.parentNode,
                            e.setEndBefore(p), domUtils.remove(p), p = h;
                    }

                    var a, l, d = new RegExp("^(?:" + (t || this.options.removeFormatTags).replace(/,/g, "|") + ")$", "i"), c = i ? [] : (n || this.options.removeFormatAttributes).split(","), u = new dom.Range(this.document), m = function (e) {
                        return 1 == e.nodeType;
                    };
                    u = this.selection.getRange(), s(u), u.select();
                }
            };
        }, UE.plugins.blockquote = function () {
            function e(e) {
                return domUtils.filterNodeList(e.selection.getStartElementPath(), "blockquote");
            }

            var t = this;
            t.commands.blockquote = {
                execCommand: function (t, i) {
                    var n = this.selection.getRange(), o = e(this), r = dtd.blockquote, s = n.createBookmark();
                    if (o) {
                        var a = n.startContainer, l = domUtils.isBlockElm(a) ? a : domUtils.findParent(a, function (e) {
                            return domUtils.isBlockElm(e);
                        }), d = n.endContainer, c = domUtils.isBlockElm(d) ? d : domUtils.findParent(d, function (e) {
                            return domUtils.isBlockElm(e);
                        });
                        l = domUtils.findParentByTagName(l, "li", !0) || l, c = domUtils.findParentByTagName(c, "li", !0) || c,
                            "LI" == l.tagName || "TD" == l.tagName || l === o || domUtils.isBody(l) ? domUtils.remove(o, !0) : domUtils.breakParent(l, o),
                        l !== c && (o = domUtils.findParentByTagName(c, "blockquote"), o && ("LI" == c.tagName || "TD" == c.tagName || domUtils.isBody(c) ? o.parentNode && domUtils.remove(o, !0) : domUtils.breakParent(c, o)));
                        for (var u, m = domUtils.getElementsByTagName(this.document, "blockquote"), f = 0; u = m[f++];)u.childNodes.length ? domUtils.getPosition(u, l) & domUtils.POSITION_FOLLOWING && domUtils.getPosition(u, c) & domUtils.POSITION_PRECEDING && domUtils.remove(u, !0) : domUtils.remove(u);
                    } else {
                        for (var h = n.cloneRange(), p = 1 == h.startContainer.nodeType ? h.startContainer : h.startContainer.parentNode, g = p, v = 1; ;) {
                            if (domUtils.isBody(p)) {
                                g !== p ? n.collapsed ? (h.selectNode(g), v = 0) : h.setStartBefore(g) : h.setStart(p, 0);
                                break;
                            }
                            if (!r[p.tagName]) {
                                n.collapsed ? h.selectNode(g) : h.setStartBefore(g);
                                break;
                            }
                            g = p, p = p.parentNode;
                        }
                        if (v)for (g = p = p = 1 == h.endContainer.nodeType ? h.endContainer : h.endContainer.parentNode; ;) {
                            if (domUtils.isBody(p)) {
                                g !== p ? h.setEndAfter(g) : h.setEnd(p, p.childNodes.length);
                                break;
                            }
                            if (!r[p.tagName]) {
                                h.setEndAfter(g);
                                break;
                            }
                            g = p, p = p.parentNode;
                        }
                        p = n.document.createElement("blockquote"), domUtils.setAttributes(p, i), p.appendChild(h.extractContents()),
                            h.insertNode(p);
                        for (var b, y = domUtils.getElementsByTagName(p, "blockquote"), f = 0; b = y[f++];)b.parentNode && domUtils.remove(b, !0);
                    }
                    n.moveToBookmark(s).select();
                },
                queryCommandState: function () {
                    return e(this) ? 1 : 0;
                }
            };
        }, UE.commands.indent = {
            execCommand: function () {
                var e = this, t = e.queryCommandState("indent") ? "0em" : e.options.indentValue || "2em";
                e.execCommand("Paragraph", "p", {
                    style: "text-indent:" + t
                });
            },
            queryCommandState: function () {
                var e = domUtils.filterNodeList(this.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
                return e && e.style.textIndent && parseInt(e.style.textIndent) ? 1 : 0;
            }
        }, UE.plugins.selectall = function () {
            var e = this;
            e.commands.selectall = {
                execCommand: function () {
                    var e = this, t = e.body, i = e.selection.getRange();
                    i.selectNodeContents(t), domUtils.isEmptyBlock(t) && (browser.opera && t.firstChild && 1 == t.firstChild.nodeType && i.setStartAtFirst(t.firstChild),
                        i.collapse(!0)), i.select(!0);
                },
                notNeedUndo: 1
            }, e.addshortcutkey({
                selectAll: "ctrl+65"
            });
        }, UE.plugins.paragraph = function () {
            var e = this, t = domUtils.isBlockElm, i = ["TD", "LI", "PRE"], n = function (e, n, o, r) {
                var s, a = e.createBookmark(), l = function (e) {
                    return 1 == e.nodeType ? "br" != e.tagName.toLowerCase() && !domUtils.isBookmarkNode(e) : !domUtils.isWhitespace(e);
                };
                e.enlarge(!0);
                for (var d, c = e.createBookmark(), u = domUtils.getNextDomNode(c.start, !1, l), m = e.cloneRange(); u && !(domUtils.getPosition(u, c.end) & domUtils.POSITION_FOLLOWING);)if (3 != u.nodeType && t(u))u = domUtils.getNextDomNode(u, !0, l); else {
                    for (m.setStartBefore(u); u && u !== c.end && !t(u);)d = u, u = domUtils.getNextDomNode(u, !1, null, function (e) {
                        return !t(e);
                    });
                    m.setEndAfter(d), s = e.document.createElement(n), o && (domUtils.setAttributes(s, o), r && "customstyle" == r && o.style && (s.style.cssText = o.style)),
                        s.appendChild(m.extractContents()), domUtils.isEmptyNode(s) && domUtils.fillChar(e.document, s),
                        m.insertNode(s);
                    var f = s.parentNode;
                    t(f) && !domUtils.isBody(s.parentNode) && -1 == utils.indexOf(i, f.tagName) && (r && "customstyle" == r || (f.getAttribute("dir") && s.setAttribute("dir", f.getAttribute("dir")),
                    f.style.cssText && (s.style.cssText = f.style.cssText + ";" + s.style.cssText), f.style.textAlign && !s.style.textAlign && (s.style.textAlign = f.style.textAlign),
                    f.style.textIndent && !s.style.textIndent && (s.style.textIndent = f.style.textIndent),
                    f.style.padding && !s.style.padding && (s.style.padding = f.style.padding)), o && /h\d/i.test(f.tagName) && !/h\d/i.test(s.tagName) ? (domUtils.setAttributes(f, o),
                    r && "customstyle" == r && o.style && (f.style.cssText = o.style), domUtils.remove(s, !0), s = f) : domUtils.remove(s.parentNode, !0)),
                        u = -1 != utils.indexOf(i, f.tagName) ? f : s, u = domUtils.getNextDomNode(u, !1, l);
                }
                return e.moveToBookmark(c).moveToBookmark(a);
            };
            e.setOpt("paragraph", {
                p: "",
                h1: "",
                h2: "",
                h3: "",
                h4: "",
                h5: "",
                h6: ""
            }), e.commands.paragraph = {
                execCommand: function (e, t, i, o) {
                    var r = this.selection.getRange();
                    if (r.collapsed) {
                        var s = this.document.createTextNode("p");
                        if (r.insertNode(s), browser.ie) {
                            var a = s.previousSibling;
                            a && domUtils.isWhitespace(a) && domUtils.remove(a), a = s.nextSibling, a && domUtils.isWhitespace(a) && domUtils.remove(a);
                        }
                    }
                    if (r = n(r, t, i, o), s && (r.setStartBefore(s).collapse(!0), pN = s.parentNode, domUtils.remove(s),
                        domUtils.isBlockElm(pN) && domUtils.isEmptyNode(pN) && domUtils.fillNode(this.document, pN)),
                        browser.gecko && r.collapsed && 1 == r.startContainer.nodeType) {
                        var l = r.startContainer.childNodes[r.startOffset];
                        l && 1 == l.nodeType && l.tagName.toLowerCase() == t && r.setStart(l, 0).collapse(!0);
                    }
                    return r.select(), !0;
                },
                queryCommandValue: function () {
                    var e = domUtils.filterNodeList(this.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
                    return e ? e.tagName.toLowerCase() : "";
                }
            };
        }, UE.plugins.horizontal = function () {
            var e = this;
            e.commands.horizontal = {
                execCommand: function (e) {
                    var t = this;
                    if (-1 !== t.queryCommandState(e)) {
                        t.execCommand("insertHtml", "<hr>");
                        var i = t.selection.getRange(), n = i.startContainer;
                        if (1 == n.nodeType && !n.childNodes[i.startOffset]) {
                            var o;
                            (o = n.childNodes[i.startOffset - 1]) && 1 == o.nodeType && "HR" == o.tagName && ("p" == t.options.enterTag ? (o = t.document.createElement("p"),
                                i.insertNode(o), i.setStart(o, 0).setCursor()) : (o = t.document.createElement("br"), i.insertNode(o),
                                i.setStartBefore(o).setCursor()));
                        }
                        return !0;
                    }
                },
                queryCommandState: function () {
                    return domUtils.filterNodeList(this.selection.getStartElementPath(), "table") ? -1 : 0;
                }
            }, e.addListener("delkeydown", function (e, t) {
                var i = this.selection.getRange();
                if (i.txtToElmBoundary(!0), domUtils.isStartInblock(i)) {
                    var n = i.startContainer, o = n.previousSibling;
                    if (o && domUtils.isTagNode(o, "hr"))return domUtils.remove(o), i.select(), domUtils.preventDefault(t),
                        !0;
                }
            });
        }, UE.plugins.rowspacing = function () {
            var e = this;
            e.setOpt({
                rowspacingtop: ["5", "10", "15", "20", "25"],
                rowspacingbottom: ["5", "10", "15", "20", "25"]
            }), e.commands.rowspacing = {
                execCommand: function (e, t, i) {
                    return this.execCommand("paragraph", "p", {
                        style: "margin-" + i + ":" + t + "px"
                    }), !0;
                },
                queryCommandValue: function (e, t) {
                    var i, n = domUtils.filterNodeList(this.selection.getStartElementPath(), function (e) {
                        return domUtils.isBlockElm(e);
                    });
                    return n ? (i = domUtils.getComputedStyle(n, "margin-" + t).replace(/[^\d]/g, ""), i ? i : 0) : 0;
                }
            };
        }, UE.plugins.lineheight = function () {
            var e = this;
            e.setOpt({
                lineheight: ["1", "1.5", "1.75", "2", "3", "4", "5"]
            }), e.commands.lineheight = {
                execCommand: function (e, t) {
                    return this.execCommand("paragraph", "p", {
                        style: "line-height:" + ("1" == t ? "normal" : t + "em")
                    }), !0;
                },
                queryCommandValue: function () {
                    var e = domUtils.filterNodeList(this.selection.getStartElementPath(), function (e) {
                        return domUtils.isBlockElm(e);
                    });
                    if (e) {
                        var t = domUtils.getComputedStyle(e, "line-height");
                        return "normal" == t ? 1 : t.replace(/[^\d.]*/gi, "");
                    }
                }
            };
        }, UE.plugins.insertcode = function () {
            var e = this;
            e.ready(function () {
                utils.cssRule("pre", "pre{margin:.5em 0;padding:.4em .6em;border-radius:8px;background:#f8f8f8;}", e.document);
            }), e.setOpt("insertcode", {
                as3: "ActionScript3",
                bash: "Bash/Shell",
                cpp: "C/C++",
                css: "Css",
                cf: "CodeFunction",
                "c#": "C#",
                delphi: "Delphi",
                diff: "Diff",
                erlang: "Erlang",
                groovy: "Groovy",
                html: "Html",
                java: "Java",
                jfx: "JavaFx",
                js: "Javascript",
                pl: "Perl",
                php: "Php",
                plain: "Plain Text",
                ps: "PowerShell",
                python: "Python",
                ruby: "Ruby",
                scala: "Scala",
                sql: "Sql",
                vb: "Vb",
                xml: "Xml"
            }), e.commands.insertcode = {
                execCommand: function (e, t) {
                    var i = this, n = i.selection.getRange(), o = domUtils.findParentByTagName(n.startContainer, "pre", !0);
                    if (o)o.className = "brush:" + t + ";toolbar:false;"; else {
                        var r = "";
                        if (n.collapsed)r = browser.ie && browser.ie11below ? browser.version <= 8 ? "&nbsp;" : "" : "<br/>"; else {
                            var s = n.extractContents(), a = i.document.createElement("div");
                            a.appendChild(s), utils.each(UE.filterNode(UE.htmlparser(a.innerHTML.replace(/[\r\t]/g, "")), i.options.filterTxtRules).children, function (e) {
                                if (browser.ie && browser.ie11below && browser.version > 8)"element" == e.type ? "br" == e.tagName ? r += "\n" : dtd.$empty[e.tagName] || (utils.each(e.children, function (t) {
                                    "element" == t.type ? "br" == t.tagName ? r += "\n" : dtd.$empty[e.tagName] || (r += t.innerText()) : r += t.data;
                                }), /\n$/.test(r) || (r += "\n")) : r += e.data + "\n", !e.nextSibling() && /\n$/.test(r) && (r = r.replace(/\n$/, "")); else if (browser.ie && browser.ie11below)"element" == e.type ? "br" == e.tagName ? r += "<br>" : dtd.$empty[e.tagName] || (utils.each(e.children, function (t) {
                                    "element" == t.type ? "br" == t.tagName ? r += "<br>" : dtd.$empty[e.tagName] || (r += t.innerText()) : r += t.data;
                                }), /br>$/.test(r) || (r += "<br>")) : r += e.data + "<br>", !e.nextSibling() && /<br>$/.test(r) && (r = r.replace(/<br>$/, "")); else if (r += "element" == e.type ? dtd.$empty[e.tagName] ? "" : e.innerText() : e.data,
                                        !/br\/?\s*>$/.test(r)) {
                                    if (!e.nextSibling())return;
                                    r += "<br>";
                                }
                            });
                        }
                        i.execCommand("inserthtml", '<pre id="coder"class="brush:' + t + ';toolbar:false">' + r + "</pre>", !0),
                            o = i.document.getElementById("coder"), domUtils.removeAttributes(o, "id");
                        var l = o.previousSibling;
                        l && (3 == l.nodeType && 1 == l.nodeValue.length && browser.ie && 6 == browser.version || domUtils.isEmptyBlock(l)) && domUtils.remove(l);
                        var n = i.selection.getRange();
                        domUtils.isEmptyBlock(o) ? n.setStart(o, 0).setCursor(!1, !0) : n.selectNodeContents(o).select();
                    }
                },
                queryCommandValue: function () {
                    var e = this.selection.getStartElementPath(), t = "";
                    return utils.each(e, function (e) {
                        if ("PRE" == e.nodeName) {
                            var i = e.className.match(/brush:([^;]+)/);
                            return t = i && i[1] ? i[1] : "", !1;
                        }
                    }), t;
                }
            }, e.addOutputRule(function (e) {
                utils.each(e.getNodesByTagName("pre"), function () {
                });
            }), e.notNeedCodeQuery = {
                help: 1,
                undo: 1,
                redo: 1,
                source: 1,
                print: 1,
                searchreplace: 1,
                fullscreen: 1,
                preview: 1,
                insertparagraph: 1,
                elementpath: 1,
                highlightcode: 1,
                insertcode: 1,
                inserthtml: 1,
                selectall: 1
            };
            e.queryCommandState;
            e.queryCommandState = function (e) {
                var t = this;
                return !t.notNeedCodeQuery[e.toLowerCase()] && t.selection && t.queryCommandValue("insertcode") ? -1 : UE.Editor.prototype.queryCommandState.apply(this, arguments);
            }, e.addListener("beforeenterkeydown", function () {
                var t = e.selection.getRange(), i = domUtils.findParentByTagName(t.startContainer, "pre", !0);
                if (i) {
                    if (e.fireEvent("saveScene"), t.collapsed || t.deleteContents(), browser.ie)if (browser.version > 8) {
                        var n = e.document.createTextNode("\n"), o = t.startContainer;
                        if (0 == t.startOffset) {
                            var r = o.previousSibling;
                            if (r) {
                                t.insertNode(n);
                                var s = e.document.createTextNode(" ");
                                t.setStartAfter(n).insertNode(s).setStart(s, 0).collapse(!0).select(!0);
                            }
                        } else {
                            t.insertNode(n).setStartAfter(n);
                            var s = e.document.createTextNode(" ");
                            o = t.startContainer.childNodes[t.startOffset], o && !/^\n/.test(o.nodeValue) && t.setStartBefore(n),
                                t.insertNode(s).setStart(s, 0).collapse(!0).select(!0);
                        }
                    } else {
                        var a = e.document.createElement("br");
                        t.insertNode(a), t.insertNode(e.document.createTextNode(domUtils.fillChar)), t.setStartAfter(a),
                            i = a.previousSibling;
                        for (var l; i;)if (l = i, i = i.previousSibling, !i || "BR" == i.nodeName) {
                            i = l;
                            break;
                        }
                        if (i) {
                            for (var d = ""; i && "BR" != i.nodeName && new RegExp("^[ " + domUtils.fillChar + "]*$").test(i.nodeValue);)d += i.nodeValue,
                                i = i.nextSibling;
                            if ("BR" != i.nodeName) {
                                var c = i.nodeValue.match(new RegExp("^([ " + domUtils.fillChar + "]+)"));
                                c && c[1] && (d += c[1]);
                            }
                            d = e.document.createTextNode(d), t.insertNode(d).setStartAfter(d);
                        }
                        t.collapse(!0).select();
                    } else {
                        var i, a = e.document.createElement("br");
                        t.insertNode(a).setStartAfter(a).collapse(!0);
                        var u = a.nextSibling;
                        u ? t.setStartAfter(a) : t.insertNode(a.cloneNode(!1)), i = a.previousSibling;
                        for (var l; i;)if (l = i, i = i.previousSibling, !i || "BR" == i.nodeName) {
                            i = l;
                            break;
                        }
                        if (i) {
                            for (var d = ""; i && "BR" != i.nodeName && new RegExp("^[\\s" + domUtils.fillChar + "]*$").test(i.nodeValue);)d += i.nodeValue,
                                i = i.nextSibling;
                            if (i && i.nodeValue && i.nodeName && "BR" != i.nodeName) {
                                var c = i.nodeValue.match(new RegExp("^([\\s" + domUtils.fillChar + "]+)"));
                                c && c[1] && (d += c[1]);
                            }
                            d && (d = e.document.createTextNode(d), t.insertNode(d).setStartAfter(d));
                        }
                        t.collapse(!0).select(!0);
                    }
                    return e.fireEvent("saveScene"), !0;
                }
            }), e.addListener("tabkeydown", function (t, i) {
                var n = e.selection.getRange(), o = domUtils.findParentByTagName(n.startContainer, "pre", !0);
                if (o) {
                    if (e.fireEvent("saveScene"), i.shiftKey); else if (n.collapsed) {
                        var r = e.document.createTextNode("    ");
                        n.insertNode(r).setStartAfter(r).collapse(!0).select(!0);
                    } else {
                        for (var s = n.createBookmark(), a = s.start.previousSibling; a;) {
                            if (o.firstChild === a && !domUtils.isBr(a)) {
                                o.insertBefore(e.document.createTextNode("    "), a);
                                break;
                            }
                            if (domUtils.isBr(a)) {
                                o.insertBefore(e.document.createTextNode("    "), a.nextSibling);
                                break;
                            }
                            a = a.previousSibling;
                        }
                        var l = s.end;
                        for (a = s.start.nextSibling, o.firstChild === s.start && o.insertBefore(e.document.createTextNode("    "), a.nextSibling); a && a !== l;) {
                            if (domUtils.isBr(a) && a.nextSibling) {
                                if (a.nextSibling === l)break;
                                o.insertBefore(e.document.createTextNode("    "), a.nextSibling);
                            }
                            a = a.nextSibling;
                        }
                        n.moveToBookmark(s).select();
                    }
                    return e.fireEvent("saveScene"), !0;
                }
            }), e.addListener("beforeinserthtml", function () {
                {
                    var e = this, t = e.selection.getRange();
                    domUtils.findParentByTagName(t.startContainer, "pre", !0);
                }
            }), e.addListener("keydown", function (e, t) {
                var i = this, n = t.keyCode || t.which;
                if (40 == n) {
                    var o, r = i.selection.getRange(), s = r.startContainer;
                    if (r.collapsed && (o = domUtils.findParentByTagName(r.startContainer, "pre", !0)) && !o.nextSibling) {
                        for (var a = o.lastChild; a && "BR" == a.nodeName;)a = a.previousSibling;
                        (a === s || r.startContainer === o && r.startOffset == o.childNodes.length) && (i.execCommand("insertparagraph"),
                            domUtils.preventDefault(t));
                    }
                }
            }), e.addListener("delkeydown", function (t, i) {
                var n = this.selection.getRange();
                n.txtToElmBoundary(!0);
                var o = n.startContainer;
                if (domUtils.isTagNode(o, "pre") && n.collapsed && domUtils.isStartInblock(n)) {
                    var r = e.document.createElement("p");
                    return domUtils.fillNode(e.document, r), o.parentNode.insertBefore(r, o), domUtils.remove(o),
                        n.setStart(r, 0).setCursor(!1, !0), domUtils.preventDefault(i), !0;
                }
            });
        }, UE.commands.cleardoc = {
            execCommand: function () {
                var e = this, t = e.options.enterTag, i = e.selection.getRange();
                "br" == t ? (e.body.innerHTML = "<br/>", i.setStart(e.body, 0).setCursor()) : (e.body.innerHTML = "<p>" + (ie ? "" : "<br/>") + "</p>",
                    i.setStart(e.body.firstChild, 0).setCursor(!1, !0)), setTimeout(function () {
                    e.fireEvent("clearDoc");
                }, 0);
            }
        }, UE.plugins.wordcount = function () {
            var e = this;
            e.addListener("contentchange", function () {
                e.fireEvent("wordcount");
            });
            var t;
            e.addListener("ready", function () {
                var e = this;
                domUtils.on(e.body, "keyup", function (i) {
                    var n = i.keyCode || i.which, o = {
                        16: 1,
                        18: 1,
                        20: 1,
                        37: 1,
                        38: 1,
                        39: 1,
                        40: 1
                    };
                    n in o || (clearTimeout(t), t = setTimeout(function () {
                        e.fireEvent("wordcount");
                    }, 200));
                });
            });
        }, UE.plugins.dragdrop = function () {
            var e = this;
            e.ready(function () {
                domUtils.on(this.body, "dragend", function () {
                    var t = e.selection.getRange(), i = t.getClosedNode() || e.selection.getStart();
                    if (i && "IMG" == i.tagName) {
                        for (var n, o = i.previousSibling; (n = i.nextSibling) && 1 == n.nodeType && "SPAN" == n.tagName && !n.firstChild;)domUtils.remove(n);
                        (!o || 1 != o.nodeType || domUtils.isEmptyBlock(o)) && o || n && (!n || domUtils.isEmptyBlock(n)) || (o && "P" == o.tagName && !domUtils.isEmptyBlock(o) ? (o.appendChild(i),
                            domUtils.moveChild(n, o), domUtils.remove(n)) : n && "P" == n.tagName && !domUtils.isEmptyBlock(n) && n.insertBefore(i, n.firstChild),
                        o && "P" == o.tagName && domUtils.isEmptyBlock(o) && domUtils.remove(o), n && "P" == n.tagName && domUtils.isEmptyBlock(n) && domUtils.remove(n),
                            t.selectNode(i).select(), e.fireEvent("saveScene"));
                    }
                });
            });
        }, UE.plugins.undo = function () {
            function e(e, t) {
                if (e.length != t.length)return 0;
                for (var i = 0, n = e.length; n > i; i++)if (e[i] != t[i])return 0;
                return 1;
            }

            function t(t, i) {
                return t.collapsed != i.collapsed ? 0 : e(t.startAddress, i.startAddress) && e(t.endAddress, i.endAddress) ? 1 : 0;
            }

            function i() {
                this.list = [], this.index = 0, this.hasUndo = !1, this.hasRedo = !1, this.undo = function () {
                    if (this.hasUndo) {
                        if (!this.list[this.index - 1] && 1 == this.list.length)return void this.reset();
                        for (; this.list[this.index].content == this.list[this.index - 1].content;)if (this.index--,
                            0 == this.index)return this.restore(0);
                        this.restore(--this.index);
                    }
                }, this.redo = function () {
                    if (this.hasRedo) {
                        for (; this.list[this.index].content == this.list[this.index + 1].content;)if (this.index++,
                            this.index == this.list.length - 1)return this.restore(this.index);
                        this.restore(++this.index);
                    }
                }, this.restore = function () {
                    var e = this.editor, t = this.list[this.index], i = UE.htmlparser(t.content.replace(l, ""));
                    e.options.autoClearEmptyNode = !1, e.filterInputRule(i), e.options.autoClearEmptyNode = c,
                        e.document.body.innerHTML = i.toHtml(), e.fireEvent("afterscencerestore"), browser.ie && utils.each(domUtils.getElementsByTagName(e.document, "td th caption p"), function (t) {
                        domUtils.isEmptyNode(t) && domUtils.fillNode(e.document, t);
                    });
                    try {
                        var n = new dom.Range(e.document).moveToAddress(t.address);
                        n.select(d[n.startContainer.nodeName.toLowerCase()]);
                    } catch (o) {
                    }
                    this.editor.common_popup.hide(), this.update(), this.clearKey(), e.fireEvent("reset", !0);
                }, this.getScene = function () {
                    var e = this.editor, t = e.selection.getRange(), i = t.createAddress(!1, !0);
                    e.fireEvent("beforegetscene");
                    var n = UE.htmlparser(e.body.innerHTML);
                    e.options.autoClearEmptyNode = !1, e.filterOutputRule(n), e.options.autoClearEmptyNode = c;
                    var o = n.toHtml();
                    return e.fireEvent("aftergetscene"), {
                        address: i,
                        content: o
                    };
                }, this.save = function (e, i) {
                    clearTimeout(o);
                    var n = this.getScene(i), r = this.list[this.index];
                    r && r.content == n.content && (e ? 1 : t(r.address, n.address)) || (this.list = this.list.slice(0, this.index + 1),
                        this.list.push(n), this.list.length > s && this.list.shift(), this.index = this.list.length - 1,
                        this.clearKey(), this.update());
                }, this.update = function () {
                    this.hasRedo = !!this.list[this.index + 1], this.hasUndo = !!this.list[this.index - 1];
                }, this.reset = function () {
                    this.list = [], this.index = 0, this.hasUndo = !1, this.hasRedo = !1, this.clearKey(), this.editor.common_popup.hide();
                }, this.clearKey = function () {
                    f = 0, u = null;
                };
            }

            function n() {
                this.undoManger.save();
            }

            var o, r = this, s = r.options.maxUndoCount || 20, a = r.options.maxInputCount || 20, l = new RegExp(domUtils.fillChar + "|</hr>", "gi"), d = {
                ol: 1,
                ul: 1,
                table: 1,
                tbody: 1,
                tr: 1,
                body: 1
            }, c = r.options.autoClearEmptyNode;
            r.undoManger = new i, r.undoManger.editor = r, r.addListener("saveScene", function () {
                var e = Array.prototype.splice.call(arguments, 1);
                this.undoManger.save.apply(this.undoManger, e);
            }), r.addListener("beforeexeccommand", n), r.addListener("afterexeccommand", n), r.addListener("reset", function (e, t) {
                t || this.undoManger.reset();
            }), r.commands.redo = r.commands.undo = {
                execCommand: function (e) {
                    this.undoManger[e]();
                },
                queryCommandState: function (e) {
                    return this.undoManger["has" + ("undo" == e.toLowerCase() ? "Undo" : "Redo")] ? 0 : -1;
                },
                notNeedUndo: 1
            };
            var u, m = {
                16: 1,
                17: 1,
                18: 1,
                37: 1,
                38: 1,
                39: 1,
                40: 1
            }, f = 0, h = !1;
            r.addListener("ready", function () {
                domUtils.on(this.body, "compositionstart", function () {
                    h = !0;
                }), domUtils.on(this.body, "compositionend", function () {
                    h = !1;
                });
            }), r.addshortcutkey({
                Undo: "ctrl+90",
                Redo: "ctrl+89"
            });
            var p = !0;
            r.addListener("keydown", function (e, t) {
                function i(e) {
                    e.selection.getRange().collapsed && e.fireEvent("contentchange"), e.undoManger.save(!1, !0),
                        e.fireEvent("selectionchange");
                }

                var n = this, r = t.keyCode || t.which;
                if (!(m[r] || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey)) {
                    if (h)return;
                    if (!n.selection.getRange().collapsed)return n.undoManger.save(!1, !0), void(p = !1);
                    0 == n.undoManger.list.length && n.undoManger.save(!0), clearTimeout(o), o = setTimeout(function () {
                        if (h)var e = setInterval(function () {
                            h || (i(n), clearInterval(e));
                        }, 300); else i(n);
                    }, 200), u = r, f++, f >= a && i(n);
                }
            }), r.addListener("keyup", function (e, t) {
                var i = t.keyCode || t.which;
                if (!(m[i] || t.ctrlKey || t.metaKey || t.shiftKey || t.altKey)) {
                    if (h)return;
                    p || (this.undoManger.save(!1, !0), p = !0);
                }
            });
        }, UE.plugins.paste = function () {
            function e(e) {
                var t = this.document;
                if (!t.getElementById("baidu_pastebin")) {
                    var i = this.selection.getRange(), n = i.createBookmark(), o = t.createElement("div");
                    o.id = "baidu_pastebin", browser.webkit && o.appendChild(t.createTextNode(domUtils.fillChar + domUtils.fillChar)),
                        t.body.appendChild(o), n.start.style.display = "", o.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" + domUtils.getXY(n.start).y + "px",
                        i.selectNodeContents(o).select(!0), setTimeout(function () {
                        if (browser.webkit)for (var r, s = 0, a = t.querySelectorAll("#baidu_pastebin"); r = a[s++];) {
                            if (!domUtils.isEmptyNode(r)) {
                                o = r;
                                break;
                            }
                            domUtils.remove(r);
                        }
                        try {
                            o.parentNode.removeChild(o);
                        } catch (l) {
                        }
                        i.moveToBookmark(n).select(!0), e(o);
                    }, 0);
                }
            }

            function t(e) {
                var t, s;
                if (e.firstChild) {
                    for (var a, l = domUtils.getElementsByTagName(e, "span"), d = 0; a = l[d++];)("_baidu_cut_start" == a.id || "_baidu_cut_end" == a.id) && domUtils.remove(a);
                    if (browser.webkit) {
                        for (var c, u = e.querySelectorAll("div br"), d = 0; c = u[d++];) {
                            var m = c.parentNode;
                            "DIV" == m.tagName && 1 == m.childNodes.length && (m.innerHTML = "<p><br/></p>", domUtils.remove(m));
                        }
                        for (var f, h = e.querySelectorAll("#baidu_pastebin"), d = 0; f = h[d++];) {
                            var p = r.document.createElement("p");
                            for (f.parentNode.insertBefore(p, f); f.firstChild;)p.appendChild(f.firstChild);
                            domUtils.remove(f);
                        }
                        for (var g, v = e.querySelectorAll("meta"), d = 0; g = v[d++];)domUtils.remove(g);
                        var u = e.querySelectorAll("br");
                        for (d = 0; g = u[d++];)/^apple-/i.test(g.className) && domUtils.remove(g);
                    }
                    if (browser.gecko) {
                        var b = e.querySelectorAll("[_moz_dirty]");
                        for (d = 0; g = b[d++];)g.removeAttribute("_moz_dirty");
                    }
                    if (!browser.ie)for (var g, y = e.querySelectorAll("span.Apple-style-span"), d = 0; g = y[d++];)domUtils.remove(g, !0);
                    t = e.innerHTML, t = UE.filterWord(t);
                    var C = UE.htmlparser(t);
                    if (r.options.filterRules && UE.filterNode(C, r.options.filterRules), r.filterInputRule(C),
                            browser.webkit) {
                        var N = C.lastChild();
                        N && "element" == N.type && "br" == N.tagName && C.removeChild(N), utils.each(r.body.querySelectorAll("div"), function (e) {
                            domUtils.isEmptyBlock(e) && domUtils.remove(e);
                        });
                    }
                    if (t = {
                            html: C.toHtml()
                        }, r.fireEvent("beforepaste", t, C), !t.html)return;
                    C = UE.htmlparser(t.html, !0), 1 === r.queryCommandState("pasteplain") ? s = r.execCommand("insertHtml", UE.filterNode(C, r.options.filterTxtRules).toHtml(), !0) : (UE.filterNode(C, r.options.filterTxtRules),
                        i = C.toHtml(), n = t.html, o = r.selection.getRange().createAddress(!0), s = r.execCommand("insertHtml", n, !0)),
                        r.fireEvent("funcPvUvReport", "paste"), r.fireEvent("afterpaste", t, s);
                }
            }

            var i, n, o, r = this;
            r.addListener("pasteTransfer", function (e, t) {
                if (o && i && n && i != n) {
                    var s = r.selection.getRange();
                    if (s.moveToAddress(o, !0), !s.collapsed) {
                        for (; !domUtils.isBody(s.startContainer);) {
                            var a = s.startContainer;
                            if (1 == a.nodeType) {
                                if (a = a.childNodes[s.startOffset], !a) {
                                    s.setStartBefore(s.startContainer);
                                    continue;
                                }
                                var l = a.previousSibling;
                                l && 3 == l.nodeType && new RegExp("^[\n\r	 " + domUtils.fillChar + "]*$").test(l.nodeValue) && s.setStartBefore(l);
                            }
                            if (0 != s.startOffset)break;
                            s.setStartBefore(s.startContainer);
                        }
                        for (; !domUtils.isBody(s.endContainer);) {
                            var d = s.endContainer;
                            if (1 == d.nodeType) {
                                if (d = d.childNodes[s.endOffset], !d) {
                                    s.setEndAfter(s.endContainer);
                                    continue;
                                }
                                var c = d.nextSibling;
                                c && 3 == c.nodeType && new RegExp("^[\n\r	" + domUtils.fillChar + "]*$").test(c.nodeValue) && s.setEndAfter(c);
                            }
                            if (s.endOffset != s.endContainer[3 == s.endContainer.nodeType ? "nodeValue" : "childNodes"].length)break;
                            s.setEndAfter(s.endContainer);
                        }
                    }
                    s.deleteContents(), s.select(!0), r.__hasEnterExecCommand = !0;
                    var u = n;
                    2 === t ? u = u.replace(/<(\/?)([\w\-]+)([^>]*)>/gi, function (e, t, i, n) {
                        return i = i.toLowerCase(), {
                            img: 1
                        }[i] ? e : (n = n.replace(/([\w\-]*?)\s*=\s*(("([^"]*)")|('([^']*)')|([^\s>]+))/gi, function (e, t, i) {
                            return {
                                src: 1,
                                href: 1,
                                name: 1
                            }[t.toLowerCase()] ? t + "=" + i + " " : "";
                        }), {
                            span: 1,
                            div: 1
                        }[i] ? "" : "<" + t + i + " " + utils.trim(n) + ">");
                    }) : t && (u = i), r.execCommand("inserthtml", u, !0), r.__hasEnterExecCommand = !1;
                    for (var m = r.selection.getRange(); !domUtils.isBody(m.startContainer) && !m.startOffset && m.startContainer[3 == m.startContainer.nodeType ? "nodeValue" : "childNodes"].length;)m.setStartBefore(m.startContainer);
                    var f = m.createAddress(!0);
                    o.endAddress = f.startAddress;
                }
            }), r.addListener("ready", function () {
                domUtils.on(r.body, "cut", function () {
                    var e = r.selection.getRange();
                    !e.collapsed && r.undoManger && r.undoManger.save();
                }), domUtils.on(r.body, browser.ie || browser.opera ? "keydown" : "paste", function (i) {
                    (!browser.ie && !browser.opera || (i.ctrlKey || i.metaKey) && "86" == i.keyCode) && e.call(r, function (e) {
                        t(e);
                    });
                });
            });
        }, UE.plugins.list = function () {
            function e(e) {
                var t = [];
                for (var i in e)t.push(i);
                return t;
            }

            function t(e) {
                var t = e.className;
                return domUtils.hasClass(e, /custom_/) ? t.match(/custom_(\w+)/)[1] : domUtils.getStyle(e, "list-style-type");
            }

            function i(e, i) {
                utils.each(domUtils.getElementsByTagName(e, "ol ul"), function (r) {
                    if (domUtils.inDoc(r, e)) {
                        var s = r.parentNode;
                        if (s.tagName == r.tagName) {
                            var a = t(r) || ("OL" == r.tagName ? "decimal" : "disc"), l = t(s) || ("OL" == s.tagName ? "decimal" : "disc");
                            if (a == l) {
                                var u = utils.indexOf(c[r.tagName], a);
                                u = u + 1 == c[r.tagName].length ? 0 : u + 1, o(r, c[r.tagName][u]);
                            }
                        }
                        var m = 0, f = 2;
                        domUtils.hasClass(r, /custom_/) ? /[ou]l/i.test(s.tagName) && domUtils.hasClass(s, /custom_/) || (f = 1) : /[ou]l/i.test(s.tagName) && domUtils.hasClass(s, /custom_/) && (f = 3);
                        var h = domUtils.getStyle(r, "list-style-type");
                        h && (r.style.cssText = "list-style-type:" + h), r.className = utils.trim(r.className.replace(/list-paddingleft-\w+/, "")) + " list-paddingleft-" + f,
                            utils.each(domUtils.getElementsByTagName(r, "li"), function (e) {
                                if (e.style.cssText && (e.style.cssText = ""), !e.firstChild)return void domUtils.remove(e);
                                if (e.parentNode === r) {
                                    if (m++, domUtils.hasClass(r, /custom_/)) {
                                        var i = 1, n = t(r);
                                        if ("OL" == r.tagName) {
                                            if (n)switch (n) {
                                                case"cn":
                                                case"cn1":
                                                case"cn2":
                                                    m > 10 && (m % 10 == 0 || m > 10 && 20 > m) ? i = 2 : m > 20 && (i = 3);
                                                    break;

                                                case"num2":
                                                    m > 9 && (i = 2);
                                            }
                                            e.className = "list-" + d[n] + m + " list-" + n + "-paddingleft-" + i;
                                        } else e.className = "list-" + d[n] + " list-" + n + "-paddingleft";
                                    } else e.className = e.className.replace(/list-[\w\-]+/gi, "");
                                    var o = e.getAttribute("class");
                                    null === o || o.replace(/\s/g, "") || domUtils.removeAttributes(e, "class");
                                }
                            }), !i && n(r, r.tagName.toLowerCase(), t(r) || domUtils.getStyle(r, "list-style-type"), !0);
                    }
                });
            }

            function n(e, n, o, r) {
                var s = e.nextSibling;
                s && 1 == s.nodeType && s.tagName.toLowerCase() == n && (t(s) || domUtils.getStyle(s, "list-style-type") || ("ol" == n ? "decimal" : "disc")) == o && (domUtils.moveChild(s, e),
                0 == s.childNodes.length && domUtils.remove(s)), s && domUtils.isFillChar(s) && domUtils.remove(s);
                var a = e.previousSibling;
                a && 1 == a.nodeType && a.tagName.toLowerCase() == n && (t(a) || domUtils.getStyle(a, "list-style-type") || ("ol" == n ? "decimal" : "disc")) == o && domUtils.moveChild(e, a),
                a && domUtils.isFillChar(a) && domUtils.remove(a), !r && domUtils.isEmptyBlock(e) && domUtils.remove(e),
                t(e) && i(e.ownerDocument, !0);
            }

            function o(e, t) {
                d[t] && (e.className = "custom_" + t);
                try {
                    domUtils.setStyle(e, "list-style-type", t);
                } catch (i) {
                }
            }

            function r(e) {
                var t = e.previousSibling;
                t && domUtils.isEmptyBlock(t) && domUtils.remove(t), t = e.nextSibling, t && domUtils.isEmptyBlock(t) && domUtils.remove(t);
            }

            function s(e) {
                for (; e && !domUtils.isBody(e);) {
                    if ("TABLE" == e.nodeName)return null;
                    if ("LI" == e.nodeName)return e;
                    e = e.parentNode;
                }
            }

            var a = this, l = {
                TD: 1,
                PRE: 1,
                BLOCKQUOTE: 1
            }, d = {
                cn: "cn-1-",
                cn1: "cn-2-",
                cn2: "cn-3-",
                num: "num-1-",
                num1: "num-2-",
                num2: "num-3-",
                dash: "dash",
                dot: "dot"
            };
            a.setOpt({
                insertorderedlist: {
                    decimal: "",
                    "lower-alpha": "",
                    "lower-roman": "",
                    "upper-alpha": "",
                    "upper-roman": ""
                },
                insertunorderedlist: {
                    circle: "",
                    disc: "",
                    square: ""
                },
                listDefaultPaddingLeft: "30",
                listiconpath: "http://bs.baidu.com/listicon/",
                maxListLevel: -1
            });
            var c = {
                OL: e(a.options.insertorderedlist),
                UL: e(a.options.insertunorderedlist)
            }, u = a.options.listiconpath;
            for (var m in d)a.options.insertorderedlist.hasOwnProperty(m) || a.options.insertunorderedlist.hasOwnProperty(m) || delete d[m];
            a.ready(function () {
                var e = [];
                for (var t in d) {
                    if ("dash" == t || "dot" == t)e.push("li.list-" + d[t] + "{background-image:url(" + u + d[t] + ".gif)}"),
                        e.push("ul.custom_" + t + "{list-style:none;}ul.custom_" + t + " li{background-position:0 3px;background-repeat:no-repeat}"); else {
                        for (var i = 0; 99 > i; i++)e.push("li.list-" + d[t] + i + "{background-image:url(" + u + "list-" + d[t] + i + ".gif)}");
                        e.push("ol.custom_" + t + "{list-style:none;}ol.custom_" + t + " li{background-position:0 3px;background-repeat:no-repeat}");
                    }
                    switch (t) {
                        case"cn":
                            e.push("li.list-" + t + "-paddingleft-1{padding-left:25px}"), e.push("li.list-" + t + "-paddingleft-2{padding-left:40px}"),
                                e.push("li.list-" + t + "-paddingleft-3{padding-left:55px}");
                            break;

                        case"cn1":
                            e.push("li.list-" + t + "-paddingleft-1{padding-left:30px}"), e.push("li.list-" + t + "-paddingleft-2{padding-left:40px}"),
                                e.push("li.list-" + t + "-paddingleft-3{padding-left:55px}");
                            break;

                        case"cn2":
                            e.push("li.list-" + t + "-paddingleft-1{padding-left:40px}"), e.push("li.list-" + t + "-paddingleft-2{padding-left:55px}"),
                                e.push("li.list-" + t + "-paddingleft-3{padding-left:68px}");
                            break;

                        case"num":
                        case"num1":
                            e.push("li.list-" + t + "-paddingleft-1{padding-left:25px}");
                            break;

                        case"num2":
                            e.push("li.list-" + t + "-paddingleft-1{padding-left:35px}"), e.push("li.list-" + t + "-paddingleft-2{padding-left:40px}");
                            break;

                        case"dash":
                            e.push("li.list-" + t + "-paddingleft{padding-left:35px}");
                            break;

                        case"dot":
                            e.push("li.list-" + t + "-paddingleft{padding-left:20px}");
                    }
                }
                e.push(".list-paddingleft-1{padding-left:0}"), e.push(".list-paddingleft-2{padding-left:" + a.options.listDefaultPaddingLeft + "px}"),
                    e.push(".list-paddingleft-3{padding-left:" + 2 * a.options.listDefaultPaddingLeft + "px}"),
                    utils.cssRule("list", "ol,ul{margin:0;padding:0;" + (browser.ie || browser.gecko && browser.version >= 11e4 ? "" : "width:95%") + "}li{clear:both;}" + e.join("\n"), a.document);
            }), a.ready(function () {
                domUtils.on(a.body, "cut", function () {
                    setTimeout(function () {
                        var e, t = a.selection.getRange();
                        if (!t.collapsed && (e = domUtils.findParentByTagName(t.startContainer, "li", !0)) && !e.nextSibling && domUtils.isEmptyBlock(e)) {
                            var i, n = e.parentNode;
                            if (i = n.previousSibling)domUtils.remove(n), t.setStartAtLast(i).collapse(!0), t.select(!0); else if (i = n.nextSibling)domUtils.remove(n),
                                t.setStartAtFirst(i).collapse(!0), t.select(!0); else {
                                var o = a.document.createElement("p");
                                domUtils.fillNode(a.document, o), n.parentNode.insertBefore(o, n), domUtils.remove(n),
                                    t.setStart(o, 0).collapse(!0), t.select(!0);
                            }
                        }
                    });
                });
            }), a.addListener("beforepaste", function (e, i) {
                var n, o = this, r = o.selection.getRange(), s = UE.htmlparser(i.html, !0);
                if (n = domUtils.findParentByTagName(r.startContainer, "li", !0)) {
                    var a = n.parentNode, l = "OL" == a.tagName ? "ul" : "ol";
                    utils.each(s.getNodesByTagName(l), function (i) {
                        if (i.tagName = a.tagName, i.setAttr(), i.parentNode === s)e = t(a) || ("OL" == a.tagName ? "decimal" : "disc"); else {
                            var n = i.parentNode.getAttr("class");
                            e = n && /custom_/.test(n) ? n.match(/custom_(\w+)/)[1] : i.parentNode.getStyle("list-style-type"),
                            e || (e = "OL" == a.tagName ? "decimal" : "disc");
                        }
                        var o = utils.indexOf(c[a.tagName], e);
                        i.parentNode !== s && (o = o + 1 == c[a.tagName].length ? 0 : o + 1);
                        var r = c[a.tagName][o];
                        d[r] ? i.setAttr("class", "custom_" + r) : i.setStyle("list-style-type", r);
                    });
                }
                i.html = s.toHtml();
            }), a.addInputRule(function (e) {
                function t(e, t) {
                    var o = t.firstChild();
                    if (o && "element" == o.type && "span" == o.tagName && /Wingdings|Symbol/.test(o.getStyle("font-family"))) {
                        for (var r in n)if (n[r] == o.data)return r;
                        return "disc";
                    }
                    for (var r in i)if (i[r].test(e))return r;
                }

                utils.each(e.getNodesByTagName("li"), function (e) {
                    for (var t, i = UE.uNode.createElement("p"), n = 0; t = e.children[n];)"text" == t.type || dtd.p[t.tagName] ? i.appendChild(t) : i.firstChild() ? (e.insertBefore(i, t),
                        i = UE.uNode.createElement("p"), n += 2) : n++;
                    (i.firstChild() && !i.parentNode || !e.firstChild()) && e.appendChild(i), i.firstChild() || i.innerHTML(browser.ie ? "&nbsp;" : "<br/>");
                    var o = e.firstChild(), r = o.lastChild();
                    r && "text" == r.type && /^\s*$/.test(r.data) && o.removeChild(r);
                });
                var i = {
                    num1: /^\d+\)/,
                    decimal: /^\d+\./,
                    "lower-alpha": /^[a-z]+\)/,
                    "upper-alpha": /^[A-Z]+\./,
                    cn: /^[\u4E00\u4E8C\u4E09\u56DB\u516d\u4e94\u4e03\u516b\u4e5d]+[\u3001]/,
                    cn2: /^\([\u4E00\u4E8C\u4E09\u56DB\u516d\u4e94\u4e03\u516b\u4e5d]+\)/
                }, n = {
                    square: "n"
                };
                utils.each(e.getNodesByTagName("p"), function (e) {
                    function n(e, t, n) {
                        if ("ol" == e.tagName)if (browser.ie) {
                            var o = t.firstChild();
                            "element" == o.type && "span" == o.tagName && i[n].test(o.innerText()) && t.removeChild(o);
                        } else t.innerHTML(t.innerHTML().replace(i[n], "")); else t.removeChild(t.firstChild());
                        var r = UE.uNode.createElement("li");
                        r.appendChild(t), e.appendChild(r);
                    }

                    if ("MsoListParagraph" == e.getAttr("class")) {
                        e.setStyle("margin", ""), e.setStyle("margin-left", ""), e.setAttr("class", "");
                        var o, r = e, s = e;
                        if ("li" != e.parentNode.tagName && (o = t(e.innerText(), e))) {
                            var l = UE.uNode.createElement(a.options.insertorderedlist.hasOwnProperty(o) ? "ol" : "ul");
                            for (d[o] ? l.setAttr("class", "custom_" + o) : l.setStyle("list-style-type", o); e && "li" != e.parentNode.tagName && t(e.innerText(), e);)r = e.nextSibling(),
                            r || e.parentNode.insertBefore(l, e), n(l, e, o), e = r;
                            !l.parentNode && e && e.parentNode && e.parentNode.insertBefore(l, e);
                        }
                        var c = s.firstChild();
                        c && "element" == c.type && "span" == c.tagName && /^\s*(&nbsp;)+\s*$/.test(c.innerText()) && c.parentNode.removeChild(c);
                    }
                });
            }), a.addListener("contentchange", function () {
                i(a.document);
            }), a.addListener("keydown", function (e, t) {
                function i() {
                    t.preventDefault ? t.preventDefault() : t.returnValue = !1, a.fireEvent("contentchange"),
                    a.undoManger && a.undoManger.save();
                }

                function n(e, t) {
                    for (; e && !domUtils.isBody(e);) {
                        if (t(e))return null;
                        if (1 == e.nodeType && /[ou]l/i.test(e.tagName))return e;
                        e = e.parentNode;
                    }
                    return null;
                }

                var o = t.keyCode || t.which;
                if (13 == o && !t.shiftKey) {
                    var s = a.selection.getRange(), l = domUtils.findParent(s.startContainer, function (e) {
                        return domUtils.isBlockElm(e);
                    }, !0), d = domUtils.findParentByTagName(s.startContainer, "li", !0);
                    if (l && "PRE" != l.tagName && !d) {
                        var c = l.innerHTML.replace(new RegExp(domUtils.fillChar, "g"), "");
                        /^\s*1\s*\.[^\d]/.test(c) && (l.innerHTML = c.replace(/^\s*1\s*\./, ""), s.setStartAtLast(l).collapse(!0).select(),
                            a.__hasEnterExecCommand = !0, a.execCommand("insertorderedlist"), a.__hasEnterExecCommand = !1);
                    }
                    var u = a.selection.getRange(), m = n(u.startContainer, function (e) {
                        return "TABLE" == e.tagName;
                    }), f = u.collapsed ? m : n(u.endContainer, function (e) {
                        return "TABLE" == e.tagName;
                    });
                    if (m && f && m === f) {
                        if (!u.collapsed) {
                            if (m = domUtils.findParentByTagName(u.startContainer, "li", !0), f = domUtils.findParentByTagName(u.endContainer, "li", !0),
                                !m || !f || m !== f) {
                                var h = u.cloneRange(), p = h.collapse(!1).createBookmark();
                                u.deleteContents(), h.moveToBookmark(p);
                                var d = domUtils.findParentByTagName(h.startContainer, "li", !0);
                                return r(d), h.select(), void i();
                            }
                            if (u.deleteContents(), d = domUtils.findParentByTagName(u.startContainer, "li", !0), d && domUtils.isEmptyBlock(d))return N = d.previousSibling,
                                next = d.nextSibling, b = a.document.createElement("p"), domUtils.fillNode(a.document, b),
                                g = d.parentNode, N && next ? (u.setStart(next, 0).collapse(!0).select(!0), domUtils.remove(d)) : ((N || next) && N ? d.parentNode.parentNode.insertBefore(b, g.nextSibling) : g.parentNode.insertBefore(b, g),
                                domUtils.remove(d), g.firstChild || domUtils.remove(g), u.setStart(b, 0).setCursor()),
                                void i();
                        }
                        if (d = domUtils.findParentByTagName(u.startContainer, "li", !0)) {
                            if (domUtils.isEmptyBlock(d)) {
                                p = u.createBookmark();
                                var g = d.parentNode;
                                if (d !== g.lastChild ? (domUtils.breakParent(d, g), r(d)) : (g.parentNode.insertBefore(d, g.nextSibling),
                                    domUtils.isEmptyNode(g) && domUtils.remove(g)), !dtd.$list[d.parentNode.tagName])if (domUtils.isBlockElm(d.firstChild))domUtils.remove(d, !0); else {
                                    for (b = a.document.createElement("p"), d.parentNode.insertBefore(b, d); d.firstChild;)b.appendChild(d.firstChild);
                                    domUtils.remove(d);
                                }
                                u.moveToBookmark(p).select();
                            } else {
                                var v = d.firstChild;
                                if (!v || !domUtils.isBlockElm(v)) {
                                    var b = a.document.createElement("p");
                                    for (!d.firstChild && domUtils.fillNode(a.document, b); d.firstChild;)b.appendChild(d.firstChild);
                                    d.appendChild(b), v = b;
                                }
                                var y = a.document.createElement("span");
                                u.insertNode(y), domUtils.breakParent(y, d);
                                var C = y.nextSibling;
                                v = C.firstChild, v || (b = a.document.createElement("p"), domUtils.fillNode(a.document, b),
                                    C.appendChild(b), v = b), domUtils.isEmptyNode(v) && (v.innerHTML = "", domUtils.fillNode(a.document, v)),
                                    u.setStart(v, 0).collapse(!0).shrinkBoundary().select(), domUtils.remove(y);
                                var N = C.previousSibling;
                                N && domUtils.isEmptyBlock(N) && (N.innerHTML = "<p></p>", domUtils.fillNode(a.document, N.firstChild));
                            }
                            i();
                        }
                    }
                }
                if (8 == o && (u = a.selection.getRange(), u.collapsed && domUtils.isStartInblock(u) && (h = u.cloneRange().trimBoundary(),
                        d = domUtils.findParentByTagName(u.startContainer, "li", !0), d && domUtils.isStartInblock(h)))) {
                    if (m = domUtils.findParentByTagName(u.startContainer, "p", !0), m && m !== d.firstChild) {
                        var g = domUtils.findParentByTagName(m, ["ol", "ul"]);
                        return domUtils.breakParent(m, g), r(m), a.fireEvent("contentchange"), u.setStart(m, 0).setCursor(!1, !0),
                            a.fireEvent("saveScene"), void domUtils.preventDefault(t);
                    }
                    if (d && (N = d.previousSibling)) {
                        if (46 == o && d.childNodes.length)return;
                        if (dtd.$list[N.tagName] && (N = N.lastChild), a.undoManger && a.undoManger.save(), v = d.firstChild,
                                domUtils.isBlockElm(v))if (domUtils.isEmptyNode(v))for (N.appendChild(v), u.setStart(v, 0).setCursor(!1, !0); d.firstChild;)N.appendChild(d.firstChild); else y = a.document.createElement("span"),
                            u.insertNode(y), domUtils.isEmptyBlock(N) && (N.innerHTML = ""), domUtils.moveChild(d, N),
                            u.setStartBefore(y).collapse(!0).select(!0), domUtils.remove(y); else if (domUtils.isEmptyNode(d)) {
                            var b = a.document.createElement("p");
                            N.appendChild(b), u.setStart(b, 0).setCursor();
                        } else for (u.setEnd(N, N.childNodes.length).collapse().select(!0); d.firstChild;)N.appendChild(d.firstChild);
                        return domUtils.remove(d), a.fireEvent("contentchange"), a.fireEvent("saveScene"),
                            void domUtils.preventDefault(t);
                    }
                    if (d && !d.previousSibling) {
                        var g = d.parentNode, p = u.createBookmark();
                        if (domUtils.isTagNode(g.parentNode, "ol ul"))g.parentNode.insertBefore(d, g), domUtils.isEmptyNode(g) && domUtils.remove(g); else {
                            for (; d.firstChild;)g.parentNode.insertBefore(d.firstChild, g);
                            domUtils.remove(d), domUtils.isEmptyNode(g) && domUtils.remove(g);
                        }
                        return u.moveToBookmark(p).setCursor(!1, !0), a.fireEvent("contentchange"), a.fireEvent("saveScene"),
                            void domUtils.preventDefault(t);
                    }
                }
            }), a.addListener("keyup", function (e, i) {
                var o = i.keyCode || i.which;
                if (8 == o) {
                    var r, s = a.selection.getRange();
                    (r = domUtils.findParentByTagName(s.startContainer, ["ol", "ul"], !0)) && n(r, r.tagName.toLowerCase(), t(r) || domUtils.getComputedStyle(r, "list-style-type"), !0);
                }
            }), a.addListener("tabkeydown", function () {
                function e(e) {
                    if (-1 != a.options.maxListLevel) {
                        for (var t = e.parentNode, i = 0; /[ou]l/i.test(t.tagName);)i++, t = t.parentNode;
                        if (i >= a.options.maxListLevel)return !0;
                    }
                }

                var i = a.selection.getRange(), r = domUtils.findParentByTagName(i.startContainer, "li", !0);
                if (r) {
                    var s;
                    if (!i.collapsed) {
                        a.fireEvent("saveScene"), s = i.createBookmark();
                        for (var l, d, u = 0, m = domUtils.findParents(r); d = m[u++];)if (domUtils.isTagNode(d, "ol ul")) {
                            l = d;
                            break;
                        }
                        var f = r;
                        if (s.end)for (; f && !(domUtils.getPosition(f, s.end) & domUtils.POSITION_FOLLOWING);)if (e(f))f = domUtils.getNextDomNode(f, !1, null, function (e) {
                            return e !== l;
                        }); else {
                            var h = f.parentNode, p = a.document.createElement(h.tagName), g = utils.indexOf(c[p.tagName], t(h) || domUtils.getComputedStyle(h, "list-style-type")), v = g + 1 == c[p.tagName].length ? 0 : g + 1, b = c[p.tagName][v];
                            for (o(p, b), h.insertBefore(p, f); f && !(domUtils.getPosition(f, s.end) & domUtils.POSITION_FOLLOWING);) {
                                if (r = f.nextSibling, p.appendChild(f), !r || domUtils.isTagNode(r, "ol ul")) {
                                    if (r)for (; (r = r.firstChild) && "LI" != r.tagName;); else r = domUtils.getNextDomNode(f, !1, null, function (e) {
                                        return e !== l;
                                    });
                                    break;
                                }
                                f = r;
                            }
                            n(p, p.tagName.toLowerCase(), b), f = r;
                        }
                        return a.fireEvent("contentchange"), i.moveToBookmark(s).select(), !0;
                    }
                    if (e(r))return !0;
                    var h = r.parentNode, p = a.document.createElement(h.tagName), g = utils.indexOf(c[p.tagName], t(h) || domUtils.getComputedStyle(h, "list-style-type"));
                    g = g + 1 == c[p.tagName].length ? 0 : g + 1;
                    var b = c[p.tagName][g];
                    if (o(p, b), domUtils.isStartInblock(i))return a.fireEvent("saveScene"), s = i.createBookmark(),
                        h.insertBefore(p, r), p.appendChild(r), n(p, p.tagName.toLowerCase(), b), a.fireEvent("contentchange"),
                        i.moveToBookmark(s).select(!0), !0;
                }
            }), a.commands.insertorderedlist = a.commands.insertunorderedlist = {
                execCommand: function (e, i) {
                    i || (i = "insertorderedlist" == e.toLowerCase() ? "decimal" : "disc");
                    var r = this, a = this.selection.getRange(), d = function (e) {
                        return 1 == e.nodeType ? "br" != e.tagName.toLowerCase() : !domUtils.isWhitespace(e);
                    }, c = "insertorderedlist" == e.toLowerCase() ? "ol" : "ul", u = r.document.createDocumentFragment();
                    a.adjustmentBoundary().shrinkBoundary();
                    var m, f, h, p, g = a.createBookmark(!0), v = s(r.document.getElementById(g.start)), b = 0, y = s(r.document.getElementById(g.end)), C = 0;
                    if (v || y) {
                        if (v && (m = v.parentNode), g.end || (y = v), y && (f = y.parentNode), m === f) {
                            for (; v !== y;) {
                                if (p = v, v = v.nextSibling, !domUtils.isBlockElm(p.firstChild)) {
                                    for (var N = r.document.createElement("p"); p.firstChild;)N.appendChild(p.firstChild);
                                    p.appendChild(N);
                                }
                                u.appendChild(p);
                            }
                            if (p = r.document.createElement("span"), m.insertBefore(p, y), !domUtils.isBlockElm(y.firstChild)) {
                                for (N = r.document.createElement("p"); y.firstChild;)N.appendChild(y.firstChild);
                                y.appendChild(N);
                            }
                            u.appendChild(y), domUtils.breakParent(p, m), domUtils.isEmptyNode(p.previousSibling) && domUtils.remove(p.previousSibling),
                            domUtils.isEmptyNode(p.nextSibling) && domUtils.remove(p.nextSibling);
                            var x = t(m) || domUtils.getComputedStyle(m, "list-style-type") || ("insertorderedlist" == e.toLowerCase() ? "decimal" : "disc");
                            if (m.tagName.toLowerCase() == c && x == i) {
                                for (var w, U = 0, E = r.document.createDocumentFragment(); w = u.childNodes[U++];)if (domUtils.isTagNode(w, "ol ul"))utils.each(domUtils.getElementsByTagName(w, "li"), function (e) {
                                    for (; e.firstChild;)E.appendChild(e.firstChild);
                                }); else for (; w.firstChild;)E.appendChild(w.firstChild);
                                p.parentNode.insertBefore(E, p);
                            } else h = r.document.createElement(c), o(h, i), h.appendChild(u), p.parentNode.insertBefore(h, p);
                            return domUtils.remove(p), h && n(h, c, i), void a.moveToBookmark(g).select();
                        }
                        if (v) {
                            for (; v;) {
                                if (p = v.nextSibling, domUtils.isTagNode(v, "ol ul"))u.appendChild(v); else {
                                    for (var T = r.document.createDocumentFragment(), S = 0; v.firstChild;)domUtils.isBlockElm(v.firstChild) && (S = 1),
                                        T.appendChild(v.firstChild);
                                    if (S)u.appendChild(T); else {
                                        var k = r.document.createElement("p");
                                        k.appendChild(T), u.appendChild(k);
                                    }
                                    domUtils.remove(v);
                                }
                                v = p;
                            }
                            m.parentNode.insertBefore(u, m.nextSibling), domUtils.isEmptyNode(m) ? (a.setStartBefore(m),
                                domUtils.remove(m)) : a.setStartAfter(m), b = 1;
                        }
                        if (y && domUtils.inDoc(f, r.document)) {
                            for (v = f.firstChild; v && v !== y;) {
                                if (p = v.nextSibling, domUtils.isTagNode(v, "ol ul"))u.appendChild(v); else {
                                    for (T = r.document.createDocumentFragment(), S = 0; v.firstChild;)domUtils.isBlockElm(v.firstChild) && (S = 1),
                                        T.appendChild(v.firstChild);
                                    S ? u.appendChild(T) : (k = r.document.createElement("p"), k.appendChild(T), u.appendChild(k)),
                                        domUtils.remove(v);
                                }
                                v = p;
                            }
                            var B = domUtils.createElement(r.document, "div", {
                                tmpDiv: 1
                            });
                            domUtils.moveChild(y, B), u.appendChild(B), domUtils.remove(y), f.parentNode.insertBefore(u, f),
                                a.setEndBefore(f), domUtils.isEmptyNode(f) && domUtils.remove(f), C = 1;
                        }
                    }
                    b || a.setStartBefore(r.document.getElementById(g.start)), g.end && !C && a.setEndAfter(r.document.getElementById(g.end)),
                        a.enlarge(!0, function (e) {
                            return l[e.tagName];
                        }), u = r.document.createDocumentFragment();
                    for (var _, I = a.createBookmark(), R = domUtils.getNextDomNode(I.start, !1, d), L = a.cloneRange(), A = domUtils.isBlockElm; R && R !== I.end && domUtils.getPosition(R, I.end) & domUtils.POSITION_PRECEDING;)if (3 == R.nodeType || dtd.li[R.tagName]) {
                        if (1 == R.nodeType && dtd.$list[R.tagName]) {
                            for (; R.firstChild;)u.appendChild(R.firstChild);
                            _ = domUtils.getNextDomNode(R, !1, d), domUtils.remove(R), R = _;
                            continue;
                        }
                        for (_ = R, L.setStartBefore(R); R && R !== I.end && (!A(R) || domUtils.isBookmarkNode(R));)_ = R,
                            R = domUtils.getNextDomNode(R, !1, null, function (e) {
                                return !l[e.tagName];
                            });
                        R && A(R) && (p = domUtils.getNextDomNode(_, !1, d), p && domUtils.isBookmarkNode(p) && (R = domUtils.getNextDomNode(p, !1, d),
                            _ = p)), L.setEndAfter(_), R = domUtils.getNextDomNode(_, !1, d);
                        var D = a.document.createElement("li");
                        if (D.appendChild(L.extractContents()), domUtils.isEmptyNode(D)) {
                            for (var _ = a.document.createElement("p"); D.firstChild;)_.appendChild(D.firstChild);
                            D.appendChild(_);
                        }
                        u.appendChild(D);
                    } else R = domUtils.getNextDomNode(R, !0, d);
                    a.moveToBookmark(I).collapse(!0), h = r.document.createElement(c), o(h, i), h.appendChild(u),
                        a.insertNode(h), n(h, c, i);
                    for (var w, U = 0, P = domUtils.getElementsByTagName(h, "div"); w = P[U++];)w.getAttribute("tmpDiv") && domUtils.remove(w, !0);
                    a.moveToBookmark(g).select();
                },
                queryCommandState: function (e) {
                    for (var t, i = "insertorderedlist" == e.toLowerCase() ? "ol" : "ul", n = this.selection.getStartElementPath(), o = 0; t = n[o++];) {
                        if ("TABLE" == t.nodeName)return 0;
                        if (i == t.nodeName.toLowerCase())return 1;
                    }
                    return 0;
                },
                queryCommandValue: function (e) {
                    for (var i, n, o = "insertorderedlist" == e.toLowerCase() ? "ol" : "ul", r = this.selection.getStartElementPath(), s = 0; n = r[s++];) {
                        if ("TABLE" == n.nodeName) {
                            i = null;
                            break;
                        }
                        if (o == n.nodeName.toLowerCase()) {
                            i = n;
                            break;
                        }
                    }
                    return i ? t(i) || domUtils.getComputedStyle(i, "list-style-type") : null;
                }
            };
        }, UE.plugins.enterkey = function () {
            var e, t = this, i = t.options.enterTag;
            t.addListener("keyup", function (i, n) {
                var o = n.keyCode || n.which;
                if (13 == o) {
                    var r, s = t.selection.getRange(), a = s.startContainer;
                    if (browser.ie)t.fireEvent("saveScene", !0, !0); else {
                        if (/h\d/i.test(e)) {
                            if (browser.gecko) {
                                var l = domUtils.findParentByTagName(a, ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "caption", "table"], !0);
                                l || (t.document.execCommand("formatBlock", !1, "<p>"), r = 1);
                            } else if (1 == a.nodeType) {
                                var d, c = t.document.createTextNode("");
                                if (s.insertNode(c), d = domUtils.findParentByTagName(c, "div", !0)) {
                                    for (var u = t.document.createElement("p"); d.firstChild;)u.appendChild(d.firstChild);
                                    d.parentNode.insertBefore(u, d), domUtils.remove(d), s.setStartBefore(c).setCursor(),
                                        r = 1;
                                }
                                domUtils.remove(c);
                            }
                            t.undoManger && r && t.undoManger.save();
                        }
                        browser.opera && s.select();
                    }
                }
            }), t.addListener("keydown", function (n, o) {
                var r = o.keyCode || o.which;
                if (13 == r) {
                    if (t.fireEvent("beforeenterkeydown"))return void domUtils.preventDefault(o);
                    t.fireEvent("saveScene", !0, !0), e = "";
                    var s = t.selection.getRange();
                    if (!s.collapsed) {
                        var a = s.startContainer, l = s.endContainer, d = domUtils.findParentByTagName(a, "td", !0), c = domUtils.findParentByTagName(l, "td", !0);
                        if (d && c && d !== c || !d && c || d && !c)return void(o.preventDefault ? o.preventDefault() : o.returnValue = !1);
                    }
                    if ("p" == i)browser.ie || (a = domUtils.findParentByTagName(s.startContainer, ["ol", "ul", "p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "caption"], !0),
                        a || browser.opera ? (e = a.tagName, "p" == a.tagName.toLowerCase() && browser.gecko && domUtils.removeDirtyAttr(a)) : (t.document.execCommand("formatBlock", !1, "<p>"),
                        browser.gecko && (s = t.selection.getRange(), a = domUtils.findParentByTagName(s.startContainer, "p", !0),
                        a && domUtils.removeDirtyAttr(a)))); else if (o.preventDefault ? o.preventDefault() : o.returnValue = !1,
                            s.collapsed) {
                        m = s.document.createElement("br"), s.insertNode(m);
                        var u = m.parentNode;
                        u.lastChild === m ? (m.parentNode.insertBefore(m.cloneNode(!0), m), s.setStartBefore(m)) : s.setStartAfter(m),
                            s.setCursor();
                    } else if (s.deleteContents(), a = s.startContainer, 1 == a.nodeType && (a = a.childNodes[s.startOffset])) {
                        for (; 1 == a.nodeType;) {
                            if (dtd.$empty[a.tagName])return s.setStartBefore(a).setCursor(), t.undoManger && t.undoManger.save(),
                                !1;
                            if (!a.firstChild) {
                                var m = s.document.createElement("br");
                                return a.appendChild(m), s.setStart(a, 0).setCursor(), t.undoManger && t.undoManger.save(),
                                    !1;
                            }
                            a = a.firstChild;
                        }
                        a === s.startContainer.childNodes[s.startOffset] ? (m = s.document.createElement("br"),
                            s.insertNode(m).setCursor()) : s.setStart(a, 0).setCursor();
                    } else m = s.document.createElement("br"), s.insertNode(m).setStartAfter(m).setCursor();
                }
            });
        }, UE.plugins.keystrokes = function () {
            var e = this, t = !0;
            e.addListener("keydown", function (i, n) {
                var o = n.keyCode || n.which, r = e.selection.getRange();
                if (!r.collapsed && !(n.ctrlKey || n.shiftKey || n.altKey || n.metaKey) && (o >= 65 && 90 >= o || o >= 48 && 57 >= o || o >= 96 && 111 >= o || {
                        13: 1,
                        8: 1,
                        46: 1
                    }[o])) {
                    var s = r.startContainer;
                    if (domUtils.isFillChar(s) && r.setStartBefore(s), s = r.endContainer, domUtils.isFillChar(s) && r.setEndAfter(s),
                            r.txtToElmBoundary(), r.endContainer && 1 == r.endContainer.nodeType && (s = r.endContainer.childNodes[r.endOffset],
                        s && domUtils.isBr(s) && r.setEndAfter(s)), 0 == r.startOffset && (s = r.startContainer, domUtils.isBoundaryNode(s, "firstChild") && (s = r.endContainer,
                        r.endOffset == (3 == s.nodeType ? s.nodeValue.length : s.childNodes.length) && domUtils.isBoundaryNode(s, "lastChild"))))return e.fireEvent("saveScene"),
                        e.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>", r.setStart(e.body.firstChild, 0).setCursor(!1, !0),
                        void e._selectionChange();
                }
                if (8 == o) {
                    if (r = e.selection.getRange(), t = r.collapsed, e.fireEvent("delkeydown", n))return;
                    var a, l;
                    if (r.collapsed && r.inFillChar() && (a = r.startContainer, domUtils.isFillChar(a) ? (r.setStartBefore(a).shrinkBoundary(!0).collapse(!0),
                            domUtils.remove(a)) : (a.nodeValue = a.nodeValue.replace(new RegExp("^" + domUtils.fillChar), ""),
                            r.startOffset--, r.collapse(!0).select(!0))), a = r.getClosedNode())return e.fireEvent("saveScene"),
                        r.setStartBefore(a), domUtils.remove(a), r.setCursor(), e.fireEvent("saveScene"), void domUtils.preventDefault(n);
                    if (!browser.ie && (a = domUtils.findParentByTagName(r.startContainer, "table", !0), l = domUtils.findParentByTagName(r.endContainer, "table", !0),
                        a && !l || !a && l || a !== l))return void n.preventDefault();
                }
                if (9 == o) {
                    var d = {
                        ol: 1,
                        ul: 1,
                        table: 1
                    };
                    if (e.fireEvent("tabkeydown", n))return void domUtils.preventDefault(n);
                    var c = e.selection.getRange();
                    e.fireEvent("saveScene");
                    for (var u = 0, m = "", f = e.options.tabSize || 4, h = e.options.tabNode || "&nbsp;"; f > u; u++)m += h;
                    var p = e.document.createElement("span");
                    if (p.innerHTML = m + domUtils.fillChar, c.collapsed)c.insertNode(p.cloneNode(!0).firstChild).setCursor(!0); else if (a = domUtils.findParent(c.startContainer, v),
                            l = domUtils.findParent(c.endContainer, v), a && l && a === l)c.deleteContents(), c.insertNode(p.cloneNode(!0).firstChild).setCursor(!0); else {
                        var g = c.createBookmark(), v = function (e) {
                            return domUtils.isBlockElm(e) && !d[e.tagName.toLowerCase()];
                        };
                        c.enlarge(!0);
                        for (var b = c.createBookmark(), y = domUtils.getNextDomNode(b.start, !1, v); y && !(domUtils.getPosition(y, b.end) & domUtils.POSITION_FOLLOWING);)y.insertBefore(p.cloneNode(!0).firstChild, y.firstChild),
                            y = domUtils.getNextDomNode(y, !1, v);
                        c.moveToBookmark(b).moveToBookmark(g).select();
                    }
                    domUtils.preventDefault(n);
                }
                if (browser.gecko && 46 == o && (c = e.selection.getRange(), c.collapsed && (a = c.startContainer,
                        domUtils.isEmptyBlock(a)))) {
                    for (var C = a.parentNode; 1 == domUtils.getChildCount(C) && !domUtils.isBody(C);)a = C, C = C.parentNode;
                    return void(a === C.lastChild && n.preventDefault());
                }
            }), e.addListener("keyup", function (e, i) {
                var n, o = i.keyCode || i.which, r = this;
                if (8 == o) {
                    if (r.fireEvent("delkeyup"))return;
                    if (n = r.selection.getRange(), n.collapsed) {
                        var s, a = ["h1", "h2", "h3", "h4", "h5", "h6"];
                        if ((s = domUtils.findParentByTagName(n.startContainer, a, !0)) && domUtils.isEmptyBlock(s)) {
                            var l = s.previousSibling;
                            if (l && "TABLE" != l.nodeName)return domUtils.remove(s), void n.setStartAtLast(l).setCursor(!1, !0);
                            var d = s.nextSibling;
                            if (d && "TABLE" != d.nodeName)return domUtils.remove(s), void n.setStartAtFirst(d).setCursor(!1, !0);
                        }
                        if (domUtils.isBody(n.startContainer)) {
                            var s = domUtils.createElement(r.document, "p", {
                                innerHTML: browser.ie ? domUtils.fillChar : "<br/>"
                            });
                            n.insertNode(s).setStart(s, 0).setCursor(!1, !0);
                        }
                    }
                    if (!t && (3 == n.startContainer.nodeType || 1 == n.startContainer.nodeType && domUtils.isEmptyBlock(n.startContainer)))if (browser.ie) {
                        var c = n.document.createElement("span");
                        n.insertNode(c).setStartBefore(c).collapse(!0), n.select(), domUtils.remove(c);
                    } else n.select();
                }
            });
        }, UE.plugins.autoheight = function () {
            function e(e) {
                var t = this;
                clearTimeout(o), a || (!t.queryCommandState || t.queryCommandState && 1 != t.queryCommandState("source")) && (o = setTimeout(function () {
                    for (var i = t.body.lastChild; i && 1 != i.nodeType;)i = i.previousSibling;
                    i && 1 == i.nodeType && (i.style.clear = "both", n = Math.max(domUtils.getXY(i).y + i.offsetHeight + 25, Math.max(s.minFrameHeight, s.initialFrameHeight)),
                    ("adjustheight" == e || n != r) && (t.setHeight(n, !0), r = n), domUtils.removeStyle(i, "clear"));
                }, 50));
            }

            var t = this;
            if (t.autoHeightEnabled = t.options.autoHeightEnabled !== !1, t.autoHeightEnabled) {
                var i, n, o, r = 0, s = t.options;
                t.addListener("foldcontentarea", function () {
                    r = 0, t.setHeight("60", !0);
                });
                var a;
                t.addListener("fullscreenchanged", function (e, t) {
                    a = t;
                }), t.addListener("destroy", function () {
                    t.removeListener("adjustheight contentchange afterinserthtml keyup mouseup", e);
                }), t.enableAutoHeight = function () {
                    var t = this;
                    if (t.autoHeightEnabled) {
                        var n = t.document;
                        t.autoHeightEnabled = !0, i = n.body.style.overflowY, n.body.style.overflowY = "hidden",
                            t.addListener("adjustheight contentchange afterinserthtml keyup mouseup", e), setTimeout(function () {
                            e.call(t);
                        }, browser.gecko ? 100 : 0), t.fireEvent("autoheightchanged", t.autoHeightEnabled);
                    }
                }, t.disableAutoHeight = function () {
                    t.body.style.overflowY = i || "", t.removeListener("contentchange", e), t.removeListener("keyup", e),
                        t.removeListener("mouseup", e), t.autoHeightEnabled = !1, t.fireEvent("autoheightchanged", t.autoHeightEnabled);
                }, t.addListener("ready", function () {
                    t.enableAutoHeight();
                    var i;
                    domUtils.on(browser.ie ? t.body : t.document, browser.webkit ? "dragover" : "drop", function () {
                        clearTimeout(i), i = setTimeout(function () {
                            e.call(t);
                        }, 100);
                    });
                });
            }
        }, UE.plugins.autofloat = function () {
            function e() {
                return UE.ui ? 1 : (alert(s.autofloatMsg), 0);
            }

            function t() {
                var e = document.body.style;
                e.backgroundImage = 'url("about:blank")', e.backgroundAttachment = "fixed";
            }

            function i() {
                var e = domUtils.getXY(c), t = domUtils.getComputedStyle(c, "position"), i = domUtils.getComputedStyle(c, "left");
                c.style.width = c.offsetWidth + "px", c.style.zIndex = 1 * r.options.zIndex + 1, c.parentNode.insertBefore(g, c),
                    h || p && browser.ie ? ("absolute" != c.style.position && (c.style.position = "absolute"), c.style.top = (document.body.scrollTop || document.documentElement.scrollTop) - u + l + "px") : (browser.ie7Compat && v && (v = !1,
                        c.style.marginLeft = "-45px", c.style.left = domUtils.getXY(c).x - document.documentElement.getBoundingClientRect().left + 2 + "px"),
                    "fixed" != c.style.position && (c.style.position = "fixed", c.style.top = l + "px", ("absolute" == t || "relative" == t) && parseFloat(i) && (c.style.left = e.x + "px")));
            }

            function n() {
                v = !0, g.parentNode && g.parentNode.removeChild(g), c.style.cssText = d, c.style.marginLeft = "0px";
            }

            function o() {
                var e = m(r.container), t = r.options.toolbarTopOffset || 0;
                e.top < 0 && e.bottom - c.offsetHeight > t ? i() : n();
            }

            var r = this, s = r.getLang(), a = r.options.autoFloatEnabled !== !1, l = r.options.topOffset;
            if (a) {
                var d, c, u, m, f = UE.ui.uiUtils, h = browser.ie && browser.version <= 6, p = browser.quirks, g = document.createElement("div"), v = !0, b = utils.defer(function () {
                    o();
                }, browser.ie ? 200 : 100, !0);
                r.addListener("destroy", function () {
                    domUtils.un(window, ["scroll", "resize"], o), r.removeListener("keydown", b);
                }), r.addListener("ready", function () {
                    e(r) && (m = f.getClientRect, c = r.ui.getDom("toolbarbox"), u = m(c).top, d = c.style.cssText,
                        g.style.height = c.offsetHeight + 53 + "px", h && t(), domUtils.on(window, ["scroll", "resize"], o),
                        r.addListener("keydown", b), r.addListener("beforefullscreenchange", function (e, t) {
                        t && n();
                    }), r.addListener("fullscreenchanged", function (e, t) {
                        t || o();
                    }), r.addListener("sourcemodechanged", function () {
                        setTimeout(function () {
                            o();
                        }, 0);
                    }), r.addListener("clearDoc", function () {
                        setTimeout(function () {
                            o();
                        }, 0);
                    }));
                });
            }
        }, UE.plugins.pasteplain = function () {
            var e = this;
            e.setOpt({
                pasteplain: !1,
                filterTxtRules: function () {
                    function e(e) {
                        e.tagName = "p", e.setStyle();
                    }

                    function t(e) {
                        e.parentNode.removeChild(e, !0);
                    }

                    return {
                        "-": "script style object iframe embed input select",
                        p: {
                            $: {}
                        },
                        br: {
                            $: {}
                        },
                        div: function (e) {
                            for (var t, i = UE.uNode.createElement("p"); t = e.firstChild();)"text" != t.type && UE.dom.dtd.$block[t.tagName] ? i.firstChild() ? (e.parentNode.insertBefore(i, e),
                                i = UE.uNode.createElement("p")) : e.parentNode.insertBefore(t, e) : i.appendChild(t);
                            i.firstChild() && e.parentNode.insertBefore(i, e), e.parentNode.removeChild(e);
                        },
                        ol: t,
                        ul: t,
                        dl: t,
                        dt: t,
                        dd: t,
                        li: t,
                        caption: e,
                        th: e,
                        tr: e,
                        h1: e,
                        h2: e,
                        h3: e,
                        h4: e,
                        h5: e,
                        h6: e,
                        td: function (e) {
                            var t = !!e.innerText();
                            t && e.parentNode.insertAfter(UE.uNode.createText(" &nbsp; &nbsp;"), e), e.parentNode.removeChild(e, e.innerText());
                        }
                    };
                }()
            });
            var t = e.options.pasteplain;
            e.commands.pasteplain = {
                queryCommandState: function () {
                    return t ? 1 : 0;
                },
                execCommand: function () {
                    t = 0 | !t;
                },
                notNeedUndo: 1
            };
        }, function () {
            function e() {
            }

            var t = UE.UETable = function (e) {
                this.table = e, this.indexTable = [], this.selectedTds = [], this.cellsRange = {}, this.update(e);
            };
            t.removeSelectedClass = function (e) {
                utils.each(e, function (e) {
                    domUtils.removeClasses(e, "selectTdClass");
                });
            }, t.addSelectedClass = function (e) {
                utils.each(e, function (e) {
                    domUtils.addClass(e, "selectTdClass");
                });
            }, t.isEmptyBlock = function (e) {
                var t = new RegExp(domUtils.fillChar, "g");
                if (e[browser.ie ? "innerText" : "textContent"].replace(/^\s*$/, "").replace(t, "").length > 0)return 0;
                for (var i in dtd.$isNotEmpty)if (dtd.$isNotEmpty.hasOwnProperty(i) && e.getElementsByTagName(i).length)return 0;
                return 1;
            }, t.getWidth = function (e) {
                return e ? parseInt(domUtils.getComputedStyle(e, "width"), 10) : 0;
            }, t.getTableCellAlignState = function (e) {
                !utils.isArray(e) && (e = [e]);
                var t = {}, i = ["align", "valign"], n = null, o = !0;
                return utils.each(e, function (e) {
                    return utils.each(i, function (i) {
                        if (n = e.getAttribute(i), !t[i] && n)t[i] = n; else if (!t[i] || n !== t[i])return o = !1, !1;
                    }), o;
                }), o ? t : null;
            }, t.getTableItemsByRange = function (e) {
                var t = e.selection.getStart();
                t && t.id && 0 === t.id.indexOf("_baidu_bookmark_start_") && (t = t.nextSibling);
                var i = t && domUtils.findParentByTagName(t, ["td", "th"], !0), n = i && i.parentNode, o = t && domUtils.findParentByTagName(t, "caption", !0), r = o ? o.parentNode : n && n.parentNode.parentNode;
                return {
                    cell: i,
                    tr: n,
                    table: r,
                    caption: o
                };
            }, t.getUETableBySelected = function (e) {
                var i = t.getTableItemsByRange(e).table;
                return i && i.ueTable && i.ueTable.selectedTds.length ? i.ueTable : null;
            }, t.getDefaultValue = function (e, t) {
                var i, n, o, r, s = {
                    thin: "0px",
                    medium: "1px",
                    thick: "2px"
                };
                if (t)return a = t.getElementsByTagName("td")[0], r = domUtils.getComputedStyle(t, "border-left-width"),
                    i = parseInt(s[r] || r, 10), r = domUtils.getComputedStyle(a, "padding-left"), n = parseInt(s[r] || r, 10),
                    r = domUtils.getComputedStyle(a, "border-left-width"), o = parseInt(s[r] || r, 10), {
                    tableBorder: i,
                    tdPadding: n,
                    tdBorder: o
                };
                t = e.document.createElement("table"), t.insertRow(0).insertCell(0).innerHTML = "xxx",
                    e.body.appendChild(t);
                var a = t.getElementsByTagName("td")[0];
                return r = domUtils.getComputedStyle(t, "border-left-width"), i = parseInt(s[r] || r, 10),
                    r = domUtils.getComputedStyle(a, "padding-left"), n = parseInt(s[r] || r, 10), r = domUtils.getComputedStyle(a, "border-left-width"),
                    o = parseInt(s[r] || r, 10), domUtils.remove(t), {
                    tableBorder: i,
                    tdPadding: n,
                    tdBorder: o
                };
            }, t.getUETable = function (e) {
                var i = e.tagName.toLowerCase();
                return e = "td" == i || "th" == i || "caption" == i ? domUtils.findParentByTagName(e, "table", !0) : e,
                e.ueTable || (e.ueTable = new t(e)), e.ueTable;
            }, t.cloneCell = function (e, t, i) {
                if (!e || utils.isString(e))return this.table.ownerDocument.createElement(e || "td");
                var n = domUtils.hasClass(e, "selectTdClass");
                n && domUtils.removeClasses(e, "selectTdClass");
                var o = e.cloneNode(!0);
                return t && (o.rowSpan = o.colSpan = 1), !i && domUtils.removeAttributes(o, "width height"),
                !i && domUtils.removeAttributes(o, "style"), o.style.borderLeftStyle = "", o.style.borderTopStyle = "",
                    o.style.borderLeftColor = e.style.borderRightColor, o.style.borderLeftWidth = e.style.borderRightWidth,
                    o.style.borderTopColor = e.style.borderBottomColor, o.style.borderTopWidth = e.style.borderBottomWidth,
                n && domUtils.addClass(e, "selectTdClass"), o;
            }, t.prototype = {
                getMaxRows: function () {
                    for (var e, t = this.table.rows, i = 1, n = 0; e = t[n]; n++) {
                        for (var o, r = 1, s = 0; o = e.cells[s++];)r = Math.max(o.rowSpan || 1, r);
                        i = Math.max(r + n, i);
                    }
                    return i;
                },
                getMaxCols: function () {
                    for (var e, t = this.table.rows, i = 0, n = {}, o = 0; e = t[o]; o++) {
                        for (var r, s = 0, a = 0; r = e.cells[a++];)if (s += r.colSpan || 1, r.rowSpan && r.rowSpan > 1)for (var l = 1; l < r.rowSpan; l++)n["row_" + (o + l)] ? n["row_" + (o + l)]++ : n["row_" + (o + l)] = r.colSpan || 1;
                        s += n["row_" + o] || 0, i = Math.max(s, i);
                    }
                    return i;
                },
                getCellColIndex: function () {
                },
                getHSideCell: function (t, i) {
                    try {
                        var n, o, r = this.getCellInfo(t), s = this.selectedTds.length, a = this.cellsRange;
                        return !i && (s ? !a.beginColIndex : !r.colIndex) || i && (s ? a.endColIndex == this.colsNum - 1 : r.colIndex == this.colsNum - 1) ? null : (n = s ? a.beginRowIndex : r.rowIndex,
                            o = i ? s ? a.endColIndex + 1 : r.colIndex + 1 : s ? a.beginColIndex - 1 : r.colIndex < 1 ? 0 : r.colIndex - 1,
                            this.getCell(this.indexTable[n][o].rowIndex, this.indexTable[n][o].cellIndex));
                    } catch (l) {
                        e(l);
                    }
                },
                getTabNextCell: function (e, t) {
                    var i, n = this.getCellInfo(e), o = t || n.rowIndex, r = n.colIndex + 1 + (n.colSpan - 1);
                    try {
                        i = this.getCell(this.indexTable[o][r].rowIndex, this.indexTable[o][r].cellIndex);
                    } catch (s) {
                        try {
                            o = 1 * o + 1, r = 0, i = this.getCell(this.indexTable[o][r].rowIndex, this.indexTable[o][r].cellIndex);
                        } catch (s) {
                        }
                    }
                    return i;
                },
                getVSideCell: function (t, i, n) {
                    try {
                        var o, r, s = this.getCellInfo(t), a = this.selectedTds.length && !n, l = this.cellsRange;
                        return !i && 0 == s.rowIndex || i && (a ? l.endRowIndex == this.rowsNum - 1 : s.rowIndex + s.rowSpan > this.rowsNum - 1) ? null : (o = i ? a ? l.endRowIndex + 1 : s.rowIndex + s.rowSpan : a ? l.beginRowIndex - 1 : s.rowIndex - 1,
                            r = a ? l.beginColIndex : s.colIndex, this.getCell(this.indexTable[o][r].rowIndex, this.indexTable[o][r].cellIndex));
                    } catch (d) {
                        e(d);
                    }
                },
                getSameEndPosCells: function (t, i) {
                    try {
                        for (var n = "x" === i.toLowerCase(), o = domUtils.getXY(t)[n ? "x" : "y"] + t["offset" + (n ? "Width" : "Height")], r = this.table.rows, s = null, a = [], l = 0; l < this.rowsNum; l++) {
                            s = r[l].cells;
                            for (var d, c = 0; d = s[c++];) {
                                var u = domUtils.getXY(d)[n ? "x" : "y"] + d["offset" + (n ? "Width" : "Height")];
                                if (u > o && n)break;
                                if ((t == d || o == u) && (1 == d[n ? "colSpan" : "rowSpan"] && a.push(d), n))break;
                            }
                        }
                        return a;
                    } catch (m) {
                        e(m);
                    }
                },
                setCellContent: function (e, t) {
                    e.innerHTML = t || (browser.ie ? domUtils.fillChar : "<br />");
                },
                cloneCell: t.cloneCell,
                getSameStartPosXCells: function (t) {
                    try {
                        for (var i, n = domUtils.getXY(t).x + t.offsetWidth, o = this.table.rows, r = [], s = 0; s < this.rowsNum; s++) {
                            i = o[s].cells;
                            for (var a, l = 0; a = i[l++];) {
                                var d = domUtils.getXY(a).x;
                                if (d > n)break;
                                if (d == n && 1 == a.colSpan) {
                                    r.push(a);
                                    break;
                                }
                            }
                        }
                        return r;
                    } catch (c) {
                        e(c);
                    }
                },
                update: function (e) {
                    this.table = e || this.table, this.selectedTds = [], this.cellsRange = {}, this.indexTable = [];
                    for (var t = this.table.rows, i = this.getMaxRows(), n = i - t.length, o = this.getMaxCols(); n--;)this.table.insertRow(t.length);
                    this.rowsNum = i, this.colsNum = o;
                    for (var r = 0, s = t.length; s > r; r++)this.indexTable[r] = new Array(o);
                    for (var a, l = 0; a = t[l]; l++)for (var d, c = 0, u = a.cells; d = u[c]; c++) {
                        d.rowSpan > i && (d.rowSpan = i);
                        for (var m = c, f = d.rowSpan || 1, h = d.colSpan || 1; this.indexTable[l][m];)m++;
                        for (var p = 0; f > p; p++)for (var g = 0; h > g; g++)this.indexTable[l + p][m + g] = {
                            rowIndex: l,
                            cellIndex: c,
                            colIndex: m,
                            rowSpan: f,
                            colSpan: h
                        };
                    }
                    for (p = 0; i > p; p++)for (g = 0; o > g; g++)void 0 === this.indexTable[p][g] && (a = t[p], d = a.cells[a.cells.length - 1],
                        d = d ? d.cloneNode(!0) : this.table.ownerDocument.createElement("td"), this.setCellContent(d),
                    1 !== d.colSpan && (d.colSpan = 1), 1 !== d.rowSpan && (d.rowSpan = 1), a.appendChild(d), this.indexTable[p][g] = {
                        rowIndex: p,
                        cellIndex: d.cellIndex,
                        colIndex: g,
                        rowSpan: 1,
                        colSpan: 1
                    });
                    var v = domUtils.getElementsByTagName(this.table, "td"), b = [];
                    if (utils.each(v, function (e) {
                            domUtils.hasClass(e, "selectTdClass") && b.push(e);
                        }), b.length) {
                        var y = b[0], C = b[b.length - 1], N = this.getCellInfo(y), x = this.getCellInfo(C);
                        this.selectedTds = b, this.cellsRange = {
                            beginRowIndex: N.rowIndex,
                            beginColIndex: N.colIndex,
                            endRowIndex: x.rowIndex + x.rowSpan - 1,
                            endColIndex: x.colIndex + x.colSpan - 1
                        };
                    }
                },
                getCellInfo: function (e) {
                    if (e)for (var t = e.cellIndex, i = e.parentNode.rowIndex, n = this.indexTable[i], o = this.colsNum, r = t; o > r; r++) {
                        var s = n[r];
                        if (s.rowIndex === i && s.cellIndex === t)return s;
                    }
                },
                getCell: function (e, t) {
                    return e < this.rowsNum && this.table.rows[e].cells[t] || null;
                },
                deleteCell: function (e, t) {
                    t = "number" == typeof t ? t : e.parentNode.rowIndex;
                    var i = this.table.rows[t];
                    i.deleteCell(e.cellIndex);
                },
                getCellsRange: function (e, t) {
                    function i(e, t, o, r) {
                        var s, a, l, d = e, c = t, u = o, m = r;
                        if (e > 0)for (a = t; r > a; a++)s = n.indexTable[e][a], l = s.rowIndex, e > l && (d = Math.min(l, d));
                        if (r < n.colsNum)for (l = e; o > l; l++)s = n.indexTable[l][r], a = s.colIndex + s.colSpan - 1, a > r && (m = Math.max(a, m));
                        if (o < n.rowsNum)for (a = t; r > a; a++)s = n.indexTable[o][a], l = s.rowIndex + s.rowSpan - 1, l > o && (u = Math.max(l, u));
                        if (t > 0)for (l = e; o > l; l++)s = n.indexTable[l][t], a = s.colIndex, t > a && (c = Math.min(s.colIndex, c));
                        return d != e || c != t || u != o || m != r ? i(d, c, u, m) : {
                            beginRowIndex: e,
                            beginColIndex: t,
                            endRowIndex: o,
                            endColIndex: r
                        };
                    }

                    try {
                        var n = this, o = n.getCellInfo(e);
                        if (e === t)return {
                            beginRowIndex: o.rowIndex,
                            beginColIndex: o.colIndex,
                            endRowIndex: o.rowIndex + o.rowSpan - 1,
                            endColIndex: o.colIndex + o.colSpan - 1
                        };
                        var r = n.getCellInfo(t), s = Math.min(o.rowIndex, r.rowIndex), a = Math.min(o.colIndex, r.colIndex), l = Math.max(o.rowIndex + o.rowSpan - 1, r.rowIndex + r.rowSpan - 1), d = Math.max(o.colIndex + o.colSpan - 1, r.colIndex + r.colSpan - 1);
                        return i(s, a, l, d);
                    } catch (c) {
                    }
                },
                getCells: function (e) {
                    this.clearSelected();
                    for (var t, i, n, o = e.beginRowIndex, r = e.beginColIndex, s = e.endRowIndex, a = e.endColIndex, l = {}, d = [], c = o; s >= c; c++)for (var u = r; a >= u; u++) {
                        t = this.indexTable[c][u], i = t.rowIndex, n = t.colIndex;
                        var m = i + "|" + n;
                        if (!l[m]) {
                            if (l[m] = 1, c > i || u > n || i + t.rowSpan - 1 > s || n + t.colSpan - 1 > a)return null;
                            d.push(this.getCell(i, t.cellIndex));
                        }
                    }
                    return d;
                },
                clearSelected: function () {
                    t.removeSelectedClass(this.selectedTds), this.selectedTds = [], this.cellsRange = {};
                },
                setSelected: function (e) {
                    var i = this.getCells(e);
                    t.addSelectedClass(i), this.selectedTds = i, this.cellsRange = e;
                },
                isFullRow: function () {
                    var e = this.cellsRange;
                    return e.endColIndex - e.beginColIndex + 1 == this.colsNum;
                },
                isFullCol: function () {
                    var e = this.cellsRange, t = this.table, i = t.getElementsByTagName("th"), n = e.endRowIndex - e.beginRowIndex + 1;
                    return i.length ? n == this.rowsNum || n == this.rowsNum - 1 : n == this.rowsNum;
                },
                getNextCell: function (t, i, n) {
                    try {
                        var o, r, s = this.getCellInfo(t), a = this.selectedTds.length && !n, l = this.cellsRange;
                        return !i && 0 == s.rowIndex || i && (a ? l.endRowIndex == this.rowsNum - 1 : s.rowIndex + s.rowSpan > this.rowsNum - 1) ? null : (o = i ? a ? l.endRowIndex + 1 : s.rowIndex + s.rowSpan : a ? l.beginRowIndex - 1 : s.rowIndex - 1,
                            r = a ? l.beginColIndex : s.colIndex, this.getCell(this.indexTable[o][r].rowIndex, this.indexTable[o][r].cellIndex));
                    } catch (d) {
                        e(d);
                    }
                },
                getPreviewCell: function (t, i) {
                    try {
                        var n, o, r = this.getCellInfo(t), s = this.selectedTds.length, a = this.cellsRange;
                        return !i && (s ? !a.beginColIndex : !r.colIndex) || i && (s ? a.endColIndex == this.colsNum - 1 : r.rowIndex > this.colsNum - 1) ? null : (n = i ? s ? a.beginRowIndex : r.rowIndex < 1 ? 0 : r.rowIndex - 1 : s ? a.beginRowIndex : r.rowIndex,
                            o = i ? s ? a.endColIndex + 1 : r.colIndex : s ? a.beginColIndex - 1 : r.colIndex < 1 ? 0 : r.colIndex - 1,
                            this.getCell(this.indexTable[n][o].rowIndex, this.indexTable[n][o].cellIndex));
                    } catch (l) {
                        e(l);
                    }
                },
                moveContent: function (e, i) {
                    if (!t.isEmptyBlock(i)) {
                        if (t.isEmptyBlock(e))return void(e.innerHTML = i.innerHTML);
                        var n = e.lastChild;
                        for (3 != n.nodeType && dtd.$block[n.tagName] || e.appendChild(e.ownerDocument.createElement("br")); n = i.firstChild;)e.appendChild(n);
                    }
                },
                mergeRight: function (e) {
                    var t = this.getCellInfo(e), i = t.colIndex + t.colSpan, n = this.indexTable[t.rowIndex][i], o = this.getCell(n.rowIndex, n.cellIndex);
                    e.colSpan = t.colSpan + n.colSpan, e.removeAttribute("width"), this.moveContent(e, o), this.deleteCell(o, n.rowIndex),
                        this.update();
                },
                mergeDown: function (e) {
                    var t = this.getCellInfo(e), i = t.rowIndex + t.rowSpan, n = this.indexTable[i][t.colIndex], o = this.getCell(n.rowIndex, n.cellIndex);
                    e.rowSpan = t.rowSpan + n.rowSpan, e.removeAttribute("height"), this.moveContent(e, o),
                        this.deleteCell(o, n.rowIndex), this.update();
                },
                mergeRange: function () {
                    var e = this.cellsRange, t = this.getCell(e.beginRowIndex, this.indexTable[e.beginRowIndex][e.beginColIndex].cellIndex);
                    if ("TH" == t.tagName && e.endRowIndex !== e.beginRowIndex) {
                        var i = this.indexTable, n = this.getCellInfo(t);
                        t = this.getCell(1, i[1][n.colIndex].cellIndex), e = this.getCellsRange(t, this.getCell(i[this.rowsNum - 1][n.colIndex].rowIndex, i[this.rowsNum - 1][n.colIndex].cellIndex));
                    }
                    for (var o, r = this.getCells(e), s = 0; o = r[s++];)o !== t && (this.moveContent(t, o), this.deleteCell(o));
                    if (t.rowSpan = e.endRowIndex - e.beginRowIndex + 1, t.rowSpan > 1 && t.removeAttribute("height"),
                            t.colSpan = e.endColIndex - e.beginColIndex + 1, t.colSpan > 1 && t.removeAttribute("width"),
                        t.rowSpan == this.rowsNum && 1 != t.colSpan && (t.colSpan = 1), t.colSpan == this.colsNum && 1 != t.rowSpan) {
                        var a = t.parentNode.rowIndex;
                        if (this.table.deleteRow)for (var s = a + 1, l = a + 1, d = t.rowSpan; d > s; s++)this.table.deleteRow(l); else for (var s = 0, d = t.rowSpan - 1; d > s; s++) {
                            var c = this.table.rows[a + 1];
                            c.parentNode.removeChild(c);
                        }
                        t.rowSpan = 1;
                    }
                    this.update();
                },
                insertRow: function (e, t) {
                    {
                        var i, n = this.colsNum, o = this.table, r = o.insertRow(e);
                        parseInt((o.offsetWidth - 20 * n - n - 1) / n, 10);
                    }
                    if (0 == e || e == this.rowsNum)for (var s = 0; n > s; s++)i = this.cloneCell(t, !0), this.setCellContent(i),
                    i.getAttribute("vAlign") && i.setAttribute("vAlign", i.getAttribute("vAlign")), r.appendChild(i); else {
                        var a = this.indexTable[e];
                        for (s = 0; n > s; s++) {
                            var l = a[s];
                            l.rowIndex < e ? (i = this.getCell(l.rowIndex, l.cellIndex), i.rowSpan = l.rowSpan + 1) : (i = this.cloneCell(t, !0),
                                this.setCellContent(i), r.appendChild(i));
                        }
                    }
                    return this.update(), r;
                },
                deleteRow: function (e) {
                    for (var t = this.table.rows[e], i = this.indexTable[e], n = this.colsNum, o = 0, r = 0; n > r;) {
                        var s = i[r], a = this.getCell(s.rowIndex, s.cellIndex);
                        if (a.rowSpan > 1 && s.rowIndex == e) {
                            var l = a.cloneNode(!0);
                            l.rowSpan = a.rowSpan - 1, l.innerHTML = "", a.rowSpan = 1;
                            var d, c = e + 1, u = this.table.rows[c], m = this.getPreviewMergedCellsNum(c, r) - o;
                            r > m ? (d = r - m - 1, domUtils.insertAfter(u.cells[d], l)) : u.cells.length && u.insertBefore(l, u.cells[0]),
                                o += 1;
                        }
                        r += a.colSpan || 1;
                    }
                    var f = [], h = {};
                    for (r = 0; n > r; r++) {
                        var p = i[r].rowIndex, g = i[r].cellIndex, v = p + "_" + g;
                        h[v] || (h[v] = 1, a = this.getCell(p, g), f.push(a));
                    }
                    var b = [];
                    utils.each(f, function (e) {
                        1 == e.rowSpan ? e.parentNode.removeChild(e) : b.push(e);
                    }), utils.each(b, function (e) {
                        e.rowSpan--;
                    }), t.parentNode.removeChild(t), this.update();
                },
                insertCol: function (e, t, i) {
                    function n(e, t, i) {
                        if (0 == e) {
                            var n = t.nextSibling || t.previousSibling;
                            "TH" == n.tagName && (n = t.ownerDocument.createElement("th"), n.appendChild(t.firstChild),
                                i.insertBefore(n, t), domUtils.remove(t));
                        } else if ("TH" == t.tagName) {
                            var o = t.ownerDocument.createElement("td");
                            o.appendChild(t.firstChild), i.insertBefore(o, t), domUtils.remove(t);
                        }
                    }

                    var o, r, s, a = this.rowsNum, l = 0, d = parseInt((this.table.offsetWidth - 20 * (this.colsNum + 1) - (this.colsNum + 1)) / (this.colsNum + 1), 10);
                    if (0 == e || e == this.colsNum)for (; a > l; l++)o = this.table.rows[l], s = o.cells[0 == e ? e : o.cells.length],
                        r = this.cloneCell(t, !0), this.setCellContent(r), r.setAttribute("vAlign", r.getAttribute("vAlign")),
                    s && r.setAttribute("width", s.getAttribute("width")), e ? domUtils.insertAfter(o.cells[o.cells.length - 1], r) : o.insertBefore(r, o.cells[0]),
                        n(l, r, o); else for (; a > l; l++) {
                        var c = this.indexTable[l][e];
                        c.colIndex < e ? (r = this.getCell(c.rowIndex, c.cellIndex), r.colSpan = c.colSpan + 1) : (o = this.table.rows[l],
                            s = o.cells[c.cellIndex], r = this.cloneCell(t, !0), this.setCellContent(r), r.setAttribute("vAlign", r.getAttribute("vAlign")),
                        s && r.setAttribute("width", s.getAttribute("width")), s ? o.insertBefore(r, s) : o.appendChild(r)),
                            n(l, r, o);
                    }
                    this.update(), this.updateWidth(d, i || {
                            tdPadding: 10,
                            tdBorder: 1
                        });
                },
                updateWidth: function (e, i) {
                    var n = this.table, o = t.getWidth(n) - 2 * i.tdPadding - i.tdBorder + e;
                    if (o < n.ownerDocument.body.offsetWidth)return void n.setAttribute("width", o);
                    var r = domUtils.getElementsByTagName(this.table, "td");
                    utils.each(r, function (t) {
                        t.setAttribute("width", e);
                    });
                },
                deleteCol: function (e) {
                    for (var t = this.indexTable, i = this.table.rows, n = this.table.getAttribute("width"), o = 0, r = this.rowsNum, s = {}, a = 0; r > a;) {
                        var l = t[a], d = l[e], c = d.rowIndex + "_" + d.colIndex;
                        if (!s[c]) {
                            s[c] = 1;
                            var u = this.getCell(d.rowIndex, d.cellIndex);
                            o || (o = u && parseInt(u.offsetWidth / u.colSpan, 10).toFixed(0)), u.colSpan > 1 ? u.colSpan-- : i[a].deleteCell(d.cellIndex),
                                a += d.rowSpan || 1;
                        }
                    }
                    this.table.setAttribute("width", n - o), this.update();
                },
                splitToCells: function (e) {
                    var t = this, i = this.splitToRows(e);
                    utils.each(i, function (e) {
                        t.splitToCols(e);
                    });
                },
                splitToRows: function (e) {
                    var t = this.getCellInfo(e), i = t.rowIndex, n = t.colIndex, o = [];
                    e.rowSpan = 1, o.push(e);
                    for (var r = i, s = i + t.rowSpan; s > r; r++)if (r != i) {
                        var a = this.table.rows[r], l = a.insertCell(n - this.getPreviewMergedCellsNum(r, n));
                        l.colSpan = t.colSpan, this.setCellContent(l), l.setAttribute("vAlign", e.getAttribute("vAlign")),
                            l.setAttribute("align", e.getAttribute("align")), e.style.cssText && (l.style.cssText = e.style.cssText),
                            o.push(l);
                    }
                    return this.update(), o;
                },
                getPreviewMergedCellsNum: function (e, t) {
                    for (var i = this.indexTable[e], n = 0, o = 0; t > o;) {
                        var r = i[o].colSpan, s = i[o].rowIndex;
                        n += r - (s == e ? 1 : 0), o += r;
                    }
                    return n;
                },
                splitToCols: function (e) {
                    var t = (e.offsetWidth / e.colSpan - 22).toFixed(0), i = this.getCellInfo(e), n = i.rowIndex, o = i.colIndex, r = [];
                    e.colSpan = 1, e.setAttribute("width", t), r.push(e);
                    for (var s = o, a = o + i.colSpan; a > s; s++)if (s != o) {
                        var l = this.table.rows[n], d = l.insertCell(this.indexTable[n][s].cellIndex + 1);
                        if (d.rowSpan = i.rowSpan, this.setCellContent(d), d.setAttribute("vAlign", e.getAttribute("vAlign")),
                                d.setAttribute("align", e.getAttribute("align")), d.setAttribute("width", t), e.style.cssText && (d.style.cssText = e.style.cssText),
                            "TH" == e.tagName) {
                            var c = e.ownerDocument.createElement("th");
                            c.appendChild(d.firstChild), c.setAttribute("vAlign", e.getAttribute("vAlign")), c.rowSpan = d.rowSpan,
                                l.insertBefore(c, d), domUtils.remove(d);
                        }
                        r.push(d);
                    }
                    return this.update(), r;
                },
                isLastCell: function (e, t, i) {
                    t = t || this.rowsNum, i = i || this.colsNum;
                    var n = this.getCellInfo(e);
                    return n.rowIndex + n.rowSpan == t && n.colIndex + n.colSpan == i;
                },
                getLastCell: function (e) {
                    e = e || this.table.getElementsByTagName("td");
                    var t, i = (this.getCellInfo(e[0]), this), n = e[0], o = n.parentNode, r = 0, s = 0;
                    return utils.each(e, function (e) {
                        e.parentNode == o && (s += e.colSpan || 1), r += e.rowSpan * e.colSpan || 1;
                    }), t = r / s, utils.each(e, function (e) {
                        return i.isLastCell(e, t, s) ? (n = e, !1) : void 0;
                    }), n;
                },
                selectRow: function (e) {
                    var t = this.indexTable[e], i = this.getCell(t[0].rowIndex, t[0].cellIndex), n = this.getCell(t[this.colsNum - 1].rowIndex, t[this.colsNum - 1].cellIndex), o = this.getCellsRange(i, n);
                    this.setSelected(o);
                },
                selectTable: function () {
                    var e = this.table.getElementsByTagName("td"), t = this.getCellsRange(e[0], e[e.length - 1]);
                    this.setSelected(t);
                },
                sortTable: function (e, t) {
                    var i = this.table, n = i.rows, o = [], r = "TH" === n[0].cells[0].tagName, s = 0;
                    if (this.selectedTds.length) {
                        for (var a = this.cellsRange, l = a.endRowIndex + 1, d = a.beginRowIndex; l > d; d++)o[d] = n[d];
                        o.splice(0, a.beginRowIndex), s = a.endRowIndex + 1 === this.rowsNum ? 0 : a.endRowIndex + 1;
                    } else for (var d = 0, l = n.length; l > d; d++)o[d] = n[d];
                    r && o.splice(0, 1), o = utils.sort(o, function (i, n) {
                        var o = function (e) {
                            return e.innerText || e.textContent;
                        };
                        return t ? "number" == typeof t ? t : t.call(this, i.cells[e], n.cells[e]) : function () {
                            var t = o(i.cells[e]), r = o(n.cells[e]);
                            return t.localeCompare(r);
                        }();
                    });
                    for (var c = i.ownerDocument.createDocumentFragment(), u = 0, l = o.length; l > u; u++)c.appendChild(o[u]);
                    var m = i.getElementsByTagName("tbody")[0];
                    s ? m.insertBefore(c, n[s - a.endRowIndex + a.beginRowIndex - 1]) : m.appendChild(c);
                },
                setBackground: function (e, t) {
                    if ("string" == typeof t)utils.each(e, function (e) {
                        e.style.backgroundColor = t;
                    }); else if ("object" == typeof t) {
                        t = utils.extend({
                            repeat: !0,
                            colorList: ["#ddd", "#fff"]
                        }, t);
                        for (var i, n = this.getCellInfo(e[0]).rowIndex, o = 0, r = t.colorList, s = function (e, t, i) {
                            return e[t] ? e[t] : i ? e[t % e.length] : "";
                        }, a = 0; i = e[a++];) {
                            var l = this.getCellInfo(i);
                            i.style.backgroundColor = s(r, n + o == l.rowIndex ? o : ++o, t.repeat);
                        }
                    }
                },
                removeBackground: function (e) {
                    utils.each(e, function (e) {
                        e.style.backgroundColor = "";
                    });
                }
            };
        }(), function () {
            function e(e, i) {
                var n = e.getElementsByTagName("td");
                utils.each(n, function (e) {
                    e.removeAttribute("width");
                }), e.setAttribute("width", t(i, !0, s(i, e))), setTimeout(function () {
                    utils.each(n, function (e) {
                        1 == e.colSpan && e.setAttribute("width", e.offsetWidth + "");
                    });
                }, 0);
            }

            function t(e, t, i) {
                var n = e.body;
                return n.offsetWidth - (t ? 2 * parseInt(domUtils.getComputedStyle(n, "margin-left"), 10) : 0) - 2 * i.tableBorder - (e.options.offsetWidth || 0);
            }

            function i(e) {
                var t = o(e).cell;
                if (t) {
                    var i = a(t);
                    return i.selectedTds.length ? i.selectedTds : [t];
                }
                return [];
            }

            var n = UE.UETable, o = function (e) {
                return n.getTableItemsByRange(e);
            }, r = function (e) {
                return n.getUETableBySelected(e);
            }, s = function (e, t) {
                return n.getDefaultValue(e, t);
            }, a = function (e) {
                return n.getUETable(e);
            };
            UE.commands.inserttable = {
                queryCommandState: function () {
                    return o(this).table ? -1 : 0;
                },
                execCommand: function (e, t) {
                    function i(e, t) {
                        for (var i = [], n = e.numRows, o = e.numCols, r = 0; n > r; r++) {
                            i.push("<tr>");
                            for (var s = 0; o > s; s++)i.push('<td width="' + t + '"  vAlign="' + e.tdvalign + '" >' + (browser.ie ? domUtils.fillChar : "<br/>") + "</td>");
                            i.push("</tr>");
                        }
                        return "<table><tbody>" + i.join("") + "</tbody></table>";
                    }

                    t || (t = utils.extend({}, {
                        numCols: this.options.defaultCols,
                        numRows: this.options.defaultRows,
                        tdvalign: this.options.tdvalign
                    }));
                    var n = this, o = this.selection.getRange(), r = o.startContainer, a = domUtils.findParent(r, function (e) {
                            return domUtils.isBlockElm(e);
                        }, !0) || n.body, l = s(n), d = a.offsetWidth, c = Math.floor(d / t.numCols - 2 * l.tdPadding - l.tdBorder);
                    !t.tdvalign && (t.tdvalign = n.options.tdvalign), n.execCommand("inserthtml", i(t, c));
                }
            }, UE.commands.insertparagraphbeforetable = {
                queryCommandState: function () {
                    return o(this).cell ? 0 : -1;
                },
                execCommand: function () {
                    var e = o(this).table;
                    if (e) {
                        var t = this.document.createElement("p");
                        t.innerHTML = browser.ie ? "&nbsp;" : "<br />", e.parentNode.insertBefore(t, e), this.selection.getRange().setStart(t, 0).setCursor();
                    }
                }
            }, UE.commands.deletetable = {
                queryCommandState: function () {
                    var e = this.selection.getRange();
                    return domUtils.findParentByTagName(e.startContainer, "table", !0) ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = this.selection.getRange();
                    if (t = t || domUtils.findParentByTagName(i.startContainer, "table", !0)) {
                        var n = t.nextSibling;
                        n || (n = domUtils.createElement(this.document, "p", {
                            innerHTML: browser.ie ? domUtils.fillChar : "<br/>"
                        }), t.parentNode.insertBefore(n, t)), domUtils.remove(t), i = this.selection.getRange(),
                            3 == n.nodeType ? i.setStartBefore(n) : i.setStart(n, 0), i.setCursor(!1, !0), this.fireEvent("tablehasdeleted");
                    }
                }
            }, UE.commands.cellalign = {
                queryCommandState: function () {
                    return i(this).length ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var n = i(this);
                    if (n.length)for (var o, r = 0; o = n[r++];)o.setAttribute("align", t);
                }
            }, UE.commands.cellvalign = {
                queryCommandState: function () {
                    return i(this).length ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var n = i(this);
                    if (n.length)for (var o, r = 0; o = n[r++];)o.setAttribute("vAlign", t);
                }
            }, UE.commands.insertcaption = {
                queryCommandState: function () {
                    var e = o(this).table;
                    return e && 0 == e.getElementsByTagName("caption").length ? 1 : -1;
                },
                execCommand: function () {
                    var e = o(this).table;
                    if (e) {
                        var t = this.document.createElement("caption");
                        t.innerHTML = browser.ie ? domUtils.fillChar : "<br/>", e.insertBefore(t, e.firstChild);
                        var i = this.selection.getRange();
                        i.setStart(t, 0).setCursor();
                    }
                }
            }, UE.commands.deletecaption = {
                queryCommandState: function () {
                    var e = this.selection.getRange(), t = domUtils.findParentByTagName(e.startContainer, "table");
                    return t ? 0 == t.getElementsByTagName("caption").length ? -1 : 1 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = domUtils.findParentByTagName(e.startContainer, "table");
                    if (t) {
                        domUtils.remove(t.getElementsByTagName("caption")[0]);
                        var i = this.selection.getRange();
                        i.setStart(t.rows[0].cells[0], 0).setCursor();
                    }
                }
            }, UE.commands.inserttitle = {
                queryCommandState: function () {
                    var e = o(this).table;
                    if (e) {
                        var t = e.rows[0];
                        return 0 == t.getElementsByTagName("th").length ? 0 : -1;
                    }
                    return -1;
                },
                execCommand: function () {
                    var e = o(this).table;
                    e && a(e).insertRow(0, "th");
                    var t = e.getElementsByTagName("th")[0];
                    this.selection.getRange().setStart(t, 0).setCursor(!1, !0);
                }
            }, UE.commands.deletetitle = {
                queryCommandState: function () {
                    var e = o(this).table;
                    if (e) {
                        var t = e.rows[0];
                        return t.getElementsByTagName("th").length ? 0 : -1;
                    }
                    return -1;
                },
                execCommand: function () {
                    var e = o(this).table;
                    e && domUtils.remove(e.rows[0]);
                    var t = e.getElementsByTagName("td")[0];
                    this.selection.getRange().setStart(t, 0).setCursor(!1, !0);
                }
            }, UE.commands.mergeright = {
                queryCommandState: function () {
                    var e = o(this);
                    if (!e.cell)return -1;
                    var t = a(e.table);
                    if (t.selectedTds.length)return -1;
                    var i = t.getCellInfo(e.cell), n = i.colIndex + i.colSpan;
                    if (n >= t.colsNum)return -1;
                    var r = t.indexTable[i.rowIndex][n];
                    return r.rowIndex == i.rowIndex && r.rowSpan == i.rowSpan ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i);
                    n.mergeRight(i), e.moveToBookmark(t).select();
                }
            }, UE.commands.mergedown = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    if (!t || "TH" == t.tagName)return -1;
                    var i = a(e.table);
                    if (i.selectedTds.length)return -1;
                    var n = i.getCellInfo(e.cell), r = n.rowIndex + n.rowSpan;
                    if (r >= i.rowsNum)return -1;
                    var s = i.indexTable[r][n.colIndex];
                    return s.colIndex == n.colIndex && s.colSpan == n.colSpan && "TH" !== e.cell.tagName ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i);
                    n.mergeDown(i), e.moveToBookmark(t).select();
                }
            }, UE.commands.mergecells = {
                queryCommandState: function () {
                    return r(this) ? 0 : -1;
                },
                execCommand: function () {
                    var e = r(this);
                    if (e && e.selectedTds.length) {
                        var t = e.selectedTds[0];
                        e.mergeRange();
                        var i = this.selection.getRange();
                        domUtils.isEmptyBlock(t) ? i.setStart(t, 0).collapse(!0) : i.selectNodeContents(t), i.select();
                    }
                }
            }, UE.commands.insertrow = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    return t && "TD" == t.tagName && a(e.table).rowsNum < this.options.maxRowNum ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this), n = i.cell, r = i.table, s = a(r), l = s.getCellInfo(n);
                    if (s.selectedTds.length)for (var d = s.cellsRange, c = 0, u = d.endRowIndex - d.beginRowIndex + 1; u > c; c++)s.insertRow(d.beginRowIndex, n); else s.insertRow(l.rowIndex, n);
                    e.moveToBookmark(t).select(), "enabled" === r.getAttribute("interlaced") && this.fireEvent("interlacetable", r);
                }
            }, UE.commands.insertrownext = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    return t && "TD" == t.tagName && a(e.table).rowsNum < this.options.maxRowNum ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this), n = i.cell, r = i.table, s = a(r), l = s.getCellInfo(n);
                    if (s.selectedTds.length)for (var d = s.cellsRange, c = 0, u = d.endRowIndex - d.beginRowIndex + 1; u > c; c++)s.insertRow(d.endRowIndex + 1, n); else s.insertRow(l.rowIndex + l.rowSpan, n);
                    e.moveToBookmark(t).select(), "enabled" === r.getAttribute("interlaced") && this.fireEvent("interlacetable", r);
                }
            }, UE.commands.deleterow = {
                queryCommandState: function () {
                    var e = o(this);
                    return e.cell ? 0 : -1;
                },
                execCommand: function () {
                    var e = o(this).cell, t = a(e), i = t.cellsRange, n = t.getCellInfo(e), r = t.getVSideCell(e), s = t.getVSideCell(e, !0), l = this.selection.getRange();
                    if (utils.isEmptyObject(i))t.deleteRow(n.rowIndex); else for (var d = i.beginRowIndex; d < i.endRowIndex + 1; d++)t.deleteRow(i.beginRowIndex);
                    var c = t.table;
                    if (c.getElementsByTagName("td").length)if (1 == n.rowSpan || n.rowSpan == i.endRowIndex - i.beginRowIndex + 1)(s || r) && l.selectNodeContents(s || r).setCursor(!1, !0); else {
                        var u = t.getCell(n.rowIndex, t.indexTable[n.rowIndex][n.colIndex].cellIndex);
                        u && l.selectNodeContents(u).setCursor(!1, !0);
                    } else {
                        var m = c.nextSibling;
                        domUtils.remove(c), m && l.setStart(m, 0).setCursor(!1, !0);
                    }
                    "enabled" === c.getAttribute("interlaced") && this.fireEvent("interlacetable", c);
                }
            }, UE.commands.insertcol = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    return t && ("TD" == t.tagName || "TH" == t.tagName) && a(e.table).colsNum < this.options.maxColNum ? 0 : -1;
                },
                execCommand: function (e) {
                    var t = this.selection.getRange(), i = t.createBookmark(!0);
                    if (-1 != this.queryCommandState(e)) {
                        var n = o(this).cell, r = a(n), s = r.getCellInfo(n);
                        if (r.selectedTds.length)for (var l = r.cellsRange, d = 0, c = l.endColIndex - l.beginColIndex + 1; c > d; d++)r.insertCol(l.beginColIndex, n); else r.insertCol(s.colIndex, n);
                        t.moveToBookmark(i).select(!0);
                    }
                }
            }, UE.commands.insertcolnext = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    return t && a(e.table).colsNum < this.options.maxColNum ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i), r = n.getCellInfo(i);
                    if (n.selectedTds.length)for (var s = n.cellsRange, l = 0, d = s.endColIndex - s.beginColIndex + 1; d > l; l++)n.insertCol(s.endColIndex + 1, i); else n.insertCol(r.colIndex + r.colSpan, i);
                    e.moveToBookmark(t).select();
                }
            }, UE.commands.deletecol = {
                queryCommandState: function () {
                    var e = o(this);
                    return e.cell ? 0 : -1;
                },
                execCommand: function () {
                    var e = o(this).cell, t = a(e), i = t.cellsRange, n = t.getCellInfo(e), r = t.getHSideCell(e), s = t.getHSideCell(e, !0);
                    if (utils.isEmptyObject(i))t.deleteCol(n.colIndex); else for (var l = i.beginColIndex; l < i.endColIndex + 1; l++)t.deleteCol(i.beginColIndex);
                    var d = t.table, c = this.selection.getRange();
                    if (d.getElementsByTagName("td").length)domUtils.inDoc(e, this.document) ? c.setStart(e, 0).setCursor(!1, !0) : s && domUtils.inDoc(s, this.document) ? c.selectNodeContents(s).setCursor(!1, !0) : r && domUtils.inDoc(r, this.document) && c.selectNodeContents(r).setCursor(!0, !0); else {
                        var u = d.nextSibling;
                        domUtils.remove(d), u && c.setStart(u, 0).setCursor(!1, !0);
                    }
                }
            }, UE.commands.splittocells = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    if (!t)return -1;
                    var i = a(e.table);
                    return i.selectedTds.length > 0 ? -1 : t && (t.colSpan > 1 || t.rowSpan > 1) ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i);
                    n.splitToCells(i), e.moveToBookmark(t).select();
                }
            }, UE.commands.splittorows = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    if (!t)return -1;
                    var i = a(e.table);
                    return i.selectedTds.length > 0 ? -1 : t && t.rowSpan > 1 ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i);
                    n.splitToRows(i), e.moveToBookmark(t).select();
                }
            }, UE.commands.splittocols = {
                queryCommandState: function () {
                    var e = o(this), t = e.cell;
                    if (!t)return -1;
                    var i = a(e.table);
                    return i.selectedTds.length > 0 ? -1 : t && t.colSpan > 1 ? 0 : -1;
                },
                execCommand: function () {
                    var e = this.selection.getRange(), t = e.createBookmark(!0), i = o(this).cell, n = a(i);
                    n.splitToCols(i), e.moveToBookmark(t).select();
                }
            }, UE.commands.adaptbytext = UE.commands.adaptbywindow = {
                queryCommandState: function () {
                    return o(this).table ? 0 : -1;
                },
                execCommand: function (t) {
                    var i = o(this), n = i.table;
                    if (n)if ("adaptbywindow" == t)e(n, this); else {
                        var r = domUtils.getElementsByTagName(n, "td th");
                        utils.each(r, function (e) {
                            e.removeAttribute("width");
                        }), n.removeAttribute("width");
                    }
                }
            }, UE.commands.averagedistributecol = {
                queryCommandState: function () {
                    var e = r(this);
                    return e && (e.isFullRow() || e.isFullCol()) ? 0 : -1;
                },
                execCommand: function () {
                    function e() {
                        var e, t = n.table, o = 0, r = 0, a = s(i, t);
                        if (n.isFullRow())o = t.offsetWidth, r = n.colsNum; else for (var l, d = n.cellsRange.beginColIndex, c = n.cellsRange.endColIndex, u = d; c >= u;)l = n.selectedTds[u],
                            o += l.offsetWidth, u += l.colSpan, r += 1;
                        return e = Math.ceil(o / r) - 2 * a.tdBorder - 2 * a.tdPadding;
                    }

                    function t(e) {
                        utils.each(domUtils.getElementsByTagName(n.table, "th"), function (e) {
                            e.setAttribute("width", "");
                        });
                        var t = n.isFullRow() ? domUtils.getElementsByTagName(n.table, "td") : n.selectedTds;
                        utils.each(t, function (t) {
                            1 == t.colSpan && t.setAttribute("width", e);
                        });
                    }

                    var i = this, n = r(i);
                    n && n.selectedTds.length && t(e());
                }
            }, UE.commands.averagedistributerow = {
                queryCommandState: function () {
                    var e = r(this);
                    return e ? e.selectedTds && /th/gi.test(e.selectedTds[0].tagName) ? -1 : e.isFullRow() || e.isFullCol() ? 0 : -1 : -1;
                },
                execCommand: function () {
                    function e() {
                        var e, t, o = 0, r = n.table, a = s(i, r), l = parseInt(domUtils.getComputedStyle(r.getElementsByTagName("td")[0], "padding-top"));
                        if (n.isFullCol()) {
                            var d, c, u = domUtils.getElementsByTagName(r, "caption"), m = domUtils.getElementsByTagName(r, "th");
                            u.length > 0 && (d = u[0].offsetHeight), m.length > 0 && (c = m[0].offsetHeight), o = r.offsetHeight - (d || 0) - (c || 0),
                                t = 0 == m.length ? n.rowsNum : n.rowsNum - 1;
                        } else {
                            for (var f = n.cellsRange.beginRowIndex, h = n.cellsRange.endRowIndex, p = 0, g = domUtils.getElementsByTagName(r, "tr"), v = f; h >= v; v++)o += g[v].offsetHeight,
                                p += 1;
                            t = p;
                        }
                        return e = browser.ie && browser.version < 9 ? Math.ceil(o / t) : Math.ceil(o / t) - 2 * a.tdBorder - 2 * l;
                    }

                    function t(e) {
                        var t = n.isFullCol() ? domUtils.getElementsByTagName(n.table, "td") : n.selectedTds;
                        utils.each(t, function (t) {
                            1 == t.rowSpan && t.setAttribute("height", e);
                        });
                    }

                    var i = this, n = r(i);
                    n && n.selectedTds.length && t(e());
                }
            }, UE.commands.cellalignment = {
                queryCommandState: function () {
                    return o(this).table ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = this, n = r(i);
                    if (n)utils.each(n.selectedTds, function (e) {
                        domUtils.setAttributes(e, t);
                    }); else {
                        var o = i.selection.getStart(), s = o && domUtils.findParentByTagName(o, ["td", "th", "caption"], !0);
                        /caption/gi.test(s.tagName) ? (s.style.textAlign = t.align, s.style.verticalAlign = t.vAlign) : domUtils.setAttributes(s, t),
                            i.selection.getRange().setCursor(!0);
                    }
                },
                queryCommandValue: function () {
                    var e = o(this).cell;
                    if (e || (e = i(this)[0]), e) {
                        var t = UE.UETable.getUETable(e).selectedTds;
                        return !t.length && (t = e), UE.UETable.getTableCellAlignState(t);
                    }
                    return null;
                }
            }, UE.commands.tablealignment = {
                queryCommandState: function () {
                    return browser.ie && browser.version < 8 ? -1 : o(this).table ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = this, n = i.selection.getStart(), o = n && domUtils.findParentByTagName(n, ["table"], !0);
                    o && o.setAttribute("align", t);
                }
            }, UE.commands.edittable = {
                queryCommandState: function () {
                    return o(this).table ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = this.selection.getRange(), n = domUtils.findParentByTagName(i.startContainer, "table");
                    if (n) {
                        var o = domUtils.getElementsByTagName(n, "td").concat(domUtils.getElementsByTagName(n, "th"), domUtils.getElementsByTagName(n, "caption"));
                        utils.each(o, function (e) {
                            e.style.borderColor = t;
                        });
                    }
                }
            }, UE.commands.edittd = {
                queryCommandState: function () {
                    return o(this).table ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = this, n = r(i);
                    if (n)utils.each(n.selectedTds, function (e) {
                        e.style.backgroundColor = t;
                    }); else {
                        var o = i.selection.getStart(), s = o && domUtils.findParentByTagName(o, ["td", "th", "caption"], !0);
                        s && (s.style.backgroundColor = t);
                    }
                }
            }, UE.commands.sorttable = {
                queryCommandState: function () {
                    var e = this, t = o(e);
                    if (!t.cell)return -1;
                    for (var i, n = t.table, r = n.getElementsByTagName("td"), s = 0; i = r[s++];)if (1 != i.rowSpan || 1 != i.colSpan)return -1;
                    return 0;
                },
                execCommand: function (e, t) {
                    var i = this, n = i.selection.getRange(), r = n.createBookmark(!0), s = o(i), l = s.cell, d = a(s.table), c = d.getCellInfo(l);
                    d.sortTable(c.cellIndex, t), n.moveToBookmark(r).select();
                }
            }, UE.commands.enablesort = UE.commands.disablesort = {
                queryCommandState: function () {
                    return o(this).table ? 0 : -1;
                },
                execCommand: function (e) {
                    var t = o(this).table;
                    t.setAttribute("data-sort", "enablesort" == e ? "sortEnabled" : "sortDisabled");
                }
            }, UE.commands.settablebackground = {
                queryCommandState: function () {
                    return i(this).length > 1 ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var n, o;
                    n = i(this), o = a(n[0]), o.setBackground(n, t);
                }
            }, UE.commands.cleartablebackground = {
                queryCommandState: function () {
                    var e = i(this);
                    if (!e.length)return -1;
                    for (var t, n = 0; t = e[n++];)if ("" !== t.style.backgroundColor)return 0;
                    return -1;
                },
                execCommand: function () {
                    var e = i(this), t = a(e[0]);
                    t.removeBackground(e);
                }
            }, UE.commands.interlacetable = UE.commands.uninterlacetable = {
                queryCommandState: function (e) {
                    var t = o(this).table;
                    if (!t)return -1;
                    var i = t.getAttribute("interlaced");
                    return "interlacetable" == e ? "enabled" === i ? -1 : 0 : i && "disabled" !== i ? 0 : -1;
                },
                execCommand: function (e, t) {
                    var i = o(this).table;
                    "interlacetable" == e ? (i.setAttribute("interlaced", "enabled"), this.fireEvent("interlacetable", i, t)) : (i.setAttribute("interlaced", "disabled"),
                        this.fireEvent("uninterlacetable", i));
                }
            };
        }(), UE.plugins.table = function () {
            function e() {
            }

            function t(e) {
                i(e, "width", !0), i(e, "height", !0);
            }

            function i(e, t, i) {
                e.style[t] && (i && e.setAttribute(t, parseInt(e.style[t], 10)), e.style[t] = "");
            }

            function n(e) {
                if ("TD" == e.tagName || "TH" == e.tagName)return e;
                var t;
                return (t = domUtils.findParentByTagName(e, "td", !0) || domUtils.findParentByTagName(e, "th", !0)) ? t : null;
            }

            function o(e) {
                var t = new RegExp(domUtils.fillChar, "g");
                if (e[browser.ie ? "innerText" : "textContent"].replace(/^\s*$/, "").replace(t, "").length > 0)return 0;
                for (var i in dtd.$isNotEmpty)if (e.getElementsByTagName(i).length)return 0;
                return 1;
            }

            function r(e) {
                return e.pageX || e.pageY ? {
                    x: e.pageX,
                    y: e.pageY
                } : {
                    x: e.clientX + H.document.body.scrollLeft - H.document.body.clientLeft,
                    y: e.clientY + H.document.body.scrollTop - H.document.body.clientTop
                };
            }

            function s(t) {
                if (!T())try {
                    var i, o = n(t.target || t.srcElement);
                    if (V && (H.body.style.webkitUserSelect = "none", (Math.abs(X.x - t.clientX) > z || Math.abs(X.y - t.clientY) > z) && (y(),
                            V = !1, j = 0, N(t))), it && at)return j = 0, H.body.style.webkitUserSelect = "none", H.selection.getNative()[browser.ie9below ? "empty" : "removeAllRanges"](),
                        i = r(t), m(H, !0, it, i, o), void("h" == it ? st.style.left = c(at, t) + "px" : "v" == it && (st.style.top = u(at, t) + "px"));
                    if (o) {
                        if (H.fireEvent("excludetable", o) === !0)return;
                        i = r(t);
                        var s = f(o, i), l = domUtils.findParentByTagName(o, "table", !0);
                        if (d(l, o, t, !0)) {
                            if (H.fireEvent("excludetable", l) === !0)return;
                            H.body.style.cursor = "url(" + H.options.cursorpath + "h.png),pointer";
                        } else if (d(l, o, t)) {
                            if (H.fireEvent("excludetable", l) === !0)return;
                            H.body.style.cursor = "url(" + H.options.cursorpath + "v.png),pointer";
                        } else {
                            H.body.style.cursor = "text";
                            /\d/.test(s) && (s = s.replace(/\d/, ""), o = G(o).getPreviewCell(o, "v" == s)), m(H, o ? !!s : !1, o ? s : "", i, o);
                        }
                    } else a(!1, l, H);
                } catch (h) {
                    e(h);
                }
            }

            function a(e, t, i) {
                if (e)l(t, i); else {
                    if (rt)return;
                    ut = setTimeout(function () {
                        !rt && ot && ot.parentNode && ot.parentNode.removeChild(ot);
                    }, 2e3);
                }
            }

            function l(e, t) {
                function i(i, n) {
                    clearTimeout(s), s = setTimeout(function () {
                        t.fireEvent("tableClicked", e, n);
                    }, 300);
                }

                function n() {
                    clearTimeout(s);
                    var i = G(e), n = e.rows[0].cells[0], o = i.getLastCell(), r = i.getCellsRange(n, o);
                    t.selection.getRange().setStart(n, 0).setCursor(!1, !0), i.setSelected(r);
                }

                var o = domUtils.getXY(e), r = e.ownerDocument;
                if (ot && ot.parentNode)return ot;
                ot = r.createElement("div"), ot.contentEditable = !1, ot.innerHTML = "", ot.style.cssText = "width:15px;height:15px;background-image:url(" + t.options.UEDITOR_HOME_URL + "dialogs/table/dragicon.png);position: absolute;cursor:move;top:" + (o.y - 15) + "px;left:" + o.x + "px;",
                    domUtils.unSelectable(ot), ot.onmouseover = function () {
                    rt = !0;
                }, ot.onmouseout = function () {
                    rt = !1;
                }, domUtils.on(ot, "click", function (e, t) {
                    i(t, this);
                }), domUtils.on(ot, "dblclick", function (e, t) {
                    n(t);
                }), domUtils.on(ot, "dragstart", function (e, t) {
                    domUtils.preventDefault(t);
                });
                var s;
                r.body.appendChild(ot);
            }

            function d(e, t, i, n) {
                var o = r(i), s = f(t, o);
                if (n) {
                    var a = e.getElementsByTagName("caption")[0], l = a ? a.offsetHeight : 0;
                    return "v1" == s && o.y - domUtils.getXY(e).y - l < 8;
                }
                return "h1" == s && o.x - domUtils.getXY(e).x < 8;
            }

            function c(e, t) {
                var i = G(e);
                if (i) {
                    var n = i.getSameEndPosCells(e, "x")[0], o = i.getSameStartPosXCells(e)[0], s = r(t).x, a = (n ? domUtils.getXY(n).x : domUtils.getXY(i.table).x) + 20, l = o ? domUtils.getXY(o).x + o.offsetWidth - 20 : H.body.offsetWidth + 5 || parseInt(domUtils.getComputedStyle(H.body, "width"), 10);
                    return a += F, l -= F, a > s ? a : s > l ? l : s;
                }
            }

            function u(t, i) {
                try {
                    var n = domUtils.getXY(t).y, o = r(i).y;
                    return n > o ? n : o;
                } catch (s) {
                    e(s);
                }
            }

            function m(t, i, n, o, r) {
                try {
                    t.body.style.cursor = "h" == n ? "col-resize" : "v" == n ? "row-resize" : "text", browser.ie && (!n || lt || Q(t) ? A(t) : (L(t, t.document),
                        D(n, r))), nt = i;
                } catch (s) {
                    e(s);
                }
            }

            function f(e, t) {
                var i = domUtils.getXY(e);
                return i ? i.x + e.offsetWidth - t.x < W ? "h" : t.x - i.x < W ? "h1" : i.y + e.offsetHeight - t.y < W ? "v" : t.y - i.y < W ? "v1" : "" : "";
            }

            function h(e, t) {
                if (!T())if (X = {
                        x: t.clientX,
                        y: t.clientY
                    }, 2 == t.button) {
                    var i = Q(H), n = !1;
                    if (i) {
                        var o = O(H, t);
                        utils.each(i.selectedTds, function (e) {
                            e === o && (n = !0);
                        }), n ? (o = i.selectedTds[0], setTimeout(function () {
                            H.selection.getRange().setStart(o, 0).setCursor(!1, !0);
                        }, 0)) : (Z(domUtils.getElementsByTagName(H.body, "th td")), i.clearSelected());
                    }
                } else g(t);
            }

            function p(e) {
                j = 0, e = e || H.window.event;
                var t = n(e.target || e.srcElement);
                if (t) {
                    var i;
                    if (i = f(t, r(e))) {
                        if (A(H), "h1" == i)if (i = "h", d(domUtils.findParentByTagName(t, "table"), t, e))H.execCommand("adaptbywindow"); else if (t = G(t).getPreviewCell(t)) {
                            var o = H.selection.getRange();
                            o.selectNodeContents(t).setCursor(!0, !0);
                        }
                        if ("h" == i) {
                            var s = G(t), a = s.table, l = k(t, a, !0);
                            l = b(l, "left"), s.width = s.offsetWidth;
                            var c = [], u = [];
                            utils.each(l, function (e) {
                                c.push(e.offsetWidth);
                            }), utils.each(l, function (e) {
                                e.removeAttribute("width");
                            }), window.setTimeout(function () {
                                var e = !0;
                                utils.each(l, function (t, i) {
                                    var n = t.offsetWidth;
                                    return n > c[i] ? (e = !1, !1) : void u.push(n);
                                });
                                var t = e ? u : c;
                                utils.each(l, function (e, i) {
                                    e.width = t[i] - R();
                                });
                            }, 0);
                        }
                    }
                }
            }

            function g(e) {
                if (Z(domUtils.getElementsByTagName(H.body, "td th")), utils.each(H.document.getElementsByTagName("table"), function (e) {
                        e.ueTable = null;
                    }), et = O(H, e)) {
                    var t = domUtils.findParentByTagName(et, "table", !0), i = G(t);
                    i && i.clearSelected(), nt ? v(e) : (H.document.body.style.webkitUserSelect = "", lt = !0, H.addListener("mouseover", w));
                }
            }

            function v(e) {
                browser.ie && (e = C(e)), y(), V = !0, $ = setTimeout(function () {
                    N(e);
                }, Y);
            }

            function b(e, t) {
                for (var i = [], n = null, o = 0, r = e.length; r > o; o++)n = e[o][t], n && i.push(n);
                return i;
            }

            function y() {
                $ && clearTimeout($), $ = null;
            }

            function C(e) {
                var t = ["pageX", "pageY", "clientX", "clientY", "srcElement", "target"], i = {};
                if (e)for (var n, o, r = 0; n = t[r]; r++)o = e[n], o && (i[n] = o);
                return i;
            }

            function N(e) {
                if (V = !1, et) {
                    var t = Math.abs(X.x - e.clientX) >= Math.abs(X.y - e.clientY) ? "h" : "v";
                    /\d/.test(t) && (t = t.replace(/\d/, ""), et = G(et).getPreviewCell(et, "v" == t)), A(H), L(H, H.document),
                        H.fireEvent("saveScene"), D(t, et), lt = !0, it = t, at = et;
                }
            }

            function x(e, t) {
                if (!T()) {
                    if (y(), V = !1, nt && (j = ++j % 3, X = {
                            x: t.clientX,
                            y: t.clientY
                        }, q = setTimeout(function () {
                            j > 0 && j--;
                        }, Y), 2 === j))return j = 0, void p(t);
                    if (2 != t.button) {
                        var i = this, n = i.selection.getRange(), o = domUtils.findParentByTagName(n.startContainer, "table", !0), r = domUtils.findParentByTagName(n.endContainer, "table", !0);
                        if ((o || r) && (o === r ? (o = domUtils.findParentByTagName(n.startContainer, ["td", "th", "caption"], !0),
                                r = domUtils.findParentByTagName(n.endContainer, ["td", "th", "caption"], !0), o !== r && i.selection.clearRange()) : i.selection.clearRange()),
                                lt = !1, i.document.body.style.webkitUserSelect = "", it && at) {
                            i.selection.getNative()[browser.ie9below ? "empty" : "removeAllRanges"](), j = 0, st = i.document.getElementById("ue_tableDragLine");
                            var s = domUtils.getXY(at), a = domUtils.getXY(st);
                            switch (it) {
                                case"h":
                                    E(at, a.x - s.x);
                                    break;

                                case"v":
                                    S(at, a.y - s.y - at.offsetHeight);
                            }
                            return it = "", at = null, A(i), void i.fireEvent("saveScene");
                        }
                        if (et) {
                            var l = G(et), d = l ? l.selectedTds[0] : null;
                            if (d)n = new dom.Range(i.document), domUtils.isEmptyBlock(d) ? n.setStart(d, 0).setCursor(!1, !0) : n.selectNodeContents(d).shrinkBoundary().setCursor(!1, !0); else if (n = i.selection.getRange().shrinkBoundary(),
                                    !n.collapsed) {
                                var o = domUtils.findParentByTagName(n.startContainer, ["td", "th"], !0), r = domUtils.findParentByTagName(n.endContainer, ["td", "th"], !0);
                                (o && !r || !o && r || o && r && o !== r) && n.setCursor(!1, !0);
                            }
                            et = null, i.removeListener("mouseover", w);
                        } else {
                            var c = domUtils.findParentByTagName(t.target || t.srcElement, "td", !0);
                            if (c || (c = domUtils.findParentByTagName(t.target || t.srcElement, "th", !0)), c && ("TD" == c.tagName || "TH" == c.tagName)) {
                                if (i.fireEvent("excludetable", c) === !0)return;
                                n = new dom.Range(i.document), n.setStart(c, 0).setCursor(!1, !0);
                            }
                        }
                        i._selectionChange(250, t);
                    }
                }
            }

            function w(e, t) {
                if (!T()) {
                    var i = this, n = t.target || t.srcElement;
                    if (tt = domUtils.findParentByTagName(n, "td", !0) || domUtils.findParentByTagName(n, "th", !0),
                        et && tt && ("TD" == et.tagName && "TD" == tt.tagName || "TH" == et.tagName && "TH" == tt.tagName) && domUtils.findParentByTagName(et, "table") == domUtils.findParentByTagName(tt, "table")) {
                        var o = G(tt);
                        if (et != tt) {
                            i.document.body.style.webkitUserSelect = "none", i.selection.getNative()[browser.ie9below ? "empty" : "removeAllRanges"]();
                            var r = o.getCellsRange(et, tt);
                            o.setSelected(r);
                        } else i.document.body.style.webkitUserSelect = "", o.clearSelected();
                    }
                    t.preventDefault ? t.preventDefault() : t.returnValue = !1;
                }
            }

            function U(e, t, i) {
                var n = parseInt(domUtils.getComputedStyle(e, "line-height"), 10), o = i + t;
                t = n > o ? n : o, e.style.height && (e.style.height = ""), 1 == e.rowSpan ? e.setAttribute("height", t) : e.removeAttribute && e.removeAttribute("height");
            }

            function E(e, t) {
                var i = G(e);
                if (i) {
                    var n = i.table, o = k(e, n);
                    if (n.style.width = "", n.removeAttribute("width"), t = B(t, e, o), e.nextSibling) {
                        utils.each(o, function (e) {
                            e.left.width = +e.left.width + t, e.right && (e.right.width = +e.right.width - t);
                        });
                    } else utils.each(o, function (e) {
                        e.left.width -= -t;
                    });
                }
            }

            function T() {
                return "false" === H.body.contentEditable;
            }

            function S(e, t) {
                if (!(Math.abs(t) < 10)) {
                    var i = G(e);
                    if (i)for (var n, o = i.getSameEndPosCells(e, "y"), r = o[0] ? o[0].offsetHeight : 0, s = 0; n = o[s++];)U(n, t, r);
                }
            }

            function k(e, t, i) {
                if (t || (t = domUtils.findParentByTagName(e, "table")), !t)return null;
                for (var n = (domUtils.getNodeIndex(e), e), o = t.rows, r = 0; n;)1 === n.nodeType && (r += n.colSpan || 1),
                    n = n.previousSibling;
                n = null;
                var s = [];
                return utils.each(o, function (e) {
                    var t = e.cells, n = 0;
                    utils.each(t, function (e) {
                        return n += e.colSpan || 1, n === r ? (s.push({
                            left: e,
                            right: e.nextSibling || null
                        }), !1) : n > r ? (i && s.push({
                            left: e
                        }), !1) : void 0;
                    });
                }), s;
            }

            function B(e, t, i) {
                if (e -= R(), 0 > e)return 0;
                e -= _(t);
                var n = 0 > e ? "left" : "right";
                return e = Math.abs(e), utils.each(i, function (t) {
                    var i = t[n];
                    i && (e = Math.min(e, _(i) - F));
                }), e = 0 > e ? 0 : e, "left" === n ? -e : e;
            }

            function _(e) {
                var t = 0, t = e.offsetWidth - R();
                e.nextSibling || (t -= I(e)), t = 0 > t ? 0 : t;
                try {
                    e.width = t;
                } catch (i) {
                }
                return t;
            }

            function I(e) {
                if (tab = domUtils.findParentByTagName(e, "table", !1), void 0 === tab.offsetVal) {
                    var t = e.previousSibling;
                    tab.offsetVal = t && e.offsetWidth - t.offsetWidth === K.borderWidth ? K.borderWidth : 0;
                }
                return tab.offsetVal;
            }

            function R() {
                if (void 0 === K.tabcellSpace) {
                    var e = H.document.createElement("table"), t = H.document.createElement("tbody"), i = H.document.createElement("tr"), n = H.document.createElement("td"), o = null;
                    n.style.cssText = "border: 0;", n.width = 1, i.appendChild(n), i.appendChild(o = n.cloneNode(!1)),
                        t.appendChild(i), e.appendChild(t), e.style.cssText = "visibility: hidden;", H.body.appendChild(e),
                        K.paddingSpace = n.offsetWidth - 1;
                    var r = e.offsetWidth;
                    n.style.cssText = "", o.style.cssText = "", K.borderWidth = (e.offsetWidth - r) / 3, K.tabcellSpace = K.paddingSpace + K.borderWidth,
                        H.body.removeChild(e);
                }
                return R = function () {
                    return K.tabcellSpace;
                }, K.tabcellSpace;
            }

            function L(e) {
                lt || (st = e.document.createElement("div"), domUtils.setAttributes(st, {
                    id: "ue_tableDragLine",
                    unselectable: "on",
                    contenteditable: !1,
                    onresizestart: "return false",
                    ondragstart: "return false",
                    onselectstart: "return false",
                    style: "background-color:blue;position:absolute;padding:0;margin:0;background-image:none;border:0px none;opacity:0;filter:alpha(opacity=0)"
                }), e.body.appendChild(st));
            }

            function A(e) {
                if (!lt)for (var t; t = e.document.getElementById("ue_tableDragLine");)domUtils.remove(t);
            }

            function D(e, t) {
                if (t) {
                    var i, n = domUtils.findParentByTagName(t, "table"), o = n.getElementsByTagName("caption"), r = n.offsetWidth, s = n.offsetHeight - (o.length > 0 ? o[0].offsetHeight : 0), a = domUtils.getXY(n), l = domUtils.getXY(t);
                    switch (e) {
                        case"h":
                            i = "height:" + s + "px;top:" + (a.y + (o.length > 0 ? o[0].offsetHeight : 0)) + "px;left:" + (l.x + t.offsetWidth),
                                st.style.cssText = i + "px;position: absolute;display:block;background-color:blue;width:1px;border:0; color:blue;opacity:.3;filter:alpha(opacity=30)";
                            break;

                        case"v":
                            i = "width:" + r + "px;left:" + a.x + "px;top:" + (l.y + t.offsetHeight), st.style.cssText = i + "px;overflow:hidden;position: absolute;display:block;background-color:blue;height:1px;border:0;color:blue;opacity:.2;filter:alpha(opacity=20)";
                    }
                }
            }

            function P(e, t) {
                for (var i, n, o = domUtils.getElementsByTagName(e.body, "table"), r = 0; n = o[r++];) {
                    var s = domUtils.getElementsByTagName(n, "td");
                    s[0] && (t ? (i = s[0].style.borderColor.replace(/\s/g, ""), /(#ffffff)|(rgb\(255,f55,255\))/gi.test(i) && domUtils.addClass(n, "noBorderTable")) : domUtils.removeClasses(n, "noBorderTable"));
                }
            }

            function M(e, t, i) {
                var n = e.body;
                return n.offsetWidth - (t ? 2 * parseInt(domUtils.getComputedStyle(n, "margin-left"), 10) : 0) - 2 * i.tableBorder - (e.options.offsetWidth || 0);
            }

            function O(e, t) {
                var i = domUtils.findParentByTagName(t.target || t.srcElement, ["td", "th"], !0), n = null;
                if (!i)return null;
                if (n = f(i, r(t)), !i)return null;
                if ("h1" === n && i.previousSibling) {
                    var o = domUtils.getXY(i), s = i.offsetWidth;
                    Math.abs(o.x + s - t.clientX) > s / 3 && (i = i.previousSibling);
                } else if ("v1" === n && i.parentNode.previousSibling) {
                    var o = domUtils.getXY(i), a = i.offsetHeight;
                    Math.abs(o.y + a - t.clientY) > a / 3 && (i = i.parentNode.previousSibling.firstChild);
                }
                return i && e.fireEvent("excludetable", i) !== !0 ? i : null;
            }

            var H = this, $ = null, q = null, F = 5, V = !1, W = 5, z = 10, j = 0, X = null, Y = 360, K = UE.UETable, G = function (e) {
                return K.getUETable(e);
            }, Q = function (e) {
                return K.getUETableBySelected(e);
            }, J = function (e, t) {
                return K.getDefaultValue(e, t);
            }, Z = function (e) {
                return K.removeSelectedClass(e);
            };
            H.ready(function () {
                var e = this, t = e.selection.getText;
                e.selection.getText = function () {
                    var i = Q(e);
                    if (i) {
                        var n = "";
                        return utils.each(i.selectedTds, function (e) {
                            n += e[browser.ie ? "innerText" : "textContent"];
                        }), n;
                    }
                    return t.call(e.selection);
                };
            });
            var et = null, tt = null, it = "", nt = !1, ot = null, rt = !1, st = null, at = null, lt = !1, dt = !0;
            H.setOpt({
                maxColNum: 20,
                maxRowNum: 100,
                defaultCols: 5,
                defaultRows: 5,
                tdvalign: "top",
                cursorpath: H.options.UEDITOR_HOME_URL + "themes/default/images/cursor_",
                tableDragable: !1,
                classList: ["ue-table-interlace-color-single", "ue-table-interlace-color-double"]
            }), H.getUETable = G;
            var ct = {
                deletetable: 1,
                inserttable: 1,
                cellvalign: 1,
                insertcaption: 1,
                deletecaption: 1,
                inserttitle: 1,
                deletetitle: 1,
                mergeright: 1,
                mergedown: 1,
                mergecells: 1,
                insertrow: 1,
                insertrownext: 1,
                deleterow: 1,
                insertcol: 1,
                insertcolnext: 1,
                deletecol: 1,
                splittocells: 1,
                splittorows: 1,
                splittocols: 1,
                adaptbytext: 1,
                adaptbywindow: 1,
                adaptbycustomer: 1,
                insertparagraph: 1,
                insertparagraphbeforetable: 1,
                averagedistributecol: 1,
                averagedistributerow: 1
            };
            H.ready(function () {
                utils.cssRule("table", ".selectTdClass{background-color:#edf5fa !important}table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}table{margin-bottom:10px;border-collapse:collapse;display:table;}td,th{padding: 5px 10px;border: 1px solid #DDD;}caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}th{border-top:2px solid #BBB;background:#F7F7F7;}.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }td p{margin:0;padding:0;}", H.document);
                var e, i, r;
                H.addListener("keydown", function (t, n) {
                    var s = this, a = n.keyCode || n.which;
                    if (8 == a) {
                        var l = Q(s);
                        l && l.selectedTds.length && (l.isFullCol() ? s.execCommand("deletecol") : l.isFullRow() ? s.execCommand("deleterow") : s.fireEvent("delcells"),
                            domUtils.preventDefault(n));
                        var d = domUtils.findParentByTagName(s.selection.getStart(), "caption", !0), c = s.selection.getRange();
                        if (c.collapsed && d && o(d)) {
                            s.fireEvent("saveScene");
                            var u = d.parentNode;
                            domUtils.remove(d), u && c.setStart(u.rows[0].cells[0], 0).setCursor(!1, !0), s.fireEvent("saveScene");
                        }
                    }
                    if (46 == a) {
                        var l = Q(s);
                        if (l) {
                            s.fireEvent("saveScene");
                            for (var m, f = 0; m = l.selectedTds[f++];)domUtils.fillNode(s.document, m);
                            s.fireEvent("saveScene"), domUtils.preventDefault(n);
                        }
                    }
                    if (13 == a) {
                        var h = s.selection.getRange(), d = domUtils.findParentByTagName(h.startContainer, "caption", !0);
                        if (d) {
                            var u = domUtils.findParentByTagName(d, "table");
                            return h.collapsed ? d && h.setStart(u.rows[0].cells[0], 0).setCursor(!1, !0) : (h.deleteContents(),
                                s.fireEvent("saveScene")), void domUtils.preventDefault(n);
                        }
                        if (h.collapsed) {
                            var u = domUtils.findParentByTagName(h.startContainer, "table");
                            if (u) {
                                var p = u.rows[0].cells[0], g = domUtils.findParentByTagName(s.selection.getStart(), ["td", "th"], !0), v = u.previousSibling;
                                if (p === g && (!v || 1 == v.nodeType && "TABLE" == v.tagName) && domUtils.isStartInblock(h)) {
                                    var b = domUtils.findParent(s.selection.getStart(), function (e) {
                                        return domUtils.isBlockElm(e);
                                    }, !0);
                                    b && (/t(h|d)/i.test(b.tagName) || b === g.firstChild) && (s.execCommand("insertparagraphbeforetable"),
                                        domUtils.preventDefault(n));
                                }
                            }
                        }
                    }
                    if ((n.ctrlKey || n.metaKey) && "67" == n.keyCode) {
                        e = null;
                        var l = Q(s);
                        if (l) {
                            var y = l.selectedTds;
                            i = l.isFullCol(), r = l.isFullRow(), e = [[l.cloneCell(y[0], null, !0)]];
                            for (var m, f = 1; m = y[f]; f++)m.parentNode !== y[f - 1].parentNode ? e.push([l.cloneCell(m, null, !0)]) : e[e.length - 1].push(l.cloneCell(m, null, !0));
                        }
                    }
                }), H.addListener("tablehasdeleted", function () {
                    m(this, !1, "", null), ot && domUtils.remove(ot);
                }), H.addListener("beforepaste", function (n, s) {
                    var a = this, l = a.selection.getRange();
                    if (domUtils.findParentByTagName(l.startContainer, "caption", !0)) {
                        var d = a.document.createElement("div");
                        return d.innerHTML = s.html, void(s.html = d[browser.ie9below ? "innerText" : "textContent"]);
                    }
                    var c = Q(a);
                    if (e) {
                        a.fireEvent("saveScene");
                        var u, m, l = a.selection.getRange(), f = domUtils.findParentByTagName(l.startContainer, ["td", "th"], !0);
                        if (f) {
                            var h = G(f);
                            if (r) {
                                var p = h.getCellInfo(f).rowIndex;
                                "TH" == f.tagName && p++;
                                for (var g, v = 0; g = e[v++];) {
                                    for (var b, y = h.insertRow(p++, "td"), C = 0; b = g[C]; C++) {
                                        var N = y.cells[C];
                                        N || (N = y.insertCell(C)), N.innerHTML = b.innerHTML, b.getAttribute("width") && N.setAttribute("width", b.getAttribute("width")),
                                        b.getAttribute("vAlign") && N.setAttribute("vAlign", b.getAttribute("vAlign")), b.getAttribute("align") && N.setAttribute("align", b.getAttribute("align")),
                                        b.style.cssText && (N.style.cssText = b.style.cssText);
                                    }
                                    for (var b, C = 0; (b = y.cells[C]) && g[C]; C++)b.innerHTML = g[C].innerHTML, g[C].getAttribute("width") && b.setAttribute("width", g[C].getAttribute("width")),
                                    g[C].getAttribute("vAlign") && b.setAttribute("vAlign", g[C].getAttribute("vAlign")),
                                    g[C].getAttribute("align") && b.setAttribute("align", g[C].getAttribute("align")), g[C].style.cssText && (b.style.cssText = g[C].style.cssText);
                                }
                            } else {
                                if (i) {
                                    U = h.getCellInfo(f);
                                    for (var b, x = 0, C = 0, g = e[0]; b = g[C++];)x += b.colSpan || 1;
                                    for (a.__hasEnterExecCommand = !0, v = 0; x > v; v++)a.execCommand("insertcol");
                                    a.__hasEnterExecCommand = !1, f = h.table.rows[0].cells[U.cellIndex], "TH" == f.tagName && (f = h.table.rows[1].cells[U.cellIndex]);
                                }
                                for (var g, v = 0; g = e[v++];) {
                                    u = f;
                                    for (var b, C = 0; b = g[C++];)if (f)f.innerHTML = b.innerHTML, b.getAttribute("width") && f.setAttribute("width", b.getAttribute("width")),
                                    b.getAttribute("vAlign") && f.setAttribute("vAlign", b.getAttribute("vAlign")), b.getAttribute("align") && f.setAttribute("align", b.getAttribute("align")),
                                    b.style.cssText && (f.style.cssText = b.style.cssText), m = f, f = f.nextSibling; else {
                                        var w = b.cloneNode(!0);
                                        domUtils.removeAttributes(w, ["class", "rowSpan", "colSpan"]), m.parentNode.appendChild(w);
                                    }
                                    if (f = h.getNextCell(u, !0, !0), !e[v])break;
                                    if (!f) {
                                        var U = h.getCellInfo(u);
                                        h.table.insertRow(h.table.rows.length), h.update(), f = h.getVSideCell(u, !0);
                                    }
                                }
                            }
                            h.update();
                        } else {
                            c = a.document.createElement("table");
                            for (var g, v = 0; g = e[v++];) {
                                for (var b, y = c.insertRow(c.rows.length), C = 0; b = g[C++];)w = K.cloneCell(b, null, !0), domUtils.removeAttributes(w, ["class"]),
                                    y.appendChild(w);
                                2 == C && w.rowSpan > 1 && (w.rowSpan = 1);
                            }
                            var E = J(a), T = a.body.offsetWidth - (dt ? 2 * parseInt(domUtils.getComputedStyle(a.body, "margin-left"), 10) : 0) - 2 * E.tableBorder - (a.options.offsetWidth || 0);
                            a.execCommand("insertHTML", "<table  " + (i && r ? 'width="' + T + '"' : "") + ">" + c.innerHTML.replace(/>\s*</g, "><").replace(/\bth\b/gi, "td") + "</table>");
                        }
                        return a.fireEvent("contentchange"), a.fireEvent("saveScene"), s.html = "", !0;
                    }
                    var S, d = a.document.createElement("div");
                    d.innerHTML = s.html, S = d.getElementsByTagName("table"), domUtils.findParentByTagName(a.selection.getStart(), "table") ? (utils.each(S, function (e) {
                        domUtils.remove(e);
                    }), domUtils.findParentByTagName(a.selection.getStart(), "caption", !0) && (d.innerHTML = d[browser.ie ? "innerText" : "textContent"])) : utils.each(S, function (e) {
                        t(e, !0), domUtils.removeAttributes(e, ["style", "border"]), utils.each(domUtils.getElementsByTagName(e, "td"), function (e) {
                            o(e) && domUtils.fillNode(a.document, e), t(e, !0);
                        });
                    }), s.html = d.innerHTML;
                }), H.addListener("afterpaste", function () {
                    utils.each(domUtils.getElementsByTagName(H.body, "table"), function (e) {
                        if (e.offsetWidth > H.body.offsetWidth) {
                            var t = J(H, e);
                            e.style.width = H.body.offsetWidth - (dt ? 2 * parseInt(domUtils.getComputedStyle(H.body, "margin-left"), 10) : 0) - 2 * t.tableBorder - (H.options.offsetWidth || 0) + "px";
                        }
                    });
                }), H.addListener("blur", function () {
                    e = null;
                });
                var l;
                H.addListener("keydown", function () {
                    clearTimeout(l), l = setTimeout(function () {
                        var e = H.selection.getRange(), t = domUtils.findParentByTagName(e.startContainer, ["th", "td"], !0);
                        if (t) {
                            var i = t.parentNode.parentNode.parentNode;
                            i.offsetWidth > i.getAttribute("width") && (t.style.wordBreak = "break-all");
                        }
                    }, 100);
                }), H.addListener("selectionchange", function () {
                    m(H, !1, "", null);
                }), H.addListener("contentchange", function () {
                    var e = this;
                    if (A(e), !Q(e)) {
                        var t = e.selection.getRange(), i = t.startContainer;
                        i = domUtils.findParentByTagName(i, ["td", "th"], !0), utils.each(domUtils.getElementsByTagName(e.document, "table"), function (t) {
                            e.fireEvent("excludetable", t) !== !0 && (t.ueTable = new K(t), utils.each(domUtils.getElementsByTagName(e.document, "td"), function (t) {
                                domUtils.isEmptyBlock(t) && t !== i && (domUtils.fillNode(e.document, t), browser.ie && 6 == browser.version && (t.innerHTML = "&nbsp;"));
                            }), utils.each(domUtils.getElementsByTagName(e.document, "th"), function (t) {
                                domUtils.isEmptyBlock(t) && t !== i && (domUtils.fillNode(e.document, t), browser.ie && 6 == browser.version && (t.innerHTML = "&nbsp;"));
                            }), t.onmouseover = function () {
                                e.fireEvent("tablemouseover", t);
                            }, t.onmousemove = function () {
                                e.fireEvent("tablemousemove", t), e.options.tableDragable && a(!0, this, e);
                            }, t.onmouseout = function () {
                                e.fireEvent("tablemouseout", t), m(e, !1, "", null), A(e);
                            }, t.onclick = function (t) {
                                t = e.window.event || t;
                                var i = n(t.target || t.srcElement);
                                if (i) {
                                    var o, r = G(i), s = r.table, a = r.getCellInfo(i), l = e.selection.getRange();
                                    if (d(s, i, t, !0)) {
                                        var c = r.getCell(r.indexTable[r.rowsNum - 1][a.colIndex].rowIndex, r.indexTable[r.rowsNum - 1][a.colIndex].cellIndex);
                                        return void(t.shiftKey && r.selectedTds.length ? r.selectedTds[0] !== c ? (o = r.getCellsRange(r.selectedTds[0], c),
                                            r.setSelected(o)) : l && l.selectNodeContents(c).select() : i !== c ? (o = r.getCellsRange(i, c),
                                            r.setSelected(o)) : l && l.selectNodeContents(c).select());
                                    }
                                    if (d(s, i, t)) {
                                        var u = r.getCell(r.indexTable[a.rowIndex][r.colsNum - 1].rowIndex, r.indexTable[a.rowIndex][r.colsNum - 1].cellIndex);
                                        t.shiftKey && r.selectedTds.length ? r.selectedTds[0] !== u ? (o = r.getCellsRange(r.selectedTds[0], u),
                                            r.setSelected(o)) : l && l.selectNodeContents(u).select() : i !== u ? (o = r.getCellsRange(i, u),
                                            r.setSelected(o)) : l && l.selectNodeContents(u).select();
                                    }
                                }
                            });
                        }), P(e, !0);
                    }
                }), domUtils.on(H.document, "mousemove", s), domUtils.on(H.document, "mouseout", function (e) {
                    var t = e.target || e.srcElement;
                    "TABLE" == t.tagName && m(H, !1, "", null);
                }), H.addListener("interlacetable", function (e, t, i) {
                    if (t)for (var n = this, o = t.rows, r = o.length, s = function (e, t, i) {
                        return e[t] ? e[t] : i ? e[t % e.length] : "";
                    }, a = 0; r > a; a++)o[a].className = s(i || n.options.classList, a, !0);
                }), H.addListener("uninterlacetable", function (e, t) {
                    if (t)for (var i = this, n = t.rows, o = i.options.classList, r = n.length, s = 0; r > s; s++)domUtils.removeClasses(n[s], o);
                }), H.addListener("mousedown", h), H.addListener("mouseup", x), domUtils.on(H.body, "dragstart", function (e) {
                    x.call(H, "dragstart", e);
                });
                var c = 0;
                H.addListener("mousedown", function () {
                    c = 0;
                }), H.addListener("tabkeydown", function () {
                    var e = this.selection.getRange(), t = e.getCommonAncestor(!0, !0), i = domUtils.findParentByTagName(t, "table");
                    if (i) {
                        if (domUtils.findParentByTagName(t, "caption", !0)) {
                            var n = domUtils.getElementsByTagName(i, "th td");
                            n && n.length && e.setStart(n[0], 0).setCursor(!1, !0);
                        } else {
                            var n = domUtils.findParentByTagName(t, ["td", "th"], !0), r = G(n);
                            c = n.rowSpan > 1 ? c : r.getCellInfo(n).rowIndex;
                            var s = r.getTabNextCell(n, c);
                            s ? o(s) ? e.setStart(s, 0).setCursor(!1, !0) : e.selectNodeContents(s).select() : (H.fireEvent("saveScene"),
                                H.__hasEnterExecCommand = !0, this.execCommand("insertrownext"), H.__hasEnterExecCommand = !1,
                                e = this.selection.getRange(), e.setStart(i.rows[i.rows.length - 1].cells[0], 0).setCursor(),
                                H.fireEvent("saveScene"));
                        }
                        return !0;
                    }
                }), browser.ie && H.addListener("selectionchange", function () {
                    m(this, !1, "", null);
                }), H.addListener("keydown", function (e, t) {
                    var i = this, n = t.keyCode || t.which;
                    if (8 != n && 46 != n) {
                        var o = !(t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
                        o && Z(domUtils.getElementsByTagName(i.body, "td"));
                        var r = Q(i);
                        r && o && r.clearSelected();
                    }
                }), H.addListener("beforegetcontent", function () {
                    P(this, !1), browser.ie && utils.each(this.document.getElementsByTagName("caption"), function (e) {
                        domUtils.isEmptyNode(e) && (e.innerHTML = "&nbsp;");
                    });
                }), H.addListener("aftergetcontent", function () {
                    P(this, !0);
                }), H.addListener("getAllHtml", function () {
                    Z(H.document.getElementsByTagName("td"));
                }), H.addListener("fullscreenchanged", function (e, t) {
                    if (!t) {
                        var i = this.body.offsetWidth / document.body.offsetWidth, n = domUtils.getElementsByTagName(this.body, "table");
                        utils.each(n, function (e) {
                            if (e.offsetWidth < H.body.offsetWidth)return !1;
                            var t = domUtils.getElementsByTagName(e, "td"), n = [];
                            utils.each(t, function (e) {
                                n.push(e.offsetWidth);
                            });
                            for (var o, r = 0; o = t[r]; r++)o.setAttribute("width", Math.floor(n[r] * i));
                            e.setAttribute("width", Math.floor(M(H, dt, J(H))));
                        });
                    }
                });
                var u = H.execCommand;
                H.execCommand = function (e) {
                    var t = this;
                    e = e.toLowerCase();
                    var i, n, r = Q(t), s = new dom.Range(t.document), a = t.commands[e] || UE.commands[e];
                    if (a) {
                        if (!r || ct[e] || a.notNeedUndo || t.__hasEnterExecCommand)n = u.apply(t, arguments); else {
                            t.__hasEnterExecCommand = !0, t.fireEvent("beforeexeccommand", e), i = r.selectedTds;
                            for (var l, d, c, m = -2, f = -2, h = 0; c = i[h]; h++)o(c) ? s.setStart(c, 0).setCursor(!1, !0) : s.selectNode(c).select(!0),
                                d = t.queryCommandState(e), l = t.queryCommandValue(e), -1 != d && ((m !== d || f !== l) && (t._ignoreContentChange = !0,
                                n = u.apply(t, arguments), t._ignoreContentChange = !1), m = t.queryCommandState(e), f = t.queryCommandValue(e),
                            domUtils.isEmptyBlock(c) && domUtils.fillNode(t.document, c));
                            s.setStart(i[0], 0).shrinkBoundary(!0).setCursor(!1, !0), t.fireEvent("contentchange"),
                                t.fireEvent("afterexeccommand", e), t.__hasEnterExecCommand = !1, t._selectionChange();
                        }
                        return n;
                    }
                };
            });
            var ut;
        }, UE.plugins.contextmenu = function () {
            var e, t = this, i = t.getLang("contextMenu"), n = t.options.contextMenu;
            if (n.length) {
                var o = UE.ui.uiUtils;
                t.addListener("contextmenu", function (r, s) {
                    var a = o.getViewportOffsetByEvent(s);
                    t.fireEvent("beforeselectionchange"), e && e.destroy();
                    for (var l, d = 0, c = []; l = n[d]; d++) {
                        var u;
                        !function (e) {
                            function n() {
                                switch (e.icon) {
                                    case"table":
                                        return t.getLang("contextMenu.table");

                                    case"justifyjustify":
                                        return t.getLang("contextMenu.paragraph");

                                    case"aligntd":
                                        return t.getLang("contextMenu.aligntd");

                                    case"aligntable":
                                        return t.getLang("contextMenu.aligntable");

                                    case"tablesort":
                                        return i.tablesort;

                                    case"borderBack":
                                        return i.borderbk;

                                    default:
                                        return "";
                                }
                            }

                            if ("-" == e)(u = c[c.length - 1]) && "-" !== u && c.push("-"); else if (e.hasOwnProperty("group")) {
                                for (var o, r = 0, s = []; o = e.subMenu[r]; r++)!function (e) {
                                    "-" == e ? (u = s[s.length - 1]) && "-" !== u ? s.push("-") : s.splice(s.length - 1) : (t.commands[e.cmdName] || UE.commands[e.cmdName] || e.query) && (e.query ? e.query() : t.queryCommandState(e.cmdName)) > -1 && s.push({
                                        label: e.label || t.getLang("contextMenu." + e.cmdName + (e.value || "")) || "",
                                        className: "edui-for-" + e.cmdName + (e.className ? " edui-for-" + e.cmdName + "-" + e.className : ""),
                                        onclick: e.exec ? function () {
                                            !!e.cmdName && t.fireEvent("funcPvUvReport", "menu_" + e.cmdName), e.exec.call(t);
                                        } : function () {
                                            t.fireEvent("funcPvUvReport", "menu_" + e.cmdName + (e.value || "")), t.execCommand(e.cmdName, e.value);
                                        }
                                    });
                                }(o);
                                s.length && c.push({
                                    label: n(),
                                    className: "edui-for-" + e.icon,
                                    subMenu: {
                                        items: s,
                                        editor: t
                                    }
                                });
                            } else if ((t.commands[e.cmdName] || UE.commands[e.cmdName] || e.query) && (e.query ? e.query.call(t) : t.queryCommandState(e.cmdName)) > -1) {
                                if ("highlightcode" == e.cmdName) {
                                    if (1 == t.queryCommandState(e.cmdName) && "deletehighlightcode" != e.icon)return;
                                    if (1 != t.queryCommandState(e.cmdName) && "deletehighlightcode" == e.icon)return;
                                }
                                c.push({
                                    label: e.label || t.getLang("contextMenu." + e.cmdName),
                                    className: "edui-for-" + (e.icon ? e.icon : e.cmdName + (e.value || "")),
                                    onclick: e.exec ? function () {
                                        !!e.cmdName && t.fireEvent("funcPvUvReport", "menu_" + e.cmdName), e.exec.call(t);
                                    } : function () {
                                        t.fireEvent("funcPvUvReport", "menu_" + e.cmdName + (e.value || "")), t.execCommand(e.cmdName, e.value);
                                    }
                                });
                            }
                        }(l);
                    }
                    if ("-" == c[c.length - 1] && c.pop(), e = new UE.ui.Menu({
                            items: c,
                            className: "edui-contextmenu",
                            editor: t
                        }), e.render(), e.showAt(a), t.fireEvent("funcPvUvReport", "contextmenu"), t.fireEvent("aftershowcontextmenu", e),
                            domUtils.preventDefault(s), browser.ie) {
                        var m;
                        try {
                            m = t.selection.getNative().createRange();
                        } catch (f) {
                            return;
                        }
                        if (m.item) {
                            var h = new dom.Range(t.document);
                            h.selectNode(m.item(0)).select(!0, !0);
                        }
                    }
                });
            }
        }, UE.plugins.shortcutmenu = function () {
            var e, t = this, i = t.options.shortcutMenu || [];
            i.length && (t.addListener("contextmenu mouseup", function (t, n) {
                var o = this, r = {
                    type: t,
                    target: n.target || n.srcElement,
                    screenX: n.screenX,
                    screenY: n.screenY,
                    clientX: n.clientX,
                    clientY: n.clientY
                };
                if (setTimeout(function () {
                        var n = o.selection.getRange();
                        (n.collapsed === !1 || "contextmenu" == t) && (e || (e = new baidu.editor.ui.ShortCutMenu({
                            editor: o,
                            items: i,
                            theme: o.options.theme,
                            className: "edui-shortcutmenu"
                        }), e.render(), o.fireEvent("afterrendershortcutmenu", e)), e.show(r, !!UE.plugins.contextmenu));
                    }), "contextmenu" == t && (domUtils.preventDefault(n), browser.ie9below)) {
                    var s;
                    try {
                        s = o.selection.getNative().createRange();
                    } catch (n) {
                        return;
                    }
                    if (s.item) {
                        var a = new dom.Range(o.document);
                        a.selectNode(s.item(0)).select(!0, !0);
                    }
                }
                "keydown" == t && e && !e.isHidden && e.hide();
            }), t.addListener("keydown", function (t) {
                "keydown" == t && e && !e.isHidden && e.hide();
            }));
        }, UE.plugins.basestyle = function () {
            var e = {
                bold: ["strong", "b"],
                italic: ["em", "i"],
                subscript: ["sub"],
                superscript: ["sup"]
            }, t = function (e, t) {
                return domUtils.filterNodeList(e.selection.getStartElementPath(), t);
            }, i = this;
            i.addshortcutkey({
                Bold: "ctrl+66",
                Italic: "ctrl+73",
                Underline: "ctrl+85"
            }), i.addInputRule(function (e) {
                utils.each(e.getNodesByTagName("b i"), function (e) {
                    switch (e.tagName) {
                        case"b":
                            e.tagName = "strong";
                            break;

                        case"i":
                            e.tagName = "em";
                    }
                });
            });
            for (var n in e)!function (e, n) {
                i.commands[e] = {
                    execCommand: function (e) {
                        var o = i.selection.getRange(), r = t(this, n);
                        if (o.collapsed) {
                            if (r) {
                                var s = i.document.createTextNode("");
                                o.insertNode(s).removeInlineStyle(n), o.setStartBefore(s), domUtils.remove(s);
                            } else {
                                var a = o.document.createElement(n[0]);
                                ("superscript" == e || "subscript" == e) && (s = i.document.createTextNode(""), o.insertNode(s).removeInlineStyle(["sub", "sup"]).setStartBefore(s).collapse(!0)),
                                    o.insertNode(a).setStart(a, 0);
                            }
                            o.collapse(!0);
                        } else("superscript" == e || "subscript" == e) && (r && r.tagName.toLowerCase() == e || o.removeInlineStyle(["sub", "sup"])),
                            r ? o.removeInlineStyle(n) : o.applyInlineStyle(n[0]);
                        o.select();
                    },
                    queryCommandState: function () {
                        return t(this, n) ? 1 : 0;
                    }
                };
            }(n, e[n]);
        }, UE.plugins.elementpath = function () {
            var e, t, i = this;
            i.setOpt("elementPathEnabled", !0), i.options.elementPathEnabled && (i.commands.elementpath = {
                execCommand: function (n, o) {
                    var r = t[o], s = i.selection.getRange();
                    e = 1 * o, s.selectNode(r).select();
                },
                queryCommandValue: function () {
                    var i = [].concat(this.selection.getStartElementPath()).reverse(), n = [];
                    t = i;
                    for (var o, r = 0; o = i[r]; r++)if (3 != o.nodeType) {
                        var s = o.tagName.toLowerCase();
                        if ("img" == s && o.getAttribute("anchorname") && (s = "anchor"), n[r] = s, e == r) {
                            e = -1;
                            break;
                        }
                    }
                    return n;
                }
            });
        }, UE.plugins.formatmatch = function () {
            function e(r, s) {
                function a(e) {
                    return m && e.selectNode(m), e.applyInlineStyle(n[n.length - 1].tagName, null, n);
                }

                if (browser.webkit)var l = "IMG" == s.target.tagName ? s.target : null;
                i.undoManger && i.undoManger.save();
                var d = i.selection.getRange(), c = l || d.getClosedNode();
                if (t && c && "IMG" == c.tagName)c.style.cssText += ";float:" + (t.style.cssFloat || t.style.styleFloat || "none") + ";display:" + (t.style.display || "inline"),
                    t = null; else if (!t) {
                    var u = d.collapsed;
                    if (u) {
                        var m = i.document.createTextNode("match");
                        d.insertNode(m).select();
                    }
                    i.__hasEnterExecCommand = !0;
                    var f = i.options.removeFormatAttributes;
                    i.options.removeFormatAttributes = "", i.execCommand("removeformat"), i.options.removeFormatAttributes = f,
                        i.__hasEnterExecCommand = !1, d = i.selection.getRange(), n.length && a(d), m && d.setStartBefore(m).collapse(!0),
                        d.select(), m && domUtils.remove(m);
                }
                i.undoManger && i.undoManger.save(), i.removeListener("mouseup", e), o = 0;
            }

            var t, i = this, n = [], o = 0;
            i.addListener("reset", function () {
                n = [], o = 0;
            }), i.commands.formatmatch = {
                execCommand: function () {
                    if (o)return o = 0, n = [], void i.removeListener("mouseup", e);
                    var r = i.selection.getRange();
                    if (t = r.getClosedNode(), !t || "IMG" != t.tagName) {
                        r.collapse(!0).shrinkBoundary();
                        var s = r.startContainer;
                        n = domUtils.findParents(s, !0, function (e) {
                            return !domUtils.isBlockElm(e) && 1 == e.nodeType;
                        });
                        for (var a, l = 0; a = n[l]; l++)if ("A" == a.tagName) {
                            n.splice(l, 1);
                            break;
                        }
                    }
                    i.addListener("mouseup", e), o = 1;
                },
                queryCommandState: function () {
                    return o;
                },
                notNeedUndo: 1
            };
        }, UE.plugins.customstyle = function () {
            var e = this;
            e.setOpt({
                customstyle: [{
                    tag: "h1",
                    name: "tc",
                    style: "font-size:32px;font-weight:bold;border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;"
                }, {
                    tag: "h1",
                    name: "tl",
                    style: "font-size:32px;font-weight:bold;border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:left;margin:0 0 10px 0;"
                }, {
                    tag: "span",
                    name: "im",
                    style: "font-size:16px;font-style:italic;font-weight:bold;line-height:18px;"
                }, {
                    tag: "span",
                    name: "hi",
                    style: "font-size:16px;font-style:italic;font-weight:bold;color:rgb(51, 153, 204);line-height:18px;"
                }]
            }), e.commands.customstyle = {
                execCommand: function (e, t) {
                    var i, n, o = this, r = t.tag, s = domUtils.findParent(o.selection.getStart(), function (e) {
                        return e.getAttribute("label");
                    }, !0), a = {};
                    for (var l in t)void 0 !== t[l] && (a[l] = t[l]);
                    if (delete a.tag, s && s.getAttribute("label") == t.label) {
                        if (i = this.selection.getRange(), n = i.createBookmark(), i.collapsed)if (dtd.$block[s.tagName]) {
                            var d = o.document.createElement("p");
                            domUtils.moveChild(s, d), s.parentNode.insertBefore(d, s), domUtils.remove(s);
                        } else domUtils.remove(s, !0); else {
                            var c = domUtils.getCommonAncestor(n.start, n.end), u = domUtils.getElementsByTagName(c, r);
                            new RegExp(r, "i").test(c.tagName) && u.push(c);
                            for (var m, f = 0; m = u[f++];)if (m.getAttribute("label") == t.label) {
                                var h = domUtils.getPosition(m, n.start), p = domUtils.getPosition(m, n.end);
                                if ((h & domUtils.POSITION_FOLLOWING || h & domUtils.POSITION_CONTAINS) && (p & domUtils.POSITION_PRECEDING || p & domUtils.POSITION_CONTAINS) && dtd.$block[r]) {
                                    var d = o.document.createElement("p");
                                    domUtils.moveChild(m, d), m.parentNode.insertBefore(d, m);
                                }
                                domUtils.remove(m, !0);
                            }
                            s = domUtils.findParent(c, function (e) {
                                return e.getAttribute("label") == t.label;
                            }, !0), s && domUtils.remove(s, !0);
                        }
                        i.moveToBookmark(n).select();
                    } else if (dtd.$block[r]) {
                        if (this.execCommand("paragraph", r, a, "customstyle"), i = o.selection.getRange(), !i.collapsed) {
                            i.collapse(), s = domUtils.findParent(o.selection.getStart(), function (e) {
                                return e.getAttribute("label") == t.label;
                            }, !0);
                            var g = o.document.createElement("p");
                            domUtils.insertAfter(s, g), domUtils.fillNode(o.document, g), i.setStart(g, 0).setCursor();
                        }
                    } else {
                        if (i = o.selection.getRange(), i.collapsed)return s = o.document.createElement(r), domUtils.setAttributes(s, a),
                            void i.insertNode(s).setStart(s, 0).setCursor();
                        n = i.createBookmark(), i.applyInlineStyle(r, a).moveToBookmark(n).select();
                    }
                },
                queryCommandValue: function () {
                    var e = domUtils.filterNodeList(this.selection.getStartElementPath(), function (e) {
                        return e.getAttribute("label");
                    });
                    return e ? e.getAttribute("label") : "";
                }
            }, e.addListener("keyup", function (t, i) {
                var n = i.keyCode || i.which;
                if (32 == n || 13 == n) {
                    var o = e.selection.getRange();
                    if (o.collapsed) {
                        var r = domUtils.findParent(e.selection.getStart(), function (e) {
                            return e.getAttribute("label");
                        }, !0);
                        if (r && dtd.$block[r.tagName] && domUtils.isEmptyNode(r)) {
                            var s = e.document.createElement("p");
                            domUtils.insertAfter(r, s), domUtils.fillNode(e.document, s), domUtils.remove(r), o.setStart(s, 0).setCursor();
                        }
                    }
                }
            });
        }, UE.plugins.catchremoteimage = function () {
            function getuid() {
                return id++;
            }

            function catchremoteimage(e, t) {
                var i = e.join(separater), n = {
                    timeout: 6e4,
                    onsuccess: function () {
                        me.fireEvent("funcPvUvReport", "remoteimgsuc"), "function" == typeof t.success && t.success.apply(this, arguments);
                    },
                    onerror: function () {
                        me.fireEvent("funcPvUvReport", "remoteimgerr"), "function" == typeof t.error && t.error.apply(this, arguments);
                    }
                };
                try {
                    n[me.options.catchFieldName] = encodeURI(decodeURIComponent(i));
                } catch (o) {
                    n[me.options.catchFieldName] = i;
                }
                n.t = "ajax-editor-upload-img", ajax.request(catcherUrl, n);
            }

            function isLocalDomain(e, t) {
                for (var i, n = 0; i = t[n++];)if (-1 !== e.search(i))return !0;
                return !1;
            }

            function http2https(e, t) {
                function i(e) {
                    e = e || "";
                    var t = e.match(/[?|&]wx_fmt=(.*?)[&|$]/) || [];
                    return t = t[1] || "", e = e.http2https().replace(/\?.*$/, "?"), t && e && (e = e + "wx_fmt=" + t),
                    {
                        url: e,
                        format: t
                    };
                }

                for (var n = 0, o = e.length; o > n; n++) {
                    var r, s = e[n];
                    if ("img" == t) {
                        var a = s.getAttribute("src") || "";
                        if (!/^http:\/\/mmbiz.qpic.cn/.test(a))continue;
                        var l = i(a);
                        s.setAttribute("src", l.url), !!l.format && s.setAttribute("data-type", l.format), s.removeAttribute("_src"),
                            s.removeAttribute("data-src");
                    } else if ("bg" == t && (r = s.style.backgroundImage || "")) {
                        if (!/^http:\/\/mmbiz.qpic.cn/.test(r))continue;
                        s.style.backgroundImage = i(r).url;
                    }
                }
            }

            if (this.options.catchRemoteImageEnable) {
                var me = this;
                this.setOpt({
                    localDomain: ["127.0.0.1", "localhost", "mmbiz.qpic.cn", "mmbiz.qlogo.cn", "m.qpic.cn", /^http\:\/\/(a|b)(\d)+\.photo\.store\.qq\.com/g, "mmsns.qpic.cn"],
                    separater: "ue_separate_ue",
                    catchFieldName: "upfile",
                    catchRemoteImageEnable: !0
                });
                var ajax = UE.ajax, localDomain = me.options.localDomain, catcherUrl = me.options.catcherUrl, separater = me.options.separater, id = +new Date;
                me.addListener("afterpaste aftersetcontent", function (e, t, i) {
                    for (var n, o, r, s, a = [], l = !1, d = 0; s = i[d++];) {
                        n = "img" == s.tagName.toLowerCase() ? [s] : domUtils.getElementsByTagName(s, "img"), http2https(n, "img");
                        for (var c, u = 0; c = n[u++];)r = c.getAttribute("_src") || c.src || "", me.fireEvent("catchRemoteImage", [c], "img", r),
                            l = !0;
                        for (a = [s], a.push.apply(a, domUtils.getElementsByTagName(s, "*")), http2https(a, "bg"),
                                 u = 0; c = a[u++];)o = c.getAttribute("style") || "", o = c.style.cssText || "", o = o.match(/;?\s*(background|background-image)\s*\:[^;]*?url\(([^\)]+)\)/),
                        o && o[2] && (r = o[2].replace(/^['"]|['"]$/g, ""), me.fireEvent("catchRemoteImage", [c], "bg", r),
                            l = !0);
                    }
                    "afterpaste" == e && l && me.fireEvent("begincatchimage");
                }), me.addListener("catchRemoteImage", function (cmd, eles, type, url) {
                    for (var remoteImages = [], uid = "c" + getuid(), i = 0, ci; ci = eles[i++];)"img" == type && ci.getAttribute("word_img") || /^(https?|ftp):/i.test(url) && !isLocalDomain(url, localDomain) && remoteImages.push(url);
                    domUtils.removeClasses(eles[0], "js_catchingremoteimage"), remoteImages.length && (domUtils.addClass(eles[0], "js_catchingremoteimage"),
                        domUtils.setAttributes(eles[0], {
                            id: uid
                        }), catchremoteimage(remoteImages, {
                        success: function (xhr) {
                            try {
                                var info = eval("(" + xhr.responseText + ")");
                            } catch (e) {
                                return;
                            }
                            info && (0 != info.errcode ? "img" == type ? me.fireEvent("catchremoteerror", uid, type, info.error) : me.fireEvent("catchremotesuccess", uid, remoteImages[0], "", "", type) : me.fireEvent("catchremotesuccess", uid, remoteImages[0], info.url, info.img_format, type));
                        },
                        error: function () {
                            "img" == type ? me.fireEvent("catchremoteerror", uid, type) : me.fireEvent("catchremotesuccess", uid, remoteImages[0], "", "", type);
                        }
                    }));
                });
            }
        }, UE.commands.insertparagraph = {
            execCommand: function (e, t) {
                for (var i, n = this, o = n.selection.getRange(), r = o.startContainer; r && !domUtils.isBody(r);)i = r,
                    r = r.parentNode;
                if (i) {
                    var s = n.document.createElement("p");
                    t ? i.parentNode.insertBefore(s, i) : i.parentNode.insertBefore(s, i.nextSibling), domUtils.fillNode(n.document, s),
                        o.setStart(s, 0).setCursor(!1, !0);
                }
            }
        };
        var baidu = baidu || {};
        baidu.editor = baidu.editor || {}, baidu.editor.ui = {}, function () {
            function e() {
                var e = document.getElementById("edui_fixedlayer");
                l.setViewportOffset(e, {
                    left: 0,
                    top: 0
                });
            }

            function t() {
                n.on(window, "scroll", e), n.on(window, "resize", baidu.editor.utils.defer(e, 0, !0));
            }

            var i = baidu.editor.browser, n = baidu.editor.dom.domUtils, o = "$EDITORUI", r = window[o] = {}, s = "ID" + o, a = 0, l = baidu.editor.ui.uiUtils = {
                uid: function (e) {
                    return e ? e[s] || (e[s] = ++a) : ++a;
                },
                hook: function (e, t) {
                    var i;
                    return e && e._callbacks ? i = e : (i = function () {
                        var t;
                        e && (t = e.apply(this, arguments));
                        for (var n = i._callbacks, o = n.length; o--;) {
                            var r = n[o].apply(this, arguments);
                            void 0 === t && (t = r);
                        }
                        return t;
                    }, i._callbacks = []), i._callbacks.push(t), i;
                },
                createElementByHtml: function (e) {
                    var t = document.createElement("div");
                    return t.innerHTML = e, t = t.firstChild, t.parentNode.removeChild(t), t;
                },
                getViewportElement: function () {
                    return i.ie && i.quirks ? document.body : document.documentElement;
                },
                getClientRect: function (e) {
                    var t;
                    try {
                        t = e.getBoundingClientRect();
                    } catch (i) {
                        t = {
                            left: 0,
                            top: 0,
                            height: 0,
                            width: 0
                        };
                    }
                    for (var o, r = {
                        left: Math.round(t.left),
                        top: Math.round(t.top),
                        height: Math.round(t.bottom - t.top),
                        width: Math.round(t.right - t.left)
                    }; (o = e.ownerDocument) !== document && (e = n.getWindow(o).frameElement);)t = e.getBoundingClientRect(),
                        r.left += t.left, r.top += t.top;
                    return r.bottom = r.top + r.height, r.right = r.left + r.width, r;
                },
                getViewportRect: function () {
                    var e = l.getViewportElement(), t = 0 | (window.innerWidth || e.clientWidth), i = 0 | (window.innerHeight || e.clientHeight);
                    return {
                        left: 0,
                        top: 0,
                        height: i,
                        width: t,
                        bottom: i,
                        right: t
                    };
                },
                setViewportOffset: function (e, t) {
                    var i = l.getFixedLayer();
                    e.parentNode === i ? (e.style.left = t.left + "px", e.style.top = t.top + "px") : n.setViewportOffset(e, t);
                },
                getEventOffset: function (e) {
                    var t = e.target || e.srcElement, i = l.getClientRect(t), n = l.getViewportOffsetByEvent(e);
                    return {
                        left: n.left - i.left,
                        top: n.top - i.top
                    };
                },
                getViewportOffsetByEvent: function (e) {
                    var t = e.target || e.srcElement, i = n.getWindow(t).frameElement, o = {
                        left: e.clientX,
                        top: e.clientY
                    };
                    if (i && t.ownerDocument !== document) {
                        var r = l.getClientRect(i);
                        o.left += r.left, o.top += r.top;
                    }
                    return o;
                },
                setGlobal: function (e, t) {
                    return r[e] = t, o + '["' + e + '"]';
                },
                unsetGlobal: function (e) {
                    delete r[e];
                },
                copyAttributes: function (e, t) {
                    for (var o = t.attributes, r = o.length; r--;) {
                        var s = o[r];
                        "style" == s.nodeName || "class" == s.nodeName || i.ie && !s.specified || e.setAttribute(s.nodeName, s.nodeValue);
                    }
                    t.className && n.addClass(e, t.className), t.style.cssText && (e.style.cssText += ";" + t.style.cssText);
                },
                removeStyle: function (e, t) {
                    if (e.style.removeProperty)e.style.removeProperty(t); else {
                        if (!e.style.removeAttribute)throw"";
                        e.style.removeAttribute(t);
                    }
                },
                contains: function (e, t) {
                    return e && t && (e === t ? !1 : e.contains ? e.contains(t) : 16 & e.compareDocumentPosition(t));
                },
                startDrag: function (e, t, i) {
                    function n(e) {
                        var i = e.clientX - s, n = e.clientY - a;
                        t.ondragmove(i, n, e), e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
                    }

                    function o() {
                        i.removeEventListener("mousemove", n, !0), i.removeEventListener("mouseup", o, !0), window.removeEventListener("mouseup", o, !0),
                            t.ondragstop();
                    }

                    function r() {
                        l.releaseCapture(), l.detachEvent("onmousemove", n), l.detachEvent("onmouseup", r), l.detachEvent("onlosecaptrue", r),
                            t.ondragstop();
                    }

                    var i = i || document, s = e.clientX, a = e.clientY;
                    if (i.addEventListener)i.addEventListener("mousemove", n, !0), i.addEventListener("mouseup", o, !0),
                        window.addEventListener("mouseup", o, !0), e.preventDefault(); else {
                        var l = e.srcElement;
                        l.setCapture(), l.attachEvent("onmousemove", n), l.attachEvent("onmouseup", r), l.attachEvent("onlosecaptrue", r),
                            e.returnValue = !1;
                    }
                    t.ondragstart();
                },
                getFixedLayer: function () {
                    var n = document.getElementById("edui_fixedlayer");
                    return null == n && (n = document.createElement("div"), n.id = "edui_fixedlayer", document.body.appendChild(n),
                        i.ie && i.version <= 8 ? (n.style.position = "absolute", t(), setTimeout(e)) : n.style.position = "fixed",
                        n.style.left = "0", n.style.top = "0", n.style.width = "0", n.style.height = "0"), n;
                },
                makeUnselectable: function (e) {
                    if (i.opera || i.ie && i.version < 9) {
                        if (e.unselectable = "on", e.hasChildNodes())for (var t = 0; t < e.childNodes.length; t++)1 == e.childNodes[t].nodeType && l.makeUnselectable(e.childNodes[t]);
                    } else void 0 !== e.style.MozUserSelect ? e.style.MozUserSelect = "none" : void 0 !== e.style.WebkitUserSelect ? e.style.WebkitUserSelect = "none" : void 0 !== e.style.KhtmlUserSelect && (e.style.KhtmlUserSelect = "none");
                }
            };
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = baidu.editor.EventBase, n = baidu.editor.ui.UIBase = function () {
            };
            n.prototype = {
                className: "",
                uiName: "",
                initOptions: function (e) {
                    var i = this;
                    for (var n in e)i[n] = e[n];
                    this.id = this.id || "edui" + t.uid();
                },
                initUIBase: function () {
                    this._globalKey = e.unhtml(t.setGlobal(this.id, this));
                },
                render: function (e) {
                    for (var i, n = this.renderHtml(), o = t.createElementByHtml(n), r = domUtils.getElementsByTagName(o, "*"), s = "edui-" + (this.theme || this.editor.options.theme), a = document.getElementById("edui_fixedlayer"), l = 0; i = r[l++];)domUtils.addClass(i, s);
                    domUtils.addClass(o, s), a && (a.className = "", domUtils.addClass(a, s));
                    var d = this.getDom();
                    null != d ? (d.parentNode.replaceChild(o, d), t.copyAttributes(o, d)) : ("string" == typeof e && (e = document.getElementById(e)),
                        e = e || t.getFixedLayer(), domUtils.addClass(e, s), e.appendChild(o)), this.postRender();
                },
                getDom: function (e) {
                    return document.getElementById(e ? this.id + "_" + e : this.id);
                },
                postRender: function () {
                    this.fireEvent("postrender");
                },
                getHtmlTpl: function () {
                    return "";
                },
                formatHtml: function (e) {
                    var t = "edui-" + this.uiName;
                    return e.replace(/##/g, this.id).replace(/%%-/g, this.uiName ? t + "-" : "").replace(/%%/g, (this.uiName ? t : "") + " " + this.className).replace(/\$\$/g, this._globalKey);
                },
                renderHtml: function () {
                    return this.formatHtml(this.getHtmlTpl());
                },
                dispose: function () {
                    var e = this.getDom();
                    e && baidu.editor.dom.domUtils.remove(e), t.unsetGlobal(this.id);
                }
            }, e.inherits(n, i);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.UIBase, i = baidu.editor.ui.Separator = function (e) {
                this.initOptions(e), this.initSeparator();
            };
            i.prototype = {
                uiName: "separator",
                initSeparator: function () {
                    this.initUIBase();
                },
                getHtmlTpl: function () {
                    return '<div id="##" class="edui-box %%"></div>';
                }
            }, e.inherits(i, t);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.dom.domUtils, i = baidu.editor.ui.UIBase, n = baidu.editor.ui.uiUtils, o = baidu.editor.ui.Mask = function (e) {
                this.initOptions(e), this.initUIBase();
            };
            o.prototype = {
                getHtmlTpl: function () {
                    return '<div id="##" class="edui-mask %%" onmousedown="return $$._onMouseDown(event, this);"></div>';
                },
                postRender: function () {
                    var e = this;
                    t.on(window, "resize", function () {
                        setTimeout(function () {
                            e.isHidden() || e._fill();
                        });
                    });
                },
                show: function (e) {
                    this._fill(), this.getDom().style.display = "", this.getDom().style.zIndex = e;
                },
                hide: function () {
                    this.getDom().style.display = "none", this.getDom().style.zIndex = "";
                },
                isHidden: function () {
                    return "none" == this.getDom().style.display;
                },
                _onMouseDown: function () {
                    return !1;
                },
                _fill: function () {
                    var e = this.getDom(), t = n.getViewportRect();
                    e.style.width = t.width + "px", e.style.height = t.height + "px";
                }
            }, e.inherits(o, i);
        }(), function () {
            function e(e, t) {
                for (var i = 0; i < s.length; i++) {
                    var n = s[i];
                    if (!n.isHidden() && n.queryAutoHide(t) !== !1) {
                        if (e && /scroll/gi.test(e.type) && "edui-wordpastepop" == n.className)return;
                        n.hide();
                    }
                }
                s.length && n.editor.fireEvent("afterhidepop");
            }

            var t = baidu.editor.utils, i = baidu.editor.ui.uiUtils, n = baidu.editor.dom.domUtils, o = baidu.editor.ui.UIBase, r = baidu.editor.ui.Popup = function (e) {
                this.initOptions(e), this.initPopup();
            }, s = [];
            r.postHide = e;
            var a = ["edui-anchor-topleft", "edui-anchor-topright", "edui-anchor-bottomleft", "edui-anchor-bottomright"];
            r.prototype = {
                SHADOW_RADIUS: 5,
                content: null,
                _hidden: !1,
                autoRender: !0,
                canSideLeft: !0,
                canSideUp: !0,
                initPopup: function () {
                    this.initUIBase(), s.push(this);
                },
                getHtmlTpl: function () {
                    return '<div id="##" class="edui-popup %%"> <div id="##_body" class="edui-popup-body"> <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe> <div class="edui-shadow"></div> <div id="##_content" class="edui-popup-content">' + this.getContentHtmlTpl() + "  </div> </div></div>";
                },
                getContentHtmlTpl: function () {
                    return this.content ? "string" == typeof this.content ? this.content : this.content.renderHtml() : "";
                },
                _UIBase_postRender: o.prototype.postRender,
                postRender: function () {
                    if (this.content instanceof o && this.content.postRender(), this.captureWheel && !this.captured) {
                        this.captured = !0;
                        for (var e = (document.documentElement.clientHeight || document.body.clientHeight) - 80, t = this.getDom().offsetHeight, i = this.combox.getDom().getBoundingClientRect().top, r = this.getDom("content"), s = this; i + t > e;)t -= 30;
                        r.style.height = t + "px", window.XMLHttpRequest ? n.on(r, "onmousewheel" in document.body ? "mousewheel" : "DOMMouseScroll", function (e) {
                            e.preventDefault ? e.preventDefault() : e.returnValue = !1, r.scrollTop -= e.wheelDelta ? e.wheelDelta / 120 * 60 : e.detail / -3 * 60;
                        }) : n.on(this.getDom(), "mousewheel", function (e) {
                            e.returnValue = !1, s.getDom("content").scrollTop -= e.wheelDelta / 120 * 60;
                        });
                    }
                    this.fireEvent("postRenderAfter"), this.hide(!0), this._UIBase_postRender();
                },
                _doAutoRender: function () {
                    !this.getDom() && this.autoRender && this.render();
                },
                mesureSize: function () {
                    var e = this.getDom("content");
                    return i.getClientRect(e);
                },
                fitSize: function () {
                    if (this.captureWheel && this.sized)return this.__size;
                    this.sized = !0;
                    var e = this.getDom("body");
                    e.style.width = "", e.style.height = "";
                    var t = this.mesureSize();
                    return e.style.width = this.captureWheel ? -(-20 - t.width) + "px" : t.width + "px", e.style.height = t.height + "px",
                        this.__size = t, this.captureWheel && (this.getDom("content").style.overflow = "auto"),
                        t;
                },
                showAnchor: function (e, t) {
                    this.showAnchorRect(i.getClientRect(e), t);
                },
                showAnchorRect: function (e, t) {
                    this._doAutoRender();
                    var o = i.getViewportRect();
                    this._show();
                    var r, s, l, d, c = this.fitSize();
                    t ? (r = this.canSideLeft && e.right + c.width > o.right && e.left > c.width, s = this.canSideUp && e.top + c.height > o.bottom && e.bottom > c.height,
                        l = r ? e.left - c.width : e.right, d = s ? e.bottom - c.height : e.top) : (r = this.canSideLeft && e.right + c.width > o.right && e.left > c.width,
                        s = this.canSideUp && e.top + c.height > o.bottom && e.bottom > c.height, l = r ? e.right - c.width : e.left,
                        d = s ? e.top - c.height : e.bottom);
                    var u = this.getDom();
                    i.setViewportOffset(u, {
                        left: l,
                        top: d
                    }), n.removeClasses(u, a), u.className += " " + a[2 * (s ? 1 : 0) + (r ? 1 : 0)], this.editor && (u.style.zIndex = 1 * this.editor.container.style.zIndex + 10,
                        baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = u.style.zIndex - 1);
                },
                showAt: function (e) {
                    var t = e.left, i = e.top, n = {
                        left: t,
                        top: i,
                        right: t,
                        bottom: i,
                        height: 0,
                        width: 0
                    };
                    this.showAnchorRect(n, !1, !0);
                },
                _show: function () {
                    if (this._hidden) {
                        var e = this.getDom();
                        e.style.display = "", this._hidden = !1, this.fireEvent("show");
                    }
                },
                isHidden: function () {
                    return this._hidden;
                },
                show: function () {
                    this._doAutoRender(), this._show();
                },
                hide: function (e) {
                    !this._hidden && this.getDom() && (this.getDom().style.display = "none", this._hidden = !0,
                    e || this.fireEvent("hide"));
                },
                queryAutoHide: function (e) {
                    return !e || !i.contains(this.getDom(), e);
                }
            }, t.inherits(r, o), n.on(document, "mousedown", function (t) {
                var i = t.target || t.srcElement;
                e(t, i);
            }), n.on(window, "scroll", function (t, i) {
                e(t, i);
            });
        }(), function () {
            function e(e, t, i) {
                var n = '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview" style="display:none;"></div><div class="ue_colorpicker_box" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);">';
                n += '<div class="ue_colorpicker_group" style="overflow:hidden;"><div class="ue_colorpicker_hd">' + t.getLang("recentlyColor") + '</div><div class="ue_colorpicker_bd" id="##_recently_color" >' + _nopickcolorhtml;
                var r = i.recentlyColor;
                if (r.length > 0)for (var s = 0, a = r.length; a > s; s++) {
                    var l = r[s].substr(1);
                    n += '<span onclick="return false;" title="#' + l + '" data-color="#' + l + '" class="ue_colorpicker_square" style="background-color:#' + l + '"></span>';
                }
                n += "</div></div>";
                var d = '<span id="##_colorpicker_tab" class="ue_colorpicker_hd_tab" onclick="return $$._onColorPickerClick(event, this);">更多颜色</span>';
                document.getElementsByClassName || (d = ""), n += '<div class="ue_colorpicker_group" style="overflow:hidden;"><div class="ue_colorpicker_hd"><span id="##_basiccolor_tab" class="ue_colorpicker_hd_tab selected" onclick="return $$._onBasicColorClick(event, this);">' + t.getLang("basicColor") + "</span>" + d + '</div><div class="ue_colorpicker_bd" id="##_basiccolor">';
                for (var s = 0, a = o.length; a > s; s++) {
                    var l = o[s];
                    n += '<span onclick="return false;" title="#' + l + '" data-color="#' + l + '" class="ue_colorpicker_square" style="background-color:#' + l + '"></span>';
                }
                return n += '</div><div class="ue_colorpicker_bd" id="##_colorpicker" style="display:none;"></div></div><div class="ue_colorpicker_toolbar"><span class="ue_colorpicker_square" id="##_colorinput_preview" style="background-color:#f00"></span><a href="javascript:void(0);" onclick="return $$._onBtnClick(event, this);" class="btn_ue_colorpicker">确认</a><span class="ue_colorpicker_input_box"><span class="ue_colorpicker_input_append">#</span><span class="ue_colorpicker_input_inner"><input id="##_colorinput" value="ff0000" type="text" onkeyup="return $$._onInputKeyup(event, this);" onclick="return $$._onInputClick(event, this);"></span></span></div></div>';
            }

            var t = baidu.editor.utils, i = baidu.editor.ui.UIBase, n = 8;
            _nopickcolorhtml = '<span onclick="return false;" title="清除颜色" class="ue_colorpicker_nocolor ue_colorpicker_square"></span>',
                ColorPicker = baidu.editor.ui.ColorPicker = function (e) {
                    this.initOptions(e), this.noColorText = this.noColorText || this.editor.getLang("clearColor"),
                        this.initUIBase();
                    var t = this.storekey = "__ue_recentlycolor_" + (e.storekey || ""), i = store.get(t);
                    i = i ? i.split(",").slice(0, n) : ["#000"], this.recentlyColor = i;
                }, ColorPicker.prototype = {
                getHtmlTpl: function () {
                    return e(this.noColorText, this.editor, this);
                },
                _initColorPicker: function () {
                    var e = this, t = this.getDom("colorpicker"), i = this.getDom("colorinput_preview"), n = e.getDom("colorinput");
                    $(t).addClass("cp cp-default");
                    LibColorPicker(t, function (t) {
                        if (t) {
                            t = t.substr(1), n.value = t;
                            var o = e._getColor();
                            o && (i.style.backgroundColor = o ? o : "#fff");
                        }
                    });
                },
                _onTableClick: function (e) {
                    var t = e.target || e.srcElement, i = t.getAttribute("data-color");
                    if (i) {
                        this._saveColor(i);
                        var n = this.getDom("colorinput_preview"), o = this.getDom("colorinput");
                        n.style.backgroundColor = i, o.value = (i || "").substr(1), this.fireEvent("pickcolor", i);
                    } else this._onPickNoColor();
                },
                _saveColor: function (e) {
                    for (var t = this.recentlyColor || ["#000"], i = [], o = 0, r = t.length; r > o; ++o) {
                        var s = t[o];
                        s != e && i.push(s);
                    }
                    i.unshift(e), t = i.slice(0, n), this.recentlyColor = t, store.set(this.storekey, t.join(",")),
                        html = _nopickcolorhtml;
                    for (var o = 0, r = t.length; r > o; o++) {
                        var s = t[o].substr(1);
                        html += '<span onclick="return false;" title="#' + s + '" data-color="#' + s + '" class="ue_colorpicker_square" style="background-color:#' + s + '"></span>';
                    }
                    this.getDom("recently_color").innerHTML = html;
                },
                _onTableOver: function (e) {
                    var t = e.target || e.srcElement, i = t.getAttribute("data-color");
                    i && (this.getDom("preview").style.backgroundColor = i);
                },
                _getColor: function () {
                    var e = this.getDom("colorinput"), t = e.value || "";
                    t = t.toLowerCase();
                    var i = t.split(""), n = i.length;
                    if (3 != n && 6 != n)return !1;
                    for (var o = 0; n > o; ++o) {
                        var r = i[o];
                        if (!(r >= "0" && "9" >= r || r >= "a" && "f" >= r))return !1;
                    }
                    return "#" + t;
                },
                _onBtnClick: function (e) {
                    var t = this._getColor();
                    return t && (this._saveColor(t), this.fireEvent("pickcolor", t)), e.stopPropagation ? (e.stopPropagation(),
                        e.preventDefault()) : e.cancelBubble = !0, !1;
                },
                _onInputKeyup: function (e) {
                    var t = this.getDom("colorinput_preview"), i = this._getColor(), n = e.keyCode || e.which;
                    t.style.backgroundColor = i ? i : "#fff", i && 13 == n && (this._saveColor(i), this.fireEvent("pickcolor", i));
                },
                _onInputClick: function (e) {
                    e.stopPropagation ? (e.stopPropagation(), e.preventDefault()) : e.cancelBubble = !0;
                },
                _onTableOut: function () {
                    this.getDom("preview").style.backgroundColor = "";
                },
                _onPickNoColor: function () {
                    this.fireEvent("picknocolor");
                },
                _onBasicColorClick: function (e) {
                    var t = this.getDom("basiccolor"), i = this.getDom("colorpicker");
                    t.style.display = "block", i.style.display = "none";
                    var n = this.getDom("basiccolor_tab"), o = this.getDom("colorpicker_tab");
                    return $(n).addClass("selected"), $(o).removeClass("selected"), e.stopPropagation ? (e.stopPropagation(),
                        e.preventDefault()) : e.cancelBubble = !0, !1;
                },
                _onColorPickerClick: function (e) {
                    var t = this.getDom("basiccolor"), i = this.getDom("colorpicker");
                    t.style.display = "none", i.style.display = "block";
                    var n = this.getDom("basiccolor_tab"), o = this.getDom("colorpicker_tab");
                    return $(n).removeClass("selected"), $(o).addClass("selected"), this.__hasInitColorPicker || (this.__hasInitColorPicker = !0,
                        this._initColorPicker()), e.stopPropagation ? (e.stopPropagation(), e.preventDefault()) : e.cancelBubble = !0,
                        !1;
                }
            }, t.inherits(ColorPicker, i);
            var o = "ffffff,ffd7d5,ffdaa9,fffed5,d4fa00,73fcd6,a5c8ff,ffacd5,ff7faa,d6d6d6,ffacaa,ffb995,fffb00,73fa79,00fcff,78acfe,d84fa9,ff4f79,b2b2b2,d7aba9,ff6827,ffda51,00d100,00d5ff,0080ff,ac39ff,ff2941,888888,7a4442,ff4c00,ffa900,3da742,3daad6,0052ff,7a4fd6,d92142,000000,7b0c00,ff4c41,d6a841,407600,007aaa,021eaa,797baa,ab1942".split(",");
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = baidu.editor.ui.UIBase, n = baidu.editor.ui.TablePicker = function (e) {
                this.initOptions(e), this.initTablePicker();
            };
            n.prototype = {
                defaultNumRows: 10,
                defaultNumCols: 10,
                maxNumRows: 20,
                maxNumCols: 20,
                numRows: 10,
                numCols: 10,
                lengthOfCellSide: 22,
                initTablePicker: function () {
                    this.initUIBase();
                },
                getHtmlTpl: function () {
                    return '<div id="##" class="edui-tablepicker %%"><div class="edui-tablepicker-body"><div class="edui-infoarea"><span id="##_label" class="edui-label"></span></div><div class="edui-pickarea" onmousemove="$$._onMouseMove(event, this);" onmouseover="$$._onMouseOver(event, this);" onmouseout="$$._onMouseOut(event, this);" onclick="$$._onClick(event, this);"><div id="##_overlay" class="edui-overlay"></div></div></div></div>';
                },
                _UIBase_render: i.prototype.render,
                render: function (e) {
                    this._UIBase_render(e), this.getDom("label").innerHTML = "0" + this.editor.getLang("t_row") + " x 0" + this.editor.getLang("t_col");
                },
                _track: function (e, t) {
                    var i = this.getDom("overlay").style, n = this.lengthOfCellSide;
                    i.width = e * n + "px", i.height = t * n + "px";
                    var o = this.getDom("label");
                    o.innerHTML = e + this.editor.getLang("t_col") + " x " + t + this.editor.getLang("t_row"),
                        this.numCols = e, this.numRows = t;
                },
                _onMouseOver: function (e, i) {
                    var n = e.relatedTarget || e.fromElement;
                    t.contains(i, n) || i === n || (this.getDom("label").innerHTML = "0" + this.editor.getLang("t_col") + " x 0" + this.editor.getLang("t_row"),
                        this.getDom("overlay").style.visibility = "");
                },
                _onMouseOut: function (e, i) {
                    var n = e.relatedTarget || e.toElement;
                    t.contains(i, n) || i === n || (this.getDom("label").innerHTML = "0" + this.editor.getLang("t_col") + " x 0" + this.editor.getLang("t_row"),
                        this.getDom("overlay").style.visibility = "hidden");
                },
                _onMouseMove: function (e) {
                    var i = (this.getDom("overlay").style, t.getEventOffset(e)), n = this.lengthOfCellSide, o = Math.ceil(i.left / n), r = Math.ceil(i.top / n);
                    this._track(o, r);
                },
                _onClick: function () {
                    this.fireEvent("picktable", this.numCols, this.numRows);
                }
            }, e.inherits(n, i);
        }(), function () {
            var e = baidu.editor.browser, t = baidu.editor.dom.domUtils, i = baidu.editor.ui.uiUtils, n = 'onmousedown="$$.Stateful_onMouseDown(event, this);" onmouseup="$$.Stateful_onMouseUp(event, this);"' + (e.ie ? ' onmouseenter="$$.Stateful_onMouseEnter(event, this);" onmouseleave="$$.Stateful_onMouseLeave(event, this);"' : ' onmouseover="$$.Stateful_onMouseOver(event, this);" onmouseout="$$.Stateful_onMouseOut(event, this);"');
            baidu.editor.ui.Stateful = {
                alwalysHoverable: !1,
                target: null,
                Stateful_init: function () {
                    this._Stateful_dGetHtmlTpl = this.getHtmlTpl, this.getHtmlTpl = this.Stateful_getHtmlTpl;
                },
                Stateful_getHtmlTpl: function () {
                    var e = this._Stateful_dGetHtmlTpl();
                    return e.replace(/stateful/g, function () {
                        return n;
                    });
                },
                Stateful_onMouseEnter: function (e, t) {
                    this.target = t, (!this.isDisabled() || this.alwalysHoverable) && (this.addState("hover"),
                        this.fireEvent("over"));
                },
                Stateful_onMouseLeave: function () {
                    (!this.isDisabled() || this.alwalysHoverable) && (this.removeState("hover"), this.removeState("active"),
                        this.fireEvent("out"));
                },
                Stateful_onMouseOver: function (e, t) {
                    var n = e.relatedTarget;
                    i.contains(t, n) || t === n || this.Stateful_onMouseEnter(e, t);
                },
                Stateful_onMouseOut: function (e, t) {
                    var n = e.relatedTarget;
                    i.contains(t, n) || t === n || this.Stateful_onMouseLeave(e, t);
                },
                Stateful_onMouseDown: function () {
                    this.isDisabled() || this.addState("active");
                },
                Stateful_onMouseUp: function () {
                    this.isDisabled() || this.removeState("active");
                },
                Stateful_postRender: function () {
                    this.disabled && !this.hasState("disabled") && this.addState("disabled");
                },
                hasState: function (e) {
                    return t.hasClass(this.getStateDom(), "edui-state-" + e);
                },
                addState: function (e) {
                    this.hasState(e) || (this.getStateDom().className += " edui-state-" + e);
                },
                removeState: function (e) {
                    this.hasState(e) && t.removeClasses(this.getStateDom(), ["edui-state-" + e]);
                },
                getStateDom: function () {
                    return this.getDom("state");
                },
                isChecked: function () {
                    return this.hasState("checked");
                },
                setChecked: function (e) {
                    !this.isDisabled() && e ? this.addState("checked") : this.removeState("checked");
                },
                isDisabled: function () {
                    return this.hasState("disabled");
                },
                setDisabled: function (e) {
                    e ? (this.removeState("hover"), this.removeState("checked"), this.removeState("active"),
                        this.addState("disabled")) : this.removeState("disabled");
                }
            };
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.UIBase, i = baidu.editor.ui.Stateful, n = baidu.editor.ui.Button = function (e) {
                this.initOptions(e), this.initButton();
            };
            n.prototype = {
                uiName: "button",
                label: "",
                title: "",
                showIcon: !0,
                showText: !0,
                initButton: function () {
                    this.initUIBase(), this.Stateful_init();
                },
                getHtmlTpl: function () {
                    return '<div id="##" class="edui-box %%"><div id="##_state" stateful><div class="%%-wrap"><div id="##_body" unselectable="on" ' + (this.title ? 'data-tooltip="' + this.title + '"' : "") + ' class="%%-body js_tooltip" onmousedown="return false;" onclick="return $$._onClick();">' + (this.showIcon ? '<div class="edui-box edui-icon"></div>' : "") + (this.showText ? '<div class="edui-box edui-label">' + this.label + "</div>" : "") + "</div></div></div></div>";
                },
                postRender: function () {
                    this.Stateful_postRender(), this.setDisabled(this.disabled);
                },
                _onClick: function () {
                    this.isDisabled() || this.fireEvent("click");
                }
            }, e.inherits(n, t), e.extend(n.prototype, i);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = (baidu.editor.dom.domUtils,
                baidu.editor.ui.UIBase), n = baidu.editor.ui.Stateful, o = baidu.editor.ui.SplitButton = function (e) {
                this.initOptions(e), this.initSplitButton();
            };
            o.prototype = {
                popup: null,
                uiName: "splitbutton",
                title: "",
                initSplitButton: function () {
                    this.initUIBase(), this.Stateful_init();
                    if (null != this.popup) {
                        var e = this.popup;
                        this.popup = null, this.setPopup(e);
                    }
                },
                _UIBase_postRender: i.prototype.postRender,
                postRender: function () {
                    this.Stateful_postRender(), this._UIBase_postRender();
                },
                setPopup: function (i) {
                    this.popup !== i && (null != this.popup && this.popup.dispose(), i.addListener("show", e.bind(this._onPopupShow, this)),
                        i.addListener("hide", e.bind(this._onPopupHide, this)), i.addListener("postrender", e.bind(function () {
                        i.getDom("body").appendChild(t.createElementByHtml('<div id="' + this.popup.id + '_bordereraser" class="edui-bordereraser edui-background" style="width:' + (t.getClientRect(this.getDom()).width + 20) + 'px"></div>')),
                            i.getDom().className += " " + this.className;
                    }, this)), this.popup = i);
                },
                _onPopupShow: function () {
                    this.addState("opened");
                },
                _onPopupHide: function () {
                    this.removeState("opened");
                },
                getHtmlTpl: function () {
                    var e = '<div id="##_button_body" class="edui-box edui-button-body" onclick="$$._onButtonClick(event, this);"><div class="edui-box edui-icon"></div></div>';
                    return this.useInput && (e = '<div id="##_button_body" class="edui-box edui-button-body"><input id="##_wx_input" class="edui-box edui-wx-input " type="text" onkeydown="$$._onInputKeydown(event, this);" onclick="$$._onInputClick(event, this);" onblur="$$._onInputBlur(event, this);"></div>'),
                    '<div id="##" class="edui-box %%"><div ' + (this.title ? 'data-tooltip="' + this.title + '"' : "") + ' id="##_state" stateful class="js_tooltip"><div class="%%-body">' + e + '<div class="edui-box edui-splitborder"></div><div class="edui-box edui-arrow" onclick="$$._onArrowClick();"></div></div></div></div>';
                },
                showPopup: function () {
                    var e = t.getClientRect(this.getDom());
                    e.top -= this.popup.SHADOW_RADIUS, e.height += this.popup.SHADOW_RADIUS, this.popup.showAnchorRect(e);
                },
                _onArrowClick: function () {
                    this.isDisabled() || this.showPopup();
                },
                _onInputClick: function () {
                    this.isDisabled() || this.fireEvent("inputclick");
                },
                _onInputBlur: function (e) {
                    this.isDisabled() || this.fireEvent("inputblur"), e.stopPropagation ? (e.stopPropagation(),
                        e.preventDefault()) : e.cancelBubble = !0;
                },
                _onInputKeydown: function (e) {
                    this.isDisabled() || this.fireEvent("inputkeydown", e);
                },
                _onButtonClick: function () {
                    this.isDisabled() || this.fireEvent("buttonclick");
                }
            }, e.inherits(o, i), e.extend(o.prototype, n, !0);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = baidu.editor.ui.ColorPicker, n = baidu.editor.ui.Popup, o = baidu.editor.ui.SplitButton, r = baidu.editor.ui.ColorButton = function (e) {
                this.initOptions(e), this.initColorButton();
            };
            r.prototype = {
                initColorButton: function () {
                    var e = this;
                    this.popup = new n({
                        content: new i({
                            noColorText: e.editor.getLang("clearColor"),
                            storekey: e.storekey,
                            editor: e.editor,
                            onpickcolor: function (t, i) {
                                e._onPickColor(i);
                            },
                            onpicknocolor: function (t, i) {
                                e._onPickNoColor(i);
                            }
                        }),
                        editor: e.editor
                    }), this.initSplitButton();
                },
                _SplitButton_postRender: o.prototype.postRender,
                postRender: function () {
                    this._SplitButton_postRender(), this.getDom("button_body").appendChild(t.createElementByHtml('<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>')),
                        this.getDom().className += " edui-colorbutton";
                },
                setColor: function (e) {
                    this.getDom("colorlump").style.backgroundColor = e, this.color = e;
                },
                _onPickColor: function (e) {
                    this.fireEvent("pickcolor", e) !== !1 && (this.setColor(e), this.popup.hide());
                },
                _onPickNoColor: function () {
                    this.fireEvent("picknocolor") !== !1 && this.popup.hide();
                }
            }, e.inherits(r, o);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.Popup, i = baidu.editor.ui.TablePicker, n = baidu.editor.ui.SplitButton, o = baidu.editor.ui.TableButton = function (e) {
                this.initOptions(e), this.initTableButton();
            };
            o.prototype = {
                initTableButton: function () {
                    var e = this;
                    this.popup = new t({
                        content: new i({
                            editor: e.editor,
                            onpicktable: function (t, i, n) {
                                e._onPickTable(i, n);
                            }
                        }),
                        editor: e.editor
                    }), this.initSplitButton();
                },
                _onPickTable: function (e, t) {
                    this.fireEvent("picktable", e, t) !== !1 && this.popup.hide();
                }
            }, e.inherits(o, n);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.UIBase, i = baidu.editor.ui.AutoTypeSetPicker = function (e) {
                this.initOptions(e), this.initAutoTypeSetPicker();
            };
            i.prototype = {
                initAutoTypeSetPicker: function () {
                    this.initUIBase();
                },
                getHtmlTpl: function () {
                    var e = this.editor, t = e.options.autotypeset, i = e.getLang("autoTypeSet"), n = "textAlignValue" + e.uid, o = "imageBlockLineValue" + e.uid;
                    return '<div id="##" class="edui-autotypesetpicker %%"><div class="edui-autotypesetpicker-body"><table ><tr><td nowrap colspan="2"><input type="checkbox" name="mergeEmptyline" ' + (t.mergeEmptyline ? "checked" : "") + ">" + i.mergeLine + '</td><td colspan="2"><input type="checkbox" name="removeEmptyline" ' + (t.removeEmptyline ? "checked" : "") + ">" + i.delLine + '</td></tr><tr><td nowrap colspan="2"><input type="checkbox" name="removeClass" ' + (t.removeClass ? "checked" : "") + ">" + i.removeFormat + '</td><td colspan="2"><input type="checkbox" name="indent" ' + (t.indent ? "checked" : "") + ">" + i.indent + '</td></tr><tr><td nowrap colspan="2"><input type="checkbox" name="textAlign" ' + (t.textAlign ? "checked" : "") + ">" + i.alignment + '</td><td colspan="2" id="' + n + '"><input type="radio" name="' + n + '" value="left" ' + (t.textAlign && "left" == t.textAlign ? "checked" : "") + ">" + e.getLang("justifyleft") + '<input type="radio" name="' + n + '" value="center" ' + (t.textAlign && "center" == t.textAlign ? "checked" : "") + ">" + e.getLang("justifycenter") + '<input type="radio" name="' + n + '" value="right" ' + (t.textAlign && "right" == t.textAlign ? "checked" : "") + ">" + e.getLang("justifyright") + ' </tr><tr><td nowrap colspan="2"><input type="checkbox" name="imageBlockLine" ' + (t.imageBlockLine ? "checked" : "") + ">" + i.imageFloat + '</td><td nowrap colspan="2" id="' + o + '"><input type="radio" name="' + o + '" value="none" ' + (t.imageBlockLine && "none" == t.imageBlockLine ? "checked" : "") + ">" + e.getLang("default") + '<input type="radio" name="' + o + '" value="left" ' + (t.imageBlockLine && "left" == t.imageBlockLine ? "checked" : "") + ">" + e.getLang("justifyleft") + '<input type="radio" name="' + o + '" value="center" ' + (t.imageBlockLine && "center" == t.imageBlockLine ? "checked" : "") + ">" + e.getLang("justifycenter") + '<input type="radio" name="' + o + '" value="right" ' + (t.imageBlockLine && "right" == t.imageBlockLine ? "checked" : "") + ">" + e.getLang("justifyright") + '</tr><tr><td nowrap colspan="2"><input type="checkbox" name="clearFontSize" ' + (t.clearFontSize ? "checked" : "") + ">" + i.removeFontsize + '</td><td colspan="2"><input type="checkbox" name="clearFontFamily" ' + (t.clearFontFamily ? "checked" : "") + ">" + i.removeFontFamily + '</td></tr><tr><td nowrap colspan="4"><input type="checkbox" name="removeEmptyNode" ' + (t.removeEmptyNode ? "checked" : "") + ">" + i.removeHtml + '</td></tr><tr><td nowrap colspan="4"><input type="checkbox" name="pasteFilter" ' + (t.pasteFilter ? "checked" : "") + ">" + i.pasteFilter + '</td></tr><tr><td nowrap colspan="4" align="right"><button >' + i.run + "</button></td></tr></table></div></div>";
                },
                _UIBase_render: t.prototype.render
            }, e.inherits(i, t);
        }(), function () {
            function e(e) {
                for (var t, i = e.editor.options.autotypeset, n = e.getDom(), o = e.editor.uid, r = null, s = null, a = domUtils.getElementsByTagName(n, "input"), l = a.length - 1; t = a[l--];)if (r = t.getAttribute("type"),
                    "checkbox" == r && (s = t.getAttribute("name"), i[s] && delete i[s], t.checked)) {
                    var d = document.getElementById(s + "Value" + o);
                    if (d) {
                        if (/input/gi.test(d.tagName))i[s] = d.value; else for (var c, u = d.getElementsByTagName("input"), m = u.length - 1; c = u[m--];)if (c.checked) {
                            i[s] = c.value;
                            break;
                        }
                    } else i[s] = !0;
                }
                for (var f, h = domUtils.getElementsByTagName(n, "select"), l = 0; f = h[l++];) {
                    var p = f.getAttribute("name");
                    i[p] = i[p] ? f.value : "";
                }
                e.editor.options.autotypeset = i;
            }

            var t = baidu.editor.utils, i = baidu.editor.ui.Popup, n = baidu.editor.ui.AutoTypeSetPicker, o = baidu.editor.ui.SplitButton, r = baidu.editor.ui.AutoTypeSetButton = function (e) {
                this.initOptions(e), this.initAutoTypeSetButton();
            };
            r.prototype = {
                initAutoTypeSetButton: function () {
                    var t = this;
                    this.popup = new i({
                        content: new n({
                            editor: t.editor
                        }),
                        editor: t.editor,
                        hide: function () {
                            !this._hidden && this.getDom() && (e(this), this.getDom().style.display = "none", this._hidden = !0,
                                this.fireEvent("hide"));
                        }
                    });
                    var o = 0;
                    this.popup.addListener("postRenderAfter", function () {
                        var i = this;
                        if (!o) {
                            var n = this.getDom(), r = n.getElementsByTagName("button")[0];
                            r.onclick = function () {
                                e(i), t.editor.execCommand("autotypeset"), i.hide();
                            }, o = 1;
                        }
                    }), this.initSplitButton();
                }
            }, t.inherits(r, o);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.Popup, i = baidu.editor.ui.Stateful, n = baidu.editor.ui.UIBase, o = baidu.editor.ui.CellAlignPicker = function (e) {
                this.initOptions(e), this.initSelected(), this.initCellAlignPicker();
            };
            o.prototype = {
                initSelected: function () {
                    var e = {
                        valign: {
                            top: 0,
                            middle: 1,
                            bottom: 2
                        },
                        align: {
                            left: 0,
                            center: 1,
                            right: 2
                        },
                        count: 3
                    };
                    this.selected && (this.selectedIndex = e.valign[this.selected.valign] * e.count + e.align[this.selected.align]);
                },
                initCellAlignPicker: function () {
                    this.initUIBase(), this.Stateful_init();
                },
                getHtmlTpl: function () {
                    for (var e = ["left", "center", "right"], t = 9, i = null, n = -1, o = [], r = 0; t > r; r++)i = this.selectedIndex === r ? ' class="edui-cellalign-selected" ' : "",
                        n = r % 3, 0 === n && o.push("<tr>"), o.push('<td index="' + r + '" ' + i + ' stateful><div class="edui-icon edui-' + e[n] + '"></div></td>'),
                    2 === n && o.push("</tr>");
                    return '<div id="##" class="edui-cellalignpicker %%"><div class="edui-cellalignpicker-body"><table onclick="$$._onClick(event);">' + o.join("") + "</table></div></div>";
                },
                getStateDom: function () {
                    return this.target;
                },
                _onClick: function (e) {
                    var i = e.target || e.srcElement;
                    /icon/.test(i.className) && (this.items[i.parentNode.getAttribute("index")].onclick(),
                        t.postHide(e));
                },
                _UIBase_render: n.prototype.render
            }, e.inherits(o, n), e.extend(o.prototype, i, !0);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.Stateful, i = baidu.editor.ui.uiUtils, n = baidu.editor.ui.UIBase, o = baidu.editor.ui.PastePicker = function (e) {
                this.initOptions(e), this.initPastePicker();
            };
            o.prototype = {
                initPastePicker: function () {
                    this.initUIBase(), this.Stateful_init();
                },
                getHtmlTpl: function () {
                    return '<div class="edui-pasteicon" onclick="$$._onClick(this)"></div><div class="edui-pastecontainer"><div class="edui-title">' + this.editor.getLang("pasteOpt") + '</div><div class="edui-button"><div title="' + this.editor.getLang("pasteSourceFormat") + '" onclick="$$.format(false)" stateful><div class="edui-richtxticon"></div></div><div title="' + this.editor.getLang("tagFormat") + '" onclick="$$.format(2)" stateful><div class="edui-tagicon"></div></div><div title="' + this.editor.getLang("pasteTextFormat") + '" onclick="$$.format(true)" stateful><div class="edui-plaintxticon"></div></div></div></div></div>';
                },
                getStateDom: function () {
                    return this.target;
                },
                format: function (e) {
                    this.editor.ui._isTransfer = !0, this.editor.fireEvent("pasteTransfer", e);
                },
                _onClick: function (e) {
                    var t = domUtils.getNextDomNode(e), n = i.getViewportRect().height, o = i.getClientRect(t);
                    t.style.top = o.top + o.height > n ? -o.height - e.offsetHeight + "px" : "", /hidden/gi.test(domUtils.getComputedStyle(t, "visibility")) ? (t.style.visibility = "visible",
                        domUtils.addClass(e, "edui-state-opened")) : (t.style.visibility = "hidden", domUtils.removeClasses(e, "edui-state-opened"));
                },
                _UIBase_render: n.prototype.render
            }, e.inherits(o, n), e.extend(o.prototype, t, !0);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = baidu.editor.ui.UIBase, n = baidu.editor.ui.Toolbar = function (e) {
                this.initOptions(e), this.initToolbar();
            };
            n.prototype = {
                items: null,
                initToolbar: function () {
                    this.items = this.items || [], this.initUIBase();
                },
                add: function (e) {
                    this.items.push(e);
                },
                getHtmlTpl: function () {
                    for (var e = [], t = 0; t < this.items.length; t++)e[t] = this.items[t].renderHtml();
                    return '<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' + e.join("") + "</div>";
                },
                postRender: function () {
                    for (var e = this.getDom(), i = 0; i < this.items.length; i++)this.items[i].postRender();
                    t.makeUnselectable(e);
                },
                _onMouseDown: function () {
                    return !1;
                }
            }, e.inherits(n, i);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.dom.domUtils, i = baidu.editor.ui.uiUtils, n = baidu.editor.ui.UIBase, o = baidu.editor.ui.Popup, r = baidu.editor.ui.Stateful, s = baidu.editor.ui.CellAlignPicker, a = baidu.editor.ui.Menu = function (e) {
                this.initOptions(e), this.initMenu();
            }, l = {
                renderHtml: function () {
                    return '<div class="edui-menuitem edui-menuseparator"><div class="edui-menuseparator-inner"></div></div>';
                },
                postRender: function () {
                },
                queryAutoHide: function () {
                    return !0;
                }
            };
            a.prototype = {
                items: null,
                uiName: "menu",
                initMenu: function () {
                    this.items = this.items || [], this.initPopup(), this.initItems();
                },
                initItems: function () {
                    for (var e = 0; e < this.items.length; e++) {
                        var t = this.items[e];
                        "-" == t ? this.items[e] = this.getSeparator() : t instanceof d || (t.editor = this.editor, t.theme = this.editor.options.theme,
                            this.items[e] = this.createItem(t));
                    }
                },
                getSeparator: function () {
                    return l;
                },
                createItem: function (e) {
                    return e.menu = this, new d(e);
                },
                _Popup_getContentHtmlTpl: o.prototype.getContentHtmlTpl,
                getContentHtmlTpl: function () {
                    if (0 == this.items.length)return this._Popup_getContentHtmlTpl();
                    for (var e = [], t = 0; t < this.items.length; t++) {
                        var i = this.items[t];
                        e[t] = i.renderHtml();
                    }
                    return '<div class="%%-body">' + e.join("") + "</div>";
                },
                _Popup_postRender: o.prototype.postRender,
                postRender: function () {
                    for (var e = this, n = 0; n < this.items.length; n++) {
                        var o = this.items[n];
                        o.ownerMenu = this, o.postRender();
                    }
                    t.on(this.getDom(), "mouseover", function (t) {
                        t = t || event;
                        var n = t.relatedTarget || t.fromElement, o = e.getDom();
                        i.contains(o, n) || o === n || e.fireEvent("over");
                    }), this._Popup_postRender();
                },
                queryAutoHide: function (e) {
                    if (e) {
                        if (i.contains(this.getDom(), e))return !1;
                        for (var t = 0; t < this.items.length; t++) {
                            var n = this.items[t];
                            if (n.queryAutoHide(e) === !1)return !1;
                        }
                    }
                },
                clearItems: function () {
                    for (var e = 0; e < this.items.length; e++) {
                        var t = this.items[e];
                        clearTimeout(t._showingTimer), clearTimeout(t._closingTimer), t.subMenu && t.subMenu.destroy();
                    }
                    this.items = [];
                },
                destroy: function () {
                    this.getDom() && t.remove(this.getDom()), this.clearItems();
                },
                dispose: function () {
                    this.destroy();
                }
            }, e.inherits(a, o);
            var d = baidu.editor.ui.MenuItem = function (e) {
                if (this.initOptions(e), this.initUIBase(), this.Stateful_init(), this.subMenu && !(this.subMenu instanceof a))if (e.className && -1 != e.className.indexOf("aligntd")) {
                    var i = this;
                    this.subMenu.selected = this.editor.queryCommandValue("cellalignment"), this.subMenu = new o({
                        content: new s(this.subMenu),
                        parentMenu: i,
                        editor: i.editor,
                        destroy: function () {
                            this.getDom() && t.remove(this.getDom());
                        }
                    }), this.subMenu.addListener("postRenderAfter", function () {
                        t.on(this.getDom(), "mouseover", function () {
                            i.addState("opened");
                        });
                    });
                } else this.subMenu = new a(this.subMenu);
            };
            d.prototype = {
                label: "",
                subMenu: null,
                ownerMenu: null,
                uiName: "menuitem",
                alwalysHoverable: !0,
                getHtmlTpl: function () {
                    return '<div id="##" class="%%" stateful onclick="$$._onClick(event, this);"><div class="%%-body">' + this.renderLabelHtml() + "</div></div>";
                },
                postRender: function () {
                    var e = this;
                    this.addListener("over", function () {
                        e.ownerMenu.fireEvent("submenuover", e), e.subMenu && e.delayShowSubMenu();
                    }), this.subMenu && (this.getDom().className += " edui-hassubmenu", this.subMenu.render(),
                        this.addListener("out", function () {
                            e.delayHideSubMenu();
                        }), this.subMenu.addListener("over", function () {
                        clearTimeout(e._closingTimer), e._closingTimer = null, e.addState("opened");
                    }), this.ownerMenu.addListener("hide", function () {
                        e.hideSubMenu();
                    }), this.ownerMenu.addListener("submenuover", function (t, i) {
                        i !== e && e.delayHideSubMenu();
                    }), this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide, this.subMenu.queryAutoHide = function (t) {
                        return t && i.contains(e.getDom(), t) ? !1 : this._bakQueryAutoHide(t);
                    }), this.getDom().style.tabIndex = "-1", i.makeUnselectable(this.getDom()), this.Stateful_postRender();
                },
                delayShowSubMenu: function () {
                    var e = this;
                    e.isDisabled() || (e.addState("opened"), clearTimeout(e._showingTimer), clearTimeout(e._closingTimer),
                        e._closingTimer = null, e._showingTimer = setTimeout(function () {
                        e.showSubMenu();
                    }, 250));
                },
                delayHideSubMenu: function () {
                    var e = this;
                    e.isDisabled() || (e.removeState("opened"), clearTimeout(e._showingTimer), e._closingTimer || (e._closingTimer = setTimeout(function () {
                        e.hasState("opened") || e.hideSubMenu(), e._closingTimer = null;
                    }, 400)));
                },
                renderLabelHtml: function () {
                    return '<div class="edui-arrow"></div><div class="edui-box edui-icon"></div><div class="edui-box edui-label %%-label">' + (this.label || "") + "</div>";
                },
                getStateDom: function () {
                    return this.getDom();
                },
                queryAutoHide: function (e) {
                    return this.subMenu && this.hasState("opened") ? this.subMenu.queryAutoHide(e) : void 0;
                },
                _onClick: function (e, t) {
                    this.hasState("disabled") || this.fireEvent("click", e, t) !== !1 && (this.subMenu ? this.showSubMenu() : o.postHide(e));
                },
                showSubMenu: function () {
                    var e = i.getClientRect(this.getDom());
                    e.right -= 5, e.left += 2, e.width -= 7, e.top -= 4, e.bottom += 4, e.height += 8, this.subMenu.showAnchorRect(e, !0, !0);
                },
                hideSubMenu: function () {
                    this.subMenu.hide();
                }
            }, e.inherits(d, n), e.extend(d.prototype, r, !0);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.uiUtils, i = baidu.editor.ui.Menu, n = baidu.editor.ui.SplitButton, o = baidu.editor.ui.Combox = function (e) {
                this.initOptions(e), this.initCombox();
            };
            o.prototype = {
                uiName: "combox",
                initCombox: function () {
                    var e = this;
                    this.items = this.items || [];
                    for (var t = 0; t < this.items.length; t++) {
                        var n = this.items[t];
                        n.uiName = "listitem", n.index = t, n.onclick = function () {
                            e.selectByIndex(this.index);
                        };
                    }
                    this.popup = new i({
                        items: this.items,
                        uiName: "list",
                        editor: this.editor,
                        captureWheel: !0,
                        combox: this
                    }), this.initSplitButton();
                },
                _SplitButton_postRender: n.prototype.postRender,
                postRender: function () {
                    this._SplitButton_postRender(), this.setLabel(this.label || ""), this.setValue(this.initValue || "");
                },
                showPopup: function () {
                    var e = t.getClientRect(this.getDom());
                    e.top += 1, e.bottom -= 1, e.height -= 2, this.popup.showAnchorRect(e);
                },
                getValue: function () {
                    return this.value;
                },
                setValue: function (e) {
                    var t = this.indexByValue(e);
                    -1 != t ? (this.selectedIndex = t, this.setLabel(this.items[t].label), this.value = this.items[t].value) : (this.selectedIndex = -1,
                        this.setLabel(this.getLabelForUnknowValue(e)), this.value = e);
                },
                setLabel: function (e) {
                    this.useInput ? this.getDom("wx_input").value = e : this.getDom("button_body").innerHTML = e,
                        this.label = e;
                },
                getLabelForUnknowValue: function (e) {
                    return e;
                },
                indexByValue: function (e) {
                    for (var t = 0; t < this.items.length; t++)if (e == this.items[t].value)return t;
                    return -1;
                },
                getItem: function (e) {
                    return this.items[e];
                },
                selectByIndex: function (e) {
                    e < this.items.length && this.fireEvent("select", e) !== !1 && (this.selectedIndex = e, this.value = this.items[e].value,
                        this.setLabel(this.items[e].label));
                }
            }, e.inherits(o, n);
        }(), function () {
            var e, t, i = baidu.editor.utils, n = baidu.editor.dom.domUtils, o = baidu.editor.ui.uiUtils, r = baidu.editor.ui.Mask, s = baidu.editor.ui.UIBase, a = baidu.editor.ui.Button, l = baidu.editor.ui.Dialog = function (e) {
                this.initOptions(i.extend({
                    autoReset: !0,
                    draggable: !0,
                    onok: function () {
                    },
                    oncancel: function () {
                    },
                    onclose: function (e, t) {
                        return t ? this.onok() : this.oncancel();
                    },
                    holdScroll: !1
                }, e)), this.initDialog();
            };
            l.prototype = {
                draggable: !1,
                uiName: "dialog",
                initDialog: function () {
                    var i = this, n = this.editor.options.theme;
                    if (this.initUIBase(), this.modalMask = e || (e = new r({
                                className: "edui-dialog-modalmask",
                                theme: n
                            })), this.dragMask = t || (t = new r({
                                className: "edui-dialog-dragmask",
                                theme: n
                            })), this.closeButton = new a({
                            className: "edui-dialog-closebutton",
                            title: i.closeDialog,
                            theme: n,
                            onclick: function () {
                                i.close(!1);
                            }
                        }), this.buttons)for (var o = 0; o < this.buttons.length; o++)this.buttons[o] instanceof a || (this.buttons[o] = new a(this.buttons[o]));
                },
                fitSize: function () {
                    var e = this.getDom("body"), t = this.mesureSize();
                    return e.style.width = t.width + "px", e.style.height = t.height + "px", t;
                },
                safeSetOffset: function (e) {
                    var t = this, i = t.getDom(), n = o.getViewportRect(), r = o.getClientRect(i), s = e.left;
                    s + r.width > n.right && (s = n.right - r.width);
                    var a = e.top;
                    a + r.height > n.bottom && (a = n.bottom - r.height), i.style.left = Math.max(s, 0) + "px", i.style.top = Math.max(a, 0) + "px";
                },
                showAtCenter: function () {
                    this.getDom().style.display = "";
                    var e = o.getViewportRect(), t = this.fitSize(), i = 0 | this.getDom("titlebar").offsetHeight, r = e.width / 2 - t.width / 2, s = e.height / 2 - (t.height - i) / 2 - i, a = this.getDom();
                    this.safeSetOffset({
                        left: Math.max(0 | r, 0),
                        top: Math.max(0 | s, 0)
                    }), n.hasClass(a, "edui-state-centered") || (a.className += " edui-state-centered"), this._show();
                },
                getContentHtml: function () {
                    var e = "";
                    return "string" == typeof this.content ? e = this.content : this.iframeUrl && (e = '<span id="' + this.id + '_contmask" class="dialogcontmask"></span><iframe id="' + this.id + '_iframe" class="%%-iframe" height="100%" width="100%" frameborder="0" src="' + this.iframeUrl + '"></iframe>'),
                        e;
                },
                getHtmlTpl: function () {
                    var e = "";
                    if (this.buttons) {
                        for (var t = [], i = 0; i < this.buttons.length; i++)t[i] = this.buttons[i].renderHtml();
                        e = '<div class="%%-foot"><div id="##_buttons" class="%%-buttons">' + t.join("") + "</div></div>";
                    }
                    return '<div id="##" class="%%"><div class="%%-wrap"><div id="##_body" class="%%-body"><div class="%%-shadow"></div><div id="##_titlebar" class="%%-titlebar"><div class="%%-draghandle" onmousedown="$$._onTitlebarMouseDown(event, this);"><span class="%%-caption">' + (this.title || "") + "</span></div>" + this.closeButton.renderHtml() + '</div><div id="##_content" class="%%-content">' + (this.autoReset ? "" : this.getContentHtml()) + "</div>" + e + "</div></div></div>";
                },
                postRender: function () {
                    this.modalMask.getDom() || (this.modalMask.render(), this.modalMask.hide()), this.dragMask.getDom() || (this.dragMask.render(),
                        this.dragMask.hide());
                    var e = this;
                    if (this.addListener("show", function () {
                            e.modalMask.show(this.getDom().style.zIndex - 2);
                        }), this.addListener("hide", function () {
                            e.modalMask.hide();
                        }), this.buttons)for (var t = 0; t < this.buttons.length; t++)this.buttons[t].postRender();
                    n.on(window, "resize", function () {
                        setTimeout(function () {
                            e.isHidden() || e.safeSetOffset(o.getClientRect(e.getDom()));
                        });
                    }), this.holdScroll && (e.iframeUrl ? e.addListener("dialogafterreset", function () {
                        window.setTimeout(function () {
                            var t = document.getElementById(e.id + "_iframe").contentWindow;
                            if (browser.ie)var i = window.setInterval(function () {
                                t.document && t.document.body && (window.clearInterval(i), i = null, n.on(t.document.body, browser.gecko ? "DOMMouseScroll" : "mousewheel", function (e) {
                                    n.preventDefault(e);
                                }));
                            }, 100); else n.on(t, browser.gecko ? "DOMMouseScroll" : "mousewheel", function (e) {
                                n.preventDefault(e);
                            });
                        }, 1);
                    }) : n.on(document.getElementById(e.id + "_iframe"), browser.gecko ? "DOMMouseScroll" : "mousewheel", function (e) {
                        n.preventDefault(e);
                    })), this._hide();
                },
                mesureSize: function () {
                    var e = this.getDom("body"), t = o.getClientRect(this.getDom("content")).width, i = e.style;
                    return i.width = t, o.getClientRect(e);
                },
                _onTitlebarMouseDown: function (e) {
                    if (this.draggable) {
                        var t, i = (o.getViewportRect(), this);
                        o.startDrag(e, {
                            ondragstart: function () {
                                t = o.getClientRect(i.getDom()), i.getDom("contmask").style.visibility = "visible", i.dragMask.show(i.getDom().style.zIndex - 1);
                            },
                            ondragmove: function (e, n) {
                                var o = t.left + e, r = t.top + n;
                                i.safeSetOffset({
                                    left: o,
                                    top: r
                                });
                            },
                            ondragstop: function () {
                                i.getDom("contmask").style.visibility = "hidden", n.removeClasses(i.getDom(), ["edui-state-centered"]),
                                    i.dragMask.hide();
                            }
                        });
                    }
                },
                reset: function () {
                    this.getDom("content").innerHTML = this.getContentHtml(), this.fireEvent("dialogafterreset");
                },
                _show: function () {
                    this._hidden && (this.getDom().style.display = "", this.editor.container.style.zIndex && (this.getDom().style.zIndex = 1 * this.editor.container.style.zIndex + 10),
                        this._hidden = !1, this.fireEvent("show"), baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4);
                },
                isHidden: function () {
                    return this._hidden;
                },
                _hide: function () {
                    this._hidden || (this.getDom().style.display = "none", this.getDom().style.zIndex = "",
                        this._hidden = !0, this.fireEvent("hide"));
                },
                open: function () {
                    if (this.autoReset)try {
                        this.reset();
                    } catch (e) {
                        this.render(), this.open();
                    }
                    if (this.showAtCenter(), this.iframeUrl)try {
                        this.getDom("iframe").focus();
                    } catch (t) {
                    }
                },
                _onCloseButtonClick: function () {
                    this.close(!1);
                },
                close: function (e) {
                    this.fireEvent("close", e) !== !1 && this._hide();
                }
            }, i.inherits(l, s);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.Menu, i = baidu.editor.ui.SplitButton, n = baidu.editor.ui.MenuButton = function (e) {
                this.initOptions(e), this.initMenuButton();
            };
            n.prototype = {
                initMenuButton: function () {
                    var e = this;
                    this.uiName = "menubutton", this.popup = new t({
                        items: e.items,
                        className: e.className,
                        editor: e.editor
                    }), this.popup.addListener("show", function () {
                        for (var t = this, i = 0; i < t.items.length; i++)t.items[i].removeState("checked"), t.items[i].value == e._value && (t.items[i].addState("checked"),
                            this.value = e._value);
                    }), this.initSplitButton();
                },
                setValue: function (e) {
                    this._value = e;
                }
            }, e.inherits(n, i);
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui, i = t.Dialog;
            t.buttons = {}, t.Dialog = function (e) {
                var t = new i(e);
                return t.addListener("hide", function () {
                    if (t.editor) {
                        var e = t.editor;
                        try {
                            if (browser.gecko) {
                                var i = e.window.scrollY, n = e.window.scrollX;
                                e.body.focus(), e.window.scrollTo(n, i);
                            } else e.focus();
                        } catch (o) {
                        }
                    }
                }), t;
            };
            for (var n, o = {
                edittable: "~/dialogs/table/edittable.html",
                edittd: "~/dialogs/table/edittd.html"
            }, r = ["undo", "redo", "formatmatch", "bold", "italic", "underline", "fontborder", "indent", "blockquote", "pasteplain", "selectall", "horizontal", "removeformat", , "insertparagraphbeforetable", "insertrow", "insertcol", "mergeright", "mergedown", "deleterow", "deletecol", "splittorows", "splittocols", "splittocells", "mergecells", "deletetable"], s = 0; n = r[s++];)n = n.toLowerCase(),
                t[n] = function (e) {
                    return function (i) {
                        var n = new t.Button({
                            className: "edui-for-" + e,
                            title: i.options.labelMap[e] || i.getLang("labelMap." + e) || "",
                            onclick: function () {
                                i.execCommand(e);
                            },
                            theme: i.options.theme,
                            showText: !1
                        });
                        return t.buttons[e] = n, i.addListener("selectionchange", function (t, o, r) {
                            var s = i.queryCommandState(e);
                            -1 == s ? (n.setDisabled(!0), n.setChecked(!1)) : r || (n.setDisabled(!1), n.setChecked(s));
                        }), n;
                    };
                }(n);
            t.cleardoc = function (e) {
                var i = new t.Button({
                    className: "edui-for-cleardoc",
                    title: e.options.labelMap.cleardoc || e.getLang("labelMap.cleardoc") || "",
                    theme: e.options.theme,
                    onclick: function () {
                        confirm(e.getLang("confirmClear")) && e.execCommand("cleardoc");
                    }
                });
                return t.buttons.cleardoc = i, e.addListener("selectionchange", function () {
                    i.setDisabled(-1 == e.queryCommandState("cleardoc"));
                }), i;
            };
            var a = {
                justify: ["left", "right", "center", "justify"],
                imagefloat: ["none", "left", "center", "right"]
            };
            for (var l in a)!function (e, i) {
                for (var n, o = 0; n = i[o++];)!function (i) {
                    t[e.replace("float", "") + i] = function (n) {
                        var o = new t.Button({
                            className: "edui-for-" + e.replace("float", "") + i,
                            title: n.options.labelMap[e.replace("float", "") + i] || n.getLang("labelMap." + e.replace("float", "") + i) || "",
                            theme: n.options.theme,
                            onclick: function () {
                                n.execCommand(e, i);
                            }
                        });
                        return t.buttons[e] = o, n.addListener("selectionchange", function (t, r, s) {
                            o.setDisabled(-1 == n.queryCommandState(e)), o.setChecked(n.queryCommandValue(e) == i && !s);
                        }), o;
                    };
                }(n);
            }(l, a[l]);
            for (var n, s = 0; n = ["backcolor", "forecolor"][s++];)t[n] = function (e) {
                return function (i) {
                    var n = new t.ColorButton({
                        className: "edui-for-" + e,
                        color: "default",
                        storekey: e,
                        title: i.options.labelMap[e] || i.getLang("labelMap." + e) || "",
                        editor: i,
                        onpickcolor: function (t, n) {
                            i.execCommand(e, n);
                        },
                        onpicknocolor: function () {
                            i.execCommand(e, "default"), this.setColor("transparent"), this.color = "default";
                        },
                        onbuttonclick: function () {
                            i.execCommand(e, this.color);
                        }
                    });
                    return t.buttons[e] = n, i.addListener("selectionchange", function () {
                        n.setDisabled(-1 == i.queryCommandState(e));
                    }), n;
                };
            }(n);
            var d = {
                noOk: [],
                ok: ["edittable", "edittd"]
            };
            for (var l in d)!function (i, n) {
                for (var r, s = 0; r = n[s++];)browser.opera && "searchreplace" === r || !function (n) {
                    t[n] = function (r, s, a) {
                        s = s || (r.options.iframeUrlMap || {})[n] || o[n], a = r.options.labelMap[n] || r.getLang("labelMap." + n) || "";
                        var l;
                        s && (l = new t.Dialog(e.extend({
                            iframeUrl: r.ui.mapUrl(s),
                            editor: r,
                            className: "edui-for-" + n,
                            title: a,
                            holdScroll: "insertimage" === n,
                            closeDialog: r.getLang("closeDialog")
                        }, "ok" == i ? {
                            buttons: [{
                                className: "edui-okbutton",
                                label: r.getLang("ok"),
                                editor: r,
                                onclick: function () {
                                    l.close(!0);
                                }
                            }, {
                                className: "edui-cancelbutton",
                                label: r.getLang("cancel"),
                                editor: r,
                                onclick: function () {
                                    l.close(!1);
                                }
                            }]
                        } : {})), r.ui._dialogs[n + "Dialog"] = l);
                        var d = new t.Button({
                            className: "edui-for-" + n,
                            title: a,
                            onclick: function () {
                                if (l)switch (n) {
                                    case"wordimage":
                                        r.execCommand("wordimage", "word_img"), r.word_img && (l.render(), l.open());
                                        break;

                                    case"scrawl":
                                        -1 != r.queryCommandState("scrawl") && (l.render(), l.open());
                                        break;

                                    default:
                                        l.render(), l.open();
                                }
                            },
                            theme: r.options.theme,
                            disabled: "scrawl" == n && -1 == r.queryCommandState("scrawl")
                        });
                        return t.buttons[n] = d, r.addListener("selectionchange", function () {
                            var e = {
                                edittable: 1
                            };
                            if (!(n in e)) {
                                var t = r.queryCommandState(n);
                                d.getDom() && (d.setDisabled(-1 == t), d.setChecked(t));
                            }
                        }), d;
                    };
                }(r.toLowerCase());
            }(l, d[l]);
            t.fontfamily = function (i, n, o) {
                if (n = i.options.fontfamily || [], o = i.options.labelMap.fontfamily || i.getLang("labelMap.fontfamily") || "",
                        n.length) {
                    for (var r, s = 0, a = []; r = n[s]; s++) {
                        var l = i.getLang("fontfamily")[r.name] || "";
                        !function (t, n) {
                            a.push({
                                label: t,
                                value: n,
                                theme: i.options.theme,
                                renderLabelHtml: function () {
                                    return '<div class="edui-label %%-label" style="font-family:' + e.unhtml(this.value) + '">' + (this.label || "") + "</div>";
                                }
                            });
                        }(r.label || l, r.val);
                    }
                    var d = new t.Combox({
                        editor: i,
                        items: a,
                        onselect: function (e, t) {
                            i.execCommand("FontFamily", this.items[t].value);
                        },
                        onbuttonclick: function () {
                            this.showPopup();
                        },
                        title: o,
                        initValue: o,
                        className: "edui-for-fontfamily",
                        indexByValue: function (e) {
                            if (e)for (var t, i = 0; t = this.items[i]; i++)if (-1 != t.value.indexOf(e))return i;
                            return -1;
                        }
                    });
                    return t.buttons.fontfamily = d, i.addListener("selectionchange", function (e, t, n) {
                        if (!n) {
                            var o = i.queryCommandState("FontFamily");
                            if (-1 == o)d.setDisabled(!0); else {
                                d.setDisabled(!1);
                                var r = i.queryCommandValue("FontFamily");
                                r && (r = r.replace(/['"]/g, "").split(",")[0]), d.setValue(r);
                            }
                        }
                    }), d;
                }
            }, t.fontsize = function (e, i, n) {
                if (n = e.options.labelMap.fontsize || e.getLang("labelMap.fontsize") || "", i = i || e.options.fontsize || [],
                        i.length) {
                    for (var o = [], r = 0; r < i.length; r++) {
                        var s = i[r] + "px";
                        o.push({
                            label: s,
                            value: s,
                            theme: e.options.theme,
                            renderLabelHtml: function () {
                                return '<div class="edui-label %%-label" style="line-height:1;font-size:' + this.value + '">' + (this.label || "") + "</div>";
                            }
                        });
                    }
                    var a = new t.Combox({
                        editor: e,
                        items: o,
                        title: n,
                        useInput: browser.ie && browser.version < 9 ? !1 : !0,
                        initValue: n,
                        onselect: function (t, i) {
                            e.execCommand("FontSize", this.items[i].value);
                        },
                        onbuttonclick: function () {
                            this.showPopup();
                        },
                        oninputclick: function () {
                            var e = this;
                            setTimeout(function () {
                                {
                                    var t = e.getDom("wx_input"), i = (parseInt(this.value), t.value);
                                    parseInt(i);
                                }
                                browser.ie ? (t.value = "", t.focus()) : (t.focus(), t.select());
                            }, 100);
                        },
                        oninputblur: function () {
                            var t = this, i = t.getDom("wx_input"), n = i.value, o = parseInt(n), r = parseInt(this.value);
                            return "" == n ? (i.value = r + "px", !1) : (10 > o && (o = 10), o > 50 && (o = 50), r == o ? !1 : void e.execCommand("FontSize", o + "px"));
                        },
                        oninputkeydown: function (e, t) {
                            var i = this, n = t.keyCode || t.which, o = i.getDom("wx_input");
                            13 == n && (o.blur(), t.stopPropagation ? (t.stopPropagation(), t.preventDefault()) : t.cancelBubble = !0);
                        },
                        className: "edui-for-fontsize"
                    });
                    return t.buttons.fontsize = a, e.addListener("selectionchange", function (t, i, n) {
                        if (!n) {
                            var o = e.queryCommandState("FontSize");
                            -1 == o ? a.setDisabled(!0) : (a.setDisabled(!1), a.setValue(e.queryCommandValue("FontSize")));
                        }
                    }), a;
                }
            }, t.paragraph = function (i, n, o) {
                if (o = i.options.labelMap.paragraph || i.getLang("labelMap.paragraph") || "", n = i.options.paragraph || [],
                        !e.isEmptyObject(n)) {
                    var r = [];
                    for (var s in n)r.push({
                        value: s,
                        label: n[s] || i.getLang("paragraph")[s],
                        theme: i.options.theme,
                        renderLabelHtml: function () {
                            return '<div class="edui-label %%-label"><span class="edui-for-' + this.value + '">' + (this.label || "") + "</span></div>";
                        }
                    });
                    var a = new t.Combox({
                        editor: i,
                        items: r,
                        title: o,
                        initValue: o,
                        className: "edui-for-paragraph",
                        onselect: function (e, t) {
                            i.execCommand("Paragraph", this.items[t].value);
                        },
                        onbuttonclick: function () {
                            this.showPopup();
                        }
                    });
                    return t.buttons.paragraph = a, i.addListener("selectionchange", function (e, t, n) {
                        if (!n) {
                            var o = i.queryCommandState("Paragraph");
                            if (-1 == o)a.setDisabled(!0); else {
                                a.setDisabled(!1);
                                var r = i.queryCommandValue("Paragraph"), s = a.indexByValue(r);
                                a.setValue(-1 != s ? r : a.initValue);
                            }
                        }
                    }), a;
                }
            }, t.customstyle = function (e) {
                var i = e.options.customstyle || [], n = e.options.labelMap.customstyle || e.getLang("labelMap.customstyle") || "";
                if (i.length) {
                    for (var o, r = e.getLang("customstyle"), s = 0, a = []; o = i[s++];)!function (t) {
                        var i = {};
                        i.label = t.label ? t.label : r[t.name], i.style = t.style, i.className = t.className, i.tag = t.tag,
                            a.push({
                                label: i.label,
                                value: i,
                                theme: e.options.theme,
                                renderLabelHtml: function () {
                                    return '<div class="edui-label %%-label"><' + i.tag + " " + (i.className ? ' class="' + i.className + '"' : "") + (i.style ? ' style="' + i.style + '"' : "") + ">" + i.label + "</" + i.tag + "></div>";
                                }
                            });
                    }(o);
                    var l = new t.Combox({
                        editor: e,
                        items: a,
                        title: n,
                        initValue: n,
                        className: "edui-for-customstyle",
                        onselect: function (t, i) {
                            e.execCommand("customstyle", this.items[i].value);
                        },
                        onbuttonclick: function () {
                            this.showPopup();
                        },
                        indexByValue: function (e) {
                            for (var t, i = 0; t = this.items[i++];)if (t.label == e)return i - 1;
                            return -1;
                        }
                    });
                    return t.buttons.customstyle = l, e.addListener("selectionchange", function (t, i, n) {
                        if (!n) {
                            var o = e.queryCommandState("customstyle");
                            if (-1 == o)l.setDisabled(!0); else {
                                l.setDisabled(!1);
                                var r = e.queryCommandValue("customstyle"), s = l.indexByValue(r);
                                l.setValue(-1 != s ? r : l.initValue);
                            }
                        }
                    }), l;
                }
            }, t.inserttable = function (e, i, n) {
                n = e.options.labelMap.inserttable || e.getLang("labelMap.inserttable") || "";
                var o = new t.TableButton({
                    editor: e,
                    title: n,
                    className: "edui-for-inserttable",
                    onpicktable: function (t, i, n) {
                        e.execCommand("InsertTable", {
                            numRows: n,
                            numCols: i,
                            border: 1
                        });
                    },
                    onbuttonclick: function () {
                        this.showPopup();
                    }
                });
                return t.buttons.inserttable = o, e.addListener("selectionchange", function () {
                    o.setDisabled(-1 == e.queryCommandState("inserttable"));
                }), o;
            }, t.lineheight = function (e) {
                var i = e.options.lineheight || [];
                if (i.length) {
                    for (var n, o = 0, r = []; n = i[o++];)r.push({
                        label: n,
                        value: n,
                        theme: e.options.theme,
                        onclick: function () {
                            e.execCommand("lineheight", this.value);
                        }
                    });
                    var s = new t.MenuButton({
                        editor: e,
                        className: "edui-for-lineheight",
                        title: e.options.labelMap.lineheight || e.getLang("labelMap.lineheight") || "",
                        items: r,
                        onbuttonclick: function () {
                            var t = e.queryCommandValue("LineHeight") || this.value;
                            e.execCommand("LineHeight", t);
                        }
                    });
                    return t.buttons.lineheight = s, e.addListener("selectionchange", function () {
                        var t = e.queryCommandState("LineHeight");
                        if (-1 == t)s.setDisabled(!0); else {
                            s.setDisabled(!1);
                            var i = e.queryCommandValue("LineHeight");
                            i && s.setValue((i + "").replace(/cm/, "")), s.setChecked(t);
                        }
                    }), s;
                }
            };
            for (var c, u = ["top", "bottom"], m = 0; c = u[m++];)!function (e) {
                t["rowspacing" + e] = function (i) {
                    var n = i.options["rowspacing" + e] || [];
                    if (!n.length)return null;
                    for (var o, r = 0, s = []; o = n[r++];)s.push({
                        label: o,
                        value: o,
                        theme: i.options.theme,
                        onclick: function () {
                            i.execCommand("rowspacing", this.value, e);
                        }
                    });
                    var a = new t.MenuButton({
                        editor: i,
                        className: "edui-for-rowspacing" + e,
                        title: i.options.labelMap["rowspacing" + e] || i.getLang("labelMap.rowspacing" + e) || "",
                        items: s,
                        onbuttonclick: function () {
                            var t = i.queryCommandValue("rowspacing", e) || this.value;
                            i.execCommand("rowspacing", t, e);
                        }
                    });
                    return t.buttons[e] = a, i.addListener("selectionchange", function () {
                        var t = i.queryCommandState("rowspacing", e);
                        if (-1 == t)a.setDisabled(!0); else {
                            a.setDisabled(!1);
                            var n = i.queryCommandValue("rowspacing", e);
                            n && a.setValue((n + "").replace(/%/, "")), a.setChecked(t);
                        }
                    }), a;
                };
            }(c);
            for (var f, h = ["insertorderedlist", "insertunorderedlist"], p = 0; f = h[p++];)!function (e) {
                t[e] = function (i) {
                    var n = i.options[e], o = function () {
                        i.execCommand(e, this.value);
                    }, r = [];
                    for (var s in n)r.push({
                        label: n[s] || i.getLang()[e][s] || "",
                        value: s,
                        theme: i.options.theme,
                        onclick: o
                    });
                    var a = new t.MenuButton({
                        editor: i,
                        className: "edui-for-" + e,
                        title: i.getLang("labelMap." + e) || "",
                        items: r,
                        onbuttonclick: function () {
                            var t = i.queryCommandValue(e) || this.value;
                            i.execCommand(e, t);
                        }
                    });
                    return t.buttons[e] = a, i.addListener("selectionchange", function () {
                        var t = i.queryCommandState(e);
                        if (-1 == t)a.setDisabled(!0); else {
                            a.setDisabled(!1);
                            var n = i.queryCommandValue(e);
                            a.setValue(n), a.setChecked(t);
                        }
                    }), a;
                };
            }(f);
        }(), function () {
            function e(e) {
                this.initOptions(e), this.initEditorUI();
            }

            var t = baidu.editor.utils, i = baidu.editor.ui.uiUtils, n = baidu.editor.ui.UIBase, o = baidu.editor.dom.domUtils, r = [], s = require("tpl/mpEditor/layout.html.js");
            s = template.compile(s), e.prototype = {
                uiName: "editor",
                initEditorUI: function () {
                    function e(e, t) {
                        e.setOpt({
                            wordCount: !0,
                            maximumWords: 1e4,
                            wordCountMsg: e.options.wordCountMsg || e.getLang("wordCountMsg"),
                            wordOverFlowMsg: e.options.wordOverFlowMsg || e.getLang("wordOverFlowMsg")
                        });
                        var i = e.options, n = i.maximumWords, o = i.wordCountMsg, r = i.wordOverFlowMsg, s = t.getDom("wordcount");
                        if (i.wordCount) {
                            var a = e.getContentLength(!0);
                            a > n ? (s.innerHTML = r, e.fireEvent("wordcountoverflow")) : s.innerHTML = o.replace("{#leave}", n - a).replace("{#count}", a);
                        }
                    }

                    function t() {
                        var e = {
                            html: "",
                            node: null
                        };
                        if (n.fireEvent("handle_common_popup", e), e.html && e.node) {
                            d.getDom("content").innerHTML = d.formatHtml(e.html);
                            var t = $(e.node).find("img");
                            t.length > 0 && (e.node = t[0]), d._anchorEl = e.node, /^img$/i.test(e.node.tagName) ? d.showAnchorRect(!0) : d.showAnchorRect();
                        } else d.hide();
                    }

                    this.editor.ui = this, this._dialogs = {}, this.initUIBase(), this._initToolbars();
                    var n = this.editor, r = this;
                    n.addListener("ready", function () {
                        function t() {
                            e(n, r), o.un(n.document, "click", arguments.callee);
                        }

                        n.getDialog = function (e) {
                            return n.ui._dialogs[e + "Dialog"];
                        }, o.on(n.window, "scroll", function (e) {
                            baidu.editor.ui.Popup.postHide(e);
                        }), n.ui._actualFrameWidth = n.options.initialFrameWidth, n.options.elementPathEnabled && (n.ui.getDom("elementpath").innerHTML = '<div class="edui-editor-breadcrumb">' + n.getLang("elementPathTip") + ":</div>"),
                        n.options.wordCount && (o.on(n.document, "click", t), n.ui.getDom("wordcount").innerHTML = n.getLang("wordCountTip")),
                            n.ui._scale(), n.options.scaleEnabled ? (n.autoHeightEnabled && n.disableAutoHeight(),
                            r.enableScale()) : r.disableScale(), n.options.elementPathEnabled || n.options.wordCount || n.options.scaleEnabled || (n.ui.getDom("elementpath").style.display = "none",
                            n.ui.getDom("wordcount").style.display = "none", n.ui.getDom("scale").style.display = "none"),
                        n.selection.isFocus() && n.fireEvent("selectionchange", !1, !0);
                    }), n.addListener("mousedown", function (e, t) {
                        var i = t.target || t.srcElement;
                        baidu.editor.ui.Popup.postHide(t, i), baidu.editor.ui.ShortCutMenu.postHide(t);
                    }), n.addListener("delcells", function () {
                        UE.ui.edittip && new UE.ui.edittip(n), n.getDialog("edittip").open();
                    });
                    var s, a, l = !1;
                    n.addListener("afterpaste", function () {
                        n.queryCommandState("pasteplain") || (baidu.editor.ui.PastePicker && (s = new baidu.editor.ui.Popup({
                            content: new baidu.editor.ui.PastePicker({
                                editor: n
                            }),
                            editor: n,
                            className: "edui-wordpastepop"
                        }), s.render()), l = !0);
                    }), n.addListener("afterinserthtml", function () {
                        clearTimeout(a), a = setTimeout(function () {
                            if (s && (l || n.ui._isTransfer)) {
                                if (s.isHidden()) {
                                    var e = o.createElement(n.document, "span", {
                                        style: "line-height:0px;",
                                        innerHTML: "﻿"
                                    }), t = n.selection.getRange();
                                    t.insertNode(e);
                                    var i = getDomNode(e, "firstChild", "previousSibling");
                                    i && s.showAnchor(3 == i.nodeType ? i.parentNode : i), o.remove(e);
                                } else s.show();
                                delete n.ui._isTransfer, l = !1;
                            }
                        }, 200);
                    }), n.addListener("contextmenu", function (e, t) {
                        baidu.editor.ui.Popup.postHide(t);
                    }), n.addListener("keydown", function (e, t) {
                        s && s.dispose(t);
                        var i = t.keyCode || t.which;
                        t.altKey && 90 == i && UE.ui.buttons.fullscreen.onclick();
                    }), n.addListener("wordcount", function () {
                        e(this, r);
                    }), n.addListener("selectionchange", function () {
                        n.options.elementPathEnabled && r[(-1 == n.queryCommandState("elementpath") ? "dis" : "en") + "ableElementPath"](),
                        n.options.scaleEnabled && r[(-1 == n.queryCommandState("scale") ? "dis" : "en") + "ableScale"]();
                    });
                    var d = new baidu.editor.ui.Popup({
                        editor: n,
                        content: "",
                        className: "edui-bubble",
                        _execCommand: function () {
                            n.execCommand.apply(n, arguments), t();
                        },
                        _execCommandAndHide: function () {
                            n.execCommand.apply(n, arguments), this.hide();
                        },
                        _delRange: function () {
                            n.fireEvent("saveScene");
                            var e = $(this._anchorEl), t = e.parent("a");
                            t.length > 0 && (e = t), n.selection.getRange().collapse(!1), e.remove(), this.hide(), n.focus(),
                                n.fireEvent("saveScene");
                        },
                        _imgAutoWidth: function (e) {
                            n.fireEvent("saveScene");
                            var t = $(this.getDom("content")), i = t.find(".js_adapt"), o = t.find(".js_canceladapt");
                            e === !0 ? (this._anchorEl.style.width = "100%", i.hide(), o.show()) : (this._anchorEl.style.width = "auto",
                                i.show(), o.hide()), this._anchorEl.style.height = "auto", n.fireEvent("saveScene");
                        },
                        getHtmlTpl: function () {
                            return '<div id="##" class="edui-popup edui_mask_edit_bar %%"> <div id="##_body" class="edui-popup-body"> <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe> <div class="edui-shadow"></div> <div id="##_content" class="edui-popup-content">' + this.getContentHtmlTpl() + "  </div> </div></div>";
                        },
                        showAnchorRect: function (e) {
                            this._doAutoRender();
                            var t = i.getViewportRect();
                            this._show();
                            var n, o, r, s, a = this.fitSize(), l = i.getClientRect(this._anchorEl);
                            if (n = this.canSideLeft && l.right + a.width > t.right && l.left > a.width, o = this.canSideUp && l.top + a.height > t.bottom && l.bottom > a.height,
                                    r = n ? l.right - a.width : l.left, s = o ? l.top - a.height : l.bottom, e) {
                                var d = $(".js_main_title").height(), c = $(".edui-editor-toolbarbox").height();
                                s = Math.max(l.top, t.top + d + c);
                            }
                            var u = this.getDom();
                            i.setViewportOffset(u, {
                                left: r,
                                top: s
                            }), this.editor && (u.style.zIndex = 1 * this.editor.container.style.zIndex + 10, baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = u.style.zIndex - 1);
                        },
                        queryAutoHide: function (e) {
                            return e && e.ownerDocument == n.document && ("img" == e.tagName.toLowerCase() || o.findParentByTagName(e, "a", !0)) ? e !== d.anchorEl : baidu.editor.ui.Popup.prototype.queryAutoHide.call(this, e);
                        }
                    });
                    n.common_popup = d, d.render(), n.addListener("selectionchange", function (e, i) {
                        i && t();
                    });
                },
                _initToolbars: function () {
                    for (var e = this.editor, t = this.toolbars || [], i = [], n = ["edui-toolbar-primary", "edui-toobar-secondary"], o = 0; o < t.length; o++) {
                        for (var r = t[o], s = new baidu.editor.ui.Toolbar({
                            theme: e.options.theme,
                            className: n[o],
                            id: "js_toolbar_" + o
                        }), a = 0; a < r.length; a++) {
                            var l = r[a], d = null;
                            "string" == typeof l ? (l = l.toLowerCase(), "|" == l && (l = "Separator"), "||" == l && (l = "Breakline"),
                            baidu.editor.ui[l] && (d = new baidu.editor.ui[l](e))) : d = l, d && d.id && s.add(d);
                        }
                        i[o] = s;
                    }
                    this.toolbars = i;
                },
                getHtmlTpl: function () {
                    return s({
                        length: this.toolbars.length,
                        toolbarBoxHtml: this.renderToolbarBoxHtml(),
                        clickToUpload: this.editor.getLang("clickToUpload")
                    });
                },
                showWordImageDialog: function () {
                    this.editor.execCommand("wordimage", "word_img"), this._dialogs.wordimageDialog.open();
                },
                renderToolbarBoxHtml: function () {
                    for (var e = [], t = 0; t < this.toolbars.length; t++)e.push(this.toolbars[t].renderHtml());
                    return e.join("");
                },
                setFullScreen: function (e) {
                    var t = this.editor, i = t.container.parentNode.parentNode;
                    if (this._fullscreen != e) {
                        if (this._fullscreen = e, this.editor.fireEvent("beforefullscreenchange", e), baidu.editor.browser.gecko)var n = t.selection.getRange().createBookmark();
                        if (e) {
                            for (; "BODY" != i.tagName;) {
                                var o = baidu.editor.dom.domUtils.getComputedStyle(i, "position");
                                r.push(o), i.style.position = "static", i = i.parentNode;
                            }
                            this._bakHtmlOverflow = document.documentElement.style.overflow, this._bakBodyOverflow = document.body.style.overflow,
                                this._bakAutoHeight = this.editor.autoHeightEnabled, this._bakScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                                this._bakEditorContaninerWidth = t.iframe.parentNode.offsetWidth, this._bakAutoHeight && (t.autoHeightEnabled = !1,
                                this.editor.disableAutoHeight()), document.documentElement.style.overflow = "hidden",
                                document.body.style.overflow = "hidden", this._bakCssText = this.getDom().style.cssText,
                                this._bakCssText1 = this.getDom("iframeholder").style.cssText, t.iframe.parentNode.style.width = "",
                                this._updateFullScreen();
                        } else {
                            for (; "BODY" != i.tagName;)i.style.position = r.shift(), i = i.parentNode;
                            this.getDom().style.cssText = this._bakCssText, this.getDom("iframeholder").style.cssText = this._bakCssText1,
                            this._bakAutoHeight && (t.autoHeightEnabled = !0, this.editor.enableAutoHeight()), document.documentElement.style.overflow = this._bakHtmlOverflow,
                                document.body.style.overflow = this._bakBodyOverflow, t.iframe.parentNode.style.width = this._bakEditorContaninerWidth + "px",
                                window.scrollTo(0, this._bakScrollTop);
                        }
                        if (browser.gecko && "true" === t.body.contentEditable) {
                            var s = document.createElement("input");
                            document.body.appendChild(s), t.body.contentEditable = !1, setTimeout(function () {
                                s.focus(), setTimeout(function () {
                                    t.body.contentEditable = !0, t.fireEvent("fullscreenchanged", e), t.selection.getRange().moveToBookmark(n).select(!0),
                                        baidu.editor.dom.domUtils.remove(s), e && window.scroll(0, 0);
                                }, 0);
                            }, 0);
                        }
                        "true" === t.body.contentEditable && (this.editor.fireEvent("fullscreenchanged", e), this.triggerLayout());
                    }
                },
                _updateFullScreen: function () {
                    if (this._fullscreen) {
                        var e = i.getViewportRect();
                        if (this.getDom().style.cssText = "border:0;position:absolute;left:0;top:" + (this.editor.options.topOffset || 0) + "px;width:" + e.width + "px;height:" + e.height + "px;z-index:" + (1 * this.getDom().style.zIndex + 100),
                                i.setViewportOffset(this.getDom(), {
                                    left: 0,
                                    top: this.editor.options.topOffset || 0
                                }), this.editor.setHeight(e.height - this.getDom("toolbarbox").offsetHeight - this.getDom("bottombar").offsetHeight - (this.editor.options.topOffset || 0)),
                                browser.gecko)try {
                            window.onresize();
                        } catch (t) {
                        }
                    }
                },
                _updateElementPath: function () {
                    var e, t = this.getDom("elementpath");
                    if (this.elementPathEnabled && (e = this.editor.queryCommandValue("elementpath"))) {
                        for (var i, n = [], o = 0; i = e[o]; o++)n[o] = this.formatHtml('<span unselectable="on" onclick="$$.editor.execCommand(&quot;elementpath&quot;, &quot;' + o + '&quot;);">' + i + "</span>");
                        t.innerHTML = '<div class="edui-editor-breadcrumb" onmousedown="return false;">' + this.editor.getLang("elementPathTip") + ": " + n.join(" &gt; ") + "</div>";
                    } else t.style.display = "none";
                },
                disableElementPath: function () {
                    var e = this.getDom("elementpath");
                    e.innerHTML = "", e.style.display = "none", this.elementPathEnabled = !1;
                },
                enableElementPath: function () {
                    var e = this.getDom("elementpath");
                    e.style.display = "", this.elementPathEnabled = !0, this._updateElementPath();
                },
                _scale: function () {
                    function e() {
                        h = o.getXY(a), p || (p = s.options.minFrameHeight + d.offsetHeight + c.offsetHeight), m.style.cssText = "position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:" + a.offsetWidth + "px;height:" + a.offsetHeight + "px;z-index:" + (s.options.zIndex + 1),
                            o.on(r, "mousemove", t), o.on(l, "mouseup", i), o.on(r, "mouseup", i);
                    }

                    function t(e) {
                        n();
                        var t = e || window.event;
                        v = t.pageX || r.documentElement.scrollLeft + t.clientX, b = t.pageY || r.documentElement.scrollTop + t.clientY,
                            y = v - h.x, C = b - h.y, y >= g && (f = !0, m.style.width = y + "px"), C >= p && (f = !0, m.style.height = C + "px");
                    }

                    function i() {
                        f && (f = !1, s.ui._actualFrameWidth = m.offsetWidth - 2, a.style.width = s.ui._actualFrameWidth + "px",
                            s.setHeight(m.offsetHeight - c.offsetHeight - d.offsetHeight - 2)), m && (m.style.display = "none"),
                            n(), o.un(r, "mousemove", t), o.un(l, "mouseup", i), o.un(r, "mouseup", i);
                    }

                    function n() {
                        browser.ie ? r.selection.clear() : window.getSelection().removeAllRanges();
                    }

                    var r = document, s = this.editor, a = s.container, l = s.document, d = this.getDom("toolbarbox"), c = this.getDom("bottombar"), u = this.getDom("scale"), m = this.getDom("scalelayer"), f = !1, h = null, p = 0, g = s.options.minFrameWidth, v = 0, b = 0, y = 0, C = 0;
                    this.enableScale = function () {
                        1 != s.queryCommandState("source") && (u.style.display = "", this.scaleEnabled = !0, o.on(u, "mousedown", e));
                    }, this.disableScale = function () {
                        u.style.display = "none", this.scaleEnabled = !1, o.un(u, "mousedown", e);
                    };
                },
                isFullScreen: function () {
                    return this._fullscreen;
                },
                postRender: function () {
                    n.prototype.postRender.call(this);
                    for (var e = 0; e < this.toolbars.length; e++)this.toolbars[e].postRender();
                    var t, i = this, o = baidu.editor.dom.domUtils, r = function () {
                        clearTimeout(t), t = setTimeout(function () {
                            i._updateFullScreen();
                        });
                    };
                    o.on(window, "resize", r), i.addListener("destroy", function () {
                        o.un(window, "resize", r), clearTimeout(t);
                    });
                },
                showToolbarMsg: function (e, t) {
                    if (this.getDom("toolbarmsg_label").innerHTML = e, this.getDom("toolbarmsg").style.display = "",
                            !t) {
                        var i = this.getDom("upload_dialog");
                        i.style.display = "none";
                    }
                },
                hideToolbarMsg: function () {
                    this.getDom("toolbarmsg").style.display = "none";
                },
                mapUrl: function (e) {
                    return e ? e.replace("~/", this.editor.options.UEDITOR_HOME_URL || "") : "";
                },
                triggerLayout: function () {
                    var e = this.getDom();
                    e.style.zoom = "1" == e.style.zoom ? "100%" : "1";
                }
            }, t.inherits(e, baidu.editor.ui.UIBase);
            var a = {};
            UE.ui.Editor = function (i) {
                var n = new UE.Editor(i);
                n.options.editor = n;
                var r = n.render;
                return n.render = function (i) {
                    i.constructor === String && (n.key = i, a[i] = n), t.domReady(function () {
                        function t() {
                            if (n.setOpt({
                                    labelMap: n.options.labelMap || n.getLang("labelMap")
                                }), new e(n.options), i && (i.constructor === String && (i = document.getElementById(i)), i && i.getAttribute("name") && (n.options.textarea = i.getAttribute("name")),
                                i && /script|textarea/gi.test(i.tagName))) {
                                var t = document.createElement("div");
                                i.parentNode.insertBefore(t, i);
                                var s = i.value || i.innerHTML;
                                n.options.initialContent = /^[\t\r\n ]*$/.test(s) ? n.options.initialContent : s.replace(/>[\n\r\t]+([ ]{4})+/g, ">").replace(/[\n\r\t]+([ ]{4})+</g, "<").replace(/>[\n\r\t]+</g, "><"),
                                i.className && (t.className = i.className), i.style.cssText && (t.style.cssText = i.style.cssText),
                                    /textarea/i.test(i.tagName) ? (n.textarea = i, n.textarea.style.display = "none") : (i.parentNode.removeChild(i),
                                    i.id && (t.id = i.id)), i = t, i.innerHTML = "";
                            }
                            o.addClass(i, "edui-" + n.options.theme), n.ui.render(i);
                            n.options;
                            n.container = n.ui.getDom(), n.container.style.cssText = "z-index:" + n.options.zIndex + ";width:" + n.options.initialFrameWidth + "px",
                                r.call(n, n.ui.getDom("iframeholder"));
                        }

                        n.langIsReady ? t() : n.addListener("langReady", t);
                    });
                }, n;
            }, UE.getEditor = function (e, t) {
                var i = a[e];
                return i || (i = a[e] = new UE.ui.Editor(t), i.render(e)), i;
            }, UE.delEditor = function (e) {
                var t;
                (t = a[e]) && (t.key && t.destroy(), delete a[e]);
            };
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.Popup, i = baidu.editor.ui.SplitButton, n = baidu.editor.ui.MultiMenuPop = function (e) {
                this.initOptions(e), this.initMultiMenu();
            };
            n.prototype = {
                initMultiMenu: function () {
                    var e = this;
                    this.popup = new t({
                        content: "",
                        editor: e.editor,
                        iframe_rendered: !1,
                        onshow: function () {
                            this.iframe_rendered || (this.iframe_rendered = !0, this.getDom("content").innerHTML = '<iframe id="' + e.id + '_iframe" src="' + e.iframeUrl + '" frameborder="0"></iframe>',
                            e.editor.container.style.zIndex && (this.getDom().style.zIndex = 1 * e.editor.container.style.zIndex + 1));
                        }
                    }), this.onbuttonclick = function () {
                        this.showPopup();
                    }, this.initSplitButton();
                }
            }, e.inherits(n, i);
        }(), function () {
            function e(e) {
                var t = e.target || e.srcElement, i = s.findParent(t, function (e) {
                    return s.hasClass(e, "edui-shortcutmenu") || s.hasClass(e, "edui-popup");
                }, !0);
                if (!i)for (var n, o = 0; n = a[o++];)n.hide();
            }

            var t, i = baidu.editor.ui, n = i.UIBase, o = i.uiUtils, r = baidu.editor.utils, s = baidu.editor.dom.domUtils, a = [], l = !1, d = i.ShortCutMenu = function (e) {
                this.initOptions(e), this.initShortCutMenu();
            };
            d.postHide = e, d.prototype = {
                isHidden: !0,
                SPACE: 5,
                initShortCutMenu: function () {
                    this.items = this.items || [], this.initUIBase(), this.initItems(), this.initEvent(), a.push(this);
                },
                initEvent: function () {
                    var e = this, i = e.editor.document;
                    s.on(i, "mousemove", function (i) {
                        if (e.isHidden === !1) {
                            if (e.getSubMenuMark() || "contextmenu" == e.eventType)return;
                            var n = !0, o = e.getDom(), r = o.offsetWidth, s = o.offsetHeight, a = r / 2 + e.SPACE, l = s / 2, d = Math.abs(i.screenX - e.left), c = Math.abs(i.screenY - e.top);
                            clearTimeout(t), t = setTimeout(function () {
                                c > 0 && l > c ? e.setOpacity(o, "1") : c > l && l + 70 > c ? (e.setOpacity(o, "0.5"), n = !1) : c > l + 70 && l + 140 > c && e.hide(),
                                    n && d > 0 && a > d ? e.setOpacity(o, "1") : d > a && a + 70 > d ? e.setOpacity(o, "0.5") : d > a + 70 && a + 140 > d && e.hide();
                            });
                        }
                    }), browser.chrome && s.on(i, "mouseout", function (t) {
                        var i = t.relatedTarget || t.toElement;
                        (null == i || "HTML" == i.tagName) && e.hide();
                    }), e.editor.addListener("afterhidepop", function () {
                        e.isHidden || (l = !0);
                    });
                },
                initItems: function () {
                    if (r.isArray(this.items))for (var e = 0, t = this.items.length; t > e; e++) {
                        var n = this.items[e].toLowerCase();
                        i[n] && (this.items[e] = new i[n](this.editor), this.items[e].className += " edui-shortcutsubmenu ");
                    }
                },
                setOpacity: function (e, t) {
                    browser.ie && browser.version < 9 ? e.style.filter = "alpha(opacity = " + 100 * parseFloat(t) + ");" : e.style.opacity = t;
                },
                getSubMenuMark: function () {
                    l = !1;
                    for (var e, t = o.getFixedLayer(), i = s.getElementsByTagName(t, "div", function (e) {
                        return s.hasClass(e, "edui-shortcutsubmenu edui-popup");
                    }), n = 0; e = i[n++];)"none" != e.style.display && (l = !0);
                    return l;
                },
                show: function (e, t) {
                    function i(e) {
                        e.left < 0 && (e.left = 0), e.top < 0 && (e.top = 0), l.style.cssText = "position:absolute;left:" + e.left + "px;top:" + e.top + "px;";
                    }

                    function n(e) {
                        e.tagName || (e = e.getDom()), a.left = parseInt(e.style.left), a.top = parseInt(e.style.top),
                            a.top -= l.offsetHeight + 15, i(a);
                    }

                    var r = this, a = {}, l = this.getDom(), d = o.getFixedLayer();
                    if (r.eventType = e.type, l.style.cssText = "display:block;left:-9999px", "contextmenu" == e.type && t) {
                        var c = s.getElementsByTagName(d, "div", "edui-contextmenu")[0];
                        c ? n(c) : r.editor.addListener("aftershowcontextmenu", function (e, t) {
                            n(t);
                        });
                    } else a = o.getViewportOffsetByEvent(e), a.top -= l.offsetHeight + r.SPACE, a.left += r.SPACE + 20,
                        i(a), r.setOpacity(l, .2);
                    r.isHidden = !1, r.left = e.screenX + l.offsetWidth / 2 - r.SPACE, r.top = e.screenY - l.offsetHeight / 2 - r.SPACE,
                    r.editor && (l.style.zIndex = 1 * r.editor.container.style.zIndex + 10, d.style.zIndex = l.style.zIndex - 1);
                },
                hide: function () {
                    this.getDom() && (this.getDom().style.display = "none"), this.isHidden = !0;
                },
                postRender: function () {
                    if (r.isArray(this.items))for (var e, t = 0; e = this.items[t++];)e.postRender();
                },
                getHtmlTpl: function () {
                    var e;
                    if (r.isArray(this.items)) {
                        e = [];
                        for (var t = 0; t < this.items.length; t++)e[t] = this.items[t].renderHtml();
                        e = e.join("");
                    } else e = this.items;
                    return '<div id="##" class="%% edui-toolbar" data-src="shortcutmenu" onmousedown="return false;" onselectstart="return false;" >' + e + "</div>";
                }
            }, r.inherits(d, n), s.on(document, "mousedown", function (t) {
                e(t);
            }), s.on(window, "scroll", function (t) {
                e(t);
            });
        }(), function () {
            var e = baidu.editor.utils, t = baidu.editor.ui.UIBase, i = baidu.editor.ui.Breakline = function (e) {
                this.initOptions(e), this.initSeparator();
            };
            i.prototype = {
                uiName: "Breakline",
                initSeparator: function () {
                    this.initUIBase();
                },
                getHtmlTpl: function () {
                    return "<br/>";
                }
            }, e.inherits(i, t);
        }();
    });