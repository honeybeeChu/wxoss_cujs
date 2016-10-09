define("biz_web/utils/upload.js", ["widget/upload.css", "biz_web/lib/webuploader.js", "common/wx/dialog.js", "common/wx/Tips.js",
    "tpl/uploader.html.js"], function (e) {
    "use strict";
    function i(e) {
        f.src = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7839&flag2=4&flag3=5&1=" + e;
    }

    e("widget/upload.css");
    var n = e("biz_web/lib/webuploader.js"), t = e("common/wx/dialog.js"), a = e("common/wx/Tips.js"), o = e("tpl/uploader.html.js"),
        r = wx.T, l = wx.path.webuploader, s = ~location.hostname.search(/^mp/) ? "https://mp.weixin.qq.com" : "",
        c = {
            2: {
                accept: {
                    extensions: "bmp,png,jpeg,jpg,gif",
                    mimeTypes: "image/*"
                },
                fileSingleSizeLimit: 5242880
            },
            3: {
                accept: {
                    extensions: "mp3,wma,wav,amr",
                    mimeTypes: "audio/*"
                },
                fileSingleSizeLimit: 5242880
            },
            4: {
                accept: {
                    extensions: "rm,rmvb,wmv,avi,mpg,mpeg,mp4",
                    mimeTypes: "video/*"
                },
                fileSingleSizeLimit: 20971520
            },
            5: {
                accept: {
                    extensions: "pdf",
                    mimeTypes: "application/pdf"
                },
                fileSingleSizeLimit: 10485760
            },
            6: {
                accept: {
                    extensions: "bmp,png,jpeg,jpg,gif,pdf",
                    mimeTypes: "image/*,application/pdf"
                },
                fileSingleSizeLimit: 5242880
            },
            7: {
                accept: {
                    extensions: "bmp,jpeg,jpg,gif",
                    mimeTypes: "image/*"
                },
                fileSingleSizeLimit: 5242880
            },
            8: {
                accept: {
                    extensions: "bmp,png,jpeg,jpg",
                    mimeTypes: "image/*"
                },
                fileSingleSizeLimit: 5242880
            },
            9: {
                accept: {
                    extensions: "xls",
                    mimeTypes: "application/vnd.ms-excel"
                },
                fileSingleSizeLimit: 204800
            },
            10: {
                accept: {
                    extensions: "xls",
                    mimeTypes: "application/vnd.ms-excel"
                },
                fileSingleSizeLimit: 5242880
            },
            11: {
                accept: {
                    extensions: "bmp,png,jpeg,jpg",
                    mimeTypes: "image/*"
                },
                fileSingleSizeLimit: 5242880
            },
            12: {
                accept: {
                    extensions: "mp3,wma,wav,amr",
                    mimeTypes: "audio/*"
                },
                fileSingleSizeLimit: 31457280
            }
        };
    c[15] = c[4];
    var p = function (e) {
        t.show({
            type: "warn",
            msg: "警告|" + e,
            mask: !0,
            buttons: [{
                text: "确定",
                click: function () {
                    this.remove();
                }
            }]
        });
    }, m = function (e) {
        var i = n.Uploader;
        0 == i.support("flash") ? p("<p>未安装或未正确配置flash插件，请检查后重试。<br><a href='http://get.adobe.com/cn/flashplayer/' target='_blank'>到adobe去下载flash插件</a></p>") : 0 == i.support() ? p("<p>您的浏览器不支持上传</p>") : e.refresh();
    }, u = function (e) {
        e && wx.jslog({
            src: "common/wx/upload.js"
        }, null, e);
    }, d = {
        swf: l,
        auto: !0,
        pick: {
            multiple: !0
        },
        fileNumLimit: 20,
        threads: 3,
        sendAsBinary: !1,
        runtimeOrder: "html5,flash",
        compress: {
            width: 1280,
            height: 1e8,
            quality: 90,
            afterCompressSizeLimit: 2097152,
            compressSize: 0,
            resizeSize: 2097152,
            maxResolution: 6e6,
            noCompressIfLarger: !0
        },
        imageSize: !0,
        chunked: !1,
        duplicate: !0
    }, f = new Image, g = {}, h = function (e) {
        if (!e.url)throw"missing url";
        var t, l, s, p = $('<ul class="upload_file_box" style="display:none"></ul>'), f = $(e.container);
        f.on("click", function () {
            Math.random() < .1 && u(12), m(t);
        }).parent().append(p), function () {
            0 == n.Uploader.support("html5") && 0 == n.Uploader.support("flash") && ((new Image).src = "/misc/jslog?level=error&id=36&content=[pageurl:" + encodeURIComponent(location.href) + ",ua:" + encodeURIComponent(window.navigator.userAgent) + "]");
        }(), l = {
            server: wx.url(e.url + "&ticket_id=" + wx.data.user_name + "&ticket=" + wx.data.ticket + "&svr_time=" + wx.data.time),
            pick: {
                id: f,
                multiple: e.multi
            },
            fileNumLimit: e.queueSizeLimit
        }, s = c[e.type] || c[2], e = $.extend(!0, {}, d, l, s, e);
        e.server;
        0 == n.Uploader.support("html5") && e.compress && (e.compress.quality = 70);
        try {
            t = n.create(e);
        } catch (h) {
            if (!t)return;
        }
        return p.on("click", ".js_cancel", function () {
            var e = $(this).data("id");
            t.cancelFile(e), $(this).hide();
        }), t.on("beforeFileQueued", function (i) {
            return Math.random() < .1 && u(13), e.canContinueUpload && !e.canContinueUpload() ? !1 : !(e.onSelect && e.onSelect(null, i.id, i) === !1);
        }), t.on("fileQueued", function (e) {
            var i = {
                id: e.id,
                fileName: e.name,
                size: n.formatSize(e.size)
            };
            p.append(r(o, i)).show();
        }), t.on("fileDequeued", function () {
            Math.random() < .1 && u(14), e.onCancel && e.onCancel();
        }), t.on("uploadProgress", function (i, n) {
            var t = "#uploadItem%s".sprintf(i.id), a = p.find(t).find(".progress_bar_thumb");
            a.width("%s%".sprintf(100 * n)), 1 == n && p.find(t).find(".js_cancel").remove(), e.onProgress && e.onProgress(null, i.id, i, {
                percentage: n
            });
        }), t.on("uploadStart", function (e) {
            g[e.id] = +new Date;
        }), t.on("uploadSuccess", function (n, t, o) {
            if (Math.random() < .1 && u(16), t && t.base_resp) {
                var r = +t.base_resp.ret;
                if (0 == r)Math.random() < .1 && (u(17), g[n.id] && i(+new Date - g[n.id])); else switch (n.setStatus("invalid"),
                    r) {
                    case-18:
                    case 200018:
                        a.err("页面停留时间过久，请刷新页面后重试！");
                        break;

                    case-20:
                    case 200020:
                        a.err("无法解释该图片，请使用另一图片或截图另存");
                        break;

                    case-13:
                    case 200013:
                        a.err("上传文件过于频繁，请稍后再试");
                        break;

                    case-10:
                    case 200010:
                        a.err("上传文件过大");
                        break;

                    case-22:
                    case 200022:
                        a.err("上传音频文件不能超过60秒");
                        break;

                    case-39:
                    case 200039:
                        a.err("上传图片高度（像素）与宽度（像素）的乘积不能超过600万");
                        break;

                    default:
                        a.err("上传文件发送出错，请刷新页面后重试！");
                }
            }
            e.onComplete && e.onComplete(null, n.id, n, t, {
                fileCount: o.numOfProgress + o.numOfQueue
            });
        }), t.on("uploadFinished", function (i) {
            this.reset(), p.fadeOut().html(""), g = {}, 0 == i.numOfInvalid && i.numOfSuccess > 0 && e.onAllComplete && e.onAllComplete(null, {
                errors: i.numOfCancel + i.numOfInvalid + i.numOfUploadFailed + i.numofDeleted + i.numofInterrupt,
                filesUploaded: i.numOfSuccess
            });
        }), t.on("uploadError", function () {
            Math.random() < .1 && u(15), e.onError && e.onError();
        }), t.on("error", function (i, t, o) {
            switch ("object" == typeof t && (o = t), i) {
                case"Q_EXCEED_NUM_LIMIT":
                    a.err("一次上传最多只能上传%s个文件".sprintf(t));
                    break;

                case"F_EXCEED_SIZE":
                    a.err("文件大小不能超过%s".sprintf(n.formatSize(t, "0")));
                    break;

                case"F_EXCEED_COMPRESS_SIZE":
                    a.err("图片压缩后过大，请缩小图片尺寸再试"), u(42);
                    break;

                case"Q_TYPE_DENIED":
                    a.err(e.errTypeMsg || "文件必须为以下格式：%s".sprintf(e.accept.extensions).replace(/,/g, ", "));
            }
        }), t;
    }, b = function (e) {
        return function (i) {
            return i.url = e, h(i);
        };
    }, w = function (e) {
        return function (i) {
            return wx.url(e + "&ticket_id=" + wx.data.user_name + "&ticket=" + wx.data.ticket + "&id=" + i);
        };
    };
    return {
        uploadFile: h,
        uploadBizFile: b(s + "/cgi-bin/filetransfer?action=upload_material&f=json"),
        uploadTmpFile: b(s + "/cgi-bin/filetransfer?action=preview&f=json"),
        uploadCdnFile: b(s + "/cgi-bin/filetransfer?action=upload_cdn&f=json"),
        uploadShopFile: b(s + "/merchant/goodsimage?action=uploadimage"),
        uploadShopUnsaveFile: b(s + "/merchant/goodsimage?action=uploadimage&save=0"),
        uploadVideoCdnFile: b(s + "/cgi-bin/filetransfer?action=upload_video_cdn&f=json"),
        uploadRegisterFile: b(s + "/acct/realnamesubmit?type=2&action=file_set"),
        uploadUpgradeFile: b(s + "/acct/servicetypeupgrade?type=2&action=file_set"),
        uploadPoiFile: b(s + "/misc/setlocation?action=upload"),
        mediaFile: b(s + "/cgi-bin/filetransfer?action=bizmedia"),
        uploadCdnFileFromAd: function (e) {
            return b(s + "/cgi-bin/filetransfer?action=upload_cdn_check_size&f=json&width=" + e.w + "&height=" + e.h + "&limit_size=" + e.size);
        },
        uploadImageLibFile: function (e) {
            e.url = s + "/wxoss/wx_articles/resources?action=upload_material&f=json", "undefined" != typeof e.scene && (e.url += "&scene=" + e.scene),
            1 == e.doublewrite && (e.url += "&writetype=doublewrite&groupid=" + (e.groupid || 1)), h(e);
            return e.url;
        },
        uploadCdnFileWithCheck: function (e) {
            var i = {
                height: 0,
                width: 0,
                size: 0,
                min_height: 0,
                min_width: 0,
                min_size: 0
            };
            e = $.extend(!0, i, e);
            var n = [];
            for (var t in e)n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
            return b(s + "/cgi-bin/filetransfer?action=upload_cdn_check_range&f=json&" + n.join("&"), "tmpfile");
        },
        uploadTmpFileWithCheck: function (e) {
            var i = {
                height: 0,
                width: 0,
                size: 0,
                min_height: 0,
                min_width: 0,
                min_size: 0
            };
            e = $.extend(!0, i, e);
            var n = [];
            for (var t in e)n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
            return b(s + "/cgi-bin/filetransfer?action=preview_check_range&f=json&" + n.join("&"));
        },
        tmpFileUrl: w(s + "/cgi-bin/filetransfer?action=preview"),
        mediaFileUrl: w(s + "/cgi-bin/filetransfer?action=bizmedia"),
        multimediaFileUrl: w(s + "/cgi-bin/filetransfer?action=multimedia")
    };
});
