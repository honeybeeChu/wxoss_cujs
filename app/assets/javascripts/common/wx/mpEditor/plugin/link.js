define("common/wx/mpEditor/plugin/link.js", ["common/wx/popup.js", "biz_common/jquery.validate.js",
        "common/wx/Cgi.js", "tpl/mpEditor/plugin/link_dialog.html.js", "tpl/mpEditor/plugin/link_appmsg.html.js",
        "tpl/mpEditor/plugin/link_popup.html.js", "biz_common/moment.js", "common/wx/Tips.js", "common/wx/pagebar.js"],
    function (t) {
        "use strict";
        function e() {
            this.editor = null, this.__g = {
                _perPage: 5
            };
        }

        t("common/wx/popup.js"), t("biz_common/jquery.validate.js");
        var n = t("common/wx/Cgi.js"), i = t("tpl/mpEditor/plugin/link_dialog.html.js"), a = t("tpl/mpEditor/plugin/link_appmsg.html.js"), r = t("tpl/mpEditor/plugin/link_popup.html.js"), o = t("biz_common/moment.js"), l = t("common/wx/Tips.js"), s = t("common/wx/pagebar.js");
        return e.prototype = {
            getName: function () {
                return "link";
            },
            noCommandReprot: function () {
                return !0;
            },
            getExecCommand: function () {
                var t = this;
                return function () {
                    t.editor && t.__openDialog();
                };
            },
            addListener: function (t) {
                var e = this;
                t.addListener("link_optimize", function (t, n) {
                    e.__optimize(n);
                }), t.addListener("handle_common_popup", function (e, n) {
                    var i, a = t.queryCommandValue("link");
                    if (a && (i = a.getAttribute("_href") || a.getAttribute("href", 2))) {
                        var o = i;
                        i.length > 30 && (o = i.substring(0, 20) + "..."), n.html += wx.T(r, {
                            needBreak: n.html ? !0 : !1,
                            url: i,
                            txt: o
                        }), n.node = a;
                    }
                });
            },
            getType: function () {
                return 1;
            },
            getTitle: function () {
                return "超链接";
            },
            getQueryCommandState: function () {
                var t = this;
                return function () {
                    var e = t.editor;
                    if (!e)return 0;
                    var n = e.getSelectionRange().getClosedNode(), i = n && "edui-faked-video" == n.className;
                    return i ? -1 : 0;
                };
            },
            getQueryCommandValue: function () {
                var t = this;
                return function () {
                    var e = t.editor;
                    if (e) {
                        var n, i = e.getSelectionRange(), a = e.getDomUtils();
                        if (!i.collapsed) {
                            i.shrinkBoundary();
                            var r = 3 != i.startContainer.nodeType && i.startContainer.childNodes[i.startOffset] ? i.startContainer.childNodes[i.startOffset] : i.startContainer, o = 3 == i.endContainer.nodeType || 0 == i.endOffset ? i.endContainer : i.endContainer.childNodes[i.endOffset - 1], l = i.getCommonAncestor();
                            if (n = a.findParentByTagName(l, "a", !0), !n && 1 == l.nodeType)for (var s, d, p, u = l.getElementsByTagName("a"), m = 0; p = u[m++];)if (s = a.getPosition(p, r),
                                    d = a.getPosition(p, o), (s & a.POSITION_FOLLOWING || s & a.POSITION_CONTAINS) && (d & a.POSITION_PRECEDING || d & a.POSITION_CONTAINS)) {
                                n = p;
                                break;
                            }
                            return n;
                        }
                        return n = i.startContainer, n = 1 == n.nodeType ? n : n.parentNode, n && (n = a.findParentByTagName(n, "a", !0)) && !a.isInNodeEndBoundary(i, n) ? n : void 0;
                    }
                };
            },
            __openDialog: function () {
                this.__DialogInit(), this.__initDialogData(), this.__DialogEvent(), this.__queryAppmsgLink(0, this.__g._perPage, "", !0);
            },
            __DialogEvent: function () {
                var t = this, e = this.__g, n = e._linkDialog, i = e._perPage;
                e.form = n.find("#linkForm").validate({
                    rules: {
                        title: {
                            required: !0
                        },
                        href: {
                            required: !0,
                            url: !0
                        }
                    },
                    messages: {
                        title: {
                            required: "文章标题不能为空"
                        },
                        href: {
                            required: "链接地址不能为空",
                            url: "链接地址不合法(必须以http://或https://开头)"
                        }
                    }
                }), n.find("#keyInput").keydown(function (t) {
                    var e = "which" in t ? t.which : t.keyCode;
                    13 == e && n.find("#searchBt").trigger("click");
                }), n.find("#searchCloseBt").click(function () {
                    n.find("#keyInput").val(""), t.__queryAppmsgLink(0, i, "", !0);
                }), n.find("#searchBt").click(function () {
                    t.__queryAppmsgLink(0, i, n.find("#keyInput").val().trim(), !0);
                }), n.find("#linkArrow").click(function () {
                    $(this).find(".arrow").hasClass("down") ? ($(this).find(".arrow").setClass("arrow up"),
                        n.find("#linkChoose").show(), n.popup("resetPosition")) : ($(this).find(".arrow").setClass("arrow down"),
                        n.find("#linkChoose").hide(), n.popup("resetPosition"));
                });
            },
            __initDialogData: function () {
                var t = this.__g, e = t._linkDialog, n = this.editor, i = n.getDomUtils(), a = n.getSelectionRange(), r = a.collapsed ? n.queryCommandValue("link") : n.getSelectionStart();
                r ? (i.findParentByTagName(r, "a", !0) && (r = i.findParentByTagName(r, "a", !0)), e.find("#txtTitle").val(r.text || "你已选中了添加链接的文本内容").attr("disabled", !0).parent().addClass("disabled"),
                    e.find("#txtHref").val(r.href || "http://"), t.canWriteBack = !1) : t.canWriteBack = !0, t._linkDialog.popup("show");
            },
            __DialogInit: function () {
                var t = this, e = this.__g;
                e.canWriteBack = !1, e.form = null;
                var n = wx.T(i, {
                    flag: wx.cgiData.can_use_hyperlink
                });
                e._linkDialog = $(n).popup({
                    title: "新增或编辑超链接",
                    className: "link_dialog",
                    width: "726",
                    autoShow: !1,
                    buttons: [{
                        text: "确定",
                        type: "primary",
                        click: function () {
                            var n = e._linkDialog;
                            if (e.form.form()) {
                                var i = {
                                    href: n.find("#txtHref").val().replace(/^\s+|\s+$/g, ""),
                                    target: "_blank",
                                    data_ue_src: n.find("#txtHref").val().replace(/^\s+|\s+$/g, "")
                                };
                                e.canWriteBack && (i.textValue = n.find("#txtTitle").val().replace(/^\s+|\s+$/g, "")),
                                    t.__insertLink(i), e._linkDialog = null, this.remove();
                            }
                        }
                    }, {
                        text: "取消",
                        click: function () {
                            e._linkDialog = null, this.remove();
                        }
                    }],
                    close: function () {
                        e._linkDialog = null, this.remove();
                    }
                });
            },
            __queryAppmsgLink: function (t, e, i, a) {
                var r = this, o = this.__g, d = o._linkDialog, p = o._perPage;
                d && n.post({
                    url: "/cgi-bin/appmsg",
                    data: {
                        action: "list_ex",
                        begin: t,
                        count: p,
                        query: i,
                        type: 9
                    }
                }, function (t) {
                    "0" == t.base_resp.ret ? (r.__renderAppmsgList(t.app_msg_list), a && new s({
                        container: "#pageBar",
                        perPage: p,
                        totalItemsNum: t.app_msg_cnt,
                        isSimple: !0,
                        callback: function (t) {
                            r.__queryAppmsgLink((t.currentPage - 1) * p, p, d.find("#keyInput").val().trim(), !1);
                        }
                    })) : l.err();
                });
            },
            __renderAppmsgList: function (t) {
                var e = this.__g, n = [], i = e._linkDialog;
                i && (t.each(function (t) {
                    n.push({
                        title: t.title,
                        time: o.unix(t.update_time).format("YYYY-MM-DD"),
                        href: t.link.replace("#rd", "&scene=21#wechat_redirect"),
                        aid: t.aid
                    });
                }), n.length > 0 ? (i.find("#linkList").html(wx.T(a, {
                    data: n
                })), i.popup("resetPosition"), i.find("input[type=radio]").checkbox({
                    onChanged: function (t) {
                        var n = $(t);
                        1 == e.canWriteBack && i.find("#txtTitle").val(n.data("title")), i.find("#txtHref").val(n.data("href")),
                            e.form.form();
                    }
                })) : i.find("#linkList").html('<li class="empty_tips">暂无数据</li>'));
            },
            __insertLink: function (t) {
                var e, n = this.editor, i = n.getUtils();
                n.fireEvent("funcPvUvReport", "link"), t._href && (t._href = i.unhtml(t._href, /[<">]/g)),
                t.href && (t.href = i.unhtml(t.href, /[<">]/g)), t.textValue && (t.textValue = i.unhtml(t.textValue, /[<">]/g)),
                    this.__doLink(e = n.getSelectionRange(), t), e.collapse().select(!0);
            },
            __optimize: function (t) {
                var e = this.editor.getDomUtils(), n = t.startContainer, i = t.endContainer;
                (n = e.findParentByTagName(n, "a", !0)) && t.setStartBefore(n), (i = e.findParentByTagName(i, "a", !0)) && t.setEndAfter(i);
            },
            __doLink: function (t, e) {
                var n = this.editor, i = t.cloneRange(), a = n.getBrowser(), r = n.getDomUtils(), o = n.queryCommandValue("link"), l = n.getUtils();
                this.__optimize(t = t.adjustmentBoundary());
                var s = t.startContainer;
                if (1 == s.nodeType && o && (s = s.childNodes[t.startOffset], s && 1 == s.nodeType && "A" == s.tagName && /^(?:https?|ftp|file)\s*:\s*\/\//.test(s[a.ie ? "innerText" : "textContent"]) && (s[a.ie ? "innerText" : "textContent"] = l.html(e.textValue || e.href))),
                    (!i.collapsed || o) && (t.removeInlineStyle("a"), i = t.cloneRange()), i.collapsed) {
                    var d = t.document.createElement("a"), p = "";
                    e.textValue ? (p = l.html(e.textValue), delete e.textValue) : p = l.html(e.href), r.setAttributes(d, e),
                        s = r.findParentByTagName(i.startContainer, "a", !0), s && r.isInNodeEndBoundary(i, s) && t.setStartAfter(s).collapse(!0),
                        d[a.ie ? "innerText" : "textContent"] = p, t.insertNode(d).selectNode(d);
                } else t.applyInlineStyle("a", e);
            }
        }, e;
    });