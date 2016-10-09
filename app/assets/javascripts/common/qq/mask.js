define("common/qq/mask.js", ["biz_web/lib/spin.js"], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict", e("biz_web/lib/spin.js");
        var i = 0, s = '<div class="mask"></div>';

        function o(e) {
            if (this.mask) this.mask.show(); else {
                var t = "body";
                e && !!e.parent && (t = $(e.parent)), this.mask = $(s).appendTo(t), this.mask.id = "wxMask_" + ++i, this.mask.spin("flower");
            }
            if (e) {
                if (e.spin === !1) return this;
                this.mask.spin(e.spin || "flower");
            }
            return this;
        }

        o.prototype = {
            show: function () {
                this.mask.show();
            },
            hide: function () {
                this.mask.hide();
            },
            remove: function () {
                this.mask.remove();
            }
        }, t.show = function (e) {
            return new o(e);
        }, t.hide = function () {
            $(".mask").hide();
        }, t.remove = function () {
            $(".mask").remove();
        };
    } catch (u) {
        wx.jslog({
            src: "common/qq/mask.js"
        }, u);
    }
});