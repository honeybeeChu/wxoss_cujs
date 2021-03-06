define("common/wx/ban.js", ["tpl/ban/highlight_box.html.js", "tpl/ban/page_msg.html.js", "common/wx/dialog.js"], function (e, a, i) {
    "use strict";
    var n = e("tpl/ban/highlight_box.html.js"), o = e("tpl/ban/page_msg.html.js"), t = e("common/wx/dialog.js"), p = {
        "mass-send": {
            func_id: 1,
            name: "群发功能"
        },
        copyright: {
            func_id: 2,
            name: "原创功能"
        },
        reward: {
            func_id: 3,
            name: "赞赏功能"
        },
        seller: {
            func_id: 4,
            name: "流量主功能"
        },
        comment: {
            func_id: 5,
            name: "留言功能"
        },
        follow: {
            func_id: 6,
            name: "被关注"
        },
        search: {
            func_id: 7,
            name: "被搜索"
        },
        outlink: {
            func_id: 8,
            name: "外链功能"
        },
        share: {
            func_id: 9,
            name: "文章分享至朋友圈可见"
        },
        reply: {
            func_id: 10,
            name: "自动回复功能",
            highlight: "已禁用自动回复|你的帐号{=reason}，已被{forever}屏蔽自动回复功能{date}，期间用户将不会收到自动回复消息。",
            hide: "all"
        },
        menu: {
            func_id: 11,
            name: "自定义菜单功能",
            highlight: "已禁用自定义菜单|你的帐号{=reason}，已被{forever}屏蔽自定义菜单功能{date}，期间自定义菜单将不可见。",
            hide: "all"
        },
        "single-send": {
            func_id: 12,
            name: "聊天功能",
            pagemsg: "你的帐号{=reason}，已被{forever}屏蔽聊天功能{date}，期间将不可和粉丝互动聊天。"
        },
        preview: {
            func_id: 13,
            name: "消息预览功能",
            dialogmsg: "你的帐号{=reason}，已被{forever}屏蔽消息预览功能{date}，期间消息预览功能将不可用。"
        },
        "jssdk-share": {
            func_id: 14,
            name: "JS-SDK分享接口"
        },
        template: {
            func_id: 15,
            name: "模板消息接口"
        },
        "customer-service": {
            func_id: 16,
            name: "客服接口"
        }
    }, r = [{
        illegal_reason_id: 3,
        reason_id: 90004,
        reason_name: "滥用原创声明",
        reason_type: 0,
        reason_description: "涉嫌滥用原创声明功能",
        reason_rule: "《微信公众平台运营规范》3.6条规定",
        wap_url: "",
        pc_url: "",
        level: 3
    }, {
        illegal_reason_id: 4,
        reason_id: 90005,
        reason_name: "滥用赞赏",
        reason_type: 0,
        reason_description: "涉嫌滥用赞赏功能",
        reason_rule: "《微信公众平台运营规范》3.7条规定",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_7",
        level: 3
    }, {
        illegal_reason_id: 10,
        reason_id: 10001,
        reason_name: "垃圾广告",
        reason_type: 0,
        reason_description: "涉嫌发布垃圾广告",
        reason_rule: "《微信公众平台运营规范》4.8条规定-广告类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=24&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_8",
        level: 2
    }, {
        illegal_reason_id: 11,
        reason_id: 20001,
        reason_name: "政治敏感",
        reason_type: 0,
        reason_description: "涉嫌违反相关法律法规和政策",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=32&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 3
    }, {
        illegal_reason_id: 12,
        reason_id: 20002,
        reason_name: "色情",
        reason_type: 0,
        reason_description: "涉及低俗、性暗示或色情信息",
        reason_rule: "《微信公众平台运营规范》4.2条规定-色情及色情擦边类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=18&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_2",
        level: 1
    }, {
        illegal_reason_id: 13,
        reason_id: 20004,
        reason_name: "社会事件",
        reason_type: 0,
        reason_description: "涉嫌违反相关法律法规和政策",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 3
    }, {
        illegal_reason_id: 14,
        reason_id: 20006,
        reason_name: "违法犯罪",
        reason_type: 0,
        reason_description: "涉嫌违反相关法律法规和政策",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=32&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 1
    }, {
        illegal_reason_id: 15,
        reason_id: 20008,
        reason_name: "欺诈",
        reason_type: 0,
        reason_description: "涉嫌欺诈",
        reason_rule: "《微信公众平台运营规范》4.8.1条规定-欺诈虚假广告类",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=24&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_8",
        level: 1
    }, {
        illegal_reason_id: 16,
        reason_id: 20012,
        reason_name: "低俗",
        reason_type: 0,
        reason_description: "涉及低俗、性暗示或色情信息",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=32&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 2
    }, {
        illegal_reason_id: 18,
        reason_id: 20013,
        reason_name: "冒名侵权",
        reason_type: 0,
        reason_description: "涉嫌侵犯他人合法权益",
        reason_rule: "《微信公众平台运营规范》4.1条规定-侵权或侵犯隐私类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 1
    }, {
        illegal_reason_id: 21,
        reason_id: 20106,
        reason_name: "骚扰",
        reason_type: 0,
        reason_description: "涉及骚扰信息",
        reason_rule: "《微信公众平台运营规范》4.10条规定-搔扰类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=26&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_10",
        level: 3
    }, {
        illegal_reason_id: 22,
        reason_id: 21e3,
        reason_name: "默认",
        reason_type: 0,
        reason_description: "涉嫌违规",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 3
    }, {
        illegal_reason_id: 23,
        reason_id: 90001,
        reason_name: "侵犯隐私",
        reason_type: 0,
        reason_description: "涉嫌侵犯他人隐私",
        reason_rule: "《微信公众平台运营规范》4.1条规定-侵权或侵犯隐私类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 3
    }, {
        illegal_reason_id: 35,
        reason_id: 20104,
        reason_name: "造遥",
        reason_type: 0,
        reason_description: "涉嫌造谣或传谣",
        reason_rule: "《微信公众平台运营规范》4.9条规定-谣言类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=25&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_9",
        level: 2
    }, {
        illegal_reason_id: 36,
        reason_id: 20105,
        reason_name: "诱导分享",
        reason_type: 0,
        reason_description: "涉嫌诱导分享",
        reason_rule: "《微信公众平台运营规范》3.3.1条规定-诱导分享",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=13&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3",
        level: 2
    }, {
        illegal_reason_id: 40,
        reason_id: 90002,
        reason_name: "抄袭",
        reason_type: 0,
        reason_description: "涉嫌抄袭他人内容",
        reason_rule: "《微信公众平台运营规范》4.1.2条规定-内容侵权",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 3
    }, {
        illegal_reason_id: 41,
        reason_id: 90003,
        reason_name: "诱导关注 ",
        reason_type: 0,
        reason_description: "涉嫌诱导关注",
        reason_rule: "《微信公众平台运营规范》3.3.2条规定-诱导关注",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=13&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3",
        level: 2
    }, {
        illegal_reason_id: 42,
        reason_id: 1,
        reason_name: "默认",
        reason_type: 1,
        reason_description: "其他",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 1
    }, {
        illegal_reason_id: 43,
        reason_id: 2,
        reason_name: "政治敏感",
        reason_type: 1,
        reason_description: "涉嫌违反相关法律法规",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=32&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 1
    }, {
        illegal_reason_id: 44,
        reason_id: 3,
        reason_name: "色情",
        reason_type: 1,
        reason_description: "涉及低俗或色情信息",
        reason_rule: "《微信公众平台运营规范》4.2条规定-色情及色情擦边类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=18&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_2",
        level: 1
    }, {
        illegal_reason_id: 45,
        reason_id: 4,
        reason_name: "虚假认证",
        reason_type: 1,
        reason_description: "涉嫌虚假认证",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 1
    }, {
        illegal_reason_id: 46,
        reason_id: 5,
        reason_name: "侵权",
        reason_type: 1,
        reason_description: "涉嫌侵犯他人合法权益",
        reason_rule: "《微信公众平台运营规范》4.1条规定-侵权或侵犯隐私类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 1
    }, {
        illegal_reason_id: 47,
        reason_id: 4,
        reason_name: "政治敏感",
        reason_type: 2,
        reason_description: "涉嫌违反相关法律法规",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=32&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 3
    }, {
        illegal_reason_id: 48,
        reason_id: 1,
        reason_name: "色情",
        reason_type: 2,
        reason_description: "涉嫌低俗或色情",
        reason_rule: "《微信公众平台运营规范》4.2条规定-色情及色情擦边类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=18&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_2",
        level: 1
    }, {
        illegal_reason_id: 49,
        reason_id: 3,
        reason_name: "欺诈",
        reason_type: 2,
        reason_description: "涉嫌欺诈",
        reason_rule: "《微信公众平台运营规范》4.8.1条规定-欺诈虚假广告类",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=24&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_8",
        level: 1
    }, {
        illegal_reason_id: 50,
        reason_id: 5,
        reason_name: "诱导分享",
        reason_type: 2,
        reason_description: "涉嫌诱导分享",
        reason_rule: "《微信公众平台运营规范》3.3.1条规定-诱导分享",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=13&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3",
        level: 2
    }, {
        illegal_reason_id: 51,
        reason_id: 19,
        reason_name: "诱导关注",
        reason_type: 2,
        reason_description: "涉嫌诱导关注",
        reason_rule: "《微信公众平台运营规范》3.3.2条规定-诱导关注",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=13&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_3",
        level: 2
    }, {
        illegal_reason_id: 52,
        reason_id: 7,
        reason_name: "侵犯隐私",
        reason_type: 2,
        reason_description: "涉嫌侵犯隐私",
        reason_rule: "《微信公众平台运营规范》4.1.2条规定-内容侵权",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 3
    }, {
        illegal_reason_id: 53,
        reason_id: 6,
        reason_name: "冒名侵权",
        reason_type: 2,
        reason_description: "涉嫌侵犯他人合法权益",
        reason_rule: "《微信公众平台运营规范》4.1条规定-侵权或侵犯隐私类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 1
    }, {
        illegal_reason_id: 54,
        reason_id: 11,
        reason_name: "外挂",
        reason_type: 2,
        reason_description: "涉嫌使用外挂",
        reason_rule: "《微信公众平台运营规范》3.1条规定－使用外挂行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_1",
        level: 1
    }, {
        illegal_reason_id: 55,
        reason_id: 8,
        reason_name: "造遥",
        reason_type: 2,
        reason_description: "涉嫌造谣或传谣",
        reason_rule: "《微信公众平台运营规范》4.9条规定-谣言类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=25&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_9",
        level: 2
    }, {
        illegal_reason_id: 56,
        reason_id: 12,
        reason_name: "骚扰",
        reason_type: 2,
        reason_description: "涉嫌骚扰他人",
        reason_rule: "《微信公众平台运营规范》4.10条规定-搔扰类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_10",
        level: 3
    }, {
        illegal_reason_id: 57,
        reason_id: 14,
        reason_name: "刷粉",
        reason_type: 2,
        reason_description: "涉嫌刷粉",
        reason_rule: "《微信公众平台运营规范》3.2条规定－刷粉行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_2",
        level: 3
    }, {
        illegal_reason_id: 58,
        reason_id: 13,
        reason_name: "互推",
        reason_type: 2,
        reason_description: "涉嫌互推",
        reason_rule: "《微信公众平台运营规范》3.2条规定－刷粉行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_2",
        level: 2
    }, {
        illegal_reason_id: 59,
        reason_id: 16,
        reason_name: "抄袭",
        reason_type: 2,
        reason_description: "涉嫌抄袭",
        reason_rule: "《微信公众平台运营规范》4.1.2条规定-内容侵权",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 3
    }, {
        illegal_reason_id: 60,
        reason_id: 9,
        reason_name: "垃圾广告",
        reason_type: 2,
        reason_description: "涉嫌发送垃圾广告",
        reason_rule: "《微信公众平台运营规范》4.8条规定-广告类内容",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=24&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_8",
        level: 2
    }, {
        illegal_reason_id: 61,
        reason_id: 10,
        reason_name: "恶意注册",
        reason_type: 2,
        reason_description: "涉嫌恶意注册",
        reason_rule: "《微信公众平台运营规范》1条规定－ 注册规范",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot1",
        level: 1
    }, {
        illegal_reason_id: 62,
        reason_id: 17,
        reason_name: "恶意举报",
        reason_type: 2,
        reason_description: "涉嫌恶意举报",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 2
    }, {
        illegal_reason_id: 63,
        reason_id: 18,
        reason_name: "违规分销",
        reason_type: 2,
        reason_description: "涉嫌多级分销",
        reason_rule: "《微信公众平台运营规范》",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN",
        level: 1
    }, {
        illegal_reason_id: 64,
        reason_id: 90007,
        reason_name: "违规声明原创",
        reason_type: 0,
        reason_description: "涉嫌违规使用原创声明功能",
        reason_rule: "微信公众平台运营规范》3.6条规定-滥用原创声明功能",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_6",
        level: 1
    }, {
        illegal_reason_id: 65,
        reason_id: 90011,
        reason_name: "刷粉",
        reason_type: 0,
        reason_description: "涉嫌刷粉",
        reason_rule: "微信公众平台运营规范》3.2条规定－刷粉行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_2",
        level: 1
    }, {
        illegal_reason_id: 66,
        reason_id: 90010,
        reason_name: "名誉/商誉/隐私/肖像",
        reason_type: 0,
        reason_description: "涉嫌侵犯名誉/商誉/隐私/肖像",
        reason_rule: "《微信公众平台运营规范》4.1.2条规定",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=17&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot4_1",
        level: 1
    }, {
        illegal_reason_id: 69,
        reason_id: 90013,
        reason_name: "滥用模版消息接口",
        reason_type: 0,
        reason_description: "涉嫌滥用模版消息接口",
        reason_rule: "《微信公众平台运营规范》3.9条规定-滥用模板消息接口行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=33&t=operation/faq_index&nettype=WIFI&fontScale=100&from=singlemessage&isappinstalled=0#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_9",
        level: 1
    }, {
        illegal_reason_id: 70,
        reason_id: 90012,
        reason_name: "滥用客服消息",
        reason_type: 0,
        reason_description: "涉嫌滥用客服消息",
        reason_rule: "《微信公众平台运营规范》3.10条规定-滥用客服消息行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=34&t=operation/faq_index&nettype=WIFI&fontScale=100&from=singlemessage&isappinstalled=0#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_10",
        level: 1
    }, {
        illegal_reason_id: 71,
        reason_id: 90008,
        reason_name: "互推",
        reason_type: 0,
        reason_description: "涉嫌互推",
        reason_rule: "《微信公众平台运营规范》3.2条规定－刷粉行为",
        wap_url: "http://mp.weixin.qq.com/mp/opshowpage?action=oplaw&id=1&t=operation/faq_index#wechat_redirect",
        pc_url: "https://mp.weixin.qq.com/cgi-bin/readtemplate?t=business/faq_operation_tmpl&type=info&lang=zh_CN#3dot3_2",
        level: 2
    }], _ = function (e) {
        return e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
    }, l = function (e, a) {
        for (var i = $(".main_bd"), p = 0, l = 0; l < r.length; l++)r[l].reason_id == e.reason_id && (p = l);
        var s = {};
        if (s.reason = '<a href="' + (r[p].pc_url ? r[p].pc_url : r[0].pc_url) + '">' + r[p].reason_description + "</a>",
                e.ban_time === e.unlock_time ? (s.forever = "永久", s.date = "") : (s.forever = "", s.date = "至" + _(new Date(1e3 * e.unlock_time))),
            a.hide && ("all" === a.hide ? i.children().hide() : $(a.hide).hide()), a.highlight) {
            a.highlight = template.compile(a.highlight)(s);
            var m = {
                title: a.highlight.split("|")[0],
                desc: template.compile(a.highlight.split("|")[1])()
            };
            $(template.compile(n)(m)).prependTo(i);
        }
        if (a.pagemsg) {
            var c = {
                content: template.compile(a.pagemsg)(s)
            };
            0 == i.find(".ban_page_msg").length && $(template.compile(o)(c)).prependTo(i);
        }
        return a.dialogmsg && t.show({
            type: "warn",
            title: "提示",
            msg: "能力封禁提示|" + template.compile(a.dialogmsg)(s),
            buttons: [{
                text: "确定",
                type: "primary",
                click: function () {
                    this.remove();
                }
            }]
        }), !1;
    }, s = function (e, a, i) {
        var n = !0;
        if (!p[a])return !0;
        for (var o = 0, t = e.length; t > o; o++)if (e[o].func_id == p[a].func_id) {
            var r = l(e[o], p[a]);
            n = r && n;
        }
        return !n && i && "function" == typeof i && i(), n;
    };
    s.getReason = function (e) {
        if ("default" == e)return r[0];
        for (var a = 0; a < r.length; a++)if (r[a].reason_id == e)return r[a];
        return r[0];
    }, s.getTypeName = function (e) {
        for (var a in p)if (p[a].func_id == e)return p[a].name;
    }, i.exports = s;
});
