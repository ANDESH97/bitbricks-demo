var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));

app.get('/', function (req, res) {
  console.log("home");
  res.sendFile(path.join(__dirname + '/add-socials-popup.html'));
});

// app.get('/.well-known/apple-app-site-association', function (req, res) {

//   console.log("sending apple app site association file ...");
//   res.header('Content-Type', 'application/json');
//   // res.setHeader('Content-Type', 'application/json');
//   res.sendFile(path.join(__dirname + '/public/.well-known/apple-app-site-association'));
// });

app.listen(process.env.PORT || 7777);