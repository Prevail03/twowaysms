// package used in creating this rest api in nodejs
var express = require('express');
// package used in parsing the payloads
var bodyParser = require('body-parser');
// package used in managing http connections
var http = require('http');
// used to open relative paths
var path = require('path');
// create an instance of express package
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// listen to api requests
///////////////////////////////////////////////////////////
// lipa na mpesa api requests
///////////////////////////////////////////////////////////
app.post('/', function (req, res) {
    

   // req.body

   res.end("Waiting for the next request!"); 
   console.log("Waiting for the next request!");
})


  //server listener
var server = http.createServer(app).listen(3000, "0.0.0.0" , function () {
  
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port);
});
