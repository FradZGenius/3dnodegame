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

//un momento bruh

//|Proj ( T )| > |Proj ( WA*Ax )| + |Proj ( HA*Ay )| + |Proj( DA*Az )|
//+ |Proj ( WB*Bx )| + |Proj( HB*By )| + |Proj( DB*Bz )|

//15 total cases, L represents the axis
/*
L = Ax
L = Ay
L = Az
L = Bx
L = By
L = Bz
L = Ax X Bx
L = Ax X By
L = Ax X Bz
L = Ay X Bx
L = Ay X By
L = Ay X Bz
L = Az X Bx
L = Az X By
L = Az X Bz

The separating plane spans the axes, the axis is 
perpendicular to the plane, so you can just cross
the two axes to get the separating axis.

B must be a unit vector in order for the dot product
to be equal to the magnitude projection
*/