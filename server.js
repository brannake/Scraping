// Students: Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");

var PORT = process.env.PORT || 3000;


var app = express();
app.use(express.static("app/public"));

// Use mongojs to hook the database to the db variable
var db = mongojs("mongodb://<Kevin>:<donk>@ds159013.mlab.com:59013/heroku_crm3kbnl", "articles");


db.on("error", function(error) {
  console.log("Database Error:", error);
});

// TODO: Make four routes that display results from your zoo collection

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/all", function(req, res) {

  request("http://www.reddit.com/r/politics", function(error, response, html) {
    
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);
    
      // An empty array to save the data that we'll scrape
      var results = [];
    
      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("a.title").each(function(i, element) {
    
        var link = $(element).attr("href");
        var title = $(element).text();
    
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          link: link
        });
      });
      console.log(results);
    
      db.articles.insert({results});
      });

    db.articles.find({}, function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  });

// 2: Name: Send JSON response sorted by name in ascending order
app.post("/api/comment", function(req, res) {
	res.sendFile(path.join(__dirname, "../public/index.html"));
    }
  );

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });