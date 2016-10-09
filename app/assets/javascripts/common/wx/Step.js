define("common/wx/Step.js", ["widget/processor_bar.css", "tpl/step.html.js"], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict";
        var i = wx.T, s = e("widget/processor_bar.css"), o = e("tpl/step.html.js"), u = {
            selected: 1
        }, a = function () {
            var e = navigator.userAgent.toLowerCase(), t = /(msie) ([\w.]+)/.exec(e) || [], n = t[1] || "";
            return n == "msie";
        };

        function f(e) {
            this.opts = $.extend(!0, {}, u, e), this.init();
        }

        f.prototype.init = function () {
            var e = this.opts, t = e.names.length, n = parseInt(e.selected, 10), r = [], s, u;
            n = n < 0 ? 0 : n > t ? t : n;
            for (s = 0; s < t; s++) u = f.getClass(s + 1, n), r.push({
                name: e.names[s],
                cls: u
            });
            this.$dom = $(i(o, {
                stepArr: r,
                length: t
            })).appendTo(e.container), a() && this.$dom.addClass("ie");
        }, f.prototype.setStep = f.prototype.go = function (e) {
            var t = this.$dom.find("li.step"), n = t.length;
            return e = e < 0 ? 0 : e > n ? n : e, t.each(function (t, r) {
                var i = f.getClass(t + 1, e);
                t + 1 == n ? r.className = "no_extra " + "step grid_item size1of%s %s".sprintf(n, i) : r.className = "step grid_item size1of%s %s".sprintf(n, i);
            }), this;
        }, f.getClass = function (e, t) {
            var n;
            return e < t - 1 ? n = "pprev" : e === t - 1 ? n = "prev" : e === t ? n = "current" : e === t + 1 ? n = "next" : e > t + 1 && (n = "nnext"), n;
        }, n.exports = f;
    } catch (l) {
        wx.jslog({
            src: "common/wx/Step.js"
        }, l);
    }
});