define("media/draft.js", ["common/qq/Class.js", "biz_web/lib/store.js", "biz_common/moment.js", "media/report.js"],
    function (t) {
        "use strict";
        var e = t("common/qq/Class.js"), s = t("biz_web/lib/store.js"), a = t("biz_common/moment.js"), i = (t("media/report.js"),
            e.declare({
                init: function (t) {
                    var e = this;
                    if (!e._supportUserData() && "undefined" == typeof localStorage)return !1;
                    e.app_id = t, e.draftId = wx.data.uin + (t ? t : ""), e.timeKey = "Time" + e.draftId, e.appKey = "App" + e.draftId,
                        e.isDropped = !1;
                    var i = Math.floor(wx.cgiData.svr_time - new Date / 1e3);
                    s.get(e.timeKey) && Number(wx.cgiData.updateTime) > a(s.get(e.timeKey), "YYYY-MM-DD HH:mm:ss").unix() + i && this._showImportDraft();
                },
                _supportUserData: function () {
                    try {
                        var t = document.createElement("input");
                        t.addBehavior("#default#userData");
                    } catch (e) {
                        return !1;
                    }
                    return !0;
                },
                _getSaveTime: function () {
                    return s.get(this.timeKey);
                },
                _showTips: function (t) {
                    $("#js_autosave").attr("title", t + " 已自动保存").show(), $("#js_draft_tips").show().find(".js_msg_content").html("已从本地读取" + t + "的草稿");
                },
                _showImportDraft: function () {
                    $("#js_import_tips").show().find(".js_msg_content").html('<span>如果图文内容不是上次编辑的，可尝试<span class="link_global" id="js_import_draft">导入</span>旧草稿。</span>');
                },
                showTips: function () {
                    $("#js_draft_tips").show().find(".js_msg_content").html('<span class="js_msg_content">点击<span class="link_global" id="js_draft_cancel">撤消</span>刚刚的导入操作。</span>');
                },
                clear: function () {
                    s.remove(this.timeKey), s.remove(this.appKey);
                },
                save: function (t) {
                    var e = this;
                    e.clear(), s.set(e.timeKey, a().format("YYYY-MM-DD HH:mm:ss")), s.set(e.appKey, t), $("#js_autosave").attr("title", s.get(e.timeKey) + " 已自动保存").fadeIn(500);
                },
                get: function () {
                    var t = this, e = Math.floor(wx.cgiData.svr_time - new Date / 1e3);
                    if (s.get(t.timeKey) && Number(wx.cgiData.updateTime) > a(s.get(t.timeKey), "YYYY-MM-DD HH:mm:ss").unix() + e)return !1;
                    var i = s.get(this.appKey);
                    return i ? i : !1;
                },
                getRaw: function () {
                    var t = s.get(this.appKey);
                    return t ? t : !1;
                }
            }));
        return i;
    });
