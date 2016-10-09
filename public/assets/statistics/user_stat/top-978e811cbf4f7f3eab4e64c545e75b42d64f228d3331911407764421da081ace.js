define("statistics/user_stat/top.js",["common/wx/top.js","biz_common/moment.js"],function(s){
    "use strict";
    var t=s("common/wx/top.js"),e=s("biz_common/moment.js"),n=e().add("d",-1).format("YYYY-MM-DD"),a=[{
        id:"user_stat",
        name:"用户增长",
        url:"/wxoss/wx_useranalysis?source=99999999"
    }
    //    ,{
    //    id:"user_attr",
    //    name:"用户属性",
    //    url:"/misc/useranalysis?action=attr&begin_date=%s&end_date=%s".sprintf(n,n)
    //}
    ];
    return new t("#topTab",a);
});
