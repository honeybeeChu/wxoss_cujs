define("common/wx/mpEditor/plugin/music.js", ["common/wx/popup.js", "tpl/mpEditor/plugin/music.html.js",
        "tpl/media/dialog/audiomsg_layout.html.js", "common/wx/media/audio.js", "common/wx/pagebar.js", "common/wx/Tips.js"],
    function (i) {
        "use strict";
        function e(i) {
            this.__o = {
                container: ""
            }, this.editor = null, this.__g = {}, this.__init(i), $(i.container).show();
        }

        i("common/wx/popup.js");
        var n = i("tpl/mpEditor/plugin/music.html.js"), t = i("tpl/media/dialog/audiomsg_layout.html.js"), o = i("common/wx/media/audio.js"), c = i("common/wx/pagebar.js"), r = i("common/wx/Tips.js");
        return e.prototype = {
            getName: function () {
                return "insertmusic";
            },
            noCommandReprot: function () {
                return !0;
            },
            getExecCommand: function () {
                var i = this;
                return function () {
                    console.log("insert music "), i.__openMusicPopup();
                };
            },
            getContainer: function () {
                return this.__o.container;
            },
            addListener: function () {
            },
            beforeSetContent: function (i) {
                return i = i.replace(/<qqmusic([^>]*?)js_editor_qqmusic([^>]*?)><\/qqmusic>/g, "<iframe $1js_editor_qqmusic$2></iframe>");
            },
            getPluginData: function (i) {
                for (var e = i.content, n = /<iframe\s(?:[\s\S]*?)musicid\=[\'\"]([\d]*?)[\'\"](?:[\s\S]*?)>/g, t = [], o = "", c = null; null != (c = n.exec(e));)c[1] && -1 == o.indexOf(c[1] + ",") && (t.push(c[1]),
                    o += c[1] + ",");
                return i.music_id = t.join(","), i.content = i.content.replace(/<iframe([^>]*?)js_editor_qqmusic([^>]*?)><\/iframe>/g, "<qqmusic $1js_editor_qqmusic$2></qqmusic>"),
                    i;
            },
            __init: function (i) {
                var e = this.__o;
                for (var n in i)e.hasOwnProperty(n) && (e[n] = i[n]);
            },
            __openMusicPopup: function () {
                this.__initPop(), this.__initPopEvt();
            },
            __initPop: function () {
                var i = this, e = this.__g, t = e._oSelectdSong = {};
                e._oAudioPop = $(n).popup({
                    title: "添加音乐",
                    className: "align_edge qqmusic_dialog",
                    width: "960",
                    buttons: [{
                        text: "确定",
                        type: "primary",
                        click: function () {
                            if (console.log("selected music " + t.mid), console.log(wx.url("/cgi-bin/registertopic?id=" + t.musicid + "&type=1&src=1")),
                                "undefined" != typeof t.musicid) {
                                var n = this, o = n.get().find(".js_btn_p").eq(0);
                                if (o.hasClass("btn_loading"))return;
                                o.btn(0), $.ajax({
                                    url: wx.url("/cgi-bin/registertopic?id=" + t.musicid + "&type=1&src=1"),
                                    type: "post",
                                    dataType: "json",
                                    success: function (c) {
                                        e._oAudioPop && (console.log("success"), console.log(c), o.btn(1), c && "0" == c.base_resp.ret && "undefined" != typeof c.topic_id ? (t.commentid = c.topic_id,
                                            i.__insertMusic(i.__getMusicIframe()), console.log(t), e._oAudioPop = null, n.remove()) : r.err("系统繁忙，请稍后再试"));
                                    }
                                });
                            } else r.err("请选择要插入的音乐");
                        }
                    }, {
                        text: "取消",
                        click: function () {
                            t = i.__g._oSelectdSong = {}, e._oAudioPop = null, this.remove();
                        }
                    }],
                    close: function () {
                        t = i.__g._oSelectdSong = {}, e._oAudioPop = null, this.remove();
                    }
                });
            },
            __insertMusic: function (i) {
                console.log("insertQQMusic");
                var e = this.editor;
                e.execCommand("inserthtml", i, !0), e.funcPvUvReport("insertmusic"), this.__g._oSelectdSong = {};
            },
            __getMusicIframe: function () {
                var i = this.__g._oSelectdSong, e = i.musicid, n = i.mid, t = i.url, o = i.songname, c = i.albumurl, r = i.singername, s = i.play_length, a = i.commentid, u = "/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=" + encodeURIComponent(r) + "&music_name=" + encodeURIComponent(o);
                return ['<iframe class="res_iframe qqmusic_iframe js_editor_qqmusic" scrolling="no" frameborder="0"', ' musicid="' + e + '"', ' mid="' + n + '"', ' albumurl="' + c + '"', ' audiourl="' + t + '"', ' music_name="' + o + '"', ' commentid="' + a + '"', ' singer="' + r + '" ', ' play_length="' + s + '" ', ' src="' + u, '"></iframe>'].join("");
            },
            __initPopEvt: function () {
                this.__initSearch();
            },
            __initSearch: function () {
                var i = this, e = this.__g._oAudioPop;
                e.find("#searchDiv").show(), e.find("#keyInput").keydown(function (i) {
                    var n = "which" in i ? i.which : i.keyCode;
                    13 == n && e.find("#searchBt").trigger("click");
                }), e.find("#searchCloseBt").click(function () {
                    e.find("#keyInput").val("");
                }), e.find("#searchBt").click(function () {
                    var n = e.find("#keyInput").val();
                    n.length > 0 ? i.__QQMusicSearch({
                        keyword: encodeURIComponent(n),
                        perpage: 10,
                        currentpage: 1
                    }) : r.err("请输入搜索条件");
                }), e.find("#reload").click(function () {
                    e.find("#searchCloseBt").trigger("click");
                });
            },
            __QQMusicSearch: function (i) {
                var e = this;
                window.MusicJsonCallback = function (i) {
                    var n = e.__g._oAudioPop;
                    n && (i = e.__formatJsonData(i), n.find("#dialog_audio_container").html(wx.T(t, i)), e.__initMusicfile(),
                        e.__initPageBar({
                            totalnum: i.totalnum,
                            perpage: i.perpage,
                            currentpage: i.curpage
                        }));
                };
                var n = document.head || document.getElementsByTagName("head")[0] || document.documentElement, o = document.createElement("script"), c = ["https://auth-external.music.qq.com/open/fcgi-bin/fcg_weixin_music_search.fcg?remoteplace=txt.weixin.officialaccount&w=", i.keyword, "&platform=weixin&jsonCallback=MusicJsonCallback&perpage=", i.perpage, "&curpage=", i.currentpage].join("");
                console.log("src=" + c), o.type = "text/javascript", o.src = c, n.appendChild(o);
            },
            __formatJsonData: function (i) {
                var e = this, n = $.extend({}, i);
                return n && n.list && $.each(n.list, function (i, n) {
                    var t = n.f.split("|"), o = t[7] || 0, c = t[12] || 0, r = t[0], s = t[t.length - 1], a = t[t.length - 3], u = "/" + s.charAt(s.length - 2) + "/" + s.charAt(s.length - 1) + "/" + s + ".jpg";
                    $.extend(n, {
                        songtime: e.__formatTime(o),
                        songsize: e.__formatSize(c),
                        songid: r,
                        mid: a,
                        albumurl: u,
                        play_length: 1e3 * o
                    });
                }), console.log("formatJsonData"), console.log(n), n;
            },
            __formatTime: function (i) {
                var e = "";
                if (60 > i)e = "00:" + (10 > i ? "0" : "") + i; else {
                    var n = Math.floor(i / 60), t = i - 60 * n;
                    e = (10 > n ? "0" : "") + n + ":" + (10 > t ? "0" : "") + t;
                }
                return e;
            },
            __formatSize: function (i) {
                var e = "";
                return e = i > 1048576 ? parseInt(i / 1048576) + "M" : "1M";
            },
            __initMusicfile: function () {
                var i = this.__g, e = i._oSelectdSong, n = i._oAudioPop;
                n.find(".qqmusic_audioplay").each(function () {
                    var i = $(this), e = i.attr("audioid"), n = i.attr("audiourl"), t = {
                        selector: "#url_" + e,
                        qqmusicurl: n,
                        id: e,
                        qqmusictpl: !0
                    };
                    console.log("initMusicfile"), console.log(t);
                    new o(t);
                }), n.find(".frm_radio").checkbox({
                    multi: !1,
                    onChanged: function (i) {
                        console.log(i), e.musicid = i.val(), e.songname = n.find("#songname_" + e.musicid).html(),
                            e.singername = n.find("#singername_" + e.musicid).html(), e.url = n.find("#url_" + e.musicid).attr("audiourl"),
                            e.mid = n.find("#url_" + e.musicid).attr("mid"), e.albumurl = n.find("#url_" + e.musicid).attr("albumurl"),
                            e.play_length = n.find("#url_" + e.musicid).attr("play_length");
                    }
                });
            },
            __initPageBar: function (i) {
                {
                    var e = this, n = this.__g, t = n._oAudioPop, o = t.find("#keyInput").val(), r = i && i.currentpage, s = i && i.perpage, a = i && i.totalnum;
                    new c({
                        container: "#js_pagebar",
                        perPage: s,
                        initShowPage: r,
                        totalItemsNum: a,
                        first: !1,
                        last: !1,
                        isSimple: !0,
                        callback: function (i) {
                            var n = i.currentPage;
                            n != r && (r = n, e.__QQMusicSearch({
                                keyword: o,
                                perpage: s,
                                currentpage: r
                            }));
                        }
                    });
                }
            }
        }, e;
    });
