//this forces javascript to conform to some rules, like declaring variables with var
"use strict";
const url_top = "http://www.espn.com/espn/rss/news";
const url_baseball = "http://www.espn.com/espn/rss/mlb/news";
const url_football = "http://www.espn.com/espn/rss/nfl/news";
const url_hockey = "http://www.espn.com/espn/rss/nhl/news";
var items;
var lastDisplayedObj;

window.onload = function(){
    $("#feed_header").html("Top News Feed");
    init(url_top);
    var lastVisitedTime = "First visit!";

    var decodedCookie = decodeURIComponent(document.cookie).split(";").filter(string => string.includes("lastVisited="));
    if(decodedCookie.length > 0) {
        lastVisitedTime = decodedCookie[0].split("lastVisited=")[1]
    }
    $("#lastVisited").text("Last Visited: " + lastVisitedTime);
    document.cookie = "lastVisited=" + moment((new Date())).format('MM-DD-YYYY HH:mm:ss').toString() + ";path=/"
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
                   $('#loginModal').modal('hide');
               } else {
                   $('#alert_login').html('<div class="alert alert-danger" role="alert">' + returnValue.message + '</div>')
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
                    $('#createModal').modal('hide');
                } else {
                    $('#alert_create').html('<div class="alert alert-danger" role="alert">' + returnValue.message + '</div>')
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
        case "favorites":
            console.log("chosen favorites");
            xmlLoadFavorites();
            break;
    }
});

$("#logout_btn").click((e) => {
    sessionStorage.clear();
});

function favorite(obj) {
    if(!sessionStorage.getItem("user")) {
        alert("You need to log in to save favorites");
    } else {
        if(obj.classList.contains('far')) {
            obj.classList.remove('far');
            addFavorite(items[obj.dataset.id]);
            obj.classList.add('fas');
        } else {
            obj.classList.remove('fas');
            removeFavorite(items[obj.dataset.id]);
            obj.classList.add('far');
        }
    }
}

function removeFavorite(obj) {
    var user = JSON.parse(sessionStorage.getItem("user"));
    var parser = new DOMParser(),
        doc = parser.parseFromString(user.favorites, "text/xml"),
        oSerializer = new XMLSerializer(),
        sXML = "";
    var removeLink = obj.querySelector("link").firstChild.nodeValue;

    var allFavs = doc.querySelectorAll('item'),
        index = 0;
    if(allFavs.length == 1) {
        sXML = "";
    } else {
        [].forEach.call(allFavs, (fav) => {
            let favLink = allFavs[index].querySelector("link").firstChild.nodeValue;
            if(favLink != removeLink) {
                index++;
            }
        });

        let channel = doc.querySelector('channel');
        channel.removeChild(channel.childNodes[index]);

        sXML = oSerializer.serializeToString(doc);
    }
    user.favorites = sXML;
    sessionStorage.setItem('user', JSON.stringify(user));

    $.ajax({
        url: "api/userInfoAPI.php",
        type: "POST",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username : user.username,
            action : "addfavorite",
            favorites : sXML

        }),
        success: function(returnValue) {
            console.log("Favorites saved");
        }
    });
}

function addFavorite(obj){
    var user = JSON.parse(sessionStorage.getItem("user"));
    var oSerializer = new XMLSerializer();

    if(user.favorites == "") {
        user.favorites = "<channel></channel>"
    }
    var parser = new DOMParser(),
        doc = parser.parseFromString(user.favorites, "text/xml");

    doc.querySelector('channel').appendChild(obj);

    var items = doc.querySelector('channel').childNodes;
    var itemsArr = [];
    for (var i in items) {
        if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function(a, b) {
        var aPubDate = new Date(a.querySelector("pubDate").firstChild.nodeValue);
        var bPubDate = new Date(b.querySelector("pubDate").firstChild.nodeValue);
        return aPubDate.getTime() == bPubDate.getTime()
            ? 0
            : (aPubDate.getTime() > bPubDate.getTime() ? 1 : -1);
    });
    doc.querySelector('channel').innerHTML = "";
    for (i = 0; i < itemsArr.length; ++i) {
        doc.querySelector('channel').appendChild(itemsArr[i]);
    }
    var sXML = oSerializer.serializeToString(doc);

    user.favorites = sXML;
    sessionStorage.setItem('user', JSON.stringify(user));

    $.ajax({
        url: "api/userInfoAPI.php",
        type: "POST",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username : user.username,
            action : "addfavorite",
            favorites : sXML

        }),
        success: function(returnValue) {
            console.log("Favorites saved");
        }
    });

}

function getFavoriteLinks() {
    if(!sessionStorage.getItem('user')) {
        return [];
    } else {
        var user = JSON.parse(sessionStorage.getItem("user"));
        var parser = new DOMParser(),
            doc = parser.parseFromString(user.favorites, "text/xml"),
            linkObjs = doc.querySelectorAll("link"),
            returnArray = [];

        [].forEach.call(linkObjs, (linkObj) => {
            returnArray.push(linkObj.firstChild.nodeValue);
        });

        return returnArray;
    }
}

function init(url){
    document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
    $("#content").fadeOut(250);
    //fetch the data
    $.get(url).done(function(data){xmlLoaded(data);});
}


function xmlLoaded(obj){
    lastDisplayedObj = obj;
    items = obj.querySelectorAll("item");

    //show the logo
    var image = obj.querySelector("image");
    var logoSrc = image.querySelector("url").firstChild.nodeValue;
    var logoLink = image.querySelector("link").firstChild.nodeValue;
    var favoriteLinks = getFavoriteLinks();
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
        var line = '<div class="card"><div class="card-header row" id="heading'+ i+ '"><div class="col-sm-9"><h5 class="mb-0"> <button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+ i+ '" aria-expanded="true" aria-controls="collapse'+ i+ '">' +
            title + '</button></h5></div><div class="col-sm-3"><i data-id="' + i + '" onclick="favorite(this)" class="' + (favoriteLinks.includes(link) ? 'fas' : 'far') + ' fa-2x favorite-btn fa-heart"></i></div></div>' +
            '<div id="collapse'+ i+ '" class="collapse" aria-labelledby="heading'+ i+ '" data-parent="#accordion"><div class="card-body container"><div class="row"><b>Published:  </b>' +
            pubDate + '</div><div class="row">' + description + '</div><div class="row"><a href="' + link + '">Original Post</a></div></div></div> </div>';

        html += line;
    }
    document.querySelector("#content").innerHTML = html;

    $("#content").fadeIn(1000);

}

function xmlLoadFavorites() {
    if(!sessionStorage.getItem("user")) {
        alert("You need to be logged in to have favorites");
        return;
    }
    let obj = lastDisplayedObj;

    var user = JSON.parse(sessionStorage.getItem("user"));
    var parser = new DOMParser(),
        doc = parser.parseFromString(user.favorites, "text/xml"),
        items = doc.querySelectorAll("item");

    //show the logo
    var image = obj.querySelector("image");
    var logoSrc = image.querySelector("url").firstChild.nodeValue;
    var logoLink = image.querySelector("link").firstChild.nodeValue;
    var favoriteLinks = getFavoriteLinks();
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
        var line = '<div class="card"><div class="card-header row" id="heading'+ i+ '"><div class="col-sm-9"><h5 class="mb-0"> <button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+ i+ '" aria-expanded="true" aria-controls="collapse'+ i+ '">' +
            title + '</button></h5></div><div class="col-sm-3"><i data-id="' + i + '" onclick="favorite(this)" class="' + (favoriteLinks.includes(link) ? 'fas' : 'far') + ' fa-2x favorite-btn fa-heart"></i></div></div>' +
            '<div id="collapse'+ i+ '" class="collapse" aria-labelledby="heading'+ i+ '" data-parent="#accordion"><div class="card-body container"><div class="row"><b>Published:  </b>' +
            pubDate + '</div><div class="row">' + description + '</div><div class="row"><a href="' + link + '">Original Post</a></div></div></div> </div>';

        html += line;
    }
    document.querySelector("#content").innerHTML = html;

    $("#content").fadeIn(1000);
}