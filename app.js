//jshint  esversion: 6

//declaring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//need it to fetch data from signup page
app.use(bodyParser.urlencoded({
  extended: true
}));

//need following line to use local declarations as css file
app.use(express.static("public"));

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  //console.log(firstName + "/" + lastName + "/" + email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  var jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/363c7e3548";
  const options = {
    method: "POST",
    auth: "authUser:6bea3b5a7304025ca6c43baef92b033c-us21"
  }
  //res.send();
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      //res.send("Successfully subscribed!");
      res.sendFile(__dirname + "/success.html");
    } else {
      //res.send("There was an error with signing up. Please try again!");
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));

    });
  });

  request.write(jsonData);
  request.end();
});



app.post("/failure", function(req, res) {
  res.redirect("/");
})

//mailchimp key
//  6bea3b5a7304025ca6c43baef92b033c-us21
//mailchimp audience list key
//  363c7e3548





//Testing app function
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
})
