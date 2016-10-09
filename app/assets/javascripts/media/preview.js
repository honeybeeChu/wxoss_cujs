define("media/preview.js", ["common/qq/events.js", "common/wx/phoneView.js", "biz_common/moment.js", "tpl/media/preview/appmsg.html.js", "tpl/media/preview/card.html.js", "tpl/media/preview/moments.html.js", "tpl/media/preview/chat.html.js"], function (e, t) {
    "use strict";
    function i(e) {
        var t = wx.data.time;
        wx.cgiData.appmsg_data && wx.cgiData.appmsg_data.create_time && (t = wx.cgiData.appmsg_data.create_time);
        for (var i = {
            title: e.title0,
            time: m.unix(t).format("YYYY-MM-DD"),
            unix: t,
            author: e.author0,
            nickName: wx.data.nick_name,
            content: e.content0,
            digest: e.digest0,
            img: wx.url("/wxoss/wx_articles/resources/getimgdata?mode=large&source=file&fileId=" + e.fileid0),
            show_cover: e.show_cover_pic0,
            sourceurl: e.sourceurl0
        }, a = [i], n = 1; 8 > n && e["title" + n]; n++)a.push({
            title: e["title" + n],
            time: m.unix(t).format("YYYY-MM-DD"),
            unix: t,
            author: e["author" + n],
            nickName: wx.data.nick_name,
            content: e["content" + n],
            digest: e["digest" + n],
            img: wx.url("/wxoss/wx_articles/resources/getimgdata?mode=large&source=file&fileId=" + e["fileid" + n]),
            show_cover: e["show_cover_pic" + n],
            sourceurl: e["sourceurl" + n]
        });
        return 1 == a.length ? [i] : a;
    }

    var a = e("common/qq/events.js")(!0), n = e("common/wx/phoneView.js"), m = e("biz_common/moment.js"), s = null, d = {
        appmsg: e("tpl/media/preview/appmsg.html.js"),
        card: e("tpl/media/preview/card.html.js"),
        moments: e("tpl/media/preview/moments.html.js"),
        chat: e("tpl/media/preview/chat.html.js")
    };
    t.show = function (t, o) {
        if (s = i(t), s.index = o, 0 != s.length) {
            s[0].date = m.unix(s[0].unix).format("MM月DD日");
            {
                new n({
                    html: e("tpl/media/preview/card.html.js"),
                    data: s.length > 1 ? {
                        list: s,
                        nickName: wx.data.nick_name
                    } : s[0],
                    todo: function () {
                        var e = this;
                        e.$dom.find(".jsPhoneViewPlugin").on("click", ".jsPhoneViewLink", function () {
                            $(this).hasClass("selected") || ($(this).addClass("selected").siblings().removeClass("selected"),
                                "appmsg" == $(this).data("id") ? e.render(d.appmsg, s[o]) : "card" == $(this).data("id") ? s.length > 1 ? e.render(d.card, {
                                    list: s,
                                    nickName: wx.data.nick_name
                                }) : e.render(d.card, s[0]) : "moments" == $(this).data("id") ? e.render(d.moments, s[o]) : "chat" == $(this).data("id") && e.render(d.chat, s[o]));
                        }), e.$dom.on("click", ".jsPhoneViewCard", function () {
                            "undefined" != typeof $(this).data("index") && (o = $(this).data("index")), e.render(d.appmsg, s[o]);
                        }), e.$dom.on("click", ".jsPhoneViewPub", function () {
                            a.trigger("_preview");
                        });
                    }
                });
            }
        }
    };
});