define("common/wx/mpEditor/plugin/vote.js", ["biz_web/widget/date_range.css", "page/vote/dialog_vote_table.css", "widget/date_select.css", "common/wx/mpEditor/editor_all_min.js", "common/wx/Tips.js", "common/wx/pagebar.js", "common/wx/Cgi.js", "vote/new.js", "tpl/vote/vote_table.html.js"], function (require, exports, module) {
    "use strict";
    function iframeUrlSwitcher(e) {
        for (var t = e.content, o = e.returnValue || "content", a = e.wrapper || "add", n = t.split(/<\/?iframe/), i = "", r = " TMP_NAME=", s = [], c = [], l = [], d = 0; d < n.length; d++) {
            if (-1 !== n[d].indexOf("js_editor_vote_card") || -1 !== n[d].indexOf("js_editor_card")) {
                n[d] = n[d].replace(" src=", r).replace(" data-display-src=", " src=").replace(r, " data-display-src="),
                    n[d] = n[d].replace(" style=", r).replace(" data-display-style=", " style=").replace(r, " data-display-style=");
                var u = n[d].match(/data-voteid=\"([^\"]*)/);
                u && u[1] && s.push(u[1]);
                var p = n[d].match(/isMlt=(\d)/);
                p && p[1] && c.push(p[1]), n[d] = n[d].replace(/token=(\d+)&/gi, "token=" + wx.getUrl("token") + "&");
                var v = n[d].match(/data-supervoteid=\"([^\"]*)/);
                v && v[1] && l.push(v[1]);
            }
            i += n[d], d < n.length - 1 && (i += (d % 2 ? "</" : "<") + "iframe");
        }
        switch (i = "add" === a ? i.replace(/(<iframe[\s\S]*js_editor_vote_card[\s\S]*<\/iframe>)/gi, function (e) {
            return ['<span class="vote_area">', e, '<span class="vote_box skin_help po_left"></span>', '<span class="vote_box skin_help po_right"></span>', "</span>"].join("");
        }) : i.replace('<span class="vote_area">', "").replace('<span class="vote_box skin_help po_left"></span><span class="vote_box skin_help po_right"></span></span>', ""),
            o) {
            case"voteid":
                return s;

            case"isMlt":
                return c;

            case"supervoteid":
                return l;

            case"content":
            default:
                return i;
        }
    }

    function setVoteIframeHeight(e) {
        var t = e.getDocument();
        $(t).find("iframe").each(function () {
            var t = this;
            $(t).hasClass("js_editor_vote_card") && $(t).on("load", function () {
                $(t.contentWindow.document).on("finished", function () {
                    var o = $(this).height();
                    t.contentDocument && t.contentDocument.body.offsetHeight ? o = t.contentDocument.body.offsetHeight : t.Document && t.Document.body && t.Document.body.scrollHeight ? o = t.Document.body.scrollHeight : t.document && t.document.body && t.document.body.scrollHeight && (o = t.document.body.scrollHeight),
                        $(t).height(o).off("finished"), e.fireEvent("contentchange");
                }), $(t).off("load");
            });
        });
    }

    require("biz_web/widget/date_range.css"), require("page/vote/dialog_vote_table.css"),
        require("widget/date_select.css"), require("common/wx/mpEditor/editor_all_min.js");
    var Tips = require("common/wx/Tips.js"), Pagebar = require("common/wx/pagebar.js"), Cgi = require("common/wx/Cgi.js");
    template.helper("datestring", function (e) {
        function t(e, t) {
            for (var o = 0, a = t - (e + "").length; a > o; o++)e = "0" + e;
            return e + "";
        }

        var o = new Date(e), a = ["日", "一", "二", "三", "四", "五", "六"], n = "yyyy年mm月dd日".replace(/yyyy|YYYY/, o.getFullYear()).replace(/yy|YY/, t(o.getFullYear() % 100, 2)).replace(/mm|MM/, t(o.getMonth() + 1, 2)).replace(/m|M/g, o.getMonth() + 1).replace(/dd|DD/, t(o.getDate(), 2)).replace(/d|D/g, o.getDate()).replace(/hh|HH/, t(o.getHours(), 2)).replace(/h|H/g, o.getHours()).replace(/ii|II/, t(o.getMinutes(), 2)).replace(/i|I/g, o.getMinutes()).replace(/ss|SS/, t(o.getSeconds(), 2)).replace(/s|S/g, o.getSeconds()).replace(/w/g, o.getDay()).replace(/W/g, a[o.getDay()]);
        return n;
    });
    var Vote = function (e) {
        this.domid = e.container;
        this.container = $(e.container).show();
    };
    return Vote.prototype = {
        getName: function () {
            return "insertvote";
        },
        noCommandReprot: function () {
            return !0;
        },
        getExecCommand: function () {
            var e = this;
            return function () {
                var t = this, o = e.editor;
                o && e.openVotePopup(t);
            };
        },
        doCommand: function (e, t, o) {
            o && console.log("insert vote");
        },
        getContainer: function () {
            return this.domid;
        },
        getPluginData: function (e) {
            e.content = iframeUrlSwitcher({
                content: e.content,
                wrapper: "add"
            });
            var t = iframeUrlSwitcher({
                content: e.content,
                returnValue: "voteid"
            })[0], o = iframeUrlSwitcher({
                content: e.content,
                returnValue: "isMlt"
            })[0], a = iframeUrlSwitcher({
                content: e.content,
                returnValue: "supervoteid"
            });
            return t && "undefined" != typeof o && (e.voteid = t, e.voteismlt = o || store.get("appmsg_vote_" + t)),
            a && (e.supervoteid = a[0]), e;
        },
        beforeSetContent: function (e) {
            var e = iframeUrlSwitcher({
                content: e,
                wrapper: "remove"
            });
            return e;
        },
        afterSetContent: function () {
            setVoteIframeHeight(this.editor);
        },
        insertVoteIframe: function (e, t) {
            var o = this.editor;
            e.execCommand("inserthtml", t.join(""), !0), o.fireEvent("funcPvUvReport", "insertvote");
        },
        _setIframeHeight: function () {
            var e = this;
            setTimeout(function () {
                var t = e.editor.getDocument().getElementsByTagName("iframe");
                if (t && t.length > 0)for (var o = 0; o < t.length; o++)if ($(t[o]).hasClass("js_editor_vote_card")) {
                    var a = t[o], n = $(a).height();
                    a.contentDocument && a.contentDocument.body.offsetHeight ? n = a.contentDocument.body.offsetHeight : a.Document && a.Document.body && a.Document.body.scrollHeight ? n = a.Document.body.scrollHeight : a.document && a.document.body && a.document.body.scrollHeight && (n = a.document.body.scrollHeight),
                        a.style.height = n + "px";
                }
            }, 5e3);
        },
        _checkIframe: function (e, t) {
            var o = $(e).find("iframe"), a = 0;
            return $.each(o, function (e, t) {
                $(t).hasClass("js_editor_vote_card") && a++;
            }), a > 1 || t && a >= 1 ? (Tips.err("正文只能包含%s个投票".sprintf(1)), !1) : !0;
        },
        check: function (e) {
            return this._checkIframe(e);
        },
        openVotePopup: function (ueditor) {
            function renderList(begin) {
                $.ajax({
                    url: wx.url("/cgi-bin/newoperatevote?action=list&vote_status=1&f=json&count=6&begin=" + begin),
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (data.data) {
                            for (var voteData = eval("(" + data.data + ")"), iframeH = 0, i = 0; i < voteData.super_vote_info.length; i++)voteData.super_vote_info[i].height = 150 * voteData.super_vote_info[i].vote_id_list.vote_id.length;
                            $(".js_vote_list").html(compile_html({
                                loading: !1,
                                data: voteData,
                                iframeH: iframeH,
                                biz: data.bizuin,
                                token: wx.data.param
                            })), $(".js_select").checkbox({
                                multi: !1
                            });
                            var total_count = voteData.total_count, count = 6, showpage = begin / count + 1, pagebar = new Pagebar({
                                container: ".js_pager",
                                perPage: count,
                                first: !1,
                                last: !1,
                                isSimple: !0,
                                initShowPage: showpage,
                                totalItemsNum: total_count,
                                callback: function (e) {
                                    var t = e.currentPage;
                                    if (t != showpage)return t--, renderList(t * count), !1;
                                }
                            });
                        } else $(".js_vote_list").html(compile_html({
                            loading: !1,
                            data: {
                                super_vote_info: []
                            }
                        }));
                    },
                    error: function () {
                    }
                });
            }

            var that = this;
            if (!that._checkIframe(this.editor.getDocument(), !0))return null;
            document.body.style.overflow = document.documentElement.style.overflow = "hidden";
            var pop = $("<div class='' id='js_vote_menu'> <div class='title_tab'> <ul class='tab_navs title_tab' data-index='0'> <li data-index='0' class='tab_nav first selected'><a href='#none' id='js_new_vote'>新投票</a></li> <li data-index='1' class='tab_nav'><a href='#none' id='js_vote_list'>已有投票</a></li> </ul> </div> <div class='new_vote js_new_vote'>'+_vote_pop_html+'</div> <div class='vote_list js_vote_list' style='display:none'></div> </div>").popup({
                title: "发起投票",
                className: "vote_edit tc_dialog dialog_normal_form",
                buttons: [{
                    text: "确定",
                    click: function () {
                    },
                    type: "primary"
                }],
                close: function () {
                    this.remove(), document.body.style.overflow = document.documentElement.style.overflow = "auto";
                }
            }), vote = require("vote/new.js");
            vote.initPage(), vote.eventBind();
            var _vote_list_tpl = require("tpl/vote/vote_table.html.js"), compile_html = template.compile(_vote_list_tpl);
            $(".js_vote_list").html(compile_html({
                loading: !0
            })), $("#js_new_vote").click(function () {
                $(".js_new_vote").show(), $("#js_new_vote").parent().addClass("selected"), $(".js_vote_list").hide(),
                    $("#js_vote_list").parent().removeClass("selected");
            }), $("#js_vote_list").click(function () {
                $(".js_new_vote").hide(), $("#js_new_vote").parent().removeClass("selected"), $(".js_vote_list").show(),
                    $("#js_vote_list").parent().addClass("selected");
            }), renderList(0), $(".vote_edit button").click(function () {
                var iframeH = 0, saveBtn = pop.find(":button").last();
                saveBtn.removeClass("btn_loading");
                var supervoteid = 0, biz = 0;
                if ("none" == $(".js_vote_list").css("display")) {
                    var data = vote.getFullData();
                    if (data) {
                        var tempData = eval("(" + data + ")"), optionL = 0;
                        iframeH += 70 * tempData.vote_subject.length;
                        for (var i = 0; i < tempData.vote_subject.length; i++)optionL += tempData.vote_subject[i].options.length;
                        iframeH += 30 * optionL, saveBtn.btn(!1), Cgi.post({
                            url: wx.url("/cgi-bin/newoperatevote?action=create"),
                            dataType: "json",
                            data: {
                                action: "create",
                                json: data
                            },
                            mask: !1
                        }, function (e) {
                            0 == e.base_resp.ret ? (Tips.suc("操作成功"), supervoteid = e.super_vote_id, biz = e.bizuin, that.insertVoteIframe(ueditor, ['<iframe scrolling="no" frameborder="0" class="vote_iframe js_editor_vote_card" style="height:0px;" ', 'src="', wx.url("/cgi-bin/readtemplate?t=vote/vote-new_tmpl&__biz=" + biz + "&supervoteid=%s".sprintf(supervoteid)), '"', 'data-src="', "/mp/newappmsgvote?action=show&__biz=", biz, "&supervoteid=%s#wechat_redirect".sprintf(supervoteid), '"', 'data-supervoteid="%s"'.sprintf(supervoteid), " allowfullscreen >", "</iframe>"]),
                                setVoteIframeHeight(that.editor), pop.remove(), document.body.style.overflow = document.documentElement.style.overflow = "auto",
                                $(".mask").hide()) : (Tips.err(e.base_resp.err_msg), saveBtn.btn(!0));
                        });
                    }
                } else saveBtn.btn(!1), 1 == $(".js_select:checked").length ? (supervoteid = $(".js_select:checked").val(),
                    biz = $(".js_select:checked").data("biz"), iframeH = $(".js_select:checked").data("height"),
                    that.insertVoteIframe(ueditor, ['<iframe scrolling="no" frameborder="0" class="vote_iframe js_editor_vote_card" style="height:0px;" ', 'src="', wx.url("/cgi-bin/readtemplate?t=vote/vote-new_tmpl&__biz=" + biz + "&supervoteid=%s".sprintf(supervoteid)), '"', 'data-src="', "/mp/newappmsgvote?action=show&__biz=", biz, "&supervoteid=%s#wechat_redirect".sprintf(supervoteid), '"', 'data-supervoteid="%s"'.sprintf(supervoteid), " allowfullscreen >", "</iframe>"]),
                    setVoteIframeHeight(that.editor), pop.remove(), document.body.style.overflow = document.documentElement.style.overflow = "auto",
                    saveBtn.btn(!0), $(".mask").hide()) : (Tips.err("请选择投票"), saveBtn.btn(!0));
            });
        }
    }, Vote;
});