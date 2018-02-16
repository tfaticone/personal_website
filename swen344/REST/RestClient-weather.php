<html>
<body>

<?php
// Author: Daniel Krutz
// Description: Create a RESTful client to read the API from another site
// Use GETs to read person info
    $key_info = file_get_contents('http://www.se.rit.edu/~swen-344/activities/rest/RESTAPI-Weather.php?action=get_secret_key');
    $key_info = json_decode($key_info, true);

    $weather_list=file_get_contents('http://www.se.rit.edu/~swen-344/activities/rest/RESTAPI-Weather.php?action=get_weather_list&secret_key=' . $key_info['key'] . '&id=' . $key_info['id']);
    $weather_list=json_decode($weather_list, true);
    ?>

    <h1>Choose a weather zip code from the dropdown</h1>
    <form action="#" method="get">
        Zip code: <br />
        <select>
            <?php foreach ($weather_list as $place): ?>
                <option value="<?php echo $place['zip'] ?>"><?php echo $place['zip'] ?></option>
            <?php endforeach; ?>
        </select>
        <input type="submit" value="Submit">
    </form>

    <table border ="1">
        <tr>
            <td>Name: </td><td> <?php echo "hi" ?></td>
        </tr>
    </table>
    <br />

</body>
</html>