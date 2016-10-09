define("media/appmsg_list_v2.js", ["common/wx/media/appmsg.js", "common/wx/pagebar.js", "common/wx/top.js", "common/wx/tooltip.js", "common/wx/popover.js", "common/wx/time.js", "common/wx/Tips.js", "media/media_cgi.js", "biz_web/ui/checkbox.js", "biz_web/ui/dropdown.js", "common/wx/dialog.js", "common/wx/Cgi.js", "common/wx/progress.js", "common/qq/jquery.plugin/btn.js", "common/wx/popup.js", "biz_common/moment.js", "common/wx/searchInput.js"], function (i) {
    "use strict";
    function t(t) {
        for (var e = [], n = {
            2: "原创功能",
            3: "赞赏功能"
        }, a = 0, c = t.length; c > a; a++) {
            var o = t[a].func_id;
            if (n[o]) {
                var s = t[a].unlock_time, p = t[a].ban_time, r = i("biz_common/moment.js"), m = s ? s == p ? "永久屏蔽" + n[o] : "屏蔽" + n[o] + "至" + r.unix(s).format("YYYY年MM月DD日 HH:mm") : "";
                m && e.push({
                    info: m
                });
            }
        }
        e.length > 0 && $("#js_forbit_warn").html(template.render("tpl_forbit", {
            list: e
        }));
    }

    function e(i) {
        if (y.length <= 0)return void $("#js_empty").show();
        switch (i) {
            case"card":
                a();
                break;

            case"list":
                n();
                break;

            default:
                a();
        }
        c(), o();
    }

    function n() {
        D = $("#js_list");
        var i = "";
        template.helper("timeFormat", function (i) {
            return d.timeFormat(i);
        }), i = template.render("tpl_list", {
            list: y
        }), D.html(i).show();
    }

    function a() {
        D = $("#js_card");
        var i = [$("#js_col1"), $("#js_col2"), $("#js_col3")];
        $.each(y, function (t, e) {
            var e = y[t], n = e.app_id || "";
            i[t % 3].append('<div id="appmsg%s" class="js_appmsgitem"></div>'.sprintf(n)), new p({
                container: "#appmsg" + n,
                data: e,
                showEdit: !0,
                type: j
            });
        }), D.show();
    }

    function c() {
        new l({
            dom: D.find(".js_tooltip"),
            position: {
                x: 0,
                y: -4
            }
        });
    }

    function o() {
        D.on("click", ".js_del", function () {
            var i = $(this), t = i.data("id");
            $(".popover").hide(), new u({
                dom: this,
                content: "确定删除此素材？",
                place: "bottom",
                margin: "center",
                buttons: [{
                    text: "确定",
                    click: function () {
                        {
                            var e = this;
                            e.$pop.find(".jsPopoverBt").eq(0).btn(!1);
                        }
                        _.appmsg.del(t, function () {
                            i.closest(".js_appmsgitem").slideUp(function () {
                                $(this).remove(), e.remove();
                            });
                        },e);
                    },
                    type: "primary"
                }, {
                    text: "取消",
                    click: function () {
                        this.hide();
                    }
                }]
            });
        });
    }

    function s() {
        if (10 == wx.cgiData.type) {
            $("#searchDiv").show();
            var t = i("common/wx/searchInput.js");
            new t({
                id: "#searchDiv",
                value: wx.cgiData.key,
                placeholder: "标题/作者/摘要",
                click: function (i) {
                    i.length > 0 ? window.location = wx.url("/wxoss/wx_articles?begin=0&count=10&&view_action=list_%s&type=10&query=%s".sprintf(wx.cgiData.view, encodeURIComponent(i))) : g.err("请输入搜索关键词");
                }
            }), wx.cgiData.key && ($(".js_title>a").each(function (i, t) {
                $(t).text().match(/<script>/g) || $(t).html($(t).html().replace(new RegExp(wx.cgiData.key, "g"), '<span class="highlight">' + wx.cgiData.key + "</span>"));
            }), $(".jsCreate").hide()), $("#reload").click(function () {
                window.location = wx.url("/wxoss/wx_articles?begin=0&count=10&view_action=list_%s&type=10".sprintf(wx.cgiData.view));
            });
        }
    }

    {
        var p = i("common/wx/media/appmsg.js"), r = i("common/wx/pagebar.js"), m = i("common/wx/top.js"), l = i("common/wx/tooltip.js"), u = i("common/wx/popover.js"), d = i("common/wx/time.js"), g = i("common/wx/Tips.js"), _ = i("media/media_cgi.js"), w = (i("biz_web/ui/checkbox.js"),
            i("biz_web/ui/dropdown.js")), f = i("common/wx/dialog.js"), h = i("common/wx/Cgi.js");
        i("common/wx/progress.js");
    }
    i("common/qq/jquery.plugin/btn.js"), i("common/wx/popup.js");
    var x = wx.cgiData, j = x.type, b = wx.cgiData.view, v = x.file_cnt, k = $("#query_tips").html(), y = x.item || [];
    new m("#topTab", m.DATA.media).selected("media" + j);
    var D;
    e(wx.cgiData.view), t(wx.cgiData.forbit), $("#js_cardview").on("click", function () {
        var i = "/wxoss/wx_articles?begin=%s&count=10&type=10&view_action=list_card".sprintf(wx.cgiData.begin);
        i = wx.cgiData.key ? i + "&query=" + wx.cgiData.key : i, location.href = wx.url(i);
    }), $("#js_listview").on("click", function () {
        var i = "/wxoss/wx_articles?begin=%s&count=10&view_action=list_list".sprintf(wx.cgiData.begin);
        i = wx.cgiData.key ? i + "&query=" + wx.cgiData.key : i, location.href = wx.url(i);
    });
    var q = 0;
    if (wx.cgiData.key ? (q = wx.cgiData.search_cnt, 0 == q && ($("#js_list").hide(), $("#js_card").hide(),
            $("#js_empty").hide(), $("#js_search_empty").show())) : q = v.app_msg_cnt, $("#js_count").html(q),
            $("#page_title").css("zoom", 1).css("zoom", ""), $("#query_tips").html(wx.cgiData.key ? "在所有素材" : k),
        q > 0) {
        var z = x.count, P = x.begin, T = P / z + 1;
        new r({
            container: "#js_pagebar",
            perPage: z,
            first: !1,
            last: !1,
            isSimple: !0,
            initShowPage: T,
            totalItemsNum: q,
            callback: function (i) {
                var t = i.currentPage;
                if (t != T)return t--, location.href = wx.url(wx.cgiData.key ? "/cgi-bin/appmsg?begin=%s&count=%s&t=media/appmsg_list2&type=10&action=list_%s&query=%s".sprintf(z * t, z, b, wx.cgiData.key) : "/cgi-bin/appmsg?begin=%s&count=%s&t=media/appmsg_list2&type=10&action=list_%s".sprintf(z * t, z, b)),
                    !1;
            }
        });
    }
    s(), function () {
        function i() {
            var i = [];
            c.find("input:checked").each(function () {
                i.push($(this).data("id"));
            }), h.post({
                url: "/cgi-bin/modifyfile",
                data: {
                    oper: "cleanimg",
                    monthago: o.value,
                    groupidlist: i.join(",")
                },
                mask: !1
            }, function (i) {
                if (!i || !i.base_resp)return g.err("系统错误，请稍后重试"), void a.popup("remove");
                var t = 1 * i.base_resp.ret;
                switch (t) {
                    case 0:
                        a.popup("remove"), f.show({
                            title: "清理图片",
                            type: "succ",
                            msg: "已清理%s的图片，合计%s张|当前图库图片总数：%s张".sprintf(o.name, p, i.new_total_count),
                            buttons: [{
                                text: "确定",
                                click: function () {
                                    this.hide(), location.reload();
                                }
                            }]
                        });
                        break;

                    default:
                        a.popup("remove"), g.err("系统错误，请稍后重试");
                }
            });
        }

        function t(i) {
            i ? (a.find("button[data-index=0]").parent().enable(), s && s.setall(!0), o && o.enable()) : (a.find("button[data-index=0]").parent().disable(),
            s && s.setall(!1), o && o.disable(), $(".js_pic_clear_num").text("-"));
        }

        function e() {
            p = 0, c.find("input:checked").each(function () {
                p += $(this).data("cnt");
            }), a.find(".js_pic_clear_num").text(p);
        }

        function n(i) {
            t(!1), h.get({
                url: "/cgi-bin/filepage?action=getimggroups&monthago=" + o.value + "&click=" + i,
                mask: !1
            }, function (i) {
                if (!i || !i.base_resp)return void g.err("系统错误，请稍后重试");
                var n = 1 * i.base_resp.ret;
                switch (n) {
                    case 0:
                        r = i.file_group, c = a.find(".js_pic_clear_list").empty();
                        for (var o = 0; o < r.length; o++)r[o].name && r[o].name.length > 0 && $(template.render("js_pic_clear_checkbox_tpl", {
                            name: r[o].name,
                            cnt: r[o].count,
                            id: r[o].id
                        })).appendTo(c);
                        s = c.find("input").checkbox(), c.find("input").click(e), a.popup("resetPosition"), t(!0),
                            a.find(".js_pic_clear_num").text(0), c.find('input[data-id="1"]').trigger("click");
                        break;

                    default:
                        g.err("系统错误，请稍后重试");
                }
            });
        }

        var a = null, c = null, o = null, s = null, p = 0, r = null;
        $("#js_pic_clear_a").click(function () {
            var t = 1;
            a = $("#js_pic_clear_tpl").popup({
                title: "清理图片",
                className: "clear_dialog_wrp",
                width: 566,
                buttons: [{
                    text: "开始清理",
                    click: function () {
                        o.name ? 0 === c.find("input:checked").length ? g.err("请至少选择一个分组") : ($(this.get()).find("button[data-index=0]").parent().btn(!1),
                            s.disabled("disabled"), o.disable(), i()) : g.err("请选择一个时间段");
                    },
                    type: "primary"
                }, {
                    text: "取消",
                    click: function () {
                        this.hide();
                    }
                }],
                onHide: function () {
                    this.remove();
                }
            }), o = new w({
                container: ".js_pic_clear_drop",
                data: [{
                    name: "三个月以前上传",
                    value: 3
                }, {
                    name: "六个月以前上传",
                    value: 6
                }, {
                    name: "一年以前上传",
                    value: 12
                }],
                search: !1,
                callback: function () {
                    n(t), t = 0;
                }
            }), o.selected(0);
        }), x.file_cnt.img_cnt >= 3e3;
    }();
});