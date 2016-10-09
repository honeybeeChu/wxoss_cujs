define("common/wx/mpEditor/plugin/img.js", ["common/wx/mpEditor/editor_all_min.js",
        "tpl/mpEditor/plugin/img_popup.html.js", "common/wx/media/imageDialog.js"],
    function (t) {
        "use strict";
        t("common/wx/mpEditor/editor_all_min.js");
        var e = t("tpl/mpEditor/plugin/img_popup.html.js"), i = t("common/wx/media/imageDialog.js"), o = function (t) {
            this.domid = t.container;
            this.container = $(t.container).show();
        };
        return o.prototype = {
            getName: function () {
                return "insertimage";
            },
            noCommandReprot: function () {
                return !0;
            },
            getExecCommand: function () {
                var t = this;
                return function () {
                    var e = this, o = t.editor;
                    o && i({
                        maxSelect: 100,
                        doselected: !0,
                        completeUploadMinSelectNum: 1,
                        onOK: function (i) {
                            t.doCommand(e, "insertimage", i.map(function (t) {
                                return t.src = t._src = '/wxoss/wx_articles/resources/getimgdata?fileId=' + t.file_id, t;
                            }));
                            var a = 0, r = 0;
                            $.each(i, function (t, e) {
                                "upload" == e.source ? a++ : r++;
                            });
                            // , a > 0 && $.post("/misc/jslog?1=1" + wx.data.param, {
                            //    id: 39,
                            //    val: a,
                            //    level: "trace",
                            //    content: "[file=media/appmsg_edit]"
                            //}), r > 0 && $.post("/misc/jslog?1=1" + wx.data.param, {
                            //    id: 40,
                            //    val: r,
                            //    level: "trace",
                            //    content: "[file=media/appmsg_edit]"
                            //});
                            var n = i.length;
                            n > 0 && o.funcPvUvReport("insertimage", n), this.destroy(), document.body.style.overflow = document.documentElement.style.overflow = "auto";
                        },
                        onHide: function () {
                            this.destroy(), document.body.style.overflow = document.documentElement.style.overflow = "auto";
                        }
                    });
                };
            },
            doCommand: function (t, e, i) {
                if (i) {
                    console.log("insert image");
                    var o = "300,640";
                    if (i = UE.utils.isArray(i) ? i : [i], i.length) {
                        var a, r = t, n = [], c = "";
                        if (a = i[0], 1 == i.length) {
                            var s = a.format || "";
                            "gif" == s && (a.src += "/mmbizgif");
                            var l = ' data-s="' + o + '" ';
                            a.src && /\/mmbizgif$/.test(a.src) && (a.src = a.src.replace(/\/mmbizgif$/, ""), l = " "),
                                l += s ? ' data-type="' + s + '" ' : "", c = "<img " + l + ' src="' + a.src + '" ' + (a._src ? ' _src="' + a._src + '" ' : "") + (a.width ? 'width="' + a.width + '" ' : "") + (a.height ? ' height="' + a.height + '" ' : "") + ("left" == a.floatStyle || "right" == a.floatStyle ? ' style="float:' + a.floatStyle + ';"' : "") + (a.title && "" != a.title ? ' title="' + a.title + '"' : "") + (a.border && "0" != a.border ? ' border="' + a.border + '"' : "") + (a.alt && "" != a.alt ? ' alt="' + a.alt + '"' : "") + (a.hspace && "0" != a.hspace ? ' hspace = "' + a.hspace + '"' : "") + (a.vspace && "0" != a.vspace ? ' vspace = "' + a.vspace + '"' : "") + "/>",
                            "center" == a.floatStyle && (c = '<p style="text-align: center">' + c + "</p>"), n.push(c);
                        } else for (var m = 0; a = i[m++];) {
                            "gif" == a.format && (a.src += "/mmbizgif");
                            var l = ' data-s="' + o + '" ';
                            a.src && /\/mmbizgif$/.test(a.src) && (a.src = a.src.replace(/\/mmbizgif$/, ""), l = " "),
                                l += a.format ? ' data-type="' + a.format + '" ' : "", c = "<p " + ("center" == a.floatStyle ? 'style="text-align: center" ' : "") + "><img " + l + ' src="' + a.src + '" ' + (a.width ? 'width="' + a.width + '" ' : "") + (a._src ? ' _src="' + a._src + '" ' : "") + (a.height ? ' height="' + a.height + '" ' : "") + ' style="' + (a.floatStyle && "center" != a.floatStyle ? "float:" + a.floatStyle + ";" : "") + (a.border || "") + '" ' + (a.title ? ' title="' + a.title + '"' : "") + " /></p>",
                                n.push(c);
                        }
                        r.execCommand("insertHtml", n.join("") + "<br/>");
                    }
                }
            },
            getContainer: function () {
                return this.domid;
            },
            getPluginData: function (t) {
                return t.content = t.content.replace(/<img(.*?)\s+src="/g, '<img$1 data-src="').replace(/https:\/\/mmbiz\.qlogo\.cn\//g, "http://mmbiz.qpic.cn/"),
                    t;
            },
            addListener: function (t) {
                var e = t.getUeditor();
                t.getBrowser().webkit && t.addListener("click", function (t, i) {
                    if ("IMG" == i.target.tagName && "false" != e.body.contentEditable) {
                        var o = new UE.dom.Range(e.document);
                        o.selectNode(i.target).select();
                    }
                }), this._showPopup(t);
            },
            beforeGetContent: function () {
                var t = this, e = $(t.editor.getDocument()), i = e.find("body").width(), o = e.find("img");
                o.each(function () {
                    var t = $(this), e = t.width(), o = t.height();
                    t.attr("data-ratio", o / e), t.attr("data-w", i == e ? "" : e);
                });
            },
            beforeSetContent: function (t) {
                return t = t.replace(/<img(.*?)\s+data\-src="/g, '<img$1 src="').replace(/http:\/\/mmbiz\.qpic\.cn\//g, "https://mmbiz.qlogo.cn/") || "";
            },
            _showPopup: function (t) {
                var i = t.getUeditor();
                t.addListener("handle_common_popup", function (t, o) {
                    var a = i.selection.getRange().getClosedNode();
                    if (a && /^img$/i.test(a.tagName)) {
                        var r = !1;
                        "100%" == a.style.width && "auto" == a.style.height && (r = !0), o.html += wx.T(e, {
                            needBreak: o.html ? !0 : !1,
                            hasadapt: r
                        }), o.node = a;
                    }
                });
            }
        }, o;
    });