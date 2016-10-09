define("common/wx/simplePopup.js", ["tpl/simplePopup.html.js", "common/wx/popup.js", "biz_common/jquery.validate.js"], function (e, t, o) {
    "use strict";
    function i(e) {
        var t = $.Deferred(), o = this;
        o.$dom = $(template.compile(p)(e)).popup({
            title: e.title || "输入提示框",
            buttons: [{
                text: "确认",
                click: function () {
                    var i = this;
                    if (l.form()) {
                        var p = o.$dom.find("input").val().trim();
                        if (e.callback) {
                            var r = e.callback.call(i, p);
                            r !== !1 && this.remove();
                        } else this.remove();
                        t.resolve(p);
                    }
                },
                type: "primary"
            }, {
                text: "取消",
                click: function () {
                    this.remove();
                },
                type: "default"
            }],
            className: "simple label_block"
        }), o.$dom.find("input").val(e.value).focus(), $.validator.addMethod("_popupMethod", function (t, o, i) {
            return e && e.rule && e.rule(t.trim(), o, i);
        }, e.msg);
        var i = e && "undefined" != typeof e.inputrequire && e.inputrequire === !1 ? !1 : !0, l = o.$dom.find("form").validate({
            rules: {
                popInput: {
                    required: i,
                    _popupMethod: !0
                }
            },
            messages: {
                popInput: {
                    required: "输入框内容不能为空"
                }
            },
            onfocusout: !1
        });
        return t.callback = t.done, t;
    }

    var p = e("tpl/simplePopup.html.js");
    e("common/wx/popup.js"), e("biz_common/jquery.validate.js"), o.exports = i;
});