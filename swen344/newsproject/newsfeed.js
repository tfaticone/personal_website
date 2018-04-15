//this forces javascript to conform to some rules, like declaring variables with var
"use strict";
const url_top = "http://www.espn.com/espn/rss/news";
const url_baseball = "http://www.espn.com/espn/rss/mlb/news";
const url_football = "http://www.espn.com/espn/rss/nfl/news";
const url_hockey = "http://www.espn.com/espn/rss/nhl/news";
var items;

window.onload = function(){
    $("#feed_header").html("Top News Feed");
    init(url_top);

    var lastVisitedTime = (localStorage.getItem("lastVisited") != null) ? localStorage.getItem("lastVisited") : "First Visit!";
    $("#lastVisited").text("Last Visited: " + lastVisitedTime);
    localStorage.setItem("lastVisited", moment((new Date())).format('MM-DD-YYYY HH:mm:ss'));
};

$("#login_btn").click(function(e) {
    var loginForm = document.getElementById("login-form");
   if(!!loginForm.username.value && !!loginForm.password.value) {
       $.ajax({
           url: "api/userInfoAPI.php",
           type: "POST",
           method: "POST",
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           data: JSON.stringify({
               username : loginForm.username.value,
               password : loginForm.password.value,
               action : "login"

           }),
           success: function(returnValue) {
               if(returnValue.status == true) {
                   var userObj = returnValue.user;
                   userObj["username"] = loginForm.username.value;
                   sessionStorage.setItem("user", JSON.stringify(userObj));
               }
           }
       })
   }
});

$("#createact-btn").click(function(e) {
    var createForm = document.getElementById("create_form");
    if(!!createForm.username.value && !!createForm.password1.value && !!createForm.password2.value && (createForm.password1.value == createForm.password2.value)) {
        $.ajax({
            url: "api/userInfoAPI.php",
            type: "POST",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                username : createForm.username.value,
                password : createForm.password2.value,
                action : "create"
            }),
            success: function(returnValue) {
                if(returnValue.status == true) {
                    var userObj = returnValue.user;
                    userObj["username"] = createForm.username.value;
                    sessionStorage.setItem("user", JSON.stringify(userObj));
                }
            }
        })
    }
});

$("#nav_select").change((e) => {
    switch($("#nav_select").val()){
        case "top":
            init(url_top);
            $("#feed_header").html("Top News Feed");
            break;
        case "mlb":
            $("#feed_header").html("Major League Baseball News Feed");
            init(url_baseball);
            break;
        case "nfl":
            $("#feed_header").html("National Football League News Feed");
            init(url_football);
            break;
        case "nhl":
            $("#feed_header").html("National Hockey League News Feed");
            init(url_hockey);
            break;
    }
});

function favorite(obj) {
    if(obj.classList.contains('far')) {
        obj.classList.remove('far');
        obj.classList.add('fas');
    } else {
        obj.classList.remove('fas');
        obj.classList.add('far');
    }
    console.log(items[obj.dataset.id]);
}

function init(url){
    document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
    $("#content").fadeOut(250);
    //fetch the data
    $.get(url).done(function(data){xmlLoaded(data);});
}


function xmlLoaded(obj){
    items = obj.querySelectorAll("item");

    //show the logo
    var image = obj.querySelector("image");
    var logoSrc = image.querySelector("url").firstChild.nodeValue;
    var logoLink = image.querySelector("link").firstChild.nodeValue;
    $("#logo").attr("src",logoSrc);

    //parse the data
    var html = "";
    for (var i=0;i<items.length;i++){
        //get the data out of the item
        var newsItem = items[i];
        var title = newsItem.querySelector("title").firstChild.nodeValue;
        var description = newsItem.querySelector("description").firstChild.nodeValue;
        var link = newsItem.querySelector("link").firstChild.nodeValue;
        var pubDate = newsItem.querySelector("pubDate").firstChild.nodeValue;

        //present the itm as HTML
        var line = '<div class="card"><div class="card-header row" id="heading'+ i+ '"><div class="col-9"><h5 class="mb-0"> <button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+ i+ '" aria-expanded="true" aria-controls="collapse'+ i+ '">' +
            title + '</button></h5></div><div class="col-3"><i data-id="' + i + '" onclick="favorite(this)" class="far fa-2x favorite-btn fa-heart"></i></div></div>' +
            '<div id="collapse'+ i+ '" class="collapse" aria-labelledby="heading'+ i+ '" data-parent="#accordion"><div class="card-body container"><div class="row"><b>Published:  </b>' +
            pubDate + '</div><div class="row">' + description + '</div><div class="row"><a href="' + link + '">Original Post</a></div></div></div> </div>';

        html += line;
    }
    document.querySelector("#content").innerHTML = html;

    $("#content").fadeIn(1000);

}