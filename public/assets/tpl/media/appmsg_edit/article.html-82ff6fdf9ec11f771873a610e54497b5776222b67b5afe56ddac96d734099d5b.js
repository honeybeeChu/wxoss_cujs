define("tpl/media/appmsg_edit/article.html.js", [], function () {
    return '<!--\n<div class="page_msg mini">\n    <div class="inner">\n        <span class="msg_icon_wrp"><i class="icon_msg warn"></i></span>\n        <div class="msg_content">\n            <p>xxxxxxx</p>\n        </div>\n    </div>\n    <span class="msg_closed">关闭</span>\n</div>\n-->\n<div class="appmsg_editor">\n    <div class="appmsg_editor_inner">\n        <!-- BEGIN UEDITOR -->\n        <div id="js_ueditor" class="appmsg_edit_item content_edit">\n            <label for="" class="frm_label" style="display:none;">\n                <strong class="title">正文</strong>\n\n                <p class="tips l">\n                    <em id="js_auto_tips"></em>\n                    <a id="js_cancle" style="display:none;" href="javascript:void(0);"\n                       onclick="return false;">取消</a>\n                </p>\n            </label>\n<!--        <div class="frm_msg fail js_catch_tips" style="display:none;">有5张图片粘贴失败</div>\n            <div class="frm_msg fail js_content_error" style="display:none;">正文不能为空且长度不能超过20000字</div> -->\n            <div id="js_editor" class="edui_editor_wrp"></div>\n        </div>\n        <!-- END UEDITOR -->\n\n        <div class="appmsg_edit_function_area ">\n            <!-- BEGIN 原文链接 -->\n            <div class="js_url_area appmsg_edit_item origin_url_area">\n                <label for="" class="frm_label">\n                    <label class="frm_checkbox_label" for="js_url_checkbox">\n                        <input type="checkbox" class="frm_checkbox js_url_checkbox js_field" name="source_url_checked">\n                        <i class="icon_checkbox"></i>\n                        <span class="lbl_content">\n                            原文链接                        </span>\n                    </label>\n                </label>\n                <span class="frm_input_box" style="display:none;"><input type="text" class="js_url frm_input js_field" name="source_url"></span>\n\n                <div class="frm_msg fail js_url_error" style="display:none;">链接不合法</div>\n            </div>\n            <!-- END 原文链接 -->\n            <!--BEGIN 留言 -->\n            {if can_use_comment}\n            <div class="appmsg_edit_item ">\n                <label class="frm_checkbox_label comment_checkbox" for="">\n                    <input type="checkbox" class="frm_checkbox js_comment js_field" checked name="need_open_comment">\n                    <i class="icon_checkbox"></i>\n                    <span class="lbl_content">留言<span class="tips_global">勾选后读者将可以在文章底部留言</span></span>\n                </label>\n            </div>\n            {/if}\n            <!-- END 留言-->\n            {if has_invited_original}\n            <!--如果可以使用原创功能-->\n            <div id="js_original" class="appmsg_edit_item original_area ">\n                <!--BEGIN 未开通原创-->\n                {if can_use_copyright}\n                <div class="unorigin js_original_type">\n                    <div class="cont">\n                        <h4 class="subtitle">原创：未声明</h4>\n                        <p class="tips_global original_title_tips">原创声明是公众平台关于支持原创者的功能</p>\n                    </div>\n                    <div class="opt">\n                        <a href="javascript:;" onclick="return false;" class="btn btn_default js_original_apply">声明原创</a>\n                    </div>\n                </div>\n                {else}\n                <div class="unorigin js_original_type">\n                    <div class="cont">\n                        {if orginal_apply_stat == 0}\n                        <h4 class="subtitle">原创声明：未开通</h4>\n                        {else if orginal_apply_stat == 1}\n                        <h4 class="subtitle">原创声明：审核中</h4>\n                        {else if orginal_apply_stat == 2}\n                        <h4 class="subtitle">原创声明：申请失败</h4>\n                        {else if orginal_apply_stat == 3}\n                        <h4 class="subtitle">原创声明：申请成功</h4>\n                        {/if}\n                    </div>\n                    {if orginal_apply_stat == 0}\n                    <div class="opt">\n                        <div class="description">\n                            <p class="desc">原创声明是公众平台为维护原创作者权益推出的功能。</p>\n                            <p class="desc">1. 开通后，你可以选择文章是否允许被转载；</p>\n                            <p class="desc">2. 声明原创的文章被转载时，系统会自动注明文章出处。</p>\n                        </div>\n                        <a href="javascript:;" onclick="return false;" class="btn btn_default" id="js_original_func_open">开通</a>\n                    </div>\n                    {/if}\n                </div>\n                {/if}\n                <!--END 未开通原创-->\n                <!--BEGIN 开通原创-->\n                <div class="origined js_original_type" style="display:none;">\n                    <label class="frm_label" id="js_original_open">\n                        <span class="mini_tips icon_before l">\n                            原创：已声明                        </span>\n                        <a href="javascript:;" onclick="return false;" class="js_original_cancel r">撤销声明</a>\n                        <a href="javascript:;" onclick="return false;" class="js_original_apply r">编辑声明</a>\n                    </label>\n\n                    <div class="normal_flow js_original_content" style="display:none">\n                        <!--添加.js_original_content元素 .open类名，小箭头向上，不添加则向下-->\n                        <div id="js_original_detail" class="preview_hd">\n                            原创详情<i class="icon_arrow"></i>\n                        </div>\n                        <ul class="simple_preview_list tips_global">\n                            <li class="simple_preview_item">\n                                <label class="simple_preview_label" for="">原文链接</label>\n\n                                <div class="simple_preview_value js_url"></div>\n                            </li>\n                            <li class="simple_preview_item">\n                                <label class="simple_preview_label" for="">首发平台</label>\n\n                                <div class="simple_preview_value js_platform"></div>\n                            </li>\n                            <li class="simple_preview_item">\n                                <label class="simple_preview_label" for="">作者</label>\n\n                                <div class="simple_preview_value js_author"></div>\n                            </li>\n                            <li class="simple_preview_item">\n                                <label class="simple_preview_label" for="">文章类别</label>\n\n                                <div class="simple_preview_value js_classify"></div>\n                            </li>\n                            <li class="simple_preview_item">\n                                <label class="simple_preview_label" for="">授权转载</label>\n\n                                <div class="simple_preview_value js_frm"></div>\n                            </li>\n                        </ul>\n                        {if can_use_reward}\n                        <!--如果可以使用赞赏功能-->\n                        <div class="reward">\n                            <label class="frm_checkbox_label" for="reward">\n                                <input type="checkbox" name="can_reward" class="frm_checkbox js_reward js_field" value="1" checked>\n                                <i class="icon_checkbox"></i>\n                                <span class="lbl_content">\n                                    接受用户赞赏                                    <!--<span class="mini_tips weak_text">（申请原创声明后才可勾选）</span>-->\n                                </span>\n                            </label>\n\n                            <div class="appmsg_edit_item js_reward_div">\n                                <span class="frm_input_box reward_wording"><input type="text" name="reward_wording" class="frm_input  js_counter js_reward_wording js_field"\n                                    max-length="15" placeholder="赞赏引导语（选填）"></span>\n                            </div>\n                        </div>\n                        {/if}\n                        {if can_use_payforread}\n                        <!--如果可以使用付费阅读功能-->\n                        <div class="payread">\n                            <label class="frm_checkbox_label" for="js_pay">\n                                <input name="payforread_enabled" type="checkbox" id="js_pay" class="frm_checkbox js_field" value="1">\n                                <i class="icon_checkbox"></i>\n                                <span class="lbl_content">\n                                    付费阅读                                    <span class="mini_tips weak_text js_pay_tips">（只有“禁止转载”的原创文章才可以设置付费阅读）</span>\n                                </span>\n                                <p class="pay_seting js_pay_setting" style=\'display:none\'>\n                                    <label class="frm_fee">金额：<span class="js_fee"></span>元</label>\n                                    <a onclick="return false;" href="javascript:;" class="js_pay_edit">修改</a>\n                                </p>\n                            </label>\n                        </div>\n                        {/if}\n                        <input type="hidden" class="js_original_publish">\n                        <input type="hidden" class="js_reprint_frm">\n                    </div>\n                </div>\n                <!--END 开通原创-->\n            </div>\n            {/if}\n        </div>\n        \n        <div class="appmsg_edit_highlight_area">\n\n            <div class="appmsg_edit_title">发布样式编辑</div>\n            <!-- EBGIN 封面 -->\n            <div class="appmsg_edit_item gap_left">\n                <label for="" class="frm_label">\n                    <strong class="title">封面</strong>\n\n                    <p class="js_cover_tip tips gap_left"></p>\n                </label>\n                <div class="upload_wrap">\n                    <div class="upload_box">\n                        <div class="upload_area">\n                            <a id="js_appmsg_upload_cover" href="javascript:void(0);" onclick="return false;"\n                               class="btn btn_upload">\n                                本地上传                            </a>\n                        </div>\n                    </div>\n                    &nbsp;&nbsp;<a id="js_imagedialog" href="javascript:void(0);" onclick="return false;"\n                                   class="btn btn_upload">从图片库选择</a>\n\n                    <p class="js_cover upload_preview">\n                        <a class="js_removeCover" href="javascript:void(0);" onclick="return false;">删除</a>\n                        <input type="hidden" class="js_field" name="file_id">\n                    </p>\n                </div>\n\n                <p class="frm_tips">\n                    <label for="" class="frm_checkbox_label">\n                        <i class="icon_checkbox"></i>\n                        <input type="checkbox" class="frm_checkbox js_show_cover_pic js_field" name="show_cover_pic" checked>\n                        封面图片显示在正文中                    </label>\n                </p>\n\n                <div class="frm_msg fail js_cover_error js_error_msg" style="display:none;">必须插入一张图片</div>\n            </div>\n            <!-- END 封面 -->\n            <!-- BEGIN 摘要 -->\n            <div class="js_desc_area appmsg_edit_item gap_left align_counter appmsg_description">\n                <label for="" class="frm_label">\n                    <strong class="title">摘要</strong>\n\n                    <p class="tips l gap_left">选填，如果不填写会默认抓取正文前54个字</p>\n                </label>\n                <span class="frm_textarea_box with_counter counter_out">\n                    <textarea class="frm_textarea js_desc js_counter js_field" name="digest" max-length="120"></textarea>\n                    <em class="frm_input_append frm_counter">0/120</em>\n                </span>\n\n                <div class="frm_msg fail js_desc_error" style="display:none;"></div>\n            </div>\n            <!-- END 摘要 -->\n        </div>\n    </div>\n</div>\n';
});
