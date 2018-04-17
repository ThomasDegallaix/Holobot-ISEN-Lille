
//Message du README initial de la matrix

This is your app folder. Please only change app.js and config.yaml.

Do not modify index.js.

You may add packages via `npm`, they will be installed when the application is deployed to a device. 

## Developer Documentation

http://github.io/matrix-io/matrix-documentation/


//Message pour le projet Holobot Isen Lille 2017/2018

Pour l'installation des modules nécessaire pour la matrix, suivez précautionneussement les étapes de ce lien :
https://matrix-io.github.io/matrix-documentation/matrix-os/getting-started/installation/

Placez le dossier testApp.matrix dans le dossier matrix-os/apps

Tapez les commandes suivantes dans l'invite de commande de la raspberry pi
	source .envrc
	NODE_ENV=rc START_APP=testApp node /home/pi/matrix-os/index.js

et l'application est lancée

Lien vers tuto permettant de pouvoir lancer l'appliation au démarrage
https://www.pihomeserver.fr/2013/05/27/raspberry-pi-home-server-lancer-un-programme-automatiquement-au-demarrage/