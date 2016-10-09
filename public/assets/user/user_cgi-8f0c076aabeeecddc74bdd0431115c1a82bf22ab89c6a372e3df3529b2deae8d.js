define("user/user_cgi.js", ["common/wx/Tips.js", "common/wx/Cgi.js"], function (e, o, n) {
    "use strict";
    var t = {
        changeRemark: "/cgi-bin/modifycontacts?t=ajax-response&action=setremark",
        changeGroup: "/cgi-bin/modifycontacts?action=modifycontacts&t=ajax-putinto-group",
        getBuddy: "/cgi-bin/getcontactinfo?t=ajax-getcontactinfo&lang=zh_CN&fakeid="
    }, r = e("common/wx/Tips.js"), a = "", s = e("common/wx/Cgi.js");
    n.exports = {
        changeRemark: function (e, o, n) {
            s.post({
                mask: !1,
                url: t.changeRemark,
                data: {
                    remark: o,
                    tofakeuin: e
                }
            }, function (e) {
                if (!e || !e.base_resp)return void r.err("修改失败");
                var o = e.base_resp.ret + "";
                if ("0" == o)r.suc("修改成功"), "function" == typeof n && n(e); else switch (o) {
                    case"61900":
                        r.err("修改失败");
                        break;

                    case"61901":
                        r.err("系统繁忙");
                        break;

                    case"61910":
                        r.err("修改失败");
                        break;

                    case"61911":
                        r.err("修改失败，对方不是你的粉丝");
                        break;

                    case"61912":
                        r.err("修改失败，备注不能超过30个字");
                        break;

                    default:
                        r.err("修改失败");
                }
            });
        },
        changeGroup: function (e, o, n, a, c) {
            var i = $.isArray(e) ? e.join("|") : e;
            s.post({
                url: t.changeGroup,
                data: {
                    scene: a || "",
                    contacttype: o,
                    tofakeidlist: i
                },
                mask: !1
            }, function (e) {
                if (!e || !e.base_resp)return void r.err("添加失败");
                var t = e.base_resp.ret;
                "0" == t ? ("function" == typeof n && n(e), r.suc(1 === c && 0 === o ? "已从黑名单移入默认组" : 1 !== c && 1 === o ? "已加入黑名单" : "添加成功")) : r.err("添加失败");
            });
        },
        setTempMsgid: function (e) {
            e && "" == a && (a = e), console.log("setTempMsgid"), console.log("_sTempMsgId=" + a);
        },
        getBuddyInfo: function (e, o) {
            var n = "";
            a && (n = "&msgid=" + a), console.log("getBuddyInfo"), console.log(n), s.post({
                mask: !1,
                url: t.getBuddy + e + n
            }, function (e) {
                "function" == typeof o && o(e);
            });
        }
    };
});
