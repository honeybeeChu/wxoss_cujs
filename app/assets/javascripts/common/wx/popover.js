define("common/wx/popover.js", ["tpl/popover.html.js"], function (o, t, e) {
    "use strict";
    function i(o) {
        if (o = $.extend(!0, {}, h, o), this.opt = o, this.$dom = $(o.dom), this.$dom.data("popover")) {
            var t = this.$dom.data("popover");
            return s(o, t), t.$pop.show(), t;
        }
        return o.buttons && o.buttons && o.buttons.each(function (o) {
            o.type = o.type || "default";
        }), this.$pop = $(template.compile(p)(o)), o.addCls && this.$pop.addClass(o.addCls), $("body").append(this.$pop),
            n(this, o), s(o, this), this.$pop.show(), this.$dom.data("popover", this), this.clickIn = !0,
            this;
    }

    function n(o, t) {
        function e() {
            clearTimeout(n), o.show();
        }

        function i() {
            n = setTimeout(function () {
                o.hide();
            }, s);
        }

        if (t.buttons && t.buttons.length > 0 && o.$pop.find(".jsPopoverBt").each(function (e, i) {
                t.buttons[e] && "function" == typeof t.buttons[e].click && $(i).click(function (i) {
                    t.buttons[e].click.call(o, i);
                });
            }), o.$pop.find(".jsPopoverClose").click(function () {
                t.close === !0 ? o.hide() : "function" == typeof t.close && t.close.call(o);
            }), t.hover && (o.$dom.hover(function () {
                o.hoverTime && clearTimeout(o.hoverTime);
            }, function () {
                o.hoverTime = o.hide.delay(1, o);
            }), o.$pop.hover(function () {
                o.hoverTime && clearTimeout(o.hoverTime);
            }, function () {
                o.hoverTime && clearTimeout(o.hoverTime), o.hoverTime = o.hide.delay(1, o);
            })), t.isToggle) {
            var n = null, s = 300;
            o.$dom.hover(e, i), o.$pop.hover(e, i);
        }
        t.hideIfBlur && (o._onBlur = function (o) {
            var t = o.data.context, e = o.target, i = t.$dom.get(0), n = t.$pop.get(0);
            t.clickIn ? t.clickIn = !1 : $.contains(i, e) || i === e || $.contains(n, e) || n === e || o.data.context.hide();
        }, $(document).on("click", {
            context: o
        }, o._onBlur)), o._onResize = function (o) {
            o.data.context.resetPosition();
        }, $(window).on("resize", {
            context: o
        }, o._onResize);
    }

    function s(o, t) {
        var e = t.$dom.offset();
        "left" == o.margin ? (console.log(e.top), console.log(t.$dom.height()), t.$pop.css({
            top: e.top + t.$dom.height(),
            left: e.left
        }).addClass("pos_left")) : "right" == o.margin ? t.$pop.css({
            top: e.top + t.$dom.height(),
            left: e.left + t.$dom.width() - t.$pop.width()
        }).addClass("pos_right") : t.$pop.css({
            top: e.top + t.$dom.height(),
            left: e.left + t.$dom.outerWidth() / 2 - t.$pop.width() / 2
        }).addClass("pos_center");
    }

    var p = o("tpl/popover.html.js"), h = {
        dom: "",
        content: "",
        place: "bottom",
        margin: "center",
        hideIfBlur: !1,
        hover: !1,
        addCls: "",
        isToggle: !1,
        onHide: !1,
        onShow: !1,
        onRemove: !1
    };
    i.prototype = {
        remove: function () {
            this.$pop.remove(), this.$dom.removeData("popover"), this._onBlur && $(document).off("click", this._onBlur),
                $(window).off("resize", this._onResize), "function" == typeof this.opt.onRemove && this.opt.onRemove.call(this);
        },
        hide: function () {
            this.$pop.hide(), "function" == typeof this.opt.onHide && this.opt.onHide.call(this);
        },
        show: function () {
            this.$pop.show(), "function" == typeof this.opt.onShow && this.opt.onShow.call(this);
        },
        resetPosition: function () {
            return s(this.opt, this);
        }
    }, e.exports = i;
});