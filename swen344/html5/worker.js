var i=0;

function timedCount() {
    i=i+1;
    var now = new Date();
    postMessage(now.toString());
    setTimeout("timedCount()", 500);
}

timedCount();