define("media/appmsg_edit_v2.js", ["biz_web/ui/jquery.scrollbar.js", "common/qq/Class.js",
        "biz_web/utils/upload.js", "biz_web/ui/checkbox.js", "common/wx/inputCounter.js", "common/wx/Step.js",
        "biz_web/ui/dropdown.js", "common/wx/tooltips.js", "biz_common/jquery.validate.js", "common/wx/Tips.js",
        "biz_common/moment.js", "common/wx/media/imageDialog.js", "common/wx/preview.js", "common/wx/dialog.js",
        //"common/wx/mpEditor/plugin/music.js", "common/wx/mpEditor/plugin/vote.js",
        //"common/wx/mpEditor/plugin/card.js", "common/wx/mpEditor/plugin/shop.js",
        "common/wx/mpEditor/plugin/link.js", "common/wx/mpEditor/plugin/unlink.js",
        //"common/wx/mpEditor/plugin/audio.js", "common/wx/mpEditor/plugin/video.js",
        "common/wx/mpEditor/plugin/img.js", "common/wx/mpEditor/editor.js",
        "tpl/media/appmsg_edit/article.html.js", "media/article_list.js", "media/media_static_data.js",
        "media/report.js", "common/wx/ban.js"],
    function (e) {
        "use strict";
        function i(e, i, t) {
            (i || 1) > D && $.post("/misc/jslog?1=1" + wx.data.param, {
                id: e,
                val: 1,
                level: t || "error",
                content: "[file=media/appmsg_edit]"
            });
        }

        e("biz_web/ui/jquery.scrollbar.js");
        var t, s = e("common/qq/Class.js"),
            n = e("biz_web/utils/upload.js"),
            o = (e("biz_web/ui/checkbox.js"),
                e("common/wx/inputCounter.js")),
            r = e("common/wx/Step.js"),
            a = e("biz_web/ui/dropdown.js"),
            d = e("common/wx/tooltips.js"),
            c = e("biz_common/jquery.validate.js").rules,
            l = e("common/wx/Tips.js"),
            _ = e("biz_common/moment.js"),
            p = e("common/wx/media/imageDialog.js"),
            h = e("common/wx/preview.js"),
            u = (e("common/wx/dialog.js"),
                e("common/wx/mpEditor/plugin/music.js")),
            f = e("common/wx/mpEditor/plugin/vote.js"),
            m = e("common/wx/mpEditor/plugin/card.js"),
            j = (e("common/wx/mpEditor/plugin/shop.js"),
                e("common/wx/mpEditor/plugin/link.js")),
            g = e("common/wx/mpEditor/plugin/unlink.js"),
            w = e("common/wx/mpEditor/plugin/audio.js"),
            b = e("common/wx/mpEditor/plugin/img.js"),
            v = e("common/wx/mpEditor/plugin/video.js"),
            x = e("common/wx/mpEditor/editor.js"),
            y = e("tpl/media/appmsg_edit/article.html.js"),
            k = e("media/article_list.js"),
            E = e("media/media_static_data.js"),
            C = e("media/report.js"),
            q = E.URL_PLATFORM_MAP,
            L = E.article_type,
            z = e("common/wx/ban.js"),
            I = wx.cgiData;
        !function (e) {
            e.fn.placeholder2 = function () {
                if (!("placeholder" in document.createElement("input"))) {
                    var i = e(this).siblings(".tips_global");
                    e(this).on("focus", function () {
                        i.hide();
                    }).on("blur", function () {
                        "" === this.value ? i.show() : i.hide();
                    }).trigger("blur");
                }
            }, e.extend(e.easing, {
                easeOutCubic: function (e, i, t, s, n) {
                    return s * ((i = i / n - 1) * i * i + 1) + t;
                }
            });
        }(jQuery);
        {
            var D = Math.random(), U = s.declare({
                init: function (e) {
                    var i = this;
                    i.opt = e, $.extend(!0, i, e), i.$editor = $(i.editor_selector).html(wx.T(y, {
                        can_use_copyright: I.can_use_copyright,
                        can_use_reward: I.can_use_reward,
                        can_use_payforread: I.can_use_payforread,
                        can_use_comment: I.can_use_comment,
                        has_invited_original: I.has_invited_original,
                        orginal_apply_stat: I.orginal_apply_stat,
                        token: wx.data.t
                    })), i._initUEditor(), i._bindEvent(), $(".js_scrollbar").scrollbar({
                        autoUpdate: !1
                    });
                },
                _initEditArea: function () {
                    var e = this, i = e.$editor;
                    i.find(".js_field").each(function () {
                        {
                            var e = $(this).attr("name");
                            $(this).attr("keyup");
                        }
                        $(this).on("keyup", function () {
                            i.find(".js_%s_error".sprintf(e)).hide();
                        });
                    }), i.find(".js_title").on("keyup", function () {
                        var t = $.trim($(this).val()).html(!0), s = e.articleList.$current;
                        s && s.find(".js_appmsg_title").html(t || "标题"), i.find(".js_title_error").hide(), $("#js_draft_tips").hide();
                    }).on("focus", function () {
                        e.ueditor.disableToolbar(), $(this).siblings("em").show();
                    }).on("blur", function () {
                        $(this).parent().hasClass("warn") || $(this).siblings("em").hide();
                    }).placeholder2(), i.find(".js_author").on("focus", function () {
                        e.ueditor.disableToolbar(), $(this).siblings("em").show();
                    }).on("blur", function () {
                        $(this).parent().hasClass("warn") || $(this).siblings("em").hide();
                    }).on("keyup", function () {
                        $("#js_draft_tips").hide();
                    }).placeholder2(), i.find(".js_desc").on("keyup", function () {
                        var t = $.trim($(this).val()).html(!0), s = e.articleList.$current;
                        s && s.find(".appmsg_desc").html(t), i.find(".js_desc_error").hide();
                    }), i.find(".js_show_cover_pic").checkbox({
                        multi: !0
                    }), i.find(".js_comment").checkbox({
                        multi: !0
                    }), i.find(".js_url_checkbox").checkbox({
                        multi: !0,
                        onChanged: function (t) {
                            t.checkbox("value") ? (i.find(".js_url_area .frm_input_box").show(), e.ueditor.funcPvUvReport("showlink")) : (i.find(".js_url_area .frm_input_box").hide(),
                                e.ueditor.funcPvUvReport("hidelink")), i.find(".js_url_error").hide();
                        }
                    }), i.find(".js_reward").checkbox({
                        multi: !0,
                        onChanged: function (e) {
                            e.checkbox("value") ? (e.checkbox("checked", !1), $("#tpl_reward_statement").popup({
                                title: "文章赞赏须知",
                                width: 960,
                                buttons: [{
                                    text: "确定",
                                    type: "primary",
                                    click: function () {
                                        e.checkbox("checked", !0), i.find(".js_reward_div").show(), this.remove();
                                    }
                                }, {
                                    text: "取消",
                                    click: function () {
                                        this.remove();
                                    }
                                }]
                            })) : i.find(".js_reward_div").hide();
                        }
                    }), e._initUploadCover(), i.find(".js_counter").each(function () {
                        $(this).hasClass("js_author") ? new o(this, {
                            maxLength: $(this).attr("max-length"),
                            useGBKLength: !0,
                            GBKBased: !0
                        }) : new o(this, {
                            maxLength: $(this).attr("max-length")
                        });
                    }),
                        e._initOriginal(), e._initPay();
                },
                _initUploadCover: function () {
                    var e, t = this, s = t.$editor;
                    n.uploadImageLibFile({
                        multi: !1,
                        type: 2,
                        doublewrite: !0,
                        container: "#js_appmsg_upload_cover",
                        onSelect: function () {
                            e = t.articleList.$current.index();
                        },
                        onComplete: function (i, n, o, r, a) {
                            if (!r.base_resp || 0 == r.base_resp.ret) {
                                var d = r.file_id,
                                    c = r.content,
                                    l = t.articleList.$current;
                                if (e == l.index())
                                    s.find(".js_cover").find("img").remove(),
                                        s.find(".js_cover").show().prepend('<img src="%s">'.sprintf(c)).find("input").val(d);
                                else {
                                    l = t.articleList.$list.children().eq(e);
                                    var a = l.data("article").data;
                                    a && (a.file_id = d);
                                }
                                l && (l.find("img.js_appmsg_thumb").attr("src", c), l.find("div.js_appmsg_thumb").css("backgroundImage", 'url("' + c + '")'),
                                    l.addClass("has_thumb")), s.find(".js_cover_error").hide();
                            }
                        }
                    }), $("#js_imagedialog").on("click", function () {
                        document.body.style.overflow = document.documentElement.style.overflow = "hidden", p({
                            scene: "biz",
                            maxSelect: 1,
                            desc: "建议尺寸：900像素 * 500像素",
                            onOK: function (e) {
                                //var n = e[0].file_id, o = wx.url("/cgi-bin/getimgdata?mode=large&source=file&fileId=%s".sprintf(n));
                                var n = e[0].file_id, o = e[0].url;
                                s.find(".js_cover").find("img").remove(), s.find(".js_cover").show().prepend('<img src="%s">'.sprintf(o)).find("input").val(n);
                                var r = t.articleList.$current;
                                r && (r.find("img.js_appmsg_thumb").attr("src", o), r.find("div.js_appmsg_thumb").css("backgroundImage", 'url("' + o + '")'),
                                    r.addClass("has_thumb")), s.find(".js_cover_error").hide(), this.destroy(),
                                    document.body.style.overflow = document.documentElement.style.overflow = "auto";
                            },
                            onCancel: function () {
                                this.destroy();
                            },
                            onHide: function () {
                                document.body.style.overflow = document.documentElement.style.overflow = "auto";
                            }
                        });
                    });
                },
                _initUEditor: function () {
                    var e = this, i = [], s = ["undo", "redo", "|", "fontsize", "|", "blockquote", "horizontal", "|", "removeformat", "formatmatch"], n = ["bold", "italic", "underline", "forecolor", "backcolor", "|", "indent", "|", "justifyleft", "justifycenter", "justifyright", "justifyjustify", "|", "rowspacingtop", "rowspacingbottom", "lineheight", "|", "insertorderedlist", "insertunorderedlist", "|", "imagenone", "imageleft", "imageright", "imagecenter"];
                    i.push(new b({
                        container: "#js_editor_insertimage"
                    })),
                        //    i.push(new v({
                        //        container: "#js_editor_insertvideo"
                        //    })),
                        //wx.cgiData.can_use_vote && i.push(new f({
                        //    container: "#js_editor_insertvote"
                        //})), wx.cgiData.can_use_card && i.push(new m({
                        //    container: "#js_editor_insertcard",
                        //    biz_uin: I.biz_uin
                        //})),
                        //wx.cgiData.qqmusic_flag && i.push(new u({
                        //    container: "#music_plugin_btn"
                        //})),
                        //wx.cgiData.can_use_voice && i.push(new w({
                        //    container: "#audio_plugin_btn"
                        //})),
                    (wx.cgiData.can_use_copyright || wx.cgiData.can_use_hyperlink || wx.cgiData.is_link_white) && (i.push(new j),
                        i.push(new g), s.push("link", "unlink")), t = e.ueditor = new x({
                        plugins: i,
                        autoHeightEnabled: !0,
                        topOffset: 53,
                        toolbars: [s, n]
                    }), t.render("js_editor"), t.addListener("begincatchimage", function () {
                        l.suc("内容已上传完成");
                    }), t.addListener("catchremotesuccess", function (i, s, n, o, r, a) {
                        var d = t.getDocument(), c = d.getElementById(s);
                        if (null != c) {
                            var l = {
                                src: o
                            };
                            r && (l["data-type"] = r), "img" == a ? $(c).attr(l).removeAttr("_src").removeAttr("data-src").removeClass("js_catchingremoteimage").trigger("catchremotesuccess", {
                                source: n,
                                type: a
                            }) : $(c).css({
                                "background-image": o ? "url(" + o + ")" : "none"
                            }).removeClass("js_catchingremoteimage").trigger("catchremotesuccess", {
                                source: n,
                                type: a
                            });
                            var _ = $(d).find(".js_catchremoteimageerror").length;
                            0 == _ ? $(".js_catch_tips", e.$editor).hide() : $(".js_catch_tips", e.$editor).show().find(".js_msg_content").text("有%s张图片粘贴失败".sprintf(_));
                        }
                    }), t.addListener("catchremoteerror", function (i, s, n) {
                        var o = t.getDocument(), r = o.getElementById(s);
                        if (null != r) {
                            "img" == n ? $(r).css({
                                width: "497px",
                                height: "auto"
                            }).attr({
                                src: "http://mmbiz.qpic.cn/mmbiz/G1lssUsxJOsVVJNUIuKfUP7bLm5EVWxXl5znicMum6Os0CMJHPdeHicicZ4W5MGOVa8ooSXYuE61Ek/0"
                            }).removeAttr("_src").removeAttr("data-src").addClass("js_catchremoteimageerror").trigger("catchremoteerror", r) : $(r).css({
                                width: "497px",
                                height: "auto",
                                "background-image": "url(http://mmbiz.qpic.cn/mmbiz/G1lssUsxJOsVVJNUIuKfUP7bLm5EVWxXl5znicMum6Os0CMJHPdeHicicZ4W5MGOVa8ooSXYuE61Ek/0)"
                            }).addClass("js_catchremoteimageerror").trigger("catchremoteerror", r);
                            var a = $(o).find(".js_catchremoteimageerror").length;
                            $(".js_catch_tips", e.$editor).show().find(".js_msg_content").text("有%s张图片粘贴失败".sprintf(a)),
                                $(".js_content_error", e.$editor).hide();
                        }
                    }), t.addListener("keyup aftersetcontent", function () {
                        var i = t.getDocument(), s = $(i).find(".js_catchremoteimageerror").length;
                        s > 0 ? $(".js_catch_tips", e.$editor).show().find(".js_msg_content").text("有%s张图片粘贴失败".sprintf(s)) : $(".js_catch_tips", e.$editor).hide();
                    }), t.addListener("keyup", function () {
                        $(".js_content_error", e.$editor).hide(), $("#js_draft_tips").hide();
                    }), t.addListener("heightChanged", function () {
                        $(window).trigger("scroll");
                    }), t.addListener("focus", function () {
                        t.enableToolbar();
                    }), t.ready(function () {
                        e._initEditArea(), e.articleList = new k($.extend({
                            maxNum: 8,
                            ueditor: e.ueditor,
                            freeUEditor: e.freeUEditor
                        }, e.opt));
                    });
                },
                _initOriginal: function () {
                    var e = this, i = e.$editor;
                    $(document).on("click", ".js_original_apply", function () {
                        var t = $("#js_original"), s = $("#tpl_original").popup({
                            title: "声明原创",
                            width: 960,
                            className: "simple align_edge original_dialog",
                            data: {
                                first: t.find(".js_original_publish").val() || 1,
                                url: t.find(".js_url").text() || i.find(".js_url").val(),
                                author: t.find(".js_author").text() || i.find(".js_author").val(),
                                platform: t.find(".js_platform").text() || "",
                                frm: t.find(".js_reprint_frm").val() || 1
                            },
                            buttons: [{
                                text: "下一步",
                                type: "primary",
                                click: function () {
                                    n.find(".js_step_panel").hide().eq(1).show();
                                    var e = new a({
                                        container: "#js_original_article_type",
                                        label: "请选择",
                                        data: L
                                    });
                                    e.selected(t.find(".js_classify").text()), n.find(".js_btn_p").eq(0).hide(), n.find(".js_btn_p").eq(1).show(),
                                        n.find(".js_btn_p").eq(2).show(), c.setStep(2);
                                }
                            }, {
                                text: "上一步",
                                click: function () {
                                    n.find(".js_step_panel").hide().eq(0).show(), n.find(".js_btn_p").eq(0).show(), n.find(".js_btn_p").eq(1).hide(),
                                        n.find(".js_btn_p").eq(2).hide(), c.setStep(1);
                                }
                            }, {
                                text: "确定",
                                type: "primary",
                                click: function () {
                                    e._checkOriginal(n) && ($(".js_original_type").hide().eq(1).show(), $(".js_original_content").show(),
                                        i.find(".js_author").closest(".appmsg_edit_item").eq(0).hide(), i.find(".js_url_area").hide(),
                                        i.find(".js_reward").checkbox("disabled", !1).checkbox("checked", !0), i.find(".js_reward_div").show(),
                                        "checked" == n.find(".js_forIEbug_frm").attr("checked") ? ($("#js_pay").checkbox("disabled", !0),
                                            $("#js_pay").checkbox("checked", !1), i.find(".js_pay_tips").show().text("（只有“禁止转载”的原创文章才可以设置付费阅读）"),
                                            i.find(".js_pay_setting").hide()) : ($("#js_pay").checkbox("disabled", !1), i.find(".js_pay_tips").show().text("（每月可群发10篇付费阅读文章）")),
                                        this.remove());
                                }
                            }],
                            onHide: function () {
                                this.remove();
                            }
                        }), n = s.popup("get");
                        n.find(".js_btn_p").eq(1).hide(), n.find(".js_btn_p").eq(2).hide();
                        var c = new r({
                            container: n.find(".js_step"),
                            selected: 1,
                            names: ["1 须知", "2 原创声明信息"]
                        });
                        n.find(".js_original_publish").checkbox({
                            multi: !1,
                            onChanged: function (e) {
                                n.find(".js_platform").parent().hide().eq(e.val()).show(), n.find(".js_url").attr("placeholder", +e.val() ? "选填" : "该原创文章在其他网站的地址").trigger("blur");
                            }
                        }), $(".js_forIEbug_selectedTure").hasClass("selected") || $(".js_forIEbug_selectedFalse").hasClass("selected") || $(".js_forIEbug_selectedTure").addClass("selected"),
                            n.find(".js_reprint_frm").checkbox({
                                multi: !1
                            }), new d({
                            container: "#js_frmtips",
                            content: $("#frm_tips").html(),
                            position: {
                                left: -30,
                                top: 0
                            },
                            reposition: !0,
                            type: "hover",
                            parentClass: "reprinted_tips"
                        }), $($(".popover")[$(".popover").length - 1]).css("z-index", "9999"), $($(".popover")[$(".popover").length - 1]).children(".popover_arrow").css("left", "8%"),
                            n.find(".js_counter").each(function () {
                                $(this).hasClass("js_author") ? new o($(this), {
                                    maxLength: 8,
                                    useGBKLength: !0,
                                    GBKBased: !0
                                }) : new o($(this), {
                                    maxLength: 10
                                });
                            }), n.on("input propertychange blur", ".js_url", function () {
                            if (1 != n.find(".js_original_publish:checked").val()) {
                                var e = $.trim($(this).val()), i = e.match(/^(https?:\/\/)?((([\da-z]+\.)+)?(([\da-z]+)\.[\da-z]+))/), t = "";
                                i && (t = t || q[i[5]], t = t || q[i[2]], t = t || i[6]), t && $(this).closest(".js_step_panel").find(".js_platform").eq(0).val(t).trigger("keyup");
                            }
                        }), n.on("keyup", ".js_platform,.js_url,.js_author", function () {
                            $(this).closest(".frm_controls").find(".fail").hide();
                        }), i.find(".js_url_checkbox").checkbox("checked", !1);
                    }), $(".js_original_cancel").on("click", function () {
                        var t = $("#js_original");
                        i.find(".js_original_type").hide().eq(0).show(), i.find(".js_original_content").hide(),
                            i.find(".js_author").closest(".appmsg_edit_item").eq(0).show(), i.find(".js_url_area").show();
                        var s = t.find(".js_url").text();
                        s ? (i.find(".js_url_checkbox").checkbox("checked", !0), i.find(".js_url").val(s).parent().show()) : (i.find(".js_url_checkbox").checkbox("checked", !1),
                            i.find(".js_url").parent().hide()), i.find(".js_reward").checkbox("disabled", !0),
                            i.find(".js_reward").checkbox("checked", !1), i.find(".js_reward_div").hide(), i.find(".js_reward_wording").val(),
                            $("#js_pay", i).checkbox("disabled", !0), $("#js_pay", i).checkbox("checked", !1), $(".js_pay_tips", e.$editor).show().text("（只有“禁止转载”的原创文章才可以设置付费阅读）"),
                            $(".js_pay_setting", i).hide();
                    }), $("#js_original_detail").on("click", function () {
                        $(this).parent().toggleClass("open"), $(this).siblings("ul").toggle();
                    });
                    var t = !0, s = I.orginal_apply_stat, n = 1 == I.has_invited_original ? "/acct/copyrightapply?action=apply" : "/acct/selfapply?action=apply";
                    n = wx.url(n);
                    var c = $("#js_original_func_open").closest(".js_original_type"), l = function () {
                        Cgi.post({
                            url: "/cgi-bin/appmsg?action=get_original_stat"
                        }, function (e) {
                            if (e.base_resp && 0 == e.base_resp.ret) {
                                var i = "";
                                switch (+e.orginal_apply_stat) {
                                    case 0:
                                        i = "原创声明：未开通";
                                        break;

                                    case 1:
                                        i = "原创声明：审核中", c.find(".opt").hide();
                                        break;

                                    case 2:
                                        i = "原创声明：申请失败", c.find(".opt").hide();
                                        break;

                                    case 3:
                                        i = "原创：未声明", c.find(".opt").html('<a href="javascript:;" onclick="return false;" class="btn btn_default js_original_apply">声明原创</a>').show();
                                }
                                c.find(".subtitle").text(i), s = e.orginal_apply_stat;
                            }
                            3 != e.orginal_apply_stat && setTimeout(l, 2e3);
                        });
                    };
                    $("#js_original_func_open").on("click", function () {
                        0 == s && window.open(n), t && (t = !1, setTimeout(l, 2e3));
                    });
                },
                _initPay: function () {
                    var e = this, i = e.$editor, t = e._createPayDialog();
                    $("#js_pay", i).checkbox({
                        multi: !0,
                        onChanged: function (s) {
                            s.checkbox("value") ? e._showPayDialog(t) : (t.popup("hide"), $(".js_pay_setting", i).hide());
                        }
                    }), $(".js_pay_edit", i).on("click", function () {
                        e._showPayDialog(t);
                    });
                },
                _showPayDialog: function (e) {
                    var i = this, t = i.$editor, s = e.popup("get");
                    s.find(".js_fee").val($(".js_fee", t).text()), s.find(".js_step_panel").hide().eq(0).show(),
                        s.find(".js_btn_p").hide(), s.find(".js_btn_p").eq(0).show(), s.find(".js_btn_p").eq(1).show(),
                        e._step.setStep(1), e.popup("show");
                },
                _createPayDialog: function () {
                    var e = this, i = e.$editor, t = $("#tpl_pay").popup({
                        title: "付费阅读设置",
                        width: 960,
                        className: "simple align_edge pay_dialog",
                        autoShow: !1,
                        data: {},
                        buttons: [{
                            text: "取消",
                            click: function () {
                                $(".js_pay_setting", i).is(":visible") || $("#js_pay", i).checkbox("checked", !1), this.hide();
                            }
                        }, {
                            text: "下一步",
                            type: "primary",
                            click: function () {
                                var t = e.freeUEditor.val(), o = s.find(".js_fee").val();
                                return "" == t ? void l.err("免费区域不能为空") : c.rangelength(t, [20, 200]) ? !o || !/^\d*(\.\d+)?$/.test(o) || o.toString().match(/\.\d{3,}/) || .01 > o ? void l.err("请输入正确的金额") : .01 > o ? void l.err("金额必须大于零") : o > 200 ? void l.err("金额不能超过200元") : (s.find(".js_content").html(t),
                                    s.find(".js_content_count").text(e.ueditor.getUeditor().getContent().text().length),
                                    s.find(".js_fee_preview").text(parseFloat(o).toFixed(2)), s.find(".js_nickname").text(wx.data.nick_name),
                                    s.find(".js_title").text($.trim($(".js_title", i).val())), s.find(".js_author").text($.trim($(".js_author", i).val())),
                                    s.find(".js_date").text(_().format("YYYY-MM-DD")), s.find(".js_step_panel").hide().eq(1).show(),
                                    s.find(".js_btn_p").hide(), s.find(".js_btn_p").eq(2).show(), s.find(".js_btn_p").eq(3).show(),
                                    s.find(".js_preview").scrollTop(1e8), n.setStep(2), void this.resetPosition()) : void l.err("正文字数要多于20字且不能超过200字");
                            }
                        }, {
                            text: "上一步",
                            click: function () {
                                s.find(".js_step_panel").hide().eq(0).show(), s.find(".js_btn_p").hide(), s.find(".js_btn_p").eq(0).show(),
                                    s.find(".js_btn_p").eq(1).show(), n.setStep(1), this.resetPosition();
                            }
                        }, {
                            text: "确定",
                            type: "primary",
                            click: function () {
                                $(".js_pay_setting", i).show().find(".js_fee").text((+s.find(".js_fee").val()).toFixed(2)),
                                    $(".js_pay_tips", i).hide(), this.hide();
                            }
                        }],
                        onClose: function () {
                            $(".js_pay_setting", i).is(":visible") || $("#js_pay", i).checkbox("checked", !1), t.popup("hide");
                        },
                        onShow: function () {
                            this.resetPosition();
                        }
                    }), s = t.popup("get");
                    s.find(".js_btn_p").eq(2).hide(), s.find(".js_btn_p").eq(3).hide();
                    var n = new r({
                        container: s.find(".js_step"),
                        selected: 1,
                        names: ["设置", "预览并确认"]
                    });
                    return e.freeUEditor = s.find(".js_editor"), new o(e.freeUEditor, {
                        minLength: 20,
                        maxLength: 200
                    }), s.find(".js_fee").on("input propertychange", function () {
                        var e = $(this).val();
                        e && /^\d*(\.\d+)?$/.test(e) && !e.toString().match(/\.\d{3,}/) ? .01 > e ? $(this).parent().addClass("error") : e > 200 ? $(this).parent().addClass("error") : $(this).parent().removeClass("error") : $(this).parent().addClass("error");
                    }), t.popup("resetPosition"), t._step = n, t;
                },
                _checkOriginal: function (e) {
                    var i = !0, t = "checked" == e.find(".js_forIEbug_frm").attr("checked") ? 1 : e.find(".js_reprint_frm:checked").val(), s = "checked" == e.find(".js_forIEbug_original").attr("checked") ? 1 : 0, n = e.find(".js_url").val(), o = e.find(".js_platform").eq(s).val(), r = e.find(".js_author").val(), a = e.find("#js_original_article_type .dropdown_switch label").text();
                    n && !/https?\:\/\//.test(n) && (n = "http://" + n), r.len() > 16 || r.len() <= 0 ? (e.find(".js_author_error").show(),
                        i = !1) : e.find(".js_author_error").hide(), 0 != s && !n || c.url(n) || $(".js_forIEbug_selectedTure").hasClass("selected") ? e.find(".js_url_error").hide() : (e.find(".js_url_error").show(),
                        i = !1), 1 != s || "" == n || c.url(n) ? e.find(".js_url_error").hide() : (e.find(".js_url_error").show(),
                        i = !1), $(".js_forIEbug_selectedTure").hasClass("selected") && !$(".js_forIEbug_selectedFalse").hasClass("selected") && (o = "微信公众平台"),
                        c.rangelength(o, [1, 10]) || $(".js_forIEbug_selectedTure").hasClass("selected") || !$(".js_forIEbug_selectedFalse").hasClass("selected") ? e.find(".js_platform_error").hide() : (e.find(".js_platform_error").show(),
                            i = !1);
                    for (var d = !1, l = 0; l < L.length; l++)a == L[l].name && (d = !0);
                    if (0 == d ? (e.find(".js_article_type_error").show(), i = !1) : e.find(".js_article_type_error").hide(),
                            i) {
                        var _ = $("#js_original");
                        _.find(".js_original_publish").val(s), _.find(".js_url").text(n).closest("li")[n ? "show" : "hide"](),
                            _.find(".js_platform").text(o), _.find(".js_author").text(r), _.find(".js_reprint_frm").val(t),
                            _.find(".js_frm").text(1 == t ? "允许转载" : 2 == t ? "授权转载" : "禁止转载"), _.find(".js_classify").text(a);
                    }
                    return i;
                },
                _bindEvent: function () {
                    var e = this;
                    e.$editor.on("click", ".js_msg_close", function () {
                        $(this).closest(".page_msg").hide();
                    }), e.$editor.find(".js_cover").on("click", "img", function () {
                        var e = $(this).attr("src");
                        e && h.show({
                            imgdata: [{
                                imgsrc: e
                            }]
                        });
                    });
                    var i = !1;
                    $("#js_fold").on("click", function () {
                        e.ueditor.fireEvent(i ? "adjustheight" : "foldcontentarea");
                    }), e.$editor.on("click", ".js_unfold_editor", function () {
                        e.ueditor.fireEvent("adjustheight");
                    }), e.ueditor.addListener("heightChanged", function (t, s) {
                        60 == s ? ($("#js_fold").children("span").text("展开正文"), e.$editor.find(".js_unfold_editor").show(),
                            i = !0, $(window).scrollTop($(".js_title").parent().offset().top - $(".main_hd").height() - $(".edui-editor-toolbarbox").height())) : ($("#js_fold").children("span").text("收起正文"),
                            e.$editor.find(".js_unfold_editor").hide(), i = !1);
                    });
                    var ref_n=document.referrer;
                    $("#js_submit").on("click", function () {
                        var i = $(this);
                        $("#js_import_tips,#js_draft_tips").hide(),
                            e.articleList.save(i, function (e) {
                                i.btn(!0), l.remove(), $("#js_save_success").show().delay(2e3).fadeOut(300), window.history && history.replaceState ? history.replaceState(history.state, document.title, wx.url("/wxoss/wx_articles/edit?t=media/appmsg_edit&type=10&appmsgid=%s".sprintf(e.appMsgId))) : 1 == I.isNew && (location.href = wx.url("/wxoss/wx_articles/edit?t=media/appmsg_edit&type=10&appmsgid=%s".sprintf(e.appMsgId)));
                                opener.location=ref_n;
                            }, !1, t);
                    }), $("#js_submit_close").on("click", function () {
                        var i = $(this);
                        e.articleList.save(i, function () {
                            l.suc("保存成功"), window.close();
                        }, !1, t);
                    }), $("#js_send").on("click", function () {
                        var i = $(this);
                        $("#js_import_tips,#js_draft_tips").hide(), e.articleList.save(i, function (i) {
                            e.articleList.draft.isDropped = !0;
                            if(isNaN(i.appMsgId)){
                                location.href = wx.url("/wxoss/wx_batch_messages?appmsgid=%s".sprintf(i.appMsgId))
                            } else{
                                l.err("该图文信息不完整，请继续编辑！");
                            };
                        }, !1, t, void 0, !0);
                    }), $("#js_preview").on("click", function () {
                        if ($("#js_import_tips,#js_draft_tips").hide(), z(I.func_ban_info, "preview")) {
                            {
                                $(this);
                            }
                            e.articleList.preview(t);
                        }
                    });
                    var s = $(".main_bd"), n = $(".js_aside"), o = $(".tool_area"), r = $(".main_hd").offset().top, a = $(".main_hd").height();
                    $(window).on("scroll", function () {
                        var e = $(window).scrollTop(), i = s.offset().top, t = s.height(), d = $(window).height(), c = Math.min(t - e + i - a, d - a);
                        e > r ? ($("body").addClass("edit_fixed"), n.height(c).find(".js_scrollbar").css("max-height", c)) : ($("body").removeClass("edit_fixed"),
                            n.height(t)), d - c - a <= o.height() ? $("body").removeClass("toolbar_unfixed") : $("body").addClass("toolbar_unfixed"),
                            setTimeout(function () {
                                $(".js_scrollbar").scrollbar.updateScrollbars(!0);
                            });
                    }).trigger("scroll"), $.support.leadingWhitespace && setInterval(function () {
                        $(window).trigger("scroll");
                    }, 1e3);
                    var d = $(window).width();
                    1200 > d && $("#body").width(d).css("margin-left", "0"), $(window).on("resize", function () {
                        var e = $(window).width();
                        1200 > e ? $("#body").width(e).css({
                            "margin-left": "0",
                            "margin-right": "0"
                        }).find(".main_hd").width(e - 2) : $("#body").width(1200).css({
                            "margin-left": "auto",
                            "margin-right": "auto"
                        }).find(".main_hd").width(1198), $(window).trigger("scroll");
                    }), $(window).on("unload", function () {
                        C.send(1);
                    });
                }
            });
            new U({
                app_id: I.app_id,
                editor_selector: "#js_appmsg_editor",
                appmsg_selector: "#js_appmsg_preview",
                appmsg_data: I.appmsg_data
            });
        }
    });