var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');


var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
var totalusers = 0;


var cursors = {
  'cursors': []
};

router.use(express.static(path.resolve(__dirname, 'client')));


io.on('connection', function(socket) {


  socket.on('clientEvent', function(data) {//when it connects
    
    socket.emit('setusernum', {'totalusers': totalusers});//give client a usernum
    
    //make up rgb values
    var r = Math.floor(Math.random() * (255));
    var g = Math.floor(Math.random() * (255));
    var b = Math.floor(Math.random() * (255));

    socket.emit("colorset", {'r': r,'g': g, 'b': b });//send rgb values to client

    cursors.cursors = new Array(totalusers + 1);
    totalusers++;
  });
  socket.on('cursor', function(data) {//when server receives update on cursor...
    cursors.cursors[data.usernum] = (new Point(data.x, data.y, data.usernum, data.r, data.g, data.b));//
    // cursors.cursors.push(new Point(data.x, data.y));
  });
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});



function myFunction() {
  setTimeout(function() {
    io.sockets.emit('broadcast', cursors);
    myFunction();
  }, 100);
}


function Point(x, y, u, r, g, b) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.usernum = u;
}

myFunction();