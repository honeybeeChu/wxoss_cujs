$(function () {
    var choiced_account_id = null;
    //initial the account choice list
    $.ajax({
        type: "get",
        url: "/wxoss/wx_official_accounts/getAccountList",
        data: "",
        async: false,
        success: function (data) {
            var _data = data.list;
            var sessionAccountid = data.sessionAccountid;
            choiced_account_id = data.sessionAccountid;

            for (var i = 0; i < _data.length; i++) {
                var item = _data[i];
                var tr = $("<tr>").attr("account-id", item.id);
                if (sessionAccountid == item.id) {
                    tr.addClass("hover");
                }
                $("<td>").addClass("name").html(item.wechat_name).appendTo(tr);
                $("<td>").html(item.wechat_account).appendTo(tr);
                tr.appendTo($("#wxAccountTable")).on("click", function () {
                    $("tbody tr").removeClass("hover");
                    $(this).addClass("hover");
                    choiced_account_id = $(this).attr("account-id")
                });
            }
        },
        dataType: "json"
    });


    $("#pop_account_select .close, #pop_account_select .cancel,#pop_account_select .web_chat_close,#pop_account_select .web_chat_btn_cancel").on("click", function () {
        //$("#account_choice").hide();
        $("#mask_select_account,#pop_account_select").hide();
        // no account was choiced,go index page
        if (choiced_account_id == null || $(".web_chat_error").text().length > 0) {
            window.location.href = "/wxoss/wx_official_accounts"
        }
    });

    $("#confirm_choice").on("click", function () {
        if (choiced_account_id != null)
        // 设置当前选中的公众号的id到session中去
            $.ajax({
                type: "get",
                url: "/wxoss/wx_official_accounts/setOfficialAccount2Session",
                data: {current_official_account_id: choiced_account_id},
                async: true,
                success: function (data) {
                    location.reload();
                },
                error: function () {
                    window.location.href = "/wxoss/wx_official_accounts"
                },
                dataType: "json"
            });
        else
            window.location.href = "/wxoss/wx_official_accounts"
    });

    //  切换公众号按钮的点击事件绑定
    $(".replace").on("click", function (event) {
        //$("#account_choice").show();
        $("#mask_select_account,#pop_account_select").show();
    });


});

  

