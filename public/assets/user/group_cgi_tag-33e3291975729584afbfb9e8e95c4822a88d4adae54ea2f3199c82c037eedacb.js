;define('user/group_cgi_tag.js', ['common/wx/Cgi.js', 'biz_web/lib/json.js', 'common/wx/Tips.js'], function (require, exports, module) {
    'use strict';

    var Cgi = require('common/wx/Cgi.js'),
        JSON = require('biz_web/lib/json.js'),
        Tips = require('common/wx/Tips.js');

    module.exports = {
        add: function (name, successFn, pop, isHold) {
            Cgi.post({
                url: '/wxoss/wx_users/create_group',
                data: {
                    action: 'create_group',
                    group_name: name
                },
                mask: false
            }, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err('添加失败');
                    return;
                }
                var errorCode = json.base_resp.ret * 1;
                switch (errorCode) {
                    case 0 :
                        typeof successFn === 'function' && successFn(json);
                        break;
                    case 213001 :
                        var $tips = pop.$pop.find('.js_tips, .js_tag_putOn_tips');
                        $tips.text('该标签名字已存在，请重新输入').show();
                        pop.$pop.find('.js_tag_putOn_add_input').enable();
                        pop.$pop.find('.jsPopoverBt:eq(0)').btn(true);
                        return;
                    default :
                        Tips.err('添加失败');
                        break;
                }
                if (pop && !isHold) {
                    pop.remove();
                }
            });
        },
        rename: function (id, name, successFn, pop) {
            Cgi.post({
                url: '/wxoss/wx_users/rename_group',
                data: {
                    action: 'rename_group',
                    groupid: id,
                    group_name: name
                },
                mask: false
            }, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err('修改失败');
                    return;
                }
                var errorCode = json.base_resp.ret;
                switch (errorCode) {
                    case 0 :
                        Tips.suc('修改成功');
                        typeof successFn === 'function' && successFn(json);
                        break;
                    case 213001 :
                        var $tips = pop.$pop.find('.js_tips');
                        $tips.text('该标签名字已存在，请重新输入').show();
                        pop.$pop.find('.jsPopoverBt:eq(0)').btn(true);
                        return;
                    default :
                        Tips.err('修改失败');
                        break;
                }
                if (pop && !pop.$pop.hasClass('js_putOn')) {
                    pop.remove();
                }
            });
        },
        del: function (id, successFn, pop) {
            Cgi.post({
                url: '/wxoss/wx_users/del_group',
                data: {
                    action: 'del_group',
                    groupid: id
                },
                mask: false
            }, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err('删除失败');
                    return;
                }
                var errorCode = json.base_resp.ret;
                if (errorCode == 0) {
                    Tips.suc('删除成功');
                    typeof successFn === 'function' && successFn(json);
                } else {
                    Tips.err('删除失败');
                }
                if (pop) {
                    pop.remove();
                }
            });
        },
        get_user: function (opt, successFn) {
            var _opt = {
                begin_openid: -1,
                begin_create_time: -1,
                limit: 20,
                offset: 0,
                backfoward: 1
            };
            opt = $.extend(_opt, opt);
            if (opt.groupid == -1) {
                opt.groupid = 1;
            }
            Cgi.get({
                url: '/wxoss/wx_users/get_user_list?action=get_user_list&groupid=' + opt.groupid + '&begin_openid=' + opt.begin_openid + '&begin_create_time=' + opt.begin_create_time + '&limit=' + opt.limit + '&offset=' + opt.offset + '&backfoward=' + opt.backfoward,
                mask: false
            }, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err('获取用户列表失败');
                    return;
                }
                var errorCode = json.base_resp.ret;
                if (errorCode == 0) {
                    typeof successFn === 'function' && successFn(json);
                } else {
                    Tips.err('获取用户列表失败');
                }
            });
        },
        search: function (opt, successFn) {
            var _opt = {
                pagesize: 20,
                pageidx: 0
            };
            opt = $.extend(_opt, opt);
            Cgi.post({
                url: '/wxoss/wx_users/search?action=search',
                data: opt,
                mask: false
            }, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err('系统错误，请稍后重试');
                    return;
                }
                var errorCode = json.base_resp.ret;
                if (errorCode == 0) {
                    typeof successFn === 'function' && successFn(json);
                } else {
                    Tips.err('系统错误，请稍后重试');
                }
            });
        }
    };
});
