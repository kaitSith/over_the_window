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
  if(id.indexOf(socket.id) === -1){
    id.push(socket.id);
  }
  ++count;
  socket.emit('connected', count);
  io.emit('total', count);

  socket.on('next', function(pos){
  	++ini;
  	socket.to(id[ini]).emit('setball', pos);
  });


  // 切断した時
  socket.on('disconnect', function(){
    count--;
    io.emit('disconnected');
    io.emit('total', count);
  });
  // 切断した際
  socket.on('refresh', function(num){
    chk.push(id[num]);
    socket.to(chk[chk.length - 1]).emit('setnum', chk.length - 1);
    if(id.length - 1 === chk.length){
      id = chk;
      chk = [];
    }
  });
});

http.listen(3000, function(){
});