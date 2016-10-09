define("common/wx/tooltips.js", ["tpl/tooltips.html.js"], function (o, t, n) {
    "use strict";
    var i = {
        position: {},
        container: "",
        type: "hover",
        buttons: [],
        delay: 300,
        disabled: !1,
        reposition: !1,
        container_close: !1,
        parentClass: "",
        container_mode: "absolute"
    }, s = wx.T, e = o("tpl/tooltips.html.js"), p = "btn_disabled", c = "hover", h = "show", a = function (o) {
        if (this.options = o = $.extend(!0, {}, i, o), this.$container = $(this.options.container),
            this.$container && 0 != this.$container.length) {
            var t = this.$container.offset(), n = this.$container.height(), a = this.options.position.left || this.$container.data("x") || 0, l = n + (this.options.position.top || this.$container.data("y") || 0);
            this.options.offset = {
                left: t.left + a,
                top: t.top + l,
                left_x: a,
                top_y: l
            }, !o.content && (o.content = this.$container.data("tips") || ""), this.$dom = $(s(e, o)).appendTo("body"),
            this.options.disabled && this.$container.addClass(p);
            var d = this, f = this.options.type === c || "click" === this.options.type ? this.options.type : c;
            if (f == c) {
                var r = null;
                this.$container.hover(function () {
                    d.options.onshow && "function" == typeof d.options.onshow ? d.options.onshow.apply(d) : !d.options.disabled && d.show();
                }, function () {
                    r = window.setTimeout(function () {
                        d.hide();
                    }, d.options.delay);
                }), this.$dom.hover(function () {
                    r && window.clearTimeout(r);
                }, function () {
                    d.hide();
                });
            } else this.$container.click(function () {
                return d.options.disabled || d.options.onbeforeclick && "function" == typeof d.options.onbeforeclick && d.options.onbeforeclick.apply(d) === !1 ? void 0 : (d.$dom.data(h) ? d.options.onclose && "function" == typeof d.options.onclose ? d.options.onclose.apply(d) : d.hide() : d.options.onshow && "function" == typeof d.options.onshow ? d.options.onshow.apply(d) : d.show(),
                    !1);
            });
            $(document).on("click", function (o) {
                d.$dom.find(o.target).length || (d.options.onclose && "function" == typeof d.options.onclose ? d.options.onclose.apply(d, [o]) : d.hide());
            }), d.$dom.find(".js_popover_close").on("click", function (o) {
                return d.options.onclose && "function" == typeof d.options.onclose ? d.options.onclose.apply(d, [o]) : d.hide(),
                    !1;
            }), this.$dom.hide(), function () {
                $.each(d.$dom.find(".js_btn"), function (o, t) {
                    d.options.buttons[o].click && $(t).on("click", function () {
                        d.options.buttons[o].click.apply(d);
                    });
                });
            }();
        }
    };
    a.prototype = {
        constructor: a,
        show: function () {
            if (this.options.reposition) {
                var o = this.$container.offset(), t = o.left + this.options.offset.left_x, n = o.top + this.options.offset.top_y;
                this.$dom.css({
                    left: t,
                    top: n
                }).show();
            } else this.$dom.show();
            this.$dom.data(h, !0);
        },
        hide: function () {
            this.$dom.hide(), this.$dom.data(h, !1);
        },
        enable: function () {
            return this.options.disabled = !1, this.$container.removeClass(p), this;
        },
        disable: function () {
            return this.options.disabled = !0, this.$container.addClass(p), this;
        }
    }, n.exports = a;
});