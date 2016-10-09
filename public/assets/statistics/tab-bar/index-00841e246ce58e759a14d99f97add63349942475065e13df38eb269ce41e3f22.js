define("statistics/tab-bar/index.js", ["tpl/statistics/tab-bar.html.js", "tpl/statistics/date-submenu.html.js", "statistics/tab-bar/event-emitter.js", "biz_web/ui/dateRange.js"], function (t) {
    "use strict";
    function i(t) {
        e.call(this);
        var t = t || {};
        this.settings = $.extend({}, n, t), this.el = null;
    }

    var s = template.compile(t("tpl/statistics/tab-bar.html.js")), e = (t("tpl/statistics/date-submenu.html.js"),
        t("statistics/tab-bar/event-emitter.js")), n = (t("biz_web/ui/dateRange.js"), {
        name: "Untitled Tab Bar",
        tabs: [{}],
        submenus: {
            type: "",
            options: {}
        }
    }), a = $.extend(i.prototype, e.prototype);
    a.init = function () {
        this.render(), this.listenActions(), this.activate(0);
    }, a.render = function () {
        this.el = s(this.settings), this.$el = $(this.el);
    }, a.listenActions = function () {
        var t = this;
        this.$el.find("div.tabs a").each(function (i, s) {
            var e = $(s);
            e.on("click", function (s) {
                s.stopPropagation(), t.activate(i);
            });
        });
    }, a.activate = function (t, i) {
        this.$el.find("div.tabs a.current").removeClass("current"), this.$el.find("div.tabs a").eq(t).addClass("current");
        var s = this.settings.tabs[t];
        for (var e in r) {
            var n = r[e];
            e === s.submenu ? n.show() : n.hide();
        }
        i || this.emit("tab-selected", t, s);
    };
    var r = {};
    return a.registerSubmenu = function (t, i) {
        r[t] = i, i.hide();
        var s = this;
        setTimeout(function () {
            s.$el.find("div.sub_menu").append(i);
        });
    }, i;
});
