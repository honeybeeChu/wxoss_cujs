define("tpl/statistics/keyword-date-submenu.html.js", [], function () {
    return '<div>\n<strong class="lable time_lable">时间</strong>\n\n<div class="button_group">\n    <a class="btn btn_default" href="javascript:;" range="7">7日</a>\n    <a class="btn btn_default" href="javascript:;" range="14">14日</a>\n    <a class="btn btn_default selected" href="javascript:;" range="30">30日</a>\n\n    <div class="btn_group_item td_data_container" id="js_date_range"> </div> \n\n    <div class="search_wrapper">\n        <span class="frm_input_box search append">\n            <a href="javascript:void(0);" class="frm_input_append"> <i class="icon16_common search_gray">搜索 </i> &nbsp; </a>\n            <input type="text" placeholder="输入关键词查询排行" value="" class="frm_input js_search">\n        </span>\n    </div>\n</div>\n<div>\n';
});
