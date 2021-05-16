var express = require('express');
var app = express();
const path = require('path');

var PORT = process.env.PORT || 5000;


//app.use('/', express.static(path.join(__dirname + '/webapp')));
//express.static(path.join(__dirname + '/webapp'));

 app.get('/*', function (req, res) {
   res.sendFile(__dirname + "/webapp/" + req.url);  
 });


app.listen(PORT, function () {
  console.log('Basic App listening on port ' + PORT);
});