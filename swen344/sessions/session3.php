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

// Read the sessions
if ($_SESSION["username"] != "") {

	echo "<h1>Hello ";
    echo $_SESSION["username"];
    echo "<h2> ";
}else{
?>

	You are not a valid user


	<?php
}

if(!empty($_SESSION["secret"])) {
    echo "<br><h2>Here is your secret</h2>";
    echo "<p>" . $_SESSION["secret"] . "</p>";
}

?>




</body>
</html>