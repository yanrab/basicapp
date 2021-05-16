var express = require('express');
var app = express();

var PORT = process.env.PORT || 5000;

app.get('/*', function (req, res) {
  res.sendFile(__dirname + req.url);
});

app.listen(PORT, function () {
  console.log('Basic App listening on port' + PORT);
});