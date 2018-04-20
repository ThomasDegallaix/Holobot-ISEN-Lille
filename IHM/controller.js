const NET = require('net');
var client = new NET.Socket();
var http = require('http');
var fs = require('fs');

client.connect(8080, '192.168.0.113', function(){
  console.log('Connected');
  client.write('robotSelected:Hexapod 1');
});

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {

    console.log('Un client est connecté !');

    socket.on('message0',function(message){
      stop();
    });
    socket.on('message1',function(message){
      stepForward();
    });
    socket.on('message2',function(message){
      stepBackward();
    });
    socket.on('message3',function(message){
      stepLeft();
    });
    socket.on('message4',function(message){
      stepRight();
    });
    socket.on('message5',function(message){
      standUp();
    });
    socket.on('message6',function(message){
      sitDown();
    });
    socket.on('message7',function(message){
      changeButtonMode();
    });
    socket.on('message8',function(message){
      demo1();
    });
});


server.listen(8080);


function stepForward(){
  console.log('Forward');
  client.write('controlRobot:1');
}
function stop(){
  console.log('Stop');
  client.write('controlRobot:0');
}
function stepBackward(){
  console.log('Backward');
  client.write('controlRobot:2');
}
function stepRight(){
  console.log('Right');
  client.write('controlRobot:3');
}
function stepLeft(){
  console.log('Left');
  client.write('controlRobot:4');
}
function standUp(){
  console.log('up')
  client.write('controlRobot:5')
}
function sitDown(){
  console.log('Down');
  client.write('controlRobot:6');
}
function changeButtonMode(){
  console.log('Changing button mode');
  client.write('controlRobot:7');
}
function demo1(){
  console.log('Demo1');
  client.write('controlRobot:8');
}

// 0 arret
// 1 en avant
// 2 en arriere
// 4 gauche
// 3 droite
// 5 up
// 6 down
// 7 mode
// 8 demo