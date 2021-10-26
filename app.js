const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var XMLHttpRequest = require('xhr2');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

var year;
var month;
var img;
var value = 2
var requestedNumber = parseFloat(value, 10);
var addOne = parseFloat(1);

var arrayOfNum = [];
for(var i=0; i<2600; i++){
  arrayOfNum.push(0);
}

var altTranscript = "This comic does not have a transcript. Hence, I will yet again try to be funny. Why did the chicken cross the road? To become a Full-Stack Developer with expertise in server-side functionalities and application design.";

var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};



app.get("/", function(req, res) {

  getJSON('https://xkcd.com/info.0.json',
    function(err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        res.render("home", {
          year: data.year,
          month: data.month,
          img: data.img,
          day: data.day,
          transcript: data.transcript,
          title: data.title
        });
      }
    });
});

app.post("/", function(req, res) {

  if (req.body.random) {
    requestedNumber = Math.floor((Math.random() * 2500) + 1);;
    res.redirect("/id/" + requestedNumber);
  }

});


app.get("/id/:postId", function(req, res) {
  requestedNumber = req.params.postId;
  var url = "https://xkcd.com/" + requestedNumber + "/info.0.json";
  getJSON(url,
    function(err, data) {
      arrayOfNum[requestedNumber] = arrayOfNum[requestedNumber] + 1;
      var transcript = data.transcript;
      if(transcript){
        for (var i = 0; i < transcript.length; i++) {
          transcript = transcript.replace("[", "");
          transcript = transcript.replace("]", "");
          transcript = transcript.replace("{", "");
          transcript = transcript.replace("}", "");
        }
      } else {
        transcript = altTranscript;
      }
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        res.render("pages", {
          year: data.year,
          month: data.month,
          img: data.img,
          day: data.day,
          transcript: transcript,
          num: data.num,
          title: data.title,
          count: arrayOfNum[requestedNumber]
        });
      }
    });
});

app.post("/id/:postId", function(req, res) {

  if (req.body.previous) {
    requestedNumber = requestedNumber - 1;
    if (requestedNumber == 0) {
      requestedNumber = 1
      res.redirect("/");
    } else {
      res.redirect("/id/" + requestedNumber);
    }
  }

  if (req.body.next) {
    requestedNumber = requestedNumber - (-1);
    if (requestedNumber == 2532) {
      requestedNumber = 1
      res.redirect("/");
    } else {
      res.redirect("/id/" + requestedNumber);
    }
  }

  if (req.body.random) {
    requestedNumber = Math.floor((Math.random() * 2500) + 1);;
    res.redirect("/id/" + requestedNumber);
  }

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
