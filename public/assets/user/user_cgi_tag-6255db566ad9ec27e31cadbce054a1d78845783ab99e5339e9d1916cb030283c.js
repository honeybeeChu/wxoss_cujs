define("user/user_cgi_tag.js", ["common/wx/Tips.js", "common/wx/Cgi.js"], function (e, r, t) {
    "use strict";
    var n = {
        add: "/wxoss/wx_users/batch_set_tag?action=batch_set_tag",
        del: "/wxoss/wx_users/del_tag?action=del_tag",
        remark: "/wxoss/wx_users/add_mark?action=add_mark",
        getBuddy: "/wxoss/wx_users/get_fans_info?action=get_fans_info",
        add_black: "/wxoss/wx_users/set_black?action=set_black",
        del_black: "/wxoss/wx_users/cancle_black?action=cancle_black"
    }, a = e("common/wx/Tips.js"), i = e("common/wx/Cgi.js");
    t.exports = {
        del_tag: function (e, r, t, o) {
            i.post({
                mask: !1,
                url: n.del,
                data: {
                    user_openid: e,
                    groupid_list: r
                }
            }, function (e) {
                if (!e || !e.base_resp)return void a.err("修改失败");
                var r = 1 * e.base_resp.ret;
                return 0 !== r ? void a.err("修改失败") : (a.suc("修改成功"), "function" == typeof t && t(e), void(o && o.remove()));
            });
        },
        add_tag: function (e, r, t, o, s) {
            i.post({
                mask: !1,
                url: n.add,
                data: {
                    user_openid_list: e,
                    groupid_list: r,
                    cexpandcol: t
                }
            }, function (e) {
                if (!e || !e.base_resp)return void a.err("修改失败");
                var r = 1 * e.base_resp.ret;
                return 0 !== r ? void a.err("修改失败") : (a.suc("修改成功"), "function" == typeof o && o(e), void(s && s.remove()));
            });
        },
        change_remark: function (e, r, t, o) {
            i.post({
                mask: !1,
                url: n.remark,
                data: {
                    user_openid: e,
                    mark_name: r
                }
            }, function (e) {
                if (!e || !e.base_resp)return void a.err("修改失败");
                var r = 1 * e.base_resp.ret;
                return 0 !== r ? void a.err("修改失败") : (a.suc("修改成功"), "function" == typeof t && t(e), void(o && o.remove()));
            });
        },
        getBuddyInfo: function (e, r) {
            i.post({
                mask: !1,
                url: n.getBuddy,
                data: {
                    lang: "zh_CN",
                    user_openid: e
                }
            }, function (e) {
                "function" == typeof r && r(e);
            });
        },
        add_black: function (e, r, t) {
            i.post({
                mask: !1,
                url: n.add_black,
                data: {
                    user_openid_list: e
                }
            }, function (e) {
                if (!e || !e.base_resp)return void a.err("加入黑名单失败");
                var n = 1 * e.base_resp.ret;
                return 0 !== n ? void a.err("加入黑名单失败") : (a.suc("加入黑名单成功"), "function" == typeof r && r(e),
                    void(t && t.remove()));
            });
        },
        del_black: function (e, r, t) {
            i.post({
                mask: !1,
                url: n.del_black,
                data: {
                    user_openid_list: e
                }
            }, function (e) {
                if (!e || !e.base_resp)return void a.err("移除黑名单失败");
                var n = 1 * e.base_resp.ret;
                return 0 !== n ? void a.err("移除黑名单失败") : (a.suc("移除黑名单成功"), "function" == typeof r && r(e),
                    void(t && t.remove()));
            });
        }
    };
});
