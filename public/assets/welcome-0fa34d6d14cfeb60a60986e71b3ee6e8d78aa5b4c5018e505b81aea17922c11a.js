$(function () {


    $('form').submit(function () {
        var userName = $("#userName").val();
        var passWord = $("#passWord").val();

        var js_ret = validAdmin();
        if (js_ret != "") {
            show("userName", js_ret);
            //refresh();
            return false;
        }
        js_ret = validPassword();
        if (js_ret != "") {
            show("passWord", js_ret);
            //refresh();
            return false;
        }


        var logindata = {userName: userName, passWord: passWord};
        $.ajax({
            type: "post",
            url: "/wxoss/welcome/login",
            data: logindata,
            async: false,
            success: function (data) {
                result = data.result;
                if (result == 0) {
                    document.location.href = data.info;
                } else {
                    show("userName", data.desc);
                }
            },
            dataType: "json"
        });
        return false;
    });

    function validAdmin() {
        var username = $("#userName").val();
        username = $.trim(username);
        var js_ret = validUsernameEmpty(username);
        if (js_ret != "") {
            return js_ret;
        }
        js_ret = validUsernameRule(username);
        if (js_ret != "") {
            return js_ret;
        }
        js_ret = validUsernameLength(username);
        if (js_ret != "") {
            return js_ret;
        }
        return "";
    }


    function validPassword() {
        var password = $("#passWord").val();
        password = $.trim(password);
        var js_ret = validPasswordEmpty(password);
        if (js_ret != "") {
            return js_ret;
        }
        js_ret = validPasswordRule(password);
        if (js_ret != "") {
            return js_ret;
        }
        return "";
    }

    function loginHandle(data) {
        var loginType = $("#loginType").val();
        if (data.result == "errorData" || data.result == "errorVerifyCode") {
            show("verifyCode", data.msg);
            $("#verifyCode").val("");
            refresh();
            return;
        } else if (data.result == "errorAdmin") {
            show("userName", data.msg);
            $("#userName").val("");
            $("#verifyCode").val("");
            refresh();
            return;
        } else if (data.result == "errorPW") {
            show("passWord", data.msg);
            $("#passWord").val("");
            $("#verifyCode").val("");
            refresh();
            return;
        } else if (loginType == "1") {
            $(".prompt").hide();
            toolsutil.setBtnEnabled("loginBtn");
            document.location.href = "/aiuas/logon.jsp";
        } else {
            $(".prompt").hide();
            toolsutil.setBtnEnabled("loginBtn");
            document.location.href = "/aiuas/logon_system.jsp";
        }
    }

    function show(id, msg) {
        $(".prompt").html("<p>" + msg + "</p>");
        $(".prompt").show();
        //$("ul").prepend("<div id=\""+id+"MsgDiv\" class=\"prompt\">"+msg+"</div>");
        //$("#"+id).addClass("error");
    }


    /**
     * 用户名空校验
     * @param username
     * @returns string
     */
    function validUsernameEmpty(username) {
        if (username == "" || username == null || username == "用户名") {
            return "请输入用户名！";
        }
        return "";
    }

    /**
     * 用户名规则校验
     * @param username
     * @returns string
     */
    function validUsernameRule(username) {
        //if (!validutil.isValidName(username)) {
        //    return "请输入正确的用户名！";
        //}
        return "";
    }

    /**
     * 用户名长度校验
     * @param username
     * @returns string
     */
    function validUsernameLength(username) {
        //var contentLen = validutil.comStringLen(username);
        //if (contentLen > 40) {
        //    return "用户名不能超过40个字符！";
        //}
        return "";
    }

    /**
     * 密码空校验
     * @param password
     * @returns string
     */
    function validPasswordEmpty(password) {
        if (password == "" || password == null || password == "密码") {
            return "请输入密码！";
        }
        return "";
    }

    /**
     * 密码规则校验
     * @param password
     * @returns string
     */
    function validPasswordRule(password) {
        //if (!validutil.isValidPassWord(password)) {
        //    return "请输入正确的密码！";
        //}
        return "";
    }

    /**
     * 验证码空校验
     * @param validcode
     * @returns string
     */
    function validValidcodeEmpty(validcode) {
        if (validcode == "" || validcode == null || validcode == "验证码") {
            return "请输入验证码！";
        }
        return "";
    }

    /**
     * 验证码长度校验
     * @param validcode
     * @returns string
     */
    function validValidcodeLength(validcode) {
        //var contentLen = validutil.comStringLen(validcode);
        //if (contentLen != 4) {
        //    return "请输入正确的验证码！";
        //}
        return "";
    }
});



