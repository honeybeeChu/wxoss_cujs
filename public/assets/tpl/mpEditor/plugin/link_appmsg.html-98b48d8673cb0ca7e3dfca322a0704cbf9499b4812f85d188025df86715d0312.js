define("tpl/mpEditor/plugin/link_appmsg.html.js", [], function () {
    return '{each data as link}\n<li class="my_link_item">\n    <label class="frm_radio_label">\n        <i class="icon_radio"></i>\n        <span class="lbl_content">{link.title}<span class="date">{link.time}</span></span>\n        <input type="radio" name="hello" class="frm_radio" data-title="{link.title}" data-id="{link.aid}" data-href="{link.href}">\n    </label>\n</li>\n{/each}';
});
