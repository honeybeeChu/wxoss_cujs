define("statistics/msg.js", ["statistics/tab-bar/msg-tab.js", "statistics/msg_top.js", "statistics/common.js", "statistics/chart/jquery-chart.js", "statistics/tooltip.js", "biz_web/ui/dropdown.js", "biz_common/moment.js", "common/wx/Cgi.js", "common/wx/report_util.js"], function (e) {
    "use strict";
    function t(e, t, a) {
        function r(e, r) {
            if (e = e[t], r = r[t], "string" == typeof e) {
                var s = e > r ? 1 : e === r ? 0 : -1;
                return 1 == a ? s : -s;
            }
            return "number" == typeof e ? 1 == a ? e - r : r - e : void 0;
        }

        var s = {
            0: "date",
            2: "user",
            3: "count",
            4: "per_user",
            5: "hour"
        };
        return t = s[t], e.sort(r);
    }

    function a(e) {
        var a = [], r = (J.page - 1) * J.pagesize, s = r + J.pagesize;
        e = t(e, J.sort_key, J.sort_type);
        for (var n = r; s > n && n < e.length; n++)a.push(e[n]);
        return a;
    }

    function r() {
        s(), n(), o(), k.dateEvent.clearCompare();
    }

    function s() {
        k.tabBar.activate(0, !0);
    }

    function n() {
        k.dateEvent.setRangeDate({
            startDate: J.begin_date,
            endDate: J.end_date,
            startCompareDate: J.compare_begin_date,
            endCompareDate: J.compare_end_date
        });
    }

    function o() {
        k.dateEvent.setSingleDate({
            startDate: J.singleDay,
            endDate: J.singleDay,
            startCompareDate: J.singleCompareDay,
            endCompareDate: J.singleCompareDay
        });
    }

    function i() {
        J.type === F.type ? (a(et), window.st_f._init(et), $("#js_keydata").html(template.render("js_keydata_tpl", {
            yesterday: et[0]
        })), $("#js_keydata_p").show()) : $("#js_keydata_p").hide();
    }

    function d(e) {
        for (var t = [], a = {}, r = 0, s = 0; s < e.length; s++) {
            var n = e[s];
            a[n.count_interval] ? a[n.count_interval] += n.user : a[n.count_interval] = n.user, r += n.user;
        }
        for (var o = {
            1: "1-5次",
            2: "6-10次",
            3: "10次以上"
        }, s = 0; 3 >= s; s++)a[s] && t.push({
            count_str: o[s],
            cal_count: a[s],
            percent: st_f._tofix(a[s] / r * 100, 2)
        });
        return t;
    }

    function _() {
        var e = d(Q);
        $("#js_dist").html(template.render("js_dist_tpl", {
            data: e
        }));
    }

    function p(e) {
        var t = J.begin_date, a = J.end_date, r = c(t, a, e);
        if ("monthly" !== J.type)tt.categories = r.categories; else {
            var s = r.categories;
            tt.categories = [];
            for (var n = 0, o = s.length; o > n; n++)tt.categories.push(R(s[n]).format("YYYY年MM月"));
        }
        tt.isCompareSeries = 0, tt.series = [{
            name: J.indexText,
            yAxis: 0,
            data: r.seriesData
        }], X.createChart(tt);
    }

    function m() {
        if (L && W) {
            var e = J.begin_date, t = J.end_date, a = J.compare_begin_date, r = J.compare_end_date, s = c(e, t, L), n = c(a, r, W), o = J.indexText, i = o, d = o, _ = "MM.DD", p = s.categories.length >= n.categories.length ? s.categories : n.categories;
            if ("hourly" === J.type)i = R(e).format(_) + o, d = R(a).format(_) + o; else if ("daily" === J.type || "weekly" === J.type)i = R(e).format(_) + "至" + R(t).format(_) + o,
                d = R(a).format(_) + "至" + R(r).format(_) + o; else if ("monthly" === J.type) {
                for (var m = "MM月", u = 0, l = p.length; l > u; u++)p[u] = R(p[u]).format("YYYY年MM月");
                i = R(e).format(m) + "至" + R(t).format(m) + o, d = R(a).format(m) + "至" + R(r).format(m) + o;
            }
            tt.isCompareSeries = 1, tt.categories = p || s.categories, tt.series = [{
                name: i,
                yAxis: 0,
                data: s.seriesData
            }, {
                name: d,
                yAxis: 0,
                data: n.seriesData
            }], X.createChart(tt);
        }
    }

    function c(e, t, a) {
        return "daily" === J.type ? g(e, t, a) : "monthly" === J.type ? u(e, t, a) : "hourly" === J.type ? l(e, t, a) : "weekly" === J.type ? f(e, t, a) : void 0;
    }

    function u(e, t, a) {
        for (var r = [], s = [], n = e, o = (R(t).add(1, "days").format("YYYY-MM-DD"), {}), i = 0, d = a.length; d > i; i++) {
            var _ = a[i];
            o[_.date] = _;
        }
        var p = R(n);
        1 !== p.date() && (p.date(1), p.add(1, "months")), n = p.format(B);
        for (var m = parseInt(R(n).format("X")), c = parseInt(R(t).format("X")), u = J.indexType; c >= m;) {
            if (r.push(n), o[n]) {
                var l = o[n];
                s.push({
                    name: R(l.date).format("YYYY年MM月"),
                    y: "average" === u ? l.count / l.user : l[u]
                }), i++;
            } else s.push({
                name: R(n).format("YYYY年MM月"),
                y: 0
            });
            n = R(n).add(1, "months").format(B), m = parseInt(R(n).format("X"));
        }
        return {
            categories: r,
            seriesData: s
        };
    }

    function l(e, t, a) {
        for (var r = [], s = [], n = 0, o = J.indexType, i = 0, d = 24; d > i; i++) {
            var _ = 10 > i ? "0" + i : "" + i, p = _ + ":00", m = a[n];
            r.push(p), m && m.hour / 100 == i ? (s.push({
                name: p,
                y: "average" === o ? m.count / m.user : m[o]
            }), n++) : s.push({
                name: p,
                y: 0
            });
        }
        return {
            categories: r,
            seriesData: s
        };
    }

    function f(e, t, a) {
        for (var r = [], s = [], n = e, o = (R(t).add(1, "days").format("YYYY-MM-DD"), J.indexType), i = {}, d = 0, _ = a.length; _ > d; d++) {
            var p = a[d];
            i[p.date] = p;
        }
        var m = parseInt(R(n).format("d"));
        1 !== m && (n = R(n).add(8 - m, "days").format(B));
        for (var c = parseInt(R(n).format("X")), u = parseInt(R(t).format("X")); u >= c;) {
            if (r.push(n), i[n]) {
                var l = i[n];
                s.push({
                    name: l.date,
                    y: "average" === o ? l.count / l.user : l[o]
                }), d++;
            } else s.push({
                name: n,
                y: 0
            });
            n = R(n).add(1, "weeks").format(B), c = parseInt(R(n).format("X"));
        }
        return {
            categories: r,
            seriesData: s
        };
    }

    function g(e, t, a) {
        for (var r = [], s = [], n = e, o = R(t).add(1, "days").format("YYYY-MM-DD"), i = J.indexType || "user", d = {}, _ = 0, p = a.length; p > _; _++) {
            var m = a[_];
            d[m.date] = m;
        }
        for (; n !== o;) {
            r.push(n);
            var c = d[n];
            s.push(c ? {
                name: n,
                y: "average" === i ? c.count / c.user : c[i]
            } : {
                name: n,
                y: 0
            }), n = R(n).add(1, "days").format("YYYY-MM-DD");
        }
        return {
            categories: r,
            seriesData: s
        };
    }

    function y() {
        var e = a(et);
        window.st_f._init(et), $("#js_detail_table").html(template.render("js_detail_table_tpl", {
            data: e,
            filter: J
        }));
        var t = et.length;
        O.initRank({
            sortkey: J.sort_key,
            sorttype: 1 == J.sort_type ? 1 : 0,
            down_class: "arrow_up",
            up_class: "arrow_down",
            callback: function (e) {
                J.sort_key = e.sortkey, J.sort_type = e.sorttype, J.page = 1, y();
            }
        }), O.initPager({
            total_count: t,
            container: "#js_pagebar",
            count: J.pagesize,
            currentPage: J.page,
            callback: function (e) {
                e != J.page && (J.page = e, y());
            }
        });
    }

    function h() {
        var e = R(J.begin_date, B), t = R(J.end_date, B), a = R(J.compare_begin_date, B), r = R(J.compare_end_date, B);
        J.is_compare && ("weekly" == J.type ? (1 !== e.day() && e.day(8), 1 !== a.day() && a.day(8)) : "monthly" == J.type && (1 !== e.date() && (e.add("M", 1),
            e.date(1)), 1 !== a.date() && (a.add("M", 1), a.date(1))), e.unix() > t.unix() && (e = t), a.unix() > r.unix() && (a = r)),
            e = e.format(B), t = t.format(B), a = a.format(B), r = r.format(B);
        var s = wx.url("/wxoss/wx_msganalysis?begin_date=%s&end_date=%s&type=%s&download=1".sprintf(e, t, J.type));
        J.is_compare && (s += "&compare=1&compare_begin_date=%s&compare_end_date=%s".sprintf(a, r)),
            $("#js_download_detail").attr("href", s);
    }

    function v(e) {
        if (!Z) {
            Z = !0, w();
            var t = "";
            ("daily" != J.type || V) && (t = "&begin_date=%s&end_date=%s".sprintf(J.begin_date, J.end_date)),
                A("load mssage data"), K.get({
                url: wx.url("/wxoss/wx_msganalysis?type=%s%s".sprintf(J.type, t)),
                success: function (t) {
                    var a = z("load mssage data");
                    E(S, a, G), V = !1, Z = !1, b(), 0 == t.base_resp.ret ? (et = t.list, Q = t.dist_list, L = $.extend(!0, [], et),
                    e && i(), _(), p(L), y(), h()) : K.show(t);
                }
            });
        }
    }

    function w() {
        at.show();
    }

    function b() {
        at.hide();
    }

    function x(e) {
        var t = {
            user: "MSG_TAB_USER_COUNT",
            count: "MSG_TAB_MSG_COUNT",
            average: "MSG_TAB_AVERAGE_MSG_COUNT"
        }, a = t[e.type];
        T.clickReport(T.reportKeys[a]);
    }

    function j() {
        function e() {
            r++, r && (Z = !1, b());
        }

        if (!Z) {
            Z = !0, w();
            var t = "", a = !1, r = -1;
            L = W = null, t = "&begin_date=%s&end_date=%s".sprintf(J.begin_date, J.end_date), A("load mssage data compare 1"),
                K.get({
                    url: wx.url("/wxoss/wx_msganalysis?type=%s%s".sprintf(J.type, t)),
                    success: function (t) {
                        var r = z("load mssage data compare 1");
                        E(S, r, G), 0 == t.base_resp.ret ? (et = t.list, Q = t.dist_list, L = $.extend(!0, [], et), a && (Y(),
                            m(), nt = D(), M(), h()), a = !0, e()) : K.show(t);
                    }
                }), t = "&begin_date=%s&end_date=%s".sprintf(J.compare_begin_date, J.compare_end_date),
                A("load mssage data compare 2"), K.get({
                url: wx.url("/wxoss/wx_msganalysis?type=%s%s".sprintf(J.type, t)),
                success: function (t) {
                    var r = z("load mssage data compare 2");
                    E(S, r, G), 0 == t.base_resp.ret ? (rt = t.list, st = t.dist_list, W = $.extend(!0, [], rt), a && (Y(),
                        m(), nt = D(), M(), h()), a = !0, e()) : K.show(t);
                }
            });
        }
    }

    function D() {
        for (var e = [], t = {}, a = {}, r = R(J.begin_date, B), s = R(J.end_date, B), n = R(J.compare_begin_date, B), o = 1, i = "d", d = B, _ = R(J.compare_end_date, B), p = 0; p < et.length; p++)t[et[p].date + (et[p].hour / 100 || "")] = et[p];
        for (var p = 0; p < rt.length; p++)a[rt[p].date + (rt[p].hour / 100 || "")] = rt[p];
        if ("weekly" == J.type)1 !== r.day() && r.day(8), 1 !== n.day() && n.day(8), o = 7; else if ("monthly" == J.type)1 !== r.date() && (r.add("M", 1),
            r.date(1)), 1 !== n.date() && (n.add("M", 1), n.date(1)), i = "M"; else if ("hourly" == J.type) {
            for (i = "h", s.add("h", 23), _.add("h", 23), d += "H"; r.unix() <= s.unix() && n.unix() <= _.unix();) {
                var m = r.format(d), c = n.format(d), u = r.format(B), l = n.format(B), f = {
                    count: "-",
                    user: "-",
                    date: u
                }, g = {
                    count: "-",
                    user: "-",
                    date: l
                };
                f.hour = r.format("HH:SS"), g.hour = f.hour, e.push(a[c] || g), e.push(t[m] || f), n.add(i, o),
                    r.add(i, o);
            }
            return e.reverse();
        }
        for (; r.unix() <= s.unix() && n.unix() <= _.unix();) {
            var u = r.format(d), l = n.format(d), f = {
                count: "-",
                user: "-",
                date: u
            };
            e.push(a[l] || {
                    count: "-",
                    user: "-",
                    date: l
                }), e.push(t[u] || f), n.add(i, o), r.add(i, o);
        }
        for (; r.unix() <= s.unix();) {
            var u = r.format(d);
            e.push({
                count: "-",
                user: "-"
            }), e.push(t[u] || {
                    count: "-",
                    user: "-",
                    date: u
                }), r.add(i, o);
        }
        for (; n.unix() <= _.unix();) {
            var l = n.format(d);
            e.push(a[l] || {
                    count: "-",
                    user: "-",
                    date: l
                }), e.push({
                count: "-",
                user: "-"
            }), n.add(i, o);
        }
        return e.reverse(), e;
    }

    function M() {
        var e = [], t = (J.page - 1) * J.pagesize, a = t + J.pagesize;
        window.st_f._init(nt);
        for (var r = t; a > r && r < nt.length; r++)e.push(nt[r]);
        $("#js_detail_table").html(template.render("js_compare_detail_table_tpl", {
            data: e,
            filter: J
        }));
        var s = nt.length;
        O.initPager({
            total_count: s,
            container: "#js_pagebar",
            count: J.pagesize,
            currentPage: J.page,
            callback: function (e) {
                e != J.page && (J.page = e, M());
            }
        });
    }

    function Y() {
        for (var e, t = d(Q), a = d(st), r = [], s = 0; s < t.length; s++)e = t[s], r.push(e), e.dist_time = J.begin_date + "至" + J.end_date,
            a[s] ? (e.rowspan = !0, a[s].hiderow = !0, r.push(a[s]), a[s].dist_time = J.compare_begin_date + "至" + J.compare_end_date) : e.rowspan = !1;
        for (; s < a.length; s++)a[s].rowspan = !1, a[s].dist_time = J.compare_begin_date + "至" + J.compare_end_date,
            r.push(a[s]);
        $("#js_dist").html(template.render("js_compare_dist_tpl", {
            data: r
        }));
    }

    var k = e("statistics/tab-bar/msg-tab.js"), C = e("statistics/msg_top.js"), T = e("statistics/common.js"), S = T.reportKeys.LOAD_MSG_DATA_AJAX_KEY, E = T.ajaxReport, A = T.time, z = T.timeEnd, G = wx.data.uin;
    e("statistics/chart/jquery-chart.js"), e("statistics/tooltip.js"), C.selected("msg_stat");
    var I = e("biz_web/ui/dropdown.js"), R = e("biz_common/moment.js"), K = e("common/wx/Cgi.js"), O = e("common/wx/report_util.js"), X = $("#js_msg_chart"), B = "YYYY-MM-DD", P = R().add("d", -1).format(B), N = R().add("d", -30).format(B), U = R().add("d", -31).format(B), H = R().add("d", -60).format(B), V = !1, q = window.cgiData;
    q.filter.begin_date || delete q.filter.begin_date, q.filter.end_date || delete q.filter.end_date;
    var F = {
        type: "daily",
        begin_date: N,
        end_date: P,
        compare_begin_date: H,
        compare_end_date: U,
        is_compare: !1,
        sort_key: 0,
        sort_type: 2,
        page: 1,
        pagesize: 10,
        indexText: "消息发送人数",
        indexType: "user"
    }, J = $.extend(!0, {}, F, q.filter), L = $.extend(!0, [], q.data.msg_data), W = $.extend(!0, [], q.data.msg_data), Q = q.data.dist_data, Z = !1, et = $.extend(!0, [], q.data.msg_data);
    k.init(J), template.helper("$yest", function (e) {
        var t = window.st_f.first_idx;
        return st_f._get_item(t, e);
    }), template.helper("day_percent", function (e) {
        var t = window.st_f.first_idx, a = window.st_f.yest_idx;
        return window.st_f._percent(t, a, e);
    }), template.helper("week_percent", function (e) {
        var t = window.st_f.weekago_idx, a = window.st_f.first_idx;
        return window.st_f._percent(a, t, e);
    }), template.helper("month_percent", function (e) {
        var t = window.st_f.first_idx, a = window.st_f.monthago_idx;
        return window.st_f._percent(t, a, e);
    });
    var tt = (new I({
        container: "#js_timetype_drop",
        label: "日报",
        data: [{
            name: "小时报",
            value: "hourly"
        }, {
            name: "日报",
            value: "daily"
        }, {
            name: "周报",
            value: "weekly"
        }, {
            name: "月报",
            value: "monthly"
        }],
        callback: function (e) {
            J = $.extend(!0, {}, F, {
                type: e
            }), r(), "hourly" == e ? (J.begin_date = J.end_date = P, k.dateEvent.emit("date-selection:hide")) : k.dateEvent.emit("date-selection:show"),
                v(!0);
        }
    }), {
        autoStep: !0,
        chartType: "area",
        title: "",
        height: 300,
        isCompareSeries: 0,
        dataFormat: "1",
        labelFormat: 0,
        enableLegend: !0,
        theme: "wechat"
    });
    y(), _(), p(L), h();
    var at = $("div.wrp_overview div.wrp_loading");
    k.dateEvent.on("date-change", function (e) {
        V = !0, J.begin_date = e.startDate, J.end_date = e.endDate, e.startCompareDate && (J.compare_begin_date = e.startCompareDate),
        e.endCompareDate && (J.compare_end_date = e.endCompareDate), J.is_compare = e.needCompare,
            J.is_compare ? j() : v();
    }), k.tabBar.on("tab-selected", function (e, t) {
        x(t), $("#js_detail_table table td.js_" + J.indexType).removeClass("td_high_light"),
            $("#js_detail_table table td.js_" + t.type).addClass("td_high_light"), J.indexType = t.type,
            J.indexText = t.text, J.is_compare ? m() : p(L);
    });
    var rt = [], st = [];
    template.helper("pageIndex", function (e, t, a) {
        return parseInt((e * (t - 1) + a) / 2 + 1);
    });
    var nt = [];
    seajs.use("statistics/report.js", function (e) {
        e(T.logKeys.MSG_NETWORK_OVERTIME, T.logKeys.MSG_JS_OVERTIME, T.reportKeys.MSG_PAGE);
    });
});
