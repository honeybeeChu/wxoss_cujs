define("common/wx/dialog.js", ["biz_common/jquery.ui/jquery.ui.draggable.js", "tpl/dialog.html.js"], function (t, e) {
    "use strict";
    function i(t) {
        var e = this;
        "string" == typeof t && (t = {
            msg: t
        }), t = $.extend(!0, {}, o, t), e.id = t.id = [s.uiName, "_", ++s.uid].join(""), t.icon = s.iconClass[t.type || "warn"];
        var i = [];
        i = t.msg.split("|"), t.msg = i[0] ? i[1] ? {
            title: i[0],
            text: i[1],
            msgClass: ""
        } : {
            title: t.msg,
            msgClass: "single_line"
        } : {
            text: i[1],
            msgClass: "single_line"
        }, $.each(t.buttons, function (t, e) {
            e.type = s.btTypes[e.type || "primary"];
        }), e.opt = t, $(template.compile(s.html)(t)).appendTo("body"), e.dom = $("#" + this.id).parent(),
            e.dom.css("margin-left", -1 * e.dom.outerWidth() / 2).css("margin-top", -1 * e.dom.outerHeight() / 2),
            e.dom.fadeIn(), t.draggable && e.dom.draggable({
            handle: ".dialog_hd"
        }), function () {
            $.each($("#" + e.id + " .js_btn"), function (i, o) {
                t.buttons[i].click && $(o).click(function () {
                    return t.buttons[i].click.apply(e), !1;
                });
            }), $("#" + e.id + " .pop_closed").click(function () {
                return t.close && "function" == typeof t.close ? void(t.close() && e.remove()) : void e.remove();
            });
        }();
    }

    t("biz_common/jquery.ui/jquery.ui.draggable.js");
    var o = {
        title: "温馨提示",
        type: "warn",
        msg: "错误信息|对不起，系统繁忙请稍后尝试。",
        buttons: [{
            text: "确定",
            click: function (t) {
                this.remove(t);
            }
        }],
        width: 720,
        height: 0,
        draggable: !0,
        mask: !0,
        className: ""
    }, s = {
        uid: 0,
        uiName: "wxDialog",
        iconClass: {
            succ: "success",
            err: "error",
            warn: "warn",
            info: "info"
        },
        btTypes: {
            primary: "btn_primary",
            normal: "btn_default",
            disabled: "btn_disabled"
        }
    };
    s.html = t("tpl/dialog.html.js"), i.prototype = {
        hide: function () {
            this.opt.mask && this.dom.next().remove(), this.dom.fadeOut();
        },
        remove: function () {
            this.opt.mask && this.dom.next().remove(), this.dom.remove();
        },
        resetPos: function () {
            var t = this;
            t.dom.css("margin-left", -1 * t.dom.outerWidth() / 2).css("margin-top", -1 * t.dom.outerHeight() / 2);
        }
    }, e.show = function (t) {
        return new i(t);
    };
});
