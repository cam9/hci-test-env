var eventLog = [];

const MOVE = 'm';
const CLICK = 'c';
const RIGHT_CLICK = 'rc';
const DOULBE_CLICK = 'dc';
const MOUSE_DOWN = 'md';
const MOUSE_UP = 'mu';

$(document).mousemove(function (event){
    const t = new Date().getTime();
    var text = event.pageX + ", " + event.pageY;
    $('#mouse_logs').text("Mouse pos: " + text + " Time: " + t);
    logEvent(event, MOVE);
});

$(document).click(function (event){
    logEvent(event, CLICK);
});

$(document).contextmenu(function (event){
    logEvent(event, RIGHT_CLICK);
});

$(document).dblclick(function (event){
    logEvent(event, DOULBE_CLICK);
});

$(document).mousedown(function (event){
    logEvent(event, MOUSE_DOWN);
});

$(document).mouseup(function (event){
    logEvent(event, MOUSE_UP);
});

function logEvent(event, identifier){
    const t = new Date().getTime();
    eventLog.push(`${identifier}, ${event.pageX}, ${event.pageY}, ${t}`)
}

function sendLog(){
    $.ajax({
        url: "/store_eventlog",
        type: "POST",
        data: {event_log : eventLog}
    });
}