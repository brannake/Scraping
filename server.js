var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Requiring our Note and Article models
var Note = require("./app/models/Note.js");
var Article = require("./app/models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// Make public a static dir
app.use(express.static("app/public"));
// Database configuration with mongoose
mongoose.connect("mongodb://<Kevin>:<donk>@ds159013.mlab.com:59013/heroku_crm3kbnl");
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});
// Routes
// ======
// A GET request to scrape the echojs website
app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});
// This will get the articles we scraped from the mongoDB
app.get("/all", function(req, res) {
  request("http://www.reddit.com/r/politics", function(error, response, html) {
    
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);
    
      // An empty array to save the data that we'll scrape
      var result = {};
    
      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("a.title").each(function(i, element) {
    
        result.link = $(element).attr("href");
        result.title = $(element).text();
    
        var entry = new Article(result);
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
      });
    })
  })
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
})