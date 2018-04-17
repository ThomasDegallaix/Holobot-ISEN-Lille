//Application Matrix Holobot Isen LLille 2017/2018

//initilisation MQTT
'use strict';
const MQTT = require('mqtt');
const mqtt = MQTT.connect("mqtt://127.0.0.1:1883");

//connexion MQTT
mqtt.on('connect', function() {
	mqtt.subscribe("robot/in");
});

//réception MQTT
mqtt.on('message', function(topic, message) {
	
	//récupération des messages stocké dans un buffer
	var buffer = message.toString();
	//pour débogage
	console.log('[' + buffer + '] -- > in');
	//conversion du buffer en JSON
	var data_packet = JSON.parse(buffer);

	//vérification que le message est bien pour la matrix
	if(data_packet.receiver === "MATRIX_ID") {
		console.log("<<< Message from Hololens to Matrix >>>");
		//2 fonctions sont possibles
		if(data_packet.body_message.func === "change_color") {
			console.log("<<< CHANGE COLOR >>>");
			//variables locales pour conversion du message RGB
			var R = data_packet.body_message.parameters.R;
			var G = data_packet.body_message.parameters.G;
			var B = data_packet.body_message.parameters.B;
			console.log(R,G,B);
			//matrix.led a comme paramètre un string, création du string
			var myString = 'rgb('+R+','+G+','+B+')';
			//fonction propre à la matrix pour changer de couleur
			matrix.led(myString).render();
		}
		//fonction ci-après est une fonction repris par l'application HelloWorld de la matrix
		if(data_packet.body_message.func === "arc_en_ciel") {
			var colors = [
			  '#ecff00',
			  '#c1ff00',
			  '#91ff00',
			  '#56ff00',
			  '#28ff00',
			  '#02ff00',
			  '#00ff1c',
			  '#00ff43',
			  '#00ff78',
			  '#00ffa7',
			  '#00ffd6',
			  '#00fff7',
			  '#00efff',
			  '#00c0ff',
			  '#008aff',
			  '#0052ff',
			  '#0024ff',
			  '#0001ff',
			  '#1b00ff',
			  '#4600ff',
			  '#7000ff',
			  '#a100ff',
			  '#cc00ff',
			  '#f000ff',
			  '#f000ff',
			  '#ff00bd',
			  '#ff008f',
			  '#ff004f',
			  '#ff0012',
			  '#ff0700',
			  '#ff2b00',
			  '#ff5c00',
			  '#ff9500',
			  '#ffcb00',
			  '#fff700',
			];
			
			var colorFill = [];//Second array to slowly fill iris with color
			var counter = 0;
			
			setInterval(function(){
				if(counter < 35){//Transfer colors over
						colorFill[counter] = colors[counter];
						counter++;
				}
				else{//Shift array for rotation effect
					colorFill.unshift(colorFill[34]);
					colorFill.pop();
				}
				matrix.led(colorFill).render();//Update current Lights
			}, 15);
		}
	}	
});