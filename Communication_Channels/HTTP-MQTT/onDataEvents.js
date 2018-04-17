/* Creation of messages for Hexapod*/
var dataPacketGoForward = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodGoForward",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 128,
      "V_left_joystick" : 254,
      "H_left_joystick" : 128,
      "buttons" : 0
    }
  }
};

var dataPacketGoBackword = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodGoBackward",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 128,
      "V_left_joystick" : 1,
      "H_left_joystick" : 128,
      "buttons" : 0
    }
  }
};

var dataPacketGoLeft = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodGoLeft",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 1,
      "V_left_joystick" : 128,
      "H_left_joystick" : 128,
      "buttons" : 0
    }
  }
};

var dataPacketGoRight = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodGoRight",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 254,
      "V_left_joystick" : 128,
      "H_left_joystick" : 128,
      "buttons" : 0
    }
  }
};

var dataPacketUp = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodUpDown",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 128,
      "V_left_joystick" : 128,
      "H_left_joystick" : 128,
      "buttons" : 16
    }
  }
};

var dataPacketChangeColor = {
  "receiver" : "MATRIX_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "changeColor",
    "parameters":
    {
      "R" : 128,
      "G" : 128,
      "B" : 128
    }
  }
};

var dataPacketRobotArm = {
  "receiver" : "ARM_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "handshake"
  }
};


var dataPacketSTOP = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodStop",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 128,
      "V_left_joystick" : 128,
      "H_left_joystick" : 128,
      "buttons" : 0
    }
  }
};

var dataPacketModeButton = {
  "receiver" : "HEXAPOD_ID",
  "sender" : "HOLOLENS_ID",
  "body_message":
  {
    "func" : "hexapodMode",
    "parameters":
    {
      "V_right_joystick" : 128,
      "H_right_joystick" : 128,
      "V_left_joystick" : 128,
      "H_left_joystick" : 128,
      "buttons" : 128
    }
  }
};


// Here we change our JSONs to strings
var dataPacketUpJSON = JSON.stringify(dataPacketUp);
var dataPacketGoForwardJSON = JSON.stringify(dataPacketGoForward);
var dataPacketGoBackwardJSON = JSON.stringify(dataPacketGoBackword);
var dataPacketGoLeftJSON = JSON.stringify(dataPacketGoLeft);
var dataPacketGoRightJSON = JSON.stringify(dataPacketGoRight);
var dataPacketStopJSON = JSON.stringify(dataPacketSTOP);
var dataPacketHandJSON = JSON.stringify(dataPacketRobotArm);
var dataPacketChangeColorJSON = JSON.stringify(dataPacketChangeColor);
var dataPacketModeJSON = JSON.stringify(dataPacketModeButton);

/* End of our message creation */

/* Methods for data gestion */
function controlRobot(data, sock, fs, mqttClient, request, setup) {
  console.log("here");
  var array = data.toString().split(':');
  var robotControlled;
  var ipRobotControlled;
  var robotType;
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    for (var i = 0; i < arrayOfObjects.ipClients.length; i++) {
      console.log(arrayOfObjects.ipClients[i].address);
      if(sock.remoteAddress == arrayOfObjects.ipClients[i].address){
        robotControlled = arrayOfObjects.ipClients[i].robotSelected;
      }
    }
    for (var i = 0; i < arrayOfObjects.ipRobots.length; i++) {
      if(robotControlled == arrayOfObjects.ipRobots[i].robotName){
        ipRobotControlled = arrayOfObjects.ipRobots[i].ip;
        robotType = arrayOfObjects.ipRobots[i].robotType;
      }
    }
    console.log(ipRobotControlled+" "+robotType);
    if(robotType == 1){
      console.log('Control ' + array[1]);
      switch(array[1]) {
        case '0':
          mqttClient.publish(setup.tin, dataPacketStopJSON, {qos: setup.qos});
          break;
        case '1':
          console.log('avance');
          mqttClient.publish(setup.tin, dataPacketGoForwardJSON, {qos: setup.qos});
          break;
        case '2':
          mqttClient.publish(setup.tin, dataPacketGoBackwardJSON, {qos: setup.qos});
          break;
        case '3':
          mqttClient.publish(setup.tin, dataPacketGoLeftJSON, {qos: setup.qos});
          break;
        case '4':
          mqttClient.publish(setup.tin, dataPacketGoRightJSON, {qos: setup.qos});
          break;
        case '5':
          mqttClient.publish(setup.tin, dataPacketUpJSON, {qos: setup.qos});
          setTimeout(function(){mqttClient.publish(setup.tin, dataPacketStopJSON,{qos: setup.qos});},1000);
          break;
        default:
          console.log("Not Implement yet!");
      }
    }else if(robotType == 0) {
      console.log('Control ' + robotControlled);
      request('http://'+ipRobotControlled+'/?action=['+array[1]+']', { json: false }, (err, res, body) => {
        if (err) { console.log(err); }
        console.log(body);
      });
    }
  });
}

function executeSequence(sock, data, fs, request) {
  var array = data.toString().split(':');
  if(array[1] != 'Sélectionnez une séquence...'){
    console.log('Execute Sequence on Robot: ' + array[1]);
    fs.readFile('database.json', 'utf-8', function(err, data) {
      if (err) throw err;
      var robotControlled;
      var ipRobotControlled;
      var robotType;
      var arrayOfObjects = JSON.parse(data);
      for (var i = 0; i < arrayOfObjects.ipClients.length; i++) {
        console.log(arrayOfObjects.ipClients[i].address);
        if(sock.remoteAddress == arrayOfObjects.ipClients[i].address){
          robotControlled = arrayOfObjects.ipClients[i].robotSelected;
        }
      }
      for (var i = 0; i < arrayOfObjects.ipRobots.length; i++) {
        if(robotControlled == arrayOfObjects.ipRobots[i].robotName){
          ipRobotControlled = arrayOfObjects.ipRobots[i].ip;
          robotType = arrayOfObjects.ipRobots[i].robotType;
        }
      }
      for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
        if(arrayOfObjects.sequences[i].name == array[1]){
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
          request('http://'+ipRobotControlled+'/?action='+action, { json: false }, (err, res, body) => {
            if (err) { console.log(err); }
            console.log(body);
          });
        }
      }
      fs.writeFileSync('database.json', JSON.stringify(arrayOfObjects,null,4));
    });
  }
}

function newSequence(sock, data, fs) {
  // TODO : Add sequence, receive like that: newSequence:name:true:1:2:3:0:1:0
  var array = data.toString().split(':');
  var nName = array[1];
  var nIsMain;
  if(array[2] == 'false'){
    nIsMain = false;
  } else {
    nIsMain = true;
  }
  var nActions = [];
  for (var i = 3; i < array.length; i++) {
    nActions.push(parseInt(array[i]));
  }
  var newSequence = {
    name: nName,
    stations: nActions,
    isMain: nIsMain
  };
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    if(nIsMain == true){
      for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
        if(arrayOfObjects.sequences[i].isMain == true){
          arrayOfObjects.sequences[i].isMain = false;
        }
      }
    }
    arrayOfObjects.sequences.push(newSequence);
    fs.writeFileSync('database.json', JSON.stringify(arrayOfObjects,null,4));
  });
}

function sendSequences(sock, fs) {
  console.log("Asks for Sequences : ");
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    var arrayOfSequences = 'Sélectionnez une séquence.../';
    var idx = 0;
    for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
      arrayOfSequences += arrayOfObjects.sequences[i].name + "/";
    }
    console.log(arrayOfSequences);
    sock.write(arrayOfSequences+'\n');
  });
}

function sendActionsForSequence(sock, data, fs) {
  console.log('Ask for sequence\'s actions ');
  var array = data.toString().split(':');
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var myActions = 'sequence/';
    var arrayOfObjects = JSON.parse(data);
    for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
      if(arrayOfObjects.sequences[i].name == array[1]){
        for (var j = 0; j < arrayOfObjects.sequences[i].stations.length; j++) {
          myActions += arrayOfObjects.sequences[i].stations[j] + '/';
        }
      }
    }
    console.log(myActions);
    sock.write(myActions+'\n');
  });
}

function selectDefaultSequence(sock, data, fs) {
  var array = data.toString().split(':');
  if(array[1] != 'Sélectionnez une séquence...'){
    console.log('Modify main sequence');
    fs.readFile('database.json', 'utf-8', function(err, data) {
      if (err) throw err;
      var arrayOfObjects = JSON.parse(data);
      for (var i = 0; i < arrayOfObjects.sequences.length; i++) {
        if(arrayOfObjects.sequences[i].name != array[1] && arrayOfObjects.sequences[i].isMain == true){
          arrayOfObjects.sequences[i].isMain = false;
        }
        if(arrayOfObjects.sequences[i].name == array[1]){
          arrayOfObjects.sequences[i].isMain = true;
        }
      }
      fs.writeFileSync('database.json', JSON.stringify(arrayOfObjects,null,4));
    });
  }
}

function sendRobots(sock, data, fs) {
  console.log("Asks for Robots : ");
  fs.readFile('database.json', 'utf-8', function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    var arrayOfRobots = 'Sélectionnez un Robot.../';
    var idx = 0;
    for (var i = 0; i < arrayOfObjects.ipRobots.length; i++) {
      arrayOfRobots += arrayOfObjects.ipRobots[i].robotName + "/";
    }
    console.log(arrayOfRobots);
    sock.write(arrayOfRobots+'\n');
  });
}

function saveRobot(sock, data, fs) {
  var array = data.toString().split(':');
  console.log('Robot selected : ' + array[1]);
  if(array[1] != 'Sélectionnez un Robot...'){
    fs.readFile('database.json', 'utf-8', function(err, data) {
      if (err) throw err;
      var arrayOfObjects = JSON.parse(data);
      for (var i = 0; i < arrayOfObjects.ipClients.length; i++) {
        if(arrayOfObjects.ipClients[i].address == sock.remoteAddress){
          arrayOfObjects.ipClients[i].robotSelected = array[1];
        }
      }
      fs.writeFileSync('database.json', JSON.stringify(arrayOfObjects,null,4));
    });
  }
}
/* End Methods for data gestion */

module.exports.controlRobot = controlRobot;
module.exports.saveRobot = saveRobot;
module.exports.sendRobots = sendRobots;
module.exports.executeSequence = executeSequence;
module.exports.selectDefaultSequence = selectDefaultSequence;
module.exports.newSequence = newSequence;
module.exports.sendActionsForSequence = sendActionsForSequence;
module.exports.sendSequences = sendSequences;
