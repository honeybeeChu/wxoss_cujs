define("biz_web/ui/dateRange.js", ["tpl/biz_web/ui/dateRange.html.js", "biz_web/widget/date_range.css"], function (t, e, a) {
    function s(t) {
        t.title_id = "js_dateRangeTitle" + r, t.inputTrigger = "js_dateRangeTrigger" + r, r++, $(t.container).html(template.compile(d)(t));
        var e = new i(t.title_id, t);
        return e.initOpt = t, e;
    }

    function i(t, e) {
        var a = {
            aToday: "aToday",
            aYesterday: "aYesterday",
            aRecent7Days: "aRecent7Days",
            aRecent14Days: "aRecent14Days",
            aRecent30Days: "aRecent30Days",
            aRecent90Days: "aRecent90Days",
            aDirectDay: [],
            startDate: "",
            endDate: "",
            startCompareDate: "",
            endCompareDate: "",
            minValidDate: "315507600",
            maxValidDate: "",
            success: function () {
                return !0;
            },
            startDateId: "startDate",
            startCompareDateId: "startCompareDate",
            endDateId: "endDate",
            endCompareDateId: "endCompareDate",
            target: "",
            needCompare: !1,
            suffix: "",
            inputTrigger: "input_trigger",
            compareTrigger: "compare_trigger",
            compareCheckboxId: "needCompare",
            calendars: 2,
            dayRangeMax: 0,
            monthRangeMax: 12,
            dateTable: "dateRangeDateTable",
            selectCss: "dateRangeSelected",
            compareCss: "dateRangeCompare",
            coincideCss: "dateRangeCoincide",
            firstCss: "first",
            lastCss: "last",
            clickCss: "today",
            disableGray: "dateRangeGray",
            isToday: "dateRangeToday",
            joinLineId: "joinLine",
            isSingleDay: !1,
            defaultText: " 至 ",
            singleCompare: !1,
            stopToday: !0,
            isTodayValid: !1,
            weekendDis: !1,
            disCertainDay: [],
            disCertainDate: [],
            shortOpr: !1,
            noCalendar: !1,
            theme: "gri",
            autoCommit: !1,
            autoSubmit: !1,
            replaceBtn: "btn_compare",
            onsubmit: $.noop,
            beforeSelect: $.noop
        }, s = this;
        if (this.inputId = t, this.inputCompareId = t + "Compare", this.compareInputDiv = "div_compare_" + t,
                this.mOpts = $.extend({}, a, e), this.mOpts.calendars = Math.min(this.mOpts.calendars, 3),
                this.mOpts.compareCss = "ta" == this.mOpts.theme ? this.mOpts.selectCss : this.mOpts.compareCss,
                this.periodObj = {}, s.mOpts.aDirectDay)for (var i = s.mOpts.aDirectDay, d = 0, r = i.length; r > d; d++)this.periodObj[i[d].id] = i[d].value; else this.periodObj[s.mOpts.aToday] = 0,
            this.periodObj[s.mOpts.aYesterday] = 1, this.periodObj[s.mOpts.aRecent7Days] = 6, this.periodObj[s.mOpts.aRecent14Days] = 13,
            this.periodObj[s.mOpts.aRecent30Days] = 29, this.periodObj[s.mOpts.aRecent90Days] = 89;
        this.startDefDate = "";
        var n = "" == this.mOpts.suffix ? (new Date).getTime() : this.mOpts.suffix;
        this.calendarId = "calendar_" + n, this.dateListId = "dateRangePicker_" + n, this.dateRangeCompareDiv = "dateRangeCompareDiv_" + n,
            this.dateRangeDiv = "dateRangeDiv_" + n, this.compareCheckBoxDiv = "dateRangeCompareCheckBoxDiv_" + n,
            this.submitBtn = "submit_" + n, this.closeBtn = "closeBtn_" + n, this.preMonth = "dateRangePreMonth_" + n,
            this.nextMonth = "dateRangeNextMonth_" + n, this.startDateId = this.mOpts.startDateId + "_" + n,
            this.endDateId = this.mOpts.endDateId + "_" + n, this.compareCheckboxId = this.mOpts.compareCheckboxId + "_" + n,
            this.startCompareDateId = this.mOpts.startCompareDateId + "_" + n, this.endCompareDateId = this.mOpts.endCompareDateId + "_" + n;
        var p = {
            gri: ['<div id="' + this.calendarId + '" class="gri_dateRangeCalendar">', '<table class="gri_dateRangePicker"><tr id="' + this.dateListId + '"></tr></table>', '<div class="gri_dateRangeOptions" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : "") + ">", '<div class="gri_dateRangeInput" id="' + this.dateRangeDiv + '" >', '<input type="text" class="gri_dateRangeInput" name="' + this.startDateId + '" id="' + this.startDateId + '" value="' + this.mOpts.startDate + '" readonly />', '<span id="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="gri_dateRangeInput" name="' + this.endDateId + '" id="' + this.endDateId + '" value="' + this.mOpts.endDate + '" readonly /><br />', "</div>", '<div class="gri_dateRangeInput" id="' + this.dateRangeCompareDiv + '">', '<input type="text" class="gri_dateRangeInput" name="' + this.startCompareDateId + '" id="' + this.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="gri_dateRangeInput" name="' + this.endCompareDateId + '" id="' + this.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" readonly />', "</div>", "<div>", '<input type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="确定" />', '&nbsp;<a id="' + this.closeBtn + '" href="javascript:;">关闭</a>', "</div>", "</div>", "</div>"],
            ta: ['<div id="' + this.calendarId + '" class="ta_calendar ta_calendar2 cf">', '<div class="ta_calendar_cont cf" id="' + this.dateListId + '">', "</div>", '<div class="ta_calendar_footer cf" ' + (this.mOpts.autoSubmit ? ' style="display:none" ' : "") + ">", '<div class="frm_msg">', '<div id="' + this.dateRangeDiv + '">', '<input type="text" class="ta_ipt_text_s" name="' + this.startDateId + '" id="' + this.startDateId + '" value="' + this.mOpts.startDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="ta_ipt_text_s" name="' + this.endDateId + '" id="' + this.endDateId + '" value="' + this.mOpts.endDate + '" readonly /><br />', "</div>", '<div id="' + this.dateRangeCompareDiv + '">', '<input type="text" class="ta_ipt_text_s" name="' + this.startCompareDateId + '" id="' + this.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" readonly />', '<span class="' + this.mOpts.joinLineId + '"> - </span>', '<input type="text" class="ta_ipt_text_s" name="' + this.endCompareDateId + '" id="' + this.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" readonly />', "</div>", "</div>", '<div class="frm_btn">', '<input class="ta_btn ta_btn_primary" type="button" name="' + this.submitBtn + '" id="' + this.submitBtn + '" value="确定" />', '<input class="ta_btn" type="button" id="' + this.closeBtn + '" value="取消"/>', "</div>", "</div>", "</div>"]
        }, m = {
            gri: ['<label class="gri_contrast" for ="' + this.compareCheckboxId + '">', '<input type="checkbox" class="gri_pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1"/>对比', "</label>", '<input type="text" name="' + this.inputCompareId + '" id="' + this.inputCompareId + '" value="" class="gri_date"/>'],
            ta: ['<label class="contrast" for ="' + this.compareCheckboxId + '">', '<input type="checkbox" class="pc" name="' + this.compareCheckboxId + '" id="' + this.compareCheckboxId + '" value="1"/>对比', "</label>", '<div class="ta_date" id="' + this.compareInputDiv + '">', '	<span name="dateCompare" id="' + this.inputCompareId + '" class="date_title"></span>', '	<a class="opt_sel" id="' + this.mOpts.compareTrigger + '" href="#">', '		<i class="i_orderd"></i>', "	</a>", "</div>"]
        };
        if ($(m[this.mOpts.theme].join("")).insertAfter("ta" == this.mOpts.theme ? $("#div_" + this.inputId) : $("#" + this.inputId)),
            this.mOpts.noCalendar && ($("#" + this.inputId).css("display", "none"), $("#" + this.compareCheckboxId).parent().css("display", "none")),
                $(0 < $("#appendParent").length ? "#appendParent" : document.body).append(p[this.mOpts.theme].join("")),
                $("#" + this.calendarId).css("z-index", 9999), 1 > $("#" + this.mOpts.startDateId).length ? $("" != this.mOpts.target ? "#" + this.mOpts.target : "body").append('<input type="hidden" id="' + this.mOpts.startDateId + '" name="' + this.mOpts.startDateId + '" value="' + this.mOpts.startDate + '" />') : $("#" + this.mOpts.startDateId).val(this.mOpts.startDate),
                1 > $("#" + this.mOpts.endDateId).length ? $("" != this.mOpts.target ? "#" + this.mOpts.target : "body").append('<input type="hidden" id="' + this.mOpts.endDateId + '" name="' + this.mOpts.endDateId + '" value="' + this.mOpts.endDate + '" />') : $("#" + this.mOpts.endDateId).val(this.mOpts.endDate),
            1 > $("#" + this.mOpts.compareCheckboxId).length && $("" != this.mOpts.target ? "#" + this.mOpts.target : "body").append('<input type="checkbox" id="' + this.mOpts.compareCheckboxId + '" name="' + this.mOpts.compareCheckboxId + '" value="0" style="display:none;" />'),
                0 == this.mOpts.needCompare ? ($("#" + this.compareInputDiv).css("display", "none"), $("#" + this.compareCheckBoxDiv).css("display", "none"),
                    $("#" + this.dateRangeCompareDiv).css("display", "none"), $("#" + this.compareCheckboxId).attr("disabled", !0),
                    $("#" + this.startCompareDateId).attr("disabled", !0), $("#" + this.endCompareDateId).attr("disabled", !0),
                    $("#" + this.compareCheckboxId).parent().css("display", "none"), $("#" + this.mOpts.replaceBtn).length > 0 && $("#" + this.mOpts.replaceBtn).hide()) : (1 > $("#" + this.mOpts.startCompareDateId).length ? $("" != this.mOpts.target ? "#" + this.mOpts.target : "body").append('<input type="hidden" id="' + this.mOpts.startCompareDateId + '" name="' + this.mOpts.startCompareDateId + '" value="' + this.mOpts.startCompareDate + '" />') : $("#" + this.mOpts.startCompareDateId).val(this.mOpts.startCompareDate),
                    1 > $("#" + this.mOpts.endCompareDateId).length ? $("" != this.mOpts.target ? "#" + this.mOpts.target : "body").append('<input type="hidden" id="' + this.mOpts.endCompareDateId + '" name="' + this.mOpts.endCompareDateId + '" value="' + this.mOpts.endCompareDate + '" />') : $("#" + this.mOpts.endCompareDateId).val(this.mOpts.endCompareDate),
                ("" == this.mOpts.startCompareDate || "" == this.mOpts.endCompareDate) && ($("#" + this.compareCheckboxId).attr("checked", !1),
                    $("#" + this.mOpts.compareCheckboxId).attr("checked", !1))), this.dateInput = this.startDateId,
                this.changeInput(this.dateInput), $("#" + this.startDateId).bind("click", function () {
                return s.endCompareDateId == s.dateInput && $("#" + s.startCompareDateId).val(s.startDefDate),
                    s.startDefDate = "", s.removeCSS(1), s.changeInput(s.startDateId), !1;
            }), $("#" + this.calendarId).bind("click", function (t) {
                t.stopPropagation();
            }), $("#" + this.startCompareDateId).bind("click", function () {
                return s.endDateId == s.dateInput && $("#" + s.startDateId).val(s.startDefDate), s.startDefDate = "",
                    s.removeCSS(0), s.changeInput(s.startCompareDateId), !1;
            }), $("#" + this.submitBtn).bind("click", function () {
                return s.close(1), s.mOpts.success({
                    startDate: $("#" + s.mOpts.startDateId).val(),
                    endDate: $("#" + s.mOpts.endDateId).val(),
                    needCompare: $("#" + s.mOpts.compareCheckboxId).val(),
                    startCompareDate: $("#" + s.mOpts.startCompareDateId).val(),
                    endCompareDate: $("#" + s.mOpts.endCompareDateId).val()
                }), s.mOpts.onsubmit({
                    startDate: $("#" + s.mOpts.startDateId).val(),
                    endDate: $("#" + s.mOpts.endDateId).val(),
                    needCompare: $("#" + s.mOpts.compareCheckboxId).val(),
                    startCompareDate: $("#" + s.mOpts.startCompareDateId).val(),
                    endCompareDate: $("#" + s.mOpts.endCompareDateId).val()
                }), !1;
            }), $("#" + this.closeBtn).bind("click", function () {
                return s.close(), !1;
            }), $("#" + this.inputId).bind("click", function () {
                return s.init(), s.show(!1, s), !1;
            }), $("#" + this.mOpts.inputTrigger).bind("click", function () {
                return "none" == $("#" + s.calendarId).css("display") ? (s.init(), s.show(!1, s)) : s.close(),
                    !1;
            }), $("#" + this.mOpts.compareTrigger).bind("click", function () {
                return s.init(!0), s.show(!0, s), !1;
            }), $("#" + this.inputCompareId).bind("click", function () {
                return s.init(!0), s.show(!0, s), !1;
            }), this.mOpts.singleCompare && ("ta" === this.mOpts.theme ? ($("#" + s.startDateId).val(s.mOpts.startDate),
                $("#" + s.endDateId).val(s.mOpts.startDate), $("#" + s.startCompareDateId).val(s.mOpts.startCompareDate),
                $("#" + s.endCompareDateId).val(s.mOpts.startCompareDate)) : ($("#" + s.startDateId).val(s.mOpts.startDate),
                $("#" + s.endDateId).val(s.mOpts.startDate), $("#" + s.startCompareDateId).val(s.mOpts.startCompareDate),
                $("#" + s.endCompareDateId).val(s.mOpts.startCompareDate), $("#" + this.compareCheckboxId).attr("checked", !0),
                $("#" + this.mOpts.compareCheckboxId).attr("checked", !0))), $("#" + this.dateRangeCompareDiv).css("display", $("#" + this.compareCheckboxId).attr("checked") ? "" : "none"),
                $("#" + this.compareInputDiv).css("display", $("#" + this.compareCheckboxId).attr("checked") ? "" : "none"),
                $("#" + this.compareCheckboxId).bind("click", function () {
                    $("#" + s.inputCompareId).css("display", this.checked ? "" : "none"), $("#" + s.dateRangeCompareDiv).css("display", this.checked ? "" : "none"),
                        $("#" + s.compareInputDiv).css("display", this.checked ? "" : "none"), $("#" + s.startCompareDateId).css("disabled", this.checked ? !1 : !0),
                        $("#" + s.endCompareDateId).css("disabled", this.checked ? !1 : !0), $("#" + s.mOpts.compareCheckboxId).attr("checked", $("#" + s.compareCheckboxId).attr("checked")),
                        $("#" + s.mOpts.compareCheckboxId).val($("#" + s.compareCheckboxId).attr("checked") ? 1 : 0),
                        $("#" + s.compareCheckboxId).attr("checked") ? (sDate = s.str2date($("#" + s.startDateId).val()),
                            sTime = sDate.getTime(), eDate = s.str2date($("#" + s.endDateId).val()), eTime = eDate.getTime(),
                            scDate = $("#" + s.startCompareDateId).val(), ecDate = $("#" + s.endCompareDateId).val(),
                        ("" == scDate || "" == ecDate) && (ecDate = s.str2date(s.date2ymd(sDate).join("-")), ecDate.setDate(ecDate.getDate() - 1),
                            scDate = s.str2date(s.date2ymd(sDate).join("-")), scDate.setDate(scDate.getDate() - (eTime - sTime) / 864e5 - 1),
                        ecDate.getTime() < 1e3 * s.mOpts.minValidDate && (scDate = sDate, ecDate = eDate), ecDate.getTime() >= 1e3 * s.mOpts.minValidDate && scDate.getTime() < 1e3 * s.mOpts.minValidDate && (scDate.setTime(1e3 * s.mOpts.minValidDate),
                            scDate = s.str2date(s.date2ymd(scDate).join("-")), ecDate.setDate(scDate.getDate() + (eTime - sTime) / 864e5 - 1)),
                            $("#" + s.startCompareDateId).val(s.formatDate(s.date2ymd(scDate).join("-"))), $("#" + s.endCompareDateId).val(s.formatDate(s.date2ymd(ecDate).join("-")))),
                            s.addCSS(1), s.changeInput(s.startCompareDateId)) : (s.removeCSS(1), s.changeInput(s.startDateId)),
                        s.close(1), s.mOpts.success({
                        startDate: $("#" + s.mOpts.startDateId).val(),
                        endDate: $("#" + s.mOpts.endDateId).val(),
                        needCompare: $("#" + s.mOpts.compareCheckboxId).val(),
                        startCompareDate: $("#" + s.mOpts.startCompareDateId).val(),
                        endCompareDate: $("#" + s.mOpts.endCompareDateId).val()
                    });
                }), this.init(), this.close(1), this.mOpts.replaceBtn && $("#" + this.mOpts.replaceBtn).length > 0) {
            var h = $(this.mOpts.container);
            $("#" + s.compareCheckboxId).hide(), h.find(".contrast").hide(), $("#" + this.mOpts.replaceBtn).bind("click", function () {
                var t = this, e = $("#" + s.compareCheckboxId);
                e.click(), e.attr("checked") ? function () {
                    e.removeAttr("checked"), h.find(".contrast").hide(), $(t).text("按时间对比");
                }() : function () {
                    e.attr("checked", "checked"), h.find(".contrast").show(), $(t).text("取消对比");
                }();
            });
        }
        this.mOpts.autoCommit && this.mOpts.success({
            startDate: $("#" + s.mOpts.startDateId).val(),
            endDate: $("#" + s.mOpts.endDateId).val(),
            needCompare: $("#" + s.mOpts.compareCheckboxId).val(),
            startCompareDate: $("#" + s.mOpts.startCompareDateId).val(),
            endCompareDate: $("#" + s.mOpts.endCompareDateId).val()
        }), $(document).bind("click", function () {
            s.close();
        });
    }

    var d = t("tpl/biz_web/ui/dateRange.html.js");
    t("biz_web/widget/date_range.css");
    var r = 0;
    a.exports = s, i.prototype.init = function (t) {
        var e = this, a = "undefined" != typeof t ? t && $("#" + e.compareCheckboxId).attr("checked") : $("#" + e.compareCheckboxId).attr("checked");
        $("#" + this.dateListId).empty();
        var s = "" == this.mOpts.endDate ? new Date : this.str2date(this.mOpts.endDate);
        this.calendar_endDate = new Date(s.getFullYear(), s.getMonth() + 1, 0);
        for (var i = 0; i < this.mOpts.calendars; i++) {
            var d = null;
            if ("ta" == this.mOpts.theme ? d = this.fillDate(s.getFullYear(), s.getMonth(), i) : (d = document.createElement("td"),
                    $(d).append(this.fillDate(s.getFullYear(), s.getMonth(), i)), $(d).css("vertical-align", "top")),
                0 == i)$("#" + this.dateListId).append(d); else {
                var r = "ta" == this.mOpts.theme ? $("#" + this.dateListId).find("table").get(0) : $("#" + this.dateListId).find("td").get(0);
                $(r).before(d);
            }
            s.setMonth(s.getMonth() - 1, 1);
        }
        $("#" + this.preMonth).bind("click", function () {
            return e.calendar_endDate.setMonth(e.calendar_endDate.getMonth() - 1, 1), e.mOpts.endDate = e.date2ymd(e.calendar_endDate).join("-"),
                e.init(t), 1 == e.mOpts.calendars && e.changeInput("" == $("#" + e.startDateId).val() ? e.startDateId : e.endDateId),
                !1;
        }), $("#" + this.nextMonth).bind("click", function () {
            return e.calendar_endDate.setMonth(e.calendar_endDate.getMonth() + 1, 1), e.mOpts.endDate = e.date2ymd(e.calendar_endDate).join("-"),
                e.init(t), 1 == e.mOpts.calendars && e.changeInput("" == $("#" + e.startDateId).val() ? e.startDateId : e.endDateId),
                !1;
        }), this.calendar_startDate = new Date(s.getFullYear(), s.getMonth() + 1, 1), this.endDateId != this.dateInput && this.endCompareDateId != this.dateInput && this.addCSS(a && "undefined" != typeof t ? 1 : 0),
            e.addCSS(a && "undefined" != typeof t ? 1 : 0), $("#" + e.inputCompareId).css("display", a ? "" : "none"),
            $("#" + this.compareInputDiv).css("display", $("#" + this.compareCheckboxId).attr("checked") ? "" : "none");
        for (var n in e.periodObj)$("#" + n).length > 0 && ($("#" + n).unbind("click"), $("#" + n).bind("click", function () {
            var t = "ta" == e.mOpts.theme ? "active" : "a";
            $(this).parent().nextAll().removeClass(t), $(this).parent().prevAll().removeClass(t),
                $(this).parent().addClass(t);
            var a = e.getSpecialPeriod(e.periodObj[$(this).attr("id")]);
            $("#" + e.startDateId).val(e.formatDate(a.otherday)), $("#" + e.endDateId).val(e.formatDate(a.today)),
                $("#" + e.mOpts.startDateId).val($("#" + e.startDateId).val()), $("#" + e.mOpts.endDateId).val($("#" + e.endDateId).val()),
                "ta" == e.mOpts.theme ? $("#" + e.compareInputDiv).hide() : $("#" + e.inputCompareId).css("display", "none"),
                $("#" + e.compareCheckboxId).attr("checked", !1), $("#" + e.mOpts.compareCheckboxId).attr("checked", !1),
                $("#" + this.compareInputDiv).css("display", $("#" + this.compareCheckboxId).attr("checked") ? "" : "none"),
                e.close(1), $("#" + e.startCompareDateId).val(""), $("#" + e.endCompareDateId).val(""),
                $("#" + e.mOpts.startCompareDateId).val(""), $("#" + e.mOpts.endCompareDateId).val(""),
                $("#" + e.mOpts.compareCheckboxId).val(0), $("#" + e.mOpts.replaceBtn).length > 0 && ($(".contrast").hide(),
                $("#" + e.mOpts.replaceBtn).text("按时间对比")), e.mOpts.success({
                startDate: $("#" + e.mOpts.startDateId).val(),
                endDate: $("#" + e.mOpts.endDateId).val(),
                needCompare: $("#" + e.mOpts.compareCheckboxId).val(),
                startCompareDate: $("#" + e.mOpts.startCompareDateId).val(),
                endCompareDate: $("#" + e.mOpts.endCompareDateId).val()
            });
        }));
        $(document).bind("click", function () {
            e.close();
        }), $("#" + this.inputId).bind("change", function () {
            "" === $(this).val() && ($("#" + e.startDateId).val(""), $("#" + e.endDateId).val(""), $("#" + e.startCompareDateId).val(""),
                $("#" + e.endCompareDateId).val(""));
        });
    }, i.prototype.getSpecialPeriod = function (t) {
        var e = this, a = new Date;
        1 == e.mOpts.isTodayValid && "" != e.mOpts.isTodayValid || 2 > t ? "" : a.setTime(a.getTime() - 864e5);
        var s = a.getTime() - 24 * t * 60 * 60 * 1e3 < 1e3 * e.mOpts.minValidDate ? 1e3 * e.mOpts.minValidDate : a.getTime() - 24 * t * 60 * 60 * 1e3, i = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
        a.setTime(s);
        var d = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
        return t == e.periodObj.aYesterday && (i = d), {
            today: i,
            otherday: d
        };
    }, i.prototype.getCurrentDate = function () {
        return {
            startDate: $("#" + this.startDateId).val(),
            endDate: $("#" + this.endDateId).val(),
            needCompare: $("#" + this.mOpts.compareCheckboxId).val(),
            startCompareDate: $("#" + this.mOpts.startCompareDateId).val(),
            endCompareDate: $("#" + this.mOpts.endCompareDateId).val()
        };
    }, i.prototype.removeCSS = function (t, e) {
        "undefined" == typeof e && (e = this.mOpts.theme + "_" + this.mOpts.coincideCss), "undefined" == typeof t && (t = 0);
        for (var a = new Date(this.calendar_startDate.getFullYear(), this.calendar_startDate.getMonth(), this.calendar_startDate.getDate()), s = "", i = new Date(a); i.getTime() <= this.calendar_endDate.getTime(); i.setDate(i.getDate() + 1))s = 0 == t ? this.mOpts.theme + "_" + this.mOpts.selectCss : this.mOpts.theme + "_" + this.mOpts.compareCss,
            $("#" + this.calendarId + "_" + this.date2ymd(i).join("-")).removeClass(s), $("#" + this.calendarId + "_" + this.date2ymd(i).join("-")).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss);
    }, i.prototype.addCSS = function (t, e) {
        "undefined" == typeof e && (e = this.mOpts.theme + "_" + this.mOpts.coincideCss), "undefined" == typeof t && (t = 0);
        for (var a = this.str2date($("#" + this.startDateId).val()), s = this.str2date($("#" + this.endDateId).val()), i = this.str2date($("#" + this.startCompareDateId).val()), d = this.str2date($("#" + this.endCompareDateId).val()), r = 0 == t ? a : i, n = 0 == t ? s : d, p = "", m = new Date(r); m.getTime() <= n.getTime(); m.setDate(m.getDate() + 1))0 == t ? (p = this.mOpts.theme + "_" + this.mOpts.selectCss,
            $("#" + this.calendarId + "_" + this.date2ymd(m).join("-")).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss),
            $("#" + this.calendarId + "_" + this.date2ymd(m).join("-")).removeClass(p)) : p = this.mOpts.theme + "_" + this.mOpts.compareCss,
            $("#" + this.calendarId + "_" + this.date2ymd(m).join("-")).attr("class", p);
        "ta" == this.mOpts.theme && ($("#" + this.calendarId + "_" + this.date2ymd(new Date(r)).join("-")).removeClass().addClass(this.mOpts.firstCss),
            $("#" + this.calendarId + "_" + this.date2ymd(new Date(n)).join("-")).removeClass().addClass(this.mOpts.lastCss),
        r.getTime() == n.getTime() && $("#" + this.calendarId + "_" + this.date2ymd(new Date(n)).join("-")).removeClass().addClass(this.mOpts.clickCss));
    }, i.prototype.checkDateRange = function (t, e) {
        var a = this.str2date(t), s = this.str2date(e), i = a.getTime(), d = s.getTime(), r = 31 * this.mOpts.monthRangeMax + this.mOpts.dayRangeMax, n = Math.abs(d - i) / 864e5;
        return r > 0 && n > r ? (alert("所选日期跨度最大不能超过" + r + "天"), !1) : !0;
    }, i.prototype.selectDate = function (t) {
        this.changeInput(this.dateInput);
        var e = this.formatDate(t);
        if (this.startDateId == this.dateInput)this.removeCSS(0), this.removeCSS(1), $("#" + this.calendarId + "_" + t).attr("class", "ta" == this.mOpts.theme ? this.mOpts.clickCss : this.mOpts.theme + "_" + this.mOpts.selectCss),
            this.startDefDate = $("#" + this.dateInput).val(), $("#" + this.dateInput).val(e), 1 == this.mOpts.singleCompare || 1 == this.mOpts.isSingleDay ? (this.dateInput = this.startDateId,
            $("#" + this.endDateId).val(e), (this.mOpts.shortOpr || this.mOpts.autoSubmit) && this.close(1),
            this.mOpts.success({
                startDate: $("#" + this.mOpts.startDateId).val(),
                endDate: $("#" + this.mOpts.endDateId).val(),
                needCompare: $("#" + this.mOpts.compareCheckboxId).val(),
                startCompareDate: $("#" + this.mOpts.startCompareDateId).val(),
                endCompareDate: $("#" + this.mOpts.endCompareDateId).val()
            })) : this.dateInput = this.endDateId; else if (this.endDateId == this.dateInput) {
            if ("" == $("#" + this.startDateId).val())return this.dateInput = this.startDateId, this.selectDate(t),
                !1;
            if (0 == this.checkDateRange($("#" + this.startDateId).val(), t))return !1;
            -1 == this.compareStrDate(t, $("#" + this.startDateId).val()) && ($("#" + this.dateInput).val($("#" + this.startDateId).val()),
                $("#" + this.startDateId).val(e), e = $("#" + this.dateInput).val()), $("#" + this.dateInput).val(e),
                this.dateInput = this.startDateId, this.removeCSS(0), this.addCSS(0), this.startDefDate = "",
            this.mOpts.autoSubmit && (this.close(1), this.mOpts.success({
                startDate: $("#" + this.mOpts.startDateId).val(),
                endDate: $("#" + this.mOpts.endDateId).val(),
                needCompare: $("#" + this.mOpts.compareCheckboxId).val(),
                startCompareDate: $("#" + this.mOpts.startCompareDateId).val(),
                endCompareDate: $("#" + this.mOpts.endCompareDateId).val()
            }));
        } else if (this.startCompareDateId == this.dateInput)this.removeCSS(1), this.removeCSS(0),
            $("#" + this.calendarId + "_" + t).attr("class", "ta" == this.mOpts.theme ? this.mOpts.clickCss : this.mOpts.theme + "_" + this.mOpts.compareCss),
            this.startDefDate = $("#" + this.dateInput).val(), $("#" + this.dateInput).val(e), 1 == this.mOpts.singleCompare || 1 == this.mOpts.isSingleDay ? (this.dateInput = this.startCompareDateId,
            $("#" + this.endCompareDateId).val(e), (this.mOpts.shortOpr || this.mOpts.autoSubmit) && this.close(1),
            this.mOpts.success({
                startDate: $("#" + this.mOpts.startDateId).val(),
                endDate: $("#" + this.mOpts.endDateId).val(),
                needCompare: $("#" + this.mOpts.compareCheckboxId).val(),
                startCompareDate: $("#" + this.mOpts.startCompareDateId).val(),
                endCompareDate: $("#" + this.mOpts.endCompareDateId).val()
            })) : this.dateInput = this.endCompareDateId; else if (this.endCompareDateId == this.dateInput) {
            if ("" == $("#" + this.startCompareDateId).val())return this.dateInput = this.startCompareDateId,
                this.selectDate(t), !1;
            if (0 == this.checkDateRange($("#" + this.startCompareDateId).val(), t))return !1;
            -1 == this.compareStrDate(t, $("#" + this.startCompareDateId).val()) && ($("#" + this.dateInput).val($("#" + this.startCompareDateId).val()),
                $("#" + this.startCompareDateId).val(e), e = $("#" + this.dateInput).val()), $("#" + this.dateInput).val(e),
                this.dateInput = this.startCompareDateId, this.removeCSS(1), this.addCSS(1), this.startDefDate = "",
            this.mOpts.autoSubmit && (this.close(1), this.mOpts.success({
                startDate: $("#" + this.mOpts.startDateId).val(),
                endDate: $("#" + this.mOpts.endDateId).val(),
                needCompare: $("#" + this.mOpts.compareCheckboxId).val(),
                startCompareDate: $("#" + this.mOpts.startCompareDateId).val(),
                endCompareDate: $("#" + this.mOpts.endCompareDateId).val()
            }));
        }
    }, i.prototype.show = function (t, e) {
        if (!this._disabled) {
            $("#" + e.dateRangeDiv).css("display", t ? "none" : ""), $("#" + e.dateRangeCompareDiv).css("display", t ? "" : "none");
            var a = t ? $("#" + this.inputCompareId).offset() : $("#" + this.inputId).offset(), s = (t ? $("#" + this.inputCompareId).height() : $("#" + this.inputId).height(),
                parseInt($(document.body)[0].clientWidth)), i = a.left;
            return $("#" + this.calendarId).css("display", "block"), (1 == this.mOpts.singleCompare || 1 == this.mOpts.isSingleDay) && ($("#" + this.endDateId).css("display", "none"),
                $("#" + this.endCompareDateId).css("display", "none"), $("#" + this.mOpts.joinLineId).css("display", "none"),
                $("." + this.mOpts.joinLineId).css("display", "none")), s > 0 && $("#" + this.calendarId).width() + a.left > s && (i = a.left + $("#" + this.inputId).width() - $("#" + this.calendarId).width() + (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent) ? 5 : 0),
            "ta" == e.mOpts.theme && (i += 50)), $("#" + this.calendarId).css("left", i + "px"), $("#" + this.calendarId).css("top", a.top + ("ta" == e.mOpts.theme ? 35 : 22) + "px"),
                this.changeInput(t ? this.startCompareDateId : this.startDateId), !1;
        }
    }, i.prototype.close = function (t) {
        if (t) {
            this.mOpts.shortOpr === !0 ? ($("#" + this.inputId).val($("#" + this.startDateId).val()),
                $("#" + this.inputCompareId).val($("#" + this.startCompareDateId).val())) : $("#" + this.inputId).val($("#" + this.startDateId).val() + ("" == $("#" + this.endDateId).val() ? "" : this.mOpts.defaultText + $("#" + this.endDateId).val()));
            var e = 1 == this.mOpts.isTodayValid && "" != this.mOpts.isTodayValid ? (new Date).getTime() : (new Date).getTime() - 864e5, a = this.str2date($("#" + this.startDateId).val()).getTime(), s = this.str2date($("#" + this.endDateId).val()).getTime();
            if (a > s) {
                var i = $("#" + this.startDateId).val();
                $("#" + this.startDateId).val($("#" + this.endDateId).val()), $("#" + this.endDateId).val(i);
            }
            var d = this.str2date($("#" + this.startCompareDateId).val()).getTime(), r = this.str2date($("#" + this.endCompareDateId).val()).getTime();
            if (d > r) {
                var i = $("#" + this.startCompareDateId).val();
                $("#" + this.startCompareDateId).val($("#" + this.endCompareDateId).val()), $("#" + this.endCompareDateId).val(i);
            }
            var n = 1 == this.mOpts.shortOpr ? $("#" + this.startDateId).val() : $("#" + this.startDateId).val() + ("" == $("#" + this.endDateId).val() ? "" : this.mOpts.defaultText + $("#" + this.endDateId).val()), p = document.getElementById(this.inputId);
            if (p && "INPUT" == p.tagName ? ($("#" + this.inputId).val(n), $("#" + this.inputCompareId).is(":visible") && $("#" + this.inputCompareId).val(c)) : ($("#" + this.inputId).html(n),
                $("#" + this.inputCompareId).is(":visible") && $("#" + this.inputCompareId).html(c)), "ta" != this.mOpts.theme && "" != $("#" + this.startCompareDateId).val() && "" != $("#" + this.endCompareDateId).val()) {
                var m = this.str2date($("#" + this.startCompareDateId).val()).getTime(), h = this.str2date($("#" + this.endCompareDateId).val()).getTime(), o = m + s - a;
                o > e && (o = e, $("#" + this.startCompareDateId).val(this.formatDate(this.date2ymd(new Date(o + a - s)).join("-")))),
                    $("#" + this.endCompareDateId).val(this.formatDate(this.date2ymd(new Date(o)).join("-")));
                var m = this.str2date($("#" + this.startCompareDateId).val()).getTime(), h = this.str2date($("#" + this.endCompareDateId).val()).getTime();
                if (m > h) {
                    var i = $("#" + this.startCompareDateId).val();
                    $("#" + this.startCompareDateId).val($("#" + this.endCompareDateId).val()), $("#" + this.endCompareDateId).val(i);
                }
            }
            var c = 1 == this.mOpts.shortOpr ? $("#" + this.startCompareDateId).val() : $("#" + this.startCompareDateId).val() + ("" == $("#" + this.endCompareDateId).val() ? "" : this.mOpts.defaultText + $("#" + this.endCompareDateId).val());
            p && "INPUT" == p.tagName ? $("#" + this.inputCompareId).val(c) : $("#" + this.inputCompareId).html(c);
            $("#" + this.mOpts.startDateId).val($("#" + this.startDateId).val()), $("#" + this.mOpts.endDateId).val($("#" + this.endDateId).val()),
                $("#" + this.mOpts.startCompareDateId).val($("#" + this.startCompareDateId).val()), $("#" + this.mOpts.endCompareDateId).val($("#" + this.endCompareDateId).val());
            for (var l in this.periodObj)$("#" + this.mOpts[l]) && $("#" + this.mOpts[l]).parent().removeClass("a");
        }
        return $("#" + this.calendarId).css("display", "none"), !1;
    }, i.prototype.fillDate = function (t, e, a) {
        var s = this, i = "ta" == this.mOpts.theme, d = new Date(t, e, 1), r = new Date(t, e, 1), n = r.getDay();
        r.setDate(1 - n);
        var p = new Date(t, e + 1, 0), m = new Date(t, e + 1, 0);
        n = m.getDay(), m.setDate(m.getDate() + 6 - n);
        var h = new Date, o = h.getDate(), c = h.getMonth(), l = h.getFullYear(), D = document.createElement("table");
        if (i) {
            D.className = this.mOpts.dateTable, cap = document.createElement("caption"), $(cap).append(t + "年" + (e + 1) + "月"),
                $(D).append(cap), thead = document.createElement("thead"), tr = document.createElement("tr");
            for (var I = ["日", "一", "二", "三", "四", "五", "六"], C = 0; 7 > C; C++)th = document.createElement("th"),
                $(th).append(I[C]), $(tr).append(th);
            $(thead).append(tr), $(D).append(thead), tr = document.createElement("tr"), td = document.createElement("td"),
            0 == a && $(td).append('<a href="javascript:void(0);" id="' + this.nextMonth + '"><i class="i_next"></i></a>'),
            a + 1 == this.mOpts.calendars && $(td).append('<a href="javascript:void(0);" id="' + this.preMonth + '"><i class="i_pre"></i></a>'),
                $(td).attr("colSpan", 7), $(td).css("text-align", "center"), $(tr).append(td), $(D).append(tr);
        } else {
            D.className = this.mOpts.theme + "_" + this.mOpts.dateTable, tr = document.createElement("tr"),
                td = document.createElement("td"), 0 == a && $(td).append('<a href="javascript:void(0);" id="' + this.nextMonth + '" class="gri_dateRangeNextMonth"><span>next</span></a>'),
            a + 1 == this.mOpts.calendars && $(td).append('<a href="javascript:void(0);" id="' + this.preMonth + '" class="gri_dateRangePreMonth"><span>pre</span></a>'),
                $(td).append(t + "年" + (e + 1) + "月"), $(td).attr("colSpan", 7), $(td).css("text-align", "center"),
                $(td).css("background-color", "#F9F9F9"), $(tr).append(td), $(D).append(tr);
            var I = ["日", "一", "二", "三", "四", "五", "六"];
            tr = document.createElement("tr");
            for (var C = 0; 7 > C; C++)td = document.createElement("td"), $(td).append(I[C]), $(tr).append(td);
            $(D).append(tr);
        }
        for (var v = "", O = 0, u = "", g = r; g.getTime() <= m.getTime(); g.setDate(g.getDate() + 1)) {
            if (g.getTime() < d.getTime())v = this.mOpts.theme + "_" + this.mOpts.disableGray, O = "-1"; else if (g.getTime() > p.getTime())v = this.mOpts.theme + "_" + this.mOpts.disableGray,
                O = "1"; else if (1 == this.mOpts.stopToday && g.getTime() > h.getTime() || g.getTime() < 1e3 * s.mOpts.minValidDate || "" !== s.mOpts.maxValidDate && g.getTime() > 1e3 * s.mOpts.maxValidDate)v = this.mOpts.theme + "_" + this.mOpts.disableGray,
                O = "2"; else {
                if (O = "0", g.getDate() == o && g.getMonth() == c && g.getFullYear() == l ? 1 == this.mOpts.isTodayValid ? v = this.mOpts.theme + "_" + this.mOpts.isToday : (v = this.mOpts.theme + "_" + this.mOpts.disableGray,
                        O = "2") : v = "", !this.mOpts.weekendDis || 6 != g.getDay() && 0 != g.getDay() || (v = this.mOpts.theme + "_" + this.mOpts.disableGray,
                        O = "3"), this.mOpts.disCertainDay && this.mOpts.disCertainDay.length > 0)for (var y in this.mOpts.disCertainDay)isNaN(this.mOpts.disCertainDay[y]) || g.getDay() !== this.mOpts.disCertainDay[y] || (v = this.mOpts.theme + "_" + this.mOpts.disableGray,
                    O = "4");
                if (this.mOpts.disCertainDate && this.mOpts.disCertainDate.length > 0) {
                    var f = !1;
                    for (var y in this.mOpts.disCertainDate)if (!isNaN(this.mOpts.disCertainDate[y]) || isNaN(parseInt(this.mOpts.disCertainDate[y])))if (this.mOpts.disCertainDate[0] === !0) {
                        if (f = !(g.getDate() === this.mOpts.disCertainDate[y]), !f)break;
                    } else if (f = !(g.getDate() !== this.mOpts.disCertainDate[y]))break;
                    f && (v = this.mOpts.theme + "_" + this.mOpts.disableGray, O = "4");
                }
            }
            0 == g.getDay() && (tr = document.createElement("tr")), td = document.createElement("td"),
                td.innerHTML = g.getDate(), "" != v && $(td).attr("class", v), 0 == O && (u = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate(),
                $(td).attr("id", s.calendarId + "_" + u), $(td).css("cursor", "pointer"), function (t) {
                $(td).bind("click", t, function () {
                    return s.mOpts.beforeSelect.call(s, t) === !1 ? !1 : (s.selectDate(t), !1);
                });
            }(u)), $(tr).append(td), 6 == g.getDay() && $(D).append(tr);
        }
        return D;
    }, i.prototype.str2date = function (t) {
        var e = t.split("-");
        return new Date(e[0], e[1] - 1, e[2]);
    }, i.prototype.compareStrDate = function (t, e) {
        var a = this.str2date(t), s = this.str2date(e);
        return a.getTime() > s.getTime() ? 1 : a.getTime() == s.getTime() ? 0 : -1;
    }, i.prototype.date2ymd = function (t) {
        return [t.getFullYear(), t.getMonth() + 1, t.getDate()];
    }, i.prototype.changeInput = function (t) {
        1 == this.mOpts.isSingleDay && (t = this.startDateId);
        var e = [this.startDateId, this.startCompareDateId, this.endDateId, this.endCompareDateId], a = "";
        a = t == this.startDateId || t == this.endDateId ? this.mOpts.theme + "_" + this.mOpts.selectCss : this.mOpts.theme + "_" + this.mOpts.compareCss,
        t == this.endDateId && this.mOpts.singleCompare && (a = this.mOpts.theme + "_" + this.mOpts.compareCss);
        for (var s in e)e.hasOwnProperty(s) && ($("#" + e[s]).removeClass(this.mOpts.theme + "_" + this.mOpts.selectCss),
            $("#" + e[s]).removeClass(this.mOpts.theme + "_" + this.mOpts.compareCss));
        $("#" + t).addClass(a), $("#" + t).css("background-repeat", "repeat"), this.dateInput = t;
    }, i.prototype.formatDate = function (t) {
        return t.replace(/(\d{4})\-(\d{1,2})\-(\d{1,2})/g, function (t, e, a, s) {
            return 10 > a && (a = "0" + a), 10 > s && (s = "0" + s), e + "-" + a + "-" + s;
        });
    }, i.prototype.setDate = function (t) {
        return t = $.extend({}, this.initOpt || {}, t), s(t);
    };
});