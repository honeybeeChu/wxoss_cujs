define("biz_web/ui/dropdown.js", ["biz_web/widget/dropdown.css", "tpl/biz_web/ui/dropdown.html.js"], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict", e("biz_web/widget/dropdown.css");
        var i = e("tpl/biz_web/ui/dropdown.html.js"), s = {
            label: "请选择",
            data: [],
            callback: $.noop,
            render: $.noop,
            delay: 500,
            disabled: !1,
            search: !1
        }, o = "dropdown_menu";

        function u(e) {
            e.render && typeof e.render && (e.renderHtml = "", $.each(e.data, function (t, n) {
                e.renderHtml += e.render(n);
            })), e = $.extend(!0, {}, s, e);
            var t = this;
            t.container = $(e.container), t.container.addClass(e.search ? o + " search" : o), this.isDisabled = e.disabled, e.disabled && t.container.addClass("disabled"), t.opt = e, t.container.html(template.compile(i)(e)).find(".jsDropdownList").hide(), t.bt = t.container.find(".jsDropdownBt"), t.dropdown = t.container.find(".jsDropdownList"), $.each(e.data, function (e, n) {
                $.data(t.dropdown.find(".jsDropdownItem")[e], "value", n.value), $.data(t.dropdown.find(".jsDropdownItem")[e], "name", n.name), $.data(t.dropdown.find(".jsDropdownItem")[e], "item", n);
            }), typeof e.index != "undefined" && e.data.length !== 0 && (t.bt.find(".jsBtLabel").html(e.data[e.index].name || e.label), t.value = e.data[e.index].value), t.bt.on("click", function () {
                return a(), e.disabled || (t.dropdown.show(), t.container.addClass("open")), !1;
            }), e.search && t.bt.find(".jsBtLabel").on("keyup", function (e) {
                if (t.disabled) return;
                var n = $(this);
                if (e.keyCode == 13) t.value ? (n.html(n.data("name")).removeClass("error"), t.dropdown.hide()) : n.find("div").remove(); else {
                    var r = n.html().trim(), i = [];
                    t.value = null, t.dropdown.show().find(".jsDropdownItem").each(function () {
                        var e = $(this);
                        e.hasClass("js_empty") || (e.data("name").indexOf(r) > -1 ? (e.parent().show(), i.push({
                            name: e.data("name"),
                            value: e.data("value")
                        })) : e.parent().hide());
                    }), i.length == 0 ? t.dropdown.find(".js_empty").length == 0 && t.dropdown.append('<li class="jsDropdownItem js_empty empty">未找到"' + r + '"</li>') : (t.dropdown.find(".js_empty").remove(), i.length == 1 && (i[0].name == r ? n.removeClass("error") : n.data("name", i[0].name), t.value = i[0].value));
                }
            }).on("blur", function () {
                if (t.disabled) return;
                var n = $(this);
                t.value ? $(this).html() != $(this).data("name") && (n.addClass("error"), t.value = null) : n.html() != "" ? n.addClass("error") : (n.html(e.label).removeClass("error"), t.value = null);
            }).on("focus", function () {
                if (t.disabled) return;
                var n = $(this), r = $(this).html().trim();
                r == e.label && n.html("").removeClass("error"), r == "" && n.removeClass("error"), t.dropdown.show(), t.container.addClass("open");
            }), $(document).on("click", a), t.dropdown.on("click", ".jsDropdownItem", function (n) {
                var r = $(this).data("value"), i = $(this).data("name"), s = $(this).data("index");
                if (!t.value || t.value && t.value != r) {
                    t.value = r, t.name = i;
                    if (e.callback && typeof e.callback == "function") {
                        var o = e.callback(r, i, s, $(this).data("item")) || i;
                        e.search ? t.bt.find(".jsBtLabel").html(o).data("name", o).removeClass("error") : t.bt.find(".jsBtLabel").html(o);
                    }
                }
                t.dropdown.hide();
            });
        }

        function a() {
            $(".jsDropdownList").hide(), $(".dropdown_menu").each(function () {
                !$(this).hasClass("dropdown_checkbox") && $(this).removeClass("open");
            });
        }

        return u.prototype = {
            selected: function (e, t) {
                var n = this;
                if (typeof e == "number") {
                    if (this.opt.data && this.opt.data[e]) {
                        var r = this.opt.data[e].name, i = this.opt.data[e].value;
                        t != 0 && this.dropdown.find(".jsDropdownItem:eq(" + e + ")").trigger("click", i), this.bt.find(".jsBtLabel").html(r);
                    }
                } else $.each(this.opt.data, function (r, s) {
                    if (e == s.value || e == s.name) return t != 0 && n.dropdown.find(".jsDropdownItem:eq(" + r + ")").trigger("click", i), n.bt.find(".jsBtLabel").html(s.name), !1;
                });
                return this;
            },
            reset: function () {
                return this.bt.find(".jsBtLabel").html(this.opt.label), this.value = null, this;
            },
            hidegreater: function (e) {
                var t = this;
                return typeof e == "number" && t.opt.data && t.opt.data[e] && (t.dropdown.find(".jsDropdownItem").show(), t.dropdown.find(".jsDropdownItem:gt(" + e + ")").hide()), this;
            },
            destroy: function () {
                return this.isDisabled && this.container.removeClass("disabled"), this.container.children().remove(), this.container.off(), this;
            },
            enable: function () {
                return this.opt.disabled = !1, this.container.removeClass("disabled"), this.opt.search && this.bt.find(".jsBtLabel").attr("contenteditable", !0), this;
            },
            disable: function () {
                return this.opt.disabled = !0, this.container.addClass("disabled"), this.opt.search && this.bt.find(".jsBtLabel").attr("contenteditable", !1), this;
            }
        }, u;
    } catch (f) {
        wx.jslog({
            src: "biz_web/ui/dropdown.js"
        }, f);
    }
});
