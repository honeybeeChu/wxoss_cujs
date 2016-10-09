$(function () {

    /*模拟select*/
    $(".J_dropmenu").click(function (e) {
        e.stopPropagation();
        var ul = $(this).find(".dropmenu");
        $(".J_dropmenu .dropmenu").hide();
        $(this).toggleClass("open");
        ul.slideDown();
    });
    $(document).click(function (e) {
        e.stopPropagation();
        $(".J_dropmenu .dropmenu").slideUp();
    });
    $(".J_dropmenu .dropmenu li").click(function (e) {
        e.stopPropagation();
        var selTxt = $(this).text();
        $(this).parent().prev().html(selTxt);
        $(this).parent().parent().removeClass("open");
        $(this).parent().slideUp();
    });

    /*表格鼠标经过行效果*/
    $(".J_table_hover tr").hover(function () {
        $(this).addClass("hover").siblings().removeClass("hover")
    })


//tab1
    $("#tabListA").each(function () {
        $("li:first-child").addClass("hot");
    });
    $("#tabOutBoxA").each(function () {
        $(".tabOutList:first-child").show().siblings("div").hide();
    });
    $("#tabListA li").each(function () {
        $(this).click(function () {
            $(this).addClass("hot").siblings("li").removeClass();
            $("#tabOutBoxA .tabOutList:eq(" + $(this).index() + ")").show().siblings("div").hide();
        });
    });

    /*×按钮*/
    //$('.close').click(function () {
    //    $('.black_overlay').hide();
    //    $(this).parent().parent().hide();
    //});

    /*图片素材弹窗*/
    $('#img_modal').click(function () {
        $('.black_overlay, #img_modal_content').show();
    });
    /*文字素材弹窗*/
    $('#text_modal').click(function () {
        $('.black_overlay, #text_modal_content').show();
    });
    /*语音素材弹窗*/
    $('#audio_modal').click(function () {
        $('.black_overlay, #audio_modal_content').show();
    });
    /*视频素材弹窗*/
    $('#video_modal').click(function () {
        $('.black_overlay, #video_modal_content').show();
    });
    /*图文素材弹窗*/
    $('#appmsg_modal').click(function () {
        $('.black_overlay, #appmsg_modal_content').show();
    });

    /*图文卡片列表式切换*/
    $('#js_cardview').click(function () {
        $(this).addClass("current");
        $('#js_listview').removeClass("current")
        $('#js_list').hide();
        $('#js_card').show();
    });
    $('#js_listview').click(function () {
        $(this).addClass("current");
        $('#js_cardview').removeClass("current")
        $('#js_card').hide();
        $('#js_list').show();
    });

    /*添加视频帮助信息切换*/
    $('.video_global_tips_title').mouseover(function () {
        var ele = $(this).next("div");
        ele.css("display", "block");
    });
    $('.video_global_tips_title').mouseout(function () {
        var ele = $(this).next("div");
        ele.css("display", "none");
    });

    /*图文信息*/
    $('.js_appmsg_item').mouseover(function () {
        var ele = $(this).find(".appmsg_edit_mask");
        ele.css("display", "block");
    });
    $('.js_appmsg_item').mouseout(function () {
        var ele = $(this).find(".appmsg_edit_mask");
        ele.css("display", "none");
    });


    $("#keydown .input_txt").each(function () {
        var thisVal = $(this).val();
        //判断文本框的值是否为空，有值的情况就隐藏提示语，没有值就显示
        if (thisVal != "") {
            $(this).siblings("span").hide();
        } else {
            $(this).siblings("span").show();
        }
        $(this).keyup(function () {
            var val = $(this).val();
            $(this).siblings("span").hide();
            $(this).next(".number").css("display", "block");
        }).focus(function () {
            $(this).next(".number").css("display", "block");
        }).blur(function () {
            $(this).next(".number").css("display", "none");
            var val = $(this).val();
            if (val != "") {
                $(this).siblings("span").hide();
            } else {
                $(this).siblings("span").show();
            }
        })
    })


    $("#keydown .frm_radio").click(function () {
        $(".url").toggle();
    })
    /*领奖方式*/
    $("#j_mail").click(function() {
        if($('#RadioGroup1_0').is(':checked')) {
            $("#j_offline_info").hide();
            $("#j_mail_info").show();
        }else{
            $("#j_mail_info").hide();
        }
    });
    $("#j_offline").click(function() {
        if($('#RadioGroup1_1').is(':checked')) {
            $("#j_mail_info").hide();
            $("#j_offline_info").show();
        }else{
            $("#j_offline_info").hide();
        }
    });
    $("#j_win").click(function() {
        if($('#j_win_btn').is(':checked')) {
            $("#j_win_info").show();
        }else{
            $("#j_win_info").hide();
        }

    });
})
/*
$(window).scroll(function () {
    var pos = $(document).scrollTop();
    var topVal = $(".js_main_title").offset().top;
    var topVal2 = $("#keydown").height();
    var conWidth = $("#body").width();
    $(".js_main_title").width(conWidth - 2);
    var eduiConHeight = $("#J_edui_con").height();
    var toolbarHeight = $("#J_edui_toolbarbox").height();
    var placeholderDiv = "<div style='height:" + toolbarHeight + "px'></div>";
    //两侧高度
    var asideHeight = eduiConHeight - pos + 47;
    $(".J_aside").height(asideHeight);
    $(".J_aside").jScrollPane();//调用滚动插件
    if (pos > topVal) {
        $("body").addClass("edit_fixed");
        $("#J_edui_toolbarbox").css({position: "fixed", top: "53px", width: "736px", "z-index": "1000"});
        $("#J_edui").prepend(placeholderDiv);
    }
    if (pos >= topVal2) {
        $("#J_edui_toolbarbox").prev().remove();
        $("#J_edui_toolbarbox").removeAttr("style");
    }
    if (pos < 103) {
        $("body").removeClass("edit_fixed");
        $("#J_edui_toolbarbox").removeAttr("style");
    }
})
*/
