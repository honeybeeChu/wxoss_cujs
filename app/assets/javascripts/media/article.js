define("media/article.js", ["common/qq/Class.js", "biz_common/jquery.validate.js", "common/wx/Tips.js", "common/wx/dialog.js"], function (e) {
    "use strict";
    function r(e, r) {
        setTimeout(function () {
            $("html, body").animate({
                scrollTop: $(e).offset().top - (r || 50)
            });
        }, 100);
    }

    function t(e, r) {
        $(e).show().find(".js_msg_content").text(r);
    }

    function i() {
        $("#js_appmsg_editor").find(".js_error_msg").hide();
    }

    var n = e("common/qq/Class.js"), o = e("biz_common/jquery.validate.js"), s = e("common/wx/Tips.js"), _ = (e("common/wx/dialog.js"),
        o.rules), d = wx.cgiData, l = n.declare({
        init: function (e) {
            this.opt = e, this.$dom = $(e.dom), this.data = e.data || {}, this.$item = $(e.item), this.ueditor = e.ueditor,
                this.freeUEditor = e.freeUEditor, this.scrollTop = Math.min($(".main_hd").offset().top, $(".main_bd").offset().top);
        },
        _setEditorContent: function () {
            var e = this, r = e.data;
            e.ueditor.ready(function () {
                e.ueditor.setContent("");
                try {
                    e.ueditor.setContent(r.content);
                } catch (t) {
                    r.content && "" == e.ueditor.getUeditor().getContent() && ((new Image).src = "//mp.weixin.qq.com/mp/jsmonitor?idkey=%s_%s_1&lc=1&log0=[errmsg:%s,uin:%s]".sprintf(28308, 0, t.message, wx.data.uin));
                }
                e.ueditor.setHistory(e.undoHistory);
            });
        },
        _setOriginal: function () {
            var e = this, r = e.data, t = e.$dom, i = $("#js_original");
            i.find(".js_original_type").hide().eq(r.copyright_type || 0).show(), r.copyright_type ? (i.find(".js_original_content").show(),
                i.find(".js_original_publish").val(r.releasefirst), i.find(".js_reprint_frm").val(r.reprint_permit_type),
                i.find(".js_url").text(r.source_url).closest("li")[r.source_url ? "show" : "hide"](),
                i.find(".js_author").text(r.author), i.find(".js_platform").text(+r.releasefirst ? "微信公众平台" : r.platform),
                i.find(".js_frm").text(1 == +r.reprint_permit_type ? "允许转载" : 2 == r.reprint_permit_type ? "授权转载" : "禁止转载"),
                i.find(".js_classify").text(r.original_article_type), t.find(".js_author").closest(".appmsg_edit_item").eq(0).hide(),
                t.find(".js_url_area").hide(), t.find(".js_reward").checkbox("disabled", !1), $("#js_pay").checkbox("disabled", 1 == r.reprint_permit_type),
                1 == r.reprint_permit_type ? i.find(".js_pay_tips").text("（只有“禁止转载”的原创文章才可以设置付费阅读）").show() : i.find(".js_pay_tips").text("（每月可群发10篇付费阅读文章）")) : (i.find(".js_original_content").hide(),
                t.find(".js_author").closest(".appmsg_edit_item").eq(0).show(), t.find(".js_url_area").show(),
                t.find(".js_reward").checkbox("disabled", !0), t.find(".js_reward_div").hide(), $("#js_pay").checkbox("disabled", !0),
                i.find(".js_pay_tips").show().text("（只有“禁止转载”的原创文章才可以设置付费阅读）"), i.find(".js_pay_setting").hide());
        },
        _setPay: function () {
            var e = this, r = e.data, t = e.$dom;
            $("#js_pay").checkbox("checked", !!r.payforread_enabled), t.find(".js_pay_setting")[r.payforread_enabled ? "show" : "hide"]().find(".js_fee").text(r.fee ? (r.fee / 100).toFixed(2) : ""),
                t.find(".js_pay_tips")[r.payforread_enabled ? "hide" : "show"](), e.freeUEditor.val(r.free_content || "").trigger("keydown");
        },
        hideErrorTips: function () {
            this.$dom.find(".js_title_error,.js_author_error,.js_desc_error,.js_cover_error,.js_url_error,.js_content_error,.js_platform_error").hide();
        },
        flush: function () {
            var e = this, r = e.data, t = e.$dom;
            if (t.find(".js_field").each(function () {
                    var e = $(this).attr("name"), t = $(this).attr("type");
                    r[e] = "checkbox" == t ? $(this).checkbox("value") ? 1 : 0 : $.trim($(this).val());
                }), r = e.ueditor.getEditorData(r), r.source_url = r.source_url_checked ? r.source_url : "",
                r.source_url && !/:\/\//.test(r.source_url) && (r.source_url = "http://" + r.source_url),
                1 == d.can_use_hyperlink) {
                var i = r.content.match(/<a([^>]*)>(.*?)<\/a>/g);
                i && (r.link_count = i.length);
            }
            r.isFirst = 0 == e.$item.index(), r.digest = r.digest || r.content.text().html(!1).substr(0, 54);
            var n = t.find("#js_original");
            return r.copyright_type = $(".js_original_type:visible").index(), r.copyright_type = r.copyright_type < 0 ? 0 : r.copyright_type,
            r.copyright_type && (r.releasefirst = n.find(".js_original_publish").val(), r.author = n.find(".js_author").text(),
                r.source_url = n.find(".js_url").text(), r.platform = +r.releasefirst ? "" : n.find(".js_platform").text(),
                r.reprint_permit_type = n.find(".js_reprint_frm").val(), r.original_article_type = n.find(".js_classify").text()),
                r.free_content = this.freeUEditor.val(), r.fee = 100 * t.find(".js_fee").text(), e.scrollTop = Math.max($(window).scrollTop(), $(".main_hd").offset().top),
                e.undoHistory = e.ueditor.getHistory(), this;
        },
        getData: function (e, r) {
            var t = this, i = t.data, n = {}, o = ["title", "content", "digest", "author", "fileid", "music_id", "video_id", "show_cover_pic", "shortvideofileid", "vid_type", "copyright_type", "releasefirst", "platform", "reprint_permit_type", "original_article_type", "can_reward", "reward_wording", "need_open_comment", "sourceurl", "payforread_enabled", "free_content", "fee", "voteid", "voteismlt", "supervoteid", "cardid", "cardquantity", "cardlimit"];
            return $.each(o, function (e, r) {
                switch (r) {
                    case"fileid":
                        n.fileid = i.file_id;
                        break;

                    case"sourceurl":
                        n.sourceurl = i.source_url;
                        break;

                    default:
                        n[r] = i[r];
                }
            }), e ? r ? t.validateStrictly(n) : t.validate(n) : $.extend(!0, {}, i);
        },
        validate: function (e) {
            var n, o = this, d = o.data, l = o.$dom, a = $("<div>").html(e.content), c = !0, u = null, f = "", h = $(a).find(".js_catchremoteimageerror").length;
            if (h)return n = l.find(".js_content_error"), t(n, "正文有%s张图片粘贴失败".sprintf(h)), r(n, 200),
                null;
            if (e.title || e.content || e.fileid || (t(l.find(".js_content_error"), "请先输入一段正文（或者标题），再点击保存按钮。"),
                    o.ueditor.getUeditor().focus(), u = u || ".js_title_error", c = null), _.rangelength(e.title, [0, 64]) || (t(l.find(".js_title_error"), "标题不能为空且长度不能超过64字"),
                    u = u || ".js_title_error", c = null), 0 == e.copyright_type && e.author.len() > 16 && (t(l.find(".js_author_error"), "作者不能超过8个字"),
                    u = u || ".js_author_error", c = null), _.rangelength(e.content, [0, 1e7]) || (t(l.find(".js_content_error"), "正文总大小不得超过10M字节"),
                    u = u || ".js_content_error", c = null), _.rangelength(e.content.text(), [0, 2e4]) || (t(l.find(".js_content_error"), "正文不能为空且长度不能超过20000字"),
                    u = u || ".js_content_error", c = null), d.source_url_checked && "" == e.sourceurl && (l.find(".js_url_error").text("请输入原文链接").show(),
                    u = u || ".js_url", f = f || "请输入原文链接", c = null), 0 == e.copyright_type && e.sourceurl && !_.url(e.sourceurl) && (l.find(".js_url_error").text("链接不合法").show(),
                    u = u || ".js_url", f = f || "链接不合法", c = null), _.rangelength(e.digest, [0, 120]) || (l.find(".js_desc_error").text("摘要长度不能超过120字").show(),
                    u = u || ".js_desc", c = null), 1 != e.can_reward || _.maxlength(e.reward_wording, 15) || (f = f || "赞赏引导语不能超过15个字",
                    c = null), !c)return r(l.find(u), 150), null;
            if (e.payforread_enabled) {
                if (!/\d+(\.\d+)?/.test(e.fee))return s.err("请输入正确的付费金额"), null;
                if ("" == e.free_content)return s.err("请输入免费区域内容"), null;
            }
            return o.ueditor.checkPlugins(a) ? (i(), e) : null;
        },
        validateStrictly: function (e) {
            var i, n = this, o = n.data, d = n.$dom, l = $("<div>").html(e.content), a = !0, c = null, u = "", f = $(l).find(".js_catchremoteimageerror").length;
            if (f)return i = d.find(".js_content_error"), t(i, "正文有%s张图片粘贴失败".sprintf(f)), r(i, 200),
                null;
            if (_.rangelength(e.title, [1, 64]) || (t(d.find(".js_title_error"), "标题不能为空且长度不能超过64字"),
                    c = c || ".js_title_error", a = null), 0 == e.copyright_type && e.author.len() > 16 && (t(d.find(".js_author_error"), "作者不能超过8个字"),
                    c = c || ".js_author_error", a = null), _.rangelength(e.content, [1, 1e7]) || (t(d.find(".js_content_error"), "正文总大小不得超过10M字节"),
                    c = c || ".js_content_error", a = null), _.rangelength(e.content.text(), [1, 2e4]) || (t(d.find(".js_content_error"), "正文不能为空且长度不能超过20000字"),
                    c = c || ".js_content_error", a = null), o.source_url_checked && "" == e.sourceurl && (d.find(".js_url_error").text("请输入原文链接").show(),
                    c = c || ".js_url", u = u || "请输入原文链接", a = null), 0 == e.copyright_type && e.sourceurl && !_.url(e.sourceurl) && (d.find(".js_url_error").text("链接不合法").show(),
                    c = c || ".js_url", u = u || "链接不合法", a = null), e.fileid || "1675779340" != wx.data.uin && "3080043700" != wx.data.uin && (t(d.find(".js_cover_error"), "必须插入一张图片"),
                    c = c || ".js_cover_error", a = null), _.rangelength(e.digest, [0, 120]) || (d.find(".js_desc_error").text("摘要长度不能超过120字").show(),
                    c = c || ".js_desc", a = null), 1 != e.can_reward || _.maxlength(e.reward_wording, 15) || (u = u || "赞赏引导语不能超过15个字",
                    a = null), !a)return r(d.find(c), 150), null;
            if (e.payforread_enabled) {
                if (!/\d+(\.\d+)?/.test(e.fee))return s.err("请输入正确的付费金额"), null;
                if ("" == e.free_content)return s.err("请输入免费区域内容"), null;
            }
            return n.ueditor.checkPlugins(l) ? e : null;
        },
        render: function () {
            var e = this, r = e.$dom, t = e.data, i = 0 == e.$item.index();
            if (t.source_url_checked = "undefined" == typeof t.source_url_checked ? !!t.source_url : t.source_url_checked,
                    r.find(".js_cover_tip").html(i ? "大图片建议尺寸：900像素 * 500像素" : "小图片建议尺寸：200像素 * 200像素"),
                    r.find(".js_field").each(function () {
                        var e = $(this).attr("name"), r = $(this).attr("type");
                        "checkbox" == r ? $(this).checkbox("checked", !!t[e]) : $(this).val(t[e] || "").trigger("blur keydown");
                    }), r.find("input.js_title,input.js_author").trigger("keydown"), r.find("input.js_title,input.js_author").trigger("blur"),
                    r.find("input.js_title").focus(), r.find(".js_comment").checkbox("checked", 0 == t.need_open_comment ? !1 : !0),
                    t.file_id) {
                var n = t.cover || wx.url("/wxoss/wx_articles/resources/getimgdata?mode=large&source=file&fileId=%s>".sprintf(t.file_id));
                r.find(".js_cover").find("img").remove(), r.find(".js_cover").prepend('<img src="%s">'.sprintf(n)).show();
            } else r.find(".js_cover").hide().find("img").remove();
            t.source_url_checked ? r.find(".js_url_area .frm_input_box").show() : r.find(".js_url_area .frm_input_box").hide(),
                1 == t.can_reward ? (r.find(".js_reward").checkbox("checked", !0), r.find(".js_reward_div").show()) : (r.find(".js_reward").checkbox("checked", !1),
                    r.find(".js_reward_div").hide()), e._setEditorContent(), e._setOriginal(), e._setPay();
        }
    });
    return l;
});