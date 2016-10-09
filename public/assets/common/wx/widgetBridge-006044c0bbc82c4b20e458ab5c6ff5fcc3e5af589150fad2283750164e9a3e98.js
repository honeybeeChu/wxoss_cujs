define("common/wx/widgetBridge.js", [], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict", $.widgetBridge || ($.widgetBridge = function (e, t) {
            var n = e, r = n.split("."), e = r.length > 1 ? r[1] : r[0];
            $.fn[e] = function (r) {
                var i = typeof r == "string", s = [].slice.call(arguments, 1), o = this;
                r = r || {};
                if (i) {
                    var u;
                    return r.indexOf("_") !== 0 && this.each(function () {
                        var t = $.data(this, n);
                        if (!t) return $.error("cannot call methods on " + e + " prior to initialization; " + "attempted to call method '" + r + "'");
                        if (r === "instance") return u = t, !1;
                        if (r === "option") return u = t.options, !1;
                        u || (u = (t[r] || jQuery.noop).apply(t, s)), r === "destroy" && (t.elements = null);
                    }), u;
                }
                var a = this;
                return this.each(function () {
                    var e = this, i = $.data(this, n);
                    if (!i) {
                        i = $.extend(!0, {}, t), i.destroy || (i.destroy = function () {
                            $.removeData(e, n);
                        }), i.options = $.extend(!0, i.options || {}, r), i.element = $(this), i.elements = a, i._create && (o = i._create.call(i, r));
                        var s = o && o.length && o.get(0) || this;
                        $.data(s, n, i);
                    }
                }), o;
            };
        });
    } catch (i) {
        wx.jslog({
            src: "common/wx/widgetBridge.js"
        }, i);
    }
});
