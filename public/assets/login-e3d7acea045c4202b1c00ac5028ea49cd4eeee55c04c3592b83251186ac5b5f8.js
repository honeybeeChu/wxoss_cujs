$(function () {
    var menu = eval("(" + $("#menu").val() + ")");
    drawMenu(menu, $(".col_side"));


    function drawMenu(menu, pdiv) {        var url = document.location.href;
        $.each(menu, function (i, value) {
            nodetype = value.nodetype;
            if (nodetype == 0) {
                tdiv = pdiv.append("<div class=\"menu_box_sub\"><h2>" + value.name + "</h2></div>");
                drawMenu(value.clildList, tdiv);
            } else if (nodetype == 3) {
                selectcss = "";
                if (url.indexOf(value.url) > 1 || $("#topTab").prev().text() == value.name) {
                    selectcss = " selected";
                }
                pdiv.append("<dd class=\"menu_item" + selectcss + "\"><a href=\"" + value.url + "\">" + value.name + "</a></dd>");
            } else {
                tdiv = pdiv.append("<dl class=\"menu\"> <dt class=\"menu_title\"><i class=\"icon_menu " + value.icon + "\"></i>" + value.name + "</dt>");
                drawMenu(value.clildList, tdiv);
            }
        });

    }


});
