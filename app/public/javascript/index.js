function addCommentEventListener(button) {
    $(button).click(function() {
        var comment = $(this).attr("id")
        var number = comment[comment.length -1];
        var commentForm = $("<form>Your Stupid Comment:<br><input type='text' id='commentForm"+number+"' name='commentField'></form>");
        var commentSubmitButton = $("<button type='button' id='commentsubmit"+number+"'>Submit</button>");
        $("#container"+number).append(commentForm);
        $("#container"+number).append(commentSubmitButton);
    })
}

function addCommentSubmitEventListener() {

}

function apiCalltoPostComment(number) {
    $.post({
        url: "/api/comment",
        method: "POST",
        data: "hello"
    }).done(function(response) {
        console.log(response);
    })
}

$(document).ready(function(){

    $("#onlyButton").click(function() {
        console.log("fuck");
        $.get({
            url: "/all",
            method: "GET"
        }).done(function(response) {
            $("body").html("");
            console.log(response);
            for (i=0; i < response.length; i++) {
                if (response[i].results[i] === undefined) {
                } else {
                    var container = $("<div></div>").attr("id", "container"+i);
                    console.log(response[i].results[i]);
                    var title = $("<div>"+response[i].results[i].title+"</div>");
                    var link = $("<a>link</a>").attr("href", response[i].results[i].link);
                    var commentButton = $("<button type='button' id='comment"+i+"'>Comment</button>");
                    $(container).append(title);
                    $(container).append(link);
                    $(container).append(commentButton);
                    $("body").append(container);
                    addCommentEventListener(commentButton);
                    }
                }
            });
        });
    });
