define("common/wx/mpEditor/plugin/card.js", ["common/wx/mpEditor/editor_all_min.js", "common/wx/Tips.js",
    "cardticket/send_card.js", "common/wx/Cgi.js", "cardticket/parse_data.js"], function (t) {
    "use strict";
    t("common/wx/mpEditor/editor_all_min.js");
    var e = t("common/wx/Tips.js"), r = t("cardticket/send_card.js"), i = t("common/wx/Cgi.js"), a = wx.cgiData, n = t("cardticket/parse_data.js"), c = function (t) {
        this.domid = t.container, this.biz_uin = t.biz_uin || "";
        var e = (this.container = $(t.container).show(), this);
        e.report_vid_type = [], e._init();
    };
    return c.prototype = {
        getName: function () {
            return "insertcard";
        },
        noCommandReprot: function () {
            return !0;
        },
        getExecCommand: function () {
            var t = this;
            return function () {
                var e = t.editor, r = this;
                if (e) {
                    {
                        e.getDocument();
                    }
                    t._openCardSelect(r);
                }
            };
        },
        _init: function () {
            var t = this;
            a.cardid && i.get({
                url: "/merchant/electroniccardmgr?action=get&card_id=%s".sprintf(a.cardid)
            }, function (e) {
                e.base_resp && 0 == e.base_resp.ret && (t.card_data = $.parseJSON(e.card_detail), t.card_data = n.parse_cardticket(t.card_data),
                    t._initCard());
            });
        },
        _initCard: function () {
            if (this.hasSetContent && this.card_data && !this.isInit) {
                var t = this.editor.getUeditor().getContent(), e = /<iframe [^>]*?class=\"res_iframe card_iframe js_editor_card\"[^>]*?data-cardid=\"\"[^>]*?><\/iframe>/gi;
                if (e.test(t))return void(this.isInit = !0);
                this._insertCard(this.editor, this.card_data, a.cardnum), this.isInit = !0;
            }
        },
        _checkCard: function (t, r) {
            var i = $(t).find("iframe"), a = 0, n = 5;
            return $.each(i, function (t, e) {
                $(e).hasClass("js_editor_card") && a++;
            }), a > n || r && a >= n ? (e.err("正文只能包含%s个卡券".sprintf(n)), !1) : !0;
        },
        _getCardIframe: function (t, e) {
            return ['<iframe class="res_iframe card_iframe js_editor_card" scrolling="no" frameborder="0" ', 'data-cardid="%s" data-num="%s" '.sprintf(t.id, e), 'src="/cgi-bin/readtemplate?t=cardticket/card_preview_tmpl&logo_url=%s&brand_name=%s&title=%s&color=%s&lang=zh_CN"'.sprintf(encodeURIComponent(t.logo_url), encodeURIComponent(t.brand_name), encodeURIComponent(t.title), encodeURIComponent(t.color)), ' data-src="http://mp.weixin.qq.com/bizmall/appmsgcard?action=show&biz=%s&cardid=%s&wechat_card_js=1#wechat_redirect" '.sprintf(this.biz_uin, t.id), "></iframe>"].join("");
        },
        _insertCard: function (t, e, r) {
            var i = this._getCardIframe(e, r);
            t.execCommand("inserthtml", i, !0), this.editor.fireEvent("funcPvUvReport", "insertcard");
        },
        _openCardSelect: function (t) {
            if (this._checkCard(this.editor.getDocument(), !0)) {
                var e = this, i = new r({
                    multi: !1,
                    param: {
                        need_member_card: 1
                    },
                    selectComplete: function (r, i) {
                        e._insertCard(t, r, i);
                    },
                    source: "嵌入图文消息素材"
                });
                i.show();
            }
        },
        _getIframeData: function (t) {
            var e = t.key, r = t.content, i = (t.ifrmName, new RegExp("<iframe[^>]*?" + t.ifrmName + "[^>]*?data-" + e + "=('|\")(.*?)('|\").*?>", "g"));
            return i.test(r) ? RegExp.$2 : null;
        },
        check: function (t) {
            return this._checkCard(t);
        },
        getQueryCommandState: function () {
            return function () {
                var t = this, e = t.selection.getRange().getClosedNode(), r = e && "edui-faked-video" == e.className;
                return r ? 1 : 0;
            };
        },
        getContainer: function () {
            return this.domid;
        },
        getPluginData: function (t) {
            var e = this, r = e._getIframeData({
                content: t.content,
                key: "cardid",
                ifrmName: "js_editor_card"
            });
            if (r) {
                var i = e._getIframeData({
                    content: t.content,
                    key: "num",
                    ifrmName: "js_editor_card"
                });
                t.cardid = r, t.cardquantity = i, t.cardlimit = 0 == i ? 0 : 1;
            }
            return t;
        },
        afterSetContent: function () {
            this.hasSetContent = !0, this._initCard();
        }
    }, c;
});