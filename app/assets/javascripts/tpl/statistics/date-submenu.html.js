define("tpl/statistics/date-submenu.html.js", [], function () {
    return '<div>\n\n<strong class="lable time_lable">时间</strong>\n\n<div class="button_group">\n    <a class="btn btn_default" href="javascript:;" range="7">7日</a>\n    <a class="btn btn_default" href="javascript:;" range="14">14日</a>\n    <a class="btn btn_default selected" href="javascript:;" range="30">30日</a>\n\n    <div class="btn_group_item td_data_container" id="js_begin_time_container"> </div>                            \n    <div class="btn_group_item td_data_container" id="js_single_timer_container"> </div>                            \n</div>\n\n\n<div class="setup">\n    <button class="btn btn_primary" id="btn_compare">按时间对比</button>\n</div>\n\n<div class="setup">\n    <button class="btn btn_primary" id="btn_single_compare">按时间对比</button>\n</div>\n\n</div>\n';
});