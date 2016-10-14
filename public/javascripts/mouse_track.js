$(document).mousemove(function (event){
    var text = event.pageX + ", " + event.pageY;
    $('#mouse_logs').text("Mouse pos: " + text + " Time: " + new Date().getTime());
});

$(document).click(function (event){
    var text = event.pageX + ", " + event.pageY;
    $('#click_logs').text("Click at: " + text + " Time: " + new Date().getTime());
});

$(document).contextmenu(function (event){
    var text = event.pageX + ", " + event.pageY;
    $('#right_clicks').text("Right click at: " + text + " Time: " + new Date().getTime());
});

$(document).dblclick(function (event){
    var text = event.pageX + ", " + event.pageY;
    $('#double_clicks').text("Double click at: " + text + " Time: " + new Date().getTime());
});