define("tpl/mpEditor/plugin/img_popup.html.js", [], function () {
    return '<div class="edui_mask_edit_group">\n    \n	<div class="js_canceladapt edui-clickable edui_mask_edit_meta first_child tips_global" onclick="$$._imgAutoWidth(false)" style="{if !hasadapt}display:none;{/if}">\n        <div class="edui_mask_edit_meta_inner">\n            <i class="icon_edui_mask_img icon_edui_mask_img_canceladapt"></i>\n            取消自适应        </div>\n    </div>\n	<div class="js_adapt edui-clickable edui_mask_edit_meta first_child" onclick="$$._imgAutoWidth(true)" style="{if hasadapt}display:none;{/if}">\n        <div class="edui_mask_edit_meta_inner">\n            <i class="icon_edui_mask_img icon_edui_mask_img_adapt"></i>\n            自适应手机屏幕宽度        </div>\n    </div>\n	<div class="edui-clickable edui_mask_edit_meta primary no_extra" onclick="$$._delRange()">\n        <div class="edui_mask_edit_meta_inner">\n            <i class="icon_edui_mask_img icon_edui_mask_img_del"></i>\n            {if needBreak}\n            删除图片            {else}\n            删除            {/if}\n        </div>\n	</div>\n</div>\n\n\n';
});