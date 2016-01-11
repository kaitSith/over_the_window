var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var ini = 0;
var id = [];
var chk = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// 接続した時
io.on('connection', function(socket){
  id.push(socket.id);
  ++count;
  socket.emit('connected', count);
  io.emit('total', count);

  console.log(socket.id + ' connected');

  socket.on('next', function(pos){
  	++ini;
  	socket.to(id[ini]).emit('setball', pos);
  });


  // 切断した時
  socket.on('disconnect', function(){
  	console.log('user disconnected');
    count--;
    io.emit('disconnected');
    io.emit('total', count);
  });
  socket.on('refresh', function(num){

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});