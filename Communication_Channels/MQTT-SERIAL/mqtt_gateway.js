'use strict';
const MQTT = require('mqtt');
const SerialPort = require('serialport');
const FS = require('fs');
const setup = JSON.parse(FS.readFileSync('/home/pi/Documents/HOLOBOT_RPI/MQTT-SERIAL_GATEWAY/setup.json','utf8'));
const mqtt = MQTT.connect(setup.mqtt);
console.log("Launching gateway ...\n");	

/* /!\/!\/!\ You need to plug the hexapod on the first usb port and the arm + head on the second usb because serial1 is configured to have a baudrate at 38400 which is specified only for the hexapod /!\/!\/!\ */

const serial1 = new SerialPort(setup.port1, {baudRate: setup.rate1}); 
const serial2 = new SerialPort(setup.port2, {baudRate: setup.rate2});

/*
var portSerial1;
var portSerial2;

//Sometimes, the second device doesn't use the ACM1 Serial port but the ACM2 instead, we need to take care of this case.
SerialPort.list(function (err, ports) {
	ports.forEach(function(port) {
		if (port.comName === '/dev/ttyACM0') {
			portSerial1 = port.comName.toString();
			console.log("Device 1 plugged on serial port " + port.comName + "\n");
		}
		else if (port.comName === '/dev/ttyACM1') {
			portSerial2 = port.comName.toString();
			console.log("Device 2 plugged on serial port " + port.comName + "\n");
		}
		else if (port.comName === '/dev/ttyACM2'){
			portSerial2 = port.comName.toString();
			console.log("Device 2 plugged on serial port " + port.comName + "\n");
		}
	});
	var serial1 = new SerialPort(portSerial1, {baudRate: setup.rate1}); 
	var serial2 = new SerialPort(portSerial2, {baudRate: setup.rate2});
});
*/

//*****************************Serial listener (serial --> MQTT)***********************************

if(typeof(serial1) != "undefined") {

	const ReadLineItf = require('readline').createInterface;
	const serialReader = ReadLineItf( {
		input : serial1
	});

	serialReader.on('line', function(value) {
		console.log('out --> [' + value + ']');
		mqtt.publish(setup.tout, value, {qos: setup.qos});
	});
}






//****************************MQTT subscriber (MQTT --> serial)**********************************

function arbotix_checksum(data_packet) {
	var checksum = 0;
	var sum = 0; 
	for(var i in data_packet) {
		sum = sum + data_packet[i];
	}
	return checksum = 255 - sum;
}

function empty_data(hexapod_data) {
	hexapod_data[0] = 0xFF;
	hexapod_data[1] = 0x80;
	hexapod_data[2] = 0x80;
	hexapod_data[3] = 0x80;
	hexapod_data[4] = 0x80;
	hexapod_data[5] = 0x00;
	hexapod_data[6] = 0x00;
	hexapod_data[7] = 0xEF;

	return hexapod_data;
}

mqtt.on('connect', function() {
	mqtt.subscribe(setup.tin);
});

var intervalID;


//une thread est créée par événement
mqtt.on('message', function(topic, message) {
	console.log("<<< Message received on topic robot/in >>>");
	//Stop l'envoi du message précédent lors de la réception d'un nouveau message
	clearInterval(intervalID);
	var buffer = message.toString();
	console.log('[' + buffer + '] -- > in \n');
	let data_packet = JSON.parse(buffer);
	
	if(data_packet.receiver === "HEXAPOD_ID") {
		console.log("<<< Message from Hololens to Hexapod >>>\n");
		var hexapod_func = data_packet.body_message.func;
		var 	hexapod_data = new Buffer(8);
		hexapod_data[0] = 0xFF;
		hexapod_data[1] = data_packet.body_message.parameters.V_right_joystick;
		hexapod_data[2] = data_packet.body_message.parameters.H_right_joystick;
		hexapod_data[3] = data_packet.body_message.parameters.V_left_joystick;
		hexapod_data[4] = data_packet.body_message.parameters.H_left_joystick;
		hexapod_data[5] = data_packet.body_message.parameters.buttons;
		hexapod_data[6] = 0x00;
		hexapod_data[7] = arbotix_checksum(data_packet.body_message.parameters);
/*
		if (hexapod_func === "hexapodUpDown"  ||  hexapod_func === "hexapodMode") {
			//The data has to be sent only 1 time 
			serial1.write(hexapod_data);
			console.log(hexapod_data);
			//Then we send neutral datapackets
			var hexapod_data = empty_data(hexapod_data);
			intervalID = setInterval(function() {
				serial1.write(hexapod_data);
				console.log(hexapod_data);
				}, 33);		
		}
		else  {*/
			//The data has to be sent every 33ms for every movement function
			intervalID = setInterval(function() {
				serial1.write(hexapod_data);
				console.log(hexapod_data);
				}, 33);	
		//}
					
	}

	else if(data_packet.receiver === "ARM_ID") {
		console.log("<<< Message from Hololens to Robot Arm >>>\n");
		var robotArm_data = data_packet.body_message.func;
		console.log(robotArm_data);
		serial2.write(robotArm_data);
	}
});



