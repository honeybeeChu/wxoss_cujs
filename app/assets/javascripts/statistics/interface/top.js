define("statistics/interface/top.js", ["common/wx/top.js"], function (t) {
    "use strict";
    var e = t("common/wx/top.js"), s = [{
        id: "interface_stat",
        name: "接口分析",
        url: "/wxoss/wx_interfaceanalysis?type=daily"
    }], a = new e("#topTab", s);
    a.selected("interface_stat");
});