<?php
// Start the session
session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <script
            src="https://code.jquery.com/jquery-3.3.1.min.js"
            integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
            crossorigin="anonymous"></script>
</head>
<body>

<?php
if(!empty($_POST["secret"])) {
    $_SESSION["secret"] = $_POST["secret"];
}

// Read the sessions
if ($_SESSION["username"] != "") {
	echo "<br>Hello ";
    echo $_SESSION["username"];
?>

<h1>Valid User</h1>
You are a valid user. Here is your reward!!!<br />

<img src="https://az616578.vo.msecnd.net/files/2015/09/27/635789781274697208191557841_tumblr_lxcavjCQC81qcj7k0o5_r1_250-1.gif">


<br /><br />
<a href="clearsessions.php">Clear Sessions</a>


<br />
<a href="session2.php">Another page</a>

    <h3>Tell me your favorite food (AJAX information)</h3>
    <div>
        <form id="js_form">
            Food:<br>
            <input required type="text" name="food"><br>
            Color:<br>
            <input required type="text" name="color"><br>
            <input type="hidden" name="username" value="<?php echo $_SESSION["username"]; ?>">
            <button id="js_form_button" type="button">Submit</button>
        </form>
    </div>

    <h4>Stored Favorite Food</h4>
    <div id="fav_food"></div>



    <br/>
    <h3>Tell me a secret</h3>
    <div>
        <form id="personal_form" method="post">
            Secret:<br>
            <input required type="text" name="secret"><br>
            <input type="submit" value="Submit">
        </form>
    </div>
    <br />

<?php
    if(!empty($_SESSION["secret"]) && $_SESSION["secret"] != "") {
        echo "<br><h4>Here is your secret</h4>";
        echo "<p>" . $_SESSION["secret"] . "</p>";
    }
}else{
?>

<h1>You are not a valid user</h1>
Police are coming
<img src="http://66.media.tumblr.com/tumblr_lne9okrwkN1qdvbl3o1_500.jpg"> <br />




	<?php
}


?>

<script>
    $("#js_form_button").click(function() {
        var form = document.getElementById("js_form"),
            food = form.food.value,
            color = form.color.value,
            username = form.username.value;

        if(!!food && !!color) {
            $.ajax({
                url: "userInfoAPI.php",
                type: "POST",
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    food: food,
                    color: color,
                    username: username
                })
            })
        }

        form.reset();
    });

    $(document).ready(function(e) {
        var uname = document.getElementById("js_form").username.value;

        if(uname != "") {
            $.ajax({
                url: "userInfoAPI.php",
                type: "GET",
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: {
                    username: uname
                },
                success: function(returnValue) {
                    if(!!returnValue.color && !!returnValue.food) {
                        printAJAXMessage("Your favorite food is: " + returnValue.food + " and your favorite color is: " + returnValue.color);
                    } else {
                        printAJAXMessage("No favorite food nor color found");
                    }
                }
            })
        } else {
            printAJAXMessage("Cannot AJAX out due to no username");
        }
    });

    function printAJAXMessage(message) {
        var newParagraph = document.createElement("P"),
        resultArea = document.getElementById("fav_food");
        newParagraph.appendChild(document.createTextNode(message));
        resultArea.appendChild(newParagraph);

    }
</script>
</body>
</html>