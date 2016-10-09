define("tpl/preview.html.js", [], function () {
    return '<div class="mask preview_mask"></div>\n<div class="img_preview_container" id="preview_container">\n    <div class="img_preview_inner" id="img_container">\n        <img src="/mpres/htmledition/images/icon/common/icon32_loading_dark.gif" id="loading_dom">\n        <span class="img_preview_wrp" style="display:none;" id="img_dom">\n            <img src="{imgsrc}">\n            <!--#0001#-->\n            <a href="javascript:;" class="img_preview_close" id="closebtn" title="关闭"><i class="icon_img_preview_close">关闭</i></a>\n            <!--%0001%-->\n        </span>\n        <span class="vm_box"></span>\n    </div>\n    <span class="vm_box"></span>\n    {if !prev}\n    <div class="img_preview_opr_container prev_disabled" id="img_opr_container">\n    {else if !next}\n    <div class="img_preview_opr_container next_disabled" id="img_opr_container">\n    {else}\n    <div class="img_preview_opr_container" id="img_opr_container">\n    {/if}\n        <ul class="img_preview_opr_list">\n            <li class="img_preview_opr_item"><a href="javascript:;" id="btnview" title="查看原图"><i class="icon_img_preview origin">查看原图</i>&nbsp;</a></li>\n            {if view}<li class="img_preview_opr_item"><a href="javascript:;" id="btnprev" title="查看上一个"><i class="icon_img_preview prev">上一个</i>&nbsp;</a></li>{/if}\n            {if view}<li class="img_preview_opr_item"><a href="javascript:;" id="btnnext" title="查看下一个"><i class="icon_img_preview next">下一个</i>&nbsp;</a></li>{/if}\n            {if downsrc}<li class="img_preview_opr_item"><a href="{downsrc}" id="btndown" title="下载图片"><i class="icon_img_preview download">下载图片</i>&nbsp;</a></li>{/if}\n        </ul>\n    </div>\n</div>\n';
});
