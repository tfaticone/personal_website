$(document).ready(() => {
    $('#load_btn').click(() => {
        changeTextData($('#dropdown').val());
    });

    displayJSON("aboutme.json","loaded-json1");
    displayJSON("aboutme_wrong.json","loaded-json2");
    displayRSSFeed();
});

function displayRSSFeed() {
    $('#rss_panel').rss("http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        {
            entryTemplate:'<li class="bg-light entry"><h4>{title}</h4><br/><h6>Author(s): {author}</h6>{shortBodyPlain}...<br/><a href="{url}">Link to article</a></li><hr>',
            tokens: {
                image: function(entry, tokens) {
                    console.log(entry);
                }
            }
        })
}

function displayJSON(file, className) {
    $.ajax({url: "./json_files/" + file, success: (result) => {
        $("." + className).addClass('bg-success');
        $("." + className).html("The persons name is: " + result.name + " they are " + result.age + " years old and is from " + result.pob);
        console.log("Complete")
    }}).fail((result) => {
        $("." + className).addClass('bg-danger');
        $("." + className).html("Error Serving JSON file: " + file);
    });
}

function changeTextData(value) {
    var textOutputDiv = $(".loaded-text-file");

    if(textOutputDiv.hasClass('display-none')) {
        textOutputDiv.removeClass('display-none');
    }

    switch(value) {
        case 'name':
            $.ajax({url: "./text_files/name.txt", success: (result) => {
                $(".loaded-text-file").html(result);
            }});
            break;
        case 'age':
            $.ajax({url: "./text_files/age.txt", success: (result) => {
                $(".loaded-text-file").html(result);
            }});
            break;
        case 'birth_place':
            $.ajax({url: "./text_files/placeofbirth.txt", success: (result) => {
                $(".loaded-text-file").html(result);
            }});
            break;
        case 'birthdate':
            $.ajax({url: "./text_files/dateofbirth.txt", success: (result) => {
                $(".loaded-text-file").html(result);
            }});
            break;
        default:
            break;
    }
}