define("biz_common/utils/monitor.js", [], function () {
    var n = [], i = {};
    return i.setAvg = function (e, t, o) {
        return n.push(e + "_" + t + "_" + o), n.push(e + "_" + (t - 1) + "_1"), i;
    }, i.setSum = function (e, t, o) {
        return n.push(e + "_" + t + "_" + o), i;
    }, i.send = function () {
        if (0 != n.length) {
            var i = new Image;
            i.src = "//mp.weixin.qq.com/mp/jsmonitor?idkey=" + n.join(";"), n = [];
        }
    }, i;
});
