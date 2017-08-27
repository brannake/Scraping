$(document).ready(function(){

    $("#onlyButton").click(function() {
        console.log("FUCK");
        $.get({
            url: "/all",
            method: "GET"
        }).done(function(response) {
            $("body").html("");
            console.log(response);
            for (i=0; i < response.length; i++) {
                var title = $("<div>"+response[i].results[i].title+"</div>");
                var link = $("<a>link</a>").attr("href", response[i].results[i].link);
                var commentButton = $("<button type='button' id='comment"+i+"'>Comment</button>");
                $("body").append(title);
                $("body").append(link);
                $("body").append(commentButton);
                }
            });
        });
    });
