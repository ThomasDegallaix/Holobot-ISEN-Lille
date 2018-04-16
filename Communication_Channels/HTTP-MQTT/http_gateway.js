/* Config Internet */
//Kokosy's knights
//ILoveRobotic
/* End Config Internet */

/*  Configure all package necessary for server  */

'use strict';
const MQTT = require('mqtt');
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('/home/pi/Desktop/HTTP-MQTT_GATEWAY/setup.json', 'utf8'));
const mqttClient = MQTT.connect(setup.mqtt);
const request = require('request');
const dataEvents = require('./onDataEvents');
var net = require('net');

/*  Store IP adress of Host and listening port  */

// Honor 38
//var svraddr = '192.168.43.137';
//var svrport = 8080;

// Kokosy's knights
var svraddr = '192.168.0.113';
var svrport = 8080;

/*  Array to store all sockets  */
var sockets = [];

/*  Initialisation of Server, to handle all clients events  */
var svr = net.createServer(function(sock) {
    console.log('Connected: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    initSockConnect(sock);

    sock.on('data', function(data) {  /*  Server receive command from client  */
      /*    LIST OF ACTIONS FOR MOBILE CLIENT    */
      if(data.toString().indexOf('controlRobot:') !== -1){
        dataEvents.controlRobot(data, sock, fs, mqttClient, request, setup);
      }else if(data.toString() == 'onSequenceActivityRequest'){  /*  Case where user ask for Sequences List */
        dataEvents.sendSequences(sock,fs);
      }else if(data.toString().indexOf("sequenceName:") !== -1){  /*  Case where user ask for actions for a sequence  */
        dataEvents.sendActionsForSequence(sock, data, fs);
      }else if(data.toString().indexOf('newSequence') !== -1){  /*  Case where user wants add sequence to Database */
        dataEvents.newSequence(sock, data, fs);
      }else if(data.toString().indexOf('sequenceNameDefault') !== -1){ /*  Change Main Sequence in Json  */
        dataEvents.selectDefaultSequence(sock, data, fs);
      }else if(data.toString().indexOf('sequenceNameSelected:') !== -1){ /*  Change Main Sequence in Json  */
        dataEvents.executeSequence(sock, data, fs, request);
      }else if(data.toString() == 'onRobotActivityRequest'){/* Sends list of robot to the client */
        dataEvents.sendRobots(sock, data, fs);
      }else if(data.toString().indexOf('robotSelected:') !== -1){ // TODO : Save robot in JSON with IP user
        dataEvents.saveRobot(sock, data, fs);
      }
      /*    END OF ACTIONS FOR MOBILE CLIENT    */
    });

    sock.on('error', function(err){  /*  User sends us an error, we print it */
      console.log("Error: "+err.message);
    });

    sock.on('end', function() {  /*  User disconnect from server   */
        console.log('Disconnected: ' + sock.remoteAddress + ':' + sock.remotePort);
        var idx = sockets.indexOf(sock);
        if (idx != -1) {
            sockets.splice(idx, 1);
        }
    });
});

/*  Check Stations whose are not working  */
function checkStations() {
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    for (var i = 0; i < arrayOfObjects.ipStations.length; i++) {
      console.log('Request sends to :' + arrayOfObjects.ipStations[i].ip);
      request('http://'+arrayOfObjects.ipStations[i].ip+'/?action=[3]', { json: false }, (err, res, body) => {
        if (err) { console.log("Station number "+i+" is not disconnected!"); }
        console.log(body);
        if(body == "Task Finished"){
          console.log(sockets.length);
          for (var i = 0; i < sockets.length; i++) {
            var message = "Finished: "+arrayOfObjects.ipStations[i].ip;
            sockets[i].write(message);
            console.log(message);
          }
        }
      });
    }
  });
}

/*  Send main sequence to the robot  */
function sendMainSequence() {
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);;
    for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
      if(arrayOfObjects.sequences[i].isMain == true){
        var action = '[';
        for(var j = 0; j < arrayOfObjects.sequences[i].stations.length; j++){
          if(j == arrayOfObjects.sequences[i].stations.length-1){
            action += arrayOfObjects.sequences[i].stations[j];
          }else{
            action += arrayOfObjects.sequences[i].stations[j]+',';
          }
        }
        action += ']';
        console.log('Action sends: '+action);
        /* TODO: Rajouter un for pour envoyer à chaque Robot  */
        request('http://'+ROBOT_ISEN_IP+'/?action='+action, { json: false }, (err, res, body) => {
          if (err) { console.log(err); }
          console.log(body);
        });
      }
    }
  });
}

function initSockConnect(sock) {
  var newUser = {
    address: sock.remoteAddress,
    robotSelected: "robot ISEN 1"
  };

  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var insert = true;
    var arrayOfObjects = JSON.parse(data);
    for (var i = 0; i < arrayOfObjects.ipClients.length; i++) {
      if(arrayOfObjects.ipClients[i].address == newUser.address){
        insert = false;
      }
    }
    if(insert){
      arrayOfObjects.ipClients.push(newUser);
      fs.writeFileSync('database.json', JSON.stringify(arrayOfObjects,null,4));
    }
  });
}

/*  Partie envoi automatique à l'ESP8266  */

/* Ask Stations if their work is finish every minutes */
//setInterval(checkStations, 1000*60);

/* Send main Sequence to the ESP8266  */
//setInterval(sendMainSequence, 1000*20);
// Set Interval à modifier, dans une version finale, rajouter une deuxième entité qui permettrait dexecuter les actions, et celles ci qui reçoit et stocke ces activités
/*  Fin envoi automatique à l'ESP8266   */

/*  Begin listening of the port  */
svr.listen(svrport, svraddr);
console.log('Server Created at ' + svraddr + ':' + svrport + '\n');
