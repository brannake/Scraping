// Students: Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");

var app = express();

var databaseUrl = "zoo";
var collections = ["animals"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// Make a request call to grab the HTML body from the site of your choice
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
  db.animals.insert({results});
  });

// Initialize Express

// Database configuration
// Save the URL of our database as well as the name of our collection

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// TODO: Make four routes that display results from your zoo collection

// 0: Root: Displays a simple "Hello World" message (no mongo required)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// 1: All: Send JSON response with all animals
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.animals.find({}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(data);
    }
  });
});

// 2: Name: Send JSON response sorted by name in ascending order
app.get("/name", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.animals.find({}).sort({name: 1}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(data);
    }
  });
});

// 3: Weight: Send JSON response sorted by weight in descending order
app.get("/weight", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.animals.find({}, {"weight": 1}).sort({"weight": 1})
  }, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(data);
    }
  });

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
