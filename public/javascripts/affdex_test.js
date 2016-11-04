// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var divRoot = $("#affdex_elements")[0];
var width = 640;
var height = 480;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();

var faceData;

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function() {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
});

function log(node_name, msg) {
    $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
    if (detector && !detector.isRunning) {
        $("#logs").html("");
        detector.start();
    }
    log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
    log('#logs', "Clicked the stop button");
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
    }
};

//function executes when the Reset button is pushed.
function onReset() {
    log('#logs', "Clicked the reset button");
    if (detector && detector.isRunning) {
        detector.reset();

        $('#results').html("");
    }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
    log('#logs', "Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
    log('#logs', "webcam denied");
    console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
    $('#results').html("");
    if (faces.length > 0) {
        faceData = faces[0].emotions;
        log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));
    }
});

var eventLog = [];
var lastX = -1;
var lastY = -1;

const MOUSE_MOVE = 'm';
const MOUSE_CLICK = 'c';
const RIGHT_CLICK = 'rc';
const DOULBE_CLICK = 'dc';
const MOUSE_DOWN = 'md';
const MOUSE_UP = 'mu';

//const STARTED = false;



$(document).mousemove(function (event){
    if(event.pageX == lastX && event.pageY == lastY){
        return;
    }
    lastX = event.pageX;
    lastY = event.pageY;

    const t = new Date().getTime();
    var text = event.pageX + ", " + event.pageY;
    $('#mouse_logs').text("Mouse pos: " + text + " Time: " + t);
    logEvent(event, MOUSE_MOVE);
});

$(document).click(function (event){
    logEvent(event, MOUSE_CLICK);
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

var last_accepted_time;

function logEvent(event, identifier){
    const t = new Date().getTime();

    if(filter(event, identifier, t))
        return;
    else
        last_accepted_time = t;

    var emotions = "";
    for(var emotion in faceData){
        emotions += (faceData[emotion].toFixed(1)) + ", ";
    }

    var eventLine = `${identifier}, ${event.pageX}, ${event.pageY}, ${t}, ${emotions}`;

    eventLog.push(eventLine);

}

const  NEWNESS_THRESHOLD_MILI = 16;

function filter(event, indentifier, t){
    return too_recent(t) && indentifier == 'm';
}

function too_recent(t) {
    return t - last_accepted_time <= NEWNESS_THRESHOLD_MILI;
}

function sendLog() {
    const sentLog = eventLog;
    eventLog = [];

    $.ajax({
        url: "/store_eventlog",
        type: "POST",
        data: {'event_log' : sentLog}
    });
}