define("common/wx/mpEditor/plugin/shop.js", ["common/wx/Tips.js", "common/wx/pagebar.js", "shop/shopDialog.js", "common/wx/Cgi.js"], function (o) {
    "use strict";
    var i = (o("common/wx/Tips.js"), o("common/wx/pagebar.js"), o("shop/shopDialog.js")), n = (o("common/wx/Cgi.js"),
        function (o) {
            this.domid = o.container, this.biz_uin = o.biz_uin || "";
            this.container = $(o.container).show();
        });
    return n.prototype = {
        getName: function () {
            return "insertshop";
        },
        noCommandReprot: function () {
            return !0;
        },
        getExecCommand: function () {
            var o = this;
            return function () {
                var i = this, n = o.editor;
                n && o.openShopPopup(i);
            };
        },
        doCommand: function (o, i, n) {
            n && console.log("insert shop");
        },
        getContainer: function () {
            return this.domid;
        },
        __insertShop: function (o) {
            var i = this.editor;
            i.execCommand("inserthtml", o, !0), i.funcPvUvReport("insertshop");
        },
        beforeSetContent: function (o) {
            return o = o.replace(/<mpshop([^>]*?)js_editor_shop([^>]*?)><\/mpshop>/g, "<iframe $1js_editor_shop$2></iframe>");
        },
        getPluginData: function (o) {
            return o.content = o.content.replace(/<iframe([^>]*?)js_editor_shop([^>]*?)><\/iframe>/g, "<mpshop $1js_editor_shop$2></mpshop>"),
                o;
        },
        openShopPopup: function () {
            var o = this;
            this.shopDialog = new i({
                onOk: function (i) {
                    var n = i.pid, t = o.biz_uin;
                    o.__insertShop('<p><iframe class="res_iframe js_editor_shop shopcard_iframe" src="/cgi-bin/readtemplate?t=shop/appmsg_shop_tmpl&action=show&__biz={biz_uin}&pid={pid}#wechat_redirect" data-pid={pid} data-biz_uin={biz_uin}></iframe></p>'.format({
                        pid: n,
                        biz_uin: t
                    }));
                }
            });
        }
    }, n;
});
