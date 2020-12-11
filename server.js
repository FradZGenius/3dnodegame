var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
// Create a new Express application
var app = express();



var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
    app.use(express.static('/client/index.html'));

});

io.on('connection', () =>{
    console.log('a user is connected')
})

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/client/index.html'));
});

// Instantiate Socket.IO hand have it listen on the Express/HTTP server
