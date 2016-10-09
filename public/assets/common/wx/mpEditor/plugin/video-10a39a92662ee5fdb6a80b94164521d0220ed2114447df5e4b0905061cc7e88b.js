define("common/wx/mpEditor/plugin/video.js", ["common/wx/mpEditor/editor_all_min.js", "common/wx/Tips.js", "common/wx/media/videoDialog.js"], function (e) {
    "use strict";
    function i(e, i, t, r, o, n, a) {
        return o ? "<iframe " + (a ? "class='" + a + "'" : "") + ' style="position:relative; z-index:1;" height=' + t + " width=" + i + ' frameborder=0 src="' + e + '" allowfullscreen></iframe><br/>' : (n ? "<p " + ("none" != r ? "center" == r ? ' style="text-align:center;" ' : ' style="float:"' + r : "") + ">" : "") + '<img align="' + r + '" width="' + i + '" height="' + t + '" _url="' + e + '" class="edui-faked-video" src="' + me.options.UEDITOR_HOME_URL + 'themes/default/images/spacer.gif" style="background:url(' + me.options.UEDITOR_HOME_URL + 'themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;" />' + (n ? "</p>" : "");
    }

    e("common/wx/mpEditor/editor_all_min.js");
    var t = e("common/wx/Tips.js"), r = e("common/wx/media/videoDialog.js"), o = wx.cgiData, n = function (e) {
        this.domid = e.container;
        var i = (this.container = $(e.container).show(), this);
        i.report_vid_type = [];
    };
    return n.prototype = {
        getName: function () {
            return "insertvideo";
        },
        noCommandReprot: function () {
            return !0;
        },
        getExecCommand: function () {
            var e = this;
            return function () {
                var i = e.editor, n = this;
                if (i) {
                    var a = i.getDocument();
                    $(a).find("iframe.video_iframe").length < 3 ? new r({
                        can_use_shortvideo: !!(wx && wx.acl && wx.acl.msg_acl && wx.acl.msg_acl.can_use_shortvideo),
                        can_use_txvideo: wx.cgiData.can_use_txvideo,
                        scene: "ueditor",
                        onOK: function (t, r) {
                            if (e.report_vid_type.push(15 == t || 21 == t ? "1" : "0"), 21 == t) {
                                var a = "//mp.weixin.qq.com/mp/getcdnvideourl?__biz=%s&cdn_videoid=%s&thumb=%s".sprintf(o.biz_uin, encodeURIComponent(r.video_cdn_id), encodeURIComponent(r.video_thumb_cdn_url)), s = a + "&shortvideo_sn=" + o.shortvideo_sn, d = '<iframe data-shortvideofileid="%s" class="video_iframe video_small_iframe" style="height:240px;width:320px !important;" frameborder=0 scrolling="no" src="%s" data-src="%s" allowfullscreen></iframe><br/>'.sprintf(r.file_id, s, a);
                                i.execCommand("inserthtml", d, !0), i.funcPvUvReport("wxvideo");
                            } else 15 == t ? (r.height = 375, r.width = 500, r.vid = r.content, r.url = "https://v.qq.com/iframe/preview.html?vid=" + r.vid + "&width=500&height=375&auto=0",
                                e.doCommand(n, "insertvideo", r), i.funcPvUvReport("mpvideo")) : (e.doCommand(n, "insertvideo", r),
                                i.funcPvUvReport("qqvideo"));
                            return !0;
                        }
                    }) : t.err("最多添加3个小视频、腾讯视频或微视频");
                }
            };
        },
        doCommand: function (e, t, r) {
            console.log("insert video");
            var o = e;
            r = UE.utils.isArray(r) ? r : [r];
            for (var n, a = [], s = 0, d = r.length; d > s; s++)n = r[s], a.push(i(n.url, n.width || 420, n.height || 280, n.align || "none", !0, !0, "video_iframe"));
            o.execCommand("inserthtml", a.join(""), !0);
            var c = document.createElement("div");
            c.className = "js_vid", c.setAttribute("name", n.vid), document.getElementsByTagName("body")[0].appendChild(c);
        },
        check: function (e) {
            var i = $(e).find("iframe"), r = 0;
            return $.each(i, function (e, i) {
                $(i).hasClass("video_iframe") && r++;
            }), r > 3 ? (t.err("最多添加3个小视频、腾讯视频或微视频"), !1) : !0;
        },
        getContainer: function () {
            return this.domid;
        },
        getQueryCommandState: function () {
            return function () {
                var e = this, i = e.selection.getRange().getClosedNode(), t = i && "edui-faked-video" == i.className;
                return t ? 1 : 0;
            };
        },
        getPluginData: function (e) {
            e.content = e.content.replace(/<iframe([^>]*?)(\s)+src=\"https:\/\/v\.qq\.com\/iframe/g, '<iframe$1 data-src="https://v.qq.com/iframe'),
                e.content = e.content.replace(/<iframe([^>]*?)(\s)+src=\"http:\/\/z\.weishi\.com\/weixin\/player\.html/g, '<iframe$1 data-src="http://z.weishi.com/weixin/player.html'),
                e.content = e.content.replace(/<iframe (data-shortvideofileid[^>]*?)\ssrc=\"([^\"]+)\"([^>]*)>/g, "<iframe $1$3>"),
                e.content = e.content.replace(/<iframe ([^>]*)\ssrc=\"([^\"]+)\"([^>]*data-shortvideofileid[^>]*)>/g, "<iframe $1$3>");
            for (var i = /src\=(\'|\")https\:\/\/v\.qq\.com\/iframe\/preview\.html\?(.*?)vid\=([^&]+)/g, t = [], r = "", o = null; null != (o = i.exec(e.content));)o[3] && -1 == r.indexOf(o[3] + ",") && (t.push(o[3]),
                r += o[3] + ",");
            e.video_id = t.join(",");
            for (var n = /<iframe data-shortvideofileid="(\d+)"[^>]+><\/iframe>/g, a = [], s = null; s = n.exec(e.content);)a.push(s[1]);
            return e.shortvideofileid = a.join("|"), this.report_vid_type.length && (e.vid_type = this.report_vid_type.join(",")),
                e;
        },
        beforeSetContent: function (e) {
            return e = e.replace(/<iframe (data-shortvideofileid[^>]*?data\-src=\")([^\"]+)(\")([^>]*)>/g, '<iframe $1$2$3 src="%s" $4>'.sprintf("%s&shortvideo_sn=%s".sprintf("$2", wx.cgiData.shortvideo_sn))),
                e = e.replace(/<iframe ([^>]*data\-src=\")([^\"]+)(\")([^>]*data-shortvideofileid[^>]*)>/g, '<iframe $1$2$3 src="%s" $4>'.sprintf("%s&shortvideo_sn=%s".sprintf("$2", wx.cgiData.shortvideo_sn))),
                e = e.replace(/<iframe([^>]*?)data\-src=\"https:\/\/v\.qq\.com\/iframe/g, '<iframe$1src="https://v.qq.com/iframe'),
                e = e.replace(/<iframe([^>]*?)data\-src=\"http:\/\/z\.weishi\.com\/weixin\/player\.html/g, '<iframe$1src="http://z.weishi.com/weixin/player.html');
        }
    }, n;
});
