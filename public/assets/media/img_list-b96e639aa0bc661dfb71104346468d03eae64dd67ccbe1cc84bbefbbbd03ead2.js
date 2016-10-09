define("media/img_list.js", ["common/wx/popup.js", "common/wx/Step.js", "biz_common/jquery.validate.js",
    "common/wx/top.js", "common/wx/Cgi.js", "common/wx/Tips.js", "common/wx/liveTooltip.js",
    "common/wx/tooltips.js", "common/wx/popover.js", "common/wx/pagebar.js", "common/wx/dialog.js",
    "common/wx/preview.js", "biz_web/utils/upload.js", "biz_web/ui/dropdown.js", "biz_web/ui/checkbox.js",
    "tpl/media/dialog/image_water.html.js"], function (t) {
    "use strict";
    t("common/wx/popup.js");
    var e = t("common/wx/Step.js"), i = t("biz_common/jquery.validate.js"), n = t("common/wx/top.js"),
        o = t("common/wx/Cgi.js"), a = t("common/wx/Tips.js"), r = t("common/wx/liveTooltip.js"),
        l = t("common/wx/tooltips.js"), s = t("common/wx/popover.js"), c = t("common/wx/pagebar.js"),
        p = (t("common/wx/dialog.js"), t("common/wx/preview.js")), d = t("biz_web/utils/upload.js"),
        u = t("biz_web/ui/dropdown.js"), m = (t("biz_web/ui/checkbox.js"), template.render),
        g = wx.cgiData, f = {
            imgOri: {}
        };
    new n("#topTab", n.DATA.media).selected("media2");
    var _ = $("#js_imglist"), h = $("#js_group"), v = null, b = g.page.file_item, w = g.page.file_group_list.file_group
        , j = function () {
            function t(t, e) {
                i.push(e);
            }

            function e() {
                i.each(function (t) {
                    t();
                }), y.updateImg({
                    isNow: !1
                });
            }

            var i = [];
            return {
                init: t,
                run: e
            };
        }(),
        y = {
            renderImage: function (t) {
                var e = this, i = [];
                _.find("input[type=checkbox]:checked").each(function () {
                    i.push($(this).data("id"));
                }), i = "," + i.join(",") + ",", t.each(function (t) {
                    t.selected = i.indexOf("," + t.file_id + ",") >= 0 ? !0 : !1,
                        t.img_src = t.cdn_url,
                        t.imgsrc = t.cdn_url,
                        t.downsrc = wx.url("/cgi-bin/downloadfile?fileid=%s".sprintf(t.file_id)), t.group_id = g.groupid,
                        t.copyright_status = t.copyright_status || 0, t.can_apply_copyright = e.canApplyImgCopyright(t.copyright_status),
                        t.can_edit_name = e.canEditImgName(t.copyright_status), t.name = t.name.html(!0);
                }), _.html(m("tpl_list", {
                    list: t
                })), this.initListEvent();
            },
            renderGroup: function (t) {
                t.each(function (t) {
                    t.selected = t.id == g.groupid, t.selected && $("#js_currentgroup").text(t.name);
                }), h.html(m("tpl_group", {
                    total: g.page.file_cnt.img_cnt,
                    list: t
                }));
            },
            renameImage: function (t) {
                var e = v.$pop, i = e.find(".jsPopoverBt").eq(0), n = e.find("input").val().trim();
                return "" == n ? void a.err("不能为空") : (i.btn(!1), void o.post({
                    url: wx.url("/wxoss/wx_articles/resources/rename?oper=rename&t=ajax-response"),
                    data: {
                        fileName: n,
                        fileid: t.data("id"),
                        group_id: g.groupid
                    },
                    mask: !1
                }, function (e) {
                    return e && e.base_resp ? (0 == e.base_resp.ret ? (a.suc("编辑名称成功"), t.data("name", n), t.closest(".js_imgitem").find("label span").text(n),
                        v.remove()) : a.suc("编辑名称失败，请重试"), void i.btn(!0)) : void a.suc("编辑名称失败，请重试");
                }));
            },
            renameGroup: function (t) {
                var e = t.find("input"), i = t.find(".jsPopoverBt").eq(0), n = e.val().trim();
                return n.length < 1 || n.length > 6 ? void a.err("分组名字为1-6个字符") : (i.btn(0), void o.post({
                    url: wx.url("/wxoss/wx_articles/resources/modify_group"),
                    data: {
                        action: "modify_group",
                        name: n,
                        id: e.data("id")
                    },
                    mask: !1
                }, function (t) {
                    0 == t.base_resp.ret ? (a.suc("重命名成功"), location.reload()) : (a.err("重命名失败，请重试"), i.btn(!0));
                }));
            },
            moveGroup: function (t) {
                var e = v.$pop, i = e.find(".jsPopoverBt").eq(0), n = e.find("input[type=radio]:checked");
                return 0 == n.length ? void a.err("请选择分组") : (i.btn(0), void o.post({
                    url: wx.url("/wxoss/wx_articles/resources/modify_img_group"),
                    data: {
                        action: "modify_img_group",
                        file_id: t,
                        old_group_id: g.groupid,
                        new_group_id: n.data("id")
                    },
                    mask: !1
                }, function (t) {
                    0 == t.base_resp.ret ? (a.suc("移动分组成功"), location.reload()) : (a.err("移动分组失败，请重试"), i.btn(!0));
                }));
            },
            createGroup: function () {
                var t = v.$pop, e = t.find(".jsPopoverBt").eq(0), i = t.find("input").val().trim();
                return i.length < 1 || i.length > 6 ? void a.err("分组名字为1-6个字符") : (e.btn(0), void o.post({
                    url: wx.url("/wxoss/wx_articles/resources/create_group"),
                    data: {
                        action: "create_group",
                        name: i
                    },
                    mask: !1
                }, function (t) {
                    var i = t.base_resp.ret;
                    0 == i ? (a.suc("创建成功"), location.reload()) : -80020 == i ? (a.err("分组个数已达到上限"), e.btn(!0)) : (a.err("创建失败，请重试"),
                        e.btn(!0));
                }));
            },
            deleteImage: function (t) {
                var e = v.$pop, i = e.find(".jsPopoverBt").eq(0), n = [], r = [];
                t.each(function () {
                    var t = $(this);
                    n.push(t.data("id")), r.push(t.data("oristatus") || 0);
                });
                var l = n.length > 1 ? "batchdel" : "del";
                i.btn(0), o.post({
                    url: wx.url("/wxoss/wx_articles/resources/delete_image?t=ajax-response"),
                    data: {
                        oper: l,
                        fileid: n.join(","),
                        copyright_status: r.join(","),
                        group_id: g.groupid
                    },
                    mask: !1
                }, function (t) {
                    return i.btn(1), v && v.remove(), t && t.base_resp ? void(0 == t.base_resp.ret ? t.using_img_cnt && t.using_img_cnt > 0 ? (a.suc("删除成功，有%s张图片正在被使用，没有被删除".sprintf(t.using_img_cnt)),
                        setTimeout(function () {
                            location.reload();
                        }, 300)) : (a.suc("删除成功"), g.begin == g.total - n.length ? location.href = wx.url("/wxoss/wx_articles/resources?type=2&begin=%s&count=12&t=media/img_list&group_id=%s".sprintf(g.begin - g.count, g.groupid)) : location.reload()) : a.err(200500 == t.base_resp.ret ? "该图片正在被使用，不能删除" : 200501 == t.base_resp.ret ? "所选图片都在使用中，删除失败" : "删除失败，请重试")) : void a.suc("删除失败，请重试");
                });
            },
            updateImg: function (t) {
                function e() {
                    o.get({
                        url: window.location.href,
                        mask: !1
                    }, function (e) {
                        if ("function" == typeof t.callback && t.callback(), e && e.base_resp && 0 == e.base_resp.ret) {
                            var n = e.page_info.file_item;
                            i.renderImage(n);
                        }
                    });
                }

                var i = this;
                f.updateImgId && window.clearTimeout(f.updateImgId), t.isNow === !0 && e(), f.updateImgId = setTimeout(function () {
                    i.updateImg({
                        isNow: !0
                    });
                }, 6e4);
            },
            canApplyImgCopyright: function (t) {
                return t = t || 0, 1 == t || 2 == t || 3 == t || 4 == t || 5 == t || 9 == t || 10 == t || 11 == t ? !1 : !0;
            },
            canEditImgName: function (t) {
                return t = t || 0, 1 == t || 2 == t || 3 == t || 4 == t || 5 == t || 9 == t || 10 == t ? !1 : !0;
            },
            imgOriApply: function (t, e, i) {
                var n = this, o = [], r = [], l = !1, s = f.imgOri;
                return "undefined" != typeof t && "undefined" != typeof e && "undefined" != typeof i ? (this.canApplyImgCopyright(i) || (l = !0),
                    o = [t], r = [$.trim(e).replace(/\|/g, "")]) : _.find("input[type=checkbox]:checked").each(function () {
                    var t = $(this), e = t.data("oristatus");
                    return n.canApplyImgCopyright(e) ? (o.push(t.data("id")), void r.push(t.siblings("span").text().trim().replace(/\|/g, ""))) : (l = !0,
                        !1);
                }), l ? void a.err("仅支持对未声明原创状态的图片进行原创声明，请检查所选择的图片") : (this.initImgOriDialog(o), this.initImgOriDialogData(o, r),
                    void s.dialog.popup("show"));
            },
            initImgOriDialogData: function (t, e) {
                var i = f.imgOri, n = i.dom, o = this.getImgOriCache(wx.cgiData.nickName);
                if (n.find("input[name=img_list]").val(t.join("|")), n.find("h3").text("声明图片原创"), e.length > 1 ? (n.find("input[name=title_list]").val(e.join("|")),
                        n.find("div.js_title_controls1").show(), n.find("div.js_title_controls2").hide()) : (n.find("div.js_title_controls1").hide(),
                        n.find("div.js_title_controls2").show()), o) {
                    o.type && i.dropdown.selected(o.type, !0);
                    var a = o.author || "", r = a.length;
                    n.find("input[name=author]").val(a), n.find(".js_author_len").text(r), r > 8 ? n.find(".js_author_len_warn").addClass("warn") : n.find(".js_author_len_warn").removeClass("warn"),
                    o.tag && o.tag.length > 0 && ($("#js_history_tag_box").show(), n.find(".js_history_ori_tag").html(m("tpl_history_tag", {
                        data: o.tag
                    })));
                }
            },
            initImgOriDialog: function () {
                var t = this, n = f.imgOri;
                if (!n.dialog) {
                    n.dialog = $("#tpl_ori_apply").popup({
                        autoShow: !1,
                        title: "",
                        width: 960,
                        className: "align_edge",
                        buttons: [{
                            text: "下一步",
                            type: "primary",
                            click: function () {
                                t.imgOriDialogStep(2);
                            }
                        }, {
                            text: "上一步",
                            type: "default",
                            click: function () {
                                t.imgOriDialogStep(1);
                            }
                        }, {
                            text: "提交原创",
                            type: "primary",
                            click: function () {
                                t.imgOriSubmit();
                            }
                        }],
                        onHide: function () {
                            t.resetImgOriDialog();
                        }
                    });
                    var o = n.dialog.popup("get");
                    n.dom = o, n.btns = o.find(".js_btn_p"), n.step1Content = o.find(".js_step1"), n.step2Content = o.find(".js_step2");
                    var a = {
                        title_list: {
                            required: !0,
                            title_maxlength: 21
                        },
                        author: {
                            required: !0,
                            maxlength: 8
                        },
                        type: {
                            required: !0
                        },
                        tag4: {
                            maxlength: 8
                        },
                        tag3: {
                            tag_overlen: !0,
                            tag_thesame: !0
                        }
                    }, r = {
                        title_list: {
                            required: "请填写标题",
                            title_maxlength: "不能超过21个字符"
                        },
                        author: {
                            required: "请填写作者",
                            maxlength: "不能超过8个字符"
                        },
                        type: {
                            required: "请选择类型"
                        },
                        tag4: {
                            maxlength: "标签不能超过8个字符"
                        },
                        tag3: {
                            tag_overlen: "最多3个标签",
                            tag_thesame: "该标签已添加"
                        }
                    };
                    n.stepBar = new e({
                        container: "#Js_imgOriStep",
                        names: ["1 须知", "2 原创声明信息"]
                    }), n.dropdown = new u({
                        container: "#js_imgori_type",
                        label: "请选择",
                        data: [{
                            name: "漫画",
                            value: "漫画"
                        }, {
                            name: "插画",
                            value: "插画"
                        }, {
                            name: "人物摄影",
                            value: "人物摄影"
                        }, {
                            name: "静物摄影",
                            value: "静物摄影"
                        }, {
                            name: "生活摄影",
                            value: "生活摄影"
                        }, {
                            name: "风光摄影",
                            value: "风光摄影"
                        }, {
                            name: "设计",
                            value: "设计"
                        }, {
                            name: "其他",
                            value: "其他"
                        }],
                        callback: function (t) {
                            var e = n.dom.find("input[name=type]").val(t);
                            n.form.element(e);
                        }
                    }), o.find("input[name=title_list2]").on("keyup", function () {
                        var t = $(this), e = t.val(), i = e.length, a = o.find("input[name=title_list]");
                        a.val(e), o.find(".js_title_len").text(i), i > 21 ? o.find(".js_title_len_warn").addClass("warn") : o.find(".js_title_len_warn").removeClass("warn"),
                            n.form.element(a);
                    }), o.find("input[name=author]").on("keyup", function () {
                        var t = $(this), e = t.val().length;
                        o.find(".js_author_len").text(e), e > 8 ? o.find(".js_author_len_warn").addClass("warn") : o.find(".js_author_len_warn").removeClass("warn");
                    }), o.find("input[name=tag2]").on("keydown", function (e) {
                        if (8 == e.keyCode && !$(this).val()) {
                            var i = $("#js_tag_box").children();
                            i.length > 0 && t.delImgOriTag(i.last());
                        }
                    }), o.find("input[name=tag2]").on("keyup", function (e) {
                        var i = $(this), o = i.val().trim(), a = n.dom.find("input[name=tag4]");
                        if ("" !== o) {
                            a.val(o), n.form.element(a);
                            var r = n.dom.find("input[name=tag3]").val(""), l = n.form.element(i);
                            n.form.element(r), l && 13 == e.keyCode && t.addImgOriTag(o) && i.val("");
                        }
                    }), $("#js_history_tag_box").on("click", ".js_add_tag", function () {
                        var e = n.dom.find("input[name=tag3]").val("");
                        n.form.element(e), t.addImgOriTag($(this).text());
                    }), $("#js_tag_box").on("click", ".js_tag_del", function () {
                        t.delImgOriTag($(this).parent());
                    }), i.addMethod("tag_overlen", function (t) {
                        return t = $.trim(t), 1 != t ? !0 : !1;
                    }, "最多3个标签"), i.addMethod("tag_thesame", function (t) {
                        return t = $.trim(t), 2 != t ? !0 : !1;
                    }, "该标签已添加"), i.addMethod("title_maxlength", function (t, e, i) {
                        t = $.trim(t);
                        var n = t.split("|").length;
                        return 1 == n && t.length > i ? !1 : !0;
                    }, ""), n.form = $("#imgOri_form").validate({
                        rules: a,
                        messages: r,
                        ignore: []
                    });
                }
                t.imgOriDialogStep(1);
            },
            delImgOriTag: function (t) {
                var e = f.imgOri, i = e.dom.find("input[name=tag]"), n = e.dom.find("input[name=tag3]"), o = "|" + i.val() + "|", a = "|" + t.attr("title");
                t.remove(), o = o.replace(a, "").replace(/\|\|/, "|").replace(/^\|/, "").replace(/\|$/, ""),
                    i.val(o), e.form.element(n);
            },
            addImgOriTag: function (t) {
                if (!("undefined" == typeof t || "" === t || $.trim(t).length > 8)) {
                    t = $.trim(t).replace(/\|/g, "");
                    var e = f.imgOri, i = (e.dom, e.dom.find("input[name=tag]")), n = i.val(), o = e.dom.find("input[name=tag3]");
                    return ("|" + n + "|").indexOf("|" + t + "|") >= 0 ? (o.val("2"), e.form.element(o), o.val(""),
                        !1) : 3 == n.split("|").length ? (o.val("1"), e.form.element(o), o.val(""), !1) : ($("#js_tag_box").append(m("tpl_img_ori_tag", {
                        tag: t
                    })), "" === n ? n = t : n += "|" + t, i.val(n), !0);
                }
            },
            resetImgOriDialog: function () {
                var t = f.imgOri, e = t.dom;
                e.find("input[name=img_list]").val(""), e.find("input[name=title_list2]").val(""),
                    e.find("input[name=title_list]").val(""), e.find(".js_title_len").val(0), e.find("input[name=author]").val(""),
                    e.find(".js_author_len").val(0), e.find("input[name=tag2]").val(""), e.find("input[name=tag]").val(""),
                    e.find("input[name=tag3]").val(""), $("#js_history_tag_box").hide(), e.find(".js_history_ori_tag").html(""),
                    $("#js_tag_box").html(""), t.form.resetForm();
            },
            imgOriSubmit: function () {
                function t(i) {
                    i ? (e && clearTimeout(e), n.submiting = !1, n.btns.eq(2).btn(!0)) : (n.submiting = !0, n.btns.eq(2).btn(!1),
                        e = setTimeout(function () {
                            t(!0), a.err("系统繁忙，请稍后再试");
                        }, 3e4));
                }

                var e, i = this, n = f.imgOri, r = n.form;
                if (n.dom.find("input[name=tag4]").val(""), n.submiting !== !0) {
                    if (!r.form())return void a.err("请完善表单");
                    t(!1);
                    var l = $("#imgOri_form").serializeObject(), s = l.img_list.split("|"), c = l.title_list.split("|"), p = [];
                    if (s.length != c.length) {
                        for (var d = 0, u = s.length; u > d; d++)p.push(c[0]);
                        l.title_list = p.join("|");
                    }
                    l.action = "declare_img_copyright", l.group_id = g.groupid, o.post({
                        url: "/cgi-bin/filepage?",
                        data: l,
                        mask: !1
                    }, function (e) {
                        0 == e.base_resp.ret ? (a.suc("提交原创成功"), i.imgOriCache(l), i.updateImg({
                            isNow: !0,
                            callback: function () {
                                t(!0), n.dialog.popup("hide"), setTimeout(function () {
                                    i.updateImg({
                                        isNow: !0
                                    });
                                }, 5e3);
                            }
                        })) : (t(!0), a.suc("系统繁忙，请稍后再试"));
                    });
                }
            },
            imgOriCache: function (t) {
                if ("localStorage" in window) {
                    var e = 8, i = this.getImgOriCache() || {}, n = i[wx.cgiData.nickName] || {}, o = t.tag.split("|"), a = o.length, r = n.tag || [], l = r.length, s = [];
                    n.author = t.author, n.type = t.type;
                    for (var c = 0; a > c; c++) {
                        var p = $.trim(o[c]);
                        p && s.push(p);
                    }
                    for (var c = 0; l > c; c++) {
                        var p = $.trim(r[c]);
                        if (p) {
                            var d = "|" + s.join("|") + "|";
                            d.indexOf("|" + p + "|") >= 0 || s.push(p);
                        }
                    }
                    s = s.slice(0, e), n.tag = s, i[wx.cgiData.nickName] = n, window.localStorage.setItem("__imgcopyrightapplycache", JSON.stringify(i));
                }
            },
            getImgOriCache: function (t) {
                if (!("localStorage" in window))return null;
                var e = window.localStorage.getItem("__imgcopyrightapplycache") || "";
                return e ? (e = JSON.parse(e), t ? e[t] || null : e) : null;
            },
            imgOriDialogStep: function (t) {
                var e = f.imgOri;
                1 == t ? (e.stepBar.setStep(1), e.btns.eq(0).show(), e.btns.eq(1).hide(), e.btns.eq(2).hide(),
                    e.step1Content.show(), e.step2Content.hide()) : 2 == t && (e.stepBar.setStep(2), e.btns.eq(0).hide(),
                    e.btns.eq(1).show(), e.btns.eq(2).show(), e.step1Content.hide(), e.step2Content.show());
            },
            initListEvent: function () {
                this.initImgCheckbox(), this.initCopyrightMsg();
            },
            initImgCheckbox: function () {
                _.find("input[type=checkbox]").checkbox({
                    onChanged: function () {
                        _.find("input[type=checkbox]:checked").length ? $("#js_batchmove,#js_batchdel,#ori_apply_batch").enable() : $("#js_batchmove,#js_batchdel,#ori_apply_batch").disable();
                    }
                });
            },
            initCopyrightMsg: function () {
                $("body").find("div.popover").remove(), _.find(".js_tooltips").each(function () {
                    new l({
                        container: this,
                        parentClass: "tc",
                        position: {
                            left: -137
                        }
                    });
                });
            },
            deleteGroup: function () {
                var t = v.$pop, e = t.find(".jsPopoverBt").eq(0);
                e.btn(0), o.post({
                    url: wx.url("/wxoss/wx_articles/resources/del_group"),
                    data: {
                        action: "del_group",
                        id: $("#js_currentgroup").data("id")
                    },
                    mask: !1
                }, function (t) {
                    0 == t.base_resp.ret ? (a.suc("删除成功"), location.href = wx.url("/wxoss/wx_articles/resources?type=2&begin=0&count=12&t=media/img_list")) : (a.suc("删除失败，请重试"),
                        e.btn(1));
                });
            },
            createPopover: function (t) {
                v && v.remove(), v = new s({
                    dom: t.dom,
                    content: t.content,
                    margin: "center",
                    place: "bottom",
                    buttons: [{
                        text: "确定",
                        type: "primary",
                        click: function () {
                            t.ok.call(this);
                        }
                    }, {
                        text: "取消",
                        click: function () {
                            this.remove();
                        }
                    }]
                }), v.$pop.find("input").focus().on("keypress", function (e) {
                    wx.isHotkey(e, "enter") && t.keypress();
                });
            }
        };
    j.init("list", function () {
        y.renderImage(b), y.renderGroup(w);
    }), j.init("water", function () {
        var e = t("tpl/media/dialog/image_water.html.js"), i = g.page.watermark_status, n = template.compile(e)({
            status: i,
            set_water_url: wx.url("/cgi-bin/settingpage?t=setting/function&action=function&set_water=1")
        });
        $("#js_water").text((3 == i ? "，已关闭" : "，已开启") + "图片水印"), new l({
            container: $("#js_water_tips"),
            content: n,
            parentClass: "img_water",
            position: {
                left: -138,
                top: 2
            },
            reposition: !0,
            type: "hover"
        });
    }), j.init("checkbox", function () {
        $("#js_all").checkbox({
            onChanged: function (t) {
                var e = t.prop("checked");
                _.find("input[type=checkbox]").checkbox("checked", e), _.find("input[type=checkbox]:checked").length ? $("#js_batchmove,#js_batchdel,#ori_apply_batch").enable() : $("#js_batchmove,#js_batchdel,#ori_apply_batch").disable();
            }
        });
    }), j.init("baseevent", function () {
        new r({
            dom: _,
            position: {
                x: 0,
                y: -1
            }
        }), $(document).on("click", function (t) {
            0 == $(t.target).closest(".popover,.js_popover").length && v && v.remove();
        });
    }), j.init("groupevent", function () {
        $("#js_rename").on("click", function () {
            var t = $(this), e = t.parent().find("span");
            y.createPopover({
                dom: this,
                content: m("tpl_edit", {
                    name: e.text(),
                    id: e.data("id")
                }),
                ok: function () {
                    y.renameGroup(this.$pop);
                },
                keypress: function () {
                    y.renameGroup(v.$pop);
                }
            });
        }), $("#js_delgroup").on("click", function () {
            $(this);
            y.createPopover({
                dom: this,
                content: "<p>仅删除分组，不删除图片，组内图片将自动归入未分组</p>",
                ok: function () {
                    y.deleteGroup();
                }
            });
        }), $("#js_creategroup").on("click", function () {
            $(this);
            y.createPopover({
                dom: this,
                content: m("tpl_create", {}),
                ok: function () {
                    y.createGroup();
                }
            });
        });
    }), j.init("imageevent", function () {
        _.on("click", ".js_edit", function () {
            var t = $(this);
            y.createPopover({
                dom: this,
                content: m("tpl_edit", {
                    name: t.data("name")
                }),
                ok: function () {
                    y.renameImage(t);
                },
                keypress: function () {
                    y.renameImage(t);
                }
            });
        }), _.on("click", ".js_del", function () {
            var t = $(this), e = t.data("oristatus"), i = 2 == e ? $("#tpl_imgori_del").html() : $("#tpl_del").html();
            y.createPopover({
                dom: this,
                content: i,
                ok: function () {
                    y.deleteImage(t);
                }
            });
        }), _.on("click", ".js_move", function () {
            var t = $(this);
            1 == w.length && "未分组" == w[0].name && w[0].selected ? new s({
                dom: t,
                content: "你还没有任何分组。",
                place: "bottom",
                margin: "center",
                hover: !0,
                hideIfBlur: !0
            }) : (y.createPopover({
                dom: this,
                content: m("tpl_move", {
                    list: w,
                    current: g.groupid
                }),
                ok: function () {
                    y.moveGroup(t.data("id"));
                }
            }), v.$pop.find("input[type=radio]").checkbox());
        }), _.on("click", "img", function () {
            p.show({
                imgdata: b,
                current: $(this).closest(".js_imgitem").index()
            });
        }), $("body").on("click", ".js_copyright_appeal", function () {
            var t = $(this), e = encodeURIComponent(t.data("defendat")), i = encodeURIComponent(t.data("demandant")), n = ["/cgi-bin/imgcopyright?action=appeal&t=infringement/img_origin&demandant_img_url=", i, "&defendant_img_url=", e, "&scene=1"];
            window.open(wx.url(n.join("")));
        }), _.on("click", ".js_ori_apply", function () {
            var t = $(this), e = t.data("id"), i = t.data("name"), n = t.data("oristatus");
            y.imgOriApply(e, i, n);
        });
    }), j.init("batchevent", function () {
        $("#js_batchdel").on("click", function () {
            var t = $(this);
            t.hasClass("btn_disabled") || y.createPopover({
                dom: this,
                content: '<p class="tc">确定删除选中的素材吗</p>',
                ok: function () {
                    var t = _.find("input[type=checkbox]:checked");
                    y.deleteImage(t);
                }
            });
        }), $("#js_batchmove").on("click", function () {
            var t = $(this);
            t.hasClass("btn_disabled") || (y.createPopover({
                dom: this,
                content: m("tpl_move", {
                    list: w,
                    current: g.groupid
                }),
                ok: function () {
                    var t = [];
                    _.find("input[type=checkbox]:checked").each(function () {
                        t.push($(this).data("id"));
                    }), y.moveGroup(t.join(","));
                }
            }), 0 === v.$pop.find("input[type=radio]").length && (v.$pop.find(".no_group").show(),
                v.$pop.find(".popover_bar").hide()), v.$pop.find("input[type=radio]").checkbox());
        }), $("#ori_apply_batch").on("click", function () {
            var t = $(this);
            t.hasClass("btn_disabled") || y.imgOriApply();
        });
    }), j.init("pagebar", function () {
        var t = 0;
        g.page.file_group_list.file_group.each(function (e) {
            e.id == g.groupid && (t = e.count);
        }), g.total = t, new c({
            container: "#js_pagebar",
            perPage: g.count || 12,
            initShowPage: Math.floor(g.begin / g.count) + 1,
            totalItemsNum: t,
            first: !1,
            last: !1,
            isSimple: !0,
            callback: function (t) {
                var e = t.perPage * (t.currentPage - 1);
                location.href = wx.url("/wxoss/wx_articles/resources?type=2&begin=%s&count=12&t=media/img_list&group_id=%s".sprintf(e, g.groupid));
            }
        });
    }), j.init("upload", function () {
        d.uploadImageLibFile({
            container: "#js_upload",
            type: 2,
            scene: 1,
            fileNumLimit: 20,
            doublewrite: !0,
            groupid: $("#js_upload").data("gid"),
            onComplete: function () {
            },
            onAllComplete: function () {
                a.suc("上传成功"), location.href = wx.url("/wxoss/wx_articles/resources?type=2&begin=0&count=12&t=media/img_list&group_id=%s".sprintf(g.groupid));
            }
        });
    }), j.run();
});
