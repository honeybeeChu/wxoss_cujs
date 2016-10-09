define("common/wx/tooltip.js", ["tpl/tooltip.html.js", "widget/tooltip.css"], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict";
        var i = e("tpl/tooltip.html.js");
        e("widget/tooltip.css");
        var s = {
            dom: "",
            content: "",
            position: {
                x: 0,
                y: 0
            }
        }, o = function (e) {
            this.options = e = $.extend(!0, {}, s, e), this.$dom = $(this.options.dom), this.init();
        };
        o.prototype = {
            constructor: o,
            init: function () {
                var e = this;
                e.pops = [], e.$dom.each(function () {
                    var t = $(this), n = t.data("tooltip"), r = $(template.compile(i)(n ? $.extend(!0, {}, e.options, {
                        content: n
                    }) : e.options));
                    e.pops.push(r), $("body").append(r), r.css("display", "none"), t.on("mouseenter", function () {
                        var n = t.offset();
                        r.css({
                            top: n.top - (e.options.position.y || 0) - r.height(),
                            left: n.left + t.width() / 2 - r.width() / 2 + (e.options.position.x || 0)
                        }), r.show();
                    }).on("mouseleave", function () {
                        r.hide();
                    }), t.data("tooltip_pop", r);
                });
            },
            show: function () {
                var e = this, t = 0, n = e.pops.length;
                for (var t = 0; t < n; t++) e.pops[t].show();
            },
            hide: function () {
                var e = this, t = 0, n = e.pops.length;
                for (var t = 0; t < n; t++) e.pops[t].hide();
            }
        }, n.exports = o;
    } catch (u) {
        wx.jslog({
            src: "common/wx/tooltip.js"
        }, u);
    }
});