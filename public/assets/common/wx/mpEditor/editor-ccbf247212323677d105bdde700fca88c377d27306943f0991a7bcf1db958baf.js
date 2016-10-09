define("common/wx/mpEditor/editor.js", ["widget/ueditor_new/themes/default/ueditor.css",
        "widget/ueditor_new/themes/default/css/ueditor.css", "widget/tooltip.css",
        "common/wx/mpEditor/contextmenu.js", "tpl/tooltip.html.js", "media/report.js"],
    function (t) {
        "use strict";
        function e(t) {
            this.__o = {
                plugins: [],
                onReady: function () {
                }
            }, this.__ueditor_config = {
                contextMenu: n,
                UEDITOR_HOME_URL: r.URL,
                isShow: !0,
                initialContent: "",
                autoClearinitialContent: !1,
                iframeCssUrl: wx.EditorRes["themes/iframe"],
                textarea: "editorValue",
                focus: !1,
                initialFrameWidth: "auto",
                initialFrameHeight: 0,
                minFrameWidth: 800,
                minFrameHeight: 400,
                autoClearEmptyNode: !0,
                fullscreen: !1,
                readonly: !1,
                zIndex: 999,
                imagePopup: !0,
                enterTag: "p",
                pageBreakTag: "_baidu_page_break_tag_",
                customDomain: !0,
                lang: r.LANG,
                theme: "default",
                allHtmlEnabled: !1,
                scaleEnabled: !1,
                wordCount: !1,
                elementPathEnabled: !1,
                autoHeightEnabled: !1,
                sourceEditor: "textarea",
                imageUrl: "/cgi-bin/uploadimg2cdn?t=ajax-editor-upload-img&lang=" + r.LANG + "&token=" + r.TOKEN,
                imagePath: "",
                compressSide: 1,
                catchRemoteImageEnable: !0,
                catcherUrl: "/cgi-bin/uploadimg2cdn?lang=" + r.LANG + "&token=" + r.TOKEN,
                catchFieldName: "imgurl",
                separater: "",
                toolbars: [["more", "|", "fontsize", "|", "blockquote", "horizontal", "|", "removeformat"], ["bold", "italic", "underline", "forecolor", "backcolor", "|", "justifyleft", "justifycenter", "justifyright", "|", "rowspacingtop", "rowspacingbottom", "lineheight", "|", "insertorderedlist", "insertunorderedlist", "|", "imagenone", "imageleft", "imageright", "imagecenter"]],
                labelMap: {
                    anchor: "",
                    undo: ""
                },
                topOffset: 0
            }, this.__init(t);
        }

        t("widget/ueditor_new/themes/default/ueditor.css"), t("widget/ueditor_new/themes/default/css/ueditor.css"),
            t("widget/tooltip.css");
        var n = t("common/wx/mpEditor/contextmenu.js"), i = t("tpl/tooltip.html.js"), o = t("media/report.js"), r = {
            LANG: window.wx.data.lang,
            TOKEN: window.wx.data.t,
            URL: /^dev/.test(location.host) ? "/mpres/htmledition/style/widget/ueditor_new/" : "//res.wx.qq.com/mpres/htmledition/style/widget/ueditor_new/"
        };
        return e.prototype = {
            __init: function (t) {
                this.__g = {}, this.__extend(t), this.__registerPlugins(), this.__createEditor(), this.__initPulginEvent(),
                    this.__initReport(), this.__customEventHandle();
            },
            __initReport: function () {
                var t = this;
                this.addListener("funcPvUvReport", function (e, n, i) {
                    t.funcPvUvReport(n, i);
                });
            },
            __extend: function (t) {
                var e = this.__ueditor_config, n = this.__o;
                for (var i in t)n.hasOwnProperty(i) ? n[i] = t[i] : e.hasOwnProperty(i) && (e[i] = t[i]);
                "auto" != e.initialFrameHeight && (e.initialFrameHeight = Math.max(e.initialFrameHeight, e.minFrameHeight)),
                "auto" != e.initialFrameWidth && (e.initialFrameWidth = Math.max(e.initialFrameWidth, e.minFrameWidth));
            },
            __registerPlugins: function () {
                for (var t = this, e = this.__o.plugins, n = 0, i = e.length; i > n; n++) {
                    var o = e[n];
                    !function (e) {
                        var n = e.getName();
                        UE.plugins[n] = function () {
                            this.commands[n] = {
                                execCommand: e.getExecCommand(),
                                noCommandReprot: "function" == typeof e.noCommandReprot ? e.noCommandReprot() : !1
                            }, "function" == typeof e.getQueryCommandState && (this.commands[n].queryCommandState = e.getQueryCommandState()),
                            "function" == typeof e.getQueryCommandValue && (this.commands[n].queryCommandValue = e.getQueryCommandValue());
                        }, t.__setPluginMenu(e), t.__pluginPerformance(e);
                    }(o);
                }
            },
            __setPluginMenu: function (t) {
                var e = this.__ueditor_config.contextMenu;
                "function" == typeof t.getContextMenu && e.push("-", t.getContextMenu());
            },
            __pluginPerformance: function (t) {
                var e = 0;
                switch ("function" == typeof t.getType && (e = t.getType() || 0), e) {
                    case 0:
                        this.__ceateDefaultBtn(t);
                        break;

                    case 1:
                        this.__createToolBarBtn(t);
                }
            },
            __ceateDefaultBtn: function (t) {
                var e = this;
                if ("function" == typeof t.getContainer) {
                    var n = $(t.getContainer()), i = t.getName();
                    n && n.click(function () {
                        e.execCommand(i);
                    });
                }
            },
            __createEditor: function () {
                var t = this, e = this.__o, n = this.__ueditor_config;
                this.ueditor = new UE.ui.Editor(n), this.ueditor.ready(function () {
                    t.__initToolbarTips(), t.__initIframeSelect(), "function" == typeof e.onReady && e.onReady.call(t, t.ueditor);
                });
            },
            __initIframeSelect: function () {
                var t = this.ueditor;
                window.__editorIframeSelect = function (e) {
                    for (var n = t.document.getElementsByTagName("iframe"), i = 0, o = n.length; o > i; i++) {
                        var r = n[i];
                        if (r.contentWindow === e) {
                            var a = new UE.dom.Range(t.document);
                            a.selectNode(r).select();
                            break;
                        }
                    }
                };
            },
            __initToolbarTips: function () {
                var t = this.__g;
                t.toolbarsTips = $(template.compile(i)({
                    content: ""
                })), t.toolbarsTips.hide(), $("body").append(t.toolbarsTips), $(this.ueditor.container).find("[id*=_toolbarboxouter]").on("mouseover", function (e) {
                    var n = $(e.target || e.srcElement), i = n.parents("div[data-tooltip]");
                    if (1 == i.length) {
                        var o = i.data("tooltip");
                        if (o) {
                            t.toolbarsTips.find(".tooltip_inner").html(o);
                            var r = i.offset();
                            t.toolbarsTips.css({
                                top: r.top - 5 - t.toolbarsTips.height(),
                                left: r.left + i.width() / 2 - t.toolbarsTips.width() / 2
                            }).show();
                        }
                    }
                }).on("mouseout", function (e) {
                    0 == $(e.toElement).parents("div[data-tooltip]").length && t.toolbarsTips.hide();
                });
            },
            __initPulginEvent: function () {
                for (var t = this, e = this.__o.plugins, n = 0, i = e.length; i > n; n++) {
                    var o = e[n];
                    o.editor = this, "function" == typeof o.addListener && o.addListener(t);
                }
            },
            __createToolBarBtn: function (t) {
                var e = "";
                "function" == typeof t.getTitle && (e = t.getTitle() || "");
                var n = t.getName(), i = this.getUi();
                i[n] = function (t) {
                    return function (n) {
                        var o = new i.Button({
                            className: "edui-for-" + t,
                            title: e,
                            onclick: function () {
                                n.execCommand(t);
                            },
                            theme: n.options.theme,
                            showText: !1
                        });
                        return i.buttons[t] = o, n.addListener("selectionchange", function (e, i, r) {
                            var a = n.queryCommandState(t);
                            -1 == a ? (o.setDisabled(!0), o.setChecked(!1)) : r || (o.setDisabled(!1), o.setChecked(a));
                        }), o;
                    };
                }(n);
            },
            __customEventHandle: function () {
                var t = this;
                t.addListener("focus keyup aftersetcontent", function () {
                    t.getDom("contentplaceholder").style.display = "none";
                }), t.addListener("blur", function () {
                    "" == t.ueditor.getContent().trim() && (t.getDom("contentplaceholder").style.display = "block");
                });
            },
            ready: function (t) {
                if ("function" == typeof t) {
                    {
                        var e = this;
                        this.__o;
                    }
                    this.ueditor.ready(function () {
                        t.call(e, e.ueditor), "" == e.ueditor.getContent().trim() && (e.getDom("contentplaceholder").style.display = "block");
                    });
                }
            },
            addListener: function (t, e) {
                this.ueditor.addListener(t, e);
            },
            handlerContent: function (t) {
                for (var e = this.__o.plugins, n = 0, i = e.length; i > n; n++) {
                    var o = e[n];
                    "function" == typeof o.beforeSetContent && (t = o.beforeSetContent(t));
                }
                return t = t.replace(/background\-image:\s*url\(https\:\/\/mp\.weixin\.qq\.com\/cgi\-bin\/appmsg(.*?)\)/g, "");
            },
            setContent: function (t, e) {
                t = this.handlerContent(t);
                var n = this.__o.plugins;
                this.ueditor.setContent(t, e);
                for (var i = 0, o = n.length; o > i; i++) {
                    var r = n[i];
                    "function" == typeof r.afterSetContent && (t = r.afterSetContent());
                }
            },
            getEditorData: function (t) {
                for (var e = this.__o.plugins, n = 0, i = e.length; i > n; n++) {
                    var o = e[n];
                    "function" == typeof o.beforeGetContent && o.beforeGetContent();
                }
                t = t || {}, t.content = this.ueditor.getContent();
                for (var n = 0, i = e.length; i > n; n++) {
                    var o = e[n];
                    "function" == typeof o.getPluginData && (t = o.getPluginData(t));
                }
                return t.content = t.content.replace(/(<\w+[^>]*)\sid=\"([^\">]*)\"([^>]*>)/g, "$1$3"),
                    t;
            },
            queryCommandValue: function (t) {
                return this.ueditor.queryCommandValue(t);
            },
            getSelection: function () {
                return this.ueditor.selection;
            },
            getSelectionRange: function () {
                return this.getSelection().getRange();
            },
            getSelectionStart: function () {
                return this.getSelection().getStart();
            },
            render: function (t) {
                this.ueditor.render(t);
            },
            getUeditor: function () {
                return this.ueditor;
            },
            getWindow: function () {
                return this.ueditor.window;
            },
            getDocument: function () {
                return this.getWindow().document;
            },
            execCommand: function () {
                var t = this.ueditor;
                t.execCommand.apply(t, arguments);
            },
            fireEvent: function () {
                var t = this.ueditor;
                return t.fireEvent.apply(t, arguments);
            },
            funcPvUvReport: function (t, e) {
                o.addPvUv(t, e);
            },
            getUtils: function () {
                return UE.utils;
            },
            getDomUtils: function () {
                return UE.dom.domUtils;
            },
            getBrowser: function () {
                return UE.browser;
            },
            getUi: function () {
                return UE.ui;
            },
            getDom: function (t) {
                return this.ueditor.ui.getDom(t);
            },
            enableToolbar: function () {
                this.ueditor.ui.getDom("toolbar_mask").style.display = "none";
            },
            disableToolbar: function () {
                this.ueditor.ui.getDom("toolbar_mask").style.display = "block";
            },
            checkPlugins: function (t) {
                var e = this.__o.plugins, n = !0;
                return $.each(e, function (e, i) {
                    return "function" == typeof i.check ? n = i.check(t) : !0;
                }), n;
            },
            isHighlight: function () {
                return this.ueditor.highlight;
            },
            setHistory: function (t) {
                var e = this.getUeditor().undoManger;
                if (!e)return !1;
                if (!t)return e.reset(), !0;
                var n = t.list;
                if ("[object Array]" !== Object.prototype.toString.call(n) || 0 == n.length)return e.reset(),
                    !0;
                var i = t.index;
                return ("undefined" == typeof i || 0 > i || i > n.length - 1) && (i = n.length - 1), e.list = n, e.index = i,
                    e.clearKey(), e.update(), !0;
            },
            getHistory: function () {
                var t = this.getUeditor().undoManger;
                return t ? {
                    list: JSON.parse(JSON.stringify2(t.list)),
                    index: t.index
                } : null;
            }
        }, e;
    });
