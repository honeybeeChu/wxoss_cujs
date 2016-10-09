// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



// 图片选择按钮的点击事件，弹出图片选择层
$("#img_modal").click(function(){
    $("#mask,#img_choice_popup").show();
    // 默认选择的是为分组的图片展示出来
    $(".js_group dd[data-groupid=1]").trigger("click");
});

// 图文选择按钮的点击事件，弹出图文选择层
$("#appmsg_modal").click(function(){
    $("#mask,#news_choice_popup").show();
});

//素材选取界面的关闭按钮和取消按钮的点击事件
$("#img_choice_popup .close,#news_choice_popup .close,#img_choice_cancer,#news_choice_cancer").click(function(){
    $("#mask,#img_choice_popup,#news_choice_popup").hide();
});

// 图片选择层的组别ｌｉ点击事件绑定
$("#img_choice_popup .js_group dd").click(function(){
    //选择状态的修改
    $("#img_choice_popup .js_group dd").removeClass("selected");

    $(this).addClass("selected");

    var group_id = $(this).attr("data-groupid");

    //将选择的组的所有图片在右侧的mian区域中显示出来
    var img_resources = groupMap[group_id];

    $(".img_list").empty();
    for(var i = 0;i<img_resources.length;i++){
        var resource = img_resources[i];
        var _li = $("<li class='img_item' resource-id="+resource.id+
            "><label class='frm_checkbox_label img_item_bd'>"+
            "<img src="+resource.file_url+" alt="+resource.resource_name+" class='pic'>"+
            "<span class='lbl_content'>" + resource.resource_name + "</span>" +
            "<div class='selected_mask'>"+
            "<div class='selected_mask_inner'></div>"+
            "<div class='selected_mask_icon'></div></div></label></li>");

        //图片的点击事件
        _li.click(function(){
            var label = $(this).find("label");
            if(label.hasClass("selected")){
                label.removeClass("selected");
            }else{
                $("#img_choice_popup .img_list li label").removeClass("selected");
                $(this).find("label").toggleClass("selected");
            }
            setConfirmBtnVisible();

        });

        _li.appendTo($(".img_list"));
    }
});


// 确定选中的图片
$("#img_choice_confirm").click(function(){
    $("#mask,#img_choice_popup").hide();

    var media_id = $("label.frm_checkbox_label.selected").parent().attr("resource-id");

    //图片选项上面保存media_id
    $("#img_item").attr("media_id", media_id);

    $(".auto_img_choice").hide();
    $("#img_item img").attr("src",  $("label.frm_checkbox_label.selected>img").attr("src"));
    $("#img_item").show();
});


//news选项上面保存media_id
$("#news_choice_confirm").click(function(){
    $("#mask,#news_choice_popup").hide();

    var media_id = $(".appmsg.selected").attr("media_id");

    //图片选项上面保存media_id
    $("#news_item").attr("media_id", media_id);

    $(".auto_news_choice").hide();
    $("#news_item").show();

    var newsHtml = $("<div class='news_box' style='width:300px;'></div>");
    newsHtml.append($(".appmsg.selected").parent().parent().parent().html());
    newsHtml.find(".appmsg").removeClass("selected");

    $("#news_item").prepend(newsHtml);

});

// 图文弹出层的ｎｅｗｓ点击事件
$(".img_pick .appmsg").click(function(){
    //选择状态的修改
    if($(this).hasClass("selected")){
        $(this).removeClass("selected");
    }else{
        $(".img_pick .appmsg").removeClass("selected");
        $(this).toggleClass("selected");
    }
    var media_id = $(this).attr("media_id");
    setNewsConfirmBtnVisible();

});

// 设置确定按钮是否可以点击
function setConfirmBtnVisible(){
    if($(".img_list li>label.selected").length == 0){
        $("#img_choice_confirm").attr("disabled","true");
        $("#img_choice_confirm").addClass("btn_disabled");
    }else{
        $("#img_choice_confirm").removeAttr("disabled");
        $("#img_choice_confirm").removeClass("btn_disabled");
    }
}


// 删除选中的图片
$("#img_item_del").on("click", function () {
    $("#img_item").hide();
    $(".auto_img_choice").show();
});

// 删除选中的news
$("#news_item_del").on("click", function () {
    $("#news_item .news_box").remove();
    $("#news_item").attr("media_id","");

    $("#news_item").hide();
    $(".auto_news_choice").show();
});


// 设置确定按钮是否可以点击
function setNewsConfirmBtnVisible() {
    if ($(".appmsg.selected").length == 0) {
        $("#news_choice_confirm").attr("disabled", "true");
        $("#news_choice_confirm").addClass("btn_disabled");
    } else {
        $("#news_choice_confirm").removeAttr("disabled");
        $("#news_choice_confirm").removeClass("btn_disabled");
    }
}