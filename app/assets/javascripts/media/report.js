define("media/report.js", ["biz_common/utils/monitor.js"], function (e) {
    "use strict";
    function n(e, n) {
        r.pv[e] && (n = n || 1, r.pv[e].count += n, console.log("addpv:" + e + " count:" + r.pv[e].count));
    }

    function t(e) {
        r.uv[e] && (r.uv[e].count = 1, window.location.href.indexOf("&_debug=1") > -1 && console.log("addUv:" + e + " count:" + r.uv[e].count));
    }

    function o(e, o) {
        n(e, o), t(e);
    }

    function i(e) {
        var n = r.id[e] || r.id[0];
        for (var t in r.pv) {
            var o = r.pv[t];
            o.count > 0 && u.setSum(n, o.key, o.count);
        }
        for (var t in r.uv) {
            var o = r.uv[t];
            o.count > 0 && u.setSum(n, o.key, o.count);
        }
        u.send();
    }

    var u = e("biz_common/utils/monitor.js"), r = {
        id: ["28146", "28305"],
        keyConf: ["more", "fontsize", "blockquote", "horizontal", "removeformat", "link", "unlink", "mpvideo", "qqvideo", "wxvideo", "insertimage", "insertvote", "insertmusic", "insertaudio", "insertcard", "bold", "italic", "underline", "forecolor", "backcolor", "justifyleft", "justifycenter", "justifyright", "rowspacingtop", "rowspacingbottom", "lineheight", "insertorderedlist", "insertunorderedlist", "imagefloatnone", "imagefloatleft", "imagefloatright", "imagefloatcenter", "usecache", "cacelcache", "showlink", "hidelink", "remoteimgsuc", "remoteimgerr", "fullscreen", "paste", "formatmatch", "contextmenu", "menu_selectall", "menu_cleardoc", "menu_justifyleft", "menu_justifyright", "menu_justifycenter", "menu_justifyjustify", "menu_inserttable", "menu_copy", "menu_paste", "menu_unlink", "insertshop", "menu_insertparagraphtrue", "menu_insertparagraph"],
        pv: {},
        uv: {}
    };
    return function () {
        for (var e = 0, n = r.keyConf.length; n > e; e++) {
            var t = 2 * e, o = 2 * e + 1, i = r.keyConf[e];
            r.pv[i] = {
                key: t,
                count: 0
            }, r.uv[i] = {
                key: o,
                count: 0
            };
        }
    }(), {
        addPv: n,
        addUv: t,
        addPvUv: o,
        send: i
    };
});