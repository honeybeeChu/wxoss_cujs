define("common/wx/popup.js", ["common/wx/widgetBridge.js", "biz_common/jquery.ui/jquery.ui.draggable.js", "tpl/popup.html.js"], function (t) {
    "use strict";
    t("common/wx/widgetBridge.js"), t("biz_common/jquery.ui/jquery.ui.draggable.js");
    var i = t("tpl/popup.html.js"), o = template.compile(i), n = {
        disabled: "btn_disabled",
        primary: "btn_primary",
        "default": "btn_default"
    };
    $.widgetBridge("popup", {
        $dialogWrp: null,
        options: {
            title: "温馨提示",
            width: 726,
            height: null,
            template: template.compile,
            data: {},
            buttons: [],
            onHide: null,
            onShow: null,
            onOK: null,
            onCancel: null,
            mask: !0,
            autoShow: !0
        },
        _create: function () {
            var t = this, i = $.extend(!0, {}, this.options), e = function () {
                t.hide();
            };
            i.buttons && !$.isArray(i.buttons) && (i.buttons = [i.buttons]), !i.buttons.length && i.onOK && (i.buttons = [{
                text: "确定",
                type: "primary",
                click: function () {
                    var t = i.onOK && i.onOK.call(this);
                    !t && e();
                }
            }, {
                text: "取消",
                click: function () {
                    var t = i.onCancel && i.onCancel.call(this);
                    !t && e();
                }
            }]), $.each(i.buttons, function (t, i) {
                i.type = n[i.type || "default"];
            });
            var l;
            if (this.element.is("script[type=text/html]"))l = this.element.html(), this.options.data && this.options.template && (l = this.options.template(l)(this.options.data)); else {
                var s = $("<div></div>").append(this.element.clone()), l = s.html();
                this.options.data && this.options.template && (l = this.options.template(l)(this.options.data));
            }
            if (i.content = l, this.$dialogWrp = $(o(i)).appendTo("body"), this.$dialogWrp.find(".dialog_bd").children(":first").show(),
                i.autoShow || this.$dialogWrp.hide(), this.$dialogWrp.find(".pop_closed").click(i.onClose || e),
                    this.$dialogWrp.find(".js_btn").each(function (o) {
                        var n = i.buttons[o].click, e = n ? function (i) {
                            n.call(t, i);
                        } : function () {
                        };
                        $(this).click(e);
                    }), this.resetPosition(), i.autoShow) {
                var a = t.options.onShow;
                "function" == typeof a && a.call(t);
            }
            return this.$dialogWrp.draggable({
                handle: ".dialog_hd"
            }), this.get();
        },
        show: function () {
            var t = this, i = t.options.onShow, o = !0;
            this.$dialogWrp.fadeIn(function () {
                o && ("function" == typeof i && i.call(t), o = !1);
            });
        },
        resetPosition: function () {
            $(this.$dialogWrp.get(0)).css({
                "margin-left": -1 * this.$dialogWrp.outerWidth() / 2,
                "margin-top": -1 * this.$dialogWrp.outerHeight() / 2
            });
        },
        get: function () {
            return this.$dialogWrp.filter(".dialog_wrp");
        },
        hide: function () {
            var t = this, i = t.options.onHide || t.options.close, o = !0;
            this.$dialogWrp.fadeOut(function () {
                o && ("function" == typeof i && i.call(t), o = !1);
            });
        },
        remove: function () {
            this.destroy(), this.$dialogWrp.remove();
        }
    });
});
