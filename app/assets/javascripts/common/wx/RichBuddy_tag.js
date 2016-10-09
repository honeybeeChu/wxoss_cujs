;define('common/wx/RichBuddy_tag.js', ['common/qq/emoji.js', 'tpl/RichBuddy/RichBuddyLayout_tag.html.js', 'tpl/RichBuddy/RichBuddyContent_tag.html.js', 'tpl/RichBuddy/RichBuddyGroup_tag.html.js', 'widget/rich_buddy.css', 'common/wx/Tips.js', 'common/qq/Class.js', 'common/wx/remark.js', 'common/wx/popover.js', 'user/user_cgi_tag.js', 'user/group_cgi_tag.js', 'common/qq/events.js', 'biz_web/ui/checkbox.js', 'common/wx/inputCounter.js', 'biz_common/moment.js'], function (require, exports, module) {
    'use strict';

    require('common/qq/emoji.js');

    var tplLayout = require('tpl/RichBuddy/RichBuddyLayout_tag.html.js'),
        tplContent = require('tpl/RichBuddy/RichBuddyContent_tag.html.js'),
        tplTag = require('tpl/RichBuddy/RichBuddyGroup_tag.html.js'),
        compileContent = template.compile(tplContent),
        css = require('widget/rich_buddy.css'),
        Tips = require('common/wx/Tips.js'),
        Class = require('common/qq/Class.js'),
        Remark = require('common/wx/remark.js'),
        emoji = require('common/qq/emoji.js'),
        Popover = require('common/wx/popover.js'),
        user_cgi = require('user/user_cgi_tag.js'),
        tag_cgi = require('user/group_cgi_tag.js'),
        events = require('common/qq/events.js'),
        Checkbox = require('biz_web/ui/checkbox.js'),
        inputCounter = require('common/wx/inputCounter.js'),
        eventCenter = events(true),
        buddyCache = {},
        default_options = {
            position: {
                left: 0,
                top: 0
            },
            id: "",
            isUserIndex: false
        },
        groupCache = [],
        tagPopExist = false,
        blackPopExist = false;


    var moment = require('biz_common/moment.js');
    var _putOnPopover = function (event) {

        var currentUserInfo = event.data.user_info;


        var MAX_TAG_NUM = 3;


        var tagNum = 0;


        var currentUser = event.data.uid;


        var $dom = event.data.$dom;


        var tagCheckboxOnClick = function (event) {

            var $cb = $(event.target);

            if ($cb.attr('checked') === 'checked') {
                $pop.find('.js_tag_putOn_maxTips').hide();
                tagNum--;
                $tagWrap.find('input[type="checkbox"]').checkbox().setall(true);
            } else if (tagNum === MAX_TAG_NUM) {
                $pop.find('.js_tag_putOn_maxTips').show();
                var img = new Image();
                img.src = "//mp.weixin.qq.com/mp/jsmonitor?idkey=27826_10_1";
                event.preventDefault();
                $(event.target).removeAttr('checked').parent().removeClass('selected');
            } else {
                $pop.find('.js_tag_putOn_maxTips').hide();
                tagNum++;
            }

        };


        var renderTags = function () {

            var tagList = [],
                userList = [];


            for (var i = 0; i < groupCache.length; i++) {
                if (groupCache[i].group_id > 0) {
                    tagList.push({
                        name: groupCache[i].group_name,
                        cnt: groupCache[i].group_cnt,
                        create_time: groupCache[i].group_create_time,
                        id: groupCache[i].group_id
                    });
                }
            }


            $tagWrap.empty();
            for (var i = 0; i < tagList.length; i++) {
                if (tagList[i].name && tagList[i].name.length > 0 && tagList[i].id != 1) {
                    new Checkbox({
                        container: $tagWrap,
                        label: tagList[i].name,
                        name: tagList[i].id,
                        type: 'checkbox'
                    });
                }
            }
            ;

            $tagWrap.find('input[type="checkbox"]')
                .each(function () {
                    $(this).val($(this).attr('name'));
                }).on('click', tagCheckboxOnClick).checkbox();

            var checkedTagList = currentUserInfo.user_group_id;
            for (var i = 0; i < checkedTagList.length; i++) {
                $tagWrap.find('input[name="' + checkedTagList[i] + '"]').trigger('click');
            }
            tagNum = checkedTagList.length;

        };


        var putOnSubmit = function () {

            var _putCallback = function () {
                if (wx && wx.renderPage) {
                    wx.renderPage();
                }
                popover.remove();
                event.data.self.hide();
                $('.rich_buddy').fadeOut();
            };

            var tagCbs = $tagWrap.find('input[type="checkbox"]').checkbox();
            var checkedTagList = tagCbs.values();

            tagCbs.setall(false);


            var curTagList = currentUserInfo.user_group_id;
            var delTagList = [], addTagList = [];

            for (var i = 0; i < curTagList[i]; i++) {
                curTagList[i] = curTagList[i].toString();
            }

            for (var i = 0; i < curTagList.length; i++) {
                if (checkedTagList.indexOf(curTagList[i]) === -1) {
                    delTagList.push(curTagList[i]);
                }
            }

            for (var i = 0; i < checkedTagList.length; i++) {
                if (curTagList.indexOf(checkedTagList[i]) === -1) {
                    addTagList.push(checkedTagList[i]);
                }
            }

            if (delTagList.length === 0) {
                if (addTagList.length === 0) {
                    if (wx && wx.renderPage) {
                        wx.renderPage();
                    }
                    popover.remove();
                    event.data.self.hide();
                    $('.rich_buddy').fadeOut();
                    return;
                } else {
                    user_cgi.add_tag(currentUser, addTagList.join('|'), event.data.scene, _putCallback, popover);
                }
            } else {
                if (addTagList.length === 0) {
                    user_cgi.del_tag(currentUser, delTagList.join('|'), _putCallback, popover);
                } else {
                    user_cgi.del_tag(currentUser, delTagList.join('|'), function () {
                        user_cgi.add_tag(currentUser, addTagList.join('|'), event.data.scene, _putCallback);
                    }, popover);
                }
            }

        };

        var popover = new Popover({
            dom: $dom,
            className: 'tag_popover',
            content: tplTag,
            hideIfBlur: true,
            isToggle: true,
            buttons: [
                {
                    text: "确定",
                    click: function () {
                        $pop.find('.btn_primary').btn(false).off();
                        $addBtn.off('click');
                        putOnSubmit();
                    },
                    type: 'primary'
                },
                {
                    text: "取消",
                    click: function () {
                        this.hide();
                    }
                }
            ],
            onShow: function () {
                tagPopExist = true;
            },
            onHide: function () {
                tagPopExist = false;
                this.remove();
                event.data.self.hide();
            }
        });

        var $pop = popover.$pop,
            $addBtn = $pop.find('.js_tag_putOn_add_btn'),
            $inputWrap = $pop.find('.js_tag_input_wrap'),
            $tagWrap = $pop.find('.js_tag_putOn_tags'),
            $input = $pop.find('.js_tag_putOn_add_input'),
            $tagAdd = $pop.find('.js_tag_putOn_add_a'),
            $tagCancel = $pop.find('.js_tag_putOn_cancel_a'),
            $tagTips = $pop.find('.js_tag_putOn_tips');


        var tagCheckboxes = renderTags($tagWrap);
        var counter = new inputCounter($input, {maxLength: 6, showCounter: true, useGBKLength: true, GBKBased: true});
        $pop.find('.js_counter').hide();


        $addBtn.on('click', function () {
            $(this).hide();
            $inputWrap.show();
            $input.enable().val('');
            $tagTips.hide();
            $input.focus().trigger('keyup');
        }).show();


        $input.on('keyup', function () {
            if (counter.getCount() > 6) {
                $tagTips.text('不得超过6个汉字或12个字符').show();
            } else if (counter.getCount() > 0) {
                $tagTips.hide();
            }
        });

        $tagAdd.off().on('click', function () {
            var name = $input.val();
            if (!$input.val()) {
                $tagTips.text('请输入标签名称').show();
                return;
            } else if (counter.getCount() > 6) {
                $tagTips.text('不得超过6个汉字或12个字符').show();
                return;
            }
            $input.disable();
            tag_cgi.add(name, function (json) {
                $inputWrap.hide();
                $addBtn.show();
                var addedCheck = new Checkbox({
                    container: $tagWrap,
                    label: _htmlEncode(name),
                    name: json.groupid,
                    type: "checkbox"
                });
                addedCheck.$input.val(json.add_groupid).on('click', tagCheckboxOnClick);
                if (tagNum < 3) {
                    addedCheck.$input.trigger('click');
                }
                if (wx && wx.renderPage) {
                    wx.renderPage();
                }
                groupCache.push({
                    group_cnt: 0,
                    group_id: json.add_groupid,
                    group_name: name
                });
            }, popover, true);
        });

        $tagCancel.click(function () {
            $addBtn.show();
            $inputWrap.hide();
            $tagTips.hide();
        });

        tagPopExist = true;

    };

    var _htmlEncode = function (text) {
        return $('<div></div>').text(text).html();
    };

    var _htmlDecode = function (text) {
        return $('<div></div>').html(text).text();
    }

    var RichBuddy = Class.declare({
        $element: null,
        $content: null,
        hideTimer: null,
        namespace: ".RichBuddy",
        options: {},
        _init: function () {

            buddyCache = {};
            $('.rich_buddy').remove();

            var renderGroup = function (data, group) {
                var text = '';
                for (var i = 0; i < group.length; i++) {
                    if (data.user_group_id.indexOf(group[i].group_id) != -1) {
                        if (text !== '') {
                            text += '，';
                        }
                        text += '<span class="dib">' + group[i].group_name + '</span>';
                    }
                }
                return text;
            }

            var id = this.options.id,
                data,
                that = this;
            that._unbindEvent();


            that.$element = $(tplLayout).appendTo(document.body);
            that.$content = that.$element.find(".buddyRichContent");
            that.$loading = that.$element.find(".loadingArea");


            that._showLoading();
            user_cgi.getBuddyInfo(id, function (json) {
                if (!json || !json.base_resp) {
                    Tips.err("系统出错，请稍后重试");
                    return;
                }
                if (json.base_resp.ret == 0) {
                    var data = json.user_list.user_info_list[0];
                    data.user_name = data.user_name.emoji();
                    data.group_content = renderGroup(data, json.group_info.group_info_list);
                    if (data.user_remark === undefined) {
                        data.hide_group = true;
                    }
                    if (data.user_group_id.indexOf(1) != -1) {
                        data.is_black = true;
                    }
                    buddyCache[id] = data;
                    groupCache = json.group_info.group_info_list;

                    data.user_head_img = data.user_head_img || "http://mmbiz.qpic.cn/mmbiz/ByCS3p9sHiamT5wyGSOdQic96mUmXf8yJypIeHLvw5iaRjO79tyh1iaD42d7YPFnS4jjWb17FgYcf28/0";
                    data.user_comment_cnt = data.user_comment_cnt;
                    data.user_msg_cnt = data.user_msg_cnt;
                    data.user_reward_cnt = data.user_reward_cnt;
                    data.user_create_time && ( data.user_create_time = moment.unix(data.user_create_time).format("YYYY-MM-DD"));

                    if (data.user_openid == that.options.id) {
                        that._hideLoading();
                        that.$content.html(compileContent(data));
                        that._bindEvent();
                    }
                } else {
                    Tips.err("系统出错，请稍后重试");
                }
            });

        },
        _showLoading: function () {
            this.$loading.show();
            this.$content.hide();
        },
        _hideLoading: function () {
            this.$loading.hide();
            this.$content.show();
        },
        _bindEvent: function () {
            var self = this,
                opts = this.options;
            var data = buddyCache[opts.id];

            if (!data) {
                return;
            }

            this.$element.bind("mouseover" + this.namespace, function (e) {
                clearTimeout(self.hideTimer);
                self.hideTimer = null;
                self.$element.show();
            }).bind("mouseout" + this.namespace, function (e) {
                self._mouseout();
            });


            var $that = this.$element;
            $that.find('.js_remarkNameBox').hide();
            this.$element.find(".js_changeRemark").bind("click" + this.namespace, function () {


                var oldRemarkName, thisNickName;
                $(this).hide();
                $that.find('.js_remarkNameBox').show();


                if ($that.find('.js_remarkName').text()) {
                    oldRemarkName = $that.find('.js_remarkName').text();
                    $that.find('.js_remarkName_input').val(oldRemarkName);
                    $that.find('.js_remarkName_input').select();
                } else if ($that.find('.nickName .frm_label').text()) {
                    thisNickName = $that.find('.nickName .frm_label').text().replace(/<span.*<\/span>/, '');
                    $that.find('.js_remarkName_input').val(thisNickName);
                    $that.find('.js_remarkName_input').select();
                }

                $that.find('.js_remarkName').hide();

                var counter = new inputCounter($that.find('.js_remarkName_input'), {
                    maxLength: 30,
                    showCounter: true
                });

                $that.find('.js_remarkName_input').on('blur', function () {
                    $(this).unbind();
                    var newRemarkName = $that.find('.js_remarkName_input').val();
                    if (newRemarkName.length > 30) {
                        Tips.err("备注名不能超过30个字");
                    } else if (oldRemarkName != newRemarkName) {
                        user_cgi.change_remark(opts.id, newRemarkName, function () {
                            eventCenter.trigger("Remark:changed", opts.id, (newRemarkName + "").html(true));
                        });
                    } else {
                        Tips.suc("修改成功");
                    }
                    $that.find('.js_remarkName').show();
                    $that.find('.js_changeRemark').show();
                    counter.$inputBox.hide();
                });

            });

            eventCenter.on("Remark:changed", function (id, name) {

                if (buddyCache[id]) {
                    buddyCache[id]["user_remark"] = name;
                }
                self.$element.find(".js_remarkName").html(name);
            });


            this.$element.find('.js_buddy_tags_btn').on('click', {
                uid: opts.id,
                $dom: this.$element.find('.js_buddy_tags_btn'),
                user_info: $.extend({}, buddyCache[self.options.id], true),
                self: this,
                scene: 2
            }, _putOnPopover);


            this.$element.find('.js_popAddToBlackList').click(function () {
                var $that = $(this);
                if ($that.data('black') == 1) {
                    user_cgi.del_black($that.data('id'), function () {
                        location.reload();
                    });
                } else {
                    new Popover({
                        dom: $that,
                        content: '加入黑名单后，你将无法接收粉丝发来的消息，且该粉丝无法接收到群发消息。确认加入黑名单？',
                        hideIfBlur: true,
                        buttons: [
                            {
                                text: "确定",
                                click: function () {
                                    user_cgi.add_black($that.data('id'), function () {
                                        location.reload();
                                    });
                                    this.remove();
                                },
                                type: 'primary'
                            },
                            {
                                text: "取消",
                                click: function () {
                                    this.hide();
                                }
                            }
                        ],
                        onShow: function () {
                            blackPopExist = true;
                        },
                        onHide: function () {
                            blackPopExist = false;
                            this.remove();
                            self.hide();
                        }
                    });
                    blackPopExist = true;
                }
            });

            buddyCache = {};

        },
        _unbindEvent: function () {
            if (this.$element) {

                var namespace = this.namespace;
                this.$element.find(".js_changeRemark").unbind(namespace);
                this.$element.unbind(namespace);


                this.$element.stop();
                this.$element.css("opacity", 1);
                this.$element.show();
            }
        },
        _mouseout: function () {
            var self = this;
            if (!blackPopExist && !tagPopExist && !self.hideTimer && !$('.tag_popover').is(':visible')) {
                self.hideTimer = setTimeout(function () {
                    if (self.$element && !tagPopExist && !blackPopExist && !$('.tag_popover').is(':visible')) {
                        self.$element.fadeOut();
                        self.hideTimer = null;
                    }
                }, 1000);
            }
        },
        show: function (opts) {
            var lastid = this.options.id;
            if (opts) {
                this.options = opts;
            }


            clearTimeout(this.hideTimer);
            this.hideTimer = null;


            this._init();

            if (opts.position) {
                opts.position.top = opts.position.top - 12;
                opts.position.left = opts.position.left - 2;
                this.$element.css(opts.position);
            }
            this.$element.show();
            tagPopExist = false;
            blackPopExist = false;
        },
        hide: function () {
            this._mouseout();
        }
    });
    module.exports = RichBuddy;
});
