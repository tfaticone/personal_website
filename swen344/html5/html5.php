<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.css">
    <style>
        html{
            background-color: lightgrey;
        }

        input {
            width: 50% !important;
        }
    </style>
</head>
<body>

<h1>HTML5 Activity</h1>

<h2>Video and Audio (Both the same clip)</h2>
<div>
    <video width="320" height="240" controls>
        <source src="./jurrasic_park.mp4" type="video/mp4">
    </video>
</div>
<br/>
<div>
    <audio controls>
        <source src="jurassic_park_audio.mp3" type="audio/mpeg">
    </audio>
</div>

<hr/>

<h2>Canvas Element</h2>
<canvas id="myCanvas" width="200" height="100" style="border:1px solid #d3d3d3;">
    Your browser does not support the HTML5 canvas tag.</canvas>

<script>
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(95,50,40,0,2*Math.PI);
    ctx.moveTo(115,50);
    ctx.arc(95,50,20,0,Math.PI);
    ctx.moveTo(90,40);
    ctx.arc(85,40,5,0,2*Math.PI);
    ctx.moveTo(110,40);
    ctx.arc(105,40,5,0,2*Math.PI);
    ctx.stroke();
</script>

<hr />

<h2>Editable Content</h2>
<div>
    <p contenteditable="true">This is an editable paragraph.</p>
</div>

<hr />

<h2>Form and Required Field</h2>

<h4>Current Information</h4>
<div id="personInformation">

</div>

<h4>Form</h4>
<div>
    <form id="personal_form">
        Name:<br>
        <input required type="text" name="firstname"><br>
        Phone:<br>
        <input required type="text" name="phone"><br>
        Age:<br>
        <input required type="text" name="age"> Years old<br>
        <input type="submit" value="Submit">
    </form>
</div>

<hr />

<h2>Web Worker: Time</h2>

<div>
    <p>Time: <output id="result"></output></p>
    <button onclick="startWorker()">Start Worker</button>
    <button onclick="stopWorker()">Stop Worker</button>
</div>


<script>
    var urlParams = new URLSearchParams(window.location.search);
    //Save
    if(urlParams.get('firstname') && urlParams.get('phone') && urlParams.get('age')) {
        localStorage.setItem('firstname', urlParams.get('firstname'));
        localStorage.setItem('phone', urlParams.get('phone'));
        localStorage.setItem('age', urlParams.get('age'));
    }


    var personDescriptionNode = document.getElementById("personInformation");
    console.log(personDescriptionNode);
    if(localStorage.getItem('firstname')) {
        var para = makeParagraphObject("First Name: " + localStorage.getItem('firstname'));
        personDescriptionNode.appendChild(para);
    }

    if(localStorage.getItem('phone')) {
        var para = makeParagraphObject("Phone: " + localStorage.getItem('phone'));
        personDescriptionNode.appendChild(para);
    }

    if(localStorage.getItem('age')) {
        var para = makeParagraphObject("Age: " + localStorage.getItem('age'));
        personDescriptionNode.appendChild(para);
    }

    function makeParagraphObject(text) {
        var newParagraph = document.createElement("h6");
        newParagraph.appendChild(document.createTextNode(text));
        return newParagraph;
    }

    var w;
    function startWorker() {
        if(typeof(Worker) !== "undefined") {
            if(typeof(w) == "undefined") {
                w = new Worker("worker.js");
            }
            w.onmessage = function(event) {
                document.getElementById("result").innerHTML = event.data;
            };
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
        }
    }


    function stopWorker() {
        w.terminate();
        w = undefined;
    }
</script>
</body>
</html>