define("media/article_list.js", ["common/qq/events.js", "common/qq/Class.js", "common/wx/time.js",
        "biz_web/lib/store.js", "common/wx/Tips.js", "common/wx/dialog.js", "common/wx/popover.js",
        "media/media_cgi.js", "media/article.js", "media/draft.js", "media/report.js",
        "tpl/media/appmsg_edit/article_list_item.html.js", "media/preview.js"],
    function (t) {
        "use strict";
        function e(t) {
            var e = t && t.multi_item;
            return e && e.length ? ($.each(e, function (t, e) {
                $.each(e, function (t, i) {
                    i.html && (e[t] = i.html(!1));
                });
            }), e) : null;
        }

        function i(t, e, i) {
            (e || 1) > _ && $.post("/misc/jslog?1=1" + wx.data.param, {
                id: t,
                level: i || "error",
                content: "[file=media/appmsg_edit]"
            });
        }

        function n(t) {
            for (var e in t)if (t.hasOwnProperty(e) && t[e])return !1;
            return !0;
        }

        var r = t("common/qq/events.js")(!0), s = t("common/qq/Class.js"), a = (t("common/wx/time.js"),
                t("biz_web/lib/store.js")), c = t("common/wx/Tips.js"), o = t("common/wx/dialog.js"),
            l = t("common/wx/popover.js"), d = t("media/media_cgi.js"), u = t("media/article.js"),
            p = t("media/draft.js"), f = t("media/report.js"),
            m = t("tpl/media/appmsg_edit/article_list_item.html.js"),
            h = t("media/preview.js"), g = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
            _ = Math.random(),
            v = function (t, e, i, n) {
                if (t === e)return 0 !== t || 1 / t === 1 / e;
                if (null == t || null == e)return t === e;
                var r = Object.prototype.toString.call(t);
                if (r !== Object.prototype.toString.call(e))return !1;
                switch (r) {
                    case"[object RegExp]":
                    case"[object String]":
                        return "" + t == "" + e;

                    case"[object Number]":
                        return +t !== +t ? +e !== +e : 0 === +t ? 1 / +t === 1 / e : +t === +e;

                    case"[object Date]":
                    case"[object Boolean]":
                        return +t === +e;
                }
                var s = "[object Array]" === r;
                if (!s && ("object" != typeof t || "object" != typeof e))return !1;
                i = i || [], n = n || [];
                for (var a = i.length; a--;)if (i[a] === t)return n[a] === e;
                if (i.push(t), n.push(e), s) {
                    if (a = t.length, a !== e.length)return !1;
                    for (; a--;)if (!v(t[a], e[a], i, n))return !1;
                } else for (var c in t)if (t.hasOwnProperty(c) && (!e.hasOwnProperty(c) || !v(t[c], e[c], i, n)))return !1;
                return i.pop(), n.pop(), !0;
            }, w = s.declare({
                init: function (t) {
                    var i = this;
                    $.extend(!0, i, t), i.opt = t, i.$list = $(t.appmsg_selector), i.gid = 0, i.draft = new p(t.app_id),
                        i.list = i.draft.get() || e(t.appmsg_data), i.lastData = i.list, i.list ? $.each(i.list, function (t, e) {
                        i.add(e);
                    }) : i.add(), i.select(0, 0, 1), i._bindEvent(), i.hasConfirmed = !1;
                },
                _bindEvent: function () {
                    var t = this;
                    $("#js_add_appmsg").on("click", function () {
                        var e = t.add();
                        e && t.select(e.index());
                    }), t.$list.on("click", ".js_appmsg_item", function () {
                        var e = $(this).closest(".js_appmsg_item").index();
                        e != t.$current.index() && t.select(e);
                    }), t.$list.on("click", ".js_del", function () {
                        var e = $(this).closest(".js_appmsg_item").index();
                        t.remove(e);
                    }), t.$list.on("click", ".js_up", function () {
                        var e = $(this).closest(".js_appmsg_item"), i = e.prev();
                        0 == i.index() && (i.find(".first_appmsg_item").hide().siblings().show(), e.find(".first_appmsg_item").show().siblings().hide()),
                            e.insertBefore(i), t._updateTitleTips(), t.$list.children().find(".js_down").show(),
                            t.$list.children().last().find(".js_down").hide();
                    }), t.$list.on("click", ".js_down", function () {
                        var e = $(this).closest(".js_appmsg_item"), i = e.next();
                        0 == e.index() && i.length && (e.find(".first_appmsg_item").hide().siblings().show(), i.find(".first_appmsg_item").show().siblings().hide()),
                            i.insertBefore(e), t._updateTitleTips(), t.$list.children().find(".js_down").show(),
                            t.$list.children().last().find(".js_down").hide();
                    }), $(t.editor_selector).on("click", ".js_removeCover", function () {
                        $(this).parent().hide().find("input").val("").parent().find("img").remove(), t.$current && t.$current.removeClass("has_thumb");
                    }), $("body").on("click", "#js_draft_cancel", function () {
                        return t.draft.clear(), t.draft.isDropped = !0, f.addPvUv("cacelcache"), window.location.reload(),
                            !1;
                    }), $("body").on("click", "#js_import_draft", function () {
                        var e = t.draft.getRaw();
                        e && (t.$list.empty(), $.each(e, function (e, i) {
                            t.add(i);
                        }), t.select(0, 0, 1)), t.draft.showTips(), $("#js_import_tips").hide();
                    }), $("body").on("click", "a", function (e) {
                        var i = $(this).attr("href"), n = $(this).attr("target");
                        if ("_blank" !== n && "string" == typeof i && 0 !== i.indexOf("javascript:") && 0 !== i.indexOf("#")) {
                            var r = t.getData();
                            if (!t.lastData || !v(r, t.lastData)) {
                                e.preventDefault();
                                var s = 1 == wx.cgiData.isNew ? "是否保存当前图文消息内容？" : "是否保存此次修改？";
                                o.show({
                                    type: "info",
                                    msg: s,
                                    buttons: [{
                                        text: "保存",
                                        click: function () {
                                            t.save($("#js_submit"), function () {
                                                c.remove(), $("#js_save_success").show(), location.href = i;
                                            }), this.remove();
                                        }
                                    }, {
                                        text: "不保存",
                                        type: "normal",
                                        click: function () {
                                            window.onbeforeunload = null, location.href = i, this.remove();
                                        }
                                    }]
                                });
                            }
                        }
                    }), t.ueditor.addListener("contentchange", function () {
                        $("#js_import_tips,#js_draft_tips").hide();
                    }), setInterval(function () {
                        var e = t.getData();
                        t.draft.save(e);
                    }, 12e4), window.onbeforeunload = function () {
                        var e = !0, i = t.getData();
                        if (!t.lastData || !v(i, t.lastData)) {
                            for (var n = i.length; n-- > 0;)if (i[n]) {
                                e = !1;
                                break;
                            }
                            return e || t.draft.isDropped ? void t.draft.clear() : (t.draft.save(i), "--------------------------------------------\n为确保内容不丢失\n建议点击页面底部的绿色保存按钮后再离开\n--------------------------------------------");
                        }
                    }, r.on("_preview", function () {
                        t._preview();
                    });
                },
                _updateTitleTips: function () {
                    var t = 0;
                    this.$list.children().each(function () {
                        var e = $(this);
                        e.data("msgindex", t), e.children().attr("title", "第%s篇图文".sprintf(g[t])), t++;
                    });
                },
                _checkRemoteImage: function (t, e, i) {
                    var n = this, r = n.ueditor.getDocument(), s = $(r).find(".js_catchingremoteimage"), a = s.length;
                    return 0 == a ? void i() : void s.on("catchremotesuccess", function (t, r) {
                        $(this).off("catchremotesuccess").off("catchremoteerror");
                        var s = r.source, c = r.type, o = n.$current.index(), l = "img" == c ? $(this).attr("src") : $(this).css("background-image").replace(/^(url\()|(\))$/g, "");
                        l = l.replace(/https:\/\/mmbiz\.qlogo\.cn\//g, "http://mmbiz.qpic.cn/");
                        var d = new RegExp("img" == c ? '<img[^>]*?\\s+data-src="%s"[^>]*\\/?>'.sprintf(s) : '<\\w([^>]*?)\\s+style="[^"]*?;?\\s*(background|background-image)\\s*\\:[^;]*?url\\([\'"]?%s[\'"]?\\)[^"]*?"([^>]*?)>'.sprintf(s)), u = e["content" + o].match(d);
                        u = u && u[0] || "", u = u.replace(s, l).replace("js_catchingremoteimage", ""), e["content" + o] = e["content" + o].replace(d, u),
                        0 == --a && i();
                    }).on("catchremoteerror", function () {
                        s.off("catchremotesuccess").off("catchremoteerror"), t.btn(!0);
                    });
                },
                add: function (t) {
                    var e = this, i = e.$list.children().length;
                    if (i >= e.maxNum)return void c.err("你最多只可以加入%s条图文消息".sprintf(e.maxNum));
                    i == e.maxNum - 1 && e.$list.parent().siblings("a").hide(), t = $.extend({
                        id: e.gid++,
                        title: "",
                        title_tips: "",
                        msg_index: i,
                        author: "",
                        file_id: "",
                        digest: "",
                        content: "",
                        source_url: "",
                        isFirst: 0 == e.$list.children().length
                    }, t), t.title_tips = "第%s篇图文".sprintf(g[i]), t.msg_index = i, t.file_id && t.cover;
                    var n = $.parseHTML(wx.T(m, t))[0], r = $(n).appendTo(e.$list), s = new u({
                        dom: e.opt.editor_selector,
                        data: t,
                        item: r,
                        ueditor: e.ueditor,
                        freeUEditor: e.freeUEditor
                    });
                    return r.data("article", s), $(".js_scrollbar").scrollbar.updateScrollbars(!0), e.$list.children().find(".js_down").show(),
                        e.$list.children().last().find(".js_down").hide(), r;
                },
                remove: function (t) {
                    var e = this, i = e.$list.children().eq(t), r = i.data("article").flush();
                    n(r.data) ? e.drop(t) : (i.find(".appmsg_edit_mask").css("display", "block"), new l({
                        dom: i.find(".js_del"),
                        content: "确定删除此篇图文？",
                        buttons: [{
                            text: "确定",
                            click: function () {
                                e.drop(t), this.remove();
                            },
                            type: "primary"
                        }, {
                            text: "取消",
                            click: function () {
                                i.find(".appmsg_edit_mask").css("display", ""), this.remove();
                            }
                        }]
                    }));
                },
                drop: function (t) {
                    var e = this;
                    e.select(Math.max(0, t - 1)), e.$list.children().eq(t).remove(), e.$list.parent().siblings("a").show(),
                        e.$list.children().find(".js_down").show(), e.$list.children().last().find(".js_down").hide(),
                        $(".js_scrollbar").scrollbar.updateScrollbars(!0), e._updateTitleTips();
                },
                select: function (t, e, i) {
                    var n = this, r = "number" != typeof t ? t : n.$list.find(".js_appmsg_item").eq(t);
                    r.addClass("current");
                    var s = null;
                    if (r.siblings().removeClass("current"), n.$current) {
                        if (t == n.$current.index())return;
                        s = n.$current.data("article"), s && s.flush(), n._checkRepeat();
                    }
                    s = r.data("article"), s && (!e && s.hideErrorTips(), s.render(), n.$current = r), i || setTimeout(function () {
                        $(window).scrollTop(s.scrollTop);
                    }, 100), $("#js_appmsg_upload_cover").siblings("ul").hide();
                },
                _checkRepeat: function () {
                    try {
                        var t = function (t, e, i) {
                            var n = {};
                            return t = $.extend(t, e), $.each(i, function (e, i) {
                                n[i] = t[i];
                            }), n;
                        }, e = this, i = e.$current.index(), n = e.$current.data("article").data, r = ["author", "digest", "file_id", "source_url", "title", "content"], s = t({}, n, r);
                        if ("" == n.content || "" == n.title)return;
                        var a = !0;
                        if ($.each(r, function (t, e) {
                                s[e] && (a = !1);
                            }), a)return;
                        e.$list.find(".js_appmsg_item").each(function (n) {
                            if (n != i) {
                                var a = t({}, $(this).data("article").data, r);
                                v(s, a) && ((new Image).src = "//mp.weixin.qq.com/mp/jsmonitor?idkey=%s_%s_1&lc=1&log0=[repeat][appid:%s,idx:%s,bizuin:%s]".sprintf(28308, 1, e.app_id || 0, n, wx.data.uin));
                            }
                        });
                    } catch (c) {
                    }
                },
                getData: function (t, e) {
                    var i = this, n = [], r = null, s = i.$current;
                    s && (r = s.data("article"), r && r.flush());
                    var a = !0;
                    return i.$list.find(".js_appmsg_item").each(function (r) {
                        var s = $(this).data("article");
                        if (s) {
                            var c = s.getData(t, e);
                            return null == c ? (i.select(r, !0, !0), a = !1, !1) : void n.push(c);
                        }
                    }), a && n;
                },
                getPostData: function (t) {
                    var e = this, i = e.getData(!0, t);
                    if (!i)return null;
                    var n = {
                        AppMsgId: e.app_id,
                        count: i.length
                    };
                    return $.each(i, function (t, e) {
                        var i = {};
                        $.each(e, function (e, n) {
                            i[e + t] = n;
                        }), $.extend(n, i);
                    }), n;
                },
                update: function (t, e, i) {
                    t && t.length > 0 && t[i] && e.setContent(t[i], !1);
                },
                save: function (t, e, n, r, s, a) {
                    var l = 0, u = this;
                    try {
                        l = 3;
                        var f = u.getData();
                        l = 4;
                        var m = u.getPostData(n || a);
                        if (l = 5, !m)return;
                        u.hasConfirmed && (u.hasConfirmed = !1, m.confirm = 1), t.btn(!1), i(30, .1, "error"),
                            u._checkRemoteImage(t, m, function () {
                                i(31, .1, "error"), d.appmsg.save(!0, 10, m, function (i) {
                                    t.btn(!0), u.draft.clear(), u.draft = new p(i.appMsgId), u.app_id = i.appMsgId, u.lastData = f,
                                        u.update(i.filtered_content_html, r, s), e(i, m);
                                }, function (e, i) {
                                    switch (t.btn(!0), 0 != e && u.select(1 * e), +i) {
                                        case 412:
                                            c.err("图文中含非法外链");
                                            break;

                                        case 153007:
                                            o.show({
                                                width: 750,
                                                type: "warn",
                                                msg: "很抱歉，原创声明不成功|你的文章内容未达到声明原创的要求，满足以下任一条件可发起声明：<br />1、文章文字大于300字<br />2、文章文字小于300字，视频均为你已成功声明原创的视频<br />3、文章文字小于300字，无视频，图片（包括封面图）均为你已成功声明原创的图片",
                                                buttons: [{
                                                    text: "确定",
                                                    click: function () {
                                                        this.remove();
                                                    }
                                                }]
                                            });
                                            break;

                                        case 153008:
                                            o.show({
                                                width: 750,
                                                type: "warn",
                                                msg: "很抱歉，原创声明不成功|你的文章内容少于300字，未达到申请原创内容声明的字数要求。",
                                                buttons: [{
                                                    text: "确定",
                                                    click: function () {
                                                        this.remove();
                                                    }
                                                }]
                                            });
                                            break;

                                        case 153009:
                                            o.show({
                                                width: 750,
                                                type: "warn",
                                                msg: "很抱歉，原创声明不成功|你的文章内容未达到声明原创的要求，满足以下任一条件可发起声明：<br />1、文章文字大于300字<br />2、文章文字小于300字，无视频，图片（包括封面图）均为你已成功声明原创的图片",
                                                buttons: [{
                                                    text: "确定",
                                                    click: function () {
                                                        this.remove();
                                                    }
                                                }]
                                            });
                                            break;

                                        case 153010:
                                            o.show({
                                                width: 750,
                                                type: "warn",
                                                msg: "很抱歉，原创声明不成功|你的文章内容未达到声明原创的要求，满足以下任一条件可发起声明：<br />1、文章文字大于300字<br />2、文章文字小于300字，视频均为你已成功声明原创的视频",
                                                buttons: [{
                                                    text: "确定",
                                                    click: function () {
                                                        this.remove();
                                                    }
                                                }]
                                            });
                                            break;

                                        case 15801:
                                        case 15802:
                                        case 15803:
                                        case 15804:
                                        case 15805:
                                        case 15806:
                                            o.show({
                                                type: "warn",
                                                msg: "图文消息中含有诱导分享内容|为保证用户体验，微信公众平台禁止发布各种诱导分享行为。你所编辑的图文消息可能涉及诱导分享内容。<br/>                                你可以继续保存和发布该图文消息，若发布后被举报并核实确有诱导分享行为，公众平台将根据规定进行处理。<br/>                                <a href='https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3' target='_blank'>诱导分享违规行为说明</a>",
                                                buttons: [{
                                                    text: n ? "继续预览" : "继续保存",
                                                    click: function () {
                                                        this.remove(), u.hasConfirmed = !0, t.trigger("click");
                                                    }
                                                }, {
                                                    text: "取消",
                                                    type: "normal",
                                                    click: function () {
                                                        this.remove();
                                                    }
                                                }]
                                            });
                                    }
                                });
                            }), l = 6;
                    } catch (h) {
                        l && ((new Image).src = "//mp.weixin.qq.com/mp/jsmonitor?idkey=%s_%s_1&lc=1&log0=[errmsg:%s,appid:%s,bizuin:%s]".sprintf(28308, l, h.message, u.app_id || 0, wx.data.uin));
                    }
                },
                preview: function (t) {
                    var e = this;
                    e.save($("#js_preview"), function () {
                        for (var i = e.getPostData(), n = 0; 8 > n; n++)i["content" + n] && (i["content" + n] = t.handlerContent(i["content" + n]));
                        h.show(i, e.$current.data("id"));
                    }, !0, t, e.$current.data("id"));
                },
                _preview: function () {
                    var t = this, e = t.getPostData();
                    if (e) {
                        for (var i = 0, n = 0; n < e.count; n++)if (e["copyright_type" + n]) {
                            i = 1;
                            break;
                        }
                        var r = null, s = null, l = [];
                        if (a.get(wx.data.uin + "previewAccounts"))try {
                            l = a.get(wx.data.uin + "previewAccounts").split("|");
                        } catch (u) {
                            l = [];
                        }
                        var p = $(template.render("previewTpl", {
                            label: "请输入微信号，此图文消息将发送至该微信号预览。",
                            tips: 1 == i ? "本文申请的原创声明还未经平台审核，故预览不会出现原创标识。" : "",
                            accounts: l
                        })).popup({
                            title: "发送预览",
                            className: "simple label_block",
                            onOK: function () {
                                var i = this, n = i.get(), u = n.find(".frm_input"), p = u.val().trim();
                                if (e.preusername = p, 0 == p.length)return $(".jsAccountFail").text("请输入预览的账号").show(),
                                    !0;
                                if (null != r && r.getCode().trim().length <= 0)return c.err("请输入验证码"), r.focus(), !0;
                                var f = n.find(".btn_primary>.js_btn").btn(!1);
                                e.imgcode = r && r.getCode().trim();
                                return t.hasConfirmed && (e.confirm = 1), c.remove(), t.draft.isDropped = !0, e.is_preview = 1,
                                    d.appmsg.preview(!0, 10, e, function () {
                                        i.hide(), setTimeout(function () {
                                            f.btn(!0);
                                        }, 500);
                                        var t = [];
                                        l.each(function (i) {
                                            i != e.preusername && t.push(i);
                                        }), l = t, l.length < 3 ? l.push(e.preusername) : (l.shift(), l[2] = e.preusername), a.set(wx.data.uin + "previewAccounts", l.join("|"));
                                    }, function (e) {
                                        if (n.find(".jsAccountFail").text(e.word).show(), f.btn(!0), u.focus(), e) {
                                            if (!e || "-6" != e.ret && "-8" != e.ret || (s = n.find(".js_verifycode"), r = s.html("").removeClass("dn").verifycode().data("verifycode"),
                                                    r.focus()), e && e.antispam && t.select(1 * e.msg), "412" == e.ret)return void $(".jsAccountFail").text("图文中含非法外链").show();
                                            switch (+e.ret) {
                                                case 412:
                                                    n.find(".jsAccountFail").text("图文中含非法外链").show();
                                                    break;

                                                case 15801:
                                                case 15802:
                                                case 15803:
                                                case 15804:
                                                case 15805:
                                                case 15806:
                                                    i.hide(), o.show({
                                                        type: "warn",
                                                        msg: "图文消息中含有诱导分享内容|为保证用户体验，微信公众平台禁止发布各种诱导分享行为。你所编辑的图文消息可能涉及诱导分享内容。<br/>                                    你可以继续保存和发布该图文消息，若发布后被举报并核实确有诱导分享行为，公众平台将根据规定进行处理。<br/>                                    <a href='https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3' target='_blank'>诱导分享违规行为说明</a>",
                                                        buttons: [{
                                                            text: "继续发送",
                                                            click: function () {
                                                                this.remove(), t.hasConfirmed = !0, f.trigger("click");
                                                            }
                                                        }, {
                                                            text: "取消",
                                                            type: "normal",
                                                            click: function () {
                                                                this.remove();
                                                            }
                                                        }]
                                                    });
                                            }
                                        }
                                    }), !0;
                            }
                        });
                        p.find(".jsAccount").click(function () {
                            $(this).hasClass("selected") ? ($(this).removeClass("selected"), $(".jsAccountInput").val("")) : ($(this).addClass("selected"),
                                $(".jsAccountInput").val($(this).data("value")));
                        }), p.find(".jsAccountInput").keyup(function (t) {
                            $(".jsAccountFail").hide(), $(".jsAccount").removeClass("selected");
                            var e = "which" in t ? t.which : t.keyCode;
                            13 == e && $(this).parents(".dialog").find("button:eq(0)").trigger("click");
                        }).placeholder(), p.find(".jsAccountDel").click(function () {
                            var t = $(this).data("index");
                            return l.length > t && l.splice(t, 1), $(this).parent().remove(), a.set(wx.data.uin + "previewAccounts", l.join("|")),
                                !1;
                        }), l.length > 0 && p.find(".jsAccount").last().click();
                    }
                }
            });
        return w;
    });
