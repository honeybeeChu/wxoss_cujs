define("statistics/msg_keyword.js", ["statistics/tab-bar/msg-keyword-tab.js", "statistics/msg_top.js", "statistics/tooltip.js", "biz_common/moment.js", "common/wx/Cgi.js", "common/wx/report_util.js", "statistics/common.js"], function (t) {
    "use strict";
    function e() {
        D.show();
    }

    function a() {
        D.hide();
    }

    function s(t, e) {
        for (var a = [], s = [], n = 0, o = (h.page - 1) * h.pagesize, i = o + h.pagesize, r = 0; r < t.length; r++)(!e || t[r].keyword.indexOf(e) >= 0) && (a.push(t[r]),
            n += t[r].exp_count);
        for (var r = o; i > r && r < a.length; r++)s.push(a[r]);
        return {
            render_data: s,
            count: n,
            filter_data: a
        };
    }

    function n() {
        var t = s(x, h.keyword);
        $("#js_keyword").html(template.render("js_keyword_tpl", {
            data: t.render_data,
            total_count: t.count
        }));
        var e = t.filter_data.length;
        g.initPager({
            total_count: e,
            container: "#js_pagebar",
            count: h.pagesize,
            currentPage: h.page,
            callback: function (t) {
                t != h.page && (h.page = t, n());
            }
        });
    }

    function o() {
        $("#js_download_detail").attr("href", wx.url("/misc/messageanalysis?action=keyword&download=1" + "&type=%s&begin_date=%s&end_date=%s".sprintf(h.type, h.begin_date, h.end_date)));
    }

    function i() {
        l || (l = !1, e(), j("load keyword data"), _.get({
            url: wx.url("/misc/messageanalysis?type=%s&action=keyword&begin_date=%s&end_date=%s".sprintf(h.type, h.begin_date, h.end_date)),
            success: function (t) {
                var e = b("load keyword data");
                f(y, e, k), 0 == t.base_resp.ret ? (x = t.list, n(), o()) : _.show(t), a();
            }
        }));
    }

    var r = t("statistics/tab-bar/msg-keyword-tab.js"), d = t("statistics/msg_top.js");
    t("statistics/tooltip.js"), d.selected("msg_keyword");
    var c = t("biz_common/moment.js"), _ = t("common/wx/Cgi.js"), g = t("common/wx/report_util.js"), p = "YYYY-MM-DD", m = c().add("d", -1).format(p), l = !1, u = c().add("d", -30).format(p), w = t("statistics/common.js"), y = w.reportKeys.LOAD_KEYWORD_DATA_AJAX_KEY, f = w.ajaxReport, j = w.time, b = w.timeEnd, k = wx.data.uin, v = wx.cgiData, E = {
        type: "-1",
        begin_date: u,
        end_date: m,
        keyword: "",
        page: 1,
        pagesize: 10
    }, h = $.extend(!0, {}, E, v.filter), x = v.keyword_list;
    r.init(h), r.tabBar.on("tab-selected", function (t, e) {
        h.type = e.type, i();
    }), r.dateEvent.on("date-change", function (t) {
        h.begin_date = t.startDate, h.end_date = t.endDate, i();
    }), r.dateEvent.on("search-change", function (t) {
        h.keyword = t, n();
    });
    var D = $("div.wrp_overview div.wrp_loading");
    n(), o(), seajs.use("statistics/report.js", function (t) {
        t(w.logKeys.MSG_KEYWORD_NETWORK_OVERTIME, w.logKeys.MSG_KEYWORD_JS_OVERTIME, w.reportKeys.MSG_KEYWORD_PAGE);
    });
});