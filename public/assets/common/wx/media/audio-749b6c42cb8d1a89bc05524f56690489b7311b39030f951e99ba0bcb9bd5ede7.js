define("common/wx/media/audio.js", ["biz_web/lib/soundmanager2.js", "tpl/media/audio.html.js", "tpl/media/qqmusicaudio.html.js", "widget/media.css", "common/qq/Class.js", "biz_common/moment.js"], function (i, s, t) {
    "use strict";
    var e = wx.T, o = i("biz_web/lib/soundmanager2.js"), n = i("tpl/media/audio.html.js"), d = i("tpl/media/qqmusicaudio.html.js"), l = (i("widget/media.css"),
        i("common/qq/Class.js")), u = i("biz_common/moment.js"), a = null, m = null, h = "wxAudioPlaying", c = function () {
        m = o, m.setup({
            url: "/mpres/zh_CN/htmledition/plprecorder/biz_web/",
            preferFlash: !1,
            debugMode: !1
        });
    };
    $(window).load(function () {
        c();
    });
    var r = {
        id: "",
        source: "",
        file_id: ""
    }, f = l.declare({
        init: function (i) {
            var s = this;
            $.extend(!0, s, r, i), this.soundId = this.id || this.file_id, this.title = this.title || this.name,
                this.play_length = "undefined" == typeof this.play_length || 0 == this.play_length ? "未知时长" : u.unix(this.play_length / 1e3).format("mm:ss");
            var t;
            t = $(this.qqmusictpl ? e(d, s) : e(n, s)), s.dom = $(i.selector).append(t).data("opt", i), t.click(function () {
                s.toggle();
            });
        },
        getAudioURL: function () {
            if (this.qqmusicurl)return this.qqmusicurl;
            var i = this.source, s = this.id, t = this.file_id;
            return i && (i = "&source=" + i), wx.url(this.voice_encode_fileid ? "https://res.wx.qq.com/voice/getvoice?mediaid=" + this.voice_encode_fileid : "/cgi-bin/getvoicedata?msgid={id}&fileid={fileid}{source}".format({
                id: s,
                fileid: t,
                source: i
            }));
        },
        isPlaying: function () {
            return null != a && this == a;
        },
        toggle: function () {
            this.isPlaying() ? this.stop() : (a && a.stop(), this.play());
        },
        play: function (i) {
            var s = this;
            this.isPlaying() || (this.dom.addClass(h), !!a && a.dom.removeClass(h), a = this, this.sound || (!m && c(),
                this.sound = m.createSound({
                    id: s.soundId,
                    url: s.getAudioURL(),
                    onfinish: function () {
                        a && (a.dom.removeClass(h), a = null);
                    },
                    onload: function (i) {
                        i || m.unload(s.soundId), !i && a && (a.dom.removeClass(h), a.sound = null, a = null);
                    }
                })), m.play(this.soundId), i && i(this));
        },
        stop: function (i) {
            this.isPlaying() && (a = null, this.dom.removeClass(h), m.stop(this.soundId), i && i(this));
        }
    });
    t.exports = f;
});
