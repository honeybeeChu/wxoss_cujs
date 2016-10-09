define("common/lib/MockJax.js", [], function (e, t, n) {
    try {
        var r = +(new Date);
        (function (e) {
            function t(t) {
                window.DOMParser == undefined && window.ActiveXObject && (DOMParser = function () {
                }, DOMParser.prototype.parseFromString = function (e) {
                    var t = new ActiveXObject("Microsoft.XMLDOM");
                    return t.async = "false", t.loadXML(e), t;
                });
                try {
                    var n = (new DOMParser).parseFromString(t, "text/xml");
                    if (!e.isXMLDoc(n)) throw "Unable to parse XML";
                    var r = e("parsererror", n);
                    if (r.length == 1) throw "Error: " + e(n).text();
                    return n;
                } catch (i) {
                    var s = i.name == undefined ? i : i.name + ": " + i.message;
                    return e(document).trigger("xmlParseError", [s]), undefined;
                }
            }

            function n(t, n, r) {
                (t.context ? e(t.context) : e.event).trigger(n, r);
            }

            function r(t, n) {
                var i = !0;
                return typeof n == "string" ? e.isFunction(t.test) ? t.test(n) : t == n : (e.each(t, function (s) {
                    if (n[s] === undefined) return i = !1, i;
                    typeof n[s] == "object" ? i = i && r(t[s], n[s]) : e.isFunction(t[s].test) ? i = i && t[s].test(n[s]) : i = i && t[s] == n[s];
                }), i);
            }

            function i(t, n) {
                if (e.isFunction(t)) return t(n);
                if (e.isFunction(t.url.test)) {
                    if (!t.url.test(n.url)) return null;
                } else {
                    var i = t.url.indexOf("*");
                    if (t.url !== n.url && i === -1 || !(new RegExp(t.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace(/\*/g, ".+"))).test(n.url)) return null;
                }
                return t.data && n.data && !r(t.data, n.data) ? null : t && t.type && t.type.toLowerCase() != n.type.toLowerCase() ? null : t;
            }

            function s(n, r, i) {
                var s = function (s) {
                    return function () {
                        return function () {
                            var s;
                            this.status = n.status, this.statusText = n.statusText, this.readyState = 4, e.isFunction(n.response) && n.response(i), r.dataType == "json" && typeof n.responseText == "object" ? this.responseText = JSON.stringify(n.responseText) : r.dataType == "xml" ? typeof n.responseXML == "string" ? (this.responseXML = t(n.responseXML), this.responseText = n.responseXML) : this.responseXML = n.responseXML : this.responseText = n.responseText;
                            if (typeof n.status == "number" || typeof n.status == "string") this.status = n.status;
                            typeof n.statusText == "string" && (this.statusText = n.statusText), s = this.onreadystatechange || this.onload, e.isFunction(s) ? (n.isTimeout && (this.status = -1), s.call(this, n.isTimeout ? "timeout" : undefined)) : n.isTimeout && (this.status = -1);
                        }.apply(s);
                    };
                }(this);
                n.proxy ? v({
                    global: !1,
                    url: n.proxy,
                    type: n.proxyType,
                    data: n.data,
                    dataType: r.dataType === "script" ? "text/plain" : r.dataType,
                    complete: function (e) {
                        n.responseXML = e.responseXML, n.responseText = e.responseText, n.status = e.status, n.statusText = e.statusText, this.responseTimer = setTimeout(s, n.responseTime || 0);
                    }
                }) : r.async === !1 ? s() : this.responseTimer = setTimeout(s, n.responseTime || 50);
            }

            function o(t, n, r, i) {
                return t = e.extend(!0, {}, e.mockjaxSettings, t), typeof t.headers == "undefined" && (t.headers = {}), t.contentType && (t.headers["content-type"] = t.contentType), {
                    status: t.status,
                    statusText: t.statusText,
                    readyState: 1,
                    open: function () {
                    },
                    send: function () {
                        i.fired = !0, s.call(this, t, n, r);
                    },
                    abort: function () {
                        clearTimeout(this.responseTimer);
                    },
                    setRequestHeader: function (e, n) {
                        t.headers[e] = n;
                    },
                    getResponseHeader: function (e) {
                        if (t.headers && t.headers[e]) return t.headers[e];
                        if (e.toLowerCase() == "last-modified") return t.lastModified || (new Date).toString();
                        if (e.toLowerCase() == "etag") return t.etag || "";
                        if (e.toLowerCase() == "content-type") return t.contentType || "text/plain";
                    },
                    getAllResponseHeaders: function () {
                        var n = "";
                        return e.each(t.headers, function (e, t) {
                            n += e + ": " + t + "\n";
                        }), n;
                    }
                };
            }

            function u(e, t, n) {
                a(e), e.dataType = "json";
                if (e.data && y.test(e.data) || y.test(e.url)) {
                    l(e, t, n);
                    var r = /^(\w+:)?\/\/([^\/?#]+)/, i = r.exec(e.url), s = i && (i[1] && i[1] !== location.protocol || i[2] !== location.host);
                    e.dataType = "script";
                    if (e.type.toUpperCase() === "GET" && s) {
                        var o = f(e, t, n);
                        return o ? o : !0;
                    }
                }
                return null;
            }

            function a(e) {
                if (e.type.toUpperCase() === "GET") y.test(e.url) || (e.url += (/\?/.test(e.url) ? "&" : "?") + (e.jsonp || "callback") + "=?"); else if (!e.data || !y.test(e.data)) e.data = (e.data ? e.data + "&" : "") + (e.jsonp || "callback") + "=?";
            }

            function f(t, n, r) {
                var i = r && r.context || t, s = null;
                return n.response && e.isFunction(n.response) ? n.response(r) : typeof n.responseText == "object" ? e.globalEval("(" + JSON.stringify(n.responseText) + ")") : e.globalEval("(" + n.responseText + ")"), c(t, i, n), h(t, i, n), e.Deferred && (s = new e.Deferred, typeof n.responseText == "object" ? s.resolveWith(i, [n.responseText]) : s.resolveWith(i, [e.parseJSON(n.responseText)])), s;
            }

            function l(e, t, n) {
                var r = n && n.context || e, i = e.jsonpCallback || "jsonp" + b++;
                e.data && (e.data = (e.data + "").replace(y, "=" + i + "$1")), e.url = e.url.replace(y, "=" + i + "$1"), window[i] = window[i] || function (n) {
                        data = n, c(e, r, t), h(e, r, t), window[i] = undefined;
                        try {
                            delete window[i];
                        } catch (s) {
                        }
                        head && head.removeChild(script);
                    };
            }

            function c(e, t, r) {
                e.success && e.success.call(t, r.responseText || "", status, {}), e.global && n(e, "ajaxSuccess", [{}, e]);
            }

            function h(t, r) {
                t.complete && t.complete.call(r, {}, status), t.global && n("ajaxComplete", [{}, t]), t.global && !--e.active && e.event.trigger("ajaxStop");
            }

            function p(t, n) {
                var r, s, a;
                typeof t == "object" ? (n = t, t = undefined) : n.url = t, s = e.extend(!0, {}, e.ajaxSettings, n);
                for (var f = 0; f < m.length; f++) {
                    if (!m[f]) continue;
                    a = i(m[f], s);
                    if (!a) continue;
                    g.push(s), e.mockjaxSettings.log(a, s);
                    if (s.dataType === "jsonp") if (r = u(s, a, n)) return r;
                    return a.cache = s.cache, a.timeout = s.timeout, a.global = s.global, d(a, n), function (t, n, i, s) {
                        r = v.call(e, e.extend(!0, {}, i, {
                            xhr: function () {
                                return o(t, n, i, s);
                            }
                        }));
                    }(a, s, n, m[f]), r;
                }
                return v.apply(e, [n]);
            }

            function d(e, t) {
                if (!(e.url instanceof RegExp)) return;
                if (!e.hasOwnProperty("urlParams")) return;
                var n = e.url.exec(t.url);
                if (n.length === 1) return;
                n.shift();
                var r = 0, i = n.length, s = e.urlParams.length, o = Math.min(i, s), u = {};
                for (r; r < o; r++) {
                    var a = e.urlParams[r];
                    u[a] = n[r];
                }
                t.urlParams = u;
            }

            var v = e.ajax, m = [], g = [], y = /=\?(&|$)/, b = (new Date).getTime();
            e.extend({
                ajax: p
            }), e.mockjaxSettings = {
                log: function (t, n) {
                    if (t.logging === !1 || typeof t.logging == "undefined" && e.mockjaxSettings.logging === !1) return;
                    if (window.console && console.log) {
                        var r = "MOCK " + n.type.toUpperCase() + ": " + n.url, i = e.extend({}, n);
                        if (typeof console.log == "function") console.log(r, i); else try {
                            console.log(r + " " + JSON.stringify(i));
                        } catch (s) {
                            console.log(r);
                        }
                    }
                },
                logging: !0,
                status: 200,
                statusText: "OK",
                responseTime: 500,
                isTimeout: !1,
                contentType: "text/plain",
                response: "",
                responseText: "",
                responseXML: "",
                proxy: "",
                proxyType: "GET",
                lastModified: null,
                etag: "",
                headers: {
                    etag: "IJF@H#@923uf8023hFO@I#H#",
                    "content-type": "text/plain"
                }
            }, e.mockjax = function (e) {
                var t = m.length;
                return m[t] = e, t;
            }, e.mockjaxClear = function (e) {
                arguments.length == 1 ? m[e] = null : m = [], g = [];
            }, e.mockjax.handler = function (e) {
                if (arguments.length == 1) return m[e];
            }, e.mockjax.mockedAjaxCalls = function () {
                return g;
            };
        })(jQuery);
    } catch (i) {
        wx.jslog({
            src: "common/lib/MockJax.js"
        }, i);
    }
});
