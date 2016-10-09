define("common/wx/Cgi.js", ["common/qq/mask.js", "common/wx/dialog.js", "common/wx/Tips.js",
        "common/wx/cgiReport.js", "common/lib/MockJax.js", "common/qq/events.js"],
    function (o, n) {
        "use strict";
        function e(o, n, e) {
            var a, t;
            e && "object" == typeof e ? (a = e.done, t = e.fail) : a = e, "string" == typeof n && n.length > 0 && (n = {
                url: n
            }), n = $.extend(!0, {}, c, {
                type: o,
                data: {
                    random: Math.random().toString()
                }
            }, n), n.mock && (n.mock === !0 ? n.mock = {
                responseText: {
                    ret: 0,
                    data: {},
                    url: n.url,
                    param: n.data
                }
            } : !n.mock || n.mock.responseText || n.mock.response || (n.mock = {
                responseText: n.mock
            }), n.mock.url = n.mock.url || n.url, $.mockjax(n.mock)), n.mask && ($.isPlainObject(n.mask) ? s.show(n.mask) : s.show());
            var i = $.ajax(n);
            return i.callback = i.done, i.done(function (o) {
                a && a(o);
            }).fail(function (o, e, s) {
                t && t(e), m.error(e, n), r.trigger("xhrError", o, e, s, n);
            }).always(function () {
                n.mask && s.hide();
            }), i;
        }

        var s = o("common/qq/mask.js"), a = o("common/wx/dialog.js"), t = o("common/wx/Tips.js"), m = o("common/wx/cgiReport.js");
        o("common/lib/MockJax.js");
        var r = o("common/qq/events.js")(!0), c = {
            dataType: "json",
            mask: !1,
            timeout: 45e3,
            error: $.noop,
            mock: !1,
            data: {
                token: wx.data.t,
                lang: wx.data.lang,
                f: "json",
                ajax: "1"
            }
        };
        n.get = function (o, n) {
            return e("get", o, n);
        }, n.post = function (o, n) {
            return e("post", o, n);
        };
        var i = {
            0: "恭喜你，操作成功！",
            "-1": "系统错误，请稍后尝试。",
            200002: "参数错误，请核对参数后重试。",
            200003: "登录态超时，请重新登录。",
            200004: "请求页面的域名没有授权。",
            200005: "请求方式错误，请确认请求方式后重试。",
            200006: "表单名称验证出错，请核对表单名称后重试。",
            200007: "对不起，你没有权限访问目标请求。"
        };
        n.show = function (o, n) {
            var e = i[o.base_resp.ret] || "系统繁忙，请稍后尝试！";
            return 0 == o.base_resp.ret ? void(n ? a.show({
                type: "succ",
                msg: "系统提示|" + e
            }) : t.suc(e)) : void(n ? a.show("系统错误|" + e) : t.err(e));
        };
    });