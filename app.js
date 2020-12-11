var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', (socket)=>{
    console.log('a user connected');

    socket.on('bruh',(data)=>{
        console.log(data.message);
    });
});