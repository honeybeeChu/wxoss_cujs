;define('user/index_tag.js', ['common/wx/dialog.js', 'common/wx/Tips.js', 'common/wx/pagebar.js', 'common/wx/remark.js', 'common/wx/top.js', 'common/wx/tooltips.js', 'common/wx/RichBuddy_tag.js', 'user/user_cgi_tag.js', 'user/group_cgi_tag.js', 'biz_web/ui/dropdown.js', 'common/qq/events.js', 'biz_web/ui/input/lentips.js', 'common/qq/emoji.js', 'common/wx/popover.js', 'tpl/user/grouplist_tag.html.js', 'tpl/user/userlist_tag.html.js', 'biz_web/ui/checkbox.js', 'common/wx/Cgi.js', 'common/wx/inputCounter.js', 'common/wx/searchInput.js'], function (require, exports, module) {
    'use strict';


    template.isEscape = false;

    var T = wx.T,
        render = template.render,
        Dialog = require('common/wx/dialog.js'),
        Tips = require('common/wx/Tips.js'),
        PageBar = require('common/wx/pagebar.js'),
        remark = require('common/wx/remark.js'),
        Top = require('common/wx/top.js'),
        Tooltips = require('common/wx/tooltips.js'),
        RichBuddy = require('common/wx/RichBuddy_tag.js'),
        user_cgi = require('user/user_cgi_tag.js'),
        tag_cgi = require('user/group_cgi_tag.js'),
        Dropdown = require('biz_web/ui/dropdown.js'),
        Event = require('common/qq/events.js'),
        InputlenTips = require('biz_web/ui/input/lentips.js'),
        emoji = require('common/qq/emoji.js'),
        Popover = require('common/wx/popover.js'),
        _groupListHtml = require('tpl/user/grouplist_tag.html.js'),
        _userListHtml = require('tpl/user/userlist_tag.html.js'),
        Checkbox = require('biz_web/ui/checkbox.js'),
        Cgi = require('common/wx/Cgi.js'),
        inputCounter = require('common/wx/inputCounter.js'),
        isInit = false;

    var Page = (function (data) {

        var groupsList = data.group_list,
            friendsList = data.user_list || [],
            currentGroup,
            currentGroupId = '-2',
            groupsListTemp = [],
            eventCenter = Event(true),
            blackList = {},
            totalUserNum = data.total_user_num,
            tagList,
            currentPage = 1,
            $no_result = $("<p class='no_result'>无结果,请重新搜索或查看<a href='javascript:;' id='js_reload'>全部用户</a></p>").appendTo($('.user_list')).hide(),
            searchWord = '',
            pageJumpOpt = null;


        function getUser(id) {
            for (var i = 0; i < friendsList.length; i++) {
                if (friendsList[i].id == id) {
                    return friendsList[i];
                }
            }
        }


        function transTag(id) {
            for (var i = 0; i < groupsList.length; i++) {
                if (groupsList[i].id == id) {
                    return '<a href="javascript:;" class="js_user_tags" data-id="%s">%s</a>'.sprintf(id, groupsList[i].name);
                }
            }
        }

        function putOnPopover(event) {


            var MAX_TAG_NUM = 3;


            var tagNum = 0;


            var currentUserList;
            if (!event.data.uid) {
                return;
            } else if (Object.isObject(event.data.uid)) {
                currentUserList = event.data.uid.values();
            } else {
                currentUserList = [event.data.uid];
            }


            var $dom = event.data.$dom;
            if (!$dom) {
                return;
            } else if (typeof $dom === 'string') {
                $dom = $($dom);
            }


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
                    userList = friendsList;

                for (var i = 0; i < groupsList.length; i++) {
                    if (groupsList[i].id > 0) {
                        tagList.push(groupsList[i]);
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


                var checkedTagList = [];
                if (currentUserList.length === 1) {
                    for (var i = 0; i < userList.length; i++) {
                        if (userList[i].id == currentUserList[0]) {
                            checkedTagList = userList[i].group_id;
                        }
                    }
                    for (var i = 0; i < checkedTagList.length; i++) {
                        $tagWrap.find('input[name="' + checkedTagList[i] + '"]').trigger('click');
                    }
                    tagNum = checkedTagList.length;
                } else {
                    checkedTagList = getUser(currentUserList[0]).group_id;
                    var _tagNum = checkedTagList.length;
                    for (var i = 1; i < currentUserList.length; i++) {
                        var tmpList = getUser(currentUserList[i]).group_id;
                        for (var j = 0; j < checkedTagList.length; j++) {
                            if (tmpList.indexOf(checkedTagList[j]) === -1) {
                                checkedTagList[j] = undefined;
                            }
                        }
                        if (tmpList.length > _tagNum) {
                            _tagNum = tmpList.length;
                        }
                    }
                    for (var i = 0; i < checkedTagList.length; i++) {
                        if (checkedTagList[i] !== undefined) {
                            $tagWrap.find('input[name="' + checkedTagList[i] + '"]').trigger('click').checkbox().setall(false);
                        }
                    }
                    tagNum = _tagNum;
                }

            };


            var putOnSubmit = function () {

                var _putCallback = wx.renderPage;

                var tagCbs = $tagWrap.find('input[type="checkbox"]').checkbox();
                var checkedTagList = tagCbs.values();

                //新增判断只能选择一个标签
                if(checkedTagList.length > 1){
                    alert("只能选择一个标签，请重选！");
                    popover.remove();
                    return;
                }

                if (currentUserList.length === 1) {

                    tagCbs.setall(false);


                    var curTagList = getUser(currentUserList[0]).group_id,
                        delTagList = [],
                        addTagList = [];

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
                            popover.remove();
                            return;
                        } else {
                            user_cgi.add_tag(currentUserList[0], addTagList.join('|'), event.data.scene, _putCallback, popover);
                        }
                    } else {
                        if (addTagList.length === 0) {
                            user_cgi.del_tag(currentUserList[0], delTagList.join('|'), _putCallback, popover);
                        } else {
                            user_cgi.del_tag(currentUserList[0], delTagList.join('|'), function () {
                                user_cgi.add_tag(currentUserList[0], addTagList.join('|'), event.data.scene, _putCallback);
                            }, popover);
                        }
                    }

                } else {


                    checkedTagList = [];
                    $tagWrap.find('input[type="checkbox"]').each(function () {
                        if ($(this).attr('checked') === 'checked' && !$(this).attr('disabled')) {
                            checkedTagList.push($(this).val());
                        }
                    });

                    if (checkedTagList.length === 0) {
                        popover.remove();
                        return;
                    } else {
                        tagCbs.setall(false);
                        user_cgi.add_tag(currentUserList.join('|'), checkedTagList.join('|'), event.data.scene, _putCallback, popover);
                    }
                }

            };

            var popover = new Popover({
                dom: $dom,
                className: "tag_popover",
                content: $('#js_tag_putOn_tpl').html(),
                hideIfBlur: true,
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
                            this.remove();
                        }
                    }
                ],
                addCls: 'js_putOn'
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
            var counter = new inputCounter($input, {
                maxLength: 6,
                showCounter: true,
                useGBKLength: true,
                GBKBased: true
            });

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

            $tagAdd.click(function () {
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
                        label: htmlEncode(name),
                        name: json.groupid,
                        type: "checkbox"
                    });
                    addedCheck.$input.val(json.add_groupid).on('click', tagCheckboxOnClick);
                    if (tagNum < 3) {
                        addedCheck.$input.trigger('click');
                    }
                    groupsList.push({
                        cnt: 0,
                        create_time: -1,
                        id: json.add_groupid,
                        name: htmlEncode(name)
                    });
                    initData();
                    _initRight();
                }, popover, true);
            });

            $tagCancel.click(function () {
                $addBtn.show();
                $inputWrap.hide();
                $tagTips.hide();
            });

        }


        function transFriend(json) {
            friendsList = [];
            var _list = json.user_list ? json.user_list.user_info_list : [];
            for (var i = 0; i < _list.length; i++) {
                friendsList.push({
                    id: _list[i].user_openid,
                    nick_name: _list[i].user_name,
                    remark_name: _list[i].user_remark,
                    create_time: _list[i].user_create_time,
                    headimgurl: _list[i].headimgurl,
                    group_id: _list[i].user_group_id
                });
            }
        }


        function transGroup(json) {
            groupsList = [];
            var _list = json.group_info ? json.group_info.group_info_list : [];
            for (var i = 0; i < _list.length; i++) {
                groupsList.push({
                    name: _list[i].group_name,
                    cnt: _list[i].group_cnt,
                    create_time: _list[i].group_create_time,
                    id: _list[i].group_id
                });
            }
        }

        function htmlEncode(text) {
            return $('<div></div>').text(text).html();
        }

        function htmlDecode(text) {
            return $('<div></div>').html(text).text();
        }


        function initCurrentGroup() {
            for (var i = 0; i < groupsList.length; i++) {
                if (groupsList[i].id == currentGroupId || groupsList[i].id * currentGroupId == -1) {
                    currentGroup = groupsList[i];
                    return;
                }
            }
            currentGroup = {
                id: -2,
                name: '全部用户',
                cnt: data.total_user_num
            };
        }


        function initTagBtn() {


            (function () {

                var counter;

                var _add = function (dom$, pop) {
                    var t = dom$,
                        name = t.val().trim(),
                        submitBtn$ = pop.$pop.find('.jsPopoverBt').eq(0);
                    if (!submitBtn$.attr('disabled')) {
                        submitBtn$.btn(false);
                        if (name === '' || name.bytes() > 12) {
                            Tips.err('标签名称为1~6字符');
                            t.focus();
                            submitBtn$.btn(true);
                            return false;
                        }
                        tag_cgi.add(name, function (json) {
                            groupsList.push({
                                cnt: 0,
                                create_time: -1,
                                id: json.add_groupid,
                                name: htmlEncode(name)
                            });
                            initData();
                            _initRight();
                        }, pop);
                    }
                };

                $('#js_tag_add_btn').off().on('click', function () {
                    var popover = new Popover({
                        dom: this,
                        content: render('js_tag_edit_tpl', {name: '', tagid: ''}),
                        hideIfBlur: true,
                        buttons: [
                            {
                                text: '确定',
                                click: function (event) {
                                    if (!$input.val()) {
                                        $tips.text('请输入标签名称').show();
                                        return;
                                    }
                                    _add(this.$pop.find('.js_name'), this);
                                },
                                type: 'primary'
                            },
                            {
                                text: '取消',
                                click: function (event) {
                                    this.remove();
                                }
                            }
                        ],
                        onHide: function () {
                            this.remove();
                        }
                    });

                    var $input = popover.$pop.find('.js_name'),
                        $tips = popover.$pop.find('.js_tips'),
                        counter = new inputCounter($input, {
                            maxLength: 6,
                            showCounter: true,
                            useGBKLength: true,
                            GBKBased: true
                        });

                    popover.$pop.find('.js_counter').hide();

                    $input.on('keyup', function () {
                        if (counter.getCount() > 6) {
                            $tips.text('不得超过6个汉字或12个字符').show();
                        } else if (counter.getCount() > 0) {
                            $tips.hide();
                        }
                    });

                    popover.$pop.find('.js_name').keypress(function (e) {
                        if (!wx.isHotkey(e, 'enter')) {
                            return;
                        } else if (!$input.val()) {
                            $tips.text('请输入标签名称').show();
                            return;
                        } else if (counter.getCount() > 6) {
                            $tips.text('不得超过6个汉字或12个字符').show();
                            return;
                        }
                        _add(popover.$pop.find('.js_name'), popover);
                    });


                    popover.$pop.find('.js_name').focus();
                });

            })();


            (function () {

                var _edit = function (dom$, pop) {
                    var t = dom$,
                        tagid = currentGroupId,
                        name = t.val().trim(),
                        submitBtn$ = pop.$pop.find('.jsPopoverBt').eq(0);
                    if (!submitBtn$.attr('disabled')) {
                        submitBtn$.btn(false);
                        if (name === '' || name.bytes() > 12) {
                            Tips.err('不得超过6个汉字或12个字符');
                            t.focus();
                            submitBtn$.btn(true);
                            return false;
                        }
                        tag_cgi.rename(tagid, name, function (json) {
                            for (var i = 0; i < groupsList.length; i++) {
                                if (groupsList[i].id == tagid) {
                                    groupsList[i].name = htmlEncode(name);
                                }
                            }
                            tag_cgi.get_user({groupid: currentGroupId}, function (json) {
                                transFriend(json);
                                transGroup(json);
                                init();
                            });
                        }, pop);
                    }
                };

                $('.js_tag_edit_btn').on('click', function () {
                    var _tagid = currentGroupId;
                    $('.popover').hide();
                    var popover = new Popover({
                        dom: this,
                        content: render('js_tag_edit_tpl', {name: currentGroup.name, tagid: _tagid}),
                        hideIfBlur: true,
                        buttons: [
                            {
                                text: '确定',
                                click: function (event) {
                                    if (!$input.val() || counter.getCount() > 6) {
                                        return;
                                    }
                                    _edit(this.$pop.find('.js_name'), this);
                                },
                                type: 'primary'
                            },
                            {
                                text: '取消',
                                click: function (event) {
                                    this.remove();
                                }
                            }
                        ],
                        onHide: function () {
                            this.remove();
                        }
                    });

                    var $input = popover.$pop.find('.js_name'),
                        $tips = popover.$pop.find('.js_tips'),
                        counter = new inputCounter($input, {
                            maxLength: 6,
                            showCounter: true,
                            useGBKLength: true,
                            GBKBased: true
                        });

                    popover.$pop.find('.js_counter').hide();

                    $input.on('keyup', function () {
                        if (counter.getCount() > 6) {
                            $tips.text('不得超过6个汉字或12个字符').show();
                        } else if (counter.getCount() > 0) {
                            $tips.hide();
                        }
                    });

                    popover.$pop.find('.js_name').keypress(function (e) {
                        if (!wx.isHotkey(e, 'enter')) {
                            return;
                        } else if (!$input.val()) {
                            $tips.text('请输入标签名称').show();
                            return;
                        } else if (counter.getCount() > 6) {
                            $tips.text('不得超过6个汉字或12个字符').show();
                            return;
                        }
                        _edit($(this), popover);
                    });


                    popover.$pop.find('.js_name').focus();
                });

            })();


            (function () {

                $(".js_tag_del_btn").on('click', function () {
                    var this$ = $(this),
                        _tagid = currentGroupId;
                    $('.popover').hide();
                    new Popover({
                        dom: this,
                        content: $('#js_tag_del_tpl').html(),
                        hideIfBlur: true,
                        buttons: [
                            {
                                text: '确定',
                                click: function (event) {
                                    var that = this;
                                    var confirmBtn = that.$pop.find('.jsPopoverBt').eq(0).btn(false);
                                    tag_cgi.del(_tagid, function (json) {
                                        $('.js_group_link[data-id="-2"]').click();
                                    }, that);
                                },
                                type: 'primary'
                            },
                            {
                                text: '取消',
                                click: function (event) {
                                    this.remove();
                                }
                            }
                        ]
                    });
                });

            })();

        }


        function initData() {


            groupsListTemp = [];
            var starGroup;
            for (var i = 0; i < groupsList.length; i++) {
                if (groupsList[i]) {
                    if (groupsList[i].name == "屏蔽组") {
                        groupsList[i].name = "黑名单";
                    }
                    if (groupsList[i].name == "星标组") {
                        groupsList[i].name = "星标用户";
                    }
                    if (groupsList[i].id == 1 || groupsList[i].id == -1) {
                        blackList = {num: groupsList[i].cnt};
                        groupsList[i].id = -1;
                    } else if (groupsList[i].id > 0) {
                        if (groupsList[i].id == 2) {
                            starGroup = groupsList[i];
                        } else {
                            groupsListTemp.push(groupsList[i]);
                        }
                    }
                }
            }


            groupsListTemp = [starGroup].concat(groupsListTemp.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            }));


            for (var i = 0; i < friendsList.length; i++) {
                friendsList[i].img = wx.url(friendsList[i].headimgurl);
                friendsList[i].link = wx.url('/cgi-bin/singlesendpage?t=message/send&action=index&tofakeid=' + friendsList[i].id);
                friendsList[i].nick_name = friendsList[i].nick_name.emoji();
                friendsList[i].tags = '';
                for (var j = 0; j < friendsList[i].group_id.length; j++) {
                    friendsList[i].tags += transTag(friendsList[i].group_id[j]);
                    if (j != friendsList[i].group_id.length - 1) {
                        friendsList[i].tags += '，';
                    }
                    if (friendsList[i].group_id[j] == 1 || friendsList[i].group_id[j] == -1) {
                        friendsList[i].is_black = true;
                    }
                }
            }

        }


        function _initRight() {


            var _total = totalUserNum - blackList.num;
            var thisGroupId = currentGroupId;
            if (thisGroupId == -2) {
                thisGroupId = -1;
            } else if (thisGroupId == -1) {
                thisGroupId = 1;
            }
            if (friendsList.length === 20) {
                if (currentGroup.cnt < 20) {


                    Cgi.post({
                        mask: false,
                        url: '/wxoss/wx_users/fixgroupcnt',
                        data: {
                            groupid: thisGroupId
                        }
                    }, function () {
                    });
                }
            } else {
                if (currentGroup.cnt < friendsList.length) {


                    Cgi.post({
                        mask: false,
                        url: '/wxoss/wx_users/fixgroupcnt',
                        data: {
                            groupid: thisGroupId
                        }
                    }, function () {
                    });
                }
            }


            $('#groupsList').html(T(_groupListHtml, {
                groupsList: groupsListTemp,
                allUser: {num: _total},
                blackList: blackList,
                groupId: currentGroupId
            }));


            $('.js_group_link').click(function () {
                currentGroupId = $(this).data('id');
                tag_cgi.get_user({groupid: currentGroupId}, function (json) {
                    transFriend(json);
                    transGroup(json);
                    init();
                });
            });
        }

        function initPage() {


            var top = new Top("#topTab", Top.DATA.user);
            top.selected(0);


            $('#js_groupName').html(currentGroup.name);


            if (currentGroupId >= 3) {
                $('.js_groupCommand').show();
            } else {
                $('.js_groupCommand').hide();
            }


            if (currentGroupId == -1) {
                $('.js_tag_toBanList_btn').text('移出黑名单');
                $('.js_tag_putOn_btn').hide();
            } else {
                $('.js_tag_toBanList_btn').text('加入黑名单');
                $('.js_tag_putOn_btn').show();
            }


            _initRight();


            if (friendsList.length === 0) {

                $(".js_pageNavigator").hide();
                $('.user_list > table').hide();
                $no_result.show();
                $('#js_reload').click(function () {
                    $('.js_group_link[data-id="-2"]').click();
                });

            } else {

                $no_result.hide();
                $('.user_list > table').show();
                $('#userGroups').html(T(_userListHtml, {friendsList: friendsList}));


                $('#userGroups .js_tags_btn').each(function () {
                    $(this).on('click', {uid: $(this).data('id'), $dom: $(this), scene: 1}, putOnPopover);
                });


                var buddy = new RichBuddy();
                $('.js_msgSenderAvatar').mouseover(function () {
                    var this$ = $(this),
                        id = this$.data('id'),
                        offset = this$.offset(),
                        width = this$.width();
                    buddy.show({
                        id: id,
                        autoRefresh: true,
                        position: {left: offset.left + width + 2, top: offset.top},
                        isUserIndex: true
                    });
                }).mouseout(function () {
                    buddy.hide();
                });


                if (currentGroup.cnt > 20) {
                    if (!searchWord) {
                        var pagebar = new PageBar({
                            container: ".js_pageNavigator",
                            perPage: 20,
                            initShowPage: currentPage,
                            totalItemsNum: currentGroup.cnt,
                            first: false,
                            last: false,
                            isSimple: true,
                            callback: function (pages) {
                                if (currentPage != pages.currentPage) {
                                    if (parseInt(pages.currentPage) > parseInt(currentPage)) {

                                        if (parseInt(pages.currentPage) - parseInt(currentPage) > 25) {
                                            Tips.err('跳转页数超过上限，请重新输入');
                                            return false;
                                        } else {
                                            pageJumpOpt = {
                                                groupid: currentGroup.id,
                                                begin_openid: friendsList[friendsList.length - 1].id,
                                                begin_create_time: friendsList[friendsList.length - 1].create_time,
                                                limit: 20,
                                                offset: (parseInt(pages.currentPage) - parseInt(currentPage) - 1) * 20,
                                                backfoward: 1
                                            };
                                            tag_cgi.get_user(pageJumpOpt, function (json) {
                                                transFriend(json);
                                                transGroup(json);
                                                init({notResetPage: true});
                                                if (pages.currentPage == parseInt(currentGroup.cnt / 20) + 1) {

                                                    if (currentGroup.cnt != pages.currentPage * 20 - 20 + json.user_list.user_info_list.length) {

                                                        var thisGroupId = currentGroupId;
                                                        if (thisGroupId == -2) {
                                                            thisGroupId = -1;
                                                        } else if (thisGroupId == -1) {
                                                            thisGroupId = 1;
                                                        }
                                                        Cgi.post({
                                                            mask: false,
                                                            url: '/wxoss/wx_users/fixgroupcnt',
                                                            data: {
                                                                groupid: thisGroupId
                                                            }
                                                        }, function () {
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    } else {

                                        if (parseInt(pages.currentPage) - parseInt(currentPage) < -25) {
                                            Tips.err('跳转页数超过上限，请重新输入');
                                            return false;
                                        } else {
                                            pageJumpOpt = {
                                                groupid: currentGroup.id,
                                                begin_openid: friendsList[0].id,
                                                begin_create_time: friendsList[0].create_time,
                                                limit: 20,
                                                offset: (parseInt(currentPage) - parseInt(pages.currentPage) - 1) * 20,
                                                backfoward: 0
                                            };
                                            tag_cgi.get_user(pageJumpOpt, function (json) {
                                                transFriend(json);
                                                transGroup(json);
                                                init({notResetPage: true});
                                            });
                                        }
                                    }
                                    currentPage = pages.currentPage;
                                }
                            }
                        });
                    } else {
                        var pagebar = new PageBar({
                            container: ".js_pageNavigator",
                            perPage: 20,
                            initShowPage: currentPage,
                            totalItemsNum: currentGroup.cnt,
                            first: false,
                            last: false,
                            isSimple: true,
                            callback: function (pages) {
                                if (currentPage != pages.currentPage) {
                                    tag_cgi.search({
                                        query: searchWord,
                                        pageidx: pages.currentPage - 1
                                    }, function (json) {
                                        transFriend(json);
                                        currentPage = pages.currentPage;
                                        init({searchWord: searchWord, notResetPage: true});
                                    });
                                }
                            }
                        });
                    }
                } else {
                    $('.js_pageNavigator').empty();
                }


                $('.js_user_tags').click(function () {
                    $('#groupsList').find('a[data-id="' + $(this).data('id') + '"]').click();
                });

            }

        }


        function initCheckbox() {


            var toBanList = function () {
                var $that = $(this);
                var _tofakeidlist = userCheckboxes.values();
                if (currentGroupId == -1) {
                    new Popover({
                        dom: $that,
                        content: '确认移出黑名单？',
                        hideIfBlur: true,
                        buttons: [
                            {
                                text: "确定",
                                click: function () {
                                    user_cgi.del_black(_tofakeidlist.join('|'), function () {
                                        tag_cgi.get_user({groupid: currentGroupId}, function (json) {
                                            transFriend(json);
                                            transGroup(json);
                                            init();
                                        });
                                    });
                                    this.remove();
                                },
                                type: 'primary'
                            },
                            {
                                text: "取消",
                                click: function () {
                                    this.remove();
                                }
                            }
                        ]
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
                                    user_cgi.add_black(_tofakeidlist.join('|'), function () {
                                        tag_cgi.get_user({groupid: currentGroupId}, function (json) {
                                            transFriend(json);
                                            transGroup(json);
                                            init();
                                        });
                                    });
                                    this.remove();
                                },
                                type: 'primary'
                            },
                            {
                                text: "取消",
                                click: function () {
                                    this.remove();
                                }
                            }
                        ]
                    });
                }
            };

            var userCheckboxes = $('.js_select').checkbox();
            $('#selectAll').removeAttr('checked').parent().removeClass('select');
            $('.js_tag_putOn_btn, .js_tag_toBanList_btn').addClass('btn_disabled').off();

            $('#selectAll').on('change', function (e) {
                var status = $(this).prop("checked");
                $(".js_select").each(function () {
                    if ($(this).prop('disabled')) {
                        return;
                    }
                    $(this).checkbox().checked(status);
                });
            }).checkbox();

            $('#selectAll, .js_select').on('change', function () {
                var _tofakeidlist = userCheckboxes.values();
                if (_tofakeidlist.length > 0) {
                    $('.js_tag_putOn_btn').removeClass('btn_disabled');
                    $('.js_tag_putOn_btn').off().on('click', {
                        uid: userCheckboxes,
                        $dom: '.js_tag_putOn_btn',
                        scene: 3
                    }, putOnPopover);
                    $('.js_tag_toBanList_btn').removeClass('btn_disabled');
                    $('.js_tag_toBanList_btn').off().on('click', toBanList);
                } else {
                    $('.js_tag_putOn_btn').addClass('btn_disabled');
                    $('.js_tag_putOn_btn').off();
                    $('.js_tag_toBanList_btn').addClass('btn_disabled');
                    $('.js_tag_toBanList_btn').off();
                }
            });
        }


        function initChangeRemark() {

            $('#userGroups').on('click', '.js_msgSenderRemark', function () {
                var id = $(this).data('fakeid'),
                    $that = $(this),
                    remarkNameDom = $('.remark_name[data-fakeid=' + id + ']'),
                    nickNameDom = $('.nick_name[data-fakeid=' + id + ']'),
                    name = remarkNameDom.text();

                var renameTpl = render('js_changeRemarkName', {list: null});

                new Popover({
                    dom: $that,
                    content: renameTpl,
                    place: 'bottom',
                    margin: 'center',
                    hover: true,
                    hideIfBlur: true,
                    buttons: [
                        {
                            text: "确定",
                            click: function () {
                                var remarkName = $('.js_remarkName_input:visible').val();
                                user_cgi.change_remark($that.data('fakeid'), remarkName, function (data) {
                                    Tips.suc("修改成功");
                                    eventCenter.trigger("Remark:changed", $that.data('fakeid'), (remarkName + "").html(true));
                                });
                                this.remove();
                            },
                            type: "primary"
                        },
                        {
                            text: "取消",
                            click: function () {
                                this.remove();
                            },
                            type: "default"
                        }
                    ]
                });
                $('.js_remarkName_input:visible').val(name);
                $('.js_remarkName_input').each(function () {
                    $(this).select();
                    new inputCounter($(this), {maxLength: 30, showCounter: true});
                });
            });

            eventCenter.on("Remark:changed", function (id, remarkName) {
                var remarkNameDom = $('.remark_name[data-fakeid=' + id + ']'),
                    nickNameDom = $('.nick_name[data-fakeid=' + id + ']'),
                    nickName = nickNameDom.html();

                if (remarkName == '' && nickName == '') {
                } else if (remarkName == '' && nickName != '') {
                    remarkNameDom.html(nickNameDom.find('strong').html());
                    nickNameDom.html('');
                } else if (remarkName != '' && nickName == '') {
                    nickNameDom.html('(<strong>' + remarkNameDom.html() + '</strong>)');
                    remarkNameDom.html(remarkName);
                } else {
                    remarkNameDom.html(remarkName);
                }
            });
        }


        function initSearch() {
            var SearchInput = require('common/wx/searchInput.js');
            new SearchInput({
                id: "#searchBar",
                value: searchWord,
                placeholder: "用户昵称",
                click: function (key) {
                    if (key.length > 0) {
                        tag_cgi.search({
                            query: key
                        }, function (json) {
                            transFriend(json);
                            searchWord = key;
                            currentGroupId = -2;
                            currentGroup = {
                                id: -2,
                                name: '全部用户',
                                cnt: json.total_user_num
                            };
                            init({searchWord: searchWord});
                        });
                    } else {
                        Tips.err("请输入搜索关键词");
                    }
                }
            });

            if (searchWord) {
                $(".remark_name, .nick_name").each(function (_, el) {
                    if (!$(el).text().match(/<script>/g)) {
                        $(el).contents().filter(function () {
                            return this.nodeType != 1;
                        }).each(function (_, node) {
                            $(node).replaceWith(htmlEncode($(node).text()).replace(new RegExp(searchWord, "g"), '<span class="highlight">' + searchWord + '</span>') + "");
                        });
                    }
                });
            }
        }

        function init(opt) {
            if (!isInit) {
                for (var i = 0; i < groupsList.length; i++) {
                    groupsList[i].name = htmlDecode(groupsList[i].name);
                }
                isInit = true;
            }
            if (opt) {
                searchWord = opt.searchWord || '';
                currentPage = opt.notResetPage ? currentPage : 1;
            } else {
                searchWord = '';
                currentPage = 1;
                pageJumpOpt = null;
            }
            if (!searchWord) {
                initCurrentGroup();
            }
            initTagBtn();
            initData();
            initPage();
            initCheckbox();
            initChangeRemark();
            initSearch();


            wx.renderPage = function () {
                if (searchWord) {
                    tag_cgi.search({
                        query: searchWord,
                        pageidx: currentPage - 1
                    }, function (json) {
                        transFriend(json);
                        init({notResetPage: true, searchWord: searchWord});
                    });
                } else {
                    tag_cgi.get_user(pageJumpOpt ? pageJumpOpt : {groupid: currentGroupId}, function (json) {
                        transFriend(json);
                        transGroup(json);
                        init({notResetPage: true});
                    });
                }
            };
        }

        return {
            init: init
        };

    })(wx.cgiData);

    Page.init();

});
