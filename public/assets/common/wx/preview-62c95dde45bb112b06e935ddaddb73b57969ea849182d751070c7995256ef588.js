define("common/wx/preview.js", ["common/wx/Tips.js", "widget/img_preview.css", "tpl/preview.html.js"], function (t, n, i) {
    "use strict";
    var e = t("common/wx/Tips.js"), r = (t("widget/img_preview.css"), t("tpl/preview.html.js")), m = function (t) {
        this._initData(t), this._render(), this._initEvent();
    };
    m.prototype = {
        _moImgData: [],
        _msTmplHtml: r,
        _moCurrentImgIdx: 0,
        _initData: function (t) {
            return this._moImgData = t.imgdata || [], this._moCurrentImgIdx = "undefined" == typeof t.current ? 0 : "number" == typeof t.current ? t.current : this._inArray(t.current, t.imgdata),
                this._moImgData.length < 1 ? void this._throwErr() : ((this._moCurrentImgIdx < 0 || this._moCurrentImgIdx >= this._moImgData.length) && (this._moCurrentImgIdx = 0),
                    void(this._moCfg = {
                        view: this._moImgData.length > 1 ? !0 : !1,
                        imgsrc: this._moImgData[this._moCurrentImgIdx].imgsrc,
                        downsrc: this._moImgData[this._moCurrentImgIdx].downsrc,
                        prev: this._moCurrentImgIdx - 1 > -1 ? !0 : !1,
                        next: this._moCurrentImgIdx + 1 < this._moImgData.length ? !0 : !1
                    }));
        },
        _render: function () {
            $(template.compile(this._msTmplHtml)(this._moCfg)).appendTo("body");
        },
        _prev: function () {
            this._moCurrentImgIdx > 0 && ($.extend(this._moCfg, {
                imgsrc: this._moImgData[this._moCurrentImgIdx - 1].imgsrc,
                downsrc: this._moImgData[this._moCurrentImgIdx - 1].downsrc,
                prev: this._moCurrentImgIdx - 1 > 0 ? !0 : !1,
                next: !0
            }), this._changeImg(), this._moCurrentImgIdx--);
        },
        _next: function () {
            this._moCurrentImgIdx + 1 < this._moImgData.length && ($.extend(this._moCfg, {
                imgsrc: this._moImgData[this._moCurrentImgIdx + 1].imgsrc,
                downsrc: this._moImgData[this._moCurrentImgIdx + 1].downsrc,
                next: this._moCurrentImgIdx + 2 < this._moImgData.length ? !0 : !1,
                prev: !0
            }), this._moCurrentImgIdx++, this._changeImg());
        },
        _changeImg: function () {
            var t = $("#img_opr_container");
            this._moCfg.next ? t.removeClass("next_disabled") : t.addClass("next_disabled"), this._moCfg.prev ? t.removeClass("prev_disabled") : t.addClass("prev_disabled"),
                $("#img_dom").hide(), $("#loading_dom").show(), $("#img_dom").find("img").attr("src", ""),
                $("#img_dom").find("img").attr("src", this._moCfg.imgsrc);
        },
        _destory: function () {
            $(".preview_mask").remove(), $("#preview_container").remove();
        },
        _throwErr: function () {
            alert("系统错误，请重试");
        },
        _initEvent: function () {
            var t = this;
            $("#preview_container").on("click", function (n) {
                var i = n.srcElement || n.target;
                $.contains($("#img_container")[0], i) || $.contains($("#img_opr_container")[0], i) || t._destory();
            }), $("#closebtn").on("click", function () {
                return t._destory(), !1;
            }), $("#btnview").on("click", function () {
                return "" != t._moCfg.imgsrc ? window.open(t._moCfg.imgsrc) : e.err("图片资源加载失败。"), !1;
            }), $("#btnnext").on("click", function () {
                t._next();
            }), $("#btnprev").on("click", function () {
                t._prev();
            }), $(document).keyup(function (n) {
                27 == n.keyCode && t._destory(), 37 == n.keyCode && t._prev(), 39 == n.keyCode && t._next();
            }), $("#img_dom").find("img").on("load", function () {
                $("#img_dom").show(), $("#loading_dom").hide();
            });
        },
        _inArray: function (t, n) {
            for (var i, e = 0; i = n[e]; e++)if (t == i.imgsrc)return e;
            return -1;
        }
    }, i.exports = {
        close: function () {
            m._destory();
        },
        show: function (t) {
            return new m(t);
        }
    };
});
