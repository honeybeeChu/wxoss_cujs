define("statistics/user_stat/summary/summary.js", ["biz_common/moment.js", "statistics/components/tab-bar2.js", "statistics/components/date-range2.js", "statistics/components/date-range.js", "biz_web/ui/dropdown.js", "common/wx/Cgi.js", "common/wx/report_util.js", "statistics/user_stat/summary/summary-state.js", "statistics/user_stat/summary/summary-chart.js", "statistics/user_stat/common.js", "statistics/common.js", "statistics/user_stat/top.js"], function (e) {
    "use strict";
    function t() {
        a(), U(), E(), o(), D(), n(), r(), setTimeout(k);
    }

    function a() {
        s(), l(dt, lt), tt.draw();
    }

    function n() {
        var e = {
            download: 1,
            begin_date: et.tableBeginDate,
            end_date: et.tableEndDate,
            source: "99999999"
        };
        et.needCompare && (e.begin_date = et.drawBeginDate, e.end_date = et.drawEndDate, e.compare_begin_date = et.beginCompareDate,
            e.compare_end_date = et.endCompareDate, e.compare = 1);
        var t = "/wxoss/wx_useranalysis?";
        for (var a in e)t += "&" + a + "=" + e[a];
        t = wx.url(t), W("#js_download_detail").attr("href", t);
    }

    function r() {
        W("#js_download_detail").on("click", function () {
            nt.clickReport(nt.reportKeys.USER_SUM_EXCEL);
        });
    }

    function s() {
        var e = i();
        u(e);
    }

    function i() {
        for (var e = et.userStatList, t = e[lt], a = ["cancel_user", "cumulate_user", "netgain_user", "new_user"], n = {}, r = 0, s = a.length; s > r; r++) {
            var i = a[r], o = t[i], u = e[mt][i], l = e[pt][i], d = e[_t][i];
            n[i] = {
                count: o,
                day: c(o, u),
                week: c(o, l),
                month: c(o, d)
            };
        }
        return n;
    }

    function o() {
        wt = new Q({
            needCompare: !1,
            startDate: dt,
            endDate: lt
        }), wt.$el.find(".btn_default, .time_lable, .setup").remove(), jQuery("#js_table_date").html(wt.$el),
            wt.on("date-change", function (e) {
                et.tableBeginDate = e.startDate, et.tableEndDate = e.endDate, bt = !0, A(!0);
            });
    }

    function c(e, t) {
        if (0 == t)return "--";
        var a = (e - t) / t * 100;
        return a % 1 == 0 ? a : a.toFixed(1);
    }

    function u(e) {
        $("#js_keydata").html(template("js_key_data_tpl", e));
    }

    function l(e, t) {
        C(), h(), et.detailData = [];
        var a = et.tableUserStateList || et.userStatList;
        st(e, t, function (e) {
            et.detailData.push(a[e]);
        }, !0), et.desc = !0, et.sortKey = "date", et.currentPage = 1, et.pageTotalCount = et.detailData.length,
            Dt = 14, d(), _(), p(1);
    }

    function d() {
        W("th.rank_area i").show();
    }

    function _() {
        Z.initPager({
            total_count: et.pageTotalCount,
            container: "#js_pagebar",
            count: Dt,
            currentPage: et.currentPage,
            callback: function (e) {
                e != et.currentPage && (et.currentPage = e, et.needCompare ? v(e) : p(e));
            }
        }), m();
    }

    function m() {
        W("#js_pagebar a.page_prev").click(function () {
            nt.clickReport(nt.reportKeys.USER_SUM_NAV_LEFT);
        }), W("#js_pagebar a.page_next").click(function () {
            nt.clickReport(nt.reportKeys.USER_SUM_NAV_RIGHT);
        }), W("#js_pagebar a.page_go").click(function () {
            nt.clickReport(nt.reportKeys.USER_SUM_NAV_JUMP);
        });
    }

    function p(e) {
        var t = (e - 1) * Dt, a = t + Dt;
        et.currentDetail = et.detailData.slice(t, a), f();
    }

    function f() {
        var e = template("js_detail_item", {
            data: et.currentDetail
        }), t = W("#js_detail");
        t.html(e);
    }

    function D() {
        W(document).on("click", "th.rank_area", null, function () {
            var e = W(this), t = e.data("type");
            t !== et.sortKey ? (g(e), et.sortKey = t, et.desc = !1) : et.desc = !et.desc, b(e, et.desc), w();
        });
    }

    function g(e) {
        e.siblings("th").find("i").show();
    }

    function b(e, t) {
        t ? (e.find("i.arrow_down").show(), e.find("i.arrow_up").hide()) : (e.find("i.arrow_down").hide(),
            e.find("i.arrow_up").show());
    }

    function w() {
        var e = et.sortKey, t = et.desc;
        et.detailData.sort(function (a, n) {
            var r, s;
            return "date" === e ? (r = +I(a.date).format("X"), s = +I(n.date).format("X")) : (r = a[e], s = n[e]),
                t ? s - r : r - s;
        }), p(et.currentPage);
    }

    function j() {
        if (S(), y(), et.compareDetailData = [], et.compareUserStatList.length > et.userStatList.length)var e = et.beginCompareDate, t = et.endCompareDate, a = !1, n = et.beginDate, r = et.compareUserStatList.length; else var e = et.drawBeginDate, t = et.drawEndDate, a = !0, n = et.beginCompareDate, r = et.userStatList.length;
        st(e, t, function (e) {
            var t, s;
            a ? (t = et.userStatList[e], s = et.compareUserStatList[n]) : (t = et.userStatList[n], s = et.compareUserStatList[e]);
            var i = {
                i: r,
                first: t,
                second: s
            };
            r--, n = I(n).add(1, "days").format(ut), et.compareDetailData.push(i);
        }), et.compareDetailData.reverse(), et.currentPage = 1, et.pageTotalCount = et.compareDetailData.length,
            Dt = 7, _(), v(1);
    }

    function v(e) {
        var t = (e - 1) * Dt, a = t + Dt;
        et.currentCompareDetail = et.compareDetailData.slice(t, a);
        var n = template("js_detail_compare_item", {
            data: et.currentCompareDetail
        }), r = W("#js_compare_table tbody");
        r.html(n);
    }

    function h() {
        W("#js_compare_table").hide();
    }

    function S() {
        W("#js_compare_table").show();
    }

    function y() {
        W("#js_single_table").hide();
    }

    function C() {
        W("#js_single_table").show();
    }

    function U() {
        ot = new J({
            name: "关键指标详解",
            tabs: [{
                text: "新增人数",
                index: "new_user"
            }, {
                text: "取消关注人数",
                index: "cancel_user"
            }, {
                text: "净增人数",
                index: "netgain_user"
            }, {
                text: "累积人数",
                index: "cumulate_user"
            }]
        }), W("#js_tab_bar_wrp").html(ot.$el);
    }

    function E() {
        ct = new F({
            singleContainer: "#js_single",
            compareContainer: "#js_compare",
            compareBtn: "#js_compare_btn",
            needCompare: !0,
            startDate: dt,
            endDate: lt
        });
    }

    function k() {
        ot.on("tab-selected", function (e, t) {
            L(t), et.index = t.index, M(), tt.draw();
        });
        var e = [{
            name: "全部来源",
            value: 99999999
        }, {
            name: "公众号搜索",
            value: 1
        }, {
            name: "扫描二维码",
            value: 30
        }, {
            name: "图文页右上角菜单",
            value: 43
        }, {
            name: "图文页内公众号名称",
            value: 57
        }, {
            name: "名片分享",
            value: 17
        }, {
            name: "公众号文章广告",
            value: 75
        }, {
            name: "朋友圈广告",
            value: 78
        }, {
            name: "支付后关注",
            value: 51
        }, {
            name: "其他合计",
            value: 0
        }];
        vt && e.splice(6, 0), ht = new H({
            container: "#js_sources",
            label: "全部来源",
            data: e,
            callback: function (e, t) {
                e = "" + e, et.source !== e && (x(e), bt = !1, et.source = e, et.sourceText = t, et.needCompare ? T() : A());
            }
        }), ct.on("date-change", function (e) {
            bt = !0, $.extend(et, e), et.beginDate = et.drawBeginDate = e.startDate, et.drawEndDate = e.endDate,
                et.beginCompareDate = e.startCompareDate, delete et.startDate, delete et.startCompareDate,
                wt.setDate({
                    startDate: e.startDate,
                    endDate: e.endDate
                }), et.needCompare ? (W("#js_table_date").hide(), T()) : (W("#js_table_date").show(), A());
        }), W("#js_compare_btn0").on("click", function () {
            R();
        });
    }

    function R() {
        nt.clickReport(nt.reportKeys.USER_SUM_COMPARE);
    }

    function x(e) {
        var t = "USER_SUM_SRC_" + e;
        nt.clickReport(nt.reportKeys[t]);
    }

    function L(e) {
        var t = "USER_SUM_TAB_" + e.index.toUpperCase();
        nt.clickReport(nt.reportKeys[t]);
    }

    function M() {
        "new_user" === et.index ? (et.source = "99999999", ht.reset(), St.show()) : St.hide();
    }

    function K(e, t, a) {
        var n = "/wxoss/wx_useranalysis?&begin_date=%s&end_date=%s&source=%s", r = n.sprintf(e, t, a);
        return r;
    }

    function A(e) {
        if (e)var t = et.tableBeginDate, a = et.tableEndDate; else var t = et.beginDate, a = et.endDate;
        var r = bt ? et.source + ",99999999" : et.source;
        vt && 0 == et.source && (r = et.source);
        var s = K(t, a, r);
        X(), rt([s], function (r) {
            var s = r.category_list;
            if (bt) {
                var i = N(s).list, o = s.slice(0, s.length - 1);
                e ? (t = et.tableBeginDate, a = et.tableEndDate, et.tableUserStateList = Y(t, a, i), l(t, a)) : (et.sourceData = V(t, a, o),
                    et.userStatList = Y(t, a, i), et.tableUserStateList = et.userStatList, tt.draw(), l(t, a)),
                    et.tableBeginDate = t, et.tableEndDate = a, n();
            } else et.sourceData = V(t, a, s), tt.draw();
            G();
        }, P);
    }

    function P(e, t, a) {
        if (0 !== a.base_resp.ret)return q.show(a), void G();
        var n = +new Date - e, r = nt.reportKeys.LOAD_USER_SUMMARY_DATA_AJAX_KEY, s = nt.ajaxReport;
        s(r, n, wx.data.uin);
    }

    function T() {
        var e = et.beginDate, t = et.endDate, a = bt ? et.source + ",99999999" : et.source, n = K(e, t, a), r = et.beginCompareDate, s = et.endCompareDate, i = K(r, s, a);
        X(), rt([n, i], function (a, n) {
            var i = a.category_list, o = n.category_list;
            if (bt) {
                var c = et.rawList = N(i).list, u = et.rawCompareList = N(o).list;
                et.userStatList = Y(e, t, c), et.compareUserStatList = Y(r, s, u);
                var l = i.slice(0, i.length - 1), d = o.slice(0, o.length - 1);
                et.sourceData = V(e, t, l), et.compareSourceData = V(r, s, d), B();
            } else et.sourceData = V(e, t, i), et.compareSourceData = V(r, s, o), tt.draw();
            G();
        }, P);
    }

    function B() {
        j(), tt.draw(), n();
    }

    function Y(e, t, a) {
        for (var n = {}, r = 0, s = a.length; s > r; r++) {
            var i = a[r];
            n[i.date] = i;
        }
        var o = 0;
        return st(e, t, function (e) {
            o++, z(n, e);
        }), n.length = o, n;
    }

    function z(e, t) {
        e[t] || (e[t] = {
            cancel_user: 0,
            cumulate_user: 0,
            date: t,
            netgain_user: 0,
            new_user: 0,
            isPatch: !0
        });
    }

    function O(e, t) {
        for (var a = ["new_user"], n = 0, r = a.length; r >= n; n++) {
            var s = a[n];
            e[s] += t[s];
        }
    }

    function V(e, t, a) {
        for (var n = Y(e, t, a[0].list), r = 1, s = a.length; s > r; r++)for (var i = a[r].list, o = 0, c = i.length; c > o; o++) {
            var u = i[o];
            O(n[u.date], u);
        }
        return n;
    }

    function N(e) {
        return e[e.length - 1];
    }

    function X() {
        yt.show();
    }

    function G() {
        yt.hide();
    }

    var I = e("biz_common/moment.js"), J = e("statistics/components/tab-bar2.js"), F = e("statistics/components/date-range2.js"), Q = e("statistics/components/date-range.js"), H = e("biz_web/ui/dropdown.js"), W = jQuery, q = e("common/wx/Cgi.js"), Z = e("common/wx/report_util.js"), et = e("statistics/user_stat/summary/summary-state.js"), tt = e("statistics/user_stat/summary/summary-chart.js"), at = e("statistics/user_stat/common.js"), nt = e("statistics/common.js"), rt = (at.log,
        at.mGet), st = at.loopDay, it = e("statistics/user_stat/top.js");
    it.selected("user_stat");
    var ot = (W("#js_actions"), null), ct = null, ut = "YYYY-MM-DD", lt = I().add("d", -1).format(ut), dt = I().add("d", -30).format(ut), _t = I().add("d", -31).format(ut), mt = I(lt).add("d", -1).format(ut), pt = I(lt).add("d", -7).format(ut), ft = I(lt).subtract(1, "months").format(ut), Dt = 14, gt = cgiData.list[0].list, bt = !1, wt = null, jt = Y(_t, lt, gt), vt = !0;
    W.extend(et, {
        rawList: gt,
        rawCompareList: null,
        userStatList: jt,
        compareUserStatList: null,
        beginDate: ft,
        endDate: lt,
        needCompare: !1,
        sourceData: jt,
        compareSourceData: null,
        sourceText: "全部",
        pageSize: 0,
        currentPage: 0,
        sortKey: "date",
        desc: !0,
        detailData: null,
        currentDetail: null,
        compareDetailData: null,
        currentCompareDetail: null,
        drawBeginDate: dt,
        drawEndDate: lt,
        tableBeginDate: dt,
        tableEndDate: lt,
        index: "new_user",
        source: "99999999"
    }), template.helper("keyPercent", function (e) {
        return "--" == e ? "&nbsp;&nbsp;&nbsp;--" : (e = 1 * e, e >= 0 ? '<i class="icon_up" title="上升"></i>%s%'.sprintf(e) : '<i class="icon_down" title="下降"></i>%s%'.sprintf(-e));
    }), t();
    var ht, St = W("#js_sources"), yt = $("div.wrp_overview div.wrp_loading");
    nt.help("#js_table_ask", "#js_table_ask_content"), nt.help("#js_ask_trend", "#js_ask_trend_content"),
        nt.help("#js_ask_keys", "#js_ask_keys_content"), seajs.use("statistics/report.js", function (e) {
        e(nt.logKeys.USER_SUMMARY_NETWORK_OVERTIME, nt.logKeys.USER_SUMMARY_JS_OVERTIME, nt.reportKeys.USER_SUMMARY_PAGE);
    });
});
