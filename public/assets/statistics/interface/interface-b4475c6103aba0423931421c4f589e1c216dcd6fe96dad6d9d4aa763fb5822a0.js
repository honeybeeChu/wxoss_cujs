define("statistics/interface/interface.js", ["statistics/interface/top.js", "statistics/components/tab-bar.js", "biz_web/ui/dropdown.js", "common/wx/Cgi.js", "statistics/components/date-range.js", "statistics/common.js", "biz_common/moment.js", "statistics/interface/state.js", "statistics/interface/models.js", "statistics/interface/key-index.js", "statistics/interface/chart.js", "statistics/interface/detail.js"], function (t) {
    "use strict";
    function e() {
        O.render(), P.draw(), G.render(), a(), p(), _(), u(), f();
    }

    function a() {
        new v({
            container: "#js_timetype_drop",
            label: "日报",
            data: [{
                name: "日报",
                value: "daily"
            }, {
                name: "小时报",
                value: "hourly"
            }],
            callback: function (t) {
                H.type !== t && (H.type = t, "hourly" === t ? O.hide() : O.show(), n(), i(), s(), u(), o());
            }
        });
    }

    function n() {
        "hourly" === H.type ? (L.$el.show(), k.$el.hide()) : (L.$el.hide(), k.$el.show());
    }

    function i() {
        H.key = "callback_count", E.activate(0, !0);
    }

    function s() {
        H.dateState.needCompare = !1, "hourly" === H.type ? (k.clearCompare(), k.setDate({
            startDate: F,
            endDate: R
        }), H.dateState.beginDate = R, H.dateState.endDate = R) : (L.clearCompare(), L.setDate({
            startDate: R,
            endDate: R
        }), H.dateState.beginDate = F, H.dateState.endDate = R);
    }

    function o() {
        var t = {
            begin_date: H.dateState.beginDate,
            end_date: H.dateState.endDate,
            type: "hourly" === H.type ? "hour" : "daily"
        }, e = [V(J, t)];
        H.dateState.needCompare && (t.begin_date = H.dateState.compareBeginDate, t.end_date = H.dateState.compareEndDate,
            e.push(V(J, t))), b(), C.mGet(e, function (t, e) {
            if (e = e || {
                        hour_list: [],
                        daily_list: []
                    }, "hourly" === H.type) {
                var a = {
                    list: t.hour_list,
                    compareList: e.hour_list
                };
                c(a);
            } else {
                var a = {
                    list: t.daily_list,
                    compareList: e.daily_list
                };
                r(a);
            }
            P.draw(), G.render(), g();
        }, function (t, e, a) {
            if (0 !== a.base_resp.ret)return g(), S.show(a);
            var n = +new Date - t;
            C.ajaxReport(C.reportKeys.LOAD_INTERFACE_AJAX_KEY, n, wx.data.uin);
        });
    }

    function r(t) {
        var e = t.list, a = t.compareList, n = H.dateState;
        M.rawList = e, M.list = D(n.beginDate, n.endDate, e), H.dateState.needCompare ? (M.rawCompareList = a,
            M.compareList = D(n.compareBeginDate, n.compareEndDate, a)) : delete M.compareList;
    }

    function c(t) {
        M.rawList = t.list, M.list = d(t.list, H.dateState.beginDate), H.dateState.needCompare ? (M.rawCompareList = t.compareList,
            M.compareList = d(t.compareList, H.dateState.compareBeginDate)) : delete M.compareList;
    }

    function d(t, e) {
        var a = {};
        t.each(function (t) {
            t.average_time_cost = (t.total_time_cost / t.callback_count).toFixed(2), l(t), t.newHour = C.numberToTime(t.hour / 100),
                a[t.newHour] = t;
        });
        var n = 0;
        return C.loopHour(0, 23, function (t) {
            a[t] || m(a, t, e, n), n++;
        }), a;
    }

    function l(t) {
        t.fail_rate = 1 * (t.fail_count / t.callback_count * 100).toFixed(2);
    }

    function m(t, e, a, n) {
        t[a] || (t[e] = {
            hour: 100 * n,
            newHour: e,
            date: a,
            isPatch: !0
        });
    }

    function p() {
        E = new w({
            name: "关键指标详解",
            tabs: [{
                text: "调用次数",
                type: "callback_count"
            }, {
                text: "失败率",
                type: "fail_rate"
            }, {
                text: "平均耗时",
                type: "average_time_cost"
            }, {
                text: "最大耗时",
                type: "max_time_cost"
            }]
        }), z.prepend(E.$el);
    }

    function u() {
        var t = {
            begin_date: H.dateState.beginDate,
            end_date: H.dateState.endDate,
            type: "hourly" === H.type ? "hour" : "daily",
            download: 1
        };
        H.dateState.needCompare && (t.compare_begin_date = H.dateState.compareBeginDate, t.compare_end_date = H.dateState.compareEndDate,
            t.compare = 1);
        var e = V(J, t);
        $("#js_download_detail").attr("href", e);
    }

    function _() {
        k = new x({
            startDate: F,
            endDate: R
        }), L = new x({
            startDate: R,
            endDate: R,
            single: !0
        });
        var t = z.find("div.sub_menu").eq(0);
        L.$el.hide(), t.html(k.$el), t.append(L.$el);
    }

    function f() {
        function t(t) {
            H.dateState.beginDate = t.startDate, H.dateState.endDate = t.endDate, H.dateState.compareBeginDate = t.startCompareDate,
                H.dateState.compareEndDate = t.endCompareDate, H.dateState.needCompare = t.needCompare,
                u(), o();
        }

        E.on("tab-selected", function (t, e) {
            H.key = e.type, H.keyText = e.text, y(H.key) && (H.keyText += "(毫秒)"), P.draw(), G.highlight(e.type);
        }), k.on("date-change", t), L.on("date-change", t);
    }

    function y(t) {
        return "average_time_cost" === t || "max_time_cost" === t;
    }

    function D(t, e, a) {
        for (var n = {}, i = 0, s = a.length; s > i; i++) {
            var o = a[i];
            o.average_time_cost = (o.total_time_cost / o.callback_count).toFixed(2), l(o), n[o.date] = o;
        }
        var r = 0;
        return I(t, e, function (t) {
            r++, h(n, t);
        }), n.length = r, n;
    }

    function h(t, e) {
        t[e] || (t[e] = {
            date: e,
            callback_count: 0,
            fail_count: 0,
            fail_rate: 0,
            total_time_cost: 0,
            max_time_cost: 0,
            average_time_cost: 0,
            isPatch: !0
        });
    }

    function b() {
        q.show();
    }

    function g() {
        q.hide();
    }

    function j() {
        C.help("#js_help_icon", "#js_help_content");
    }

    t("statistics/interface/top.js");
    var w = t("statistics/components/tab-bar.js"), v = t("biz_web/ui/dropdown.js"), S = t("common/wx/Cgi.js"), x = t("statistics/components/date-range.js"), C = t("statistics/common.js"), E = null, k = null, L = null, T = "YYYY-MM-DD", A = t("biz_common/moment.js"), R = A().add("d", -1).format(T), F = A().add("d", -30).format(T), B = A().add("d", -31).format(T), I = (A(R).add("d", -1).format(T),
        A(R).add("d", -7).format(T), C.loopDay), K = cgiData.list, N = D(B, R, cgiData.list), Y = jQuery, z = Y("#js_actions"), H = t("statistics/interface/state.js"), M = t("statistics/interface/models.js"), O = t("statistics/interface/key-index.js"), P = t("statistics/interface/chart.js"), G = t("statistics/interface/detail.js"), J = "/wxoss/wx_interfaceanalysis?", V = C.makeUrl;
    $.extend(H, {
        type: "daily",
        key: "callback_count",
        keyText: "调用次数",
        dateState: {
            needCompare: !1,
            beginDate: F,
            endDate: R,
            compareBeginDate: null,
            compareEndDate: null
        }
    }), $.extend(M, {
        list: N,
        rawList: K
    });
    var q = $("div.wrp_overview div.wrp_loading");
    template.helper("keyPercent", function (t) {
        return "--" === t ? "&nbsp;&nbsp;&nbsp;" + t : t >= 0 ? '<i class="icon_up" title="上升"></i>%s%'.sprintf(t) : '<i class="icon_down" title="下降"></i>%s%'.sprintf(-t);
    }), seajs.use("statistics/report.js", function (t) {
        t(C.logKeys.INTERFACE_NETWORK_OVERTIME, C.logKeys.INTERFACE_JS_OVERTIME, C.reportKeys.INTERFACE_PAGE);
    }), j(), e();
});
