// express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// socket io
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 12345);

// routing socket io events
var ConnectionManager = require('./js/connectionManager');
var connectionManager = new ConnectionManager(4);

// used to socketio emit to players
var Notifier = require('./js/notifier');
var notifier = new Notifier(io);

io.on('connection', function onConnection(socket) {

  var joinObj = {};

  socket.on('join', function onJoin (joinRequest) {
    joinObj = connectionManager.join(socket.conn.id);
    notifier.joined(joinObj.player, joinObj.room);
  });

  socket.on('disconnect', function onDisconnection () {
    connectionManager.leave(socket.conn.id);
    notifier.left(socket.conn.id, joinObj.room || {}); // never had a room
  });
});
