var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client'));

server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', (socket)=>{
    console.log('a user connected');
    console.log(socket.id)
    socket.on('debug',(data)=>{
        console.log(data);
    });
});



console.log('un momento bruh')