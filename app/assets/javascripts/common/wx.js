!function (e) {
    if (e.BJ_REPORT) {
        var n, t = function (n) {
            e.BJ_REPORT.report(n);
        }, o = e.BJ_REPORT.tryJs = function (e) {
            return e && (t = e), o;
        }, r = function (e, n) {
            var t;
            for (t in n)e[t] = n[t];
        }, s = function (e) {
            return "function" == typeof e;
        }, i = function (o, r) {
            return function () {
                try {
                    return o.apply(this, r || arguments);
                } catch (s) {
                    if (t(s), s.stack && console && console.error && console.error("[BJ-REPORT]", s.stack), !n) {
                        var i = e.onerror;
                        e.onerror = function () {
                        }, n = setTimeout(function () {
                            e.onerror = i, n = null;
                        }, 50);
                    }
                    throw s;
                }
            };
        }, a = function (e) {
            return function () {
                for (var n, t = [], o = 0, r = arguments.length; r > o; o++)n = arguments[o], s(n) && (n = i(n)), t.push(n);
                return e.apply(this, t);
            };
        }, u = function (e) {
            return function (n, t) {
                if ("string" == typeof n)try {
                    n = new Function(n);
                } catch (o) {
                    throw o;
                }
                var r = [].slice.call(arguments, 2);
                return n = i(n, r.length && r), e(n, t);
            };
        }, c = function (e, n) {
            return function () {
                for (var t, o, r = [], a = 0, u = arguments.length; u > a; a++)t = arguments[a], s(t) && (o = i(t)) && (t.tryWrap = o) && (t = o),
                    r.push(t);
                return e.apply(n || this, r);
            };
        }, l = function (e) {
            var n, t;
            for (n in e)t = e[n], s(t) && (e[n] = i(t));
            return e;
        };
        o.spyJquery = function () {
            var n = e.$;
            if (!n || !n.event)return o;
            var t = n.event.add, r = n.ajax, i = n.event.remove;
            if (t && (n.event.add = c(t), n.event.remove = function () {
                    for (var e, n = [], t = 0, o = arguments.length; o > t; t++)e = arguments[t], s(e) && (e = e.tryWrap),
                        n.push(e);
                    return i.apply(this, n);
                }), r && (n.ajax = function (e, t) {
                    return t || (t = e, e = void 0), l(t), e ? r.call(n, e, t) : r.call(n, t);
                }), $.zepto) {
                var a = n.fn.on, u = n.fn.off;
                n.fn.on = c(a), n.fn.off = function () {
                    for (var e, n = [], t = 0, o = arguments.length; o > t; t++)e = arguments[t], s(e) && (e = e.tryWrap),
                        n.push(e);
                    return u.apply(this, n);
                };
            }
            return o;
        }, o.spyModules = function () {
            var n = e.require, t = e.define;
            return t && t.amd && n && (e.require = a(n), r(e.require, n), e.define = a(t), r(e.define, t)),
            e.seajs && t && (e.define = function () {
                for (var e, n = [], o = 0, r = arguments.length; r > o; o++)e = arguments[o], s(e) && (e = i(e), e.toString = function (e) {
                    return function () {
                        return e.toString();
                    };
                }(arguments[o])), n.push(e);
                return t.apply(this, n);
            }, e.seajs.use = a(e.seajs.use), r(e.define, t)), o;
        }, o.spySystem = function () {
            return e.setTimeout = u(e.setTimeout), e.setInterval = u(e.setInterval), o;
        }, o.spyCustom = function (e) {
            return s(e) ? i(e) : l(e);
        }, o.spyAll = function () {
            return o.spyJquery().spyModules().spySystem(), o;
        }, o.spyAll();
    }
}(window), function (e) {
    function n(e, n) {
        for (var t = 0; t < n.length; ++t)if (e.indexOf(n[t]) > -1)return !0;
        return !1;
    }

    if (/msie 6/i.test(navigator.userAgent))return void(window.location = "/cgi-bin/readtemplate?t=err/noie6_tmpl");
    window.console || (window.console = {
        log: function () {
        },
        error: function () {
        },
        info: function () {
        }
    }), e.wx = e.wx || {}, wx.T = function (e, n) {
        return template.compile(e)(n);
    }, wx.url = function (e) {
        if (e.startsWith("javasript:"))return e;
        var n = wx.data.param;
        return -1 != e.indexOf("?") ? e + n : e + "?1=1" + n;
    }, wx.getUrl = function (e) {
        var n = (window.location + "&").match(new RegExp("(?:\\?|\\&)" + e + "=(.*?)\\&"));
        return n && n[1] ? String(n[1]).html(!0) : void 0;
    }, $.fn.setClass = function (e) {
        this.attr("class", e);
    }, wx.jslog = function (e, n, t) {
        t = t || 3;
        var o = new Image, r = [];
        n && jQuery.each(["message", "stack", "lineNumber"], function (e, t) {
            r.push(t + ":" + (n[t] || ""));
        }), r.push("level:2"), o.src = "https://badjs.weixinbridge.com/badjs?id=5&key=" + t + "&uin=$user_info.fake_id.DATA$&msg=" + encodeURIComponent(r.join(";").replace(/\s/g, " ")) + "&from=" + encodeURIComponent(location.href) + "&_t=" + +new Date,
        console && console.error && n && console.error(n);
    }, setTimeout(function () {
        seajs.use("biz_web/lib/store.js", function (e) {
            var n = $("#logout");
            n.click(function () {
                function n() {
                    var n = e.get(o);
                    return new Date - n > 864e5;
                }

                e.remove("hasNotice"), e.remove("templateClassStatus"), e.remove("templateClassStatusTime");
                var t = "__draft__" + wx.data.uin, o = "__draft__time__" + wx.data.uin;
                n() && (e.remove(t), e.remove(o));
            });
        });
    }, 5e3), wx.resPath = "mp.weixin.qq.com" == location.hostname ? "https://res.wx.qq.com" : "",
        wx.injectXss = function (e, n, t) {
            function o(e) {
                for (var t = 0; t < n.length; t++)if (e == n[t])return !0;
                return !1;
            }

            if (null != e) {
                n || (n = []), t || (t = "'\"<script>console.log(%s);</script><!--# &");
                for (var r in e) {
                    var s = e[r];
                    "string" == typeof s ? o(r) || (e[r] = t.sprintf(r) + s) : "object" == typeof s && wx.injectXss(e[r]);
                }
            }
        }, jQuery(function () {
        var e = ['<div class="scale_tips" id="zoom_tips" style="display:none;">', '<div class="scale_tips_inner">', '<i class="icon_scale_tips"></i>', '<p class="scale_tips_content"><span id="zoom_msg"></span><a href="javascript:;" id="zoom_prompt">不再提示</a></p>', "</div>", "</div>"].join("\n");
        jQuery("body").append(e);
        var n = '<object type="application/x-shockwave-flash" data="{swfpath}" width="10" height="10" id="{id}">{param}</object>', t = {
            swfpath: wx.path.zoom,
            id: "ZoomFlash",
            param: ""
        }, o = {
            movie: t.swfpath,
            allowscriptaccess: "always",
            wmode: "transparent",
            scale: "noScale"
        };
        jQuery.each(o, function (e, n) {
            t.param += '<param name="' + e + '" value="' + n + '">';
        }), $('<div style="position: absolute; right: 0px; bottom: 0px; visibility: visible;"></div>').html(n.format(t)).appendTo("body"),
            seajs.use("biz_web/lib/store.js", function (e) {
                jQuery(window).on("load resize", function () {
                    if (!e.get("__zoom_tips__")) {
                        var n = document.getElementById("ZoomFlash").height, t = n, o = 1;
                        try {
                            t = document.getElementById("ZoomFlash").getFlashStageRect().height, o = ~window.navigator.userAgent.toLowerCase().indexOf("msie") && screen.deviceXDPI && screen.logicalXDPI ? screen.deviceXDPI / screen.logicalXDPI : t / n,
                                .9 > o ? (jQuery("#zoom_msg").text("您的浏览器目前处于缩小状态，会导致公众平台网页显示不正常，您可以键盘按“ctrl+数字0”组合键恢复初始状态。"),
                                    jQuery("#zoom_tips").show(), jQuery("body").addClass("scaled")) : o > 1.1 ? (jQuery("#zoom_msg").text("您的浏览器目前处于放大状态，会导致公众平台网页显示不正常，您可以键盘按“ctrl+数字0”组合键恢复初始状态。"),
                                    jQuery("#zoom_tips").show(), jQuery("body").addClass("scaled")) : (jQuery("#zoom_tips").hide(),
                                    jQuery("body").removeClass("scaled"));
                        } catch (r) {
                        }
                    }
                });
            }), jQuery(window).on("keyup", function (e) {
            e.ctrlKey && (96 == e.keyCode || 48 == e.keyCode) && (jQuery("#zoom_tips").hide(), jQuery("body").removeClass("scaled"));
        }), jQuery("#zoom_prompt").on("click", function () {
            seajs.use("biz_web/lib/store.js", function (e) {
                e.set("__zoom_tips__", !0);
            }), jQuery("#zoom_tips").hide(), jQuery("body").removeClass("scaled");
        }), "undefined" != typeof _new_comment_num && _new_comment_num > 0 && (_new_comment_num = _new_comment_num > 1e3 ? "999+" : _new_comment_num,
        _new_comment_num > 0 && !jQuery(".menu_item>a[data-id=10033]").parent().hasClass("selected") && jQuery(".menu_item>a[data-id=10033]").append('<span class="icon_dot_notices"><span class="icon_dot_notices_left"></span><span class="icon_dot_notices_right"></span>' + _new_comment_num + "</span>"));
    }), jQuery("#menuBar").find("dd>a").click(function () {
        $(this).find(".new").length > 0 && jQuery.ajax({
            url: "/misc/navoperation",
            data: {
                action: "click",
                id: $(this).data("id"),
                token: wx.data.t
            },
            type: "post"
        });
    }), function () {
        try {
            var e = jQuery(window).height();
            750 > e && jQuery(document.body).addClass("screen_small");
        } catch (n) {
        }
    }();
    var t = ["biz_common/utils/monitor.js", "biz_common/utils/huatuo.js"];
    seajs.on("request", function (e) {
        if (0 != location.host.indexOf("dev") && !/[a-f0-9]{6}\.(js|css)$/.test(e.requestUri) && !n(e.requestUri, t)) {
            var e = {
                res: e.requestUri,
                page: location.pathname + "?" + location.search
            }, o = encodeURIComponent("res[{res}]; page[{page}]".format(e));
            (new Image).src = wx.url("/misc/jslog?content=" + o + "&id=59&level=error");
        }
    });
}(window);
;$.fn.extend({
    center: function (i) {
        i ? (this.css("position", "fixed"), this.css("top", ($(window).height() - this.height()) / 2 + "px"),
            this.css("left", ($(window).width() - this.width()) / 2 + "px")) : (this.css("position", "absolute"),
            this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px"),
            this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px"));
    }
});
;$.fn.disable = function (t) {
    t = t || "btn_disabled";
    var s = this.hasClass("btn_input") ? this.find("button") : this;
    return s.attr("disabled", "disabled"), this.parent().hasClass("btn_input") ? this.parent().addClass(t) : this.addClass(t),
        this;
}, $.fn.enable = function (t) {
    t = t || "btn_disabled";
    var s = this.hasClass("btn_input") ? this.find("button") : this;
    return s.attr("disabled", !1), this.parent().hasClass("btn_input") ? this.parent().removeClass(t) : this.removeClass(t),
        this;
}, function () {
    var t = function (t, s) {
        if (t = t || "btn_loading", !s || $.support.leadingWhitespace) {
            var i = this.hasClass("btn_input") ? this.find("button") : this;
            i.prepend("<i></i>");
        }
        return this.disable(t), this;
    }, s = function (t, s) {
        if (t = t || "btn_loading", !s || $.support.leadingWhitespace) {
            var i = this.hasClass("btn_input") ? this.find("button") : this;
            i.find("i:first-child").remove();
        }
        return this.enable(t), this;
    };
    $.fn.btn = function (i, n, a) {
        return i ? s.call(this, n, a) : t.call(this, n, a);
    };
}();
;$.fn.scrollLoading = function (o) {
    function t(t) {
        return t.offset().top > $(window).scrollTop() && t.offset().top + t.height() < $(window).scrollTop() + $(window).height() + o.pre;
    }

    function c() {
        $.each(s, function (c, n) {
            var s = t($(n.obj));
            s && (n.src && "img" == n.tag.toLowerCase() && (n.obj.src = n.src, n.obj.data_src = n.src = ""),
                $.isFunction(o.callback) ? o.callback.apply(n.obj) : "");
        });
    }

    var n = {
        callback: $.noop,
        pre: 100,
        context: window
    };
    o = $.extend({}, n, o || {});
    var s = [];
    $(this).each(function () {
        var o = this.nodeName;
        o && s.push({
            obj: this,
            src: $(this).data("src"),
            tag: o.toLowerCase()
        });
    }), c(), o.context.unbind("scroll", c), o.context.bind("scroll", c);
}, $.fn.fixed = function () {
    var o = this, t = o.offset().top;
    $(document).on("scroll", function () {
        $(window).scrollTop() < t ? o.css("position", "static") : o.css("position", "fixed").css("top", 0);
    });
};
;!function (e) {
    var l = function () {
    };
    "placeholder" in document.createElement("input") || (l = function () {
        var l = e(this), a = l.attr("placeholder");
        a && (l.focus(function () {
            this.value === a && (this.value = ""), l.removeClass("placeholder");
        }).blur(function () {
            "" === this.value && (this.value = a, l.addClass("placeholder"));
        }), "" === l.val() && l.addClass("placeholder"), l.val() || l.val(a));
    }), e.fn.placeholder = l;
}(jQuery);
;$.extend({
    log: function (o) {
        console && console.log(o);
    }
});
;$.fn.extend({
    serializeObject: function () {
        var e = this.serializeArray(), i = {};
        return $(e).each(function (e, n) {
            i[n.name] = n.value;
        }), i;
    }
}), define("common/qq/jquery.plugin/serializeObject.js", [], function () {
    "use strict";
});
;!function () {
    function t(t, n) {
        for (var r in n)t[r] = n[r];
        return t;
    }

    function n(n, r) {
        if (r === !0) {
            var e;
            if (Object.isArray(n)) {
                e = [];
                for (var i in n)n.hasOwnProperty(i) && e.push(Object.isObject(n[i]) ? Object.clone(n[i], !0) : n[i]);
            } else {
                e = {};
                for (var i in n)n.hasOwnProperty(i) && (e[i] = Object.isObject(n[i]) ? Object.clone(n[i], !0) : n[i]);
            }
            return e;
        }
        return t({}, n);
    }

    function r(t) {
        return !(!this || 1 != t.nodeType);
    }

    function e(t) {
        return Object.prototype.toString.call(t) === m;
    }

    function i(t) {
        return Object.prototype.toString.call(t) === b;
    }

    function o(t) {
        return Object.prototype.toString.call(t) === h;
    }

    function c(t) {
        return Object.prototype.toString.call(t) === g;
    }

    function u(t) {
        return Object.prototype.toString.call(t) === l;
    }

    function a(t) {
        return Object.prototype.toString.call(t) === y;
    }

    function s(t) {
        return "undefined" == typeof t;
    }

    function p(t, n) {
        var r = [];
        for (var e in t)t.hasOwnProperty(e) && r.push(n === !0 ? [encodeURIComponent(e), "=", encodeURIComponent(t[e]), "&"].join("") : [e, "=", t[e], "&"].join(""));
        return r.join("").slice(0, -1);
    }

    function f(t, n) {
        if ("undefined" != typeof n)for (var r in t)if (t.hasOwnProperty(r) && n(t[r], r) === !1)break;
    }

    var h = "[object Function]", l = "[object Number]", g = "[object String]", b = "[object Array]", m = "[object Object]", y = "[object Date]";
    t(Object, {
        extend: t,
        clone: n,
        isObject: e,
        isElement: r,
        isArray: i,
        isFunction: o,
        isString: c,
        isNumber: u,
        isDate: a,
        isUndefined: s,
        param: p,
        each: f
    });
}(), Object.extend(String.prototype, function () {
    function t(t) {
        return this.replace(/\{(\w+)\}/g, function (n, r) {
            return void 0 !== t[r] ? t[r] : n;
        });
    }

    function n() {
        return this.replace(/[^\x00-\xff]/g, "**").length;
    }

    function r(t, n) {
        return t = t || 30, n = Object.isUndefined(n) ? "..." : n, this.length > t ? this.slice(0, t - n.length) + n : String(this);
    }

    function e(t) {
        return t === !0 ? this.replace(/^\s+/, "") : t === !1 ? this.replace(/\s+$/, "") : this.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    function i(t) {
        var n = ["&", "&amp;", "<", "&lt;", ">", "&gt;", " ", "&nbsp;", '"', "&quot;", "'", "&#39;"];
        t === !1 && n.reverse();
        for (var r = 0, e = this; r < n.length; r += 2)e = e.replace(new RegExp(n[r], "g"), n[1 + r]);
        return e;
    }

    function o(t) {
        return this.indexOf(t) > -1;
    }

    function c(t) {
        return 0 === this.lastIndexOf(t, 0);
    }

    function u(t) {
        var n = this.length - t.length;
        return n >= 0 && this.indexOf(t, n) === n;
    }

    function a() {
        return "" == this;
    }

    function s() {
        return this.replace(/<\/?[^>]*\/?>/g, "");
    }

    function p() {
        return /^\s*$/.test(this);
    }

    function f() {
        var t, n, r, e = this, i = arguments.length;
        if (1 > i)return s;
        for (t = 0; i > t;)e = e.replace(/%s/, "{#" + t++ + "#}");
        for (e.replace("%s", ""), t = 0; void 0 !== (n = arguments[t]);)r = new RegExp("{#" + t + "#}", "g"),
            e = e.replace(r, n), t++;
        return e;
    }

    function h() {
        for (var t, n = this, r = 0, e = 0; t = n.charAt(r++);)e += t.charCodeAt().toString(16).length / 2;
        return e;
    }

    function l(t, n) {
        if ("function" == typeof this.split) {
            var r = this.split(n || "&"), e = {};
            return r.each(function (n) {
                arr = n.split("="), 2 == arr.length && arr[0] && arr[1] && (t === !0 ? e[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]) : e[arr[0]] = arr[1]);
            }), e;
        }
    }

    document.createElement("div");
    return {
        format: t,
        sprintf: f,
        text: s,
        len: n,
        truncate: r,
        trim: String.prototype.trim || e,
        https2http: function () {
            return this.replace(/https:\/\/mmbiz\.qlogo\.cn\//g, "http://mmbiz.qpic.cn/");
        },
        http2https: function () {
            return this.replace(/http:\/\/mmbiz\.qpic\.cn\//g, "https://mmbiz.qlogo.cn/");
        },
        html: i,
        has: o,
        startsWith: c,
        endsWith: u,
        param: l,
        empty: a,
        blank: p,
        bytes: h
    };
}()), Object.extend(Function.prototype, function () {
    function t(t, n) {
        for (var r = t.length, e = n.length; e--;)t[r + e] = n[e];
        return t;
    }

    function n(n, r) {
        return n = a.call(n, 0), t(n, r);
    }

    function r(t) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0]))return this;
        var r = this, e = a.call(arguments, 1);
        return function () {
            var i = n(e, arguments);
            return r.apply(t, i);
        };
    }

    function e(t, n) {
        var r = this;
        return args = a.call(arguments, 2), t = 1e3 * t, window.setTimeout(function () {
            return r.apply(n || r, args);
        }, t);
    }

    function i() {
        var n = t([.01, null], arguments);
        return this.delay.apply(this, n);
    }

    function o(t) {
        var n = this;
        return function () {
            return t.apply(this, arguments) === !1 ? !1 : n.apply(this, arguments);
        };
    }

    function c(n) {
        var r = this;
        return function () {
            var e = r.apply(this, arguments), i = t([e], arguments);
            return n.apply(this, i), e;
        };
    }

    function u(n) {
        var r = this;
        return function () {
            var e = t([r.bind(this)], arguments);
            return n.apply(this, e);
        };
    }

    var a = Array.prototype.slice;
    return {
        bind: r,
        delay: e,
        defer: i,
        before: o,
        after: c,
        wrap: u
    };
}()), function () {
    function t(t, n) {
        for (var r = 0, e = this.length >>> 0; e > r; r++)r in this && t.call(n, this[r], r, this);
    }

    function n() {
        return this[this.length - 1];
    }

    function r(t) {
        return t === !0 ? Object.clone.apply(this, arguments) : c.call(this, 0);
    }

    function e(t) {
        var n = [];
        return this.each(function (r, e) {
            n.push(t(r, e));
        }), n;
    }

    function i(t) {
        var n = -1;
        return this.each(function (r, e) {
            return t == r ? (n = e, !1) : void 0;
        }), n;
    }

    var o = Array.prototype, c = o.slice;
    Object.extend(o, {
        each: Array.prototype.forEach || t,
        indexOf: Array.prototype.indexOf || i,
        last: n,
        clone: r,
        map: e
    });
}();
;!function (e) {
    function t(e) {
        return e >= 49 && 90 >= e;
    }

    function n(e) {
        return (e || "").toLowerCase().split("+").sort().join("").replace(/\s/gi, "");
    }

    function o(e) {
        var t = e.type;
        return "mousewheel" == t || "DOMMouseScroll" == t;
    }

    function r(e) {
        return e.wheelDelta > 0 || e.detail < 0 ? "mousewheelup" : "mousewheeldown";
    }

    function u(e) {
        var n = e.keyCode, u = f[n], s = !u && t(n) && String.fromCharCode(n).toLowerCase() || o(e) && r(e), a = e.ctrlKey, c = e.shiftKey, i = e.altKey, p = c && (l[s] || l[u]), h = [];
        return a || i || !p || (u = p, c = s = null), a && h.push("ctrl"), c && h.push("shift"), i && h.push("alt"),
        u && h.push(u), s && h.push(s), h.join("+");
    }

    function s(e, t) {
        return n(u(e)) == n(t);
    }

    var f = {
        27: "esc",
        9: "tab",
        32: "space",
        13: "enter",
        8: "backspace",
        145: "scroll",
        20: "capslock",
        144: "numlock",
        19: "pause",
        45: "insert",
        36: "home",
        46: "del",
        35: "end",
        33: "pageup",
        34: "pagedown",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        107: "=",
        109: "-",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        188: "<",
        190: ">",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    }, l = {
        "`": "~",
        1: "!",
        2: "@",
        3: "#",
        4: "$",
        5: "%",
        6: "^",
        7: "&",
        8: "*",
        9: "(",
        0: ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": '"',
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
    };
    e.wx = e.wx || {}, e.wx.hotkeyStr = u, e.wx.isHotkey = s;
}(window);