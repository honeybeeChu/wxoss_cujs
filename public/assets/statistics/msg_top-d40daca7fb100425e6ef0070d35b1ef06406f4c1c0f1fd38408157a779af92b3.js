define("statistics/msg_top.js", ["common/wx/top.js"], function (s) {
    "use strict";
    var t = s("common/wx/top.js"), i = [{
        id: "msg_stat",
        name: "消息分析",
        url: "/wxoss/wx_msganalysis?type=daily&t=statistics/msg"
    }
        //    , {
        //    id: "msg_keyword",
        //    name: "消息关键词",
        //    url: "/wxoss/wx_msganalysis/keyword?t=statistics/msg_keyword&type=-1"
        //}
    ];
    return new t("#topTab", i);
});
