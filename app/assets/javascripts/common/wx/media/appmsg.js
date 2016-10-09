define("common/wx/media/appmsg.js", ["widget/media.css", "common/wx/time.js", "tpl/media/appmsg.html.js", "common/qq/Class.js"], function (t) {
    "use strict";
    t("widget/media.css");
    var e = (wx.T, t("common/wx/time.js")), i = t("tpl/media/appmsg.html.js"), a = t("common/qq/Class.js"), s = a.declare({
        init: function (t) {
            if (t && t.container) {
                t.data = t.data || $.extend({}, t);
                var a = t.data, s = a.multi_item || [], m = s.length, o = null, n = !0, d = [];
                if (!(0 >= m)) {
                    o = s[0], o.title && o.cover || (n = !1);
                    for (var r = 1; m > r; ++r) {
                        var c = s[r];
                        d.push(c), c.title && c.cover || (n = !1);
                    }
                    var l = {
                        id: a.app_id,
                        type: t.type,
                        file_id: a.file_id,
                        time: a.create_time ? e.timeFormat(a.create_time) : "",
                        isMul: m > 1,
                        first: o,
                        list: d,
                        completed: n,
                        token: wx.data.t,
                        showEdit: t.showEdit || !1,
                        showMask: t.showMask || !1
                    };
                    $(t.container).html(wx.T(i, l)).data("opt", t), this.renderData = l;
                }
            }
        },
        getData: function () {
            return this.renderData;
        }
    });
    return s;
});