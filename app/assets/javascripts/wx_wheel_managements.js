// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$('#datetimepicker_begin').datetimepicker({
    lang:"ch",
    formatTime:'H:i',
    formatDate:'Y-m-d',
    yearStart:2000,
    yearEnd:2050
});
$('#datetimepicker_end').datetimepicker({
    lang:"ch",
    formatTime:'H:i',
    formatDate:'Y-m-d',
    yearStart:2000,
    yearEnd:2050
});

$('.emotion_editor textarea').keyup(function (){
    var len = $(this).val().length;
    if(len > 300){
        $(this).val($(this).val().substring(0,299));
    }
});

$('.btn.btn_shake_add').click(function(){
    var length = $('.shake_meta_container').find('.option_setting').length;
    var shake_num = null;
    switch(length)
    {
        case 0:
            shake_num = "一等奖";
            break;
        case 1:
            shake_num = "二等奖";
            break;
        case 2:
            shake_num = "三等奖";
            break;
        case 3:
            shake_num = "四等奖";
            break;
        case 4:
            shake_num = "五等奖";
            break;
    }
    var option_setting = $('<div class="shake_meta option_setting">' +
        '<form class="">' +
        '<div class="shake_meta_title group"><span class="shake_num">一等奖</span></div>' +
        '<div class="shake_meta shake_meta_content">' +
        '<div class="award">' +
        '<div class="shake_meta_detail"><div class="frm_control_group"><label for class="frm_label">奖品名称</label>' +
        '<div class="frm_controls"><span class="frm_input_box counter_in append "><input type="text" class="frm_input frm_msg_content" maxlength="35" /></span></div></div></div>' +
        '<div class="shake_meta_detail"><div class="frm_control_group"><label for class="frm_label" >数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</label>' +
        '<div class="frm_controls"><span class="frm_input_box frm_small"><input type="text" class="frm_input frm_msg_content" /></span><span class="number_of">个</span></div></div>' +
        '<div class="frm_control_group"><label for class="frm_label" >概&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率</label><div class="frm_controls"><span class="frm_input_box frm_small">' +
        '<input type="text" class="frm_input frm_msg_content" /></span><span class="number_of">%</span><span class="frm_tips">可设置范围（0.01%~100%）</span>' +
        '<p class="frm_tips">每次转动转盘后获得该奖品的概率，与该奖品数量无关</p></div></div></div>' +
        '<div class="prize_bar"><div id="filePicker">上传图片</div><div class="prize_img hide"><img src="" alt=""/><a href="javascript:;">删除</a></div></div></div>' +
        '</div></form></div>');
    option_setting.find('.shake_num').text(shake_num);
    option_setting.insertBefore($('.shake_container_dec.shake_add'));
    if(length == 4){
        $('.shake_container_dec.shake_add').hide();
    }else{
        $('.shake_container_dec').show();
    }
    picHandle();
});

$('.btn.btn_shake_del').click(function(){
    var length = $('.shake_meta_container').find('.option_setting').length;
    $('.shake_meta_container').find('.option_setting').eq(length-1).remove();
    if(length == 4){
        $('.shake_container_dec.shake_del').hide();
    }else{
        $('.shake_container_dec').show();
    }
});

//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
var curWwwPath = window.document.location.href;
//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
var pathName = window.document.location.pathname;
var pos = curWwwPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8083
var localhostPath = curWwwPath.substring(0, pos);

var picHandle = function(){
    $('.prize_bar #filePicker').each(function(){
        var element = $(this);
        if (!element.hasClass("webuploader-container")){
            var uploader = WebUploader.create({
                auto: true,
                swf:  localhostPath + '/assets/webuploader/Uploader.swf',
                server: '/wxoss/wx_shake_managements/uploadpic',
                pick: element,
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }
            });
            uploader.on( 'uploadSuccess', function( file ,json ) {
                var prize_img = element.parent().find('.prize_img');
                prize_img.find('img').attr('src',json.content);
                prize_img.show();
                element.hide();
            });
            uploader.on( 'uploadError', function( file ) {
                msgShow('上传失败');
            });
        }
    });

    $('.prize_img a').each(function(){
        $(this).click(function(){
            var button = $(this).parent().parent().find('#filePicker');
            var prize_img = $(this).parent();
            var file_url = prize_img.find('img').attr('src');
            $.ajax({
                type:'post',
                url: '/wxoss/wx_shake_managements/deletepic',
                dataType: 'json',
                data:{file_url: file_url},
                success: function (data) {
                    if(data.result == "success"){
                        prize_img.find('img').attr('src','');
                        prize_img.hide();
                        button.show();
                    }
                }
            });
        });
    });
}

var getWheelInfo = function () {
    var wx_wheel_management = {
        name:"",
        begintime:"",
        endtime:"",
        lottery_num:"",
        is_repeat_draw:"",
        description:"",
        receive_way:"",
        receive_info:[],
        offline_address:"",
        offline_description:"",
        award_list:[]
    };

    wx_wheel_management.name = $('#name').val();
    wx_wheel_management.begintime = $('#datetimepicker_begin').val();
    wx_wheel_management.endtime = $('#datetimepicker_end').val();
    wx_wheel_management.lottery_num = $('#lottery_num').val();
    wx_wheel_management.is_repeat_draw = $('#is_repeat_draw').attr('checked') || $('#is_repeat_draw').prop('checked');
    wx_wheel_management.description = $('.emotion_editor textarea').val();

    if ($('#RadioGroup1_0').is(':checked')) {
        wx_wheel_management.receive_way = 0;
        $("#j_mail_info input[type='checkbox']").each(function() {
            if($(this).is(':checked')) {
                wx_wheel_management.receive_info.push($(this).attr('name'));
            }
        });
    }
    if ($('#RadioGroup1_1').is(':checked')) {
        wx_wheel_management.receive_way = 1;
        if($('#j_win_btn').is(':checked')) {
            $("#j_win_info input[type='checkbox']").each(function () {
                if($(this).is(':checked')) {
                    wx_wheel_management.receive_info.push($(this).attr('name'));
                }
            });
        }
        wx_wheel_management.offline_address = $("#j_offline_info input[type='text']").eq(0).val();
        wx_wheel_management.offline_description = $("#j_offline_info input[type='text']").eq(1).val();
    }

    var index = 0;
    var option_settings = $('.shake_meta_container').find('.option_setting');
    option_settings.each(function(){
        index++;
        var name =$(this).find('.frm_msg_content').eq(0).val();
        var amount = $(this).find('.frm_msg_content').eq(1).val();
        var probability = $(this).find('.frm_msg_content').eq(2).val();
        var imgurl = $(this).find('.prize_img img').attr('src');
        wx_wheel_management.award_list.push({ "level": index, "name": name, "amount": amount, "probability": probability, "imgurl": imgurl });
    });
    return wx_wheel_management;
}

var valueCheck = function () {
    var name = $("#name");
    var begintime = $('#datetimepicker_begin');
    var endtime = $('#datetimepicker_end');
    var lottery_num = $('#lottery_num');
    var description = $('.emotion_editor textarea');

    if($.trim(name.val()) == ''){
        msgShow("请输入活动名称");
        name.focus();
        return false;
    }
    if($.trim(begintime.val()) == ''){
        msgShow("请输入开始时间");
        begintime.focus();
        return false;
    }
    if($.trim(endtime.val()) == ''){
        msgShow("请输入结束时间");
        endtime.focus();
        return false;
    }
    if($.trim(lottery_num.val()) == ''){
        msgShow("请输入抽奖次数限制");
        lottery_num.focus();
        return false;
    }
    if($.trim(description.val()) == ''){
        msgShow("请输入活动说明");
        description.focus();
        return false;
    }
    try{
        $('.award .frm_input').each(function(){
            if($.trim($(this).val()) == ''){
                $(this).focus();
                throw '奖项设置信息不能为空';
            }
        });
        $('.prize_img img').each(function(){
            if($(this).attr('src') == ''){
                throw '请上传奖品图片';
            }
        });
    }catch (e){
        msgShow(e);
        return false;
    }
    return true;
}

var msgShow = function (text){
    $(".results").html(text);
    $(".results").show();
    setTimeout(function () {
        $(".results").hide();
    }, 1000);
}